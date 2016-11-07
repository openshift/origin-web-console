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
                        DeploymentsService,
                        HPAService,
                        ImageStreamResolver,
                        Navigate,
                        Logger,
                        ProjectsService,
                        keyValueEditorUtils) {
    var imageStreamImageRefByDockerReference = {}; // lets us determine if a particular container's docker image reference belongs to an imageStream

    $scope.projectName = $routeParams.project;
    $scope.name = $routeParams.deployment;
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
    $scope.emptyMessage = "Loading...";
    $scope.healthCheckURL = Navigate.healthCheckURL($routeParams.project,
                                                    "Deployment",
                                                    $routeParams.deployment,
                                                    "extensions");

    // get and clear any alerts
    AlertMessageService.getAlerts().forEach(function(alert) {
      $scope.alerts[alert.name] = alert.data;
    });
    AlertMessageService.clearAlerts();

    // copy deployment and ensure it has env so that we can edit env vars using key-value-editor
    var copyDeploymentAndEnsureEnv = function(deployment) {
      $scope.updatedDeployment = angular.copy(deployment);
      _.each($scope.updatedDeployment.spec.template.spec.containers, function(container) {
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
            HPAService.getHPAWarnings($scope.deployment, $scope.autoscalers, limitRanges, project)
                      .then(function(warnings) {
              $scope.hpaWarnings = warnings;
            });
        };

        DataService.get({
          group: 'extensions',
          resource: 'deployments'
        }, $routeParams.deployment, context).then(
          // success
          function(deployment) {
            $scope.loaded = true;
            $scope.deployment = deployment;
            updateHPAWarnings();

            $scope.saveEnvVars = function() {
              _.each($scope.updatedDeployment.spec.template.spec.containers, function(container) {
                container.env = keyValueEditorUtils.compactEntries(angular.copy(container.env));
              });
              DataService.update({
                group: 'extensions',
                resource: 'deployments'
              }, $routeParams.deployment, $scope.updatedDeployment, context)
                .then(function success(){
                  // TODO:  de-duplicate success and error messages.
                  // as it stands, multiple messages appear based on how edit
                  // is made.
                  $scope.alerts['saveDCEnvVarsSuccess'] = {
                    type: "success",
                    message: $routeParams.deployment + " was updated."
                  };
                  $scope.forms.deploymentEnvVars.$setPristine();
                }, function error(e){
                  $scope.alerts['saveDCEnvVarsError'] = {
                    type: "error",
                    message: $routeParams.deployment + " was not updated.",
                    details: "Reason: " + $filter('getErrorDetails')(e)
                  };
                });
            };

            $scope.clearEnvVarUpdates = function() {
              copyDeploymentAndEnsureEnv($scope.deployment);
              $scope.forms.deploymentEnvVars.$setPristine();
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
              $scope.deployment = deployment;
              $scope.updatingPausedState = false;

              if ($scope.forms.deploymentEnvVars.$pristine) {
                copyDeploymentAndEnsureEnv(deployment);
              } else {
                $scope.alerts["background_update"] = {
                  type: "warning",
                  message: "This deployment has been updated in the background. Saving your changes may create a conflict or cause loss of data.",
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
              ImageStreamResolver.fetchReferencedImageStreamImages([deployment.spec.template], $scope.imagesByDockerReference, imageStreamImageRefByDockerReference, context);
            }));

            // Watch replica sets for this deployment
            // TODO: Use controller ref
            watches.push(DataService.watch({
              group: 'extensions',
              resource: 'replicasets'
            }, context, function(replicaSetData) {
              var replicaSets = replicaSetData.by('metadata.name');
              var deploymentSelector = new LabelSelector(deployment.spec.selector);
              replicaSets = _.filter(replicaSets, function(replicaSet) {
                return deploymentSelector.covers(new LabelSelector(replicaSet.spec.selector));
              });
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
              details: e.status === 404 ? "Any remaining deployment history for this deployment will be shown." : "Reason: " + $filter('getErrorDetails')(e)
            };
          }
        );

        // List limit ranges in this project to determine if there is a default
        // CPU request for autoscaling.
        DataService.list("limitranges", context, function(response) {
          limitRanges = response.by("metadata.name");
          updateHPAWarnings();
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
          group: "extensions",
          resource: "horizontalpodautoscalers"
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

        $scope.$on('$destroy', function(){
          DataService.unwatchAll(watches);
        });
    }));
  });
