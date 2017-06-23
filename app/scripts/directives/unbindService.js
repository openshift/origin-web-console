'use strict';

(function() {

  angular.module('openshiftConsole').component('unbindService', {
    controller: [
      '$scope',
      '$filter',
      'DataService',
      UnbindService
    ],
    controllerAs: 'ctrl',
    bindings: {
      target: '<',
      bindings: '<',
      applicationsByBinding: '<',
      onClose: '<'
    },
    templateUrl: 'views/directives/unbind-service.html'
  });

  function UnbindService($scope, $filter, DataService) {
    var ctrl = this;
    var validityWatcher;
    var context;
    var serviceInstanceDisplayName = $filter('serviceInstanceDisplayName');

    var unbindService = function() {
      ctrl.deletedBinding = _.first(_.filter(ctrl.bindings, {metadata: {name: ctrl.selectedBinding}}));
      ctrl.appsForDeletedBinding = ctrl.appsForBinding(ctrl.selectedBinding);
      DataService.delete({
        group: 'servicecatalog.k8s.io',
        resource: 'bindings'
      },
      ctrl.selectedBinding,
      context,
      { propagationPolicy: null })
      .then(_.noop, function(err) {
        ctrl.error = err;
      });
    };

    var setupValidator = function() {
      var firstStep = _.first(ctrl.steps);
      firstStep.valid = false;
        validityWatcher = $scope.$watch("ctrl.selectedBinding", function(selectedBinding) {
          firstStep.valid = !!selectedBinding;
        });
    };

    var tearDownValidator = function() {
      if(validityWatcher) {
        validityWatcher();
        validityWatcher = undefined;
      }
    };

    var showDeleteForm = function() {
      ctrl.nextTitle = 'Delete';
      setupValidator();
    };

    var showResults = function() {
      ctrl.nextTitle = 'Close';
      ctrl.wizardComplete = true;
      unbindService();
      tearDownValidator();
    };

    ctrl.$onInit = function() {
      var formStepLabel = (ctrl.target.kind === 'Instance') ? 'Applications' : 'Services';
      ctrl.displayName = serviceInstanceDisplayName(ctrl.target);
      ctrl.steps = [{
        id: 'deleteForm',
        label: formStepLabel,
        view: 'views/directives/bind-service/delete-binding-select-form.html',
        onShow: showDeleteForm
      }, {
        id: 'results',
        label: 'Results',
        view: 'views/directives/bind-service/delete-binding-result.html',
        onShow: showResults
      }];

      context = {
        namespace: _.get(ctrl.target, 'metadata.namespace')
      };
      ctrl.selectedBinding = (_.size(ctrl.bindings) === 1) ? _.first(ctrl.bindings).metadata.name : null;
    };

    ctrl.appsForBinding = function(bindingName) {
      return _.get(ctrl.applicationsByBinding, bindingName);
    };

    ctrl.closeWizard = function() {
      if (_.isFunction(ctrl.onClose)) {
        ctrl.onClose();
      }
    };

    ctrl.$onDestroy = function() {
      tearDownValidator();
    };

  }

})();
