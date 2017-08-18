(function() {
  'use strict';

  // simple set of utils to share
  angular
    .module('openshiftConsole')
    .factory('keyValueEditorUtils', [
      '$timeout',
      '$window',
      function($timeout, $window) {

        var newEntry = function() {
          return {name: '', value: ''};
        };

        var addEntry = function(entries, entry) {
          entries && entries.push(entry || newEntry());
        };

        var addEntryWithSelectors = function(entries) {
          entries && entries.push({
            name: '',
            selectedValueFrom: null,
            selectedValueFromKey: null,
            valueFrom: {}
          });
        };

        var altTextForValueFrom = function(entry, namespace) {
          if(entry.value) {
            return;
          }
          if(!entry.valueFrom) {
            return;
          }
          entry.valueIcon = 'pficon pficon-help';
          entry.valueIconTooltip = 'This is a referenced value that will be generated when a container is created.  On running pods you can check the resolved values by going to the Terminal tab and echoing the environment variable.';
          var opts = {
            config: 'configMapKeyRef',
            secret: 'secretKeyRef',
            field: 'fieldRef'
          };
          if(entry.valueFrom[opts.config]) {
            // so we can use navigateResourceURL in the template
            entry.apiObj = {
              kind: "ConfigMap",
              metadata: {
                name: entry.valueFrom[opts.config].name,
                namespace: namespace
              }
            };
            // copy refType to the object so it's easier to get at in the template
            entry.refType = opts.config;
          } else if(entry.valueFrom[opts.secret]) {
            // so we can use navigateResourceURL in the template
            entry.apiObj = {
              kind: "Secret",
              metadata: {
                name: entry.valueFrom[opts.secret].name,
                namespace: namespace
              }
            };
            // copy refType to the object so it's easier to get at in the template
            entry.refType = opts.secret;
            entry.valueIcon = 'fa fa-user-secret';
          } else if(entry.valueFrom[opts.field]) {
            entry.isReadonlyValue = true;
            // copy refType to the object so it's easier to get at in the template
            entry.refType = opts.field;
            entry.valueAlt = 'Set to the field ' + entry.valueFrom.fieldRef.fieldPath + ' in current object';
          } else {
            entry.isReadonlyValue = true;
            entry.valueAlt = 'Set to a reference on a ' + _.head(_.keys(entry.valueFrom));
          }
        };

        // if the current user does not have the permissions to see these resources, we will need a
        // readonly state of that entry row (at least for the value)
        var setEntryPerms = function(entry, canIGetSecrets, canIGetConfigMaps) {
          if(!entry.valueFrom) {
            return;
          }
          if(entry.valueFrom.configMapKeyRef) {
            if(!canIGetConfigMaps) {
              entry.isReadonlyValue = true;
            }
          }
          if(entry.valueFrom.secretKeyRef) {
            if(!canIGetSecrets) {
              entry.isReadonlyValue = true;
            }
          }
        };

        // these keys are for kve and, if this function is used, will be removed.
        var toClean = [
          // TODO: probably should have added a prefix, such as
          // `kve_*` to all of these to make it easier to clean up with certainty!
          'apiObj',
          'cannotDelete',
          'isReadonly',
          'isReadonlyKey',
          'isReadonlyValue',
          'keyValidator',
          'keyValidatorError',
          'keyValidatorErrorTooltip',
          'keyValidatorErrorTooltipIcon',
          'refType',
          'selected',
          'selectedValueFrom',
          'selectedValueFromKey',
          'valueValidatorError',
          'valueIcon',
          'valueIconTooltip',
          'valueAlt',
          'valueValidator',
          'valueValidatorErrorTooltip',
          'valueValidatorErrorTooltipIcon'
        ];

        var cleanEntry = function(entry) {
          _.each(toClean, function(key) {
            entry[key] = undefined;   // ensure removal if set to an object
            delete entry[key];        // then eliminate key
          });
          return entry;
        };

        var cleanEntries = function(entries) {
          return _.map(entries, cleanEntry);
        };

        // cleans each entry of kve known keys and
        // drops any entry that has neither a key nor a value or valueFrom
        // NOTE: if the input validator fails to pass, then an
        // entry will not have a value and will be excluded. This
        // is not the fault of this function.
        var compactEntries = function(entries) {
          return _.compact(
                  _.map(
                    entries,
                    function(entry) {
                      entry = cleanEntry(entry);
                      return (entry.name || entry.value || entry.valueFrom) ? entry : undefined;
                    }));
        };

        // returns an object of key:value pairs, last one in will win:
        // {
        //  foo: 'bar',
        //  baz: 'bam'
        // }
        var mapEntries = function(entries) {
          Logger.log('DEPRECATED: mapEntries() drops valueFrom from the entry.');
          return _.reduce(
                  compactEntries(entries),
                  function(result, next) {
                    // valueFrom cannot be handled properly here.
                    result[next.name] = next.value;
                    return result;
                  }, {});
        };

        var setFocusOn = function(selector, value) {
          // $timeout just delays enough to ensure event/$digest resolution
          $timeout(function() {
            var element = _.head($window.document.querySelectorAll(selector));
            if(element) {
              element.focus();
              // if setting value, this will set the cursor at the end of the text in the value
              if(value) {
                element.value = '';
                element.value = value;
              }
            }
          }, 25);
        };

        var uniqueForKey = function(unique, $index) {
          return 'key-value-editor-key-' + unique + '-' + $index;
        };

        var uniqueForValue = function(unique, $index) {
          return 'key-value-editor-value-' + unique + '-' + $index;
        };

        var findConfigMap = function(entry, valueFromSelectorOptions) {
          return {
            object: _.find(valueFromSelectorOptions, function(option) {
              return option.kind === 'ConfigMap' &&
                     option.metadata.name === entry.valueFrom.configMapKeyRef.name;
            }),
            key: entry.valueFrom.configMapKeyRef.key
          };
        };

        var findSecret = function(entry, valueFromSelectorOptions) {
          return  {
            object: _.find(valueFromSelectorOptions, function(option) {
              return option.kind === 'Secret' &&
                     option.metadata.name === entry.valueFrom.secretKeyRef.name;
            }),
            key: entry.valueFrom.secretKeyRef.key
          };
        };

        var findReferenceValue = function(entry, valueFromSelectorOptions) {
          var ref = null;
          if(entry.valueFrom.configMapKeyRef) {
            ref = findConfigMap(entry, valueFromSelectorOptions);
          } else if(entry.valueFrom.secretKeyRef) {
            ref = findSecret(entry, valueFromSelectorOptions);
          }
          return ref;
        };

        var findReferenceValueForEntries = function(entries, valueFromSelectorOptions) {
          _.each(entries, function(entry) {
            var referenceValue;
            if(entry.valueFrom) {
              referenceValue = findReferenceValue(entry, valueFromSelectorOptions);
              if (referenceValue) {
                _.set(entry, 'selectedValueFrom', referenceValue.object);
                _.set(entry, 'selectedValueFromKey', referenceValue.key);
              }
            }
          });
        };

        return {
          newEntry: newEntry,
          addEntry: addEntry,
          addEntryWithSelectors: addEntryWithSelectors,
          altTextForValueFrom: altTextForValueFrom,
          setEntryPerms: setEntryPerms,
          cleanEntry: cleanEntry,
          cleanEntries: cleanEntries,
          compactEntries: compactEntries,
          mapEntries: mapEntries,
          setFocusOn: setFocusOn,
          uniqueForKey: uniqueForKey,
          uniqueForValue: uniqueForValue,
          findReferenceValue: findReferenceValue,
          findReferenceValueForEntries: findReferenceValueForEntries
        };
      }
    ]);
})();
