"use strict";

function ResourceGroupVersion(a, b, c) {
return this.resource = a, this.group = b, this.version = c, this;
}

window.OPENSHIFT_CONSTANTS = {
HELP_BASE_URL:"https://docs.openshift.com/container-platform/3.5/",
HELP:{
cli:"cli_reference/index.html",
get_started_cli:"cli_reference/get_started_cli.html",
basic_cli_operations:"cli_reference/basic_cli_operations.html",
"build-triggers":"dev_guide/builds.html#build-triggers",
webhooks:"dev_guide/builds.html#webhook-triggers",
new_app:"dev_guide/application_lifecycle/new_app.html",
"start-build":"dev_guide/builds.html#starting-a-build",
"deployment-operations":"cli_reference/basic_cli_operations.html#build-and-deployment-cli-operations",
"route-types":"architecture/core_concepts/routes.html#route-types",
persistent_volumes:"dev_guide/persistent_volumes.html",
compute_resources:"dev_guide/compute_resources.html",
pod_autoscaling:"dev_guide/pod_autoscaling.html",
application_health:"dev_guide/application_health.html",
source_secrets:"dev_guide/builds.html#using-secrets",
git_secret:"dev_guide/builds.html#source-secrets",
pull_secret:"dev_guide/managing_images.html#using-image-pull-secrets",
managing_secrets:"dev_guide/service_accounts.html#managing-allowed-secrets",
creating_secrets:"dev_guide/secrets.html#creating-and-using-secrets",
storage_classes:"install_config/persistent_storage/dynamically_provisioning_pvs.html",
selector_label:"install_config/persistent_storage/selector_label_binding.html",
rolling_strategy:"dev_guide/deployments/deployment_strategies.html#rolling-strategy",
recreate_strategy:"dev_guide/deployments/deployment_strategies.html#recreate-strategy",
custom_strategy:"dev_guide/deployments/deployment_strategies.html#custom-strategy",
lifecycle_hooks:"dev_guide/deployments/deployment_strategies.html#lifecycle-hooks",
new_pod_exec:"dev_guide/deployments/deployment_strategies.html#pod-based-lifecycle-hook",
authorization:"architecture/additional_concepts/authorization.html",
roles:"architecture/additional_concepts/authorization.html#roles",
service_accounts:"dev_guide/service_accounts.html",
users_and_groups:"architecture/additional_concepts/authentication.html#users-and-groups",
"pipeline-builds":"architecture/core_concepts/builds_and_image_streams.html#pipeline-build",
"pipeline-plugin":"using_images/other_images/jenkins.html#openshift-origin-pipeline-plug-in",
quota:"dev_guide/compute_resources.html",
"config-maps":"dev_guide/configmaps.html",
secrets:"dev_guide/secrets.html",
deployments:"dev_guide/deployments/how_deployments_work.html",
pods:"architecture/core_concepts/pods_and_services.html#pods",
services:"architecture/core_concepts/pods_and_services.html#services",
routes:"architecture/core_concepts/routes.html",
builds:"architecture/core_concepts/builds_and_image_streams.html#builds",
"image-streams":"architecture/core_concepts/builds_and_image_streams.html#image-streams",
storage:"architecture/additional_concepts/storage.html",
"build-hooks":"dev_guide/builds.html#build-hooks",
"default":"welcome/index.html"
},
CLI:{
"Latest Release":"https://access.redhat.com/downloads/content/290"
},
DEFAULT_HPA_CPU_TARGET_PERCENT:80,
DISABLE_OVERVIEW_METRICS:!1,
DISABLE_CUSTOM_METRICS:!1,
DISABLE_WILDCARD_ROUTES:!0,
AVAILABLE_KINDS_BLACKLIST:[ "Binding", "Ingress", "DeploymentConfigRollback" ],
ENABLE_TECH_PREVIEW_FEATURE:{
pipelines:!0
},
SAMPLE_PIPELINE_TEMPLATE:{
name:"jenkins-pipeline-example",
namespace:"openshift"
},
CREATE_FROM_URL_WHITELIST:[ "openshift" ],
PROJECT_NAVIGATION:[ {
label:"Overview",
iconClass:"fa fa-dashboard",
href:"/overview"
}, {
label:"Applications",
iconClass:"fa fa-cubes",
secondaryNavSections:[ {
items:[ {
label:"Deployments",
href:"/browse/deployments",
prefixes:[ "/browse/deployment/", "/browse/dc/", "/browse/rs/", "/browse/rc/" ]
}, {
label:"Stateful Sets",
href:"/browse/stateful-sets",
prefixes:[ "/browse/stateful-sets/" ]
}, {
label:"Pods",
href:"/browse/pods",
prefixes:[ "/browse/pods/" ]
}, {
label:"Services",
href:"/browse/services",
prefixes:[ "/browse/services/" ]
}, {
label:"Routes",
href:"/browse/routes",
prefixes:[ "/browse/routes/" ]
} ]
} ]
}, {
label:"Builds",
iconClass:"pficon pficon-build",
secondaryNavSections:[ {
items:[ {
label:"Builds",
href:"/browse/builds",
prefixes:[ "/browse/builds/", "/browse/builds-noconfig/" ]
}, {
label:"Pipelines",
href:"/browse/pipelines",
prefixes:[ "/browse/pipelines/" ],
isValid:function() {
return !!_.get(window.OPENSHIFT_CONSTANTS, "ENABLE_TECH_PREVIEW_FEATURE.pipelines");
}
}, {
label:"Images",
href:"/browse/images",
prefixes:[ "/browse/images/" ]
} ]
} ]
}, {
label:"Resources",
iconClass:"fa fa-files-o",
secondaryNavSections:[ {
items:[ {
label:"Quota",
href:"/quota"
}, {
label:"Membership",
href:"/membership",
canI:{
resource:"rolebindings",
verb:"list"
}
}, {
label:"Config Maps",
href:"/browse/config-maps",
prefixes:[ "/browse/config-maps/" ]
}, {
label:"Secrets",
href:"/browse/secrets",
prefixes:[ "/browse/secrets/" ],
canI:{
resource:"secrets",
verb:"list"
}
}, {
label:"Other Resources",
href:"/browse/other"
} ]
} ]
}, {
label:"Storage",
iconClass:"pficon pficon-container-node",
href:"/browse/storage",
prefixes:[ "/browse/storage/" ]
}, {
label:"Monitoring",
iconClass:"pficon pficon-screen",
href:"/monitoring",
prefixes:[ "/browse/events" ]
} ],
CATALOG_CATEGORIES:[ {
id:"languages",
label:"Languages",
iconClassDefault:"fa fa-code",
items:[ {
id:"java",
label:"Java",
iconClass:"font-icon icon-openjdk",
subcategories:[ {
id:"java-subcategories",
items:[ {
id:"amq",
label:"Red Hat JBoss A-MQ"
}, {
id:"processserver",
label:"Red Hat JBoss BPM Suite"
}, {
id:"decisionserver",
label:"Red Hat JBoss BRMS"
}, {
id:"datagrid",
label:"Red Hat JBoss Data Grid"
}, {
id:"eap",
label:"Red Hat JBoss EAP"
}, {
id:"jboss-fuse",
label:"Red Hat JBoss Fuse"
}, {
id:"tomcat",
label:"Red Hat JBoss Web Server (Tomcat)"
}, {
id:"sso",
label:"Red Hat Single Sign-On"
}, {
id:"wildfly",
label:"WildFly"
} ]
} ]
}, {
id:"javascript",
categoryAliases:[ "nodejs", "js" ],
label:"JavaScript",
iconClass:"font-icon icon-js"
}, {
id:"dotnet",
label:".NET",
iconClass:"font-icon icon-dotnet"
}, {
id:"perl",
label:"Perl",
iconClass:"font-icon icon-perl"
}, {
id:"php",
label:"PHP",
iconClass:"font-icon icon-php"
}, {
id:"python",
label:"Python",
iconClass:"font-icon icon-python"
}, {
id:"ruby",
label:"Ruby",
iconClass:"font-icon icon-ruby"
}, {
id:"Golang",
categoryAliases:[ "go" ],
label:"Go",
iconClass:"font-icon icon-go-gopher"
} ]
}, {
id:"technologies",
label:"Technologies",
items:[ {
id:"business-process-services",
categoryAliases:[ "decisionserver", "processserver" ],
label:"Business Process Services",
description:"Model, automate, and orchestrate business processes across applications, services, and data."
}, {
id:"ci-cd",
categoryAliases:[ "jenkins" ],
label:"Continuous Integration & Deployment",
description:"Automate the build, test, and deployment of your application with each new code revision."
}, {
id:"datastore",
categoryAliases:[ "database", "datagrid" ],
label:"Data Stores",
description:"Store and manage collections of data."
}, {
id:"messaging",
label:"Messaging",
description:"Facilitate communication between applications and distributed processes with a messaging server."
}, {
id:"integration",
label:"Integration",
description:"Connect with other applications and data to enhance functionality without duplication."
}, {
id:"single-sign-on",
categoryAliases:[ "sso" ],
label:"Single Sign-On",
description:"A centralized authentication server for users to log in, log out, register, and manage user accounts for applications and RESTful web services."
}, {
id:"",
label:"Uncategorized",
description:""
} ]
} ]
}, angular.module("openshiftConsole", [ "ngAnimate", "ngCookies", "ngResource", "ngRoute", "ngSanitize", "openshiftUI", "kubernetesUI", "registryUI.images", "ui.bootstrap", "patternfly.charts", "patternfly.sort", "openshiftConsoleTemplates", "ui.ace", "extension-registry", "as.sortable", "ui.select", "key-value-editor", "angular-inview", "angularMoment", "ab-base64" ]).config([ "$routeProvider", function(a) {
a.when("/", {
templateUrl:"views/projects.html",
controller:"ProjectsController"
}).when("/create-project", {
templateUrl:"views/create-project.html",
controller:"CreateProjectController"
}).when("/project/:project", {
redirectTo:function(a) {
return "/project/" + encodeURIComponent(a.project) + "/overview";
}
}).when("/project/:project/overview", {
templateUrl:"views/overview.html",
controller:"OverviewController"
}).when("/project/:project/quota", {
templateUrl:"views/quota.html",
controller:"QuotaController"
}).when("/project/:project/monitoring", {
templateUrl:"views/monitoring.html",
controller:"MonitoringController",
reloadOnSearch:!1
}).when("/project/:project/membership", {
templateUrl:"views/membership.html",
controller:"MembershipController",
reloadOnSearch:!1
}).when("/project/:project/browse", {
redirectTo:function(a) {
return "/project/" + encodeURIComponent(a.project) + "/browse/pods";
}
}).when("/project/:project/browse/builds", {
templateUrl:"views/builds.html",
controller:"BuildsController",
reloadOnSearch:!1
}).when("/project/:project/browse/pipelines", {
templateUrl:"views/pipelines.html",
controller:"PipelinesController"
}).when("/project/:project/browse/builds/:buildconfig", {
templateUrl:"views/browse/build-config.html",
controller:"BuildConfigController",
reloadOnSearch:!1
}).when("/project/:project/browse/pipelines/:buildconfig", {
templateUrl:"views/browse/build-config.html",
controller:"BuildConfigController",
resolve:{
isPipeline:[ "$route", function(a) {
a.current.params.isPipeline = !0;
} ]
}
}).when("/project/:project/edit/yaml", {
templateUrl:"views/edit/yaml.html",
controller:"EditYAMLController"
}).when("/project/:project/edit/builds/:buildconfig", {
templateUrl:"views/edit/build-config.html",
controller:"EditBuildConfigController"
}).when("/project/:project/edit/pipelines/:buildconfig", {
templateUrl:"views/edit/build-config.html",
controller:"EditBuildConfigController",
resolve:{
isPipeline:[ "$route", function(a) {
a.current.params.isPipeline = !0;
} ]
},
reloadOnSearch:!1
}).when("/project/:project/browse/builds/:buildconfig/:build", {
templateUrl:function(a) {
return "chromeless" === a.view ? "views/logs/chromeless-build-log.html" :"views/browse/build.html";
},
controller:"BuildController",
reloadOnSearch:!1
}).when("/project/:project/browse/pipelines/:buildconfig/:build", {
templateUrl:"views/browse/build.html",
controller:"BuildController",
resolve:{
isPipeline:[ "$route", function(a) {
a.current.params.isPipeline = !0;
} ]
},
reloadOnSearch:!1
}).when("/project/:project/browse/builds-noconfig/:build", {
templateUrl:"views/browse/build.html",
controller:"BuildController",
reloadOnSearch:!1
}).when("/project/:project/browse/pipelines-noconfig/:build", {
templateUrl:"views/browse/build.html",
controller:"BuildController",
resolve:{
isPipeline:[ "$route", function(a) {
a.current.params.isPipeline = !0;
} ]
},
reloadOnSearch:!1
}).when("/project/:project/browse/deployments", {
templateUrl:"views/deployments.html",
controller:"DeploymentsController",
reloadOnSearch:!1
}).when("/project/:project/browse/deployment/:deployment", {
templateUrl:"views/browse/deployment.html",
controller:"DeploymentController",
reloadOnSearch:!1
}).when("/project/:project/browse/dc/:deploymentconfig", {
templateUrl:"views/browse/deployment-config.html",
controller:"DeploymentConfigController",
reloadOnSearch:!1
}).when("/project/:project/edit/dc/:deploymentconfig", {
templateUrl:"views/edit/deployment-config.html",
controller:"EditDeploymentConfigController"
}).when("/project/:project/browse/stateful-sets/", {
templateUrl:"views/browse/stateful-sets.html",
controller:"StatefulSetsController",
reloadOnSearch:!1
}).when("/project/:project/browse/stateful-sets/:statefulset", {
templateUrl:"views/browse/stateful-set.html",
controller:"StatefulSetController",
reloadOnSearch:!1
}).when("/project/:project/browse/rs/:replicaSet", {
templateUrl:"views/browse/replica-set.html",
resolve:{
kind:function() {
return "ReplicaSet";
}
},
controller:"ReplicaSetController",
reloadOnSearch:!1
}).when("/project/:project/browse/rc/:replicaSet", {
templateUrl:function(a) {
return "chromeless" === a.view ? "views/logs/chromeless-deployment-log.html" :"views/browse/replica-set.html";
},
resolve:{
kind:function() {
return "ReplicationController";
}
},
controller:"ReplicaSetController",
reloadOnSearch:!1
}).when("/project/:project/browse/events", {
templateUrl:"views/events.html",
controller:"EventsController"
}).when("/project/:project/browse/images", {
templateUrl:"views/images.html",
controller:"ImagesController",
reloadOnSearch:!1
}).when("/project/:project/browse/images/:imagestream", {
templateUrl:"views/browse/imagestream.html",
controller:"ImageStreamController"
}).when("/project/:project/browse/images/:imagestream/:tag", {
templateUrl:"views/browse/image.html",
controller:"ImageController",
reloadOnSearch:!1
}).when("/project/:project/browse/pods", {
templateUrl:"views/pods.html",
controller:"PodsController",
reloadOnSearch:!1
}).when("/project/:project/browse/pods/:pod", {
templateUrl:function(a) {
return "chromeless" === a.view ? "views/logs/chromeless-pod-log.html" :"views/browse/pod.html";
},
controller:"PodController",
reloadOnSearch:!1
}).when("/project/:project/browse/services", {
templateUrl:"views/services.html",
controller:"ServicesController",
reloadOnSearch:!1
}).when("/project/:project/browse/services/:service", {
templateUrl:"views/browse/service.html",
controller:"ServiceController",
reloadOnSearch:!1
}).when("/project/:project/browse/storage", {
templateUrl:"views/storage.html",
controller:"StorageController",
reloadOnSearch:!1
}).when("/project/:project/browse/secrets/:secret", {
templateUrl:"views/browse/secret.html",
controller:"SecretController",
reloadOnSearch:!1
}).when("/project/:project/browse/secrets", {
templateUrl:"views/secrets.html",
controller:"SecretsController",
reloadOnSearch:!1
}).when("/project/:project/create-secret", {
templateUrl:"views/create-secret.html",
controller:"CreateSecretController"
}).when("/project/:project/browse/config-maps", {
templateUrl:"views/browse/config-maps.html",
controller:"ConfigMapsController",
reloadOnSearch:!1
}).when("/project/:project/browse/config-maps/:configMap", {
templateUrl:"views/browse/config-map.html",
controller:"ConfigMapController"
}).when("/project/:project/create-config-map", {
templateUrl:"views/create-config-map.html",
controller:"CreateConfigMapController"
}).when("/project/:project/edit/config-maps/:configMap", {
templateUrl:"views/edit/config-map.html",
controller:"EditConfigMapController"
}).when("/project/:project/browse/other", {
templateUrl:"views/other-resources.html",
controller:"OtherResourcesController",
reloadOnSearch:!1
}).when("/project/:project/browse/persistentvolumeclaims/:pvc", {
templateUrl:"views/browse/persistent-volume-claim.html",
controller:"PersistentVolumeClaimController"
}).when("/project/:project/browse/routes", {
templateUrl:"views/browse/routes.html",
controller:"RoutesController",
reloadOnSearch:!1
}).when("/project/:project/edit/routes/:route", {
templateUrl:"views/edit/route.html",
controller:"EditRouteController"
}).when("/project/:project/browse/routes/:route", {
templateUrl:"views/browse/route.html",
controller:"RouteController"
}).when("/project/:project/create-route", {
templateUrl:"views/create-route.html",
controller:"CreateRouteController"
}).when("/project/:project/edit", {
templateUrl:"views/edit/project.html",
controller:"EditProjectController"
}).when("/project/:project/create-pvc", {
templateUrl:"views/create-persistent-volume-claim.html",
controller:"CreatePersistentVolumeClaimController"
}).when("/project/:project/attach-pvc", {
templateUrl:"views/attach-pvc.html",
controller:"AttachPVCController"
}).when("/project/:project/add-config-volume", {
templateUrl:"views/add-config-volume.html",
controller:"AddConfigVolumeController"
}).when("/project/:project/create", {
templateUrl:"views/create.html",
controller:"CreateController",
reloadOnSearch:!1
}).when("/project/:project/create/category/:category", {
templateUrl:"views/create/category.html",
controller:"BrowseCategoryController"
}).when("/project/:project/create/category/:category/:subcategory", {
templateUrl:"views/create/category.html",
controller:"BrowseCategoryController"
}).when("/project/:project/create/fromtemplate", {
templateUrl:"views/newfromtemplate.html",
controller:"NewFromTemplateController"
}).when("/project/:project/create/fromimage", {
templateUrl:"views/create/fromimage.html",
controller:"CreateFromImageController"
}).when("/project/:project/create/next", {
templateUrl:"views/create/next-steps.html",
controller:"NextStepsController"
}).when("/project/:project/set-limits", {
templateUrl:"views/set-limits.html",
controller:"SetLimitsController"
}).when("/project/:project/edit/autoscaler", {
templateUrl:"views/edit/autoscaler.html",
controller:"EditAutoscalerController"
}).when("/project/:project/edit/health-checks", {
templateUrl:"views/edit/health-checks.html",
controller:"EditHealthChecksController"
}).when("/about", {
templateUrl:"views/about.html",
controller:"AboutController"
}).when("/command-line", {
templateUrl:"views/command-line.html",
controller:"CommandLineController"
}).when("/oauth", {
templateUrl:"views/util/oauth.html",
controller:"OAuthController"
}).when("/error", {
templateUrl:"views/util/error.html",
controller:"ErrorController"
}).when("/logout", {
templateUrl:"views/util/logout.html",
controller:"LogoutController"
}).when("/create", {
templateUrl:"views/create-from-url.html",
controller:"CreateFromURLController"
}).when("/createProject", {
redirectTo:"/create-project"
}).when("/project/:project/createRoute", {
redirectTo:"/project/:project/create-route"
}).when("/project/:project/attachPVC", {
redirectTo:"/project/:project/attach-pvc"
}).when("/project/:project/browse/deployments/:deploymentconfig", {
redirectTo:"/project/:project/browse/dc/:deploymentconfig"
}).when("/project/:project/browse/deployments/:deploymentconfig/:rc", {
redirectTo:"/project/:project/browse/rc/:rc"
}).when("/project/:project/browse/deployments-replicationcontrollers/:rc", {
redirectTo:"/project/:project/browse/rc/:rc"
}).otherwise({
redirectTo:"/"
});
} ]).constant("API_CFG", _.get(window.OPENSHIFT_CONFIG, "api", {})).constant("APIS_CFG", _.get(window.OPENSHIFT_CONFIG, "apis", {})).constant("AUTH_CFG", _.get(window.OPENSHIFT_CONFIG, "auth", {})).constant("LOGGING_URL", _.get(window.OPENSHIFT_CONFIG, "loggingURL")).constant("METRICS_URL", _.get(window.OPENSHIFT_CONFIG, "metricsURL")).constant("LIMIT_REQUEST_OVERRIDES", _.get(window.OPENSHIFT_CONFIG, "limitRequestOverrides")).constant("BREAKPOINTS", {
screenXsMin:480,
screenSmMin:768,
screenMdMin:992,
screenLgMin:1200,
screenXlgMin:1600
}).constant("DNS1123_SUBDOMAIN_VALIDATION", {
pattern:/^[a-z0-9]([-a-z0-9]*[a-z0-9])?(\.[a-z0-9]([-a-z0-9]*[a-z0-9])?)*$/,
maxlength:253,
description:"Name must consist of lower-case letters, numbers, periods, and hyphens. It must start and end with a letter or a number."
}).constant("SOURCE_URL_PATTERN", /^[a-z][a-z0-9+.-@]*:(\/\/)?[0-9a-z_-]+/i).constant("RELATIVE_PATH_PATTERN", /^(?!\/)(?!\.\.(\/|$))(?!.*\/\.\.(\/|$)).*$/).constant("IS_IOS", /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream).constant("amTimeAgoConfig", {
titleFormat:"LLL"
}).config([ "$httpProvider", "AuthServiceProvider", "RedirectLoginServiceProvider", "AUTH_CFG", "API_CFG", "kubernetesContainerSocketProvider", function(a, b, c, d, e, f) {
a.interceptors.push("AuthInterceptor"), b.LoginService("RedirectLoginService"), b.LogoutService("DeleteTokenLogoutService"), b.UserStore("LocalStorageUserStore"), c.OAuthClientID(d.oauth_client_id), c.OAuthAuthorizeURI(d.oauth_authorize_uri), c.OAuthRedirectURI(URI(d.oauth_redirect_base).segment("oauth").toString()), f.WebSocketFactory = "ContainerWebSocket";
} ]).config([ "$compileProvider", function(a) {
a.aHrefSanitizationWhitelist(/^\s*(https?|mailto|git):/i);
} ]).run([ "$rootScope", "LabelFilter", function(a, b) {
b.persistFilterState(!0), a.$on("$routeChangeSuccess", function() {
b.readPersistedState();
});
} ]).run([ "durationFilter", "timeOnlyDurationFromTimestampsFilter", function(a, b) {
setInterval(function() {
$(".duration[data-timestamp]").text(function(c, d) {
var e = $(this).data("timestamp"), f = $(this).data("omit-single"), g = $(this).data("precision"), h = $(this).data("time-only");
return h ? b(e, null) || d :a(e, null, f, g) || d;
});
}, 1e3);
} ]).run([ "IS_IOS", function(a) {
a && $("body").addClass("ios");
} ]), hawtioPluginLoader.addModule("openshiftConsole"), hawtioPluginLoader.registerPreBootstrapTask(function(a) {
if (_.get(window, "OPENSHIFT_CONFIG.api.k8s.resources")) return void a();
var b = {
k8s:{},
openshift:{}
}, c = {}, d = [], e = window.location.protocol + "//", f = e + window.OPENSHIFT_CONFIG.api.k8s.hostPort + window.OPENSHIFT_CONFIG.api.k8s.prefix, g = $.get(f + "/v1").done(function(a) {
b.k8s.v1 = _.indexBy(a.resources, "name");
}).fail(function(a, b, c) {
d.push({
data:a,
textStatus:b,
xhr:c
});
}), h = e + window.OPENSHIFT_CONFIG.api.openshift.hostPort + window.OPENSHIFT_CONFIG.api.openshift.prefix, i = $.get(h + "/v1").done(function(a) {
b.openshift.v1 = _.indexBy(a.resources, "name");
}).fail(function(a, b, c) {
d.push({
data:a,
textStatus:b,
xhr:c
});
}), j = e + window.OPENSHIFT_CONFIG.apis.hostPort + window.OPENSHIFT_CONFIG.apis.prefix, k = $.get(j).then(function(a) {
var b = [];
return _.each(a.groups, function(a) {
var e = {
name:a.name,
preferredVersion:a.preferredVersion.version,
versions:{}
};
c[e.name] = e, _.each(a.versions, function(a) {
var c = a.version;
e.versions[c] = {
version:c,
groupVersion:a.groupVersion
}, b.push($.get(j + "/" + a.groupVersion).done(function(a) {
e.versions[c].resources = _.indexBy(a.resources, "name");
}).fail(function(a, b, c) {
d.push({
data:a,
textStatus:b,
xhr:c
});
}));
});
}), $.when.apply(this, b);
}, function(a, b, c) {
d.push({
data:a,
textStatus:b,
xhr:c
});
}), l = function() {
window.OPENSHIFT_CONFIG.api.k8s.resources = b.k8s, window.OPENSHIFT_CONFIG.api.openshift.resources = b.openshift, window.OPENSHIFT_CONFIG.apis.groups = c, d.length && (window.OPENSHIFT_CONFIG.apis.API_DISCOVERY_ERRORS = d), a();
};
$.when(g, i, k).always(l);
}), angular.module("openshiftConsole").provider("Logger", function() {
this.$get = function() {
var a = Logger.get("OpenShift"), b = {
get:function(a) {
var b = Logger.get("OpenShift/" + a), c = "OFF";
return localStorage && (c = localStorage["OpenShiftLogLevel." + a] || c), b.setLevel(Logger[c]), b;
},
log:function() {
a.log.apply(a, arguments);
},
info:function() {
a.info.apply(a, arguments);
},
debug:function() {
a.debug.apply(a, arguments);
},
warn:function() {
a.warn.apply(a, arguments);
},
error:function() {
a.error.apply(a, arguments);
}
}, c = "ERROR";
return localStorage && (c = localStorage["OpenShiftLogLevel.main"] || c), a.setLevel(Logger[c]), b;
};
}), angular.module("openshiftConsole").factory("base64util", function() {
return {
pad:function(a) {
if (!a) return "";
switch (a.length % 4) {
case 1:
return a + "===";

case 2:
return a + "==";

case 3:
return a + "=";

default:
return a;
}
}
};
}), angular.module("openshiftConsole").provider("$ws", [ "$httpProvider", function(a) {
this.$get = [ "$q", "$injector", "Logger", function(b, c, d) {
var e = d.get("auth");
e.log("$wsProvider.$get", arguments);
var f = [];
angular.forEach(a.interceptors, function(a) {
angular.isString(a) ? f.unshift(c.get(a)) :f.unshift(c.invoke(a));
});
var g = function(a) {
a.method = angular.uppercase(a.method || "WATCH"), e.log("$ws (pre-intercept)", a.url.toString());
var c = function(a) {
e.log("$ws (post-intercept)", a.url.toString());
var b = new WebSocket(a.url, a.protocols);
return a.onclose && (b.onclose = a.onclose), a.onmessage && (b.onmessage = a.onmessage), a.onopen && (b.onopen = a.onopen), a.onerror && (b.onerror = a.onerror), b;
}, d = [ c, void 0 ], g = b.when(a);
for (angular.forEach(f, function(a) {
(a.request || a.requestError) && d.unshift(a.request, a.requestError);
}); d.length; ) {
var h = d.shift(), i = d.shift();
g = g.then(h, i);
}
return g;
};
return g.available = function() {
try {
return !!WebSocket;
} catch (a) {
return !1;
}
}, g;
} ];
} ]).factory("ContainerWebSocket", [ "API_CFG", "$ws", function(a, b) {
return function(c, d) {
var e;
return 0 === c.indexOf("/") && (e = "http:" === window.location.protocol ? "ws://" :"wss://", c = e + a.openshift.hostPort + c), b({
url:c,
method:"WATCH",
protocols:d,
auth:{}
});
};
} ]), angular.module("openshiftConsole").provider("MemoryUserStore", function() {
this.$get = [ "Logger", function(a) {
var b = a.get("auth"), c = null, d = null;
return {
available:function() {
return !0;
},
getUser:function() {
return b.log("MemoryUserStore.getUser", c), c;
},
setUser:function(a, d) {
b.log("MemoryUserStore.setUser", a), c = a;
},
getToken:function() {
return b.log("MemoryUserStore.getToken", d), d;
},
setToken:function(a, c) {
b.log("MemoryUserStore.setToken", a), d = a;
}
};
} ];
}).provider("SessionStorageUserStore", function() {
this.$get = [ "Logger", function(a) {
var b = a.get("auth"), c = "SessionStorageUserStore.user", d = "SessionStorageUserStore.token";
return {
available:function() {
try {
var a = String(new Date().getTime());
sessionStorage["SessionStorageUserStore.test"] = a;
var b = sessionStorage["SessionStorageUserStore.test"];
return sessionStorage.removeItem("SessionStorageUserStore.test"), a === b;
} catch (c) {
return !1;
}
},
getUser:function() {
try {
var a = JSON.parse(sessionStorage[c]);
return b.log("SessionStorageUserStore.getUser", a), a;
} catch (d) {
return b.error("SessionStorageUserStore.getUser", d), null;
}
},
setUser:function(a, d) {
a ? (b.log("SessionStorageUserStore.setUser", a), sessionStorage[c] = JSON.stringify(a)) :(b.log("SessionStorageUserStore.setUser", a, "deleting"), sessionStorage.removeItem(c));
},
getToken:function() {
try {
var a = sessionStorage[d];
return b.log("SessionStorageUserStore.getToken", a), a;
} catch (c) {
return b.error("SessionStorageUserStore.getToken", c), null;
}
},
setToken:function(a, c) {
a ? (b.log("SessionStorageUserStore.setToken", a), sessionStorage[d] = a) :(b.log("SessionStorageUserStore.setToken", a, "deleting"), sessionStorage.removeItem(d));
}
};
} ];
}).provider("LocalStorageUserStore", function() {
this.$get = [ "Logger", function(a) {
var b = a.get("auth"), c = "LocalStorageUserStore.user", d = "LocalStorageUserStore.token", e = function(a) {
return a + ".ttl";
}, f = function(a, c) {
if (c) {
var d = new Date().getTime() + 1e3 * c;
localStorage[e(a)] = d, b.log("LocalStorageUserStore.setTTL", a, c, new Date(d).toString());
} else localStorage.removeItem(e(a)), b.log("LocalStorageUserStore.setTTL deleting", a);
}, g = function(a) {
var c = localStorage[e(a)];
if (!c) return !1;
var d = parseInt(c) < new Date().getTime();
return b.log("LocalStorageUserStore.isTTLExpired", a, d), d;
};
return {
available:function() {
try {
var a = String(new Date().getTime());
localStorage["LocalStorageUserStore.test"] = a;
var b = localStorage["LocalStorageUserStore.test"];
return localStorage.removeItem("LocalStorageUserStore.test"), a === b;
} catch (c) {
return !1;
}
},
getUser:function() {
try {
if (g(c)) return b.log("LocalStorageUserStore.getUser expired"), localStorage.removeItem(c), f(c, null), null;
var a = JSON.parse(localStorage[c]);
return b.log("LocalStorageUserStore.getUser", a), a;
} catch (d) {
return b.error("LocalStorageUserStore.getUser", d), null;
}
},
setUser:function(a, d) {
a ? (b.log("LocalStorageUserStore.setUser", a, d), localStorage[c] = JSON.stringify(a), f(c, d)) :(b.log("LocalStorageUserStore.setUser", a, "deleting"), localStorage.removeItem(c), f(c, null));
},
getToken:function() {
try {
if (g(d)) return b.log("LocalStorageUserStore.getToken expired"), localStorage.removeItem(d), f(d, null), null;
var a = localStorage[d];
return b.log("LocalStorageUserStore.getToken", a), a;
} catch (c) {
return b.error("LocalStorageUserStore.getToken", c), null;
}
},
setToken:function(a, c) {
a ? (b.log("LocalStorageUserStore.setToken", a, c), localStorage[d] = a, f(d, c)) :(b.log("LocalStorageUserStore.setToken", a, c, "deleting"), localStorage.removeItem(d), f(d, null));
}
};
} ];
}), ResourceGroupVersion.prototype.toString = function() {
var a = this.resource;
return this.group && (a += "/" + this.group), this.version && (a += "/" + this.version), a;
}, ResourceGroupVersion.prototype.primaryResource = function() {
if (!this.resource) return "";
var a = this.resource.indexOf("/");
return a === -1 ? this.resource :this.resource.substring(0, a);
}, ResourceGroupVersion.prototype.subresources = function() {
var a = (this.resource || "").split("/");
return a.shift(), a;
}, ResourceGroupVersion.prototype.equals = function(a, b, c) {
return this.resource === a && (1 === arguments.length || this.group === b && (2 === arguments.length || this.version === c));
}, angular.module("openshiftConsole").factory("APIService", [ "API_CFG", "APIS_CFG", "AuthService", "Constants", "Logger", "$q", "$http", "$filter", "$window", function(a, b, c, d, e, f, g, h, i) {
function j(a) {
if (!a) return a;
var b = a.indexOf("/");
return b === -1 ? a.toLowerCase() :a.substring(0, b).toLowerCase() + a.substring(b);
}
function k(a, b) {
if (!a) return "";
var c = a;
if (b) {
var d = h("humanizeKind");
c = d(c);
}
return c = String(c).toLowerCase(), "endpoints" === c || "securitycontextconstraints" === c || ("s" === c[c.length - 1] ? c += "es" :"y" === c[c.length - 1] ? c = c.substring(0, c.length - 1) + "ies" :c += "s"), c;
}
var l = {
"":"v1",
extensions:"v1beta1"
}, m = function(a) {
if (a instanceof ResourceGroupVersion) return a;
var c, d, e;
return angular.isString(a) ? (c = j(a), d = "", e = l[d]) :a && a.resource && (c = j(a.resource), d = a.group || "", e = a.version || l[d] || _.get(b, [ "groups", d, "preferredVersion" ])), new ResourceGroupVersion(c, d, e);
}, n = function(a) {
if (a) {
var b = a.split("/");
return 1 === b.length ? "v1" === b[0] ? {
group:"",
version:b[0]
} :{
group:b[0],
version:""
} :2 === b.length ? {
group:b[0],
version:b[1]
} :void e.warn('Invalid apiVersion "' + a + '"');
}
}, o = function(a) {
if (a && a.kind && a.apiVersion) {
var b = k(a.kind);
if (b) {
var c = n(a.apiVersion);
if (c) return new ResourceGroupVersion(b, c.group, c.version);
}
}
}, p = function(a, b) {
if (a && b) {
var c = k(b.kind), d = n(b.apiVersion), e = m(a);
if (c && d && e) return angular.isString(a) ? (e.equals(c) && (e.group = d.group, e.version = d.version), e) :(e.equals(c, d.group) && (e.version = d.version), e);
}
}, q = function(d) {
if (b.API_DISCOVERY_ERRORS) {
var e = _.every(b.API_DISCOVERY_ERRORS, function(a) {
return 0 === _.get(a, "data.status");
});
return e && !c.isLoggedIn() ? void c.withUser() :void (i.location.href = URI("error").query({
error_description:"Unable to load details about the server. If the problem continues, please contact your system administrator.",
error:"API_DISCOVERY"
}).toString());
}
d = m(d);
var f = d.primaryResource();
if (d.group) {
if (!_.get(b, [ "groups", d.group, "versions", d.version, "resources", f ])) return;
return {
hostPort:b.hostPort,
prefix:b.prefix,
group:d.group,
version:d.version
};
}
var g;
for (var h in a) if (g = a[h], _.get(g, [ "resources", d.version, f ])) return {
hostPort:g.hostPort,
prefix:g.prefix,
version:d.version
};
}, r = function(a) {
var b = "<none>", c = "<none>";
return a && a.kind && (b = a.kind), a && a.apiVersion && (c = a.apiVersion), "Invalid kind (" + b + ") or API version (" + c + ")";
}, s = function(a) {
var b = "<none>", c = "<none>";
return a && a.kind && (b = a.kind), a && a.apiVersion && (c = a.apiVersion), "The API version " + c + " for kind " + b + " is not supported by this server";
}, t = function(c) {
var e = [], f = d.AVAILABLE_KINDS_BLACKLIST;
return _.each(a, function(a) {
_.each(a.resources.v1, function(a) {
if (a.namespaced || c) {
if (a.name.indexOf("/") >= 0 || _.contains(f, a.kind)) return;
e.push({
kind:a.kind
});
}
});
}), _.each(b.groups, function(a) {
var b = l[a.name] || a.preferredVersion;
_.each(a.versions[b].resources, function(b) {
b.name.indexOf("/") >= 0 || _.contains(f, b.kind) || "autoscaling" === a.name && "HorizontalPodAutoscaler" === b.kind || "batch" === a.name && "Job" === b.kind || (b.namespaced || c) && e.push({
kind:b.kind,
group:a.name
});
});
}), _.uniq(e, !1, function(a) {
return a.group + "/" + a.kind;
});
}, u = t(!1), v = t(!0), w = function(a) {
return a ? v :u;
};
return {
toResourceGroupVersion:m,
parseGroupVersion:n,
objectToResourceGroupVersion:o,
deriveTargetResource:p,
kindToResource:k,
apiInfo:q,
invalidObjectKindOrVersion:r,
unsupportedObjectKindOrVersion:s,
availableKinds:w
};
} ]), angular.module("openshiftConsole").provider("AuthService", function() {
var a = "";
this.UserStore = function(b) {
return b && (a = b), a;
};
var b = "";
this.LoginService = function(a) {
return a && (b = a), b;
};
var c = "";
this.LogoutService = function(a) {
return a && (c = a), c;
};
var d = function(a, b, c) {
if (b) return angular.isString(b) ? a.get(b) :a.invoke(b);
throw c + " not set";
};
this.$get = [ "$q", "$injector", "$log", "$rootScope", "Logger", function(e, f, g, h, i) {
var j = i.get("auth");
j.log("AuthServiceProvider.$get", arguments);
var k = $.Callbacks(), l = $.Callbacks(), m = $.Callbacks(), n = null, o = null, p = d(f, a, "AuthServiceProvider.UserStore()");
p.available() || i.error("AuthServiceProvider.$get user store " + a + " not available");
var q = d(f, b, "AuthServiceProvider.LoginService()"), r = d(f, c, "AuthServiceProvider.LogoutService()");
return {
UserStore:function() {
return p;
},
isLoggedIn:function() {
return !!p.getUser();
},
withUser:function() {
var a = p.getUser();
return a ? (h.user = a, j.log("AuthService.withUser()", a), e.when(a)) :(j.log("AuthService.withUser(), calling startLogin()"), this.startLogin());
},
setUser:function(a, b, c) {
j.log("AuthService.setUser()", a, b, c);
var d = p.getUser();
p.setUser(a, c), p.setToken(b, c), h.user = a;
var e = d && d.metadata && d.metadata.name, f = a && a.metadata && a.metadata.name;
e !== f && (j.log("AuthService.setUser(), user changed", d, a), m.fire(a));
},
requestRequiresAuth:function(a) {
var b = !!a.auth;
return j.log("AuthService.requestRequiresAuth()", a.url.toString(), b), b;
},
addAuthToRequest:function(a) {
var b = "";
return a && a.auth && a.auth.token ? (b = a.auth.token, j.log("AuthService.addAuthToRequest(), using token from request config", b)) :(b = p.getToken(), j.log("AuthService.addAuthToRequest(), using token from user store", b)), b ? ("WATCH" === a.method ? (a.url = URI(a.url).addQuery({
access_token:b
}).toString(), j.log("AuthService.addAuthToRequest(), added token param", a.url)) :(a.headers.Authorization = "Bearer " + b, j.log("AuthService.addAuthToRequest(), added token header", a.headers.Authorization)), !0) :(j.log("AuthService.addAuthToRequest(), no token available"), !1);
},
startLogin:function() {
if (n) return j.log("Login already in progress"), n;
var a = this;
return n = q.login().then(function(b) {
a.setUser(b.user, b.token, b.ttl), k.fire(b.user);
})["catch"](function(a) {
i.error(a);
})["finally"](function() {
n = null;
});
},
startLogout:function() {
if (o) return j.log("Logout already in progress"), o;
var a = this, b = p.getUser(), c = p.getToken(), d = this.isLoggedIn();
return o = r.logout(b, c).then(function() {
j.log("Logout service success");
})["catch"](function(a) {
j.error("Logout service error", a);
})["finally"](function() {
a.setUser(null, null);
var b = a.isLoggedIn();
d && !b && l.fire(), o = null;
});
},
onLogin:function(a) {
k.add(a);
},
onLogout:function(a) {
l.add(a);
},
onUserChanged:function(a) {
m.add(a);
}
};
} ];
}).factory("AuthInterceptor", [ "$q", "AuthService", function(a, b) {
var c = [];
return {
request:function(d) {
if (!b.requestRequiresAuth(d)) return d;
if (b.addAuthToRequest(d)) return d;
if (d.auth && d.auth.triggerLogin === !1) return d;
var e = a.defer();
return c.push([ e, d, "request" ]), b.startLogin(), e.promise;
},
responseError:function(d) {
var e = d.config.auth || {};
if (!b.requestRequiresAuth(d.config)) return a.reject(d);
if (e.triggerLogin === !1) return a.reject(d);
var f = d.status;
switch (f) {
case 401:
var g = a.defer();
return c.push([ g, d.config, "responseError" ]), b.startLogin(), g.promise;

default:
return a.reject(d);
}
}
};
} ]), angular.module("openshiftConsole").factory("AuthorizationService", [ "$q", "$cacheFactory", "Logger", "$interval", "APIService", "DataService", function(a, b, c, d, e, f) {
var g = null, h = b("rulesCache", {
number:10
}), i = !1, j = [ "localresourceaccessreviews", "localsubjectaccessreviews", "resourceaccessreviews", "selfsubjectrulesreviews", "subjectaccessreviews" ], k = function(a) {
var b = {};
return _.each(a, function(a) {
_.each(a.apiGroups, function(c) {
b[c] || (b[c] = {}), _.each(a.resources, function(d) {
b[c][d] = a.verbs;
});
});
}), b;
}, l = function(a) {
return "projectrequests" !== a && !_.contains(a, "/") && !_.contains(j, a);
}, m = function(a) {
return _.some(a, function(a) {
return _.some(a.resources, function(b) {
return l(b) && !_.isEmpty(_.intersection(a.verbs, [ "*", "create", "update" ]));
});
});
}, n = function(b, d) {
var j = a.defer();
g = b;
var l = h.get(b), n = "selfsubjectrulesreviews";
if (!l || l.forceRefresh || d) if (e.apiInfo(n)) {
c.log("AuthorizationService, loading user rules for " + b + " project");
var o = {
kind:"SelfSubjectRulesReview",
apiVersion:"v1"
};
f.create(n, null, o, {
namespace:b
}).then(function(a) {
var c = k(a.status.rules), d = m(a.status.rules);
h.put(b, {
rules:c,
canAddToProject:d,
forceRefresh:!1,
cacheTimestamp:_.now()
}), j.resolve();
}, function() {
i = !0, j.resolve();
});
} else c.log("AuthorizationService, resource 'selfsubjectrulesreviews' is not part of APIserver. Switching into permissive mode."), i = !0, j.resolve(); else c.log("AuthorizationService, using cached rules for " + b + " project"), _.now() - l.cacheTimestamp >= 6e5 && (l.forceRefresh = !0), j.resolve();
return j.promise;
}, o = function(a) {
return _.get(h.get(a || g), [ "rules" ]);
}, p = function(a, b, c, d) {
var e = a[c];
if (!e) return !1;
var f = e[d];
return !!f && (_.contains(f, b) || _.contains(f, "*"));
}, q = function(a, b, c) {
if (i) return !0;
var d = e.toResourceGroupVersion(a), f = o(c || g);
return !!f && (p(f, b, d.group, d.resource) || p(f, b, "*", "*") || p(f, b, d.group, "*") || p(f, b, "*", d.resource));
}, r = function(a) {
return !!i || !!_.get(h.get(a || g), [ "canAddToProject" ]);
};
return {
checkResource:l,
getProjectRules:n,
canI:q,
canIAddToProject:r,
getRulesForProject:o
};
} ]), angular.module("openshiftConsole").factory("DataService", [ "$cacheFactory", "$http", "$ws", "$rootScope", "$q", "API_CFG", "APIService", "Notification", "Logger", "$timeout", "base64", "base64util", function(a, b, c, d, e, f, g, h, i, j, k, l) {
function m(a) {
this._data = {}, this._objectsByAttribute(a, "metadata.name", this._data);
}
function n(a, b, c, d) {
for (var e = b.split("."), f = a, g = 0; g < e.length; g++) if (f = f[e[g]], void 0 === f) return;
if ($.isArray(f)) ; else if ($.isPlainObject(f)) for (var h in f) {
var i = f[h];
c[h] || (c[h] = {}), "DELETED" === d ? delete c[h][i] :c[h][i] = a;
} else "DELETED" === d ? delete c[f] :c[f] = a;
}
function o() {
this._listDeferredMap = {}, this._watchCallbacksMap = {}, this._watchObjectCallbacksMap = {}, this._watchOperationMap = {}, this._listOperationMap = {}, this._resourceVersionMap = {}, this._dataCache = a("dataCache", {
number:25
}), this._immutableDataCache = a("immutableDataCache", {
number:50
}), this._watchOptionsMap = {}, this._watchWebsocketsMap = {}, this._watchPollTimeoutsMap = {}, this._websocketEventsMap = {};
var b = this;
d.$on("$routeChangeStart", function(a, c, d) {
b._websocketEventsMap = {};
});
}
function p(a) {
var b = 3e4;
return a.length >= r && Date.now() - a[0].time < b;
}
function q(a) {
var b = 5;
if (a.length < b) return !1;
for (var c = a.length - b; c < a.length; c++) if ("close" !== a[c].type) return !1;
return !0;
}
m.prototype.by = function(a) {
if ("metadata.name" === a) return this._data;
var b = {};
for (var c in this._data) n(this._data[c], a, b, null);
return b;
}, m.prototype.update = function(a, b) {
n(a, "metadata.name", this._data, b);
}, m.prototype._objectsByAttribute = function(a, b, c, d) {
angular.forEach(a, function(a, e) {
n(a, b, c, d ? d[e] :null);
});
}, o.prototype.list = function(a, b, c, d) {
a = g.toResourceGroupVersion(a);
var e = this._uniqueKey(a, null, b, _.get(d, "http.params")), f = this._listDeferred(e);
return c && f.promise.then(c), this._isCached(e) ? f.resolve(this._data(e)) :this._listInFlight(e) || this._startListOp(a, b, d), f.promise;
}, o.prototype["delete"] = function(a, c, d, f) {
a = g.toResourceGroupVersion(a), f = f || {};
var h, i = e.defer(), j = this, k = {};
return _.has(f, "gracePeriodSeconds") && (h = {
kind:"DeleteOptions",
apiVersion:"v1",
gracePeriodSeconds:f.gracePeriodSeconds
}, k["Content-Type"] = "application/json"), this._getNamespace(a, d, f).then(function(e) {
b(angular.extend({
method:"DELETE",
auth:{},
data:h,
headers:k,
url:j._urlForResource(a, c, d, !1, e)
}, f.http || {})).success(function(a, b, c, d, e) {
i.resolve(a);
}).error(function(a, b, c, d) {
i.reject({
data:a,
status:b,
headers:c,
config:d
});
});
}), i.promise;
}, o.prototype.update = function(a, c, d, f, h) {
a = g.deriveTargetResource(a, d), h = h || {};
var i = e.defer(), j = this;
return this._getNamespace(a, f, h).then(function(e) {
b(angular.extend({
method:"PUT",
auth:{},
data:d,
url:j._urlForResource(a, c, f, !1, e)
}, h.http || {})).success(function(a, b, c, d, e) {
i.resolve(a);
}).error(function(a, b, c, d) {
i.reject({
data:a,
status:b,
headers:c,
config:d
});
});
}), i.promise;
}, o.prototype.create = function(a, c, d, f, h) {
a = g.deriveTargetResource(a, d), h = h || {};
var i = e.defer(), j = this;
return this._getNamespace(a, f, h).then(function(e) {
b(angular.extend({
method:"POST",
auth:{},
data:d,
url:j._urlForResource(a, c, f, !1, e)
}, h.http || {})).success(function(a, b, c, d, e) {
i.resolve(a);
}).error(function(a, b, c, d) {
i.reject({
data:a,
status:b,
headers:c,
config:d
});
});
}), i.promise;
}, o.prototype.batch = function(a, b, c, d) {
function f() {
0 === l && h.resolve({
success:i,
failure:j
});
}
var h = e.defer(), i = [], j = [], k = this, l = a.length;
return c = c || "create", _.each(a, function(a) {
var e = g.objectToResourceGroupVersion(a);
if (!e) return j.push({
object:a,
data:{
message:g.invalidObjectKindOrVersion(a)
}
}), l--, void f();
if (!g.apiInfo(e)) return j.push({
object:a,
data:{
message:g.unsupportedObjectKindOrVersion(a)
}
}), l--, void f();
var m = function(b) {
b.object = a, i.push(b), l--, f();
}, n = function(b) {
b.object = a, j.push(b), l--, f();
};
switch (c) {
case "create":
k.create(e, null, a, b, d).then(m, n);
break;

case "update":
k.update(e, a.metadata.name, a, b, d).then(m, n);
break;

default:
return h.reject({
data:"Invalid '" + c + "'  action.",
status:400,
headers:function() {
return null;
},
config:{},
object:a
});
}
}), h.promise;
}, o.prototype.get = function(a, c, d, f) {
a = g.toResourceGroupVersion(a), f = f || {};
var i = this._uniqueKey(a, c, d, _.get(f, "http.params"));
!!f.force;
delete f.force;
var k = e.defer(), l = this._immutableData(i);
if (this._hasImmutable(a, l, c)) j(function() {
k.resolve(l.by("metadata.name")[c]);
}, 0); else {
var m = this;
this._getNamespace(a, d, f).then(function(e) {
b(angular.extend({
method:"GET",
auth:{},
url:m._urlForResource(a, c, d, !1, e)
}, f.http || {})).success(function(b, c, d, e, f) {
m._isImmutable(a) && (l ? l.update(b, "ADDED") :m._immutableData(i, [ b ])), k.resolve(b);
}).error(function(b, d, e, g) {
if (f.errorNotification !== !1) {
var i = "Failed to get " + a + "/" + c;
0 !== d && (i += " (" + d + ")"), h.error(i);
}
k.reject({
data:b,
status:d,
headers:e,
config:g
});
});
});
}
return k.promise;
}, o.prototype.createStream = function(a, b, d, e, f) {
var h = this;
a = g.toResourceGroupVersion(a);
var j, m = f ? "binary.k8s.io" :"base64.binary.k8s.io", n = "stream_", o = {}, p = {}, q = {}, r = {}, s = function() {
return h._getNamespace(a, d, {}).then(function(g) {
var j = 0;
return c({
url:h._urlForResource(a, b, d, !0, _.extend(g, e)),
auth:{},
onopen:function(a) {
_.each(o, function(b) {
b(a);
});
},
onmessage:function(a) {
if (!_.isString(a.data)) return void i.log("log stream response is not a string", a.data);
var b;
f || (b = k.decode(l.pad(a.data)), j += b.length), _.each(p, function(c) {
f ? c(a.data) :c(b, a.data, j);
});
},
onclose:function(a) {
_.each(q, function(b) {
b(a);
});
},
onerror:function(a) {
_.each(r, function(b) {
b(a);
});
},
protocols:m
}).then(function(a) {
return i.log("Streaming pod log", a), a;
});
});
};
return {
onOpen:function(a) {
if (_.isFunction(a)) {
var b = _.uniqueId(n);
return o[b] = a, b;
}
},
onMessage:function(a) {
if (_.isFunction(a)) {
var b = _.uniqueId(n);
return p[b] = a, b;
}
},
onClose:function(a) {
if (_.isFunction(a)) {
var b = _.uniqueId(n);
return q[b] = a, b;
}
},
onError:function(a) {
if (_.isFunction(a)) {
var b = _.uniqueId(n);
return r[b] = a, b;
}
},
remove:function(a) {
o[a] && delete o[a], p[a] && delete p[a], q[a] && delete q[a], r[a] && delete r[a];
},
start:function() {
return j = s();
},
stop:function() {
j.then(function(a) {
a.close();
});
}
};
}, o.prototype.watch = function(a, b, c, d) {
a = g.toResourceGroupVersion(a), d = d || {};
var e = this._uniqueKey(a, null, b, _.get(d, "http.params"));
if (c) this._watchCallbacks(e).add(c); else if (!this._watchCallbacks(e).has()) return {};
var f = this._watchOptions(e);
if (f) {
if (!!f.poll != !!d.poll) throw "A watch already exists for " + a + " with a different polling option.";
} else this._watchOptions(e, d);
var h = this;
if (this._isCached(e)) c && j(function() {
c(h._data(e));
}, 0); else {
if (c) {
var i = this._resourceVersion(e);
this._data(e) && j(function() {
i === h._resourceVersion(e) && c(h._data(e));
}, 0);
}
this._listInFlight(e) || this._startListOp(a, b, d);
}
return {
resource:a,
context:b,
callback:c,
opts:d
};
}, o.prototype.watchObject = function(a, b, c, d, e) {
a = g.toResourceGroupVersion(a), e = e || {};
var f, h = this._uniqueKey(a, b, c, _.get(e, "http.params"));
if (d) {
this._watchObjectCallbacks(h).add(d);
var i = this;
f = function(a, c, d) {
if (d && d.metadata.name === b) i._watchObjectCallbacks(h).fire(d, c); else if (!d) {
var e = a.by("metadata.name");
e[b] && i._watchObjectCallbacks(h).fire(e[b]);
}
};
} else if (!this._watchObjectCallbacks(h).has()) return {};
var j = this.watch(a, c, f, e);
return j.objectCallback = d, j.objectName = b, j;
}, o.prototype.unwatch = function(a) {
var b = a.resource, c = a.objectName, d = a.context, e = a.callback, f = a.objectCallback, g = a.opts, h = this._uniqueKey(b, null, d, _.get(g, "http.params"));
if (f && c) {
var i = this._uniqueKey(b, c, d, _.get(g, "http.params")), j = this._watchObjectCallbacks(i);
j.remove(f);
}
var k = this._watchCallbacks(h);
if (e && k.remove(e), !k.has()) {
if (g && g.poll) clearTimeout(this._watchPollTimeouts(h)), this._watchPollTimeouts(h, null); else if (this._watchWebsockets(h)) {
var l = this._watchWebsockets(h);
l.shouldClose = !0, l.close(), this._watchWebsockets(h, null);
}
this._watchInFlight(h, !1), this._watchOptions(h, null);
}
}, o.prototype.unwatchAll = function(a) {
for (var b = 0; b < a.length; b++) this.unwatch(a[b]);
}, o.prototype._watchCallbacks = function(a) {
return this._watchCallbacksMap[a] || (this._watchCallbacksMap[a] = $.Callbacks()), this._watchCallbacksMap[a];
}, o.prototype._watchObjectCallbacks = function(a) {
return this._watchObjectCallbacksMap[a] || (this._watchObjectCallbacksMap[a] = $.Callbacks()), this._watchObjectCallbacksMap[a];
}, o.prototype._listDeferred = function(a) {
return this._listDeferredMap[a] || (this._listDeferredMap[a] = e.defer()), this._listDeferredMap[a];
}, o.prototype._watchInFlight = function(a, b) {
return b || b === !1 ? void (this._watchOperationMap[a] = b) :this._watchOperationMap[a];
}, o.prototype._listInFlight = function(a, b) {
return b || b === !1 ? void (this._listOperationMap[a] = b) :this._listOperationMap[a];
}, o.prototype._resourceVersion = function(a, b) {
return b ? void (this._resourceVersionMap[a] = b) :this._resourceVersionMap[a];
}, o.prototype._data = function(a, b) {
return b ? this._dataCache.put(a, new m(b)) :this._dataCache.get(a);
}, o.prototype._immutableData = function(a, b) {
return b ? this._immutableDataCache.put(a, new m(b)) :this._immutableDataCache.get(a);
}, o.prototype._isCached = function(a) {
return this._watchInFlight(a) && this._resourceVersion(a) && !!this._data(a);
}, o.prototype._watchOptions = function(a, b) {
return void 0 === b ? this._watchOptionsMap[a] :void (this._watchOptionsMap[a] = b);
}, o.prototype._watchPollTimeouts = function(a, b) {
return b ? void (this._watchPollTimeoutsMap[a] = b) :this._watchPollTimeoutsMap[a];
}, o.prototype._watchWebsockets = function(a, b) {
return b ? void (this._watchWebsocketsMap[a] = b) :this._watchWebsocketsMap[a];
};
var r = 10;
o.prototype._addWebsocketEvent = function(a, b) {
var c = this._websocketEventsMap[a];
for (c || (c = this._websocketEventsMap[a] = []), c.push({
type:b,
time:Date.now()
}); c.length > r; ) c.shift();
}, o.prototype._isTooManyWebsocketRetries = function(a) {
var b = this._websocketEventsMap[a];
return !!b && (p(b) ? (i.log("Too many websocket open or close events for resource/context in a short period", a, b), !0) :!!q(b) && (i.log("Too many consecutive websocket close events for resource/context", a, b), !0));
};
var s = function(a) {
var b = _.keysIn(_.pick(a, [ "fieldSelector", "labelSelector" ])).sort();
return _.reduce(b, function(c, d, e) {
return c + d + "=" + encodeURIComponent(a[d]) + (e < b.length - 1 ? "&" :"");
}, "?");
};
o.prototype._uniqueKey = function(a, b, c, d) {
var e = c && c.namespace || _.get(c, "project.metadata.name") || c.projectName;
return this._urlForResource(a, b, c, null, angular.extend({}, {}, {
namespace:e
})).toString() + s(d || {});
}, o.prototype._startListOp = function(a, c, d) {
d = d || {};
var e = this._uniqueKey(a, null, c, _.get(d, "http.params"));
this._listInFlight(e, !0);
var f = this;
c.projectPromise && !a.equals("projects") ? c.projectPromise.done(function(g) {
b(angular.extend({
method:"GET",
auth:{},
url:f._urlForResource(a, null, c, !1, {
namespace:g.metadata.name
})
}, d.http || {})).success(function(b, g, h, i, j) {
f._listOpComplete(e, a, c, d, b);
}).error(function(b, c, g, i) {
f._listInFlight(e, !1);
var j = f._listDeferred(e);
if (delete f._listDeferredMap[e], j.reject(b, c, g, i), _.get(d, "errorNotification", !0)) {
var k = "Failed to list " + a;
0 !== c && (k += " (" + c + ")"), h.error(k);
}
});
}) :b({
method:"GET",
auth:{},
url:this._urlForResource(a, null, c)
}).success(function(b, g, h, i, j) {
f._listOpComplete(e, a, c, d, b);
}).error(function(b, c, g, i) {
f._listInFlight(e, !1);
var j = f._listDeferred(e);
if (delete f._listDeferredMap[e], j.reject(b, c, g, i), _.get(d, "errorNotification", !0)) {
var k = "Failed to list " + a;
0 !== c && (k += " (" + c + ")"), h.error(k);
}
});
}, o.prototype._listOpComplete = function(a, b, c, d, e) {
e.items || console.warn("List request for " + b + " returned a null items array.  This is an invalid API response.");
var f = e.items || [];
e.kind && e.kind.indexOf("List") === e.kind.length - 4 && angular.forEach(f, function(a) {
a.kind || (a.kind = e.kind.slice(0, -4)), a.apiVersion || (a.apiVersion = e.apiVersion);
}), this._listInFlight(a, !1);
var g = this._listDeferred(a);
if (delete this._listDeferredMap[a], this._resourceVersion(a, e.resourceVersion || e.metadata.resourceVersion), this._data(a, f), g.resolve(this._data(a)), this._watchCallbacks(a).fire(this._data(a)), this._watchCallbacks(a).has()) {
var h = this._watchOptions(a) || {};
h.poll ? (this._watchInFlight(a, !0), this._watchPollTimeouts(a, setTimeout($.proxy(this, "_startListOp", b, c), h.pollInterval || 5e3))) :this._watchInFlight(a) || this._startWatchOp(a, b, c, d, this._resourceVersion(a));
}
}, o.prototype._startWatchOp = function(a, b, d, e, f) {
if (this._watchInFlight(a, !0), c.available()) {
var g = this, h = _.get(e, "http.params") || {};
h.watch = !0, f && (h.resourceVersion = f), d.projectPromise && !b.equals("projects") ? d.projectPromise.done(function(f) {
h.namespace = f.metadata.name, c({
method:"WATCH",
url:g._urlForResource(b, null, d, !0, h),
auth:{},
onclose:$.proxy(g, "_watchOpOnClose", b, d, e),
onmessage:$.proxy(g, "_watchOpOnMessage", b, d, e),
onopen:$.proxy(g, "_watchOpOnOpen", b, d, e)
}).then(function(b) {
i.log("Watching", b), g._watchWebsockets(a, b);
});
}) :c({
method:"WATCH",
url:g._urlForResource(b, null, d, !0, h),
auth:{},
onclose:$.proxy(g, "_watchOpOnClose", b, d, e),
onmessage:$.proxy(g, "_watchOpOnMessage", b, d, e),
onopen:$.proxy(g, "_watchOpOnOpen", b, d, e)
}).then(function(b) {
i.log("Watching", b), g._watchWebsockets(a, b);
});
}
}, o.prototype._watchOpOnOpen = function(a, b, c, d) {
i.log("Websocket opened for resource/context", a, b);
var e = this._uniqueKey(a, null, b, _.get(c, "http.params"));
this._addWebsocketEvent(e, "open");
}, o.prototype._watchOpOnMessage = function(a, b, c, d) {
var e = this._uniqueKey(a, null, b, _.get(c, "http.params"));
try {
var f = $.parseJSON(d.data);
if ("ERROR" == f.type) return i.log("Watch window expired for resource/context", a, b), void (d.target && (d.target.shouldRelist = !0));
"DELETED" === f.type && f.object && f.object.metadata && !f.object.metadata.deletionTimestamp && (f.object.metadata.deletionTimestamp = new Date().toISOString()), f.object && this._resourceVersion(e, f.object.resourceVersion || f.object.metadata.resourceVersion), this._data(e).update(f.object, f.type);
var g = this;
j(function() {
g._watchCallbacks(e).fire(g._data(e), f.type, f.object);
}, 0);
} catch (h) {
i.error("Error processing message", a, d.data);
}
}, o.prototype._watchOpOnClose = function(a, b, c, d) {
var e = d.target, f = this._uniqueKey(a, null, b, _.get(c, "http.params"));
if (!e) return void i.log("Skipping reopen, no eventWS in event", d);
var g = this._watchWebsockets(f);
if (!g) return void i.log("Skipping reopen, no registeredWS for resource/context", a, b);
if (e !== g) return void i.log("Skipping reopen, eventWS does not match registeredWS", e, g);
if (this._watchInFlight(f, !1), e.shouldClose) return void i.log("Skipping reopen, eventWS was explicitly closed", e);
if (d.wasClean) return void i.log("Skipping reopen, clean close", d);
if (!this._watchCallbacks(f).has()) return void i.log("Skipping reopen, no listeners registered for resource/context", a, b);
if (this._isTooManyWebsocketRetries(f)) return void (_.get(c, "errorNotification", !0) && h.error("Server connection interrupted.", {
id:"websocket_retry_halted",
mustDismiss:!0,
actions:{
refresh:{
label:"Refresh",
action:function() {
window.location.reload();
}
}
}
}));
if (this._addWebsocketEvent(f, "close"), e.shouldRelist) {
i.log("Relisting for resource/context", a, b);
var j = this;
return void setTimeout(function() {
j.watch(a, b);
}, 2e3);
}
i.log("Rewatching for resource/context", a, b), this._watchInFlight(f, !0), setTimeout($.proxy(this, "_startWatchOp", f, a, b, c, this._resourceVersion(f)), 2e3);
};
var t = "{protocol}://{+hostPort}{+prefix}{/group}/{version}/", u = t + "{resource}{?q*}", v = t + "{resource}/{name}{/subresource*}{?q*}", w = t + "namespaces/{namespace}/{resource}{?q*}", x = t + "namespaces/{namespace}/{resource}/{name}{/subresource*}{?q*}";
o.prototype._urlForResource = function(a, b, c, d, e) {
var f = g.apiInfo(a);
if (!f) return i.error("_urlForResource called with unknown resource", a, arguments), null;
var h;
e = e || {}, h = d ? "http:" === window.location.protocol ? "ws" :"wss" :"http:" === window.location.protocol ? "http" :"https", c && c.namespace && !e.namespace && (e.namespace = c.namespace);
var j = e.namespace, k = null;
j && (k = e.namespace, e = angular.copy(e), delete e.namespace);
var l, m = {
protocol:h,
hostPort:f.hostPort,
prefix:f.prefix,
group:f.group,
version:f.version,
resource:a.primaryResource(),
subresource:a.subresources(),
name:b,
namespace:k,
q:e
};
return l = b ? j ? x :v :j ? w :u, URI.expand(l, m).toString();
}, o.prototype.url = function(a) {
if (a && a.resource) {
var b = angular.copy(a);
delete b.resource, delete b.group, delete b.version, delete b.name, delete b.isWebsocket;
var c = g.toResourceGroupVersion({
resource:a.resource,
group:a.group,
version:a.version
});
return this._urlForResource(c, a.name, null, !!a.isWebsocket, b);
}
return null;
}, o.prototype.openshiftAPIBaseUrl = function() {
var a = "http:" === window.location.protocol ? "http" :"https", b = f.openshift.hostPort;
return new URI({
protocol:a,
hostname:b
}).toString();
};
var y = {
imagestreamimages:!0
};
return o.prototype._isImmutable = function(a) {
return !!y[a.resource];
}, o.prototype._hasImmutable = function(a, b, c) {
return this._isImmutable(a) && b && b.by("metadata.name")[c];
}, o.prototype._getNamespace = function(a, b, c) {
var d = e.defer();
return c.namespace ? d.resolve({
namespace:c.namespace
}) :b.projectPromise && !a.equals("projects") ? b.projectPromise.done(function(a) {
d.resolve({
namespace:a.metadata.name
});
}) :d.resolve(null), d.promise;
}, new o();
} ]), angular.module("openshiftConsole").factory("APIDiscovery", [ "LOGGING_URL", "METRICS_URL", "$q", function(a, b, c) {
return {
getLoggingURL:function() {
return c.when(a);
},
getMetricsURL:function() {
return c.when(b);
}
};
} ]), angular.module("openshiftConsole").factory("ProjectsService", [ "$location", "$q", "$routeParams", "AuthService", "DataService", "annotationNameFilter", "AuthorizationService", function(a, b, c, d, e, f, g) {
var h = function(a) {
var b = [ f("description"), f("displayName") ];
return _.each(b, function(b) {
a.metadata.annotations[b] || delete a.metadata.annotations[b];
}), a;
};
return {
get:function(b) {
return d.withUser().then(function() {
var c = {
projectPromise:$.Deferred(),
projectName:b,
project:void 0
};
return e.get("projects", b, c, {
errorNotification:!1
}).then(function(a) {
return g.getProjectRules(b).then(function() {
return c.project = a, c.projectPromise.resolve(a), [ a, c ];
});
}, function(b) {
c.projectPromise.reject(b);
var d = "The project could not be loaded.", e = "error";
403 === b.status ? (d = "The project " + c.projectName + " does not exist or you are not authorized to view it.", e = "access_denied") :404 === b.status && (d = "The project " + c.projectName + " does not exist.", e = "not_found"), a.url(URI("error").query({
error:e,
error_description:d
}).toString());
});
});
},
update:function(a, b) {
return e.update("projects", a, h(b), {
projectName:a
}, {
errorNotification:!1
});
},
canCreate:function() {
return e.get("projectrequests", null, {}, {
errorNotification:!1
});
}
};
} ]), angular.module("openshiftConsole").service("ApplicationGenerator", [ "DataService", "APIService", "Logger", "$parse", "$q", function(a, b, c, d, e) {
var f = {};
return f._generateSecret = function() {
function a() {
return Math.floor(65536 * (1 + Math.random())).toString(16).substring(1);
}
return a() + a() + a() + a();
}, f.parsePorts = function(a) {
var b = function(b) {
var e = [];
return angular.forEach(b, function(b, f) {
var g = f.split("/");
1 === g.length && g.push("tcp");
var h = parseInt(g[0], 10);
isNaN(h) ? c.warn("Container port " + g[0] + " is not a number for image " + d("metadata.name")(a)) :e.push({
containerPort:h,
protocol:g[1].toUpperCase()
});
}), e.sort(function(a, b) {
return a.containerPort - b.containerPort;
}), e;
}, e = d("dockerImageMetadata.Config.ExposedPorts")(a) || d("dockerImageMetadata.ContainerConfig.ExposedPorts")(a) || [];
return b(e);
}, f.generate = function(a) {
var b = f.parsePorts(a.image);
a.annotations["openshift.io/generated-by"] = "OpenShiftWebConsole";
var c;
null !== a.buildConfig.sourceUrl && (c = {
name:a.name,
tag:"latest",
kind:"ImageStreamTag",
toString:function() {
return this.name + ":" + this.tag;
}
});
var d = {
imageStream:f._generateImageStream(a),
buildConfig:f._generateBuildConfig(a, c, a.labels),
deploymentConfig:f._generateDeploymentConfig(a, c, b, a.labels)
};
a.scaling.autoscale && (d.hpa = f._generateHPA(a, d.deploymentConfig));
var e = f._generateService(a, a.name, b);
return e && (d.service = e, d.route = f._generateRoute(a, a.name, d.service.metadata.name)), d;
}, f.createRoute = function(a, b, c) {
return f._generateRoute({
labels:c || {},
routing:angular.extend({
include:!0
}, a)
}, a.name, b);
}, f._generateRoute = function(a, b, c) {
if (!a.routing.include) return null;
var d = {
kind:"Route",
apiVersion:"v1",
metadata:{
name:b,
labels:a.labels,
annotations:a.annotations
},
spec:{
to:{
kind:"Service",
name:c
},
wildcardPolicy:"None"
}
}, e = a.routing.host;
e && (e.startsWith("*.") ? (d.spec.wildcardPolicy = "Subdomain", d.spec.host = "wildcard" + e.substring(1)) :d.spec.host = e), a.routing.path && (d.spec.path = a.routing.path), a.routing.targetPort && (d.spec.port = {
targetPort:a.routing.targetPort
});
var f = a.routing.tls;
return f && f.termination && (d.spec.tls = {
termination:f.termination
}, f.insecureEdgeTerminationPolicy && (d.spec.tls.insecureEdgeTerminationPolicy = f.insecureEdgeTerminationPolicy), "passthrough" !== f.termination && (f.certificate && (d.spec.tls.certificate = f.certificate), f.key && (d.spec.tls.key = f.key), f.caCertificate && (d.spec.tls.caCertificate = f.caCertificate), f.destinationCACertificate && "reencrypt" === f.termination && (d.spec.tls.destinationCACertificate = f.destinationCACertificate))), d;
}, f._generateDeploymentConfig = function(a, b, c) {
var d = [];
angular.forEach(a.deploymentConfig.envVars, function(a, b) {
d.push({
name:b,
value:a
});
});
var e = angular.copy(a.labels);
e.deploymentconfig = a.name;
var f, g = {
image:b.toString(),
name:a.name,
ports:c,
env:d,
resources:_.get(a, "container.resources")
};
f = a.scaling.autoscaling ? a.scaling.minReplicas || 1 :a.scaling.replicas;
var h = {
apiVersion:"v1",
kind:"DeploymentConfig",
metadata:{
name:a.name,
labels:a.labels,
annotations:a.annotations
},
spec:{
replicas:f,
selector:{
deploymentconfig:a.name
},
triggers:[],
template:{
metadata:{
labels:e
},
spec:{
containers:[ g ]
}
}
}
};
return h.spec.triggers.push({
type:"ImageChange",
imageChangeParams:{
automatic:!!a.deploymentConfig.deployOnNewImage,
containerNames:[ a.name ],
from:{
kind:b.kind,
name:b.toString()
}
}
}), a.deploymentConfig.deployOnConfigChange && h.spec.triggers.push({
type:"ConfigChange"
}), h;
}, f._generateHPA = function(a, b) {
var c = {
apiVersion:"extensions/v1beta1",
kind:"HorizontalPodAutoscaler",
metadata:{
name:a.name,
labels:a.labels,
annotations:a.annotations
},
spec:{
scaleRef:{
kind:"DeploymentConfig",
name:b.metadata.name,
apiVersion:"extensions/v1beta1",
subresource:"scale"
},
minReplicas:a.scaling.minReplicas,
maxReplicas:a.scaling.maxReplicas,
cpuUtilization:{
targetPercentage:a.scaling.targetCPU || a.scaling.defaultTargetCPU
}
}
};
return c;
}, f._generateBuildConfig = function(a, b) {
var c = [];
angular.forEach(a.buildConfig.envVars, function(a, b) {
c.push({
name:b,
value:a
});
});
var d = [ {
generic:{
secret:f._generateSecret()
},
type:"Generic"
} ];
a.buildConfig.buildOnSourceChange && d.push({
github:{
secret:f._generateSecret()
},
type:"GitHub"
}), a.buildConfig.buildOnImageChange && d.push({
imageChange:{},
type:"ImageChange"
}), a.buildConfig.buildOnConfigChange && d.push({
type:"ConfigChange"
});
var e = new URI(a.buildConfig.sourceUrl), g = e.fragment();
g || (g = "master"), e.fragment("");
var h = e.href(), i = {
apiVersion:"v1",
kind:"BuildConfig",
metadata:{
name:a.name,
labels:a.labels,
annotations:a.annotations
},
spec:{
output:{
to:{
name:b.toString(),
kind:b.kind
}
},
source:{
git:{
ref:a.buildConfig.gitRef || g,
uri:h
},
type:"Git"
},
strategy:{
type:"Source",
sourceStrategy:{
from:{
kind:"ImageStreamTag",
name:a.imageName + ":" + a.imageTag,
namespace:a.namespace
},
env:c
}
},
triggers:d
}
};
return _.get(a, "buildConfig.secrets.gitSecret[0].name") && (i.spec.source.sourceSecret = _.first(a.buildConfig.secrets.gitSecret)), a.buildConfig.contextDir && (i.spec.source.contextDir = a.buildConfig.contextDir), i;
}, f._generateImageStream = function(a) {
return {
apiVersion:"v1",
kind:"ImageStream",
metadata:{
name:a.name,
labels:a.labels,
annotations:a.annotations
}
};
}, f.getServicePort = function(a) {
return {
port:a.containerPort,
targetPort:a.containerPort,
protocol:a.protocol,
name:(a.containerPort + "-" + a.protocol).toLowerCase()
};
}, f._generateService = function(a, b, c) {
if (!c || !c.length) return null;
var d = {
kind:"Service",
apiVersion:"v1",
metadata:{
name:b,
labels:a.labels,
annotations:a.annotations
},
spec:{
selector:{
deploymentconfig:a.name
},
ports:_.map(c, f.getServicePort)
}
};
return d;
}, f.ifResourcesDontExist = function(c, d) {
function f() {
0 === j && (h.length > 0 ? g.reject({
nameTaken:!0
}) :g.resolve({
nameTaken:!1
}));
}
var g = e.defer(), h = [], i = [], j = c.length;
return c.forEach(function(c) {
var e = b.objectToResourceGroupVersion(c);
return e ? b.apiInfo(e) ? void a.get(e, c.metadata.name, {
namespace:d
}, {
errorNotification:!1
}).then(function(a) {
h.push(a), j--, f();
}, function(a) {
i.push(a), j--, f();
}) :(i.push({
data:{
message:b.unsupportedObjectKindOrVersion(c)
}
}), j--, void f()) :(i.push({
data:{
message:b.invalidObjectKindOrVersion(c)
}
}), j--, void f());
}), g.promise;
}, f;
} ]), angular.module("openshiftConsole").service("AlertMessageService", function() {
var a = [], b = function(a, b) {
return b ? "hide/alert/" + b + "/" + a :"hide/alert/" + a;
};
return {
addAlert:function(b) {
a.push(b);
},
getAlerts:function() {
return a;
},
clearAlerts:function() {
a = [];
},
isAlertPermanentlyHidden:function(a, c) {
var d = b(a, c);
return "true" === localStorage.getItem(d);
},
permanentlyHideAlert:function(a, c) {
var d = b(a, c);
localStorage.setItem(d, "true");
}
};
}), angular.module("openshiftConsole").provider("RedirectLoginService", function() {
var a = "", b = "", c = "";
this.OAuthClientID = function(b) {
return b && (a = b), a;
}, this.OAuthAuthorizeURI = function(a) {
return a && (b = a), b;
}, this.OAuthRedirectURI = function(a) {
return a && (c = a), c;
}, this.$get = [ "$location", "$q", "Logger", "base64", function(d, e, f, g) {
var h = f.get("auth"), i = function(a) {
var b;
if (window.crypto && window.Uint32Array) try {
var c = new Uint32Array(a);
window.crypto.getRandomValues(c), b = [];
for (var d = 0; d < a; d++) b.push(c[d]);
} catch (e) {
h.debug("RedirectLoginService.getRandomInts: ", e), b = null;
}
if (!b) {
b = [];
for (var f = 0; f < a; f++) b.push(Math.floor(4294967296 * Math.random()));
}
return b;
}, j = "RedirectLoginService.nonce", k = function(a) {
var b = String(new Date().getTime()) + "-" + i(8).join("");
try {
window.localStorage[j] = b;
} catch (c) {
h.log("RedirectLoginService.makeState, localStorage error: ", c);
}
return g.urlencode(JSON.stringify({
then:a,
nonce:b
}));
}, l = function(a) {
var b = {
then:null,
verified:!1
}, c = "";
try {
c = window.localStorage[j], window.localStorage.removeItem(j);
} catch (d) {
h.log("RedirectLoginService.parseState, localStorage error: ", d);
}
try {
var e = a ? JSON.parse(g.urldecode(a)) :{};
e && e.nonce && c && e.nonce === c && (b.verified = !0, b.then = e.then);
} catch (d) {
h.error("RedirectLoginService.parseState, state error: ", d);
}
return h.error("RedirectLoginService.parseState", b), b;
};
return {
login:function() {
if ("" === a) return e.reject({
error:"invalid_request",
error_description:"RedirectLoginServiceProvider.OAuthClientID() not set"
});
if ("" === b) return e.reject({
error:"invalid_request",
error_description:"RedirectLoginServiceProvider.OAuthAuthorizeURI() not set"
});
if ("" === c) return e.reject({
error:"invalid_request",
error_description:"RedirectLoginServiceProvider.OAuthRedirectURI not set"
});
var f = e.defer(), g = new URI(b), i = new URI(d.url()).fragment("");
return g.query({
client_id:a,
response_type:"token",
state:k(i.toString()),
redirect_uri:c
}), h.log("RedirectLoginService.login(), redirecting", g.toString()), window.location.href = g.toString(), f.promise;
},
finish:function() {
var a = new URI(d.url()), b = a.query(!0), c = new URI("?" + a.fragment()).query(!0);
h.log("RedirectLoginService.finish()", b, c);
var f = b.error || c.error;
if (f) {
var g = b.error_description || c.error_description, i = b.error_uri || c.error_uri;
return h.log("RedirectLoginService.finish(), error", f, g, i), e.reject({
error:f,
error_description:g,
error_uri:i
});
}
var j = l(c.state);
if (c.access_token && "bearer" === (c.token_type || "").toLowerCase()) {
var k = e.defer();
return k.resolve({
token:c.access_token,
ttl:c.expires_in,
then:j.then,
verified:j.verified
}), k.promise;
}
return e.reject({
error:"invalid_request",
error_description:"No API token returned"
});
}
};
} ];
}), angular.module("openshiftConsole").provider("DeleteTokenLogoutService", function() {
this.$get = [ "$q", "$injector", "Logger", function(a, b, c) {
var d = c.get("auth");
return {
logout:function(c, e) {
if (d.log("DeleteTokenLogoutService.logout()", c, e), !e) return d.log("DeleteTokenLogoutService, no token, returning immediately"), a.when({});
var f = b.get("DataService"), g = {
http:{
auth:{
token:e,
triggerLogin:!1
}
}
};
return f["delete"]("oauthaccesstokens", e, {}, g);
}
};
} ];
}), angular.module("openshiftConsole").service("Navigate", [ "$location", "$window", "$timeout", "annotationFilter", "LabelFilter", "$filter", "APIService", function(a, b, c, d, e, f, g) {
var h = f("annotation"), i = f("buildConfigForBuild"), j = f("isJenkinsPipelineStrategy"), k = f("displayName"), l = function(a, b) {
return _.get(b, "isPipeline") ? "pipelines" :_.isObject(a) && j(a) ? "pipelines" :"builds";
};
return {
toErrorPage:function(c, d, e) {
var f = URI("error").query({
error_description:c,
error:d
}).toString();
e ? b.location.href = f :a.url(f).replace();
},
toProjectOverview:function(b) {
a.path(this.projectOverviewURL(b));
},
projectOverviewURL:function(a) {
return "project/" + encodeURIComponent(a) + "/overview";
},
createFromImageURL:function(a, b, c, d) {
var e = URI.expand("project/{project}/create/fromimage{?q*}", {
project:c,
q:angular.extend({
imageStream:a.metadata.name,
imageTag:b,
namespace:a.metadata.namespace,
displayName:k(a)
}, d || {})
});
return e.toString();
},
createFromTemplateURL:function(a, b, c) {
var d = URI.expand("project/{project}/create/fromtemplate{?q*}", {
project:b,
q:angular.extend({
template:a.metadata.name,
namespace:a.metadata.namespace
}, c || {})
});
return d.toString();
},
toNextSteps:function(b, c, d) {
var e = {
name:b
};
_.isObject(d) && _.extend(e, d), a.path("project/" + encodeURIComponent(c) + "/create/next").search(e);
},
toPodsForDeployment:function(b) {
a.url("/project/" + b.metadata.namespace + "/browse/pods"), c(function() {
e.setLabelSelector(new LabelSelector(b.spec.selector, (!0)));
}, 1);
},
resourceURL:function(a, b, c, d, e) {
if (d = d || "browse", !(a && (a.metadata || b && c))) return null;
b || (b = a.kind), c || (c = a.metadata.namespace);
var h = a;
a.metadata && (h = a.metadata.name);
var i = URI("").segment("project").segmentCoded(c).segment(d);
switch (b) {
case "Build":
var j = f("buildConfigForBuild")(a), k = l(a, e);
j ? i.segment(k).segmentCoded(j).segmentCoded(h) :i.segment(k + "-noconfig").segmentCoded(h);
break;

case "BuildConfig":
i.segment(l(a, e)).segmentCoded(h);
break;

case "ConfigMap":
i.segment("config-maps").segmentCoded(h);
break;

case "Deployment":
i.segment("deployment").segmentCoded(h);
break;

case "DeploymentConfig":
i.segment("dc").segmentCoded(h);
break;

case "ReplicaSet":
i.segment("rs").segmentCoded(h);
break;

case "ReplicationController":
i.segment("rc").segmentCoded(h);
break;

case "ImageStream":
i.segment("images").segmentCoded(h);
break;

case "ImageStreamTag":
var m = h.indexOf(":");
i.segment("images").segmentCoded(h.substring(0, m)).segmentCoded(h.substring(m + 1));
break;

case "StatefulSet":
i.segment("stateful-sets").segmentCoded(h);
break;

case "PersistentVolumeClaim":
case "Pod":
case "Route":
case "Secret":
case "Service":
i.segment(g.kindToResource(b)).segmentCoded(h);
break;

default:
var n;
if (a.metadata) n = g.objectToResourceGroupVersion(a); else if (_.get(e, "apiVersion")) {
var o = g.kindToResource(b), p = g.parseGroupVersion(e.apiVersion);
p.resource = o, n = g.toResourceGroupVersion(p);
} else n = g.toResourceGroupVersion(g.kindToResource(b));
var q = g.apiInfo(n);
if (!q) return null;
i.segment("other").search({
kind:b,
group:n.group
});
}
return i.toString();
},
toResourceURL:function(b) {
a.url(this.resourceURL(b));
},
configURLForResource:function(a, b) {
var c, d, e = _.get(a, "kind"), f = _.get(a, "metadata.namespace");
if (!e || !f) return null;
switch (e) {
case "Build":
return c = i(a), c ? this.resourceURL(c, "BuildConfig", f, b, {
isPipeline:j(a)
}) :null;

case "ReplicationController":
return d = h(a, "deploymentConfig"), d ? this.resourceURL(d, "DeploymentConfig", f, b) :null;
}
return null;
},
resourceListURL:function(a, b) {
var c = {
builds:"builds",
buildconfigs:"builds",
configmaps:"config-maps",
deployments:"deployments",
deploymentconfigs:"deployments",
imagestreams:"images",
pods:"pods",
replicasets:"deployments",
replicationcontrollers:"deployments",
routes:"routes",
secrets:"secrets",
services:"services",
persistentvolumeclaims:"storage",
statefulsets:"stateful-sets"
};
return URI.expand("project/{projectName}/browse/{browsePath}", {
projectName:b,
browsePath:c[a]
}).toString();
},
toResourceList:function(b, c) {
a.url(this.resourceListURL(b, c));
},
yamlURL:function(a, b) {
if (!a) return "";
var c = g.parseGroupVersion(a.apiVersion);
return URI.expand("project/{projectName}/edit/yaml?kind={kind}&name={name}&group={group}&returnURL={returnURL}", {
projectName:a.metadata.namespace,
kind:a.kind,
name:a.metadata.name,
group:c.group || "",
returnURL:b || ""
}).toString();
},
healthCheckURL:function(a, b, c, d) {
return URI.expand("project/{projectName}/edit/health-checks?kind={kind}&name={name}&group={group}", {
projectName:a,
kind:b,
name:c,
group:d || ""
}).toString();
}
};
} ]), angular.module("openshiftConsole").service("NameGenerator", function() {
return {
suggestFromSourceUrl:function(a) {
var b = a.substr(a.lastIndexOf("/") + 1, a.length), c = b.indexOf(".");
return c !== -1 && (b = b.substr(0, c)), b.split("#")[0];
}
};
}), angular.module("openshiftConsole").factory("TaskList", [ "$timeout", function(a) {
function b() {
this.tasks = [];
}
var c = 6e4, d = new b();
return b.prototype.add = function(b, e, f, g) {
var h = {
status:"started",
titles:b,
helpLinks:e,
namespace:f
};
this.tasks.push(h), g().then(function(b) {
h.status = "completed", h.hasErrors = b.hasErrors || !1, h.alerts = b.alerts || [], h.hasErrors || a(function() {
d.deleteTask(h);
}, c);
});
}, b.prototype.taskList = function() {
return this.tasks;
}, b.prototype.deleteTask = function(a) {
var b = d.tasks.indexOf(a);
b >= 0 && this.tasks.splice(b, 1);
}, b.prototype.clear = function() {
d.tasks = [];
}, d;
} ]), angular.module("openshiftConsole").factory("Notification", [ "$rootScope", function(a) {
function b() {
this.messenger = Messenger({
extraClasses:"messenger-fixed messenger-on-bottom messenger-on-right",
theme:"flat",
messageDefaults:{
showCloseButton:!0,
hideAfter:10
}
});
var b = this;
a.$on("$routeChangeStart", function(a, c, d) {
b.clear();
});
}
return b.prototype.notify = function(a, b, c) {
c = c || {};
var d = {
type:a,
message:$("<div/>").text(b).html(),
id:c.id,
actions:c.actions
};
c.mustDismiss && (d.hideAfter = !1), this.messenger.post(d);
}, b.prototype.success = function(a, b) {
this.notify("success", a, b);
}, b.prototype.info = function(a, b) {
this.notify("info", a, b);
}, b.prototype.error = function(a, b) {
this.notify("error", a, b);
}, b.prototype.warning = function(a, b) {
this.notify("warning", a, b);
}, b.prototype.clear = function() {
this.messenger.hideAll();
}, new b();
} ]), angular.module("openshiftConsole").factory("ImageStreamResolver", [ "$q", "DataService", function(a, b) {
function c() {}
return c.prototype.fetchReferencedImageStreamImages = function(c, d, e, f) {
var g = {};
return angular.forEach(c, function(a) {
angular.forEach(a.spec.containers, function(a) {
var c = a.image;
if (c && !d[c] && !g[c]) {
var h = e[c];
if (h) {
var i = h.split("@"), j = b.get("imagestreamimages", h, f);
j.then(function(a) {
if (a && a.image) {
var b = angular.copy(a.image);
b.imageStreamName = i[0], b.imageStreamNamespace = f.project.metadata.name, d[c] = b;
}
}), g[c] = j;
}
}
});
}), a.all(g);
}, c.prototype.buildDockerRefMapForImageStreams = function(a, b) {
angular.forEach(a, function(a) {
angular.forEach(a.status.tags, function(c) {
angular.forEach(c.items, function(c) {
c.image && (b[c.dockerImageReference] = a.metadata.name + "@" + c.image);
});
});
});
}, new c();
} ]), angular.module("openshiftConsole").factory("BaseHref", [ "$document", function(a) {
return a.find("base").attr("href") || "/";
} ]), angular.module("openshiftConsole").factory("BuildsService", [ "DataService", "$filter", function(a, b) {
var c = b("annotation"), d = b("buildConfigForBuild"), e = b("isIncompleteBuild"), f = b("isNewerResource"), g = function(b, c) {
var d = {
kind:"BuildRequest",
apiVersion:"v1",
metadata:{
name:b
}
};
return a.create("buildconfigs/instantiate", b, d, c);
}, h = function(b, c, d) {
var e = angular.copy(b);
return e.status.cancelled = !0, a.update("builds", e.metadata.name, e, d);
}, i = function(b, c) {
var d = {
kind:"BuildRequest",
apiVersion:"v1",
metadata:{
name:b
}
};
return a.create("builds/clone", b, d, c);
}, j = function(a) {
return "true" === c(a, "openshift.io/build-config.paused");
}, k = function(a) {
return !!a && (!a.metadata.deletionTimestamp && !j(a));
}, l = function(a) {
var b = c(a, "pipeline.alpha.openshift.io/uses");
if (!b) return [];
try {
b = JSON.parse(b);
} catch (d) {
return void Logger.warn('Could not parse "pipeline.alpha.openshift.io/uses" annotation', d);
}
var e = [];
return _.each(b, function(b) {
b.name && (b.namespace && b.namespace !== _.get(a, "metadata.namespace") || "DeploymentConfig" === b.kind && e.push(b.name));
}), e;
}, m = function(a, b) {
return _.pick(b, function(b) {
var d = c(b, "buildConfig");
return !d || d === a;
});
}, n = function(a, b) {
var c = {};
return _.each(a, function(a) {
var e = d(a) || "";
b && !b(a) || f(a, c[e]) && (c[e] = a);
}), c;
}, o = function(a) {
var b = c(a, "buildNumber") || parseInt(a.metadata.name.match(/(\d+)$/), 10);
return isNaN(b) ? null :b;
}, p = function(a) {
return a.status.startTimestamp || a.metadata.creationTimestamp;
}, q = function(a) {
return _.round(a / 1e3 / 1e3);
}, r = function(a) {
var b = _.get(a, "status.duration");
if (b) return q(b);
var c = p(a), d = a.status.completionTimestamp;
return c && d ? moment(d).diff(moment(c)) :0;
}, s = function(a) {
return _.map(a, function(a) {
return e(a);
});
}, t = function(a) {
return _.map(a, function(a) {
return !e(a);
});
}, u = function(a) {
return _.reduce(a, function(a, c) {
if (e(c)) return a;
var d = b("annotation")(c, "buildConfig");
return f(c, a[d]) && (a[d] = c), a;
}, {});
}, v = function(a) {
var c = {}, d = _.filter(a, function(a) {
if (e(a)) return !0;
var d = b("annotation")(a, "buildConfig");
f(a, c[d]) && (c[d] = a);
});
return d.concat(_.map(c, function(a) {
return a;
}));
};
return {
startBuild:g,
cancelBuild:h,
cloneBuild:i,
isPaused:j,
canBuild:k,
usesDeploymentConfigs:l,
validatedBuildsForBuildConfig:m,
latestBuildByConfig:n,
getBuildNumber:o,
getStartTimestsamp:p,
getDuration:r,
incompleteBuilds:s,
completeBuilds:t,
lastCompleteByBuildConfig:u,
interestingBuilds:v
};
} ]), angular.module("openshiftConsole").factory("DeploymentsService", [ "APIService", "DataService", "$filter", "$q", "LabelFilter", function(a, b, c, d, e) {
function f() {}
var g = c("annotation");
f.prototype.startLatestDeployment = function(a, d, e) {
var f = {
kind:"DeploymentConfig",
apiVersion:"v1",
metadata:a.metadata,
spec:a.spec,
status:a.status
};
f.status.latestVersion || (f.status.latestVersion = 0), f.status.latestVersion++, b.update("deploymentconfigs", a.metadata.name, f, d).then(function() {
e.alerts = e.alerts || {}, e.alerts.deploy = {
type:"success",
message:"Deployment #" + f.status.latestVersion + " of " + a.metadata.name + " has started."
};
}, function(a) {
e.alerts = e.alerts || {}, e.alerts.deploy = {
type:"error",
message:"An error occurred while starting the deployment.",
details:c("getErrorDetails")(a)
};
});
}, f.prototype.retryFailedDeployment = function(a, d, e) {
var f = angular.copy(a), h = a.metadata.name, i = g(a, "deploymentConfig");
b.list("pods", d, function(a) {
var d = a.by("metadata.name"), f = function(a) {
var d = c("annotationName")("deployerPodFor");
a.metadata.labels[d] === h && b["delete"]("pods", a.metadata.name, e).then(function() {
Logger.info("Deployer pod " + a.metadata.name + " deleted");
}, function(a) {
e.alerts = e.alerts || {}, e.alerts.retrydeployer = {
type:"error",
message:"An error occurred while deleting the deployer pod.",
details:c("getErrorDetails")(a)
};
});
};
angular.forEach(d, f);
});
var j = c("annotationName")("deploymentStatus"), k = c("annotationName")("deploymentStatusReason"), l = c("annotationName")("deploymentCancelled");
f.metadata.annotations[j] = "New", delete f.metadata.annotations[k], delete f.metadata.annotations[l], b.update("replicationcontrollers", h, f, d).then(function() {
e.alerts = e.alerts || {}, e.alerts.retry = {
type:"success",
message:"Retrying deployment " + h + " of " + i + "."
};
}, function(a) {
e.alerts = e.alerts || {}, e.alerts.retry = {
type:"error",
message:"An error occurred while retrying the deployment.",
details:c("getErrorDetails")(a)
};
});
}, f.prototype.rollbackToDeployment = function(a, d, e, f, h, i) {
var j = a.metadata.name, k = g(a, "deploymentConfig"), l = {
kind:"DeploymentConfigRollback",
apiVersion:"v1",
spec:{
from:{
name:j
},
includeTemplate:!0,
includeReplicationMeta:d,
includeStrategy:e,
includeTriggers:f
}
};
b.create("deploymentconfigrollbacks", null, l, h).then(function(a) {
b.update("deploymentconfigs", k, a, h).then(function(a) {
i.alerts = i.alerts || {}, i.alerts.rollback = {
type:"success",
message:"Deployment #" + a.status.latestVersion + " is rolling back " + k + " to " + j + "."
};
}, function(a) {
i.alerts = i.alerts || {}, i.alerts.rollback = {
type:"error",
message:"An error occurred while rolling back the deployment.",
details:c("getErrorDetails")(a)
};
});
}, function(a) {
i.alerts = i.alerts || {}, i.alerts.rollback = {
type:"error",
message:"An error occurred while rolling back the deployment.",
details:c("getErrorDetails")(a)
};
});
}, f.prototype.cancelRunningDeployment = function(a, d, e) {
var f = a.metadata.name, g = c("annotation")(a, "deploymentConfig"), h = angular.copy(a), i = c("annotationName")("deploymentCancelled"), j = c("annotationName")("deploymentStatusReason");
h.metadata.annotations[i] = "true", h.metadata.annotations[j] = "The deployment was cancelled by the user", b.update("replicationcontrollers", f, h, d).then(function() {
e.alerts = e.alerts || {}, e.alerts.cancel = {
type:"success",
message:"Cancelled deployment " + f + " of " + g + "."
};
}, function(a) {
e.alerts = e.alerts || {}, e.alerts.cancel = {
type:"error",
message:"An error occurred while cancelling the deployment.",
details:c("getErrorDetails")(a)
};
});
}, f.prototype.associateDeploymentsToDeploymentConfig = function(a, b, d) {
var f = {}, g = e.getLabelSelector();
return angular.forEach(a, function(a, e) {
var h = c("annotation")(a, "deploymentConfig");
(!d || b && b[h] || g.matches(a)) && (h = h || "", f[h] = f[h] || {}, f[h][e] = a);
}), angular.forEach(b, function(a, b) {
f[b] = f[b] || {};
}), f;
}, f.prototype.deploymentBelongsToConfig = function(a, b) {
return !(!a || !b) && b === c("annotation")(a, "deploymentConfig");
}, f.prototype.associateRunningDeploymentToDeploymentConfig = function(a) {
var b = {};
return angular.forEach(a, function(a, d) {
b[d] = {}, angular.forEach(a, function(a, e) {
var f = c("deploymentStatus")(a);
"New" !== f && "Pending" !== f && "Running" !== f || (b[d][e] = a);
});
}), b;
}, f.prototype.getActiveDeployment = function(a) {
var b = c("deploymentIsInProgress"), d = c("annotation"), e = null;
return _.each(a, function(a) {
return b(a) ? (e = null, !1) :void ("Complete" === d(a, "deploymentStatus") && (!e || e.metadata.creationTimestamp < a.metadata.creationTimestamp) && (e = a));
}), e;
}, f.prototype.getRevision = function(a) {
return g(a, "deployment.kubernetes.io/revision");
}, f.prototype.isActiveReplicaSet = function(a, b) {
var c = this.getRevision(a), d = this.getRevision(b);
return !(!c || !d) && c === d;
}, f.prototype.getActiveReplicaSet = function(a, b) {
var c = this.getRevision(b);
if (!c) return null;
var d = this;
return _.find(a, function(a) {
return d.getRevision(a) === c;
});
}, f.prototype.getScaleResource = function(b) {
var c = {
resource:a.kindToResource(b.kind) + "/scale"
};
switch (b.kind) {
case "DeploymentConfig":
break;

case "Deployment":
case "ReplicaSet":
case "ReplicationController":
c.group = "extensions";
break;

default:
return null;
}
return c;
}, f.prototype.scale = function(a, c) {
var e = this.getScaleResource(a);
if (!e) return d.reject({
data:{
message:"Cannot scale kind " + a.kind + "."
}
});
var f = {
apiVersion:"extensions/v1beta1",
kind:"Scale",
metadata:{
name:a.metadata.name,
namespace:a.metadata.namespace,
creationTimestamp:a.metadata.creationTimestamp
},
spec:{
replicas:c
}
};
return b.update(e, a.metadata.name, f, {
namespace:a.metadata.namespace
});
};
var h = function(a, b) {
var c = _.get(b, [ a ]);
return !_.isEmpty(c);
}, i = function(a, b) {
var c = _.get(b, [ a ]);
return !_.isEmpty(c);
};
return f.prototype.isScalable = function(a, b, c, d, e) {
if (i(a.metadata.name, d)) return !1;
var f = g(a, "deploymentConfig");
if (!f) return !0;
if (!b) return !1;
if (!b[f]) return !0;
if (h(f, c)) return !1;
var j = _.get(e, [ f, "metadata", "name" ]);
return j === a.metadata.name;
}, f.prototype.groupByDeploymentConfig = function(a) {
var b = {};
return _.each(a, function(a) {
var d = c("annotation")(a, "deploymentConfig") || "";
_.set(b, [ d, a.metadata.name ], a);
}), b;
}, f.prototype.sortByRevision = function(a) {
var b = this, c = function(a) {
var c = b.getRevision(a);
if (!c) return null;
var d = parseInt(c, 10);
return isNaN(d) ? null :d;
}, d = function(a, b) {
var d = c(a), e = c(b);
return d || e ? d ? e ? e - d :-1 :1 :a.metadata.name.localeCompare(b.metadata.name);
};
return _.toArray(a).sort(d);
}, f.prototype.setPaused = function(c, d, e) {
var f = angular.copy(c), g = a.objectToResourceGroupVersion(c);
return _.set(f, "spec.paused", d), b.update(g, c.metadata.name, f, e);
}, new f();
} ]), angular.module("openshiftConsole").factory("ImageStreamsService", function() {
return {
tagsByName:function(a) {
var b = {};
return angular.forEach(a.spec.tags, function(c) {
b[c.name] = b[c.name] || {}, b[c.name].name = c.name, b[c.name].spec = angular.copy(c);
var d = b[c.name].spec.from;
if (d) {
var e;
if ("ImageStreamImage" === d.kind ? e = "@" :"ImageStreamTag" === d.kind && (e = ":"), e) {
d._nameConnector = e;
var f = d.name.split(e);
1 === f.length ? (d._imageStreamName = a.metadata.name, d._idOrTag = f[0], d._completeName = d._imageStreamName + e + d._idOrTag) :(d._imageStreamName = f.shift(), d._idOrTag = f.join(e), d._completeName = d._imageStreamName + e + d._idOrTag);
}
}
}), angular.forEach(a.status.tags, function(a) {
b[a.tag] = b[a.tag] || {}, b[a.tag].name = a.tag, b[a.tag].status = angular.copy(a);
}), b;
}
};
}), angular.module("openshiftConsole").factory("MembershipService", [ "$filter", function(a) {
var b = a("annotation"), c = function(a, b) {
return 1 === _.filter(b, function(b) {
return _.some(b.subjects, {
name:a
});
}).length;
}, d = function() {
return _.reduce(_.slice(arguments), function(a, b, c) {
return b ? _.isEqual(c, 0) ? b :a + "-" + b :a;
}, "");
}, e = function() {
return {
User:{
kind:"User",
sortOrder:1,
name:"User",
subjects:{}
},
Group:{
kind:"Group",
sortOrder:2,
name:"Group",
subjects:{}
},
ServiceAccount:{
kind:"ServiceAccount",
sortOrder:3,
description:"Service accounts provide a flexible way to control API access without sharing a regular user’s credentials.",
helpLinkKey:"service_accounts",
name:"ServiceAccount",
subjects:{}
},
SystemUser:{
kind:"SystemUser",
sortOrder:4,
description:"System users are virtual users automatically provisioned by the system.",
helpLinkKey:"users_and_groups",
name:"SystemUser",
subjects:{}
},
SystemGroup:{
kind:"SystemGroup",
sortOrder:5,
description:"System groups are virtual groups automatically provisioned by the system.",
helpLinkKey:"users_and_groups",
name:"SystemGroup",
subjects:{}
}
};
}, f = function(a, b) {
var c = _.reduce(a, function(a, c) {
var e = d(c.roleRef.namespace ? "Role" :"ClusterRole", c.roleRef.name);
return _.each(c.subjects, function(c) {
var f = d(c.namespace, c.name);
a[c.kind].subjects[f] || (a[c.kind].subjects[f] = {
name:c.name,
namespace:c.namespace,
roles:{}
}), _.includes(a[c.kind].subjects[f].roles, e) || (a[c.kind].subjects[f].roles[e] = b[e]);
}), a;
}, e());
return _.sortBy(c, "sortOrder");
}, g = function(a) {
return _.sortBy(a, "metadata.name");
}, h = function(a) {
return _.filter(a, function(a) {
return "true" !== b(a, "systemOnly");
});
}, i = function(a) {
return _.reduce(a, function(a, b) {
return a[d(b.kind, b.metadata.name)] = b, a;
}, {});
}, j = function(a, b) {
return _.merge(i(a), i(b));
};
return {
sortRoles:g,
filterRoles:h,
mapRolesForUI:j,
isLastRole:c,
getSubjectKinds:e,
mapRolebindingsForUI:f
};
} ]), angular.module("openshiftConsole").factory("RolesService", [ "$q", "DataService", function(a, b) {
var c = function(c) {
return a.all([ b.list("roles", c, null), b.list("clusterroles", {}, null) ]);
};
return {
listAllRoles:c
};
} ]), angular.module("openshiftConsole").factory("RoleBindingsService", [ "$q", "DataService", function(a, b) {
var c = {}, d = function(a, b) {
var e = b ? a + b :a;
return _.some(c, _.matchesProperty("metadata.name", e)) ? d(a, _.uniqueId()) :e;
}, e = function(a, b) {
var c = _.get(a, "metadata.name"), e = c ? d(c) :null;
return {
kind:"RoleBinding",
apiVersion:"v1",
metadata:{
name:e,
namespace:b
},
roleRef:{
name:_.get(a, "metadata.name"),
namespace:_.get(a, "metadata.namespace")
},
subjects:[]
};
}, f = function(a, b) {
return _.isEqual(a.kind, "ServiceAccount") ? a.namespace = a.namespace || b :(_.isEqual(a.kind, "SystemUser") || _.isEqual(a.kind, "SystemGroup")) && (_.startsWith(a.name, "system:") || (a.name = "system:" + a.name)), a;
}, g = function(a) {
a.userNames = null, a.groupNames = null;
}, h = function(a, c, d, g) {
var h = e(a, d);
return c = f(c, d), h.subjects.push(angular.copy(c)), b.create("rolebindings", null, h, g);
}, i = function(a, c, d, h) {
var i = e(), j = _.extend(i, a);
if (!c) return j;
if (c = f(c, d), _.isArray(j.subjects)) {
if (_.includes(j.subjects, c)) return;
j.subjects.push(c);
} else j.subjects = [ c ];
return g(j), b.update("rolebindings", j.metadata.name, j, h);
}, j = function(c, d, f, h) {
var i = _.filter(f, {
roleRef:{
name:d
}
});
return a.all(_.map(i, function(a) {
var d = e();
return a = _.extend(d, a), g(a), a.subjects = _.reject(a.subjects, {
name:c
}), a.subjects.length ? b.update("rolebindings", a.metadata.name, a, h) :b["delete"]("rolebindings", a.metadata.name, h).then(function() {
return a;
});
}));
}, k = function(a, d, e) {
return b.list("rolebindings", a, function(a) {
c = a.by("metadata.name"), d(a);
}, e);
};
return {
list:k,
create:h,
addSubject:i,
removeSubject:j
};
} ]), angular.module("openshiftConsole").factory("MetricsService", [ "$filter", "$http", "$q", "$rootScope", "APIDiscovery", function(a, b, c, d, e) {
function f() {
return angular.isDefined(k) ? c.when(k) :e.getMetricsURL().then(function(a) {
return k = (a || "").replace(/\/$/, "");
});
}
function g(a) {
if (a.length) return _.each(a, function(a) {
a.empty || !_.isNumber(a.avg) ? a.value = null :a.value = a.avg;
}), a;
}
function h(a) {
return a.join("|");
}
function i() {
return f().then(function(a) {
return a ? a + "/metrics/stats/query" :a;
});
}
function j(a) {
return f().then(function(b) {
var c;
return c = "counter" === a.type ? b + o :b + n, URI.expand(c, {
podUID:a.pod.metadata.uid,
containerName:a.containerName,
metric:a.metric
}).toString();
});
}
var k, l, m, n = "/gauges/{containerName}%2F{podUID}%2F{metric}/data", o = "/counters/{containerName}%2F{podUID}%2F{metric}/data", p = function(a) {
return f().then(function(c) {
return !!c && (!a || (!!l || !m && b.get(c).then(function() {
return l = !0, !0;
}, function(a) {
return m = !0, d.$broadcast("metrics-connection-failed", {
url:c,
response:a
}), !1;
})));
});
}, q = function(a) {
var b = a.split("/");
return {
podUID:b[1],
descriptor:b[2] + "/" + b[3]
};
}, r = function(a, c, d) {
var e = _.indexBy(d.pods, "metadata.uid");
return b.post(a, c, {
auth:{},
headers:{
Accept:"application/json",
"Content-Type":"application/json",
"Hawkular-Tenant":d.namespace
}
}).then(function(a) {
var b = {}, c = function(a, c) {
var d = q(c), f = _.get(e, [ d.podUID, "metadata", "name" ]), h = g(a);
_.set(b, [ d.descriptor, f ], h);
};
return _.each(a.data.counter, c), _.each(a.data.gauge, c), b;
});
}, s = _.template("descriptor_name:network/tx_rate|network/rx_rate,type:pod,pod_id:<%= uid %>"), t = _.template("descriptor_name:memory/usage|cpu/usage_rate,type:pod_container,pod_id:<%= uid %>,container_name:<%= containerName %>"), u = function(a) {
return i().then(function(b) {
var d = {
bucketDuration:a.bucketDuration,
start:a.start
};
a.end && (d.end = a.end);
var e = [], f = h(_.map(a.pods, "metadata.uid")), g = _.assign({
tags:t({
uid:f,
containerName:a.containerName
})
}, d);
e.push(r(b, g, a));
var i = _.assign({
tags:s({
uid:f
})
}, d);
return e.push(r(b, i, a)), c.all(e).then(function(a) {
var b = {};
return _.each(a, function(a) {
_.assign(b, a);
}), b;
});
});
}, v = function(a) {
var c = a.metadata.namespace, d = a.metadata.uid;
return f().then(function(a) {
if (!a) return null;
var e = a + "/metrics", f = {
tags:"custom_metric:true,pod_id:" + d
};
return b.get(e, {
auth:{},
headers:{
Accept:"application/json",
"Hawkular-Tenant":c
},
params:f
}).then(function(a) {
return _.map(a.data, function(a) {
return {
name:a.tags.metric_name,
unit:a.tags.units,
description:a.tags.description,
type:a.type
};
});
});
});
};
return {
isAvailable:p,
getMetricsURL:f,
get:function(a) {
return j(a).then(function(c) {
if (!c) return null;
var d = {
bucketDuration:a.bucketDuration,
start:a.start
};
return a.end && (d.end = a.end), b.get(c, {
auth:{},
headers:{
Accept:"application/json",
"Hawkular-Tenant":a.namespace
},
params:d
}).then(function(b) {
return _.assign(b, {
metricID:a.metric,
data:g(b.data)
});
});
});
},
getCurrentUsage:function(a) {
return j(a).then(function(c) {
if (!c) return null;
var d = {
bucketDuration:"1mn",
start:"-1mn"
};
return b.get(c, {
auth:{},
headers:{
Accept:"application/json",
"Hawkular-Tenant":a.namespace
},
params:d
}).then(function(b) {
return _.assign(b, {
metricID:a.metric,
usage:_.head(g(b.data))
});
});
});
},
getPodMetrics:u,
getCustomMetrics:v
};
} ]), angular.module("openshiftConsole").factory("MetricsCharts", [ "$timeout", "ConversionService", function(a, b) {
var c = function(a, c) {
if (void 0 === a.value || null === a.value) return null;
switch (c) {
case "memory/usage":
return _.round(b.bytesToMiB(a.value), 2);

case "cpu/usage_rate":
return b.millicoresToCores(a.value);

case "network/rx_rate":
case "network/tx_rate":
return _.round(b.bytesToKiB(a.value), 2);

default:
return _.round(a.value);
}
}, d = {
"memory/usage":"Memory",
"cpu/usage_rate":"CPU",
"network/tx_rate":"Sent",
"network/rx_rate":"Received"
};
return {
uniqueID:function() {
return _.uniqueId("metrics-");
},
getDefaultUpdateInterval:function() {
return 6e4;
},
getTimeRangeOptions:function() {
return [ {
label:"Last hour",
value:60
}, {
label:"Last 4 hours",
value:240
}, {
label:"Last day",
value:1440
}, {
label:"Last 3 days",
value:4320
}, {
label:"Last week",
value:10080
} ];
},
getDefaultSparklineConfig:function(a, b, c) {
return {
bindto:"#" + a,
axis:{
x:{
show:!c,
type:"timeseries",
padding:{
left:0,
bottom:0
},
tick:{
type:"timeseries",
format:"%a %H:%M"
}
},
y:{
show:!c,
label:b,
min:0,
padding:{
left:0,
top:20,
bottom:0
}
}
},
point:{
show:!1
},
size:{
height:c ? 35 :175
},
tooltip:{
format:{
value:function(a) {
var c = "cores" === b ? 3 :2;
return d3.round(a, c) + " " + b;
}
}
}
};
},
getSparklineData:function(a) {
var b, e = {
type:"spline",
x:"dates",
names:d
}, f = {};
return _.each(a, function(a, d) {
b = [ "dates" ], f[d] = [ d ], _.each(a, function(a) {
var e = c(a, d);
b.push(a.start), f[d].push(e);
});
}), e.columns = [ b ].concat(_.values(f)), e;
},
formatUsage:function(a) {
return a < .001 ? "0" :a < 1 ? d3.format(".1r")(a) :d3.format(".2r")(a);
},
redraw:function(b) {
a(function() {
_.each(b, function(a) {
a.flush();
});
}, 0);
}
};
} ]), angular.module("openshiftConsole").factory("StorageService", [ "APIService", "DataService", function(a, b) {
return {
createVolume:function(a, b) {
return {
name:a,
persistentVolumeClaim:{
claimName:b.metadata.name
}
};
},
createVolumeMount:function(a, b, c, d) {
var e = {
name:a,
mountPath:b,
readOnly:!!d
};
return c && (e.subPath = c), e;
},
getVolumeNames:function(a) {
var b = _.get(a, "spec.volumes", []);
return _.map(b, "name");
},
getMountPaths:function(a, b) {
var c = [], d = _.get(a, "spec.containers", []);
return _.each(d, function(a) {
if (!b || b(a)) {
var d = _.get(a, "volumeMounts", []);
_.each(d, function(a) {
c.push(a.mountPath);
});
}
}), c;
},
removeVolume:function(c, d, e) {
var f = angular.copy(c), g = _.get(f, "spec.template.spec.volumes");
_.remove(g, {
name:d.name
});
var h = _.get(f, "spec.template.spec.containers");
_.each(h, function(a) {
_.remove(a.volumeMounts, {
name:d.name
});
});
var i = a.objectToResourceGroupVersion(f);
return b.update(i, f.metadata.name, f, e);
}
};
} ]), angular.module("openshiftConsole").factory("Constants", function() {
var a = _.clone(window.OPENSHIFT_CONSTANTS || {}), b = _.clone(window.OPENSHIFT_VERSION || {});
return a.VERSION = b, a;
}), angular.module("openshiftConsole").factory("LimitRangesService", [ "$filter", "LIMIT_REQUEST_OVERRIDES", function(a, b) {
var c = a("usageValue"), d = a("usageWithUnits"), e = a("amountAndUnit"), f = function(a, b) {
return !!a && (!b || c(a) < c(b));
}, g = function(a, b) {
return !!a && (!b || c(a) > c(b));
}, h = function(c) {
if (!b) return !1;
var d = a("annotation")(c, "quota.openshift.io/cluster-resource-override-enabled");
return !d || "true" === d;
}, i = function(a, c) {
if (!h(c)) return null;
switch (a) {
case "cpu":
return b.cpuRequestToLimitPercent;

case "memory":
return b.memoryRequestToLimitPercent;

default:
return null;
}
}, j = function(a, b) {
return !!i(a, b);
}, k = function(a, c) {
return h(c) && "cpu" === a && !!b.limitCPUToMemoryPercent;
}, l = function(a, b, c, d) {
var h = {};
angular.forEach(a, function(a) {
angular.forEach(a.spec.limits, function(a) {
if (a.type === c) {
a.min && g(a.min[b], h.min) && (h.min = a.min[b]), a.max && f(a.max[b], h.max) && (h.max = a.max[b]), a["default"] && (h.defaultLimit = a["default"][b] || h.defaultLimit), a.defaultRequest && (h.defaultRequest = a.defaultRequest[b] || h.defaultRequest);
var d;
a.maxLimitRequestRatio && (d = a.maxLimitRequestRatio[b], d && (!h.maxLimitRequestRatio || d < h.maxLimitRequestRatio) && (h.maxLimitRequestRatio = d));
}
});
});
var j, k, l, m;
return h.min && (j = i(b, d), j && (k = e(h.min), l = Math.ceil(k[0] / (j / 100)), m = k[1] || "", h.min = "" + l + m)), h;
}, m = function(b, e, f, g) {
if (!f || !f.length) return [];
var h = l(b, e, "Pod", g), i = l(b, e, "Container", g), m = 0, n = 0, o = h.min && c(h.min), p = h.max && c(h.max), q = [], r = a("computeResourceLabel")(e, !0);
return angular.forEach(f, function(a) {
var b = a.resources || {}, d = b.requests && b.requests[e] || i.defaultRequest;
d && (m += c(d));
var f = b.limits && b.limits[e] || i.defaultLimit;
f && (n += c(f));
}), j(e, g) || (o && m < o && q.push(r + " request total for all containers is less than pod minimum (" + d(h.min, e) + ")."), p && m > p && q.push(r + " request total for all containers is greater than pod maximum (" + d(h.max, e) + ").")), k(e, g) || (o && n < o && q.push(r + " limit total for all containers is less than pod minimum (" + d(h.min, e) + ")."), p && n > p && q.push(r + " limit total for all containers is greater than pod maximum (" + d(h.max, e) + ").")), q;
};
return {
getEffectiveLimitRange:l,
getRequestToLimitPercent:i,
isRequestCalculated:j,
isLimitCalculated:k,
validatePodLimits:m
};
} ]), angular.module("openshiftConsole").factory("RoutesService", [ "$filter", function(a) {
var b = function(a) {
return angular.isString(a);
}, c = function(a, c) {
return _.find(c.spec.ports, function(c) {
return b(a) ? c.name === a :c.targetPort === a;
});
}, d = function(a, d, e) {
if (!d) return void e.push('Routes to service "' + a.spec.to.name + '", but service does not exist.');
var f = a.spec.port ? a.spec.port.targetPort :null;
if (!f) return void (d.spec.ports.length > 1 && e.push('Route has no target port, but service "' + d.metadata.name + '" has multiple ports. The route will round robin traffic across all exposed ports on the service.'));
var g = c(f, d);
g || (b(f) ? e.push('Route target port is set to "' + f + '", but service "' + d.metadata.name + '" has no port with that name.') :e.push('Route target port is set to "' + f + '", but service "' + d.metadata.name + '" does not expose that port.'));
}, e = function(a, b) {
a.spec.tls && (a.spec.tls.termination || b.push("Route has a TLS configuration, but no TLS termination type is specified. TLS will not be enabled until a termination type is set."), "passthrough" === a.spec.tls.termination && a.spec.path && b.push('Route path "' + a.spec.path + '" will be ignored since the route uses passthrough termination.'));
}, f = function(a, b) {
var c = _.get(a, "spec.wildcardPolicy");
angular.forEach(a.status.ingress, function(a) {
var d = _.find(a.conditions, {
type:"Admitted",
status:"False"
});
if (d) {
var e = "Requested host " + (a.host || "<unknown host>") + " was rejected by the router.";
(d.message || d.reason) && (e += " Reason: " + (d.message || d.reason) + "."), b.push(e);
}
d || "Subdomain" !== c || a.wildcardPolicy === c || b.push('Router "' + a.routerName + '" does not support wildcard subdomains. Your route will only be available at host ' + a.host + ".");
});
}, g = function(a) {
return _.some(a.status.ingress, function(a) {
return _.some(a.conditions, {
type:"Admitted",
status:"True"
});
});
}, h = a("annotation"), i = function(a) {
return "true" !== h(a, "openshift.io/host.generated");
}, j = function(a) {
var b = 0;
g(a) && (b += 11);
var c = _.get(a, "spec.alternateBackends");
return _.isEmpty(c) || (b += 5), i(a) && (b += 3), a.spec.tls && (b += 1), b;
}, k = function(a, b) {
var c = j(a), d = j(b);
return d > c ? b :a;
}, l = function(a) {
return _.groupBy(a, "spec.to.name");
}, m = function(a) {
var b = _.get(a, "spec.host", "");
return b.replace(/^[a-z0-9]([-a-z0-9]*[a-z0-9])\./, "");
};
return {
getRouteWarnings:function(a, b) {
var c = [];
return a ? ("Service" === a.spec.to.kind && d(a, b, c), e(a, c), f(a, c), c) :c;
},
getServicePortForRoute:c,
getPreferredDisplayRoute:k,
groupByService:l,
getSubdomain:m,
isCustomHost:i
};
} ]), angular.module("openshiftConsole").factory("ChartsService", [ "Logger", function(a) {
return {
updateDonutCenterText:function(b, c, d) {
var e = d3.select(b).select("text.c3-chart-arcs-title");
return e ? (e.selectAll("*").remove(), e.insert("tspan").text(c).classed(d ? "donut-title-big-pf" :"donut-title-med-pf", !0).attr("dy", d ? 0 :5).attr("x", 0), void (d && e.insert("tspan").text(d).classed("donut-title-small-pf", !0).attr("dy", 20).attr("x", 0))) :void a.warn("Can't select donut title element");
}
};
} ]), angular.module("openshiftConsole").factory("HPAService", [ "$filter", "$q", "LimitRangesService", "MetricsService", "Logger", function(a, b, c, d, e) {
var f = function(a) {
return c.getRequestToLimitPercent("cpu", a);
}, g = function(a, b) {
var c = f(b);
if (!c) return e.warn("convertRequestPercentToLimit called, but no request/limit ratio defined."), NaN;
if (!a) return a;
var d = c / 100 * a;
return Math.round(d);
}, h = function(a, b) {
var c = f(b);
if (!c) return e.warn("convertLimitPercentToRequest called, but no request/limit ratio defined."), NaN;
if (!a) return a;
var d = a / (c / 100);
return Math.round(d);
}, i = function(a, b, c) {
return _.every(c, function(c) {
return _.get(c, [ "resources", b, a ]);
});
}, j = function(a, b) {
return i(a, "requests", b);
}, k = function(a, b) {
return i(a, "limits", b);
}, l = function(a, b, d, e) {
var f = c.getEffectiveLimitRange(d, a, "Container", e);
return !!f[b];
}, m = function(a, b, c) {
return l(a, "defaultRequest", b, c);
}, n = function(a, b, c) {
return l(a, "defaultLimit", b, c);
}, o = function(a, b, d) {
return !(!j("cpu", a) && !m("cpu", b, d)) || (!(!k("cpu", a) && !n("cpu", b, a)) || !!c.isLimitCalculated("cpu", d) && (k("memory", a) || n("memory", b, d)));
}, p = function(a, b, c) {
return _.filter(a, function(a) {
return a.spec.scaleRef.kind === b && a.spec.scaleRef.name === c;
});
}, q = a("humanizeKind"), r = a("hasDeploymentConfig"), s = function(a, e, f, g) {
return !a || _.isEmpty(e) ? b.when([]) :d.isAvailable().then(function(b) {
var d = [];
b || d.push({
message:"Metrics might not be configured by your cluster administrator. Metrics are required for autoscaling.",
reason:"MetricsNotAvailable"
});
var h, i, j = _.get(a, "spec.template.spec.containers", []);
o(j, f, g) || (h = q(a.kind), c.isRequestCalculated("cpu", g) ? (i = "This " + h + " does not have any containers with a CPU limit set. Autoscaling will not work without a CPU limit.", c.isLimitCalculated("cpu", g) && (i += " The CPU limit will be automatically calculated from the container memory limit.")) :i = "This " + h + " does not have any containers with a CPU request set. Autoscaling will not work without a CPU request.", d.push({
message:i,
reason:"NoCPURequest"
})), _.size(e) > 1 && d.push({
message:"More than one autoscaler is scaling this resource. This is not recommended because they might compete with each other. Consider removing all but one autoscaler.",
reason:"MultipleHPA"
});
var k = function() {
return _.some(e, function(a) {
return "ReplicationController" === _.get(a, "spec.scaleRef.kind");
});
};
return "ReplicationController" === a.kind && r(a) && _.some(e, k) && d.push({
message:"This deployment is scaled by both a deployment configuration and an autoscaler. This is not recommended because they might compete with each other.",
reason:"DeploymentHasHPA"
}), d;
});
};
return {
convertRequestPercentToLimit:g,
convertLimitPercentToRequest:h,
hasCPURequest:o,
filterHPA:p,
getHPAWarnings:s
};
} ]), angular.module("openshiftConsole").factory("PodsService", function() {
return {
getImageIDs:function(a, b) {
var c = {};
return _.each(a, function(a) {
var d, e = _.get(a, "status.containerStatuses", []), f = _.find(e, {
name:b
});
f && f.imageID && (d = f.imageID.replace(/^docker:\/\/sha256:/, ""), c[d] = !0);
}), _.keys(c);
},
generateDebugPod:function(a, b) {
var c = angular.copy(a), d = _.find(c.spec.containers, {
name:b
});
return d ? (c.metadata = {
name:a.metadata.name + "-debug",
annotations:{
"debug.openshift.io/source-container":b,
"debug.openshift.io/source-resource":"pods/" + a.metadata.name
},
labels:{}
}, c.spec.restartPolicy = "Never", delete c.spec.host, delete c.spec.nodeName, c.status = {}, delete d.readinessProbe, delete d.livenessProbe, d.command = [ "sleep" ], d.args = [ "3600" ], c.spec.containers = [ d ], c) :null;
}
};
}), angular.module("openshiftConsole").service("CachedTemplateService", function() {
var a = null;
return {
setTemplate:function(b) {
a = b;
},
getTemplate:function() {
return a;
},
clearTemplate:function() {
a = null;
}
};
}).service("ProcessedTemplateService", function() {
var a = function() {
return {
params:{
all:[],
generated:[]
},
message:null
};
}, b = a();
return {
setTemplateData:function(a, c, d) {
_.each(a, function(a) {
b.params.all.push({
name:a.name,
value:a.value
});
}), _.each(c, function(a) {
a.value || b.params.generated.push(a.name);
}), d && (b.message = d);
},
getTemplateData:function() {
return b;
},
clearTemplateData:function() {
b = a();
}
};
}), angular.module("openshiftConsole").factory("SecretsService", function() {
var a = function(a) {
var b = {
source:[],
image:[],
other:[]
};
return _.each(a.by("metadata.name"), function(a) {
switch (a.type) {
case "kubernetes.io/basic-auth":
case "kubernetes.io/ssh-auth":
case "Opaque":
b.source.push(a);
break;

case "kubernetes.io/dockercfg":
case "kubernetes.io/dockerconfigjson":
b.image.push(a);
break;

default:
b.other.push(a);
}
}), b;
}, b = function(a) {
var b = {}, c = JSON.parse(window.atob(a));
return _.each(c, function(a, c) {
b[c] = {
username:a.username,
password:a.password,
email:a.email
};
}), b;
}, c = function(a) {
var b = {}, c = JSON.parse(window.atob(a));
return _.each(c.auths, function(a, c) {
var d = window.atob(a.auth).split(":");
b[c] = {
username:d[0],
password:d[1],
email:a.email
};
}), b;
}, d = function(a) {
var d = {}, e = _.mapValues(a, function(a, e) {
var f, g;
switch (e) {
case ".dockercfg":
return b(a);

case ".dockerconfigjson":
return c(a);

default:
return f = window.atob(a), g = /[\x00-\x09\x0E-\x1F]/.test(f), g ? (d[e] = !0, a) :f;
}
});
return e.$$nonprintable = d, e;
};
return {
groupSecretsByType:a,
decodeSecretData:d
};
}), angular.module("openshiftConsole").factory("ServicesService", [ "$filter", "$q", "DataService", function(a, b, c) {
var d = "service.alpha.openshift.io/dependencies", e = "service.openshift.io/infrastructure", f = a("annotation"), g = function(a) {
var b = f(a, d);
if (!b) return null;
try {
return JSON.parse(b);
} catch (c) {
return Logger.warn('Could not parse "service.alpha.openshift.io/dependencies" annotation', c), null;
}
}, h = function(a) {
var b, c = g(a);
if (!c) return [];
b = _.get(a, "metadata.namespace");
var d = function(a) {
return !!a.name && ((!a.kind || "Service" === a.kind) && (!a.namespace || a.namespace === b));
};
return _.chain(c).filter(d).map(function(a) {
return a.name;
}).value();
}, i = function(a, b) {
return b.length ? void _.set(a, [ "metadata", "annotations", d ], JSON.stringify(b)) :void (_.has(a, [ "metadata", "annotations", d ]) && delete a.metadata.annotations[d]);
}, j = function(a, b) {
var d = angular.copy(a), e = g(d) || [];
return e.push({
name:b.metadata.name,
namespace:a.metadata.namespace === b.metadata.namespace ? "" :b.metadata.namespace,
kind:b.kind
}), i(d, e), c.update("services", d.metadata.name, d, {
namespace:d.metadata.namespace
});
}, k = function(a, d) {
var e = angular.copy(a), f = g(e) || [], h = _.reject(f, function(b) {
if (b.kind !== d.kind) return !1;
var c = b.namespace || a.metadata.namespace;
return c === d.metadata.namespace && b.name === d.metadata.name;
});
return h.length === f.length ? b.when(!0) :(i(e, h), c.update("services", e.metadata.name, e, {
namespace:e.metadata.namespace
}));
}, l = function(a) {
return "true" === f(a, e);
};
return {
getDependentServices:h,
linkService:j,
removeServiceLink:k,
isInfrastructure:l
};
} ]), angular.module("openshiftConsole").factory("ImagesService", [ "$filter", "ApplicationGenerator", "DataService", function(a, b, c) {
var d = function(a, b) {
var d = {
kind:"ImageStreamImport",
apiVersion:"v1",
metadata:{
name:"newapp",
namespace:b.namespace
},
spec:{
"import":!1,
images:[ {
from:{
kind:"DockerImage",
name:a
}
} ]
},
status:{}
};
return c.create("imagestreamimports", null, d, b).then(function(a) {
return {
name:_.get(a, "spec.images[0].from.name"),
image:_.get(a, "status.images[0].image"),
tag:_.get(a, "status.images[0].tag"),
result:_.get(a, "status.images[0].status")
};
});
}, e = function(a) {
var b = _.get(a, "dockerImageMetadata.Config.User");
return !b || "0" === b || "root" === b;
}, f = function(a) {
return _.get(a, "dockerImageMetadata.Config.Volumes");
}, g = function(a) {
var c = [], d = {
"openshift.io/generated-by":"OpenShiftWebConsole"
}, e = [];
_.forEach(a.env, function(a, b) {
e.push({
name:b,
value:a
});
});
var f = [], g = [], h = 0;
if (_.forEach(a.volumes, function(b, c) {
h++;
var d = a.name + "-" + h;
f.push({
name:d,
emptyDir:{}
}), g.push({
name:d,
mountPath:c
});
}), !a.namespace) {
var i = {
kind:"ImageStream",
apiVersion:"v1",
metadata:{
name:a.name,
labels:a.labels
},
spec:{
tags:[ {
name:a.tag,
annotations:_.assign({
"openshift.io/imported-from":a.image
}, d),
from:{
kind:"DockerImage",
name:a.image
},
importPolicy:{}
} ]
}
};
c.push(i);
}
var j = {
kind:"DeploymentConfig",
apiVersion:"v1",
metadata:{
name:a.name,
labels:a.labels,
annotations:d
},
spec:{
strategy:{
resources:{}
},
triggers:[ {
type:"ConfigChange"
}, {
type:"ImageChange",
imageChangeParams:{
automatic:!0,
containerNames:[ a.name ],
from:{
kind:"ImageStreamTag",
name:(a.namespace ? a.image :a.name) + ":" + a.tag,
namespace:a.namespace
}
}
} ],
replicas:1,
test:!1,
selector:{
app:a.name,
deploymentconfig:a.name
},
template:{
metadata:{
labels:_.assign({
deploymentconfig:a.name
}, a.labels),
annotations:d
},
spec:{
volumes:f,
containers:[ {
name:a.name,
image:a.image,
ports:a.ports,
env:e,
volumeMounts:g
} ],
resources:{}
}
}
},
status:{}
};
_.first(a.pullSecrets).name && (j.spec.template.spec.imagePullSecrets = a.pullSecrets), c.push(j);
var k;
return a.ports.length && (k = {
kind:"Service",
apiVersion:"v1",
metadata:{
name:a.name,
labels:a.labels,
annotations:d
},
spec:{
selector:{
deploymentconfig:a.name
},
ports:_.map(a.ports, function(a) {
return b.getServicePort(a);
})
}
}, c.push(k)), c;
}, h = function(a) {
return _.map(_.get(a, "image.dockerImageMetadata.Config.Env"), function(a) {
var b = a.indexOf("="), c = "", d = "";
return b > 0 ? (c = a.substring(0, b), b + 1 < a.length && (d = a.substring(b + 1))) :c = a, {
name:c,
value:d
};
});
};
return {
findImage:d,
getVolumes:f,
runsAsRoot:e,
getResources:g,
getEnvironment:h
};
} ]), angular.module("openshiftConsole").service("KeywordService", function() {
var a = function(a) {
if (!a) return [];
var b = _.uniq(a.match(/\S+/g));
return b.sort(function(a, b) {
return b.length - a.length;
}), _.map(b, function(a) {
return new RegExp(_.escapeRegExp(a), "i");
});
}, b = function(a, b, c) {
var d = a;
return c.length ? (angular.forEach(c, function(a) {
var c = function(c) {
var d;
for (d = 0; d < b.length; d++) {
var e = _.get(c, b[d]);
if (e && a.test(e)) return !0;
}
return !1;
};
d = _.filter(d, c);
}), d) :d;
};
return {
filterForKeywords:b,
generateKeywords:a
};
}), angular.module("openshiftConsole").factory("ConversionService", function() {
var a = function(a) {
return a ? a / 1048576 :a;
}, b = function(a) {
return a ? a / 1024 :a;
}, c = function(a) {
return a ? a / 1e3 :a;
};
return {
bytesToMiB:a,
bytesToKiB:b,
millicoresToCores:c
};
}), angular.module("openshiftConsole").service("BreadcrumbsService", [ "$filter", "APIService", "Navigate", function(a, b, c) {
var d = a("annotation"), e = a("displayName"), f = function(a) {
switch (a) {
case "DeploymentConfig":
return "Deployments";

default:
return _.startCase(b.kindToResource(a, !0));
}
}, g = function(a, d, g, h) {
var i, j = [], k = h.humanizedKind || f(d);
return h.includeProject && (i = h.project ? e(h.project) :g, j.push({
title:i,
link:c.projectOverviewURL(g)
})), j.push({
title:k,
link:c.resourceListURL(b.kindToResource(d), g)
}), h.parent && j.push(h.parent), h.subpage ? (j.push({
title:h.displayName || a,
link:c.resourceURL(a, d, g)
}), j.push({
title:h.subpage
})) :j.push({
title:h.displayName || a
}), j;
}, h = function(b, e) {
e = e || {};
var f, h = d(b, "deploymentConfig");
return h && (e.humanizedKind = "Deployments", e.parent = {
title:h,
link:c.configURLForResource(b)
}, f = a("annotation")(b, "deploymentVersion"), f && (e.displayName = "#" + f)), g(b.metadata.name, b.kind, b.metadata.namespace, e);
}, i = function(a, b) {
switch (a.kind) {
case "ReplicationController":
return h(a, b);

default:
return g(a.metadata.name, a.kind, a.metadata.namespace, b);
}
}, j = function(a) {
return a = a || {}, a.object ? i(a.object, a) :a.kind && a.name && a.namespace ? g(a.name, a.kind, a.namespace, a) :[];
};
return {
getBreadcrumbs:j
};
} ]), angular.module("openshiftConsole").factory("QuotaService", [ "APIService", "$filter", "$q", "DataService", "Logger", function(a, b, c, d, e) {
var f = b("isNil"), g = b("usageValue"), h = function(a) {
return _.every(a.spec.containers, function(a) {
var b = _.some(_.get(a, "resources.requests"), function(a) {
return !f(a) && 0 !== g(a);
}), c = _.some(_.get(a, "resources.limits"), function(a) {
return !f(a) && 0 !== g(a);
});
return !b && !c;
});
}, i = function(a) {
return _.has(a, "spec.activeDeadlineSeconds");
}, j = function(a, b) {
var c = h(a), d = i(a);
return _.filter(b, function(a) {
var b = function(a) {
switch (a) {
case "Terminating":
return d;

case "NotTerminating":
return !d;

case "BestEffort":
return c;

case "NotBestEffort":
return !c;
}
return !0;
}, e = a.spec.quota ? a.spec.quota.scopes :a.spec.scopes;
return _.every(e, b);
});
}, k = function(a, b) {
return a ? "Pod" === a.kind ? j(a, b) :_.has(a, "spec.template") ? j(a.spec.template, b) :b :b;
}, l = b("humanizeQuotaResource"), m = b("humanizeKind"), n = function(a, b, c) {
var d = a.status.total || a.status;
if (g(d.hard[c]) <= g(d.used[c])) {
var e, f;
return e = "Pod" === b.kind ? "You will not be able to create the " + m(b.kind) + " '" + b.metadata.name + "'." :"You can still create " + m(b.kind) + " '" + b.metadata.name + "' but no pods will be created until resources are freed.", f = "pods" === c ? "You are at your quota for pods." :"You are at your quota for " + l(c) + " on pods.", {
type:"Pod" === b.kind ? "error" :"warning",
message:f,
details:e,
links:[ {
href:"project/" + a.metadata.namespace + "/quota",
label:"View Quota",
target:"_blank"
} ]
};
}
return null;
}, o = {
cpu:"resources.requests.cpu",
"requests.cpu":"resources.requests.cpu",
"limits.cpu":"resources.limits.cpu",
memory:"resources.requests.memory",
"requests.memory":"resources.requests.memory",
"limits.memory":"resources.limits.memory"
}, p = function(a, b, c, d) {
var e = a.status.total || a.status, f = o[d], h = 0;
if (_.each(c.spec.containers, function(a) {
var b = _.get(a, f);
b && (h += g(b));
}), g(e.hard[d]) < g(e.used[d]) + h) {
var i;
return i = "Pod" === b.kind ? "You may not be able to create the " + m(b.kind) + " '" + b.metadata.name + "'." :"You can still create " + m(b.kind) + " '" + b.metadata.name + "' but you may not have pods created until resources are freed.", {
type:"warning",
message:"You are close to your quota for " + l(d) + " on pods.",
details:i,
links:[ {
href:"project/" + a.metadata.namespace + "/quota",
label:"View Quota",
target:"_blank"
} ]
};
}
}, q = function(a, b) {
var c = [], d = "Pod" === a.kind ? a :_.get(a, "spec.template");
return d ? (_.each([ "cpu", "memory", "requests.cpu", "requests.memory", "limits.cpu", "limits.memory", "pods" ], function(e) {
var g = b.status.total || b.status;
if (("Pod" !== a.kind || "pods" !== e) && !f(g.hard[e])) {
var h = n(b, a, e);
if (h) c.push(h); else if ("pods" !== e) {
var i = p(b, a, d, e);
i && c.push(i);
}
}
}), c) :c;
}, r = function(b, c, d) {
var e = [];
return b && c ? (_.each(b, function(b) {
var h = k(b, c), i = k(b, d), j = a.objectToResourceGroupVersion(b), l = a.kindToResource(b.kind, !0), n = m(b.kind), o = "";
j.group && (o = j.group + "/"), o += j.resource;
var p = function(a) {
var c = a.status.total || a.status;
!f(c.hard[o]) && g(c.hard[o]) <= g(c.used[o]) && e.push({
type:"error",
message:"You are at your quota of " + c.hard[o] + " " + ("1" === c.hard[o] ? n :l) + " in this project.",
details:"You will not be able to create the " + n + " '" + b.metadata.name + "'.",
links:[ {
href:"project/" + a.metadata.namespace + "/quota",
label:"View Quota",
target:"_blank"
} ]
}), e = e.concat(q(b, a));
};
_.each(h, p), _.each(i, p);
}), e) :e;
}, s = function(a, b) {
var f, g, h = [];
return h.push(d.list("resourcequotas", b).then(function(a) {
f = a.by("metadata.name"), e.log("quotas", f);
})), h.push(d.list("appliedclusterresourcequotas", b).then(function(a) {
g = a.by("metadata.name"), e.log("cluster quotas", g);
})), c.all(h).then(function() {
var b = r(a, f, g);
return {
quotaAlerts:b
};
});
}, t = function(a, b) {
var c = function(a) {
var b = a.status.total || a.status;
return _.some(b.hard, function(a, c) {
if ("resourcequotas" === c) return !1;
if (a = g(a), !a) return !1;
var d = g(_.get(b, [ "used", c ]));
return !!d && a <= d;
});
};
return _.some(a, c) || _.some(b, c);
};
return {
filterQuotasForResource:k,
isBestEffortPod:h,
isTerminatingPod:i,
getResourceLimitAlerts:q,
getQuotaAlerts:r,
getLatestQuotaAlerts:s,
isAnyQuotaExceeded:t
};
} ]), angular.module("openshiftConsole").factory("LabelsService", function() {
var a = function(a) {
return _.get(a, "spec.template", {
metadata:{
labels:{}
}
});
};
return {
groupBySelector:function(b, c, d) {
var e = {}, f = {};
return d = d || {}, _.each(c, function(a) {
f[a.metadata.uid] = new LabelSelector(a.spec.selector);
}), _.each(b, function(b) {
if (!d.include || d.include(b)) {
var g = _.filter(c, function(c) {
var e = f[c.metadata.uid];
return d.matchTemplate ? e.matches(a(b)) :d.matchSelector ? e.covers(new LabelSelector(b.spec.selector)) :e.matches(b);
});
g.length || _.set(e, [ "", b.metadata.name ], b), _.each(g, function(a) {
var c = _.get(a, d.key || "metadata.name", "");
_.set(e, [ c, b.metadata.name ], b);
});
}
}), e;
}
};
}), angular.module("openshiftConsole").factory("CatalogService", [ "$filter", "Constants", "KeywordService", function(a, b, c) {
var d = a("tags"), e = {};
_.each(b.CATALOG_CATEGORIES, function(a) {
_.each(a.items, function(a) {
e[a.id] = a;
var b = _.get(a, "subcategories", []);
_.each(b, function(a) {
_.each(a.items, function(a) {
e[a.id] = a;
});
});
});
});
var f = function(a) {
return e[a];
}, g = function(a, b) {
a = a.toLowerCase();
var c;
for (c = 0; c < b.length; c++) {
var d = b[c].toLowerCase();
if (a === d) return !0;
}
return !1;
}, h = function(a, b) {
var c = _.get(a, "categoryAliases", []), d = [ a.id ].concat(c);
return _.some(d, function(a) {
return g(a, b);
});
}, i = function(a) {
var b = {};
return _.each(a, function(a) {
if (a.status) {
var c = {};
a.spec && a.spec.tags && _.each(a.spec.tags, function(a) {
var b = _.get(a, "annotations.tags");
b && (c[a.name] = b.split(/\s*,\s*/));
});
var d = !1;
_.each(e, function(e) {
var f = function(a) {
return _.some(a.status.tags, function(a) {
var b = c[a.tag] || [];
return h(e, b) && g("builder", b) && !g("hidden", b);
});
};
f(a) && (b[e.id] = b[e.id] || [], b[e.id].push(a), d = !0);
});
var f;
d || (f = _.some(a.status.tags, function(a) {
var b = c[a.tag] || [];
return g("builder", b) && !g("hidden", b);
}), f && (b[""] = b[""] || [], b[""].push(a)));
}
}), b;
}, j = function(a) {
var b = {};
return _.each(a, function(a) {
var c = d(a), f = !1;
_.each(e, function(d) {
h(d, c) && (b[d.id] = b[d.id] || [], b[d.id].push(a), f = !0);
}), f || (b[""] = b[""] || [], b[""].push(a));
}), b;
}, k = a("displayName"), l = function(a, b) {
if (!b.length) return a;
var c = [];
return _.each(a, function(a) {
var d = _.get(a, "metadata.name", ""), e = k(a, !0), f = _.indexBy(a.spec.tags, "name");
_.each(b, function(b) {
b.test(d) || e && b.test(e) || _.each(a.spec.tags, function(a) {
var c = _.get(a, "annotations.tags", "");
if (!/\bbuilder\b/.test(c) || /\bhidden\b/.test(c)) return void delete f[a.name];
if (!b.test(a.name)) {
var d = _.get(a, "annotations.description");
d && b.test(d) || delete f[a.name];
}
});
});
var g;
_.isEmpty(f) || (g = angular.copy(a), g.status.tags = _.filter(g.status.tags, function(a) {
return f[a.tag];
}), c.push(g));
}), c;
}, m = [ "metadata.name", 'metadata.annotations["openshift.io/display-name"]', "metadata.annotations.description" ], n = function(a, b) {
return c.filterForKeywords(a, m, b);
};
return {
getCategoryItem:f,
categorizeImageStreams:i,
categorizeTemplates:j,
filterImageStreams:l,
filterTemplates:n
};
} ]), angular.module("openshiftConsole").factory("ModalsService", [ "$uibModal", function(a) {
return {
confirm:function(b) {
var c = a.open({
animation:!0,
templateUrl:"views/modals/confirm.html",
controller:"ConfirmModalController",
resolve:{
modalConfig:b
}
});
return c.result;
},
confirmSaveLog:function(b) {
var c = a.open({
animation:!0,
templateUrl:"views/modals/confirm-save-log.html",
controller:"ConfirmSaveLogController",
resolve:{
object:b
}
});
return c.result;
},
showJenkinsfileExamples:function() {
a.open({
animation:!0,
templateUrl:"views/modals/jenkinsfile-examples-modal.html",
controller:"JenkinsfileExamplesModalController",
size:"lg"
});
},
showComputeUnitsHelp:function() {
a.open({
animation:!0,
templateUrl:"views/modals/about-compute-units-modal.html",
controller:"AboutComputeUnitsModalController"
});
}
};
} ]), angular.module("openshiftConsole").factory("CLIHelp", [ "$filter", function(a) {
var b = a("annotation"), c = function(a, c) {
if (!a) return null;
var d, e, f;
switch (a.kind) {
case "Pod":
d = "oc logs " + a.metadata.name, c && (d += " -c " + c);
break;

case "DeploymentConfig":
d = "oc logs dc/" + a.metadata.name;
break;

case "ReplicationController":
e = b(a, "deploymentConfig"), f = b(a, "deploymentVersion"), d = e && f ? "oc logs --version " + f + " dc/" + e :"oc logs rc/" + a.metadata.name;
break;

case "BuildConfig":
d = "oc logs bc/" + a.metadata.name;
break;

case "Build":
e = b(a, "buildConfig"), f = b(a, "buildNumber"), d = "oc logs --version " + f + " bc/" + e;
break;

default:
return null;
}
return d += " -n " + a.metadata.namespace;
};
return {
getLogsCommand:c
};
} ]), angular.module("openshiftConsole").factory("HTMLService", function() {
return {
linkify:function(a, b, c) {
return a ? (c || (a = _.escape(a)), a.replace(/https?:\/\/[A-Za-z0-9._%+-]+\S*[^\s.;,(){}<>"\u201d\u2019]/gm, function(a) {
return b ? '<a href="' + a + '" target="' + b + '">' + a + "</a>" :'<a href="' + a + '">' + a + "</a>";
})) :a;
}
};
}), angular.module("openshiftConsole").factory("EnvironmentService", [ "$filter", "keyValueEditorUtils", function(a, b) {
var c = a("altTextForValueFrom"), d = function(a) {
return _.get(a, "spec.template.spec.containers", []);
};
return {
normalize:function(a) {
var b = d(a);
_.each(b, function(a) {
a.env = a.env || [], _.each(a.env, c);
});
},
compact:function(a) {
var c = d(a);
_.each(c, function(a) {
a.env = b.compactEntries(a.env);
});
},
copyAndNormalize:function(a) {
var b = angular.copy(a);
return this.normalize(b), b;
},
isEnvironmentEqual:function(a, b) {
var c = d(a), e = d(b);
if (c.length !== e.length) return !1;
var f, g, h;
for (f = 0; f < c.length; f++) {
if (c[f].name !== e[f].name) return !1;
if (g = c[f].env || [], h = e[f].env || [], !_.isEqual(g, h)) return !1;
}
return !0;
},
mergeEdits:function(a, b) {
var c, e = angular.copy(b), f = d(a), g = d(e);
for (c = 0; c < g.length; c++) g[c].env = _.get(f, [ c, "env" ], []);
return e;
}
};
} ]), angular.module("openshiftConsole").controller("ProjectsController", [ "$scope", "$filter", "$location", "$route", "$timeout", "AlertMessageService", "AuthService", "DataService", "KeywordService", "Logger", "ProjectsService", function(a, b, c, d, e, f, g, h, i, j, k) {
var l, m, n = [], o = [];
a.alerts = a.alerts || {}, a.loading = !0, a.showGetStarted = !1, a.canCreate = void 0, a.search = {
text:""
};
var p, q = [ "metadata.name", 'metadata.annotations["openshift.io/display-name"]', 'metadata.annotations["openshift.io/description"]', 'metadata.annotations["openshift.io/requester"]' ], r = function() {
a.projects = i.filterForKeywords(m, q, o);
}, s = b("displayName"), t = function() {
var b = _.get(a, "sortConfig.currentField.id");
p !== b && (a.sortConfig.isAscending = "metadata.creationTimestamp" !== b);
var c = function(a) {
return s(a).toLowerCase();
}, d = a.sortConfig.isAscending ? "asc" :"desc";
switch (b) {
case 'metadata.annotations["openshift.io/display-name"]':
m = _.sortByOrder(l, [ c, "metadata.name" ], [ d ]);
break;

case 'metadata.annotations["openshift.io/requester"]':
m = _.sortByOrder(l, [ b, c ], [ d, "asc" ]);
break;

default:
m = _.sortByOrder(l, [ b ], [ d ]);
}
p = b;
}, u = function() {
t(), r();
};
a.sortConfig = {
fields:[ {
id:'metadata.annotations["openshift.io/display-name"]',
title:"Display Name",
sortType:"alpha"
}, {
id:"metadata.name",
title:"Name",
sortType:"alpha"
}, {
id:'metadata.annotations["openshift.io/requester"]',
title:"Creator",
sortType:"alpha"
}, {
id:"metadata.creationTimestamp",
title:"Creation Date",
sortType:"alpha"
} ],
isAscending:!0,
onSortChange:u
}, f.getAlerts().forEach(function(b) {
a.alerts[b.name] = b.data;
}), f.clearAlerts(), a.$watch("search.text", _.debounce(function(b) {
a.keywords = o = i.generateKeywords(b), a.$apply(r);
}, 50, {
maxWait:250
})), g.withUser().then(function() {
n.push(h.watch("projects", a, function(b) {
l = _.toArray(b.by("metadata.name")), a.loading = !1, a.showGetStarted = _.isEmpty(l), u();
}));
}), k.canCreate().then(function() {
a.canCreate = !0;
}, function(b) {
a.canCreate = !1;
var c = b.data || {};
if (403 !== b.status) {
var d = "Failed to determine create project permission";
return 0 !== b.status && (d += " (" + b.status + ")"), void j.warn(d);
}
if (c.details) {
var e = [];
_.forEach(c.details.causes || [], function(a) {
a.message && e.push(a.message);
}), e.length > 0 && (a.newProjectMessage = e.join("\n"));
}
}), a.$on("$destroy", function() {
h.unwatchAll(n);
});
} ]), angular.module("openshiftConsole").controller("PodsController", [ "$routeParams", "$scope", "DataService", "ProjectsService", "AlertMessageService", "$filter", "LabelFilter", "Logger", function(a, b, c, d, e, f, g, h) {
b.projectName = a.project, b.pods = {}, b.unfilteredPods = {}, b.labelSuggestions = {}, b.alerts = b.alerts || {}, b.emptyMessage = "Loading...", e.getAlerts().forEach(function(a) {
b.alerts[a.name] = a.data;
}), e.clearAlerts();
var i = [];
d.get(a.project).then(_.spread(function(a, d) {
function e() {
g.getLabelSelector().isEmpty() || !$.isEmptyObject(b.pods) || $.isEmptyObject(b.unfilteredPods) ? delete b.alerts.pods :b.alerts.pods = {
type:"warning",
details:"The active filters are hiding all pods."
};
}
b.project = a, i.push(c.watch("pods", d, function(a) {
b.unfilteredPods = a.by("metadata.name"), b.pods = g.getLabelSelector().select(b.unfilteredPods), b.emptyMessage = "No pods to show", g.addLabelSuggestionsFromResources(b.unfilteredPods, b.labelSuggestions), g.setLabelSuggestions(b.labelSuggestions), e(), h.log("pods (subscribe)", b.unfilteredPods);
})), g.onActiveFiltersChanged(function(a) {
b.$apply(function() {
b.pods = a.select(b.unfilteredPods), e();
});
}), b.$on("$destroy", function() {
c.unwatchAll(i);
});
}));
} ]), angular.module("openshiftConsole").controller("PodController", [ "$scope", "$filter", "$routeParams", "$timeout", "$uibModal", "Logger", "DataService", "EnvironmentService", "ImageStreamResolver", "MetricsService", "PodsService", "ProjectsService", function(a, b, c, d, e, f, g, h, i, j, k, l) {
a.projectName = c.project, a.pod = null, a.imageStreams = {}, a.imagesByDockerReference = {}, a.imageStreamImageRefByDockerReference = {}, a.builds = {}, a.alerts = {}, a.terminalDisconnectAlert = {}, a.renderOptions = a.renderOptions || {}, a.renderOptions.hideFilterWidget = !0, a.logOptions = {}, a.terminalTabWasSelected = !1, a.breadcrumbs = [ {
title:"Pods",
link:"project/" + c.project + "/browse/pods"
}, {
title:c.pod
} ], a.terminalDisconnectAlert.disconnect = {
type:"warning",
message:"This terminal has been disconnected. If you reconnect, your terminal history will be lost."
}, a.noContainersYet = !0, a.selectedTab = {};
var m = [], n = null;
j.isAvailable().then(function(b) {
a.metricsAvailable = b;
});
var o = function(b) {
a.logOptions.container = c.container || b.spec.containers[0].name, a.logCanRun = !_.includes([ "New", "Pending", "Unknown" ], b.status.phase);
}, p = function() {
if (a.pod) {
var b = _.find(a.pod.status.containerStatuses, {
name:a.logOptions.container
}), c = _.get(b, "state"), d = _.head(_.keys(c)), e = _.includes([ "running", "waiting", "terminated" ], d) ? d :"", f = _.get(b, "lastState"), g = _.head(_.keys(f)), h = _.get(b, "state.waiting");
angular.extend(a, {
containerStatusKey:e,
containerStateReason:_.get(c, [ d, "reason" ])
}), h ? angular.extend(a, {
lasStatusKey:g,
containerStartTime:_.get(f, [ g, "startedAt" ]),
containerEndTime:_.get(f, [ g, "finishedAt" ])
}) :angular.extend(a, {
containerStartTime:_.get(c, [ d, "startedAt" ]),
containerEndTime:_.get(c, [ d, "finishedAt" ])
});
}
}, q = function() {
var a = $("<span>").css({
position:"absolute",
top:"-100px"
}).addClass("terminal-font").text(_.repeat("x", 10)).appendTo("body"), b = {
width:a.width() / 10,
height:a.height()
};
return a.remove(), b;
}, r = q(), s = $(window), t = function(b) {
b || (b = 0), r.height && r.width && a.selectedTab.terminal && !(b > 10) && a.$apply(function() {
var c = $(".container-terminal-wrapper").get(0);
if (!c) return void d(function() {
t(b + 1);
}, 50);
var e = c.getBoundingClientRect();
if (0 === e.left && 0 === e.top && 0 === e.width && 0 === e.height) return void d(function() {
t(b + 1);
}, 50);
var f = s.width(), g = s.height(), h = f - e.left - 40, i = g - e.top - 50;
a.terminalCols = Math.max(_.floor(h / r.width), 80), a.terminalRows = Math.max(_.floor(i / r.height), 24);
});
};
a.$watch("selectedTab.terminal", function(a) {
a ? (r.height && r.width ? $(window).on("resize.terminalsize", _.debounce(t, 100)) :f.warn("Unable to calculate the bounding box for a character.  Terminal will not be able to resize."), d(t, 0)) :$(window).off("resize.terminalsize");
}), a.onTerminalSelectChange = function(b) {
_.each(a.containerTerminals, function(a) {
a.isVisible = !1;
}), b.isVisible = !0, b.isUsed = !0, a.selectedTerminalContainer = b;
};
var u = function(a) {
var b = _.get(a, "state", {});
return _.head(_.keys(b));
}, v = function() {
var b = [];
_.each(a.pod.spec.containers, function(c) {
var d = _.find(a.pod.status.containerStatuses, {
name:c.name
}), e = u(d);
b.push({
containerName:c.name,
isVisible:!1,
isUsed:!1,
containerState:e
});
});
var c = _.head(b);
return c.isVisible = !0, c.isUsed = !0, a.selectedTerminalContainer = c, b;
}, w = function(b) {
a.noContainersYet && (a.noContainersYet = 0 === a.containersRunning(b.status.containerStatuses));
}, x = function(b) {
_.each(b, function(b) {
var c = _.find(a.pod.status.containerStatuses, {
name:b.containerName
}), d = u(c);
b.containerState = d;
});
}, y = b("altTextForValueFrom"), z = function() {
var b = angular.copy(_.get(a, "pod.spec.containers", []));
_.each(b, function(a) {
a.env = a.env || [], _.each(a.env, y);
}), a.containersEnv = b;
}, A = b("annotation"), B = function(b, c) {
a.loaded = !0, a.pod = b, a.dcName = A(b, "deploymentConfig"), a.rcName = A(b, "deployment"), a.deploymentVersion = A(b, "deploymentVersion"), o(b), p(), z(), "DELETED" === c && (a.alerts.deleted = {
type:"warning",
message:"This pod has been deleted."
});
};
l.get(c.project).then(_.spread(function(d, h) {
n = h, a.project = d, a.projectContext = h, g.get("pods", c.pod, h).then(function(b) {
B(b);
var d = {};
d[b.metadata.name] = b, a.containerTerminals = v(), w(b), i.fetchReferencedImageStreamImages(d, a.imagesByDockerReference, a.imageStreamImageRefByDockerReference, n), m.push(g.watchObject("pods", c.pod, h, function(b, c) {
B(b, c), x(a.containerTerminals), w(b);
}));
}, function(c) {
a.loaded = !0, a.alerts.load = {
type:"error",
message:"The pod details could not be loaded.",
details:"Reason: " + b("getErrorDetails")(c)
};
}), a.$watch("logOptions.container", p), m.push(g.watch("imagestreams", h, function(b) {
a.imageStreams = b.by("metadata.name"), i.buildDockerRefMapForImageStreams(a.imageStreams, a.imageStreamImageRefByDockerReference), i.fetchReferencedImageStreamImages(a.pods, a.imagesByDockerReference, a.imageStreamImageRefByDockerReference, h), f.log("imagestreams (subscribe)", a.imageStreams);
})), m.push(g.watch("builds", h, function(b) {
a.builds = b.by("metadata.name"), f.log("builds (subscribe)", a.builds);
}));
var j, l = function() {
var c = a.debugPod;
j && (g.unwatch(j), j = null), $(window).off("beforeunload.debugPod"), c && (g["delete"]("pods", c.metadata.name, h, {
gracePeriodSeconds:0
}).then(_.noop, function(d) {
a.alerts["debug-container-error"] = {
type:"error",
message:"Could not delete pod " + c.metadata.name,
details:"Reason: " + b("getErrorDetails")(d)
};
}), a.debugPod = null);
};
a.debugTerminal = function(c) {
var d = k.generateDebugPod(a.pod, c);
return d ? void g.create("pods", null, d, h).then(function(b) {
var f = _.find(a.pod.spec.containers, {
name:c
});
a.debugPod = b, $(window).on("beforeunload.debugPod", function() {
return "Are you sure you want to leave with the debug terminal open? The debug pod will not be deleted unless you close the dialog.";
}), j = g.watchObject("pods", d.metadata.name, h, function(b) {
a.debugPod = b;
});
var i = e.open({
animation:!0,
templateUrl:"views/modals/debug-terminal.html",
controller:"DebugTerminalModalController",
scope:a,
resolve:{
container:function() {
return f;
},
image:function() {
return _.get(a, [ "imagesByDockerReference", f.image ]);
}
},
backdrop:"static"
});
i.result.then(l);
}, function(d) {
a.alerts["debug-container-error"] = {
type:"error",
message:"Could not debug container " + c,
details:"Reason: " + b("getErrorDetails")(d)
};
}) :void (a.alerts["debug-container-error"] = {
type:"error",
message:"Could not debug container " + c
});
}, a.containersRunning = function(a) {
var b = 0;
return a && a.forEach(function(a) {
a.state && a.state.running && b++;
}), b;
}, a.showDebugAction = function(c) {
if ("Completed" === _.get(a, "pod.status.phase")) return !1;
if (A(a.pod, "openshift.io/build.name")) return !1;
if (b("isDebugPod")(a.pod)) return !1;
var d = _.get(c, "state.waiting.reason");
return "ImagePullBackOff" !== d && "ErrImagePull" !== d && (!_.get(c, "state.running") || !c.ready);
}, a.$on("$destroy", function() {
g.unwatchAll(m), l(), $(window).off("resize.terminalsize");
});
}));
} ]), angular.module("openshiftConsole").controller("OverviewController", [ "$filter", "$routeParams", "$scope", "AlertMessageService", "BuildsService", "DataService", "DeploymentsService", "LabelsService", "Logger", "PodsService", "ProjectsService", "RoutesService", "ServicesService", "Navigate", "MetricsService", "QuotaService", function(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p) {
c.projectName = b.project, c.renderOptions = c.renderOptions || {}, c.renderOptions.showLoading = !0, c.renderOptions.showGetStarted = !1, c.alerts = c.alerts || {}, d.getAlerts().forEach(function(a) {
c.alerts[a.name] = a.data;
}), d.clearAlerts();
var q, r, s, t, u, v, w, x, y, z, A, B, C, D = [], E = a("isJenkinsPipelineStrategy"), F = a("annotation"), G = a("label"), H = a("imageObjectRef"), I = a("isRecentDeployment"), J = {}, K = {}, L = function() {
J = {}, _.each(q, function(a) {
var b = _.get(a, "spec.alternateBackends", []), c = _.filter(b, {
kind:"Service"
});
if (!_.isEmpty(c)) {
var d = _.get(a, "spec.to.name");
K[d] = !0, _.each(c, function(a) {
J[a.name] = !0;
});
}
});
}, M = function(a) {
var b = _.get(a, "metadata.name");
return _.has(K, b);
}, N = function(a) {
var b = _.get(a, "metadata.name");
return _.has(J, b);
}, O = function() {
c.routesByService = l.groupByService(q), L();
}, P = function() {
r && t && (c.deploymentConfigs = t, c.deploymentConfigsByService = h.groupBySelector(t, r, {
matchTemplate:!0
}));
}, Q = function() {
r && s && (c.deployments = s, c.deploymentsByService = h.groupBySelector(s, r, {
matchTemplate:!0
}));
}, R = function(a) {
if (_.get(a, "status.replicas")) return !0;
var b = F(a, "deploymentConfig");
if (!b) return !0;
if (!t) return !1;
var c = t[b];
return !!c && I(a, c);
}, S = a("mostRecent"), T = function() {
if (u) {
v = g.groupByDeploymentConfig(u);
var a = {}, b = {};
_.each(v, function(c, d) {
a[d] = g.getActiveDeployment(c), b[d] = S(c);
}), c.scalableReplicationControllerByDC = a, c.mostRecentReplicationControllerByDC = b, c.vanillaReplicationControllersByService = h.groupBySelector(v[""], r, {
matchTemplate:!0
}), c.visibleRCByDC = {}, _.each(v, function(a, b) {
c.visibleRCByDC[b] = _.filter(a, R);
});
}
}, U = function() {
r && u && (c.replicationControllersByService = h.groupBySelector(u, r, {
matchTemplate:!0
}));
}, V = function() {
r && w && (c.replicaSetsByService = h.groupBySelector(w, r, {
matchTemplate:!0
}));
}, W = function(a, b) {
if (_.get(a, "status.replicas")) return !0;
var c = g.getRevision(a);
return !c || !!b && g.getRevision(b) === c;
}, X = function() {
if (w && s) {
c.replicaSetsByDeployment = h.groupBySelector(w, s, {
matchSelector:!0
});
var a = {};
_.each(c.replicaSetsByDeployment, function(b, c) {
var d = _.get(s, [ c ]);
a[c] = g.getActiveReplicaSet(b, d);
}), c.scalableReplicaSetsByDeployment = a, c.visibleRSByDeploymentAndService = {}, _.each(c.replicaSetsByService, function(a, b) {
c.visibleRSByDeploymentAndService[b] = {};
var d = h.groupBySelector(a, s, {
matchSelector:!0
});
_.each(d, function(a, d) {
c.visibleRSByDeploymentAndService[b][d] = _.filter(a, function(a) {
var b = s[d];
return W(a, b);
});
});
});
}
}, Y = function() {
r && x && (c.statefulSetsByService = h.groupBySelector(x, r, {
matchTemplate:!0
}));
}, Z = function() {
C = {}, _.each(B, function(a) {
var b = a.spec.scaleRef.name, c = a.spec.scaleRef.kind;
b && c && (_.has(C, [ c, b ]) || _.set(C, [ c, b ], []), C[c][b].push(a));
});
}, $ = function(a) {
return "Succeeded" !== a.status.phase && "Failed" !== a.status.phase && (!G(a, "openshift.io/deployer-pod-for.name") && (!F(a, "openshift.io/build.name") && "slave" !== G(a, "jenkins")));
}, aa = function() {
if (y && u && w && x) {
var a = _.toArray(u).concat(_.toArray(w)).concat(_.toArray(x));
c.podsByOwnerUID = h.groupBySelector(y, a, {
key:"metadata.uid"
});
var b = c.podsByOwnerUID[""];
c.monopodsByService = h.groupBySelector(b, r, {
include:$
});
}
}, ba = {}, ca = function(a) {
return !!ba[a.metadata.name];
}, da = function(a) {
var b = _.get(a, "metadata.name");
if (!b) return !1;
var d = _.get(c, [ "childServicesByParent", b ], []);
return !_.isEmpty(d);
}, ea = function(a, b) {
var d = r[b];
d && (ba[b] = d, c.childServicesByParent[a] = c.childServicesByParent[a] || [], c.childServicesByParent[a].push(d));
}, fa = {};
c.isDuplicateApp = function(a) {
return _.size(fa[a]) > 1;
};
var ga = function() {
r && q && (c.services = r, ba = {}, c.childServicesByParent = {}, _.each(r, function(a, b) {
var c = m.getDependentServices(a);
_.each(c, function(a) {
ea(b, a);
});
}), fa = {}, c.topLevelServices = _.chain(r).filter(function(a) {
return !!da(a) || (!!M(a) || !ca(a) && !N(a));
}).sortByAll([ "metadata.labels.app", "metadata.name" ]).value(), _.each(c.topLevelServices, function(a) {
var b = _.get(a, "metadata.labels.app");
b && _.set(fa, [ b, a.metadata.name ], a);
}));
}, ha = function() {
r && q && (c.routeWarningsByService = {}, _.each(r, function(a) {
_.each(c.routesByService[a.metadata.name], function(b) {
var d = l.getRouteWarnings(b, a);
_.set(c, [ "routeWarningsByService", a.metadata.name, b.metadata.name ], d);
});
}));
}, ia = function(a) {
var b = H(_.get(a, "spec.output.to"), a.metadata.namespace);
c.recentBuildsByOutputImage[b] = c.recentBuildsByOutputImage[b] || [], c.recentBuildsByOutputImage[b].push(a);
}, ja = a("buildConfigForBuild"), ka = function(a) {
if (z) {
var b = ja(a), d = z[b];
if (d) {
var f = e.usesDeploymentConfigs(d);
_.each(f, function(b) {
c.recentPipelinesByDC[b] = c.recentPipelinesByDC[b] || [], c.recentPipelinesByDC[b].push(a);
});
}
}
}, la = function() {
A && (c.recentPipelinesByDC = {}, c.recentBuildsByOutputImage = {}, _.each(e.interestingBuilds(A), function(a) {
return E(a) ? void ka(a) :void ia(a);
}), c.pipelinesForDC = {}, _.each(z, function(a) {
_.each(e.usesDeploymentConfigs(a), function(b) {
c.pipelinesForDC[b] = c.pipelinesForDC[b] || [], c.pipelinesForDC[b].push(a);
});
}));
}, ma = function() {
var a = _.isEmpty(r) && _.isEmpty(t) && _.isEmpty(c.monopodsByService) && _.isEmpty(u) && _.isEmpty(w) && _.isEmpty(x), b = r && y && u && w && x;
c.renderOptions.showGetStarted = b && a, c.renderOptions.showLoading = !b && a;
}, na = function() {
var a = d.isAlertPermanentlyHidden("overview-quota-limit-reached", c.projectName);
if (!a && p.isAnyQuotaExceeded(c.quotas, c.clusterQuotas)) {
if (c.alerts.quotaExceeded) return;
c.alerts.quotaExceeded = {
type:"warning",
message:"Quota limit has been reached.",
links:[ {
href:"project/" + c.projectName + "/quota",
label:"View Quota"
}, {
href:"",
label:"Don't Show Me Again",
onClick:function() {
return d.permanentlyHideAlert("overview-quota-limit-reached", c.projectName), !0;
}
} ]
};
} else delete c.alerts.quotaExceeded;
};
c.viewPodsForDeployment = function(a) {
_.isEmpty(c.podsByOwnerUID[a.metadata.uid]) || n.toPodsForDeployment(a);
}, c.isScalableReplicationController = function(a) {
return g.isScalable(a, t, _.get(C, "DeploymentConfig"), _.get(C, "ReplicationController"), c.scalableReplicationControllerByDC);
}, c.isDeploymentLatest = function(a) {
var b = F(a, "deploymentConfig");
if (!b) return !0;
if (!t) return !1;
var c = parseInt(F(a, "deploymentVersion"));
return _.some(t, function(a) {
return a.metadata.name === b && a.status.latestVersion === c;
});
}, c.hasUnservicedContent = function() {
var a = [ "monopodsByService", "deploymentConfigsByService", "deploymentsByService", "replicationControllersByService", "replicaSetsByService", "statefulSetsByService" ];
return _.some(a, function(a) {
var b = _.get(c, [ a, "" ], {});
return !_.isEmpty(b);
});
};
var oa = [];
c.getHPA = function(a) {
if (!B) return null;
var b = _.get(a, "kind"), c = _.get(a, "metadata.name");
return _.get(C, [ b, c ], oa);
}, window.OPENSHIFT_CONSTANTS.DISABLE_OVERVIEW_METRICS || (o.isAvailable(!0).then(function(a) {
c.showMetrics = a;
}), c.$on("metrics-connection-failed", function(a, b) {
var e = d.isAlertPermanentlyHidden("metrics-connection-failed");
e || c.alerts["metrics-connection-failed"] || (c.alerts["metrics-connection-failed"] = {
type:"warning",
message:"An error occurred getting metrics.",
links:[ {
href:b.url,
label:"Open Metrics URL",
target:"_blank"
}, {
href:"",
label:"Don't Show Me Again",
onClick:function() {
return d.permanentlyHideAlert("metrics-connection-failed"), !0;
}
} ]
});
}));
var pa = a("isIE")() || a("isEdge")();
k.get(b.project).then(_.spread(function(a, b) {
c.project = a, c.projectContext = b, D.push(f.watch("pods", b, function(a) {
y = a.by("metadata.name"), aa(), ma(), i.log("pods", y);
})), D.push(f.watch("services", b, function(a) {
c.services = r = a.by("metadata.name"), ga(), aa(), P(), U(), T(), V(), Y(), ha(), ma(), i.log("services (subscribe)", r);
}, {
poll:pa,
pollInterval:6e4
})), D.push(f.watch("builds", b, function(a) {
A = a.by("metadata.name"), la(), ma(), i.log("builds (subscribe)", A);
})), D.push(f.watch("buildConfigs", b, function(a) {
z = a.by("metadata.name"), la(), i.log("builds (subscribe)", A);
}, {
poll:pa,
pollInterval:6e4
})), D.push(f.watch("routes", b, function(a) {
q = a.by("metadata.name"), O(), ga(), ha(), i.log("routes (subscribe)", c.routesByService);
}, {
poll:pa,
pollInterval:6e4
})), D.push(f.watch("replicationcontrollers", b, function(a) {
c.replicationControllersByName = u = a.by("metadata.name"), U(), T(), aa(), la(), ma(), i.log("replicationcontrollers (subscribe)", u);
})), D.push(f.watch("deploymentconfigs", b, function(a) {
t = a.by("metadata.name"), P(), T(), ma(), i.log("deploymentconfigs (subscribe)", t);
})), D.push(f.watch({
group:"extensions",
resource:"replicasets"
}, b, function(a) {
w = a.by("metadata.name"), aa(), V(), X(), ma(), i.log("replicasets (subscribe)", w);
})), D.push(f.watch({
group:"apps",
resource:"statefulsets"
}, b, function(a) {
x = a.by("metadata.name"), aa(), Y(), ma(), i.log("statefulsets (subscribe)", x);
}, {
poll:pa,
pollInterval:6e4
})), D.push(f.watch({
group:"extensions",
resource:"deployments"
}, b, function(a) {
s = a.by("metadata.name"), Q(), X(), ma(), i.log("deployments (subscribe)", s);
})), D.push(f.watch({
group:"extensions",
resource:"horizontalpodautoscalers"
}, b, function(a) {
B = a.by("metadata.name"), Z();
}, {
poll:pa,
pollInterval:6e4
})), D.push(f.watch("resourcequotas", b, function(a) {
c.quotas = a.by("metadata.name"), na();
}, {
poll:!0,
pollInterval:6e4
})), D.push(f.watch("appliedclusterresourcequotas", b, function(a) {
c.clusterQuotas = a.by("metadata.name"), na();
}, {
poll:!0,
pollInterval:6e4
})), f.list("limitranges", b, function(a) {
c.limitRanges = a.by("metadata.name");
}), c.$on("$destroy", function() {
f.unwatchAll(D);
});
}));
} ]), angular.module("openshiftConsole").controller("TopologyController", [ "$routeParams", "$scope", "DataService", "DeploymentsService", "ProjectsService", "annotationFilter", "hashSizeFilter", "imageObjectRefFilter", "deploymentCausesFilter", "labelFilter", "LabelFilter", "Logger", "ImageStreamResolver", "ObjectDescriber", "$parse", "$filter", "$interval", "RoutesService", "AlertMessageService", function(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s) {
b.projectName = a.project, b.pods = {}, b.services = {}, b.routes = {}, b.routesByService = {}, b.displayRouteByService = {}, b.unfilteredServices = {}, b.deployments = {}, b.deploymentConfigs = void 0, b.builds = {}, b.imageStreams = {}, b.imagesByDockerReference = {}, b.imageStreamImageRefByDockerReference = {}, b.podsByService = {}, b.podsByDeployment = {}, b.monopodsByService = {}, b.deploymentsByServiceByDeploymentConfig = {}, b.deploymentsByService = {}, b.deploymentConfigsByService = {}, b.recentBuildsByOutputImage = {}, b.labelSuggestions = {}, b.alerts = b.alerts || {}, b.emptyMessage = "Loading...", b.renderOptions = b.renderOptions || {}, b.renderOptions.showToolbar = !1, b.renderOptions.showSidebarRight = !1, b.renderOptions.showGetStarted = !1, b.overviewMode = "tiles", b.routeWarningsByService = {};
var t = {};
b.topologyKinds = {
DeploymentConfig:location.href + "#vertex-DeploymentConfig",
Pod:location.href + "#vertex-Pod",
ReplicationController:location.href + "#vertex-ReplicationController",
Route:location.href + "#vertex-Route",
Service:location.href + "#vertex-Service"
}, b.topologySelection = null, b.topologyItems = {}, b.topologyRelations = [], b.alerts = b.alerts || {}, s.getAlerts().forEach(function(a) {
b.alerts[a.name] = a.data;
}), s.clearAlerts();
var u = [], v = [];
e.get(a.project).then(_.spread(function(a, e) {
function s() {
b.monopodsByService = {
"":{}
}, b.podsByService = {}, b.podsByDeployment = {};
var a = {};
angular.forEach(b.deployments, function(c, d) {
a[d] = new LabelSelector(c.spec.selector), b.podsByDeployment[d] = {};
});
var c = {};
angular.forEach(b.unfilteredServices, function(a, d) {
c[d] = new LabelSelector(a.spec.selector), b.podsByService[d] = {};
}), angular.forEach(b.pods, function(d, e) {
var f = [], g = [];
angular.forEach(b.deployments, function(c, g) {
var h = a[g];
h.matches(d) && (f.push(g), b.podsByDeployment[g][e] = d);
}), angular.forEach(b.unfilteredServices, function(a, h) {
var i = c[h];
if (i.matches(d)) {
g.push(h), b.podsByService[h][e] = d;
var j = !1;
angular.forEach(f, function(a) {
j = j || b.deploymentsByService[h] && b.deploymentsByService[h][a];
}), j || (b.monopodsByService[h] = b.monopodsByService[h] || {}, b.monopodsByService[h][e] = d);
}
}), 0 === f.length && 0 === g.length && w(d) && (b.monopodsByService[""][e] = d);
}), l.log("podsByDeployment", b.podsByDeployment), l.log("podsByService", b.podsByService), l.log("monopodsByService", b.monopodsByService), E();
}
function w(a) {
return "Succeeded" !== a.status.phase && "Terminated" !== a.status.phase && "Failed" !== a.status.phase && (!j(a, "openshift.io/deployer-pod-for.name") && !f(a, "openshift.io/build.name"));
}
function x() {
b.deploymentConfigsByService = {
"":{}
}, angular.forEach(b.deploymentConfigs, function(a, c) {
var d = !1, e = o("spec.template.metadata.labels"), f = new LabelSelector(e(a) || {});
angular.forEach(b.unfilteredServices, function(e, g) {
b.deploymentConfigsByService[g] = b.deploymentConfigsByService[g] || {};
var h = new LabelSelector(e.spec.selector);
h.covers(f) && (b.deploymentConfigsByService[g][c] = a, d = !0);
}), d || (b.deploymentConfigsByService[""][c] = a);
});
}
function y(a) {
t = {}, angular.forEach(a, function(a, b) {
t[b] = d.getActiveDeployment(a);
});
}
function z() {
var a = b.deploymentsByService = {
"":{}
}, c = b.deploymentsByServiceByDeploymentConfig = {
"":{}
};
K = {}, angular.forEach(b.deployments, function(d, e) {
var g = !1, h = o("spec.template.metadata.labels"), i = new LabelSelector(h(d) || {}), j = f(d, "deploymentConfig") || "";
j && (K[j] = K[j] || [], K[j].push(d)), angular.forEach(b.unfilteredServices, function(b, f) {
a[f] = a[f] || {}, c[f] = c[f] || {};
var h = new LabelSelector(b.spec.selector);
h.covers(i) && (a[f][e] = d, c[f][j] = c[f][j] || {}, c[f][j][e] = d, g = !0);
}), g || (a[""][e] = d, c[""][j] = c[""][j] || {}, c[""][j][e] = d);
});
}
function A() {
b.recentBuildsByOutputImage = {}, b.recentPipelineBuilds = [], angular.forEach(b.builds, function(a) {
if (p("isRecentBuild")(a) || p("isOscActiveObject")(a)) {
var c = h(a.spec.output.to, a.metadata.namespace);
b.recentBuildsByOutputImage[c] = b.recentBuildsByOutputImage[c] || [], b.recentBuildsByOutputImage[c].push(a), L(a) && b.recentPipelineBuilds.push(a);
}
});
}
function B() {
var a = 0 === g(b.unfilteredServices) && 0 === g(b.pods) && 0 === g(b.deployments) && 0 === g(b.deploymentConfigs) && 0 === g(b.builds);
b.renderOptions.showToolbar = !a, b.renderOptions.showSidebarRight = !a, b.renderOptions.showGetStarted = a;
}
function C() {
k.getLabelSelector().isEmpty() || !$.isEmptyObject(b.services) || $.isEmptyObject(b.unfilteredServices) ? delete b.alerts.services :b.alerts.services = {
type:"warning",
details:"The active filters are hiding all services."
};
}
function D() {
function a(a) {
return a.kind + a.metadata.uid;
}
M = null;
var c = [], d = {};
angular.forEach(b.services, function(b) {
d[a(b)] = b;
});
var e = p("isRecentDeployment");
b.isVisibleDeployment = function(a) {
var c = f(a, "deploymentConfig");
if (!c) return !0;
if (g(b.podsByDeployment[a.metadata.name]) > 0) return !0;
if (!b.deploymentConfigs) return !1;
var d = b.deploymentConfigs[c];
return !!d && (e(a, d) || b.isScalable(a, c));
}, [ b.podsByService, b.monopodsByService, b.deploymentsByService, b.deploymentConfigsByService, b.routesByService ].forEach(function(c) {
angular.forEach(c, function(e, f) {
var g = b.services[f];
f && !g || angular.forEach(e, function(e) {
(c !== b.monopodsByService || w(e)) && (c !== b.deploymentsByService || b.isVisibleDeployment(e)) && (d[a(e)] = e);
});
});
}), [ b.podsByService, b.monopodsByService, b.routesByService ].forEach(function(d) {
angular.forEach(d, function(d, e) {
var f = b.services[e];
f && angular.forEach(d, function(b) {
c.push({
source:a(f),
target:a(b)
});
});
});
}), angular.forEach(b.podsByDeployment, function(e, f) {
var g = b.deployments[f];
a(g) in d && angular.forEach(e, function(b) {
d[a(b)] = b, c.push({
source:a(g),
target:a(b)
});
});
}), angular.forEach(b.deployments, function(d, e) {
var f, g = d.metadata.annotations || {}, h = g["openshift.io/deployment-config.name"] || e;
h && b.deploymentConfigs && (f = b.deploymentConfigs[h], f && c.push({
source:a(f),
target:a(d)
}));
}), b.$evalAsync(function() {
b.topologyItems = d, b.topologyRelations = c;
});
}
function E() {
M || (M = window.setTimeout(D, 100));
}
function F(a) {
b.topologySelection = a;
}
b.project = a, v.push(c.watch("pods", e, function(a) {
b.pods = a.by("metadata.name"), s(), B(), m.fetchReferencedImageStreamImages(b.pods, b.imagesByDockerReference, b.imageStreamImageRefByDockerReference, e), E(), l.log("pods", b.pods);
})), v.push(c.watch("services", e, function(a) {
b.unfilteredServices = a.by("metadata.name"), k.addLabelSuggestionsFromResources(b.unfilteredServices, b.labelSuggestions), k.setLabelSuggestions(b.labelSuggestions), b.services = k.getLabelSelector().select(b.unfilteredServices), z(), x(), s(), B(), angular.forEach(b.unfilteredServices, function(a, c) {
b.routeWarningsByService[c] = {}, angular.forEach(b.routesByService[c], function(d, e) {
var f = r.getRouteWarnings(d, a);
f.length && (b.routeWarningsByService[c][e] = r.getRouteWarnings(d, a));
});
}), b.emptyMessage = "There are no services and no running deployments or pods.", C(), E(), l.log("services (list)", b.services);
})), v.push(c.watch("routes", e, function(a) {
b.routes = a.by("metadata.name");
var c = b.routesByService = {}, d = b.displayRouteByService = {};
angular.forEach(b.routes, function(a, e) {
if ("Service" === a.spec.to.kind) {
var f = a.spec.to.name;
if (c[f] = c[f] || {}, c[f][e] = a, b.unfilteredServices[f]) {
b.routeWarningsByService[f] = b.routeWarningsByService[f] || {};
var g = r.getRouteWarnings(a, b.unfilteredServices[f]);
g.length ? b.routeWarningsByService[f][e] = g :delete b.routeWarningsByService[f][e];
}
d[f] ? d[f] = r.getPreferredDisplayRoute(d[f], a) :d[f] = a;
}
}), E(), l.log("routes (subscribe)", b.routesByService);
}));
var G, H, I = function(a) {
var b = _.get(b, [ a ]);
return !_.isEmpty(b);
}, J = function(a) {
var b = _.get(H, [ a ]);
return !_.isEmpty(b);
};
b.getHPA = function(a, b) {
return G && H ? b ? (G[b] = G[b] || [], G[b]) :(H[a] = H[a] || [], H[a]) :null;
}, v.push(c.watch({
group:"extensions",
resource:"horizontalpodautoscalers"
}, e, function(a) {
G = {}, H = {}, angular.forEach(a.by("metadata.name"), function(a) {
var b = a.spec.scaleRef.name, c = a.spec.scaleRef.kind;
if (b && c) switch (c) {
case "DeploymentConfig":
G[b] = G[b] || [], G[b].push(a);
break;

case "ReplicationController":
H[b] = H[b] || [], H[b].push(a);
break;

default:
l.warn("Unexpected HPA scaleRef kind", c);
}
});
})), b.isScalable = function(a, c) {
return !J(a.metadata.name) && (!c || !!b.deploymentConfigs && (!b.deploymentConfigs[c] || !I(c) && t[c] === a));
};
var K = {};
v.push(c.watch("replicationcontrollers", e, function(a, c, d) {
b.deployments = a.by("metadata.name"), d ? "DELETED" !== c && (d.causes = i(d)) :angular.forEach(b.deployments, function(a) {
a.causes = i(a);
}), z(), s(), y(K), B(), E(), l.log("deployments (subscribe)", b.deployments);
})), v.push(c.watch("imagestreams", e, function(a) {
b.imageStreams = a.by("metadata.name"), m.buildDockerRefMapForImageStreams(b.imageStreams, b.imageStreamImageRefByDockerReference), m.fetchReferencedImageStreamImages(b.pods, b.imagesByDockerReference, b.imageStreamImageRefByDockerReference, e), E(), l.log("imagestreams (subscribe)", b.imageStreams);
})), v.push(c.watch("deploymentconfigs", e, function(a) {
b.deploymentConfigs = a.by("metadata.name"), x(), B(), E(), l.log("deploymentconfigs (subscribe)", b.deploymentConfigs);
}));
var L = p("isJenkinsPipelineStrategy");
v.push(c.watch("builds", e, function(a) {
b.builds = a.by("metadata.name"), A(), u.push(q(A, 3e5)), E(), l.log("builds (subscribe)", b.builds);
})), c.list("limitranges", e, function(a) {
b.limitRanges = a.by("metadata.name");
}), k.onActiveFiltersChanged(function(a) {
b.$apply(function() {
b.services = a.select(b.unfilteredServices), C(), D();
});
});
var M = null;
b.$on("select", function(a, c) {
b.$apply(function() {
b.topologySelection = c, c ? n.setObject(c, c.kind) :n.clearObject();
});
}, !0), n.onResourceChanged(F), b.$watch("overviewMode", function(a) {
"topology" === a && (n.source = null);
}), b.$on("$destroy", function() {
c.unwatchAll(v), window.clearTimeout(M), n.removeResourceChangedCallback(F), angular.forEach(u, function(a) {
q.cancel(a);
});
});
}));
} ]), angular.module("openshiftConsole").controller("QuotaController", [ "$filter", "$routeParams", "$scope", "DataService", "ProjectsService", "Logger", function(a, b, c, d, e, f) {
c.projectName = b.project, c.limitRanges = {}, c.limitsByType = {}, c.labelSuggestions = {}, c.alerts = c.alerts || {}, c.quotaHelp = "Limits resource usage within this project.", c.emptyMessageLimitRanges = "Loading...", c.limitRangeHelp = "Defines minimum and maximum constraints for runtime resources such as memory and CPU.", c.renderOptions = c.renderOptions || {}, c.renderOptions.hideFilterWidget = !0;
var g = [], h = a("usageValue");
c.isAtLimit = function(a, b) {
var c = a.status.total || a.status, d = h(_.get(c, [ "hard", b ]));
if (!d) return !1;
var e = h(_.get(c, [ "used", b ]));
return !!e && e >= d;
};
var i = a("humanizeQuotaResource"), j = function(a, b) {
return "cpu" === a || "requests.cpu" === a ? "cpu" === b || "requests.cpu" === b ? 0 :-1 :"cpu" === b || "requests.cpu" === b ? 1 :"memory" === a || "requests.memory" === a ? "memory" === b || "requests.memory" === b ? 0 :-1 :"memory" === b || "requests.memory" === b ? 1 :"limits.cpu" === a ? "limits.cpu" === b ? 0 :-1 :"limits.cpu" === b ? 1 :"limits.memory" === a ? "limits.memory" === b ? 0 :-1 :"limits.memory" === b ? 1 :(a = i(a), b = i(b), a.localeCompare(b));
}, k = function(a) {
var b = {};
return _.each(a, function(a) {
var c = _.get(a, "spec.quota.hard") || _.get(a, "spec.hard"), d = _.keys(c).sort(j);
b[a.metadata.name] = d;
}), b;
};
e.get(b.project).then(_.spread(function(a, e) {
c.project = a, d.list("resourcequotas", e, function(a) {
c.quotas = a.by("metadata.name"), c.orderedTypesByQuota = k(c.quotas), f.log("quotas", c.quotas);
}), d.list("appliedclusterresourcequotas", e, function(a) {
c.clusterQuotas = a.by("metadata.name"), c.orderedTypesByClusterQuota = k(c.clusterQuotas), c.namespaceUsageByClusterQuota = {}, _.each(c.clusterQuotas, function(a, d) {
if (a.status) {
var e = _.find(a.status.namespaces, {
namespace:b.project
});
c.namespaceUsageByClusterQuota[d] = e.status;
}
}), f.log("cluster quotas", c.clusterQuotas);
}), d.list("limitranges", e, function(a) {
c.limitRanges = a.by("metadata.name"), c.emptyMessageLimitRanges = "There are no limit ranges set on this project.", angular.forEach(c.limitRanges, function(a, b) {
c.limitsByType[b] = {}, angular.forEach(a.spec.limits, function(a) {
var d = c.limitsByType[b][a.type] = {};
angular.forEach(a.max, function(a, b) {
d[b] = d[b] || {}, d[b].max = a;
}), angular.forEach(a.min, function(a, b) {
d[b] = d[b] || {}, d[b].min = a;
}), angular.forEach(a["default"], function(a, b) {
d[b] = d[b] || {}, d[b]["default"] = a;
}), angular.forEach(a.defaultRequest, function(a, b) {
d[b] = d[b] || {}, d[b].defaultRequest = a;
}), angular.forEach(a.maxLimitRequestRatio, function(a, b) {
d[b] = d[b] || {}, d[b].maxLimitRequestRatio = a;
});
});
}), f.log("limitRanges", c.limitRanges);
}), c.$on("$destroy", function() {
d.unwatchAll(g);
});
}));
} ]), angular.module("openshiftConsole").controller("MonitoringController", [ "$routeParams", "$location", "$scope", "$filter", "BuildsService", "DataService", "ImageStreamResolver", "KeywordService", "LabelsService", "Logger", "MetricsService", "Navigate", "PodsService", "ProjectsService", "$rootScope", function(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o) {
c.projectName = a.project, c.alerts = c.alerts || {}, c.renderOptions = c.renderOptions || {}, c.renderOptions.showEventsSidebar = !0, c.renderOptions.collapseEventsSidebar = "true" === localStorage.getItem("monitoring.eventsidebar.collapsed");
var p = [];
c.kinds = [ {
kind:"All"
}, {
kind:"Pods"
}, {
label:"Deployments",
kind:"ReplicationControllers"
}, {
kind:"Builds"
}, {
kind:"StatefulSets"
} ], c.kindSelector = {
selected:_.find(c.kinds, {
kind:a.kind
}) || _.head(c.kinds)
}, c.logOptions = {
pods:{},
replicationControllers:{},
builds:{},
statefulSets:{}
}, c.logCanRun = {
pods:{},
replicationControllers:{},
builds:{},
statefulSets:{}
}, c.logEmpty = {
pods:{},
replicationControllers:{},
builds:{},
statefulSets:{}
}, c.expanded = {
pods:{},
replicationControllers:{},
replicaSets:{},
builds:{},
statefulSets:{}
};
var q = d("isNil");
c.filters = {
hideOlderResources:q(a.hideOlderResources) || "true" === a.hideOlderResources,
text:""
};
var r, s, t, u;
k.isAvailable().then(function(a) {
c.metricsAvailable = a;
});
var v = d("orderObjectsByDate"), w = [ "metadata.name" ], x = [], y = function() {
c.filteredPods = h.filterForKeywords(u, w, x), c.filteredReplicationControllers = h.filterForKeywords(s, w, x), c.filteredReplicaSets = h.filterForKeywords(t, w, x), c.filteredBuilds = h.filterForKeywords(r, w, x), c.filteredStatefulSets = h.filterForKeywords(_.values(c.statefulSets), w, x);
}, z = function(a) {
c.logOptions.pods[a.metadata.name] = {
container:a.spec.containers[0].name
}, c.logCanRun.pods[a.metadata.name] = !_.includes([ "New", "Pending", "Unknown" ], a.status.phase);
}, A = function(a) {
c.logOptions.replicationControllers[a.metadata.name] = {};
var b = d("annotation")(a, "deploymentVersion");
b && (c.logOptions.replicationControllers[a.metadata.name].version = b), c.logCanRun.replicationControllers[a.metadata.name] = !_.includes([ "New", "Pending" ], d("deploymentStatus")(a));
}, B = function(a) {
c.logOptions.builds[a.metadata.name] = {}, c.logCanRun.builds[a.metadata.name] = !_.includes([ "New", "Pending", "Error" ], a.status.phase);
}, C = function() {
c.filteredStatefulSets = h.filterForKeywords(_.values(c.statefulSets), w, x);
}, D = function() {
u = _.filter(c.pods, function(a) {
return !c.filters.hideOlderResources || "Succeeded" !== a.status.phase && "Failed" !== a.status.phase;
}), c.filteredPods = h.filterForKeywords(u, w, x);
}, E = d("isIncompleteBuild"), F = d("buildConfigForBuild"), G = d("isRecentBuild"), H = function() {
moment().subtract(5, "m");
r = _.filter(c.builds, function(a) {
if (!c.filters.hideOlderResources) return !0;
if (E(a)) return !0;
var b = F(a);
return b ? c.latestBuildByConfig[b].metadata.name === a.metadata.name :G(a);
}), c.filteredBuilds = h.filterForKeywords(r, w, x);
}, I = d("deploymentStatus"), J = d("deploymentIsInProgress"), K = function() {
s = _.filter(c.replicationControllers, function(a) {
return !c.filters.hideOlderResources || (J(a) || "Active" === I(a));
}), c.filteredReplicationControllers = h.filterForKeywords(s, w, x);
}, L = function() {
t = _.filter(c.replicaSets, function(a) {
return !c.filters.hideOlderResources || _.get(a, "status.replicas");
}), c.filteredReplicaSets = h.filterForKeywords(t, w, x);
};
c.toggleItem = function(a, b, e) {
var f = $(a.target);
if (!f || !f.closest("a", b).length) {
var g, h;
switch (e.kind) {
case "Build":
g = !c.expanded.builds[e.metadata.name], c.expanded.builds[e.metadata.name] = g, h = g ? "event.resource.highlight" :"event.resource.clear-highlight", o.$emit(h, e);
var i = _.get(c.podsByName, d("annotation")(e, "buildPod"));
i && o.$emit(h, i);
break;

case "ReplicationController":
g = !c.expanded.replicationControllers[e.metadata.name], c.expanded.replicationControllers[e.metadata.name] = g, h = g ? "event.resource.highlight" :"event.resource.clear-highlight", o.$emit(h, e);
var j = d("annotation")(e, "deployerPod");
j && o.$emit(h, {
kind:"Pod",
metadata:{
name:j
}
}), _.each(c.podsByOwnerUID[e.metadata.uid], function(a) {
o.$emit(h, a);
});
break;

case "ReplicaSet":
g = !c.expanded.replicaSets[e.metadata.name], c.expanded.replicaSets[e.metadata.name] = g, h = g ? "event.resource.highlight" :"event.resource.clear-highlight", o.$emit(h, e), _.each(c.podsByOwnerUID[e.metadata.uid], function(a) {
o.$emit(h, a);
});
break;

case "Pod":
g = !c.expanded.pods[e.metadata.name], c.expanded.pods[e.metadata.name] = g, h = g ? "event.resource.highlight" :"event.resource.clear-highlight", o.$emit(h, e);
break;

case "StatefulSet":
g = !c.expanded.statefulSets[e.metadata.name], c.expanded.statefulSets[e.metadata.name] = g, h = g ? "event.resource.highlight" :"event.resource.clear-highlight", o.$emit(h, e);
}
}
}, c.viewPodsForReplicaSet = function(a) {
_.isEmpty(c.podsByOwnerUID[a.metadata.uid]) || l.toPodsForDeployment(a);
};
var M = function() {
if (c.pods && c.replicationControllers && c.replicaSets && c.statefulSets) {
var a = _.toArray(c.replicationControllers).concat(_.toArray(c.replicaSets)).concat(_.toArray(c.statefulSets));
c.podsByOwnerUID = i.groupBySelector(c.pods, a, {
key:"metadata.uid"
});
}
};
n.get(a.project).then(_.spread(function(a, d) {
c.project = a, c.projectContext = d, f.watch("pods", d, function(a) {
c.podsByName = a.by("metadata.name"), c.pods = v(c.podsByName, !0), M(), c.podsLoaded = !0, _.each(c.pods, z), D(), j.log("pods", c.pods);
}), f.watch({
resource:"statefulsets",
group:"apps",
version:"v1beta1"
}, d, function(a) {
c.statefulSets = a.by("metadata.name"), M(), c.statefulSetsLoaded = !0, C(), j.log("statefulSets", c.statefulSets);
}), f.watch("replicationcontrollers", d, function(a) {
c.replicationControllers = v(a.by("metadata.name"), !0), M(), c.replicationControllersLoaded = !0, _.each(c.replicationControllers, A), K(), j.log("replicationcontrollers", c.replicationControllers);
}), f.watch("builds", d, function(a) {
c.builds = v(a.by("metadata.name"), !0), c.latestBuildByConfig = e.latestBuildByConfig(c.builds), c.buildsLoaded = !0, _.each(c.builds, B), H(), j.log("builds", c.builds);
}), f.watch({
group:"extensions",
resource:"replicasets"
}, d, function(a) {
c.replicaSets = v(a.by("metadata.name"), !0), M(), c.replicaSetsLoaded = !0, L(), j.log("replicasets", c.replicaSets);
}), c.$on("$destroy", function() {
f.unwatchAll(p);
}), c.$watch("filters.hideOlderResources", function() {
D(), H(), K(), L(), C();
var a = b.search();
a.hideOlderResources = c.filters.hideOlderResources ? "true" :"false", b.replace().search(a);
}), c.$watch("kindSelector.selected.kind", function() {
var a = b.search();
a.kind = c.kindSelector.selected.kind, b.replace().search(a);
}), c.$watch("filters.text", _.debounce(function() {
c.filterKeywords = x = h.generateKeywords(c.filters.text), c.$apply(y);
}, 50, {
maxWait:250
})), c.$watch("renderOptions.collapseEventsSidebar", function(a, b) {
a !== b && (localStorage.setItem("monitoring.eventsidebar.collapsed", c.renderOptions.collapseEventsSidebar ? "true" :"false"), o.$emit("metrics.charts.resize"));
});
}));
} ]), angular.module("openshiftConsole").controller("MembershipController", [ "$filter", "$location", "$routeParams", "$scope", "$timeout", "$uibModal", "AuthService", "AuthorizationService", "DataService", "ProjectsService", "MembershipService", "RoleBindingsService", "RolesService", function(a, b, c, d, e, f, g, h, i, j, k, l, m) {
var n, o = c.project, p = a("humanizeKind"), q = a("annotation"), r = a("canI"), s = [], t = {
notice:{
yourLastRole:_.template('Removing the role "<%= roleName %>" may completely remove your ability to see this project.')
},
warning:{
serviceAccount:_.template("Removing a system role granted to a service account may cause unexpected behavior.")
},
remove:{
areYouSure:{
html:{
subject:_.template("Are you sure you want to remove <strong><%- roleName %></strong> from the <%- kindName %> <strong><%- subjectName %></strong>?"),
self:_.template("Are you sure you want to remove <strong><%- roleName %></strong> from <strong><%- subjectName %></strong> (you)?")
}
},
success:_.template('The role "<%= roleName %>" was removed from "<%= subjectName %>".'),
error:_.template('The role "<%= roleName %>" was not removed from "<%= subjectName %>".')
},
update:{
subject:{
success:_.template('The role "<%= roleName %>" was granted to "<%= subjectName %>".'),
error:_.template('The role "<%= roleName %>" could not be granted to "<%= subjectName %>".'),
exists:_.template('The role "<%= roleName %>" has already been granted to "<%= subjectName %>".')
}
},
errorReason:_.template('Reason: "<%= httpErr %>"')
}, u = function(a, b, c, e, f) {
f = f || d, f.alerts[a] = {
type:b,
message:c,
details:e
};
}, v = function() {
d.disableAddForm = !1, d.newBinding.name = "", d.newBinding.namespace = o, d.newBinding.newRole = null;
}, w = function(a) {
i.list("serviceaccounts", a).then(function(a) {
var b = _.keys(a.by("metadata.name")).sort();
angular.extend(d, {
serviceAccounts:b,
refreshServiceAccounts:function(a) {
a && !_.includes(d.serviceAccounts, a) ? d.serviceAccounts = [ a ].concat(b) :d.serviceAccounts = b;
}
});
});
}, x = function(a) {
i.list("rolebindings", n, null, {
errorNotification:!1
}).then(function(a) {
angular.extend(d, {
canShowRoles:!0,
roleBindings:a.by("metadata.name"),
subjectKindsForUI:k.mapRolebindingsForUI(a.by("metadata.name"), s)
}), v();
}, function() {
a && (d.roleBindings[a.metadata.name] = a, d.subjectKindsForUI = k.mapRolebindingsForUI(d.roleBindings, s)), v();
});
}, y = function(b, c) {
d.disableAddForm = !0, l.create(b, c, o, n).then(function() {
x(), u("rolebindingCreate", "success", t.update.subject.success({
roleName:b.metadata.name,
subjectName:c.name
}));
}, function(d) {
v(), u("rolebindingCreateFail", "error", t.update.subject.error({
roleName:b.metadata.name,
subjectName:c.name
}), t.errorReason({
httpErr:a("getErrorDetails")(d)
}));
});
}, z = function(b, c, e) {
d.disableAddForm = !0, l.addSubject(b, c, e, n).then(function() {
x(), u("rolebindingUpdate", "success", t.update.subject.success({
roleName:b.roleRef.name,
subjectName:c.name
}));
}, function(d) {
v(), u("rolebindingUpdateFail", "error", t.update.subject.error({
roleName:b.roleRef.name,
subjectName:c.name
}), t.errorReason({
httpErr:a("getErrorDetails")(d)
}));
});
}, A = {};
c.tab && (A[c.tab] = !0);
var B = k.getSubjectKinds();
angular.extend(d, {
selectedTab:A,
projectName:o,
alerts:{},
forms:{},
emptyMessage:"Loading...",
subjectKinds:B,
newBinding:{
role:"",
kind:c.tab || "User",
name:""
},
toggleEditMode:function() {
v(), d.mode.edit = !d.mode.edit;
},
mode:{
edit:!1
},
selectTab:function(a) {
d.newBinding.kind = a, d.newBinding.name = "";
}
}), angular.extend(d, {
excludeExistingRoles:function(a) {
return function(b) {
return !_.some(a, {
kind:b.kind,
metadata:{
name:b.metadata.name
}
});
};
},
roleHelp:function(a) {
if (a) {
var b = "", c = _.get(a, "metadata.namespace"), d = _.get(a, "metadata.name"), e = c ? c + " / " + d + ": " :"";
return a ? e + (q(a, "description") || b) :b;
}
}
});
var C = function(a, b, c, e) {
var f = {
alerts:{},
detailsMarkup:t.remove.areYouSure.html.subject({
roleName:c,
kindName:p(b),
subjectName:a
}),
okButtonText:"Remove",
okButtonClass:"btn-danger",
cancelButtonText:"Cancel"
};
return _.isEqual(a, e) && (f.detailsMarkup = t.remove.areYouSure.html.self({
roleName:c,
subjectName:a
}), k.isLastRole(d.user.metadata.name, d.roleBindings) && u("currentUserLastRole", "error", t.notice.yourLastRole({
roleName:c
}), null, f)), _.isEqual(b, "ServiceAccount") && _.startsWith(c, "system:") && u("editingServiceAccountRole", "error", t.warning.serviceAccount(), null, f), f;
};
g.withUser().then(function(a) {
d.user = a;
}), i.list("projects", {}).then(function(a) {
var b = _.keys(a.by("metadata.name")).sort();
angular.extend(d, {
projects:b,
selectProject:function(a) {
d.newBinding.name = "", w({
namespace:a
});
},
refreshProjects:function(a) {
a && !_.includes(d.projects, a) ? d.projects = [ a ].concat(b) :d.projects = b;
}
});
}), j.get(c.project).then(_.spread(function(c, e) {
n = e, x(), w(n), angular.extend(d, {
project:c,
subjectKinds:B,
canUpdateRolebindings:r("rolebindings", "update", o),
confirmRemove:function(c, e, g) {
var i = null, j = C(c, e, g, d.user.metadata.name);
_.isEqual(c, d.user.metadata.name) && k.isLastRole(d.user.metadata.name, d.roleBindings) && (i = !0), f.open({
animation:!0,
templateUrl:"views/modals/confirm.html",
controller:"ConfirmModalController",
resolve:{
modalConfig:function() {
return j;
}
}
}).result.then(function() {
l.removeSubject(c, g, d.roleBindings, n).then(function(a) {
i ? b.url("./") :(h.getProjectRules(o, !0).then(function() {
x(a[0]);
var b = r("rolebindings", "update", o);
angular.extend(d, {
canUpdateRolebindings:b,
mode:{
edit:!!d.mode.edit && b
}
});
}), u("rolebindingUpdate", "success", t.remove.success({
roleName:g,
subjectName:c
})));
}, function(b) {
u("rolebindingUpdateFail", "error", t.remove.error({
roleName:g,
subjectName:c
}), t.errorReason({
httpErr:a("getErrorDetails")(b)
}));
});
});
},
addRoleTo:function(a, b, c, e) {
var f = {
name:a,
kind:b
};
"ServiceAccount" === b && (f.namespace = e);
var g = _.find(d.roleBindings, {
roleRef:{
name:c.metadata.name
}
});
g && _.some(g.subjects, f) ? u("rolebindingUpdate", "info", t.update.subject.exists({
roleName:c.metadata.name,
subjectName:a
})) :g ? z(g, f, e) :y(c, f, e);
}
}), m.listAllRoles(n, {
errorNotification:!1
}).then(function(a) {
s = k.mapRolesForUI(_.first(a).by("metadata.name"), _.last(a).by("metadata.name"));
var b = k.sortRoles(s), c = k.filterRoles(s), e = function(a, b) {
return _.some(b, {
metadata:{
name:a
}
});
};
x(), angular.extend(d, {
toggle:{
roles:!1
},
filteredRoles:c,
showAllRoles:function() {
d.toggle.roles = !d.toggle.roles, d.toggle.roles ? d.filteredRoles = b :(d.filteredRoles = c, e(d.newBinding.role, c) || (d.newBinding.role = null));
}
});
});
}));
} ]), angular.module("openshiftConsole").controller("BuildsController", [ "$routeParams", "$scope", "AlertMessageService", "DataService", "$filter", "LabelFilter", "Logger", "$location", "BuildsService", "ProjectsService", function(a, b, c, d, e, f, g, h, i, j) {
b.projectName = a.project, b.builds = {}, b.unfilteredBuildConfigs = {}, b.buildConfigs = void 0, b.labelSuggestions = {}, b.alerts = b.alerts || {}, b.emptyMessage = "Loading...", b.latestByConfig = {}, c.getAlerts().forEach(function(a) {
b.alerts[a.name] = a.data;
}), c.clearAlerts();
var k = e("buildConfigForBuild"), l = [];
j.get(a.project).then(_.spread(function(a, c) {
function h(a) {
var c = f.getLabelSelector();
if (c.isEmpty()) return !0;
var d = k(a) || "";
return d && b.unfilteredBuildConfigs[d] ? !!b.buildConfigs[d] :c.matches(a);
}
function j() {
b.latestByConfig = i.latestBuildByConfig(b.builds, h), angular.forEach(b.buildConfigs, function(a, c) {
b.latestByConfig[c] = b.latestByConfig[c] || null;
});
}
function m() {
var a = _.omit(b.latestByConfig, _.isNull);
!f.getLabelSelector().isEmpty() && _.isEmpty(b.buildConfigs) && _.isEmpty(a) ? b.alerts.builds = {
type:"warning",
details:"The active filters are hiding all builds."
} :delete b.alerts.builds;
}
b.project = a;
var n = e("isJenkinsPipelineStrategy");
l.push(d.watch("builds", c, function(a) {
b.builds = _.omit(a.by("metadata.name"), n), b.emptyMessage = "No builds to show", j(), f.addLabelSuggestionsFromResources(b.builds, b.labelSuggestions), g.log("builds (subscribe)", b.builds);
})), l.push(d.watch("buildconfigs", c, function(a) {
b.unfilteredBuildConfigs = _.omit(a.by("metadata.name"), n), f.addLabelSuggestionsFromResources(b.unfilteredBuildConfigs, b.labelSuggestions), f.setLabelSuggestions(b.labelSuggestions), b.buildConfigs = f.getLabelSelector().select(b.unfilteredBuildConfigs), j(), m(), g.log("buildconfigs (subscribe)", b.buildConfigs);
})), f.onActiveFiltersChanged(function(a) {
b.$apply(function() {
b.buildConfigs = a.select(b.unfilteredBuildConfigs), j(), m();
});
}), b.$on("$destroy", function() {
d.unwatchAll(l);
});
}));
} ]), angular.module("openshiftConsole").controller("PipelinesController", [ "$filter", "$routeParams", "$scope", "Constants", "Navigate", "AlertMessageService", "BuildsService", "DataService", "Logger", "ProjectsService", function(a, b, c, d, e, f, g, h, i, j) {
c.projectName = b.project, c.alerts = c.alerts || {}, c.buildConfigs = {}, f.getAlerts().forEach(function(a) {
c.alerts[a.name] = a.data;
}), f.clearAlerts();
var k = [];
j.get(b.project).then(_.spread(function(b, f) {
c.project = b;
var i = {}, j = a("buildConfigForBuild"), l = a("isIncompleteBuild"), m = a("isJenkinsPipelineStrategy"), n = a("isNewerResource"), o = function(a, b) {
if (!l(b)) {
c.statsByConfig[a] || (c.statsByConfig[a] = {
count:0,
totalDuration:0
});
var d = c.statsByConfig[a];
d.count++, d.totalDuration += g.getDuration(b), d.avgDuration = _.round(d.totalDuration / d.count);
}
}, p = function() {
var a = {}, b = {};
c.statsByConfig = {}, _.each(i, function(d) {
if (m(d)) {
var e = j(d) || "";
c.buildConfigs[e] || (c.buildConfigs[e] = null), l(d) ? _.set(a, [ e, d.metadata.name ], d) :n(d, b[e]) && (b[e] = d), o(e, d);
}
}), _.each(b, function(b, c) {
_.set(a, [ c, b.metadata.name ], b);
}), c.interestingBuildsByConfig = a;
};
k.push(h.watch("builds", f, function(a) {
c.buildsLoaded = !0, i = a.by("metadata.name"), p();
}));
var q = !1;
k.push(h.watch("buildconfigs", f, function(a) {
if (c.buildConfigsLoaded = !0, c.buildConfigs = _.pick(a.by("metadata.name"), m), _.isEmpty(c.buildConfigs) && !q) {
q = !0;
var b = d.SAMPLE_PIPELINE_TEMPLATE.name, f = d.SAMPLE_PIPELINE_TEMPLATE.namespace;
h.get("templates", b, {
namespace:f
}, {
errorNotification:!1
}).then(function(a) {
c.createSampleURL = e.createFromTemplateURL(a, c.projectName);
});
}
p();
})), c.startBuild = function(b) {
g.startBuild(b, f).then(_.noop, function(b) {
c.alerts["start-build"] = {
type:"error",
message:"An error occurred while starting the build.",
details:a("getErrorDetails")(b)
};
});
}, c.$on("$destroy", function() {
h.unwatchAll(k);
});
}));
} ]), angular.module("openshiftConsole").controller("BuildConfigController", [ "$scope", "$filter", "$routeParams", "AlertMessageService", "APIService", "BuildsService", "ImagesService", "DataService", "LabelFilter", "ModalsService", "ProjectsService", "keyValueEditorUtils", function(a, b, c, d, e, f, g, h, i, j, k, l) {
a.projectName = c.project, a.buildConfigName = c.buildconfig, a.buildConfig = null, a.labelSuggestions = {}, a.alerts = {}, a.breadcrumbs = [], a.forms = {}, a.expand = {
imageEnv:!1
}, c.isPipeline ? a.breadcrumbs.push({
title:"Pipelines",
link:"project/" + c.project + "/browse/pipelines"
}) :a.breadcrumbs.push({
title:"Builds",
link:"project/" + c.project + "/browse/builds"
}), a.breadcrumbs.push({
title:c.buildconfig
}), a.emptyMessage = "Loading...", d.getAlerts().forEach(function(b) {
a.alerts[b.name] = b.data;
}), d.clearAlerts(), a.aceLoaded = function(a) {
var b = a.getSession();
b.setOption("tabSize", 2), b.setOption("useSoftTabs", !0), a.$blockScrolling = 1 / 0;
};
var m, n = b("orderObjectsByDate"), o = b("buildConfigForBuild"), p = b("buildStrategy"), q = [], r = function(c) {
a.updatedBuildConfig = angular.copy(c), a.envVars = p(a.updatedBuildConfig).env || [], _.each(a.envVars, function(a) {
b("altTextForValueFrom")(a);
});
};
a.saveEnvVars = function() {
a.envVars = _.filter(a.envVars, "name"), p(a.updatedBuildConfig).env = l.compactEntries(angular.copy(a.envVars)), h.update("buildconfigs", c.buildconfig, a.updatedBuildConfig, m).then(function() {
a.alerts.saveBCEnvVarsSuccess = {
type:"success",
message:a.buildConfigName + " was updated."
}, a.forms.bcEnvVars.$setPristine();
}, function(c) {
a.alerts.saveBCEnvVarsError = {
type:"error",
message:a.buildConfigName + " was not updated.",
details:"Reason: " + b("getErrorDetails")(c)
};
});
}, a.clearEnvVarUpdates = function() {
r(a.buildConfig), a.forms.bcEnvVars.$setPristine();
};
var s, t = function(c, d) {
a.loaded = !0, a.buildConfig = c, a.buildConfigPaused = f.isPaused(a.buildConfig), a.buildConfig.spec.source.images && (a.imageSources = a.buildConfig.spec.source.images, a.imageSourcesPaths = [], a.imageSources.forEach(function(c) {
a.imageSourcesPaths.push(b("destinationSourcePair")(c.paths));
}));
var i = _.get(p(c), "from", {}), j = i.kind + "/" + i.name + "/" + (i.namespace || a.projectName);
s !== j && (_.includes([ "ImageStreamTag", "ImageStreamImage" ], i.kind) ? (s = j, h.get(e.kindToResource(i.kind), i.name, {
namespace:i.namespace || a.projectName
}, {
errorNotification:!1
}).then(function(b) {
a.BCEnvVarsFromImage = g.getEnvironment(b);
}, function() {
a.BCEnvVarsFromImage = [];
})) :a.BCEnvVarsFromImage = []), r(c), "DELETED" === d && (a.alerts.deleted = {
type:"warning",
message:"This build configuration has been deleted."
}, a.buildConfigDeleted = !0), !a.forms.bcEnvVars || a.forms.bcEnvVars.$pristine ? r(c) :a.alerts.background_update = {
type:"warning",
message:"This build configuration has been updated in the background. Saving your changes may create a conflict or cause loss of data.",
links:[ {
label:"Reload Environment Variables",
onClick:function() {
return a.clearEnvVarUpdates(), !0;
}
} ]
}, a.paused = f.isPaused(a.buildConfig);
};
k.get(c.project).then(_.spread(function(d, e) {
function g() {
i.getLabelSelector().isEmpty() || !$.isEmptyObject(a.builds) || $.isEmptyObject(a.unfilteredBuilds) ? delete a.alerts.builds :a.alerts.builds = {
type:"warning",
details:"The active filters are hiding all builds."
};
}
a.project = d, m = e, h.get("buildconfigs", c.buildconfig, e).then(function(a) {
t(a), q.push(h.watchObject("buildconfigs", c.buildconfig, e, t));
}, function(c) {
a.loaded = !0, a.alerts.load = {
type:"error",
message:404 === c.status ? "This build configuration can not be found, it may have been deleted." :"The build configuration details could not be loaded.",
details:404 === c.status ? "Any remaining build history for this build will be shown." :"Reason: " + b("getErrorDetails")(c)
};
}), q.push(h.watch("builds", e, function(b, d, e) {
if (a.emptyMessage = "No builds to show", d) {
var h = o(e);
if (h === c.buildconfig) {
var j = e.metadata.name;
switch (d) {
case "ADDED":
case "MODIFIED":
a.unfilteredBuilds[j] = e;
break;

case "DELETED":
delete a.unfilteredBuilds[j];
}
}
} else a.unfilteredBuilds = f.validatedBuildsForBuildConfig(c.buildconfig, b.by("metadata.name"));
a.builds = i.getLabelSelector().select(a.unfilteredBuilds), g(), i.addLabelSuggestionsFromResources(a.unfilteredBuilds, a.labelSuggestions), i.setLabelSuggestions(a.labelSuggestions), a.orderedBuilds = n(a.builds, !0), a.latestBuild = a.orderedBuilds.length ? a.orderedBuilds[0] :null;
}, {
http:{
params:{
labelSelector:b("labelName")("buildConfig") + "=" + _.trunc(a.buildConfigName, {
length:63,
omission:""
})
}
}
})), i.onActiveFiltersChanged(function(b) {
a.$apply(function() {
a.builds = b.select(a.unfilteredBuilds), a.orderedBuilds = n(a.builds, !0), a.latestBuild = a.orderedBuilds.length ? a.orderedBuilds[0] :null, g();
});
}), a.startBuild = function() {
f.startBuild(a.buildConfig.metadata.name, e).then(function(b) {
a.alerts.create = {
type:"success",
message:"Build " + b.metadata.name + " has started."
};
}, function(c) {
a.alerts.create = {
type:"error",
message:"An error occurred while starting the build.",
details:b("getErrorDetails")(c)
};
});
}, a.showJenkinsfileExamples = function() {
j.showJenkinsfileExamples();
}, a.$on("$destroy", function() {
h.unwatchAll(q);
});
}));
} ]), angular.module("openshiftConsole").controller("BuildController", [ "$scope", "$filter", "$routeParams", "BuildsService", "DataService", "ModalsService", "Navigate", "ProjectsService", function(a, b, c, d, e, f, g, h) {
a.projectName = c.project, a.build = null, a.buildConfig = null, a.buildConfigName = c.buildconfig, a.builds = {}, a.alerts = {}, a.showSecret = !1, a.renderOptions = {
hideFilterWidget:!0
}, a.breadcrumbs = [], c.isPipeline ? (a.breadcrumbs.push({
title:"Pipelines",
link:"project/" + c.project + "/browse/pipelines"
}), c.buildconfig && a.breadcrumbs.push({
title:c.buildconfig,
link:"project/" + c.project + "/browse/pipelines/" + c.buildconfig
})) :(a.breadcrumbs.push({
title:"Builds",
link:"project/" + c.project + "/browse/builds"
}), c.buildconfig && a.breadcrumbs.push({
title:c.buildconfig,
link:"project/" + c.project + "/browse/builds/" + c.buildconfig
})), a.breadcrumbs.push({
title:c.build
});
var i = [], j = function(b) {
a.logCanRun = !_.includes([ "New", "Pending", "Error" ], b.status.phase);
}, k = function() {
a.buildConfig ? a.canBuild = d.canBuild(a.buildConfig) :a.canBuild = !1;
}, l = function(c, d) {
a.loaded = !0, a.build = c, j(c);
var e = b("annotation")(c, "buildNumber");
e && (a.breadcrumbs[2].title = "#" + e), "DELETED" === d && (a.alerts.deleted = {
type:"warning",
message:"This build has been deleted."
});
}, m = function(c) {
a.loaded = !0, a.alerts.load = {
type:"error",
message:"The build details could not be loaded.",
details:"Reason: " + b("getErrorDetails")(c)
};
}, n = function(b, c) {
"DELETED" === c && (a.alerts.deleted = {
type:"warning",
message:"Build configuration " + a.buildConfigName + " has been deleted."
}, a.buildConfigDeleted = !0), a.buildConfig = b, a.buildConfigPaused = d.isPaused(a.buildConfig), k();
};
h.get(c.project).then(_.spread(function(h, j) {
a.project = h, a.projectContext = j, a.logOptions = {}, e.get("builds", c.build, j).then(function(a) {
l(a), i.push(e.watchObject("builds", c.build, j, l)), i.push(e.watchObject("buildconfigs", c.buildconfig, j, n));
}, m), a.toggleSecret = function() {
a.showSecret = !0;
}, a.cancelBuild = function() {
d.cancelBuild(a.build, a.buildConfigName, j).then(function(b) {
a.alerts.cancel = {
type:"success",
message:"Cancelled build " + b.metadata.name + " of " + a.buildConfigName + "."
};
}, function(c) {
a.alerts.cancel = {
type:"error",
message:"An error occurred cancelling the build.",
details:b("getErrorDetails")(c)
};
});
};
var k = function(c) {
if (b("isJenkinsPipelineStrategy")(a.build) || !b("canI")("builds/log", "get")) return [ {
href:g.resourceURL(c),
label:"View Build"
} ];
var d = b("buildLogURL")(c);
return d ? [ {
href:d,
label:"View Log"
} ] :[];
};
a.cloneBuild = function() {
var c = _.get(a, "build.metadata.name");
c && a.canBuild && d.cloneBuild(c, j).then(function(b) {
var d = k(b);
a.alerts.rebuild = {
type:"success",
message:"Build " + c + " is being rebuilt as " + b.metadata.name + ".",
links:d
};
}, function(c) {
a.alerts.rebuild = {
type:"error",
message:"An error occurred while rerunning the build.",
details:b("getErrorDetails")(c)
};
});
}, a.showJenkinsfileExamples = function() {
f.showJenkinsfileExamples();
}, a.$on("$destroy", function() {
e.unwatchAll(i);
});
}));
} ]), angular.module("openshiftConsole").controller("ImageController", [ "$scope", "$routeParams", "DataService", "ProjectsService", "$filter", "ImageStreamsService", "imageLayers", function(a, b, c, d, e, f, g) {
function h(c, d) {
var e = f.tagsByName(c);
a.imageStream = c, a.tagsByName = e, a.tagName = b.tag;
var g = e[b.tag];
return g ? (delete a.alerts.load, void j(g, d)) :void (a.alerts.load = {
type:"error",
message:"The image tag was not found in the stream."
});
}
a.projectName = b.project, a.imageStream = null, a.image = null, a.layers = null, a.tagsByName = {}, a.alerts = {}, a.renderOptions = a.renderOptions || {}, a.renderOptions.hideFilterWidget = !0, a.breadcrumbs = [ {
title:"Image Streams",
link:"project/" + b.project + "/browse/images"
}, {
title:b.imagestream,
link:"project/" + b.project + "/browse/images/" + b.imagestream
}, {
title:":" + b.tag
} ], a.emptyMessage = "Loading...";
var i = [], j = _.debounce(function(d, f) {
var h = b.imagestream + ":" + b.tag;
c.get("imagestreamtags", h, f).then(function(b) {
a.loaded = !0, a.image = b.image, a.layers = g(a.image);
}, function(b) {
a.loaded = !0, a.alerts.load = {
type:"error",
message:"The image details could not be loaded.",
details:"Reason: " + e("getErrorDetails")(b)
};
});
}, 200), k = function(b, c, d) {
h(b, c), a.emptyMessage = "", "DELETED" === d && (a.alerts.deleted = {
type:"warning",
message:"This image stream has been deleted."
});
};
d.get(b.project).then(_.spread(function(d, f) {
a.project = d, c.get("imagestreams", b.imagestream, f).then(function(a) {
k(a, f), i.push(c.watchObject("imagestreams", b.imagestream, f, function(a, b) {
k(a, f, b);
}));
}, function(b) {
a.loaded = !0, a.alerts.load = {
type:"error",
message:"The image stream details could not be loaded.",
details:"Reason: " + e("getErrorDetails")(b)
};
}), a.$on("$destroy", function() {
c.unwatchAll(i);
});
}));
} ]), angular.module("openshiftConsole").controller("ImagesController", [ "$routeParams", "$scope", "AlertMessageService", "DataService", "ProjectsService", "$filter", "LabelFilter", "Logger", function(a, b, c, d, e, f, g, h) {
b.projectName = a.project, b.imageStreams = {}, b.unfilteredImageStreams = {}, b.missingStatusTagsByImageStream = {}, b.builds = {}, b.labelSuggestions = {}, b.alerts = b.alerts || {}, b.emptyMessage = "Loading...", c.getAlerts().forEach(function(a) {
b.alerts[a.name] = a.data;
}), c.clearAlerts();
var i = [];
e.get(a.project).then(_.spread(function(a, c) {
function e() {
angular.forEach(b.unfilteredImageStreams, function(a, c) {
var d = b.missingStatusTagsByImageStream[c] = {};
if (a.spec && a.spec.tags) {
var e = {};
a.status && a.status.tags && angular.forEach(a.status.tags, function(a) {
e[a.tag] = !0;
}), angular.forEach(a.spec.tags, function(a) {
e[a.name] || (d[a.name] = a);
});
}
});
}
function f() {
g.getLabelSelector().isEmpty() || !$.isEmptyObject(b.imageStreams) || $.isEmptyObject(b.unfilteredImageStreams) ? delete b.alerts.imageStreams :b.alerts.imageStreams = {
type:"warning",
details:"The active filters are hiding all image streams."
};
}
b.project = a, i.push(d.watch("imagestreams", c, function(a) {
b.unfilteredImageStreams = a.by("metadata.name"), g.addLabelSuggestionsFromResources(b.unfilteredImageStreams, b.labelSuggestions), g.setLabelSuggestions(b.labelSuggestions), b.imageStreams = g.getLabelSelector().select(b.unfilteredImageStreams), b.emptyMessage = "No image streams to show", e(), f(), h.log("image streams (subscribe)", b.imageStreams);
})), g.onActiveFiltersChanged(function(a) {
b.$apply(function() {
b.imageStreams = a.select(b.unfilteredImageStreams), f();
});
}), b.$on("$destroy", function() {
d.unwatchAll(i);
});
}));
} ]), angular.module("openshiftConsole").controller("ImageStreamController", [ "$scope", "$routeParams", "DataService", "ProjectsService", "$filter", "ImageStreamsService", function(a, b, c, d, e, f) {
a.projectName = b.project, a.imageStream = null, a.tagsByName = {}, a.tagShowOlder = {}, a.alerts = {}, a.renderOptions = a.renderOptions || {}, a.renderOptions.hideFilterWidget = !0, a.breadcrumbs = [ {
title:"Image Streams",
link:"project/" + b.project + "/browse/images"
}, {
title:b.imagestream
} ], a.emptyMessage = "Loading...";
var g = [];
d.get(b.project).then(_.spread(function(d, h) {
a.project = d, c.get("imagestreams", b.imagestream, h).then(function(d) {
a.loaded = !0, a.imageStream = d, a.emptyMessage = "No tags to show", g.push(c.watchObject("imagestreams", b.imagestream, h, function(b, c) {
"DELETED" === c && (a.alerts.deleted = {
type:"warning",
message:"This image stream has been deleted."
}), a.imageStream = b, a.tagsByName = f.tagsByName(a.imageStream);
}));
}, function(b) {
a.loaded = !0, a.alerts.load = {
type:"error",
message:"The image stream details could not be loaded.",
details:"Reason: " + e("getErrorDetails")(b)
};
}), a.$on("$destroy", function() {
c.unwatchAll(g);
});
}));
} ]), angular.module("openshiftConsole").controller("DeploymentsController", [ "$scope", "$filter", "$routeParams", "AlertMessageService", "DataService", "DeploymentsService", "LabelFilter", "LabelsService", "Logger", "ProjectsService", function(a, b, c, d, e, f, g, h, i, j) {
a.projectName = c.project, a.replicationControllers = {}, a.unfilteredDeploymentConfigs = {}, a.unfilteredDeployments = {}, a.replicationControllersByDC = {}, a.labelSuggestions = {}, a.alerts = a.alerts || {}, a.emptyMessage = "Loading...", a.expandedDeploymentConfigRow = {}, a.unfilteredReplicaSets = {}, a.unfilteredReplicationControllers = {}, d.getAlerts().forEach(function(b) {
a.alerts[b.name] = b.data;
}), d.clearAlerts();
var k, l, m = b("annotation"), n = function() {
a.replicaSetsByDeployment = h.groupBySelector(k, l, {
matchSelector:!0
}), a.unfilteredReplicaSets = _.get(a, [ "replicaSetsByDeployment", "" ], {}), g.addLabelSuggestionsFromResources(a.unfilteredReplicaSets, a.labelSuggestions), g.setLabelSuggestions(a.labelSuggestions), a.replicaSets = g.getLabelSelector().select(a.unfilteredReplicaSets), a.latestReplicaSetByDeployment = {}, _.each(a.replicaSetsByDeployment, function(b, c) {
c && (a.latestReplicaSetByDeployment[c] = f.getActiveReplicaSet(b, l[c]));
});
}, o = [];
j.get(c.project).then(_.spread(function(c, d) {
function h() {
var b = !g.getLabelSelector().isEmpty();
if (!b) return void delete a.alerts.deployments;
var c = _.isEmpty(a.unfilteredDeploymentConfigs) && _.isEmpty(a.unfilteredReplicationControllers) && _.isEmpty(a.unfilteredDeployments) && _.isEmpty(a.unfilteredReplicaSets);
if (c) return void delete a.alerts.deployments;
var d = _.isEmpty(a.deploymentConfigs) && _.isEmpty(a.replicationControllersByDC[""]) && _.isEmpty(a.deployments) && _.isEmpty(a.replicaSets);
return d ? void (a.alerts.deployments = {
type:"warning",
details:"The active filters are hiding all deployments."
}) :void delete a.alerts.deployments;
}
a.project = c, o.push(e.watch("replicationcontrollers", d, function(c, d, e) {
a.replicationControllers = c.by("metadata.name");
var j, k;
if (e && (j = m(e, "deploymentConfig"), k = e.metadata.name), a.replicationControllersByDC = f.associateDeploymentsToDeploymentConfig(a.replicationControllers, a.deploymentConfigs, !0), a.replicationControllersByDC[""] && (a.unfilteredReplicationControllers = a.replicationControllersByDC[""], g.addLabelSuggestionsFromResources(a.unfilteredReplicationControllers, a.labelSuggestions), g.setLabelSuggestions(a.labelSuggestions), a.replicationControllersByDC[""] = g.getLabelSelector().select(a.replicationControllersByDC[""])), h(), d) {
if ("ADDED" === d || "MODIFIED" === d && [ "New", "Pending", "Running" ].indexOf(b("deploymentStatus")(e)) > -1) a.deploymentConfigDeploymentsInProgress[j] = a.deploymentConfigDeploymentsInProgress[j] || {}, a.deploymentConfigDeploymentsInProgress[j][k] = e; else if ("MODIFIED" === d) {
var l = b("deploymentStatus")(e);
"Complete" !== l && "Failed" !== l || delete a.deploymentConfigDeploymentsInProgress[j][k];
}
} else a.deploymentConfigDeploymentsInProgress = f.associateRunningDeploymentToDeploymentConfig(a.replicationControllersByDC);
e ? "DELETED" !== d && (e.causes = b("deploymentCauses")(e)) :angular.forEach(a.replicationControllers, function(a) {
a.causes = b("deploymentCauses")(a);
}), i.log("replicationControllers (subscribe)", a.replicationControllers);
})), o.push(e.watch({
group:"extensions",
resource:"replicasets"
}, d, function(b) {
k = b.by("metadata.name"), n(), i.log("replicasets (subscribe)", a.replicaSets);
})), o.push(e.watch("deploymentconfigs", d, function(b) {
a.unfilteredDeploymentConfigs = b.by("metadata.name"), g.addLabelSuggestionsFromResources(a.unfilteredDeploymentConfigs, a.labelSuggestions), g.setLabelSuggestions(a.labelSuggestions), a.deploymentConfigs = g.getLabelSelector().select(a.unfilteredDeploymentConfigs), a.emptyMessage = "No deployment configurations to show", a.replicationControllersByDC = f.associateDeploymentsToDeploymentConfig(a.replicationControllers, a.deploymentConfigs, !0), a.replicationControllersByDC[""] && (a.unfilteredReplicationControllers = a.replicationControllersByDC[""], a.replicationControllersByDC[""] = g.getLabelSelector().select(a.replicationControllersByDC[""])), h(), i.log("deploymentconfigs (subscribe)", a.deploymentConfigs);
})), o.push(e.watch({
group:"extensions",
resource:"deployments"
}, d, function(b) {
l = a.unfilteredDeployments = b.by("metadata.name"), g.addLabelSuggestionsFromResources(a.unfilteredDeployments, a.labelSuggestions), g.setLabelSuggestions(a.labelSuggestions), a.deployments = g.getLabelSelector().select(a.unfilteredDeployments), n(), i.log("deployments (subscribe)", a.unfilteredDeployments);
})), a.showEmptyMessage = function() {
return 0 === b("hashSize")(a.replicationControllersByDC) || !(1 !== b("hashSize")(a.replicationControllersByDC) || !a.replicationControllersByDC[""]);
}, g.onActiveFiltersChanged(function(b) {
a.$apply(function() {
a.deploymentConfigs = b.select(a.unfilteredDeploymentConfigs), a.replicationControllersByDC = f.associateDeploymentsToDeploymentConfig(a.replicationControllers, a.deploymentConfigs, !0), a.replicationControllersByDC[""] && (a.unfilteredReplicationControllers = a.replicationControllersByDC[""], a.replicationControllersByDC[""] = g.getLabelSelector().select(a.replicationControllersByDC[""])), a.deployments = b.select(a.unfilteredDeployments), a.replicaSets = b.select(a.unfilteredReplicaSets), h();
});
}), a.$on("$destroy", function() {
e.unwatchAll(o);
});
}));
} ]), angular.module("openshiftConsole").controller("DeploymentController", [ "$scope", "$filter", "$routeParams", "AlertMessageService", "DataService", "DeploymentsService", "EnvironmentService", "HPAService", "ImageStreamResolver", "ModalsService", "Navigate", "Logger", "ProjectsService", "StorageService", function(a, b, c, d, e, f, g, h, i, j, k, l, m, n) {
var o = {};
a.projectName = c.project, a.name = c.deployment, a.forms = {}, a.alerts = {}, a.imagesByDockerReference = {}, a.breadcrumbs = [ {
title:"Deployments",
link:"project/" + c.project + "/browse/deployments"
}, {
title:c.deployment
} ], a.emptyMessage = "Loading...", a.healthCheckURL = k.healthCheckURL(c.project, "Deployment", c.deployment, "extensions"), d.getAlerts().forEach(function(b) {
a.alerts[b.name] = b.data;
}), d.clearAlerts();
var p = !1, q = function(b, c) {
if (!p) {
if (!a.forms.deploymentEnvVars || a.forms.deploymentEnvVars.$pristine) return void (a.updatedDeployment = g.copyAndNormalize(b));
if (g.isEnvironmentEqual(b, c)) return void (a.updatedDeployment = g.mergeEdits(a.updatedDeployment, b));
p = !0, a.alerts["env-conflict"] = {
type:"warning",
message:"The environment variables for the deployment have been updated in the background. Saving your changes may create a conflict or cause loss of data.",
links:[ {
label:"Reload Environment Variables",
onClick:function() {
return a.clearEnvVarUpdates(), !0;
}
} ]
};
}
}, r = [];
m.get(c.project).then(_.spread(function(d, k) {
a.project = d, a.projectContext = k;
var m, s = {}, t = function() {
h.getHPAWarnings(a.deployment, a.autoscalers, s, d).then(function(b) {
a.hpaWarnings = b;
});
};
e.get({
group:"extensions",
resource:"deployments"
}, c.deployment, k).then(function(d) {
a.loaded = !0, a.deployment = d, t(), a.saveEnvVars = function() {
g.compact(a.updatedDeployment), m = e.update({
group:"extensions",
resource:"deployments"
}, c.deployment, a.updatedDeployment, k), m.then(function() {
a.alerts.saveEnvSuccess = {
type:"success",
message:c.deployment + " was updated."
}, a.forms.deploymentEnvVars.$setPristine();
}, function(d) {
a.alerts.saveEnvError = {
type:"error",
message:c.deployment + " was not updated.",
details:"Reason: " + b("getErrorDetails")(d)
};
})["finally"](function() {
m = null;
});
}, a.clearEnvVarUpdates = function() {
a.updatedDeployment = g.copyAndNormalize(a.deployment), a.forms.deploymentEnvVars.$setPristine(), p = !1;
}, r.push(e.watchObject({
group:"extensions",
resource:"deployments"
}, c.deployment, k, function(b, c) {
"DELETED" === c && (a.alerts.deleted = {
type:"warning",
message:"This deployment has been deleted."
});
var d = a.deployment;
a.deployment = b, a.updatingPausedState = !1, t(), q(b, d), m ? m["finally"](function() {
q(b, d);
}) :q(b, d), i.fetchReferencedImageStreamImages([ b.spec.template ], a.imagesByDockerReference, o, k);
})), r.push(e.watch({
group:"extensions",
resource:"replicasets"
}, k, function(b) {
var c = b.by("metadata.name"), e = new LabelSelector(d.spec.selector);
c = _.filter(c, function(a) {
return e.covers(new LabelSelector(a.spec.selector));
}), a.inProgressDeployment = _.chain(c).filter("status.replicas").size() > 1, a.replicaSetsForDeployment = f.sortByRevision(c);
}));
}, function(c) {
a.loaded = !0, a.alerts.load = {
type:"error",
message:404 === c.status ? "This deployment can not be found, it may have been deleted." :"The deployment details could not be loaded.",
details:404 === c.status ? "Any remaining deployment history for this deployment will be shown." :"Reason: " + b("getErrorDetails")(c)
};
}), e.list("limitranges", k, function(a) {
s = a.by("metadata.name"), t();
}), r.push(e.watch("imagestreams", k, function(b) {
var c = b.by("metadata.name");
i.buildDockerRefMapForImageStreams(c, o), a.deployment && i.fetchReferencedImageStreamImages([ a.deployment.spec.template ], a.imagesByDockerReference, o, k), l.log("imagestreams (subscribe)", a.imageStreams);
})), r.push(e.watch({
group:"extensions",
resource:"horizontalpodautoscalers"
}, k, function(b) {
a.autoscalers = h.filterHPA(b.by("metadata.name"), "Deployment", c.deployment), t();
})), r.push(e.watch("builds", k, function(b) {
a.builds = b.by("metadata.name"), l.log("builds (subscribe)", a.builds);
})), a.scale = function(c) {
var d = function(c) {
a.alerts = a.alerts || {}, a.alerts.scale = {
type:"error",
message:"An error occurred scaling the deployment.",
details:b("getErrorDetails")(c)
};
};
f.scale(a.deployment, c).then(_.noop, d);
}, a.setPaused = function(c) {
a.updatingPausedState = !0, f.setPaused(a.deployment, c, k).then(_.noop, function(d) {
a.updatingPausedState = !1, a.alerts = a.alerts || {}, a.alerts.scale = {
type:"error",
message:"An error occurred " + (c ? "pausing" :"resuming") + " the deployment.",
details:b("getErrorDetails")(d)
};
});
}, a.removeVolume = function(c) {
var d;
d = _.get(a, "deployment.spec.paused") ? "This will remove the volume from the deployment." :"This will remove the volume from the deployment and start a new rollout.", c.persistentVolumeClaim ? d += " It will not delete the persistent volume claim." :c.secret ? d += " It will not delete the secret." :c.configMap && (d += " It will not delete the config map.");
var e = j.confirm({
message:"Remove volume " + c.name + "?",
details:d,
okButtonText:"Remove",
okButtonClass:"btn-danger",
cancelButtonText:"Cancel"
}), f = function(c) {
a.alerts["remove-volume-error"] = {
type:"error",
message:"An error occurred removing the volume.",
details:b("getErrorDetails")(c)
};
}, g = function() {
n.removeVolume(a.deployment, c, k).then(_.noop, f);
};
e.then(g);
}, a.$on("$destroy", function() {
e.unwatchAll(r);
});
}));
} ]), angular.module("openshiftConsole").controller("DeploymentConfigController", [ "$scope", "$filter", "$routeParams", "AlertMessageService", "BreadcrumbsService", "DataService", "DeploymentsService", "EnvironmentService", "HPAService", "ImageStreamResolver", "ModalsService", "Navigate", "Logger", "ProjectsService", "StorageService", "LabelFilter", "labelNameFilter", function(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q) {
var r = {};
a.projectName = c.project, a.deploymentConfigName = c.deploymentconfig, a.deploymentConfig = null, a.deployments = {}, a.unfilteredDeployments = {}, a.imagesByDockerReference = {}, a.builds = {}, a.labelSuggestions = {}, a.forms = {}, a.alerts = {}, a.breadcrumbs = e.getBreadcrumbs({
name:c.deploymentconfig,
kind:"DeploymentConfig",
namespace:c.project
}), a.emptyMessage = "Loading...", a.healthCheckURL = l.healthCheckURL(c.project, "DeploymentConfig", c.deploymentconfig), d.getAlerts().forEach(function(b) {
a.alerts[b.name] = b.data;
}), d.clearAlerts();
var s = b("orderObjectsByDate"), t = b("mostRecent"), u = !1, v = function(b, c) {
if (!u) {
if (!a.forms.dcEnvVars || a.forms.dcEnvVars.$pristine) return void (a.updatedDeploymentConfig = h.copyAndNormalize(b));
if (h.isEnvironmentEqual(b, c)) return void (a.updatedDeploymentConfig = h.mergeEdits(a.updatedDeploymentConfig, b));
u = !0, a.alerts["env-conflict"] = {
type:"warning",
message:"The environment variables for the deployment configuration have been updated in the background. Saving your changes may create a conflict or cause loss of data.",
links:[ {
label:"Reload Environment Variables",
onClick:function() {
return a.clearEnvVarUpdates(), !0;
}
} ]
};
}
}, w = [];
n.get(c.project).then(_.spread(function(d, e) {
function l() {
p.getLabelSelector().isEmpty() || !$.isEmptyObject(a.deployments) || $.isEmptyObject(a.unfilteredDeployments) ? delete a.alerts.deployments :a.alerts.deployments = {
type:"warning",
details:"The active filters are hiding all deployments."
};
}
a.project = d, a.projectContext = e;
var n, x = {}, y = function() {
i.getHPAWarnings(a.deploymentConfig, a.autoscalers, x, d).then(function(b) {
a.hpaWarnings = b;
});
};
f.get("deploymentconfigs", c.deploymentconfig, e).then(function(d) {
a.loaded = !0, a.deploymentConfig = d, a.strategyParams = b("deploymentStrategyParams")(d), y(), a.updatedDeploymentConfig = h.copyAndNormalize(d), a.saveEnvVars = function() {
h.compact(a.updatedDeploymentConfig), n = f.update("deploymentconfigs", c.deploymentconfig, a.updatedDeploymentConfig, e), n.then(function() {
a.alerts.saveDCEnvVarsSuccess = {
type:"success",
message:a.deploymentConfigName + " was updated."
}, a.forms.dcEnvVars.$setPristine();
}, function(c) {
a.alerts.saveDCEnvVarsError = {
type:"error",
message:a.deploymentConfigName + " was not updated.",
details:"Reason: " + b("getErrorDetails")(c)
};
})["finally"](function() {
n = null;
});
}, a.clearEnvVarUpdates = function() {
a.updatedDeploymentConfig = h.copyAndNormalize(a.deploymentConfig), a.forms.dcEnvVars.$setPristine(), u = !1;
}, w.push(f.watchObject("deploymentconfigs", c.deploymentconfig, e, function(b, c) {
"DELETED" === c && (a.alerts.deleted = {
type:"warning",
message:"This deployment configuration has been deleted."
});
var d = a.deploymentConfig;
a.deploymentConfig = b, a.updatingPausedState = !1, y(), n ? n["finally"](function() {
v(b, d);
}) :v(b, d), j.fetchReferencedImageStreamImages([ b.spec.template ], a.imagesByDockerReference, r, e);
}));
}, function(c) {
a.loaded = !0, a.alerts.load = {
type:"error",
message:404 === c.status ? "This deployment configuration can not be found, it may have been deleted." :"The deployment configuration details could not be loaded.",
details:404 === c.status ? "Any remaining deployment history for this deployment will be shown." :"Reason: " + b("getErrorDetails")(c)
};
}), w.push(f.watch("replicationcontrollers", e, function(d, e, f) {
var h = c.deploymentconfig;
if (a.emptyMessage = "No deployments to show", e) {
if (g.deploymentBelongsToConfig(f, c.deploymentconfig)) {
var i = f.metadata.name;
switch (e) {
case "ADDED":
case "MODIFIED":
a.unfilteredDeployments[i] = f, b("deploymentIsInProgress")(f) ? (a.deploymentConfigDeploymentsInProgress[h] = a.deploymentConfigDeploymentsInProgress[h] || {}, a.deploymentConfigDeploymentsInProgress[h][i] = f) :a.deploymentConfigDeploymentsInProgress[h] && delete a.deploymentConfigDeploymentsInProgress[h][i], f.causes = b("deploymentCauses")(f);
break;

case "DELETED":
delete a.unfilteredDeployments[i], a.deploymentConfigDeploymentsInProgress[h] && delete a.deploymentConfigDeploymentsInProgress[h][i];
}
}
} else {
var j = g.associateDeploymentsToDeploymentConfig(d.by("metadata.name"));
a.unfilteredDeployments = j[c.deploymentconfig] || {}, angular.forEach(a.unfilteredDeployments, function(a) {
a.causes = b("deploymentCauses")(a);
}), a.deploymentConfigDeploymentsInProgress = g.associateRunningDeploymentToDeploymentConfig(j);
}
a.deployments = p.getLabelSelector().select(a.unfilteredDeployments), a.orderedDeployments = s(a.deployments, !0), a.deploymentInProgress = !!_.size(a.deploymentConfigDeploymentsInProgress[h]), a.mostRecent = t(a.unfilteredDeployments), l(), p.addLabelSuggestionsFromResources(a.unfilteredDeployments, a.labelSuggestions), p.setLabelSuggestions(a.labelSuggestions);
}, {
http:{
params:{
labelSelector:q("deploymentConfig") + "=" + a.deploymentConfigName
}
}
})), f.list("limitranges", e, function(a) {
x = a.by("metadata.name"), y();
}), w.push(f.watch("imagestreams", e, function(b) {
var c = b.by("metadata.name");
j.buildDockerRefMapForImageStreams(c, r), a.deploymentConfig && j.fetchReferencedImageStreamImages([ a.deploymentConfig.spec.template ], a.imagesByDockerReference, r, e), m.log("imagestreams (subscribe)", a.imageStreams);
})), w.push(f.watch("builds", e, function(b) {
a.builds = b.by("metadata.name"), m.log("builds (subscribe)", a.builds);
})), w.push(f.watch({
group:"extensions",
resource:"horizontalpodautoscalers"
}, e, function(b) {
a.autoscalers = i.filterHPA(b.by("metadata.name"), "DeploymentConfig", c.deploymentconfig), y();
})), p.onActiveFiltersChanged(function(b) {
a.$apply(function() {
a.deployments = b.select(a.unfilteredDeployments), a.orderedDeployments = s(a.deployments, !0), l();
});
}), a.canDeploy = function() {
return !!a.deploymentConfig && (!a.deploymentConfig.metadata.deletionTimestamp && (!a.deploymentInProgress && !a.deploymentConfig.spec.paused));
}, a.startLatestDeployment = function() {
a.canDeploy() && g.startLatestDeployment(a.deploymentConfig, e, a);
}, a.scale = function(c) {
var d = function(c) {
a.alerts["scale-error"] = {
type:"error",
message:"An error occurred scaling the deployment config.",
details:b("getErrorDetails")(c)
};
};
g.scale(a.deploymentConfig, c).then(_.noop, d);
}, a.setPaused = function(c) {
a.updatingPausedState = !0, g.setPaused(a.deploymentConfig, c, e).then(_.noop, function(d) {
a.updatingPausedState = !1, a.alerts["pause-error"] = {
type:"error",
message:"An error occurred " + (c ? "pausing" :"resuming") + " the deployment config.",
details:b("getErrorDetails")(d)
};
});
};
var z = function() {
if (_.get(a, "deploymentConfig.spec.paused")) return !1;
var b = _.get(a, "deploymentConfig.spec.triggers", []);
return _.some(b, {
type:"ConfigChange"
});
};
a.removeVolume = function(c) {
var d;
d = z() ? "This will remove the volume from the deployment config and trigger a new deployment." :"This will remove the volume from the deployment config.", c.persistentVolumeClaim ? d += " It will not delete the persistent volume claim." :c.secret ? d += " It will not delete the secret." :c.configMap && (d += " It will not delete the config map.");
var f = k.confirm({
message:"Remove volume " + c.name + "?",
details:d,
okButtonText:"Remove",
okButtonClass:"btn-danger",
cancelButtonText:"Cancel"
}), g = function(c) {
a.alerts["remove-volume-error"] = {
type:"error",
message:"An error occurred removing the volume.",
details:b("getErrorDetails")(c)
};
}, h = function() {
o.removeVolume(a.deploymentConfig, c, e).then(_.noop, g);
};
f.then(h);
}, a.$on("$destroy", function() {
f.unwatchAll(w);
});
}));
} ]), angular.module("openshiftConsole").controller("ReplicaSetController", [ "$scope", "$filter", "$routeParams", "AlertMessageService", "AuthorizationService", "BreadcrumbsService", "DataService", "DeploymentsService", "EnvironmentService", "HPAService", "ImageStreamResolver", "Logger", "MetricsService", "ModalsService", "Navigate", "ProjectsService", "StorageService", "keyValueEditorUtils", "kind", function(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s) {
var t = !1, u = b("annotation"), v = b("humanizeKind")(s);
switch (s) {
case "ReplicaSet":
a.resource = {
group:"extensions",
resource:"replicasets"
}, a.healthCheckURL = o.healthCheckURL(c.project, "ReplicaSet", c.replicaSet, "extensions");
break;

case "ReplicationController":
a.resource = "replicationcontrollers", a.healthCheckURL = o.healthCheckURL(c.project, "ReplicationController", c.replicaSet);
}
var w = {};
a.projectName = c.project, a.kind = s, a.replicaSet = null, a.deploymentConfig = null, a.deploymentConfigMissing = !1, a.imagesByDockerReference = {}, a.builds = {}, a.alerts = {}, a.renderOptions = a.renderOptions || {}, a.renderOptions.hideFilterWidget = !0, a.forms = {}, a.logOptions = {}, d.getAlerts().forEach(function(b) {
a.alerts[b.name] = b.data;
}), d.clearAlerts();
var x = [];
m.isAvailable().then(function(b) {
a.metricsAvailable = b;
});
var y, z = b("deploymentStatus"), A = function(b) {
a.logCanRun = !_.includes([ "New", "Pending" ], z(b));
}, B = !1, C = function(c, d) {
if (!B) {
if (!a.forms.envForm || a.forms.envForm.$pristine) return void (a.updatedReplicaSet = i.copyAndNormalize(c));
if (i.isEnvironmentEqual(c, d)) return void (a.updatedReplicaSet = i.mergeEdits(a.updatedReplicaSet, c));
B = !0, a.alerts["env-conflict"] = {
type:"warning",
message:"The environment variables for the " + b("humanizeKind")(a.replicaSet.kind) + " have been updated in the background. Saving your changes may create a conflict or cause loss of data.",
links:[ {
label:"Reload Environment Variables",
onClick:function() {
return a.clearEnvVarUpdates(), !0;
}
} ]
};
}
};
a.saveEnvVars = function() {
i.compact(a.updatedReplicaSet), y = g.update(a.resource, c.replicaSet, a.updatedReplicaSet, a.projectContext), y.then(function() {
a.alerts.saveEnvSuccess = {
type:"success",
message:a.replicaSet.metadata.name + " was updated."
}, a.forms.envForm.$setPristine();
}, function(c) {
a.alerts.saveEnvError = {
type:"error",
message:a.replicaSet.metadata.name + " was not updated.",
details:"Reason: " + b("getErrorDetails")(c)
};
});
}, a.clearEnvVarUpdates = function() {
a.updatedReplicaSet = i.copyAndNormalize(a.replicaSet), a.forms.envForm.$setPristine(), B = !1;
};
var D = b("isIE")() || b("isEdge")();
p.get(c.project).then(_.spread(function(d, i) {
a.project = d, a.projectContext = i;
var m, p, r = {}, B = {}, E = function() {
if (a.hpaForRS = j.filterHPA(r, s, c.replicaSet), a.deploymentConfigName && a.isActive) {
var b = j.filterHPA(r, "DeploymentConfig", a.deploymentConfigName);
a.autoscalers = a.hpaForRS.concat(b);
} else if (a.deployment && a.isActive) {
var d = j.filterHPA(r, "Deployment", a.deployment.metadata.name);
a.autoscalers = a.hpaForRS.concat(d);
} else a.autoscalers = a.hpaForRS;
}, F = function() {
x.push(g.watch(a.resource, i, function(b) {
var c, d = [];
angular.forEach(b.by("metadata.name"), function(b) {
var c = u(b, "deploymentConfig") || "";
c === a.deploymentConfigName && d.push(b);
}), c = h.getActiveDeployment(d), a.isActive = c && c.metadata.uid === a.replicaSet.metadata.uid, E();
}));
}, G = function() {
m && p && (a.podsForDeployment = _.filter(m, function(a) {
return p.matches(a);
}));
}, H = function() {
j.getHPAWarnings(a.replicaSet, a.autoscalers, B, d).then(function(b) {
a.hpaWarnings = b;
});
}, I = function(d) {
var e = u(d, "deploymentConfig");
if (e) {
t = !0, a.deploymentConfigName = e;
var f = u(d, "deploymentVersion");
f && (a.logOptions.version = f), a.healthCheckURL = o.healthCheckURL(c.project, "DeploymentConfig", e), g.get("deploymentconfigs", e, i, {
errorNotification:!1
}).then(function(b) {
a.deploymentConfig = b;
}, function(c) {
return 404 === c.status ? void (a.deploymentConfigMissing = !0) :void (a.alerts.load = {
type:"error",
message:"The deployment configuration details could not be loaded.",
details:"Reason: " + b("getErrorDetails")(c)
});
});
}
}, J = function() {
a.isActive = h.isActiveReplicaSet(a.replicaSet, a.deployment);
}, K = b("hasDeployment"), L = !1, M = function() {
K(a.replicaSet) && g.list({
group:"extensions",
resource:"deployments"
}, i, function(b) {
var d = b.by("metadata.name"), e = new LabelSelector(a.replicaSet.spec.selector);
return a.deployment = _.find(d, function(a) {
var b = new LabelSelector(a.spec.selector);
return b.covers(e);
}), a.deployment ? (a.healthCheckURL = o.healthCheckURL(c.project, "Deployment", a.deployment.metadata.name, "extensions"), x.push(g.watchObject({
group:"extensions",
resource:"deployments"
}, a.deployment.metadata.name, i, function(b, d) {
return "DELETED" === d ? (a.alerts["deployment-deleted"] = {
type:"warning",
message:"The deployment controlling this replica set has been deleted."
}, a.healthCheckURL = o.healthCheckURL(c.project, "ReplicaSet", c.replicaSet, "extensions"), a.deploymentMissing = !0, void delete a.deployment) :(a.breadcrumbs = f.getBreadcrumbs({
object:a.replicaSet,
displayName:"#" + h.getRevision(a.replicaSet),
parent:{
title:a.deployment.metadata.name,
link:o.resourceURL(a.deployment)
},
humanizedKind:"Deployments"
}), J(), void E());
})), void x.push(g.watch({
group:"extensions",
resource:"replicasets"
}, i, function(b) {
var c = new LabelSelector(a.deployment.spec.selector);
L = !1;
var d = 0;
_.each(b.by("metadata.name"), function(a) {
if (a.status.replicas && c.covers(new LabelSelector(a.spec.selector))) return d++, d > 1 ? (L = !0, !1) :void 0;
});
}))) :void (a.deploymentMissing = !0);
});
}, N = function() {
if (!_.isEmpty(w)) {
var b = _.get(a, "replicaSet.spec.template");
b && k.fetchReferencedImageStreamImages([ b ], a.imagesByDockerReference, w, i);
}
};
g.get(a.resource, c.replicaSet, i).then(function(b) {
switch (a.loaded = !0, a.replicaSet = b, A(b), s) {
case "ReplicationController":
I(b);
break;

case "ReplicaSet":
M();
}
H(), a.breadcrumbs = f.getBreadcrumbs({
object:b
}), x.push(g.watchObject(a.resource, c.replicaSet, i, function(b, c) {
"DELETED" === c && (a.alerts.deleted = {
type:"warning",
message:"This " + v + " has been deleted."
});
var d = a.replicaSet;
a.replicaSet = b, y ? y["finally"](function() {
C(b, d);
}) :C(b, d), A(b), H(), N();
})), a.deploymentConfigName && F(), a.$watch("replicaSet.spec.selector", function() {
p = new LabelSelector(a.replicaSet.spec.selector), G();
}, !0), x.push(g.watch("pods", i, function(a) {
m = a.by("metadata.name"), G();
}));
}, function(d) {
a.loaded = !0, a.alerts.load = {
type:"error",
message:"The " + v + " details could not be loaded.",
details:"Reason: " + b("getErrorDetails")(d)
}, a.breadcrumbs = f.getBreadcrumbs({
name:c.replicaSet,
kind:s,
namespace:c.project
});
}), x.push(g.watch(a.resource, i, function(c, d, e) {
a.replicaSets = c.by("metadata.name"), a.emptyMessage = "No deployments to show", "ReplicationController" === s && (a.deploymentsByDeploymentConfig = h.associateDeploymentsToDeploymentConfig(a.replicaSets));
var f, g;
e && (f = u(e, "deploymentConfig"), g = e.metadata.name), a.deploymentConfigDeploymentsInProgress = a.deploymentConfigDeploymentsInProgress || {}, d ? "ADDED" === d || "MODIFIED" === d && b("deploymentIsInProgress")(e) ? (a.deploymentConfigDeploymentsInProgress[f] = a.deploymentConfigDeploymentsInProgress[f] || {}, a.deploymentConfigDeploymentsInProgress[f][g] = e) :"MODIFIED" === d && a.deploymentConfigDeploymentsInProgress[f] && delete a.deploymentConfigDeploymentsInProgress[f][g] :a.deploymentConfigDeploymentsInProgress = h.associateRunningDeploymentToDeploymentConfig(a.deploymentsByDeploymentConfig), e ? "DELETED" !== d && (e.causes = b("deploymentCauses")(e)) :angular.forEach(a.replicaSets, function(a) {
a.causes = b("deploymentCauses")(a);
});
})), x.push(g.watch("imagestreams", i, function(a) {
var b = a.by("metadata.name");
k.buildDockerRefMapForImageStreams(b, w), N(), l.log("imagestreams (subscribe)", b);
})), x.push(g.watch("builds", i, function(b) {
a.builds = b.by("metadata.name"), l.log("builds (subscribe)", a.builds);
})), x.push(g.watch({
group:"extensions",
resource:"horizontalpodautoscalers"
}, i, function(a) {
r = a.by("metadata.name"), E(), H();
}, {
poll:D,
pollInterval:6e4
})), g.list("limitranges", i, function(a) {
B = a.by("metadata.name"), H();
});
var O = b("deploymentIsLatest");
a.showRollbackAction = function() {
return "Complete" === z(a.replicaSet) && !O(a.replicaSet, a.deploymentConfig) && !a.replicaSet.metadata.deletionTimestamp && e.canI("deploymentconfigrollbacks", "create");
}, a.retryFailedDeployment = function(b) {
h.retryFailedDeployment(b, i, a);
}, a.rollbackToDeployment = function(b, c, d, e) {
h.rollbackToDeployment(b, c, d, e, i, a);
}, a.cancelRunningDeployment = function(b) {
h.cancelRunningDeployment(b, i, a);
}, a.scale = function(c) {
var d = function(c) {
a.alerts = a.alerts || {}, a.alerts.scale = {
type:"error",
message:"An error occurred scaling.",
details:b("getErrorDetails")(c)
};
}, e = a.deployment || a.deploymentConfig || a.replicaSet;
h.scale(e, c).then(_.noop, d);
};
var P = b("hasDeploymentConfig");
a.isScalable = function() {
return !!_.isEmpty(a.autoscalers) && (!P(a.replicaSet) && !K(a.replicaSet) || (!(!a.deploymentConfigMissing && !a.deploymentMissing) || !(!a.deploymentConfig && !a.deployment) && (a.isActive && !L)));
}, a.removeVolume = function(c) {
var d = "This will remove the volume from the " + b("humanizeKind")(a.replicaSet.kind) + ".";
c.persistentVolumeClaim ? d += " It will not delete the persistent volume claim." :c.secret ? d += " It will not delete the secret." :c.configMap && (d += " It will not delete the config map.");
var e = n.confirm({
message:"Remove volume " + c.name + "?",
details:d,
okButtonText:"Remove",
okButtonClass:"btn-danger",
cancelButtonText:"Cancel"
}), f = function(c) {
a.alerts["remove-volume-error"] = {
type:"error",
message:"An error occurred removing the volume.",
details:b("getErrorDetails")(c)
};
}, g = function() {
q.removeVolume(a.replicaSet, c, i).then(_.noop, f);
};
e.then(g);
}, a.$on("$destroy", function() {
g.unwatchAll(x);
});
}));
} ]), angular.module("openshiftConsole").controller("StatefulSetsController", [ "$scope", "$routeParams", "AlertMessageService", "DataService", "ProjectsService", "LabelFilter", "LabelsService", function(a, b, c, d, e, f, g) {
a.projectName = b.project, a.alerts = a.alerts || {}, a.labelSuggestions = {}, a.emptyMessage = "Loading...", c.getAlerts().forEach(function(b) {
a.alerts[b.name] = b.data;
}), c.clearAlerts();
var h = [];
e.get(b.project).then(_.spread(function(b, c) {
function e() {
f.getLabelSelector().isEmpty() || !$.isEmptyObject(a.statefulSets) || $.isEmptyObject(a.unfilteredStatefulSets) ? delete a.alerts.statefulsets :a.alerts.statefulsets = {
type:"warning",
details:"The active filters are hiding all stateful sets."
};
}
a.project = b, h.push(d.watch({
resource:"statefulsets",
group:"apps",
version:"v1beta1"
}, c, function(b) {
angular.extend(a, {
loaded:!0,
unfilteredStatefulSets:b.by("metadata.name")
}), a.statefulSets = f.getLabelSelector().select(a.unfilteredStatefulSets), f.addLabelSuggestionsFromResources(a.unfilteredStatefulSets, a.labelSuggestions), f.setLabelSuggestions(a.labelSuggestions), e();
})), h.push(d.watch("pods", c, function(b) {
a.pods = b.by("metadata.name"), a.podsByOwnerUID = g.groupBySelector(a.pods, a.statefulSets, {
key:"metadata.uid"
});
})), f.onActiveFiltersChanged(function(b) {
a.$apply(function() {
a.statefulSets = b.select(a.unfilteredStatefulSets), e();
});
}), a.$on("$destroy", function() {
d.unwatchAll(h);
});
}));
} ]), angular.module("openshiftConsole").controller("StatefulSetController", [ "$filter", "$scope", "$routeParams", "AlertMessageService", "BreadcrumbsService", "DataService", "EnvironmentService", "MetricsService", "ProjectsService", function(a, b, c, d, e, f, g, h, i) {
b.projectName = c.project, b.statefulSetName = c.statefulset, b.forms = {}, b.alerts = {}, b.breadcrumbs = e.getBreadcrumbs({
name:b.statefulSetName,
kind:"StatefulSet",
namespace:c.project
}), b.emptyMessage = "Loading...";
var j = function(a) {
return g.copyAndNormalize(a);
};
d.getAlerts().forEach(function(a) {
b.alerts[a.name] = a.data;
}), d.clearAlerts();
var k, l = [], m = function(a, b) {
if (a && b) return b.select(a);
}, n = {
resource:"statefulsets",
group:"apps",
version:"v1beta1"
};
h.isAvailable().then(function(a) {
b.metricsAvailable = a;
}), i.get(c.project).then(_.spread(function(a, c) {
k = c, f.get(n, b.statefulSetName, c).then(function(d) {
angular.extend(b, {
statefulSet:j(d),
project:a,
projectContext:c,
loaded:!0,
isScalable:function() {
return !1;
},
scale:function() {}
}), l.push(f.watchObject(n, b.statefulSetName, c, function(a) {
angular.extend(b, {
resourceGroupVersion:n,
statefulSet:j(a)
});
}));
var e, g;
b.$watch("statefulSet.spec.selector", function() {
g = new LabelSelector(b.statefulSet.spec.selector), b.podsForStatefulSet = m(e, g);
}, !0), l.push(f.watch("pods", c, function(a) {
e = a.by("metadata.name"), b.podsForStatefulSet = m(e, g);
}));
});
})), b.$on("$destroy", function() {
f.unwatchAll(l);
});
} ]), angular.module("openshiftConsole").controller("ServicesController", [ "$routeParams", "$scope", "AlertMessageService", "DataService", "ProjectsService", "$filter", "LabelFilter", "Logger", function(a, b, c, d, e, f, g, h) {
b.projectName = a.project, b.services = {}, b.unfilteredServices = {}, b.routesByService = {}, b.routes = {}, b.labelSuggestions = {}, b.alerts = b.alerts || {}, b.emptyMessage = "Loading...", b.emptyMessageRoutes = "Loading...", c.getAlerts().forEach(function(a) {
b.alerts[a.name] = a.data;
}), c.clearAlerts();
var i = [];
e.get(a.project).then(_.spread(function(a, c) {
function e() {
g.getLabelSelector().isEmpty() || !$.isEmptyObject(b.services) || $.isEmptyObject(b.unfilteredServices) ? delete b.alerts.services :b.alerts.services = {
type:"warning",
details:"The active filters are hiding all services."
};
}
b.project = a, i.push(d.watch("services", c, function(a) {
b.unfilteredServices = a.by("metadata.name"), g.addLabelSuggestionsFromResources(b.unfilteredServices, b.labelSuggestions), g.setLabelSuggestions(b.labelSuggestions), b.services = g.getLabelSelector().select(b.unfilteredServices), b.emptyMessage = "No services to show", e(), h.log("services (subscribe)", b.unfilteredServices);
})), g.onActiveFiltersChanged(function(a) {
b.$apply(function() {
b.services = a.select(b.unfilteredServices), e();
});
}), b.$on("$destroy", function() {
d.unwatchAll(i);
});
}));
} ]), angular.module("openshiftConsole").controller("ServiceController", [ "$scope", "$routeParams", "DataService", "ProjectsService", "$filter", function(a, b, c, d, e) {
a.projectName = b.project, a.service = null, a.services = null, a.alerts = {}, a.renderOptions = a.renderOptions || {}, a.renderOptions.hideFilterWidget = !0, a.breadcrumbs = [ {
title:"Services",
link:"project/" + b.project + "/browse/services"
}, {
title:b.service
} ], a.podFailureReasons = {
Pending:"This pod will not receive traffic until all of its containers have been created."
};
var f = {}, g = [], h = function() {
a.service && (a.portsByRoute = {}, _.each(a.service.spec.ports, function(b) {
var c = !1;
b.nodePort && (a.showNodePorts = !0), _.each(a.routesForService, function(d) {
d.spec.port && d.spec.port.targetPort !== b.name && d.spec.port.targetPort !== b.targetPort || (a.portsByRoute[d.metadata.name] = a.portsByRoute[d.metadata.name] || [], a.portsByRoute[d.metadata.name].push(b), c = !0);
}), c || (a.portsByRoute[""] = a.portsByRoute[""] || [], a.portsByRoute[""].push(b));
}));
}, i = function() {
if (a.podsForService = {}, a.service) {
var b = new LabelSelector(a.service.spec.selector);
a.podsForService = b.select(f);
}
}, j = function(b, c) {
a.loaded = !0, a.service = b, i(), h(), "DELETED" === c && (a.alerts.deleted = {
type:"warning",
message:"This service has been deleted."
});
};
d.get(b.project).then(_.spread(function(d, k) {
a.project = d, a.projectContext = k, c.get("services", b.service, k).then(function(a) {
j(a), g.push(c.watchObject("services", b.service, k, j));
}, function(b) {
a.loaded = !0, a.alerts.load = {
type:"error",
message:"The service details could not be loaded.",
details:"Reason: " + e("getErrorDetails")(b)
};
}), g.push(c.watch("services", k, function(b) {
a.services = b.by("metadata.name");
})), g.push(c.watch("pods", k, function(a) {
f = a.by("metadata.name"), i();
})), g.push(c.watch("endpoints", k, function(c) {
a.podsWithEndpoints = {};
var d = c.by("metadata.name")[b.service];
d && _.each(d.subsets, function(b) {
_.each(b.addresses, function(b) {
"Pod" === _.get(b, "targetRef.kind") && (a.podsWithEndpoints[b.targetRef.name] = !0);
});
});
})), g.push(c.watch("routes", k, function(c) {
a.routesForService = {}, angular.forEach(c.by("metadata.name"), function(c) {
"Service" === c.spec.to.kind && c.spec.to.name === b.service && (a.routesForService[c.metadata.name] = c);
}), h(), Logger.log("routes (subscribe)", a.routesByService);
})), a.$on("$destroy", function() {
c.unwatchAll(g);
});
}));
} ]), angular.module("openshiftConsole").controller("SecretsController", [ "$routeParams", "$scope", "AlertMessageService", "DataService", "ProjectsService", "SecretsService", function(a, b, c, d, e, f) {
b.projectName = a.project, b.secretsByType = {}, b.alerts = b.alerts || {}, c.getAlerts().forEach(function(a) {
b.alerts[a.name] = a.data;
}), c.clearAlerts(), e.get(a.project).then(_.spread(function(a, c) {
b.project = a, b.context = c, d.list("secrets", c, function(a) {
b.secretsByType = f.groupSecretsByType(a), b.loaded = !0;
});
}));
} ]), angular.module("openshiftConsole").controller("SecretController", [ "$routeParams", "$filter", "$scope", "AlertMessageService", "DataService", "ProjectsService", "SecretsService", function(a, b, c, d, e, f, g) {
c.projectName = a.project, c.secretName = a.secret, c.view = {
showSecret:!1
}, c.alerts = c.alerts || {}, c.emptyMessage = "Loading...", c.breadcrumbs = [ {
title:"Secrets",
link:"project/" + a.project + "/browse/secrets"
}, {
title:c.secretName
} ], d.getAlerts().forEach(function(a) {
c.alerts[a.name] = a.data;
}), d.clearAlerts(), f.get(a.project).then(_.spread(function(a, d) {
c.project = a, c.context = d, e.get("secrets", c.secretName, d).then(function(a) {
c.secret = a, c.decodedSecretData = g.decodeSecretData(c.secret.data), c.loaded = !0;
}, function(a) {
c.loaded = !0, c.alerts.load = {
type:"error",
message:"The secret details could not be loaded.",
details:"Reason: " + b("getErrorDetails")(a)
};
});
}));
} ]), angular.module("openshiftConsole").controller("CreateSecretController", [ "$filter", "$location", "$routeParams", "$scope", "$window", "AlertMessageService", "ApplicationGenerator", "AuthorizationService", "DataService", "Navigate", "ProjectsService", function(a, b, c, d, e, f, g, h, i, j, k) {
d.alerts = {}, d.projectName = c.project, d.breadcrumbs = [ {
title:d.projectName,
link:"project/" + d.projectName
}, {
title:"Secrets",
link:"project/" + d.projectName + "/browse/secrets"
}, {
title:"Create Secret"
} ];
var l = function() {
return c.then ? void b.url(c.then) :void e.history.back();
};
k.get(c.project).then(_.spread(function(b, e) {
return d.project = b, d.context = e, d.breadcrumbs[0].title = a("displayName")(b), h.canI("secrets", "create", c.project) ? (d.postCreateAction = function(a, b) {
_.each(b, function(a) {
f.addAlert(a);
}), l();
}, void (d.cancel = l)) :void j.toErrorPage("You do not have authority to create secrets in project " + c.project + ".", "access_denied");
}));
} ]), angular.module("openshiftConsole").controller("ConfigMapsController", [ "$scope", "$routeParams", "AlertMessageService", "DataService", "LabelFilter", "ProjectsService", function(a, b, c, d, e, f) {
a.projectName = b.project, a.alerts = a.alerts || {}, a.loaded = !1, a.labelSuggestions = {}, c.getAlerts().forEach(function(b) {
a.alerts[b.name] = b.data;
}), c.clearAlerts();
var g, h = [], i = function() {
e.getLabelSelector().isEmpty() || !_.isEmpty(a.configMaps) || _.isEmpty(g) ? delete a.alerts["config-maps"] :a.alerts["config-maps"] = {
type:"warning",
details:"The active filters are hiding all config maps."
};
}, j = function() {
e.addLabelSuggestionsFromResources(g, a.labelSuggestions), e.setLabelSuggestions(a.labelSuggestions);
}, k = function() {
var b = e.getLabelSelector().select(g);
a.configMaps = _.sortBy(b, "metadata.name"), i();
};
f.get(b.project).then(_.spread(function(b, c) {
a.project = b, h.push(d.watch("configmaps", c, function(b) {
g = b.by("metadata.name"), j(), k(), a.loaded = !0;
})), e.onActiveFiltersChanged(function() {
a.$apply(k);
}), a.$on("$destroy", function() {
d.unwatchAll(h);
});
}));
} ]), angular.module("openshiftConsole").controller("ConfigMapController", [ "$scope", "$routeParams", "AlertMessageService", "BreadcrumbsService", "DataService", "ProjectsService", function(a, b, c, d, e, f) {
a.projectName = b.project, a.alerts = a.alerts || {}, a.loaded = !1, a.labelSuggestions = {}, a.breadcrumbs = d.getBreadcrumbs({
name:b.configMap,
kind:"ConfigMap",
namespace:b.project
}), c.getAlerts().forEach(function(b) {
a.alerts[b.name] = b.data;
}), c.clearAlerts();
var g = [], h = function(b, c) {
a.loaded = !0, a.configMap = b, "DELETED" === c && (a.alerts.deleted = {
type:"warning",
message:"This config map has been deleted."
});
};
f.get(b.project).then(_.spread(function(c, d) {
e.get("configmaps", b.configMap, d, {
errorNotification:!1
}).then(function(a) {
h(a), g.push(e.watchObject("configmaps", b.configMap, d, h));
}, function(b) {
a.loaded = !0, a.error = b;
}), a.$on("$destroy", function() {
e.unwatchAll(g);
});
}));
} ]), angular.module("openshiftConsole").controller("CreateConfigMapController", [ "$filter", "$routeParams", "$scope", "$window", "AuthorizationService", "DataService", "Navigate", "ProjectsService", function(a, b, c, d, e, f, g, h) {
c.alerts = {}, c.projectName = b.project, c.breadcrumbs = [ {
title:c.projectName,
link:"project/" + c.projectName
}, {
title:"Config Maps",
link:"project/" + c.projectName + "/browse/config-maps"
}, {
title:"Create Config Map"
} ], h.get(b.project).then(_.spread(function(h, i) {
return c.project = h, c.breadcrumbs[0].title = a("displayName")(h), e.canI("configmaps", "create", b.project) ? (c.configMap = {
apiVersion:"v1",
kind:"ConfigMap",
metadata:{
namespace:b.project
},
data:{}
}, void (c.createConfigMap = function() {
c.createConfigMapForm.$valid && (c.disableInputs = !0, f.create("configmaps", null, c.configMap, i).then(function() {
d.history.back();
}, function(b) {
c.disableInputs = !1, c.alerts["create-config-map"] = {
type:"error",
message:"An error occurred creating the config map.",
details:a("getErrorDetails")(b)
};
}));
})) :void g.toErrorPage("You do not have authority to create config maps in project " + b.project + ".", "access_denied");
}));
} ]), angular.module("openshiftConsole").controller("RoutesController", [ "$routeParams", "$scope", "AlertMessageService", "DataService", "$filter", "LabelFilter", "ProjectsService", function(a, b, c, d, e, f, g) {
b.projectName = a.project, b.unfilteredRoutes = {}, b.routes = {}, b.labelSuggestions = {}, b.alerts = b.alerts || {}, b.emptyMessage = "Loading...", c.getAlerts().forEach(function(a) {
b.alerts[a.name] = a.data;
}), c.clearAlerts();
var h = [];
g.get(a.project).then(_.spread(function(a, c) {
function e() {
f.getLabelSelector().isEmpty() || !$.isEmptyObject(b.routes) || $.isEmptyObject(b.unfilteredRoutes) ? delete b.alerts.routes :b.alerts.routes = {
type:"warning",
details:"The active filters are hiding all routes."
};
}
b.project = a, h.push(d.watch("routes", c, function(a) {
b.unfilteredRoutes = a.by("metadata.name"), f.addLabelSuggestionsFromResources(b.unfilteredRoutes, b.labelSuggestions), f.setLabelSuggestions(b.labelSuggestions), b.routes = f.getLabelSelector().select(b.unfilteredRoutes), b.emptyMessage = "No routes to show", e();
})), h.push(d.watch("services", c, function(a) {
b.services = a.by("metadata.name");
})), f.onActiveFiltersChanged(function(a) {
b.$apply(function() {
b.routes = a.select(b.unfilteredRoutes), e();
});
}), b.$on("$destroy", function() {
d.unwatchAll(h);
});
}));
} ]), angular.module("openshiftConsole").controller("RouteController", [ "$scope", "$filter", "$routeParams", "AlertMessageService", "DataService", "ProjectsService", "RoutesService", function(a, b, c, d, e, f, g) {
a.projectName = c.project, a.route = null, a.alerts = {}, a.renderOptions = a.renderOptions || {}, a.renderOptions.hideFilterWidget = !0, a.breadcrumbs = [ {
title:"Routes",
link:"project/" + c.project + "/browse/routes"
}, {
title:c.route
} ], d.getAlerts().forEach(function(b) {
a.alerts[b.name] = b.data;
}), d.clearAlerts();
var h, i = [], j = function(b, c) {
a.loaded = !0, a.route = b, h = g.isCustomHost(b), "DELETED" === c && (a.alerts.deleted = {
type:"warning",
message:"This route has been deleted."
});
}, k = function(b) {
var c = _.get(a, "route.metadata.uid");
return "router-host-" + c + "-" + b.host + "-" + b.routerCanonicalHostname;
};
a.showRouterHostnameAlert = function(b, c) {
if (!h) return !1;
if (!b || !b.host || !b.routerCanonicalHostname) return !1;
if (!c || "True" !== c.status) return !1;
var e = k(b);
return !d.isAlertPermanentlyHidden(e, a.projectName);
}, a.hideRouterHostnameAlert = function(b) {
var c = k(b);
d.permanentlyHideAlert(c, a.projectName);
}, f.get(c.project).then(_.spread(function(d, f) {
a.project = d, e.get("routes", c.route, f).then(function(a) {
j(a), i.push(e.watchObject("routes", c.route, f, j));
}, function(c) {
a.loaded = !0, a.alerts.load = {
type:"error",
message:"The route details could not be loaded.",
details:"Reason: " + b("getErrorDetails")(c)
};
}), i.push(e.watch("services", f, function(b) {
a.services = b.by("metadata.name");
})), a.$on("$destroy", function() {
e.unwatchAll(i);
});
}));
} ]), angular.module("openshiftConsole").controller("StorageController", [ "$routeParams", "$scope", "AlertMessageService", "DataService", "ProjectsService", "$filter", "LabelFilter", "Logger", function(a, b, c, d, e, f, g, h) {
b.projectName = a.project, b.pvcs = {}, b.unfilteredPVCs = {}, b.labelSuggestions = {}, b.alerts = b.alerts || {}, b.emptyMessage = "Loading...", c.getAlerts().forEach(function(a) {
b.alerts[a.name] = a.data;
}), c.clearAlerts();
var i = [];
e.get(a.project).then(_.spread(function(a, c) {
function e() {
g.getLabelSelector().isEmpty() || !$.isEmptyObject(b.pvcs) || $.isEmptyObject(b.unfilteredPVCs) ? delete b.alerts.storage :b.alerts.storage = {
type:"warning",
details:"The active filters are hiding all persistent volume claims."
};
}
b.project = a, i.push(d.watch("persistentvolumeclaims", c, function(a) {
b.unfilteredPVCs = a.by("metadata.name"), g.addLabelSuggestionsFromResources(b.unfilteredPVCs, b.labelSuggestions), g.setLabelSuggestions(b.labelSuggestions), b.pvcs = g.getLabelSelector().select(b.unfilteredPVCs), b.emptyMessage = "No persistent volume claims to show", e(), h.log("pvcs (subscribe)", b.unfilteredPVCs);
})), g.onActiveFiltersChanged(function(a) {
b.$apply(function() {
b.pvcs = a.select(b.unfilteredPVCs), e();
});
}), b.$on("$destroy", function() {
d.unwatchAll(i);
});
}));
} ]), angular.module("openshiftConsole").controller("OtherResourcesController", [ "$routeParams", "$location", "$scope", "AlertMessageService", "AuthorizationService", "DataService", "ProjectsService", "$filter", "LabelFilter", "Logger", "APIService", function(a, b, c, d, e, f, g, h, i, j, k) {
function l() {
i.getLabelSelector().isEmpty() || !$.isEmptyObject(c.resources) || $.isEmptyObject(c.unfilteredResources) ? delete c.alerts.resources :c.alerts.resources = {
type:"warning",
details:"The active filters are hiding all " + k.kindToResource(c.kindSelector.selected.kind, !0) + "."
};
}
function m() {
var a = c.kindSelector.selected;
if (a) {
var d = b.search();
d.kind = a.kind, d.group = a.group || "", b.replace().search(d), c.selectedResource = {
resource:k.kindToResource(a.kind),
group:a.group || ""
}, f.list({
group:a.group,
resource:k.kindToResource(a.kind)
}, c.context, function(b) {
c.unfilteredResources = b.by("metadata.name"), c.labelSuggestions = {}, i.addLabelSuggestionsFromResources(c.unfilteredResources, c.labelSuggestions), i.setLabelSuggestions(c.labelSuggestions), c.resources = i.getLabelSelector().select(c.unfilteredResources), c.emptyMessage = "No " + k.kindToResource(a.kind, !0) + " to show", l();
});
}
}
c.projectName = a.project, c.labelSuggestions = {}, c.alerts = c.alerts || {}, c.emptyMessage = "Select a resource from the list above ...", c.kindSelector = {
disabled:!0
}, c.kinds = _.filter(k.availableKinds(), function(a) {
switch (a.kind) {
case "ReplicationController":
case "Deployment":
case "DeploymentConfig":
case "BuildConfig":
case "Build":
case "ConfigMap":
case "Pod":
case "PersistentVolumeClaim":
case "Event":
case "Secret":
case "Service":
case "Route":
case "ImageStream":
case "ImageStreamTag":
case "ImageStreamImage":
case "ImageStreamImport":
case "ImageStreamMapping":
case "LimitRange":
case "ReplicaSet":
case "ResourceQuota":
case "AppliedClusterResourceQuota":
case "StatefulSet":
return !1;

default:
return !0;
}
}), c.getReturnURL = function() {
var b = _.get(c, "kindSelector.selected.kind");
return b ? URI.expand("project/{projectName}/browse/other?kind={kind}&group={group}", {
projectName:a.project,
kind:b,
group:_.get(c, "kindSelector.selected.group", "")
}).toString() :"";
}, d.getAlerts().forEach(function(a) {
c.alerts[a.name] = a.data;
}), d.clearAlerts();
var n = function(a, b) {
return _.some(c.kinds, function(c) {
return c.kind === a && (!c.group && !b || c.group === b);
});
};
g.get(a.project).then(_.spread(function(b, d) {
c.kinds = _.filter(c.kinds, function(a) {
var b = {
resource:k.kindToResource(a.kind),
group:a.group || ""
};
return !!e.checkResource(b.resource) && e.canI(b, "list", c.projectName);
}), c.project = b, c.context = d, c.kindSelector.disabled = !1, a.kind && n(a.kind, a.group) && (_.set(c, "kindSelector.selected.kind", a.kind), _.set(c, "kindSelector.selected.group", a.group || ""));
})), c.loadKind = m, c.$watch("kindSelector.selected", function() {
c.alerts = {}, m();
});
var o = h("humanizeKind");
c.matchKind = function(a, b) {
return o(a).toLowerCase().indexOf(b.toLowerCase()) !== -1;
}, i.onActiveFiltersChanged(function(a) {
c.$apply(function() {
c.resources = a.select(c.unfilteredResources), l();
});
});
} ]), angular.module("openshiftConsole").controller("PersistentVolumeClaimController", [ "$scope", "$routeParams", "DataService", "ProjectsService", "$filter", function(a, b, c, d, e) {
a.projectName = b.project, a.pvc = null, a.alerts = {}, a.renderOptions = a.renderOptions || {}, a.renderOptions.hideFilterWidget = !0, a.breadcrumbs = [ {
title:"Persistent Volume Claims",
link:"project/" + b.project + "/browse/storage"
}, {
title:b.pvc
} ];
var f = [], g = function(b, c) {
a.pvc = b, a.loaded = !0, "DELETED" === c && (a.alerts.deleted = {
type:"warning",
message:"This persistent volume claim has been deleted."
});
};
d.get(b.project).then(_.spread(function(d, h) {
a.project = d, c.get("persistentvolumeclaims", b.pvc, h).then(function(a) {
g(a), f.push(c.watchObject("persistentvolumeclaims", b.pvc, h, g));
}, function(b) {
a.loaded = !0, a.alerts.load = {
type:"error",
message:"The persistent volume claim details could not be loaded.",
details:"Reason: " + e("getErrorDetails")(b)
};
}), a.$on("$destroy", function() {
c.unwatchAll(f);
});
}));
} ]), angular.module("openshiftConsole").controller("SetLimitsController", [ "$filter", "$location", "$parse", "$routeParams", "$scope", "AlertMessageService", "APIService", "AuthorizationService", "BreadcrumbsService", "DataService", "LimitRangesService", "Navigate", "ProjectsService", function(a, b, c, d, e, f, g, h, i, j, k, l, m) {
if (!d.kind || !d.name) return void l.toErrorPage("Kind or name parameter missing.");
var n = [ "Deployment", "DeploymentConfig", "ReplicaSet", "ReplicationController" ];
if (!_.includes(n, d.kind)) return void l.toErrorPage("Health checks are not supported for kind " + d.kind + ".");
var o = a("humanizeKind"), p = o(d.kind, !0) + " " + d.name;
e.name = d.name, "ReplicationController" !== d.kind && "ReplicaSet" !== d.kind || (e.showPodWarning = !0), e.alerts = {}, e.renderOptions = {
hideFilterWidget:!0
}, e.breadcrumbs = i.getBreadcrumbs({
name:d.name,
kind:d.kind,
namespace:d.project,
subpage:"Edit Resource Limits",
includeProject:!0
});
var q = a("getErrorDetails"), r = function(a, b) {
e.alerts["set-compute-limits"] = {
type:"error",
message:a,
details:b
};
};
m.get(d.project).then(_.spread(function(c, m) {
e.breadcrumbs[0].title = a("displayName")(c);
var n = {
resource:g.kindToResource(d.kind),
group:d.group
};
if (!h.canI(n, "update", d.project)) return void l.toErrorPage("You do not have authority to update " + o(d.kind) + " " + d.name + ".", "access_denied");
j.get(n, e.name, m).then(function(a) {
var d = e.object = angular.copy(a);
e.breadcrumbs = i.getBreadcrumbs({
object:d,
project:c,
subpage:"Edit Resource Limits",
includeProject:!0
}), e.resourceURL = l.resourceURL(d), e.containers = _.get(d, "spec.template.spec.containers"), e.save = function() {
e.disableInputs = !0, j.update(n, e.name, d, m).then(function() {
f.addAlert({
name:e.name,
data:{
type:"success",
message:p + " was updated."
}
}), b.url(e.resourceURL);
}, function(a) {
e.disableInputs = !1, r(p + " could not be updated.", q(a));
});
};
}, function(a) {
r(p + " could not be loaded.", q(a));
});
var s = function() {
e.hideCPU || (e.cpuProblems = k.validatePodLimits(e.limitRanges, "cpu", e.containers, c)), e.memoryProblems = k.validatePodLimits(e.limitRanges, "memory", e.containers, c);
};
j.list("limitranges", m, function(b) {
e.limitRanges = b.by("metadata.name"), 0 !== a("hashSize")(b) && e.$watch("containers", s, !0);
});
}));
} ]), angular.module("openshiftConsole").controller("EditBuildConfigController", [ "$scope", "$filter", "$location", "$routeParams", "AlertMessageService", "ApplicationGenerator", "AuthorizationService", "DataService", "Navigate", "ProjectsService", "SOURCE_URL_PATTERN", "SecretsService", "keyValueEditorUtils", function(a, b, c, d, e, f, g, h, i, j, k, l, m) {
a.projectName = d.project, a.buildConfig = null, a.alerts = {}, a.sourceURLPattern = k, a.options = {}, a.jenkinsfileOptions = {
type:"path"
}, a.selectTypes = {
ImageStreamTag:"Image Stream Tag",
ImageStreamImage:"Image Stream Image",
DockerImage:"Docker Image Repository"
}, a.buildFromTypes = [ "ImageStreamTag", "ImageStreamImage", "DockerImage" ], a.pushToTypes = [ "ImageStreamTag", "DockerImage", "None" ], a.jenkinsfileTypes = [ {
id:"path",
title:"From Source Repository"
}, {
id:"inline",
title:"Inline"
} ], a.view = {
advancedOptions:!1,
hasHooks:!1
}, a.breadcrumbs = [ {
title:d.project,
link:"project/" + d.project
} ], d.isPipeline ? (a.breadcrumbs.push({
title:"Pipelines",
link:"project/" + d.project + "/browse/pipelines"
}), a.breadcrumbs.push({
title:d.buildconfig,
link:"project/" + d.project + "/browse/pipelines/" + d.buildconfig
})) :(a.breadcrumbs.push({
title:"Builds",
link:"project/" + d.project + "/browse/builds"
}), a.breadcrumbs.push({
title:d.buildconfig,
link:"project/" + d.project + "/browse/builds/" + d.buildconfig
})), a.breadcrumbs.push({
title:d.isPipeline ? "Edit Pipelines" :"Edit Builds"
}), a.imageOptions = {
from:{},
to:{},
fromSource:{}
}, a.sources = {
binary:!1,
dockerfile:!1,
git:!1,
images:!1,
contextDir:!1,
none:!0
}, a.triggers = {
githubWebhooks:[],
genericWebhooks:[],
imageChangeTriggers:[],
builderImageChangeTrigger:{},
configChangeTrigger:{}
}, a.runPolicyTypes = [ "Serial", "Parallel", "SerialLatestOnly" ], a.buildHookTypes = [ {
id:"command",
label:"Command"
}, {
id:"script",
label:"Shell Script"
}, {
id:"args",
label:"Arguments to default image entry point"
}, {
id:"commandArgs",
label:"Command with arguments"
}, {
id:"scriptArgs",
label:"Shell script with arguments"
} ], a.buildHookSelection = {
type:{}
}, a.getArgumentsDescription = function() {
var b = _.get(a, "buildHookSelection.type.id", "");
switch (b) {
case "args":
return "Enter the arguments that will be appended to the default image entry point.";

case "commandArgs":
return "Enter the arguments that will be appended to the command.";

case "scriptArgs":
return "Enter the arguments that will be appended to the script.";
}
return null;
};
var n = function() {
var b = !_.isEmpty(_.get(a, "buildConfig.spec.postCommit.args")), c = !_.isEmpty(_.get(a, "buildConfig.spec.postCommit.command")), d = !!_.get(a, "buildConfig.spec.postCommit.script");
a.view.hasHooks = b || c || d;
var e;
e = b && c ? "commandArgs" :b && d ? "scriptArgs" :b ? "args" :d ? "script" :"command", a.buildHookSelection.type = _.find(a.buildHookTypes, {
id:e
});
}, o = function() {
if (a.view.hasHooks) switch (a.buildHookSelection.type.id) {
case "script":
delete a.updatedBuildConfig.spec.postCommit.command, delete a.updatedBuildConfig.spec.postCommit.args;
break;

case "command":
delete a.updatedBuildConfig.spec.postCommit.script, delete a.updatedBuildConfig.spec.postCommit.args;
break;

case "args":
delete a.updatedBuildConfig.spec.postCommit.script, delete a.updatedBuildConfig.spec.postCommit.command;
break;

case "scriptArgs":
delete a.updatedBuildConfig.spec.postCommit.command;
break;

case "commandArgs":
delete a.updatedBuildConfig.spec.postCommit.script;
} else delete a.updatedBuildConfig.spec.postCommit.command, delete a.updatedBuildConfig.spec.postCommit.args, delete a.updatedBuildConfig.spec.postCommit.script;
};
e.getAlerts().forEach(function(b) {
a.alerts[b.name] = b.data;
}), e.clearAlerts(), a.secrets = {};
var p = [], q = b("buildStrategy");
j.get(d.project).then(_.spread(function(c, e) {
return a.project = c, a.context = e, a.breadcrumbs[0].title = b("displayName")(c), g.canI("buildconfigs", "update", d.project) ? void h.get("buildconfigs", d.buildconfig, e).then(function(c) {
a.buildConfig = c, n(), a.updatedBuildConfig = angular.copy(a.buildConfig), a.buildStrategy = q(a.updatedBuildConfig), a.strategyType = a.buildConfig.spec.strategy.type, a.envVars = a.buildStrategy.env || [], _.each(a.envVars, function(a) {
b("altTextForValueFrom")(a);
}), a.triggers = r(a.triggers, a.buildConfig.spec.triggers), a.sources = y(a.sources, a.buildConfig.spec.source), _.has(c, "spec.strategy.jenkinsPipelineStrategy.jenkinsfile") && (a.jenkinsfileOptions.type = "inline"), h.list("secrets", e, function(b) {
var c = l.groupSecretsByType(b), d = _.mapValues(c, function(a) {
return _.map(a, "metadata.name");
});
a.secrets.secretsByType = _.each(d, function(a) {
a.unshift("");
}), v();
});
var f = function(a, b) {
a.type = b && b.kind ? b.kind :"None";
var d = {}, e = "", f = "";
d = "ImageStreamTag" === a.type ? {
namespace:b.namespace || c.metadata.namespace,
imageStream:b.name.split(":")[0],
tagObject:{
tag:b.name.split(":")[1]
}
} :{
namespace:"",
imageStream:"",
tagObject:{
tag:""
}
}, e = "ImageStreamImage" === a.type ? (b.namespace || c.metadata.namespace) + "/" + b.name :"", f = "DockerImage" === a.type ? b.name :"", a.imageStreamTag = d, a.imageStreamImage = e, a.dockerImage = f;
};
f(a.imageOptions.from, a.buildStrategy.from), f(a.imageOptions.to, a.updatedBuildConfig.spec.output.to), a.sources.images && (a.sourceImages = a.buildConfig.spec.source.images, 1 === a.sourceImages.length ? (a.imageSourceTypes = angular.copy(a.buildFromTypes), f(a.imageOptions.fromSource, a.sourceImages[0].from), a.imageSourcePaths = _.map(a.sourceImages[0].paths, function(a) {
return {
name:a.sourcePath,
value:a.destinationDir
};
})) :(a.imageSourceFromObjects = [], a.sourceImages.forEach(function(b) {
a.imageSourceFromObjects.push(b.from);
}))), a.options.forcePull = !!a.buildStrategy.forcePull, "Docker" === a.strategyType && (a.options.noCache = !!a.buildConfig.spec.strategy.dockerStrategy.noCache, a.buildFromTypes.push("None")), p.push(h.watchObject("buildconfigs", d.buildconfig, e, function(b, c) {
"MODIFIED" === c && (a.alerts["updated/deleted"] = {
type:"warning",
message:"This build configuration has changed since you started editing it. You'll need to copy any changes you've made and edit again."
}), "DELETED" === c && (a.alerts["updated/deleted"] = {
type:"warning",
message:"This build configuration has been deleted."
}, a.disableInputs = !0), a.buildConfig = b;
})), a.loaded = !0;
}, function(c) {
a.loaded = !0, a.alerts.load = {
type:"error",
message:"The build configuration details could not be loaded.",
details:"Reason: " + b("getErrorDetails")(c)
};
}) :void i.toErrorPage("You do not have authority to update build config " + d.buildconfig + ".", "access_denied");
}));
var r = function(c, d) {
function e(c, d) {
var e = b("imageObjectRef")(c, a.projectName), f = b("imageObjectRef")(d, a.projectName);
return e === f;
}
var f = q(a.buildConfig).from;
return d.forEach(function(a) {
switch (a.type) {
case "Generic":
c.genericWebhooks.push({
disabled:!1,
data:a
});
break;

case "GitHub":
c.githubWebhooks.push({
disabled:!1,
data:a
});
break;

case "ImageChange":
var b = a.imageChange.from;
b || (b = f);
var d = {
present:!0,
data:a
};
e(b, f) ? c.builderImageChangeTrigger = d :c.imageChangeTriggers.push(d);
break;

case "ConfigChange":
c.configChangeTrigger = {
present:!0,
data:a
};
}
}), _.isEmpty(c.builderImageChangeTrigger) && (c.builderImageChangeTrigger = {
present:!1,
data:{
imageChange:{},
type:"ImageChange"
}
}), _.isEmpty(c.configChangeTrigger) && (c.configChangeTrigger = {
present:!1,
data:{
type:"ConfigChange"
}
}), c;
};
a.aceLoaded = function(a) {
var b = a.getSession();
b.setOption("tabSize", 2), b.setOption("useSoftTabs", !0), a.$blockScrolling = 1 / 0;
};
var s = function(a) {
return _.map(m.compactEntries(a), function(a) {
return {
sourcePath:a.name,
destinationDir:a.value
};
});
}, t = function(b) {
var c = {};
switch (b.type) {
case "ImageStreamTag":
c = {
kind:b.type,
name:b.imageStreamTag.imageStream + ":" + b.imageStreamTag.tagObject.tag
}, b.imageStreamTag.namespace !== a.buildConfig.metadata.namespace && (c.namespace = b.imageStreamTag.namespace);
break;

case "DockerImage":
c = {
kind:b.type,
name:b.dockerImage
};
break;

case "ImageStreamImage":
var d = b.imageStreamImage.split("/");
c = {
kind:b.type,
name:_.last(d)
}, c.namespace = 1 !== d.length ? d[0] :a.buildConfig.metadata.namespace;
}
return c;
}, u = function() {
var b = [].concat(a.triggers.githubWebhooks, a.triggers.genericWebhooks, a.triggers.imageChangeTriggers, a.triggers.builderImageChangeTrigger, a.triggers.configChangeTrigger);
return b = _.filter(b, function(a) {
return _.has(a, "disabled") && !a.disabled || a.present;
}), b = _.map(b, "data");
}, v = function() {
switch (a.secrets.picked = {
gitSecret:a.buildConfig.spec.source.sourceSecret ? [ a.buildConfig.spec.source.sourceSecret ] :[ {
name:""
} ],
pullSecret:q(a.buildConfig).pullSecret ? [ q(a.buildConfig).pullSecret ] :[ {
name:""
} ],
pushSecret:a.buildConfig.spec.output.pushSecret ? [ a.buildConfig.spec.output.pushSecret ] :[ {
name:""
} ]
}, a.strategyType) {
case "Source":
case "Docker":
a.secrets.picked.sourceSecrets = a.buildConfig.spec.source.secrets || [ {
secret:{
name:""
},
destinationDir:""
} ];
break;

case "Custom":
a.secrets.picked.sourceSecrets = q(a.buildConfig).secrets || [ {
secretSource:{
name:""
},
mountPath:""
} ];
}
}, w = function(a, b, c) {
b.name ? a[c] = b :delete a[c];
}, x = function(b, c) {
var d = "Custom" === a.strategyType ? "secretSource" :"secret", e = _.filter(c, function(a) {
return a[d].name;
});
_.isEmpty(e) ? delete b.secrets :b.secrets = e;
}, y = function(a, b) {
return "None" === b.type ? a :(a.none = !1, angular.forEach(b, function(b, c) {
a[c] = !0;
}), a);
};
a.save = function() {
switch (a.disableInputs = !0, o(), q(a.updatedBuildConfig).forcePull = a.options.forcePull, a.strategyType) {
case "Docker":
q(a.updatedBuildConfig).noCache = a.options.noCache;
break;

case "JenkinsPipeline":
"path" === a.jenkinsfileOptions.type ? delete a.updatedBuildConfig.spec.strategy.jenkinsPipelineStrategy.jenkinsfile :delete a.updatedBuildConfig.spec.strategy.jenkinsPipelineStrategy.jenkinsfilePath;
}
switch (a.sources.images && !_.isEmpty(a.sourceImages) && (a.updatedBuildConfig.spec.source.images[0].paths = s(a.imageSourcePaths), a.updatedBuildConfig.spec.source.images[0].from = t(a.imageOptions.fromSource)), "None" === a.imageOptions.from.type ? delete q(a.updatedBuildConfig).from :q(a.updatedBuildConfig).from = t(a.imageOptions.from), "None" === a.imageOptions.to.type ? delete a.updatedBuildConfig.spec.output.to :a.updatedBuildConfig.spec.output.to = t(a.imageOptions.to), q(a.updatedBuildConfig).env = m.compactEntries(a.envVars), w(a.updatedBuildConfig.spec.source, _.head(a.secrets.picked.gitSecret), "sourceSecret"), w(q(a.updatedBuildConfig), _.head(a.secrets.picked.pullSecret), "pullSecret"), w(a.updatedBuildConfig.spec.output, _.head(a.secrets.picked.pushSecret), "pushSecret"), a.strategyType) {
case "Source":
case "Docker":
x(a.updatedBuildConfig.spec.source, a.secrets.picked.sourceSecrets);
break;

case "Custom":
x(q(a.updatedBuildConfig), a.secrets.picked.sourceSecrets);
}
a.updatedBuildConfig.spec.triggers = u(), h.update("buildconfigs", a.updatedBuildConfig.metadata.name, a.updatedBuildConfig, a.context).then(function() {
e.addAlert({
name:a.updatedBuildConfig.metadata.name,
data:{
type:"success",
message:"Build Config " + a.updatedBuildConfig.metadata.name + " was successfully updated."
}
}), c.path(i.resourceURL(a.updatedBuildConfig, "BuildConfig", a.updatedBuildConfig.metadata.namespace));
}, function(c) {
a.disableInputs = !1, a.alerts.save = {
type:"error",
message:"An error occurred updating the build " + a.updatedBuildConfig.metadata.name + "Build Config",
details:b("getErrorDetails")(c)
};
});
}, a.$on("$destroy", function() {
h.unwatchAll(p);
});
} ]), angular.module("openshiftConsole").controller("EditConfigMapController", [ "$filter", "$routeParams", "$scope", "$window", "DataService", "BreadcrumbsService", "Navigate", "ProjectsService", function(a, b, c, d, e, f, g, h) {
var i = [];
c.alerts = {}, c.forms = {}, c.projectName = b.project, c.breadcrumbs = f.getBreadcrumbs({
name:b.configMap,
kind:"ConfigMap",
namespace:b.project,
includeProject:!0,
subpage:"Edit Config Map"
});
var j = function(a) {
return _.get(a, "metadata.resourceVersion");
};
h.get(b.project).then(_.spread(function(g, h) {
e.get("configmaps", b.configMap, h).then(function(a) {
c.loaded = !0, c.breadcrumbs = f.getBreadcrumbs({
name:b.configMap,
object:a,
includeProject:!0,
project:g,
subpage:"Edit Config Map"
}), c.configMap = a, i.push(e.watchObject("configmaps", b.configMap, h, function(a, b) {
c.resourceChanged = j(a) !== j(c.configMap), c.resourceDeleted = "DELETED" === b;
}));
}, function(b) {
c.loaded = !0, c.alerts.load = {
type:"error",
message:"The config map details could not be loaded.",
details:a("getErrorDetails")(b)
};
}), c.updateConfigMap = function() {
c.forms.editConfigMapForm.$valid && (c.disableInputs = !0, e.update("configmaps", c.configMap.metadata.name, c.configMap, h).then(function() {
d.history.back();
}, function(b) {
c.disableInputs = !1, c.alerts["create-config-map"] = {
type:"error",
message:"An error occurred updating the config map.",
details:a("getErrorDetails")(b)
};
}));
}, c.$on("$destroy", function() {
e.unwatchAll(i);
});
}));
} ]), angular.module("openshiftConsole").controller("EditDeploymentConfigController", [ "$scope", "$filter", "$location", "$routeParams", "$uibModal", "AlertMessageService", "AuthorizationService", "BreadcrumbsService", "DataService", "Navigate", "ProjectsService", "SecretsService", "keyValueEditorUtils", function(a, b, c, d, e, f, g, h, i, j, k, l, m) {
a.projectName = d.project, a.deploymentConfig = null, a.alerts = {}, a.view = {
advancedStrategyOptions:!1,
advancedImageOptions:!1
}, a.triggers = {}, a.breadcrumbs = h.getBreadcrumbs({
name:d.name,
kind:d.kind,
namespace:d.project,
subpage:"Edit Deployment Config",
includeProject:!0
}), a.deploymentConfigStrategyTypes = [ "Recreate", "Rolling", "Custom" ], f.getAlerts().forEach(function(b) {
a.alerts[b.name] = b.data;
}), f.clearAlerts();
var n = [], o = function(a) {
switch (a) {
case "Recreate":
return "recreateParams";

case "Rolling":
return "rollingParams";

case "Custom":
return "customParams";

default:
return void Logger.error("Unknown deployment strategy type: " + a);
}
};
k.get(d.project).then(_.spread(function(c, e) {
return a.project = c, a.context = e, g.canI("deploymentconfigs", "update", d.project) ? void i.get("deploymentconfigs", d.deploymentconfig, e).then(function(f) {
a.deploymentConfig = f, a.breadcrumbs = h.getBreadcrumbs({
object:f,
project:c,
subpage:"Edit",
includeProject:!0
});
var g = function(c, d) {
var e = {}, f = _.filter(d, {
type:"ImageChange"
});
return _.each(c, function(c) {
var d = _.find(f, function(a) {
return _.includes(a.imageChangeParams.containerNames, c.name);
}), g = {};
if (c.env = c.env || [], _.each(c.env, function(a) {
b("altTextForValueFrom")(a);
}), e[c.name] = {
env:c.env,
image:c.image,
hasDeploymentTrigger:!_.isEmpty(d)
}, d) {
var h = d.imageChangeParams.from, i = h.name.split(":");
g = {
data:d,
istag:{
namespace:h.namespace || a.projectName,
imageStream:i[0],
tagObject:{
tag:i[1]
}
},
automatic:_.get(d, "imageChangeParams.automatic", !1)
};
} else g = {
istag:{
namespace:"",
imageStream:""
},
automatic:!0
};
_.set(e, [ c.name, "triggerData" ], g);
}), e;
};
a.updatedDeploymentConfig = angular.copy(a.deploymentConfig), a.containerNames = _.map(a.deploymentConfig.spec.template.spec.containers, "name"), a.containerConfigByName = g(a.updatedDeploymentConfig.spec.template.spec.containers, a.updatedDeploymentConfig.spec.triggers), a.secrets = {
pullSecrets:angular.copy(a.deploymentConfig.spec.template.spec.imagePullSecrets) || [ {
name:""
} ]
}, a.volumeNames = _.map(a.deploymentConfig.spec.template.spec.volumes, "name"), a.strategyData = angular.copy(a.deploymentConfig.spec.strategy), a.originalStrategy = a.strategyData.type, a.strategyParamsPropertyName = o(a.strategyData.type), a.triggers.hasConfigTrigger = _.some(a.updatedDeploymentConfig.spec.triggers, {
type:"ConfigChange"
}), "Custom" !== a.strategyData.type || _.has(a.strategyData, "customParams.environment") || (a.strategyData.customParams.environment = []), i.list("secrets", e, function(b) {
var c = l.groupSecretsByType(b), d = _.mapValues(c, function(a) {
return _.map(a, "metadata.name");
});
a.secretsByType = _.each(d, function(a) {
a.unshift("");
});
}), n.push(i.watchObject("deploymentconfigs", d.deploymentconfig, e, function(b, c) {
"MODIFIED" === c && (a.alerts["updated/deleted"] = {
type:"warning",
message:"This deployment configuration has changed since you started editing it. You'll need to copy any changes you've made and edit again."
}), "DELETED" === c && (a.alerts["updated/deleted"] = {
type:"warning",
message:"This deployment configuration has been deleted."
}, a.disableInputs = !0), a.deploymentConfig = b;
})), a.loaded = !0;
}, function(c) {
a.loaded = !0, a.alerts.load = {
type:"error",
message:"The deployment configuration details could not be loaded.",
details:b("getErrorDetails")(c)
};
}) :void j.toErrorPage("You do not have authority to update deployment config " + d.deploymentconfig + ".", "access_denied");
}));
var p = function() {
return "Custom" !== a.strategyData.type && "Custom" !== a.originalStrategy && a.strategyData.type !== a.originalStrategy;
}, q = function(b) {
if (!_.has(a.strategyData, b)) {
var c = e.open({
animation:!0,
templateUrl:"views/modals/confirm.html",
controller:"ConfirmModalController",
resolve:{
modalConfig:function() {
return {
alerts:a.alerts,
message:"Some of your existing " + a.originalStrategy.toLowerCase() + " strategy parameters can be used for the " + a.strategyData.type.toLowerCase() + " strategy. Keep parameters?",
details:"The timeout parameter and any pre or post lifecycle hooks will be copied from " + a.originalStrategy.toLowerCase() + " strategy to " + a.strategyData.type.toLowerCase() + " strategy. After saving the changes, " + a.originalStrategy.toLowerCase() + " strategy parameters will be removed.",
okButtonText:"Yes",
okButtonClass:"btn-primary",
cancelButtonText:"No"
};
}
}
});
c.result.then(function() {
a.strategyData[b] = angular.copy(a.strategyData[o(a.originalStrategy)]);
}, function() {
a.strategyData[b] = {};
});
}
};
a.strategyChanged = function() {
var b = o(a.strategyData.type);
p() ? q(b) :_.has(a.strategyData, b) || ("Custom" !== a.strategyData.type ? a.strategyData[b] = {} :a.strategyData[b] = {
image:"",
command:[],
environment:[]
}), a.strategyParamsPropertyName = b;
};
var r = function(a, b, c, d) {
var e = {
kind:"ImageStreamTag",
namespace:b.namespace,
name:b.imageStream + ":" + b.tagObject.tag
};
return c ? (c.imageChangeParams.from = e, c.imageChangeParams.automatic = d) :c = {
type:"ImageChange",
imageChangeParams:{
automatic:d,
containerNames:[ a ],
from:e
}
}, c;
}, s = function() {
var b = _.reject(a.updatedDeploymentConfig.spec.triggers, function(a) {
return "ImageChange" === a.type || "ConfigChange" === a.type;
});
return _.each(a.containerConfigByName, function(c, d) {
if (c.hasDeploymentTrigger) b.push(r(d, c.triggerData.istag, c.triggerData.data, c.triggerData.automatic)); else {
var e = _.find(a.updatedDeploymentConfig.spec.template.spec.containers, {
name:d
});
e.image = c.image;
}
}), a.triggers.hasConfigTrigger && b.push({
type:"ConfigChange"
}), b;
};
a.save = function() {
a.disableInputs = !0, _.each(a.containerConfigByName, function(b, c) {
var d = _.find(a.updatedDeploymentConfig.spec.template.spec.containers, {
name:c
});
d.env = m.compactEntries(b.env);
}), p() && delete a.strategyData[o(a.originalStrategy)], "Custom" !== a.strategyData.type && _.each([ "pre", "mid", "post" ], function(b) {
_.has(a.strategyData, [ a.strategyParamsPropertyName, b, "execNewPod", "env" ]) && (a.strategyData[a.strategyParamsPropertyName][b].execNewPod.env = m.compactEntries(a.strategyData[a.strategyParamsPropertyName][b].execNewPod.env));
}), _.has(a, "strategyData.customParams.environment") && (a.strategyData.customParams.environment = m.compactEntries(a.strategyData.customParams.environment)), a.updatedDeploymentConfig.spec.template.spec.imagePullSecrets = _.filter(a.secrets.pullSecrets, "name"), a.updatedDeploymentConfig.spec.strategy = a.strategyData, a.updatedDeploymentConfig.spec.triggers = s(), i.update("deploymentconfigs", a.updatedDeploymentConfig.metadata.name, a.updatedDeploymentConfig, a.context).then(function() {
f.addAlert({
name:a.updatedDeploymentConfig.metadata.name,
data:{
type:"success",
message:"Deployment config " + a.updatedDeploymentConfig.metadata.name + " was successfully updated."
}
});
var b = j.resourceURL(a.updatedDeploymentConfig);
c.url(b);
}, function(c) {
a.disableInputs = !1, a.alerts.save = {
type:"error",
message:"An error occurred updating deployment config " + a.updatedDeploymentConfig.metadata.name + ".",
details:b("getErrorDetails")(c)
};
});
}, a.$on("$destroy", function() {
i.unwatchAll(n);
});
} ]), angular.module("openshiftConsole").controller("EditAutoscalerController", [ "$scope", "$filter", "$routeParams", "$window", "APIService", "AuthorizationService", "BreadcrumbsService", "DataService", "HPAService", "MetricsService", "Navigate", "ProjectsService", "keyValueEditorUtils", function(a, b, c, d, e, f, g, h, i, j, k, l, m) {
if (!c.kind || !c.name) return void k.toErrorPage("Kind or name parameter missing.");
var n = [ "Deployment", "DeploymentConfig", "HorizontalPodAutoscaler", "ReplicaSet", "ReplicationController" ];
if (!_.includes(n, c.kind)) return void k.toErrorPage("Autoscaling not supported for kind " + c.kind + ".");
a.kind = c.kind, a.name = c.name, "HorizontalPodAutoscaler" === c.kind ? a.disableInputs = !0 :(a.targetKind = c.kind, a.targetName = c.name), a.autoscaling = {
name:a.name
}, a.labels = [], j.isAvailable().then(function(b) {
a.metricsWarning = !b;
}), a.alerts = {};
var o = b("getErrorDetails"), p = function(b, c) {
a.alerts.autoscaling = {
type:"error",
message:b,
details:o(c)
};
};
l.get(c.project).then(_.spread(function(b, j) {
a.project = b;
var l = "HorizontalPodAutoscaler" === c.kind ? "update" :"create";
if (!f.canI({
resource:"horizontalpodautoscalers",
group:"extensions"
}, l, c.project)) return void k.toErrorPage("You do not have authority to " + l + " horizontal pod autoscalers in project " + c.project + ".", "access_denied");
var n = function() {
a.disableInputs = !0;
var b = {
apiVersion:"extensions/v1beta1",
kind:"HorizontalPodAutoscaler",
metadata:{
name:a.autoscaling.name,
labels:m.mapEntries(m.compactEntries(a.labels))
},
spec:{
scaleRef:{
kind:c.kind,
name:c.name,
apiVersion:"extensions/v1beta1",
subresource:"scale"
},
minReplicas:a.autoscaling.minReplicas,
maxReplicas:a.autoscaling.maxReplicas,
cpuUtilization:{
targetPercentage:a.autoscaling.targetCPU || a.autoscaling.defaultTargetCPU
}
}
};
h.create({
resource:"horizontalpodautoscalers",
group:"extensions"
}, null, b, j).then(function() {
d.history.back();
}, function(b) {
a.disableInputs = !1, p("An error occurred creating the horizontal pod autoscaler.", b);
});
}, o = function(b) {
a.disableInputs = !0, b = angular.copy(b), b.metadata.labels = m.mapEntries(m.compactEntries(a.labels)), b.spec.minReplicas = a.autoscaling.minReplicas, b.spec.maxReplicas = a.autoscaling.maxReplicas, b.spec.cpuUtilization = {
targetPercentage:a.autoscaling.targetCPU || a.autoscaling.defaultTargetCPU
}, h.update({
resource:"horizontalpodautoscalers",
group:"extensions"
}, b.metadata.name, b, j).then(function() {
d.history.back();
}, function(c) {
a.disableInputs = !1, p('An error occurred updating horizontal pod autoscaler "' + b.metadata.name + '".', c);
});
}, q = {
resource:e.kindToResource(c.kind),
group:c.group
};
h.get(q, c.name, j).then(function(d) {
if (a.labels = _.map(_.get(d, "metadata.labels", {}), function(a, b) {
return {
name:b,
value:a
};
}), "HorizontalPodAutoscaler" === c.kind) a.targetKind = _.get(d, "spec.scaleRef.kind"), a.targetName = _.get(d, "spec.scaleRef.name"), _.assign(a.autoscaling, {
minReplicas:_.get(d, "spec.minReplicas"),
maxReplicas:_.get(d, "spec.maxReplicas"),
targetCPU:_.get(d, "spec.cpuUtilization.targetPercentage")
}), a.disableInputs = !1, a.save = function() {
o(d);
}, a.breadcrumbs = g.getBreadcrumbs({
name:a.targetName,
kind:a.targetKind,
namespace:c.project,
project:b,
subpage:"Autoscale",
includeProject:!0
}); else {
a.breadcrumbs = g.getBreadcrumbs({
object:d,
project:b,
subpage:"Autoscale",
includeProject:!0
}), a.save = n;
var e = {}, f = function() {
var c = _.get(d, "spec.template.spec.containers", []);
a.showCPURequestWarning = !i.hasCPURequest(c, e, b);
};
h.list("limitranges", j, function(a) {
e = a.by("metadata.name"), f();
});
}
});
}));
} ]), angular.module("openshiftConsole").controller("EditHealthChecksController", [ "$filter", "$location", "$routeParams", "$scope", "AlertMessageService", "AuthorizationService", "BreadcrumbsService", "APIService", "DataService", "Navigate", "ProjectsService", function(a, b, c, d, e, f, g, h, i, j, k) {
if (!c.kind || !c.name) return void j.toErrorPage("Kind or name parameter missing.");
var l = [ "Deployment", "DeploymentConfig", "ReplicaSet", "ReplicationController" ];
if (!_.includes(l, c.kind)) return void j.toErrorPage("Health checks are not supported for kind " + c.kind + ".");
d.name = c.name, d.resourceURL = j.resourceURL(d.name, c.kind, c.project), d.alerts = {}, d.renderOptions = {
hideFilterWidget:!0
}, d.breadcrumbs = g.getBreadcrumbs({
name:c.name,
kind:c.kind,
namespace:c.project,
subpage:"Edit Health Checks",
includeProject:!0
}), d.previousProbes = {};
var m = a("getErrorDetails"), n = function(a, b) {
d.alerts["add-health-check"] = {
type:"error",
message:a,
details:b
};
};
k.get(c.project).then(_.spread(function(k, l) {
var o = a("humanizeKind")(c.kind) + ' "' + d.name + '"', p = {
resource:h.kindToResource(c.kind),
group:c.group
};
return f.canI(p, "update", c.project) ? void i.get(p, d.name, l).then(function(a) {
var f = d.object = angular.copy(a);
d.breadcrumbs = g.getBreadcrumbs({
object:f,
project:k,
subpage:"Edit Health Checks",
includeProject:!0
}), d.containers = _.get(f, "spec.template.spec.containers"), d.addProbe = function(a, b) {
a[b] = _.get(d.previousProbes, [ a.name, b ], {}), d.form.$setDirty();
}, d.removeProbe = function(a, b) {
_.set(d.previousProbes, [ a.name, b ], a[b]), delete a[b], d.form.$setDirty();
}, d.save = function() {
d.disableInputs = !0, i.update(h.kindToResource(c.kind), d.name, f, l).then(function() {
e.addAlert({
name:d.name,
data:{
type:"success",
message:o + " was updated."
}
}), b.url(d.resourceURL);
}, function(a) {
d.disableInputs = !1, n(o + " could not be updated.", m(a));
});
};
}, function(a) {
n(o + " could not be loaded.", m(a));
}) :void j.toErrorPage("You do not have authority to update " + o + ".", "access_denied");
}));
} ]), angular.module("openshiftConsole").controller("EditRouteController", [ "$filter", "$location", "$routeParams", "$scope", "AlertMessageService", "AuthorizationService", "DataService", "Navigate", "ProjectsService", "RoutesService", function(a, b, c, d, e, f, g, h, i, j) {
d.alerts = {}, d.renderOptions = {
hideFilterWidget:!0
}, d.projectName = c.project, d.routeName = c.route, d.loading = !0, d.routeURL = h.resourceURL(d.routeName, "Route", d.projectName), d.breadcrumbs = [ {
title:d.projectName,
link:"project/" + d.projectName
}, {
title:"Routes",
link:"project/" + d.projectName + "/browse/routes"
}, {
title:d.routeName,
link:d.routeURL
}, {
title:"Edit"
} ], i.get(c.project).then(_.spread(function(i, k) {
if (d.project = i, d.breadcrumbs[0].title = a("displayName")(i), !f.canI("routes", "update", c.project)) return void h.toErrorPage("You do not have authority to update route " + c.routeName + ".", "access_denied");
var l, m = a("orderByDisplayName");
g.get("routes", d.routeName, k).then(function(a) {
l = angular.copy(a);
var b = _.get(l, "spec.host"), c = "Subdomain" === _.get(l, "spec.wildcardPolicy");
c && (b = "*." + j.getSubdomain(l)), d.routing = {
service:_.get(l, "spec.to.name"),
host:b,
wildcardPolicy:_.get(l, "spec.wildcardPolicy"),
path:_.get(l, "spec.path"),
targetPort:_.get(l, "spec.port.targetPort"),
tls:angular.copy(_.get(l, "spec.tls"))
}, g.list("services", k, function(a) {
var b = a.by("metadata.name"), c = _.get(l, "spec.to", {});
d.loading = !1, d.services = m(b), d.routing.to = {
service:b[c.name],
weight:c.weight
}, d.routing.alternateServices = [], _.each(_.get(l, "spec.alternateBackends"), function(a) {
return "Service" !== a.kind ? (h.toErrorPage('Editing routes with non-service targets is unsupported. You can edit the route with the "Edit YAML" action instead.'), !1) :void d.routing.alternateServices.push({
service:b[a.name],
weight:a.weight
});
});
});
}, function() {
h.toErrorPage("Could not load route " + d.routeName + ".");
});
var n = function() {
var a = angular.copy(l), b = _.get(d, "routing.to.service.metadata.name");
_.set(a, "spec.to.name", b);
var c = _.get(d, "routing.to.weight");
isNaN(c) || _.set(a, "spec.to.weight", c), a.spec.path = d.routing.path;
var e = d.routing.targetPort;
e ? _.set(a, "spec.port.targetPort", e) :delete a.spec.port, _.get(d, "routing.tls.termination") ? (a.spec.tls = d.routing.tls, "passthrough" === a.spec.tls.termination && (delete a.spec.path, delete a.spec.tls.certificate, delete a.spec.tls.key, delete a.spec.tls.caCertificate), "reencrypt" !== a.spec.tls.termination && delete a.spec.tls.destinationCACertificate) :delete a.spec.tls;
var f = _.get(d, "routing.alternateServices", []);
return _.isEmpty(f) ? delete a.spec.alternateBackends :a.spec.alternateBackends = _.map(f, function(a) {
return {
kind:"Service",
name:_.get(a, "service.metadata.name"),
weight:a.weight
};
}), a;
};
d.updateRoute = function() {
if (d.form.$valid) {
d.disableInputs = !0;
var c = n();
g.update("routes", d.routeName, c, k).then(function() {
e.addAlert({
name:d.routeName,
data:{
type:"success",
message:"Route " + d.routeName + " was successfully updated."
}
}), b.path(d.routeURL);
}, function(b) {
d.disableInputs = !1, d.alerts["update-route"] = {
type:"error",
message:"An error occurred updating route " + d.routeName + ".",
details:a("getErrorDetails")(b)
};
});
}
};
}));
} ]), angular.module("openshiftConsole").controller("EditYAMLController", [ "$scope", "$filter", "$location", "$routeParams", "$window", "AlertMessageService", "APIService", "AuthorizationService", "BreadcrumbsService", "DataService", "Navigate", "ProjectsService", function(a, b, c, d, e, f, g, h, i, j, k, l) {
if (!d.kind || !d.name) return void k.toErrorPage("Kind or name parameter missing.");
var m = b("humanizeKind");
a.alerts = {}, a.name = d.name, a.resourceURL = k.resourceURL(a.name, d.kind, d.project), a.breadcrumbs = [ {
title:d.project,
link:"project/" + d.project
}, {
title:d.name,
link:d.returnURL
}, {
title:"Edit YAML"
} ];
var n = function() {
return d.returnURL ? void c.url(d.returnURL) :void e.history.back();
}, o = _.throttle(function() {
a.$eval(function() {
a.modified = !0;
});
}, 1e3);
a.aceLoaded = function(a) {
var b = a.getSession();
b.setOption("tabSize", 2), b.setOption("useSoftTabs", !0), b.on("change", o);
};
var p = [];
l.get(d.project).then(_.spread(function(c, e) {
var i = {
resource:g.kindToResource(d.kind),
group:d.group
};
return h.canI(i, "update", d.project) ? (j.get(i, a.name, e).then(function(c) {
var h = angular.copy(c);
a.resource = h;
var k = function(a) {
return _.get(a, "metadata.resourceVersion");
};
h = angular.extend({
apiVersion:h.apiVersion,
kind:h.kind
}, h), _.set(a, "editor.model", jsyaml.safeDump(h)), a.save = function() {
a.modified = !1;
var c;
try {
c = jsyaml.safeLoad(a.editor.model);
} catch (e) {
return void (a.error = e);
}
if (c.kind !== h.kind) return void (a.error = {
message:"Cannot change resource kind (original: " + h.kind + ", modified: " + (c.kind || "<unspecified>") + ")."
});
var i = g.objectToResourceGroupVersion(h), k = g.objectToResourceGroupVersion(c);
return k ? k.group !== i.group ? void (a.error = {
message:"Cannot change resource group (original: " + (i.group || "<none>") + ", modified: " + (k.group || "<none>") + ")."
}) :g.apiInfo(k) ? (a.updatingNow = !0, void j.update(k, a.resource.metadata.name, c, {
namespace:a.resource.metadata.namespace
}).then(function(b) {
var e = _.get(c, "metadata.resourceVersion"), g = _.get(b, "metadata.resourceVersion");
return g === e ? (a.alerts["no-changes-applied"] = {
type:"warning",
message:"No changes were applied to " + m(d.kind) + " " + d.name + ".",
details:"Make sure any new fields you may have added are supported API fields."
}, void (a.updatingNow = !1)) :(f.addAlert({
name:"edit-yaml",
data:{
type:"success",
message:m(d.kind, !0) + " " + d.name + " was successfully updated."
}
}), void n());
}, function(c) {
a.updatingNow = !1, a.error = {
message:b("getErrorDetails")(c)
};
})) :void (a.error = {
message:g.unsupportedObjectKindOrVersion(c)
}) :void (a.error = {
message:g.invalidObjectKindOrVersion(c)
});
}, a.cancel = function() {
n();
}, p.push(j.watchObject(i, a.name, e, function(b, c) {
a.resourceChanged = k(b) !== k(h), a.resourceDeleted = "DELETED" === c;
}, {
errorNotification:!1
}));
}, function(a) {
k.toErrorPage("Could not load " + m(d.kind) + " '" + d.name + "'. " + b("getErrorDetails")(a, !0));
}), void a.$on("$destroy", function() {
j.unwatchAll(p);
})) :void k.toErrorPage("You do not have authority to update " + m(d.kind) + " " + d.name + ".", "access_denied");
}));
} ]), angular.module("openshiftConsole").controller("BrowseCategoryController", [ "$scope", "$filter", "$location", "$q", "$routeParams", "$uibModal", "AlertMessageService", "Constants", "DataService", "LabelFilter", "Navigate", "ProjectsService", function(a, b, c, d, e, f, g, h, i, j, k, l) {
a.projectName = e.project;
var m = function(b, c) {
var d;
return _.some(b, function(b) {
if (d = _.find(b.items, {
id:c
})) {
a.category = d;
var e = _.get(d, "subcategories", []);
return a.subcategories = [ {
id:"",
label:""
} ].concat(e), !0;
}
return !1;
}), d;
}, n = h.CATALOG_CATEGORIES, o = "none" === e.category ? "" :e.category;
if (a.category = m(n, o), !a.category) return void k.toErrorPage("Catalog category " + e.category + " not found.");
var p, q;
return e.subcategory && (p = a.category, o = "none" === e.subcategory ? "" :e.subcategory, q = _.get(a.category, "subcategories", []), a.category = m(q, o), !a.category) ? void k.toErrorPage("Catalog category " + e.category + "/" + e.subcategory + " not found.") :(a.alerts = a.alerts || {}, g.getAlerts().forEach(function(b) {
a.alerts[b.name] = b.data;
}), g.clearAlerts(), a.breadcrumbs = [ {
title:a.projectName,
link:"project/" + a.projectName
}, {
title:"Add to Project",
link:"project/" + a.projectName + "/create"
}, {
title:"Catalog",
link:"project/" + a.projectName + "/create?tab=fromCatalog"
} ], p && a.breadcrumbs.push({
title:p.label,
link:"project/" + a.projectName + "/create/category/" + p.id
}), a.breadcrumbs.push({
title:a.category.label
}), void l.get(e.project).then(_.spread(function(c, d) {
a.project = c, a.context = d, a.breadcrumbs[0].title = b("displayName")(c), i.list("imagestreams", {
namespace:"openshift"
}, function(b) {
a.openshiftImageStreams = b.by("metadata.name");
}), i.list("templates", {
namespace:"openshift"
}, function(b) {
a.openshiftTemplates = b.by("metadata.name");
}), "openshift" === e.project ? (a.projectImageStreams = [], a.projectTemplates = []) :(i.list("imagestreams", d, function(b) {
a.projectImageStreams = b.by("metadata.name");
}), i.list("templates", d, function(b) {
a.projectTemplates = b.by("metadata.name");
}));
})));
} ]), angular.module("openshiftConsole").controller("CreateFromImageController", [ "$scope", "Logger", "$q", "$routeParams", "APIService", "DataService", "ProjectsService", "Navigate", "ApplicationGenerator", "LimitRangesService", "MetricsService", "HPAService", "QuotaService", "SecretsService", "ImagesService", "TaskList", "failureObjectNameFilter", "$filter", "$parse", "$uibModal", "SOURCE_URL_PATTERN", "keyValueEditorUtils", function(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v) {
var w = r("displayName"), x = r("humanize");
a.projectName = d.project, a.sourceURLPattern = u;
var y = d.imageStream;
if (!y) return void h.toErrorPage("Cannot create from source: a base image was not specified");
if (!d.imageTag) return void h.toErrorPage("Cannot create from source: a base image tag was not specified");
var z = d.displayName || y;
a.displayName = d.displayName, a.breadcrumbs = [ {
title:a.projectName,
link:"project/" + a.projectName
}, {
title:"Add to Project",
link:"project/" + a.projectName + "/create"
}, {
title:"Catalog",
link:"project/" + a.projectName + "/create?tab=fromCatalog"
}, {
title:z
} ], a.alerts = {}, a.quotaAlerts = {};
var A = {
name:"app",
value:""
};
g.get(d.project).then(_.spread(function(e, g) {
function q(b) {
b.emptyMessage = "Loading...", b.name = d.name, b.imageName = y, b.imageTag = d.imageTag, b.namespace = d.namespace, b.buildConfig = {
buildOnSourceChange:!0,
buildOnImageChange:!0,
buildOnConfigChange:!0,
secrets:{
gitSecret:[ {
name:""
} ]
},
sourceUrl:d.sourceURI,
gitRef:d.sourceRef,
contextDir:d.contextDir
}, b.buildConfigEnvVars = [], b.deploymentConfig = {
deployOnNewImage:!0,
deployOnConfigChange:!0
}, b.DCEnvVarsFromImage, b.DCEnvVarsFromUser = [], b.routing = {
include:!0,
portOptions:[]
}, b.userDefinedLabels = [], b.systemLabels = [ A ], b.annotations = {}, b.scaling = {
replicas:1,
autoscale:!1,
autoscaleOptions:[ {
label:"Manual",
value:!1
}, {
label:"Automatic",
value:!0
} ]
}, b.container = {
resources:{}
}, b.cpuRequestCalculated = j.isRequestCalculated("cpu", e), b.cpuLimitCalculated = j.isLimitCalculated("cpu", e), b.memoryRequestCalculated = j.isRequestCalculated("memory", e), b.fillSampleRepo = function() {
var a;
(b.image || b.image.metadata || b.image.metadata.annotations) && (a = b.image.metadata.annotations, b.buildConfig.sourceUrl = a.sampleRepo || "", b.buildConfig.gitRef = a.sampleRef || "", b.buildConfig.contextDir = a.sampleContextDir || "", (a.sampleRef || a.sampleContextDir) && (b.advancedSourceOptions = !0));
}, b.usingSampleRepo = function() {
return b.buildConfig.sourceUrl === _.get(b, "image.metadata.annotations.sampleRepo");
}, k.isAvailable().then(function(b) {
a.metricsWarning = !b;
}), f.list("secrets", g, function(b) {
var c = n.groupSecretsByType(b), d = _.mapValues(c, function(a) {
return _.map(a, "metadata.name");
});
a.secretsByType = _.each(d, function(a) {
a.unshift("");
});
}), f.get("imagestreams", b.imageName, {
namespace:b.namespace || d.project
}).then(function(a) {
b.imageStream = a;
var c = b.imageTag;
f.get("imagestreamtags", a.metadata.name + ":" + c, {
namespace:b.namespace
}).then(function(a) {
b.image = a.image, b.DCEnvVarsFromImage = o.getEnvironment(a);
var c = i.parsePorts(a.image);
0 === c.length ? (b.routing.include = !1, b.routing.portOptions = []) :(b.routing.portOptions = _.map(c, function(a) {
var b = i.getServicePort(a);
return {
port:b.name,
label:b.targetPort + "/" + b.protocol
};
}), b.routing.targetPort = b.routing.portOptions[0].port);
}, function() {
h.toErrorPage("Cannot create from source: the specified image could not be retrieved.");
});
}, function() {
h.toErrorPage("Cannot create from source: the specified image could not be retrieved.");
});
}
a.project = e, a.breadcrumbs[0].title = r("displayName")(e), d.sourceURI && (a.sourceURIinParams = !0);
var s = function() {
a.hideCPU || (a.cpuProblems = j.validatePodLimits(a.limitRanges, "cpu", [ a.container ], e)), a.memoryProblems = j.validatePodLimits(a.limitRanges, "memory", [ a.container ], e);
};
f.list("limitranges", g, function(b) {
a.limitRanges = b.by("metadata.name"), 0 !== r("hashSize")(b) && a.$watch("container", s, !0);
});
var u, B, C = function() {
return a.scaling.autoscale ? void (a.showCPURequestWarning = !l.hasCPURequest([ a.container ], a.limitRanges, e)) :void (a.showCPURequestWarning = !1);
};
f.list("resourcequotas", g, function(a) {
u = a.by("metadata.name"), b.log("quotas", u);
}), f.list("appliedclusterresourcequotas", g, function(a) {
B = a.by("metadata.name"), b.log("cluster quotas", B);
}), a.$watch("scaling.autoscale", C), a.$watch("container", C, !0), a.$watch("name", function(a) {
A.value = a;
}), q(a);
var D, E = function() {
var b = {
started:"Creating application " + a.name + " in project " + a.projectDisplayName(),
success:"Created application " + a.name + " in project " + a.projectDisplayName(),
failure:"Failed to create " + a.name + " in project " + a.projectDisplayName()
}, e = {};
p.clear(), p.add(b, e, d.project, function() {
var b = c.defer();
return f.batch(D, g).then(function(c) {
var d = [], e = !1;
c.failure.length > 0 ? (e = !0, c.failure.forEach(function(a) {
d.push({
type:"error",
message:"Cannot create " + x(a.object.kind).toLowerCase() + ' "' + a.object.metadata.name + '". ',
details:a.data.message
});
}), c.success.forEach(function(a) {
d.push({
type:"success",
message:"Created " + x(a.kind).toLowerCase() + ' "' + a.metadata.name + '" successfully. '
});
})) :d.push({
type:"success",
message:"All resources for application " + a.name + " were created successfully."
}), b.resolve({
alerts:d,
hasErrors:e
});
}), b.promise;
}, function(b) {
a.alerts.create = {
type:"error",
message:"An error occurred creating the application.",
details:"Status: " + b.status + ". " + b.data
};
}), h.toNextSteps(a.name, a.projectName, {
usingSampleRepo:a.usingSampleRepo(),
breadcrumbTitle:z
});
}, F = function(a) {
var b = t.open({
animation:!0,
templateUrl:"views/modals/confirm.html",
controller:"ConfirmModalController",
resolve:{
modalConfig:function() {
return {
alerts:a,
message:"Problems were detected while checking your application configuration.",
okButtonText:"Create Anyway",
okButtonClass:"btn-danger",
cancelButtonText:"Cancel"
};
}
}
});
b.result.then(E);
}, G = function(b) {
var c = b.quotaAlerts || [], d = _.filter(c, {
type:"error"
});
a.nameTaken || d.length ? (a.disableInputs = !1, a.quotaAlerts = c) :c.length ? (F(c), a.disableInputs = !1) :E();
};
a.projectDisplayName = function() {
return w(this.project) || this.projectName;
}, a.createApp = function() {
a.disableInputs = !0, a.alerts = {}, a.buildConfig.envVars = v.mapEntries(v.compactEntries(a.buildConfigEnvVars)), a.deploymentConfig.envVars = v.mapEntries(v.compactEntries(a.DCEnvVarsFromUser));
var c = v.mapEntries(v.compactEntries(a.userDefinedLabels)), d = v.mapEntries(v.compactEntries(a.systemLabels));
a.labels = _.extend(d, c);
var e = i.generate(a);
D = [], angular.forEach(e, function(a) {
null !== a && (b.debug("Generated resource definition:", a), D.push(a));
});
var f = i.ifResourcesDontExist(D, a.projectName), h = m.getLatestQuotaAlerts(D, g), j = function(b) {
return a.nameTaken = b.nameTaken, h;
};
f.then(j, j).then(G, G);
};
}));
} ]), angular.module("openshiftConsole").controller("NextStepsController", [ "$scope", "$http", "$routeParams", "DataService", "$q", "$location", "ProcessedTemplateService", "TaskList", "$parse", "Navigate", "Logger", "$filter", "imageObjectRefFilter", "failureObjectNameFilter", "ProjectsService", function(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o) {
var p = (l("displayName"), []);
a.emptyMessage = "Loading...", a.alerts = [], a.loginBaseUrl = d.openshiftAPIBaseUrl(), a.buildConfigs = {}, a.showParamsTable = !1, a.projectName = c.project, a.fromSampleRepo = c.fromSample, a.breadcrumbs = [ {
title:a.projectName,
link:"project/" + a.projectName
}, {
title:"Add to Project",
link:"project/" + a.projectName + "/create"
}, {
title:c.breadcrumbTitle || c.name
}, {
title:"Next Steps"
} ];
var q = g.getTemplateData();
a.parameters = q.params, _.each(a.parameters, function(a) {
l("altTextForValueFrom")(a);
}), a.templateMessage = q.message, g.clearTemplateData(), o.get(c.project).then(_.spread(function(b, e) {
function f(a) {
var b = [];
return angular.forEach(a, function(a) {
a.hasErrors && b.push(a);
}), b;
}
function g(a) {
var b = [];
return angular.forEach(a, function(a) {
"completed" !== a.status && b.push(a);
}), b;
}
a.project = b, a.breadcrumbs[0].title = l("displayName")(b), p.push(d.watch("buildconfigs", e, function(b) {
a.buildConfigs = b.by("metadata.name"), a.createdBuildConfig = a.buildConfigs[c.name], k.log("buildconfigs (subscribe)", a.buildConfigs);
}));
var h = function(b) {
var c = _.get(a, "createdBuildConfig.spec.triggers", []);
return _.some(c, {
type:b
});
};
a.createdBuildConfigWithGitHubTrigger = function() {
return h("GitHub");
}, a.createdBuildConfigWithConfigChangeTrigger = function() {
return h("ConfigChange");
}, a.allTasksSuccessful = function(a) {
return !g(a).length && !f(a).length;
}, a.toggleParamsTable = function() {
a.showParamsTable = !0;
}, a.erroredTasks = f, a.pendingTasks = g, a.$on("$destroy", function() {
d.unwatchAll(p);
});
}));
} ]), angular.module("openshiftConsole").controller("NewFromTemplateController", [ "$scope", "$http", "$routeParams", "DataService", "ProcessedTemplateService", "AlertMessageService", "ProjectsService", "QuotaService", "$q", "$location", "TaskList", "$parse", "Navigate", "$filter", "$uibModal", "imageObjectRefFilter", "failureObjectNameFilter", "CachedTemplateService", "keyValueEditorUtils", "Constants", function(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t) {
var u = c.template, v = c.namespace || "";
if (!u) return void m.toErrorPage("Cannot create from template: a template name was not specified.");
a.emptyMessage = "Loading...", a.alerts = {}, a.quotaAlerts = {}, a.projectName = c.project, a.projectPromise = $.Deferred(), a.labels = [], a.systemLabels = [], a.breadcrumbs = [ {
title:a.projectName,
link:"project/" + a.projectName
}, {
title:"Add to Project",
link:"project/" + a.projectName + "/create"
}, {
title:"Catalog",
link:"project/" + a.projectName + "/create?tab=fromCatalog"
}, {
title:u
} ], a.alerts = a.alerts || {}, f.getAlerts().forEach(function(b) {
a.alerts[b.name] = b.data;
}), f.clearAlerts();
var w = n("displayName"), x = n("humanize"), y = l("spec.template.spec.containers"), z = l("spec.strategy.sourceStrategy.from || spec.strategy.dockerStrategy.from || spec.strategy.customStrategy.from"), A = l("spec.output.to"), B = function() {
try {
return JSON.parse(c.templateParamsMap);
} catch (b) {
a.alerts.invalidTemplateParams = {
type:"error",
message:"The templateParamsMap is not valid JSON. " + b
};
}
};
g.get(c.project).then(_.spread(function(b, f) {
function g(a, b) {
var c = _.get(a, "spec.triggers", []), d = _.find(c, function(a) {
if ("ImageChange" !== a.type) return !1;
var c = _.get(a, "imageChangeParams.containerNames", []);
return _.includes(c, b.name);
});
return _.get(d, "imageChangeParams.from.name");
}
function l(a) {
for (var b = [], c = G.exec(a); c; ) b.push(c[1]), c = G.exec(a);
return b;
}
function q() {
var b = {};
return _.each(a.template.parameters, function(a) {
b[a.name] = a.value;
}), b;
}
function t() {
var b = q();
a.templateImages = _.map(H, function(a) {
if (_.isEmpty(a.usesParameters)) return a;
var c = _.template(a.name, {
interpolate:G
});
return {
name:c(b),
usesParameters:a.usesParameters
};
});
}
function C(a) {
var b = [], c = y(a);
return c && angular.forEach(c, function(c) {
var d = c.image, e = g(a, c);
e && (d = e), d && b.push(d);
}), b;
}
function D(b) {
H = [];
var c = [], d = {};
angular.forEach(b.objects, function(b) {
if ("BuildConfig" === b.kind) {
var e = p(z(b), a.projectName);
e && H.push({
name:e,
usesParameters:l(e)
});
var f = p(A(b), a.projectName);
f && (d[f] = !0);
}
"DeploymentConfig" === b.kind && (c = c.concat(C(b)));
}), c.forEach(function(a) {
d[a] || H.push({
name:a,
usesParameters:l(a)
});
}), H = _.uniq(H, !1, "name");
}
function E(a) {
var b = /^helplink\.(.*)\.title$/, c = /^helplink\.(.*)\.url$/, d = {};
for (var e in a.annotations) {
var f, g = e.match(b);
g ? (f = d[g[1]] || {}, f.title = a.annotations[e], d[g[1]] = f) :(g = e.match(c), g && (f = d[g[1]] || {}, f.url = a.annotations[e], d[g[1]] = f));
}
return d;
}
function F(b) {
if (a.parameterDisplayNames = {}, _.each(a.template.parameters, function(b) {
a.parameterDisplayNames[b.name] = b.displayName || b.name;
}), c.templateParamsMap) {
var d = B();
_.each(a.template.parameters, function(a) {
d[a.name] && (a.value = d[a.name]);
});
}
D(a.template);
var e = function(a) {
return !_.isEmpty(a.usesParameters);
};
_.some(H, e) ? a.$watch("template.parameters", _.debounce(function(b) {
a.$apply(t);
}, 50, {
maxWait:250
}), !0) :a.templateImages = H, a.systemLabels = _.map(a.template.labels, function(a, b) {
return {
name:b,
value:a
};
}), M() && a.systemLabels.push({
name:"app",
value:a.template.metadata.name
});
}
a.project = b, a.breadcrumbs[0].title = n("displayName")(b);
var G = /\${([a-zA-Z0-9\_]+)}/g, H = [];
a.projectDisplayName = function() {
return w(this.project) || this.projectName;
}, a.templateDisplayName = function() {
return w(this.template);
};
var I, J = function() {
var b = {
started:"Creating " + a.templateDisplayName() + " in project " + a.projectDisplayName(),
success:"Created " + a.templateDisplayName() + " in project " + a.projectDisplayName(),
failure:"Failed to create " + a.templateDisplayName() + " in project " + a.projectDisplayName()
}, e = E(a.template);
k.clear(), k.add(b, e, c.project, function() {
var b = i.defer();
return d.batch(I, f).then(function(c) {
var d = [], e = !1;
c.failure.length > 0 ? (e = !0, c.failure.forEach(function(a) {
d.push({
type:"error",
message:"Cannot create " + x(a.object.kind).toLowerCase() + ' "' + a.object.metadata.name + '". ',
details:a.data.message
});
}), c.success.forEach(function(a) {
d.push({
type:"success",
message:"Created " + x(a.kind).toLowerCase() + ' "' + a.metadata.name + '" successfully. '
});
})) :d.push({
type:"success",
message:"All items in template " + a.templateDisplayName() + " were created successfully."
}), b.resolve({
alerts:d,
hasErrors:e
});
}), b.promise;
}), m.toNextSteps(u, a.projectName);
}, K = function(a) {
var b = o.open({
animation:!0,
templateUrl:"views/modals/confirm.html",
controller:"ConfirmModalController",
resolve:{
modalConfig:function() {
return {
alerts:a,
message:"Problems were detected while checking your application configuration.",
okButtonText:"Create Anyway",
okButtonClass:"btn-danger",
cancelButtonText:"Cancel"
};
}
}
});
b.result.then(J);
}, L = function(b) {
var c = b.quotaAlerts || [], d = _.filter(c, {
type:"error"
});
d.length ? (a.disableInputs = !1, a.quotaAlerts = c) :c.length ? (K(c), a.disableInputs = !1) :J();
};
a.createFromTemplate = function() {
a.disableInputs = !0;
var b = s.mapEntries(s.compactEntries(a.labels)), c = s.mapEntries(s.compactEntries(a.systemLabels));
a.template.labels = _.extend(c, b), d.create("processedtemplates", null, a.template, f).then(function(b) {
e.setTemplateData(b.parameters, a.template.parameters, b.message), I = b.objects, h.getLatestQuotaAlerts(I, f).then(L);
}, function(b) {
a.disableInputs = !1;
var c;
b.data && b.data.message && (c = b.data.message), a.alerts.process = {
type:"error",
message:"An error occurred processing the template.",
details:c
};
});
};
var M = function() {
return !_.get(a.template, "labels.app") && !_.some(a.template.objects, "metadata.labels.app");
};
if (v) d.get("templates", u, {
namespace:v || a.projectName
}).then(function(b) {
a.template = b, F(), a.breadcrumbs[3].title = n("displayName")(b);
}, function() {
m.toErrorPage("Cannot create from template: the specified template could not be retrieved.");
}); else {
if (a.template = r.getTemplate(), _.isEmpty(a.template)) {
var N = URI("error").query({
error:"not_found",
error_description:"Template wasn't found in cache."
}).toString();
j.url(N);
}
r.clearTemplate(), F();
}
}));
} ]), angular.module("openshiftConsole").controller("LabelsController", [ "$scope", function(a) {
a.expanded = !0, a.toggleExpanded = function() {
a.expanded = !a.expanded;
}, a.addLabel = function() {
a.labelKey && a.labelValue && (a.labels[a.labelKey] = a.labelValue, a.labelKey = "", a.labelValue = "", a.form.$setPristine(), a.form.$setUntouched());
}, a.deleteLabel = function(b) {
a.labels[b] && delete a.labels[b];
};
} ]), angular.module("openshiftConsole").controller("TasksController", [ "$scope", "TaskList", function(a, b) {
a.tasks = function() {
return b.taskList();
}, a["delete"] = function(a) {
b.deleteTask(a);
}, a.hasTaskWithError = function() {
var a = b.taskList();
return _.some(a, {
hasErrors:!0
});
};
} ]), angular.module("openshiftConsole").controller("EventsController", [ "$routeParams", "$scope", "ProjectsService", function(a, b, c) {
b.projectName = a.project, b.renderOptions = {
hideFilterWidget:!0
}, b.breadcrumbs = [ {
title:"Monitoring",
link:"project/" + a.project + "/monitoring"
}, {
title:"Events"
} ], c.get(a.project).then(_.spread(function(a, c) {
b.project = a, b.projectContext = c;
}));
} ]), angular.module("openshiftConsole").controller("OAuthController", [ "$scope", "$location", "$q", "RedirectLoginService", "DataService", "AuthService", "Logger", function(a, b, c, d, e, f, g) {
var h = g.get("auth");
a.completeLogin = function() {}, a.cancelLogin = function() {
b.replace(), b.url("./");
}, d.finish().then(function(c) {
var d = c.token, g = c.then, i = c.verified, j = c.ttl, k = {
errorNotification:!1,
http:{
auth:{
token:d,
triggerLogin:!1
}
}
};
h.log("OAuthController, got token, fetching user", k), e.get("users", "~", {}, k).then(function(c) {
if (h.log("OAuthController, got user", c), a.completeLogin = function() {
f.setUser(c, d, j);
var a = g || "./";
URI(a).is("absolute") && (h.log("OAuthController, invalid absolute redirect", a), a = "./"), h.log("OAuthController, redirecting", a), b.replace(), b.url(a);
}, i) a.completeLogin(); else {
a.confirmUser = c;
var e = f.UserStore().getUser();
e && e.metadata.name !== c.metadata.name && (a.overriddenUser = e);
}
})["catch"](function(a) {
var c = URI("error").query({
error:"user_fetch_failed"
}).toString();
h.error("OAuthController, error fetching user", a, "redirecting", c), b.replace(), b.url(c);
});
})["catch"](function(a) {
var c = URI("error").query({
error:a.error || "",
error_description:a.error_description || "",
error_uri:a.error_uri || ""
}).toString();
h.error("OAuthController, error", a, "redirecting", c), b.replace(), b.url(c);
});
} ]), angular.module("openshiftConsole").controller("ErrorController", [ "$scope", "$window", function(a, b) {
var c = URI(window.location.href).query(!0), d = c.error;
switch (d) {
case "access_denied":
a.errorMessage = "Access denied";
break;

case "not_found":
a.errorMessage = "Not found";
break;

case "invalid_request":
a.errorMessage = "Invalid request";
break;

case "API_DISCOVERY":
a.errorLinks = [ {
href:window.location.protocol + "//" + window.OPENSHIFT_CONFIG.api.openshift.hostPort + window.OPENSHIFT_CONFIG.api.openshift.prefix,
label:"Check Server Connection",
target:"_blank"
} ];
break;

default:
a.errorMessage = "An error has occurred";
}
c.error_description && (a.errorDetails = c.error_description), a.reloadConsole = function() {
b.location.href = "/";
};
} ]), angular.module("openshiftConsole").controller("LogoutController", [ "$scope", "$log", "AuthService", "AUTH_CFG", function(a, b, c, d) {
b.debug("LogoutController"), c.isLoggedIn() ? (b.debug("LogoutController, logged in, initiating logout"), a.logoutMessage = "Logging out...", c.startLogout()["finally"](function() {
c.isLoggedIn() ? (b.debug("LogoutController, logout failed, still logged in"), a.logoutMessage = 'You could not be logged out. Return to the <a href="./">console</a>.') :d.logout_uri ? (b.debug("LogoutController, logout completed, redirecting to AUTH_CFG.logout_uri", d.logout_uri), window.location.href = d.logout_uri) :(b.debug("LogoutController, logout completed, reloading the page"), window.location.reload(!1));
})) :d.logout_uri ? (b.debug("LogoutController, logout completed, redirecting to AUTH_CFG.logout_uri", d.logout_uri), a.logoutMessage = "Logging out...", window.location.href = d.logout_uri) :(b.debug("LogoutController, not logged in, logout complete"), a.logoutMessage = 'You are logged out. Return to the <a href="./">console</a>.');
} ]), angular.module("openshiftConsole").controller("CreateController", [ "$scope", "$filter", "$location", "$q", "$routeParams", "$uibModal", "AlertMessageService", "CatalogService", "Constants", "DataService", "LabelFilter", "Logger", "ProjectsService", function(a, b, c, d, e, f, g, h, i, j, k, l, m) {
a.projectName = e.project, a.categories = i.CATALOG_CATEGORIES, a.alerts = a.alerts || {}, g.getAlerts().forEach(function(b) {
a.alerts[b.name] = b.data;
}), g.clearAlerts(), a.breadcrumbs = [ {
title:a.projectName,
link:"project/" + a.projectName
}, {
title:"Add to Project"
} ], m.get(e.project).then(_.spread(function(c, d) {
a.project = c, a.context = d, a.breadcrumbs[0].title = b("displayName")(c), j.list("imagestreams", {
namespace:"openshift"
}, function(b) {
a.openshiftImageStreams = b.by("metadata.name");
}), j.list("templates", {
namespace:"openshift"
}, function(b) {
a.openshiftTemplates = b.by("metadata.name");
}), "openshift" === e.project ? (a.projectImageStreams = [], a.projectTemplates = []) :(j.list("imagestreams", d, function(b) {
a.projectImageStreams = b.by("metadata.name");
}), j.list("templates", d, function(b) {
a.projectTemplates = b.by("metadata.name");
}));
}));
} ]), angular.module("openshiftConsole").controller("CreateFromURLController", [ "$scope", "$routeParams", "$location", "$filter", "AuthService", "DataService", "AlertMessageService", "Navigate", "ProjectsService", function(a, b, c, d, e, f, g, h, i) {
e.withUser(), g.getAlerts().forEach(function(b) {
a.alerts[b.name] = b.data;
}), g.clearAlerts(), a.alerts = {}, a.selected = {};
var j = function(b) {
a.alerts.invalidImageStream = {
type:"error",
message:'The requested image stream "' + b + '" could not be loaded.'
};
}, k = function(b) {
a.alerts.invalidImageTag = {
type:"error",
message:'The requested image stream tag "' + b + '" could not be loaded.'
};
}, l = function(b) {
a.alerts.invalidImageStream = {
type:"error",
message:'The app name "' + b + "\" is not valid.  An app name is an alphanumeric (a-z, and 0-9) string with a maximum length of 24 characters, where the first character is a letter (a-z), and the '-' character is allowed anywhere except the first or last character."
};
}, m = function(b) {
a.alerts.invalidNamespace = {
type:"error",
message:'Resources from the namespace "' + b + '" are not permitted.'
};
}, n = function(b) {
a.alerts.invalidTemplate = {
type:"error",
message:'The requested template "' + b + '" could not be loaded.'
};
}, o = function() {
a.alerts.resourceRequired = {
type:"error",
message:"An image stream or template is required."
};
}, p = function() {
a.alerts.invalidResource = {
type:"error",
message:"Image streams and templates cannot be combined."
};
}, q = function() {
try {
return b.templateParamsMap && JSON.parse(b.templateParamsMap) || {};
} catch (c) {
a.alerts.invalidTemplateParams = {
type:"error",
message:"The templateParamsMap is not valid JSON. " + c
};
}
}, r = window.OPENSHIFT_CONSTANTS.CREATE_FROM_URL_WHITELIST, s = [ "namespace", "name", "imageStream", "imageTag", "sourceURI", "sourceRef", "contextDir", "template", "templateParamsMap" ], t = _.pick(b, function(a, b) {
return _.contains(s, b) && _.isString(a);
});
t.namespace = t.namespace || "openshift";
var u = function(a) {
return a.length < 25 && /^[a-z]([-a-z0-9]*[a-z0-9])?$/.test(a);
}, v = function() {
t.imageStream && f.get("imagestreams", t.imageStream, {
namespace:t.namespace
}, {
errorNotification:!1
}).then(function(b) {
a.imageStream = b, f.get("imagestreamtags", b.metadata.name + ":" + t.imageTag, {
namespace:t.namespace
}, {
errorNotification:!1
}).then(function(b) {
a.imageStreamTag = b, a.validationPassed = !0, a.resource = b, t.displayName = d("displayName")(b);
}, function() {
k(t.imageTag);
});
}, function() {
j(t.imageStream);
}), t.template && f.get("templates", t.template, {
namespace:t.namespace
}, {
errorNotification:!1
}).then(function(b) {
a.template = b, q() && (a.validationPassed = !0, a.resource = b);
}, function() {
n(t.template);
});
};
_.includes(r, t.namespace) ? t.imageStream && t.template ? p() :t.imageStream || t.template ? t.name && !u(t.name) ? l(t.name) :v() :o() :m(t.namespace), angular.extend(a, {
createDetails:t,
createWithProject:function(d) {
d = d || a.selected.project.metadata.name;
var e = b.imageStream ? h.createFromImageURL(a.imageStream, t.imageTag, d, t) :h.createFromTemplateURL(a.template, d, t);
c.url(e);
}
}), a.projects = {}, a.canCreateProject = void 0, f.list("projects", a).then(function(b) {
a.loaded = !0, a.projects = d("orderByDisplayName")(b.by("metadata.name")), a.noProjects = _.isEmpty(a.projects);
}), i.canCreate().then(function() {
a.canCreateProject = !0;
}, function() {
a.canCreateProject = !1;
});
} ]), angular.module("openshiftConsole").controller("CreateProjectController", [ "$scope", "$location", "AuthService", "DataService", "AlertMessageService", function(a, b, c, d, e) {
a.alerts = {}, c.withUser(), e.getAlerts().forEach(function(b) {
a.alerts[b.name] = b.data;
}), e.clearAlerts();
} ]), angular.module("openshiftConsole").controller("EditProjectController", [ "$scope", "$routeParams", "$filter", "$location", "DataService", "AlertMessageService", "ProjectsService", "Navigate", function(a, b, c, d, e, f, g, h) {
a.alerts = {}, f.getAlerts().forEach(function(b) {
a.alerts[b.name] = b.data;
}), f.clearAlerts();
var i = c("annotation"), j = c("annotationName");
g.get(b.project).then(_.spread(function(e) {
var f = function(a) {
return {
description:i(a, "description"),
displayName:i(a, "displayName")
};
}, k = function(a, b) {
var c = angular.copy(a);
return c.metadata.annotations[j("description")] = b.description, c.metadata.annotations[j("displayName")] = b.displayName, c;
};
angular.extend(a, {
project:e,
editableFields:f(e),
show:{
editing:!1
},
actions:{
canSubmit:!1
},
canSubmit:function(b) {
a.actions.canSubmit = b;
},
update:function() {
a.disableInputs = !0, g.update(b.project, k(e, a.editableFields)).then(function() {
b.then ? d.path(b.then) :h.toProjectOverview(e.metadata.name);
}, function(b) {
a.disableInputs = !1, a.editableFields = f(e), a.alerts.update = {
type:"error",
message:"An error occurred while updating the project",
details:c("getErrorDetails")(b)
};
});
}
});
}));
} ]), angular.module("openshiftConsole").controller("CreateRouteController", [ "$filter", "$routeParams", "$scope", "$window", "ApplicationGenerator", "AuthorizationService", "DataService", "Navigate", "ProjectsService", "keyValueEditorUtils", function(a, b, c, d, e, f, g, h, i, j) {
c.alerts = {}, c.renderOptions = {
hideFilterWidget:!0
}, c.projectName = b.project, c.serviceName = b.service, c.labels = [], c.routing = {
name:c.serviceName || ""
}, c.breadcrumbs = [ {
title:c.projectName,
link:"project/" + c.projectName
}, {
title:"Routes",
link:"project/" + c.projectName + "/browse/routes"
}, {
title:"Create Route"
} ], i.get(b.project).then(_.spread(function(i, k) {
if (c.project = i, c.breadcrumbs[0].title = a("displayName")(i), !f.canI("routes", "create", b.project)) return void h.toErrorPage("You do not have authority to create routes in project " + b.project + ".", "access_denied");
var l = a("orderByDisplayName");
g.list("services", k, function(a) {
c.services = l(a.by("metadata.name")), c.routing.to = {}, c.routing.to.service = _.find(c.services, function(a) {
return !c.serviceName || a.metadata.name === c.serviceName;
});
}), c.copyServiceLabels = function() {
var a = _.get(c, "routing.to.service.metadata.labels", {}), b = j.mapEntries(j.compactEntries(c.labels)), d = _.assign(b, a);
c.labels = _.map(d, function(a, b) {
return {
name:b,
value:a
};
});
}, c.createRoute = function() {
if (c.createRouteForm.$valid) {
c.disableInputs = !0;
var b = c.routing.to.service.metadata.name, f = j.mapEntries(j.compactEntries(c.labels)), h = e.createRoute(c.routing, b, f), i = _.get(c, "routing.alternateServices", []);
_.isEmpty(i) || (h.spec.to.weight = _.get(c, "routing.to.weight"), h.spec.alternateBackends = _.map(i, function(a) {
return {
kind:"Service",
name:_.get(a, "service.metadata.name"),
weight:a.weight
};
})), g.create("routes", null, h, k).then(function() {
d.history.back();
}, function(b) {
c.disableInputs = !1, c.alerts["create-route"] = {
type:"error",
message:"An error occurred creating the route.",
details:a("getErrorDetails")(b)
};
});
}
};
}));
} ]), angular.module("openshiftConsole").controller("AttachPVCController", [ "$filter", "$routeParams", "$scope", "$window", "APIService", "AuthorizationService", "BreadcrumbsService", "DataService", "Navigate", "ProjectsService", "StorageService", "RELATIVE_PATH_PATTERN", function(a, b, c, d, e, f, g, h, i, j, k, l) {
if (!b.kind || !b.name) return void i.toErrorPage("Kind or name parameter missing.");
var m = [ "Deployment", "DeploymentConfig", "ReplicaSet", "ReplicationController" ];
if (!_.includes(m, b.kind)) return void i.toErrorPage("Storage is not supported for kind " + b.kind + ".");
var n = {
resource:e.kindToResource(b.kind),
group:b.group
};
c.alerts = {}, c.renderOptions = {
hideFilterWidget:!0
}, c.projectName = b.project, c.kind = b.kind, c.name = b.name, c.RELATIVE_PATH_PATTERN = l, c.attach = {
persistentVolumeClaim:null,
volumeName:null,
mountPath:null,
allContainers:!0,
containers:{}
}, c.breadcrumbs = g.getBreadcrumbs({
name:b.name,
kind:b.kind,
namespace:b.project,
subpage:"Add Storage",
includeProject:!0
}), j.get(b.project).then(_.spread(function(e, j) {
if (c.project = e, c.breadcrumbs[0].title = a("displayName")(e), !f.canI(n, "update", b.project)) return void i.toErrorPage("You do not have authority to update " + a("humanizeKind")(b.kind) + " " + b.name + ".", "access_denied");
var l = a("orderByDisplayName"), m = a("getErrorDetails"), o = a("generateName"), p = function(a, b) {
c.disableInputs = !0, c.alerts["attach-persistent-volume-claim"] = {
type:"error",
message:a,
details:b
};
}, q = function(a) {
return c.attach.allContainers || c.attach.containers[a.name];
}, r = function() {
var a = _.get(c, "attach.resource.spec.template");
c.existingMountPaths = k.getMountPaths(a, q);
};
c.$watchGroup([ "attach.resource", "attach.allContainers" ], r), c.$watch("attach.containers", r, !0);
var s = function() {
h.get(n, b.name, j).then(function(a) {
c.attach.resource = a, c.breadcrumbs = g.getBreadcrumbs({
object:a,
project:e,
subpage:"Add Storage",
includeProject:!0
});
var b = _.get(a, "spec.template");
c.existingVolumeNames = k.getVolumeNames(b);
}, function(a) {
p(b.name + " could not be loaded.", m(a));
}), h.list("persistentvolumeclaims", j, function(a) {
c.pvcs = l(a.by("metadata.name")), _.isEmpty(c.pvcs) || c.attach.persistentVolumeClaim || (c.attach.persistentVolumeClaim = _.head(c.pvcs));
});
};
s(), c.attachPVC = function() {
if (c.disableInputs = !0, c.attachPVCForm.$valid) {
c.attach.volumeName || (c.attach.volumeName = o("volume-"));
var e = c.attach.resource, f = _.get(e, "spec.template"), g = c.attach.persistentVolumeClaim, i = c.attach.volumeName, l = c.attach.mountPath, r = c.attach.subPath, s = c.attach.readOnly;
l && angular.forEach(f.spec.containers, function(a) {
if (q(a)) {
var b = k.createVolumeMount(i, l, r, s);
a.volumeMounts || (a.volumeMounts = []), a.volumeMounts.push(b);
}
});
var t = k.createVolume(i, g);
f.spec.volumes || (f.spec.volumes = []), f.spec.volumes.push(t), c.alerts = {}, h.update(n, e.metadata.name, c.attach.resource, j).then(function() {
d.history.back();
}, function(d) {
p("An error occurred attaching the persistent volume claim to the " + a("humanizeKind")(b.kind) + ".", m(d)), c.disableInputs = !1;
});
}
};
}));
} ]), angular.module("openshiftConsole").controller("AddConfigVolumeController", [ "$filter", "$location", "$routeParams", "$scope", "$window", "APIService", "AuthorizationService", "BreadcrumbsService", "DataService", "Navigate", "ProjectsService", "StorageService", "RELATIVE_PATH_PATTERN", function(a, b, c, d, e, f, g, h, i, j, k, l, m) {
if (!c.kind || !c.name) return void j.toErrorPage("Kind or name parameter missing.");
var n = [ "Deployment", "DeploymentConfig", "ReplicaSet", "ReplicationController" ];
if (!_.includes(n, c.kind)) return void j.toErrorPage("Volumes are not supported for kind " + c.kind + ".");
var o = {
resource:f.kindToResource(c.kind),
group:c.group
};
d.alerts = {}, d.projectName = c.project, d.kind = c.kind, d.name = c.name, d.attach = {
allContainers:!0,
pickKeys:!1
}, d.forms = {}, d.RELATIVE_PATH_PATTERN = m, d.breadcrumbs = h.getBreadcrumbs({
name:c.name,
kind:c.kind,
namespace:c.project,
subpage:"Add Config Files",
includeProject:!0
});
var p = a("humanizeKind");
d.groupByKind = function(a) {
return p(a.kind);
};
var q = function() {
_.set(d, "attach.items", [ {} ]);
};
d.$watch("attach.source", q);
var r = function() {
d.forms.addConfigVolumeForm.$setDirty();
};
d.addItem = function() {
d.attach.items.push({}), r();
}, d.removeItem = function(a) {
d.attach.items.splice(a, 1), r();
}, k.get(c.project).then(_.spread(function(b, f) {
if (d.project = b, !g.canI(o, "update", c.project)) return void j.toErrorPage("You do not have authority to update " + p(c.kind) + " " + c.name + ".", "access_denied");
var k = a("orderByDisplayName"), m = a("getErrorDetails"), n = a("generateName"), q = function(a, b) {
d.alerts["attach-persistent-volume-claim"] = {
type:"error",
message:a,
details:b
};
};
i.get(o, c.name, f, {
errorNotification:!1
}).then(function(a) {
d.targetObject = a, d.breadcrumbs = h.getBreadcrumbs({
object:a,
project:b,
subpage:"Add Config Files",
includeProject:!0
});
}, function(a) {
d.error = a;
}), i.list("configmaps", f, null, {
errorNotification:!1
}).then(function(a) {
d.configMaps = k(a.by("metadata.name"));
}, function(a) {
return 403 === a.code ? void (d.configMaps = []) :void q("Could not load config maps", m(a));
}), i.list("secrets", f, null, {
errorNotification:!1
}).then(function(a) {
d.secrets = k(a.by("metadata.name"));
}, function(a) {
return 403 === a.code ? void (d.secrets = []) :void q("Could not load secrets", m(a));
});
var r = function(a) {
return d.attach.allContainers || d.attach.containers[a.name];
}, s = function() {
var a = _.get(d, "targetObject.spec.template");
d.existingMountPaths = l.getMountPaths(a, r);
};
d.$watchGroup([ "targetObject", "attach.allContainers" ], s), d.$watch("attach.containers", s, !0);
var t = function() {
var a = _.map(d.attach.items, "path");
d.itemPaths = _.compact(a);
};
d.$watch("attach.items", t, !0), d.addVolume = function() {
if (!d.forms.addConfigVolumeForm.$invalid) {
var b = d.targetObject, g = _.get(d, "attach.source"), h = _.get(b, "spec.template"), j = n("volume-"), k = _.get(d, "attach.mountPath"), l = {
name:j,
mountPath:k
};
"Secret" === g.kind && (l.readOnly = !0), _.each(h.spec.containers, function(a) {
r(a) && (a.volumeMounts = a.volumeMounts || [], a.volumeMounts.push(l));
});
var p, s = {
name:j
};
switch (d.attach.pickKeys && (p = d.attach.items), g.kind) {
case "ConfigMap":
s.configMap = {
name:g.metadata.name,
items:p
};
break;

case "Secret":
s.secret = {
secretName:g.metadata.name,
items:p
};
}
h.spec.volumes = h.spec.volumes || [], h.spec.volumes.push(s), d.alerts = {}, d.disableInputs = !0, i.update(o, b.metadata.name, d.targetObject, f).then(function() {
e.history.back();
}, function(b) {
d.disableInputs = !1;
var e = a("humanizeKind"), f = e(g.kind), h = e(c.kind);
q("An error occurred attaching the " + f + " to the " + h + ".", m(b));
});
}
};
}));
} ]), angular.module("openshiftConsole").controller("CreateSecretModalController", [ "$scope", "$uibModalInstance", function(a, b) {
a.postCreateAction = function(c, d) {
b.close(c), _.each(d, function(b) {
a.alerts[b.name] = b.data;
});
}, a.cancel = function() {
b.dismiss("cancel");
};
} ]), angular.module("openshiftConsole").controller("ConfirmModalController", [ "$scope", "$uibModalInstance", "modalConfig", function(a, b, c) {
_.extend(a, c), a.confirm = function() {
b.close("confirm");
}, a.cancel = function() {
b.dismiss("cancel");
};
} ]), angular.module("openshiftConsole").controller("ConfirmScaleController", [ "$scope", "$uibModalInstance", "resource", "type", function(a, b, c, d) {
a.resource = c, a.type = d, a.confirmScale = function() {
b.close("confirmScale");
}, a.cancel = function() {
b.dismiss("cancel");
};
} ]), angular.module("openshiftConsole").controller("ConfirmSaveLogController", [ "$scope", "$uibModalInstance", "object", "CLIHelp", function(a, b, c, d) {
a.object = c, a.command = d.getLogsCommand(c), a.save = function() {
b.close("save");
}, a.cancel = function() {
b.dismiss("cancel");
};
} ]), angular.module("openshiftConsole").controller("DeleteModalController", [ "$scope", "$uibModalInstance", function(a, b) {
a["delete"] = function() {
b.close("delete");
}, a.cancel = function() {
b.dismiss("cancel");
};
} ]), angular.module("openshiftConsole").controller("DebugTerminalModalController", [ "$scope", "$filter", "$uibModalInstance", "container", "image", function(a, b, c, d, e) {
a.container = d, a.image = e, a.$watch("debugPod.status.containerStatuses", function() {
a.containerState = _.get(a, "debugPod.status.containerStatuses[0].state");
}), a.close = function() {
c.close("close");
};
} ]), angular.module("openshiftConsole").controller("ConfirmReplaceModalController", [ "$scope", "$uibModalInstance", function(a, b) {
a.replace = function() {
b.close("replace");
}, a.cancel = function() {
b.dismiss("cancel");
};
} ]), angular.module("openshiftConsole").controller("ProcessTemplateModalController", [ "$scope", "$uibModalInstance", function(a, b) {
a["continue"] = function() {
b.close("create");
}, a.cancel = function() {
b.dismiss("cancel");
};
} ]), angular.module("openshiftConsole").controller("LinkServiceModalController", [ "$scope", "$uibModalInstance", "ServicesService", function(a, b, c) {
a.$watch("services", function(b) {
var d = c.getDependentServices(a.service);
a.options = _.filter(b, function(b) {
return b !== a.service && !_.includes(d, b.metadata.name);
}), 1 === _.size(a.options) && _.set(a, "link.selectedService", _.head(a.options));
}), a.link = function() {
b.close(_.get(a, "link.selectedService"));
}, a.cancel = function() {
b.dismiss();
};
} ]), angular.module("openshiftConsole").controller("JenkinsfileExamplesModalController", [ "$scope", "$uibModalInstance", function(a, b) {
a.ok = function() {
b.close("ok");
};
} ]), angular.module("openshiftConsole").controller("AboutComputeUnitsModalController", [ "$scope", "$uibModalInstance", function(a, b) {
a.ok = function() {
b.close("ok");
};
} ]), angular.module("openshiftConsole").controller("AboutController", [ "$scope", "AuthService", "Constants", function(a, b, c) {
b.withUser(), a.version = {
master:{
openshift:c.VERSION.openshift,
kubernetes:c.VERSION.kubernetes
}
};
} ]), angular.module("openshiftConsole").controller("CommandLineController", [ "$scope", "DataService", "AuthService", "Constants", function(a, b, c, d) {
c.withUser(), a.cliDownloadURL = d.CLI, a.cliDownloadURLPresent = a.cliDownloadURL && !_.isEmpty(a.cliDownloadURL), a.loginBaseURL = b.openshiftAPIBaseUrl(), a.sessionToken = c.UserStore().getToken(), a.showSessionToken = !1, a.toggleShowSessionToken = function() {
a.showSessionToken = !a.showSessionToken;
};
} ]), angular.module("openshiftConsole").controller("CreatePersistentVolumeClaimController", [ "$filter", "$routeParams", "$scope", "$window", "ApplicationGenerator", "AuthorizationService", "DataService", "Navigate", "ProjectsService", "keyValueEditorUtils", function(a, b, c, d, e, f, g, h, i, j) {
c.alerts = {}, c.projectName = b.project, c.accessModes = "ReadWriteOnce", c.claim = {}, c.breadcrumbs = [ {
title:c.projectName,
link:"project/" + c.projectName
}, {
title:"Storage",
link:"project/" + c.projectName + "/browse/storage"
}, {
title:"Create Storage"
} ], i.get(b.project).then(_.spread(function(e, i) {
function k() {
var a = {
kind:"PersistentVolumeClaim",
apiVersion:"v1",
metadata:{
name:c.claim.name,
labels:{},
annotations:{}
},
spec:{
resources:{
requests:{}
}
}
};
a.spec.accessModes = [ c.claim.accessModes || "ReadWriteOnce" ];
var b = c.claim.unit || "Mi";
if (a.spec.resources.requests.storage = c.claim.amount + b, c.claim.selectedLabels) {
var d = j.mapEntries(j.compactEntries(c.claim.selectedLabels));
_.isEmpty(d) || _.set(a, "spec.selector.matchLabels", d);
}
return c.claim.storageClass && "No Storage Class" !== c.claim.storageClass.metadata.name && (a.metadata.annotations["volume.beta.kubernetes.io/storage-class"] = c.claim.storageClass.metadata.name), a;
}
return c.project = e, c.breadcrumbs[0].title = a("displayName")(e), f.canI("persistentvolumeclaims", "create", b.project) ? void (c.createPersistentVolumeClaim = function() {
if (c.createPersistentVolumeClaimForm.$valid) {
c.disableInputs = !0;
var b = k();
g.create("persistentvolumeclaims", null, b, i).then(function() {
d.history.back();
}, function(b) {
c.disableInputs = !1, c.alerts["create-persistent-volume-claim"] = {
type:"error",
message:"An error occurred requesting storage claim.",
details:a("getErrorDetails")(b)
};
});
}
}) :void h.toErrorPage("You do not have authority to create persistent volume claims in project " + b.project + ".", "access_denied");
}));
} ]), angular.module("openshiftConsole").directive("buildClose", [ "$window", function(a) {
var b = function(a) {
return "hide/build/" + a.metadata.uid;
}, c = function(a) {
var c = b(a);
return "true" === sessionStorage.getItem(c);
};
return {
restrict:"AE",
scope:{
build:"=",
hideBuild:"="
},
controller:[ "$scope", function(a) {
a.onHideBuild = function() {
var c = b(a.build);
a.hideBuild = !0, sessionStorage.setItem(c, "true");
};
} ],
link:function(a, b, d, e) {
a.hideBuild = !1, a.$watch("build", function(b) {
a.hideBuild = c(b);
});
},
templateUrl:"views/directives/_build-close.html"
};
} ]), angular.module("openshiftConsole").directive("createProject", function() {
return {
restrict:"E",
scope:{
alerts:"=",
submitButtonLabel:"@",
redirectAction:"&"
},
templateUrl:"views/directives/_create-project-form.html",
controller:[ "$scope", "$filter", "$location", "DataService", function(a, b, c, d) {
a.submitButtonLabel || (a.submitButtonLabel = "Create"), a.createProject = function() {
a.disableInputs = !0, a.createProjectForm.$valid && d.create("projectrequests", null, {
apiVersion:"v1",
kind:"ProjectRequest",
metadata:{
name:a.name
},
displayName:a.displayName,
description:a.description
}, a).then(function(b) {
var d = a.redirectAction();
d ? d(encodeURIComponent(b.metadata.name)) :c.path("project/" + encodeURIComponent(b.metadata.name) + "/create");
}, function(b) {
a.disableInputs = !1;
var c = b.data || {};
if ("AlreadyExists" === c.reason) a.nameTaken = !0; else {
var d = c.message || "An error occurred creating the project.";
a.alerts["error-creating-project"] = {
type:"error",
message:d
};
}
});
};
} ]
};
}), angular.module("openshiftConsole").directive("createSecret", [ "$filter", "AuthorizationService", "DataService", "DNS1123_SUBDOMAIN_VALIDATION", function(a, b, c, d) {
return {
restrict:"E",
scope:{
type:"=",
serviceAccountToLink:"=?",
namespace:"=",
postCreateAction:"&",
cancel:"&"
},
templateUrl:"views/directives/create-secret.html",
link:function(e) {
e.alerts = {}, e.nameValidation = d, e.secretAuthTypeMap = {
image:{
label:"Image Secret",
authTypes:[ {
id:"kubernetes.io/dockercfg",
label:"Image Registry Credentials"
}, {
id:"kubernetes.io/dockerconfigjson",
label:"Configuration File"
} ]
},
source:{
label:"Source Secret",
authTypes:[ {
id:"kubernetes.io/basic-auth",
label:"Basic Authentication"
}, {
id:"kubernetes.io/ssh-auth",
label:"SSH Key"
} ]
}
}, e.secretTypes = _.keys(e.secretAuthTypeMap), e.type ? e.newSecret = {
type:e.type,
authType:e.secretAuthTypeMap[e.type].authTypes[0].id,
data:{},
linkSecret:!_.isEmpty(e.serviceAccountToLink),
pickedServiceAccountToLink:e.serviceAccountToLink || ""
} :e.newSecret = {
type:"source",
authType:"kubernetes.io/basic-auth",
data:{},
linkSecret:!1,
pickedServiceAccountToLink:""
}, e.add = {
gitconfig:!1,
cacert:!1
}, b.canI("serviceaccounts", "list") && b.canI("serviceaccounts", "update") && c.list("serviceaccounts", e, function(a) {
e.serviceAccounts = a.by("metadata.name"), e.serviceAccountsNames = _.keys(e.serviceAccounts);
});
var f = function(a, b) {
var c = {
apiVersion:"v1",
kind:"Secret",
metadata:{
name:e.newSecret.data.secretName
},
type:b,
data:{}
};
switch (b) {
case "kubernetes.io/basic-auth":
a.passwordToken ? c.data = {
password:window.btoa(a.passwordToken)
} :c.type = "Opaque", a.username && (c.data.username = window.btoa(a.username)), a.gitconfig && (c.data[".gitconfig"] = window.btoa(a.gitconfig)), a.cacert && (c.data["ca.crt"] = window.btoa(a.cacert));
break;

case "kubernetes.io/ssh-auth":
c.data = {
"ssh-privatekey":window.btoa(a.privateKey)
}, a.gitconfig && (c.data[".gitconfig"] = window.btoa(a.gitconfig));
break;

case "kubernetes.io/dockerconfigjson":
var d = window.btoa(a.dockerConfig);
JSON.parse(a.dockerConfig).auths ? c.data[".dockerconfigjson"] = d :(c.type = "kubernetes.io/dockercfg", c.data[".dockercfg"] = d);
break;

case "kubernetes.io/dockercfg":
var f = window.btoa(a.dockerUsername + ":" + a.dockerPassword), g = {};
g[a.dockerServer] = {
username:a.dockerUsername,
password:a.dockerPassword,
email:a.dockerMail,
auth:f
}, c.data[".dockercfg"] = window.btoa(JSON.stringify(g));
}
return c;
}, g = function(b, d) {
var f = angular.copy(e.serviceAccounts[e.newSecret.pickedServiceAccountToLink]);
switch (e.newSecret.type) {
case "source":
f.secrets.push({
name:b.metadata.name
});
break;

case "image":
f.imagePullSecrets.push({
name:b.metadata.name
});
}
var g = e.serviceAccountToLink ? {
errorNotification:!1
} :{};
c.update("serviceaccounts", e.newSecret.pickedServiceAccountToLink, f, e, g).then(function(a) {
d.push({
name:"create",
data:{
type:"success",
message:"Secret " + b.metadata.name + " was created and linked with service account " + a.metadata.name + "."
}
}), e.postCreateAction({
newSecret:b,
creationAlert:d
});
}, function(c) {
d.push({
name:"createAndLink",
data:{
type:"error",
message:"An error occurred while linking the secret with service account " + e.newSecret.pickedServiceAccountToLink + ".",
details:a("getErrorDetails")(c)
}
}), e.postCreateAction({
newSecret:b,
creationAlert:d
});
});
}, h = _.debounce(function() {
try {
JSON.parse(e.newSecret.data.dockerConfig), e.invalidConfigFormat = !1;
} catch (a) {
e.invalidConfigFormat = !0;
}
}, 300, {
leading:!0
});
e.aceChanged = h, e.create = function() {
e.alerts = {};
var d = f(e.newSecret.data, e.newSecret.authType);
c.create("secrets", null, d, e).then(function(a) {
var c = [ {
name:"create",
data:{
type:"success",
message:"Secret " + d.metadata.name + " was created."
}
} ];
e.newSecret.linkSecret && e.serviceAccountsNames.contains(e.newSecret.pickedServiceAccountToLink) && b.canI("serviceaccounts", "update") ? g(a, c) :e.postCreateAction({
newSecret:a,
creationAlert:c
});
}, function(b) {
var c = b.data || {};
return "AlreadyExists" === c.reason ? void (e.nameTaken = !0) :void (e.alerts.create = {
type:"error",
message:"An error occurred while creating the secret.",
details:a("getErrorDetails")(b)
});
});
};
}
};
} ]), angular.module("openshiftConsole").directive("timeOnlyDurationUntilNow", function() {
return {
restrict:"E",
scope:{
timestamp:"=",
omitSingle:"=?",
precision:"=?"
},
template:'<span data-timestamp="{{timestamp}}" data-time-only="true" class="duration">{{timestamp | timeOnlyDurationFromTimestamps : null}}</span>'
};
}).directive("durationUntilNow", function() {
return {
restrict:"E",
scope:{
timestamp:"=",
omitSingle:"=?",
precision:"=?"
},
template:'<span data-timestamp="{{timestamp}}" data-omit-single="{{omitSingle}}" data-precision="{{precision}}" class="duration">{{timestamp | duration : null : omitSingle : precision}}</span>'
};
}), angular.module("openshiftConsole").directive("deleteLink", [ "$uibModal", "$location", "$filter", "$q", "hashSizeFilter", "APIService", "DataService", "AlertMessageService", "Navigate", "Logger", function(a, b, c, d, e, f, g, h, i, j) {
return {
restrict:"E",
scope:{
kind:"@",
group:"@?",
typeDisplayName:"@?",
resourceName:"@",
projectName:"@",
alerts:"=",
displayName:"@",
disableDelete:"=?",
typeNameToConfirm:"=?",
label:"@?",
buttonOnly:"@",
stayOnCurrentPage:"=?",
replicas:"=?",
hpaList:"=?",
success:"=?",
redirectUrl:"@?"
},
templateUrl:function(a, b) {
return angular.isDefined(b.buttonOnly) ? "views/directives/delete-button.html" :"views/directives/delete-link.html";
},
replace:!0,
link:function(e, k, l) {
"Project" === l.kind && (e.isProject = !0), e.options = {
deleteHPAs:!0
};
var m = function(a) {
e.stayOnCurrentPage ? e.alerts[a.name] = a.data :h.addAlert(a);
}, n = function(a) {
return g["delete"]({
resource:"horizontalpodautoscalers",
group:"extensions"
}, a.metadata.name, {
namespace:e.projectName
}).then(function() {
m({
name:a.metadata.name,
data:{
type:"success",
message:"Horizontal Pod Autoscaler " + a.metadata.name + " was marked for deletion."
}
});
})["catch"](function(b) {
m({
name:a.metadata.name,
data:{
type:"error",
message:"Horizontal Pod Autoscaler " + a.metadata.name + " could not be deleted."
}
}), j.error("HPA " + a.metadata.name + " could not be deleted.", b);
});
}, o = function() {
if (!e.stayOnCurrentPage) {
if (e.redirectUrl) return void b.url(e.redirectUrl);
if ("Project" !== e.kind) return void i.toResourceList(f.kindToResource(e.kind), e.projectName);
if ("/" === b.path()) return void e.$emit("deleteProject");
var a = URI("/");
b.url(a);
}
};
e.openDeleteModal = function() {
if (!e.disableDelete) {
var b = a.open({
animation:!0,
templateUrl:"views/modals/delete-resource.html",
controller:"DeleteModalController",
scope:e
});
b.result.then(function() {
var a = e.kind, b = e.resourceName, h = e.typeDisplayName || c("humanizeKind")(a), i = h + " '" + (e.displayName ? e.displayName :b) + "'", k = "Project" === e.kind ? {} :{
namespace:e.projectName
};
g["delete"]({
resource:f.kindToResource(a),
group:e.group
}, b, k).then(function() {
m({
name:b,
data:{
type:"success",
message:_.capitalize(i) + " was marked for deletion."
}
}), e.success && e.success();
var a = [];
e.options.deleteHPAs && _.forEach(e.hpaList, function(b) {
a.push(n(b));
}), a.length ? d.all(a).then(o) :o();
})["catch"](function(a) {
e.alerts[b] = {
type:"error",
message:_.capitalize(i) + "' could not be deleted.",
details:c("getErrorDetails")(a)
}, j.error(i + " could not be deleted.", a);
});
});
}
};
}
};
} ]), angular.module("openshiftConsole").directive("editWebhookTriggers", [ "ApplicationGenerator", function(a) {
return {
restrict:"E",
scope:{
type:"@",
typeInfo:"@",
triggers:"=",
bcName:"=",
projectName:"=",
form:"="
},
templateUrl:"views/directives/edit-webhook-triggers.html",
controller:[ "$scope", function(b) {
b.addWebhookTrigger = function(c) {
var d = {
disabled:!1,
data:{
type:c
}
};
d.data["GitHub" === c ? "github" :"generic"] = {
secret:a._generateSecret()
}, b.triggers.push(d), b.form.$setDirty();
};
} ]
};
} ]), angular.module("openshiftConsole").directive("editConfigMap", [ "DNS1123_SUBDOMAIN_VALIDATION", function(a) {
return {
require:"^form",
restrict:"E",
scope:{
configMap:"=model",
showNameInput:"="
},
templateUrl:"views/directives/edit-config-map.html",
link:function(b, c, d, e) {
b.form = e, b.nameValidation = a, b.addItem = function() {
b.data.push({
key:"",
value:""
}), b.form.$setDirty();
}, b.removeItem = function(a) {
b.data.splice(a, 1), b.form.$setDirty();
}, b.getKeys = function() {
return _.map(b.data, "key");
};
var f = b.$watch("configMap.data", function(a) {
a && (b.data = _.map(a, function(a, b) {
return {
key:b,
value:a
};
}), _.sortBy(b.data, "key"), _.isEmpty(b.data) && b.addItem(), f(), b.$watch("data", function(a) {
var c = {};
_.each(a, function(a) {
c[a.key] = a.value;
}), _.set(b, "configMap.data", c);
}, !0));
});
}
};
} ]), angular.module("openshiftConsole").directive("events", [ "$routeParams", "$filter", "DataService", "KeywordService", "ProjectsService", "Logger", function(a, b, c, d, e, f) {
return {
restrict:"E",
scope:{
resourceKind:"@?",
resourceName:"@?",
projectContext:"="
},
templateUrl:"views/directives/events.html",
controller:[ "$scope", function(a) {
a.filter = {
text:""
};
var b = function(b) {
return a.resourceKind ? _.filter(b, function(b) {
return b.involvedObject.kind === a.resourceKind && b.involvedObject.name === a.resourceName;
}) :b;
}, e = [], g = _.get(a, "sortConfig.currentField.id"), h = {
lastTimestamp:!0
}, i = function() {
var b = _.get(a, "sortConfig.currentField.id", "lastTimestamp");
g !== b && (g = b, a.sortConfig.isAscending = !h[g]);
var c = a.sortConfig.isAscending ? "asc" :"desc";
e = _.sortByOrder(a.events, [ b ], [ c ]);
}, j = [], k = function() {
a.filterExpressions = j = d.generateKeywords(_.get(a, "filter.text"));
}, l = [ "reason", "message", "type" ];
a.resourceKind && a.resourceName || l.splice(0, 0, "involvedObject.name", "involvedObject.kind");
var m = function() {
a.filteredEvents = d.filterForKeywords(e, l, j);
};
a.$watch("filter.text", _.debounce(function() {
k(), a.$apply(m);
}, 50, {
maxWait:250
}));
var n = function() {
i(), m();
}, o = _.debounce(function() {
a.$evalAsync(n);
}, 250, {
leading:!0,
trailing:!1,
maxWait:1e3
});
a.sortConfig = {
fields:[ {
id:"lastTimestamp",
title:"Time",
sortType:"alpha"
}, {
id:"type",
title:"Severity",
sortType:"alpha"
}, {
id:"reason",
title:"Reason",
sortType:"alpha"
}, {
id:"message",
title:"Message",
sortType:"alpha"
}, {
id:"count",
title:"Count",
sortType:"numeric"
} ],
isAscending:!0,
onSortChange:n
}, a.resourceKind && a.resourceName || a.sortConfig.fields.splice(1, 0, {
id:"involvedObject.name",
title:"Name",
sortType:"alpha"
}, {
id:"involvedObject.kind",
title:"Kind",
sortType:"alpha"
});
var p = [];
p.push(c.watch("events", a.projectContext, function(c) {
a.events = b(c.by("metadata.name")), o(), f.log("events (subscribe)", a.filteredEvents);
})), a.$on("$destroy", function() {
c.unwatchAll(p);
});
} ]
};
} ]), angular.module("openshiftConsole").directive("eventsSidebar", [ "DataService", "Logger", "$rootScope", function(a, b, c) {
return {
restrict:"E",
scope:{
projectContext:"=",
collapsed:"="
},
templateUrl:"views/directives/events-sidebar.html",
controller:[ "$scope", function(d) {
var e = [];
e.push(a.watch("events", d.projectContext, function(a) {
var c = a.by("metadata.name");
d.events = _.sortByOrder(c, [ "lastTimestamp" ], [ "desc" ]), d.warningCount = _.size(_.filter(c, {
type:"Warning"
})), b.log("events (subscribe)", d.events);
})), d.highlightedEvents = {}, d.collapseSidebar = function() {
d.collapsed = !0;
}, c.$on("event.resource.highlight", function(a, b) {
var c = _.get(b, "kind"), e = _.get(b, "metadata.name");
c && e && _.each(d.events, function(a) {
a.involvedObject.kind === c && a.involvedObject.name === e && (d.highlightedEvents[c + "/" + e] = !0);
});
}), c.$on("event.resource.clear-highlight", function(a, b) {
var c = _.get(b, "kind"), e = _.get(b, "metadata.name");
c && e && _.each(d.events, function(a) {
a.involvedObject.kind === c && a.involvedObject.name === e && (d.highlightedEvents[c + "/" + e] = !1);
});
}), d.$on("$destroy", function() {
a.unwatchAll(e);
});
} ]
};
} ]), angular.module("openshiftConsole").directive("eventsBadge", [ "$filter", "DataService", "Logger", function(a, b, c) {
return {
restrict:"E",
scope:{
projectContext:"=",
sidebarCollapsed:"="
},
templateUrl:"views/directives/events-badge.html",
controller:[ "$scope", function(d) {
var e = [], f = a("orderObjectsByDate");
e.push(b.watch("events", d.projectContext, function(a) {
var b = a.by("metadata.name");
d.events = f(b, !0), d.warningCount = _.size(_.filter(b, {
type:"Warning"
})), d.normalCount = _.size(_.filter(b, {
type:"Normal"
})), c.log("events (subscribe)", d.events);
})), d.expandSidebar = function() {
d.sidebarCollapsed = !1;
}, d.$on("$destroy", function() {
b.unwatchAll(e);
});
} ]
};
} ]), angular.module("openshiftConsole").directive("fromFile", [ "$q", "$uibModal", "$location", "$filter", "CachedTemplateService", "AlertMessageService", "Navigate", "TaskList", "DataService", "APIService", "QuotaService", function(a, b, c, d, e, f, g, h, i, j, k) {
return {
restrict:"E",
scope:!1,
templateUrl:"views/directives/from-file.html",
controller:[ "$scope", function(l) {
function m(a) {
return !!a.kind || (l.error = {
message:"Resource is missing kind field."
}, !1);
}
function n(a) {
return !!l.isList || (a.metadata ? a.metadata.name ? !a.metadata.namespace || a.metadata.namespace === l.projectName || (l.error = {
message:a.kind + " " + a.metadata.name + " can't be created in project " + a.metadata.namespace + ". Can't create resource in different projects."
}, !1) :(l.error = {
message:"Resource name is missing in metadata field."
}, !1) :(l.error = {
message:"Resource is missing metadata field."
}, !1));
}
function o() {
var a = b.open({
animation:!0,
templateUrl:"views/modals/process-template.html",
controller:"ProcessTemplateModalController",
scope:l
});
a.result.then(function() {
l.templateOptions.add ? q() :(e.setTemplate(l.resourceList[0]), r());
});
}
function p() {
var a = b.open({
animation:!0,
templateUrl:"views/modals/confirm-replace.html",
controller:"ConfirmReplaceModalController",
scope:l
});
a.result.then(function() {
k.getLatestQuotaAlerts(l.createResources, l.context).then(C);
});
}
function q() {
var b = l.createResources.length, c = l.updateResources.length;
if (l.resourceKind.endsWith("List")) {
var d = [];
c > 0 && d.push(v()), b > 0 && d.push(u()), a.all(d).then(r);
} else t();
}
function r() {
var a;
if ("Template" === l.resourceKind && l.templateOptions.process && !l.errorOccured) {
var b = l.templateOptions.add || l.updateResources.length > 0 ? l.projectName :"";
a = g.createFromTemplateURL(A, l.projectName, {
namespace:b
});
} else a = g.projectOverviewURL(l.projectName);
c.url(a);
}
function s(a) {
var b = j.objectToResourceGroupVersion(a);
return b ? j.apiInfo(b) ? i.get(b, a.metadata.name, l.context, {
errorNotification:!1
}).then(function(b) {
var c = angular.copy(a), d = angular.copy(b.metadata);
d.annotations = a.metadata.annotations, d.labels = a.metadata.labels, c.metadata = d, l.updateResources.push(c);
}, function() {
l.createResources.push(a);
}) :(l.errorOccured = !0, void (l.error = {
message:j.unsupportedObjectKindOrVersion(a)
})) :(l.errorOccured = !0, void (l.error = {
message:j.invalidObjectKindOrVersion(a)
}));
}
function t() {
var a;
_.isEmpty(l.createResources) ? (a = _.head(l.updateResources), i.update(j.kindToResource(a.kind), a.metadata.name, a, {
namespace:l.projectName
}).then(function() {
f.addAlert({
name:a.metadata.name,
data:{
type:"success",
message:a.kind + " " + a.metadata.name + " was successfully updated."
}
}), r();
}, function(b) {
l.alerts["update" + a.metadata.name] = {
type:"error",
message:"Unable to update the " + x(a.kind) + " '" + a.metadata.name + "'.",
details:d("getErrorDetails")(b)
};
})) :(a = _.head(l.createResources), i.create(j.kindToResource(a.kind), null, a, {
namespace:l.projectName
}).then(function() {
f.addAlert({
name:a.metadata.name,
data:{
type:"success",
message:a.kind + " " + a.metadata.name + " was successfully created."
}
}), r();
}, function(b) {
l.alerts["create" + a.metadata.name] = {
type:"error",
message:"Unable to create the " + x(a.kind) + " '" + a.metadata.name + "'.",
details:d("getErrorDetails")(b)
};
}));
}
function u() {
var b = {
started:"Creating resources in project " + l.projectName,
success:"Creating resources in project " + l.projectName,
failure:"Failed to create some resources in project " + l.projectName
}, c = {};
h.add(b, c, l.projectName, function() {
var b = a.defer();
return i.batch(l.createResources, l.context, "create").then(function(a) {
var c = [], d = !1;
if (a.failure.length > 0) d = !0, l.errorOccured = !0, a.failure.forEach(function(a) {
c.push({
type:"error",
message:"Cannot create " + x(a.object.kind) + ' "' + a.object.metadata.name + '". ',
details:a.data.message
});
}), a.success.forEach(function(a) {
c.push({
type:"success",
message:"Created " + x(a.kind) + ' "' + a.metadata.name + '" successfully. '
});
}); else {
var e;
e = l.isList ? "All items in list were created successfully." :x(l.resourceKind) + " " + l.resourceName + " was successfully created.", c.push({
type:"success",
message:e
});
}
b.resolve({
alerts:c,
hasErrors:d
});
}), b.promise;
});
}
function v() {
var b = {
started:"Updating resources in project " + l.projectName,
success:"Updated resources in project " + l.projectName,
failure:"Failed to update some resources in project " + l.projectName
}, c = {};
h.add(b, c, l.projectName, function() {
var b = a.defer();
return i.batch(l.updateResources, l.context, "update").then(function(a) {
var c = [], d = !1;
if (a.failure.length > 0) d = !0, l.errorOccured = !0, a.failure.forEach(function(a) {
c.push({
type:"error",
message:"Cannot update " + x(a.object.kind) + ' "' + a.object.metadata.name + '". ',
details:a.data.message
});
}), a.success.forEach(function(a) {
c.push({
type:"success",
message:"Updated " + x(a.kind) + ' "' + a.metadata.name + '" successfully. '
});
}); else {
var e;
e = l.isList ? "All items in list were updated successfully." :x(l.resourceKind) + " " + l.resourceName + " was successfully updated.", c.push({
type:"success",
message:e
});
}
b.resolve({
alerts:c,
hasErrors:d
});
}, function(a) {
var c = [];
c.push({
type:"error",
message:"An error occurred updating the resources.",
details:"Status: " + a.status + ". " + a.data
}), b.resolve({
alerts:c
});
}), b.promise;
});
}
var w, x = d("humanizeKind");
h.clear(), l.aceLoaded = function(a) {
w = a.getSession(), w.setOption("tabSize", 2), w.setOption("useSoftTabs", !0), a.setDragDelay = 0, a.$blockScrolling = 1 / 0;
};
var y = function() {
var a = w.getAnnotations();
l.editorErrorAnnotation = _.some(a, {
type:"error"
});
}, z = _.debounce(function() {
try {
JSON.parse(l.editorContent), w.setMode("ace/mode/json");
} catch (a) {
try {
jsyaml.safeLoad(l.editorContent), w.setMode("ace/mode/yaml");
} catch (a) {}
}
l.$apply(y);
}, 300);
l.aceChanged = z;
var A, B = function(a) {
var c = b.open({
animation:!0,
templateUrl:"views/modals/confirm.html",
controller:"ConfirmModalController",
resolve:{
modalConfig:function() {
return {
alerts:a,
message:"Problems were detected while checking your application configuration.",
okButtonText:"Create Anyway",
okButtonClass:"btn-danger",
cancelButtonText:"Cancel"
};
}
}
});
c.result.then(q);
}, C = function(a) {
var b = a.quotaAlerts || [], c = _.filter(b, {
type:"error"
});
c.length ? (l.disableInputs = !1, l.alerts = b) :b.length ? (B(b), l.disableInputs = !1) :q();
};
l.create = function() {
l.alerts = {}, delete l.error;
try {
A = JSON.parse(l.editorContent);
} catch (b) {
try {
A = jsyaml.safeLoad(l.editorContent);
} catch (b) {
return void (l.error = b);
}
}
if (m(A) && (l.resourceKind = A.kind, l.resourceKind.endsWith("List") ? l.isList = !0 :l.isList = !1, n(A))) {
l.isList ? (l.resourceList = A.items, l.resourceName = "") :(l.resourceList = [ A ], l.resourceName = A.metadata.name, "Template" === l.resourceKind && (l.templateOptions = {
process:!0,
add:!1
})), l.updateResources = [], l.createResources = [];
var c = [];
l.errorOccured = !1, _.forEach(l.resourceList, function(a) {
return n(a) ? void c.push(s(a)) :(l.errorOccured = !0, !1);
}), a.all(c).then(function() {
l.errorOccured || (1 === l.createResources.length && "Template" === l.resourceList[0].kind ? o() :_.isEmpty(l.updateResources) ? k.getLatestQuotaAlerts(l.createResources, l.context).then(C) :(l.updateTemplate = 1 === l.updateResources.length && "Template" === l.updateResources[0].kind, l.updateTemplate ? o() :p()));
});
}
};
} ]
};
} ]), angular.module("openshiftConsole").directive("oscFileInput", [ "Logger", function(a) {
return {
restrict:"E",
scope:{
model:"=",
required:"=",
disabled:"=ngDisabled",
showTextArea:"=",
helpText:"@?",
dropZoneId:"@?"
},
templateUrl:"views/directives/osc-file-input.html",
link:function(b, c) {
function d() {
var a = c.find(".drag-and-drop-zone");
a.on("dragover", function() {
b.disabled || (a.addClass("highlight-drag-and-drop-zone"), i = !0);
}), c.find(".drag-and-drop-zone p").on("dragover", function() {
b.disabled || (i = !0);
}), a.on("dragleave", function() {
b.disabled || (i = !1, _.delay(function() {
i || a.removeClass("highlight-drag-and-drop-zone");
}, 200));
}), a.on("drop", function(a) {
if (!b.disabled) {
var c = _.get(a, "originalEvent.dataTransfer.files", []);
return c.length > 0 && (b.file = _.head(c), e(b.file)), f(), $(".drag-and-drop-zone").trigger("putDropZoneFront", !1), $(".drag-and-drop-zone").trigger("reset"), !1;
}
});
var d = function(a, b) {
var c = b.offset(), d = b.outerWidth(), e = b.outerHeight();
a.css({
height:e + 6,
width:d + 6,
top:c.top,
left:c.left,
position:"fixed",
"z-index":100
});
};
a.on("putDropZoneFront", function(a, e) {
if (!b.disabled) {
var f, g = c.find(".drag-and-drop-zone");
return e ? (f = b.dropZoneId ? $("#" + b.dropZoneId) :c, d(g, f)) :g.css("z-index", "-1"), !1;
}
}), a.on("reset", function() {
if (!b.disabled) return j = !1, !1;
});
}
function e(c) {
var d = new FileReader();
d.onloadend = function() {
b.$apply(function() {
b.fileName = c.name, b.model = d.result;
});
}, d.onerror = function(c) {
b.supportsFileUpload = !1, b.uploadError = !0, a.error("Could not read file", c);
}, d.readAsText(c);
}
function f() {
c.find(".drag-and-drop-zone").removeClass("show-drag-and-drop-zone highlight-drag-and-drop-zone");
}
var g = _.uniqueId("osc-file-input-");
b.dropMessageID = g + "-drop-message", b.helpID = g + "-help", b.supportsFileUpload = window.File && window.FileReader && window.FileList && window.Blob, b.uploadError = !1;
var h = "#" + b.dropMessageID, i = !1, j = !1, k = c.find("input[type=file]");
setTimeout(d), $(document).on("drop." + g, function() {
return f(), c.find(".drag-and-drop-zone").trigger("putDropZoneFront", !1), !1;
}), $(document).on("dragenter." + g, function() {
if (!b.disabled) return j = !0, c.find(".drag-and-drop-zone").addClass("show-drag-and-drop-zone"), c.find(".drag-and-drop-zone").trigger("putDropZoneFront", !0), !1;
}), $(document).on("dragover." + g, function() {
if (!b.disabled) return j = !0, c.find(".drag-and-drop-zone").addClass("show-drag-and-drop-zone"), !1;
}), $(document).on("dragleave." + g, function() {
return j = !1, _.delay(function() {
j || c.find(".drag-and-drop-zone").removeClass("show-drag-and-drop-zone");
}, 200), !1;
}), b.cleanInputValues = function() {
b.model = "", b.fileName = "", k[0].value = "";
}, k.change(function() {
e(k[0].files[0]);
}), b.$on("$destroy", function() {
$(h).off(), $(document).off("drop." + g).off("dragenter." + g).off("dragover." + g).off("dragleave." + g);
});
}
};
} ]), angular.module("openshiftConsole").directive("oscFormSection", function() {
return {
restrict:"E",
transclude:!0,
scope:{
header:"@",
about:"@",
aboutTitle:"@",
editText:"@",
expand:"=?",
canToggle:"=?"
},
templateUrl:"views/directives/osc-form-section.html",
link:function(a, b, c) {
c.editText || (c.editText = "Edit"), angular.isDefined(c.canToggle) || (a.canToggle = !0), a.toggle = function() {
a.expand = !a.expand;
};
}
};
}), angular.module("openshiftConsole").directive("oscGitLink", [ "$filter", function(a) {
return {
restrict:"E",
scope:{
uri:"=",
ref:"=",
contextDir:"="
},
transclude:!0,
link:function(b) {
var c = a("isAbsoluteURL"), d = a("githubLink");
b.$watchGroup([ "uri", "ref", "contextDir" ], function() {
b.gitLink = d(b.uri, b.ref, b.contextDir), b.isLink = c(b.gitLink);
});
},
template:'<a ng-if="isLink" ng-href="{{gitLink}}" ng-transclude target="_blank"></a><span ng-if="!isLink" ng-transclude></span>'
};
} ]), angular.module("openshiftConsole").directive("oscImageSummary", function() {
return {
restrict:"E",
scope:{
resource:"=",
name:"=",
tag:"="
},
templateUrl:"views/directives/osc-image-summary.html"
};
}), angular.module("openshiftConsole").controller("KeyValuesEntryController", [ "$scope", function(a) {
a.editing = !1, a.edit = function() {
a.originalValue = a.value, a.editing = !0;
}, a.cancel = function() {
a.value = a.originalValue, a.editing = !1;
}, a.update = function(b, c, d) {
c && (d[b] = c, a.editing = !1);
};
} ]).directive("oscInputValidator", function() {
var a = {
always:function(a, b) {
return !0;
},
env:function(a, b) {
var c = /^[A-Za-z_][A-Za-z0-9_]*$/i;
return void 0 === a || null === a || 0 === a.trim().length || c.test(b);
},
label:function(a, b) {
function c(a) {
return !(a.length > h) && g.test(a);
}
function d(a) {
return !(a.length > f) && e.test(a);
}
var e = /^(([A-Za-z0-9][-A-Za-z0-9_.]*)?[A-Za-z0-9])?$/, f = 63, g = /^[a-z0-9]([-a-z0-9]*[a-z0-9])?(\.[a-z0-9]([-a-z0-9]*[a-z0-9])?)*$/, h = 253;
if (void 0 === a || null === a || 0 === a.trim().length) return !0;
var i = b.split("/");
switch (i.length) {
case 1:
return d(i[0]);

case 2:
return c(i[0]) && d(i[1]);
}
return !1;
},
path:function(a, b) {
var c = /^\//;
return void 0 === a || null === a || 0 === a.trim().length || c.test(b);
}
};
return {
require:[ "ngModel", "^oscKeyValues" ],
restrict:"A",
link:function(b, c, d, e) {
var f = e[0], g = e[1];
"key" === d.oscInputValidator ? f.$validators.oscKeyValid = a[g.scope.keyValidator] :"value" === d.oscInputValidator && (f.$validators.oscValueValid = a[g.scope.valueValidator]);
}
};
}).directive("oscKeyValues", function() {
return {
restrict:"E",
scope:{
keyTitle:"@",
valueTitle:"@",
entries:"=",
delimiter:"@",
editable:"@",
keyValidator:"@",
valueValidator:"@",
deletePolicy:"@",
readonlyKeys:"@",
keyValidationTooltip:"@",
valueValidationTooltip:"@",
preventEmpty:"=?"
},
controller:[ "$scope", function(a) {
var b, c = {}, d = function() {
return !!a.key || !!a.value;
}, e = function() {
d() ? a.showCommmitWarning = !0 :a.showCommmitWarning = !1;
}, f = _.debounce(function() {
a.$applyAsync(function() {
a.key ? a.clean.isClean.$setValidity("isClean", !1) :a.value ? a.clean.isClean.$setValidity("isClean", !1) :a.clean.isClean.$setValidity("isClean", !0);
});
}, 200), g = function(b) {
return function(c) {
a.$applyAsync(function() {
_.includes(b, document.activeElement) || (e(), f());
});
};
};
a.isClean = f, a.clear = function() {
a.key = "", a.value = "", e(), f();
}, a.allowDelete = function(b) {
return (!a.preventEmpty || 1 !== Object.keys(a.entries).length) && ("never" !== a.deletePolicy && ("added" !== a.deletePolicy || void 0 !== c[b]));
}, a.addEntry = function() {
if (a.key && a.value) {
var d = a.readonlyKeys.split(",");
if (d.indexOf(a.key) !== -1) return;
c[a.key] = "", a.entries[a.key] = a.value, a.key = null, a.value = null, a.form.$setPristine(), a.form.$setUntouched(), e(), f(), b.focus();
}
}, a.deleteEntry = function(b) {
a.entries[b] && (delete a.entries[b], delete c[b], a.form.$setDirty());
}, a.setErrorText = function(a) {
return "path" === a ? "absolute path" :"label" === a ? "label" :"key";
}, this.scope = a, this.init = function(c, d, e) {
var f = [ c[0], d[0], e[0] ], h = g(f);
b = c, c.on("blur", h), d.on("blur", h), e.on("blur", h), a.$on("$destroy", function() {
c.off("blur", h), d.off("blur", h), e.off("blur", h);
});
};
} ],
templateUrl:"views/directives/osc-key-values.html",
compile:function(a, b) {
return b.delimiter || (b.delimiter = ":"), b.keyTitle || (b.keyTitle = "Name"), b.valueTitle || (b.valueTitle = "Value"), b.editable && "true" !== b.editable ? b.editable = !1 :b.editable = !0, b.keyValidator || (b.keyValidator = "always"), b.valueValidator || (b.valueValidator = "always"), [ "always", "added", "none" ].indexOf(b.deletePolicy) === -1 && (b.deletePolicy = "always"), b.readonlyKeys || (b.readonlyKeys = ""), {
post:function(a, b, c, d) {
d.init(b.find('input[name="key"]'), b.find('input[name="value"]'), b.find("a.add-key-value"));
}
};
}
};
}), angular.module("openshiftConsole").directive("oscRouting", [ "Constants", "DNS1123_SUBDOMAIN_VALIDATION", function(a, b) {
return {
require:"^form",
restrict:"E",
scope:{
route:"=model",
services:"=",
showNameInput:"=",
routingDisabled:"=",
hostReadOnly:"="
},
templateUrl:"views/directives/osc-routing.html",
link:function(c, d, e, f) {
c.form = f, c.controls = {}, c.options = {
secureRoute:!1,
alternateServices:!1
}, c.disableWildcards = a.DISABLE_WILDCARD_ROUTES, c.disableCertificateInputs = function() {
var a = _.get(c, "route.tls.termination");
return !a || "passthrough" === a;
}, c.insecureTrafficOptions = [ {
value:"",
label:"None"
}, {
value:"Allow",
label:"Allow"
}, {
value:"Redirect",
label:"Redirect"
} ], _.has(c, "route.tls.insecureEdgeTerminationPolicy") || _.set(c, "route.tls.insecureEdgeTerminationPolicy", "");
var g = function() {
var a = "passthrough" !== _.get(c, "route.tls.termination") || "Allow" !== _.get(c, "route.tls.insecureEdgeTerminationPolicy");
c.routeForm.insecureTraffic.$setValidity("passthrough", a);
};
c.$watchGroup([ "route.tls.termination", "route.tls.insecureEdgeTerminationPolicy" ], g), c.nameValidation = b, c.disableWildcards ? c.hostnamePattern = b.pattern :c.hostnamePattern = /^(\*(\.[a-z0-9]([-a-z0-9]*[a-z0-9]))+|[a-z0-9]([-a-z0-9]*[a-z0-9])?(\.[a-z0-9]([-a-z0-9]*[a-z0-9])?)*)$/, c.hostnameMaxLength = b.maxlength;
var h = function(a) {
a && (c.unnamedServicePort = 1 === a.spec.ports.length && !a.spec.ports[0].name, a.spec.ports.length && !c.unnamedServicePort ? c.route.portOptions = _.map(a.spec.ports, function(a) {
return {
port:a.name,
label:a.port + " → " + a.targetPort + " (" + a.protocol + ")"
};
}) :c.route.portOptions = []);
};
c.services && !c.route.service && (c.route.service = _.find(c.services)), c.$watch("route.to.service", function(a, b) {
h(a), a === b && c.route.targetPort || (c.route.targetPort = _.get(c, "route.portOptions[0].port")), c.services && (c.alternateServiceOptions = _.reject(c.services, function(b) {
return a === b;
}));
}), c.$watch("route.alternateServices", function(a) {
c.duplicateServices = _(a).map("service").filter(function(a, b, c) {
return _.includes(c, a, b + 1);
}).value(), f.$setValidity("duplicateServices", !c.duplicateServices.length), c.options.alternateServices = !_.isEmpty(a);
}, !0);
var i = function() {
return !!c.route.tls && ((!c.route.tls.termination || "passthrough" === c.route.tls.termination) && (c.route.tls.certificate || c.route.tls.key || c.route.tls.caCertificate || c.route.tls.destinationCACertificate));
};
c.$watch("route.tls.termination", function() {
c.options.secureRoute = !!_.get(c, "route.tls.termination"), c.showCertificatesNotUsedWarning = i();
});
var j;
c.$watch("options.secureRoute", function(a, b) {
if (a !== b) {
var d = _.get(c, "route.tls.termination");
!c.securetRoute && d && (j = d, delete c.route.tls.termination), c.options.secureRoute && !d && _.set(c, "route.tls.termination", j || "edge");
}
}), c.$watch("options.alternateServices", function(a, b) {
a !== b && (a || (c.route.alternateServices = []), a && _.isEmpty(c.route.alternateServices) && c.addAlternateService());
}), c.addAlternateService = function() {
c.route.alternateServices = c.route.alternateServices || [];
var a = _.find(c.services, function(a) {
return a !== c.route.to.service && !_.some(c.route.alternateServices, {
service:a
});
});
_.has(c, "route.to.weight") || _.set(c, "route.to.weight", 1), c.route.alternateServices.push({
service:a,
weight:1
});
}, c.weightAsPercentage = function(a, b) {
a = a || 0;
var d = _.get(c, "route.to.weight", 0);
if (_.each(c.route.alternateServices, function(a) {
d += _.get(a, "weight", 0);
}), !d) return "";
var e = a / d * 100;
return b ? d3.round(e, 1) + "%" :e;
};
var k = !1;
c.$watch("route.alternateServices.length", function(a) {
0 === a && _.has(c, "route.to.weight") && delete c.route.to.weight, 1 === a && (k = !0, c.controls.rangeSlider = c.weightAsPercentage(c.route.to.weight));
}), c.$watch("controls.rangeSlider", function(a, b) {
return k ? void (k = !1) :void (a !== b && (a = parseInt(a, 10), _.set(c, "route.to.weight", a), _.set(c, "route.alternateServices[0].weight", 100 - a)));
});
}
};
} ]).directive("oscRoutingService", function() {
return {
restrict:"E",
scope:{
model:"=",
services:"=",
isAlternate:"=?",
showWeight:"=?"
},
templateUrl:"views/directives/osc-routing-service.html",
link:function(a, b, c, d) {
a.form = d, a.id = _.uniqueId("osc-routing-service-"), a.$watchGroup([ "model.service", "services" ], function() {
if (!_.isEmpty(a.services)) {
var b = _.get(a, "model.service");
if (!b || !_.includes(a.services, b)) {
var c = _.find(a.services);
_.set(a, "model.service", c);
}
}
});
}
};
}), angular.module("openshiftConsole").directive("oscPersistentVolumeClaim", [ "$filter", "DataService", "LimitRangesService", "ModalsService", "DNS1123_SUBDOMAIN_VALIDATION", function(a, b, c, d, e) {
return {
restrict:"E",
scope:{
claim:"=model",
projectName:"="
},
templateUrl:"views/directives/osc-persistent-volume-claim.html",
link:function(f) {
var g = a("amountAndUnit"), h = a("usageValue");
f.nameValidation = e, f.storageClasses = [], f.defaultStorageClass = "", f.claim.unit = "Gi", f.units = [ {
value:"Mi",
label:"MiB"
}, {
value:"Gi",
label:"GiB"
}, {
value:"Ti",
label:"TiB"
}, {
value:"M",
label:"MB"
}, {
value:"G",
label:"GB"
}, {
value:"T",
label:"TB"
} ], f.claim.selectedLabels = [], f.groupUnits = function(a) {
switch (a.value) {
case "Mi":
case "Gi":
case "Ti":
return "Binary Units";

case "M":
case "G":
case "T":
return "Decimal Units";
}
return "";
}, f.showComputeUnitsHelp = function() {
d.showComputeUnitsHelp();
};
var i = function() {
var a = f.claim.amount && h(f.claim.amount + f.claim.unit), b = _.has(f, "limits.min") && h(f.limits.min), c = _.has(f, "limits.max") && h(f.limits.max), d = !0, e = !0;
a && b && (d = a >= b), a && c && (e = a <= c), f.persistentVolumeClaimForm.capacity.$setValidity("limitRangeMin", d), f.persistentVolumeClaimForm.capacity.$setValidity("limitRangeMax", e);
};
b.list({
group:"storage.k8s.io",
resource:"storageclasses"
}, {}, function(b) {
var c = b.by("metadata.name");
if (!_.isEmpty(c)) {
f.storageClasses = _.sortBy(c, "metadata.name");
var d = a("annotation");
if (f.defaultStorageClass = _.find(f.storageClasses, function(a) {
return "true" === d(a, "storageclass.beta.kubernetes.io/is-default-class");
}), f.defaultStorageClass) f.claim.storageClass = f.defaultStorageClass; else {
var e = {
metadata:{
name:"No Storage Class",
labels:{},
annotations:{
description:"No storage class will be assigned"
}
}
};
f.storageClasses.unshift(e);
}
}
}, {
errorNotification:!1
}), b.list("limitranges", {
namespace:f.projectName
}, function(a) {
var b = a.by("metadata.name");
if (!_.isEmpty(b)) {
f.limits = c.getEffectiveLimitRange(b, "storage", "PersistentVolumeClaim");
var d;
if (f.limits.min && f.limits.max) {
var e = h(f.limits.min), j = h(f.limits.max);
e === j && (d = g(f.limits.max), f.claim.amount = Number(d[0]), f.claim.unit = d[1], f.capacityReadOnly = !0);
}
f.$watchGroup([ "claim.amount", "claim.unit" ], i);
}
});
}
};
} ]), angular.module("openshiftConsole").directive("oscUnique", function() {
return {
restrict:"A",
scope:{
oscUnique:"="
},
require:"ngModel",
link:function(a, b, c, d) {
var e = [];
a.$watchCollection("oscUnique", function(a) {
e = _.isArray(a) ? a :_.keys(a);
}), d.$parsers.unshift(function(a) {
return d.$setValidity("oscUnique", !_.includes(e, a)), a;
});
}
};
}), angular.module("openshiftConsole").directive("oscAutoscaling", [ "HPAService", "LimitRangesService", "DNS1123_SUBDOMAIN_VALIDATION", function(a, b, c) {
return {
restrict:"E",
scope:{
autoscaling:"=model",
project:"=",
showNameInput:"=?",
nameReadOnly:"=?"
},
templateUrl:"views/directives/osc-autoscaling.html",
link:function(d) {
d.nameValidation = c, d.$watch("project", function() {
if (d.project) {
d.isRequestCalculated = b.isRequestCalculated("cpu", d.project);
var c = window.OPENSHIFT_CONSTANTS.DEFAULT_HPA_CPU_TARGET_PERCENT;
d.isRequestCalculated && (c = a.convertLimitPercentToRequest(c, d.project)), _.set(d, "autoscaling.defaultTargetCPU", c), d.defaultTargetCPUDisplayValue = window.OPENSHIFT_CONSTANTS.DEFAULT_HPA_CPU_TARGET_PERCENT;
var e = !1, f = function(b) {
return e ? void (e = !1) :(b && d.isRequestCalculated && (b = a.convertRequestPercentToLimit(b, d.project)), void _.set(d, "targetCPUInput.percent", b));
};
d.$watch("autoscaling.targetCPU", f);
var g = function(b) {
b && d.isRequestCalculated && (b = a.convertLimitPercentToRequest(b, d.project)), e = !0, _.set(d, "autoscaling.targetCPU", b);
};
d.$watch("targetCPUInput.percent", function(a, b) {
a !== b && g(a);
});
}
});
}
};
} ]), angular.module("openshiftConsole").directive("oscSecrets", [ "$uibModal", "$filter", "DataService", "SecretsService", function(a, b, c, d) {
return {
restrict:"E",
scope:{
pickedSecrets:"=model",
secretsByType:"=",
namespace:"=",
displayType:"@",
type:"@",
alerts:"=",
disableInput:"=",
serviceAccountToLink:"@?",
allowMultipleSecrets:"=?"
},
templateUrl:"views/directives/osc-secrets.html",
link:function(b) {
b.canAddSourceSecret = function() {
if (!b.allowMultipleSecrets) return !1;
var a = _.last(b.pickedSecrets);
return !!a && a.name;
}, b.setLastSecretsName = function(a) {
var c = _.last(b.pickedSecrets);
c.name = a;
}, b.addSourceSecret = function() {
b.pickedSecrets.push({
name:""
});
}, b.removeSecret = function(a) {
1 === b.pickedSecrets.length ? b.pickedSecrets = [ {
name:""
} ] :b.pickedSecrets.splice(a, 1), b.secretsForm.$setDirty();
}, b.openCreateSecretModal = function() {
b.newSecret = {};
var e = a.open({
animation:!0,
backdrop:"static",
templateUrl:"views/modals/create-secret.html",
controller:"CreateSecretModalController",
scope:b
});
e.result.then(function(a) {
c.list("secrets", {
namespace:b.namespace
}, function(c) {
var e = d.groupSecretsByType(c), f = _.mapValues(e, function(a) {
return _.map(a, "metadata.name");
});
b.secretsByType = _.each(f, function(a) {
a.unshift("");
}), b.setLastSecretsName(a.metadata.name), b.secretsForm.$setDirty();
});
});
};
}
};
} ]), angular.module("openshiftConsole").directive("oscSourceSecrets", [ "$uibModal", "$filter", "DataService", "SecretsService", function(a, b, c, d) {
return {
restrict:"E",
scope:{
pickedSecrets:"=model",
secretsByType:"=",
strategyType:"=",
type:"@",
displayType:"@",
namespace:"=",
alerts:"=",
serviceAccountToLink:"@?"
},
templateUrl:"views/directives/osc-source-secrets.html",
link:function(b) {
b.canAddSourceSecret = function() {
var a = _.last(b.pickedSecrets);
switch (b.strategyType) {
case "Custom":
return _.get(a, "secretSource.name");

default:
return _.get(a, "secret.name");
}
}, b.setLastSecretsName = function(a) {
var c = _.last(b.pickedSecrets);
switch (b.strategyType) {
case "Custom":
return void (c.secretSource.name = a);

default:
return void (c.secret.name = a);
}
}, b.addSourceSecret = function() {
switch (b.strategyType) {
case "Custom":
return void b.pickedSecrets.push({
secretSource:{
name:""
},
mountPath:""
});

default:
return void b.pickedSecrets.push({
secret:{
name:""
},
destinationDir:""
});
}
}, b.removeSecret = function(a) {
if (1 === b.pickedSecrets.length) switch (b.strategyType) {
case "Custom":
b.pickedSecrets = [ {
secretSource:{
name:""
},
mountPath:""
} ];
break;

default:
b.pickedSecrets = [ {
secret:{
name:""
},
destinationDir:""
} ];
} else b.pickedSecrets.splice(a, 1);
b.secretsForm.$setDirty();
}, b.openCreateSecretModal = function() {
var e = a.open({
animation:!0,
templateUrl:"views/modals/create-secret.html",
controller:"CreateSecretModalController",
scope:b
});
e.result.then(function(a) {
c.list("secrets", {
namespace:b.namespace
}, function(c) {
var e = d.groupSecretsByType(c), f = _.mapValues(e, function(a) {
return _.map(a, "metadata.name");
});
b.secretsByType = _.each(f, function(a) {
a.unshift("");
}), b.setLastSecretsName(a.metadata.name);
});
});
};
}
};
} ]), angular.module("openshiftConsole").directive("replicas", function() {
return {
restrict:"E",
scope:{
status:"=?",
spec:"=",
disableScaling:"=?",
scaleFn:"&?",
deployment:"="
},
templateUrl:"views/directives/replicas.html",
link:function(a) {
a.model = {
editing:!1
}, a.scale = function() {
a.form.scaling.$valid && (a.scaleFn({
replicas:a.model.desired
}), a.model.editing = !1);
}, a.cancel = function() {
a.model.editing = !1;
};
}
};
}), angular.module("openshiftConsole").directive("overviewMonopod", [ "Navigate", "$location", function(a, b) {
return {
restrict:"E",
scope:{
pod:"="
},
templateUrl:"views/_overview-monopod.html",
link:function(c) {
c.viewPod = function() {
var d = a.resourceURL(c.pod, "Pod", c.pod.metadata.namespace);
b.url(d);
};
}
};
} ]).directive("podTemplate", function() {
return {
restrict:"E",
scope:{
podTemplate:"=",
imagesByDockerReference:"=",
builds:"=",
detailed:"=?",
addHealthCheckUrl:"@?"
},
templateUrl:"views/_pod-template.html"
};
}).directive("triggers", function() {
return {
restrict:"E",
scope:{
triggers:"=",
buildsByOutputImage:"=",
namespace:"="
},
templateUrl:"views/_triggers.html"
};
}).directive("deploymentConfigMetadata", function() {
return {
restrict:"E",
scope:{
deploymentConfigId:"=",
exists:"=",
differentService:"="
},
templateUrl:"views/_deployment-config-metadata.html"
};
}).directive("annotations", function() {
return {
restrict:"E",
scope:{
annotations:"="
},
templateUrl:"views/directives/annotations.html",
link:function(a) {
a.expandAnnotations = !1, a.toggleAnnotations = function() {
a.expandAnnotations = !a.expandAnnotations;
};
}
};
}).directive("volumes", function() {
return {
restrict:"E",
scope:{
volumes:"=",
namespace:"=",
canRemove:"=?",
removeFn:"&?"
},
templateUrl:"views/_volumes.html"
};
}).directive("volumeClaimTemplates", function() {
return {
restrict:"E",
scope:{
templates:"="
},
templateUrl:"views/_volume-claim-templates.html"
};
}).directive("environment", function() {
return {
restrict:"E",
scope:{
envVars:"="
},
templateUrl:"views/directives/environment.html",
controller:[ "$scope", function(a) {
a.expanded = {};
} ]
};
}).directive("hpa", function() {
return {
restrict:"E",
scope:{
hpa:"=",
project:"=",
showScaleTarget:"=?",
alerts:"="
},
templateUrl:"views/directives/hpa.html"
};
}).directive("probe", function() {
return {
restrict:"E",
scope:{
probe:"="
},
templateUrl:"views/directives/_probe.html"
};
}).directive("podsTable", function() {
return {
restrict:"E",
scope:{
pods:"=",
activePods:"=?",
emptyMessage:"=?",
customNameHeader:"=?",
podFailureReasons:"=?"
},
templateUrl:"views/directives/pods-table.html"
};
}).directive("trafficTable", function() {
return {
restrict:"E",
scope:{
routes:"=",
services:"=",
portsByRoute:"=",
showNodePorts:"=?",
emptyMessage:"=?",
customNameHeader:"=?"
},
templateUrl:"views/directives/traffic-table.html"
};
}), angular.module("openshiftConsole").directive("topologyDeployment", function() {
return {
restrict:"E",
scope:{
rc:"=",
deploymentConfigId:"=",
deploymentConfigMissing:"=",
deploymentConfigDifferentService:"=",
deploymentConfig:"=",
scalable:"=",
hpa:"=?",
limitRanges:"=",
project:"=",
imagesByDockerReference:"=",
builds:"=",
pods:"=",
alerts:"="
},
templateUrl:"views/_overview-deployment.html"
};
}), angular.module("openshiftConsole").directive("sidebar", [ "$location", "$filter", "Constants", function(a, b, c) {
var d = b("canI"), e = function(a, b) {
return a.href === b || _.some(a.prefixes, function(a) {
return _.startsWith(b, a);
});
};
return {
restrict:"E",
templateUrl:"views/_sidebar.html",
controller:[ "$scope", function(f) {
var g = a.path().replace("/project/" + f.projectName, "");
f.activeSecondary, f.navItems = c.PROJECT_NAVIGATION, f.activePrimary = _.find(f.navItems, function(a) {
return e(a, g) ? (f.activeSecondary = null, !0) :_.some(a.secondaryNavSections, function(a) {
var b = _.find(a.items, function(a) {
return e(a, g);
});
return !!b && (f.activeSecondary = b, !0);
});
}), f.navURL = function(a) {
return a ? b("isAbsoluteURL")(a) ? a :"project/" + f.projectName + a :"";
}, f.show = function(a) {
var b = !a.isValid || a.isValid();
if (!b) return !1;
var c = !a.canI || d(a.canI.resource, a.canI.verb, a.canI.group);
return c;
};
} ]
};
} ]).directive("projectHeader", [ "$timeout", "$location", "$filter", "DataService", "projectOverviewURLFilter", function(a, b, c, d, e) {
var f = {}, g = [];
return {
restrict:"EA",
templateUrl:"views/directives/header/project-header.html",
link:function(a, h) {
var i = h.find(".selectpicker"), j = [], k = function() {
var b = a.project || {}, d = a.projectName, e = b.metadata && b.metadata.name;
(d || e) && (d || (d = b.metadata.name), e || (b = {
metadata:{
name:d
}
}), f[d] || (f[d] = b), g = c("orderByDisplayName")(f), j = _.map(g, function(a) {
return $("<option>").attr("value", a.metadata.name).attr("selected", a.metadata.name === d).text(c("uniqueDisplayName")(a, g));
}), i.empty(), i.append(j), i.append($('<option data-divider="true"></option>')), i.append($('<option value="">View all projects</option>')), i.selectpicker("refresh"));
};
d.list("projects", a, function(a) {
f = a.by("metadata.name"), k();
}), k(), i.selectpicker({
iconBase:"fa",
tickIcon:"fa-check"
}).change(function() {
var c = $(this).val(), d = "" === c ? "/" :e(c);
a.$apply(function() {
b.url(d);
});
}), a.$on("project.settings.update", function(a, b) {
f[b.metadata.name] = b, k();
});
}
};
} ]).directive("projectFilter", [ "LabelFilter", function(a) {
return {
restrict:"E",
templateUrl:"views/directives/_project-filter.html",
link:function(b, c) {
a.setupFilterWidget(c.find(".navbar-filter-widget"), c.find(".active-filters"), {
addButtonText:"Add"
}), a.toggleFilterWidget(!b.renderOptions || !b.renderOptions.hideFilterWidget), b.$watch("renderOptions", function(b) {
a.toggleFilterWidget(!b || !b.hideFilterWidget);
});
}
};
} ]).directive("projectPage", function() {
return {
restrict:"E",
transclude:!0,
templateUrl:"views/_project-page.html"
};
}).directive("navbarUtility", function() {
return {
restrict:"E",
transclude:!0,
templateUrl:"views/directives/header/_navbar-utility.html"
};
}).directive("navbarUtilityMobile", function() {
return {
restrict:"E",
transclude:!0,
templateUrl:"views/directives/header/_navbar-utility-mobile.html"
};
}).directive("defaultHeader", function() {
return {
restrict:"E",
transclude:!0,
templateUrl:"views/directives/header/default-header.html"
};
}).directive("navPfVerticalAlt", function() {
return {
restrict:"EAC",
link:function() {
$.fn.navigation();
}
};
}).directive("breadcrumbs", function() {
return {
restrict:"E",
scope:{
breadcrumbs:"="
},
templateUrl:"views/directives/breadcrumbs.html"
};
}).directive("back", [ "$window", function(a) {
return {
restrict:"A",
link:function(b, c) {
c.bind("click", function() {
a.history.back();
});
}
};
} ]), angular.module("openshiftConsole").directive("alerts", function() {
return {
restrict:"E",
scope:{
alerts:"=",
filter:"=?",
animateSlide:"=?",
hideCloseButton:"=?",
toast:"=?"
},
templateUrl:"views/_alerts.html",
link:function(a) {
a.close = function(a) {
a.hidden = !0, _.isFunction(a.onClose) && a.onClose();
}, a.onClick = function(a, b) {
if (_.isFunction(b.onClick)) {
var c = b.onClick();
c && (a.hidden = !0);
}
};
}
};
}), angular.module("openshiftConsole").directive("parseError", function() {
return {
restrict:"E",
scope:{
error:"="
},
templateUrl:"views/_parse-error.html",
link:function(a) {
a.$watch("error", function() {
a.hidden = !1;
});
}
};
}), angular.module("openshiftConsole").directive("toggle", [ "IS_IOS", function(a) {
var b = function(a) {
$("body").css("cursor", a);
}, c = _.partial(b, "pointer"), d = _.partial(b, "auto");
return a && ($(document).on("shown.bs.popover", c), $(document).on("shown.bs.tooltip", c), $(document).on("hide.bs.popover", d), $(document).on("hide.bs.tooltip", d)), {
restrict:"A",
scope:{
dynamicContent:"@?"
},
link:function(a, b, c) {
var d = {
container:"body",
placement:"auto"
};
if (c) switch (c.toggle) {
case "popover":
(c.dynamicContent || "" === c.dynamicContent) && a.$watch("dynamicContent", function() {
$(b).popover("destroy"), setTimeout(function() {
$(b).attr("data-content", a.dynamicContent).popover(d);
}, 200);
}), $(b).popover(d), a.$on("$destroy", function() {
$(b).popover("destroy");
});
break;

case "tooltip":
(c.dynamicContent || "" === c.dynamicContent) && a.$watch("dynamicContent", function() {
$(b).tooltip("destroy"), setTimeout(function() {
$(b).attr("title", a.dynamicContent).tooltip(d);
}, 200);
}), $(b).tooltip(d), a.$on("$destroy", function() {
$(b).tooltip("destroy");
});
break;

case "dropdown":
"dropdown" === c.hover && ($(b).dropdownHover({
delay:200
}), $(b).dropdown());
}
}
};
} ]).directive("podWarnings", [ "podWarningsFilter", function(a) {
return {
restrict:"E",
scope:{
pod:"="
},
link:function(b) {
var c, d = "", e = a(b.pod);
for (c = 0; c < e.length; c++) d && (d += "<br>"), "error" === e[c].severity && (b.hasError = !0), d += e[c].message;
b.content = d;
},
templateUrl:"views/directives/_warnings-popover.html"
};
} ]).directive("routeWarnings", [ "RoutesService", function(a) {
return {
restrict:"E",
scope:{
route:"=",
service:"=",
warnings:"="
},
link:function(b) {
var c = function() {
var c = b.warnings || a.getRouteWarnings(b.route, b.service);
b.content = _.map(c, _.escape).join("<br>");
};
b.$watch("route", c, !0), b.$watch("service", c, !0), b.$watch("warnings", c, !0);
},
templateUrl:"views/directives/_warnings-popover.html"
};
} ]), angular.module("openshiftConsole").directive("takeFocus", [ "$timeout", function(a) {
return {
restrict:"A",
link:function(b, c) {
a(function() {
$(c).focus();
}, 300);
}
};
} ]).directive("selectOnFocus", function() {
return {
restrict:"A",
link:function(a, b) {
$(b).focus(function() {
$(this).select();
});
}
};
}).directive("focusWhen", [ "$timeout", function(a) {
return {
restrict:"A",
scope:{
trigger:"@focusWhen"
},
link:function(b, c) {
b.$watch("trigger", function(b) {
b && a(function() {
$(c).focus();
});
});
}
};
} ]).directive("tileClick", function() {
return {
restrict:"AC",
link:function(a, b) {
$(b).click(function(a) {
var c = $(a.target);
c && c.closest("a", b).length || $("a.tile-target", b).trigger("click");
});
}
};
}).directive("clickToReveal", function() {
return {
restrict:"A",
transclude:!0,
scope:{
linkText:"@"
},
templateUrl:"views/directives/_click-to-reveal.html",
link:function(a, b) {
$(".reveal-contents-link", b).click(function() {
$(this).hide(), $(".reveal-contents", b).show();
});
}
};
}).directive("copyToClipboard", [ "IS_IOS", function(a) {
return {
restrict:"E",
scope:{
clipboardText:"=",
isDisabled:"=?",
displayWide:"=?",
inputText:"=?",
multiline:"=?"
},
templateUrl:"views/directives/_copy-to-clipboard.html",
controller:[ "$scope", function(a) {
a.id = _.uniqueId("clipboardJs");
} ],
link:function(b, c) {
if (a) return void (b.hidden = !0);
var d = $("a", c), e = d.get(0);
b.inputText && (e = d.get(1));
var f = new Clipboard(e);
f.on("success", function(a) {
$(a.trigger).attr("title", "Copied!").tooltip("fixTitle").tooltip("show").attr("title", "Copy to clipboard").tooltip("fixTitle"), a.clearSelection();
}), f.on("error", function(a) {
var b = /Mac/i.test(navigator.userAgent) ? "Press ⌘C to copy" :"Press Ctrl-C to copy";
$(a.trigger).attr("title", b).tooltip("fixTitle").tooltip("show").attr("title", "Copy to clipboard").tooltip("fixTitle");
}), c.on("$destroy", function() {
f.destroy();
});
}
};
} ]).directive("shortId", function() {
return {
restrict:"E",
scope:{
id:"@"
},
template:'<code class="short-id" title="{{id}}">{{id.substring(0, 6)}}</code>'
};
}).directive("customIcon", function() {
return {
restrict:"E",
scope:{
resource:"=",
kind:"@",
tag:"=?"
},
controller:[ "$scope", "$filter", function(a, b) {
a.$watchGroup([ "resource", "tag" ], function() {
a.tag ? a.icon = b("imageStreamTagAnnotation")(a.resource, "icon", a.tag) :a.icon = b("annotation")(a.resource, "icon"), a.isDataIcon = a.icon && 0 === a.icon.indexOf("data:"), a.isDataIcon || (a.tag ? a.icon = b("imageStreamTagIconClass")(a.resource, a.tag) :a.icon = b("iconClass")(a.resource, a.kind));
});
} ],
templateUrl:"views/directives/_custom-icon.html"
};
}).directive("bottomOfWindow", function() {
return {
restrict:"A",
link:function(a, b) {
function c() {
var a = $(window).height() - b[0].getBoundingClientRect().top;
b.css("height", a - 10 + "px");
}
$(window).on("resize", c), c(), b.on("$destroy", function() {
$(window).off("resize", c);
});
}
};
}).directive("onEnter", function() {
return function(a, b, c) {
b.bind("keydown keypress", function(b) {
13 === b.which && (a.$apply(function() {
a.$eval(c.onEnter);
}), b.preventDefault());
});
};
}).directive("persistTabState", [ "$routeParams", "$location", function(a, b) {
return {
restrict:"A",
scope:!1,
link:function(c) {
c.selectedTab = c.selectedTab || {}, a.tab && (c.selectedTab[a.tab] = !0), c.$watch("selectedTab", function() {
var a = _.keys(_.pick(c.selectedTab, function(a) {
return a;
}));
if (1 === a.length) {
var d = b.search();
d.tab = a[0], b.replace().search(d);
}
}, !0);
}
};
} ]), angular.module("openshiftConsole").directive("labels", [ "$location", "$timeout", "LabelFilter", function(a, b, c) {
return {
restrict:"E",
scope:{
labels:"=",
clickable:"@?",
kind:"@?",
projectName:"@?",
limit:"=?",
titleKind:"@?",
navigateUrl:"@?",
filterCurrentPage:"=?"
},
templateUrl:"views/directives/labels.html",
link:function(d) {
d.filterAndNavigate = function(e, f) {
d.kind && d.projectName && (d.filterCurrentPage || a.url(d.navigateUrl || "/project/" + d.projectName + "/browse/" + d.kind), b(function() {
var a = {};
a[e] = f, c.setLabelSelector(new LabelSelector(a, (!0)));
}, 1));
};
}
};
} ]).directive("labelEditor", function() {
function a(a) {
return !(a.length > f) && e.test(a);
}
function b(a) {
return !(a.length > d) && c.test(a);
}
var c = /^(([A-Za-z0-9][-A-Za-z0-9_.]*)?[A-Za-z0-9])?$/, d = 63, e = /^[a-z0-9]([-a-z0-9]*[a-z0-9])?(\.[a-z0-9]([-a-z0-9]*[a-z0-9])?)*$/, f = 253;
return {
restrict:"E",
scope:{
labels:"=",
systemLabels:"=",
expand:"=?",
canToggle:"=?",
deletePolicy:"@?",
helpText:"@?"
},
templateUrl:"views/directives/label-editor.html",
link:function(a, b, c) {
angular.isDefined(c.canToggle) || (a.canToggle = !0);
},
controller:[ "$scope", function(c) {
var d = {
test:function(c) {
var d = c.split("/");
switch (d.length) {
case 1:
return b(d[0]);

case 2:
return a(d[0]) && b(d[1]);
}
return !1;
}
};
angular.extend(c, {
validator:{
key:d,
value:d
}
});
} ]
};
}), angular.module("openshiftConsole").directive("editLifecycleHook", function() {
return {
restrict:"E",
scope:{
type:"@",
hookParams:"=model",
availableVolumes:"=",
availableContainers:"=",
namespace:"="
},
templateUrl:"views/directives/edit-lifecycle-hook.html",
controller:[ "$scope", function(a) {
a.view = {
isDisabled:!1
}, a.lifecycleHookFailurePolicyTypes = [ "Abort", "Retry", "Ignore" ], a.istagHook = {}, a.removedHookParams = {}, a.action = {
type:_.has(a.hookParams, "tagImages") ? "tagImages" :"execNewPod"
};
var b = {
command:[],
env:[],
volumes:[],
containerName:a.availableContainers[0] || ""
}, c = {
to:{},
containerName:a.availableContainers[0] || ""
}, d = function(b) {
var c = {};
if (_.isEmpty(b)) c = {
namespace:a.namespace,
imageStream:"",
tagObject:null
}; else {
var d = b.name.split(":");
c = {
namespace:b.namespace || a.namespace,
imageStream:d[0],
tagObject:{
tag:d[1]
}
};
}
return c;
}, e = function() {
"execNewPod" === a.action.type ? (_.has(a.removedHookParams, "execNewPod") ? a.hookParams.execNewPod = a.removedHookParams.execNewPod :a.hookParams.execNewPod = _.get(a, "hookParams.execNewPod", {}), a.hookParams.execNewPod = _.merge(angular.copy(b), a.hookParams.execNewPod)) :(_.has(a.removedHookParams, "tagImages") ? a.hookParams.tagImages = a.removedHookParams.tagImages :a.hookParams.tagImages = _.get(a, "hookParams.tagImages", [ {} ]), a.hookParams.tagImages = [ _.merge(angular.copy(c), a.hookParams.tagImages[0]) ], a.istagHook = d(_.head(a.hookParams.tagImages).to)), a.hookParams.failurePolicy = _.get(a.hookParams, "failurePolicy", "Abort");
};
a.addHook = function() {
return _.isEmpty(a.removedHookParams) ? (a.hookParams = {}, void e()) :void (a.hookParams = a.removedHookParams);
}, a.removeHook = function() {
a.removedHookParams = a.hookParams, delete a.hookParams, a.editForm.$setDirty();
};
var f = function() {
a.hookParams && ("execNewPod" === a.action.type ? (a.hookParams.tagImages && (a.removedHookParams.tagImages = a.hookParams.tagImages, delete a.hookParams.tagImages), e()) :"tagImages" === a.action.type && (a.hookParams.execNewPod && (a.removedHookParams.execNewPod = a.hookParams.execNewPod, delete a.hookParams.execNewPod), e()));
};
a.$watchGroup([ "hookParams", "action.type" ], f), a.$watch("istagHook.tagObject.tag", function() {
_.has(a.istagHook, [ "tagObject", "tag" ]) && (_.set(a.hookParams, "tagImages[0].to.kind", "ImageStreamTag"), _.set(a.hookParams, "tagImages[0].to.namespace", a.istagHook.namespace), _.set(a.hookParams, "tagImages[0].to.name", a.istagHook.imageStream + ":" + a.istagHook.tagObject.tag));
});
} ]
};
}).directive("lifecycleHook", [ "$filter", function(a) {
return {
restrict:"E",
scope:{
deploymentConfig:"=",
type:"@"
},
templateUrl:"views/directives/lifecycle-hook.html",
link:function(b) {
b.$watch("deploymentConfig", function(c) {
b.strategyParams = a("deploymentStrategyParams")(c);
});
}
};
} ]), angular.module("openshiftConsole").directive("actionChip", function() {
return {
restrict:"E",
scope:{
key:"=?",
value:"=?",
keyHelp:"=?",
valueHelp:"=",
action:"&?",
actionIcon:"=?",
showAction:"=?"
},
templateUrl:"views/directives/action-chip.html"
};
}), angular.module("openshiftConsole").directive("templateOptions", function() {
return {
restrict:"E",
templateUrl:"views/_templateopt.html",
scope:{
parameters:"=",
expand:"=?",
canToggle:"=?"
},
link:function(a, b, c) {
angular.isDefined(c.canToggle) || (a.canToggle = !0), a.isOnlyWhitespace = function(a) {
return /^\s+$/.test(a);
}, a.focus = function(a) {
angular.element("#" + a).focus();
};
}
};
}), angular.module("openshiftConsole").directive("tasks", function() {
return {
restrict:"E",
templateUrl:"views/_tasks.html"
};
}), angular.module("openshiftConsole").directive("truncateLongText", [ "truncateFilter", function(a) {
return {
restrict:"E",
scope:{
content:"=",
limit:"=",
newlineLimit:"=",
useWordBoundary:"=",
expandable:"=",
keywords:"=highlightKeywords",
prettifyJson:"="
},
templateUrl:"views/directives/truncate-long-text.html",
link:function(b) {
b.toggles = {
expanded:!1
}, b.$watch("content", function(c) {
c ? (b.truncatedContent = a(c, b.limit, b.useWordBoundary, b.newlineLimit), b.truncated = b.truncatedContent.length !== c.length) :(b.truncatedContent = null, b.truncated = !1);
});
}
};
} ]), angular.module("openshiftConsole").directive("catalog", [ "CatalogService", "Constants", "KeywordService", "Logger", function(a, b, c, d) {
return {
restrict:"E",
scope:{
projectImageStreams:"=",
openshiftImageStreams:"=",
projectTemplates:"=",
openshiftTemplates:"=",
projectName:"=",
parentCategory:"=category"
},
templateUrl:"views/catalog/catalog.html",
link:function(e) {
function f() {
var b = e.keywords = c.generateKeywords(e.filter.keyword);
return _.isEmpty(b) ? (e.filterActive = !1, e.filteredBuildersByCategory = e.buildersByCategory, void (e.filteredTemplatesByCategory = e.templatesByCategory)) :(e.filterActive = !0, e.filteredBuildersByCategory = {}, _.each(e.buildersByCategory, function(c, d) {
var f = a.getCategoryItem(d), g = function(a) {
return a.test(f.label);
}, h = _.reject(b, g);
e.filteredBuildersByCategory[d] = a.filterImageStreams(c, h);
}), e.filteredBuildersNoSubcategory = a.filterImageStreams(e.buildersNoSubcategory, b), e.filteredTemplatesByCategory = {}, _.each(e.templatesByCategory, function(c, d) {
var f = a.getCategoryItem(d), g = function(a) {
return a.test(f.label);
}, h = _.reject(b, g);
e.filteredTemplatesByCategory[d] = a.filterTemplates(c, h);
}), void (e.filteredTemplatesNoSubcategory = a.filterTemplates(e.templatesNoSubcategory, b)));
}
function g(a) {
var b = _.get(e, "parentCategory.subcategories", []);
if (_.isEmpty(b)) return [];
var c = {};
_.each(b, function(b) {
_.each(b.items, function(b) {
_.each(a[b.id], function(a) {
var b = _.get(a, "metadata.uid");
c[b] = !0;
});
});
});
var d = function(a) {
var b = _.get(a, "metadata.uid");
return !!c[b];
}, f = e.parentCategory.id;
return _.reject(a[f], d);
}
function h() {
if (e.projectImageStreams && e.openshiftImageStreams) {
var b = _.toArray(e.projectImageStreams).concat(_.toArray(e.openshiftImageStreams));
e.buildersByCategory = a.categorizeImageStreams(b), e.buildersNoSubcategory = g(e.buildersByCategory), e.emptyCatalog = e.emptyCatalog && _.every(e.buildersByCategory, _.isEmpty) && _.isEmpty(e.buildersNoSubcategory), l();
}
}
function i() {
if (e.projectTemplates && e.openshiftTemplates) {
var b = _.toArray(e.projectTemplates).concat(_.toArray(e.openshiftTemplates));
e.templatesByCategory = a.categorizeTemplates(b), e.templatesNoSubcategory = g(e.templatesByCategory), e.emptyCatalog = e.emptyCatalog && _.every(e.templatesByCategory, _.isEmpty) && _.isEmpty(e.templatesNoSubcategory), l();
}
}
function j() {
e.noFilterMatches = !0, m = [];
var a = {};
_.each(e.filteredBuildersByCategory, function(b, c) {
a[c] = _.size(b);
}), _.each(e.filteredTemplatesByCategory, function(b, c) {
a[c] = (a[c] || 0) + _.size(b);
}), e.allContentHidden = !0, _.each(e.categories, function(b) {
var c = !1;
_.each(b.items, function(b) {
a[b.id] && (m.push(b), c = !0);
}), _.set(e, [ "hasContent", b.id ], c), c && (e.allContentHidden = !1);
}), e.countByCategory = a, e.hasItemsNoSubcategory = !_.isEmpty(e.buildersNoSubcategory) || !_.isEmpty(e.templatesNoSubcategory), e.countFilteredNoSubcategory = _.size(e.filteredBuildersNoSubcategory) + _.size(e.filteredTemplatesNoSubcategory), e.countFilteredNoSubcategory && (e.allContentHidden = !1);
}
function k() {
return !!e.parentCategory && (1 === m.length && !e.hasItemsNoSubcategory);
}
function l() {
e.loaded = e.projectTemplates && e.openshiftTemplates && e.projectImageStreams && e.openshiftImageStreams, f(), j(), e.loaded && (k() && (e.singleCategory = _.head(m)), d.log("templates by category", e.templatesByCategory), d.log("builder images", e.buildersByCategory));
}
e.categories = _.get(e, "parentCategory.subcategories", b.CATALOG_CATEGORIES), e.loaded = !1, e.emptyCatalog = !0, e.filter = {
keyword:""
}, e.$watch("filter.keyword", _.debounce(function() {
e.$apply(function() {
f(), j();
});
}, 200, {
maxWait:1e3,
trailing:!0
}));
var m;
e.$watchGroup([ "openshiftImageStreams", "projectImageStreams" ], h), e.$watchGroup([ "openshiftTemplates", "projectTemplates" ], i);
}
};
} ]), angular.module("openshiftConsole").directive("categoryContent", [ "CatalogService", "Constants", "KeywordService", "Logger", function(a, b, c, d) {
return {
restrict:"E",
scope:{
projectImageStreams:"=",
openshiftImageStreams:"=",
projectTemplates:"=",
openshiftTemplates:"=",
projectName:"=",
category:"="
},
templateUrl:"views/catalog/category-content.html",
link:function(b) {
function e() {
var d = b.keywords = c.generateKeywords(b.filter.keyword);
b.filteredBuilderImages = a.filterImageStreams(k, d), b.filteredTemplates = a.filterTemplates(l, d);
}
function f() {
return b.projectImageStreams && b.openshiftImageStreams ? _.toArray(b.projectImageStreams).concat(_.toArray(b.openshiftImageStreams)) :[];
}
function g() {
var c = a.categorizeImageStreams(f());
k = _.get(c, [ b.category.id ], []), j();
}
function h() {
return b.projectTemplates && b.openshiftTemplates ? _.toArray(b.projectTemplates).concat(_.toArray(b.openshiftTemplates)) :[];
}
function i() {
var c = a.categorizeTemplates(h());
l = _.get(c, [ b.category.id ], []), j();
}
function j() {
b.loaded = b.projectTemplates && b.openshiftTemplates && b.projectImageStreams && b.openshiftImageStreams, e(), b.emptyCategory = _.isEmpty(k) && _.isEmpty(l), b.loaded && (d.log("templates", l), d.log("builder images", k));
}
var k = [], l = [];
b.filteredTemplates = [], b.filteredBuilderImages = [], b.loaded = !1, b.filter = {
keyword:""
}, b.$watch("filter.keyword", e), b.$watchGroup([ "openshiftImageStreams", "projectImageStreams" ], g), b.$watchGroup([ "openshiftTemplates", "projectTemplates" ], i);
}
};
} ]), angular.module("openshiftConsole").directive("catalogImage", [ "$filter", function(a) {
return {
restrict:"E",
replace:!0,
scope:{
image:"=",
imageStream:"=",
project:"@",
isBuilder:"=?",
keywords:"="
},
templateUrl:"views/catalog/_image.html",
link:function(b) {
var c = a("imageStreamTagTags"), d = {};
b.referencedBy = {};
var e = _.get(b, "imageStream.spec.tags", []), f = {};
_.each(e, function(a) {
f[a.name] = c(b.imageStream, a.name), a.from && "ImageStreamTag" === a.from.kind && a.from.name.indexOf(":") === -1 && !a.from.namespace && (d[a.name] = !0, b.referencedBy[a.from.name] = b.referencedBy[a.from.name] || [], b.referencedBy[a.from.name].push(a.name));
});
var g = function(a) {
var b = _.get(f, [ a ], []);
return _.includes(b, "builder") && !_.includes(b, "hidden");
};
b.$watch("imageStream.status.tags", function(a) {
b.tags = _.filter(a, function(a) {
return g(a.tag) && !d[a.tag];
});
var c = _.get(b, "is.tag.tag");
c && _.some(b.tags, {
tag:c
}) || _.set(b, "is.tag", _.head(b.tags));
});
}
};
} ]), angular.module("openshiftConsole").directive("catalogTemplate", function() {
return {
restrict:"E",
replace:!0,
scope:{
template:"=",
project:"@",
keywords:"="
},
templateUrl:"views/catalog/_template.html"
};
}), angular.module("openshiftConsole").directive("oscObjectDescriber", [ "ObjectDescriber", function(a) {
return {
restrict:"E",
scope:{},
templateUrl:"views/directives/osc-object-describer.html",
link:function(b, c, d) {
var e = a.onResourceChanged(function(a, c) {
b.$apply(function() {
b.kind = c, b.resource = a;
});
});
b.$on("$destroy", function() {
a.removeResourceChangedCallback(e);
});
}
};
} ]).directive("oscObject", [ "ObjectDescriber", function(a) {
return {
restrict:"AC",
scope:{
resource:"=",
kind:"@"
},
link:function(b, c, d) {
$(c).on("click.oscobject", function(c) {
if (!($(c.target).closest("a").length > 0)) return b.resource ? (a.setObject(b.resource, b.kind || b.resource.kind, {
source:b
}), !1) :void 0;
}), $(c).on("mousemove.oscobject", function() {
if (b.resource || $(this).hasClass("osc-object-stacked")) return $(".osc-object-hover").not(this).removeClass("osc-object-hover"), $(this).addClass("osc-object-hover"), !1;
}), $(c).on("mouseleave.oscobject", function() {
(b.resource || $(this).hasClass("osc-object-stacked")) && $(this).removeClass("osc-object-hover");
});
var e = a.onResourceChanged(function(a, d) {
a && a.metadata && b.resource && b.resource.metadata && a.metadata.uid == b.resource.metadata.uid ? $(c).addClass("osc-object-active") :$(c).removeClass("osc-object-active");
});
b.$watch("resource", function(c, d) {
a.getSource() === b && a.setObject(b.resource, b.kind || b.resource.kind, {
source:b
});
}), b.$on("$destroy", function() {
a.removeResourceChangedCallback(e), a.getSource() === b && a.clearObject();
});
}
};
} ]).filter("isOscActiveObject", [ "ObjectDescriber", "uidFilter", function(a, b) {
return function(c) {
var d = a.getResource();
return b(c) === b(d);
};
} ]).service("ObjectDescriber", [ "$timeout", function(a) {
function b() {
this.resource = null, this.kind = null, this.source = null, this.callbacks = $.Callbacks();
}
return b.prototype.setObject = function(b, c, d) {
this.resource = b, this.kind = c, d = d || {}, this.source = d.source || null;
var e = this;
a(function() {
e.callbacks.fire(b, c);
}, 0);
}, b.prototype.clearObject = function() {
this.setObject(null, null);
}, b.prototype.getResource = function() {
return this.resource;
}, b.prototype.getSource = function() {
return this.source;
}, b.prototype.onResourceChanged = function(b) {
this.callbacks.add(b);
var c = this;
return this.resource && a(function() {
b(c.resource, c.kind);
}, 0), b;
}, b.prototype.removeResourceChangedCallback = function(a) {
this.callbacks.remove(a);
}, new b();
} ]), angular.module("openshiftConsole").directive("podMetrics", [ "$filter", "$interval", "$parse", "$timeout", "$q", "$rootScope", "ChartsService", "ConversionService", "MetricsCharts", "MetricsService", "ModalsService", "usageValueFilter", function(a, b, c, d, e, f, g, h, i, j, k, l) {
return {
restrict:"E",
scope:{
pod:"=",
includedMetrics:"=?",
stackDonut:"=?",
alerts:"=?"
},
templateUrl:"views/directives/pod-metrics.html",
link:function(m) {
function n(a) {
if (!m.pod) return null;
var b = m.options.selectedContainer;
switch (a) {
case "memory/usage":
var c = E(b);
if (c) return h.bytesToMiB(l(c));
break;

case "cpu/usage_rate":
var d = F(b);
if (d) return l(d);
}
return null;
}
function o(a) {
var b = _.head(a.datasets);
if (b.total) {
var c, e = {
type:"donut",
columns:[ [ "Used", b.used ], [ "Available", Math.max(b.available, 0) ] ],
colors:{
Used:b.available > 0 ? "#0088ce" :"#ec7a08",
Available:"#d1d1d1"
}
};
C[b.id] ? C[b.id].load(e) :(c = J(a), c.data = e, d(function() {
H || (C[b.id] = c3.generate(c));
}));
}
}
function p(a) {
var b = _.some(a.datasets, function(a) {
return !a.data;
});
if (!b) {
var c = {};
_.each(a.datasets, function(a) {
c[a.id] = a.data;
});
var e, f = i.getSparklineData(c), g = a.chartPrefix + "sparkline";
D[g] ? D[g].load(f) :(e = K(a), e.data = f, a.chartDataColors && (e.color = {
pattern:a.chartDataColors
}), d(function() {
H || (D[g] = c3.generate(e));
}));
}
}
function q() {
return "-" + m.options.timeRange.value + "mn";
}
function r() {
return 60 * m.options.timeRange.value * 1e3;
}
function s() {
return Math.floor(r() / G) + "ms";
}
function t(a, b, c) {
var d, e = {
metric:b.id,
type:b.type,
bucketDuration:s()
};
return b.data && b.data.length ? (d = _.last(b.data), e.start = d.end) :e.start = c, m.pod ? _.assign(e, {
namespace:m.pod.metadata.namespace,
pod:m.pod,
containerName:a.containerMetric ? m.options.selectedContainer.name :"pod"
}) :null;
}
function u() {
L = 0, _.each(m.metrics, function(a) {
p(a), o(a);
});
}
function v(a) {
if (!H) {
if (L++, m.noData) return void (m.metricsError = {
status:_.get(a, "status", 0),
details:_.get(a, "data.errorMsg") || _.get(a, "statusText") || "Status code " + _.get(a, "status", 0)
});
if (!(L < 2)) {
var b = "metrics-failed-" + m.uniqueID;
m.alerts[b] = {
type:"error",
message:"An error occurred updating metrics for pod " + _.get(m, "pod.metadata.name", "<unknown>") + ".",
links:[ {
href:"",
label:"Retry",
onClick:function() {
delete m.alerts[b], L = 1, A();
}
} ]
};
}
}
}
function w() {
return window.OPENSHIFT_CONSTANTS.DISABLE_CUSTOM_METRICS ? e.when({}) :j.getCustomMetrics(m.pod).then(function(a) {
angular.forEach(a, function(a) {
var b = a.description || a.name, c = a.unit || "";
m.metrics.push({
label:b,
units:c,
chartPrefix:"custom-" + _.uniqueId("custom-metric-"),
chartType:"spline",
datasets:[ {
id:"custom/" + a.name,
label:b,
type:a.type,
data:[]
} ]
});
});
});
}
function x() {
return !(m.metricsError || L > 1) && (m.pod && _.get(m, "options.selectedContainer"));
}
function y(a, b, c) {
b.total = n(b.id), b.total && (m.hasLimits = !0);
var d = _.get(c, "usage.value");
isNaN(d) && (d = 0), a.convert && (d = a.convert(d)), b.used = d3.round(d, a.usagePrecision), b.total && (b.available = d3.round(b.total - d, a.usagePrecision)), a.totalUsed += b.used;
}
function z(a, b) {
m.noData = !1;
var c = _.initial(b.data);
return a.data ? void (a.data = _.chain(a.data).takeRight(G).concat(c).value()) :void (a.data = c);
}
function A() {
if (x()) {
var a = q(), b = [];
angular.forEach(m.metrics, function(c) {
var d = [];
c.totalUsed = 0, angular.forEach(c.datasets, function(e) {
var f = t(c, e, a);
if (f) {
var g = j.get(f);
d.push(g);
var h = n(e.id);
h && b.push(j.getCurrentUsage(f).then(function(a) {
y(c, e, a);
}));
}
}), b = b.concat(d), e.all(d).then(function(a) {
H || angular.forEach(a, function(a) {
if (a) {
var b = _.find(c.datasets, {
id:a.metricID
});
z(b, a);
}
});
});
}), e.all(b).then(u, v)["finally"](function() {
m.loaded = !0;
});
}
}
m.includedMetrics = m.includedMetrics || [ "cpu", "memory", "network" ];
var B, C = {}, D = {}, E = c("resources.limits.memory"), F = c("resources.limits.cpu"), G = 30, H = !1;
m.uniqueID = i.uniqueID(), m.metrics = [], _.includes(m.includedMetrics, "memory") && m.metrics.push({
label:"Memory",
units:"MiB",
chartPrefix:"memory-",
convert:h.bytesToMiB,
containerMetric:!0,
datasets:[ {
id:"memory/usage",
label:"Memory",
data:[]
} ]
}), _.includes(m.includedMetrics, "cpu") && m.metrics.push({
label:"CPU",
units:"cores",
chartPrefix:"cpu-",
convert:h.millicoresToCores,
usagePrecision:3,
containerMetric:!0,
datasets:[ {
id:"cpu/usage_rate",
label:"CPU",
data:[]
} ]
}), _.includes(m.includedMetrics, "network") && m.metrics.push({
label:"Network",
units:"KiB/s",
chartPrefix:"network-",
chartType:"spline",
convert:h.bytesToKiB,
datasets:[ {
id:"network/tx_rate",
label:"Sent",
data:[]
}, {
id:"network/rx_rate",
label:"Received",
data:[]
} ]
}), m.loaded = !1, m.noData = !0, m.showComputeUnitsHelp = function() {
k.showComputeUnitsHelp();
}, j.getMetricsURL().then(function(a) {
m.metricsURL = a;
}), m.options = {
rangeOptions:i.getTimeRangeOptions()
}, m.options.timeRange = _.head(m.options.rangeOptions);
var I = a("upperFirst"), J = function(a) {
var b = "#" + a.chartPrefix + m.uniqueID + "-donut";
return {
bindto:b,
onrendered:function() {
g.updateDonutCenterText(b, a.datasets[0].used, I(a.units) + " Used");
},
donut:{
label:{
show:!1
},
width:10
},
legend:{
show:!1
},
size:{
height:175,
widht:175
}
};
}, K = function(a) {
var b = a.chartPrefix + m.uniqueID + "-sparkline", c = i.getDefaultSparklineConfig(b, a.units);
return 1 === a.datasets.length && _.set(c, "legend.show", !1), c;
}, L = 0;
w()["finally"](function() {
m.$watch("options", function() {
_.each(m.metrics, function(a) {
_.each(a.datasets, function(a) {
delete a.data;
});
}), delete m.metricsError, A();
}, !0), B = b(A, i.getDefaultUpdateInterval(), !1);
}), f.$on("metrics.charts.resize", function() {
i.redraw(C), i.redraw(D);
}), m.$on("$destroy", function() {
B && (b.cancel(B), B = null), angular.forEach(C, function(a) {
a.destroy();
}), C = null, angular.forEach(D, function(a) {
a.destroy();
}), D = null, H = !0;
});
}
};
} ]), angular.module("openshiftConsole").directive("deploymentMetrics", [ "$interval", "$parse", "$timeout", "$q", "$rootScope", "ChartsService", "ConversionService", "MetricsCharts", "MetricsService", "ModalsService", function(a, b, c, d, e, f, g, h, i, j) {
return {
restrict:"E",
scope:{
pods:"=",
containers:"=",
profile:"@",
alerts:"=?"
},
templateUrl:function(a, b) {
return "compact" === b.profile ? "views/directives/metrics-compact.html" :"views/directives/deployment-metrics.html";
},
link:function(b) {
function c(a) {
return null === a.value || void 0 === a.value;
}
function d(a) {
var b;
b = w ? a.compactDatasetLabel || a.label :"Average Usage";
var d = {}, e = [ "Date" ], f = [ b ], g = [ e, f ], h = function(a) {
var b = "" + a.start;
return d[b] || (d[b] = {
total:0,
count:0
}), d[b];
};
return _.each(A[a.descriptor], function(a) {
_.each(a, function(a) {
var b = h(a);
(!y || y < a.end) && (y = a.end), c(a) || (b.total += a.value, b.count = b.count + 1);
});
}), _.each(d, function(b, c) {
var d;
d = b.count ? b.total / b.count :null, e.push(Number(c)), f.push(a.convert ? a.convert(d) :d);
}), f.length > 1 && (a.lastValue = _.last(f) || 0), g;
}
function f(a, e) {
var f = [], g = {
type:"spline"
};
return b.showAverage ? (_.each(a[e.descriptor], function(a, b) {
r(e.descriptor, b, a);
}), g.type = "area-spline", w && e.compactType && (g.type = e.compactType), g.x = "Date", g.columns = d(e), g) :(_.each(a[e.descriptor], function(a, b) {
r(e.descriptor, b, a);
var d = b + "-dates";
_.set(g, [ "xs", b ], d);
var h = [ d ], i = [ b ];
f.push(h), f.push(i), _.each(A[e.descriptor][b], function(a) {
if (h.push(a.start), (!y || y < a.end) && (y = a.end), c(a)) i.push(a.value); else {
var b = e.convert ? e.convert(a.value) :a.value;
i.push(b);
}
});
}), g.columns = _.sortBy(f, function(a) {
return a[0];
}), g);
}
function k(a) {
x || (E = 0, b.showAverage = _.size(b.pods) > 5 || w, _.each(b.metrics, function(c) {
var d, e = f(a, c), g = c.descriptor;
w && c.compactCombineWith && (g = c.compactCombineWith, c.lastValue && (D[g].lastValue = (D[g].lastValue || 0) + c.lastValue)), u[g] ? (u[g].load(e), b.showAverage ? u[g].legend.hide() :u[g].legend.show()) :(d = F(c), d.data = e, u[g] = c3.generate(d));
}));
}
function l() {
return w ? "-15mn" :"-" + b.options.timeRange.value + "mn";
}
function m() {
return 60 * b.options.timeRange.value * 1e3;
}
function n() {
return w ? "1mn" :Math.floor(m() / v) + "ms";
}
function o() {
var a = _.find(b.pods, "metadata.namespace");
if (a) {
var c = {
pods:b.pods,
containerName:b.options.selectedContainer.name,
namespace:a.metadata.namespace,
bucketDuration:n()
};
return y ? c.start = y :c.start = l(), c;
}
}
function p(a) {
if (!x) {
if (E++, b.noData) return void (b.metricsError = {
status:_.get(a, "status", 0),
details:_.get(a, "data.errorMsg") || _.get(a, "statusText") || "Status code " + _.get(a, "status", 0)
});
if (!(E < 2)) {
var c = "metrics-failed-" + b.uniqueID;
b.alerts[c] = {
type:"error",
message:"An error occurred updating metrics.",
links:[ {
href:"",
label:"Retry",
onClick:function() {
delete b.alerts[c], E = 1, s();
}
} ]
};
}
}
}
function q() {
var a = _.isEmpty(b.pods);
return a ? (b.loaded = !0, !1) :!b.metricsError && E < 2;
}
function r(a, c, d) {
b.noData = !1;
var e = _.initial(d), f = _.get(A, [ a, c ]);
if (!f) return void _.set(A, [ a, c ], e);
var g = _.takeRight(f.concat(e), v);
_.set(A, [ a, c ], g);
}
function s() {
if (!B && q()) {
z = Date.now();
var a = o();
i.getPodMetrics(a).then(k, p)["finally"](function() {
b.loaded = !0;
});
}
}
var t, u = {}, v = 30, w = "compact" === b.profile, x = !1;
b.uniqueID = h.uniqueID();
var y, z, A = {}, B = w, C = function(a) {
return a >= 1024;
};
b.metrics = [ {
label:"Memory",
units:"MiB",
convert:g.bytesToMiB,
formatUsage:function(a) {
return C(a) && (a /= 1024), h.formatUsage(a);
},
usageUnits:function(a) {
return C(a) ? "GiB" :"MiB";
},
descriptor:"memory/usage",
type:"pod_container",
chartID:"memory-" + b.uniqueID
}, {
label:"CPU",
units:"cores",
convert:g.millicoresToCores,
formatUsage:h.formatUsage,
usageUnits:function() {
return "cores";
},
descriptor:"cpu/usage_rate",
type:"pod_container",
chartID:"cpu-" + b.uniqueID
}, {
label:"Network (Sent)",
units:"KiB/s",
convert:g.bytesToKiB,
formatUsage:h.formatUsage,
usageUnits:function() {
return "KiB/s";
},
descriptor:"network/tx_rate",
type:"pod",
compactLabel:"Network",
compactDatasetLabel:"Sent",
compactType:"spline",
chartID:"network-tx-" + b.uniqueID
}, {
label:"Network (Received)",
units:"KiB/s",
convert:g.bytesToKiB,
formatUsage:h.formatUsage,
usageUnits:function() {
return "KiB/s";
},
descriptor:"network/rx_rate",
type:"pod",
compactCombineWith:"network/tx_rate",
compactDatasetLabel:"Received",
compactType:"spline",
chartID:"network-rx-" + b.uniqueID
} ];
var D = _.indexBy(b.metrics, "descriptor");
b.loaded = !1, b.noData = !0, b.showComputeUnitsHelp = function() {
j.showComputeUnitsHelp();
};
var E = 0;
i.getMetricsURL().then(function(a) {
b.metricsURL = a;
}), b.options = {
rangeOptions:h.getTimeRangeOptions()
}, b.options.timeRange = _.head(b.options.rangeOptions), b.options.selectedContainer = _.head(b.containers);
var F = function(a) {
var c = h.getDefaultSparklineConfig(a.chartID, a.units, w);
return _.set(c, "legend.show", !w && !b.showAverage), c;
};
b.$watch("options", function() {
A = {}, y = null, delete b.metricsError, s();
}, !0), t = a(s, h.getDefaultUpdateInterval(), !1), b.updateInView = function(a) {
B = !a, a && (!z || Date.now() > z + h.getDefaultUpdateInterval()) && s();
}, e.$on("metrics.charts.resize", function() {
h.redraw(u);
}), b.$on("$destroy", function() {
t && (a.cancel(t), t = null), angular.forEach(u, function(a) {
a.destroy();
}), u = null, x = !0;
});
}
};
} ]), angular.module("openshiftConsole").directive("logViewer", [ "$sce", "$timeout", "$window", "$filter", "$q", "AuthService", "APIService", "APIDiscovery", "DataService", "HTMLService", "ModalsService", "logLinks", "BREAKPOINTS", function(a, b, c, d, e, f, g, h, i, j, k, l, m) {
var n = $(window), o = $('<tr class="log-line"><td class="log-line-number"></td><td class="log-line-text"></td></tr>').get(0), p = function(a, b) {
var c = o.cloneNode(!0);
c.firstChild.setAttribute("data-line-number", a);
var d = ansi_up.escape_for_html(b), e = ansi_up.ansi_to_html(d), f = j.linkify(e, "_blank", !0);
return c.lastChild.innerHTML = f, c;
};
return {
restrict:"AE",
transclude:!0,
templateUrl:"views/directives/logs/_log-viewer.html",
scope:{
followAffixTop:"=?",
object:"=",
fullLogUrl:"=?",
name:"=",
context:"=",
options:"=?",
fixedHeight:"=?",
chromeless:"=?",
empty:"=?",
run:"=?"
},
controller:[ "$scope", function(b) {
var j, k, o, q, r, s = document.documentElement;
b.logViewerID = _.uniqueId("log-viewer"), b.empty = !0;
var t, u;
"ReplicationController" === b.object.kind ? (t = "deploymentconfigs/log", u = d("annotation")(b.object, "deploymentConfig")) :(t = g.kindToResource(b.object.kind) + "/log", u = b.object.metadata.name);
var v = function() {
q = window.innerWidth < m.screenSmMin && !b.fixedHeight ? null :k;
}, w = function() {
b.$apply(function() {
var a = j.getBoundingClientRect();
b.fixedHeight ? b.showScrollLinks = a && a.height > b.fixedHeight :b.showScrollLinks = a && (a.top < 0 || a.bottom > s.clientHeight);
});
}, x = !1, y = function() {
x ? x = !1 :b.$evalAsync(function() {
b.autoScrollActive = !1;
});
}, z = function() {
o.off("scroll", y), n.off("scroll", y), window.innerWidth <= m.screenSmMin && !b.fixedHeight ? n.on("scroll", y) :o.on("scroll", y);
}, A = function() {
b.fixedHeight || (window.innerWidth < m.screenSmMin && !b.fixedHeight ? r.removeClass("target-logger-node").affix({
target:window,
offset:{
top:b.followAffixTop || 0
}
}) :r.addClass("target-logger-node").affix({
target:o,
offset:{
top:b.followAffixTop || 0
}
}));
}, B = function(a) {
var c = $("#" + b.logViewerID + " .log-view-output"), d = c.offset().top;
if (!(d < 0)) {
var e = $(".ellipsis-pulser").outerHeight(!0), f = b.fixedHeight ? b.fixedHeight :Math.floor($(window).height() - d - e);
b.chromeless || b.fixedHeight || (f -= 40), a ? c.animate({
"min-height":f + "px"
}, "fast") :c.css("min-height", f + "px"), b.fixedHeight && c.css("max-height", f);
}
}, C = _.debounce(function() {
B(!0), v(), z(), w(), A(), y();
}, 100);
n.on("resize", C);
var D, E = function() {
x = !0, l.scrollBottom(q);
}, F = function() {
b.autoScrollActive = !b.autoScrollActive, b.autoScrollActive && E();
}, G = document.createDocumentFragment(), H = _.debounce(function() {
j.appendChild(G), G = document.createDocumentFragment(), b.autoScrollActive && E(), b.showScrollLinks || w();
}, 100, {
maxWait:300
}), I = function(a) {
var b = e.defer();
return D ? (D.onClose(function() {
b.resolve();
}), D.stop()) :b.resolve(), a || (H.cancel(), j && (j.innerHTML = ""), G = document.createDocumentFragment()), b.promise;
}, J = function() {
I().then(function() {
b.$evalAsync(function() {
if (b.run) {
angular.extend(b, {
loading:!0,
autoScrollActive:!0,
largeLog:!1,
limitReached:!1,
showScrollLinks:!1,
state:""
});
var a = angular.extend({
follow:!0,
tailLines:5e3,
limitBytes:10485760
}, b.options);
D = i.createStream(t, u, b.context, a);
var c = 0, d = function(a) {
c++, G.appendChild(p(c, a)), H();
};
D.onMessage(function(e, f, g) {
b.$evalAsync(function() {
b.empty = !1, "logs" !== b.state && (b.state = "logs", setTimeout(B));
}), e && (a.limitBytes && g >= a.limitBytes && (b.$evalAsync(function() {
b.limitReached = !0, b.loading = !1;
}), I(!0)), d(e), !b.largeLog && c >= a.tailLines && b.$evalAsync(function() {
b.largeLog = !0;
}));
}), D.onClose(function() {
D = null, b.$evalAsync(function() {
b.loading = !1, b.autoScrollActive = !1, 0 !== c || b.emptyStateMessage || (b.state = "empty", b.emptyStateMessage = "The logs are no longer available or could not be loaded.");
});
}), D.onError(function() {
D = null, b.$evalAsync(function() {
angular.extend(b, {
loading:!1,
autoScrollActive:!1
}), 0 === c ? (b.state = "empty", b.emptyStateMessage = "The logs are no longer available or could not be loaded.") :b.errorWhileRunning = !0;
});
}), D.start();
}
});
});
};
return h.getLoggingURL().then(function(d) {
var e = _.get(b.context, "project.metadata.name"), g = _.get(b.options, "container");
e && g && u && d && (angular.extend(b, {
kibanaAuthUrl:a.trustAsResourceUrl(URI(d).segment("auth").segment("token").normalizePathname().toString()),
access_token:f.UserStore().getToken()
}), b.$watchGroup([ "context.project.metadata.name", "options.container", "name" ], function() {
angular.extend(b, {
kibanaArchiveUrl:a.trustAsResourceUrl(l.archiveUri({
namespace:b.context.project.metadata.name,
namespaceUid:b.context.project.metadata.uid,
podname:u,
containername:b.options.container,
backlink:URI.encode(c.location.href)
}))
});
}));
}), this.cacheScrollableNode = function(a) {
k = a, o = $(k);
}, this.cacheLogNode = function(a) {
j = a;
}, this.cacheAffixable = function(a) {
r = $(a);
}, this.start = function() {
v(), z(), A();
}, angular.extend(b, {
ready:!0,
loading:!0,
autoScrollActive:!0,
state:!1,
onScrollBottom:function() {
l.scrollBottom(q);
},
onScrollTop:function() {
b.autoScrollActive = !1, l.scrollTop(q);
},
toggleAutoScroll:F,
goChromeless:l.chromelessLink,
restartLogs:J
}), b.$on("$destroy", function() {
I(), n.off("resize", C), n.off("scroll", y), o.off("scroll", y);
}), "deploymentconfigs/logs" !== t || u ? void b.$watchGroup([ "name", "options.container", "run" ], J) :(b.state = "empty", void (b.emptyStateMessage = "Logs are not available for this replication controller because it was not generated from a deployment configuration."));
} ],
require:"logViewer",
link:function(a, c, d, e) {
b(function() {
e.cacheScrollableNode(document.getElementById(a.fixedHeight ? a.logViewerID + "-fixed-scrollable" :"container-main")), e.cacheLogNode(document.getElementById(a.logViewerID + "-logContent")), e.cacheAffixable(document.getElementById(a.logViewerID + "-affixedFollow")), e.start();
}, 0);
var f = function() {
var b = $(c).find(".log-line-text").text(), d = _.get(a, "object.metadata.name", "openshift") + ".log", e = new Blob([ b ], {
type:"text/plain;charset=utf-8"
});
saveAs(e, d);
};
a.canSave = !!new Blob(), a.saveLog = function() {
return a.largeLog ? void k.confirmSaveLog(a.object).then(f) :void f();
};
}
};
} ]), angular.module("openshiftConsole").directive("statusIcon", function() {
return {
restrict:"E",
templateUrl:"views/directives/_status-icon.html",
scope:{
status:"=",
disableAnimation:"@"
},
link:function(a, b, c) {
a.spinning = !angular.isDefined(c.disableAnimation);
}
};
}), angular.module("openshiftConsole").directive("ellipsisPulser", [ function() {
return {
restrict:"E",
scope:{
color:"@",
display:"@",
size:"@",
msg:"@"
},
templateUrl:"views/directives/_ellipsis-pulser.html"
};
} ]), angular.module("openshiftConsole").directive("podDonut", [ "$timeout", "isPullingImageFilter", "isTerminatingFilter", "podWarningsFilter", "numContainersReadyFilter", "Logger", "ChartsService", function(a, b, c, d, e, f, g) {
return {
restrict:"E",
scope:{
pods:"=",
desired:"=?",
idled:"=?"
},
templateUrl:"views/directives/pod-donut.html",
link:function(a, f) {
function h() {
var b, c = _.reject(a.pods, {
status:{
phase:"Failed"
}
}), d = _.size(c);
b = angular.isNumber(a.desired) && a.desired !== d ? "scaling to " + a.desired + "..." :1 === d ? "pod" :"pods", a.idled ? g.updateDonutCenterText(f[0], "Idle") :g.updateDonutCenterText(f[0], d, b);
}
function i(b) {
var c = {
columns:[]
};
angular.forEach(o, function(a) {
c.columns.push([ a, b[a] || 0 ]);
}), _.isEmpty(b) ? c.columns.push([ "Empty", 1 ]) :c.unload = "Empty", m ? m.load(c) :(n.data.columns = c.columns, m = c3.generate(n)), a.podStatusData = c.columns;
}
function j(a) {
var b = e(a), c = a.spec.containers.length;
return b === c;
}
function k(a) {
if (c(a)) return "Terminating";
var e = d(a);
return _.some(e, {
severity:"error"
}) ? "Error" :_.isEmpty(e) ? b(a) ? "Pulling" :"Running" !== a.status.phase || j(a) ? _.get(a, "status.phase", "Unknown") :"Not Ready" :"Warning";
}
function l() {
var b = {};
return angular.forEach(a.pods, function(a) {
var c = k(a);
b[c] = (b[c] || 0) + 1;
}), b;
}
var m, n, o = [ "Running", "Not Ready", "Warning", "Error", "Pulling", "Pending", "Succeeded", "Terminating", "Unknown" ];
a.chartId = _.uniqueId("pods-donut-chart-"), n = {
type:"donut",
bindto:"#" + a.chartId,
donut:{
expand:!1,
label:{
show:!1
},
width:10
},
size:{
height:150,
width:150
},
legend:{
show:!1
},
onrendered:h,
tooltip:{
format:{
value:function(a, b, c) {
if (a && "Empty" !== c) return a;
}
}
},
transition:{
duration:350
},
data:{
type:"donut",
groups:[ o ],
order:null,
colors:{
Empty:"#ffffff",
Running:"#00b9e4",
"Not Ready":"#beedf9",
Warning:"#f39d3c",
Error:"#d9534f",
Pulling:"#d1d1d1",
Pending:"#ededed",
Succeeded:"#3f9c35",
Terminating:"#00659c",
Unknown:"#f9d67a"
},
selection:{
enabled:!1
}
}
};
var p = _.debounce(i, 350, {
maxWait:500
});
a.$watch(l, p, !0), a.$watchGroup([ "desired", "idled" ], h), a.$on("destroy", function() {
m && (m = m.destroy());
});
}
};
} ]), angular.module("openshiftConsole").directive("routeServicePie", function() {
return {
restrict:"E",
scope:{
route:"="
},
template:'<div ng-show="totalWeight" ng-attr-id="{{chartId}}"></div>',
link:function(a) {
function b() {
var b = {
columns:[]
};
a.route && (b.columns.push(f(a.route.spec.to)), a.totalWeight = a.route.spec.to.weight, _.each(a.route.spec.alternateBackends, function(c) {
b.columns.push(f(c)), a.totalWeight += c.weight;
})), a.totalWeight && (c ? (h(b), c.load(b)) :(d.data.columns = b.columns, c = c3.generate(d)), e = b);
}
var c, d;
a.chartId = _.uniqueId("route-service-chart-"), d = {
bindto:"#" + a.chartId,
color:{
pattern:[ $.pfPaletteColors.blue, $.pfPaletteColors.orange, $.pfPaletteColors.green, $.pfPaletteColors.red ]
},
legend:{
show:!0,
position:"right"
},
pie:{
label:{
show:!1
}
},
size:{
height:115,
width:260
},
data:{
type:"pie",
order:null,
selection:{
enabled:!1
}
}
};
var e, f = function(a) {
return [ a.name, a.weight ];
}, g = function(a) {
return _.head(a);
}, h = function(a) {
var b = {};
_.each(a.columns, function(a) {
var c = g(a);
b[c] = !0;
});
var c = _.get(e, "columns", []);
a.unload = _.chain(c).reject(function(a) {
var c = g(a);
return _.has(b, [ c ]);
}).map(g).value();
};
a.$watch("route", b), a.$on("destroy", function() {
c && (c = c.destroy());
});
}
};
}), angular.module("openshiftConsole").directive("deploymentDonut", [ "$filter", "$location", "$timeout", "$uibModal", "DeploymentsService", "HPAService", "QuotaService", "LabelFilter", "Navigate", "hashSizeFilter", "hasDeploymentConfigFilter", function(a, b, c, d, e, f, g, h, i, j, k) {
return {
restrict:"E",
scope:{
rc:"=",
deploymentConfig:"=",
deployment:"=",
scalable:"=",
hpa:"=?",
limitRanges:"=",
quotas:"=",
clusterQuotas:"=",
project:"=",
pods:"=",
alerts:"="
},
templateUrl:"views/directives/deployment-donut.html",
controller:[ "$scope", function(b) {
var c = !1;
b.$watch("rc.spec.replicas", function() {
c || (b.desiredReplicas = null);
});
var h = function() {
f.getHPAWarnings(b.rc, b.hpa, b.limitRanges, b.project).then(function(a) {
b.hpaWarnings = _.map(a, function(a) {
return _.escape(a.message);
}).join("<br>");
});
};
b.$watchGroup([ "limitRanges", "hpa", "project" ], h), b.$watch("rc.spec.template.spec.containers", h, !0);
var l = function() {
if (_.get(b.rc, "spec.replicas", 1) > _.get(b.rc, "status.replicas", 0)) {
var a = g.filterQuotasForResource(b.rc, b.quotas), c = g.filterQuotasForResource(b.rc, b.clusterQuotas), d = function(a) {
return !!g.getResourceLimitAlerts(b.rc, a).length;
};
b.showQuotaWarning = _.some(a, d) || _.some(c, d);
} else b.showQuotaWarning = !1;
};
b.$watchGroup([ "rc.spec.replicas", "rc.status.replicas", "quotas", "clusterQuotas" ], l);
var m = function(c) {
b.alerts = b.alerts || {}, b.desiredReplicas = null, b.alerts.scale = {
type:"error",
message:"An error occurred scaling the deployment.",
details:a("getErrorDetails")(c)
};
}, n = function() {
return b.deploymentConfig || b.deployment || b.rc;
}, o = function() {
if (c = !1, angular.isNumber(b.desiredReplicas)) {
var a = n();
return e.scale(a, b.desiredReplicas).then(_.noop, m);
}
}, p = _.debounce(o, 650);
b.viewPodsForDeployment = function(a) {
0 !== j(b.pods) && (1 === j(b.pods) ? i.toResourceURL(_.sample(b.pods)) :i.toPodsForDeployment(a));
}, b.scaleUp = function() {
b.scalable && (b.desiredReplicas = b.getDesiredReplicas(), b.desiredReplicas++, p(), c = !0);
}, b.scaleDown = function() {
if (b.scalable && (b.desiredReplicas = b.getDesiredReplicas(), 0 !== b.desiredReplicas)) {
if (1 === b.desiredReplicas) {
var a = d.open({
animation:!0,
templateUrl:"views/modals/confirmScale.html",
controller:"ConfirmScaleController",
resolve:{
resource:function() {
return b.rc;
},
type:function() {
return k(b.rc) ? "deployment" :"replication controller";
}
}
});
return void a.result.then(function() {
b.desiredReplicas = b.getDesiredReplicas() - 1, p(), c = !0;
});
}
b.desiredReplicas--, p();
}
}, b.getDesiredReplicas = function() {
return angular.isDefined(b.desiredReplicas) && null !== b.desiredReplicas ? b.desiredReplicas :b.rc && b.rc.spec && angular.isDefined(b.rc.spec.replicas) ? b.rc.spec.replicas :1;
}, b.$watch(function() {
return !_.get(b.rc, "spec.replicas") && !!(b.deploymentConfig ? a("annotation")(b.deploymentConfig, "idledAt") :a("annotation")(b.rc, "idledAt"));
}, function(a) {
b.isIdled = !!a;
}), b.unIdle = function() {
b.desiredReplicas = a("unidleTargetReplicas")(b.deploymentConfig || b.rc, b.hpa), o().then(function() {
b.isIdled = !1;
}, m);
};
} ]
};
} ]), angular.module("openshiftConsole").directive("quotaUsageChart", [ "$filter", "ChartsService", function(a, b) {
return {
restrict:"E",
scope:{
used:"=",
crossProjectUsed:"=?",
total:"=",
type:"@",
height:"=?",
width:"=?"
},
replace:!0,
templateUrl:"views/_quota-usage-chart.html",
link:function(c, d) {
function e() {
var a = _.spread(function(a, c) {
b.updateDonutCenterText(d[0], a, c);
});
a(h(c.total, c.type, !0));
}
var f = a("usageValue"), g = a("usageWithUnits"), h = a("amountAndUnit");
c.height = c.height || 200, c.width = c.width || 175;
var i = function(a) {
return a ? (100 * Number(a)).toFixed(1) + "%" :"0%";
};
c.chartID = _.uniqueId("quota-usage-chart-");
var j, k = {
type:"donut",
bindto:"#" + c.chartID,
donut:{
label:{
show:!1
},
width:10
},
size:{
height:c.height,
width:c.width
},
legend:{
show:!0,
position:c.legendPosition || "bottom",
item:{
onclick:_.noop
}
},
onrendered:e,
tooltip:{
position:function() {
return {
top:0,
left:0
};
},
contents:function(a, b, d, e) {
var h = $('<table class="c3-tooltip"></table>').css({
width:c.width + "px"
}), j = $("<tr/>").appendTo(h), k = $('<td class="name nowrap"></td>').appendTo(j);
$("<span/>").css({
"background-color":e(a[0].id)
}).appendTo(k), $("<span/>").text(a[0].name).appendTo(k);
var l;
l = c.total ? i(a[0].value / f(c.total)) + " of " + g(c.total, c.type) :g(c.used, c.type);
var m = $("<tr/>").appendTo(h);
return $('<td class="value" style="text-align: left;"></td>').text(l).appendTo(m), h.get(0).outerHTML;
}
},
data:{
type:"donut",
order:null
}
}, l = function() {
var a = void 0 !== c.crossProjectUsed, b = f(c.used) || 0, d = Math.max((f(c.crossProjectUsed) || 0) - b, 0), e = Math.max(f(c.total) - (d + b), 0), g = {
columns:[ [ "used", b ], [ "available", e ] ],
colors:{
used:e ? "#0088ce" :"#ec7a08",
other:e ? "#7dc3e8" :"#f7bd7f",
available:"#d1d1d1"
},
names:{
used:a ? "Used - This Project" :"Used",
other:"Used - Other Projects",
available:"Available"
}
};
a && g.columns.splice(1, 0, [ "other", d ]), j ? j.load(g) :(_.assign(k.data, g), j = c3.generate(k));
};
c.$watchGroup([ "used", "total", "crossProjectUsed" ], _.debounce(l, 300));
}
};
} ]), angular.module("openshiftConsole").directive("buildTrendsChart", [ "$filter", "$location", "$rootScope", "$timeout", "BuildsService", function(a, b, c, d, e) {
return {
restrict:"E",
scope:{
builds:"="
},
templateUrl:"views/_build-trends-chart.html",
link:function(f) {
var g, h = [ "Complete", "Failed", "Cancelled", "Error" ];
f.minBuilds = _.constant(4);
var i = function(a) {
var b = [], c = moment.duration(a), d = Math.floor(c.asHours()), e = c.minutes(), f = c.seconds();
return d || e || f ? (d && b.push(d + "h"), e && b.push(e + "m"), d || b.push(f + "s"), b.join(" ")) :"";
};
f.chartID = _.uniqueId("build-trends-chart-");
var j, k, l = _.constant(350), m = {
bindto:"#" + f.chartID,
padding:{
right:30,
left:80
},
axis:{
x:{
fit:!0,
label:{
text:"Build Number",
position:"outer-right"
},
tick:{
culling:!0,
format:function(a) {
return "#" + g.json[a].buildNumber;
},
width:30
},
type:"category"
},
y:{
label:{
text:"Duration",
position:"outer-top"
},
min:0,
padding:{
bottom:0
},
tick:{
format:i
}
}
},
bar:{
width:{
max:50
}
},
legend:{
item:{
onclick:_.noop
}
},
size:{
height:250
},
tooltip:{
format:{
title:function(a) {
var b = g.json[a], c = e.getStartTimestsamp(b.build);
return "#" + b.buildNumber + " (" + moment(c).fromNow() + ")";
}
}
},
transition:{
duration:l()
},
data:{
colors:{
Cancelled:"#d1d1d1",
Complete:"#00b9e4",
Error:"#393f44",
Failed:"#cc0000"
},
empty:{
label:{
text:"No Completed Builds"
}
},
onclick:function(d) {
var e = g.json[d.x].build, f = a("navigateResourceURL")(e);
f && c.$apply(function() {
b.path(f);
});
},
selection:{
enabled:!0
},
type:"bar"
}
}, n = function() {
f.completeBuilds = [];
var b = a("isIncompleteBuild");
angular.forEach(f.builds, function(a) {
b(a) || f.completeBuilds.push(a);
});
}, o = function() {
return n(), f.completeBuilds.length;
}, p = !1, q = function() {
k && p ? j.ygrids([ {
value:k,
"class":"build-trends-avg-line"
} ]) :j.ygrids.remove();
};
f.toggleAvgLine = function() {
p = !p, q();
};
var r = function() {
g = {
json:[],
keys:{
x:"buildNumber"
}
};
var a = 0, b = 0;
angular.forEach(f.completeBuilds, function(c) {
var d = e.getBuildNumber(c);
if (d) {
var f = e.getDuration(c);
a += f, b++;
var h = {
buildNumber:d,
phase:c.status.phase,
build:c
};
h[c.status.phase] = f, g.json.push(h);
}
}), g.json.sort(function(a, b) {
return a.buildNumber - b.buildNumber;
}), g.json.length > 50 && (g.json = g.json.slice(g.json.length - 50));
var c = {};
angular.forEach(g.json, function(a) {
c[a.phase] = !0;
}), b ? (k = a / b, f.averageDurationText = i(k)) :(k = null, f.averageDurationText = null);
var n = [], o = [];
angular.forEach(h, function(a) {
c[a] ? n.push(a) :o.push(a);
}), g.keys.value = n, g.groups = [ n ], j ? (g.unload = o, g.done = function() {
setTimeout(function() {
j.flush();
}, l() + 25);
}, j.load(g), q()) :(m.data = angular.extend(g, m.data), d(function() {
j = c3.generate(m), q();
}));
};
f.$watch(o, r), f.$on("destroy", function() {
j && (j = j.destroy());
});
}
};
} ]), angular.module("openshiftConsole").directive("computeResource", [ "$filter", function(a) {
return {
restrict:"E",
require:"ngModel",
scope:{
label:"@",
type:"@",
description:"@",
defaultValue:"=",
limitRangeMin:"=",
limitRangeMax:"=",
maxLimitRequestRatio:"=",
request:"="
},
templateUrl:"views/_compute-resource.html",
link:function(b, c, d, e) {
var f = a("usageValue"), g = a("amountAndUnit"), h = a("humanizeUnit");
b.id = _.uniqueId("compute-resource-"), b.input = {};
var i = function(a) {
_.some(b.units, {
value:a
}) || b.units.push({
value:a,
label:h(a, b.type)
});
};
switch (b.$watch("defaultValue", function(a) {
var c = _.spread(function(a, c) {
b.placeholder = a, i(c), b.input.amount || (b.input.unit = c);
});
a && c(g(a, b.type));
}), b.type) {
case "cpu":
b.input.unit = "m", b.units = [ {
value:"m",
label:"millicores"
}, {
value:"",
label:"cores"
} ];
break;

case "memory":
b.input.unit = "Mi", b.units = [ {
value:"Mi",
label:"MiB"
}, {
value:"Gi",
label:"GiB"
}, {
value:"M",
label:"MB"
}, {
value:"G",
label:"GB"
} ];
}
b.groupUnits = function(a) {
switch (a.value) {
case "Mi":
case "Gi":
return "Binary Units";

case "M":
case "G":
return "Decimal Units";
}
return "";
};
var j = function() {
var a = b.input.amount && f(b.input.amount + b.input.unit), c = b.limitRangeMin && f(b.limitRangeMin), d = b.limitRangeMax && f(b.limitRangeMax), e = !0, g = !0;
a && c && (e = a >= c), a && d && (g = a <= d), b.form.amount.$setValidity("limitRangeMin", e), b.form.amount.$setValidity("limitRangeMax", g);
}, k = function() {
var a, c = b.request && f(b.request), d = !0, e = !0;
b.input.amount ? a = f(b.input.amount + b.input.unit) :b.defaultValue && (a = f(b.defaultValue)), c && a && (d = a >= c, b.maxLimitRequestRatio && (e = a / c <= b.maxLimitRequestRatio)), c && !a && b.maxLimitRequestRatio && (e = !1), b.form.amount.$setValidity("limitLargerThanRequest", d), b.form.amount.$setValidity("limitWithinRatio", e);
};
e.$render = function() {
var a = _.spread(function(a, c) {
a ? (b.input.amount = Number(a), b.input.unit = c, i(c)) :b.input.amount = null;
});
a(g(e.$viewValue, b.type));
}, b.$watchGroup([ "input.amount", "input.unit" ], function() {
j(), k(), b.input.amount ? e.$setViewValue(b.input.amount + b.input.unit) :e.$setViewValue(void 0);
}), b.$watchGroup([ "limitRangeMin", "limitRangeMax" ], j), b.$watch("request", k);
}
};
} ]).directive("editRequestLimit", [ "$filter", "LimitRangesService", "ModalsService", function(a, b, c) {
return {
restrict:"E",
scope:{
resources:"=",
type:"@",
limitRanges:"=",
project:"="
},
templateUrl:"views/_edit-request-limit.html",
link:function(a) {
a.showComputeUnitsHelp = function() {
c.showComputeUnitsHelp();
}, a.$watch("limitRanges", function() {
a.limits = b.getEffectiveLimitRange(a.limitRanges, a.type, "Container", a.project), a.requestCalculated = b.isRequestCalculated(a.type, a.project), a.limitCalculated = b.isLimitCalculated(a.type, a.project);
}, !0);
}
};
} ]), angular.module("openshiftConsole").directive("editProbe", function() {
return {
restrict:"E",
scope:{
probe:"=",
exposedPorts:"="
},
templateUrl:"views/directives/_edit-probe.html",
link:function(a) {
a.id = _.uniqueId("edit-probe-"), a.probe = a.probe || {}, a.types = [ {
id:"httpGet",
label:"HTTP GET"
}, {
id:"exec",
label:"Container Command"
}, {
id:"tcpSocket",
label:"TCP Socket"
} ], a.previousProbes = {}, a.tcpPorts = _.filter(a.exposedPorts, {
protocol:"TCP"
});
var b = _.get(a, "probe.httpGet.port") || _.get(a, "probe.exec.port");
b && !_.some(a.tcpPorts, {
containerPort:b
}) && (a.tcpPorts = [ {
containerPort:b,
protocol:"TCP"
} ].concat(a.tcpPorts)), a.portOptions = a.tcpPorts;
var c, d = function(b, c) {
if (a.probe = a.probe || {}, a.previousProbes[c] = a.probe[c], delete a.probe[c], a.probe[b] = a.previousProbes[b], !a.probe[b]) switch (b) {
case "httpGet":
case "tcpSocket":
var d = _.head(a.tcpPorts);
a.probe[b] = {
port:d ? d.containerPort :""
};
break;

case "exec":
a.probe = {
exec:{
command:[]
}
};
}
};
a.probe.httpGet ? c = "httpGet" :a.probe.exec ? c = "exec" :a.probe.tcpSocket ? c = "tcpSocket" :(c = "httpGet", d("httpGet")), _.set(a, "selected.type", c), a.$watch("selected.type", function(a, b) {
a !== b && d(a, b);
}), a.refreshPorts = function(b) {
if (/^\d+$/.test(b)) {
var c = a.tcpPorts;
b = parseInt(b, 10), b && !_.some(c, {
containerPort:b
}) && (c = [ {
containerPort:b,
protocol:"TCP"
} ].concat(c)), a.portOptions = _.uniq(c);
}
};
}
};
}), angular.module("openshiftConsole").directive("editCommand", [ "$filter", function(a) {
return {
restrict:"E",
scope:{
args:"=",
type:"@",
placeholder:"@",
description:"=",
isRequired:"="
},
templateUrl:"views/directives/_edit-command.html",
link:function(b) {
b.id = _.uniqueId("edit-command-"), b.input = {};
var c, d, e = a("isMultiline");
b.$watch("args", function() {
return d ? void (d = !1) :void (_.isEmpty(b.args) || (b.input.args = _.map(b.args, function(a) {
return {
value:a,
multiline:e(a)
};
}), c = !0));
}, !0), b.$watch("input.args", function(a, e) {
return c ? void (c = !1) :void (a !== e && (d = !0, b.args = _.map(b.input.args, function(a) {
return a.value;
}), b.form.command.$setDirty()));
}, !0), b.addArg = function() {
b.nextArg && (b.input.args = b.input.args || [], b.input.args.push({
value:b.nextArg,
multiline:e(b.nextArg)
}), b.nextArg = "");
}, b.removeArg = function(a) {
b.input.args.splice(a, 1), _.isEmpty(b.input.args) && (b.input.args = null);
}, b.clear = function() {
b.input.args = null;
};
}
};
} ]), angular.module("openshiftConsole").directive("buildPipeline", [ "$filter", "Logger", function(a, b) {
return {
restrict:"E",
scope:{
build:"=",
expandOnlyRunning:"=?",
buildConfigNameOnExpanded:"=?"
},
replace:!0,
templateUrl:"views/directives/build-pipeline.html",
link:function(c) {
var d = a("annotation");
c.$watch(function() {
return d(c.build, "jenkinsStatus");
}, function(a) {
if (a) try {
c.jenkinsStatus = JSON.parse(a);
} catch (d) {
b.error("Could not parse Jenkins status as JSON", a);
}
});
var e = a("buildConfigForBuild");
c.$watch(function() {
return e(c.build);
}, function(a) {
c.buildConfigName = a;
});
}
};
} ]).directive("pipelineStatus", function() {
return {
restrict:"E",
scope:{
status:"="
},
templateUrl:"views/directives/pipeline-status.html"
};
}), angular.module("openshiftConsole").directive("buildStatus", function() {
return {
restrict:"E",
scope:{
build:"="
},
templateUrl:"views/directives/build-status.html"
};
}), angular.module("openshiftConsole").directive("serviceGroupNotifications", [ "$filter", "APIService", "DeploymentsService", "Navigate", function(a, b, c, d) {
return {
restrict:"E",
scope:!0,
templateUrl:"views/directives/service-group-notifications.html",
link:function(e) {
var f = function(a) {
var b = _.get(e, "service.metadata.namespace");
return "hide/alert/" + b + "/" + a;
}, g = function(a) {
var b = f(a);
return "true" === localStorage.getItem(b);
}, h = function(a) {
var b = f(a);
localStorage.setItem(b, "true");
}, i = a("annotation"), j = a("deploymentStatus"), k = a("hasHealthChecks"), l = e.alerts = {}, m = [], n = a("canI"), o = function(a) {
var c = "health_checks_" + a.metadata.uid;
if (k(a.spec.template)) delete l[c]; else {
if (g(c)) return;
l[c] = {
type:"info",
message:a.metadata.name + " has containers without health checks, which ensure your application is running correctly.",
onClose:function() {
h(c);
}
};
var e = b.objectToResourceGroupVersion(a);
n(e, "update") && (l[c].links = [ {
href:d.healthCheckURL(a.metadata.namespace, a.kind, a.metadata.name, e.group),
label:"Add Health Checks"
} ]);
}
}, p = function(a) {
c.startLatestDeployment(a, {
namespace:a.metadata.namespace
}, e);
}, q = function(a) {
var b = _.get(a, "metadata.name"), c = _.get(e, [ "mostRecentReplicationControllerByDC", b ]);
if (c) {
var f, g = j(c), h = i(c, "deploymentVersion"), k = h ? b + " #" + h :c.metadata.name, m = d.resourceURL(c);
switch (g) {
case "Cancelled":
l[c.metadata.uid + "-cancelled"] = {
type:"info",
message:"Deployment " + k + " was cancelled.",
links:[ {
href:m,
label:"View Deployment"
}, {
label:"Start New Deployment",
onClick:function() {
return p(a), !0;
}
} ]
};
break;

case "Failed":
f = URI(m).addSearch({
tab:"logs"
}).toString(), l[c.metadata.uid + "-failed"] = {
type:"error",
message:"Deployment " + k + " failed.",
reason:i(c, "openshift.io/deployment.status-reason"),
links:[ {
href:f,
label:"View Log"
}, {
href:"project/" + c.metadata.namespace + "/browse/events",
label:"View Events"
} ]
};
}
}
}, r = function() {
_.each(m, function(a) {
var b = _.get(a, "metadata.name", ""), c = _.get(e, [ "deploymentsByService", b ]);
_.each(c, o);
var d = _.get(e, [ "deploymentConfigsByService", b ]);
_.each(d, function(a) {
o(a), q(a);
});
});
}, s = function(a) {
var b = _.get(a, "metadata.uid");
return _.get(e, [ "podsByOwnerUID", b ], {});
}, t = a("groupedPodWarnings"), u = function() {
var a = {};
_.each(l, function(a, b) {
b.indexOf("pod_warning") >= 0 && delete a[b];
}), _.each(m, function(b) {
var c = _.get(b, "metadata.name", ""), d = _.get(e, [ "replicationControllersByService", c ]);
_.each(d, function(b) {
var c = s(b);
t(c, a);
});
var f = _.get(e, [ "replicaSetsByService", c ]);
_.each(f, function(b) {
var c = s(b);
t(c, a);
});
var g = _.get(e, [ "statefulSetsByService", c ]);
_.each(g, function(b) {
var c = s(b);
t(c, a);
});
}), _.each(a, function(a, b) {
var c = _.head(a);
if (c) {
var f = "pod_warning" + b, i = {
type:c.severity || "warning",
message:c.message
};
switch (c.reason) {
case "NonZeroExit":
var j = d.resourceURL(c.pod, "Pod", e.service.metadata.namespace), k = URI(j).addSearch({
tab:"logs",
container:c.container
}).toString();
i.links = [ {
href:k,
label:"View Log"
} ];
break;

case "NonZeroExitTerminatingPod":
if (g(f)) return;
i.links = [ {
href:"",
label:"Don't Show Me Again",
onClick:function() {
return h(f), !0;
}
} ];
}
l[f] = i;
}
});
};
e.showAlert = function(a) {
return !e.collapse || "info" !== a.type;
}, e.$watchGroup([ "service", "childServices" ], function() {
m = (e.childServices || []).concat([ e.service ]), r(), u();
}), e.$watchGroup([ "deploymentConfigsByService", "deploymentsByService" ], r), e.$watchGroup([ "podsByOwnerUid", "replicationControllersByService", "replicaSetsByService", "statefulSetsByService" ], u);
}
};
} ]), angular.module("openshiftConsole").directive("overviewService", [ "$filter", "DeploymentsService", "MetricsService", function(a, b, c) {
return {
restrict:"E",
scope:!0,
templateUrl:"views/overview/_service.html",
link:function(b) {
window.OPENSHIFT_CONSTANTS.DISABLE_OVERVIEW_METRICS || c.isAvailable(!0).then(function(a) {
b.showMetrics = a;
});
var d = a("annotation"), e = a("orderObjectsByDate"), f = function(a) {
return _.get(a, "status.replicas") || !d(a, "deployment.kubernetes.io/revision");
};
b.$watch("replicaSetsByService", function(a) {
var c = _.get(b, "service.metadata.name"), d = _.get(a, [ c ], {});
b.visibleReplicaSets = e(_.filter(d, f), !0);
});
var g = function() {
var a = _.get(b, "service.metadata.name"), c = _.get(b, [ "statefulSetsByService", a ], {}), d = _.get(b, [ "monopodsByService", a ], {}), e = 0;
_.each(b.visibleReplicaSetsByDeployment, function(a, b) {
b ? e++ :e += _.size(a);
}), b.tileCount = _.size(b.deploymentConfigs) + _.size(b.replicationControllers) + _.size(c) + _.size(d) + e;
};
b.$watch("vanillaReplicationControllersByService", function(a) {
var c = _.get(b, "service.metadata.name");
b.replicationControllers = _.get(a, [ c ], {}), g();
}), b.$watch("deploymentConfigsByService", function(a) {
var c = _.get(b, "service.metadata.name");
b.deploymentConfigs = _.get(a, c, {}), g();
}), b.$watch("visibleRSByDeploymentAndService", function(a) {
var c = _.get(b, "service.metadata.name");
b.visibleReplicaSetsByDeployment = _.get(a, [ c ], {}), g();
});
}
};
} ]), angular.module("openshiftConsole").directive("overviewServiceGroup", [ "$filter", "$uibModal", "RoutesService", "ServicesService", function(a, b, c, d) {
return {
restrict:"E",
scope:!0,
templateUrl:"views/overview/_service-group.html",
link:function(e) {
var f = function() {
var a = _.get(e, "service.metadata.uid");
return a ? "collapse/service/" + a :null;
}, g = function() {
var a = f();
return !!a && "true" === localStorage.getItem(a);
}, h = function() {
var a = f();
if (a) {
var b = e.collapse ? "true" :"false";
localStorage.setItem(a, b);
}
};
e.collapse = g(), e.toggleCollapse = function(a) {
a && a.target && "A" === a.target.tagName || (e.collapse = !e.collapse, h());
}, e.linkService = function() {
var c = b.open({
animation:!0,
templateUrl:"views/modals/link-service.html",
controller:"LinkServiceModalController",
scope:e
});
c.result.then(function(b) {
d.linkService(e.service, b).then(_.noop, function(b) {
e.alerts = e.alerts || {}, e.alerts["link-service"] = {
type:"error",
message:"Could not link services.",
details:a("getErrorDetails")(b)
};
});
});
}, e.removeLink = function(c) {
var f = b.open({
animation:!0,
templateUrl:"views/modals/confirm.html",
controller:"ConfirmModalController",
resolve:{
modalConfig:function() {
return {
message:"Remove service '" + c.metadata.name + "' from group?",
details:"Services '" + e.primaryService.metadata.name + "' and '" + c.metadata.name + "' will no longer be displayed together on the overview.",
okButtonText:"Remove",
okButtonClass:"btn-danger",
cancelButtonText:"Cancel"
};
}
}
});
f.result.then(function() {
d.removeServiceLink(e.primaryService, c).then(_.noop, function(b) {
e.alerts = e.alerts || {}, e.alerts["remove-service-link"] = {
type:"error",
message:"Could not remove service link.",
details:a("getErrorDetails")(b)
};
});
});
}, e.$watch("service.metadata.labels.app", function(a) {
e.appName = a;
});
var i = function(a) {
var b;
return _.each(a, function(a) {
return b ? void (b = c.getPreferredDisplayRoute(b, a)) :void (b = a);
}), b;
}, j = function() {
e.weightByService = {}, e.alternateServices = [], e.totalWeight = 0;
var a = _.get(e.displayRoute, "spec.to.weight");
e.weightByService[e.service.metadata.name] = a, e.totalWeight += a;
var b = _.get(e.displayRoute, "spec.alternateBackends", []);
_.each(b, function(a) {
if ("Service" === a.kind) {
var b = e.services[a.name];
b && e.alternateServices.push(b), e.weightByService[a.name] = a.weight, e.totalWeight += a.weight;
}
});
};
e.$watch(function() {
var a = _.get(e, "service.metadata.name");
return _.get(e, [ "routesByService", a ]);
}, function(a) {
e.displayRoute = i(a), e.primaryServiceRoutes = a, j();
}), e.$watchGroup([ "service", "childServicesByParent" ], function() {
e.service && (e.primaryService = e.service, e.childServices = _.get(e, [ "childServicesByParent", e.service.metadata.name ], []));
}), e.$watchGroup([ "service", "childServices", "alternateServices", "deploymentConfigsByService" ], function() {
if (e.deploymentConfigsByService) {
var a = [ e.service ].concat(e.alternateServices).concat(e.childServices);
a = _.map(a, "metadata.name");
var b = {};
_.each(a, function(a) {
_.extend(b, e.deploymentConfigsByService[a]);
}), e.allDeploymentConfigsInGroup = b;
}
});
}
};
} ]), angular.module("openshiftConsole").directive("overviewPod", [ "$filter", "$location", "MetricsService", "Navigate", function(a, b, c, d) {
return {
restrict:"E",
scope:!0,
templateUrl:"views/overview/_pod.html",
link:function(a) {
window.OPENSHIFT_CONSTANTS.DISABLE_OVERVIEW_METRICS || c.isAvailable(!0).then(function(b) {
a.showMetrics = b;
}), a.viewPod = function() {
var c = d.resourceURL(a.pod);
b.url(c);
};
}
};
} ]), angular.module("openshiftConsole").directive("overviewSet", function() {
return {
restrict:"E",
scope:!0,
templateUrl:"views/overview/_set.html"
};
}), angular.module("openshiftConsole").directive("overviewDeploymentConfig", [ "$filter", "$uibModal", "BuildsService", "DeploymentsService", "Navigate", function(a, b, c, d, e) {
return {
restrict:"E",
scope:!0,
templateUrl:"views/overview/_dc.html",
link:function(f) {
var g = a("orderObjectsByDate"), h = a("deploymentIsInProgress");
f.$watch("scalableReplicationControllerByDC", function() {
var a = _.get(f, "deploymentConfig.metadata.name");
f.activeReplicationController = _.get(f, [ "scalableReplicationControllerByDC", a ]);
}), f.$watch("visibleRCByDC", function(a) {
var b = _.get(f, "deploymentConfig.metadata.name"), c = _.get(a, [ b ], []);
f.orderedReplicationControllers = g(c, !0), f.inProgressDeployment = _.find(f.orderedReplicationControllers, h);
}), f.$watch("deploymentConfig", function(a) {
var b = _.get(a, "spec.triggers", []);
f.imageChangeTriggers = _.filter(b, function(a) {
return "ImageChange" === a.type && _.get(a, "imageChangeParams.automatic");
});
}), f.urlForImageChangeTrigger = function(b) {
var c = a("stripTag")(_.get(b, "imageChangeParams.from.name")), d = _.get(b, "imageChangeParams.from.namespace", f.deploymentConfig.metadata.namespace);
return e.resourceURL(c, "ImageStream", d);
}, f.startPipeline = function(b) {
c.startBuild(b.metadata.name, {
namespace:b.metadata.namespace
}).then(_.noop, function(b) {
f.alerts["start-pipeline"] = {
type:"error",
message:"An error occurred while starting the pipeline.",
details:a("getErrorDetails")(b)
};
});
}, f.startDeployment = function() {
d.startLatestDeployment(f.deploymentConfig, {
namespace:f.deploymentConfig.metadata.namespace
}, f);
};
var i;
f.$watch("deploymentConfig.spec.paused", function() {
i = !1;
}), f.resumeDeployment = function() {
i || (i = !0, d.setPaused(f.deploymentConfig, !1, {
namespace:f.deploymentConfig.metadata.namespace
}).then(_.noop, function(b) {
i = !1, f.alerts["resume-deployment"] = {
type:"error",
message:"An error occurred resuming the deployment.",
details:a("getErrorDetails")(b)
};
}));
}, f.cancelDeployment = function() {
var a = f.inProgressDeployment;
if (a) {
var c = a.metadata.name, e = _.get(f, "deploymentConfig.status.latestVersion"), g = b.open({
animation:!0,
templateUrl:"views/modals/confirm.html",
controller:"ConfirmModalController",
resolve:{
modalConfig:function() {
return {
message:"Cancel deployment " + c + "?",
details:e ? "This will attempt to stop the in-progress deployment and rollback to the previous deployment, #" + e + ". It may take some time to complete." :"This will attempt to stop the in-progress deployment and may take some time to complete.",
okButtonText:"Yes, cancel",
okButtonClass:"btn-danger",
cancelButtonText:"No, don't cancel"
};
}
}
});
g.result.then(function() {
var a = _.get(f, [ "replicationControllersByName", c ]);
return a ? h(a) ? void d.cancelRunningDeployment(a, f.projectContext, f) :void (f.alerts["cancel-deployment"] = {
type:"error",
message:"Deployment " + c + " is no longer in progress."
}) :void (f.alerts["cancel-deployment"] = {
type:"error",
message:"Deployment " + c + " no longer exists."
});
});
}
};
}
};
} ]), angular.module("openshiftConsole").directive("overviewDeployment", [ "$filter", "DeploymentsService", function(a, b) {
return {
restrict:"E",
scope:!0,
templateUrl:"views/overview/_deployment.html",
link:function(c) {
var d;
c.$watch("deployment.spec.paused", function() {
d = !1;
}), c.resumeDeployment = function() {
d || (d = !0, b.setPaused(c.deployment, !1, {
namespace:c.deployment.metadata.namespace
}).then(_.noop, function(b) {
d = !1, c.alerts["resume-deployment"] = {
type:"error",
message:"An error occurred resuming the deployment.",
details:a("getErrorDetails")(b)
};
}));
}, c.$watch(function() {
return _.get(c, [ "deployments", c.deploymentName ]);
}, function() {
c.deployment = _.get(c, [ "deployments", c.deploymentName ]), c.latestRevision = b.getRevision(c.deployment);
}), c.$watch("scalableReplicaSetsByDeployment", function() {
c.latestReplicaSet = _.get(c, [ "scalableReplicaSetsByDeployment", c.deploymentName ]);
}), c.$watch("replicaSets", function(a) {
c.inProgressDeployment = _.chain(a).filter("status.replicas").size() > 1;
});
}
};
} ]), angular.module("openshiftConsole").directive("imageNames", [ "$filter", "PodsService", function(a, b) {
return {
restrict:"E",
scope:{
podTemplate:"=",
pods:"="
},
templateUrl:"views/overview/_image-names.html",
link:function(c) {
var d = a("imageSHA"), e = function() {
var a = _.get(c, "podTemplate.spec.containers[0]");
if (a) {
var e = d(a.image);
return e ? void (c.imageIDs = [ e ]) :void (c.imageIDs = b.getImageIDs(c.pods, a.name));
}
};
c.$watchGroup([ "podTemplate", "pods" ], e);
}
};
} ]), angular.module("openshiftConsole").directive("istagSelect", [ "DataService", function(a) {
return {
require:"^form",
restrict:"E",
scope:{
istag:"=model",
selectDisabled:"=",
includeSharedNamespace:"=",
allowCustomTag:"="
},
templateUrl:"views/directives/istag-select.html",
controller:[ "$scope", function(b) {
b.isByNamespace = {}, b.isNamesByNamespace = {};
var c = _.get(b, "istag.namespace") && _.get(b, "istag.imageStream") && _.get(b, "istag.tagObject.tag"), d = function(c) {
return b.isByNamespace[c] = {}, b.isNamesByNamespace[c] = [], _.contains(b.namespaces, c) ? void a.list("imagestreams", {
namespace:c
}, function(a) {
b.isByNamespace[c] = a.by("metadata.name"), b.isNamesByNamespace[c] = _.keys(b.isByNamespace[c]).sort(), _.contains(b.isNamesByNamespace[c], b.istag.imageStream) || (b.isNamesByNamespace[c] = b.isNamesByNamespace[c].concat(b.istag.imageStream), b.isByNamespace[c][b.istag.imageStream] = {
status:{}
}), b.isByNamespace[c][b.istag.imageStream].status.tags || (b.isByNamespace[c][b.istag.imageStream].status = {
tags:[]
}), _.find(b.isByNamespace[c][b.istag.imageStream].status.tags, {
tag:b.istag.tagObject.tag
}) || b.isByNamespace[c][b.istag.imageStream].status.tags.push({
tag:b.istag.tagObject.tag
});
}) :(b.namespaces.push(c), b.isNamesByNamespace[c] = b.isNamesByNamespace[c].concat(b.istag.imageStream), void (b.isByNamespace[c][b.istag.imageStream] = {
status:{
tags:[ {
tag:b.istag.tagObject.tag
} ]
}
}));
};
a.list("projects", {}, function(e) {
b.namespaces = _.keys(e.by("metadata.name")).sort(), b.includeSharedNamespace && (b.namespaces = _.uniq([ "openshift" ].concat(b.namespaces))), b.$watch("istag.namespace", function(e) {
if (e && !b.isByNamespace[e]) return c ? (d(e), void (c = !1)) :void a.list("imagestreams", {
namespace:e
}, function(a) {
b.isByNamespace[e] = a.by("metadata.name"), _.each(_.keys(b.isByNamespace[e]), function(a) {
b.isByNamespace[e][a].status.tags || (b.isByNamespace[e][a].status = {
tags:[]
});
}), b.isNamesByNamespace[e] = _.keys(b.isByNamespace[e]).sort();
});
});
}), b.getTags = function(a) {
b.allowCustomTag && a && !_.find(b.isByNamespace[b.istag.namespace][b.istag.imageStream].status.tags, {
tag:a
}) && (_.remove(b.isByNamespace[b.istag.namespace][b.istag.imageStream].status.tags, function(a) {
return !a.items;
}), b.isByNamespace[b.istag.namespace][b.istag.imageStream].status.tags.unshift({
tag:a
}));
}, b.groupTags = function(a) {
return b.allowCustomTag ? a.items ? "Current Tags" :"New Tag" :"";
};
} ]
};
} ]), angular.module("openshiftConsole").directive("deployImage", [ "$filter", "$q", "$window", "$uibModal", "ApplicationGenerator", "DataService", "ImagesService", "Navigate", "ProjectsService", "QuotaService", "TaskList", "SecretsService", "keyValueEditorUtils", function(a, b, c, d, e, f, g, h, i, j, k, l, m) {
return {
restrict:"E",
scope:{
project:"=",
context:"=",
alerts:"="
},
templateUrl:"views/directives/deploy-image.html",
link:function(c) {
function i() {
var a = m.mapEntries(m.compactEntries(c.labels)), b = m.mapEntries(m.compactEntries(c.systemLabels));
return g.getResources({
name:c.app.name,
image:c["import"].name,
namespace:c["import"].namespace,
tag:c["import"].tag || "latest",
ports:c.ports,
volumes:c.volumes,
env:m.mapEntries(m.compactEntries(c.env)),
labels:_.extend(b, a),
pullSecrets:c.pullSecrets
});
}
c.mode = "istag", c.istag = {}, c.app = {}, c.env = [], c.labels = [], c.systemLabels = [ {
name:"app",
value:""
} ], c.pullSecrets = [ {
name:""
} ], f.list("secrets", {
namespace:c.project
}, function(a) {
var b = l.groupSecretsByType(a), d = _.mapValues(b, function(a) {
return _.map(a, "metadata.name");
});
c.secretsByType = _.each(d, function(a) {
a.unshift("");
});
});
var n = a("stripTag"), o = a("stripSHA"), p = a("humanizeKind"), q = function(a) {
return a.length > 24 ? a.substring(0, 24) :a;
}, r = function() {
var a = _.last(c["import"].name.split("/"));
return a = o(a), a = n(a), a = q(a);
};
c.findImage = function() {
c.loading = !0, g.findImage(c.imageName, c.context).then(function(a) {
if (c["import"] = a, c.loading = !1, "Success" !== _.get(a, "result.status")) return void (c["import"].error = _.get(a, "result.message", "An error occurred finding the image."));
var b = c["import"].image;
b && (c.app.name = r(), c.runsAsRoot = g.runsAsRoot(b), c.ports = e.parsePorts(b), c.volumes = g.getVolumes(b), c.createImageStream = !0);
}, function(b) {
c["import"].error = a("getErrorDetails")(b) || "An error occurred finding the image.", c.loading = !1;
});
}, c.$watch("app.name", function() {
c.nameTaken = !1, _.set(_.find(c.systemLabels, {
name:"app"
}), "value", c.app.name);
}), c.$watch("mode", function(a, b) {
a !== b && (delete c["import"], c.istag = {});
}), c.$watch("istag", function(b, d) {
if (b !== d) {
if (!b.namespace || !b.imageStream || !b.tagObject) return void delete c["import"];
var h, i = _.get(b, "tagObject.items[0].image");
c.app.name = q(b.imageStream), c["import"] = {
name:b.imageStream,
tag:b.tagObject.tag,
namespace:b.namespace
}, i && (h = b.imageStream + "@" + i, c.loading = !0, f.get("imagestreamimages", h, {
namespace:b.namespace
}).then(function(a) {
c.loading = !1, c["import"].image = a.image, c.ports = e.parsePorts(a.image), c.volumes = g.getVolumes(a.image), c.runsAsRoot = !1;
}, function(b) {
c["import"].error = a("getErrorDetails")(b) || "An error occurred.", c.loading = !1;
}));
}
}, !0);
var s, t = function() {
var a = {
started:"Deploying image " + c.app.name + " to project " + c.project + ".",
success:"Deployed image " + c.app.name + " to project " + c.project + ".",
failure:"Failed to deploy image " + c.app.name + " to project " + c.project + "."
};
k.clear(), k.add(a, {}, c.project, function() {
var a = b.defer();
return f.batch(s, c.context).then(function(b) {
var d, e = !_.isEmpty(b.failure);
e ? (d = _.map(b.failure, function(a) {
return {
type:"error",
message:"Cannot create " + p(a.object.kind).toLowerCase() + ' "' + a.object.metadata.name + '". ',
details:a.data.message
};
}), d = d.concat(_.map(b.success, function(a) {
return {
type:"success",
message:"Created " + p(a.kind).toLowerCase() + ' "' + a.metadata.name + '" successfully. '
};
}))) :d = [ {
type:"success",
message:"All resources for image " + c.app.name + " were created successfully."
} ], a.resolve({
alerts:d,
hasErrors:e
});
}), a.promise;
}), h.toNextSteps(c.app.name, c.project);
}, u = function(a) {
var b = d.open({
animation:!0,
templateUrl:"views/modals/confirm.html",
controller:"ConfirmModalController",
resolve:{
modalConfig:function() {
return {
alerts:a,
message:"Problems were detected while checking your application configuration.",
okButtonText:"Create Anyway",
okButtonClass:"btn-danger",
cancelButtonText:"Cancel"
};
}
}
});
b.result.then(t);
}, v = function(a) {
var b = a.quotaAlerts || [], d = _.filter(b, {
type:"error"
});
c.nameTaken || d.length ? (c.disableInputs = !1, c.alerts = b) :b.length ? (u(b), c.disableInputs = !1) :t();
};
c.create = function() {
c.disableInputs = !0, c.alerts = {}, s = i();
var a = e.ifResourcesDontExist(s, c.project), b = j.getLatestQuotaAlerts(s, c.context), d = function(a) {
return c.nameTaken = a.nameTaken, b;
};
a.then(d, d).then(v, v);
};
}
};
} ]), angular.module("openshiftConsole").directive("selector", function() {
return {
restrict:"E",
scope:{
selector:"="
},
templateUrl:"views/directives/selector.html"
};
}), angular.module("openshiftConsole").directive("selectContainers", function() {
return {
restrict:"E",
scope:{
containers:"=ngModel",
template:"=podTemplate",
required:"=ngRequired",
helpText:"@?"
},
templateUrl:"views/directives/select-containers.html",
controller:[ "$scope", function(a) {
a.containers = a.containers || {}, a.$watch("containers", function(b) {
a.containerSelected = _.some(b, function(a) {
return a;
});
}, !0);
} ]
};
}), angular.module("openshiftConsole").directive("buildHooks", function() {
return {
restrict:"E",
templateUrl:"views/directives/build-hooks.html",
scope:{
build:"="
}
};
}), angular.module("openshiftConsole").directive("pauseRolloutsCheckbox", [ "APIService", function(a) {
return {
restrict:"E",
scope:{
deployment:"=",
disabled:"=ngDisabled",
alwaysVisible:"="
},
templateUrl:"views/directives/pause-rollouts-checkbox.html",
link:function(b) {
var c = function() {
if (!b.deployment) return !1;
var c = a.objectToResourceGroupVersion(b.deployment);
return "deploymentconfigs" === c.resource && !c.group;
};
b.$watch("deployment.spec.triggers", function(a) {
b.missingConfigChangeTrigger = c() && !_.some(a, {
type:"ConfigChange"
});
}, !0);
}
};
} ]), angular.module("openshiftConsole").filter("duration", function() {
return function(a, b, c, d) {
function e(a, b, d) {
if (0 !== a) return 1 === a ? void (c ? h.push(b) :h.push("1 " + b)) :void h.push(a + " " + d);
}
if (!a) return a;
d = d || 2, b = b || new Date();
var f = moment(b).diff(a);
f < 0 && (f = 0);
var g = moment.duration(f), h = [], i = g.years(), j = g.months(), k = g.days(), l = g.hours(), m = g.minutes(), n = g.seconds();
return e(i, "year", "years"), e(j, "month", "months"), e(k, "day", "days"), e(l, "hour", "hours"), e(m, "minute", "minutes"), e(n, "second", "seconds"), 1 === h.length && n && 1 === d ? c ? "minute" :"1 minute" :(0 === h.length && h.push("0 seconds"), h.length > d && (h.length = d), h.join(", "));
};
}).filter("ageLessThan", function() {
return function(a, b, c) {
return moment().subtract(b, c).diff(moment(a)) < 0;
};
}).filter("isNewerResource", function() {
return function(a, b) {
var c = _.get(a, "metadata.creationTimestamp");
if (!c) return !1;
var d = _.get(b, "metadata.creationTimestamp");
return !d || c > d;
};
}).filter("mostRecent", [ "isNewerResourceFilter", function(a) {
return function(b) {
var c = null;
return _.each(b, function(b) {
c && !a(b, c) || (c = b);
}), c;
};
} ]).filter("orderObjectsByDate", [ "toArrayFilter", function(a) {
return function(b, c) {
return b = a(b), b.sort(function(a, b) {
if (!(a.metadata && a.metadata.creationTimestamp && b.metadata && b.metadata.creationTimestamp)) throw "orderObjectsByDate expects all objects to have the field metadata.creationTimestamp";
return a.metadata.creationTimestamp < b.metadata.creationTimestamp ? c ? 1 :-1 :a.metadata.creationTimestamp > b.metadata.creationTimestamp ? c ? -1 :1 :0;
}), b;
};
} ]).filter("humanizeDurationValue", function() {
return function(a, b) {
return moment.duration(a, b).humanize();
};
}).filter("timeOnlyDurationFromTimestamps", [ "timeOnlyDurationFilter", function(a) {
return function(b, c) {
return b ? (c = c || new Date(), a(moment(c).diff(b))) :b;
};
} ]).filter("timeOnlyDuration", function() {
return function(a) {
var b = [], c = moment.duration(a), d = Math.floor(c.asHours()), e = c.minutes(), f = c.seconds();
return (d < 0 || e < 0 || f < 0) && (d = e = f = 0), d && b.push(d + "h"), e && b.push(e + "m"), d || b.push(f + "s"), b.join(" ");
};
}), angular.module("openshiftConsole").filter("uid", function() {
return function(a) {
return a && a.metadata && a.metadata.uid ? a.metadata.uid :a;
};
}).filter("annotationName", function() {
var a = {
buildConfig:[ "openshift.io/build-config.name" ],
deploymentConfig:[ "openshift.io/deployment-config.name" ],
deployment:[ "openshift.io/deployment.name" ],
pod:[ "openshift.io/deployer-pod.name" ],
deployerPod:[ "openshift.io/deployer-pod.name" ],
deployerPodFor:[ "openshift.io/deployer-pod-for.name" ],
deploymentStatus:[ "openshift.io/deployment.phase" ],
deploymentStatusReason:[ "openshift.io/deployment.status-reason" ],
deploymentCancelled:[ "openshift.io/deployment.cancelled" ],
encodedDeploymentConfig:[ "openshift.io/encoded-deployment-config" ],
deploymentVersion:[ "openshift.io/deployment-config.latest-version" ],
displayName:[ "openshift.io/display-name" ],
description:[ "openshift.io/description" ],
buildNumber:[ "openshift.io/build.number" ],
buildPod:[ "openshift.io/build.pod-name" ],
jenkinsBuildURL:[ "openshift.io/jenkins-build-uri" ],
jenkinsLogURL:[ "openshift.io/jenkins-log-url" ],
jenkinsStatus:[ "openshift.io/jenkins-status-json" ],
idledAt:[ "idling.alpha.openshift.io/idled-at" ],
idledPreviousScale:[ "idling.alpha.openshift.io/previous-scale" ],
systemOnly:[ "authorization.openshift.io/system-only" ]
};
return function(b) {
return a[b] || null;
};
}).filter("labelName", function() {
var a = {
buildConfig:[ "openshift.io/build-config.name" ],
deploymentConfig:[ "openshift.io/deployment-config.name" ]
};
return function(b) {
return a[b];
};
}).filter("annotation", [ "annotationNameFilter", function(a) {
return function(b, c) {
if (b && b.metadata && b.metadata.annotations) {
if (void 0 !== b.metadata.annotations[c]) return b.metadata.annotations[c];
for (var d = a(c) || [], e = 0; e < d.length; e++) {
var f = d[e];
if (void 0 !== b.metadata.annotations[f]) return b.metadata.annotations[f];
}
return null;
}
return null;
};
} ]).filter("imageStreamTagAnnotation", function() {
return function(a, b, c) {
if (c = c || "latest", a && a.spec && a.spec.tags) for (var d = a.spec.tags, e = 0; e < d.length; ++e) {
var f = d[e];
if (c === f.name && f.annotations) return f.annotations[b];
}
return null;
};
}).filter("description", [ "annotationFilter", function(a) {
return function(b) {
return a(b, "openshift.io/description") || a(b, "kubernetes.io/description") || a(b, "description");
};
} ]).filter("storageClass", [ "annotationFilter", function(a) {
return function(b) {
return a(b, "volume.beta.kubernetes.io/storage-class");
};
} ]).filter("displayName", [ "annotationFilter", function(a) {
return function(b, c) {
var d = a(b, "displayName");
return d || c ? d :b && b.metadata ? b.metadata.name :null;
};
} ]).filter("uniqueDisplayName", [ "displayNameFilter", function(a) {
function b(b) {
var c = {};
return angular.forEach(b, function(b, d) {
var e = a(b);
c[e] = (c[e] || 0) + 1;
}), c;
}
return function(c, d) {
if (!c) return "";
var e = a(c), f = c.metadata.name;
return e !== f && b(d)[e] > 1 ? e + " (" + f + ")" :e;
};
} ]).filter("searchProjects", [ "displayNameFilter", function(a) {
return function(b, c) {
return c ? (c = c.toLowerCase(), _.filter(b, function(b) {
if (_.includes(b.metadata.name, c)) return !0;
var d = a(b, !0);
return !(!d || !_.includes(d.toLowerCase(), c));
})) :b;
};
} ]).filter("tags", [ "annotationFilter", function(a) {
return function(b, c) {
c = c || "tags";
var d = a(b, c);
return d ? d.split(/\s*,\s*/) :[];
};
} ]).filter("imageStreamTagTags", [ "imageStreamTagAnnotationFilter", function(a) {
return function(b, c) {
var d = a(b, "tags", c);
return d ? d.split(/\s*,\s*/) :[];
};
} ]).filter("imageStreamLastUpdated", function() {
return function(a) {
var b = a.metadata.creationTimestamp, c = moment(b);
return angular.forEach(a.status.tags, function(a) {
if (a.items && a.items.length > 0) {
var d = moment(a.items[0].created);
d.isAfter(c) && (c = d, b = a.items[0].created);
}
}), b;
};
}).filter("label", function() {
return function(a, b) {
return a && a.metadata && a.metadata.labels ? a.metadata.labels[b] :null;
};
}).filter("buildConfigForBuild", [ "annotationFilter", "labelNameFilter", "labelFilter", function(a, b, c) {
var d = b("buildConfig");
return function(b) {
return a(b, "buildConfig") || c(b, d);
};
} ]).filter("icon", [ "annotationFilter", function(a) {
return function(b) {
var c = a(b, "icon");
return c ? c :"";
};
} ]).filter("iconClass", [ "annotationFilter", function(a) {
return function(b, c) {
var d = a(b, "iconClass");
return d ? d :"template" === c ? "fa fa-clone" :"";
};
} ]).filter("imageStreamTagIconClass", [ "imageStreamTagAnnotationFilter", function(a) {
return function(b, c) {
var d = a(b, "iconClass", c);
return d ? d :"fa fa-cube";
};
} ]).filter("imageName", function() {
return function(a) {
return a ? a.contains(":") ? a.split(":")[1] :a :"";
};
}).filter("imageStreamName", function() {
return function(a) {
if (!a) return "";
var b, c = a.split("@")[0], d = c.split("/");
return 3 === d.length ? (b = d[2].split(":"), d[1] + "/" + b[0]) :2 === d.length ? c :1 === d.length ? (b = c.split(":"), b[0]) :void 0;
};
}).filter("stripTag", function() {
return function(a) {
return a ? a.split(":")[0] :a;
};
}).filter("stripSHA", function() {
return function(a) {
return a ? a.split("@")[0] :a;
};
}).filter("imageSHA", function() {
return function(a) {
if (!a) return a;
var b = a.split("@");
return b.length > 1 ? b[1] :"";
};
}).filter("imageEnv", function() {
return function(a, b) {
for (var c = a.dockerImageMetadata.Config.Env, d = 0; d < c.length; d++) {
var e = c[d].split("=");
if (e[0] === b) return e[1];
}
return null;
};
}).filter("destinationSourcePair", function() {
return function(a) {
var b = {};
return angular.forEach(a, function(a) {
b[a.sourcePath] = a.destinationDir;
}), b;
};
}).filter("buildForImage", function() {
return function(a, b) {
for (var c = _.get(a, "dockerImageMetadata.Config.Env", []), d = 0; d < c.length; d++) {
var e = c[d].split("=");
if ("OPENSHIFT_BUILD_NAME" === e[0]) return b[e[1]];
}
return null;
};
}).filter("webhookURL", [ "DataService", function(a) {
return function(b, c, d, e) {
return a.url({
resource:"buildconfigs/webhooks/" + d + "/" + c.toLowerCase(),
name:b,
namespace:e
});
};
} ]).filter("isWebRoute", [ "routeHostFilter", function(a) {
return function(b) {
return !!a(b) && "Subdomain" !== _.get(b, "spec.wildcardPolicy");
};
} ]).filter("routeWebURL", [ "routeHostFilter", function(a) {
return function(b, c, d) {
var e = b.spec.tls && "" !== b.spec.tls.tlsTerminationType ? "https" :"http", f = e + "://" + (c || a(b));
return b.spec.path && !d && (f += b.spec.path), f;
};
} ]).filter("routeLabel", [ "RoutesService", "routeHostFilter", "routeWebURLFilter", "isWebRouteFilter", function(a, b, c, d) {
return function(e, f, g) {
if (d(e)) return c(e, f, g);
var h = f || b(e);
return h ? ("Subdomain" === _.get(e, "spec.wildcardPolicy") && (h = "*." + a.getSubdomain(e)), g ? h :(e.spec.path && (h += e.spec.path), h)) :"<unknown host>";
};
} ]).filter("parameterPlaceholder", function() {
return function(a) {
return a.generate ? "(generated if empty)" :"";
};
}).filter("parameterValue", function() {
return function(a) {
return !a.value && a.generate ? "(generated)" :a.value;
};
}).filter("imageObjectRef", function() {
return function(a, b, c) {
if (!a) return "";
var d = a.namespace || b || "";
d.length > 0 && (d += "/");
var e = a.kind;
if ("ImageStreamTag" === e || "ImageStreamImage" === e) return d + a.name;
if ("DockerImage" === e) {
var f = a.name;
return c && (f = f.substring(f.lastIndexOf("/") + 1)), f;
}
var g = d + a.name;
return g;
};
}).filter("orderByDisplayName", [ "displayNameFilter", "toArrayFilter", function(a, b) {
return function(c) {
var d = b(c);
return d.sort(function(b, c) {
var d = a(b) || "", e = a(c) || "";
return d === e && (d = _.get(b, "metadata.name", ""), e = _.get(c, "metadata.name", "")), d.localeCompare(e);
}), d;
};
} ]).filter("isPodStuck", function() {
return function(a) {
if ("Pending" !== a.status.phase) return !1;
var b = moment().subtract(5, "m"), c = moment(a.metadata.creationTimestamp);
return c.isBefore(b);
};
}).filter("isContainerLooping", function() {
return function(a) {
return a.state.waiting && "CrashLoopBackOff" === a.state.waiting.reason;
};
}).filter("isContainerFailed", function() {
return function(a) {
return a.state.terminated && 0 !== a.state.terminated.exitCode;
};
}).filter("isContainerUnprepared", function() {
return function(a) {
if (!a.state.running || a.ready !== !1 || !a.state.running.startedAt) return !1;
var b = moment().subtract(5, "m"), c = moment(a.state.running.startedAt);
return c.isBefore(b);
};
}).filter("isTroubledPod", [ "isPodStuckFilter", "isContainerLoopingFilter", "isContainerFailedFilter", "isContainerUnpreparedFilter", function(a, b, c, d) {
return function(e) {
if ("Unknown" === e.status.phase) return !0;
if (a(e)) return !0;
if ("Running" === e.status.phase && e.status.containerStatuses) {
var f;
for (f = 0; f < e.status.containerStatuses.length; ++f) {
var g = e.status.containerStatuses[f];
if (g.state) {
if (c(g)) return !0;
if (b(g)) return !0;
if (d(g)) return !0;
}
}
}
return !1;
};
} ]).filter("podWarnings", [ "isPodStuckFilter", "isContainerLoopingFilter", "isContainerFailedFilter", "isContainerUnpreparedFilter", "isTerminatingFilter", function(a, b, c, d, e) {
return function(f) {
var g = [];
return "Unknown" === f.status.phase && g.push({
reason:"Unknown",
pod:f.metadata.name,
message:"The state of the pod could not be obtained. This is typically due to an error communicating with the host of the pod."
}), a(f) && g.push({
reason:"Stuck",
pod:f.metadata.name,
message:"The pod has been stuck in the pending state for more than five minutes."
}), "Running" === f.status.phase && f.status.containerStatuses && _.each(f.status.containerStatuses, function(a) {
return !!a.state && (c(a) && (e(f) ? g.push({
severity:"error",
reason:"NonZeroExitTerminatingPod",
pod:f.metadata.name,
container:a.name,
message:"The container " + a.name + " did not stop cleanly when terminated (exit code " + a.state.terminated.exitCode + ")."
}) :g.push({
severity:"warning",
reason:"NonZeroExit",
pod:f.metadata.name,
container:a.name,
message:"The container " + a.name + " failed (exit code " + a.state.terminated.exitCode + ")."
})), b(a) && g.push({
severity:"error",
reason:"Looping",
pod:f.metadata.name,
container:a.name,
message:"The container " + a.name + " is crashing frequently. It must wait before it will be restarted again."
}), void (d(a) && g.push({
severity:"warning",
reason:"Unprepared",
pod:f.metadata.name,
container:a.name,
message:"The container " + a.name + " has been running for more than five minutes and has not passed its readiness check."
})));
}), g.length > 0 ? g :null;
};
} ]).filter("groupedPodWarnings", [ "podWarningsFilter", function(a) {
return function(b, c) {
var d = c || {};
return _.each(b, function(b) {
var c = a(b);
_.each(c, function(a) {
var b = a.reason + (a.container || "");
d[b] = d[b] || [], d[b].push(a);
});
}), d;
};
} ]).filter("troubledPods", [ "isTroubledPodFilter", function(a) {
return function(b) {
var c = [];
return angular.forEach(b, function(b) {
a(b) && c.push(b);
}), c;
};
} ]).filter("notTroubledPods", [ "isTroubledPodFilter", function(a) {
return function(b) {
var c = [];
return angular.forEach(b, function(b) {
a(b) || c.push(b);
}), c;
};
} ]).filter("projectOverviewURL", [ "Navigate", function(a) {
return function(b) {
return angular.isString(b) ? a.projectOverviewURL(b) :angular.isObject(b) ? a.projectOverviewURL(b.metadata && b.metadata.name) :a.projectOverviewURL("");
};
} ]).filter("createFromSourceURL", function() {
return function(a, b) {
var c = URI.expand("project/{project}/catalog/images{?q*}", {
project:a,
q:{
builderfor:b
}
});
return c.toString();
};
}).filter("createFromImageURL", [ "Navigate", function(a) {
return function(b, c, d, e) {
return a.createFromImageURL(b, c, d, e);
};
} ]).filter("createFromTemplateURL", [ "Navigate", function(a) {
return function(b, c, d) {
return a.createFromTemplateURL(b, c, d);
};
} ]).filter("failureObjectName", function() {
return function(a) {
if (!a.data || !a.data.details) return null;
var b = a.data.details;
return b.kind ? b.id ? b.kind + " " + b.id :b.kind :b.id;
};
}).filter("isIncompleteBuild", [ "ageLessThanFilter", function(a) {
return function(a) {
if (!a || !a.status || !a.status.phase) return !1;
switch (a.status.phase) {
case "New":
case "Pending":
case "Running":
return !0;

default:
return !1;
}
};
} ]).filter("isRecentBuild", [ "ageLessThanFilter", "isIncompleteBuildFilter", function(a, b) {
return function(c) {
if (!(c && c.status && c.status.phase && c.metadata)) return !1;
if (b(c)) return !0;
var d = c.status.completionTimestamp || c.metadata.creationTimestamp;
return a(d, 5, "minutes");
};
} ]).filter("deploymentCauses", [ "annotationFilter", function(a) {
return function(b) {
if (!b) return [];
var c = a(b, "encodedDeploymentConfig");
if (!c) return [];
try {
var d = $.parseJSON(c);
if (!d) return [];
switch (d.apiVersion) {
case "v1beta1":
return d.details.causes;

case "v1beta3":
case "v1":
return d.status.details ? d.status.details.causes :[];

default:
return Logger.error('Unknown API version "' + d.apiVersion + '" in encoded deployment config for deployment ' + b.metadata.name), d.status && d.status.details && d.status.details.causes ? d.status.details.causes :[];
}
} catch (e) {
return Logger.error("Failed to parse encoded deployment config", e), [];
}
};
} ]).filter("desiredReplicas", function() {
return function(a) {
return a && a.spec ? void 0 === a.spec.replicas ? 1 :a.spec.replicas :0;
};
}).filter("serviceImplicitDNSName", function() {
return function(a) {
return a && a.metadata && a.metadata.name && a.metadata.namespace ? a.metadata.name + "." + a.metadata.namespace + ".svc" :"";
};
}).filter("podsForPhase", function() {
return function(a, b) {
var c = [];
return angular.forEach(a, function(a) {
a.status.phase === b && c.push(a);
}), c;
};
}).filter("numContainersReady", function() {
return function(a) {
var b = 0;
return angular.forEach(a.status.containerStatuses, function(a) {
a.ready && b++;
}), b;
};
}).filter("numContainerRestarts", function() {
return function(a) {
var b = 0;
return angular.forEach(a.status.containerStatuses, function(a) {
b += a.restartCount;
}), b;
};
}).filter("isTerminating", function() {
return function(a) {
return _.has(a, "metadata.deletionTimestamp");
};
}).filter("isPullingImage", function() {
return function(a) {
if (!a) return !1;
var b = _.get(a, "status.phase");
if ("Pending" !== b) return !1;
var c = _.get(a, "status.containerStatuses");
if (!c) return !1;
var d = function(a) {
return "ContainerCreating" === _.get(a, "state.waiting.reason");
};
return _.some(c, d);
};
}).filter("newestResource", function() {
return function(a) {
var b = null;
return angular.forEach(a, function(a) {
if (b) moment(b.metadata.creationTimestamp).isBefore(a.metadata.creationTimestamp) && (b = a); else {
if (!a.metadata.creationTimestamp) return;
b = a;
}
}), b;
};
}).filter("deploymentIsLatest", [ "annotationFilter", function(a) {
return function(b, c) {
if (!c || !b) return !1;
var d = parseInt(a(b, "deploymentVersion")), e = c.status.latestVersion;
return d === e;
};
} ]).filter("deploymentStatus", [ "annotationFilter", "hasDeploymentConfigFilter", function(a, b) {
return function(c) {
if (a(c, "deploymentCancelled")) return "Cancelled";
var d = a(c, "deploymentStatus");
return !b(c) || "Complete" === d && c.spec.replicas > 0 ? "Active" :d;
};
} ]).filter("deploymentIsInProgress", [ "deploymentStatusFilter", function(a) {
return function(b) {
return [ "New", "Pending", "Running" ].indexOf(a(b)) > -1;
};
} ]).filter("anyDeploymentIsInProgress", [ "deploymentIsInProgressFilter", function(a) {
return function(b) {
return _.some(b, a);
};
} ]).filter("hasDeployment", [ "DeploymentsService", function(a) {
return function(b) {
return !!a.getRevision(b);
};
} ]).filter("hasDeploymentConfig", [ "annotationFilter", function(a) {
return function(b) {
return !!a(b, "deploymentConfig");
};
} ]).filter("getActiveDeployment", [ "DeploymentsService", function(a) {
return function(b) {
return a.getActiveDeployment(b);
};
} ]).filter("isRecentDeployment", [ "deploymentIsLatestFilter", "deploymentIsInProgressFilter", function(a, b) {
return function(c, d) {
return !!a(c, d) || !!b(c);
};
} ]).filter("buildStrategy", function() {
return function(a) {
if (!a || !a.spec || !a.spec.strategy) return null;
switch (a.spec.strategy.type) {
case "Source":
return a.spec.strategy.sourceStrategy;

case "Docker":
return a.spec.strategy.dockerStrategy;

case "Custom":
return a.spec.strategy.customStrategy;

case "JenkinsPipeline":
return a.spec.strategy.jenkinsPipelineStrategy;

default:
return null;
}
};
}).filter("isJenkinsPipelineStrategy", function() {
return function(a) {
return "JenkinsPipeline" === _.get(a, "spec.strategy.type");
};
}).filter("jenkinsLogURL", [ "annotationFilter", function(a) {
return function(b, c) {
var d = a(b, "jenkinsLogURL");
return !d || c ? d :d.replace(/\/consoleText$/, "/console");
};
} ]).filter("jenkinsBuildURL", [ "annotationFilter", "jenkinsLogURLFilter", function(a, b) {
return function(b) {
return a(b, "jenkinsBuildURL");
};
} ]).filter("jenkinsInputURL", [ "jenkinsBuildURLFilter", function(a) {
return function(b) {
var c = a(b);
return c ? new URI(c).segment("/input/").toString() :null;
};
} ]).filter("buildLogURL", [ "isJenkinsPipelineStrategyFilter", "jenkinsLogURLFilter", "navigateResourceURLFilter", function(a, b, c) {
return function(d) {
if (a(d)) return b(d);
var e = c(d);
return e ? new URI(e).addSearch("tab", "logs").toString() :null;
};
} ]).filter("jenkinsfileLink", [ "isJenkinsPipelineStrategyFilter", "githubLinkFilter", function(a, b) {
return function(c) {
if (!a(c) || _.has(c, "spec.strategy.jenkinsPipelineStrategy.jenkinsfile")) return "";
var d = _.get(c, "spec.source.git.uri");
if (!d) return "";
var e = _.get(c, "spec.source.git.ref"), f = _.get(c, "spec.strategy.jenkinsPipelineStrategy.jenkinsfilePath", "Jenkinsfile"), g = _.get(c, "spec.source.contextDir");
g && (f = URI.joinPaths(g, f).path());
var h = b(d, e, f);
return URI(h).is("url") ? h :"";
};
} ]).filter("pipelineStageComplete", function() {
return function(a) {
return !!a && _.indexOf([ "ABORTED", "FAILED", "SUCCESS" ], a.status) !== -1;
};
}).filter("pipelineStagePendingInput", function() {
return function(a) {
return !!a && "PAUSED_PENDING_INPUT" === a.status;
};
}).filter("deploymentStrategyParams", function() {
return function(a) {
var b = _.get(a, "spec.strategy.type");
switch (b) {
case "Recreate":
return _.get(a, "spec.strategy.recreateParams", {});

case "Rolling":
return _.get(a, "spec.strategy.rollingParams", {});

case "Custom":
return _.get(a, "spec.strategy.customParams", {});

default:
return null;
}
};
}).filter("humanizeTLSTermination", function() {
return function(a) {
switch (a) {
case "edge":
return "Edge";

case "passthrough":
return "Passthrough";

case "reencrypt":
return "Re-encrypt";

default:
return a;
}
};
}).filter("humanizeKind", [ "startCaseFilter", function(a) {
return function(a, b) {
if (!a) return a;
var c = _.startCase(a);
return b ? c :c.toLowerCase();
};
} ]).filter("kindToResource", [ "APIService", function(a) {
return a.kindToResource;
} ]).filter("abbreviateResource", [ "APIService", function(a) {
var b = {
buildconfigs:"bc",
deploymentconfigs:"dc",
horizontalpodautoscalers:"hpa",
imagestreams:"is",
imagestreamtags:"istag",
replicasets:"rs",
replicationcontrollers:"rc",
services:"svc"
};
return function(a) {
return b[a] || a;
};
} ]).filter("humanizeQuotaResource", function() {
return function(a, b) {
if (!a) return a;
var c = {
configmaps:"Config Maps",
cpu:"CPU (Request)",
"limits.cpu":"CPU (Limit)",
"limits.memory":"Memory (Limit)",
memory:"Memory (Request)",
"openshift.io/imagesize":"Image Size",
"openshift.io/imagestreamsize":"Image Stream Size",
"openshift.io/projectimagessize":"Project Image Size",
persistentvolumeclaims:"Persistent Volume Claims",
pods:"Pods",
replicationcontrollers:"Replication Controllers",
"requests.cpu":"CPU (Request)",
"requests.memory":"Memory (Request)",
resourcequotas:"Resource Quotas",
secrets:"Secrets",
services:"Services",
"services.loadbalancers":"Service Load Balancers",
"services.nodeports":"Service Node Ports"
}, d = {
configmaps:"config maps",
cpu:"CPU (request)",
"limits.cpu":"CPU (limit)",
"limits.memory":"memory (limit)",
memory:"memory (request)",
"openshift.io/imagesize":"image size",
"openshift.io/imagestreamsize":"image stream size",
"openshift.io/projectimagessize":"project image size",
persistentvolumeclaims:"persistent volume claims",
replicationcontrollers:"replication controllers",
"requests.cpu":"CPU (request)",
"requests.memory":"memory (request)",
resourcequotas:"resource quotas",
"services.loadbalancers":"service load balancers",
"services.nodeports":"service node ports"
};
return b ? c[a] || a :d[a] || a;
};
}).filter("routeTargetPortMapping", [ "RoutesService", function(a) {
var b = function(a, b, c) {
a = a || "<unknown>", b = b || "<unknown>";
var d = "Service Port " + a + " → Container Port " + b;
return c && (d += " (" + c + ")"), d;
};
return function(c, d) {
if (!c.spec.port || !c.spec.port.targetPort || !d) return "";
var e = c.spec.port.targetPort, f = a.getServicePortForRoute(e, d);
return f ? b(f.port, f.targetPort, f.protocol) :angular.isString(e) ? b(e, null) :b(null, e);
};
} ]).filter("podStatus", function() {
return function(a) {
if (!a || !a.metadata.deletionTimestamp && !a.status) return "";
if (a.metadata.deletionTimestamp) return "Terminating";
var b = a.status.reason || a.status.phase;
return angular.forEach(a.status.containerStatuses, function(a) {
var c, d, e = _.get(a, "state.waiting.reason") || _.get(a, "state.terminated.reason");
return e ? void (b = e) :(c = _.get(a, "state.terminated.signal")) ? void (b = "Signal: " + c) :(d = _.get(a, "state.terminated.exitCode"), void (d && (b = "Exit Code: " + d)));
}), b;
};
}).filter("podStartTime", function() {
return function(a) {
var b = null;
return _.each(_.get(a, "status.containerStatuses"), function(a) {
var c = _.get(a, "state.running") || _.get(a, "state.terminated");
c && (b && !moment(c.startedAt).isBefore(b) || (b = c.startedAt));
}), b;
};
}).filter("podCompletionTime", function() {
return function(a) {
var b = null;
return _.each(_.get(a, "status.containerStatuses"), function(a) {
var c = _.get(a, "state.terminated");
c && (b && !moment(c.finishedAt).isAfter(b) || (b = c.finishedAt));
}), b;
};
}).filter("routeIngressCondition", function() {
return function(a, b) {
return a ? _.find(a.conditions, {
type:b
}) :null;
};
}).filter("routeHost", function() {
return function(a) {
if (!_.get(a, "status.ingress")) return _.get(a, "spec.host");
if (!a.status.ingress) return a.spec.host;
var b = null;
return angular.forEach(a.status.ingress, function(a) {
_.some(a.conditions, {
type:"Admitted",
status:"True"
}) && (!b || b.lastTransitionTime > a.lastTransitionTime) && (b = a);
}), b ? b.host :a.spec.host;
};
}).filter("isRequestCalculated", [ "LimitRangesService", function(a) {
return function(b, c) {
return a.isRequestCalculated(b, c);
};
} ]).filter("isLimitCalculated", [ "LimitRangesService", function(a) {
return function(b, c) {
return a.isLimitCalculated(b, c);
};
} ]).filter("hpaCPUPercent", [ "HPAService", "LimitRangesService", function(a, b) {
return function(c, d) {
return c && b.isRequestCalculated("cpu", d) ? a.convertRequestPercentToLimit(c, d) :c;
};
} ]).filter("hasHealthChecks", function() {
return function(a) {
var b = _.get(a, "spec.containers", []);
return _.every(b, function(a) {
return a.readinessProbe || a.livenessProbe;
});
};
}).filter("scopeDetails", [ "sentenceCaseFilter", function(a) {
var b = {
Terminating:"Affects pods that have an active deadline. These pods usually include builds, deployers, and jobs.",
NotTerminating:"Affects pods that do not have an active deadline. These pods usually include your applications.",
BestEffort:"Affects pods that do not have resource limits set. These pods have a best effort quality of service.",
NotBestEffort:"Affects pods that have at least one resource limit set. These pods do not have a best effort quality of service."
};
return function(c) {
return b[c] || a(c);
};
} ]).filter("isDebugPod", [ "annotationFilter", function(a) {
return function(b) {
return !!a(b, "debug.openshift.io/source-resource");
};
} ]).filter("debugPodSourceName", [ "annotationFilter", function(a) {
return function(b) {
var c = a(b, "debug.openshift.io/source-resource");
if (!c) return "";
var d = c.split("/");
return 2 !== d.length ? (Logger.warn('Invalid debug.openshift.io/source-resource annotation value "' + c + '"'), "") :d[1];
};
} ]).filter("entrypoint", function() {
var a = function(a) {
return _.isArray(a) ? a.join(" ") :a;
};
return function(b, c) {
if (!b) return null;
var d, e = a(b.command), f = a(b.args);
if (e && f) return e + " " + f;
if (e) return e;
if (c) {
if (d = a(_.get(c, "dockerImageMetadata.Config.Entrypoint") || [ "/bin/sh", "-c" ]), f) return d + " " + f;
if (e = a(_.get(c, "dockerImageMetadata.Config.Cmd"))) return d + " " + e;
}
return f ? "<image-entrypoint> " + f :null;
};
}).filter("unidleTargetReplicas", [ "annotationFilter", function(a) {
return function(b, c) {
var d;
if (b) try {
d = parseInt(a(b, "idledPreviousScale"));
} catch (e) {
Logger.error("Unable to parse previous scale annotation as a number.");
}
return d || _.get(_.first(c), "spec.minReplicas") || 1;
};
} ]).filter("lastDeploymentRevision", [ "annotationFilter", function(a) {
return function(b) {
if (!b) return "";
var c = a(b, "deployment.kubernetes.io/revision");
return c ? "#" + c :"Unknown";
};
} ]).filter("hasPostCommitHook", function() {
return function(a) {
return _.has(a, "spec.postCommit.command") || _.has(a, "spec.postCommit.script") || _.has(a, "spec.postCommit.args");
};
}).filter("volumeMountMode", function() {
var a = function(a) {
return _.has(a, "configMap") || _.has(a, "secret");
};
return function(b, c) {
if (!b) return "";
var d = _.find(c, {
name:b.name
});
return a(d) ? "read-only" :_.get(d, "persistentVolumeClaim.readOnly") ? "read-only" :b.readOnly ? "read-only" :"read-write";
};
}).filter("managesRollouts", [ "APIService", function(a) {
return function(b) {
if (!b) return !1;
var c = a.objectToResourceGroupVersion(b);
return "deploymentconfigs" === c.resource && !c.group || "deployments" === c.resource && "extensions" === c.group;
};
} ]), angular.module("openshiftConsole").filter("canI", [ "AuthorizationService", function(a) {
return function(b, c, d) {
return a.canI(b, c, d);
};
} ]).filter("canIAddToProject", [ "AuthorizationService", function(a) {
return function(b) {
return a.canIAddToProject(b);
};
} ]).filter("canIDoAny", [ "canIFilter", function(a) {
var b = {
buildConfigs:[ {
group:"",
resource:"buildconfigs",
verbs:[ "delete", "update" ]
}, {
group:"",
resource:"buildconfigs/instantiate",
verbs:[ "create" ]
} ],
builds:[ {
group:"",
resource:"builds/clone",
verbs:[ "create" ]
}, {
group:"",
resource:"builds",
verbs:[ "delete", "update" ]
} ],
configmaps:[ {
group:"",
resource:"configmaps",
verbs:[ "update", "delete" ]
} ],
deployments:[ {
group:"extensions",
resource:"horizontalpodautoscalers",
verbs:[ "create", "update" ]
}, {
group:"extensions",
resource:"deployments",
verbs:[ "create", "update" ]
} ],
deploymentConfigs:[ {
group:"extensions",
resource:"horizontalpodautoscalers",
verbs:[ "create", "update" ]
}, {
group:"",
resource:"deploymentconfigs",
verbs:[ "create", "update" ]
} ],
horizontalPodAutoscalers:[ {
group:"extensions",
resource:"horizontalpodautoscalers",
verbs:[ "update", "delete" ]
} ],
imageStreams:[ {
group:"",
resource:"imagestreams",
verbs:[ "update", "delete" ]
} ],
persistentVolumeClaims:[ {
group:"",
resource:"persistentvolumeclaims",
verbs:[ "update", "delete" ]
} ],
pods:[ {
group:"",
resource:"pods",
verbs:[ "update", "delete" ]
}, {
group:"",
resource:"deploymentconfigs",
verbs:[ "update" ]
} ],
replicaSets:[ {
group:"extensions",
resource:"horizontalpodautoscalers",
verbs:[ "create", "update" ]
}, {
group:"extensions",
resource:"replicasets",
verbs:[ "update", "delete" ]
} ],
replicationControllers:[ {
group:"",
resource:"replicationcontrollers",
verbs:[ "update", "delete" ]
} ],
routes:[ {
group:"",
resource:"routes",
verbs:[ "update", "delete" ]
} ],
services:[ {
group:"",
resource:"services",
verbs:[ "update", "create", "delete" ]
} ],
secrets:[ {
group:"",
resource:"secrets",
verbs:[ "update", "delete" ]
} ],
projects:[ {
group:"",
resource:"projects",
verbs:[ "delete", "update" ]
} ],
statefulsets:[ {
group:"apps",
resource:"statefulsets",
verbs:[ "update", "delete" ]
} ]
};
return function(c) {
return _.some(b[c], function(b) {
return _.some(b.verbs, function(c) {
return a({
resource:b.resource,
group:b.group
}, c);
});
});
};
} ]).filter("canIScale", [ "canIFilter", "hasDeploymentConfigFilter", "DeploymentsService", function(a, b, c) {
return function(b) {
var d = c.getScaleResource(b);
return a(d, "update");
};
} ]), angular.module("openshiftConsole").filter("underscore", function() {
return function(a) {
return a.replace(/\./g, "_");
};
}).filter("defaultIfBlank", function() {
return function(a, b) {
return null === a ? b :("string" != typeof a && (a = String(a)), 0 === a.trim().length ? b :a);
};
}).filter("keys", function() {
return _.keys;
}).filter("hashSize", function() {
return function(a) {
return a ? Object.keys(a).length :0;
};
}).filter("usageValue", function() {
return function(a) {
if (!a) return a;
var b = /(-?[0-9\.]+)\s*(.*)/.exec(a);
if (!b) return a;
var c = b[1];
c = c.indexOf(".") >= 0 ? parseFloat(c) :parseInt(b[1]);
var d = b[2], e = 1;
switch (d) {
case "E":
e = Math.pow(1e3, 6);
break;

case "P":
e = Math.pow(1e3, 5);
break;

case "T":
e = Math.pow(1e3, 4);
break;

case "G":
e = Math.pow(1e3, 3);
break;

case "M":
e = Math.pow(1e3, 2);
break;

case "K":
case "k":
e = 1e3;
break;

case "m":
e = .001;
break;

case "Ei":
e = Math.pow(1024, 6);
break;

case "Pi":
e = Math.pow(1024, 5);
break;

case "Ti":
e = Math.pow(1024, 4);
break;

case "Gi":
e = Math.pow(1024, 3);
break;

case "Mi":
e = Math.pow(1024, 2);
break;

case "Ki":
e = 1024;
}
return c * e;
};
}).filter("humanizeUnit", function() {
return function(a, b, c) {
switch (b) {
case "memory":
case "limits.memory":
case "requests.memory":
case "storage":
return a ? a + "B" :a;

case "cpu":
case "limits.cpu":
case "requests.cpu":
"m" === a && (a = "milli");
var d = c ? "core" :"cores";
return (a || "") + d;

default:
return a;
}
};
}).filter("amountAndUnit", [ "humanizeUnitFilter", function(a) {
return function(b, c, d) {
if (!b) return [ b, null ];
var e = /(-?[0-9\.]+)\s*(.*)/.exec(b);
if (!e) return [ b, null ];
var f = e[1], g = e[2];
return d && (g = a(g, c, "1" === f)), [ f, g ];
};
} ]).filter("usageWithUnits", [ "amountAndUnitFilter", function(a) {
return function(b, c) {
var d = _.spread(function(a, b) {
return b ? a + " " + b :a;
});
return d(a(b, c, !0));
};
} ]).filter("humanizeSize", function() {
return function(a) {
if (null === a || void 0 === a || "" === a) return a;
if (a = Number(a), a < 1024) return a + " bytes";
var b = a / 1024;
if (b < 1024) return b.toFixed(1) + " KiB";
var c = b / 1024;
if (c < 1024) return c.toFixed(1) + " MiB";
var d = c / 1024;
return d.toFixed(1) + " GiB";
};
}).filter("computeResourceLabel", function() {
return function(a, b) {
switch (a) {
case "cpu":
return "CPU";

case "memory":
return b ? "Memory" :"memory";

default:
return a;
}
};
}).filter("helpLink", [ "Constants", function(a) {
return function(b) {
var c = a.HELP[b] || a.HELP["default"];
return URI(c).is("absolute") || (c = a.HELP_BASE_URL + c), c;
};
} ]).filter("taskTitle", function() {
return function(a) {
return "completed" !== a.status ? a.titles.started :a.hasErrors ? a.titles.failure :a.titles.success;
};
}).filter("httpHttps", function() {
return function(a) {
return a ? "https://" :"http://";
};
}).filter("isGithubLink", function() {
var a = /^(?:https?:\/\/|git:\/\/|git\+ssh:\/\/|git\+https:\/\/)?(?:[^@]+@)?github\.com[:\/]([^\/]+\/[^\/]+?)(\/|(?:\.git(#.*)?))?$/;
return function(b) {
return b ? a.test(b) :b;
};
}).filter("githubLink", function() {
return function(a, b, c) {
var d = a.match(/^(?:https?:\/\/|git:\/\/|git\+ssh:\/\/|git\+https:\/\/)?(?:[^@]+@)?github\.com[:\/]([^\/]+\/[^\/]+?)(\/|(?:\.git(#.*)?))?$/);
return d && (a = "https://github.com/" + d[1], c && "/" === c.charAt(0) && (c = c.substring(1)), c ? (c = encodeURIComponent(c), c = c.replace("%2F", "/"), a += "/tree/" + encodeURIComponent(b || "master") + "/" + c) :b && "master" !== b && (a += "/tree/" + encodeURIComponent(b))), a;
};
}).filter("yesNo", function() {
return function(a) {
return a ? "Yes" :"No";
};
}).filter("valuesIn", function() {
return function(a, b) {
if (!b) return {};
var c = b.split(","), d = {};
return angular.forEach(a, function(a, b) {
c.indexOf(b) !== -1 && (d[b] = a);
}), d;
};
}).filter("valuesNotIn", function() {
return function(a, b) {
if (!b) return a;
var c = b.split(","), d = {};
return angular.forEach(a, function(a, b) {
c.indexOf(b) === -1 && (d[b] = a);
}), d;
};
}).filter("toArray", function() {
return function(a) {
if (!a) return [];
if (angular.isArray(a)) return a;
var b = [];
return angular.forEach(a, function(a) {
b.push(a);
}), b;
};
}).filter("stripSHAPrefix", function() {
return function(a) {
return a ? a.replace(/^sha256:/, "") :a;
};
}).filter("limitToOrAll", [ "limitToFilter", function(a) {
return function(b, c) {
return isNaN(c) ? b :a(b, c);
};
} ]).filter("getErrorDetails", [ "upperFirstFilter", function(a) {
return function(b, c) {
var d = b.data || {};
if (d.message) return c ? a(d.message) :d.message;
var e = b.status || d.status;
return e ? "Status: " + e :"";
};
} ]).filter("humanize", function() {
return function(a) {
return a.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/\b([A-Z]+)([A-Z])([a-z])/, "$1 $2$3").replace(/^./, function(a) {
return a.toUpperCase();
});
};
}).filter("parseJSON", function() {
return function(a) {
if (!a) return null;
try {
var b = JSON.parse(a);
return "object" == typeof b ? b :null;
} catch (c) {
return null;
}
};
}).filter("prettifyJSON", [ "parseJSONFilter", function(a) {
return function(b) {
var c = a(b);
return c ? JSON.stringify(c, null, 4) :b;
};
} ]).filter("navigateResourceURL", [ "Navigate", function(a) {
return function(b, c, d, e) {
return a.resourceURL(b, c, d, null, {
apiVersion:e
});
};
} ]).filter("configURLForResource", [ "Navigate", function(a) {
return function(b, c) {
return a.configURLForResource(b, c);
};
} ]).filter("editResourceURL", [ "Navigate", function(a) {
return function(b, c, d) {
var e = a.resourceURL(b, c, d, "edit");
return e;
};
} ]).filter("editYamlURL", [ "Navigate", function(a) {
return function(b, c) {
return a.yamlURL(b, c);
};
} ]).filter("join", function() {
return function(a, b) {
return b || (b = ","), a.join(b);
};
}).filter("generateName", function() {
return function(a, b) {
a || (a = ""), b || (b = 5);
var c = Math.round(Math.pow(36, b + 1) - Math.random() * Math.pow(36, b)).toString(36).slice(1);
return a + c;
};
}).filter("accessModes", function() {
return function(a, b) {
if (!a) return a;
var c = [];
return angular.forEach(a, function(a) {
var d, e = "long" === b;
switch (a) {
case "ReadWriteOnce":
d = e ? "RWO (Read-Write-Once)" :"Read-Write-Once";
break;

case "ReadOnlyMany":
d = e ? "ROX (Read-Only-Many)" :"Read-Only-Many";
break;

case "ReadWriteMany":
d = e ? "RWX (Read-Write-Many)" :"Read-Write-Many";
break;

default:
d = a;
}
c.push(d);
}), _.uniq(c);
};
}).filter("truncate", function() {
return function(a, b, c, d) {
if (!a) return a;
var e = a;
if (b && (e = e.substring(0, b)), d) {
var f = a.split("\n", d).join("\n").length;
e = e.substring(0, f);
}
if (c !== !1) {
var g = Math.max(4, b - 10), h = e.lastIndexOf(/\s/, g);
h !== -1 && (e = e.substring(0, h));
}
return e;
};
}).filter("middleEllipses", function() {
return function(a, b, c) {
if (b < 3) return a;
if (a.length <= b) return a;
c || (c = "...");
var d = Math.floor((b - 1) / 2), e = a.slice(0, d), f = a.slice(a.length - d);
return e + c + f;
};
}).filter("isNil", function() {
return function(a) {
return null === a || void 0 === a;
};
}).filter("percent", function() {
return function(a, b) {
return null === a || void 0 === a ? a :_.round(100 * Number(a), b) + "%";
};
}).filter("filterCollection", function() {
return function(a, b) {
return a && b ? _.filter(a, b) :a;
};
}).filter("isAbsoluteURL", function() {
return function(a) {
if (!a) return !1;
var b = new URI(a), c = b.protocol();
return b.is("absolute") && ("http" === c || "https" === c);
};
}).filter("altTextForValueFrom", function() {
return function(a) {
a.value || a.valueFrom && (a.valueIcon = "pficon pficon-help", a.valueIconTooltip = "This is a referenced value that will be generated when a container is created.  On running pods you can check the resolved values by going to the Terminal tab and echoing the environment variable.", _.each(a.valueFrom, function(b, c) {
switch (c) {
case "configMapKeyRef":
a.valueAlt = "Set to the key " + b.key + " in config map " + b.name;
break;

case "secretKeyRef":
a.valueAlt = "Set to the key " + b.key + " in secret " + b.name, a.valueIcon = "fa fa-user-secret";
break;

case "fieldRef":
a.valueAlt = "Set to the field " + b.fieldPath + " in current object";
break;

default:
a.valueAlt = "Set to a reference on a " + c;
}
}));
};
}).filter("isIE", function() {
var a = navigator.userAgent, b = /msie|trident/i.test(a);
return function() {
return b;
};
}).filter("isEdge", function() {
var a = navigator.userAgent, b = /chrome.+? edge/i.test(a);
return function() {
return b;
};
}).filter("abs", function() {
return function(a) {
return Math.abs(a);
};
}).filter("highlightKeywords", [ "KeywordService", function(a) {
return function(b, c, d) {
if (!b) return b;
if (_.isEmpty(c)) return _.escape(b);
_.isString(c) && (c = a.generateKeywords(c));
for (var e, f = _.map(c, function(a) {
return _.isRegExp(a) ? a.source :_.escapeRegExp(a);
}).join("|"), g = "", h = 0, i = d ? "g" :"ig", j = new RegExp(f, i); null !== (e = j.exec(b)); ) h < e.index && (g += _.escape(b.substring(h, e.index))), g += "<mark>" + _.escape(e[0]) + "</mark>", h = j.lastIndex;
return h < b.length && (g += _.escape(b.substring(h))), g;
};
} ]).filter("encodeURIComponent", function() {
return window.encodeURIComponent;
}).filter("linkify", [ "HTMLService", function(a) {
return function(b, c, d) {
return a.linkify(b, c, d);
};
} ]), angular.module("openshiftConsole").filter("camelToLower", function() {
return function(a) {
return a ? _.startCase(a).toLowerCase() :a;
};
}).filter("upperFirst", function() {
return function(a) {
return a ? a.charAt(0).toUpperCase() + a.slice(1) :a;
};
}).filter("sentenceCase", [ "camelToLowerFilter", "upperFirstFilter", function(a, b) {
return function(c) {
if (!c) return c;
var d = a(c);
return b(d);
};
} ]).filter("startCase", function() {
return function(a) {
return a ? _.startCase(a) :a;
};
}).filter("capitalize", function() {
return function(a) {
return _.capitalize(a);
};
}).filter("isMultiline", function() {
return function(a, b) {
if (!a) return !1;
var c = a.search(/\r|\n/);
return c !== -1 && (!b || c !== a.length - 1);
};
}), angular.module("openshiftConsole").directive("affix", [ "$window", function(a) {
return {
restrict:"AE",
scope:{
offsetTop:"@",
offsetBottom:"@"
},
link:function(a, b, c, d) {
b.affix({
offset:{
top:c.offsetTop,
bottom:c.offsetBottom
}
});
}
};
} ]), angular.module("openshiftConsole").factory("logLinks", [ "$anchorScroll", "$document", "$location", "$window", function(a, b, c, d) {
var e = function(a) {
a ? a.scrollTop = 0 :window.scrollTo(null, 0);
}, f = function(a) {
a ? a.scrollTop = a.scrollHeight :window.scrollTo(0, document.body.scrollHeight - document.body.clientHeight);
}, g = function(b, d) {
d.preventDefault(), d.stopPropagation(), c.hash(b), a(b);
}, h = function(a, b) {
if (b) return void d.open(b, "_blank");
var c = {
view:"chromeless"
};
a && a.container && (c.container = a.container), c = _.flatten([ c ]);
var e = new URI();
_.each(c, function(a) {
e.addSearch(a);
}), d.open(e.toString(), "_blank");
}, i = _.template([ "/#/discover?", "_g=(", "time:(", "from:now-1w,", "mode:relative,", "to:now", ")", ")", "&_a=(", "columns:!(kubernetes.container_name,message),", "index:'project.<%= namespace %>.<%= namespaceUid %>.*',", "query:(", "query_string:(", "analyze_wildcard:!t,", 'query:\'kubernetes.pod_name:"<%= podname %>" AND kubernetes.namespace_name:"<%= namespace %>"\'', ")", "),", "sort:!('@timestamp',desc)", ")", "#console_container_name=<%= containername %>", "&console_back_url=<%= backlink %>" ].join("")), j = function(a) {
return i(a);
};
return {
scrollTop:e,
scrollBottom:f,
scrollTo:g,
chromelessLink:h,
archiveUri:j
};
} ]), function() {
var a = "javaLinkExtension";
angular.module(a, [ "openshiftConsole" ]).run([ "AuthService", "BaseHref", "DataService", "extensionRegistry", function(a, b, c, d) {
var e = [ "<div row ", 'ng-show="item.url" ', 'class="icon-row" ', 'title="Connect to container">', '<div class="icon-wrap">', '<i class="fa fa-share" aria-hidden="true"></i>', "</div>", "<div flex>", '<a ng-click="item.onClick($event)" ', 'ng-href="item.url">', "Open Java Console", "</a>", "</div>", "</div>" ].join(""), f = function(a, b, d) {
return new URI(c.url({
resource:"pods/proxy",
name:[ "https", b, d || "" ].join(":"),
namespace:a
})).segment("jolokia/");
};
d.add("container-links", _.spread(function(c, d) {
var g = _.find(c.ports || [], function(a) {
return a.name && "jolokia" === a.name.toLowerCase();
});
if (g && "Running" === _.get(d, "status.phase")) {
var h = d.status.containerStatuses, i = _.find(h, function(a) {
return a.name === c.name;
});
if (i && i.ready) {
var j = d.metadata.name, k = d.metadata.namespace, l = f(k, j, g.containerPort).toString(), m = function(d) {
d.preventDefault(), d.stopPropagation();
var e = window.location.href, f = c.name || "Untitled Container", g = a.UserStore().getToken() || "", h = new URI().path(b).segment("java").segment("").hash(g).query({
jolokiaUrl:l,
title:f,
returnTo:e
});
window.location.href = h.toString();
};
return {
type:"dom",
node:e,
onClick:m,
url:l
};
}
}
}));
} ]), hawtioPluginLoader.addModule(a);
}(), angular.module("openshiftConsole").run([ "extensionRegistry", function(a) {
a.add("nav-help-dropdown", function() {
return [ {
type:"dom",
node:'<li><a target="_blank" href="{{\'default\' | helpLink}}">Documentation</a></li>'
}, {
type:"dom",
node:'<li><a href="command-line">Command Line Tools</a></li>'
}, {
type:"dom",
node:'<li><a href="about">About</a></li>'
} ];
});
} ]), angular.module("openshiftConsole").run([ "extensionRegistry", function(a) {
a.add("nav-user-dropdown", function() {
return [ {
type:"dom",
node:'<li><a href="logout">Log out</a></li>'
} ];
});
} ]), angular.module("openshiftConsole").run([ "extensionRegistry", function(a) {
a.add("nav-dropdown-mobile", _.spread(function(a) {
return [ {
type:"dom",
node:[ "<li>", "<a href=\"{{'default' | helpLink}}\">", '<span class="fa fa-book fa-fw" aria-hidden="true"></span> Documentation', "</a>", "</li>" ].join("")
}, {
type:"dom",
node:[ "<li>", '<a href="command-line">', '<span class="fa fa-terminal" aria-hidden="true"></span> Command Line Tools', "</a>", "</li>" ].join("")
}, {
type:"dom",
node:[ "<li>", '<a href="about">', '<span class="pficon pficon-info fa-fw" aria-hidden="true"></span> About', "</a>", "</li>" ].join("")
}, {
type:"dom",
node:_.template([ "<li>", '<a href="logout">', '<span class="pficon pficon-user fa-fw" aria-hidden="true"></span>', 'Log out <span class="username"><%= userName %></span>', "</a>", "</li>" ].join(""))({
userName:a ? a.fullName || a.metadata.name :""
})
} ];
}));
} ]);