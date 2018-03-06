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
    bindings: {
      integration: '<',
      consumerService: '<?'
    },
    templateUrl: 'views/directives/_service-integration.html'
  });

  function ServiceIntegration(APIService,
                          AuthorizationService,
                          CatalogService,
                          DataService,
                          NotificationsService) {

    var ctrl = this;

    ctrl.$onInit = function() {
      var context = {namespace: ctrl.consumerService.metadata.namespace};
      DataService.watch(APIService.getPreferredVersion('servicebindings'), context, function(bindingData) {
        ctrl.binding = false;
        var data = bindingData.by("metadata.name");
        _.each(data, function(binding){
          if(_.get(binding, "metadata.annotations.consumer", "consumer_not_found") === _.get(ctrl, "consumerService.metadata.labels.serviceName", "service_not_found")){
            ctrl.binding = binding;
          }
        });
      });
  
      //TODO: check out the naming here. serviceInstance === provideService?
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

    var getPodPreset = function(consumerService, providerService, binding) {
      var consumerSvcName = _.get(consumerService, 'metadata.labels.serviceName');
      var providerSvcName = _.get(providerService, 'metadata.labels.serviceName');
      var podPreset = {
        "apiVersion": "settings.k8s.io/v1alpha1",
        "kind": "PodPreset",
        "metadata": {
          "name": consumerSvcName + '-' + providerSvcName,
          "labels": {
            "group": "mobile",
            "service": providerSvcName
          }
        },
        "spec": {
          "selector": {
            "matchLabels": {
              "run": consumerSvcName
            }
          },
          "volumeMounts": [
            {
              "mountPath": "/etc/secrets/" + providerSvcName,
              "readOnly": true,
              "name": providerSvcName
            }
          ],
          "volumes": [
            {
              "name": providerSvcName,
              "secret": {
                "secretName": _.get(binding, 'spec.secretName')
              }
            }
          ]
        }
      };

      podPreset.spec.selector.matchLabels[providerSvcName] = "enabled";
      return podPreset;
    };

    ctrl.integrationPanelVisible = false;

    ctrl.closeIntegrationPanel = function() {
      ctrl.integrationPanelVisible = false;
    }

    ctrl.openIntegrationPanel = function() {
      ctrl.parameterData = {
        service: _.get(ctrl.consumerService, 'metadata.labels.serviceName')
      };
      ctrl.integrationPanelVisible = true;
    }

    ctrl.onBind = function(binding) {
      var podPreset = getPodPreset(ctrl.consumerService, ctrl.serviceInstance, binding);
      var version = {
        group:"settings.k8s.io",
        resource:"podpresets",
        version:"v1alpha1"
      };
      var context = {namespace: _.get(ctrl.consumerService, 'metadata.namespace')};
      DataService.create(version, null, podPreset, context)
      .then(function() {
          DataService.get(APIService.getPreferredVersion('deployments'), _.get(ctrl.consumerService, 'metadata.labels.serviceName'), context, {
            errorNotification: false
          }).then(function(deployment) {
            deployment.spec.template.metadata.labels[_.get(ctrl.serviceInstance, 'metadata.labels.serviceName')] = "enabled";
            DataService.update(APIService.getPreferredVersion('deployments'), _.get(ctrl, 'consumerService.metadata.labels.serviceName'), deployment, context);
          });
      })
      .catch(function(err) {
        console.log('err', err);
      });
    }

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
