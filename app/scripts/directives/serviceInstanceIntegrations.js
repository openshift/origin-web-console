'use strict';

angular.module('openshiftConsole').component('serviceInstanceIntegrations', {
  controller: serviceInstanceIntegrationsController,
  controllerAs: '$ctrl',
  bindings: {
    integrations : '<',
    consumerService: '<?'
  },
  templateUrl: 'views/directives/service-instance-integrations.html'
});


function serviceInstanceIntegrationsController() {}
