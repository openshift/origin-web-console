'use strict';

/**
 * @ngdoc function
 * @name openshiftConsole.controller:CreateRouteController
 * @description
 * # CreateRouteController
 * Controller of the openshiftConsole
 */
angular.module('openshiftConsole')
  .controller('AttachPVCController', function($filter,
                                              $routeParams,
                                              $scope,
                                              $window,
                                              APIService,
                                              DataService,
                                              Navigate,
                                              ProjectsService,
                                              StorageService) {
    if (!$routeParams.kind || !$routeParams.name) {
      Navigate.toErrorPage("Kind or name parameter missing.");
      return;
    }

    var supportedKinds = [
      'Deployment',
      'DeploymentConfig',
      'ReplicaSet',
      'ReplicationController'
    ];

    if (!_.includes(supportedKinds, $routeParams.kind)) {
      Navigate.toErrorPage("Storage is not supported for kind " + $routeParams.kind + ".");
      return;
    }

    var resourceGroupVersion = {
      resource: APIService.kindToResource($routeParams.kind),
      group: $routeParams.group
    };

    $scope.alerts = {};
    $scope.renderOptions = {
      hideFilterWidget: true
    };

    $scope.projectName = $routeParams.project;
    $scope.kind = $routeParams.kind;
    $scope.name = $routeParams.name;

    $scope.attach = {
      persistentVolumeClaim: null,
      volumeName: null,
      mountPath: null,
      containers: {
        all: true,
        individual: {}
      }
    };

    $scope.breadcrumbs = [
      {
        title: $routeParams.project,
        link: "project/" + $routeParams.project
      },
      {
        title: "Attach Storage"
      }
    ];

    ProjectsService
      .get($routeParams.project)
      .then(_.spread(function(project, context) {
        $scope.project = project;

        // Update project breadcrumb with display name.
        $scope.breadcrumbs[0].title = $filter('displayName')(project);

        var orderByDisplayName = $filter('orderByDisplayName');
        var getErrorDetails = $filter('getErrorDetails');
        var navigateResourceURL = $filter('navigateResourceURL');
        var generateName = $filter('generateName');

        var displayError = function(errorMessage, errorDetails) {
          $scope.disableInputs = true;
          $scope.alerts['attach-persistent-volume-claim'] = {
            type: "error",
            message: errorMessage,
            details: errorDetails
          };
        };

        // load resources required to show the page (list of pvcs and deployment or deployment config)
        var load = function() {
          DataService.get(resourceGroupVersion, $routeParams.name, context).then(
            function(resource) {
              angular.forEach(resource.spec.template.spec.containers, function(container) {
                $scope.attach.containers.individual[container.name] = true;
              });
              $scope.attach.resource = resource;
              rebuildBreadcrumb();
            },
            function(e) {
              displayError($routeParams.name + " could not be loaded.", getErrorDetails(e));
            }
          );

          DataService.list("persistentvolumeclaims", context, 
            function(pvcs) {
              $scope.pvcs = orderByDisplayName(pvcs.by("metadata.name"));
              if ($scope.pvcs.length) {
                if (!$scope.attach.persistentVolumeClaim) {
                  $scope.attach.persistentVolumeClaim = $scope.pvcs[0];
                }
              }
            },
            function(e) {
              displayError("The persistent volume claims could not be loaded.", getErrorDetails(e));
            }
          );
        };

        var isVolumeNameUsed = function(name, podTemplate) {
          if (podTemplate.spec.volumes) {
            for (var i = 0; i < podTemplate.spec.volumes.length; i++) {
              var volume = podTemplate.spec.volumes[i];
              if (volume.name === name) {
                $scope.isVolumeNameUsed = true;
                return true;
              }
            }
          }
          $scope.isVolumeNameUsed = false;
          return false;
        };

        var isVolumeMountPathUsed = function(name, mountPath, podTemplate) {
          if (podTemplate.spec.containers) {
            for (var i = 0; i < podTemplate.spec.containers.length; i++) {
              var container = podTemplate.spec.containers[i];
              if ($scope.attach.containers.all || $scope.attach.containers.individual[container.name]) {
                if (container.volumeMounts) {
                  for (var j = 0; j < container.volumeMounts.length; j++) {
                    var volumeMount = container.volumeMounts[j];
                    if (volumeMount.mountPath === mountPath && name !== volumeMount.Name) {
                      $scope.isVolumeMountPathUsed = true;
                      return true;
                    }
                  }
                }
              }
            }
          }
          $scope.isVolumeMountPathUsed = false;
          return false;
        };

        // breadcrumb must react depending on what we are attaching to (deployment or dc)
        function rebuildBreadcrumb() {
          $scope.breadcrumbs.splice(1, 0, {
            title: "Deployments",
            link: "project/" + $routeParams.project + "/browse/deployments"
          });

          var deploymentConfig = $scope.attach.deploymentConfig;
          if (deploymentConfig) {
            $scope.breadcrumbs.splice(2, 0, {
              title: deploymentConfig.metadata.name,
              link: navigateResourceURL(deploymentConfig)
            });
          }

          var deployment = $scope.attach.deployment;
          if (deployment) {
            var deploymentVersion = $filter("annotation")(deployment, "deploymentVersion");
            $scope.breadcrumbs.splice(2, 0, {
              title: deploymentVersion ? "#" + deploymentVersion : deployment.metadata.name
            });
            var deploymentDeploymentConfigName = $filter("annotation")(deployment, "deploymentConfig");
            if (deploymentDeploymentConfigName) {
              $scope.breadcrumbs[2].link = navigateResourceURL(deployment);
              $scope.breadcrumbs.splice(2, 0, {
                title: deploymentDeploymentConfigName,
                link: navigateResourceURL(deploymentDeploymentConfigName, "deploymentConfig", $routeParams.project)
              });
            }
          }
        }

        load();

        $scope.containerToAttachProvided = function() {
          if ($scope.attach.containers.all) {
            return true;
          }
          for (var key in $scope.attach.containers.individual) {
            if ($scope.attach.containers.individual[key] === true) {
              return true;
            }
          }
          return false;
        };

        $scope.attachPVC = function() {
          $scope.disableInputs = true;

          if ($scope.attachPVCForm.$valid) {
            // generate a volume name if not provided
            if (!$scope.attach.volumeName) {
              $scope.attach.volumeName = generateName("volume-");
            }

            var resource = $scope.attach.resource;
            var podTemplate = _.get(resource, 'spec.template');
            var persistentVolumeClaim = $scope.attach.persistentVolumeClaim;
            var name = $scope.attach.volumeName;
            var mountPath = $scope.attach.mountPath;

            // check the volume name wanted was not yet used in this pod template
            if (isVolumeNameUsed(name, podTemplate)) {
              $scope.disableInputs = false;
              return;
            }

            if (mountPath) {
              // if we want to mount, check if the mount path is unique in this pod template 
              if (isVolumeMountPathUsed(name, mountPath, podTemplate)) {
                $scope.disableInputs = false;
                return;
              }

              // for each container in the pod spec, add the new volume mount
              angular.forEach(podTemplate.spec.containers, function(container) {
                if ($scope.attach.containers.all || $scope.attach.containers.individual[container.name]) {
                  var newVolumeMount = StorageService.createVolumeMount(name, mountPath);
                  if (!container.volumeMounts) {
                    container.volumeMounts = [];
                  }
                  container.volumeMounts.push(newVolumeMount);
                }
              });
            }

            // add the new volume to the pod template
            var newVolume = StorageService.createVolume(name, persistentVolumeClaim);
            if (!podTemplate.spec.volumes) {
              podTemplate.spec.volumes = [];
            }
            podTemplate.spec.volumes.push(newVolume);
            $scope.alerts = {};

            // save deployment or deployment config
            DataService.update(resourceGroupVersion, resource.metadata.name, $scope.attach.resource, context).then(
              function() {
                $window.history.back();
              },
              function(result) {
                displayError("An error occurred attaching the persistent volume claim to deployment config.", getErrorDetails(result));
              }
            );
          }
        };
    }));
  });
