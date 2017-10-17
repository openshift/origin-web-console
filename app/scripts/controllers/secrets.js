'use strict';

/**
 * @ngdoc function
 * @name openshiftConsole.controller:SecretsController
 * @description
 * # ProjectController
 * Controller of the openshiftConsole
 */
angular.module('openshiftConsole')
  .controller('SecretsController', function ($routeParams, $scope, DataService, ProjectsService) {
    $scope.projectName = $routeParams.project;
    $scope.secretsByType = {};

    ProjectsService
      .get($routeParams.project)
      .then(_.spread(function(project, context) {
        $scope.project = project;
        $scope.context = context;

        DataService.list("secrets", context).then(function(secrets) {
          $scope.secrets = _.sortBy(secrets.by("metadata.name"), ["type", "metadata.name"]);
          $scope.loaded = true;
        });
    }));
  });
