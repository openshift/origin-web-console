"use strict";

angular.module("openshiftConsole")

  .directive("oscSecrets", function($uibModal, $filter, DataService, SecretsService) {
    return {
      restrict: 'E',
      scope: {
        pickedSecret: "=model",
        secretsByType: '=',
        namespace: "=",
        displayType: "@",
        type: "@",
        alerts: '=',
        serviceAccountToLink: '@?'
      },
      templateUrl: 'views/directives/osc-secrets.html',
      link: function($scope) {

        $scope.openCreateSecretModal = function() {
          $scope.newSecret = {};
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
              $scope.pickedSecret.name = newSecret.metadata.name;
              $scope.secretsForm.$setDirty();
            });
          });
        };
      }
    };
  });
