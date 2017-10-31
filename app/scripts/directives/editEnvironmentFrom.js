"use strict";
(function() {
  angular.module("openshiftConsole").component('editEnvironmentFrom', {
    controller: [
      '$attrs',
      '$filter',
      'keyValueEditorUtils',
      'SecretsService',
      EditEnvironmentFrom
    ],
    bindings: {
      entries: '=',                         // an array of objects containing configmaps and secrets
      envFromSelectorOptions: '<',          // dropdown selector options, an array of objects
      isReadonly: '<?'                      // display as read only values
    },
    templateUrl: 'views/directives/edit-environment-from.html'
  });

  function EditEnvironmentFrom($attrs,
                               $filter,
                               utils,
                               SecretsService) {
    var ctrl = this;
    var canI = $filter('canI');
    var humanizeKind = $filter('humanizeKind');
    var uniqueId = _.uniqueId();

    ctrl.setFocusClass = 'edit-environment-from-set-focus-' + uniqueId;

    ctrl.viewOverlayPanel = function(entry) {
      ctrl.decodedData = entry.data;
      ctrl.overlayPaneEntryDetails = entry;

      if (entry.kind === 'Secret') {
        ctrl.decodedData = SecretsService.decodeSecretData(entry.data);
      }

      ctrl.overlayPanelVisible = true;
    };

    ctrl.closeOverlayPanel = function() {
      ctrl.showSecret = false;
      ctrl.overlayPanelVisible = false;
    };

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

      if(!ctrl.envFromEntries.length) {
        addEntry(ctrl.envFromEntries);
      }

      ctrl.updateEntries(ctrl.envFromEntries);
      ctrl.editEnvironmentFromForm.$setDirty();
    };

    ctrl.hasOptions = function() {
      return !_.isEmpty(ctrl.envFromSelectorOptions);
    };

    ctrl.hasEntries = function() {
      return _.some(ctrl.entries, function(entry) {
        return _.get(entry, 'configMapRef.name') || _.get(entry, 'secretRef.name');
      });
    };

    ctrl.isEnvFromReadonly = function(entry) {
      return ctrl.isReadonly === true || entry && entry.isReadonly === true;
    };

    ctrl.groupByKind = function(object) {
      return humanizeKind(object.kind);
    };

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

      if (entry.prefix) {
        newEnvFrom.prefix = entry.prefix;
      }

      _.assign(ctrl.envFromEntries[index], newEnvFrom);
      ctrl.updateEntries(ctrl.envFromEntries);
    };

    ctrl.updateEntries = function(entries) {
      ctrl.entries = _.filter(entries, function (val) {
        return val.secretRef || val.configMapRef;
      });
    };

    var updateEnvFromEntries = function() {
      var configMapsByName = {};
      var secretsByName = {};

      ctrl.envFromEntries = ctrl.entries || [];

      if (!ctrl.envFromEntries.length) {
        addEntry(ctrl.envFromEntries);
      }

      _.each(ctrl.envFromSelectorOptions, function(option) {
        switch(option.kind) {
          case 'ConfigMap':
            configMapsByName[option.metadata.name] = option;
            break;
          case 'Secret':
            secretsByName[option.metadata.name] = option;
            break;
        }
      });

      _.each(ctrl.envFromEntries, function(entry) {
        var refType;
        var entryType;

        if (entry.configMapRef) {
          refType = 'configMapRef';
          entryType = 'configmaps';
        }

        if(entry.secretRef) {
          refType = 'secretRef';
          entryType = 'secrets';
        }

        if (refType && entryType) {
          var refTypeName = entry[refType].name;

          if (entry.configMapRef && (refTypeName in configMapsByName)) {
            entry.selectedEnvFrom = configMapsByName[refTypeName];
          }

          if (entry.secretRef && (refTypeName in secretsByName)) {
            entry.selectedEnvFrom = secretsByName[refTypeName];
          }

          if(!canI(entryType, 'get')) {
            entry.isReadonly = true;
          }
        }
      });
    };

    ctrl.$onInit = function() {
      updateEnvFromEntries();

      if('cannotDelete' in $attrs) {
        ctrl.cannotDeleteAny = true;
      }

      if('cannotSort' in $attrs) {
        ctrl.cannotSort = true;
      }

      if('showHeader' in $attrs) {
        ctrl.showHeader = true;
      }

      if(ctrl.envFromEntries && !ctrl.envFromEntries.length) {
        addEntry(ctrl.envFromEntries);
      }
    };

    ctrl.$onChanges = function(changes) {
      if(changes.entries || changes.envFromSelectorOptions) {
        updateEnvFromEntries();
      }
    };
  }
})();

