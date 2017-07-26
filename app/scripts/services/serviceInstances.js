'use strict';

angular.module("openshiftConsole")
  .factory("ServiceInstancesService", function($filter,
                                               $uibModal,
                                               DataService,
                                               NotificationsService) {

    function deprovision(apiObject) {
      var getErrorDetails = $filter('getErrorDetails');
      var modalScope = {
        alerts: {
          deprovision: {
            type: 'error',
            message: 'Service \'' + apiObject.spec.serviceClassName + '\' will be deleted and no longer available.'
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
      return $uibModal.open({
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

        return DataService.delete({
            group: 'servicecatalog.k8s.io',
            resource: 'serviceinstances'
          },
          apiObject.metadata.name,
          { namespace: apiObject.metadata.namespace },
          { propagationPolicy: null
          }) // TODO - remove once this is resolved https://github.com/kubernetes-incubator/service-catalog/issues/942
          .then(function() {
            NotificationsService.addNotification({
              type: "success",
              message: "Successfully deleted provisioned service " + apiObject.metadata.name + "."
            });
          }, function(err) {
            NotificationsService.addNotification({
              id: "deprovision-service-error",
              type: "error",
              message: "An error occurred while deleting provisioned service " + apiObject.metadata.name + ".",
              details: getErrorDetails(err)
            });
          });
      });
    }

    return {
      deprovision: deprovision
    };
  });

