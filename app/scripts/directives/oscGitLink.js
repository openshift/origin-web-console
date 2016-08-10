'use strict';

angular.module('openshiftConsole')
.directive('oscGitLink', function($filter) {
  return {
    restrict: 'E',
    scope: {
      uri: "=",
      ref: "=",
      contextDir: "="
    },
    transclude: true,
    link: function($scope) {
      var isAbsoluteURL = $filter('isAbsoluteURL');
      var githubLink = $filter('githubLink');
      $scope.$watchGroup(['uri', 'ref', 'contextDir'], function() {
        $scope.gitLink = githubLink($scope.uri, $scope.ref, $scope.contextDir);
        $scope.isLink = isAbsoluteURL($scope.gitLink);
      });
    },
    template: '<a ng-if="isLink" ng-href="{{gitLink}}" ng-transclude target="_blank"></a><span ng-if="!isLink" ng-transclude></span>'
  };
});
