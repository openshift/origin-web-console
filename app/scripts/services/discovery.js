'use strict';

angular.module('openshiftConsole')
  .factory('APIDiscovery', ['LOGGING_URL', 'METRICS_URL', 'APIService', '$q', '$filter', function(LOGGING_URL, METRICS_URL, APIService, $q, $filter) {
    return {
      // Simulate asynchronous requests for now. If these are ever updated to call to a discovery
      // endpoint, we need to make sure to trigger a digest loop using (or update all callers).
      getLoggingURL: function(project) {
        var loggingURL = LOGGING_URL;
        var loggingUIHostname = $filter('annotation')(project, 'loggingUIHostname');
        if(loggingUIHostname) {
           loggingURL = 'https://' + loggingUIHostname;
        }

        return $q.when(loggingURL);
      },
      getMetricsURL: function() {
        return $q.when(METRICS_URL);
      },
      toResourceGroupVersion: function(obj) {
        var resources;
        var groupVersion = APIService.parseGroupVersion(obj.apiVersion);
        if (groupVersion.group) {
          resources = _.get(window.OPENSHIFT_CONFIG, ['apis', 'groups', groupVersion.group, 'versions', groupVersion.version, 'resources']);
          var resource = _.find(resources, {kind: obj.kind});
          if (resource) {
            return {
              resource: resource.name,
              group: groupVersion.group,
              version: groupVersion.version,
            };
          }
        }

        return APIService.objectToResourceGroupVersion(obj);
      }
    };
  }]);
