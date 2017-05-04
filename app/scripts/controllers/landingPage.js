'use strict';

angular.module('openshiftConsole')
  .controller('LandingPageController',
              function($scope,
                       $rootScope,
                       AuthService,
                       Catalog,
                       Constants,
                       Navigate,
                       NotificationsService,
                       RecentlyViewedServiceItems,
                       GuidedTourService,
                       $timeout,
                       $routeParams,
                       $location) {
    var tourConfig = _.get(Constants, 'GUIDED_TOURS.landing_page_tour');
    var tourEnabled = tourConfig && tourConfig.enabled && tourConfig.steps;

    $scope.saasOfferings = Constants.SAAS_OFFERINGS;

    $scope.viewMembership = function(project) {
      Navigate.toProjectMembership(project.metadata.name);
    };

    if (tourEnabled) {
      $scope.startGuidedTour = function () {
        GuidedTourService.startTour(tourConfig.steps);
      };
    }

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
        dataLoaded();
      });
    });

    $scope.$on('$destroy', function() {
      // If the template dialog was open when the scope was destroyed, still
      // add the item to recently-viewed. No-op if the dialog is not open.
      addTemplateToRecentlyViewed();
    });

    function dataLoaded() {
      if (!tourEnabled) {
        return;
      }

      if ($routeParams.startTour) {
        $timeout(function() {
          $location.replace();
          $location.search('startTour', null);
          $scope.startGuidedTour();
        }, 500);
      } else if (_.get(tourConfig, 'auto_launch')) {
        // Check if this is the first time this user has visited the home page, if so launch the tour
        var viewedHomePageKey = "openshift/viewedHomePage/" + $rootScope.user.metadata.name;
        if (localStorage.getItem(viewedHomePageKey) !== 'true') {
          $timeout(function() {
            localStorage.setItem(viewedHomePageKey, 'true');
            $scope.startGuidedTour();
          }, 500);
        }
      }
    }

    if (tourEnabled) {
      $scope.$on('$locationChangeStart', function(event) {
        if ($location.search().startTour) {
          $scope.startGuidedTour();

          // Prevent the URL change in the location bar
          event.preventDefault();
        }
      });
    }
  });
