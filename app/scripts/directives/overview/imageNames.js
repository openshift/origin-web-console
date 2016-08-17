'use strict';

angular.module('openshiftConsole')
  .directive('imageNames', function() {
    return {
      restrict: 'E',
      scope: {
        podTemplate: '='
      },
      templateUrl: 'views/overview/_image-names.html'
    };
  });
