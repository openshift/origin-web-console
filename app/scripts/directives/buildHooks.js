'use strict';

angular.module('openshiftConsole')
  .directive('buildHooks',
    function() {
      return {
        restrict: 'E',
        templateUrl: 'views/directives/build-hooks.html',
        scope: {
          build: '=' // build or build config
        }
      };
    }
  );
