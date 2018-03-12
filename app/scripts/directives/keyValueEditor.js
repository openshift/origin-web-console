(function() {
  'use strict';

  angular
    .module('openshiftConsole')
    .directive('keyValueEditor', [
      '$routeParams',
      '$timeout',
      '$filter',
      'APIService',
      'keyValueEditorConfig',
      'keyValueEditorUtils',
      function(
        $routeParams,
        $timeout,
        $filter,
        APIService,
        config,
        utils) {

        var humanizeKind = $filter('humanizeKind');
        var canI = $filter('canI');

        var counter = 1000;

        return {
          restrict: 'AE',
          scope: {
            keyMinlength: '@',                         // min character length
            keyMaxlength: '@',                         // max character length
            valueMinlength: '@',                       // min character length
            valueMaxlength: '@',                       // max character length
            // entries: [{
            //   name: ''                              // the key... erm.
            //   value: ''                             // the value string, if no valueFrom
            //   cannotDelete: true || false           // defaults to false
            //   isReadonly: true|| false              // individual entries may be readonly
            //   isReadonlyKey: true || false          // defaults to false
            //   isReadonlyValue: true || false        // defaults to false
            //   keyValidator: ''                      // regex for validating the key (name)
            //   keyValidatorError: ''                 // text if key does not validate
            //   keyValidatorErrorTooltip: ''          // additional text if key does not validate
            //   keyValidatorErrorTooltipIcon: ''      // icon class to use for key tooltip
            //   valueValidatorError: ''               // text if value does not validate
            //   valueIcon: ''                         // icon class, such as 'fa fa-lock'
            //   valueIconTooltip: ''                  // text for tooltip
            //   valueAlt: ''                          // alternative text value if valueFrom is present or complicated
            //   valueValidator: ''                    // regex for validating the value
            //   valueValidatorErrorTooltip: ''        // additional text if value does not validate
            //   valueValidatorErrorTooltipIcon: ''    // icon class to use for value tooltip
            //   INTERNAL
            //   apiObj: { }                           // INTERNAL stub of a secret or config map for url generation
            //   refType: ''                           // INTERNAL the valueFrom refType
            //   selectedValueFrom: {}                 // INTERNAL ui-select bookkeeping
            //   selectedValueFromKey: {}              // INTERNAL custom validation error
            // }]
            entries: '=',
            keyPlaceholder: '@',
            valuePlaceholder: '@',
            keyValidator: '@',                        // general key regex validation string
            keyValidatorRegex: '=',                   // a regex object
            valueValidator: '@',                      // general value regex validation string
            valueValidatorRegex: '=',                 // a regex object
            keyValidatorError: '@',                   // general key validation error message
            keyValidatorErrorTooltip: '@',
            keyValidatorErrorTooltipIcon: '@',
            valueValidatorError: '@',                 // general value validation error message
            valueValidatorErrorTooltip: '@',
            valueValidatorErrorTooltipIcon: '@',
            valueIconTooltip: '@',                    // if the tooltip for the value icon is generic
            valueFromSelectorOptions: '=',
            cannotAdd: '=?',
            cannotSort: '=?',
            cannotDelete: '=?',
            isReadonly: '=?',
            isReadonlyValue: '=?',
            isReadonlyKeys: '=?',                     // will only apply to existing keys,
            addRowLink: '@',                          // creates a link to "add row" and sets its text label
            addRowWithSelectorsLink: '@',             // creates a link to "add row with selectors" and sets its text label
            showHeader: '=?',                         // show placeholder text as headers
            allowEmptyKeys: '=?',
            keyRequiredError: '@'
          },
          templateUrl: 'views/directives/key-value-editor.html',
          link: function($scope, $elem, $attrs) {
            var unwatchEntries;

            // validation is irritating.
            $scope.validation = {
              key: $scope.keyValidator,
              val: $scope.valueValidator
            };
            // override if we get a regex literal
            if($attrs.keyValidatorRegex) {
              $scope.validation.key = $scope.keyValidatorRegex;
            }
            if($attrs.valueValidatorRegex) {
              $scope.validation.val = $scope.valueValidatorRegex;
            }

            if('grabFocus' in $attrs) {
              $scope.grabFocus = true;
              // after render set to undefined to ensure it doesn't keep trying to grab focus
              $timeout(function() {
                  $scope.grabFocus = undefined;
              });
            }

            // if an attribute exists, set its corresponding bool to true
            if('cannotAdd' in $attrs) {
              $scope.cannotAdd = true;
            }
            if('cannotDelete' in $attrs) {
              $scope.cannotDeleteAny = true;
            }
            if('isReadonly' in $attrs) {
              $scope.isReadonlyAny = true;
            }
            // only applies to the initial set, if a user adds an entry the
            // user must be allowed to set the key!
            if('isReadonlyKeys' in $attrs) {
              // the $scope.$watch here lets us wait until we are certain we get
              // a legitimate first set, perhaps after a promise resolution, run the
              // update, then unregister.
              unwatchEntries = $scope.$watch('entries', function(newVal) {
                if(newVal) {
                  _.each($scope.entries, function(entry) {
                    entry.isReadonlyKey = true;
                  });
                  unwatchEntries();
                }
              });
            }

            if('cannotSort' in $attrs) {
              $scope.cannotSort = true;
            }

            if('showHeader' in $attrs) {
              $scope.showHeader = true;
            }

            if('allowEmptyKeys' in $attrs) {
              $scope.allowEmptyKeys = true;
            }

            $scope.groupByKind = function(object) {
              return humanizeKind(object.kind);
            };

            $scope.valueFromObjectSelected = function(entry, selected) {
              if (selected.kind === 'ConfigMap') {
                entry.valueFrom.configMapKeyRef = {
                  name: selected.metadata.name
                };
                delete entry.valueFrom.secretKeyRef;
              } else if (selected.kind === 'Secret') {
                entry.valueFrom.secretKeyRef = {
                  name: selected.metadata.name
                };
                delete entry.valueFrom.configMapKeyRef;
              }
              delete entry.selectedValueFromKey;
            };

            $scope.valueFromKeySelected = function(entry, selected) {
              if (entry.valueFrom.configMapKeyRef) {
                entry.valueFrom.configMapKeyRef.key = selected;
                return;
              } else if (entry.valueFrom.secretKeyRef) {
                entry.valueFrom.secretKeyRef.key = selected;
                return;
              }
            };

            // min/max lengths
            angular.extend($scope, {
              keyMinlength: config.keyMinlength || $attrs.keyMinlength,
              keyMaxlength: config.keyMaxlength || $attrs.keyMaxlength,
              valueMinlength: config.valueMinlength || $attrs.valueMinlength,
              valueMaxlength: config.valueMaxlength || $attrs.valueMaxlength,
              // validation regex
              keyValidator: config.keyValidator || $attrs.keyValidator,
              valueValidator: config.valueValidator || $attrs.valueValidator,
              keyValidatorError: config.keyValidatorError || $attrs.keyValidatorError,
              valueValidatorError: config.valueValidatorError || $attrs.valueValidatorError,
              keyRequiredError: config.keyRequiredError || $attrs.keyRequiredError,
              // validation error tooltip
              keyValidatorErrorTooltip: config.keyValidatorErrorTooltip || $attrs.keyValidatorErrorTooltip,
              keyValidatorErrorTooltipIcon: config.keyValidatorErrorTooltipIcon || $attrs.keyValidatorErrorTooltipIcon,
              valueValidatorErrorTooltip: config.valueValidatorErrorTooltip || $attrs.valueValidatorErrorTooltip,
              valueValidatorErrorTooltipIcon: config.valueValidatorErrorTooltipIcon || $attrs.valueValidatorErrorTooltipIcon,
              // placeholders
              keyPlaceholder: config.keyPlaceholder || $attrs.keyPlaceholder,
              valuePlaceholder: config.valuePlaceholder || $attrs.valuePlaceholder
            });
          },
          controller: [
            '$scope',
            function($scope) {
              var readOnlySome = [];
              var cannotDeleteSome = [];
              var unique = counter++;

              $scope.configMapVersion = APIService.getPreferredVersion('configmaps');
              $scope.secretsVersion = APIService.getPreferredVersion('secrets');

              var canIGetSecrets = canI($scope.secretsVersion, 'get');
              var canIGetConfigMaps = canI($scope.configMapVersion, 'get');


              angular.extend($scope, {
                namespace: $routeParams.project,
                unique: unique,
                forms: {},
                placeholder: utils.newEntry(),
                setFocusKeyClass: 'key-value-editor-set-focus-key-' + unique,
                setFocusValClass: 'key-value-editor-set-focus-value-' + unique,
                uniqueForKey: utils.uniqueForKey,
                uniqueForValue: utils.uniqueForValue,
                dragControlListeners: {
                    // only allow sorting within the parent instance
                    accept: function (sourceItemHandleScope, destSortableScope) {
                      return sourceItemHandleScope.itemScope.sortableScope.$id === destSortableScope.$id;
                    },
                    orderChanged: function() {
                      $scope.forms.keyValueEditor.$setDirty();
                    }
                },
                deleteEntry: function(start, deleteCount) {
                  $scope.entries.splice(start, deleteCount);
                  // if the link is used, add a new empty entry to ensure the inputs do not all disappear
                  if(!$scope.entries.length && $scope.addRowLink) {
                    utils.addEntry($scope.entries);
                  }
                  $scope.forms.keyValueEditor.$setDirty();
                },
                isReadonlySome: function(name) {
                  return _.includes(readOnlySome, name);
                },
                cannotDeleteSome: function(name) {
                  return _.includes(cannotDeleteSome, name);
                },
                onAddRow: function() {
                  utils.addEntry($scope.entries);
                  utils.setFocusOn('.'+ $scope.setFocusKeyClass);
                },
                onAddRowWithSelectors: function() {
                  utils.addEntryWithSelectors($scope.entries);
                  utils.setFocusOn('.'+ $scope.setFocusKeyClass);
                },
                isValueFromReadonly: function(entry) {
                  return $scope.isReadonlyAny ||
                          entry.isReadonlyValue ||
                          // set to a valueFrom && can find the object in valueFromSelectorOptions
                          (entry.refType && !entry.selectedValueFrom) ||
                          _.isEmpty($scope.valueFromSelectorOptions);
                }
              });

              // Issue #78 todo:
              // https://github.com/openshift/angular-key-value-editor/issues/78
              // cannotDelete and isReadonly are boolean or list values.
              // if boolean, they apply to all.
              // if arrays, they apply to the items passed.
              // GOTCHA:
              // we suppport:
              //   <key-value-editor is-readonly cannot-delete>
              // and:
              //   <key-value-editor is-readonly="['foo']" cannot-delete="['foo','bar']">
              // changing the is-readonly and cannot-delete to a list and then
              // setting the list to undefined/null will not:
              //   cannotDeleteAny = false;
              // why?
              //   we assume the presence of is-readonly similar to disabled and other html
              //   attributes that are 'truthy' though they have no actual value.
              // workaround?
              //   potentially using ng-attr-cannot-delete=false?
              $scope.$watch('cannotDelete', function(newVal) {
                if(angular.isArray(newVal)) {
                  $scope.cannotDeleteAny = false;
                  cannotDeleteSome = newVal;
                }
              });
              $scope.$watch('isReadonly', function(newVal) {
                if(angular.isArray(newVal)) {
                  $scope.isReadonlyAny = false;
                  readOnlySome = newVal;
                }
              });

              // watching the attribute allows both:
              // <key-value-editor add-row-link>
              // <key-value-editor add-row-link="Add a pair">
              $scope.$watch('addRowLink', function(newVal) {
                $scope.addRowLink = newVal || 'Add row';
                if($scope.entries && !$scope.entries.length) {
                  utils.addEntry($scope.entries);
                }
              });

              // ensures we always have at least one set of inputs
              $scope.$watch('entries', function(newVal) {
                // entries MUST be an array. if we get an empty array,
                // we add an empty entry to ensure the inputs show.
                // NOTE: entries must be an array, with a .push() method
                // else addEntry() will fail.
                if(newVal && !newVal.length) {
                  utils.addEntry($scope.entries);
                }
                // check valueFrom attribs and set an alt text for display if present
                _.each($scope.entries, function(entry) {
                  utils.altTextForValueFrom(entry, $scope.namespace);
                  utils.setEntryPerms(entry, canIGetSecrets, canIGetConfigMaps);
                });
                utils.findReferenceValueForEntries(newVal, $scope.valueFromSelectorOptions);
              });

              $scope.$watch('valueFromSelectorOptions', function() {
                utils.findReferenceValueForEntries($scope.entries, $scope.valueFromSelectorOptions);
              });

            }
          ]
        };
      }]);

})();
