'use strict';

(function() {
  angular.module('openshiftConsole').component('mobileIntegration', {
    controller: [
      'DataService',
      'DeploymentsService',
      'APIService',
      MobileIntegration
    ],
    bindings: {
      serviceInstance: '<',
      project: '<'
    },
    templateUrl: 'views/directives/mobile-integration.html'
  });

  var getPodPreset = function(serviceInstance, binding) {
    var providerSvcName = 'keycloak';//_.get(binding, 'metadata.labels.serviceName');
    return {
      "apiVersion": "settings.k8s.io/v1alpha1",
      "kind": "PodPreset",
      "metadata": {
        "name": "test-2"
      },
      "spec": {
        "env": [{
          "name": "test",
          "value": "newvalue"
        }],
        "selector": {
          "matchLabels": {
            "service": 'keycloak'
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


    // return {
    //   "apiVersion": "settings.k8s.io/v1alpha1",
    //   "kind": "PodPreset",
    //   "metadata": {
    //     "name": 'consumer' + "-" + 'provider',
    //     "labels": {
    //       "group": "mobile",
    //       "service": 'binding.service'
    //     }
    //   },
    //   "spec": {
    //     "selector": {
    //       "matchLabels": {
    //         "run": 'serviceinstance.id',
    //         'providename': "enabled"
    //       }     
    //     },
    //     "env": {
    //       "envFrom": {
    //         'volumeMounts': [
    //           {
    //             "mountPath": "/cache",
    //             "name": "cache-volume"
    //           },
    //           {
    //             "mountPath": "/etc/app/config.json",
    //             "readOnly": true,
    //             "name": "secret-volume"
    //           }
    //         ]
    //       }
    //     }
    //   }
    // };
  };

      // "volumeMounts": [
      //   {
      //     "mountPath": "/cache",
      //     "name": "cache-volume"
      //   },
      //   {
      //     "mountPath": "/etc/app/config.json",
      //     "readOnly": true,
      //     "name": "secret-volume"
      //   }
      // ],
      // "volumes": [
      //   {
      //     "name": "cache-volume",
      //     "emptyDir": {}
      //   },
      //   {
      //     "name": "secret-volume",
      //     "secret": {
      //       "secretName": "config-details"
      //     }
      //   }
      // ]
  function MobileIntegration(DataService, DeploymentsService, APIService) {
    var ctrl = this;

    ctrl.parameterData = {
      service: 'keycloak'
    };

    ctrl.integrationPanelVisible = false;

    ctrl.closeIntegrationPanel = function() {
      ctrl.integrationPanelVisible = false;
    }

    ctrl.openIntegrationPanel = function() {
      ctrl.integrationPanelVisible = true;
    }

    ctrl.onBind = function(binding) {
      var podPreset = getPodPreset(ctrl.serviceInstance, binding);
      var version = {
        group:"settings.k8s.io",
        resource:"podpresets",
        version:"v1alpha1"
      };
      var context = {namespace: _.get(ctrl.project, 'metadata.name')};
      DataService.create(version, null, podPreset, context)
      .then(function() {
          DataService.get(APIService.getPreferredVersion('deploymentconfigs'), /*_.get(binding, 'metadata.labels.serviceName');*/'keycloak', context, {
            errorNotification: false
          }).then(function(deploymentConfig) {
            DeploymentsService.startLatestDeployment(deploymentConfig, context);
          });
      })
      .catch(function(err) {
        console.log('err', err);
      });
    }
  }
  
})();