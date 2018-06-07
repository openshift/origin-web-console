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
      if (changes.mobileClient && changes.mobileClient.currentValue){
        ctrl.mobileClient = changes.mobileClient.currentValue;
      }
      if (changes.serviceClasses && changes.serviceClasses.currentValue){
        ctrl.serviceClasses = changes.serviceClasses.currentValue;
      }

      if (ctrl.mobileClient && ctrl.serviceClasses && watches.length === 0) {
        watches.push(DataService.watch(serviceBindingsVersion, {namespace: ctrl.context}, function(bindingsData) {
          ctrl.bindings = _.filter(bindingsData.by('metadata.name'), function(binding) {
            return _.get(binding.metadata.annotations, 'binding.aerogear.org/consumer') === _.get(ctrl, 'mobileClient.metadata.name');
          });
          ctrl.addDetailsToBindings();
        }));
      }
    };

    ctrl.addDetailsToBindings = function () {
      DataService.list(serviceInstanceVersion, {namespace: ctrl.context}, function (serviceInstances) {
        _.each(ctrl.bindings, function(binding) {
          var bindingProviderInstance = serviceInstances._data[_.get(binding.metadata.annotations, 'binding.aerogear.org/provider')];
          var serviceClass = ctrl.serviceClasses[_.get(bindingProviderInstance, "spec.clusterServiceClassRef.name")];
          binding.displayName = _.get(serviceClass, "spec.externalMetadata.displayName");
          binding.serviceInstanceName = _.get(bindingProviderInstance, "metadata.name");
          binding.description = _.get(serviceClass, "spec.description");
          binding.sdkDocs = _.get(serviceClass, "spec.externalMetadata.sdk-docs-" + ctrl.mobileClient.spec.clientType);
          binding.logo = _.get(serviceClass, "spec.externalMetadata.imageUrl");
        });
      });
    };
  }
})();
