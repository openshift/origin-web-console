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
                        APIService,
                        AuthorizationService,
                        BreadcrumbsService,
                        DataService,
                        DeploymentsService,
                        HPAService,
                        ImageStreamResolver,
                        keyValueEditorUtils,
                        kind,
                        Logger,
                        MetricsService,
                        ModalsService,
                        Navigate,
                        OwnerReferencesService,
                        PodsService,
                        ProjectsService,
                        StorageService) {
    var hasDC = false;

    var annotation = $filter('annotation');
    var displayKind = $filter('humanizeKind')(kind);
    var hasDeployment = $filter('hasDeployment');

    var buildsVersion = APIService.getPreferredVersion('builds');
    var imageStreamsVersion = APIService.getPreferredVersion('imagestreams');
    var horizontalPodAutoscalersVersion = APIService.getPreferredVersion('horizontalpodautoscalers');
    var limitRangesVersion = APIService.getPreferredVersion('limitranges');
    var podsVersion = APIService.getPreferredVersion('pods');
    var replicaSetsVersion = APIService.getPreferredVersion('replicasets');
    var replicationControllersVersion = APIService.getPreferredVersion('replicationcontrollers');
    var resourceQuotasVersion = APIService.getPreferredVersion('resourcequotas');
    var appliedClusterResourceQuotasVersion = APIService.getPreferredVersion('appliedclusterresourcequotas');

    switch (kind) {
    case 'ReplicaSet':
      $scope.resource = replicaSetsVersion;
      $scope.healthCheckURL = Navigate.healthCheckURL($routeParams.project,
                                                      "ReplicaSet",
                                                      $routeParams.replicaSet,
                                                      "extensions");
      break;
    case 'ReplicationController':
      $scope.resource = replicationControllersVersion;
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

    $scope.deploymentsVersion = APIService.getPreferredVersion('deployments');
    $scope.deploymentConfigsVersion = APIService.getPreferredVersion('deploymentconfigs');
    $scope.eventsVersion = APIService.getPreferredVersion('events');
    // TODO: update common/constants/apiPreferredVersions for this
    $scope.deploymentConfigsLogVersion = 'deploymentconfigs/log';

    var watches = [];

    // Check if the metrics service is available so we know when to show the tab.
    MetricsService.isAvailable().then(function(available) {
      $scope.metricsAvailable = available;
    });

    var deploymentStatus = $filter('deploymentStatus');

    var setLogVars = function(replicaSet) {
      $scope.logCanRun = !(_.includes(['New', 'Pending'], deploymentStatus(replicaSet)));
    };

    var limitWatches = $filter('isIE')();

    ProjectsService
      .get($routeParams.project)
      .then(_.spread(function(project, context) {
        $scope.project = project;
        // FIXME: DataService.createStream() requires a scope with a
        // projectPromise rather than just a namespace, so we have to pass the
        // context into the log-viewer directive.
        $scope.projectContext = context;

        var allHPA = {};
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

        var updateHPAWarnings = function() {
            HPAService.getHPAWarnings($scope.replicaSet, $scope.autoscalers, $scope.limitRanges, project)
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
          DataService.get($scope.deploymentConfigsVersion, dcName, context, {
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
                details: $filter('getErrorDetails')(e)
              };
            }
          );
        };

        var checkActiveRevision = function() {
          $scope.isActive = DeploymentsService.isActiveReplicaSet($scope.replicaSet, $scope.deployment);
        };

        var hasInProgressRollout = function(replicaSets) {
          // See if there is any other replica set owned by the deployment with active pods.
          return _.some(replicaSets, function(replicaSet) {
            // Check if the replica set has pods.
            if (!_.get(replicaSet, 'status.replicas')) {
              return;
            }

            // Check if it's the same replica set we're viewing.
            if (_.get(replicaSet, 'metadata.uid') === _.get($scope.replicaSet, 'metadata.uid')) {
              return;
            }

            // Check if it's owned by same deployment.
            var controllerReferences = OwnerReferencesService.getControllerReferences(replicaSet);
            return _.some(controllerReferences, { uid: $scope.deployment.metadata.uid });
          });
        };

        var rolloutInProgress = false;
        var updateDeployment = function() {
          var controllerRefs = OwnerReferencesService.getControllerReferences($scope.replicaSet);
          var deploymentRef = _.find(controllerRefs, { kind: 'Deployment' });
          if (!deploymentRef) {
            return;
          }

          DataService.get($scope.deploymentsVersion, deploymentRef.name, context).then(function(deployment) {
            $scope.deployment = deployment;
            $scope.healthCheckURL = Navigate.healthCheckURL($routeParams.project,
                                                            "Deployment",
                                                            deployment.metadata.name,
                                                            "apps");

            watches.push(DataService.watchObject($scope.deploymentsVersion, deployment.metadata.name, context, function(deployment, action) {
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

              $scope.deployment = deployment;
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
            watches.push(DataService.watch(replicaSetsVersion, context, function(replicaSetData) {
              var replicaSets = replicaSetData.by('metadata.name');
              rolloutInProgress = hasInProgressRollout(replicaSets);
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

        DataService.get($scope.resource, $routeParams.replicaSet, context, { errorNotification: false })
          .then(function(replicaSet) {
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
              setLogVars(replicaSet);
              updateHPAWarnings();
              getImageStreamImage();

              if ($scope.deployment) {
                checkActiveRevision();
              }
            }));

            if ($scope.deploymentConfigName) {
              // Check if we're the active deployment to enable or disable scaling.
              watchActiveDeployment();
            }

            watches.push(DataService.watch(podsVersion, context, function(podData) {
              var pods = podData.by('metadata.name');
              $scope.podsForDeployment = PodsService.filterForOwner(pods, $scope.replicaSet);
            }));
          }, function(e) {
            $scope.loaded = true;
            $scope.alerts["load"] = {
              type: "error",
              message: "The " + displayKind + " details could not be loaded.",
              details: $filter('getErrorDetails')(e)
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
          if (kind === 'ReplicationController') {
            $scope.deploymentsByDeploymentConfig = DeploymentsService.associateDeploymentsToDeploymentConfig($scope.replicaSets);
          }

          var deploymentConfigName;
          var rsName;
          if (replicaSet) {
            deploymentConfigName = annotation(replicaSet, 'deploymentConfig');
            rsName = replicaSet.metadata.name;
          }
          $scope.deploymentConfigDeploymentsInProgress = $scope.deploymentConfigDeploymentsInProgress || {};
          if (!action) {
            // Loading of the page that will create deploymentConfigDeploymentsInProgress structure, which will associate running deployment to his deploymentConfig.
            $scope.deploymentConfigDeploymentsInProgress = DeploymentsService.associateRunningDeploymentToDeploymentConfig($scope.deploymentsByDeploymentConfig);
          } else if (action === 'ADDED' || (action === 'MODIFIED' && $filter('deploymentIsInProgress')(replicaSet))) {
            // When new deployment id instantiated/cloned, or in case of a retry, associate him to his deploymentConfig and add him into deploymentConfigDeploymentsInProgress structure.
            $scope.deploymentConfigDeploymentsInProgress[deploymentConfigName] = $scope.deploymentConfigDeploymentsInProgress[deploymentConfigName] || {};
            $scope.deploymentConfigDeploymentsInProgress[deploymentConfigName][rsName] = replicaSet;
          } else if (action === 'MODIFIED') {
            // After the deployment ends remove him from the deploymentConfigDeploymentsInProgress structure.
            if($scope.deploymentConfigDeploymentsInProgress[deploymentConfigName]) {
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
        watches.push(DataService.watch(imageStreamsVersion, context, function(imageStreamData) {
          var imageStreams = imageStreamData.by('metadata.name');
          ImageStreamResolver.buildDockerRefMapForImageStreams(imageStreams, imageStreamImageRefByDockerReference);
          getImageStreamImage();
          Logger.log("imagestreams (subscribe)", imageStreams);
        }));

        watches.push(DataService.watch(buildsVersion, context, function(builds) {
          $scope.builds = builds.by("metadata.name");
          Logger.log("builds (subscribe)", $scope.builds);
        }));

        watches.push(DataService.watch(horizontalPodAutoscalersVersion, context, function(data) {
          allHPA = data.by("metadata.name");
          updateHPA();
          updateHPAWarnings();
        }, {poll: limitWatches, pollInterval: 60 * 1000}));

        // List limit ranges in this project to determine if there is a default
        // CPU request for autoscaling.
        DataService.list(limitRangesVersion, context).then(function(resp) {
          $scope.limitRanges = resp.by("metadata.name");
          updateHPAWarnings();
        });

        // Watch quotas and cluster quotas to warn about problems in the deployment donut.
        var QUOTA_POLL_INTERVAL = 60 * 1000;
        watches.push(DataService.watch(resourceQuotasVersion, context, function(quotaData) {
          $scope.quotas = quotaData.by("metadata.name");
        }, {poll: true, pollInterval: QUOTA_POLL_INTERVAL}));

        watches.push(DataService.watch(appliedClusterResourceQuotasVersion, context, function(clusterQuotaData) {
          $scope.clusterQuotas = clusterQuotaData.by("metadata.name");
        }, {poll: true, pollInterval: QUOTA_POLL_INTERVAL}));

        var deploymentIsLatest = $filter('deploymentIsLatest');

        $scope.showRollbackAction = function() {
          return deploymentStatus($scope.replicaSet) === 'Complete' &&
            !deploymentIsLatest($scope.replicaSet, $scope.deploymentConfig) &&
            !$scope.replicaSet.metadata.deletionTimestamp &&
            AuthorizationService.canI('deploymentconfigrollbacks', 'create');
        };

        $scope.retryFailedDeployment = function(replicaSet) {
          DeploymentsService.retryFailedDeployment(replicaSet, context, $scope);
        };

        $scope.rollbackToDeployment = function(replicaSet, changeScaleSettings, changeStrategy, changeTriggers) {
          DeploymentsService.rollbackToDeployment(replicaSet, changeScaleSettings, changeStrategy, changeTriggers, context, $scope);
        };

        $scope.cancelRunningDeployment = function(replicaSet) {
          DeploymentsService.cancelRunningDeployment(replicaSet, context);
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

          return $scope.isActive && !rolloutInProgress;
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
            title: "Remove volume " + volume.name + "?",
            details: details,
            okButtonText: "Remove",
            okButtonClass: "btn-danger",
            cancelButtonText: "Cancel"
          });

          var removeVolume = function() {
            StorageService.removeVolume($scope.replicaSet, volume, context);
          };

          confirm.then(removeVolume);
        };

        $scope.$on('$destroy', function(){
          DataService.unwatchAll(watches);
        });
    }));
  });
