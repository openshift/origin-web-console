'use strict';

angular.module('openshiftConsole')
  .directive('overviewDeploymentConfig', function($filter) {
    return {
      restrict: 'E',
      // Inherit scope from OverviewController. This directive is only used for the overview.
      // We want to do all of the grouping of resources once in the overview controller watch callbacks.
      scope: true,
      templateUrl: 'views/overview/_dc.html',
      link: function($scope) {
        var orderByDate = $filter('orderObjectsByDate');
        var anyDeploymentInProgress = $filter('anyDeploymentIsInProgress');

        $scope.$watch('deploymentConfigs', function(deploymentConfigs) {
          $scope.deploymentConfig = _.get(deploymentConfigs, $scope.dcName);
        });

        $scope.$watch('deployments', function(deployments) {
          $scope.orderedDeployments = orderByDate(deployments, true);
          $scope.activeDeployment = _.get($scope, ['scalableDeploymentByConfig', $scope.dcName]);
          $scope.anyDeploymentInProgress = anyDeploymentInProgress(deployments);
        });
      }
    };
  });
