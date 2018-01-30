'use strict';

angular.module('openshiftConsole')
  .controller('JenkinsfileExamplesModalController', function($scope, $uibModalInstance) {
    $scope.close = function() {
      $uibModalInstance.close('close');
    };
  });
