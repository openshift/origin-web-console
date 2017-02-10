'use strict';

angular.module('openshiftConsole')
  .service('Scopes', function() {
    return {
      // fills out the defaults for a controller (page) scope to reduce
      // boilerplate in all of our controllers.
      getControllerDefaults: function() {
        return {
          projectName: '',
          alerts: {},
          loaded: false,
          emptyMessage: 'Loading...',
          labelSuggestions: {},
          breadcrumbs: [],
          forms: {},
          renderOptions: {
            hideFilterWidget: false
          }
        };
      }
    };
  });
