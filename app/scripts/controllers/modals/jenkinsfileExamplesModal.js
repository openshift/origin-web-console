'use strict';

angular.module('openshiftConsole')
  .controller('JenkinsfileExamplesModalController', function($scope, $uibModalInstance) {
    $scope.ok = function() {
      $uibModalInstance.close('ok');
    };
  });
