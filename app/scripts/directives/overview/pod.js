'use strict';

angular.module('openshiftConsole')
  .directive('overviewPod', function($filter,
                                     $location,
                                     MetricsService,
                                     Navigate) {
    return {
      restrict: 'E',
      // Inherit scope from OverviewController. This directive is only used for the overview.
      // We want to do all of the grouping of resources once in the overview controller watch callbacks.
      scope: true,
      templateUrl: 'views/overview/_pod.html',
      link: function($scope) {
        if (!window.OPENSHIFT_CONSTANTS.DISABLE_OVERVIEW_METRICS) {
          MetricsService.isAvailable(true).then(function(available) {
            $scope.showMetrics = available;
          });
        }
        $scope.viewPod = function() {
          var url = Navigate.resourceURL($scope.pod);
          $location.url(url);
        };
      }
    };
  });
