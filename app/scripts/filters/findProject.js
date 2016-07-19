'use strict';

angular.module('openshiftConsole')
  .filter('findProject', function(annotationFilter) {
    return function(items, searchString) {
      if(!searchString) {
        return items;
      }

      var searchStringLower = searchString.toLowerCase();

      return _.filter(items, function(item) {
        return item.metadata.name.toLowerCase().includes(searchStringLower) ||
               _.includes(annotationFilter(item, 'displayName').toLowerCase(), searchStringLower) ||
               _.includes(annotationFilter(item, 'description').toLowerCase(), searchStringLower) ||
               _.includes(moment(item.metadata.creationTimestamp).from(moment()).toLowerCase(), searchStringLower);
      });
    };
  });
