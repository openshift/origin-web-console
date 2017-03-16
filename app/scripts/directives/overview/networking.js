'use strict';

angular.module('openshiftConsole').component('overviewNetworking', {
  controllerAs: 'networking',
  bindings: {
    services: '<',
    routesByService: '<'
  },
  templateUrl: 'views/overview/_networking.html'
});
