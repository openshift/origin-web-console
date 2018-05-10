'use strict';

angular.module('openshiftConsole')
  .filter('isMobileService', function() {
    return function(serviceClass) {
      var tags = _.get(serviceClass, 'spec.tags');
      return _.includes(tags, 'mobile-service');
    };
  });
