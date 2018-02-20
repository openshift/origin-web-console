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
                                           APIService,
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

    $scope.buildsVersion = APIService.getPreferredVersion('builds');
    $scope.buildsCloneVersion = APIService.getPreferredVersion('builds/clone');
    $scope.buildsLogVersion = APIService.getPreferredVersion('builds/log');
    $scope.buildConfigsVersion = APIService.getPreferredVersion('buildconfigs');
    $scope.eventsVersion = APIService.getPreferredVersion('events');
    $scope.podsVersion = APIService.getPreferredVersion('pods');

    var buildPod;
    var annotation = $filter('annotation');
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


    ProjectsService
      .get($routeParams.project)
      .then(_.spread(function(project, context) {
        $scope.project = project;

        // FIXME: DataService.createStream() requires a scope with a
        // projectPromise rather than just a namespace, so we have to pass the
        // context into the log-viewer directive.
        $scope.projectContext = context;
        $scope.logOptions = {};

        var updateEventObjects = function() {
          if (buildPod) {
            $scope.eventObjects = [$scope.build, buildPod];
          } else {
            $scope.eventObjects = [$scope.build];
          }
        };

        var buildResolved = function(build, action) {
          $scope.loaded = true;
          $scope.build = build;
          setLogVars(build);
          updateEventObjects();

          var buildNumber = annotation(build, "buildNumber");
          if (buildNumber) {
            // tmp fix for issue #1942
            if($scope.breadcrumbs[2]) {
              $scope.breadcrumbs[2].title = "#" + buildNumber;
            }
          }
          if (action === "DELETED") {
            $scope.alerts["deleted"] = {
              type: "warning",
              message: "This build has been deleted."
            };
          }

          var buildPodName;
          if (!buildPod) {
            buildPodName = annotation(build, 'buildPod');
            if (buildPodName) {
              // Don't show an error if we can't get the build pod. Often it will have been deleted.
              DataService.get($scope.podsVersion, buildPodName, context, { errorNotification: false }).then(function(response) {
                buildPod = response;
                updateEventObjects();
              });
            }
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


        DataService
          .get($scope.buildsVersion, $routeParams.build, context, { errorNotification: false })
          .then(function(build) {
            buildResolved(build);
            watches.push(DataService.watchObject($scope.buildsVersion, $routeParams.build, context, buildResolved));
            watches.push(DataService.watchObject($scope.buildConfigsVersion, $routeParams.buildconfig, context, buildConfigResolved));
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
