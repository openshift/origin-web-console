'use strict';

/**
 * @ngdoc function
 * @name openshiftConsole.controller:SecretController
 * @description
 * # SecretController
 * Controller of the openshiftConsole
 */
angular.module('openshiftConsole')
  .controller('SecretController', function ($routeParams,
                                            $filter,
                                            $scope,
                                            APIService,
                                            DataService,
                                            ProjectsService,
                                            SecretsService) {
    $scope.projectName = $routeParams.project;
    $scope.secretName = $routeParams.secret;
    $scope.view = {
      showSecret: false
    };

    $scope.alerts = $scope.alerts || {};

    $scope.breadcrumbs = [
      {
        title: "Secrets",
        link: "project/" + $routeParams.project + "/browse/secrets"
      },
      {
        title: $scope.secretName
      }
    ];


    $scope.secretsVersion = APIService.getPreferredVersion('secrets');

    var watches = [];

    var secretResolved = function(secret, action) {
      $scope.secret = secret;
      if (action === "DELETED") {
        $scope.alerts["deleted"] = {
          type: "warning",
          message: "This secret has been deleted."
        };
        return;
      }
      $scope.decodedSecretData = SecretsService.decodeSecretData($scope.secret.data);
    };

    $scope.addToApplicationVisible = false;

    $scope.addToApplication = function() {
      if (!$scope.secret.data) {
        return;
      }
      $scope.addToApplicationVisible = true;
    };

    $scope.closeAddToApplication = function() {
      $scope.addToApplicationVisible = false;
    };

    ProjectsService
      .get($routeParams.project)
      .then(_.spread(function(project, context) {
        $scope.project = project;
        $scope.context = context;

        DataService.get($scope.secretsVersion, $scope.secretName, context, { errorNotification: false }).then(
          function(secret) {
            $scope.loaded = true;
            secretResolved(secret);
            watches.push(DataService.watchObject($scope.secretsVersion, $scope.secretName, context, secretResolved));
          },
          function(e) {
            $scope.loaded = true;
            $scope.alerts["load"] = {
              type: "error",
              message: "The secret details could not be loaded.",
              details: $filter('getErrorDetails')(e)
            };
          });

        $scope.$on('$destroy', function(){
          DataService.unwatchAll(watches);
        });
    }));
  });
