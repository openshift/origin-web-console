'use strict';

angular.module('openshiftConsole').component('serviceInstanceRow', {
  controller: [
    '$filter',
    'DataService',
    'ListRowUtils',
    '$uibModal',
    ServiceInstanceRow
  ],
  controllerAs: 'row',
  bindings: {
    apiObject: '<',
    state: '<'
  },
  templateUrl: 'views/overview/_service-instance-row.html'
});

function ServiceInstanceRow($filter, DataService, rowMethods, $uibModal) {
  var row = this;
  _.extend(row, rowMethods.ui);

  var getErrorDetails = $filter('getErrorDetails');

  var getDisplayName = function() {
    var serviceClassName = row.apiObject.spec.serviceClassName;
    var instanceName = row.apiObject.metadata.name;
    var serviceClassDisplayName = _.get(row, ['state','serviceClasses', serviceClassName, 'osbMetadata', 'displayName']);
    return serviceClassDisplayName || serviceClassName || instanceName;
  };

  var getDescription = function() {
    var serviceClassName = row.apiObject.spec.serviceClassName;
    return _.get(row, ['state','serviceClasses', serviceClassName, 'description']);
  };

  var getBindings = function() {
    return _.filter(row.state.bindings, function(binding) {
      return binding.spec.instanceRef.name === row.apiObject.metadata.name;
    });
  };

  row.$onChanges = function() {
    row.notifications = rowMethods.getNotifications(row.apiObject, row.state);
    row.displayName = getDisplayName();
    row.description = getDescription();
    row.instanceBindings = getBindings();
  };

  row.getSecretForBinding = function(binding) {
    return binding && _.get(row, ['state', 'secrets', binding.spec.secretName]);
  };


  row.deprovision = function() {
    var modalScope = {
      alerts: {
        deprovision: {
          type: 'error',
          message: 'Service \'' + row.apiObject.spec.serviceClassName + '\' will be deleted and no longer available.'
        }
      },
      detailsMarkup: 'Deprovision Service?',
      okButtonText: 'Deprovision',
      okButtonClass: 'btn-danger',
      cancelButtonText: 'Cancel'
    };
    // TODO: we probably have to handle bindings in here.
    // either:
    // - automatically remove the bindings
    // - tell the user they must manually unbind before continue
    $uibModal.open({
      animation: true,
      templateUrl: 'views/modals/confirm.html',
      controller: 'ConfirmModalController',
      resolve: {
        modalConfig: function() {
          return modalScope;
        }
      }
    })
    .result.then(function() {
      DataService.delete({
        group: 'servicecatalog.k8s.io',
        resource: 'instances'
      },
      row.apiObject.metadata.name,
      { namespace: row.apiObject.metadata.namespace })
      .then(function() {
        row.state.alerts["start-build"] = {
          type: "success",
          message: "Successfully deprovisioned " + row.apiObject.metadata.name
        };
      }, function(err) {
        row.state.alerts["start-build"] = {
          type: "error",
          message: "An error occurred while deprovisioning " + row.apiObject.metadata.name,
          details: "Reason: " + getErrorDetails(err)
        };
      });
    });
  };

}
