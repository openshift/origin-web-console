'use strict';

angular.module("openshiftConsole")
  .factory("ConversionService", function() {
    var bytesToMiB = function(value) {
      if (!value) {
        return value;
      }

      return value / (1024 * 1024);
    };

    var bytesToKiB = function(value) {
      if (!value) {
        return value;
      }

      // Round to one decimal place
      return value / 1024;
    };

    return {
      bytesToMiB: bytesToMiB,
      bytesToKiB: bytesToKiB
    };
  });
