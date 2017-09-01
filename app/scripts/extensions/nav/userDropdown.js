'use strict';

angular.module('openshiftConsole')
  .run(function(extensionRegistry, $rootScope, gettext, gettextCatalog) {
    extensionRegistry
      .add('nav-user-dropdown', function() {
        var msg = gettext('Log out');
        msg = gettextCatalog.getString(msg)
        if ($rootScope.user.fullName && $rootScope.user.fullName !== $rootScope.user.metadata.name) {
          msg += ' (' + $rootScope.user.metadata.name + ')';
        }
        return [{
          type: 'dom',
          node: '<li><a href="logout">' + _.escape(msg) + '</a></li>'
        }];
      });
  });
