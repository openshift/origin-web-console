'use strict';

/**
 * @ngdoc function
 * @name openshiftConsole.controller:ConfigMapController
 * @description
 * # ConfigMapController
 * Controller of the openshiftConsole
 */
angular.module('openshiftConsole')
  .controller('ConfigMapController',
              function ($scope,
                        $routeParams,
                        APIService,
                        BreadcrumbsService,
                        DataService,
                        ProjectsService) {
    $scope.projectName = $routeParams.project;
    $scope.alerts = $scope.alerts || {};
    $scope.loaded = false;
    $scope.labelSuggestions = {};
    $scope.breadcrumbs = BreadcrumbsService.getBreadcrumbs({
      name: $routeParams.configMap,
      kind: 'ConfigMap',
      namespace: $routeParams.project
    });
    $scope.configMapsVersion = APIService.getPreferredVersion('configmaps');
    var watches = [];

    var configMapResolved = function(configMap, action) {
      $scope.loaded = true;
      $scope.configMap = configMap;
      if (action === "DELETED") {
        $scope.alerts["deleted"] = {
          type: "warning",
          message: "This config map has been deleted."
        };
      }
    };

    $scope.addToApplicationVisible = false;

    $scope.addToApplication = function() {
      $scope.addToApplicationVisible = true;
    };

    $scope.closeAddToApplication = function() {
      $scope.addToApplicationVisible = false;
    };

    ProjectsService
      .get($routeParams.project)
      .then(_.spread(function(project, context) {
        $scope.project = project;
        DataService
          .get($scope.configMapsVersion, $routeParams.configMap, context, { errorNotification: false })
          .then(function(configMap) {
            configMapResolved(configMap);
            watches.push(DataService.watchObject("configmaps", $routeParams.configMap, context, configMapResolved));
          }, function(e) {
            $scope.loaded = true;
            $scope.error = e;
          });

        $scope.$on('$destroy', function(){
          DataService.unwatchAll(watches);
        });
      }));
  });
