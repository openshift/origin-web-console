'use strict';

/**
 * @ngdoc function
 * @name openshiftConsole.controller:SecretsController
 * @description
 * # ProjectController
 * Controller of the openshiftConsole
 */
angular.module('openshiftConsole')
  .controller('SecretsController', function (
    $routeParams,
    $scope,
    APIService,
    DataService,
    LabelFilter,
    ProjectsService) {
    $scope.projectName = $routeParams.project;
    $scope.labelSuggestions = {};
    $scope.clearFilter = function() {
      LabelFilter.clear();
    };

    $scope.secretsVersion = APIService.getPreferredVersion('secrets');

    var watches = [];

    ProjectsService
      .get($routeParams.project)
      .then(_.spread(function(project, context) {
        $scope.project = project;
        $scope.context = context;
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
