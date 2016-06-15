'use strict';

angular.module('openshiftConsole')
  .directive('serviceGroup', function($filter,
                                      $uibModal,
                                      RoutesService,
                                      ServicesService) {
    return {
      restrict: 'E',
      scope: {
        service: '=',
        services: '=',
        childServices: '=',
        routes: '=',
        routeWarnings: '=',
        deploymentConfigsByService: '=',
        deploymentsByService: '=',
        visibleDeploymentsByConfigAndService: '=',
        recentPipelinesByDc: '=',
        pipelinesByDeployment: '=',
        podsByDeployment: '=',
        hpaByDc: '=',
        hpaByRc: '=',
        scalableDeploymentByConfig: '=',
        monopodsByService: '=',
        alerts: '=',
        buildsByOutputImage: '='
      },
      templateUrl: 'views/service-group.html',
      link: function($scope) {
        // Collapse infrastructure services like Jenkins by default on page load.
        $scope.collapse = ServicesService.isInfrastructure($scope.service);
        $scope.toggleCollapse = function() {
          $scope.collapse = !$scope.collapse;
        };

        $scope.linkService = function() {
          var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/modals/link-service.html',
            controller: 'LinkServiceModalController',
            scope: $scope
          });
          modalInstance.result.then(function(child) {
            ServicesService.linkService($scope.service, child).then(
              // success
              _.noop,
              // failure
              function(result) {
                $scope.alerts = $scope.alerts || {};
                $scope.alerts["link-service"] =
                  {
                    type: "error",
                    message: "Could not link services.",
                    details: $filter('getErrorDetails')(result)
                  };
              });
          });
        };

        $scope.$watch('service.metadata.labels.app', function(appName) {
          $scope.appName = appName;
        });

        $scope.$watch('routes', function(routes) {
          var displayRoute;
          _.each(routes, function(candidate) {
            if (!displayRoute) {
              displayRoute = candidate;
              return;
            }

            // Is candidate better than the current display route?
            displayRoute = RoutesService.getPreferredDisplayRoute(displayRoute, candidate);
          });

          $scope.displayRoute = displayRoute;
        });
      }
    };
  });
