'use strict';

angular.module('openshiftConsole')
  .controller('LandingPageController',
              function($scope,
                       AuthService,
                       Catalog,
                       Constants,
                       Navigate,
                       NotificationsService,
                       RecentlyViewedServiceItems) {
    $scope.saasOfferings = Constants.SAAS_OFFERINGS;

    $scope.viewMembership = function(project) {
      Navigate.toProjectMembership(project.metadata.name);
    };

    // Currently this is the only page showing notifications, clear any that came previous pages.
    // Once all pages show notifications this should be removed.
    NotificationsService.clearNotifications();

    var addTemplateToRecentlyViewed = function() {
      var templateUID = _.get($scope, 'template.metadata.uid');
      if (templateUID) {
        RecentlyViewedServiceItems.addItem(templateUID);
      }
    };

    $scope.templateSelected = function(template) {
      $scope.template = template;
    };

    $scope.templateDialogClosed = function() {
      addTemplateToRecentlyViewed();
      $scope.template = null;
    };

    AuthService.withUser().then(function() {
      var includeTemplates = !_.get(Constants, 'ENABLE_TECH_PREVIEW_FEATURE.template_service_broker');
      Catalog.getCatalogItems(includeTemplates).then(function(items) {
        $scope.catalogItems = items;
      });
    });

    $scope.$on('$destroy', function() {
      // If the template dialog was open when the scope was destroyed, still
      // add the item to recently-viewed. No-op if the dialog is not open.
      addTemplateToRecentlyViewed();
    });
  });
