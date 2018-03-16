'use strict';

(function() {
  angular.module('openshiftConsole').component('overviewListRow', {
    controller: [
      '$filter',
      '$uibModal',
      'APIService',
      'BuildsService',
      'CatalogService',
      'DeploymentsService',
      'ListRowUtils',
      'Navigate',
      'NotificationsService',
      OverviewListRow
    ],
    controllerAs: 'row',
    bindings: {
      apiObject: '<',
      current: '<',
      // Previous deployment (if a deployment is in progress)
      previous: '<',
      state: '<',
      hidePipelines: '<'
    },
    templateUrl: 'views/overview/_list-row.html'
  });

  function OverviewListRow($filter,
                           $uibModal,
                           APIService,
                           BuildsService,
                           CatalogService,
                           DeploymentsService,
                           ListRowUtils,
                           Navigate,
                           NotificationsService) {
    var row = this;

    _.extend(row, ListRowUtils.ui);

    var canI = $filter('canI');
    var deploymentIsInProgress = $filter('deploymentIsInProgress');
    var isBinaryBuild = $filter('isBinaryBuild');
    var enableTechPreviewFeature = $filter('enableTechPreviewFeature');

    row.deploymentConfigsInstantiateVersion = APIService.getPreferredVersion('deploymentconfigs/instantiate');
    row.replicationControllersVersion = APIService.getPreferredVersion('replicationcontrollers');
    row.serviceBindingsVersion = APIService.getPreferredVersion('servicebindings');
    row.deploymentConfigsVersion = APIService.getPreferredVersion('deploymentconfigs');
    row.deploymentConfigsInstantiateVersion = APIService.getPreferredVersion('deploymentconfigs/instantiate');
    row.deploymentConfigsLogVersion = APIService.getPreferredVersion('deploymentconfigs/log');
    row.podsVersion = APIService.getPreferredVersion('pods');
    row.podsLogVersion = APIService.getPreferredVersion('pods/log');

    var updateTriggers = function(apiObject) {
      var triggers = _.get(apiObject, 'spec.triggers');
      if (_.isEmpty(triggers)) {
        return;
      }

      row.imageChangeTriggers = _.filter(triggers, function(trigger) {
        return trigger.type === 'ImageChange' && _.get(trigger, 'imageChangeParams.automatic');
      });
    };

    var updateCurrent = function(apiObject) {
      if (!apiObject ||
          row.current ||
          apiObject.kind === 'DeploymentConfig' ||
          apiObject.kind === 'Deployment') {
        return;
      }

      // For anything that's not a deployment or deployment config, "current" is the object itself.
      row.current = apiObject;
    };

    var updateAPIObject = function(apiObject) {
      row.rgv = APIService.objectToResourceGroupVersion(apiObject);
      updateCurrent(apiObject);
      updateTriggers(apiObject);
    };

    row.$onChanges = function(changes) {
      if (changes.apiObject) {
        updateAPIObject(changes.apiObject.currentValue);
      }
    };

    // Return the same empty array each time. Otherwise, digest loop errors occur.
    var NO_HPA = [];
    var getHPA = function(object) {
      if (!row.state.hpaByResource) {
        return null;
      }

      var kind = _.get(object, 'kind');
      var name = _.get(object, 'metadata.name');

      // TODO: Handle groups and subresources
      // var groupVersion = APIService.parseGroupVersion(object.apiVersion) || {};
      // var group = groupVersion.group || '';

      return _.get(row.state.hpaByResource, [kind, name], NO_HPA);
    };

    row.showBindings = CatalogService.SERVICE_CATALOG_ENABLED && enableTechPreviewFeature('pod_presets');

    row.$doCheck = function() {
      // Update notifications.
      row.notifications = ListRowUtils.getNotifications(row.apiObject, row.state);

      // Update HPA.
      row.hpa = getHPA(row.apiObject);
      if (row.current && _.isEmpty(row.hpa)) {
        row.hpa = getHPA(row.current);
      }

      // Update services and build configs.
      var uid = _.get(row, 'apiObject.metadata.uid');
      if (uid) {
        row.services = _.get(row, ['state', 'servicesByObjectUID', uid]);
        row.buildConfigs = _.get(row, ['state', 'buildConfigsByObjectUID', uid]);
        row.bindings = _.get(row, ['state', 'bindingsByApplicationUID', uid]);
      }

      var name;
      var kind = _.get(row, 'apiObject.kind');
      if (kind === 'DeploymentConfig') {
        name = _.get(row, 'apiObject.metadata.name');
        row.pipelines = _.get(row, ['state', 'pipelinesByDeploymentConfig', name]);
        row.recentBuilds = _.get(row, ['state', 'recentBuildsByDeploymentConfig', name]);
        row.recentPipelines = _.get(row, ['state', 'recentPipelinesByDeploymentConfig', name]);
      }
    };

    row.getPods = function(owner) {
      var uid = _.get(owner, 'metadata.uid');
      return _.get(row, ['state', 'podsByOwnerUID', uid]);
    };

    row.firstPod = function(owner) {
      var pods = row.getPods(owner);
      // Use `_.find` to get the first item.
      return _.find(pods);
    };

    row.isScalable = function() {
      if (!_.isEmpty(row.hpa)) {
        return false;
      }

      return !row.isDeploymentInProgress();
    };

    row.isDeploymentInProgress = function() {
      if (row.current && row.previous) {
        return true;
      }

      return deploymentIsInProgress(row.current);
    };

    row.canIDoAny = function() {
      var kind = _.get(row, 'apiObject.kind');
      var uid = _.get(row, 'apiObject.metadata.uid');
      var deleteableBindings = _.get(row.state.deleteableBindingsByApplicationUID, uid);
      switch (kind) {
      case 'DeploymentConfig':
        // Deploy is displayed.
        if (canI('deploymentconfigs/instantiate', 'create')) {
          return true;
        }
        // Edit is displayed.
        if (canI('deploymentconfigs', 'update')) {
          return true;
        }
        // View logs is displayed.
        if (row.current && canI('deploymentconfigs/log', 'get')) {
          return true;
        }
        // Create Binding is displayed.
        if (enableTechPreviewFeature('pod_presets') &&
            !_.isEmpty(row.state.bindableServiceInstances) &&
            canI(row.serviceBindingsVersion, 'create')) {
          return true;
        }
        // Delete Binding is displayed.
        if (enableTechPreviewFeature('pod_presets') &&
            !_.isEmpty(deleteableBindings) &&
            canI(row.serviceBindingsVersion, 'delete')) {
          return true;
        }
        // Check if one of the start build actions is displayed
        return row.showStartPipelineAction() || row.showStartBuildAction();

      case 'Pod':
        // View log is displayed.
        if (canI('pods/log', 'get')) {
          return true;
        }
        // Edit YAML is displayed.
        if (canI('pods', 'update')) {
          return true;
        }

        return false;

      default:
        // View log is displayed.
        if (row.firstPod(row.current) && canI('pods/log', 'get')) {
          return true;
        }
        // Edit YAML is displayed.
        if (canI(row.rgv, 'update')) {
          return true;
        }
        // Create Binding is displayed.
        if (enableTechPreviewFeature('pod_presets') &&
            !_.isEmpty(row.state.bindableServiceInstances) &&
            canI(row.serviceBindingsVersion, 'create')) {
          return true;
        }
        // Delete Binding is displayed.
        if (enableTechPreviewFeature('pod_presets') &&
            !_.isEmpty(deleteableBindings) &&
            canI(row.serviceBindingsVersion, 'delete')) {
          return true;
        }
        return false;
      }
    };

    row.showStartBuildAction = function() {
      // Hide the "Start Build" action if there is a pipeline.
      if (!_.isEmpty(row.pipelines)) {
        return false;
      }

      if (!canI('buildconfigs/instantiate', 'create')) {
        return false;
      }

      if (_.size(row.buildConfigs) !== 1) {
        return false;
      }

      var buildConfig = _.head(row.buildConfigs);
      return !isBinaryBuild(buildConfig);
    };

    row.showStartPipelineAction = function() {
      return canI('buildconfigs/instantiate', 'create') && _.size(row.pipelines) === 1;
    };

    row.startBuild = BuildsService.startBuild;

    row.canDeploy = function() {
      if (!row.apiObject) {
        return false;
      }

      if (row.apiObject.metadata.deletionTimestamp) {
        return false;
      }

      if (row.deploymentInProgress) {
        return false;
      }

      if (row.apiObject.spec.paused) {
        return false;
      }

      return true;
    };

    row.isPaused = function() {
      return row.apiObject.spec.paused;
    };

    row.startDeployment = function() {
      DeploymentsService.startLatestDeployment(row.apiObject, {
        namespace: row.apiObject.metadata.namespace
      });
    };

    // TODO: Pulled from dc.js, but we should probably make the dialog generic and reuse for the deployment config page.
    row.cancelDeployment = function() {
      var replicationController = row.current;
      if (!replicationController) {
        return;
      }

      var rcName = replicationController.metadata.name;
      var latestVersion = _.get(row, 'apiObject.status.latestVersion');
      var details;
      if (latestVersion === 1) {
        details = "This will attempt to stop the in-progress deployment. It may take some time to complete.";
      } else {
        details = "This will attempt to stop the in-progress deployment and rollback to the last successful deployment. It may take some time to complete.";
      }

      var modalInstance = $uibModal.open({
        templateUrl: 'views/modals/confirm.html',
        controller: 'ConfirmModalController',
        resolve: {
          modalConfig: function() {
            return {
              title: "Cancel deployment " + rcName + "?",
              details: details,
              okButtonText: "Yes, cancel",
              okButtonClass: "btn-danger",
              cancelButtonText: "No, don't cancel"
            };
          }
        }
      });

      modalInstance.result.then(function() {
        if (replicationController.metadata.uid !== row.current.metadata.uid) {
          NotificationsService.addNotification({
            type: "error",
            message: "Deployment #" + latestVersion + " is no longer the latest."
          });
          return;
        }

        // Make sure we have the latest resource version of the replication controller.
        replicationController = row.current;

        // Make sure it's still running.
        if (!deploymentIsInProgress(replicationController)) {
          NotificationsService.addNotification({
            type: "error",
            message: "Deployment " + rcName + " is no longer in progress."
          });
          return;
        }

        DeploymentsService.cancelRunningDeployment(replicationController, {
          namespace: replicationController.metadata.namespace
        });
      });
    };

    row.urlForImageChangeTrigger = function(imageChangeTrigger) {
      var imageStreamName = $filter('stripTag')(_.get(imageChangeTrigger, 'imageChangeParams.from.name'));
      var deploymentConfigNamespace = _.get(row, 'apiObject.metadata.namespace');
      var imageStreamNamespace = _.get(imageChangeTrigger, 'imageChangeParams.from.namespace', deploymentConfigNamespace);
      return Navigate.resourceURL(imageStreamName, 'ImageStream', imageStreamNamespace);
    };

    row.closeOverlayPanel = function() {
      _.set(row, 'overlay.panelVisible', false);
    };

    row.showOverlayPanel = function(panelName, state) {
      _.set(row, 'overlay.panelVisible', true);
      _.set(row, 'overlay.panelName', panelName);
      _.set(row, 'overlay.state', state);
    };
  }
})();
