'use strict';

angular.module('openshiftConsole').component('overviewPipelines', {
  controllerAs: 'overviewPipelines',
  bindings: {
    recentPipelines: '<'
  },
  templateUrl: 'views/overview/_pipelines.html'
});
