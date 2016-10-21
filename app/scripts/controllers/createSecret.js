'use strict';

/**
 * @ngdoc function
 * @name openshiftConsole.controller:CreateSecretController
 * @description
 * # CreateSecretController
 * Controller of the openshiftConsole
 */
angular.module('openshiftConsole')
  .controller('CreateSecretController', function ($filter, $routeParams, $scope, $window, AlertMessageService, ApplicationGenerator, DataService, Navigate, ProjectsService) {
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

    ProjectsService
      .get($routeParams.project)
      .then(_.spread(function(project, context) {
        $scope.project = project;
        $scope.context = context;
        $scope.breadcrumbs[0].title = $filter('displayName')(project);

        $scope.postCreateAction = function(newSecret, creationAlert) {
          AlertMessageService.addAlert(creationAlert);
          Navigate.toResourceList('secrets', $scope.projectName);
        };
        $scope.cancel = function() {
          Navigate.toResourceList('secrets', $scope.projectName);
        };
    }));
  });
