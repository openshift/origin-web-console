"use strict";

angular.module("openshiftConsole")

  .directive("oscSecrets", function(
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
        namespace: "=",
        displayType: "@",
        type: "@",
        alerts: '=',
        disableInput: "=",
        serviceAccountToLink: '@?',
        allowMultipleSecrets: "=?" // false by default
      },
      templateUrl: 'views/directives/osc-secrets.html',
      link: function($scope) {

        $scope.secretsVersion = APIService.getPreferredVersion('secrets');
        $scope.canAddSourceSecret = function() {
          if (!$scope.allowMultipleSecrets) {
            return false;
          }
          var lastSecret = _.last($scope.pickedSecrets);
          if (!lastSecret) {
            return false;
          }
          return lastSecret.name;
        };

        $scope.setLastSecretsName = function(secretName) {
          var lastSecret = _.last($scope.pickedSecrets);
          lastSecret.name = secretName;
        };

        $scope.addSourceSecret = function() {
          $scope.pickedSecrets.push({name: ""});
        };

        $scope.removeSecret = function(index) {
          if ($scope.pickedSecrets.length === 1) {
              $scope.pickedSecrets = [{name: ""}];
          } else {
            $scope.pickedSecrets.splice(index,1);
          }
          $scope.secretsForm.$setDirty();
        };

        $scope.openCreateSecretModal = function() {
          $scope.newSecret = {};
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
              $scope.secretsForm.$setDirty();
            });
          });
        };
      }
    };
  });
