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
                        HPAService,
                        ImageStreamResolver,
                        ModalsService,
                        Navigate,
                        Logger,
                        ProjectsService,
                        StorageService,
                        LabelFilter,
                        labelNameFilter,
                        keyValueEditorUtils) {
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

    // copy deploymentConfig and ensure it has env so that we can edit env vars using key-value-editor
    var copyDeploymentConfigAndEnsureEnv = function(deploymentConfig) {
      $scope.updatedDeploymentConfig = angular.copy(deploymentConfig);
      _.each($scope.updatedDeploymentConfig.spec.template.spec.containers, function(container) {
        container.env = container.env || [];
        // check valueFrom attribs and set an alt text for display if present
        _.each(container.env, function(env) {
          $filter('altTextForValueFrom')(env);
        });
      });
    };

    var watches = [];

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

        DataService.get("deploymentconfigs", $routeParams.deploymentconfig, context).then(
          // success
          function(deploymentConfig) {
            $scope.loaded = true;
            $scope.deploymentConfig = deploymentConfig;
            updateHPAWarnings();
            copyDeploymentConfigAndEnsureEnv(deploymentConfig);

            // save original env values for each dc container in order to obtain update count
            $scope.saveOriginalEnvVarValues = function() {
              $scope.originalEnvVars = {};
              _.each($scope.updatedDeploymentConfig.spec.template.spec.containers, function(container) {
                if (!$scope.originalEnvVars[container.name]) {
                  $scope.originalEnvVars[container.name] = [];
                }
                _.each(container.env, function(env) {
                  $scope.originalEnvVars[container.name].push(env);
                });
              });
            };
            $scope.saveOriginalEnvVarValues();

            $scope.saveEnvVars = function() {
              $scope.envVarDiffAmount = 0;
              _.each($scope.updatedDeploymentConfig.spec.template.spec.containers, function(container) {
                container.env = keyValueEditorUtils.compactEntries(angular.copy(container.env));

                // count number of updated environment vars
                var originalEnvs = $scope.originalEnvVars[container.name];
                if (originalEnvs.length !== container.env.length) {
                  $scope.envVarDiffAmount += Math.abs(originalEnvs.length - container.env.length);
                }
                for(var  i = 0; i < originalEnvs.length; i++) {
                  if(container.env[i] &&
                    (originalEnvs[i].name !== container.env[i].name ||
                    originalEnvs[i].value !== container.env[i].value)) {
                    $scope.envVarDiffAmount++;
                  }
                }
              });
              $scope.saveOriginalEnvVarValues();

              DataService.update("deploymentconfigs", $routeParams.deploymentconfig, angular.copy($scope.updatedDeploymentConfig), context)
                .then(function success(){
                  var fieldsText = ($scope.envVarDiffAmount > 1 ? "fields" : "field");
                  // TODO:  de-duplicate success and error messages.
                  // as it stands, multiple messages appear based on how edit
                  // is made.
                  $scope.alerts['saveDCEnvVarsSuccess'] = {
                    type: "success",
                    // TODO:  improve success alert
                    message: $scope.deploymentConfigName + " was updated (" + $scope.envVarDiffAmount + " " + fieldsText + " updated)."
                  };
                  $scope.forms.dcEnvVars.$setPristine();
                }, function error(e){
                  $scope.alerts['saveDCEnvVarsError'] = {
                    type: "error",
                    message: $scope.deploymentConfigName + " was not updated.",
                    details: "Reason: " + $filter('getErrorDetails')(e)
                  };
                });
            };
            $scope.clearEnvVarUpdates = function() {
              copyDeploymentConfigAndEnsureEnv($scope.deploymentConfig);
              $scope.forms.dcEnvVars.$setPristine();
            };

            // If we found the item successfully, watch for changes on it
            watches.push(DataService.watchObject("deploymentconfigs", $routeParams.deploymentconfig, context, function(deploymentConfig, action) {
              if (action === "DELETED") {
                $scope.alerts["deleted"] = {
                  type: "warning",
                  message: "This deployment configuration has been deleted."
                };
              }
              $scope.deploymentConfig = deploymentConfig;
              $scope.updatingPausedState = false;

              if (!$scope.forms.dcEnvVars || $scope.forms.dcEnvVars.$pristine) {
                copyDeploymentConfigAndEnsureEnv(deploymentConfig);
              } else {
                $scope.alerts["background_update"] = {
                  type: "warning",
                  message: "This deployment configuration has been updated in the background. Saving your changes may create a conflict or cause loss of data.",
                  links: [
                    {
                      label: 'Reload environment variables',
                      onClick: function() {
                        $scope.clearEnvVarUpdates();
                        return true;
                      }
                    }
                  ]
                };
              }

              updateHPAWarnings();
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
          $scope.deploymentInProgress = !!_.size($scope.deploymentConfigDeploymentsInProgress[deploymentConfigName]);

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
        DataService.list("limitranges", context, function(response) {
          limitRanges = response.by("metadata.name");
          updateHPAWarnings();
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
          group: "extensions",
          resource: "horizontalpodautoscalers"
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
