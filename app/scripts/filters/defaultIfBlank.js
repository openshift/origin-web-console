'use strict';

angular.module('openshiftConsole')
  .filter("defaultIfBlank", function(){
    return function(input, defaultValue){
      if(input === null) {
        return defaultValue;
      }
      if(typeof input !== "string"){
        input = String(input);
      }
      if(input.trim().length === 0){
        return defaultValue;
      }
      return input;
    };
  });
