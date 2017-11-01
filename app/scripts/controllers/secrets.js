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
    var watches = [];

    ProjectsService
      .get($routeParams.project)
      .then(_.spread(function(project, context) {
        $scope.project = project;
        $scope.context = context;
        watches.push(DataService.watch("secrets", context, function(secrets) {
          $scope.secrets = _.sortBy(secrets.by("metadata.name"), ["type", "metadata.name"]);
          $scope.secretsLoaded = true;
        }));

        $scope.$on('$destroy', function(){
          DataService.unwatchAll(watches);
        });
    }));
  });
