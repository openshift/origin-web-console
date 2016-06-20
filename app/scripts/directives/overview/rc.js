'use strict';

angular.module('openshiftConsole')
  .directive('overviewReplicationController', function() {
    return {
      restrict: 'E',
      // Inherit scope from OverviewController. This directive is only used for the overview.
      // We want to do all of the grouping of resources once in the overview controller watch callbacks.
      scope: true,
      templateUrl: 'views/overview/_rc.html'
    };
  });
