'use strict';

angular.module('openshiftConsole')
  .directive('alerts', function() {
    return {
      restrict: 'E',
      scope: {
        // Map (or array) of alert objects, each with properties
        //   type:     'error', 'warning', 'success', or 'info' (default)
        //   message:  the message to display
        //   links:    an array of link objects (optional, see below)
        //   onClose:  callback function when the user dismisses the alert (optional)
        //
        // Each link can have the following properties:
        //   href:     link URL (optional if onClick is set)
        //   label:    the link text
        //   onClick:  handler to call when the link if clicked (optional)
        //             If onClick returns true, dismisses the alert
        alerts: '=',
        // Filter function (optional).
        filter: '=?',
        animateSlide: '=?',
        hideCloseButton: '=?',
        toast: '=?'
      },
      templateUrl: 'views/_alerts.html',
      link: function($scope) {
        $scope.close = function(alert) {
          alert.hidden = true;
          if (_.isFunction(alert.onClose)) {
            alert.onClose();
          }
        };
        $scope.onClick = function(alert, link) {
          if (_.isFunction(link.onClick)) {
            // If onClick() returns true, also hide the alert.
            var close = link.onClick();
            if (close) {
              alert.hidden = true;
            }
          }
        };
      }
    };
  });
