'use strict';

angular
  .module('openshiftConsole')
  .controller('StatefulSetController',
              function($filter,
                       $scope,
                       $routeParams,
                       AlertMessageService,
                       BreadcrumbsService,
                       DataService,
                       EnvironmentService,
                       MetricsService,
                       ProjectsService,
                       PodsService) {

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

            watches.push(DataService.watch('pods', context, function(podData) {
              var pods = podData.by('metadata.name');
              $scope.podsForStatefulSet = PodsService.filterForOwner(pods, statefulSet);
            }));

            // Watch quotas and cluster quotas to warn about problems in the deployment donut.
            var QUOTA_POLL_INTERVAL = 60 * 1000;
            watches.push(DataService.watch('resourcequotas', context, function(quotaData) {
              $scope.quotas = quotaData.by("metadata.name");
            }, {poll: true, pollInterval: QUOTA_POLL_INTERVAL}));

            watches.push(DataService.watch('appliedclusterresourcequotas', context, function(clusterQuotaData) {
              $scope.clusterQuotas = clusterQuotaData.by("metadata.name");
            }, {poll: true, pollInterval: QUOTA_POLL_INTERVAL}));
          });
      }));

    $scope.$on('$destroy', function(){
      DataService.unwatchAll(watches);
    });

  });
