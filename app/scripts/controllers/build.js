'use strict';

/**
 * @ngdoc function
 * @name openshiftConsole.controller:BuildController
 * @description
 * Controller of the openshiftConsole
 */
angular.module('openshiftConsole')
  .controller('BuildController', function ($scope, $routeParams, DataService, ProjectsService, BuildsService, $filter) {
    $scope.projectName = $routeParams.project;
    $scope.build = null;
    $scope.buildConfig = null;
    $scope.buildConfigName = $routeParams.buildconfig;
    $scope.builds = {};
    $scope.alerts = {};
    $scope.showSecret = false;
    $scope.renderOptions = {
      hideFilterWidget: true
    };
    $scope.breadcrumbs = [
      {
        title: "Builds",
        link: "project/" + $routeParams.project + "/browse/builds"
      }
    ];

    if ($routeParams.buildconfig) {
      $scope.breadcrumbs.push({
        title: $routeParams.buildconfig,
        link: "project/" + $routeParams.project + "/browse/builds/" + $routeParams.buildconfig
      });
    }

    $scope.breadcrumbs.push({
      title: $routeParams.build
    });

    // Check for a ?tab=<name> query param to allow linking directly to a tab.
    if ($routeParams.tab) {
      $scope.selectedTab = {};
      $scope.selectedTab[$routeParams.tab] = true;
    }

    var buildConfigForBuild = $filter('buildConfigForBuild');

    var watches = [];

    var setLogVars = function(build) {
      $scope.logOptions.container = $filter("annotation")(build, "buildPod");
      $scope.logCanRun = !(_.includes(['New', 'Pending', 'Error'], build.status.phase));
    };

    var updateCanBuild = function() {
      if (!$scope.buildConfig) {
        $scope.canBuild = false;
      } else {
        $scope.canBuild = BuildsService.canBuild($scope.buildConfig);
      }
    };

    ProjectsService
      .get($routeParams.project)
      .then(_.spread(function(project, context) {
        $scope.project = project;

        // FIXME: DataService.createStream() requires a scope with a
        // projectPromise rather than just a namespace, so we have to pass the
        // context into the log-viewer directive.
        $scope.projectContext = context;
        $scope.logOptions = {};
        DataService.get("builds", $routeParams.build, context).then(
          // success
          function(build) {

            $scope.loaded = true;
            $scope.build = build;
            setLogVars(build);
            var buildNumber = $filter("annotation")(build, "buildNumber");
            if (buildNumber) {
              $scope.breadcrumbs[2].title = "#" + buildNumber;
            }

            // If we found the item successfully, watch for changes on it
            watches.push(DataService.watchObject("builds", $routeParams.build, context, function(build, action) {
              if (action === "DELETED") {
                $scope.alerts["deleted"] = {
                  type: "warning",
                  message: "This build has been deleted."
                };
              }
              $scope.build = build;
              setLogVars(build);
            }));
            watches.push(DataService.watchObject("buildconfigs", $routeParams.buildconfig, context, function(buildConfig, action) {
              if (action === "DELETED") {
                $scope.alerts["deleted"] = {
                  type: "warning",
                  message: "Build configuration " + $scope.buildConfigName + " has been deleted."
                };
              }
              $scope.buildConfig = buildConfig;
              $scope.paused = BuildsService.isPaused($scope.buildConfig);
              updateCanBuild();
            }));
          },
          // failure
          function(e) {
            $scope.loaded = true;
            $scope.alerts["load"] = {
              type: "error",
              message: "The build details could not be loaded.",
              details: "Reason: " + $filter('getErrorDetails')(e)
            };
          }
        );

        watches.push(DataService.watch("builds", context, function(builds, action, build) {
          if (!action) {
            $scope.builds = BuildsService.validatedBuildsForBuildConfig($routeParams.buildconfig, builds.by('metadata.name'));            
          } else {
            var buildConfigName = buildConfigForBuild(build);
            if (buildConfigName === $routeParams.buildconfig) {
              var buildName = build.metadata.name;
              switch (action) {
                case 'ADDED':
                case 'MODIFIED':
                  $scope.builds[buildName] = build;
                  break;
                case 'DELETED':
                  delete $scope.builds[buildName];
                  break;
              }
            }
          }

          updateCanBuild();
        },
        // params object for filtering
        {
          // http is passed to underlying $http calls
          http: {
            params: {
              // because build config names can be > 63 chars but label values can't
              // and we can't do a fieldSelector on annotations.  Plus old builds dont have the annotation.
              labelSelector: $filter('labelName')('buildConfig') + '=' + _.trunc($routeParams.buildconfig, {length: 63, omission: ''})
            }
          }
        }));

        $scope.toggleSecret = function() {
          $scope.showSecret = true;
        };

        $scope.cancelBuild = function() {
          BuildsService.cancelBuild($scope.build, $scope.buildConfigName, context, $scope);
        };

        $scope.cloneBuild = function() {
          var name = _.get($scope, 'build.metadata.name');
          if (name && $scope.canBuild) {
            BuildsService.cloneBuild(name, context, $scope);
          }
        };

        $scope.$on('$destroy', function(){
          DataService.unwatchAll(watches);
        });
      }));
  });
