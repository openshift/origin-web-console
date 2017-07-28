'use strict';

(function() {
  angular.module('openshiftConsole').component('fromFileDialog', {
    controller: [
      '$scope',
      '$timeout',
      'DataService',
      FromFileDialog
    ],
    controllerAs: '$ctrl',
    bindings: {
      visible: '<',
      project: '<', //handle create project optionally
      context: '<',
      onDialogClosed: '&'
    },
    templateUrl: 'views/directives/from-file-dialog.html'
  });

  function FromFileDialog($scope, $timeout, DataService) {
    var ctrl = this;

    ctrl.$onInit = function() {
      ctrl.alerts = {};
      ctrl.loginBaseUrl = DataService.openshiftAPIBaseUrl();
    };

    function getIconClass() {
      var icon = _.get(ctrl, 'template.metadata.annotations.iconClass', 'fa fa-clone');
      return (icon.indexOf('icon-') !== -1) ? 'font-icon ' + icon : icon;
    }

    ctrl.importFile = function() {
      $scope.$broadcast('importFileFromYAMLOrJSON');
    };

    ctrl.instantiateTemplate = function() {
      $scope.$broadcast('instantiateTemplate');
    };

    $scope.$on('fileImportedFromYAMLOrJSON', function(event, message) {
      ctrl.selectedProject = message.project;
      ctrl.template = message.template;
      ctrl.iconClass = getIconClass();
      // Need to let the current digest loop finish so the template config step becomes visible or the wizard will throw an error
      // from the change to currentStep
      $timeout(function() {
        ctrl.currentStep = ctrl.template ? "Template Configuration" : "Results";
      },0);
    });

    $scope.$on('templateInstantiated', function(event, message) {
      ctrl.selectedProject = message.project;
      ctrl.currentStep = "Results";
    });

    ctrl.close = function() {
      ctrl.template = null;
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
        ctrl.nextButtonTitle = "Create";
      }
    };

    ctrl.currentStep = "JSON / YAML";

    ctrl.nextCallback = function (step) {
      if (step.stepId === 'file') {
        ctrl.importFile();
        return false;  // don't actually navigate yet
      }
      else if (step.stepId === 'template') {
        ctrl.instantiateTemplate();
        return false;
      }
      else if (step.stepId === 'results') {
        ctrl.close();
        return false;
      }
      return true;
    };
  }
})();
