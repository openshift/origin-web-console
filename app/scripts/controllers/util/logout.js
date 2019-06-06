'use strict';

/**
 * @ngdoc function
 * @name openshiftConsole.controller:LogoutController
 * @description
 * # LogoutController
 * Controller of the openshiftConsole
 */
angular.module('openshiftConsole')
  .controller('LogoutController', function ($scope, $routeParams, $log, AuthService, AUTH_CFG, gettextCatalog) {
    $log.debug("LogoutController");

    if (AuthService.isLoggedIn()) {
      $log.debug("LogoutController, logged in, initiating logout");
      $scope.logoutMessage = gettextCatalog.getString("Logging out...");

      AuthService.startLogout().finally(function(){
        // Make sure the logout completed
        if (AuthService.isLoggedIn()) {
          $log.debug("LogoutController, logout failed, still logged in");
          $scope.logoutMessage = gettextCatalog.getString('You could not be logged out. Return to the ') + '<a href="./">console</a>.';
        } else {
          if (AUTH_CFG.logout_uri) {
            $log.debug("LogoutController, logout completed, redirecting to AUTH_CFG.logout_uri", AUTH_CFG.logout_uri);
            window.location.href = AUTH_CFG.logout_uri;
          } else {
            $log.debug("LogoutController, logout completed, reloading the page");
            window.location.reload(false);
          }
        }
      });
    } else if (AUTH_CFG.logout_uri) {
      $log.debug("LogoutController, logout completed, redirecting to AUTH_CFG.logout_uri", AUTH_CFG.logout_uri);
      $scope.logoutMessage = gettextCatalog.getString("Logging out...");
      window.location.href = AUTH_CFG.logout_uri;
    } else {
      $log.debug("LogoutController, not logged in, logout complete");

      var logoutMessage = gettextCatalog.getString("You are logged out.");
      if ($routeParams.cause === "timeout") {
        logoutMessage = gettextCatalog.getString("You have been logged out due to inactivity.")
      }
      $scope.logoutMessage = logoutMessage + gettextCatalog.getString(' Return to the ') + '<a href="./">console</a>.';
    }
  });
