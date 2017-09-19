'use strict';

angular.module('openshiftConsole')
  .factory('EventsService', [
    'BrowserStore',
    function(BrowserStore) {

      var READ = 'read';
      var CLEARED = 'cleared';

      var cachedEvents = BrowserStore.loadJSON('session','events') || {};

      var EVENTS_TO_SHOW_BY_REASON = _.get(window, 'OPENSHIFT_CONSTANTS.EVENTS_TO_SHOW');

      var isImportantAPIEvent = function(event) {
        return EVENTS_TO_SHOW_BY_REASON[event.reason];
      };

      var markRead = function(id) {
        _.set(cachedEvents, [id, READ], true);
        BrowserStore.saveJSON('session','events', cachedEvents);
      };

      var markCleared = function(id) {
        _.set(cachedEvents, [id, CLEARED], true);
        BrowserStore.saveJSON('session','events', cachedEvents);
      };

      var isRead = function(id) {
        return _.get(cachedEvents, [id, READ]);
      };

      var isCleared = function(id) {
        return _.get(cachedEvents, [id, CLEARED]);
      };

      return {
        isImportantAPIEvent: isImportantAPIEvent,
        // read removes the event bold effect
        markRead: markRead,
        isRead: isRead,
        // cleared removes event from the list
        markCleared: markCleared,
        isCleared: isCleared
      };
    }
  ]);
