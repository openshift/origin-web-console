'use strict';
(function() {

  angular
    .module('openshiftConsole')
    .component('notificationCounter', {
      templateUrl: 'views/directives/notifications/notification-counter.html',
      bindings: {},
      controller: [
        '$filter',
        '$routeParams',
        '$rootScope',
        'Constants',
        NotificationCounter
      ]
    });

  function NotificationCounter($filter, $routeParams, $rootScope, Constants) {

      var counter = this;
      var DISABLE_GLOBAL_EVENT_WATCH = _.get(Constants, 'DISABLE_GLOBAL_EVENT_WATCH');
      var LIMIT_WATCHES = $filter('isIE')();

      counter.hide = true;

      var rootScopeWatches = [];
      // this one is treated separately from the rootScopeWatches as
      // it may need to be updated outside of the lifecycle of init/destroy
      var notificationListeners = [];

      var watchNotificationDrawerCount = function(projectName, cb) {
        if(!projectName) {
          return;
        }
        notificationListeners.push($rootScope.$on('NotificationDrawerWrapper.onUnreadNotifications', cb));
      };

      var deregisterNotificationListeners = function() {
        _.each(notificationListeners, function(listener) {
          listener && listener();
        });
        notificationListeners = [];
      };

      var deregisterRootScopeWatches = function() {
        _.each(rootScopeWatches, function(deregister) {
          deregister();
        });
        rootScopeWatches = [];
      };

      var hideIfNoProject = function(projectName) {
        if(!projectName) {
          counter.hide = true;
        } else {
          counter.hide = false;
        }
      };

      counter.onClick = function() {
        $rootScope.$emit('NotificationDrawerWrapper.toggle');
      };

      var drawerCountCallback = function(event, newCount) {
        // NOTE: unread !== seen.  We do not automatically mark
        // notifications unread when the drawer is closed.
        if(newCount) {
          counter.showUnreadNotificationsIndicator = true;
        } else {
          counter.showUnreadNotificationsIndicator = false;
        }
      };

      var projectChanged = function(next, current) {
        return _.get(next, 'params.project') !== _.get(current, 'params.project');
      };

      var reset = function() {
        watchNotificationDrawerCount($routeParams.project, drawerCountCallback);
        hideIfNoProject($routeParams.project);
      };

      var initWatches = function() {
        reset();
        rootScopeWatches.push($rootScope.$on("$routeChangeSuccess", function (evt, next, current) {
          if(projectChanged(next, current)) {
            reset();
          }
        }));

        rootScopeWatches.push($rootScope.$on('NotificationDrawerWrapper.onMarkAllRead', function() {
          counter.showUnreadNotificationsIndicator = false;
        }));
      };

      counter.$onInit = function() {
        if(DISABLE_GLOBAL_EVENT_WATCH || LIMIT_WATCHES) {
          counter.hide = true;
          return;
        }
        initWatches();
      };

      counter.$onDestroy = function() {
        deregisterNotificationListeners();
        deregisterRootScopeWatches();
      };
  }
})();
