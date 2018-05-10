'use strict';

angular.module('openshiftConsole').component('inlineEdit', {
  controller: [
    InlineEdit
  ],
  controllerAs: '$ctrl',
  bindings: {
    label: '<',
    pattern: '<',
    patternErrmsg: '<',
    value: '<',
    onEdited: '<'
  },
  templateUrl: 'views/directives/inline-edit.html'
});

function InlineEdit() {
  var ctrl = this;
  ctrl.onEdited = ctrl.onEdited || function(){};

  ctrl.editEnabled = false;
  
  ctrl.enableEdit = function() {
    ctrl.editEnabled = true;
    ctrl.inputVal= ctrl.value;
  };

  ctrl.clearInput = function() {
    ctrl.inputVal = "";
  };

  ctrl.cancelEdit = function() {
    ctrl.editEnabled = false;
  };

  ctrl.save = function(val) {
    if ((ctrl.value && ctrl.value !== ctrl.inputVal) || (!ctrl.value && ctrl.inputVal)) {
      ctrl.onEdited(val);
    }
    ctrl.editEnabled = false;
  };
}
