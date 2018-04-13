'use strict';

(function() {
  angular.module('openshiftConsole').component('serviceIntegration', {
    controller: [
      '$filter',
      '$scope',
      'APIService',
      'AuthorizationService',
      'BindingService',
      'Catalog',
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

  function ServiceIntegration(
                          $filter,
                          $scope,
                          APIService,
                          AuthorizationService,
                          BindingService,
                          Catalog,
                          DataService,
                          NotificationsService) {
    var ctrl = this;

    var configMapPreferredVersion = APIService.getPreferredVersion('configmaps');
    var deploymentPreferredVersion = APIService.getPreferredVersion('deployments');
    var bindingPreferredVersion = APIService.getPreferredVersion('servicebindings');
    var instancePreferredVersion = APIService.getPreferredVersion('serviceinstances');
    var podPresetPreferredVersion = APIService.kindToResourceGroupVersion({group: "settings.k8s.io", kind: "podpreset"});
    
    var isServiceInstanceReady = $filter('isServiceInstanceReady');
    var isBindingReady = $filter("isBindingReady");
    var getErrorDetails = $filter('getErrorDetails');

    var integrationName = ctrl.integration.spec.externalMetadata.serviceName;

    var watches = [];
    var ppwatch = false;
    var bindingWatch = false;

    $scope.$on('$destroy', function() {
      DataService.unwatchAll(watches);
      if(ppwatch) {
        DataService.unwatch(ppwatch);
      }
      
      if (bindingWatch) {
        DataService.unwatch(bindingWatch);
      }
    });

    ctrl.$onInit = function() {
      var context = {namespace: ctrl.consumerService.metadata.namespace};

      //setup watch on config maps, looks for the consumer and provider services' configmap to get its service name
      watches.push(DataService.watch(configMapPreferredVersion, context, function(configMapsData) {
        var configMaps = configMapsData.by('metadata.name');

        _.forEach(configMaps, function(configMap) {
          var serviceInstanceID = _.get(configMap, "metadata.labels.serviceInstanceID");

          if (serviceInstanceID === ctrl.consumerService.spec.externalID) {
            $scope.consumerServiceName = _.get(configMap, 'metadata.labels.serviceName');
            return;
          }

          if ($scope.providerServiceInstance && serviceInstanceID === $scope.providerServiceInstance.spec.externalID) {
            $scope.providerServiceName = _.get(configMap, 'metadata.labels.serviceName');
            return;
          }
        });
      }));

      //setup watch on service instances, looking for an instance which provides this integration
      watches.push(DataService.watch(instancePreferredVersion, context, function(serviceInstancesData) {
        var data = serviceInstancesData.by('metadata.name');
        $scope.providerServiceInstance = _.find(data, function(serviceInstance) {
          var clusterServiceClassExternalName = _.get(serviceInstance, "spec.clusterServiceClassExternalName");
          return (clusterServiceClassExternalName === ctrl.integration.spec.externalName);
        });
      }));

      //pod preset watch should only exist when we have a handle to the provider service instance
      $scope.$watch('providerServiceInstance', function(providerServiceInstance){
        if(!providerServiceInstance) {
          if (ppwatch !== false) {
            DataService.unwatch(ppwatch);
            ppwatch = false;
          }
          return;
        }
        //dont recreate the pod preset watch
        if(ppwatch !== false) {
          return;
        }
        // watch for the pod preset for this integration
        ppwatch = DataService.watch(podPresetPreferredVersion, context, function(podPresets) {
          var data = podPresets.by("metadata.name");
          ctrl.podPreset = _.find(data, function(podPreset) {
            return podPreset.metadata.name === _.get(ctrl.consumerService, 'metadata.name') + "-" + _.get($scope.providerServiceInstance, 'metadata.name');
          });
        });
      });

      //binding watch should only exist when we have a handle to the consumer service name.
      $scope.$watch('consumerServiceName', function(consumerServiceName){
        if(!consumerServiceName){
          if (bindingWatch !== false) {
            DataService.unwatch(bindingWatch);
            bindingWatch = false;
          }
          return;
        }

        //dont recreate the binding watch
        if(bindingWatch !== false) {
          return;
        }

        //setup watch on servincebindings, watch for bindings consumed by this service
        bindingWatch = DataService.watch(bindingPreferredVersion, context, function(bindingData) {
          var data = bindingData.by("metadata.name");
          ctrl.binding = _.find(data, function(binding) {
            var bindingProviderName = _.get(binding, ["metadata", "annotations", "integrations.aerogear.org/provider"]);
            var bindingConsumerName = _.get(binding, ["metadata", "annotations", "integrations.aerogear.org/consumer"]);
            return (bindingProviderName && bindingConsumerName && $scope.consumerServiceName && bindingProviderName === integrationName && bindingConsumerName === $scope.consumerServiceName);
          });
        });
      });

    };

    var generatePodPresetTemplate = function(consumerService, providerService, binding) {
      var consumerSvcName = _.get(consumerService, 'metadata.name');
      var providerSvcName = _.get(providerService, 'metadata.name');
      var podPreset = {
        apiVersion: "settings.k8s.io/v1alpha1",
        kind: "PodPreset",
        metadata: {
          name: consumerSvcName + '-' + providerSvcName,
          labels: {
            group: "mobile",
            service: providerSvcName
          }
        },
        spec: {
          selector: {
            matchLabels: {
              run: consumerSvcName
            }
          },
          volumeMounts: [
            {
              mountPath: "/etc/secrets/" + providerSvcName,
              readOnly: true,
              name: providerSvcName
            }
          ],
          volumes: [
            {
              name: providerSvcName,
              secret: {
                secretName: _.get(binding, 'spec.secretName')
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
        service: $scope.consumerServiceName
      };
      ctrl.integrationPanelVisible = true;
    };

    ctrl.provision = function() {
      $scope.$emit("open-overlay-panel", Catalog.getServiceItem(ctrl.integration));
    };

    ctrl.onBind = function(binding) {
      var context = {namespace: _.get(ctrl.consumerService, 'metadata.namespace')};
      var podPreset = generatePodPresetTemplate(ctrl.consumerService, $scope.providerServiceInstance, binding);
      
      //binding might not be ready currently, so
      //watch binding to wait for it to be ready
      var bindingReadyWatch = DataService.watchObject(bindingPreferredVersion, _.get(binding, 'metadata.name'), context, function(watchBinding) {
        if (isBindingReady(watchBinding)) {
          DataService.unwatch(bindingReadyWatch);
          var copiedBinding = angular.copy(watchBinding);
          NotificationsService.addNotification({
            type: "success",
            message: "A binding has been created for " + $scope.consumerServiceName + " and it has been redeployed."
          });
          _.setWith(copiedBinding, ["metadata", "annotations", "integrations.aerogear.org/consumer"], $scope.consumerServiceName);
          _.setWith(copiedBinding, ["metadata", "annotations", "integrations.aerogear.org/provider"], integrationName);
          // update the binding with consumer and provider metadata annotations
          DataService.update(bindingPreferredVersion, copiedBinding.metadata.name, copiedBinding, context)
          // then retrieve the deployment
          .then(function() {
            return DataService.get(
              deploymentPreferredVersion, 
              $scope.consumerServiceName, 
              context, {errorNotification: false}
            );
          })
          // then add the enabled service metadata label
          .then(function(deployment) {
            deployment.spec.template.metadata.labels[$scope.providerServiceName] = "enabled";
            // and update the deployment and trigger a redeploy
            return DataService.update(
              deploymentPreferredVersion, 
              $scope.consumerServiceName, 
              deployment, 
              context
            );
          })
          .catch(function(err) {
            NotificationsService.addNotification({
              type: "error",
              message: "Failed to integrate service binding.",
              details: err.data.message
            });
          });
        }
      });
      
      //create the pod preset asynchronously to the binding
      DataService.create(podPresetPreferredVersion, null, podPreset, context)
      .catch(function(err) {
        NotificationsService.addNotification({
          type: "error",
          message: "Failed to create pod preset.",
          details: getErrorDetails(err)
        });
      });
      
    };

    ctrl.getState = function() {
      if (ctrl.podPreset && !ctrl.binding) {
        // pending create
        return "pending";
      }
      if (ctrl.podPreset && ctrl.binding) {
        //pod preset and binding exist, state 1
        return "active";
      }
      if (ctrl.binding && !ctrl.podPreset) {
        //pending delete
        return "pending";
      }
      if ($scope.providerServiceInstance && isServiceInstanceReady($scope.providerServiceInstance)) {
        return "no-binding";
      } 
      if ($scope.providerServiceInstance && !isServiceInstanceReady($scope.providerServiceInstance) && _.get($scope, 'providerServiceInstance.status.currentOperation') === 'Provision') {
        return "service-provision-pending";
      }
      if ($scope.providerServiceInstance && !isServiceInstanceReady($scope.providerServiceInstance) && _.get($scope, 'providerServiceInstance.status.currentOperation') === 'Deprovision') {
        return "service-deprovision-pending";
      }
      return "no-service";
    };

    //called in callback from succesful delete-link for binding
    ctrl.deletePodPreset = function() {
      var context = {namespace: ctrl.consumerService.metadata.namespace};
      var deleteOptions = {propagationPolicy: null};
      DataService.delete(podPresetPreferredVersion, ctrl.podPreset.metadata.name, context, deleteOptions)
      .then(function() {
        return DataService.get(
          deploymentPreferredVersion, 
          $scope.consumerServiceName, 
          context
        );
      })
      .then(function(deployment) {
        var copyDeployment = angular.copy(deployment);
        delete copyDeployment.spec.template.metadata.labels[integrationName];
        return DataService.update(
          deploymentPreferredVersion, 
          $scope.consumerServiceName, 
          copyDeployment, 
          context
        );
      })
      .catch(function(error) {
        NotificationsService.addNotification({
          type: "error",
          message: "There was an error deleting the integration.",
          details: getErrorDetails(error)
        });
      });
    };
  }
})();
