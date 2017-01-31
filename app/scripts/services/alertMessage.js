'use strict';

angular.module("openshiftConsole")
  .service("AlertMessageService", function(){
    var alerts = [];
    var isAlertKey = function(key) {
      return _.startsWith(key, 'hide/alert/');
    };
    var alertHiddenKey = function(alertID, namespace) {
      if (!namespace) {
        return 'hide/alert/' + alertID;
      }

      return 'hide/alert/' + namespace + '/' + alertID;
    };
    return {
      addAlert: function(alert) {
        alerts.push(alert);
      },
      getAlerts: function() {
        return alerts;
      },
      clearAlerts: function() {
        alerts = [];
      },
      isAlertPermanentlyHidden: function(alertID, namespace) {
        var key = alertHiddenKey(alertID, namespace);
        return localStorage.getItem(key) === 'true';
      },
      permanentlyHideAlert: function(alertID, namespace) {
        var key = alertHiddenKey(alertID,namespace);
        localStorage.setItem(key, 'true');
      },
      resetHiddenAlerts: function() {
        var i, key;
        var alertKeys = [];

        // Find the alert keys.
        for (i = 0; i < localStorage.length; i++) {
          key = localStorage.key(i);
          if (isAlertKey(key)) {
            alertKeys.push(key);
          }
        }

        // Remove each alert key (outside the for loop so the indexes don't change and we miss items).
        _.each(alertKeys, function(key) {
          localStorage.removeItem(key);
        });
      }
    };
  });
