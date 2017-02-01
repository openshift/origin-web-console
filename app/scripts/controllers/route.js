'use strict';

/**
 * @ngdoc function
 * @name openshiftConsole.controller:RouteController
 * @description
 * Controller of the openshiftConsole
 */
angular.module('openshiftConsole')
  .controller('RouteController', function ($scope, $routeParams, AlertMessageService, DataService, ProjectsService, $filter) {
    $scope.projectName = $routeParams.project;
    $scope.route = null;
    $scope.alerts = {};
    $scope.renderOptions = $scope.renderOptions || {};
    $scope.renderOptions.hideFilterWidget = true;
    $scope.breadcrumbs = [
      {
        title: "Routes",
        link: "project/" + $routeParams.project + "/browse/routes"
      },
      {
        title: $routeParams.route
      }
    ];

    AlertMessageService.getAlerts().forEach(function(alert) {
      $scope.alerts[alert.name] = alert.data;
    });

    AlertMessageService.clearAlerts();

    var watches = [];

    var routeResolved = function(route, action) {
      $scope.loaded = true;
      $scope.route = route;
      if (action === "DELETED") {
        $scope.alerts["deleted"] = {
          type: "warning",
          message: "This route has been deleted."
        };
      }
    };

    ProjectsService
      .get($routeParams.project)
      .then(_.spread(function(project, context) {
        $scope.project = project;

        DataService
          .get("routes", $routeParams.route, context)
          .then(function(route) {
            routeResolved(route);
            watches.push(DataService.watchObject("routes", $routeParams.route, context, routeResolved));
          }, function(e) {
            $scope.loaded = true;
            $scope.alerts["load"] = {
              type: "error",
              message: "The route details could not be loaded.",
              details: "Reason: " + $filter('getErrorDetails')(e)
            };
          });

        // Watch services to display route warnings.
        watches.push(DataService.watch("services", context, function(services) {
          $scope.services = services.by("metadata.name");
        }));

        $scope.$on('$destroy', function(){
          DataService.unwatchAll(watches);
        });

      }));
  });
