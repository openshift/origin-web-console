'use strict';

angular.module('openshiftConsole')
  .run(function(extensionRegistry, Constants) {
    extensionRegistry
      .add('nav-dropdown-mobile', _.spread(function(user) {
        var dropdownItems = [];

        var launcherApps = Constants.APP_LAUNCHER_NAVIGATION;
        _.each(launcherApps, function(app) {
          var liObj = {
            type: 'dom',
            node: [
              '<li class="list-group-item">',
              '<a href="' + _.escape(app.href) + '">',
              '<span class="' + _.escape(app.iconClass) + ' fa-fw" aria-hidden="true"></span> ',
              '<span class="list-group-item-value">' + _.escape(app.title) + '</span>',
              '</a>',
              '</li>'
            ].join('')
          };
          dropdownItems.push(liObj);
        });

        dropdownItems = dropdownItems.concat([{
          type: 'dom',
          node: [
            '<li class="list-group-item">',
              '<a href="{{\'default\' | helpLink}}">',
                '<span class="fa fa-book fa-fw" aria-hidden="true"></span> <span class="list-group-item-value">Documentation</span>',
              '</a>',
            '</li>'
          ].join('')
        }, {
          type: 'dom',
          node: [
            '<li class="list-group-item">',
              '<a href="command-line">',
                '<span class="fa fa-terminal" aria-hidden="true"></span> <span class="list-group-item-value">Command Line Tools</span>',
              '</a>',
            '</li>'
          ].join('')
        }, {
          type: 'dom',
          node: [
            '<li class="list-group-item">',
              '<a href="about">',
                '<span class="pficon pficon-info fa-fw" aria-hidden="true"></span> <span class="list-group-item-value">About</span>',
              '</a>',
            '</li>'
          ].join('')
        },
          {
            type: 'dom',
            node: _.template([
              '<li class="list-group-item">',
              '<a href="logout">',
              '<span class="pficon pficon-user fa-fw" aria-hidden="true"></span>',
              '<span class="list-group-item-value">Log out <span class="username"><%= userName %></span></span>',
              '</a>',
              '</li>'
            ].join(''))({userName: (user ? (user.fullName || user.metadata.name) : "") })
          }
        ]);

        return dropdownItems;

      }));
  });
