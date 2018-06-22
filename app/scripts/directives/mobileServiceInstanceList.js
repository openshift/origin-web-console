'use strict';

(function() {
  angular.module('openshiftConsole').component('mobileServiceInstanceList', {
    controller: [
      '$filter',
      '$routeParams',
      '$scope',
      'APIService',
      'AuthorizationService',
      'BindingService',
      'DataService',
      'Navigate',
      MobileServiceInstanceList
    ],
    controllerAs: 'ctrl',
    templateUrl: 'views/_mobile-service-instance-list.html'
  });

  function MobileServiceInstanceList($filter,
                              $routeParams,
                              $scope,
                              APIService,
                              AuthorizationService,
                              BindingService,
                              DataService,
                              Navigate) {
    var ctrl = this;
    var context = {namespace: $routeParams.project};
    var serviceClassesVersion = APIService.getPreferredVersion('clusterserviceclasses');
    var serviceInstanceVersion = APIService.getPreferredVersion('serviceinstances');
    var serviceBindingsVersion = APIService.getPreferredVersion('servicebindings');
    var isMobileService = $filter('isMobileService'); 
    var isServiceInstanceReady = $filter('isServiceInstanceReady');
    var isMobileClientEnabled = $filter('isMobileClientEnabled');
    var isBindingReady = $filter('isBindingReady');
    var bindingProviderAnnotation = $filter('annotationName')('mobileBindingProviderId');
    ctrl.state = ctrl.state || {};
    ctrl.boundInstances = [];
    ctrl.unboundInstances = [];
    var watches = [];

    var filterClientBindableMobileServices = function(serviceInstances) {
      if (!ctrl.serviceClasses) {
        return;
      }

      return _.filter(serviceInstances, function(serviceInstance) {
        var serviceInstanceName = _.get(serviceInstance, 'spec.clusterServiceClassRef.name');
        return isMobileService(ctrl.serviceClasses[serviceInstanceName]) && 
               isServiceInstanceReady(serviceInstance) &&
               isMobileClientEnabled(ctrl.serviceClasses[serviceInstanceName]);
      });
    };

    var separateBoundAndUnboundServices = function() {
      if (!ctrl.serviceInstances) {
        return;
      }

      var boundAndUnbound = _.partition(ctrl.serviceInstances, function(serviceInstance) {
        return _.some(ctrl.bindings, function(binding) {
          return _.get(binding, ['metadata', 'annotations', bindingProviderAnnotation]) === serviceInstance.metadata.name &&
            (isBindingReady(binding) || _.get(binding, 'status.currentOperation') === 'Unbind');
        });
      });
      ctrl.boundInstances = boundAndUnbound[0];
      ctrl.unboundInstances = boundAndUnbound[1];
    };

    ctrl.$onInit = function() {
      ctrl.loaded = false;
      DataService.list(serviceClassesVersion, context, function(serviceClasses) {
        ctrl.serviceClasses = serviceClasses.by('metadata.name');
        DataService.list(serviceInstanceVersion, context, function(serviceInstances) {
          ctrl.serviceInstances = filterClientBindableMobileServices(serviceInstances.by('metadata.name'));

          DataService.list(serviceBindingsVersion, context, function(bindingsData) {
            ctrl.bindings = bindingsData.by('metadata.name');
            separateBoundAndUnboundServices();
            ctrl.loaded = true;
          });
        });
      });

      watches.push(DataService.watch(serviceInstanceVersion, context, function(serviceInstances) {
        ctrl.serviceInstances = filterClientBindableMobileServices(serviceInstances.by('metadata.name'));
        separateBoundAndUnboundServices();
      }));

      watches.push(DataService.watch(serviceBindingsVersion, context, function(bindingsData) {
        ctrl.bindings = bindingsData.by('metadata.name');
        separateBoundAndUnboundServices();
      }));
    };

    ctrl.goToCatalog = function() {
      Navigate.toProjectCatalog($routeParams.project, {category: 'mobile', subcategory: 'services'});
    };

    $scope.$on('$destroy', function() {
      DataService.unwatchAll(watches);
    });
  }
})();
