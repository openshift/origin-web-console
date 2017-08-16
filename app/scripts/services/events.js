'use strict';

angular.module('openshiftConsole')
  .factory('EventsService', [
    function() {

      // TODO: extract Store as a general service that can be used elsewhere.
      // TODO: along with the auto prefix of `openshift/`, it should support
      // many unique keys so we dont need to new Store() for each key
      // Automaticaly namespaces all of our storage, whether in session or local
      var namespace = 'openshift/';

      function Store(type, key) {
        this.type = type;
        this.key = key;
      }

      Store.prototype.loadJSON = function() {
        return JSON.parse(window[this.type].getItem(namespace + this.key) || '{}');
      };

      Store.prototype.saveJSON = function(data) {
        window[this.type].setItem(namespace + this.key, JSON.stringify(data));
      };

      var store = new Store('sessionStorage', 'events');

      var READ = 'read';
      var CLEARED = 'cleared';

      var cachedEvents = store.loadJSON() || {};

      var EVENTS_TO_SHOW_BY_REASON = _.get(window, 'OPENSHIFT_CONSTANTS.EVENTS_TO_SHOW');

      var isImportantEvent = function(event) {
        var reason = event.reason;
        return EVENTS_TO_SHOW_BY_REASON[reason];
      };

      var markRead = function(event) {
        _.set(cachedEvents, [event.metadata.uid, READ], true);
        store.saveJSON(cachedEvents);
      };

      var markCleared = function(event) {
        _.set(cachedEvents, [event.metadata.uid, CLEARED], true);
        store.saveJSON(cachedEvents);
      };

      var isRead = function(event) {
        return _.get(cachedEvents, [event.metadata.uid, READ]);
      };

      var isCleared = function(event) {
        return _.get(cachedEvents, [event.metadata.uid, CLEARED]);
      };

      return {
        isImportantEvent: isImportantEvent,
        // read removes the event bold effect
        markRead: markRead,
        isRead: isRead,
        // cleared removes event from the list
        markCleared: markCleared,
        isCleared: isCleared
      };
    }
  ]);
