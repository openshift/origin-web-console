"use strict";

angular.module("openshiftConsole")
  /**
   * Widget for entering autoscaling information
   */
  .directive("oscAutoscaling",
             function(DNS1123_SUBDOMAIN_VALIDATION) {
    return {
      restrict: 'E',
      scope: {
        autoscaling: "=model",
        showNameInput: "=?",
        nameReadOnly: "=?"
      },
      templateUrl: 'views/directives/osc-autoscaling.html',
      link: function(scope) {
        scope.nameValidation = DNS1123_SUBDOMAIN_VALIDATION;
      }
    };
  });
