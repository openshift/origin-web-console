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
  var urlRgx = /http(s)?:\/\/.*\//;

  return _.map(secrets, function(secret) {
    var decodedData = SecretsService.decodeSecretData(secret.data);
    if (decodedData.uri && !decodedData.uri.match(urlRgx)) {
      decodedData.uri+="/";
    }

    var decodedConfig = _.attempt(JSON.parse, decodedData.config);
    var conf ={
      id: _.get(secret, 'metadata.name'),
      name: _.get(decodedData, 'name'),
      type: decodedData.type,
      url: decodedData.uri,
      config: _.isError(decodedConfig) ? {} : decodedConfig
    };
    if(externalURL){
      externalURL += _.endsWith("/") ? "" : "/";
      var serviceName = conf.name || _.get(secret,"metadata.labels.serviceName");
      var dmzURL = externalURL + "mobile/" + serviceName + "/";
      conf.url = conf.url.replace(urlRgx,dmzURL);
    }
    return conf;
  });
};

function MobileClientConfigCtrl(API_CFG, APIService, DataService, SecretsService) {
  var ctrl = this;
  var watches = [];


  var setServiceConfig = function(mobileClient) {
    ctrl.serviceConfig = getServiceConfig(ctrl.secrets, _.get(mobileClient, "spec.dmzUrl"), SecretsService);
    ctrl.prettyConfig = getClientConfig(ctrl.mobileClient, ctrl.serviceConfig, API_CFG);
  };

  ctrl.$onChanges = function(changes) {
    var startWatchingSecrets = _.once(function() {
      var secretWatch = DataService.watch(APIService.getPreferredVersion('secrets'), {namespace: _.get(ctrl, 'mobileClient.metadata.namespace')},
        function(secrets) {
          ctrl.secrets = _.filter(secrets.by('metadata.name'), function(secret) {
            return _.get(secret, 'metadata.labels.clientId') === ctrl.mobileClient.metadata.name;
          });

          setServiceConfig(changes.mobileClient.currentValue);
        }, {errorNotification: false});
      watches.push(secretWatch);
    });

    if (changes.mobileClient){
      if (changes.mobileClient.currentValue) {
        startWatchingSecrets();
      }

      if (ctrl.secrets) {
        setServiceConfig(changes.mobileClient.currentValue);
      }
    }
  };

  ctrl.$onDestroy = function() {
    DataService.unwatchAll(watches);
  };
}
