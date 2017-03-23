'use strict';

/**
 * @ngdoc function
 * @name openshiftConsole.controller:AboutController
 * @description
 * Controller of the openshiftConsole
 */
angular.module('openshiftConsole')
  .controller('AboutController',
              function($scope,
                       AlertMessageService,
                       AuthService,
                       Constants) {
    AuthService.withUser();

    $scope.alerts = {};
    $scope.version = {
      master: {
        openshift: Constants.VERSION.openshift,
        kubernetes: Constants.VERSION.kubernetes,
      },
    };

    $scope.resetHiddenAlerts = function() {
      AlertMessageService.resetHiddenAlerts();
      $scope.alerts['hidden-alerts-reset'] = {
        type: 'success',
        message: '"Don\'t Show Me Again" alerts have been reset.'
      };
    };
  });
