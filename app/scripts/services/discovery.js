'use strict';

angular.module('openshiftConsole')
  .factory('APIDiscovery', ['LOGGING_URL', 'METRICS_URL', '$q', '$filter', function(LOGGING_URL, METRICS_URL, $q, $filter) {
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
      }
    };
  }]);
