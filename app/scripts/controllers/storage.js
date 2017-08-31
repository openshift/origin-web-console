'use strict';

/**
 * @ngdoc function
 * @name openshiftConsole.controller:StorageController
 * @description
 * # StorageController
 * Controller of the openshiftConsole
 */
angular.module('openshiftConsole')
  .controller('StorageController', function ($routeParams, $scope, AlertMessageService, DataService, ProjectsService, QuotaService, $filter, LabelFilter, Logger, gettext) {
    $scope.projectName = $routeParams.project;
    $scope.pvcs = {};
    $scope.unfilteredPVCs = {};
    $scope.labelSuggestions = {};
    $scope.alerts = $scope.alerts || {};
    $scope.outOfClaims = false;
    $scope.emptyMessage = gettext("Loading...");

    var setOutOfClaimsWarning = function() {
      var isHidden = AlertMessageService.isAlertPermanentlyHidden("storage-quota-limit-reached", $scope.projectName);
      $scope.outOfClaims = QuotaService.isAnyStorageQuotaExceeded($scope.quotas, $scope.clusterQuotas);
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
    var watches = [];

    ProjectsService
      .get($routeParams.project)
      .then(_.spread(function(project, context) {
        $scope.project = project;
         watches.push(DataService.watch("persistentvolumeclaims", context, function(pvcs) {
          $scope.unfilteredPVCs = pvcs.by("metadata.name");
          LabelFilter.addLabelSuggestionsFromResources($scope.unfilteredPVCs, $scope.labelSuggestions);
          LabelFilter.setLabelSuggestions($scope.labelSuggestions);
          $scope.pvcs = LabelFilter.getLabelSelector().select($scope.unfilteredPVCs);
          $scope.emptyMessage = gettext("No persistent volume claims to show");
          updateFilterWarning();
          Logger.log("pvcs (subscribe)", $scope.unfilteredPVCs);
        }));

        function updateFilterWarning() {
          if (!LabelFilter.getLabelSelector().isEmpty() && $.isEmptyObject($scope.pvcs)  && !$.isEmptyObject($scope.unfilteredPVCs)) {
            $scope.alerts["storage"] = {
              type: "warning",
              details: "The active filters are hiding all persistent volume claims."
            };
          }
          else {
            delete $scope.alerts["storage"];
          }
        }

        LabelFilter.onActiveFiltersChanged(function(labelSelector) {
          // trigger a digest loop
          $scope.$apply(function() {
            $scope.pvcs = labelSelector.select($scope.unfilteredPVCs);
            updateFilterWarning();
          });
        });

        $scope.$on('$destroy', function(){
          DataService.unwatchAll(watches);
        });

        DataService.list('resourcequotas', { namespace: $scope.projectName }, function(quotaData) {
          $scope.quotas = quotaData.by('metadata.name');
          setOutOfClaimsWarning();
        });
        DataService.list('appliedclusterresourcequotas', { namespace: $scope.projectName }, function(quotaData) {
          $scope.clusterQuotas = quotaData.by('metadata.name');
          setOutOfClaimsWarning();
        });

      }));
  });
