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
      var bindingName = ctrl.selectedBinding.metadata.name;
      // Make sure to get the unbound apps now. Otherwise they don't appear on
      // the result page since deleting the binding will remove them from the
      // map that is passed in.
      ctrl.unboundApps = ctrl.appsForBinding(bindingName);
      DataService.delete({
        group: 'servicecatalog.k8s.io',
        resource: 'bindings'
      },
      bindingName,
      context,
      { propagationPolicy: null })
      .then(_.noop, function(err) {
        ctrl.error = err;
      });
    };

    var setupValidator = function() {
      var firstStep = _.head(ctrl.steps);
      firstStep.valid = false;
      // TODO: auto-select if one option is kludgy. will follow-on a fix
      // if(_.size(ctrl.bindings) === 1) {
      //   firstStep.valid = true;
      //   ctrl.selectedBinding = _.head(ctrl.bindings);
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
