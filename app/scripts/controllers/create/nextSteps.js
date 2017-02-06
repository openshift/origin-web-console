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
  .controller("NextStepsController", function($scope, $http, $routeParams, DataService, $q, $location, ProcessedTemplateService, TaskList, $parse, Navigate, Logger, $filter, imageObjectRefFilter, failureObjectNameFilter, ProjectsService) {
    var displayNameFilter = $filter('displayName');
    var watches = [];

    $scope.alerts = [];
    $scope.loginBaseUrl = DataService.openshiftAPIBaseUrl();
    $scope.buildConfigs = {};
    $scope.showParamsTable = false;

    $scope.projectName = $routeParams.project;
    $scope.fromSampleRepo = $routeParams.fromSample;

    $scope.breadcrumbs = [
      {
        title: $scope.projectName,
        link: "project/" + $scope.projectName
      },
      {
        title: "Add to Project",
        link: "project/" + $scope.projectName + "/create"
      },
      {
        // Make history back the default by leaving off the link.
        title: $routeParams.breadcrumbTitle || $routeParams.name
      },
      {
        title: "Next Steps"
      }
    ];

    var processedTemplateData = ProcessedTemplateService.getTemplateData();
    $scope.parameters = processedTemplateData.params;
    $scope.templateMessage = processedTemplateData.message;
    ProcessedTemplateService.clearTemplateData();

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

        var hasBuildConfigTrigger = function(type) {
          var triggers = _.get($scope,  'createdBuildConfig.spec.triggers', []);
          return _.some(triggers, { type: type });
        };

        $scope.createdBuildConfigWithGitHubTrigger = function() {
          return hasBuildConfigTrigger('GitHub');
        };

        $scope.createdBuildConfigWithConfigChangeTrigger = function() {
          return hasBuildConfigTrigger('ConfigChange');
        };

        $scope.allTasksSuccessful = function(tasks) {
          return !pendingTasks(tasks).length && !erroredTasks(tasks).length;
        };

        $scope.toggleParamsTable = function() {
          $scope.showParamsTable = true;
        };

        function erroredTasks(tasks) {
          var erroredTasks = [];
          angular.forEach(tasks, function(task) {
            if (task.hasErrors) {
              erroredTasks.push(task);
            }
          });
          return erroredTasks;
        }
        $scope.erroredTasks = erroredTasks;

        function pendingTasks(tasks) {
          var pendingTasks = [];
          angular.forEach(tasks, function(task) {
            if (task.status !== "completed") {
              pendingTasks.push(task);
            }
          });
          return pendingTasks;
        }
        $scope.pendingTasks = pendingTasks;

        $scope.$on('$destroy', function(){
          DataService.unwatchAll(watches);
        });

      }));
  });
