'use strict';

angular.module('openshiftConsole').controller('OverviewController', [
  '$scope',
  '$filter',
  '$q',
  '$location',
  '$routeParams',
  'AlertMessageService',
  'APIService',
  'AppsService',
  'BindingService',
  'BuildsService',
  'CatalogService',
  'Constants',
  'DataService',
  'DeploymentsService',
  'HomePagePreferenceService',
  'HPAService',
  'HTMLService',
  'ImageStreamResolver',
  'KeywordService',
  'LabelFilter',
  'Logger',
  'MetricsService',
  'Navigate',
  'OwnerReferencesService',
  'PodsService',
  'ProjectsService',
  'PromiseUtils',
  'ResourceAlertsService',
  'RoutesService',
  'ServiceInstancesService',
  'KubevirtVersions',
  'VmHelpers',
  OverviewController
]);

function OverviewController($scope,
                            $filter,
                            $q,
                            $location,
                            $routeParams,
                            AlertMessageService,
                            APIService,
                            AppsService,
                            BindingService,
                            BuildsService,
                            CatalogService,
                            Constants,
                            DataService,
                            DeploymentsService,
                            HomePagePreferenceService,
                            HPAService,
                            HTMLService,
                            ImageStreamResolver,
                            KeywordService,
                            LabelFilter,
                            Logger,
                            MetricsService,
                            Navigate,
                            OwnerReferencesService,
                            PodsService,
                            ProjectsService,
                            PromiseUtils,
                            ResourceAlertsService,
                            RoutesService,
                            ServiceInstancesService,
                            KubevirtVersions,
                            VmHelpers) {
  var overview = this;
  var limitWatches = $filter('isIE')();
  var DEFAULT_POLL_INTERVAL = 60 * 1000; // milliseconds

  $scope.projectName = $routeParams.project;
  var isHomePage = $routeParams.isHomePage;

  overview.catalogLandingPageEnabled = !Constants.DISABLE_SERVICE_CATALOG_LANDING_PAGE;

  // Filters used by this controller.
  var annotation = $filter('annotation');
  var canI = $filter('canI');
  var getBuildConfigName = $filter('buildConfigForBuild');
  var deploymentIsInProgress = $filter('deploymentIsInProgress');
  var imageObjectRef = $filter('imageObjectRef');
  var isJenkinsPipelineStrategy = $filter('isJenkinsPipelineStrategy');
  var isNewerResource = $filter('isNewerResource');
  var label = $filter('label');
  var getPodTemplate = $filter('podTemplate');

  var buildConfigsVersion = APIService.getPreferredVersion('buildconfigs');
  var buildsVersion = APIService.getPreferredVersion('builds');
  var clusterResourceQuotasVersion = APIService.getPreferredVersion('appliedclusterresourcequotas');
  var daemonSetsVersion = APIService.getPreferredVersion('daemonsets');
  var deploymentConfigsVersion = APIService.getPreferredVersion('deploymentconfigs');
  var deploymentsVersion = APIService.getPreferredVersion('deployments');
  var horizontalPodAutoscalersVersion = APIService.getPreferredVersion('horizontalpodautoscalers');
  var imageStreamsVersion = APIService.getPreferredVersion('imagestreams');
  var limitRangesVersion = APIService.getPreferredVersion('limitranges');
  var podsVersion = APIService.getPreferredVersion('pods');
  var replicaSetsVersion = APIService.getPreferredVersion('replicasets');
  var replicationControllersVersion = APIService.getPreferredVersion('replicationcontrollers');
  var resourceQuotasVersion = APIService.getPreferredVersion('resourcequotas');
  var routesVersion = APIService.getPreferredVersion('routes');
  var serviceBindingsVersion = APIService.getPreferredVersion('servicebindings');
  var serviceClassesVersion = APIService.getPreferredVersion('clusterserviceclasses');
  var serviceInstancesVersion = APIService.getPreferredVersion('serviceinstances');
  var servicePlansVersion = APIService.getPreferredVersion('clusterserviceplans');
  var servicesVersion = APIService.getPreferredVersion('services');
  var statefulSetsVersion = APIService.getPreferredVersion('statefulsets');
  var templatesVersion = APIService.getPreferredVersion('templates');
  overview.buildConfigsInstantiateVersion = APIService.getPreferredVersion('buildconfigs/instantiate');

  var deploymentsByUID;
  var imageStreams;
  var labelSuggestions = {};
  var pipelineLabelSuggestions = {};

  // The most recent replication controller by deployment config name. This
  // might not be the active deployment if failed or cancelled.
  var mostRecentByDeploymentConfig = {};

  // `overview.state` tracks common state that is shared with overview-list-row.
  // This avoids having to pass the same values as attributes again and again
  // for different types, but lets us update these maps in one place as needed
  // from watch callbacks in the overview controller.
  //
  // NOTE: Do not change or remove properties without updating overview-list-row.
  var state = overview.state = {
    alerts: {},
    builds: {},
    clusterQuotas: {},
    imageStreamImageRefByDockerReference: {},
    imagesByDockerReference: {},
    limitRanges: {},
    limitWatches: limitWatches,
    notificationsByObjectUID: {},
    pipelinesByDeploymentConfig: {},
    podsByOwnerUID: {},
    quotas: {},
    recentPipelinesByDeploymentConfig: {},
    routesByService: {},
    servicesByObjectUID: {},
    serviceInstances: {},
    serviceClasses: {},
    servicePlans: {},
    bindingsByInstanceRef: {},
    bindingsByApplicationUID: {},
    applicationsByBinding: {},
    // Set to true below when metrics are available.
    showMetrics: false
  };

  // Track the breakpoint ourselves so we can remove elements from the page,
  // rather than hiding them using CSS. This avoids rendering charts more than
  // once for the responsive layout, which switches to tabs at smaller screen
  // widths.
  overview.state.breakpoint = HTMLService.getBreakpoint();
  var onResize = _.throttle(function() {
    var breakpoint = HTMLService.getBreakpoint();
    if (overview.state.breakpoint !== breakpoint) {
      $scope.$evalAsync(function() {
        overview.state.breakpoint = breakpoint;
      });
    }
  }, 50);

  $(window).on('resize.overview', onResize);

  overview.showGetStarted = false;
  overview.showLoading = true;

  overview.filterByOptions = [{
    id: 'name',
    label: 'Name'
  }, {
    id: 'label',
    label: 'Label'
  }];

  // If there is a label filter persisted (such as in the URL), default to filtering by label.
  overview.filterBy = LabelFilter.getLabelSelector().isEmpty() ? 'name' : 'label';

  overview.viewByOptions = [{
    id: 'app',
    label: 'Application'
  }, {
    id: 'resource',
    label: 'Resource Type'
  }, {
    id: 'pipeline',
    label: 'Pipeline'
  }];

  var getName = function(apiObject) {
    return _.get(apiObject, 'metadata.name');
  };

  var getUID = function(apiObject) {
    return _.get(apiObject, 'metadata.uid');
  };

  // The size of all visible top-level items.
  var size = function() {
    return _.size(overview.deploymentConfigs) +
           _.size(overview.vanillaReplicationControllers) +
           _.size(overview.deployments) +
           _.size(overview.vanillaReplicaSets) +
           _.size(overview.statefulSets) +
           _.size(overview.daemonSets) +
           _.size(overview.monopods) +
           _.size(overview.state.serviceInstances) +
           _.size(overview.mobileClients) +
           _.size(overview.virtualMachines);
  };

  // The size of all visible top-level items after filtering.
  var filteredSize = function() {
    return _.size(overview.filteredDeploymentConfigs) +
           _.size(overview.filteredReplicationControllers) +
           _.size(overview.filteredDeployments) +
           _.size(overview.filteredReplicaSets) +
           _.size(overview.filteredStatefulSets) +
           _.size(overview.filteredDaemonSets) +
           _.size(overview.filteredMonopods) +
           _.size(overview.filteredServiceInstances) +
           _.size(overview.filteredMobileClients) +
           _.size(overview.filteredVirtualMachines);
  };

  // Show the "Get Started" message if the project is empty.
  var updateShowGetStarted = function() {
    overview.size = size();
    overview.filteredSize = filteredSize();

    // Check if there is any data visible in the overview.
    var projectEmpty = overview.size === 0;

    // Check if we've loaded the top-level items we show on the overview.
    var loaded = overview.deploymentConfigs &&
                 overview.replicationControllers &&
                 overview.deployments &&
                 overview.replicaSets &&
                 overview.statefulSets &&
                 overview.daemonSets &&
                 overview.pods &&
                 overview.state.serviceInstances;

    state.expandAll = loaded && overview.size === 1;

    overview.showGetStarted = loaded && projectEmpty;
    overview.showLoading = !loaded && projectEmpty;

    overview.everythingFiltered = !projectEmpty && !overview.filteredSize;
    overview.hidePipelineOtherResources = overview.viewBy === 'pipeline' &&
                                          (overview.filterActive || _.isEmpty(overview.pipelineBuildConfigs));
  };

  // Group a collection of resources by app label. Returns a map where the key
  // is the app label value and the value is an array of objects, sorted by
  // `metadata.name`.
  var groupByApp = function(collection) {
    return AppsService.groupByApp(collection, 'metadata.name');
  };

  var getRoutesToDisplay = function(routes) {
    var routesToDisplay = [];
    var bestRoute = null;
    _.each(routes, function(candidate) {
      // If the the route has the annotation, display it
      if (RoutesService.isOverviewAppRoute(candidate)) {
        routesToDisplay.push(candidate);
        return;
      }

      if (!bestRoute) {
        bestRoute = candidate;
        return;
      }

      // Is candidate better than the current display route?
      bestRoute = RoutesService.getPreferredDisplayRoute(bestRoute, candidate);
    });

    // If no routes have been added and bestRoute exists, add bestRoute
    if (!routesToDisplay.length && bestRoute) {
      routesToDisplay.push(bestRoute);
    }

    return RoutesService.sortRoutesByScore(routesToDisplay);
  };

  // Debounce so we're not reevaluating this too often.
  var updateRoutesByApp = _.debounce(function() {
    $scope.$evalAsync(function() {
      overview.routesToDisplayByApp = {};

      if (!overview.routes) {
        return;
      }

      // Any of the following can have services that have routes.
      var toCheck = [
        overview.filteredDeploymentConfigsByApp,
        overview.filteredReplicationControllersByApp,
        overview.filteredDeploymentsByApp,
        overview.filteredReplicaSetsByApp,
        overview.filteredStatefulSetsByApp,
        overview.filteredDaemonSetsByApp,
        overview.filteredMonopodsByApp
      ];

      // Find the best route for each app.
      _.each(overview.apps, function(app) {
        // Create a map of routes, keyed by route name to avoid adding them twice.
        var routesForApp = {};
        _.each(toCheck, function(byApp) {
          var apiObjects = _.get(byApp, app, []);
          _.each(apiObjects, function(apiObject) {
            var uid = getUID(apiObject);
            var services = _.get(state, ['servicesByObjectUID', uid], []);
            _.each(services, function(service) {
              // Only need to get the first route, since they're already sorted by score.
              var routes = _.get(state, ['routesByService', service.metadata.name], []);
              _.assign(routesForApp, _.keyBy(routes, 'metadata.name'));
            });
          });
        });
        overview.routesToDisplayByApp[app] = getRoutesToDisplay(routesForApp);
      });
    });
  }, 300, { maxWait: 1500 });

  // Group each resource kind by app and update the list of app label values.
  var updateApps = function() {
    overview.filteredDeploymentConfigsByApp = groupByApp(overview.filteredDeploymentConfigs);
    overview.filteredReplicationControllersByApp = groupByApp(overview.filteredReplicationControllers);
    overview.filteredDeploymentsByApp = groupByApp(overview.filteredDeployments);
    overview.filteredReplicaSetsByApp = groupByApp(overview.filteredReplicaSets);
    overview.filteredStatefulSetsByApp = groupByApp(overview.filteredStatefulSets);
    overview.filteredDaemonSetsByApp = groupByApp(overview.filteredDaemonSets);
    overview.filteredMonopodsByApp = groupByApp(overview.filteredMonopods);
    overview.apps = _.union(_.keys(overview.filteredDeploymentConfigsByApp),
                            _.keys(overview.filteredReplicationControllersByApp),
                            _.keys(overview.filteredDeploymentsByApp),
                            _.keys(overview.filteredReplicaSetsByApp),
                            _.keys(overview.filteredStatefulSetsByApp),
                            _.keys(overview.filteredDaemonSetsByApp),
                            _.keys(overview.filteredMonopodsByApp));

    AppsService.sortAppNames(overview.apps);
    updateRoutesByApp();
  };

  var updatePipelineOtherResources = function() {
    // Find deployment configs not associated with a pipeline.
    var otherDeploymentConfigs = _.filter(overview.deploymentConfigs, function(deploymentConfig) {
      var name = getName(deploymentConfig);
      return _.isEmpty(state.pipelinesByDeploymentConfig[name]);
    });
    overview.deploymentConfigsNoPipeline = _.sortBy(otherDeploymentConfigs, 'metadata.name');
    overview.pipelineViewHasOtherResources =
      !_.isEmpty(overview.deploymentConfigsNoPipeline) ||
      !_.isEmpty(overview.vanillaReplicationControllers) ||
      !_.isEmpty(overview.deployments) ||
      !_.isEmpty(overview.vanillaReplicaSets) ||
      !_.isEmpty(overview.statefulSets) ||
      !_.isEmpty(overview.monopods);
  };

  var updateFilterDisabledState = function() {
    overview.disableFilter = overview.viewBy === 'pipeline' && _.isEmpty(overview.pipelineBuildConfigs);
  };

  var filterByLabel = function(items) {
    return LabelFilter.getLabelSelector().select(items);
  };

  // Updated on viewBy changes to include the app label when appropriate.
  var filterFields = ['metadata.name', 'spec.clusterServiceClassExternalName'];
  var filterByName = function(items) {
    return KeywordService.filterForKeywords(items, filterFields, state.filterKeywords);
  };

  var filterItems = function(items) {
    switch (overview.filterBy) {
    case 'label':
      return filterByLabel(items);
    case 'name':
      return filterByName(items);
    }

    return items;
  };

  var isFilterActive = function() {
    switch (overview.filterBy) {
    case 'label':
      return !LabelFilter.getLabelSelector().isEmpty();
    case 'name':
      return !_.isEmpty(state.filterKeywords);
    }
  };

  var updateFilter = function() {
    overview.filteredDeploymentConfigs = filterItems(overview.deploymentConfigs);
    overview.filteredReplicationControllers = filterItems(overview.vanillaReplicationControllers);
    overview.filteredDeployments = filterItems(overview.deployments);
    overview.filteredReplicaSets = filterItems(overview.vanillaReplicaSets);
    overview.filteredStatefulSets = filterItems(overview.statefulSets);
    overview.filteredDaemonSets = filterItems(overview.daemonSets);
    overview.filteredMonopods = filterItems(overview.monopods);
    overview.filteredPipelineBuildConfigs = filterItems(overview.pipelineBuildConfigs);
    overview.filteredServiceInstances = filterItems(state.orderedServiceInstances);
    overview.filteredMobileClients = filterItems(overview.mobileClients);
    overview.filteredVirtualMachines = filterItems(overview.virtualMachines);
    overview.filterActive = isFilterActive();
    updateApps();
    updateShowGetStarted();
  };

  // Track view-by state in localStorage.
  var viewByKey = $routeParams.project + '/overview/view-by';
  overview.viewBy = localStorage.getItem(viewByKey) || 'app';
  $scope.$watch(function() {
    return overview.viewBy;
  },function(value){
    localStorage.setItem(viewByKey, value);
    updateFilterDisabledState();
    filterFields = overview.viewBy === 'app' ? ['metadata.name', 'metadata.labels.app'] : ['metadata.name'];
    updateFilter();
    if (overview.viewBy === 'pipeline') {
      LabelFilter.setLabelSuggestions(pipelineLabelSuggestions);
    } else {
      LabelFilter.setLabelSuggestions(labelSuggestions);
    }
  });

  if (!Constants.DISABLE_OVERVIEW_METRICS) {
    // Check if a metrics URL has been configured for overview metrics.
    MetricsService.isAvailable(true).then(function(available) {
      state.showMetrics = available;
    });

    // Show a page-level alert when we fail to connect to Hawkular metrics.
    $scope.$on('metrics-connection-failed', function(e, data) {
      var hidden = AlertMessageService.isAlertPermanentlyHidden('metrics-connection-failed');
      if (hidden || state.alerts['metrics-connection-failed']) {
        return;
      }

      state.alerts['metrics-connection-failed'] = {
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

  var isPod = function(apiObject) {
    return apiObject && apiObject.kind === 'Pod';
  };

  var getPods = function(apiObject) {
    var uid = getUID(apiObject);
    if (!uid) {
      return [];
    }

    if (isPod(apiObject)) {
      return [apiObject];
    }

    return _.get(overview, ['state', 'podsByOwnerUID', uid], []);
  };

  var setNotifications = function(apiObject, notifications) {
    var uid = getUID(apiObject);
    state.notificationsByObjectUID[uid] = notifications || {};
  };

  var getNotifications = function(apiObject) {
    var uid = getUID(apiObject);
    if (!uid) {
      return {};
    }
    return _.get(state, ['notificationsByObjectUID', uid], {});
  };

  // Set pod warnings for pods owned by `apiObject`, which can be a set like
  // a replication controller or replica set, or just a pod itself.
  //
  // Updates `state.notificationsByObjectUID`
  //   key: object UID
  //   value: alerts object
  var updatePodWarningsForObject = function(apiObject) {
    var uid = getUID(apiObject);
    if (!uid) {
      return;
    }

    var pods = getPods(apiObject);
    var notifications = ResourceAlertsService.getPodAlerts(pods, $routeParams.project);
    setNotifications(apiObject, notifications);
  };

  // Updates pod warnings for a collection of API objects such as replication
  // controllers or monopods.
  var updatePodWarnings = function(apiObjects) {
    _.each(apiObjects, updatePodWarningsForObject);
  };

  // Get the most recently-created replication controller for a deployment
  // config. This might not be the active deployment if it was a failed or
  // cancelled.
  var getMostRecentReplicationController = function(deploymentConfig) {
    var name = getName(deploymentConfig);
    if (!name) {
      return null;
    }

    return mostRecentByDeploymentConfig[name];
  };

  // Get the replication controllers that are displayed for a deployment
  // config. This will return only the active replication controller unless a
  // deployment is in progress.
  var getVisibleReplicationControllers = function(deploymentConfig) {
    var name = getName(deploymentConfig);
    if (!name) {
      return [];
    }
    return _.get(overview, ['replicationControllersByDeploymentConfig', name]);
  };

  // Get the "previous" replication controller (when a deployment is in
  // progress and more than one is active). This is the donut that appears on
  // the left when we show two. Returns null if there is no deployment in
  // progress or the previous has been scaled down.
  overview.getPreviousReplicationController = function(deploymentConfig) {
    var replicationControllers = getVisibleReplicationControllers(deploymentConfig);
    if (_.size(replicationControllers) < 2) {
      return null;
    }

    // The array is sorted by age, most recent first. Return the second item.
    return replicationControllers[1];
  };

  // Set warnings for a deployment config, including warnings for any active
  // replication controllers and cancelled and failed deployments.
  //
  // Updates `state.notificationsByObjectUID`
  //   key: object UID
  //   value: alerts object
  var updateDeploymentConfigWarnings = function(deploymentConfig) {
    var notifications = {};

    // Add any failed / canceled deployment notifications.
    var mostRecent = getMostRecentReplicationController(deploymentConfig);
    _.assign(
      notifications,
      ResourceAlertsService.getDeploymentStatusAlerts(deploymentConfig, mostRecent),
      ResourceAlertsService.getPausedDeploymentAlerts(deploymentConfig)
    );

    // Roll up notifications like pod warnings for any visible replication controller.
    var visibleReplicationControllers = getVisibleReplicationControllers(deploymentConfig);
    _.each(visibleReplicationControllers, function(replicationController) {
      var rcNotifications = getNotifications(replicationController);
      _.assign(notifications, rcNotifications);
    });

    setNotifications(deploymentConfig, notifications);
  };

  // Update warnings for all deployment configs.
  var updateAllDeploymentConfigWarnings = function() {
    _.each(overview.deploymentConfigs, updateDeploymentConfigWarnings);
  };

  // Get the replica sets that are displayed for a deployment. This will return
  // only the active replica set unless a deployment is in progress.
  var getVisibleReplicaSets = function(deployment) {
    var uid = getUID(deployment);
    if (!uid) {
      return {};
    }
    return _.get(overview, ['replicaSetsByDeploymentUID', uid]);
  };

  // Set warnings for a Kubernetes deployment, including any active replica sets.
  //
  // Updates `state.notificationsByObjectUID`
  //   key: object UID
  //   value: alerts object
  var updateDeploymentWarnings = function(deployment) {
    var notifications = ResourceAlertsService.getPausedDeploymentAlerts(deployment);

    // Roll up notifications like pod warnings for any visible replica set.
    var visibleReplicaSets = getVisibleReplicaSets(deployment);
    _.each(visibleReplicaSets, function(replicaSet) {
      var replicaSetNotifications = getNotifications(replicaSet);
      _.assign(notifications, replicaSetNotifications);
    });

    setNotifications(deployment, notifications);
  };

  // Update warnings for all Kubernetes deployments.
  var updateAllDeploymentWarnings = function() {
    _.each(overview.deployments, updateDeploymentWarnings);
  };

  // Update all pod warnings, indexing the errors by owner UID.
  var updateAllPodWarnings = function() {
    updatePodWarnings(overview.replicationControllers);
    updatePodWarnings(overview.replicaSets);
    updatePodWarnings(overview.statefulSets);
    updatePodWarnings(overview.daemonSets);
    updatePodWarnings(overview.monopods);
  };

  // Update warnings for all kinds. Debounce so we're not reevaluating this too often.
  var updateWarnings = _.debounce(function() {
    $scope.$evalAsync(function() {
      updateAllPodWarnings();
      updateAllDeploymentConfigWarnings();
      updateAllDeploymentWarnings();
    });
  }, 500);

  // Update the label filter suggestions for a list of objects. This should
  // only be called for filterable top-level items to avoid polluting the list.
  var updateLabelSuggestions = function(objects) {
    if (_.isEmpty(objects)) {
      return;
    }

    LabelFilter.addLabelSuggestionsFromResources(objects, labelSuggestions);
    if (overview.viewBy !== 'pipeline') {
      LabelFilter.setLabelSuggestions(labelSuggestions);
    }
  };

  // Update the label suggestions used when viewBy === 'pipeline'.
  var updatePipelineLabelSuggestions = function(pipelineBuildConfigs) {
    if (_.isEmpty(pipelineBuildConfigs)) {
      return;
    }

    LabelFilter.addLabelSuggestionsFromResources(pipelineBuildConfigs, pipelineLabelSuggestions);
    if (overview.viewBy === 'pipeline') {
      LabelFilter.setLabelSuggestions(pipelineLabelSuggestions);
    }
  };

  // Filter out monopods we know we don't want to see.
  var showMonopod = function(pod) {
    // Hide pods in the succeeded and failed phases since these are run once
    // pods that are done.
    if (pod.status.phase === 'Succeeded' ||
        pod.status.phase === 'Failed') {
      // TODO: We may want to show pods for X amount of time after they have completed.
      return false;
    }

    // Hide our deployer pods since it is obvious the deployment is happening
    // when the new deployment appears.
    if (label(pod, "openshift.io/deployer-pod-for.name")) {
      return false;
    }

    // Hide our build pods since we are already showing details for currently
    // running or recently run builds under the appropriate areas.
    if (annotation(pod, "openshift.io/build.name")) {
      return false;
    }

    // Hide Jenkins slave pods.
    if (label(pod, "jenkins") === "slave") {
      return false;
    }

    return true;
  };

  function updateVirtualMachineMapping() {
    if (!overview.virtualMachines || !overview.virtualMachineInstances || !overview.pods) {
      return;
    }

    var vmNameToPods = _(overview.pods)
      .groupBy(VmHelpers.getDomainName)
      .mapValues(function (pods) {
        return _.sortBy(pods, function (pod) {
          return new Date(pod.metadata.creationTimestamp);
        });
      })
      .value();
    var vmIdToVmi = _(overview.virtualMachineInstances)
      .values()
      .keyBy(VmHelpers.getVmReferenceId)
      .value();
    var podsOfVms = [];
    _.each(overview.virtualMachines, function (vm) {
      var vmId = vm.metadata.uid;
      var vmi = vmIdToVmi[vmId];
      if (!vmi) {
        return;
      }
      vm._vmi = vmi;
      var pods = vmNameToPods[vmi.metadata.name];
      if (!pods) {
        return;
      }
      vm._pods = pods;
      podsOfVms = podsOfVms.concat(pods);
    });
    // don't consider virt-launcher pods of offline virtual machines monopods
    if (overview.monopods) {
      overview.monopods = _(overview.monopods)
        .filter(function (pod) {
          return !_.includes(podsOfVms, pod);
        })
        .keyBy('metadata.name')
        .value();
    }
  }

  // Group all pods by owner, tracked in the `state.podsByOwnerUID` map.
  var groupPods = function() {
    state.podsByOwnerUID = PodsService.groupByOwnerUID(overview.pods);
    overview.monopods = _.filter(state.podsByOwnerUID[''], showMonopod);
    updateVirtualMachineMapping();
  };

  // Determine if a replication controller is visible, either as part of a
  // deployment config or a standalone replication controller.
  var isReplicationControllerVisible = function(replicationController) {
    if (_.get(replicationController, 'status.replicas')) {
      return true;
    }

    var dcName = annotation(replicationController, 'deploymentConfig');
    if (!dcName) {
      return true;
    }

    return deploymentIsInProgress(replicationController);
  };

  // Get the deployment config name for a replication controller by reading the
  // "openshift.io/deployment-config.name" annotation.
  var getDeploymentConfigName = function(replicationController) {
    return annotation(replicationController, 'deploymentConfig');
  };

  // Group replication controllers by deployment config and filter the visible
  // replication controllers.
  var groupReplicationControllers = function() {
    if (!overview.deploymentConfigs || !overview.replicationControllers) {
      return;
    }

    // "Vanilla" replication controllers are those not owned by a deployment config.
    var vanillaReplicationControllers = [];
    overview.replicationControllersByDeploymentConfig = {};
    overview.currentByDeploymentConfig = {};
    mostRecentByDeploymentConfig = {};

    // The "active" replication controller by deployment config name. This is the
    // most recent successful deployment.
    var activeByDeploymentConfig = {};

    // Add the replication controllers to a temporary map until we have them all and can sort.
    var rcByDC = {};
    _.each(overview.replicationControllers, function(replicationController) {
      var dcName = getDeploymentConfigName(replicationController) || '';
      if (!dcName || (!overview.deploymentConfigs[dcName] && _.get(replicationController, 'status.replicas'))) {
        vanillaReplicationControllers.push(replicationController);
      }

      // Keep track of  the most recent replication controller even if not
      // visible to show failed/canceled deployment notifications.
      var mostRecent = mostRecentByDeploymentConfig[dcName];
      if (!mostRecent || isNewerResource(replicationController, mostRecent)) {
        mostRecentByDeploymentConfig[dcName] = replicationController;
      }

      // Also find the most recent successful deployment. We always show that,
      // even if scaled down. This is not always "latest" since a more recent
      // deployment might have failed or been cancelled.
      var active;
      if (annotation(replicationController, 'deploymentStatus') === 'Complete') {
        active = activeByDeploymentConfig[dcName];
        if (!active || isNewerResource(replicationController, active)) {
          activeByDeploymentConfig[dcName] = replicationController;
        }
      }

      // Only track the visible replication controllers. This way we only sort
      // and check warnings for things we're showing.
      if (isReplicationControllerVisible(replicationController)) {
        _.set(rcByDC, [dcName, replicationController.metadata.name], replicationController);
      }
    });

    // Make sure the active replication controllers are in `rcByDC` map. This
    // isn't checked by `isReplicationControllerVisible` since that function is
    // called before the loop completes and active is known.
    _.each(activeByDeploymentConfig, function(replicationController, dcName) {
      _.set(rcByDC, [dcName, replicationController.metadata.name], replicationController);
    });

    // Sort the visible replication controllers.
    _.each(rcByDC, function(replicationControllers, dcName) {
      var ordered = DeploymentsService.sortByDeploymentVersion(replicationControllers, true);
      overview.replicationControllersByDeploymentConfig[dcName] = ordered;
      // "Current" is considered the most recent visible replication
      // controller, even if the deployment hasn't completed.
      overview.currentByDeploymentConfig[dcName] = _.head(ordered);
    });
    overview.vanillaReplicationControllers = _.sortBy(vanillaReplicationControllers, 'metadata.name');

    // Since the visible replication controllers for each deployment config
    // have changed, update the deployment config warnings.
    updateAllDeploymentConfigWarnings();
  };

  // Determine if a replica set is visible, either as part of a deployment or
  // as a standalone replica set.
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

    // If the deployment has been deleted and the replica set has no replicas, hide it.
    // Otherwise all old replica sets for a deleted deployment will be visible.
    if (!deployment) {
      return false;
    }

    // Show the replica set if it's the latest revision.
    return DeploymentsService.getRevision(deployment) === revision;
  };

  // Group replica sets by deployment and filter the visible replica sets.
  var groupReplicaSets = function() {
    if (!overview.replicaSets || !deploymentsByUID) {
      return;
    }

    overview.replicaSetsByDeploymentUID = OwnerReferencesService.groupByControllerUID(overview.replicaSets);
    overview.currentByDeploymentUID = {};

    // Sort the visible replica sets.
    _.each(overview.replicaSetsByDeploymentUID, function(replicaSets, deploymentUID) {
      if (!deploymentUID) {
        return;
      }

      var deployment = deploymentsByUID[deploymentUID];
      var visibleReplicaSets = _.filter(replicaSets, function(replicaSet) {
        return isReplicaSetVisible(replicaSet, deployment);
      });
      var ordered = DeploymentsService.sortByRevision(visibleReplicaSets);
      overview.replicaSetsByDeploymentUID[deploymentUID] = ordered;
      overview.currentByDeploymentUID[deploymentUID] = _.head(ordered);
    });
    overview.vanillaReplicaSets = _.sortBy(overview.replicaSetsByDeploymentUID[''], 'metadata.name');

    // Since the visible replica sets for each deployment have changed, update
    // the deployment warnings.
    updateAllDeploymentWarnings();
  };

  // Find the services that direct traffic to each API object.
  //
  // Updates `state.servicesByObjectUID`
  //   key: object UID
  //   value: array of sorted services
  var selectorsByService = {};
  var updateServicesForObjects = function(apiObjects) {
    if (!apiObjects || !state.allServices) {
      return;
    }

    _.each(apiObjects, function(apiObject) {
      var services = [];
      var uid = getUID(apiObject);
      var podTemplate = getPodTemplate(apiObject);
      _.each(selectorsByService, function(selector, serviceName) {
        if (selector.matches(podTemplate)) {
          services.push(state.allServices[serviceName]);
        }
      });
      state.servicesByObjectUID[uid] = _.sortBy(services, 'metadata.name');
    });
  };

  var updateServicesForVms = function () {
    if (!overview.virtualMachines || !state.allServices) {
      return;
    }
    _.each(overview.virtualMachines, function(vm) {
      var vmDomain = _.get(vm, ['metadata', 'labels', 'kubevirt.io/domain']);
      if (!vmDomain) {
        return;
      }

      vm._services = _.filter(state.allServices, { spec: { selector: { "kubevirt.io/domain": vmDomain } } });
    });
  };

  // Update the list of services for all API objects.
  //
  // Updates `state.servicesByObjectUID`
  //   key: object UID
  //   value: array of sorted services
  var groupServices = function() {
    if (!state.allServices) {
      return;
    }

    selectorsByService = _.mapValues(state.allServices, function(service) {
      return new LabelSelector(service.spec.selector);
    });

    var toUpdate = [
      overview.deploymentConfigs,
      overview.vanillaReplicationControllers,
      overview.deployments,
      overview.vanillaReplicaSets,
      overview.statefulSets,
      overview.daemonSets,
      overview.monopods
    ];
    _.each(toUpdate, updateServicesForObjects);

    updateRoutesByApp();
    updateServicesForVms();
  };

  // Group routes by the services they route to (either as a primary service or
  // alternate backend).
  //
  // Updates `state.routesByService`
  //   key: service name
  //   value: array of routes, sorted by RoutesService.sortRoutesByScore
  var groupRoutes = function() {
    var routesByService = RoutesService.groupByService(overview.routes, true);
    state.routesByService = _.mapValues(routesByService, RoutesService.sortRoutesByScore);
    updateRoutesByApp();
  };

  // Group HPAs by the object they scale.
  //
  // Updates `state.hpaByResource`
  //   key: hpaByResource[kind][name]
  //   value: array of HPA objects
  var groupHPAs = function() {
    state.hpaByResource = HPAService.groupHPAs(overview.horizontalPodAutoscalers);
  };

  // Adds a recent pipeline build to the following maps:
  //
  // `overview.recentPipelinesByBuildConfig``
  //   key: build config name
  //   value: array of pipeline builds
  //
  // `state.recentPipelinesByDeploymentConfig`
  //   key: deployment config name
  //   value: array of pipeline builds
  var groupPipeline = function(build) {
    var bcName = getBuildConfigName(build);
    var buildConfig = overview.buildConfigs[bcName];
    if (!buildConfig) {
      return;
    }

    overview.recentPipelinesByBuildConfig[bcName] = overview.recentPipelinesByBuildConfig[bcName] || [];
    overview.recentPipelinesByBuildConfig[bcName].push(build);

    // Index running pipelines by DC name.
    var dcNames = BuildsService.usesDeploymentConfigs(buildConfig);
    _.each(dcNames, function(dcName) {
      state.recentPipelinesByDeploymentConfig[dcName] = state.recentPipelinesByDeploymentConfig[dcName] || [];
      state.recentPipelinesByDeploymentConfig[dcName].push(build);
    });
    updatePipelineOtherResources();
  };

  // Group build configs by their output image. This lets us match them to
  // deployment config image change triggers.
  var buildConfigsByOutputImage = {};
  var groupBuildConfigsByOutputImage = function() {
    buildConfigsByOutputImage = BuildsService.groupBuildConfigsByOutputImage(overview.buildConfigs);
  };

  var getBuildConfigsForObject = function(apiObject) {
    var uid = getUID(apiObject);
    if (!uid) {
      return;
    }

    return _.get(state, ['buildConfigsByObjectUID', uid], []);
  };

  // Find all recent builds for `deploymentConfig` from each of `buildConfigs`.
  //
  // Updates `state.recentBuildsByDeploymentConfig`
  //   key: deployment config name
  //   value: array of builds, sorted in descending order by creation date
  var updateRecentBuildsForDeploymentConfig = function(deploymentConfig) {
    var builds = [];
    var buildConfigs = getBuildConfigsForObject(deploymentConfig);
    _.each(buildConfigs, function(buildConfig) {
      var recentForConfig = _.get(state, ['recentBuildsByBuildConfig', buildConfig.metadata.name], []);
      builds = builds.concat(recentForConfig);
    });

    // These builds are only used to show a count, so don't need to be sorted.
    var dcName = getName(deploymentConfig);
    _.set(state, ['recentBuildsByDeploymentConfig', dcName], builds);
  };

  var setBuildConfigsForObject = function(buildConfigs, apiObject) {
    var uid = getUID(apiObject);
    if (!uid) {
      return;
    }

    _.set(state, ['buildConfigsByObjectUID', uid], buildConfigs);
  };

  // Find build configs that use the pipeline strategy and have a
  // "pipeline.alpha.openshift.io/uses" annotation pointing to a deployment
  // config.
  //
  // Updates `state.pipelinesByDeploymentConfig`
  //   key: deployment config name
  //   value: array of pipeline build configs
  var groupPipelineBuildConfigsByDeploymentConfig = function() {
    var pipelineBuildConfigs = [];
    overview.deploymentConfigsByPipeline = {};
    state.pipelinesByDeploymentConfig = {};
    _.each(overview.buildConfigs, function(buildConfig) {
      if (!isJenkinsPipelineStrategy(buildConfig)) {
        return;
      }

      pipelineBuildConfigs.push(buildConfig);

      // TODO: Handle other types.
      // Preserve the order they appear in the annotation.
      var dcNames = BuildsService.usesDeploymentConfigs(buildConfig);
      var bcName = getName(buildConfig);
      _.set(overview, ['deploymentConfigsByPipeline', bcName], dcNames);
      _.each(dcNames, function(dcName) {
        state.pipelinesByDeploymentConfig[dcName] = state.pipelinesByDeploymentConfig[dcName] || [];
        state.pipelinesByDeploymentConfig[dcName].push(buildConfig);
      });
    });

    overview.pipelineBuildConfigs = _.sortBy(pipelineBuildConfigs, 'metadata.name');
    updatePipelineOtherResources();
    updatePipelineLabelSuggestions(overview.pipelineBuildConfigs);
    updateFilterDisabledState();
  };

  // Find build configs with an output image that matches the deployment config
  // image change trigger.
  //
  // Updates `state.buildConfigsByObjectUID`
  //   key: deployment config UID
  //   value: array of build configs, sorted by name
  var matchOutputImagesToImageChangeTriggers = function() {
    state.buildConfigsByObjectUID = {};
    _.each(overview.deploymentConfigs, function(deploymentConfig) {
      var buildConfigs = [];
      var triggers = _.get(deploymentConfig, 'spec.triggers');
      _.each(triggers, function(trigger) {
        var from = _.get(trigger, 'imageChangeParams.from');
        if (!from) {
          return;
        }

        var ref = imageObjectRef(from, deploymentConfig.metadata.namespace);
        var buildConfigsForRef = buildConfigsByOutputImage[ref];
        if (!_.isEmpty(buildConfigsForRef)) {
          buildConfigs = buildConfigs.concat(buildConfigsForRef);
        }
      });

      buildConfigs = _.sortBy(buildConfigs, 'metadata.name');
      setBuildConfigsForObject(buildConfigs, deploymentConfig);
      updateRecentBuildsForDeploymentConfig(deploymentConfig);
    });
  };

  // Find the build configs that relate to each deployment config. Pipeline
  // build configs are grouped using an annotation. Other build configs are
  // grouping using output images matched against a deployment config image
  // change trigger.
  var groupBuildConfigsByDeploymentConfig = function() {
    groupPipelineBuildConfigsByDeploymentConfig();
    matchOutputImagesToImageChangeTriggers();
  };

  var groupRecentBuildsByDeploymentConfig = function() {
    _.each(overview.deploymentConfigs, updateRecentBuildsForDeploymentConfig);
  };

  var groupBuilds = function() {
    if(!state.builds || !overview.buildConfigs) {
      return;
    }

    // Reset these maps.
    overview.recentPipelinesByBuildConfig = {};
    state.recentBuildsByBuildConfig = {};
    state.recentPipelinesByDeploymentConfig = {};

    var recentByConfig = {};
    _.each(BuildsService.interestingBuilds(state.builds), function(build) {
      var bcName = getBuildConfigName(build);
      if(isJenkinsPipelineStrategy(build)) {
        groupPipeline(build);
      } else {
        recentByConfig[bcName] = recentByConfig[bcName] || [];
        recentByConfig[bcName].push(build);
      }
    });

    overview.recentPipelinesByBuildConfig = _.mapValues(overview.recentPipelinesByBuildConfig, function(builds) {
      return BuildsService.sortBuilds(builds, true);
    });
    state.recentPipelinesByDeploymentConfig = _.mapValues(state.recentPipelinesByDeploymentConfig, function(builds) {
      return BuildsService.sortBuilds(builds, true);
    });
    state.recentBuildsByBuildConfig = _.mapValues(recentByConfig, function(builds) {
      return BuildsService.sortBuilds(builds, true);
    });

    groupRecentBuildsByDeploymentConfig();
  };

  var setQuotaNotifications = function() {
    ResourceAlertsService.setQuotaNotifications(state.quotas,
                                                state.clusterQuotas,
                                                $routeParams.project);
  };

  overview.clearFilter = function() {
    LabelFilter.clear();
    overview.filterText = '';
  };

  $scope.$watch(function() {
    return overview.filterText;
  }, _.debounce(function(text, previous) {
    if (text === previous) {
      return;
    }
    state.filterKeywords = KeywordService.generateKeywords(text);
    $scope.$evalAsync(updateFilter);
  }, 50, { maxWait: 250 }));

  $scope.$watch(function() {
    return overview.filterBy;
  }, function(newValue, oldValue) {
    // Avoid clearing label filter values set from the URL on controller initialization.
    if (newValue === oldValue) {
      return;
    }

    // Clear any existing filter when switching filter types.
    overview.clearFilter();
    updateFilter();
  });

  $scope.browseCatalog = function() {
    Navigate.toProjectCatalog($scope.projectName);
  };

  LabelFilter.onActiveFiltersChanged(function() {
    $scope.$evalAsync(updateFilter);
  });

  overview.startBuild = BuildsService.startBuild;

  var groupBindings = function() {
    // Build two maps:
    // - Bindings by the UID of the target object
    // - API objects by binding name
    state.bindingsByApplicationUID = {};
    state.applicationsByBinding = {};
    state.deleteableBindingsByApplicationUID = {};

    // If there are no bindings, nothing to do.
    if (_.isEmpty(state.bindings)) {
      return;
    }

    // All objects that can be a target for bindings.
    var objectsByKind = [
      overview.deployments,
      overview.deploymentConfigs,
      overview.vanillaReplicationControllers,
      overview.vanillaReplicaSets,
      overview.statefulSets,
      overview.daemonSets
    ];

    // Make sure all the binding targets have loaded first.
    if (_.some(objectsByKind, function(collection) { return !collection; })) {
      return;
    }

    // Build a map of pod preset selectors by binding name.
    var podPresetSelectors = BindingService.getPodPresetSelectorsForBindings(state.bindings);

    _.each(objectsByKind, function(collection) {
      _.each(collection, function(apiObject) {
        // Key by UID since name is not unique across different kinds.
        var applicationUID = getUID(apiObject);

        // Create a selector for the potential binding target to check if the
        // pod preset covers the selector.
        var applicationSelector = new LabelSelector(_.get(apiObject, 'spec.selector'));
        state.bindingsByApplicationUID[applicationUID] = [];
        state.deleteableBindingsByApplicationUID[applicationUID] = [];

        // Look at each pod preset selector to see if it covers this API object selector.
        _.each(podPresetSelectors, function(podPresetSelector, bindingName) {
          if (podPresetSelector.covers(applicationSelector)) {
            // Keep a map of the target UID to the binding and the binding to
            // the target. We want to show bindings both in the "application"
            // object rows and the service instance rows.
            state.bindingsByApplicationUID[applicationUID].push(state.bindings[bindingName]);
            if (!_.get(state.bindings[bindingName], 'metadata.deletionTimestamp')) {
              state.deleteableBindingsByApplicationUID[applicationUID].push(state.bindings[bindingName]);
            }
            state.applicationsByBinding[bindingName] = state.applicationsByBinding[bindingName] || [];
            state.applicationsByBinding[bindingName].push(apiObject);
          }
        });
      });
    });

    overview.bindingsByInstanceRef = _.reduce(overview.bindingsByInstanceRef, function(result, bindingList, key) {
      result[key] = _.sortBy(bindingList, function(binding) {
        var apps =  _.get(state.applicationsByBinding, [binding.metadata.name]);
        var firstName = _.get(_.head(apps), ['metadata', 'name']);
        return firstName || binding.metadata.name;
      });
      return result;
    }, {});
  };

  var sortServiceInstances = function() {
    state.bindableServiceInstances =
      BindingService.filterBindableServiceInstances(state.serviceInstances,
                                                    state.serviceClasses,
                                                    state.servicePlans);
    state.orderedServiceInstances =
      BindingService.sortServiceInstances(state.serviceInstances, state.serviceClasses);
  };

  var watches = [];
  var opts = isHomePage ? {skipErrorNotFound: true} : {};
  ProjectsService.get($routeParams.project, opts).then(_.spread(function(project, context) {
    // Project must be set on `$scope` for the projects dropdown.
    state.project = $scope.project = project;
    state.context = $scope.context = context;

    var updateReferencedImageStreams = function() {
      if (!overview.pods) {
        return;
      }

      ImageStreamResolver.fetchReferencedImageStreamImages(overview.pods,
                                                           state.imagesByDockerReference,
                                                           state.imageStreamImageRefByDockerReference,
                                                           context);
    };

    var daemonSetsResolved = function(daemonSetData) {
      overview.daemonSets = daemonSetData.by('metadata.name');
      updateServicesForObjects(overview.daemonSetData);
      updateServicesForObjects(overview.monopods);
      updatePodWarnings(overview.daemonSets);
      updateLabelSuggestions(overview.daemonSets);
      groupBindings();
      updateFilter();
      Logger.log("daemonsets", overview.daemonSets);
    };

    // Flag that tracks whether we're watching daemon sets. Most projects won't
    // have a daemon set, so try to save a watch unless we know there are some.
    var isWatchingDaemonSets = false;

    var watchDaemonSets = function() {
      if (isWatchingDaemonSets) {
        return;
      }

      watches.push(DataService.watch(daemonSetsVersion, context, daemonSetsResolved, {
        poll: limitWatches,
        pollInterval: DEFAULT_POLL_INTERVAL
      }));
      isWatchingDaemonSets = true;
    };

    var hasDaemonSetControllerRef = function(pod) {
      var ownerReferences = OwnerReferencesService.getOwnerReferences(pod);
      return _.some(ownerReferences, {
        controller: true,
        kind: 'DaemonSet'
      });
    };

    var checkPodsForDaemonSets = function() {
      if (isWatchingDaemonSets) {
        return;
      }

      if (_.some(overview.pods, hasDaemonSetControllerRef)) {
        watchDaemonSets();
      }
    };

    watches.push(DataService.watch(podsVersion, context, function(podsData, action) {
      overview.pods = podsData.by("metadata.name");
      groupPods();
      updateReferencedImageStreams();
      updateWarnings();
      updateServicesForObjects(overview.monopods);
      updatePodWarnings(overview.monopods);
      updateLabelSuggestions(overview.monopods);
      updateFilter();

      // If there are new pods, check if they are for a daemon set. When a pod
      // is added for a daemon set, start watching daemon sets if not already.
      if (!action || action === 'ADDED') {
        checkPodsForDaemonSets();
      }

      Logger.log("pods (subscribe)", overview.pods);
    }));

    watches.push(DataService.watch(replicationControllersVersion, context, function(rcData) {
      overview.replicationControllers = rcData.by("metadata.name");
      groupReplicationControllers();
      updateServicesForObjects(overview.vanillaReplicationControllers);
      updateServicesForObjects(overview.monopods);
      updatePodWarnings(overview.vanillaReplicationControllers);
      updateLabelSuggestions(overview.vanillaReplicationControllers);
      groupBindings();
      updateFilter();
      Logger.log("replicationcontrollers (subscribe)", overview.replicationControllers);
    }));

    watches.push(DataService.watch(deploymentConfigsVersion, context, function(dcData) {
      overview.deploymentConfigs = dcData.by("metadata.name");
      groupReplicationControllers();
      updateServicesForObjects(overview.deploymentConfigs);
      // `overview.vanillaReplicationControllers` is not populated until
      // deployment configs load. Make sure the services for these are updated
      // if deployment configs load after replication controllers.
      updateServicesForObjects(overview.vanillaReplicationControllers);
      updateLabelSuggestions(overview.deploymentConfigs);
      updateAllDeploymentWarnings();
      groupBuildConfigsByDeploymentConfig();
      groupRecentBuildsByDeploymentConfig();
      groupBindings();
      updateFilter();
      Logger.log("deploymentconfigs (subscribe)", overview.deploymentConfigs);
    }));

    watches.push(DataService.watch(replicaSetsVersion, context, function(replicaSetData) {
      overview.replicaSets = replicaSetData.by('metadata.name');
      groupReplicaSets();
      updateServicesForObjects(overview.vanillaReplicaSets);
      updateServicesForObjects(overview.monopods);
      updatePodWarnings(overview.vanillaReplicaSets);
      updateLabelSuggestions(overview.vanillaReplicaSets);
      groupBindings();
      updateFilter();
      Logger.log("replicasets (subscribe)", overview.replicaSets);
    }));

    watches.push(DataService.watch(deploymentsVersion, context, function(deploymentData) {
      deploymentsByUID = deploymentData.by('metadata.uid');
      overview.deployments = _.sortBy(deploymentsByUID, 'metadata.name');
      groupReplicaSets();
      updateServicesForObjects(overview.deployments);
      updateServicesForObjects(overview.vanillaReplicaSets);
      updateLabelSuggestions(overview.deployments);
      groupBindings();
      updateFilter();
      Logger.log("deployments (subscribe)", overview.deploymentsByUID);
    }));

    watches.push(DataService.watch(buildsVersion, context, function(buildData) {
      state.builds = buildData.by("metadata.name");
      groupBuilds();
      Logger.log("builds (subscribe)", state.builds);
    }));

    watches.push(DataService.watch(statefulSetsVersion, context, function(statefulSetData) {
      overview.statefulSets = statefulSetData.by('metadata.name');
      updateServicesForObjects(overview.statefulSets);
      updateServicesForObjects(overview.monopods);
      updatePodWarnings(overview.statefulSets);
      updateLabelSuggestions(overview.statefulSets);
      groupBindings();
      updateFilter();
      Logger.log("statefulsets (subscribe)", overview.statefulSets);
    }, {poll: limitWatches, pollInterval: DEFAULT_POLL_INTERVAL}));

    DataService.list(daemonSetsVersion, context, function(daemonSetData) {
      daemonSetsResolved(daemonSetData);
      // Only watch daemon sets if the initial list was not empty. This saves a
      // watch for projects that don't have daemon sets, which are relatively
      // uncommon. We can also start watching daemon sets if there's a pod with
      // the owner ref to a daemon set.
      if (!_.isEmpty(overview.daemonSets)) {
        watchDaemonSets();
      }
    });

    watches.push(DataService.watch(servicesVersion, context, function(serviceData) {
      state.allServices = serviceData.by("metadata.name");
      groupServices();
      Logger.log("services (subscribe)", state.allServices);
    }, {poll: limitWatches, pollInterval: DEFAULT_POLL_INTERVAL}));

    watches.push(DataService.watch(routesVersion, context, function(routesData) {
      overview.routes = routesData.by("metadata.name");
      groupRoutes();
      Logger.log("routes (subscribe)", overview.routes);
    }, {poll: limitWatches, pollInterval: DEFAULT_POLL_INTERVAL}));

    watches.push(DataService.watch(buildConfigsVersion, context, function(buildConfigData) {
      overview.buildConfigs = buildConfigData.by("metadata.name");
      groupBuildConfigsByOutputImage();
      groupBuildConfigsByDeploymentConfig();
      groupBuilds();
      updateFilter();
      Logger.log("buildconfigs (subscribe)", overview.buildConfigs);
    }, {poll: limitWatches, pollInterval: DEFAULT_POLL_INTERVAL}));

    watches.push(DataService.watch(horizontalPodAutoscalersVersion, context, function(hpaData) {
      overview.horizontalPodAutoscalers = hpaData.by("metadata.name");
      groupHPAs();
      Logger.log("autoscalers (subscribe)", overview.horizontalPodAutoscalers);
    }, {poll: limitWatches, pollInterval: DEFAULT_POLL_INTERVAL}));

    watches.push(DataService.watch(imageStreamsVersion, context, function(imageStreamData) {
      imageStreams = imageStreamData.by("metadata.name");
      ImageStreamResolver.buildDockerRefMapForImageStreams(imageStreams,
                                                           state.imageStreamImageRefByDockerReference);
      updateReferencedImageStreams();
      Logger.log("imagestreams (subscribe)", imageStreams);
    }, {poll: limitWatches, pollInterval: DEFAULT_POLL_INTERVAL}));

    // Always poll quotas instead of watching, its not worth the overhead of maintaining websocket connections
    watches.push(DataService.watch(resourceQuotasVersion, context, function(quotaData) {
      state.quotas = quotaData.by("metadata.name");
      setQuotaNotifications();
    }, {poll: true, pollInterval: DEFAULT_POLL_INTERVAL}));

    watches.push(DataService.watch(clusterResourceQuotasVersion, context, function(clusterQuotaData) {
      state.clusterQuotas = clusterQuotaData.by("metadata.name");
      setQuotaNotifications();
    }, {poll: true, pollInterval: DEFAULT_POLL_INTERVAL}));

    if ($scope.AEROGEAR_MOBILE_ENABLED) {
      watches.push(DataService.watch({ group: "mobile.k8s.io", version: "v1alpha1", resource: "mobileclients" }, context, function (clients) {
        overview.mobileClients = clients.by("metadata.name");
        updateFilter();
        Logger.log("mobileclients (subscribe)", clients);
      }, { poll: limitWatches, pollInterval: DEFAULT_POLL_INTERVAL }));
    }

    if ($scope.KUBEVIRT_ENABLED) {
      var vmCallback = function (vms) {
        overview.virtualMachines = vms.by('metadata.name');
        updateVirtualMachineMapping();
        updateServicesForVms(); // https://github.com/kubevirt/user-guide/blob/master/service.md
        updateFilter();
      };
      watches.push(DataService.watch(
        KubevirtVersions.virtualMachine,
        context,
        vmCallback,
        { poll: limitWatches, pollInterval: DEFAULT_POLL_INTERVAL }));
      var vmiCallback = function (vmis) {
        overview.virtualMachineInstances = vmis.by('metadata.name');
        updateVirtualMachineMapping();
        updateFilter();
      };
      watches.push(DataService.watch(
        KubevirtVersions.virtualMachineInstance,
        context,
        vmiCallback,
        { poll: limitWatches, pollInterval: DEFAULT_POLL_INTERVAL }));
    }

    var fetchServiceClass, fetchServicePlan;

    // Avoid requesting the same service class or service plan twice.
    var serviceClassPromises = {};
    var servicePlanPromises = {};

    // The canI check on watch should be temporary until we have a different solution for handling secret parameters
    if (CatalogService.SERVICE_CATALOG_ENABLED && canI(serviceInstancesVersion, 'watch')) {

      // Get the service class for this instance. Returns a promise.
      fetchServiceClass = function(instance) {
        var serviceClassName = ServiceInstancesService.getServiceClassNameForInstance(instance);
        if (!serviceClassName) {
          return $q.when();
        }

        var serviceClass = _.get(state, ['serviceClasses', serviceClassName]);
        if (serviceClass) {
          return $q.when(serviceClass);
        }

        // Check if we already have the service class or if a request is already in flight.
        if (!serviceClassPromises[serviceClassName]) {
          serviceClassPromises[serviceClassName] = DataService.get(serviceClassesVersion, serviceClassName, {}).then(function(serviceClass) {
            state.serviceClasses[serviceClassName] = serviceClass;
            return serviceClass;
          }).finally(function() {
            delete servicePlanPromises[serviceClassName];
          });
        }

        return serviceClassPromises[serviceClassName];
      };

      // Get the service plan for this instance. Returns a promise.
      fetchServicePlan = function(instance) {
        var servicePlanName = ServiceInstancesService.getServicePlanNameForInstance(instance);
        if (!servicePlanName) {
          return $q.when();
        }

        // Check if we already have the service plan or if a request is already in flight.
        var servicePlan = _.get(state, ['servicePlans', servicePlanName]);
        if (servicePlan) {
          return $q.when(servicePlan);
        }

        if (!servicePlanPromises[servicePlanName]) {
          servicePlanPromises[servicePlanName] = DataService.get(servicePlansVersion, servicePlanName, {}).then(function(servicePlan) {
            state.servicePlans[servicePlanName] = servicePlan;
            return servicePlan;
          }).finally(function() {
            delete servicePlanPromises[servicePlanName];
          });
        }

        return servicePlanPromises[servicePlanName];
      };

      watches.push(DataService.watch(serviceInstancesVersion, context, function(serviceInstances) {
        state.serviceInstances = serviceInstances.by('metadata.name');

        var promises = [];
        _.each(state.serviceInstances, function(instance) {
          var notifications = ResourceAlertsService.getServiceInstanceAlerts(instance);
          setNotifications(instance, notifications);

          promises.push(fetchServiceClass(instance));
          promises.push(fetchServicePlan(instance));
        });

        // Wait for all promises to complete before trying to sort the
        // instances and check bindability.
        PromiseUtils.waitForAll(promises).finally(function() {
          sortServiceInstances();
          updateFilter();
        });
        updateLabelSuggestions(state.serviceInstances);
      }, {poll: limitWatches, pollInterval: DEFAULT_POLL_INTERVAL}));
    }

    if (CatalogService.SERVICE_CATALOG_ENABLED && canI(serviceBindingsVersion, 'watch')) {
      watches.push(DataService.watch(serviceBindingsVersion, context, function(bindings) {
        state.bindings = bindings.by('metadata.name');
        overview.bindingsByInstanceRef = _.groupBy(state.bindings, 'spec.instanceRef.name');
        groupBindings();
      }, {poll: limitWatches, pollInterval: DEFAULT_POLL_INTERVAL}));
    }

    // List limit ranges in this project to determine if there is a default
    // CPU request for autoscaling.
    DataService.list(limitRangesVersion, context, function(response) {
      state.limitRanges = response.by("metadata.name");
    });

    var samplePipelineTemplate = Constants.SAMPLE_PIPELINE_TEMPLATE;
    if (samplePipelineTemplate) {
      DataService.get(templatesVersion, samplePipelineTemplate.name, {
        namespace: samplePipelineTemplate.namespace
      }, {
        errorNotification: false
      }).then(function(template) {
        overview.samplePipelineURL = Navigate.createFromTemplateURL(template, $scope.projectName);
      });
    }

    $scope.$on('$destroy', function() {
      DataService.unwatchAll(watches);
      $(window).off('.overview');
    });
  }),function(e) {
    if (isHomePage && _.get(e, 'notFound')) {
      HomePagePreferenceService.notifyInvalidProjectHomePage($scope.projectName);
      Navigate.toProjectList();
    }
  });
}
