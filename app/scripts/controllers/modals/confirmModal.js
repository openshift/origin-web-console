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
                                                 okButtonText,
                                                 okButtonClass,
                                                 cancelButtonText) {
    $scope.message = message;
    $scope.details = details;
    $scope.okButtonText = okButtonText;
    $scope.okButtonClass = okButtonClass;
    $scope.cancelButtonText = cancelButtonText;

    $scope.confirm = function() {
      $uibModalInstance.close('confirm');
    };

    $scope.cancel = function() {
      $uibModalInstance.dismiss('cancel');
    };
  });
