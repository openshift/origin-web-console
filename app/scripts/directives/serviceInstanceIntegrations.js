'use strict';

angular.module('openshiftConsole').component('serviceInstanceIntegrations', {
  controller: [
    'APIService',
    'DataService',
    ServiceInstanceIntegrations
  ],
  controllerAs: '$ctrl',
  bindings: {
    integrations: '<',
    consumerService: '<'
  },
  templateUrl: 'views/directives/service-instance-integrations.html'
});

function ServiceInstanceIntegrations(APIService, DataService) {
  var ctrl = this;

  var serviceClassesPreferredVersion = APIService.getPreferredVersion('clusterserviceclasses');

  DataService.list(serviceClassesPreferredVersion, {})
  .then(function(serviceClasses) {
    ctrl.integrationsData = _.filter(serviceClasses.by('metadata.name'), function(serviceClass) {
      var serviceClassName = _.get(serviceClass, 'spec.externalMetadata.serviceName');
      return ctrl.integrations.contains(serviceClassName);
    });
  });
}