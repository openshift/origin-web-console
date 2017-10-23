'use strict';

angular.module('openshiftConsole').component('serviceInstanceBindings', {
  controller: [
    '$filter',
    'APIService',
    'BindingService',
    ServiceInstanceBindings
  ],
  controllerAs: '$ctrl',
  bindings: {
    isOverview: '<?',
    showHeader: '<?',
    project: '<',
    bindings: '<',
    serviceInstance: '<',
    serviceClass: '<',
    servicePlan: '<'
  },
  templateUrl: 'views/directives/service-instance-bindings.html'
});


function ServiceInstanceBindings($filter,
                                 APIService,
                                 BindingService) {
  var ctrl = this;
  var canI = $filter('canI');
  var serviceBindingsVersion = ctrl.serviceBindingsVersion = APIService.getPreferredVersion('servicebindings');

  var checkBindable = function() {
    ctrl.bindable = canI(serviceBindingsVersion, 'create') &&
                    BindingService.isServiceBindable(ctrl.serviceInstance,
                                                     ctrl.serviceClass,
                                                     ctrl.servicePlan);
  };

  ctrl.createBinding = function() {
    ctrl.overlayPanelVisible = true;
  };

  ctrl.closeOverlayPanel = function() {
    ctrl.overlayPanelVisible = false;
  };

  ctrl.$onChanges = function() {
    checkBindable();
  };
}
