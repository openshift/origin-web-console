'use strict';

angular.module("openshiftConsole")
  .factory("AppsService", function() {
    var appLabel = function(apiObject) {
      return _.get(apiObject, 'metadata.labels.app', '');
    };

    // Place empty app labels last.
    var compareAppNames = function(left, right) {
      if (!left && !right) {
        return 0;
      }
      if (!left) {
        return 1;
      }
      if (!right) {
        return -1;
      }
      return left.toLowerCase().localeCompare(right.toLowerCase());
    };

    return {
      groupByApp: function(collection, sortBy) {
        var byApp = _.groupBy(collection, appLabel);
        if (sortBy) {
          _.mapValues(byApp, function(items) {
            return _.sortBy(items, sortBy);
          });
        }

        return byApp;
      },

      // Sort an array of app names.
      sortAppNames: function(appNames) {
        appNames.sort(compareAppNames);
      }
    };
  });

