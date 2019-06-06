'use strict';

/**
 * @ngdoc function
 * @name openshiftConsole.controller:EventsController
 * @description
 * # EventsController
 * Controller of the openshiftConsole
 */
angular.module('openshiftConsole')
  .controller('EventsController', function ($routeParams, $scope, ProjectsService, gettextCatalog) {
    $scope.projectName = $routeParams.project;
    $scope.renderOptions = {
      hideFilterWidget: true
    };

    $scope.breadcrumbs = [
      {
        title: gettextCatalog.getString("Monitoring"),
        link: "project/" + $routeParams.project + "/monitoring"
      },
      {
        title: gettextCatalog.getString('Events')
      }
    ];

    ProjectsService
      .get($routeParams.project)
      .then(_.spread(function(project, context) {
        $scope.project = project;
        $scope.projectContext = context;
      }));
  });
