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
                       $routeParams,
                       $scope,
                       $window,
                       APIService,
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
      Navigate.toErrorPage("Volumes are not supported for kind " + $routeParams.kind + ".");
      return;
    }

    var resourceGroupVersion = {
      resource: APIService.kindToResource($routeParams.kind),
      group: $routeParams.group
    };

    $scope.alerts = {};
    $scope.projectName = $routeParams.project;
    $scope.kind = $routeParams.kind;
    $scope.name = $routeParams.name;
    $scope.attach = {
      allContainers: true,
      pickKeys: false
    };
    $scope.forms = {};

    $scope.breadcrumbs = BreadcrumbsService.getBreadcrumbs({
      name: $routeParams.name,
      kind: $routeParams.kind,
      namespace: $routeParams.project,
      subpage: 'Add Config Files',
      includeProject: true
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

        var orderByDisplayName = $filter('orderByDisplayName');
        var getErrorDetails = $filter('getErrorDetails');
        var generateName = $filter('generateName');

        var displayError = function(errorMessage, errorDetails) {
          $scope.alerts['attach-persistent-volume-claim'] = {
            type: "error",
            message: errorMessage,
            details: errorDetails
          };
        };

        DataService.get(resourceGroupVersion, $routeParams.name, context, { errorNotification: false }).then(
          function(object) {
            $scope.targetObject = object;
            $scope.breadcrumbs = BreadcrumbsService.getBreadcrumbs({
              object: object,
              project: project,
              subpage: 'Add Config Files',
              includeProject: true
            });
          },
          function(e) {
            $scope.error = e;
          }
        );

        DataService.list("configmaps", context, null, { errorNotification: false }).then(function(configMapData) {
          $scope.configMaps = orderByDisplayName(configMapData.by("metadata.name"));
        }, function(e) {
          if (e.status === 403) {
            $scope.configMaps = [];
            return;
          }

          displayError('Could not load config maps', getErrorDetails(e));
        });
        DataService.list("secrets", context, null, { errorNotification: false }).then(function(secretData) {
          $scope.secrets = orderByDisplayName(secretData.by("metadata.name"));
        }, function(e) {
          if (e.status === 403) {
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

          // Clear any previous alerts.
          $scope.alerts = {};

          $scope.disableInputs = true;
          DataService.update(resourceGroupVersion, resource.metadata.name, $scope.targetObject, context).then(
            function() {
              $window.history.back();
            },
            function(result) {
              $scope.disableInputs = false;
              var humanizeKind = $filter('humanizeKind');
              var sourceKind = humanizeKind(source.kind);
              var targetKind = humanizeKind($routeParams.kind);
              displayError("An error occurred attaching the " + sourceKind + " to the " + targetKind + ".", getErrorDetails(result));
            }
          );
        };
    }));
  });
