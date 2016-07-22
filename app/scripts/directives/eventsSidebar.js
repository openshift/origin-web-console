'use strict';

angular.module('openshiftConsole')
  .directive('eventsSidebar', function($filter, DataService, Logger) {
    return {
      restrict: 'E',
      scope: {
        projectContext: "="
      },
      templateUrl: 'views/directives/events-sidebar.html',
      controller: function($scope) {
        var watches = [];
        var sort = $filter('orderObjectsByDate');
        watches.push(DataService.watch("events", $scope.projectContext, function(eventData) {
          var events = eventData.by('metadata.name');
          $scope.events = sort(events, true);
          $scope.warningCount = _.size(_.filter(events, { type: 'Warning' }));
          Logger.log("events (subscribe)", $scope.events);
        }));

        $scope.$on('$destroy', function() {
          DataService.unwatchAll(watches);
        });
      },
    };
  });

