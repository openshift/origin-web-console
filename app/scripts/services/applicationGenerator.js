"use strict";

angular.module("openshiftConsole")

  .service("ApplicationGenerator", function(DataService,
                                            APIService,
                                            Logger,
                                            $parse,
                                            $q){

    var scope = {};

    // maps an env object: { key: 'val', key2: 'val2'}
    // to an array: [{},{},{}]
    var makeEnvArray = function(input) {
      return _.isArray(input) ?
              input :
              _.map(input, function(value, key){
                return {name: key, value: value};
              });
    };

    scope._generateSecret = function(){
        //http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
        function s4() {
          return Math.floor((1 + Math.random()) * 0x10000)
              .toString(16)
              .substring(1);
          }
        return s4()+s4()+s4()+s4();
      };

    scope.parsePorts = function(image) {
      //map ports to k8s structure
      var parsePortsFromSpec = function(portSpec){
        var ports = [];
        angular.forEach(portSpec, function(value, key){
          var parts = key.split("/");
          if(parts.length === 1){
            parts.push("tcp");
          }

          var containerPort = parseInt(parts[0], 10);
          if (isNaN(containerPort)) {
            Logger.warn("Container port " + parts[0] + " is not a number for image " + $parse("metadata.name")(image));
          } else {
            ports.push({
              containerPort: containerPort,
              protocol: parts[1].toUpperCase()
            });
          }
        });

        // Since the exposed ports in Docker image metadata are not in any
        // order, sort the ports from lowest to highest.
        ports.sort(function(left, right) {
          return left.containerPort - right.containerPort;
        });

        return ports;
      };

      var specPorts =
        $parse('dockerImageMetadata.Config.ExposedPorts')(image) ||
        $parse('dockerImageMetadata.ContainerConfig.ExposedPorts')(image) ||
        [];
      return parsePortsFromSpec(specPorts);
    };

    /**
     * Generate resource definitions to support the given input
     * @param {type} input
     * @returns Hash of resource definitions
     */
    scope.generate = function(input){
      var ports = scope.parsePorts(input.image);

      input.annotations["openshift.io/generated-by"] = "OpenShiftWebConsole";

      var imageSpec;
      if(input.buildConfig.sourceUrl !== null){
        imageSpec = {
          name: input.name,
          tag: "latest",
          kind: "ImageStreamTag",
          toString: function(){
            return this.name + ":" + this.tag;
          }
        };
      }

      var resources = {
        imageStream: scope._generateImageStream(input),
        buildConfig: scope._generateBuildConfig(input, imageSpec, input.labels),
        deploymentConfig: scope._generateDeploymentConfig(input, imageSpec, ports, input.labels)
      };

      if (input.scaling.autoscale) {
        resources.hpa = scope._generateHPA(input, resources.deploymentConfig);
      }

      var service = scope._generateService(input, input.name, ports);
      if (service) {
        resources.service = service;

        // Only attempt to generate a route if there is a service.
        resources.route = scope._generateRoute(input, input.name, resources.service.metadata.name);
      }

      return resources;
    };

    // Public method for creating a route.
    // Expects routeOptions from the osc-routing directive.
    scope.createRoute = function(routeOptions, serviceName, labels) {
      return scope._generateRoute({
        labels: labels || {},
        routing: angular.extend({ include: true }, routeOptions)
      }, routeOptions.name, serviceName);
    };

    scope._generateRoute = function(input, name, serviceName){
      if(!input.routing.include) {
        return null;
      }

      var route = {
        kind: "Route",
        apiVersion: "v1",
        metadata: {
          name: name,
          labels: input.labels,
          annotations: input.annotations
        },
        spec: {
          to: {
            kind: "Service",
            name: serviceName
          },
          wildcardPolicy: 'None'
        }
      };

      var host = input.routing.host;
      if (host) {
        if (host.startsWith('*.')) {
          route.spec.wildcardPolicy = 'Subdomain';
          route.spec.host = 'wildcard' + host.substring(1);
        } else {
          route.spec.host = host;
        }
      }

      if (input.routing.path) {
        route.spec.path = input.routing.path;
      }

      if (input.routing.targetPort) {
        route.spec.port = {
          targetPort: input.routing.targetPort
        };
      }

      var tls = input.routing.tls;
      if (tls && tls.termination) {
        route.spec.tls = {
          termination: tls.termination
        };

        if (tls.insecureEdgeTerminationPolicy) {
          route.spec.tls.insecureEdgeTerminationPolicy = tls.insecureEdgeTerminationPolicy;
        }

        if (tls.termination !== 'passthrough') {
          if (tls.certificate) {
            route.spec.tls.certificate = tls.certificate;
          }
          if (tls.key) {
            route.spec.tls.key = tls.key;
          }
          if (tls.caCertificate) {
            route.spec.tls.caCertificate = tls.caCertificate;
          }
          if (tls.destinationCACertificate && tls.termination === 'reencrypt') {
            route.spec.tls.destinationCACertificate = tls.destinationCACertificate;
          }
        }
      }

      return route;
    };

    scope._generateDeploymentConfig = function(input, imageSpec, ports){
      var env = makeEnvArray(input.deploymentConfig.envVars);

      var templateLabels = angular.copy(input.labels);
      templateLabels.deploymentconfig = input.name;

      var container = {
        image: imageSpec.toString(),
        name: input.name,
        ports: ports,
        env: env,
        resources: _.get(input, "container.resources")
      };

      var replicas;
      if (input.scaling.autoscaling) {
        // Set initial replicas to min replicas if autoscaling.
        replicas = input.scaling.minReplicas || 1;
      } else {
        replicas = input.scaling.replicas;
      }

      var deploymentConfig = {
        apiVersion: "v1",
        kind: "DeploymentConfig",
        metadata: {
          name: input.name,
          labels: input.labels,
          annotations: input.annotations
        },
        spec: {
          replicas: replicas,
          selector: {
            deploymentconfig: input.name
          },
          triggers: [],
          template: {
            metadata: {
              labels: templateLabels
            },
            spec: {
              containers: [ container ]
            }
          }
        }
      };
      deploymentConfig.spec.triggers.push(
        {
          type: "ImageChange",
          imageChangeParams: {
            automatic: !!input.deploymentConfig.deployOnNewImage,
            containerNames: [
              input.name
            ],
            from: {
              kind: imageSpec.kind,
              name: imageSpec.toString()
            }
          }
        }
      );
      if (input.deploymentConfig.deployOnConfigChange) {
        deploymentConfig.spec.triggers.push({type: "ConfigChange"});
      }
      return deploymentConfig;
    };

    scope._generateHPA = function(input, dc) {
      var hpa = {
        apiVersion: "autoscaling/v1",
        kind: "HorizontalPodAutoscaler",
        metadata: {
          name: input.name,
          labels: input.labels,
          annotations: input.annotations
        },
        spec: {
          scaleTargetRef: {
            kind: "DeploymentConfig",
            name: dc.metadata.name,
            apiVersion: "extensions/v1beta1",
            subresource: "scale"
          },
          minReplicas: input.scaling.minReplicas,
          maxReplicas: input.scaling.maxReplicas,
          targetCPUUtilizationPercentage: input.scaling.targetCPU
        }
      };

      return hpa;
    };


    scope._generateBuildConfig = function(input, imageSpec){
      var env = makeEnvArray(input.buildConfig.envVars);

      var triggers = [
        {
          generic: {
            secret: scope._generateSecret()
          },
          type: "Generic"
        }
      ];
      if (input.buildConfig.buildOnSourceChange) {
        triggers.push({
            github: {
              secret: scope._generateSecret()
            },
            type: "GitHub"
          }
        );
      }
      if (input.buildConfig.buildOnImageChange) {
        triggers.push({
          imageChange: {},
          type: "ImageChange"
        });
      }
      if (input.buildConfig.buildOnConfigChange) {
        triggers.push({
          type: "ConfigChange"
        });
      }

      // User can input a URL that contains a ref
      var uri = new URI(input.buildConfig.sourceUrl);
      var sourceRef = uri.fragment();
      if (!sourceRef) {
        sourceRef = "master";
      }
      uri.fragment("");
      var sourceUrl = uri.href();

      var bc = {
        apiVersion: "v1",
        kind: "BuildConfig",
        metadata: {
          name: input.name,
          labels: input.labels,
          annotations: input.annotations
        },
        spec: {
          output: {
            to: {
              name: imageSpec.toString(),
              kind: imageSpec.kind
            }
          },
          source: {
            git: {
              ref: input.buildConfig.gitRef || sourceRef,
              uri: sourceUrl
            },
            type: "Git"
          },
          strategy: {
            type: "Source",
            sourceStrategy: {
              from: {
                kind: "ImageStreamTag",
                name: input.imageName + ":" + input.imageTag,
                namespace: input.namespace
              },
              env: env
            }
          },
          triggers: triggers
        }
      };

      if (_.get(input, 'buildConfig.secrets.gitSecret[0].name')) {
        bc.spec.source.sourceSecret = _.head(input.buildConfig.secrets.gitSecret);
      }

      // Add contextDir only if specified.
      if (input.buildConfig.contextDir) {
        bc.spec.source.contextDir = input.buildConfig.contextDir;
      }

      return bc;
    };

    scope._generateImageStream = function(input){
      return {
        apiVersion: "v1",
        kind: "ImageStream",
        metadata: {
          name: input.name,
          labels: input.labels,
          annotations: input.annotations
        }
      };
    };

    scope.getServicePort = function(portSpec) {
      return {
        port: portSpec.containerPort,
        targetPort: portSpec.containerPort,
        protocol: portSpec.protocol,
        // Use the same naming convention as CLI new-app.
        name: (portSpec.containerPort + '-' + portSpec.protocol).toLowerCase()
      };
    };

    scope._generateService  = function(input, serviceName, ports){
      if (!ports || !ports.length) {
        return null;
      }

      var service = {
        kind: "Service",
        apiVersion: "v1",
        metadata: {
          name: serviceName,
          labels: input.labels,
          annotations: input.annotations
        },
        spec: {
          selector: {
            deploymentconfig: input.name
          },
          ports: _.map(ports, scope.getServicePort)
        }
      };

      return service;
    };

    // returns a promise that will be resolved if none of the resources exist, if any resource exists it will be rejected
    scope.ifResourcesDontExist = function(apiObjects, namespace){
      var result = $q.defer();
      var successResults = [];
      var failureResults = [];
      var remaining = apiObjects.length;

      function _checkDone() {
        if (remaining === 0) {
          if(successResults.length > 0){
            //means some resources exist with the given name
            result.reject({nameTaken: true});
          }
          else {
            //means no resources exist with the given name
            result.resolve({nameTaken: false});
          }
        }
      }

      apiObjects.forEach(function(apiObject) {
        var resource = APIService.objectToResourceGroupVersion(apiObject);
        if (!resource) {
          failureResults.push({data: {message: APIService.invalidObjectKindOrVersion(apiObject)}});
          remaining--;
          _checkDone();
          return;
        }
        if (!APIService.apiInfo(resource)) {
          failureResults.push({data: {message: APIService.unsupportedObjectKindOrVersion(apiObject)}});
          remaining--;
          _checkDone();
          return;
        }
        DataService.get(resource, apiObject.metadata.name, {namespace: namespace}, {errorNotification: false}).then(
          function (data) {
            successResults.push(data);
            remaining--;
            _checkDone();
          },
          function (data) {
            failureResults.push(data);
            remaining--;
            _checkDone();
          }
        );
      });
      return result.promise;
    };

    return scope;
  }
);
