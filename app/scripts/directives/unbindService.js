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
      DataService.delete({
        group: 'servicecatalog.k8s.io',
        resource: 'bindings'
      }, ctrl.selectedBinding.metadata.name, context).then(_.noop, function(err) {
        ctrl.error = err;
      });
    };

    var setupValidator = function() {
      var firstStep = _.first(ctrl.steps);
      firstStep.valid = false;
      // TODO: auto-select if one option is kludgy. will follow-on a fix
      // if(_.size(ctrl.bindings) === 1) {
      //   firstStep.valid = true;
      //   ctrl.selectedBinding = _.first(ctrl.bindings);
      // } else {
        validityWatcher = $scope.$watch("ctrl.selectedBinding", function(selectedBinding) {
          firstStep.valid = !!selectedBinding;
        });
      // }
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
    };

    // TODO: sort bindings by app in overview && eliminate this filter function
    ctrl.firstAppForBindingName = function(binding) {
      var sorted = binding && _.sortBy(ctrl.appsForBinding(binding.metadata.name), 'metadata.name');
      return _.get(_.first(sorted), ['metadata', 'name']);
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
