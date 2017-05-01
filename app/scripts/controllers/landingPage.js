'use strict';

angular.module('openshiftConsole')
  .controller('LandingPageController',
              function($scope,
                       AuthService,
                       Catalog,
                       Constants,
                       Navigate,
                       NotificationsService) {
    $scope.saasOfferings = Constants.SAAS_OFFERINGS;

    $scope.viewMembership = function(project) {
      Navigate.toProjectMembership(project.metadata.name);
    };

    // Currently this is the only page showing notifications, clear any that came previous pages.
    // Once all pages show notifications this should be removed.
    NotificationsService.clearNotifications();

    $scope.templateSelected = function(template) {
      $scope.template = template;
    };

    $scope.templateDialogClosed = function() {
      $scope.template = null;
    };

    AuthService.withUser().then(function() {
      Catalog.getCatalogItems(true).then(function(items) {
        $scope.catalogItems = items;
      });
    });
  });
