'use strict';

angular.module('openshiftConsole')
  /**
   * Replace special chars with underscore (e.g. '.')
   * @returns {Function}
   */
  .filter("underscore", function(){
    return function(value){
      return value.replace(/\./g, '_');
    };
  });
