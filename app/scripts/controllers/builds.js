'use strict';

/**
 * @ngdoc function
 * @name openshiftConsole.controller:BuildsController
 * @description
 * # ProjectController
 * Controller of the openshiftConsole
 */
angular.module('openshiftConsole')
  .controller('BuildsController', function ($routeParams, $scope, AlertMessageService, DataService, $filter, LabelFilter, Logger, $location, BuildsService, ProjectsService, Scopes) {
    angular.extend($scope, Scopes.getControllerDefaults());
    $scope.projectName = $routeParams.project;
    $scope.builds = {};
    $scope.unfilteredBuildConfigs = {};
    $scope.buildConfigs = undefined;
    $scope.latestByConfig = {};

    // get and clear any alerts
    AlertMessageService.getAlerts().forEach(function(alert) {
      $scope.alerts[alert.name] = alert.data;
    });
    AlertMessageService.clearAlerts();

    var buildConfigForBuild = $filter('buildConfigForBuild');

    var watches = [];

    ProjectsService
      .get($routeParams.project)
      .then(_.spread(function(project, context) {
        $scope.project = project;

        var isPipeline = $filter('isJenkinsPipelineStrategy');

        watches.push(DataService.watch("builds", context, function(builds) {
          // Filter out pipeline builds, which have a separate page.
          $scope.builds = _.omit(builds.by("metadata.name"), isPipeline);
          $scope.emptyMessage = "No builds to show";
          associateBuildsToBuildConfig();
          LabelFilter.addLabelSuggestionsFromResources($scope.builds, $scope.labelSuggestions);

          Logger.log("builds (subscribe)", $scope.builds);
        }));

        watches.push(DataService.watch("buildconfigs", context, function(buildConfigs) {
          // Filter out pipeline builds, which have a separate page.
          $scope.unfilteredBuildConfigs = _.omit(buildConfigs.by("metadata.name"), isPipeline);
          LabelFilter.addLabelSuggestionsFromResources($scope.unfilteredBuildConfigs, $scope.labelSuggestions);
          LabelFilter.setLabelSuggestions($scope.labelSuggestions);
          $scope.buildConfigs = LabelFilter.getLabelSelector().select($scope.unfilteredBuildConfigs);
          associateBuildsToBuildConfig();
          updateFilterWarning();
          Logger.log("buildconfigs (subscribe)", $scope.buildConfigs);
        }));

        // Used to determine whether the build should be added to the
        // latestByConfig map based on current filtering state
        function showBuild(build) {
          // If we aren't filtering by labels, show the build
          var labelSelector = LabelFilter.getLabelSelector();
          if (labelSelector.isEmpty()) {
            return true;
          }

          // If we are filtering, and the build is owned by a build config
          // then the build config will control whether the row is shown
          var buildConfigName = buildConfigForBuild(build) || "";
          if (buildConfigName && $scope.unfilteredBuildConfigs[buildConfigName]) {
            return !!$scope.buildConfigs[buildConfigName];
          }

          // Otherwise this build has no build config and so will have its own
          // row, so see if the current filter matches it
          return labelSelector.matches(build);
        }

        function associateBuildsToBuildConfig() {
          $scope.latestByConfig = BuildsService.latestBuildByConfig($scope.builds, showBuild);
          // Make sure there is a key for every build config we know about
          angular.forEach($scope.buildConfigs, function(buildConfig, buildConfigName){
            $scope.latestByConfig[buildConfigName] = $scope.latestByConfig[buildConfigName] || null;
          });
        }

        function updateFilterWarning() {
          var visibleBuilds = _.omit($scope.latestByConfig, _.isNull);
          if (!LabelFilter.getLabelSelector().isEmpty() &&
              _.isEmpty($scope.buildConfigs) &&
              _.isEmpty(visibleBuilds)) {
            $scope.alerts["builds"] = {
              type: "warning",
              details: "The active filters are hiding all builds."
            };
          }
          else {
            delete $scope.alerts["builds"];
          }
        }

        LabelFilter.onActiveFiltersChanged(function(labelSelector) {
          // trigger a digest loop
          $scope.$apply(function() {
            $scope.buildConfigs = labelSelector.select($scope.unfilteredBuildConfigs);
            associateBuildsToBuildConfig();
            updateFilterWarning();
          });
        });

        $scope.$on('$destroy', function(){
          DataService.unwatchAll(watches);
        });
      }));
  });
