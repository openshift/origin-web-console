'use strict';

(function() {
  angular.module('openshiftConsole').component('fromFileDialog', {
    controller: [
      '$scope',
      '$timeout',
      '$routeParams',
      '$filter',
      'DataService',
      FromFileDialog
    ],
    controllerAs: '$ctrl',
    bindings: {
      project: '<', //handle create project optionally
      context: '<',
      onDialogClosed: '&'
    },
    templateUrl: 'views/directives/from-file-dialog.html'
  });

  function FromFileDialog($scope, $timeout, $routeParams, $filter, DataService) {
    var ctrl = this;
    var annotation = $filter('annotation');
    var imageForIconClass = $filter('imageForIconClass');
    var normalizeIconClass = $filter('normalizeIconClass');

    ctrl.$onInit = function() {
      ctrl.alerts = {};
      ctrl.loginBaseUrl = DataService.openshiftAPIBaseUrl();
      // if on the landing page, show the project name in next-steps
      if (!$routeParams.project) {
        ctrl.showProjectName = true;
      }
      $scope.$on('no-projects-cannot-create', function() {
        ctrl.importForm.$setValidity('required', false);
      });
    };

    function getIconClass() {
      return normalizeIconClass(_.get(ctrl, 'template.metadata.annotations.iconClass', 'fa fa-clone'));
    }

    function getImage() {
      var iconClass = _.get(ctrl, 'template.metadata.annotations.iconClass', 'fa fa-clone');
      return imageForIconClass(iconClass);
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
      ctrl.image = getImage();
      ctrl.vendor = annotation(message.template, "openshift.io/provider-display-name");
      ctrl.docUrl = annotation(ctrl.template, "openshift.io/documentation-url");
      ctrl.supportUrl = annotation(ctrl.template, "openshift.io/support-url");
      ctrl.actionLabel = "imported";
      if (message.isList) {
        ctrl.kind = null;
        ctrl.name = "YAML / JSON";
      } else if (message.resource) {
        ctrl.kind = message.resource.kind;
        ctrl.name = message.resource.metadata.name;
      }
      // Need to let the current digest loop finish so the template config step becomes visible or the wizard will throw an error
      // from the change to currentStep
      $timeout(function() {
        ctrl.currentStep = ctrl.template ? "Template Configuration" : "Results";
      },0);
    });

    $scope.$on('templateInstantiated', function(event, message) {
      ctrl.selectedProject = message.project;
      ctrl.name = $filter('displayName')(ctrl.template);
      ctrl.actionLabel = null;
      ctrl.kind = null;
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
      // Make sure current step is accurate when the back button is clicked.
      // Otherwise setting it again later to advanced the wizard does nothing
      // since the value hasn't changed.
      ctrl.currentStep = step.title;
      if (step.stepId === 'results') {
        ctrl.nextButtonTitle = "Close";
        ctrl.wizardDone = true;
      } else {
        ctrl.nextButtonTitle = "Create";
      }
    };

    ctrl.currentStep = "YAML / JSON";

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
