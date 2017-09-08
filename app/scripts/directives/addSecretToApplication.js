"use strict";
(function() {
  angular.module("openshiftConsole").component('addSecretToApplication', {
    controller: [
      '$filter',
      '$scope',
      'APIService',
      'DataService',
      'Navigate',
      'NotificationsService',
      'StorageService',
      AddSecretToApplication
    ],
    controllerAs: 'ctrl',
    bindings: {
      project: '<',
      secret: '<',
      onComplete: '<',
      onCancel: '<'
    },
    templateUrl: 'views/directives/add-secret-to-application.html'
  });

  function AddSecretToApplication($filter, $scope, APIService, DataService, Navigate, NotificationsService, StorageService) {
    var ctrl = this;
    var deploymentConfigs;
    var deployments;
    var replicationControllers;
    var replicaSets;
    var statefulSets;

    var sortApplications = function() {
      // Don't waste time sorting on each data load, just sort when we have them all
      if (deploymentConfigs && deployments && replicationControllers && replicaSets && statefulSets) {
        var apiObjects = deploymentConfigs.concat(deployments)
          .concat(replicationControllers)
          .concat(replicaSets)
          .concat(statefulSets);
        ctrl.applications = _.sortBy(apiObjects, ['metadata.name', 'kind']);
        ctrl.updating = false;
      }
    };

    var getApplications = function() {
      var hasDeploymentFilter = $filter('hasDeployment');
      var hasDeploymentConfigFilter = $filter('hasDeploymentConfig');

      ctrl.updating = true;
      var context = {
        namespace: ctrl.project.metadata.name
      };
      // Load all the "application" types
      DataService.list('deploymentconfigs', context).then(function(deploymentConfigData) {
        deploymentConfigs = _.toArray(deploymentConfigData.by('metadata.name'));
        sortApplications();
      });
      DataService.list('replicationcontrollers', context).then(function(replicationControllerData) {
        replicationControllers = _.reject(replicationControllerData.by('metadata.name'), hasDeploymentConfigFilter);
        sortApplications();
      });
      DataService.list({
        group: 'apps',
        resource: 'deployments'
      }, context).then(function(deploymentData) {
        deployments = _.toArray(deploymentData.by('metadata.name'));
        sortApplications();
      });
      DataService.list({
        group: 'extensions',
        resource: 'replicasets'
      }, context).then(function(replicaSetData) {
        replicaSets = _.reject(replicaSetData.by('metadata.name'), hasDeploymentFilter);
        sortApplications();
      });
      DataService.list({
        group: 'apps',
        resource: 'statefulsets'
      }, context).then(function(statefulSetData) {
        statefulSets = _.toArray(statefulSetData.by('metadata.name'));
        sortApplications();
      });
    };

    ctrl.$onInit = function() {
      ctrl.addType = 'env';
      ctrl.disableInputs = false;

      getApplications();

      var keyValidator = new RegExp("^[A-Za-z_]{1}[A-Za-z0-9_]*$");
      ctrl.hasInvalidEnvVars = _.some(ctrl.secret.data, function(value, key) {
        return !keyValidator.test(key);
      });
    };

    ctrl.$postLink = function() {
      $scope.$watch(function() {
        return ctrl.application;
      }, function() {
        // Look at the existing mount paths so that we can warn if the new value is not unique.
        var podTemplate = _.get(ctrl.application, 'spec.template');
        ctrl.existingMountPaths = StorageService.getMountPaths(podTemplate);
      });
    };

    ctrl.addToApplication = function() {
      var applicationToUpdate = angular.copy(ctrl.application);

      var podTemplate = _.get(applicationToUpdate, 'spec.template');

      ctrl.disableInputs = true;

      if (ctrl.addType === 'env') {
        var newEnvFrom = {
          secretRef: {
            name: ctrl.secret.metadata.name
          }
        };

        // For each container, add the new volume mount.
        _.each(podTemplate.spec.containers, function(container) {
          container.envFrom = container.envFrom || [];
          container.envFrom.push(newEnvFrom);
        });
      } else {
        var generateName = $filter('generateName');
        var name = generateName(ctrl.secret.metadata.name + '-');
        var newVolumeMount = {
          name: name,
          mountPath: ctrl.mountVolume,
          readOnly: true
        };

        // For each selected container, add the new volume mount.
        _.each(podTemplate.spec.containers, function(container) {
          container.volumeMounts = container.volumeMounts || [];
          container.volumeMounts.push(newVolumeMount);
        });

        var newVolume = {
          name: name,
          secret: {
            secretName: ctrl.secret.metadata.name
          }
        };

        podTemplate.spec.volumes = podTemplate.spec.volumes || [];
        podTemplate.spec.volumes.push(newVolume);
      }

      var humanizeKind = $filter('humanizeKind');
      var sourceKind = humanizeKind(ctrl.secret.kind);
      var targetKind = humanizeKind(applicationToUpdate.kind);
      var context = {
        namespace: ctrl.project.metadata.name
      };

      DataService.update(APIService.kindToResource(applicationToUpdate.kind), applicationToUpdate.metadata.name, applicationToUpdate, context).then(
        function() {
          NotificationsService.addNotification({
            type: "success",
            message: "Successfully added " + sourceKind + " " + ctrl.secret.metadata.name + " to " + targetKind + " " + applicationToUpdate.metadata.name + ".",
            links: [{
              href: Navigate.resourceURL(applicationToUpdate),
              label: "View " + humanizeKind(applicationToUpdate.kind, true)
            }]
          });
          if (angular.isFunction(ctrl.onComplete)) {
            ctrl.onComplete();
          }
        },
        function(result) {
          var getErrorDetails = $filter('getErrorDetails');

          NotificationsService.addNotification({
            type: "error",
            message: "An error occurred  adding " + sourceKind + " " + ctrl.secret.metadata.name + " to " + targetKind + " " + applicationToUpdate.metadata.name + ". " +
            getErrorDetails(result)
          });
        }).finally(function() {
          ctrl.disableInputs = false;
        }
      );
    };
  }
})();
