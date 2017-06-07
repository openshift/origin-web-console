'use strict';

/**
 * @ngdoc function
 * @name openshiftConsole.controller:CreateSecretModalController
 * @description
 * # CreateSecretModalController
 * Controller of the openshiftConsole
 */
angular.module('openshiftConsole')
  .controller('CreateSecretModalController', function ($scope, $uibModalInstance) {

    $scope.onCreate = function(newSecret) {
      $uibModalInstance.close(newSecret);
    };

    $scope.onCancel = function() {
      $uibModalInstance.dismiss('cancel');
    };
  });
