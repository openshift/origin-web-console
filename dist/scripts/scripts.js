"use strict";

function ResourceGroupVersion(a, b, c) {
return this.resource = a, this.group = b, this.version = c, this;
}

window.OPENSHIFT_CONSTANTS = {
HELP:{
cli:"https://docs.openshift.org/latest/cli_reference/overview.html",
get_started_cli:"https://docs.openshift.org/latest/cli_reference/get_started_cli.html",
basic_cli_operations:"https://docs.openshift.org/latest/cli_reference/basic_cli_operations.html",
"build-triggers":"https://docs.openshift.org/latest/dev_guide/builds.html#build-triggers",
webhooks:"https://docs.openshift.org/latest/dev_guide/builds.html#webhook-triggers",
new_app:"https://docs.openshift.org/latest/dev_guide/new_app.html",
"start-build":"https://docs.openshift.org/latest/dev_guide/builds.html#starting-a-build",
"deployment-operations":"https://docs.openshift.org/latest/cli_reference/basic_cli_operations.html#build-and-deployment-cli-operations",
"route-types":"https://docs.openshift.org/latest/architecture/core_concepts/routes.html#route-types",
persistent_volumes:"https://docs.openshift.org/latest/dev_guide/persistent_volumes.html",
compute_resources:"https://docs.openshift.org/latest/dev_guide/compute_resources.html",
pod_autoscaling:"https://docs.openshift.org/latest/dev_guide/pod_autoscaling.html",
application_health:"https://docs.openshift.org/latest/dev_guide/application_health.html",
"default":"https://docs.openshift.org/latest/welcome/index.html"
},
CLI:{
"Latest Release":"https://github.com/openshift/origin/releases/latest"
},
DEFAULT_HPA_CPU_TARGET_PERCENT:80,
DISABLE_OVERVIEW_METRICS:!1,
AVAILABLE_KINDS_BLACKLIST:[ "Binding", "Ingress", "DeploymentConfigRollback" ],
ENABLE_TECH_PREVIEW_FEATURE:{
pipelines:!0
},
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
label:"Pods",
href:"/browse/pods",
prefixes:[ "/browse/pods/" ]
} ]
}, {
header:"Networking",
items:[ {
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
} ]
}, angular.module("openshiftConsole", [ "ngAnimate", "ngCookies", "ngResource", "ngRoute", "ngSanitize", "openshiftUI", "kubernetesUI", "registryUI.images", "ui.bootstrap", "patternfly.charts", "patternfly.sort", "openshiftConsoleTemplates", "ui.ace", "extension-registry", "as.sortable", "ui.select", "key-value-editor", "angular-inview" ]).config([ "$routeProvider", function(a) {
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
controller:"MonitoringController"
}).when("/project/:project/browse", {
redirectTo:function(a) {
return "/project/" + encodeURIComponent(a.project) + "/browse/pods";
}
}).when("/project/:project/browse/builds", {
templateUrl:"views/builds.html",
controller:"BuildsController"
}).when("/project/:project/browse/pipelines", {
templateUrl:"views/pipelines.html",
controller:"PipelinesController"
}).when("/project/:project/browse/builds/:buildconfig", {
templateUrl:"views/browse/build-config.html",
controller:"BuildConfigController"
}).when("/project/:project/browse/pipelines/:buildconfig", {
templateUrl:"views/browse/build-config.html",
controller:"BuildConfigController",
resolve:{
isPipeline:[ "$route", function(a) {
a.current.params.isPipeline = !0;
} ]
}
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
}
}).when("/project/:project/browse/builds/:buildconfig/:build", {
templateUrl:function(a) {
return "chromeless" === a.view ? "views/logs/chromeless-build-log.html" :"views/browse/build.html";
},
controller:"BuildController"
}).when("/project/:project/browse/pipelines/:buildconfig/:build", {
templateUrl:"views/browse/build.html",
controller:"BuildController",
resolve:{
isPipeline:[ "$route", function(a) {
a.current.params.isPipeline = !0;
} ]
}
}).when("/project/:project/browse/builds-noconfig/:build", {
templateUrl:"views/browse/build.html",
controller:"BuildController"
}).when("/project/:project/browse/pipelines-noconfig/:build", {
templateUrl:"views/browse/build.html",
controller:"BuildController",
resolve:{
isPipeline:[ "$route", function(a) {
a.current.params.isPipeline = !0;
} ]
}
}).when("/project/:project/browse/deployments", {
templateUrl:"views/deployments.html",
controller:"DeploymentsController"
}).when("/project/:project/browse/deployment/:deployment", {
templateUrl:"views/browse/deployment.html",
controller:"DeploymentController"
}).when("/project/:project/browse/dc/:deploymentconfig", {
templateUrl:"views/browse/deployment-config.html",
controller:"DeploymentConfigController"
}).when("/project/:project/browse/rs/:replicaSet", {
templateUrl:"views/browse/replica-set.html",
resolve:{
kind:function() {
return "ReplicaSet";
}
},
controller:"ReplicaSetController"
}).when("/project/:project/browse/rc/:replicaSet", {
templateUrl:function(a) {
return "chromeless" === a.view ? "views/logs/chromeless-deployment-log.html" :"views/browse/replica-set.html";
},
resolve:{
kind:function() {
return "ReplicationController";
}
},
controller:"ReplicaSetController"
}).when("/project/:project/browse/events", {
templateUrl:"views/events.html",
controller:"EventsController"
}).when("/project/:project/browse/images", {
templateUrl:"views/images.html",
controller:"ImagesController"
}).when("/project/:project/browse/images/:imagestream", {
templateUrl:"views/browse/imagestream.html",
controller:"ImageStreamController"
}).when("/project/:project/browse/images/:imagestream/:tag", {
templateUrl:"views/browse/image.html",
controller:"ImageController"
}).when("/project/:project/browse/pods", {
templateUrl:"views/pods.html",
controller:"PodsController"
}).when("/project/:project/browse/pods/:pod", {
templateUrl:function(a) {
return "chromeless" === a.view ? "views/logs/chromeless-pod-log.html" :"views/browse/pod.html";
},
controller:"PodController"
}).when("/project/:project/browse/services", {
templateUrl:"views/services.html",
controller:"ServicesController"
}).when("/project/:project/browse/services/:service", {
templateUrl:"views/browse/service.html",
controller:"ServiceController"
}).when("/project/:project/browse/storage", {
templateUrl:"views/storage.html",
controller:"StorageController"
}).when("/project/:project/browse/other", {
templateUrl:"views/other-resources.html",
controller:"OtherResourcesController"
}).when("/project/:project/browse/persistentvolumeclaims/:pvc", {
templateUrl:"views/browse/persistent-volume-claim.html",
controller:"PersistentVolumeClaimController"
}).when("/project/:project/browse/routes", {
templateUrl:"views/browse/routes.html",
controller:"RoutesController"
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
}).when("/project/:project/create", {
templateUrl:"views/create.html",
controller:"CreateController"
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
}).constant("SOURCE_URL_PATTERN", /^((ftp|http|https|git|ssh):\/\/(\w+:{0,1}[^\s@]*@)|git@)?([^\s@]+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/).constant("IS_IOS", /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream).config([ "$httpProvider", "AuthServiceProvider", "RedirectLoginServiceProvider", "AUTH_CFG", "API_CFG", "kubernetesContainerSocketProvider", function(a, b, c, d, e, f) {
a.interceptors.push("AuthInterceptor"), b.LoginService("RedirectLoginService"), b.LogoutService("DeleteTokenLogoutService"), b.UserStore("LocalStorageUserStore"), c.OAuthClientID(d.oauth_client_id), c.OAuthAuthorizeURI(d.oauth_authorize_uri), c.OAuthRedirectURI(URI(d.oauth_redirect_base).segment("oauth").toString()), f.WebSocketFactory = "ContainerWebSocket";
} ]).config([ "$compileProvider", function(a) {
a.aHrefSanitizationWhitelist(/^\s*(https?|mailto|git):/i);
} ]).run([ "$rootScope", "LabelFilter", function(a, b) {
a.$on("$locationChangeSuccess", function(a) {
b.setLabelSelector(new LabelSelector({}, (!0)), !0);
});
} ]).run([ "dateRelativeFilter", "durationFilter", "timeOnlyDurationFromTimestampsFilter", function(a, b, c) {
setInterval(function() {
$(".timestamp[data-timestamp]").text(function(b, c) {
return a($(this).attr("data-timestamp"), $(this).attr("data-drop-suffix")) || c;
});
}, 3e4), setInterval(function() {
$(".duration[data-timestamp]").text(function(a, d) {
var e = $(this).data("timestamp"), f = $(this).data("omit-single"), g = $(this).data("precision"), h = $(this).data("time-only");
return h ? c(e, null) || d :b(e, null, f, g) || d;
});
}, 1e3);
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
return 1 === b.length ? {
group:"",
version:b[0]
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
}, n = function(b) {
var d = a.defer();
g = b;
var j = h.get(b), l = "selfsubjectrulesreviews";
if (!j || j.forceRefresh) if (e.apiInfo(l)) {
c.log("AuthorizationService, loading user rules for " + b + " project");
var n = {
kind:"SelfSubjectRulesReview",
apiVersion:"v1"
};
f.create(l, null, n, {
namespace:b
}).then(function(a) {
var c = k(a.status.rules), e = m(a.status.rules);
h.put(b, {
rules:c,
canAddToProject:e,
forceRefresh:!1,
cacheTimestamp:_.now()
}), d.resolve();
}, function() {
i = !0, d.resolve();
});
} else c.log("AuthorizationService, resource 'selfsubjectrulesreviews' is not part of APIserver. Switching into permissive mode."), i = !0, d.resolve(); else c.log("AuthorizationService, using cached rules for " + b + " project"), _.now() - j.cacheTimestamp >= 6e5 && (j.forceRefresh = !0), d.resolve();
return d.promise;
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
} ]), angular.module("openshiftConsole").factory("DataService", [ "$cacheFactory", "$http", "$ws", "$rootScope", "$q", "API_CFG", "APIService", "Notification", "Logger", "$timeout", function(a, b, c, d, e, f, g, h, i, j) {
function k(a) {
this._data = {}, this._objectsByAttribute(a, "metadata.name", this._data);
}
function l(a, b, c, d) {
for (var e = b.split("."), f = a, g = 0; g < e.length; g++) if (f = f[e[g]], void 0 === f) return;
if ($.isArray(f)) ; else if ($.isPlainObject(f)) for (var h in f) {
var i = f[h];
c[h] || (c[h] = {}), "DELETED" === d ? delete c[h][i] :c[h][i] = a;
} else "DELETED" === d ? delete c[f] :c[f] = a;
}
function m() {
this._listCallbacksMap = {}, this._watchCallbacksMap = {}, this._watchObjectCallbacksMap = {}, this._watchOperationMap = {}, this._listOperationMap = {}, this._resourceVersionMap = {}, this._dataCache = a("dataCache", {
number:25
}), this._immutableDataCache = a("immutableDataCache", {
number:50
}), this._watchOptionsMap = {}, this._watchWebsocketsMap = {}, this._watchPollTimeoutsMap = {}, this._websocketEventsMap = {};
var b = this;
d.$on("$routeChangeStart", function(a, c, d) {
b._websocketEventsMap = {};
});
}
function n(a) {
return decodeURIComponent(window.escape(window.atob(a)));
}
function o(a) {
var b = 3e4;
return a.length >= q && Date.now() - a[0].time < b;
}
function p(a) {
var b = 5;
if (a.length < b) return !1;
for (var c = a.length - b; c < a.length; c++) if ("close" !== a[c].type) return !1;
return !0;
}
k.prototype.by = function(a) {
if ("metadata.name" === a) return this._data;
var b = {};
for (var c in this._data) l(this._data[c], a, b, null);
return b;
}, k.prototype.update = function(a, b) {
l(a, "metadata.name", this._data, b);
}, k.prototype._objectsByAttribute = function(a, b, c, d) {
angular.forEach(a, function(a, e) {
l(a, b, c, d ? d[e] :null);
});
}, m.prototype.list = function(a, b, c, d) {
a = g.toResourceGroupVersion(a);
var e = this._uniqueKey(a, null, b, _.get(d, "http.params")), f = this._listCallbacks(e);
f.add(c), this._isCached(e) ? (f.fire(this._data(e)), f.empty()) :this._listInFlight(e) || this._startListOp(a, b);
}, m.prototype["delete"] = function(a, c, d, f) {
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
}, m.prototype.update = function(a, c, d, f, h) {
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
}, m.prototype.create = function(a, c, d, f, h) {
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
}, m.prototype.batch = function(a, b, c, d) {
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
}, m.prototype.get = function(a, c, d, f) {
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
}, m.prototype.createStream = function(a, b, d, e, f) {
var h = this;
a = g.toResourceGroupVersion(a);
var j, k = f ? "binary.k8s.io" :"base64.binary.k8s.io", l = "stream_", m = {}, o = {}, p = {}, q = {}, r = function() {
return h._getNamespace(a, d, {}).then(function(g) {
var j = 0;
return c({
url:h._urlForResource(a, b, d, !0, _.extend(g, e)),
auth:{},
onopen:function(a) {
_.each(m, function(b) {
b(a);
});
},
onmessage:function(a) {
if (!_.isString(a.data)) return void i.log("log stream response is not a string", a.data);
var b;
f || (b = n(a.data), j += b.length), _.each(o, function(c) {
f ? c(a.data) :c(b, a.data, j);
});
},
onclose:function(a) {
_.each(p, function(b) {
b(a);
});
},
onerror:function(a) {
_.each(q, function(b) {
b(a);
});
},
protocols:k
}).then(function(a) {
return i.log("Streaming pod log", a), a;
});
});
};
return {
onOpen:function(a) {
if (_.isFunction(a)) {
var b = _.uniqueId(l);
return m[b] = a, b;
}
},
onMessage:function(a) {
if (_.isFunction(a)) {
var b = _.uniqueId(l);
return o[b] = a, b;
}
},
onClose:function(a) {
if (_.isFunction(a)) {
var b = _.uniqueId(l);
return p[b] = a, b;
}
},
onError:function(a) {
if (_.isFunction(a)) {
var b = _.uniqueId(l);
return q[b] = a, b;
}
},
remove:function(a) {
m[a] && delete m[a], o[a] && delete o[a], p[a] && delete p[a], q[a] && delete q[a];
},
start:function() {
return j = r();
},
stop:function() {
j.then(function(a) {
a.close();
});
}
};
}, m.prototype.watch = function(a, b, c, d) {
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
}, m.prototype.watchObject = function(a, b, c, d, e) {
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
}, m.prototype.unwatch = function(a) {
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
}, m.prototype.unwatchAll = function(a) {
for (var b = 0; b < a.length; b++) this.unwatch(a[b]);
}, m.prototype._watchCallbacks = function(a) {
return this._watchCallbacksMap[a] || (this._watchCallbacksMap[a] = $.Callbacks()), this._watchCallbacksMap[a];
}, m.prototype._watchObjectCallbacks = function(a) {
return this._watchObjectCallbacksMap[a] || (this._watchObjectCallbacksMap[a] = $.Callbacks()), this._watchObjectCallbacksMap[a];
}, m.prototype._listCallbacks = function(a) {
return this._listCallbacksMap[a] || (this._listCallbacksMap[a] = $.Callbacks()), this._listCallbacksMap[a];
}, m.prototype._watchInFlight = function(a, b) {
return b || b === !1 ? void (this._watchOperationMap[a] = b) :this._watchOperationMap[a];
}, m.prototype._listInFlight = function(a, b) {
return b || b === !1 ? void (this._listOperationMap[a] = b) :this._listOperationMap[a];
}, m.prototype._resourceVersion = function(a, b) {
return b ? void (this._resourceVersionMap[a] = b) :this._resourceVersionMap[a];
}, m.prototype._data = function(a, b) {
return b ? this._dataCache.put(a, new k(b)) :this._dataCache.get(a);
}, m.prototype._immutableData = function(a, b) {
return b ? this._immutableDataCache.put(a, new k(b)) :this._immutableDataCache.get(a);
}, m.prototype._isCached = function(a) {
return this._watchInFlight(a) && this._resourceVersion(a) && !!this._data(a);
}, m.prototype._watchOptions = function(a, b) {
return void 0 === b ? this._watchOptionsMap[a] :void (this._watchOptionsMap[a] = b);
}, m.prototype._watchPollTimeouts = function(a, b) {
return b ? void (this._watchPollTimeoutsMap[a] = b) :this._watchPollTimeoutsMap[a];
}, m.prototype._watchWebsockets = function(a, b) {
return b ? void (this._watchWebsocketsMap[a] = b) :this._watchWebsocketsMap[a];
};
var q = 10;
m.prototype._addWebsocketEvent = function(a, b) {
var c = this._websocketEventsMap[a];
for (c || (c = this._websocketEventsMap[a] = []), c.push({
type:b,
time:Date.now()
}); c.length > q; ) c.shift();
}, m.prototype._isTooManyWebsocketRetries = function(a) {
var b = this._websocketEventsMap[a];
return !!b && (o(b) ? (i.log("Too many websocket open or close events for resource/context in a short period", a, b), !0) :!!p(b) && (i.log("Too many consecutive websocket close events for resource/context", a, b), !0));
};
var r = function(a) {
var b = _.keysIn(_.pick(a, [ "fieldSelector", "labelSelector" ])).sort();
return _.reduce(b, function(c, d, e) {
return c + d + "=" + encodeURIComponent(a[d]) + (e < b.length - 1 ? "&" :"");
}, "?");
};
m.prototype._uniqueKey = function(a, b, c, d) {
var e = c && c.namespace || _.get(c, "project.metadata.name") || c.projectName;
return this._urlForResource(a, b, c, null, angular.extend({}, {}, {
namespace:e
})).toString() + r(d || {});
}, m.prototype._startListOp = function(a, c, d) {
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
}).error(function(b, c, d, e) {
var f = "Failed to list " + a;
0 !== c && (f += " (" + c + ")"), h.error(f);
});
}) :b({
method:"GET",
auth:{},
url:this._urlForResource(a, null, c)
}).success(function(b, g, h, i, j) {
f._listOpComplete(e, a, c, d, b);
}).error(function(b, c, d, e) {
var f = "Failed to list " + a;
0 !== c && (f += " (" + c + ")"), h.error(f);
});
}, m.prototype._listOpComplete = function(a, b, c, d, e) {
e.items || console.warn("List request for " + b + " returned a null items array.  This is an invalid API response.");
var f = e.items || [];
if (e.kind && e.kind.indexOf("List") === e.kind.length - 4 && angular.forEach(f, function(a) {
a.kind || (a.kind = e.kind.slice(0, -4)), a.apiVersion || (a.apiVersion = e.apiVersion);
}), this._resourceVersion(a, e.resourceVersion || e.metadata.resourceVersion), this._data(a, f), this._listCallbacks(a).fire(this._data(a)), this._listCallbacks(a).empty(), this._watchCallbacks(a).fire(this._data(a)), this._listInFlight(a, !1), this._watchCallbacks(a).has()) {
var g = this._watchOptions(a) || {};
g.poll ? (this._watchInFlight(a, !0), this._watchPollTimeouts(a, setTimeout($.proxy(this, "_startListOp", b, c), g.pollInterval || 5e3))) :this._watchInFlight(a) || this._startWatchOp(a, b, c, d, this._resourceVersion(a));
}
}, m.prototype._startWatchOp = function(a, b, d, e, f) {
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
}, m.prototype._watchOpOnOpen = function(a, b, c, d) {
i.log("Websocket opened for resource/context", a, b);
var e = this._uniqueKey(a, null, b, _.get(c, "http.params"));
this._addWebsocketEvent(e, "open");
}, m.prototype._watchOpOnMessage = function(a, b, c, d) {
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
}, m.prototype._watchOpOnClose = function(a, b, c, d) {
var e = d.target, f = this._uniqueKey(a, null, b, _.get(c, "http.params"));
if (!e) return void i.log("Skipping reopen, no eventWS in event", d);
var g = this._watchWebsockets(f);
if (!g) return void i.log("Skipping reopen, no registeredWS for resource/context", a, b);
if (e !== g) return void i.log("Skipping reopen, eventWS does not match registeredWS", e, g);
if (this._watchInFlight(f, !1), e.shouldClose) return void i.log("Skipping reopen, eventWS was explicitly closed", e);
if (d.wasClean) return void i.log("Skipping reopen, clean close", d);
if (!this._watchCallbacks(f).has()) return void i.log("Skipping reopen, no listeners registered for resource/context", a, b);
if (this._isTooManyWebsocketRetries(f)) return void h.error("Server connection interrupted.", {
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
});
if (this._addWebsocketEvent(f, "close"), e.shouldRelist) {
i.log("Relisting for resource/context", a, b);
var j = this;
return void setTimeout(function() {
j.watch(a, b);
}, 2e3);
}
i.log("Rewatching for resource/context", a, b), this._watchInFlight(f, !0), setTimeout($.proxy(this, "_startWatchOp", f, a, b, c, this._resourceVersion(f)), 2e3);
};
var s = "{protocol}://{+hostPort}{+prefix}{/group}/{version}/", t = s + "{resource}{?q*}", u = s + "{resource}/{name}{/subresource*}{?q*}", v = s + "namespaces/{namespace}/{resource}{?q*}", w = s + "namespaces/{namespace}/{resource}/{name}{/subresource*}{?q*}";
m.prototype._urlForResource = function(a, b, c, d, e) {
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
return l = b ? j ? w :u :j ? v :t, URI.expand(l, m).toString();
}, m.prototype.url = function(a) {
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
}, m.prototype.openshiftAPIBaseUrl = function() {
var a = "http:" === window.location.protocol ? "http" :"https", b = f.openshift.hostPort;
return new URI({
protocol:a,
hostname:b
}).toString();
};
var x = {
imagestreamimages:!0
};
return m.prototype._isImmutable = function(a) {
return !!x[a.resource];
}, m.prototype._hasImmutable = function(a, b, c) {
return this._isImmutable(a) && b && b.by("metadata.name")[c];
}, m.prototype._getNamespace = function(a, b, c) {
var d = e.defer();
return c.namespace ? d.resolve({
namespace:c.namespace
}) :b.projectPromise && !a.equals("projects") ? b.projectPromise.done(function(a) {
d.resolve({
namespace:a.metadata.name
});
}) :d.resolve(null), d.promise;
}, new m();
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
}
};
} ]), angular.module("openshiftConsole").service("ApplicationGenerator", [ "DataService", "Logger", "$parse", function(a, b, c) {
var d = {};
return d._generateSecret = function() {
function a() {
return Math.floor(65536 * (1 + Math.random())).toString(16).substring(1);
}
return a() + a() + a() + a();
}, d.parsePorts = function(a) {
var d = function(d) {
var e = [];
return angular.forEach(d, function(d, f) {
var g = f.split("/");
1 === g.length && g.push("tcp");
var h = parseInt(g[0], 10);
isNaN(h) ? b.warn("Container port " + g[0] + " is not a number for image " + c("metadata.name")(a)) :e.push({
containerPort:h,
protocol:g[1].toUpperCase()
});
}), e.sort(function(a, b) {
return a.containerPort - b.containerPort;
}), e;
}, e = c("dockerImageMetadata.Config.ExposedPorts")(a) || c("dockerImageMetadata.ContainerConfig.ExposedPorts")(a) || [];
return d(e);
}, d.generate = function(a) {
var b = d.parsePorts(a.image);
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
var e = {
imageStream:d._generateImageStream(a),
buildConfig:d._generateBuildConfig(a, c, a.labels),
deploymentConfig:d._generateDeploymentConfig(a, c, b, a.labels)
};
a.scaling.autoscale && (e.hpa = d._generateHPA(a, e.deploymentConfig));
var f = d._generateService(a, a.name, b);
return f && (e.service = f, e.route = d._generateRoute(a, a.name, e.service.metadata.name)), e;
}, d.createRoute = function(a, b, c) {
return d._generateRoute({
labels:c || {},
routing:angular.extend({
include:!0
}, a)
}, a.name, b);
}, d._generateRoute = function(a, b, c) {
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
}
}
};
a.routing.host && (d.spec.host = a.routing.host), a.routing.path && (d.spec.path = a.routing.path), a.routing.targetPort && (d.spec.port = {
targetPort:a.routing.targetPort
});
var e = a.routing.tls;
return e && e.termination && (d.spec.tls = {
termination:e.termination
}, "passthrough" !== e.termination && ("edge" === e.termination && e.insecureEdgeTerminationPolicy && (d.spec.tls.insecureEdgeTerminationPolicy = e.insecureEdgeTerminationPolicy), e.certificate && (d.spec.tls.certificate = e.certificate), e.key && (d.spec.tls.key = e.key), e.caCertificate && (d.spec.tls.caCertificate = e.caCertificate), e.destinationCACertificate && "reencrypt" === e.termination && (d.spec.tls.destinationCACertificate = e.destinationCACertificate))), d;
}, d._generateDeploymentConfig = function(a, b, c) {
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
return a.deploymentConfig.deployOnNewImage && h.spec.triggers.push({
type:"ImageChange",
imageChangeParams:{
automatic:!0,
containerNames:[ a.name ],
from:{
kind:b.kind,
name:b.toString()
}
}
}), a.deploymentConfig.deployOnConfigChange && h.spec.triggers.push({
type:"ConfigChange"
}), h;
}, d._generateHPA = function(a, b) {
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
}, d._generateBuildConfig = function(a, b) {
var c = [];
angular.forEach(a.buildConfig.envVars, function(a, b) {
c.push({
name:b,
value:a
});
});
var e = [ {
generic:{
secret:d._generateSecret()
},
type:"Generic"
} ];
a.buildConfig.buildOnSourceChange && e.push({
github:{
secret:d._generateSecret()
},
type:"GitHub"
}), a.buildConfig.buildOnImageChange && e.push({
imageChange:{},
type:"ImageChange"
}), a.buildConfig.buildOnConfigChange && e.push({
type:"ConfigChange"
});
var f = new URI(a.buildConfig.sourceUrl), g = f.fragment();
g || (g = "master"), f.fragment("");
var h = f.href(), i = {
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
triggers:e
}
};
return a.buildConfig.contextDir && (i.spec.source.contextDir = a.buildConfig.contextDir), i;
}, d._generateImageStream = function(a) {
return {
apiVersion:"v1",
kind:"ImageStream",
metadata:{
name:a.name,
labels:a.labels,
annotations:a.annotations
}
};
}, d.getServicePort = function(a) {
return {
port:a.containerPort,
targetPort:a.containerPort,
protocol:a.protocol,
name:(a.containerPort + "-" + a.protocol).toLowerCase()
};
}, d._generateService = function(a, b, c) {
if (!c || !c.length) return null;
var e = {
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
ports:_.map(c, d.getServicePort)
}
};
return e;
}, d;
} ]), angular.module("openshiftConsole").service("AlertMessageService", function() {
var a = [];
return {
addAlert:function(b) {
a.push(b);
},
getAlerts:function() {
return a;
},
clearAlerts:function() {
a = [];
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
}, this.$get = [ "$location", "$q", "Logger", function(d, e, f) {
var g = f.get("auth"), h = function(a) {
var b;
if (window.crypto && window.Uint32Array) try {
var c = new Uint32Array(a);
window.crypto.getRandomValues(c), b = [];
for (var d = 0; d < a; d++) b.push(c[d]);
} catch (e) {
g.debug("RedirectLoginService.getRandomInts: ", e), b = null;
}
if (!b) {
b = [];
for (var f = 0; f < a; f++) b.push(Math.floor(4294967296 * Math.random()));
}
return b;
}, i = "RedirectLoginService.nonce", j = function(a) {
var b = String(new Date().getTime()) + "-" + h(8).join("");
try {
window.localStorage[i] = b;
} catch (c) {
g.log("RedirectLoginService.makeState, localStorage error: ", c);
}
return JSON.stringify({
then:a,
nonce:b
});
}, k = function(a) {
var b = {
then:null,
verified:!1
}, c = "";
try {
c = window.localStorage[i], window.localStorage.removeItem(i);
} catch (d) {
g.log("RedirectLoginService.parseState, localStorage error: ", d);
}
try {
var e = a ? JSON.parse(a) :{};
e && e.nonce && c && e.nonce === c && (b.verified = !0, b.then = e.then);
} catch (d) {
g.error("RedirectLoginService.parseState, state error: ", d);
}
return g.error("RedirectLoginService.parseState", b), b;
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
var f = e.defer(), h = new URI(b), i = new URI(d.url()).fragment("");
return h.query({
client_id:a,
response_type:"token",
state:j(i.toString()),
redirect_uri:c
}), g.log("RedirectLoginService.login(), redirecting", h.toString()), window.location.href = h.toString(), f.promise;
},
finish:function() {
var a = new URI(d.url()), b = a.query(!0), c = new URI("?" + a.fragment()).query(!0);
g.log("RedirectLoginService.finish()", b, c);
var f = b.error || c.error;
if (f) {
var h = b.error_description || c.error_description, i = b.error_uri || c.error_uri;
return g.log("RedirectLoginService.finish(), error", f, h, i), e.reject({
error:f,
error_description:h,
error_uri:i
});
}
var j = k(c.state);
if (c.access_token && "bearer" === (c.token_type || "").toLowerCase()) {
var l = e.defer();
return l.resolve({
token:c.access_token,
ttl:c.expires_in,
then:j.then,
verified:j.verified
}), l.promise;
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
var h = f("annotation"), i = f("buildConfigForBuild"), j = f("isJenkinsPipelineStrategy"), k = function(a, b) {
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
fromTemplateURL:function(a, b, c) {
return c = c || "", "project/" + encodeURIComponent(a) + "/create/fromtemplate?name=" + b + "&namespace=" + c;
},
toNextSteps:function(b, c, d) {
var e = a.search();
e.name = b, _.isObject(d) && _.extend(e, d), a.path("project/" + encodeURIComponent(c) + "/create/next").search(e);
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
var j = f("buildConfigForBuild")(a), l = k(a, e);
j ? i.segment(l).segmentCoded(j).segmentCoded(h) :i.segment(l + "-noconfig").segmentCoded(h);
break;

case "BuildConfig":
i.segment(k(a, e)).segmentCoded(h);
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

default:
i.segment(g.kindToResource(b)).segmentCoded(h);
}
return i.toString();
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
deployments:"deployments",
deploymentconfigs:"deployments",
imagestreams:"images",
pods:"pods",
replicasets:"deployments",
replicationcontrollers:"deployments",
routes:"routes",
services:"services",
persistentvolumeclaims:"storage"
};
return URI.expand("project/{projectName}/browse/{browsePath}", {
projectName:b,
browsePath:c[a]
}).toString();
},
toResourceList:function(b, c) {
a.url(this.resourceListURL(b, c));
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
return b.prototype.add = function(b, e, f) {
var g = {
status:"started",
titles:b,
helpLinks:e
};
this.tasks.push(g), f().then(function(b) {
g.status = "completed", g.hasErrors = b.hasErrors || !1, g.alerts = b.alerts || [], g.hasErrors || a(function() {
d.deleteTask(g);
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
var f = angular.copy(a), g = a.metadata.name, h = c("annotation")(a, "deploymentConfig");
b.list("pods", d, function(a) {
var d = a.by("metadata.name"), f = function(a) {
var d = c("annotationName")("deployerPodFor");
a.metadata.labels[d] === g && b["delete"]("pods", a.metadata.name, e).then(function() {
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
var i = c("annotationName")("deploymentStatus"), j = c("annotationName")("deploymentStatusReason"), k = c("annotationName")("deploymentCancelled");
f.metadata.annotations[i] = "New", delete f.metadata.annotations[j], delete f.metadata.annotations[k], b.update("replicationcontrollers", g, f, d).then(function() {
e.alerts = e.alerts || {}, e.alerts.retry = {
type:"success",
message:"Retrying deployment " + g + " of " + h + "."
};
}, function(a) {
e.alerts = e.alerts || {}, e.alerts.retry = {
type:"error",
message:"An error occurred while retrying the deployment.",
details:c("getErrorDetails")(a)
};
});
}, f.prototype.rollbackToDeployment = function(a, d, e, f, g, h) {
var i = a.metadata.name, j = c("annotation")(a, "deploymentConfig"), k = {
kind:"DeploymentConfigRollback",
apiVersion:"v1",
spec:{
from:{
name:i
},
includeTemplate:!0,
includeReplicationMeta:d,
includeStrategy:e,
includeTriggers:f
}
};
b.create("deploymentconfigrollbacks", null, k, g).then(function(a) {
b.update("deploymentconfigs", j, a, g).then(function(a) {
h.alerts = h.alerts || {}, h.alerts.rollback = {
type:"success",
message:"Deployment #" + a.status.latestVersion + " is rolling back " + j + " to " + i + "."
};
}, function(a) {
h.alerts = h.alerts || {}, h.alerts.rollback = {
type:"error",
message:"An error occurred while rolling back the deployment.",
details:c("getErrorDetails")(a)
};
});
}, function(a) {
h.alerts = h.alerts || {}, h.alerts.rollback = {
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
message:"Cancelling deployment " + f + " of " + g + "."
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
var g = function(a) {
return _.get(a, "spec.template.metadata.labels", {});
}, h = function(a, b) {
var c = _.get(b, [ a ]);
return !_.isEmpty(c);
}, i = function(a, b) {
var c = _.get(b, [ a ]);
return !_.isEmpty(c);
};
return f.prototype.isScalable = function(a, b, d, e, f) {
if (i(a.metadata.name, e)) return !1;
var g = c("annotation")(a, "deploymentConfig");
if (!g) return !0;
if (!b) return !1;
if (!b[g]) return !0;
if (h(g, d)) return !1;
var j = _.get(f, [ g, "metadata", "name" ]);
return j === a.metadata.name;
}, f.prototype.groupByService = function(a, b) {
var c = {};
return _.each(a, function(a) {
var d = new LabelSelector(g(a)), e = !1;
_.each(b, function(b) {
var f = new LabelSelector(b.spec.selector);
f.covers(d) && (e = !0, _.set(c, [ b.metadata.name, a.metadata.name ], a));
}), e || _.set(c, [ "", a.metadata.name ], a);
}), c;
}, f.prototype.groupByDeploymentConfig = function(a) {
var b = {};
return _.each(a, function(a) {
var d = c("annotation")(a, "deploymentConfig") || "";
_.set(b, [ d, a.metadata.name ], a);
}), b;
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
}), angular.module("openshiftConsole").factory("MetricsService", [ "$filter", "$http", "$q", "APIDiscovery", function(a, b, c, d) {
function e() {
return angular.isDefined(k) ? c.when(k) :d.getMetricsURL().then(function(a) {
return k = (a || "").replace(/\/$/, "");
});
}
function f(a) {
if (a.length) return _.each(a, function(a) {
if (!a.value || "NaN" === a.value) {
var b = a.avg;
a.value = b && "NaN" !== b ? b :null;
}
}), a;
}
function g(a) {
return a.join("|");
}
function h() {
return e().then(function(a) {
return a ? a + "/metrics/stats/query" :a;
});
}
function i(a) {
switch (a) {
case "network/rx_rate":
case "network/tx_rate":
return "pod";

default:
return "pod_container";
}
}
function j(a) {
return e().then(function(b) {
var c, d = i(a.metric);
return a.stacked ? (c = b + o, URI.expand(c, {
podName:a.pod.metadata.name,
metric:a.metric,
type:d
}).toString()) :(c = b + n, URI.expand(c, {
podUID:a.pod.metadata.uid,
containerName:a.containerName,
metric:a.metric
}).toString());
});
}
var k, l, m, n = "/gauges/{containerName}%2F{podUID}%2F{metric}/data", o = "/gauges/data?stacked=true&tags=descriptor_name:{metric},type:{type},pod_name:{podName}", p = function(a) {
return e().then(function(c) {
return !!c && (!a || (!!l || !m && b.get(c).then(function() {
return l = !0, !0;
}, function() {
return m = !0, !1;
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
var d = q(c), g = _.get(e, [ d.podUID, "metadata", "name" ]), h = f(a);
_.set(b, [ d.descriptor, g ], h);
};
return _.each(a.data.counter, c), _.each(a.data.gauge, c), b;
});
}, s = _.template("descriptor_name:network/tx_rate|network/rx_rate,type:pod,pod_id:<%= uid %>"), t = _.template("descriptor_name:memory/usage|cpu/usage_rate,type:pod_container,pod_id:<%= uid %>,container_name:<%= containerName %>"), u = function(a) {
return h().then(function(b) {
var d = {
bucketDuration:a.bucketDuration,
start:a.start
};
a.end && (d.end = a.end);
var e = [], f = g(_.map(a.pods, "metadata.uid")), h = _.assign({
tags:t({
uid:f,
containerName:a.containerName
})
}, d);
e.push(r(b, h, a));
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
};
return {
isAvailable:p,
getMetricsURL:e,
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
data:f(b.data)
});
});
});
},
getPodMetrics:u
};
} ]), angular.module("openshiftConsole").factory("StorageService", function() {
return {
createVolume:function(a, b) {
return {
name:a,
persistentVolumeClaim:{
claimName:b.metadata.name
}
};
},
createVolumeMount:function(a, b) {
return {
name:a,
mountPath:b
};
}
};
}), angular.module("openshiftConsole").factory("Constants", function() {
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
angular.forEach(a.status.ingress, function(a) {
var c = _.find(a.conditions, {
type:"Admitted",
status:"False"
});
if (c) {
var d = "Requested host " + (a.host || "<unknown host>") + " was rejected by the router.";
(c.message || c.reason) && (d += " Reason: " + (c.message || c.reason) + "."), b.push(d);
}
});
}, g = function(a) {
return _.some(a.status.ingress, function(a) {
return _.some(a.conditions, {
type:"Admitted",
status:"True"
});
});
}, h = function(b) {
return "true" !== a("annotation")(b, "openshift.io/host.generated");
}, i = function(a) {
var b = 0;
g(a) && (b += 11);
var c = _.get(a, "spec.alternateBackends");
return _.isEmpty(c) || (b += 5), h(a) && (b += 3), a.spec.tls && (b += 1), b;
}, j = function(a, b) {
var c = i(a), d = i(b);
return d > c ? b :a;
}, k = function(a) {
return _.groupBy(a, "spec.to.name");
};
return {
getRouteWarnings:function(a, b) {
var c = [];
return a ? ("Service" === a.spec.to.kind && d(a, b, c), e(a, c), f(a, c), c) :c;
},
getServicePortForRoute:c,
getPreferredDisplayRoute:j,
groupByService:k
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
},
groupByReplicationController:function(a, b) {
var c = {};
return _.each(a, function(a) {
var d = _.find(b, function(b) {
var c = new LabelSelector(b.spec.selector);
return c.matches(a);
}), e = _.get(d, "metadata.name", "");
_.set(c, [ e, a.metadata.name ], a);
}), c;
},
groupByService:function(a, b, c) {
var d = {};
return _.each(a, function(a) {
if (!c || c(a)) {
var e = _.find(b, function(b) {
var c = new LabelSelector(b.spec.selector);
return c.matches(a);
}), f = _.get(e, "metadata.name", "");
_.set(d, [ f, a.metadata.name ], a);
}
}), d;
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
c.push(j);
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
};
return {
findImage:d,
getVolumes:f,
runsAsRoot:e,
getResources:g
};
} ]), angular.module("openshiftConsole").service("KeywordService", function() {
var a = function(a) {
if (!a) return [];
var b = _.uniq(a.split(/\s+/));
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
};
return {
bytesToMiB:a,
bytesToKiB:b
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
} ]), angular.module("openshiftConsole").controller("ProjectsController", [ "$scope", "$route", "$timeout", "$filter", "$location", "DataService", "AuthService", "AlertMessageService", "Logger", "hashSizeFilter", function(a, b, c, d, e, f, g, h, i, j) {
var k = [];
a.projects = {}, a.alerts = a.alerts || {}, a.showGetStarted = !1, a.canCreate = void 0, h.getAlerts().forEach(function(b) {
a.alerts[b.name] = b.data;
}), h.clearAlerts(), g.withUser().then(function() {
k.push(f.watch("projects", a, function(b) {
a.projects = b.by("metadata.name"), a.showGetStarted = 0 === j(a.projects);
}));
}), f.get("projectrequests", null, a, {
errorNotification:!1
}).then(function() {
a.canCreate = !0;
}, function(b) {
a.canCreate = !1;
var c = b.data || {};
if (403 !== b.status) {
var d = "Failed to determine create project permission";
return 0 !== b.status && (d += " (" + b.status + ")"), void i.warn(d);
}
if (c.details) {
var e = [];
_.forEach(c.details.causes || [], function(a) {
a.message && e.push(a.message);
}), e.length > 0 && (a.newProjectMessage = e.join("\n"));
}
}), a.$on("$destroy", function() {
f.unwatchAll(k);
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
} ]), angular.module("openshiftConsole").controller("PodController", [ "$scope", "$filter", "$routeParams", "$timeout", "$uibModal", "DataService", "ImageStreamResolver", "MetricsService", "PodsService", "ProjectsService", function(a, b, c, d, e, f, g, h, i, j) {
a.projectName = c.project, a.pod = null, a.imageStreams = {}, a.imagesByDockerReference = {}, a.imageStreamImageRefByDockerReference = {}, a.builds = {}, a.alerts = {}, a.terminalDisconnectAlert = {}, a.renderOptions = a.renderOptions || {}, a.renderOptions.hideFilterWidget = !0, a.logOptions = {}, a.terminalTabWasSelected = !1, a.breadcrumbs = [ {
title:"Pods",
link:"project/" + c.project + "/browse/pods"
}, {
title:c.pod
} ], a.terminalDisconnectAlert.disconnect = {
type:"warning",
message:"This terminal has been disconnected. If you reconnect, your terminal history will be lost."
}, a.noContainersYet = !0, a.selectedTab = {}, c.tab && (a.selectedTab[c.tab] = !0);
var k = [];
h.isAvailable().then(function(b) {
a.metricsAvailable = b;
});
var l = function(b) {
a.logOptions.container = c.container || b.spec.containers[0].name, a.logCanRun = !_.includes([ "New", "Pending", "Unknown" ], b.status.phase);
}, m = function() {
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
}, n = function() {
var a = $("<span>").css({
position:"absolute",
top:"-100px"
}).addClass("terminal-font").text(_.repeat("x", 10)).appendTo("body"), b = {
width:a.width() / 10,
height:a.height()
};
return a.remove(), b;
}, o = n(), p = $(window), q = function() {
o.height && o.width && a.$apply(function() {
var b = $(".container-terminal-wrapper").get(0);
if (b) {
var c = b.getBoundingClientRect(), d = p.width(), e = p.height(), f = d - c.left - 40, g = e - c.top - 50;
a.terminalCols = Math.max(_.floor(f / o.width), 80), a.terminalRows = Math.max(_.floor(g / o.height), 24);
}
});
};
a.$watch("selectedTab.terminal", function(a) {
a ? (o.height && o.width ? $(window).on("resize.terminalsize", _.debounce(q, 100)) :Logger.warn("Unable to calculate the bounding box for a character.  Terminal will not be able to resize."), d(q, 0)) :$(window).off("resize.terminalsize");
}), a.onTerminalSelectChange = function(b) {
_.each(a.containerTerminals, function(a) {
a.isVisible = !1;
}), b.isVisible = !0, b.isUsed = !0, a.selectedTerminalContainer = b;
};
var r = function(a) {
var b = _.get(a, "state", {});
return _.head(_.keys(b));
}, s = function() {
var b = [];
_.each(a.pod.spec.containers, function(c) {
var d = _.find(a.pod.status.containerStatuses, {
name:c.name
}), e = r(d);
b.push({
containerName:c.name,
isVisible:!1,
isUsed:!1,
containerState:e
});
});
var c = _.head(b);
return c.isVisible = !0, c.isUsed = !0, a.selectedTerminalContainer = c, b;
}, t = function(b) {
a.noContainersYet && (a.noContainersYet = 0 === a.containersRunning(b.status.containerStatuses));
}, u = function(b) {
_.each(b, function(b) {
var c = _.find(a.pod.status.containerStatuses, {
name:b.containerName
}), d = r(c);
b.containerState = d;
});
};
j.get(c.project).then(_.spread(function(d, h) {
a.project = d, a.projectContext = h, f.get("pods", c.pod, h).then(function(b) {
a.loaded = !0, a.pod = b, l(b), m();
var d = {};
d[b.metadata.name] = b, g.fetchReferencedImageStreamImages(d, a.imagesByDockerReference, a.imageStreamImageRefByDockerReference, h), a.containerTerminals = s(), t(b), k.push(f.watchObject("pods", c.pod, h, function(b, c) {
"DELETED" === c && (a.alerts.deleted = {
type:"warning",
message:"This pod has been deleted."
}), a.pod = b, l(b), m(), u(a.containerTerminals), t(b);
}));
}, function(c) {
a.loaded = !0, a.alerts.load = {
type:"error",
message:"The pod details could not be loaded.",
details:"Reason: " + b("getErrorDetails")(c)
};
}), a.$watch("logOptions.container", m), k.push(f.watch("imagestreams", h, function(b) {
a.imageStreams = b.by("metadata.name"), g.buildDockerRefMapForImageStreams(a.imageStreams, a.imageStreamImageRefByDockerReference), g.fetchReferencedImageStreamImages(a.pods, a.imagesByDockerReference, a.imageStreamImageRefByDockerReference, h), Logger.log("imagestreams (subscribe)", a.imageStreams);
})), k.push(f.watch("builds", h, function(b) {
a.builds = b.by("metadata.name"), Logger.log("builds (subscribe)", a.builds);
}));
var j, n = function() {
var c = a.debugPod;
j && (f.unwatch(j), j = null), $(window).off("beforeunload.debugPod"), c && (f["delete"]("pods", c.metadata.name, h, {
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
var d = i.generateDebugPod(a.pod, c);
return d ? void f.create("pods", null, d, h).then(function(b) {
var g = _.find(a.pod.spec.containers, {
name:c
});
a.debugPod = b, $(window).on("beforeunload.debugPod", function() {
return "Are you sure you want to leave with the debug terminal open? The debug pod will not be deleted unless you close the dialog.";
}), j = f.watchObject("pods", d.metadata.name, h, function(b) {
a.debugPod = b;
});
var i = e.open({
animation:!0,
templateUrl:"views/modals/debug-terminal.html",
controller:"DebugTerminalModalController",
scope:a,
resolve:{
container:function() {
return g;
},
image:function() {
return _.get(a, [ "imagesByDockerReference", g.image ]);
}
},
backdrop:"static"
});
i.result.then(n);
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
}, a.$on("$destroy", function() {
f.unwatchAll(k), n(), $(window).off("resize.terminalsize");
});
}));
} ]), angular.module("openshiftConsole").controller("OverviewController", [ "$filter", "$routeParams", "$scope", "AlertMessageService", "BuildsService", "DataService", "DeploymentsService", "Logger", "PodsService", "ProjectsService", "RoutesService", "ServicesService", "Navigate", "MetricsService", function(a, b, c, d, e, f, g, h, i, j, k, l, m, n) {
c.projectName = b.project, c.renderOptions = c.renderOptions || {}, c.renderOptions.showLoading = !0, c.renderOptions.showGetStarted = !1, c.alerts = c.alerts || {}, d.getAlerts().forEach(function(a) {
c.alerts[a.name] = a.data;
}), d.clearAlerts();
var o, p, q, r, s, t, u, v, w, x, y = [], z = a("isJenkinsPipelineStrategy"), A = a("annotation"), B = a("label"), C = a("imageObjectRef"), D = a("isRecentDeployment"), E = {}, F = function() {
E = {}, _.each(o, function(a) {
var b = _.get(a, "spec.alternateBackends", []), c = _.filter(b, {
kind:"Service"
});
_.each(c, function(a) {
E[a.name] = !0;
});
});
}, G = function(a) {
var b = _.get(a, "metadata.name");
return _.has(E, b);
}, H = function() {
c.routesByService = k.groupByService(o), F();
}, I = function() {
p && q && (c.deploymentConfigs = q, c.deploymentConfigsByService = g.groupByService(q, p));
}, J = function() {
r && (c.deploymentsByDeploymentConfig = g.groupByDeploymentConfig(r));
}, K = function(a) {
if (_.get(a, "status.replicas")) return !0;
var b = A(a, "deploymentConfig");
if (!b) return !0;
if (!q) return !1;
var c = q[b];
return !!c && D(a, c);
}, L = function() {
if (p && r) {
c.deploymentsByService = g.groupByService(r, p), J();
var a = {};
_.each(c.deploymentsByDeploymentConfig, function(b, c) {
a[c] = g.getActiveDeployment(b);
}), c.scalableDeploymentByConfig = a, c.visibleDeploymentsByConfigAndService = {}, _.each(c.deploymentsByService, function(a, b) {
c.visibleDeploymentsByConfigAndService[b] = {}, _.each(g.groupByDeploymentConfig(a), function(a, d) {
c.visibleDeploymentsByConfigAndService[b][d] = _.filter(_.values(a), K);
});
});
}
}, M = function() {
w = {}, x = {}, angular.forEach(v, function(a) {
var b = a.spec.scaleRef.name, c = a.spec.scaleRef.kind;
if (b && c) switch (c) {
case "DeploymentConfig":
w[b] = w[b] || [], w[b].push(a);
break;

case "ReplicationController":
x[b] = x[b] || [], x[b].push(a);
break;

default:
h.warn("Unexpected HPA scaleRef kind", c);
}
}), c.hpaByDC = w, c.hpaByRC = x;
}, N = function(a) {
return "Succeeded" !== a.status.phase && "Terminated" !== a.status.phase && (!B(a, "openshift.io/deployer-pod-for.name") && (!A(a, "openshift.io/build.name") && "slave" !== B(a, "jenkins")));
}, O = function() {
s && r && (c.podsByDeployment = i.groupByReplicationController(s, r), c.monopodsByService = i.groupByService(c.podsByDeployment[""], p, N));
}, P = {}, Q = function(a) {
return !!P[a.metadata.name];
}, R = function(a) {
var b = _.get(a, "metadata.name");
if (!b) return !1;
var d = _.get(c, [ "childServicesByParent", b ], []);
return !_.isEmpty(d);
}, S = function(a, b) {
var d = p[b];
P[b] = d, c.childServicesByParent[a] = c.childServicesByParent[a] || [], c.childServicesByParent[a].push(d);
}, T = function(a) {
var b = 0, d = _.get(a, "metadata.name", ""), e = _.get(c, [ "routesByService", d ], []);
return _.isEmpty(e) || (b += 5), _.has(a, "metadata.labels.app") && (b += 3), l.isInfrastructure(a) && (b -= 5), b;
}, U = function(a, b) {
var c = T(a), d = T(b);
return c === d ? a.metadata.name.localeCompare(b.metadata.name) :d - c;
}, V = function() {
p && o && (c.services = p, P = {}, c.childServicesByParent = {}, _.each(p, function(a, b) {
var c = l.getDependentServices(a);
_.each(c, function(a) {
S(b, a);
});
}), c.topLevelServices = _.filter(p, function(a) {
return !!R(a) || !Q(a) && !G(a);
}).sort(U));
}, W = function() {
p && o && (c.routeWarningsByService = {}, _.each(p, function(a) {
_.each(c.routesByService[a.metadata.name], function(b) {
var d = k.getRouteWarnings(b, a);
_.set(c, [ "routeWarningsByService", a.metadata.name, b.metadata.name ], d);
});
}));
}, X = function(a) {
var b = C(_.get(a, "spec.output.to"), a.metadata.namespace);
c.recentBuildsByOutputImage[b] = c.recentBuildsByOutputImage[b] || [], c.recentBuildsByOutputImage[b].push(a);
}, Y = a("buildConfigForBuild"), Z = function(a) {
if (t) {
var b = Y(a), d = t[b];
if (d) {
var f = e.usesDeploymentConfigs(d);
_.each(f, function(b) {
c.recentPipelinesByDC[b] = c.recentPipelinesByDC[b] || [], c.recentPipelinesByDC[b].push(a);
});
}
}
}, $ = function() {
u && (c.recentPipelinesByDC = {}, c.recentBuildsByOutputImage = {}, _.each(e.interestingBuilds(u), function(a) {
return z(a) ? void Z(a) :void X(a);
}));
}, aa = function() {
var a = _.isEmpty(p) && _.isEmpty(c.monopodsByService) && _.isEmpty(r), b = p && s && r && q;
c.renderOptions.showGetStarted = b && a, c.renderOptions.showLoading = !b && a;
};
c.viewPodsForDeployment = function(a) {
_.isEmpty(c.podsByDeployment[a.metadata.name]) || m.toPodsForDeployment(a);
}, c.getHPA = function(a, b) {
var d = c.hpaByDC, e = c.hpaByRC;
return d && e ? b ? (d[b] = d[b] || [], d[b]) :(e[a] = e[a] || [], e[a]) :null;
}, c.isScalableDeployment = function(a) {
return g.isScalable(a, q, c.hpaByDC, c.hpaByRC, c.scalableDeploymentByConfig);
}, c.isDeploymentLatest = function(a) {
var b = A(a, "deploymentConfig");
if (!b) return !0;
if (!c.deploymentConfigs) return !1;
var d = parseInt(A(a, "deploymentVersion"));
return _.some(c.deploymentConfigs, function(a) {
return a.metadata.name === b && a.status.latestVersion === d;
});
}, window.OPENSHIFT_CONSTANTS.DISABLE_OVERVIEW_METRICS || n.isAvailable(!0).then(function(a) {
c.showMetrics = a;
});
var ba = a("isIE")() || a("isEdge")();
j.get(b.project).then(_.spread(function(a, b) {
c.project = a, c.projectContext = b, y.push(f.watch("pods", b, function(a) {
s = a.by("metadata.name"), O(), aa(), h.log("pods", s);
})), y.push(f.watch("services", b, function(a) {
c.services = p = a.by("metadata.name"), V(), O(), I(), L(), W(), aa(), h.log("services (list)", p);
})), y.push(f.watch("builds", b, function(a) {
u = a.by("metadata.name"), $(), aa(), h.log("builds (list)", u);
})), y.push(f.watch("buildConfigs", b, function(a) {
t = a.by("metadata.name"), $(), h.log("builds (list)", u);
})), y.push(f.watch("routes", b, function(a) {
o = a.by("metadata.name"), H(), V(), W(), h.log("routes (subscribe)", c.routesByService);
}, {
poll:ba,
pollInterval:6e4
})), y.push(f.watch("replicationcontrollers", b, function(a) {
c.deploymentsByName = r = a.by("metadata.name"), L(), O(), $(), aa(), h.log("replicationcontrollers (subscribe)", r);
})), y.push(f.watch("deploymentconfigs", b, function(a) {
q = a.by("metadata.name"), I(), L(), aa(), h.log("deploymentconfigs (subscribe)", c.deploymentConfigs);
})), y.push(f.watch({
group:"extensions",
resource:"horizontalpodautoscalers"
}, b, function(a) {
v = a.by("metadata.name"), M();
}, {
poll:ba,
pollInterval:6e4
})), f.list("limitranges", b, function(a) {
c.limitRanges = a.by("metadata.name");
}), c.$on("$destroy", function() {
f.unwatchAll(y);
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
} ]), angular.module("openshiftConsole").controller("QuotaController", [ "$routeParams", "$scope", "DataService", "ProjectsService", "Logger", function(a, b, c, d, e) {
b.projectName = a.project, b.limitRanges = {}, b.limitsByType = {}, b.labelSuggestions = {}, b.alerts = b.alerts || {}, b.quotaHelp = "Limits resource usage within this project.", b.emptyMessageLimitRanges = "Loading...", b.limitRangeHelp = "Defines minimum and maximum constraints for runtime resources such as memory and CPU.", b.renderOptions = b.renderOptions || {}, b.renderOptions.hideFilterWidget = !0;
var f = [];
d.get(a.project).then(_.spread(function(d, g) {
b.project = d, c.list("resourcequotas", g, function(a) {
b.quotas = a.by("metadata.name"), e.log("quotas", b.quotas);
}), c.list("appliedclusterresourcequotas", g, function(c) {
b.clusterQuotas = c.by("metadata.name"), b.namespaceUsageByClusterQuota = {}, _.each(b.clusterQuotas, function(c, d) {
if (c.status) {
var e = _.find(c.status.namespaces, {
namespace:a.project
});
b.namespaceUsageByClusterQuota[d] = e.status;
}
}), e.log("cluster quotas", b.clusterQuotas);
}), c.list("limitranges", g, function(a) {
b.limitRanges = a.by("metadata.name"), b.emptyMessageLimitRanges = "There are no limit ranges set on this project.", angular.forEach(b.limitRanges, function(a, c) {
b.limitsByType[c] = {}, angular.forEach(a.spec.limits, function(a) {
var d = b.limitsByType[c][a.type] = {};
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
}), e.log("limitRanges", b.limitRanges);
}), b.$on("$destroy", function() {
c.unwatchAll(f);
});
}));
} ]), angular.module("openshiftConsole").controller("MonitoringController", [ "$routeParams", "$scope", "$filter", "DataService", "ProjectsService", "MetricsService", "BuildsService", "PodsService", "KeywordService", "Logger", "ImageStreamResolver", "$rootScope", function(a, b, c, d, e, f, g, h, i, j, k, l) {
b.projectName = a.project, b.alerts = b.alerts || {}, b.renderOptions = b.renderOptions || {}, b.renderOptions.showEventsSidebar = !0, b.renderOptions.collapseEventsSidebar = "true" === localStorage.getItem("monitoring.eventsidebar.collapsed");
var m = [];
b.kindSelector = {
selected:{
kind:"All"
}
}, b.kinds = [ {
kind:"Pods"
}, {
kind:"Builds"
}, {
label:"Deployments",
kind:"ReplicationControllers"
}, {
kind:"All"
} ], b.logOptions = {
pods:{},
deployments:{},
builds:{}
}, b.logCanRun = {
pods:{},
deployments:{},
builds:{}
}, b.logEmpty = {
pods:{},
deployments:{},
builds:{}
}, b.expanded = {
pods:{},
deployments:{},
builds:{}
}, b.filters = {
hideOlderResources:!0,
text:""
};
var n, o, p;
f.isAvailable().then(function(a) {
b.metricsAvailable = a;
});
var q = c("orderObjectsByDate"), r = [ "metadata.name" ], s = [], t = function() {
b.filteredPods = i.filterForKeywords(p, r, s), b.filteredDeployments = i.filterForKeywords(o, r, s), b.filteredBuilds = i.filterForKeywords(n, r, s);
}, u = function(a) {
b.logOptions.pods[a.metadata.name] = {
container:a.spec.containers[0].name
}, b.logCanRun.pods[a.metadata.name] = !_.includes([ "New", "Pending", "Unknown" ], a.status.phase);
}, v = function(a) {
b.logOptions.deployments[a.metadata.name] = {};
var d = c("annotation")(a, "deploymentVersion");
d && (b.logOptions.deployments[a.metadata.name].version = d), b.logCanRun.deployments[a.metadata.name] = !_.includes([ "New", "Pending" ], c("deploymentStatus")(a));
}, w = function(a) {
b.logOptions.builds[a.metadata.name] = {}, b.logCanRun.builds[a.metadata.name] = !_.includes([ "New", "Pending", "Error" ], a.status.phase);
}, x = function() {
p = _.filter(b.pods, function(a) {
return !b.filters.hideOlderResources || "Succeeded" !== a.status.phase && "Failed" !== a.status.phase;
}), b.filteredPods = i.filterForKeywords(p, r, s);
}, y = c("isIncompleteBuild"), z = c("buildConfigForBuild"), A = c("isRecentBuild"), B = function() {
moment().subtract(5, "m");
n = _.filter(b.builds, function(a) {
if (!b.filters.hideOlderResources) return !0;
if (y(a)) return !0;
var c = z(a);
return c ? b.latestBuildByConfig[c].metadata.name === a.metadata.name :A(a);
}), b.filteredBuilds = i.filterForKeywords(n, r, s);
}, C = c("deploymentStatus"), D = c("deploymentIsInProgress"), E = function() {
o = _.filter(b.deployments, function(a) {
return !b.filters.hideOlderResources || (D(a) || "Active" === C(a));
}), b.filteredDeployments = i.filterForKeywords(o, r, s);
};
b.toggleItem = function(a, d, e) {
var f = $(a.target);
if (!f || !f.closest("a", d).length) {
var g, h;
switch (e.kind) {
case "Build":
g = !b.expanded.builds[e.metadata.name], b.expanded.builds[e.metadata.name] = g, h = g ? "event.resource.highlight" :"event.resource.clear-highlight", l.$emit(h, e);
var i = _.get(b.podsByName, c("annotation")(e, "buildPod"));
i && l.$emit(h, i);
break;

case "ReplicationController":
g = !b.expanded.deployments[e.metadata.name], b.expanded.deployments[e.metadata.name] = g, h = g ? "event.resource.highlight" :"event.resource.clear-highlight", l.$emit(h, e);
var j = c("annotation")(e, "deployerPod");
j && l.$emit(h, {
kind:"Pod",
metadata:{
name:j
}
}), _.each(b.podsByDeployment[e.metadata.name], function(a) {
l.$emit(h, a);
});
break;

case "Pod":
g = !b.expanded.pods[e.metadata.name], b.expanded.pods[e.metadata.name] = g, h = g ? "event.resource.highlight" :"event.resource.clear-highlight", l.$emit(h, e);
}
}
};
var F = function() {
b.pods && b.deployments && (b.podsByDeployment = h.groupByReplicationController(b.pods, b.deployments));
};
e.get(a.project).then(_.spread(function(a, c) {
b.project = a, b.projectContext = c, d.watch("pods", c, function(a) {
b.podsByName = a.by("metadata.name"), b.pods = q(b.podsByName, !0), F(), b.podsLoaded = !0, _.each(b.pods, u), x(), j.log("pods", b.pods);
}), d.watch("replicationcontrollers", c, function(a) {
b.deployments = q(a.by("metadata.name"), !0), F(), b.deploymentsLoaded = !0, _.each(b.deployments, v), E(), j.log("deployments", b.deployments);
}), d.watch("builds", c, function(a) {
b.builds = q(a.by("metadata.name"), !0), b.latestBuildByConfig = g.latestBuildByConfig(b.builds), b.buildsLoaded = !0, _.each(b.builds, w), B(), j.log("builds", b.builds);
}), b.$on("$destroy", function() {
d.unwatchAll(m);
}), b.$watch("filters.hideOlderResources", function() {
x(), B(), E();
}), b.$watch("filters.text", _.debounce(function() {
s = i.generateKeywords(b.filters.text), b.$apply(t);
}, 50, {
maxWait:250
})), b.$watch("renderOptions.collapseEventsSidebar", function(a, c) {
a !== c && (localStorage.setItem("monitoring.eventsidebar.collapsed", b.renderOptions.collapseEventsSidebar ? "true" :"false"), l.$emit("metrics.charts.resize"));
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
} ]), angular.module("openshiftConsole").controller("PipelinesController", [ "$filter", "$routeParams", "$scope", "AlertMessageService", "BuildsService", "DataService", "Logger", "ProjectsService", function(a, b, c, d, e, f, g, h) {
c.projectName = b.project, c.alerts = c.alerts || {}, c.buildConfigs = {}, d.getAlerts().forEach(function(a) {
c.alerts[a.name] = a.data;
}), d.clearAlerts();
var i = [];
h.get(b.project).then(_.spread(function(b, d) {
c.project = b;
var g = {}, h = a("buildConfigForBuild"), j = a("isIncompleteBuild"), k = a("isJenkinsPipelineStrategy"), l = a("isNewerResource"), m = function(a, b) {
if (!j(b)) {
c.statsByConfig[a] || (c.statsByConfig[a] = {
count:0,
totalDuration:0
});
var d = c.statsByConfig[a];
d.count++, d.totalDuration += e.getDuration(b), d.avgDuration = _.round(d.totalDuration / d.count);
}
}, n = function() {
var a = {}, b = {};
c.statsByConfig = {}, _.each(g, function(d) {
if (k(d)) {
var e = h(d) || "";
c.buildConfigs[e] || (c.buildConfigs[e] = null), j(d) ? _.set(a, [ e, d.metadata.name ], d) :l(d, b[e]) && (b[e] = d), m(e, d);
}
}), _.each(b, function(b, c) {
_.set(a, [ c, b.metadata.name ], b);
}), c.interestingBuildsByConfig = a;
};
i.push(f.watch("builds", d, function(a) {
c.buildsLoaded = !0, g = a.by("metadata.name"), n();
})), i.push(f.watch("buildconfigs", d, function(a) {
c.buildConfigsLoaded = !0, c.buildConfigs = _.pick(a.by("metadata.name"), k), n();
})), c.startBuild = function(b) {
e.startBuild(b, d).then(_.noop, function(b) {
c.alerts["start-build"] = {
type:"error",
message:"An error occurred while starting the build.",
details:a("getErrorDetails")(b)
};
});
}, c.$on("$destroy", function() {
f.unwatchAll(i);
});
}));
} ]), angular.module("openshiftConsole").controller("BuildConfigController", [ "$scope", "$filter", "$routeParams", "AlertMessageService", "BuildsService", "DataService", "LabelFilter", "ProjectsService", "keyValueEditorUtils", function(a, b, c, d, e, f, g, h, i) {
a.projectName = c.project, a.buildConfigName = c.buildconfig, a.buildConfig = null, a.labelSuggestions = {}, a.alerts = {}, a.breadcrumbs = [], a.forms = {}, c.isPipeline ? a.breadcrumbs.push({
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
}, c.tab && (a.selectedTab = {}, a.selectedTab[c.tab] = !0);
var j = b("orderObjectsByDate"), k = b("buildConfigForBuild"), l = b("buildStrategy"), m = [], n = function(c) {
a.updatedBuildConfig = angular.copy(c), a.envVars = l(a.updatedBuildConfig).env || [], _.each(a.envVars, function(a) {
b("altTextForValueFrom")(a);
});
};
h.get(c.project).then(_.spread(function(d, h) {
function o() {
g.getLabelSelector().isEmpty() || !$.isEmptyObject(a.builds) || $.isEmptyObject(a.unfilteredBuilds) ? delete a.alerts.builds :a.alerts.builds = {
type:"warning",
details:"The active filters are hiding all builds."
};
}
a.project = d, f.get("buildconfigs", c.buildconfig, h).then(function(d) {
a.loaded = !0, a.buildConfig = d, a.paused = e.isPaused(a.buildConfig), a.buildConfig.spec.source.images && (a.imageSources = a.buildConfig.spec.source.images, a.imageSourcesPaths = [], a.imageSources.forEach(function(c) {
a.imageSourcesPaths.push(b("destinationSourcePair")(c.paths));
})), n(d), a.saveEnvVars = function() {
a.envVars = _.filter(a.envVars, "name"), l(a.updatedBuildConfig).env = i.compactEntries(angular.copy(a.envVars)), f.update("buildconfigs", c.buildconfig, a.updatedBuildConfig, h).then(function() {
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
n(a.buildConfig), a.forms.bcEnvVars.$setPristine();
}, m.push(f.watchObject("buildconfigs", c.buildconfig, h, function(b, c) {
"DELETED" === c && (a.alerts.deleted = {
type:"warning",
message:"This build configuration has been deleted."
}), a.buildConfig = b, !a.forms.bcEnvVars || a.forms.bcEnvVars.$pristine ? n(b) :a.alerts.background_update = {
type:"warning",
message:"This build configuration has been updated in the background. Saving your changes may create a conflict or cause loss of data.",
links:[ {
label:"Reload environment variables",
onClick:function() {
return a.clearEnvVarUpdates(), !0;
}
} ]
}, a.paused = e.isPaused(a.buildConfig);
}));
}, function(c) {
a.loaded = !0, a.alerts.load = {
type:"error",
message:404 === c.status ? "This build configuration can not be found, it may have been deleted." :"The build configuration details could not be loaded.",
details:404 === c.status ? "Any remaining build history for this build will be shown." :"Reason: " + b("getErrorDetails")(c)
};
}), m.push(f.watch("builds", h, function(b, d, f) {
if (a.emptyMessage = "No builds to show", d) {
var h = k(f);
if (h === c.buildconfig) {
var i = f.metadata.name;
switch (d) {
case "ADDED":
case "MODIFIED":
a.unfilteredBuilds[i] = f;
break;

case "DELETED":
delete a.unfilteredBuilds[i];
}
}
} else a.unfilteredBuilds = e.validatedBuildsForBuildConfig(c.buildconfig, b.by("metadata.name"));
a.builds = g.getLabelSelector().select(a.unfilteredBuilds), o(), g.addLabelSuggestionsFromResources(a.unfilteredBuilds, a.labelSuggestions), g.setLabelSuggestions(a.labelSuggestions), a.orderedBuilds = j(a.builds, !0), a.latestBuild = a.orderedBuilds.length ? a.orderedBuilds[0] :null;
}, {
http:{
params:{
labelSelector:b("labelName")("buildConfig") + "=" + _.trunc(a.buildConfigName, {
length:63,
omission:""
})
}
}
})), g.onActiveFiltersChanged(function(b) {
a.$apply(function() {
a.builds = b.select(a.unfilteredBuilds), a.orderedBuilds = j(a.builds, !0), a.latestBuild = a.orderedBuilds.length ? a.orderedBuilds[0] :null, o();
});
}), a.startBuild = function() {
e.startBuild(a.buildConfig.metadata.name, h).then(function(b) {
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
}, a.$on("$destroy", function() {
f.unwatchAll(m);
});
}));
} ]), angular.module("openshiftConsole").controller("BuildController", [ "$scope", "$filter", "$routeParams", "BuildsService", "DataService", "Navigate", "ProjectsService", function(a, b, c, d, e, f, g) {
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
}), c.tab && (a.selectedTab = {}, a.selectedTab[c.tab] = !0);
var h = [], i = function(b) {
a.logCanRun = !_.includes([ "New", "Pending", "Error" ], b.status.phase);
}, j = function() {
a.buildConfig ? a.canBuild = d.canBuild(a.buildConfig) :a.canBuild = !1;
}, k = function(c, d) {
a.loaded = !0, a.build = c, i(c);
var e = b("annotation")(c, "buildNumber");
e && (a.breadcrumbs[2].title = "#" + e), "DELETED" === d && (a.alerts.deleted = {
type:"warning",
message:"This build has been deleted."
});
}, l = function(c) {
a.loaded = !0, a.alerts.load = {
type:"error",
message:"The build details could not be loaded.",
details:"Reason: " + b("getErrorDetails")(c)
};
}, m = function(b, c) {
"DELETED" === c && (a.alerts.deleted = {
type:"warning",
message:"Build configuration " + a.buildConfigName + " has been deleted."
}), a.buildConfig = b, a.paused = d.isPaused(a.buildConfig), j();
};
g.get(c.project).then(_.spread(function(g, i) {
a.project = g, a.projectContext = i, a.logOptions = {}, e.get("builds", c.build, i).then(function(a) {
k(a), h.push(e.watchObject("builds", c.build, i, k)), h.push(e.watchObject("buildconfigs", c.buildconfig, i, m));
}, l), a.toggleSecret = function() {
a.showSecret = !0;
}, a.cancelBuild = function() {
d.cancelBuild(a.build, a.buildConfigName, i).then(function(b) {
a.alerts.cancel = {
type:"success",
message:"Cancelling build " + b.metadata.name + " of " + a.buildConfigName + "."
};
}, function(c) {
a.alerts.cancel = {
type:"error",
message:"An error occurred cancelling the build.",
details:b("getErrorDetails")(c)
};
});
};
var j = function(c) {
if (b("isJenkinsPipelineStrategy")(a.build) || !b("canI")("builds/log", "get")) return [ {
href:f.resourceURL(c),
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
c && a.canBuild && d.cloneBuild(c, i).then(function(b) {
var d = j(b);
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
}, a.$on("$destroy", function() {
e.unwatchAll(h);
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
} ], a.emptyMessage = "Loading...", b.tab && (a.selectedTab = {}, a.selectedTab[b.tab] = !0);
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
} ]), angular.module("openshiftConsole").controller("DeploymentsController", [ "$scope", "$filter", "$routeParams", "AlertMessageService", "DataService", "DeploymentsService", "LabelFilter", "Logger", "ProjectsService", function(a, b, c, d, e, f, g, h, i) {
a.projectName = c.project, a.deployments = {}, a.unfilteredDeploymentConfigs = {}, a.unfilteredK8SDeployments = {}, a.deploymentsByDeploymentConfig = {}, a.labelSuggestions = {}, a.alerts = a.alerts || {}, a.emptyMessage = "Loading...", a.expandedDeploymentConfigRow = {}, a.unfilteredReplicaSets = {}, a.unfilteredReplicationControllers = {}, d.getAlerts().forEach(function(b) {
a.alerts[b.name] = b.data;
}), d.clearAlerts();
var j = [];
i.get(c.project).then(_.spread(function(c, d) {
function i() {
var b = !g.getLabelSelector().isEmpty();
if (!b) return void delete a.alerts.deployments;
var c = _.isEmpty(a.unfilteredDeploymentConfigs) && _.isEmpty(a.unfilteredReplicationControllers) && _.isEmpty(a.unfilteredK8SDeployments) && _.isEmpty(a.unfilteredReplicaSets);
if (c) return void delete a.alerts.deployments;
var d = _.isEmpty(a.deploymentConfigs) && _.isEmpty(a.deploymentsByDeploymentConfig[""]) && _.isEmpty(a.k8sDeployments) && _.isEmpty(a.replicaSets);
return d ? void (a.alerts.deployments = {
type:"warning",
details:"The active filters are hiding all deployments."
}) :void delete a.alerts.deployments;
}
a.project = c, j.push(e.watch("replicationcontrollers", d, function(c, d, e) {
a.deployments = c.by("metadata.name");
var j, k;
if (e && (j = b("annotation")(e, "deploymentConfig"), k = e.metadata.name), a.deploymentsByDeploymentConfig = f.associateDeploymentsToDeploymentConfig(a.deployments, a.deploymentConfigs, !0), a.deploymentsByDeploymentConfig[""] && (a.unfilteredReplicationControllers = a.deploymentsByDeploymentConfig[""], g.addLabelSuggestionsFromResources(a.unfilteredReplicationControllers, a.labelSuggestions), g.setLabelSuggestions(a.labelSuggestions), a.deploymentsByDeploymentConfig[""] = g.getLabelSelector().select(a.deploymentsByDeploymentConfig[""])), i(), d) {
if ("ADDED" === d || "MODIFIED" === d && [ "New", "Pending", "Running" ].indexOf(b("deploymentStatus")(e)) > -1) a.deploymentConfigDeploymentsInProgress[j] = a.deploymentConfigDeploymentsInProgress[j] || {}, a.deploymentConfigDeploymentsInProgress[j][k] = e; else if ("MODIFIED" === d) {
var l = b("deploymentStatus")(e);
"Complete" !== l && "Failed" !== l || delete a.deploymentConfigDeploymentsInProgress[j][k];
}
} else a.deploymentConfigDeploymentsInProgress = f.associateRunningDeploymentToDeploymentConfig(a.deploymentsByDeploymentConfig);
e ? "DELETED" !== d && (e.causes = b("deploymentCauses")(e)) :angular.forEach(a.deployments, function(a) {
a.causes = b("deploymentCauses")(a);
}), h.log("deployments (subscribe)", a.deployments);
})), j.push(e.watch({
group:"extensions",
resource:"replicasets"
}, d, function(b) {
a.unfilteredReplicaSets = b.by("metadata.name"), g.addLabelSuggestionsFromResources(a.unfilteredReplicaSets, a.labelSuggestions), g.setLabelSuggestions(a.labelSuggestions), a.replicaSets = g.getLabelSelector().select(a.unfilteredReplicaSets), h.log("replicasets (subscribe)", a.replicaSets);
})), j.push(e.watch("deploymentconfigs", d, function(b) {
a.unfilteredDeploymentConfigs = b.by("metadata.name"), g.addLabelSuggestionsFromResources(a.unfilteredDeploymentConfigs, a.labelSuggestions), g.setLabelSuggestions(a.labelSuggestions), a.deploymentConfigs = g.getLabelSelector().select(a.unfilteredDeploymentConfigs), a.emptyMessage = "No deployment configurations to show", a.deploymentsByDeploymentConfig = f.associateDeploymentsToDeploymentConfig(a.deployments, a.deploymentConfigs, !0), a.deploymentsByDeploymentConfig[""] && (a.unfilteredReplicationControllers = a.deploymentsByDeploymentConfig[""], a.deploymentsByDeploymentConfig[""] = g.getLabelSelector().select(a.deploymentsByDeploymentConfig[""])), i(), h.log("deploymentconfigs (subscribe)", a.deploymentConfigs);
})), j.push(e.watch({
group:"extensions",
resource:"deployments"
}, d, function(b) {
a.unfilteredK8SDeployments = b.by("metadata.name"), g.addLabelSuggestionsFromResources(a.unfilteredK8SDeployments, a.labelSuggestions), g.setLabelSuggestions(a.labelSuggestions), a.k8sDeployments = g.getLabelSelector().select(a.unfilteredK8SDeployments), h.log("k8sDeployments (subscribe)", a.unfilteredK8SDeployments);
})), a.showEmptyMessage = function() {
return 0 === b("hashSize")(a.deploymentsByDeploymentConfig) || !(1 !== b("hashSize")(a.deploymentsByDeploymentConfig) || !a.deploymentsByDeploymentConfig[""]);
}, g.onActiveFiltersChanged(function(b) {
a.$apply(function() {
a.deploymentConfigs = b.select(a.unfilteredDeploymentConfigs), a.deploymentsByDeploymentConfig = f.associateDeploymentsToDeploymentConfig(a.deployments, a.deploymentConfigs, !0), a.deploymentsByDeploymentConfig[""] && (a.unfilteredReplicationControllers = a.deploymentsByDeploymentConfig[""], a.deploymentsByDeploymentConfig[""] = g.getLabelSelector().select(a.deploymentsByDeploymentConfig[""])), a.k8sDeployments = b.select(a.unfilteredK8SDeployments), a.replicaSets = b.select(a.unfilteredReplicaSets), i();
});
}), a.$on("$destroy", function() {
e.unwatchAll(j);
});
}));
} ]), angular.module("openshiftConsole").controller("DeploymentController", [ "$scope", "$filter", "$routeParams", "AlertMessageService", "DataService", "DeploymentsService", "HPAService", "ImageStreamResolver", "Navigate", "ProjectsService", "keyValueEditorUtils", function(a, b, c, d, e, f, g, h, i, j, k) {
var l = {};
a.projectName = c.project, a.name = c.deployment, a.forms = {}, a.alerts = {}, a.imagesByDockerReference = {}, a.breadcrumbs = [ {
title:"Deployments",
link:"project/" + c.project + "/browse/deployments"
}, {
title:c.deployment
} ], a.emptyMessage = "Loading...", a.healthCheckURL = i.healthCheckURL(c.project, "Deployment", c.deployment, "extensions"), c.tab && (a.selectedTab = {}, a.selectedTab[c.tab] = !0), d.getAlerts().forEach(function(b) {
a.alerts[b.name] = b.data;
}), d.clearAlerts();
var m = function(c) {
a.updatedDeployment = angular.copy(c), _.each(a.updatedDeployment.spec.template.spec.containers, function(a) {
a.env = a.env || [], _.each(a.env, function(a) {
b("altTextForValueFrom")(a);
});
});
}, n = [];
j.get(c.project).then(_.spread(function(d, i) {
a.project = d, a.projectContext = i;
var j = {}, o = function() {
g.getHPAWarnings(a.deployment, a.autoscalers, j, d).then(function(b) {
a.hpaWarnings = b;
});
};
e.get({
group:"extensions",
resource:"deployments"
}, c.deployment, i).then(function(d) {
a.loaded = !0, a.deployment = d, o(), a.saveEnvVars = function() {
_.each(a.updatedDeployment.spec.template.spec.containers, function(a) {
a.env = k.compactEntries(angular.copy(a.env));
}), e.update({
group:"extensions",
resource:"deployments"
}, c.deployment, a.updatedDeployment, i).then(function() {
a.alerts.saveDCEnvVarsSuccess = {
type:"success",
message:c.deployment + " was updated."
}, a.forms.deploymentEnvVars.$setPristine();
}, function(d) {
a.alerts.saveDCEnvVarsError = {
type:"error",
message:c.deployment + " was not updated.",
details:"Reason: " + b("getErrorDetails")(d)
};
});
}, a.clearEnvVarUpdates = function() {
m(a.deployment), a.forms.deploymentEnvVars.$setPristine();
}, n.push(e.watchObject({
group:"extensions",
resource:"deployments"
}, c.deployment, i, function(b, c) {
"DELETED" === c && (a.alerts.deleted = {
type:"warning",
message:"This deployment has been deleted."
}), a.deployment = b, a.forms.deploymentEnvVars.$pristine ? m(b) :a.alerts.background_update = {
type:"warning",
message:"This deployment has been updated in the background. Saving your changes may create a conflict or cause loss of data.",
links:[ {
label:"Reload environment variables",
onClick:function() {
return a.clearEnvVarUpdates(), !0;
}
} ]
}, o(), h.fetchReferencedImageStreamImages([ b.spec.template ], a.imagesByDockerReference, l, i);
}));
var f = b("annotation"), g = function(a) {
return f(a, "deployment.kubernetes.io/revision");
};
n.push(e.watch({
group:"extensions",
resource:"replicasets"
}, i, function(b) {
var c = b.by("metadata.name"), e = new LabelSelector(d.spec.selector);
c = _.filter(c, function(a) {
return e.matches(a);
}), a.replicaSetsForDeployment = _.sortByOrder(c, [ g ], [ "desc" ]);
}));
}, function(c) {
a.loaded = !0, a.alerts.load = {
type:"error",
message:404 === c.status ? "This deployment can not be found, it may have been deleted." :"The deployment details could not be loaded.",
details:404 === c.status ? "Any remaining deployment history for this deployment will be shown." :"Reason: " + b("getErrorDetails")(c)
};
}), e.list("limitranges", i, function(a) {
j = a.by("metadata.name"), o();
}), n.push(e.watch("imagestreams", i, function(b) {
var c = b.by("metadata.name");
h.buildDockerRefMapForImageStreams(c, l), a.deployment && h.fetchReferencedImageStreamImages([ a.deployment.spec.template ], a.imagesByDockerReference, l, i), Logger.log("imagestreams (subscribe)", a.imageStreams);
})), n.push(e.watch({
group:"extensions",
resource:"horizontalpodautoscalers"
}, i, function(b) {
a.autoscalers = g.filterHPA(b.by("metadata.name"), "Deployment", c.deployment), o();
})), n.push(e.watch("builds", i, function(b) {
a.builds = b.by("metadata.name"), Logger.log("builds (subscribe)", a.builds);
})), a.scale = function(c) {
var d = function(c) {
a.alerts = a.alerts || {}, a.alerts.scale = {
type:"error",
message:"An error occurred scaling the deployment.",
details:b("getErrorDetails")(c)
};
};
f.scale(a.deployment, c).then(_.noop, d);
}, a.$on("$destroy", function() {
e.unwatchAll(n);
});
}));
} ]), angular.module("openshiftConsole").controller("DeploymentConfigController", [ "$scope", "$filter", "$routeParams", "AlertMessageService", "BreadcrumbsService", "DataService", "DeploymentsService", "HPAService", "ImageStreamResolver", "Navigate", "ProjectsService", "LabelFilter", "labelNameFilter", "keyValueEditorUtils", function(a, b, c, d, e, f, g, h, i, j, k, l, m, n) {
var o = {};
a.projectName = c.project, a.deploymentConfigName = c.deploymentconfig, a.deploymentConfig = null, a.deployments = {}, a.unfilteredDeployments = {}, a.imagesByDockerReference = {}, a.builds = {}, a.labelSuggestions = {}, a.forms = {}, a.alerts = {}, a.breadcrumbs = e.getBreadcrumbs({
name:c.deploymentconfig,
kind:"DeploymentConfig",
namespace:c.project
}), a.emptyMessage = "Loading...", a.healthCheckURL = j.healthCheckURL(c.project, "DeploymentConfig", c.deploymentconfig), c.tab && (a.selectedTab = {}, a.selectedTab[c.tab] = !0), d.getAlerts().forEach(function(b) {
a.alerts[b.name] = b.data;
}), d.clearAlerts();
var p = function(c) {
a.updatedDeploymentConfig = angular.copy(c), _.each(a.updatedDeploymentConfig.spec.template.spec.containers, function(a) {
a.env = a.env || [], _.each(a.env, function(a) {
b("altTextForValueFrom")(a);
});
});
}, q = [];
k.get(c.project).then(_.spread(function(d, e) {
function j() {
l.getLabelSelector().isEmpty() || !$.isEmptyObject(a.deployments) || $.isEmptyObject(a.unfilteredDeployments) ? delete a.alerts.deployments :a.alerts.deployments = {
type:"warning",
details:"The active filters are hiding all deployments."
};
}
a.project = d, a.projectContext = e;
var k = {}, r = function() {
h.getHPAWarnings(a.deploymentConfig, a.autoscalers, k, d).then(function(b) {
a.hpaWarnings = b;
});
};
f.get("deploymentconfigs", c.deploymentconfig, e).then(function(d) {
a.loaded = !0, a.deploymentConfig = d, r(), p(d), a.saveEnvVars = function() {
_.each(a.updatedDeploymentConfig.spec.template.spec.containers, function(a) {
a.env = n.compactEntries(angular.copy(a.env));
}), f.update("deploymentconfigs", c.deploymentconfig, angular.copy(a.updatedDeploymentConfig), e).then(function() {
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
});
}, a.clearEnvVarUpdates = function() {
p(a.deploymentConfig), a.forms.dcEnvVars.$setPristine();
}, q.push(f.watchObject("deploymentconfigs", c.deploymentconfig, e, function(b, c) {
"DELETED" === c && (a.alerts.deleted = {
type:"warning",
message:"This deployment configuration has been deleted."
}), a.deploymentConfig = b, !a.forms.dcEnvVars || a.forms.dcEnvVars.$pristine ? p(b) :a.alerts.background_update = {
type:"warning",
message:"This deployment configuration has been updated in the background. Saving your changes may create a conflict or cause loss of data.",
links:[ {
label:"Reload environment variables",
onClick:function() {
return a.clearEnvVarUpdates(), !0;
}
} ]
}, r(), i.fetchReferencedImageStreamImages([ b.spec.template ], a.imagesByDockerReference, o, e);
}));
}, function(c) {
a.loaded = !0, a.alerts.load = {
type:"error",
message:404 === c.status ? "This deployment configuration can not be found, it may have been deleted." :"The deployment configuration details could not be loaded.",
details:404 === c.status ? "Any remaining deployment history for this deployment will be shown." :"Reason: " + b("getErrorDetails")(c)
};
}), q.push(f.watch("replicationcontrollers", e, function(d, e, f) {
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
var k = g.associateDeploymentsToDeploymentConfig(d.by("metadata.name"));
a.unfilteredDeployments = k[c.deploymentconfig] || {}, angular.forEach(a.unfilteredDeployments, function(a) {
a.causes = b("deploymentCauses")(a);
}), a.deploymentConfigDeploymentsInProgress = g.associateRunningDeploymentToDeploymentConfig(k);
}
a.deployments = l.getLabelSelector().select(a.unfilteredDeployments), a.deploymentInProgress = !!_.size(a.deploymentConfigDeploymentsInProgress[h]), j(), l.addLabelSuggestionsFromResources(a.unfilteredDeployments, a.labelSuggestions), l.setLabelSuggestions(a.labelSuggestions);
}, {
http:{
params:{
labelSelector:m("deploymentConfig") + "=" + a.deploymentConfigName
}
}
})), f.list("limitranges", e, function(a) {
k = a.by("metadata.name"), r();
}), q.push(f.watch("imagestreams", e, function(b) {
var c = b.by("metadata.name");
i.buildDockerRefMapForImageStreams(c, o), a.deploymentConfig && i.fetchReferencedImageStreamImages([ a.deploymentConfig.spec.template ], a.imagesByDockerReference, o, e), Logger.log("imagestreams (subscribe)", a.imageStreams);
})), q.push(f.watch("builds", e, function(b) {
a.builds = b.by("metadata.name"), Logger.log("builds (subscribe)", a.builds);
})), q.push(f.watch({
group:"extensions",
resource:"horizontalpodautoscalers"
}, e, function(b) {
a.autoscalers = h.filterHPA(b.by("metadata.name"), "DeploymentConfig", c.deploymentconfig), r();
})), l.onActiveFiltersChanged(function(b) {
a.$apply(function() {
a.deployments = b.select(a.unfilteredDeployments), j();
});
}), a.canDeploy = function() {
return !!a.deploymentConfig && (!a.deploymentConfig.metadata.deletionTimestamp && !a.deploymentInProgress);
}, a.startLatestDeployment = function() {
a.canDeploy() && g.startLatestDeployment(a.deploymentConfig, e, a);
}, a.scale = function(c) {
var d = function(c) {
a.alerts = a.alerts || {}, a.alerts.scale = {
type:"error",
message:"An error occurred scaling the deployment config.",
details:b("getErrorDetails")(c)
};
};
g.scale(a.deploymentConfig, c).then(_.noop, d);
}, a.$on("$destroy", function() {
f.unwatchAll(q);
});
}));
} ]), angular.module("openshiftConsole").controller("ReplicaSetController", [ "$scope", "$filter", "$routeParams", "AlertMessageService", "BreadcrumbsService", "DataService", "HPAService", "MetricsService", "ProjectsService", "DeploymentsService", "ImageStreamResolver", "Navigate", "keyValueEditorUtils", "kind", function(a, b, c, d, e, f, g, h, i, j, k, l, m, n) {
var o = !1, p = b("humanizeKind")(n);
switch (n) {
case "ReplicaSet":
a.resource = {
group:"extensions",
resource:"replicasets"
}, a.healthCheckURL = l.healthCheckURL(c.project, "ReplicaSet", c.replicaSet, "extensions");
break;

case "ReplicationController":
a.resource = "replicationcontrollers", a.healthCheckURL = l.healthCheckURL(c.project, "ReplicationController", c.replicaSet);
}
var q = {};
a.projectName = c.project, a.kind = n, a.deployment = null, a.deploymentConfig = null, a.deploymentConfigMissing = !1, a.deployments = {}, a.imagesByDockerReference = {}, a.builds = {}, a.alerts = {}, a.renderOptions = a.renderOptions || {}, a.renderOptions.hideFilterWidget = !0, a.forms = {}, c.tab && (a.selectedTab = {}, a.selectedTab[c.tab] = !0), a.logOptions = {}, d.getAlerts().forEach(function(b) {
a.alerts[b.name] = b.data;
}), d.clearAlerts();
var r = [];
h.isAvailable().then(function(b) {
a.metricsAvailable = b;
});
var s = function(c) {
a.logCanRun = !_.includes([ "New", "Pending" ], b("deploymentStatus")(c));
}, t = function(b) {
a.updatedDeployment = angular.copy(b), _.each(a.updatedDeployment.spec.template.spec.containers, function(a) {
a.env = a.env || [];
});
};
a.saveEnvVars = function() {
_.each(a.updatedDeployment.spec.template.spec.containers, function(a) {
a.env = m.compactEntries(angular.copy(a.env));
}), f.update(a.resource, c.replicaSet, angular.copy(a.updatedDeployment), a.projectContext).then(function() {
a.alerts.saveEnvSuccess = {
type:"success",
message:a.deployment.metadata.name + " was updated."
}, a.forms.envForm.$setPristine();
}, function(c) {
a.alerts.saveEnvError = {
type:"error",
message:a.deployment.metadata.name + " was not updated.",
details:"Reason: " + b("getErrorDetails")(c)
};
});
}, a.clearEnvVarUpdates = function() {
t(a.deployment), a.forms.envForm.$setPristine();
};
var u = b("isIE")() || b("isEdge")();
i.get(c.project).then(_.spread(function(d, h) {
a.project = d, a.projectContext = h;
var i, m, v = {}, w = {}, x = function() {
if (a.hpaForRS = g.filterHPA(v, n, c.replicaSet), a.isActive) {
var b = g.filterHPA(v, "DeploymentConfig", a.deploymentConfigName);
a.autoscalers = a.hpaForRS.concat(b);
} else a.autoscalers = a.hpaForRS;
}, y = function() {
r.push(f.watch(a.resource, h, function(c) {
var d, e = [], f = b("annotation");
angular.forEach(c.by("metadata.name"), function(b) {
var c = f(b, "deploymentConfig") || "";
c === a.deploymentConfigName && e.push(b);
}), d = j.getActiveDeployment(e), a.isActive = d && d.metadata.uid === a.deployment.metadata.uid, x();
}));
}, z = function() {
i && m && (a.podsForDeployment = _.filter(i, function(a) {
return m.matches(a);
}));
}, A = function() {
g.getHPAWarnings(a.deployment, a.autoscalers, w, d).then(function(b) {
a.hpaWarnings = b;
});
}, B = function(d) {
var e = b("annotation")(d, "deploymentConfig");
if (e) {
o = !0, a.deploymentConfigName = e;
var g = b("annotation")(d, "deploymentVersion");
g && (a.logOptions.version = g), a.healthCheckURL = l.healthCheckURL(c.project, "DeploymentConfig", e), f.get("deploymentconfigs", e, h, {
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
}, C = function() {
if (!_.isEmpty(q)) {
var b = _.get(a, "deployment.spec.template");
b && k.fetchReferencedImageStreamImages([ b ], a.imagesByDockerReference, q, h);
}
};
f.get(a.resource, c.replicaSet, h).then(function(b) {
a.loaded = !0, a.deployment = b, s(b), B(b), A(), a.breadcrumbs = e.getBreadcrumbs({
object:b
}), r.push(f.watchObject(a.resource, c.replicaSet, h, function(b, c) {
"DELETED" === c && (a.alerts.deleted = {
type:"warning",
message:"This " + p + " has been deleted."
}), a.deployment = b, !a.forms.envForm || a.forms.envForm.$pristine ? t(b) :a.alerts.background_update = {
type:"warning",
message:"This " + p + " has been updated in the background. Saving your changes may create a conflict or cause loss of data.",
links:[ {
label:"Reload environment variables",
onClick:function() {
return a.clearEnvVarUpdates(), !0;
}
} ]
}, s(b), A(), C();
})), a.deploymentConfigName && y(), a.$watch("deployment.spec.selector", function() {
m = new LabelSelector(a.deployment.spec.selector), z();
}, !0), r.push(f.watch("pods", h, function(a) {
i = a.by("metadata.name"), z();
}));
}, function(d) {
a.loaded = !0, a.alerts.load = {
type:"error",
message:"The " + p + " details could not be loaded.",
details:"Reason: " + b("getErrorDetails")(d)
}, a.breadcrumbs = e.getBreadcrumbs({
name:c.replicaSet,
kind:n,
namespace:c.project
});
}), r.push(f.watch(a.resource, h, function(c, d, e) {
a.deployments = c.by("metadata.name"), a.emptyMessage = "No deployments to show", a.deploymentsByDeploymentConfig = j.associateDeploymentsToDeploymentConfig(a.deployments);
var f, g;
if (e && (f = b("annotation")(e, "deploymentConfig"), g = e.metadata.name), d) {
if ("ADDED" === d || "MODIFIED" === d && [ "New", "Pending", "Running" ].indexOf(b("deploymentStatus")(e)) > -1) a.deploymentConfigDeploymentsInProgress[f] = a.deploymentConfigDeploymentsInProgress[f] || {}, a.deploymentConfigDeploymentsInProgress[f][g] = e; else if ("MODIFIED" === d) {
var h = b("deploymentStatus")(e);
"Complete" !== h && "Failed" !== h || delete a.deploymentConfigDeploymentsInProgress[f][g];
}
} else a.deploymentConfigDeploymentsInProgress = j.associateRunningDeploymentToDeploymentConfig(a.deploymentsByDeploymentConfig);
e ? "DELETED" !== d && (e.causes = b("deploymentCauses")(e)) :angular.forEach(a.deployments, function(a) {
a.causes = b("deploymentCauses")(a);
});
})), r.push(f.watch("imagestreams", h, function(a) {
var b = a.by("metadata.name");
k.buildDockerRefMapForImageStreams(b, q), C(), Logger.log("imagestreams (subscribe)", b);
})), r.push(f.watch("builds", h, function(b) {
a.builds = b.by("metadata.name"), Logger.log("builds (subscribe)", a.builds);
})), r.push(f.watch({
group:"extensions",
resource:"horizontalpodautoscalers"
}, h, function(a) {
v = a.by("metadata.name"), x(), A();
}, {
poll:u,
pollInterval:6e4
})), f.list("limitranges", h, function(a) {
w = a.by("metadata.name"), A();
}), a.retryFailedDeployment = function(b) {
j.retryFailedDeployment(b, h, a);
}, a.rollbackToDeployment = function(b, c, d, e) {
j.rollbackToDeployment(b, c, d, e, h, a);
}, a.cancelRunningDeployment = function(b) {
j.cancelRunningDeployment(b, h, a);
}, a.scale = function(c) {
var d = function(c) {
a.alerts = a.alerts || {}, a.alerts.scale = {
type:"error",
message:"An error occurred scaling the deployment.",
details:b("getErrorDetails")(c)
};
};
j.scale(a.deploymentConfig || a.deployment, c).then(_.noop, d);
};
var D = b("hasDeploymentConfig");
a.isScalable = function() {
return !!_.isEmpty(a.autoscalers) && (!D(a.deployment) || (!!a.deploymentConfigMissing || !!a.deploymentConfig && a.isActive));
}, a.$on("$destroy", function() {
f.unwatchAll(r);
});
}));
} ]), angular.module("openshiftConsole").controller("ServicesController", [ "$routeParams", "$scope", "AlertMessageService", "DataService", "ProjectsService", "$filter", "LabelFilter", "Logger", function(a, b, c, d, e, f, g, h) {
b.projectName = a.project, b.services = {}, b.unfilteredServices = {}, b.routesByService = {}, b.routes = {}, b.labelSuggestions = {}, b.alerts = b.alerts || {}, b.emptyMessage = "Loading...", b.emptyMessageRoutes = "Loading...", c.getAlerts().forEach(function(a) {
b.alerts[a.name] = a.data;
}), c.clearAlerts();
var i = [];
e.get(a.project).then(_.spread(function(a, c) {
function e(a) {
var b = {};
return angular.forEach(a, function(a, c) {
var d = a.spec.to;
"Service" === d.kind && (b[d.name] = b[d.name] || {}, b[d.name][c] = a);
}), b;
}
function f() {
g.getLabelSelector().isEmpty() || !$.isEmptyObject(b.services) || $.isEmptyObject(b.unfilteredServices) ? delete b.alerts.services :b.alerts.services = {
type:"warning",
details:"The active filters are hiding all services."
};
}
b.project = a, i.push(d.watch("services", c, function(a) {
b.unfilteredServices = a.by("metadata.name"), g.addLabelSuggestionsFromResources(b.unfilteredServices, b.labelSuggestions), g.setLabelSuggestions(b.labelSuggestions), b.services = g.getLabelSelector().select(b.unfilteredServices), b.emptyMessage = "No services to show", f(), h.log("services (subscribe)", b.unfilteredServices);
})), i.push(d.watch("routes", c, function(a) {
b.routes = a.by("metadata.name"), b.emptyMessageRoutes = "No routes to show", b.routesByService = e(b.routes), h.log("routes (subscribe)", b.routesByService);
})), g.onActiveFiltersChanged(function(a) {
b.$apply(function() {
b.services = a.select(b.unfilteredServices), f();
});
}), b.$on("$destroy", function() {
d.unwatchAll(i);
});
}));
} ]), angular.module("openshiftConsole").controller("ServiceController", [ "$scope", "$routeParams", "DataService", "ProjectsService", "$filter", function(a, b, c, d, e) {
a.projectName = b.project, a.service = null, a.alerts = {}, a.renderOptions = a.renderOptions || {}, a.renderOptions.hideFilterWidget = !0, a.breadcrumbs = [ {
title:"Services",
link:"project/" + b.project + "/browse/services"
}, {
title:b.service
} ];
var f = [];
d.get(b.project).then(_.spread(function(d, g) {
a.project = d, a.projectContext = g, c.get("services", b.service, g).then(function(d) {
a.loaded = !0, a.service = d, f.push(c.watchObject("services", b.service, g, function(b, c) {
"DELETED" === c && (a.alerts.deleted = {
type:"warning",
message:"This service has been deleted."
}), a.service = b;
}));
}, function(b) {
a.loaded = !0, a.alerts.load = {
type:"error",
message:"The service details could not be loaded.",
details:"Reason: " + e("getErrorDetails")(b)
};
}), f.push(c.watch("routes", g, function(c) {
a.routesForService = [], angular.forEach(c.by("metadata.name"), function(c) {
"Service" === c.spec.to.kind && c.spec.to.name === b.service && a.routesForService.push(c);
}), Logger.log("routes (subscribe)", a.routesByService);
})), a.$on("$destroy", function() {
c.unwatchAll(f);
});
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
} ]), angular.module("openshiftConsole").controller("RouteController", [ "$scope", "$routeParams", "AlertMessageService", "DataService", "ProjectsService", "$filter", function(a, b, c, d, e, f) {
a.projectName = b.project, a.route = null, a.alerts = {}, a.renderOptions = a.renderOptions || {}, a.renderOptions.hideFilterWidget = !0, a.breadcrumbs = [ {
title:"Routes",
link:"project/" + b.project + "/browse/routes"
}, {
title:b.route
} ], c.getAlerts().forEach(function(b) {
a.alerts[b.name] = b.data;
}), c.clearAlerts();
var g = [];
e.get(b.project).then(_.spread(function(c, e) {
a.project = c, d.get("routes", b.route, e).then(function(c) {
a.loaded = !0, a.route = c, g.push(d.watchObject("routes", b.route, e, function(b, c) {
"DELETED" === c && (a.alerts.deleted = {
type:"warning",
message:"This route has been deleted."
}), a.route = b;
}));
}, function(b) {
a.loaded = !0, a.alerts.load = {
type:"error",
message:"The route details could not be loaded.",
details:"Reason: " + f("getErrorDetails")(b)
};
}), g.push(d.watch("services", e, function(b) {
a.services = b.by("metadata.name");
})), a.$on("$destroy", function() {
d.unwatchAll(g);
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
} ]), angular.module("openshiftConsole").controller("OtherResourcesController", [ "$routeParams", "$scope", "AlertMessageService", "AuthorizationService", "DataService", "ProjectsService", "$filter", "LabelFilter", "Logger", "APIService", function(a, b, c, d, e, f, g, h, i, j) {
function k() {
h.getLabelSelector().isEmpty() || !$.isEmptyObject(b.resources) || $.isEmptyObject(b.unfilteredResources) ? delete b.alerts.resources :b.alerts.resources = {
type:"warning",
details:"The active filters are hiding all " + j.kindToResource(b.kindSelector.selected.kind, !0) + "."
};
}
function l() {
var a = b.kindSelector.selected;
a && (b.selectedResource = {
resource:j.kindToResource(a.kind),
group:a.group || ""
}, e.list({
group:a.group,
resource:j.kindToResource(a.kind)
}, b.context, function(c) {
b.unfilteredResources = c.by("metadata.name"), b.labelSuggestions = {}, h.addLabelSuggestionsFromResources(b.unfilteredResources, b.labelSuggestions), h.setLabelSuggestions(b.labelSuggestions), b.resources = h.getLabelSelector().select(b.unfilteredResources), b.emptyMessage = "No " + j.kindToResource(a.kind, !0) + " to show", k();
}));
}
b.projectName = a.project, b.labelSuggestions = {}, b.alerts = b.alerts || {}, b.emptyMessage = "Select a resource from the list above ...", b.kindSelector = {
disabled:!0
}, b.kinds = _.filter(j.availableKinds(), function(a) {
switch (a.kind) {
case "ReplicationController":
case "Deployment":
case "DeploymentConfig":
case "BuildConfig":
case "Build":
case "Pod":
case "PersistentVolumeClaim":
case "Event":
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
return !1;

default:
return !0;
}
}), c.getAlerts().forEach(function(a) {
b.alerts[a.name] = a.data;
}), c.clearAlerts(), f.get(a.project).then(_.spread(function(a, c) {
b.kinds = _.filter(b.kinds, function(a) {
var c = {
resource:j.kindToResource(a.kind),
group:a.group || ""
};
return !!d.checkResource(c.resource) && d.canI(c, "list", b.projectName);
}), b.project = a, b.context = c, b.kindSelector.disabled = !1;
})), b.loadKind = l, b.$watch("kindSelector.selected", function() {
b.alerts = {}, l();
});
var m = g("humanizeKind");
b.matchKind = function(a, b) {
return m(a).toLowerCase().indexOf(b.toLowerCase()) !== -1;
}, h.onActiveFiltersChanged(function(a) {
b.$apply(function() {
b.resources = a.select(b.unfilteredResources), k();
});
});
} ]), angular.module("openshiftConsole").controller("PersistentVolumeClaimController", [ "$scope", "$routeParams", "DataService", "ProjectsService", "$filter", function(a, b, c, d, e) {
a.projectName = b.project, a.pvc = null, a.alerts = {}, a.renderOptions = a.renderOptions || {}, a.renderOptions.hideFilterWidget = !0, a.breadcrumbs = [ {
title:"Persistent Volume Claims",
link:"project/" + b.project + "/browse/storage"
}, {
title:b.pvc
} ];
var f = [];
d.get(b.project).then(_.spread(function(d, g) {
a.project = d, c.get("persistentvolumeclaims", b.pvc, g).then(function(d) {
a.loaded = !0, a.pvc = d, f.push(c.watchObject("persistentvolumeclaims", b.pvc, g, function(b, c) {
"DELETED" === c && (a.alerts.deleted = {
type:"warning",
message:"This persistent volume claim has been deleted."
}), a.pvc = b;
}));
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
} ]), angular.module("openshiftConsole").controller("SetLimitsController", [ "$filter", "$location", "$parse", "$routeParams", "$scope", "AlertMessageService", "APIService", "BreadcrumbsService", "DataService", "LimitRangesService", "Navigate", "ProjectsService", function(a, b, c, d, e, f, g, h, i, j, k, l) {
if (!d.kind || !d.name) return void k.toErrorPage("Kind or name parameter missing.");
var m = [ "Deployment", "DeploymentConfig", "ReplicaSet", "ReplicationController" ];
if (!_.includes(m, d.kind)) return void k.toErrorPage("Health checks are not supported for kind " + d.kind + ".");
var n = a("humanizeKind"), o = n(d.kind, !0) + " " + d.name;
e.name = d.name, "ReplicationController" !== d.kind && "ReplicaSet" !== d.kind || (e.showPodWarning = !0), e.alerts = {}, e.renderOptions = {
hideFilterWidget:!0
}, e.breadcrumbs = h.getBreadcrumbs({
name:d.name,
kind:d.kind,
namespace:d.project,
subpage:"Set Resource Limits",
includeProject:!0
});
var p = a("getErrorDetails"), q = function(a, b) {
e.alerts["set-compute-limits"] = {
type:"error",
message:a,
details:b
};
};
l.get(d.project).then(_.spread(function(c, l) {
e.breadcrumbs[0].title = a("displayName")(c);
var m = {
resource:g.kindToResource(d.kind),
group:d.group
};
i.get(m, e.name, l).then(function(a) {
var d = angular.copy(a);
e.breadcrumbs = h.getBreadcrumbs({
object:d,
project:c,
subpage:"Set Resource Limits",
includeProject:!0
}), e.resourceURL = k.resourceURL(d), e.containers = _.get(d, "spec.template.spec.containers"), e.save = function() {
e.disableInputs = !0, i.update(m, e.name, d, l).then(function() {
f.addAlert({
name:e.name,
data:{
type:"success",
message:o + " was updated."
}
}), b.url(e.resourceURL);
}, function(a) {
e.disableInputs = !1, q(o + " could not be updated.", p(a));
});
};
}, function(a) {
q(o + " could not be loaded.", p(a));
});
var n = function() {
e.hideCPU || (e.cpuProblems = j.validatePodLimits(e.limitRanges, "cpu", e.containers, c)), e.memoryProblems = j.validatePodLimits(e.limitRanges, "memory", e.containers, c);
};
i.list("limitranges", l, function(b) {
e.limitRanges = b.by("metadata.name"), 0 !== a("hashSize")(b) && e.$watch("containers", n, !0);
});
}));
} ]), angular.module("openshiftConsole").controller("EditBuildConfigController", [ "$scope", "$routeParams", "DataService", "ProjectsService", "$filter", "ApplicationGenerator", "Navigate", "$location", "AlertMessageService", "SOURCE_URL_PATTERN", "keyValueEditorUtils", function(a, b, c, d, e, f, g, h, i, j, k) {
a.projectName = b.project, a.buildConfig = null, a.alerts = {}, a.emptyMessage = "Loading...", a.sourceURLPattern = j, a.options = {}, a.jenkinsfileOptions = {
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
} ], a.breadcrumbs = [ {
title:b.project,
link:"project/" + b.project
} ], b.isPipeline ? (a.breadcrumbs.push({
title:"Pipelines",
link:"project/" + b.project + "/browse/pipelines"
}), a.breadcrumbs.push({
title:b.buildconfig,
link:"project/" + b.project + "/browse/pipelines/" + b.buildconfig
})) :(a.breadcrumbs.push({
title:"Builds",
link:"project/" + b.project + "/browse/builds"
}), a.breadcrumbs.push({
title:b.buildconfig,
link:"project/" + b.project + "/browse/builds/" + b.buildconfig
})), a.breadcrumbs.push({
title:"Edit"
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
}, a.runPolicyTypes = [ "Serial", "Parallel", "SerialLatestOnly" ], i.getAlerts().forEach(function(b) {
a.alerts[b.name] = b.data;
}), i.clearAlerts();
var l = [], m = e("buildStrategy");
d.get(b.project).then(_.spread(function(d, f) {
a.project = d, a.breadcrumbs[0].title = e("displayName")(d), c.get("buildconfigs", b.buildconfig, f).then(function(d) {
a.buildConfig = d, a.updatedBuildConfig = angular.copy(a.buildConfig), a.buildStrategy = m(a.updatedBuildConfig), a.strategyType = a.buildConfig.spec.strategy.type, a.envVars = a.buildStrategy.env || [], _.each(a.envVars, function(a) {
e("altTextForValueFrom")(a);
}), a.triggers = n(a.triggers, a.buildConfig.spec.triggers), a.sources = s(a.sources, a.buildConfig.spec.source), _.has(d, "spec.strategy.jenkinsPipelineStrategy.jenkinsfile") && (a.jenkinsfileOptions.type = "inline");
var g = function(a, b) {
a.type = b && b.kind ? b.kind :"None";
var c = {}, e = "", f = "";
c = "ImageStreamTag" === a.type ? {
namespace:b.namespace || d.metadata.namespace,
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
}, e = "ImageStreamImage" === a.type ? (b.namespace || d.metadata.namespace) + "/" + b.name :"", f = "DockerImage" === a.type ? b.name :"", a.imageStreamTag = c, a.imageStreamImage = e, a.dockerImage = f;
};
g(a.imageOptions.from, a.buildStrategy.from), g(a.imageOptions.to, a.updatedBuildConfig.spec.output.to), a.sources.images && (a.sourceImages = a.buildConfig.spec.source.images, 1 === a.sourceImages.length ? (a.imageSourceTypes = angular.copy(a.buildFromTypes), g(a.imageOptions.fromSource, a.sourceImages[0].from), a.imageSourcePaths = _.map(a.sourceImages[0].paths, function(a) {
return {
name:a.sourcePath,
value:a.destinationDir
};
})) :(a.imageSourceFromObjects = [], a.sourceImages.forEach(function(b) {
a.imageSourceFromObjects.push(b.from);
}))), a.options.forcePull = !!a.buildStrategy.forcePull, a.sources.binary && (a.options.binaryAsFile = a.buildConfig.spec.source.binary.asFile ? a.buildConfig.spec.source.binary.asFile :""), "Docker" === a.strategyType && (a.options.noCache = !!a.buildConfig.spec.strategy.dockerStrategy.noCache, a.buildFromTypes.push("None")), l.push(c.watchObject("buildconfigs", b.buildconfig, f, function(b, c) {
"MODIFIED" === c && (a.alerts.background_update = {
type:"warning",
message:"This build configuration has changed since you started editing it. You'll need to copy any changes you've made and edit again."
}), "DELETED" === c && (a.alerts.deleted = {
type:"warning",
message:"This build configuration has been deleted."
}, a.disableInputs = !0), a.buildConfig = b;
})), a.loaded = !0;
}, function(b) {
a.loaded = !0, a.alerts.load = {
type:"error",
message:"The build configuration details could not be loaded.",
details:"Reason: " + e("getErrorDetails")(b)
};
});
}));
var n = function(b, c) {
function d(b, c) {
var d = e("imageObjectRef")(b, a.projectName), f = e("imageObjectRef")(c, a.projectName);
return d === f;
}
var f = m(a.buildConfig).from;
return c.forEach(function(a) {
switch (a.type) {
case "Generic":
b.genericWebhooks.push({
disabled:!1,
data:a
});
break;

case "GitHub":
b.githubWebhooks.push({
disabled:!1,
data:a
});
break;

case "ImageChange":
var c = a.imageChange.from;
c || (c = f);
var e = {
present:!0,
data:a
};
d(c, f) ? b.builderImageChangeTrigger = e :b.imageChangeTriggers.push(e);
break;

case "ConfigChange":
b.configChangeTrigger = {
present:!0,
data:a
};
}
}), _.isEmpty(b.builderImageChangeTrigger) && (b.builderImageChangeTrigger = {
present:!1,
data:{
imageChange:{},
type:"ImageChange"
}
}), _.isEmpty(b.configChangeTrigger) && (b.configChangeTrigger = {
present:!1,
data:{
type:"ConfigChange"
}
}), b;
};
a.aceLoaded = function(a) {
var b = a.getSession();
b.setOption("tabSize", 2), b.setOption("useSoftTabs", !0), a.$blockScrolling = 1 / 0;
};
var o = function(a) {
return _.map(k.compactEntries(a), function(a) {
return {
sourcePath:a.name,
destinationDir:a.value
};
});
}, p = function() {
a.sources.binary && ("" !== a.options.binaryAsFile ? a.updatedBuildConfig.spec.source.binary.asFile = a.options.binaryAsFile :a.updatedBuildConfig.spec.source.binary = {});
}, q = function(b) {
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
}, r = function() {
var b = [].concat(a.triggers.githubWebhooks, a.triggers.genericWebhooks, a.triggers.imageChangeTriggers, a.triggers.builderImageChangeTrigger, a.triggers.configChangeTrigger);
return b = _.filter(b, function(a) {
return _.has(a, "disabled") && !a.disabled || a.present;
}), b = _.map(b, "data");
}, s = function(a, b) {
return "None" === b.type ? a :(a.none = !1, angular.forEach(b, function(b, c) {
a[c] = !0;
}), a);
};
a.save = function() {
switch (a.disableInputs = !0, m(a.updatedBuildConfig).forcePull = a.options.forcePull, a.strategyType) {
case "Docker":
m(a.updatedBuildConfig).noCache = a.options.noCache;
break;

case "JenkinsPipeline":
"path" === a.jenkinsfileOptions.type ? delete a.updatedBuildConfig.spec.strategy.jenkinsPipelineStrategy.jenkinsfile :delete a.updatedBuildConfig.spec.strategy.jenkinsPipelineStrategy.jenkinsfilePath;
}
p(), a.sources.images && !_.isEmpty(a.sourceImages) && (a.updatedBuildConfig.spec.source.images[0].paths = o(a.imageSourcePaths), a.updatedBuildConfig.spec.source.images[0].from = q(a.imageOptions.fromSource)), "None" === a.imageOptions.from.type ? delete m(a.updatedBuildConfig).from :m(a.updatedBuildConfig).from = q(a.imageOptions.from), "None" === a.imageOptions.to.type ? delete a.updatedBuildConfig.spec.output.to :a.updatedBuildConfig.spec.output.to = q(a.imageOptions.to), m(a.updatedBuildConfig).env = k.compactEntries(a.envVars), a.updatedBuildConfig.spec.triggers = r(), c.update("buildconfigs", a.updatedBuildConfig.metadata.name, a.updatedBuildConfig, {
namespace:a.updatedBuildConfig.metadata.namespace
}).then(function() {
i.addAlert({
name:a.updatedBuildConfig.metadata.name,
data:{
type:"success",
message:"Build Config " + a.updatedBuildConfig.metadata.name + " was successfully updated."
}
}), h.path(g.resourceURL(a.updatedBuildConfig, "BuildConfig", a.updatedBuildConfig.metadata.namespace));
}, function(b) {
a.disableInputs = !1, a.alerts.save = {
type:"error",
message:"An error occurred updating the build " + a.updatedBuildConfig.metadata.name + "Build Config",
details:e("getErrorDetails")(b)
};
});
}, a.$on("$destroy", function() {
c.unwatchAll(l);
});
} ]), angular.module("openshiftConsole").controller("EditAutoscalerController", [ "$scope", "$filter", "$routeParams", "$window", "APIService", "BreadcrumbsService", "DataService", "HPAService", "MetricsService", "Navigate", "ProjectsService", "keyValueEditorUtils", function(a, b, c, d, e, f, g, h, i, j, k, l) {
if (!c.kind || !c.name) return void j.toErrorPage("Kind or name parameter missing.");
var m = [ "Deployment", "DeploymentConfig", "HorizontalPodAutoscaler", "ReplicaSet", "ReplicationController" ];
if (!_.includes(m, c.kind)) return void j.toErrorPage("Autoscaling not supported for kind " + c.kind + ".");
a.kind = c.kind, a.name = c.name, "HorizontalPodAutoscaler" === c.kind ? a.disableInputs = !0 :(a.targetKind = c.kind, a.targetName = c.name), a.autoscaling = {
name:a.name
}, a.labels = [], i.isAvailable().then(function(b) {
a.metricsWarning = !b;
}), a.alerts = {};
var n = b("getErrorDetails"), o = function(b, c) {
a.alerts.autoscaling = {
type:"error",
message:b,
details:n(c)
};
};
k.get(c.project).then(_.spread(function(b, i) {
a.project = b;
var j = function() {
a.disableInputs = !0;
var b = {
apiVersion:"extensions/v1beta1",
kind:"HorizontalPodAutoscaler",
metadata:{
name:a.autoscaling.name,
labels:l.mapEntries(l.compactEntries(a.labels))
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
g.create({
resource:"horizontalpodautoscalers",
group:"extensions"
}, null, b, i).then(function() {
d.history.back();
}, function(b) {
a.disableInputs = !1, o("An error occurred creating the horizontal pod autoscaler.", b);
});
}, k = function(b) {
a.disableInputs = !0, b = angular.copy(b), b.metadata.labels = l.mapEntries(l.compactEntries(a.labels)), b.spec.minReplicas = a.autoscaling.minReplicas, b.spec.maxReplicas = a.autoscaling.maxReplicas, b.spec.cpuUtilization = {
targetPercentage:a.autoscaling.targetCPU || a.autoscaling.defaultTargetCPU
}, g.update({
resource:"horizontalpodautoscalers",
group:"extensions"
}, b.metadata.name, b, i).then(function() {
d.history.back();
}, function(c) {
a.disableInputs = !1, o('An error occurred updating horizontal pod autoscaler "' + b.metadata.name + '".', c);
});
}, m = {
resource:e.kindToResource(c.kind),
group:c.group
};
g.get(m, c.name, i).then(function(d) {
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
k(d);
}, a.breadcrumbs = f.getBreadcrumbs({
name:a.targetName,
kind:a.targetKind,
namespace:c.project,
project:b,
subpage:"Autoscale",
includeProject:!0
}); else {
a.breadcrumbs = f.getBreadcrumbs({
object:d,
project:b,
subpage:"Autoscale",
includeProject:!0
}), a.save = j;
var e = {}, l = function() {
var c = _.get(d, "spec.template.spec.containers", []);
a.showCPURequestWarning = !h.hasCPURequest(c, e, b);
};
g.list("limitranges", i, function(a) {
e = a.by("metadata.name"), l();
});
}
});
}));
} ]), angular.module("openshiftConsole").controller("EditHealthChecksController", [ "$filter", "$location", "$routeParams", "$scope", "AlertMessageService", "BreadcrumbsService", "APIService", "DataService", "Navigate", "ProjectsService", function(a, b, c, d, e, f, g, h, i, j) {
if (!c.kind || !c.name) return void i.toErrorPage("Kind or name parameter missing.");
var k = [ "Deployment", "DeploymentConfig", "ReplicaSet", "ReplicationController" ];
if (!_.includes(k, c.kind)) return void i.toErrorPage("Health checks are not supported for kind " + c.kind + ".");
d.name = c.name, d.resourceURL = i.resourceURL(d.name, c.kind, c.project), d.alerts = {}, d.renderOptions = {
hideFilterWidget:!0
}, d.breadcrumbs = f.getBreadcrumbs({
name:c.name,
kind:c.kind,
namespace:c.project,
subpage:"Edit Health Checks",
includeProject:!0
}), d.previousProbes = {};
var l = a("getErrorDetails"), m = function(a, b) {
d.alerts["add-health-check"] = {
type:"error",
message:a,
details:b
};
};
j.get(c.project).then(_.spread(function(i, j) {
var k = a("humanizeKind")(c.kind) + ' "' + d.name + '"', n = {
resource:g.kindToResource(c.kind),
group:c.group
};
h.get(n, d.name, j).then(function(a) {
var n = angular.copy(a);
d.breadcrumbs = f.getBreadcrumbs({
object:n,
project:i,
subpage:"Edit Health Checks",
includeProject:!0
}), d.containers = _.get(n, "spec.template.spec.containers"), d.addProbe = function(a, b) {
a[b] = _.get(d.previousProbes, [ a.name, b ], {}), d.form.$setDirty();
}, d.removeProbe = function(a, b) {
_.set(d.previousProbes, [ a.name, b ], a[b]), delete a[b], d.form.$setDirty();
}, d.save = function() {
d.disableInputs = !0, h.update(g.kindToResource(c.kind), d.name, n, j).then(function() {
e.addAlert({
name:d.name,
data:{
type:"success",
message:k + " was updated."
}
}), b.url(d.resourceURL);
}, function(a) {
d.disableInputs = !1, m(k + " could not be updated.", l(a));
});
};
}, function(a) {
m(k + " could not be loaded.", l(a));
});
}));
} ]), angular.module("openshiftConsole").controller("EditRouteController", [ "$filter", "$location", "$routeParams", "$scope", "AlertMessageService", "DataService", "Navigate", "ProjectsService", function(a, b, c, d, e, f, g, h) {
d.alerts = {}, d.renderOptions = {
hideFilterWidget:!0
}, d.projectName = c.project, d.routeName = c.route, d.loading = !0, d.routeURL = g.resourceURL(d.routeName, "Route", d.projectName), d.breadcrumbs = [ {
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
} ], h.get(c.project).then(_.spread(function(c, h) {
d.project = c, d.breadcrumbs[0].title = a("displayName")(c);
var i, j = a("orderByDisplayName");
f.get("routes", d.routeName, h).then(function(a) {
i = angular.copy(a), d.routing = {
service:_.get(i, "spec.to.name"),
host:_.get(i, "spec.host"),
path:_.get(i, "spec.path"),
targetPort:_.get(i, "spec.port.targetPort"),
tls:angular.copy(_.get(i, "spec.tls"))
}, f.list("services", h, function(a) {
var b = a.by("metadata.name"), c = _.get(i, "spec.to", {});
d.loading = !1, d.services = j(b), d.routing.to = {
service:b[c.name],
weight:c.weight
}, d.routing.alternateServices = [], _.each(_.get(i, "spec.alternateBackends"), function(a) {
return "Service" !== a.kind ? (g.toErrorPage('Editing routes with non-service targets is unsupported. You can edit the route with the "Edit YAML" action instead.'), !1) :void d.routing.alternateServices.push({
service:b[a.name],
weight:a.weight
});
});
});
}, function() {
g.toErrorPage("Could not load route " + d.routeName + ".");
});
var k = function() {
var a = _.get(d, "routing.to.service.metadata.name");
_.set(i, "spec.to.name", a);
var b = _.get(d, "routing.to.weight");
isNaN(b) || _.set(i, "spec.to.weight", b), i.spec.path = d.routing.path;
var c = d.routing.targetPort;
c ? _.set(i, "spec.port.targetPort", c) :delete i.spec.port, _.get(d, "routing.tls.termination") ? (i.spec.tls = d.routing.tls, "edge" !== i.spec.tls.termination && delete i.spec.tls.insecureEdgeTerminationPolicy) :delete i.spec.tls;
var e = _.get(d, "routing.alternateServices", []);
_.isEmpty(e) ? delete i.spec.alternateBackends :i.spec.alternateBackends = _.map(e, function(a) {
return {
kind:"Service",
name:_.get(a, "service.metadata.name"),
weight:a.weight
};
});
};
d.updateRoute = function() {
d.form.$valid && (d.disableInputs = !0, k(), f.update("routes", d.routeName, i, h).then(function() {
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
}));
};
}));
} ]), angular.module("openshiftConsole").controller("CreateFromImageController", [ "$scope", "Logger", "$q", "$routeParams", "APIService", "DataService", "ProjectsService", "Navigate", "ApplicationGenerator", "LimitRangesService", "MetricsService", "HPAService", "TaskList", "failureObjectNameFilter", "$filter", "$parse", "SOURCE_URL_PATTERN", "keyValueEditorUtils", function(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r) {
var s = o("displayName"), t = o("humanize");
a.projectName = d.project, a.sourceURLPattern = q;
var u = d.imageName;
a.breadcrumbs = [ {
title:a.projectName,
link:"project/" + a.projectName
}, {
title:"Add to Project",
link:"project/" + a.projectName + "/create"
}, {
title:u
} ];
var v = {
name:"app",
value:""
};
g.get(d.project).then(_.spread(function(g, n) {
function p(b) {
u || h.toErrorPage("Cannot create from source: a base image was not specified"), d.imageTag || h.toErrorPage("Cannot create from source: a base image tag was not specified"), b.emptyMessage = "Loading...", b.imageName = u, b.imageTag = d.imageTag, b.namespace = d.namespace, b.buildConfig = {
buildOnSourceChange:!0,
buildOnImageChange:!0,
buildOnConfigChange:!0
}, b.buildConfigEnvVars = [], b.deploymentConfig = {
deployOnNewImage:!0,
deployOnConfigChange:!0
}, b.DCEnvVarsFromImage, b.DCEnvVarsFromUser = [], b.routing = {
include:!0,
portOptions:[]
}, b.labels = [], b.systemLabels = [ v ], b.annotations = {}, b.scaling = {
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
}, b.cpuRequestCalculated = j.isRequestCalculated("cpu", g), b.cpuLimitCalculated = j.isLimitCalculated("cpu", g), b.memoryRequestCalculated = j.isRequestCalculated("memory", g), b.fillSampleRepo = function() {
var a;
(b.image || b.image.metadata || b.image.metadata.annotations) && (a = b.image.metadata.annotations, b.buildConfig.sourceUrl = a.sampleRepo || "", b.buildConfig.gitRef = a.sampleRef || "", b.buildConfig.contextDir = a.sampleContextDir || "");
}, b.usingSampleRepo = function() {
return b.buildConfig.sourceUrl === _.get(b, "image.metadata.annotations.sampleRepo");
}, k.isAvailable().then(function(b) {
a.metricsWarning = !b;
}), f.get("imagestreams", b.imageName, {
namespace:b.namespace || d.project
}).then(function(a) {
b.imageStream = a;
var c = b.imageTag;
f.get("imagestreamtags", a.metadata.name + ":" + c, {
namespace:b.namespace
}).then(function(a) {
b.image = a.image, b.DCEnvVarsFromImage = _.map(_.get(a, "image.dockerImageMetadata.Config.Env"), function(a) {
var b = a.split("=");
return {
name:_.head(b),
value:_.last(b)
};
});
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
a.project = g, a.breadcrumbs[0].title = o("displayName")(g);
var q = function() {
a.hideCPU || (a.cpuProblems = j.validatePodLimits(a.limitRanges, "cpu", [ a.container ], g)), a.memoryProblems = j.validatePodLimits(a.limitRanges, "memory", [ a.container ], g);
};
f.list("limitranges", n, function(b) {
a.limitRanges = b.by("metadata.name"), 0 !== o("hashSize")(b) && a.$watch("container", q, !0);
});
var w = function() {
return a.scaling.autoscale ? void (a.showCPURequestWarning = !l.hasCPURequest([ a.container ], a.limitRanges, g)) :void (a.showCPURequestWarning = !1);
};
a.$watch("scaling.autoscale", w), a.$watch("container", w, !0), a.$watch("name", function(a) {
v.value = a;
}), p(a);
var x = function(a, b) {
function g() {
0 === k && (i.length > 0 ? h.reject(i) :h.resolve(a));
}
var h = c.defer(), i = [], j = [], k = a.length;
return a.forEach(function(a) {
var c = e.objectToResourceGroupVersion(a);
return c ? e.apiInfo(c) ? void f.get(c, a.metadata.name, {
namespace:b || d.project
}, {
errorNotification:!1
}).then(function(a) {
i.push(a), k--, g();
}, function(a) {
j.push(a), k--, g();
}) :(j.push({
data:{
message:e.unsupportedObjectKindOrVersion(a)
}
}), k--, void g()) :(j.push({
data:{
message:e.invalidObjectKindOrVersion(a)
}
}), k--, void g());
}), h.promise;
}, y = function(b) {
var d = {
started:"Creating application " + a.name + " in project " + a.projectDisplayName(),
success:"Created application " + a.name + " in project " + a.projectDisplayName(),
failure:"Failed to create " + a.name + " in project " + a.projectDisplayName()
}, e = {};
m.clear(), m.add(d, e, function() {
var d = c.defer();
return f.batch(b, n).then(function(b) {
var c = [], e = !1;
b.failure.length > 0 ? (e = !0, b.failure.forEach(function(a) {
c.push({
type:"error",
message:"Cannot create " + t(a.object.kind).toLowerCase() + ' "' + a.object.metadata.name + '". ',
details:a.data.message
});
}), b.success.forEach(function(a) {
c.push({
type:"success",
message:"Created " + t(a.kind).toLowerCase() + ' "' + a.metadata.name + '" successfully. '
});
})) :c.push({
type:"success",
message:"All resources for application " + a.name + " were created successfully."
}), d.resolve({
alerts:c,
hasErrors:e
});
}), d.promise;
}, function(b) {
a.alerts.create = {
type:"error",
message:"An error occurred creating the application.",
details:"Status: " + b.status + ". " + b.data
};
}), h.toNextSteps(a.name, a.projectName, a.usingSampleRepo() ? {
fromSample:!0
} :null);
}, z = function() {
a.nameTaken = !0, a.disableInputs = !1;
};
a.projectDisplayName = function() {
return s(this.project) || this.projectName;
}, a.createApp = function() {
a.disableInputs = !0, a.buildConfig.envVars = r.mapEntries(r.compactEntries(a.buildConfigEnvVars)), a.deploymentConfig.envVars = r.mapEntries(r.compactEntries(a.DCEnvVarsFromUser));
var c = r.mapEntries(r.compactEntries(a.labels)), d = r.mapEntries(r.compactEntries(a.systemLabels));
a.labels = _.extend(d, c);
var e = i.generate(a), f = [];
angular.forEach(e, function(a) {
null !== a && (b.debug("Generated resource definition:", a), f.push(a));
}), x(f, a.projectName, a).then(y, z);
};
}));
} ]), angular.module("openshiftConsole").controller("NextStepsController", [ "$scope", "$http", "$routeParams", "DataService", "$q", "$location", "ProcessedTemplateService", "TaskList", "$parse", "Navigate", "$filter", "imageObjectRefFilter", "failureObjectNameFilter", "ProjectsService", function(a, b, c, d, e, f, g, h, i, j, k, l, m, n) {
function o() {
return u && t;
}
function p() {
return r && s && t;
}
var q = (k("displayName"), []);
a.emptyMessage = "Loading...", a.alerts = [], a.loginBaseUrl = d.openshiftAPIBaseUrl(), a.buildConfigs = {}, a.showParamsTable = !1, a.projectName = c.project;
var r = c.imageName, s = c.imageTag, t = c.namespace;
a.fromSampleRepo = c.fromSample;
var u = c.name, v = "";
p() ? v = "project/" + a.projectName + "/create/fromimage?imageName=" + r + "&imageTag=" + s + "&namespace=" + t + "&name=" + u :o() && (v = "project/" + a.projectName + "/create/fromtemplate?name=" + u + "&namespace=" + t), a.breadcrumbs = [ {
title:a.projectName,
link:"project/" + a.projectName
}, {
title:"Add to Project",
link:"project/" + a.projectName + "/create"
}, {
title:u,
link:v
}, {
title:"Next Steps"
} ];
var w = g.getTemplateData();
a.parameters = w.params, _.each(a.parameters, function(a) {
k("altTextForValueFrom")(a);
}), a.templateMessage = w.message, g.clearTemplateData(), n.get(c.project).then(_.spread(function(b, c) {
function e(a) {
var b = [];
return angular.forEach(a, function(a) {
a.hasErrors && b.push(a);
}), b;
}
function f(a) {
var b = [];
return angular.forEach(a, function(a) {
"completed" !== a.status && b.push(a);
}), b;
}
return a.project = b, a.breadcrumbs[0].title = k("displayName")(b), u ? (q.push(d.watch("buildconfigs", c, function(b) {
a.buildConfigs = b.by("metadata.name"), a.createdBuildConfig = a.buildConfigs[u], Logger.log("buildconfigs (subscribe)", a.buildConfigs);
})), a.createdBuildConfigWithGitHubTrigger = function() {
return _.some(_.get(a, "createdBuildConfig.spec.triggers"), {
type:"GitHub"
});
}, a.createdBuildConfigWithConfigChangeTrigger = function() {
return _.some(_.get(a, "createdBuildConfig.spec.triggers"), {
type:"ConfigChange"
});
}, a.allTasksSuccessful = function(a) {
return !f(a).length && !e(a).length;
}, a.toggleParamsTable = function() {
a.showParamsTable = !0;
}, a.erroredTasks = e, a.pendingTasks = f, void a.$on("$destroy", function() {
d.unwatchAll(q);
})) :void j.toProjectOverview(a.projectName);
}));
} ]), angular.module("openshiftConsole").controller("NewFromTemplateController", [ "$scope", "$http", "$routeParams", "DataService", "ProcessedTemplateService", "AlertMessageService", "ProjectsService", "$q", "$location", "TaskList", "$parse", "Navigate", "$filter", "imageObjectRefFilter", "failureObjectNameFilter", "CachedTemplateService", "keyValueEditorUtils", function(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q) {
var r = c.name, s = c.namespace || "";
if (!r) return void l.toErrorPage("Cannot create from template: a template name was not specified.");
a.emptyMessage = "Loading...", a.alerts = {}, a.projectName = c.project, a.projectPromise = $.Deferred(), a.labels = [], a.systemLabels = [], a.breadcrumbs = [ {
title:a.projectName,
link:"project/" + a.projectName
}, {
title:"Add to Project",
link:"project/" + a.projectName + "/create"
}, {
title:r
} ], a.alerts = a.alerts || {}, f.getAlerts().forEach(function(b) {
a.alerts[b.name] = b.data;
}), f.clearAlerts();
var t = m("displayName"), u = m("humanize"), v = k("spec.template.spec.containers"), w = k("spec.strategy.sourceStrategy.from || spec.strategy.dockerStrategy.from || spec.strategy.customStrategy.from"), x = k("spec.output.to");
g.get(c.project).then(_.spread(function(b, f) {
function g(a, b) {
var c = _.get(a, "spec.triggers", []), d = _.find(c, function(a) {
if ("ImageChange" !== a.type) return !1;
var c = _.get(a, "imageChangeParams.containerNames", []);
return _.includes(c, b.name);
});
return _.get(d, "imageChangeParams.from.name");
}
function k(a) {
var b = [], c = v(a);
return c && angular.forEach(c, function(c) {
var d = c.image;
_.trim(d) || (d = g(a, c)), d && b.push(d);
}), b;
}
function o(b) {
var c = [], d = [], e = {};
return angular.forEach(b.objects, function(b) {
if ("BuildConfig" === b.kind) {
var f = n(w(b), a.projectName);
f && c.push({
name:f
});
var g = n(x(b), a.projectName);
g && (e[g] = !0);
}
"DeploymentConfig" === b.kind && (d = d.concat(k(b)));
}), d.forEach(function(a) {
e[a] || c.push({
name:a
});
}), c;
}
function y(a) {
var b = /^helplink\.(.*)\.title$/, c = /^helplink\.(.*)\.url$/, d = {};
for (var e in a.annotations) {
var f, g = e.match(b);
g ? (f = d[g[1]] || {}, f.title = a.annotations[e], d[g[1]] = f) :(g = e.match(c), g && (f = d[g[1]] || {}, f.url = a.annotations[e], d[g[1]] = f));
}
return d;
}
function z(b) {
a.templateImages = o(a.template), a.systemLabels = _.map(a.template.labels, function(a, b) {
return {
name:b,
value:a
};
}), a.systemLabels.push({
name:"app",
value:a.template.metadata.name
});
}
if (a.project = b, a.breadcrumbs[0].title = m("displayName")(b), a.projectDisplayName = function() {
return t(this.project) || this.projectName;
}, a.templateDisplayName = function() {
return t(this.template);
}, a.createFromTemplate = function() {
a.disableInputs = !0;
var b = q.mapEntries(q.compactEntries(a.labels)), g = q.mapEntries(q.compactEntries(a.systemLabels));
a.template.labels = _.extend(g, b), d.create("processedtemplates", null, a.template, f).then(function(b) {
var g = {
started:"Creating " + a.templateDisplayName() + " in project " + a.projectDisplayName(),
success:"Created " + a.templateDisplayName() + " in project " + a.projectDisplayName(),
failure:"Failed to create " + a.templateDisplayName() + " in project " + a.projectDisplayName()
};
e.setTemplateData(b.parameters, a.template.parameters, b.message);
var i = y(a.template);
j.clear(), j.add(g, i, function() {
var c = h.defer();
return d.batch(b.objects, f).then(function(b) {
var d = [], e = !1;
b.failure.length > 0 ? (e = !0, b.failure.forEach(function(a) {
d.push({
type:"error",
message:"Cannot create " + u(a.object.kind).toLowerCase() + ' "' + a.object.metadata.name + '". ',
details:a.data.message
});
}), b.success.forEach(function(a) {
d.push({
type:"success",
message:"Created " + u(a.kind).toLowerCase() + ' "' + a.metadata.name + '" successfully. '
});
})) :d.push({
type:"success",
message:"All items in template " + a.templateDisplayName() + " were created successfully."
}), c.resolve({
alerts:d,
hasErrors:e
});
}), c.promise;
}), l.toNextSteps(c.name, a.projectName);
}, function(b) {
a.disableInputs = !1;
var c;
b.data && b.data.message && (c = b.data.message), a.alerts.process = {
type:"error",
message:"An error occurred processing the template.",
details:c
};
});
}, s) d.get("templates", r, {
namespace:s || a.projectName
}).then(function(b) {
a.template = b, z();
}, function() {
l.toErrorPage("Cannot create from template: the specified template could not be retrieved.");
}); else {
if (a.template = p.getTemplate(), _.isEmpty(a.template)) {
var A = URI("error").query({
error:"not_found",
error_description:"Template wasn't found in cache."
}).toString();
i.url(A);
}
p.clearTemplate(), z();
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
} ]), angular.module("openshiftConsole").controller("CreateController", [ "$q", "$uibModal", "$routeParams", "$scope", "DataService", "ProjectsService", "tagsFilter", "uidFilter", "hashSizeFilter", "imageStreamTagAnnotationFilter", "descriptionFilter", "LabelFilter", "$filter", "$location", "AlertMessageService", "Logger", function(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p) {
function q(a, b, c) {
var d;
for (a = a.toLowerCase(), d = 0; d < b.length; d++) {
var e = b[d].toLowerCase();
if (a === e || c && 0 === e.indexOf(a)) return !0;
}
return !1;
}
function r(a, b, c, d) {
return !!q(d, c, !0) || (a.toLowerCase().indexOf(d) !== -1 || b && b.toLowerCase().indexOf(d) !== -1);
}
function s(a, b, c) {
var e, f;
if (d.filter.tag && !q(d.filter.tag, c)) return !1;
if (d.filter.keyword) for (e = d.filter.keyword.split(/\s+/), f = 0; f < e.length; f++) if (!r(a, b, c, e[f])) return !1;
return !0;
}
function t(a) {
var b = d.filteredBuildersByCategory[a] || [], c = d.filteredTemplatesByCategory[a] || [];
return Math.min(b.length, d.itemLimit) + Math.min(c.length, d.itemLimit);
}
function u() {
var a = 0, b = 0, c = d.filteredCategoryTags;
d.leftCategories = [], d.rightCategories = [], angular.forEach(c, function(c) {
a > b ? (d.rightCategories.push(c), b += t(c)) :(d.leftCategories.push(c), a += t(c));
});
}
function v() {
d.filteredCategoryTags = [], d.filteredBuildersByCategory = {}, d.filteredTemplatesByCategory = {}, d.filteredNonBuilders = [], angular.forEach(d.categoryTags, function(a) {
var b, c, e = E[a] || [], f = F[a] || [];
b = e.filter(function(a) {
return s(a.name, a.description, a.categoryTags);
}), d.filteredBuildersByCategory[a] = b, c = f.filter(function(a) {
var b = g(a);
return s(a.metadata.name, k(a), b);
}), d.filteredTemplatesByCategory[a] = c, (b.length || c.length) && d.filteredCategoryTags.push(a);
}), u(), d.filteredNonBuilders = G.filter(function(a) {
return s(a.name, a.description, a.categoryTags);
});
}
function w(a) {
angular.forEach(a, function(a) {
if (a.status) {
var b = {}, c = {}, d = {};
a.spec && a.spec.tags && angular.forEach(a.spec.tags, function(a) {
a.annotations && a.annotations.tags && (b[a.name] = a.annotations.tags.split(/\s*,\s*/)), a.from && "ImageStreamTag" === a.from.kind && a.from.name.indexOf(":") === -1 && !a.from.namespace && (c[a.name] = !0, d[a.from.name] = d[a.from.name] || [], d[a.from.name].push(a.name));
}), angular.forEach(a.status.tags, function(e) {
if (!c[e.tag]) {
var f, g = e.tag, h = b[g] || [], i = {
imageStream:a,
imageStreamTag:g,
name:a.metadata.name + ":" + g,
description:j(a, "description", g),
version:j(a, "version", g),
categoryTags:h,
referencedBy:d[g]
};
h.indexOf("builder") >= 0 ? (f = y(h), E[f] = E[f] || [], E[f].push(i)) :G.push(i);
}
});
}
});
}
function x(a) {
angular.forEach(a, function(a) {
var b = g(a), c = y(b);
F[c] = F[c] || [], F[c].push(a);
});
}
function y(a) {
var b, c;
for (b = 0; b < d.categoryTags.length; b++) for (c = 0; c < a.length; c++) if (a[c].toLowerCase() === d.categoryTags[b]) return d.categoryTags[b];
return "";
}
function z() {
d.loaded = C && D && A && B, d.emptyCatalog = 0 === i(C) && 0 === i(D) && 0 === i(E), v(), d.loaded && (p.info("templates by category", F), p.info("builder images", E), p.info("non-builder images", G));
}
var A, B, C, D, E = {}, F = {}, G = [];
d.projectName = c.project, d.categoryTags = [ "instant-app", "xpaas", "java", "php", "ruby", "perl", "python", "nodejs", "database", "messaging", "" ], d.browseGeneral = [ "instant-app", "quickstart" ], d.browseTechnologies = _.difference(d.categoryTags, d.browseGeneral), d.categoryLabels = {
"instant-app":"Instant Apps",
java:"Java",
xpaas:"xPaaS",
php:"PHP",
ruby:"Ruby",
perl:"Perl",
python:"Python",
nodejs:"NodeJS",
database:"Databases",
messaging:"Messaging",
"":"Other"
}, d.filteredCategoryTags = [], d.filteredTemplatesByCategory = {}, d.filteredBuildersByCategory = {}, d.loaded = !1, d.emptyCatalog = !0, d.itemLimit = 4, d.filter = {
keyword:"",
tag:""
}, d.alerts = d.alerts || {}, o.getAlerts().forEach(function(a) {
d.alerts[a.name] = a.data;
}), o.clearAlerts(), d.editorContent = "", d.breadcrumbs = [ {
title:d.projectName,
link:"project/" + d.projectName
}, {
title:"Add to Project"
} ], d.selectedTab = {}, c.tab && (d.selectedTab[c.tab] = !0), d.filterTag = function(a) {
d.filter.tag = a;
}, d.$watch("filter", v, !0), f.get(c.project).then(_.spread(function(a, b) {
d.project = a, d.context = b, d.breadcrumbs[0].title = m("displayName")(a), e.list("templates", b, function(a) {
C = a.by("metadata.name"), x(C), z();
}), e.list("templates", {
namespace:"openshift"
}, function(a) {
D = a.by("metadata.name"), x(D), z();
}), e.list("imagestreams", b, function(a) {
A = a.by("metadata.name"), w(A), z();
}), e.list("imagestreams", {
namespace:"openshift"
}, function(a) {
B = a.by("metadata.name"), w(B), z();
});
}));
} ]), angular.module("openshiftConsole").controller("CreateProjectController", [ "$scope", "$location", "AuthService", "DataService", "AlertMessageService", function(a, b, c, d, e) {
a.alerts = {}, c.withUser(), e.getAlerts().forEach(function(b) {
a.alerts[b.name] = b.data;
}), e.clearAlerts(), a.createProject = function() {
a.disableInputs = !0, a.createProjectForm.$valid && d.create("projectrequests", null, {
apiVersion:"v1",
kind:"ProjectRequest",
metadata:{
name:a.name
},
displayName:a.displayName,
description:a.description
}, a).then(function(a) {
b.path("project/" + encodeURIComponent(a.metadata.name) + "/create");
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
} ]), angular.module("openshiftConsole").controller("CreateRouteController", [ "$filter", "$routeParams", "$scope", "$window", "ApplicationGenerator", "DataService", "Navigate", "ProjectsService", function(a, b, c, d, e, f, g, h) {
c.alerts = {}, c.renderOptions = {
hideFilterWidget:!0
}, c.projectName = b.project, c.serviceName = b.service, c.routing = {
name:c.serviceName || ""
}, c.breadcrumbs = [ {
title:c.projectName,
link:"project/" + c.projectName
}, {
title:"Routes",
link:"project/" + c.projectName + "/browse/routes"
}, {
title:"Create Route"
} ], h.get(b.project).then(_.spread(function(b, g) {
c.project = b, c.breadcrumbs[0].title = a("displayName")(b);
var h = {}, i = a("orderByDisplayName");
f.list("services", g, function(a) {
c.services = i(a.by("metadata.name")), c.routing.to = {}, c.routing.to.service = _.find(c.services, function(a) {
return !c.serviceName || a.metadata.name === c.serviceName;
}), c.$watch("routing.to.service", function() {
h = angular.copy(c.routing.to.service.metadata.labels);
});
}), c.createRoute = function() {
if (c.createRouteForm.$valid) {
c.disableInputs = !0;
var b = c.routing.to.service.metadata.name, i = e.createRoute(c.routing, b, h), j = _.get(c, "routing.alternateServices", []);
_.isEmpty(j) || (i.spec.to.weight = _.get(c, "routing.to.weight"), i.spec.alternateBackends = _.map(j, function(a) {
return {
kind:"Service",
name:_.get(a, "service.metadata.name"),
weight:a.weight
};
})), f.create("routes", null, i, g).then(function() {
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
} ]), angular.module("openshiftConsole").controller("AttachPVCController", [ "$filter", "$routeParams", "$scope", "$window", "APIService", "BreadcrumbsService", "DataService", "Navigate", "ProjectsService", "StorageService", function(a, b, c, d, e, f, g, h, i, j) {
if (!b.kind || !b.name) return void h.toErrorPage("Kind or name parameter missing.");
var k = [ "Deployment", "DeploymentConfig", "ReplicaSet", "ReplicationController" ];
if (!_.includes(k, b.kind)) return void h.toErrorPage("Storage is not supported for kind " + b.kind + ".");
var l = {
resource:e.kindToResource(b.kind),
group:b.group
};
c.alerts = {}, c.renderOptions = {
hideFilterWidget:!0
}, c.projectName = b.project, c.kind = b.kind, c.name = b.name, c.attach = {
persistentVolumeClaim:null,
volumeName:null,
mountPath:null,
containers:{
all:!0,
individual:{}
}
}, c.breadcrumbs = f.getBreadcrumbs({
name:b.name,
kind:b.kind,
namespace:b.project,
subpage:"Attach Storage",
includeProject:!0
}), i.get(b.project).then(_.spread(function(e, h) {
c.project = e, c.breadcrumbs[0].title = a("displayName")(e);
var i = a("orderByDisplayName"), k = a("getErrorDetails"), m = a("generateName"), n = function(a, b) {
c.disableInputs = !0, c.alerts["attach-persistent-volume-claim"] = {
type:"error",
message:a,
details:b
};
}, o = function() {
g.get(l, b.name, h).then(function(a) {
angular.forEach(a.spec.template.spec.containers, function(a) {
c.attach.containers.individual[a.name] = !0;
}), c.attach.resource = a, c.breadcrumbs = f.getBreadcrumbs({
object:a,
project:e,
subpage:"Attach Storage",
includeProject:!0
});
}, function(a) {
n(b.name + " could not be loaded.", k(a));
}), g.list("persistentvolumeclaims", h, function(a) {
c.pvcs = i(a.by("metadata.name")), c.pvcs.length && (c.attach.persistentVolumeClaim || (c.attach.persistentVolumeClaim = c.pvcs[0]));
}, function(a) {
n("The persistent volume claims could not be loaded.", k(a));
});
}, p = function(a, b) {
if (b.spec.volumes) for (var d = 0; d < b.spec.volumes.length; d++) {
var e = b.spec.volumes[d];
if (e.name === a) return c.isVolumeNameUsed = !0, !0;
}
return c.isVolumeNameUsed = !1, !1;
}, q = function(a, b, d) {
if (d.spec.containers) for (var e = 0; e < d.spec.containers.length; e++) {
var f = d.spec.containers[e];
if ((c.attach.containers.all || c.attach.containers.individual[f.name]) && f.volumeMounts) for (var g = 0; g < f.volumeMounts.length; g++) {
var h = f.volumeMounts[g];
if (h.mountPath === b && a !== h.Name) return c.isVolumeMountPathUsed = !0, !0;
}
}
return c.isVolumeMountPathUsed = !1, !1;
};
o(), c.containerToAttachProvided = function() {
if (c.attach.containers.all) return !0;
for (var a in c.attach.containers.individual) if (c.attach.containers.individual[a] === !0) return !0;
return !1;
}, c.attachPVC = function() {
if (c.disableInputs = !0, c.attachPVCForm.$valid) {
c.attach.volumeName || (c.attach.volumeName = m("volume-"));
var e = c.attach.resource, f = _.get(e, "spec.template"), i = c.attach.persistentVolumeClaim, o = c.attach.volumeName, r = c.attach.mountPath;
if (p(o, f)) return void (c.disableInputs = !1);
if (r) {
if (q(o, r, f)) return void (c.disableInputs = !1);
angular.forEach(f.spec.containers, function(a) {
if (c.attach.containers.all || c.attach.containers.individual[a.name]) {
var b = j.createVolumeMount(o, r);
a.volumeMounts || (a.volumeMounts = []), a.volumeMounts.push(b);
}
});
}
var s = j.createVolume(o, i);
f.spec.volumes || (f.spec.volumes = []), f.spec.volumes.push(s), c.alerts = {}, g.update(l, e.metadata.name, c.attach.resource, h).then(function() {
d.history.back();
}, function(c) {
n("An error occurred attaching the persistent volume claim to the " + a("humanizeKind")(b.kind) + ".", k(c));
});
}
};
}));
} ]), angular.module("openshiftConsole").controller("ConfirmModalController", [ "$scope", "$uibModalInstance", "message", "details", "okButtonText", "okButtonClass", "cancelButtonText", function(a, b, c, d, e, f, g) {
a.message = c, a.details = d, a.okButtonText = e, a.okButtonClass = f, a.cancelButtonText = g, a.confirm = function() {
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
} ]), angular.module("openshiftConsole").controller("DeleteModalController", [ "$scope", "$uibModalInstance", function(a, b) {
a["delete"] = function() {
b.close("delete");
}, a.cancel = function() {
b.dismiss("cancel");
};
} ]), angular.module("openshiftConsole").controller("EditModalController", [ "$scope", "$filter", "$uibModalInstance", "APIService", "DataService", function(a, b, c, d, e) {
var f = angular.copy(a.resource), g = function(a) {
return _.get(a, "metadata.resourceVersion");
};
a.$watch("resource", function(b) {
a.resourceChanged = g(b) !== g(f);
}), f = angular.extend({
apiVersion:f.apiVersion,
kind:f.kind
}, f), a.model = jsyaml.safeDump(f, {
flowLevel:8
});
var h = _.throttle(function() {
a.$eval(function() {
a.modified = !0;
});
}, 1e3);
a.aceLoaded = function(b) {
var c = b.getSession();
c.setOption("tabSize", 2), c.setOption("useSoftTabs", !0), b.getSession().on("change", h);
var d = function() {
var a = $(".modal-resource-edit .modal-header").outerHeight(), c = $(".modal-resource-edit .modal-footer").outerHeight(), d = window.innerHeight - a - c, e = Math.floor(.8 * d);
$(".modal-resource-edit .editor").animate({
height:e + "px"
}, 30, function() {
b.resize();
});
};
setTimeout(d, 10);
var e = _.debounce(d, 200);
$(window).resize(e), a.$on("$destroy", function() {
$(window).off("resize", e);
});
}, a.save = function() {
a.modified = !1;
var g;
try {
g = jsyaml.safeLoad(a.model);
} catch (h) {
return void (a.error = h);
}
if (_.isEqual(f, g)) return void c.close("no-changes");
if (g.kind !== f.kind) return void (a.error = {
message:"Cannot change resource kind (original: " + f.kind + ", modified: " + (g.kind || "<unspecified>") + ")."
});
var i = d.objectToResourceGroupVersion(f), j = d.objectToResourceGroupVersion(g);
return j ? j.group !== i.group ? void (a.error = {
message:"Cannot change resource group (original: " + (i.group || "<none>") + ", modified: " + (j.group || "<none>") + ")."
}) :d.apiInfo(j) ? void e.update(d.kindToResource(a.kind), a.resource.metadata.name, g, {
namespace:a.resource.metadata.namespace
}).then(function() {
c.close("save");
}, function(c) {
a.error = {
message:b("getErrorDetails")(c)
};
}) :void (a.error = {
message:d.unsupportedObjectKindOrVersion(g)
}) :void (a.error = {
message:d.invalidObjectKindOrVersion(g)
});
}, a.cancel = function() {
c.dismiss("cancel");
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
} ]), angular.module("openshiftConsole").controller("CreatePersistentVolumeClaimController", [ "$filter", "$routeParams", "$scope", "$window", "ApplicationGenerator", "DataService", "Navigate", "ProjectsService", function(a, b, c, d, e, f, g, h) {
c.alerts = {}, c.projectName = b.project, c.accessModes = "ReadWriteOnce", c.claim = {}, c.breadcrumbs = [ {
title:c.projectName,
link:"project/" + c.projectName
}, {
title:"Storage",
link:"project/" + c.projectName + "/browse/storage"
}, {
title:"Request Storage"
} ], h.get(b.project).then(_.spread(function(b, e) {
function g() {
var a = {
kind:"PersistentVolumeClaim",
apiVersion:"v1",
metadata:{
name:c.claim.name,
labels:{}
},
spec:{
resources:{
requests:{}
}
}
};
a.spec.accessModes = [ c.claim.accessModes || "ReadWriteOnce" ];
var b = c.claim.unit || "Mi";
return a.spec.resources.requests.storage = c.claim.amount + b, a;
}
c.project = b, c.breadcrumbs[0].title = a("displayName")(b), c.createPersistentVolumeClaim = function() {
if (c.createPersistentVolumeClaimForm.$valid) {
c.disableInputs = !0;
var b = g();
f.create("persistentvolumeclaims", null, b, e).then(function() {
d.history.back();
}, function(b) {
c.disableInputs = !1, c.alerts["create-persistent-volume-claim"] = {
type:"error",
message:"An error occurred requesting storage claim.",
details:a("getErrorDetails")(b)
};
});
}
};
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
} ]), angular.module("openshiftConsole").directive("relativeTimestamp", function() {
return {
restrict:"E",
scope:{
timestamp:"=",
dropSuffix:"=?"
},
template:'<span data-timestamp="{{timestamp}}" data-drop-suffix="{{dropSuffix}}" class="timestamp" title="{{timestamp | date : \'short\'}}">{{timestamp | dateRelative : dropSuffix}}</span>'
};
}).directive("timeOnlyDurationUntilNow", function() {
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
} ]), angular.module("openshiftConsole").directive("editLink", [ "$uibModal", "Logger", function(a, b) {
return {
restrict:"E",
scope:{
resource:"=",
kind:"@",
alerts:"=?",
success:"=?"
},
templateUrl:"views/directives/edit-link.html",
replace:!0,
link:function(c) {
c.openEditModal = function() {
c.alerts && delete c.alerts["edit-yaml"];
var d = a.open({
animation:!0,
templateUrl:"views/modals/edit-resource.html",
controller:"EditModalController",
scope:c,
size:"lg",
backdrop:"static"
});
d.result.then(function(a) {
if (c.alerts) switch (a) {
case "no-changes":
c.alerts["edit-yaml"] = {
type:"warning",
message:"There were no changes to " + c.resource.metadata.name + " to save. Edit cancelled."
};
break;

case "save":
c.success && c.success(), c.alerts["edit-yaml"] = {
type:"success",
message:c.resource.metadata.name + " was updated."
};
break;

default:
b.warn("Unknown edit modal result: " + a);
}
});
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
bcName:"@",
projectName:"@",
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
} ]), angular.module("openshiftConsole").directive("events", [ "$routeParams", "$filter", "DataService", "ProjectsService", "Logger", function(a, b, c, d, e) {
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
}, d = [], f = _.get(a, "sortConfig.currentField.id"), g = {
lastTimestamp:!0
}, h = function() {
var b = _.get(a, "sortConfig.currentField.id", "lastTimestamp");
f !== b && (f = b, a.sortConfig.isAscending = !g[f]);
var c = a.sortConfig.isAscending ? "asc" :"desc";
d = _.sortByOrder(a.events, [ b ], [ c ]);
}, i = [], j = function() {
if (!a.filter.text) return void (i = []);
var b = _.uniq(a.filter.text.split(/\s+/));
b.sort(function(a, b) {
return b.length - a.length;
}), i = _.map(b, function(a) {
return new RegExp(_.escapeRegExp(a), "i");
});
}, k = [ "reason", "message", "type" ];
a.resourceKind && a.resourceName || k.splice(0, 0, "involvedObject.name", "involvedObject.kind");
var l = function() {
a.filteredEvents = d, i.length && angular.forEach(i, function(b) {
var c = function(a) {
var c;
for (c = 0; c < k.length; c++) {
var d = _.get(a, k[c]);
if (d && b.test(d)) return !0;
}
return !1;
};
a.filteredEvents = _.filter(a.filteredEvents, c);
});
};
a.$watch("filter.text", _.debounce(function() {
j(), a.$apply(l);
}, 50, {
maxWait:250
}));
var m = function() {
h(), l();
}, n = _.debounce(function() {
a.$evalAsync(m);
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
onSortChange:m
}, a.resourceKind && a.resourceName || a.sortConfig.fields.splice(1, 0, {
id:"involvedObject.name",
title:"Name",
sortType:"alpha"
}, {
id:"involvedObject.kind",
title:"Kind",
sortType:"alpha"
});
var o = [];
o.push(c.watch("events", a.projectContext, function(c) {
a.events = b(c.by("metadata.name")), n(), e.log("events (subscribe)", a.filteredEvents);
})), a.$on("$destroy", function() {
c.unwatchAll(o);
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
} ]), angular.module("openshiftConsole").directive("fromFile", [ "$q", "$uibModal", "$location", "$filter", "CachedTemplateService", "AlertMessageService", "Navigate", "TaskList", "DataService", "APIService", function(a, b, c, d, e, f, g, h, i, j) {
return {
restrict:"E",
scope:!1,
templateUrl:"views/directives/from-file.html",
controller:[ "$scope", function(k) {
function l(a) {
return a.kind ? a.metadata ? a.metadata.name || a.kind.endsWith("List") ? !a.metadata.namespace || a.metadata.namespace === k.projectName || (k.error = {
message:a.kind + " " + a.metadata.name + " can't be created in project " + a.metadata.namespace + ". Can't create resource in different projects."
}, !1) :(k.error = {
message:"Resource name is missing in metadata field."
}, !1) :(k.error = {
message:"Resource is missing metadata field."
}, !1) :(k.error = {
message:"Resource is missing kind field."
}, !1);
}
function m() {
var a = b.open({
animation:!0,
templateUrl:"views/modals/process-template.html",
controller:"ProcessTemplateModalController",
scope:k
});
a.result.then(function() {
k.templateOptions.add ? o() :(e.setTemplate(k.resourceList[0]), p());
});
}
function n() {
var a = b.open({
animation:!0,
templateUrl:"views/modals/confirm-replace.html",
controller:"ConfirmReplaceModalController",
scope:k
});
a.result.then(function() {
o();
});
}
function o() {
var b = k.createResources.length, c = k.updateResources.length;
if (k.resourceKind.endsWith("List")) {
var d = [];
c > 0 && d.push(t()), b > 0 && d.push(s()), a.all(d).then(p);
} else r();
}
function p() {
var a;
if ("Template" === k.resourceKind && k.templateOptions.process && !k.errorOccured) {
var b = k.templateOptions.add || k.updateResources.length > 0 ? k.projectName :"";
a = g.fromTemplateURL(k.projectName, k.resourceName, b);
} else a = g.projectOverviewURL(k.projectName);
c.url(a);
}
function q(a) {
var b = j.objectToResourceGroupVersion(a);
return b ? j.apiInfo(b) ? i.get(b, a.metadata.name, k.context, {
errorNotification:!1
}).then(function(b) {
var c = angular.copy(a), d = angular.copy(b.metadata);
d.annotations = a.metadata.annotations, d.labels = a.metadata.labels, c.metadata = d, k.updateResources.push(c);
}, function(b) {
404 === b.status ? k.createResources.push(a) :(k.alerts.check = {
type:"error",
message:"An error occurred checking if the " + v(a.kind) + " " + a.metadata.name + " already exists.",
details:"Reason: " + d("getErrorDetails")(b)
}, k.errorOccured = !0);
}) :(k.errorOccured = !0, void (k.error = {
message:j.unsupportedObjectKindOrVersion(a)
})) :(k.errorOccured = !0, void (k.error = {
message:j.invalidObjectKindOrVersion(a)
}));
}
function r() {
var a;
_.isEmpty(k.createResources) ? (a = _.head(k.updateResources), i.update(j.kindToResource(a.kind), a.metadata.name, a, {
namespace:k.projectName
}).then(function() {
f.addAlert({
name:a.metadata.name,
data:{
type:"success",
message:a.kind + " " + a.metadata.name + " was successfully updated."
}
}), p();
}, function(a) {
k.error = {
message:d("getErrorDetails")(a)
};
})) :(a = _.head(k.createResources), i.create(j.kindToResource(a.kind), null, a, {
namespace:k.projectName
}).then(function() {
f.addAlert({
name:a.metadata.name,
data:{
type:"success",
message:a.kind + " " + a.metadata.name + " was successfully created."
}
}), p();
}, function(a) {
k.error = {
message:d("getErrorDetails")(a)
};
}));
}
function s() {
var b = {
started:"Creating resources in project " + k.projectName,
success:"Creating resources in project " + k.projectName,
failure:"Failed to create some resources in project " + k.projectName
}, c = {};
h.add(b, c, function() {
var b = a.defer();
return i.batch(k.createResources, k.context, "create").then(function(a) {
var c = [], d = !1;
if (a.failure.length > 0) d = !0, k.errorOccured = !0, a.failure.forEach(function(a) {
c.push({
type:"error",
message:"Cannot create " + v(a.object.kind) + ' "' + a.object.metadata.name + '". ',
details:a.data.message
});
}), a.success.forEach(function(a) {
c.push({
type:"success",
message:"Created " + v(a.kind) + ' "' + a.metadata.name + '" successfully. '
});
}); else {
var e;
e = k.isList ? "All items in list were created successfully." :v(k.resourceKind) + " " + k.resourceName + " was successfully created.", c.push({
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
function t() {
var b = {
started:"Updating resources in project " + k.projectName,
success:"Updated resources in project " + k.projectName,
failure:"Failed to update some resources in project " + k.projectName
}, c = {};
h.add(b, c, function() {
var b = a.defer();
return i.batch(k.updateResources, k.context, "update").then(function(a) {
var c = [], d = !1;
if (a.failure.length > 0) d = !0, k.errorOccured = !0, a.failure.forEach(function(a) {
c.push({
type:"error",
message:"Cannot update " + v(a.object.kind) + ' "' + a.object.metadata.name + '". ',
details:a.data.message
});
}), a.success.forEach(function(a) {
c.push({
type:"success",
message:"Updated " + v(a.kind) + ' "' + a.metadata.name + '" successfully. '
});
}); else {
var e;
e = k.isList ? "All items in list were updated successfully." :v(k.resourceKind) + " " + k.resourceName + " was successfully updated.", c.push({
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
var u, v = d("humanizeKind");
h.clear(), k.aceLoaded = function(a) {
u = a.getSession(), u.setOption("tabSize", 2), u.setOption("useSoftTabs", !0), a.setDragDelay = 0, a.$blockScrolling = 1 / 0;
};
var w = function() {
var a = u.getAnnotations();
k.editorErrorAnnotation = _.some(a, {
type:"error"
});
}, x = _.debounce(function() {
try {
JSON.parse(k.editorContent), u.setMode("ace/mode/json");
} catch (a) {
try {
jsyaml.safeLoad(k.editorContent), u.setMode("ace/mode/yaml");
} catch (a) {}
}
k.$apply(w);
}, 300);
k.aceChanged = x, k.create = function() {
delete k.alerts.create, delete k.error;
var b;
try {
b = JSON.parse(k.editorContent);
} catch (c) {
try {
b = jsyaml.safeLoad(k.editorContent);
} catch (c) {
return void (k.error = c);
}
}
if (l(b)) {
k.resourceKind = b.kind, k.resourceKind.endsWith("List") ? (k.isList = !0, k.resourceList = b.items, k.resourceName = "") :(k.resourceList = [ b ], k.resourceName = b.metadata.name, "Template" === k.resourceKind && (k.templateOptions = {
process:!0,
add:!1
})), k.updateResources = [], k.createResources = [];
var d = [];
k.errorOccured = !1, _.forEach(k.resourceList, function(a) {
return l(a) ? void d.push(q(a)) :(k.errorOccured = !0, !1);
}), k.errorOccured || a.all(d).then(function() {
1 === k.createResources.length && "Template" === k.resourceList[0].kind ? m() :_.isEmpty(k.updateResources) ? o() :n();
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
showValues:"=",
helpText:"@?",
dropZoneId:"@?",
dragging:"="
},
templateUrl:"views/directives/osc-file-input.html",
link:function(b, c) {
function d() {
var a = $(k);
a.on("dragover", function() {
a.addClass("highlight-drag-and-drop-zone"), l = !0;
}), $(k + " p").on("dragover", function() {
l = !0;
}), a.on("dragleave", function() {
l = !1, _.delay(function() {
l || a.removeClass("highlight-drag-and-drop-zone");
}, 200);
}), a.on("drop", function(a) {
var c = _.get(a, "originalEvent.dataTransfer.files", []);
return c.length > 0 && (b.file = _.head(c), f(b.file)), g(), $(".drag-and-drop-zone").trigger("putDropZoneFront", !1), $(".drag-and-drop-zone").trigger("reset"), !1;
}), a.on("putDropZoneFront", function(a, b) {
return b ? $(k).width(i.outerWidth()).height(i.outerHeight()).css("z-index", 100) :$(k).css("z-index", -1), !1;
}), a.on("reset", function() {
return m = !1, !1;
});
}
function e() {
i.before("<div id=" + j + ' class="drag-and-drop-zone"><p>Drop file here</p></div>'), c.css("z-index", 50);
}
function f(c) {
var d = new FileReader();
d.onloadend = function() {
b.$apply(function() {
b.fileName = c.name, b.model = d.result;
});
}, d.onerror = function(c) {
b.supportsFileUpload = !1, b.uploadError = !0, a.error("Could not read file", c);
}, d.readAsText(c);
}
function g() {
$(".drag-and-drop-zone").removeClass("show-drag-and-drop-zone highlight-drag-and-drop-zone");
}
function h() {
$(k).remove();
}
b.helpID = _.uniqueId("help-"), b.supportsFileUpload = window.File && window.FileReader && window.FileList && window.Blob, b.uploadError = !1;
var i = b.dropZoneId ? $("#" + b.dropZoneId) :c, j = b.dropZoneId + "-drag-and-drop-zone", k = "#" + j, l = !1, m = !1;
b.$watch("disabled", function() {
b.disabled ? h() :(e(), d());
}, !0), (_.isUndefined($._data($(document)[0], "events")) || _.isUndefined($._data($(document)[0], "events").drop)) && ($(document).on("drop.oscFileInput", function() {
return g(), $(".drag-and-drop-zone").trigger("putDropZoneFront", !1), !1;
}), $(document).on("dragenter.oscFileInput", function() {
return m = !0, $(".drag-and-drop-zone").addClass("show-drag-and-drop-zone"), $(".drag-and-drop-zone").trigger("putDropZoneFront", !0), !1;
}), $(document).on("dragover.oscFileInput", function() {
return m = !0, $(".drag-and-drop-zone").addClass("show-drag-and-drop-zone"), !1;
}), $(document).on("dragleave.oscFileInput", function() {
return m = !1, _.delay(function() {
m || $(".drag-and-drop-zone").removeClass("show-drag-and-drop-zone");
}, 200), !1;
})), c.change(function() {
f($("input[type=file]", this)[0].files[0]);
}), b.$on("$destroy", function() {
$(k).off(), $(document).off("drop.oscFileInput").off("dragenter.oscFileInput").off("dragover.oscFileInput").off("dragleave.oscFileInput");
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
}), angular.module("openshiftConsole").directive("oscRouting", function() {
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
controller:[ "$scope", function(a) {
a.disableCertificateInputs = function() {
var b = _.get(a, "route.tls.termination");
return !b || "passthrough" === b;
};
} ],
link:function(a, b, c, d) {
a.form = d;
var e = function(b) {
b && (a.unnamedServicePort = 1 === b.spec.ports.length && !b.spec.ports[0].name, b.spec.ports.length && !a.unnamedServicePort ? a.route.portOptions = _.map(b.spec.ports, function(a) {
return {
port:a.name,
label:a.port + " → " + a.targetPort + " (" + a.protocol + ")"
};
}) :a.route.portOptions = []);
};
a.services && !a.route.service && (a.route.service = _.find(a.services)), a.$watch("route.to.service", function(b, c) {
e(b), b === c && a.route.targetPort || (a.route.targetPort = _.get(a, "route.portOptions[0].port")), a.services && (a.alternateServiceOptions = _.reject(a.services, function(a) {
return b === a;
}));
}), a.$watch("route.alternateServices", function(b) {
a.duplicateServices = _(b).map("service").filter(function(a, b, c) {
return _.includes(c, a, b + 1);
}).value(), d.$setValidity("duplicateServices", !a.duplicateServices.length);
}, !0);
var f = function() {
return !!a.route.tls && ((!a.route.tls.termination || "passthrough" === a.route.tls.termination) && (a.route.tls.certificate || a.route.tls.key || a.route.tls.caCertificate || a.route.tls.destinationCACertificate));
};
a.$watch("route.tls.termination", function() {
_.get(a, "route.tls.termination") && (a.showSecureRouteOptions = !0), a.showCertificatesNotUsedWarning = f();
}), a.addAlternateService = function() {
a.route.alternateServices = a.route.alternateServices || [];
var b = _.find(a.services, function(b) {
return b !== a.route.to.service && !_.some(a.route.alternateServices, {
service:b
});
});
a.route.alternateServices.push({
service:b
});
};
}
};
}).directive("oscRoutingService", function() {
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
}), angular.module("openshiftConsole").directive("oscPersistentVolumeClaim", function() {
return {
restrict:"E",
scope:{
claim:"=model"
},
templateUrl:"views/directives/osc-persistent-volume-claim.html",
link:function(a) {
a.claim.unit = "Mi", a.units = [ {
value:"Mi",
label:"MiB"
}, {
value:"Gi",
label:"GiB"
}, {
value:"Ti",
label:"TiB"
}, {
value:"Pi",
label:"PiB"
} ];
}
};
}), angular.module("openshiftConsole").directive("oscUnique", function() {
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
}), angular.module("openshiftConsole").directive("oscAutoscaling", [ "HPAService", "LimitRangesService", function(a, b) {
return {
restrict:"E",
scope:{
autoscaling:"=model",
project:"=",
showNameInput:"=?",
nameReadOnly:"=?"
},
templateUrl:"views/directives/osc-autoscaling.html",
link:function(c) {
c.$watch("project", function() {
if (c.project) {
c.isRequestCalculated = b.isRequestCalculated("cpu", c.project);
var d = window.OPENSHIFT_CONSTANTS.DEFAULT_HPA_CPU_TARGET_PERCENT;
c.isRequestCalculated && (d = a.convertLimitPercentToRequest(d, c.project)), _.set(c, "autoscaling.defaultTargetCPU", d), c.defaultTargetCPUDisplayValue = window.OPENSHIFT_CONSTANTS.DEFAULT_HPA_CPU_TARGET_PERCENT;
var e = !1, f = function(b) {
return e ? void (e = !1) :(b && c.isRequestCalculated && (b = a.convertRequestPercentToLimit(b, c.project)), void _.set(c, "targetCPUInput.percent", b));
};
c.$watch("autoscaling.targetCPU", f);
var g = function(b) {
b && c.isRequestCalculated && (b = a.convertLimitPercentToRequest(b, c.project)), e = !0, _.set(c, "autoscaling.targetCPU", b);
};
c.$watch("targetCPUInput.percent", function(a, b) {
a !== b && g(a);
});
}
});
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
namespace:"="
},
templateUrl:"views/_volumes.html"
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
emptyMessage:"=?"
},
templateUrl:"views/directives/pods-table.html"
};
}), angular.module("openshiftConsole").directive("overviewDeployment", function() {
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
var d = function(a, b) {
return a.href === b || _.some(a.prefixes, function(a) {
return _.startsWith(b, a);
});
};
return {
restrict:"E",
templateUrl:"views/_sidebar.html",
controller:[ "$scope", function(e) {
var f = a.path().replace("/project/" + e.projectName, "");
e.activeSecondary, e.navItems = c.PROJECT_NAVIGATION, e.activePrimary = _.find(e.navItems, function(a) {
return d(a, f) ? (e.activeSecondary = null, !0) :_.some(a.secondaryNavSections, function(a) {
var b = _.find(a.items, function(a) {
return d(a, f);
});
return !!b && (e.activeSecondary = b, !0);
});
}), e.navURL = function(a) {
return a ? b("isAbsoluteURL")(a) ? a :"project/" + e.projectName + a :"";
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
}), angular.module("openshiftConsole").directive("toggle", function() {
return {
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
}).directive("podWarnings", [ "podWarningsFilter", function(a) {
return {
restrict:"E",
scope:{
pod:"="
},
link:function(b) {
var c, d = "", e = a(b.pod);
for (c = 0; c < e.length; c++) d && (d += "<br>"), d += e[c].message;
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
isDisabled:"=?"
},
templateUrl:"views/directives/_copy-to-clipboard.html",
controller:[ "$scope", function(a) {
a.id = _.uniqueId("clipboardJs");
} ],
link:function(b, c) {
if (a) return void (b.hidden = !0);
var d = $("a", c), e = new Clipboard(d.get(0));
e.on("success", function(a) {
$(a.trigger).attr("title", "Copied!").tooltip("fixTitle").tooltip("show").attr("title", "Copy to clipboard").tooltip("fixTitle"), a.clearSelection();
}), e.on("error", function(a) {
var b = /Mac/i.test(navigator.userAgent) ? "Press ⌘C to copy" :"Press Ctrl-C to copy";
$(a.trigger).attr("title", b).tooltip("fixTitle").tooltip("show").attr("title", "Copy to clipboard").tooltip("fixTitle");
}), c.on("$destroy", function() {
e.destroy();
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
a.tag ? a.icon = b("imageStreamTagAnnotation")(a.resource, "icon", a.tag) :a.icon = b("annotation")(a.resource, "icon"), a.isDataIcon = a.icon && 0 === a.icon.indexOf("data:"), a.isDataIcon || (a.tag ? a.icon = b("imageStreamTagIconClass")(a.resource, a.tag) :a.icon = b("iconClass")(a.resource, a.kind));
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
}), angular.module("openshiftConsole").directive("labels", [ "$location", "$timeout", "LabelFilter", function(a, b, c) {
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
} ]), angular.module("openshiftConsole").directive("catalogCategory", function() {
return {
restrict:"E",
scope:{
categoryLabel:"@",
builders:"=",
templates:"=",
project:"@",
itemLimit:"@",
filterTag:"="
},
templateUrl:"views/catalog/_catalog-category.html",
controller:[ "$scope", function(a) {
a.builderID = function(a) {
return a.imageStream.metadata.uid + ":" + a.imageStreamTag;
};
} ]
};
}).directive("catalogTemplate", function() {
return {
restrict:"E",
replace:!0,
scope:{
template:"=",
project:"@",
filterTag:"="
},
templateUrl:"views/catalog/_template.html"
};
}).directive("catalogImage", function() {
return {
restrict:"E",
replace:!0,
scope:{
image:"=",
imageStream:"=",
imageTag:"=",
version:"=",
project:"@",
filterTag:"=",
referencedBy:"=",
isBuilder:"=?"
},
templateUrl:"views/catalog/_image.html"
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
} ]), angular.module("openshiftConsole").directive("podMetrics", [ "$interval", "$parse", "$timeout", "$q", "$rootScope", "ChartsService", "ConversionService", "MetricsService", "usageValueFilter", function(a, b, c, d, e, f, g, h, i) {
return {
restrict:"E",
scope:{
pod:"=",
sparklineWidth:"=?",
sparklineHeight:"=?",
includedMetrics:"=?"
},
templateUrl:"views/directives/pod-metrics.html",
link:function(j) {
function k(a) {
if (!j.pod) return null;
var b = j.options.selectedContainer;
switch (a) {
case "memory/usage":
var c = w(b);
if (c) return g.bytesToMiB(i(c));
break;

case "cpu/usage":
var d = x(b);
if (d) return _.round(1e3 * i(d));
}
return null;
}
function l(a) {
var b, d = {}, e = _.some(a.datasets, function(a) {
return !a.data;
});
if (!e) {
a.totalUsed = 0;
var f = 0;
angular.forEach(a.datasets, function(e) {
var g = e.id, h = e.data;
b = [ "dates" ], d[g] = [ e.label || g ], e.total = k(g);
var i = _.last(h).value;
isNaN(i) && (i = 0), a.convert && (i = a.convert(i)), e.used = i, e.total && (e.available = e.total - e.used), a.totalUsed += e.used, angular.forEach(h, function(c) {
if (b.push(c.start), void 0 === c.value || null === c.value) d[g].push(c.value); else {
var e = a.convert ? a.convert(c.value) :c.value;
switch (g) {
case "memory/usage":
case "network/rx":
case "network/tx":
d[g].push(d3.round(e, 2));
break;

default:
d[g].push(d3.round(e));
}
f = Math.max(e, f);
}
}), e.used = _.round(e.used), e.total = _.round(e.total), e.available = _.round(e.available);
var j, l;
e.total && (l = {
type:"donut",
columns:[ [ "Used", e.used ], [ "Available", Math.max(e.available, 0) ] ],
colors:{
Used:e.available > 0 ? "#0088ce" :"#ec7a08",
Available:"#d1d1d1"
}
}, u[g] ? u[g].load(l) :(j = B(a), j.data = l, c(function() {
u[g] = c3.generate(j);
})));
}), a.totalUsed = _.round(a.totalUsed, 1);
var g, h = [ b ].concat(_.values(d));
f < a.smallestYAxisMax && (g = a.smallestYAxisMax);
var i, j = {
type:a.chartType || "spline",
x:"dates",
columns:h
}, l = a.chartPrefix + "sparkline";
v[l] ? (v[l].load(j), v[l].axis.max({
y:g
})) :(i = C(a), i.axis.y.max = g, i.data = j, a.chartDataColors && (i.color = {
pattern:a.chartDataColors
}), c(function() {
A || (v[l] = c3.generate(i));
}));
}
}
function m() {
return "-" + j.options.timeRange.value + "mn";
}
function n() {
return 60 * j.options.timeRange.value * 1e3;
}
function o() {
return Math.floor(n() / z) + "ms";
}
function p(a, b, c) {
var d, e = {
metric:b.id,
bucketDuration:o()
};
return b.data && b.data.length ? (d = _.last(b.data), e.start = d.end) :e.start = c, j.pod ? _.assign(e, {
namespace:j.pod.metadata.namespace,
pod:j.pod,
containerName:a.containerMetric ? j.options.selectedContainer.name :"pod",
stacked:!0
}) :null;
}
function q() {
return !j.metricsError && (j.pod && _.get(j, "options.selectedContainer"));
}
function r(a, b) {
j.noData = !1;
var c = _.initial(b.data);
return a.data ? void (a.data = _.chain(a.data).takeRight(z).concat(c).value()) :void (a.data = c);
}
function s() {
if (q()) {
var a = m();
angular.forEach(j.metrics, function(b) {
var c = [];
angular.forEach(b.datasets, function(d) {
var e = p(b, d, a);
e && c.push(h.get(e));
}), d.all(c).then(function(a) {
A || (angular.forEach(a, function(a) {
if (a) {
var c = _.find(b.datasets, {
id:a.metricID
});
r(c, a);
}
}), l(b));
}, function(a) {
A || angular.forEach(a, function(a) {
j.metricsError = {
status:_.get(a, "status", 0),
details:_.get(a, "data.errorMsg") || _.get(a, "statusText") || "Status code " + _.get(a, "status", 0)
};
});
})["finally"](function() {
j.loaded = !0;
});
});
}
}
j.includedMetrics = j.includedMetrics || [ "cpu", "memory", "network" ];
var t, u = {}, v = {}, w = b("resources.limits.memory"), x = b("resources.limits.cpu"), y = 6e4, z = 30, A = !1;
j.uniqueID = _.uniqueId("metrics-chart-"), j.metrics = [], _.includes(j.includedMetrics, "memory") && j.metrics.push({
label:"Memory",
units:"MiB",
chartPrefix:"memory-",
convert:g.bytesToMiB,
containerMetric:!0,
smallestYAxisMax:100,
datasets:[ {
id:"memory/usage",
label:"Memory",
data:[]
} ]
}), _.includes(j.includedMetrics, "cpu") && j.metrics.push({
label:"CPU",
units:"millicores",
chartPrefix:"cpu-",
convert:_.round,
containerMetric:!0,
smallestYAxisMax:10,
datasets:[ {
id:"cpu/usage_rate",
label:"CPU",
data:[]
} ]
}), _.includes(j.includedMetrics, "network") && j.metrics.push({
label:"Network",
units:"KiB/s",
chartPrefix:"network-",
chartType:"spline",
convert:g.bytesToKiB,
smallestYAxisMax:1,
datasets:[ {
id:"network/tx_rate",
label:"Sent",
data:[]
}, {
id:"network/rx_rate",
label:"Received",
data:[]
} ]
}), j.loaded = !1, j.noData = !0, h.getMetricsURL().then(function(a) {
j.metricsURL = a;
}), j.options = {
rangeOptions:[ {
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
} ]
}, j.options.timeRange = _.head(j.options.rangeOptions);
var B = function(a) {
var b = "#" + a.chartPrefix + j.uniqueID + "-donut";
return {
bindto:b,
onrendered:function() {
f.updateDonutCenterText(b, a.datasets[0].used, a.units);
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
}, C = function(a) {
return {
bindto:"#" + a.chartPrefix + j.uniqueID + "-sparkline",
axis:{
x:{
show:!0,
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
show:!0,
label:a.units,
min:0,
padding:{
left:0,
top:20,
bottom:0
},
tick:{
format:function(a) {
return d3.round(a, 3);
}
}
}
},
legend:{
show:a.datasets.length > 1
},
point:{
show:!1
},
size:{
height:j.sparklineHeight || 175,
width:j.sparklineWidth
},
tooltip:{
format:{
value:function(b) {
return d3.round(b, 2) + " " + a.units;
}
}
}
};
};
j.$watch("options", function() {
_.each(j.metrics, function(a) {
_.each(a.datasets, function(a) {
delete a.data;
});
}), delete j.metricsError, s();
}, !0), t = a(s, y, !1), e.$on("metrics.charts.resize", function() {
c(function() {
_.each(v, function(a) {
a.flush();
});
}, 0);
}), j.$on("$destroy", function() {
t && (a.cancel(t), t = null), angular.forEach(u, function(a) {
a.destroy();
}), u = null, angular.forEach(v, function(a) {
a.destroy();
}), v = null, A = !0;
});
}
};
} ]), angular.module("openshiftConsole").directive("deploymentMetrics", [ "$interval", "$parse", "$timeout", "$q", "$rootScope", "ChartsService", "ConversionService", "MetricsService", function(a, b, c, d, e, f, g, h) {
return {
restrict:"E",
scope:{
pods:"=",
containers:"=",
compact:"="
},
templateUrl:function(a, b) {
return b.compact ? "views/directives/metrics-compact.html" :"views/directives/deployment-metrics.html";
},
link:function(b) {
function d(a) {
return null === a.value || void 0 === a.value;
}
function f(a) {
var c;
c = b.compact ? a.compactDatasetLabel || a.label :"Average Usage";
var e = {}, f = [ "Date" ], g = [ c ], h = [ f, g ], i = function(a) {
var b = "" + a.start;
return e[b] || (e[b] = {
total:0,
count:0
}), e[b];
};
return _.each(z[a.descriptor], function(a) {
_.each(a, function(a) {
var b = i(a);
(!x || x < a.end) && (x = a.end), d(a) || (b.total += a.value, b.count = b.count + 1);
});
}), _.each(e, function(b, c) {
var d;
d = b.count ? b.total / b.count :null, f.push(Number(c)), g.push(a.convert ? a.convert(d) :d);
}), g.length > 1 && (a.lastValue = _.last(g) || 0), h;
}
function i(a, c) {
var e = [], g = {
type:"spline"
};
return b.showAverage ? (_.each(a[c.descriptor], function(a, b) {
p(c.descriptor, b, a);
}), g.type = "area-spline", b.compact && c.compactType && (g.type = c.compactType), g.x = "Date", g.columns = f(c), g) :(_.each(a[c.descriptor], function(a, b) {
p(c.descriptor, b, a);
var f = b + "-dates";
_.set(g, [ "xs", b ], f);
var h = [ f ], i = [ b ];
e.push(h), e.push(i), _.each(z[c.descriptor][b], function(a) {
if (h.push(a.start), (!x || x < a.end) && (x = a.end), d(a)) i.push(a.value); else {
var b = c.convert ? c.convert(a.value) :a.value;
i.push(b);
}
});
}), g.columns = _.sortBy(e, function(a) {
return a[0];
}), g);
}
function j(a) {
w || (b.loaded = !0, b.showAverage = _.size(b.pods) > 5 || b.compact, _.each(b.metrics, function(c) {
var d, e = i(a, c), f = c.descriptor;
b.compact && c.compactCombineWith && (f = c.compactCombineWith, c.lastValue && (B[f].lastValue = (B[f].lastValue || 0) + c.lastValue)), t[f] ? (t[f].load(e), b.showAverage ? t[f].legend.hide() :t[f].legend.show()) :(d = C(c), d.data = e, t[f] = c3.generate(d));
}));
}
function k() {
return b.compact ? "-15mn" :"-" + b.options.timeRange.value + "mn";
}
function l() {
return 60 * b.options.timeRange.value * 1e3;
}
function m() {
return b.compact ? "1mn" :Math.floor(l() / v) + "ms";
}
function n() {
var a = _.find(b.pods, "metadata.namespace");
if (a) {
var c = {
pods:b.pods,
containerName:b.options.selectedContainer.name,
namespace:a.metadata.namespace,
bucketDuration:m()
};
return x ? c.start = x :c.start = k(), c;
}
}
function o() {
var a = _.isEmpty(b.pods);
return a ? (b.loaded = !0, !1) :!b.metricsError;
}
function p(a, c, d) {
b.noData = !1;
var e = _.initial(d), f = _.get(z, [ a, c ]);
if (!f) return void _.set(z, [ a, c ], e);
var g = _.takeRight(f.concat(e), v);
_.set(z, [ a, c ], g);
}
function q(a) {
b.loaded = !0, b.metricsError = {
status:_.get(a, "status", 0),
details:_.get(a, "data.errorMsg") || _.get(a, "statusText") || "Status code " + _.get(a, "status", 0)
};
}
function r() {
if (!A && o()) {
y = Date.now();
var a = n();
h.getPodMetrics(a).then(j, q);
}
}
var s, t = {}, u = 6e4, v = 30, w = !1;
b.uniqueID = _.uniqueId("metrics-");
var x, y, z = {}, A = b.compact;
b.metrics = [ {
label:"Memory",
units:"MiB",
convert:g.bytesToMiB,
descriptor:"memory/usage",
type:"pod_container",
chartID:"memory-" + b.uniqueID
}, {
label:"CPU",
units:"millicores",
descriptor:"cpu/usage_rate",
type:"pod_container",
chartID:"cpu-" + b.uniqueID
}, {
label:"Network (Sent)",
units:"KiB/s",
convert:g.bytesToKiB,
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
descriptor:"network/rx_rate",
type:"pod",
compactCombineWith:"network/tx_rate",
compactDatasetLabel:"Received",
compactType:"spline",
chartID:"network-rx-" + b.uniqueID
} ];
var B = _.indexBy(b.metrics, "descriptor");
b.loaded = !1, b.noData = !0, h.getMetricsURL().then(function(a) {
b.metricsURL = a;
}), b.options = {
rangeOptions:[ {
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
} ]
}, b.options.timeRange = _.head(b.options.rangeOptions), b.options.selectedContainer = _.head(b.containers);
var C = function(a) {
return {
bindto:"#" + a.chartID,
axis:{
x:{
show:!b.compact,
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
show:!b.compact,
label:a.units,
min:0,
padding:{
left:0,
bottom:0,
top:20
},
tick:{
format:function(a) {
return d3.round(a, 3);
}
}
}
},
legend:{
show:!b.compact && !b.showAverage
},
point:{
show:!1
},
size:{
height:b.compact ? 35 :175
},
tooltip:{
format:{
value:function(b) {
return d3.round(b, 2) + " " + a.units;
}
}
}
};
};
b.formatUsage = d3.format(".2r"), b.$watch("options", function() {
z = {}, x = null, delete b.metricsError, r();
}, !0), s = a(r, u, !1), b.updateInView = function(a) {
A = !a, a && (!y || Date.now() > y + u) && r();
}, e.$on("metrics.charts.resize", function() {
c(function() {
_.each(t, function(a) {
a.flush();
});
}, 0);
}), b.$on("$destroy", function() {
s && (a.cancel(s), s = null), angular.forEach(t, function(a) {
a.destroy();
}), t = null, w = !0;
});
}
};
} ]), angular.module("openshiftConsole").directive("logViewer", [ "$sce", "$timeout", "$window", "AuthService", "APIDiscovery", "DataService", "logLinks", "BREAKPOINTS", function(a, b, c, d, e, f, g, h) {
var i = $(window), j = $('<tr class="log-line"><td class="log-line-number"></td><td class="log-line-text"></td></tr>').get(0), k = function(a, b) {
var c = j.cloneNode(!0);
c.firstChild.setAttribute("data-line-number", a);
var d = ansi_up.escape_for_html(b), e = ansi_up.ansi_to_html(d), f = ansi_up.linkify(e);
return c.lastChild.innerHTML = f, c;
};
return {
restrict:"AE",
transclude:!0,
templateUrl:"views/directives/logs/_log-viewer.html",
scope:{
followAffixTop:"=?",
followAffixBottom:"=?",
resource:"@",
fullLogUrl:"=?",
name:"=",
context:"=",
options:"=?",
fixedHeight:"=?",
chromeless:"=?",
empty:"=?",
run:"=?"
},
controller:[ "$scope", function(j) {
var l, m, n, o, p, q = document.documentElement;
j.logViewerID = _.uniqueId("log-viewer"), j.empty = !0;
var r = function() {
o = window.innerWidth < h.screenSmMin && !j.fixedHeight ? null :m;
}, s = function() {
j.$apply(function() {
var a = l.getBoundingClientRect();
j.fixedHeight ? j.showScrollLinks = a && a.height > j.fixedHeight :j.showScrollLinks = a && (a.top < 0 || a.bottom > q.clientHeight);
});
}, t = !1, u = function() {
t ? t = !1 :j.$evalAsync(function() {
j.autoScrollActive = !1;
});
}, v = function() {
n.off("scroll", u), i.off("scroll", u), window.innerWidth <= h.screenSmMin && !j.fixedHeight ? i.on("scroll", u) :n.on("scroll", u);
}, w = function() {
j.fixedHeight || (window.innerWidth < h.screenSmMin && !j.fixedHeight ? p.removeClass("target-logger-node").affix({
target:window,
offset:{
top:j.followAffixTop || 0,
bottom:j.followAffixBottom || 0
}
}) :p.addClass("target-logger-node").affix({
target:n,
offset:{
top:j.followAffixTop || 0,
bottom:j.followAffixBottom || 0
}
}));
}, x = function(a) {
var b = $("#" + j.logViewerID + " .log-view-output"), c = b.offset().top;
if (!(c < 0)) {
var d = j.fixedHeight ? j.fixedHeight :Math.floor($(window).height() - c);
j.chromeless || j.fixedHeight || (d -= 35), a ? b.animate({
"min-height":d + "px"
}, "fast") :b.css("min-height", d + "px"), j.fixedHeight && b.css("max-height", d);
}
}, y = _.debounce(function() {
x(!0), r(), v(), s(), w(), u();
}, 100);
i.on("resize", y);
var z, A = function() {
t = !0, g.scrollBottom(o);
}, B = function() {
j.autoScrollActive = !j.autoScrollActive, j.autoScrollActive && A();
}, C = document.createDocumentFragment(), D = _.debounce(function() {
l.appendChild(C), C = document.createDocumentFragment(), j.autoScrollActive && A(), j.showScrollLinks || s();
}, 100, {
maxWait:300
}), E = function(a) {
z && (z.stop(), z = null), a || (D.cancel(), l && (l.innerHTML = ""), C = document.createDocumentFragment());
}, F = function() {
if (E(), j.name && j.run) {
angular.extend(j, {
loading:!0,
autoScroll:!1,
limitReached:!1,
showScrollLinks:!1
});
var a = angular.extend({
follow:!0,
tailLines:5e3,
limitBytes:10485760
}, j.options);
z = f.createStream(j.resource, j.name, j.context, a);
var c = 0, d = function(a) {
c++, C.appendChild(k(c, a)), D();
};
z.onMessage(function(b, e, f) {
j.$evalAsync(function() {
j.empty = !1, "logs" !== j.state && (j.state = "logs", setTimeout(x));
}), b && (a.limitBytes && f >= a.limitBytes && (j.$evalAsync(function() {
j.limitReached = !0, j.loading = !1;
}), E(!0)), d(b), !j.largeLog && c >= a.tailLines && j.$evalAsync(function() {
j.largeLog = !0;
}));
}), z.onClose(function() {
z = null, j.$evalAsync(function() {
j.autoScrollActive = !1, 0 !== c || j.emptyStateMessage || (j.state = "empty", j.emptyStateMessage = "The logs are no longer available or could not be loaded.");
}), b(function() {
j.loading = !1;
}, 100);
}), z.onError(function() {
z = null, j.$evalAsync(function() {
angular.extend(j, {
loading:!1,
autoScroll:!1
}), 0 === c ? (j.state = "empty", j.emptyStateMessage = "The logs are no longer available or could not be loaded.") :j.errorWhileRunning = !0;
});
}), z.start();
}
};
return e.getLoggingURL().then(function(b) {
var e = _.get(j.context, "project.metadata.name"), f = _.get(j.options, "container");
e && f && j.name && b && (angular.extend(j, {
kibanaAuthUrl:a.trustAsResourceUrl(URI(b).segment("auth").segment("token").normalizePathname().toString()),
access_token:d.UserStore().getToken()
}), j.$watchGroup([ "context.project.metadata.name", "options.container", "name" ], function() {
angular.extend(j, {
kibanaArchiveUrl:a.trustAsResourceUrl(g.archiveUri({
namespace:j.context.project.metadata.name,
namespaceUid:j.context.project.metadata.uid,
podname:j.name,
containername:j.options.container,
backlink:URI.encode(c.location.href)
}))
});
}));
}), this.cacheScrollableNode = function(a) {
m = a, n = $(m);
}, this.cacheLogNode = function(a) {
l = a;
}, this.cacheAffixable = function(a) {
p = $(a);
}, this.start = function() {
r(), v(), w();
}, angular.extend(j, {
ready:!0,
loading:!0,
autoScroll:!1,
state:!1,
onScrollBottom:function() {
g.scrollBottom(o);
},
onScrollTop:function() {
j.autoScrollActive = !1, g.scrollTop(o);
},
toggleAutoScroll:B,
goChromeless:g.chromelessLink,
restartLogs:F
}), j.$on("$destroy", function() {
E(), i.off("resize", y), i.off("scroll", u), n.off("scroll", u);
}), "deploymentconfigs/log" !== j.resource || j.name ? void j.$watchGroup([ "name", "options.container", "run" ], F) :(j.state = "empty", void (j.emptyStateMessage = "Logs are not available for this replication controller because it was not generated from a deployment configuration."));
} ],
require:"logViewer",
link:function(a, c, d, e) {
b(function() {
e.cacheScrollableNode(document.getElementById(a.fixedHeight ? a.logViewerID + "-fixed-scrollable" :"container-main")), e.cacheLogNode(document.getElementById(a.logViewerID + "-logContent")), e.cacheAffixable(document.getElementById(a.logViewerID + "-affixedFollow")), e.start();
}, 0);
}
};
} ]), angular.module("openshiftConsole").directive("statusIcon", [ function() {
return {
restrict:"E",
templateUrl:"views/directives/_status-icon.html",
scope:{
status:"=",
disableAnimation:"@",
fixedWidth:"=?"
},
link:function(a, b, c) {
a.spinning = !angular.isDefined(c.disableAnimation);
}
};
} ]), angular.module("openshiftConsole").directive("ellipsisPulser", [ function() {
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
} ]), angular.module("openshiftConsole").directive("podDonut", [ "$timeout", "hashSizeFilter", "isPullingImageFilter", "isTerminatingFilter", "isTroubledPodFilter", "numContainersReadyFilter", "Logger", "ChartsService", function(a, b, c, d, e, f, g, h) {
return {
restrict:"E",
scope:{
pods:"=",
desired:"=?",
idled:"=?"
},
templateUrl:"views/directives/pod-donut.html",
link:function(a, g) {
function i() {
var c, d = b(a.pods);
c = angular.isNumber(a.desired) && a.desired !== d ? "scaling to " + a.desired + "..." :1 === d ? "pod" :"pods", a.idled ? h.updateDonutCenterText(g[0], "Idle") :h.updateDonutCenterText(g[0], d, c);
}
function j(c) {
var d = {
columns:[]
};
angular.forEach(p, function(a) {
d.columns.push([ a, c[a] || 0 ]);
}), 0 === b(c) ? d.columns.push([ "Empty", 1 ]) :d.unload = "Empty", n ? n.load(d) :(o.data.columns = d.columns, n = c3.generate(o)), a.podStatusData = d.columns;
}
function k(a) {
var b = f(a), c = a.spec.containers.length;
return b === c;
}
function l(a) {
return d(a) ? "Terminating" :e(a) ? "Warning" :c(a) ? "Pulling" :"Running" !== a.status.phase || k(a) ? _.get(a, "status.phase", "Unknown") :"Not Ready";
}
function m() {
var b = {};
return angular.forEach(a.pods, function(a) {
var c = l(a);
b[c] = (b[c] || 0) + 1;
}), b;
}
var n, o, p = [ "Running", "Not Ready", "Warning", "Failed", "Pulling", "Pending", "Succeeded", "Terminating", "Unknown" ];
a.chartId = _.uniqueId("pods-donut-chart-"), o = {
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
onrendered:i,
tooltip:{
format:{
value:function(a, b, c) {
if (a && "Empty" !== c) return a;
}
},
position:function() {
return {
top:0,
left:0
};
}
},
transition:{
duration:350
},
data:{
type:"donut",
groups:[ p ],
order:null,
colors:{
Empty:"#ffffff",
Running:"#00b9e4",
"Not Ready":"#beedf9",
Warning:"#f39d3c",
Failed:"#d9534f",
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
var q = _.debounce(j, 350, {
maxWait:500
});
a.$watch(m, q, !0), a.$watchGroup([ "desired", "idled" ], i), a.$on("destroy", function() {
n && (n = n.destroy());
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
a.route && (b.columns.push(e(a.route.spec.to)), a.totalWeight = a.route.spec.to.weight, _.each(a.route.spec.alternateBackends, function(c) {
b.columns.push(e(c)), a.totalWeight += c.weight;
})), a.totalWeight && (c ? c.load(b) :(d.data.columns = b.columns, c = c3.generate(d)));
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
var e = function(a) {
return [ a.name, a.weight ];
};
a.$watch("route", b), a.$on("destroy", function() {
c && (c = c.destroy());
});
}
};
}), angular.module("openshiftConsole").directive("deploymentDonut", [ "$filter", "$location", "$timeout", "$uibModal", "DeploymentsService", "HPAService", "LabelFilter", "Navigate", "hashSizeFilter", "hasDeploymentConfigFilter", function(a, b, c, d, e, f, g, h, i, j) {
return {
restrict:"E",
scope:{
rc:"=",
deploymentConfig:"=",
scalable:"=",
hpa:"=?",
limitRanges:"=",
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
var g = function() {
f.getHPAWarnings(b.rc, b.hpa, b.limitRanges, b.project).then(function(a) {
b.hpaWarnings = _.map(a, function(a) {
return _.escape(a.message);
}).join("<br>");
});
};
b.$watchGroup([ "limitRanges", "hpa", "project" ], g), b.$watch("rc.spec.template.spec.containers", g, !0);
var k = function(c) {
b.alerts = b.alerts || {}, b.desiredReplicas = null, b.alerts.scale = {
type:"error",
message:"An error occurred scaling the deployment.",
details:a("getErrorDetails")(c)
};
}, l = function() {
if (c = !1, angular.isNumber(b.desiredReplicas)) return e.scale(b.deploymentConfig || b.rc, b.desiredReplicas).then(_.noop, k);
}, m = _.debounce(l, 650);
b.viewPodsForDeployment = function(a) {
0 !== i(b.pods) && h.toPodsForDeployment(a);
}, b.scaleUp = function() {
b.scalable && (b.desiredReplicas = b.getDesiredReplicas(), b.desiredReplicas++, m(), c = !0);
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
return j(b.rc) ? "deployment" :"replication controller";
}
}
});
return void a.result.then(function() {
b.desiredReplicas = b.getDesiredReplicas() - 1, m(), c = !0;
});
}
b.desiredReplicas--, m();
}
}, b.getDesiredReplicas = function() {
return angular.isDefined(b.desiredReplicas) && null !== b.desiredReplicas ? b.desiredReplicas :b.rc && b.rc.spec && angular.isDefined(b.rc.spec.replicas) ? b.rc.spec.replicas :1;
}, b.$watch(function() {
return !_.get(b.rc, "spec.replicas") && !!(b.deploymentConfig ? a("annotation")(b.deploymentConfig, "idledAt") :a("annotation")(b.rc, "idledAt"));
}, function(a) {
b.isIdled = !!a;
}), b.unIdle = function() {
b.desiredReplicas = a("unidleTargetReplicas")(b.deploymentConfig || b.rc, b.hpa), l().then(function() {
b.isIdled = !1;
}, k);
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
b.id = _.uniqueId("compute-resource-");
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
b.placeholder = a, i(c), b.amount || (b.unit = c);
});
a && c(g(a, b.type));
}), b.type) {
case "cpu":
b.unit = "m", b.units = [ {
value:"m",
label:"millicores"
}, {
value:"",
label:"cores"
} ];
break;

case "memory":
b.unit = "Mi", b.units = [ {
value:"M",
label:"MB"
}, {
value:"G",
label:"GB"
}, {
value:"Mi",
label:"MiB"
}, {
value:"Gi",
label:"GiB"
} ];
}
var j = function() {
var a = b.amount && f(b.amount + b.unit), c = b.limitRangeMin && f(b.limitRangeMin), d = b.limitRangeMax && f(b.limitRangeMax), e = !0, g = !0;
a && c && (e = a >= c), a && d && (g = a <= d), b.form.amount.$setValidity("limitRangeMin", e), b.form.amount.$setValidity("limitRangeMax", g);
}, k = function() {
var a, c = b.request && f(b.request), d = !0, e = !0;
b.amount ? a = f(b.amount + b.unit) :b.defaultValue && (a = f(b.defaultValue)), c && a && (d = a >= c, b.maxLimitRequestRatio && (e = a / c <= b.maxLimitRequestRatio)), c && !a && b.maxLimitRequestRatio && (e = !1), b.form.amount.$setValidity("limitLargerThanRequest", d), b.form.amount.$setValidity("limitWithinRatio", e);
};
e.$render = function() {
var a = _.spread(function(a, c) {
a ? (b.amount = Number(a), b.unit = c, i(c)) :b.amount = null;
});
a(g(e.$viewValue, b.type));
}, b.$watchGroup([ "amount", "unit" ], function() {
j(), k(), b.amount ? e.$setViewValue(b.amount + b.unit) :e.$setViewValue(void 0);
}), b.$watchGroup([ "limitRangeMin", "limitRangeMax" ], j), b.$watch("request", k);
}
};
} ]).directive("editRequestLimit", [ "$filter", "LimitRangesService", function(a, b) {
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
a.$watch("limitRanges", function() {
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
a.id = _.uniqueId("edit-probe-"), a.probe = a.probe || {}, a.previousProbes = {}, a.tcpPorts = _.filter(a.exposedPorts, {
protocol:"TCP"
});
var b = function(b, c) {
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
a.probe.httpGet ? a.type = "httpGet" :a.probe.exec ? a.type = "exec" :a.probe.tcpSocket ? a.type = "tcpSocket" :(a.type = "httpGet", b("httpGet")), a.$watch("type", function(a, c) {
a !== c && b(a, c);
});
}
};
}), angular.module("openshiftConsole").directive("editCommand", [ "$filter", function(a) {
return {
restrict:"E",
scope:{
args:"=",
isRequired:"="
},
templateUrl:"views/directives/_edit-command.html",
link:function(b) {
b.id = _.uniqueId("edit-command-"), b.input = {};
var c, d = a("isMultiline");
b.$watch("args", function() {
return c ? void (c = !1) :void (_.isEmpty(b.args) || (b.input.args = _.map(b.args, function(a) {
return {
value:a,
multiline:d(a)
};
})));
}, !0), b.$watch("input.args", function(a, d) {
a !== d && (c = !0, b.args = _.map(b.input.args, function(a) {
return a.value;
}), b.form.command.$setDirty());
}, !0), b.addArg = function() {
b.nextArg && (b.input.args = b.input.args || [], b.input.args.push({
value:b.nextArg,
multiline:d(b.nextArg)
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
collapseStagesOnCompletion:"=?",
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
}), angular.module("openshiftConsole").directive("serviceGroupNotifications", [ "$filter", "Navigate", function(a, b) {
return {
restrict:"E",
scope:{
service:"=",
childServices:"=",
deploymentConfigsByService:"=",
deploymentsByService:"=",
podsByDeployment:"=",
collapsed:"="
},
templateUrl:"views/directives/service-group-notifications.html",
link:function(c) {
var d = function(a) {
var b = _.get(c, "service.metadata.namespace");
return "hide/alert/" + b + "/" + a;
}, e = function(a) {
var b = d(a);
return "true" === localStorage.getItem(b);
}, f = function(a) {
var b = d(a);
localStorage.setItem(b, "true");
}, g = a("hasHealthChecks"), h = c.alerts = {}, i = [], j = function() {
_.each(i, function(d) {
var i = _.get(d, "metadata.name", "");
c.deploymentConfigsByService && _.each(c.deploymentConfigsByService[i], function(c) {
var d = "health_checks_" + c.metadata.uid;
if (g(c.spec.template)) delete h[d]; else {
if (e(d)) return;
h[d] = {
type:"info",
message:c.metadata.name + " has containers without health checks, which ensure your application is running correctly.",
onClose:function() {
f(d);
}
}, a("canI")("deploymentconfigs", "update") && (h[d].links = [ {
href:b.healthCheckURL(c.metadata.namespace, "DeploymentConfig", c.metadata.name),
label:"Add health checks"
} ]);
}
});
});
}, k = function() {
var d = {};
_.each(h, function(a, b) {
b.indexOf("pod_warning") >= 0 && delete a[b];
}), _.each(i, function(b) {
var e = _.get(b, "metadata.name", "");
c.deploymentsByService && c.podsByDeployment && _.each(c.deploymentsByService[e], function(b) {
a("groupedPodWarnings")(c.podsByDeployment[b.metadata.name], d);
});
}), _.each(d, function(a, d) {
var g = _.head(a);
if (g) {
var i = "pod_warning" + d, j = {
type:"warning",
message:g.message
};
switch (g.reason) {
case "NonZeroExit":
var k = b.resourceURL(g.pod, "Pod", c.service.metadata.namespace), l = URI(k).addSearch({
tab:"logs",
container:g.container
}).toString();
j.links = [ {
href:l,
label:"View Log"
} ];
break;

case "NonZeroExitTerminatingPod":
if (e(i)) return;
j.links = [ {
href:"",
label:"Don't show me again",
onClick:function() {
return f(i), !0;
}
} ];
}
h[i] = j;
}
});
};
c.showAlert = function(a) {
return !c.collapsed || "info" !== a.type;
}, c.$watchGroup([ "service", "childServices" ], function() {
i = (c.childServices || []).concat([ c.service ]), j(), k();
}), c.$watch("deploymentConfigsByService", function() {
j();
}), c.$watchGroup([ "podsByDeployment", "deploymentsByService" ], function() {
k();
});
}
};
} ]), angular.module("openshiftConsole").directive("overviewService", [ "$filter", "DeploymentsService", "MetricsService", "Navigate", function(a, b, c, d) {
return {
restrict:"E",
scope:!0,
templateUrl:"views/overview/_service.html",
link:function(a) {
window.OPENSHIFT_CONSTANTS.DISABLE_OVERVIEW_METRICS || c.isAvailable(!0).then(function(b) {
a.showMetrics = b;
}), a.$watch("deploymentConfigsByService", function(a) {
}), a.$watch("visibleDeploymentsByConfigAndService", function(b) {
if (b) {
var c = _.get(a, "service.metadata.name");
a.activeDeploymentByConfig = {}, a.visibleDeploymentsByConfig = b[c], a.rcTileCount = 0, _.each(a.visibleDeploymentsByConfig, function(b, c) {
c ? a.rcTileCount++ :a.rcTileCount += _.size(b);
});
}
}), a.viewPodsForDeployment = function(b) {
_.isEmpty(a.podsByDeployment[b.metadata.name]) || d.toPodsForDeployment(b);
}, a.getHPA = function(b, c) {
var d = a.hpaByDC, e = a.hpaByRC;
return d && e ? c ? (d[c] = d[c] || [], d[c]) :(e[b] = e[b] || [], e[b]) :null;
}, a.isScalableDeployment = function(c) {
return b.isScalable(c, a.deploymentConfigs, a.hpaByDC, a.hpaByRC, a.scalableDeploymentByConfig);
};
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
message:function() {
return "Remove service '" + c.metadata.name + "' from group?";
},
details:function() {
return "Services '" + e.primaryService.metadata.name + "' and '" + c.metadata.name + "' will no longer be displayed together on the overview.";
},
okButtonText:function() {
return "Remove";
},
okButtonClass:function() {
return "btn-danger";
},
cancelButtonText:function() {
return "Cancel";
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
} ]), angular.module("openshiftConsole").directive("overviewReplicationController", function() {
return {
restrict:"E",
scope:!0,
templateUrl:"views/overview/_rc.html"
};
}), angular.module("openshiftConsole").directive("overviewDeploymentConfig", [ "$filter", "$uibModal", "DeploymentsService", function(a, b, c) {
return {
restrict:"E",
scope:!0,
templateUrl:"views/overview/_dc.html",
link:function(d) {
var e = a("orderObjectsByDate"), f = a("deploymentIsInProgress");
d.$watch("deploymentConfigs", function(a) {
d.deploymentConfig = _.get(a, d.dcName);
}), d.$watch("deployments", function(a) {
d.orderedDeployments = e(a, !0), d.activeDeployment = _.get(d, [ "scalableDeploymentByConfig", d.dcName ]), d.inProgressDeployment = _.find(d.orderedDeployments, f);
}), d.cancelDeployment = function() {
var a = d.inProgressDeployment;
if (a) {
var e = a.metadata.name, g = b.open({
animation:!0,
templateUrl:"views/modals/confirm.html",
controller:"ConfirmModalController",
resolve:{
message:function() {
return "Cancel deployment " + e + "?";
},
details:function() {
var a = _.get(d, "deploymentConfig.status.latestVersion");
return a ? "This will attempt to stop the in-progress deployment and rollback to the previous deployment, #" + a + ". It may take some time to complete." :"This will attempt to stop the in-progress deployment and may take some time to complete.";
},
okButtonText:function() {
return "Yes, cancel";
},
okButtonClass:function() {
return "btn-danger";
},
cancelButtonText:function() {
return "No, don't cancel";
}
}
});
g.result.then(function() {
var a = _.get(d, [ "deploymentsByName", e ]);
return a ? f(a) ? void c.cancelRunningDeployment(a, d.projectContext, d) :void (d.alerts["cancel-deployment"] = {
type:"error",
message:"Deployment " + e + " is no longer in progress."
}) :void (d.alerts["cancel-deployment"] = {
type:"error",
message:"Deployment " + e + " no longer exists."
});
});
}
};
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
var c = _.has(b, "istag.namespace") && _.has(b, "istag.imageStream") && _.has(b, "istag.tagObject.tag"), d = function(c) {
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
} ]), angular.module("openshiftConsole").directive("deployImage", [ "$filter", "$q", "$window", "ApplicationGenerator", "DataService", "ImagesService", "Navigate", "ProjectsService", "TaskList", "keyValueEditorUtils", function(a, b, c, d, e, f, g, h, i, j) {
return {
restrict:"E",
scope:{
project:"=",
context:"=",
alerts:"="
},
templateUrl:"views/directives/deploy-image.html",
link:function(c) {
function h() {
var a = j.mapEntries(j.compactEntries(c.labels)), b = j.mapEntries(j.compactEntries(c.systemLabels));
return f.getResources({
name:c.app.name,
image:c["import"].name,
namespace:c["import"].namespace,
tag:c["import"].tag || "latest",
ports:c.ports,
volumes:c.volumes,
env:j.mapEntries(j.compactEntries(c.env)),
labels:_.extend(b, a)
});
}
c.mode = "istag", c.istag = {}, c.app = {}, c.env = [], c.labels = [], c.systemLabels = [ {
name:"app",
value:""
} ];
var k = a("stripTag"), l = a("stripSHA"), m = a("humanizeKind"), n = function(a) {
return a.length > 24 ? a.substring(0, 24) :a;
}, o = function() {
var a = _.last(c["import"].name.split("/"));
return a = l(a), a = k(a), a = n(a);
};
c.findImage = function() {
c.loading = !0, f.findImage(c.imageName, c.context).then(function(a) {
if (c["import"] = a, c.loading = !1, "Success" !== _.get(a, "result.status")) return void (c["import"].error = _.get(a, "result.message", "An error occurred finding the image."));
var b = c["import"].image;
b && (c.app.name = o(), c.runsAsRoot = f.runsAsRoot(b), c.ports = d.parsePorts(b), c.volumes = f.getVolumes(b), c.createImageStream = !0);
}, function(b) {
c["import"].error = a("getErrorDetails")(b) || "An error occurred finding the image.", c.loading = !1;
});
}, c.$watch("app.name", function() {
_.set(_.find(c.systemLabels, {
name:"app"
}), "value", c.app.name);
}), c.$watch("mode", function(a, b) {
a !== b && (delete c["import"], c.istag = {});
}), c.$watch("istag", function(b, g) {
if (b !== g) {
if (!b.namespace || !b.imageStream || !b.tagObject) return void delete c["import"];
var h, i = _.get(b, "tagObject.items[0].image");
c.app.name = n(b.imageStream), c["import"] = {
name:b.imageStream,
tag:b.tagObject.tag,
namespace:b.namespace
}, i && (h = b.imageStream + "@" + i, c.loading = !0, e.get("imagestreamimages", h, {
namespace:b.namespace
}).then(function(a) {
c.loading = !1, c["import"].image = a.image, c.ports = d.parsePorts(a.image), c.volumes = f.getVolumes(a.image), c.runsAsRoot = !1;
}, function(b) {
c["import"].error = a("getErrorDetails")(b) || "An error occurred.", c.loading = !1;
}));
}
}, !0), c.create = function() {
var a = h(), d = {
started:"Deploying image " + c.app.name + " to project " + c.project + ".",
success:"Deployed image " + c.app.name + " to project " + c.project + ".",
failure:"Failed to deploy image " + c.app.name + " to project " + c.project + "."
};
i.clear(), i.add(d, {}, function() {
var d = b.defer();
return e.batch(a, c.context).then(function(a) {
var b, e = !_.isEmpty(a.failure);
e ? (b = _.map(a.failure, function(a) {
return {
type:"error",
message:"Cannot create " + m(a.object.kind).toLowerCase() + ' "' + a.object.metadata.name + '". ',
details:a.data.message
};
}), b = b.concat(_.map(a.success, function(a) {
return {
type:"success",
message:"Created " + m(a.kind).toLowerCase() + ' "' + a.metadata.name + '" successfully. '
};
}))) :b = [ {
type:"success",
message:"All resources for image " + c.app.name + " were created successfully."
} ], d.resolve({
alerts:b,
hasErrors:e
});
}), d.promise;
}), g.toNextSteps(c.app.name, c.project);
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
}), angular.module("openshiftConsole").filter("dateRelative", function() {
return function(a, b) {
return a ? moment(a).fromNow(b) :a;
};
}).filter("duration", function() {
return function(a, b, c, d) {
function e(a, b, d) {
if (0 !== a) return 1 === a ? void (c ? h.push(b) :h.push("one " + b)) :void h.push(a + " " + d);
}
if (!a) return a;
d = d || 2, b = b || new Date();
var f = moment(b).diff(a), g = moment.duration(f), h = [], i = g.years(), j = g.months(), k = g.days(), l = g.hours(), m = g.minutes(), n = g.seconds();
return e(i, "year", "years"), e(j, "month", "months"), e(k, "day", "days"), e(l, "hour", "hours"), e(m, "minute", "minutes"), e(n, "second", "seconds"), 1 === h.length && n && 1 === d ? c ? "minute" :"one minute" :(0 === h.length && h.push("0 seconds"), h.length > d && (h.length = d), h.join(", "));
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
}).filter("orderObjectsByDate", [ "toArrayFilter", function(a) {
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
return d || e || f ? (d && b.push(d + "h"), e && b.push(e + "m"), d || b.push(f + "s"), b.join(" ")) :"";
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
idledPreviousScale:[ "idling.alpha.openshift.io/previous-scale" ]
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
return a(b, "description");
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
var e = a(c), f = c.metadata.name;
return e !== f && b(d)[e] > 1 ? e + " (" + f + ")" :e;
};
} ]).filter("canI", [ "AuthorizationService", function(a) {
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
projects:[ {
group:"",
resource:"projects",
verbs:[ "delete", "update" ]
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
return !!a(b);
};
} ]).filter("routeWebURL", [ "routeHostFilter", function(a) {
return function(b, c) {
var d = b.spec.tls && "" !== b.spec.tls.tlsTerminationType ? "https" :"http", e = d + "://" + (c || a(b));
return b.spec.path && (e += b.spec.path), e;
};
} ]).filter("routeLabel", [ "routeHostFilter", "routeWebURLFilter", "isWebRouteFilter", function(a, b, c) {
return function(d, e) {
if (c(d)) return b(d, e);
var f = e || a(d);
return f ? (d.spec.path && (f += d.spec.path), f) :"<unknown host>";
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
return d.localeCompare(e);
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
reason:"NonZeroExitTerminatingPod",
pod:f.metadata.name,
container:a.name,
message:"The container " + a.name + " did not stop cleanly when terminated (exit code " + a.state.terminated.exitCode + ")."
}) :g.push({
reason:"NonZeroExit",
pod:f.metadata.name,
container:a.name,
message:"The container " + a.name + " failed (exit code " + a.state.terminated.exitCode + ")."
})), b(a) && g.push({
reason:"Looping",
pod:f.metadata.name,
container:a.name,
message:"The container " + a.name + " is crashing frequently. It must wait before it will be restarted again."
}), void (d(a) && g.push({
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
}).filter("createFromImageURL", function() {
return function(a, b, c) {
var d = URI.expand("project/{project}/create/fromimage{?q*}", {
project:c,
q:{
imageName:a.metadata.name,
imageTag:b,
namespace:a.metadata.namespace
}
});
return d.toString();
};
}).filter("createFromTemplateURL", function() {
return function(a, b) {
var c = URI.expand("project/{project}/create/fromtemplate{?q*}", {
project:b,
q:{
name:a.metadata.name,
namespace:a.metadata.namespace
}
});
return c.toString();
};
}).filter("failureObjectName", function() {
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
return function(a) {
if (!a) return a;
var b = {
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
services:"Services"
};
return b[a] || a;
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
}).filter("scopeDetails", function() {
var a = {
Terminating:"Matches pods that have an active deadline.",
NotTerminating:"Matches pods that do not have an active deadline.",
BestEffort:"Matches pods that have best effort quality of service.",
NotBestEffort:"Matches pods that do not have best effort quality of service."
};
return function(b) {
return a[b];
};
}).filter("isDebugPod", [ "annotationFilter", function(a) {
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
if (!b || !c) return null;
var d, e = a(b.command), f = a(b.args);
return e && f ? e + " " + f :e ? e :(d = a(_.get(c, "dockerImageMetadata.Config.Entrypoint") || [ "/bin/sh", "-c" ]), f ? d + " " + f :(e = a(_.get(c, "dockerImageMetadata.Config.Cmd")), e ? d + " " + e :null));
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
} ]), angular.module("openshiftConsole").filter("underscore", function() {
return function(a) {
return a.replace(/\./g, "_");
};
}).filter("defaultIfBlank", function() {
return function(a, b) {
return null === a ? b :("string" != typeof a && (a = String(a)), 0 === a.trim().length ? b :a);
};
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
return a.HELP[b] || a.HELP["default"];
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
} ]).filter("getErrorDetails", function() {
return function(a) {
var b = a.data || {};
if (b.message) return b.message;
var c = a.status || b.status;
return c ? "Status: " + c :"";
};
}).filter("humanize", function() {
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
return function(b, c, d) {
return a.resourceURL(b, c, d);
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
}), angular.module("openshiftConsole").filter("camelToLower", function() {
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
return function(a) {
return !!a && a.indexOf("\n") !== -1;
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
}, i = _.template([ "/#/discover?", "_g=(", "time:(", "from:now-1w,", "mode:relative,", "to:now", ")", ")", "&_a=(", "columns:!(kubernetes_container_name,message),", "index:'<%= namespace %>.<%= namespaceUid %>.*',", "query:(", "query_string:(", "analyze_wildcard:!t,", 'query:\'kubernetes_pod_name:"<%= podname %>" AND kubernetes_namespace_name:"<%= namespace %>"\'', ")", "),", "sort:!(time,desc)", ")", "#console_container_name=<%= containername %>", "&console_back_url=<%= backlink %>" ].join("")), j = function(a) {
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
var e = [ "<div row ", 'ng-show="item.url" ', 'class="icon-row" ', 'title="Connect to container">', "<div>", '<i class="fa fa-share" aria-hidden="true"></i>', "</div>", "<div flex>", '<a ng-click="item.onClick($event)" ', 'ng-href="item.url">', "Open Java Console", "</a>", "</div>", "</div>" ].join(""), f = function(a, b, d) {
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
node:'<li><a href="about">About</a></li>'
}, {
type:"dom",
node:'<li><a href="command-line">Command Line Tools</a></li>'
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
node:[ "<li>", '<a href="about">', '<span class="pficon pficon-info fa-fw" aria-hidden="true"></span> About', "</a>", "</li>" ].join("")
}, {
type:"dom",
node:[ "<li>", '<a href="command-line">', '<span class="fa fa-terminal" aria-hidden="true"></span> Command Line Tools', "</a>", "</li>" ].join("")
}, {
type:"dom",
node:_.template([ "<li>", '<a href="logout">', '<span class="pficon pficon-user fa-fw" aria-hidden="true"></span>', 'Log out <span class="username"><%= userName %></span>', "</a>", "</li>" ].join(""))({
userName:a ? a.fullName || a.metadata.name :""
})
} ];
}));
} ]);