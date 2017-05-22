'use strict';

angular.module('openshiftConsole')
  .directive('imageNames', function($filter, PodsService) {
    return {
      restrict: 'E',
      scope: {
        podTemplate: '=',
        pods: '='
      },
      templateUrl: 'views/_image-names.html',
      link: function($scope) {
        var imageSHA = $filter('imageSHA');
        var updateImageDetails = function() {
          var firstContainer = _.get($scope, 'podTemplate.spec.containers[0]');
          if (!firstContainer) {
            return;
          }

          var sha = imageSHA(firstContainer.image);
          if (sha) {
            $scope.imageIDs = [ sha ];
            return;
          }

          $scope.imageIDs = PodsService.getImageIDs($scope.pods, firstContainer.name);
        };

        $scope.$watchGroup(['podTemplate', 'pods'], updateImageDetails);
      }
    };
  });
