'use strict';

/**
 * @ngdoc function
 * @name openshiftConsole.controller:CreateSecretController
 * @description
 * # CreateSecretController
 * Controller of the openshiftConsole
 */
angular.module('openshiftConsole')
  .controller('CreateSecretController', function ($filter, $location, $routeParams, $scope, $window, AlertMessageService, ApplicationGenerator, DataService, Navigate, ProjectsService) {
    $scope.alerts = {};
    $scope.projectName = $routeParams.project;

    $scope.breadcrumbs = [
      {
        title: $scope.projectName,
        link: "project/" + $scope.projectName
      },
      {
         title: "Secrets",
         link: "project/" + $scope.projectName + "/browse/secrets"
      },
      {
        title: "Create Secret"
      }
    ];

    var navigateBack = function() {
      if ($routeParams.then) {
        $location.url($routeParams.then);
        return;
      }

      Navigate.toResourceList('secrets', $scope.projectName);
    };

    ProjectsService
      .get($routeParams.project)
      .then(_.spread(function(project, context) {
        $scope.project = project;
        $scope.context = context;
        $scope.breadcrumbs[0].title = $filter('displayName')(project);

        $scope.postCreateAction = function(newSecret, creationAlerts) {
          _.each(creationAlerts, function(alert) {
            AlertMessageService.addAlert(alert);
          });
          navigateBack();
        };

        $scope.cancel = navigateBack;
    }));
  });
