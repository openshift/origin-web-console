'use strict';

angular.module('openshiftConsole')
  .directive('overviewService', function($filter,
                                         DeploymentsService,
                                         MetricsService) {
    return {
      restrict: 'E',
      // Inherit scope from OverviewController. This directive is only used for the overview.
      // We want to do all of the grouping of resources once in the overview controller watch callbacks.
      scope: true,
      templateUrl: 'views/overview/_service.html',
      link: function($scope) {
        if (!window.OPENSHIFT_CONSTANTS.DISABLE_OVERVIEW_METRICS) {
          MetricsService.isAvailable(true).then(function(available) {
            $scope.showMetrics = available;
          });
        }

        var annotation = $filter('annotation');
        var orderByDate = $filter('orderObjectsByDate');
        var isVisibleReplicaSet = function(replicaSet) {
          return _.get(replicaSet, 'status.replicas') ||
                 !annotation(replicaSet, 'deployment.kubernetes.io/revision');
        };
        $scope.$watch('replicaSetsByService', function(replicaSetsByService) {
          var serviceName = _.get($scope, 'service.metadata.name');
          var replicaSets = _.get(replicaSetsByService, [ serviceName ], []);
          $scope.visibleReplicaSets = orderByDate(_.filter(replicaSets, isVisibleReplicaSet), true);
        });

        $scope.$watch('visibleDeploymentsByConfigAndService', function(visibleDeploymentsByConfigAndService) {
          if (!visibleDeploymentsByConfigAndService) {
            return;
          }

          var serviceName = _.get($scope, 'service.metadata.name');
          $scope.activeDeploymentByConfig = {};
          $scope.visibleDeploymentsByConfig = visibleDeploymentsByConfigAndService[serviceName];

          // Determine if this service will show multiple RC tiles on the overview.
          $scope.rcTileCount = 0;
          _.each($scope.visibleDeploymentsByConfig, function(deployments, dcName) {
            if (!dcName) {
              // Vanilla RCs.
              $scope.rcTileCount += _.size(deployments);
            } else {
              // Deployment config tile.
              $scope.rcTileCount++;
            }
          });
        });
      }
    };
  });
