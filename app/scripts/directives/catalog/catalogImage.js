'use strict';

angular.module('openshiftConsole')
  .directive('catalogImage', function($filter) {
    return {
      restrict: 'E',
      // Replace the catalog-template element so that the tiles are all equal height as flexbox items.
      // Otherwise, you have to add the CSS tile classes to catalog-template.
      replace: true,
      scope: {
        image: '=',
        imageStream: '=',
        project: '@',
        isBuilder: "=?"
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
          if (tag.from &&
              tag.from.kind === 'ImageStreamTag' &&
              tag.from.name.indexOf(':') === -1 &&
             !tag.from.namespace) {
            referenceTags[tag.name] = true;
            $scope.referencedBy[tag.from.name] = $scope.referencedBy[tag.from.name] || [];
            $scope.referencedBy[tag.from.name].push(tag.name);
          }
        });

        var isBuilder = function(tagName) {
          var tags = _.get(tagTags, [tagName], []);
          return _.includes(tags, 'builder');
        };

        var tags = _.get($scope, 'imageStream.status.tags', []);
        $scope.tags = _.filter(tags, function(tag) {
          return isBuilder(tag.tag) && !referenceTags[tag.tag];
        });

        // Preselect the first tag value.
        var firstTag = _.head($scope.tags);
        _.set($scope, 'is.tag', firstTag);
      }
    };
  });
