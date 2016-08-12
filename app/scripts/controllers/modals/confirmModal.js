'use strict';
/* jshint unused: false */

/**
 * @ngdoc function
 * @name openshiftConsole.controller:ConfirmModalController
 * @description
 * # ConfirmModalController
 * Controller of the openshiftConsole
 */
angular.module('openshiftConsole')
  .controller('ConfirmModalController', function($scope,
                                                 $uibModalInstance,
                                                 message,
                                                 details,
                                                 buttonText,
                                                 buttonClass) {
    $scope.message = message;
    $scope.details = details;
    $scope.buttonText = buttonText;
    $scope.buttonClass = buttonClass;

    $scope.confirm = function() {
      $uibModalInstance.close('confirm');
    };

    $scope.cancel = function() {
      $uibModalInstance.dismiss('cancel');
    };
  });
