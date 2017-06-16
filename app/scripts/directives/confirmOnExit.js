"use strict";

// http://stackoverflow.com/questions/14852802/detect-unsaved-changes-and-alert-user-using-angularjs
angular.module("openshiftConsole")
  .directive("confirmOnExit", function(Logger) {
    return {
      scope: {
        dirty: '=',
        message: '='
      },
      link: function($scope) {
        // If the feature is disabled or the user has asked the browser to
        // block dialogs, don't try to prompt.
        if (_.get(window, 'OPENSHIFT_CONSTANTS.DISABLE_CONFIRM_ON_EXIT') ||
            _.get(window, 'OPENSHIFT_CONSTANTS.CONFIRM_DIALOG_BLOCKED')) {
          return;
        }

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

        // Use $routeChangeStart instead of $locationChangeStart. Otherwise the
        // user is incorrectly prompted when switching tabs with
        // `persist-tab-state` on since this changes the URL, but doesn not
        // leave the page.
        var removeRouteChangeListener = $scope.$on('$routeChangeStart', function(event) {
          if (!$scope.dirty) {
            return;
          }

          var start = new Date().getTime();

          // Use a native confirm dialog to block code execution since we're in
          // the location change listener.
          var okToExit = confirm(getMessage());
          if (okToExit) {
            return;
          }

          // Workaround "Prevent this page from creating additional dialogs"
          //
          // If the response took less than 50ms, assume the confirm dialog was
          // blocked by the browser. There's no API to detect that the user
          // has told the browser to block these dialogs, and the user can't
          // navigate away otherwise.
          var end = new Date().getTime();
          if ((end - start) < 50) {
            // Remember that the user is blocking dialogs. This is a per session settings.
            _.set(window, 'OPENSHIFT_CONSTANTS.CONFIRM_DIALOG_BLOCKED', true);
            Logger.warn("Confirm on exit prompt appears to have been blocked by the browser.");
          } else {
            event.preventDefault();
          }
        });

        $scope.$on('$destroy', function() {
          $(window).off('beforeunload', confirmBeforeUnload);
          if (removeRouteChangeListener) {
            removeRouteChangeListener();
          }
        });
      }
    };
  });
