"use strict";

angular.module("openshiftConsole")
  /**
   * Widget for selecting multiple containers from a pod template. Displays the
   * containers as checkboxes.
   */
  .directive("selectContainers", function() {
    return {
      restrict: 'E',
      scope: {
        containers: '=ngModel',
        template: '=podTemplate',
        required: '=ngRequired',
        helpText: '@?'
      },
      templateUrl: 'views/directives/select-containers.html',
      controller: function($scope) {
        $scope.containers = $scope.containers || {};
        $scope.$watch('containers', function(containers) {
          $scope.containerSelected = _.some(containers, function(selected) {
            return selected;
          });
        }, true);
      }
    };
  });

