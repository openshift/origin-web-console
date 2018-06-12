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
    bindings: {
    },
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
    ctrl.state = ctrl.state || {};
    var watches = [];

    $scope.$on('$destroy', function(){
        DataService.unwatchAll(watches);
    });

    ctrl.goToCatalog = function() {
      Navigate.toProjectCatalog($routeParams.project, {category: 'mobile', subcategory: 'services'});
    };  

    watches.push(DataService.watch(APIService.getPreferredVersion("clusterserviceclasses"), {namespace: $routeParams.project}, function(serviceClasses){
      ctrl.serviceClasses = serviceClasses.by("metadata.name");
      watches.push(DataService.watch(APIService.getPreferredVersion("serviceinstances"), {namespace: $routeParams.project}, function(serviceInstances){
        ctrl.serviceInstances = _.filter(serviceInstances.by('metadata.name'), function(serviceInstance){
          var serviceInstanceName = _.get(serviceInstance, 'spec.clusterServiceClassRef.name');
          return $filter('isMobileService')(ctrl.serviceClasses[serviceInstanceName]) && 
                 $filter('isServiceInstanceReady')(serviceInstance) &&
                 $filter('isMobileClientEnabled')(ctrl.serviceClasses[serviceInstanceName]);
        });
      }));
    }));
    
  }
})();
