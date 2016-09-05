"use strict";

angular.module("openshiftConsole")

  .directive("oscSourceSecrets", function($uibModal, $filter, DataService, SecretsService) {
    return {
      restrict: 'E',
      scope: {
        pickedSecrets: "=model",
        secretsByType: '=',
        strategyType: '=',
        type: "@",
        displayType: "@",
        namespace: "=",
        alerts: '=',
        serviceAccountToLink: '@?'
      },
      templateUrl: 'views/directives/osc-source-secrets.html',
      link: function($scope) {
        $scope.canAddSourceSecret = function() {
          var lastSecret = _.last($scope.pickedSecrets);
          switch ($scope.strategyType) {
          case 'Custom':
            return lastSecret.secretSource.name && lastSecret.mountPath;
          default:
            return lastSecret.secret.name && lastSecret.destinationDir;
          }
        };

        $scope.setLastSecretsName = function(secretName) {
          var lastSecret = _.last($scope.pickedSecrets);
          switch ($scope.strategyType) {
          case 'Custom':
            lastSecret.secretSource.name = secretName;
            return;
          default:
            lastSecret.secret.name = secretName;
            return;
          }
        };

        $scope.addSourceSecret = function() {
          switch ($scope.strategyType) {
          case 'Custom':
            $scope.pickedSecrets.push({secretSource: {name: ""}, mountPath: ""});
            return;
          default:
            $scope.pickedSecrets.push({secret: {name: ""}, destinationDir: ""});
            return;
          }
        };

        $scope.removeSecret = function(index) {
          if ($scope.pickedSecrets.length === 1) {
            switch ($scope.strategyType) {
            case 'Custom':
              $scope.pickedSecrets = [{secretSource: {name: ""}, mountPath: ""}];
              break;
            default:
              $scope.pickedSecrets = [{secret: {name: ""}, destinationDir: ""}];
            }
          } else {
            $scope.pickedSecrets.splice(index,1);
          }          
          $scope.secretsForm.$setDirty();
        };

        $scope.openCreateSecretModal = function() {
          var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/modals/create-secret.html',
            controller: 'CreateSecretModalController',
            scope: $scope
          });

          modalInstance.result.then(function(newSecret) {
            DataService.list("secrets", {namespace: $scope.namespace}, function(secrets) {
              var secretsByType = SecretsService.groupSecretsByType(secrets);
              // Add empty option to the image/source secrets
              $scope.secretsByType = _.each(secretsByType, function(secretsArray) {
                secretsArray.unshift("");
              });
              $scope.setLastSecretsName(newSecret.metadata.name);
            });
          });
        };
      }
    };
  });
