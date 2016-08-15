'use strict';

angular.module('openshiftConsole')
  .directive('overviewServiceGroup', function($filter,
                                              $uibModal,
                                              RoutesService,
                                              ServicesService) {
    return {
      restrict: 'E',
      // Inherit scope from OverviewController. This directive is only used for the overview.
      // We want to do all of the grouping of resources once in the overview controller watch callbacks.
      scope: true,
      templateUrl: 'views/overview/_service-group.html',
      link: function($scope) {
        var localStorageCollapseKey = function() {
          var uid = _.get($scope, 'service.metadata.uid');
          if (!uid) {
            return null;
          }
          return 'collapse/service/' + uid;
        };

        var wasCollapsed = function() {
          var key = localStorageCollapseKey();
          if (!key) {
            return false;
          }

          return localStorage.getItem(key) === 'true';
        };

        var saveCollapsedState = function() {
          var key = localStorageCollapseKey();
          if (!key) {
            return;
          }

          var value = $scope.collapse ? 'true' : 'false';
          localStorage.setItem(key, value);
        };

        // Restore previous collapsed state.
        $scope.collapse = wasCollapsed();

        $scope.toggleCollapse = function(e) {
          // Don't collapse when clicking on the route link.
          if (e && e.target && e.target.tagName === 'A') {
            return;
          }

          $scope.collapse = !$scope.collapse;
          saveCollapsedState();
        };

        $scope.linkService = function() {
          var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/modals/link-service.html',
            controller: 'LinkServiceModalController',
            scope: $scope
          });
          modalInstance.result.then(function(child) {
            ServicesService.linkService($scope.service, child).then(
              // success
              _.noop,
              // failure
              function(result) {
                $scope.alerts = $scope.alerts || {};
                $scope.alerts["link-service"] =
                  {
                    type: "error",
                    message: "Could not link services.",
                    details: $filter('getErrorDetails')(result)
                  };
              });
          });
        };

        $scope.removeLink = function(service) {
          var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/modals/confirm.html',
            controller: 'ConfirmModalController',
            resolve: {
              message: function() {
                return "Remove service '" + service.metadata.name + "' from group?";
              },
              details: function() {
                return "Services '" +
                       $scope.primaryService.metadata.name +
                       "' and '" +
                       service.metadata.name +
                       "' will no longer be displayed together on the overview.";
              },
              okButtonText: function() {
                return "Remove";
              },
              okButtonClass: function() {
                return "btn-danger";
              },
              cancelButtonText: function() {
                return "Cancel";
              }
            }
          });

          modalInstance.result.then(function() {
            ServicesService.removeServiceLink($scope.primaryService, service).then(
              // success
              _.noop,
              // failure
              function(result) {
                $scope.alerts = $scope.alerts || {};
                $scope.alerts["remove-service-link"] = {
                  type: "error",
                  message: "Could not remove service link.",
                  details: $filter('getErrorDetails')(result)
                };
              }
            );
          });
        };

        $scope.$watch('service.metadata.labels.app', function(appName) {
          $scope.appName = appName;
        });

        var getDisplayRoute = function(routes) {
          var displayRoute;
          _.each(routes, function(candidate) {
            if (!displayRoute) {
              displayRoute = candidate;
              return;
            }

            // Is candidate better than the current display route?
            displayRoute = RoutesService.getPreferredDisplayRoute(displayRoute, candidate);
          });

          return displayRoute;
        };

        var addAlternateServices = function() {
          $scope.weightByService = {};
          $scope.alternateServices = [];

          // Keep track of the total weight of all services so we can show A/B
          // traffic as percentages.
          $scope.totalWeight = 0;

          var primaryServiceWeight = _.get($scope.displayRoute, 'spec.to.weight');
          $scope.weightByService[$scope.service.metadata.name] = primaryServiceWeight;
          $scope.totalWeight += primaryServiceWeight;

          var alternateBackends = _.get($scope.displayRoute, 'spec.alternateBackends', []);
          _.each(alternateBackends, function(routeTarget) {
            if (routeTarget.kind !== 'Service') {
              return;
            }

            var service = $scope.services[routeTarget.name];
            if (service) {
              $scope.alternateServices.push(service);
            }

            $scope.weightByService[routeTarget.name] = routeTarget.weight;
            $scope.totalWeight += routeTarget.weight;
          });
        };

        $scope.$watch(function() {
          var serviceName = _.get($scope, 'service.metadata.name');
          return _.get($scope, ['routesByService', serviceName]);
        }, function(routes) {
          $scope.displayRoute = getDisplayRoute(routes);
          $scope.primaryServiceRoutes = routes;
          addAlternateServices();
        });

        $scope.$watchGroup(['service', 'childServicesByParent'], function() {
          if (!$scope.service) {
            return;
          }
          $scope.primaryService = $scope.service;
          $scope.childServices = _.get($scope, ['childServicesByParent', $scope.service.metadata.name], []);
        });
      }
    };
  });
