'use strict';

(function() {
  angular.module('openshiftConsole').component('serviceIntegration', {
    controller: [
      'APIService',
      'AuthorizationService',
      'BindingService',
      'CatalogService',
      'DataService',
      '$filter',
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
                          BindingService,
                          CatalogService,
                          DataService,
                          $filter,
                          NotificationsService) {
    var ctrl = this;
    var podPresetVersion = {
      group: "settings.k8s.io",
      version: "v1alpha1",
      resource: "podpresets"
    };
    ctrl.$onInit = function() {
      var context = {namespace: ctrl.consumerService.metadata.namespace};
      // watch for the pod preset for this integration
      DataService.watch(podPresetVersion, context, function(podPresets){
        ctrl.podPreset = false;
        var data = podPresets.by("metadata.name");
        ctrl.podPreset = _.filter(data, function(podPreset) {
          return podPreset.metadata.name === _.get(ctrl.consumerService, 'metadata.labels.serviceName') + "-" + ctrl.integration;
        }).pop();
      });

      //setup watch on servincebindings, watch for bindings consumed by this service
      DataService.watch(APIService.getPreferredVersion('servicebindings'), context, function(bindingData) {
        ctrl.binding = false;
        var data = bindingData.by("metadata.name");
        _.each(data, function(binding){
          if(_.get(binding, "metadata.annotations.provider", "provider_not_found") === _.get(ctrl, "integration", "integration_name_not_found") && 
          _.get(binding, "metadata.annotations.consumer", "consumer_not_found") === _.get(ctrl, "consumerService.metadata.labels.serviceName", "consumer_name_not_found")){
            ctrl.binding = binding;
          }
        });
      });

      //setup watch on service instances, looking for a, instance which provides this integration
      DataService.watch(APIService.getPreferredVersion('serviceinstances'), context, function(serviceInstancesData) {
        ctrl.serviceInstance = false;
        _.each(serviceInstancesData._data, function(serviceInstance){
          if(serviceInstance.metadata.name.includes(ctrl.integration)){
            //is there a filter
            _.each(serviceInstance.status.conditions, function(condition){
              if(condition.type === "Ready" && condition.status === "True"){
                ctrl.serviceInstance = serviceInstance;
              }
            });
          }
        });
      });
  
      //load item from catalog for icon data
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

    var generatePodPresetTemplate = function(consumerService, providerService, binding) {
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
    };

    ctrl.openIntegrationPanel = function() {
      ctrl.parameterData = {
        service: _.get(ctrl.consumerService, 'metadata.labels.serviceName')
      };
      ctrl.integrationPanelVisible = true;
    };

    ctrl.onBind = function(binding) {
      var context = {namespace: _.get(ctrl.consumerService, 'metadata.namespace')};
      var podPreset = generatePodPresetTemplate(ctrl.consumerService, ctrl.serviceInstance, binding);
      var version = {
        group:"settings.k8s.io",
        resource:"podpresets",
        version:"v1alpha1"
      };

      var isBindingReady = $filter("isBindingReady");

      //binding might not be ready currently, so
      //watch binding to wait for it to be ready
      var bindingReadyWatch = DataService.watch(APIService.getPreferredVersion("servicebindings"), context, function(bindings){
        _.each(bindings._data, function(iterateBinding){
          if(iterateBinding.metadata.name === binding.metadata.name && isBindingReady(iterateBinding)){
            DataService.unwatch(bindingReadyWatch);
            _.set(iterateBinding, "metadata.annotations.consumer", ctrl.consumerService.metadata.labels.serviceName);
            _.set(iterateBinding, "metadata.annotations.provider", ctrl.integration);
            DataService.update(APIService.getPreferredVersion("servicebindings"), iterateBinding.metadata.name, iterateBinding, context)
          }
        });
      });


      DataService.create(version, null, podPreset, context)
      .then(function() {
        return DataService.get(APIService.getPreferredVersion('deployments'), _.get(ctrl.consumerService, 'metadata.labels.serviceName'), context, {
          errorNotification: false
        });
      })
      .then(function(deployment) {
        deployment.spec.template.metadata.labels[_.get(ctrl.serviceInstance, 'metadata.labels.serviceName')] = "enabled";
        return DataService.update(APIService.getPreferredVersion('deployments'), _.get(ctrl, 'consumerService.metadata.labels.serviceName'), deployment, context);
      })
      .then(function() {
        NotificationsService.addNotification({
          type: "success",
          message: "Binding has been set in " + _.get(ctrl, 'consumerService.metadata.labels.serviceName') + " Redeployed " + _.get(ctrl, 'consumerService.metadata.labels.serviceName')
        });
      })
      .catch(function(err) {
        NotificationsService.addNotification({
          type: "error",
          message: "Failed to integrate service binding",
          details: err.data.message
        });
      });
    };

    ctrl.getState = function(){
      if(ctrl.podPreset && !ctrl.binding) {
        return 2;
      }
      if(ctrl.podPreset && ctrl.binding) {
        return 1;
      }
      if(ctrl.binding) {
        var state=1;
        _.each(ctrl.binding.status.conditions, function(condition){
          if(condition.type === "Ready" && condition.status !== "True"){
            state=2;
          }
        });
        return state;
      }
      if (ctrl.serviceInstance){
        return 0;
      }
      return -1;
    };

    //called in callback from succesful delete-link for binding
    ctrl.deletePodPreset = function(){
      var context = {namespace: ctrl.consumerService.metadata.namespace};
      var deleteOptions = {propagationPolicy: null};
      DataService.delete(podPresetVersion, ctrl.podPreset.metadata.name, context, deleteOptions)
      .then(function(){
        return DataService.get(APIService.getPreferredVersion('deployments'), _.get(ctrl, 'consumerService.metadata.labels.serviceName'), context)
      })
      .then(function(deployment) {
        //if there is a label in the deployment named after the integrated service, 
        //delete the label and update the deployment to trigger a redeploy
        if(ctrl.integrationData.name in deployment.spec.template.metadata.labels) {
          delete(deployment.spec.template.metadata.labels[ctrl.integrationData.name]);
        }
        return DataService.update(APIService.getPreferredVersion('deployments'), _.get(ctrl, 'consumerService.metadata.labels.serviceName'), deployment, context);
      })
      .catch(error => {
        NotificationsService.addNotification({
          type: "error",
          message: "error removing integration",
          details: error.data.message
        });
      });
    };
  }
})();
