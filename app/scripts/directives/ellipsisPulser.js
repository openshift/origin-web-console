'use strict';

angular.module('openshiftConsole')
  .directive('ellipsisPulser', [
    function() {
      return {
        restrict: 'E',
        scope: {
          color: '@',
          display: '@',
          size: '@',
          msg: '@'
        },
        templateUrl: 'views/directives/_ellipsis-pulser.html'
      };
    }
  ]);
