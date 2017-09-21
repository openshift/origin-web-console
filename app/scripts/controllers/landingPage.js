'use strict';

angular.module('openshiftConsole')
  .controller('LandingPageController',
              function($scope,
                       $rootScope,
                       AuthService,
                       Catalog,
                       Constants,
                       DataService,
                       Navigate,
                       NotificationsService,
                       RecentlyViewedServiceItems,
                       GuidedTourService,
                       HTMLService,
                       $timeout,
                       $q,
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
        if (HTMLService.isWindowBelowBreakpoint(HTMLService.WINDOW_SIZE_SM)) {
          return false;
        }

        GuidedTourService.startTour(tourConfig.steps);
        return true;
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

    var isPartialObject = function(apiObject) {
      return apiObject.kind === 'PartialObjectMetadata';
    };

    var loadCompleteTemplate = function(template) {
      if (isPartialObject(template)) {
        return DataService.get("templates", template.metadata.name, { namespace: template.metadata.namespace });
      }

      return $q.when(template);
    };

    $scope.templateSelected = function(selectedTemplate) {
      // `selectedTemplate` might be a parial object (metadata only). If necessary, load the complete template object.
      loadCompleteTemplate(selectedTemplate).then(function(template) {
        _.set($scope, 'ordering.panelName', 'template');
        $scope.template = template;
      });
    };

    $scope.closeOrderingPanel = function() {
      if ($scope.template) {
        addTemplateToRecentlyViewed();
        $scope.template = null;
      }

      _.set($scope, 'ordering.panelName', '');
    };

    $scope.deployImageSelected = function() {
      _.set($scope, 'ordering.panelName', 'deployImage');
    };

    $scope.fromFileSelected = function() {
      _.set($scope, 'ordering.panelName', 'fromFile');
    };

    $scope.fromProjectSelected = function() {
      _.set($scope, 'ordering.panelName', 'fromProject');
    };

    AuthService.withUser().then(function() {
      var includeTemplates = !_.get(Constants, 'ENABLE_TECH_PREVIEW_FEATURE.template_service_broker');
      Catalog.getCatalogItems(includeTemplates).then(_.spread(function(items, errorMessage) {
        if (errorMessage) {
          var alertData = {
            type: 'error',
            message: errorMessage
          };
          NotificationsService.addNotification(alertData);
        }
        $scope.catalogItems = items;
        dataLoaded();
      }));
    });

    $scope.$on('$destroy', function() {
      // If the template dialog was open when the scope was destroyed, still
      // add the item to recently-viewed. No-op if the dialog is not open.
      addTemplateToRecentlyViewed();
    });

    function dataLoaded() {
      // Check for a service class param to launch the catalog flow for
      var paramClass = $location.search()['serviceClass'];
      if (paramClass) {
        // Search by class name e.g. cakephp-mysql-persistent
        var paramItem = _.find($scope.catalogItems, {
          resource: {
            metadata: {
              name: paramClass
            }
          }
        });
        // If a catalog item matches, lauch the catalog flow
        if (paramItem) {
          $scope.$broadcast('open-overlay-panel', paramItem);
          return;
        }
      }

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
            if ($scope.startGuidedTour()) {
              localStorage.setItem(viewedHomePageKey, 'true');
            }
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
