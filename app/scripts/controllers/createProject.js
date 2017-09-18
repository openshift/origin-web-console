'use strict';

/**
 * @ngdoc function
 * @name openshiftConsole.controller:CreateProjectController
 * @description
 * # CreateProjectController
 * Controller of the openshiftConsole
 */
angular.module('openshiftConsole')
  .controller('CreateProjectController',
              function($scope,
                       $location,
                       $window,
                       AuthService,
                       Constants) {
    var landingPageEnabled = !Constants.DISABLE_SERVICE_CATALOG_LANDING_PAGE;

    $scope.onProjectCreated = function(encodedProjectName) {
      if (landingPageEnabled) {
        // If the new experience is enabled, return to project list.
        $window.history.back();
      } else {
        // If the next experience is not enabled, go to the catalog.
        $location.path("project/" + encodedProjectName + "/create");
      }
    };

    // Make sure we're logged in.
    AuthService.withUser();
  });
