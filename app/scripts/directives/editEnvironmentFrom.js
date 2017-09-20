"use strict";
(function() {
  angular.module("openshiftConsole").component('editEnvironmentFrom', {
    controller: [
      '$attrs',
      '$filter',
      'keyValueEditorUtils',
      EditEnvironmentFrom
    ],
    bindings: {
      addRowLink: '@',              // creates a link to "add row" and sets its text label
      entries: '=',                 // an array of objects containing configmaps and secrets
      envFromSelectorOptions: '<',  // dropdown selector options, an array of objects
      selectorPlaceholder: '@'      // placeholder copy for dropdown selector
    },
    templateUrl: 'views/directives/edit-environment-from.html'
  });

  function EditEnvironmentFrom($attrs,
                               $filter,
                               utils) {
    var ctrl = this;

    var canI = $filter('canI');
    var humanizeKind = $filter('humanizeKind');
    var uniqueId = _.uniqueId();

    ctrl.setFocusClass = 'edit-environment-from-set-focus-' + uniqueId;

    var addEntry = function(entries, entry) {
      entries && entries.push(entry || {});
    };

    ctrl.onAddRow = function() {
      addEntry(ctrl.envFromEntries);
      utils.setFocusOn('.'+ ctrl.setFocusClass);
    };

    ctrl.deleteEntry = function(start, deleteCount) {
      if(ctrl.envFromEntries && !ctrl.envFromEntries.length) {
        return;
      }

      ctrl.envFromEntries.splice(start, deleteCount);
      if(!ctrl.envFromEntries.length && ctrl.addRowLink) {
        addEntry(ctrl.envFromEntries);
      }

      ctrl.updateEntries(ctrl.envFromEntries);
      ctrl.editEnvironmentFromForm.$setDirty();
    };

    ctrl.isEnvFromReadonly = function(entry) {
      return ctrl.isReadonlyAny ||
        entry.isReadonlyValue === true ||
        ((entry.secretRef || entry.configMapRef) && !entry.selectedEnvFrom) ||
        _.isEmpty(ctrl.envFromSelectorOptions);
    };

    ctrl.groupByKind = function(object) {
      return humanizeKind(object.kind);
    };

    //ctrl.uniqueForValue = utils.uniqueForValue;
    ctrl.dragControlListeners = {
      accept: function (sourceItemHandleScope, destSortableScope) {
        return sourceItemHandleScope.itemScope.sortableScope.$id === destSortableScope.$id;
      },
      orderChanged: function() {
        ctrl.editEnvironmentFromForm.$setDirty();
      }
    };

    ctrl.envFromObjectSelected = function(index, entry, selected) {
      var newEnvFrom = {};

      switch (selected.kind) {
        case 'Secret':
          newEnvFrom.secretRef = {
            name: selected.metadata.name
          };
          delete ctrl.envFromEntries[index].configMapRef;
          break;
        case 'ConfigMap':
          newEnvFrom.configMapRef = {
            name: selected.metadata.name
          };
          delete ctrl.envFromEntries[index].secretRef;
          break;
      }

      _.assign(ctrl.envFromEntries[index], newEnvFrom);
      ctrl.updateEntries(ctrl.envFromEntries);
    };

    ctrl.updateEntries = function(entries) {
      ctrl.entries = _.filter(entries, function (val) {
        return val.secretRef || val.configMapRef;
      });
    };

    var updateEnvFromEntries = function(entries) {
      ctrl.envFromEntries = entries || [];

      if(!ctrl.envFromEntries.length) {
        addEntry(ctrl.envFromEntries);
      }

      _.each(ctrl.envFromEntries, function(entry) {
        if(entry) {
          if(entry.configMapRef && !canI('configmaps', 'get')) {
            entry.isReadonlyValue = true;
          }

          if(entry.secretRef && !canI('secrets', 'get')) {
            entry.isReadonlyValue = true;
          }
        }
      });
    };

    var getReferenceValue = function(option) {
      var referenceValue;

      switch(option.kind) {
        case 'ConfigMap':
          referenceValue = _.find(ctrl.envFromEntries, {configMapRef: {name: option.metadata.name}});
          break;
        case 'Secret':
          referenceValue = _.find(ctrl.envFromEntries, {secretRef: {name: option.metadata.name}});
          break;
      }

      return referenceValue;
    };

    ctrl.checkEntries = function(option) {
      return !!(getReferenceValue(option));
    };

    var findReferenceValueForEntries = function(entries, envFromSelectorOptions) {
      ctrl.cannotAdd = (ctrl.isReadonlyAny || _.isEmpty(envFromSelectorOptions));

      if(envFromSelectorOptions) {
        _.each(envFromSelectorOptions, function(option) {
          var referenceValue = getReferenceValue(option);

          if (referenceValue) {
            _.set(referenceValue, 'selectedEnvFrom', option);
          }
        });
      }
    };

    ctrl.$onInit = function() {
      updateEnvFromEntries(ctrl.entries);
      findReferenceValueForEntries(ctrl.entries, ctrl.envFromSelectorOptions);

      if('cannotDelete' in $attrs) {
        ctrl.cannotDeleteAny = true;
      }

      if('cannotSort' in $attrs) {
        ctrl.cannotSort = true;
      }

      if('isReadonly' in $attrs) {
        ctrl.isReadonlyAny = true;
      }

      if('showHeader' in $attrs) {
        ctrl.showHeader = true;
      }

      if(ctrl.envFromEntries && !ctrl.envFromEntries.length) {
        addEntry(ctrl.envFromEntries);
      }
    };

    ctrl.$onChanges = function(changes) {
      if(changes.entries) {
        updateEnvFromEntries(changes.entries.currentValue);
      }

      if(changes.envFromSelectorOptions) {
        findReferenceValueForEntries(ctrl.envFromEntries, changes.envFromSelectorOptions.currentValue);
      }
    };
  }
})();

