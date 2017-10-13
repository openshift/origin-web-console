'use strict';

/**
 * @ngdoc function
 * @name openshiftConsole.controller:AttachPVCController
 * @description
 * # CreateRouteController
 * Controller of the openshiftConsole
 */
angular.module('openshiftConsole')
  .controller('AttachPVCController',
              function($filter,
                       $routeParams,
                       $scope,
                       $window,
                       APIService,
                       AuthorizationService,
                       BreadcrumbsService,
                       DataService,
                       QuotaService,
                       Navigate,
                       NotificationsService,
                       ProjectsService,
                       StorageService,
                       RELATIVE_PATH_PATTERN) {
    if (!$routeParams.kind || !$routeParams.name) {
      Navigate.toErrorPage("Kind or name parameter missing.");
      return;
    }

    var supportedKinds = [
      'Deployment',
      'DeploymentConfig',
      'ReplicaSet',
      'ReplicationController'
    ];

    var humanizeKind = $filter('humanizeKind');
    if (!_.includes(supportedKinds, $routeParams.kind)) {
      Navigate.toErrorPage("Storage is not supported for kind " + humanizeKind($routeParams.kind) + ".");
      return;
    }

    var resourceGroupVersion = {
      resource: APIService.kindToResource($routeParams.kind),
      group: $routeParams.group
    };

    $scope.projectName = $routeParams.project;
    $scope.kind = $routeParams.kind;
    $scope.name = $routeParams.name;
    $scope.RELATIVE_PATH_PATTERN = RELATIVE_PATH_PATTERN;
    $scope.outOfClaims = false;

    $scope.attach = {
      persistentVolumeClaim: null,
      volumeName: null,
      mountPath: null,
      allContainers: true,
      containers: {}
    };

    $scope.breadcrumbs = BreadcrumbsService.getBreadcrumbs({
      name: $routeParams.name,
      kind: $routeParams.kind,
      namespace: $routeParams.project,
      subpage: 'Add Storage'
    });

    $scope.pvcVersion = APIService.getPreferredVersion('persistentvolumeclaims');
    var resourceQuotasVersion = APIService.getPreferredVersion('resourcequotas');
    var appliedClusterResourceQuotasVersion = APIService.getPreferredVersion('appliedclusterresourcequotas');

    ProjectsService
      .get($routeParams.project)
      .then(_.spread(function(project, context) {
        $scope.project = project;

        if (!AuthorizationService.canI(resourceGroupVersion, 'update', $routeParams.project)) {
          Navigate.toErrorPage('You do not have authority to update ' +
                               humanizeKind($routeParams.kind) + ' ' + $routeParams.name + '.', 'access_denied');
          return;
        }

        var orderByDisplayName = $filter('orderByDisplayName');
        var getErrorDetails = $filter('getErrorDetails');
        var generateName = $filter('generateName');

        var displayError = function(errorMessage, errorDetails) {
          $scope.disableInputs = true;
          NotificationsService.addNotification({
            id: "attach-pvc-error",
            type: "error",
            message: errorMessage,
            details: errorDetails
          });
        };

        var hideErrorNotifications = function() {
          NotificationsService.hideNotification("attach-pvc-error");
        };
        $scope.$on('$destroy', hideErrorNotifications);

        var navigateBack = function() {
          $window.history.back();
        };
        $scope.cancel = navigateBack;

        var isContainerSelected = function(container) {
          return $scope.attach.allContainers || $scope.attach.containers[container.name];
        };

        // Look at the existing mount paths so that we can warn if the new value is not unique.
        var updateMountPaths = function() {
          var podTemplate = _.get($scope, 'attach.resource.spec.template');
          $scope.existingMountPaths = StorageService.getMountPaths(podTemplate, isContainerSelected);
        };
        $scope.$watchGroup(['attach.resource', 'attach.allContainers'], updateMountPaths);
        $scope.$watch('attach.containers', updateMountPaths, true);

        var checkVolumeMountPath = function(newVolumeMount, container) {
          var duplicateMount = _.find(container.volumeMounts, function(mount) {
            return mount.mountPath === newVolumeMount && mount.name !== newVolumeMount.name;
          });

          // if a new volumeMount matches an existing mountPath,
          // fail if their names differ. This can happen when the
          // "overwrite" option is specified.
          if (duplicateMount) {
              displayError('The volume mount "' + duplicateMount.mountPath + '" with name "' + duplicateMount.name +'" already exists for container "' + container.name + '"');
              return false;
          }

          return true;
        };

        var replaceExistingVolumeMount = function(newVolumeMount, container) {
          // if the volume mount we are trying to add already exists,
          // replace the existing mount with the newly created one.
          // This can happen when the "overwrite" option is specified.
          var index = _.findIndex(container.volumeMounts, { name: newVolumeMount.name });
          if (index === -1) {
            return false;
          }

          container.volumeMounts[index] = newVolumeMount;
          return true;
        };

        var setVolumeMount = function(podTemplate, name, mountPath, subPath, readOnly) {
          var success = true;
          _.each(podTemplate.spec.containers, function(container) {
            if (!isContainerSelected(container)) {
              return;
            }

            var newVolumeMount =
              StorageService.createVolumeMount(name, mountPath, subPath, readOnly);
            if (!container.volumeMounts) {
              container.volumeMounts = [];
            }

            if (!checkVolumeMountPath(newVolumeMount, container)) {
              success = false;
              return false;
            }

            if (replaceExistingVolumeMount(newVolumeMount, container)) {
              return false;
            }

            container.volumeMounts.push(newVolumeMount);
          });

          return success;
        };

        // load resources required to show the page (list of pvcs and deployment or deployment config)
        var load = function() {
          DataService.get(resourceGroupVersion, $routeParams.name, context).then(
            function(resource) {
              $scope.attach.resource = resource;
              $scope.breadcrumbs = BreadcrumbsService.getBreadcrumbs({
                object: resource,
                project: project,
                subpage: 'Add Storage'
              });
              var podTemplate = _.get(resource, 'spec.template');
              $scope.existingVolumeNames = StorageService.getVolumeNames(podTemplate);
            },
            function(e) {
              displayError($routeParams.name + " could not be loaded.", getErrorDetails(e));
            }
          );

          DataService.list($scope.pvcVersion, context).then(function(pvcs) {
            $scope.pvcs = orderByDisplayName(pvcs.by("metadata.name"));
            if (!_.isEmpty($scope.pvcs) && !$scope.attach.persistentVolumeClaim) {
              $scope.attach.persistentVolumeClaim = _.head($scope.pvcs);
            }
          });

          DataService.list(resourceQuotasVersion, { namespace: $scope.projectName }, function(quotaData) {
            $scope.quotas = quotaData.by('metadata.name');
            $scope.outOfClaims = QuotaService.isAnyStorageQuotaExceeded($scope.quotas, $scope.clusterQuotas);
          });
          DataService.list(appliedClusterResourceQuotasVersion, { namespace: $scope.projectName }, function(quotaData) {
            $scope.clusterQuotas = quotaData.by('metadata.name');
            $scope.outOfClaims = QuotaService.isAnyStorageQuotaExceeded($scope.quotas, $scope.clusterQuotas);
          });

        };

        load();

        $scope.attachPVC = function() {
          $scope.disableInputs = true;
          hideErrorNotifications();

          if ($scope.attachPVCForm.$valid) {
            // generate a volume name if not provided
            if (!$scope.attach.volumeName) {
              $scope.attach.volumeName = generateName("volume-");
            }

            var resource = $scope.attach.resource;
            var podTemplate = _.get(resource, 'spec.template');
            var persistentVolumeClaim = $scope.attach.persistentVolumeClaim;
            var name = $scope.attach.volumeName;
            var mountPath = $scope.attach.mountPath;
            var subPath = $scope.attach.subPath;
            var readOnly = $scope.attach.readOnly;
            if (mountPath) {
              // for each container in the pod spec, add the new volume mount
              if(!setVolumeMount(podTemplate, name, mountPath, subPath, readOnly)) {
                $scope.disableInputs = false;
                return;
              }
            }

            // add the new volume to the pod template
            var newVolume = StorageService.createVolume(name, persistentVolumeClaim);
            if (!podTemplate.spec.volumes) {
              podTemplate.spec.volumes = [];
            }

            // if the newly created volume already exists, only
            // fail if the "overwrite" option was not set
            var volumeExists = _.some(podTemplate.spec.volumes, { name: newVolume.name });

            if (!volumeExists) {
              podTemplate.spec.volumes.push(newVolume);
            }

            DataService.update(resourceGroupVersion, resource.metadata.name, $scope.attach.resource, context).then(
              function() {
                var details;
                if (!mountPath) {
                  // FIXME: This seems like a bad experience since we don't give users a way to mount it later.
                  details = "No mount path was provided. The volume reference was added to the configuration, but it will not be mounted into running pods.";
                }
                NotificationsService.addNotification({
                  type: "success",
                  message: "Persistent volume claim " + persistentVolumeClaim.metadata.name + " added to " + humanizeKind($routeParams.kind) + " " + $routeParams.name + ".",
                  details: details
                });
                navigateBack();
              },
              function(result) {
                displayError("An error occurred attaching the persistent volume claim to the " + humanizeKind($routeParams.kind) + ".", getErrorDetails(result));
                $scope.disableInputs = false;
              }
            );
          }
        };
    }));
  });
