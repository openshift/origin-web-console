'use strict';
/* jshint unused: false */

/**
 * @ngdoc function
 * @name openshiftConsole.controller:CreateSecretModalController
 * @description
 * # CreateSecretModalController
 * Controller of the openshiftConsole
 */
angular.module('openshiftConsole')
  .controller('CreateSecretModalController', function ($scope, $uibModalInstance) {

    $scope.postCreateAction = function(newSecret, creationAlert) {
      $uibModalInstance.close(newSecret);
      // Add creation alert into scope
      _.extend($scope.alerts, creationAlert);
    };

    $scope.cancel = function() {
      $uibModalInstance.dismiss('cancel');
    };
  });
