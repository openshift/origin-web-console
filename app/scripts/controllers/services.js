'use strict';

/**
 * @ngdoc function
 * @name openshiftConsole.controller:ServicesController
 * @description
 * # ProjectController
 * Controller of the openshiftConsole
 */
angular.module('openshiftConsole')
  .controller('ServicesController', function ($routeParams, $scope, AlertMessageService, DataService, ProjectsService, $filter, LabelFilter, Logger, gettextCatalog) {
    $scope.projectName = $routeParams.project;
    $scope.services = {};
    $scope.unfilteredServices = {};
    $scope.routesByService = {};
    $scope.routes = {};
    $scope.labelSuggestions = {};
    $scope.alerts = $scope.alerts || {};
    $scope.emptyMessage = gettextCatalog.getString("Loading...");
    $scope.emptyMessageRoutes = gettextCatalog.getString("Loading...");

    // get and clear any alerts
    AlertMessageService.getAlerts().forEach(function(alert) {
      $scope.alerts[alert.name] = alert.data;
    });
    AlertMessageService.clearAlerts();

    var watches = [];

    ProjectsService
      .get($routeParams.project)
      .then(_.spread(function(project, context) {
        $scope.project = project;
         watches.push(DataService.watch("services", context, function(services) {
          $scope.unfilteredServices = services.by("metadata.name");
          LabelFilter.addLabelSuggestionsFromResources($scope.unfilteredServices, $scope.labelSuggestions);
          LabelFilter.setLabelSuggestions($scope.labelSuggestions);
          $scope.services = LabelFilter.getLabelSelector().select($scope.unfilteredServices);
          $scope.emptyMessage = gettextCatalog.getString("No services to show");
          updateFilterWarning();

          Logger.log("services (subscribe)", $scope.unfilteredServices);
        }));

        watches.push(DataService.watch("routes", context, function(routes){
            $scope.routes = routes.by("metadata.name");
            $scope.emptyMessageRoutes = gettextCatalog.getString("No routes to show");
            $scope.routesByService = routesByService($scope.routes);
            Logger.log("routes (subscribe)", $scope.routesByService);
        }));

        function routesByService(routes) {
            var routeMap = {};
            angular.forEach(routes, function(route, routeName){
              var to = route.spec.to;
              if (to.kind === "Service") {
                routeMap[to.name] = routeMap[to.name] || {};
                routeMap[to.name][routeName] = route;
              }
            });
            return routeMap;
        }

        function updateFilterWarning() {
          if (!LabelFilter.getLabelSelector().isEmpty() && $.isEmptyObject($scope.services)  && !$.isEmptyObject($scope.unfilteredServices)) {
            $scope.alerts["services"] = {
              type: "warning",
              details: gettextCatalog.getString("The active filters are hiding all services.")
            };
          }
          else {
            delete $scope.alerts["services"];
          }
        }

        LabelFilter.onActiveFiltersChanged(function(labelSelector) {
          // trigger a digest loop
          $scope.$apply(function() {
            $scope.services = labelSelector.select($scope.unfilteredServices);
            updateFilterWarning();
          });
        });

        $scope.$on('$destroy', function(){
          DataService.unwatchAll(watches);
        });

      }));
  });
