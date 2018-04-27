'use strict';

angular.module('openshiftConsole').directive('dropdownItem', ['$compile', function ($compile) {
  return {
    restrict: 'E',
    transclude: true,
    scope: {
      action: '&',
      enabled: '<'
    },
    link: function ($scope, $element, $attrs, ctrl, transcludeFn) {
      var currentElement = $element;

      function onAttrChange() {
        var template = $scope.enabled ? '<li><a ng-click="action()" href="" ng-transclude></a></li>'
                                      : '<li class="disabled"><a ng-click="$event.stopPropagation()" ng-transclude></a></li>';
        var newElement = $compile(template, transcludeFn)($scope);
        currentElement.replaceWith(newElement);
        currentElement = newElement;
      }

      $scope.$watch('action', onAttrChange);
      $scope.$watch('enabled', onAttrChange);
    }
  };
}]);
