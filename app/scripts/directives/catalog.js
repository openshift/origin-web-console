'use strict';

angular.module('openshiftConsole')
  .directive('catalog', function(CatalogService, Constants, KeywordService, Logger) {
    return {
      restrict: 'E',
      scope: {
        projectImageStreams: '=',
        openshiftImageStreams: '=',
        projectTemplates: '=',
        openshiftTemplates: '=',
        projectName: '=',
        // Optional category with subcategory items
        parentCategory: '=category'
      },
      templateUrl: 'views/catalog/catalog.html',
      link: function($scope) {
        $scope.categories = _.get($scope, 'parentCategory.subcategories', Constants.CATALOG_CATEGORIES);

        // Set to true when everything has finished loading.
        $scope.loaded = false;

        // Set to false if there is data to show.
        $scope.emptyCatalog = true;

        // The current filter value.
        $scope.filter = {
          keyword: ''
        };

        function filterCatalog() {
          var keywords = $scope.keywords = KeywordService.generateKeywords($scope.filter.keyword);
          if (_.isEmpty(keywords)) {
            $scope.filterActive = false;
            $scope.filteredBuildersByCategory = $scope.buildersByCategory;
            $scope.filteredTemplatesByCategory = $scope.templatesByCategory;
            return;
          }

          $scope.filterActive = true;
          $scope.filteredBuildersByCategory = {};
          _.each($scope.buildersByCategory, function(builders, id) {
            var categoryItem = CatalogService.getCategoryItem(id);
            // Test to see if the keyword matches the category label.
            var matchesCategoryLabel = function(regex) {
              return regex.test(categoryItem.label);
            };
            var categoryKeywords = _.reject(keywords, matchesCategoryLabel);
            $scope.filteredBuildersByCategory[id] = CatalogService.filterImageStreams(builders, categoryKeywords);
          });
          $scope.filteredBuildersNoSubcategory = CatalogService.filterImageStreams($scope.buildersNoSubcategory, keywords);

          $scope.filteredTemplatesByCategory = {};
          _.each($scope.templatesByCategory, function(templates, id) {
            var categoryItem = CatalogService.getCategoryItem(id);
            // Test to see if the keyword matches the category label.
            var matchesCategoryLabel = function(regex) {
              return regex.test(categoryItem.label);
            };
            var categoryKeywords = _.reject(keywords, matchesCategoryLabel);
            $scope.filteredTemplatesByCategory[id] = CatalogService.filterTemplates(templates, categoryKeywords);
          });
          $scope.filteredTemplatesNoSubcategory = CatalogService.filterTemplates($scope.templatesNoSubcategory, keywords);
        }

        // Filter the catalog when the keyword or tag changes.
        $scope.$watch('filter.keyword', _.debounce(function() {
          $scope.$apply(function() {
            filterCatalog();
            updateCategoryCounts();
          });
        }, 200, { maxWait: 1000, trailing: true }));

        function findItemsWithNoSubcategory(itemsByCategory) {
          var subcategories = _.get($scope, 'parentCategory.subcategories', []);
          if (_.isEmpty(subcategories)) {
            return [];
          }

          // Set of items in a subcategory indexed by UID.
          var uidInSubcategory = {};
          _.each(subcategories, function(subcategory) {
            _.each(subcategory.items, function(subcategoryItem) {
              _.each(itemsByCategory[subcategoryItem.id], function(item) {
                var uid = _.get(item, 'metadata.uid');
                uidInSubcategory[uid] = true;
              });
            });
          });

          var isInSubcategory = function(item) {
            var uid = _.get(item, 'metadata.uid');
            return !!uidInSubcategory[uid];
          };

          var parentID = $scope.parentCategory.id;
          return _.reject(itemsByCategory[parentID], isInSubcategory);
        }

        function updateImageStreams() {
          if (!$scope.projectImageStreams || !$scope.openshiftImageStreams) {
            return;
          }

          var imageStreams = _.toArray($scope.projectImageStreams).concat(_.toArray($scope.openshiftImageStreams));
          $scope.buildersByCategory = CatalogService.categorizeImageStreams(imageStreams);
          $scope.buildersNoSubcategory = findItemsWithNoSubcategory($scope.buildersByCategory);
          $scope.emptyCatalog = $scope.emptyCatalog && _.every($scope.buildersByCategory, _.isEmpty) && _.isEmpty($scope.buildersNoSubcategory);
          updateState();
        }

        function updateTemplates() {
          if (!$scope.projectTemplates || !$scope.openshiftTemplates) {
            return;
          }

          var templates = _.toArray($scope.projectTemplates).concat(_.toArray($scope.openshiftTemplates));
          $scope.templatesByCategory = CatalogService.categorizeTemplates(templates);
          $scope.templatesNoSubcategory = findItemsWithNoSubcategory($scope.templatesByCategory);
          $scope.emptyCatalog = $scope.emptyCatalog && _.every($scope.templatesByCategory, _.isEmpty) && _.isEmpty($scope.templatesNoSubcategory);
          updateState();
        }

        var nonEmptyCategories;
        function updateCategoryCounts() {
          $scope.noFilterMatches = true;
          nonEmptyCategories = [];

          var countByCategory = {};
          _.each($scope.filteredBuildersByCategory, function(builders, id) {
            countByCategory[id] = _.size(builders);
          });
          _.each($scope.filteredTemplatesByCategory, function(templates, id) {
            countByCategory[id] = (countByCategory[id] || 0) + _.size(templates);
          });

          // Check to see if entire categories have content.
          $scope.allContentHidden = true;
          _.each($scope.categories, function(category) {
            var hasContent = false;
            _.each(category.items, function(item) {
              if (countByCategory[item.id]) {
                nonEmptyCategories.push(item);
                hasContent = true;
              }
            });
            _.set($scope, ['hasContent', category.id], hasContent);
            if (hasContent) {
              $scope.allContentHidden = false;
            }
          });
          $scope.countByCategory = countByCategory;

          $scope.hasItemsNoSubcategory = !_.isEmpty($scope.buildersNoSubcategory) || !_.isEmpty($scope.templatesNoSubcategory);
          $scope.countFilteredNoSubcategory = _.size($scope.filteredBuildersNoSubcategory) + _.size($scope.filteredTemplatesNoSubcategory);
          if ($scope.countFilteredNoSubcategory) {
            $scope.allContentHidden = false;
          }
        }

        function hasSingleCategory() {
          if (!$scope.parentCategory) {
            return false;
          }

          if (nonEmptyCategories.length !== 1) {
            return false;
          }

          return !$scope.hasItemsNoSubcategory;
        }

        function updateState() {
          // Have we finished loading all of the templates and image streams in
          // both the project and openshift namespaces? If undefined, they're not
          // loaded.
          $scope.loaded =
            $scope.projectTemplates &&
            $scope.openshiftTemplates &&
            $scope.projectImageStreams &&
            $scope.openshiftImageStreams;

          filterCatalog();
          updateCategoryCounts();

          if ($scope.loaded) {
            // If there is only one subcategory with items, just show the items.
            if (hasSingleCategory()) {
              $scope.singleCategory = _.head(nonEmptyCategories);
            }

            Logger.log("templates by category", $scope.templatesByCategory);
            Logger.log("builder images", $scope.buildersByCategory);
          }
        }

        $scope.$watchGroup(['openshiftImageStreams', 'projectImageStreams'], updateImageStreams);
        $scope.$watchGroup(['openshiftTemplates', 'projectTemplates'], updateTemplates);
      }
    };
  });
