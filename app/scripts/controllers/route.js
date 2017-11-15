'use strict';

/**
 * @ngdoc function
 * @name openshiftConsole.controller:RouteController
 * @description
 * Controller of the openshiftConsole
 */
angular.module('openshiftConsole')
  .controller('RouteController',
              function($scope,
                       $filter,
                       $routeParams,
                       AlertMessageService,
                       APIService,
                       DataService,
                       ProjectsService,
                       RoutesService) {
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

    var servicesVersion = APIService.getPreferredVersion('services');
    $scope.routesVersion = APIService.getPreferredVersion('routes');

    var watches = [];

    var isCustomHost;
    var routeResolved = function(route, action) {
      $scope.loaded = true;
      $scope.route = route;
      isCustomHost = RoutesService.isCustomHost(route);
      if (action === "DELETED") {
        $scope.alerts["deleted"] = {
          type: "warning",
          message: "This route has been deleted."
        };
      }
    };

    // Use an alert key that has the route UID, route host, and router
    // hostname. This will handle cases where the route is admitted by
    // multiple routers and we have more than one alert.
    var routerHostnameAlertKey = function(ingress) {
      var uid = _.get($scope, 'route.metadata.uid');
      return 'router-host-' + uid + '-' + ingress.host + '-' + ingress.routerCanonicalHostname;
    };

    // Show the alert for admitted routes that have a custom host if
    // routerCanonicalHostname is set.
    $scope.showRouterHostnameAlert = function(ingress, admittedCondition) {
      if (!isCustomHost) {
        return false;
      }

      if (!ingress || !ingress.host || !ingress.routerCanonicalHostname) {
        return false;
      }

      if (!admittedCondition || admittedCondition.status !== 'True') {
        return false;
      }

      var alertKey = routerHostnameAlertKey(ingress);
      return !AlertMessageService.isAlertPermanentlyHidden(alertKey, $scope.projectName);
    };

    ProjectsService
      .get($routeParams.project)
      .then(_.spread(function(project, context) {
        $scope.project = project;

        DataService
          .get($scope.routesVersion, $routeParams.route, context, { errorNotification: false })
          .then(function(route) {
            routeResolved(route);
            watches.push(DataService.watchObject($scope.routesVersion, $routeParams.route, context, routeResolved));
          }, function(e) {
            $scope.loaded = true;
            $scope.alerts["load"] = {
              type: "error",
              message: "The route details could not be loaded.",
              details: $filter('getErrorDetails')(e)
            };
          });

        // Watch services to display route warnings.
        watches.push(DataService.watch(servicesVersion, context, function(services) {
          $scope.services = services.by("metadata.name");
        }));

        $scope.$on('$destroy', function(){
          DataService.unwatchAll(watches);
        });

      }));
  });
