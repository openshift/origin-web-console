'use strict';

// Deployment donut contains the pod donut with scaling controls and autoscaling details.
angular.module('openshiftConsole')
  .directive('deploymentDonut', function($filter,
                                         $location,
                                         $timeout,
                                         $uibModal,
                                         DeploymentsService,
                                         HPAService,
                                         QuotaService,
                                         LabelFilter,
                                         Navigate,
                                         NotificationsService,
                                         hashSizeFilter,
                                         hasDeploymentConfigFilter) {
    return {
      restrict: 'E',
      scope: {
        // Replication controller / deployment fields
        rc: '=',
        deploymentConfig: '=',
        deployment: '=',
        scalable: '=',
        hpa: '=?',
        limitRanges: '=',
        quotas: '=',
        clusterQuotas: '=',
        project: '=',

        // Pods
        pods: '='
      },
      templateUrl: 'views/directives/deployment-donut.html',
      controller: function($scope, $filter, $q) {
        var scaleRequestPending = false;
        var humanizeKind = $filter('humanizeKind');

        $scope.$watch("rc.spec.replicas", function() {
          // Only reset desiredReplicas if we've already requested that value.
          if (!scaleRequestPending) {
            $scope.desiredReplicas = null;
          }
        });

        var updateHPAWarnings = function() {
            HPAService.getHPAWarnings($scope.rc, $scope.hpa, $scope.limitRanges, $scope.project)
                      .then(function(warnings) {
              // Create one string that we can show in a single popover.
              $scope.hpaWarnings = _.map(warnings, function(warning) {
                return _.escape(warning.message);
              }).join('<br>');
            });
        };

        $scope.$watchGroup(['limitRanges', 'hpa', 'project'], updateHPAWarnings);
        $scope.$watch('rc.spec.template.spec.containers', updateHPAWarnings, true);

        var updateQuotaWarning = function() {
          if (_.get($scope.rc, 'spec.replicas', 1) > _.get($scope.rc, 'status.replicas', 0)) {
            // if we haven't achieved our scale target double check for quota issues
            var filteredQuotas = QuotaService.filterQuotasForResource($scope.rc, $scope.quotas);
            var filteredClusterQuotas = QuotaService.filterQuotasForResource($scope.rc, $scope.clusterQuotas);
            var checkQuota = function(quota) {
              return !_.isEmpty(QuotaService.getResourceLimitAlerts($scope.rc, quota));
            };
            $scope.showQuotaWarning = _.some(filteredQuotas, checkQuota) || _.some(filteredClusterQuotas, checkQuota);
          }
          else {
            $scope.showQuotaWarning = false;
          }
        };

        $scope.$watchGroup(['rc.spec.replicas', 'rc.status.replicas', 'quotas', 'clusterQuotas'], updateQuotaWarning);

        var getScaleTarget = function() {
          return $scope.deploymentConfig || $scope.deployment || $scope.rc;
        };

        // use debouncedScale() unless the returned promise is needed
        var scale = function () {
          scaleRequestPending = false;
          if (!angular.isNumber($scope.desiredReplicas)) {
            return;
          }
          var scaleTarget = getScaleTarget();
          return DeploymentsService.scale(scaleTarget, $scope.desiredReplicas).then(_.noop, function(result) {
            var kind = humanizeKind(scaleTarget.kind);
            NotificationsService.addNotification({
              id: "deployment-scale-error",
              type: "error",
              message: "An error occurred scaling " + kind + " " + scaleTarget.metadata.name + ".",
              details: $filter('getErrorDetails')(result)
            });

            return $q.reject(result);
          });
        };

        // Debounce scaling so multiple consecutive clicks only result in one request
        var debouncedScale = _.debounce(scale, 650);

        $scope.viewPodsForDeployment = function(deployment) {
          if (_.isEmpty($scope.pods)) {
            return;
          }

          Navigate.toPodsForDeployment(deployment, $scope.pods);
        };

        $scope.scaleUp = function() {
          if (!$scope.scalable) {
            return;
          }

          $scope.desiredReplicas = $scope.getDesiredReplicas();
          $scope.desiredReplicas++;
          debouncedScale();
          scaleRequestPending = true;
        };

        $scope.scaleDown = function() {
          if (!$scope.scalable) {
            return;
          }

          $scope.desiredReplicas = $scope.getDesiredReplicas();
          if ($scope.desiredReplicas === 0) {
            return;
          }

          // Prompt before scaling to 0.
          if ($scope.desiredReplicas === 1) {
            var modalInstance = $uibModal.open({
              templateUrl: 'views/modals/confirmScale.html',
              controller: 'ConfirmScaleController',
              resolve: {
                resource: function() {
                  return $scope.rc;
                },
                type: function() {
                  if (hasDeploymentConfigFilter($scope.rc)) {
                    return "deployment";
                  }

                  return "replication controller";
                }
              }
            });

            modalInstance.result.then(function() {
              // It's possible $scope.desiredReplicas was set to null if
              // rc.spec.replicas changed since the dialog was shown, so call
              // getDesiredReplicas() again.
              $scope.desiredReplicas = $scope.getDesiredReplicas() - 1;
              debouncedScale();
              scaleRequestPending = true;
            });

            return;
          }

          $scope.desiredReplicas--;
          debouncedScale();
        };

        $scope.getDesiredReplicas = function() {
          // If not null or undefined, use $scope.desiredReplicas.
          if (angular.isDefined($scope.desiredReplicas) && $scope.desiredReplicas !== null) {
            return $scope.desiredReplicas;
          }

          if ($scope.rc && $scope.rc.spec && angular.isDefined($scope.rc.spec.replicas)) {
            return $scope.rc.spec.replicas;
          }

          return 1;
        };

        $scope.$watch(
          function() {
            return !_.get($scope.rc, 'spec.replicas') && !!($scope.deploymentConfig ?
                    $filter('annotation')($scope.deploymentConfig, 'idledAt') :
                    $filter('annotation')($scope.rc, 'idledAt'));
          },
          function(isIdled) {
            $scope.isIdled = !!isIdled;
          });

        $scope.unIdle = function() {
          $scope.desiredReplicas = $filter('unidleTargetReplicas')($scope.deploymentConfig || $scope.rc, $scope.hpa);
          scale().then(function() {
            $scope.isIdled = false;
          });
        };
      }
    };
  });
