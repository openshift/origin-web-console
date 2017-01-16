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
                        MetricsService,
                        QuotaService) {
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
        deployments,
        deploymentConfigs,
        replicationControllers,
        replicationControllersByDC,
        replicaSets,
        statefulSets,
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
    var servicesWithAlternates = {};
    var findAlternateServices = function() {
      // Map of service names and a truthy value if this is a alternate service for a route.
      alternateServiceSet = {};
      _.each(routes, function(route) {
        var alternateBackends = _.get(route, 'spec.alternateBackends', []);
        var alternateServices = _.filter(alternateBackends, { kind: 'Service' });
        if (!_.isEmpty(alternateServices)) {
          var primary = _.get(route, 'spec.to.name');
          servicesWithAlternates[primary] = true;
          _.each(alternateServices, function(routeTarget) {
            alternateServiceSet[routeTarget.name] = true;
          });
        }
      });
    };

    var hasAlternateServices = function(service) {
      var name = _.get(service, 'metadata.name');
      return _.has(servicesWithAlternates, name);
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

    var groupDeployments = function() {
      if (!services || !deployments) {
        return;
      }

      $scope.deployments = deployments;
      $scope.deploymentsByService = LabelsService.groupBySelector(deployments, services, { matchTemplate: true });
    };

    var isReplicationControllerVisible = function(replicationController) {
      if (_.get(replicationController, 'status.replicas')) {
        return true;
      }
      var dcName = annotation(replicationController, 'deploymentConfig');
      if (!dcName) {
        return true;
      }
      // Wait for deployment configs to load.
      if (!deploymentConfigs) {
        return false;
      }
      // If the deployment config has been deleted and the deployment has no replicas, hide it.
      // Otherwise all old deployments for a deleted deployment config will be visible.
      var deploymentConfig = deploymentConfigs[dcName];
      if (!deploymentConfig) {
        return false;
      }
      return isRecentDeployment(replicationController, deploymentConfig);
    };

    var findMostRecent = $filter('mostRecent');
    var groupReplicationControllersByDC = function() {
      if (!replicationControllers) {
        return;
      }

      replicationControllersByDC = DeploymentsService.groupByDeploymentConfig(replicationControllers);

      // Only the most recent in progress or complete deployment for a given
      // deployment config is scalable in the overview.
      var scalableReplicationControllerByDC = {};
      var mostRecentReplicationControllerByDC = {};
      _.each(replicationControllersByDC, function(replicationControllers, dcName) {
        scalableReplicationControllerByDC[dcName] = DeploymentsService.getActiveDeployment(replicationControllers);
        // Also find the most recent replication controller for a deployment
        // config so we can warn if it's cancelled or failed.
        mostRecentReplicationControllerByDC[dcName] = findMostRecent(replicationControllers);
      });
      $scope.scalableReplicationControllerByDC = scalableReplicationControllerByDC;
      $scope.mostRecentReplicationControllerByDC = mostRecentReplicationControllerByDC;

      // Replication controllers that don't have a deployment config.
      $scope.vanillaReplicationControllersByService = LabelsService.groupBySelector(replicationControllersByDC[''], services, { matchTemplate: true });

      $scope.visibleRCByDC = {};
      _.each(replicationControllersByDC, function(replicationControllers, dcName) {
        $scope.visibleRCByDC[dcName] = _.filter(replicationControllers, isReplicationControllerVisible);
      });
    };

    var groupReplicationControllersByService = function() {
      if (!services || !replicationControllers) {
        return;
      }

      $scope.replicationControllersByService = LabelsService.groupBySelector(replicationControllers, services, { matchTemplate: true });
    };

    var groupReplicaSetsByService = function() {
      if (!services || !replicaSets) {
        return;
      }

      $scope.replicaSetsByService = LabelsService.groupBySelector(replicaSets, services, { matchTemplate: true });
    };

    var isReplicaSetVisible = function(replicaSet, deployment) {
      // If the replica set has pods, show it.
      if (_.get(replicaSet, 'status.replicas')) {
        return true;
      }

      var revision = DeploymentsService.getRevision(replicaSet);

      // If not part of a deployment, always show the replica set.
      if (!revision) {
        return true;
      }

      // If the deployment config has been deleted and the deployment has no replicas, hide it.
      // Otherwise all old deployments for a deleted deployment config will be visible.
      if (!deployment) {
        return false;
      }

      // Show the replica set if it's the latest revision.
      return DeploymentsService.getRevision(deployment) === revision;
    };


    var groupReplicaSetsByDeployment = function() {
      if (!replicaSets || !deployments) {
        return;
      }

      $scope.replicaSetsByDeployment = LabelsService.groupBySelector(replicaSets, deployments, { matchSelector: true });
      var scalableReplicaSetsByDeployment = {};
      _.each($scope.replicaSetsByDeployment, function(replicaSets, deploymentName) {
        var deployment = _.get(deployments, [deploymentName]);
        scalableReplicaSetsByDeployment[deploymentName] = DeploymentsService.getActiveReplicaSet(replicaSets, deployment);
      });
      $scope.scalableReplicaSetsByDeployment = scalableReplicaSetsByDeployment;

      // Take all visible deployments grouped by deployment config and service
      $scope.visibleRSByDeploymentAndService = {};
      _.each($scope.replicaSetsByService, function(replicaSets, svcName) {
        $scope.visibleRSByDeploymentAndService[svcName] = {};
        var byDeployment = LabelsService.groupBySelector(replicaSets, deployments, { matchSelector: true });
        _.each(byDeployment, function(replicaSets, deploymentName) {
          $scope.visibleRSByDeploymentAndService[svcName][deploymentName] = _.filter(replicaSets, function(replicaSet) {
            var deployment = deployments[deploymentName];
            return isReplicaSetVisible(replicaSet, deployment);
          });
        });
      });
    };

    var groupStatefulSets = function() {
      if (!services || !statefulSets) {
        return;
      }

      $scope.statefulSetsByService = LabelsService.groupBySelector(statefulSets, services, { matchTemplate: true });
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
      if (!pods || !replicationControllers || !replicaSets || !statefulSets) {
        return;
      }

      var allOwners = _.toArray(replicationControllers).concat(_.toArray(replicaSets)).concat(_.toArray(statefulSets));
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

    var topLevelServicesByApp = {};

    // Check if an app label is used more than once on a top-level service so we can disambiguate.
    $scope.isDuplicateApp = function(app) {
      return _.size(topLevelServicesByApp[app]) > 1;
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

      topLevelServicesByApp = {};

      // Filter out child services and alternate services. Order top-level
      // services by app name, then service name.
      $scope.topLevelServices = _.chain(services).filter(function(service) {
        // If this service has any child services, always show it in top level
        // services. Otherwise, children of children will not show up anywhere
        // on the overview.
        if (hasChildren(service)) {
          return true;
        }

        // Similarly, if this service is part of a route with alternate
        // services, show it as a top-level service so the alternates are not
        // hidden.
        if (hasAlternateServices(service)) {
          return true;
        }

        return !isChildService(service) && !isAlternateService(service);
      }).sortByAll(['metadata.labels.app', 'metadata.name']).value();

      _.each($scope.topLevelServices, function(service) {
        var app = _.get(service, 'metadata.labels.app');
        if (!app) {
          return;
        }

        _.set(topLevelServicesByApp, [app, service.metadata.name], service);
      });
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

      $scope.pipelinesForDC = {};
      _.each(buildConfigs, function(buildConfig) {
        _.each(BuildsService.usesDeploymentConfigs(buildConfig), function(dcName) {
          $scope.pipelinesForDC[dcName] = $scope.pipelinesForDC[dcName] || [];
          $scope.pipelinesForDC[dcName].push(buildConfig);
        });
      });
    };


    // Show the "Get Started" message if the project is empty.
    var updateShowGetStarted = function() {
      // Check if there is any data visible in the overview.
      var projectEmpty =
        _.isEmpty(services) &&
        _.isEmpty(deploymentConfigs) &&
        _.isEmpty($scope.monopodsByService) &&
        _.isEmpty(replicationControllers) &&
        _.isEmpty(replicaSets) &&
        _.isEmpty(statefulSets);

      // Check if we've loaded everything we show on the overview.
      var loaded = services && pods && replicationControllers && replicaSets && statefulSets;

      $scope.renderOptions.showGetStarted = loaded && projectEmpty;
      $scope.renderOptions.showLoading = !loaded && projectEmpty;
    };

    var setGenericQuotaWarning = function() {
      var isHidden = AlertMessageService.isAlertPermanentlyHidden("overview-quota-limit-reached", $scope.projectName);
      if (!isHidden && QuotaService.isAnyQuotaExceeded($scope.quotas, $scope.clusterQuotas)) {
        if ($scope.alerts['quotaExceeded']) {
          // Don't recreate the alert or it will reset the temporary hidden state
          return;
        }
        $scope.alerts['quotaExceeded'] = {
          type: 'warning',
          message: 'Quota limit has been reached.',
          links: [{
            href: "project/" + $scope.projectName + "/quota",
            label: "View Quota"
          },{
            href: "",
            label: "Don't Show Me Again",
            onClick: function() {
              // Hide the alert on future page loads.
              AlertMessageService.permanentlyHideAlert("overview-quota-limit-reached", $scope.projectName);

              // Return true close the existing alert.
              return true;
            }
          }]
        };
      }
      else {
        delete $scope.alerts['quotaExceeded'];
      }
    };

    $scope.viewPodsForDeployment = function(deployment) {
      if (_.isEmpty($scope.podsByOwnerUID[deployment.metadata.uid])) {
        return;
      }

      Navigate.toPodsForDeployment(deployment);
    };

    $scope.isScalableReplicationController = function(replicationController) {
      return DeploymentsService.isScalable(replicationController,
                                           deploymentConfigs,
                                           // TODO: Handle groups
                                           _.get(hpaByResource, 'DeploymentConfig'),
                                           _.get(hpaByResource, 'ReplicationController'),
                                           $scope.scalableReplicationControllerByDC);
    };

    $scope.isDeploymentLatest = function(replicationController) {
      var dcName = annotation(replicationController, 'deploymentConfig');
      if (!dcName) {
        return true;
      }

      // Wait for deployment configs to load.
      if (!deploymentConfigs) {
        return false;
      }

      var deploymentVersion = parseInt(annotation(replicationController, 'deploymentVersion'));
      return _.some(deploymentConfigs, function(dc) {
        return dc.metadata.name === dcName && dc.status.latestVersion === deploymentVersion;
      });
    };

    $scope.hasUnservicedContent = function() {
      var content = [
        'monopodsByService',
        'deploymentConfigsByService',
        'deploymentsByService',
        'replicationControllersByService',
        'replicaSetsByService',
        'statefulSetsByService'
      ];
      return _.some(content, function(contentByService) {
        var unservicedContent = _.get($scope, [contentByService, ''], {});
        return !_.isEmpty(unservicedContent);
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

      $scope.$on('metrics-connection-failed', function(e, data) {
        var hidden = AlertMessageService.isAlertPermanentlyHidden('metrics-connection-failed');
        if (hidden || $scope.alerts['metrics-connection-failed']) {
          return;
        }

        $scope.alerts['metrics-connection-failed'] = {
          type: 'warning',
          message: 'An error occurred getting metrics.',
          links: [{
            href: data.url,
            label: 'Open Metrics URL',
            target: '_blank'
          }, {
            href: '',
            label: "Don't Show Me Again",
            onClick: function() {
              // Hide the alert on future page loads.
              AlertMessageService.permanentlyHideAlert('metrics-connection-failed');

              // Return true close the existing alert.
              return true;
            }
          }]
        };
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
          groupReplicationControllersByService();
          groupReplicationControllersByDC();
          groupReplicaSetsByService();
          groupStatefulSets();
          updateRouteWarnings();
          updateShowGetStarted();
          Logger.log("services (subscribe)", services);
        }, {poll: limitWatches, pollInterval: 60 * 1000}));

        watches.push(DataService.watch("builds", context, function(buildData) {
          builds = buildData.by("metadata.name");
          groupBuilds();
          updateShowGetStarted();
          Logger.log("builds (subscribe)", builds);
        }));

        watches.push(DataService.watch("buildConfigs", context, function(buildConfigData) {
          buildConfigs = buildConfigData.by("metadata.name");
          groupBuilds();
          Logger.log("builds (subscribe)", builds);
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
          $scope.replicationControllersByName = replicationControllers = rcData.by("metadata.name");
          groupReplicationControllersByService();
          groupReplicationControllersByDC();
          groupPods();
          groupBuilds();
          updateShowGetStarted();
          Logger.log("replicationcontrollers (subscribe)", replicationControllers);
        }));

        // Sets up subscription for deploymentConfigs, associates builds to triggers on deploymentConfigs
        watches.push(DataService.watch("deploymentconfigs", context, function(dcData) {
          deploymentConfigs = dcData.by("metadata.name");
          groupDeploymentConfigs();
          groupReplicationControllersByDC();
          updateShowGetStarted();
          Logger.log("deploymentconfigs (subscribe)", deploymentConfigs);
        }));

        watches.push(DataService.watch({
          group: "extensions",
          resource: "replicasets"
        }, context, function(replicaSetData) {
          replicaSets = replicaSetData.by('metadata.name');
          groupPods();
          groupReplicaSetsByService();
          groupReplicaSetsByDeployment();
          updateShowGetStarted();
          Logger.log("replicasets (subscribe)", replicaSets);
        }));

        watches.push(DataService.watch({
          group: "apps",
          resource: "statefulsets"
        }, context, function(statefulSetData) {
          statefulSets = statefulSetData.by('metadata.name');
          groupPods();
          groupStatefulSets();
          updateShowGetStarted();
          Logger.log("statefulsets (subscribe)", statefulSets);
        }, {poll: limitWatches, pollInterval: 60 * 1000}));

        watches.push(DataService.watch({
          group: "extensions",
          resource: "deployments"
        }, context, function(deploymentData) {
          deployments = deploymentData.by('metadata.name');
          groupDeployments();
          groupReplicaSetsByDeployment();
          updateShowGetStarted();
          Logger.log("deployments (subscribe)", deployments);
        }));

        watches.push(DataService.watch({
          group: "extensions",
          resource: "horizontalpodautoscalers"
        }, context, function(hpaData) {
          horizontalPodAutoscalers = hpaData.by("metadata.name");
          groupHPAs();
        }, {poll: limitWatches, pollInterval: 60 * 1000}));

        // Always poll quotas instead of watching, its not worth the overhead of maintaining websocket connections
        watches.push(DataService.watch('resourcequotas', context, function(quotaData) {
          $scope.quotas = quotaData.by("metadata.name");
          setGenericQuotaWarning();
        }, {poll: true, pollInterval: 60 * 1000}));

        watches.push(DataService.watch('appliedclusterresourcequotas', context, function(clusterQuotaData) {
          $scope.clusterQuotas = clusterQuotaData.by("metadata.name");
          setGenericQuotaWarning();
        }, {poll: true, pollInterval: 60 * 1000}));

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
