"use strict";

angular.module('openshiftConsole')
  .directive('buildPipeline', function($filter, Logger) {
    return {
      restrict: 'E',
      scope: {
        build: '='
      },
      templateUrl: 'views/directives/build-pipeline.html',
      link: function($scope) {
        // Example JSON:
        //   https://github.com/jenkinsci/pipeline-stage-view-plugin/tree/master/rest-api#get-jobjob-namerun-idwfapidescribe
        var annotation = $filter('annotation');
        $scope.$watch(function() {
          return annotation($scope.build, 'jenkinsStatus');
        }, function(value) {
          if (!value) {
            return;
          }

          try {
            $scope.jenkinsStatus = JSON.parse(value);
          } catch (e) {
            Logger.error('Could not parse Jenkins status as JSON', value);
          }
        });
      }
    };
  })
  .directive('pipelineStatus', function() {
    return {
      restrict: 'E',
      scope: {
        status: '='
      },
      templateUrl: 'views/directives/pipeline-status.html'
    };
  });
