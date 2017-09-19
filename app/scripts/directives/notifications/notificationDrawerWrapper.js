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
        'NotificationDrawerService',
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
      EventsService,
      NotificationDrawerService) {

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

      var mergeMaps = NotificationDrawerService.mergeNotificationMaps;
      var sortMap = NotificationDrawerService.sortNotificationMap;
      var makeProjectGroup = NotificationDrawerService.makeProjectGroup;
      var formatInternalNotification = NotificationDrawerService.formatInternalNotification;
      var formatAPIEvents = NotificationDrawerService.formatAPIEvents;
      var filterAPIEvents = NotificationDrawerService.filterAPIEvents;
      var countUnreadNotifications = NotificationDrawerService.countUnreadNotifications;
      var clearAllNotificationsForGroup = NotificationDrawerService.clearAllNotificationsForGroup;

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

      var render = function() {
        $rootScope.$evalAsync(function() {
            var proj = $routeParams.project;
            drawer.notificationGroups = [
              makeProjectGroup(
                projects[proj],
                sortMap(
                  mergeMaps(apiEventsMap[proj], notificationsMap[proj] )))
            ];
            countUnreadNotifications(drawer.notificationGroups);
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
        var projectName = notification.namespace || $routeParams.project;
        var id = notification.id || _.uniqueId('notification_') + Date.now();
        notificationsMap[projectName] = notificationsMap[projectName] || {};
        notificationsMap[projectName][id] = formatInternalNotification(notification, projectName);
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
          clearAllNotificationsForGroup(group.notifications);
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
            countUnreadNotifications(drawer.notificationGroups);
          },
          markRead: function(notification) {
            notification.unread = false;
            EventsService.markRead(notification.uid);
            countUnreadNotifications(drawer.notificationGroups);
          },
          close: function() {
            drawer.drawerHidden = true;
          },
          onLinkClick: function(link) {
            link.onClick();
            drawer.drawerHidden = true;
          }
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
