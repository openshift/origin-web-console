'use strict';

(function() {

  angular
    .module('openshiftConsole')
    // shim for communicationg with pfNotificationDrawer
    .component('notificationDrawerWrapper', {
      templateUrl: 'views/directives/notifications/notification-drawer-wrapper.html',
      controller: [
        '$filter',
        '$interval',
        '$location',
        '$timeout',
        '$routeParams',
        '$rootScope',
        'Constants',
        'DataService',
        'EventsService',
        'NotificationsService',
        NotificationDrawerWrapper
      ]
    });

  function NotificationDrawerWrapper(
      $filter,
      $interval,
      $location,
      $timeout,
      $routeParams,
      $rootScope,
      Constants,
      DataService,
      EventsService) {

      // kill switch if watching events is too expensive
      var DISABLE_GLOBAL_EVENT_WATCH = _.get(Constants, 'DISABLE_GLOBAL_EVENT_WATCH');
      var LIMIT_WATCHES = $filter('isIE')() || $filter('isEdge')();

      var drawer = this;

      // global event watches
      var rootScopeWatches = [];
      // this one is treated separately from the rootScopeWatches as
      // it may need to be updated outside of the lifecycle of init/destroy
      var notificationListener;
      var apiEventsWatcher;
      // data
      var apiEventsMap = {
        // projName: { events }
      };
      var notificationsMap = {
        // projName: { notifications }
      };

      var projects = {};

      var hideIfNoProject = function(projectName) {
        if(!projectName) {
          drawer.drawerHidden = true;
        }
      };

      var projectChanged = function(next, current) {
        return _.get(next, 'params.project') !== _.get(current, 'params.project');
      };

      var getProject = function(projectName) {
        return DataService
                .get('projects', projectName, {}, {errorNotification: false})
                .then(function(project) {
                  projects[project.metadata.name] = project;
                  return project;
                });
      };

      var makeProjectGroup = function(projectName, notifications) {
        return {
          heading: $filter('displayName')(projects[projectName]),
          project: projects[projectName],
          notifications: notifications
        };
      };

      var unread = function(notifications) {
        return _.filter(notifications, 'unread');
      };


      var countUnreadNotifications = function() {
        _.each(drawer.notificationGroups, function(group) {
          group.totalUnread = unread(group.notifications).length;
          group.hasUnread = !!group.totalUnread;
          $rootScope.$emit('NotificationDrawerWrapper.onUnreadNotifications', group.totalUnread);
        });
      };

      var removeNotificationFromGroup = function(notification) {
        _.each(drawer.notificationGroups, function(group) {
          _.remove(group.notifications, { uid: notification.uid, namespace: notification.namespace });
        });
      };

      var formatAPIEvents = function(apiEvents) {
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
      };

      var filterAPIEvents = function(events) {
        return _.reduce(events, function(result, event) {
          if(EventsService.isImportantAPIEvent(event) && !EventsService.isCleared(event.metadata.uid)) {
            result[event.metadata.uid] = event;
          }
          return result;
        }, {});
      };

      // we have to keep notifications & events separate as
      // notifications are ephemerial, but events have a time to live
      // set by the server.  we can merge them right before we update
      // the UI.
      var mergeMaps = function(firstMap, secondMap) {
        var proj = $routeParams.project;
        return _.assign({}, firstMap[proj], secondMap[proj]);
      };

      var sortMap = function(map) {
        return _.orderBy(map, ['event.lastTimestamp', 'event.firstTimestamp'], ['desc', 'desc']);
      };

      var render = function() {
        $rootScope.$evalAsync(function() {
            drawer.notificationGroups = [
              makeProjectGroup($routeParams.project, sortMap( mergeMaps(apiEventsMap, notificationsMap )))
            ];
            countUnreadNotifications();
        });
      };

      var deregisterRootScopeWatches = function() {
        _.each(rootScopeWatches, function(deregister) {
          deregister();
        });
        rootScopeWatches = [];
      };

      var deregisterAPIEventsWatch = function() {
        if(apiEventsWatcher) {
          DataService.unwatch(apiEventsWatcher);
          apiEventsWatcher = null;
        }
      };

      var deregisterNotificationListener = function() {
        notificationListener && notificationListener();
        notificationListener = null;
      };

      var apiEventWatchCallback = function(eventData) {
        apiEventsMap[$routeParams.project] = formatAPIEvents(filterAPIEvents(eventData.by('metadata.name')));
        render();
      };

      var notificationWatchCallback = function(event, notification) {
        if(!notification.showInDrawer) {
          return;
        }
        var project = notification.namespace || $routeParams.project;
        var id = notification.id || _.uniqueId('notification_') + Date.now();
        notificationsMap[project] = notificationsMap[project] || {};
        notificationsMap[project][id] = {
          actions: notification.actions,
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
          isHTML: notification.isHTML,
          details: notification.details,
          namespace: project,
          links: notification.links
        };
        render();
      };

      var watchEvents = function(projectName, cb) {
        deregisterAPIEventsWatch();
        if(projectName) {
          apiEventsWatcher = DataService.watch('events', {namespace: projectName}, _.debounce(cb, 400), { skipDigest: true });
        }
      };

      var watchNotifications = _.once(function(projectName, cb) {
        deregisterNotificationListener();
        notificationListener = $rootScope.$on('NotificationsService.onNotificationAdded', cb);
      });

      var reset = function() {
        getProject($routeParams.project).then(function() {
          watchEvents($routeParams.project, apiEventWatchCallback);
          watchNotifications($routeParams.project, notificationWatchCallback);
          hideIfNoProject($routeParams.project);
          render();
        });
      };

      angular.extend(drawer, {
        drawerHidden: true,
        allowExpand: true,
        drawerExpanded: false,
        drawerTitle: 'Notifications',
        hasUnread: false,
        showClearAll: true,
        showMarkAllRead: true,
        onClose: function() {
          drawer.drawerHidden = true;
        },
        onMarkAllRead: function(group) {
          _.each(group.notifications, function(notification) {
            notification.unread = false;
            EventsService.markRead(notification.uid);
          });
          render();
          $rootScope.$emit('NotificationDrawerWrapper.onMarkAllRead');
        },
        onClearAll: function(group) {
          _.each(group.notifications, function(notification) {
            notification.unread = false;
            EventsService.markRead(notification.uid);
            EventsService.markCleared(notification.uid);
          });
          apiEventsMap[$routeParams.project] = {};
          notificationsMap[$routeParams.project] = {};
          render();
          $rootScope.$emit('NotificationDrawerWrapper.onMarkAllRead');
        },
        notificationGroups: [],
        headingInclude: 'views/directives/notifications/header.html',
        notificationBodyInclude: 'views/directives/notifications/notification-body.html',
        customScope: {
          clear: function(notification, index, group) {
            EventsService.markCleared(notification.uid);
            group.notifications.splice(index, 1);
            countUnreadNotifications();
          },
          markRead: function(notification) {
            notification.unread = false;
            EventsService.markRead(notification.uid);
            countUnreadNotifications();
          },
          close: function() {
            drawer.drawerHidden = true;
          },
          onLinkClick: function(link) {
            link.onClick();
            drawer.drawerHidden = true;
          },
          countUnreadNotifications: countUnreadNotifications
        }
      });


      var initWatches = function() {
        if($routeParams.project) {
          reset();
        }
        // $routeChangeSuccess seems more reliable than $locationChangeSuccess:
        // - it fires once on initial load. $locationChangeSuccess does not.
        // - it waits for more object resolution (not a huge deal in this use case)
        // - tracks route data instead of urls (args to callback fn, also not
        //   necessary for the current use case)
        rootScopeWatches.push($rootScope.$on("$routeChangeSuccess", function (evt, next, current) {
          if(projectChanged(next, current)) {
            drawer.customScope.projectName = $routeParams.project;
            reset();
          }
        }));

        // event from the counter to signal the drawer to open/close
        rootScopeWatches.push($rootScope.$on('NotificationDrawerWrapper.toggle', function() {
          drawer.drawerHidden = !drawer.drawerHidden;
        }));

        // event to signal the drawer to close
        rootScopeWatches.push($rootScope.$on('NotificationDrawerWrapper.hide', function() {
          drawer.drawerHidden = true;
        }));

        // event to signal the drawer to clear a notification
        rootScopeWatches.push($rootScope.$on('NotificationDrawerWrapper.clear', function(event, notification) {
          EventsService.markCleared(notification.uid);
          removeNotificationFromGroup(notification);
          drawer.countUnreadNotifications();
        }));
      };

      drawer.$onInit = function() {
        if(DISABLE_GLOBAL_EVENT_WATCH || LIMIT_WATCHES) {
          return;
        }
        initWatches();
      };

      drawer.$onDestroy = function() {
        deregisterNotificationListener();
        deregisterAPIEventsWatch();
        deregisterRootScopeWatches();
      };
  }

})();
