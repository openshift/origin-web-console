'use strict';
(function() {
  angular.module('openshiftConsole').component('copyWebhookUrl', {
    controller: CopyWebhookUrl,
    controllerAs: '$ctrl',
    bindings: {
      buildConfigName: "<",
      triggerType: "<",
      projectName: "<",
      secret: "<",
      webhookSecrets: "<"
    },
    templateUrl: 'components/copy-webhook-url/copy-webhook-url.html'
  });

  function CopyWebhookUrl() {
    var ctrl = this;

    ctrl.showSecretsWarning = function() {
      return _.get(ctrl.secret, 'secretReference.name') && !ctrl.webhookSecrets;
    };
  }
})();