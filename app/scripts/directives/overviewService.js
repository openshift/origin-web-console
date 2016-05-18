'use strict';

angular.module('openshiftConsole')
  .directive('overviewService', function($filter,
                                         DeploymentsService,
                                         MetricsService,
                                         Navigate) {
    return {
      restrict: 'E',
      scope: {
        service: '=',
        deploymentConfigs: '=',
        visibleDeploymentsByConfig: '=',
        replicationControllers: '=',
        recentPipelines: '=',
        pipelinesByDeployment: '=',
        podsByDeployment: '=',
        hpaByDc: '=',
        hpaByRc: '=',
        scalableDeploymentByConfig: '=',
        monopods: '='
      },
      templateUrl: 'views/_overview-service.html',
      link: function($scope) {
        if (!window.OPENSHIFT_CONSTANTS.DISABLE_OVERVIEW_METRICS) {
          MetricsService.isAvailable(true).then(function(available) {
            $scope.showMetrics = available;
          });
        }

        var annotation = $filter('annotation');

        $scope.$watch('visibleDeploymentsByConfig', function(visibleDeploymentsByConfig) {
          $scope.activeDeploymentByConfig = {};
          _.each(visibleDeploymentsByConfig, function(deployments, dcName) {
            $scope.activeDeploymentByConfig[dcName] = DeploymentsService.getActiveDeployment(deployments);
          });
        });

        $scope.isDeploymentLatest = function(deployment) {
          var dcName = annotation(deployment, 'deploymentConfig');
          if (!dcName) {
            return true;
          }

          // Wait for deployment configs to load.
          if (!$scope.deploymentConfigs) {
            return false;
          }

          var deploymentVersion = parseInt(annotation(deployment, 'deploymentVersion'));
          return _.find($scope.deploymentConfigs, function(dc) {
            return dc.metadata.name === dcName && dc.status.latestVersion === deploymentVersion;
          });
        };

        $scope.viewPodsForDeployment = function(deployment) {
          if (_.isEmpty($scope.podsByDeployment[deployment.metadata.name])) {
            return;
          }

          Navigate.toPodsForDeployment(deployment);
        };

        $scope.getHPA = function(rcName, dcName) {
          var hpaByDC = $scope.hpaByDc;
          var hpaByRC = $scope.hpaByRc;
          // Return `null` if the HPAs haven't been loaded.
          if (!hpaByDC || !hpaByRC) {
            return null;
          }

          // Set missing values to an empty array if the HPAs have loaded. We
          // want to use the same empty array for subsequent requests to avoid
          // triggering watch callbacks in overview-deployment.
          if (dcName) {
            hpaByDC[dcName] = hpaByDC[dcName] || [];
            return hpaByDC[dcName];
          }

          hpaByRC[rcName] = hpaByRC[rcName] || [];
          return hpaByRC[rcName];
        };

        $scope.isScalableDeployment = DeploymentsService.isScalable;
      }
    };
  });
