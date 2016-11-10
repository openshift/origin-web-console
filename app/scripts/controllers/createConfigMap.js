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
              function ($filter,
                        $routeParams,
                        $scope,
                        $window,
                        DataService,
                        Navigate,
                        ProjectsService) {
    $scope.alerts = {};
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

    ProjectsService
      .get($routeParams.project)
      .then(_.spread(function(project, context) {
        $scope.project = project;
        // Update project breadcrumb with display name.
        $scope.breadcrumbs[0].title = $filter('displayName')(project);

        $scope.configMap = {
          apiVersion: 'v1',
          kind: 'ConfigMap',
          metadata: {
            namespace: $routeParams.project
          },
          data: {}
        };

        $scope.createConfigMap = function() {
          if ($scope.createConfigMapForm.$valid) {
            $scope.disableInputs = true;

            DataService.create('configmaps', null, $scope.configMap, context)
              .then(function() { // Success
                // Return to the previous page.
                $window.history.back();
              }, function(result) { // Failure
                $scope.disableInputs = false;
                $scope.alerts['create-config-map'] = {
                  type: "error",
                  message: "An error occurred creating the config map.",
                  details: $filter('getErrorDetails')(result)
                };
              });
          }
        };
    }));
  });
