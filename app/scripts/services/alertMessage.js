'use strict';

angular.module("openshiftConsole")
  .service("AlertMessageService", function(){
    var alerts = [];
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
      }
    };
  });
