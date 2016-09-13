'use strict';

/**
 * @ngdoc function
 * @name openshiftConsole.controller:EditModalController
 * @description
 * # EditModalController
 * Controller of the openshiftConsole
 */
angular.module('openshiftConsole')
  .controller('EditModalController', function ($scope, $filter, $uibModalInstance, APIService, DataService) {
    // Use angular.copy to avoid $$hashKey properties inserted by ng-repeat.
    var resource = angular.copy($scope.resource);

    var getVersion = function(resource) {
      return _.get(resource, 'metadata.resourceVersion');
    };

    // Watch for updates to the resource to warn users before the save fails.
    $scope.$watch('resource', function(newValue) {
      $scope.resourceChanged = getVersion(newValue) !== getVersion(resource);
    });

    // Hack to make `apiVersion` and `kind` appear at the top.
    //
    // Since these properties are inserted by DataService for list operations,
    // they're inserted last. yamljs serializes using Object.keys() ordering
    // with no option to control order. Most browsers return keys in insertion
    // order, however, so if we add apiVersion and kind first, they appear at
    // the top of the serialized YAML. The rest of the properties are in the
    // order returned from the API that we want (metadata, spec, status).
    resource = angular.extend({
      apiVersion: resource.apiVersion,
      kind: resource.kind
    }, resource);

    // flowLevel: 8 - Maximum level of depth before generating inline
    $scope.model = jsyaml.safeDump(resource, {flowLevel: 8});

    var onChange = _.throttle(function() {
      $scope.$eval(function() {
        $scope.modified = true;
      });
    }, 1000);

    $scope.aceLoaded = function(editor) {
      var session = editor.getSession();
      session.setOption('tabSize', 2);
      session.setOption('useSoftTabs', true);

      editor.getSession().on('change', onChange);

      // Resize the editor based on window height.
      var updateEditorHeight = function() {
        var headerHeight = $('.modal-resource-edit .modal-header').outerHeight();
        var footerHeight = $('.modal-resource-edit .modal-footer').outerHeight();
        var availableHeight = window.innerHeight - headerHeight - footerHeight;


        // Use 80% of available height. min-height set in CSS.
        var editorHeight = Math.floor(availableHeight * 0.80);

        // Animate the change so it's not janky.
        $('.modal-resource-edit .editor').animate({
          height: editorHeight + 'px'
        }, 30, function() {
          editor.resize();
        });
      };

      setTimeout(updateEditorHeight, 10);

      var onResize = _.debounce(updateEditorHeight, 200);
      $(window).resize(onResize);
      $scope.$on('$destroy', function() {
        // Stop listening for resize events.
        $(window).off('resize', onResize);
      });
    };

    $scope.save = function() {
      $scope.modified = false;
      var updatedResource;
      try {
        updatedResource = jsyaml.safeLoad($scope.model);
      } catch (e) {
        $scope.error = e;
        return;
      }

      if (_.isEqual(resource, updatedResource)) {
        $uibModalInstance.close('no-changes');
        return;
      }

      if (updatedResource.kind !== resource.kind) {
        $scope.error = {
          message: 'Cannot change resource kind (original: ' + resource.kind + ', modified: ' + (updatedResource.kind || '<unspecified>') + ').'
        };
        return;
      }

      var groupVersion = APIService.objectToResourceGroupVersion(resource);
      var updatedGroupVersion = APIService.objectToResourceGroupVersion(updatedResource);
      if (!updatedGroupVersion) {
        $scope.error = { message: APIService.invalidObjectKindOrVersion(updatedResource) };
        return;
      }
      if (updatedGroupVersion.group !== groupVersion.group) {
        $scope.error = { message: 'Cannot change resource group (original: ' + (groupVersion.group || '<none>') + ', modified: ' + (updatedGroupVersion.group || '<none>') + ').' };
        return;
      }
      if (!APIService.apiInfo(updatedGroupVersion)) {
        $scope.error = { message: APIService.unsupportedObjectKindOrVersion(updatedResource) };
        return;
      }

      DataService.update(APIService.kindToResource($scope.kind), $scope.resource.metadata.name, updatedResource, {
        namespace: $scope.resource.metadata.namespace
      }).then(
        // success
        function() {
          $uibModalInstance.close('save');
        },
        // failure
        function(result) {
          $scope.error = {
            message: $filter('getErrorDetails')(result)
          };
        });
    };

    $scope.cancel = function() {
      $uibModalInstance.dismiss('cancel');
    };
  });
