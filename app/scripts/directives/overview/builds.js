'use strict';

(function() {
  angular.module('openshiftConsole').component('overviewBuilds', {
    controller: [
      '$filter',
      OverviewBuilds
    ],
    controllerAs: 'overviewBuilds',
    bindings: {
      buildConfigs: '<',
      recentBuildsByBuildConfig: '<',
      context: '<',
      hideLog: '<'
    },
    templateUrl: 'views/overview/_builds.html'
  });

  function OverviewBuilds($filter) {
    var canIViewLogs;
    var canI = $filter('canI');

    this.$onInit = function() {
      canIViewLogs = canI('builds/log', 'get');
    };

    this.showLogs = function(build) {
      if (this.hideLog) {
        return false;
      }

      if (!canIViewLogs) {
        return false;
      }

      if (!_.get(build, 'status.startTimestamp')) {
        return false;
      }

      if (_.get(build, 'status.phase') !== 'Complete') {
        return true;
      }

      // Has the build completed recently?
      var completed = _.get(build, 'status.completionTimestamp');
      if (!completed) {
        return false;
      }

      var threeMinutesAgo = moment().subtract(3, 'm');
      return moment(completed).isAfter(threeMinutesAgo);
    };
  }
})();
