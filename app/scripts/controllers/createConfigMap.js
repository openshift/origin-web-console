'use strict';

/**
 * @ngdoc function
 * @name openshiftConsole.controller:CreateConfigMapController
 * @description
 * # CreateConfigMapController
 * Controller of the openshiftConsole
 */
angular.module('openshiftConsole')
  .controller('CreateConfigMapController',
              function($filter,
                       $routeParams,
                       $scope,
                       $window,
                       AuthorizationService,
                       DataService,
                       Navigate,
                       NotificationsService,
                       ProjectsService,
                       keyValueEditorUtils) {
    $scope.projectName = $routeParams.project;

    // TODO: Update BreadcrumbsService to handle create pages.
    $scope.breadcrumbs = [
      {
        title: $scope.projectName,
        link: "project/" + $scope.projectName
      },
      {
         title: "Config Maps",
         link: "project/" + $scope.projectName + "/browse/config-maps"
      },
      {
        title: "Create Config Map"
      }
    ];

    var hideErrorNotifications = function() {
      NotificationsService.hideNotification("create-config-map-error");
    };
    $scope.$on('$destroy', hideErrorNotifications);

    var navigateBack = function() {
      $window.history.back();
    };
    $scope.cancel = navigateBack;

    ProjectsService
      .get($routeParams.project)
      .then(_.spread(function(project, context) {
        $scope.project = project;
        // Update project breadcrumb with display name.
        $scope.breadcrumbs[0].title = $filter('displayName')(project);

        if (!AuthorizationService.canI('configmaps', 'create', $routeParams.project)) {
          Navigate.toErrorPage('You do not have authority to create config maps in project ' + $routeParams.project + '.', 'access_denied');
          return;
        }

        $scope.configMap = {
          apiVersion: 'v1',
          kind: 'ConfigMap',
          metadata: {
            namespace: $routeParams.project
          },
          data: {}
        };
        $scope.labels = [];

        $scope.createConfigMap = function() {
          if ($scope.createConfigMapForm.$valid) {
            hideErrorNotifications();
            $scope.disableInputs = true;
            $scope.configMap.metadata.labels = keyValueEditorUtils.mapEntries(keyValueEditorUtils.compactEntries($scope.labels));
            DataService.create('configmaps', null, $scope.configMap, context)
              .then(function() { // Success
                NotificationsService.addNotification({
                  type: "success",
                  message: "Config map " + $scope.configMap.metadata.name + " successfully created."
                });
                // Return to the previous page.
                navigateBack();
              }, function(result) { // Failure
                $scope.disableInputs = false;
                NotificationsService.addNotification({
                  id: "create-config-map-error",
                  type: "error",
                  message: "An error occurred creating the config map.",
                  details: $filter('getErrorDetails')(result)
                });
              });
          }
        };
    }));
  });
