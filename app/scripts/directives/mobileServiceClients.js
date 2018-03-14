'use strict';

(function() {
  angular.module('openshiftConsole').component('mobileServiceClients', {
    controller: [
      '$filter',
      'MobileClientsService',
      'NotificationsService',
      MobileServiceClientsCtrl
    ],
    bindings: {
      project: '<',
      serviceInstance: '<',
      mobileClients: '<'
    },
    templateUrl: 'views/directives/mobile-service-clients.html'
  });

  function MobileServiceClientsCtrl(
                       $filter,
                       MobileClientsService,
                       NotificationsService) {
    var ctrl = this;
    var context = {namespace: _.get(ctrl, 'project.metadata.name')};
    var getErrorDetails = $filter('getErrorDetails');

    ctrl.$doCheck = function() {
      ctrl.associatedClients = MobileClientsService.filterNotExcluded(ctrl.serviceInstance, ctrl.mobileClients);
      ctrl.excludedClients = MobileClientsService.filterExcluded(ctrl.serviceInstance, ctrl.mobileClients);
      ctrl.hasExcludedClients = !_.isEmpty(ctrl.excludedClients);
    };

    ctrl.excludeClient = function(mobileClient) {
      MobileClientsService.excludeClient(mobileClient, ctrl.serviceInstance, context)
      .then(function() {
          NotificationsService.addNotification({
            type: 'success',
            message: 'Mobile client ' + _.get(mobileClient, 'spec.name') + ' excluded from ' + _.get(ctrl.serviceInstance, 'metadata.name') + '.'
          });
        }).catch(function(error) {
          NotificationsService.addNotification({
            type: 'error',
            message: 'Failed to exclude mobile client ' + _.get(mobileClient, 'spec.name') + '.',
            details: getErrorDetails(error)
          });
        });
    };

    ctrl.addMobileClient = function(mobileClient) {
      MobileClientsService.removeFromExcluded(mobileClient, ctrl.serviceInstance, context)
        .then(function() {
          NotificationsService.addNotification({
            type: 'success',
            message: 'Successfully added ' + mobileClient.metadata.name + ' client.'
          });
        })
        .catch(function(error) {
          NotificationsService.addNotification({
            type: 'error',
            message: 'Failed to add mobile client.',
            details: getErrorDetails(error)
          });
        });
    };
  }
})();
