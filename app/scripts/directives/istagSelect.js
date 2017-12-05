"use strict";

angular.module("openshiftConsole")
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
  .directive("istagSelect", function(
    APIService,
    DataService,
    ProjectsService) {

    var imageStreamsVersion = APIService.getPreferredVersion('imagestreams');

    return {
      require: '^form',
      restrict: 'E',
      scope: {
        istag: '=model',
        selectDisabled: '=',
        selectRequired: '=',
        includeSharedNamespace: '=',
        allowCustomTag: '=',
        appendToBody: '='
      },
      templateUrl: 'views/directives/istag-select.html',
      controller: function($scope){
        $scope.isByNamespace = {};
        $scope.isNamesByNamespace = {};

        // Check if the istag object contains data about namespace/imageStream/tag so the ui-select will be pre-populated with them
        var shouldPrepopulate = _.get($scope, 'istag.namespace') && _.get($scope, 'istag.imageStream') && _.get($scope, 'istag.tagObject.tag');

        var ensureStatusTags = function(imageStreams) {
          // Make sure each image stream has a status tags array, even if empty.
          _.each(imageStreams, function(imageStream) {
            if (!_.get(imageStream, 'status.tags')) {
              _.set(imageStream, 'status.tags', []);
            }
          });
        };

        var prepopulate = function(ns) {
          $scope.isByNamespace[ns] = {};
          $scope.isNamesByNamespace[ns] = [];

          if (!_.includes($scope.namespaces, ns)) {
            $scope.namespaces.push(ns);
            $scope.isNamesByNamespace[ns] = $scope.isNamesByNamespace[ns].concat($scope.istag.imageStream);
            $scope.isByNamespace[ns][$scope.istag.imageStream] = {status: {tags: [{tag: $scope.istag.tagObject.tag}]}};
            return;
          }
          DataService.list(imageStreamsVersion, { namespace: ns }, function(isData) {
            // Make a copy since we modify status tags and don't want to mutate objects that are cached.
            var imageStreams = angular.copy(isData.by('metadata.name'));
            ensureStatusTags(imageStreams);
            $scope.isByNamespace[ns] = imageStreams;
            $scope.isNamesByNamespace[ns] = _.keys(imageStreams).sort();

            //  Image stream is missing
            if (!_.includes($scope.isNamesByNamespace[ns], $scope.istag.imageStream)) {
              $scope.isNamesByNamespace[ns] = $scope.isNamesByNamespace[ns].concat($scope.istag.imageStream);
              $scope.isByNamespace[ns][$scope.istag.imageStream] = {
                status: {
                  tags: {}
                }
              };
            }

            // Tag is missing
            if (!_.find( $scope.isByNamespace[ns][$scope.istag.imageStream].status.tags, {tag: $scope.istag.tagObject.tag})) {
              $scope.isByNamespace[ns][$scope.istag.imageStream].status.tags.push({tag: $scope.istag.tagObject.tag});
            }
          });
        };

        ProjectsService.list().then(function(projectData) {
          $scope.namespaces = _.keys(projectData.by('metadata.name'));

          if ($scope.includeSharedNamespace) {
            // Use _.uniq to avoid adding "openshift" twice if the user is a
            // member of the openshift namespace.
            $scope.namespaces = _.uniq(['openshift'].concat($scope.namespaces));
          }

          $scope.namespaces = $scope.namespaces.sort();

          // Fetch image streams when a new namespace is picked.
          $scope.$watch('istag.namespace', function(namespace) {
            if (!namespace || $scope.isByNamespace[namespace]) {
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
              $scope.isByNamespace[namespace] = imageStreams;
              $scope.isNamesByNamespace[namespace] = _.keys(imageStreams).sort();
            });
          });
        });

        $scope.getTags = function(search) {
          if ($scope.allowCustomTag && search && !_.find($scope.isByNamespace[$scope.istag.namespace][$scope.istag.imageStream].status.tags, {tag: search})) {
            _.remove($scope.isByNamespace[$scope.istag.namespace][$scope.istag.imageStream].status.tags, function(tag) {
              return !tag.items;
            });
            $scope.isByNamespace[$scope.istag.namespace][$scope.istag.imageStream].status.tags.unshift({tag: search});
          }
        };

        $scope.groupTags = function(tagObject) {
          if ($scope.allowCustomTag) {
            return tagObject.items ? 'Current Tags' : 'New Tag';
          }
          return '';
        };
      }
    };
  });
