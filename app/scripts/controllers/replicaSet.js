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
                        HPAService,
                        MetricsService,
                        ProjectsService,
                        DeploymentsService,
                        ImageStreamResolver,
                        Navigate,
                        keyValueEditorUtils,
                        kind) {
    var hasDC = false;
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
    // Either a ReplicaSet or a ReplicaSetController
    // TODO: Rename scope var to avoid confusion with k8s deployments.
    $scope.deployment = null;
    $scope.deploymentConfig = null;
    $scope.deploymentConfigMissing = false;
    $scope.deployments = {};
    $scope.imagesByDockerReference = {};
    $scope.builds = {};
    $scope.alerts = {};
    $scope.renderOptions = $scope.renderOptions || {};
    $scope.renderOptions.hideFilterWidget = true;
    $scope.forms = {};

    // Check for a ?tab=<name> query param to allow linking directly to a tab.
    if ($routeParams.tab) {
      $scope.selectedTab = {};
      $scope.selectedTab[$routeParams.tab] = true;
    }

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

    var setLogVars = function(deployment) {
      $scope.logCanRun = !(_.includes(['New', 'Pending'], $filter('deploymentStatus')(deployment)));
    };

    var copyDeploymentAndEnsureEnv = function(deployment) {
      $scope.updatedDeployment = angular.copy(deployment);
      _.each($scope.updatedDeployment.spec.template.spec.containers, function(container) {
        container.env = container.env || [];
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
            message: $scope.deployment.metadata.name + " was updated."
          };
          $scope.forms.envForm.$setPristine();
        }, function(e) {
          $scope.alerts['saveEnvError'] = {
            type: "error",
            message: $scope.deployment.metadata.name + " was not updated.",
            details: "Reason: " + $filter('getErrorDetails')(e)
          };
        });
    };

    $scope.clearEnvVarUpdates = function() {
      copyDeploymentAndEnsureEnv($scope.deployment);
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
          if ($scope.isActive) {
            // Show both HPAs that target the RC and the DC if this is the active deployment.
            var hpaForDC = HPAService.filterHPA(allHPA, 'DeploymentConfig', $scope.deploymentConfigName);
            $scope.autoscalers = $scope.hpaForRS.concat(hpaForDC);
          } else {
            $scope.autoscalers = $scope.hpaForRS;
          }
        };

        var watchActiveDeployment = function() {
          // Watch all replication controllers so we know if this is the active deployment to enable scaling.
          watches.push(DataService.watch($scope.resource, context, function(deployments) {
            var activeDeployment,
                deploymentsForConfig = [],
                getAnnotation = $filter("annotation");
            // Filter the list to just those deployments for this config.
            angular.forEach(deployments.by("metadata.name"), function(deployment) {
              var depConfigName = getAnnotation(deployment, 'deploymentConfig') || "";
              if (depConfigName === $scope.deploymentConfigName) {
                deploymentsForConfig.push(deployment);
              }
            });
            activeDeployment = DeploymentsService.getActiveDeployment(deploymentsForConfig);
            $scope.isActive = activeDeployment && activeDeployment.metadata.uid === $scope.deployment.metadata.uid;
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
            HPAService.getHPAWarnings($scope.deployment, $scope.autoscalers, limitRanges, project)
                      .then(function(warnings) {
              $scope.hpaWarnings = warnings;
            });
        };

        // TODO: Handle replica sets owned by k8s deployments.
        var updateDC = function(rc) {
          var dcName = $filter("annotation")(rc, "deploymentConfig");
          if (!dcName) {
            return;
          }

          hasDC = true;
          $scope.deploymentConfigName = dcName;

          var deploymentVersion = $filter("annotation")(rc, "deploymentVersion");
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

        // Get the image stream image for the replica set or replication
        // controller we're showing to fill out the pod template details.
        var getImageStreamImage = function() {
          if (_.isEmpty(imageStreamImageRefByDockerReference)) {
            return;
          }

          var podTemplate = _.get($scope, 'deployment.spec.template');
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
          function(deployment) {
            $scope.loaded = true;
            $scope.deployment = deployment;
            setLogVars(deployment);
            updateDC(deployment);
            updateHPAWarnings();

            $scope.breadcrumbs = BreadcrumbsService.getBreadcrumbs({ object: deployment });

            // If we found the item successfully, watch for changes on it
            watches.push(DataService.watchObject($scope.resource, $routeParams.replicaSet, context, function(deployment, action) {
              if (action === "DELETED") {
                $scope.alerts["deleted"] = {
                  type: "warning",
                  message: "This " + displayKind + " has been deleted."
                };
              }
              $scope.deployment = deployment;

              if (!$scope.forms.envForm || $scope.forms.envForm.$pristine) {
                copyDeploymentAndEnsureEnv(deployment);
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

              setLogVars(deployment);
              updateHPAWarnings();
              getImageStreamImage();
            }));

            if ($scope.deploymentConfigName) {
              // Check if we're the active deployment to enable or disable scaling.
              watchActiveDeployment();
            }

            $scope.$watch('deployment.spec.selector', function() {
              selector = new LabelSelector($scope.deployment.spec.selector);
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

        watches.push(DataService.watch($scope.resource, context, function(deployments, action, deployment) {
          $scope.deployments = deployments.by("metadata.name");
          $scope.emptyMessage = "No deployments to show";
          $scope.deploymentsByDeploymentConfig = DeploymentsService.associateDeploymentsToDeploymentConfig($scope.deployments);

          var deploymentConfigName;
          var deploymentName;
          if (deployment) {
            // TODO: Handle replica sets owned by k8s deployments
            deploymentConfigName = $filter('annotation')(deployment, 'deploymentConfig');
            deploymentName = deployment.metadata.name;
          }
          if (!action) {
            // Loading of the page that will create deploymentConfigDeploymentsInProgress structure, which will associate running deployment to his deploymentConfig.
            $scope.deploymentConfigDeploymentsInProgress = DeploymentsService.associateRunningDeploymentToDeploymentConfig($scope.deploymentsByDeploymentConfig);
          } else if (action === 'ADDED' || (action === 'MODIFIED' && ['New', 'Pending', 'Running'].indexOf($filter('deploymentStatus')(deployment)) > -1)) {
            // When new deployment id instantiated/cloned, or in case of a retry, associate him to his deploymentConfig and add him into deploymentConfigDeploymentsInProgress structure.
            $scope.deploymentConfigDeploymentsInProgress[deploymentConfigName] = $scope.deploymentConfigDeploymentsInProgress[deploymentConfigName] || {};
            $scope.deploymentConfigDeploymentsInProgress[deploymentConfigName][deploymentName] = deployment;
          } else if (action === 'MODIFIED') {
            // After the deployment ends remove him from the deploymentConfigDeploymentsInProgress structure.
            var status = $filter('deploymentStatus')(deployment);
            if (status === "Complete" || status === "Failed"){
              delete $scope.deploymentConfigDeploymentsInProgress[deploymentConfigName][deploymentName];
            }
          }

          // Extract the causes from the encoded deployment config
          if (deployment) {
            if (action !== "DELETED") {
              deployment.causes = $filter('deploymentCauses')(deployment);
            }
          }
          else {
            angular.forEach($scope.deployments, function(deployment) {
              deployment.causes = $filter('deploymentCauses')(deployment);
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

        $scope.retryFailedDeployment = function(deployment) {
          DeploymentsService.retryFailedDeployment(deployment, context, $scope);
        };

        $scope.rollbackToDeployment = function(deployment, changeScaleSettings, changeStrategy, changeTriggers) {
          DeploymentsService.rollbackToDeployment(deployment, changeScaleSettings, changeStrategy, changeTriggers, context, $scope);
        };

        $scope.cancelRunningDeployment = function(deployment) {
          DeploymentsService.cancelRunningDeployment(deployment, context, $scope);
        };

        $scope.scale = function(replicas) {
          var showScalingError = function(result) {
            $scope.alerts = $scope.alerts || {};
            $scope.alerts["scale"] = {
              type: "error",
              message: "An error occurred scaling the deployment.",
              details: $filter('getErrorDetails')(result)
            };
          };

          DeploymentsService.scale($scope.deploymentConfig || $scope.deployment, replicas).then(_.noop, showScalingError);
        };

        var hasDeploymentConfig = $filter('hasDeploymentConfig');
        $scope.isScalable = function() {
          if (!_.isEmpty($scope.autoscalers)) {
            return false;
          }

          if (!hasDeploymentConfig($scope.deployment)) {
            return true;
          }

          if ($scope.deploymentConfigMissing) {
            return true;
          }

          if (!$scope.deploymentConfig) {
            // Wait for deployment config to load.
            return false;
          }

          return $scope.isActive;
        };

        $scope.$on('$destroy', function(){
          DataService.unwatchAll(watches);
        });
    }));
  });
