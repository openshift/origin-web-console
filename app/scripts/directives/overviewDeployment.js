'use strict';

angular.module('openshiftConsole')
  // TODO: Remove when we remove the old overview code.
  .directive('topologyDeployment', function() {
    return {
      restrict: 'E',
      scope: {
        // Replication controller / deployment fields
        rc: '=',
        deploymentConfigId: '=',
        deploymentConfigMissing: '=',
        deploymentConfigDifferentService: '=',
        deploymentConfig: '=',
        scalable: '=',
        hpa: '=?',
        limitRanges: '=',
        project: '=',

        // Nested podTemplate fields
        imagesByDockerReference: '=',
        builds: '=',

        // Pods
        pods: '=',

        // To display scaling errors
        alerts: '='
      },
      templateUrl: 'views/_overview-deployment.html'
    };
  });
