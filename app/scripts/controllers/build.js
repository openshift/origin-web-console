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

    var buildResolved = function(build, action) {
      $scope.loaded = true;
      $scope.build = build;
      setLogVars(build);
      var buildNumber = $filter("annotation")(build, "buildNumber");
      if (buildNumber) {
        $scope.breadcrumbs[2].title = "#" + buildNumber;
      }
      if (action === "DELETED") {
        $scope.alerts["deleted"] = {
          type: "warning",
          message: "This build has been deleted."
        };
      }
    };

    var buildRejected = function(e) {
      $scope.loaded = true;
      $scope.alerts["load"] = {
        type: "error",
        message: "The build details could not be loaded.",
        details: "Reason: " + $filter('getErrorDetails')(e)
      };
    };

    var buildConfigResolved = function(buildConfig, action) {
      if (action === "DELETED") {
        $scope.alerts["deleted"] = {
          type: "warning",
          message: "Build configuration " + $scope.buildConfigName + " has been deleted."
        };
      }
      $scope.buildConfig = buildConfig;
      $scope.paused = BuildsService.isPaused($scope.buildConfig);
      updateCanBuild();
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
        DataService
          .get("builds", $routeParams.build, context)
          .then(function(build) {
            buildResolved(build);
            watches.push(DataService.watchObject("builds", $routeParams.build, context, buildResolved));
            watches.push(DataService.watchObject("buildconfigs", $routeParams.buildconfig, context, buildConfigResolved));
          }, buildRejected);

        $scope.toggleSecret = function() {
          $scope.showSecret = true;
        };

        $scope.cancelBuild = function() {
          BuildsService
            .cancelBuild($scope.build, $scope.buildConfigName, context)
            .then(function resolve(build) {
              // TODO: common alerts service to eliminate duplication
              $scope.alerts["cancel"] = {
                type: "success",
                message: "Cancelling build " + build.metadata.name + " of " + $scope.buildConfigName + "."
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

        $scope.cloneBuild = function() {
          var name = _.get($scope, 'build.metadata.name');
          if (name && $scope.canBuild) {
            BuildsService
              .cloneBuild(name, context)
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
          }
        };

        $scope.$on('$destroy', function(){
          DataService.unwatchAll(watches);
        });
      }));
  });
