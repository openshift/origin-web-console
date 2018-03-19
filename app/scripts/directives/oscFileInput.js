'use strict';

angular.module('openshiftConsole')
  .directive('oscFileInput', function($filter, Logger) {
    return {
      restrict: 'E',
      scope: {
        model: "=",
        required: "<",
        disabled: "<ngDisabled",
        readonly: "<ngReadonly",
        showTextArea: '<',
        // Hide the clear value link.
        hideClear: '<?',
        helpText: "@?",
        dropZoneId: "@?",
        onFileAdded: "<?",
        // Don't perform any encoding determination on the file. Use this if the file might be binary.
        // https://www.w3.org/TR/file-upload/#encoding-determination
        readAsBinaryString: "<?",
        // This lets the parent know if binary content was added. For the config map / secret form, we
        // can then hide the Ace editor for this field since it will have unprintable characters.
        // Note: This should only be set to `true` if uploading a file, not if typing / pasting control
        // characters directly into the editor. Otherwise the Ace editor could disappear when pasting
        // content.
        // TODO: If we add Ace editor directly to osc-file-input, rather than having it in the secret form, we
        // can remove this flag.
        isBinaryFile: "=?"
      },
      templateUrl: 'views/directives/osc-file-input.html',
      link: function(scope, element){
        var isNonPrintable = $filter('isNonPrintable');

        var id = _.uniqueId('osc-file-input-');
        scope.dropMessageID = id + '-drop-message';
        scope.helpID = id + '-help';
        scope.supportsFileUpload = (window.File && window.FileReader && window.FileList && window.Blob);
        scope.uploadError = false;

        var dropMessageSelector = "#" + scope.dropMessageID,
            highlightDropZone = false,
            showDropZone = false,
            inputFileField = element.find('input[type=file]');

        setTimeout(addDropZoneListeners);

        $(document).on('drop.' + id, function() {
          removeDropZoneClasses();
          element.find('.drag-and-drop-zone').trigger('putDropZoneFront', false);
          return false;
        });

        $(document).on('dragenter.' + id, function() {
          if (scope.disabled) {
            return;
          }

          showDropZone = true;
          element.find('.drag-and-drop-zone').addClass('show-drag-and-drop-zone');
          element.find('.drag-and-drop-zone').trigger('putDropZoneFront', true);
          return false;
        });

        $(document).on('dragover.' + id, function() {
          if (scope.disabled) {
            return;
          }

          showDropZone = true;
          element.find('.drag-and-drop-zone').addClass('show-drag-and-drop-zone');
          return false;
        });

        $(document).on('dragleave.' + id, function() {
          showDropZone = false;
          _.delay(function(){
            if( !showDropZone ){
              element.find('.drag-and-drop-zone').removeClass('show-drag-and-drop-zone');
            }
          }, 200);
          return false;
        });

        scope.cleanInputValues = function() {
          scope.model = '';
          scope.fileName = '';
          scope.isBinaryFile = false;
          inputFileField[0].value = "";
        };

        inputFileField.change(function() {
          addFile(inputFileField[0].files[0]);
          // In some cases, the user might want to load the same file twice.
          // For instance, the user might want to replace their edits in the
          // import YAML dialog by loading the same file again. Clear the value
          // so that the change event is triggered again, even if the same file
          // is added.
          inputFileField[0].value = "";
        });

        // Add listeners for the dropZone element
        function addDropZoneListeners(){
          var dropMessageElement = element.find('.drag-and-drop-zone');

          dropMessageElement.on('dragover', function() {
            if (scope.disabled) {
              return;
            }

            dropMessageElement.addClass('highlight-drag-and-drop-zone');
            highlightDropZone = true;
          });

          element.find('.drag-and-drop-zone p').on('dragover', function() {
            if (scope.disabled) {
              return;
            }

            highlightDropZone = true;
          });

          dropMessageElement.on('dragleave', function() {
            if (scope.disabled) {
              return;
            }

            highlightDropZone = false;
            _.delay(function(){
              if (!highlightDropZone) {
                dropMessageElement.removeClass('highlight-drag-and-drop-zone');
              }
            }, 200 );
          });

          dropMessageElement.on('drop', function(e) {
            if (scope.disabled) {
              return;
            }

            var files = _.get(e, 'originalEvent.dataTransfer.files', []);
            if (files.length > 0 ) {
              scope.file = _.head(files);
              addFile(scope.file);
            }
            removeDropZoneClasses();
            $('.drag-and-drop-zone').trigger('putDropZoneFront', false);
            $('.drag-and-drop-zone').trigger('reset');
            return false;
          });

          var positionOver = function(element, target) {
            // If there is a label element for the osc-file-input directive get its height the subtract it from the dropzone.
            var labelElementHeight = target.find('label').outerHeight();
            var outerHeight = labelElementHeight ? target.outerHeight() - labelElementHeight : target.outerHeight();
            var outerWidth = target.outerWidth();
            element.css({
              // Account for -3px margin by adding 6 to width.
              width: outerWidth + 6,
              height: outerHeight,
              position: 'absolute',
              'z-index': 100
            });
          };

          dropMessageElement.on('putDropZoneFront', function(event, putFront) {
            if (scope.disabled) {
              return;
            }

            var droppableElement, dropZoneMessage = element.find('.drag-and-drop-zone');
            if (putFront) {
              droppableElement = (scope.dropZoneId) ? $('#' + scope.dropZoneId) : element,
              positionOver(dropZoneMessage, droppableElement);
            } else {
              dropZoneMessage.css('z-index', '-1');
            }
            return false;
          });

          dropMessageElement.on('reset', function() {
            if (scope.disabled) {
              return;
            }

            showDropZone = false;
            return false;
          });
        }

        function addFile(file) {
          var reader = new FileReader();
          reader.onloadend = function(){
            scope.$apply(function(){
              scope.fileName = file.name;
              scope.model = reader.result;
              scope.isBinaryFile = isNonPrintable(reader.result);
              var cb = scope.onFileAdded;
              if (_.isFunction(cb)) {
                cb(reader.result);
              }
              if (!reader.error) {
                scope.uploadError = false;
              }
            });
          };
          reader.onerror = function(e){
            scope.uploadError = true;
            Logger.error("Could not read file", e);
          };

          if (scope.readAsBinaryString) {
            reader.readAsBinaryString(file);
          } else {
            reader.readAsText(file);
          }
        }

        function removeDropZoneClasses(){
          element.find('.drag-and-drop-zone').removeClass("show-drag-and-drop-zone highlight-drag-and-drop-zone");
        }

        scope.$on('$destroy', function(){
          $(dropMessageSelector).off();
          $(document)
            .off('drop.' + id)
            .off('dragenter.' + id)
            .off('dragover.' + id)
            .off('dragleave.' + id);
        });
      }
    };
  });
