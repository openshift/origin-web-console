"use strict";

angular.module("openshiftConsole")
  /**
   * Widget for entering route information
   *
   * model:
   *   The model for the input. The model will either use or add the following keys:
   *     {
   *       name: "",
   *       host: "",
   *       path: "",
   *       to: {}, // object with name and weight properties, kind is assumed to be 'Service'
   *       alternateServices: [], // alternate backend objects, each with service and weight properties
   *       tls.termination: "",
   *       tls.insecureEdgeTerminationPolicy: "",
   *       tls.certificate: "",
   *       tls.key: "",
   *       tls.caCertificate: "",
   *       tls.destinationCACertificate: ""
   *     }
   *
   * services:
   *   Collection of services to choose from for the route (optional)
   *
   * showNameInput:
   *   Whether to prompt the user for a route name (default: false)
   *
   * routingDisabled:
   *   An expression that will disable the form (default: false)
   */
  .directive("oscRouting",
             function($filter,
                      Constants,
                      DNS1123_SUBDOMAIN_VALIDATION) {
    return {
      require: '^form',
      restrict: 'E',
      scope: {
        route: "=model",
        services: "=",
        showNameInput: "=",
        routingDisabled: "=",
        existingRoute: "="
      },
      templateUrl: 'views/directives/osc-routing.html',
      link: function(scope, element, attrs, formCtl) {
        scope.form = formCtl;
        scope.controls = {};
        scope.options = {
          secureRoute: false,
          alternateServices: false
        };

        var customHostResource = {
          group: 'route.openshift.io',
          resource: 'routes/custom-host'
        };
        scope.canICreateCustomHosts = $filter('canI')(customHostResource, 'create');
        scope.canIUpdateCustomHosts = $filter('canI')(customHostResource, 'update');

        var canISetCustomHost = function() {
          if (scope.existingRoute) {
            return scope.canIUpdateCustomHosts;
          }

          return scope.canICreateCustomHosts;
        };

        scope.isHostnameReadOnly = function() {
          return !canISetCustomHost();
        };

        // Wildcard policy can't be modified for existing routes.
        scope.disableWildcards =
          Constants.DISABLE_WILDCARD_ROUTES ||
          (scope.existingRoute && scope.route.wildcardPolicy !== 'Subdomain');

        // Certificate updates also require custom host.
        scope.areCertificateInputsReadOnly = function() {
          // For both new and existing routes, you can update TLS if you can
          // *create* custom hosts.
          // See https://github.com/openshift/origin/pull/18312
          return !scope.canICreateCustomHosts;
        };

        scope.areCertificateInputsDisabled = function() {
          var termination = _.get(scope, 'route.tls.termination');
          return !termination || termination === 'passthrough';
        };

        scope.isDestinationCACertInputDisabled = function() {
          // This input only applies to reencrypt routes.
          return _.get(scope, 'route.tls.termination') !== 'reencrypt';
        };

        scope.insecureTrafficOptions = [
          {value: '', label: 'None'},
          {value: 'Allow', label: 'Allow'},
          {value: 'Redirect', label: 'Redirect'}
        ];

        if (!_.has(scope, 'route.tls.insecureEdgeTerminationPolicy')) {
          // Initialize the value to the empty string so the option 'None' is
          // shown in the select.
          _.set(scope, 'route.tls.insecureEdgeTerminationPolicy', '');
        }

        var validateInsecureTerminationPolicy = function() {
          var insecureTrafficValid = _.get(scope, 'route.tls.termination') !== 'passthrough' ||
                                     _.get(scope, 'route.tls.insecureEdgeTerminationPolicy') !== 'Allow';
          scope.routeForm.insecureTraffic.$setValidity('passthrough', insecureTrafficValid);
        };
        scope.$watchGroup([ 'route.tls.termination', 'route.tls.insecureEdgeTerminationPolicy' ],
                          validateInsecureTerminationPolicy);

        scope.nameValidation = DNS1123_SUBDOMAIN_VALIDATION;

        // Use different patterns for validating hostnames if wildcard subdomains are supported.
        if (scope.disableWildcards) {
          scope.hostnamePattern = DNS1123_SUBDOMAIN_VALIDATION.pattern;
        } else {
          // Allow values like "*.example.com" in addition to the normal hostname regex.
          scope.hostnamePattern = /^(\*(\.[a-z0-9]([-a-z0-9]*[a-z0-9]))+|[a-z0-9]([-a-z0-9]*[a-z0-9])?(\.[a-z0-9]([-a-z0-9]*[a-z0-9])?)*)$/;
        }
        scope.hostnameMaxLength = DNS1123_SUBDOMAIN_VALIDATION.maxlength;

        var updatePortOptions = function(service) {
          if (!service) {
            return;
          }

          var ports = _.get(service, 'spec.ports', []);
          scope.unnamedServicePort = ports.length === 1 && !ports[0].name;

          // Only show port options when there is more than one port or when a
          // single service port has a name. We want to use the service port
          // name when creating a route. (Port name is required for services
          // with more than one port.)
          if (ports.length && !scope.unnamedServicePort) {
            scope.route.portOptions = _.map(ports, function(portMapping) {
              return {
                port: portMapping.name,
                // \u2192 is a Unicode right arrow.
                label: portMapping.port + " \u2192 " +
                       portMapping.targetPort + " (" + portMapping.protocol + ")"
              };
            });
          } else {
            scope.route.portOptions = [];
          }
        };

        if (scope.services && !scope.route.service) {
          // Use _.find to get the first item.
          scope.route.service = _.find(scope.services);
        }

        scope.servicesByName;
        if (scope.services) {
          scope.servicesByName = _.keyBy(scope.services, 'metadata.name');
        } else {
          scope.servicesByName = {};
        }

        scope.$watch('route.to.name', function(newValue, oldValue) {
          updatePortOptions(scope.servicesByName[newValue]);
          // Don't overwrite the target port when editing an existing route unless the user picked a
          // different service.
          if (newValue !== oldValue || !scope.route.targetPort) {
            scope.route.targetPort = _.get(scope, 'route.portOptions[0].port');
          }

          if (scope.services) {
            // Update the options for alternate services.
            scope.alternateServiceOptions = _.reject(scope.services, function(service) {
              return newValue === service.metadata.name;
            });
          }
        });

        scope.$watch('route.alternateServices', function(alternateServices) {
          // Find any duplicates.
          scope.duplicateServices = _(alternateServices).map('name').filter(function(value, index, iteratee) {
            return _.includes(iteratee, value, index + 1);
          }).value();
          formCtl.$setValidity("duplicateServices", !scope.duplicateServices.length);

          scope.options.alternateServices = !_.isEmpty(alternateServices);
        }, true);

        var showCertificateWarning = function() {
          if (!scope.route.tls) {
            return false;
          }

          if (scope.route.tls.termination && scope.route.tls.termination !== 'passthrough') {
            return false;
          }

          // Check if any certificate or key is set with an incompatible termination.
          return scope.route.tls.certificate ||
                 scope.route.tls.key ||
                 scope.route.tls.caCertificate ||
                 scope.route.tls.destinationCACertificate;
        };

        // Show a warning if previously-set certificates won't be used because
        // the TLS termination is now incompatible.
        scope.$watch('route.tls.termination', function() {
          scope.options.secureRoute = !!_.get(scope, 'route.tls.termination');
          scope.showCertificatesNotUsedWarning = showCertificateWarning();
        });

        var previousTermination;
        scope.$watch('options.secureRoute', function(newValue, oldValue) {
          if (newValue === oldValue) {
            return;
          }

          var termination = _.get(scope, 'route.tls.termination');
          if (!scope.securetRoute && termination) {
            // Remember previous value if user switches back to secure.
            previousTermination = termination;
            delete scope.route.tls.termination;
          }

          if (scope.options.secureRoute && !termination) {
            // Restore previous termination value or default to edge if no previous value.
            _.set(scope, 'route.tls.termination', previousTermination || 'edge');
          }
        });

        scope.$watch('options.alternateServices', function(alternateServices, previousValue) {
          if (alternateServices === previousValue) {
            return;
          }

          if (!alternateServices) {
            scope.route.alternateServices = [];
          }

          if (alternateServices && _.isEmpty(scope.route.alternateServices)) {
            scope.addAlternateService();
          }
        });

        scope.addAlternateService = function() {
          scope.route.alternateServices = scope.route.alternateServices || [];
          var firstUnselected = _.find(scope.services, function(service) {
            return service.metadata.name !== scope.route.to.service &&
                   !_.some(scope.route.alternateServices, { service: service.metadata.name });
          });

          if (!_.has(scope, 'route.to.weight')) {
            _.set(scope, 'route.to.weight', 1);
          }

          // Add a new value.
          scope.route.alternateServices.push({
            service: firstUnselected.metadata.name,
            weight: 1
          });
        };

        scope.weightAsPercentage = function(weight, format) {
          weight = weight || 0;

          var total = _.get(scope, 'route.to.weight', 0);
          _.each(scope.route.alternateServices, function(alternate) {
            total += _.get(alternate, 'weight', 0);
          });

          if (!total) {
            return '';
          }

          var percentage = (weight / total) * 100;
          return format ? (d3.round(percentage, 1) + '%') : percentage;
        };

        var initializingSlider = false;
        scope.$watch('route.alternateServices.length', function(alternateServicesCount) {
          if (alternateServicesCount === 0 && _.has(scope, 'route.to.weight')) {
            // Reset the primary service weight. This rebalances the percentages when adding a new alternate service.
            delete scope.route.to.weight;
          }

          if (alternateServicesCount === 1) {
            // If all weights are 0, don't use the slider.
            if (scope.route.to.weight === 0 && scope.route.alternateServices[0].weight === 0) {
              scope.controls.hideSlider = true;
              return;
            }

            initializingSlider = true;
            scope.controls.rangeSlider = scope.weightAsPercentage(scope.route.to.weight);
          }
        });

        scope.$watch('controls.hideSlider', function(hideSlider){
          if(!hideSlider && _.size(scope.route.alternateServices) === 1){
            initializingSlider = true;
            scope.controls.rangeSlider = scope.weightAsPercentage(scope.route.to.weight);
          }
        });

        scope.$watch('controls.rangeSlider', function(weight, previous) {
          // Don't update the routes if we're setting the initial slider value.
          if (initializingSlider) {
            initializingSlider = false;
            return;
          }

          if (weight === previous) {
            return;
          }

          // Once the values are changed using the slider, set the weights as precentages.
          // Slider range is 0-100.
          weight = parseInt(weight, 10);
          _.set(scope, 'route.to.weight', weight);
          _.set(scope, 'route.alternateServices[0].weight', 100 - weight);
        });
      }
    };
  })
  // Prompts for a service and optionally a weight for A/B traffic.
  .directive("oscRoutingService", function() {
    return {
      restrict: 'E',
      scope: {
        // The model, an object with properties `service` and `weight`
        model: "=",
        // Collection of service objects
        serviceOptions: "=",
        // All services that exist, even those that aren't valid options. This
        // lets us correctly warn when editing a route that references a
        // service that doesn't exist.
        allServices: "=",
        // `true` if this is an alternate route target for A/B traffic
        // (optional). Changes the labels and help text.
        isAlternate: "=?",
        // Show a weight field (optional)
        showWeight: "=?",
        // Show a warning when a service has a single, unnamed port.
        warnUnnamedPort: "=?"
      },
      templateUrl: 'views/directives/osc-routing-service.html',
      link: function(scope, element, attrs, formCtl) {
        scope.form = formCtl;
        scope.id = _.uniqueId('osc-routing-service-');

        // Set an initial value for `model.service` if not set.
        scope.$watchGroup(['model.name', 'serviceOptions'], function() {
          if (_.isEmpty(scope.serviceOptions)) {
            scope.optionsNames = [];
            return;
          }

          var selected = _.get(scope, 'model.name');
          scope.optionNames = [];
          scope.selectedExists = false;
          scope.optionNames = _.map(scope.serviceOptions, 'metadata.name');
          if (selected && !scope.allServices[selected]) {
            scope.optionNames.push(selected);
          }

          // If there is no selected item, select the first item in services.
          if (!selected) {
            _.set(scope, 'model.name', _.head(scope.optionNames));
          }
        });
      }
    };
  });
