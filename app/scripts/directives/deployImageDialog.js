'use strict';

(function() {
  angular.module('openshiftConsole').component('deployImageDialog', {
    controller: [
      '$scope',
      'DataService',
      DeployImageDialog
    ],
    controllerAs: '$ctrl',
    bindings: {
      project: '<', //handle create project optionally
      context: '<',
      onDialogClosed: '&'
    },
    templateUrl: 'views/directives/deploy-image-dialog.html'
  });

  function DeployImageDialog($scope, DataService) {
    var ctrl = this;

    ctrl.$onInit = function() {
      ctrl.loginBaseUrl = DataService.openshiftAPIBaseUrl();
      ctrl.currentStep = "Image";
    };

    ctrl.deployImage = function() {
      $scope.$broadcast('newAppFromDeployImage');
    };

    $scope.$on('deployImageNewAppCreated', function(event, message) {
      ctrl.selectedProject = message.project;
      ctrl.deployImageNewAppCreated = true;
      ctrl.currentStep = "Results";
    });

    ctrl.close = function() {
      var cb = ctrl.onDialogClosed();
      if (_.isFunction(cb)) {
        cb();
      }
      ctrl.wizardDone = false;
      return true;
    };

    ctrl.stepChanged = function(step) {
      if (step.stepId === 'results') {
        ctrl.nextButtonTitle = "Close";
        ctrl.wizardDone = true;
      } else {
        ctrl.nextButtonTitle = "Deploy";
      }
    };

    ctrl.nextCallback = function (step) {
      if (step.stepId === 'image') {
        ctrl.deployImage();
        return false;  // don't actually navigate yet
      }
      else if (step.stepId === 'results') {
        ctrl.close();
        return false;
      }
      return true;
    };
  }
})();
