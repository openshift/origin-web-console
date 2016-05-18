'use strict';

angular.module('openshiftConsole')
  // prepopulating extension points with some of our own data
  // (ensures a single interface for extending the UI)
  .run(function(extensionRegistry) {
    extensionRegistry
      .add('nav-help-dropdown', function() {
        return [
          {
            type: 'dom',
            node: '<li><a href="{{\'default\' | helpLink}}">Documentation</a></li>'
          },
          {
            type: 'dom',
            node: '<li><a href="about">About</a></li>'
          },
          {
            type: 'dom',
            node: '<li><a href="command-line">Command Line Tools</a></li>'
          }
        ];
      });
  });
