"use strict";

angular.module('openshiftConsole')
  .directive('pauseRolloutsCheckbox', function(APIService) {
    return {
      restrict: 'E',
      scope: {
        // Deployment config or k8s deployment API object.
        deployment: '=',
        disabled: '=ngDisabled',
        // Show the checkbox even if the deployment config doesn't have a
        // config change trigger.
        alwaysVisible: '='
      },
      templateUrl: 'views/directives/pause-rollouts-checkbox.html',
      link: function($scope) {
        var isDeploymentConfig = function() {
          if (!$scope.deployment) {
            return false;
          }
          var rgv = APIService.objectToResourceGroupVersion($scope.deployment);
          return rgv.resource === 'deploymentconfigs' && !rgv.group;
        };

        $scope.$watch('deployment.spec.triggers', function(triggers) {
          // Hide the checkbox if there's no config change trigger.
          $scope.missingConfigChangeTrigger =
            isDeploymentConfig() && !_.some(triggers, { type: 'ConfigChange' });
        }, true);
      }
    };
  });
