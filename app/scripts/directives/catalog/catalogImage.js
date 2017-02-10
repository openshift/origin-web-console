'use strict';

angular.module('openshiftConsole')
  .directive('catalogImage', function($filter, CatalogService) {
    return {
      restrict: 'E',
      // Replace the catalog-template element so that the tiles are all equal height as flexbox items.
      // Otherwise, you have to add the CSS tile classes to catalog-template.
      replace: true,
      scope: {
        image: '=',
        imageStream: '=',
        project: '@',
        isBuilder: "=?",
        keywords: '='
      },
      templateUrl: 'views/catalog/_image.html',
      link: function($scope) {
        var imageStreamTagTags = $filter('imageStreamTagTags');
        var referenceTags = {};
        $scope.referencedBy = {};
        var specTags = _.get($scope, 'imageStream.spec.tags', []);
        var tagTags = {};
        _.each(specTags, function(tag) {
          tagTags[tag.name] = imageStreamTagTags($scope.imageStream, tag.name);
          if (CatalogService.referencesSameImageStream(tag)) {
            referenceTags[tag.name] = true;
            $scope.referencedBy[tag.from.name] = $scope.referencedBy[tag.from.name] || [];
            $scope.referencedBy[tag.from.name].push(tag.name);
          }
        });

        var isBuilder = function(tagName) {
          var tags = _.get(tagTags, [tagName], []);
          return _.includes(tags, 'builder') && !_.includes(tags, 'hidden');
        };

        // Watch status tags. Some tags might be removed from the list if they
        // don't match the current filter.
        $scope.$watch('imageStream.status.tags', function(tags) {
          $scope.tags = _.filter(tags, function(tag) {
            return isBuilder(tag.tag) && !referenceTags[tag.tag];
          });

          var selected = _.get($scope, 'is.tag.tag');
          if (!selected || !_.some($scope.tags, { tag: selected })) {
            // Preselect the first tag value.
            _.set($scope, 'is.tag', _.head($scope.tags));
          }
        });
      }
    };
  });
