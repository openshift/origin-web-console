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

    $scope.alerts = $scope.alerts || {};

    $scope.breadcrumbs = [
      {
        title: "Add to Project",
        link: "project/" + $scope.projectName + "/create"
      },
      {
        title: "Catalog",
        link: "project/" + $scope.projectName + "/create?tab=fromCatalog"
      }
    ];

    if (parentCategory) {
      $scope.breadcrumbs.push({
        title: parentCategory.label,
        link: "project/" + $scope.projectName + "/create/category/" + parentCategory.id
      });
    }

    $scope.breadcrumbs.push({
      title: $scope.category.label
    });

    ProjectsService
      .get($routeParams.project)
      .then(_.spread(function(project, context) {
        $scope.project = project;
        $scope.context = context;

        // List image streams and templates in the both the shared `openshift`
        // namespace and the project namespace.
        DataService.list("imagestreams", {namespace: "openshift"}).then(function(resp) {
          $scope.openshiftImageStreams = resp.by("metadata.name");
        });

        // Request only the template metadata. Otherwise the response contains all of the object definitions, which can be megabytes of data.
        DataService.list("templates", {namespace: "openshift"}, null, {partialObjectMetadataList: true}).then(function(resp) {
          $scope.openshiftTemplates = resp.by("metadata.name");
        });

        // If the current namespace is `openshift`, don't request the same
        // templates and image streams again.
        if ($routeParams.project === 'openshift') {
          $scope.projectImageStreams = [];
          $scope.projectTemplates = [];
        } else {
          DataService.list("imagestreams", context).then(function(resp) {
            $scope.projectImageStreams = resp.by("metadata.name");
          });

          DataService.list("templates", context, null, {partialObjectMetadataList: true}).then(function(resp) {
            $scope.projectTemplates = resp.by("metadata.name");
          });
        }
      }));
  });
