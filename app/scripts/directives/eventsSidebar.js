'use strict';

angular.module('openshiftConsole')
  .directive('eventsSidebar', function(
    $rootScope,
    APIService,
    DataService,
    Logger) {

    var eventsVersion = APIService.getPreferredVersion('events');

    return {
      restrict: 'E',
      scope: {
        projectContext: "=",
        collapsed: "="
      },
      templateUrl: 'views/directives/events-sidebar.html',
      controller: function($scope) {
        var watches = [];
        watches.push(DataService.watch(eventsVersion, $scope.projectContext, function(eventData) {
          var events = eventData.by('metadata.name');
          $scope.events = _.orderBy(events, ['lastTimestamp'], ['desc']);
          $scope.warningCount = _.size(_.filter(events, { type: 'Warning' }));
          Logger.log("events (subscribe)", $scope.events);
        }));

        $scope.highlightedEvents = {};

        $scope.collapseSidebar = function(){
          $scope.collapsed = true;
        };

        var messageHandlers = [];
        messageHandlers.push($rootScope.$on('event.resource.highlight', function(evt, data) {
          var targetKind = _.get(data, 'kind');
          var targetName = _.get(data, 'metadata.name');
          if (!targetKind || !targetName) {
            return;
          }
          _.each($scope.events, function(event) {
            if (event.involvedObject.kind === targetKind && event.involvedObject.name === targetName) {
              $scope.highlightedEvents[targetKind + "/" + targetName] = true;
            }
          });
        }));

        messageHandlers.push($rootScope.$on('event.resource.clear-highlight', function(event, data) {
          var targetKind = _.get(data, 'kind');
          var targetName = _.get(data, 'metadata.name');
          if (!targetKind || !targetName) {
            return;
          }
          _.each($scope.events, function(event) {
            if (event.involvedObject.kind === targetKind && event.involvedObject.name === targetName) {
              $scope.highlightedEvents[targetKind + "/" + targetName] = false;
            }
          });
        }));

        $scope.$on('$destroy', function() {
          DataService.unwatchAll(watches);
          _.each(messageHandlers, function(unbind) {
            unbind();
          });
          messageHandlers = null;
        });
      },
    };
  });
