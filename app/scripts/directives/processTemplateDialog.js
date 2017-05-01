'use strict';

angular.module('openshiftConsole').component('processTemplateDialog', {
  controller: [
    '$scope',
    'DataService',
    ProcessTemplateDialog
  ],
  controllerAs: '$ctrl',
  bindings: {
    template: '<',
    onDialogClosed: '&'
  },
  templateUrl: 'views/directives/process-template-dialog.html'
});

function ProcessTemplateDialog($scope, DataService) {
  var ctrl = this;

  var initializeSteps = function() {
    ctrl.steps = [{
      id: 'configuration',
      label: 'Configuration',
      selected: true,
      visited: true
    }, {
      id: 'results',
      label: 'Results'
    }];
    ctrl.currentStep = ctrl.steps[0];
  };

  ctrl.$onInit = function() {
    ctrl.alerts = {};
    ctrl.loginBaseUrl = DataService.openshiftAPIBaseUrl();
  };

  var getIconClass = function() {
    var icon = _.get(ctrl, 'template.metadata.annotations.iconClass', 'fa fa-cubes');
    return (icon.indexOf('icon-') !== -1) ? 'font-icon ' + icon : icon;
  };

  ctrl.$onChanges = function(changes) {
    if (changes.template) {
      initializeSteps();
      ctrl.iconClass = getIconClass();
    }
  };

  var showResults = function() {
    ctrl.steps[0].selected = false;
    ctrl.currentStep = ctrl.steps[1];
    ctrl.currentStep.selected = true;
    ctrl.currentStep.visited = true;
  };

  ctrl.instantiateTemplate = function() {
    $scope.$broadcast('instantiateTemplate');
  };

  $scope.$on('templateInstantiated', function(event, message) {
    ctrl.selectedProject = message.project;
    showResults();
  });

  ctrl.close = function() {
    var cb = ctrl.onDialogClosed();
    if (_.isFunction(cb)) {
      cb();
    }
  };
}
