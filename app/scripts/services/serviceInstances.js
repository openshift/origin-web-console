'use strict';

angular.module("openshiftConsole")
  .factory("ServiceInstancesService", function($filter,
                                               $q,
                                               $uibModal,
                                               APIService,
                                               BindingService,
                                               CatalogService,
                                               DataService,
                                               Logger,
                                               NotificationsService) {
    var getBindingsIfNecessary = function(apiObject, bindings) {
      if (angular.isDefined(bindings)) {
        return $q.when(bindings);
      }

      var context = {namespace: apiObject.metadata.namespace};
      var resource = APIService.getPreferredVersion('serviceinstancecredentials');

      return DataService.list(resource, context).then(function(serviceBindings) {
        bindings = serviceBindings.by('metadata.name');
        return BindingService.getBindingsForResource(bindings, apiObject);
      });
    };

    var deprovisionInstance = function(apiObject) {
      var context = {namespace: apiObject.metadata.namespace};
      var resource = APIService.getPreferredVersion('serviceinstances');

      NotificationsService.hideNotification("deprovision-service-error");

      // TODO - remove once this is resolved https://github.com/kubernetes-incubator/service-catalog/issues/942
      var opts = {
        propagationPolicy: null
      };

      return DataService.delete(resource, apiObject.metadata.name, context, opts).then(function() {
        NotificationsService.addNotification({
          type: "success",
          message: "Provisioned service '" + apiObject.metadata.name + "' was marked for deletion."
        });
      }, function(err) {
        NotificationsService.addNotification({
          id: "deprovision-service-error",
          type: "error",
          message: "An error occurred while deleting provisioned service " + apiObject.metadata.name + ".",
          details: $filter('getErrorDetails')(err)
        });
        Logger("An error occurred while deleting provisioned service " + apiObject.metadata.name + ".", err);
      });
    };

    var deprovisionBindings = function(apiObject, bindings) {
      if (!CatalogService.SERVICE_CATALOG_ENABLED) {
        return;
      }

      var context = {namespace: apiObject.metadata.namespace};
      var resource = APIService.getPreferredVersion('serviceinstancecredentials');
      getBindingsIfNecessary(apiObject, bindings).then(function(serviceBindings) {
        _.each(serviceBindings, function (binding) {
          if (binding.metadata.deletionTimestamp) {
            return;
          }

          DataService.delete(resource, binding.metadata.name, context)
            .then(function () {
              NotificationsService.addNotification({
                type: "success",
                message: 'Binding ' + binding.metadata.name + "' was marked for deletion."
              });
            })
            .catch(function (err) {
              NotificationsService.addNotification({
                type: "error",
                message: 'Binding ' + binding.metadata.name + "' could not be deleted.",
                details: $filter('getErrorDetails')(err)
              });
              Logger.error('Binding ' + binding.metadata.name + "' could not be deleted.", err);
            });
        });
      });
    };

    var deprovision = function (apiObject, bindings) {
      var modalInstance;

      var modalScope = {
        kind: apiObject.kind,
        displayName: apiObject.metadata.name,
        okButtonText: 'Delete',
        okButtonClass: 'btn-danger',
        cancelButtonText: 'Cancel',
        delete: function() {
          modalInstance.close('delete');
        }
      };

      modalInstance =  $uibModal.open({
        animation: true,
        templateUrl: 'views/modals/delete-resource.html',
        controller: 'ConfirmModalController',
        resolve: {
          modalConfig: function() {
            return modalScope;
          }
        }
      });

      return modalInstance.result.then(function() {
        deprovisionBindings(apiObject, bindings);
        deprovisionInstance(apiObject);
      });
    };

    return {
      deprovision: deprovision
    };
  });

