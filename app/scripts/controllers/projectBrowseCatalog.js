'use strict';

angular.module('openshiftConsole')
  .controller('ProjectBrowseCatalogController',
    function($scope,
             $q,
             $routeParams,
             DataService,
             AuthorizationService,
             Catalog,
             CatalogService,
             Navigate,
             NotificationsService,
             ProjectsService) {
      var currentProjectName = $routeParams.project;


      ProjectsService.get(currentProjectName).then(function() {
        AuthorizationService.getProjectRules(currentProjectName).then(function () {
          var canIAddToProject = AuthorizationService.canIAddToProject(currentProjectName);
          if (!canIAddToProject) {
            Navigate.toProjectOverview(currentProjectName);
            return;
          }

          var catalogItems;
          var projectItems;

          // Show all catalog items, project templates, and project image streams
          var catalogItemsPromise = CatalogService.getCatalogItems().then(function (items) {
            catalogItems = items;
          });

          var projectItemsPromise = Catalog.getProjectCatalogItems(currentProjectName).then( _.spread(function(catalogServiceItems, errorMessage) {
            projectItems = catalogServiceItems;
            if (errorMessage) {
              NotificationsService.addNotification(
                {
                  type: "error",
                  message: errorMessage
                }
              );
            }
          }));

          $q.all([catalogItemsPromise, projectItemsPromise]).then(function() {
            $scope.catalogItems = Catalog.sortCatalogItems(_.concat(catalogItems, projectItems));
            if ($routeParams.filter) {
              $scope.keywordFilter = $routeParams.filter;
            }

          });
        });
      });
    });
