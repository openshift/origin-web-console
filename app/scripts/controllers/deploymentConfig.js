'use strict';

/**
 * @ngdoc function
 * @name openshiftConsole.controller:DeploymentConfigController
 * @description
 * Controller of the openshiftConsole
 */
angular.module('openshiftConsole')
  .controller('DeploymentConfigController',
              function ($scope,
                        $filter,
                        $routeParams,
                        AlertMessageService,
                        BreadcrumbsService,
                        DataService,
                        DeploymentsService,
                        EnvironmentService,
                        HPAService,
                        ImageStreamResolver,
                        ModalsService,
                        Navigate,
                        NotificationsService,
                        Logger,
                        ProjectsService,
                        StorageService,
                        LabelFilter,
                        labelNameFilter) {
    var imageStreamImageRefByDockerReference = {}; // lets us determine if a particular container's docker image reference belongs to an imageStream

    $scope.projectName = $routeParams.project;
    $scope.deploymentConfigName = $routeParams.deploymentconfig;
    $scope.deploymentConfig = null;
    $scope.deployments = {};
    $scope.unfilteredDeployments = {};
    $scope.imagesByDockerReference = {};
    $scope.builds = {};
    $scope.labelSuggestions = {};
    $scope.forms = {};
    $scope.alerts = {};
    $scope.breadcrumbs = BreadcrumbsService.getBreadcrumbs({
      name: $routeParams.deploymentconfig,
      kind: 'DeploymentConfig',
      namespace: $routeParams.project
    });
    $scope.emptyMessage = "Loading...";
    $scope.healthCheckURL = Navigate.healthCheckURL($routeParams.project,
                                                    "DeploymentConfig",
                                                    $routeParams.deploymentconfig);

    // get and clear any alerts
    AlertMessageService.getAlerts().forEach(function(alert) {
      $scope.alerts[alert.name] = alert.data;
    });
    AlertMessageService.clearAlerts();

    var orderByDate = $filter('orderObjectsByDate');
    var mostRecent = $filter('mostRecent');

    var previousEnvConflict = false;
    var updateEnvironment = function(current, previous) {
      if (previousEnvConflict) {
        return;
      }

      if (!$scope.forms.dcEnvVars || $scope.forms.dcEnvVars.$pristine) {
        $scope.updatedDeploymentConfig = EnvironmentService.copyAndNormalize(current);
        return;
      }

      // The env var form has changed and the deployment config has been
      // updated. See if there were any background changes to the environment
      // variables. If not, merge the environment edits into the updated
      // deployment config object.
      if (EnvironmentService.isEnvironmentEqual(current, previous)) {
        $scope.updatedDeploymentConfig = EnvironmentService.mergeEdits($scope.updatedDeploymentConfig, current);
        return;
      }

      previousEnvConflict = true;
      $scope.alerts["env-conflict"] = {
        type: "warning",
        message: "The environment variables for the deployment configuration have been updated in the background. Saving your changes may create a conflict or cause loss of data.",
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

    var orderByDisplayName = $filter('orderByDisplayName');
    var getErrorDetails = $filter('getErrorDetails');

    var displayError = function(errorMessage, errorDetails) {
      $scope.alerts['from-value-objects'] = {
        type: "error",
        message: errorMessage,
        details: errorDetails
      };
    };

    var watches = [];

    var configMapDataOrdered = [];
    var secretDataOrdered = [];
    $scope.valueFromObjects = [];

    ProjectsService
      .get($routeParams.project)
      .then(_.spread(function(project, context) {
        $scope.project = project;
        $scope.projectContext = context;

        var limitRanges = {};

        var updateHPAWarnings = function() {
            HPAService.getHPAWarnings($scope.deploymentConfig, $scope.autoscalers, limitRanges, project)
                      .then(function(warnings) {
              $scope.hpaWarnings = warnings;
            });
        };

        var saveEnvPromise;
        DataService.get("deploymentconfigs", $routeParams.deploymentconfig, context).then(
          // success
          function(deploymentConfig) {
            $scope.loaded = true;
            $scope.deploymentConfig = deploymentConfig;
            $scope.strategyParams = $filter('deploymentStrategyParams')(deploymentConfig);
            updateHPAWarnings();
            $scope.updatedDeploymentConfig = EnvironmentService.copyAndNormalize($scope.deploymentConfig);
            $scope.saveEnvVars = function() {
              EnvironmentService.compact($scope.updatedDeploymentConfig);
              saveEnvPromise = DataService.update("deploymentconfigs",
                                                  $routeParams.deploymentconfig,
                                                  $scope.updatedDeploymentConfig,
                                                  context);
              saveEnvPromise.then(function success(){
                // TODO:  de-duplicate success and error messages.
                // as it stands, multiple messages appear based on how edit
                // is made.
                NotificationsService.addNotification({
                  type: "success",
                  // TODO:  improve success alert
                  message: $scope.deploymentConfigName + " was updated."
                });
                $scope.forms.dcEnvVars.$setPristine();
              }, function error(e){
                NotificationsService.addNotification({
                  type: "error",
                  message: $scope.deploymentConfigName + " was not updated.",
                  details: "Reason: " + $filter('getErrorDetails')(e)
                });
              }).finally(function() {
                saveEnvPromise = null;
              });
            };
            $scope.clearEnvVarUpdates = function() {
              $scope.updatedDeploymentConfig = EnvironmentService.copyAndNormalize($scope.deploymentConfig);
              $scope.forms.dcEnvVars.$setPristine();
              previousEnvConflict = false;
            };

            // If we found the item successfully, watch for changes on it
            watches.push(DataService.watchObject("deploymentconfigs", $routeParams.deploymentconfig, context, function(deploymentConfig, action) {
              if (action === "DELETED") {
                $scope.alerts["deleted"] = {
                  type: "warning",
                  message: "This deployment configuration has been deleted."
                };
              }
              var previous = $scope.deploymentConfig;
              $scope.deploymentConfig = deploymentConfig;
              $scope.updatingPausedState = false;
              updateHPAWarnings();

              // Wait for a pending save to complete to avoid a race between the PUT and the watch callbacks.
              if (saveEnvPromise) {
                saveEnvPromise.finally(function() {
                  updateEnvironment(deploymentConfig, previous);
                });
              } else {
                updateEnvironment(deploymentConfig, previous);
              }

              ImageStreamResolver.fetchReferencedImageStreamImages([deploymentConfig.spec.template], $scope.imagesByDockerReference, imageStreamImageRefByDockerReference, context);
            }));
          },
          // failure
          function(e) {
            $scope.loaded = true;
            $scope.alerts["load"] = {
              type: "error",
              message: e.status === 404 ? "This deployment configuration can not be found, it may have been deleted." : "The deployment configuration details could not be loaded.",
              details: e.status === 404 ? "Any remaining deployment history for this deployment will be shown." : "Reason: " + $filter('getErrorDetails')(e)
            };
          }
        );

        watches.push(DataService.watch("replicationcontrollers", context, function(deployments, action, deployment) {
          var deploymentConfigName = $routeParams.deploymentconfig;
          $scope.emptyMessage = "No deployments to show";
          if (!action) {
            var deploymentsByDeploymentConfig = DeploymentsService.associateDeploymentsToDeploymentConfig(deployments.by("metadata.name"));
            $scope.unfilteredDeployments = deploymentsByDeploymentConfig[$routeParams.deploymentconfig] || {};
            angular.forEach($scope.unfilteredDeployments, function(deployment) {
              deployment.causes = $filter('deploymentCauses')(deployment);
            });
            // Loading of the page that will create deploymentConfigDeploymentsInProgress structure, which will associate running deployment to his deploymentConfig.
            $scope.deploymentConfigDeploymentsInProgress = DeploymentsService.associateRunningDeploymentToDeploymentConfig(deploymentsByDeploymentConfig);
          } else if (DeploymentsService.deploymentBelongsToConfig(deployment, $routeParams.deploymentconfig)) {
            var deploymentName = deployment.metadata.name;
            switch (action) {
              case 'ADDED':
              case 'MODIFIED':
                $scope.unfilteredDeployments[deploymentName] = deployment;
                // When deployment is retried, associate him to his deploymentConfig and add him into deploymentConfigDeploymentsInProgress structure.
                if ($filter('deploymentIsInProgress')(deployment)){
                  $scope.deploymentConfigDeploymentsInProgress[deploymentConfigName] = $scope.deploymentConfigDeploymentsInProgress[deploymentConfigName] || {};
                  $scope.deploymentConfigDeploymentsInProgress[deploymentConfigName][deploymentName] = deployment;
                } else if ($scope.deploymentConfigDeploymentsInProgress[deploymentConfigName]) { // After the deployment ends remove him from the deploymentConfigDeploymentsInProgress structure.
                  delete $scope.deploymentConfigDeploymentsInProgress[deploymentConfigName][deploymentName];
                }
                deployment.causes = $filter('deploymentCauses')(deployment);
                break;
              case 'DELETED':
                delete $scope.unfilteredDeployments[deploymentName];
                if ($scope.deploymentConfigDeploymentsInProgress[deploymentConfigName]) {
                  delete $scope.deploymentConfigDeploymentsInProgress[deploymentConfigName][deploymentName];
                }
                break;
            }
          }

          $scope.deployments = LabelFilter.getLabelSelector().select($scope.unfilteredDeployments);
          $scope.orderedDeployments = orderByDate($scope.deployments, true);
          $scope.deploymentInProgress = !!_.size($scope.deploymentConfigDeploymentsInProgress[deploymentConfigName]);
          $scope.mostRecent = mostRecent($scope.unfilteredDeployments);

          updateFilterWarning();
          LabelFilter.addLabelSuggestionsFromResources($scope.unfilteredDeployments, $scope.labelSuggestions);
          LabelFilter.setLabelSuggestions($scope.labelSuggestions);
        },
        // params object for filtering
        {
          // http is passed to underlying $http calls
          http: {
            params: {
              labelSelector: labelNameFilter('deploymentConfig')+'='+ $scope.deploymentConfigName
            }
          }
        }
      ));

        // List limit ranges in this project to determine if there is a default
        // CPU request for autoscaling.
        DataService.list("limitranges", context).then(function(resp) {
          limitRanges = resp.by("metadata.name");
          updateHPAWarnings();
        });

        DataService.list("configmaps", context, null, { errorNotification: false }).then(function(configMapData) {
          configMapDataOrdered = orderByDisplayName(configMapData.by("metadata.name"));
          $scope.valueFromObjects = configMapDataOrdered.concat(secretDataOrdered);
        }, function(e) {
          if (e.code === 403) {
            return;
          }

          displayError('Could not load config maps', getErrorDetails(e));
        });

        DataService.list("secrets", context, null, { errorNotification: false }).then(function(secretData) {
          secretDataOrdered = orderByDisplayName(secretData.by("metadata.name"));
          $scope.valueFromObjects = secretDataOrdered.concat(configMapDataOrdered);
        }, function(e) {
          if (e.code === 403) {
            return;
          }

          displayError('Could not load secrets', getErrorDetails(e));
        });

        watches.push(DataService.watch("imagestreams", context, function(imageStreamData) {
          var imageStreams = imageStreamData.by("metadata.name");
          ImageStreamResolver.buildDockerRefMapForImageStreams(imageStreams, imageStreamImageRefByDockerReference);
          // If the dep config has been loaded already
          if ($scope.deploymentConfig) {
            ImageStreamResolver.fetchReferencedImageStreamImages([$scope.deploymentConfig.spec.template], $scope.imagesByDockerReference, imageStreamImageRefByDockerReference, context);
          }
          Logger.log("imagestreams (subscribe)", $scope.imageStreams);
        }));

        watches.push(DataService.watch("builds", context, function(builds) {
          $scope.builds = builds.by("metadata.name");
          Logger.log("builds (subscribe)", $scope.builds);
        }));

        watches.push(DataService.watch({
          group: "autoscaling",
          resource: "horizontalpodautoscalers",
          version: "v1"
        }, context, function(hpa) {
          $scope.autoscalers =
            HPAService.filterHPA(hpa.by("metadata.name"), 'DeploymentConfig', $routeParams.deploymentconfig);
          updateHPAWarnings();
        }));

        function updateFilterWarning() {
          if (!LabelFilter.getLabelSelector().isEmpty() && $.isEmptyObject($scope.deployments) && !$.isEmptyObject($scope.unfilteredDeployments)) {
            $scope.alerts["deployments"] = {
              type: "warning",
              details: "The active filters are hiding all deployments."
            };
          }
          else {
            delete $scope.alerts["deployments"];
          }
        }

        LabelFilter.onActiveFiltersChanged(function(labelSelector) {
          // trigger a digest loop
          $scope.$apply(function() {
            $scope.deployments = labelSelector.select($scope.unfilteredDeployments);
            $scope.orderedDeployments = orderByDate($scope.deployments, true);
            updateFilterWarning();
          });
        });

        $scope.canDeploy = function() {
          if (!$scope.deploymentConfig) {
            return false;
          }

          if ($scope.deploymentConfig.metadata.deletionTimestamp) {
            return false;
          }

          if ($scope.deploymentInProgress) {
            return false;
          }

          if ($scope.deploymentConfig.spec.paused) {
            return false;
          }

          return true;
        };

        $scope.startLatestDeployment = function() {
          if ($scope.canDeploy()) {
            DeploymentsService.startLatestDeployment($scope.deploymentConfig, context, $scope);
          }
        };

        $scope.scale = function(replicas) {
          var showScalingError = function(result) {
            $scope.alerts["scale-error"] = {
              type: "error",
              message: "An error occurred scaling the deployment config.",
              details: $filter('getErrorDetails')(result)
            };
          };

          DeploymentsService.scale($scope.deploymentConfig, replicas).then(_.noop, showScalingError);
        };

        $scope.setPaused = function(paused) {
          $scope.updatingPausedState = true;
          DeploymentsService.setPaused($scope.deploymentConfig, paused, context).then(
            _.noop,
            // Failure
            function(e) {
              $scope.updatingPausedState = false;
              $scope.alerts["pause-error"] = {
                type: "error",
                message: "An error occurred " + (paused ? "pausing" : "resuming") + " the deployment config.",
                details: $filter('getErrorDetails')(e)
              };
            });
        };

        var isConfigChangeActive = function() {
          if (_.get($scope, 'deploymentConfig.spec.paused')) {
            return false;
          }

          var triggers = _.get($scope, 'deploymentConfig.spec.triggers', []);
          return _.some(triggers, { type: 'ConfigChange' });
        };

        $scope.removeVolume = function(volume) {
          var details;
          if (isConfigChangeActive()) {
            details = "This will remove the volume from the deployment config and trigger a new deployment.";
          } else {
            details = "This will remove the volume from the deployment config.";
          }

          if (volume.persistentVolumeClaim) {
            details += " It will not delete the persistent volume claim.";
          } else if (volume.secret) {
            details += " It will not delete the secret.";
          } else if (volume.configMap) {
            details += " It will not delete the config map.";
          }

          var confirm = ModalsService.confirm({
            message: "Remove volume " + volume.name + "?",
            details: details,
            okButtonText: "Remove",
            okButtonClass: "btn-danger",
            cancelButtonText: "Cancel"
          });

          var showError = function(e) {
            $scope.alerts["remove-volume-error"] = {
              type: "error",
              message: "An error occurred removing the volume.",
              details: $filter('getErrorDetails')(e)
            };
          };

          var removeVolume = function() {
            // No-op on success since the page updates.
            StorageService
              .removeVolume($scope.deploymentConfig, volume, context)
              .then(_.noop, showError);
          };

          confirm.then(removeVolume);
        };

        $scope.$on('$destroy', function(){
          DataService.unwatchAll(watches);
        });
    }));
  });
