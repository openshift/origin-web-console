'use strict';

/**
 * @ngdoc function
 * @name openshiftConsole.controller:CreateProjectController
 * @description
 * # CreateProjectController
 * Controller of the openshiftConsole
 */
angular.module('openshiftConsole')
  .controller('CreateProjectController', function ($scope, $location, AuthService, DataService, AlertMessageService) {
    $scope.alerts = {};

    AuthService.withUser();

    AlertMessageService.getAlerts().forEach(function(alert) {
      $scope.alerts[alert.name] = alert.data;
    });
    AlertMessageService.clearAlerts();

  });
