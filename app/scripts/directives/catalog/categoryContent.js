'use strict';

angular.module('openshiftConsole')
  .directive('categoryContent', function(CatalogService, Constants, KeywordService, Logger) {
    return {
      restrict: 'E',
      scope: {
        projectImageStreams: '=',
        openshiftImageStreams: '=',
        projectTemplates: '=',
        openshiftTemplates: '=',
        projectName: '=',
        category: '='
      },
      templateUrl: 'views/catalog/category-content.html',
      link: function($scope) {
        var builderImages = [],
            templates = [];

        // Templates that match the current filter, or all templates if no filter is set.
        // Key is the category tag, value is an array.
        $scope.filteredTemplates = [];

        // Builders that match the current filter, or all builders if no filter is set.
        // Key is the category tag, value is an array.
        $scope.filteredBuilderImages = [];

        // Set to true when everything has finished loading.
        $scope.loaded = false;

        // The current filter value.
        $scope.filter = {
          keyword: ''
        };

        function filterCatalog() {
          var keywords = $scope.keywords = KeywordService.generateKeywords($scope.filter.keyword);
          $scope.filteredBuilderImages = CatalogService.filterImageStreams(builderImages, keywords);
          $scope.filteredTemplates = CatalogService.filterTemplates(templates, keywords);
        }

        // Filter the catalog when the keyword or tag changes.
        $scope.$watch('filter.keyword', filterCatalog);

        function getAllImageStreams() {
          if (!$scope.projectImageStreams || !$scope.openshiftImageStreams) {
            return [];
          }

          return _.toArray($scope.projectImageStreams).concat(_.toArray($scope.openshiftImageStreams));
        }

        function updateImageStreams() {
          var imageStreamsByCategory = CatalogService.categorizeImageStreams(getAllImageStreams());
          builderImages = _.get(imageStreamsByCategory, [$scope.category.id], []);
          updateState();
        }

        function getAllTemplates() {
          if (!$scope.projectTemplates || !$scope.openshiftTemplates) {
            return [];
          }

          return _.toArray($scope.projectTemplates).concat(_.toArray($scope.openshiftTemplates));
        }

        function updateTemplates() {
          var templatesByCategory = CatalogService.categorizeTemplates(getAllTemplates());
          templates = _.get(templatesByCategory, [$scope.category.id], []);
          updateState();
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

          // Update filtered scope variables.
          filterCatalog();

          $scope.emptyCategory =
            _.isEmpty(builderImages) &&
            _.isEmpty(templates);

          if ($scope.loaded) {
            Logger.log("templates", templates);
            Logger.log("builder images", builderImages);
          }
        }

        $scope.$watchGroup(['openshiftImageStreams', 'projectImageStreams'], updateImageStreams);
        $scope.$watchGroup(['openshiftTemplates', 'projectTemplates'], updateTemplates);
      }
    };
  });
