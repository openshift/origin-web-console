'use strict';

angular.module('openshiftConsole')
  .directive('overviewService', function($filter,
                                         DeploymentsService,
                                         MetricsService,
                                         Navigate) {
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

        $scope.$watch('deploymentConfigsByService', function(deploymentConfigsByService) {
          if (!deploymentConfigsByService) {
            return;
          }

          var serviceName = _.get($scope, 'service.metadata.name');
          $scope.deploymentConfigs = deploymentConfigsByService[serviceName];
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
          return _.some($scope.deploymentConfigs, function(dc) {
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
          var hpaByDC = $scope.hpaByDC;
          var hpaByRC = $scope.hpaByRC;
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

        $scope.isScalableDeployment = function(deployment) {
          return DeploymentsService.isScalable(deployment,
                                               $scope.deploymentConfigs,
                                               $scope.hpaByDC,
                                               $scope.hpaByRC,
                                               $scope.scalableDeploymentByConfig);
        };
      }
    };
  });
