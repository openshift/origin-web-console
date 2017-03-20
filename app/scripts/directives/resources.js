'use strict';

angular.module('openshiftConsole')
  .directive('overviewMonopod', function(Navigate, $location) {
    return {
      restrict: 'E',
      scope: {
        pod: '='
      },
      templateUrl: 'views/_overview-monopod.html',
      link: function(scope) {
        scope.viewPod = function() {
          var url = Navigate.resourceURL(scope.pod, "Pod", scope.pod.metadata.namespace);
          $location.url(url);
        };
      }
    };
  })
  .directive('podTemplate', function() {
    return {
      restrict: 'E',
      scope: {
        podTemplate: '=',
        imagesByDockerReference: '=',
        builds: '=',
        detailed: '=?',
        // Optional URL for setting health checks on the resource when missing.
        addHealthCheckUrl: '@?'
      },
      templateUrl: 'views/_pod-template.html'
    };
  })

  /*
   * This directive is not currently used since we've switched to a donut chart on the overview.
   */
  //.directive('pods', function() {
  //  return {
  //    restrict: 'E',
  //    scope: {
  //      pods: '=',
  //      projectName: '@?' //TODO optional for now
  //    },
  //    templateUrl: 'views/_pods.html',
  //    controller: function($scope) {
  //      $scope.phases = [
  //        "Failed",
  //        "Pending",
  //        "Running",
  //        "Succeeded",
  //        "Unknown"
  //      ];
  //      $scope.expandedPhase = null;
  //      $scope.warningsExpanded = false;
  //      $scope.expandPhase = function(phase, warningsExpanded, $event) {
  //        $scope.expandedPhase = phase;
  //        $scope.warningsExpanded = warningsExpanded;
  //        if ($event) {
  //          $event.stopPropagation();
  //        }
  //      };
  //    }
  //  };
  //})

  /*
   * This directive is not currently used since we've switched to a donut chart on the overview.
   */
  //.directive('podContent', function() {
  //  // sub-directive used by the pods directive
  //  return {
  //    restrict: 'E',
  //    scope: {
  //      pod: '=',
  //      troubled: '='
  //    },
  //    templateUrl: 'views/directives/_pod-content.html'
  //  };
  //})

  .directive('triggers', function() {
    return {
      restrict: 'E',
      scope: {
        triggers: '=',
        buildsByOutputImage: '=',
        namespace: '='
      },
      templateUrl: 'views/_triggers.html'
    };
  })
  .directive('deploymentConfigMetadata', function() {
    return {
      restrict: 'E',
      scope: {
        deploymentConfigId: '=',
        exists: '=',
        differentService: '='
      },
      templateUrl: 'views/_deployment-config-metadata.html'
    };
  })
  .directive('annotations', function() {
    return {
      restrict: 'E',
      scope: {
        annotations: '='
      },
      templateUrl: 'views/directives/annotations.html',
      link: function(scope) {
        scope.expandAnnotations = false;
        scope.toggleAnnotations = function() {
          scope.expandAnnotations = !scope.expandAnnotations;
        };
      }
    };
  })
  .directive('volumes', function() {
    return {
      restrict: 'E',
      scope: {
        volumes: '=',
        namespace: '=',
        canRemove: '=?',
        removeFn: '&?'
      },
      templateUrl: 'views/_volumes.html'
    };
  })
  .directive('volumeClaimTemplates', function() {
    return {
      restrict: 'E',
      scope: {
        templates: '=',
      },
      templateUrl: 'views/_volume-claim-templates.html'
    };
  })
  .directive('hpa', function() {
    return {
      restrict: 'E',
      scope: {
        hpa: '=',
        project: '=',
        showScaleTarget: '=?',
        alerts: '='
      },
      templateUrl: 'views/directives/hpa.html'
    };
  })
  .directive('probe', function() {
    return {
      restrict: 'E',
      scope: {
        probe: '='
      },
      templateUrl: 'views/directives/_probe.html'
    };
  })
  .directive('podsTable', function($filter) {
    return {
      restrict: 'E',
      scope: {
        pods: '=',
        // Optional active pods map to display whether or not pods have endpoints
        activePods: '=?',
        // Optional empty message to display when there are no pods.
        emptyMessage: '=?',
        // Alternative header text to display in the 'Name' column.
        customNameHeader: '=?',
        // Optional map of explanations or warnings for each phase of a pod
        podFailureReasons: '=?'
      },
      templateUrl: 'views/directives/pods-table.html',
      link: function($scope) {
        var orderObjectsByDate = $filter('orderObjectsByDate');
        var sortPods = _.debounce(function(pods) {
          $scope.$evalAsync(function() {
            $scope.sortedPods = orderObjectsByDate(pods, true);
          });
        }, 150, { maxWait: 500 });

        $scope.$watch('pods', sortPods);
      }
    };
  })
  .directive('trafficTable', function() {
    return {
      restrict: 'E',
      scope: {
        routes: '=',
        services: '=',
        portsByRoute: '=',
        showNodePorts: '=?',
        // Alternative header text to display in the 'Name' column.
        customNameHeader: '=?',
      },
      templateUrl: 'views/directives/traffic-table.html'
    };
  });
