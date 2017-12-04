'use strict';

angular.module('openshiftConsole')
  .factory('ListRowUtils', function() {

    var expandedKey = function(apiObject) {
      var uid = _.get(apiObject, 'metadata.uid');
      if (!uid) {
        return null;
      }

      return 'overview/expand/' + uid;
    };

    var setInitialExpandedState = function(row) {
      var key = expandedKey(row.apiObject);
      if (!key) {
        row.expanded = false;
        return;
      }

      var item = sessionStorage.getItem(key);
      if (!item && row.state.expandAll) {
        row.expanded = true;
        return;
      }

      row.expanded = item === 'true';
    };

    return {
      getNotifications: function(object, state) {
        var uid = _.get(object, 'metadata.uid');
        if (!uid) {
          return null;
        }
        return _.get(state, ['notificationsByObjectUID', uid]);
      },
      // ui is a subset of methods intended to be passed to the view.
      // above methods are shared functionality, not necessarily view specific.
      ui: {
        toggleExpand: function(e, always) {
          // Don't toggle if clicking on a link inside the row unless `always` is set.
          if (!always && ($(e.target).closest("a").length > 0 || $(e.target).closest("button").length > 0)) {
            return;
          }

          var key = expandedKey(this.apiObject);
          if (!key) {
            return;
          }
          this.expanded = !this.expanded;
          sessionStorage.setItem(key, this.expanded ? 'true' : 'false');
        },
        $onInit: function() {
          _.set(this, 'selectedTab.networking', true);
          setInitialExpandedState(this);
        }
      }
    };
  });
