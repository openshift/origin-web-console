'use strict';

(function() {
  angular.module('openshiftConsole').component('serviceBinding', {
    controller: [
      "APIService",
      "ServiceInstancesService",
      ServiceBinding
    ],
    controllerAs: '$ctrl',
    bindings: {
      namespace: '<',
      binding: '<',
      refApiObject: '<?',
      serviceClasses: '<',
      serviceInstances: '<',
      isOverview: '<?'
    },
    templateUrl: 'views/directives/_service-binding.html'
  });

  function ServiceBinding(APIService,
                          ServiceInstancesService) {
    var ctrl = this;
    ctrl.serviceBindingsVersion = APIService.getPreferredVersion('servicebindings');

    var updateServiceClass = function() {
      if (_.get(ctrl.refApiObject, 'kind') !== 'ServiceInstance') {
        var instanceName = _.get(ctrl.binding, 'spec.instanceRef.name');
        var instance = _.get(ctrl.serviceInstances, [instanceName]);
        var serviceClassName = ServiceInstancesService.getServiceClassNameForInstance(instance);
        ctrl.serviceClass = _.get(ctrl.serviceClasses, [serviceClassName]);
      }
    };

    this.$onChanges = function(changes) {
      if (changes.binding || changes.serviceInstances || changes.serviceClasses) {
        updateServiceClass();
      }
    };
  }
})();
