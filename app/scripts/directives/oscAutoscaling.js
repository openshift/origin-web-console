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

        // Wait for project to be set.
        scope.$watch('project', function() {
          if (!scope.project) {
            return;
          }

          // Set a default value in the model to include if the HPA if the field is empty.
          var defaultTargetCPU = window.OPENSHIFT_CONSTANTS.DEFAULT_HPA_CPU_TARGET_PERCENT;
          _.set(scope, 'autoscaling.defaultTargetCPU', defaultTargetCPU);

          // Default percent for display in the view as a placeholder and in help
          // text. Don't convert this value since the field will prompt for
          // limit instead when a request/limit override is in place and we want
          // to show default percent of limit.
          scope.defaultTargetCPUDisplayValue = window.OPENSHIFT_CONSTANTS.DEFAULT_HPA_CPU_TARGET_PERCENT;

          // Keep the input value and model value separate in the scope so we can
          // convert between them on changes.
          var inputValueChanged = false;
          var updateTargetCPUInput = function(targetCPU) {
            if (inputValueChanged) {
              // Don't update the input in response to the user typing. Only
              // update the input value when the target CPU changes outside the
              // directive.
              inputValueChanged = false;
              return;
            }
            _.set(scope, 'targetCPUInput.percent', targetCPU);
          };
          scope.$watch('autoscaling.targetCPU', updateTargetCPUInput);

          // Update the model with the target CPU request percentage when the input value changes.
          var updateTargetCPUModel = function(targetCPU) {
            inputValueChanged = true;
            _.set(scope, 'autoscaling.targetCPU', targetCPU);
          };

          // Watch changes to the target CPU input to set values back in the model.
          scope.$watch('targetCPUInput.percent', function(newValue, oldValue) {
            if (newValue === oldValue) {
              return;
            }

            updateTargetCPUModel(newValue);
          });
        });
      }
    };
  });
