'use strict';

angular.module('openshiftConsole')
  .directive('alerts', function() {
    return {
      restrict: 'E',
      scope: {
        alerts: '=',
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
      }
    };
  });
