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
                        APIService,
                        BreadcrumbsService,
                        DataService,
                        DeploymentsService,
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
    $scope.deploymentConfigsInstantiateVersion = APIService.getPreferredVersion('deploymentconfigs/instantiate');
    $scope.deploymentConfigsVersion = APIService.getPreferredVersion('deploymentconfigs');
    $scope.eventsVersion = APIService.getPreferredVersion('events');
    $scope.horizontalPodAutoscalersVersion = APIService.getPreferredVersion('horizontalpodautoscalers');

    var buildsVersion = APIService.getPreferredVersion('builds');
    var imageStreamsVersion = APIService.getPreferredVersion('imagestreams');
    var limitRangesVersion = APIService.getPreferredVersion('limitranges');
    var replicationControllersVersion = APIService.getPreferredVersion('replicationcontrollers');

    $scope.healthCheckURL = Navigate.healthCheckURL($routeParams.project,
                                                    "DeploymentConfig",
                                                    $routeParams.deploymentconfig,
                                                    $scope.deploymentConfigsVersion.group);

    var mostRecent = $filter('mostRecent');
    var orderByDate = $filter('orderObjectsByDate');

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

        DataService.get($scope.deploymentConfigsVersion, $routeParams.deploymentconfig, context, { errorNotification: false }).then(
          // success
          function(deploymentConfig) {
            $scope.loaded = true;
            $scope.deploymentConfig = deploymentConfig;
            $scope.strategyParams = $filter('deploymentStrategyParams')(deploymentConfig);
            updateHPAWarnings();
            // If we found the item successfully, watch for changes on it
            watches.push(DataService.watchObject($scope.deploymentConfigsVersion, $routeParams.deploymentconfig, context, function(deploymentConfig, action) {
              if (action === "DELETED") {
                $scope.alerts["deleted"] = {
                  type: "warning",
                  message: "This deployment configuration has been deleted."
                };
              }
              $scope.deploymentConfig = deploymentConfig;
              $scope.updatingPausedState = false;
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
              details: e.status === 404 ? "Any remaining deployment history for this deployment will be shown." : $filter('getErrorDetails')(e)
            };
          }
        );

        watches.push(DataService.watch(replicationControllersVersion, context, function(deployments, action, deployment) {
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
        DataService.list(limitRangesVersion, context).then(function(resp) {
          limitRanges = resp.by("metadata.name");
          updateHPAWarnings();
        });

        watches.push(DataService.watch(imageStreamsVersion, context, function(imageStreamData) {
          var imageStreams = imageStreamData.by("metadata.name");
          ImageStreamResolver.buildDockerRefMapForImageStreams(imageStreams, imageStreamImageRefByDockerReference);
          // If the dep config has been loaded already
          if ($scope.deploymentConfig) {
            ImageStreamResolver.fetchReferencedImageStreamImages([$scope.deploymentConfig.spec.template], $scope.imagesByDockerReference, imageStreamImageRefByDockerReference, context);
          }
          Logger.log("imagestreams (subscribe)", $scope.imageStreams);
        }));

        watches.push(DataService.watch(buildsVersion, context, function(builds) {
          $scope.builds = builds.by("metadata.name");
          Logger.log("builds (subscribe)", $scope.builds);
        }));

        watches.push(DataService.watch($scope.horizontalPodAutoscalersVersion, context, function(hpa) {
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
            DeploymentsService.startLatestDeployment($scope.deploymentConfig, context);
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
            title: "Remove volume " + volume.name + "?",
            details: details,
            okButtonText: "Remove",
            okButtonClass: "btn-danger",
            cancelButtonText: "Cancel"
          });

          var removeVolume = function() {
            StorageService.removeVolume($scope.deploymentConfig, volume, context);
          };

          confirm.then(removeVolume);
        };

        $scope.$on('$destroy', function(){
          DataService.unwatchAll(watches);
        });
    }));
  });
