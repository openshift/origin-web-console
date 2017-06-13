'use strict';

angular.module('openshiftConsole').component('overviewServiceBindings', {
  controllerAs: '$ctrl',
  bindings: {
    bindings: '<',
    bindableServiceInstances: '<',
    serviceClasses: '<',
    serviceInstances: '<',
    secrets: '<',
    createBinding: '&'
  },
  templateUrl: 'views/overview/_service-bindings.html'
});
