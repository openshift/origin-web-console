'use strict';

/**
 * @ngdoc function
 * @name openshiftConsole.controller:OverviewController
 * @description
 * # OverviewController
 * Controller of the openshiftConsole
 */
angular.module('openshiftConsole')
  .controller('OverviewController',
              function ($filter,
                        $routeParams,
                        $scope,
                        AlertMessageService,
                        BuildsService,
                        DataService,
                        DeploymentsService,
                        Logger,
                        PodsService,
                        ProjectsService,
                        RoutesService,
                        ServicesService,
                        Navigate,
                        MetricsService) {
    // scope variables are inherited by overview-service-group and overview-service directives.
    $scope.projectName = $routeParams.project;
    $scope.renderOptions = $scope.renderOptions || {};
    $scope.renderOptions.showLoading = true;
    $scope.renderOptions.showGetStarted = false;
    $scope.renderOptions.showToolbar = false;
    $scope.renderOptions.overviewMode = 'tiles';

    /*
     * HACK: The use of <base href="/"> that is encouraged by angular is
     * a cop-out. It breaks a number of real world use cases, including
     * local xlink:href. Use location.href to get around it, even though
     * these SVG <defs> are local in the template.
     */

     // must be named kinds to work with topology-icon directive
    $scope.kinds = {
      DeploymentConfig: location.href + "#vertex-DeploymentConfig",
      Pod: location.href + "#vertex-Pod",
      ReplicationController: location.href + "#vertex-ReplicationController",
      Route: location.href + "#vertex-Route",
      Service: location.href + "#vertex-Service"
    };
    // a separate map is required since the toplogy-icon directive deletes keys
    // from the kinds map
    $scope.legendKinds = {
      DeploymentConfig: location.href + "#vertex-DeploymentConfig",
      Pod: location.href + "#vertex-Pod",
      ReplicationController: location.href + "#vertex-ReplicationController",
      Route: location.href + "#vertex-Route",
      Service: location.href + "#vertex-Service"
    };

    $scope.topologySelection = null;

    /* Filled in by updateTopology */
    $scope.topologyItems = { };
    $scope.topologyRelations = [ ];

    $scope.alerts = $scope.alerts || {};
    AlertMessageService.getAlerts().forEach(function(alert) {
      $scope.alerts[alert.name] = alert.data;
    });
    AlertMessageService.clearAlerts();

    var watches = [];
    var routes, services, deploymentConfigs, deployments, pods, buildConfigs, builds, horizontalPodAutoscalers, hpaByDC, hpaByRC;

    var isJenkinsPipelineStrategy = $filter('isJenkinsPipelineStrategy');
    var annotation = $filter('annotation');
    var label = $filter('label');
    var imageObjectRef = $filter('imageObjectRef');
    var isRecentDeployment = $filter('isRecentDeployment');

    var alternateServiceSet = {};
    var findAlternateServices = function() {
      // Map of service names and a truthy value if this is a alternate service for a route.
      alternateServiceSet = {};
      _.each(routes, function(route) {
        var alternateBackends = _.get(route, 'spec.alternateBackends', []);
        var alternateServices = _.filter(alternateBackends, { kind: 'Service' });
        _.each(alternateServices, function(routeTarget) {
          alternateServiceSet[routeTarget.name] = true;
        });
      });
    };

    var isAlternateService = function(service) {
      var name = _.get(service, 'metadata.name');
      return _.has(alternateServiceSet, name);
    };

    var groupRoutes = function() {
      $scope.routesByService = RoutesService.groupByService(routes);
      findAlternateServices();
    };

    var groupDeploymentConfigs = function() {
      if (!services || !deploymentConfigs) {
        return;
      }

      $scope.deploymentConfigs = deploymentConfigs;
      $scope.deploymentConfigsByService = DeploymentsService.groupByService(deploymentConfigs, services);
    };

    var groupDeploymentsByDC = function() {
      if (!deployments) {
        return;
      }

      $scope.deploymentsByDeploymentConfig = DeploymentsService.groupByDeploymentConfig(deployments);
    };

    var isDeploymentVisible = function(deployment) {
      if (_.get(deployment, 'status.replicas')) {
        return true;
      }
      var dcName = annotation(deployment, 'deploymentConfig');
      if (!dcName) {
        return true;
      }
      // Wait for deployment configs to load.
      if (!deploymentConfigs) {
        return false;
      }
      // If the deployment config has been deleted and the deployment has no replicas, hide it.
      // Otherwise all old deployments for a deleted deployment config will be visible.
      var dc = deploymentConfigs[dcName];
      if (!dc) {
        return false;
      }
      return isRecentDeployment(deployment, dc);
    };

    var groupDeployments = function() {
      if (!services || !deployments) {
        return;
      }

      $scope.deploymentsByService = DeploymentsService.groupByService(deployments, services);
      groupDeploymentsByDC();
      // Only the most recent in progress or complete deployment for a given
      // deployment config is scalable in the overview.
      var scalableDeploymentByConfig = {};
      _.each($scope.deploymentsByDeploymentConfig, function(deployments, dcName) {
        scalableDeploymentByConfig[dcName] = DeploymentsService.getActiveDeployment(deployments);
      });
      $scope.scalableDeploymentByConfig = scalableDeploymentByConfig;

      // Take all visible deployments grouped by deployment config and service
      $scope.visibleDeploymentsByConfigAndService = {};
      _.each($scope.deploymentsByService, function(deployments, svcName) {
        $scope.visibleDeploymentsByConfigAndService[svcName] = {};
        _.each(DeploymentsService.groupByDeploymentConfig(deployments), function(deployments, dcName) {
          $scope.visibleDeploymentsByConfigAndService[svcName][dcName] = _.filter(_.values(deployments), isDeploymentVisible);
        });
      });
    };

    var groupHPAs = function() {
      hpaByDC = {};
      hpaByRC = {};
      angular.forEach(horizontalPodAutoscalers, function(hpa) {
        var name = hpa.spec.scaleRef.name, kind = hpa.spec.scaleRef.kind;
        if (!name || !kind) {
          return;
        }

        switch (kind) {
        case "DeploymentConfig":
          hpaByDC[name] = hpaByDC[name] || [];
          hpaByDC[name].push(hpa);
          break;
        case "ReplicationController":
          hpaByRC[name] = hpaByRC[name] || [];
          hpaByRC[name].push(hpa);
          break;
        default:
          Logger.warn("Unexpected HPA scaleRef kind", kind);
        }
      });
      $scope.hpaByDC = hpaByDC;
      $scope.hpaByRC = hpaByRC;
    };

    // Filter out monopods we know we don't want to see
    var showMonopod = function(pod) {
      // Hide pods in the Succeeded & Terminated phases since these
      // are run once pods that are done.
      if (pod.status.phase === 'Succeeded' ||
          pod.status.phase === 'Terminated') {
        // TODO we may want to show pods for X amount of time after they have completed
        return false;
      }

      // Hide our deployer pods since it is obvious the deployment is
      // happening when the new deployment appears.
      if (label(pod, "openshift.io/deployer-pod-for.name")) {
        return false;
      }

      // Hide our build pods since we are already showing details for
      // currently running or recently run builds under the appropriate
      // areas.
      if (annotation(pod, "openshift.io/build.name")) {
        return false;
      }

      // Hide Jenkins slave pods.
      if (label(pod, "jenkins") === "slave") {
        return false;
      }

      return true;
    };

    var groupPods = function() {
      if (!pods || !deployments) {
        return;
      }

      $scope.podsByDeployment = PodsService.groupByReplicationController(pods, deployments);
      $scope.monopodsByService = PodsService.groupByService($scope.podsByDeployment[''], services, showMonopod);
      $scope.podsByService = PodsService.groupByService(pods, services);
    };

    // Set of child services in this project.
    var childServices = {};
    var isChildService = function(service) {
      return !!childServices[service.metadata.name];
    };

    var hasChildren = function(service) {
      var serviceName = _.get(service, 'metadata.name');
      if (!serviceName) {
        return false;
      }

      var childServices = _.get($scope, ['childServicesByParent', serviceName], []);
      return !_.isEmpty(childServices);
    };

    var addChildService = function(parentName, childName) {
      var child = services[childName];
      childServices[childName] = child;
      $scope.childServicesByParent[parentName] = $scope.childServicesByParent[parentName] || [];
      $scope.childServicesByParent[parentName].push(child);
    };

    // Assign each service a score for sorting. Services with routes or app
    // labels are considered more important.
    var scoreService = function(service) {
      var score = 0;
      var name = _.get(service, 'metadata.name', '');
      var routes = _.get($scope, ['routesByService', name], []);

      if (!_.isEmpty(routes)) {
        score += 5;
      }

      if (_.has(service, 'metadata.labels.app')) {
        score += 3;
      }

      if (ServicesService.isInfrastructure(service)) {
        score -= 5;
      }

      return score;
    };

    var compareServices = function(lhs, rhs) {
      var leftScore = scoreService(lhs), rightScore = scoreService(rhs);
      if (leftScore === rightScore) {
        // Fall back to comparing names if two services have the same score.
        return lhs.metadata.name.localeCompare(rhs.metadata.name);
      }

      return rightScore - leftScore;
    };

    var groupServices = function() {
      if (!services || !routes) {
        return;
      }

      $scope.services = services;

      childServices = {};
      $scope.childServicesByParent = {};
      _.each(services, function(service, serviceName) {
        var dependentServices = ServicesService.getDependentServices(service);
        // Add each child service to our dependency map.
        _.each(dependentServices, function(dependency) {
          addChildService(serviceName, dependency);
        });
      });

      // Filter out child services and alternate services. Order top-level
      // services by importance.
      $scope.topLevelServices = _.filter(services, function(service) {
        // If this service has any child services, always show it in top level
        // services. Otherwise, children of children will not show up anywhere
        // on the overview.
        if (hasChildren(service)) {
          return true;
        }

        return !isChildService(service) && !isAlternateService(service);
      }).sort(compareServices);
    };

    var updateRouteWarnings = function() {
      if (!services || !routes) {
        return;
      }

      $scope.routeWarningsByService = {};
      _.each(services, function(service) {
        _.each($scope.routesByService[service.metadata.name], function(route) {
          var warnings = RoutesService.getRouteWarnings(route, service);
          _.set($scope, ['routeWarningsByService', service.metadata.name, route.metadata.name], warnings);
        });
      });
    };

    var groupBuildByOutputImage = function(build) {
      var buildOutputImage = imageObjectRef(_.get(build, 'spec.output.to'), build.metadata.namespace);
      $scope.recentBuildsByOutputImage[buildOutputImage] = $scope.recentBuildsByOutputImage[buildOutputImage] || [];
      $scope.recentBuildsByOutputImage[buildOutputImage].push(build);
    };

    var buildConfigForBuild = $filter('buildConfigForBuild');
    var groupPipelineByDC = function(build) {
      if (!buildConfigs) {
        return;
      }

      var bcName = buildConfigForBuild(build);
      var buildConfig = buildConfigs[bcName];
      if (!buildConfig) {
        return;
      }

      // Index running pipelines by DC name.
      var dcNames = BuildsService.usesDeploymentConfigs(buildConfig);
      _.each(dcNames, function(dcName) {
        $scope.recentPipelinesByDC[dcName] = $scope.recentPipelinesByDC[dcName] || [];
        $scope.recentPipelinesByDC[dcName].push(build);
      });
    };

    var groupBuilds = function() {
      if(!builds) {
        return;
      }
      // reset these maps
      $scope.recentPipelinesByDC = {};
      $scope.recentBuildsByOutputImage = {};
      _.each(
        BuildsService.interestingBuilds(builds),
        function(build) {
          if(!isJenkinsPipelineStrategy(build)) {
            groupBuildByOutputImage(build);
            return;
          }
          groupPipelineByDC(build);
        });
    };


    // Show the "Get Started" message if the project is empty.
    var updateShowGetStarted = function() {
      // Check if there is any data visible in the overview.
      var projectEmpty =
        _.isEmpty(services) &&
        _.isEmpty($scope.monopodsByService) &&
        _.isEmpty(deployments);

      // Check if we've loaded everything we show on the overview.
      var loaded = services && pods && deployments && deploymentConfigs;

      $scope.renderOptions.showGetStarted = loaded && projectEmpty;
      $scope.renderOptions.showLoading = !loaded && projectEmpty;
      $scope.renderOptions.showToolbar = !projectEmpty;
    };


    $scope.viewPodsForDeployment = function(deployment) {
      if (_.isEmpty($scope.podsByDeployment[deployment.metadata.name])) {
        return;
      }

      Navigate.toPodsForDeployment(deployment);
    };

    $scope.getHPA = function(rcName, dcName) {
      var hpaByDC = $scope.hpaByDC;
      var hpaByRC = $scope.hpaByRC;
      // Return `null` if the HPAs haven't been loaded.
      if (!hpaByDC || !hpaByRC) {
        return null;
      }

      // Set missing values to an empty array if the HPAs have loaded. We
      // want to use the same empty array for subsequent requests to avoid
      // triggering watch callbacks in overview-deployment.
      if (dcName) {
        hpaByDC[dcName] = hpaByDC[dcName] || [];
        return hpaByDC[dcName];
      }

      hpaByRC[rcName] = hpaByRC[rcName] || [];
      return hpaByRC[rcName];
    };

    $scope.isScalableDeployment = function(deployment) {
      return DeploymentsService.isScalable(deployment,
                                            deploymentConfigs,
                                            $scope.hpaByDC,
                                            $scope.hpaByRC,
                                            $scope.scalableDeploymentByConfig);
    };

    $scope.isDeploymentLatest = function(deployment) {
      var dcName = annotation(deployment, 'deploymentConfig');
      if (!dcName) {
        return true;
      }

      // Wait for deployment configs to load.
      if (!$scope.deploymentConfigs) {
        return false;
      }

      var deploymentVersion = parseInt(annotation(deployment, 'deploymentVersion'));
      return _.some($scope.deploymentConfigs, function(dc) {
        return dc.metadata.name === dcName && dc.status.latestVersion === deploymentVersion;
      });
    };

    if (!window.OPENSHIFT_CONSTANTS.DISABLE_OVERVIEW_METRICS) {
      MetricsService.isAvailable(true).then(function(available) {
        $scope.showMetrics = available;
      });
    }

    var limitWatches = $filter('isIE')() || $filter('isEdge')();

    ProjectsService
      .get($routeParams.project)
      .then(_.spread(function(project, context) {
        $scope.project = project;
        $scope.projectContext = context;

        watches.push(DataService.watch("pods", context, function(podsData) {
          pods = podsData.by("metadata.name");
          groupPods();
          updateShowGetStarted();
          updateTopologyLater();
          Logger.log("pods", pods);
        }));

        watches.push(DataService.watch("services", context, function(serviceData) {
          $scope.services = services = serviceData.by("metadata.name");
          groupServices();
          groupPods();
          groupDeploymentConfigs();
          groupDeployments();
          updateRouteWarnings();
          updateShowGetStarted();
          updateTopologyLater();
          Logger.log("services (list)", services);
        }));

        watches.push(DataService.watch("builds", context, function(buildData) {
          builds = buildData.by("metadata.name");
          groupBuilds();
          updateShowGetStarted();
          Logger.log("builds (list)", builds);
        }));

        watches.push(DataService.watch("buildConfigs", context, function(buildConfigData) {
          buildConfigs = buildConfigData.by("metadata.name");
          groupBuilds();
          Logger.log("builds (list)", builds);
        }));

        watches.push(DataService.watch("routes", context, function(routesData) {
          routes = routesData.by("metadata.name");
          groupRoutes();
          groupServices();
          updateRouteWarnings();
          updateTopologyLater();
          Logger.log("routes (subscribe)", $scope.routesByService);
        }, {poll: limitWatches, pollInterval: 60 * 1000}));

        // Sets up subscription for deployments
        watches.push(DataService.watch("replicationcontrollers", context, function(rcData) {
          $scope.deploymentsByName = deployments = rcData.by("metadata.name");
          groupDeployments();
          groupPods();
          groupBuilds();
          updateShowGetStarted();
          updateTopologyLater();
          Logger.log("replicationcontrollers (subscribe)", deployments);
        }));

        // Sets up subscription for deploymentConfigs, associates builds to triggers on deploymentConfigs
        watches.push(DataService.watch("deploymentconfigs", context, function(dcData) {
          deploymentConfigs = dcData.by("metadata.name");
          groupDeploymentConfigs();
          groupDeployments();
          updateShowGetStarted();
          updateTopologyLater();
          Logger.log("deploymentconfigs (subscribe)", $scope.deploymentConfigs);
        }));

        watches.push(DataService.watch({
          group: "extensions",
          resource: "horizontalpodautoscalers"
        }, context, function(hpaData) {
          horizontalPodAutoscalers = hpaData.by("metadata.name");
          groupHPAs();
        }, {poll: limitWatches, pollInterval: 60 * 1000}));

        // List limit ranges in this project to determine if there is a default
        // CPU request for autoscaling.
        DataService.list("limitranges", context, function(response) {
          $scope.limitRanges = response.by("metadata.name");
        });

        $scope.$on('$destroy', function(){
          DataService.unwatchAll(watches);
          $(window).off('click.topologyItem');
          $('.kube-topology g').popover('destroy');
        });

        // Topology view specific code
        var updateTimeout = null;

        function updateTopology() {
          updateTimeout = null;

          var topologyRelations = [];
          var topologyItems = { };

          // Because metadata.uid is not unique among resources
          function makeId(resource) {
            return resource.kind + resource.metadata.uid;
          }

          // Add the services
          angular.forEach($scope.services, function(service) {
            topologyItems[makeId(service)] = service;
          });

          var isRecentDeployment = $filter('isRecentDeployment');
          var isVisibleDeployment = function(deployment) {
            // If this is a replication controller and not a deployment, then it's visible.
            var dcName = $filter('annotation')(deployment, 'deploymentConfig');
            if (!dcName) {
              return true;
            }

            // If the deployment is active, it's visible.
            if ($filter('hashSize')($scope.podsByDeployment[deployment.metadata.name]) > 0) {
              return true;
            }

            // Wait for deployment configs to load.
            if (!$scope.deploymentConfigs) {
              return false;
            }

            // If the deployment config has been deleted and the deployment has no replicas, hide it.
            // Otherwise all old deployments for a deleted deployment config will be visible.
            var dc = $scope.deploymentConfigs[dcName];
            if (!dc) {
              return false;
            }

            // Show the deployment if it's recent (latest or in progress) or if it's scalable.
            return isRecentDeployment(deployment, dc) || $scope.isScalableDeployment(deployment);
          };

          // Add everything related to services, each of these tables are in
          // standard form with string keys, pointing to a map of further
          // name -> resource mappings.
          [
            $scope.podsByService,
            $scope.monopodsByService,
            $scope.deploymentsByService,
            $scope.deploymentConfigsByService,
            $scope.routesByService
          ].forEach(function(map) {
            angular.forEach(map, function(resources, serviceName) {
              var service = $scope.services[serviceName];
              if (!serviceName || service) {
                angular.forEach(resources, function(resource) {
                  // Filter some items to be consistent with the tiles view.
                  if (resource.kind === 'Pod' && !showMonopod(resource)) {
                    return;
                  }

                  if (resource.kind === 'ReplicationController' && !isVisibleDeployment(resource)) {
                    return;
                  }

                  topologyItems[makeId(resource)] = resource;
                });
              }
            });
          });

          // Things to link to services. Note that we can push as relations
          // no non-existing items into the topology without ill effect
          [
            $scope.podsByService,
            $scope.monopodsByService,
            $scope.routesByService
          ].forEach(function(map) {
            angular.forEach(map, function(resources, serviceName) {
              var service = $scope.services[serviceName];
              if (service) {
                angular.forEach(resources, function(resource) {
                  topologyRelations.push({ source: makeId(service), target: makeId(resource) });
                });
              }
            });
          });

          // A special case, not related to services
          angular.forEach($scope.podsByDeployment, function(pods, deploymentName) {
            var deployment = $scope.deploymentsByName[deploymentName];
            if (deployment && makeId(deployment) in topologyItems) {
              angular.forEach(pods, function(pod) {
          topologyItems[makeId(pod)] = pod;
                topologyRelations.push({ source: makeId(deployment), target: makeId(pod) });
              });
            }
          });

          // Link deployment configs to their deployment
          angular.forEach($scope.deploymentsByName, function(deployment, deploymentName) {
            var deploymentConfig, annotations = deployment.metadata.annotations || {};
            var deploymentConfigName = annotations["openshift.io/deployment-config.name"] || deploymentName;
            if (deploymentConfigName && $scope.deploymentConfigs) {
              deploymentConfig = $scope.deploymentConfigs[deploymentConfigName];
              if (deploymentConfig) {
                topologyRelations.push({ source: makeId(deploymentConfig), target: makeId(deployment) });
              }
            }
          });

          $scope.$evalAsync(function() {
            $scope.topologyItems = topologyItems;
            $scope.topologyRelations = topologyRelations;
          });
        }

        function updateTopologyLater() {
          if (!updateTimeout) {
            updateTimeout = window.setTimeout(updateTopology, 100);
          }
        }

        $scope.$on("select", function(ev, resource) {
          $scope.$apply(function() {
            $scope.topologySelection = resource;
          });
        }, true);

        $scope.$watch('renderOptions.overviewMode', function(mode) {
          if (mode === 'topology') {
            $(window).on('click.topologyItem', function(evt) {
              var g = $(evt.target).closest('g', $('.kube-topology'));
              $('g', '.kube-topology').not(g).popover('hide');
              if (g.length) {
                if (!(g.data('bs.popover'))) {
                  g.popover({
                    container: 'body',
                    content: function() {
                      return $filter('sentenceCase')($scope.topologySelection.kind) + ' <a href="' + $filter('navigateResourceURL')($scope.topologySelection) + '">' + $scope.topologySelection.metadata.name + '</a>';
                    },
                    html: true,
                    placement: 'top',
                    trigger: 'manual'
                  }).popover('show');
                }
                else {
                  g.popover('toggle');
                }
              }
            });
          }
          else {
            $(window).off('click.topologyItem');
            $('.kube-topology g').popover('destroy');
          }
        });

      }));
  });
