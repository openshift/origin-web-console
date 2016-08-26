'use strict';

angular.module('openshiftConsole')
  .directive('selector', function() {
    return {
      restrict: 'E',
      scope: {
        selector: '='
      },
      templateUrl: 'views/directives/selector.html'
    };
  });
