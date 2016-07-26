'use strict';

/**
 * @ngdoc function
 * @name openshiftConsole.controller:DeploymentController
 * @description
 * Controller of the openshiftConsole
 */
angular.module('openshiftConsole')
  .controller('DeploymentController',
              function ($scope,
                        $filter,
                        $routeParams,
                        AlertMessageService,
                        DataService,
                        HPAService,
                        MetricsService,
                        ProjectsService,
                        DeploymentsService,
                        ImageStreamResolver,
                        Navigate,
                        gettextCatalog) {
    $scope.projectName = $routeParams.project;
    $scope.deployment = null;
    $scope.deploymentConfig = null;
    $scope.deploymentConfigMissing = false;
    $scope.deployments = {};
    $scope.podTemplates = {};
    $scope.imageStreams = {};
    $scope.imagesByDockerReference = {};
    $scope.imageStreamImageRefByDockerReference = {}; // lets us determine if a particular container's docker image reference belongs to an imageStream
    $scope.builds = {};
    $scope.alerts = {};
    $scope.renderOptions = $scope.renderOptions || {};
    $scope.renderOptions.hideFilterWidget = true;
    $scope.breadcrumbs = [
      {
        title: gettextCatalog.getString("Deployments"),
        link: "project/" + $routeParams.project + "/browse/deployments"
      }
    ];

    // if this is an RC it won't have deploymentconfig
    if ($routeParams.deploymentconfig){
      $scope.breadcrumbs.push({
        title: $routeParams.deploymentconfig,
        link: "project/" + $routeParams.project + "/browse/deployments/" + $routeParams.deploymentconfig
      });
      $scope.healthCheckURL = Navigate.healthCheckURL($routeParams.project,
                                                      "DeploymentConfig",
                                                      $routeParams.deploymentconfig);
    } else {
      $scope.healthCheckURL = Navigate.healthCheckURL($routeParams.project,
                                                      "ReplicationController",
                                                      $routeParams.replicationcontroller);
    }

    $scope.breadcrumbs.push({
      title: $routeParams.deployment || $routeParams.replicationcontroller
    });

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
      $scope.logOptions.container = $filter("annotation")(deployment, "pod");
      $scope.logCanRun = !(_.includes(['New', 'Pending'], $filter('deploymentStatus')(deployment)));
    };

    ProjectsService
      .get($routeParams.project)
      .then(_.spread(function(project, context) {
        $scope.project = project;
        // FIXME: DataService.createStream() requires a scope with a
        // projectPromise rather than just a namespace, so we have to pass the
        // context into the log-viewer directive.
        $scope.projectContext = context;

        var watchActiveDeployment = function() {
          // Watch all replication controllers so we know if this is the active deployment to enable scaling.
          watches.push(DataService.watch("replicationcontrollers", context, function(deployments) {
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

        var allHPA = {}, limitRanges = {};
        function updateHPA() {
          $scope.hpaForRC = HPAService.hpaForRC(allHPA, $routeParams.deployment || $routeParams.replicationcontroller);
          if ($scope.isActive) {
            // Show both HPAs that target the RC and the DC if this is the active deployment.
            var hpaForDC = HPAService.hpaForDC(allHPA, $routeParams.deploymentconfig);
            $scope.autoscalers = $scope.hpaForRC.concat(hpaForDC);
          } else {
            $scope.autoscalers = $scope.hpaForRC;
          }
        }
        var updateHPAWarnings = function() {
            HPAService.getHPAWarnings($scope.deployment, $scope.autoscalers, limitRanges, project)
                      .then(function(warnings) {
              $scope.hpaWarnings = warnings;
            });
        };

        DataService.get("replicationcontrollers", $routeParams.deployment || $routeParams.replicationcontroller, context).then(
          // success
          function(deployment) {
            $scope.loaded = true;
            $scope.deployment = deployment;
            setLogVars(deployment);
            updateHPAWarnings();
            var deploymentVersion = $filter("annotation")(deployment, "deploymentVersion");
            if (deploymentVersion) {
              $scope.breadcrumbs[2].title = "#" + deploymentVersion;
              $scope.logOptions.version = deploymentVersion;
            }
            $scope.deploymentConfigName = $filter("annotation")(deployment, "deploymentConfig");
            // If we found the item successfully, watch for changes on it
            watches.push(DataService.watchObject("replicationcontrollers", $routeParams.deployment || $routeParams.replicationcontroller, context, function(deployment, action) {
              if (action === "DELETED") {
                $scope.alerts["deleted"] = {
                  type: "warning",
                  message: $routeParams.deployment ? gettextCatalog.getString("This deployment has been deleted.") : gettextCatalog.getString("This replication controller has been deleted.")
                };
              }
              $scope.deployment = deployment;
              setLogVars(deployment);
              updateHPAWarnings();
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
              message: $routeParams.deployment ? gettextCatalog.getString("The deployment details could not be loaded.") : gettextCatalog.getString("The replication controller details could not be loaded."),
              details: "Reason: " + $filter('getErrorDetails')(e)
            };
          }
        );

        if ($routeParams.deploymentconfig) {
          DataService.get("deploymentconfigs", $routeParams.deploymentconfig, context, {
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
                message: gettextCatalog.getString("The deployment configuration details could not be loaded."),
                details: gettextCatalog.getString("Reason: ") + $filter('getErrorDetails')(e)
              };
            }
          );
        }


        function extractPodTemplates() {
          angular.forEach($scope.deployments, function(deployment, deploymentId){
            $scope.podTemplates[deploymentId] = deployment.spec.template;
          });
        }

        watches.push(DataService.watch("replicationcontrollers", context, function(deployments, action, deployment) {
          $scope.deployments = deployments.by("metadata.name");
          extractPodTemplates();
          ImageStreamResolver.fetchReferencedImageStreamImages($scope.podTemplates, $scope.imagesByDockerReference, $scope.imageStreamImageRefByDockerReference, context);
          $scope.emptyMessage = gettextCatalog.getString("No deployments to show");
          $scope.deploymentsByDeploymentConfig = DeploymentsService.associateDeploymentsToDeploymentConfig($scope.deployments);

          var deploymentConfigName;
          var deploymentName;
          if (deployment) {
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
        watches.push(DataService.watch("imagestreams", context, function(imageStreams) {
          $scope.imageStreams = imageStreams.by("metadata.name");
          ImageStreamResolver.buildDockerRefMapForImageStreams($scope.imageStreams, $scope.imageStreamImageRefByDockerReference);
          ImageStreamResolver.fetchReferencedImageStreamImages($scope.podTemplates, $scope.imagesByDockerReference, $scope.imageStreamImageRefByDockerReference, context);
          Logger.log("imagestreams (subscribe)", $scope.imageStreams);
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
        }));

        // List limit ranges in this project to determine if there is a default
        // CPU request for autoscaling.
        DataService.list("limitranges", context, function(response) {
          limitRanges = response.by("metadata.name");
          updateHPAWarnings();
        });

        $scope.startLatestDeployment = function(deploymentConfig) {
          DeploymentsService.startLatestDeployment(deploymentConfig, context, $scope);
        };

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

          if ($scope.deploymentConfig) {
            DeploymentsService.scaleDC($scope.deploymentConfig, replicas).then(_.noop, showScalingError);
          } else {
            DeploymentsService.scaleRC($scope.deployment, replicas).then(_.noop, showScalingError);
          }
        };

        var isDeployment = $filter('isDeployment');
        $scope.isScalable = function() {
          if (!_.isEmpty($scope.autoscalers)) {
            return true;
          }

          if (!isDeployment($scope.deployment)) {
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
