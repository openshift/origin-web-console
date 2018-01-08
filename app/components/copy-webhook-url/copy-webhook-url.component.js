'use strict';

angular.module('openshiftConsole')
  .component('copyWebhookUrl', {
    bindings: {
      buildConfigName: "=",
      triggerType: "=",
      projectName: "=",
      secret: "=",
      webhookSecrets: "="
    },
    templateUrl: 'components/copy-webhook-url/copy-webhook-url.html',
    controller: function() {
      var ctrl = this;

      ctrl.showSecretsWarning = function() {
        return _.get(ctrl.secret, 'secretReference.name') && !ctrl.webhookSecrets;
      };
    }
  });
