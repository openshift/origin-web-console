"use strict";
/* jshint unused: false */

/**
 * @ngdoc function
 * @name openshiftConsole.controller:NextStepsController
 * @description
 * # NextStepsController
 * Controller of the openshiftConsole
 */
angular.module("openshiftConsole")
  .controller("NextStepsController", function(
    $filter,
    $routeParams,
    $scope,
    APIService,
    DataService,
    Logger,
    ProjectsService) {
    var displayNameFilter = $filter('displayName');
    var watches = [];

    $scope.alerts = [];
    $scope.loginBaseUrl = DataService.openshiftAPIBaseUrl();
    $scope.buildConfigs = {};

    $scope.projectName = $routeParams.project;
    $scope.fromSampleRepo = $routeParams.fromSample;
    $scope.name = $routeParams.name;

    var buildConfigsVersion = APIService.getPreferredVersion('buildconfigs');
    
    ProjectsService
      .get($routeParams.project)
      .then(_.spread(function(project, context) {
        $scope.project = project;
        watches.push(DataService.watch(buildConfigsVersion, context, function(buildconfigs) {
          $scope.buildConfigs = buildconfigs.by("metadata.name");
          $scope.createdBuildConfig = $scope.buildConfigs[$routeParams.name];
          Logger.log("buildconfigs (subscribe)", $scope.buildConfigs);
        }));

        $scope.$on('$destroy', function(){
          DataService.unwatchAll(watches);
        });

      }));
  });
