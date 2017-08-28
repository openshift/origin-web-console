'use strict';

angular.module('openshiftConsole')
  .factory('EventsService', [
    'BrowserStore',
    function(BrowserStore) {

      var READ = 'read';
      var CLEARED = 'cleared';

      var cachedEvents = BrowserStore.loadJSON('session','events') || {};

      var EVENTS_TO_SHOW_BY_REASON = _.get(window, 'OPENSHIFT_CONSTANTS.EVENTS_TO_SHOW');

      var isImportantEvent = function(event) {
        var reason = event.reason;
        return EVENTS_TO_SHOW_BY_REASON[reason];
      };

      var markRead = function(event) {
        _.set(cachedEvents, [event.metadata.uid, READ], true);
        BrowserStore.saveJSON('session','events', cachedEvents);
      };

      var markCleared = function(event) {
        _.set(cachedEvents, [event.metadata.uid, CLEARED], true);
        BrowserStore.saveJSON('session','events', cachedEvents);
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
