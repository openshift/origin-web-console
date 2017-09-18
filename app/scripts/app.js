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
  .config(function ($routeProvider) {

    var ROUTES = _.get(window, 'OPENSHIFT_CONSTANTS.ROUTES');
    var TECH_PREVIEW_ROUTES = _.get(window, 'OPENSHIFT_CONSTANTS.TECH_PREVIEW_ROUTES');
    var TECH_PREVIEW = _.get(window, 'OPENSHIFT_CONSTANTS.ENABLE_TECH_PREVIEW_FEATURE');

    _.each(ROUTES, function(route, path) {
      console.log(path, route);
      $routeProvider.when(path, route);
    });

    if (TECH_PREVIEW_ROUTES) {
      _.each(TECH_PREVIEW_ROUTES, function(techPreviewRouteSet, techPreviewRouteSetKey) {
        if(_.get(TECH_PREVIEW, techPreviewRouteSetKey)) {
          _.each(techPreviewRouteSet, function(techPreviewRoute, techPreviewRoutePath) {
              $routeProvider.when(techPreviewRoutePath, techPreviewRoute);
          });
        }
      });
    }

    $routeProvider.otherwise({
      redirectTo: '/'
    });

  })
  .constant("LOGGING_URL", _.get(window.OPENSHIFT_CONFIG, "loggingURL"))
  .constant("METRICS_URL", _.get(window.OPENSHIFT_CONFIG, "metricsURL"))
  .constant("LIMIT_REQUEST_OVERRIDES", _.get(window.OPENSHIFT_CONFIG, "limitRequestOverrides"))
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
  .run(function(durationFilter, timeOnlyDurationFromTimestampsFilter) {
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
  .run(function($rootScope){
    // if the service catalog landing page is enabled,
    // set global variable for use in views
    // and add class to body
    if (_.get(window, 'OPENSHIFT_CONSTANTS.ENABLE_TECH_PREVIEW_FEATURE.service_catalog_landing_page')) {
      $rootScope.globalTechPreviewIndicator = true;
      $('body').addClass('tech-preview');
    }
  });

hawtioPluginLoader.addModule('openshiftConsole');
