'use strict';

angular.module('openshiftConsole')
  .run(function(extensionRegistry) {
    extensionRegistry
      .add('nav-dropdown-mobile', _.spread(function(user) {
        return [{
          type: 'dom',
          node: [
            '<li>',
              '<a href="{{\'default\' | helpLink}}">',
                '<span class="fa fa-book fa-fw" aria-hidden="true"></span> <translate>Documentation</translate>',
              '</a>',
            '</li>'
          ].join('')
        }, {
          type: 'dom',
          node: [
            '<li>',
              '<a href="about">',
                '<span class="pficon pficon-info fa-fw" aria-hidden="true"></span> <translate>About</translate>',
              '</a>',
            '</li>'
          ].join('')
        }, {
          type: 'dom',
          node: [
            '<li>',
              '<a href="command-line">',
                '<span class="fa fa-terminal" aria-hidden="true"></span> <translate>Command Line Tools</translate>',
              '</a>',
            '</li>'
          ].join('')
        }, {
          type: 'dom',
          node: _.template([
            '<li>',
              '<a href="logout">',
                '<span class="pficon pficon-user fa-fw" aria-hidden="true"></span>',
                '<translate>Log out</translate> <span class="username"><%= userName %></span>',
              '</a>',
            '</li>'
          ].join(''))({userName: (user ? (user.fullName || user.metadata.name) : "") })
        }];
      }));
  });
