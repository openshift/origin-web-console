'use strict';

/**
 * @ngdoc function
 * @name openshiftConsole.controller:EventsController
 * @description
 * # EventsController
 * Controller of the openshiftConsole
 */
angular.module('openshiftConsole')
  .controller('EventsController', function ($routeParams, $scope, ProjectsService) {
    $scope.projectName = $routeParams.project;
    $scope.renderOptions = {
      hideFilterWidget: true
    };

    $scope.breadcrumbs = [
      {
        title: "Monitoring",
        link: "project/" + $routeParams.project + "/monitoring"
      },
      {
        title: 'Events'
      }
    ];

    ProjectsService
      .get($routeParams.project)
      .then(_.spread(function(project, context) {
        $scope.project = project;
        $scope.projectContext = context;
      }));
  });
