'use strict';

/**
 * @ngdoc function
 * @name openshiftConsole.controller:ReplicaSetController
 * @description
 * Controller of the openshiftConsole
 */
angular.module('openshiftConsole')
  .controller('ReplicaSetController',
              function ($scope,
                        $filter,
                        $routeParams,
                        AlertMessageService,
                        BreadcrumbsService,
                        DataService,
                        DeploymentsService,
                        HPAService,
                        ImageStreamResolver,
                        Logger,
                        MetricsService,
                        ModalsService,
                        Navigate,
                        ProjectsService,
                        StorageService,
                        keyValueEditorUtils,
                        kind) {
    var hasDC = false;
    var annotation = $filter('annotation');
    var displayKind = $filter('humanizeKind')(kind);
    switch (kind) {
    case 'ReplicaSet':
      $scope.resource = {
        group: "extensions",
        resource: "replicasets"
      };
      $scope.healthCheckURL = Navigate.healthCheckURL($routeParams.project,
                                                      "ReplicaSet",
                                                      $routeParams.replicaSet,
                                                      "extensions");
      break;
    case 'ReplicationController':
      $scope.resource = 'replicationcontrollers';
      $scope.healthCheckURL = Navigate.healthCheckURL($routeParams.project,
                                                      "ReplicationController",
                                                      $routeParams.replicaSet);
      break;
    }

    // lets us determine if a particular container's docker image reference belongs to an imageStream
    var imageStreamImageRefByDockerReference = {};

    $scope.projectName = $routeParams.project;
    $scope.kind = kind;
    // Either a ReplicaSet or a ReplicationController
    $scope.replicaSet = null;
    $scope.deploymentConfig = null;
    $scope.deploymentConfigMissing = false;
    $scope.imagesByDockerReference = {};
    $scope.builds = {};
    $scope.alerts = {};
    $scope.renderOptions = $scope.renderOptions || {};
    $scope.renderOptions.hideFilterWidget = true;
    $scope.forms = {};

    $scope.logOptions = {};

    // get and clear any alerts
    AlertMessageService.getAlerts().forEach(function(alert) {
      $scope.alerts[alert.name] = alert.data;
    });
    AlertMessageService.clearAlerts();

    var watches = [];

    // Check if the metrics service is available so we know when to show the tab.
    MetricsService.isAvailable().then(function(available) {
      $scope.metricsAvailable = available;
    });

    var setLogVars = function(replicaSet) {
      $scope.logCanRun = !(_.includes(['New', 'Pending'], $filter('deploymentStatus')(replicaSet)));
    };

    var altTextForValueFrom = $filter('altTextForValueFrom');
    var copyDeploymentAndEnsureEnv = function(replicaSet) {
      $scope.updatedDeployment = angular.copy(replicaSet);
      _.each($scope.updatedDeployment.spec.template.spec.containers, function(container) {
        container.env = container.env || [];
        _.each(container.env, altTextForValueFrom);
      });
    };

    $scope.saveEnvVars = function() {
      _.each($scope.updatedDeployment.spec.template.spec.containers, function(container) {
        container.env = keyValueEditorUtils.compactEntries(angular.copy(container.env));
      });
      DataService
        .update(
          $scope.resource,
          $routeParams.replicaSet,
          angular.copy($scope.updatedDeployment),
          $scope.projectContext)
        .then(function() {
          $scope.alerts['saveEnvSuccess'] = {
            type: "success",
            // TODO:  improve success alert
            message: $scope.replicaSet.metadata.name + " was updated."
          };
          $scope.forms.envForm.$setPristine();
        }, function(e) {
          $scope.alerts['saveEnvError'] = {
            type: "error",
            message: $scope.replicaSet.metadata.name + " was not updated.",
            details: "Reason: " + $filter('getErrorDetails')(e)
          };
        });
    };

    $scope.clearEnvVarUpdates = function() {
      copyDeploymentAndEnsureEnv($scope.replicaSet);
      $scope.forms.envForm.$setPristine();
    };

    var limitWatches = $filter('isIE')() || $filter('isEdge')();

    ProjectsService
      .get($routeParams.project)
      .then(_.spread(function(project, context) {
        $scope.project = project;
        // FIXME: DataService.createStream() requires a scope with a
        // projectPromise rather than just a namespace, so we have to pass the
        // context into the log-viewer directive.
        $scope.projectContext = context;

        var allHPA = {}, limitRanges = {};
        var updateHPA = function() {
          $scope.hpaForRS = HPAService.filterHPA(allHPA, kind, $routeParams.replicaSet);
          if ($scope.deploymentConfigName && $scope.isActive) {
            // Show both HPAs that target the replication controller and the deployment config if this is the active replication controller.
            var hpaForDC = HPAService.filterHPA(allHPA, 'DeploymentConfig', $scope.deploymentConfigName);
            $scope.autoscalers = $scope.hpaForRS.concat(hpaForDC);
          } else if ($scope.deployment && $scope.isActive) {
            // Show both HPAs that target the replica set and the deployment if this is the active replica set.
            var hpaForDeployment = HPAService.filterHPA(allHPA, 'Deployment', $scope.deployment.metadata.name);
            $scope.autoscalers = $scope.hpaForRS.concat(hpaForDeployment);
          } else {
            $scope.autoscalers = $scope.hpaForRS;
          }
        };

        var watchActiveDeployment = function() {
          // Watch all replication controllers so we know if this is the active deployment to enable scaling.
          watches.push(DataService.watch($scope.resource, context, function(deployments) {
            var activeDeployment,
                deploymentsForConfig = [];
            // Filter the list to just those deployments for this config.
            angular.forEach(deployments.by("metadata.name"), function(deployment) {
              var depConfigName = annotation(deployment, 'deploymentConfig') || "";
              if (depConfigName === $scope.deploymentConfigName) {
                deploymentsForConfig.push(deployment);
              }
            });
            activeDeployment = DeploymentsService.getActiveDeployment(deploymentsForConfig);
            $scope.isActive = activeDeployment && activeDeployment.metadata.uid === $scope.replicaSet.metadata.uid;
            updateHPA();
          }));
        };

        var pods, selector;
        var updatePodsForDeployment = function() {
          if (!pods || !selector) {
            return;
          }

          $scope.podsForDeployment = _.filter(pods, function(pod) {
            return selector.matches(pod);
          });
        };

        var updateHPAWarnings = function() {
            HPAService.getHPAWarnings($scope.replicaSet, $scope.autoscalers, limitRanges, project)
                      .then(function(warnings) {
              $scope.hpaWarnings = warnings;
            });
        };

        var updateDC = function(rc) {
          var dcName = annotation(rc, "deploymentConfig");
          if (!dcName) {
            return;
          }

          hasDC = true;
          $scope.deploymentConfigName = dcName;

          var deploymentVersion = annotation(rc, "deploymentVersion");
          if (deploymentVersion) {
            $scope.logOptions.version = deploymentVersion;
          }
          $scope.healthCheckURL = Navigate.healthCheckURL($routeParams.project,
                                                          "DeploymentConfig",
                                                          dcName);
          DataService.get("deploymentconfigs", dcName, context, {
            errorNotification: false
          }).then(
            // success
            function(deploymentConfig) {
              $scope.deploymentConfig = deploymentConfig;
            },
            // failure
            function(e) {
              if (e.status === 404) {
                $scope.deploymentConfigMissing = true;
                return;
              }

              $scope.alerts["load"] = {
                type: "error",
                message: "The deployment configuration details could not be loaded.",
                details: "Reason: " + $filter('getErrorDetails')(e)
              };
            }
          );
        };

        var checkActiveRevision = function() {
          $scope.isActive = DeploymentsService.isActiveReplicaSet($scope.replicaSet, $scope.deployment);
        };

        var hasDeployment = $filter('hasDeployment');
        var inProgressDeployment = false;
        var updateDeployment = function() {
          if (!hasDeployment($scope.replicaSet)) {
            return;
          }

          DataService.list({
            group: 'extensions',
            resource: 'deployments'
          }, context, function(deploymentData) {
            var deployments = deploymentData.by('metadata.name');
            var replicaSetSelector = new LabelSelector($scope.replicaSet.spec.selector);
            $scope.deployment = _.find(deployments, function(deployment) {
              var deploymentSelector = new LabelSelector(deployment.spec.selector);
              return deploymentSelector.covers(replicaSetSelector);
            });
            if (!$scope.deployment) {
              $scope.deploymentMissing = true;
              return;
            }

            $scope.healthCheckURL = Navigate.healthCheckURL($routeParams.project,
                                                            "Deployment",
                                                            $scope.deployment.metadata.name,
                                                            "extensions");

            watches.push(DataService.watchObject({
              group: 'extensions',
              resource: 'deployments'
            }, $scope.deployment.metadata.name, context, function(deployment, action) {
              if (action === "DELETED") {
                $scope.alerts['deployment-deleted'] = {
                  type: "warning",
                  message: "The deployment controlling this replica set has been deleted."
                };
                $scope.healthCheckURL = Navigate.healthCheckURL($routeParams.project,
                                                                "ReplicaSet",
                                                                $routeParams.replicaSet,
                                                                "extensions");
                $scope.deploymentMissing = true;
                delete $scope.deployment;
                return;
              }

              $scope.breadcrumbs = BreadcrumbsService.getBreadcrumbs({
                object: $scope.replicaSet,
                displayName: '#' + DeploymentsService.getRevision($scope.replicaSet),
                parent: {
                  title: $scope.deployment.metadata.name,
                  link: Navigate.resourceURL($scope.deployment)
                },
                humanizedKind: 'Deployments'
              });

              checkActiveRevision();
              updateHPA();
            }));

            // Watch the replica sets to know if there is a deployment in progress.
            watches.push(DataService.watch({
              group: 'extensions',
              resource: 'replicasets'
            }, context, function(replicaSets) {
              var deploymentSelector = new LabelSelector($scope.deployment.spec.selector);
              inProgressDeployment = false;

              // See if there is more than one replica set that matches the
              // deployment selector with active replicas.
              var numActive = 0;
              _.each(replicaSets.by('metadata.name'), function(replicaSet) {
                if (!replicaSet.status.replicas) {
                  return;
                }

                if (!deploymentSelector.covers(new LabelSelector(replicaSet.spec.selector))) {
                  return;
                }

                numActive++;

                if (numActive > 1) {
                  inProgressDeployment = true;

                  // Stop looping.
                  return false;
                }
              });
            }));
          });
        };

        // Get the image stream image for the replica set or replication
        // controller we're showing to fill out the pod template details.
        var getImageStreamImage = function() {
          if (_.isEmpty(imageStreamImageRefByDockerReference)) {
            return;
          }

          var podTemplate = _.get($scope, 'replicaSet.spec.template');
          if (!podTemplate) {
            return;
          }

          ImageStreamResolver.fetchReferencedImageStreamImages([ podTemplate ],
                                                               $scope.imagesByDockerReference,
                                                               imageStreamImageRefByDockerReference,
                                                               context);
        };

        DataService.get($scope.resource, $routeParams.replicaSet, context).then(
          // success
          function(replicaSet) {
            $scope.loaded = true;
            $scope.replicaSet = replicaSet;
            setLogVars(replicaSet);
            switch (kind) {
            case 'ReplicationController':
              updateDC(replicaSet);
              break;
            case 'ReplicaSet':
              updateDeployment();
              break;
            }
            updateHPAWarnings();

            $scope.breadcrumbs = BreadcrumbsService.getBreadcrumbs({ object: replicaSet });

            // If we found the item successfully, watch for changes on it
            watches.push(DataService.watchObject($scope.resource, $routeParams.replicaSet, context, function(replicaSet, action) {
              if (action === "DELETED") {
                $scope.alerts["deleted"] = {
                  type: "warning",
                  message: "This " + displayKind + " has been deleted."
                };
              }
              $scope.replicaSet = replicaSet;

              if (!$scope.forms.envForm || $scope.forms.envForm.$pristine) {
                copyDeploymentAndEnsureEnv(replicaSet);
              } else {
                $scope.alerts["background_update"] = {
                  type: "warning",
                  message: "This " + displayKind + " has been updated in the background. Saving your changes may create a conflict or cause loss of data.",
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

              setLogVars(replicaSet);
              updateHPAWarnings();
              getImageStreamImage();
            }));

            if ($scope.deploymentConfigName) {
              // Check if we're the active deployment to enable or disable scaling.
              watchActiveDeployment();
            }

            $scope.$watch('replicaSet.spec.selector', function() {
              selector = new LabelSelector($scope.replicaSet.spec.selector);
              updatePodsForDeployment();
            }, true);

            watches.push(DataService.watch("pods", context, function(podData) {
              pods = podData.by('metadata.name');
              updatePodsForDeployment();
            }));
          },
          // failure
          function(e) {
            $scope.loaded = true;
            $scope.alerts["load"] = {
              type: "error",
              message: "The " + displayKind + " details could not be loaded.",
              details: "Reason: " + $filter('getErrorDetails')(e)
            };
            $scope.breadcrumbs = BreadcrumbsService.getBreadcrumbs({
              name: $routeParams.replicaSet,
              kind: kind,
              namespace: $routeParams.project
            });
          }
        );

        watches.push(DataService.watch($scope.resource, context, function(replicaSets, action, replicaSet) {
          $scope.replicaSets = replicaSets.by("metadata.name");
          $scope.emptyMessage = "No deployments to show";
          if (kind === 'ReplicationController') {
            $scope.deploymentsByDeploymentConfig = DeploymentsService.associateDeploymentsToDeploymentConfig($scope.replicaSets);
          }

          var deploymentConfigName;
          var rsName;
          if (replicaSet) {
            deploymentConfigName = annotation(replicaSet, 'deploymentConfig');
            rsName = replicaSet.metadata.name;
          }
          if (!action) {
            // Loading of the page that will create deploymentConfigDeploymentsInProgress structure, which will associate running deployment to his deploymentConfig.
            $scope.deploymentConfigDeploymentsInProgress = DeploymentsService.associateRunningDeploymentToDeploymentConfig($scope.deploymentsByDeploymentConfig);
          } else if (action === 'ADDED' || (action === 'MODIFIED' && ['New', 'Pending', 'Running'].indexOf($filter('deploymentStatus')(replicaSet)) > -1)) {
            // When new deployment id instantiated/cloned, or in case of a retry, associate him to his deploymentConfig and add him into deploymentConfigDeploymentsInProgress structure.
            $scope.deploymentConfigDeploymentsInProgress[deploymentConfigName] = $scope.deploymentConfigDeploymentsInProgress[deploymentConfigName] || {};
            $scope.deploymentConfigDeploymentsInProgress[deploymentConfigName][rsName] = replicaSet;
          } else if (action === 'MODIFIED') {
            // After the deployment ends remove him from the deploymentConfigDeploymentsInProgress structure.
            var status = $filter('deploymentStatus')(replicaSet);
            if (status === "Complete" || status === "Failed"){
              delete $scope.deploymentConfigDeploymentsInProgress[deploymentConfigName][rsName];
            }
          }

          // Extract the causes from the encoded deployment config
          if (replicaSet) {
            if (action !== "DELETED") {
              replicaSet.causes = $filter('deploymentCauses')(replicaSet);
            }
          }
          else {
            angular.forEach($scope.replicaSets, function(replicaSet) {
              replicaSet.causes = $filter('deploymentCauses')(replicaSet);
            });
          }
        }));

        // Sets up subscription for imageStreams
        watches.push(DataService.watch("imagestreams", context, function(imageStreamData) {
          var imageStreams = imageStreamData.by('metadata.name');
          ImageStreamResolver.buildDockerRefMapForImageStreams(imageStreams, imageStreamImageRefByDockerReference);
          getImageStreamImage();
          Logger.log("imagestreams (subscribe)", imageStreams);
        }));

        watches.push(DataService.watch("builds", context, function(builds) {
          $scope.builds = builds.by("metadata.name");
          Logger.log("builds (subscribe)", $scope.builds);
        }));

        watches.push(DataService.watch({
          group: "extensions",
          resource: "horizontalpodautoscalers"
        }, context, function(data) {
          allHPA = data.by("metadata.name");
          updateHPA();
          updateHPAWarnings();
        }, {poll: limitWatches, pollInterval: 60 * 1000}));

        // List limit ranges in this project to determine if there is a default
        // CPU request for autoscaling.
        DataService.list("limitranges", context, function(response) {
          limitRanges = response.by("metadata.name");
          updateHPAWarnings();
        });

        $scope.retryFailedDeployment = function(replicaSet) {
          DeploymentsService.retryFailedDeployment(replicaSet, context, $scope);
        };

        $scope.rollbackToDeployment = function(replicaSet, changeScaleSettings, changeStrategy, changeTriggers) {
          DeploymentsService.rollbackToDeployment(replicaSet, changeScaleSettings, changeStrategy, changeTriggers, context, $scope);
        };

        $scope.cancelRunningDeployment = function(replicaSet) {
          DeploymentsService.cancelRunningDeployment(replicaSet, context, $scope);
        };

        $scope.scale = function(replicas) {
          var showScalingError = function(result) {
            $scope.alerts = $scope.alerts || {};
            $scope.alerts["scale"] = {
              type: "error",
              message: "An error occurred scaling.",
              details: $filter('getErrorDetails')(result)
            };
          };

          var scaleTarget = $scope.deployment || $scope.deploymentConfig || $scope.replicaSet;
          DeploymentsService.scale(scaleTarget, replicas).then(_.noop, showScalingError);
        };

        var hasDeploymentConfig = $filter('hasDeploymentConfig');
        $scope.isScalable = function() {
          if (!_.isEmpty($scope.autoscalers)) {
            return false;
          }

          if (!hasDeploymentConfig($scope.replicaSet) && !hasDeployment($scope.replicaSet)) {
            return true;
          }

          if ($scope.deploymentConfigMissing || $scope.deploymentMissing) {
            return true;
          }

          if (!$scope.deploymentConfig && !$scope.deployment) {
            // Wait for deployment config or deployment to load.
            return false;
          }

          return $scope.isActive && !inProgressDeployment;
        };

        $scope.removeVolume = function(volume) {
          var details = "This will remove the volume from the " + $filter('humanizeKind')($scope.replicaSet.kind) + ".";
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
              .removeVolume($scope.replicaSet, volume, context)
              .then(_.noop, showError);
          };

          confirm.then(removeVolume);
        };

        $scope.$on('$destroy', function(){
          DataService.unwatchAll(watches);
        });
    }));
  });
