'use strict';
/* jshint unused: false */

angular.module('openshiftConsole')
  .directive('buildClose', function($window) {
    // so that builds can be dismissed on overview
    var hideBuildKey = function(build) {
      return 'hide/build/' + build.metadata.uid;
    };

    var isBuildHidden = function(build) {
      var key = hideBuildKey(build);
      return sessionStorage.getItem(key) === 'true';
    };

    return {
      restrict: 'AE',
      scope: {
        build: '=',
        hideBuild: '=' // for ng-show or ng-hide, not ng-if!
      },
      controller: function($scope) {
        $scope.onHideBuild = function() {
          var key = hideBuildKey($scope.build);
          $scope.hideBuild = true;
          sessionStorage.setItem(key, 'true');
        };
      },
      link: function($scope, $elem, $attrs, ctrl) {
        // initialize
        $scope.hideBuild = false;
        // if the build changes, check storage to see if its a hidden build
        $scope.$watch('build', function(newVal) {
          $scope.hideBuild = isBuildHidden(newVal);
        });
      },
      templateUrl: 'views/directives/_build-close.html'
    };
  });
