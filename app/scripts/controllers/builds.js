'use strict';

/**
 * @ngdoc function
 * @name openshiftConsole.controller:BuildsController
 * @description
 * # ProjectController
 * Controller of the openshiftConsole
 */
angular.module('openshiftConsole')
  .controller('BuildsController', function ($routeParams, $scope, AlertMessageService, DataService, $filter, LabelFilter, Logger, $location, BuildsService, ProjectsService, gettextCatalog) {
    $scope.projectName = $routeParams.project;
    $scope.builds = {};
    $scope.unfilteredBuildConfigs = {};
    $scope.buildConfigs = undefined;
    $scope.labelSuggestions = {};
    $scope.alerts = $scope.alerts || {};
    $scope.emptyMessage = gettextCatalog.getString("Loading...");
    $scope.buildsByBuildConfig = {};

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
        watches.push(DataService.watch("builds", context, function(builds, action, build) {
          $scope.builds = builds.by("metadata.name");
          $scope.emptyMessage = gettextCatalog.getString("No builds to show");
          associateBuildsToBuildConfig();

          var buildConfigName;
          var buildName;
          if (build) {
            buildConfigName = buildConfigForBuild(build);
            buildName = build.metadata.name;
          }

          Logger.log("builds (subscribe)", $scope.builds);
        }));

        watches.push(DataService.watch("buildconfigs", context, function(buildConfigs) {
          $scope.unfilteredBuildConfigs = buildConfigs.by("metadata.name");
          LabelFilter.addLabelSuggestionsFromResources($scope.unfilteredBuildConfigs, $scope.labelSuggestions);
          LabelFilter.setLabelSuggestions($scope.labelSuggestions);
          $scope.buildConfigs = LabelFilter.getLabelSelector().select($scope.unfilteredBuildConfigs);
          associateBuildsToBuildConfig();
          updateFilterWarning();
          Logger.log("buildconfigs (subscribe)", $scope.buildConfigs);
        }));

        // Used to determine whether the build should be added to the buildsByBuildConfig map
        // based on current filtering state
        function showBuild(build) {
          // If we aren't filtering by labels, show the build
          var labelSelector = LabelFilter.getLabelSelector();
          if (labelSelector.isEmpty()) {
            return true;
          }

          // If we are filtering, and the build is owned by a build config
          // then the build config will control whether the row is shown
          var buildConfigName = buildConfigForBuild(build) || "";
          if (buildConfigName) {
            return !!$scope.buildConfigs[buildConfigName];
          }

          // Otherwise this build has no build config and so will have its own
          // row, so see if the current filter matches it
          return labelSelector.matches(build);
        }

        function associateBuildsToBuildConfig() {
          $scope.buildsByBuildConfig = {};
          angular.forEach($scope.builds, function(build, buildName) {
            var buildConfigName = buildConfigForBuild(build) || "";
            if (showBuild(build)) {
              $scope.buildsByBuildConfig[buildConfigName] = $scope.buildsByBuildConfig[buildConfigName] || {};
              $scope.buildsByBuildConfig[buildConfigName][buildName] = build;
            }
          });
          // Make sure there is an empty hash for every build config we know about
          angular.forEach($scope.buildConfigs, function(buildConfig, buildConfigName){
            $scope.buildsByBuildConfig[buildConfigName] = $scope.buildsByBuildConfig[buildConfigName] || {};
          });
        }

        function updateFilterWarning() {
          if (!LabelFilter.getLabelSelector().isEmpty() && $.isEmptyObject($scope.buildsByBuildConfig)) {
            $scope.alerts["builds"] = {
              type: "warning",
              details: gettextCatalog.getString("The active filters are hiding all builds.")
            };
          }
          else {
            delete $scope.alerts["builds"];
          }
        }

        $scope.startBuild = function(buildConfigName) {
          BuildsService
            .startBuild(buildConfigName, context)
            .then(function resolve(build) {
              // TODO: common alerts service to eliminate duplication
              $scope.alerts["create"] = {
                type: "success",
                message: "Build " + build.metadata.name + " has started."
              };
            }, function reject(result) {
              // TODO: common alerts service to eliminate duplication
              $scope.alerts["create"] = {
                type: "error",
                message: "An error occurred while starting the build.",
                details: $filter('getErrorDetails')(result)
              };
            });
        };

        $scope.cancelBuild = function(build, buildConfigName) {
          BuildsService
            .cancelBuild(build, buildConfigName, context)
            .then(function resolve(build) {
              // TODO: common alerts service to eliminate duplication
              $scope.alerts["cancel"] = {
                type: "success",
                message: "Cancelling build " + build.metadata.name + " of " + buildConfigName + "."
              };
            }, function reject(result) {
              // TODO: common alerts service to eliminate duplication
              $scope.alerts["cancel"] = {
                type: "error",
                message: "An error occurred cancelling the build.",
                details: $filter('getErrorDetails')(result)
              };
            });
        };

        $scope.cloneBuild = function(buildName) {
          BuildsService
            .cloneBuild(buildName, context)
            .then(function resolve(build) {
              var logLink = $filter('buildLogURL')(build);
              $scope.alerts["rebuild"] = {
                type: "success",
                message: "Build " + name + " is being rebuilt as " + build.metadata.name + ".",
                links: logLink ? [{
                  href: logLink,
                  label: "View Log"
                }] : undefined
              };
            }, function reject(result) {
              $scope.alerts["rebuild"] = {
                type: "error",
                message: "An error occurred while rerunning the build.",
                details: $filter('getErrorDetails')(result)
              };
            });
        };

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
