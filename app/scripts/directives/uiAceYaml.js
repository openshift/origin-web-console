'use strict';

(function() {
  angular.module('openshiftConsole').component('uiAceYaml', {
    controller: [
      '$scope',
      UIAceYAML
    ],
    controllerAs: '$ctrl',
    bindings: {
      resource: '=',
      ngRequired: '<?',
      showFileInput: '<?'
    },
    templateUrl: 'views/directives/ui-ace-yaml.html'
  });

  function UIAceYAML($scope) {
    var ctrl = this;
    var aceEditor;

    var parseYAML = function(strict) {
      // https://github.com/nodeca/js-yaml#safeload-string---options-
      return jsyaml.safeLoad(ctrl.model, {
        // If `strict` is false, allow duplicate keys in the YAML for
        // compability with `oc create` using the js-yaml `json` option. This
        // also lets us parse JSON as YAML, where duplicate keys are allowed.
        json: !strict
      });
    };

    var clearAnnotations = function() {
      aceEditor.getSession().clearAnnotations();
      $scope.$evalAsync(function() {
        ctrl.annotations = {};
      });
    };

    var setAnnotation = function(e, severity) {
      var session = aceEditor.getSession();
      var length = session.getLength();
      var row = _.get(e, 'mark.line', 0);
      var col = _.get(e, 'mark.column', 0);
      var message = e.message || 'Could not parse content.';

      // If the error line is reported as being after the last line, use the
      // last line. This can happen when the error is at the very end of the
      // document and the user doesn't have a final newline.
      if (row >= length) {
        row = length - 1;
      }

      var annotation = {
        row: row,
        column: col,
        text: message,
        type: severity
      };
      session.setAnnotations([ annotation ]);

      $scope.$evalAsync(function() {
        ctrl.annotations = {};
        ctrl.annotations[severity] = [ annotation ];
      });
    };

    var setValid = function(valid) {
      $scope.$evalAsync(function() {
        ctrl.form.$setValidity('yamlValid', valid);
      });
    };

    var updated = function(current, previous) {
      var resource;
      // Check for errors, then check for warnings.
      try {
        resource = parseYAML(false);
        setValid(true);

        // Only update `ctrl.resource` if the value has changed.
        if (current !== previous) {
          ctrl.resource = resource;
        }

        // Check for warnings.
        try {
          parseYAML(true);
          clearAnnotations();
        } catch (e) {
          setAnnotation(e, 'warning');
        }
      } catch (e) {
        setAnnotation(e, 'error');
        setValid(false);
      }

    };

    // Use a file added callback instead of just watching for `fileUpload`
    // changes so that we can replace the editor contents if the user has made
    // changes when the same file is added again.
    ctrl.onFileAdded = function(content) {
      ctrl.model = content;
    };

    ctrl.$onInit = function() {
      if (ctrl.resource) {
        ctrl.model = jsyaml.safeDump(ctrl.resource, {
          sortKeys: true
        });
      }
    };

    ctrl.aceLoaded = function(editor) {
      // Keep a reference to use later in event callbacks.
      aceEditor = editor;

      var session = editor.getSession();
      session.setOption('tabSize', 2);
      session.setOption('useSoftTabs', true);
      editor.setDragDelay = 0;
    };

    $scope.$watch(function() {
      return ctrl.model;
    }, updated);

    ctrl.gotoLine = function(line) {
      aceEditor.gotoLine(line);
    };
  }
})();
