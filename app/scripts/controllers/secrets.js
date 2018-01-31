'use strict';

/**
 * @ngdoc function
 * @name openshiftConsole.controller:SecretsController
 * @description
 * # ProjectController
 * Controller of the openshiftConsole
 */
angular.module('openshiftConsole')
  .controller('SecretsController',
              function ($routeParams,
                        $scope,
                        AlertMessageService,
                        APIService,
                        DataService,
                        LabelFilter,
                        ProjectsService,
                        QuotaService) {
    var watches = [];
    var quotaTypes = ['secrets'];
    var setQuotaExceededWarning = function(exceeded){
      var isHidden = AlertMessageService.isAlertPermanentlyHidden("secret-quota-limit-reached", $scope.projectName);
      $scope.quotaExceeded = exceeded;
      if (!isHidden && $scope.quotaExceeded) {
        if ($scope.alerts['quotaExceeded']) {
          // Don't recreate the alert or it will reset the temporary hidden state
          return;
        }
        $scope.alerts['quotaExceeded'] = {
          type: 'warning',
          message: 'Secret quota limit has been reached. You will not be able to create any new secrets.',
          links: [{
            href: "project/" + $scope.projectName + "/quota",
            label: "View Quota"
          },{
            href: "",
            label: "Don't Show Me Again",
            onClick: function() {
              // Hide the alert on future page loads.
              AlertMessageService.permanentlyHideAlert("secret-quota-limit-reached", $scope.projectName);

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

    $scope.projectName = $routeParams.project;
    $scope.labelSuggestions = {};
    $scope.alerts = $scope.alerts || {};
    $scope.quotaExceeded = false;
    $scope.secretsVersion = APIService.getPreferredVersion('secrets');
    $scope.clearFilter = function() {
      LabelFilter.clear();
    };

    ProjectsService
      .get($routeParams.project)
      .then(_.spread(function(project, context) {
        $scope.project = project;
        $scope.context = context;
        QuotaService.isAnyCurrentQuotaExceeded(context, quotaTypes).then(setQuotaExceededWarning);
        watches.push(DataService.watch($scope.secretsVersion, context, function(secrets) {
          $scope.unfilteredSecrets = _.sortBy(secrets.by("metadata.name"), ["type", "metadata.name"]);
          $scope.secretsLoaded = true;
          LabelFilter.addLabelSuggestionsFromResources($scope.unfilteredSecrets, $scope.labelSuggestions);
          LabelFilter.setLabelSuggestions($scope.labelSuggestions);
          $scope.secrets = LabelFilter.getLabelSelector().select($scope.unfilteredSecrets);
          updateFilterMessage();
        }));

        function updateFilterMessage() {
          $scope.filterWithZeroResults = !LabelFilter.getLabelSelector().isEmpty() && _.isEmpty($scope.secrets) && !_.isEmpty($scope.unfilteredSecrets);
        }

        LabelFilter.onActiveFiltersChanged(function(labelSelector) {
          // trigger a digest loop
          $scope.$evalAsync(function() {
            $scope.secrets = labelSelector.select($scope.unfilteredSecrets);
            updateFilterMessage();
          });
        });

        $scope.$on('$destroy', function(){
          DataService.unwatchAll(watches);
        });
    }));
  });
