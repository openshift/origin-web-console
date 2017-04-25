'use strict';

angular.module('openshiftConsole')
  // This triggers when an element has either a toggle or data-toggle attribute set on it
  .directive('templateOptions', function() {
    return {
      restrict: 'E',
      templateUrl: 'views/_templateopt.html',
      transclude: true,
      scope: {
        parameters: "=",
        expand: "=?",
        canToggle: "=?",
        isDialog: "=?"
      },
      link: function(scope, element, attrs) {
        if (!angular.isDefined(attrs.canToggle)) {
          scope.canToggle = true;
        }

        scope.isOnlyWhitespace = function(value) {
          return /^\s+$/.test(value);
        };

        scope.focus = function(id) {
          angular.element('#' + id).focus();
        };

        if (!scope.isDialog) {
          scope.visibleParameters = scope.parameters;
        } else {
          scope.$watch('parameters', function(parameters) {
            // Only show parameters that the user has to fill in a value when in a dialog.
            scope.visibleParameters = _.reject(parameters, function(parameter) {
              return !parameter.required || parameter.value || parameter.generate;
            });
          });
        }
      }
    };
  });
