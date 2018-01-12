'use strict';
/* jshint unused: false */

/**
 * @ngdoc function
 * @name openshiftConsole.controller:LogoutModalController
 * @description
 * # LogoutModalController
 * Controller of the openshiftConsole
 */
angular.module('openshiftConsole')
  .controller('LogoutModalController', function ($timeout, $location, $filter, $scope, $uibModalInstance, Constants) {
    $scope.endTimestamp = moment().add(30, 'seconds').toString();

    var logoutTimeout = $timeout(function(){
      $scope.logout();
    }, 30000);

    $scope.logout = function() {
      $timeout.cancel(logoutTimeout);
      $uibModalInstance.close('logout');
    };

    $scope.cancel = function() {
      $timeout.cancel(logoutTimeout);
      $uibModalInstance.close('cancel');
    };

    $scope.$on('$destroy', function(){
      $timeout.cancel(logoutTimeout);
    });
  });
