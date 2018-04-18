"use strict";

(function() {
  angular.module("openshiftConsole").component("istagSelect", {
  /**
   * Widget for selecting image stream tags.
   *
   * model:
   *   The model for the input. The model will either use or add the following keys:
   *     {
   *       namespace: "",
   *       imageStream: "",
   *       tagObject: {
   *          tag: "",
   *          items: []
   *        }
   *     }
   *   The tagObject.items array is only present in images that exist and are not pre-populated
   *
   * selectDisabled:
   *   An expression that will disable the form (default: false)
   */
    controller: [
      '$scope',
      'APIService',
      'DataService',
      'ProjectsService',
      IstagSelect
    ],
    controllerAs: '$ctrl',
    bindings: {
      istag: '=model',
      selectDisabled: '<',
      selectRequired: '<',
      includeSharedNamespace: '<',
      allowCustomTag: '<',
      appendToBody: '<'
    },
    require: {
      parent: '^form'
    },
    templateUrl: 'components/istag-select/istag-select.html',
  });

  function IstagSelect($scope,
                      APIService,
                      DataService,
                      ProjectsService) {

    var ctrl = this;
    var imageStreamsVersion = APIService.getPreferredVersion('imagestreams');
    ctrl.isByNamespace = {};
    ctrl.isNamesByNamespace = {};

    // Check if the istag object contains data about namespace/imageStream/tag so the ui-select will be pre-populated with them
    var shouldPrepopulate = _.get(ctrl, 'istag.namespace') && _.get(ctrl, 'istag.imageStream') && _.get(ctrl, 'istag.tagObject.tag');

    var ensureStatusTags = function(imageStreams) {
      // Make sure each image stream has a status tags array, even if empty.
      _.each(imageStreams, function(imageStream) {
        if (!_.get(imageStream, 'status.tags')) {
          _.set(imageStream, 'status.tags', []);
        }
      });
    };

    var prepopulate = function(ns) {
      ctrl.isByNamespace[ns] = {};
      ctrl.isNamesByNamespace[ns] = [];

      if (!_.includes(ctrl.namespaces, ns)) {
        ctrl.namespaces.push(ns);
        ctrl.isNamesByNamespace[ns] = ctrl.isNamesByNamespace[ns].concat(ctrl.istag.imageStream);
        ctrl.isByNamespace[ns][ctrl.istag.imageStream] = {status: {tags: [{tag: ctrl.istag.tagObject.tag}]}};
        return;
      }
      DataService.list(imageStreamsVersion, { namespace: ns }, function(isData) {
        // Make a copy since we modify status tags and don't want to mutate objects that are cached.
        var imageStreams = angular.copy(isData.by('metadata.name'));
        ensureStatusTags(imageStreams);
        ctrl.isByNamespace[ns] = imageStreams;
        ctrl.isNamesByNamespace[ns] = _.keys(imageStreams).sort();

        //  Image stream is missing
        if (!_.includes(ctrl.isNamesByNamespace[ns], ctrl.istag.imageStream)) {
          ctrl.isNamesByNamespace[ns] = ctrl.isNamesByNamespace[ns].concat(ctrl.istag.imageStream);
          ctrl.isByNamespace[ns][ctrl.istag.imageStream] = {
            status: {
              tags: {}
            }
          };
        }

        // Tag is missing
        if (!_.find( ctrl.isByNamespace[ns][ctrl.istag.imageStream].status.tags, {tag: ctrl.istag.tagObject.tag})) {
          ctrl.isByNamespace[ns][ctrl.istag.imageStream].status.tags.push({tag: ctrl.istag.tagObject.tag});
        }
      });
    };

    ProjectsService.list().then(function(projectData) {
      ctrl.namespaces = _.keys(projectData.by('metadata.name'));

      if (ctrl.includeSharedNamespace) {
        // Use _.uniq to avoid adding "openshift" twice if the user is a
        // member of the openshift namespace.
        ctrl.namespaces = _.uniq(['openshift'].concat(ctrl.namespaces));
      }

      ctrl.namespaces = ctrl.namespaces.sort();
      ctrl.namespaceChanged(ctrl.istag.namespace);
    });

    ctrl.namespaceChanged = function (namespace){
      // In case the selectboxes dont have to be prepopulated, which means the namespace selectbox
      // value was changed by user, clear the imageStream and tag.
      if (!shouldPrepopulate) {
        ctrl.istag.imageStream = null;
        ctrl.istag.tagObject = null;
      }

      if (!namespace || ctrl.isByNamespace[namespace]) {
        // We already have the data (or nothing selected).
        return;
      }

      if (shouldPrepopulate) {
        prepopulate(namespace);
        shouldPrepopulate = false;
        return;
      }
      DataService.list(imageStreamsVersion, { namespace: namespace }, function(isData) {
        // Make a copy since we modify status tags and don't want to mutate objects that are cached.
        var imageStreams = angular.copy(isData.by('metadata.name'));
        ensureStatusTags(imageStreams);
        ctrl.isByNamespace[namespace] = imageStreams;
        ctrl.isNamesByNamespace[namespace] = _.keys(imageStreams).sort();
      });
    };

    ctrl.getTags = function(search) {
      if (ctrl.allowCustomTag && search && !_.find(ctrl.isByNamespace[ctrl.istag.namespace][ctrl.istag.imageStream].status.tags, {tag: search})) {
        _.remove(ctrl.isByNamespace[ctrl.istag.namespace][ctrl.istag.imageStream].status.tags, function(tag) {
          return !tag.items;
        });
        ctrl.isByNamespace[ctrl.istag.namespace][ctrl.istag.imageStream].status.tags.unshift({tag: search});
      }
    };

    ctrl.groupTags = function(tagObject) {
      if (ctrl.allowCustomTag) {
        return tagObject.items ? 'Current Tags' : 'New Tag';
      }
      return '';
    };

  }
})();
