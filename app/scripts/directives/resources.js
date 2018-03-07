'use strict';

angular.module('openshiftConsole')
  .directive('containerStatuses', function($filter, APIService) {
    return {
      restrict: 'E',
      scope: {
        pod: '=',
        onDebugTerminal: '=?',
        detailed: '=?'
      },
      templateUrl: 'views/_container-statuses.html',
      link: function(scope) {
        scope.hasDebugTerminal = angular.isFunction(scope.onDebugTerminal);
        scope.podsVersion = APIService.getPreferredVersion('pods');
        var isContainerTerminatedSuccessfully = $filter('isContainerTerminatedSuccessfully');
        var haveAllContainersTerminatedSuccessfully = function(containerStatuses) {
          return _.every(containerStatuses, isContainerTerminatedSuccessfully);
        };

        scope.$watch('pod', function(updatedPod) {
          scope.initContainersTerminated = haveAllContainersTerminatedSuccessfully(updatedPod.status.initContainerStatuses);

          if (scope.expandInitContainers !== false) {
            scope.expandInitContainers = !scope.initContainersTerminated;
          }
        });

        scope.toggleInitContainer = function() {
          scope.expandInitContainers = !scope.expandInitContainers;
        };

        scope.showDebugAction = function (containerStatus) {

          if (_.get(scope.pod, 'status.phase') === 'Completed') {
            return false;
          }

          if ($filter('annotation')(scope.pod, 'openshift.io/build.name')) {
            return false;
          }

          if ($filter('isDebugPod')(scope.pod)) {
            return false;
          }

          var waitingReason = _.get(containerStatus, 'state.waiting.reason');
          if (waitingReason === 'ImagePullBackOff' || waitingReason === 'ErrImagePull') {
            return false;
          }

          return !_.get(containerStatus, 'state.running') || !containerStatus.ready;
        };

        scope.debugTerminal = function(containerStatusName) {
          if (scope.hasDebugTerminal) {
            return scope.onDebugTerminal.call(this, containerStatusName);
          }
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
  .directive('podTemplateContainer', function() {
    return {
      restrict: 'E',
      scope: {
        container: '=podTemplateContainer',
        imagesByDockerReference: '=',
        builds: '=',
        detailed: '=?'
      },
      templateUrl: 'views/_pod-template-container.html'
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
  .directive('registryAnnotations', function() {
    return {
      restrict: 'E',
      priority: 1,
      terminal: true,
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
  .directive('volumes', function(APIService) {
    return {
      restrict: 'E',
      scope: {
        volumes: '=',
        namespace: '=',
        canRemove: '=?',
        removeFn: '&?'
      },
      templateUrl: 'views/_volumes.html',
      link: function($scope) {
        $scope.secretsVersion = APIService.getPreferredVersion('secrets');
      }
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
