'use strict';

angular.module('openshiftConsole')
  .filter('isMobileService', function() {
    return function(serviceClass) {
      // Get the service tags and check if it's tagged as a mobile-service
      var tags = _.get(serviceClass, 'spec.tags');
      return _.includes(tags, 'mobile-service') ;
    };
  });
