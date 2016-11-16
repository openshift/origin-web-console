'use strict';

angular.module('openshiftConsole')
  .controller('StatefulSetsController', function($scope, $routeParams, AlertMessageService, DataService, ProjectsService) {
    $scope.projectName = $routeParams.project;
    $scope.alerts = $scope.alerts || {};
    $scope.emptyMessage = "Loading...";

    // get and clear any alerts
    AlertMessageService.getAlerts().forEach(function(alert) {
      $scope.alerts[alert.name] = alert.data;
    });
    AlertMessageService.clearAlerts();

    var watches = [];
    ProjectsService
      .get($routeParams.project)
      .then(_.spread(function(project, context) {
        $scope.project = project;

        watches.push(DataService.watch({
          resource: 'statefulsets',
          group: 'apps',
          version: 'v1beta1'
        }, context, function(statefulSets) {
          angular.extend($scope, {
            loaded: true,
            statefulSets: statefulSets.by('metadata.name')
          });
        }));

        $scope.$on('$destroy', function(){
          DataService.unwatchAll(watches);
        });

      }));
  });
