'use strict';

/**
 * @ngdoc function
 * @name openshiftConsole.controller:ServiceController
 * @description
 * Controller of the openshiftConsole
 */
angular.module('openshiftConsole')
  .controller('ServiceController', function ($scope,
                                             $routeParams,
                                             APIService,
                                             DataService,
                                             Logger,
                                             ProjectsService,
                                             $filter) {
    $scope.projectName = $routeParams.project;
    $scope.service = null;
    $scope.services = null;
    $scope.alerts = {};
    $scope.renderOptions = $scope.renderOptions || {};
    $scope.renderOptions.hideFilterWidget = true;
    $scope.breadcrumbs = [
      {
        title: "Services",
        link: "project/" + $routeParams.project + "/browse/services"
      },
      {
        title: $routeParams.service
      }
    ];

    $scope.podFailureReasons = {
      "Pending": "This pod will not receive traffic until all of its containers have been created."
    };

    var podsVersion = APIService.getPreferredVersion('pods');
    var endpointsVersion = APIService.getPreferredVersion('endpoints');
    $scope.eventsVersion = APIService.getPreferredVersion('events');
    $scope.routesVersion = APIService.getPreferredVersion('routes');
    $scope.servicesVersion = APIService.getPreferredVersion('services');

    var allPods = {};
    var watches = [];

    // receives routes for the current service and maps service ports to each route name
    var getPortsByRoute = function() {
      if(!$scope.service) {
        return;
      }

      $scope.portsByRoute = {};

      _.each($scope.service.spec.ports, function(port) {
        var reachedByRoute = false;
        if(port.nodePort) {
          $scope.showNodePorts = true;
        }

        _.each($scope.routesForService, function(route) {
          if(!route.spec.port || route.spec.port.targetPort === port.name ||
            route.spec.port.targetPort === port.targetPort) {
            $scope.portsByRoute[route.metadata.name] = $scope.portsByRoute[route.metadata.name] || [];
            $scope.portsByRoute[route.metadata.name].push(port);
            reachedByRoute = true;
          }
        });

        if(!reachedByRoute) {
          $scope.portsByRoute[''] = $scope.portsByRoute[''] || [];
          $scope.portsByRoute[''].push(port);
        }
      });
    };

    // receive pods for the current service scope only when the service object is available
    var getPodsForService = function() {
      $scope.podsForService = {};
      if (!$scope.service) {
        return;
      }

      var ls = new LabelSelector($scope.service.spec.selector);
      $scope.podsForService = ls.select(allPods);
    };
    var serviceResolved = function(service, action) {
      $scope.loaded = true;
      $scope.service = service;

      getPodsForService();
      getPortsByRoute();

      if (action === "DELETED") {
        $scope.alerts["deleted"] = {
          type: "warning",
          message: "This service has been deleted."
        };
      }
    };

    ProjectsService
      .get($routeParams.project)
      .then(_.spread(function(project, context) {
        $scope.project = project;
        $scope.projectContext = context;
        DataService
          .get($scope.servicesVersion, $routeParams.service, context, { errorNotification: false })
          .then(function(service) {
            serviceResolved(service);
            watches.push(DataService.watchObject($scope.servicesVersion, $routeParams.service, context, serviceResolved));
          }, function(e) {
            $scope.loaded = true;
            $scope.alerts["load"] = {
              type: "error",
              message: "The service details could not be loaded.",
              details: $filter('getErrorDetails')(e)
            };
          }
        );

        watches.push(DataService.watch($scope.servicesVersion, context, function(services) {
          $scope.services = services.by("metadata.name");
        }));

        watches.push(DataService.watch(podsVersion, context, function(pods) {
          allPods = pods.by("metadata.name");
          getPodsForService();
        }));

        watches.push(DataService.watch(endpointsVersion, context, function(endpoints) {
          $scope.podsWithEndpoints = {};
          var svcEndpoint = endpoints.by("metadata.name")[$routeParams.service];
          if (!svcEndpoint) {
            return;
          }

          _.each(svcEndpoint.subsets, function(subset) {
            _.each(subset.addresses, function(address) {
              if (_.get(address, "targetRef.kind") === "Pod") {
                $scope.podsWithEndpoints[address.targetRef.name] = true;
              }
            });
          });
        }));

        watches.push(DataService.watch($scope.routesVersion, context, function(routes) {
          $scope.routesForService = {};
          angular.forEach(routes.by("metadata.name"), function(route) {
            if (route.spec.to.kind === "Service" &&
                route.spec.to.name === $routeParams.service) {
              $scope.routesForService[route.metadata.name] = route;
            }
          });

          getPortsByRoute();
          Logger.log("routes (subscribe)", $scope.routesForService);
        }));

        $scope.$on('$destroy', function(){
          DataService.unwatchAll(watches);
        });

    }));
  });
