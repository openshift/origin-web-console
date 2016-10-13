'use strict';

/**
 * @ngdoc function
 * @name openshiftConsole.controller:SecretController
 * @description
 * # SecretController
 * Controller of the openshiftConsole
 */
angular.module('openshiftConsole')
  .controller('SecretController', function ($routeParams, $filter, $scope, AlertMessageService, DataService, ProjectsService, SecretsService) {
    $scope.projectName = $routeParams.project;
    $scope.secretName = $routeParams.secret;
    $scope.view = {
      showSecret: false
    };

    $scope.alerts = $scope.alerts || {};
    $scope.emptyMessage = "Loading...";

    $scope.breadcrumbs = [
      {
        title: "Secrets",
        link: "project/" + $routeParams.project + "/browse/secrets"
      },
      {
        title: $scope.secretName
      }
    ];

    AlertMessageService.getAlerts().forEach(function(alert) {
      $scope.alerts[alert.name] = alert.data;
    });

    AlertMessageService.clearAlerts();

    ProjectsService
      .get($routeParams.project)
      .then(_.spread(function(project, context) {
        $scope.project = project;
        $scope.context = context;

        DataService.get("secrets", $scope.secretName, context).then(
          function(secret) {
            $scope.secret = secret;
            $scope.decodedSecretData = SecretsService.decodeSecretData($scope.secret.data);
            $scope.loaded = true;
          },
          function(e) {
            $scope.loaded = true;
            $scope.alerts["load"] = {
              type: "error",
              message: "The secret details could not be loaded.",
              details: "Reason: " + $filter('getErrorDetails')(e)
            };
          });
    }));
  });
