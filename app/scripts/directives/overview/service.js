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
          var replicaSets = _.get(replicaSetsByService, [ serviceName ], {});
          $scope.visibleReplicaSets = orderByDate(_.filter(replicaSets, isVisibleReplicaSet), true);
        });

        var countTiles = function() {
          var serviceName = _.get($scope, 'service.metadata.name');
          var statefulSets = _.get($scope, ['statefulSetsByService', serviceName], {});
          var monopods = _.get($scope, ['monopodsByService', serviceName], {});

          var rsTileCount = 0;
          _.each($scope.visibleReplicaSetsByDeployment, function(replicaSets, deploymentName) {
            if (!deploymentName) {
              // Vanilla RCs.
              rsTileCount += _.size(replicaSets);
            } else {
              // Deployment config tile.
              rsTileCount++;
            }
          });

          $scope.tileCount =
            _.size($scope.deploymentConfigs) +
            _.size($scope.replicationControllers) +
            _.size(statefulSets) +
            _.size(monopods) +
            rsTileCount;
        };

        $scope.$watch('vanillaReplicationControllersByService', function(rcByService) {
          var serviceName = _.get($scope, 'service.metadata.name');
          $scope.replicationControllers = _.get(rcByService, [serviceName], {});
          countTiles();
        });

        $scope.$watch('deploymentConfigsByService', function(deploymentConfigsByService) {
          var serviceName = _.get($scope, 'service.metadata.name');
          $scope.deploymentConfigs = _.get(deploymentConfigsByService, serviceName, {});
          countTiles();
        });

        $scope.$watch('visibleRSByDeploymentAndService', function(visibleRSByDeploymentAndService) {
          var serviceName = _.get($scope, 'service.metadata.name');
          $scope.visibleReplicaSetsByDeployment = _.get(visibleRSByDeploymentAndService, [serviceName], {});
          countTiles();
        });
      }
    };
  });
