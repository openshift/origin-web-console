"use strict";

function OverviewController(e, t, n, a, r, o, i, s, c, l, u, d, p, m, f, g, h, v, y, b, C, S, w, k, j) {
var P = this, R = t("isIE")() || t("isEdge")();
e.projectName = n.project, P.catalogLandingPageEnabled = !c.DISABLE_SERVICE_CATALOG_LANDING_PAGE;
var I, T, N = t("annotation"), E = t("buildConfigForBuild"), D = t("deploymentIsInProgress"), A = t("imageObjectRef"), B = t("isJenkinsPipelineStrategy"), L = t("isNewerResource"), U = t("label"), O = t("podTemplate"), F = {}, x = {}, M = {}, V = P.state = {
alerts: {},
builds: {},
clusterQuotas: {},
imageStreamImageRefByDockerReference: {},
imagesByDockerReference: {},
limitRanges: {},
limitWatches: R,
notificationsByObjectUID: {},
pipelinesByDeploymentConfig: {},
podsByOwnerUID: {},
quotas: {},
recentPipelinesByDeploymentConfig: {},
routesByService: {},
servicesByObjectUID: {},
serviceInstances: {},
bindingsByInstanceRef: {},
bindingsByApplicationUID: {},
applicationsByBinding: {},
showMetrics: !1
};
P.state.breakpoint = p.getBreakpoint();
var q = _.throttle(function() {
var t = p.getBreakpoint();
P.state.breakpoint !== t && e.$evalAsync(function() {
P.state.breakpoint = t;
});
}, 50);
$(window).on("resize.overview", q), P.showGetStarted = !1, P.showLoading = !0, P.filterByOptions = [ {
id: "name",
label: "Name"
}, {
id: "label",
label: "Label"
} ], P.filterBy = g.getLabelSelector().isEmpty() ? "name" : "label", P.viewByOptions = [ {
id: "app",
label: "Application"
}, {
id: "resource",
label: "Resource Type"
}, {
id: "pipeline",
label: "Pipeline"
} ];
var z = function(e) {
return _.get(e, "metadata.name");
}, H = function(e) {
return _.get(e, "metadata.uid");
}, G = function() {
return _.size(P.deploymentConfigs) + _.size(P.vanillaReplicationControllers) + _.size(P.deployments) + _.size(P.vanillaReplicaSets) + _.size(P.statefulSets) + _.size(P.monopods) + _.size(P.state.serviceInstances);
}, K = function() {
return _.size(P.filteredDeploymentConfigs) + _.size(P.filteredReplicationControllers) + _.size(P.filteredDeployments) + _.size(P.filteredReplicaSets) + _.size(P.filteredStatefulSets) + _.size(P.filteredMonopods) + _.size(P.filteredServiceInstances);
}, W = function() {
P.size = G(), P.filteredSize = K();
var e = 0 === P.size, t = P.deploymentConfigs && P.replicationControllers && P.deployments && P.replicaSets && P.statefulSets && P.pods && P.state.serviceInstances;
V.expandAll = t && 1 === P.size, P.showGetStarted = t && e, P.showLoading = !t && e, P.everythingFiltered = !e && !P.filteredSize, P.hidePipelineOtherResources = "pipeline" === P.viewBy && (P.filterActive || _.isEmpty(P.pipelineBuildConfigs));
}, Q = function(e) {
return o.groupByApp(e, "metadata.name");
}, J = function(e) {
var t = null;
return _.each(e, function(e) {
t = t ? j.getPreferredDisplayRoute(t, e) : e;
}), t;
}, Y = _.debounce(function() {
e.$evalAsync(function() {
if (P.bestRouteByApp = {}, P.routes) {
var e = [ P.filteredDeploymentConfigsByApp, P.filteredReplicationControllersByApp, P.filteredDeploymentsByApp, P.filteredReplicaSetsByApp, P.filteredStatefulSetsByApp, P.filteredMonopodsByApp ];
_.each(P.apps, function(t) {
var n = {};
_.each(e, function(e) {
var a = _.get(e, t, []);
_.each(a, function(e) {
var t = H(e), a = _.get(V, [ "servicesByObjectUID", t ], []);
_.each(a, function(e) {
var t = _.get(V, [ "routesByService", e.metadata.name ], []);
_.assign(n, _.keyBy(t, "metadata.name"));
});
});
}), P.bestRouteByApp[t] = J(n);
});
}
});
}, 300, {
maxWait: 1500
}), Z = function() {
P.filteredDeploymentConfigsByApp = Q(P.filteredDeploymentConfigs), P.filteredReplicationControllersByApp = Q(P.filteredReplicationControllers), P.filteredDeploymentsByApp = Q(P.filteredDeployments), P.filteredReplicaSetsByApp = Q(P.filteredReplicaSets), P.filteredStatefulSetsByApp = Q(P.filteredStatefulSets), P.filteredMonopodsByApp = Q(P.filteredMonopods), P.apps = _.union(_.keys(P.filteredDeploymentConfigsByApp), _.keys(P.filteredReplicationControllersByApp), _.keys(P.filteredDeploymentsByApp), _.keys(P.filteredReplicaSetsByApp), _.keys(P.filteredStatefulSetsByApp), _.keys(P.filteredMonopodsByApp)), o.sortAppNames(P.apps), Y();
}, X = function() {
var e = _.filter(P.deploymentConfigs, function(e) {
var t = z(e);
return _.isEmpty(V.pipelinesByDeploymentConfig[t]);
});
P.deploymentConfigsNoPipeline = _.sortBy(e, "metadata.name"), P.pipelineViewHasOtherResources = !(_.isEmpty(P.deploymentConfigsNoPipeline) && _.isEmpty(P.vanillaReplicationControllers) && _.isEmpty(P.deployments) && _.isEmpty(P.vanillaReplicaSets) && _.isEmpty(P.statefulSets) && _.isEmpty(P.monopods));
}, ee = function() {
P.disableFilter = "pipeline" === P.viewBy && _.isEmpty(P.pipelineBuildConfigs);
}, te = function(e) {
return g.getLabelSelector().select(e);
}, ne = [ "metadata.name", "spec.serviceClassName" ], ae = function(e) {
return f.filterForKeywords(e, ne, V.filterKeywords);
}, re = function(e) {
switch (P.filterBy) {
case "label":
return te(e);

case "name":
return ae(e);
}
return e;
}, oe = function() {
switch (P.filterBy) {
case "label":
return !g.getLabelSelector().isEmpty();

case "name":
return !_.isEmpty(V.filterKeywords);
}
}, ie = function() {
P.filteredDeploymentConfigs = re(P.deploymentConfigs), P.filteredReplicationControllers = re(P.vanillaReplicationControllers), P.filteredDeployments = re(P.deployments), P.filteredReplicaSets = re(P.vanillaReplicaSets), P.filteredStatefulSets = re(P.statefulSets), P.filteredMonopods = re(P.monopods), P.filteredPipelineBuildConfigs = re(P.pipelineBuildConfigs), P.filteredServiceInstances = re(V.orderedServiceInstances), P.filterActive = oe(), Z(), W();
}, se = n.project + "/overview/view-by";
P.viewBy = localStorage.getItem(se) || "app", e.$watch(function() {
return P.viewBy;
}, function(e) {
localStorage.setItem(se, e), ee(), ne = "app" === P.viewBy ? [ "metadata.name", "metadata.labels.app" ] : [ "metadata.name" ], ie(), "pipeline" === P.viewBy ? g.setLabelSuggestions(x) : g.setLabelSuggestions(F);
}), c.DISABLE_OVERVIEW_METRICS || (v.isAvailable(!0).then(function(e) {
V.showMetrics = e;
}), e.$on("metrics-connection-failed", function(e, t) {
a.isAlertPermanentlyHidden("metrics-connection-failed") || V.alerts["metrics-connection-failed"] || (V.alerts["metrics-connection-failed"] = {
type: "warning",
message: "An error occurred getting metrics.",
links: [ {
href: t.url,
label: "Open Metrics URL",
target: "_blank"
}, {
href: "",
label: "Don't Show Me Again",
onClick: function() {
return a.permanentlyHideAlert("metrics-connection-failed"), !0;
}
} ]
});
}));
var ce = function(e) {
return e && "Pod" === e.kind;
}, le = function(e) {
var t = H(e);
return t ? ce(e) ? [ e ] : _.get(P, [ "state", "podsByOwnerUID", t ], []) : [];
}, ue = function(e, t) {
var n = H(e);
V.notificationsByObjectUID[n] = t || {};
}, de = function(e) {
var t = H(e);
return t ? _.get(V, [ "notificationsByObjectUID", t ], {}) : {};
}, pe = function(e) {
if (H(e)) {
var t = le(e), a = k.getPodAlerts(t, n.project);
ue(e, a);
}
}, me = function(e) {
_.each(e, pe);
}, fe = function(e) {
var t = z(e);
return t ? M[t] : null;
}, ge = function(e) {
var t = z(e);
return t ? _.get(P, [ "replicationControllersByDeploymentConfig", t ]) : [];
};
P.getPreviousReplicationController = function(e) {
var t = ge(e);
return _.size(t) < 2 ? null : t[1];
};
var he = function(e) {
var t = {}, n = fe(e);
_.assign(t, k.getDeploymentStatusAlerts(e, n), k.getPausedDeploymentAlerts(e));
var a = ge(e);
_.each(a, function(e) {
var n = de(e);
_.assign(t, n);
}), ue(e, t);
}, ve = function() {
_.each(P.deploymentConfigs, he);
}, ye = function(e) {
var t = H(e);
return t ? _.get(P, [ "replicaSetsByDeploymentUID", t ]) : {};
}, be = function(e) {
var t = k.getPausedDeploymentAlerts(e), n = ye(e);
_.each(n, function(e) {
var n = de(e);
_.assign(t, n);
}), ue(e, t);
}, Ce = function() {
_.each(P.deployments, be);
}, Se = function() {
me(P.replicationControllers), me(P.replicaSets), me(P.statefulSets), me(P.monopods);
}, _e = _.debounce(function() {
e.$evalAsync(function() {
Se(), ve(), Ce();
});
}, 500), we = function(e) {
_.isEmpty(e) || (g.addLabelSuggestionsFromResources(e, F), "pipeline" !== P.viewBy && g.setLabelSuggestions(F));
}, ke = function(e) {
_.isEmpty(e) || (g.addLabelSuggestionsFromResources(e, x), "pipeline" === P.viewBy && g.setLabelSuggestions(x));
}, je = function(e) {
return "Succeeded" !== e.status.phase && "Failed" !== e.status.phase && (!U(e, "openshift.io/deployer-pod-for.name") && (!N(e, "openshift.io/build.name") && "slave" !== U(e, "jenkins")));
}, Pe = function() {
V.podsByOwnerUID = C.groupByOwnerUID(P.pods), P.monopods = _.filter(V.podsByOwnerUID[""], je);
}, Re = function(e) {
return !!_.get(e, "status.replicas") || (!N(e, "deploymentConfig") || D(e));
}, Ie = function(e) {
return N(e, "deploymentConfig");
}, Te = function() {
if (P.deploymentConfigs && P.replicationControllers) {
var e = [];
P.replicationControllersByDeploymentConfig = {}, P.currentByDeploymentConfig = {}, M = {};
var t = {}, n = {};
_.each(P.replicationControllers, function(a) {
var r = Ie(a) || "";
(!r || !P.deploymentConfigs[r] && _.get(a, "status.replicas")) && e.push(a);
var o = M[r];
o && !L(a, o) || (M[r] = a);
var i;
"Complete" === N(a, "deploymentStatus") && ((i = t[r]) && !L(a, i) || (t[r] = a)), Re(a) && _.set(n, [ r, a.metadata.name ], a);
}), _.each(t, function(e, t) {
_.set(n, [ t, e.metadata.name ], e);
}), _.each(n, function(e, t) {
var n = u.sortByDeploymentVersion(e, !0);
P.replicationControllersByDeploymentConfig[t] = n, P.currentByDeploymentConfig[t] = _.head(n);
}), P.vanillaReplicationControllers = _.sortBy(e, "metadata.name"), ve();
}
}, Ne = function(e, t) {
if (_.get(e, "status.replicas")) return !0;
var n = u.getRevision(e);
return !n || !!t && u.getRevision(t) === n;
}, Ee = function() {
P.replicaSets && I && (P.replicaSetsByDeploymentUID = b.groupByControllerUID(P.replicaSets), P.currentByDeploymentUID = {}, _.each(P.replicaSetsByDeploymentUID, function(e, t) {
if (t) {
var n = I[t], a = _.filter(e, function(e) {
return Ne(e, n);
}), r = u.sortByRevision(a);
P.replicaSetsByDeploymentUID[t] = r, P.currentByDeploymentUID[t] = _.head(r);
}
}), P.vanillaReplicaSets = _.sortBy(P.replicaSetsByDeploymentUID[""], "metadata.name"), Ce());
}, De = {}, Ae = function(e) {
e && V.allServices && _.each(e, function(e) {
var t = [], n = H(e), a = O(e);
_.each(De, function(e, n) {
e.matches(a) && t.push(V.allServices[n]);
}), V.servicesByObjectUID[n] = _.sortBy(t, "metadata.name");
});
}, $e = function() {
if (V.allServices) {
De = _.mapValues(V.allServices, function(e) {
return new LabelSelector(e.spec.selector);
});
var e = [ P.deploymentConfigs, P.vanillaReplicationControllers, P.deployments, P.vanillaReplicaSets, P.statefulSets, P.monopods ];
_.each(e, Ae), Y();
}
}, Be = function() {
var e = j.groupByService(P.routes, !0);
V.routesByService = _.mapValues(e, j.sortRoutesByScore), Y();
}, Le = function() {
V.hpaByResource = d.groupHPAs(P.horizontalPodAutoscalers);
}, Ue = function(e) {
var t = E(e), n = P.buildConfigs[t];
if (n) {
P.recentPipelinesByBuildConfig[t] = P.recentPipelinesByBuildConfig[t] || [], P.recentPipelinesByBuildConfig[t].push(e);
var a = i.usesDeploymentConfigs(n);
_.each(a, function(t) {
V.recentPipelinesByDeploymentConfig[t] = V.recentPipelinesByDeploymentConfig[t] || [], V.recentPipelinesByDeploymentConfig[t].push(e);
}), X();
}
}, Oe = {}, Fe = function() {
Oe = i.groupBuildConfigsByOutputImage(P.buildConfigs);
}, xe = function(e) {
var t = H(e);
if (t) return _.get(V, [ "buildConfigsByObjectUID", t ], []);
}, Me = function(e) {
var t = [], n = xe(e);
_.each(n, function(e) {
var n = _.get(V, [ "recentBuildsByBuildConfig", e.metadata.name ], []);
t = t.concat(n);
});
var a = z(e);
_.set(V, [ "recentBuildsByDeploymentConfig", a ], t);
}, Ve = function(e, t) {
var n = H(t);
n && _.set(V, [ "buildConfigsByObjectUID", n ], e);
}, qe = function() {
var e = [];
P.deploymentConfigsByPipeline = {}, V.pipelinesByDeploymentConfig = {}, _.each(P.buildConfigs, function(t) {
if (B(t)) {
e.push(t);
var n = i.usesDeploymentConfigs(t), a = z(t);
_.set(P, [ "deploymentConfigsByPipeline", a ], n), _.each(n, function(e) {
V.pipelinesByDeploymentConfig[e] = V.pipelinesByDeploymentConfig[e] || [], V.pipelinesByDeploymentConfig[e].push(t);
});
}
}), P.pipelineBuildConfigs = _.sortBy(e, "metadata.name"), X(), ke(P.pipelineBuildConfigs), ee();
}, ze = function() {
V.buildConfigsByObjectUID = {}, _.each(P.deploymentConfigs, function(e) {
var t = [], n = _.get(e, "spec.triggers");
_.each(n, function(n) {
var a = _.get(n, "imageChangeParams.from");
if (a) {
var r = A(a, e.metadata.namespace), o = Oe[r];
_.isEmpty(o) || (t = t.concat(o));
}
}), t = _.sortBy(t, "metadata.name"), Ve(t, e), Me(e);
});
}, He = function() {
qe(), ze();
}, Ge = function() {
_.each(P.deploymentConfigs, Me);
}, Ke = function() {
if (V.builds && P.buildConfigs) {
P.recentPipelinesByBuildConfig = {}, V.recentBuildsByBuildConfig = {}, V.recentPipelinesByDeploymentConfig = {};
var e = {};
_.each(i.interestingBuilds(V.builds), function(t) {
var n = E(t);
B(t) ? Ue(t) : (e[n] = e[n] || [], e[n].push(t));
}), P.recentPipelinesByBuildConfig = _.mapValues(P.recentPipelinesByBuildConfig, function(e) {
return i.sortBuilds(e, !0);
}), V.recentPipelinesByDeploymentConfig = _.mapValues(V.recentPipelinesByDeploymentConfig, function(e) {
return i.sortBuilds(e, !0);
}), V.recentBuildsByBuildConfig = _.mapValues(e, function(e) {
return i.sortBuilds(e, !0);
}), Ge();
}
}, We = function() {
k.setQuotaNotifications(V.quotas, V.clusterQuotas, n.project);
};
P.clearFilter = function() {
g.clear(), P.filterText = "";
}, e.$watch(function() {
return P.filterText;
}, _.debounce(function(t, n) {
t !== n && (V.filterKeywords = f.generateKeywords(t), e.$evalAsync(ie));
}, 50, {
maxWait: 250
})), e.$watch(function() {
return P.filterBy;
}, function(e, t) {
e !== t && (P.clearFilter(), ie());
}), g.onActiveFiltersChanged(function() {
e.$evalAsync(ie);
}), P.startBuild = i.startBuild;
var Qe = function() {
if (V.bindingsByApplicationUID = {}, V.applicationsByBinding = {}, V.deleteableBindingsByApplicationUID = {}, !_.isEmpty(V.bindings)) {
var e = [ P.deployments, P.deploymentConfigs, P.vanillaReplicationControllers, P.vanillaReplicaSets, P.statefulSets ];
if (!_.some(e, function(e) {
return !e;
})) {
var t = w.getPodPresetSelectorsForBindings(V.bindings);
_.each(e, function(e) {
_.each(e, function(e) {
var n = H(e), a = new LabelSelector(_.get(e, "spec.selector"));
V.bindingsByApplicationUID[n] = [], V.deleteableBindingsByApplicationUID[n] = [], _.each(t, function(t, r) {
t.covers(a) && (V.bindingsByApplicationUID[n].push(V.bindings[r]), _.get(V.bindings[r], "metadata.deletionTimestamp") || V.deleteableBindingsByApplicationUID[n].push(V.bindings[r]), V.applicationsByBinding[r] = V.applicationsByBinding[r] || [], V.applicationsByBinding[r].push(e));
});
});
}), P.bindingsByInstanceRef = _.reduce(P.bindingsByInstanceRef, function(e, t, n) {
return e[n] = _.sortBy(t, function(e) {
var t = _.get(V.applicationsByBinding, [ e.metadata.name ]);
return _.get(_.head(t), [ "metadata", "name" ]) || e.metadata.name;
}), e;
}, {});
}
}
}, Je = function() {
V.bindableServiceInstances = w.filterBindableServiceInstances(V.serviceInstances, V.serviceClasses), V.orderedServiceInstances = w.sortServiceInstances(V.serviceInstances, V.serviceClasses);
}, Ye = [];
S.get(n.project).then(_.spread(function(n, a) {
V.project = e.project = n, V.context = a;
var r = function() {
P.pods && m.fetchReferencedImageStreamImages(P.pods, V.imagesByDockerReference, V.imageStreamImageRefByDockerReference, a);
};
Ye.push(l.watch("pods", a, function(e) {
P.pods = e.by("metadata.name"), Pe(), r(), _e(), Ae(P.monopods), me(P.monopods), we(P.monopods), ie(), h.log("pods (subscribe)", P.pods);
})), Ye.push(l.watch("replicationcontrollers", a, function(e) {
P.replicationControllers = e.by("metadata.name"), Te(), Ae(P.vanillaReplicationControllers), Ae(P.monopods), me(P.vanillaReplicationControllers), we(P.vanillaReplicationControllers), Qe(), ie(), h.log("replicationcontrollers (subscribe)", P.replicationControllers);
})), Ye.push(l.watch("deploymentconfigs", a, function(e) {
P.deploymentConfigs = e.by("metadata.name"), Te(), Ae(P.deploymentConfigs), Ae(P.vanillaReplicationControllers), we(P.deploymentConfigs), Ce(), He(), Ge(), Qe(), ie(), h.log("deploymentconfigs (subscribe)", P.deploymentConfigs);
})), Ye.push(l.watch({
group: "extensions",
resource: "replicasets"
}, a, function(e) {
P.replicaSets = e.by("metadata.name"), Ee(), Ae(P.vanillaReplicaSets), Ae(P.monopods), me(P.vanillaReplicaSets), we(P.vanillaReplicaSets), Qe(), ie(), h.log("replicasets (subscribe)", P.replicaSets);
})), Ye.push(l.watch({
group: "apps",
resource: "deployments"
}, a, function(e) {
I = e.by("metadata.uid"), P.deployments = _.sortBy(I, "metadata.name"), Ee(), Ae(P.deployments), Ae(P.vanillaReplicaSets), we(P.deployments), Qe(), ie(), h.log("deployments (subscribe)", P.deploymentsByUID);
})), Ye.push(l.watch("builds", a, function(e) {
V.builds = e.by("metadata.name"), Ke(), h.log("builds (subscribe)", V.builds);
})), Ye.push(l.watch({
group: "apps",
resource: "statefulsets"
}, a, function(e) {
P.statefulSets = e.by("metadata.name"), Ae(P.statefulSets), Ae(P.monopods), me(P.statefulSets), we(P.statefulSets), Qe(), ie(), h.log("statefulsets (subscribe)", P.statefulSets);
}, {
poll: R,
pollInterval: 6e4
})), Ye.push(l.watch("services", a, function(e) {
V.allServices = e.by("metadata.name"), $e(), h.log("services (subscribe)", V.allServices);
}, {
poll: R,
pollInterval: 6e4
})), Ye.push(l.watch("routes", a, function(e) {
P.routes = e.by("metadata.name"), Be(), h.log("routes (subscribe)", P.routes);
}, {
poll: R,
pollInterval: 6e4
})), Ye.push(l.watch("buildConfigs", a, function(e) {
P.buildConfigs = e.by("metadata.name"), Fe(), He(), Ke(), ie(), h.log("buildconfigs (subscribe)", P.buildConfigs);
}, {
poll: R,
pollInterval: 6e4
})), Ye.push(l.watch({
group: "autoscaling",
resource: "horizontalpodautoscalers",
version: "v1"
}, a, function(e) {
P.horizontalPodAutoscalers = e.by("metadata.name"), Le(), h.log("autoscalers (subscribe)", P.horizontalPodAutoscalers);
}, {
poll: R,
pollInterval: 6e4
})), Ye.push(l.watch("imagestreams", a, function(e) {
T = e.by("metadata.name"), m.buildDockerRefMapForImageStreams(T, V.imageStreamImageRefByDockerReference), r(), h.log("imagestreams (subscribe)", T);
}, {
poll: R,
pollInterval: 6e4
})), Ye.push(l.watch("resourcequotas", a, function(e) {
V.quotas = e.by("metadata.name"), We();
}, {
poll: !0,
pollInterval: 6e4
})), Ye.push(l.watch("appliedclusterresourcequotas", a, function(e) {
V.clusterQuotas = e.by("metadata.name"), We();
}, {
poll: !0,
pollInterval: 6e4
}));
var o = t("canI");
s.SERVICE_CATALOG_ENABLED && o({
resource: "serviceinstances",
group: "servicecatalog.k8s.io"
}, "watch") && Ye.push(l.watch({
group: "servicecatalog.k8s.io",
resource: "serviceinstances"
}, a, function(e) {
V.serviceInstances = e.by("metadata.name"), _.each(V.serviceInstances, function(e) {
var t = k.getServiceInstanceAlerts(e);
ue(e, t);
}), Je(), we(V.serviceInstances), ie();
}, {
poll: R,
pollInterval: 6e4
})), s.SERVICE_CATALOG_ENABLED && o({
resource: "serviceinstancecredentials",
group: "servicecatalog.k8s.io"
}, "watch") && Ye.push(l.watch({
group: "servicecatalog.k8s.io",
resource: "serviceinstancecredentials"
}, a, function(e) {
V.bindings = e.by("metadata.name"), P.bindingsByInstanceRef = _.groupBy(V.bindings, "spec.instanceRef.name"), Qe();
}, {
poll: R,
pollInterval: 6e4
})), l.list("limitranges", a, function(e) {
V.limitRanges = e.by("metadata.name");
}), s.SERVICE_CATALOG_ENABLED && o({
resource: "serviceinstances",
group: "servicecatalog.k8s.io"
}, "watch") && l.list({
group: "servicecatalog.k8s.io",
resource: "serviceclasses"
}, {}, function(e) {
V.serviceClasses = e.by("metadata.name"), Je(), ie();
});
var i = c.SAMPLE_PIPELINE_TEMPLATE;
i && l.get("templates", i.name, {
namespace: i.namespace
}, {
errorNotification: !1
}).then(function(t) {
P.samplePipelineURL = y.createFromTemplateURL(t, e.projectName);
}), e.$on("$destroy", function() {
l.unwatchAll(Ye), $(window).off(".overview");
});
}));
}

function ResourceServiceBindings(e, t, n, a) {
var r = this, o = e("enableTechPreviewFeature");
r.bindings = [], r.bindableServiceInstances = [], r.serviceClasses = [], r.serviceInstances = [], r.showBindings = a.SERVICE_CATALOG_ENABLED && ("ServiceInstance" === _.get(r, "apiObject.kind") || o("pod_presets"));
var i = e("isIE")() || e("isEdge")(), s = [], c = e("canI"), l = function() {
r.apiObject && r.bindings && (r.bindings = n.getBindingsForResource(r.bindings, r.apiObject));
}, u = function() {
r.bindableServiceInstances = n.filterBindableServiceInstances(r.serviceInstances, r.serviceClasses), r.orderedServiceInstances = n.sortServiceInstances(r.serviceInstances, r.serviceClasses);
};
r.createBinding = function() {
r.overlayPanelVisible = !0, r.overlayPanelName = "bindService";
}, r.closeOverlayPanel = function() {
r.overlayPanelVisible = !1;
};
var d = function() {
t.unwatchAll(s), s = [], a.SERVICE_CATALOG_ENABLED && c({
resource: "serviceinstancecredentials",
group: "servicecatalog.k8s.io"
}, "watch") && s.push(t.watch({
group: "servicecatalog.k8s.io",
resource: "serviceinstancecredentials"
}, r.projectContext, function(e) {
r.bindings = e.by("metadata.name"), l();
}, {
poll: i,
pollInterval: 6e4
})), a.SERVICE_CATALOG_ENABLED && c({
resource: "serviceinstances",
group: "servicecatalog.k8s.io"
}, "watch") && (s.push(t.watch({
group: "servicecatalog.k8s.io",
resource: "serviceinstances"
}, r.projectContext, function(e) {
r.serviceInstances = e.by("metadata.name"), u();
}, {
poll: i,
pollInterval: 6e4
})), t.list({
group: "servicecatalog.k8s.io",
resource: "serviceclasses"
}, {}, function(e) {
r.serviceClasses = e.by("metadata.name"), u();
}));
};
r.$onChanges = function(e) {
e.projectContext && r.showBindings && d();
}, r.$onDestroy = function() {
t.unwatchAll(s);
};
}

angular.isUndefined(window.OPENSHIFT_CONSTANTS) && (window.OPENSHIFT_CONSTANTS = {}), angular.extend(window.OPENSHIFT_CONSTANTS, {
HELP_BASE_URL: "https://docs.openshift.org/latest/",
HELP: {
cli: "cli_reference/index.html",
get_started_cli: "cli_reference/get_started_cli.html",
basic_cli_operations: "cli_reference/basic_cli_operations.html",
"build-triggers": "dev_guide/builds/triggering_builds.html",
webhooks: "dev_guide/builds/triggering_builds.html#webhook-triggers",
new_app: "dev_guide/application_lifecycle/new_app.html",
"start-build": "dev_guide/builds/basic_build_operations.html#starting-a-build",
"deployment-operations": "cli_reference/basic_cli_operations.html#build-and-deployment-cli-operations",
"route-types": "architecture/core_concepts/routes.html#route-types",
persistent_volumes: "dev_guide/persistent_volumes.html",
compute_resources: "dev_guide/compute_resources.html",
pod_autoscaling: "dev_guide/pod_autoscaling.html",
application_health: "dev_guide/application_health.html",
source_secrets: "dev_guide/builds/build_inputs.html#using-secrets-during-build",
git_secret: "dev_guide/builds/build_inputs.html#source-clone-secrets",
pull_secret: "dev_guide/managing_images.html#using-image-pull-secrets",
managing_secrets: "dev_guide/service_accounts.html#managing-allowed-secrets",
creating_secrets: "dev_guide/secrets.html#creating-secrets",
storage_classes: "install_config/persistent_storage/dynamically_provisioning_pvs.html",
selector_label: "install_config/persistent_storage/selector_label_binding.html",
rolling_strategy: "dev_guide/deployments/deployment_strategies.html#rolling-strategy",
recreate_strategy: "dev_guide/deployments/deployment_strategies.html#recreate-strategy",
custom_strategy: "dev_guide/deployments/deployment_strategies.html#custom-strategy",
lifecycle_hooks: "dev_guide/deployments/deployment_strategies.html#lifecycle-hooks",
new_pod_exec: "dev_guide/deployments/deployment_strategies.html#pod-based-lifecycle-hook",
authorization: "architecture/additional_concepts/authorization.html",
roles: "architecture/additional_concepts/authorization.html#roles",
service_accounts: "dev_guide/service_accounts.html",
users_and_groups: "architecture/additional_concepts/authentication.html#users-and-groups",
"pipeline-builds": "architecture/core_concepts/builds_and_image_streams.html#pipeline-build",
"pipeline-plugin": "using_images/other_images/jenkins.html#openshift-origin-pipeline-plug-in",
quota: "dev_guide/compute_resources.html",
"config-maps": "dev_guide/configmaps.html",
secrets: "dev_guide/secrets.html",
deployments: "dev_guide/deployments/how_deployments_work.html",
pods: "architecture/core_concepts/pods_and_services.html#pods",
services: "architecture/core_concepts/pods_and_services.html#services",
routes: "architecture/core_concepts/routes.html",
builds: "architecture/core_concepts/builds_and_image_streams.html#builds",
"image-streams": "architecture/core_concepts/builds_and_image_streams.html#image-streams",
storage: "architecture/additional_concepts/storage.html",
"build-hooks": "dev_guide/builds/build_hooks.html",
default: "welcome/index.html"
},
CLI: {
"Latest Release": "https://github.com/openshift/origin/releases/latest"
},
DEFAULT_HPA_CPU_TARGET_PERCENT: 80,
DISABLE_OVERVIEW_METRICS: !1,
DISABLE_CUSTOM_METRICS: !1,
DISABLE_WILDCARD_ROUTES: !0,
DISABLE_CONFIRM_ON_EXIT: !1,
DISABLE_SERVICE_CATALOG_LANDING_PAGE: !1,
AVAILABLE_KINDS_BLACKLIST: [],
DISABLE_GLOBAL_EVENT_WATCH: !1,
DISABLE_COPY_LOGIN_COMMAND: !1,
ENABLE_TECH_PREVIEW_FEATURE: {
template_service_broker: !1,
pod_presets: !1
},
SAMPLE_PIPELINE_TEMPLATE: {
name: "jenkins-pipeline-example",
namespace: "openshift"
},
CREATE_FROM_URL_WHITELIST: [ "openshift" ],
SECURITY_CHECK_WHITELIST: [ {
resource: "buildconfigs",
group: ""
}, {
resource: "buildconfigs",
group: "build.openshift.io"
}, {
resource: "builds",
group: ""
}, {
resource: "builds",
group: "build.openshift.io"
}, {
resource: "configmaps",
group: ""
}, {
resource: "daemonsets",
group: "extensions"
}, {
resource: "deployments",
group: "apps"
}, {
resource: "deployments",
group: "extensions"
}, {
resource: "deploymentconfigs",
group: ""
}, {
resource: "deploymentconfigs",
group: "apps.openshift.io"
}, {
resource: "endpoints",
group: ""
}, {
resource: "events",
group: ""
}, {
resource: "horizontalpodautoscalers",
group: "autoscaling"
}, {
resource: "horizontalpodautoscalers",
group: "extensions"
}, {
resource: "imagestreamimages",
group: ""
}, {
resource: "imagestreamimages",
group: "image.openshift.io"
}, {
resource: "imagestreams",
group: ""
}, {
resource: "imagestreams",
group: "image.openshift.io"
}, {
resource: "imagestreamtags",
group: ""
}, {
resource: "imagestreamtags",
group: "image.openshift.io"
}, {
resource: "ingresses",
group: "extensions"
}, {
resource: "jobs",
group: "batch"
}, {
resource: "persistentvolumeclaims",
group: ""
}, {
resource: "pods",
group: ""
}, {
resource: "podtemplates",
group: ""
}, {
resource: "replicasets",
group: "extensions"
}, {
resource: "replicationcontrollers",
group: ""
}, {
resource: "routes",
group: ""
}, {
resource: "routes",
group: "route.openshift.io"
}, {
resource: "secrets",
group: ""
}, {
resource: "serviceaccounts",
group: ""
}, {
resource: "services",
group: ""
}, {
resource: "statefulsets",
group: "apps"
} ],
EVENTS_TO_SHOW: {
FailedCreate: !0,
FailedDelete: !0,
FailedScheduling: !0,
FailedUpdate: !0,
BuildCancelled: !0,
BuildCompleted: !0,
BuildFailed: !0,
BuildStarted: !0,
BuildConfigInstantiateFailed: !0,
DeploymentCancelled: !0,
Failed: !0,
DeploymentCreated: !0,
DeploymentCreationFailed: !0,
FailedRescale: !0,
SuccessfulRescale: !0,
BackOff: !0,
FailedSync: !0,
InvalidEnvironmentVariableNames: !0,
Unhealthy: !0,
FailedBinding: !0,
ProvisioningFailed: !0,
VolumeDeleted: !0,
LoadBalancerUpdateFailed: !0,
Deprovisioning: !0,
ErrorCallingProvision: !0,
ErrorInjectingBindResult: !0,
Provisioning: !0,
ReferencesNonexistentServiceClass: !0,
ReferencesNonexistentServicePlan: !0,
UnbindCallFailed: !0
},
PROJECT_NAVIGATION: [ {
label: "Overview",
iconClass: "fa fa-dashboard",
href: "/overview"
}, {
label: "Applications",
iconClass: "fa fa-cubes",
secondaryNavSections: [ {
items: [ {
label: "Deployments",
href: "/browse/deployments",
prefixes: [ "/add-config-volume", "/attach-pvc", "/browse/deployment/", "/browse/dc/", "/browse/rs/", "/browse/rc/", "/edit/autoscaler", "/edit/dc/", "/edit/health-checks", "/set-limits" ]
}, {
label: "Stateful Sets",
href: "/browse/stateful-sets",
prefixes: [ "/browse/stateful-sets/" ]
}, {
label: "Pods",
href: "/browse/pods",
prefixes: [ "/browse/pods/" ]
}, {
label: "Services",
href: "/browse/services",
prefixes: [ "/browse/services/" ]
}, {
label: "Routes",
href: "/browse/routes",
prefixes: [ "/browse/routes/", "/create-route", "/edit/routes/" ]
}, {
label: "Provisioned Services",
href: "/browse/service-instances",
prefixes: [ "/browse/service-instances/" ],
canI: {
resource: "serviceinstances",
group: "servicecatalog.k8s.io",
verb: "list"
}
} ]
} ]
}, {
label: "Builds",
iconClass: "pficon pficon-build",
secondaryNavSections: [ {
items: [ {
label: "Builds",
href: "/browse/builds",
prefixes: [ "/browse/builds/", "/browse/builds-noconfig/", "/edit/builds/" ]
}, {
label: "Pipelines",
href: "/browse/pipelines",
prefixes: [ "/browse/pipelines/", "/edit/pipelines/" ]
}, {
label: "Images",
href: "/browse/images",
prefixes: [ "/browse/images/" ]
} ]
} ]
}, {
label: "Resources",
iconClass: "fa fa-files-o",
secondaryNavSections: [ {
items: [ {
label: "Quota",
href: "/quota"
}, {
label: "Membership",
href: "/membership",
canI: {
resource: "rolebindings",
verb: "list"
}
}, {
label: "Config Maps",
href: "/browse/config-maps",
prefixes: [ "/browse/config-maps/", "/create-config-map", "/edit/config-maps/" ]
}, {
label: "Secrets",
href: "/browse/secrets",
prefixes: [ "/browse/secrets/", "/create-secret" ],
canI: {
resource: "secrets",
verb: "list"
}
}, {
label: "Other Resources",
href: "/browse/other"
} ]
} ]
}, {
label: "Storage",
iconClass: "pficon pficon-container-node",
href: "/browse/storage",
prefixes: [ "/browse/storage/", "/create-pvc" ]
}, {
label: "Monitoring",
iconClass: "pficon pficon-screen",
href: "/monitoring",
prefixes: [ "/browse/events" ]
} ],
CATALOG_CATEGORIES: [ {
id: "languages",
label: "Languages",
iconClassDefault: "fa fa-code",
items: [ {
id: "java",
label: "Java",
iconClass: "font-icon icon-openjdk",
subcategories: [ {
id: "java-subcategories",
items: [ {
id: "amq",
label: "Red Hat JBoss A-MQ"
}, {
id: "processserver",
label: "Red Hat JBoss BPM Suite"
}, {
id: "decisionserver",
label: "Red Hat JBoss BRMS"
}, {
id: "datagrid",
label: "Red Hat JBoss Data Grid"
}, {
id: "eap",
label: "Red Hat JBoss EAP"
}, {
id: "jboss-fuse",
label: "Red Hat JBoss Fuse"
}, {
id: "tomcat",
label: "Red Hat JBoss Web Server (Tomcat)"
}, {
id: "sso",
label: "Red Hat Single Sign-On"
}, {
id: "wildfly",
label: "WildFly"
} ]
} ]
}, {
id: "javascript",
categoryAliases: [ "nodejs", "js" ],
label: "JavaScript",
iconClass: "font-icon icon-js"
}, {
id: "dotnet",
label: ".NET",
iconClass: "font-icon icon-dotnet"
}, {
id: "perl",
label: "Perl",
iconClass: "font-icon icon-perl"
}, {
id: "php",
label: "PHP",
iconClass: "font-icon icon-php"
}, {
id: "python",
label: "Python",
iconClass: "font-icon icon-python"
}, {
id: "ruby",
label: "Ruby",
iconClass: "font-icon icon-ruby"
}, {
id: "Golang",
categoryAliases: [ "go" ],
label: "Go",
iconClass: "font-icon icon-go-gopher"
} ]
}, {
id: "technologies",
label: "Technologies",
items: [ {
id: "business-process-services",
categoryAliases: [ "decisionserver", "processserver" ],
label: "Business Process Services",
description: "Model, automate, and orchestrate business processes across applications, services, and data."
}, {
id: "ci-cd",
categoryAliases: [ "jenkins" ],
label: "Continuous Integration & Deployment",
description: "Automate the build, test, and deployment of your application with each new code revision."
}, {
id: "datastore",
categoryAliases: [ "database", "datagrid" ],
label: "Data Stores",
description: "Store and manage collections of data."
}, {
id: "messaging",
label: "Messaging",
description: "Facilitate communication between applications and distributed processes with a messaging server."
}, {
id: "integration",
label: "Integration",
description: "Connect with other applications and data to enhance functionality without duplication."
}, {
id: "single-sign-on",
categoryAliases: [ "sso" ],
label: "Single Sign-On",
description: "A centralized authentication server for users to log in, log out, register, and manage user accounts for applications and RESTful web services."
}, {
id: "",
label: "Uncategorized",
description: ""
} ]
} ],
SAAS_OFFERINGS: [],
APP_LAUNCHER_NAVIGATION: [],
QUOTA_NOTIFICATION_MESSAGE: {}
}), angular.module("openshiftConsole", [ "ngAnimate", "ngCookies", "ngResource", "ngRoute", "ngSanitize", "kubernetesUI", "registryUI.images", "ui.bootstrap", "patternfly.charts", "patternfly.navigation", "patternfly.sort", "patternfly.notification", "openshiftConsoleTemplates", "ui.ace", "extension-registry", "as.sortable", "ui.select", "angular-inview", "angularMoment", "ab-base64", "openshiftCommonServices", "openshiftCommonUI", "webCatalog" ]).config([ "$routeProvider", function(e) {
var t, n = {
templateUrl: "views/projects.html",
controller: "ProjectsController"
};
_.get(window, "OPENSHIFT_CONSTANTS.DISABLE_SERVICE_CATALOG_LANDING_PAGE") ? (t = n, e.when("/projects", {
redirectTo: "/"
})) : (t = {
templateUrl: "views/landing-page.html",
controller: "LandingPageController",
reloadOnSearch: !1
}, e.when("/projects", n)), e.when("/", t).when("/create-project", {
templateUrl: "views/create-project.html",
controller: "CreateProjectController"
}).when("/project/:project", {
redirectTo: function(e) {
return "/project/" + encodeURIComponent(e.project) + "/overview";
}
}).when("/project/:project/overview", {
templateUrl: "views/overview.html",
controller: "OverviewController",
controllerAs: "overview",
reloadOnSearch: !1
}).when("/project/:project/quota", {
templateUrl: "views/quota.html",
controller: "QuotaController"
}).when("/project/:project/monitoring", {
templateUrl: "views/monitoring.html",
controller: "MonitoringController",
reloadOnSearch: !1
}).when("/project/:project/membership", {
templateUrl: "views/membership.html",
controller: "MembershipController",
reloadOnSearch: !1
}).when("/project/:project/browse", {
redirectTo: function(e) {
return "/project/" + encodeURIComponent(e.project) + "/browse/pods";
}
}).when("/project/:project/browse/builds", {
templateUrl: "views/builds.html",
controller: "BuildsController",
reloadOnSearch: !1
}).when("/project/:project/browse/pipelines", {
templateUrl: "views/pipelines.html",
controller: "PipelinesController"
}).when("/project/:project/browse/builds/:buildconfig", {
templateUrl: "views/browse/build-config.html",
controller: "BuildConfigController",
reloadOnSearch: !1
}).when("/project/:project/browse/pipelines/:buildconfig", {
templateUrl: "views/browse/build-config.html",
controller: "BuildConfigController",
resolve: {
isPipeline: [ "$route", function(e) {
e.current.params.isPipeline = !0;
} ]
}
}).when("/project/:project/edit/yaml", {
templateUrl: "views/edit/yaml.html",
controller: "EditYAMLController"
}).when("/project/:project/edit/builds/:buildconfig", {
templateUrl: "views/edit/build-config.html",
controller: "EditBuildConfigController"
}).when("/project/:project/edit/pipelines/:buildconfig", {
templateUrl: "views/edit/build-config.html",
controller: "EditBuildConfigController",
resolve: {
isPipeline: [ "$route", function(e) {
e.current.params.isPipeline = !0;
} ]
},
reloadOnSearch: !1
}).when("/project/:project/browse/builds/:buildconfig/:build", {
templateUrl: function(e) {
return "chromeless" === e.view ? "views/logs/chromeless-build-log.html" : "views/browse/build.html";
},
controller: "BuildController",
reloadOnSearch: !1
}).when("/project/:project/browse/pipelines/:buildconfig/:build", {
templateUrl: "views/browse/build.html",
controller: "BuildController",
resolve: {
isPipeline: [ "$route", function(e) {
e.current.params.isPipeline = !0;
} ]
},
reloadOnSearch: !1
}).when("/project/:project/browse/builds-noconfig/:build", {
templateUrl: "views/browse/build.html",
controller: "BuildController",
reloadOnSearch: !1
}).when("/project/:project/browse/pipelines-noconfig/:build", {
templateUrl: "views/browse/build.html",
controller: "BuildController",
resolve: {
isPipeline: [ "$route", function(e) {
e.current.params.isPipeline = !0;
} ]
},
reloadOnSearch: !1
}).when("/project/:project/browse/deployments", {
templateUrl: "views/deployments.html",
controller: "DeploymentsController",
reloadOnSearch: !1
}).when("/project/:project/browse/deployment/:deployment", {
templateUrl: "views/browse/deployment.html",
controller: "DeploymentController",
reloadOnSearch: !1
}).when("/project/:project/browse/dc/:deploymentconfig", {
templateUrl: "views/browse/deployment-config.html",
controller: "DeploymentConfigController",
reloadOnSearch: !1
}).when("/project/:project/edit/dc/:deploymentconfig", {
templateUrl: "views/edit/deployment-config.html",
controller: "EditDeploymentConfigController"
}).when("/project/:project/browse/stateful-sets/", {
templateUrl: "views/browse/stateful-sets.html",
controller: "StatefulSetsController",
reloadOnSearch: !1
}).when("/project/:project/browse/stateful-sets/:statefulset", {
templateUrl: "views/browse/stateful-set.html",
controller: "StatefulSetController",
reloadOnSearch: !1
}).when("/project/:project/browse/rs/:replicaSet", {
templateUrl: "views/browse/replica-set.html",
resolve: {
kind: function() {
return "ReplicaSet";
}
},
controller: "ReplicaSetController",
reloadOnSearch: !1
}).when("/project/:project/browse/rc/:replicaSet", {
templateUrl: function(e) {
return "chromeless" === e.view ? "views/logs/chromeless-deployment-log.html" : "views/browse/replica-set.html";
},
resolve: {
kind: function() {
return "ReplicationController";
}
},
controller: "ReplicaSetController",
reloadOnSearch: !1
}).when("/project/:project/browse/events", {
templateUrl: "views/events.html",
controller: "EventsController"
}).when("/project/:project/browse/images", {
templateUrl: "views/images.html",
controller: "ImagesController",
reloadOnSearch: !1
}).when("/project/:project/browse/images/:imagestream", {
templateUrl: "views/browse/imagestream.html",
controller: "ImageStreamController"
}).when("/project/:project/browse/images/:imagestream/:tag", {
templateUrl: "views/browse/image.html",
controller: "ImageController",
reloadOnSearch: !1
}).when("/project/:project/browse/pods", {
templateUrl: "views/pods.html",
controller: "PodsController",
reloadOnSearch: !1
}).when("/project/:project/browse/pods/:pod", {
templateUrl: function(e) {
return "chromeless" === e.view ? "views/logs/chromeless-pod-log.html" : "views/browse/pod.html";
},
controller: "PodController",
reloadOnSearch: !1
}).when("/project/:project/browse/services", {
templateUrl: "views/services.html",
controller: "ServicesController",
reloadOnSearch: !1
}).when("/project/:project/browse/services/:service", {
templateUrl: "views/browse/service.html",
controller: "ServiceController",
reloadOnSearch: !1
}).when("/project/:project/browse/service-instances", {
templateUrl: "views/service-instances.html",
controller: "ServiceInstancesController",
reloadOnSearch: !1
}).when("/project/:project/browse/service-instances/:instance", {
templateUrl: "views/browse/service-instance.html",
controller: "ServiceInstanceController",
reloadOnSearch: !1
}).when("/project/:project/browse/storage", {
templateUrl: "views/storage.html",
controller: "StorageController",
reloadOnSearch: !1
}).when("/project/:project/browse/secrets/:secret", {
templateUrl: "views/browse/secret.html",
controller: "SecretController",
reloadOnSearch: !1
}).when("/project/:project/browse/secrets", {
templateUrl: "views/secrets.html",
controller: "SecretsController",
reloadOnSearch: !1
}).when("/project/:project/create-secret", {
templateUrl: "views/create-secret.html",
controller: "CreateSecretController"
}).when("/project/:project/browse/config-maps", {
templateUrl: "views/browse/config-maps.html",
controller: "ConfigMapsController",
reloadOnSearch: !1
}).when("/project/:project/browse/config-maps/:configMap", {
templateUrl: "views/browse/config-map.html",
controller: "ConfigMapController"
}).when("/project/:project/create-config-map", {
templateUrl: "views/create-config-map.html",
controller: "CreateConfigMapController"
}).when("/project/:project/edit/config-maps/:configMap", {
templateUrl: "views/edit/config-map.html",
controller: "EditConfigMapController"
}).when("/project/:project/browse/other", {
templateUrl: "views/other-resources.html",
controller: "OtherResourcesController",
reloadOnSearch: !1
}).when("/project/:project/browse/persistentvolumeclaims/:pvc", {
templateUrl: "views/browse/persistent-volume-claim.html",
controller: "PersistentVolumeClaimController"
}).when("/project/:project/browse/routes", {
templateUrl: "views/browse/routes.html",
controller: "RoutesController",
reloadOnSearch: !1
}).when("/project/:project/edit/routes/:route", {
templateUrl: "views/edit/route.html",
controller: "EditRouteController"
}).when("/project/:project/browse/routes/:route", {
templateUrl: "views/browse/route.html",
controller: "RouteController"
}).when("/project/:project/create-route", {
templateUrl: "views/create-route.html",
controller: "CreateRouteController"
}).when("/project/:project/edit", {
templateUrl: "views/edit/project.html",
controller: "EditProjectController"
}).when("/project/:project/create-pvc", {
templateUrl: "views/create-persistent-volume-claim.html",
controller: "CreatePersistentVolumeClaimController"
}).when("/project/:project/attach-pvc", {
templateUrl: "views/attach-pvc.html",
controller: "AttachPVCController"
}).when("/project/:project/add-config-volume", {
templateUrl: "views/add-config-volume.html",
controller: "AddConfigVolumeController"
}).when("/project/:project/create", {
templateUrl: "views/create.html",
controller: "CreateController",
reloadOnSearch: !1
}).when("/project/:project/create/category/:category", {
templateUrl: "views/create/category.html",
controller: "BrowseCategoryController"
}).when("/project/:project/create/category/:category/:subcategory", {
templateUrl: "views/create/category.html",
controller: "BrowseCategoryController"
}).when("/project/:project/create/fromtemplate", {
templateUrl: "views/newfromtemplate.html",
controller: "NewFromTemplateController"
}).when("/project/:project/create/fromimage", {
templateUrl: "views/create/fromimage.html",
controller: "CreateFromImageController"
}).when("/project/:project/create/next", {
templateUrl: "views/create/next-steps.html",
controller: "NextStepsController"
}).when("/project/:project/set-limits", {
templateUrl: "views/set-limits.html",
controller: "SetLimitsController"
}).when("/project/:project/edit/autoscaler", {
templateUrl: "views/edit/autoscaler.html",
controller: "EditAutoscalerController"
}).when("/project/:project/edit/health-checks", {
templateUrl: "views/edit/health-checks.html",
controller: "EditHealthChecksController"
}).when("/about", {
templateUrl: "views/about.html",
controller: "AboutController"
}).when("/command-line", {
templateUrl: "views/command-line.html",
controller: "CommandLineController"
}).when("/oauth", {
templateUrl: "views/util/oauth.html",
controller: "OAuthController"
}).when("/error", {
templateUrl: "views/util/error.html",
controller: "ErrorController"
}).when("/logout", {
templateUrl: "views/util/logout.html",
controller: "LogoutController"
}).when("/create", {
templateUrl: "views/create-from-url.html",
controller: "CreateFromURLController"
}).when("/createProject", {
redirectTo: "/create-project"
}).when("/project/:project/createRoute", {
redirectTo: "/project/:project/create-route"
}).when("/project/:project/attachPVC", {
redirectTo: "/project/:project/attach-pvc"
}).when("/project/:project/browse/deployments/:deploymentconfig", {
redirectTo: "/project/:project/browse/dc/:deploymentconfig"
}).when("/project/:project/browse/deployments/:deploymentconfig/:rc", {
redirectTo: "/project/:project/browse/rc/:rc"
}).when("/project/:project/browse/deployments-replicationcontrollers/:rc", {
redirectTo: "/project/:project/browse/rc/:rc"
}).otherwise({
redirectTo: "/"
});
} ]).constant("LOGGING_URL", _.get(window.OPENSHIFT_CONFIG, "loggingURL")).constant("METRICS_URL", _.get(window.OPENSHIFT_CONFIG, "metricsURL")).constant("LIMIT_REQUEST_OVERRIDES", _.get(window.OPENSHIFT_CONFIG, "limitRequestOverrides")).constant("SOURCE_URL_PATTERN", /^[a-z][a-z0-9+.-@]*:(\/\/)?[0-9a-z_-]+/i).constant("RELATIVE_PATH_PATTERN", /^(?!\/)(?!\.\.(\/|$))(?!.*\/\.\.(\/|$)).*$/).constant("IS_SAFARI", /Version\/[\d\.]+.*Safari/.test(navigator.userAgent)).constant("amTimeAgoConfig", {
titleFormat: "LLL"
}).config([ "kubernetesContainerSocketProvider", function(e) {
e.WebSocketFactory = "ContainerWebSocket";
} ]).config([ "$compileProvider", function(e) {
e.aHrefSanitizationWhitelist(/^\s*(https?|mailto|git):/i);
} ]).run([ "$rootScope", "LabelFilter", function(e, t) {
t.persistFilterState(!0), e.$on("$routeChangeSuccess", function() {
t.readPersistedState();
});
} ]).run([ "durationFilter", "timeOnlyDurationFromTimestampsFilter", function(e, t) {
setInterval(function() {
$(".duration[data-timestamp]").text(function(n, a) {
var r = $(this).data("timestamp"), o = $(this).data("omit-single"), i = $(this).data("precision");
return $(this).data("time-only") ? t(r, null) || a : e(r, null, o, i) || a;
});
}, 1e3);
} ]).run([ "IS_IOS", function(e) {
e && $("body").addClass("ios");
} ]), hawtioPluginLoader.addModule("openshiftConsole"), angular.module("openshiftConsole").factory("BrowserStore", [ function() {
var e = {
local: window.localStorage,
session: window.sessionStorage
};
return {
saveJSON: function(t, n, a) {
return e[t].setItem("openshift/" + n, JSON.stringify(a));
},
loadJSON: function(t, n) {
return JSON.parse(e[t].getItem("openshift/" + n) || "{}");
}
};
} ]), angular.module("openshiftConsole").factory("APIDiscovery", [ "LOGGING_URL", "METRICS_URL", "$q", "$filter", function(e, t, n, a) {
return {
getLoggingURL: function(t) {
var r = e, o = a("annotation")(t, "loggingUIHostname");
return o && (r = "https://" + o), n.when(r);
},
getMetricsURL: function() {
return n.when(t);
}
};
} ]), angular.module("openshiftConsole").service("ApplicationGenerator", [ "DataService", "APIService", "Logger", "$parse", "$q", function(e, t, n, a, r) {
var o = {}, i = function(e) {
return _.isArray(e) ? e : _.map(e, function(e, t) {
return {
name: t,
value: e
};
});
};
return o._generateSecret = function() {
function e() {
return Math.floor(65536 * (1 + Math.random())).toString(16).substring(1);
}
return e() + e() + e() + e();
}, o.parsePorts = function(e) {
return function(t) {
var r = [];
return angular.forEach(t, function(t, o) {
var i = o.split("/");
1 === i.length && i.push("tcp");
var s = parseInt(i[0], 10);
isNaN(s) ? n.warn("Container port " + i[0] + " is not a number for image " + a("metadata.name")(e)) : r.push({
containerPort: s,
protocol: i[1].toUpperCase()
});
}), r.sort(function(e, t) {
return e.containerPort - t.containerPort;
}), r;
}(a("dockerImageMetadata.Config.ExposedPorts")(e) || a("dockerImageMetadata.ContainerConfig.ExposedPorts")(e) || []);
}, o.generate = function(e) {
var t = o.parsePorts(e.image);
e.annotations["openshift.io/generated-by"] = "OpenShiftWebConsole";
var n;
null !== e.buildConfig.sourceUrl && (n = {
name: e.name,
tag: "latest",
kind: "ImageStreamTag",
toString: function() {
return this.name + ":" + this.tag;
}
});
var a = {
imageStream: o._generateImageStream(e),
buildConfig: o._generateBuildConfig(e, n, e.labels),
deploymentConfig: o._generateDeploymentConfig(e, n, t, e.labels)
};
e.scaling.autoscale && (a.hpa = o._generateHPA(e, a.deploymentConfig));
var r = o._generateService(e, e.name, t);
return r && (a.service = r, a.route = o._generateRoute(e, e.name, a.service.metadata.name)), a;
}, o.createRoute = function(e, t, n) {
return o._generateRoute({
labels: n || {},
routing: angular.extend({
include: !0
}, e)
}, e.name, t);
}, o._generateRoute = function(e, t, n) {
if (!e.routing.include) return null;
var a = {
kind: "Route",
apiVersion: "v1",
metadata: {
name: t,
labels: e.labels,
annotations: e.annotations
},
spec: {
to: {
kind: "Service",
name: n
},
wildcardPolicy: "None"
}
}, r = e.routing.host;
r && (r.startsWith("*.") ? (a.spec.wildcardPolicy = "Subdomain", a.spec.host = "wildcard" + r.substring(1)) : a.spec.host = r), e.routing.path && (a.spec.path = e.routing.path), e.routing.targetPort && (a.spec.port = {
targetPort: e.routing.targetPort
});
var o = e.routing.tls;
return o && o.termination && (a.spec.tls = {
termination: o.termination
}, o.insecureEdgeTerminationPolicy && (a.spec.tls.insecureEdgeTerminationPolicy = o.insecureEdgeTerminationPolicy), "passthrough" !== o.termination && (o.certificate && (a.spec.tls.certificate = o.certificate), o.key && (a.spec.tls.key = o.key), o.caCertificate && (a.spec.tls.caCertificate = o.caCertificate), o.destinationCACertificate && "reencrypt" === o.termination && (a.spec.tls.destinationCACertificate = o.destinationCACertificate))), a;
}, o._generateDeploymentConfig = function(e, t, n) {
var a = i(e.deploymentConfig.envVars), r = angular.copy(e.labels);
r.deploymentconfig = e.name;
var o, s = {
image: t.toString(),
name: e.name,
ports: n,
env: a,
resources: _.get(e, "container.resources")
};
o = e.scaling.autoscaling ? e.scaling.minReplicas || 1 : e.scaling.replicas;
var c = {
apiVersion: "v1",
kind: "DeploymentConfig",
metadata: {
name: e.name,
labels: e.labels,
annotations: e.annotations
},
spec: {
replicas: o,
selector: {
deploymentconfig: e.name
},
triggers: [],
template: {
metadata: {
labels: r
},
spec: {
containers: [ s ]
}
}
}
};
return c.spec.triggers.push({
type: "ImageChange",
imageChangeParams: {
automatic: !!e.deploymentConfig.deployOnNewImage,
containerNames: [ e.name ],
from: {
kind: t.kind,
name: t.toString()
}
}
}), e.deploymentConfig.deployOnConfigChange && c.spec.triggers.push({
type: "ConfigChange"
}), c;
}, o._generateHPA = function(e, t) {
return {
apiVersion: "autoscaling/v1",
kind: "HorizontalPodAutoscaler",
metadata: {
name: e.name,
labels: e.labels,
annotations: e.annotations
},
spec: {
scaleTargetRef: {
kind: "DeploymentConfig",
name: t.metadata.name,
apiVersion: "extensions/v1beta1",
subresource: "scale"
},
minReplicas: e.scaling.minReplicas,
maxReplicas: e.scaling.maxReplicas,
targetCPUUtilizationPercentage: e.scaling.targetCPU || e.scaling.defaultTargetCPU || null
}
};
}, o._generateBuildConfig = function(e, t) {
var n = i(e.buildConfig.envVars), a = [ {
generic: {
secret: o._generateSecret()
},
type: "Generic"
} ];
e.buildConfig.buildOnSourceChange && a.push({
github: {
secret: o._generateSecret()
},
type: "GitHub"
}), e.buildConfig.buildOnImageChange && a.push({
imageChange: {},
type: "ImageChange"
}), e.buildConfig.buildOnConfigChange && a.push({
type: "ConfigChange"
});
var r = new URI(e.buildConfig.sourceUrl), s = r.fragment();
s || (s = "master"), r.fragment("");
var c = r.href(), l = {
apiVersion: "v1",
kind: "BuildConfig",
metadata: {
name: e.name,
labels: e.labels,
annotations: e.annotations
},
spec: {
output: {
to: {
name: t.toString(),
kind: t.kind
}
},
source: {
git: {
ref: e.buildConfig.gitRef || s,
uri: c
},
type: "Git"
},
strategy: {
type: "Source",
sourceStrategy: {
from: {
kind: "ImageStreamTag",
name: e.imageName + ":" + e.imageTag
},
env: n
}
},
triggers: a
}
};
return e.namespace && (l.spec.strategy.namespace = e.namespace), _.get(e, "buildConfig.secrets.gitSecret[0].name") && (l.spec.source.sourceSecret = _.head(e.buildConfig.secrets.gitSecret)), e.buildConfig.contextDir && (l.spec.source.contextDir = e.buildConfig.contextDir), l;
}, o._generateImageStream = function(e) {
return {
apiVersion: "v1",
kind: "ImageStream",
metadata: {
name: e.name,
labels: e.labels,
annotations: e.annotations
}
};
}, o.getServicePort = function(e) {
return {
port: e.containerPort,
targetPort: e.containerPort,
protocol: e.protocol,
name: (e.containerPort + "-" + e.protocol).toLowerCase()
};
}, o._generateService = function(e, t, n) {
return n && n.length ? {
kind: "Service",
apiVersion: "v1",
metadata: {
name: t,
labels: e.labels,
annotations: e.annotations
},
spec: {
selector: {
deploymentconfig: e.name
},
ports: _.map(n, o.getServicePort)
}
} : null;
}, o.ifResourcesDontExist = function(n, a) {
function o() {
0 === l && (s.length > 0 ? i.reject({
nameTaken: !0
}) : i.resolve({
nameTaken: !1
}));
}
var i = r.defer(), s = [], c = [], l = n.length;
return n.forEach(function(n) {
var r = t.objectToResourceGroupVersion(n);
return r ? t.apiInfo(r) ? void e.get(r, n.metadata.name, {
namespace: a
}, {
errorNotification: !1
}).then(function(e) {
s.push(e), l--, o();
}, function(e) {
c.push(e), l--, o();
}) : (c.push({
data: {
message: t.unsupportedObjectKindOrVersion(n)
}
}), l--, void o()) : (c.push({
data: {
message: t.invalidObjectKindOrVersion(n)
}
}), l--, void o());
}), i.promise;
}, o;
} ]), angular.module("openshiftConsole").service("Navigate", [ "$location", "$window", "$timeout", "annotationFilter", "LabelFilter", "$filter", "APIService", function(e, t, n, a, r, o, i) {
var s = o("annotation"), c = o("buildConfigForBuild"), l = o("isJenkinsPipelineStrategy"), u = o("displayName"), d = function(e, t) {
return _.get(t, "isPipeline") ? "pipelines" : _.isObject(e) && l(e) ? "pipelines" : "builds";
};
return {
toErrorPage: function(n, a, r) {
var o = URI("error").query({
error_description: n,
error: a
}).toString();
r ? t.location.href = o : e.url(o).replace();
},
toProjectOverview: function(t) {
e.path(this.projectOverviewURL(t));
},
projectOverviewURL: function(e) {
return "project/" + encodeURIComponent(e) + "/overview";
},
toProjectList: function() {
e.path("projects");
},
membershipURL: function(e) {
return "project/" + encodeURIComponent(e) + "/membership";
},
toProjectMembership: function(t) {
e.path(this.membershipURL(t));
},
quotaURL: function(e) {
return "project/" + encodeURIComponent(e) + "/quota";
},
createFromImageURL: function(e, t, n, a) {
return URI.expand("project/{project}/create/fromimage{?q*}", {
project: n,
q: angular.extend({
imageStream: e.metadata.name,
imageTag: t,
namespace: e.metadata.namespace,
displayName: u(e)
}, a || {})
}).toString();
},
createFromTemplateURL: function(e, t, n) {
return URI.expand("project/{project}/create/fromtemplate{?q*}", {
project: t,
q: angular.extend({
template: e.metadata.name,
namespace: e.metadata.namespace
}, n || {})
}).toString();
},
toNextSteps: function(t, n, a) {
var r = {
name: t
};
_.isObject(a) && _.extend(r, a), e.path("project/" + encodeURIComponent(n) + "/create/next").search(r);
},
toPodsForDeployment: function(t, a) {
1 !== _.size(a) ? (e.url("/project/" + t.metadata.namespace + "/browse/pods"), n(function() {
r.setLabelSelector(new LabelSelector(t.spec.selector, !0));
}, 1)) : this.toResourceURL(_.sample(a));
},
resourceURL: function(e, t, n, a, r) {
if (a = a || "browse", !(e && (e.metadata || t && n))) return null;
t || (t = e.kind), n || (n = e.metadata.namespace);
var s = e;
e.metadata && (s = e.metadata.name);
var c = URI("").segment("project").segmentCoded(n).segment(a);
switch (t) {
case "Build":
var l = o("buildConfigForBuild")(e), u = d(e, r);
l ? c.segment(u).segmentCoded(l).segmentCoded(s) : c.segment(u + "-noconfig").segmentCoded(s);
break;

case "BuildConfig":
c.segment(d(e, r)).segmentCoded(s);
break;

case "ConfigMap":
c.segment("config-maps").segmentCoded(s);
break;

case "Deployment":
c.segment("deployment").segmentCoded(s);
break;

case "DeploymentConfig":
c.segment("dc").segmentCoded(s);
break;

case "ReplicaSet":
c.segment("rs").segmentCoded(s);
break;

case "ReplicationController":
c.segment("rc").segmentCoded(s);
break;

case "ImageStream":
c.segment("images").segmentCoded(s);
break;

case "ImageStreamTag":
var p = s.indexOf(":");
c.segment("images").segmentCoded(s.substring(0, p)).segmentCoded(s.substring(p + 1));
break;

case "ServiceInstance":
c.segment("service-instances").segmentCoded(s);
break;

case "StatefulSet":
c.segment("stateful-sets").segmentCoded(s);
break;

case "PersistentVolumeClaim":
case "Pod":
case "Route":
case "Secret":
case "Service":
c.segment(i.kindToResource(t)).segmentCoded(s);
break;

default:
var m;
if (e.metadata) m = i.objectToResourceGroupVersion(e); else if (_.get(r, "apiVersion")) {
var f = i.kindToResource(t), g = i.parseGroupVersion(r.apiVersion);
g.resource = f, m = i.toResourceGroupVersion(g);
} else m = i.toResourceGroupVersion(i.kindToResource(t));
if (!i.apiInfo(m)) return null;
c.segment("other").search({
kind: t,
group: m.group
});
}
return _.get(r, "tab") && c.setSearch("tab", r.tab), c.toString();
},
toResourceURL: function(t) {
e.url(this.resourceURL(t));
},
configURLForResource: function(e, t) {
var n, a, r = _.get(e, "kind"), o = _.get(e, "metadata.namespace");
if (!r || !o) return null;
switch (r) {
case "Build":
return (n = c(e)) ? this.resourceURL(n, "BuildConfig", o, t, {
isPipeline: l(e)
}) : null;

case "ReplicationController":
return (a = s(e, "deploymentConfig")) ? this.resourceURL(a, "DeploymentConfig", o, t) : null;
}
return null;
},
resourceListURL: function(e, t) {
var n = {
builds: "builds",
buildconfigs: "builds",
configmaps: "config-maps",
deployments: "deployments",
deploymentconfigs: "deployments",
imagestreams: "images",
pods: "pods",
replicasets: "deployments",
replicationcontrollers: "deployments",
routes: "routes",
secrets: "secrets",
services: "services",
serviceinstances: "service-instances",
persistentvolumeclaims: "storage",
statefulsets: "stateful-sets"
};
return URI.expand("project/{projectName}/browse/{browsePath}", {
projectName: t,
browsePath: n[e]
}).toString();
},
toResourceList: function(t, n) {
e.url(this.resourceListURL(t, n));
},
yamlURL: function(e, t) {
if (!e) return "";
var n = i.parseGroupVersion(e.apiVersion);
return URI.expand("project/{projectName}/edit/yaml?kind={kind}&name={name}&group={group}&returnURL={returnURL}", {
projectName: e.metadata.namespace,
kind: e.kind,
name: e.metadata.name,
group: n.group || "",
returnURL: t || ""
}).toString();
},
healthCheckURL: function(e, t, n, a) {
return URI.expand("project/{projectName}/edit/health-checks?kind={kind}&name={name}&group={group}", {
projectName: e,
kind: t,
name: n,
group: a || ""
}).toString();
}
};
} ]), angular.module("openshiftConsole").service("NameGenerator", function() {
return {
suggestFromSourceUrl: function(e) {
var t = e.substr(e.lastIndexOf("/") + 1, e.length), n = t.indexOf(".");
return -1 !== n && (t = t.substr(0, n)), t.split("#")[0];
}
};
}), angular.module("openshiftConsole").factory("TaskList", [ "$timeout", function(e) {
function t() {
this.tasks = [];
}
var n = new t();
return t.prototype.add = function(t, a, r, o) {
var i = {
status: "started",
titles: t,
helpLinks: a,
namespace: r
};
this.tasks.push(i), o().then(function(t) {
i.status = "completed", i.hasErrors = t.hasErrors || !1, i.alerts = t.alerts || [], i.hasErrors || e(function() {
n.deleteTask(i);
}, 6e4);
});
}, t.prototype.taskList = function() {
return this.tasks;
}, t.prototype.deleteTask = function(e) {
var t = n.tasks.indexOf(e);
t >= 0 && this.tasks.splice(t, 1);
}, t.prototype.clear = function() {
n.tasks = [];
}, n;
} ]), angular.module("openshiftConsole").factory("ImageStreamResolver", [ "$q", "DataService", function(e, t) {
function n() {}
return n.prototype.fetchReferencedImageStreamImages = function(n, a, r, o) {
var i = {};
return angular.forEach(n, function(e) {
angular.forEach(e.spec.containers, function(e) {
var n = e.image;
if (n && !a[n] && !i[n]) {
var s = r[n];
if (s) {
var c = s.split("@"), l = t.get("imagestreamimages", s, o);
l.then(function(e) {
if (e && e.image) {
var t = angular.copy(e.image);
t.imageStreamName = c[0], t.imageStreamNamespace = o.project.metadata.name, a[n] = t;
}
}), i[n] = l;
}
}
});
}), e.all(i);
}, n.prototype.buildDockerRefMapForImageStreams = function(e, t) {
angular.forEach(e, function(e) {
angular.forEach(e.status.tags, function(n) {
angular.forEach(n.items, function(n) {
n.image && (t[n.dockerImageReference] = e.metadata.name + "@" + n.image);
});
});
});
}, new n();
} ]), angular.module("openshiftConsole").factory("ContainerWebSocket", [ "API_CFG", "$ws", function(e, t) {
return function(n, a) {
return 0 === n.indexOf("/") && (n = ("http:" === window.location.protocol ? "ws://" : "wss://") + e.openshift.hostPort + n), t({
url: n,
method: "WATCH",
protocols: a,
auth: {}
});
};
} ]), angular.module("openshiftConsole").factory("BaseHref", [ "$document", function(e) {
return e.find("base").attr("href") || "/";
} ]), angular.module("openshiftConsole").factory("BuildsService", [ "$filter", "$q", "DataService", "Navigate", "NotificationsService", function(e, t, n, a, r) {
var o = e("annotation"), i = e("buildConfigForBuild"), s = e("getErrorDetails"), c = e("isIncompleteBuild"), l = e("isJenkinsPipelineStrategy"), u = e("isNewerResource"), d = function(e) {
var t = o(e, "buildNumber") || parseInt(e.metadata.name.match(/(\d+)$/), 10);
return isNaN(t) ? null : t;
}, p = function(e, t) {
var n = d(e);
return t && n ? t + " #" + n : e.metadata.name;
}, m = function(e) {
return "true" === o(e, "openshift.io/build-config.paused");
}, f = function(e) {
return e.status.startTimestamp || e.metadata.creationTimestamp;
}, g = function(e) {
return _.round(e / 1e3 / 1e3);
}, h = e("imageObjectRef"), v = function(e) {
var t = o(e, "jenkinsStatus");
if (!t) return null;
try {
return JSON.parse(t);
} catch (e) {
return Logger.error("Could not parse Jenkins status as JSON", t), null;
}
};
return {
startBuild: function(e) {
var o = l(e) ? "pipeline" : "build", i = {
kind: "BuildRequest",
apiVersion: "v1",
metadata: {
name: e.metadata.name
}
}, c = {
namespace: e.metadata.namespace
};
return n.create("buildconfigs/instantiate", e.metadata.name, i, c).then(function(t) {
var n, i, s = p(t, e.metadata.name), c = _.get(e, "spec.runPolicy");
"Serial" === c || "SerialLatestOnly" === c ? (n = _.capitalize(o) + " " + s + " successfully queued.", i = "Builds for " + e.metadata.name + " are configured to run one at a time.") : n = _.capitalize(o) + " " + s + " successfully created.", r.addNotification({
type: "success",
message: n,
details: i,
links: [ {
href: a.resourceURL(t),
label: "View Build"
} ]
});
}, function(e) {
return r.addNotification({
type: "error",
message: "An error occurred while starting the " + o + ".",
details: s(e)
}), t.reject(e);
});
},
cancelBuild: function(e, a) {
var o = l(e) ? "pipeline" : "build", i = p(e, a), c = {
namespace: e.metadata.namespace
}, u = angular.copy(e);
return u.status.cancelled = !0, n.update("builds", u.metadata.name, u, c).then(function() {
r.addNotification({
type: "success",
message: _.capitalize(o) + " " + i + " successfully cancelled."
});
}), function(e) {
return r.addNotification({
type: "error",
message: "An error occurred cancelling " + o + " " + i + ".",
details: s(e)
}), t.reject(e);
};
},
cloneBuild: function(e, o) {
var i = l(e) ? "pipeline" : "build", c = p(e, o), u = {
kind: "BuildRequest",
apiVersion: "v1",
metadata: {
name: e.metadata.name
}
}, d = {
namespace: e.metadata.namespace
};
return n.create("builds/clone", e.metadata.name, u, d).then(function(e) {
var t = p(e, o);
r.addNotification({
type: "success",
message: _.capitalize(i) + " " + c + " is being rebuilt as " + t + ".",
links: [ {
href: a.resourceURL(e),
label: "View Build"
} ]
});
}, function(e) {
return r.addNotification({
type: "error",
message: "An error occurred while rerunning " + i + " " + c + ".",
details: s(e)
}), t.reject();
});
},
isPaused: m,
canBuild: function(e) {
return !!e && !e.metadata.deletionTimestamp && !m(e);
},
usesDeploymentConfigs: function(e) {
var t = o(e, "pipeline.alpha.openshift.io/uses");
if (!t) return [];
try {
t = JSON.parse(t);
} catch (e) {
return void Logger.warn('Could not parse "pipeline.alpha.openshift.io/uses" annotation', e);
}
var n = [];
return _.each(t, function(t) {
t.name && (t.namespace && t.namespace !== _.get(e, "metadata.namespace") || "DeploymentConfig" === t.kind && n.push(t.name));
}), n;
},
validatedBuildsForBuildConfig: function(e, t) {
return _.pickBy(t, function(t) {
var n = o(t, "buildConfig");
return !n || n === e;
});
},
latestBuildByConfig: function(e, t) {
var n = {};
return _.each(e, function(e) {
var a = i(e) || "";
t && !t(e) || u(e, n[a]) && (n[a] = e);
}), n;
},
getBuildNumber: d,
getBuildDisplayName: p,
getStartTimestsamp: f,
getDuration: function(e) {
var t = _.get(e, "status.duration");
if (t) return g(t);
var n = f(e), a = e.status.completionTimestamp;
return n && a ? moment(a).diff(moment(n)) : 0;
},
incompleteBuilds: function(e) {
return _.map(e, function(e) {
return c(e);
});
},
completeBuilds: function(e) {
return _.map(e, function(e) {
return !c(e);
});
},
lastCompleteByBuildConfig: function(t) {
return _.reduce(t, function(t, n) {
if (c(n)) return t;
var a = e("annotation")(n, "buildConfig");
return u(n, t[a]) && (t[a] = n), t;
}, {});
},
interestingBuilds: function(t) {
var n = {};
return _.filter(t, function(t) {
if (c(t)) return !0;
var a = e("annotation")(t, "buildConfig");
u(t, n[a]) && (n[a] = t);
}).concat(_.map(n, function(e) {
return e;
}));
},
groupBuildConfigsByOutputImage: function(e) {
var t = {};
return _.each(e, function(e) {
var n = _.get(e, "spec.output.to"), a = h(n, e.metadata.namespace);
a && (t[a] = t[a] || [], t[a].push(e));
}), t;
},
sortBuilds: function(e, t) {
var n = function(e, n) {
var a, r, o = d(e), i = d(n);
return o || i ? o ? i ? t ? i - o : o - i : t ? -1 : 1 : t ? 1 : -1 : (a = _.get(e, "metadata.name", ""), r = _.get(n, "metadata.name", ""), t ? r.localeCompare(a) : a.localeCompare(r));
};
return _.toArray(e).sort(function(e, a) {
var r = _.get(e, "metadata.creationTimestamp", ""), o = _.get(a, "metadata.creationTimestamp", "");
return r === o ? n(e, a) : t ? o.localeCompare(r) : r.localeCompare(o);
});
},
getJenkinsStatus: v,
getCurrentStage: function(e) {
var t = v(e), n = _.get(t, "stages", []);
return _.last(n);
}
};
} ]), angular.module("openshiftConsole").factory("DeploymentsService", [ "APIService", "NotificationsService", "DataService", "$filter", "$q", "LabelFilter", function(e, t, n, a, r, o) {
function i() {}
var s = a("annotation");
i.prototype.startLatestDeployment = function(e, r) {
var o = {
kind: "DeploymentRequest",
apiVersion: "v1",
name: e.metadata.name,
latest: !0,
force: !0
};
n.create("deploymentconfigs/instantiate", e.metadata.name, o, r).then(function(n) {
t.addNotification({
type: "success",
message: "Deployment #" + n.status.latestVersion + " of " + e.metadata.name + " has started."
});
}, function(e) {
t.addNotification({
type: "error",
message: "An error occurred while starting the deployment.",
details: a("getErrorDetails")(e)
});
});
}, i.prototype.retryFailedDeployment = function(e, r, o) {
var i = angular.copy(e), c = e.metadata.name, l = s(e, "deploymentConfig");
n.list("pods", r, function(e) {
var t = e.by("metadata.name");
angular.forEach(t, function(e) {
var t = a("annotationName")("deployerPodFor");
e.metadata.labels[t] === c && n.delete("pods", e.metadata.name, o).then(function() {
Logger.info("Deployer pod " + e.metadata.name + " deleted");
}, function(e) {
o.alerts = o.alerts || {}, o.alerts.retrydeployer = {
type: "error",
message: "An error occurred while deleting the deployer pod.",
details: a("getErrorDetails")(e)
};
});
});
});
var u = a("annotationName")("deploymentStatus"), d = a("annotationName")("deploymentStatusReason"), p = a("annotationName")("deploymentCancelled");
i.metadata.annotations[u] = "New", delete i.metadata.annotations[d], delete i.metadata.annotations[p], n.update("replicationcontrollers", c, i, r).then(function() {
t.addNotification({
type: "success",
message: "Retrying deployment " + c + " of " + l + "."
});
}, function(e) {
t.addNotification({
type: "error",
message: "An error occurred while retrying the deployment.",
details: a("getErrorDetails")(e)
});
});
}, i.prototype.rollbackToDeployment = function(r, o, i, c, l) {
var u = r.metadata.name, d = s(r, "deploymentConfig"), p = {
apiVersion: "apps.openshift.io/v1",
kind: "DeploymentConfigRollback",
name: d,
spec: {
from: {
name: u
},
includeTemplate: !0,
includeReplicationMeta: o,
includeStrategy: i,
includeTriggers: c
}
};
n.create({
group: "apps.openshift.io",
resource: "deploymentconfigs/rollback"
}, d, p, l).then(function(r) {
var o = e.objectToResourceGroupVersion(r);
n.update(o, d, r, l).then(function(e) {
t.addNotification({
type: "success",
message: "Deployment #" + e.status.latestVersion + " is rolling back " + d + " to " + u + "."
});
}, function(e) {
t.addNotification({
id: "rollback-deployment-error",
type: "error",
message: "An error occurred while rolling back the deployment.",
details: a("getErrorDetails")(e)
});
});
}, function(e) {
t.addNotification({
id: "rollback-deployment-error",
type: "error",
message: "An error occurred while rolling back the deployment.",
details: a("getErrorDetails")(e)
});
});
}, i.prototype.cancelRunningDeployment = function(e, r) {
var o = e.metadata.name, i = a("annotation")(e, "deploymentConfig"), s = angular.copy(e), c = a("annotationName")("deploymentCancelled"), l = a("annotationName")("deploymentStatusReason");
s.metadata.annotations[c] = "true", s.metadata.annotations[l] = "The deployment was cancelled by the user", n.update("replicationcontrollers", o, s, r).then(function() {
t.addNotification({
type: "success",
message: "Cancelled deployment " + o + " of " + i + "."
});
}, function(e) {
t.addNotification({
id: "cancel-deployment-error",
type: "error",
message: "An error occurred while cancelling the deployment.",
details: a("getErrorDetails")(e)
});
});
}, i.prototype.associateDeploymentsToDeploymentConfig = function(e, t, n) {
var r = {}, i = o.getLabelSelector();
return angular.forEach(e, function(e, o) {
var s = a("annotation")(e, "deploymentConfig");
(!n || t && t[s] || i.matches(e)) && (r[s = s || ""] = r[s] || {}, r[s][o] = e);
}), angular.forEach(t, function(e, t) {
r[t] = r[t] || {};
}), r;
}, i.prototype.deploymentBelongsToConfig = function(e, t) {
return !(!e || !t) && t === a("annotation")(e, "deploymentConfig");
}, i.prototype.associateRunningDeploymentToDeploymentConfig = function(e) {
var t = {};
return angular.forEach(e, function(e, n) {
t[n] = {}, angular.forEach(e, function(e, r) {
var o = a("deploymentStatus")(e);
"New" !== o && "Pending" !== o && "Running" !== o || (t[n][r] = e);
});
}), t;
}, i.prototype.getActiveDeployment = function(e) {
var t = a("deploymentIsInProgress"), n = a("annotation"), r = null;
return _.each(e, function(e) {
if (t(e)) return r = null, !1;
"Complete" === n(e, "deploymentStatus") && (!r || r.metadata.creationTimestamp < e.metadata.creationTimestamp) && (r = e);
}), r;
}, i.prototype.getRevision = function(e) {
return s(e, "deployment.kubernetes.io/revision");
}, i.prototype.isActiveReplicaSet = function(e, t) {
var n = this.getRevision(e), a = this.getRevision(t);
return !(!n || !a) && n === a;
}, i.prototype.getActiveReplicaSet = function(e, t) {
var n = this.getRevision(t);
if (!n) return null;
var a = this;
return _.find(e, function(e) {
return a.getRevision(e) === n;
});
}, i.prototype.getScaleResource = function(t) {
var n = {
resource: e.kindToResource(t.kind) + "/scale"
};
switch (t.kind) {
case "DeploymentConfig":
break;

case "Deployment":
case "ReplicaSet":
case "ReplicationController":
n.group = "extensions";
break;

default:
return null;
}
return n;
}, i.prototype.scale = function(e, t) {
var a = this.getScaleResource(e);
if (!a) return r.reject({
data: {
message: "Cannot scale kind " + e.kind + "."
}
});
var o = {
apiVersion: "extensions/v1beta1",
kind: "Scale",
metadata: {
name: e.metadata.name,
namespace: e.metadata.namespace,
creationTimestamp: e.metadata.creationTimestamp
},
spec: {
replicas: t
}
};
return n.update(a, e.metadata.name, o, {
namespace: e.metadata.namespace
});
};
var c = function(e, t) {
var n = _.get(t, [ e ]);
return !_.isEmpty(n);
}, l = function(e, t) {
var n = _.get(t, [ e ]);
return !_.isEmpty(n);
};
return i.prototype.isScalable = function(e, t, n, a, r) {
if (l(e.metadata.name, a)) return !1;
var o = s(e, "deploymentConfig");
return !o || !!t && (!t[o] || !c(o, n) && _.get(r, [ o, "metadata", "name" ]) === e.metadata.name);
}, i.prototype.groupByDeploymentConfig = function(e) {
var t = {};
return _.each(e, function(e) {
var n = a("annotation")(e, "deploymentConfig") || "";
_.set(t, [ n, e.metadata.name ], e);
}), t;
}, i.prototype.sortByDeploymentVersion = function(e, t) {
return _.toArray(e).sort(function(e, n) {
var a, r, o = parseInt(s(e, "deploymentVersion"), 10), i = parseInt(s(n, "deploymentVersion"), 10);
return _.isFinite(o) || _.isFinite(i) ? o ? i ? t ? i - o : o - i : t ? -1 : 1 : t ? 1 : -1 : (a = _.get(e, "metadata.name", ""), r = _.get(n, "metadata.name", ""), t ? r.localeCompare(a) : a.localeCompare(r));
});
}, i.prototype.sortByRevision = function(e) {
var t = this, n = function(e) {
var n = t.getRevision(e);
if (!n) return null;
var a = parseInt(n, 10);
return isNaN(a) ? null : a;
};
return _.toArray(e).sort(function(e, t) {
var a = n(e), r = n(t);
return a || r ? a ? r ? r - a : -1 : 1 : e.metadata.name.localeCompare(t.metadata.name);
});
}, i.prototype.setPaused = function(t, a, r) {
var o = angular.copy(t), i = e.objectToResourceGroupVersion(t);
return _.set(o, "spec.paused", a), n.update(i, t.metadata.name, o, r);
}, new i();
} ]), angular.module("openshiftConsole").factory("ImageStreamsService", function() {
return {
tagsByName: function(e) {
var t = {};
return angular.forEach(e.spec.tags, function(n) {
t[n.name] = t[n.name] || {}, t[n.name].name = n.name, t[n.name].spec = angular.copy(n);
var a = t[n.name].spec.from;
if (a) {
var r;
if ("ImageStreamImage" === a.kind ? r = "@" : "ImageStreamTag" === a.kind && (r = ":"), r) {
a._nameConnector = r;
var o = a.name.split(r);
1 === o.length ? (a._imageStreamName = e.metadata.name, a._idOrTag = o[0], a._completeName = a._imageStreamName + r + a._idOrTag) : (a._imageStreamName = o.shift(), a._idOrTag = o.join(r), a._completeName = a._imageStreamName + r + a._idOrTag);
}
}
}), angular.forEach(e.status.tags, function(e) {
t[e.tag] = t[e.tag] || {}, t[e.tag].name = e.tag, t[e.tag].status = angular.copy(e);
}), t;
}
};
}), angular.module("openshiftConsole").factory("MembershipService", [ "$filter", function(e) {
var t = e("annotation"), n = function() {
return _.reduce(_.slice(arguments), function(e, t, n) {
return t ? _.isEqual(n, 0) ? t : e + "-" + t : e;
}, "");
}, a = function() {
return {
User: {
kind: "User",
sortOrder: 1,
name: "User",
subjects: {}
},
Group: {
kind: "Group",
sortOrder: 2,
name: "Group",
subjects: {}
},
ServiceAccount: {
kind: "ServiceAccount",
sortOrder: 3,
description: "Service accounts provide a flexible way to control API access without sharing a regular user’s credentials.",
helpLinkKey: "service_accounts",
name: "ServiceAccount",
subjects: {}
},
SystemUser: {
kind: "SystemUser",
sortOrder: 4,
description: "System users are virtual users automatically provisioned by the system.",
helpLinkKey: "users_and_groups",
name: "SystemUser",
subjects: {}
},
SystemGroup: {
kind: "SystemGroup",
sortOrder: 5,
description: "System groups are virtual groups automatically provisioned by the system.",
helpLinkKey: "users_and_groups",
name: "SystemGroup",
subjects: {}
}
};
}, r = function(e) {
return _.reduce(e, function(e, t) {
return e[n(t.kind, t.metadata.name)] = t, e;
}, {});
};
return {
sortRoles: function(e) {
return _.sortBy(e, "metadata.name");
},
filterRoles: function(e) {
return _.filter(e, function(e) {
return "true" !== t(e, "systemOnly");
});
},
mapRolesForUI: function(e, t) {
return _.merge(r(e), r(t));
},
isLastRole: function(e, t) {
return 1 === _.filter(t, function(t) {
return _.some(t.subjects, {
name: e
});
}).length;
},
getSubjectKinds: a,
mapRolebindingsForUI: function(e, t) {
var a = _.reduce(e, function(e, a) {
var r = n(a.roleRef.namespace ? "Role" : "ClusterRole", a.roleRef.name);
return _.each(a.subjects, function(a) {
var o = n(a.namespace, a.name);
e[a.kind].subjects[o] || (e[a.kind].subjects[o] = {
name: a.name,
roles: {}
}, a.namespace && (e[a.kind].subjects[o].namespace = a.namespace)), _.includes(e[a.kind].subjects[o].roles, r) || t[r] && (e[a.kind].subjects[o].roles[r] = t[r]);
}), e;
}, {
User: {
kind: "User",
sortOrder: 1,
name: "User",
subjects: {}
},
Group: {
kind: "Group",
sortOrder: 2,
name: "Group",
subjects: {}
},
ServiceAccount: {
kind: "ServiceAccount",
sortOrder: 3,
description: "Service accounts provide a flexible way to control API access without sharing a regular user’s credentials.",
helpLinkKey: "service_accounts",
name: "ServiceAccount",
subjects: {}
},
SystemUser: {
kind: "SystemUser",
sortOrder: 4,
description: "System users are virtual users automatically provisioned by the system.",
helpLinkKey: "users_and_groups",
name: "SystemUser",
subjects: {}
},
SystemGroup: {
kind: "SystemGroup",
sortOrder: 5,
description: "System groups are virtual groups automatically provisioned by the system.",
helpLinkKey: "users_and_groups",
name: "SystemGroup",
subjects: {}
}
});
return _.sortBy(a, "sortOrder");
}
};
} ]), angular.module("openshiftConsole").factory("RolesService", [ "$q", "DataService", function(e, t) {
return {
listAllRoles: function(n) {
return e.all([ t.list("roles", n, null), t.list("clusterroles", {}, null) ]);
}
};
} ]), angular.module("openshiftConsole").factory("RoleBindingsService", [ "$q", "DataService", function(e, t) {
var n = {}, a = function(e, t) {
var r = t ? e + t : e;
return _.some(n, _.matchesProperty("metadata.name", r)) ? a(e, _.uniqueId()) : r;
}, r = function(e, t) {
var n = _.get(e, "metadata.name");
return {
kind: "RoleBinding",
apiVersion: "v1",
metadata: {
name: n ? a(n) : null,
namespace: t
},
roleRef: {
name: _.get(e, "metadata.name"),
namespace: _.get(e, "metadata.namespace")
},
subjects: []
};
}, o = function(e, t) {
return _.isEqual(e.kind, "ServiceAccount") ? e.namespace = e.namespace || t : (_.isEqual(e.kind, "SystemUser") || _.isEqual(e.kind, "SystemGroup")) && (_.startsWith(e.name, "system:") || (e.name = "system:" + e.name)), e;
}, i = function(e) {
e.userNames = null, e.groupNames = null;
};
return {
list: function(e, a, r) {
return t.list("rolebindings", e, function(e) {
n = e.by("metadata.name"), a(e);
}, r);
},
create: function(e, n, a, i) {
var s = r(e, a);
return n = o(n, a), s.subjects.push(angular.copy(n)), t.create("rolebindings", null, s, i);
},
addSubject: function(e, n, a, s) {
var c = r(), l = _.extend(c, e);
if (!n) return l;
if (n = o(n, a), _.isArray(l.subjects)) {
if (_.includes(l.subjects, n)) return;
l.subjects.push(n);
} else l.subjects = [ n ];
return i(l), t.update("rolebindings", l.metadata.name, l, s);
},
removeSubject: function(n, a, o, s) {
var c = _.filter(o, {
roleRef: {
name: a
}
});
return e.all(_.map(c, function(e) {
var a = r();
return e = _.extend(a, e), i(e), e.subjects = _.reject(e.subjects, {
name: n
}), e.subjects.length ? t.update("rolebindings", e.metadata.name, e, s) : t.delete("rolebindings", e.metadata.name, s).then(function() {
return e;
});
}));
}
};
} ]), angular.module("openshiftConsole").factory("MetricsService", [ "$filter", "$http", "$q", "$rootScope", "APIDiscovery", function(e, t, n, a, r) {
function o() {
return angular.isDefined(u) ? n.when(u) : r.getMetricsURL().then(function(e) {
return u = (e || "").replace(/\/$/, "");
});
}
function i(e) {
if (e.length) return _.each(e, function(e) {
e.empty || !_.isNumber(e.avg) ? e.value = null : e.value = e.avg;
}), e;
}
function s(e) {
return e.join("|");
}
function c() {
return o().then(function(e) {
return e ? e + "/m/stats/query" : e;
});
}
function l(e) {
return o().then(function(t) {
var n;
return n = "counter" === e.type ? t + f : t + m, URI.expand(n, {
podUID: e.pod.metadata.uid,
containerName: e.containerName,
metric: e.metric
}).toString();
});
}
var u, d, p, m = "/gauges/{containerName}%2F{podUID}%2F{metric}/data", f = "/counters/{containerName}%2F{podUID}%2F{metric}/data", g = function(e) {
var t = e.split("/");
return {
podUID: t[1],
descriptor: t[2] + "/" + t[3]
};
}, h = function(e, n, a) {
var r = _.keyBy(a.pods, "metadata.uid");
return t.post(e, n, {
auth: {},
headers: {
Accept: "application/json",
"Content-Type": "application/json",
"Hawkular-Tenant": a.namespace
}
}).then(function(e) {
var t = {}, n = function(e, n) {
var a = g(n), o = _.get(r, [ a.podUID, "metadata", "name" ]), s = i(e);
_.set(t, [ a.descriptor, o ], s);
};
return _.each(e.data.counter, n), _.each(e.data.gauge, n), t;
});
}, v = _.template("descriptor_name:network/tx_rate|network/rx_rate,type:pod,pod_id:<%= uid %>"), y = _.template("descriptor_name:memory/usage|cpu/usage_rate,type:pod_container,pod_id:<%= uid %>,container_name:<%= containerName %>"), b = _.template("descriptor_name:network/tx_rate|network/rx_rate|memory/usage|cpu/usage_rate,type:pod,pod_id:<%= uid %>");
return {
isAvailable: function(e) {
return o().then(function(n) {
return !!n && (!e || !!d || !p && t.get(n).then(function() {
return d = !0, !0;
}, function(e) {
return p = !0, a.$broadcast("metrics-connection-failed", {
url: n,
response: e
}), !1;
}));
});
},
getMetricsURL: o,
get: function(e) {
return l(e).then(function(n) {
if (!n) return null;
var a = {
bucketDuration: e.bucketDuration,
start: e.start
};
return e.end && (a.end = e.end), t.get(n, {
auth: {},
headers: {
Accept: "application/json",
"Hawkular-Tenant": e.namespace
},
params: a
}).then(function(t) {
return _.assign(t, {
metricID: e.metric,
data: i(t.data)
});
});
});
},
getCurrentUsage: function(e) {
return l(e).then(function(n) {
if (!n) return null;
var a = {
bucketDuration: "1mn",
start: "-1mn"
};
return t.get(n, {
auth: {},
headers: {
Accept: "application/json",
"Hawkular-Tenant": e.namespace
},
params: a
}).then(function(t) {
return _.assign(t, {
metricID: e.metric,
usage: _.head(i(t.data))
});
});
});
},
getPodMetrics: function(e) {
return c().then(function(t) {
var a = {
bucketDuration: e.bucketDuration,
start: e.start
};
e.end && (a.end = e.end);
var r = [], o = [], i = s(_.map(e.pods, "metadata.uid"));
return e.containerName ? (r.push(_.assign({
tags: y({
uid: i,
containerName: e.containerName
})
}, a)), r.push(_.assign({
tags: v({
uid: i
})
}, a))) : r.push(_.assign({
tags: b({
uid: i
})
}, a)), _.each(r, function(n) {
var a = h(t, n, e);
o.push(a);
}), n.all(o).then(function(e) {
var t = {};
return _.each(e, function(e) {
_.assign(t, e);
}), t;
});
});
},
getCustomMetrics: function(e) {
var n = e.metadata.namespace, a = e.metadata.uid;
return o().then(function(e) {
if (!e) return null;
var r = e + "/m", o = {
tags: "custom_metric:true,pod_id:" + a
};
return t.get(r, {
auth: {},
headers: {
Accept: "application/json",
"Hawkular-Tenant": n
},
params: o
}).then(function(e) {
return _.map(e.data, function(e) {
return {
id: e.id,
name: e.tags.metric_name,
unit: e.tags.units,
description: e.tags.description,
type: e.type
};
});
});
});
}
};
} ]), angular.module("openshiftConsole").factory("MetricsCharts", [ "$timeout", "ConversionService", function(e, t) {
var n = function(e, n) {
if (void 0 === e.value || null === e.value) return null;
switch (n) {
case "memory/usage":
return _.round(t.bytesToMiB(e.value), 2);

case "cpu/usage_rate":
return t.millicoresToCores(e.value);

case "network/rx_rate":
case "network/tx_rate":
return _.round(t.bytesToKiB(e.value), 2);

default:
return _.round(e.value);
}
}, a = {
"memory/usage": "Memory",
"cpu/usage_rate": "CPU",
"network/tx_rate": "Sent",
"network/rx_rate": "Received"
};
return {
uniqueID: function() {
return _.uniqueId("metrics-");
},
getDefaultUpdateInterval: function() {
return 6e4;
},
getTimeRangeOptions: function() {
return [ {
label: "Last hour",
value: 60
}, {
label: "Last 4 hours",
value: 240
}, {
label: "Last 12 hours",
value: 720
}, {
label: "Last day",
value: 1440
}, {
label: "Last 3 days",
value: 4320
}, {
label: "Last week",
value: 10080
} ];
},
getDefaultSparklineConfig: function(e, t, n) {
return {
bindto: "#" + e,
axis: {
x: {
show: !n,
type: "timeseries",
padding: {
left: 0,
bottom: 0
},
tick: {
type: "timeseries",
format: "%a %H:%M"
}
},
y: {
show: !n,
label: t,
min: 0,
padding: {
left: 0,
top: 20,
bottom: 0
}
}
},
point: {
show: !1
},
size: {
height: n ? 35 : 175
},
tooltip: {
format: {
value: function(e) {
var n = "cores" === t ? 3 : 2;
return d3.round(e, n) + " " + t;
}
}
}
};
},
getSparklineData: function(e) {
var t, r = {
type: "spline",
x: "dates",
names: a
}, o = {};
return _.each(e, function(e, a) {
t = [ "dates" ], o[a] = [ a ], _.each(e, function(e) {
var r = n(e, a);
t.push(e.start), o[a].push(r);
});
}), r.columns = [ t ].concat(_.values(o)), r;
},
formatUsage: function(e) {
return e < .001 ? "0" : e < 1 ? d3.format(".1r")(e) : d3.format(".2r")(e);
},
redraw: function(t) {
e(function() {
_.each(t, function(e) {
e.flush();
});
}, 0);
}
};
} ]), angular.module("openshiftConsole").factory("StorageService", [ "$filter", "APIService", "DataService", "NotificationsService", function(e, t, n, a) {
var r = e("getErrorDetails"), o = e("humanizeKind");
return {
createVolume: function(e, t) {
return {
name: e,
persistentVolumeClaim: {
claimName: t.metadata.name
}
};
},
createVolumeMount: function(e, t, n, a) {
var r = {
name: e,
mountPath: t,
readOnly: !!a
};
return n && (r.subPath = n), r;
},
getVolumeNames: function(e) {
var t = _.get(e, "spec.volumes", []);
return _.map(t, "name");
},
getMountPaths: function(e, t) {
var n = [], a = _.get(e, "spec.containers", []);
return _.each(a, function(e) {
if (!t || t(e)) {
var a = _.get(e, "volumeMounts", []);
_.each(a, function(e) {
n.push(e.mountPath);
});
}
}), n;
},
removeVolume: function(e, i, s) {
var c = angular.copy(e), l = _.get(c, "spec.template.spec.volumes");
_.remove(l, {
name: i.name
});
var u = _.get(c, "spec.template.spec.containers");
_.each(u, function(e) {
_.remove(e.volumeMounts, {
name: i.name
});
});
var d = t.objectToResourceGroupVersion(c);
return n.update(d, c.metadata.name, c, s).then(function() {
a.addNotification({
type: "success",
message: "Volume " + i.name + " removed from " + o(e.kind) + " " + e.metadata.name + "."
});
}, function(t) {
a.addNotification({
type: "error",
message: "An error occurred removing volume " + i.name + " from " + o(e.kind) + " " + e.metadata.name + ".",
details: r(t)
});
});
}
};
} ]), angular.module("openshiftConsole").factory("LimitRangesService", [ "$filter", "LIMIT_REQUEST_OVERRIDES", function(e, t) {
var n = e("usageValue"), a = e("usageWithUnits"), r = e("amountAndUnit"), o = function(e, t) {
return !!e && (!t || n(e) < n(t));
}, i = function(e, t) {
return !!e && (!t || n(e) > n(t));
}, s = function(n) {
if (!t) return !1;
var a = e("annotation")(n, "quota.openshift.io/cluster-resource-override-enabled");
return !a || "true" === a;
}, c = function(e, n) {
if (!s(n)) return null;
switch (e) {
case "cpu":
return t.cpuRequestToLimitPercent;

case "memory":
return t.memoryRequestToLimitPercent;

default:
return null;
}
}, l = function(e, t) {
return !!c(e, t);
}, u = function(e, n) {
return s(n) && "cpu" === e && !!t.limitCPUToMemoryPercent;
}, d = function(e, t, n, a) {
var s = {};
angular.forEach(e, function(e) {
angular.forEach(e.spec.limits, function(e) {
if (e.type === n) {
e.min && i(e.min[t], s.min) && (s.min = e.min[t]), e.max && o(e.max[t], s.max) && (s.max = e.max[t]), e.default && (s.defaultLimit = e.default[t] || s.defaultLimit), e.defaultRequest && (s.defaultRequest = e.defaultRequest[t] || s.defaultRequest);
var a;
e.maxLimitRequestRatio && (a = e.maxLimitRequestRatio[t]) && (!s.maxLimitRequestRatio || a < s.maxLimitRequestRatio) && (s.maxLimitRequestRatio = a);
}
});
});
var l, u, d, p;
return s.min && (l = c(t, a)) && (u = r(s.min), d = Math.ceil(u[0] / (l / 100)), p = u[1] || "", s.min = "" + d + p), s;
};
return {
getEffectiveLimitRange: d,
getRequestToLimitPercent: c,
isRequestCalculated: l,
isLimitCalculated: u,
validatePodLimits: function(t, r, o, i) {
if (!o || !o.length) return [];
var s = d(t, r, "Pod", i), c = d(t, r, "Container", i), p = 0, m = 0, f = s.min && n(s.min), g = s.max && n(s.max), h = [], v = e("computeResourceLabel")(r, !0);
return angular.forEach(o, function(e) {
var t = e.resources || {}, a = t.requests && t.requests[r] || c.defaultRequest;
a && (p += n(a));
var o = t.limits && t.limits[r] || c.defaultLimit;
o && (m += n(o));
}), l(r, i) || (f && p < f && h.push(v + " request total for all containers is less than pod minimum (" + a(s.min, r) + ")."), g && p > g && h.push(v + " request total for all containers is greater than pod maximum (" + a(s.max, r) + ").")), u(r, i) || (f && m < f && h.push(v + " limit total for all containers is less than pod minimum (" + a(s.min, r) + ")."), g && m > g && h.push(v + " limit total for all containers is greater than pod maximum (" + a(s.max, r) + ").")), h;
}
};
} ]), angular.module("openshiftConsole").factory("RoutesService", [ "$filter", function(e) {
var t = function(e) {
return angular.isString(e);
}, n = function(e, n) {
return _.find(n.spec.ports, function(n) {
return t(e) ? n.name === e : n.targetPort === e;
});
}, a = function(e, a, r, o) {
if ("Service" === a.kind) {
var i = _.get(r, [ a.name ]);
if (i) {
var s = e.spec.port ? e.spec.port.targetPort : null;
s ? n(s, i) || (t(s) ? o.push('Route target port is set to "' + s + '", but service "' + i.metadata.name + '" has no port with that name.') : o.push('Route target port is set to "' + s + '", but service "' + i.metadata.name + '" does not expose that port.')) : _.size(i.spec.ports) > 1 && o.push('Route has no target port, but service "' + i.metadata.name + '" has multiple ports. The route will round robin traffic across all exposed ports on the service.');
} else o.push('Routes to service "' + a.name + '", but service does not exist.');
}
}, r = function(e, t) {
e.spec.tls && (e.spec.tls.termination || t.push("Route has a TLS configuration, but no TLS termination type is specified. TLS will not be enabled until a termination type is set."), "passthrough" === e.spec.tls.termination && e.spec.path && t.push('Route path "' + e.spec.path + '" will be ignored since the route uses passthrough termination.'));
}, o = function(e, t) {
var n = _.get(e, "spec.wildcardPolicy");
angular.forEach(e.status.ingress, function(e) {
var a = _.find(e.conditions, {
type: "Admitted",
status: "False"
});
if (a) {
var r = "Requested host " + (e.host || "<unknown host>") + " was rejected by the router.";
(a.message || a.reason) && (r += " Reason: " + (a.message || a.reason) + "."), t.push(r);
}
a || "Subdomain" !== n || e.wildcardPolicy === n || t.push('Router "' + e.routerName + '" does not support wildcard subdomains. Your route will only be available at host ' + e.host + ".");
});
}, i = function(e) {
return _.some(e.status.ingress, function(e) {
return _.some(e.conditions, {
type: "Admitted",
status: "True"
});
});
}, s = e("annotation"), c = function(e) {
return "true" !== s(e, "openshift.io/host.generated");
}, l = function(e) {
var t = 0;
i(e) && (t += 11);
var n = _.get(e, "spec.alternateBackends");
return _.isEmpty(n) || (t += 5), c(e) && (t += 3), e.spec.tls && (t += 1), t;
}, u = function(e) {
var t = {}, n = function(e, n) {
t[n] = t[n] || [], t[n].push(e);
};
return _.each(e, function(e) {
n(e, e.spec.to.name);
var t = _.get(e, "spec.alternateBackends", []);
_.each(t, function(t) {
"Service" === t.kind && n(e, t.name);
});
}), t;
};
return {
getRouteWarnings: function(e, t) {
var n = [];
return e ? (a(e, e.spec.to, t, n), _.each(e.spec.alternateBackends, function(r) {
a(e, r, t, n);
}), r(e, n), o(e, n), n) : n;
},
getServicePortForRoute: n,
getPreferredDisplayRoute: function(e, t) {
var n = l(e);
return l(t) > n ? t : e;
},
groupByService: function(e, t) {
return t ? u(e) : _.groupBy(e, "spec.to.name");
},
getSubdomain: function(e) {
return _.get(e, "spec.host", "").replace(/^[a-z0-9]([-a-z0-9]*[a-z0-9])\./, "");
},
isCustomHost: c,
sortRoutesByScore: function(e) {
return _.orderBy(e, [ l ], [ "desc" ]);
}
};
} ]), angular.module("openshiftConsole").factory("ChartsService", [ "Logger", function(e) {
return {
updateDonutCenterText: function(t, n, a) {
var r = d3.select(t).select("text.c3-chart-arcs-title");
r ? (r.selectAll("*").remove(), r.insert("tspan").text(n).classed(a ? "donut-title-big-pf" : "donut-title-med-pf", !0).attr("dy", a ? 0 : 5).attr("x", 0), a && r.insert("tspan").text(a).classed("donut-title-small-pf", !0).attr("dy", 20).attr("x", 0)) : e.warn("Can't select donut title element");
}
};
} ]), angular.module("openshiftConsole").factory("HPAService", [ "$filter", "$q", "LimitRangesService", "MetricsService", "Logger", function(e, t, n, a, r) {
var o = function(e) {
return n.getRequestToLimitPercent("cpu", e);
}, i = function(e, t, n) {
return _.every(n, function(n) {
return _.get(n, [ "resources", t, e ]);
});
}, s = function(e, t) {
return i(e, "requests", t);
}, c = function(e, t) {
return i(e, "limits", t);
}, l = function(e, t, a, r) {
return !!n.getEffectiveLimitRange(a, e, "Container", r)[t];
}, u = function(e, t, n) {
return l(e, "defaultRequest", t, n);
}, d = function(e, t, n) {
return l(e, "defaultLimit", t, n);
}, p = function(e, t, a) {
return !(!s("cpu", e) && !u("cpu", t, a)) || (!(!c("cpu", e) && !d("cpu", t, e)) || !!n.isLimitCalculated("cpu", a) && (c("memory", e) || d("memory", t, a)));
}, m = e("humanizeKind"), f = e("hasDeploymentConfig");
return {
convertRequestPercentToLimit: function(e, t) {
var n = o(t);
if (!n) return r.warn("convertRequestPercentToLimit called, but no request/limit ratio defined."), NaN;
if (!e) return e;
var a = n / 100 * e;
return Math.round(a);
},
convertLimitPercentToRequest: function(e, t) {
var n = o(t);
if (!n) return r.warn("convertLimitPercentToRequest called, but no request/limit ratio defined."), NaN;
if (!e) return e;
var a = e / (n / 100);
return Math.round(a);
},
hasCPURequest: p,
filterHPA: function(e, t, n) {
return _.filter(e, function(e) {
return e.spec.scaleTargetRef.kind === t && e.spec.scaleTargetRef.name === n;
});
},
getHPAWarnings: function(e, r, o, i) {
return !e || _.isEmpty(r) ? t.when([]) : a.isAvailable().then(function(t) {
var a = [];
t || a.push({
message: "Metrics might not be configured by your cluster administrator. Metrics are required for autoscaling.",
reason: "MetricsNotAvailable"
});
var s, c, l = _.get(e, "spec.template.spec.containers", []);
return p(l, o, i) || (s = m(e.kind), n.isRequestCalculated("cpu", i) ? (c = "This " + s + " does not have any containers with a CPU limit set. Autoscaling will not work without a CPU limit.", n.isLimitCalculated("cpu", i) && (c += " The CPU limit will be automatically calculated from the container memory limit.")) : c = "This " + s + " does not have any containers with a CPU request set. Autoscaling will not work without a CPU request.", a.push({
message: c,
reason: "NoCPURequest"
})), _.size(r) > 1 && a.push({
message: "More than one autoscaler is scaling this resource. This is not recommended because they might compete with each other. Consider removing all but one autoscaler.",
reason: "MultipleHPA"
}), "ReplicationController" === e.kind && f(e) && _.some(r, function() {
return _.some(r, function(e) {
return "ReplicationController" === _.get(e, "spec.scaleTargetRef.kind");
});
}) && a.push({
message: "This deployment is scaled by both a deployment configuration and an autoscaler. This is not recommended because they might compete with each other.",
reason: "DeploymentHasHPA"
}), a;
});
},
groupHPAs: function(e) {
var t = {};
return _.each(e, function(e) {
var n = e.spec.scaleTargetRef.name, a = e.spec.scaleTargetRef.kind;
n && a && (_.has(t, [ a, n ]) || _.set(t, [ a, n ], []), t[a][n].push(e));
}), t;
}
};
} ]), angular.module("openshiftConsole").factory("PodsService", [ "OwnerReferencesService", function(e) {
return {
getImageIDs: function(e, t) {
var n = {}, a = /^.*sha256:/;
return _.each(e, function(e) {
var r, o = _.get(e, "status.containerStatuses", []), i = _.find(o, {
name: t
}), s = _.get(i, "imageID", "");
a.test(s) && (r = s.replace(a, ""), n[r] = !0);
}), _.keys(n);
},
generateDebugPod: function(e, t) {
var n = angular.copy(e), a = _.find(n.spec.containers, {
name: t
});
return a ? (n.metadata = {
name: e.metadata.name + "-debug",
annotations: {
"debug.openshift.io/source-container": t,
"debug.openshift.io/source-resource": "pods/" + e.metadata.name
},
labels: {}
}, n.spec.restartPolicy = "Never", delete n.spec.host, delete n.spec.nodeName, n.status = {}, delete a.readinessProbe, delete a.livenessProbe, a.command = [ "sleep" ], a.args = [ "3600" ], n.spec.containers = [ a ], n) : null;
},
groupByOwnerUID: function(t) {
return e.groupByControllerUID(t);
},
filterForOwner: function(t, n) {
return e.filterForController(t, n);
}
};
} ]), angular.module("openshiftConsole").service("CachedTemplateService", function() {
var e = null;
return {
setTemplate: function(t) {
e = t;
},
getTemplate: function() {
return e;
},
clearTemplate: function() {
e = null;
}
};
}).service("ProcessedTemplateService", function() {
var e = {
params: {
all: [],
generated: []
},
message: null
};
return {
setTemplateData: function(t, n, a) {
_.each(t, function(t) {
e.params.all.push({
name: t.name,
value: t.value
});
}), _.each(n, function(t) {
t.value || e.params.generated.push(t.name);
}), a && (e.message = a);
},
getTemplateData: function() {
return e;
},
clearTemplateData: function() {
e = {
params: {
all: [],
generated: []
},
message: null
};
}
};
}), angular.module("openshiftConsole").factory("SecretsService", function() {
var e = function(e) {
var t = {
auths: {}
}, n = JSON.parse(window.atob(e));
return _.each(n, function(e, n) {
t.auths[n] = {
username: e.username,
password: e.password,
email: e.email
};
}), t;
}, t = function(e) {
var t = {
auths: {}
}, n = JSON.parse(window.atob(e));
return _.each(n.auths, function(e, n) {
if (e.auth) {
var a = window.atob(e.auth).split(":");
t.auths[n] = {
username: a[0],
password: a[1],
email: e.email
};
} else t.auths[n] = e;
}), n.credsStore && (t.credsStore = n.credsStore), t;
};
return {
groupSecretsByType: function(e) {
var t = {
source: [],
image: [],
other: []
};
return _.each(e.by("metadata.name"), function(e) {
switch (e.type) {
case "kubernetes.io/basic-auth":
case "kubernetes.io/ssh-auth":
case "Opaque":
t.source.push(e);
break;

case "kubernetes.io/dockercfg":
case "kubernetes.io/dockerconfigjson":
t.image.push(e);
break;

default:
t.other.push(e);
}
}), t;
},
decodeSecretData: function(n) {
var a = {}, r = _.mapValues(n, function(n, r) {
var o;
switch (r) {
case ".dockercfg":
return e(n);

case ".dockerconfigjson":
return t(n);

default:
return o = window.atob(n), /[\x00-\x09\x0E-\x1F]/.test(o) ? (a[r] = !0, n) : o;
}
});
return r.$$nonprintable = a, r;
}
};
}), angular.module("openshiftConsole").factory("ServicesService", [ "$filter", "$q", "DataService", function(e, t, n) {
var a = "service.alpha.openshift.io/dependencies", r = e("annotation"), o = function(e) {
var t = r(e, a);
if (!t) return null;
try {
return JSON.parse(t);
} catch (e) {
return Logger.warn('Could not parse "service.alpha.openshift.io/dependencies" annotation', e), null;
}
}, i = function(e, t) {
t.length ? _.set(e, [ "metadata", "annotations", a ], JSON.stringify(t)) : _.has(e, [ "metadata", "annotations", a ]) && delete e.metadata.annotations[a];
};
return {
getDependentServices: function(e) {
var t, n = o(e);
if (!n) return [];
t = _.get(e, "metadata.namespace");
return _.chain(n).filter(function(e) {
return !(!e.name || e.kind && "Service" !== e.kind || e.namespace && e.namespace !== t);
}).map(function(e) {
return e.name;
}).value();
},
linkService: function(e, t) {
var a = angular.copy(e), r = o(a) || [];
return r.push({
name: t.metadata.name,
namespace: e.metadata.namespace === t.metadata.namespace ? "" : t.metadata.namespace,
kind: t.kind
}), i(a, r), n.update("services", a.metadata.name, a, {
namespace: a.metadata.namespace
});
},
removeServiceLink: function(e, a) {
var r = angular.copy(e), s = o(r) || [], c = _.reject(s, function(t) {
return t.kind === a.kind && (t.namespace || e.metadata.namespace) === a.metadata.namespace && t.name === a.metadata.name;
});
return c.length === s.length ? t.when(!0) : (i(r, c), n.update("services", r.metadata.name, r, {
namespace: r.metadata.namespace
}));
},
isInfrastructure: function(e) {
return "true" === r(e, "service.openshift.io/infrastructure");
}
};
} ]), angular.module("openshiftConsole").factory("ImagesService", [ "$filter", "ApplicationGenerator", "DataService", function(e, t, n) {
var a = function(e) {
return _.isArray(e) ? e : _.map(e, function(e, t) {
return {
name: t,
value: e
};
});
};
return {
findImage: function(e, t) {
var a = {
kind: "ImageStreamImport",
apiVersion: "v1",
metadata: {
name: "newapp",
namespace: t.namespace
},
spec: {
import: !1,
images: [ {
from: {
kind: "DockerImage",
name: e
}
} ]
},
status: {}
};
return n.create("imagestreamimports", null, a, t).then(function(e) {
return {
name: _.get(e, "spec.images[0].from.name"),
image: _.get(e, "status.images[0].image"),
tag: _.get(e, "status.images[0].tag"),
result: _.get(e, "status.images[0].status")
};
});
},
getVolumes: function(e) {
return _.get(e, "dockerImageMetadata.Config.Volumes");
},
runsAsRoot: function(e) {
var t = _.get(e, "dockerImageMetadata.Config.User");
return !t || "0" === t || "root" === t;
},
getResources: function(e) {
var n = [], r = {
"openshift.io/generated-by": "OpenShiftWebConsole"
}, o = a(e.env), i = [], s = [], c = 0;
if (_.forEach(e.volumes, function(t, n) {
c++;
var a = e.name + "-" + c;
i.push({
name: a,
emptyDir: {}
}), s.push({
name: a,
mountPath: n
});
}), !e.namespace) {
var l = {
kind: "ImageStream",
apiVersion: "v1",
metadata: {
name: e.name,
labels: e.labels
},
spec: {
tags: [ {
name: e.tag,
annotations: _.assign({
"openshift.io/imported-from": e.image
}, r),
from: {
kind: "DockerImage",
name: e.image
},
importPolicy: {}
} ]
}
};
n.push(l);
}
var u = _.assign({
deploymentconfig: e.name
}, e.labels), d = {
kind: "DeploymentConfig",
apiVersion: "v1",
metadata: {
name: e.name,
labels: e.labels,
annotations: r
},
spec: {
strategy: {
resources: {}
},
triggers: [ {
type: "ConfigChange"
}, {
type: "ImageChange",
imageChangeParams: {
automatic: !0,
containerNames: [ e.name ],
from: {
kind: "ImageStreamTag",
name: (e.namespace ? e.image : e.name) + ":" + e.tag,
namespace: e.namespace
}
}
} ],
replicas: 1,
test: !1,
selector: u,
template: {
metadata: {
labels: u,
annotations: r
},
spec: {
volumes: i,
containers: [ {
name: e.name,
image: e.image,
ports: e.ports,
env: o,
volumeMounts: s
} ],
resources: {}
}
}
},
status: {}
};
n.push(d);
var p;
return _.isEmpty(e.ports) || (p = {
kind: "Service",
apiVersion: "v1",
metadata: {
name: e.name,
labels: e.labels,
annotations: r
},
spec: {
selector: {
deploymentconfig: e.name
},
ports: _.map(e.ports, function(e) {
return t.getServicePort(e);
})
}
}, n.push(p)), n;
},
getEnvironment: function(e) {
return _.map(_.get(e, "image.dockerImageMetadata.Config.Env"), function(e) {
var t = e.indexOf("="), n = "", a = "";
return t > 0 ? (n = e.substring(0, t), t + 1 < _.size(e) && (a = e.substring(t + 1))) : n = e, {
name: n,
value: a
};
});
}
};
} ]), angular.module("openshiftConsole").factory("ConversionService", function() {
return {
bytesToMiB: function(e) {
return e ? e / 1048576 : e;
},
bytesToKiB: function(e) {
return e ? e / 1024 : e;
},
millicoresToCores: function(e) {
return e ? e / 1e3 : e;
}
};
}), angular.module("openshiftConsole").service("BreadcrumbsService", [ "$filter", "APIService", "Navigate", function(e, t, n) {
var a = e("annotation"), r = e("displayName"), o = function(e) {
switch (e) {
case "DeploymentConfig":
return "Deployments";

default:
return _.startCase(t.kindToResource(e, !0));
}
}, i = function(e, a, i, s) {
var c, l = [], u = s.humanizedKind || o(a);
return s.includeProject && (c = s.project ? r(s.project) : i, l.push({
title: c,
link: n.projectOverviewURL(i)
})), l.push({
title: u,
link: n.resourceListURL(t.kindToResource(a), i)
}), s.parent && l.push(s.parent), s.subpage ? (l.push({
title: s.displayName || e,
link: n.resourceURL(e, a, i)
}), l.push({
title: s.subpage
})) : l.push({
title: s.displayName || e
}), l;
}, s = function(t, r) {
r = r || {};
var o, s = a(t, "deploymentConfig");
return s && (r.humanizedKind = "Deployments", r.parent = {
title: s,
link: n.configURLForResource(t)
}, (o = e("annotation")(t, "deploymentVersion")) && (r.displayName = "#" + o)), i(t.metadata.name, t.kind, t.metadata.namespace, r);
}, c = function(e, t) {
switch (e.kind) {
case "ReplicationController":
return s(e, t);

default:
return i(e.metadata.name, e.kind, e.metadata.namespace, t);
}
};
return {
getBreadcrumbs: function(e) {
return (e = e || {}).object ? c(e.object, e) : e.kind && e.name && e.namespace ? i(e.name, e.kind, e.namespace, e) : [];
}
};
} ]), angular.module("openshiftConsole").factory("QuotaService", [ "APIService", "$filter", "$location", "$rootScope", "$routeParams", "$q", "Constants", "DataService", "EventsService", "Logger", "NotificationsService", function(e, t, n, a, r, o, i, s, c, l, u) {
var d = t("isNil"), p = t("usageValue"), m = t("usageWithUnits"), f = t("percent"), g = function(e) {
return _.every(e.spec.containers, function(e) {
var t = _.some(_.get(e, "resources.requests"), function(e) {
return !d(e) && 0 !== p(e);
}), n = _.some(_.get(e, "resources.limits"), function(e) {
return !d(e) && 0 !== p(e);
});
return !t && !n;
});
}, h = function(e) {
return _.has(e, "spec.activeDeadlineSeconds");
}, v = function(e, t) {
var n = g(e), a = h(e);
return _.filter(t, function(e) {
var t = e.spec.quota ? e.spec.quota.scopes : e.spec.scopes;
return _.every(t, function(e) {
switch (e) {
case "Terminating":
return a;

case "NotTerminating":
return !a;

case "BestEffort":
return n;

case "NotBestEffort":
return !n;
}
return !0;
});
});
}, y = function(e, t) {
return e ? "Pod" === e.kind ? v(e, t) : _.has(e, "spec.template") ? v(e.spec.template, t) : t : t;
}, b = t("humanizeQuotaResource"), C = t("humanizeKind"), S = function(e, t, n) {
var a = e.status.total || e.status;
if (p(a.hard[n]) <= p(a.used[n])) {
var r, o;
return r = "Pod" === t.kind ? "You will not be able to create the " + C(t.kind) + " '" + t.metadata.name + "'." : "You can still create " + C(t.kind) + " '" + t.metadata.name + "' but no pods will be created until resources are freed.", o = "pods" === n ? "You are at your quota for pods." : "You are at your quota for " + b(n) + " on pods.", {
type: "Pod" === t.kind ? "error" : "warning",
message: o,
details: r,
links: [ {
href: "project/" + e.metadata.namespace + "/quota",
label: "View Quota",
target: "_blank"
} ]
};
}
return null;
}, w = {
cpu: "resources.requests.cpu",
"requests.cpu": "resources.requests.cpu",
"limits.cpu": "resources.limits.cpu",
memory: "resources.requests.memory",
"requests.memory": "resources.requests.memory",
"limits.memory": "resources.limits.memory",
persistentvolumeclaims: "resources.limits.persistentvolumeclaims",
"requests.storage": "resources.request.storage"
}, k = function(e, t, n, a) {
var r = e.status.total || e.status, o = w[a], i = 0;
if (_.each(n.spec.containers, function(e) {
var t = _.get(e, o);
t && (i += p(t));
}), p(r.hard[a]) < p(r.used[a]) + i) {
var s;
return s = "Pod" === t.kind ? "You may not be able to create the " + C(t.kind) + " '" + t.metadata.name + "'." : "You can still create " + C(t.kind) + " '" + t.metadata.name + "' but you may not have pods created until resources are freed.", {
type: "warning",
message: "You are close to your quota for " + b(a) + " on pods.",
details: s,
links: [ {
href: "project/" + e.metadata.namespace + "/quota",
label: "View Quota",
target: "_blank"
} ]
};
}
}, j = function(e, t) {
var n = [], a = "Pod" === e.kind ? e : _.get(e, "spec.template");
return a ? (_.each([ "cpu", "memory", "requests.cpu", "requests.memory", "limits.cpu", "limits.memory", "pods" ], function(r) {
var o = t.status.total || t.status;
if (("Pod" !== e.kind || "pods" !== r) && !d(o.hard[r])) {
var i = S(t, e, r);
if (i) n.push(i); else if ("pods" !== r) {
var s = k(t, e, a, r);
s && n.push(s);
}
}
}), n) : n;
}, P = function(t, n, a) {
var r = [];
return t && n ? (_.each(t, function(t) {
var o = y(t, n), i = y(t, a), s = e.objectToResourceGroupVersion(t);
if (s) {
var c = e.kindToResource(t.kind, !0), l = C(t.kind), u = "";
s.group && (u = s.group + "/"), u += s.resource;
var m = function(e) {
var n = e.status.total || e.status;
!d(n.hard[u]) && p(n.hard[u]) <= p(n.used[u]) && r.push({
type: "error",
message: "You are at your quota of " + n.hard[u] + " " + ("1" === n.hard[u] ? l : c) + " in this project.",
details: "You will not be able to create the " + l + " '" + t.metadata.name + "'.",
links: [ {
href: "project/" + e.metadata.namespace + "/quota",
label: "View Quota",
target: "_blank"
} ]
}), r = r.concat(j(t, e));
};
_.each(o, m), _.each(i, m);
}
}), r) : r;
}, R = [ "cpu", "requests.cpu", "memory", "requests.memory", "limits.cpu", "limits.memory" ], I = function(e, t, n, a, r) {
var o, s = "Your project is " + (a < t ? "over" : "at") + " quota. ";
return o = _.includes(R, r) ? s + "It is using " + f(t / a, 0) + " of " + m(n, r) + " " + b(r) + "." : s + "It is using " + t + " of " + a + " " + b(r) + ".", o = _.escape(o), i.QUOTA_NOTIFICATION_MESSAGE && i.QUOTA_NOTIFICATION_MESSAGE[r] && (o += " " + i.QUOTA_NOTIFICATION_MESSAGE[r]), o;
}, T = function(e, t, n) {
var a = function(e) {
var t = e.status.total || e.status;
return _.some(t.hard, function(e, a) {
if ("resourcequotas" === a) return !1;
if (!n || _.includes(n, a)) {
if (!(e = p(e))) return !1;
var r = p(_.get(t, [ "used", a ]));
return !!r && e <= r;
}
});
};
return _.some(e, a) || _.some(t, a);
};
return {
filterQuotasForResource: y,
isBestEffortPod: g,
isTerminatingPod: h,
getResourceLimitAlerts: j,
getQuotaAlerts: P,
getLatestQuotaAlerts: function(e, t) {
var n, a, r = [];
return r.push(s.list("resourcequotas", t).then(function(e) {
n = e.by("metadata.name"), l.log("quotas", n);
})), r.push(s.list("appliedclusterresourcequotas", t).then(function(e) {
a = e.by("metadata.name"), l.log("cluster quotas", a);
})), o.all(r).then(function() {
return {
quotaAlerts: P(e, n, a)
};
});
},
isAnyQuotaExceeded: T,
isAnyStorageQuotaExceeded: function(e, t) {
return T(e, t, [ "requests.storage", "persistentvolumeclaims" ]);
},
willRequestExceedQuota: function(e, t, n, a) {
var r = function(e) {
var t = e.status.total || e.status, r = p(a);
if (!n) return !1;
var o = _.get(t.hard, n);
if (!(o = p(o))) return !1;
var i = p(_.get(t, [ "used", n ]));
return i ? o < i + r : o < r;
};
return _.some(e, r) || _.some(t, r);
},
getQuotaNotifications: function(e, t, o) {
var i = [], s = function(e) {
var t = e.status.total || e.status;
_.each(t.hard, function(e, s) {
var c = p(e), l = _.get(t, [ "used", s ]), d = p(l);
"resourcequotas" !== s && c && d && c <= d && i.push({
id: "quota-limit-reached-" + s,
namespace: o,
type: c < d ? "warning" : "info",
message: I(0, d, e, c, s),
isHTML: !0,
skipToast: !0,
showInDrawer: !0,
actions: [ {
name: "View Quotas",
title: "View project quotas",
onClick: function() {
n.url("/project/" + r.project + "/quota"), a.$emit("NotificationDrawerWrapper.hide");
}
}, {
name: "Don't Show Me Again",
title: "Permenantly hide this notificaiton until quota limit changes",
onClick: function(e) {
u.permanentlyHideNotification(e.uid, e.namespace), a.$emit("NotificationDrawerWrapper.clear", e);
}
}, {
name: "Clear",
title: "Clear this notificaiton",
onClick: function(e) {
a.$emit("NotificationDrawerWrapper.clear", e);
}
} ]
});
});
};
return _.each(e, s), _.each(t, s), i;
}
};
} ]), angular.module("openshiftConsole").factory("SecurityCheckService", [ "APIService", "$filter", "Constants", function(e, t, n) {
var a = t("humanizeKind");
return {
getSecurityAlerts: function(t, r) {
var o = [], i = [], s = [], c = [], l = [], u = [];
if (_.each(t, function(t) {
if (_.get(t, "kind")) {
var a = e.objectToResourceGroupVersion(t), r = e.apiInfo(a);
if (r) if (r.namespaced) if ("rolebindings" !== a.resource || "" !== a.group && "rbac.authorization.k8s.io" !== a.group) "roles" !== a.resource || "" !== a.group && "rbac.authorization.k8s.io" !== a.group ? _.find(n.SECURITY_CHECK_WHITELIST, {
resource: a.resource,
group: a.group
}) || u.push(t) : l.push(t); else {
var o = _.get(t, "roleRef.name");
"view" !== o && "system:image-puller" !== o && c.push(t);
} else s.push(t); else i.push(t);
}
}), i.length) {
var d = _.uniq(_.map(i, function(e) {
return "API version " + _.get(e, "apiVersion", "<none>") + " for kind " + a(e.kind);
}));
o.push({
type: "warning",
message: "Some resources will not be created.",
details: "The following resource versions are not supported by the server: " + d.join(", ")
});
}
if (s.length) {
var p = _.uniq(_.map(s, function(e) {
return a(e.kind);
}));
o.push({
type: "warning",
message: "This will create resources outside of the project, which might impact all users of the cluster.",
details: "Typically only cluster administrators can create these resources. The cluster-level resources being created are: " + p.join(", ")
});
}
if (c.length) {
var m = [];
_.each(c, function(e) {
_.each(e.subjects, function(e) {
var t = a(e.kind) + " ";
"ServiceAccount" === e.kind && (t += (e.namespace || r) + "/"), t += e.name, m.push(t);
});
}), m = _.uniq(m), o.push({
type: "warning",
message: "This will grant permissions to your project.",
details: "Permissions are being granted to: " + m.join(", ")
});
}
if (l.length && o.push({
type: "info",
message: "This will create additional membership roles within the project.",
details: "Admins will be able to grant these custom roles to users, groups, and service accounts."
}), u.length) {
var f = _.uniq(_.map(u, function(e) {
return a(e.kind);
}));
o.push({
type: "warning",
message: "This will create resources that may have security or project behavior implications.",
details: "Make sure you understand what they do before creating them. The resources being created are: " + f.join(", ")
});
}
return o;
}
};
} ]), angular.module("openshiftConsole").factory("LabelsService", function() {
var e = function(e) {
return _.get(e, "spec.template", {
metadata: {
labels: {}
}
});
};
return {
groupBySelector: function(t, n, a) {
var r = {}, o = {};
return a = a || {}, _.each(n, function(e) {
o[e.metadata.uid] = new LabelSelector(e.spec.selector);
}), _.each(t, function(t) {
if (!a.include || a.include(t)) {
var i = _.filter(n, function(n) {
var r = o[n.metadata.uid];
return a.matchTemplate ? r.matches(e(t)) : a.matchSelector ? r.covers(new LabelSelector(t.spec.selector)) : r.matches(t);
});
i.length || _.set(r, [ "", t.metadata.name ], t), _.each(i, function(e) {
var n = _.get(e, a.key || "metadata.name", "");
_.set(r, [ n, t.metadata.name ], t);
});
}
}), r;
}
};
}), angular.module("openshiftConsole").factory("CatalogService", [ "$filter", "APIService", "Constants", "KeywordService", function(e, t, n, a) {
var r = e("tags"), o = !n.SERVICE_CATALOG_ENABLED && t.apiInfo({
group: "servicecatalog.k8s.io",
resource: "serviceclasses"
}) && t.apiInfo({
group: "servicecatalog.k8s.io",
resource: "serviceinstances"
}) && t.apiInfo({
group: "servicecatalog.k8s.io",
resource: "serviceinstancecredentials"
}), i = {};
_.each(n.CATALOG_CATEGORIES, function(e) {
_.each(e.items, function(e) {
i[e.id] = e;
var t = _.get(e, "subcategories", []);
_.each(t, function(e) {
_.each(e.items, function(e) {
i[e.id] = e;
});
});
});
});
var s = function(e, t) {
e = e.toLowerCase();
var n;
for (n = 0; n < t.length; n++) if (e === t[n].toLowerCase()) return !0;
return !1;
}, c = function(e, t) {
var n = _.get(e, "categoryAliases", []), a = [ e.id ].concat(n);
return _.some(a, function(e) {
return s(e, t);
});
}, l = function(e) {
return e.from && "ImageStreamTag" === e.from.kind && -1 === e.from.name.indexOf(":") && !e.from.namespace;
}, u = e("displayName"), d = [ "metadata.name", 'metadata.annotations["openshift.io/display-name"]', "metadata.annotations.description" ];
return {
SERVICE_CATALOG_ENABLED: o,
getCategoryItem: function(e) {
return i[e];
},
categorizeImageStreams: function(e) {
var t = {};
return _.each(e, function(e) {
if (e.status) {
var n = {};
e.spec && e.spec.tags && _.each(e.spec.tags, function(e) {
var t = _.get(e, "annotations.tags");
t && (n[e.name] = t.split(/\s*,\s*/));
});
var a = !1;
_.each(i, function(r) {
(function(e) {
return _.some(e.status.tags, function(e) {
var t = n[e.tag] || [];
return c(r, t) && s("builder", t) && !s("hidden", t);
});
})(e) && (t[r.id] = t[r.id] || [], t[r.id].push(e), a = !0);
}), a || _.some(e.status.tags, function(e) {
var t = n[e.tag] || [];
return s("builder", t) && !s("hidden", t);
}) && (t[""] = t[""] || [], t[""].push(e));
}
}), t;
},
categorizeTemplates: function(e) {
var t = {};
return _.each(e, function(e) {
var n = r(e), a = !1;
_.each(i, function(r) {
c(r, n) && (t[r.id] = t[r.id] || [], t[r.id].push(e), a = !0);
}), a || (t[""] = t[""] || [], t[""].push(e));
}), t;
},
referencesSameImageStream: l,
filterImageStreams: function(e, t) {
if (!t.length) return e;
var n = [];
return _.each(e, function(e) {
var a = _.get(e, "metadata.name", ""), r = u(e, !0), o = [], i = {}, s = {};
_.each(e.spec.tags, function(e) {
if (l(e)) return i[e.name] = e.from.name, s[e.from.name] = s[e.from.name] || [], void s[e.from.name].push(e.name);
o.push(e);
});
var c = _.keyBy(o, "name");
_.each(t, function(e) {
e.test(a) || r && e.test(r) || _.each(o, function(t) {
var n = _.get(t, "annotations.tags", "");
if (/\bbuilder\b/.test(n) && !/\bhidden\b/.test(n)) {
if (!e.test(t.name) && !_.some(s[t.name], function(t) {
return e.test(t);
})) {
var a = _.get(t, "annotations.description");
a && e.test(a) || delete c[t.name];
}
} else delete c[t.name];
});
});
var d;
_.isEmpty(c) || ((d = angular.copy(e)).status.tags = _.filter(d.status.tags, function(e) {
var t = i[e.tag];
return t ? c[t] : c[e.tag];
}), n.push(d));
}), n;
},
filterTemplates: function(e, t) {
return a.filterForKeywords(e, d, t);
}
};
} ]), angular.module("openshiftConsole").factory("ModalsService", [ "$uibModal", function(e) {
return {
confirm: function(t) {
return e.open({
animation: !0,
templateUrl: "views/modals/confirm.html",
controller: "ConfirmModalController",
resolve: {
modalConfig: t
}
}).result;
},
confirmSaveLog: function(t) {
return e.open({
animation: !0,
templateUrl: "views/modals/confirm-save-log.html",
controller: "ConfirmSaveLogController",
resolve: {
object: t
}
}).result;
},
showJenkinsfileExamples: function() {
e.open({
animation: !0,
templateUrl: "views/modals/jenkinsfile-examples-modal.html",
controller: "JenkinsfileExamplesModalController",
size: "lg"
});
},
showComputeUnitsHelp: function() {
e.open({
animation: !0,
templateUrl: "views/modals/about-compute-units-modal.html",
controller: "AboutComputeUnitsModalController"
});
}
};
} ]), angular.module("openshiftConsole").factory("CLIHelp", [ "$filter", function(e) {
var t = e("annotation");
return {
getLogsCommand: function(e, n) {
if (!e) return null;
var a, r, o;
switch (e.kind) {
case "Pod":
a = "oc logs " + e.metadata.name, n && (a += " -c " + n);
break;

case "DeploymentConfig":
a = "oc logs dc/" + e.metadata.name;
break;

case "ReplicationController":
r = t(e, "deploymentConfig"), o = t(e, "deploymentVersion"), a = r && o ? "oc logs --version " + o + " dc/" + r : "oc logs rc/" + e.metadata.name;
break;

case "BuildConfig":
a = "oc logs bc/" + e.metadata.name;
break;

case "Build":
r = t(e, "buildConfig"), a = "oc logs --version " + (o = t(e, "buildNumber")) + " bc/" + r;
break;

default:
return null;
}
return a += " -n " + e.metadata.namespace;
}
};
} ]), angular.module("openshiftConsole").factory("EnvironmentService", [ "$filter", "keyValueEditorUtils", function(e, t) {
var n = function(e) {
return "Pod" === e.kind ? _.get(e, "spec.containers", []) : _.get(e, "spec.template.spec.containers", []);
};
return {
getContainers: n,
normalize: function(e) {
var t = n(e);
_.each(t, function(e) {
e.env = e.env || [];
});
},
compact: function(e) {
var a = n(e);
_.each(a, function(e) {
e.env = t.compactEntries(e.env);
});
},
copyAndNormalize: function(e) {
var t = angular.copy(e);
return this.normalize(t), t;
},
isEnvironmentEqual: function(e, t) {
var a = n(e), r = n(t);
if (a.length !== r.length) return !1;
var o, i, s;
for (o = 0; o < a.length; o++) {
if (a[o].name !== r[o].name) return !1;
if (i = a[o].env || [], s = r[o].env || [], !_.isEqual(i, s)) return !1;
}
return !0;
},
mergeEdits: function(e, t) {
var a, r = angular.copy(t), o = n(e), i = n(r);
for (a = 0; a < i.length; a++) i[a].env = _.get(o, [ a, "env" ], []);
return r;
}
};
} ]), angular.module("openshiftConsole").provider("keyValueEditorConfig", [ function() {
var e = {
keyMinlength: "",
keyMaxlength: "",
valueMinlength: "",
valueMaxlength: "",
keyValidator: "[a-zA-Z0-9-_]+",
valueValidator: "",
keyValidatorError: "Validation error",
keyValidatorErrorTooltip: void 0,
keyValidatorErrorTooltipIcon: "pficon pficon-help",
valueValidatorError: "Validation error",
valueValidatorErrorTooltip: void 0,
valueValidatorErrorTooltipIcon: "pficon pficon-help",
keyPlaceholder: "",
valuePlaceholder: "",
keyRequiredError: "Key is required"
};
this.set = function(t, n) {
angular.isObject(t) ? angular.extend(e, t) : e[t] = n;
}, this.$get = [ function() {
return e;
} ];
} ]), angular.module("openshiftConsole").factory("keyValueEditorUtils", [ "$timeout", "$window", function(e, t) {
var n = function() {
return {
name: "",
value: ""
};
}, a = [ "apiObj", "cannotDelete", "isReadonly", "isReadonlyKey", "isReadonlyValue", "keyValidator", "keyValidatorError", "keyValidatorErrorTooltip", "keyValidatorErrorTooltipIcon", "refType", "selected", "selectedValueFrom", "selectedValueFromKey", "valueValidatorError", "valueIcon", "valueIconTooltip", "valueAlt", "valueValidator", "valueValidatorErrorTooltip", "valueValidatorErrorTooltipIcon" ], r = function(e) {
return _.each(a, function(t) {
e[t] = void 0, delete e[t];
}), e;
}, o = function(e) {
return _.compact(_.map(e, function(e) {
return (e = r(e)).name || e.value || e.valueFrom ? e : void 0;
}));
}, i = function(e, t) {
return {
object: _.find(t, function(t) {
return "ConfigMap" === t.kind && t.metadata.name === e.valueFrom.configMapKeyRef.name;
}),
key: e.valueFrom.configMapKeyRef.key
};
}, s = function(e, t) {
return {
object: _.find(t, function(t) {
return "Secret" === t.kind && t.metadata.name === e.valueFrom.secretKeyRef.name;
}),
key: e.valueFrom.secretKeyRef.key
};
}, c = function(e, t) {
var n = null;
return e.valueFrom.configMapKeyRef ? n = i(e, t) : e.valueFrom.secretKeyRef && (n = s(e, t)), n;
};
return {
newEntry: n,
addEntry: function(e, t) {
e && e.push(t || {
name: "",
value: ""
});
},
addEntryWithSelectors: function(e) {
e && e.push({
name: "",
selectedValueFrom: null,
selectedValueFromKey: null,
valueFrom: {}
});
},
altTextForValueFrom: function(e, t) {
if (!e.value && e.valueFrom) {
e.valueIcon = "pficon pficon-help", e.valueIconTooltip = "This is a referenced value that will be generated when a container is created.  On running pods you can check the resolved values by going to the Terminal tab and echoing the environment variable.";
var n = {
config: "configMapKeyRef",
secret: "secretKeyRef",
field: "fieldRef"
};
e.valueFrom[n.config] ? (e.apiObj = {
kind: "ConfigMap",
metadata: {
name: e.valueFrom[n.config].name,
namespace: t
}
}, e.refType = n.config) : e.valueFrom[n.secret] ? (e.apiObj = {
kind: "Secret",
metadata: {
name: e.valueFrom[n.secret].name,
namespace: t
}
}, e.refType = n.secret, e.valueIcon = "fa fa-user-secret") : e.valueFrom[n.field] ? (e.isReadonlyValue = !0, e.refType = n.field, e.valueAlt = "Set to the field " + e.valueFrom.fieldRef.fieldPath + " in current object") : (e.isReadonlyValue = !0, e.valueAlt = "Set to a reference on a " + _.head(_.keys(e.valueFrom)));
}
},
setEntryPerms: function(e, t, n) {
e.valueFrom && (e.valueFrom.configMapKeyRef && (n || (e.isReadonlyValue = !0)), e.valueFrom.secretKeyRef && (t || (e.isReadonlyValue = !0)));
},
cleanEntry: r,
cleanEntries: function(e) {
return _.map(e, r);
},
compactEntries: o,
mapEntries: function(e) {
return Logger.log("DEPRECATED: mapEntries() drops valueFrom from the entry."), _.reduce(o(e), function(e, t) {
return e[t.name] = t.value, e;
}, {});
},
setFocusOn: function(n, a) {
e(function() {
var e = _.head(t.document.querySelectorAll(n));
e && (e.focus(), a && (e.value = "", e.value = a));
}, 25);
},
uniqueForKey: function(e, t) {
return "key-value-editor-key-" + e + "-" + t;
},
uniqueForValue: function(e, t) {
return "key-value-editor-value-" + e + "-" + t;
},
findReferenceValue: c,
findReferenceValueForEntries: function(e, t) {
_.each(e, function(e) {
var n;
e.valueFrom && (n = c(e, t)) && (_.set(e, "selectedValueFrom", n.object), _.set(e, "selectedValueFromKey", n.key));
});
}
};
} ]), angular.module("openshiftConsole").factory("FullscreenService", [ "IS_SAFARI", function(e) {
var t = document.documentElement.requestFullScreen || document.documentElement.webkitRequestFullScreen || document.documentElement.mozRequestFullScreen || document.documentElement.msRequestFullscreen, n = function(e) {
if (!e || !_.isString(e)) return e;
var t = $(e);
return t.length ? t[0] : null;
};
return {
hasFullscreen: function(n) {
return (!n || !e) && !!t;
},
requestFullscreen: function(e) {
t && (e = n(e)) && t.call(e);
},
exitFullscreen: function() {
document.exitFullscreen ? document.exitFullscreen() : document.mozCancelFullScreen ? document.mozCancelFullScreen() : document.webkitExitFullscreen ? document.webkitExitFullscreen() : document.msExitFullscreen && document.msExitFullscreen();
}
};
} ]), angular.module("openshiftConsole").factory("AppsService", function() {
var e = function(e) {
return _.get(e, "metadata.labels.app", "");
}, t = function(e, t) {
return e || t ? e ? t ? e.toLowerCase().localeCompare(t.toLowerCase()) : -1 : 1 : 0;
};
return {
groupByApp: function(t, n) {
var a = _.groupBy(t, e);
return n && _.mapValues(a, function(e) {
return _.sortBy(e, n);
}), a;
},
sortAppNames: function(e) {
e.sort(t);
}
};
}), angular.module("openshiftConsole").factory("ResourceAlertsService", [ "$filter", "AlertMessageService", "DeploymentsService", "Navigate", "NotificationsService", "QuotaService", function(e, t, n, a, r, o) {
var i = e("annotation"), s = e("humanizeKind"), c = e("deploymentStatus"), l = e("groupedPodWarnings"), u = function(e, t, n, a) {
e[t + "-" + n.reason] = {
type: a,
message: n.message
};
};
return {
getPodAlerts: function(e, n) {
if (_.isEmpty(e)) return {};
var r = {}, o = l(e);
return _.each(o, function(e, o) {
var i = _.head(e);
if (i) {
var s = "pod_warning" + o, c = {
type: i.severity || "warning",
message: i.message
};
switch (i.reason) {
case "Looping":
case "NonZeroExit":
var l = a.resourceURL(i.pod, "Pod", n), u = URI(l).addSearch({
tab: "logs",
container: i.container
}).toString();
c.links = [ {
href: u,
label: "View Log"
} ];
break;

case "NonZeroExitTerminatingPod":
if (t.isAlertPermanentlyHidden(s, n)) return;
c.links = [ {
href: "",
label: "Don't Show Me Again",
onClick: function() {
return t.permanentlyHideAlert(s, n), !0;
}
} ];
}
r[s] = c;
}
}), r;
},
getDeploymentStatusAlerts: function(e, t) {
if (!e || !t) return {};
var n, r = {}, o = _.get(e, "metadata.name"), s = c(t), l = i(t, "deploymentVersion"), u = l ? o + " #" + l : t.metadata.name, d = a.resourceURL(t);
switch (s) {
case "Cancelled":
r[t.metadata.uid + "-cancelled"] = {
type: "info",
message: "Deployment " + u + " was cancelled.",
links: [ {
href: d,
label: "View Deployment"
} ]
};
break;

case "Failed":
n = URI(d).addSearch({
tab: "logs"
}).toString(), r[t.metadata.uid + "-failed"] = {
type: "error",
message: "Deployment " + u + " failed.",
reason: i(t, "openshift.io/deployment.status-reason"),
links: [ {
href: n,
label: "View Log"
}, {
href: "project/" + t.metadata.namespace + "/browse/events",
label: "View Events"
} ]
};
}
return r;
},
getPausedDeploymentAlerts: function(t) {
var a = {};
return _.get(t, "spec.paused") && (a[t.metadata.uid + "-paused"] = {
type: "info",
message: t.metadata.name + " is paused.",
details: "This will stop any new rollouts or triggers from running until resumed.",
links: [ {
href: "",
label: "Resume Rollouts",
onClick: function() {
n.setPaused(t, !1, {
namespace: t.metadata.namespace
}).then(_.noop, function(n) {
a[t.metadata.uid + "-pause-error"] = {
type: "error",
message: "An error occurred resuming the " + s(t.kind) + ".",
details: e("getErrorDetails")(n)
};
});
}
} ]
}), a;
},
getServiceInstanceAlerts: function(e) {
var t = {};
if (!e) return t;
var n = e.metadata.uid, a = _.find(e.status.conditions, {
reason: "ErrorFindingNamespaceForInstance"
}), r = _.find(e.status.conditions, {
reason: "ProvisionFailed"
}), o = _.find(e.status.conditions, {
reason: "DeprovisioningFailed"
});
return a && u(t, n, a, "warning"), r && u(t, n, r, "error"), o && u(t, n, o, "error"), t;
},
setQuotaNotifications: function(e, t, n) {
var a = o.getQuotaNotifications(e, t, n);
_.each(a, function(e) {
r.isNotificationPermanentlyHidden(e) || r.addNotification(e);
});
}
};
} ]), angular.module("openshiftConsole").factory("ListRowUtils", function() {
var e = function(e) {
var t = _.get(e, "metadata.uid");
return t ? "overview/expand/" + t : null;
}, t = function(t) {
var n = e(t.apiObject);
if (n) {
var a = sessionStorage.getItem(n);
a || !t.state.expandAll ? t.expanded = "true" === a : t.expanded = !0;
} else t.expanded = !1;
};
return {
getNotifications: function(e, t) {
var n = _.get(e, "metadata.uid");
return n ? _.get(t, [ "notificationsByObjectUID", n ]) : null;
},
ui: {
toggleExpand: function(t, n) {
if (n || !($(t.target).closest("a").length > 0)) {
var a = e(this.apiObject);
a && (this.expanded = !this.expanded, sessionStorage.setItem(a, this.expanded ? "true" : "false"));
}
},
$onInit: function() {
_.set(this, "selectedTab.networking", !0), t(this);
}
}
};
}), angular.module("openshiftConsole").factory("OwnerReferencesService", function() {
var e = function(e) {
return _.get(e, "metadata.ownerReferences");
};
return {
getOwnerReferences: e,
getControllerReferences: function(t) {
var n = e(t);
return _.filter(n, "controller");
},
groupByControllerUID: function(t) {
var n = {};
return _.each(t, function(t) {
var a = !1;
_.each(e(t), function(e) {
e.controller && (a = !0, n[e.uid] = n[e.uid] || [], n[e.uid].push(t));
}), a || (n[""] = n[""] || [], n[""].push(t));
}), n;
},
filterForController: function(t, n) {
var a = _.get(n, "metadata.uid");
return _.filter(t, function(t) {
return _.some(e(t), {
uid: a,
controller: !0
});
});
}
};
}), angular.module("openshiftConsole").factory("ServiceInstancesService", [ "$filter", "$uibModal", "DataService", "NotificationsService", function(e, t, n, a) {
return {
deprovision: function(r) {
var o = e("getErrorDetails"), i = {
alerts: {
deprovision: {
type: "error",
message: "Service '" + r.spec.serviceClassName + "' will be deleted and no longer available."
}
},
detailsMarkup: "Delete Service?",
okButtonText: "Delete",
okButtonClass: "btn-danger",
cancelButtonText: "Cancel"
};
return t.open({
animation: !0,
templateUrl: "views/modals/confirm.html",
controller: "ConfirmModalController",
resolve: {
modalConfig: function() {
return i;
}
}
}).result.then(function() {
return a.hideNotification("deprovision-service-error"), n.delete({
group: "servicecatalog.k8s.io",
resource: "serviceinstances"
}, r.metadata.name, {
namespace: r.metadata.namespace
}, {
propagationPolicy: null
}).then(function() {
a.addNotification({
type: "success",
message: "Successfully deleted provisioned service " + r.metadata.name + "."
});
}, function(e) {
a.addNotification({
id: "deprovision-service-error",
type: "error",
message: "An error occurred while deleting provisioned service " + r.metadata.name + ".",
details: o(e)
});
});
});
}
};
} ]), angular.module("openshiftConsole").controller("LandingPageController", [ "$scope", "$rootScope", "AuthService", "Catalog", "Constants", "DataService", "Navigate", "NotificationsService", "RecentlyViewedServiceItems", "GuidedTourService", "HTMLService", "$timeout", "$q", "$routeParams", "$location", function(e, t, n, a, r, o, i, s, c, l, u, d, p, m, f) {
function g() {
var n = f.search().serviceClass;
if (n) {
var a = _.find(e.catalogItems, {
resource: {
metadata: {
name: n
}
}
});
if (a) return void e.$broadcast("open-overlay-panel", a);
}
if (v) if (m.startTour) d(function() {
f.replace(), f.search("startTour", null), e.startGuidedTour();
}, 500); else if (_.get(h, "auto_launch")) {
var r = "openshift/viewedHomePage/" + t.user.metadata.name;
"true" !== localStorage.getItem(r) && d(function() {
e.startGuidedTour() && localStorage.setItem(r, "true");
}, 500);
}
}
var h = _.get(r, "GUIDED_TOURS.landing_page_tour"), v = h && h.enabled && h.steps;
e.saasOfferings = r.SAAS_OFFERINGS, e.viewMembership = function(e) {
i.toProjectMembership(e.metadata.name);
}, v && (e.startGuidedTour = function() {
return !u.isWindowBelowBreakpoint(u.WINDOW_SIZE_SM) && (l.startTour(h.steps), !0);
}), s.clearNotifications();
var y = function() {
var t = _.get(e, "template.metadata.uid");
t && c.addItem(t);
}, b = function(e) {
return "PartialObjectMetadata" === e.kind;
}, C = function(e) {
return b(e) ? o.get("templates", e.metadata.name, {
namespace: e.metadata.namespace
}) : p.when(e);
};
e.templateSelected = function(t) {
C(t).then(function(t) {
_.set(e, "ordering.panelName", "template"), e.template = t;
});
}, e.closeOrderingPanel = function() {
e.template && (y(), e.template = null), _.set(e, "ordering.panelName", "");
}, e.deployImageSelected = function() {
_.set(e, "ordering.panelName", "deployImage");
}, e.fromFileSelected = function() {
_.set(e, "ordering.panelName", "fromFile");
}, e.fromProjectSelected = function() {
_.set(e, "ordering.panelName", "fromProject");
}, n.withUser().then(function() {
var t = !_.get(r, "ENABLE_TECH_PREVIEW_FEATURE.template_service_broker");
a.getCatalogItems(t).then(_.spread(function(t, n) {
if (n) {
var a = {
type: "error",
message: n
};
s.addNotification(a);
}
e.catalogItems = t, g();
}));
}), e.$on("$destroy", function() {
y();
}), v && e.$on("$locationChangeStart", function(t) {
f.search().startTour && (e.startGuidedTour(), t.preventDefault());
});
} ]), angular.module("openshiftConsole").factory("EventsService", [ "BrowserStore", function(e) {
var t = e.loadJSON("session", "events") || {}, n = _.get(window, "OPENSHIFT_CONSTANTS.EVENTS_TO_SHOW");
return {
isImportantAPIEvent: function(e) {
return n[e.reason];
},
markRead: function(n) {
_.set(t, [ n, "read" ], !0), e.saveJSON("session", "events", t);
},
isRead: function(e) {
return _.get(t, [ e, "read" ]);
},
markCleared: function(n) {
_.set(t, [ n, "cleared" ], !0), e.saveJSON("session", "events", t);
},
isCleared: function(e) {
return _.get(t, [ e, "cleared" ]);
}
};
} ]), angular.module("openshiftConsole").controller("ProjectsController", [ "$scope", "$filter", "$location", "$route", "$timeout", "AuthService", "DataService", "KeywordService", "Navigate", "Logger", "ProjectsService", function(e, t, n, a, r, o, i, s, c, l, u) {
var d, p, m = [], f = [], g = !1;
e.alerts = e.alerts || {}, e.loading = !0, e.showGetStarted = !1, e.canCreate = void 0, e.search = {
text: ""
}, e.limitListTo = 250;
var h, v = [ "metadata.name", 'metadata.annotations["openshift.io/display-name"]', 'metadata.annotations["openshift.io/description"]', 'metadata.annotations["openshift.io/requester"]' ], y = function() {
e.projects = s.filterForKeywords(p, v, f);
}, b = t("displayName"), C = function() {
var t = _.get(e, "sortConfig.currentField.id");
h !== t && (e.sortConfig.isAscending = "metadata.creationTimestamp" !== t);
var n = function(e) {
return b(e).toLowerCase();
}, a = e.sortConfig.isAscending ? "asc" : "desc";
switch (t) {
case 'metadata.annotations["openshift.io/display-name"]':
p = _.orderBy(d, [ n, "metadata.name" ], [ a ]);
break;

case 'metadata.annotations["openshift.io/requester"]':
p = _.orderBy(d, [ t, n ], [ a, "asc" ]);
break;

default:
p = _.orderBy(d, [ t ], [ a ]);
}
h = t;
}, S = function() {
C(), y();
};
e.sortConfig = {
fields: [ {
id: 'metadata.annotations["openshift.io/display-name"]',
title: "Display Name",
sortType: "alpha"
}, {
id: "metadata.name",
title: "Name",
sortType: "alpha"
}, {
id: 'metadata.annotations["openshift.io/requester"]',
title: "Creator",
sortType: "alpha"
}, {
id: "metadata.creationTimestamp",
title: "Creation Date",
sortType: "alpha"
} ],
isAscending: !0,
onSortChange: S
};
var w = function(t) {
d = _.toArray(t.by("metadata.name")), e.loading = !1, e.showGetStarted = _.isEmpty(d) && !e.isProjectListIncomplete, S();
}, k = function() {
g || u.list().then(w);
};
e.newProjectPanelShown = !1, e.createProject = function(t) {
for (var n = _.get(t, "target"); n && !angular.element(n).hasClass("btn"); ) n = n.parentElement;
e.popupElement = n, e.newProjectPanelShown = !0;
}, e.closeNewProjectPanel = function() {
e.newProjectPanelShown = !1;
}, e.onNewProject = function() {
e.newProjectPanelShown = !1, k();
}, e.editProjectPanelShown = !1, e.editProject = function(t) {
e.editingProject = t, e.editProjectPanelShown = !0;
}, e.closeEditProjectPanel = function() {
e.editProjectPanelShown = !1;
}, e.onEditProject = function() {
e.editProjectPanelShown = !1, k();
}, e.onDeleteProject = k, e.goToProject = function(e) {
c.toProjectOverview(e);
}, e.$watch("search.text", _.debounce(function(t) {
e.keywords = f = s.generateKeywords(t), e.$applyAsync(y);
}, 350)), o.withUser().then(function() {
u.list().then(function(t) {
e.isProjectListIncomplete = u.isProjectListIncomplete(), w(t), !e.isProjectListIncomplete && _.size(d) <= 250 && (m.push(u.watch(e, w)), g = !0);
}, function() {
e.isProjectListIncomplete = !0, e.loading = !1, d = [], S();
});
}), u.canCreate().then(function() {
e.canCreate = !0;
}, function(t) {
e.canCreate = !1;
var n = t.data || {};
if (403 !== t.status) {
var a = "Failed to determine create project permission";
return 0 !== t.status && (a += " (" + t.status + ")"), void l.warn(a);
}
if (n.details) {
var r = [];
_.forEach(n.details.causes || [], function(e) {
e.message && r.push(e.message);
}), _.isEmpty(r) || (e.newProjectMessage = r.join("\n"));
}
}), e.$on("$destroy", function() {
i.unwatchAll(m);
});
} ]), angular.module("openshiftConsole").controller("PodsController", [ "$routeParams", "$scope", "DataService", "ProjectsService", "$filter", "LabelFilter", "Logger", function(e, t, n, a, r, o, i) {
t.projectName = e.project, t.pods = {}, t.unfilteredPods = {}, t.labelSuggestions = {}, t.alerts = t.alerts || {}, t.emptyMessage = "Loading...";
var s = [];
a.get(e.project).then(_.spread(function(e, a) {
function r() {
o.getLabelSelector().isEmpty() || !$.isEmptyObject(t.pods) || $.isEmptyObject(t.unfilteredPods) ? delete t.alerts.pods : t.alerts.pods = {
type: "warning",
details: "The active filters are hiding all pods."
};
}
t.project = e, s.push(n.watch("pods", a, function(e) {
t.unfilteredPods = e.by("metadata.name"), t.pods = o.getLabelSelector().select(t.unfilteredPods), t.emptyMessage = "No pods to show", o.addLabelSuggestionsFromResources(t.unfilteredPods, t.labelSuggestions), o.setLabelSuggestions(t.labelSuggestions), r(), i.log("pods (subscribe)", t.unfilteredPods);
})), o.onActiveFiltersChanged(function(e) {
t.$apply(function() {
t.pods = e.select(t.unfilteredPods), r();
});
}), t.$on("$destroy", function() {
n.unwatchAll(s);
});
}));
} ]), angular.module("openshiftConsole").controller("PodController", [ "$scope", "$filter", "$routeParams", "$timeout", "$uibModal", "Logger", "DataService", "FullscreenService", "ImageStreamResolver", "MetricsService", "OwnerReferencesService", "PodsService", "ProjectsService", function(e, t, n, a, r, o, i, s, c, l, u, d, p) {
e.projectName = n.project, e.pod = null, e.imageStreams = {}, e.imagesByDockerReference = {}, e.imageStreamImageRefByDockerReference = {}, e.builds = {}, e.alerts = {}, e.terminalDisconnectAlert = {}, e.renderOptions = e.renderOptions || {}, e.renderOptions.hideFilterWidget = !0, e.logOptions = {}, e.terminalTabWasSelected = !1, e.breadcrumbs = [ {
title: "Pods",
link: "project/" + n.project + "/browse/pods"
}, {
title: n.pod
} ], e.terminalDisconnectAlert.disconnect = {
type: "warning",
message: "This terminal has been disconnected. If you reconnect, your terminal history will be lost."
}, e.noContainersYet = !0, e.selectedTab = {};
var m = [], f = null;
l.isAvailable().then(function(t) {
e.metricsAvailable = t;
});
var g = function() {
if (e.pod) {
var t = _.find(e.pod.status.containerStatuses, {
name: e.logOptions.container
}), n = _.get(t, "state"), a = _.head(_.keys(n)), r = _.includes([ "running", "waiting", "terminated" ], a) ? a : "", o = _.get(t, "lastState"), i = _.head(_.keys(o)), s = _.get(t, "state.waiting");
angular.extend(e, {
containerStatusKey: r,
containerStateReason: _.get(n, [ a, "reason" ])
}), s ? angular.extend(e, {
lasStatusKey: i,
containerStartTime: _.get(o, [ i, "startedAt" ]),
containerEndTime: _.get(o, [ i, "finishedAt" ])
}) : angular.extend(e, {
containerStartTime: _.get(n, [ a, "startedAt" ]),
containerEndTime: _.get(n, [ a, "finishedAt" ])
});
}
}, h = function() {
var e = $("<span>").css({
position: "absolute",
top: "-100px"
}).addClass("terminal-font").text(_.repeat("x", 10)).appendTo("body"), t = {
width: e.width() / 10,
height: e.height()
};
return e.remove(), t;
}(), v = $(window), y = function(t) {
t || (t = 0), h.height && h.width && e.selectedTab.terminal && !(t > 10) && e.$apply(function() {
var n = $(".container-terminal-wrapper").get(0);
if (n) {
var r = n.getBoundingClientRect();
if (0 !== r.left || 0 !== r.top || 0 !== r.width || 0 !== r.height) {
var o = v.width(), i = v.height(), s = o - r.left - 54, c = i - r.top - 36;
e.terminalCols = Math.max(_.floor(s / h.width), 80), e.terminalRows = Math.max(_.floor(c / h.height), 24);
} else a(function() {
y(t + 1);
}, 50);
} else a(function() {
y(t + 1);
}, 50);
});
};
e.$watch("selectedTab.terminal", function(e) {
e ? (h.height && h.width ? $(window).on("resize.terminalsize", _.debounce(y, 100)) : o.warn("Unable to calculate the bounding box for a character.  Terminal will not be able to resize."), a(y, 0)) : $(window).off("resize.terminalsize");
}), e.onTerminalSelectChange = function(t) {
_.each(e.containerTerminals, function(e) {
e.isVisible = !1;
}), t.isVisible = !0, t.isUsed = !0, e.selectedTerminalContainer = t;
};
var b = function(e) {
var t = _.get(e, "state", {});
return _.head(_.keys(t));
}, C = function() {
var t = [];
_.each(e.pod.spec.containers, function(n) {
var a = _.find(e.pod.status.containerStatuses, {
name: n.name
}), r = b(a);
t.push({
containerName: n.name,
isVisible: !1,
isUsed: !1,
containerState: r
});
});
var n = _.head(t);
return n.isVisible = !0, n.isUsed = !0, e.selectedTerminalContainer = n, t;
}, S = function(t) {
e.noContainersYet && (e.noContainersYet = 0 === e.containersRunning(t.status.containerStatuses));
}, w = function(t) {
_.each(t, function(t) {
var n = _.find(e.pod.status.containerStatuses, {
name: t.containerName
}), a = b(n);
t.containerState = a;
});
}, k = t("annotation"), j = function(t, n) {
if (e.loaded = !0, e.pod = t, e.dcName = k(t, "deploymentConfig"), e.rcName = k(t, "deployment"), e.deploymentVersion = k(t, "deploymentVersion"), e.logCanRun = !_.includes([ "New", "Pending", "Unknown" ], t.status.phase), g(), delete e.controllerRef, !e.dcName) {
var a = u.getControllerReferences(t);
e.controllerRef = _.find(a, function(e) {
return "ReplicationController" === e.kind || "ReplicaSet" === e.kind || "Build" === e.kind;
});
}
"DELETED" === n && (e.alerts.deleted = {
type: "warning",
message: "This pod has been deleted."
});
};
p.get(n.project).then(_.spread(function(a, l) {
f = l, e.project = a, e.projectContext = l, i.get("pods", n.pod, l, {
errorNotification: !1
}).then(function(t) {
j(t);
var a = {};
a[t.metadata.name] = t, e.logOptions.container = n.container || t.spec.containers[0].name, e.containerTerminals = C(), S(t), c.fetchReferencedImageStreamImages(a, e.imagesByDockerReference, e.imageStreamImageRefByDockerReference, f), m.push(i.watchObject("pods", n.pod, l, function(t, n) {
j(t, n), w(e.containerTerminals), S(t);
}));
}, function(n) {
e.loaded = !0, e.alerts.load = {
type: "error",
message: "The pod details could not be loaded.",
details: t("getErrorDetails")(n)
};
}), e.$watch("logOptions.container", g), m.push(i.watch("imagestreams", l, function(t) {
e.imageStreams = t.by("metadata.name"), c.buildDockerRefMapForImageStreams(e.imageStreams, e.imageStreamImageRefByDockerReference), c.fetchReferencedImageStreamImages(e.pods, e.imagesByDockerReference, e.imageStreamImageRefByDockerReference, l), o.log("imagestreams (subscribe)", e.imageStreams);
})), m.push(i.watch("builds", l, function(t) {
e.builds = t.by("metadata.name"), o.log("builds (subscribe)", e.builds);
}));
var u, p = function() {
var n = e.debugPod;
u && (i.unwatch(u), u = null), $(window).off("beforeunload.debugPod"), n && (i.delete("pods", n.metadata.name, l, {
gracePeriodSeconds: 0
}).then(_.noop, function(a) {
e.alerts["debug-container-error"] = {
type: "error",
message: "Could not delete pod " + n.metadata.name,
details: t("getErrorDetails")(a)
};
}), e.debugPod = null);
}, h = function() {
$(".terminal:visible").focus();
};
e.hasFullscreen = s.hasFullscreen(!0), e.fullscreenTerminal = function() {
s.requestFullscreen("#container-terminal-wrapper"), setTimeout(h);
}, e.exitFullscreen = function() {
s.exitFullscreen();
}, e.debugTerminal = function(n) {
var a = d.generateDebugPod(e.pod, n);
a ? i.create("pods", null, a, l).then(function(t) {
var o = _.find(e.pod.spec.containers, {
name: n
});
e.debugPod = t, $(window).on("beforeunload.debugPod", function() {
return "Are you sure you want to leave with the debug terminal open? The debug pod will not be deleted unless you close the dialog.";
}), u = i.watchObject("pods", a.metadata.name, l, function(t) {
e.debugPod = t;
}), r.open({
animation: !0,
templateUrl: "views/modals/debug-terminal.html",
controller: "DebugTerminalModalController",
scope: e,
resolve: {
container: function() {
return o;
},
image: function() {
return _.get(e, [ "imagesByDockerReference", o.image ]);
}
},
backdrop: "static"
}).result.then(p);
}, function(a) {
e.alerts["debug-container-error"] = {
type: "error",
message: "Could not debug container " + n,
details: t("getErrorDetails")(a)
};
}) : e.alerts["debug-container-error"] = {
type: "error",
message: "Could not debug container " + n
};
}, e.containersRunning = function(e) {
var t = 0;
return e && e.forEach(function(e) {
e.state && e.state.running && t++;
}), t;
}, e.$on("$destroy", function() {
i.unwatchAll(m), p(), $(window).off("resize.terminalsize");
});
}));
} ]), angular.module("openshiftConsole").controller("OverviewController", [ "$scope", "$filter", "$routeParams", "AlertMessageService", "APIService", "AppsService", "BuildsService", "CatalogService", "Constants", "DataService", "DeploymentsService", "HPAService", "HTMLService", "ImageStreamResolver", "KeywordService", "LabelFilter", "Logger", "MetricsService", "Navigate", "OwnerReferencesService", "PodsService", "ProjectsService", "BindingService", "ResourceAlertsService", "RoutesService", OverviewController ]), angular.module("openshiftConsole").controller("QuotaController", [ "$filter", "$routeParams", "$scope", "DataService", "ProjectsService", "Logger", function(e, t, n, a, r, o) {
n.projectName = t.project, n.limitRanges = {}, n.limitsByType = {}, n.labelSuggestions = {}, n.alerts = n.alerts || {}, n.quotaHelp = "Limits resource usage within this project.", n.emptyMessageLimitRanges = "Loading...", n.limitRangeHelp = "Defines minimum and maximum constraints for runtime resources such as memory and CPU.", n.renderOptions = n.renderOptions || {}, n.renderOptions.hideFilterWidget = !0;
var i = [], s = e("usageValue");
n.isAtLimit = function(e, t) {
var n = e.status.total || e.status, a = s(_.get(n, [ "hard", t ]));
if (!a) return !1;
var r = s(_.get(n, [ "used", t ]));
return !!r && r >= a;
};
var c = e("humanizeQuotaResource"), l = function(e, t) {
return "cpu" === e || "requests.cpu" === e ? "cpu" === t || "requests.cpu" === t ? 0 : -1 : "cpu" === t || "requests.cpu" === t ? 1 : "memory" === e || "requests.memory" === e ? "memory" === t || "requests.memory" === t ? 0 : -1 : "memory" === t || "requests.memory" === t ? 1 : "limits.cpu" === e ? "limits.cpu" === t ? 0 : -1 : "limits.cpu" === t ? 1 : "limits.memory" === e ? "limits.memory" === t ? 0 : -1 : "limits.memory" === t ? 1 : (e = c(e), t = c(t), e.localeCompare(t));
}, u = function(e) {
var t = {};
return _.each(e, function(e) {
var n = _.get(e, "spec.quota.hard") || _.get(e, "spec.hard"), a = _.keys(n).sort(l);
t[e.metadata.name] = a;
}), t;
};
r.get(t.project).then(_.spread(function(e, r) {
n.project = e, a.list("resourcequotas", r).then(function(e) {
n.quotas = _.sortBy(e.by("metadata.name"), "metadata.name"), n.orderedTypesByQuota = u(n.quotas), o.log("quotas", n.quotas);
}), a.list("appliedclusterresourcequotas", r).then(function(e) {
n.clusterQuotas = _.sortBy(e.by("metadata.name"), "metadata.name"), n.orderedTypesByClusterQuota = u(n.clusterQuotas), n.namespaceUsageByClusterQuota = {}, _.each(n.clusterQuotas, function(e) {
if (e.status) {
var a = _.find(e.status.namespaces, {
namespace: t.project
});
n.namespaceUsageByClusterQuota[e.metadata.name] = a.status;
}
}), o.log("cluster quotas", n.clusterQuotas);
}), a.list("limitranges", r).then(function(e) {
n.limitRanges = _.sortBy(e.by("metadata.name"), "metadata.name"), n.emptyMessageLimitRanges = "There are no limit ranges set on this project.", angular.forEach(n.limitRanges, function(e) {
var t = e.metadata.name;
n.limitsByType[t] = {}, angular.forEach(e.spec.limits, function(e) {
var a = n.limitsByType[t][e.type] = {};
angular.forEach(e.max, function(e, t) {
a[t] = a[t] || {}, a[t].max = e;
}), angular.forEach(e.min, function(e, t) {
a[t] = a[t] || {}, a[t].min = e;
}), angular.forEach(e.default, function(e, t) {
a[t] = a[t] || {}, a[t].default = e;
}), angular.forEach(e.defaultRequest, function(e, t) {
a[t] = a[t] || {}, a[t].defaultRequest = e;
}), angular.forEach(e.maxLimitRequestRatio, function(e, t) {
a[t] = a[t] || {}, a[t].maxLimitRequestRatio = e;
});
});
}), o.log("limitRanges", n.limitRanges);
}), n.$on("$destroy", function() {
a.unwatchAll(i);
});
}));
} ]), angular.module("openshiftConsole").controller("MonitoringController", [ "$routeParams", "$location", "$scope", "$filter", "BuildsService", "DataService", "ImageStreamResolver", "KeywordService", "Logger", "MetricsService", "Navigate", "PodsService", "ProjectsService", "$rootScope", function(e, t, n, a, r, o, i, s, c, l, u, d, p, m) {
n.projectName = e.project, n.alerts = n.alerts || {}, n.renderOptions = n.renderOptions || {}, n.renderOptions.showEventsSidebar = !0, n.renderOptions.collapseEventsSidebar = "true" === localStorage.getItem("monitoring.eventsidebar.collapsed");
var f = [];
n.kinds = [ {
kind: "All"
}, {
kind: "Pods"
}, {
label: "Deployments",
kind: "ReplicationControllers"
}, {
kind: "Builds"
}, {
kind: "StatefulSets"
} ], n.kindSelector = {
selected: _.find(n.kinds, {
kind: e.kind
}) || _.head(n.kinds)
}, n.logOptions = {
pods: {},
replicationControllers: {},
builds: {},
statefulSets: {}
}, n.logCanRun = {
pods: {},
replicationControllers: {},
builds: {},
statefulSets: {}
}, n.logEmpty = {
pods: {},
replicationControllers: {},
builds: {},
statefulSets: {}
}, n.expanded = {
pods: {},
replicationControllers: {},
replicaSets: {},
builds: {},
statefulSets: {}
};
var g = a("isNil");
n.filters = {
hideOlderResources: g(e.hideOlderResources) || "true" === e.hideOlderResources,
text: ""
};
var h, v, y, b;
l.isAvailable().then(function(e) {
n.metricsAvailable = e;
});
var C = a("orderObjectsByDate"), S = [ "metadata.name" ], w = [], k = function() {
n.filteredPods = s.filterForKeywords(b, S, w), n.filteredReplicationControllers = s.filterForKeywords(v, S, w), n.filteredReplicaSets = s.filterForKeywords(y, S, w), n.filteredBuilds = s.filterForKeywords(h, S, w), n.filteredStatefulSets = s.filterForKeywords(_.values(n.statefulSets), S, w);
}, j = function(e) {
n.logOptions.pods[e.metadata.name] = {
container: e.spec.containers[0].name
}, n.logCanRun.pods[e.metadata.name] = !_.includes([ "New", "Pending", "Unknown" ], e.status.phase);
}, P = function(e) {
n.logOptions.replicationControllers[e.metadata.name] = {};
var t = a("annotation")(e, "deploymentVersion");
t && (n.logOptions.replicationControllers[e.metadata.name].version = t), n.logCanRun.replicationControllers[e.metadata.name] = !_.includes([ "New", "Pending" ], a("deploymentStatus")(e));
}, R = function(e) {
n.logOptions.builds[e.metadata.name] = {}, n.logCanRun.builds[e.metadata.name] = !_.includes([ "New", "Pending", "Error" ], e.status.phase);
}, I = function() {
n.filteredStatefulSets = s.filterForKeywords(_.values(n.statefulSets), S, w);
}, T = function() {
b = _.filter(n.pods, function(e) {
return !n.filters.hideOlderResources || "Succeeded" !== e.status.phase && "Failed" !== e.status.phase;
}), n.filteredPods = s.filterForKeywords(b, S, w);
}, N = a("isIncompleteBuild"), E = a("buildConfigForBuild"), D = a("isRecentBuild"), A = function() {
moment().subtract(5, "m");
h = _.filter(n.builds, function(e) {
if (!n.filters.hideOlderResources) return !0;
if (N(e)) return !0;
var t = E(e);
return t ? n.latestBuildByConfig[t].metadata.name === e.metadata.name : D(e);
}), n.filteredBuilds = s.filterForKeywords(h, S, w);
}, B = a("deploymentStatus"), L = a("deploymentIsInProgress"), U = function() {
v = _.filter(n.replicationControllers, function(e) {
return !n.filters.hideOlderResources || (L(e) || "Active" === B(e));
}), n.filteredReplicationControllers = s.filterForKeywords(v, S, w);
}, O = function() {
y = _.filter(n.replicaSets, function(e) {
return !n.filters.hideOlderResources || _.get(e, "status.replicas");
}), n.filteredReplicaSets = s.filterForKeywords(y, S, w);
};
n.toggleItem = function(e, t, r) {
var o = $(e.target);
if (!o || !o.closest("a", t).length) {
var i, s;
switch (r.kind) {
case "Build":
i = !n.expanded.builds[r.metadata.name], n.expanded.builds[r.metadata.name] = i, s = i ? "event.resource.highlight" : "event.resource.clear-highlight", m.$emit(s, r);
var c = _.get(n.podsByName, a("annotation")(r, "buildPod"));
c && m.$emit(s, c);
break;

case "ReplicationController":
i = !n.expanded.replicationControllers[r.metadata.name], n.expanded.replicationControllers[r.metadata.name] = i, s = i ? "event.resource.highlight" : "event.resource.clear-highlight", m.$emit(s, r);
var l = a("annotation")(r, "deployerPod");
l && m.$emit(s, {
kind: "Pod",
metadata: {
name: l
}
}), _.each(n.podsByOwnerUID[r.metadata.uid], function(e) {
m.$emit(s, e);
});
break;

case "ReplicaSet":
i = !n.expanded.replicaSets[r.metadata.name], n.expanded.replicaSets[r.metadata.name] = i, s = i ? "event.resource.highlight" : "event.resource.clear-highlight", m.$emit(s, r), _.each(n.podsByOwnerUID[r.metadata.uid], function(e) {
m.$emit(s, e);
});
break;

case "Pod":
i = !n.expanded.pods[r.metadata.name], n.expanded.pods[r.metadata.name] = i, s = i ? "event.resource.highlight" : "event.resource.clear-highlight", m.$emit(s, r);
break;

case "StatefulSet":
i = !n.expanded.statefulSets[r.metadata.name], n.expanded.statefulSets[r.metadata.name] = i, s = i ? "event.resource.highlight" : "event.resource.clear-highlight", m.$emit(s, r);
}
}
}, n.viewPodsForSet = function(e) {
var t = _.get(n, [ "podsByOwnerUID", e.metadata.uid ], []);
_.isEmpty(t) || u.toPodsForDeployment(e, t);
}, p.get(e.project).then(_.spread(function(e, a) {
n.project = e, n.projectContext = a, o.watch("pods", a, function(e) {
n.podsByName = e.by("metadata.name"), n.pods = C(n.podsByName, !0), n.podsByOwnerUID = d.groupByOwnerUID(n.pods), n.podsLoaded = !0, _.each(n.pods, j), T(), c.log("pods", n.pods);
}), o.watch({
resource: "statefulsets",
group: "apps",
version: "v1beta1"
}, a, function(e) {
n.statefulSets = e.by("metadata.name"), n.statefulSetsLoaded = !0, I(), c.log("statefulSets", n.statefulSets);
}), o.watch("replicationcontrollers", a, function(e) {
n.replicationControllers = C(e.by("metadata.name"), !0), n.replicationControllersLoaded = !0, _.each(n.replicationControllers, P), U(), c.log("replicationcontrollers", n.replicationControllers);
}), o.watch("builds", a, function(e) {
n.builds = C(e.by("metadata.name"), !0), n.latestBuildByConfig = r.latestBuildByConfig(n.builds), n.buildsLoaded = !0, _.each(n.builds, R), A(), c.log("builds", n.builds);
}), o.watch({
group: "extensions",
resource: "replicasets"
}, a, function(e) {
n.replicaSets = C(e.by("metadata.name"), !0), n.replicaSetsLoaded = !0, O(), c.log("replicasets", n.replicaSets);
}), n.$on("$destroy", function() {
o.unwatchAll(f);
}), n.$watch("filters.hideOlderResources", function() {
T(), A(), U(), O(), I();
var e = t.search();
e.hideOlderResources = n.filters.hideOlderResources ? "true" : "false", t.replace().search(e);
}), n.$watch("kindSelector.selected.kind", function() {
var e = t.search();
e.kind = n.kindSelector.selected.kind, t.replace().search(e);
}), n.$watch("filters.text", _.debounce(function() {
n.filterKeywords = w = s.generateKeywords(n.filters.text), n.$apply(k);
}, 50, {
maxWait: 250
})), n.$watch("renderOptions.collapseEventsSidebar", function(e, t) {
e !== t && (localStorage.setItem("monitoring.eventsidebar.collapsed", n.renderOptions.collapseEventsSidebar ? "true" : "false"), m.$emit("metrics.charts.resize"));
});
}));
} ]), angular.module("openshiftConsole").controller("MembershipController", [ "$filter", "$location", "$routeParams", "$scope", "$timeout", "$uibModal", "AuthService", "AuthorizationService", "DataService", "ProjectsService", "MembershipService", "NotificationsService", "RoleBindingsService", "RolesService", function(e, t, n, a, r, o, i, s, c, l, u, d, p, m) {
var f, g = n.project, h = e("humanizeKind"), v = e("annotation"), y = e("canI"), b = [], C = {
notice: {
yourLastRole: _.template('Removing the role "<%= roleName %>" may completely remove your ability to see this project.')
},
warning: {
serviceAccount: _.template("Removing a system role granted to a service account may cause unexpected behavior.")
},
remove: {
areYouSure: {
html: {
subject: _.template("Are you sure you want to remove <strong><%- roleName %></strong> from the <%- kindName %> <strong><%- subjectName %></strong>?"),
self: _.template("Are you sure you want to remove <strong><%- roleName %></strong> from <strong><%- subjectName %></strong> (you)?")
}
},
success: _.template('The role "<%= roleName %>" was removed from "<%= subjectName %>".'),
error: _.template('The role "<%= roleName %>" was not removed from "<%= subjectName %>".')
},
update: {
subject: {
success: _.template('The role "<%= roleName %>" was granted to "<%= subjectName %>".'),
error: _.template('The role "<%= roleName %>" could not be granted to "<%= subjectName %>".'),
exists: _.template('The role "<%= roleName %>" has already been granted to "<%= subjectName %>".')
}
},
errorReason: _.template('Reason: "<%= httpErr %>"')
}, S = function(e, t, n) {
d.addNotification({
type: e,
message: t,
details: n
});
}, w = function() {
a.disableAddForm = !1, a.newBinding.name = "", a.newBinding.namespace = g, a.newBinding.newRole = null;
}, k = function(e) {
c.list("serviceaccounts", e).then(function(e) {
var t = _.keys(e.by("metadata.name")).sort();
angular.extend(a, {
serviceAccounts: t,
refreshServiceAccounts: function(e) {
e && !_.includes(a.serviceAccounts, e) ? a.serviceAccounts = [ e ].concat(t) : a.serviceAccounts = t;
}
});
});
}, j = function(e) {
c.list("rolebindings", f, null, {
errorNotification: !1
}).then(function(e) {
angular.extend(a, {
canShowRoles: !0,
roleBindings: e.by("metadata.name"),
subjectKindsForUI: u.mapRolebindingsForUI(e.by("metadata.name"), b)
}), w();
}, function() {
e && (a.roleBindings[e.metadata.name] = e, a.subjectKindsForUI = u.mapRolebindingsForUI(a.roleBindings, b)), w();
});
}, P = function(t, n) {
a.disableAddForm = !0, p.create(t, n, g, f).then(function() {
j(), S("success", C.update.subject.success({
roleName: t.metadata.name,
subjectName: n.name
}));
}, function(a) {
w(), j(), S("error", C.update.subject.error({
roleName: t.metadata.name,
subjectName: n.name
}), C.errorReason({
httpErr: e("getErrorDetails")(a)
}));
});
}, R = function(t, n, r) {
a.disableAddForm = !0, p.addSubject(t, n, r, f).then(function() {
j(), S("success", C.update.subject.success({
roleName: t.roleRef.name,
subjectName: n.name
}));
}, function(a) {
w(), j(), S("error", C.update.subject.error({
roleName: t.roleRef.name,
subjectName: n.name
}), C.errorReason({
httpErr: e("getErrorDetails")(a)
}));
});
}, I = {};
n.tab && (I[n.tab] = !0);
var T = u.getSubjectKinds();
angular.extend(a, {
selectedTab: I,
projectName: g,
forms: {},
subjectKinds: T,
newBinding: {
role: "",
kind: n.tab || "User",
name: ""
},
toggleEditMode: function() {
w(), a.mode.edit = !a.mode.edit;
},
mode: {
edit: !1
},
selectTab: function(e) {
a.newBinding.kind = e, a.newBinding.name = "";
}
}), angular.extend(a, {
excludeExistingRoles: function(e) {
return function(t) {
return !_.some(e, {
kind: t.kind,
metadata: {
name: t.metadata.name
}
});
};
},
roleHelp: function(e) {
if (e) {
var t = _.get(e, "metadata.namespace"), n = _.get(e, "metadata.name"), a = t ? t + " / " + n + ": " : "";
return e ? a + (v(e, "description") || "") : "";
}
}
});
var N = function(e, t, n, r) {
var o = {
alerts: {},
detailsMarkup: C.remove.areYouSure.html.subject({
roleName: n,
kindName: h(t),
subjectName: e
}),
okButtonText: "Remove",
okButtonClass: "btn-danger",
cancelButtonText: "Cancel"
};
return _.isEqual(e, r) && (o.detailsMarkup = C.remove.areYouSure.html.self({
roleName: n,
subjectName: e
}), u.isLastRole(a.user.metadata.name, a.roleBindings) && (o.alerts.currentUserLabelRole = {
type: "error",
message: C.notice.yourLastRole({
roleName: n
})
})), _.isEqual(t, "ServiceAccount") && _.startsWith(n, "system:") && (o.alerts.editingServiceAccountRole = {
type: "error",
message: C.warning.serviceAccount()
}), o;
};
i.withUser().then(function(e) {
a.user = e;
}), l.list().then(function(e) {
var t = _.keys(e.by("metadata.name")).sort();
angular.extend(a, {
projects: t,
selectProject: function(e) {
a.newBinding.name = "", k({
namespace: e
});
},
refreshProjects: function(e) {
e && !_.includes(a.projects, e) ? a.projects = [ e ].concat(t) : a.projects = t;
}
});
}), l.get(n.project).then(_.spread(function(n, r) {
f = r, j(), k(f), angular.extend(a, {
project: n,
subjectKinds: T,
canUpdateRolebindings: y("rolebindings", "update", g),
confirmRemove: function(n, r, i) {
var c = null, l = N(n, r, i, a.user.metadata.name);
_.isEqual(n, a.user.metadata.name) && u.isLastRole(a.user.metadata.name, a.roleBindings) && (c = !0), o.open({
animation: !0,
templateUrl: "views/modals/confirm.html",
controller: "ConfirmModalController",
resolve: {
modalConfig: function() {
return l;
}
}
}).result.then(function() {
p.removeSubject(n, i, a.roleBindings, f).then(function(e) {
c ? t.url("./") : (s.getProjectRules(g, !0).then(function() {
j(e[0]);
var t = y("rolebindings", "update", g);
angular.extend(a, {
canUpdateRolebindings: t,
mode: {
edit: !!a.mode.edit && t
}
});
}), S("success", C.remove.success({
roleName: i,
subjectName: n
})));
}, function(t) {
S("error", C.remove.error({
roleName: i,
subjectName: n
}), C.errorReason({
httpErr: e("getErrorDetails")(t)
}));
});
});
},
addRoleTo: function(e, t, n, r) {
var o = {
name: e,
kind: t
};
"ServiceAccount" === t && (o.namespace = r);
var i = _.find(a.roleBindings, {
roleRef: {
name: n.metadata.name
}
});
i && _.some(i.subjects, o) ? S("error", C.update.subject.exists({
roleName: n.metadata.name,
subjectName: e
})) : i ? R(i, o, r) : P(n, o);
}
}), m.listAllRoles(f, {
errorNotification: !1
}).then(function(e) {
b = u.mapRolesForUI(_.head(e).by("metadata.name"), _.last(e).by("metadata.name"));
var t = u.sortRoles(b), n = u.filterRoles(b), r = function(e, t) {
return _.some(t, {
metadata: {
name: e
}
});
};
j(), angular.extend(a, {
toggle: {
roles: !1
},
filteredRoles: n,
showAllRoles: function() {
a.toggle.roles = !a.toggle.roles, a.toggle.roles ? a.filteredRoles = t : (a.filteredRoles = n, r(a.newBinding.role, n) || (a.newBinding.role = null));
}
});
});
}));
} ]), angular.module("openshiftConsole").controller("BuildsController", [ "$filter", "$location", "$routeParams", "$scope", "APIService", "BuildsService", "DataService", "LabelFilter", "Logger", "ProjectsService", function(e, t, n, a, r, o, i, s, c, l) {
a.projectName = n.project, a.builds = {}, a.unfilteredBuildConfigs = {}, a.buildConfigs = void 0, a.labelSuggestions = {}, a.alerts = a.alerts || {}, a.emptyMessage = "Loading...", a.latestByConfig = {};
var u = e("buildConfigForBuild"), d = r.getPreferredVersion("builds"), p = r.getPreferredVersion("buildconfigs"), m = [];
l.get(n.project).then(_.spread(function(t, n) {
function r(e) {
var t = s.getLabelSelector();
if (t.isEmpty()) return !0;
var n = u(e) || "";
return n && a.unfilteredBuildConfigs[n] ? !!a.buildConfigs[n] : t.matches(e);
}
function l(e) {
if (u(e)) return !1;
var t = s.getLabelSelector();
return !!t.isEmpty() || t.matches(e);
}
function f() {
a.latestByConfig = o.latestBuildByConfig(a.builds, r), a.buildsNoConfig = _.pickBy(a.builds, l), angular.forEach(a.buildConfigs, function(e, t) {
a.latestByConfig[t] = a.latestByConfig[t] || null;
});
}
function g() {
var e = _.omitBy(a.latestByConfig, _.isNull);
!s.getLabelSelector().isEmpty() && _.isEmpty(a.buildConfigs) && _.isEmpty(e) ? a.alerts.builds = {
type: "warning",
details: "The active filters are hiding all builds."
} : delete a.alerts.builds;
}
a.project = t;
var h = e("isJenkinsPipelineStrategy");
m.push(i.watch(d, n, function(e) {
a.builds = _.omitBy(e.by("metadata.name"), h), a.emptyMessage = "No builds to show", f(), s.addLabelSuggestionsFromResources(a.builds, a.labelSuggestions), c.log("builds (subscribe)", a.builds);
})), m.push(i.watch(p, n, function(e) {
a.unfilteredBuildConfigs = _.omitBy(e.by("metadata.name"), h), s.addLabelSuggestionsFromResources(a.unfilteredBuildConfigs, a.labelSuggestions), s.setLabelSuggestions(a.labelSuggestions), a.buildConfigs = s.getLabelSelector().select(a.unfilteredBuildConfigs), f(), g(), c.log("buildconfigs (subscribe)", a.buildConfigs);
})), s.onActiveFiltersChanged(function(e) {
a.$apply(function() {
a.buildConfigs = e.select(a.unfilteredBuildConfigs), f(), g();
});
}), a.$on("$destroy", function() {
i.unwatchAll(m);
});
}));
} ]), angular.module("openshiftConsole").controller("PipelinesController", [ "$filter", "$routeParams", "$scope", "Constants", "Navigate", "BuildsService", "DataService", "Logger", "ProjectsService", function(e, t, n, a, r, o, i, s, c) {
n.projectName = t.project, n.alerts = n.alerts || {}, n.buildConfigs = {};
var l = [];
c.get(t.project).then(_.spread(function(t, s) {
n.project = t;
var c = {}, u = e("buildConfigForBuild"), d = e("isIncompleteBuild"), p = e("isJenkinsPipelineStrategy"), m = e("isNewerResource"), f = function(e, t) {
if (!d(t)) {
n.statsByConfig[e] || (n.statsByConfig[e] = {
count: 0,
totalDuration: 0
});
var a = n.statsByConfig[e];
a.count++, a.totalDuration += o.getDuration(t), a.avgDuration = _.round(a.totalDuration / a.count);
}
}, g = function() {
var e = {}, t = {};
n.statsByConfig = {}, _.each(c, function(a) {
if (p(a)) {
var r = u(a) || "";
n.buildConfigs[r] || (n.buildConfigs[r] = null), d(a) ? _.set(e, [ r, a.metadata.name ], a) : m(a, t[r]) && (t[r] = a), f(r, a);
}
}), _.each(t, function(t, n) {
_.set(e, [ n, t.metadata.name ], t);
}), n.interestingBuildsByConfig = e;
};
l.push(i.watch("builds", s, function(e) {
n.buildsLoaded = !0, c = e.by("metadata.name"), g();
}));
var h = !1;
l.push(i.watch("buildconfigs", s, function(e) {
if (n.buildConfigsLoaded = !0, n.buildConfigs = _.pickBy(e.by("metadata.name"), p), _.isEmpty(n.buildConfigs) && !h && (h = !0, a.SAMPLE_PIPELINE_TEMPLATE)) {
var t = a.SAMPLE_PIPELINE_TEMPLATE.name, o = a.SAMPLE_PIPELINE_TEMPLATE.namespace;
i.get("templates", t, {
namespace: o
}, {
errorNotification: !1
}).then(function(e) {
n.createSampleURL = r.createFromTemplateURL(e, n.projectName);
});
}
g();
})), n.startBuild = o.startBuild, n.$on("$destroy", function() {
i.unwatchAll(l);
});
}));
} ]), angular.module("openshiftConsole").controller("BuildConfigController", [ "$scope", "$filter", "$routeParams", "APIService", "BuildsService", "ImagesService", "DataService", "LabelFilter", "ModalsService", "NotificationsService", "ProjectsService", "keyValueEditorUtils", function(e, t, n, a, r, o, i, s, c, l, u, d) {
e.projectName = n.project, e.buildConfigName = n.buildconfig, e.buildConfig = null, e.labelSuggestions = {}, e.alerts = {}, e.breadcrumbs = [], e.forms = {}, e.expand = {
imageEnv: !1
}, n.isPipeline ? e.breadcrumbs.push({
title: "Pipelines",
link: "project/" + n.project + "/browse/pipelines"
}) : e.breadcrumbs.push({
title: "Builds",
link: "project/" + n.project + "/browse/builds"
}), e.breadcrumbs.push({
title: n.buildconfig
}), e.buildConfigsVersion = a.getPreferredVersion("buildconfigs"), e.buildsVersion = a.getPreferredVersion("builds"), e.emptyMessage = "Loading...", e.aceLoaded = function(e) {
var t = e.getSession();
t.setOption("tabSize", 2), t.setOption("useSoftTabs", !0), e.$blockScrolling = 1 / 0;
};
var p, m = t("buildConfigForBuild"), f = t("buildStrategy"), g = [], h = function(t) {
e.updatedBuildConfig = angular.copy(t), e.envVars = f(e.updatedBuildConfig).env || [];
};
e.compareTriggers = function(e, t) {
return _.isNumber(e.value) ? -1 : "ConfigChange" === e.value ? -1 : "ConfigChange" === t.value ? 1 : "ImageChange" === e.value ? -1 : "ImageChange" === t.value ? 1 : e.value.localeCompare(t.value);
}, e.saveEnvVars = function() {
l.hideNotification("save-bc-env-error"), e.envVars = _.filter(e.envVars, "name"), f(e.updatedBuildConfig).env = d.compactEntries(angular.copy(e.envVars)), i.update("buildconfigs", n.buildconfig, e.updatedBuildConfig, p).then(function() {
l.addNotification({
type: "success",
message: "Environment variables for build config " + e.buildConfigName + " were successfully updated."
}), e.forms.bcEnvVars.$setPristine();
}, function(n) {
l.addNotification({
id: "save-bc-env-error",
type: "error",
message: "An error occurred updating environment variables for build config " + e.buildConfigName + ".",
details: t("getErrorDetails")(n)
});
});
}, e.clearEnvVarUpdates = function() {
h(e.buildConfig), e.forms.bcEnvVars.$setPristine();
};
var v, y = function(n, s) {
e.loaded = !0, e.buildConfig = n, e.buildConfigPaused = r.isPaused(e.buildConfig), e.buildConfig.spec.source.images && (e.imageSources = e.buildConfig.spec.source.images, e.imageSourcesPaths = [], e.imageSources.forEach(function(n) {
e.imageSourcesPaths.push(t("destinationSourcePair")(n.paths));
}));
var c = _.get(f(n), "from", {}), l = c.kind + "/" + c.name + "/" + (c.namespace || e.projectName);
v !== l && (_.includes([ "ImageStreamTag", "ImageStreamImage" ], c.kind) ? (v = l, i.get(a.kindToResource(c.kind), c.name, {
namespace: c.namespace || e.projectName
}, {
errorNotification: !1
}).then(function(t) {
e.BCEnvVarsFromImage = o.getEnvironment(t);
}, function() {
e.BCEnvVarsFromImage = [];
})) : e.BCEnvVarsFromImage = []), h(n), "DELETED" === s && (e.alerts.deleted = {
type: "warning",
message: "This build configuration has been deleted."
}, e.buildConfigDeleted = !0), !e.forms.bcEnvVars || e.forms.bcEnvVars.$pristine ? h(n) : e.alerts.background_update = {
type: "warning",
message: "This build configuration has been updated in the background. Saving your changes may create a conflict or cause loss of data.",
links: [ {
label: "Reload Environment Variables",
onClick: function() {
return e.clearEnvVarUpdates(), !0;
}
} ]
}, e.paused = r.isPaused(e.buildConfig);
};
u.get(n.project).then(_.spread(function(a, o) {
function l() {
s.getLabelSelector().isEmpty() || !$.isEmptyObject(e.builds) || $.isEmptyObject(e.unfilteredBuilds) ? delete e.alerts.builds : e.alerts.builds = {
type: "warning",
details: "The active filters are hiding all builds."
};
}
e.project = a, p = o, i.get(e.buildConfigsVersion, n.buildconfig, o, {
errorNotification: !1
}).then(function(t) {
y(t), g.push(i.watchObject(e.buildConfigsVersion, n.buildconfig, o, y));
}, function(n) {
e.loaded = !0, e.alerts.load = {
type: "error",
message: 404 === n.status ? "This build configuration can not be found, it may have been deleted." : "The build configuration details could not be loaded.",
details: 404 === n.status ? "Any remaining build history for this build will be shown." : t("getErrorDetails")(n)
};
}), g.push(i.watch(e.buildsVersion, o, function(t, a, o) {
if (e.emptyMessage = "No builds to show", a) {
if (m(o) === n.buildconfig) {
var i = o.metadata.name;
switch (a) {
case "ADDED":
case "MODIFIED":
e.unfilteredBuilds[i] = o;
break;

case "DELETED":
delete e.unfilteredBuilds[i];
}
}
} else e.unfilteredBuilds = r.validatedBuildsForBuildConfig(n.buildconfig, t.by("metadata.name"));
e.builds = s.getLabelSelector().select(e.unfilteredBuilds), l(), s.addLabelSuggestionsFromResources(e.unfilteredBuilds, e.labelSuggestions), s.setLabelSuggestions(e.labelSuggestions), e.orderedBuilds = r.sortBuilds(e.builds, !0), e.latestBuild = _.head(e.orderedBuilds);
}, {
http: {
params: {
labelSelector: t("labelName")("buildConfig") + "=" + _.truncate(e.buildConfigName, {
length: 63,
omission: ""
})
}
}
})), s.onActiveFiltersChanged(function(t) {
e.$apply(function() {
e.builds = t.select(e.unfilteredBuilds), e.orderedBuilds = r.sortBuilds(e.builds, !0), e.latestBuild = _.head(e.orderedBuilds), l();
});
}), e.startBuild = function() {
r.startBuild(e.buildConfig);
}, e.showJenkinsfileExamples = function() {
c.showJenkinsfileExamples();
}, e.$on("$destroy", function() {
i.unwatchAll(g);
});
}));
} ]), angular.module("openshiftConsole").controller("BuildController", [ "$scope", "$filter", "$routeParams", "APIService", "BuildsService", "DataService", "ModalsService", "Navigate", "ProjectsService", function(e, t, n, a, r, o, i, s, c) {
e.projectName = n.project, e.build = null, e.buildConfig = null, e.buildConfigName = n.buildconfig, e.builds = {}, e.alerts = {}, e.showSecret = !1, e.renderOptions = {
hideFilterWidget: !0
}, e.breadcrumbs = [], n.isPipeline ? (e.breadcrumbs.push({
title: "Pipelines",
link: "project/" + n.project + "/browse/pipelines"
}), n.buildconfig && e.breadcrumbs.push({
title: n.buildconfig,
link: "project/" + n.project + "/browse/pipelines/" + n.buildconfig
})) : (e.breadcrumbs.push({
title: "Builds",
link: "project/" + n.project + "/browse/builds"
}), n.buildconfig && e.breadcrumbs.push({
title: n.buildconfig,
link: "project/" + n.project + "/browse/builds/" + n.buildconfig
})), e.breadcrumbs.push({
title: n.build
}), e.buildsVersion = a.getPreferredVersion("builds"), e.buildConfigsVersion = a.getPreferredVersion("buildconfigs"), e.podsVersion = a.getPreferredVersion("pods");
var l, u = t("annotation"), d = [], p = function(t) {
e.logCanRun = !_.includes([ "New", "Pending", "Error" ], t.status.phase);
}, m = function() {
e.buildConfig ? e.canBuild = r.canBuild(e.buildConfig) : e.canBuild = !1;
};
c.get(n.project).then(_.spread(function(a, s) {
e.project = a, e.projectContext = s, e.logOptions = {};
var c = function() {
e.eventObjects = l ? [ e.build, l ] : [ e.build ];
}, f = function(t, n) {
e.loaded = !0, e.build = t, p(t), c();
var a = u(t, "buildNumber");
a && (e.breadcrumbs[2].title = "#" + a), "DELETED" === n && (e.alerts.deleted = {
type: "warning",
message: "This build has been deleted."
});
var r;
l || (r = u(t, "buildPod")) && o.get(e.podsVersion, r, s, {
errorNotification: !1
}).then(function(e) {
l = e, c();
});
}, g = function(t, n) {
"DELETED" === n && (e.alerts.deleted = {
type: "warning",
message: "Build configuration " + e.buildConfigName + " has been deleted."
}, e.buildConfigDeleted = !0), e.buildConfig = t, e.buildConfigPaused = r.isPaused(e.buildConfig), m();
};
o.get(e.buildsVersion, n.build, s, {
errorNotification: !1
}).then(function(t) {
f(t), d.push(o.watchObject(e.buildsVersion, n.build, s, f)), d.push(o.watchObject(e.buildConfigsVersion, n.buildconfig, s, g));
}, function(n) {
e.loaded = !0, e.alerts.load = {
type: "error",
message: "The build details could not be loaded.",
details: t("getErrorDetails")(n)
};
}), e.toggleSecret = function() {
e.showSecret = !0;
}, e.cancelBuild = function() {
r.cancelBuild(e.build, e.buildConfigName);
}, e.cloneBuild = function() {
e.build && e.canBuild && r.cloneBuild(e.build, e.buildConfigName);
}, e.showJenkinsfileExamples = function() {
i.showJenkinsfileExamples();
}, e.$on("$destroy", function() {
o.unwatchAll(d);
});
}));
} ]), angular.module("openshiftConsole").controller("ImageController", [ "$scope", "$routeParams", "DataService", "ProjectsService", "$filter", "ImageStreamsService", "imageLayers", function(e, t, n, a, r, o, i) {
function s(n, a) {
var r = o.tagsByName(n);
e.imageStream = n, e.tagsByName = r, e.tagName = t.tag;
var i = r[t.tag];
i ? (delete e.alerts.load, l(i, a)) : e.alerts.load = {
type: "error",
message: "The image tag was not found in the stream."
};
}
e.projectName = t.project, e.imageStream = null, e.image = null, e.layers = null, e.tagsByName = {}, e.alerts = {}, e.renderOptions = e.renderOptions || {}, e.renderOptions.hideFilterWidget = !0, e.breadcrumbs = [ {
title: "Image Streams",
link: "project/" + t.project + "/browse/images"
}, {
title: t.imagestream,
link: "project/" + t.project + "/browse/images/" + t.imagestream
}, {
title: ":" + t.tag
} ];
var c = [], l = _.debounce(function(a, o) {
var s = t.imagestream + ":" + t.tag;
n.get("imagestreamtags", s, o).then(function(t) {
e.loaded = !0, e.image = t.image, e.layers = i(e.image);
}, function(t) {
e.loaded = !0, e.alerts.load = {
type: "error",
message: "The image details could not be loaded.",
details: r("getErrorDetails")(t)
};
});
}, 200), u = function(t, n, a) {
s(t, n), "DELETED" === a && (e.alerts.deleted = {
type: "warning",
message: "This image stream has been deleted."
});
};
a.get(t.project).then(_.spread(function(a, o) {
e.project = a, n.get("imagestreams", t.imagestream, o, {
errorNotification: !1
}).then(function(e) {
u(e, o), c.push(n.watchObject("imagestreams", t.imagestream, o, function(e, t) {
u(e, o, t);
}));
}, function(t) {
e.loaded = !0, e.alerts.load = {
type: "error",
message: "The image stream details could not be loaded.",
details: r("getErrorDetails")(t)
};
}), e.$on("$destroy", function() {
n.unwatchAll(c);
});
}));
} ]), angular.module("openshiftConsole").controller("ImagesController", [ "$routeParams", "$scope", "DataService", "ProjectsService", "$filter", "LabelFilter", "Logger", function(e, t, n, a, r, o, i) {
t.projectName = e.project, t.imageStreams = {}, t.unfilteredImageStreams = {}, t.missingStatusTagsByImageStream = {}, t.builds = {}, t.labelSuggestions = {}, t.alerts = t.alerts || {}, t.emptyMessage = "Loading...";
var s = [];
a.get(e.project).then(_.spread(function(e, a) {
function r() {
angular.forEach(t.unfilteredImageStreams, function(e, n) {
var a = t.missingStatusTagsByImageStream[n] = {};
if (e.spec && e.spec.tags) {
var r = {};
e.status && e.status.tags && angular.forEach(e.status.tags, function(e) {
r[e.tag] = !0;
}), angular.forEach(e.spec.tags, function(e) {
r[e.name] || (a[e.name] = e);
});
}
});
}
function c() {
o.getLabelSelector().isEmpty() || !$.isEmptyObject(t.imageStreams) || $.isEmptyObject(t.unfilteredImageStreams) ? delete t.alerts.imageStreams : t.alerts.imageStreams = {
type: "warning",
details: "The active filters are hiding all image streams."
};
}
t.project = e, s.push(n.watch("imagestreams", a, function(e) {
t.unfilteredImageStreams = e.by("metadata.name"), o.addLabelSuggestionsFromResources(t.unfilteredImageStreams, t.labelSuggestions), o.setLabelSuggestions(t.labelSuggestions), t.imageStreams = o.getLabelSelector().select(t.unfilteredImageStreams), t.emptyMessage = "No image streams to show", r(), c(), i.log("image streams (subscribe)", t.imageStreams);
})), o.onActiveFiltersChanged(function(e) {
t.$apply(function() {
t.imageStreams = e.select(t.unfilteredImageStreams), c();
});
}), t.$on("$destroy", function() {
n.unwatchAll(s);
});
}));
} ]), angular.module("openshiftConsole").controller("ImageStreamController", [ "$scope", "$routeParams", "DataService", "ProjectsService", "$filter", "ImageStreamsService", "Navigate", function(e, t, n, a, r, o, i) {
e.projectName = t.project, e.imageStream = null, e.tags = [], e.tagShowOlder = {}, e.alerts = {}, e.renderOptions = e.renderOptions || {}, e.renderOptions.hideFilterWidget = !0, e.breadcrumbs = [ {
title: "Image Streams",
link: "project/" + t.project + "/browse/images"
}, {
title: t.imagestream
} ], e.emptyMessage = "Loading...";
var s = [];
a.get(t.project).then(_.spread(function(a, i) {
e.project = a, n.get("imagestreams", t.imagestream, i, {
errorNotification: !1
}).then(function(a) {
e.loaded = !0, e.imageStream = a, e.emptyMessage = "No tags to show", s.push(n.watchObject("imagestreams", t.imagestream, i, function(t, n) {
"DELETED" === n && (e.alerts.deleted = {
type: "warning",
message: "This image stream has been deleted."
}), e.imageStream = t, e.tags = _.toArray(o.tagsByName(e.imageStream));
}));
}, function(t) {
e.loaded = !0, e.alerts.load = {
type: "error",
message: "The image stream details could not be loaded.",
details: r("getErrorDetails")(t)
};
}), e.$on("$destroy", function() {
n.unwatchAll(s);
});
})), e.imagestreamPath = function(e, t) {
if (!t.status) return "";
var n = i.resourceURL(e.metadata.name, "ImageStream", e.metadata.namespace);
return t && (n += "/" + t.name), n;
};
} ]), angular.module("openshiftConsole").controller("DeploymentsController", [ "$scope", "$filter", "$routeParams", "DataService", "DeploymentsService", "LabelFilter", "Logger", "OwnerReferencesService", "ProjectsService", function(e, t, n, a, r, o, i, s, c) {
e.projectName = n.project, e.replicationControllers = {}, e.unfilteredDeploymentConfigs = {}, e.unfilteredDeployments = {}, e.replicationControllersByDC = {}, e.labelSuggestions = {}, e.alerts = e.alerts || {}, e.emptyMessage = "Loading...", e.expandedDeploymentConfigRow = {}, e.unfilteredReplicaSets = {}, e.unfilteredReplicationControllers = {};
var l, u, d = t("annotation"), p = function() {
l && u && (e.replicaSetsByDeploymentUID = s.groupByControllerUID(l), e.unfilteredReplicaSets = _.get(e, [ "replicaSetsByDeploymentUID", "" ], {}), o.addLabelSuggestionsFromResources(e.unfilteredReplicaSets, e.labelSuggestions), o.setLabelSuggestions(e.labelSuggestions), e.replicaSets = o.getLabelSelector().select(e.unfilteredReplicaSets), e.latestReplicaSetByDeploymentUID = {}, _.each(e.replicaSetsByDeploymentUID, function(t, n) {
n && (e.latestReplicaSetByDeploymentUID[n] = r.getActiveReplicaSet(t, u[n]));
}));
}, m = [];
c.get(n.project).then(_.spread(function(n, s) {
function c() {
o.getLabelSelector().isEmpty() ? delete e.alerts.deployments : _.isEmpty(e.unfilteredDeploymentConfigs) && _.isEmpty(e.unfilteredReplicationControllers) && _.isEmpty(e.unfilteredDeployments) && _.isEmpty(e.unfilteredReplicaSets) ? delete e.alerts.deployments : _.isEmpty(e.deploymentConfigs) && _.isEmpty(e.replicationControllersByDC[""]) && _.isEmpty(e.deployments) && _.isEmpty(e.replicaSets) ? e.alerts.deployments = {
type: "warning",
details: "The active filters are hiding all deployments."
} : delete e.alerts.deployments;
}
e.project = n, m.push(a.watch("replicationcontrollers", s, function(n, a, s) {
e.replicationControllers = n.by("metadata.name");
var l, u;
if (s && (l = d(s, "deploymentConfig"), u = s.metadata.name), e.replicationControllersByDC = r.associateDeploymentsToDeploymentConfig(e.replicationControllers, e.deploymentConfigs, !0), e.replicationControllersByDC[""] && (e.unfilteredReplicationControllers = e.replicationControllersByDC[""], o.addLabelSuggestionsFromResources(e.unfilteredReplicationControllers, e.labelSuggestions), o.setLabelSuggestions(e.labelSuggestions), e.replicationControllersByDC[""] = o.getLabelSelector().select(e.replicationControllersByDC[""])), c(), a) {
if ("ADDED" === a || "MODIFIED" === a && [ "New", "Pending", "Running" ].indexOf(t("deploymentStatus")(s)) > -1) e.deploymentConfigDeploymentsInProgress[l] = e.deploymentConfigDeploymentsInProgress[l] || {}, e.deploymentConfigDeploymentsInProgress[l][u] = s; else if ("MODIFIED" === a) {
var p = t("deploymentStatus")(s);
"Complete" !== p && "Failed" !== p || delete e.deploymentConfigDeploymentsInProgress[l][u];
}
} else e.deploymentConfigDeploymentsInProgress = r.associateRunningDeploymentToDeploymentConfig(e.replicationControllersByDC);
s ? "DELETED" !== a && (s.causes = t("deploymentCauses")(s)) : angular.forEach(e.replicationControllers, function(e) {
e.causes = t("deploymentCauses")(e);
}), i.log("replicationControllers (subscribe)", e.replicationControllers);
})), m.push(a.watch({
group: "extensions",
resource: "replicasets"
}, s, function(t) {
l = t.by("metadata.name"), p(), i.log("replicasets (subscribe)", e.replicaSets);
})), m.push(a.watch("deploymentconfigs", s, function(t) {
e.unfilteredDeploymentConfigs = t.by("metadata.name"), o.addLabelSuggestionsFromResources(e.unfilteredDeploymentConfigs, e.labelSuggestions), o.setLabelSuggestions(e.labelSuggestions), e.deploymentConfigs = o.getLabelSelector().select(e.unfilteredDeploymentConfigs), e.emptyMessage = "No deployment configurations to show", e.replicationControllersByDC = r.associateDeploymentsToDeploymentConfig(e.replicationControllers, e.deploymentConfigs, !0), e.replicationControllersByDC[""] && (e.unfilteredReplicationControllers = e.replicationControllersByDC[""], e.replicationControllersByDC[""] = o.getLabelSelector().select(e.replicationControllersByDC[""])), c(), i.log("deploymentconfigs (subscribe)", e.deploymentConfigs);
})), m.push(a.watch({
group: "apps",
resource: "deployments"
}, s, function(t) {
u = e.unfilteredDeployments = t.by("metadata.uid"), o.addLabelSuggestionsFromResources(e.unfilteredDeployments, e.labelSuggestions), o.setLabelSuggestions(e.labelSuggestions), e.deployments = o.getLabelSelector().select(e.unfilteredDeployments), p(), i.log("deployments (subscribe)", e.unfilteredDeployments);
})), e.showEmptyMessage = function() {
return 0 === t("hashSize")(e.replicationControllersByDC) || !(1 !== t("hashSize")(e.replicationControllersByDC) || !e.replicationControllersByDC[""]);
}, o.onActiveFiltersChanged(function(t) {
e.$apply(function() {
e.deploymentConfigs = t.select(e.unfilteredDeploymentConfigs), e.replicationControllersByDC = r.associateDeploymentsToDeploymentConfig(e.replicationControllers, e.deploymentConfigs, !0), e.replicationControllersByDC[""] && (e.unfilteredReplicationControllers = e.replicationControllersByDC[""], e.replicationControllersByDC[""] = o.getLabelSelector().select(e.replicationControllersByDC[""])), e.deployments = t.select(e.unfilteredDeployments), e.replicaSets = t.select(e.unfilteredReplicaSets), c();
});
}), e.$on("$destroy", function() {
a.unwatchAll(m);
});
}));
} ]), angular.module("openshiftConsole").controller("DeploymentController", [ "$scope", "$filter", "$routeParams", "DataService", "DeploymentsService", "HPAService", "ImageStreamResolver", "LabelFilter", "Logger", "ModalsService", "Navigate", "OwnerReferencesService", "ProjectsService", "StorageService", function(e, t, n, a, r, o, i, s, c, l, u, d, p, m) {
var f = {};
e.projectName = n.project, e.name = n.deployment, e.replicaSetsForDeployment = {}, e.unfilteredReplicaSetsForDeployment = {}, e.labelSuggestions = {}, e.emptyMessage = "Loading...", e.forms = {}, e.alerts = {}, e.imagesByDockerReference = {}, e.breadcrumbs = [ {
title: "Deployments",
link: "project/" + n.project + "/browse/deployments"
}, {
title: n.deployment
} ], e.healthCheckURL = u.healthCheckURL(n.project, "Deployment", n.deployment, "apps");
var g = [];
p.get(n.project).then(_.spread(function(u, p) {
function h() {
s.getLabelSelector().isEmpty() || !_.isEmpty(e.replicaSetsForDeployment) || _.isEmpty(e.unfilteredReplicaSetsForDeployment) ? delete e.alerts["filter-hiding-all"] : e.alerts["filter-hiding-all"] = {
type: "warning",
details: "The active filters are hiding all rollout history."
};
}
e.project = u, e.projectContext = p;
var v = {}, y = function() {
o.getHPAWarnings(e.deployment, e.autoscalers, v, u).then(function(t) {
e.hpaWarnings = t;
});
};
a.get({
group: "apps",
resource: "deployments"
}, n.deployment, p, {
errorNotification: !1
}).then(function(t) {
e.loaded = !0, e.deployment = t, y(), g.push(a.watchObject({
group: "apps",
resource: "deployments"
}, n.deployment, p, function(t, n) {
"DELETED" === n && (e.alerts.deleted = {
type: "warning",
message: "This deployment has been deleted."
}), e.deployment = t, e.updatingPausedState = !1, y(), i.fetchReferencedImageStreamImages([ t.spec.template ], e.imagesByDockerReference, f, p);
})), g.push(a.watch({
group: "extensions",
resource: "replicasets"
}, p, function(n) {
e.emptyMessage = "No deployments to show";
var a = n.by("metadata.name");
a = d.filterForController(a, t), e.inProgressDeployment = _.chain(a).filter("status.replicas").length > 1, e.unfilteredReplicaSetsForDeployment = r.sortByRevision(a), e.replicaSetsForDeployment = s.getLabelSelector().select(e.unfilteredReplicaSetsForDeployment), h(), s.addLabelSuggestionsFromResources(e.unfilteredReplicaSetsForDeployment, e.labelSuggestions), s.setLabelSuggestions(e.labelSuggestions);
}));
}, function(n) {
e.loaded = !0, e.alerts.load = {
type: "error",
message: 404 === n.status ? "This deployment can not be found, it may have been deleted." : "The deployment details could not be loaded.",
details: t("getErrorDetails")(n)
};
}), a.list("limitranges", p).then(function(e) {
v = e.by("metadata.name"), y();
}), g.push(a.watch("imagestreams", p, function(t) {
var n = t.by("metadata.name");
i.buildDockerRefMapForImageStreams(n, f), e.deployment && i.fetchReferencedImageStreamImages([ e.deployment.spec.template ], e.imagesByDockerReference, f, p), c.log("imagestreams (subscribe)", e.imageStreams);
})), g.push(a.watch({
group: "autoscaling",
resource: "horizontalpodautoscalers",
version: "v1"
}, p, function(t) {
e.autoscalers = o.filterHPA(t.by("metadata.name"), "Deployment", n.deployment), y();
})), g.push(a.watch("builds", p, function(t) {
e.builds = t.by("metadata.name"), c.log("builds (subscribe)", e.builds);
})), s.onActiveFiltersChanged(function(t) {
e.$evalAsync(function() {
e.replicaSetsForDeployment = t.select(e.unfilteredReplicaSetsForDeployment), h();
});
}), e.scale = function(n) {
r.scale(e.deployment, n).then(_.noop, function(n) {
e.alerts = e.alerts || {}, e.alerts.scale = {
type: "error",
message: "An error occurred scaling the deployment.",
details: t("getErrorDetails")(n)
};
});
}, e.setPaused = function(n) {
e.updatingPausedState = !0, r.setPaused(e.deployment, n, p).then(_.noop, function(a) {
e.updatingPausedState = !1, e.alerts = e.alerts || {}, e.alerts.scale = {
type: "error",
message: "An error occurred " + (n ? "pausing" : "resuming") + " the deployment.",
details: t("getErrorDetails")(a)
};
});
}, e.removeVolume = function(t) {
var n;
n = _.get(e, "deployment.spec.paused") ? "This will remove the volume from the deployment." : "This will remove the volume from the deployment and start a new rollout.", t.persistentVolumeClaim ? n += " It will not delete the persistent volume claim." : t.secret ? n += " It will not delete the secret." : t.configMap && (n += " It will not delete the config map.");
l.confirm({
message: "Remove volume " + t.name + "?",
details: n,
okButtonText: "Remove",
okButtonClass: "btn-danger",
cancelButtonText: "Cancel"
}).then(function() {
m.removeVolume(e.deployment, t, p);
});
}, e.$on("$destroy", function() {
a.unwatchAll(g);
});
}));
} ]), angular.module("openshiftConsole").controller("DeploymentConfigController", [ "$scope", "$filter", "$routeParams", "BreadcrumbsService", "DataService", "DeploymentsService", "HPAService", "ImageStreamResolver", "ModalsService", "Navigate", "NotificationsService", "Logger", "ProjectsService", "StorageService", "LabelFilter", "labelNameFilter", function(e, t, n, a, r, o, i, s, c, l, u, d, p, m, f, g) {
var h = {};
e.projectName = n.project, e.deploymentConfigName = n.deploymentconfig, e.deploymentConfig = null, e.deployments = {}, e.unfilteredDeployments = {}, e.imagesByDockerReference = {}, e.builds = {}, e.labelSuggestions = {}, e.forms = {}, e.alerts = {}, e.breadcrumbs = a.getBreadcrumbs({
name: n.deploymentconfig,
kind: "DeploymentConfig",
namespace: n.project
}), e.emptyMessage = "Loading...", e.healthCheckURL = l.healthCheckURL(n.project, "DeploymentConfig", n.deploymentconfig);
var v = t("mostRecent"), y = t("orderObjectsByDate"), b = [];
p.get(n.project).then(_.spread(function(a, l) {
function u() {
f.getLabelSelector().isEmpty() || !$.isEmptyObject(e.deployments) || $.isEmptyObject(e.unfilteredDeployments) ? delete e.alerts.deployments : e.alerts.deployments = {
type: "warning",
details: "The active filters are hiding all deployments."
};
}
e.project = a, e.projectContext = l;
var p = {}, C = function() {
i.getHPAWarnings(e.deploymentConfig, e.autoscalers, p, a).then(function(t) {
e.hpaWarnings = t;
});
};
r.get("deploymentconfigs", n.deploymentconfig, l, {
errorNotification: !1
}).then(function(a) {
e.loaded = !0, e.deploymentConfig = a, e.strategyParams = t("deploymentStrategyParams")(a), C(), b.push(r.watchObject("deploymentconfigs", n.deploymentconfig, l, function(t, n) {
"DELETED" === n && (e.alerts.deleted = {
type: "warning",
message: "This deployment configuration has been deleted."
}), e.deploymentConfig = t, e.updatingPausedState = !1, C(), s.fetchReferencedImageStreamImages([ t.spec.template ], e.imagesByDockerReference, h, l);
}));
}, function(n) {
e.loaded = !0, e.alerts.load = {
type: "error",
message: 404 === n.status ? "This deployment configuration can not be found, it may have been deleted." : "The deployment configuration details could not be loaded.",
details: 404 === n.status ? "Any remaining deployment history for this deployment will be shown." : t("getErrorDetails")(n)
};
}), b.push(r.watch("replicationcontrollers", l, function(a, r, i) {
var s = n.deploymentconfig;
if (e.emptyMessage = "No deployments to show", r) {
if (o.deploymentBelongsToConfig(i, n.deploymentconfig)) {
var c = i.metadata.name;
switch (r) {
case "ADDED":
case "MODIFIED":
e.unfilteredDeployments[c] = i, t("deploymentIsInProgress")(i) ? (e.deploymentConfigDeploymentsInProgress[s] = e.deploymentConfigDeploymentsInProgress[s] || {}, e.deploymentConfigDeploymentsInProgress[s][c] = i) : e.deploymentConfigDeploymentsInProgress[s] && delete e.deploymentConfigDeploymentsInProgress[s][c], i.causes = t("deploymentCauses")(i);
break;

case "DELETED":
delete e.unfilteredDeployments[c], e.deploymentConfigDeploymentsInProgress[s] && delete e.deploymentConfigDeploymentsInProgress[s][c];
}
}
} else {
var l = o.associateDeploymentsToDeploymentConfig(a.by("metadata.name"));
e.unfilteredDeployments = l[n.deploymentconfig] || {}, angular.forEach(e.unfilteredDeployments, function(e) {
e.causes = t("deploymentCauses")(e);
}), e.deploymentConfigDeploymentsInProgress = o.associateRunningDeploymentToDeploymentConfig(l);
}
e.deployments = f.getLabelSelector().select(e.unfilteredDeployments), e.orderedDeployments = y(e.deployments, !0), e.deploymentInProgress = !!_.size(e.deploymentConfigDeploymentsInProgress[s]), e.mostRecent = v(e.unfilteredDeployments), u(), f.addLabelSuggestionsFromResources(e.unfilteredDeployments, e.labelSuggestions), f.setLabelSuggestions(e.labelSuggestions);
}, {
http: {
params: {
labelSelector: g("deploymentConfig") + "=" + e.deploymentConfigName
}
}
})), r.list("limitranges", l).then(function(e) {
p = e.by("metadata.name"), C();
}), b.push(r.watch("imagestreams", l, function(t) {
var n = t.by("metadata.name");
s.buildDockerRefMapForImageStreams(n, h), e.deploymentConfig && s.fetchReferencedImageStreamImages([ e.deploymentConfig.spec.template ], e.imagesByDockerReference, h, l), d.log("imagestreams (subscribe)", e.imageStreams);
})), b.push(r.watch("builds", l, function(t) {
e.builds = t.by("metadata.name"), d.log("builds (subscribe)", e.builds);
})), b.push(r.watch({
group: "autoscaling",
resource: "horizontalpodautoscalers",
version: "v1"
}, l, function(t) {
e.autoscalers = i.filterHPA(t.by("metadata.name"), "DeploymentConfig", n.deploymentconfig), C();
})), f.onActiveFiltersChanged(function(t) {
e.$apply(function() {
e.deployments = t.select(e.unfilteredDeployments), e.orderedDeployments = y(e.deployments, !0), u();
});
}), e.canDeploy = function() {
return !!e.deploymentConfig && (!e.deploymentConfig.metadata.deletionTimestamp && (!e.deploymentInProgress && !e.deploymentConfig.spec.paused));
}, e.startLatestDeployment = function() {
e.canDeploy() && o.startLatestDeployment(e.deploymentConfig, l);
}, e.scale = function(n) {
o.scale(e.deploymentConfig, n).then(_.noop, function(n) {
e.alerts["scale-error"] = {
type: "error",
message: "An error occurred scaling the deployment config.",
details: t("getErrorDetails")(n)
};
});
}, e.setPaused = function(n) {
e.updatingPausedState = !0, o.setPaused(e.deploymentConfig, n, l).then(_.noop, function(a) {
e.updatingPausedState = !1, e.alerts["pause-error"] = {
type: "error",
message: "An error occurred " + (n ? "pausing" : "resuming") + " the deployment config.",
details: t("getErrorDetails")(a)
};
});
};
var S = function() {
if (_.get(e, "deploymentConfig.spec.paused")) return !1;
var t = _.get(e, "deploymentConfig.spec.triggers", []);
return _.some(t, {
type: "ConfigChange"
});
};
e.removeVolume = function(t) {
var n;
n = S() ? "This will remove the volume from the deployment config and trigger a new deployment." : "This will remove the volume from the deployment config.", t.persistentVolumeClaim ? n += " It will not delete the persistent volume claim." : t.secret ? n += " It will not delete the secret." : t.configMap && (n += " It will not delete the config map.");
c.confirm({
message: "Remove volume " + t.name + "?",
details: n,
okButtonText: "Remove",
okButtonClass: "btn-danger",
cancelButtonText: "Cancel"
}).then(function() {
m.removeVolume(e.deploymentConfig, t, l);
});
}, e.$on("$destroy", function() {
r.unwatchAll(b);
});
}));
} ]), angular.module("openshiftConsole").controller("ReplicaSetController", [ "$scope", "$filter", "$routeParams", "AuthorizationService", "BreadcrumbsService", "DataService", "DeploymentsService", "HPAService", "ImageStreamResolver", "Logger", "MetricsService", "ModalsService", "Navigate", "OwnerReferencesService", "PodsService", "ProjectsService", "StorageService", "keyValueEditorUtils", "kind", function(e, t, n, a, r, o, i, s, c, l, u, d, p, m, f, g, h, v, y) {
var b = !1, C = t("annotation"), S = t("humanizeKind")(y), w = t("hasDeployment");
switch (y) {
case "ReplicaSet":
e.resource = {
group: "extensions",
resource: "replicasets"
}, e.healthCheckURL = p.healthCheckURL(n.project, "ReplicaSet", n.replicaSet, "extensions");
break;

case "ReplicationController":
e.resource = "replicationcontrollers", e.healthCheckURL = p.healthCheckURL(n.project, "ReplicationController", n.replicaSet);
}
var k = {};
e.projectName = n.project, e.kind = y, e.replicaSet = null, e.deploymentConfig = null, e.deploymentConfigMissing = !1, e.imagesByDockerReference = {}, e.builds = {}, e.alerts = {}, e.renderOptions = e.renderOptions || {}, e.renderOptions.hideFilterWidget = !0, e.forms = {}, e.logOptions = {};
var j = [];
u.isAvailable().then(function(t) {
e.metricsAvailable = t;
});
var P = t("deploymentStatus"), R = function(t) {
e.logCanRun = !_.includes([ "New", "Pending" ], P(t));
}, I = t("isIE")() || t("isEdge")();
g.get(n.project).then(_.spread(function(u, g) {
e.project = u, e.projectContext = g;
var v = {}, T = function() {
if (e.hpaForRS = s.filterHPA(v, y, n.replicaSet), e.deploymentConfigName && e.isActive) {
var t = s.filterHPA(v, "DeploymentConfig", e.deploymentConfigName);
e.autoscalers = e.hpaForRS.concat(t);
} else if (e.deployment && e.isActive) {
var a = s.filterHPA(v, "Deployment", e.deployment.metadata.name);
e.autoscalers = e.hpaForRS.concat(a);
} else e.autoscalers = e.hpaForRS;
}, N = function() {
j.push(o.watch(e.resource, g, function(t) {
var n, a = [];
angular.forEach(t.by("metadata.name"), function(t) {
(C(t, "deploymentConfig") || "") === e.deploymentConfigName && a.push(t);
}), n = i.getActiveDeployment(a), e.isActive = n && n.metadata.uid === e.replicaSet.metadata.uid, T();
}));
}, E = function() {
s.getHPAWarnings(e.replicaSet, e.autoscalers, e.limitRanges, u).then(function(t) {
e.hpaWarnings = t;
});
}, D = function(a) {
var r = C(a, "deploymentConfig");
if (r) {
b = !0, e.deploymentConfigName = r;
var i = C(a, "deploymentVersion");
i && (e.logOptions.version = i), e.healthCheckURL = p.healthCheckURL(n.project, "DeploymentConfig", r), o.get("deploymentconfigs", r, g, {
errorNotification: !1
}).then(function(t) {
e.deploymentConfig = t;
}, function(n) {
404 !== n.status ? e.alerts.load = {
type: "error",
message: "The deployment configuration details could not be loaded.",
details: t("getErrorDetails")(n)
} : e.deploymentConfigMissing = !0;
});
}
}, A = function() {
e.isActive = i.isActiveReplicaSet(e.replicaSet, e.deployment);
}, $ = function(t) {
return _.some(t, function(t) {
if (_.get(t, "status.replicas") && _.get(t, "metadata.uid") !== _.get(e.replicaSet, "metadata.uid")) {
var n = m.getControllerReferences(t);
return _.some(n, {
uid: e.deployment.metadata.uid
});
}
});
}, B = !1, L = function() {
var t = m.getControllerReferences(e.replicaSet), a = _.find(t, {
kind: "Deployment"
});
a && o.get({
group: "apps",
resource: "deployments"
}, a.name, g).then(function(t) {
e.deployment = t, e.healthCheckURL = p.healthCheckURL(n.project, "Deployment", t.metadata.name, "apps"), j.push(o.watchObject({
group: "apps",
resource: "deployments"
}, t.metadata.name, g, function(t, a) {
if ("DELETED" === a) return e.alerts["deployment-deleted"] = {
type: "warning",
message: "The deployment controlling this replica set has been deleted."
}, e.healthCheckURL = p.healthCheckURL(n.project, "ReplicaSet", n.replicaSet, "extensions"), e.deploymentMissing = !0, void delete e.deployment;
e.deployment = t, e.breadcrumbs = r.getBreadcrumbs({
object: e.replicaSet,
displayName: "#" + i.getRevision(e.replicaSet),
parent: {
title: e.deployment.metadata.name,
link: p.resourceURL(e.deployment)
},
humanizedKind: "Deployments"
}), A(), T();
})), j.push(o.watch({
group: "extensions",
resource: "replicasets"
}, g, function(e) {
var t = e.by("metadata.name");
B = $(t);
}));
});
}, U = function() {
if (!_.isEmpty(k)) {
var t = _.get(e, "replicaSet.spec.template");
t && c.fetchReferencedImageStreamImages([ t ], e.imagesByDockerReference, k, g);
}
};
o.get(e.resource, n.replicaSet, g, {
errorNotification: !1
}).then(function(t) {
switch (e.loaded = !0, e.replicaSet = t, R(t), y) {
case "ReplicationController":
D(t);
break;

case "ReplicaSet":
L();
}
E(), e.breadcrumbs = r.getBreadcrumbs({
object: t
}), j.push(o.watchObject(e.resource, n.replicaSet, g, function(t, n) {
"DELETED" === n && (e.alerts.deleted = {
type: "warning",
message: "This " + S + " has been deleted."
}), e.replicaSet = t, R(t), E(), U(), e.deployment && A();
})), e.deploymentConfigName && N(), j.push(o.watch("pods", g, function(t) {
var n = t.by("metadata.name");
e.podsForDeployment = f.filterForOwner(n, e.replicaSet);
}));
}, function(a) {
e.loaded = !0, e.alerts.load = {
type: "error",
message: "The " + S + " details could not be loaded.",
details: t("getErrorDetails")(a)
}, e.breadcrumbs = r.getBreadcrumbs({
name: n.replicaSet,
kind: y,
namespace: n.project
});
}), j.push(o.watch(e.resource, g, function(n, a, r) {
e.replicaSets = n.by("metadata.name"), "ReplicationController" === y && (e.deploymentsByDeploymentConfig = i.associateDeploymentsToDeploymentConfig(e.replicaSets));
var o, s;
r && (o = C(r, "deploymentConfig"), s = r.metadata.name), e.deploymentConfigDeploymentsInProgress = e.deploymentConfigDeploymentsInProgress || {}, a ? "ADDED" === a || "MODIFIED" === a && t("deploymentIsInProgress")(r) ? (e.deploymentConfigDeploymentsInProgress[o] = e.deploymentConfigDeploymentsInProgress[o] || {}, e.deploymentConfigDeploymentsInProgress[o][s] = r) : "MODIFIED" === a && e.deploymentConfigDeploymentsInProgress[o] && delete e.deploymentConfigDeploymentsInProgress[o][s] : e.deploymentConfigDeploymentsInProgress = i.associateRunningDeploymentToDeploymentConfig(e.deploymentsByDeploymentConfig), r ? "DELETED" !== a && (r.causes = t("deploymentCauses")(r)) : angular.forEach(e.replicaSets, function(e) {
e.causes = t("deploymentCauses")(e);
});
})), j.push(o.watch("imagestreams", g, function(e) {
var t = e.by("metadata.name");
c.buildDockerRefMapForImageStreams(t, k), U(), l.log("imagestreams (subscribe)", t);
})), j.push(o.watch("builds", g, function(t) {
e.builds = t.by("metadata.name"), l.log("builds (subscribe)", e.builds);
})), j.push(o.watch({
group: "autoscaling",
resource: "horizontalpodautoscalers",
version: "v1"
}, g, function(e) {
v = e.by("metadata.name"), T(), E();
}, {
poll: I,
pollInterval: 6e4
})), o.list("limitranges", g).then(function(t) {
e.limitRanges = t.by("metadata.name"), E();
});
j.push(o.watch("resourcequotas", g, function(t) {
e.quotas = t.by("metadata.name");
}, {
poll: !0,
pollInterval: 6e4
})), j.push(o.watch("appliedclusterresourcequotas", g, function(t) {
e.clusterQuotas = t.by("metadata.name");
}, {
poll: !0,
pollInterval: 6e4
}));
var O = t("deploymentIsLatest");
e.showRollbackAction = function() {
return "Complete" === P(e.replicaSet) && !O(e.replicaSet, e.deploymentConfig) && !e.replicaSet.metadata.deletionTimestamp && a.canI("deploymentconfigrollbacks", "create");
}, e.retryFailedDeployment = function(t) {
i.retryFailedDeployment(t, g, e);
}, e.rollbackToDeployment = function(t, n, a, r) {
i.rollbackToDeployment(t, n, a, r, g, e);
}, e.cancelRunningDeployment = function(e) {
i.cancelRunningDeployment(e, g);
}, e.scale = function(n) {
var a = e.deployment || e.deploymentConfig || e.replicaSet;
i.scale(a, n).then(_.noop, function(n) {
e.alerts = e.alerts || {}, e.alerts.scale = {
type: "error",
message: "An error occurred scaling.",
details: t("getErrorDetails")(n)
};
});
};
var F = t("hasDeploymentConfig");
e.isScalable = function() {
return !!_.isEmpty(e.autoscalers) && (!F(e.replicaSet) && !w(e.replicaSet) || (!(!e.deploymentConfigMissing && !e.deploymentMissing) || !(!e.deploymentConfig && !e.deployment) && (e.isActive && !B)));
}, e.removeVolume = function(n) {
var a = "This will remove the volume from the " + t("humanizeKind")(e.replicaSet.kind) + ".";
n.persistentVolumeClaim ? a += " It will not delete the persistent volume claim." : n.secret ? a += " It will not delete the secret." : n.configMap && (a += " It will not delete the config map.");
d.confirm({
message: "Remove volume " + n.name + "?",
details: a,
okButtonText: "Remove",
okButtonClass: "btn-danger",
cancelButtonText: "Cancel"
}).then(function() {
h.removeVolume(e.replicaSet, n, g);
});
}, e.$on("$destroy", function() {
o.unwatchAll(j);
});
}));
} ]), angular.module("openshiftConsole").controller("StatefulSetsController", [ "$scope", "$routeParams", "DataService", "ProjectsService", "LabelFilter", "PodsService", function(e, t, n, a, r, o) {
e.projectName = t.project, e.alerts = e.alerts || {}, e.labelSuggestions = {};
var i = [];
a.get(t.project).then(_.spread(function(t, a) {
function s() {
r.getLabelSelector().isEmpty() || !$.isEmptyObject(e.statefulSets) || $.isEmptyObject(e.unfilteredStatefulSets) ? delete e.alerts.statefulsets : e.alerts.statefulsets = {
type: "warning",
details: "The active filters are hiding all stateful sets."
};
}
e.project = t, i.push(n.watch({
resource: "statefulsets",
group: "apps",
version: "v1beta1"
}, a, function(t) {
angular.extend(e, {
loaded: !0,
unfilteredStatefulSets: t.by("metadata.name")
}), e.statefulSets = r.getLabelSelector().select(e.unfilteredStatefulSets), r.addLabelSuggestionsFromResources(e.unfilteredStatefulSets, e.labelSuggestions), r.setLabelSuggestions(e.labelSuggestions), s();
})), i.push(n.watch("pods", a, function(t) {
e.pods = t.by("metadata.name"), e.podsByOwnerUID = o.groupByOwnerUID(e.pods);
})), r.onActiveFiltersChanged(function(t) {
e.$apply(function() {
e.statefulSets = t.select(e.unfilteredStatefulSets), s();
});
}), e.$on("$destroy", function() {
n.unwatchAll(i);
});
}));
} ]), angular.module("openshiftConsole").controller("StatefulSetController", [ "$filter", "$scope", "$routeParams", "BreadcrumbsService", "DataService", "MetricsService", "ProjectsService", "PodsService", function(e, t, n, a, r, o, i, s) {
t.projectName = n.project, t.statefulSetName = n.statefulset, t.forms = {}, t.alerts = {}, t.breadcrumbs = a.getBreadcrumbs({
name: t.statefulSetName,
kind: "StatefulSet",
namespace: n.project
});
var c, l = [], u = t.resourceGroupVersion = {
resource: "statefulsets",
group: "apps",
version: "v1beta1"
};
o.isAvailable().then(function(e) {
t.metricsAvailable = e;
}), i.get(n.project).then(_.spread(function(n, a) {
c = a, r.get(u, t.statefulSetName, a, {
errorNotification: !1
}).then(function(e) {
angular.extend(t, {
project: n,
projectContext: a,
statefulSet: e,
loaded: !0,
isScalable: function() {
return !1;
},
scale: function() {}
}), l.push(r.watchObject(u, t.statefulSetName, a, function(e) {
t.statefulSet = e;
})), l.push(r.watch("pods", a, function(n) {
var a = n.by("metadata.name");
t.podsForStatefulSet = s.filterForOwner(a, e);
}));
l.push(r.watch("resourcequotas", a, function(e) {
t.quotas = e.by("metadata.name");
}, {
poll: !0,
pollInterval: 6e4
})), l.push(r.watch("appliedclusterresourcequotas", a, function(e) {
t.clusterQuotas = e.by("metadata.name");
}, {
poll: !0,
pollInterval: 6e4
}));
}, function(n) {
t.loaded = !0, t.alerts.load = {
type: "error",
message: "The stateful set details could not be loaded.",
details: e("getErrorDetails")(n)
};
});
})), t.$on("$destroy", function() {
r.unwatchAll(l);
});
} ]), angular.module("openshiftConsole").controller("ServicesController", [ "$routeParams", "$scope", "DataService", "ProjectsService", "$filter", "LabelFilter", "Logger", function(e, t, n, a, r, o, i) {
t.projectName = e.project, t.services = {}, t.unfilteredServices = {}, t.routesByService = {}, t.routes = {}, t.labelSuggestions = {}, t.alerts = t.alerts || {}, t.emptyMessage = "Loading...", t.emptyMessageRoutes = "Loading...";
var s = [];
a.get(e.project).then(_.spread(function(e, a) {
function r() {
o.getLabelSelector().isEmpty() || !$.isEmptyObject(t.services) || $.isEmptyObject(t.unfilteredServices) ? delete t.alerts.services : t.alerts.services = {
type: "warning",
details: "The active filters are hiding all services."
};
}
t.project = e, s.push(n.watch("services", a, function(e) {
t.unfilteredServices = e.by("metadata.name"), o.addLabelSuggestionsFromResources(t.unfilteredServices, t.labelSuggestions), o.setLabelSuggestions(t.labelSuggestions), t.services = o.getLabelSelector().select(t.unfilteredServices), t.emptyMessage = "No services to show", r(), i.log("services (subscribe)", t.unfilteredServices);
})), o.onActiveFiltersChanged(function(e) {
t.$apply(function() {
t.services = e.select(t.unfilteredServices), r();
});
}), t.$on("$destroy", function() {
n.unwatchAll(s);
});
}));
} ]), angular.module("openshiftConsole").controller("ServiceController", [ "$scope", "$routeParams", "DataService", "ProjectsService", "$filter", function(e, t, n, a, r) {
e.projectName = t.project, e.service = null, e.services = null, e.alerts = {}, e.renderOptions = e.renderOptions || {}, e.renderOptions.hideFilterWidget = !0, e.breadcrumbs = [ {
title: "Services",
link: "project/" + t.project + "/browse/services"
}, {
title: t.service
} ], e.podFailureReasons = {
Pending: "This pod will not receive traffic until all of its containers have been created."
};
var o = {}, i = [], s = function() {
e.service && (e.portsByRoute = {}, _.each(e.service.spec.ports, function(t) {
var n = !1;
t.nodePort && (e.showNodePorts = !0), _.each(e.routesForService, function(a) {
a.spec.port && a.spec.port.targetPort !== t.name && a.spec.port.targetPort !== t.targetPort || (e.portsByRoute[a.metadata.name] = e.portsByRoute[a.metadata.name] || [], e.portsByRoute[a.metadata.name].push(t), n = !0);
}), n || (e.portsByRoute[""] = e.portsByRoute[""] || [], e.portsByRoute[""].push(t));
}));
}, c = function() {
if (e.podsForService = {}, e.service) {
var t = new LabelSelector(e.service.spec.selector);
e.podsForService = t.select(o);
}
}, l = function(t, n) {
e.loaded = !0, e.service = t, c(), s(), "DELETED" === n && (e.alerts.deleted = {
type: "warning",
message: "This service has been deleted."
});
};
a.get(t.project).then(_.spread(function(a, u) {
e.project = a, e.projectContext = u, n.get("services", t.service, u, {
errorNotification: !1
}).then(function(e) {
l(e), i.push(n.watchObject("services", t.service, u, l));
}, function(t) {
e.loaded = !0, e.alerts.load = {
type: "error",
message: "The service details could not be loaded.",
details: r("getErrorDetails")(t)
};
}), i.push(n.watch("services", u, function(t) {
e.services = t.by("metadata.name");
})), i.push(n.watch("pods", u, function(e) {
o = e.by("metadata.name"), c();
})), i.push(n.watch("endpoints", u, function(n) {
e.podsWithEndpoints = {};
var a = n.by("metadata.name")[t.service];
a && _.each(a.subsets, function(t) {
_.each(t.addresses, function(t) {
"Pod" === _.get(t, "targetRef.kind") && (e.podsWithEndpoints[t.targetRef.name] = !0);
});
});
})), i.push(n.watch("routes", u, function(n) {
e.routesForService = {}, angular.forEach(n.by("metadata.name"), function(n) {
"Service" === n.spec.to.kind && n.spec.to.name === t.service && (e.routesForService[n.metadata.name] = n);
}), s(), Logger.log("routes (subscribe)", e.routesByService);
})), e.$on("$destroy", function() {
n.unwatchAll(i);
});
}));
} ]), angular.module("openshiftConsole").controller("ServiceInstancesController", [ "$scope", "$filter", "$routeParams", "APIService", "BindingService", "Constants", "DataService", "LabelFilter", "Logger", "ProjectsService", function(e, t, n, a, r, o, i, s, c, l) {
e.alerts = {}, e.bindingsByInstanceRef = {}, e.emptyMessage = "Loading...", e.labelSuggestions = {}, e.projectName = n.project, e.serviceClasses = {}, e.serviceInstances = {}, e.unfilteredServiceInstances = {};
var u = [], d = function() {
e.serviceInstances = s.getLabelSelector().select(e.unfilteredServiceInstances);
}, p = function() {
e.unfilteredServiceInstances = r.sortServiceInstances(e.unfilteredServiceInstances, e.serviceClasses);
};
l.get(n.project).then(_.spread(function(t, n) {
function a() {
s.getLabelSelector().isEmpty() || !_.isEmpty(e.serviceInstances) || _.isEmpty(e.unfilteredServiceInstances) ? delete e.alerts["all-instances-filtered"] : e.alerts["all-instances-filtered"] = {
type: "warning",
details: "The active filters are hiding all provisioned services."
};
}
e.project = t, e.projectContext = n, u.push(i.watch({
group: "servicecatalog.k8s.io",
resource: "serviceinstancecredentials"
}, n, function(t) {
var n = t.by("metadata.name");
e.bindingsByInstanceRef = _.groupBy(n, "spec.instanceRef.name");
})), u.push(i.watch({
group: "servicecatalog.k8s.io",
resource: "serviceinstances"
}, n, function(t) {
e.emptyMessage = "No provisioned services to show", e.unfilteredServiceInstances = t.by("metadata.name"), p(), d(), a(), s.addLabelSuggestionsFromResources(e.unfilteredServiceInstances, e.labelSuggestions), s.setLabelSuggestions(e.labelSuggestions), c.log("provisioned services (subscribe)", e.unfilteredServiceInstances);
})), i.list({
group: "servicecatalog.k8s.io",
resource: "serviceclasses"
}, {}, function(t) {
e.serviceClasses = t.by("metadata.name"), p(), d();
}), s.onActiveFiltersChanged(function(t) {
e.$evalAsync(function() {
e.serviceInstances = t.select(e.unfilteredServiceInstances), a();
});
}), e.$on("$destroy", function() {
i.unwatchAll(u);
});
}));
} ]), angular.module("openshiftConsole").controller("ServiceInstanceController", [ "$scope", "$filter", "$routeParams", "DataService", "ProjectsService", "ServiceInstancesService", function(e, t, n, a, r, o) {
e.alerts = {}, e.projectName = n.project, e.serviceInstance = null, e.serviceClass = null, e.serviceClasses = null, e.breadcrumbs = [ {
title: "Provisioned Services",
link: "project/" + n.project + "/browse/service-instances"
} ], e.deprovision = function() {
o.deprovision(e.serviceInstance);
};
var i = [], s = function() {
e.serviceInstance && e.serviceClasses && e.breadcrumbs.push({
title: t("serviceInstanceDisplayName")(e.serviceInstance, e.serviceClasses)
});
}, c = function() {
if (e.serviceInstance && e.serviceClasses) {
var t = _.get(e.serviceInstance.spec, "serviceClassName");
e.serviceClass = _.get(e.serviceClasses, [ t ]), e.plan = _.find(_.get(e.serviceClass, "plans"), {
name: e.serviceInstance.spec.planName
});
}
}, l = function(t, n) {
e.loaded = !0, e.serviceInstance = t, "DELETED" === n && (e.alerts.deleted = {
type: "warning",
message: "This provisioned service has been deleted."
}), c();
};
r.get(n.project).then(_.spread(function(r, o) {
e.project = r, e.projectContext = o, a.get({
group: "servicecatalog.k8s.io",
resource: "serviceinstances"
}, n.instance, o, {
errorNotification: !1
}).then(function(e) {
l(e), s(), i.push(a.watchObject({
group: "servicecatalog.k8s.io",
resource: "serviceinstances"
}, n.instance, o, l));
}, function(n) {
e.loaded = !0, e.alerts.load = {
type: "error",
message: "The service details could not be loaded.",
details: t("getErrorDetails")(n)
};
}), a.list({
group: "servicecatalog.k8s.io",
resource: "serviceclasses"
}, {}, function(t) {
e.serviceClasses = t.by("metadata.name"), c(), s();
}), e.$on("$destroy", function() {
a.unwatchAll(i);
});
}));
} ]), angular.module("openshiftConsole").controller("SecretsController", [ "$routeParams", "$scope", "DataService", "ProjectsService", function(e, t, n, a) {
t.projectName = e.project, t.secretsByType = {}, t.alerts = t.alerts || {}, a.get(e.project).then(_.spread(function(e, a) {
t.project = e, t.context = a, n.list("secrets", a).then(function(e) {
t.secrets = _.sortBy(e.by("metadata.name"), [ "type", "metadata.name" ]), t.loaded = !0;
});
}));
} ]), angular.module("openshiftConsole").controller("SecretController", [ "$routeParams", "$filter", "$scope", "DataService", "ProjectsService", "SecretsService", function(e, t, n, a, r, o) {
n.projectName = e.project, n.secretName = e.secret, n.view = {
showSecret: !1
}, n.alerts = n.alerts || {}, n.breadcrumbs = [ {
title: "Secrets",
link: "project/" + e.project + "/browse/secrets"
}, {
title: n.secretName
} ], n.addToApplicationVisible = !1, n.addToApplication = function() {
n.addToApplicationVisible = !0;
}, n.closeAddToApplication = function() {
n.addToApplicationVisible = !1;
}, r.get(e.project).then(_.spread(function(e, t) {
n.project = e, n.context = t, a.get("secrets", n.secretName, t, {
errorNotification: !1
}).then(function(e) {
n.secret = e, n.decodedSecretData = o.decodeSecretData(n.secret.data), n.loaded = !0;
}, function(e) {
n.loaded = !0, n.error = e;
});
}));
} ]), angular.module("openshiftConsole").controller("CreateSecretController", [ "$filter", "$location", "$routeParams", "$scope", "$window", "ApplicationGenerator", "AuthorizationService", "DataService", "Navigate", "ProjectsService", function(e, t, n, a, r, o, i, s, c, l) {
a.alerts = {}, a.projectName = n.project, a.breadcrumbs = [ {
title: "Secrets",
link: "project/" + a.projectName + "/browse/secrets"
}, {
title: "Create Secret"
} ], l.get(n.project).then(_.spread(function(e, o) {
a.project = e, a.context = o, i.canI("secrets", "create", n.project) ? a.navigateBack = function() {
n.then ? t.url(n.then) : r.history.back();
} : c.toErrorPage("You do not have authority to create secrets in project " + n.project + ".", "access_denied");
}));
} ]), angular.module("openshiftConsole").controller("ConfigMapsController", [ "$scope", "$routeParams", "APIService", "DataService", "LabelFilter", "ProjectsService", function(e, t, n, a, r, o) {
e.projectName = t.project, e.alerts = e.alerts || {}, e.loaded = !1, e.labelSuggestions = {}, e.configMapsVersion = n.getPreferredVersion("configmaps");
var i, s = [], c = function() {
r.getLabelSelector().isEmpty() || !_.isEmpty(e.configMaps) || _.isEmpty(i) ? delete e.alerts["config-maps"] : e.alerts["config-maps"] = {
type: "warning",
details: "The active filters are hiding all config maps."
};
}, l = function() {
r.addLabelSuggestionsFromResources(i, e.labelSuggestions), r.setLabelSuggestions(e.labelSuggestions);
}, u = function() {
var t = r.getLabelSelector().select(i);
e.configMaps = _.sortBy(t, "metadata.name"), c();
};
o.get(t.project).then(_.spread(function(t, n) {
e.project = t, s.push(a.watch(e.configMapsVersion, n, function(t) {
i = t.by("metadata.name"), l(), u(), e.loaded = !0;
})), r.onActiveFiltersChanged(function() {
e.$apply(u);
}), e.$on("$destroy", function() {
a.unwatchAll(s);
});
}));
} ]), angular.module("openshiftConsole").controller("ConfigMapController", [ "$scope", "$routeParams", "APIService", "BreadcrumbsService", "DataService", "ProjectsService", function(e, t, n, a, r, o) {
e.projectName = t.project, e.alerts = e.alerts || {}, e.loaded = !1, e.labelSuggestions = {}, e.breadcrumbs = a.getBreadcrumbs({
name: t.configMap,
kind: "ConfigMap",
namespace: t.project
}), e.configMapsVersion = n.getPreferredVersion("configmaps");
var i = [], s = function(t, n) {
e.loaded = !0, e.configMap = t, "DELETED" === n && (e.alerts.deleted = {
type: "warning",
message: "This config map has been deleted."
});
};
e.addToApplicationVisible = !1, e.addToApplication = function() {
e.addToApplicationVisible = !0;
}, e.closeAddToApplication = function() {
e.addToApplicationVisible = !1;
}, o.get(t.project).then(_.spread(function(n, a) {
e.project = n, r.get(e.configMapsVersion, t.configMap, a, {
errorNotification: !1
}).then(function(e) {
s(e), i.push(r.watchObject("configmaps", t.configMap, a, s));
}, function(t) {
e.loaded = !0, e.error = t;
}), e.$on("$destroy", function() {
r.unwatchAll(i);
});
}));
} ]), angular.module("openshiftConsole").controller("CreateConfigMapController", [ "$filter", "$routeParams", "$scope", "$window", "AuthorizationService", "DataService", "Navigate", "NotificationsService", "ProjectsService", function(e, t, n, a, r, o, i, s, c) {
n.projectName = t.project, n.breadcrumbs = [ {
title: "Config Maps",
link: "project/" + n.projectName + "/browse/config-maps"
}, {
title: "Create Config Map"
} ];
var l = function() {
s.hideNotification("create-config-map-error");
};
n.$on("$destroy", l);
var u = function() {
a.history.back();
};
n.cancel = u, c.get(t.project).then(_.spread(function(a, c) {
n.project = a, r.canI("configmaps", "create", t.project) ? (n.configMap = {
apiVersion: "v1",
kind: "ConfigMap",
metadata: {
namespace: t.project
},
data: {}
}, n.createConfigMap = function() {
n.createConfigMapForm.$valid && (l(), n.disableInputs = !0, o.create("configmaps", null, n.configMap, c).then(function() {
s.addNotification({
type: "success",
message: "Config map " + n.configMap.metadata.name + " successfully created."
}), u();
}, function(t) {
n.disableInputs = !1, s.addNotification({
id: "create-config-map-error",
type: "error",
message: "An error occurred creating the config map.",
details: e("getErrorDetails")(t)
});
}));
}) : i.toErrorPage("You do not have authority to create config maps in project " + t.project + ".", "access_denied");
}));
} ]), angular.module("openshiftConsole").controller("RoutesController", [ "$routeParams", "$scope", "DataService", "$filter", "LabelFilter", "ProjectsService", function(e, t, n, a, r, o) {
t.projectName = e.project, t.unfilteredRoutes = {}, t.routes = {}, t.labelSuggestions = {}, t.alerts = t.alerts || {}, t.emptyMessage = "Loading...";
var i = [];
o.get(e.project).then(_.spread(function(e, a) {
function o() {
r.getLabelSelector().isEmpty() || !$.isEmptyObject(t.routes) || $.isEmptyObject(t.unfilteredRoutes) ? delete t.alerts.routes : t.alerts.routes = {
type: "warning",
details: "The active filters are hiding all routes."
};
}
t.project = e, i.push(n.watch("routes", a, function(e) {
t.unfilteredRoutes = e.by("metadata.name"), r.addLabelSuggestionsFromResources(t.unfilteredRoutes, t.labelSuggestions), r.setLabelSuggestions(t.labelSuggestions), t.routes = r.getLabelSelector().select(t.unfilteredRoutes), t.emptyMessage = "No routes to show", o();
})), i.push(n.watch("services", a, function(e) {
t.services = e.by("metadata.name");
})), r.onActiveFiltersChanged(function(e) {
t.$apply(function() {
t.routes = e.select(t.unfilteredRoutes), o();
});
}), t.$on("$destroy", function() {
n.unwatchAll(i);
});
}));
} ]), angular.module("openshiftConsole").controller("RouteController", [ "$scope", "$filter", "$routeParams", "AlertMessageService", "DataService", "ProjectsService", "RoutesService", function(e, t, n, a, r, o, i) {
e.projectName = n.project, e.route = null, e.alerts = {}, e.renderOptions = e.renderOptions || {}, e.renderOptions.hideFilterWidget = !0, e.breadcrumbs = [ {
title: "Routes",
link: "project/" + n.project + "/browse/routes"
}, {
title: n.route
} ];
var s, c = [], l = function(t, n) {
e.loaded = !0, e.route = t, s = i.isCustomHost(t), "DELETED" === n && (e.alerts.deleted = {
type: "warning",
message: "This route has been deleted."
});
}, u = function(t) {
return "router-host-" + _.get(e, "route.metadata.uid") + "-" + t.host + "-" + t.routerCanonicalHostname;
};
e.showRouterHostnameAlert = function(t, n) {
if (!s) return !1;
if (!t || !t.host || !t.routerCanonicalHostname) return !1;
if (!n || "True" !== n.status) return !1;
var r = u(t);
return !a.isAlertPermanentlyHidden(r, e.projectName);
}, e.hideRouterHostnameAlert = function(t) {
var n = u(t);
a.permanentlyHideAlert(n, e.projectName);
}, o.get(n.project).then(_.spread(function(a, o) {
e.project = a, r.get("routes", n.route, o, {
errorNotification: !1
}).then(function(e) {
l(e), c.push(r.watchObject("routes", n.route, o, l));
}, function(n) {
e.loaded = !0, e.alerts.load = {
type: "error",
message: "The route details could not be loaded.",
details: t("getErrorDetails")(n)
};
}), c.push(r.watch("services", o, function(t) {
e.services = t.by("metadata.name");
})), e.$on("$destroy", function() {
r.unwatchAll(c);
});
}));
} ]), angular.module("openshiftConsole").controller("StorageController", [ "$routeParams", "$scope", "AlertMessageService", "DataService", "ProjectsService", "QuotaService", "$filter", "LabelFilter", "Logger", function(e, t, n, a, r, o, i, s, c) {
t.projectName = e.project, t.pvcs = {}, t.unfilteredPVCs = {}, t.labelSuggestions = {}, t.alerts = t.alerts || {}, t.outOfClaims = !1, t.emptyMessage = "Loading...";
var l = function() {
var e = n.isAlertPermanentlyHidden("storage-quota-limit-reached", t.projectName);
if (t.outOfClaims = o.isAnyStorageQuotaExceeded(t.quotas, t.clusterQuotas), !e && t.outOfClaims) {
if (t.alerts.quotaExceeded) return;
t.alerts.quotaExceeded = {
type: "warning",
message: "Storage quota limit has been reached. You will not be able to create any new storage.",
links: [ {
href: "project/" + t.projectName + "/quota",
label: "View Quota"
}, {
href: "",
label: "Don't Show Me Again",
onClick: function() {
return n.permanentlyHideAlert("storage-quota-limit-reached", t.projectName), !0;
}
} ]
};
} else delete t.alerts.quotaExceeded;
}, u = [];
r.get(e.project).then(_.spread(function(e, n) {
function r() {
s.getLabelSelector().isEmpty() || !$.isEmptyObject(t.pvcs) || $.isEmptyObject(t.unfilteredPVCs) ? delete t.alerts.storage : t.alerts.storage = {
type: "warning",
details: "The active filters are hiding all persistent volume claims."
};
}
t.project = e, u.push(a.watch("persistentvolumeclaims", n, function(e) {
t.unfilteredPVCs = e.by("metadata.name"), s.addLabelSuggestionsFromResources(t.unfilteredPVCs, t.labelSuggestions), s.setLabelSuggestions(t.labelSuggestions), t.pvcs = s.getLabelSelector().select(t.unfilteredPVCs), t.emptyMessage = "No persistent volume claims to show", r(), c.log("pvcs (subscribe)", t.unfilteredPVCs);
})), s.onActiveFiltersChanged(function(e) {
t.$apply(function() {
t.pvcs = e.select(t.unfilteredPVCs), r();
});
}), t.$on("$destroy", function() {
a.unwatchAll(u);
}), a.list("resourcequotas", {
namespace: t.projectName
}, function(e) {
t.quotas = e.by("metadata.name"), l();
}), a.list("appliedclusterresourcequotas", {
namespace: t.projectName
}, function(e) {
t.clusterQuotas = e.by("metadata.name"), l();
});
}));
} ]), angular.module("openshiftConsole").controller("OtherResourcesController", [ "$routeParams", "$location", "$scope", "AuthorizationService", "DataService", "ProjectsService", "$filter", "LabelFilter", "Logger", "APIService", function(e, t, n, a, r, o, i, s, c, l) {
function u() {
s.getLabelSelector().isEmpty() || !$.isEmptyObject(n.resources) || $.isEmptyObject(n.unfilteredResources) ? delete n.alerts.resources : n.alerts.resources = {
type: "warning",
details: "The active filters are hiding all " + l.kindToResource(n.kindSelector.selected.kind, !0) + "."
};
}
function d() {
var e = n.kindSelector.selected;
if (e) {
var a = t.search();
a.kind = e.kind, a.group = e.group || "", t.replace().search(a), n.selectedResource = {
resource: l.kindToResource(e.kind),
group: e.group || ""
}, r.list({
group: e.group,
resource: l.kindToResource(e.kind)
}, n.context).then(function(t) {
n.unfilteredResources = t.by("metadata.name"), n.labelSuggestions = {}, s.addLabelSuggestionsFromResources(n.unfilteredResources, n.labelSuggestions), s.setLabelSuggestions(n.labelSuggestions), n.resources = s.getLabelSelector().select(n.unfilteredResources), n.emptyMessage = "No " + l.kindToResource(e.kind, !0) + " to show", u();
});
}
}
n.projectName = e.project, n.labelSuggestions = {}, n.alerts = n.alerts || {}, n.emptyMessage = "Select a resource from the list above ...", n.kindSelector = {
disabled: !0
}, n.kinds = _.filter(l.availableKinds(), function(e) {
switch (e.kind) {
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
});
var p = function(e) {
if (e) {
var t = l.kindToResourceGroupVersion(e), n = l.apiInfo(t);
return !n || !n.verbs || _.includes(n.verbs, "list");
}
};
n.getReturnURL = function() {
var t = _.get(n, "kindSelector.selected.kind");
return t ? URI.expand("project/{projectName}/browse/other?kind={kind}&group={group}", {
projectName: e.project,
kind: t,
group: _.get(n, "kindSelector.selected.group", "")
}).toString() : "";
};
var m;
n.isDuplicateKind = function(e) {
return m || (m = _.countBy(n.kinds, "kind")), m[e] > 1;
};
var f = function(e, t) {
return _.some(n.kinds, function(n) {
return n.kind === e && (!n.group && !t || n.group === t);
});
};
o.get(e.project).then(_.spread(function(t, r) {
n.kinds = _.filter(n.kinds, function(e) {
var t = {
resource: l.kindToResource(e.kind),
group: e.group || ""
};
return !!p(e) && (!!a.checkResource(t.resource) && a.canI(t, "list", n.projectName));
}), n.project = t, n.context = r, n.kindSelector.disabled = !1, e.kind && f(e.kind, e.group) && (_.set(n, "kindSelector.selected.kind", e.kind), _.set(n, "kindSelector.selected.group", e.group || ""));
})), n.loadKind = d, n.$watch("kindSelector.selected", function() {
n.alerts = {}, d();
});
var g = i("humanizeKind");
n.matchKind = function(e, t) {
return -1 !== g(e).toLowerCase().indexOf(t.toLowerCase());
}, s.onActiveFiltersChanged(function(e) {
n.$apply(function() {
n.resources = e.select(n.unfilteredResources), u();
});
});
} ]), angular.module("openshiftConsole").controller("PersistentVolumeClaimController", [ "$scope", "$routeParams", "DataService", "ProjectsService", "$filter", function(e, t, n, a, r) {
e.projectName = t.project, e.pvc = null, e.alerts = {}, e.renderOptions = e.renderOptions || {}, e.renderOptions.hideFilterWidget = !0, e.breadcrumbs = [ {
title: "Persistent Volume Claims",
link: "project/" + t.project + "/browse/storage"
}, {
title: t.pvc
} ];
var o = [], i = function(t, n) {
e.pvc = t, e.loaded = !0, "DELETED" === n && (e.alerts.deleted = {
type: "warning",
message: "This persistent volume claim has been deleted."
});
};
a.get(t.project).then(_.spread(function(a, s) {
e.project = a, e.projectContext = s, n.get("persistentvolumeclaims", t.pvc, s, {
errorNotification: !1
}).then(function(e) {
i(e), o.push(n.watchObject("persistentvolumeclaims", t.pvc, s, i));
}, function(t) {
e.loaded = !0, e.alerts.load = {
type: "error",
message: "The persistent volume claim details could not be loaded.",
details: r("getErrorDetails")(t)
};
}), e.$on("$destroy", function() {
n.unwatchAll(o);
});
}));
} ]), angular.module("openshiftConsole").controller("SetLimitsController", [ "$filter", "$location", "$parse", "$routeParams", "$scope", "APIService", "AuthorizationService", "BreadcrumbsService", "DataService", "LimitRangesService", "Navigate", "NotificationsService", "ProjectsService", function(e, t, n, a, r, o, i, s, c, l, u, d, p) {
if (a.kind && a.name) {
var m = [ "Deployment", "DeploymentConfig", "ReplicaSet", "ReplicationController" ];
if (_.includes(m, a.kind)) {
var f = e("humanizeKind"), g = f(a.kind, !0) + " " + a.name;
r.name = a.name, "ReplicationController" !== a.kind && "ReplicaSet" !== a.kind || (r.showPodWarning = !0), r.renderOptions = {
hideFilterWidget: !0
}, r.breadcrumbs = s.getBreadcrumbs({
name: a.name,
kind: a.kind,
namespace: a.project,
subpage: "Edit Resource Limits"
});
var h = e("getErrorDetails"), v = function(e, t) {
d.addNotification({
id: "set-compute-limits-error",
type: "error",
message: e,
details: t
});
}, y = function() {
t.url(r.resourceURL);
}, b = function() {
d.hideNotification("set-compute-limits-error");
};
r.cancel = y, r.$on("$destroy", b), p.get(a.project).then(_.spread(function(e, t) {
var n = {
resource: o.kindToResource(a.kind),
group: a.group
};
if (i.canI(n, "update", a.project)) {
c.get(n, r.name, t).then(function(a) {
var o = r.object = angular.copy(a);
r.breadcrumbs = s.getBreadcrumbs({
object: o,
project: e,
subpage: "Edit Resource Limits"
}), r.resourceURL = u.resourceURL(o), r.containers = _.get(o, "spec.template.spec.containers"), r.save = function() {
r.disableInputs = !0, b(), c.update(n, r.name, o, t).then(function() {
d.addNotification({
type: "success",
message: g + " was updated."
}), y();
}, function(e) {
r.disableInputs = !1, v(g + " could not be updated.", h(e));
});
};
}, function(e) {
v(g + " could not be loaded.", h(e));
});
var p = function() {
r.hideCPU || (r.cpuProblems = l.validatePodLimits(r.limitRanges, "cpu", r.containers, e)), r.memoryProblems = l.validatePodLimits(r.limitRanges, "memory", r.containers, e);
};
c.list("limitranges", t).then(function(e) {
r.limitRanges = e.by("metadata.name"), _.isEmpty(r.limitRanges) || r.$watch("containers", p, !0);
});
} else u.toErrorPage("You do not have authority to update " + f(a.kind) + " " + a.name + ".", "access_denied");
}));
} else u.toErrorPage("Health checks are not supported for kind " + a.kind + ".");
} else u.toErrorPage("Kind or name parameter missing.");
} ]), angular.module("openshiftConsole").controller("EditBuildConfigController", [ "$scope", "$filter", "$location", "$routeParams", "$window", "ApplicationGenerator", "AuthorizationService", "DataService", "Navigate", "NotificationsService", "ProjectsService", "SOURCE_URL_PATTERN", "SecretsService", "keyValueEditorUtils", function(e, t, n, a, r, o, i, s, c, l, u, d, p, m) {
e.projectName = a.project, e.buildConfig = null, e.alerts = {}, e.sourceURLPattern = d, e.options = {}, e.jenkinsfileOptions = {
type: "path"
}, e.selectTypes = {
ImageStreamTag: "Image Stream Tag",
ImageStreamImage: "Image Stream Image",
DockerImage: "Docker Image Repository"
}, e.buildFromTypes = [ "ImageStreamTag", "ImageStreamImage", "DockerImage" ], e.pushToTypes = [ "ImageStreamTag", "DockerImage", "None" ], e.jenkinsfileTypes = [ {
id: "path",
title: "From Source Repository"
}, {
id: "inline",
title: "Inline"
} ], e.view = {
advancedOptions: !1,
hasHooks: !1
}, e.breadcrumbs = [], a.isPipeline ? (e.breadcrumbs.push({
title: "Pipelines",
link: "project/" + a.project + "/browse/pipelines"
}), e.breadcrumbs.push({
title: a.buildconfig,
link: "project/" + a.project + "/browse/pipelines/" + a.buildconfig
})) : (e.breadcrumbs.push({
title: "Builds",
link: "project/" + a.project + "/browse/builds"
}), e.breadcrumbs.push({
title: a.buildconfig,
link: "project/" + a.project + "/browse/builds/" + a.buildconfig
})), e.breadcrumbs.push({
title: a.isPipeline ? "Edit Pipelines" : "Edit Builds"
}), e.imageOptions = {
from: {},
to: {},
fromSource: {}
}, e.sources = {
binary: !1,
dockerfile: !1,
git: !1,
images: !1,
contextDir: !1,
none: !0
}, e.triggers = {
githubWebhooks: [],
gitlabWebhooks: [],
bitbucketWebhooks: [],
genericWebhooks: [],
imageChangeTriggers: [],
builderImageChangeTrigger: {},
configChangeTrigger: {}
}, e.createTriggerSelect = {
selectedType: "",
options: [ {
type: "github",
label: "GitHub"
}, {
type: "gitlab",
label: "GitLab"
}, {
type: "bitbucket",
label: "Bitbucket"
}, {
type: "generic",
label: "Generic"
} ]
}, e.runPolicyTypes = [ "Serial", "Parallel", "SerialLatestOnly" ], e.buildHookTypes = [ {
id: "command",
label: "Command"
}, {
id: "script",
label: "Shell Script"
}, {
id: "args",
label: "Arguments to default image entry point"
}, {
id: "commandArgs",
label: "Command with arguments"
}, {
id: "scriptArgs",
label: "Shell script with arguments"
} ], e.buildHookSelection = {
type: {}
}, e.getArgumentsDescription = function() {
switch (_.get(e, "buildHookSelection.type.id", "")) {
case "args":
return "Enter the arguments that will be appended to the default image entry point.";

case "commandArgs":
return "Enter the arguments that will be appended to the command.";

case "scriptArgs":
return "Enter the arguments that will be appended to the script.";
}
return null;
};
var f = function() {
var t = !_.isEmpty(_.get(e, "buildConfig.spec.postCommit.args")), n = !_.isEmpty(_.get(e, "buildConfig.spec.postCommit.command")), a = !!_.get(e, "buildConfig.spec.postCommit.script");
e.view.hasHooks = t || n || a;
var r;
r = t && n ? "commandArgs" : t && a ? "scriptArgs" : t ? "args" : a ? "script" : "command", e.buildHookSelection.type = _.find(e.buildHookTypes, {
id: r
});
}, g = function() {
if (e.view.hasHooks) switch (e.buildHookSelection.type.id) {
case "script":
delete e.updatedBuildConfig.spec.postCommit.command, delete e.updatedBuildConfig.spec.postCommit.args;
break;

case "command":
delete e.updatedBuildConfig.spec.postCommit.script, delete e.updatedBuildConfig.spec.postCommit.args;
break;

case "args":
delete e.updatedBuildConfig.spec.postCommit.script, delete e.updatedBuildConfig.spec.postCommit.command;
break;

case "scriptArgs":
delete e.updatedBuildConfig.spec.postCommit.command;
break;

case "commandArgs":
delete e.updatedBuildConfig.spec.postCommit.script;
} else delete e.updatedBuildConfig.spec.postCommit.command, delete e.updatedBuildConfig.spec.postCommit.args, delete e.updatedBuildConfig.spec.postCommit.script;
};
e.secrets = {};
var h = [], v = t("buildStrategy"), y = function() {
var t;
e.buildConfig ? (t = c.resourceURL(e.buildConfig), n.path(t)) : r.history.back();
};
e.cancel = y;
var b = function() {
l.hideNotification("edit-build-config-error"), l.hideNotification("edit-build-config-conflict"), l.hideNotification("edit-build-config-deleted");
};
e.$on("$destroy", b), u.get(a.project).then(_.spread(function(n, r) {
e.project = n, e.context = r, i.canI("buildconfigs", "update", a.project) ? s.get("buildconfigs", a.buildconfig, r, {
errorNotification: !1
}).then(function(t) {
e.buildConfig = t, f(), e.updatedBuildConfig = angular.copy(e.buildConfig), e.buildStrategy = v(e.updatedBuildConfig), e.strategyType = e.buildConfig.spec.strategy.type, e.envVars = e.buildStrategy.env || [], e.triggers = C(e.triggers, e.buildConfig.spec.triggers), e.sources = I(e.sources, e.buildConfig.spec.source), _.has(t, "spec.strategy.jenkinsPipelineStrategy.jenkinsfile") && (e.jenkinsfileOptions.type = "inline"), s.list("secrets", r).then(function(t) {
var n = p.groupSecretsByType(t), a = _.mapValues(n, function(e) {
return _.map(e, "metadata.name");
});
e.secrets.secretsByType = _.each(a, function(e) {
e.unshift("");
}), j();
});
var n = function(e, n) {
e.type = n && n.kind ? n.kind : "None";
var a = {}, r = "", o = "";
a = "ImageStreamTag" === e.type ? {
namespace: n.namespace || t.metadata.namespace,
imageStream: n.name.split(":")[0],
tagObject: {
tag: n.name.split(":")[1]
}
} : {
namespace: "",
imageStream: "",
tagObject: {
tag: ""
}
}, r = "ImageStreamImage" === e.type ? (n.namespace || t.metadata.namespace) + "/" + n.name : "", o = "DockerImage" === e.type ? n.name : "", e.imageStreamTag = a, e.imageStreamImage = r, e.dockerImage = o;
};
n(e.imageOptions.from, e.buildStrategy.from), n(e.imageOptions.to, e.updatedBuildConfig.spec.output.to), e.sources.images && (e.sourceImages = e.buildConfig.spec.source.images, 1 === _.size(e.sourceImages) ? (e.imageSourceTypes = angular.copy(e.buildFromTypes), n(e.imageOptions.fromSource, e.sourceImages[0].from), e.imageSourcePaths = _.map(e.sourceImages[0].paths, function(e) {
return {
name: e.sourcePath,
value: e.destinationDir
};
})) : (e.imageSourceFromObjects = [], e.sourceImages.forEach(function(t) {
e.imageSourceFromObjects.push(t.from);
}))), e.options.forcePull = !!e.buildStrategy.forcePull, "Docker" === e.strategyType && (e.options.noCache = !!e.buildConfig.spec.strategy.dockerStrategy.noCache, e.buildFromTypes.push("None")), h.push(s.watchObject("buildconfigs", a.buildconfig, r, function(t, n) {
"MODIFIED" === n && l.addNotification({
id: "edit-build-config-conflict",
type: "warning",
message: "This build configuration has changed since you started editing it. You'll need to copy any changes you've made and edit again."
}), "DELETED" === n && (l.addNotification({
id: "edit-build-config-deleted",
type: "warning",
message: "This build configuration has been deleted."
}), e.disableInputs = !0), e.buildConfig = t;
})), e.loaded = !0;
}, function(n) {
e.loaded = !0, e.alerts.load = {
type: "error",
message: "The build configuration details could not be loaded.",
details: "Reason: " + t("getErrorDetails")(n)
};
}) : c.toErrorPage("You do not have authority to update build config " + a.buildconfig + ".", "access_denied");
}));
var C = function(n, a) {
function r(n, a) {
return t("imageObjectRef")(n, e.projectName) === t("imageObjectRef")(a, e.projectName);
}
var o = v(e.buildConfig).from;
return a.forEach(function(e) {
switch (e.type) {
case "Generic":
n.genericWebhooks.push({
disabled: !1,
data: e
});
break;

case "GitHub":
n.githubWebhooks.push({
disabled: !1,
data: e
});
break;

case "GitLab":
n.gitlabWebhooks.push({
disabled: !1,
data: e
});
break;

case "Bitbucket":
n.bitbucketWebhooks.push({
disabled: !1,
data: e
});
break;

case "ImageChange":
var t = e.imageChange.from;
t || (t = o);
var a = {
present: !0,
data: e
};
r(t, o) ? n.builderImageChangeTrigger = a : n.imageChangeTriggers.push(a);
break;

case "ConfigChange":
n.configChangeTrigger = {
present: !0,
data: e
};
}
}), _.isEmpty(n.builderImageChangeTrigger) && (n.builderImageChangeTrigger = {
present: !1,
data: {
imageChange: {},
type: "ImageChange"
}
}), _.isEmpty(n.configChangeTrigger) && (n.configChangeTrigger = {
present: !1,
data: {
type: "ConfigChange"
}
}), n;
};
e.aceLoaded = function(e) {
var t = e.getSession();
t.setOption("tabSize", 2), t.setOption("useSoftTabs", !0), e.$blockScrolling = 1 / 0;
};
var S = function(e) {
return _.map(m.compactEntries(e), function(e) {
return {
sourcePath: e.name,
destinationDir: e.value
};
});
}, w = function(t) {
var n = {};
switch (t.type) {
case "ImageStreamTag":
n = {
kind: t.type,
name: t.imageStreamTag.imageStream + ":" + t.imageStreamTag.tagObject.tag
}, t.imageStreamTag.namespace !== e.buildConfig.metadata.namespace && (n.namespace = t.imageStreamTag.namespace);
break;

case "DockerImage":
n = {
kind: t.type,
name: t.dockerImage
};
break;

case "ImageStreamImage":
var a = t.imageStreamImage.split("/");
(n = {
kind: t.type,
name: _.last(a)
}).namespace = 1 !== _.size(a) ? _.head(a) : e.buildConfig.metadata.namespace;
}
return n;
}, k = function() {
var t = [].concat(e.triggers.githubWebhooks, e.triggers.gitlabWebhooks, e.triggers.bitbucketWebhooks, e.triggers.genericWebhooks, e.triggers.imageChangeTriggers, e.triggers.builderImageChangeTrigger, e.triggers.configChangeTrigger);
return t = _.filter(t, function(e) {
return _.has(e, "disabled") && !e.disabled || e.present;
}), t = _.map(t, "data");
}, j = function() {
switch (e.secrets.picked = {
gitSecret: e.buildConfig.spec.source.sourceSecret ? [ e.buildConfig.spec.source.sourceSecret ] : [ {
name: ""
} ],
pullSecret: v(e.buildConfig).pullSecret ? [ v(e.buildConfig).pullSecret ] : [ {
name: ""
} ],
pushSecret: e.buildConfig.spec.output.pushSecret ? [ e.buildConfig.spec.output.pushSecret ] : [ {
name: ""
} ]
}, e.strategyType) {
case "Source":
case "Docker":
e.secrets.picked.sourceSecrets = e.buildConfig.spec.source.secrets || [ {
secret: {
name: ""
},
destinationDir: ""
} ];
break;

case "Custom":
e.secrets.picked.sourceSecrets = v(e.buildConfig).secrets || [ {
secretSource: {
name: ""
},
mountPath: ""
} ];
}
}, P = function(e, t, n) {
t.name ? e[n] = t : delete e[n];
}, R = function(t, n) {
var a = "Custom" === e.strategyType ? "secretSource" : "secret", r = _.filter(n, function(e) {
return e[a].name;
});
_.isEmpty(r) ? delete t.secrets : t.secrets = r;
}, I = function(e, t) {
return "None" === t.type ? e : (e.none = !1, angular.forEach(t, function(t, n) {
e[n] = !0;
}), e);
};
e.addWebhookTrigger = function(t) {
if (t) {
var n = {
disabled: !1,
data: {
type: t
}
}, a = _.find(e.createTriggerSelect.options, function(e) {
return e.label === t;
}).type;
n.data[a] = {
secret: o._generateSecret()
}, e.triggers[a + "Webhooks"].push(n);
}
}, e.save = function() {
switch (e.disableInputs = !0, g(), v(e.updatedBuildConfig).forcePull = e.options.forcePull, e.strategyType) {
case "Docker":
v(e.updatedBuildConfig).noCache = e.options.noCache;
break;

case "JenkinsPipeline":
"path" === e.jenkinsfileOptions.type ? delete e.updatedBuildConfig.spec.strategy.jenkinsPipelineStrategy.jenkinsfile : delete e.updatedBuildConfig.spec.strategy.jenkinsPipelineStrategy.jenkinsfilePath;
}
switch (e.sources.images && !_.isEmpty(e.sourceImages) && (e.updatedBuildConfig.spec.source.images[0].paths = S(e.imageSourcePaths), e.updatedBuildConfig.spec.source.images[0].from = w(e.imageOptions.fromSource)), "None" === e.imageOptions.from.type ? delete v(e.updatedBuildConfig).from : v(e.updatedBuildConfig).from = w(e.imageOptions.from), "None" === e.imageOptions.to.type ? delete e.updatedBuildConfig.spec.output.to : e.updatedBuildConfig.spec.output.to = w(e.imageOptions.to), v(e.updatedBuildConfig).env = m.compactEntries(e.envVars), P(e.updatedBuildConfig.spec.source, _.head(e.secrets.picked.gitSecret), "sourceSecret"), P(v(e.updatedBuildConfig), _.head(e.secrets.picked.pullSecret), "pullSecret"), P(e.updatedBuildConfig.spec.output, _.head(e.secrets.picked.pushSecret), "pushSecret"), e.strategyType) {
case "Source":
case "Docker":
R(e.updatedBuildConfig.spec.source, e.secrets.picked.sourceSecrets);
break;

case "Custom":
R(v(e.updatedBuildConfig), e.secrets.picked.sourceSecrets);
}
e.updatedBuildConfig.spec.triggers = k(), b(), s.update("buildconfigs", e.updatedBuildConfig.metadata.name, e.updatedBuildConfig, e.context).then(function() {
l.addNotification({
type: "success",
message: "Build config " + e.updatedBuildConfig.metadata.name + " was successfully updated."
}), y();
}, function(n) {
e.disableInputs = !1, l.addNotification({
id: "edit-build-config-error",
type: "error",
message: "An error occurred updating build config " + e.updatedBuildConfig.metadata.name + ".",
details: t("getErrorDetails")(n)
});
});
}, e.$on("$destroy", function() {
s.unwatchAll(h);
});
} ]), angular.module("openshiftConsole").controller("EditConfigMapController", [ "$filter", "$routeParams", "$scope", "$window", "DataService", "BreadcrumbsService", "Navigate", "NotificationsService", "ProjectsService", function(e, t, n, a, r, o, i, s, c) {
var l = [];
n.forms = {}, n.projectName = t.project, n.breadcrumbs = o.getBreadcrumbs({
name: t.configMap,
kind: "ConfigMap",
namespace: t.project,
subpage: "Edit Config Map"
});
var u = function(e) {
return _.get(e, "metadata.resourceVersion");
}, d = function() {
s.hideNotification("edit-config-map-error");
}, p = function() {
a.history.back();
};
n.cancel = p, c.get(t.project).then(_.spread(function(a, c) {
r.get("configmaps", t.configMap, c, {
errorNotification: !1
}).then(function(e) {
n.loaded = !0, n.breadcrumbs = o.getBreadcrumbs({
name: t.configMap,
object: e,
project: a,
subpage: "Edit Config Map"
}), n.configMap = e, l.push(r.watchObject("configmaps", t.configMap, c, function(e, t) {
n.resourceChanged = u(e) !== u(n.configMap), n.resourceDeleted = "DELETED" === t;
}));
}, function(n) {
i.toErrorPage("Could not load config map " + t.configMap + ". " + e("getErrorDetails")(n));
}), n.updateConfigMap = function() {
n.forms.editConfigMapForm.$valid && (d(), n.disableInputs = !0, r.update("configmaps", n.configMap.metadata.name, n.configMap, c).then(function() {
s.addNotification({
type: "success",
message: "Config map " + n.configMap.metadata.name + " successfully updated."
}), p();
}, function(t) {
n.disableInputs = !1, s.addNotification({
id: "edit-config-map-error",
type: "error",
message: "An error occurred updating the config map.",
details: e("getErrorDetails")(t)
});
}));
}, n.$on("$destroy", function() {
r.unwatchAll(l), d();
});
}));
} ]), angular.module("openshiftConsole").controller("EditDeploymentConfigController", [ "$scope", "$filter", "$location", "$routeParams", "$uibModal", "$window", "AuthorizationService", "BreadcrumbsService", "DataService", "EnvironmentService", "Navigate", "NotificationsService", "ProjectsService", "SecretsService", "keyValueEditorUtils", function(e, t, n, a, r, o, i, s, c, l, u, d, p, m, f) {
e.projectName = a.project, e.deploymentConfig = null, e.alerts = {}, e.view = {
advancedStrategyOptions: !1,
advancedImageOptions: !1
}, e.triggers = {}, e.breadcrumbs = s.getBreadcrumbs({
name: a.name,
kind: a.kind,
namespace: a.project,
subpage: "Edit Deployment Config"
}), e.deploymentConfigStrategyTypes = [ "Recreate", "Rolling", "Custom" ];
var g = t("orderByDisplayName"), h = t("getErrorDetails"), v = function(t, n) {
e.alerts["from-value-objects"] = {
type: "error",
message: t,
details: n
};
}, y = [], b = [], C = [];
e.valueFromObjects = [];
var S = function(e) {
switch (e) {
case "Recreate":
return "recreateParams";

case "Rolling":
return "rollingParams";

case "Custom":
return "customParams";

default:
return void Logger.error("Unknown deployment strategy type: " + e);
}
};
p.get(a.project).then(_.spread(function(n, r) {
e.project = n, e.context = r, i.canI("deploymentconfigs", "update", a.project) ? c.get("deploymentconfigs", a.deploymentconfig, r, {
errorNotification: !1
}).then(function(t) {
e.deploymentConfig = t, e.breadcrumbs = s.getBreadcrumbs({
object: t,
project: n,
subpage: "Edit"
});
e.updatedDeploymentConfig = angular.copy(e.deploymentConfig), e.containerNames = _.map(e.deploymentConfig.spec.template.spec.containers, "name"), e.containerConfigByName = function(t, n) {
var a = {}, r = _.filter(n, {
type: "ImageChange"
});
return _.each(t, function(t) {
var n = _.find(r, function(e) {
return _.includes(e.imageChangeParams.containerNames, t.name);
}), o = {};
if (t.env = t.env || [], a[t.name] = {
env: t.env,
image: t.image,
hasDeploymentTrigger: !_.isEmpty(n)
}, n) {
var i = n.imageChangeParams.from, s = i.name.split(":");
o = {
data: n,
istag: {
namespace: i.namespace || e.projectName,
imageStream: s[0],
tagObject: {
tag: s[1]
}
},
automatic: _.get(n, "imageChangeParams.automatic", !1)
};
} else o = {
istag: {
namespace: "",
imageStream: ""
},
automatic: !0
};
_.set(a, [ t.name, "triggerData" ], o);
}), a;
}(e.updatedDeploymentConfig.spec.template.spec.containers, e.updatedDeploymentConfig.spec.triggers), e.secrets = {
pullSecrets: angular.copy(e.deploymentConfig.spec.template.spec.imagePullSecrets) || [ {
name: ""
} ]
}, e.volumeNames = _.map(e.deploymentConfig.spec.template.spec.volumes, "name"), e.strategyData = angular.copy(e.deploymentConfig.spec.strategy), e.originalStrategy = e.strategyData.type, e.strategyParamsPropertyName = S(e.strategyData.type), e.triggers.hasConfigTrigger = _.some(e.updatedDeploymentConfig.spec.triggers, {
type: "ConfigChange"
}), "Custom" !== e.strategyData.type || _.has(e.strategyData, "customParams.environment") || (e.strategyData.customParams.environment = []), c.list("configmaps", r, null, {
errorNotification: !1
}).then(function(t) {
b = g(t.by("metadata.name")), e.availableConfigMaps = b, e.valueFromObjects = b.concat(C);
}, function(e) {
403 !== e.code && v("Could not load config maps", h(e));
}), c.list("secrets", r, null, {
errorNotification: !1
}).then(function(t) {
C = g(t.by("metadata.name")), e.availableSecrets = C, e.valueFromObjects = C.concat(b);
var n = m.groupSecretsByType(t), a = _.mapValues(n, function(e) {
return _.map(e, "metadata.name");
});
e.secretsByType = _.each(a, function(e) {
e.unshift("");
});
}, function(e) {
403 !== e.code && v("Could not load secrets", h(e));
}), y.push(c.watchObject("deploymentconfigs", a.deploymentconfig, r, function(t, n) {
"MODIFIED" === n && (e.alerts["updated/deleted"] = {
type: "warning",
message: "This deployment configuration has changed since you started editing it. You'll need to copy any changes you've made and edit again."
}), "DELETED" === n && (e.alerts["updated/deleted"] = {
type: "warning",
message: "This deployment configuration has been deleted."
}, e.disableInputs = !0), e.deploymentConfig = t;
})), e.loaded = !0;
}, function(n) {
e.loaded = !0, e.alerts.load = {
type: "error",
message: "The deployment configuration details could not be loaded.",
details: t("getErrorDetails")(n)
};
}) : u.toErrorPage("You do not have authority to update deployment config " + a.deploymentconfig + ".", "access_denied");
}));
var w = function() {
return "Custom" !== e.strategyData.type && "Custom" !== e.originalStrategy && e.strategyData.type !== e.originalStrategy;
}, k = function(t) {
_.has(e.strategyData, t) || r.open({
animation: !0,
templateUrl: "views/modals/confirm.html",
controller: "ConfirmModalController",
resolve: {
modalConfig: function() {
return {
alerts: e.alerts,
message: "Some of your existing " + e.originalStrategy.toLowerCase() + " strategy parameters can be used for the " + e.strategyData.type.toLowerCase() + " strategy. Keep parameters?",
details: "The timeout parameter and any pre or post lifecycle hooks will be copied from " + e.originalStrategy.toLowerCase() + " strategy to " + e.strategyData.type.toLowerCase() + " strategy. After saving the changes, " + e.originalStrategy.toLowerCase() + " strategy parameters will be removed.",
okButtonText: "Yes",
okButtonClass: "btn-primary",
cancelButtonText: "No"
};
}
}
}).result.then(function() {
e.strategyData[t] = angular.copy(e.strategyData[S(e.originalStrategy)]);
}, function() {
e.strategyData[t] = {};
});
};
e.strategyChanged = function() {
var t = S(e.strategyData.type);
w() ? k(t) : _.has(e.strategyData, t) || ("Custom" !== e.strategyData.type ? e.strategyData[t] = {} : e.strategyData[t] = {
image: "",
command: [],
environment: []
}), e.strategyParamsPropertyName = t;
};
var j = function(e, t, n, a) {
var r = {
kind: "ImageStreamTag",
namespace: t.namespace,
name: t.imageStream + ":" + t.tagObject.tag
};
return n ? (n.imageChangeParams.from = r, n.imageChangeParams.automatic = a) : n = {
type: "ImageChange",
imageChangeParams: {
automatic: a,
containerNames: [ e ],
from: r
}
}, n;
}, P = function() {
var t = _.reject(e.updatedDeploymentConfig.spec.triggers, function(e) {
return "ImageChange" === e.type || "ConfigChange" === e.type;
});
return _.each(e.containerConfigByName, function(n, a) {
n.hasDeploymentTrigger ? t.push(j(a, n.triggerData.istag, n.triggerData.data, n.triggerData.automatic)) : _.find(e.updatedDeploymentConfig.spec.template.spec.containers, {
name: a
}).image = n.image;
}), e.triggers.hasConfigTrigger && t.push({
type: "ConfigChange"
}), t;
}, R = function() {
d.hideNotification("edit-deployment-config-error");
};
e.save = function() {
if (e.disableInputs = !0, _.each(e.containerConfigByName, function(t, n) {
_.find(e.updatedDeploymentConfig.spec.template.spec.containers, {
name: n
}).env = f.compactEntries(t.env);
}), w() && delete e.strategyData[S(e.originalStrategy)], "Rolling" === e.strategyData.type) {
var a = e.strategyData[e.strategyParamsPropertyName].maxSurge, r = Number(a);
"" === a ? e.strategyData[e.strategyParamsPropertyName].maxSurge = null : _.isFinite(r) && (e.strategyData[e.strategyParamsPropertyName].maxSurge = r);
var o = e.strategyData[e.strategyParamsPropertyName].maxUnavailable, i = Number(o);
"" === o ? e.strategyData[e.strategyParamsPropertyName].maxUnavailable = null : _.isFinite(i) && (e.strategyData[e.strategyParamsPropertyName].maxUnavailable = i);
}
"Custom" !== e.strategyData.type && _.each([ "pre", "mid", "post" ], function(t) {
_.has(e.strategyData, [ e.strategyParamsPropertyName, t, "execNewPod", "env" ]) && (e.strategyData[e.strategyParamsPropertyName][t].execNewPod.env = f.compactEntries(e.strategyData[e.strategyParamsPropertyName][t].execNewPod.env));
}), _.has(e, "strategyData.customParams.environment") && (e.strategyData.customParams.environment = f.compactEntries(e.strategyData.customParams.environment)), e.updatedDeploymentConfig.spec.template.spec.imagePullSecrets = _.filter(e.secrets.pullSecrets, "name"), e.updatedDeploymentConfig.spec.strategy = e.strategyData, e.updatedDeploymentConfig.spec.triggers = P(), R(), c.update("deploymentconfigs", e.updatedDeploymentConfig.metadata.name, e.updatedDeploymentConfig, e.context).then(function() {
d.addNotification({
type: "success",
message: "Deployment config " + e.updatedDeploymentConfig.metadata.name + " was successfully updated."
});
var t = u.resourceURL(e.updatedDeploymentConfig);
n.url(t);
}, function(n) {
e.disableInputs = !1, d.addNotification({
id: "edit-deployment-config-error",
type: "error",
message: "An error occurred updating deployment config " + e.updatedDeploymentConfig.metadata.name + ".",
details: t("getErrorDetails")(n)
});
});
}, e.cancel = function() {
o.history.back();
}, e.$on("$destroy", function() {
c.unwatchAll(y), R();
});
} ]), angular.module("openshiftConsole").controller("EditAutoscalerController", [ "$scope", "$filter", "$routeParams", "$window", "APIService", "AuthorizationService", "BreadcrumbsService", "DataService", "HPAService", "MetricsService", "Navigate", "NotificationsService", "ProjectsService", "keyValueEditorUtils", function(e, t, n, a, r, o, i, s, c, l, u, d, p, m) {
if (n.kind && n.name) {
var f = [ "Deployment", "DeploymentConfig", "HorizontalPodAutoscaler", "ReplicaSet", "ReplicationController" ];
if (_.includes(f, n.kind)) {
e.kind = n.kind, e.name = n.name, "HorizontalPodAutoscaler" === n.kind ? e.disableInputs = !0 : (e.targetKind = n.kind, e.targetName = n.name), e.autoscaling = {
name: e.name
}, e.labels = [], l.isAvailable().then(function(t) {
e.metricsWarning = !t;
});
var g = t("getErrorDetails"), h = function() {
a.history.back();
};
e.cancel = h;
var v = function() {
d.hideNotification("edit-hpa-error");
};
e.$on("$destroy", v), p.get(n.project).then(_.spread(function(t, a) {
e.project = t;
var l = "HorizontalPodAutoscaler" === n.kind ? "update" : "create";
if (o.canI({
resource: "horizontalpodautoscalers",
group: "autoscaling"
}, l, n.project)) {
var p = function() {
e.disableInputs = !0, v();
var t = {
apiVersion: "autoscaling/v1",
kind: "HorizontalPodAutoscaler",
metadata: {
name: e.autoscaling.name,
labels: m.mapEntries(m.compactEntries(e.labels))
},
spec: {
scaleTargetRef: {
kind: n.kind,
name: n.name,
apiVersion: "extensions/v1beta1",
subresource: "scale"
},
minReplicas: e.autoscaling.minReplicas,
maxReplicas: e.autoscaling.maxReplicas,
targetCPUUtilizationPercentage: e.autoscaling.targetCPU || e.autoscaling.defaultTargetCPU || null
}
};
s.create({
resource: "horizontalpodautoscalers",
group: "autoscaling"
}, null, t, a).then(function(e) {
d.addNotification({
type: "success",
message: "Horizontal pod autoscaler " + e.metadata.name + " successfully created."
}), h();
}, function(t) {
e.disableInputs = !1, d.addNotification({
id: "edit-hpa-error",
type: "error",
message: "An error occurred creating the horizontal pod autoscaler.",
details: g(t)
});
});
}, f = function(t) {
e.disableInputs = !0, (t = angular.copy(t)).metadata.labels = m.mapEntries(m.compactEntries(e.labels)), t.spec.minReplicas = e.autoscaling.minReplicas, t.spec.maxReplicas = e.autoscaling.maxReplicas, t.spec.targetCPUUtilizationPercentage = e.autoscaling.targetCPU || e.autoscaling.defaultTargetCPU || null, s.update({
resource: "horizontalpodautoscalers",
group: "autoscaling"
}, t.metadata.name, t, a).then(function(e) {
d.addNotification({
type: "success",
message: "Horizontal pod autoscaler " + e.metadata.name + " successfully updated."
}), h();
}, function(t) {
e.disableInputs = !1, d.addNotification({
id: "edit-hpa-error",
type: "error",
message: "An error occurred creating the horizontal pod autoscaler.",
details: g(t)
});
});
}, y = {};
y = "HorizontalPodAutoscaler" === n.kind ? {
resource: "horizontalpodautoscalers",
group: "autoscaling",
version: "v1"
} : {
resource: r.kindToResource(n.kind),
group: n.group
}, s.get(y, n.name, a).then(function(r) {
if (e.labels = _.map(_.get(r, "metadata.labels", {}), function(e, t) {
return {
name: t,
value: e
};
}), "HorizontalPodAutoscaler" === n.kind) e.targetKind = _.get(r, "spec.scaleTargetRef.kind"), e.targetName = _.get(r, "spec.scaleTargetRef.name"), _.assign(e.autoscaling, {
minReplicas: _.get(r, "spec.minReplicas"),
maxReplicas: _.get(r, "spec.maxReplicas"),
targetCPU: _.get(r, "spec.targetCPUUtilizationPercentage")
}), e.disableInputs = !1, e.save = function() {
f(r);
}, e.breadcrumbs = i.getBreadcrumbs({
name: e.targetName,
kind: e.targetKind,
namespace: n.project,
project: t,
subpage: "Autoscale"
}); else {
e.breadcrumbs = i.getBreadcrumbs({
object: r,
project: t,
subpage: "Autoscale"
}), e.save = p;
var o = {}, l = function() {
var n = _.get(r, "spec.template.spec.containers", []);
e.showCPURequestWarning = !c.hasCPURequest(n, o, t);
};
s.list("limitranges", a).then(function(e) {
o = e.by("metadata.name"), l();
});
}
});
} else u.toErrorPage("You do not have authority to " + l + " horizontal pod autoscalers in project " + n.project + ".", "access_denied");
}));
} else u.toErrorPage("Autoscaling not supported for kind " + n.kind + ".");
} else u.toErrorPage("Kind or name parameter missing.");
} ]), angular.module("openshiftConsole").controller("EditHealthChecksController", [ "$filter", "$location", "$routeParams", "$scope", "AuthorizationService", "BreadcrumbsService", "APIService", "DataService", "Navigate", "NotificationsService", "ProjectsService", function(e, t, n, a, r, o, i, s, c, l, u) {
if (n.kind && n.name) {
var d = [ "Deployment", "DeploymentConfig", "ReplicaSet", "ReplicationController" ];
if (_.includes(d, n.kind)) {
a.name = n.name, a.resourceURL = c.resourceURL(a.name, n.kind, n.project), a.breadcrumbs = o.getBreadcrumbs({
name: n.name,
kind: n.kind,
namespace: n.project,
subpage: "Edit Health Checks"
}), a.previousProbes = {};
var p = e("getErrorDetails"), m = e("upperFirst"), f = function(e, t) {
l.addNotification({
id: "add-health-check-error",
type: "error",
message: e,
details: t
});
}, g = function() {
t.url(a.resourceURL);
};
a.cancel = g;
var h = function() {
l.hideNotification("add-health-check-error");
};
a.$on("$destroy", h), u.get(n.project).then(_.spread(function(t, u) {
var d = e("humanizeKind")(n.kind) + ' "' + a.name + '"', v = {
resource: i.kindToResource(n.kind),
group: n.group
};
r.canI(v, "update", n.project) ? s.get(v, a.name, u).then(function(e) {
var r = a.object = angular.copy(e);
a.breadcrumbs = o.getBreadcrumbs({
object: r,
project: t,
subpage: "Edit Health Checks"
}), a.containers = _.get(r, "spec.template.spec.containers"), a.addProbe = function(e, t) {
e[t] = _.get(a.previousProbes, [ e.name, t ], {}), a.form.$setDirty();
}, a.removeProbe = function(e, t) {
_.set(a.previousProbes, [ e.name, t ], e[t]), delete e[t], a.form.$setDirty();
}, a.save = function() {
a.disableInputs = !0, h(), s.update(i.kindToResource(n.kind), a.name, r, u).then(function() {
l.addNotification({
type: "success",
message: m(d) + " was updated."
}), g();
}, function(e) {
a.disableInputs = !1, f(m(d) + " could not be updated.", p(e));
});
};
}, function(e) {
f(m(d) + " could not be loaded.", p(e));
}) : c.toErrorPage("You do not have authority to update " + d + ".", "access_denied");
}));
} else c.toErrorPage("Health checks are not supported for kind " + n.kind + ".");
} else c.toErrorPage("Kind or name parameter missing.");
} ]), angular.module("openshiftConsole").controller("EditRouteController", [ "$filter", "$location", "$routeParams", "$scope", "AuthorizationService", "DataService", "Navigate", "NotificationsService", "ProjectsService", "RoutesService", function(e, t, n, a, r, o, i, s, c, l) {
a.renderOptions = {
hideFilterWidget: !0
}, a.projectName = n.project, a.routeName = n.route, a.loading = !0, a.routeURL = i.resourceURL(a.routeName, "Route", a.projectName), a.breadcrumbs = [ {
title: "Routes",
link: "project/" + a.projectName + "/browse/routes"
}, {
title: a.routeName,
link: a.routeURL
}, {
title: "Edit"
} ];
var u = function() {
s.hideNotification("edit-route-error");
};
a.$on("$destroy", u);
var d = function() {
t.path(a.routeURL);
};
a.cancel = d, c.get(n.project).then(_.spread(function(t, c) {
if (a.project = t, r.canI("routes", "update", n.project)) {
var p, m = e("orderByDisplayName"), f = function() {
i.toErrorPage('Editing routes with non-service targets is unsupported. You can edit the route with the "Edit YAML" action instead.');
};
o.get("routes", a.routeName, c).then(function(e) {
if ("Service" === e.spec.to.kind) {
p = angular.copy(e);
var t = _.get(p, "spec.host");
"Subdomain" === _.get(p, "spec.wildcardPolicy") && (t = "*." + l.getSubdomain(p)), a.routing = {
host: t,
wildcardPolicy: _.get(p, "spec.wildcardPolicy"),
path: _.get(p, "spec.path"),
targetPort: _.get(p, "spec.port.targetPort"),
tls: angular.copy(_.get(p, "spec.tls"))
}, o.list("services", c).then(function(e) {
a.loading = !1;
var t = e.by("metadata.name");
a.routing.to = p.spec.to, a.routing.alternateServices = [], _.each(_.get(p, "spec.alternateBackends"), function(e) {
if ("Service" !== e.kind) return f(), !1;
a.routing.alternateServices.push(e);
}), a.services = m(t);
});
} else f();
}, function() {
i.toErrorPage("Could not load route " + a.routeName + ".");
});
var g = function() {
var e = angular.copy(p), t = _.get(a, "routing.to.name");
_.set(e, "spec.to.name", t);
var n = _.get(a, "routing.to.weight");
isNaN(n) || _.set(e, "spec.to.weight", n), e.spec.path = a.routing.path;
var r = a.routing.targetPort;
r ? _.set(e, "spec.port.targetPort", r) : delete e.spec.port, _.get(a, "routing.tls.termination") ? (e.spec.tls = a.routing.tls, "passthrough" === e.spec.tls.termination && (delete e.spec.path, delete e.spec.tls.certificate, delete e.spec.tls.key, delete e.spec.tls.caCertificate), "reencrypt" !== e.spec.tls.termination && delete e.spec.tls.destinationCACertificate) : delete e.spec.tls;
var o = _.get(a, "routing.alternateServices", []);
return _.isEmpty(o) ? delete e.spec.alternateBackends : e.spec.alternateBackends = _.map(o, function(e) {
return {
kind: "Service",
name: e.name,
weight: e.weight
};
}), e;
};
a.updateRoute = function() {
if (a.form.$valid) {
u(), a.disableInputs = !0;
var t = g();
o.update("routes", a.routeName, t, c).then(function() {
s.addNotification({
type: "success",
message: "Route " + a.routeName + " was successfully updated."
}), d();
}, function(t) {
a.disableInputs = !1, s.addNotification({
type: "error",
id: "edit-route-error",
message: "An error occurred updating route " + a.routeName + ".",
details: e("getErrorDetails")(t)
});
});
}
};
} else i.toErrorPage("You do not have authority to update route " + n.routeName + ".", "access_denied");
}));
} ]), angular.module("openshiftConsole").controller("EditYAMLController", [ "$scope", "$filter", "$location", "$routeParams", "$window", "APIService", "AuthorizationService", "BreadcrumbsService", "DataService", "Navigate", "NotificationsService", "ProjectsService", function(e, t, n, a, r, o, i, s, c, l, u, d) {
if (a.kind && a.name) {
var p = t("humanizeKind");
e.alerts = {}, e.name = a.name, e.resourceURL = l.resourceURL(e.name, a.kind, a.project), e.breadcrumbs = [ {
title: a.name,
link: a.returnURL
}, {
title: "Edit YAML"
} ];
var m = function() {
e.modified = !1, a.returnURL ? n.url(a.returnURL) : r.history.back();
};
e.$watch("updated.resource", function(t, n) {
t !== n && (e.modified = !0);
});
var f = [];
d.get(a.project).then(_.spread(function(n, r) {
var s = {
resource: o.kindToResource(a.kind),
group: a.group
};
i.canI(s, "update", a.project) ? (c.get(s, e.name, r, {
errorNotification: !1
}).then(function(n) {
var i = n;
_.set(e, "updated.resource", angular.copy(n));
var l = function(e) {
return _.get(e, "metadata.resourceVersion");
};
e.save = function() {
var n = e.updated.resource;
if (e.modified = !1, n.kind === i.kind) {
var r = o.objectToResourceGroupVersion(i), s = o.objectToResourceGroupVersion(n);
s ? s.group === r.group ? o.apiInfo(s) ? (e.updatingNow = !0, c.update(r, i.metadata.name, n, {
namespace: i.metadata.namespace
}).then(function(t) {
var r = _.get(n, "metadata.resourceVersion");
if (_.get(t, "metadata.resourceVersion") === r) return e.alerts["no-changes-applied"] = {
type: "warning",
message: "No changes were applied to " + p(a.kind) + " " + a.name + ".",
details: "Make sure any new fields you may have added are supported API fields."
}, void (e.updatingNow = !1);
u.addNotification({
type: "success",
message: p(a.kind, !0) + " " + a.name + " was successfully updated."
}), m();
}, function(n) {
e.updatingNow = !1, e.error = {
message: t("getErrorDetails")(n)
};
})) : e.error = {
message: o.unsupportedObjectKindOrVersion(n)
} : e.error = {
message: "Cannot change resource group (original: " + (r.group || "<none>") + ", modified: " + (s.group || "<none>") + ")."
} : e.error = {
message: o.invalidObjectKindOrVersion(n)
};
} else e.error = {
message: "Cannot change resource kind (original: " + i.kind + ", modified: " + (n.kind || "<unspecified>") + ")."
};
}, e.cancel = function() {
m();
}, f.push(c.watchObject(s, e.name, r, function(t, n) {
e.resourceChanged = l(t) !== l(i), e.resourceDeleted = "DELETED" === n;
}, {
errorNotification: !1
}));
}, function(e) {
l.toErrorPage("Could not load " + p(a.kind) + " '" + a.name + "'. " + t("getErrorDetails")(e));
}), e.$on("$destroy", function() {
c.unwatchAll(f);
})) : l.toErrorPage("You do not have authority to update " + p(a.kind) + " " + a.name + ".", "access_denied");
}));
} else l.toErrorPage("Kind or name parameter missing.");
} ]), angular.module("openshiftConsole").controller("BrowseCategoryController", [ "$scope", "$filter", "$location", "$q", "$routeParams", "$uibModal", "Constants", "DataService", "LabelFilter", "Navigate", "ProjectsService", function(e, t, n, a, r, o, i, s, c, l, u) {
e.projectName = r.project;
var d = function(t, n) {
var a;
return _.some(t, function(t) {
if (a = _.find(t.items, {
id: n
})) {
e.category = a;
var r = _.get(a, "subcategories", []);
return e.subcategories = [ {
id: "",
label: ""
} ].concat(r), !0;
}
return !1;
}), a;
}, p = i.CATALOG_CATEGORIES, m = "none" === r.category ? "" : r.category;
if (e.category = d(p, m), e.category) {
var f, g;
!r.subcategory || (f = e.category, m = "none" === r.subcategory ? "" : r.subcategory, g = _.get(e.category, "subcategories", []), e.category = d(g, m), e.category) ? (e.alerts = e.alerts || {}, e.breadcrumbs = [ {
title: "Add to Project",
link: "project/" + e.projectName + "/create"
}, {
title: "Catalog",
link: "project/" + e.projectName + "/create?tab=fromCatalog"
} ], f && e.breadcrumbs.push({
title: f.label,
link: "project/" + e.projectName + "/create/category/" + f.id
}), e.breadcrumbs.push({
title: e.category.label
}), u.get(r.project).then(_.spread(function(t, n) {
e.project = t, e.context = n, s.list("imagestreams", {
namespace: "openshift"
}).then(function(t) {
e.openshiftImageStreams = t.by("metadata.name");
}), s.list("templates", {
namespace: "openshift"
}, null, {
partialObjectMetadataList: !0
}).then(function(t) {
e.openshiftTemplates = t.by("metadata.name");
}), "openshift" === r.project ? (e.projectImageStreams = [], e.projectTemplates = []) : (s.list("imagestreams", n).then(function(t) {
e.projectImageStreams = t.by("metadata.name");
}), s.list("templates", n, null, {
partialObjectMetadataList: !0
}).then(function(t) {
e.projectTemplates = t.by("metadata.name");
}));
}))) : l.toErrorPage("Catalog category " + r.category + "/" + r.subcategory + " not found.");
} else l.toErrorPage("Catalog category " + r.category + " not found.");
} ]), angular.module("openshiftConsole").controller("CreateFromImageController", [ "$scope", "$filter", "$parse", "$q", "$routeParams", "$uibModal", "APIService", "ApplicationGenerator", "DataService", "HPAService", "ImagesService", "LimitRangesService", "Logger", "MetricsService", "Navigate", "NotificationsService", "ProjectsService", "QuotaService", "SOURCE_URL_PATTERN", "SecretsService", "TaskList", "failureObjectNameFilter", "keyValueEditorUtils", function(e, t, n, a, r, o, i, s, c, l, u, d, p, m, f, g, h, v, y, b, C, S, w) {
var k = t("displayName"), j = t("humanize");
e.projectName = r.project, e.sourceURLPattern = y;
var P = r.imageStream;
if (P) if (r.imageTag) {
var R = r.displayName || P;
e.displayName = r.displayName, e.advancedOptions = "true" === r.advanced, e.breadcrumbs = [ {
title: "Add to Project",
link: "project/" + e.projectName + "/create"
}, {
title: "Catalog",
link: "project/" + e.projectName + "/create?tab=fromCatalog"
}, {
title: R
} ];
var I = {
name: "app",
value: ""
}, T = t("orderByDisplayName"), N = t("getErrorDetails"), E = {}, D = function() {
g.hideNotification("create-builder-list-config-maps-error"), g.hideNotification("create-builder-list-secrets-error"), _.each(E, function(e) {
!e.id || "error" !== e.type && "warning" !== e.type || g.hideNotification(e.id);
});
};
e.$on("$destroy", D), h.get(r.project).then(_.spread(function(t, n) {
e.project = t, r.sourceURI && (e.sourceURIinParams = !0);
var i = function() {
e.hideCPU || (e.cpuProblems = d.validatePodLimits(e.limitRanges, "cpu", [ e.container ], t)), e.memoryProblems = d.validatePodLimits(e.limitRanges, "memory", [ e.container ], t);
};
c.list("limitranges", n).then(function(t) {
e.limitRanges = t.by("metadata.name"), _.isEmpty(e.limitRanges) || e.$watch("container", i, !0);
});
var h, y, S = function() {
e.scaling.autoscale ? e.showCPURequestWarning = !l.hasCPURequest([ e.container ], e.limitRanges, t) : e.showCPURequestWarning = !1;
};
c.list("resourcequotas", n).then(function(e) {
h = e.by("metadata.name"), p.log("quotas", h);
}), c.list("appliedclusterresourcequotas", n).then(function(e) {
y = e.by("metadata.name"), p.log("cluster quotas", y);
}), e.$watch("scaling.autoscale", S), e.$watch("container", S, !0), e.$watch("name", function(e, t) {
I.value && I.value !== t || (I.value = e);
}), function(a) {
a.name = r.name, a.imageName = P, a.imageTag = r.imageTag, a.namespace = r.namespace, a.buildConfig = {
buildOnSourceChange: !0,
buildOnImageChange: !0,
buildOnConfigChange: !0,
secrets: {
gitSecret: [ {
name: ""
} ]
},
sourceUrl: r.sourceURI,
gitRef: r.sourceRef,
contextDir: r.contextDir
}, a.buildConfigEnvVars = [], a.deploymentConfig = {
deployOnNewImage: !0,
deployOnConfigChange: !0
}, a.DCEnvVarsFromImage, a.DCEnvVarsFromUser = [], a.routing = {
include: !0,
portOptions: []
}, a.labelArray = [ I ], a.annotations = {}, a.scaling = {
replicas: 1,
autoscale: !1,
autoscaleOptions: [ {
label: "Manual",
value: !1
}, {
label: "Automatic",
value: !0
} ]
}, a.container = {
resources: {}
}, a.cpuRequestCalculated = d.isRequestCalculated("cpu", t), a.cpuLimitCalculated = d.isLimitCalculated("cpu", t), a.memoryRequestCalculated = d.isRequestCalculated("memory", t), a.fillSampleRepo = function() {
var e;
(a.image || a.image.metadata || a.image.metadata.annotations) && (e = a.image.metadata.annotations, a.buildConfig.sourceUrl = e.sampleRepo || "", a.buildConfig.gitRef = e.sampleRef || "", a.buildConfig.contextDir = e.sampleContextDir || "", (e.sampleRef || e.sampleContextDir) && (a.advancedSourceOptions = !0));
}, a.usingSampleRepo = function() {
return a.buildConfig.sourceUrl === _.get(a, "image.metadata.annotations.sampleRepo");
}, m.isAvailable().then(function(t) {
e.metricsWarning = !t;
});
var o = [], i = [];
e.valueFromObjects = [], c.list("configmaps", n, null, {
errorNotification: !1
}).then(function(t) {
o = T(t.by("metadata.name")), e.valueFromObjects = o.concat(i);
}, function(e) {
403 !== e.code && g.addNotification({
id: "create-builder-list-config-maps-error",
type: "error",
message: "Could not load config maps.",
details: N(e)
});
}), c.list("secrets", n, null, {
errorNotification: !1
}).then(function(t) {
i = T(t.by("metadata.name")), e.valueFromObjects = i.concat(o);
var n = b.groupSecretsByType(t), a = _.mapValues(n, function(e) {
return _.map(e, "metadata.name");
});
e.secretsByType = _.each(a, function(e) {
e.unshift("");
});
}, function(e) {
403 !== e.code && g.addNotification({
id: "create-builder-list-secrets-error",
type: "error",
message: "Could not load secrets.",
details: N(e)
});
}), c.get("imagestreams", a.imageName, {
namespace: a.namespace || r.project
}).then(function(e) {
a.imageStream = e;
var t = a.imageTag;
c.get("imagestreamtags", e.metadata.name + ":" + t, {
namespace: a.namespace
}).then(function(e) {
a.image = e.image, a.DCEnvVarsFromImage = u.getEnvironment(e);
var t = s.parsePorts(e.image);
_.isEmpty(t) ? (a.routing.include = !1, a.routing.portOptions = []) : (a.routing.portOptions = _.map(t, function(e) {
var t = s.getServicePort(e);
return {
port: t.name,
label: t.targetPort + "/" + t.protocol
};
}), a.routing.targetPort = a.routing.portOptions[0].port);
}, function() {
f.toErrorPage("Cannot create from source: the specified image could not be retrieved.");
});
}, function() {
f.toErrorPage("Cannot create from source: the specified image could not be retrieved.");
});
}(e);
var A, $ = function() {
var t = {
started: "Creating application " + e.name + " in project " + e.projectDisplayName(),
success: "Created application " + e.name + " in project " + e.projectDisplayName(),
failure: "Failed to create " + e.name + " in project " + e.projectDisplayName()
}, o = {};
C.clear(), C.add(t, o, r.project, function() {
var t = a.defer();
return c.batch(A, n).then(function(n) {
var a = [], r = !1;
_.isEmpty(n.failure) ? a.push({
type: "success",
message: "All resources for application " + e.name + " were created successfully."
}) : (r = !0, n.failure.forEach(function(e) {
a.push({
type: "error",
message: "Cannot create " + j(e.object.kind).toLowerCase() + ' "' + e.object.metadata.name + '". ',
details: e.data.message
});
}), n.success.forEach(function(e) {
a.push({
type: "success",
message: "Created " + j(e.kind).toLowerCase() + ' "' + e.metadata.name + '" successfully. '
});
})), t.resolve({
alerts: a,
hasErrors: r
});
}), t.promise;
}), f.toNextSteps(e.name, e.projectName, {
usingSampleRepo: e.usingSampleRepo(),
breadcrumbTitle: R
});
}, B = function(e) {
o.open({
animation: !0,
templateUrl: "views/modals/confirm.html",
controller: "ConfirmModalController",
resolve: {
modalConfig: function() {
return {
alerts: e,
message: "Problems were detected while checking your application configuration.",
okButtonText: "Create Anyway",
okButtonClass: "btn-danger",
cancelButtonText: "Cancel"
};
}
}
}).result.then($);
}, L = function(t) {
D(), E = t.quotaAlerts || [], e.nameTaken || _.some(E, {
type: "error"
}) ? (e.disableInputs = !1, _.each(E, function(e) {
e.id = _.uniqueId("create-builder-alert-"), g.addNotification(e);
})) : _.isEmpty(E) ? $() : (B(E), e.disableInputs = !1);
};
e.projectDisplayName = function() {
return k(this.project) || this.projectName;
}, e.createApp = function() {
e.disableInputs = !0, D(), e.buildConfig.envVars = w.compactEntries(e.buildConfigEnvVars), e.deploymentConfig.envVars = w.compactEntries(e.DCEnvVarsFromUser), e.labels = w.mapEntries(w.compactEntries(e.labelArray));
var t = s.generate(e);
A = [], angular.forEach(t, function(e) {
null !== e && (p.debug("Generated resource definition:", e), A.push(e));
});
var a = s.ifResourcesDontExist(A, e.projectName), r = v.getLatestQuotaAlerts(A, n), o = function(t) {
return e.nameTaken = t.nameTaken, r;
};
a.then(o, o).then(L, L);
};
})), e.cancel = function() {
f.toProjectOverview(e.projectName);
};
} else f.toErrorPage("Cannot create from source: a base image tag was not specified"); else f.toErrorPage("Cannot create from source: a base image was not specified");
} ]), angular.module("openshiftConsole").controller("NextStepsController", [ "$scope", "$http", "$routeParams", "DataService", "$q", "$location", "TaskList", "$parse", "Navigate", "Logger", "$filter", "imageObjectRefFilter", "failureObjectNameFilter", "ProjectsService", function(e, t, n, a, r, o, i, s, c, l, u, d, p, m) {
u("displayName");
var f = [];
e.alerts = [], e.loginBaseUrl = a.openshiftAPIBaseUrl(), e.buildConfigs = {}, e.projectName = n.project, e.fromSampleRepo = n.fromSample, e.breadcrumbs = [ {
title: "Add to Project",
link: "project/" + e.projectName + "/create"
}, {
title: n.breadcrumbTitle || n.name
}, {
title: "Next Steps"
} ], m.get(n.project).then(_.spread(function(t, r) {
e.project = t, f.push(a.watch("buildconfigs", r, function(t) {
e.buildConfigs = t.by("metadata.name"), e.createdBuildConfig = e.buildConfigs[n.name], l.log("buildconfigs (subscribe)", e.buildConfigs);
})), e.$on("$destroy", function() {
a.unwatchAll(f);
});
}));
} ]), angular.module("openshiftConsole").controller("NewFromTemplateController", [ "$filter", "$location", "$parse", "$routeParams", "$scope", "CachedTemplateService", "DataService", "Navigate", "NotificationsService", "ProjectsService", function(e, t, n, a, r, o, i, s, c, l) {
function u(e, t) {
var n = _.get(e, "spec.triggers", []), a = _.find(n, function(e) {
if ("ImageChange" !== e.type) return !1;
var n = _.get(e, "imageChangeParams.containerNames", []);
return _.includes(n, t.name);
});
return _.get(a, "imageChangeParams.from.name");
}
function d(e) {
for (var t = [], n = w.exec(e); n; ) t.push(n[1]), n = w.exec(e);
return t;
}
function p() {
var e = g();
r.templateImages = _.map(k, function(t) {
return _.isEmpty(t.usesParameters) ? t : {
name: _.template(t.name, {
interpolate: w
})(e),
usesParameters: t.usesParameters
};
});
}
function m(e) {
var t = [], n = y(e);
return n && angular.forEach(n, function(n) {
var a = n.image, r = u(e, n);
r && (a = r), a && t.push(a);
}), t;
}
function f(e) {
k = [];
var t = [], n = {};
angular.forEach(e.objects, function(e) {
if ("BuildConfig" === e.kind) {
var a = S(b(e), v);
a && k.push({
name: a,
usesParameters: d(a)
});
var r = S(C(e), v);
r && (n[r] = !0);
}
"DeploymentConfig" === e.kind && (t = t.concat(m(e)));
}), t.forEach(function(e) {
n[e] || k.push({
name: e,
usesParameters: d(e)
});
}), k = _.uniqBy(k, "name");
}
function g() {
var e = {};
return _.each(r.template.parameters, function(t) {
e[t.name] = t.value;
}), e;
}
var h = a.template, v = a.namespace || "", y = n("spec.template.spec.containers"), b = n("spec.strategy.sourceStrategy.from || spec.strategy.dockerStrategy.from || spec.strategy.customStrategy.from"), C = n("spec.output.to"), S = e("imageObjectRef");
if (h) {
r.breadcrumbs = [ {
title: "Add to Project",
link: "project/" + a.project + "/create"
}, {
title: "Catalog",
link: "project/" + a.project + "/create?tab=fromCatalog"
}, {
title: h
} ];
a.templateParamsMap && (r.prefillParameters = function() {
try {
return JSON.parse(a.templateParamsMap);
} catch (e) {
c.addNotification({
id: "template-params-invalid-json",
type: "error",
message: "Could not prefill parameter values.",
details: "The `templateParamsMap` URL parameter is not valid JSON. " + e
});
}
}());
var w = /\${([a-zA-Z0-9\_]+)}/g, k = [];
l.get(a.project).then(_.spread(function(n) {
if (r.project = n, v) i.get("templates", h, {
namespace: v || r.project.metadata.name
}).then(function(t) {
r.template = t, r.breadcrumbs[2].title = e("displayName")(t), f(t);
_.some(k, function(e) {
return !_.isEmpty(e.usesParameters);
}) ? (r.parameterDisplayNames = {}, _.each(t.parameters, function(e) {
r.parameterDisplayNames[e.name] = e.displayName || e.name;
}), r.$watch("template.parameters", _.debounce(function() {
r.$apply(p);
}, 50, {
maxWait: 250
}), !0)) : r.templateImages = k;
}, function() {
s.toErrorPage("Cannot create from template: the specified template could not be retrieved.");
}); else {
if (r.template = o.getTemplate(), _.isEmpty(r.template)) {
var a = URI("error").query({
error: "not_found",
error_description: "Template wasn't found in cache."
}).toString();
t.url(a);
}
o.clearTemplate();
}
}));
} else s.toErrorPage("Cannot create from template: a template name was not specified.");
} ]), angular.module("openshiftConsole").controller("LabelsController", [ "$scope", function(e) {
e.expanded = !0, e.toggleExpanded = function() {
e.expanded = !e.expanded;
}, e.addLabel = function() {
e.labelKey && e.labelValue && (e.labels[e.labelKey] = e.labelValue, e.labelKey = "", e.labelValue = "", e.form.$setPristine(), e.form.$setUntouched());
}, e.deleteLabel = function(t) {
e.labels[t] && delete e.labels[t];
};
} ]), angular.module("openshiftConsole").controller("TasksController", [ "$scope", "TaskList", function(e, t) {
e.tasks = function() {
return t.taskList();
}, e.delete = function(e) {
t.deleteTask(e);
}, e.hasTaskWithError = function() {
var e = t.taskList();
return _.some(e, {
hasErrors: !0
});
};
} ]), angular.module("openshiftConsole").controller("EventsController", [ "$routeParams", "$scope", "ProjectsService", function(e, t, n) {
t.projectName = e.project, t.renderOptions = {
hideFilterWidget: !0
}, t.breadcrumbs = [ {
title: "Monitoring",
link: "project/" + e.project + "/monitoring"
}, {
title: "Events"
} ], n.get(e.project).then(_.spread(function(e, n) {
t.project = e, t.projectContext = n;
}));
} ]), angular.module("openshiftConsole").controller("OAuthController", [ "$scope", "$location", "$q", "RedirectLoginService", "DataService", "AuthService", "Logger", function(e, t, n, a, r, o, i) {
var s = i.get("auth");
e.completeLogin = function() {}, e.cancelLogin = function() {
t.replace(), t.url("./");
}, a.finish().then(function(n) {
var a = n.token, i = n.then, c = n.verified, l = n.ttl, u = {
errorNotification: !1,
http: {
auth: {
token: a,
triggerLogin: !1
}
}
};
s.log("OAuthController, got token, fetching user", u), r.get("users", "~", {}, u).then(function(n) {
if (s.log("OAuthController, got user", n), e.completeLogin = function() {
o.setUser(n, a, l);
var e = i || "./";
URI(e).is("absolute") && (s.log("OAuthController, invalid absolute redirect", e), e = "./"), s.log("OAuthController, redirecting", e), t.replace(), t.url(e);
}, c) e.completeLogin(); else {
e.confirmUser = n;
var r = o.UserStore().getUser();
r && r.metadata.name !== n.metadata.name && (e.overriddenUser = r);
}
}).catch(function(e) {
var n = URI("error").query({
error: "user_fetch_failed"
}).toString();
s.error("OAuthController, error fetching user", e, "redirecting", n), t.replace(), t.url(n);
});
}).catch(function(e) {
var n = URI("error").query({
error: e.error || "",
error_description: e.error_description || "",
error_uri: e.error_uri || ""
}).toString();
s.error("OAuthController, error", e, "redirecting", n), t.replace(), t.url(n);
});
} ]), angular.module("openshiftConsole").controller("ErrorController", [ "$scope", "$window", function(e, t) {
var n = URI(window.location.href).query(!0);
switch (n.error) {
case "access_denied":
e.errorMessage = "Access denied";
break;

case "not_found":
e.errorMessage = "Not found";
break;

case "invalid_request":
e.errorMessage = "Invalid request";
break;

case "API_DISCOVERY":
e.errorLinks = [ {
href: window.location.protocol + "//" + window.OPENSHIFT_CONFIG.api.openshift.hostPort + window.OPENSHIFT_CONFIG.api.openshift.prefix,
label: "Check Server Connection",
target: "_blank"
} ];
break;

default:
e.errorMessage = "An error has occurred";
}
n.error_description && (e.errorDetails = n.error_description), e.reloadConsole = function() {
t.location.href = "/";
};
} ]), angular.module("openshiftConsole").controller("LogoutController", [ "$scope", "$log", "AuthService", "AUTH_CFG", function(e, t, n, a) {
t.debug("LogoutController"), n.isLoggedIn() ? (t.debug("LogoutController, logged in, initiating logout"), e.logoutMessage = "Logging out...", n.startLogout().finally(function() {
n.isLoggedIn() ? (t.debug("LogoutController, logout failed, still logged in"), e.logoutMessage = 'You could not be logged out. Return to the <a href="./">console</a>.') : a.logout_uri ? (t.debug("LogoutController, logout completed, redirecting to AUTH_CFG.logout_uri", a.logout_uri), window.location.href = a.logout_uri) : (t.debug("LogoutController, logout completed, reloading the page"), window.location.reload(!1));
})) : a.logout_uri ? (t.debug("LogoutController, logout completed, redirecting to AUTH_CFG.logout_uri", a.logout_uri), e.logoutMessage = "Logging out...", window.location.href = a.logout_uri) : (t.debug("LogoutController, not logged in, logout complete"), e.logoutMessage = 'You are logged out. Return to the <a href="./">console</a>.');
} ]), angular.module("openshiftConsole").controller("CreateController", [ "$scope", "$filter", "$location", "$q", "$routeParams", "$uibModal", "CatalogService", "Constants", "DataService", "LabelFilter", "Logger", "ProjectsService", function(e, t, n, a, r, o, i, s, c, l, u, d) {
e.projectName = r.project, e.categories = s.CATALOG_CATEGORIES, e.alerts = e.alerts || {}, e.breadcrumbs = [ {
title: "Add to Project"
} ], d.get(r.project).then(_.spread(function(t, n) {
e.project = t, e.context = n, c.list("imagestreams", {
namespace: "openshift"
}).then(function(t) {
e.openshiftImageStreams = t.by("metadata.name");
}), c.list("templates", {
namespace: "openshift"
}, null, {
partialObjectMetadataList: !0
}).then(function(t) {
e.openshiftTemplates = t.by("metadata.name");
}), "openshift" === r.project ? (e.projectImageStreams = [], e.projectTemplates = []) : (c.list("imagestreams", n).then(function(t) {
e.projectImageStreams = t.by("metadata.name");
}), c.list("templates", n, null, {
partialObjectMetadataList: !0
}).then(function(t) {
e.projectTemplates = t.by("metadata.name");
}));
}));
} ]), angular.module("openshiftConsole").controller("CreateFromURLController", [ "$scope", "$routeParams", "$location", "$filter", "AuthService", "DataService", "Navigate", "ProjectsService", function(e, t, n, a, r, o, i, s) {
r.withUser(), e.alerts = {}, e.selected = {};
var c = function(t) {
e.alerts.invalidImageStream = {
type: "error",
message: 'The requested image stream "' + t + '" could not be loaded.'
};
}, l = function(t) {
e.alerts.invalidImageTag = {
type: "error",
message: 'The requested image stream tag "' + t + '" could not be loaded.'
};
}, u = function(t) {
e.alerts.invalidTemplate = {
type: "error",
message: 'The requested template "' + t + '" could not be loaded.'
};
}, d = function() {
try {
return t.templateParamsMap && JSON.parse(t.templateParamsMap) || {};
} catch (t) {
e.alerts.invalidTemplateParams = {
type: "error",
message: "The templateParamsMap is not valid JSON. " + t
};
}
}, p = window.OPENSHIFT_CONSTANTS.CREATE_FROM_URL_WHITELIST, m = [ "namespace", "name", "imageStream", "imageTag", "sourceURI", "sourceRef", "contextDir", "template", "templateParamsMap" ], f = _.pickBy(t, function(e, t) {
return _.includes(m, t) && _.isString(e);
});
f.namespace = f.namespace || "openshift";
_.includes(p, f.namespace) ? f.imageStream && f.template ? e.alerts.invalidResource = {
type: "error",
message: "Image streams and templates cannot be combined."
} : f.imageStream || f.template ? f.name && !function(e) {
return _.size(e) < 25 && /^[a-z]([-a-z0-9]*[a-z0-9])?$/.test(e);
}(f.name) ? function(t) {
e.alerts.invalidImageStream = {
type: "error",
message: 'The app name "' + t + "\" is not valid.  An app name is an alphanumeric (a-z, and 0-9) string with a maximum length of 24 characters, where the first character is a letter (a-z), and the '-' character is allowed anywhere except the first or last character."
};
}(f.name) : (f.imageStream && o.get("imagestreams", f.imageStream, {
namespace: f.namespace
}, {
errorNotification: !1
}).then(function(t) {
e.imageStream = t, o.get("imagestreamtags", t.metadata.name + ":" + f.imageTag, {
namespace: f.namespace
}, {
errorNotification: !1
}).then(function(t) {
e.imageStreamTag = t, e.validationPassed = !0, e.resource = t, f.displayName = a("displayName")(t);
}, function() {
l(f.imageTag);
});
}, function() {
c(f.imageStream);
}), f.template && o.get("templates", f.template, {
namespace: f.namespace
}, {
errorNotification: !1
}).then(function(t) {
e.template = t, d() && (e.validationPassed = !0, e.resource = t);
}, function() {
u(f.template);
})) : e.alerts.resourceRequired = {
type: "error",
message: "An image stream or template is required."
} : function(t) {
e.alerts.invalidNamespace = {
type: "error",
message: 'Resources from the namespace "' + t + '" are not permitted.'
};
}(f.namespace), angular.extend(e, {
createDetails: f,
createWithProject: function(a) {
a = a || e.selected.project.metadata.name;
var r = t.imageStream ? i.createFromImageURL(e.imageStream, f.imageTag, a, f) : i.createFromTemplateURL(e.template, a, f);
n.url(r);
}
}), e.projects = {}, e.canCreateProject = void 0, s.list().then(function(t) {
e.loaded = !0, e.projects = a("orderByDisplayName")(t.by("metadata.name")), e.noProjects = _.isEmpty(e.projects);
}), s.canCreate().then(function() {
e.canCreateProject = !0;
}, function() {
e.canCreateProject = !1;
});
} ]), angular.module("openshiftConsole").controller("CreateProjectController", [ "$scope", "$location", "$window", "AuthService", "Constants", function(e, t, n, a, r) {
var o = !r.DISABLE_SERVICE_CATALOG_LANDING_PAGE;
e.onProjectCreated = function(e) {
o ? n.history.back() : t.path("project/" + e + "/create");
}, a.withUser();
} ]), angular.module("openshiftConsole").controller("EditProjectController", [ "$scope", "$routeParams", "$filter", "$location", "DataService", "ProjectsService", "Navigate", function(e, t, n, a, r, o, i) {
e.alerts = {};
var s = n("annotation"), c = n("annotationName");
o.get(t.project).then(_.spread(function(r) {
var l = function(e) {
return {
description: s(e, "description"),
displayName: s(e, "displayName")
};
}, u = function(e, t) {
var n = angular.copy(e);
return n.metadata.annotations[c("description")] = t.description, n.metadata.annotations[c("displayName")] = t.displayName, n;
};
angular.extend(e, {
project: r,
editableFields: l(r),
show: {
editing: !1
},
actions: {
canSubmit: !1
},
canSubmit: function(t) {
e.actions.canSubmit = t;
},
update: function() {
e.disableInputs = !0, o.update(t.project, u(r, e.editableFields)).then(function() {
t.then ? a.path(t.then) : i.toProjectOverview(r.metadata.name);
}, function(t) {
e.disableInputs = !1, e.editableFields = l(r), e.alerts.update = {
type: "error",
message: "An error occurred while updating the project",
details: n("getErrorDetails")(t)
};
});
}
});
}));
} ]), angular.module("openshiftConsole").controller("CreateRouteController", [ "$filter", "$routeParams", "$scope", "$window", "ApplicationGenerator", "AuthorizationService", "DataService", "Navigate", "NotificationsService", "ProjectsService", "keyValueEditorUtils", function(e, t, n, a, r, o, i, s, c, l, u) {
n.renderOptions = {
hideFilterWidget: !0
}, n.projectName = t.project, n.serviceName = t.service, n.labels = [], n.routing = {
name: n.serviceName || ""
}, n.breadcrumbs = [ {
title: "Routes",
link: "project/" + n.projectName + "/browse/routes"
}, {
title: "Create Route"
} ];
var d = function() {
c.hideNotification("create-route-error");
};
n.$on("$destroy", d);
var p = function() {
a.history.back();
};
n.cancel = p, l.get(t.project).then(_.spread(function(a, l) {
if (n.project = a, o.canI("routes", "create", t.project)) {
var m, f = e("orderByDisplayName");
n.routing.to = {
kind: "Service",
name: n.serviceName,
weight: 1
};
var g, h = function() {
var e = g, t = _.get(n, "routing.to.name");
g = _.get(m, [ t, "metadata", "labels" ], {});
var a = u.mapEntries(u.compactEntries(n.labels)), r = _.assign(a, g);
e && (r = _.omitBy(r, function(t, n) {
return e[n] && !g[n];
})), n.labels = _.map(r, function(e, t) {
return {
name: t,
value: e
};
});
};
i.list("services", l).then(function(e) {
m = e.by("metadata.name"), n.services = f(m), n.$watch("routing.to.name", h);
}), n.createRoute = function() {
if (n.createRouteForm.$valid) {
d(), n.disableInputs = !0;
var t = n.routing.to.name, a = u.mapEntries(u.compactEntries(n.labels)), o = r.createRoute(n.routing, t, a), s = _.get(n, "routing.alternateServices", []);
_.isEmpty(s) || (o.spec.to.weight = _.get(n, "routing.to.weight"), o.spec.alternateBackends = _.map(s, function(e) {
return {
kind: "Service",
name: e.name,
weight: e.weight
};
})), i.create("routes", null, o, l).then(function() {
c.addNotification({
type: "success",
message: "Route " + o.metadata.name + " was successfully created."
}), p();
}, function(t) {
n.disableInputs = !1, c.addNotification({
type: "error",
id: "create-route-error",
message: "An error occurred creating the route.",
details: e("getErrorDetails")(t)
});
});
}
};
} else s.toErrorPage("You do not have authority to create routes in project " + t.project + ".", "access_denied");
}));
} ]), angular.module("openshiftConsole").controller("AttachPVCController", [ "$filter", "$routeParams", "$scope", "$window", "APIService", "AuthorizationService", "BreadcrumbsService", "DataService", "QuotaService", "Navigate", "NotificationsService", "ProjectsService", "StorageService", "RELATIVE_PATH_PATTERN", function(e, t, n, a, r, o, i, s, c, l, u, d, p, m) {
if (t.kind && t.name) {
var f = [ "Deployment", "DeploymentConfig", "ReplicaSet", "ReplicationController" ], g = e("humanizeKind");
if (_.includes(f, t.kind)) {
var h = {
resource: r.kindToResource(t.kind),
group: t.group
};
n.projectName = t.project, n.kind = t.kind, n.name = t.name, n.RELATIVE_PATH_PATTERN = m, n.outOfClaims = !1, n.attach = {
persistentVolumeClaim: null,
volumeName: null,
mountPath: null,
allContainers: !0,
containers: {}
}, n.breadcrumbs = i.getBreadcrumbs({
name: t.name,
kind: t.kind,
namespace: t.project,
subpage: "Add Storage"
}), n.pvcVersion = r.getPreferredVersion("persistentvolumeclaims");
var v = r.getPreferredVersion("resourcequotas"), y = r.getPreferredVersion("appliedclusterresourcequotas");
d.get(t.project).then(_.spread(function(r, d) {
if (n.project = r, o.canI(h, "update", t.project)) {
var m = e("orderByDisplayName"), f = e("getErrorDetails"), b = e("generateName"), C = function(e, t) {
n.disableInputs = !0, u.addNotification({
id: "attach-pvc-error",
type: "error",
message: e,
details: t
});
}, S = function() {
u.hideNotification("attach-pvc-error");
};
n.$on("$destroy", S);
var w = function() {
a.history.back();
};
n.cancel = w;
var k = function(e) {
return n.attach.allContainers || n.attach.containers[e.name];
}, j = function() {
var e = _.get(n, "attach.resource.spec.template");
n.existingMountPaths = p.getMountPaths(e, k);
};
n.$watchGroup([ "attach.resource", "attach.allContainers" ], j), n.$watch("attach.containers", j, !0);
s.get(h, t.name, d).then(function(e) {
n.attach.resource = e, n.breadcrumbs = i.getBreadcrumbs({
object: e,
project: r,
subpage: "Add Storage"
});
var t = _.get(e, "spec.template");
n.existingVolumeNames = p.getVolumeNames(t);
}, function(e) {
C(t.name + " could not be loaded.", f(e));
}), s.list(n.pvcVersion, d).then(function(e) {
n.pvcs = m(e.by("metadata.name")), _.isEmpty(n.pvcs) || n.attach.persistentVolumeClaim || (n.attach.persistentVolumeClaim = _.head(n.pvcs));
}), s.list(v, {
namespace: n.projectName
}, function(e) {
n.quotas = e.by("metadata.name"), n.outOfClaims = c.isAnyStorageQuotaExceeded(n.quotas, n.clusterQuotas);
}), s.list(y, {
namespace: n.projectName
}, function(e) {
n.clusterQuotas = e.by("metadata.name"), n.outOfClaims = c.isAnyStorageQuotaExceeded(n.quotas, n.clusterQuotas);
}), n.attachPVC = function() {
if (n.disableInputs = !0, S(), n.attachPVCForm.$valid) {
n.attach.volumeName || (n.attach.volumeName = b("volume-"));
var e = n.attach.resource, a = _.get(e, "spec.template"), r = n.attach.persistentVolumeClaim, o = n.attach.volumeName, i = n.attach.mountPath, c = n.attach.subPath, l = n.attach.readOnly;
i && angular.forEach(a.spec.containers, function(e) {
if (k(e)) {
var t = p.createVolumeMount(o, i, c, l);
e.volumeMounts || (e.volumeMounts = []), e.volumeMounts.push(t);
}
});
var m = p.createVolume(o, r);
a.spec.volumes || (a.spec.volumes = []), a.spec.volumes.push(m), s.update(h, e.metadata.name, n.attach.resource, d).then(function() {
var e;
i || (e = "No mount path was provided. The volume reference was added to the configuration, but it will not be mounted into running pods."), u.addNotification({
type: "success",
message: "Persistent volume claim " + r.metadata.name + " added to " + g(t.kind) + " " + t.name + ".",
details: e
}), w();
}, function(e) {
C("An error occurred attaching the persistent volume claim to the " + g(t.kind) + ".", f(e)), n.disableInputs = !1;
});
}
};
} else l.toErrorPage("You do not have authority to update " + g(t.kind) + " " + t.name + ".", "access_denied");
}));
} else l.toErrorPage("Storage is not supported for kind " + g(t.kind) + ".");
} else l.toErrorPage("Kind or name parameter missing.");
} ]), angular.module("openshiftConsole").controller("AddConfigVolumeController", [ "$filter", "$location", "$routeParams", "$scope", "$window", "APIService", "AuthorizationService", "BreadcrumbsService", "DataService", "Navigate", "NotificationsService", "ProjectsService", "StorageService", "RELATIVE_PATH_PATTERN", function(e, t, n, a, r, o, i, s, c, l, u, d, p, m) {
if (n.kind && n.name) {
var f = [ "Deployment", "DeploymentConfig", "ReplicaSet", "ReplicationController" ];
if (_.includes(f, n.kind)) {
var g = {
resource: o.kindToResource(n.kind),
group: n.group
};
a.projectName = n.project, a.kind = n.kind, a.name = n.name, a.attach = {
allContainers: !0,
pickKeys: !1
}, a.forms = {}, a.RELATIVE_PATH_PATTERN = m, a.breadcrumbs = s.getBreadcrumbs({
name: n.name,
kind: n.kind,
namespace: n.project,
subpage: "Add Config Files"
}), a.configMapVersion = o.getPreferredVersion("configmaps"), a.secretVersion = o.getPreferredVersion("secrets");
var h = e("humanizeKind");
a.groupByKind = function(e) {
return h(e.kind);
};
a.$watch("attach.source", function() {
_.set(a, "attach.items", [ {} ]);
});
var v = function() {
a.forms.addConfigVolumeForm.$setDirty();
}, y = function() {
r.history.back();
};
a.cancel = y;
var b = function(e, t) {
u.addNotification({
id: "add-config-volume-error",
type: "error",
message: e,
details: t
});
}, C = function() {
u.hideNotification("add-config-volume-error");
};
a.$on("$destroy", C), a.addItem = function() {
a.attach.items.push({}), v();
}, a.removeItem = function(e) {
a.attach.items.splice(e, 1), v();
}, d.get(n.project).then(_.spread(function(t, r) {
if (a.project = t, i.canI(g, "update", n.project)) {
var o = e("orderByDisplayName"), d = e("getErrorDetails"), m = e("generateName");
c.get(g, n.name, r, {
errorNotification: !1
}).then(function(e) {
a.targetObject = e, a.breadcrumbs = s.getBreadcrumbs({
object: e,
project: t,
subpage: "Add Config Files"
});
}, function(e) {
a.error = e;
}), c.list(a.configMapVersion, r, null, {
errorNotification: !1
}).then(function(e) {
a.configMaps = o(e.by("metadata.name"));
}, function(e) {
403 !== e.code ? b("Could not load config maps", d(e)) : a.configMaps = [];
}), c.list(a.secretVersion, r, null, {
errorNotification: !1
}).then(function(e) {
a.secrets = o(e.by("metadata.name"));
}, function(e) {
403 !== e.code ? b("Could not load secrets", d(e)) : a.secrets = [];
});
var f = function(e) {
return a.attach.allContainers || a.attach.containers[e.name];
}, v = function() {
var e = _.get(a, "targetObject.spec.template");
a.existingMountPaths = p.getMountPaths(e, f);
};
a.$watchGroup([ "targetObject", "attach.allContainers" ], v), a.$watch("attach.containers", v, !0);
a.$watch("attach.items", function() {
var e = _.map(a.attach.items, "path");
a.itemPaths = _.compact(e);
}, !0), a.addVolume = function() {
if (!a.forms.addConfigVolumeForm.$invalid) {
var t = a.targetObject, o = _.get(a, "attach.source"), i = _.get(t, "spec.template"), s = m("volume-"), l = {
name: s,
mountPath: _.get(a, "attach.mountPath")
};
"Secret" === o.kind && (l.readOnly = !0), _.each(i.spec.containers, function(e) {
f(e) && (e.volumeMounts = e.volumeMounts || [], e.volumeMounts.push(l));
});
var p, h = {
name: s
};
switch (a.attach.pickKeys && (p = a.attach.items), o.kind) {
case "ConfigMap":
h.configMap = {
name: o.metadata.name,
items: p
};
break;

case "Secret":
h.secret = {
secretName: o.metadata.name,
items: p
};
}
i.spec.volumes = i.spec.volumes || [], i.spec.volumes.push(h), a.disableInputs = !0, C();
var v = e("humanizeKind"), S = v(o.kind), w = v(n.kind);
c.update(g, t.metadata.name, a.targetObject, r).then(function() {
u.addNotification({
type: "success",
message: "Successfully added " + S + " " + o.metadata.name + " to " + w + " " + n.name + "."
}), y();
}, function(e) {
a.disableInputs = !1, b("An error occurred attaching the " + S + " to the " + w + ".", d(e));
});
}
};
} else l.toErrorPage("You do not have authority to update " + h(n.kind) + " " + n.name + ".", "access_denied");
}));
} else l.toErrorPage("Volumes are not supported for kind " + n.kind + ".");
} else l.toErrorPage("Kind or name parameter missing.");
} ]), angular.module("openshiftConsole").controller("CreateSecretModalController", [ "$scope", "$uibModalInstance", function(e, t) {
e.onCreate = function(e) {
t.close(e);
}, e.onCancel = function() {
t.dismiss("cancel");
};
} ]), angular.module("openshiftConsole").controller("ConfirmModalController", [ "$scope", "$uibModalInstance", "modalConfig", function(e, t, n) {
_.extend(e, n), e.confirm = function() {
t.close("confirm");
}, e.cancel = function() {
t.dismiss("cancel");
};
} ]), angular.module("openshiftConsole").controller("ConfirmScaleController", [ "$scope", "$uibModalInstance", "resource", "type", function(e, t, n, a) {
e.resource = n, e.type = a, e.confirmScale = function() {
t.close("confirmScale");
}, e.cancel = function() {
t.dismiss("cancel");
};
} ]), angular.module("openshiftConsole").controller("ConfirmSaveLogController", [ "$scope", "$uibModalInstance", "object", "CLIHelp", function(e, t, n, a) {
e.object = n, e.command = a.getLogsCommand(n), e.save = function() {
t.close("save");
}, e.cancel = function() {
t.dismiss("cancel");
};
} ]), angular.module("openshiftConsole").controller("DeleteModalController", [ "$scope", "$uibModalInstance", function(e, t) {
e.delete = function() {
t.close("delete");
}, e.cancel = function() {
t.dismiss("cancel");
};
} ]), angular.module("openshiftConsole").controller("DebugTerminalModalController", [ "$scope", "$filter", "$uibModalInstance", "container", "image", function(e, t, n, a, r) {
e.container = a, e.image = r, e.$watch("debugPod.status.containerStatuses", function() {
e.containerState = _.get(e, "debugPod.status.containerStatuses[0].state");
}), e.close = function() {
n.close("close");
};
} ]), angular.module("openshiftConsole").controller("ConfirmReplaceModalController", [ "$scope", "$uibModalInstance", function(e, t) {
e.replace = function() {
t.close("replace");
}, e.cancel = function() {
t.dismiss("cancel");
};
} ]), angular.module("openshiftConsole").controller("ProcessOrSaveTemplateModalController", [ "$scope", "$uibModalInstance", function(e, t) {
e.continue = function() {
t.close("create");
}, e.cancel = function() {
t.dismiss("cancel");
};
} ]), angular.module("openshiftConsole").controller("LinkServiceModalController", [ "$scope", "$uibModalInstance", "ServicesService", function(e, t, n) {
e.$watch("services", function(t) {
var a = n.getDependentServices(e.service);
e.options = _.filter(t, function(t) {
return t !== e.service && !_.includes(a, t.metadata.name);
}), 1 === _.size(e.options) && _.set(e, "link.selectedService", _.head(e.options));
}), e.link = function() {
t.close(_.get(e, "link.selectedService"));
}, e.cancel = function() {
t.dismiss();
};
} ]), angular.module("openshiftConsole").controller("JenkinsfileExamplesModalController", [ "$scope", "$uibModalInstance", function(e, t) {
e.ok = function() {
t.close("ok");
};
} ]), angular.module("openshiftConsole").controller("AboutComputeUnitsModalController", [ "$scope", "$uibModalInstance", function(e, t) {
e.ok = function() {
t.close("ok");
};
} ]), angular.module("openshiftConsole").controller("AboutController", [ "$scope", "AuthService", "Constants", function(e, t, n) {
t.withUser(), e.version = {
master: {
openshift: n.VERSION.openshift,
kubernetes: n.VERSION.kubernetes
}
};
} ]), angular.module("openshiftConsole").controller("CommandLineController", [ "$scope", "DataService", "AuthService", "Constants", function(e, t, n, a) {
n.withUser(), e.cliDownloadURL = a.CLI, e.cliDownloadURLPresent = e.cliDownloadURL && !_.isEmpty(e.cliDownloadURL), e.loginBaseURL = t.openshiftAPIBaseUrl(), a.DISABLE_COPY_LOGIN_COMMAND || (e.sessionToken = n.UserStore().getToken());
} ]), angular.module("openshiftConsole").controller("CreatePersistentVolumeClaimController", [ "$filter", "$routeParams", "$scope", "$window", "ApplicationGenerator", "AuthorizationService", "DataService", "Navigate", "NotificationsService", "ProjectsService", "keyValueEditorUtils", function(e, t, n, a, r, o, i, s, c, l, u) {
n.projectName = t.project, n.accessModes = "ReadWriteOnce", n.claim = {}, n.breadcrumbs = [ {
title: "Storage",
link: "project/" + n.projectName + "/browse/storage"
}, {
title: "Create Storage"
} ];
var d = function() {
c.hideNotification("create-pvc-error");
};
n.$on("$destroy", d);
var p = function() {
a.history.back();
};
n.cancel = p, l.get(t.project).then(_.spread(function(a, r) {
function l() {
var e = {
kind: "PersistentVolumeClaim",
apiVersion: "v1",
metadata: {
name: n.claim.name,
labels: {},
annotations: {}
},
spec: {
resources: {
requests: {}
}
}
};
e.spec.accessModes = [ n.claim.accessModes || "ReadWriteOnce" ];
var t = n.claim.unit || "Mi";
if (e.spec.resources.requests.storage = n.claim.amount + t, n.claim.selectedLabels) {
var a = u.mapEntries(u.compactEntries(n.claim.selectedLabels));
_.isEmpty(a) || _.set(e, "spec.selector.matchLabels", a);
}
return n.claim.storageClass && "No Storage Class" !== n.claim.storageClass.metadata.name && (e.metadata.annotations["volume.beta.kubernetes.io/storage-class"] = n.claim.storageClass.metadata.name), e;
}
n.project = a, o.canI("persistentvolumeclaims", "create", t.project) ? n.createPersistentVolumeClaim = function() {
if (d(), n.createPersistentVolumeClaimForm.$valid) {
n.disableInputs = !0;
var t = l();
i.create("persistentvolumeclaims", null, t, r).then(function(e) {
c.addNotification({
type: "success",
message: "Persistent volume claim " + e.metadata.name + " successfully created."
}), p();
}, function(t) {
n.disableInputs = !1, c.addNotification({
id: "create-pvc-error",
type: "error",
message: "An error occurred requesting storage.",
details: e("getErrorDetails")(t)
});
});
}
} : s.toErrorPage("You do not have authority to create persistent volume claims in project " + t.project + ".", "access_denied");
}));
} ]), angular.module("openshiftConsole").directive("buildClose", [ "$window", function(e) {
var t = function(e) {
return "hide/build/" + e.metadata.uid;
}, n = function(e) {
var n = t(e);
return "true" === sessionStorage.getItem(n);
};
return {
restrict: "AE",
scope: {
build: "=",
hideBuild: "="
},
controller: [ "$scope", function(e) {
e.onHideBuild = function() {
var n = t(e.build);
e.hideBuild = !0, sessionStorage.setItem(n, "true");
};
} ],
link: function(e, t, a, r) {
e.hideBuild = !1, e.$watch("build", function(t) {
e.hideBuild = n(t);
});
},
templateUrl: "views/directives/_build-close.html"
};
} ]), angular.module("openshiftConsole").directive("createSecret", [ "$filter", "AuthorizationService", "DataService", "NotificationsService", "DNS1123_SUBDOMAIN_VALIDATION", function(e, t, n, a, r) {
return {
restrict: "E",
scope: {
type: "=",
serviceAccountToLink: "=?",
namespace: "=",
onCreate: "&",
onCancel: "&"
},
templateUrl: "views/directives/create-secret.html",
link: function(o) {
o.nameValidation = r, o.secretAuthTypeMap = {
image: {
label: "Image Secret",
authTypes: [ {
id: "kubernetes.io/dockercfg",
label: "Image Registry Credentials"
}, {
id: "kubernetes.io/dockerconfigjson",
label: "Configuration File"
} ]
},
source: {
label: "Source Secret",
authTypes: [ {
id: "kubernetes.io/basic-auth",
label: "Basic Authentication"
}, {
id: "kubernetes.io/ssh-auth",
label: "SSH Key"
} ]
}
}, o.secretTypes = _.keys(o.secretAuthTypeMap), o.type ? o.newSecret = {
type: o.type,
authType: o.secretAuthTypeMap[o.type].authTypes[0].id,
data: {},
linkSecret: !_.isEmpty(o.serviceAccountToLink),
pickedServiceAccountToLink: o.serviceAccountToLink || ""
} : o.newSecret = {
type: "source",
authType: "kubernetes.io/basic-auth",
data: {},
linkSecret: !1,
pickedServiceAccountToLink: ""
}, o.add = {
gitconfig: !1,
cacert: !1
}, t.canI("serviceaccounts", "list") && t.canI("serviceaccounts", "update") && n.list("serviceaccounts", o, function(e) {
o.serviceAccounts = e.by("metadata.name"), o.serviceAccountsNames = _.keys(o.serviceAccounts);
});
var i = function(e, t) {
var n = {
apiVersion: "v1",
kind: "Secret",
metadata: {
name: o.newSecret.data.secretName
},
type: t,
data: {}
};
switch (t) {
case "kubernetes.io/basic-auth":
e.passwordToken ? n.data = {
password: window.btoa(e.passwordToken)
} : n.type = "Opaque", e.username && (n.data.username = window.btoa(e.username)), e.gitconfig && (n.data[".gitconfig"] = window.btoa(e.gitconfig)), e.cacert && (n.data["ca.crt"] = window.btoa(e.cacert));
break;

case "kubernetes.io/ssh-auth":
n.data = {
"ssh-privatekey": window.btoa(e.privateKey)
}, e.gitconfig && (n.data[".gitconfig"] = window.btoa(e.gitconfig));
break;

case "kubernetes.io/dockerconfigjson":
var a = window.btoa(e.dockerConfig);
JSON.parse(e.dockerConfig).auths ? n.data[".dockerconfigjson"] = a : (n.type = "kubernetes.io/dockercfg", n.data[".dockercfg"] = a);
break;

case "kubernetes.io/dockercfg":
var r = window.btoa(e.dockerUsername + ":" + e.dockerPassword), i = {};
i[e.dockerServer] = {
username: e.dockerUsername,
password: e.dockerPassword,
email: e.dockerMail,
auth: r
}, n.data[".dockercfg"] = window.btoa(JSON.stringify(i));
}
return n;
}, s = function() {
a.hideNotification("create-secret-error");
}, c = function(t) {
var r = angular.copy(o.serviceAccounts[o.newSecret.pickedServiceAccountToLink]);
switch (o.newSecret.type) {
case "source":
r.secrets.push({
name: t.metadata.name
});
break;

case "image":
r.imagePullSecrets.push({
name: t.metadata.name
});
}
n.update("serviceaccounts", o.newSecret.pickedServiceAccountToLink, r, o).then(function(e) {
a.addNotification({
type: "success",
message: "Secret " + t.metadata.name + " was created and linked with service account " + e.metadata.name + "."
}), o.onCreate({
newSecret: t
});
}, function(n) {
a.addNotification({
type: "success",
message: "Secret " + t.metadata.name + " was created."
}), o.serviceAccountToLink || a.addNotification({
id: "secret-sa-link-error",
type: "error",
message: "An error occurred while linking the secret with service account " + o.newSecret.pickedServiceAccountToLink + ".",
details: e("getErrorDetails")(n)
}), o.onCreate({
newSecret: t
});
});
}, l = _.debounce(function() {
try {
JSON.parse(o.newSecret.data.dockerConfig), o.invalidConfigFormat = !1;
} catch (e) {
o.invalidConfigFormat = !0;
}
}, 300, {
leading: !0
});
o.aceChanged = l, o.nameChanged = function() {
o.nameTaken = !1;
}, o.create = function() {
s();
var r = i(o.newSecret.data, o.newSecret.authType);
n.create("secrets", null, r, o).then(function(e) {
o.newSecret.linkSecret && o.serviceAccountsNames.contains(o.newSecret.pickedServiceAccountToLink) && t.canI("serviceaccounts", "update") ? c(e) : (a.addNotification({
type: "success",
message: "Secret " + r.metadata.name + " was created."
}), o.onCreate({
newSecret: e
}));
}, function(t) {
"AlreadyExists" !== (t.data || {}).reason ? a.addNotification({
id: "create-secret-error",
type: "error",
message: "An error occurred while creating the secret.",
details: e("getErrorDetails")(t)
}) : o.nameTaken = !0;
});
}, o.cancel = function() {
s(), o.onCancel();
};
}
};
} ]), angular.module("openshiftConsole").directive("timeOnlyDurationUntilNow", function() {
return {
restrict: "E",
scope: {
timestamp: "=",
omitSingle: "=?",
precision: "=?"
},
template: '<span data-timestamp="{{timestamp}}" data-time-only="true" class="duration">{{timestamp | timeOnlyDurationFromTimestamps : null}}</span>'
};
}).directive("durationUntilNow", function() {
return {
restrict: "E",
scope: {
timestamp: "=",
omitSingle: "=?",
precision: "=?"
},
template: '<span data-timestamp="{{timestamp}}" data-omit-single="{{omitSingle}}" data-precision="{{precision}}" class="duration">{{timestamp | duration : null : omitSingle : precision}}</span>'
};
}), angular.module("openshiftConsole").directive("deleteLink", [ "$uibModal", "$location", "$filter", "$q", "hashSizeFilter", "APIService", "DataService", "Navigate", "NotificationsService", "Logger", function(e, t, n, a, r, o, i, s, c, l) {
return {
restrict: "E",
scope: {
kind: "@",
group: "@?",
typeDisplayName: "@?",
resourceName: "@",
projectName: "@",
alerts: "=",
displayName: "@",
disableDelete: "=?",
typeNameToConfirm: "=?",
label: "@?",
buttonOnly: "@",
stayOnCurrentPage: "=?",
hpaList: "=?",
success: "=?",
redirectUrl: "@?"
},
templateUrl: function(e, t) {
return angular.isDefined(t.buttonOnly) ? "views/directives/delete-button.html" : "views/directives/delete-link.html";
},
replace: !0,
link: function(a, r, u) {
"Project" === u.kind && (a.isProject = !0), a.options = {
deleteHPAs: !0,
deleteImmediately: !1
};
var d = function(e) {
a.stayOnCurrentPage && a.alerts ? a.alerts[e.name] = e.data : c.addNotification(e.data);
}, p = function(e) {
return i.delete({
resource: "horizontalpodautoscalers",
group: "autoscaling"
}, e.metadata.name, {
namespace: a.projectName
}).then(function() {
c.addNotification({
type: "success",
message: "Horizontal pod autoscaler " + e.metadata.name + " was marked for deletion."
});
}).catch(function(t) {
d({
name: e.metadata.name,
data: {
type: "error",
message: "Horizontal pod autoscaler " + e.metadata.name + " could not be deleted."
}
}), l.error("HPA " + e.metadata.name + " could not be deleted.", t);
});
}, m = function() {
if (!a.stayOnCurrentPage) if (a.redirectUrl) t.url(a.redirectUrl); else if ("Project" === a.kind) if ("/" !== t.path()) {
var e = URI("/");
t.url(e);
} else a.$emit("deleteProject"); else s.toResourceList(o.kindToResource(a.kind), a.projectName);
};
a.openDeleteModal = function() {
a.disableDelete || e.open({
animation: !0,
templateUrl: "views/modals/delete-resource.html",
controller: "DeleteModalController",
scope: a
}).result.then(function() {
var e = a.kind, t = a.resourceName, r = a.typeDisplayName || n("humanizeKind")(e), s = _.capitalize(r) + " '" + (a.displayName ? a.displayName : t) + "'", u = "Project" === a.kind ? {} : {
namespace: a.projectName
}, f = {};
a.options.deleteImmediately && (f.gracePeriodSeconds = 0, f.propagationPolicy = null), "servicecatalog.k8s.io" === a.group && (f.propagationPolicy = null), i.delete({
resource: o.kindToResource(e),
group: a.group
}, t, u, f).then(function() {
c.addNotification({
type: "success",
message: s + " was marked for deletion."
}), a.success && a.success(), a.options.deleteHPAs && _.each(a.hpaList, p), m();
}).catch(function(e) {
d({
name: t,
data: {
type: "error",
message: _.capitalize(s) + "' could not be deleted.",
details: n("getErrorDetails")(e)
}
}), l.error(s + " could not be deleted.", e);
});
});
};
}
};
} ]), angular.module("openshiftConsole").directive("editWebhookTriggers", function() {
return {
restrict: "E",
scope: {
type: "@",
typeInfo: "@",
triggers: "=",
bcName: "=",
projectName: "=",
form: "="
},
templateUrl: "views/directives/edit-webhook-triggers.html"
};
}), angular.module("openshiftConsole").directive("editConfigMap", [ "DNS1123_SUBDOMAIN_VALIDATION", function(e) {
return {
require: "^form",
restrict: "E",
scope: {
configMap: "=model",
showNameInput: "="
},
templateUrl: "views/directives/edit-config-map.html",
link: function(t, n, a, r) {
t.form = r, t.nameValidation = e, t.addItem = function() {
t.data.push({
key: "",
value: ""
}), t.form.$setDirty();
}, t.removeItem = function(e) {
t.data.splice(e, 1), t.form.$setDirty();
}, t.getKeys = function() {
return _.map(t.data, "key");
};
var o = t.$watch("configMap.data", function(e) {
e && (t.data = _.map(e, function(e, t) {
return {
key: t,
value: e
};
}), _.sortBy(t.data, "key"), _.isEmpty(t.data) && t.addItem(), o(), t.$watch("data", function(e) {
var n = {};
_.each(e, function(e) {
n[e.key] = e.value;
}), _.set(t, "configMap.data", n);
}, !0));
});
}
};
} ]), angular.module("openshiftConsole").directive("events", [ "$routeParams", "$filter", "DataService", "KeywordService", "ProjectsService", "Logger", function(e, t, n, a, r, o) {
return {
restrict: "E",
scope: {
apiObjects: "=?",
projectContext: "="
},
templateUrl: "views/directives/events.html",
controller: [ "$scope", function(e) {
var t, r = {}, i = [];
e.filter = {
text: ""
};
var s = function(e) {
return _.isEmpty(r) ? e : _.filter(e, function(e) {
return r[e.involvedObject.uid];
});
}, c = [], l = _.get(e, "sortConfig.currentField.id"), u = {
lastTimestamp: !0
}, d = function() {
var t = _.get(e, "sortConfig.currentField.id", "lastTimestamp");
l !== t && (l = t, e.sortConfig.isAscending = !u[l]);
var n = e.sortConfig.isAscending ? "asc" : "desc";
c = _.orderBy(e.events, [ t ], [ n ]);
}, p = [], m = function() {
e.filterExpressions = p = a.generateKeywords(_.get(e, "filter.text"));
}, f = [ "reason", "message", "type" ];
e.resourceKind && e.resourceName || f.splice(0, 0, "involvedObject.name", "involvedObject.kind");
var g = function() {
e.filteredEvents = a.filterForKeywords(c, f, p);
};
e.$watch("filter.text", _.debounce(function() {
m(), e.$evalAsync(g);
}, 50, {
maxWait: 250
}));
var h = function() {
d(), g();
}, v = _.debounce(function() {
t && e.$evalAsync(function() {
e.events = s(t), h();
});
}, 250, {
leading: !0,
trailing: !0,
maxWait: 1e3
});
e.$watch("apiObjects", function(n) {
r = {}, _.each(n, function(e) {
_.get(e, "metadata.uid") && (r[e.metadata.uid] = !0);
}), e.showKindAndName = 1 !== _.size(r), t && v();
}), e.$watch("showKindAndName", function(t) {
e.sortConfig = {
fields: [ {
id: "lastTimestamp",
title: "Time",
sortType: "alpha"
}, {
id: "type",
title: "Severity",
sortType: "alpha"
}, {
id: "reason",
title: "Reason",
sortType: "alpha"
}, {
id: "message",
title: "Message",
sortType: "alpha"
}, {
id: "count",
title: "Count",
sortType: "numeric"
} ],
isAscending: !0,
onSortChange: h
}, t && e.sortConfig.fields.splice(1, 0, {
id: "involvedObject.name",
title: "Name",
sortType: "alpha"
}, {
id: "involvedObject.kind",
title: "Kind",
sortType: "alpha"
});
}), i.push(n.watch("events", e.projectContext, function(n) {
t = n.by("metadata.name"), v(), o.log("events (subscribe)", e.filteredEvents);
}, {
skipDigest: !0
})), e.$on("$destroy", function() {
n.unwatchAll(i);
});
} ]
};
} ]), angular.module("openshiftConsole").directive("eventsSidebar", [ "DataService", "Logger", "$rootScope", function(e, t, n) {
return {
restrict: "E",
scope: {
projectContext: "=",
collapsed: "="
},
templateUrl: "views/directives/events-sidebar.html",
controller: [ "$scope", function(a) {
var r = [];
r.push(e.watch("events", a.projectContext, function(e) {
var n = e.by("metadata.name");
a.events = _.orderBy(n, [ "lastTimestamp" ], [ "desc" ]), a.warningCount = _.size(_.filter(n, {
type: "Warning"
})), t.log("events (subscribe)", a.events);
})), a.highlightedEvents = {}, a.collapseSidebar = function() {
a.collapsed = !0;
};
var o = [];
o.push(n.$on("event.resource.highlight", function(e, t) {
var n = _.get(t, "kind"), r = _.get(t, "metadata.name");
n && r && _.each(a.events, function(e) {
e.involvedObject.kind === n && e.involvedObject.name === r && (a.highlightedEvents[n + "/" + r] = !0);
});
})), o.push(n.$on("event.resource.clear-highlight", function(e, t) {
var n = _.get(t, "kind"), r = _.get(t, "metadata.name");
n && r && _.each(a.events, function(e) {
e.involvedObject.kind === n && e.involvedObject.name === r && (a.highlightedEvents[n + "/" + r] = !1);
});
})), a.$on("$destroy", function() {
e.unwatchAll(r), _.each(o, function(e) {
e();
}), o = null;
});
} ]
};
} ]), angular.module("openshiftConsole").directive("eventsBadge", [ "$filter", "DataService", "Logger", function(e, t, n) {
return {
restrict: "E",
scope: {
projectContext: "=",
sidebarCollapsed: "="
},
templateUrl: "views/directives/events-badge.html",
controller: [ "$scope", function(a) {
var r = [], o = e("orderObjectsByDate");
r.push(t.watch("events", a.projectContext, function(e) {
var t = e.by("metadata.name");
a.events = o(t, !0), a.warningCount = _.size(_.filter(t, {
type: "Warning"
})), a.normalCount = _.size(_.filter(t, {
type: "Normal"
})), n.log("events (subscribe)", a.events);
})), a.expandSidebar = function() {
a.sidebarCollapsed = !1;
}, a.$on("$destroy", function() {
t.unwatchAll(r);
});
} ]
};
} ]), angular.module("openshiftConsole").directive("fromFile", [ "$filter", "$location", "$q", "$uibModal", "APIService", "CachedTemplateService", "DataService", "Navigate", "NotificationsService", "QuotaService", "SecurityCheckService", "TaskList", "ProjectsService", function(e, t, n, a, r, o, i, s, c, l, u, d, p) {
return {
restrict: "E",
scope: {
project: "=",
isDialog: "="
},
templateUrl: "views/directives/from-file.html",
controller: [ "$scope", function(m) {
function f(e) {
return !!e.kind || (m.error = {
message: "Resource is missing kind field."
}, !1);
}
function g(e) {
return !!m.isList || (e.metadata ? e.metadata.name ? !e.metadata.namespace || e.metadata.namespace === m.input.selectedProject.metadata.name || (m.error = {
message: e.kind + " " + e.metadata.name + " can't be created in project " + e.metadata.namespace + ". Can't create resource in different projects."
}, !1) : (m.error = {
message: "Resource name is missing in metadata field."
}, !1) : (m.error = {
message: "Resource is missing metadata field."
}, !1));
}
function h() {
a.open({
animation: !0,
templateUrl: "views/modals/process-or-save-template.html",
controller: "ProcessOrSaveTemplateModalController",
scope: m
}).result.then(function() {
m.templateOptions.add ? y() : (o.setTemplate(m.resourceList[0]), b());
});
}
function v() {
a.open({
animation: !0,
templateUrl: "views/modals/confirm-replace.html",
controller: "ConfirmReplaceModalController",
scope: m
}).result.then(function() {
l.getLatestQuotaAlerts(m.createResources, {
namespace: m.input.selectedProject.metadata.name
}).then(E);
});
}
function y() {
var e = m.createResources.length, t = m.updateResources.length;
if (m.resourceKind.endsWith("List")) {
var a = [];
t > 0 && a.push(k()), e > 0 && a.push(w()), n.all(a).then(b);
} else S();
}
function b() {
var e, n;
N(), "Template" === m.resourceKind && m.templateOptions.process && !m.errorOccurred ? m.isDialog ? m.$emit("fileImportedFromYAMLOrJSON", {
project: m.input.selectedProject,
template: m.resource
}) : (n = m.templateOptions.add || m.updateResources.length > 0 ? m.input.selectedProject.metadata.name : "", e = s.createFromTemplateURL(m.resource, m.input.selectedProject.metadata.name, {
namespace: n
}), t.url(e)) : m.isDialog ? m.$emit("fileImportedFromYAMLOrJSON", {
project: m.input.selectedProject
}) : (e = s.projectOverviewURL(m.input.selectedProject.metadata.name), t.url(e));
}
function C(e) {
var t = r.objectToResourceGroupVersion(e);
return t ? r.apiInfo(t) ? i.get(t, e.metadata.name, {
namespace: m.input.selectedProject.metadata.name
}, {
errorNotification: !1
}).then(function(t) {
var n = angular.copy(e), a = angular.copy(t.metadata);
a.annotations = e.metadata.annotations, a.labels = e.metadata.labels, n.metadata = a, m.updateResources.push(n);
}, function() {
m.createResources.push(e);
}) : (m.errorOccurred = !0, void (m.error = {
message: r.unsupportedObjectKindOrVersion(e)
})) : (m.errorOccurred = !0, void (m.error = {
message: r.invalidObjectKindOrVersion(e)
}));
}
function S() {
var t;
_.isEmpty(m.createResources) ? (t = _.head(m.updateResources), i.update(r.kindToResource(t.kind), t.metadata.name, t, {
namespace: m.input.selectedProject.metadata.name
}).then(function() {
var e = P(t.kind);
c.addNotification({
type: "success",
message: _.capitalize(e) + " " + t.metadata.name + " was successfully updated."
}), b();
}, function(n) {
c.addNotification({
id: "from-file-error",
type: "error",
message: "Unable to update the " + P(t.kind) + " '" + t.metadata.name + "'.",
details: e("getErrorDetails")(n)
});
})) : (t = _.head(m.createResources), i.create(r.kindToResource(t.kind), null, t, {
namespace: m.input.selectedProject.metadata.name
}).then(function() {
var e = P(t.kind);
c.addNotification({
type: "success",
message: _.capitalize(e) + " " + t.metadata.name + " was successfully created."
}), b();
}, function(n) {
c.addNotification({
id: "from-file-error",
type: "error",
message: "Unable to create the " + P(t.kind) + " '" + t.metadata.name + "'.",
details: e("getErrorDetails")(n)
});
}));
}
function w() {
var e = {
started: "Creating resources in project " + A(m.input.selectedProject),
success: "Creating resources in project " + A(m.input.selectedProject),
failure: "Failed to create some resources in project " + A(m.input.selectedProject)
}, t = {};
d.add(e, t, m.input.selectedProject.metadata.name, function() {
var e = n.defer();
return i.batch(m.createResources, {
namespace: m.input.selectedProject.metadata.name
}, "create").then(function(t) {
var n = [], a = !1;
if (t.failure.length > 0) a = !0, m.errorOccurred = !0, t.failure.forEach(function(e) {
n.push({
type: "error",
message: "Cannot create " + P(e.object.kind) + ' "' + e.object.metadata.name + '". ',
details: e.data.message
});
}), t.success.forEach(function(e) {
n.push({
type: "success",
message: "Created " + P(e.kind) + ' "' + e.metadata.name + '" successfully. '
});
}); else {
var r;
r = m.isList ? "All items in list were created successfully." : P(m.resourceKind) + " " + m.resourceName + " was successfully created.", n.push({
type: "success",
message: r
});
}
e.resolve({
alerts: n,
hasErrors: a
});
}), e.promise;
});
}
function k() {
var e = {
started: "Updating resources in project " + A(m.input.selectedProject),
success: "Updated resources in project " + A(m.input.selectedProject),
failure: "Failed to update some resources in project " + A(m.input.selectedProject)
}, t = {};
d.add(e, t, m.input.selectedProject.metadata.name, function() {
var e = n.defer();
return i.batch(m.updateResources, {
namespace: m.input.selectedProject.metadata.name
}, "update").then(function(t) {
var n = [], a = !1;
if (t.failure.length > 0) a = !0, m.errorOccurred = !0, t.failure.forEach(function(e) {
n.push({
type: "error",
message: "Cannot update " + P(e.object.kind) + ' "' + e.object.metadata.name + '". ',
details: e.data.message
});
}), t.success.forEach(function(e) {
n.push({
type: "success",
message: "Updated " + P(e.kind) + ' "' + e.metadata.name + '" successfully. '
});
}); else {
var r;
r = m.isList ? "All items in list were updated successfully." : P(m.resourceKind) + " " + m.resourceName + " was successfully updated.", n.push({
type: "success",
message: r
});
}
e.resolve({
alerts: n,
hasErrors: a
});
}, function(t) {
var n = [];
n.push({
type: "error",
message: "An error occurred updating the resources.",
details: "Status: " + t.status + ". " + t.data
}), e.resolve({
alerts: n
});
}), e.promise;
});
}
var j, P = e("humanizeKind"), R = e("getErrorDetails");
d.clear(), m.input = {
selectedProject: m.project
}, m.aceLoaded = function(e) {
(j = e.getSession()).setOption("tabSize", 2), j.setOption("useSoftTabs", !0), e.setDragDelay = 0, e.$blockScrolling = 1 / 0;
};
var I = function(e) {
a.open({
animation: !0,
templateUrl: "views/modals/confirm.html",
controller: "ConfirmModalController",
resolve: {
modalConfig: function() {
return {
alerts: e,
message: "We checked your application for potential problems. Please confirm you still want to create this application.",
okButtonText: "Create Anyway",
okButtonClass: "btn-danger",
cancelButtonText: "Cancel"
};
}
}
}).result.then(y);
}, T = {}, N = function() {
c.hideNotification("from-file-error"), _.each(T, function(e) {
!e.id || "error" !== e.type && "warning" !== e.type || c.hideNotification(e.id);
});
}, E = function(e) {
N(), T = u.getSecurityAlerts(m.createResources, m.input.selectedProject.metadata.name);
var t = e.quotaAlerts || [];
T = T.concat(t), _.filter(T, {
type: "error"
}).length ? (_.each(T, function(e) {
e.id = _.uniqueId("from-file-alert-"), c.addNotification(e);
}), m.disableInputs = !1) : T.length ? (I(T), m.disableInputs = !1) : y();
}, D = function() {
if (_.has(m.input.selectedProject, "metadata.uid")) return n.when(m.input.selectedProject);
var t = m.input.selectedProject.metadata.name, a = m.input.selectedProject.metadata.annotations["new-display-name"], r = e("description")(m.input.selectedProject);
return p.create(t, a, r);
};
m.create = function() {
if (delete m.error, f(m.resource) && (m.resourceKind = m.resource.kind, m.resourceKind.endsWith("List") ? m.isList = !0 : m.isList = !1, g(m.resource))) {
m.isList ? (m.resourceList = m.resource.items, m.resourceName = "") : (m.resourceList = [ m.resource ], m.resourceName = m.resource.metadata.name, "Template" === m.resourceKind && (m.templateOptions = {
process: !0,
add: !1
})), m.updateResources = [], m.createResources = [];
var e = [];
m.errorOccurred = !1, _.forEach(m.resourceList, function(t) {
if (!g(t)) return m.errorOccurred = !0, !1;
e.push(C(t));
}), D().then(function(t) {
m.input.selectedProject = t, n.all(e).then(function() {
m.errorOccurred || (1 === m.createResources.length && "Template" === m.resourceList[0].kind ? h() : _.isEmpty(m.updateResources) ? l.getLatestQuotaAlerts(m.createResources, {
namespace: m.input.selectedProject.metadata.name
}).then(E) : (m.updateTemplate = 1 === m.updateResources.length && "Template" === m.updateResources[0].kind, m.updateTemplate ? h() : v()));
});
}, function(e) {
c.addNotification({
id: "import-create-project-error",
type: "error",
message: "An error occurred creating project",
details: R(e)
});
});
}
}, m.cancel = function() {
N(), s.toProjectOverview(m.input.selectedProject.metadata.name);
};
var A = e("displayName");
m.$on("importFileFromYAMLOrJSON", m.create), m.$on("$destroy", N);
} ]
};
} ]), angular.module("openshiftConsole").directive("oscFileInput", [ "Logger", function(e) {
return {
restrict: "E",
scope: {
model: "=",
required: "=",
disabled: "=ngDisabled",
readonly: "=ngReadonly",
showTextArea: "=",
hideClear: "=?",
helpText: "@?",
dropZoneId: "@?"
},
templateUrl: "views/directives/osc-file-input.html",
link: function(t, n) {
function a(n) {
var a = new FileReader();
a.onloadend = function() {
t.$apply(function() {
t.fileName = n.name, t.model = a.result;
});
}, a.onerror = function(n) {
t.supportsFileUpload = !1, t.uploadError = !0, e.error("Could not read file", n);
}, a.readAsText(n);
}
function r() {
n.find(".drag-and-drop-zone").removeClass("show-drag-and-drop-zone highlight-drag-and-drop-zone");
}
var o = _.uniqueId("osc-file-input-");
t.dropMessageID = o + "-drop-message", t.helpID = o + "-help", t.supportsFileUpload = window.File && window.FileReader && window.FileList && window.Blob, t.uploadError = !1;
var i = "#" + t.dropMessageID, s = !1, c = !1, l = n.find("input[type=file]");
setTimeout(function() {
var e = n.find(".drag-and-drop-zone");
e.on("dragover", function() {
t.disabled || (e.addClass("highlight-drag-and-drop-zone"), s = !0);
}), n.find(".drag-and-drop-zone p").on("dragover", function() {
t.disabled || (s = !0);
}), e.on("dragleave", function() {
t.disabled || (s = !1, _.delay(function() {
s || e.removeClass("highlight-drag-and-drop-zone");
}, 200));
}), e.on("drop", function(e) {
if (!t.disabled) {
var n = _.get(e, "originalEvent.dataTransfer.files", []);
return n.length > 0 && (t.file = _.head(n), a(t.file)), r(), $(".drag-and-drop-zone").trigger("putDropZoneFront", !1), $(".drag-and-drop-zone").trigger("reset"), !1;
}
});
var o = function(e, t) {
var n = t.offset(), a = t.outerWidth(), r = t.outerHeight();
e.css({
height: r + 6,
width: a + 6,
top: n.top,
left: n.left,
position: "fixed",
"z-index": 100
});
};
e.on("putDropZoneFront", function(e, a) {
if (!t.disabled) {
var r, i = n.find(".drag-and-drop-zone");
return a ? (r = t.dropZoneId ? $("#" + t.dropZoneId) : n, o(i, r)) : i.css("z-index", "-1"), !1;
}
}), e.on("reset", function() {
if (!t.disabled) return c = !1, !1;
});
}), $(document).on("drop." + o, function() {
return r(), n.find(".drag-and-drop-zone").trigger("putDropZoneFront", !1), !1;
}), $(document).on("dragenter." + o, function() {
if (!t.disabled) return c = !0, n.find(".drag-and-drop-zone").addClass("show-drag-and-drop-zone"), n.find(".drag-and-drop-zone").trigger("putDropZoneFront", !0), !1;
}), $(document).on("dragover." + o, function() {
if (!t.disabled) return c = !0, n.find(".drag-and-drop-zone").addClass("show-drag-and-drop-zone"), !1;
}), $(document).on("dragleave." + o, function() {
return c = !1, _.delay(function() {
c || n.find(".drag-and-drop-zone").removeClass("show-drag-and-drop-zone");
}, 200), !1;
}), t.cleanInputValues = function() {
t.model = "", t.fileName = "", l[0].value = "";
}, l.change(function() {
a(l[0].files[0]);
}), t.$on("$destroy", function() {
$(i).off(), $(document).off("drop." + o).off("dragenter." + o).off("dragover." + o).off("dragleave." + o);
});
}
};
} ]), angular.module("openshiftConsole").directive("oscFormSection", function() {
return {
restrict: "E",
transclude: !0,
scope: {
header: "@",
about: "@",
aboutTitle: "@",
editText: "@",
expand: "=?",
canToggle: "=?"
},
templateUrl: "views/directives/osc-form-section.html",
link: function(e, t, n) {
n.editText || (n.editText = "Edit"), angular.isDefined(n.canToggle) || (e.canToggle = !0), e.toggle = function() {
e.expand = !e.expand;
};
}
};
}), angular.module("openshiftConsole").directive("oscGitLink", [ "$filter", function(e) {
return {
restrict: "E",
scope: {
uri: "=",
ref: "=",
contextDir: "="
},
transclude: !0,
link: function(t) {
var n = e("isAbsoluteURL"), a = e("githubLink");
t.$watchGroup([ "uri", "ref", "contextDir" ], function() {
t.gitLink = a(t.uri, t.ref, t.contextDir), t.isLink = n(t.gitLink);
});
},
template: '<a ng-if="isLink" ng-href="{{gitLink}}" ng-transclude target="_blank"></a><span ng-if="!isLink" ng-transclude></span>'
};
} ]), angular.module("openshiftConsole").directive("oscImageSummary", function() {
return {
restrict: "E",
scope: {
resource: "=",
name: "=",
tag: "="
},
templateUrl: "views/directives/osc-image-summary.html"
};
}), angular.module("openshiftConsole").directive("oscRouting", [ "$filter", "Constants", "DNS1123_SUBDOMAIN_VALIDATION", function(e, t, n) {
return {
require: "^form",
restrict: "E",
scope: {
route: "=model",
services: "=",
showNameInput: "=",
routingDisabled: "=",
existingRoute: "="
},
templateUrl: "views/directives/osc-routing.html",
link: function(a, r, o, i) {
a.form = i, a.controls = {}, a.options = {
secureRoute: !1,
alternateServices: !1
};
var s = {
group: "route.openshift.io",
resource: "routes/custom-host"
};
a.canICreateCustomHosts = e("canI")(s, "create"), a.canIUpdateCustomHosts = e("canI")(s, "update");
var c = function() {
return a.existingRoute ? a.canIUpdateCustomHosts : a.canICreateCustomHosts;
};
a.isHostnameReadOnly = function() {
return !c();
}, a.disableWildcards = t.DISABLE_WILDCARD_ROUTES, a.areCertificateInputsReadOnly = function() {
return !c();
}, a.areCertificateInputsDisabled = function() {
var e = _.get(a, "route.tls.termination");
return !e || "passthrough" === e;
}, a.isDestinationCACertInputDisabled = function() {
return "reencrypt" !== _.get(a, "route.tls.termination");
}, a.insecureTrafficOptions = [ {
value: "",
label: "None"
}, {
value: "Allow",
label: "Allow"
}, {
value: "Redirect",
label: "Redirect"
} ], _.has(a, "route.tls.insecureEdgeTerminationPolicy") || _.set(a, "route.tls.insecureEdgeTerminationPolicy", "");
a.$watchGroup([ "route.tls.termination", "route.tls.insecureEdgeTerminationPolicy" ], function() {
var e = "passthrough" !== _.get(a, "route.tls.termination") || "Allow" !== _.get(a, "route.tls.insecureEdgeTerminationPolicy");
a.routeForm.insecureTraffic.$setValidity("passthrough", e);
}), a.nameValidation = n, a.disableWildcards ? a.hostnamePattern = n.pattern : a.hostnamePattern = /^(\*(\.[a-z0-9]([-a-z0-9]*[a-z0-9]))+|[a-z0-9]([-a-z0-9]*[a-z0-9])?(\.[a-z0-9]([-a-z0-9]*[a-z0-9])?)*)$/, a.hostnameMaxLength = n.maxlength;
var l = function(e) {
if (e) {
var t = _.get(e, "spec.ports", []);
a.unnamedServicePort = 1 === t.length && !t[0].name, t.length && !a.unnamedServicePort ? a.route.portOptions = _.map(t, function(e) {
return {
port: e.name,
label: e.port + " → " + e.targetPort + " (" + e.protocol + ")"
};
}) : a.route.portOptions = [];
}
};
a.services && !a.route.service && (a.route.service = _.find(a.services)), a.servicesByName, a.services ? a.servicesByName = _.keyBy(a.services, "metadata.name") : a.servicesByName = {}, a.$watch("route.to.name", function(e, t) {
l(a.servicesByName[e]), e === t && a.route.targetPort || (a.route.targetPort = _.get(a, "route.portOptions[0].port")), a.services && (a.alternateServiceOptions = _.reject(a.services, function(t) {
return e === t.metadata.name;
}));
}), a.$watch("route.alternateServices", function(e) {
a.duplicateServices = _(e).map("name").filter(function(e, t, n) {
return _.includes(n, e, t + 1);
}).value(), i.$setValidity("duplicateServices", !a.duplicateServices.length), a.options.alternateServices = !_.isEmpty(e);
}, !0);
var u = function() {
return !!a.route.tls && ((!a.route.tls.termination || "passthrough" === a.route.tls.termination) && (a.route.tls.certificate || a.route.tls.key || a.route.tls.caCertificate || a.route.tls.destinationCACertificate));
};
a.$watch("route.tls.termination", function() {
a.options.secureRoute = !!_.get(a, "route.tls.termination"), a.showCertificatesNotUsedWarning = u();
});
var d;
a.$watch("options.secureRoute", function(e, t) {
if (e !== t) {
var n = _.get(a, "route.tls.termination");
!a.securetRoute && n && (d = n, delete a.route.tls.termination), a.options.secureRoute && !n && _.set(a, "route.tls.termination", d || "edge");
}
}), a.$watch("options.alternateServices", function(e, t) {
e !== t && (e || (a.route.alternateServices = []), e && _.isEmpty(a.route.alternateServices) && a.addAlternateService());
}), a.addAlternateService = function() {
a.route.alternateServices = a.route.alternateServices || [];
var e = _.find(a.services, function(e) {
return e.metadata.name !== a.route.to.service && !_.some(a.route.alternateServices, {
service: e.metadata.name
});
});
_.has(a, "route.to.weight") || _.set(a, "route.to.weight", 1), a.route.alternateServices.push({
service: e.metadata.name,
weight: 1
});
}, a.weightAsPercentage = function(e, t) {
e = e || 0;
var n = _.get(a, "route.to.weight", 0);
if (_.each(a.route.alternateServices, function(e) {
n += _.get(e, "weight", 0);
}), !n) return "";
var r = e / n * 100;
return t ? d3.round(r, 1) + "%" : r;
};
var p = !1;
a.$watch("route.alternateServices.length", function(e) {
if (0 === e && _.has(a, "route.to.weight") && delete a.route.to.weight, 1 === e) {
if (0 === a.route.to.weight && 0 === a.route.alternateServices[0].weight) return void (a.controls.hideSlider = !0);
p = !0, a.controls.rangeSlider = a.weightAsPercentage(a.route.to.weight);
}
}), a.$watch("controls.rangeSlider", function(e, t) {
p ? p = !1 : e !== t && (e = parseInt(e, 10), _.set(a, "route.to.weight", e), _.set(a, "route.alternateServices[0].weight", 100 - e));
});
}
};
} ]).directive("oscRoutingService", function() {
return {
restrict: "E",
scope: {
model: "=",
serviceOptions: "=",
allServices: "=",
isAlternate: "=?",
showWeight: "=?",
warnUnnamedPort: "=?"
},
templateUrl: "views/directives/osc-routing-service.html",
link: function(e, t, n, a) {
e.form = a, e.id = _.uniqueId("osc-routing-service-"), e.$watchGroup([ "model.name", "serviceOptions" ], function() {
if (_.isEmpty(e.serviceOptions)) e.optionsNames = []; else {
var t = _.get(e, "model.name");
e.optionNames = [], e.selectedExists = !1, e.optionNames = _.map(e.serviceOptions, "metadata.name"), t && !e.allServices[t] && e.optionNames.push(t), t || _.set(e, "model.name", _.head(e.optionNames));
}
});
}
};
}), angular.module("openshiftConsole").directive("oscPersistentVolumeClaim", [ "$filter", "DataService", "LimitRangesService", "QuotaService", "ModalsService", "DNS1123_SUBDOMAIN_VALIDATION", function(e, t, n, a, r, o) {
return {
restrict: "E",
scope: {
claim: "=model",
projectName: "="
},
templateUrl: "views/directives/osc-persistent-volume-claim.html",
link: function(i) {
var s = e("amountAndUnit"), c = e("usageValue");
i.nameValidation = o, i.storageClasses = [], i.defaultStorageClass = "", i.claim.unit = "Gi", i.units = [ {
value: "Mi",
label: "MiB"
}, {
value: "Gi",
label: "GiB"
}, {
value: "Ti",
label: "TiB"
}, {
value: "M",
label: "MB"
}, {
value: "G",
label: "GB"
}, {
value: "T",
label: "TB"
} ], i.claim.selectedLabels = [], i.groupUnits = function(e) {
switch (e.value) {
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
}, i.showComputeUnitsHelp = function() {
r.showComputeUnitsHelp();
};
var l = function() {
var e = i.claim.amount && c(i.claim.amount + i.claim.unit), t = _.has(i, "limits.min") && c(i.limits.min), n = _.has(i, "limits.max") && c(i.limits.max), a = !0, r = !0;
e && t && (a = e >= t), e && n && (r = e <= n), i.persistentVolumeClaimForm.capacity.$setValidity("limitRangeMin", a), i.persistentVolumeClaimForm.capacity.$setValidity("limitRangeMax", r);
}, u = function() {
var e = a.isAnyStorageQuotaExceeded(i.quotas, i.clusterQuotas), t = a.willRequestExceedQuota(i.quotas, i.clusterQuotas, "requests.storage", i.claim.amount + i.claim.unit);
i.persistentVolumeClaimForm.capacity.$setValidity("willExceedStorage", !t), i.persistentVolumeClaimForm.capacity.$setValidity("outOfClaims", !e);
};
t.list({
group: "storage.k8s.io",
resource: "storageclasses"
}, {}, function(t) {
var n = t.by("metadata.name");
if (!_.isEmpty(n)) {
i.storageClasses = _.sortBy(n, "metadata.name");
var a = e("annotation");
if (i.defaultStorageClass = _.find(i.storageClasses, function(e) {
return "true" === a(e, "storageclass.beta.kubernetes.io/is-default-class");
}), i.defaultStorageClass) i.claim.storageClass = i.defaultStorageClass; else {
var r = {
metadata: {
name: "No Storage Class",
labels: {},
annotations: {
description: "No storage class will be assigned"
}
}
};
i.storageClasses.unshift(r);
}
}
}, {
errorNotification: !1
}), t.list("limitranges", {
namespace: i.projectName
}, function(e) {
var t = e.by("metadata.name");
if (!_.isEmpty(t)) {
i.limits = n.getEffectiveLimitRange(t, "storage", "PersistentVolumeClaim");
var a;
i.limits.min && i.limits.max && c(i.limits.min) === c(i.limits.max) && (a = s(i.limits.max), i.claim.amount = Number(a[0]), i.claim.unit = a[1], i.capacityReadOnly = !0), i.$watchGroup([ "claim.amount", "claim.unit" ], l);
}
}), t.list("resourcequotas", {
namespace: i.projectName
}, function(e) {
i.quotas = e.by("metadata.name"), i.$watchGroup([ "claim.amount", "claim.unit" ], u);
}), t.list("appliedclusterresourcequotas", {
namespace: i.projectName
}, function(e) {
i.clusterQuotas = e.by("metadata.name");
});
}
};
} ]), angular.module("openshiftConsole").directive("oscAutoscaling", [ "HPAService", "LimitRangesService", "DNS1123_SUBDOMAIN_VALIDATION", function(e, t, n) {
return {
restrict: "E",
scope: {
autoscaling: "=model",
project: "=",
showNameInput: "=?",
nameReadOnly: "=?"
},
templateUrl: "views/directives/osc-autoscaling.html",
link: function(a) {
a.nameValidation = n, a.$watch("project", function() {
if (a.project) {
a.isRequestCalculated = t.isRequestCalculated("cpu", a.project);
var n = window.OPENSHIFT_CONSTANTS.DEFAULT_HPA_CPU_TARGET_PERCENT;
a.isRequestCalculated && (n = e.convertLimitPercentToRequest(n, a.project)), _.set(a, "autoscaling.defaultTargetCPU", n), a.defaultTargetCPUDisplayValue = window.OPENSHIFT_CONSTANTS.DEFAULT_HPA_CPU_TARGET_PERCENT;
var r = !1;
a.$watch("autoscaling.targetCPU", function(t) {
r ? r = !1 : (t && a.isRequestCalculated && (t = e.convertRequestPercentToLimit(t, a.project)), _.set(a, "targetCPUInput.percent", t));
});
var o = function(t) {
t && a.isRequestCalculated && (t = e.convertLimitPercentToRequest(t, a.project)), r = !0, _.set(a, "autoscaling.targetCPU", t);
};
a.$watch("targetCPUInput.percent", function(e, t) {
e !== t && o(e);
});
}
});
}
};
} ]), angular.module("openshiftConsole").directive("oscSecrets", [ "$uibModal", "$filter", "DataService", "SecretsService", function(e, t, n, a) {
return {
restrict: "E",
scope: {
pickedSecrets: "=model",
secretsByType: "=",
namespace: "=",
displayType: "@",
type: "@",
alerts: "=",
disableInput: "=",
serviceAccountToLink: "@?",
allowMultipleSecrets: "=?"
},
templateUrl: "views/directives/osc-secrets.html",
link: function(t) {
t.canAddSourceSecret = function() {
if (!t.allowMultipleSecrets) return !1;
var e = _.last(t.pickedSecrets);
return !!e && e.name;
}, t.setLastSecretsName = function(e) {
_.last(t.pickedSecrets).name = e;
}, t.addSourceSecret = function() {
t.pickedSecrets.push({
name: ""
});
}, t.removeSecret = function(e) {
1 === t.pickedSecrets.length ? t.pickedSecrets = [ {
name: ""
} ] : t.pickedSecrets.splice(e, 1), t.secretsForm.$setDirty();
}, t.openCreateSecretModal = function() {
t.newSecret = {}, e.open({
animation: !0,
backdrop: "static",
templateUrl: "views/modals/create-secret.html",
controller: "CreateSecretModalController",
scope: t
}).result.then(function(e) {
n.list("secrets", {
namespace: t.namespace
}, function(n) {
var r = a.groupSecretsByType(n), o = _.mapValues(r, function(e) {
return _.map(e, "metadata.name");
});
t.secretsByType = _.each(o, function(e) {
e.unshift("");
}), t.setLastSecretsName(e.metadata.name), t.secretsForm.$setDirty();
});
});
};
}
};
} ]), angular.module("openshiftConsole").directive("oscSourceSecrets", [ "$uibModal", "$filter", "DataService", "SecretsService", function(e, t, n, a) {
return {
restrict: "E",
scope: {
pickedSecrets: "=model",
secretsByType: "=",
strategyType: "=",
type: "@",
displayType: "@",
namespace: "=",
alerts: "=",
serviceAccountToLink: "@?"
},
templateUrl: "views/directives/osc-source-secrets.html",
link: function(t) {
t.canAddSourceSecret = function() {
var e = _.last(t.pickedSecrets);
switch (t.strategyType) {
case "Custom":
return _.get(e, "secretSource.name");

default:
return _.get(e, "secret.name");
}
}, t.setLastSecretsName = function(e) {
var n = _.last(t.pickedSecrets);
switch (t.strategyType) {
case "Custom":
return void (n.secretSource.name = e);

default:
return void (n.secret.name = e);
}
}, t.addSourceSecret = function() {
switch (t.strategyType) {
case "Custom":
return void t.pickedSecrets.push({
secretSource: {
name: ""
},
mountPath: ""
});

default:
return void t.pickedSecrets.push({
secret: {
name: ""
},
destinationDir: ""
});
}
}, t.removeSecret = function(e) {
if (1 === t.pickedSecrets.length) switch (t.strategyType) {
case "Custom":
t.pickedSecrets = [ {
secretSource: {
name: ""
},
mountPath: ""
} ];
break;

default:
t.pickedSecrets = [ {
secret: {
name: ""
},
destinationDir: ""
} ];
} else t.pickedSecrets.splice(e, 1);
t.secretsForm.$setDirty();
}, t.openCreateSecretModal = function() {
e.open({
animation: !0,
templateUrl: "views/modals/create-secret.html",
controller: "CreateSecretModalController",
scope: t
}).result.then(function(e) {
n.list("secrets", {
namespace: t.namespace
}, function(n) {
var r = a.groupSecretsByType(n), o = _.mapValues(r, function(e) {
return _.map(e, "metadata.name");
});
t.secretsByType = _.each(o, function(e) {
e.unshift("");
}), t.setLastSecretsName(e.metadata.name);
});
});
};
}
};
} ]), angular.module("openshiftConsole").directive("replicas", function() {
return {
restrict: "E",
scope: {
status: "=?",
spec: "=",
disableScaling: "=?",
scaleFn: "&?",
deployment: "="
},
templateUrl: "views/directives/replicas.html",
link: function(e) {
e.model = {
editing: !1
}, e.scale = function() {
e.form.scaling.$valid && (e.scaleFn({
replicas: e.model.desired
}), e.model.editing = !1);
}, e.cancel = function() {
e.model.editing = !1;
};
}
};
}), angular.module("openshiftConsole").directive("containerStatuses", [ "$filter", function(e) {
return {
restrict: "E",
scope: {
pod: "=",
onDebugTerminal: "=?",
detailed: "=?"
},
templateUrl: "views/_container-statuses.html",
link: function(t) {
t.hasDebugTerminal = angular.isFunction(t.onDebugTerminal);
var n = e("isContainerTerminatedSuccessfully"), a = function(e) {
return _.every(e, n);
};
t.$watch("pod", function(e) {
t.initContainersTerminated = a(e.status.initContainerStatuses), !1 !== t.expandInitContainers && (t.expandInitContainers = !t.initContainersTerminated);
}), t.toggleInitContainer = function() {
t.expandInitContainers = !t.expandInitContainers;
}, t.showDebugAction = function(n) {
if ("Completed" === _.get(t.pod, "status.phase")) return !1;
if (e("annotation")(t.pod, "openshift.io/build.name")) return !1;
if (e("isDebugPod")(t.pod)) return !1;
var a = _.get(n, "state.waiting.reason");
return "ImagePullBackOff" !== a && "ErrImagePull" !== a && (!_.get(n, "state.running") || !n.ready);
}, t.debugTerminal = function(e) {
if (t.hasDebugTerminal) return t.onDebugTerminal.call(this, e);
};
}
};
} ]).directive("podTemplate", function() {
return {
restrict: "E",
scope: {
podTemplate: "=",
imagesByDockerReference: "=",
builds: "=",
detailed: "=?",
addHealthCheckUrl: "@?"
},
templateUrl: "views/_pod-template.html"
};
}).directive("podTemplateContainer", function() {
return {
restrict: "E",
scope: {
container: "=podTemplateContainer",
imagesByDockerReference: "=",
builds: "=",
detailed: "=?",
labelPrefix: "@?"
},
templateUrl: "views/_pod-template-container.html"
};
}).directive("annotations", function() {
return {
restrict: "E",
scope: {
annotations: "="
},
templateUrl: "views/directives/annotations.html",
link: function(e) {
e.expandAnnotations = !1, e.toggleAnnotations = function() {
e.expandAnnotations = !e.expandAnnotations;
};
}
};
}).directive("registryAnnotations", function() {
return {
restrict: "E",
priority: 1,
terminal: !0,
scope: {
annotations: "="
},
templateUrl: "views/directives/annotations.html",
link: function(e) {
e.expandAnnotations = !1, e.toggleAnnotations = function() {
e.expandAnnotations = !e.expandAnnotations;
};
}
};
}).directive("volumes", function() {
return {
restrict: "E",
scope: {
volumes: "=",
namespace: "=",
canRemove: "=?",
removeFn: "&?"
},
templateUrl: "views/_volumes.html"
};
}).directive("volumeClaimTemplates", function() {
return {
restrict: "E",
scope: {
templates: "="
},
templateUrl: "views/_volume-claim-templates.html"
};
}).directive("hpa", function() {
return {
restrict: "E",
scope: {
hpa: "=",
project: "=",
showScaleTarget: "=?",
alerts: "="
},
templateUrl: "views/directives/hpa.html"
};
}).directive("probe", function() {
return {
restrict: "E",
scope: {
probe: "="
},
templateUrl: "views/directives/_probe.html"
};
}).directive("podsTable", [ "$filter", function(e) {
return {
restrict: "E",
scope: {
pods: "=",
activePods: "=?",
emptyMessage: "=?",
customNameHeader: "=?",
podFailureReasons: "=?"
},
templateUrl: "views/directives/pods-table.html",
link: function(t) {
var n = e("orderObjectsByDate"), a = _.debounce(function(e) {
t.$evalAsync(function() {
t.sortedPods = n(e, !0);
});
}, 150, {
maxWait: 500
});
t.$watch("pods", a);
}
};
} ]).directive("trafficTable", function() {
return {
restrict: "E",
scope: {
routes: "=",
services: "=",
portsByRoute: "=",
showNodePorts: "=?",
customNameHeader: "=?"
},
templateUrl: "views/directives/traffic-table.html"
};
}), angular.module("openshiftConsole").component("resourceServiceBindings", {
controller: [ "$filter", "DataService", "BindingService", "CatalogService", ResourceServiceBindings ],
controllerAs: "$ctrl",
bindings: {
project: "<",
projectContext: "<",
apiObject: "<",
createBinding: "&"
},
templateUrl: "views/directives/resource-service-bindings.html"
}), angular.module("openshiftConsole").directive("sidebar", [ "$location", "$filter", "$timeout", "$rootScope", "$routeParams", "AuthorizationService", "Constants", "HTMLService", function(e, t, n, a, r, o, i, s) {
var c = function(e, t) {
return e.href === t || _.some(e.prefixes, function(e) {
return _.startsWith(t, e);
});
};
return {
restrict: "E",
templateUrl: "views/_sidebar.html",
controller: [ "$scope", function(l) {
var u;
l.navItems = i.PROJECT_NAVIGATION, l.sidebar = {};
var d = function() {
l.projectName = r.project, _.set(l, "sidebar.secondaryOpen", !1), _.set(a, "nav.showMobileNav", !1), l.activeSecondary = null, l.activePrimary = _.find(l.navItems, function(t) {
return u = e.path().replace("/project/" + l.projectName, ""), c(t, u) ? (l.activeSecondary = null, !0) : _.some(t.secondaryNavSections, function(e) {
var t = _.find(e.items, function(e) {
return c(e, u);
});
return !!t && (l.activeSecondary = t, !0);
});
});
};
d(), l.$on("$routeChangeSuccess", d);
var p = function() {
_.each(l.navItems, function(e) {
e.isHover = !1;
});
};
l.navURL = function(e) {
return e ? t("isAbsoluteURL")(e) ? e : "project/" + l.projectName + e : "";
}, l.show = function(e) {
return !(e.isValid && !e.isValid()) && (!e.canI || o.canI({
resource: e.canI.resource,
group: e.canI.group
}, e.canI.verb, l.projectName));
}, l.itemClicked = function(e) {
if (e.href) return l.nav.showMobileNav = !1, void (l.sidebar.secondaryOpen = !1);
p(), e.isHover = !0, e.mobileSecondary = l.isMobile, l.sidebar.showMobileSecondary = l.isMobile, l.sidebar.secondaryOpen = !0;
}, l.onMouseEnter = function(e) {
_.isEmpty(e.secondaryNavSections) || (e.mouseLeaveTimeout && (n.cancel(e.mouseLeaveTimeout), e.mouseLeaveTimeout = null), e.mouseEnterTimeout = n(function() {
e.isHover = !0, e.mouseEnterTimeout = null, l.sidebar.secondaryOpen = !0;
}, 300));
}, l.onMouseLeave = function(e) {
_.isEmpty(e.secondaryNavSections) || (e.mouseEnterTimeout && (n.cancel(e.mouseEnterTimeout), e.mouseEnterTimeout = null), e.mouseLeaveTimeout = n(function() {
e.isHover = !1, e.mouseLeaveTimeout = null, l.sidebar.secondaryOpen = _.some(l.navItems, function(e) {
return e.isHover && !_.isEmpty(e.secondaryNavSections);
});
}, 500));
}, l.closeNav = function() {
p(), l.nav.showMobileNav = !1, l.sidebar.secondaryOpen = !1;
}, l.collapseMobileSecondary = function(e, t) {
e.mobileSecondary = !1, t.stopPropagation();
};
var m = function() {
return s.isWindowBelowBreakpoint(s.WINDOW_SIZE_SM);
};
l.isMobile = m();
var f = _.throttle(function() {
var e = m();
e !== l.isMobile && l.$evalAsync(function() {
l.isMobile = e, e || (_.set(a, "nav.showMobileNav", !1), _.each(l.navItems, function(e) {
e.mobileSecondary = !1;
}));
});
}, 50);
$(window).on("resize.verticalnav", f), l.$on("$destroy", function() {
$(window).off(".verticalnav");
});
} ]
};
} ]).directive("oscHeader", [ "$filter", "$location", "$rootScope", "$routeParams", "$timeout", "AuthorizationService", "Constants", "ProjectsService", "projectOverviewURLFilter", function(e, t, n, a, r, o, i, s, c) {
var l = {}, u = [], d = e("displayName"), p = e("uniqueDisplayName");
return {
restrict: "EA",
templateUrl: "views/directives/header/header.html",
link: function(r, m) {
r.currentProject = l[a.project];
var f = function(e, t) {
var a;
_.set(n, "nav.collapsed", e), t && (a = e ? "true" : "false", localStorage.setItem("openshift/vertical-nav-collapsed", a));
};
!function() {
var e = "true" === localStorage.getItem("openshift/vertical-nav-collapsed");
f(e);
}();
var g = function() {
return _.get(n, "nav.collapsed", !1);
}, h = function(e) {
_.set(n, "nav.showMobileNav", e);
};
r.toggleNav = function() {
var e = g();
f(!e, !0);
}, r.toggleMobileNav = function() {
var e = _.get(n, "nav.showMobileNav");
h(!e);
}, r.closeMobileNav = function() {
h(!1);
}, r.closeOrderingPanel = function() {
_.set(r, "ordering.panelName", "");
}, r.showOrderingPanel = function(e) {
_.set(r, "ordering.panelName", e);
}, r.catalogLandingPageEnabled = !i.DISABLE_SERVICE_CATALOG_LANDING_PAGE;
var v = m.find(".selectpicker"), y = [], b = function() {
var t = r.currentProjectName;
if (t) {
var n = function(e, n) {
var a = $("<option>").attr("value", e.metadata.name).attr("selected", e.metadata.name === t);
return n ? a.text(d(e)) : a.text(p(e, u)), a;
};
_.size(l) <= 100 ? (u = e("orderByDisplayName")(l), y = _.map(u, function(e) {
return n(e, !1);
})) : y = [ n(l[t], !0) ], v.empty(), v.append(y), v.append($('<option data-divider="true"></option>')), v.append($('<option value="">View All Projects</option>')), v.selectpicker("refresh");
}
}, C = function() {
return s.list().then(function(e) {
l = e.by("metadata.name");
});
}, S = function() {
var e = a.project;
r.currentProjectName !== e && (r.currentProjectName = e, r.chromeless = "chromeless" === a.view, e && !r.chromeless ? (_.set(n, "view.hasProject", !0), r.canIAddToProject = !1, o.getProjectRules(e).then(function() {
r.currentProjectName === e && (r.canIAddToProject = o.canIAddToProject(e));
}), C().then(function() {
r.currentProjectName && l && (l[r.currentProjectName] || (l[r.currentProjectName] = {
metadata: {
name: r.currentProjectName
}
}), r.currentProject = l[r.currentProjectName], b());
})) : _.set(n, "view.hasProject", !1));
};
S(), r.$on("$routeChangeSuccess", S), v.selectpicker({
iconBase: "fa",
tickIcon: "fa-check"
}).change(function() {
var e = $(this).val(), n = "" === e ? "projects" : c(e);
r.$apply(function() {
t.url(n);
});
});
}
};
} ]).directive("projectFilter", [ "LabelFilter", function(e) {
return {
restrict: "E",
templateUrl: "views/directives/_project-filter.html",
link: function(t, n) {
e.setupFilterWidget(n.find(".navbar-filter-widget"), n.find(".active-filters"), {
addButtonText: "Add"
}), e.toggleFilterWidget(!t.renderOptions || !t.renderOptions.hideFilterWidget), t.$watch("renderOptions", function(t) {
e.toggleFilterWidget(!t || !t.hideFilterWidget);
});
}
};
} ]).directive("navbarUtility", function() {
return {
restrict: "E",
transclude: !0,
templateUrl: "views/directives/header/_navbar-utility.html",
controller: [ "$scope", "Constants", function(e, t) {
e.launcherApps = t.APP_LAUNCHER_NAVIGATION;
} ]
};
}).directive("navbarUtilityMobile", [ "$timeout", function(e) {
return {
restrict: "E",
transclude: !0,
templateUrl: "views/directives/header/_navbar-utility-mobile.html",
link: function(t, n) {
e(function() {
var e = n.find("li");
e.addClass("list-group-item");
var a = {};
e.each(function(e, t) {
var n = $(t).find("a");
n.each(function(e, n) {
n.href && (a[n.href] = t);
}), n.contents().filter(function() {
return 3 === this.nodeType && $.trim(this.nodeValue).length;
}).wrap('<span class="list-group-item-value"/>');
});
var r = function() {
e.removeClass("active");
var t = a[window.location.href];
t && $(t).addClass("active");
};
r(), t.$on("$routeChangeSuccess", r);
});
}
};
} ]).directive("navPfVerticalAlt", function() {
return {
restrict: "EAC",
link: function() {
$.fn.navigation();
}
};
}).directive("breadcrumbs", function() {
return {
restrict: "E",
scope: {
breadcrumbs: "="
},
templateUrl: "views/directives/breadcrumbs.html"
};
}).directive("back", [ "$window", function(e) {
return {
restrict: "A",
link: function(t, n) {
n.bind("click", function() {
e.history.back();
});
}
};
} ]), angular.module("openshiftConsole").directive("alerts", function() {
return {
restrict: "E",
scope: {
alerts: "=",
filter: "=?",
animateSlide: "=?",
hideCloseButton: "=?",
toast: "=?"
},
templateUrl: "views/_alerts.html",
link: function(e) {
e.close = function(e) {
e.hidden = !0, _.isFunction(e.onClose) && e.onClose();
}, e.onClick = function(e, t) {
_.isFunction(t.onClick) && t.onClick() && (e.hidden = !0);
};
}
};
}), angular.module("openshiftConsole").directive("parseError", function() {
return {
restrict: "E",
scope: {
error: "="
},
templateUrl: "views/_parse-error.html",
link: function(e) {
e.$watch("error", function() {
e.hidden = !1;
});
}
};
}), angular.module("openshiftConsole").directive("podWarnings", [ "podWarningsFilter", function(e) {
return {
restrict: "E",
scope: {
pod: "="
},
link: function(t) {
var n, a = "", r = e(t.pod);
for (n = 0; n < _.size(r); n++) a && (a += "<br>"), "error" === r[n].severity && (t.hasError = !0), a += r[n].message;
t.content = a;
},
templateUrl: "views/directives/_warnings-popover.html"
};
} ]).directive("routeWarnings", [ "RoutesService", function(e) {
return {
restrict: "E",
scope: {
route: "=",
services: "="
},
link: function(t) {
t.$watchGroup([ "route", "services" ], function() {
var n = e.getRouteWarnings(t.route, t.services);
t.content = _.map(n, _.escape).join("<br>");
});
},
templateUrl: "views/directives/_warnings-popover.html"
};
} ]), angular.module("openshiftConsole").directive("takeFocus", [ "$timeout", function(e) {
return {
restrict: "A",
link: function(t, n) {
e(function() {
$(n).focus();
}, 300);
}
};
} ]).directive("selectOnFocus", function() {
return {
restrict: "A",
link: function(e, t) {
$(t).focus(function() {
$(this).select();
});
}
};
}).directive("focusWhen", [ "$timeout", function(e) {
return {
restrict: "A",
scope: {
trigger: "@focusWhen"
},
link: function(t, n) {
t.$watch("trigger", function(t) {
t && e(function() {
$(n).focus();
});
});
}
};
} ]).directive("clickToReveal", function() {
return {
restrict: "A",
transclude: !0,
scope: {
linkText: "@"
},
templateUrl: "views/directives/_click-to-reveal.html",
link: function(e, t) {
$(".reveal-contents-link", t).click(function() {
$(this).hide(), $(".reveal-contents", t).show();
});
}
};
}).directive("copyToClipboard", function() {
return {
restrict: "E",
scope: {
clipboardText: "=",
isDisabled: "=?",
displayWide: "=?",
inputText: "=?",
multiline: "=?"
},
templateUrl: "views/directives/_copy-to-clipboard.html",
controller: [ "$scope", function(e) {
e.id = _.uniqueId("clipboardJs");
} ],
link: function(e, t) {
var n = $("a", t), a = n.get(0);
e.inputText && (a = n.get(1));
var r = new Clipboard(a);
r.on("success", function(e) {
$(e.trigger).attr("title", "Copied!").tooltip("fixTitle").tooltip("show").attr("title", "Copy to Clipboard").tooltip("fixTitle"), e.clearSelection();
}), r.on("error", function(e) {
var t = /Mac/i.test(navigator.userAgent) ? "Press ⌘C to copy" : "Press Ctrl-C to copy";
$(e.trigger).attr("title", t).tooltip("fixTitle").tooltip("show").attr("title", "Copy to Clipboard").tooltip("fixTitle");
}), t.on("$destroy", function() {
r.destroy();
});
}
};
}).directive("copyLoginToClipboard", [ "NotificationsService", function(e) {
return {
restrict: "E",
replace: !0,
scope: {
clipboardText: "@"
},
template: '<a href="" data-clipboard-text="">Copy Login Command</a>',
link: function(t, n) {
var a = new Clipboard(n.get(0));
a.on("success", function() {
e.addNotification({
id: "copy-login-command-success",
type: "success",
message: "Login command copied."
});
e.addNotification({
id: "openshift/token-warning",
type: "warning",
message: "A token is a form of a password. Do not share your API token.",
links: [ {
href: "",
label: "Don't Show Me Again",
onClick: function() {
return e.permanentlyHideNotification("openshift/token-warning"), !0;
}
} ]
});
}), a.on("error", function() {
e.addNotification({
id: "copy-login-command-error",
type: "error",
message: "Unable to copy the login command."
});
}), n.on("$destroy", function() {
a.destroy();
});
}
};
} ]).directive("shortId", function() {
return {
restrict: "E",
scope: {
id: "@"
},
template: '<code class="short-id" title="{{id}}">{{id.substring(0, 6)}}</code>'
};
}).directive("customIcon", function() {
return {
restrict: "E",
scope: {
resource: "=",
kind: "@",
tag: "=?"
},
controller: [ "$scope", "$filter", function(e, t) {
e.$watchGroup([ "resource", "tag" ], function() {
e.tag ? e.icon = t("imageStreamTagAnnotation")(e.resource, "icon", e.tag) : e.icon = t("annotation")(e.resource, "icon"), e.isDataIcon = e.icon && 0 === e.icon.indexOf("data:"), e.isDataIcon || (e.tag ? e.icon = t("imageStreamTagIconClass")(e.resource, e.tag) : e.icon = t("iconClass")(e.resource, e.kind));
});
} ],
templateUrl: "views/directives/_custom-icon.html"
};
}).directive("bottomOfWindow", function() {
return {
restrict: "A",
link: function(e, t) {
function n() {
var e = $(window).height() - t[0].getBoundingClientRect().top;
t.css("height", e - 10 + "px");
}
$(window).on("resize", n), n(), t.on("$destroy", function() {
$(window).off("resize", n);
});
}
};
}).directive("onEnter", function() {
return function(e, t, n) {
t.bind("keydown keypress", function(t) {
13 === t.which && (e.$apply(function() {
e.$eval(n.onEnter);
}), t.preventDefault());
});
};
}).directive("onEsc", function() {
return function(e, t, n) {
t.bind("keydown keypress", function(t) {
27 === t.which && (e.$apply(function() {
e.$eval(n.onEsc);
}), t.preventDefault());
});
};
}).directive("persistTabState", [ "$routeParams", "$location", function(e, t) {
return {
restrict: "A",
scope: !1,
link: function(n) {
n.selectedTab = n.selectedTab || {}, n.$watch(function() {
return e.tab;
}, function(e) {
e && (n.selectedTab[e] = !0);
}), n.$watch("selectedTab", function() {
var e = _.keys(_.pickBy(n.selectedTab, function(e) {
return e;
}));
if (1 === e.length) {
var a = t.search();
a.tab = e[0], t.replace().search(a);
}
}, !0);
}
};
} ]), angular.module("openshiftConsole").directive("labels", [ "$location", "$timeout", "LabelFilter", function(e, t, n) {
return {
restrict: "E",
scope: {
labels: "=",
clickable: "@?",
kind: "@?",
projectName: "@?",
limit: "=?",
titleKind: "@?",
navigateUrl: "@?",
filterCurrentPage: "=?"
},
templateUrl: "views/directives/labels.html",
link: function(a) {
a.filterAndNavigate = function(r, o) {
a.kind && a.projectName && (a.filterCurrentPage || e.url(a.navigateUrl || "/project/" + a.projectName + "/browse/" + a.kind), t(function() {
var e = {};
e[r] = o, n.setLabelSelector(new LabelSelector(e, !0));
}, 1));
};
}
};
} ]).directive("labelEditor", function() {
function e(e) {
return !(e.length > o) && r.test(e);
}
function t(e) {
return !(e.length > a) && n.test(e);
}
var n = /^(([A-Za-z0-9][-A-Za-z0-9_.]*)?[A-Za-z0-9])?$/, a = 63, r = /^[a-z0-9]([-a-z0-9]*[a-z0-9])?(\.[a-z0-9]([-a-z0-9]*[a-z0-9])?)*$/, o = 253;
return {
restrict: "E",
scope: {
labels: "=",
expand: "=?",
canToggle: "=?",
helpText: "@?"
},
templateUrl: "views/directives/label-editor.html",
link: function(e, t, n) {
angular.isDefined(n.canToggle) || (e.canToggle = !0);
},
controller: [ "$scope", function(n) {
var a = {
test: function(n) {
var a = n.split("/");
switch (a.length) {
case 1:
return t(a[0]);

case 2:
return e(a[0]) && t(a[1]);
}
return !1;
}
};
angular.extend(n, {
validator: {
key: a,
value: a
}
});
} ]
};
}), angular.module("openshiftConsole").directive("editLifecycleHook", function() {
return {
restrict: "E",
scope: {
type: "@",
hookParams: "=model",
availableVolumes: "=",
availableContainers: "=",
availableSecrets: "=",
availableConfigMaps: "=",
namespace: "="
},
templateUrl: "views/directives/edit-lifecycle-hook.html",
controller: [ "$scope", function(e) {
e.view = {
isDisabled: !1
}, e.lifecycleHookFailurePolicyTypes = [ "Abort", "Retry", "Ignore" ], e.istagHook = {}, e.removedHookParams = {}, e.action = {
type: _.has(e.hookParams, "tagImages") ? "tagImages" : "execNewPod"
};
var t = {
command: [],
env: [],
volumes: [],
containerName: e.availableContainers[0] || ""
}, n = {
to: {},
containerName: e.availableContainers[0] || ""
}, a = function(t) {
var n = {};
if (_.isEmpty(t)) n = {
namespace: e.namespace,
imageStream: "",
tagObject: null
}; else {
var a = t.name.split(":");
n = {
namespace: t.namespace || e.namespace,
imageStream: a[0],
tagObject: {
tag: a[1]
}
};
}
return n;
}, r = function() {
"execNewPod" === e.action.type ? (_.has(e.removedHookParams, "execNewPod") ? e.hookParams.execNewPod = e.removedHookParams.execNewPod : e.hookParams.execNewPod = _.get(e, "hookParams.execNewPod", {}), e.hookParams.execNewPod = _.merge(angular.copy(t), e.hookParams.execNewPod)) : (_.has(e.removedHookParams, "tagImages") ? e.hookParams.tagImages = e.removedHookParams.tagImages : e.hookParams.tagImages = _.get(e, "hookParams.tagImages", [ {} ]), e.hookParams.tagImages = [ _.merge(angular.copy(n), e.hookParams.tagImages[0]) ], e.istagHook = a(_.head(e.hookParams.tagImages).to)), e.hookParams.failurePolicy = _.get(e.hookParams, "failurePolicy", "Abort");
};
e.addHook = function() {
_.isEmpty(e.removedHookParams) ? (e.hookParams = {}, r()) : e.hookParams = e.removedHookParams;
}, e.removeHook = function() {
e.removedHookParams = e.hookParams, delete e.hookParams, e.editForm.$setDirty();
};
e.$watchGroup([ "hookParams", "action.type" ], function() {
e.hookParams && ("execNewPod" === e.action.type ? (e.hookParams.tagImages && (e.removedHookParams.tagImages = e.hookParams.tagImages, delete e.hookParams.tagImages), r()) : "tagImages" === e.action.type && (e.hookParams.execNewPod && (e.removedHookParams.execNewPod = e.hookParams.execNewPod, delete e.hookParams.execNewPod), r()));
}), e.valueFromObjects = [], e.$watchGroup([ "availableSecrets", "availableConfigMaps" ], function() {
e.valueFromObjects = (e.availableSecrets || []).concat(e.availableConfigMaps);
}), e.$watch("istagHook.tagObject.tag", function() {
_.has(e.istagHook, [ "tagObject", "tag" ]) && (_.set(e.hookParams, "tagImages[0].to.kind", "ImageStreamTag"), _.set(e.hookParams, "tagImages[0].to.namespace", e.istagHook.namespace), _.set(e.hookParams, "tagImages[0].to.name", e.istagHook.imageStream + ":" + e.istagHook.tagObject.tag));
});
} ]
};
}).directive("lifecycleHook", [ "$filter", function(e) {
return {
restrict: "E",
scope: {
deploymentConfig: "=",
type: "@"
},
templateUrl: "views/directives/lifecycle-hook.html",
link: function(t) {
t.$watch("deploymentConfig", function(n) {
t.strategyParams = e("deploymentStrategyParams")(n);
});
}
};
} ]), angular.module("openshiftConsole").directive("actionChip", function() {
return {
restrict: "E",
scope: {
key: "=?",
value: "=?",
keyHelp: "=?",
valueHelp: "=",
action: "&?",
actionIcon: "=?",
actionTitle: "@",
showAction: "=?"
},
templateUrl: "views/directives/action-chip.html"
};
}), function() {
angular.module("openshiftConsole").component("addConfigToApplication", {
controller: [ "$filter", "$scope", "APIService", "ApplicationsService", "DataService", "Navigate", "NotificationsService", "StorageService", function(e, t, n, a, r, o, i, s) {
var c = this, l = e("humanizeKind"), u = function() {
var e = {
namespace: c.project.metadata.name
};
a.getApplications(e).then(function(e) {
c.applications = e, c.updating = !1;
});
};
c.$onInit = function() {
c.addType = "env", c.disableInputs = !1, u();
var e = new RegExp("^[A-Za-z_][A-Za-z0-9_]*$");
c.hasInvalidEnvVars = _.some(c.apiObject.data, function(t, n) {
return !e.test(n);
});
};
var d = function(e) {
return c.attachAllContainers || c.attachContainers[e.name];
};
c.$postLink = function() {
t.$watch(function() {
return c.application;
}, function() {
var e = _.get(c.application, "spec.template");
c.existingMountPaths = s.getMountPaths(e), c.attachAllContainers = !0;
});
}, c.groupByKind = function(e) {
return l(e.kind);
}, c.addToApplication = function() {
var t = angular.copy(c.application), a = _.get(t, "spec.template");
if (c.disableInputs = !0, "env" === c.addType) {
var s = {};
switch (c.apiObject.kind) {
case "Secret":
s.secretRef = {
name: c.apiObject.metadata.name
};
break;

case "ConfigMap":
s.configMapRef = {
name: c.apiObject.metadata.name
};
}
_.each(a.spec.containers, function(e) {
d(e) && (e.envFrom = e.envFrom || [], e.envFrom.push(s));
});
} else {
var l = e("generateName")(c.apiObject.metadata.name + "-"), u = {
name: l,
mountPath: c.mountVolume,
readOnly: !0
};
_.each(a.spec.containers, function(e) {
d(e) && (e.volumeMounts = e.volumeMounts || [], e.volumeMounts.push(u));
});
var p = {
name: l
};
switch (c.apiObject.kind) {
case "Secret":
p.secret = {
secretName: c.apiObject.metadata.name
};
break;

case "ConfigMap":
p.configMap = {
name: c.apiObject.metadata.name
};
}
a.spec.volumes = a.spec.volumes || [], a.spec.volumes.push(p);
}
var m = e("humanizeKind"), f = m(c.apiObject.kind), g = m(t.kind), h = {
namespace: c.project.metadata.name
};
r.update(n.kindToResource(t.kind), t.metadata.name, t, h).then(function() {
i.addNotification({
type: "success",
message: "Successfully added " + f + " " + c.apiObject.metadata.name + " to " + g + " " + t.metadata.name + ".",
links: [ {
href: o.resourceURL(t),
label: "View " + m(t.kind, !0)
} ]
}), angular.isFunction(c.onComplete) && c.onComplete();
}, function(n) {
var a = e("getErrorDetails");
i.addNotification({
type: "error",
message: "An error occurred  adding " + f + " " + c.apiObject.metadata.name + " to " + g + " " + t.metadata.name + ". " + a(n)
});
}).finally(function() {
c.disableInputs = !1;
});
};
} ],
controllerAs: "ctrl",
bindings: {
project: "<",
apiObject: "<",
onComplete: "<",
onCancel: "<"
},
templateUrl: "views/directives/add-config-to-application.html"
});
}(), angular.module("openshiftConsole").directive("templateOptions", function() {
return {
restrict: "E",
templateUrl: "views/_templateopt.html",
transclude: !0,
scope: {
parameters: "=",
expand: "=?",
canToggle: "=?",
isDialog: "=?"
},
link: function(e, t, n) {
angular.isDefined(n.canToggle) || (e.canToggle = !0), e.isOnlyWhitespace = function(e) {
return /^\s+$/.test(e);
}, e.focus = function(e) {
angular.element("#" + e).focus();
};
}
};
}), angular.module("openshiftConsole").directive("tasks", function() {
return {
restrict: "E",
templateUrl: "views/_tasks.html"
};
}), angular.module("openshiftConsole").directive("catalog", [ "CatalogService", "Constants", "KeywordService", "Logger", function(e, t, n, a) {
return {
restrict: "E",
scope: {
projectImageStreams: "=",
openshiftImageStreams: "=",
projectTemplates: "=",
openshiftTemplates: "=",
projectName: "=",
parentCategory: "=category"
},
templateUrl: "views/catalog/catalog.html",
link: function(r) {
function o() {
var t = r.keywords = n.generateKeywords(r.filter.keyword);
if (_.isEmpty(t)) return r.filterActive = !1, r.filteredBuildersByCategory = r.buildersByCategory, void (r.filteredTemplatesByCategory = r.templatesByCategory);
r.filterActive = !0, r.filteredBuildersByCategory = {}, _.each(r.buildersByCategory, function(n, a) {
var o = e.getCategoryItem(a), i = _.reject(t, function(e) {
return e.test(o.label);
});
r.filteredBuildersByCategory[a] = e.filterImageStreams(n, i);
}), r.filteredBuildersNoSubcategory = e.filterImageStreams(r.buildersNoSubcategory, t), r.filteredTemplatesByCategory = {}, _.each(r.templatesByCategory, function(n, a) {
var o = e.getCategoryItem(a), i = _.reject(t, function(e) {
return e.test(o.label);
});
r.filteredTemplatesByCategory[a] = e.filterTemplates(n, i);
}), r.filteredTemplatesNoSubcategory = e.filterTemplates(r.templatesNoSubcategory, t);
}
function i(e) {
var t = _.get(r, "parentCategory.subcategories", []);
if (_.isEmpty(t)) return [];
var n = {};
_.each(t, function(t) {
_.each(t.items, function(t) {
_.each(e[t.id], function(e) {
var t = _.get(e, "metadata.uid");
n[t] = !0;
});
});
});
var a = r.parentCategory.id;
return _.reject(e[a], function(e) {
var t = _.get(e, "metadata.uid");
return !!n[t];
});
}
function s() {
r.noFilterMatches = !0, u = [];
var e = {};
_.each(r.filteredBuildersByCategory, function(t, n) {
e[n] = _.size(t);
}), _.each(r.filteredTemplatesByCategory, function(t, n) {
e[n] = (e[n] || 0) + _.size(t);
}), r.allContentHidden = !0, _.each(r.categories, function(t) {
var n = !1;
_.each(t.items, function(t) {
e[t.id] && (u.push(t), n = !0);
}), _.set(r, [ "hasContent", t.id ], n), n && (r.allContentHidden = !1);
}), r.countByCategory = e, r.hasItemsNoSubcategory = !_.isEmpty(r.buildersNoSubcategory) || !_.isEmpty(r.templatesNoSubcategory), r.countFilteredNoSubcategory = _.size(r.filteredBuildersNoSubcategory) + _.size(r.filteredTemplatesNoSubcategory), r.countFilteredNoSubcategory && (r.allContentHidden = !1);
}
function c() {
return !!r.parentCategory && (1 === u.length && !r.hasItemsNoSubcategory);
}
function l() {
r.loaded = r.projectTemplates && r.openshiftTemplates && r.projectImageStreams && r.openshiftImageStreams, o(), s(), r.loaded && (c() && (r.singleCategory = _.head(u)), a.log("templates by category", r.templatesByCategory), a.log("builder images", r.buildersByCategory));
}
r.categories = _.get(r, "parentCategory.subcategories", t.CATALOG_CATEGORIES), r.loaded = !1, r.emptyCatalog = !0, r.filter = {
keyword: ""
}, r.$watch("filter.keyword", _.debounce(function() {
r.$apply(function() {
o(), s();
});
}, 200, {
maxWait: 1e3,
trailing: !0
}));
var u;
r.$watchGroup([ "openshiftImageStreams", "projectImageStreams" ], function() {
if (r.projectImageStreams && r.openshiftImageStreams) {
var t = _.toArray(r.projectImageStreams).concat(_.toArray(r.openshiftImageStreams));
r.buildersByCategory = e.categorizeImageStreams(t), r.buildersNoSubcategory = i(r.buildersByCategory), r.emptyCatalog = r.emptyCatalog && _.every(r.buildersByCategory, _.isEmpty) && _.isEmpty(r.buildersNoSubcategory), l();
}
}), r.$watchGroup([ "openshiftTemplates", "projectTemplates" ], function() {
if (r.projectTemplates && r.openshiftTemplates) {
var t = _.toArray(r.projectTemplates).concat(_.toArray(r.openshiftTemplates));
r.templatesByCategory = e.categorizeTemplates(t), r.templatesNoSubcategory = i(r.templatesByCategory), r.emptyCatalog = r.emptyCatalog && _.every(r.templatesByCategory, _.isEmpty) && _.isEmpty(r.templatesNoSubcategory), l();
}
});
}
};
} ]), angular.module("openshiftConsole").directive("categoryContent", [ "CatalogService", "Constants", "KeywordService", "Logger", function(e, t, n, a) {
return {
restrict: "E",
scope: {
projectImageStreams: "=",
openshiftImageStreams: "=",
projectTemplates: "=",
openshiftTemplates: "=",
projectName: "=",
category: "="
},
templateUrl: "views/catalog/category-content.html",
link: function(t) {
function r() {
var a = t.keywords = n.generateKeywords(t.filter.keyword);
t.filteredBuilderImages = e.filterImageStreams(c, a), t.filteredTemplates = e.filterTemplates(l, a);
}
function o() {
return t.projectImageStreams && t.openshiftImageStreams ? _.toArray(t.projectImageStreams).concat(_.toArray(t.openshiftImageStreams)) : [];
}
function i() {
return t.projectTemplates && t.openshiftTemplates ? _.toArray(t.projectTemplates).concat(_.toArray(t.openshiftTemplates)) : [];
}
function s() {
t.loaded = t.projectTemplates && t.openshiftTemplates && t.projectImageStreams && t.openshiftImageStreams, r(), t.emptyCategory = _.isEmpty(c) && _.isEmpty(l), t.loaded && (a.log("templates", l), a.log("builder images", c));
}
var c = [], l = [];
t.filteredTemplates = [], t.filteredBuilderImages = [], t.loaded = !1, t.filter = {
keyword: ""
}, t.$watch("filter.keyword", r), t.$watchGroup([ "openshiftImageStreams", "projectImageStreams" ], function() {
var n = e.categorizeImageStreams(o());
c = _.get(n, [ t.category.id ], []), s();
}), t.$watchGroup([ "openshiftTemplates", "projectTemplates" ], function() {
var n = e.categorizeTemplates(i());
l = _.get(n, [ t.category.id ], []), s();
});
}
};
} ]), angular.module("openshiftConsole").directive("catalogImage", [ "$filter", "CatalogService", function(e, t) {
return {
restrict: "E",
replace: !0,
scope: {
image: "=",
imageStream: "=",
project: "@",
isBuilder: "=?",
keywords: "="
},
templateUrl: "views/catalog/_image.html",
link: function(n) {
var a = e("imageStreamTagTags"), r = {};
n.referencedBy = {};
var o = _.get(n, "imageStream.spec.tags", []), i = {};
_.each(o, function(e) {
i[e.name] = a(n.imageStream, e.name), t.referencesSameImageStream(e) && (r[e.name] = !0, n.referencedBy[e.from.name] = n.referencedBy[e.from.name] || [], n.referencedBy[e.from.name].push(e.name));
});
var s = function(e) {
var t = _.get(i, [ e ], []);
return _.includes(t, "builder") && !_.includes(t, "hidden");
};
n.$watch("imageStream.status.tags", function(e) {
n.tags = _.filter(e, function(e) {
return s(e.tag) && !r[e.tag];
});
var t = _.get(n, "is.tag.tag");
t && _.some(n.tags, {
tag: t
}) || _.set(n, "is.tag", _.head(n.tags));
});
}
};
} ]), angular.module("openshiftConsole").directive("catalogTemplate", function() {
return {
restrict: "E",
replace: !0,
scope: {
template: "=",
project: "@",
keywords: "="
},
templateUrl: "views/catalog/_template.html"
};
}), angular.module("openshiftConsole").directive("podMetrics", [ "$filter", "$interval", "$parse", "$timeout", "$q", "$rootScope", "ChartsService", "ConversionService", "MetricsCharts", "MetricsService", "ModalsService", "usageValueFilter", function(e, t, n, a, r, o, i, s, c, l, u, d) {
return {
restrict: "E",
scope: {
pod: "=",
includedMetrics: "=?",
stackDonut: "=?",
alerts: "=?"
},
templateUrl: "views/directives/pod-metrics.html",
link: function(p) {
function m(e) {
if (!p.pod) return null;
var t = p.options.selectedContainer;
switch (e) {
case "memory/usage":
var n = N(t);
if (n) return s.bytesToMiB(d(n));
break;

case "cpu/usage_rate":
var a = E(t);
if (a) return d(a);
}
return null;
}
function f(e) {
var t = _.head(e.datasets);
if (t.total) {
var n, r = {
type: "donut",
columns: [ [ "Used", t.used ], [ "Available", Math.max(t.available, 0) ] ],
colors: {
Used: t.available > 0 ? "#0088ce" : "#ec7a08",
Available: "#d1d1d1"
}
};
I[t.id] ? I[t.id].load(r) : ((n = B(e)).data = r, a(function() {
A || (I[t.id] = c3.generate(n));
}));
}
}
function g(e) {
if (!_.some(e.datasets, function(e) {
return !e.data;
})) {
var t = {};
_.each(e.datasets, function(e) {
t[e.id] = e.data;
});
var n, r = c.getSparklineData(t), o = e.chartPrefix + "sparkline";
T[o] ? T[o].load(r) : ((n = L(e)).data = r, e.chartDataColors && (n.color = {
pattern: e.chartDataColors
}), a(function() {
A || (T[o] = c3.generate(n));
}));
}
}
function h() {
return "-" + p.options.timeRange.value + "mn";
}
function v() {
return 60 * p.options.timeRange.value * 1e3;
}
function y() {
return Math.floor(v() / D) + "ms";
}
function b(e, t, n) {
var a, r = {
metric: t.id,
type: t.type,
bucketDuration: y()
};
return t.data && t.data.length ? (a = _.last(t.data), r.start = a.end) : r.start = n, p.pod ? _.assign(r, {
namespace: p.pod.metadata.namespace,
pod: p.pod,
containerName: e.containerMetric ? p.options.selectedContainer.name : "pod"
}) : null;
}
function C() {
A || (U = 0, _.each(p.metrics, function(e) {
g(e), f(e);
}));
}
function S(e) {
if (!A) if (U++, p.noData) p.metricsError = {
status: _.get(e, "status", 0),
details: _.get(e, "data.errorMsg") || _.get(e, "statusText") || "Status code " + _.get(e, "status", 0)
}; else if (!(U < 2)) {
var t = "metrics-failed-" + p.uniqueID;
p.alerts[t] = {
type: "error",
message: "An error occurred updating metrics for pod " + _.get(p, "pod.metadata.name", "<unknown>") + ".",
links: [ {
href: "",
label: "Retry",
onClick: function() {
delete p.alerts[t], U = 1, P();
}
} ]
};
}
}
function w() {
return !(p.metricsError || U > 1) && (p.pod && _.get(p, "options.selectedContainer"));
}
function k(e, t, n) {
t.total = m(t.id), t.total && (p.hasLimits = !0);
var a = _.get(n, "usage.value");
isNaN(a) && (a = 0), e.convert && (a = e.convert(a)), t.used = d3.round(a, e.usagePrecision), t.total && (t.available = d3.round(t.total - a, e.usagePrecision)), e.totalUsed += t.used;
}
function j(e, t) {
p.noData = !1;
var n = _.initial(t.data);
e.data ? e.data = _.chain(e.data).takeRight(D).concat(n).value() : e.data = n;
}
function P() {
if (w()) {
var e = h(), t = [];
angular.forEach(p.metrics, function(n) {
var a = [];
n.totalUsed = 0, angular.forEach(n.datasets, function(r) {
var o = b(n, r, e);
if (o) {
var i = l.get(o);
a.push(i), m(r.id) && t.push(l.getCurrentUsage(o).then(function(e) {
k(n, r, e);
}));
}
}), t = t.concat(a), r.all(a).then(function(e) {
A || angular.forEach(e, function(e) {
e && j(_.find(n.datasets, {
id: e.metricID
}), e);
});
});
}), r.all(t).then(C, S).finally(function() {
p.loaded = !0;
});
}
}
p.includedMetrics = p.includedMetrics || [ "cpu", "memory", "network" ];
var R, I = {}, T = {}, N = n("resources.limits.memory"), E = n("resources.limits.cpu"), D = 30, A = !1;
p.uniqueID = c.uniqueID(), p.metrics = [], _.includes(p.includedMetrics, "memory") && p.metrics.push({
label: "Memory",
units: "MiB",
chartPrefix: "memory-",
convert: s.bytesToMiB,
containerMetric: !0,
datasets: [ {
id: "memory/usage",
label: "Memory",
data: []
} ]
}), _.includes(p.includedMetrics, "cpu") && p.metrics.push({
label: "CPU",
units: "cores",
chartPrefix: "cpu-",
convert: s.millicoresToCores,
usagePrecision: 3,
containerMetric: !0,
datasets: [ {
id: "cpu/usage_rate",
label: "CPU",
data: []
} ]
}), _.includes(p.includedMetrics, "network") && p.metrics.push({
label: "Network",
units: "KiB/s",
chartPrefix: "network-",
chartType: "spline",
convert: s.bytesToKiB,
datasets: [ {
id: "network/tx_rate",
label: "Sent",
data: []
}, {
id: "network/rx_rate",
label: "Received",
data: []
} ]
}), p.loaded = !1, p.noData = !0, p.showComputeUnitsHelp = function() {
u.showComputeUnitsHelp();
}, l.getMetricsURL().then(function(e) {
p.metricsURL = e;
}), p.options = {
rangeOptions: c.getTimeRangeOptions()
}, p.options.timeRange = _.head(p.options.rangeOptions);
var $ = e("upperFirst"), B = function(e) {
var t = "#" + e.chartPrefix + p.uniqueID + "-donut";
return {
bindto: t,
onrendered: function() {
i.updateDonutCenterText(t, e.datasets[0].used, $(e.units) + " Used");
},
donut: {
label: {
show: !1
},
width: 10
},
legend: {
show: !1
},
size: {
height: 175,
widht: 175
}
};
}, L = function(e) {
var t = e.chartPrefix + p.uniqueID + "-sparkline", n = c.getDefaultSparklineConfig(t, e.units);
return 1 === e.datasets.length && _.set(n, "legend.show", !1), n;
}, U = 0;
(window.OPENSHIFT_CONSTANTS.DISABLE_CUSTOM_METRICS ? r.when({}) : l.getCustomMetrics(p.pod).then(function(e) {
angular.forEach(e, function(e) {
var t = e.description || e.name, n = e.unit || "", a = "custom/" + e.id.replace(/.*\/custom\//, "");
p.metrics.push({
label: t,
units: n,
chartPrefix: "custom-" + _.uniqueId("custom-metric-"),
chartType: "spline",
datasets: [ {
id: a,
label: t,
type: e.type,
data: []
} ]
});
});
})).finally(function() {
p.$watch("options", function() {
_.each(p.metrics, function(e) {
_.each(e.datasets, function(e) {
delete e.data;
});
}), delete p.metricsError, P();
}, !0), R = t(P, c.getDefaultUpdateInterval(), !1);
});
var O = o.$on("metrics.charts.resize", function() {
c.redraw(I), c.redraw(T);
});
p.$on("$destroy", function() {
R && (t.cancel(R), R = null), O && (O(), O = null), angular.forEach(I, function(e) {
e.destroy();
}), I = null, angular.forEach(T, function(e) {
e.destroy();
}), T = null, A = !0;
});
}
};
} ]), angular.module("openshiftConsole").directive("deploymentMetrics", [ "$interval", "$parse", "$timeout", "$q", "$rootScope", "ChartsService", "ConversionService", "MetricsCharts", "MetricsService", "ModalsService", function(e, t, n, a, r, o, i, s, c, l) {
return {
restrict: "E",
scope: {
pods: "=",
containers: "=",
profile: "@",
alerts: "=?"
},
templateUrl: function(e, t) {
return "compact" === t.profile ? "views/directives/metrics-compact.html" : "views/directives/deployment-metrics.html";
},
link: function(t) {
function n(e) {
return null === e.value || void 0 === e.value;
}
function a(e) {
var t, a = {}, r = [ "Date" ], o = [ t = w ? e.compactDatasetLabel || e.label : "Average Usage" ], i = [ r, o ], s = function(e) {
var t = "" + e.start;
return a[t] || (a[t] = {
total: 0,
count: 0
}), a[t];
};
return _.each(R[e.descriptor], function(e) {
_.each(e, function(e) {
var t = s(e);
(!j || j < e.end) && (j = e.end), n(e) || (t.total += e.value, t.count = t.count + 1);
});
}), _.each(a, function(t, n) {
var a;
a = t.count ? t.total / t.count : null, r.push(Number(n)), o.push(e.convert ? e.convert(a) : a);
}), o.length > 1 && (e.lastValue = _.last(o) || 0), i;
}
function o(e, r) {
var o = [], i = {
type: "spline"
};
return t.showAverage ? (_.each(e[r.descriptor], function(e, t) {
v(r.descriptor, t, e);
}), i.type = "area-spline", w && r.compactType && (i.type = r.compactType), i.x = "Date", i.columns = a(r), i) : (_.each(e[r.descriptor], function(e, t) {
v(r.descriptor, t, e);
var a = t + "-dates";
_.set(i, [ "xs", t ], a);
var s = [ a ], c = [ t ];
o.push(s), o.push(c), _.each(R[r.descriptor][t], function(e) {
if (s.push(e.start), (!j || j < e.end) && (j = e.end), n(e)) c.push(e.value); else {
var t = r.convert ? r.convert(e.value) : e.value;
c.push(t);
}
});
}), i.columns = _.sortBy(o, function(e) {
return e[0];
}), i);
}
function u(e) {
k || (E = 0, t.showAverage = _.size(t.pods) > 5 || w, _.each(t.metrics, function(n) {
var a, r = o(e, n), i = n.descriptor;
w && n.compactCombineWith && (i = n.compactCombineWith, n.lastValue && (N[i].lastValue = (N[i].lastValue || 0) + n.lastValue)), C[i] ? (C[i].load(r), t.showAverage ? C[i].legend.hide() : C[i].legend.show()) : ((a = D(n)).data = r, C[i] = c3.generate(a));
}));
}
function d() {
return w ? "-15mn" : "-" + t.options.timeRange.value + "mn";
}
function p() {
return 60 * t.options.timeRange.value * 1e3;
}
function m() {
return w ? "1mn" : Math.floor(p() / S) + "ms";
}
function f() {
var e = _.find(t.pods, "metadata.namespace");
if (e) {
var n = {
pods: t.pods,
namespace: e.metadata.namespace,
bucketDuration: m()
};
return w || (n.containerName = t.options.selectedContainer.name), n.start = j || d(), n;
}
}
function g(e) {
if (!k) if (E++, t.noData) t.metricsError = {
status: _.get(e, "status", 0),
details: _.get(e, "data.errorMsg") || _.get(e, "statusText") || "Status code " + _.get(e, "status", 0)
}; else if (!(E < 2) && t.alerts) {
var n = "metrics-failed-" + t.uniqueID;
t.alerts[n] = {
type: "error",
message: "An error occurred updating metrics.",
links: [ {
href: "",
label: "Retry",
onClick: function() {
delete t.alerts[n], E = 1, y();
}
} ]
};
}
}
function h() {
return _.isEmpty(t.pods) ? (t.loaded = !0, !1) : !t.metricsError && E < 2;
}
function v(e, n, a) {
t.noData = !1;
var r = _.initial(a), o = _.get(R, [ e, n ]);
if (o) {
var i = _.takeRight(o.concat(r), S);
_.set(R, [ e, n ], i);
} else _.set(R, [ e, n ], r);
}
function y() {
if (!I && h()) {
P = Date.now();
var e = f();
c.getPodMetrics(e).then(u, g).finally(function() {
t.loaded = !0;
});
}
}
var b, C = {}, S = 30, w = "compact" === t.profile, k = !1;
t.uniqueID = s.uniqueID();
var j, P, R = {}, I = w, T = function(e) {
return e >= 1024;
};
t.metrics = [ {
label: "Memory",
units: "MiB",
convert: i.bytesToMiB,
formatUsage: function(e) {
return T(e) && (e /= 1024), s.formatUsage(e);
},
usageUnits: function(e) {
return T(e) ? "GiB" : "MiB";
},
descriptor: "memory/usage",
type: "pod_container",
chartID: "memory-" + t.uniqueID
}, {
label: "CPU",
units: "cores",
convert: i.millicoresToCores,
formatUsage: s.formatUsage,
usageUnits: function() {
return "cores";
},
descriptor: "cpu/usage_rate",
type: "pod_container",
chartID: "cpu-" + t.uniqueID
}, {
label: "Network (Sent)",
units: "KiB/s",
convert: i.bytesToKiB,
formatUsage: s.formatUsage,
usageUnits: function() {
return "KiB/s";
},
descriptor: "network/tx_rate",
type: "pod",
compactLabel: "Network",
compactDatasetLabel: "Sent",
compactType: "spline",
chartID: "network-tx-" + t.uniqueID
}, {
label: "Network (Received)",
units: "KiB/s",
convert: i.bytesToKiB,
formatUsage: s.formatUsage,
usageUnits: function() {
return "KiB/s";
},
descriptor: "network/rx_rate",
type: "pod",
compactCombineWith: "network/tx_rate",
compactDatasetLabel: "Received",
compactType: "spline",
chartID: "network-rx-" + t.uniqueID
} ];
var N = _.keyBy(t.metrics, "descriptor");
t.loaded = !1, t.noData = !0, t.showComputeUnitsHelp = function() {
l.showComputeUnitsHelp();
};
var E = 0;
c.getMetricsURL().then(function(e) {
t.metricsURL = e;
}), t.options = {
rangeOptions: s.getTimeRangeOptions()
}, t.options.timeRange = _.head(t.options.rangeOptions), t.options.selectedContainer = _.head(t.containers);
var D = function(e) {
var n = s.getDefaultSparklineConfig(e.chartID, e.units, w);
return _.set(n, "legend.show", !w && !t.showAverage), n;
};
t.$watch("options", function() {
R = {}, j = null, delete t.metricsError, y();
}, !0), b = e(y, s.getDefaultUpdateInterval(), !1), t.updateInView = function(e) {
I = !e, e && (!P || Date.now() > P + s.getDefaultUpdateInterval()) && y();
};
var A = r.$on("metrics.charts.resize", function() {
s.redraw(C);
});
t.$on("$destroy", function() {
b && (e.cancel(b), b = null), A && (A(), A = null), angular.forEach(C, function(e) {
e.destroy();
}), C = null, k = !0;
});
}
};
} ]), angular.module("openshiftConsole").directive("logViewer", [ "$sce", "$timeout", "$window", "$filter", "$q", "AuthService", "APIService", "APIDiscovery", "DataService", "HTMLService", "ModalsService", "logLinks", "BREAKPOINTS", function(e, t, n, a, r, o, i, s, c, l, u, d) {
var p = $(window), m = $('<tr class="log-line"><td class="log-line-number"></td><td class="log-line-text"></td></tr>').get(0), f = function(e, t) {
var n = m.cloneNode(!0);
n.firstChild.setAttribute("data-line-number", e);
var a = ansi_up.escape_for_html(t), r = ansi_up.ansi_to_html(a), o = l.linkify(r, "_blank", !0);
return n.lastChild.innerHTML = o, n;
};
return {
restrict: "AE",
transclude: !0,
templateUrl: "views/directives/logs/_log-viewer.html",
scope: {
followAffixTop: "=?",
object: "=",
fullLogUrl: "=?",
name: "=",
context: "=",
options: "=?",
fixedHeight: "=?",
chromeless: "=?",
empty: "=?",
run: "=?"
},
controller: [ "$scope", function(t) {
var l, u, m, g = document.documentElement;
t.logViewerID = _.uniqueId("log-viewer"), t.empty = !0;
var h, v;
"ReplicationController" === t.object.kind ? (h = "deploymentconfigs/log", v = a("annotation")(t.object, "deploymentConfig")) : (h = i.kindToResource(t.object.kind) + "/log", v = t.object.metadata.name);
var y, b = function() {
t.$apply(function() {
var e = l.getBoundingClientRect();
t.fixedHeight ? t.showScrollLinks = e && e.height > t.fixedHeight : t.showScrollLinks = e && (e.top < 0 || e.bottom > g.clientHeight);
});
}, C = !1, S = function() {
C ? C = !1 : t.$evalAsync(function() {
t.autoScrollActive = !1;
});
}, w = function() {
u ? $(u).on("scroll", S) : p.on("scroll", S);
}, k = function() {
t.fixedHeight || m.affix({
target: window,
offset: {
top: t.followAffixTop || 0
}
});
}, j = function() {
return $("#" + t.logViewerID + " .log-view-output");
}, P = function(e) {
var n = j(), a = n.offset().top;
if (!(a < 0)) {
var r = $(".ellipsis-pulser").outerHeight(!0), o = t.fixedHeight ? t.fixedHeight : Math.floor($(window).height() - a - r);
t.chromeless || t.fixedHeight || (o -= 40), e ? n.animate({
"min-height": o + "px"
}, "fast") : n.css("min-height", o + "px"), t.fixedHeight && n.css("max-height", o);
}
}, R = function() {
if (!y) {
var e = function() {
clearInterval(y), y = null, t.$evalAsync(function() {
t.sized = !0;
});
}, n = 0;
y = setInterval(function() {
n > 10 ? e() : (n++, j().is(":visible") && (P(), e()));
}, 100);
}
}, I = _.debounce(function() {
P(!0), b(), S();
}, 100);
p.on("resize", I);
var T, N = function() {
C = !0, d.scrollBottom(u);
}, E = document.createDocumentFragment(), D = _.debounce(function() {
l.appendChild(E), E = document.createDocumentFragment(), t.autoScrollActive && N(), t.showScrollLinks || b();
}, 100, {
maxWait: 300
}), A = function(e) {
var t = r.defer();
return T ? (T.onClose(function() {
t.resolve();
}), T.stop()) : t.resolve(), e || (D.cancel(), l && (l.innerHTML = ""), E = document.createDocumentFragment()), t.promise;
}, B = function() {
A().then(function() {
t.$evalAsync(function() {
if (t.run) {
angular.extend(t, {
loading: !0,
autoScrollActive: !0,
largeLog: !1,
limitReached: !1,
showScrollLinks: !1,
state: ""
});
var e = angular.extend({
follow: !0,
tailLines: 5e3,
limitBytes: 10485760
}, t.options), n = 0, a = function(e) {
n++, E.appendChild(f(n, e)), D();
};
(T = c.createStream(h, v, t.context, e)).onMessage(function(r, o, i) {
t.$evalAsync(function() {
t.empty = !1, "logs" !== t.state && (t.state = "logs", R());
}), r && (e.limitBytes && i >= e.limitBytes && (t.$evalAsync(function() {
t.limitReached = !0, t.loading = !1;
}), A(!0)), a(r), !t.largeLog && n >= e.tailLines && t.$evalAsync(function() {
t.largeLog = !0;
}));
}), T.onClose(function() {
T = null, t.$evalAsync(function() {
t.loading = !1, t.autoScrollActive = !1, 0 !== n || t.emptyStateMessage || (t.state = "empty", t.emptyStateMessage = "The logs are no longer available or could not be loaded.");
});
}), T.onError(function() {
T = null, t.$evalAsync(function() {
angular.extend(t, {
loading: !1,
autoScrollActive: !1
}), 0 === n ? (t.state = "empty", t.emptyStateMessage = "The logs are no longer available or could not be loaded.") : t.errorWhileRunning = !0;
});
}), T.start();
}
});
});
};
if (s.getLoggingURL(t.context.project).then(function(a) {
var r = _.get(t.context, "project.metadata.name"), i = _.get(t.options, "container");
r && i && v && a && (angular.extend(t, {
kibanaAuthUrl: e.trustAsResourceUrl(URI(a).segment("auth").segment("token").normalizePathname().toString()),
access_token: o.UserStore().getToken()
}), t.$watchGroup([ "context.project.metadata.name", "options.container", "name" ], function() {
angular.extend(t, {
kibanaArchiveUrl: e.trustAsResourceUrl(d.archiveUri({
namespace: t.context.project.metadata.name,
namespaceUid: t.context.project.metadata.uid,
podname: v,
containername: t.options.container,
backlink: URI.encode(n.location.href)
}))
});
}));
}), this.cacheScrollableNode = function(e) {
u = e;
}, this.cacheLogNode = function(e) {
l = e;
}, this.cacheAffixable = function(e) {
m = $(e);
}, this.start = function() {
w(), k();
}, angular.extend(t, {
ready: !0,
loading: !0,
autoScrollActive: !0,
state: !1,
onScrollBottom: function() {
d.scrollBottom(u);
},
onScrollTop: function() {
t.autoScrollActive = !1, d.scrollTop(u), $("#" + t.logViewerID + "-affixedFollow").affix("checkPosition");
},
toggleAutoScroll: function() {
t.autoScrollActive = !t.autoScrollActive, t.autoScrollActive && N();
},
goChromeless: d.chromelessLink,
restartLogs: B
}), t.$on("$destroy", function() {
A(), p.off("resize", I), p.off("scroll", S), u && $(u).off("scroll", S);
}), "deploymentconfigs/logs" === h && !v) return t.state = "empty", void (t.emptyStateMessage = "Logs are not available for this replication controller because it was not generated from a deployment configuration.");
t.$watchGroup([ "name", "options.container", "run" ], B);
} ],
require: "logViewer",
link: function(e, n, a, r) {
t(function() {
e.fixedHeight && r.cacheScrollableNode(document.getElementById(e.logViewerID + "-fixed-scrollable")), r.cacheLogNode(document.getElementById(e.logViewerID + "-logContent")), r.cacheAffixable(document.getElementById(e.logViewerID + "-affixedFollow")), r.start();
}, 0);
var o = function() {
var t = $(n).find(".log-line-text").text(), a = _.get(e, "object.metadata.name", "openshift") + ".log", r = new Blob([ t ], {
type: "text/plain;charset=utf-8"
});
saveAs(r, a);
};
e.canSave = !!new Blob(), e.saveLog = function() {
e.largeLog ? u.confirmSaveLog(e.object).then(o) : o();
};
}
};
} ]), angular.module("openshiftConsole").directive("statusIcon", function() {
return {
restrict: "E",
templateUrl: "views/directives/_status-icon.html",
scope: {
status: "=",
disableAnimation: "@"
},
link: function(e, t, n) {
e.spinning = !angular.isDefined(n.disableAnimation);
}
};
}), angular.module("openshiftConsole").directive("ellipsisPulser", [ function() {
return {
restrict: "E",
scope: {
color: "@",
display: "@",
size: "@",
msg: "@"
},
templateUrl: "views/directives/_ellipsis-pulser.html"
};
} ]), angular.module("openshiftConsole").directive("podDonut", [ "$timeout", "isPullingImageFilter", "isTerminatingFilter", "podWarningsFilter", "numContainersReadyFilter", "Logger", "ChartsService", function(e, t, n, a, r, o, i) {
return {
restrict: "E",
scope: {
pods: "=",
desired: "=?",
idled: "=?",
mini: "=?"
},
templateUrl: "views/directives/pod-donut.html",
link: function(e, o) {
function s() {
var t = _.reject(e.pods, {
status: {
phase: "Failed"
}
}), n = _.size(t);
if (e.mini) e.$evalAsync(function() {
e.total = n;
}); else {
var a;
a = angular.isNumber(e.desired) && e.desired !== n ? "scaling to " + e.desired + "..." : 1 === n ? "pod" : "pods", e.idled ? i.updateDonutCenterText(o[0], "Idle") : i.updateDonutCenterText(o[0], n, a);
}
}
function c(e) {
return r(e) === _.size(e.spec.containers);
}
function l(e) {
if (n(e)) return "Terminating";
var r = a(e);
return _.some(r, {
severity: "error"
}) ? "Error" : _.isEmpty(r) ? t(e) ? "Pulling" : "Running" !== e.status.phase || c(e) ? _.get(e, "status.phase", "Unknown") : "Not Ready" : "Warning";
}
var u, d, p = [ "Running", "Not Ready", "Warning", "Error", "Pulling", "Pending", "Succeeded", "Terminating", "Unknown" ];
e.chartId = _.uniqueId("pods-donut-chart-"), d = {
type: "donut",
bindto: "#" + e.chartId,
donut: {
expand: !1,
label: {
show: !1
},
width: e.mini ? 5 : 10
},
size: {
height: e.mini ? 45 : 150,
width: e.mini ? 45 : 150
},
legend: {
show: !1
},
onrendered: s,
tooltip: {
format: {
value: function(e, t, n) {
if (e && "Empty" !== n) return e;
}
}
},
transition: {
duration: 350
},
data: {
type: "donut",
groups: [ p ],
order: null,
colors: {
Empty: "#ffffff",
Running: "#00b9e4",
"Not Ready": "#beedf9",
Warning: "#f39d3c",
Error: "#d9534f",
Pulling: "#d1d1d1",
Pending: "#ededed",
Succeeded: "#3f9c35",
Terminating: "#00659c",
Unknown: "#f9d67a"
},
selection: {
enabled: !1
}
}
}, e.mini && (d.padding = {
top: 0,
right: 0,
bottom: 0,
left: 0
});
var m = _.debounce(function(t) {
var n = {
columns: []
};
angular.forEach(p, function(e) {
n.columns.push([ e, t[e] || 0 ]);
}), _.isEmpty(t) ? n.columns.push([ "Empty", 1 ]) : n.unload = "Empty", u ? u.load(n) : (d.data.columns = n.columns, u = c3.generate(d)), e.podStatusData = n.columns;
}, 350, {
maxWait: 500
});
e.$watch(function() {
var t = {};
return angular.forEach(e.pods, function(e) {
var n = l(e);
t[n] = (t[n] || 0) + 1;
}), t;
}, m, !0), e.$watchGroup([ "desired", "idled" ], s), e.$on("destroy", function() {
u && (u = u.destroy());
});
}
};
} ]), angular.module("openshiftConsole").directive("routeServicePie", function() {
return {
restrict: "E",
scope: {
route: "="
},
template: '<div ng-show="totalWeight" ng-attr-id="{{chartId}}"></div>',
link: function(e) {
var t, n, a = window.matchMedia("(max-width: 400px)").matches;
e.chartId = _.uniqueId("route-service-chart-"), n = {
bindto: "#" + e.chartId,
color: {
pattern: [ $.pfPaletteColors.blue, $.pfPaletteColors.orange, $.pfPaletteColors.green, $.pfPaletteColors.red ]
},
legend: {
show: !0,
position: a ? "bottom" : "right"
},
pie: {
label: {
show: !1
}
},
size: {
height: a ? 150 : 115
},
tooltip: {
format: {
name: function(e, t, n) {
return n;
}
}
},
data: {
type: "pie",
order: null,
selection: {
enabled: !1
}
}
};
var r, o = function(e) {
return [ e.name, e.weight ];
}, i = function(e) {
return _.head(e);
}, s = function(e) {
var t = {};
_.each(e.columns, function(e) {
var n = i(e);
t[n] = !0;
});
var n = _.get(r, "columns", []);
e.unload = _.chain(n).reject(function(e) {
var n = i(e);
return _.has(t, [ n ]);
}).map(i).value();
};
e.$watch("route", function() {
var a = {
columns: [],
names: {}
};
e.route && (a.columns.push(o(e.route.spec.to)), a.names[e.route.spec.to.name] = _.truncate(e.route.spec.to.name, {
length: 30
}), e.totalWeight = e.route.spec.to.weight, _.each(e.route.spec.alternateBackends, function(t) {
a.columns.push(o(t)), a.names[t.name] = _.truncate(t.name, {
length: 30
}), e.totalWeight += t.weight;
})), e.totalWeight && (t ? (s(a), t.load(a)) : (n.data.columns = a.columns, t = c3.generate(n)), r = a);
}), e.$on("destroy", function() {
t && (t = t.destroy());
});
}
};
}), angular.module("openshiftConsole").directive("deploymentDonut", [ "$filter", "$location", "$timeout", "$uibModal", "DeploymentsService", "HPAService", "QuotaService", "LabelFilter", "Navigate", "NotificationsService", "hashSizeFilter", "hasDeploymentConfigFilter", function(e, t, n, a, r, o, i, s, c, l, u, d) {
return {
restrict: "E",
scope: {
rc: "=",
deploymentConfig: "=",
deployment: "=",
scalable: "=",
hpa: "=?",
limitRanges: "=",
quotas: "=",
clusterQuotas: "=",
project: "=",
pods: "="
},
templateUrl: "views/directives/deployment-donut.html",
controller: [ "$scope", "$filter", "$q", function(e, t, n) {
var s = !1, u = t("humanizeKind");
e.$watch("rc.spec.replicas", function() {
s || (e.desiredReplicas = null);
});
var p = function() {
o.getHPAWarnings(e.rc, e.hpa, e.limitRanges, e.project).then(function(t) {
e.hpaWarnings = _.map(t, function(e) {
return _.escape(e.message);
}).join("<br>");
});
};
e.$watchGroup([ "limitRanges", "hpa", "project" ], p), e.$watch("rc.spec.template.spec.containers", p, !0);
e.$watchGroup([ "rc.spec.replicas", "rc.status.replicas", "quotas", "clusterQuotas" ], function() {
if (_.get(e.rc, "spec.replicas", 1) > _.get(e.rc, "status.replicas", 0)) {
var t = i.filterQuotasForResource(e.rc, e.quotas), n = i.filterQuotasForResource(e.rc, e.clusterQuotas), a = function(t) {
return !_.isEmpty(i.getResourceLimitAlerts(e.rc, t));
};
e.showQuotaWarning = _.some(t, a) || _.some(n, a);
} else e.showQuotaWarning = !1;
});
var m = function() {
return e.deploymentConfig || e.deployment || e.rc;
}, f = function() {
if (s = !1, angular.isNumber(e.desiredReplicas)) {
var a = m();
return r.scale(a, e.desiredReplicas).then(_.noop, function(e) {
var r = u(a.kind);
return l.addNotification({
id: "deployment-scale-error",
type: "error",
message: "An error occurred scaling " + r + " " + a.metadata.name + ".",
details: t("getErrorDetails")(e)
}), n.reject(e);
});
}
}, g = _.debounce(f, 650);
e.viewPodsForDeployment = function(t) {
_.isEmpty(e.pods) || c.toPodsForDeployment(t, e.pods);
}, e.scaleUp = function() {
e.scalable && (e.desiredReplicas = e.getDesiredReplicas(), e.desiredReplicas++, g(), s = !0);
}, e.scaleDown = function() {
e.scalable && (e.desiredReplicas = e.getDesiredReplicas(), 0 !== e.desiredReplicas && (1 !== e.desiredReplicas ? (e.desiredReplicas--, g()) : a.open({
animation: !0,
templateUrl: "views/modals/confirmScale.html",
controller: "ConfirmScaleController",
resolve: {
resource: function() {
return e.rc;
},
type: function() {
return d(e.rc) ? "deployment" : "replication controller";
}
}
}).result.then(function() {
e.desiredReplicas = e.getDesiredReplicas() - 1, g(), s = !0;
})));
}, e.getDesiredReplicas = function() {
return angular.isDefined(e.desiredReplicas) && null !== e.desiredReplicas ? e.desiredReplicas : e.rc && e.rc.spec && angular.isDefined(e.rc.spec.replicas) ? e.rc.spec.replicas : 1;
}, e.$watch(function() {
return !_.get(e.rc, "spec.replicas") && !!(e.deploymentConfig ? t("annotation")(e.deploymentConfig, "idledAt") : t("annotation")(e.rc, "idledAt"));
}, function(t) {
e.isIdled = !!t;
}), e.unIdle = function() {
e.desiredReplicas = t("unidleTargetReplicas")(e.deploymentConfig || e.rc, e.hpa), f().then(function() {
e.isIdled = !1;
});
};
} ]
};
} ]), angular.module("openshiftConsole").directive("quotaUsageChart", [ "$filter", "ChartsService", function(e, t) {
return {
restrict: "E",
scope: {
used: "=",
crossProjectUsed: "=?",
total: "=",
type: "@",
height: "=?",
width: "=?"
},
replace: !0,
templateUrl: "views/_quota-usage-chart.html",
link: function(n, a) {
var r = e("usageValue"), o = e("usageWithUnits"), i = e("amountAndUnit");
n.height = n.height || 200, n.width = n.width || 175;
var s = function(e) {
return e ? (100 * Number(e)).toFixed(1) + "%" : "0%";
};
n.chartID = _.uniqueId("quota-usage-chart-");
var c, l = {
type: "donut",
bindto: "#" + n.chartID,
donut: {
label: {
show: !1
},
width: 10
},
size: {
height: n.height,
width: n.width
},
legend: {
show: !0,
position: n.legendPosition || "bottom",
item: {
onclick: _.noop
}
},
onrendered: function() {
_.spread(function(e, n) {
t.updateDonutCenterText(a[0], e, n);
})(i(n.total, n.type, !0));
},
tooltip: {
position: function() {
return {
top: 0,
left: 0
};
},
contents: function(e, t, a, i) {
var c = $('<table class="c3-tooltip"></table>').css({
width: n.width + "px"
}), l = $("<tr/>").appendTo(c), u = $('<td class="name nowrap"></td>').appendTo(l);
$("<span/>").css({
"background-color": i(e[0].id)
}).appendTo(u), $("<span/>").text(e[0].name).appendTo(u);
var d;
d = n.total ? s(e[0].value / r(n.total)) + " of " + o(n.total, n.type) : o(n.used, n.type);
var p = $("<tr/>").appendTo(c);
return $('<td class="value" style="text-align: left;"></td>').text(d).appendTo(p), c.get(0).outerHTML;
}
},
data: {
type: "donut",
order: null
}
};
n.$watchGroup([ "used", "total", "crossProjectUsed" ], _.debounce(function() {
var e = void 0 !== n.crossProjectUsed, t = r(n.used) || 0, a = Math.max((r(n.crossProjectUsed) || 0) - t, 0), o = Math.max(r(n.total) - (a + t), 0), i = {
columns: [ [ "used", t ], [ "available", o ] ],
colors: {
used: o ? "#0088ce" : "#ec7a08",
other: o ? "#7dc3e8" : "#f7bd7f",
available: "#d1d1d1"
},
names: {
used: e ? "Used - This Project" : "Used",
other: "Used - Other Projects",
available: "Available"
}
};
e && i.columns.splice(1, 0, [ "other", a ]), c ? c.load(i) : (_.assign(l.data, i), c = c3.generate(l));
}, 300));
}
};
} ]), angular.module("openshiftConsole").directive("buildTrendsChart", [ "$filter", "$location", "$rootScope", "$timeout", "BuildsService", function(e, t, n, a, r) {
return {
restrict: "E",
scope: {
builds: "="
},
templateUrl: "views/_build-trends-chart.html",
link: function(o) {
var i, s = [ "Complete", "Failed", "Cancelled", "Error" ];
o.minBuilds = _.constant(4);
var c = function(e) {
var t = [], n = moment.duration(e), a = Math.floor(n.asHours()), r = n.minutes(), o = n.seconds();
return a || r || o ? (a && t.push(a + "h"), r && t.push(r + "m"), a || t.push(o + "s"), t.join(" ")) : "";
};
o.chartID = _.uniqueId("build-trends-chart-");
var l, u, d = _.constant(350), p = {
bindto: "#" + o.chartID,
padding: {
right: 30,
left: 80
},
axis: {
x: {
fit: !0,
label: {
text: "Build Number",
position: "outer-right"
},
tick: {
culling: !0,
format: function(e) {
return "#" + i.json[e].buildNumber;
},
width: 30
},
type: "category"
},
y: {
label: {
text: "Duration",
position: "outer-top"
},
min: 0,
padding: {
bottom: 0
},
tick: {
format: c
}
}
},
bar: {
width: {
max: 50
}
},
legend: {
item: {
onclick: _.noop
}
},
size: {
height: 250
},
tooltip: {
format: {
title: function(e) {
var t = i.json[e], n = r.getStartTimestsamp(t.build);
return "#" + t.buildNumber + " (" + moment(n).fromNow() + ")";
}
}
},
transition: {
duration: d()
},
data: {
colors: {
Cancelled: "#d1d1d1",
Complete: "#00b9e4",
Error: "#393f44",
Failed: "#cc0000"
},
empty: {
label: {
text: "No Completed Builds"
}
},
onclick: function(a) {
var r = i.json[a.x].build, o = e("navigateResourceURL")(r);
o && n.$apply(function() {
t.path(o);
});
},
selection: {
enabled: !0
},
type: "bar"
}
}, m = function() {
o.completeBuilds = [];
var t = e("isIncompleteBuild");
angular.forEach(o.builds, function(e) {
t(e) || o.completeBuilds.push(e);
});
}, f = !1, g = function() {
u && f ? l.ygrids([ {
value: u,
class: "build-trends-avg-line"
} ]) : l.ygrids.remove();
};
o.toggleAvgLine = function() {
f = !f, g();
};
o.$watch(function() {
return m(), o.completeBuilds.length;
}, function() {
i = {
json: [],
keys: {
x: "buildNumber"
}
};
var e = 0, t = 0;
angular.forEach(o.completeBuilds, function(n) {
var a = r.getBuildNumber(n);
if (a) {
var o = r.getDuration(n);
e += o, t++;
var s = {
buildNumber: a,
phase: n.status.phase,
build: n
};
s[n.status.phase] = o, i.json.push(s);
}
}), i.json.sort(function(e, t) {
return e.buildNumber - t.buildNumber;
}), i.json.length > 50 && (i.json = i.json.slice(i.json.length - 50));
var n = {};
angular.forEach(i.json, function(e) {
n[e.phase] = !0;
}), t ? (u = e / t, o.averageDurationText = c(u)) : (u = null, o.averageDurationText = null);
var m = [], f = [];
angular.forEach(s, function(e) {
n[e] ? m.push(e) : f.push(e);
}), i.keys.value = m, i.groups = [ m ], l ? (i.unload = f, i.done = function() {
setTimeout(function() {
l.flush();
}, d() + 25);
}, l.load(i), g()) : (p.data = angular.extend(i, p.data), a(function() {
l = c3.generate(p), g();
}));
}), o.$on("destroy", function() {
l && (l = l.destroy());
});
}
};
} ]), angular.module("openshiftConsole").directive("computeResource", [ "$filter", function(e) {
return {
restrict: "E",
require: "ngModel",
scope: {
label: "@",
type: "@",
description: "@",
defaultValue: "=",
limitRangeMin: "=",
limitRangeMax: "=",
maxLimitRequestRatio: "=",
request: "="
},
templateUrl: "views/_compute-resource.html",
link: function(t, n, a, r) {
var o = e("usageValue"), i = e("amountAndUnit"), s = e("humanizeUnit");
t.id = _.uniqueId("compute-resource-"), t.input = {};
var c = function(e) {
_.some(t.units, {
value: e
}) || t.units.push({
value: e,
label: s(e, t.type)
});
};
switch (t.$watch("defaultValue", function(e) {
var n = _.spread(function(e, n) {
t.placeholder = e, c(n), t.input.amount || (t.input.unit = n);
});
e && n(i(e, t.type));
}), t.type) {
case "cpu":
t.input.unit = "m", t.units = [ {
value: "m",
label: "millicores"
}, {
value: "",
label: "cores"
} ];
break;

case "memory":
t.input.unit = "Mi", t.units = [ {
value: "Mi",
label: "MiB"
}, {
value: "Gi",
label: "GiB"
}, {
value: "M",
label: "MB"
}, {
value: "G",
label: "GB"
} ];
}
t.groupUnits = function(e) {
switch (e.value) {
case "Mi":
case "Gi":
return "Binary Units";

case "M":
case "G":
return "Decimal Units";
}
return "";
};
var l = function() {
var e = t.input.amount && o(t.input.amount + t.input.unit), n = t.limitRangeMin && o(t.limitRangeMin), a = t.limitRangeMax && o(t.limitRangeMax), r = !0, i = !0;
e && n && (r = e >= n), e && a && (i = e <= a), t.form.amount.$setValidity("limitRangeMin", r), t.form.amount.$setValidity("limitRangeMax", i);
}, u = function() {
var e, n = t.request && o(t.request), a = !0, r = !0;
t.input.amount ? e = o(t.input.amount + t.input.unit) : t.defaultValue && (e = o(t.defaultValue)), n && e && (a = e >= n, t.maxLimitRequestRatio && (r = e / n <= t.maxLimitRequestRatio)), n && !e && t.maxLimitRequestRatio && (r = !1), t.form.amount.$setValidity("limitLargerThanRequest", a), t.form.amount.$setValidity("limitWithinRatio", r);
};
r.$render = function() {
_.spread(function(e, n) {
e ? (t.input.amount = Number(e), t.input.unit = n, c(n)) : t.input.amount = null;
})(i(r.$viewValue, t.type));
}, t.$watchGroup([ "input.amount", "input.unit" ], function() {
l(), u(), t.input.amount ? r.$setViewValue(t.input.amount + t.input.unit) : r.$setViewValue(void 0);
}), t.$watchGroup([ "limitRangeMin", "limitRangeMax" ], l), t.$watch("request", u);
}
};
} ]).directive("editRequestLimit", [ "$filter", "LimitRangesService", "ModalsService", function(e, t, n) {
return {
restrict: "E",
scope: {
resources: "=",
type: "@",
limitRanges: "=",
project: "="
},
templateUrl: "views/_edit-request-limit.html",
link: function(e) {
e.showComputeUnitsHelp = function() {
n.showComputeUnitsHelp();
}, e.$watch("limitRanges", function() {
e.limits = t.getEffectiveLimitRange(e.limitRanges, e.type, "Container", e.project), e.requestCalculated = t.isRequestCalculated(e.type, e.project), e.limitCalculated = t.isLimitCalculated(e.type, e.project);
}, !0);
}
};
} ]), angular.module("openshiftConsole").directive("editProbe", function() {
return {
restrict: "E",
scope: {
probe: "=",
exposedPorts: "="
},
templateUrl: "views/directives/_edit-probe.html",
link: function(e) {
e.id = _.uniqueId("edit-probe-"), e.probe = e.probe || {}, e.types = [ {
id: "httpGet",
label: "HTTP GET"
}, {
id: "exec",
label: "Container Command"
}, {
id: "tcpSocket",
label: "TCP Socket"
} ], e.previousProbes = {}, e.tcpPorts = _.filter(e.exposedPorts, {
protocol: "TCP"
});
var t = _.get(e, "probe.httpGet.port") || _.get(e, "probe.exec.port");
t && !_.some(e.tcpPorts, {
containerPort: t
}) && (e.tcpPorts = [ {
containerPort: t,
protocol: "TCP"
} ].concat(e.tcpPorts)), e.portOptions = e.tcpPorts;
var n, a = function(t, n) {
if (e.probe = e.probe || {}, e.previousProbes[n] = e.probe[n], delete e.probe[n], e.probe[t] = e.previousProbes[t], !e.probe[t]) switch (t) {
case "httpGet":
case "tcpSocket":
var a = _.head(e.tcpPorts);
e.probe[t] = {
port: a ? a.containerPort : ""
};
break;

case "exec":
e.probe = {
exec: {
command: []
}
};
}
};
e.probe.httpGet ? n = "httpGet" : e.probe.exec ? n = "exec" : e.probe.tcpSocket ? n = "tcpSocket" : (n = "httpGet", a("httpGet")), _.set(e, "selected.type", n), e.$watch("selected.type", function(e, t) {
e !== t && a(e, t);
}), e.refreshPorts = function(t) {
if (/^\d+$/.test(t)) {
var n = e.tcpPorts;
(t = parseInt(t, 10)) && !_.some(n, {
containerPort: t
}) && (n = [ {
containerPort: t,
protocol: "TCP"
} ].concat(n)), e.portOptions = _.uniq(n);
}
};
}
};
}), angular.module("openshiftConsole").directive("editCommand", [ "$filter", function(e) {
return {
restrict: "E",
scope: {
args: "=",
type: "@",
placeholder: "@",
description: "=",
isRequired: "="
},
templateUrl: "views/directives/_edit-command.html",
link: function(t) {
t.id = _.uniqueId("edit-command-"), t.input = {};
var n, a, r = e("isMultiline");
t.$watch("args", function() {
a ? a = !1 : _.isEmpty(t.args) || (t.input.args = _.map(t.args, function(e) {
return {
value: e,
multiline: r(e)
};
}), n = !0);
}, !0), t.$watch("input.args", function(e, r) {
n ? n = !1 : e !== r && (a = !0, t.args = _.map(t.input.args, function(e) {
return e.value;
}), t.form.command.$setDirty());
}, !0), t.addArg = function() {
t.nextArg && (t.input.args = t.input.args || [], t.input.args.push({
value: t.nextArg,
multiline: r(t.nextArg)
}), t.nextArg = "");
}, t.removeArg = function(e) {
t.input.args.splice(e, 1), _.isEmpty(t.input.args) && (t.input.args = null);
}, t.clear = function() {
t.input.args = null;
};
}
};
} ]), angular.module("openshiftConsole").directive("buildPipeline", [ "$filter", "Logger", function(e, t) {
return {
restrict: "E",
scope: {
build: "=",
expandOnlyRunning: "=?",
collapsePending: "=?",
buildConfigNameOnExpanded: "=?"
},
replace: !0,
templateUrl: "views/directives/build-pipeline.html",
link: function(n) {
var a = e("annotation");
n.$watch(function() {
return a(n.build, "jenkinsStatus");
}, function(e) {
if (e) try {
n.jenkinsStatus = JSON.parse(e);
} catch (n) {
t.error("Could not parse Jenkins status as JSON", e);
}
});
var r = e("buildConfigForBuild");
n.$watch(function() {
return r(n.build);
}, function(e) {
n.buildConfigName = e;
});
}
};
} ]).directive("pipelineStatus", function() {
return {
restrict: "E",
scope: {
status: "="
},
templateUrl: "views/directives/pipeline-status.html"
};
}), angular.module("openshiftConsole").directive("buildStatus", function() {
return {
restrict: "E",
scope: {
build: "="
},
templateUrl: "views/directives/build-status.html"
};
}), function() {
angular.module("openshiftConsole").component("routeServiceBarChart", {
controller: function() {
var e = this, t = function(t, n) {
return t.name === e.highlightService ? -1 : n.name === e.highlightService ? 1 : n.weight === t.weight ? t.name.localeCompare(n.name) : n.weight - t.weight;
}, n = function(t) {
e.total += t.weight, e.max = Math.max(t.weight, e.max || 0), e.backends.push({
name: t.name,
weight: t.weight
});
};
e.$onChanges = function() {
if (e.backends = [], e.total = 0, e.route) {
n(e.route.spec.to);
var a = _.get(e, "route.spec.alternateBackends", []);
_.each(a, n), e.backends.sort(t);
}
}, e.getPercentage = function(t) {
var n = e.total || 100, a = t.weight / n * 100;
return _.round(a) + "%";
}, e.barWidth = function(t) {
var n = e.max || 100;
return t.weight / n * 100 + "%";
};
},
controllerAs: "routeServices",
bindings: {
route: "<",
highlightService: "<"
},
templateUrl: "views/directives/route-service-bar-chart.html"
});
}(), function() {
angular.module("openshiftConsole").component("bindService", {
controller: [ "$scope", "$filter", "ApplicationsService", "DataService", "BindingService", function(e, t, n, a, r) {
var o, i, s, c, l, u, d = this, p = t("statusCondition"), m = t("enableTechPreviewFeature"), f = function() {
var e, t;
_.each(d.serviceInstances, function(n) {
var a = "True" === _.get(p(n, "Ready"), "status");
a && (!e || n.metadata.creationTimestamp > e.metadata.creationTimestamp) && (e = n), a || t && !(n.metadata.creationTimestamp > t.metadata.creationTimestamp) || (t = n);
}), d.serviceToBind = e || t;
}, g = function() {
d.serviceClasses && d.serviceInstances && (d.serviceInstances = r.filterBindableServiceInstances(d.serviceInstances, d.serviceClasses), d.orderedServiceInstances = r.sortServiceInstances(d.serviceInstances, d.serviceClasses), d.serviceToBind || f());
}, h = function() {
var e = {
namespace: _.get(d.target, "metadata.namespace")
};
n.getApplications(e).then(function(e) {
d.applications = e, d.bindType = d.applications.length ? "application" : "secret-only";
});
}, v = function() {
var e = {
namespace: _.get(d.target, "metadata.namespace")
};
a.list({
group: "servicecatalog.k8s.io",
resource: "serviceinstances"
}, e).then(function(e) {
d.serviceInstances = e.by("metadata.name"), g();
});
};
o = {
id: "bindForm",
label: "Binding",
view: "views/directives/bind-service/bind-service-form.html",
valid: !0,
allowClickNav: !0,
onShow: function() {
d.nextTitle = i.hidden ? "Bind" : "Next >", d.podPresets && !c && (c = e.$watch("ctrl.selectionForm.$valid", function(e) {
o.valid = e;
}));
}
}, i = {
id: "bindParameters",
label: "Parameters",
view: "views/directives/bind-service/bind-parameters.html",
hidden: !0,
allowClickNav: !0,
onShow: function() {
d.nextTitle = "Bind", l || (l = e.$watch("ctrl.parametersForm.$valid", function(e) {
i.valid = e;
}));
}
}, s = {
id: "results",
label: "Results",
view: "views/directives/bind-service/results.html",
valid: !0,
allowClickNav: !1,
onShow: function() {
c && (c(), c = void 0), l && (l(), l = void 0), d.nextTitle = "Close", d.wizardComplete = !0, d.bindService();
}
};
var y = function() {
if (d.serviceClasses) {
var e = "ServiceInstance" === d.target.kind ? d.target : d.serviceToBind;
e && (d.serviceClass = d.serviceClasses[e.spec.serviceClassName], d.serviceClassName = e.spec.serviceClassName, d.plan = r.getPlanForInstance(e, d.serviceClass), d.parameterSchema = _.get(d.plan, "serviceInstanceCredentialCreateParameterSchema"), i.hidden = !_.has(d.parameterSchema, "properties"), d.nextTitle = i.hidden ? "Bind" : "Next >", d.hideBack = i.hidden);
}
};
e.$watch("ctrl.serviceToBind", y), d.$onInit = function() {
d.serviceSelection = {}, d.projectDisplayName = t("displayName")(d.project), d.podPresets = m("pod_presets"), d.parameterData = {}, d.steps = [ o, i, s ], d.hideBack = i.hidden, a.list({
group: "servicecatalog.k8s.io",
resource: "serviceclasses"
}, {}).then(function(e) {
d.serviceClasses = e.by("metadata.name"), y(), g();
}), "ServiceInstance" === d.target.kind ? (d.bindType = "secret-only", d.appToBind = null, d.serviceToBind = d.target, d.podPresets && h()) : (d.bindType = "application", d.appToBind = d.target, v());
}, d.$onChanges = function(e) {
e.project && !e.project.isFirstChange() && (d.projectDisplayName = t("displayName")(d.project));
}, d.$onDestroy = function() {
c && (c(), c = void 0), l && (l(), l = void 0), u && a.unwatch(u);
}, d.bindService = function() {
var e = "ServiceInstance" === d.target.kind ? d.target : d.serviceToBind, t = "application" === d.bindType ? d.appToBind : void 0, n = {
namespace: _.get(e, "metadata.namespace")
}, o = r.getServiceClassForInstance(e, d.serviceClasses);
r.bindService(e, t, o, d.parameterData).then(function(e) {
d.binding = e, d.error = null, u = a.watchObject(r.bindingResource, _.get(d.binding, "metadata.name"), n, function(e) {
d.binding = e;
});
}, function(e) {
d.error = e;
});
}, d.closeWizard = function() {
_.isFunction(d.onClose) && d.onClose();
};
} ],
controllerAs: "ctrl",
bindings: {
target: "<",
project: "<",
onClose: "<"
},
templateUrl: "views/directives/bind-service.html"
});
}(), function() {
angular.module("openshiftConsole").component("unbindService", {
controller: [ "$scope", "$filter", "DataService", function(e, t, n) {
var a, r, o = this, i = t("enableTechPreviewFeature"), s = t("serviceInstanceDisplayName"), c = function() {
var e = o.selectedBinding.metadata.name;
o.unboundApps = o.appsForBinding(e), n.delete({
group: "servicecatalog.k8s.io",
resource: "serviceinstancecredentials"
}, e, r, {
propagationPolicy: null
}).then(_.noop, function(e) {
o.error = e;
});
}, l = function() {
var t = _.head(o.steps);
t.valid = !1, a = e.$watch("ctrl.selectedBinding", function(e) {
t.valid = !!e;
});
}, u = function() {
a && (a(), a = void 0);
}, d = function() {
o.nextTitle = "Delete", l();
}, p = function() {
o.nextTitle = "Close", o.wizardComplete = !0, c(), u();
};
o.$onInit = function() {
var e;
e = "ServiceInstance" === o.target.kind ? i("pod_presets") ? "Applications" : "Bindings" : "Services", o.displayName = s(o.target), o.steps = [ {
id: "deleteForm",
label: e,
view: "views/directives/bind-service/delete-binding-select-form.html",
onShow: d
}, {
id: "results",
label: "Results",
view: "views/directives/bind-service/delete-binding-result.html",
onShow: p
} ], r = {
namespace: _.get(o.target, "metadata.namespace")
};
}, o.appsForBinding = function(e) {
return _.get(o.applicationsByBinding, e);
}, o.closeWizard = function() {
_.isFunction(o.onClose) && o.onClose();
}, o.$onDestroy = function() {
u();
};
} ],
controllerAs: "ctrl",
bindings: {
target: "<",
bindings: "<",
applicationsByBinding: "<",
onClose: "<"
},
templateUrl: "views/directives/unbind-service.html"
});
}(), function() {
angular.module("openshiftConsole").component("processTemplate", {
controller: [ "$filter", "$q", "$scope", "$uibModal", "DataService", "Navigate", "NotificationsService", "ProcessedTemplateService", "ProjectsService", "QuotaService", "SecurityCheckService", "TaskList", "keyValueEditorUtils", function(e, t, n, a, r, o, i, s, c, l, u, d, p) {
function m(e) {
var t = /^helplink\.(.*)\.title$/, n = /^helplink\.(.*)\.url$/, a = {};
for (var r in e.annotations) {
var o, i = r.match(t);
i ? ((o = a[i[1]] || {}).title = e.annotations[r], a[i[1]] = o) : (i = r.match(n)) && ((o = a[i[1]] || {}).url = e.annotations[r], a[i[1]] = o);
}
return a;
}
function f() {
h.prefillParameters && _.each(h.template.parameters, function(e) {
h.prefillParameters[e.name] && (e.value = h.prefillParameters[e.name]);
}), h.labels = _.map(h.template.labels, function(e, t) {
return {
name: t,
value: e
};
}), R() && h.labels.push({
name: "app",
value: h.template.metadata.name
});
}
var g, h = this, v = e("displayName"), y = e("humanize");
h.$onInit = function() {
h.labels = [], h.template = angular.copy(h.template), h.templateDisplayName = v(h.template), h.selectedProject = h.project, f();
};
var b, C = function() {
var e = {
started: "Creating " + h.templateDisplayName + " in project " + v(h.selectedProject),
success: "Created " + h.templateDisplayName + " in project " + v(h.selectedProject),
failure: "Failed to create " + h.templateDisplayName + " in project " + v(h.selectedProject)
}, a = m(h.template);
d.clear(), d.add(e, a, h.selectedProject.metadata.name, function() {
var e = t.defer();
return r.batch(b, g).then(function(t) {
var n = [], a = !1;
t.failure.length > 0 ? (a = !0, t.failure.forEach(function(e) {
n.push({
type: "error",
message: "Cannot create " + y(e.object.kind).toLowerCase() + ' "' + e.object.metadata.name + '". ',
details: e.data.message
});
}), t.success.forEach(function(e) {
n.push({
type: "success",
message: "Created " + y(e.kind).toLowerCase() + ' "' + e.metadata.name + '" successfully. '
});
})) : n.push({
type: "success",
message: "All items in template " + h.templateDisplayName + " were created successfully."
}), e.resolve({
alerts: n,
hasErrors: a
});
}), e.promise;
}), h.isDialog ? n.$emit("templateInstantiated", {
project: h.selectedProject,
template: h.template
}) : o.toNextSteps(h.templateDisplayName, h.selectedProject.metadata.name);
}, S = function(e) {
a.open({
animation: !0,
templateUrl: "views/modals/confirm.html",
controller: "ConfirmModalController",
resolve: {
modalConfig: function() {
return {
alerts: e,
message: "We checked your application for potential problems. Please confirm you still want to create this application.",
okButtonText: "Create Anyway",
okButtonClass: "btn-danger",
cancelButtonText: "Cancel"
};
}
}
}).result.then(C);
}, w = {}, k = function() {
i.hideNotification("process-template-error"), _.each(w, function(e) {
!e.id || "error" !== e.type && "warning" !== e.type || i.hideNotification(e.id);
});
}, j = function(e) {
k(), w = u.getSecurityAlerts(b, h.selectedProject.metadata.name);
var t = e.quotaAlerts || [];
w = w.concat(t), _.filter(w, {
type: "error"
}).length ? (h.disableInputs = !1, _.each(w, function(e) {
e.id = _.uniqueId("process-template-alert-"), i.addNotification(e);
})) : w.length ? (S(w), h.disableInputs = !1) : C();
}, P = function() {
if (_.has(h.selectedProject, "metadata.uid")) return t.when(h.selectedProject);
var n = h.selectedProject.metadata.name, a = h.selectedProject.metadata.annotations["new-display-name"], r = e("description")(h.selectedProject);
return c.create(n, a, r);
};
h.createFromTemplate = function() {
h.disableInputs = !0, P().then(function(e) {
h.selectedProject = e, g = {
namespace: h.selectedProject.metadata.name
}, h.template.labels = p.mapEntries(p.compactEntries(h.labels)), r.create("processedtemplates", null, h.template, g).then(function(e) {
s.setTemplateData(e.parameters, h.template.parameters, e.message), b = e.objects, l.getLatestQuotaAlerts(b, g).then(j);
}, function(e) {
h.disableInputs = !1;
var t;
e.data && e.data.message && (t = e.data.message), i.addNotification({
id: "process-template-error",
type: "error",
message: "An error occurred processing the template.",
details: t
});
});
}, function(e) {
h.disableInputs = !1;
var t;
e.data && e.data.message && (t = e.data.message), i.addNotification({
id: "process-template-error",
type: "error",
message: "An error occurred creating the project.",
details: t
});
});
}, h.cancel = function() {
k(), o.toProjectOverview(h.project.metadata.name);
}, n.$on("instantiateTemplate", h.createFromTemplate), n.$on("$destroy", k);
var R = function() {
return !_.get(h.template, "labels.app") && !_.some(h.template.objects, "metadata.labels.app");
};
} ],
controllerAs: "$ctrl",
bindings: {
template: "<",
project: "<",
onProjectSelected: "<",
availableProjects: "<",
prefillParameters: "<",
isDialog: "<"
},
templateUrl: "views/directives/process-template.html"
});
}(), function() {
angular.module("openshiftConsole").component("processTemplateDialog", {
controller: [ "$scope", "$filter", "Catalog", "DataService", "KeywordService", "NotificationsService", "ProjectsService", "RecentlyViewedProjectsService", function(e, t, n, a, r, o, i, s) {
function c() {
var e = _.get(v, "template.metadata.annotations.iconClass", "fa fa-clone");
return -1 !== e.indexOf("icon-") ? "font-icon " + e : e;
}
function l() {
v.steps || (v.steps = [ v.selectStep, v.infoStep, v.configStep, v.resultsStep ]);
}
function u() {
h && (h(), h = void 0);
}
function d() {
e.$broadcast("instantiateTemplate");
}
function p(e, t) {
return r.filterForKeywords(t, [ "name", "tags" ], r.generateKeywords(e));
}
function m(e) {
v.filterConfig.appliedFilters = e, f();
}
function f() {
v.filteredItems = v.catalogItems, v.filterConfig.appliedFilters && v.filterConfig.appliedFilters.length > 0 && _.each(v.filterConfig.appliedFilters, function(e) {
v.filteredItems = p(e.value, v.filteredItems);
}), v.filterConfig.resultsCount = v.filteredItems.length, _.includes(v.filteredItems, v.selectedTemplate) || v.templateSelected();
}
function g() {
v.unfilteredProjects || i.list().then(function(e) {
v.unfilteredProjects = _.toArray(e.by("metadata.name"));
}, function() {
v.unfilteredProjects = [];
}).finally(function() {
y();
});
}
var h, v = this;
v.selectStep = {
id: "projectTemplates",
label: "Selection",
view: "views/directives/process-template-dialog/process-template-select.html",
hidden: !0 !== v.useProjectTemplate,
allowed: !0,
valid: !1,
allowClickNav: !0,
onShow: function() {
v.infoStep.selected = !1, v.selectStep.selected = !0, v.configStep.selected = !1, v.resultsStep.selected = !1, v.nextTitle = "Next >", u(), g();
}
}, v.infoStep = {
id: "info",
label: "Information",
view: "views/directives/process-template-dialog/process-template-info.html",
allowed: !0,
valid: !0,
allowClickNav: !0,
onShow: function() {
v.infoStep.selected = !0, v.selectStep.selected = !1, v.configStep.selected = !1, v.resultsStep.selected = !1, v.nextTitle = "Next >", u();
}
}, v.configStep = {
id: "configuration",
label: "Configuration",
view: "views/directives/process-template-dialog/process-template-config.html",
valid: !1,
allowed: !0,
allowClickNav: !0,
onShow: function() {
v.infoStep.selected = !1, v.selectStep.selected = !1, v.configStep.selected = !0, v.resultsStep.selected = !1, v.nextTitle = "Create", v.resultsStep.allowed = v.configStep.valid, h = e.$watch("$ctrl.form.$valid", function(e) {
v.configStep.valid = e && v.selectedProject, v.resultsStep.allowed = e;
});
}
}, v.resultsStep = {
id: "results",
label: "Results",
view: "views/directives/process-template-dialog/process-template-results.html",
valid: !0,
allowed: !1,
prevEnabled: !1,
allowClickNav: !1,
onShow: function() {
v.infoStep.selected = !1, v.selectStep.selected = !1, v.configStep.selected = !1, v.resultsStep.selected = !0, v.nextTitle = "Close", u(), v.wizardDone = !0;
}
}, v.$onInit = function() {
v.loginBaseUrl = a.openshiftAPIBaseUrl(), v.preSelectedProject = v.selectedProject = v.project, g(), v.projectEmptyState = {
icon: "pficon pficon-info",
title: "No Project Selected",
info: "Please select a project from the dropdown to load Templates from that project."
}, v.templatesEmptyState = {
icon: "pficon pficon-info",
title: "No Templates",
info: "The selected project has no templates available to import."
}, v.filterConfig = {
fields: [ {
id: "keyword",
title: "Keyword",
placeholder: "Filter by Keyword",
filterType: "text"
} ],
inlineResults: !0,
showTotalCountResults: !0,
itemsLabel: "Item",
itemsLabelPlural: "Items",
resultsCount: 0,
appliedFilters: [],
onFilterChange: m
};
}, v.$onChanges = function(e) {
e.template && v.template && (l(), v.iconClass = c()), e.useProjectTemplate && l();
}, e.$on("templateInstantiated", function(e, t) {
v.selectedProject = t.project, v.currentStep = v.resultsStep.label;
}), v.$onDestroy = function() {
u();
}, v.next = function(e) {
return e.stepId === v.configStep.id ? (d(), !1) : e.stepId !== v.resultsStep.id || (v.close(), !1);
}, v.close = function() {
var e = v.onDialogClosed();
_.isFunction(e) && e();
}, v.onProjectSelected = function(t) {
v.selectedProject = t, v.configStep.valid = e.$ctrl.form.$valid && v.selectedProject;
}, v.templateSelected = function(e) {
v.selectedTemplate = e, v.template = _.get(e, "resource"), v.selectStep.valid = !!e, v.iconClass = c();
}, v.templateProjectChange = function() {
v.templateProjectName = _.get(v.templateProject, "metadata.name"), v.catalogItems = {}, v.templateSelected(), n.getProjectCatalogItems(v.templateProjectName, !1, !0).then(_.spread(function(e, t) {
v.catalogItems = e, v.totalCount = v.catalogItems.length, m(), t && o.addNotification({
type: "error",
message: t
});
}));
};
var y = function() {
var e = _.reject(v.unfilteredProjects, "metadata.deletionTimestamp"), n = _.sortBy(e, t("displayName"));
v.searchEnabled = !_.isEmpty(e), v.templateProjects = s.orderByMostRecentlyViewed(n);
};
} ],
controllerAs: "$ctrl",
bindings: {
template: "<",
project: "<",
useProjectTemplate: "<",
onDialogClosed: "&"
},
templateUrl: "views/directives/process-template-dialog.html"
});
}(), function() {
angular.module("openshiftConsole").component("deployImageDialog", {
controller: [ "$scope", "DataService", function(e, t) {
var n = this;
n.$onInit = function() {
n.loginBaseUrl = t.openshiftAPIBaseUrl(), n.currentStep = "Image";
}, n.deployImage = function() {
e.$broadcast("newAppFromDeployImage");
}, e.$on("deployImageNewAppCreated", function(e, t) {
n.selectedProject = t.project, n.deployImageNewAppCreated = !0, n.currentStep = "Results";
}), n.close = function() {
var e = n.onDialogClosed();
return _.isFunction(e) && e(), n.wizardDone = !1, !0;
}, n.stepChanged = function(e) {
"results" === e.stepId ? (n.nextButtonTitle = "Close", n.wizardDone = !0) : n.nextButtonTitle = "Deploy";
}, n.nextCallback = function(e) {
return "image" === e.stepId ? (n.deployImage(), !1) : "results" !== e.stepId || (n.close(), !1);
};
} ],
controllerAs: "$ctrl",
bindings: {
project: "<",
context: "<",
onDialogClosed: "&"
},
templateUrl: "views/directives/deploy-image-dialog.html"
});
}(), function() {
angular.module("openshiftConsole").component("fromFileDialog", {
controller: [ "$scope", "$timeout", "DataService", function(e, t, n) {
function a() {
var e = _.get(r, "template.metadata.annotations.iconClass", "fa fa-clone");
return -1 !== e.indexOf("icon-") ? "font-icon " + e : e;
}
var r = this;
r.$onInit = function() {
r.alerts = {}, r.loginBaseUrl = n.openshiftAPIBaseUrl();
}, r.importFile = function() {
e.$broadcast("importFileFromYAMLOrJSON");
}, r.instantiateTemplate = function() {
e.$broadcast("instantiateTemplate");
}, e.$on("fileImportedFromYAMLOrJSON", function(e, n) {
r.selectedProject = n.project, r.template = n.template, r.iconClass = a(), t(function() {
r.currentStep = r.template ? "Template Configuration" : "Results";
}, 0);
}), e.$on("templateInstantiated", function(e, t) {
r.selectedProject = t.project, r.currentStep = "Results";
}), r.close = function() {
r.template = null;
var e = r.onDialogClosed();
return _.isFunction(e) && e(), r.wizardDone = !1, !0;
}, r.stepChanged = function(e) {
"results" === e.stepId ? (r.nextButtonTitle = "Close", r.wizardDone = !0) : r.nextButtonTitle = "Create";
}, r.currentStep = "JSON / YAML", r.nextCallback = function(e) {
return "file" === e.stepId ? (r.importFile(), !1) : "template" === e.stepId ? (r.instantiateTemplate(), !1) : "results" !== e.stepId || (r.close(), !1);
};
} ],
controllerAs: "$ctrl",
bindings: {
project: "<",
context: "<",
onDialogClosed: "&"
},
templateUrl: "views/directives/from-file-dialog.html"
});
}(), function() {
angular.module("openshiftConsole").component("nextSteps", {
controller: [ "ProcessedTemplateService", "Navigate", function(e, t) {
function n(e) {
var t = [];
return angular.forEach(e, function(e) {
"completed" !== e.status && t.push(e);
}), t;
}
function a(e) {
var t = [];
return angular.forEach(e, function(e) {
e.hasErrors && t.push(e);
}), t;
}
var r = this;
r.showParamsTable = !1;
var o = e.getTemplateData();
r.parameters = o.params, r.templateMessage = o.message, e.clearTemplateData();
var i = function(e) {
var t = _.get(r, "createdBuildConfig.spec.triggers", []);
return _.some(t, {
type: e
});
};
r.createdBuildConfigWithGitHubTrigger = function() {
return i("GitHub");
}, r.createdBuildConfigWithConfigChangeTrigger = function() {
return i("ConfigChange");
}, r.allTasksSuccessful = function(e) {
return !n(e).length && !a(e).length;
}, r.erroredTasks = a, r.pendingTasks = n, r.goToOverview = function() {
_.isFunction(r.onContinue) && r.onContinue(), t.toProjectOverview(r.projectName);
}, r.toggleParamsTable = function() {
r.showParamsTable = !r.showParamsTable;
};
} ],
bindings: {
project: "<",
projectName: "<",
loginBaseUrl: "<",
fromSampleRepo: "<",
createdBuildConfig: "<",
onContinue: "<"
},
templateUrl: "views/directives/next-steps.html"
});
}(), angular.module("openshiftConsole").directive("imageNames", [ "$filter", "PodsService", function(e, t) {
return {
restrict: "E",
scope: {
podTemplate: "=",
pods: "="
},
templateUrl: "views/_image-names.html",
link: function(n) {
var a = e("imageSHA");
n.$watchGroup([ "podTemplate", "pods" ], function() {
var e = _.get(n, "podTemplate.spec.containers[0]");
if (e) {
var r = a(e.image);
n.imageIDs = r ? [ r ] : t.getImageIDs(n.pods, e.name);
}
});
}
};
} ]), function() {
angular.module("openshiftConsole").component("serviceBinding", {
controller: [ function() {
var e = this, t = function() {
if ("ServiceInstance" !== _.get(e.refApiObject, "kind")) {
var t = _.get(e.binding, "spec.instanceRef.name"), n = _.get(e.serviceInstances, [ t ]), a = _.get(n, "spec.serviceClassName");
e.serviceClass = _.get(e.serviceClasses, [ a ]);
}
};
this.$onChanges = function(e) {
(e.binding || e.serviceInstances || e.serviceClasses) && t();
};
} ],
controllerAs: "$ctrl",
bindings: {
namespace: "<",
binding: "<",
refApiObject: "<?",
serviceClasses: "<",
serviceInstances: "<",
isOverview: "<?"
},
templateUrl: "views/directives/_service-binding.html"
});
}(), function() {
angular.module("openshiftConsole").component("buildCounts", {
controller: [ "$scope", "BuildsService", function(e, t) {
var n = this;
n.interestingPhases = [ "Pending", "Running", "Failed", "Error" ];
var a = function(e) {
var t = _.get(e, "status.phase");
return _.includes(n.interestingPhases, t);
};
n.$onChanges = _.debounce(function() {
e.$apply(function() {
var e = _.groupBy(n.builds, "status.phase");
if (n.countByPhase = _.mapValues(e, _.size), n.show = _.some(n.builds, a), n.showRunningStage && 1 === n.countByPhase.Running) {
var r = _.head(e.Running);
n.currentStage = t.getCurrentStage(r);
} else n.currentStage = null;
});
}, 200);
} ],
controllerAs: "buildCounts",
bindings: {
builds: "<",
showRunningStage: "<",
label: "@"
},
templateUrl: "views/overview/_build-counts.html"
});
}(), function() {
angular.module("openshiftConsole").component("metricsSummary", {
controller: [ "$interval", "ConversionService", "MetricsCharts", "MetricsService", function(e, t, n, a) {
var r, o = this, i = !0, s = function(e) {
return e >= 1024;
};
o.metrics = [ {
label: "Memory",
convert: t.bytesToMiB,
formatUsage: function(e) {
return s(e) && (e /= 1024), n.formatUsage(e);
},
usageUnits: function(e) {
return s(e) ? "GiB" : "MiB";
},
datasets: [ "memory/usage" ],
type: "pod_container"
}, {
label: "CPU",
convert: t.millicoresToCores,
usageUnits: function() {
return "cores";
},
formatUsage: function(e) {
return e < .01 ? "< 0.01" : n.formatUsage(e);
},
datasets: [ "cpu/usage_rate" ],
type: "pod_container"
}, {
label: "Network",
units: "KiB/s",
convert: t.bytesToKiB,
formatUsage: function(e) {
return e < .01 ? "< 0.01" : n.formatUsage(e);
},
usageUnits: function() {
return "KiB/s";
},
datasets: [ "network/tx_rate", "network/rx_rate" ],
type: "pod"
} ];
var c = function() {
var e = _.find(o.pods, "metadata.namespace");
return e ? {
pods: o.pods,
namespace: e.metadata.namespace,
start: "-1mn",
bucketDuration: "1mn"
} : null;
}, l = function(e) {
return null === e.value || void 0 === e.value;
}, u = function(e, t) {
var n = null, a = {};
_.each(e.datasets, function(r) {
_.each(t[r], function(t, r) {
var o = _.last(t);
if (!l(o)) {
a[r] = !0;
var i = e.convert(o.value);
n = (n || 0) + i;
}
});
}), null === n ? delete e.currentUsage : e.currentUsage = n / _.size(a);
}, d = function(e) {
_.each(o.metrics, function(t) {
u(t, e);
});
}, p = function() {
o.error = !0;
}, m = function() {
if (!o.error && !i) {
var e = c();
e && (r = Date.now(), a.getPodMetrics(e).then(d, p));
}
};
o.updateInView = function(e) {
i = !e, e && (!r || Date.now() > r + n.getDefaultUpdateInterval()) && m();
};
var f;
o.$onInit = function() {
f = e(m, n.getDefaultUpdateInterval(), !1), m();
}, o.$onDestroy = function() {
f && (e.cancel(f), f = null);
};
} ],
controllerAs: "metricsSummary",
bindings: {
pods: "<",
containers: "<"
},
templateUrl: "views/overview/_metrics-summary.html"
});
}(), function() {
angular.module("openshiftConsole").component("miniLog", {
controllerAs: "miniLog",
controller: [ "$scope", "$filter", "APIService", "DataService", "HTMLService", function(e, t, n, a, r) {
var o, i, s, c = this, l = t("annotation"), u = c.numLines || 7, d = [];
c.lines = [];
var p = _.throttle(function() {
e.$evalAsync(function() {
c.lines = _.clone(d);
});
}, 200), m = 0, f = function(e) {
if (e) {
var t = ansi_up.escape_for_html(e), n = ansi_up.ansi_to_html(t), a = r.linkify(n, "_blank", !0);
m++, d.push({
markup: a,
id: m
}), d.length > u && (d = _.takeRight(d, u)), p();
}
}, g = function() {
s && (s.stop(), s = null);
}, h = function() {
var e = {
follow: !0,
tailLines: u
};
(s = a.createStream(i, o, c.context, e)).start(), s.onMessage(f), s.onClose(function() {
s = null;
});
};
c.$onInit = function() {
"ReplicationController" === c.apiObject.kind ? (i = "deploymentconfigs/log", o = l(c.apiObject, "deploymentConfig")) : (i = n.kindToResource(c.apiObject.kind) + "/log", o = c.apiObject.metadata.name), h();
}, c.$onDestroy = function() {
g();
};
} ],
bindings: {
apiObject: "<",
numLines: "<",
context: "<"
},
templateUrl: "views/overview/_mini-log.html"
});
}(), function() {
angular.module("openshiftConsole").component("notificationIcon", {
controller: [ "$scope", function(e) {
var t = this;
t.$onChanges = _.debounce(function() {
e.$apply(function() {
var e = _.groupBy(t.alerts, "type");
t.countByType = _.mapValues(e, _.size), t.byType = _.mapValues(e, function(e) {
return _.map(e, function(e) {
return _.escape(e.message);
}).join("<br>");
});
});
}, 200);
} ],
controllerAs: "notification",
bindings: {
alerts: "<"
},
templateUrl: "views/overview/_notification-icon.html"
});
}(), function() {
angular.module("openshiftConsole").component("overviewBuilds", {
controller: [ "$filter", function(e) {
var t, n = e("canI");
this.$onInit = function() {
t = n("builds/log", "get");
}, this.showLogs = function(e) {
if (this.hideLog) return !1;
if (!t) return !1;
if (!_.get(e, "status.startTimestamp")) return !1;
if ("Complete" !== _.get(e, "status.phase")) return !0;
var n = _.get(e, "status.completionTimestamp");
if (!n) return !1;
var a = moment().subtract(3, "m");
return moment(n).isAfter(a);
};
} ],
controllerAs: "overviewBuilds",
bindings: {
buildConfigs: "<",
recentBuildsByBuildConfig: "<",
context: "<",
hideLog: "<"
},
templateUrl: "views/overview/_builds.html"
});
}(), function() {
angular.module("openshiftConsole").component("overviewListRow", {
controller: [ "$filter", "$uibModal", "APIService", "BuildsService", "CatalogService", "DeploymentsService", "ListRowUtils", "Navigate", "NotificationsService", function(e, t, n, a, r, o, i, s, c) {
var l = this;
_.extend(l, i.ui);
var u = e("canI"), d = e("deploymentIsInProgress"), p = e("isBinaryBuild"), m = e("enableTechPreviewFeature"), f = function(e) {
var t = _.get(e, "spec.triggers");
_.isEmpty(t) || (l.imageChangeTriggers = _.filter(t, function(e) {
return "ImageChange" === e.type && _.get(e, "imageChangeParams.automatic");
}));
}, g = function(e) {
e && !l.current && "DeploymentConfig" !== e.kind && "Deployment" !== e.kind && (l.current = e);
}, h = function(e) {
l.rgv = n.objectToResourceGroupVersion(e), g(e), f(e);
};
l.$onChanges = function(e) {
e.apiObject && h(e.apiObject.currentValue);
};
var v = [], y = function(e) {
if (!l.state.hpaByResource) return null;
var t = _.get(e, "kind"), n = _.get(e, "metadata.name");
return _.get(l.state.hpaByResource, [ t, n ], v);
};
l.showBindings = r.SERVICE_CATALOG_ENABLED && m("pod_presets"), l.$doCheck = function() {
l.notifications = i.getNotifications(l.apiObject, l.state), l.hpa = y(l.apiObject), l.current && _.isEmpty(l.hpa) && (l.hpa = y(l.current));
var e = _.get(l, "apiObject.metadata.uid");
e && (l.services = _.get(l, [ "state", "servicesByObjectUID", e ]), l.buildConfigs = _.get(l, [ "state", "buildConfigsByObjectUID", e ]), l.bindings = _.get(l, [ "state", "bindingsByApplicationUID", e ]));
var t;
"DeploymentConfig" === _.get(l, "apiObject.kind") && (t = _.get(l, "apiObject.metadata.name"), l.pipelines = _.get(l, [ "state", "pipelinesByDeploymentConfig", t ]), l.recentBuilds = _.get(l, [ "state", "recentBuildsByDeploymentConfig", t ]), l.recentPipelines = _.get(l, [ "state", "recentPipelinesByDeploymentConfig", t ]));
}, l.getPods = function(e) {
var t = _.get(e, "metadata.uid");
return _.get(l, [ "state", "podsByOwnerUID", t ]);
}, l.firstPod = function(e) {
var t = l.getPods(e);
return _.find(t);
}, l.isScalable = function() {
return !!_.isEmpty(l.hpa) && !l.isDeploymentInProgress();
}, l.isDeploymentInProgress = function() {
return !(!l.current || !l.previous) || d(l.current);
}, l.canIDoAny = function() {
var e = _.get(l, "apiObject.kind"), t = _.get(l, "apiObject.metadata.uid"), n = _.get(l.state.deleteableBindingsByApplicationUID, t);
switch (e) {
case "DeploymentConfig":
return !!u("deploymentconfigs/instantiate", "create") || !!u("deploymentconfigs", "update") || !(!l.current || !u("deploymentconfigs/log", "get")) || !(!m("pod_presets") || _.isEmpty(l.state.bindableServiceInstances) || !u({
resource: "serviceinstancecredentials",
group: "servicecatalog.k8s.io"
}, "create")) || !(!m("pod_presets") || _.isEmpty(n) || !u({
resource: "serviceinstancecredentials",
group: "servicecatalog.k8s.io"
}, "delete")) || l.showStartPipelineAction() || l.showStartBuildAction();

case "Pod":
return !!u("pods/log", "get") || !!u("pods", "update");

default:
return !((!l.firstPod(l.current) || !u("pods/log", "get")) && !u(l.rgv, "update") && (!m("pod_presets") || _.isEmpty(l.state.bindableServiceInstances) || !u({
resource: "serviceinstancecredentials",
group: "servicecatalog.k8s.io"
}, "create")) && (!m("pod_presets") || _.isEmpty(n) || !u({
resource: "serviceinstancecredentials",
group: "servicecatalog.k8s.io"
}, "delete")));
}
}, l.showStartBuildAction = function() {
if (!_.isEmpty(l.pipelines)) return !1;
if (!u("buildconfigs/instantiate", "create")) return !1;
if (1 !== _.size(l.buildConfigs)) return !1;
var e = _.head(l.buildConfigs);
return !p(e);
}, l.showStartPipelineAction = function() {
return u("buildconfigs/instantiate", "create") && 1 === _.size(l.pipelines);
}, l.startBuild = a.startBuild, l.canDeploy = function() {
return !(!l.apiObject || l.apiObject.metadata.deletionTimestamp || l.deploymentInProgress || l.apiObject.spec.paused);
}, l.isPaused = function() {
return l.apiObject.spec.paused;
}, l.startDeployment = function() {
o.startLatestDeployment(l.apiObject, {
namespace: l.apiObject.metadata.namespace
});
}, l.cancelDeployment = function() {
var e = l.current;
if (e) {
var n, a = e.metadata.name, r = _.get(l, "apiObject.status.latestVersion");
n = 1 === r ? "This will attempt to stop the in-progress deployment. It may take some time to complete." : "This will attempt to stop the in-progress deployment and rollback to the last successful deployment. It may take some time to complete.", t.open({
animation: !0,
templateUrl: "views/modals/confirm.html",
controller: "ConfirmModalController",
resolve: {
modalConfig: function() {
return {
message: "Cancel deployment " + a + "?",
details: n,
okButtonText: "Yes, cancel",
okButtonClass: "btn-danger",
cancelButtonText: "No, don't cancel"
};
}
}
}).result.then(function() {
e.metadata.uid === l.current.metadata.uid ? (e = l.current, d(e) ? o.cancelRunningDeployment(e, {
namespace: e.metadata.namespace
}) : c.addNotification({
type: "error",
message: "Deployment " + a + " is no longer in progress."
})) : c.addNotification({
type: "error",
message: "Deployment #" + r + " is no longer the latest."
});
});
}
}, l.urlForImageChangeTrigger = function(t) {
var n = e("stripTag")(_.get(t, "imageChangeParams.from.name")), a = _.get(l, "apiObject.metadata.namespace"), r = _.get(t, "imageChangeParams.from.namespace", a);
return s.resourceURL(n, "ImageStream", r);
}, l.navigateToPods = function() {
var e = l.getPods(l.current);
_.isEmpty(e) || s.toPodsForDeployment(l.current, e);
}, l.closeOverlayPanel = function() {
_.set(l, "overlay.panelVisible", !1);
}, l.showOverlayPanel = function(e, t) {
_.set(l, "overlay.panelVisible", !0), _.set(l, "overlay.panelName", e), _.set(l, "overlay.state", t);
};
} ],
controllerAs: "row",
bindings: {
apiObject: "<",
current: "<",
previous: "<",
state: "<",
hidePipelines: "<"
},
templateUrl: "views/overview/_list-row.html"
});
}(), function() {
angular.module("openshiftConsole").component("serviceInstanceRow", {
controller: [ "$filter", "AuthorizationService", "BindingService", "ListRowUtils", "ServiceInstancesService", function(e, t, n, a, r) {
var o = this, i = e("isBindingFailed"), s = e("isBindingReady");
_.extend(o, a.ui);
var c = e("serviceInstanceDisplayName"), l = function() {
var e = o.apiObject.spec.serviceClassName;
return _.get(o, [ "state", "serviceClasses", e, "description" ]);
}, u = function() {
_.get(o.apiObject, "metadata.deletionTimestamp") ? o.instanceStatus = "deleted" : i(o.apiObject) ? o.instanceStatus = "failed" : s(o.apiObject) ? o.instanceStatus = "ready" : o.instanceStatus = "pending";
};
o.$doCheck = function() {
u(), o.notifications = a.getNotifications(o.apiObject, o.state), o.displayName = c(o.apiObject, o.state.serviceClasses), o.isBindable = n.isServiceBindable(o.apiObject, o.state.serviceClasses), o.description = l();
}, o.$onChanges = function(e) {
e.bindings && (o.deleteableBindings = _.reject(o.bindings, "metadata.deletionTimestamp"));
}, o.getSecretForBinding = function(e) {
return e && _.get(o, [ "state", "secrets", e.spec.secretName ]);
}, o.actionsDropdownVisible = function() {
return !(_.get(o.apiObject, "metadata.deletionTimestamp") || (!o.isBindable || !t.canI({
resource: "serviceinstancecredentials",
group: "servicecatalog.k8s.io"
}, "create")) && (_.isEmpty(o.deleteableBindings) || !t.canI({
resource: "serviceinstancecredentials",
group: "servicecatalog.k8s.io"
}, "delete")) && !t.canI({
resource: "serviceinstances",
group: "servicecatalog.k8s.io"
}, "delete"));
}, o.closeOverlayPanel = function() {
_.set(o, "overlay.panelVisible", !1);
}, o.showOverlayPanel = function(e, t) {
_.set(o, "overlay.panelVisible", !0), _.set(o, "overlay.panelName", e), _.set(o, "overlay.state", t);
}, o.deprovision = function() {
r.deprovision(o.apiObject);
};
} ],
controllerAs: "row",
bindings: {
apiObject: "<",
state: "<",
bindings: "<"
},
templateUrl: "views/overview/_service-instance-row.html"
});
}(), angular.module("openshiftConsole").component("overviewNetworking", {
controllerAs: "networking",
bindings: {
rowServices: "<",
allServices: "<",
routesByService: "<"
},
templateUrl: "views/overview/_networking.html"
}), angular.module("openshiftConsole").component("overviewPipelines", {
controllerAs: "overviewPipelines",
bindings: {
recentPipelines: "<"
},
templateUrl: "views/overview/_pipelines.html"
}), angular.module("openshiftConsole").component("overviewServiceBindings", {
controllerAs: "$ctrl",
bindings: {
sectionTitle: "@",
namespace: "<",
refApiObject: "<",
bindings: "<",
bindableServiceInstances: "<",
serviceClasses: "<",
serviceInstances: "<",
createBinding: "&"
},
templateUrl: "views/overview/_service-bindings.html"
}), angular.module("openshiftConsole").directive("istagSelect", [ "DataService", "ProjectsService", function(e, t) {
return {
require: "^form",
restrict: "E",
scope: {
istag: "=model",
selectDisabled: "=",
selectRequired: "=",
includeSharedNamespace: "=",
allowCustomTag: "="
},
templateUrl: "views/directives/istag-select.html",
controller: [ "$scope", function(n) {
n.isByNamespace = {}, n.isNamesByNamespace = {};
var a = _.get(n, "istag.namespace") && _.get(n, "istag.imageStream") && _.get(n, "istag.tagObject.tag"), r = function(e) {
_.each(e, function(e) {
_.get(e, "status.tags") || _.set(e, "status.tags", []);
});
}, o = function(t) {
if (n.isByNamespace[t] = {}, n.isNamesByNamespace[t] = [], !_.includes(n.namespaces, t)) return n.namespaces.push(t), n.isNamesByNamespace[t] = n.isNamesByNamespace[t].concat(n.istag.imageStream), void (n.isByNamespace[t][n.istag.imageStream] = {
status: {
tags: [ {
tag: n.istag.tagObject.tag
} ]
}
});
e.list("imagestreams", {
namespace: t
}, function(e) {
var a = angular.copy(e.by("metadata.name"));
r(a), n.isByNamespace[t] = a, n.isNamesByNamespace[t] = _.keys(a).sort(), _.includes(n.isNamesByNamespace[t], n.istag.imageStream) || (n.isNamesByNamespace[t] = n.isNamesByNamespace[t].concat(n.istag.imageStream), n.isByNamespace[t][n.istag.imageStream] = {
status: {
tags: {}
}
}), _.find(n.isByNamespace[t][n.istag.imageStream].status.tags, {
tag: n.istag.tagObject.tag
}) || n.isByNamespace[t][n.istag.imageStream].status.tags.push({
tag: n.istag.tagObject.tag
});
});
};
t.list().then(function(t) {
n.namespaces = _.keys(t.by("metadata.name")), n.includeSharedNamespace && (n.namespaces = _.uniq([ "openshift" ].concat(n.namespaces))), n.namespaces = n.namespaces.sort(), n.$watch("istag.namespace", function(t) {
if (t && !n.isByNamespace[t]) return a ? (o(t), void (a = !1)) : void e.list("imagestreams", {
namespace: t
}, function(e) {
var a = angular.copy(e.by("metadata.name"));
r(a), n.isByNamespace[t] = a, n.isNamesByNamespace[t] = _.keys(a).sort();
});
});
}), n.getTags = function(e) {
n.allowCustomTag && e && !_.find(n.isByNamespace[n.istag.namespace][n.istag.imageStream].status.tags, {
tag: e
}) && (_.remove(n.isByNamespace[n.istag.namespace][n.istag.imageStream].status.tags, function(e) {
return !e.items;
}), n.isByNamespace[n.istag.namespace][n.istag.imageStream].status.tags.unshift({
tag: e
}));
}, n.groupTags = function(e) {
return n.allowCustomTag ? e.items ? "Current Tags" : "New Tag" : "";
};
} ]
};
} ]), angular.module("openshiftConsole").directive("deployImage", [ "$filter", "$q", "$window", "$uibModal", "ApplicationGenerator", "DataService", "ImagesService", "Navigate", "NotificationsService", "ProjectsService", "QuotaService", "TaskList", "SecretsService", "keyValueEditorUtils", function(e, t, n, a, r, o, i, s, c, l, u, d, p, m) {
return {
restrict: "E",
scope: {
project: "=",
isDialog: "="
},
templateUrl: "views/directives/deploy-image.html",
controller: [ "$scope", function(e) {
e.forms = {};
} ],
link: function(n) {
function p() {
var e = m.mapEntries(m.compactEntries(n.labels));
return i.getResources({
name: n.app.name,
image: n.import.name,
namespace: n.import.namespace,
tag: n.import.tag || "latest",
ports: n.ports,
volumes: n.volumes,
env: m.compactEntries(n.env),
labels: e
});
}
n.input = {
selectedProject: n.project
}, n.mode = "istag", n.istag = {}, n.app = {}, n.env = [], n.labels = [ {
name: "app",
value: ""
} ];
var f = e("orderByDisplayName"), g = e("getErrorDetails"), h = {}, v = function() {
c.hideNotification("deploy-image-list-config-maps-error"), c.hideNotification("deploy-image-list-secrets-error"), _.each(h, function(e) {
!e.id || "error" !== e.type && "warning" !== e.type || c.hideNotification(e.id);
});
};
n.valueFromNamespace = {};
var y = function() {
if (_.has(n.input.selectedProject, "metadata.uid")) return t.when(n.input.selectedProject);
var a = n.input.selectedProject.metadata.name, r = n.input.selectedProject.metadata.annotations["new-display-name"], o = e("description")(n.input.selectedProject);
return l.create(a, r, o);
}, b = e("stripTag"), C = e("stripSHA"), S = e("humanizeKind"), w = function(e) {
return e.length > 24 ? e.substring(0, 24) : e;
}, k = function() {
var e = _.last(n.import.name.split("/"));
return e = C(e), e = b(e), e = w(e);
};
n.findImage = function() {
n.loading = !0, i.findImage(n.imageName, {
namespace: n.input.selectedProject.metadata.name
}).then(function(e) {
if (n.import = e, n.loading = !1, "Success" === _.get(e, "result.status")) {
n.forms.imageSelection.imageName.$setValidity("imageLoaded", !0);
var t = n.import.image;
t && (n.app.name = k(), n.runsAsRoot = i.runsAsRoot(t), n.ports = r.parsePorts(t), n.volumes = i.getVolumes(t), n.createImageStream = !0);
} else n.import.error = _.get(e, "result.message", "An error occurred finding the image.");
}, function(t) {
n.import.error = e("getErrorDetails")(t) || "An error occurred finding the image.", n.loading = !1;
});
}, n.$watch("app.name", function(e, t) {
n.nameTaken = !1;
var a = _.find(n.labels, {
name: "app"
});
!a || a.value && a.value !== t || (a.value = e);
}), n.$watch("mode", function(e, t) {
e !== t && (delete n.import, n.istag = {}, "dockerImage" === e ? n.forms.imageSelection.imageName.$setValidity("imageLoaded", !1) : n.forms.imageSelection.imageName.$setValidity("imageLoaded", !0));
}), n.$watch("imageName", function() {
"dockerImage" === n.mode && n.forms.imageSelection.imageName.$setValidity("imageLoaded", !1);
}), n.$watch("istag", function(t, a) {
if (t !== a) if (t.namespace && t.imageStream && t.tagObject) {
var s, c = _.get(t, "tagObject.items[0].image");
n.app.name = w(t.imageStream), n.import = {
name: t.imageStream,
tag: t.tagObject.tag,
namespace: t.namespace
}, c && (s = t.imageStream + "@" + c, n.loading = !0, o.get("imagestreamimages", s, {
namespace: t.namespace
}).then(function(e) {
n.loading = !1, n.import.image = e.image, n.ports = r.parsePorts(e.image), n.volumes = i.getVolumes(e.image), n.runsAsRoot = !1;
}, function(t) {
n.import.error = e("getErrorDetails")(t) || "An error occurred.", n.loading = !1;
}));
} else delete n.import;
}, !0), n.$watch("input.selectedProject", function(e) {
if (n.env = _.reject(n.env, "valueFrom"), _.get(e, "metadata.uid")) {
if (!n.valueFromNamespace[e.metadata.name]) {
var t = [], a = [];
o.list("configmaps", {
namespace: n.input.selectedProject.metadata.name
}, null, {
errorNotification: !1
}).then(function(r) {
t = f(r.by("metadata.name")), n.valueFromNamespace[e.metadata.name] = t.concat(a);
}, function(e) {
403 !== e.code && c.addNotification({
id: "deploy-image-list-config-maps-error",
type: "error",
message: "Could not load config maps.",
details: g(e)
});
}), o.list("secrets", {
namespace: n.input.selectedProject.metadata.name
}, null, {
errorNotification: !1
}).then(function(r) {
a = f(r.by("metadata.name")), n.valueFromNamespace[e.metadata.name] = a.concat(t);
}, function(e) {
403 !== e.code && c.addNotification({
id: "deploy-image-list-secrets-error",
type: "error",
message: "Could not load secrets.",
details: g(e)
});
});
}
} else n.mode = "istag";
});
var j, P = e("displayName"), R = function() {
var e = {
started: "Deploying image " + n.app.name + " to project " + P(n.input.selectedProject),
success: "Deployed image " + n.app.name + " to project " + P(n.input.selectedProject),
failure: "Failed to deploy image " + n.app.name + " to project " + P(n.input.selectedProject)
};
d.clear(), d.add(e, {}, n.input.selectedProject.metadata.name, function() {
var e = t.defer();
return o.batch(j, {
namespace: n.input.selectedProject.metadata.name
}).then(function(t) {
var a, r = !_.isEmpty(t.failure);
a = r ? (a = _.map(t.failure, function(e) {
return {
type: "error",
message: "Cannot create " + S(e.object.kind).toLowerCase() + ' "' + e.object.metadata.name + '". ',
details: e.data.message
};
})).concat(_.map(t.success, function(e) {
return {
type: "success",
message: "Created " + S(e.kind).toLowerCase() + ' "' + e.metadata.name + '" successfully. '
};
})) : [ {
type: "success",
message: "All resources for image " + n.app.name + " were created successfully."
} ], e.resolve({
alerts: a,
hasErrors: r
});
}), e.promise;
}), n.isDialog ? n.$emit("deployImageNewAppCreated", {
project: n.input.selectedProject,
appName: n.app.name
}) : s.toNextSteps(n.app.name, n.input.selectedProject.metadata.name);
}, I = function(e) {
a.open({
animation: !0,
templateUrl: "views/modals/confirm.html",
controller: "ConfirmModalController",
resolve: {
modalConfig: function() {
return {
alerts: e,
message: "Problems were detected while checking your application configuration.",
okButtonText: "Create Anyway",
okButtonClass: "btn-danger",
cancelButtonText: "Cancel"
};
}
}
}).result.then(R);
}, T = function(e) {
h = e.quotaAlerts || [];
var t = _.filter(h, {
type: "error"
});
n.nameTaken || t.length ? (n.disableInputs = !1, _.each(h, function(e) {
e.id = _.uniqueId("deploy-image-alert-"), c.addNotification(e);
})) : h.length ? (I(h), n.disableInputs = !1) : R();
};
n.create = function() {
n.disableInputs = !0, v(), y().then(function(e) {
n.input.selectedProject = e, j = p();
var t = r.ifResourcesDontExist(j, n.input.selectedProject.metadata.name), a = u.getLatestQuotaAlerts(j, {
namespace: n.input.selectedProject.metadata.name
}), o = function(e) {
return n.nameTaken = e.nameTaken, a;
};
t.then(o, o).then(T, T);
}, function(e) {
c.addNotification({
id: "deploy-image-create-project-error",
type: "error",
message: "An error occurred creating project",
details: g(e)
}), n.disableInputs = !1;
});
}, n.$on("newAppFromDeployImage", n.create), n.$on("$destroy", v);
}
};
} ]), angular.module("openshiftConsole").directive("selector", function() {
return {
restrict: "E",
scope: {
selector: "="
},
templateUrl: "views/directives/selector.html"
};
}), angular.module("openshiftConsole").directive("selectContainers", function() {
return {
restrict: "E",
scope: {
containers: "=ngModel",
template: "=podTemplate",
required: "=ngRequired",
helpText: "@?"
},
templateUrl: "views/directives/select-containers.html",
controller: [ "$scope", function(e) {
e.containers = e.containers || {}, e.$watch("containers", function(t) {
e.containerSelected = _.some(t, function(e) {
return e;
});
}, !0);
} ]
};
}), angular.module("openshiftConsole").directive("buildHooks", function() {
return {
restrict: "E",
templateUrl: "views/directives/build-hooks.html",
scope: {
build: "="
}
};
}), angular.module("openshiftConsole").directive("pauseRolloutsCheckbox", [ "APIService", function(e) {
return {
restrict: "E",
scope: {
deployment: "=",
disabled: "=ngDisabled",
alwaysVisible: "="
},
templateUrl: "views/directives/pause-rollouts-checkbox.html",
link: function(t) {
var n = function() {
if (!t.deployment) return !1;
var n = e.objectToResourceGroupVersion(t.deployment);
return "deploymentconfigs" === n.resource && !n.group;
};
t.$watch("deployment.spec.triggers", function(e) {
t.missingConfigChangeTrigger = n() && !_.some(e, {
type: "ConfigChange"
});
}, !0);
}
};
} ]), angular.module("openshiftConsole").directive("keyValueEditor", [ "$routeParams", "$timeout", "$filter", "keyValueEditorConfig", "keyValueEditorUtils", function(e, t, n, a, r) {
var o = n("humanizeKind"), i = n("canI"), s = 1e3;
return {
restrict: "AE",
scope: {
keyMinlength: "@",
keyMaxlength: "@",
valueMinlength: "@",
valueMaxlength: "@",
entries: "=",
keyPlaceholder: "@",
valuePlaceholder: "@",
keyValidator: "@",
keyValidatorRegex: "=",
valueValidator: "@",
valueValidatorRegex: "=",
keyValidatorError: "@",
keyValidatorErrorTooltip: "@",
keyValidatorErrorTooltipIcon: "@",
valueValidatorError: "@",
valueValidatorErrorTooltip: "@",
valueValidatorErrorTooltipIcon: "@",
valueIconTooltip: "@",
valueFromSelectorOptions: "=",
cannotAdd: "=?",
cannotSort: "=?",
cannotDelete: "=?",
isReadonly: "=?",
isReadonlyValue: "=?",
isReadonlyKeys: "=?",
addRowLink: "@",
addRowWithSelectorsLink: "@",
showHeader: "=?",
allowEmptyKeys: "=?",
keyRequiredError: "@"
},
templateUrl: "views/directives/key-value-editor.html",
link: function(e, n, r) {
var i;
e.validation = {
key: e.keyValidator,
val: e.valueValidator
}, r.keyValidatorRegex && (e.validation.key = e.keyValidatorRegex), r.valueValidatorRegex && (e.validation.val = e.valueValidatorRegex), "grabFocus" in r && (e.grabFocus = !0, t(function() {
e.grabFocus = void 0;
})), "cannotAdd" in r && (e.cannotAdd = !0), "cannotDelete" in r && (e.cannotDeleteAny = !0), "isReadonly" in r && (e.isReadonlyAny = !0), "isReadonlyKeys" in r && (i = e.$watch("entries", function(t) {
t && (_.each(e.entries, function(e) {
e.isReadonlyKey = !0;
}), i());
})), "cannotSort" in r && (e.cannotSort = !0), "showHeader" in r && (e.showHeader = !0), "allowEmptyKeys" in r && (e.allowEmptyKeys = !0), e.groupByKind = function(e) {
return o(e.kind);
}, e.valueFromObjectSelected = function(e, t) {
"ConfigMap" === t.kind ? (e.valueFrom.configMapKeyRef = {
name: t.metadata.name
}, delete e.valueFrom.secretKeyRef) : "Secret" === t.kind && (e.valueFrom.secretKeyRef = {
name: t.metadata.name
}, delete e.valueFrom.configMapKeyRef), delete e.valueFrom.key;
}, e.valueFromKeySelected = function(e, t) {
e.valueFrom.configMapKeyRef ? e.valueFrom.configMapKeyRef.key = t : e.valueFrom.secretKeyRef && (e.valueFrom.secretKeyRef.key = t);
}, angular.extend(e, {
keyMinlength: a.keyMinlength || r.keyMinlength,
keyMaxlength: a.keyMaxlength || r.keyMaxlength,
valueMinlength: a.valueMinlength || r.valueMinlength,
valueMaxlength: a.valueMaxlength || r.valueMaxlength,
keyValidator: a.keyValidator || r.keyValidator,
valueValidator: a.valueValidator || r.valueValidator,
keyValidatorError: a.keyValidatorError || r.keyValidatorError,
valueValidatorError: a.valueValidatorError || r.valueValidatorError,
keyRequiredError: a.keyRequiredError || r.keyRequiredError,
keyValidatorErrorTooltip: a.keyValidatorErrorTooltip || r.keyValidatorErrorTooltip,
keyValidatorErrorTooltipIcon: a.keyValidatorErrorTooltipIcon || r.keyValidatorErrorTooltipIcon,
valueValidatorErrorTooltip: a.valueValidatorErrorTooltip || r.valueValidatorErrorTooltip,
valueValidatorErrorTooltipIcon: a.valueValidatorErrorTooltipIcon || r.valueValidatorErrorTooltipIcon,
keyPlaceholder: a.keyPlaceholder || r.keyPlaceholder,
valuePlaceholder: a.valuePlaceholder || r.valuePlaceholder
});
},
controller: [ "$scope", function(t) {
var n = [], a = [], o = s++, c = i("secrets", "get"), l = i("configmaps", "get");
angular.extend(t, {
namespace: e.project,
unique: o,
forms: {},
placeholder: r.newEntry(),
setFocusKeyClass: "key-value-editor-set-focus-key-" + o,
setFocusValClass: "key-value-editor-set-focus-value-" + o,
uniqueForKey: r.uniqueForKey,
uniqueForValue: r.uniqueForValue,
dragControlListeners: {
accept: function(e, t) {
return e.itemScope.sortableScope.$id === t.$id;
},
orderChanged: function() {
t.forms.keyValueEditor.$setDirty();
}
},
deleteEntry: function(e, n) {
t.entries.splice(e, n), !t.entries.length && t.addRowLink && r.addEntry(t.entries), t.forms.keyValueEditor.$setDirty();
},
isReadonlySome: function(e) {
return _.includes(n, e);
},
cannotDeleteSome: function(e) {
return _.includes(a, e);
},
onAddRow: function() {
r.addEntry(t.entries), r.setFocusOn("." + t.setFocusKeyClass);
},
onAddRowWithSelectors: function() {
r.addEntryWithSelectors(t.entries), r.setFocusOn("." + t.setFocusKeyClass);
},
isValueFromReadonly: function(e) {
return t.isReadonlyAny || e.isReadonlyValue || e.refType && !e.selectedValueFrom || _.isEmpty(t.valueFromSelectorOptions);
}
}), t.$watch("cannotDelete", function(e) {
angular.isArray(e) && (t.cannotDeleteAny = !1, a = e);
}), t.$watch("isReadonly", function(e) {
angular.isArray(e) && (t.isReadonlyAny = !1, n = e);
}), t.$watch("addRowLink", function(e) {
t.addRowLink = e || "Add row", t.entries && !t.entries.length && r.addEntry(t.entries);
}), t.$watch("entries", function(e) {
e && !e.length && r.addEntry(t.entries), _.each(t.entries, function(e) {
r.altTextForValueFrom(e, t.namespace), r.setEntryPerms(e, c, l);
}), r.findReferenceValueForEntries(e, t.valueFromSelectorOptions);
}), t.$watch("valueFromSelectorOptions", function() {
r.findReferenceValueForEntries(t.entries, t.valueFromSelectorOptions);
});
} ]
};
} ]), angular.module("openshiftConsole").directive("confirmOnExit", [ "Logger", function(e) {
return {
scope: {
dirty: "=",
message: "="
},
link: function(t) {
if (!_.get(window, "OPENSHIFT_CONSTANTS.DISABLE_CONFIRM_ON_EXIT") && !_.get(window, "OPENSHIFT_CONSTANTS.CONFIRM_DIALOG_BLOCKED")) {
var n = function() {
return t.message || "You have unsaved changes. Leave this page anyway?";
}, a = function() {
if (t.dirty) return n();
};
$(window).on("beforeunload", a);
var r = t.$on("$routeChangeStart", function(a) {
if (t.dirty) {
var r = new Date().getTime();
confirm(n()) || (new Date().getTime() - r < 50 ? (_.set(window, "OPENSHIFT_CONSTANTS.CONFIRM_DIALOG_BLOCKED", !0), e.warn("Confirm on exit prompt appears to have been blocked by the browser.")) : a.preventDefault());
}
});
t.$on("$destroy", function() {
$(window).off("beforeunload", a), r && r();
});
}
}
};
} ]), function() {
angular.module("openshiftConsole").component("uiAceYaml", {
controller: [ "$scope", function(e) {
var t, n = this, a = function(e) {
return jsyaml.safeLoad(n.model, {
json: !e
});
}, r = function() {
t.getSession().clearAnnotations(), e.$evalAsync(function() {
n.annotations = {};
});
}, o = function(a, r) {
var o = t.getSession(), i = o.getLength(), s = _.get(a, "mark.line", 0), c = _.get(a, "mark.column", 0), l = a.message || "Could not parse content.";
s >= i && (s = i - 1);
var u = {
row: s,
column: c,
text: l,
type: r
};
o.setAnnotations([ u ]), e.$evalAsync(function() {
n.annotations = {}, n.annotations[r] = [ u ];
});
}, i = function(t) {
e.$evalAsync(function() {
n.form.$setValidity("yamlValid", t);
});
};
e.$watch(function() {
return n.fileUpload;
}, function(e, t) {
e !== t && (n.model = e);
}), n.$onInit = function() {
n.resource && (n.model = jsyaml.safeDump(n.resource, {
sortKeys: !0
}));
}, n.aceChanged = function() {
try {
n.resource = a(!1), i(!0);
try {
a(!0), r();
} catch (e) {
o(e, "warning");
}
} catch (e) {
o(e, "error"), i(!1);
}
}, n.aceLoaded = function(e) {
t = e;
var n = e.getSession();
n.setOption("tabSize", 2), n.setOption("useSoftTabs", !0), e.setDragDelay = 0;
}, n.gotoLine = function(e) {
t.gotoLine(e);
};
} ],
controllerAs: "$ctrl",
bindings: {
resource: "=",
ngRequired: "<?",
showFileInput: "<?"
},
templateUrl: "views/directives/ui-ace-yaml.html"
});
}(), angular.module("openshiftConsole").directive("affix", [ "$window", function(e) {
return {
restrict: "AE",
scope: {
offsetTop: "@",
offsetBottom: "@"
},
link: function(e, t, n, a) {
t.affix({
offset: {
top: n.offsetTop,
bottom: n.offsetBottom
}
});
}
};
} ]), function() {
angular.module("openshiftConsole").component("editEnvironmentVariables", {
controller: [ "$filter", "APIService", "DataService", "EnvironmentService", "NotificationsService", function(e, t, n, a, r) {
var o, i, s, c, l = this, u = !1, d = [], p = [], m = !1, f = e("canI"), g = e("getErrorDetails"), h = e("humanizeKind"), v = e("orderByDisplayName"), y = function(e, t) {
u || (l.form && !l.form.$pristine && l.updatedObject ? a.isEnvironmentEqual(e, t) ? l.updatedObject = a.mergeEdits(e, t) : (u = !0, r.addNotification({
type: "warning",
message: "The environment variables for the " + o + " have been updated in the background.",
details: "Saving your changes may create a conflict or cause loss of data."
})) : l.updatedObject = a.copyAndNormalize(e));
}, b = function() {
n.list("configmaps", {
namespace: l.apiObject.metadata.namespace
}).then(function(e) {
d = v(e.by("metadata.name")), l.valueFromObjects = d.concat(p);
});
}, C = function() {
f("secrets", "list") && n.list("secrets", {
namespace: l.apiObject.metadata.namespace
}).then(function(e) {
p = v(e.by("metadata.name")), l.valueFromObjects = d.concat(p);
});
}, S = function() {
m || (m = !0, b(), C());
}, _ = function(e, n) {
o = h(e.kind), i = e.metadata.name, s = t.objectToResourceGroupVersion(e), l.canIUpdate = f(s, "update"), c ? c.finally(function() {
y(e, n);
}) : y(e, n), l.containers = a.getContainers(l.updatedObject), l.disableValueFrom || l.ngReadonly || !l.canIUpdate || S();
};
l.$onChanges = function(e) {
e.apiObject && e.apiObject.currentValue && _(e.apiObject.currentValue, e.apiObject.previousValue);
}, l.save = function() {
var e = "save-env-error-" + i;
r.hideNotification(e), a.compact(l.updatedObject), (c = n.update(s, i, l.updatedObject, {
namespace: l.updatedObject.metadata.namespace
})).then(function() {
r.addNotification({
type: "success",
message: "Environment variables for " + o + " " + i + " were successfully updated."
}), l.form.$setPristine();
}, function(t) {
r.addNotification({
id: e,
type: "error",
message: "An error occurred updating environment variables for " + o + " " + i + ".",
details: g(t)
});
}).finally(function() {
c = null;
});
}, l.clearChanges = function() {
l.updatedObject = a.copyAndNormalize(l.apiObject), l.containers = a.getContainers(l.updatedObject), l.form.$setPristine(), u = !1;
};
} ],
controllerAs: "$ctrl",
bindings: {
apiObject: "<",
ngReadonly: "<",
disableValueFrom: "<"
},
templateUrl: "views/directives/edit-environment-variables.html"
});
}(), angular.module("openshiftConsole").component("initContainersSummary", {
bindings: {
apiObject: "<"
},
templateUrl: "views/_init-containers-summary.html",
controller: [ "$filter", function(e) {
var t = this;
t.$onChanges = function(n) {
var a = _.get(n.apiObject, "currentValue");
if (a) switch (t.podTemplate = e("podTemplate")(a), a.kind) {
case "DeploymentConfig":
case "Deployment":
t.tab = "configuration";
break;

default:
t.tab = "details";
}
};
} ]
}), function() {
angular.module("openshiftConsole").component("notificationCounter", {
templateUrl: "views/directives/notifications/notification-counter.html",
bindings: {},
controller: [ "$filter", "$routeParams", "$rootScope", "Constants", function(e, t, n, a) {
var r = this, o = _.get(a, "DISABLE_GLOBAL_EVENT_WATCH"), i = e("isIE")() || e("isEdge")();
r.hide = !0;
var s = [], c = [], l = function(e, t) {
e && c.push(n.$on("NotificationDrawerWrapper.onUnreadNotifications", t));
}, u = function() {
_.each(c, function(e) {
e && e();
}), c = [];
}, d = function() {
_.each(s, function(e) {
e();
}), s = [];
}, p = function(e) {
r.hide = !e;
};
r.onClick = function() {
n.$emit("NotificationDrawerWrapper.toggle");
};
var m = function(e, t) {
r.showUnreadNotificationsIndicator = !!t;
}, f = function(e, t) {
return _.get(e, "params.project") !== _.get(t, "params.project");
}, g = function() {
l(t.project, m), p(t.project);
}, h = function() {
g(), s.push(n.$on("$routeChangeSuccess", function(e, t, n) {
f(t, n) && g();
})), s.push(n.$on("NotificationDrawerWrapper.onMarkAllRead", function() {
r.showUnreadNotificationsIndicator = !1;
}));
};
r.$onInit = function() {
o || i ? r.hide = !0 : h();
}, r.$onDestroy = function() {
u(), d();
};
} ]
});
}(), function() {
angular.module("openshiftConsole").component("notificationDrawerWrapper", {
templateUrl: "views/directives/notifications/notification-drawer-wrapper.html",
controller: [ "$filter", "$interval", "$location", "$timeout", "$routeParams", "$rootScope", "Constants", "DataService", "EventsService", "NotificationsService", function(e, t, n, a, r, o, i, s, c) {
var l, u, d = _.get(i, "DISABLE_GLOBAL_EVENT_WATCH"), p = e("isIE")() || e("isEdge")(), m = this, f = [], g = {}, h = {}, v = {}, y = function(e) {
e || (m.drawerHidden = !0);
}, b = function(e, t) {
return _.get(e, "params.project") !== _.get(t, "params.project");
}, C = function(e) {
return s.get("projects", e, {}, {
errorNotification: !1
}).then(function(e) {
return v[e.metadata.name] = e, e;
});
}, S = function(t, n) {
return {
heading: e("displayName")(v[t]),
project: v[t],
notifications: n
};
}, w = function(e) {
return _.filter(e, "unread");
}, k = function() {
_.each(m.notificationGroups, function(e) {
e.totalUnread = w(e.notifications).length, e.hasUnread = !!e.totalUnread, o.$emit("NotificationDrawerWrapper.onUnreadNotifications", e.totalUnread);
});
}, j = function(e) {
_.each(m.notificationGroups, function(t) {
_.remove(t.notifications, {
uid: e.uid,
namespace: e.namespace
});
});
}, P = function(e) {
return _.map(e, function(e) {
return {
actions: null,
uid: e.metadata.uid,
trackByID: e.metadata.uid,
unread: !c.isRead(e.metadata.uid),
type: e.type,
lastTimestamp: e.lastTimestamp,
firstTimestamp: e.firstTimestamp,
event: e
};
});
}, R = function(e) {
return _.reduce(e, function(e, t) {
return c.isImportantAPIEvent(t) && !c.isCleared(t.metadata.uid) && (e[t.metadata.uid] = t), e;
}, {});
}, I = function(e, t) {
var n = r.project;
return _.assign({}, e[n], t[n]);
}, T = function(e) {
return _.orderBy(e, [ "event.lastTimestamp", "event.firstTimestamp" ], [ "desc", "desc" ]);
}, N = function() {
o.$evalAsync(function() {
m.notificationGroups = [ S(r.project, T(I(g, h))) ], k();
});
}, E = function() {
_.each(f, function(e) {
e();
}), f = [];
}, D = function() {
u && (s.unwatch(u), u = null);
}, A = function() {
l && l(), l = null;
}, $ = function(e) {
g[r.project] = P(R(e.by("metadata.name"))), N();
}, B = function(e, t) {
if (t.showInDrawer) {
var n = t.namespace || r.project, a = t.id || _.uniqueId("notification_") + Date.now();
h[n] = h[n] || {}, h[n][a] = {
actions: t.actions,
unread: !c.isRead(a),
trackByID: t.trackByID,
uid: a,
type: t.type,
lastTimestamp: t.timestamp,
message: t.message,
isHTML: t.isHTML,
details: t.details,
namespace: n,
links: t.links
}, N();
}
}, L = function(e, t) {
D(), e && (u = s.watch("events", {
namespace: e
}, _.debounce(t, 400), {
skipDigest: !0
}));
}, U = _.once(function(e, t) {
A(), l = o.$on("NotificationsService.onNotificationAdded", t);
}), O = function() {
C(r.project).then(function() {
L(r.project, $), U(r.project, B), y(r.project), N();
});
};
angular.extend(m, {
drawerHidden: !0,
allowExpand: !0,
drawerExpanded: !1,
drawerTitle: "Notifications",
hasUnread: !1,
showClearAll: !0,
showMarkAllRead: !0,
onClose: function() {
m.drawerHidden = !0;
},
onMarkAllRead: function(e) {
_.each(e.notifications, function(e) {
e.unread = !1, c.markRead(e.uid);
}), N(), o.$emit("NotificationDrawerWrapper.onMarkAllRead");
},
onClearAll: function(e) {
_.each(e.notifications, function(e) {
e.unread = !1, c.markRead(e.uid), c.markCleared(e.uid);
}), g[r.project] = {}, h[r.project] = {}, N(), o.$emit("NotificationDrawerWrapper.onMarkAllRead");
},
notificationGroups: [],
headingInclude: "views/directives/notifications/header.html",
notificationBodyInclude: "views/directives/notifications/notification-body.html",
customScope: {
clear: function(e, t, n) {
c.markCleared(e.uid), n.notifications.splice(t, 1), k();
},
markRead: function(e) {
e.unread = !1, c.markRead(e.uid), k();
},
close: function() {
m.drawerHidden = !0;
},
onLinkClick: function(e) {
e.onClick(), m.drawerHidden = !0;
},
countUnreadNotifications: k
}
});
var F = function() {
r.project && O(), f.push(o.$on("$routeChangeSuccess", function(e, t, n) {
b(t, n) && (m.customScope.projectName = r.project, O());
})), f.push(o.$on("NotificationDrawerWrapper.toggle", function() {
m.drawerHidden = !m.drawerHidden;
})), f.push(o.$on("NotificationDrawerWrapper.hide", function() {
m.drawerHidden = !0;
})), f.push(o.$on("NotificationDrawerWrapper.clear", function(e, t) {
c.markCleared(t.uid), j(t), m.countUnreadNotifications();
}));
};
m.$onInit = function() {
d || p || F();
}, m.$onDestroy = function() {
A(), D(), E();
};
} ]
});
}(), angular.module("openshiftConsole").filter("duration", function() {
return function(e, t, n, a) {
function r(e, t, a) {
0 !== e && (1 !== e ? s.push(e + " " + a) : n ? s.push(t) : s.push("1 " + t));
}
if (!e) return e;
a = a || 2, t = t || new Date();
var o = moment(t).diff(e);
o < 0 && (o = 0);
var i = moment.duration(o), s = [], c = i.years(), l = i.months(), u = i.days(), d = i.hours(), p = i.minutes(), m = i.seconds();
return r(c, "year", "years"), r(l, "month", "months"), r(u, "day", "days"), r(d, "hour", "hours"), r(p, "minute", "minutes"), r(m, "second", "seconds"), 1 === s.length && m && 1 === a ? n ? "minute" : "1 minute" : (0 === s.length && s.push("0 seconds"), s.length > a && (s.length = a), s.join(", "));
};
}).filter("ageLessThan", function() {
return function(e, t, n) {
return moment().subtract(t, n).diff(moment(e)) < 0;
};
}).filter("humanizeDurationValue", function() {
return function(e, t) {
return moment.duration(e, t).humanize();
};
}).filter("timeOnlyDurationFromTimestamps", [ "timeOnlyDurationFilter", function(e) {
return function(t, n) {
return t ? (n = n || new Date(), e(moment(n).diff(t))) : t;
};
} ]).filter("timeOnlyDuration", function() {
return function(e) {
var t = [], n = moment.duration(e), a = Math.floor(n.asHours()), r = n.minutes(), o = n.seconds();
return (a < 0 || r < 0 || o < 0) && (a = r = o = 0), a && t.push(a + "h"), r && t.push(r + "m"), a || t.push(o + "s"), t.join(" ");
};
}), angular.module("openshiftConsole").filter("storageClass", [ "annotationFilter", function(e) {
return function(t) {
return e(t, "volume.beta.kubernetes.io/storage-class");
};
} ]).filter("tags", [ "annotationFilter", function(e) {
return function(t, n) {
var a = e(t, n = n || "tags");
return a ? a.split(/\s*,\s*/) : [];
};
} ]).filter("imageStreamLastUpdated", function() {
return function(e) {
var t = e.metadata.creationTimestamp, n = moment(t);
return angular.forEach(e.status.tags, function(e) {
if (!_.isEmpty(e.items)) {
var a = moment(_.head(e.items).created);
a.isAfter(n) && (n = a, t = _.head(e.items).created);
}
}), t;
};
}).filter("buildConfigForBuild", [ "annotationFilter", "labelNameFilter", "labelFilter", function(e, t, n) {
var a = t("buildConfig");
return function(t) {
return e(t, "buildConfig") || n(t, a);
};
} ]).filter("icon", [ "annotationFilter", function(e) {
return function(t) {
var n = e(t, "icon");
return n || "";
};
} ]).filter("iconClass", [ "annotationFilter", function(e) {
return function(t, n) {
var a = e(t, "iconClass");
return a || ("template" === n ? "fa fa-clone" : "");
};
} ]).filter("imageName", function() {
return function(e) {
return e ? e.contains(":") ? e.split(":")[1] : e : "";
};
}).filter("imageStreamName", function() {
return function(e) {
if (!e) return "";
var t, n = e.split("@")[0], a = n.split("/");
return 3 === a.length ? (t = a[2].split(":"), a[1] + "/" + t[0]) : 2 === a.length ? n : 1 === a.length ? (t = n.split(":"))[0] : void 0;
};
}).filter("stripTag", function() {
return function(e) {
return e ? e.split(":")[0] : e;
};
}).filter("stripSHA", function() {
return function(e) {
return e ? e.split("@")[0] : e;
};
}).filter("imageSHA", function() {
return function(e) {
if (!e) return e;
var t = e.split("@");
return t.length > 1 ? t[1] : "";
};
}).filter("imageEnv", function() {
return function(e, t) {
for (var n = e.dockerImageMetadata.Config.Env, a = 0; a < _.size(n); a++) {
var r = n[a].split("=");
if (r[0] === t) return r[1];
}
return null;
};
}).filter("destinationSourcePair", function() {
return function(e) {
var t = {};
return angular.forEach(e, function(e) {
t[e.sourcePath] = e.destinationDir;
}), t;
};
}).filter("buildForImage", function() {
return function(e, t) {
for (var n = _.get(e, "dockerImageMetadata.Config.Env", []), a = 0; a < n.length; a++) {
var r = n[a].split("=");
if ("OPENSHIFT_BUILD_NAME" === r[0]) return t[r[1]];
}
return null;
};
}).filter("webhookURL", [ "DataService", function(e) {
return function(t, n, a, r) {
return e.url({
resource: "buildconfigs/webhooks/" + a + "/" + n.toLowerCase(),
name: t,
namespace: r
});
};
} ]).filter("isWebRoute", [ "routeHostFilter", function(e) {
return function(t) {
return !!e(t, !0) && "Subdomain" !== _.get(t, "spec.wildcardPolicy");
};
} ]).filter("routeWebURL", [ "routeHostFilter", function(e) {
return function(t, n, a) {
var r = (t.spec.tls && "" !== t.spec.tls.tlsTerminationType ? "https" : "http") + "://" + (n || e(t));
return t.spec.path && !a && (r += t.spec.path), r;
};
} ]).filter("routeLabel", [ "RoutesService", "routeHostFilter", "routeWebURLFilter", "isWebRouteFilter", function(e, t, n, a) {
return function(r, o, i) {
if (a(r)) return n(r, o, i);
var s = o || t(r);
return s ? ("Subdomain" === _.get(r, "spec.wildcardPolicy") && (s = "*." + e.getSubdomain(r)), i ? s : (r.spec.path && (s += r.spec.path), s)) : "<unknown host>";
};
} ]).filter("parameterPlaceholder", function() {
return function(e) {
return e.generate ? "(generated if empty)" : "";
};
}).filter("parameterValue", function() {
return function(e) {
return !e.value && e.generate ? "(generated)" : e.value;
};
}).filter("imageObjectRef", function() {
return function(e, t, n) {
if (!e) return "";
var a = e.namespace || t || "";
_.isEmpty(a) || (a += "/");
var r = e.kind;
if ("ImageStreamTag" === r || "ImageStreamImage" === r) return a + e.name;
if ("DockerImage" === r) {
var o = e.name;
return n && (o = o.substring(o.lastIndexOf("/") + 1)), o;
}
return a + e.name;
};
}).filter("orderByDisplayName", [ "displayNameFilter", "toArrayFilter", function(e, t) {
return function(n) {
var a = t(n);
return a.sort(function(t, n) {
var a = e(t) || "", r = e(n) || "";
return a === r && (a = _.get(t, "metadata.name", ""), r = _.get(n, "metadata.name", "")), a.localeCompare(r);
}), a;
};
} ]).filter("isPodStuck", function() {
return function(e) {
if ("Pending" !== e.status.phase) return !1;
var t = moment().subtract(5, "m");
return moment(e.metadata.creationTimestamp).isBefore(t);
};
}).filter("isContainerLooping", function() {
return function(e) {
return e.state.waiting && "CrashLoopBackOff" === e.state.waiting.reason;
};
}).filter("isContainerFailed", function() {
return function(e) {
return e.state.terminated && 0 !== e.state.terminated.exitCode;
};
}).filter("isContainerTerminatedSuccessfully", function() {
return function(e) {
return e.state.terminated && 0 === e.state.terminated.exitCode;
};
}).filter("isContainerUnprepared", function() {
return function(e) {
if (!e.state.running || !1 !== e.ready || !e.state.running.startedAt) return !1;
var t = moment().subtract(5, "m");
return moment(e.state.running.startedAt).isBefore(t);
};
}).filter("isTroubledPod", [ "isPodStuckFilter", "isContainerLoopingFilter", "isContainerFailedFilter", "isContainerUnpreparedFilter", function(e, t, n, a) {
return function(r) {
if ("Unknown" === r.status.phase) return !0;
if (e(r)) return !0;
if ("Running" === r.status.phase && r.status.containerStatuses) {
var o;
for (o = 0; o < _.size(r.status.containerStatuses); ++o) {
var i = r.status.containerStatuses[o];
if (i.state) {
if (n(i)) return !0;
if (t(i)) return !0;
if (a(i)) return !0;
}
}
}
return !1;
};
} ]).filter("podWarnings", [ "isPodStuckFilter", "isContainerLoopingFilter", "isContainerFailedFilter", "isContainerUnpreparedFilter", "isTerminatingFilter", function(e, t, n, a, r) {
return function(o) {
var i = [];
return "Unknown" === o.status.phase && i.push({
reason: "Unknown",
pod: o.metadata.name,
message: "The state of the pod could not be obtained. This is typically due to an error communicating with the host of the pod."
}), e(o) && i.push({
reason: "Stuck",
pod: o.metadata.name,
message: "The pod has been stuck in the pending state for more than five minutes."
}), "Running" === o.status.phase && o.status.containerStatuses && _.each(o.status.containerStatuses, function(e) {
if (!e.state) return !1;
n(e) && (r(o) ? i.push({
severity: "error",
reason: "NonZeroExitTerminatingPod",
pod: o.metadata.name,
container: e.name,
message: "The container " + e.name + " did not stop cleanly when terminated (exit code " + e.state.terminated.exitCode + ")."
}) : i.push({
severity: "warning",
reason: "NonZeroExit",
pod: o.metadata.name,
container: e.name,
message: "The container " + e.name + " failed (exit code " + e.state.terminated.exitCode + ")."
})), t(e) && i.push({
severity: "error",
reason: "Looping",
pod: o.metadata.name,
container: e.name,
message: "The container " + e.name + " is crashing frequently. It must wait before it will be restarted again."
}), a(e) && i.push({
severity: "warning",
reason: "Unprepared",
pod: o.metadata.name,
container: e.name,
message: "The container " + e.name + " has been running for more than five minutes and has not passed its readiness check."
});
}), i.length > 0 ? i : null;
};
} ]).filter("groupedPodWarnings", [ "podWarningsFilter", function(e) {
return function(t, n) {
var a = n || {};
return _.each(t, function(t) {
var n = e(t);
_.each(n, function(e) {
var t = e.reason + (e.container || "");
a[t] = a[t] || [], a[t].push(e);
});
}), a;
};
} ]).filter("troubledPods", [ "isTroubledPodFilter", function(e) {
return function(t) {
var n = [];
return angular.forEach(t, function(t) {
e(t) && n.push(t);
}), n;
};
} ]).filter("notTroubledPods", [ "isTroubledPodFilter", function(e) {
return function(t) {
var n = [];
return angular.forEach(t, function(t) {
e(t) || n.push(t);
}), n;
};
} ]).filter("projectOverviewURL", [ "Navigate", function(e) {
return function(t) {
return angular.isString(t) ? e.projectOverviewURL(t) : angular.isObject(t) ? e.projectOverviewURL(t.metadata && t.metadata.name) : e.projectOverviewURL("");
};
} ]).filter("createFromSourceURL", function() {
return function(e, t) {
return URI.expand("project/{project}/catalog/images{?q*}", {
project: e,
q: {
builderfor: t
}
}).toString();
};
}).filter("createFromImageURL", [ "Navigate", function(e) {
return function(t, n, a, r) {
return e.createFromImageURL(t, n, a, r);
};
} ]).filter("createFromTemplateURL", [ "Navigate", function(e) {
return function(t, n, a) {
return e.createFromTemplateURL(t, n, a);
};
} ]).filter("failureObjectName", function() {
return function(e) {
if (!e.data || !e.data.details) return null;
var t = e.data.details;
return t.kind ? t.id ? t.kind + " " + t.id : t.kind : t.id;
};
}).filter("isIncompleteBuild", [ "ageLessThanFilter", function(e) {
return function(e) {
if (!e || !e.status || !e.status.phase) return !1;
switch (e.status.phase) {
case "New":
case "Pending":
case "Running":
return !0;

default:
return !1;
}
};
} ]).filter("isRecentBuild", [ "ageLessThanFilter", "isIncompleteBuildFilter", function(e, t) {
return function(n) {
if (!(n && n.status && n.status.phase && n.metadata)) return !1;
if (t(n)) return !0;
var a = n.status.completionTimestamp || n.metadata.creationTimestamp;
return e(a, 5, "minutes");
};
} ]).filter("deploymentCauses", [ "annotationFilter", function(e) {
return function(t) {
if (!t) return [];
var n = e(t, "encodedDeploymentConfig");
if (!n) return [];
try {
var a = $.parseJSON(n);
if (!a) return [];
switch (a.apiVersion) {
case "v1beta1":
return a.details.causes;

case "v1beta3":
case "v1":
return a.status.details ? a.status.details.causes : [];

default:
return Logger.error('Unknown API version "' + a.apiVersion + '" in encoded deployment config for deployment ' + t.metadata.name), a.status && a.status.details && a.status.details.causes ? a.status.details.causes : [];
}
} catch (e) {
return Logger.error("Failed to parse encoded deployment config", e), [];
}
};
} ]).filter("desiredReplicas", function() {
return function(e) {
return e && e.spec ? void 0 === e.spec.replicas ? 1 : e.spec.replicas : 0;
};
}).filter("serviceImplicitDNSName", function() {
return function(e) {
return e && e.metadata && e.metadata.name && e.metadata.namespace ? e.metadata.name + "." + e.metadata.namespace + ".svc" : "";
};
}).filter("podsForPhase", function() {
return function(e, t) {
var n = [];
return angular.forEach(e, function(e) {
e.status.phase === t && n.push(e);
}), n;
};
}).filter("numContainersReady", function() {
return function(e) {
var t = 0;
return angular.forEach(e.status.containerStatuses, function(e) {
e.ready && t++;
}), t;
};
}).filter("numContainerRestarts", function() {
return function(e) {
var t = 0;
return angular.forEach(e.status.containerStatuses, function(e) {
t += e.restartCount;
}), t;
};
}).filter("isTerminating", function() {
return function(e) {
return _.has(e, "metadata.deletionTimestamp");
};
}).filter("isPullingImage", function() {
return function(e) {
if (!e) return !1;
if ("Pending" !== _.get(e, "status.phase")) return !1;
var t = _.get(e, "status.containerStatuses");
if (!t) return !1;
return _.some(t, function(e) {
return "ContainerCreating" === _.get(e, "state.waiting.reason");
});
};
}).filter("newestResource", function() {
return function(e) {
var t = null;
return angular.forEach(e, function(e) {
if (t) moment(t.metadata.creationTimestamp).isBefore(e.metadata.creationTimestamp) && (t = e); else {
if (!e.metadata.creationTimestamp) return;
t = e;
}
}), t;
};
}).filter("deploymentIsLatest", [ "annotationFilter", function(e) {
return function(t, n) {
return !(!n || !t) && parseInt(e(t, "deploymentVersion")) === n.status.latestVersion;
};
} ]).filter("deploymentStatus", [ "annotationFilter", "hasDeploymentConfigFilter", function(e, t) {
return function(n) {
if (e(n, "deploymentCancelled")) return "Cancelled";
var a = e(n, "deploymentStatus");
return !t(n) || "Complete" === a && n.spec.replicas > 0 ? "Active" : a;
};
} ]).filter("deploymentIsInProgress", [ "deploymentStatusFilter", function(e) {
return function(t) {
return [ "New", "Pending", "Running" ].indexOf(e(t)) > -1;
};
} ]).filter("anyDeploymentIsInProgress", [ "deploymentIsInProgressFilter", function(e) {
return function(t) {
return _.some(t, e);
};
} ]).filter("getActiveDeployment", [ "DeploymentsService", function(e) {
return function(t) {
return e.getActiveDeployment(t);
};
} ]).filter("isRecentDeployment", [ "deploymentIsLatestFilter", "deploymentIsInProgressFilter", function(e, t) {
return function(n, a) {
return !!e(n, a) || !!t(n);
};
} ]).filter("buildStrategy", function() {
return function(e) {
if (!e || !e.spec || !e.spec.strategy) return null;
switch (e.spec.strategy.type) {
case "Source":
return e.spec.strategy.sourceStrategy;

case "Docker":
return e.spec.strategy.dockerStrategy;

case "Custom":
return e.spec.strategy.customStrategy;

case "JenkinsPipeline":
return e.spec.strategy.jenkinsPipelineStrategy;

default:
return null;
}
};
}).filter("isBinaryBuild", function() {
return function(e) {
return _.has(e, "spec.source.binary");
};
}).filter("isJenkinsPipelineStrategy", function() {
return function(e) {
return "JenkinsPipeline" === _.get(e, "spec.strategy.type");
};
}).filter("jenkinsLogURL", [ "annotationFilter", function(e) {
return function(t, n) {
var a = e(t, "jenkinsLogURL");
return !a || n ? a : a.replace(/\/consoleText$/, "/console");
};
} ]).filter("jenkinsBuildURL", [ "annotationFilter", "jenkinsLogURLFilter", function(e, t) {
return function(t) {
return e(t, "jenkinsBuildURL");
};
} ]).filter("jenkinsInputURL", [ "jenkinsBuildURLFilter", function(e) {
return function(t) {
var n = e(t);
return n ? new URI(n).segment("/input/").toString() : null;
};
} ]).filter("buildLogURL", [ "isJenkinsPipelineStrategyFilter", "jenkinsLogURLFilter", "navigateResourceURLFilter", function(e, t, n) {
return function(a) {
if (e(a)) return t(a);
var r = n(a);
return r ? new URI(r).addSearch("tab", "logs").toString() : null;
};
} ]).filter("jenkinsfileLink", [ "isJenkinsPipelineStrategyFilter", "githubLinkFilter", function(e, t) {
return function(n) {
if (!e(n) || _.has(n, "spec.strategy.jenkinsPipelineStrategy.jenkinsfile")) return "";
var a = _.get(n, "spec.source.git.uri");
if (!a) return "";
var r = _.get(n, "spec.source.git.ref"), o = _.get(n, "spec.strategy.jenkinsPipelineStrategy.jenkinsfilePath", "Jenkinsfile"), i = _.get(n, "spec.source.contextDir");
i && (o = URI.joinPaths(i, o).path());
var s = t(a, r, o);
return URI(s).is("url") ? s : "";
};
} ]).filter("pipelineStageComplete", function() {
return function(e) {
return !!e && -1 !== _.indexOf([ "ABORTED", "FAILED", "SUCCESS" ], e.status);
};
}).filter("pipelineStagePendingInput", function() {
return function(e) {
return !!e && "PAUSED_PENDING_INPUT" === e.status;
};
}).filter("deploymentStrategyParams", function() {
return function(e) {
switch (_.get(e, "spec.strategy.type")) {
case "Recreate":
return _.get(e, "spec.strategy.recreateParams", {});

case "Rolling":
return _.get(e, "spec.strategy.rollingParams", {});

case "Custom":
return _.get(e, "spec.strategy.customParams", {});

default:
return null;
}
};
}).filter("humanizeTLSTermination", function() {
return function(e) {
switch (e) {
case "edge":
return "Edge";

case "passthrough":
return "Passthrough";

case "reencrypt":
return "Re-encrypt";

default:
return e;
}
};
}).filter("kindToResource", [ "APIService", function(e) {
return e.kindToResource;
} ]).filter("abbreviateResource", [ "APIService", function(e) {
var t = {
buildconfigs: "bc",
deploymentconfigs: "dc",
horizontalpodautoscalers: "hpa",
imagestreams: "is",
imagestreamtags: "istag",
replicasets: "rs",
replicationcontrollers: "rc",
services: "svc"
};
return function(e) {
return t[e] || e;
};
} ]).filter("humanizeQuotaResource", function() {
return function(e, t) {
if (!e) return e;
var n = {
configmaps: "Config Maps",
cpu: "CPU (Request)",
"limits.cpu": "CPU (Limit)",
"limits.memory": "Memory (Limit)",
memory: "Memory (Request)",
"openshift.io/imagesize": "Image Size",
"openshift.io/imagestreamsize": "Image Stream Size",
"openshift.io/projectimagessize": "Project Image Size",
persistentvolumeclaims: "Persistent Volume Claims",
"requests.storage": "Storage (Request)",
pods: "Pods",
replicationcontrollers: "Replication Controllers",
"requests.cpu": "CPU (Request)",
"requests.memory": "Memory (Request)",
resourcequotas: "Resource Quotas",
secrets: "Secrets",
services: "Services",
"services.loadbalancers": "Service Load Balancers",
"services.nodeports": "Service Node Ports"
}, a = {
configmaps: "config maps",
cpu: "CPU (request)",
"limits.cpu": "CPU (limit)",
"limits.memory": "memory (limit)",
memory: "memory (request)",
"openshift.io/imagesize": "image size",
"openshift.io/imagestreamsize": "image stream size",
"openshift.io/projectimagessize": "project image size",
persistentvolumeclaims: "persistent volume claims",
"requests.storage": "storage (request)",
replicationcontrollers: "replication controllers",
"requests.cpu": "CPU (request)",
"requests.memory": "memory (request)",
resourcequotas: "resource quotas",
"services.loadbalancers": "service load balancers",
"services.nodeports": "service node ports"
};
return t ? n[e] || e : a[e] || e;
};
}).filter("routeTargetPortMapping", [ "RoutesService", function(e) {
var t = function(e, t, n) {
var a = "Service Port " + (e = e || "<unknown>") + " → Container Port " + (t = t || "<unknown>");
return n && (a += " (" + n + ")"), a;
};
return function(n, a) {
if (!n.spec.port || !n.spec.port.targetPort || !a) return "";
var r = n.spec.port.targetPort, o = e.getServicePortForRoute(r, a);
return o ? t(o.port, o.targetPort, o.protocol) : angular.isString(r) ? t(r, null) : t(null, r);
};
} ]).filter("podStatus", function() {
return function(e) {
if (!e || !e.metadata.deletionTimestamp && !e.status) return "";
if (e.metadata.deletionTimestamp) return "Terminating";
var t = e.status.reason || e.status.phase;
return angular.forEach(e.status.containerStatuses, function(e) {
var n, a, r = _.get(e, "state.waiting.reason") || _.get(e, "state.terminated.reason");
r ? t = r : (n = _.get(e, "state.terminated.signal")) ? t = "Signal: " + n : (a = _.get(e, "state.terminated.exitCode")) && (t = "Exit Code: " + a);
}), t;
};
}).filter("podStartTime", function() {
return function(e) {
var t = null;
return _.each(_.get(e, "status.containerStatuses"), function(e) {
var n = _.get(e, "state.running") || _.get(e, "state.terminated");
n && (t && !moment(n.startedAt).isBefore(t) || (t = n.startedAt));
}), t;
};
}).filter("podCompletionTime", function() {
return function(e) {
var t = null;
return _.each(_.get(e, "status.containerStatuses"), function(e) {
var n = _.get(e, "state.terminated");
n && (t && !moment(n.finishedAt).isAfter(t) || (t = n.finishedAt));
}), t;
};
}).filter("routeIngressCondition", function() {
return function(e, t) {
return e ? _.find(e.conditions, {
type: t
}) : null;
};
}).filter("routeHost", function() {
return function(e, t) {
if (!_.get(e, "status.ingress")) return _.get(e, "spec.host");
if (!e.status.ingress) return e.spec.host;
var n = null;
return angular.forEach(e.status.ingress, function(e) {
_.some(e.conditions, {
type: "Admitted",
status: "True"
}) && (!n || n.lastTransitionTime > e.lastTransitionTime) && (n = e);
}), n ? n.host : t ? null : e.spec.host;
};
}).filter("isRequestCalculated", [ "LimitRangesService", function(e) {
return function(t, n) {
return e.isRequestCalculated(t, n);
};
} ]).filter("isLimitCalculated", [ "LimitRangesService", function(e) {
return function(t, n) {
return e.isLimitCalculated(t, n);
};
} ]).filter("hpaCPUPercent", [ "HPAService", "LimitRangesService", function(e, t) {
return function(n, a) {
return n && t.isRequestCalculated("cpu", a) ? e.convertRequestPercentToLimit(n, a) : n;
};
} ]).filter("podTemplate", function() {
return function(e) {
return e ? "Pod" === e.kind ? e : _.get(e, "spec.template") : null;
};
}).filter("hasHealthChecks", function() {
return function(e) {
var t = _.get(e, "spec.containers", []);
return _.every(t, function(e) {
return e.readinessProbe || e.livenessProbe;
});
};
}).filter("scopeDetails", [ "sentenceCaseFilter", function(e) {
var t = {
Terminating: "Affects pods that have an active deadline. These pods usually include builds, deployers, and jobs.",
NotTerminating: "Affects pods that do not have an active deadline. These pods usually include your applications.",
BestEffort: "Affects pods that do not have resource limits set. These pods have a best effort quality of service.",
NotBestEffort: "Affects pods that have at least one resource limit set. These pods do not have a best effort quality of service."
};
return function(n) {
return t[n] || e(n);
};
} ]).filter("isDebugPod", [ "annotationFilter", function(e) {
return function(t) {
return !!e(t, "debug.openshift.io/source-resource");
};
} ]).filter("debugPodSourceName", [ "annotationFilter", function(e) {
return function(t) {
var n = e(t, "debug.openshift.io/source-resource");
if (!n) return "";
var a = n.split("/");
return 2 !== a.length ? (Logger.warn('Invalid debug.openshift.io/source-resource annotation value "' + n + '"'), "") : a[1];
};
} ]).filter("entrypoint", function() {
var e = function(e) {
return _.isArray(e) ? e.join(" ") : e;
};
return function(t, n) {
if (!t) return null;
var a, r = e(t.command), o = e(t.args);
if (r && o) return r + " " + o;
if (r) return r;
if (n) {
if (a = e(_.get(n, "dockerImageMetadata.Config.Entrypoint") || [ "/bin/sh", "-c" ]), o) return a + " " + o;
if (r = e(_.get(n, "dockerImageMetadata.Config.Cmd"))) return a + " " + r;
}
return o ? "<image-entrypoint> " + o : null;
};
}).filter("unidleTargetReplicas", [ "annotationFilter", function(e) {
return function(t, n) {
var a;
if (t) try {
a = parseInt(e(t, "idledPreviousScale"));
} catch (e) {
Logger.error("Unable to parse previous scale annotation as a number.");
}
return a || _.get(_.head(n), "spec.minReplicas") || 1;
};
} ]).filter("lastDeploymentRevision", [ "annotationFilter", function(e) {
return function(t) {
if (!t) return "";
var n = e(t, "deployment.kubernetes.io/revision");
return n ? "#" + n : "Unknown";
};
} ]).filter("hasPostCommitHook", function() {
return function(e) {
return _.has(e, "spec.postCommit.command") || _.has(e, "spec.postCommit.script") || _.has(e, "spec.postCommit.args");
};
}).filter("volumeMountMode", function() {
var e = function(e) {
return _.has(e, "configMap") || _.has(e, "secret");
};
return function(t, n) {
if (!t) return "";
var a = _.find(n, {
name: t.name
});
return e(a) ? "read-only" : _.get(a, "persistentVolumeClaim.readOnly") ? "read-only" : t.readOnly ? "read-only" : "read-write";
};
}).filter("managesRollouts", [ "APIService", function(e) {
return function(t) {
if (!t) return !1;
var n = e.objectToResourceGroupVersion(t);
return "deploymentconfigs" === n.resource && !n.group || "deployments" === n.resource && ("apps" === n.group || "extensions" === n.group);
};
} ]).filter("hasAlternateBackends", function() {
return function(e) {
var t = _.get(e, "spec.alternateBackends", []);
return !_.isEmpty(t);
};
}).filter("serviceInstanceDisplayName", function() {
return function(e, t) {
var n = e.spec.serviceClassName, a = e.metadata.name;
return _.get(t, [ n, "externalMetadata", "displayName" ]) || n || a;
};
}).filter("serviceInstanceStatus", [ "isServiceInstanceReadyFilter", function(e) {
return function(t) {
var n = "Pending", a = _.get(t, "status.conditions");
return _.find(a, {
type: "Failed",
status: "True"
}) ? n = "Failed" : e(t) && (n = "Ready"), n;
};
} ]).filter("readyConditionMessage", [ "statusConditionFilter", function(e) {
return function(t) {
return _.get(e(t, "Ready"), "message");
};
} ]).filter("failedConditionMessage", [ "statusConditionFilter", function(e) {
return function(t) {
return _.get(e(t, "Failed"), "message");
};
} ]).filter("serviceInstanceConditionMessage", [ "serviceInstanceStatusFilter", "statusConditionFilter", function(e, t) {
return function(n) {
var a = e(n), r = null;
switch (a) {
case "Failed":
case "Ready":
r = _.get(t(n, a), "message");
}
return r;
};
} ]), angular.module("openshiftConsole").filter("canIDoAny", [ "canIFilter", function(e) {
var t = {
buildConfigs: [ {
group: "",
resource: "buildconfigs",
verbs: [ "delete", "update" ]
}, {
group: "",
resource: "buildconfigs/instantiate",
verbs: [ "create" ]
} ],
builds: [ {
group: "",
resource: "builds/clone",
verbs: [ "create" ]
}, {
group: "",
resource: "builds",
verbs: [ "delete", "update" ]
} ],
configmaps: [ {
group: "",
resource: "configmaps",
verbs: [ "update", "delete" ]
} ],
deployments: [ {
group: "autoscaling",
resource: "horizontalpodautoscalers",
verbs: [ "create", "update" ]
}, {
group: "apps",
resource: "deployments",
verbs: [ "update", "delete" ]
} ],
deploymentConfigs: [ {
group: "autoscaling",
resource: "horizontalpodautoscalers",
verbs: [ "create", "update" ]
}, {
group: "",
resource: "deploymentconfigs",
verbs: [ "create", "update" ]
} ],
horizontalPodAutoscalers: [ {
group: "autoscaling",
resource: "horizontalpodautoscalers",
verbs: [ "update", "delete" ]
} ],
imageStreams: [ {
group: "",
resource: "imagestreams",
verbs: [ "update", "delete" ]
} ],
serviceInstances: [ {
group: "servicecatalog.k8s.io",
resource: "serviceinstances",
verbs: [ "update", "delete" ]
} ],
persistentVolumeClaims: [ {
group: "",
resource: "persistentvolumeclaims",
verbs: [ "update", "delete" ]
} ],
pods: [ {
group: "",
resource: "pods",
verbs: [ "update", "delete" ]
}, {
group: "",
resource: "deploymentconfigs",
verbs: [ "update" ]
} ],
replicaSets: [ {
group: "autoscaling",
resource: "horizontalpodautoscalers",
verbs: [ "create", "update" ]
}, {
group: "extensions",
resource: "replicasets",
verbs: [ "update", "delete" ]
} ],
replicationControllers: [ {
group: "",
resource: "replicationcontrollers",
verbs: [ "update", "delete" ]
} ],
routes: [ {
group: "",
resource: "routes",
verbs: [ "update", "delete" ]
} ],
services: [ {
group: "",
resource: "services",
verbs: [ "update", "create", "delete" ]
} ],
secrets: [ {
group: "",
resource: "secrets",
verbs: [ "update", "delete" ]
} ],
projects: [ {
group: "",
resource: "projects",
verbs: [ "delete", "update" ]
} ],
statefulsets: [ {
group: "apps",
resource: "statefulsets",
verbs: [ "update", "delete" ]
} ]
};
return function(n) {
return _.some(t[n], function(t) {
return _.some(t.verbs, function(n) {
return e({
resource: t.resource,
group: t.group
}, n);
});
});
};
} ]).filter("canIScale", [ "canIFilter", "hasDeploymentConfigFilter", "DeploymentsService", function(e, t, n) {
return function(t) {
var a = n.getScaleResource(t);
return e(a, "update");
};
} ]), angular.module("openshiftConsole").filter("underscore", function() {
return function(e) {
return e.replace(/\./g, "_");
};
}).filter("defaultIfBlank", function() {
return function(e, t) {
return null === e ? t : ("string" != typeof e && (e = String(e)), 0 === e.trim().length ? t : e);
};
}).filter("keys", function() {
return _.keys;
}).filter("usageValue", function() {
return function(e) {
if (!e) return e;
var t = /(-?[0-9\.]+)\s*(.*)/.exec(e);
if (!t) return e;
var n = t[1];
n = n.indexOf(".") >= 0 ? parseFloat(n) : parseInt(t[1]);
var a = 1;
switch (t[2]) {
case "E":
a = Math.pow(1e3, 6);
break;

case "P":
a = Math.pow(1e3, 5);
break;

case "T":
a = Math.pow(1e3, 4);
break;

case "G":
a = Math.pow(1e3, 3);
break;

case "M":
a = Math.pow(1e3, 2);
break;

case "K":
case "k":
a = 1e3;
break;

case "m":
a = .001;
break;

case "Ei":
a = Math.pow(1024, 6);
break;

case "Pi":
a = Math.pow(1024, 5);
break;

case "Ti":
a = Math.pow(1024, 4);
break;

case "Gi":
a = Math.pow(1024, 3);
break;

case "Mi":
a = Math.pow(1024, 2);
break;

case "Ki":
a = 1024;
}
return n * a;
};
}).filter("humanizeUnit", function() {
return function(e, t, n) {
switch (t) {
case "memory":
case "limits.memory":
case "requests.memory":
case "storage":
return e ? e + "B" : e;

case "cpu":
case "limits.cpu":
case "requests.cpu":
"m" === e && (e = "milli");
var a = n ? "core" : "cores";
return (e || "") + a;

default:
return e;
}
};
}).filter("amountAndUnit", [ "humanizeUnitFilter", function(e) {
return function(t, n, a) {
if (!t) return [ t, null ];
var r = /(-?[0-9\.]+)\s*(.*)/.exec(t);
if (!r) return [ t, null ];
var o = r[1], i = r[2];
return a && (i = e(i, n, "1" === o)), [ o, i ];
};
} ]).filter("usageWithUnits", [ "amountAndUnitFilter", function(e) {
return function(t, n) {
return _.spread(function(e, t) {
return t ? e + " " + t : e;
})(e(t, n, !0));
};
} ]).filter("humanizeSize", function() {
return function(e) {
if (null === e || void 0 === e || "" === e) return e;
if ((e = Number(e)) < 1024) return e + " bytes";
var t = e / 1024;
if (t < 1024) return t.toFixed(1) + " KiB";
var n = t / 1024;
return n < 1024 ? n.toFixed(1) + " MiB" : (n / 1024).toFixed(1) + " GiB";
};
}).filter("computeResourceLabel", function() {
return function(e, t) {
switch (e) {
case "cpu":
return "CPU";

case "memory":
return t ? "Memory" : "memory";

default:
return e;
}
};
}).filter("helpLink", [ "Constants", function(e) {
return function(t) {
var n = e.HELP[t] || e.HELP.default;
return URI(n).is("absolute") || (n = e.HELP_BASE_URL + n), n;
};
} ]).filter("taskTitle", function() {
return function(e) {
return "completed" !== e.status ? e.titles.started : e.hasErrors ? e.titles.failure : e.titles.success;
};
}).filter("httpHttps", function() {
return function(e) {
return e ? "https://" : "http://";
};
}).filter("isGithubLink", function() {
var e = /^(?:https?:\/\/|git:\/\/|git\+ssh:\/\/|git\+https:\/\/)?(?:[^@]+@)?github\.com[:\/]([^\/]+\/[^\/]+?)(\/|(?:\.git(#.*)?))?$/;
return function(t) {
return t ? e.test(t) : t;
};
}).filter("githubLink", function() {
return function(e, t, n) {
var a = e.match(/^(?:https?:\/\/|git:\/\/|git\+ssh:\/\/|git\+https:\/\/)?(?:[^@]+@)?github\.com[:\/]([^\/]+\/[^\/]+?)(\/|(?:\.git(#.*)?))?$/);
return a && (e = "https://github.com/" + a[1], n && "/" === n.charAt(0) && (n = n.substring(1)), n ? (n = (n = encodeURIComponent(n)).replace("%2F", "/"), e += "/tree/" + encodeURIComponent(t || "master") + "/" + n) : t && "master" !== t && (e += "/tree/" + encodeURIComponent(t))), e;
};
}).filter("yesNo", function() {
return function(e) {
return e ? "Yes" : "No";
};
}).filter("valuesIn", function() {
return function(e, t) {
if (!t) return {};
var n = t.split(","), a = {};
return angular.forEach(e, function(e, t) {
-1 !== n.indexOf(t) && (a[t] = e);
}), a;
};
}).filter("valuesNotIn", function() {
return function(e, t) {
if (!t) return e;
var n = t.split(","), a = {};
return angular.forEach(e, function(e, t) {
-1 === n.indexOf(t) && (a[t] = e);
}), a;
};
}).filter("stripSHAPrefix", function() {
return function(e) {
return e ? e.replace(/^sha256:/, "") : e;
};
}).filter("limitToOrAll", [ "limitToFilter", function(e) {
return function(t, n) {
return isNaN(n) ? t : e(t, n);
};
} ]).filter("getErrorDetails", function() {
return function(e) {
var t = e.data || {};
if (t.message) return "Reason: " + t.message;
var n = e.status || t.status;
return n ? "Status: " + n : "";
};
}).filter("humanize", function() {
return function(e) {
return e.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/\b([A-Z]+)([A-Z])([a-z])/, "$1 $2$3").replace(/^./, function(e) {
return e.toUpperCase();
});
};
}).filter("navigateResourceURL", [ "Navigate", function(e) {
return function(t, n, a, r) {
return e.resourceURL(t, n, a, null, {
apiVersion: r
});
};
} ]).filter("navigateEventInvolvedObjectURL", [ "Navigate", function(e) {
return function(t) {
return e.resourceURL(t.involvedObject.name, t.involvedObject.kind, t.involvedObject.namespace, null, {
apiVersion: t.involvedObject.apiVersion
});
};
} ]).filter("navigateToTabURL", [ "Navigate", function(e) {
return function(t, n) {
return e.resourceURL(t, null, null, null, {
tab: n
});
};
} ]).filter("configURLForResource", [ "Navigate", function(e) {
return function(t, n) {
return e.configURLForResource(t, n);
};
} ]).filter("editResourceURL", [ "Navigate", function(e) {
return function(t, n, a) {
return e.resourceURL(t, n, a, "edit");
};
} ]).filter("editYamlURL", [ "Navigate", function(e) {
return function(t, n) {
return e.yamlURL(t, n);
};
} ]).filter("join", function() {
return function(e, t) {
return t || (t = ","), e.join(t);
};
}).filter("accessModes", function() {
return function(e, t) {
if (!e) return e;
var n = [];
return angular.forEach(e, function(e) {
var a, r = "long" === t;
switch (e) {
case "ReadWriteOnce":
a = r ? "RWO (Read-Write-Once)" : "Read-Write-Once";
break;

case "ReadOnlyMany":
a = r ? "ROX (Read-Only-Many)" : "Read-Only-Many";
break;

case "ReadWriteMany":
a = r ? "RWX (Read-Write-Many)" : "Read-Write-Many";
break;

default:
a = e;
}
n.push(a);
}), _.uniq(n);
};
}).filter("middleEllipses", function() {
return function(e, t, n) {
if (t < 3) return e;
if (e.length <= t) return e;
n || (n = "...");
var a = Math.floor((t - 1) / 2);
return e.slice(0, a) + n + e.slice(e.length - a);
};
}).filter("isNil", function() {
return function(e) {
return null === e || void 0 === e;
};
}).filter("percent", function() {
return function(e, t) {
return null === e || void 0 === e ? e : _.round(100 * Number(e), t) + "%";
};
}).filter("filterCollection", function() {
return function(e, t) {
return e && t ? _.filter(e, t) : e;
};
}).filter("isAbsoluteURL", function() {
return function(e) {
if (!e) return !1;
var t = new URI(e), n = t.protocol();
return t.is("absolute") && ("http" === n || "https" === n);
};
}).filter("isIE", function() {
var e = navigator.userAgent, t = /msie|trident/i.test(e);
return function() {
return t;
};
}).filter("isEdge", function() {
var e = navigator.userAgent, t = /chrome.+? edge/i.test(e);
return function() {
return t;
};
}).filter("abs", function() {
return function(e) {
return Math.abs(e);
};
}).filter("encodeURIComponent", function() {
return window.encodeURIComponent;
}).filter("enableTechPreviewFeature", [ "Constants", function(e) {
return function(t) {
return _.get(e, [ "ENABLE_TECH_PREVIEW_FEATURE", t ], !1);
};
} ]), angular.module("openshiftConsole").factory("logLinks", [ "$anchorScroll", "$document", "$location", "$window", function(e, t, n, a) {
var r = _.template([ "/#/discover?", "_g=(", "time:(", "from:now-1w,", "mode:relative,", "to:now", ")", ")", "&_a=(", "columns:!(kubernetes.container_name,message),", "index:'project.<%= namespace %>.<%= namespaceUid %>.*',", "query:(", "query_string:(", "analyze_wildcard:!t,", 'query:\'kubernetes.pod_name:"<%= podname %>" AND kubernetes.namespace_name:"<%= namespace %>"\'', ")", "),", "sort:!('@timestamp',desc)", ")", "#console_container_name=<%= containername %>", "&console_back_url=<%= backlink %>" ].join(""));
return {
scrollTop: function(e) {
e ? e.scrollTop = 0 : window.scrollTo(null, 0);
},
scrollBottom: function(e) {
e ? e.scrollTop = e.scrollHeight : window.scrollTo(0, document.documentElement.scrollHeight - document.documentElement.clientHeight);
},
chromelessLink: function(e, t) {
if (t) a.open(t, "_blank"); else {
var n = {
view: "chromeless"
};
e && e.container && (n.container = e.container), n = _.flatten([ n ]);
var r = new URI();
_.each(n, function(e) {
r.addSearch(e);
}), a.open(r.toString(), "_blank");
}
},
archiveUri: function(e) {
return r(e);
}
};
} ]), angular.module("javaLinkExtension", [ "openshiftConsole" ]).run([ "AuthService", "BaseHref", "DataService", "extensionRegistry", function(e, t, n, a) {
var r = [ "<div row ", 'ng-show="item.url" ', 'class="icon-row" ', 'title="Connect to container">', '<div class="icon-wrap">', '<i class="fa fa-share" aria-hidden="true"></i>', "</div>", "<div flex>", '<a ng-click="item.onClick($event)" ', 'ng-href="item.url">', "Open Java Console", "</a>", "</div>", "</div>" ].join(""), o = function(e, t, a) {
return new URI(n.url({
resource: "pods/proxy",
name: [ "https", t, a || "" ].join(":"),
namespace: e
})).segment("jolokia/");
};
a.add("container-links", _.spread(function(n, a) {
var i = _.find(n.ports || [], function(e) {
return e.name && "jolokia" === e.name.toLowerCase();
});
if (i && "Running" === _.get(a, "status.phase")) {
var s = a.status.containerStatuses, c = _.find(s, function(e) {
return e.name === n.name;
});
if (c && c.ready) {
var l = a.metadata.name, u = a.metadata.namespace, d = o(u, l, i.containerPort).toString();
return {
type: "dom",
node: r,
onClick: function(a) {
a.preventDefault(), a.stopPropagation();
var r = window.location.href, o = n.name || "Untitled Container", i = e.UserStore().getToken() || "", s = new URI().path(t).segment("java").segment("").hash(i).query({
jolokiaUrl: d,
title: o,
returnTo: r
});
window.location.href = s.toString();
},
url: d
};
}
}
}));
} ]), hawtioPluginLoader.addModule("javaLinkExtension"), angular.module("openshiftConsole").run([ "extensionRegistry", function(e) {
e.add("nav-help-dropdown", function() {
var e = [];
if (e.push({
type: "dom",
node: '<li><a target="_blank" href="{{\'default\' | helpLink}}">Documentation</a></li>'
}), !_.get(window, "OPENSHIFT_CONSTANTS.DISABLE_SERVICE_CATALOG_LANDING_PAGE")) {
var t = _.get(window, "OPENSHIFT_CONSTANTS.GUIDED_TOURS.landing_page_tour");
t && t.enabled && t.steps && e.push({
type: "dom",
node: '<li><a href="./?startTour=true">Tour Home Page</a></li>'
});
}
return e.push({
type: "dom",
node: '<li><a href="command-line">Command Line Tools</a></li>'
}), e.push({
type: "dom",
node: '<li><a href="about">About</a></li>'
}), e;
});
} ]), angular.module("openshiftConsole").run([ "extensionRegistry", "$rootScope", "DataService", "AuthService", function(e, t, n, a) {
e.add("nav-user-dropdown", function() {
var e = [];
_.get(window, "OPENSHIFT_CONSTANTS.DISABLE_COPY_LOGIN_COMMAND") || e.push({
type: "dom",
node: '<li><copy-login-to-clipboard clipboard-text="oc login ' + _.escape(n.openshiftAPIBaseUrl()) + " --token=" + _.escape(a.UserStore().getToken()) + '"></copy-login-to-clipboard></li>'
});
var r = "Log Out";
return t.user.fullName && t.user.fullName !== t.user.metadata.name && (r += " (" + t.user.metadata.name + ")"), e.push({
type: "dom",
node: '<li><a href="logout">' + _.escape(r) + "</a></li>"
}), e;
});
} ]), angular.module("openshiftConsole").run([ "extensionRegistry", "Constants", function(e, t) {
e.add("nav-dropdown-mobile", _.spread(function(e) {
var n = [], a = t.APP_LAUNCHER_NAVIGATION;
return _.each(a, function(e) {
var t = {
type: "dom",
node: [ '<li class="list-group-item">', '<a href="' + _.escape(e.href) + '">', '<span class="' + _.escape(e.iconClass) + ' fa-fw" aria-hidden="true"></span> ', '<span class="list-group-item-value">' + _.escape(e.title) + "</span>", "</a>", "</li>" ].join("")
};
n.push(t);
}), n = n.concat([ {
type: "dom",
node: [ '<li class="list-group-item">', "<a href=\"{{'default' | helpLink}}\">", '<span class="fa fa-book fa-fw" aria-hidden="true"></span> <span class="list-group-item-value">Documentation</span>', "</a>", "</li>" ].join("")
}, {
type: "dom",
node: [ '<li class="list-group-item">', '<a href="command-line">', '<span class="fa fa-terminal" aria-hidden="true"></span> <span class="list-group-item-value">Command Line Tools</span>', "</a>", "</li>" ].join("")
}, {
type: "dom",
node: [ '<li class="list-group-item">', '<a href="about">', '<span class="pficon pficon-info fa-fw" aria-hidden="true"></span> <span class="list-group-item-value">About</span>', "</a>", "</li>" ].join("")
}, {
type: "dom",
node: _.template([ '<li class="list-group-item">', '<a href="logout">', '<span class="pficon pficon-user fa-fw" aria-hidden="true"></span>', '<span class="list-group-item-value">Log out <span class="username"><%= userName %></span></span>', "</a>", "</li>" ].join(""))({
userName: e ? e.fullName || e.metadata.name : ""
})
} ]);
}));
} ]);