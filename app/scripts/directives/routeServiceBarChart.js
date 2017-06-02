'use strict';

(function() {
  angular.module('openshiftConsole').component('routeServiceBarChart', {
    controller: RouteServiceBarChart,
    controllerAs: 'routeServices',
    bindings: {
      route: '<',
      highlightService: '<'
    },
    templateUrl: 'views/directives/route-service-bar-chart.html'
  });

  function RouteServiceBarChart() {
    var routeServices = this;

    // Put the highlighted service at the top if set.
    var compareWeights = function(left, right) {
      if (left.name === routeServices.highlightService) {
        return -1;
      }

      if (right.name === routeServices.highlightService) {
        return 1;
      }

      // Fall back to comparing names if weights are equal.
      if (right.weight === left.weight) {
        return left.name.localeCompare(right.name);
      }

      return right.weight - left.weight;
    };

    var addBackend = function(backend) {
      routeServices.total += backend.weight;
      routeServices.max = Math.max(backend.weight, routeServices.max || 0);
      routeServices.backends.push({
        name: backend.name,
        weight: backend.weight
      });
    };

    routeServices.$onChanges = function() {
      routeServices.backends = [];
      routeServices.total = 0;
      if (!routeServices.route) {
        return;
      }

      addBackend(routeServices.route.spec.to);
      var alternateBackends = _.get(routeServices, 'route.spec.alternateBackends', []);
      _.each(alternateBackends, addBackend);

      routeServices.backends.sort(compareWeights);
    };

    routeServices.getPercentage = function(backend) {
      var total = routeServices.total || 100;
      var percent = (backend.weight / total) * 100;
      return _.round(percent)  + '%';
    };

    routeServices.barWidth = function(backend) {
      var max = routeServices.max || 100;
      return ((backend.weight / max) * 100) + '%';
    };
  }
})();
