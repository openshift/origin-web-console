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
    'openshiftUI',
    'kubernetesUI',
    'registryUI.images',
    'ui.bootstrap',
    'patternfly.charts',
    'patternfly.sort',
    'openshiftConsoleTemplates',
    'ui.ace',
    'extension-registry',
    'as.sortable',
    'ui.select',
    'key-value-editor',
    'angular-inview'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/projects.html',
        controller: 'ProjectsController'
      })
      .when('/create-project', {
        templateUrl: 'views/create-project.html',
        controller: 'CreateProjectController'
      })
      .when('/project/:project', {
        redirectTo: function(params) {
          return '/project/' + encodeURIComponent(params.project) + "/overview";
        }
      })
      .when('/project/:project/overview', {
        templateUrl: 'views/overview.html',
        controller: 'OverviewController'
      })
      // Old overview, keep for now in case of emergency
      // .when('/project/:project/overview', {
      //   templateUrl: 'views/project.html',
      //   controller: 'TopologyController'
      // })
      .when('/project/:project/quota', {
        templateUrl: 'views/quota.html',
        controller: 'QuotaController'
      })
      .when('/project/:project/monitoring', {
        templateUrl: 'views/monitoring.html',
        controller: 'MonitoringController',
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
        }
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
        controller: 'ImagesController'
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
      .when('/project/:project/browse/storage', {
        templateUrl: 'views/storage.html',
        controller: 'StorageController',
        reloadOnSearch: false
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
      .when('/project/:project/create', {
        templateUrl: 'views/create.html',
        controller: 'CreateController',
        reloadOnSearch: false
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
  })
  .constant("API_CFG", _.get(window.OPENSHIFT_CONFIG, "api", {}))
  .constant("APIS_CFG", _.get(window.OPENSHIFT_CONFIG, "apis", {}))
  .constant("AUTH_CFG", _.get(window.OPENSHIFT_CONFIG, "auth", {}))
  .constant("LOGGING_URL", _.get(window.OPENSHIFT_CONFIG, "loggingURL"))
  .constant("METRICS_URL", _.get(window.OPENSHIFT_CONFIG, "metricsURL"))
  .constant("LIMIT_REQUEST_OVERRIDES", _.get(window.OPENSHIFT_CONFIG, "limitRequestOverrides"))
  // Sometimes we need to know the css breakpoints, make sure to update this
  // if they ever change!
  .constant("BREAKPOINTS", {
    screenXsMin:  480,   // screen-xs
    screenSmMin:  768,   // screen-sm
    screenMdMin:  992,   // screen-md
    screenLgMin:  1200,  // screen-lg
    screenXlgMin: 1600   // screen-xlg
  })
  .constant('SOURCE_URL_PATTERN', /^((ftp|http|https|git|ssh):\/\/(\w+:{0,1}[^\s@]*@)|git@)?([^\s@]+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/ )
  // http://stackoverflow.com/questions/9038625/detect-if-device-is-ios
  .constant('IS_IOS', /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream)
  .config(function($httpProvider, AuthServiceProvider, RedirectLoginServiceProvider, AUTH_CFG, API_CFG, kubernetesContainerSocketProvider) {
    $httpProvider.interceptors.push('AuthInterceptor');

    AuthServiceProvider.LoginService('RedirectLoginService');
    AuthServiceProvider.LogoutService('DeleteTokenLogoutService');
    // TODO: fall back to cookie store when localStorage is unavailable (see known issues at http://caniuse.com/#feat=namevalue-storage)
    AuthServiceProvider.UserStore('LocalStorageUserStore');

    RedirectLoginServiceProvider.OAuthClientID(AUTH_CFG.oauth_client_id);
    RedirectLoginServiceProvider.OAuthAuthorizeURI(AUTH_CFG.oauth_authorize_uri);
    RedirectLoginServiceProvider.OAuthRedirectURI(URI(AUTH_CFG.oauth_redirect_base).segment("oauth").toString());

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
  .run(function(dateRelativeFilter, durationFilter, timeOnlyDurationFromTimestampsFilter) {
    // Use setInterval instead of $interval because we're directly manipulating the DOM and don't want scope.$apply overhead
    setInterval(function() {
      // Set by relative-timestamp directive.
      $('.timestamp[data-timestamp]').text(function(i, existing) {
        return dateRelativeFilter($(this).attr("data-timestamp"), $(this).attr("data-drop-suffix")) || existing;
      });
    }, 30 * 1000);
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
  });

hawtioPluginLoader.addModule('openshiftConsole');

// API Discovery, this runs before the angular app is bootstrapped
// TODO we want this to be possible with a single request against the API instead of being dependent on the numbers of groups and versions
hawtioPluginLoader.registerPreBootstrapTask(function(next) {
  // Skips api discovery, needed to run spec tests
  if ( _.get(window, "OPENSHIFT_CONFIG.api.k8s.resources") ) {
    next();
    return;
  }

  var api = {
    k8s: {},
    openshift: {}
  };
  var apis = {};
  var API_DISCOVERY_ERRORS = [];
  var protocol = window.location.protocol + "//";

  // Fetch /api/v1 for legacy k8s resources, we will never bump the version of these legacy apis so fetch version immediately
  var k8sBaseURL = protocol + window.OPENSHIFT_CONFIG.api.k8s.hostPort + window.OPENSHIFT_CONFIG.api.k8s.prefix;
  var k8sDeferred = $.get(k8sBaseURL + "/v1")
  .done(function(data) {
    api.k8s.v1 = _.indexBy(data.resources, 'name');
  })
  .fail(function(data, textStatus, jqXHR) {
    API_DISCOVERY_ERRORS.push({
      data: data,
      textStatus: textStatus,
      xhr: jqXHR
    });
  });

  // Fetch /oapi/v1 for legacy openshift resources, we will never bump the version of these legacy apis so fetch version immediately
  var osBaseURL = protocol + window.OPENSHIFT_CONFIG.api.openshift.hostPort + window.OPENSHIFT_CONFIG.api.openshift.prefix;
  var osDeferred = $.get(osBaseURL + "/v1")
  .done(function(data) {
    api.openshift.v1 = _.indexBy(data.resources, 'name');
  })
  .fail(function(data, textStatus, jqXHR) {
    API_DISCOVERY_ERRORS.push({
      data: data,
      textStatus: textStatus,
      xhr: jqXHR
    });
  });

  // Fetch /apis to get the list of groups and versions, then fetch each group/
  // Because the api discovery doc returns arrays and we want maps, this creates a structure like:
  // {
  //   extensions: {
  //     name: "extensions",
  //     preferredVersion: "v1beta1",
  //     versions: {
  //       v1beta1: {
  //         version: "v1beta1",
  //         groupVersion: "extensions/v1beta1"
  //         resources: {
  //           daemonsets: {
  //             /* resource returned from discovery API */
  //           }
  //         }
  //       }
  //     }
  //   }
  // }
  var apisBaseURL = protocol + window.OPENSHIFT_CONFIG.apis.hostPort + window.OPENSHIFT_CONFIG.apis.prefix;
  var apisDeferred = $.get(apisBaseURL)
  .then(function(data) {
    var apisDeferredVersions = [];
    _.each(data.groups, function(apiGroup) {
      var group = {
        name: apiGroup.name,
        preferredVersion: apiGroup.preferredVersion.version,
        versions: {}
      };
      apis[group.name] = group;
      _.each(apiGroup.versions, function(apiVersion) {
        var versionStr = apiVersion.version;
        group.versions[versionStr] = {
          version: versionStr,
          groupVersion: apiVersion.groupVersion
        };
        apisDeferredVersions.push($.get(apisBaseURL + "/" + apiVersion.groupVersion)
        .done(function(data) {
          group.versions[versionStr].resources = _.indexBy(data.resources, 'name');
        })
        .fail(function(data, textStatus, jqXHR) {
          API_DISCOVERY_ERRORS.push({
            data: data,
            textStatus: textStatus,
            xhr: jqXHR
          });
        }));
      });
    });
    return $.when.apply(this, apisDeferredVersions);
  }, function(data, textStatus, jqXHR) {
    API_DISCOVERY_ERRORS.push({
      data: data,
      textStatus: textStatus,
      xhr: jqXHR
    });
  });

  // Will be called on success or failure
  var discoveryFinished = function() {
    window.OPENSHIFT_CONFIG.api.k8s.resources = api.k8s;
    window.OPENSHIFT_CONFIG.api.openshift.resources = api.openshift;
    window.OPENSHIFT_CONFIG.apis.groups = apis;
    if (API_DISCOVERY_ERRORS.length) {
      window.OPENSHIFT_CONFIG.apis.API_DISCOVERY_ERRORS = API_DISCOVERY_ERRORS;
    }
    next();
  };
  $.when(k8sDeferred,osDeferred,apisDeferred).always(discoveryFinished);
});
