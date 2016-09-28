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
                                                 modalConfig) {

    _.extend($scope, modalConfig);

    $scope.confirm = function() {
      $uibModalInstance.close('confirm');
    };

    $scope.cancel = function() {
      $uibModalInstance.dismiss('cancel');
    };
  });
