"use strict";

angular.module("openshiftConsole")
  /**
   * Widget for entering autoscaling information
   */
  .directive("oscAutoscaling",
             function(Constants,
                      HPAService,
                      DNS1123_SUBDOMAIN_VALIDATION) {
    return {
      restrict: 'E',
      scope: {
        autoscaling: "=model",
        showNameInput: "=?",
        nameReadOnly: "=?",
        // one way binding allows this field to be hidden if the
        // autoscaler is not using cpuRequest, but the field should
        // not disappear if a user edits it
        showRequestInput: "&"
      },
      templateUrl: 'views/directives/osc-autoscaling.html',
      link: function(scope, elem, attrs) {
        scope.nameValidation = DNS1123_SUBDOMAIN_VALIDATION;

        // Prefill a default value if DEFAULT_HPA_CPU_TARGET_PERCENT is set and
        // there is no previous value.
        var defaultTargetCPU = Constants.DEFAULT_HPA_CPU_TARGET_PERCENT;
        var targetCPU = _.get(scope, 'autoscaling.targetCPU');
        if (_.isNil(targetCPU) && defaultTargetCPU) {
          _.set(scope, 'autoscaling.targetCPU', defaultTargetCPU);
        }
        // true if not present
        if( !('showRequestInput' in attrs) ) {
          scope.showRequestInput = true;
        }

      }
    };
  });
