'use strict';

angular.module('openshiftConsole')
  .directive('eventsBadge', function(
    $filter,
    APIService,
    DataService,
    Logger) {

    var eventsVersion = APIService.getPreferredVersion('events');

    return {
      restrict: 'E',
      scope: {
        projectContext: "=",
        sidebarCollapsed: "="
      },
      templateUrl: 'views/directives/events-badge.html',
      controller: function($scope) {
        var watches = [];
        var sort = $filter('orderObjectsByDate');
        watches.push(DataService.watch(eventsVersion, $scope.projectContext, function(eventData) {
          var events = eventData.by('metadata.name');
          $scope.events = sort(events, true);
          $scope.warningCount = _.size(_.filter(events, { type: 'Warning' }));
          $scope.normalCount = _.size(_.filter(events, { type: 'Normal' }));
          Logger.log("events (subscribe)", $scope.events);
        }));

        $scope.expandSidebar = function() {
          $scope.sidebarCollapsed = false;
        };

        $scope.$on('$destroy', function() {
          DataService.unwatchAll(watches);
        });
      },
    };
  });
