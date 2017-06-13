'use strict';

angular.module('openshiftConsole')
  .directive('podWarnings', function(podWarningsFilter) {
    return {
      restrict:'E',
      scope: {
        pod: '='
      },
      link: function($scope) {
        var i, content = '', warnings = podWarningsFilter($scope.pod);
        for (i = 0; i < _.size(warnings); i++) {
          if (content) {
            content += '<br>';
          }
          if (warnings[i].severity === "error") {
            $scope.hasError = true;
          }
          content += warnings[i].message;
        }
        $scope.content = content;
      },
      templateUrl: 'views/directives/_warnings-popover.html'
    };
  })
  .directive('routeWarnings', function(RoutesService) {
    return {
      restrict: 'E',
      scope: {
        route: '=',
        services: '='
      },
      link: function($scope) {
        var updateWarnings = function() {
          var warnings = RoutesService.getRouteWarnings($scope.route, $scope.services);
          $scope.content = _.map(warnings, _.escape).join('<br>');
        };
        $scope.$watchGroup(['route', 'services'], updateWarnings);
      },
      templateUrl: 'views/directives/_warnings-popover.html'
    };
  });
