'use strict';

angular.module('openshiftConsole')
  // Element directive edit BC webhook triggers
  .directive('editWebhookTriggers', function(ApplicationGenerator) {
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
      templateUrl: 'views/directives/edit-webhook-triggers.html',
      controller: function($scope) {
        $scope.addWebhookTrigger = function(type) {
          var webhook = {
            disabled: false,
            data: {
              type: type
            }
          };
          webhook.data[(type === "GitHub") ? "github" : "generic"] = {
            secret: ApplicationGenerator._generateSecret()
          };
          $scope.triggers.push(webhook);
          $scope.form.$setDirty();
        };
      }
    };
  });
