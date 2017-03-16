'use strict';

angular.module("openshiftConsole")
  .factory("HTMLService",
           function(BREAKPOINTS) {
    return {
      // Ge the breakpoint for the current screen width.
      getBreakpoint: function() {
        if (window.innerWidth < BREAKPOINTS.screenSmMin) {
          return 'xs';
        }

        if (window.innerWidth < BREAKPOINTS.screenMdMin) {
          return 'sm';
        }

        if (window.innerWidth < BREAKPOINTS.screenLgMin) {
          return 'md';
        }

        return 'lg';
      },

      // Based on https://github.com/drudru/ansi_up/blob/v1.3.0/ansi_up.js#L93-L97
      // and https://github.com/angular/angular.js/blob/v1.5.8/src/ngSanitize/filter/linky.js#L131-L132
      // The AngularJS `linky` regex will avoid matching special characters like `"` at
      // the end of the URL.
      //
      // text:            The text to linkify. Assumes `text` is NOT HTML-escaped unless
      //                  `alreadyEscaped` is true.
      // target:          The optional link target (for instance, '_blank')
      // alreadyEscaped:  `true` if the text has already been HTML escaped
      //                  (like log content that has been run through ansi_up.ansi_to_html)
      //
      // Returns an HTML escaped string with http:// and https:// URLs changed to clickable links.
      linkify: function(text, target, alreadyEscaped) {
        if (!text) {
          return text;
        }

        // First HTML escape the content.
        if (!alreadyEscaped) {
          text = _.escape(text);
        }

        // Replace any URLs with links.
        return text.replace(/https?:\/\/[A-Za-z0-9._%+-]+\S*[^\s.;,(){}<>"\u201d\u2019]/gm, function(str) {
          if (target) {
            return "<a href=\"" + str + "\" target=\"" + target + "\">" + str + "</a>";
          }

          return "<a href=\"" + str + "\">" + str + "</a>";
        });
      }
    };
  });
