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

    $scope.postCreateAction = function(newSecret, creationAlerts) {
      $uibModalInstance.close(newSecret);
      // Add creation alert into scope
      _.each(creationAlerts, function(alert) {
        $scope.alerts[alert.name] = alert.data;
      });
    };

    $scope.cancel = function() {
      $uibModalInstance.dismiss('cancel');
    };
  });
