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
    // content supplied in the following forms:
    // heading: modalConfig.title
    // content: modalConfig.details (plain text ONLY, no user imput)
    // content: modalConfig.detailsMarkup (pre-sanitized, see _.escape() or _.template('<%- %>') )
    _.extend($scope, modalConfig);

    $scope.confirm = function() {
      $uibModalInstance.close('confirm');
    };

    $scope.cancel = function() {
      $uibModalInstance.dismiss('cancel');
    };
  });
