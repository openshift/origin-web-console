'use strict';

angular.module("openshiftConsole")
  .factory("FullscreenService", function(IS_SAFARI) {
    var requestFullscreen =
      document.documentElement.requestFullScreen ||
      document.documentElement.webkitRequestFullScreen ||
      document.documentElement.mozRequestFullScreen ||
      document.documentElement.msRequestFullscreen;

    var findElement = function(element) {
      if (!element || !_.isString(element)) {
        return element;
      }

      var matches = $(element);
      if (!matches.length) {
        return null;
      }

      return matches[0];
    };

    return {
      hasFullscreen: function(needsKeyboard) {
        // Safari blocks keyboard input in fullscreen mode. Unfortunately
        // there's no feature detection for this, so fall back to user agent
        // sniffing.
        if (needsKeyboard && IS_SAFARI) {
          return false;
        }
        return !!requestFullscreen;
      },

      // `element` is a DOM element or selector
      requestFullscreen: function(element) {
        if (!requestFullscreen) {
          return;
        }

        element = findElement(element);
        if (!element) {
          return;
        }

        requestFullscreen.call(element);
      },

      exitFullscreen: function() {
        if(document.exitFullscreen) {
          document.exitFullscreen();
        } else if(document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if(document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      }
    };
  });
