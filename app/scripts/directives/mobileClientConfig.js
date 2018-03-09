'use strict';


angular.module('openshiftConsole').component('mobileClientConfig', {
    bindings: {
      mobileClient: '<'
    },
    templateUrl: 'views/mobile-client-config.html',
    controller: [
      'API_CFG',
      'APIService',
      'DataService',
      'SecretsService',
      MobileClientConfigCtrl
    ]
  });

var getClientConfig = function(mobileClient, serviceConfig, clusterInfo) {
  return JSON.stringify({
    version: 1,
    clusterName: "https://" + clusterInfo.openshift.hostPort,
    namespace: _.get(mobileClient, 'metadata.namespace'),
    clientId: _.get(mobileClient, 'metadata.name'),
    services: serviceConfig
  }, null, '  ');
};

var getServiceConfig = function(secrets, externalURL, SecretsService) {
  return _.map(secrets, function(secret) {
    var decodedData = SecretsService.decodeSecretData(secret.data);
    var conf ={
      id: _.get(secret, 'metadata.name'),
      name: _.get(decodedData, 'name'),
      type: decodedData.type,
      url: decodedData.uri,
      config: decodedData.config ? JSON.parse(decodedData.config) : {}
    };
    if(externalURL){
      var serviceName = conf.name || _.get(secret,"metadata.labels.serviceName");
      if(externalURL.substr(externalURL.length -1) !== "/"){
        externalURL+="/";
      }
      externalURL+="mobile/"+serviceName+"/";
      conf.url = conf.url.replace(/http(s):\/\/.*\//,externalURL);
    }
    return conf;
  });
};

function MobileClientConfigCtrl(API_CFG, APIService, DataService, SecretsService) {
  var ctrl = this;
  var watches = [];

  ctrl.$onChanges = function(changes) {
    if (changes.mobileClient && changes.mobileClient.currentValue && !ctrl.secretWatch) {
      ctrl.secretWatch = DataService.watch(APIService.getPreferredVersion('secrets'), {namespace: _.get(ctrl, 'mobileClient.metadata.namespace')},
        function(secrets) {
        ctrl.secrets = _.filter(secrets.by('metadata.name'), function(secret) {
          return _.get(secret, 'metadata.labels.clientId') === ctrl.mobileClient.metadata.name;
        });

        ctrl.serviceConfig = getServiceConfig(ctrl.secrets,_.get(changes.mobileClient.currentValue,"spec.dmzUrl"), SecretsService);
        ctrl.prettyConfig = getClientConfig(ctrl.mobileClient, ctrl.serviceConfig, API_CFG);
      }, {errorNotification: false});
      watches.push(ctrl.secretWatch);
    }
    if (changes.mobileClient && ctrl.secrets) {
      ctrl.serviceConfig = getServiceConfig(ctrl.secrets, _.get(changes.mobileClient.currentValue,"spec.dmzUrl"), SecretsService);
      ctrl.prettyConfig = getClientConfig(ctrl.mobileClient, ctrl.serviceConfig, API_CFG);
    }
  };

  ctrl.$onDestroy = function() {
    DataService.unwatchAll(watches);
  };
}
