'use strict';

angular.module('openshiftConsole')
  .factory('ServiceInstancesService', function() {
    return {
      // NOTE: should this be a filter?
      // gets the name from the appropriate service class,
      // otherwise falls back to the instance name
      getDisplayName: function(instance, serviceClasses) {
        var serviceClassName = instance.spec.serviceClassName;
        var instanceName = instance.metadata.name;
        var serviceClassDisplayName = _.get(serviceClasses, [serviceClassName, 'osbMetadata', 'displayName']);
        return serviceClassDisplayName || serviceClassName || instanceName;
      }
    };
  });
