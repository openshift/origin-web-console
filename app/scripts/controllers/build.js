'use strict';

/**
 * @ngdoc function
 * @name openshiftConsole.controller:BuildController
 * @description
 * Controller of the openshiftConsole
 */
angular.module('openshiftConsole')
  .controller('BuildController', function ($scope,
                                           $filter,
                                           $routeParams,
                                           BuildsService,
                                           DataService,
                                           ModalsService,
                                           Navigate,
                                           ProjectsService) {
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

    $scope.breadcrumbs = [];

    if ($routeParams.isPipeline) {
      $scope.breadcrumbs.push({
        title: "Pipelines",
        link: "project/" + $routeParams.project + "/browse/pipelines"
      });

      if ($routeParams.buildconfig) {
        $scope.breadcrumbs.push({
          title: $routeParams.buildconfig,
          link: "project/" + $routeParams.project + "/browse/pipelines/" + $routeParams.buildconfig
        });
      }
    } else {
      $scope.breadcrumbs.push({
        title: "Builds",
        link: "project/" + $routeParams.project + "/browse/builds"
      });

      if ($routeParams.buildconfig) {
        $scope.breadcrumbs.push({
          title: $routeParams.buildconfig,
          link: "project/" + $routeParams.project + "/browse/builds/" + $routeParams.buildconfig
        });
      }
    }

    $scope.breadcrumbs.push({
      title: $routeParams.build
    });

    var watches = [];

    var setLogVars = function(build) {
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
        details: $filter('getErrorDetails')(e)
      };
    };

    var buildConfigResolved = function(buildConfig, action) {
      if (action === "DELETED") {
        $scope.alerts["deleted"] = {
          type: "warning",
          message: "Build configuration " + $scope.buildConfigName + " has been deleted."
        };
        $scope.buildConfigDeleted = true;
      }
      $scope.buildConfig = buildConfig;
      $scope.buildConfigPaused = BuildsService.isPaused($scope.buildConfig);
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
          BuildsService.cancelBuild($scope.build, $scope.buildConfigName);
        };

        $scope.cloneBuild = function() {
          if ($scope.build && $scope.canBuild) {
            BuildsService.cloneBuild($scope.build, $scope.buildConfigName);
          }
        };

        $scope.showJenkinsfileExamples = function() {
          ModalsService.showJenkinsfileExamples();
        };

        $scope.$on('$destroy', function(){
          DataService.unwatchAll(watches);
        });
      }));
  });
