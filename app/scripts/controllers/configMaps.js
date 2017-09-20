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
    $scope.alerts = $scope.alerts || {};
    $scope.loaded = false;
    $scope.labelSuggestions = {};
    $scope.configMapsVersion = APIService.getPreferredVersion('configmaps');
    var watches = [];
    var configMaps;

    var updateFilterWarning = function() {
      if (!LabelFilter.getLabelSelector().isEmpty() &&
          _.isEmpty($scope.configMaps) &&
          !_.isEmpty(configMaps)) {
        $scope.alerts["config-maps"] = {
          type: "warning",
          details: "The active filters are hiding all config maps."
        };
      } else {
        delete $scope.alerts["config-maps"];
      }
    };

    var updateLabelSuggestions = function() {
      LabelFilter.addLabelSuggestionsFromResources(configMaps, $scope.labelSuggestions);
      LabelFilter.setLabelSuggestions($scope.labelSuggestions);
    };

    var updateConfigMaps = function() {
      var filteredConfigMaps = LabelFilter.getLabelSelector().select(configMaps);
      $scope.configMaps = _.sortBy(filteredConfigMaps, 'metadata.name');
      updateFilterWarning();
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
          $scope.$apply(updateConfigMaps);
        });

        $scope.$on('$destroy', function(){
          DataService.unwatchAll(watches);
        });
      }));
  });
