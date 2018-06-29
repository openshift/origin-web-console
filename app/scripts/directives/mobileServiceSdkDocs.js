'use strict';

(function() {
  angular.module('openshiftConsole').component('mobileServiceSdkDocs', {
    controller: [
      "$filter",
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



  function MobileServiceSdkDocs($filter, APIService, DataService) {
    var serviceBindingsVersion = APIService.getPreferredVersion('servicebindings');
    var serviceInstanceVersion = APIService.getPreferredVersion('serviceinstances');
    var mobileBindingConsumerID = $filter('annotationName')('mobileBindingConsumerId');
    var mobileBindingProviderID = $filter('annotationName')('mobileBindingProviderId');

    var ctrl = this;
    var watches = [];

    ctrl.$onChanges = function(changes) {
      var clientChanges = _.get(changes, 'mobileClient.currentValue');
      var serviceClassChanges = _.get(changes, 'serviceClasses.currentValue');

      if (clientChanges && serviceClassChanges && watches.length === 0) {
        watches.push(DataService.watch(serviceBindingsVersion, {namespace: ctrl.context}, function(bindingsData) {
          var mobileClientID = _.get(ctrl, 'mobileClient.metadata.name');
          ctrl.bindings = _.filter(bindingsData.by('metadata.name'), function(binding) {
            return _.get(binding, ['metadata', 'annotations', mobileBindingConsumerID]) === mobileClientID;
          });
          ctrl.createServiceSDKInfo();
        }));
      }
    };

    ctrl.createServiceSDKInfo = function () {
      DataService.list(serviceInstanceVersion, {namespace: ctrl.context}, function (serviceInstances) {
        var serviceInstancesData = serviceInstances.by('metadata.name');
        ctrl.serviceSdkInfo = _(ctrl.bindings)
          .uniqBy(function(binding) {
            var bindingProviderInstance = serviceInstancesData[_.get(binding, ['metadata', 'annotations', mobileBindingProviderID], "")];
            return _.get(bindingProviderInstance, 'metadata.name');
          })
          .map(function(binding) {
            var bindingProviderInstance = serviceInstancesData[_.get(binding, ['metadata', 'annotations', mobileBindingProviderID], "")];
            var serviceClass = ctrl.serviceClasses[_.get(bindingProviderInstance, 'spec.clusterServiceClassRef.name')];

            return {
              displayName: _.get(serviceClass, 'spec.externalMetadata.displayName'),
              serviceInstanceName: _.get(bindingProviderInstance, 'metadata.name'),
              description: _.get(serviceClass, 'spec.description'),
              sdkDocs: _.get(serviceClass, 'spec.externalMetadata.sdk-docs-' + ctrl.mobileClient.spec.clientType),
              logo: _.get(serviceClass, 'spec.externalMetadata.imageUrl'),
              iconClass: _.get(serviceClass, ['spec', 'externalMetadata', 'console.openshift.io/iconClass'])
            };
          })
          .value();
      });
    };

    ctrl.$onDestroy = function() {
      DataService.unwatchAll(watches);
    };
  }
})();