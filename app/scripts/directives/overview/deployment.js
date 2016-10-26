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
        var resumePending;
        $scope.$watch('deployment.spec.paused', function() {
          resumePending = false;
        });
        $scope.resumeDeployment = function() {
          // Guard against double clicks.
          if (resumePending) {
            return;
          }

          resumePending = true;
          DeploymentsService.setPaused($scope.deployment, false, {
            namespace: $scope.deployment.metadata.namespace
          }).then(_.noop, function(e) {
            resumePending = false;
            $scope.alerts["resume-deployment"] = {
              type: "error",
              message: "An error occurred resuming the deployment.",
              details: $filter('getErrorDetails')(e)
            };
          });
        };

        $scope.$watch(function() {
          return _.get($scope, ['deployments', $scope.deploymentName]);
        }, function() {
          $scope.deployment = _.get($scope, ['deployments', $scope.deploymentName]);
          $scope.latestRevision = DeploymentsService.getRevision($scope.deployment);
        });

        $scope.$watch('scalableReplicaSetsByDeployment', function() {
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
