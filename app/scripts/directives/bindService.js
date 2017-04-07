'use strict';

angular.module('openshiftConsole').component('bindService', {
  controller: [
    '$filter',
    'DataService',
    'DNS1123_SUBDOMAIN_VALIDATION',
    BindService
  ],
  controllerAs: 'ctrl',
  bindings: {
    target: '<',
    serviceInstances: '<',
    serviceClasses: '<',
    onClose: '<'
  },
  templateUrl: 'views/directives/bind-service.html'
});

function BindService($filter,
                     DataService,
                     DNS1123_SUBDOMAIN_VALIDATION) {
  var ctrl = this;

  ctrl.steps = [{
    id: 'services',
    label: 'Services',
    view: 'views/directives/bind-service/select-service.html'
  }, {
    label: 'Results',
    id: 'results',
    view: 'views/directives/bind-service/results.html'
  }];

  ctrl.$onInit = function() {
    // TODO: handle not having any service instances, or handle path where coming into binding from svc instance
    ctrl.gotoStep(ctrl.steps[0]);
  };

  var statusCondition = $filter('statusCondition');
  ctrl.$onChanges = function(changes) {
    if (changes.serviceInstances && !ctrl.serviceToBind) {
      var newestReady;
      var newestNotReady;
      _.each(ctrl.serviceInstances, function(instance) {
        var ready = _.get(statusCondition(instance, 'Ready'), 'status') === 'True';
        if (ready && (!newestReady || instance.metadata.creationTimestamp > newestReady.metadata.creationTimestamp)) {
          newestReady = instance;
        }
        if (!ready && (!newestNotReady || instance.metadata.creationTimestamp > newestNotReady.metadata.creationTimestamp)) {
          newestNotReady = instance;
        }
      });
      ctrl.serviceToBind = _.get(newestReady, 'metadata.name') || _.get(newestNotReady, 'metadata.name');
    }

    // wait till both service instances and service classes are available so that the sort is stable and items dont jump around
    if ((changes.serviceInstances || changes.serviceClasses) && ctrl.serviceClasses && ctrl.serviceInstances) {
      var instances = _.toArray(ctrl.serviceInstances);
      instances.sort(function(left, right) {
        var leftName = _.get(ctrl.serviceClasses, [left.spec.serviceClassName, 'osbMetadata', 'displayName']) || left.spec.serviceClassName;
        var rightName = _.get(ctrl.serviceClasses, [left.spec.serviceClassName, 'osbMetadata', 'displayName']) || right.spec.serviceClassName;

        // Fall back to sorting by `metadata.name` if the display names are the
        // same so that the sort is stable.
        if (leftName === rightName) {
          leftName = _.get(left, 'metadata.name', '');
          rightName = _.get(right, 'metadata.name', '');
        }

        return leftName.localeCompare(rightName);
      });
      ctrl.orderedServiceInstances = instances;
    }
  };

  var gotoStepID = function(id) {
    var step = _.find(ctrl.steps, { id: id });
    ctrl.gotoStep(step);
  };

  ctrl.gotoStep = function(step) {
    _.each(ctrl.steps, function(st) {
      st.selected = false;
    });
    if (ctrl.currentStep) {
      ctrl.currentStep.visited = true;
    }
    ctrl.currentStep = step;
    ctrl.currentStep.selected = true;
  };

  ctrl.stepClick = function(step) {
    // Prevent returning to previous steps if the order is complete.
    if (ctrl.wizardComplete) {
      return;
    }

    if (!step.visited) {
      return;
    }

    ctrl.gotoStep(step);
  };

  var generateName = $filter('generateName');
  var makeBinding = function() {
    var serviceInstanceName = _.get(ctrl.serviceInstances[ctrl.serviceToBind], 'metadata.name');
    // TODO - would be better if generateName could take in an optional maxlength
    var truncatedSvcInstanceName = _.trunc(serviceInstanceName, DNS1123_SUBDOMAIN_VALIDATION.maxlength - 6);
    ctrl.generatedSecretName = generateName(truncatedSvcInstanceName + '-');
    var binding = {
      kind: 'Binding',
      apiVersion: 'servicecatalog.k8s.io/v1alpha1',
      metadata: {
        generateName: serviceInstanceName + '-'
      },
      spec: {
        instanceRef: {
          name: serviceInstanceName
        },
        secretName: ctrl.generatedSecretName
      }
    };

    return binding;
  };

  ctrl.bindService = function() {
    var context = {
      namespace: _.get(ctrl.serviceInstances[ctrl.serviceToBind], 'metadata.namespace')
    };
    DataService.create({
      group: 'servicecatalog.k8s.io',
      resource: 'bindings'
    }, null, makeBinding(), context).then(function(binding) {
      ctrl.binding = binding;

      DataService.watchObject({
        group: 'servicecatalog.k8s.io',
        resource: 'bindings'
      }, _.get(ctrl.binding, 'metadata.name'), context, function(binding) {
        ctrl.binding = binding;
      });

      ctrl.wizardComplete = true;
      ctrl.error = null;
      gotoStepID('results');
    }, function(e) {
      ctrl.error = e;
    });
  };

  ctrl.closeWizard = function() {
    if (_.isFunction(ctrl.onClose)) {
      ctrl.onClose();
    }
  };

}
