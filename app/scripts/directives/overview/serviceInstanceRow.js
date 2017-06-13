'use strict';

(function() {
  angular.module('openshiftConsole').component('serviceInstanceRow', {
    controller: [
      '$filter',
      '$uibModal',
      'DataService',
      'BindingService',
      'ListRowUtils',
      'NotificationsService',
      ServiceInstanceRow
    ],
    controllerAs: 'row',
    bindings: {
      apiObject: '<',
      state: '<',
      bindings: '<'
    },
    templateUrl: 'views/overview/_service-instance-row.html'
  });

  function ServiceInstanceRow($filter,
                              $uibModal,
                              DataService,
                              BindingService,
                              ListRowUtils,
                              NotificationsService) {
    var row = this;
    _.extend(row, ListRowUtils.ui);

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

    row.$doCheck = function() {
      row.notifications = ListRowUtils.getNotifications(row.apiObject, row.state);
      row.displayName = getDisplayName();
      row.description = getDescription();
    };

    row.getSecretForBinding = function(binding) {
      return binding && _.get(row, ['state', 'secrets', binding.spec.secretName]);
    };

    row.isBindable = BindingService.isServiceBindable(row.apiObject, row.state.serviceClasses);

    row.closeOverlayPanel = function() {
      _.set(row, 'overlay.panelVisible', false);
    };
    row.showOverlayPanel = function(panelName, state) {
      _.set(row, 'overlay.panelVisible', true);
      _.set(row, 'overlay.panelName', panelName);
      _.set(row, 'overlay.state', state);
    };

    row.deprovision = function() {
      var modalScope = {
        alerts: {
          deprovision: {
            type: 'error',
            message: 'Service \'' + row.apiObject.spec.serviceClassName + '\' will be deleted and no longer available.'
          }
        },
        detailsMarkup: 'Delete Service?',
        okButtonText: 'Delete',
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
        NotificationsService.hideNotification("deprovision-service-error");
        DataService.delete({
          group: 'servicecatalog.k8s.io',
          resource: 'instances'
        },
        row.apiObject.metadata.name,
        { namespace: row.apiObject.metadata.namespace })
        .then(function() {
          NotificationsService.addNotification({
            type: "success",
            message: "Successfully deleted " + row.apiObject.metadata.name + "."
          });
        }, function(err) {
          NotificationsService.addNotification({
            id: "deprovision-service-error",
            type: "error",
            message: "An error occurred while deleting " + row.apiObject.metadata.name + ".",
            details: getErrorDetails(err)
          });
        });
      });
    };
  }
})();
