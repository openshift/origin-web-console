'use strict';

/**
 * @ngdoc function
 * @name openshiftConsole.controller:BrowseCategoryController
 * @description
 * # BrowseCategoryController
 * Controller of the openshiftConsole
 */
angular.module('openshiftConsole')
  .controller('BrowseCategoryController', function ($scope,
                                                    $filter,
                                                    $location,
                                                    $q,
                                                    $routeParams,
                                                    $uibModal,
                                                    APIService,
                                                    Constants,
                                                    DataService,
                                                    LabelFilter,
                                                    Navigate,
                                                    ProjectsService) {
    $scope.projectName = $routeParams.project;

    var findCategoryItem = function(categories, id) {
      var item;
      _.some(categories, function(category) {
        item = _.find(category.items, {id: id});
        if (item) {
          $scope.category = item;
          var subcategories = _.get(item, 'subcategories', []);
          $scope.subcategories = [{ id: '', label: '' }].concat(subcategories);
          return true;
        }
        return false;
      });

      return item;
    };

    var categories = Constants.CATALOG_CATEGORIES;
    var categoryID = $routeParams.category === 'none' ? '' : $routeParams.category;
    $scope.category = findCategoryItem(categories, categoryID);
    if (!$scope.category) {
      Navigate.toErrorPage("Catalog category " + $routeParams.category + " not found.");
      return;
    }

    var parentCategory, subcategories;
    if ($routeParams.subcategory) {
      parentCategory = $scope.category;
      categoryID = $routeParams.subcategory === 'none' ? '' : $routeParams.subcategory;
      subcategories = _.get($scope.category, 'subcategories', []);
      $scope.category = findCategoryItem(subcategories, categoryID);
      if (!$scope.category) {
        Navigate.toErrorPage("Catalog category " + $routeParams.category + "/" + $routeParams.subcategory + " not found.");
        return;
      }
    }

    var imageStreamsVersion = APIService.getPreferredVersion('imagestreams');
    var templatesVersion = APIService.getElementsByClassName('templates');

    $scope.alerts = $scope.alerts || {};

    ProjectsService
      .get($routeParams.project)
      .then(_.spread(function(project, context) {
        $scope.project = project;
        $scope.context = context;

        // List image streams and templates in the both the shared `openshift`
        // namespace and the project namespace.
        DataService.list(imageStreamsVersion, {namespace: "openshift"}).then(function(resp) {
          $scope.openshiftImageStreams = resp.by("metadata.name");
        });

        // Request only the template metadata. Otherwise the response contains all of the object definitions, which can be megabytes of data.
        DataService.list(templatesVersion, {namespace: "openshift"}, null, {partialObjectMetadataList: true}).then(function(resp) {
          $scope.openshiftTemplates = resp.by("metadata.name");
        });

        // If the current namespace is `openshift`, don't request the same
        // templates and image streams again.
        if ($routeParams.project === 'openshift') {
          $scope.projectImageStreams = [];
          $scope.projectTemplates = [];
        } else {
          DataService.list(imageStreamsVersion, context).then(function(resp) {
            $scope.projectImageStreams = resp.by("metadata.name");
          });

          DataService.list(templatesVersion, context, null, {partialObjectMetadataList: true}).then(function(resp) {
            $scope.projectTemplates = resp.by("metadata.name");
          });
        }
      }));
  });
