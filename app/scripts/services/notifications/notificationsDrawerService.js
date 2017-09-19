'use strict';

angular.module('openshiftConsole')
  .factory('NotificationDrawerService', [
    '$filter',
    '$rootScope',
    'EventsService',
    function($filter, $rootScope, EventsService) {

      var unread = function(notifications) {
        return _.filter(notifications, 'unread');
      };

      return {
        makeProjectGroup: function(project, notifications) {
          return {
            heading: $filter('displayName')(project),
            project: project,
            notifications: notifications
          };
        },

        clearAllNotificationsForGroup: function(notifications) {
          _.each(notifications, function(notification) {
            notification.unread = false;
            EventsService.markRead(notification.uid);
            EventsService.markCleared(notification.uid);
          });
        },

        countUnreadNotifications: function(notificationGroups) {
          _.each(notificationGroups, function(group) {
            group.totalUnread = unread(group.notifications).length;
            group.hasUnread = !!group.totalUnread;
            $rootScope.$emit('NotificationDrawerWrapper.onUnreadNotifications', group.totalUnread);
          });
        },

        formatInternalNotification: function(notification, projectName) {
          var id = notification.id || _.uniqueId('notification_') + Date.now();
          return {
            actions: null,
            unread: !EventsService.isRead(id),
            // using uid to match API events and have one filed to pass
            // to EventsService for read/cleared, etc
            trackByID: notification.trackByID,
            uid: id,
            type: notification.type,
            // API events have both lastTimestamp & firstTimestamp,
            // but we sort based on lastTimestamp first.
            lastTimestamp: notification.timestamp,
            message: notification.message,
            details: notification.details,
            namespace: projectName,
            links: notification.links
          };
        },

        formatAPIEvents: function(apiEvents) {
          return _.map(apiEvents, function(event) {
            return {
              actions: null,
              uid: event.metadata.uid,
              trackByID: event.metadata.uid,
              unread: !EventsService.isRead(event.metadata.uid),
              type: event.type,
              lastTimestamp: event.lastTimestamp,
              firstTimestamp: event.firstTimestamp,
              event: event
            };
          });
        },

        filterAPIEvents: function(events) {
          return _.reduce(events, function(result, event) {
            if(EventsService.isImportantAPIEvent(event) && !EventsService.isCleared(event.metadata.uid)) {
              result[event.metadata.uid] = event;
            }
            return result;
          }, {});
        },

        // we have to keep notifications & events separate as
        // notifications are ephemerial, but events have a time to live
        // set by the server.  we can merge them right before we update
        // the UI.
        mergeNotificationMaps: function(firstMap, secondMap) {
          return _.assign({}, firstMap, secondMap);
        },

        sortNotificationMap: function(map) {
          return _.orderBy(map, ['event.lastTimestamp', 'event.firstTimestamp'], ['desc', 'desc']);
        }
      };
    }
  ]);
