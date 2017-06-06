"use strict";

// http://stackoverflow.com/questions/14852802/detect-unsaved-changes-and-alert-user-using-angularjs
angular.module("openshiftConsole")
  .directive("confirmOnExit", function() {
    return {
      scope: {
        dirty: '=',
        message: '='
      },
      link: function($scope) {
        var getMessage = function() {
          return $scope.message || "You have unsaved changes. Leave this page anyway?";
        };

        var confirmBeforeUnload = function() {
          if (!$scope.dirty) {
            return;
          }

          return getMessage();
        };
        $(window).on('beforeunload', confirmBeforeUnload);

        var removeLocationChangeListener = $scope.$on('$locationChangeStart', function(event) {
          if (!$scope.dirty) {
            return;
          }

          if(!confirm(getMessage())) {
            event.preventDefault();
          }
        });

        $scope.$on('$destroy', function() {
          $(window).off('beforeunload', confirmBeforeUnload);
          if (removeLocationChangeListener) {
            removeLocationChangeListener();
          }
        });
      }
    };
  });
