'use strict';

angular.module("openshiftConsole")
  .factory("ModalsService", function($uibModal) {
    return {
      // Show a confirm dialog using the provided modal config and return a promise.
      // See app/scripts/controllers/modals/confirmModal.js
      confirm: function(modalConfig) {
        var modalInstance = $uibModal.open({
          animation: true,
          templateUrl: 'views/modals/confirm.html',
          controller: 'ConfirmModalController',
          resolve: {
            modalConfig: modalConfig
          }
        });

        return modalInstance.result;
      }
    };
  });
