'use strict';

angular.module('openshiftConsole')
  .controller('AboutComputeUnitsModalController', function($scope, $uibModalInstance) {
    $scope.ok = function() {
      $uibModalInstance.close('ok');
    };
  });
