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
                                           $scope,
                                           $filter,
                                           DataService,
                                           ProjectsService,
                                           MetricsService,
                                           BuildsService,
                                           PodsService,
                                           Logger,
                                           ImageStreamResolver,
                                           $rootScope) {
    $scope.projectName = $routeParams.project;
    $scope.alerts = $scope.alerts || {};
    $scope.renderOptions = $scope.renderOptions || {};
    $scope.renderOptions.showEventsSidebar = true;

    var watches = [];

    $scope.kindSelector = {
      selected: {
        kind: "All"
      }
    };
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

    $scope.filters = {
      showOlderResources: false,
      text: ''
    };

    var ageFilteredBuilds, ageFilteredDeployments, ageFilteredPods;

    // Check if the metrics service is available so we know when to show the tab.
    MetricsService.isAvailable().then(function(available) {
      $scope.metricsAvailable = available;
    });

    var orderByDate = $filter('orderObjectsByDate');

    var filterExpressions = [];
    var updateKeywords = function() {
      if (!$scope.filters.text) {
        filterExpressions = [];
        return;
      }

      var keywords = _.uniq($scope.filters.text.split(/\s+/));
      // Sort the longest keyword first.
      keywords.sort(function(a, b){
        return b.length - a.length;
      });

      // Convert the keyword to a case-insensitive regular expression for the filter.
      filterExpressions = _.map(keywords, function(keyword) {
        return new RegExp(_.escapeRegExp(keyword), "i");
      });
    };

    // Only filter by keyword on certain fields.
    var filterFields = [
      'metadata.name'
    ];

    var filterForKeyword = function(resources) {
      var filteredResources = resources;
      if (!filterExpressions.length) {
        return filteredResources;
      }

      // Find events that match all keywords.
      angular.forEach(filterExpressions, function(regex) {
        var matchesKeyword = function(event) {
          var i;
          for (i = 0; i < filterFields.length; i++) {
            var value = _.get(event, filterFields[i]);
            if (value && regex.test(value)) {
              return true;
            }
          }

          return false;
        };

        filteredResources = _.filter(filteredResources, matchesKeyword);
      });
      return filteredResources;
    };

    var filterAllResourcesForKeyword = function() {
      $scope.filteredPods = filterForKeyword(ageFilteredPods);
      $scope.filteredDeployments = filterForKeyword(ageFilteredDeployments);
      $scope.filteredBuilds = filterForKeyword(ageFilteredBuilds);      
    };

    var setPodLogVars = function(pod) {
      $scope.logOptions.pods[pod.metadata.name] = {
        container: pod.spec.containers[0].name
      };
      $scope.logCanRun.pods[pod.metadata.name] = !(_.includes(['New', 'Pending', 'Unknown'], pod.status.phase));
    };

    var setDeploymentLogVars = function(deployment) {   
      $scope.logOptions.deployments[deployment.metadata.name] = {
        container: $filter("annotation")(deployment, "pod")
      };
      var deploymentVersion = $filter("annotation")(deployment, "deploymentVersion");
      if (deploymentVersion) {
        $scope.logOptions.deployments[deployment.metadata.name].version = deploymentVersion;
      }        
      $scope.logCanRun.deployments[deployment.metadata.name] = !(_.includes(['New', 'Pending'], $filter('deploymentStatus')(deployment)));
    };

    var setBuildLogVars = function(build) {
      $scope.logOptions.builds[build.metadata.name] = {
        container: $filter("annotation")(build, "buildPod")
      };
      $scope.logCanRun.builds[build.metadata.name] = !(_.includes(['New', 'Pending', 'Error'], build.status.phase));
    };

    var filterPods = function() {
      ageFilteredPods = _.filter($scope.pods, function(pod) {
        if ($scope.filters.showOlderResources) {
          return true;
        }
        if (pod.status.phase !== 'Succeeded' && pod.status.phase !== 'Failed') {
          return true;
        }
        return false;
      });
    };

    var isIncompleteBuild = $filter('isIncompleteBuild');
    var buildConfigForBuild = $filter('buildConfigForBuild');
    var filterBuilds = function() {
      var fiveMinutesAgo = moment().subtract(5, 'm');
      ageFilteredBuilds = _.filter($scope.builds, function(build) {
        if ($scope.filters.showOlderResources) {
          return true;
        }        
        if (isIncompleteBuild(build)) {
          return true;
        }
        var buildConfigName = buildConfigForBuild(build);
        if (buildConfigName) {
          return $scope.latestBuildByConfig[buildConfigName].metadata.name === build.metadata.name;
        }
        
        // Otherwise this is a one-off build, keep any of those that finished in the last 5 minutes, if we
        // don't have a completionTimestamp for some reason then fallback to creationTimestamp
        var completed = moment(build.status.completionTimestamp || build.metadata.creationTimestamp);
        return completed.isAfter(fiveMinutesAgo);        
      });
    };

    var deploymentStatus = $filter('deploymentStatus');
    var filterDeployments = function() {
      ageFilteredDeployments = _.filter($scope.deployments, function(deployment) {
        if ($scope.filters.showOlderResources) {
          return true;
        }        
        var status = deploymentStatus(deployment);
        if (status !== 'Complete' && status !== 'Failed') {
          return true;
        }
        return false;
      });
    };        

    $scope.toggleItem = function(resource, expanded) {
      var event = expanded ? 'event.resource.highlight' : 'event.resource.clear-highlight';
      $rootScope.$emit(event, resource);
      if (resource.kind === 'Build') {
        var buildPod = _.get($scope.podsByName, $filter('annotation')(resource, 'buildPod'));
        if (buildPod) {
          $rootScope.$emit(event, buildPod);
        }
      }
      if (resource.kind === 'ReplicationController') {
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
          _.each($scope.pods, function(pod) {
            setPodLogVars(pod);
          });
          filterPods();
          Logger.log("pods", $scope.pods);
        });

        DataService.watch("replicationcontrollers", context, function(deployments) {
          $scope.deployments = orderByDate(deployments.by("metadata.name"), true);
          groupPods();
          _.each($scope.deployments, function(deployment) {
            setDeploymentLogVars(deployment);
          });
          filterDeployments();
          Logger.log("deployments", $scope.deployments);
        });

        DataService.watch("builds", context, function(builds) {
          $scope.builds = orderByDate(builds.by("metadata.name"), true);
          $scope.latestBuildByConfig = BuildsService.latestBuildByConfig($scope.builds);          
          _.each($scope.builds, function(build) {
            setBuildLogVars(build);
          });
          filterBuilds();
          Logger.log("builds", $scope.builds);
        });

        $scope.$on('$destroy', function(){
          DataService.unwatchAll(watches);
        });

        $scope.$watchGroup(['filters.showOlderResources'], function() {
          filterPods();
          filterBuilds();
          filterDeployments();
          filterAllResourcesForKeyword();          
        });

        $scope.$watch('filters.text', _.debounce(function() {
              updateKeywords();
              $scope.$apply(filterAllResourcesForKeyword);
            }, 50, { maxWait: 250 }));        

      }));
  });
