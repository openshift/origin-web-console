'use strict';

(function() {
  angular.module('openshiftConsole').component('mobileServiceSdkDocs', {
    controller: [
      "APIService",
      "DataService",
      MobileServiceSdkDocs
    ],
    controllerAs: 'ctrl',
    bindings: {
      context: '<',
      mobileClient: '<',
      serviceClasses: '<'
    },
    templateUrl: 'views/_mobile-service-sdk-docs.html'
  });



  function MobileServiceSdkDocs(APIService, DataService) {
    var serviceBindingsVersion = APIService.getPreferredVersion('servicebindings');
    var serviceInstanceVersion = APIService.getPreferredVersion('serviceinstances');

    var ctrl = this;
    var watches = [];

    ctrl.$onChanges = function(changes) {
      var clientChanges = _.get(changes, 'mobileClient.currentValue');
      var serviceClassChanges = _.get(changes, 'serviceClasses.currentValue');

      if (clientChanges && serviceClassChanges && watches.length === 0) {
        watches.push(DataService.watch(serviceBindingsVersion, {namespace: ctrl.context}, function(bindingsData) {
          ctrl.bindings = _.filter(bindingsData.by('metadata.name'), function(binding) {
            return _.get(binding, ['metadata', 'annotations', 'binding.aerogear.org/consumer']) === _.get(ctrl, 'mobileClient.metadata.name');
          });
          ctrl.addDetailsToBindings();
        }));
      }
    };

    ctrl.addDetailsToBindings = function () {
      DataService.list(serviceInstanceVersion, {namespace: ctrl.context}, function (serviceInstances) {
        var serviceInstancesData = serviceInstances.by('metadata.name');
        ctrl.serviceSdkInfo = _.map(ctrl.bindings, function(binding) {
          var bindingProviderInstance = serviceInstancesData[_.get(binding, ['metadata', 'annotations', 'binding.aerogear.org/provider'])];
          var serviceClass = ctrl.serviceClasses[_.get(bindingProviderInstance, 'spec.clusterServiceClassRef.name')];

          return {
            displayName: _.get(serviceClass, 'spec.externalMetadata.displayName'),
            serviceInstanceName: _.get(bindingProviderInstance, 'metadata.name'),
            description: _.get(serviceClass, 'spec.description'),
            sdkDocs: _.get(serviceClass, 'spec.externalMetadata.sdk-docs-' + ctrl.mobileClient.spec.clientType),
            logo: _.get(serviceClass, 'spec.externalMetadata.imageUrl')
          };
        });
      });
    };

    ctrl.$onDestroy = function() {
      DataService.unwatchAll(watches);
    };
  }
})();
