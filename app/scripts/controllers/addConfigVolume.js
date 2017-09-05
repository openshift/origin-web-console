'use strict';

/**
 * @ngdoc function
 * @name openshiftConsole.controller:AddConfigVolumeController
 * @description
 * # AddConfigVolumeController
 * Controller of the openshiftConsole
 */
angular.module('openshiftConsole')
  .controller('AddConfigVolumeController',
              function($filter,
                       $location,
                       $routeParams,
                       $scope,
                       $window,
                       APIService,
                       AuthorizationService,
                       BreadcrumbsService,
                       DataService,
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

    if (!_.includes(supportedKinds, $routeParams.kind)) {
      Navigate.toErrorPage("Volumes are not supported for kind " + $routeParams.kind + ".");
      return;
    }

    var resourceGroupVersion = {
      resource: APIService.kindToResource($routeParams.kind),
      group: $routeParams.group
    };

    $scope.projectName = $routeParams.project;
    $scope.kind = $routeParams.kind;
    $scope.name = $routeParams.name;
    $scope.attach = {
      allContainers: true,
      pickKeys: false
    };
    $scope.forms = {};
    $scope.RELATIVE_PATH_PATTERN = RELATIVE_PATH_PATTERN;

    $scope.breadcrumbs = BreadcrumbsService.getBreadcrumbs({
      name: $routeParams.name,
      kind: $routeParams.kind,
      namespace: $routeParams.project,
      subpage: 'Add Config Files'
    });

    var humanizeKind = $filter('humanizeKind');
    $scope.groupByKind = function(object) {
      return humanizeKind(object.kind);
    };

    var resetItems = function() {
      // Add an empty item so one appears when the section is first expanded.
      _.set($scope, 'attach.items', [{}]);
    };

    // Clear the items if the source has changed.
    $scope.$watch('attach.source', resetItems);

    var setDirty = function() {
      $scope.forms.addConfigVolumeForm.$setDirty();
    };

    var navigateBack = function() {
      $window.history.back();
    };
    $scope.cancel = navigateBack;

    var displayError = function(errorMessage, errorDetails) {
      NotificationsService.addNotification({
        id: "add-config-volume-error",
        type: "error",
        message: errorMessage,
        details: errorDetails
      });
    };

    var hideErrorNotifications = function() {
      NotificationsService.hideNotification("add-config-volume-error");
    };
    $scope.$on('$destroy', hideErrorNotifications);

    $scope.addItem = function() {
      $scope.attach.items.push({});
      setDirty();
    };

    $scope.removeItem = function(index) {
      $scope.attach.items.splice(index, 1);
      setDirty();
    };

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

        DataService.get(resourceGroupVersion, $routeParams.name, context, { errorNotification: false }).then(
          function(object) {
            $scope.targetObject = object;
            $scope.breadcrumbs = BreadcrumbsService.getBreadcrumbs({
              object: object,
              project: project,
              subpage: 'Add Config Files'
            });
          },
          function(e) {
            $scope.error = e;
          }
        );

        DataService.list("configmaps", context, null, { errorNotification: false }).then(function(configMapData) {
          $scope.configMaps = orderByDisplayName(configMapData.by("metadata.name"));
        }, function(e) {
          if (e.code === 403) {
            $scope.configMaps = [];
            return;
          }

          displayError('Could not load config maps', getErrorDetails(e));
        });

        DataService.list("secrets", context, null, { errorNotification: false }).then(function(secretData) {
          $scope.secrets = orderByDisplayName(secretData.by("metadata.name"));
        }, function(e) {
          if (e.code === 403) {
            $scope.secrets = [];
            return;
          }

          displayError('Could not load secrets', getErrorDetails(e));
        });

        var isContainerSelected = function(container) {
          return $scope.attach.allContainers || $scope.attach.containers[container.name];
        };

        // Look at the existing mount paths so that we can warn if the new value is not unique.
        var updateMountPaths = function() {
          var podTemplate = _.get($scope, 'targetObject.spec.template');
          $scope.existingMountPaths = StorageService.getMountPaths(podTemplate, isContainerSelected);
        };

        $scope.$watchGroup(['targetObject', 'attach.allContainers'], updateMountPaths);
        $scope.$watch('attach.containers', updateMountPaths, true);

        // Make sure the path for each item is unique.
        var updateItemPaths = function() {
          // Call `_.compact` to remove empty values.
          var paths = _.map($scope.attach.items, 'path');
          $scope.itemPaths = _.compact(paths);
        };
        $scope.$watch('attach.items', updateItemPaths, true);

        $scope.addVolume = function() {
          if ($scope.forms.addConfigVolumeForm.$invalid) {
            return;
          }

          var resource = $scope.targetObject;
          var source = _.get($scope, 'attach.source');
          var podTemplate = _.get(resource, 'spec.template');
          var name = generateName('volume-');
          var mountPath = _.get($scope, 'attach.mountPath');
          var newVolumeMount = {
            name: name,
            mountPath: mountPath
          };

          // The volume mount is read-only for secrets.
          if (source.kind === 'Secret') {
            newVolumeMount.readOnly = true;
          }

          // For each selected container, add the new volume mount.
          _.each(podTemplate.spec.containers, function(container) {
            if (isContainerSelected(container)) {
              container.volumeMounts = container.volumeMounts || [];
              container.volumeMounts.push(newVolumeMount);
            }
          });

          var newVolume = {
            name: name
          };

          var items;
          if ($scope.attach.pickKeys) {
            items = $scope.attach.items;
          }

          switch (source.kind) {
          case 'ConfigMap':
            newVolume.configMap = {
              name: source.metadata.name,
              items: items
            };
            break;
          case 'Secret':
            newVolume.secret = {
              secretName: source.metadata.name,
              items: items
            };
            break;
          }

          podTemplate.spec.volumes = podTemplate.spec.volumes || [];
          podTemplate.spec.volumes.push(newVolume);

          $scope.disableInputs = true;
          hideErrorNotifications();

          var humanizeKind = $filter('humanizeKind');
          var sourceKind = humanizeKind(source.kind);
          var targetKind = humanizeKind($routeParams.kind);

          DataService.update(resourceGroupVersion, resource.metadata.name, $scope.targetObject, context).then(
            function() {
              NotificationsService.addNotification({
                type: "success",
                message: "Successfully added " + sourceKind + " " + source.metadata.name + " to " + targetKind + " " + $routeParams.name + "."
              });

              navigateBack();
            },
            function(result) {
              $scope.disableInputs = false;
              displayError("An error occurred attaching the " + sourceKind + " to the " + targetKind + ".", getErrorDetails(result));
            }
          );
        };
    }));
  });
