"use strict";

angular.module('openshiftConsole')
  .directive('buildStatus', function() {
    return {
      restrict: 'E',
      scope: {
        build: '='
      },
      templateUrl: 'views/directives/build-status.html'
    };
  });