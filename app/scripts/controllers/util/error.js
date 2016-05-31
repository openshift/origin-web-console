'use strict';

/**
 * @ngdoc function
 * @name openshiftConsole.controller:ErrorController
 * @description
 * # ErrorController
 * Controller of the openshiftConsole
 */
angular.module('openshiftConsole')
  .controller('ErrorController', function ($scope, $window, gettextCatalog) {
    var params = URI(window.location.href).query(true);
    var error = params.error;

    switch(error) {
      case 'access_denied':
        $scope.errorMessage = gettextCatalog.getString("Access denied");
        break;
      case 'not_found':
        $scope.errorMessage = gettextCatalog.getString("Not found");
        break;
      case 'invalid_request':
        $scope.errorMessage = gettextCatalog.getString("Invalid request");
        break;
      default:
        $scope.errorMessage = gettextCatalog.getString("An error has occurred");
    }

    if (params.error_description) {
      $scope.errorDetails = params.error_description;
    }
    
    $scope.reloadConsole = function() {
      $window.location.href = "/";
    };
  });
