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
                        AlertMessageService,
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

    AlertMessageService.getAlerts().forEach(function(alert) {
      $scope.alerts[alert.name] = alert.data;
    });

    AlertMessageService.clearAlerts();

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

    ProjectsService
      .get($routeParams.project)
      .then(_.spread(function(project, context) {
        DataService
          .get("configmaps", $routeParams.configMap, context, { errorNotification: false })
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
