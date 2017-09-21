'use strict';

angular.module('openshiftConsole')
  .run(function(extensionRegistry, $rootScope, DataService, AuthService) {
    extensionRegistry
      .add('nav-user-dropdown', function() {
        var items = [];
        if (!_.get(window, 'OPENSHIFT_CONSTANTS.DISABLE_COPY_LOGIN_COMMAND')) {
          items.push({
            type: 'dom',
            node: '<li><copy-login-to-clipboard clipboard-text="oc login ' +
                  _.escape(DataService.openshiftAPIBaseUrl()) +
                  ' --token=' +
                  _.escape(AuthService.UserStore().getToken()) + '"></copy-login-to-clipboard></li>'
          });
        }

        var msg = 'Log Out';
        if ($rootScope.user.fullName && $rootScope.user.fullName !== $rootScope.user.metadata.name) {
          msg += ' (' + $rootScope.user.metadata.name + ')';
        }
        items.push({
          type: 'dom',
          node: '<li><a href="logout">' + _.escape(msg) + '</a></li>'
        });

        return items;
      });
  });
