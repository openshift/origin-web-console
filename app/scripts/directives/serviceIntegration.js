'use strict';

(function() {
  angular.module('openshiftConsole').component('serviceIntegration', {
    controller: [
      'APIService',
      'AuthorizationService',
      'CatalogService',
      'DataService',
      'NotificationsService',
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
                          DataService,
                          NotificationsService) {

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
        var state = 1;
        if(ctrl.binding.status.conditions) {
          _.each(ctrl.binding.status.conditions, function(condition){
            if(condition.type === "Ready" && condition.status !== "True"){
              state = 2;
            }
          });
        }
        return state;
      }
      if (ctrl.serviceInstance){
        return 0;
      }
      return -1;
    };

    ctrl.removeIntegration = function(){
      var objectName = this.binding.metadata.name;
      var context = {namespace: this.refApiObject.metadata.namespace};
      var deleteOptions = {propagationPolicy: null};
      DataService.delete({resource: 'podpresets', group: 'settings.k8s.io', version: 'v1alpha1'}, objectName, context, deleteOptions)
      .then(function(){
        return DataService.get(APIService.getPreferredVersion('deployments'), _.get(ctrl, 'refApiObject.metadata.labels.serviceName'), context)
      })
      .then(function(deployment) {
        //if there is a label in the deployment named after the integrated service, 
        //delete the label and update the deployment to trigger a redeploy
        if(ctrl.integrationData.name in deployment.spec.template.metadata.labels) {
          delete(deployment.spec.template.metadata.labels[ctrl.integrationData.name]);
        }
        return DataService.update(APIService.getPreferredVersion('deployments'), _.get(ctrl, 'refApiObject.metadata.labels.serviceName'), deployment, context);
      })
      .catch(error => {
        NotificationsService.addNotification({
          type: "error",
          message: "error removing integration",
          details: error.data.message
        });
      });
      //delete service binding
      DataService.delete(APIService.getPreferredVersion("servicebindings"), objectName, context, deleteOptions)
      .catch(error => {
        NotificationsService.addNotification({
          type: "error",
          message: "Failed to delete service binding",
          details: error.data.message
        });
      });
    };
  }
})();
