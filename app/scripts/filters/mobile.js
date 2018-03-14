'use strict';

angular.module('openshiftConsole')
  .filter('isMobileService', function() {
    return function(serviceInstance) {
      return _.get(serviceInstance, 'metadata.labels.mobile') === 'enabled';
    };
  });