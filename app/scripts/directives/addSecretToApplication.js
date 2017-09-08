"use strict";
(function() {
  angular.module("openshiftConsole").component('addSecretToApplication', {
    controller: [
      '$filter',
      '$scope',
      'APIService',
      'ApplicationsService',
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

  function AddSecretToApplication($filter, $scope, APIService, ApplicationsService, DataService, Navigate, NotificationsService, StorageService) {
    var ctrl = this;

    var getApplications = function() {
      var context = {
        namespace: ctrl.project.metadata.name
      };
      ApplicationsService.getApplications(context).then(function(applications) {
        ctrl.applications = applications;
        ctrl.updating = false;
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

    var isContainerSelected = function(container) {
      return ctrl.attachAllContainers || ctrl.attachContainers[container.name];
    };

    ctrl.$postLink = function() {
      $scope.$watch(function() {
        return ctrl.application;
      }, function() {
        // Look at the existing mount paths so that we can warn if the new value is not unique.
        var podTemplate = _.get(ctrl.application, 'spec.template');
        ctrl.existingMountPaths = StorageService.getMountPaths(podTemplate);
        ctrl.attachAllContainers = true;
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
          if (isContainerSelected(container)) {
            container.envFrom = container.envFrom || [];
            container.envFrom.push(newEnvFrom);
          }
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
          if (isContainerSelected(container)) {
            container.volumeMounts = container.volumeMounts || [];
            container.volumeMounts.push(newVolumeMount);
          }
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
