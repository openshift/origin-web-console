'use strict';

(function() {
  angular.module('openshiftConsole').component('editEnvironmentVariables', {
    controller: [
      '$filter',
      'APIService',
      'DataService',
      'EnvironmentService',
      'NotificationsService',
      EditEnvironmentVariables
    ],
    controllerAs: '$ctrl',
    bindings: {
      apiObject: '<',
      ngReadonly: '<',
      disableValueFrom: '<'
    },
    templateUrl: 'views/directives/edit-environment-variables.html'
  });

  function EditEnvironmentVariables($filter,
                                    APIService,
                                    DataService,
                                    EnvironmentService,
                                    NotificationsService) {
    var ctrl = this;

    var configMapsVersion = APIService.getPreferredVersion('configmaps');
    var secretsVersion = APIService.getPreferredVersion('secrets');

    var displayKind, name, rgv, saveEnvPromise;
    var previousEnvConflict = false;
    var configMapDataOrdered = [];
    var secretDataOrdered = [];
    var valueFromDataLoaded = false;

    var canI = $filter('canI');
    var getErrorDetails = $filter('getErrorDetails');
    var humanizeKind = $filter('humanizeKind');
    var orderByDisplayName = $filter('orderByDisplayName');

    var updateEnvironment = function(currentValue, previousValue) {
      if (previousEnvConflict) {
        return;
      }

      if (!ctrl.form || ctrl.form.$pristine || !ctrl.updatedObject) {
        ctrl.updatedObject = EnvironmentService.copyAndNormalize(currentValue);
        return;
      }

      // The env var form has changed and the deployment config has been
      // updated. See if there were any background changes to the environment
      // variables. If not, merge the environment edits into the updated
      // deployment config object.
      if (EnvironmentService.isEnvironmentEqual(currentValue, previousValue)) {
        ctrl.updatedObject = EnvironmentService.mergeEdits(ctrl.updatedObject, currentValue);
        return;
      }

      previousEnvConflict = true;
      NotificationsService.addNotification({
        type: "warning",
        message: "The environment variables for the " + displayKind + " have been updated in the background.",
        details: "Saving your changes may create a conflict or cause loss of data."
      });
    };

    var loadConfigMaps = function() {
      DataService.list(configMapsVersion, {
        namespace: ctrl.apiObject.metadata.namespace
      }).then(function(resp) {
        configMapDataOrdered = orderByDisplayName(resp.by("metadata.name"));
        ctrl.valueFromObjects = configMapDataOrdered.concat(secretDataOrdered);
      });
    };

    var loadSecrets = function() {
      if (!canI('secrets', 'list')) {
        return;
      }

      DataService.list(secretsVersion, {
        namespace: ctrl.apiObject.metadata.namespace
      }).then(function(resp) {
        secretDataOrdered = orderByDisplayName(resp.by("metadata.name"));
        ctrl.valueFromObjects = configMapDataOrdered.concat(secretDataOrdered);
      });
    };

    var loadValueFromData = function() {
      if (valueFromDataLoaded) {
        return;
      }

      valueFromDataLoaded = true;
      loadConfigMaps();
      loadSecrets();
    };

    var updateAPIObject = function(currentValue, previousValue) {
      displayKind = humanizeKind(currentValue.kind);
      name = currentValue.metadata.name;
      rgv = APIService.objectToResourceGroupVersion(currentValue);
      ctrl.canIUpdate = canI(rgv, 'update');
      if (saveEnvPromise) {
        saveEnvPromise.finally(function() {
          updateEnvironment(currentValue, previousValue);
        });
      } else {
        updateEnvironment(currentValue, previousValue);
      }
      ctrl.containers = EnvironmentService.getContainers(ctrl.updatedObject);

      if (!ctrl.disableValueFrom && !ctrl.ngReadonly && ctrl.canIUpdate) {
        loadValueFromData();
      }
    };

    ctrl.$onChanges = function(changes) {
      if (changes.apiObject && changes.apiObject.currentValue) {
        updateAPIObject(changes.apiObject.currentValue, changes.apiObject.previousValue);
      }
    };

    ctrl.save = function() {
      var errorID = 'save-env-error-' + name;
      NotificationsService.hideNotification(errorID);
      EnvironmentService.compact(ctrl.updatedObject);
      saveEnvPromise = DataService.update(rgv, name, ctrl.updatedObject, {
        namespace: ctrl.updatedObject.metadata.namespace
      });
      saveEnvPromise.then(function success(){
        NotificationsService.addNotification({
          type: "success",
          message: "Environment variables for " + displayKind + " " + name + " were successfully updated."
        });
        ctrl.form.$setPristine();
      }, function error(e){
        NotificationsService.addNotification({
          id: errorID,
          type: "error",
          message: "An error occurred updating environment variables for " + displayKind + " " + name + ".",
          details: getErrorDetails(e)
        });
      }).finally(function() {
        saveEnvPromise = null;
      });
    };

    ctrl.clearChanges = function() {
      ctrl.updatedObject = EnvironmentService.copyAndNormalize(ctrl.apiObject);
      ctrl.containers = EnvironmentService.getContainers(ctrl.updatedObject);
      ctrl.form.$setPristine();
      previousEnvConflict = false;
    };
  }
})();
