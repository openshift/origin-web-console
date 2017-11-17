'use strict';

angular.module('openshiftConsole')
  .directive('events', function(
    $routeParams,
    $filter,
    APIService,
    DataService,
    KeywordService,
    Logger) {
    return {
      restrict: 'E',
      scope: {
        apiObjects: "=?",
        projectContext: "="
      },
      templateUrl: 'views/directives/events.html',
      controller: function($scope) {
        var allEvents;
        var uids = {};
        var watches = [];
        var eventsVersion = APIService.getPreferredVersion('events');
        $scope.filter = {
          text: ''
        };

        var filterForResource = function(events) {
          if (_.isEmpty(uids)) {
            return events;
          }

          return _.filter(events, function(event) {
            return uids[event.involvedObject.uid];
          });
        };

        var sortedEvents = [];
        var currentID = _.get($scope, 'sortConfig.currentField.id');
        var defaultIsReversed = {
          lastTimestamp: true
        };
        var sortEvents = function() {
          var sortID = _.get($scope, 'sortConfig.currentField.id', 'lastTimestamp');
          // only change if sort dropdown field is changed
          if (currentID !== sortID) {
            // set currentID to sortID
            currentID = sortID;
            // reverse the sort
            $scope.sortConfig.isAscending = !(defaultIsReversed[currentID]);
          }
          var order = $scope.sortConfig.isAscending ? 'asc' : 'desc';
          // Use `metadata.resourceVersion` as a secondary sort so that the
          // sort is stable. In practice, this makes sure that the events with
          // the same `lastTimestamp` appear in the correct order since events
          // only have second granularity.
          sortedEvents = _.orderBy($scope.events, [sortID, 'metadata.resourceVersion'], [order, order]);
        };

        var filterExpressions = [];
        var updateKeywords = function() {
          $scope.filterExpressions = filterExpressions = KeywordService.generateKeywords(_.get($scope, 'filter.text'));
        };

        // Only filter by keyword on certain fields.
        var filterFields = [
          'reason',
          'message',
          'type'
        ];
        if (!$scope.resourceKind || !$scope.resourceName) {
          filterFields.splice(0, 0, 'involvedObject.name', 'involvedObject.kind');
        }

        var filterForKeyword = function() {
          $scope.filteredEvents = KeywordService.filterForKeywords(sortedEvents, filterFields, filterExpressions);
        };

        $scope.$watch('filter.text', _.debounce(function() {
          updateKeywords();
          $scope.$evalAsync(filterForKeyword);
        }, 50, { maxWait: 250 }));

        var update = function() {
          // Sort first so we can update the filter as the user types without resorting.
          sortEvents();
          filterForKeyword();
        };

        // Invoke update when first called, debouncing subsequent calls.
        var debounceUpdate = _.debounce(function() {
          if (!allEvents) {
            return;
          }

          $scope.$evalAsync(function() {
            // Assign `$scope.events` here instead of the watch callback to
            // avoid the "Filter hiding all events" message from flickering
            // briefly before the debounced filter and update calls.
            $scope.events = filterForResource(allEvents);
            update();
          });
        }, 250, {
          leading: true,
          trailing: true,
          maxWait: 1000
        });

        $scope.$watch('apiObjects', function(apiObjects) {
          // Create a map of UIDs to for quick lookup (key UID, value `true`).
          uids = {};
          _.each(apiObjects, function(apiObject) {
            var uid = _.get(apiObject, 'metadata.uid');
            if (uid) {
              uids[apiObject.metadata.uid] = true;
            }
          });
          $scope.showKindAndName = _.size(uids) !== 1;

          if (allEvents) {
            debounceUpdate();
          }
        });

        $scope.$watch('showKindAndName', function(showKindAndName) {
          // Set up the sort configuration for `pf-sort`.
          $scope.sortConfig = {
            fields: [{
              id: 'lastTimestamp',
              title: 'Time',
              sortType: 'alpha'
            }, {
              id: 'type',
              title: 'Severity',
              sortType: 'alpha'
            }, {
              id: 'reason',
              title: 'Reason',
              sortType: 'alpha'
            }, {
              id: 'message',
              title: 'Message',
              sortType: 'alpha'
            }, {
              id: 'count',
              title: 'Count',
              sortType: 'numeric'
            }],
            isAscending: true,
            onSortChange: update
          };

          // Conditionally add kind and name to sort fields if not passed to the directive.
          if (showKindAndName) {
            $scope.sortConfig.fields.splice(1, 0, {
              id: 'involvedObject.name',
              title: 'Name',
              sortType: 'alpha'
            }, {
              id: 'involvedObject.kind',
              title: 'Kind',
              sortType: 'alpha'
            });
          }
        });

        watches.push(DataService.watch(eventsVersion, $scope.projectContext, function(events) {
          allEvents = events.by("metadata.name");
          debounceUpdate();
          Logger.log("events (subscribe)", $scope.filteredEvents);
        }, { skipDigest: true }));

        $scope.$on('$destroy', function(){
          DataService.unwatchAll(watches);
        });
      },
    };
  });
