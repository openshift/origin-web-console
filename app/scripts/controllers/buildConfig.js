'use strict';

/**
 * @ngdoc function
 * @name openshiftConsole.controller:BuildConfigController
 * @description
 * Controller of the openshiftConsole
 */
angular.module('openshiftConsole')
  .controller('BuildConfigController', function ($scope, $routeParams, DataService, ProjectsService, BuildsService, $filter, LabelFilter, AlertMessageService, gettextCatalog) {
    $scope.projectName = $routeParams.project;
    $scope.buildConfigName = $routeParams.buildconfig;
    $scope.buildConfig = null;
    $scope.labelSuggestions = {};
    $scope.alerts = {};
    $scope.breadcrumbs = [
      {
        title: gettextCatalog.getString("Builds"),
        link: "project/" + $routeParams.project + "/browse/builds"
      },
      {
        title: $routeParams.buildconfig
      }
    ];
    $scope.emptyMessage = gettextCatalog.getString("Loading...");

    AlertMessageService.getAlerts().forEach(function(alert) {
      $scope.alerts[alert.name] = alert.data;
    });
    AlertMessageService.clearAlerts();

    $scope.aceLoaded = function(editor) {
      var session = editor.getSession();
      session.setOption('tabSize', 2);
      session.setOption('useSoftTabs', true);
      editor.$blockScrolling = Infinity;
    };

    // Check for a ?tab=<name> query param to allow linking directly to a tab.
    if ($routeParams.tab) {
      $scope.selectedTab = {};
      $scope.selectedTab[$routeParams.tab] = true;
    }

    var orderByDate = $filter('orderObjectsByDate');
    var buildConfigForBuild = $filter('buildConfigForBuild');
    var buildStrategy = $filter('buildStrategy');
    var watches = [];

    // copy buildConfig and ensure it has env so that we can edit env vars using key-value-editor
    var copyBuildConfigAndEnsureEnv = function(buildConfig) {
      $scope.updatedBuildConfig = angular.copy(buildConfig);
      $scope.envVars = buildStrategy($scope.updatedBuildConfig).env || [];
    };

    ProjectsService
      .get($routeParams.project)
      .then(_.spread(function(project, context) {
        $scope.project = project;

        DataService.get("buildconfigs", $routeParams.buildconfig, context).then(
          // success
          function(buildConfig) {
            $scope.loaded = true;
            $scope.buildConfig = buildConfig;
            $scope.paused = BuildsService.isPaused($scope.buildConfig);

            if ($scope.buildConfig.spec.source.images) {
              $scope.imageSources = $scope.buildConfig.spec.source.images;
              $scope.imageSourcesPaths = [];
              $scope.imageSources.forEach(function(imageSource) {
                $scope.imageSourcesPaths.push($filter('destinationSourcePair')(imageSource.paths));
              });
            }

            copyBuildConfigAndEnsureEnv(buildConfig);

            $scope.saveEnvVars = function() {
              $scope.envVars = _.filter($scope.envVars, 'name');
              buildStrategy($scope.updatedBuildConfig).env = $scope.envVars;

              DataService
                .update("buildconfigs", $routeParams.buildconfig, $scope.updatedBuildConfig, context)
                .then(function success(){
                  // TODO:  de-duplicate success and error messages.
                  // as it stands, multiple messages appear based on how edit
                  // is made.
                  $scope.alerts['saveBCEnvVarsSuccess'] = {
                    type: "success",
                    // TODO:  improve success alert
                    message: $scope.buildConfigName + " was updated."
                  };
                }, function error(e){
                  $scope.alerts['saveBCEnvVarsError'] = {
                    type: "error",
                    message: gettextCatalog.getString("{{name}} was not updated.", {name: $scope.buildConfigName}),
                    details: gettextCatalog.getString("Reason: ") + $filter('getErrorDetails')(e)
                  };
                });
            };

            // If we found the item successfully, watch for changes on it
            watches.push(DataService.watchObject("buildconfigs", $routeParams.buildconfig, context, function(buildConfig, action) {
              if (action === "DELETED") {
                $scope.alerts["deleted"] = {
                  type: "warning",
                  message: gettextCatalog.getString("This build configuration has been deleted.")
                };
              }
              $scope.buildConfig = buildConfig;

              copyBuildConfigAndEnsureEnv(buildConfig);

              $scope.paused = BuildsService.isPaused($scope.buildConfig);
            }));
          },
          // failure
          function(e) {
            $scope.loaded = true;
            $scope.alerts["load"] = {
              type: "error",
              message: e.status === 404 ? gettextCatalog.getString("This build configuration can not be found, it may have been deleted.") : gettextCatalog.getString("The build configuration details could not be loaded."),
              details: e.status === 404 ? gettextCatalog.getString("Any remaining build history for this build will be shown.") : gettextCatalog.getString("Reason: ") + $filter('getErrorDetails')(e)
            };
          }
        );

      watches.push(DataService.watch("builds", context, function(builds, action, build) {
        $scope.emptyMessage = gettextCatalog.getString("No builds to show");
        if (!action) {
          $scope.unfilteredBuilds = BuildsService.validatedBuildsForBuildConfig($routeParams.buildconfig, builds.by('metadata.name'));
        } else {
          var buildConfigName = buildConfigForBuild(build);
          if (buildConfigName === $routeParams.buildconfig) {
            var buildName = build.metadata.name;
            switch (action) {
              case 'ADDED':
              case 'MODIFIED':
                $scope.unfilteredBuilds[buildName] = build;
                break;
              case 'DELETED':
                delete $scope.unfilteredBuilds[buildName];
                break;
            }
          }
        }

        $scope.builds = LabelFilter.getLabelSelector().select($scope.unfilteredBuilds);
        updateFilterWarning();
        LabelFilter.addLabelSuggestionsFromResources($scope.unfilteredBuilds, $scope.labelSuggestions);
        LabelFilter.setLabelSuggestions($scope.labelSuggestions);

        // Sort now to avoid sorting on every digest loop.
        $scope.orderedBuilds = orderByDate($scope.builds, true);
        $scope.latestBuild = $scope.orderedBuilds.length ? $scope.orderedBuilds[0] : null;
      },
      // params object for filtering
      {
        // http is passed to underlying $http calls
        http: {
          params: {
            // because build config names can be > 63 chars but label values can't
            // and we can't do a fieldSelector on annotations.  Plus old builds dont have the annotation.
            labelSelector: $filter('labelName')('buildConfig') + '=' + _.trunc($scope.buildConfigName, {length: 63, omission: ''})
          }
        }
      }));

        function updateFilterWarning() {
          if (!LabelFilter.getLabelSelector().isEmpty() && $.isEmptyObject($scope.builds) && !$.isEmptyObject($scope.unfilteredBuilds)) {
            $scope.alerts["builds"] = {
              type: "warning",
              details: gettextCatalog.getString("The active filters are hiding all builds.")
            };
          }
          else {
            delete $scope.alerts["builds"];
          }
        }

        LabelFilter.onActiveFiltersChanged(function(labelSelector) {
          // trigger a digest loop
          $scope.$apply(function() {
            $scope.builds = labelSelector.select($scope.unfilteredBuilds);
            $scope.orderedBuilds = orderByDate($scope.builds, true);
            $scope.latestBuild = $scope.orderedBuilds.length ? $scope.orderedBuilds[0] : null;
            updateFilterWarning();
          });
        });

        $scope.startBuild = function() {
          BuildsService
            .startBuild($scope.buildConfig.metadata.name, context)
            .then(function resolve(build) {
              // TODO: common alerts service to eliminate duplication
              $scope.alerts["create"] = {
                type: "success",
                message: gettextCatalog.getString("Build {{name}} has started.", {name: build.metadata.name})
              };
            }, function reject(result) {
              // TODO: common alerts service to eliminate duplication
              $scope.alerts["create"] = {
                type: "error",
                message: gettextCatalog.getString("An error occurred while starting the build."),
                details: $filter('getErrorDetails')(result)
              };
            });
        };

        $scope.$on('$destroy', function(){
          DataService.unwatchAll(watches);
        });

    }));
  });
