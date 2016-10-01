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
                        LabelsService,
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

    $scope.alerts = $scope.alerts || {};
    AlertMessageService.getAlerts().forEach(function(alert) {
      $scope.alerts[alert.name] = alert.data;
    });
    AlertMessageService.clearAlerts();

    var watches = [];
    var routes,
        services,
        deploymentConfigs,
        deployments,
        replicaSets,
        petSets,
        pods,
        buildConfigs,
        builds,
        horizontalPodAutoscalers,
        hpaByResource;

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
      $scope.deploymentConfigsByService = LabelsService.groupBySelector(deploymentConfigs, services, { matchTemplate: true });
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

      $scope.deploymentsByService = LabelsService.groupBySelector(deployments, services, { matchTemplate: true });
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

    var groupReplicaSets = function() {
      if (!services || !replicaSets) {
        return;
      }

      $scope.replicaSetsByService = LabelsService.groupBySelector(replicaSets, services, { matchTemplate: true });
    };

    var groupPetSets = function() {
      if (!services || !petSets) {
        return;
      }

      $scope.petSetsByService = LabelsService.groupBySelector(petSets, services, { matchTemplate: true });
    };

    var groupHPAs = function() {
      hpaByResource = {};
      _.each(horizontalPodAutoscalers, function(hpa) {
        var name = hpa.spec.scaleRef.name, kind = hpa.spec.scaleRef.kind;
        if (!name || !kind) {
          return;
        }

        // TODO: Handle groups and subresources in hpa.spec.scaleRef
        // var groupVersion = APIService.parseGroupVersion(hpa.spec.scaleRef.apiVersion) || {};
        // var group = groupVersion.group || '';
        // if (!_.has(hpaByResource, [group, kind, name])) {
        //   _.set(hpaByResource, [group, kind, name], []);
        // }
        // hpaByResource[group][kind][name].push(hpa);

        if (!_.has(hpaByResource, [kind, name])) {
          _.set(hpaByResource, [kind, name], []);
        }
        hpaByResource[kind][name].push(hpa);
      });
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
      if (!pods || !deployments || !replicaSets || !petSets) {
        return;
      }

      var allOwners = _.toArray(deployments).concat(_.toArray(replicaSets)).concat(_.toArray(petSets));
      $scope.podsByOwnerUID = LabelsService.groupBySelector(pods, allOwners, { key: 'metadata.uid' });

      var monopods = $scope.podsByOwnerUID[''];
      $scope.monopodsByService = LabelsService.groupBySelector(monopods, services, { include: showMonopod });
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
        _.isEmpty(deployments) &&
        _.isEmpty(replicaSets) &&
        _.isEmpty(petSets);

      // Check if we've loaded everything we show on the overview.
      var loaded = services && pods && deployments && deploymentConfigs && replicaSets && petSets;

      $scope.renderOptions.showGetStarted = loaded && projectEmpty;
      $scope.renderOptions.showLoading = !loaded && projectEmpty;
    };


    $scope.viewPodsForDeployment = function(deployment) {
      if (_.isEmpty($scope.podsByOwnerUID[deployment.metadata.uid])) {
        return;
      }

      Navigate.toPodsForDeployment(deployment);
    };

    $scope.isScalableDeployment = function(deployment) {
      return DeploymentsService.isScalable(deployment,
                                           deploymentConfigs,
                                           // TODO: Handle groups
                                           _.get(hpaByResource, 'DeploymentConfig'),
                                           _.get(hpaByResource, 'ReplicationController'),
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

    // Return the same empty array each time to avoid triggering
    // $scope.$watch updates. Otherwise, digest loop errors occur.
    var NO_HPA = [];
    $scope.getHPA = function(object) {
      if (!horizontalPodAutoscalers) {
        return null;
      }

      // TODO: Handle groups and subresources
      var kind = _.get(object, 'kind'),
          name = _.get(object, 'metadata.name');
          // groupVersion = APIService.parseGroupVersion(object.apiVersion) || {},
          // group = groupVersion.group || '';
      return _.get(hpaByResource, [kind, name], NO_HPA);
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
          Logger.log("pods", pods);
        }));

        watches.push(DataService.watch("services", context, function(serviceData) {
          $scope.services = services = serviceData.by("metadata.name");
          groupServices();
          groupPods();
          groupDeploymentConfigs();
          groupDeployments();
          groupReplicaSets();
          groupPetSets();
          updateRouteWarnings();
          updateShowGetStarted();
          Logger.log("services (list)", services);
        }, {poll: limitWatches, pollInterval: 60 * 1000}));

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
        }, {poll: limitWatches, pollInterval: 60 * 1000}));

        watches.push(DataService.watch("routes", context, function(routesData) {
          routes = routesData.by("metadata.name");
          groupRoutes();
          groupServices();
          updateRouteWarnings();
          Logger.log("routes (subscribe)", $scope.routesByService);
        }, {poll: limitWatches, pollInterval: 60 * 1000}));

        // Sets up subscription for deployments
        watches.push(DataService.watch("replicationcontrollers", context, function(rcData) {
          $scope.deploymentsByName = deployments = rcData.by("metadata.name");
          groupDeployments();
          groupPods();
          groupBuilds();
          updateShowGetStarted();
          Logger.log("replicationcontrollers (subscribe)", deployments);
        }));

        // Sets up subscription for deploymentConfigs, associates builds to triggers on deploymentConfigs
        watches.push(DataService.watch("deploymentconfigs", context, function(dcData) {
          deploymentConfigs = dcData.by("metadata.name");
          groupDeploymentConfigs();
          groupDeployments();
          updateShowGetStarted();
          Logger.log("deploymentconfigs (subscribe)", deploymentConfigs);
        }));

        watches.push(DataService.watch({
          group: "extensions",
          resource: "replicasets"
        }, context, function(replicaSetData) {
          replicaSets = replicaSetData.by('metadata.name');
          groupPods();
          groupReplicaSets();
          updateShowGetStarted();
          Logger.log("replicasets (subscribe)", replicaSets);
        }));

        watches.push(DataService.watch({
          group: "apps",
          resource: "petsets"
        }, context, function(petSetData) {
          petSets = petSetData.by('metadata.name');
          groupPods();
          groupPetSets();
          updateShowGetStarted();
          Logger.log("petsets (subscribe)", petSets);
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
        });
      }));
  });
