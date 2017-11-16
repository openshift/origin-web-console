'use strict';

angular.module('openshiftConsole')
  .controller('StatefulSetsController',
              function($scope,
                       $routeParams,
                       APIService,
                       DataService,
                       ProjectsService,
                       LabelFilter,
                       PodsService) {
    $scope.projectName = $routeParams.project;
    $scope.labelSuggestions = {};
    $scope.clearFilter = function() {
      LabelFilter.clear();
    };

    var podsVersion = APIService.getPreferredVersion('pods');
    var statefulSetsVersion = APIService.getPreferredVersion('statefulsets');

    var watches = [];
    ProjectsService
      .get($routeParams.project)
      .then(_.spread(function(project, context) {
        $scope.project = project;

        watches.push(DataService.watch(statefulSetsVersion, context, function(statefulSets) {
          angular.extend($scope, {
            loaded: true,
            unfilteredStatefulSets: statefulSets.by('metadata.name')
          });
          $scope.statefulSets = LabelFilter.getLabelSelector().select($scope.unfilteredStatefulSets);
          LabelFilter.addLabelSuggestionsFromResources($scope.unfilteredStatefulSets, $scope.labelSuggestions);
          LabelFilter.setLabelSuggestions($scope.labelSuggestions);
          updateFilterMessage();
        }));

        // TODO: 1.6 eliminate this block, we dont actually need pods on this page,
        // we are just using to fix the fact that the replicas count in inaccurate
        watches.push(DataService.watch(podsVersion, context, function(podData) {
          $scope.pods = podData.by('metadata.name');
          $scope.podsByOwnerUID = PodsService.groupByOwnerUID($scope.pods);
        }));

        function updateFilterMessage() {
          $scope.filterWithZeroResults = !LabelFilter.getLabelSelector().isEmpty() && _.isEmpty($scope.statefulSets) && !_.isEmpty($scope.unfilteredStatefulSets);
        }

        LabelFilter.onActiveFiltersChanged(function(labelSelector) {
          // trigger a digest loop
          $scope.$evalAsync(function() {
            $scope.statefulSets = labelSelector.select($scope.unfilteredStatefulSets);
            updateFilterMessage();
          });
        });

        $scope.$on('$destroy', function(){
          DataService.unwatchAll(watches);
        });

      }));
  });
