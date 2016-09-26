'use strict';
/* jshint unused: false */

/**
 * @ngdoc function
 * @name openshiftConsole.controller:MonitoringController
 * @description
 * # MonitoringController
 * Controller of the openshiftConsole
 */
angular.module('openshiftConsole')
  .controller('MonitoringController', function ($routeParams,
                                           $location,
                                           $scope,
                                           $filter,
                                           DataService,
                                           ProjectsService,
                                           MetricsService,
                                           BuildsService,
                                           PodsService,
                                           KeywordService,
                                           Logger,
                                           ImageStreamResolver,
                                           $rootScope) {
    $scope.projectName = $routeParams.project;
    $scope.alerts = $scope.alerts || {};
    $scope.renderOptions = $scope.renderOptions || {};
    $scope.renderOptions.showEventsSidebar = true;
    $scope.renderOptions.collapseEventsSidebar = localStorage.getItem('monitoring.eventsidebar.collapsed') === 'true';


    var watches = [];

    $scope.kinds = [
      {
        kind: "Pods"
      },
      {
        kind: "Builds"
      },
      {
        label: "Deployments",
        kind: "ReplicationControllers"
      },
      {
        kind: "All"
      }
    ];
    var initialKind = "All";
    if ($routeParams.kind && _.some($scope.kinds, {kind: $routeParams.kind})) {
      initialKind = $routeParams.kind;
    }
    $scope.kindSelector = {
      selected: {
        kind: initialKind
      }
    };

    $scope.logOptions = {
      pods: {},
      deployments: {},
      builds: {}
    };

    $scope.logCanRun = {
      pods: {},
      deployments: {},
      builds: {}
    };

    $scope.logEmpty = {
      pods: {},
      deployments: {},
      builds: {}
    };

    $scope.expanded = {
      pods: {},
      deployments: {},
      builds: {}
    };

    var isNil = $filter('isNil');

    $scope.filters = {
      hideOlderResources: isNil($routeParams.hideOlderResources) || $routeParams.hideOlderResources === 'true',
      text: ''
    };

    var ageFilteredBuilds, ageFilteredDeployments, ageFilteredPods;

    // Check if the metrics service is available so we know when to show the tab.
    MetricsService.isAvailable().then(function(available) {
      $scope.metricsAvailable = available;
    });

    var orderByDate = $filter('orderObjectsByDate');

    // Only filter by keyword on certain fields.
    var filterFields = [
      'metadata.name'
    ];

    var filterKeywords = [];

    var filterAllResourcesForKeyword = function() {
      $scope.filteredPods = KeywordService.filterForKeywords(ageFilteredPods, filterFields, filterKeywords);
      $scope.filteredDeployments = KeywordService.filterForKeywords(ageFilteredDeployments, filterFields, filterKeywords);
      $scope.filteredBuilds = KeywordService.filterForKeywords(ageFilteredBuilds, filterFields, filterKeywords);
    };

    var setPodLogVars = function(pod) {
      $scope.logOptions.pods[pod.metadata.name] = {
        container: pod.spec.containers[0].name
      };
      $scope.logCanRun.pods[pod.metadata.name] = !(_.includes(['New', 'Pending', 'Unknown'], pod.status.phase));
    };

    var setDeploymentLogVars = function(deployment) {
      $scope.logOptions.deployments[deployment.metadata.name] = {};
      var deploymentVersion = $filter("annotation")(deployment, "deploymentVersion");
      if (deploymentVersion) {
        $scope.logOptions.deployments[deployment.metadata.name].version = deploymentVersion;
      }
      $scope.logCanRun.deployments[deployment.metadata.name] = !(_.includes(['New', 'Pending'], $filter('deploymentStatus')(deployment)));
    };

    var setBuildLogVars = function(build) {
      $scope.logOptions.builds[build.metadata.name] = {};
      $scope.logCanRun.builds[build.metadata.name] = !(_.includes(['New', 'Pending', 'Error'], build.status.phase));
    };

    var filterPods = function() {
      ageFilteredPods = _.filter($scope.pods, function(pod) {
        if (!$scope.filters.hideOlderResources) {
          return true;
        }
        return pod.status.phase !== 'Succeeded' && pod.status.phase !== 'Failed';
      });
      $scope.filteredPods = KeywordService.filterForKeywords(ageFilteredPods, filterFields, filterKeywords);
    };

    var isIncompleteBuild = $filter('isIncompleteBuild');
    var buildConfigForBuild = $filter('buildConfigForBuild');
    var isRecentBuild = $filter('isRecentBuild');
    var filterBuilds = function() {
      var fiveMinutesAgo = moment().subtract(5, 'm');
      ageFilteredBuilds = _.filter($scope.builds, function(build) {
        if (!$scope.filters.hideOlderResources) {
          return true;
        }
        if (isIncompleteBuild(build)) {
          return true;
        }
        var buildConfigName = buildConfigForBuild(build);
        if (buildConfigName) {
          return $scope.latestBuildByConfig[buildConfigName].metadata.name === build.metadata.name;
        }

        // Otherwise this is a one-off build, fallback to the isRecentBuild logic
        return isRecentBuild(build);
      });
      $scope.filteredBuilds = KeywordService.filterForKeywords(ageFilteredBuilds, filterFields, filterKeywords);
    };

    var deploymentStatus = $filter('deploymentStatus');
    var deploymentIsInProgress = $filter('deploymentIsInProgress');
    var filterDeployments = function() {
      ageFilteredDeployments = _.filter($scope.deployments, function(deployment) {
        if (!$scope.filters.hideOlderResources) {
          return true;
        }
        return deploymentIsInProgress(deployment) || deploymentStatus(deployment) === 'Active';
      });
      $scope.filteredDeployments = KeywordService.filterForKeywords(ageFilteredDeployments, filterFields, filterKeywords);
    };

    $scope.toggleItem = function(evt, element, resource) {
      var t = $(evt.target);
      if (t && t.closest("a", element).length) {
        return;
      }

      var expanded, event;
      switch(resource.kind) {
        case 'Build':
          expanded = !$scope.expanded.builds[resource.metadata.name];
          $scope.expanded.builds[resource.metadata.name] = expanded;
          event = expanded ? 'event.resource.highlight' : 'event.resource.clear-highlight';
          $rootScope.$emit(event, resource);

          var buildPod = _.get($scope.podsByName, $filter('annotation')(resource, 'buildPod'));
          if (buildPod) {
            $rootScope.$emit(event, buildPod);
          }
          break;
        case 'ReplicationController':
          expanded = !$scope.expanded.deployments[resource.metadata.name];
          $scope.expanded.deployments[resource.metadata.name] = expanded;
          event = expanded ? 'event.resource.highlight' : 'event.resource.clear-highlight';
          $rootScope.$emit(event, resource);

          var deployerPodName = $filter('annotation')(resource, 'deployerPod');
          if (deployerPodName) {
            // The deployer pod is deleted immediately so mock the resource to send to the event highlighter
            $rootScope.$emit(event, {
              kind: "Pod",
              metadata: {
                name: deployerPodName
              }
            });
          }
          _.each($scope.podsByDeployment[resource.metadata.name], function(pod) {
            $rootScope.$emit(event, pod);
          });
          break;
        case 'Pod':
          expanded = !$scope.expanded.pods[resource.metadata.name];
          $scope.expanded.pods[resource.metadata.name] = expanded;
          event = expanded ? 'event.resource.highlight' : 'event.resource.clear-highlight';
          $rootScope.$emit(event, resource);
          break;
      }
    };

    var groupPods = function() {
      if (!$scope.pods || !$scope.deployments) {
        return;
      }

      $scope.podsByDeployment = PodsService.groupByReplicationController($scope.pods, $scope.deployments);
    };

    ProjectsService
      .get($routeParams.project)
      .then(_.spread(function(project, context) {
        $scope.project = project;
        $scope.projectContext = context;

        DataService.watch("pods", context, function(pods) {
          $scope.podsByName = pods.by("metadata.name");
          $scope.pods = orderByDate($scope.podsByName, true);
          groupPods();
          $scope.podsLoaded = true;
          _.each($scope.pods, setPodLogVars);
          filterPods();
          Logger.log("pods", $scope.pods);
        });

        DataService.watch("replicationcontrollers", context, function(deployments) {
          $scope.deployments = orderByDate(deployments.by("metadata.name"), true);
          groupPods();
          $scope.deploymentsLoaded = true;
          _.each($scope.deployments, setDeploymentLogVars);
          filterDeployments();
          Logger.log("deployments", $scope.deployments);
        });

        DataService.watch("builds", context, function(builds) {
          $scope.builds = orderByDate(builds.by("metadata.name"), true);
          $scope.latestBuildByConfig = BuildsService.latestBuildByConfig($scope.builds);
          $scope.buildsLoaded = true;
          _.each($scope.builds, setBuildLogVars);
          filterBuilds();
          Logger.log("builds", $scope.builds);
        });

        $scope.$on('$destroy', function(){
          DataService.unwatchAll(watches);
        });

        $scope.$watch('filters.hideOlderResources', function() {
          filterPods();
          filterBuilds();
          filterDeployments();
          var search = $location.search();
          search.hideOlderResources = $scope.filters.hideOlderResources ? 'true' : 'false';
          $location.replace().search(search);
        });

        $scope.$watch('kindSelector.selected.kind', function() {
          var search = $location.search();
          search.kind = $scope.kindSelector.selected.kind;
          $location.replace().search(search);
        });

        $scope.$watch('filters.text', _.debounce(function() {
              filterKeywords = KeywordService.generateKeywords($scope.filters.text);
              $scope.$apply(filterAllResourcesForKeyword);
            }, 50, { maxWait: 250 }));

        $scope.$watch('renderOptions.collapseEventsSidebar', function(newValue, oldValue) {
          if (newValue === oldValue) {
            return;
          }
          localStorage.setItem('monitoring.eventsidebar.collapsed', $scope.renderOptions.collapseEventsSidebar ? 'true' : 'false');
          $rootScope.$emit('metrics.charts.resize');
        });

      }));
  });
