'use strict';

angular.module("openshiftConsole")
  .factory("DeploymentsService", function(
    $filter,
    $q,
    APIService,
    DataService,
    LabelFilter,
    NotificationsService) {

    function DeploymentsService() {}

    var deploymentConfigsInstantiateVersion = APIService.getPreferredVersion('deploymentconfigs/instantiate');
    var deploymentConfigsRollbackVersion = APIService.getPreferredVersion('deploymentconfigs/rollback');
    var podsVersion = APIService.getPreferredVersion('pods');
    var replicationControllersVersion = APIService.getPreferredVersion('replicationcontrollers');

    var annotation = $filter('annotation');

    DeploymentsService.prototype.startLatestDeployment = function(deploymentConfig, context) {
      // increase latest version by one so starts new deployment based on latest
      var req = {
        kind: "DeploymentRequest",
        apiVersion: APIService.toAPIVersion(deploymentConfigsInstantiateVersion),
        name: deploymentConfig.metadata.name,
        latest: true,
        force: true
      };

      DataService.create(deploymentConfigsInstantiateVersion, deploymentConfig.metadata.name, req, context).then(
        function(updatedDC) {
          NotificationsService.addNotification({
              type: "success",
              message: "Deployment #" + updatedDC.status.latestVersion + " of " + deploymentConfig.metadata.name + " has started.",
            });
        },
        function(result) {
          NotificationsService.addNotification({
            type: "error",
            message: "An error occurred while starting the deployment.",
            details: $filter('getErrorDetails')(result)
          });
        }
      );
    };

    DeploymentsService.prototype.retryFailedDeployment = function(deployment, context, $scope) {
      var req = angular.copy(deployment);
      var rgv = APIService.objectToResourceGroupVersion(deployment);
      var deploymentName = deployment.metadata.name;
      var deploymentConfigName = annotation(deployment, 'deploymentConfig');
      // TODO: we need a "retry" api endpoint so we don't have to do this manually

      // delete the deployer pod as well as the deployment hooks pods, if any
      DataService.list(podsVersion, context, function(list) {
        var pods = list.by("metadata.name");
        var deleteDeployerPod = function(pod) {
          var deployerPodForAnnotation = $filter('annotationName')('deployerPodFor');
          if (pod.metadata.labels[deployerPodForAnnotation] === deploymentName) {
            DataService.delete(podsVersion, pod.metadata.name, $scope).then(
              function() {
                Logger.info("Deployer pod " + pod.metadata.name + " deleted");
              },
              function(result) {
                $scope.alerts = $scope.alerts || {};
                $scope.alerts["retrydeployer"] =
                  {
                    type: "error",
                    message: "An error occurred while deleting the deployer pod.",
                    details: $filter('getErrorDetails')(result)
                  };
              }
            );
          }
        };
        angular.forEach(pods, deleteDeployerPod);
      });

      // set deployment to "New" and remove statuses so we can retry
      var deploymentStatusAnnotation = $filter('annotationName')('deploymentStatus');
      var deploymentStatusReasonAnnotation = $filter('annotationName')('deploymentStatusReason');
      var deploymentCancelledAnnotation = $filter('annotationName')('deploymentCancelled');
      req.metadata.annotations[deploymentStatusAnnotation] = "New";
      delete req.metadata.annotations[deploymentStatusReasonAnnotation];
      delete req.metadata.annotations[deploymentCancelledAnnotation];

      // update the deployment
      DataService.update(rgv, deploymentName, req, context).then(
        function() {
          NotificationsService.addNotification({
              type: "success",
              message: "Retrying deployment " + deploymentName + " of " + deploymentConfigName + ".",
            });
        },
        function(result) {
          NotificationsService.addNotification({
            type: "error",
            message: "An error occurred while retrying the deployment.",
            details: $filter('getErrorDetails')(result)
          });
        }
      );
    };

    DeploymentsService.prototype.rollbackToDeployment = function(deployment, changeScaleSettings, changeStrategy, changeTriggers, context) {
      var deploymentName = deployment.metadata.name;
      var deploymentConfigName = annotation(deployment, 'deploymentConfig');
      // put together a new rollback request
      var req = {
        apiVersion: APIService.toAPIVersion(deploymentConfigsRollbackVersion),
        kind: "DeploymentConfigRollback",
        name: deploymentConfigName,
        spec: {
          from: {
            name: deploymentName
          },
          includeTemplate: true,
          includeReplicationMeta: changeScaleSettings,
          includeStrategy: changeStrategy,
          includeTriggers: changeTriggers
        }
      };

      // create the deployment config rollback
      DataService.create(deploymentConfigsRollbackVersion, deploymentConfigName, req, context).then(
        function(newDeploymentConfig) {
          var rgv = APIService.objectToResourceGroupVersion(newDeploymentConfig);
          // update the deployment config based on the one returned by the rollback
          DataService.update(rgv, deploymentConfigName, newDeploymentConfig, context).then(
            function(rolledBackDeploymentConfig) {
              NotificationsService.addNotification({
                type: "success",
                message: "Deployment #" + rolledBackDeploymentConfig.status.latestVersion + " is rolling back " + deploymentConfigName + " to " + deploymentName + ".",
              });
            },
            function(result) {
              NotificationsService.addNotification({
                id: "rollback-deployment-error",
                type: "error",
                message: "An error occurred while rolling back the deployment.",
                details: $filter('getErrorDetails')(result)
              });
            }
          );
        },
        function(result) {
          NotificationsService.addNotification({
            id: "rollback-deployment-error",
            type: "error",
            message: "An error occurred while rolling back the deployment.",
            details: $filter('getErrorDetails')(result)
          });
        });
    };

    DeploymentsService.prototype.cancelRunningDeployment = function(deployment, context) {
      var deploymentName = deployment.metadata.name;
      var deploymentConfigName = $filter('annotation')(deployment, 'deploymentConfig');
      var req = angular.copy(deployment);

      // TODO: we need a "cancel" api endpoint so we don't have to do this manually

      // set the cancellation annotations
      var deploymentCancelledAnnotation = $filter('annotationName')('deploymentCancelled');
      var deploymentStatusReasonAnnotation = $filter('annotationName')('deploymentStatusReason');
      req.metadata.annotations[deploymentCancelledAnnotation] = "true";
      req.metadata.annotations[deploymentStatusReasonAnnotation] = "The deployment was cancelled by the user";

      // update the deployment with cancellation annotations
      DataService.update(replicationControllersVersion, deploymentName, req, context).then(
        function() {
          NotificationsService.addNotification({
              type: "success",
              message: "Cancelled deployment " + deploymentName + " of " + deploymentConfigName + ".",
            });
        },
        function(result) {
          NotificationsService.addNotification({
            id: "cancel-deployment-error",
            type: "error",
            message: "An error occurred while cancelling the deployment.",
            details: $filter('getErrorDetails')(result)
          });
        }
      );
    };

    // deploymentConfigs is optional
    // filter will run the current label filter against any deployments whose DC is deleted, or any RCs
    DeploymentsService.prototype.associateDeploymentsToDeploymentConfig = function(deployments, deploymentConfigs, filter) {
      var deploymentsByDeploymentConfig = {};
      var labelSelector = LabelFilter.getLabelSelector();
      angular.forEach(deployments, function(deployment, deploymentName) {
        var deploymentConfigName = $filter('annotation')(deployment, 'deploymentConfig');
        if (!filter || deploymentConfigs && deploymentConfigs[deploymentConfigName] || labelSelector.matches(deployment)) {
          deploymentConfigName = deploymentConfigName || '';
          deploymentsByDeploymentConfig[deploymentConfigName] = deploymentsByDeploymentConfig[deploymentConfigName] || {};
          deploymentsByDeploymentConfig[deploymentConfigName][deploymentName] = deployment;
        }
      });
      // Make sure there is an empty map for every dc we know about even if there is no deployment currently
      angular.forEach(deploymentConfigs, function(deploymentConfig, deploymentConfigName) {
        deploymentsByDeploymentConfig[deploymentConfigName] = deploymentsByDeploymentConfig[deploymentConfigName] || {};
      });
      return deploymentsByDeploymentConfig;
    };

    DeploymentsService.prototype.deploymentBelongsToConfig = function(deployment, deploymentConfigName) {
      if (!deployment || !deploymentConfigName) {
        return false;
      }
      return deploymentConfigName === $filter('annotation')(deployment, 'deploymentConfig');
    };

    DeploymentsService.prototype.associateRunningDeploymentToDeploymentConfig = function(deploymentsByDeploymentConfig) {
      var deploymentConfigDeploymentsInProgress = {};
      angular.forEach(deploymentsByDeploymentConfig, function(deploymentConfigDeployments, deploymentConfigName) {
        deploymentConfigDeploymentsInProgress[deploymentConfigName] = {};
        angular.forEach(deploymentConfigDeployments, function(deployment, deploymentName) {
          var status = $filter('deploymentStatus')(deployment);
          if (status === "New" || status === "Pending" || status === "Running") {
            deploymentConfigDeploymentsInProgress[deploymentConfigName][deploymentName] = deployment;
          }
        });
      });
      return deploymentConfigDeploymentsInProgress;
    };

    // Gets the latest in progress or complete deployment among deployments.
    // Deployments are assumed to be from the same deployment config.
    DeploymentsService.prototype.getActiveDeployment = function(deployments) {
      var isInProgress = $filter('deploymentIsInProgress');
      var annotation = $filter('annotation');

      /*
       * Note: This is a hotspot in our code. We call this function frequently
       *       on the overview page.
       */

      // Iterate over the list to find the most recent active deployment.
      var activeDeployment = null;
      _.each(deployments, function(deployment) {
        if (isInProgress(deployment)) {
          // If any deployment is in progress, there is no current active deployment (disable scaling).
          // Break out of the loop and return null.
          activeDeployment = null;
          return false;
        }

        if (annotation(deployment, 'deploymentStatus') !== 'Complete') {
          return;
        }

        // The deployment must be more recent than the last we've found.
        // The date format can be compared using straight string comparison.
        // Compare as strings for performance.
        // Example Date: 2016-02-02T21:53:07Z
        if (!activeDeployment || activeDeployment.metadata.creationTimestamp < deployment.metadata.creationTimestamp) {
          activeDeployment = deployment;
        }
      });

      return activeDeployment;
    };

    DeploymentsService.prototype.getRevision = function(/* Deployment or ReplicaSet */ object) {
      return annotation(object, 'deployment.kubernetes.io/revision');
    };

    DeploymentsService.prototype.isActiveReplicaSet = function(replicaSet, deployment) {
      var replicaSetRevision = this.getRevision(replicaSet);
      var deploymentRevision = this.getRevision(deployment);
      if (!replicaSetRevision || !deploymentRevision) {
        return false;
      }

      return replicaSetRevision === deploymentRevision;
    };

    DeploymentsService.prototype.getActiveReplicaSet = function(replicaSets, deployment) {
      var latestRevision = this.getRevision(deployment);
      if (!latestRevision) {
        return null;
      }

      var self = this;
      return _.find(replicaSets, function(replicaSet) {
        return self.getRevision(replicaSet) === latestRevision;
      });
    };

    DeploymentsService.prototype.getScaleResource = function(object) {
      var resourceGroupVersion = {
        resource: APIService.kindToResource(object.kind) + '/scale'
      };

      switch (object.kind) {
      case 'DeploymentConfig':
        // Deployment config scale subresources don't use group extensions.
        break;
      case 'Deployment':
      case 'ReplicaSet':
      case 'ReplicationController':
        resourceGroupVersion.group = 'extensions';
        break;
      default:
        return null;
      }

      return resourceGroupVersion;
    };

    DeploymentsService.prototype.scale = function(object, replicas) {
      var resourceGroupVersion = this.getScaleResource(object);
      if (!resourceGroupVersion) {
        return $q.reject({
          data: {
            message: "Cannot scale kind " + object.kind + "."
          }
        });
      }

      var scaleObject = {
        apiVersion: "extensions/v1beta1",
        kind: "Scale",
        metadata: {
          name: object.metadata.name,
          namespace: object.metadata.namespace,
          creationTimestamp: object.metadata.creationTimestamp
        },
        spec: {
          replicas: replicas
        }
      };
      return DataService.update(resourceGroupVersion,
                                object.metadata.name,
                                scaleObject,
                                { namespace: object.metadata.namespace });
    };

    var isDCAutoscaled = function(name, hpaByDC) {
      var hpaArray = _.get(hpaByDC, [name]);
      return !_.isEmpty(hpaArray);
    };

    var isRCAutoscaled = function(name, hpaByRC) {
      var hpaArray = _.get(hpaByRC, [name]);
      return !_.isEmpty(hpaArray);
    };

    DeploymentsService.prototype.isScalable = function(deployment, deploymentConfigs, hpaByDC, hpaByRC, scalableDeploymentByConfig) {
      // If this RC has an autoscaler, don't allow manual scaling.
      if (isRCAutoscaled(deployment.metadata.name, hpaByRC)) {
        return false;
      }

      var deploymentConfigId = annotation(deployment, 'deploymentConfig');

      // Otherwise allow scaling of RCs with no deployment config.
      if (!deploymentConfigId) {
        return true;
      }

      // Wait for deployment configs to load before allowing scaling of
      // a deployment with a deployment config.
      if (!deploymentConfigs) {
        return false;
      }

      // Allow scaling of deployments whose deployment config has been deleted.
      if (!deploymentConfigs[deploymentConfigId]) {
        return true;
      }

      // If the deployment config has an autoscaler, don't allow manual scaling.
      if (isDCAutoscaled(deploymentConfigId, hpaByDC)) {
        return false;
      }

      // Otherwise, check the map to find the most recent deployment that's scalable.
      var scalableName = _.get(scalableDeploymentByConfig, [deploymentConfigId, 'metadata', 'name']);
      return scalableName === deployment.metadata.name;
    };

    DeploymentsService.prototype.groupByDeploymentConfig = function(replicationControllers) {
      var byDC = {};

      _.each(replicationControllers, function(rc) {
        var deploymentConfigId = $filter('annotation')(rc, 'deploymentConfig') || '';
        _.set(byDC, [deploymentConfigId, rc.metadata.name], rc);
      });

      return byDC;
    };

    // Sorts replication controllers that are part of a deployment config by
    // the deployment version annotation.
    DeploymentsService.prototype.sortByDeploymentVersion = function(replicationControllers, descending) {
      var compareDeployments = function(left, right) {
        var leftVersion = parseInt(annotation(left, 'deploymentVersion'), 10);
        var rightVersion = parseInt(annotation(right, 'deploymentVersion'), 10);

        // Fall back to sorting by name if no deployment versions.
        var leftName, rightName;
        if (!_.isFinite(leftVersion) && !_.isFinite(rightVersion)) {
          leftName = _.get(left, 'metadata.name', '');
          rightName = _.get(right, 'metadata.name', '');
          if (descending) {
            return rightName.localeCompare(leftName);
          }
          return leftName.localeCompare(rightName);
        }

        if (!leftVersion) {
          return descending ? 1 : -1;
        }

        if (!rightVersion) {
          return descending ? -1 : 1;
        }

        if (descending) {
          return rightVersion - leftVersion;
        }
        return leftVersion - rightVersion;
      };

      return _.toArray(replicationControllers).sort(compareDeployments);
    };

    // Sorts replica sets that are part of a deployment by the revision annotation.
    // TODO: Make descending sort optional.
    DeploymentsService.prototype.sortByRevision = function(replicaSets) {
      var self = this;
      var revisionAsNumber = function(replicaSet) {
        var revision = self.getRevision(replicaSet);
        if (!revision) {
          return null;
        }

        var revisionNumber = parseInt(revision, 10);
        if (isNaN(revisionNumber)) {
          return null;
        }

        return revisionNumber;
      };

      var compareRevisions = function(lhs, rhs) {
        var leftRevision = revisionAsNumber(lhs);
        var rightRevision = revisionAsNumber(rhs);
        if (!leftRevision && !rightRevision) {
          return lhs.metadata.name.localeCompare(rhs.metadata.name);
        }

        if (!leftRevision) {
          return 1;
        }

        if (!rightRevision) {
          return -1;
        }

        // Sort higher numbers first so more recent revisions appear at the top of the list.
        return rightRevision - leftRevision;
      };

      return _.toArray(replicaSets).sort(compareRevisions);
    };

    DeploymentsService.prototype.setPaused = function(/* deployment or deployment config */ object, paused, context) {
      var request = angular.copy(object);
      var resourceGroupVersion = APIService.objectToResourceGroupVersion(object);
      _.set(request, 'spec.paused', paused);
      return DataService.update(resourceGroupVersion, object.metadata.name, request, context);
    };

    return new DeploymentsService();
  });
