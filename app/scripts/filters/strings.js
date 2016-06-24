'use strict';
angular.module('openshiftConsole')
  .filter('camelToLower', function() {
    return function(str) {
      if (!str) {
        return str;
      }

      // Use the special logic in _.startCase to handle camel case strings, kebab
      // case strings, snake case strings, etc.
      return _.startCase(str).toLowerCase();
    };
  })
  .filter('upperFirst', function() {
    // Uppercase the first letter of a string (without making any other changes).
    // Different than `capitalize` because it doesn't lowercase other letters.
    return function(str) {
      if (!str) {
        return str;
      }

      return str.charAt(0).toUpperCase() + str.slice(1);
    };
  })
  .filter('sentenceCase', function(camelToLowerFilter, upperFirstFilter) {
    // Converts a camel case string to sentence case
    return function(str) {
      if (!str) {
        return str;
      }

      // Unfortunately, _.lowerCase() and _.upperFirst() aren't in our lodash version.
      var lower = camelToLowerFilter(str);
      return upperFirstFilter(lower);
    };
  })
  .filter('startCase', function () {
    return function(str) {
      if (!str) {
        return str;
      }

      // https://lodash.com/docs#startCase
      return _.startCase(str);
    };
  })
  .filter('capitalize', function() {
    return function(input) {
      return _.capitalize(input);
    };
  })
  .filter('isMultiline', function() {
    return function(str) {
      if (!str) {
        return false;
      }
      return str.indexOf('\n') !== -1;
    };
  });
