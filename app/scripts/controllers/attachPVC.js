'use strict';

/**
 * @ngdoc function
 * @name openshiftConsole.controller:CreateRouteController
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
                       Navigate,
                       ProjectsService,
                       StorageService) {
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

    if (!_.includes(supportedKinds, $routeParams.kind)) {
      Navigate.toErrorPage("Storage is not supported for kind " + $routeParams.kind + ".");
      return;
    }

    var resourceGroupVersion = {
      resource: APIService.kindToResource($routeParams.kind),
      group: $routeParams.group
    };

    $scope.alerts = {};
    $scope.renderOptions = {
      hideFilterWidget: true
    };

    $scope.projectName = $routeParams.project;
    $scope.kind = $routeParams.kind;
    $scope.name = $routeParams.name;

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
      subpage: 'Add Storage',
      includeProject: true
    });

    ProjectsService
      .get($routeParams.project)
      .then(_.spread(function(project, context) {
        $scope.project = project;

        // Update project breadcrumb with display name.
        $scope.breadcrumbs[0].title = $filter('displayName')(project);

        if (!AuthorizationService.canI(resourceGroupVersion, 'update', $routeParams.project)) {
          Navigate.toErrorPage('You do not have authority to update ' +
                               $filter('humanizeKind')($routeParams.kind) + ' ' + $routeParams.name + '.', 'access_denied');
          return;
        }

        var orderByDisplayName = $filter('orderByDisplayName');
        var getErrorDetails = $filter('getErrorDetails');
        var generateName = $filter('generateName');

        var displayError = function(errorMessage, errorDetails) {
          $scope.disableInputs = true;
          $scope.alerts['attach-persistent-volume-claim'] = {
            type: "error",
            message: errorMessage,
            details: errorDetails
          };
        };

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

        // load resources required to show the page (list of pvcs and deployment or deployment config)
        var load = function() {
          DataService.get(resourceGroupVersion, $routeParams.name, context).then(
            function(resource) {
              $scope.attach.resource = resource;
              $scope.breadcrumbs = BreadcrumbsService.getBreadcrumbs({
                object: resource,
                project: project,
                subpage: 'Add Storage',
                includeProject: true
              });
              var podTemplate = _.get(resource, 'spec.template');
              $scope.existingVolumeNames = StorageService.getVolumeNames(podTemplate);
            },
            function(e) {
              displayError($routeParams.name + " could not be loaded.", getErrorDetails(e));
            }
          );

          DataService.list("persistentvolumeclaims", context, function(pvcs) {
            $scope.pvcs = orderByDisplayName(pvcs.by("metadata.name"));
            if (!_.isEmpty($scope.pvcs) && !$scope.attach.persistentVolumeClaim) {
              $scope.attach.persistentVolumeClaim = _.head($scope.pvcs);
            }
          });
        };

        load();

        $scope.attachPVC = function() {
          $scope.disableInputs = true;

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
            if (mountPath) {
              // for each container in the pod spec, add the new volume mount
              angular.forEach(podTemplate.spec.containers, function(container) {
                if (isContainerSelected(container)) {
                  var newVolumeMount = StorageService.createVolumeMount(name, mountPath);
                  if (!container.volumeMounts) {
                    container.volumeMounts = [];
                  }
                  container.volumeMounts.push(newVolumeMount);
                }
              });
            }

            // add the new volume to the pod template
            var newVolume = StorageService.createVolume(name, persistentVolumeClaim);
            if (!podTemplate.spec.volumes) {
              podTemplate.spec.volumes = [];
            }
            podTemplate.spec.volumes.push(newVolume);
            $scope.alerts = {};

            DataService.update(resourceGroupVersion, resource.metadata.name, $scope.attach.resource, context).then(
              function() {
                $window.history.back();
              },
              function(result) {
                displayError("An error occurred attaching the persistent volume claim to the " + $filter('humanizeKind')($routeParams.kind) + ".", getErrorDetails(result));
                $scope.disableInputs = false;
              }
            );
          }
        };
    }));
  });
