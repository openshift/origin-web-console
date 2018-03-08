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
    var watches = [];
    var podPresetVersion = {
      group: "settings.k8s.io",
      version: "v1alpha1",
      resource: "podpresets"
    };
//should integrations map to service class
//serviceinstance = integrationinstance
    ctrl.$onInit = function() {
      var context = {namespace: ctrl.consumerService.metadata.namespace};
      DataService.list(podPresetVersion, context)
      .then(function(podPresets) {
        var data = podPresets.by("metadata.name");
        ctrl.podPreset = _.filter(data, function(podPreset) {
          return podPreset.metadata.name === _.get(ctrl.consumerService, 'metadata.labels.serviceName') + "-" + ctrl.integration;
        }).pop();
        if (ctrl.podPreset) {
          DataService.watch(APIService.getPreferredVersion('servicebindings'), context, function(bindingData) {
            var data = bindingData.by("metadata.name");
            ctrl.binding = _.filter(data, function(binding) {
              return binding.spec.secretName === ctrl.podPreset.spec.volumes[0].secret.secretName
            }).pop();
          });          
        }
      });

      DataService.watch(APIService.getPreferredVersion('servicebindings'), context, function(bindingData) {
        var data = bindingData.by("metadata.name");
        _.each(data, function(binding){
          if(_.get(binding, "metadata.name", "consumer_not_found") === _.get(ctrl, "bindingName", "bindingName_not_found")){
            ctrl.binding = binding;
          }
        });
      });

      //TODO: check out the naming here. serviceInstance === provideService?
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
    };

    ctrl.openIntegrationPanel = function() {
      ctrl.parameterData = {
        service: _.get(ctrl.consumerService, 'metadata.labels.serviceName')
      };
      ctrl.integrationPanelVisible = true;
    };

    // ctrl.$onDestroy = function() {
    //   if (watches) {
    //     DataService.unwatch(watches);
    //   }
    // };

    ctrl.onBind = function(binding) {
      ctrl.bindingName = binding.metadata.name;
      ctrl.binding = binding;
      var isBindingReady = $filter('isBindingReady');
      console.log("isBindingReady:", isBindingReady());
      var context = {namespace: _.get(ctrl.consumerService, 'metadata.namespace')};
      // watches.push(DataService.watchObject(BindingService.bindingResource, _.get(binding, 'metadata.name'), context, function(binding) {
      //   if (!isBindingReady(binding)) {
      //     return;
      //   }

      var podPreset = getPodPreset(ctrl.consumerService, ctrl.serviceInstance, binding);
      var version = {
        group:"settings.k8s.io",
        resource:"podpresets",
        version:"v1alpha1"
      };
      
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

      // }));
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

    //called in callback from succesful delete-link for binding
    ctrl.deletePodPreset = function(){
      var context = {namespace: ctrl.consumerService.metadata.namespace};
      var deleteOptions = {propagationPolicy: null};
      DataService.delete(podPresetVersion, ctrl.podPreset.metadata.name, context, deleteOptions)
      .then(function(){
        ctrl.binding = false;
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
