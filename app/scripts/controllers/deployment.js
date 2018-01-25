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
                        APIService,
                        DataService,
                        DeploymentsService,
                        HPAService,
                        ImageStreamResolver,
                        LabelFilter,
                        Logger,
                        ModalsService,
                        Navigate,
                        OwnerReferencesService,
                        ProjectsService,
                        StorageService) {
    var imageStreamImageRefByDockerReference = {}; // lets us determine if a particular container's docker image reference belongs to an imageStream

    $scope.projectName = $routeParams.project;
    $scope.name = $routeParams.deployment;
    $scope.replicaSetsForDeployment = {};
    $scope.unfilteredReplicaSetsForDeployment  = {};
    $scope.labelSuggestions = {};
    $scope.emptyMessage = "Loading...";
    $scope.forms = {};
    $scope.alerts = {};
    $scope.imagesByDockerReference = {};
    $scope.breadcrumbs = [
      {
        title: "Deployments",
        link: "project/" + $routeParams.project + "/browse/deployments"
      },
      {
        title: $routeParams.deployment
      }
    ];
    var buildsVersion = APIService.getPreferredVersion('builds');
    var replicaSetsVersion = APIService.getPreferredVersion('replicasets');
    var limitRangesVersion = APIService.getPreferredVersion('limitranges');
    var imageStreamsVersion = APIService.getPreferredVersion('imagestreams');
    $scope.deploymentsVersion = APIService.getPreferredVersion('deployments');
    $scope.eventsVersion = APIService.getPreferredVersion('events');
    $scope.horizontalPodAutoscalersVersion = APIService.getPreferredVersion('horizontalpodautoscalers');

    $scope.healthCheckURL = Navigate.healthCheckURL($routeParams.project,
                                                    "Deployment",
                                                    $routeParams.deployment,
                                                    $scope.deploymentsVersion.group);
    var watches = [];

    ProjectsService
      .get($routeParams.project)
      .then(_.spread(function(project, context) {
        $scope.project = project;
        $scope.projectContext = context;

        var limitRanges = {};

        var updateHPAWarnings = function() {
            HPAService.getHPAWarnings($scope.deployment, $scope.autoscalers, limitRanges, project)
                      .then(function(warnings) {
              $scope.hpaWarnings = warnings;
            });
        };

        DataService.get($scope.deploymentsVersion, $routeParams.deployment, context, { errorNotification: false }).then(
          // success
          function(deployment) {
            $scope.loaded = true;
            $scope.deployment = deployment;
            updateHPAWarnings();

            // If we found the item successfully, watch for changes on it
            watches.push(DataService.watchObject($scope.deploymentsVersion, $routeParams.deployment, context, function(deployment, action) {
              if (action === "DELETED") {
                $scope.alerts["deleted"] = {
                  type: "warning",
                  message: "This deployment has been deleted."
                };
              }

              $scope.deployment = deployment;
              $scope.updatingPausedState = false;
              updateHPAWarnings();
              ImageStreamResolver.fetchReferencedImageStreamImages([deployment.spec.template], $scope.imagesByDockerReference, imageStreamImageRefByDockerReference, context);
            }));

            // Watch replica sets for this deployment
            watches.push(DataService.watch(replicaSetsVersion, context, function(replicaSetData) {
              $scope.emptyMessage = "No deployments to show";

              var replicaSets = replicaSetData.by('metadata.name');
              replicaSets = OwnerReferencesService.filterForController(replicaSets, deployment);

              $scope.inProgressDeployment = _.chain(replicaSets).filter('status.replicas').length > 1;

              $scope.unfilteredReplicaSetsForDeployment = DeploymentsService.sortByRevision(replicaSets);
              $scope.replicaSetsForDeployment = LabelFilter.getLabelSelector().select($scope.unfilteredReplicaSetsForDeployment);

              updateFilterWarning();
              LabelFilter.addLabelSuggestionsFromResources($scope.unfilteredReplicaSetsForDeployment, $scope.labelSuggestions);
              LabelFilter.setLabelSuggestions($scope.labelSuggestions);
            }));
          },
          // failure
          function(e) {
            $scope.loaded = true;
            $scope.alerts["load"] = {
              type: "error",
              message: e.status === 404 ? "This deployment can not be found, it may have been deleted." : "The deployment details could not be loaded.",
              details: $filter('getErrorDetails')(e)
            };
          }
        );

        // List limit ranges in this project to determine if there is a default
        // CPU request for autoscaling.
        DataService.list(limitRangesVersion, context).then(function(response) {
          limitRanges = response.by("metadata.name");
          updateHPAWarnings();
        });

        watches.push(DataService.watch(imageStreamsVersion, context, function(imageStreamData) {
          var imageStreams = imageStreamData.by("metadata.name");
          ImageStreamResolver.buildDockerRefMapForImageStreams(imageStreams, imageStreamImageRefByDockerReference);
          // If the deployment has been loaded already
          if ($scope.deployment) {
            ImageStreamResolver.fetchReferencedImageStreamImages([$scope.deployment.spec.template], $scope.imagesByDockerReference, imageStreamImageRefByDockerReference, context);
          }
          Logger.log("imagestreams (subscribe)", $scope.imageStreams);
        }));

        watches.push(DataService.watch($scope.horizontalPodAutoscalersVersion, context, function(hpa) {
          $scope.autoscalers =
            HPAService.filterHPA(hpa.by("metadata.name"), 'Deployment', $routeParams.deployment);
          updateHPAWarnings();
        }));

        watches.push(DataService.watch(buildsVersion, context, function(builds) {
          $scope.builds = builds.by("metadata.name");
          Logger.log("builds (subscribe)", $scope.builds);
        }));

        function updateFilterWarning() {
          if (!LabelFilter.getLabelSelector().isEmpty() && _.isEmpty($scope.replicaSetsForDeployment) && !_.isEmpty($scope.unfilteredReplicaSetsForDeployment)) {
            $scope.alerts["filter-hiding-all"] = {
              type: "warning",
              details: "The active filters are hiding all rollout history."
            };
          }
          else {
            delete $scope.alerts["filter-hiding-all"];
          }
        }

        LabelFilter.onActiveFiltersChanged(function(labelSelector) {
          $scope.$evalAsync(function() {
            $scope.replicaSetsForDeployment = labelSelector.select($scope.unfilteredReplicaSetsForDeployment);
            updateFilterWarning();
          });
        });

        $scope.scale = function(replicas) {
          var showScalingError = function(result) {
            $scope.alerts = $scope.alerts || {};
            $scope.alerts["scale"] = {
              type: "error",
              message: "An error occurred scaling the deployment.",
              details: $filter('getErrorDetails')(result)
            };
          };

          DeploymentsService.scale($scope.deployment, replicas).then(_.noop, showScalingError);
        };

        $scope.setPaused = function(paused) {
          $scope.updatingPausedState = true;
          DeploymentsService.setPaused($scope.deployment, paused, context).then(
            // Success
            _.noop,
            // Failure
            function(e) {
              $scope.updatingPausedState = false;
              $scope.alerts = $scope.alerts || {};
              $scope.alerts["scale"] = {
                type: "error",
                message: "An error occurred " + (paused ? "pausing" : "resuming") + " the deployment.",
                details: $filter('getErrorDetails')(e)
              };
            });
        };

        $scope.removeVolume = function(volume) {
          var details;
          if (_.get($scope, 'deployment.spec.paused')) {
            details = "This will remove the volume from the deployment.";
          } else {
            details = "This will remove the volume from the deployment and start a new rollout.";
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
            StorageService.removeVolume($scope.deployment, volume, context);
          };

          confirm.then(removeVolume);
        };

        $scope.$on('$destroy', function(){
          DataService.unwatchAll(watches);
        });
    }));
  });
