'use strict';

angular.module('openshiftConsole')
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
