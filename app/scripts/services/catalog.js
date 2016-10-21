'use strict';

angular.module("openshiftConsole")
  .factory("CatalogService", function($filter,
                                      Constants,
                                      KeywordService) {
    var getTags = $filter('tags');

    var categoryItemByID = {};
    _.each(Constants.CATALOG_CATEGORIES, function(category) {
      _.each(category.items, function(categoryItem) {
        categoryItemByID[categoryItem.id] = categoryItem;

        // Add subcategories as well.
        var subcategories = _.get(categoryItem, 'subcategories', []);
        _.each(subcategories, function(subcategory) {
          _.each(subcategory.items, function(categoryItem) {
            categoryItemByID[categoryItem.id] = categoryItem;
          });
        });
      });
    });

    var getCategoryItem = function(id) {
      return categoryItemByID[id];
    };

    // Check if tag in is in the array of tags. Ignore case.
    var hasTag = function(tag, tags) {
      tag = tag.toLowerCase();

      var i;
      for (i = 0; i < tags.length; i++) {
        var next = tags[i].toLowerCase();
        if (tag === next) {
          return true;
        }
      }

      return false;
    };

    var hasCategory = function(categoryItem, tags) {
      var aliases = _.get(categoryItem, 'categoryAliases', []);
      var categoryTags = [categoryItem.id].concat(aliases);
      return _.some(categoryTags, function(categoryTag) {
        return hasTag(categoryTag, tags);
      });
    };

    var categorizeImageStreams = function(imageStreams) {
      var imageStreamsByCategory = {};
      _.each(imageStreams, function(imageStream) {
        if (!imageStream.status) {
          return;
        }

        // Map of spec tags so we can find them efficiently later when looking
        // at status tags.
        var specTags = {};

        if (imageStream.spec && imageStream.spec.tags) {
          _.each(imageStream.spec.tags, function(tag) {
            var tags = _.get(tag, 'annotations.tags');
            if (tags) {
              specTags[tag.name] = tags.split(/\s*,\s*/);
            }
          });
        }

        var matchFound = false;
        _.each(categoryItemByID, function(categoryItem) {
          var matchesCategory = function(imageStream) {
            return _.some(imageStream.status.tags, function(tag) {
              var categoryTags = specTags[tag.tag] || [];
              return hasCategory(categoryItem, categoryTags) && hasTag('builder', categoryTags);
            });
          };

          if (matchesCategory(imageStream)) {
            imageStreamsByCategory[categoryItem.id] = imageStreamsByCategory[categoryItem.id] || [];
            imageStreamsByCategory[categoryItem.id].push(imageStream);
            matchFound = true;
          }
        });

        var isBuilder;
        if (!matchFound) {
          isBuilder = _.some(imageStream.status.tags, function(tag) {
            var categoryTags = specTags[tag.tag] || [];
            return hasTag('builder', categoryTags);
          });
          if (isBuilder) {
            imageStreamsByCategory[''] = imageStreamsByCategory[''] || [];
            imageStreamsByCategory[''].push(imageStream);
          }
        }
      });

      return imageStreamsByCategory;
    };

    var categorizeTemplates = function(templates) {
      var templatesByCategory = {};
      _.each(templates, function(template) {
        var tags = getTags(template), matchFound = false;
        _.each(categoryItemByID, function(categoryItem) {
          if (hasCategory(categoryItem, tags)) {
            templatesByCategory[categoryItem.id] = templatesByCategory[categoryItem.id] || [];
            templatesByCategory[categoryItem.id].push(template);
            matchFound = true;
          }
        });

        if (!matchFound) {
          templatesByCategory[''] = templatesByCategory[''] || [];
          templatesByCategory[''].push(template);
        }
      });

      return templatesByCategory;
    };

    // TODO: Filter by description
    var imageStreamFilterFields = [
      'metadata.name',
      'metadata.annotations["openshift.io/display-name"]'
    ];

    var filterImageStreams = function(imageStreams, keywords) {
      return KeywordService.filterForKeywords(imageStreams, imageStreamFilterFields, keywords);
    };

    var templateFilterFields = [
      'metadata.name',
      'metadata.annotations["openshift.io/display-name"]',
      'metadata.annotations.description'
    ];

    var filterTemplates = function(templates, keywords) {
      return KeywordService.filterForKeywords(templates, templateFilterFields, keywords);
    };

    return {
      getCategoryItem: getCategoryItem,
      categorizeImageStreams: categorizeImageStreams,
      categorizeTemplates: categorizeTemplates,
      filterImageStreams: filterImageStreams,
      filterTemplates: filterTemplates
    };
  });
