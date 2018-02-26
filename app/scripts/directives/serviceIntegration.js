'use strict';

(function() {
  angular.module('openshiftConsole').component('serviceIntegration', {
    controller: [
      'APIService',
      'AuthorizationService',
      'CatalogService',
      'DataService',
      ServiceIntegration
    ],
    controllerAs: '$ctrl',
    bindings: {
      integration: '<',
      refApiObject: '<?'
    },
    templateUrl: 'views/directives/_service-integration.html'
  });

  function ServiceIntegration(APIService,
                          AuthorizationService,
                          CatalogService,
                          DataService) {

    var ctrl = this;

    ctrl.$onInit = function(){
      var context = {namespace: ctrl.refApiObject.metadata.namespace};
      DataService.watch(APIService.getPreferredVersion('servicebindings'), context, function(bindingData) {
        ctrl.binding = false;
        var data = bindingData.by("metadata.name");
        _.each(data, function(binding){
          if(_.get(binding, "metadata.annotations.consumer", "consumer_not_found") === _.get(ctrl, "refApiObject.metadata.labels.serviceName", "service_not_found")){
            ctrl.binding = binding;
          }
        });
      });
  
      DataService.watch(APIService.getPreferredVersion('serviceinstances'), context, function(serviceInstancesData) {
        ctrl.serviceInstance = false;
        _.each(serviceInstancesData._data, function(serviceInstance){
          if(serviceInstance.metadata.name.includes(ctrl.integration)){
            _.each(serviceInstance.status.conditions, function(condition){
              if(condition.type === "Ready" && condition.status === "True"){
                ctrl.serviceInstance = serviceInstance;
              }
            });
          }
        });
      });
  
      CatalogService.getCatalogItems().then(catalogServices => {
        ctrl.doRender = false;
        _.each(catalogServices, function(catalogService){
          if(_.get(catalogService, "resource.spec.externalMetadata.serviceName", "not_found") === ctrl.integration) {
            ctrl.doRender = true;
            ctrl.integrationData = {};
            ctrl.integrationData.name =  ctrl.integration;
            ctrl.integrationData.imageData = {
              iconClass: catalogService.iconClass, 
              imageUrl: catalogService.imageUrl
            };
          }
        });
      });
    };

    ctrl.getState = function(){
      if (ctrl.binding) {
        return 1;
      }
      if (ctrl.serviceInstance){
        return 0;
      }
      return -1;
    };
  }
})();
