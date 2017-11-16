'use strict';

angular
  .module('openshiftConsole')
  .controller('StatefulSetController',
              function($filter,
                       $scope,
                       $routeParams,
                       APIService,
                       BreadcrumbsService,
                       DataService,
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

    var podsVersion = APIService.getPreferredVersion('pods');
    var resourceQuotasVersion = APIService.getPreferredVersion('resourcequotas');
    var appliedClusterResourceQuotasVersion = APIService.getPreferredVersion('appliedclusterresourcequotas');
    $scope.statefulSetsVersion = APIService.getPreferredVersion('statefulsets');

    var watches = [];
    var projectContext;

    MetricsService.isAvailable().then(function(available) {
      $scope.metricsAvailable = available;
    });

    ProjectsService
      .get($routeParams.project)
      .then(_.spread(function(project, context) {
        projectContext = context;

        DataService
          .get($scope.statefulSetsVersion, $scope.statefulSetName, context, { errorNotification: false })
          .then(function(statefulSet) {

            angular.extend($scope, {
              project: project,
              projectContext: context,
              statefulSet: statefulSet,
              loaded: true,
              // TODO: support scaling(?). currently no scale subresource.
              isScalable: function() {
                return false;
              },
              scale: function() {}
            });

            watches.push(DataService.watchObject($scope.statefulSetsVersion, $scope.statefulSetName, context, function(statefulSet) {
              $scope.statefulSet = statefulSet;
            }));

            watches.push(DataService.watch(podsVersion, context, function(podData) {
              var pods = podData.by('metadata.name');
              $scope.podsForStatefulSet = PodsService.filterForOwner(pods, statefulSet);
            }));

            // Watch quotas and cluster quotas to warn about problems in the deployment donut.
            var QUOTA_POLL_INTERVAL = 60 * 1000;
            watches.push(DataService.watch(resourceQuotasVersion, context, function(quotaData) {
              $scope.quotas = quotaData.by("metadata.name");
            }, {poll: true, pollInterval: QUOTA_POLL_INTERVAL}));

            watches.push(DataService.watch(appliedClusterResourceQuotasVersion, context, function(clusterQuotaData) {
              $scope.clusterQuotas = clusterQuotaData.by("metadata.name");
            }, {poll: true, pollInterval: QUOTA_POLL_INTERVAL}));
          }, function(e) {
            $scope.loaded = true;
            $scope.alerts["load"] = {
              type: "error",
              message: "The stateful set details could not be loaded.",
              details: $filter('getErrorDetails')(e)
            };
          });
      }));

    $scope.$on('$destroy', function(){
      DataService.unwatchAll(watches);
    });

  });
