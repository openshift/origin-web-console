'use strict';

angular.module('openshiftConsole')
  .controller('StatefulSetsController', function($scope, $routeParams, AlertMessageService, DataService, ProjectsService, LabelFilter) {
    $scope.projectName = $routeParams.project;
    $scope.alerts = $scope.alerts || {};
    $scope.labelSuggestions = {};
    $scope.emptyMessage = "Loading...";

    // get and clear any alerts
    AlertMessageService.getAlerts().forEach(function(alert) {
      $scope.alerts[alert.name] = alert.data;
    });
    AlertMessageService.clearAlerts();

    var watches = [];
    ProjectsService
      .get($routeParams.project)
      .then(_.spread(function(project, context) {
        $scope.project = project;

        watches.push(DataService.watch({
          resource: 'statefulsets',
          group: 'apps',
          version: 'v1beta1'
        }, context, function(statefulSets) {
          angular.extend($scope, {
            loaded: true,
            unfilteredStatefulSets: statefulSets.by('metadata.name')
          });
          $scope.statefulSets = LabelFilter.getLabelSelector().select($scope.unfilteredStatefulSets);
          LabelFilter.addLabelSuggestionsFromResources($scope.unfilteredStatefulSets, $scope.labelSuggestions);
          LabelFilter.setLabelSuggestions($scope.labelSuggestions);
          updateFilterWarning();
        }));

        function updateFilterWarning() {
          if (!LabelFilter.getLabelSelector().isEmpty() && $.isEmptyObject($scope.statefulSets) && !$.isEmptyObject($scope.unfilteredStatefulSets)) {
            $scope.alerts["statefulsets"] = {
              type: "warning",
              details: "The active filters are hiding all stateful sets."
            };
          }
          else {
            delete $scope.alerts["statefulsets"];
          }
        }

        LabelFilter.onActiveFiltersChanged(function(labelSelector) {
          // trigger a digest loop
          $scope.$apply(function() {
            $scope.statefulSets = labelSelector.select($scope.unfilteredStatefulSets);
            updateFilterWarning();
          });
        });

        $scope.$on('$destroy', function(){
          DataService.unwatchAll(watches);
        });

      }));
  });
