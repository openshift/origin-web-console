'use strict';

angular.module('openshiftConsole').directive('optionalLink', function () {
  return {
    restrict: 'E',
    scope: {
      link: '@'
    },
    transclude: true,
    template: '<a ng-href="{{link}}" ng-transclude ng-if="link"></a><span ng-transclude ng-if="!link"></span>'
  };
});
