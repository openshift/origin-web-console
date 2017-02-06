'use strict';

angular
  .module('openshiftConsole')
  .controller('StatefulSetController', function(
    $filter,
    $scope,
    $routeParams,
    AlertMessageService,
    BreadcrumbsService,
    DataService,
    EnvironmentService,
    MetricsService,
    ProjectsService) {

    $scope.projectName = $routeParams.project;
    $scope.statefulSetName = $routeParams.statefulset;
    $scope.forms = {};
    $scope.alerts = {};
    $scope.breadcrumbs = BreadcrumbsService.getBreadcrumbs({
      name: $scope.statefulSetName,
      kind: 'StatefulSet',
      namespace: $routeParams.project
    });

    var updateEnvVars = function(statefulSet) {
      // Return a copy so that we don't alter the original object, which is
      // cached by DataService. Normalizing would otherwise modify the original.
      return EnvironmentService.copyAndNormalize(statefulSet);
    };

    AlertMessageService.getAlerts().forEach(function(alert) {
      $scope.alerts[alert.name] = alert.data;
    });
    AlertMessageService.clearAlerts();

    var watches = [];
    var projectContext;

    var updatePods = function(pods, selector) {
      if (!pods || !selector) {
        return;
      }
      return selector.select(pods);
    };

    var resourceGroupVersion = {
      resource: 'statefulsets',
      group: 'apps',
      version: 'v1beta1'
    };

    MetricsService.isAvailable().then(function(available) {
      $scope.metricsAvailable = available;
    });

    ProjectsService
      .get($routeParams.project)
      .then(_.spread(function(project, context) {
        projectContext = context;

        DataService
          .get(resourceGroupVersion, $scope.statefulSetName, context)
          .then(function(statefulSet) {

            angular.extend($scope, {
              statefulSet: updateEnvVars(statefulSet),
              project: project,
              projectContext: context,
              loaded: true,
              // TODO: support scaling(?). currently no scale subresource.
              isScalable: function() {
                return false;
              },
              scale: function() {}
            });

            watches.push(DataService.watchObject(resourceGroupVersion, $scope.statefulSetName, context, function(statefulSet) {
              angular.extend($scope, {
                resourceGroupVersion: resourceGroupVersion,
                statefulSet: updateEnvVars(statefulSet)
              });
            }));

            var pods;
            var selector;
            $scope.$watch('statefulSet.spec.selector', function() {
              selector = new LabelSelector($scope.statefulSet.spec.selector);
              $scope.podsForStatefulSet = updatePods(pods, selector);
            }, true);

            watches.push(DataService.watch('pods', context, function(podData) {
              pods = podData.by('metadata.name');
              $scope.podsForStatefulSet = updatePods(pods, selector);
            }));

          });
      }));

    $scope.$on('$destroy', function(){
      DataService.unwatchAll(watches);
    });

  });
