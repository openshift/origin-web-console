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
        'NotificationsService',
        'EventsService',
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
      NotificationsService,
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
      // our internal notifications
      // var clientGeneratedNotifications = [];

      var eventsWatcher;
      var eventsByNameData = {};
      var eventsMap = {};

      // TODO:
      // include both Notifications & Events,
      // rather than destroying the map each time maintain it & add new items

      // final Processed set of notification groups for UI
      // IF POSSIBLE, avoid having to convert back to an array.
      // var notificationGroupsMap = {};
      var notificationGroups = [];


      var projects = {};

      var getProject = function(projectName) {
        return DataService
                .get('projects', projectName, {}, {errorNotification: false})
                .then(function(project) {
                  projects[project.metadata.name] = project;
                  return project;
                });
      };

      var ensureProjectGroupExists = function(groups, projectName) {
        if(projectName && !groups[projectName]) {
          groups[projectName] = {
            heading: $filter('displayName')(projects[projectName]) || projectName,
            project: projects[projectName],
            notifications: []
          };
        }
      };

      var deregisterEventsWatch = function() {
        if(eventsWatcher) {
          DataService.unwatch(eventsWatcher);
        }
      };

      var watchEvents = function(projectName, cb) {
        deregisterEventsWatch();
        if(projectName) {
          eventsWatcher = DataService.watch('events', {namespace: projectName}, _.debounce(cb, 400), { skipDigest: true });
        }
      };

      // NotificationService notifications are minimal, they do no necessarily contain projectName info.
      // ATM tacking this on via watching the current project.
      // var watchNotifications = function(projectName, cb) {
      //   deregisterNotificationListener();
      //   if(!projectName) {
      //     return;
      //   }
      //   notificationListener = $rootScope.$on('NotificationsService.onNotificationAdded', cb);
      // };

      var deregisterNotificationListener = function() {
        notificationListener && notificationListener();
        notificationListener = null;
      };

      var unread = function(notifications) {
        return _.filter(notifications, 'unread');
      };

      // returns a count for each type of notification, example:
      // {Normal: 1, Warning: 5}
      // TODO: eliminate this $rootScope.$applyAsync,
      // there is a quirk here where the values are not picked up the
      // first time the function runs, despite the same $applyAsync
      // in the render() function
      var countUnreadNotificationsForGroup = function(group) {
        $rootScope.$applyAsync(function() {
          group.totalUnread = unread(group.notifications).length;
          group.hasUnread = !!group.totalUnread;
          $rootScope.$emit('NotificationDrawerWrapper.count', group.totalUnread);
        });
      };

      // currently we only show 1 at a time anyway
      var countUnreadNotificationsForAllGroups = function() {
        _.each(notificationGroups, countUnreadNotificationsForGroup);
      };

      var sortNotifications = function(notifications) {
        return _.orderBy(notifications, ['event.lastTimestamp', 'event.firstTimestamp'], ['desc', 'desc']);
      };

      var sortNotificationGroups = function(groupsMap) {
        // convert the map into a sorted array
        var sortedGroups = _.sortBy(groupsMap, function(group) {
          return group.heading;
        });
        // and sort the notifications under each one
        _.each(sortedGroups, function(group) {
          group.notifications = sortNotifications(group.notifications);
          group.counts = countUnreadNotificationsForGroup(group);
        });
        return sortedGroups;
      };

      var formatAndFilterEvents = function(eventMap) {
        var filtered = {};
        ensureProjectGroupExists(filtered, $routeParams.project);
        _.each(eventMap, function(event) {
          if(EventsService.isImportantEvent(event) && !EventsService.isCleared(event)) {
            ensureProjectGroupExists(filtered, event.metadata.namespace);
            filtered[event.metadata.namespace].notifications.push({
              unread:  !EventsService.isRead(event),
              event: event,
              actions: null
            });
          }
        });
        return filtered;
      };

      var deregisterRootScopeWatches = function() {
        _.each(rootScopeWatches, function(deregister) {
          deregister();
        });
        rootScopeWatches = [];
      };

      var hideIfNoProject = function(projectName) {
        if(!projectName) {
          drawer.drawerHidden = true;
        }
      };

      var render = function() {
        $rootScope.$evalAsync(function () {
          countUnreadNotificationsForAllGroups();
          // NOTE: we are currently only showing one project in the drawer at a
          // time. If we go back to multiple projects, we can eliminate the filter here
          // and just pass the whole array as notificationGroups.
          // if we do, we will have to handle group.open to keep track of what the
          // user is viewing at the time & indicate to the user that the non-active
          // project is "asleep"/not being watched.
          drawer.notificationGroups = _.filter(notificationGroups, function(group) {
            return group.project.metadata.name === $routeParams.project;
          });
        });
      };

      // TODO: follow-on PR to decide which of these events to toast,
      // via config in constants.js
      var eventWatchCallback = function(eventData) {
        eventsByNameData = eventData.by('metadata.name');
        eventsMap = formatAndFilterEvents(eventsByNameData);
        // TODO: Update to an intermediate map, so that we can then combine both
        // events + notifications into the final notificationGroups output
        notificationGroups = sortNotificationGroups(eventsMap);
        render();
      };

      // TODO: Follow-on PR to update & add the internal notifications to the
      // var notificationWatchCallback = function(event, notification) {
      //   // will need to add .event = {} and immitate structure
      //   if(!notification.lastTimestamp) {
      //     // creates a timestamp that matches event format: 2017-08-09T19:55:35Z
      //     notification.lastTimestamp = moment.parseZone(new Date()).utc().format();
      //   }
      //   clientGeneratedNotifications.push(notification);
      // };

      var iconClassByEventSeverity = {
        Normal: 'pficon pficon-info',
        Warning: 'pficon pficon-warning-triangle-o'
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
            EventsService.markRead(notification.event);
          });
          render();
          $rootScope.$emit('NotificationDrawerWrapper.onMarkAllRead');
        },
        onClearAll: function(group) {
          _.each(group.notifications, function(notification) {
            EventsService.markRead(notification.event);
            EventsService.markCleared(notification.event);
          });
          group.notifications = [];
          render();
          $rootScope.$emit('NotificationDrawerWrapper.onMarkAllRead');
        },
        notificationGroups: notificationGroups,
        headingInclude: 'views/directives/notifications/header.html',
        notificationBodyInclude: 'views/directives/notifications/notification-body.html',
        customScope: {
          clear: function(notification, index, group) {
            EventsService.markCleared(notification.event);
            group.notifications.splice(index, 1);
            countUnreadNotificationsForAllGroups();
          },
          markRead: function(notification) {
            notification.unread = false;
            EventsService.markRead(notification.event);
            countUnreadNotificationsForAllGroups();
          },
          getNotficationStatusIconClass: function(event) {
            return iconClassByEventSeverity[event.type] || iconClassByEventSeverity.info;
          },
          getStatusForCount:  function(countKey) {
            return iconClassByEventSeverity[countKey] || iconClassByEventSeverity.info;
          },
          close: function() {
            drawer.drawerHidden = true;
          }
        }
      });

      var projectChanged = function(next, current) {
        return _.get(next, 'params.project') !== _.get(current, 'params.project');
      };

      var reset = function() {
        getProject($routeParams.project).then(function() {
          watchEvents($routeParams.project, eventWatchCallback);
          //watchNotifications($routeParams.project, notificationWatchCallback);
          hideIfNoProject($routeParams.project);
          render();
        });
      };

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
        deregisterEventsWatch();
        deregisterRootScopeWatches();
      };

  }

})();
