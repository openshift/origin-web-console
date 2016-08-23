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
  .directive("istagSelect", function(DataService) {
    return {
      require: '^form',
      restrict: 'E',
      scope: {
        istag: '=model',
        selectDisabled: '=',
        includeSharedNamespace: '=',
        allowCustomTag: '='
      },
      templateUrl: 'views/directives/istag-select.html',
      controller: function($scope){
        $scope.isByNamespace = {};
        $scope.isNamesByNamespace = {};

        // Check if the istag object contains data about namespace/imageStream/tag so the ui-select will be pre-populated with them
        var shouldPrepopulate = ($scope.istag.namespace && $scope.istag.imageStream && $scope.istag.tagObject.tag) ? true : false ;

        var prepopulate = function(ns) {
          $scope.isByNamespace[ns] = {};
          $scope.isNamesByNamespace[ns] = [];

          if (!_.contains($scope.namespaces, ns)) {
            $scope.namespaces.push(ns);
            $scope.isNamesByNamespace[ns] = $scope.isNamesByNamespace[ns].concat($scope.istag.imageStream);
            $scope.isByNamespace[ns][$scope.istag.imageStream] = {status: {tags: [{tag: $scope.istag.tagObject.tag}]}};
            return;
          }
        DataService.list('imagestreams', { namespace: ns }, function(isData) {
            $scope.isByNamespace[ns] = isData.by('metadata.name');
            $scope.isNamesByNamespace[ns] = _.keys( $scope.isByNamespace[ns]).sort();

            //  Image stream is missing
            if (!_.contains($scope.isNamesByNamespace[ns], $scope.istag.imageStream)) {
              $scope.isNamesByNamespace[ns] = $scope.isNamesByNamespace[ns].concat($scope.istag.imageStream);
              $scope.isByNamespace[ns][$scope.istag.imageStream] = {status: {}};
            }
            if (!$scope.isByNamespace[ns][$scope.istag.imageStream].status.tags) {
              $scope.isByNamespace[ns][$scope.istag.imageStream].status = {tags: []};
            }
            // Tag is missing
            if (!_.find( $scope.isByNamespace[ns][$scope.istag.imageStream].status.tags, {tag: $scope.istag.tagObject.tag})) {
              $scope.isByNamespace[ns][$scope.istag.imageStream].status.tags.push({tag: $scope.istag.tagObject.tag});
            }
          });
        };

        DataService.list("projects", {}, function(projectData) {
          $scope.namespaces = _.keys(projectData.by('metadata.name')).sort();

          if ($scope.includeSharedNamespace) {
            // Use _.uniq to avoid adding "openshift" twice if the user is a
            // member of the openshift namespace.
            $scope.namespaces = _.uniq(['openshift'].concat($scope.namespaces));
          }

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
            DataService.list('imagestreams', { namespace: namespace }, function(isData) {
              $scope.isByNamespace[namespace] = isData.by('metadata.name');

              _.each(_.keys($scope.isByNamespace[namespace]), function(imageStream) {
                if (!$scope.isByNamespace[namespace][imageStream].status.tags) {
                  $scope.isByNamespace[namespace][imageStream].status = { tags: []};
                }
              });
              $scope.isNamesByNamespace[namespace] = _.keys($scope.isByNamespace[namespace]).sort();
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
