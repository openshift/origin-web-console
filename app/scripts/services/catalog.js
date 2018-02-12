'use strict';

angular.module("openshiftConsole")
  .factory("CatalogService", function($filter,
                                      $q,
                                      $window,
                                      APIService,
                                      AuthService,
                                      Catalog,
                                      Constants,
                                      KeywordService,
                                      Logger,
                                      NotificationsService) {
    var getTags = $filter('tags');

    // API versions
    var serviceBindingsVersion = APIService.getPreferredVersion('servicebindings');
    var serviceClassesVersion = APIService.getPreferredVersion('clusterserviceclasses');
    var serviceInstancesVersion = APIService.getPreferredVersion('serviceinstances');
    var servicePlansVersion = APIService.getPreferredVersion('clusterserviceplans');

    // Enable service catalog features if the new experience is enabled and the
    // servicecatalog.k8s.io resources are available.
    var SERVICE_CATALOG_ENABLED = !Constants.DISABLE_SERVICE_CATALOG_LANDING_PAGE &&
                                  APIService.apiInfo(serviceBindingsVersion) &&
                                  APIService.apiInfo(serviceClassesVersion) &&
                                  APIService.apiInfo(serviceInstancesVersion) &&
                                  APIService.apiInfo(servicePlansVersion);

    var cachedCatalogItems;

    var clearCachedCatalogItems = function() {
      Logger.debug('ProjectsService: clearing catalog items cache');
      cachedCatalogItems = null;
    };

    AuthService.onUserChanged(clearCachedCatalogItems);
    AuthService.onLogout(clearCachedCatalogItems);

    var getCatalogItems = function(forceRefresh) {
      if (cachedCatalogItems && !forceRefresh) {
        Logger.debug('CatalogService: returning cached catalog items');
        return $q.when(cachedCatalogItems);
      }

      Logger.debug('CatalogService: getCatalogItems, force refresh', forceRefresh);
      return Catalog.getCatalogItems(true).then(_.spread(function(items, errorMessage) {
        if (errorMessage) {
          var alertData = {
            type: 'error',
            message: errorMessage
          };
          NotificationsService.addNotification(alertData);
        }
        cachedCatalogItems = items;
        return items;
      }));
    };

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
              return hasCategory(categoryItem, categoryTags) &&
                     hasTag('builder', categoryTags) &&
                     !hasTag('hidden', categoryTags);
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
            return hasTag('builder', categoryTags) && !hasTag('hidden', categoryTags);
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

    var referencesSameImageStream = function(specTag) {
      return specTag.from &&
             specTag.from.kind === 'ImageStreamTag' &&
             specTag.from.name.indexOf(':') === -1 &&
            !specTag.from.namespace;
    };

    // Don't use KeywordService for image stream filtering so we can add
    // special handling for image stream tags. Match keywords (array of regex)
    // against image streams and image stream tags, returning a copy of the
    // image streams with only matching status tags.
    var getDisplayName = $filter('displayName');
    var filterImageStreams = function(imageStreams, keywords) {
      if (!keywords.length) {
        return imageStreams;
      }

      var filteredImageStreams = [];
      _.each(imageStreams, function(imageStream) {
        var name = _.get(imageStream, 'metadata.name', '');
        var displayName = getDisplayName(imageStream, true);
        var specTags = [];
        var references = {};
        var referencedBy = {};
        _.each(imageStream.spec.tags, function(tag) {
          // If the tag follows another, track the reference.
          if (referencesSameImageStream(tag)) {
            references[tag.name] = tag.from.name;
            referencedBy[tag.from.name] = referencedBy[tag.from.name] || [];
            referencedBy[tag.from.name].push(tag.name);
            return;
          }

          // If the tag doesn't follow another, consider it in the search.
          specTags.push(tag);
        });

        var matchingTags = _.keyBy(specTags, 'name');

        // Find tags that match every keyword. Search image stream name, image
        // stream display name, and tag names, and tag descriptions. If a
        // keyword matches the image stream name or display name, it's
        // considered to match all tags.
        _.each(keywords, function(regex) {
          if (regex.test(name)) {
            return;
          }

          if (displayName && regex.test(displayName)) {
            return;
          }

          // Check tag descriptions.
          _.each(specTags, function(tag) {
            // If this is not a builder or is hidden, don't match the tag.
            var tagTags = _.get(tag, 'annotations.tags', '');
            if (!/\bbuilder\b/.test(tagTags) || /\bhidden\b/.test(tagTags)) {
              delete matchingTags[tag.name];
              return;
            }

            // If the keyword matches the tag name, accept it.
            if (regex.test(tag.name)) {
              return;
            }

            // Search any tag names that reference this tag as well.  For
            // instance, searching for "latest" should match nodejs:4 if
            // nodejs:latest references nodejs:4
            var matches = function(referenceName) {
              return regex.test(referenceName);
            };
            if (_.some(referencedBy[tag.name], matches)) {
              return;
            }

            var description = _.get(tag, 'annotations.description');
            if (!description || !regex.test(description)) {
              delete matchingTags[tag.name];
            }
          });
        });

        // Make a copy of the image stream with only the matching tags.
        var imageStreamCopy;
        if (!_.isEmpty(matchingTags)) {
          imageStreamCopy = angular.copy(imageStream);
          imageStreamCopy.status.tags = _.filter(imageStreamCopy.status.tags, function(tag) {
            // If this tag follow another tag, include it if the other tag matches the search.
            var fromTag = references[tag.tag];
            if (fromTag) {
              return matchingTags[fromTag];
            }

            // Otherwise check if this tag was a match.
            return matchingTags[tag.tag];
          });

          filteredImageStreams.push(imageStreamCopy);
        }
      });

      return filteredImageStreams;
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
      SERVICE_CATALOG_ENABLED: SERVICE_CATALOG_ENABLED,
      getCatalogItems: getCatalogItems,
      getCategoryItem: getCategoryItem,
      categorizeImageStreams: categorizeImageStreams,
      categorizeTemplates: categorizeTemplates,
      referencesSameImageStream: referencesSameImageStream,
      filterImageStreams: filterImageStreams,
      filterTemplates: filterTemplates
    };
  });
