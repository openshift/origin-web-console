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
                        AlertMessageService,
                        APIService,
                        DataService,
                        LabelFilter,
                        ProjectsService,
                        QuotaService) {
    var configMaps;
    var quotaTypes = ['configmaps'];
    var watches = [];

    var setQuotaExceededWarning = function(exceeded) {
      var isHidden = AlertMessageService.isAlertPermanentlyHidden("configmaps-quota-limit-reached", $scope.projectName);
      $scope.quotaExceeded = exceeded;
      if (!isHidden && $scope.quotaExceeded) {
        if ($scope.alerts['quotaExceeded']) {
          // Don't recreate the alert or it will reset the temporary hidden state
          return;
        }
        $scope.alerts['quotaExceeded'] = {
          type: 'warning',
          message: 'Config Maps quota limit has been reached. You will not be able to create any new Config Maps.',
          links: [{
            href: "project/" + $scope.projectName + "/quota",
            label: "View Quota"
          },{
            href: "",
            label: "Don't Show Me Again",
            onClick: function() {
              // Hide the alert on future page loads.
              AlertMessageService.permanentlyHideAlert("configmaps-quota-limit-reached", $scope.projectName);

              // Return true close the existing alert.
              return true;
            }
          }]
        };
      }
      else {
        delete $scope.alerts['quotaExceeded'];
      }
    };

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

    $scope.projectName = $routeParams.project;
    $scope.loaded = false;
    $scope.alerts = $scope.alerts || {};
    $scope.quotaExceeded = false;
    $scope.labelSuggestions = {};
    $scope.configMapsVersion = APIService.getPreferredVersion('configmaps');
    $scope.clearFilter = function () {
      LabelFilter.clear();
    };

    ProjectsService
      .get($routeParams.project)
      .then(_.spread(function(project, context) {
        $scope.project = project;
        QuotaService.isAnyCurrentQuotaExceeded(context, quotaTypes).then(setQuotaExceededWarning);
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
