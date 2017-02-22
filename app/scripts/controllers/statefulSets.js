'use strict';

angular.module('openshiftConsole')
  .controller('StatefulSetsController', function($scope, $routeParams, AlertMessageService, DataService, ProjectsService, LabelFilter, LabelsService) {
    $scope.projectName = $routeParams.project;
    $scope.alerts = $scope.alerts || {};
    $scope.labelSuggestions = {};

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

        // TODO: 1.6 eliminate this block, we dont actually need pods on this page,
        // we are just using to fix the fact that the replicas count in inaccurate
        watches.push(DataService.watch('pods', context, function(podData) {
          $scope.pods = podData.by('metadata.name');
          $scope.podsByOwnerUID = LabelsService.groupBySelector($scope.pods, $scope.statefulSets, { key: 'metadata.uid' });
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
