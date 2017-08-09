'use strict';

angular.module('openshiftConsole').component('overviewServiceBindings', {
  controllerAs: '$ctrl',
  bindings: {
    namespace: '<',
    bindings: '<',
    bindableServiceInstances: '<',
    serviceClasses: '<',
    serviceInstances: '<',
    createBinding: '&'
  },
  templateUrl: 'views/overview/_service-bindings.html'
});
