'use strict';

angular.module('openshiftConsole')
  .directive('events', function($routeParams, $filter, DataService, KeywordService, ProjectsService, Logger) {
    return {
      restrict: 'E',
      scope: {
        resourceKind: "@?",
        resourceName: "@?",
        projectContext: "="
      },
      templateUrl: 'views/directives/events.html',
      controller: function($scope){
        $scope.filter = {
          text: ''
        };

        var filterForResource = function(events) {
          // If there is a kind, but no name, assume that the name hasn't been
          // set yet and none of the events should match. This is the case with
          // build resources and that have a build pod annotation, which isn't
          // set until the build starts running.
          if (!$scope.resourceKind) {
            return events;
          }

          return _.filter(events, function(event) {
            return event.involvedObject.kind === $scope.resourceKind &&
                   event.involvedObject.name === $scope.resourceName;
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
          sortedEvents = _.sortByOrder($scope.events, [sortID], [order]);
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
          $scope.$apply(filterForKeyword);
        }, 50, { maxWait: 250 }));

        var update = function() {
          // Sort first so we can update the filter as the user types without resorting.
          sortEvents();
          filterForKeyword();
        };

        // Invoke update when first called, debouncing subsequent calls.
        var debounceUpdate = _.debounce(function() {
          $scope.$evalAsync(update);
        }, 250, {
          leading: true,
          trailing: false,
          maxWait: 1000
        });

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
        if (!$scope.resourceKind || !$scope.resourceName) {
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

        var watches = [];
        watches.push(DataService.watch("events", $scope.projectContext, function(events) {
          $scope.events = filterForResource(events.by('metadata.name'));
          debounceUpdate();
          Logger.log("events (subscribe)", $scope.filteredEvents);
        }));

        $scope.$on('$destroy', function(){
          DataService.unwatchAll(watches);
        });

      },
    };
  });
