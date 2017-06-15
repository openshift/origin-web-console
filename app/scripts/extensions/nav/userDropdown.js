'use strict';

angular.module('openshiftConsole')
  .run(function(extensionRegistry, $rootScope) {
    extensionRegistry
      .add('nav-user-dropdown', function() {
        var msg = 'Log out';
        if ($rootScope.user.fullName && $rootScope.user.fullName !== $rootScope.user.metadata.name) {
          msg += ' (' + $rootScope.user.metadata.name + ')';
        }
        return [{
          type: 'dom',
          node: '<li><a href="logout">' + _.escape(msg) + '</a></li>'
        }];
      });
  });
