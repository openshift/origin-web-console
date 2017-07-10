'use strict';

angular
  .module('openshiftConsole')
  .controller('StatefulSetController',
              function($filter,
                       $scope,
                       $routeParams,
                       BreadcrumbsService,
                       DataService,
                       EnvironmentService,
                       MetricsService,
                       NotificationsService,
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

    var watches = [];
    var projectContext;

    $scope.resourceGroupVersion = {
      resource: 'statefulsets',
      group: 'apps',
      version: 'v1beta1'
    };

    MetricsService.isAvailable().then(function(available) {
      $scope.metricsAvailable = available;
    });

    var previousEnvConflict = false;
    var updateEnvironment = function(current, previous) {
      if (previousEnvConflict) {
        return;
      }

      if (!$scope.forms.dcEnvVars || $scope.forms.dcEnvVars.$pristine) {
        $scope.updatedStatefulSet = EnvironmentService.copyAndNormalize(current);
        return;
      }

      // The env var form has changed and the deployment config has been
      // updated. See if there were any background changes to the environment
      // variables. If not, merge the environment edits into the updated
      // deployment config object.
      if (EnvironmentService.isEnvironmentEqual(current, previous)) {
        $scope.updatedStatefulSet = EnvironmentService.mergeEdits($scope.updatedStatefulSet, current);
        return;
      }

      previousEnvConflict = true;
      $scope.alerts["env-conflict"] = {
        type: "warning",
        message: "The environment variables for the stateful set have been updated in the background. Saving your changes may create a conflict or cause loss of data.",
        links: [
          {
            label: 'Reload Environment Variables',
            onClick: function() {
              $scope.clearEnvVarUpdates();
              return true;
            }
          }
        ]
      };
    };

    ProjectsService
      .get($routeParams.project)
      .then(_.spread(function(project, context) {
        projectContext = context;

        var saveEnvPromise;
        DataService
          .get($scope.resourceGroupVersion, $scope.statefulSetName, context, { errorNotification: false })
          .then(function(statefulSet) {

            angular.extend($scope, {
              statefulSet: statefulSet,
              project: project,
              projectContext: context,
              loaded: true,
              // TODO: support scaling(?). currently no scale subresource.
              isScalable: function() {
                return false;
              },
              scale: function() {}
            });
            updateEnvironment(statefulSet);

            $scope.saveEnvVars = function() {
              NotificationsService.hideNotification("save-stateful-set-env-error");
              EnvironmentService.compact($scope.updatedDeploymentConfig);
              saveEnvPromise = DataService.update($scope.resourceGroupVersion,
                                                  $scope.statefulSetName,
                                                  $scope.updatedStatefulSet,
                                                  context);
              saveEnvPromise.then(function success(){
                NotificationsService.addNotification({
                  type: "success",
                  message: "Environment variables for stateful set " + $scope.statefulSetName + " were successfully updated."
                });
                $scope.forms.statefulSetEnvVars.$setPristine();
              }, function error(e){
                NotificationsService.addNotification({
                  id: "save-stateful-set-env-error",
                  type: "error",
                  message: "An error occurred updating environment variables for stateful set " + $scope.statefulSetName + ".",
                  details: $filter('getErrorDetails')(e)
                });
              }).finally(function() {
                saveEnvPromise = null;
              });
            };
            $scope.clearEnvVarUpdates = function() {
              $scope.updatedDeploymentConfig = EnvironmentService.copyAndNormalize($scope.deploymentConfig);
              $scope.forms.statefulSetEnvVars.$setPristine();
              previousEnvConflict = false;
            };

            watches.push(DataService.watchObject($scope.resourceGroupVersion, $scope.statefulSetName, context, function(statefulSet) {
              var previous = $scope.statefulSet;
              $scope.statefulSet = statefulSet;

              // Wait for a pending save to complete to avoid a race between the PUT and the watch callbacks.
              if (saveEnvPromise) {
                saveEnvPromise.finally(function() {
                  updateEnvironment(statefulSet, previous);
                });
              } else {
                updateEnvironment(statefulSet, previous);
              }
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
