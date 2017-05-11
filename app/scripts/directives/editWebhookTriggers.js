'use strict';

angular.module('openshiftConsole')
  // Element directive edit BC webhook triggers
  .directive('editWebhookTriggers', function() {
    return {
      restrict: 'E',
      scope: {
        type: "@",
        typeInfo: "@",
        triggers: "=",
        bcName: "=",
        projectName: "=",
        form: "="
      },
      templateUrl: 'views/directives/edit-webhook-triggers.html'
    };
  });
