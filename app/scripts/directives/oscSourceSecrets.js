"use strict";

angular.module("openshiftConsole")

  .directive("oscSourceSecrets", function(
    $uibModal,
    $filter,
    APIService,
    DataService,
    SecretsService) {

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

        $scope.secretsVersion = APIService.getPreferredVersion('secrets');

        $scope.canAddSourceSecret = function() {
          var lastSecret = _.last($scope.pickedSecrets);
          switch ($scope.strategyType) {
          case 'Custom':
            return _.get(lastSecret, 'secretSource.name');
          default:
            return _.get(lastSecret, 'secret.name');
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
            templateUrl: 'views/modals/create-secret.html',
            controller: 'CreateSecretModalController',
            scope: $scope
          });

          modalInstance.result.then(function(newSecret) {
            DataService.list($scope.secretsVersion, {namespace: $scope.namespace}, function(secrets) {
              var secretsByType = SecretsService.groupSecretsByType(secrets);
              var secretNamesByType =_.mapValues(secretsByType, function(secrets) {return _.map(secrets, 'metadata.name');});
              // Add empty option to the image/source secrets
              $scope.secretsByType = _.each(secretNamesByType, function(secretsArray) {
                secretsArray.unshift("");
              });
              $scope.setLastSecretsName(newSecret.metadata.name);
            });
          });
        };
      }
    };
  });
