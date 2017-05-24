'use strict';

angular.module('openshiftConsole').component('overviewNetworking', {
  controllerAs: 'networking',
  bindings: {
    // The services for the API object for this row.
    rowServices: '<',
    // All services in the namespace. Needed for route warnings where the route
    // has an alternate backend that's not part of `rowServices`.
    allServices: '<',
    // Map of routes by service name.
    routesByService: '<'
  },
  templateUrl: 'views/overview/_networking.html'
});
