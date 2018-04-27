'use strict';
/* jshint unused: false */

/**
 * @ngdoc overview
 * @name openshiftConsole
 * @description
 * # openshiftConsole
 *
 * Main module of the application.
 */
angular
  .module('openshiftConsole', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'kubernetesUI',
    'registryUI.images',
    'ui.bootstrap',
    'patternfly.charts',
    'patternfly.navigation',
    'patternfly.sort',
    'patternfly.notification',
    'openshiftConsoleTemplates',
    'ui.ace',
    'extension-registry',
    'as.sortable',
    'ui.select',
    'angular-inview',
    'angularMoment',
    'ab-base64',
    'openshiftCommonServices',
    'openshiftCommonUI',
    'webCatalog'
  ])
  .config(function ($routeProvider, $uibModalProvider, HomePagePreferenceServiceProvider) {
    var landingPageRoute;
    var projectsPageRoute = {
      templateUrl: 'views/projects.html',
      controller: 'ProjectsController'
    };
    if (_.get(window, 'OPENSHIFT_CONSTANTS.DISABLE_SERVICE_CATALOG_LANDING_PAGE')) {
      landingPageRoute = projectsPageRoute;
    } else {
      landingPageRoute = {
        templateUrl: 'views/landing-page.html',
        controller: 'LandingPageController',
        reloadOnSearch: false
      };
    }
    $routeProvider.when('/projects', projectsPageRoute);
    $routeProvider
      .when('/', {
        redirectTo: function() {
          return HomePagePreferenceServiceProvider.$get().getHomePagePath();
        }
      })
      .when('/catalog', landingPageRoute)
      .when('/create-project', {
        templateUrl: 'views/create-project.html',
        controller: 'CreateProjectController'
      })
      .when('/project/:project/catalog', {
        templateUrl: 'views/project-browse-catalog.html',
        controller: 'ProjectBrowseCatalogController'
      })
      .when('/project/:project', {
        redirectTo: function(params) {
          return '/project/' + encodeURIComponent(params.project) + "/overview";
        }
      })
      .when('/project/:project/overview', {
        templateUrl: 'views/overview.html',
        controller: 'OverviewController',
        controllerAs: 'overview',
        reloadOnSearch: false
      })
      .when('/project/:project/quota', {
        templateUrl: 'views/quota.html',
        controller: 'QuotaController'
      })
      .when('/project/:project/monitoring', {
        templateUrl: 'views/monitoring.html',
        controller: 'MonitoringController',
        reloadOnSearch: false
      })
      .when('/project/:project/membership', {
        templateUrl: 'views/membership.html',
        controller: 'MembershipController',
        reloadOnSearch: false
      })
      .when('/project/:project/browse', {
        redirectTo: function(params) {
          return '/project/' + encodeURIComponent(params.project) + "/browse/pods";  // TODO decide what subtab to default to here
        }
      })
      .when('/project/:project/browse/builds', {
        templateUrl: 'views/builds.html',
        controller: 'BuildsController',
        reloadOnSearch: false
      })
      .when('/project/:project/browse/pipelines', {
        templateUrl: 'views/pipelines.html',
        controller: 'PipelinesController'
      })
      .when('/project/:project/browse/builds/:buildconfig', {
        templateUrl: 'views/browse/build-config.html',
        controller: 'BuildConfigController',
        reloadOnSearch: false
      })
      .when('/project/:project/browse/pipelines/:buildconfig', {
        templateUrl: 'views/browse/build-config.html',
        controller: 'BuildConfigController',
        resolve: {
          isPipeline: function ($route) {
            $route.current.params.isPipeline = true;
          }
        },
        reloadOnSearch: false
      })
      .when('/project/:project/edit/yaml', {
        templateUrl: 'views/edit/yaml.html',
        controller: 'EditYAMLController'
      })
      .when('/project/:project/edit/builds/:buildconfig', {
        templateUrl: 'views/edit/build-config.html',
        controller: 'EditBuildConfigController'
      })
      .when('/project/:project/edit/pipelines/:buildconfig', {
        templateUrl: 'views/edit/build-config.html',
        controller: 'EditBuildConfigController',
        resolve: {
          isPipeline: function ($route) {
            $route.current.params.isPipeline = true;
          }
        },
        reloadOnSearch: false
      })
      .when('/project/:project/browse/builds/:buildconfig/:build', {
        templateUrl: function(params) {
          if (params.view === 'chromeless') {
            return 'views/logs/chromeless-build-log.html';
          }

          return 'views/browse/build.html';
        },
        controller: 'BuildController',
        reloadOnSearch: false
      })
      .when('/project/:project/browse/pipelines/:buildconfig/:build', {
        templateUrl: 'views/browse/build.html',
        controller: 'BuildController',
        resolve: {
          isPipeline: function ($route) {
            $route.current.params.isPipeline = true;
          }
        },
        reloadOnSearch: false
      })
      // For when a build is missing a buildconfig label
      // Needs to still be prefixed with browse/builds so the secondary nav active state is correct
      .when('/project/:project/browse/builds-noconfig/:build', {
        templateUrl: 'views/browse/build.html',
        controller: 'BuildController',
        reloadOnSearch: false
      })
      .when('/project/:project/browse/pipelines-noconfig/:build', {
        templateUrl: 'views/browse/build.html',
        controller: 'BuildController',
        resolve: {
          isPipeline: function ($route) {
            $route.current.params.isPipeline = true;
          }
        },
        reloadOnSearch: false
      })
      .when('/project/:project/browse/deployments', {
        templateUrl: 'views/deployments.html',
        controller: 'DeploymentsController',
        reloadOnSearch: false
      })
      // Can't be /deployments/ (plural) because we used that previously for deployment config URLs. See redirect below.
      .when('/project/:project/browse/deployment/:deployment', {
        templateUrl: 'views/browse/deployment.html',
        controller: 'DeploymentController',
        reloadOnSearch: false
      })
      .when('/project/:project/browse/dc/:deploymentconfig', {
        templateUrl: 'views/browse/deployment-config.html',
        controller: 'DeploymentConfigController',
        reloadOnSearch: false
      })
      .when('/project/:project/edit/dc/:deploymentconfig', {
        templateUrl: 'views/edit/deployment-config.html',
        controller: 'EditDeploymentConfigController'
      })
      .when('/project/:project/browse/stateful-sets/', {
        templateUrl: 'views/browse/stateful-sets.html',
        controller: 'StatefulSetsController',
        reloadOnSearch: false
      })
      .when('/project/:project/browse/stateful-sets/:statefulset', {
        templateUrl: 'views/browse/stateful-set.html',
        controller: 'StatefulSetController',
        reloadOnSearch: false
      })
      .when('/project/:project/browse/rs/:replicaSet', {
        templateUrl: 'views/browse/replica-set.html',
        resolve: {
          // The ReplicaSetController handles both ReplicaSet and ReplicationController.
          kind: function () {
            return 'ReplicaSet';
          }
        },
        controller: 'ReplicaSetController',
        reloadOnSearch: false
      })
      .when('/project/:project/browse/rc/:replicaSet', {
        templateUrl: function(params) {
          if (params.view === 'chromeless') {
            return 'views/logs/chromeless-deployment-log.html';
          }

          return 'views/browse/replica-set.html';
        },
        resolve: {
          // The ReplicaSetController handles both ReplicaSet and ReplicationController.
          kind: function () {
            return 'ReplicationController';
          }
        },
        controller: 'ReplicaSetController',
        reloadOnSearch: false
      })
      .when('/project/:project/browse/events', {
        templateUrl: 'views/events.html',
        controller: 'EventsController'
      })
      .when('/project/:project/browse/images', {
        templateUrl: 'views/images.html',
        controller: 'ImagesController',
        reloadOnSearch: false
      })
      .when('/project/:project/browse/images/:imagestream', {
        templateUrl: 'views/browse/imagestream.html',
        controller: 'ImageStreamController'
      })
      .when('/project/:project/browse/images/:imagestream/:tag', {
        templateUrl: 'views/browse/image.html',
        controller: 'ImageController',
        reloadOnSearch: false
      })
      .when('/project/:project/browse/pods', {
        templateUrl: 'views/pods.html',
        controller: 'PodsController',
        reloadOnSearch: false
      })
      .when('/project/:project/browse/pods/:pod', {
        templateUrl: function(params) {
          if (params.view === 'chromeless') {
            return 'views/logs/chromeless-pod-log.html';
          }

          return 'views/browse/pod.html';
        },
        controller: 'PodController',
        reloadOnSearch: false
      })
      .when('/project/:project/browse/virtual-machines', {
        templateUrl: 'views/virtual-machines.html',
        controller: 'VirtualMachinesController',
        reloadOnSearch: false
      })
      .when('/project/:project/browse/virtual-machines/:vm', {
        templateUrl: 'views/browse/virtual-machine.html',
        controller: 'VirtualMachineController',
        reloadOnSearch: false
      })
      .when('/project/:project/browse/offline-virtual-machines', {
        templateUrl: 'views/offline-virtual-machines.html',
        controller: 'OfflineVirtualMachinesController',
        reloadOnSearch: false
      })
      .when('/project/:project/browse/offline-virtual-machines/:vm', {
        templateUrl: 'views/browse/offline-virtual-machine.html',
        controller: 'OfflineVirtualMachineController',
        reloadOnSearch: false
      })
      .when('/project/:project/browse/services', {
        templateUrl: 'views/services.html',
        controller: 'ServicesController',
        reloadOnSearch: false
      })
      .when('/project/:project/browse/services/:service', {
        templateUrl: 'views/browse/service.html',
        controller: 'ServiceController',
        reloadOnSearch: false
      })
      .when('/project/:project/browse/service-instances', {
        templateUrl: 'views/service-instances.html',
        controller: 'ServiceInstancesController',
        reloadOnSearch: false
      })
      .when('/project/:project/browse/service-instances/:instance', {
        templateUrl: 'views/browse/service-instance.html',
        controller: 'ServiceInstanceController',
        reloadOnSearch: false
      })
      .when('/project/:project/browse/storage', {
        templateUrl: 'views/storage.html',
        controller: 'StorageController',
        reloadOnSearch: false
      })
      .when('/project/:project/browse/secrets/:secret', {
        templateUrl: 'views/browse/secret.html',
        controller: 'SecretController',
        reloadOnSearch: false
      })
      .when('/project/:project/browse/secrets', {
        templateUrl: 'views/secrets.html',
        controller: 'SecretsController',
        reloadOnSearch: false
      })
      .when('/project/:project/create-secret', {
        templateUrl: 'views/create-secret.html',
        controller: 'CreateSecretController'
      })
      .when('/project/:project/browse/config-maps', {
        templateUrl: 'views/browse/config-maps.html',
        controller: 'ConfigMapsController',
        reloadOnSearch: false
      })
      .when('/project/:project/browse/config-maps/:configMap', {
        templateUrl: 'views/browse/config-map.html',
        controller: 'ConfigMapController'
      })
      .when('/project/:project/create-config-map', {
        templateUrl: 'views/create-config-map.html',
        controller: 'CreateConfigMapController'
      })
      .when('/project/:project/edit/config-maps/:configMap', {
        templateUrl: 'views/edit/config-map.html',
        controller: 'EditConfigMapController'
      })
      .when('/project/:project/browse/other', {
        templateUrl: 'views/other-resources.html',
        controller: 'OtherResourcesController',
        reloadOnSearch: false
      })
      .when('/project/:project/browse/persistentvolumeclaims/:pvc', {
        templateUrl: 'views/browse/persistent-volume-claim.html',
        controller: 'PersistentVolumeClaimController'
      })
      .when('/project/:project/browse/routes', {
        templateUrl: 'views/browse/routes.html',
        controller: 'RoutesController',
        reloadOnSearch: false
      })
      .when('/project/:project/edit/routes/:route', {
        templateUrl: 'views/edit/route.html',
        controller: 'EditRouteController'
      })
      .when('/project/:project/browse/routes/:route', {
        templateUrl: 'views/browse/route.html',
        controller: 'RouteController'
      })
      .when('/project/:project/create-route', {
        templateUrl: 'views/create-route.html',
        controller: 'CreateRouteController'
      })
      .when('/project/:project/edit', {
        templateUrl: 'views/edit/project.html',
        controller: 'EditProjectController'
      })
      .when('/project/:project/create-pvc', {
        templateUrl: 'views/create-persistent-volume-claim.html',
        controller: 'CreatePersistentVolumeClaimController'
      })
      .when('/project/:project/attach-pvc', {
        templateUrl: 'views/attach-pvc.html',
        controller: 'AttachPVCController'
      })
      .when('/project/:project/add-config-volume', {
        templateUrl: 'views/add-config-volume.html',
        controller: 'AddConfigVolumeController'
      })
      .when('/project/:project/create', {
        templateUrl: 'views/create.html',
        controller: 'CreateController',
        reloadOnSearch: false
      })
      .when('/project/:project/create/category/:category', {
        templateUrl: 'views/create/category.html',
        controller: 'BrowseCategoryController'
      })
      .when('/project/:project/create/category/:category/:subcategory', {
        templateUrl: 'views/create/category.html',
        controller: 'BrowseCategoryController'
      })
      .when('/project/:project/create/fromtemplate', {
        templateUrl: 'views/newfromtemplate.html',
        controller: 'NewFromTemplateController'
      })
      .when('/project/:project/create/fromimage', {
        templateUrl: 'views/create/fromimage.html',
        controller: 'CreateFromImageController'
      })
      .when('/project/:project/create/next', {
        templateUrl: 'views/create/next-steps.html',
        controller: 'NextStepsController'
      })
      .when('/project/:project/set-limits', {
        templateUrl: 'views/set-limits.html',
        controller: 'SetLimitsController'
      })
      .when('/project/:project/edit/autoscaler', {
        templateUrl: 'views/edit/autoscaler.html',
        controller: 'EditAutoscalerController'
      })
      .when('/project/:project/edit/health-checks', {
        templateUrl: 'views/edit/health-checks.html',
        controller: 'EditHealthChecksController'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutController'
      })
      .when('/command-line', {
        templateUrl: 'views/command-line.html',
        controller: 'CommandLineController'
      })
      .when('/oauth', {
        templateUrl: 'views/util/oauth.html',
        controller: 'OAuthController'
      })
      .when('/error', {
        templateUrl: 'views/util/error.html',
        controller: 'ErrorController'
      })
      .when('/logout', {
        templateUrl: 'views/util/logout.html',
        controller: 'LogoutController'
      })
      .when('/create', {
        templateUrl: 'views/create-from-url.html',
        controller: 'CreateFromURLController'
      })
      // legacy redirects
      .when('/createProject', {
        redirectTo: '/create-project'
      })
      .when('/project/:project/createRoute', {
        redirectTo: '/project/:project/create-route'
      })
      .when('/project/:project/attachPVC', {
        redirectTo: '/project/:project/attach-pvc'
      })
      .when('/project/:project/browse/deployments/:deploymentconfig', {
        redirectTo: '/project/:project/browse/dc/:deploymentconfig'
      })
      .when('/project/:project/browse/deployments/:deploymentconfig/:rc', {
        redirectTo: '/project/:project/browse/rc/:rc'
      })
      .when('/project/:project/browse/deployments-replicationcontrollers/:rc', {
        redirectTo: '/project/:project/browse/rc/:rc'
      })
      .otherwise({
        redirectTo: '/'
      });

    $uibModalProvider.options = {
      animation: true,
      backdrop: 'static' // do not allow close of modal by clicking backdrop
    };
  })
  .constant("LOGGING_URL", _.get(window.OPENSHIFT_CONFIG, "loggingURL"))
  .constant("METRICS_URL", _.get(window.OPENSHIFT_CONFIG, "metricsURL"))
  // A (very) basic regex to determine if a URL is an absolute URL, enough to
  // warn the user the Git URL probably won't work. This should only be used
  // as a sanity test and shouldn't block submitting the form. Rely on the API
  // server for any additional validation.
  .constant('SOURCE_URL_PATTERN', /^[a-z][a-z0-9+.-@]*:(\/\/)?[0-9a-z_-]+/i)
  // RELATIVE_PATH_PATTERN matches any paths not starting with `/` or
  // containing `..` as path elements. Use negative lookaheads to assert that
  // the value does not match those patterns.
  //
  //   (?!\/)                do not match strings starting with `/`
  //   (?!\.\.(\/|$))        do not match strings starting with `../` or exactly `..`
  //   (?!.*\/\.\.(\/|$))    do not match strings containing `/../` or ending in `/..`
  .constant('RELATIVE_PATH_PATTERN', /^(?!\/)(?!\.\.(\/|$))(?!.*\/\.\.(\/|$)).*$/)
  // http://stackoverflow.com/questions/5899783/detect-safari-using-jquery
  .constant('IS_SAFARI', /Version\/[\d\.]+.*Safari/.test(navigator.userAgent))
  .constant('amTimeAgoConfig', {
    // Set the title attribute to a localized time format like "September 4 1986 8:30 PM"
    // See http://momentjs.com/docs/#/displaying/format/
    titleFormat: 'LLL'
  })
  .config(function(kubernetesContainerSocketProvider) {
    // Configure the container terminal
    kubernetesContainerSocketProvider.WebSocketFactory = "ContainerWebSocket";
  })
  .config(function($compileProvider){
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|mailto|git):/i);
  })
  .run(function($rootScope, LabelFilter){
    // assume we always want filterState persisted, pages that dont can turn it off
    LabelFilter.persistFilterState(true);
    $rootScope.$on('$routeChangeSuccess', function() {
      LabelFilter.readPersistedState();
    });
  })
  .run(function($location, $uibModal, AuthService) {
    var INACTIVITY_TIMEOUT_MINUTES = window.OPENSHIFT_CONFIG.inactivityTimeoutMinutes;
    if (!INACTIVITY_TIMEOUT_MINUTES) {
      return;
    }
    var lastInteractionKey = 'origin-web-console-last-interaction-timestamp';
    var inactivityLogoutKey = 'origin-web-console-inactivity-logout';
    var isLocalLogoutModalShown = false;
    var checkInteractionInterval;
    var modalInstance;
    // Interval that will check for user inactivity every minute.
    // In case the last interaction is higher than INACTIVITY_TIMEOUT_MINUTES a logout modal will be shown.
    // Also check for 'origin-web-console-inactivity-logout' object in the local storage, that indicates that the
    // user has been already logged out, in case of multiple opened console tabs.
    var startInteractionIntervalCheck = function () {
      checkInteractionInterval = setInterval(function(){
        if (!AuthService.isLoggedIn()) {
          return;
        }
        var lastInteraction = Date.parse(localStorage.getItem(lastInteractionKey));
        if (isNaN(lastInteraction)) {
          Logger.warn("Last interaction timestamp has been corrupted. The logout timeout will be restarted.");
          lastInteraction = new Date();
        }
        var currentTime = new Date();
        // Since the INACTIVITY_TIMEOUT_MINUTES is set in minutes it needs to be converted into milliseconds.
        if (currentTime - lastInteraction > INACTIVITY_TIMEOUT_MINUTES * 60000) {
          showLogoutModal();
        }
      }, 60000);
    };

    // In case of multiple opened tabs the interval needs to be restarted everytime there is any activity in any tab,
    // so all intervals are synced, and they start the counting at the same time.
    var restartCheckInteractionInterval = function() {
      // Handles cases of user activity during the opened modal, where user clicks inside the modal but not on the buttons.
      if (modalInstance) {
        modalInstance.dismiss("User activity");
        modalInstance = null;
      }
      clearInterval(checkInteractionInterval);
      startInteractionIntervalCheck();
    };
    // Updates lastInteraction date and restarts interval
    // restartCheckInteractionInterval() has to be called, cause because the listener on the `storage` event
    // is not fired in the tab where the event happened.
    var updateLastInteraction = function() {
      restartCheckInteractionInterval();
      localStorage.setItem(lastInteractionKey, new Date().toString());
    };
    // Updates Local Storage variable that indicates if all opened tabs should log out current user.
    var logoutAllTabs = function(bool) {
      localStorage.setItem(inactivityLogoutKey, bool.toString());
    };
    // Logout with passing reason.
    var logout = function() {
      var logoutURI = URI.expand("/logout{?cause*}", {
        cause: 'timeout'
      });
      $location.url(logoutURI.toString());
    };
    // Show inactivity logout modal.
    // Before the the modal is shown the handler for checking the changes in local storage is detached.
    // After the the modal is closed or dismissed the handler will be attached again. This is because of
    // the fact that the handler is attached
    function showLogoutModal() {
      if (isLocalLogoutModalShown) {
        return false;
      }
      isLocalLogoutModalShown = true;
      modalInstance = $uibModal.open({
        templateUrl: 'views/modals/logout.html',
        controller: 'LogoutModalController',
        backdrop: true
      });
      modalInstance.result.then(function(event) {
        if (event === 'logout') {
          logoutAllTabs(true);
          logout();
        } else if (event === 'cancel') {
          // In case of multiple tabs, when the logoutModal would be canceled, the timer has to be restarted.
          updateLastInteraction();
          isLocalLogoutModalShown = false;
        }
      }, function () {
        updateLastInteraction();
        isLocalLogoutModalShown = false;
      });
    }

    // Need to check for changes in last interaction so the interval can be restarted.
    $(window).on('storage', function (event) {
      if (event.originalEvent.key === lastInteractionKey) {
        restartCheckInteractionInterval();
      } else if (event.originalEvent.key === inactivityLogoutKey) {
        logout();
      }
    });

    // Reset 'origin-web-console-inactivity-logout' key on login.
    AuthService.onUserChanged(function() {
      logoutAllTabs(false);
    });
    updateLastInteraction();
    // Bind to click and keydown events so the in last interaction timestamp is updated.
    $(document).bind("click keydown", _.throttle(updateLastInteraction, 500));
  })
  .run(function(durationFilter, timeOnlyDurationFromTimestampsFilter, countdownToTimestampFilter) {
    // Use setInterval instead of $interval because we're directly manipulating the DOM and don't want scope.$apply overhead
    setInterval(function() {
      // Set by duration-until-now directive.
      $('.duration[data-timestamp]').text(function(i, existing) {
        var timestamp = $(this).data("timestamp");
        var omitSingle = $(this).data("omit-single");
        var precision = $(this).data("precision");
        var timeOnly  = $(this).data("time-only");
        if (timeOnly) {
          return timeOnlyDurationFromTimestampsFilter(timestamp, null) || existing;
        }
        else {
          return durationFilter(timestamp, null, omitSingle, precision) || existing;
        }
      });
      $('.countdown[data-timestamp]').text(function(i, existing) {
        var endTimestamp = $(this).data("timestamp");
        return countdownToTimestampFilter(endTimestamp);
      });
    }, 1000);
  })
  .run(function(IS_IOS) {
    if (IS_IOS) {
      // Add a class for iOS devices. This lets us disable some hover effects
      // since iOS will treat the first tap as a hover if it changes the DOM
      // content (e.g. using :before pseudo-elements).
      $('body').addClass('ios');
    }
  })
  .run(function ($rootScope, APIService) {
    $rootScope.AEROGEAR_MOBILE_ENABLED = !!APIService.apiInfo({ resource: "mobileclients", group: "mobile.k8s.io" });
    if ($rootScope.AEROGEAR_MOBILE_ENABLED) {
      // Add 'Mobile' category and sub-categories to the Service Catalog UI
      window.OPENSHIFT_CONSTANTS.SERVICE_CATALOG_CATEGORIES.push(
        {
          id: 'mobile',
          label: 'Mobile',
          subCategories: [
            {
              id: 'apps',
              label: 'Apps',
              tags: ['mobile'],
              icon: 'fa fa-mobile'
            },
            {
              id: 'services',
              label: 'Services',
              tags: ['mobile-service'],
              icon: 'fa fa-database'
            }]
        });
    }
    Logger.info("AEROGEAR_MOBILE_ENABLED: " + $rootScope.AEROGEAR_MOBILE_ENABLED);
  })
  .run(['$rootScope', 'APIService', 'KubevirtVersions',
    function ($rootScope, APIService, KubevirtVersions) {
    $rootScope.KUBEVIRT_ENABLED = !!APIService.apiInfo(KubevirtVersions.offlineVirtualMachine);
    if ($rootScope.KUBEVIRT_ENABLED) {
      // add "Applications" > "Virtual Machines" navigation item
      var applicationNavigationItems = _(window.OPENSHIFT_CONSTANTS.PROJECT_NAVIGATION)
        .filter({ label: "Applications"})
        .map('secondaryNavSections[0].items')
        .first();
      if (applicationNavigationItems) {
        var insertionIndex = _.findIndex(applicationNavigationItems, { label: "Pods" });
        if (insertionIndex !== -1) {
          insertionIndex += 1;
          var vmNavigationItem = {
            label: "Virtual Machines",
            href: "/browse/virtual-machines",
            prefixes: [
              "/browse/virtual-machines/"
            ]
          };
          var ovmNavigationItem = {
            label: "Offline Virtual Machines",
            href: "/browse/offline-virtual-machines",
            prefixes: [
              "/browse/offline-virtual-machines/"
            ]
          };
          applicationNavigationItems.splice(insertionIndex, 0, vmNavigationItem, ovmNavigationItem);
        }
      }
    }
  }]);

pluginLoader.addModule('openshiftConsole');
