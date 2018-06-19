'use strict';

(function() {
  angular.module('openshiftConsole').component('mobileServiceClients', {
    controller: [
      'APIService',
      'DataService',
      MobileServiceClientsCtrl
    ],
    bindings: {
      project: '<',
      serviceInstance: '<',
      mobileClients: '<'
    },
    templateUrl: 'views/directives/mobile-service-clients.html'
  });

  function MobileServiceClientsCtrl(
    APIService,
    DataService
  ) {
    var ctrl = this;
    var watches = [];
    var bindingPreferredVersion = APIService.getPreferredVersion('servicebindings');

    ctrl.$onChanges = function(changes) {
      if (changes.mobileClients && changes.mobileClients.currentValue) {
        ctrl.clientNames = _.map(ctrl.mobileClients, function(client) {
          return _.get(client, 'metadata.name');
        });
      }

      if (changes.mobileClients && changes.mobileClients.currentValue &&
          changes.serviceInstance && changes.serviceInstance.currentValue &&
          !ctrl.watchSet) {

        var context = {namespace: _.get(ctrl, 'project.metadata.name')};
        watches.push(DataService.watch(bindingPreferredVersion, context, function(bindingsData) {
          ctrl.watchSet = true;
          var data = bindingsData.by('metadata.name');
          ctrl.integratedClients = _(data).filter(function(binding) {
            var bindingProviderName = _.get(binding, ['metadata', 'annotations', 'binding.aerogear.org/provider']);
            var bindingConsumerName = _.get(binding, ['metadata', 'annotations', 'binding.aerogear.org/consumer']);
            var serviceInstanceName = _.get(ctrl, 'serviceInstance.metadata.name');
            return (bindingProviderName === serviceInstanceName && _.includes(ctrl.clientNames, bindingConsumerName));
          })
          .map(function(binding) {
            var bindingConsumerName = _.get(binding, ['metadata', 'annotations', 'binding.aerogear.org/consumer']);
            return ctrl.mobileClients[bindingConsumerName];
          })
          .value();
        }));
      }
    };
  }
})();
