'use strict';

angular.module("openshiftConsole")
  .factory("AggregatedLoggingService", function($q, Logger, DataService) {

    // cache previous request
    var userAllowed;

    // Create SelfSubjectAccessReview request againt authorization API to check whether
    // current user can view pods/log from 'default' project.
    // Users who can view such logs are 'operations' users
    var isOperationsUser = function() {
      if (userAllowed !== undefined) {
        // Using cached data.
        Logger.log("AggregatedLoggingService, using cached user");
        return $q.when(userAllowed);
      }
      Logger.log("AggregatedLoggingService, loading whether user is Operations user");
      var ssar = {
        apiVersion: 'authorization.k8s.io/v1',
        kind: 'SelfSubjectAccessReview',
        spec: {
          resourceAttributes: {
            resource: 'pods/log',
            namespace: 'default',
            verb: 'view'
          }
        }
      };
      return DataService.create({ group: 'authorization.k8s.io', version: 'v1', resource: 'selfsubjectaccessreviews'},
                        null, ssar, {namespace: 'default'}).then(
        function(data) {
          userAllowed = data.status.allowed;
          return userAllowed;
        }, function() {
          return false;
      });
    };

    return {
      isOperationsUser: isOperationsUser
    };
  });
