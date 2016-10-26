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
                                                    AlertMessageService,
                                                    CatalogService,
                                                    Constants,
                                                    DataService,
                                                    KeywordService,
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

    AlertMessageService.getAlerts().forEach(function(alert) {
      $scope.alerts[alert.name] = alert.data;
    });
    AlertMessageService.clearAlerts();

    $scope.breadcrumbs = [
      {
        title: $scope.projectName,
        link: "project/" + $scope.projectName
      },
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
        // Update project breadcrumb with display name.
        $scope.breadcrumbs[0].title = $filter('displayName')(project);

        // List templates in the project namespace as well as the shared `openshift` namespace.
        DataService.list("templates", context, function(templates) {
          $scope.projectTemplates = templates.by("metadata.name");
        });

        DataService.list("templates", {namespace: "openshift"}, function(templates) {
          $scope.openshiftTemplates = templates.by("metadata.name");
        });

        // List image streams in the project namespace as well as the shared `openshift` namespace.
        DataService.list("imagestreams", context, function(imageStreams) {
          $scope.projectImageStreams = imageStreams.by("metadata.name");
        });

        DataService.list("imagestreams", {namespace: "openshift"}, function(imageStreams) {
          $scope.openshiftImageStreams = imageStreams.by("metadata.name");
        });
      }));
  });
