'use strict';
(function() {

  angular
    .module('openshiftConsole')
    .component('notificationCounter', {
      templateUrl: 'views/directives/notifications/notification-counter.html',
      bindings: {},
      controller: [
        '$routeParams',
        '$rootScope',
        'Constants',
        NotificationCounter
      ]
    });

  function NotificationCounter($routeParams, $rootScope, Constants) {

      var counter = this;
      var DISABLE_GLOBAL_EVENT_WATCH = _.get(Constants, 'DISABLE_GLOBAL_EVENT_WATCH');

      counter.hide = true;

      var rootScopeWatches = [];
      // this one is treated separately from the rootScopeWatches as
      // it may need to be updated outside of the lifecycle of init/destroy
      var notificationListeners = [];

      var watchNotificationDrawerCount = function(projectName, cb) {
        if(!projectName) {
          return;
        }
        notificationListeners.push($rootScope.$on('notification-drawer:count', cb));
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
        $rootScope.$emit('notification-drawer:toggle');
      };

      var drawerCountCallback = function(event, newCount) {
        if(newCount) {
          counter.showNewNotificationIndicator = true;
        } else {
          counter.showNewNotificationIndicator = false;
        }
      };

      var projectChanged = function(next, current) {
        return _.get(next, 'params.project') !== _.get(current, 'params.project');
      };

      var reset = function() {
        watchNotificationDrawerCount($routeParams.project, drawerCountCallback);
        hideIfNoProject($routeParams.project);
      };

      counter.$onInit = function() {
        if(DISABLE_GLOBAL_EVENT_WATCH) {
          counter.hide = true;
          return;
        }
        if($routeParams.project) {
          reset();
        }
        rootScopeWatches.push($rootScope.$on("$routeChangeSuccess", function (evt, next, current) {
          if(projectChanged(next, current)) {
            reset();
          }
        }));

        rootScopeWatches.push($rootScope.$on('notification-drawer:mark-read', function() {
          counter.showNewNotificationIndicator = false;
        }));
      };

      counter.$onDestroy = function() {
        deregisterNotificationListeners();
        deregisterRootScopeWatches();
      };
  }
})();
