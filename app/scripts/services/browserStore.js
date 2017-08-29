'use strict';

angular.module('openshiftConsole')
  .factory('BrowserStore', [
    function() {
      var prefix = 'openshift/';
      // NOTE: we could impl `memory` & `cookie` as well, if useful.
      var stores = {
        local: window.localStorage,
        session: window.sessionStorage
      };

      // USAGE:
      // BrowserStore.saveJSON('session', 'my-key', someData);
      // BrowserStore.loadJSON('session', 'my-key');
      return {
        saveJSON: function(storeType, storeKey, data) {
          return stores[storeType].setItem(prefix + storeKey, JSON.stringify(data));
        },
        loadJSON: function(storeType, storeKey) {
          return JSON.parse(stores[storeType].getItem(prefix + storeKey) || '{}');
        }
      };
    }
  ]);
