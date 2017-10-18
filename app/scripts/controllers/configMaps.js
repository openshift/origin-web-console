'use strict';

/**
 * @ngdoc function
 * @name openshiftConsole.controller:ConfigMapsController
 * @description
 * # ConfigMapsController
 * Controller of the openshiftConsole
 */
angular.module('openshiftConsole')
  .controller('ConfigMapsController',
              function ($scope,
                        $routeParams,
                        APIService,
                        DataService,
                        LabelFilter,
                        ProjectsService) {
    $scope.projectName = $routeParams.project;
    $scope.loaded = false;
    $scope.labelSuggestions = {};
    $scope.configMapsVersion = APIService.getPreferredVersion('configmaps');
    $scope.clearFilter = function () {
      LabelFilter.clear();
    };
    var watches = [];
    var configMaps;

    var updateFilterMessage = function() {
      $scope.filterWithZeroResults = !LabelFilter.getLabelSelector().isEmpty() && _.isEmpty($scope.configMaps) && !_.isEmpty(configMaps);
    };

    var updateLabelSuggestions = function() {
      LabelFilter.addLabelSuggestionsFromResources(configMaps, $scope.labelSuggestions);
      LabelFilter.setLabelSuggestions($scope.labelSuggestions);
    };

    var updateConfigMaps = function() {
      var filteredConfigMaps = LabelFilter.getLabelSelector().select(configMaps);
      $scope.configMaps = _.sortBy(filteredConfigMaps, 'metadata.name');
      updateFilterMessage();
    };

    ProjectsService
      .get($routeParams.project)
      .then(_.spread(function(project, context) {
        $scope.project = project;

        watches.push(DataService.watch($scope.configMapsVersion, context, function(configMapData) {
          configMaps = configMapData.by('metadata.name');
          updateLabelSuggestions();
          updateConfigMaps();
          $scope.loaded = true;
        }));

        LabelFilter.onActiveFiltersChanged(function() {
          $scope.$evalAsync(updateConfigMaps);
        });

        $scope.$on('$destroy', function(){
          DataService.unwatchAll(watches);
        });
      }));
  });
