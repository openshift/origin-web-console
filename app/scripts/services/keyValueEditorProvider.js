(function() {
  'use strict';
  angular
    .module('openshiftConsole')
    .provider('keyValueEditorConfig', [
      function() {
        var defaults = {
          keyMinlength: '',                                        // min character length, falsy by default
          keyMaxlength: '',                                        // max character length, falsy by default
          valueMinlength: '',                                      // min character length, falsy by default
          valueMaxlength: '',                                      // max character length, falsy by default
          keyValidator: '[a-zA-Z0-9-_]+',                          // alphanumeric, with dash & underscores
          valueValidator: '',                                      // values have no default validation
          keyValidatorError: 'Validation error',                   // default error message string
          keyValidatorErrorTooltip: undefined,                     // default error message tooltip string
          keyValidatorErrorTooltipIcon: 'pficon pficon-help',      // default error message tooltip icon
          valueValidatorError: 'Validation error',                 // default error message string
          valueValidatorErrorTooltip: undefined,                   // default error message tooltip string
          valueValidatorErrorTooltipIcon: 'pficon pficon-help',    // default error message tooltip icon
          keyPlaceholder: '',
          valuePlaceholder: '',
          keyRequiredError: 'Key is required'
        };

        // set a new default key value pair, or pass an object to replace
        // multiple keys.
        // example 1:
        //  keyValueEditorConfigProvider.set('keyValidator', '\S*') // no white space
        // example 2:
        //  keyValueEditorConfigProvider.set({
        //      keyValidator: '[a-zA-Z0-9]+',  // alphanumberic,
        //      keyValidatorError: 'key must be alphanumeric only'
        //  });
        this.set = function(key, value) {
          if(angular.isObject(key)) {
            angular.extend(defaults, key);
          } else {
            defaults[key] = value;
          }
        };

        this.$get = [
          function() {
            return defaults;
          }
        ];
      }
    ]);
})();
