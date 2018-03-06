'use strict';

angular.module("openshiftConsole")
  .factory("RoutesService", function($filter) {
    var isPortNamed = function(port) {
      return angular.isString(port);
    };

    var getServicePortForRoute = function(targetPort, service) {
      return _.find(service.spec.ports, function(servicePort) {
        if (isPortNamed(targetPort)) {
          // When using a named port in the route target port, it refers to the service port.
          return servicePort.name === targetPort;
        }

        // Otherwise it refers to the container port (the service target port).
        // If service target port is a string, we won't be able to correlate the route port.
        return servicePort.targetPort === targetPort;
      });
    };

    var addRouteTargetWarnings = function(route, target, services, warnings) {
      if (target.kind !== 'Service') {
        return;
      }

      var service = _.get(services, [target.name]);
      // Has the service been deleted?
      if (!service) {
        warnings.push('Routes to service "' + target.name + '", but service does not exist.');
        return;
      }

      var targetPort = route.spec.port ? route.spec.port.targetPort : null;
      if (!targetPort) {
        if (_.size(service.spec.ports) > 1) {
          warnings.push('Route has no target port, but service "' + service.metadata.name + '" has multiple ports. ' +
                       'The route will round robin traffic across all exposed ports on the service.');
        }

        // Nothing else to check.
        return;
      }

      // Warn when service doesn't have a port that matches target port.
      var servicePort = getServicePortForRoute(targetPort, service);
      if (!servicePort) {
        if (isPortNamed(targetPort)) {
          warnings.push('Route target port is set to "' + targetPort + '", but service "' + service.metadata.name + '" has no port with that name.');
        } else {
          warnings.push('Route target port is set to "' + targetPort + '", but service "' + service.metadata.name + '" does not expose that port.');
        }
      }
    };

    var addTLSWarnings = function(route, warnings) {
      if (!route.spec.tls) {
        return;
      }

      if (!route.spec.tls.termination) {
        warnings.push('Route has a TLS configuration, but no TLS termination type is specified. TLS will not be enabled until a termination type is set.');
      }

      if (route.spec.tls.termination === 'passthrough' && route.spec.path) {
        warnings.push('Route path "' + route.spec.path + '" will be ignored since the route uses passthrough termination.');
      }
    };

    var addIngressWarnings = function(route, warnings) {
      var wildcardPolicy = _.get(route, 'spec.wildcardPolicy');
      angular.forEach(route.status.ingress, function(ingress) {
        var condition = _.find(ingress.conditions, { type: "Admitted", status: "False" });
        if (condition) {
          var message = 'Requested host ' + (ingress.host || '<unknown host>') + ' was rejected by the router.';
          if (condition.message || condition.reason) {
            message += " Reason: " + (condition.message || condition.reason) + '.';
          }
          warnings.push(message);
        }

        // This message only displays with old router images that are not aware of `wildcardPolicy`.
        if (!condition && wildcardPolicy === 'Subdomain' && ingress.wildcardPolicy !== wildcardPolicy) {
          warnings.push('Router "' + ingress.routerName + '" does not support wildcard subdomains. Your route will only be available at host ' + ingress.host + '.');
        }
      });
    };

    var isAdmitted = function(route) {
      // Consider the route admitted if any ingress has any condition matching
      // { type: 'Admitted', status: 'True' }
      return _.some(route.status.ingress, function(ingress) {
        return _.some(ingress.conditions, {
          type: 'Admitted',
          status: 'True'
        });
      });
    };

    var annotation = $filter('annotation');
    var isCustomHost = function(route) {
      return annotation(route, "openshift.io/host.generated") !== "true";
    };

    var isOverviewAppRoute = function(route) {
      return annotation(route, "console.alpha.openshift.io/overview-app-route") === "true";
    };

    // Gets a score for the route to decide which to show on the overview.
    var scoreRoute = function(route) {
      var score = 0;
      if(isOverviewAppRoute(route)) {
        score += 21;
      }

      if (isAdmitted(route)) {
        score += 11;
      }

      var alternateBackends = _.get(route, 'spec.alternateBackends');
      if (!_.isEmpty(alternateBackends)) {
        score += 5;
      }

      if (isCustomHost(route)) {
        score += 3;
      }

      if (route.spec.tls) {
        score += 1;
      }

      return score;
    };

    var sortRoutesByScore = function(routes) {
      return _.orderBy(routes, [ scoreRoute ], [ 'desc' ]);
    };

    // Gets the preferred route to display between two routes
    var getPreferredDisplayRoute = function(lhs, rhs) {
      var leftScore = scoreRoute(lhs), rightScore = scoreRoute(rhs);
      return (rightScore > leftScore) ? rhs : lhs;
    };

    var groupByServiceAndAlternateBackends = function(routes) {
      var routesByService = {};
      var addToService = function(route, serviceName) {
        routesByService[serviceName] = routesByService[serviceName] || [];
        routesByService[serviceName].push(route);
      };

      _.each(routes, function(route) {
        addToService(route, route.spec.to.name);
        var alternateBackends = _.get(route, 'spec.alternateBackends', []);
        _.each(alternateBackends, function(alternateBackend) {
          if (alternateBackend.kind !== 'Service') {
            return;
          }

          addToService(route, alternateBackend.name);
        });
      });

      return routesByService;
    };

    var groupByService = function(routes, includeAlternateBackends) {
      if (includeAlternateBackends) {
        return groupByServiceAndAlternateBackends(routes);
      }

      return _.groupBy(routes, 'spec.to.name');
    };

    // For host "foo.example.com" return "example.com"
    var getSubdomain = function(route) {
      var hostname = _.get(route, 'spec.host', '');
      return hostname.replace(/^[a-z0-9]([-a-z0-9]*[a-z0-9])\./, '');
    };

    return {
      // Gets warnings about a route.
      //
      // Parameters:
      //   route    - the route (required)
      //   services - map of services in the namespace by name
      //              If empty, assumes service does not exist.
      //
      // Returns: Array of warning messages.
      getRouteWarnings: function(route, services) {
        var warnings = [];

        if (!route) {
          return warnings;
        }

        addRouteTargetWarnings(route, route.spec.to, services, warnings);
        _.each(route.spec.alternateBackends, function(alternateBackend) {
          addRouteTargetWarnings(route, alternateBackend, services, warnings);
        });

        addTLSWarnings(route, warnings);

        addIngressWarnings(route, warnings);

        return warnings;
      },

      getServicePortForRoute: getServicePortForRoute,
      getPreferredDisplayRoute: getPreferredDisplayRoute,
      groupByService: groupByService,
      getSubdomain: getSubdomain,
      isCustomHost: isCustomHost,
      isOverviewAppRoute: isOverviewAppRoute,
      sortRoutesByScore: sortRoutesByScore
    };
  });
