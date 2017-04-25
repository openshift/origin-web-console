'use strict';

/**
 * @ngdoc function
 * @name openshiftConsole.controller:ProcessOrSaveTemplateModalController
 * @description
 * # ProcessOrSaveTemplateModalController
 * Controller of the openshiftConsole
 */
angular.module('openshiftConsole')
  .controller('ProcessOrSaveTemplateModalController', function ($scope, $uibModalInstance) {
    $scope.continue = function() {
      $uibModalInstance.close('create');
    };

    $scope.cancel = function() {
      $uibModalInstance.dismiss('cancel');
    };
  });
