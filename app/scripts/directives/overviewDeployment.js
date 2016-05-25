'use strict';

angular.module('openshiftConsole')
  .directive('overviewDeployment', function() {
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
