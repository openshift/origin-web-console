'use strict';

/**
 * @ngdoc function
 * @name openshiftConsole.controller:BuildsController
 * @description
 * # ProjectController
 * Controller of the openshiftConsole
 */
angular.module('openshiftConsole')
  .controller('BuildsController', function (
    $filter,
    $location,
    $routeParams,
    $scope,
    APIService,
    BuildsService,
    DataService,
    LabelFilter,
    Logger,
    ProjectsService) {
    $scope.projectName = $routeParams.project;
    $scope.builds = {};
    $scope.unfilteredBuildConfigs = {};
    $scope.buildConfigs = undefined;
    $scope.labelSuggestions = {};
    $scope.latestByConfig = {};
    $scope.clearFilter = function() {
      LabelFilter.clear();
    };

    var buildConfigForBuild = $filter('buildConfigForBuild');

    var buildsVersion = APIService.getPreferredVersion('builds');
    var buildConfigsVersion = APIService.getPreferredVersion('buildconfigs');

    var watches = [];

    ProjectsService
      .get($routeParams.project)
      .then(_.spread(function(project, context) {
        $scope.project = project;

        var isPipeline = $filter('isJenkinsPipelineStrategy');

        watches.push(DataService.watch(buildsVersion, context, function(builds) {
          $scope.buildsLoaded = true;
          // Filter out pipeline builds, which have a separate page.
          $scope.builds = _.omitBy(builds.by("metadata.name"), isPipeline);
          associateBuildsToBuildConfig();
          LabelFilter.addLabelSuggestionsFromResources($scope.builds, $scope.labelSuggestions);

          Logger.log("builds (subscribe)", $scope.builds);
        }));

        watches.push(DataService.watch(buildConfigsVersion, context, function(buildConfigs) {
          // Filter out pipeline builds, which have a separate page.
          $scope.unfilteredBuildConfigs = _.omitBy(buildConfigs.by("metadata.name"), isPipeline);
          LabelFilter.addLabelSuggestionsFromResources($scope.unfilteredBuildConfigs, $scope.labelSuggestions);
          LabelFilter.setLabelSuggestions($scope.labelSuggestions);
          $scope.buildConfigs = LabelFilter.getLabelSelector().select($scope.unfilteredBuildConfigs);
          associateBuildsToBuildConfig();
          updateFilterMessage();
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

        // Used to determine whether the build should be added to the
        // buildsNoConfig map based on current filtering state
        function showBuildNoConfigOnly(build) {
          // Exclude builds from a build config
          var buildConfigName = buildConfigForBuild(build);
          if (buildConfigName) {
            return false;
          }

          // If we aren't filtering by labels, show the build
          var labelSelector = LabelFilter.getLabelSelector();
          if (labelSelector.isEmpty()) {
            return true;
          }

          // Otherwise this build has no build config and so will have its own
          // row, so see if the current filter matches it
          return labelSelector.matches(build);
        }

        function associateBuildsToBuildConfig() {
          $scope.latestByConfig = BuildsService.latestBuildByConfig($scope.builds, showBuild);
          $scope.buildsNoConfig = _.pickBy($scope.builds, showBuildNoConfigOnly);
          // Make sure there is a key for every build config we know about
          angular.forEach($scope.buildConfigs, function(buildConfig, buildConfigName){
            $scope.latestByConfig[buildConfigName] = $scope.latestByConfig[buildConfigName] || null;
          });
        }

        function updateFilterMessage() {
          var visibleBuilds = _.omitBy($scope.latestByConfig, _.isNull);
          $scope.filterWithZeroResults = !LabelFilter.getLabelSelector().isEmpty() && _.isEmpty($scope.buildConfigs) && _.isEmpty(visibleBuilds);
        }

        LabelFilter.onActiveFiltersChanged(function(labelSelector) {
          // trigger a digest loop
          $scope.$evalAsync(function() {
            $scope.buildConfigs = labelSelector.select($scope.unfilteredBuildConfigs);
            associateBuildsToBuildConfig();
            updateFilterMessage();
          });
        });

        $scope.$on('$destroy', function(){
          DataService.unwatchAll(watches);
        });
      }));
  });
