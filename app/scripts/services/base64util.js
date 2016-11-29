'use strict';

angular.module('openshiftConsole')
  .factory('base64util', function() {
    return {
      pad: function(data){
        if (!data) { return ""; }
        switch (data.length % 4) {
          case 1:  return data + "===";
          case 2:  return data + "==";
          case 3:  return data + "=";
          default: return data;
        }
      }
    };
  });
