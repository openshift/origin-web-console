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
    $scope,
    $http,
    $routeParams,
    DataService,
    $q,
    $location,
    TaskList,
    $parse,
    Navigate,
    Logger,
    $filter,
    imageObjectRefFilter,
    failureObjectNameFilter,
    ProjectsService,
    gettext) {
    var displayNameFilter = $filter('displayName');
    var watches = [];

    $scope.alerts = [];
    $scope.loginBaseUrl = DataService.openshiftAPIBaseUrl();
    $scope.buildConfigs = {};

    $scope.projectName = $routeParams.project;
    $scope.fromSampleRepo = $routeParams.fromSample;

    $scope.breadcrumbs = [
      {
        title: $scope.projectName,
        link: "project/" + $scope.projectName
      },
      {
        title: gettext("Add to Project"),
        link: "project/" + $scope.projectName + "/create"
      },
      {
        // Make history back the default by leaving off the link.
        title: $routeParams.breadcrumbTitle || $routeParams.name
      },
      {
        title: gettext("Next Steps")
      }
    ];

    ProjectsService
      .get($routeParams.project)
      .then(_.spread(function(project, context) {
        $scope.project = project;
        // Update project breadcrumb with display name.
        $scope.breadcrumbs[0].title = $filter('displayName')(project);
        watches.push(DataService.watch("buildconfigs", context, function(buildconfigs) {
          $scope.buildConfigs = buildconfigs.by("metadata.name");
          $scope.createdBuildConfig = $scope.buildConfigs[$routeParams.name];
          Logger.log("buildconfigs (subscribe)", $scope.buildConfigs);
        }));

        $scope.$on('$destroy', function(){
          DataService.unwatchAll(watches);
        });

      }));
  });
