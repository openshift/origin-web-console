'use strict';

angular.module('openshiftConsole')
  .directive('overviewDeployment', function($filter, DeploymentsService) {
    return {
      restrict: 'E',
      // Inherit scope from OverviewController. This directive is only used for the overview.
      // We want to do all of the grouping of resources once in the overview controller watch callbacks.
      scope: true,
      templateUrl: 'views/overview/_deployment.html',
      link: function($scope) {
        var orderByDate = $filter('orderObjectsByDate');

        $scope.$watch(function() {
          return _.get($scope, ['deployments', $scope.deploymentName]);
        }, function() {
          $scope.deployment = _.get($scope, ['deployments', $scope.deploymentName]);
          $scope.latestRevision = DeploymentsService.getRevision($scope.deployment);
        });

        $scope.$watch('scalableReplicaSetsByDeployment', function(replicaSets) {
          $scope.latestReplicaSet = _.get($scope, ['scalableReplicaSetsByDeployment', $scope.deploymentName]);
        });

        $scope.$watch('replicaSets', function(replicaSets) {
          // Consider a deployment "in progress" if more than one replica set has active replicas.
          // Kubernetes deployments currently don't have a deployment status.
          $scope.inProgressDeployment = _.chain(replicaSets).filter('status.replicas').size() > 1;
        });
      }
    };
  });
