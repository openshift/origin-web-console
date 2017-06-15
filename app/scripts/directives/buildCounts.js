'use strict';

(function() {  
  angular.module('openshiftConsole').component('buildCounts', {
    controller: [
      '$scope',
      'BuildsService',
      BuildCounts
    ],
    controllerAs: 'buildCounts',
    bindings: {
      builds: '<',
      showRunningStage: '<',
      label: '@'
    },
    templateUrl: 'views/overview/_build-counts.html'
  });

  function BuildCounts($scope, BuildsService) {
    var buildCounts = this;

    buildCounts.interestingPhases = ['Pending', 'Running', 'Failed', 'Error'];
    var isInteresting = function(build) {
      var phase = _.get(build, 'status.phase');
      return _.includes(buildCounts.interestingPhases, phase);
    };

    buildCounts.$onChanges = _.debounce(function() {
      $scope.$apply(function() {
        var buildsByPhase = _.groupBy(buildCounts.builds, 'status.phase');
        buildCounts.countByPhase = _.mapValues(buildsByPhase, _.size);
        buildCounts.show = _.some(buildCounts.builds, isInteresting);
        if (!buildCounts.showRunningStage || buildCounts.countByPhase.Running !== 1) {
          buildCounts.currentStage = null;
          return;
        }

        var runningBuild = _.head(buildsByPhase.Running);
        buildCounts.currentStage = BuildsService.getCurrentStage(runningBuild);
      });
    }, 200);
  }
})();
