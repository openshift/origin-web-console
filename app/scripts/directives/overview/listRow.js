'use strict';

angular.module('openshiftConsole').component('overviewListRow', {
  controller: [
    '$filter',
    '$uibModal',
    'APIService',
    'BuildsService',
    'DeploymentsService',
    'Navigate',
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
                         DeploymentsService,
                         Navigate) {
  var row = this;

  var canI = $filter('canI');
  var deploymentIsInProgress = $filter('deploymentIsInProgress');
  var getErrorDetails = $filter('getErrorDetails');
  var isJenkinsPipelineStrategy = $filter('isJenkinsPipelineStrategy');

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

  var getNotifications = function(object) {
    var uid = _.get(object, 'metadata.uid');
    if (!uid) {
      return null;
    }
    return _.get(row, ['state', 'notificationsByObjectUID', uid]);
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

  var expandedKey = function(apiObject) {
    var uid = _.get(apiObject, 'metadata.uid');
    if (!uid) {
      return null;
    }

    return 'overview/expand/' + uid;
  };

  row.toggleExpand = function(e, always) {
    // Don't toggle if clicking on a link inside the row unless `always` is set.
    if (!always && $(e.target).closest("a").length > 0) {
      return;
    }

    var key = expandedKey(row.apiObject);
    if (!key) {
      return;
    }

    row.expanded = !row.expanded;
    sessionStorage.setItem(key, row.expanded ? 'true' : 'false');
  };

  var setInitialExpandedState = function() {
    var key = expandedKey(row.apiObject);
    if (!key) {
      row.expanded = false;
      return;
    }

    var item = sessionStorage.getItem(key);
    if (!item && row.state.expandAll) {
      row.expanded = true;
      return;
    }

    row.expanded = item === 'true';
  };

  row.$onInit = function() {
    _.set(row, 'selectedTab.networking', true);
    setInitialExpandedState();
  };

  row.$doCheck = function() {
    // Update notifications.
    row.notifications = getNotifications(row.apiObject);

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
    switch (kind) {
    case 'DeploymentConfig':
      // Edit is displayed.
      if (canI('deploymentconfigs', 'update')) {
        return true;
      }
      // View logs is displayed.
      if (row.current && canI('deploymentconfigs/log', 'get')) {
        return true;
      }
      // Start pipeline or build is displayed.
      if ((_.size(row.buildConfigs) === 1 || _.size(row.pipelines) === 1) &&
           canI('buildconfigs/instantiate')) {
        return true;
      }

      return false;

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

      return false;
    }
  };

  row.startBuild = function(buildConfig) {
    BuildsService
      .startBuild(buildConfig.metadata.name, { namespace: buildConfig.metadata.namespace })
      .then(_.noop, function(result) {
        var buildType = isJenkinsPipelineStrategy(buildConfig) ? 'pipeline' : 'build';
        row.state.alerts["start-build"] = {
          type: "error",
          message: "An error occurred while starting the " + buildType + ".",
          details: getErrorDetails(result)
        };
      });
  };

  row.startDeployment = function() {
    DeploymentsService.startLatestDeployment(row.apiObject, {
      namespace: row.apiObject.metadata.namespace
    }, { alerts: row.state.alerts });
  };

  // TODO: Pulled from dc.js, but we should probably make the dialog generic and reuse for the deployment config page.
  row.cancelDeployment = function() {
    var replicationController = row.current;
    if (!replicationController) {
      return;
    }

    var rcName = replicationController.metadata.name;
    var latestVersion = _.get(row, 'apiObject.status.latestVersion');
    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'views/modals/confirm.html',
      controller: 'ConfirmModalController',
      resolve: {
        modalConfig: function() {
          return {
            message: "Cancel deployment " + rcName + "?",
            details: latestVersion ? ("This will attempt to stop the in-progress deployment and rollback to the previous deployment, #" + latestVersion + ". It may take some time to complete.") :
                                      "This will attempt to stop the in-progress deployment and may take some time to complete.",
            okButtonText: "Yes, cancel",
            okButtonClass: "btn-danger",
            cancelButtonText: "No, don't cancel"
          };
        }
      }
    });

    modalInstance.result.then(function() {
      if (replicationController.metadata.uid !== row.current.metadata.uid) {
        row.state.alerts["cancel-deployment"] = {
          type: "error",
          message: "Deployment #" + latestVersion + " is no longer the latest."
        };
        return;
      }

      // Make sure we have the latest resource version of the replication controller.
      replicationController = row.current;

      // Make sure it's still running.
      if (!deploymentIsInProgress(replicationController)) {
        row.state.alerts["cancel-deployment"] = {
          type: "error",
          message: "Deployment " + rcName + " is no longer in progress."
        };
        return;
      }

      DeploymentsService.cancelRunningDeployment(replicationController, {
        namespace: replicationController.metadata.namespace
      }, { alerts: row.state.alerts });
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
