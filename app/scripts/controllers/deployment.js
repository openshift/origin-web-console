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
                        DataService,
                        DeploymentsService,
                        EnvironmentService,
                        HPAService,
                        ImageStreamResolver,
                        ModalsService,
                        Navigate,
                        OwnerReferencesService,
                        Logger,
                        ProjectsService,
                        StorageService,
                        gettext) {
    var imageStreamImageRefByDockerReference = {}; // lets us determine if a particular container's docker image reference belongs to an imageStream

    $scope.projectName = $routeParams.project;
    $scope.name = $routeParams.deployment;
    $scope.forms = {};
    $scope.alerts = {};
    $scope.imagesByDockerReference = {};
    $scope.breadcrumbs = [
      {
        title: gettext("Deployments"),
        link: "project/" + $routeParams.project + "/browse/deployments"
      },
      {
        title: $routeParams.deployment
      }
    ];
    $scope.healthCheckURL = Navigate.healthCheckURL($routeParams.project,
                                                    "Deployment",
                                                    $routeParams.deployment,
                                                    "extensions");

    var previousEnvConflict = false;
    var updateEnvironment = function(current, previous) {
      if (previousEnvConflict) {
        return;
      }

      if (!$scope.forms.deploymentEnvVars || $scope.forms.deploymentEnvVars.$pristine) {
        $scope.updatedDeployment = EnvironmentService.copyAndNormalize(current);
        return;
      }

      // The env var form has changed and the deployment has been updated. See
      // if there were any background changes to the environment variables. If
      // not, merge the environment edits into the updated deployment object.
      if (EnvironmentService.isEnvironmentEqual(current, previous)) {
        $scope.updatedDeployment = EnvironmentService.mergeEdits($scope.updatedDeployment, current);
        return;
      }

      previousEnvConflict = true;
      $scope.alerts["env-conflict"] = {
        type: "warning",
        message: gettext("The environment variables for the deployment have been updated in the background. Saving your changes may create a conflict or cause loss of data."),
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

        var saveEnvPromise;
        DataService.get({
          group: 'extensions',
          resource: 'deployments'
        }, $routeParams.deployment, context, { errorNotification: false }).then(
          // success
          function(deployment) {
            $scope.loaded = true;
            $scope.deployment = deployment;
            updateHPAWarnings();

            $scope.saveEnvVars = function() {
              EnvironmentService.compact($scope.updatedDeployment);
              saveEnvPromise = DataService.update({
                group: 'extensions',
                resource: 'deployments'
              }, $routeParams.deployment, $scope.updatedDeployment, context);
              saveEnvPromise.then(function success(){
                // TODO:  de-duplicate success and error messages.
                // as it stands, multiple messages appear based on how edit
                // is made.
                $scope.alerts['saveEnvSuccess'] = {
                  type: "success",
                  message: $routeParams.deployment + " was updated."
                };
                $scope.forms.deploymentEnvVars.$setPristine();
              }, function error(e){
                $scope.alerts['saveEnvError'] = {
                  type: "error",
                  message: $routeParams.deployment + " was not updated.",
                  details: $filter('getErrorDetails')(e)
                };
              }).finally(function() {
                saveEnvPromise = null;
              });
            };

            $scope.clearEnvVarUpdates = function() {
              $scope.updatedDeployment = EnvironmentService.copyAndNormalize($scope.deployment);
              $scope.forms.deploymentEnvVars.$setPristine();
              previousEnvConflict = false;
            };

            // If we found the item successfully, watch for changes on it
            watches.push(DataService.watchObject({
              group: 'extensions',
              resource: 'deployments'
            }, $routeParams.deployment, context, function(deployment, action) {
              if (action === "DELETED") {
                $scope.alerts["deleted"] = {
                  type: "warning",
                  message: "This deployment has been deleted."
                };
              }

              var previous = $scope.deployment;
              $scope.deployment = deployment;
              $scope.updatingPausedState = false;
              updateHPAWarnings();

              updateEnvironment(deployment, previous);

              // Wait for a pending save to complete to avoid a race between the PUT and the watch callbacks.
              if (saveEnvPromise) {
                saveEnvPromise.finally(function() {
                  updateEnvironment(deployment, previous);
                });
              } else {
                updateEnvironment(deployment, previous);
              }

              ImageStreamResolver.fetchReferencedImageStreamImages([deployment.spec.template], $scope.imagesByDockerReference, imageStreamImageRefByDockerReference, context);
            }));

            // Watch replica sets for this deployment
            watches.push(DataService.watch({
              group: 'extensions',
              resource: 'replicasets'
            }, context, function(replicaSetData) {
              var replicaSets = replicaSetData.by('metadata.name');
              replicaSets = OwnerReferencesService.filterForController(replicaSets, deployment);
              $scope.inProgressDeployment = _.chain(replicaSets).filter('status.replicas').size() > 1;
              $scope.replicaSetsForDeployment = DeploymentsService.sortByRevision(replicaSets);
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
        DataService.list("limitranges", context).then(function(response) {
          limitRanges = response.by("metadata.name");
          updateHPAWarnings();
        });

        var configMapDataOrdered = [];
        var secretDataOrdered = [];
        $scope.valueFromObjects = [];

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
          // If the deployment has been loaded already
          if ($scope.deployment) {
            ImageStreamResolver.fetchReferencedImageStreamImages([$scope.deployment.spec.template], $scope.imagesByDockerReference, imageStreamImageRefByDockerReference, context);
          }
          Logger.log("imagestreams (subscribe)", $scope.imageStreams);
        }));

        watches.push(DataService.watch({
          group: "autoscaling",
          resource: "horizontalpodautoscalers",
          version: "v1"
        }, context, function(hpa) {
          $scope.autoscalers =
            HPAService.filterHPA(hpa.by("metadata.name"), 'Deployment', $routeParams.deployment);
          updateHPAWarnings();
        }));

        watches.push(DataService.watch("builds", context, function(builds) {
          $scope.builds = builds.by("metadata.name");
          Logger.log("builds (subscribe)", $scope.builds);
        }));

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
            message: "Remove volume " + volume.name + "?",
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
