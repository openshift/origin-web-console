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

      return value / 1024;
    };

    var millicoresToCores = function(value) {
      if (!value) {
        return value;
      }

      return value / 1000;
    };

    return {
      bytesToMiB: bytesToMiB,
      bytesToKiB: bytesToKiB,
      millicoresToCores: millicoresToCores
    };
  });
