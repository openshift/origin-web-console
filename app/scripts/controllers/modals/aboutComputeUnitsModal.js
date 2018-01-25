'use strict';

angular.module('openshiftConsole')
  .controller('AboutComputeUnitsModalController', function($scope, $uibModalInstance) {
    $scope.close = function() {
      $uibModalInstance.close('close');
    };
  });
