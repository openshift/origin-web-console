'use strict';

/**
 * @ngdoc function
 * @name openshiftConsole.controller:StorageController
 * @description
 * # StorageController
 * Controller of the openshiftConsole
 */
angular.module('openshiftConsole')
  .controller('StorageController',
              function ($filter,
                        $routeParams,
                        $scope,
                        APIService,
                        AlertMessageService,
                        DataService,
                        LabelFilter,
                        Logger,
                        ProjectsService,
                        QuotaService) {
    var quotaTypes = ['requests.storage', 'persistentvolumeclaims'];
    var watches = [];
    var setOutOfClaimsWarning = function(exceeded) {
      var isHidden = AlertMessageService.isAlertPermanentlyHidden("storage-quota-limit-reached", $scope.projectName);
      $scope.outOfClaims = exceeded;
      if (!isHidden && $scope.outOfClaims) {
        if ($scope.alerts['quotaExceeded']) {
          // Don't recreate the alert or it will reset the temporary hidden state
          return;
        }
        $scope.alerts['quotaExceeded'] = {
          type: 'warning',
          message: 'Storage quota limit has been reached. You will not be able to create any new storage.',
          links: [{
            href: "project/" + $scope.projectName + "/quota",
            label: "View Quota"
          },{
            href: "",
            label: "Don't Show Me Again",
            onClick: function() {
              // Hide the alert on future page loads.
              AlertMessageService.permanentlyHideAlert("storage-quota-limit-reached", $scope.projectName);

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

    $scope.alerts = $scope.alerts || {};
    $scope.labelSuggestions = {};
    $scope.outOfClaims = false;
    $scope.persistentVolumeClaimsVersion = APIService.getPreferredVersion('persistentvolumeclaims');
    $scope.projectName = $routeParams.project;
    $scope.pvcs = {};
    $scope.unfilteredPVCs = {};
    $scope.clearFilter = function() {
      LabelFilter.clear();
    };

    ProjectsService
      .get($routeParams.project)
      .then(_.spread(function(project, context) {
        $scope.project = project;
        QuotaService.isAnyCurrentQuotaExceeded(context, quotaTypes).then(setOutOfClaimsWarning);
        watches.push(DataService.watch($scope.persistentVolumeClaimsVersion, context, function(pvcs) {
          $scope.pvcsLoaded = true;
          $scope.unfilteredPVCs = pvcs.by("metadata.name");
          LabelFilter.addLabelSuggestionsFromResources($scope.unfilteredPVCs, $scope.labelSuggestions);
          LabelFilter.setLabelSuggestions($scope.labelSuggestions);
          $scope.pvcs = LabelFilter.getLabelSelector().select($scope.unfilteredPVCs);
          updateFilterWarning();
          Logger.log("pvcs (subscribe)", $scope.unfilteredPVCs);
        }));

        function updateFilterWarning() {
          $scope.filterWithZeroResults = !LabelFilter.getLabelSelector().isEmpty() && $.isEmptyObject($scope.pvcs) && !$.isEmptyObject($scope.unfilteredPVCs);
        }

        LabelFilter.onActiveFiltersChanged(function(labelSelector) {
          // trigger a digest loop
          $scope.$evalAsync(function() {
            $scope.pvcs = labelSelector.select($scope.unfilteredPVCs);
            updateFilterWarning();
          });
        });

        $scope.$on('$destroy', function(){
          DataService.unwatchAll(watches);
        });
    }));
  });
