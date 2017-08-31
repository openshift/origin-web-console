'use strict';

angular.module('openshiftConsole')
  // This triggers when an element has either a toggle or data-toggle attribute set on it
  .directive('templateOptions', function(gettext) {
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

        scope.singleText = gettext('Collapse to a single line input This may strip any new lines you have entered.');
        scope.multiText = gettext('Expand to enter multiple lines of content. This is required if you need to include newline characters.');
      }
    };
  });
