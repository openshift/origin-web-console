'use strict';

angular.module("openshiftConsole")
  .factory("ModalsService", function($uibModal) {
    return {
      // Show a confirm dialog using the provided modal config and return a promise.
      // See app/scripts/controllers/modals/confirmModal.js
      confirm: function(modalConfig) {
        var modalInstance = $uibModal.open({
          templateUrl: 'views/modals/confirm.html',
          controller: 'ConfirmModalController',
          resolve: {
            modalConfig: modalConfig
          }
        });

        return modalInstance.result;
      },

      confirmSaveLog: function(object) {
        var modalInstance = $uibModal.open({
          templateUrl: 'views/modals/confirm-save-log.html',
          controller: 'ConfirmSaveLogController',
          resolve: {
            object: object
          }
        });

        return modalInstance.result;
      },

      showJenkinsfileExamples: function() {
        $uibModal.open({
          templateUrl: 'views/modals/jenkinsfile-examples-modal.html',
          controller: 'JenkinsfileExamplesModalController',
          size: 'lg'
        });
      },

      showComputeUnitsHelp: function() {
        $uibModal.open({
          templateUrl: 'views/modals/about-compute-units-modal.html',
          controller: 'AboutComputeUnitsModalController'
        });
      }
    };
  });
