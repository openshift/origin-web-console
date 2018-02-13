"use strict";

function OverviewController(e, t, n, r, a, o, i, s, c, l, u, d, m, p, f, g, v, h, y, b, S, C, w, P, j, k, I, R, T, E) {
var N = this, D = t("isIE")();
e.projectName = a.project;
var A = a.isHomePage;
N.catalogLandingPageEnabled = !d.DISABLE_SERVICE_CATALOG_LANDING_PAGE;
var B = t("annotation"), L = t("canI"), V = t("buildConfigForBuild"), O = t("deploymentIsInProgress"), U = t("imageObjectRef"), F = t("isJenkinsPipelineStrategy"), x = t("isNewerResource"), M = t("label"), q = t("podTemplate"), z = i.getPreferredVersion("buildconfigs"), H = i.getPreferredVersion("builds"), G = i.getPreferredVersion("appliedclusterresourcequotas"), K = i.getPreferredVersion("deploymentconfigs"), W = i.getPreferredVersion("deployments"), Q = i.getPreferredVersion("horizontalpodautoscalers"), J = i.getPreferredVersion("imagestreams"), Y = i.getPreferredVersion("limitranges"), Z = i.getPreferredVersion("pods"), X = i.getPreferredVersion("replicasets"), ee = i.getPreferredVersion("replicationcontrollers"), te = i.getPreferredVersion("resourcequotas"), ne = i.getPreferredVersion("routes"), re = i.getPreferredVersion("servicebindings"), ae = i.getPreferredVersion("clusterserviceclasses"), oe = i.getPreferredVersion("serviceinstances"), ie = i.getPreferredVersion("clusterserviceplans"), se = i.getPreferredVersion("services"), ce = i.getPreferredVersion("statefulsets"), le = i.getPreferredVersion("templates");
N.buildConfigsInstantiateVersion = i.getPreferredVersion("buildconfigs/instantiate");
var ue, de, me = {}, pe = {}, fe = {}, ge = N.state = {
alerts: {},
builds: {},
clusterQuotas: {},
imageStreamImageRefByDockerReference: {},
imagesByDockerReference: {},
limitRanges: {},
limitWatches: D,
notificationsByObjectUID: {},
pipelinesByDeploymentConfig: {},
podsByOwnerUID: {},
quotas: {},
recentPipelinesByDeploymentConfig: {},
routesByService: {},
servicesByObjectUID: {},
serviceInstances: {},
serviceClasses: {},
servicePlans: {},
bindingsByInstanceRef: {},
bindingsByApplicationUID: {},
applicationsByBinding: {},
showMetrics: !1
};
N.state.breakpoint = v.getBreakpoint();
var ve = _.throttle(function() {
var t = v.getBreakpoint();
N.state.breakpoint !== t && e.$evalAsync(function() {
N.state.breakpoint = t;
});
}, 50);
$(window).on("resize.overview", ve), N.showGetStarted = !1, N.showLoading = !0, N.filterByOptions = [ {
id: "name",
label: "Name"
}, {
id: "label",
label: "Label"
} ], N.filterBy = b.getLabelSelector().isEmpty() ? "name" : "label", N.viewByOptions = [ {
id: "app",
label: "Application"
}, {
id: "resource",
label: "Resource Type"
}, {
id: "pipeline",
label: "Pipeline"
} ];
var he = function(e) {
return _.get(e, "metadata.name");
}, ye = function(e) {
return _.get(e, "metadata.uid");
}, be = function() {
return _.size(N.deploymentConfigs) + _.size(N.vanillaReplicationControllers) + _.size(N.deployments) + _.size(N.vanillaReplicaSets) + _.size(N.statefulSets) + _.size(N.monopods) + _.size(N.state.serviceInstances);
}, Se = function() {
return _.size(N.filteredDeploymentConfigs) + _.size(N.filteredReplicationControllers) + _.size(N.filteredDeployments) + _.size(N.filteredReplicaSets) + _.size(N.filteredStatefulSets) + _.size(N.filteredMonopods) + _.size(N.filteredServiceInstances);
}, Ce = function() {
N.size = be(), N.filteredSize = Se();
var e = 0 === N.size, t = N.deploymentConfigs && N.replicationControllers && N.deployments && N.replicaSets && N.statefulSets && N.pods && N.state.serviceInstances;
ge.expandAll = t && 1 === N.size, N.showGetStarted = t && e, N.showLoading = !t && e, N.everythingFiltered = !e && !N.filteredSize, N.hidePipelineOtherResources = "pipeline" === N.viewBy && (N.filterActive || _.isEmpty(N.pipelineBuildConfigs));
}, _e = function(e) {
return s.groupByApp(e, "metadata.name");
}, we = function(e) {
var t = null;
return _.each(e, function(e) {
t = t ? T.getPreferredDisplayRoute(t, e) : e;
}), t;
}, Pe = _.debounce(function() {
e.$evalAsync(function() {
if (N.bestRouteByApp = {}, N.routes) {
var e = [ N.filteredDeploymentConfigsByApp, N.filteredReplicationControllersByApp, N.filteredDeploymentsByApp, N.filteredReplicaSetsByApp, N.filteredStatefulSetsByApp, N.filteredMonopodsByApp ];
_.each(N.apps, function(t) {
var n = {};
_.each(e, function(e) {
var r = _.get(e, t, []);
_.each(r, function(e) {
var t = ye(e), r = _.get(ge, [ "servicesByObjectUID", t ], []);
_.each(r, function(e) {
var t = _.get(ge, [ "routesByService", e.metadata.name ], []);
_.assign(n, _.keyBy(t, "metadata.name"));
});
});
}), N.bestRouteByApp[t] = we(n);
});
}
});
}, 300, {
maxWait: 1500
}), je = function() {
N.filteredDeploymentConfigsByApp = _e(N.filteredDeploymentConfigs), N.filteredReplicationControllersByApp = _e(N.filteredReplicationControllers), N.filteredDeploymentsByApp = _e(N.filteredDeployments), N.filteredReplicaSetsByApp = _e(N.filteredReplicaSets), N.filteredStatefulSetsByApp = _e(N.filteredStatefulSets), N.filteredMonopodsByApp = _e(N.filteredMonopods), N.apps = _.union(_.keys(N.filteredDeploymentConfigsByApp), _.keys(N.filteredReplicationControllersByApp), _.keys(N.filteredDeploymentsByApp), _.keys(N.filteredReplicaSetsByApp), _.keys(N.filteredStatefulSetsByApp), _.keys(N.filteredMonopodsByApp)), s.sortAppNames(N.apps), Pe();
}, ke = function() {
var e = _.filter(N.deploymentConfigs, function(e) {
var t = he(e);
return _.isEmpty(ge.pipelinesByDeploymentConfig[t]);
});
N.deploymentConfigsNoPipeline = _.sortBy(e, "metadata.name"), N.pipelineViewHasOtherResources = !(_.isEmpty(N.deploymentConfigsNoPipeline) && _.isEmpty(N.vanillaReplicationControllers) && _.isEmpty(N.deployments) && _.isEmpty(N.vanillaReplicaSets) && _.isEmpty(N.statefulSets) && _.isEmpty(N.monopods));
}, Ie = function() {
N.disableFilter = "pipeline" === N.viewBy && _.isEmpty(N.pipelineBuildConfigs);
}, Re = function(e) {
return b.getLabelSelector().select(e);
}, Te = [ "metadata.name", "spec.clusterServiceClassExternalName" ], Ee = function(e) {
return y.filterForKeywords(e, Te, ge.filterKeywords);
}, Ne = function(e) {
switch (N.filterBy) {
case "label":
return Re(e);

case "name":
return Ee(e);
}
return e;
}, De = function() {
switch (N.filterBy) {
case "label":
return !b.getLabelSelector().isEmpty();

case "name":
return !_.isEmpty(ge.filterKeywords);
}
}, Ae = function() {
N.filteredDeploymentConfigs = Ne(N.deploymentConfigs), N.filteredReplicationControllers = Ne(N.vanillaReplicationControllers), N.filteredDeployments = Ne(N.deployments), N.filteredReplicaSets = Ne(N.vanillaReplicaSets), N.filteredStatefulSets = Ne(N.statefulSets), N.filteredMonopods = Ne(N.monopods), N.filteredPipelineBuildConfigs = Ne(N.pipelineBuildConfigs), N.filteredServiceInstances = Ne(ge.orderedServiceInstances), N.filterActive = De(), je(), Ce();
}, $e = a.project + "/overview/view-by";
N.viewBy = localStorage.getItem($e) || "app", e.$watch(function() {
return N.viewBy;
}, function(e) {
localStorage.setItem($e, e), Ie(), Te = "app" === N.viewBy ? [ "metadata.name", "metadata.labels.app" ] : [ "metadata.name" ], Ae(), "pipeline" === N.viewBy ? b.setLabelSuggestions(pe) : b.setLabelSuggestions(me);
}), d.DISABLE_OVERVIEW_METRICS || (C.isAvailable(!0).then(function(e) {
ge.showMetrics = e;
}), e.$on("metrics-connection-failed", function(e, t) {
o.isAlertPermanentlyHidden("metrics-connection-failed") || ge.alerts["metrics-connection-failed"] || (ge.alerts["metrics-connection-failed"] = {
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
return o.permanentlyHideAlert("metrics-connection-failed"), !0;
}
} ]
});
}));
var Be = function(e) {
return e && "Pod" === e.kind;
}, Le = function(e) {
var t = ye(e);
return t ? Be(e) ? [ e ] : _.get(N, [ "state", "podsByOwnerUID", t ], []) : [];
}, Ve = function(e, t) {
var n = ye(e);
ge.notificationsByObjectUID[n] = t || {};
}, Oe = function(e) {
var t = ye(e);
return t ? _.get(ge, [ "notificationsByObjectUID", t ], {}) : {};
}, Ue = function(e) {
if (ye(e)) {
var t = Le(e), n = R.getPodAlerts(t, a.project);
Ve(e, n);
}
}, Fe = function(e) {
_.each(e, Ue);
}, xe = function(e) {
var t = he(e);
return t ? fe[t] : null;
}, Me = function(e) {
var t = he(e);
return t ? _.get(N, [ "replicationControllersByDeploymentConfig", t ]) : [];
};
N.getPreviousReplicationController = function(e) {
var t = Me(e);
return _.size(t) < 2 ? null : t[1];
};
var qe = function(e) {
var t = {}, n = xe(e);
_.assign(t, R.getDeploymentStatusAlerts(e, n), R.getPausedDeploymentAlerts(e));
var r = Me(e);
_.each(r, function(e) {
var n = Oe(e);
_.assign(t, n);
}), Ve(e, t);
}, ze = function() {
_.each(N.deploymentConfigs, qe);
}, He = function(e) {
var t = ye(e);
return t ? _.get(N, [ "replicaSetsByDeploymentUID", t ]) : {};
}, Ge = function(e) {
var t = R.getPausedDeploymentAlerts(e), n = He(e);
_.each(n, function(e) {
var n = Oe(e);
_.assign(t, n);
}), Ve(e, t);
}, Ke = function() {
_.each(N.deployments, Ge);
}, We = function() {
Fe(N.replicationControllers), Fe(N.replicaSets), Fe(N.statefulSets), Fe(N.monopods);
}, Qe = _.debounce(function() {
e.$evalAsync(function() {
We(), ze(), Ke();
});
}, 500), Je = function(e) {
_.isEmpty(e) || (b.addLabelSuggestionsFromResources(e, me), "pipeline" !== N.viewBy && b.setLabelSuggestions(me));
}, Ye = function(e) {
_.isEmpty(e) || (b.addLabelSuggestionsFromResources(e, pe), "pipeline" === N.viewBy && b.setLabelSuggestions(pe));
}, Ze = function(e) {
return "Succeeded" !== e.status.phase && "Failed" !== e.status.phase && (!M(e, "openshift.io/deployer-pod-for.name") && (!B(e, "openshift.io/build.name") && "slave" !== M(e, "jenkins")));
}, Xe = function() {
ge.podsByOwnerUID = j.groupByOwnerUID(N.pods), N.monopods = _.filter(ge.podsByOwnerUID[""], Ze);
}, et = function(e) {
return !!_.get(e, "status.replicas") || (!B(e, "deploymentConfig") || O(e));
}, tt = function(e) {
return B(e, "deploymentConfig");
}, nt = function() {
if (N.deploymentConfigs && N.replicationControllers) {
var e = [];
N.replicationControllersByDeploymentConfig = {}, N.currentByDeploymentConfig = {}, fe = {};
var t = {}, n = {};
_.each(N.replicationControllers, function(r) {
var a = tt(r) || "";
(!a || !N.deploymentConfigs[a] && _.get(r, "status.replicas")) && e.push(r);
var o = fe[a];
o && !x(r, o) || (fe[a] = r);
var i;
"Complete" === B(r, "deploymentStatus") && ((i = t[a]) && !x(r, i) || (t[a] = r)), et(r) && _.set(n, [ a, r.metadata.name ], r);
}), _.each(t, function(e, t) {
_.set(n, [ t, e.metadata.name ], e);
}), _.each(n, function(e, t) {
var n = p.sortByDeploymentVersion(e, !0);
N.replicationControllersByDeploymentConfig[t] = n, N.currentByDeploymentConfig[t] = _.head(n);
}), N.vanillaReplicationControllers = _.sortBy(e, "metadata.name"), ze();
}
}, rt = function(e, t) {
if (_.get(e, "status.replicas")) return !0;
var n = p.getRevision(e);
return !n || !!t && p.getRevision(t) === n;
}, at = function() {
N.replicaSets && ue && (N.replicaSetsByDeploymentUID = P.groupByControllerUID(N.replicaSets), N.currentByDeploymentUID = {}, _.each(N.replicaSetsByDeploymentUID, function(e, t) {
if (t) {
var n = ue[t], r = _.filter(e, function(e) {
return rt(e, n);
}), a = p.sortByRevision(r);
N.replicaSetsByDeploymentUID[t] = a, N.currentByDeploymentUID[t] = _.head(a);
}
}), N.vanillaReplicaSets = _.sortBy(N.replicaSetsByDeploymentUID[""], "metadata.name"), Ke());
}, ot = {}, it = function(e) {
e && ge.allServices && _.each(e, function(e) {
var t = [], n = ye(e), r = q(e);
_.each(ot, function(e, n) {
e.matches(r) && t.push(ge.allServices[n]);
}), ge.servicesByObjectUID[n] = _.sortBy(t, "metadata.name");
});
}, st = function() {
if (ge.allServices) {
ot = _.mapValues(ge.allServices, function(e) {
return new LabelSelector(e.spec.selector);
});
var e = [ N.deploymentConfigs, N.vanillaReplicationControllers, N.deployments, N.vanillaReplicaSets, N.statefulSets, N.monopods ];
_.each(e, it), Pe();
}
}, ct = function() {
var e = T.groupByService(N.routes, !0);
ge.routesByService = _.mapValues(e, T.sortRoutesByScore), Pe();
}, lt = function() {
ge.hpaByResource = g.groupHPAs(N.horizontalPodAutoscalers);
}, ut = function(e) {
var t = V(e), n = N.buildConfigs[t];
if (n) {
N.recentPipelinesByBuildConfig[t] = N.recentPipelinesByBuildConfig[t] || [], N.recentPipelinesByBuildConfig[t].push(e);
var r = l.usesDeploymentConfigs(n);
_.each(r, function(t) {
ge.recentPipelinesByDeploymentConfig[t] = ge.recentPipelinesByDeploymentConfig[t] || [], ge.recentPipelinesByDeploymentConfig[t].push(e);
}), ke();
}
}, dt = {}, mt = function() {
dt = l.groupBuildConfigsByOutputImage(N.buildConfigs);
}, pt = function(e) {
var t = ye(e);
if (t) return _.get(ge, [ "buildConfigsByObjectUID", t ], []);
}, ft = function(e) {
var t = [], n = pt(e);
_.each(n, function(e) {
var n = _.get(ge, [ "recentBuildsByBuildConfig", e.metadata.name ], []);
t = t.concat(n);
});
var r = he(e);
_.set(ge, [ "recentBuildsByDeploymentConfig", r ], t);
}, gt = function(e, t) {
var n = ye(t);
n && _.set(ge, [ "buildConfigsByObjectUID", n ], e);
}, vt = function() {
var e = [];
N.deploymentConfigsByPipeline = {}, ge.pipelinesByDeploymentConfig = {}, _.each(N.buildConfigs, function(t) {
if (F(t)) {
e.push(t);
var n = l.usesDeploymentConfigs(t), r = he(t);
_.set(N, [ "deploymentConfigsByPipeline", r ], n), _.each(n, function(e) {
ge.pipelinesByDeploymentConfig[e] = ge.pipelinesByDeploymentConfig[e] || [], ge.pipelinesByDeploymentConfig[e].push(t);
});
}
}), N.pipelineBuildConfigs = _.sortBy(e, "metadata.name"), ke(), Ye(N.pipelineBuildConfigs), Ie();
}, ht = function() {
ge.buildConfigsByObjectUID = {}, _.each(N.deploymentConfigs, function(e) {
var t = [], n = _.get(e, "spec.triggers");
_.each(n, function(n) {
var r = _.get(n, "imageChangeParams.from");
if (r) {
var a = U(r, e.metadata.namespace), o = dt[a];
_.isEmpty(o) || (t = t.concat(o));
}
}), t = _.sortBy(t, "metadata.name"), gt(t, e), ft(e);
});
}, yt = function() {
vt(), ht();
}, bt = function() {
_.each(N.deploymentConfigs, ft);
}, St = function() {
if (ge.builds && N.buildConfigs) {
N.recentPipelinesByBuildConfig = {}, ge.recentBuildsByBuildConfig = {}, ge.recentPipelinesByDeploymentConfig = {};
var e = {};
_.each(l.interestingBuilds(ge.builds), function(t) {
var n = V(t);
F(t) ? ut(t) : (e[n] = e[n] || [], e[n].push(t));
}), N.recentPipelinesByBuildConfig = _.mapValues(N.recentPipelinesByBuildConfig, function(e) {
return l.sortBuilds(e, !0);
}), ge.recentPipelinesByDeploymentConfig = _.mapValues(ge.recentPipelinesByDeploymentConfig, function(e) {
return l.sortBuilds(e, !0);
}), ge.recentBuildsByBuildConfig = _.mapValues(e, function(e) {
return l.sortBuilds(e, !0);
}), bt();
}
}, Ct = function() {
R.setQuotaNotifications(ge.quotas, ge.clusterQuotas, a.project);
};
N.clearFilter = function() {
b.clear(), N.filterText = "";
}, e.$watch(function() {
return N.filterText;
}, _.debounce(function(t, n) {
t !== n && (ge.filterKeywords = y.generateKeywords(t), e.$evalAsync(Ae));
}, 50, {
maxWait: 250
})), e.$watch(function() {
return N.filterBy;
}, function(e, t) {
e !== t && (N.clearFilter(), Ae());
}), e.browseCatalog = function() {
w.toProjectCatalog(e.projectName);
}, b.onActiveFiltersChanged(function() {
e.$evalAsync(Ae);
}), N.startBuild = l.startBuild;
var _t = function() {
if (ge.bindingsByApplicationUID = {}, ge.applicationsByBinding = {}, ge.deleteableBindingsByApplicationUID = {}, !_.isEmpty(ge.bindings)) {
var e = [ N.deployments, N.deploymentConfigs, N.vanillaReplicationControllers, N.vanillaReplicaSets, N.statefulSets ];
if (!_.some(e, function(e) {
return !e;
})) {
var t = c.getPodPresetSelectorsForBindings(ge.bindings);
_.each(e, function(e) {
_.each(e, function(e) {
var n = ye(e), r = new LabelSelector(_.get(e, "spec.selector"));
ge.bindingsByApplicationUID[n] = [], ge.deleteableBindingsByApplicationUID[n] = [], _.each(t, function(t, a) {
t.covers(r) && (ge.bindingsByApplicationUID[n].push(ge.bindings[a]), _.get(ge.bindings[a], "metadata.deletionTimestamp") || ge.deleteableBindingsByApplicationUID[n].push(ge.bindings[a]), ge.applicationsByBinding[a] = ge.applicationsByBinding[a] || [], ge.applicationsByBinding[a].push(e));
});
});
}), N.bindingsByInstanceRef = _.reduce(N.bindingsByInstanceRef, function(e, t, n) {
return e[n] = _.sortBy(t, function(e) {
var t = _.get(ge.applicationsByBinding, [ e.metadata.name ]);
return _.get(_.head(t), [ "metadata", "name" ]) || e.metadata.name;
}), e;
}, {});
}
}
}, wt = function() {
ge.bindableServiceInstances = c.filterBindableServiceInstances(ge.serviceInstances, ge.serviceClasses, ge.servicePlans), ge.orderedServiceInstances = c.sortServiceInstances(ge.serviceInstances, ge.serviceClasses);
}, Pt = [], jt = A ? {
skipErrorNotFound: !0
} : {};
k.get(a.project, jt).then(_.spread(function(t, r) {
ge.project = e.project = t, ge.context = r;
var a = function() {
N.pods && h.fetchReferencedImageStreamImages(N.pods, ge.imagesByDockerReference, ge.imageStreamImageRefByDockerReference, r);
};
Pt.push(m.watch(Z, r, function(e) {
N.pods = e.by("metadata.name"), Xe(), a(), Qe(), it(N.monopods), Fe(N.monopods), Je(N.monopods), Ae(), S.log("pods (subscribe)", N.pods);
})), Pt.push(m.watch(ee, r, function(e) {
N.replicationControllers = e.by("metadata.name"), nt(), it(N.vanillaReplicationControllers), it(N.monopods), Fe(N.vanillaReplicationControllers), Je(N.vanillaReplicationControllers), _t(), Ae(), S.log("replicationcontrollers (subscribe)", N.replicationControllers);
})), Pt.push(m.watch(K, r, function(e) {
N.deploymentConfigs = e.by("metadata.name"), nt(), it(N.deploymentConfigs), it(N.vanillaReplicationControllers), Je(N.deploymentConfigs), Ke(), yt(), bt(), _t(), Ae(), S.log("deploymentconfigs (subscribe)", N.deploymentConfigs);
})), Pt.push(m.watch(X, r, function(e) {
N.replicaSets = e.by("metadata.name"), at(), it(N.vanillaReplicaSets), it(N.monopods), Fe(N.vanillaReplicaSets), Je(N.vanillaReplicaSets), _t(), Ae(), S.log("replicasets (subscribe)", N.replicaSets);
})), Pt.push(m.watch(W, r, function(e) {
ue = e.by("metadata.uid"), N.deployments = _.sortBy(ue, "metadata.name"), at(), it(N.deployments), it(N.vanillaReplicaSets), Je(N.deployments), _t(), Ae(), S.log("deployments (subscribe)", N.deploymentsByUID);
})), Pt.push(m.watch(H, r, function(e) {
ge.builds = e.by("metadata.name"), St(), S.log("builds (subscribe)", ge.builds);
})), Pt.push(m.watch(ce, r, function(e) {
N.statefulSets = e.by("metadata.name"), it(N.statefulSets), it(N.monopods), Fe(N.statefulSets), Je(N.statefulSets), _t(), Ae(), S.log("statefulsets (subscribe)", N.statefulSets);
}, {
poll: D,
pollInterval: 6e4
})), Pt.push(m.watch(se, r, function(e) {
ge.allServices = e.by("metadata.name"), st(), S.log("services (subscribe)", ge.allServices);
}, {
poll: D,
pollInterval: 6e4
})), Pt.push(m.watch(ne, r, function(e) {
N.routes = e.by("metadata.name"), ct(), S.log("routes (subscribe)", N.routes);
}, {
poll: D,
pollInterval: 6e4
})), Pt.push(m.watch(z, r, function(e) {
N.buildConfigs = e.by("metadata.name"), mt(), yt(), St(), Ae(), S.log("buildconfigs (subscribe)", N.buildConfigs);
}, {
poll: D,
pollInterval: 6e4
})), Pt.push(m.watch(Q, r, function(e) {
N.horizontalPodAutoscalers = e.by("metadata.name"), lt(), S.log("autoscalers (subscribe)", N.horizontalPodAutoscalers);
}, {
poll: D,
pollInterval: 6e4
})), Pt.push(m.watch(J, r, function(e) {
de = e.by("metadata.name"), h.buildDockerRefMapForImageStreams(de, ge.imageStreamImageRefByDockerReference), a(), S.log("imagestreams (subscribe)", de);
}, {
poll: D,
pollInterval: 6e4
})), Pt.push(m.watch(te, r, function(e) {
ge.quotas = e.by("metadata.name"), Ct();
}, {
poll: !0,
pollInterval: 6e4
})), Pt.push(m.watch(G, r, function(e) {
ge.clusterQuotas = e.by("metadata.name"), Ct();
}, {
poll: !0,
pollInterval: 6e4
}));
var o, i, s = {}, c = {};
u.SERVICE_CATALOG_ENABLED && L(oe, "watch") && (o = function(e) {
var t = E.getServiceClassNameForInstance(e);
if (!t) return n.when();
var r = _.get(ge, [ "serviceClasses", t ]);
return r ? n.when(r) : (s[t] || (s[t] = m.get(ae, t, {}).then(function(e) {
return ge.serviceClasses[t] = e, e;
}).finally(function() {
delete c[t];
})), s[t]);
}, i = function(e) {
var t = E.getServicePlanNameForInstance(e);
if (!t) return n.when();
var r = _.get(ge, [ "servicePlans", t ]);
return r ? n.when(r) : (c[t] || (c[t] = m.get(ie, t, {}).then(function(e) {
return ge.servicePlans[t] = e, e;
}).finally(function() {
delete c[t];
})), c[t]);
}, Pt.push(m.watch(oe, r, function(e) {
ge.serviceInstances = e.by("metadata.name");
var t = [];
_.each(ge.serviceInstances, function(e) {
var n = R.getServiceInstanceAlerts(e);
Ve(e, n), t.push(o(e)), t.push(i(e));
}), I.waitForAll(t).finally(function() {
wt(), Ae();
}), Je(ge.serviceInstances);
}, {
poll: D,
pollInterval: 6e4
}))), u.SERVICE_CATALOG_ENABLED && L(re, "watch") && Pt.push(m.watch(re, r, function(e) {
ge.bindings = e.by("metadata.name"), N.bindingsByInstanceRef = _.groupBy(ge.bindings, "spec.instanceRef.name"), _t();
}, {
poll: D,
pollInterval: 6e4
})), m.list(Y, r, function(e) {
ge.limitRanges = e.by("metadata.name");
});
var l = d.SAMPLE_PIPELINE_TEMPLATE;
l && m.get(le, l.name, {
namespace: l.namespace
}, {
errorNotification: !1
}).then(function(t) {
N.samplePipelineURL = w.createFromTemplateURL(t, e.projectName);
}), e.$on("$destroy", function() {
m.unwatchAll(Pt), $(window).off(".overview");
});
}), function(t) {
A && _.get(t, "notFound") && (f.notifyInvalidProjectHomePage(e.projectName), w.toProjectList());
});
}

function ResourceServiceBindings(e, t, n, r, a) {
var o, i = this, s = e("enableTechPreviewFeature");
i.bindings = [], i.bindableServiceInstances = [], i.serviceClasses = [], i.serviceInstances = [], i.showBindings = r.SERVICE_CATALOG_ENABLED && s("pod_presets");
var c = e("isIE")(), l = [], u = e("canI"), d = i.serviceBindingsVersion = t.getPreferredVersion("servicebindings"), m = t.getPreferredVersion("clusterserviceclasses"), p = t.getPreferredVersion("serviceinstances"), f = t.getPreferredVersion("clusterserviceplans"), g = function() {
i.apiObject && i.bindings && (i.bindings = n.getBindingsForResource(i.bindings, i.apiObject));
}, v = function() {
i.bindableServiceInstances = n.filterBindableServiceInstances(i.serviceInstances, i.serviceClasses, o), i.orderedServiceInstances = n.sortServiceInstances(i.serviceInstances, i.serviceClasses);
};
i.createBinding = function() {
i.overlayPanelVisible = !0, i.overlayPanelName = "bindService";
}, i.closeOverlayPanel = function() {
i.overlayPanelVisible = !1;
};
var h = function() {
a.unwatchAll(l), l = [], r.SERVICE_CATALOG_ENABLED && u(d, "watch") && l.push(a.watch(d, i.projectContext, function(e) {
i.bindings = e.by("metadata.name"), g();
}, {
poll: c,
pollInterval: 6e4
})), r.SERVICE_CATALOG_ENABLED && u(p, "watch") && (l.push(a.watch(p, i.projectContext, function(e) {
i.serviceInstances = e.by("metadata.name"), v();
}, {
poll: c,
pollInterval: 6e4
})), a.list(m, {}, function(e) {
i.serviceClasses = e.by("metadata.name"), v();
}), a.list(f, {}, function(e) {
o = e.by("metadata.name");
}));
};
i.$onChanges = function(e) {
e.projectContext && i.showBindings && h();
}, i.$onDestroy = function() {
a.unwatchAll(l);
};
}

function ServiceInstanceBindings(e, t, n) {
var r = this, a = e("canI"), o = r.serviceBindingsVersion = t.getPreferredVersion("servicebindings"), i = function() {
r.bindable = a(o, "create") && n.isServiceBindable(r.serviceInstance, r.serviceClass, r.servicePlan);
};
r.createBinding = function() {
r.overlayPanelVisible = !0;
}, r.closeOverlayPanel = function() {
r.overlayPanelVisible = !1;
}, r.$onChanges = function() {
i();
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
"route-types": "architecture/networking/routes.html#route-types",
persistent_volumes: "dev_guide/persistent_volumes.html",
compute_resources: "dev_guide/compute_resources.html",
pod_autoscaling: "dev_guide/pod_autoscaling.html",
application_health: "dev_guide/application_health.html",
webhook_secrets: "dev_guide/builds/triggering_builds.html#webhook-triggers",
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
routes: "architecture/networking/routes.html",
builds: "architecture/core_concepts/builds_and_image_streams.html#builds",
"image-streams": "architecture/core_concepts/builds_and_image_streams.html#image-streams",
storage: "architecture/additional_concepts/storage.html",
"build-hooks": "dev_guide/builds/build_hooks.html",
default: "welcome/index.html"
},
CLI: {
"Latest Release": "https://github.com/openshift/origin/releases/latest"
},
DEFAULT_HPA_CPU_TARGET_PERCENT: null,
DISABLE_OVERVIEW_METRICS: !1,
DISABLE_CUSTOM_METRICS: !1,
DISABLE_WILDCARD_ROUTES: !0,
DISABLE_CONFIRM_ON_EXIT: !1,
DISABLE_SERVICE_CATALOG_LANDING_PAGE: !1,
AVAILABLE_KINDS_BLACKLIST: [],
DISABLE_GLOBAL_EVENT_WATCH: !1,
DISABLE_COPY_LOGIN_COMMAND: !1,
ENABLE_TECH_PREVIEW_FEATURE: {
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
resource: "servicebindings",
group: "servicecatalog.k8s.io"
}, {
resource: "serviceinstances",
group: "servicecatalog.k8s.io"
}, {
resource: "services",
group: ""
}, {
resource: "statefulsets",
group: "apps"
} ],
MEMBERSHIP_WHITELIST: [ "admin", "basic-user", "edit", "system:deployer", "system:image-builder", "system:image-puller", "system:image-pusher", "view" ],
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
Failed: !0,
DeploymentCreated: !0,
DeploymentCreationFailed: !0,
RolloutCancelled: !0,
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
ProvisionCallFailed: !0,
ProvisionedSuccessfully: !0,
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
prefixes: [ "/browse/storage/", "/browse/persistentvolumeclaims/", "/create-pvc" ]
}, {
label: "Monitoring",
iconClass: "pficon pficon-screen",
href: "/monitoring",
prefixes: [ "/browse/events" ]
}, {
label: "Catalog",
iconClass: "pficon pficon-service-catalog",
href: "/catalog",
canI: {
addToProject: !0
}
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
QUOTA_NOTIFICATION_MESSAGE: {},
LOGO_BASE_URL: "images/logos/",
LOGOS: {
"icon-3scale": "3scale.svg",
"icon-aerogear": "aerogear.svg",
"icon-amq": "amq.svg",
"icon-angularjs": "angularjs.svg",
"icon-ansible": "ansible.svg",
"icon-apache": "apache.svg",
"icon-beaker": "beaker.svg",
"icon-capedwarf": "capedwarf.svg",
"icon-cassandra": "cassandra.svg",
"icon-clojure": "clojure.svg",
"icon-codeigniter": "codeigniter.svg",
"icon-datagrid": "datagrid.svg",
"icon-datavirt": "datavirt.svg",
"icon-decisionserver": "decisionserver.svg",
"icon-django": "django.svg",
"icon-dotnet": "dotnet.svg",
"icon-drupal": "drupal.svg",
"icon-eap": "eap.svg",
"icon-elastic": "elastic.svg",
"icon-erlang": "erlang.svg",
"icon-git": "git.svg",
"icon-github": "github.svg",
"icon-gitlab": "gitlab.svg",
"icon-glassfish": "glassfish.svg",
"icon-go-gopher": "go-gopher.svg",
"icon-grails": "grails.svg",
"icon-hadoop": "hadoop.svg",
"icon-haproxy": "haproxy.svg",
"icon-infinispan": "infinispan.svg",
"icon-jboss": "jboss.svg",
"icon-jenkins": "jenkins.svg",
"icon-jetty": "jetty.svg",
"icon-joomla": "joomla.svg",
"icon-jruby": "jruby.svg",
"icon-js": "js.svg",
"icon-laravel": "laravel.svg",
"icon-load-balancer": "load-balancer.svg",
"icon-mariadb": "mariadb.svg",
"icon-mediawiki": "mediawiki.svg",
"icon-memcached": "memcached.svg",
"icon-mongodb": "mongodb.svg",
"icon-mysql-database": "mysql-database.svg",
"icon-nginx": "nginx.svg",
"icon-nodejs": "nodejs.svg",
"icon-openjdk": "openjdk.svg",
"icon-openshift": "openshift.svg",
"icon-openstack": "openstack.svg",
"icon-perl": "perl.svg",
"icon-phalcon": "phalcon.svg",
"icon-php": "php.svg",
"icon-play": "play.svg",
"icon-postgresql": "postgresql.svg",
"icon-processserver": "processserver.svg",
"icon-python": "python.svg",
"icon-rabbitmq": "rabbitmq.svg",
"icon-rails": "rails.svg",
"icon-redis": "redis.svg",
"icon-rh-integration": "rh-integration.svg",
"icon-rh-openjdk": "openjdk.svg",
"icon-rh-tomcat": "rh-tomcat.svg",
"icon-ruby": "ruby.svg",
"icon-scala": "scala.svg",
"icon-shadowman": "shadowman.svg",
"icon-spring": "spring.svg",
"icon-sso": "sso.svg",
"icon-stackoverflow": "stackoverflow.svg",
"icon-symfony": "symfony.svg",
"icon-tomcat": "tomcat.svg",
"icon-wildfly": "wildfly.svg",
"icon-wordpress": "wordpress.svg",
"icon-zend": "zend.svg"
},
CLUSTER_RESOURCE_OVERRIDES_EXEMPT_PROJECT_NAMES: [ "openshift", "kubernetes", "kube" ],
CLUSTER_RESOURCE_OVERRIDES_EXEMPT_PROJECT_PREFIXES: [ "openshift-", "kubernetes-", "kube-" ]
}), angular.module("openshiftConsole", [ "ngAnimate", "ngCookies", "ngResource", "ngRoute", "ngSanitize", "kubernetesUI", "registryUI.images", "ui.bootstrap", "patternfly.charts", "patternfly.navigation", "patternfly.sort", "patternfly.notification", "openshiftConsoleTemplates", "ui.ace", "extension-registry", "as.sortable", "ui.select", "angular-inview", "angularMoment", "ab-base64", "openshiftCommonServices", "openshiftCommonUI", "webCatalog" ]).config([ "$routeProvider", "$uibModalProvider", "HomePagePreferenceServiceProvider", function(e, t, n) {
var r, a = {
templateUrl: "views/projects.html",
controller: "ProjectsController"
};
_.get(window, "OPENSHIFT_CONSTANTS.DISABLE_SERVICE_CATALOG_LANDING_PAGE") ? (r = a, e.when("/projects", {
redirectTo: "/"
})) : (r = {
templateUrl: "views/landing-page.html",
controller: "LandingPageController",
reloadOnSearch: !1
}, e.when("/projects", a)), e.when("/", {
redirectTo: function() {
return n.$get().getHomePagePath();
}
}).when("/catalog", r).when("/create-project", {
templateUrl: "views/create-project.html",
controller: "CreateProjectController"
}).when("/project/:project/catalog", {
templateUrl: "views/project-browse-catalog.html",
controller: "ProjectBrowseCatalogController"
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
},
reloadOnSearch: !1
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
}), t.options = {
animation: !0,
backdrop: "static"
};
} ]).constant("LOGGING_URL", _.get(window.OPENSHIFT_CONFIG, "loggingURL")).constant("METRICS_URL", _.get(window.OPENSHIFT_CONFIG, "metricsURL")).constant("SOURCE_URL_PATTERN", /^[a-z][a-z0-9+.-@]*:(\/\/)?[0-9a-z_-]+/i).constant("RELATIVE_PATH_PATTERN", /^(?!\/)(?!\.\.(\/|$))(?!.*\/\.\.(\/|$)).*$/).constant("IS_SAFARI", /Version\/[\d\.]+.*Safari/.test(navigator.userAgent)).constant("amTimeAgoConfig", {
titleFormat: "LLL"
}).config([ "kubernetesContainerSocketProvider", function(e) {
e.WebSocketFactory = "ContainerWebSocket";
} ]).config([ "$compileProvider", function(e) {
e.aHrefSanitizationWhitelist(/^\s*(https?|mailto|git):/i);
} ]).run([ "$rootScope", "LabelFilter", function(e, t) {
t.persistFilterState(!0), e.$on("$routeChangeSuccess", function() {
t.readPersistedState();
});
} ]).run([ "$location", "$uibModal", "AuthService", function(e, t, n) {
function r() {
if (c) return !1;
c = !0, (i = t.open({
templateUrl: "views/modals/logout.html",
controller: "LogoutModalController",
backdrop: !0
})).result.then(function(e) {
"logout" === e ? (m(!0), p()) : "cancel" === e && (d(), c = !1);
}, function() {
d(), c = !1;
});
}
var a = window.OPENSHIFT_CONFIG.inactivityTimeoutMinutes;
if (a) {
var o, i, s = "origin-web-console-last-interaction-timestamp", c = !1, l = function() {
o = setInterval(function() {
if (n.isLoggedIn()) {
var e = Date.parse(localStorage.getItem(s));
isNaN(e) && (Logger.warn("Last interaction timestamp has been corrupted. The logout timeout will be restarted."), e = new Date()), new Date() - e > 6e4 * a && r();
}
}, 6e4);
}, u = function() {
i && (i.dismiss("User activity"), i = null), clearInterval(o), l();
}, d = function() {
u(), localStorage.setItem(s, new Date().toString());
}, m = function(e) {
localStorage.setItem("origin-web-console-inactivity-logout", e.toString());
}, p = function() {
var t = URI.expand("/logout{?cause*}", {
cause: "timeout"
});
e.url(t.toString());
};
$(window).on("storage", function(e) {
e.originalEvent.key === s ? u() : "origin-web-console-inactivity-logout" === e.originalEvent.key && p();
}), n.onUserChanged(function() {
m(!1);
}), d(), $(document).bind("click keydown", _.throttle(d, 500));
}
} ]).run([ "durationFilter", "timeOnlyDurationFromTimestampsFilter", "countdownToTimestampFilter", function(e, t, n) {
setInterval(function() {
$(".duration[data-timestamp]").text(function(n, r) {
var a = $(this).data("timestamp"), o = $(this).data("omit-single"), i = $(this).data("precision");
return $(this).data("time-only") ? t(a, null) || r : e(a, null, o, i) || r;
}), $(".countdown[data-timestamp]").text(function(e, t) {
var r = $(this).data("timestamp");
return n(r);
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
saveJSON: function(t, n, r) {
return e[t].setItem("openshift/" + n, JSON.stringify(r));
},
loadJSON: function(t, n) {
return JSON.parse(e[t].getItem("openshift/" + n) || "{}");
}
};
} ]), angular.module("openshiftConsole").factory("APIDiscovery", [ "LOGGING_URL", "METRICS_URL", "$q", "$filter", function(e, t, n, r) {
return {
getLoggingURL: function(t) {
var a = e, o = r("annotation")(t, "loggingUIHostname");
return o && (a = "https://" + o), n.when(a);
},
getMetricsURL: function() {
return n.when(t);
}
};
} ]), angular.module("openshiftConsole").service("ApplicationGenerator", [ "DataService", "APIService", "Logger", "$parse", "$q", function(e, t, n, r, a) {
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
var a = [];
return angular.forEach(t, function(t, o) {
var i = o.split("/");
1 === i.length && i.push("tcp");
var s = parseInt(i[0], 10);
isNaN(s) ? n.warn("Container port " + i[0] + " is not a number for image " + r("metadata.name")(e)) : a.push({
containerPort: s,
protocol: i[1].toUpperCase()
});
}), a.sort(function(e, t) {
return e.containerPort - t.containerPort;
}), a;
}(r("dockerImageMetadata.Config.ExposedPorts")(e) || r("dockerImageMetadata.ContainerConfig.ExposedPorts")(e) || []);
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
var r = {
imageStream: o._generateImageStream(e),
buildConfig: o._generateBuildConfig(e, n, e.labels),
deploymentConfig: o._generateDeploymentConfig(e, n, t, e.labels)
};
e.scaling.autoscale && (r.hpa = o._generateHPA(e, r.deploymentConfig));
var a = o._generateService(e, e.name, t);
return a && (r.service = a, r.route = o._generateRoute(e, e.name, r.service.metadata.name)), r;
}, o.createRoute = function(e, t, n) {
return o._generateRoute({
labels: n || {},
routing: angular.extend({
include: !0
}, e)
}, e.name, t);
}, o._generateRoute = function(e, t, n) {
if (!e.routing.include) return null;
var r = {
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
}, a = e.routing.host;
a && (a.startsWith("*.") ? (r.spec.wildcardPolicy = "Subdomain", r.spec.host = "wildcard" + a.substring(1)) : r.spec.host = a), e.routing.path && (r.spec.path = e.routing.path), e.routing.targetPort && (r.spec.port = {
targetPort: e.routing.targetPort
});
var o = e.routing.tls;
return o && o.termination && (r.spec.tls = {
termination: o.termination
}, o.insecureEdgeTerminationPolicy && (r.spec.tls.insecureEdgeTerminationPolicy = o.insecureEdgeTerminationPolicy), "passthrough" !== o.termination && (o.certificate && (r.spec.tls.certificate = o.certificate), o.key && (r.spec.tls.key = o.key), o.caCertificate && (r.spec.tls.caCertificate = o.caCertificate), o.destinationCACertificate && "reencrypt" === o.termination && (r.spec.tls.destinationCACertificate = o.destinationCACertificate))), r;
}, o._generateDeploymentConfig = function(e, t, n) {
var r = i(e.deploymentConfig.envVars), a = angular.copy(e.labels);
a.deploymentconfig = e.name;
var o, s = {
image: t.toString(),
name: e.name,
ports: n,
env: r,
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
labels: a
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
targetCPUUtilizationPercentage: e.scaling.targetCPU
}
};
}, o._generateBuildConfig = function(e, t) {
var n = i(e.buildConfig.envVars), r = [ {
generic: {
secret: o._generateSecret()
},
type: "Generic"
} ];
e.buildConfig.buildOnSourceChange && r.push({
github: {
secret: o._generateSecret()
},
type: "GitHub"
}), e.buildConfig.buildOnImageChange && r.push({
imageChange: {},
type: "ImageChange"
}), e.buildConfig.buildOnConfigChange && r.push({
type: "ConfigChange"
});
var a = new URI(e.buildConfig.sourceUrl), s = a.fragment();
s || (s = "master"), a.fragment("");
var c = a.href(), l = {
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
name: e.imageName + ":" + e.imageTag,
namespace: e.namespace
},
env: n
}
},
triggers: r
}
};
return _.get(e, "buildConfig.secrets.gitSecret[0].name") && (l.spec.source.sourceSecret = _.head(e.buildConfig.secrets.gitSecret)), e.buildConfig.contextDir && (l.spec.source.contextDir = e.buildConfig.contextDir), l;
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
}, o.ifResourcesDontExist = function(n, r) {
function o() {
0 === l && (s.length > 0 ? i.reject({
nameTaken: !0
}) : i.resolve({
nameTaken: !1
}));
}
var i = a.defer(), s = [], c = [], l = n.length;
return n.forEach(function(n) {
var a = t.objectToResourceGroupVersion(n);
return a ? t.apiInfo(a) ? void e.get(a, n.metadata.name, {
namespace: r
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
} ]), angular.module("openshiftConsole").service("Navigate", [ "$location", "$window", "$timeout", "annotationFilter", "LabelFilter", "$filter", "APIService", function(e, t, n, r, a, o, i) {
var s = o("annotation"), c = o("buildConfigForBuild"), l = o("isJenkinsPipelineStrategy"), u = o("displayName"), d = function(e, t) {
return _.get(t, "isPipeline") ? "pipelines" : _.isObject(e) && l(e) ? "pipelines" : "builds";
};
return {
toErrorPage: function(n, r, a) {
var o = URI("error").query({
error_description: n,
error: r
}).toString();
a ? t.location.href = o : e.url(o).replace();
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
catalogURL: function(e) {
var t = angular.isString(e) ? e : _.get(e, "metadata.name");
return t ? "project/" + encodeURIComponent(t) + "/catalog" : "catalog";
},
toProjectCatalog: function(t, n) {
var r = e.path(this.catalogURL(t));
n && r.search(n);
},
quotaURL: function(e) {
return "project/" + encodeURIComponent(e) + "/quota";
},
createFromImageURL: function(e, t, n, r) {
return URI.expand("project/{project}/create/fromimage{?q*}", {
project: n,
q: angular.extend({
imageStream: e.metadata.name,
imageTag: t,
namespace: e.metadata.namespace,
displayName: u(e)
}, r || {})
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
toNextSteps: function(t, n, r) {
var a = {
name: t
};
_.isObject(r) && _.extend(a, r), e.path("project/" + encodeURIComponent(n) + "/create/next").search(a);
},
toPodsForDeployment: function(t, r) {
1 !== _.size(r) ? (e.url("/project/" + t.metadata.namespace + "/browse/pods"), n(function() {
a.setLabelSelector(new LabelSelector(t.spec.selector, !0));
}, 1)) : this.toResourceURL(_.sample(r));
},
resourceURL: function(e, t, n, r, a) {
if (r = r || "browse", !(e && (e.metadata || t && n))) return null;
t || (t = e.kind), n || (n = e.metadata.namespace);
var s = e;
e.metadata && (s = e.metadata.name);
var c = URI("").segment("project").segmentCoded(n).segment(r);
switch (t) {
case "Build":
var l = o("buildConfigForBuild")(e), u = d(e, a);
l ? c.segment(u).segmentCoded(l).segmentCoded(s) : c.segment(u + "-noconfig").segmentCoded(s);
break;

case "BuildConfig":
c.segment(d(e, a)).segmentCoded(s);
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
var m = s.indexOf(":");
c.segment("images").segmentCoded(s.substring(0, m)).segmentCoded(s.substring(m + 1));
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
var p;
if (e.metadata) p = i.objectToResourceGroupVersion(e); else if (_.get(a, "apiVersion")) {
var f = i.kindToResource(t), g = i.parseGroupVersion(a.apiVersion);
g.resource = f, p = i.toResourceGroupVersion(g);
} else p = i.toResourceGroupVersion(i.kindToResource(t));
if (!i.apiInfo(p)) return null;
c.segment("other").search({
kind: t,
group: p.group
});
}
return _.get(a, "tab") && c.setSearch("tab", a.tab), c.toString();
},
toResourceURL: function(t) {
e.url(this.resourceURL(t));
},
configURLForResource: function(e, t) {
var n, r, a = _.get(e, "kind"), o = _.get(e, "metadata.namespace");
if (!a || !o) return null;
switch (a) {
case "Build":
return (n = c(e)) ? this.resourceURL(n, "BuildConfig", o, t, {
isPipeline: l(e)
}) : null;

case "ReplicationController":
return (r = s(e, "deploymentConfig")) ? this.resourceURL(r, "DeploymentConfig", o, t) : null;
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
healthCheckURL: function(e, t, n, r) {
return URI.expand("project/{projectName}/edit/health-checks?kind={kind}&name={name}&group={group}", {
projectName: e,
kind: t,
name: n,
group: r || ""
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
return t.prototype.add = function(t, r, a, o) {
var i = {
status: "started",
titles: t,
helpLinks: r,
namespace: a
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
} ]), angular.module("openshiftConsole").factory("ImageStreamResolver", [ "$q", "APIService", "DataService", function(e, t, n) {
function r() {}
var a = t.getPreferredVersion("imagestreamimages");
return r.prototype.fetchReferencedImageStreamImages = function(t, r, o, i) {
var s = {};
return angular.forEach(t, function(e) {
angular.forEach(e.spec.containers, function(e) {
var t = e.image;
if (t && !r[t] && !s[t]) {
var c = o[t];
if (c) {
var l = c.split("@"), u = n.get(a, c, i);
u.then(function(e) {
if (e && e.image) {
var n = angular.copy(e.image);
n.imageStreamName = l[0], n.imageStreamNamespace = i.project.metadata.name, r[t] = n;
}
}), s[t] = u;
}
}
});
}), e.all(s);
}, r.prototype.buildDockerRefMapForImageStreams = function(e, t) {
angular.forEach(e, function(e) {
angular.forEach(e.status.tags, function(n) {
angular.forEach(n.items, function(n) {
n.image && (t[n.dockerImageReference] = e.metadata.name + "@" + n.image);
});
});
});
}, new r();
} ]), angular.module("openshiftConsole").factory("ContainerWebSocket", [ "API_CFG", "$ws", function(e, t) {
return function(n, r) {
return 0 === n.indexOf("/") && (n = ("http:" === window.location.protocol ? "ws://" : "wss://") + e.openshift.hostPort + n), t({
url: n,
method: "WATCH",
protocols: r,
auth: {}
});
};
} ]), angular.module("openshiftConsole").factory("BaseHref", [ "$document", function(e) {
return e.find("base").attr("href") || "/";
} ]), angular.module("openshiftConsole").factory("BuildsService", [ "$filter", "$q", "APIService", "DataService", "Navigate", "NotificationsService", function(e, t, n, r, a, o) {
var i = n.getPreferredVersion("buildconfigs/instantiate"), s = n.getPreferredVersion("builds/clone"), c = e("annotation"), l = e("buildConfigForBuild"), u = e("getErrorDetails"), d = e("isIncompleteBuild"), m = e("isJenkinsPipelineStrategy"), p = e("isNewerResource"), f = function(e) {
var t = c(e, "buildNumber") || parseInt(e.metadata.name.match(/(\d+)$/), 10);
return isNaN(t) ? null : t;
}, g = function(e, t) {
var n = f(e);
return t && n ? t + " #" + n : e.metadata.name;
}, v = function(e) {
return "true" === c(e, "openshift.io/build-config.paused");
}, h = function(e) {
return e.status.startTimestamp || e.metadata.creationTimestamp;
}, y = function(e) {
return _.round(e / 1e3 / 1e3);
}, b = e("imageObjectRef"), S = function(e) {
var t = c(e, "jenkinsStatus");
if (!t) return null;
try {
return JSON.parse(t);
} catch (e) {
return Logger.error("Could not parse Jenkins status as JSON", t), null;
}
};
return {
startBuild: function(e) {
var s = m(e) ? "pipeline" : "build", c = {
kind: "BuildRequest",
apiVersion: n.toAPIVersion(i),
metadata: {
name: e.metadata.name
}
}, l = {
namespace: e.metadata.namespace
};
return r.create(i, e.metadata.name, c, l).then(function(t) {
var n, r, i = g(t, e.metadata.name), c = _.get(e, "spec.runPolicy");
"Serial" === c || "SerialLatestOnly" === c ? (n = _.capitalize(s) + " " + i + " successfully queued.", r = "Builds for " + e.metadata.name + " are configured to run one at a time.") : n = _.capitalize(s) + " " + i + " successfully created.", o.addNotification({
type: "success",
message: n,
details: r,
links: [ {
href: a.resourceURL(t),
label: "View Build"
} ]
});
}, function(e) {
return o.addNotification({
type: "error",
message: "An error occurred while starting the " + s + ".",
details: u(e)
}), t.reject(e);
});
},
cancelBuild: function(e, a) {
var i = m(e) ? "pipeline" : "build", s = g(e, a), c = {
namespace: e.metadata.namespace
}, l = angular.copy(e), d = n.objectToResourceGroupVersion(l);
return l.status.cancelled = !0, r.update(d, l.metadata.name, l, c).then(function() {
o.addNotification({
type: "success",
message: _.capitalize(i) + " " + s + " successfully cancelled."
});
}), function(e) {
return o.addNotification({
type: "error",
message: "An error occurred cancelling " + i + " " + s + ".",
details: u(e)
}), t.reject(e);
};
},
cloneBuild: function(e, i) {
var c = m(e) ? "pipeline" : "build", l = g(e, i), d = {
kind: "BuildRequest",
apiVersion: n.toAPIVersion(s),
metadata: {
name: e.metadata.name
}
}, p = {
namespace: e.metadata.namespace
};
return r.create(s, e.metadata.name, d, p).then(function(e) {
var t = g(e, i);
o.addNotification({
type: "success",
message: _.capitalize(c) + " " + l + " is being rebuilt as " + t + ".",
links: [ {
href: a.resourceURL(e),
label: "View Build"
} ]
});
}, function(e) {
return o.addNotification({
type: "error",
message: "An error occurred while rerunning " + c + " " + l + ".",
details: u(e)
}), t.reject();
});
},
isPaused: v,
canBuild: function(e) {
return !!e && !e.metadata.deletionTimestamp && !v(e);
},
usesDeploymentConfigs: function(e) {
var t = c(e, "pipeline.alpha.openshift.io/uses");
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
var n = c(t, "buildConfig");
return !n || n === e;
});
},
latestBuildByConfig: function(e, t) {
var n = {};
return _.each(e, function(e) {
var r = l(e) || "";
t && !t(e) || p(e, n[r]) && (n[r] = e);
}), n;
},
getBuildNumber: f,
getBuildDisplayName: g,
getStartTimestsamp: h,
getDuration: function(e) {
var t = _.get(e, "status.duration");
if (t) return y(t);
var n = h(e), r = e.status.completionTimestamp;
return n && r ? moment(r).diff(moment(n)) : 0;
},
incompleteBuilds: function(e) {
return _.map(e, function(e) {
return d(e);
});
},
completeBuilds: function(e) {
return _.map(e, function(e) {
return !d(e);
});
},
lastCompleteByBuildConfig: function(t) {
return _.reduce(t, function(t, n) {
if (d(n)) return t;
var r = e("annotation")(n, "buildConfig");
return p(n, t[r]) && (t[r] = n), t;
}, {});
},
interestingBuilds: function(t) {
var n = {};
return _.filter(t, function(t) {
if (d(t)) return !0;
var r = e("annotation")(t, "buildConfig");
p(t, n[r]) && (n[r] = t);
}).concat(_.map(n, function(e) {
return e;
}));
},
groupBuildConfigsByOutputImage: function(e) {
var t = {};
return _.each(e, function(e) {
var n = _.get(e, "spec.output.to"), r = b(n, e.metadata.namespace);
r && (t[r] = t[r] || [], t[r].push(e));
}), t;
},
sortBuilds: function(e, t) {
var n = function(e, n) {
var r, a, o = f(e), i = f(n);
return o || i ? o ? i ? t ? i - o : o - i : t ? -1 : 1 : t ? 1 : -1 : (r = _.get(e, "metadata.name", ""), a = _.get(n, "metadata.name", ""), t ? a.localeCompare(r) : r.localeCompare(a));
};
return _.toArray(e).sort(function(e, r) {
var a = _.get(e, "metadata.creationTimestamp", ""), o = _.get(r, "metadata.creationTimestamp", "");
return a === o ? n(e, r) : t ? o.localeCompare(a) : a.localeCompare(o);
});
},
getJenkinsStatus: S,
getCurrentStage: function(e) {
var t = S(e), n = _.get(t, "stages", []);
return _.last(n);
}
};
} ]), angular.module("openshiftConsole").factory("DeploymentsService", [ "$filter", "$q", "APIService", "DataService", "LabelFilter", "NotificationsService", function(e, t, n, r, a, o) {
function i() {}
var s = n.getPreferredVersion("deploymentconfigs/instantiate"), c = n.getPreferredVersion("deploymentconfigs/rollback"), l = n.getPreferredVersion("pods"), u = n.getPreferredVersion("replicationcontrollers"), d = e("annotation");
i.prototype.startLatestDeployment = function(t, a) {
var i = {
kind: "DeploymentRequest",
apiVersion: n.toAPIVersion(s),
name: t.metadata.name,
latest: !0,
force: !0
};
r.create(s, t.metadata.name, i, a).then(function(e) {
o.addNotification({
type: "success",
message: "Deployment #" + e.status.latestVersion + " of " + t.metadata.name + " has started."
});
}, function(t) {
o.addNotification({
type: "error",
message: "An error occurred while starting the deployment.",
details: e("getErrorDetails")(t)
});
});
}, i.prototype.retryFailedDeployment = function(t, a, i) {
var s = angular.copy(t), c = n.objectToResourceGroupVersion(t), u = t.metadata.name, m = d(t, "deploymentConfig");
r.list(l, a, function(t) {
var n = t.by("metadata.name");
angular.forEach(n, function(t) {
var n = e("annotationName")("deployerPodFor");
t.metadata.labels[n] === u && r.delete(l, t.metadata.name, i).then(function() {
Logger.info("Deployer pod " + t.metadata.name + " deleted");
}, function(t) {
i.alerts = i.alerts || {}, i.alerts.retrydeployer = {
type: "error",
message: "An error occurred while deleting the deployer pod.",
details: e("getErrorDetails")(t)
};
});
});
});
var p = e("annotationName")("deploymentStatus"), f = e("annotationName")("deploymentStatusReason"), g = e("annotationName")("deploymentCancelled");
s.metadata.annotations[p] = "New", delete s.metadata.annotations[f], delete s.metadata.annotations[g], r.update(c, u, s, a).then(function() {
o.addNotification({
type: "success",
message: "Retrying deployment " + u + " of " + m + "."
});
}, function(t) {
o.addNotification({
type: "error",
message: "An error occurred while retrying the deployment.",
details: e("getErrorDetails")(t)
});
});
}, i.prototype.rollbackToDeployment = function(t, a, i, s, l) {
var u = t.metadata.name, m = d(t, "deploymentConfig"), p = {
apiVersion: n.toAPIVersion(c),
kind: "DeploymentConfigRollback",
name: m,
spec: {
from: {
name: u
},
includeTemplate: !0,
includeReplicationMeta: a,
includeStrategy: i,
includeTriggers: s
}
};
r.create(c, m, p, l).then(function(t) {
var a = n.objectToResourceGroupVersion(t);
r.update(a, m, t, l).then(function(e) {
o.addNotification({
type: "success",
message: "Deployment #" + e.status.latestVersion + " is rolling back " + m + " to " + u + "."
});
}, function(t) {
o.addNotification({
id: "rollback-deployment-error",
type: "error",
message: "An error occurred while rolling back the deployment.",
details: e("getErrorDetails")(t)
});
});
}, function(t) {
o.addNotification({
id: "rollback-deployment-error",
type: "error",
message: "An error occurred while rolling back the deployment.",
details: e("getErrorDetails")(t)
});
});
}, i.prototype.cancelRunningDeployment = function(t, n) {
var a = t.metadata.name, i = e("annotation")(t, "deploymentConfig"), s = angular.copy(t), c = e("annotationName")("deploymentCancelled"), l = e("annotationName")("deploymentStatusReason");
s.metadata.annotations[c] = "true", s.metadata.annotations[l] = "The deployment was cancelled by the user", r.update(u, a, s, n).then(function() {
o.addNotification({
type: "success",
message: "Cancelled deployment " + a + " of " + i + "."
});
}, function(t) {
o.addNotification({
id: "cancel-deployment-error",
type: "error",
message: "An error occurred while cancelling the deployment.",
details: e("getErrorDetails")(t)
});
});
}, i.prototype.associateDeploymentsToDeploymentConfig = function(t, n, r) {
var o = {}, i = a.getLabelSelector();
return angular.forEach(t, function(t, a) {
var s = e("annotation")(t, "deploymentConfig");
(!r || n && n[s] || i.matches(t)) && (o[s = s || ""] = o[s] || {}, o[s][a] = t);
}), angular.forEach(n, function(e, t) {
o[t] = o[t] || {};
}), o;
}, i.prototype.deploymentBelongsToConfig = function(t, n) {
return !(!t || !n) && n === e("annotation")(t, "deploymentConfig");
}, i.prototype.associateRunningDeploymentToDeploymentConfig = function(t) {
var n = {};
return angular.forEach(t, function(t, r) {
n[r] = {}, angular.forEach(t, function(t, a) {
var o = e("deploymentStatus")(t);
"New" !== o && "Pending" !== o && "Running" !== o || (n[r][a] = t);
});
}), n;
}, i.prototype.getActiveDeployment = function(t) {
var n = e("deploymentIsInProgress"), r = e("annotation"), a = null;
return _.each(t, function(e) {
if (n(e)) return a = null, !1;
"Complete" === r(e, "deploymentStatus") && (!a || a.metadata.creationTimestamp < e.metadata.creationTimestamp) && (a = e);
}), a;
}, i.prototype.getRevision = function(e) {
return d(e, "deployment.kubernetes.io/revision");
}, i.prototype.isActiveReplicaSet = function(e, t) {
var n = this.getRevision(e), r = this.getRevision(t);
return !(!n || !r) && n === r;
}, i.prototype.getActiveReplicaSet = function(e, t) {
var n = this.getRevision(t);
if (!n) return null;
var r = this;
return _.find(e, function(e) {
return r.getRevision(e) === n;
});
}, i.prototype.getScaleResource = function(e) {
var t = {
resource: n.kindToResource(e.kind) + "/scale"
};
switch (e.kind) {
case "DeploymentConfig":
break;

case "Deployment":
case "ReplicaSet":
case "ReplicationController":
t.group = "extensions";
break;

default:
return null;
}
return t;
}, i.prototype.scale = function(e, n) {
var a = this.getScaleResource(e);
if (!a) return t.reject({
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
replicas: n
}
};
return r.update(a, e.metadata.name, o, {
namespace: e.metadata.namespace
});
};
var m = function(e, t) {
var n = _.get(t, [ e ]);
return !_.isEmpty(n);
}, p = function(e, t) {
var n = _.get(t, [ e ]);
return !_.isEmpty(n);
};
return i.prototype.isScalable = function(e, t, n, r, a) {
if (p(e.metadata.name, r)) return !1;
var o = d(e, "deploymentConfig");
return !o || !!t && (!t[o] || !m(o, n) && _.get(a, [ o, "metadata", "name" ]) === e.metadata.name);
}, i.prototype.groupByDeploymentConfig = function(t) {
var n = {};
return _.each(t, function(t) {
var r = e("annotation")(t, "deploymentConfig") || "";
_.set(n, [ r, t.metadata.name ], t);
}), n;
}, i.prototype.sortByDeploymentVersion = function(e, t) {
return _.toArray(e).sort(function(e, n) {
var r, a, o = parseInt(d(e, "deploymentVersion"), 10), i = parseInt(d(n, "deploymentVersion"), 10);
return _.isFinite(o) || _.isFinite(i) ? o ? i ? t ? i - o : o - i : t ? -1 : 1 : t ? 1 : -1 : (r = _.get(e, "metadata.name", ""), a = _.get(n, "metadata.name", ""), t ? a.localeCompare(r) : r.localeCompare(a));
});
}, i.prototype.sortByRevision = function(e) {
var t = this, n = function(e) {
var n = t.getRevision(e);
if (!n) return null;
var r = parseInt(n, 10);
return isNaN(r) ? null : r;
};
return _.toArray(e).sort(function(e, t) {
var r = n(e), a = n(t);
return r || a ? r ? a ? a - r : -1 : 1 : e.metadata.name.localeCompare(t.metadata.name);
});
}, i.prototype.setPaused = function(e, t, a) {
var o = angular.copy(e), i = n.objectToResourceGroupVersion(e);
return _.set(o, "spec.paused", t), r.update(i, e.metadata.name, o, a);
}, new i();
} ]), angular.module("openshiftConsole").factory("ImageStreamsService", function() {
return {
tagsByName: function(e) {
var t = {};
return angular.forEach(e.spec.tags, function(n) {
t[n.name] = t[n.name] || {}, t[n.name].name = n.name, t[n.name].spec = angular.copy(n);
var r = t[n.name].spec.from;
if (r) {
var a;
if ("ImageStreamImage" === r.kind ? a = "@" : "ImageStreamTag" === r.kind && (a = ":"), a) {
r._nameConnector = a;
var o = r.name.split(a);
1 === o.length ? (r._imageStreamName = e.metadata.name, r._idOrTag = o[0], r._completeName = r._imageStreamName + a + r._idOrTag) : (r._imageStreamName = o.shift(), r._idOrTag = o.join(a), r._completeName = r._imageStreamName + a + r._idOrTag);
}
}
}), angular.forEach(e.status.tags, function(e) {
t[e.tag] = t[e.tag] || {}, t[e.tag].name = e.tag, t[e.tag].status = angular.copy(e);
}), t;
}
};
}), angular.module("openshiftConsole").factory("MembershipService", [ "$filter", "APIService", "Constants", function(e, t, n) {
e("annotation");
var r = function() {
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
}
};
}, o = function(e) {
return _.reduce(e, function(e, n) {
var a = t.parseGroupVersion(n.apiVersion).group;
return e[r(a, n.kind, n.metadata.name)] = n, e;
}, {});
};
return {
sortRoles: function(e) {
return _.sortBy(e, "metadata.name");
},
filterRoles: function(e) {
return _.filter(e, function(e) {
return "Role" === e.kind || _.includes(n.MEMBERSHIP_WHITELIST, e.metadata.name);
});
},
mapRolesForUI: function(e, t) {
return _.merge(o(e), o(t));
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
var n = _.reduce(e, function(e, n) {
var a = r(n.roleRef.apiGroup, n.roleRef.kind, n.roleRef.name);
return _.each(n.subjects, function(n) {
var o = r(n.namespace, n.name);
e[n.kind].subjects[o] || (e[n.kind].subjects[o] = {
name: n.name,
roles: {}
}, n.namespace && (e[n.kind].subjects[o].namespace = n.namespace)), _.includes(e[n.kind].subjects[o].roles, a) || t[a] && (e[n.kind].subjects[o].roles[a] = t[a]);
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
}
});
return _.sortBy(n, "sortOrder");
}
};
} ]), angular.module("openshiftConsole").factory("RolesService", [ "$q", "APIService", "DataService", function(e, t, n) {
var r = t.getPreferredVersion("roles"), a = t.getPreferredVersion("clusterroles");
return {
listAllRoles: function(t) {
return e.all([ n.list(r, t, null), n.list(a, {}, null) ]);
}
};
} ]), angular.module("openshiftConsole").factory("RoleBindingsService", [ "$q", "APIService", "DataService", function(e, t, n) {
var r = t.getPreferredVersion("rolebindings"), a = function(e, t) {
return {
kind: "RoleBinding",
apiVersion: "v1",
metadata: {
generateName: _.get(e, "metadata.name") + "-",
namespace: t
},
roleRef: {
name: _.get(e, "metadata.name"),
namespace: _.get(e, "metadata.namespace")
},
subjects: []
};
}, o = function(e, t) {
return _.isEqual(e.kind, "ServiceAccount") && (e.namespace = e.namespace || t), e;
};
return {
create: function(e, r, i, s) {
var c = a(e, i), l = t.objectToResourceGroupVersion(c);
return r = o(r, i), c.subjects.push(angular.copy(r)), n.create(l, null, c, s);
},
addSubject: function(e, r, i, s) {
var c = a(), l = _.extend(c, e), u = t.objectToResourceGroupVersion(l);
if (!r) return l;
if (r = o(r, i), _.isArray(l.subjects)) {
if (_.includes(l.subjects, r)) return;
l.subjects.push(r);
} else l.subjects = [ r ];
return n.update(u, l.metadata.name, l, s);
},
removeSubject: function(t, o, i, s, c) {
var l = _.filter(s, {
roleRef: {
name: o
}
});
return e.all(_.map(l, function(e) {
var o = a();
e = _.extend(o, e);
var s = {
name: t
};
return i && (s.namespace = i), e.subjects = _.reject(e.subjects, s), e.subjects.length ? n.update(r, e.metadata.name, e, c) : n.delete(r, e.metadata.name, c).then(function() {
return e;
});
}));
}
};
} ]), angular.module("openshiftConsole").factory("MetricsService", [ "$filter", "$http", "$q", "$rootScope", "APIDiscovery", function(e, t, n, r, a) {
function o() {
return angular.isDefined(u) ? n.when(u) : a.getMetricsURL().then(function(e) {
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
return n = "counter" === e.type ? t + f : t + p, URI.expand(n, {
podUID: e.pod.metadata.uid,
containerName: e.containerName,
metric: e.metric
}).toString();
});
}
var u, d, m, p = "/gauges/{containerName}%2F{podUID}%2F{metric}/data", f = "/counters/{containerName}%2F{podUID}%2F{metric}/data", g = function(e) {
var t = e.split("/");
return {
podUID: t[1],
descriptor: t[2] + "/" + t[3]
};
}, v = function(e, n, r) {
var a = _.keyBy(r.pods, "metadata.uid");
return t.post(e, n, {
auth: {},
headers: {
Accept: "application/json",
"Content-Type": "application/json",
"Hawkular-Tenant": r.namespace
}
}).then(function(e) {
var t = {}, n = function(e, n) {
var r = g(n), o = _.get(a, [ r.podUID, "metadata", "name" ]), s = i(e);
_.set(t, [ r.descriptor, o ], s);
};
return _.each(e.data.counter, n), _.each(e.data.gauge, n), t;
});
}, h = _.template("descriptor_name:network/tx_rate|network/rx_rate,type:pod,pod_id:<%= uid %>"), y = _.template("descriptor_name:memory/usage|cpu/usage_rate,type:pod_container,pod_id:<%= uid %>,container_name:<%= containerName %>"), b = _.template("descriptor_name:network/tx_rate|network/rx_rate|memory/usage|cpu/usage_rate,type:pod,pod_id:<%= uid %>");
return {
isAvailable: function(e) {
return o().then(function(n) {
return !!n && (!e || !!d || !m && t.get(n).then(function() {
return d = !0, !0;
}, function(e) {
return m = !0, r.$broadcast("metrics-connection-failed", {
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
var r = {
bucketDuration: e.bucketDuration,
start: e.start
};
return e.end && (r.end = e.end), t.get(n, {
auth: {},
headers: {
Accept: "application/json",
"Hawkular-Tenant": e.namespace
},
params: r
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
var r = {
bucketDuration: "1mn",
start: "-1mn"
};
return t.get(n, {
auth: {},
headers: {
Accept: "application/json",
"Hawkular-Tenant": e.namespace
},
params: r
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
var r = {
bucketDuration: e.bucketDuration,
start: e.start
};
e.end && (r.end = e.end);
var a = [], o = [], i = s(_.map(e.pods, "metadata.uid"));
return e.containerName ? (a.push(_.assign({
tags: y({
uid: i,
containerName: e.containerName
})
}, r)), a.push(_.assign({
tags: h({
uid: i
})
}, r))) : a.push(_.assign({
tags: b({
uid: i
})
}, r)), _.each(a, function(n) {
var r = v(t, n, e);
o.push(r);
}), n.all(o).then(function(e) {
var t = {};
return _.each(e, function(e) {
_.assign(t, e);
}), t;
});
});
},
getCustomMetrics: function(e) {
var n = e.metadata.namespace, r = e.metadata.uid;
return o().then(function(e) {
if (!e) return null;
var a = e + "/m", o = {
tags: "custom_metric:true,pod_id:" + r
};
return t.get(a, {
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
}, r = {
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
var t, a = {
type: "spline",
x: "dates",
names: r
}, o = {};
return _.each(e, function(e, r) {
t = [ "dates" ], o[r] = [ r ], _.each(e, function(e) {
var a = n(e, r);
t.push(e.start), o[r].push(a);
});
}), a.columns = [ t ].concat(_.values(o)), a;
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
} ]), angular.module("openshiftConsole").factory("StorageService", [ "$filter", "APIService", "DataService", "NotificationsService", function(e, t, n, r) {
var a = e("getErrorDetails"), o = e("humanizeKind");
return {
createVolume: function(e, t) {
return {
name: e,
persistentVolumeClaim: {
claimName: t.metadata.name
}
};
},
createVolumeMount: function(e, t, n, r) {
var a = {
name: e,
mountPath: t,
readOnly: !!r
};
return n && (a.subPath = n), a;
},
getVolumeNames: function(e) {
var t = _.get(e, "spec.volumes", []);
return _.map(t, "name");
},
getMountPaths: function(e, t) {
var n = [], r = _.get(e, "spec.containers", []);
return _.each(r, function(e) {
if (!t || t(e)) {
var r = _.get(e, "volumeMounts", []);
_.each(r, function(e) {
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
r.addNotification({
type: "success",
message: "Volume " + i.name + " removed from " + o(e.kind) + " " + e.metadata.name + "."
});
}, function(t) {
r.addNotification({
type: "error",
message: "An error occurred removing volume " + i.name + " from " + o(e.kind) + " " + e.metadata.name + ".",
details: a(t)
});
});
}
};
} ]), angular.module("openshiftConsole").factory("LimitRangesService", [ "$filter", "$window", "Constants", function(e, t, n) {
var r = e("annotation"), a = e("usageValue"), o = e("usageWithUnits"), i = function(e, t) {
return !!e && (!t || a(e) < a(t));
}, s = function(e, t) {
return !!e && (!t || a(e) > a(t));
}, c = function(e) {
return _.includes(n.CLUSTER_RESOURCE_OVERRIDES_EXEMPT_PROJECT_NAMES, e);
}, l = function(e) {
return _.some(n.CLUSTER_RESOURCE_OVERRIDES_EXEMPT_PROJECT_PREFIXES, function(t) {
return _.startsWith(e, t);
});
}, u = function(e) {
var t = r(e, "quota.openshift.io/cluster-resource-override-enabled");
return !!t && "true" !== t;
}, d = function(e) {
var t = _.get(e, "metadata.name");
return c(t) || l(t) || u(e);
}, m = function(e) {
return !!_.get(t, "OPENSHIFT_CONFIG.clusterResourceOverridesEnabled") && !d(e);
}, p = function(e, t) {
return m(t);
}, f = function(e, t) {
return "cpu" === e && m(t);
}, g = function(e, t, n) {
var r = {};
return angular.forEach(e, function(e) {
angular.forEach(e.spec.limits, function(e) {
if (e.type === n) {
e.min && s(e.min[t], r.min) && (r.min = e.min[t]), e.max && i(e.max[t], r.max) && (r.max = e.max[t]), e.default && (r.defaultLimit = e.default[t] || r.defaultLimit), e.defaultRequest && (r.defaultRequest = e.defaultRequest[t] || r.defaultRequest);
var a;
e.maxLimitRequestRatio && (a = e.maxLimitRequestRatio[t]) && (!r.maxLimitRequestRatio || a < r.maxLimitRequestRatio) && (r.maxLimitRequestRatio = a);
}
});
}), r;
};
return {
getEffectiveLimitRange: g,
hasClusterResourceOverrides: m,
isRequestCalculated: p,
isLimitCalculated: f,
validatePodLimits: function(t, n, r, i) {
if (!r || !r.length) return [];
var s = g(t, n, "Pod"), c = g(t, n, "Container"), l = 0, u = 0, d = s.min && a(s.min), m = s.max && a(s.max), v = [], h = e("computeResourceLabel")(n, !0);
return angular.forEach(r, function(e) {
var t = e.resources || {}, r = t.requests && t.requests[n] || c.defaultRequest;
r && (l += a(r));
var o = t.limits && t.limits[n] || c.defaultLimit;
o && (u += a(o));
}), p(0, i) || (d && l < d && v.push(h + " request total for all containers is less than pod minimum (" + o(s.min, n) + ")."), m && l > m && v.push(h + " request total for all containers is greater than pod maximum (" + o(s.max, n) + ").")), f(n, i) || (d && u < d && v.push(h + " limit total for all containers is less than pod minimum (" + o(s.min, n) + ")."), m && u > m && v.push(h + " limit total for all containers is greater than pod maximum (" + o(s.max, n) + ").")), v;
}
};
} ]), angular.module("openshiftConsole").factory("RoutesService", [ "$filter", function(e) {
var t = function(e) {
return angular.isString(e);
}, n = function(e, n) {
return _.find(n.spec.ports, function(n) {
return t(e) ? n.name === e : n.targetPort === e;
});
}, r = function(e, r, a, o) {
if ("Service" === r.kind) {
var i = _.get(a, [ r.name ]);
if (i) {
var s = e.spec.port ? e.spec.port.targetPort : null;
s ? n(s, i) || (t(s) ? o.push('Route target port is set to "' + s + '", but service "' + i.metadata.name + '" has no port with that name.') : o.push('Route target port is set to "' + s + '", but service "' + i.metadata.name + '" does not expose that port.')) : _.size(i.spec.ports) > 1 && o.push('Route has no target port, but service "' + i.metadata.name + '" has multiple ports. The route will round robin traffic across all exposed ports on the service.');
} else o.push('Routes to service "' + r.name + '", but service does not exist.');
}
}, a = function(e, t) {
e.spec.tls && (e.spec.tls.termination || t.push("Route has a TLS configuration, but no TLS termination type is specified. TLS will not be enabled until a termination type is set."), "passthrough" === e.spec.tls.termination && e.spec.path && t.push('Route path "' + e.spec.path + '" will be ignored since the route uses passthrough termination.'));
}, o = function(e, t) {
var n = _.get(e, "spec.wildcardPolicy");
angular.forEach(e.status.ingress, function(e) {
var r = _.find(e.conditions, {
type: "Admitted",
status: "False"
});
if (r) {
var a = "Requested host " + (e.host || "<unknown host>") + " was rejected by the router.";
(r.message || r.reason) && (a += " Reason: " + (r.message || r.reason) + "."), t.push(a);
}
r || "Subdomain" !== n || e.wildcardPolicy === n || t.push('Router "' + e.routerName + '" does not support wildcard subdomains. Your route will only be available at host ' + e.host + ".");
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
return e ? (r(e, e.spec.to, t, n), _.each(e.spec.alternateBackends, function(a) {
r(e, a, t, n);
}), a(e, n), o(e, n), n) : n;
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
updateDonutCenterText: function(t, n, r) {
var a = d3.select(t).select("text.c3-chart-arcs-title");
a ? (a.selectAll("*").remove(), a.insert("tspan").text(n).classed(r ? "donut-title-big-pf" : "donut-title-med-pf", !0).attr("dy", r ? 0 : 5).attr("x", 0), r && a.insert("tspan").text(r).classed("donut-title-small-pf", !0).attr("dy", 20).attr("x", 0)) : e.warn("Can't select donut title element");
}
};
} ]), angular.module("openshiftConsole").service("HomePagePreferenceService", [ "$location", "$timeout", "$q", "$uibModal", "AuthService", "Logger", "Navigate", "NotificationsService", function(e, t, n, r, a, o, i, s) {
var c = function() {
localStorage.removeItem("openshift/home-page-pref/");
};
return {
getHomePagePreference: function() {
var e;
try {
e = JSON.parse(localStorage.getItem("openshift/home-page-pref/"));
} catch (e) {
return o.error("Could not parse homePagePref as JSON", e), "catalog-home";
}
return _.get(e, "type", "catalog-home");
},
setHomePagePreference: function(e) {
localStorage.setItem("openshift/home-page-pref/", JSON.stringify(e));
},
getHomePageProjectName: function() {
var e;
try {
e = JSON.parse(localStorage.getItem("openshift/home-page-pref/"));
} catch (e) {
return o.error("Could not parse homePagePref as JSON", e), null;
}
return e && "project-overview" === e.type ? e.project : null;
},
getHomePagePath: function() {
var e = this.getHomePagePreference();
if ("project-overview" === e) {
var t = this.getHomePageProjectName();
return "/" + i.projectOverviewURL(t) + "?isHomePage=true";
}
return "project-list" === e ? "/projects" : "/catalog";
},
notifyInvalidProjectHomePage: function(e) {
c(), s.addNotification({
id: "invalid-home-page-preference",
type: "warning",
message: "Home page project not found.",
details: "Project " + e + " no longer exists or you do not have access to it.",
links: [ {
href: "",
label: "Set Home Page",
onClick: function() {
return r.open({
templateUrl: "views/modals/set-home-page-modal.html",
controller: "SetHomePageModalController"
}), !0;
}
} ]
});
}
};
} ]), angular.module("openshiftConsole").factory("HPAService", [ "$filter", "$q", "LimitRangesService", "MetricsService", function(e, t, n, r) {
var a = e("annotation"), o = function(e, t, n) {
return _.every(n, function(n) {
return _.get(n, [ "resources", t, e ]);
});
}, i = function(e, t) {
return o(e, "requests", t);
}, s = function(e, t) {
return o(e, "limits", t);
}, c = function(e, t, r) {
return !!n.getEffectiveLimitRange(r, e, "Container")[t];
}, l = function(e, t) {
return c(e, "defaultRequest", t);
}, u = function(e, t) {
return c(e, "defaultLimit", t);
}, d = function(e, t, r) {
return !!n.hasClusterResourceOverrides(r) || (!(!i("cpu", e) && !l("cpu", t)) || !(!s("cpu", e) && !u("cpu", t)));
}, m = e("humanizeKind"), p = e("hasDeploymentConfig"), f = function(e) {
if (!e) return {
message: "Metrics might not be configured by your cluster administrator. Metrics are required for autoscaling.",
reason: "MetricsNotAvailable"
};
}, g = function(e, t, n) {
var r, a = _.get(e, "spec.template.spec.containers", []);
if (!d(a, t, n)) return r = m(e.kind), {
message: "This " + r + " does not have any containers with a CPU request set. Autoscaling will not work without a CPU request.",
reason: "NoCPURequest"
};
}, v = function(e) {
return _.some(e, function(e) {
return a(e, "autoscaling.alpha.kubernetes.io/metrics");
});
}, h = function(e) {
if (_.size(e) > 1) return {
message: "More than one autoscaler is scaling this resource. This is not recommended because they might compete with each other. Consider removing all but one autoscaler.",
reason: "MultipleHPA"
};
}, y = function(e, t) {
if ("ReplicationController" === e.kind && p(e) && _.some(t, function() {
return _.some(t, function(e) {
return "ReplicationController" === _.get(e, "spec.scaleTargetRef.kind");
});
})) return {
message: "This deployment is scaled by both a deployment configuration and an autoscaler. This is not recommended because they might compete with each other.",
reason: "DeploymentHasHPA"
};
};
return {
usesV2Metrics: function(e) {
return v([ e ]);
},
hasCPURequest: d,
filterHPA: function(e, t, n) {
return _.filter(e, function(e) {
return e.spec.scaleTargetRef.kind === t && e.spec.scaleTargetRef.name === n;
});
},
getHPAWarnings: function(e, n, a, o) {
return !e || _.isEmpty(n) ? t.when([]) : r.isAvailable().then(function(t) {
var r = v(n);
return _.compact([ f(t), !r && g(e, a, o), h(n), y(e, n) ]);
});
},
groupHPAs: function(e) {
var t = {};
return _.each(e, function(e) {
var n = e.spec.scaleTargetRef.name, r = e.spec.scaleTargetRef.kind;
n && r && (_.has(t, [ r, n ]) || _.set(t, [ r, n ], []), t[r][n].push(e));
}), t;
}
};
} ]), angular.module("openshiftConsole").factory("PodsService", [ "OwnerReferencesService", function(e) {
return {
getImageIDs: function(e, t) {
var n = {}, r = /^.*sha256:/;
return _.each(e, function(e) {
var a, o = _.get(e, "status.containerStatuses", []), i = _.find(o, {
name: t
}), s = _.get(i, "imageID", "");
r.test(s) && (a = s.replace(r, ""), n[a] = !0);
}), _.keys(n);
},
generateDebugPod: function(e, t) {
var n = angular.copy(e), r = _.find(n.spec.containers, {
name: t
});
return r ? (n.metadata = {
name: e.metadata.name + "-debug",
annotations: {
"debug.openshift.io/source-container": t,
"debug.openshift.io/source-resource": "pods/" + e.metadata.name
},
labels: {}
}, n.spec.restartPolicy = "Never", delete n.spec.host, delete n.spec.nodeName, n.status = {}, delete r.readinessProbe, delete r.livenessProbe, r.command = [ "sleep" ], r.args = [ "3600" ], n.spec.containers = [ r ], n) : null;
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
setTemplateData: function(t, n, r) {
_.each(t, function(t) {
e.params.all.push({
name: t.name,
value: t.value
});
}), _.each(n, function(t) {
t.value || e.params.generated.push(t.name);
}), r && (e.message = r);
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
}), angular.module("openshiftConsole").factory("SecretsService", [ "$filter", "Logger", "NotificationsService", function(e, t, n) {
var r = function(r, a) {
n.addNotification({
type: "error",
message: "Base64-encoded " + a + " string could not be decoded.",
details: e("getErrorDetails")(r)
}), t.error("Base64-encoded " + a + " string could not be decoded.", r);
}, a = function(e) {
var t = _.pick(e, [ "email", "username", "password" ]);
if (e.auth) try {
_.spread(function(e, n) {
t.username = e, t.password = n;
})(_.split(window.atob(e.auth), ":", 2));
} catch (e) {
return void r(e, "username:password");
}
return t;
}, o = function(e, t) {
var n, o = {
auths: {}
};
try {
n = JSON.parse(window.atob(e));
} catch (e) {
r(e, t);
}
return n.auths ? (_.each(n.auths, function(e, t) {
e.auth ? o.auths[t] = a(e) : o.auths[t] = e;
}), n.credsStore && (o.credsStore = n.credsStore)) : _.each(n, function(e, t) {
o.auths[t] = a(e);
}), o;
}, i = function(e) {
var t = {}, n = _.mapValues(e, function(e, n) {
if (!e) return "";
var r;
return ".dockercfg" === n || ".dockerconfigjson" === n ? o(e, n) : (r = window.atob(e), /[\x00-\x09\x0E-\x1F]/.test(r) ? (t[n] = !0, e) : r);
});
return n.$$nonprintable = t, n;
};
return {
groupSecretsByType: function(e) {
var t = {
source: [],
image: [],
webhook: [],
other: []
};
return _.each(e.by("metadata.name"), function(e) {
switch (e.type) {
case "kubernetes.io/basic-auth":
case "kubernetes.io/ssh-auth":
case "Opaque":
e.data.WebHookSecretKey ? t.webhook.push(e) : t.source.push(e);
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
decodeSecretData: i,
getWebhookSecretValue: function(e, t) {
if (_.get(e, "secretReference.name") && t) {
var n = _.find(t, {
metadata: {
name: e.secretReference.name
}
});
return i(n.data).WebHookSecretKey;
}
return _.get(e, "secret");
}
};
} ]), angular.module("openshiftConsole").factory("ServicesService", [ "$filter", "$q", "APIService", "DataService", function(e, t, n, r) {
var a = n.getPreferredVersion("services"), o = "service.alpha.openshift.io/dependencies", i = e("annotation"), s = function(e) {
var t = i(e, o);
if (!t) return null;
try {
return JSON.parse(t);
} catch (e) {
return Logger.warn('Could not parse "service.alpha.openshift.io/dependencies" annotation', e), null;
}
}, c = function(e, t) {
t.length ? _.set(e, [ "metadata", "annotations", o ], JSON.stringify(t)) : _.has(e, [ "metadata", "annotations", o ]) && delete e.metadata.annotations[o];
};
return {
getDependentServices: function(e) {
var t, n = s(e);
if (!n) return [];
t = _.get(e, "metadata.namespace");
return _.chain(n).filter(function(e) {
return !(!e.name || e.kind && "Service" !== e.kind || e.namespace && e.namespace !== t);
}).map(function(e) {
return e.name;
}).value();
},
linkService: function(e, t) {
var n = angular.copy(e), o = s(n) || [];
return o.push({
name: t.metadata.name,
namespace: e.metadata.namespace === t.metadata.namespace ? "" : t.metadata.namespace,
kind: t.kind
}), c(n, o), r.update(a, n.metadata.name, n, {
namespace: n.metadata.namespace
});
},
removeServiceLink: function(e, n) {
var o = angular.copy(e), i = s(o) || [], l = _.reject(i, function(t) {
return t.kind === n.kind && (t.namespace || e.metadata.namespace) === n.metadata.namespace && t.name === n.metadata.name;
});
return l.length === i.length ? t.when(!0) : (c(o, l), r.update(a, o.metadata.name, o, {
namespace: o.metadata.namespace
}));
},
isInfrastructure: function(e) {
return "true" === i(e, "service.openshift.io/infrastructure");
}
};
} ]), angular.module("openshiftConsole").factory("ImagesService", [ "$filter", "APIService", "ApplicationGenerator", "DataService", function(e, t, n, r) {
var a = t.getPreferredVersion("imagestreamimports"), o = function(e) {
return _.isArray(e) ? e : _.map(e, function(e, t) {
return {
name: t,
value: e
};
});
};
return {
findImage: function(e, n) {
var o = {
kind: "ImageStreamImport",
apiVersion: t.toAPIVersion(a),
metadata: {
name: "newapp",
namespace: n.namespace
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
return r.create(a, null, o, n).then(function(e) {
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
var t = [], r = {
"openshift.io/generated-by": "OpenShiftWebConsole"
}, a = o(e.env), i = [], s = [], c = 0;
if (_.forEach(e.volumes, function(t, n) {
c++;
var r = e.name + "-" + c;
i.push({
name: r,
emptyDir: {}
}), s.push({
name: r,
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
t.push(l);
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
env: a,
volumeMounts: s
} ],
resources: {}
}
}
},
status: {}
};
t.push(d);
var m;
return _.isEmpty(e.ports) || (m = {
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
return n.getServicePort(e);
})
}
}, t.push(m)), t;
},
getEnvironment: function(e) {
return _.map(_.get(e, "image.dockerImageMetadata.Config.Env"), function(e) {
var t = e.indexOf("="), n = "", r = "";
return t > 0 ? (n = e.substring(0, t), t + 1 < _.size(e) && (r = e.substring(t + 1))) : n = e, {
name: n,
value: r
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
var r = e("annotation"), a = e("displayName"), o = function(e) {
switch (e) {
case "DeploymentConfig":
return "Deployments";

default:
return _.startCase(t.kindToResource(e, !0));
}
}, i = function(e, r, i, s) {
var c, l = [], u = s.humanizedKind || o(r);
return s.includeProject && (c = s.project ? a(s.project) : i, l.push({
title: c,
link: n.projectOverviewURL(i)
})), l.push({
title: u,
link: n.resourceListURL(t.kindToResource(r), i)
}), s.parent && l.push(s.parent), s.subpage ? (l.push({
title: s.displayName || e,
link: n.resourceURL(e, r, i)
}), l.push({
title: s.subpage
})) : l.push({
title: s.displayName || e
}), l;
}, s = function(t, a) {
a = a || {};
var o, s = r(t, "deploymentConfig");
return s && (a.humanizedKind = "Deployments", a.parent = {
title: s,
link: n.configURLForResource(t)
}, (o = e("annotation")(t, "deploymentVersion")) && (a.displayName = "#" + o)), i(t.metadata.name, t.kind, t.metadata.namespace, a);
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
} ]), angular.module("openshiftConsole").factory("QuotaService", [ "$filter", "$location", "$rootScope", "$routeParams", "$q", "APIService", "Constants", "DataService", "EventsService", "Logger", "NotificationsService", function(e, t, n, r, a, o, i, s, c, l, u) {
var d = o.getPreferredVersion("resourcequotas"), m = o.getPreferredVersion("appliedclusterresourcequotas"), p = e("isNil"), f = e("usageValue"), g = e("usageWithUnits"), v = e("percent"), h = function(e) {
return _.every(e.spec.containers, function(e) {
var t = _.some(_.get(e, "resources.requests"), function(e) {
return !p(e) && 0 !== f(e);
}), n = _.some(_.get(e, "resources.limits"), function(e) {
return !p(e) && 0 !== f(e);
});
return !t && !n;
});
}, y = function(e) {
return _.has(e, "spec.activeDeadlineSeconds");
}, b = function(e, t) {
var n = h(e), r = y(e);
return _.filter(t, function(e) {
var t = e.spec.quota ? e.spec.quota.scopes : e.spec.scopes;
return _.every(t, function(e) {
switch (e) {
case "Terminating":
return r;

case "NotTerminating":
return !r;

case "BestEffort":
return n;

case "NotBestEffort":
return !n;
}
return !0;
});
});
}, S = function(e, t) {
return e ? "Pod" === e.kind ? b(e, t) : _.has(e, "spec.template") ? b(e.spec.template, t) : t : t;
}, C = e("humanizeQuotaResource"), w = e("humanizeKind"), P = function(e, t, n) {
var r = e.status.total || e.status;
if (f(r.hard[n]) <= f(r.used[n])) {
var a, o;
return a = "Pod" === t.kind ? "You will not be able to create the " + w(t.kind) + " '" + t.metadata.name + "'." : "You can still create " + w(t.kind) + " '" + t.metadata.name + "' but no pods will be created until resources are freed.", o = "pods" === n ? "You are at your quota for pods." : "You are at your quota for " + C(n) + " on pods.", {
type: "Pod" === t.kind ? "error" : "warning",
message: o,
details: a,
links: [ {
href: "project/" + e.metadata.namespace + "/quota",
label: "View Quota",
target: "_blank"
} ]
};
}
return null;
}, j = {
cpu: "resources.requests.cpu",
"requests.cpu": "resources.requests.cpu",
"limits.cpu": "resources.limits.cpu",
memory: "resources.requests.memory",
"requests.memory": "resources.requests.memory",
"limits.memory": "resources.limits.memory",
persistentvolumeclaims: "resources.limits.persistentvolumeclaims",
"requests.storage": "resources.request.storage"
}, k = function(e, t, n, r) {
var a = e.status.total || e.status, o = j[r], i = 0;
if (_.each(n.spec.containers, function(e) {
var t = _.get(e, o);
t && (i += f(t));
}), f(a.hard[r]) < f(a.used[r]) + i) {
var s;
return s = "Pod" === t.kind ? "You may not be able to create the " + w(t.kind) + " '" + t.metadata.name + "'." : "You can still create " + w(t.kind) + " '" + t.metadata.name + "' but you may not have pods created until resources are freed.", {
type: "warning",
message: "You are close to your quota for " + C(r) + " on pods.",
details: s,
links: [ {
href: "project/" + e.metadata.namespace + "/quota",
label: "View Quota",
target: "_blank"
} ]
};
}
}, I = function(e, t) {
var n = [], r = "Pod" === e.kind ? e : _.get(e, "spec.template");
return r ? (_.each([ "cpu", "memory", "requests.cpu", "requests.memory", "limits.cpu", "limits.memory", "pods" ], function(a) {
var o = t.status.total || t.status;
if (("Pod" !== e.kind || "pods" !== a) && _.has(o, [ "hard", a ]) && _.has(o, [ "used", a ])) {
var i = P(t, e, a);
if (i) n.push(i); else if ("pods" !== a) {
var s = k(t, e, r, a);
s && n.push(s);
}
}
}), n) : n;
}, R = function(e, t, n) {
var r = [];
return e && t ? (_.each(e, function(e) {
var a = S(e, t), i = S(e, n), s = o.objectToResourceGroupVersion(e);
if (s) {
var c = o.kindToResource(e.kind, !0), l = w(e.kind), u = "";
s.group && (u = s.group + "/"), u += s.resource;
var d = function(t) {
var n = t.status.total || t.status;
!p(n.hard[u]) && f(n.hard[u]) <= f(n.used[u]) && r.push({
type: "error",
message: "You are at your quota of " + n.hard[u] + " " + ("1" === n.hard[u] ? l : c) + " in this project.",
details: "You will not be able to create the " + l + " '" + e.metadata.name + "'.",
links: [ {
href: "project/" + t.metadata.namespace + "/quota",
label: "View Quota",
target: "_blank"
} ]
}), r = r.concat(I(e, t));
};
_.each(a, d), _.each(i, d);
}
}), r) : r;
}, T = [ "cpu", "requests.cpu", "memory", "requests.memory", "limits.cpu", "limits.memory" ], E = function(e, t, n, r, a) {
var o, s = "Your project is " + (r < t ? "over" : "at") + " quota. ";
return o = _.includes(T, a) ? s + "It is using " + v(t / r, 0) + " of " + g(n, a) + " " + C(a) + "." : s + "It is using " + t + " of " + r + " " + C(a) + ".", o = _.escape(o), i.QUOTA_NOTIFICATION_MESSAGE && i.QUOTA_NOTIFICATION_MESSAGE[a] && (o += " " + i.QUOTA_NOTIFICATION_MESSAGE[a]), o;
}, N = function(e, t, n) {
var r = function(e) {
var t = e.status.total || e.status;
return _.some(t.hard, function(e, r) {
if ("resourcequotas" === r) return !1;
if (!n || _.includes(n, r)) {
if (!(e = f(e))) return !1;
var a = f(_.get(t, [ "used", r ]));
return !!a && e <= a;
}
});
};
return _.some(e, r) || _.some(t, r);
};
return {
filterQuotasForResource: S,
isBestEffortPod: h,
isTerminatingPod: y,
getResourceLimitAlerts: I,
getQuotaAlerts: R,
getLatestQuotaAlerts: function(e, t) {
var n, r, o = [];
return o.push(s.list(d, t).then(function(e) {
n = e.by("metadata.name"), l.log("quotas", n);
})), o.push(s.list(m, t).then(function(e) {
r = e.by("metadata.name"), l.log("cluster quotas", r);
})), a.all(o).then(function() {
return {
quotaAlerts: R(e, n, r)
};
});
},
isAnyQuotaExceeded: N,
isAnyStorageQuotaExceeded: function(e, t) {
return N(e, t, [ "requests.storage", "persistentvolumeclaims" ]);
},
willRequestExceedQuota: function(e, t, n, r) {
var a = function(e) {
var t = e.status.total || e.status, a = f(r);
if (!n) return !1;
var o = _.get(t.hard, n);
if (!(o = f(o))) return !1;
var i = f(_.get(t, [ "used", n ]));
return i ? o < i + a : o < a;
};
return _.some(e, a) || _.some(t, a);
},
getQuotaNotifications: function(e, a, o) {
var i = [], s = function(e) {
var a = e.status.total || e.status;
_.each(a.hard, function(e, s) {
var c = f(e), l = _.get(a, [ "used", s ]), d = f(l);
"resourcequotas" !== s && c && d && c <= d && i.push({
id: o + "/quota-limit-reached-" + s,
namespace: o,
type: c < d ? "warning" : "info",
message: E(0, d, e, c, s),
isHTML: !0,
skipToast: !0,
showInDrawer: !0,
actions: [ {
name: "View Quotas",
title: "View project quotas",
onClick: function() {
t.url("/project/" + r.project + "/quota"), n.$emit("NotificationDrawerWrapper.hide");
}
}, {
name: "Don't Show Me Again",
title: "Permenantly hide this notificaiton until quota limit changes",
onClick: function(e) {
u.permanentlyHideNotification(e.uid, e.namespace), n.$emit("NotificationDrawerWrapper.clear", e);
}
}, {
name: "Clear",
title: "Clear this notificaiton",
onClick: function(e) {
n.$emit("NotificationDrawerWrapper.clear", e);
}
} ]
});
});
};
return _.each(e, s), _.each(a, s), i;
}
};
} ]), angular.module("openshiftConsole").factory("SecurityCheckService", [ "APIService", "$filter", "Constants", function(e, t, n) {
var r = t("humanizeKind");
return {
getSecurityAlerts: function(t, a) {
var o = [], i = [], s = [], c = [], l = [], u = [];
if (_.each(t, function(t) {
if (_.get(t, "kind")) {
var r = e.objectToResourceGroupVersion(t), a = e.apiInfo(r);
if (a) if (a.namespaced) if ("rolebindings" !== r.resource || "" !== r.group && "rbac.authorization.k8s.io" !== r.group) "roles" !== r.resource || "" !== r.group && "rbac.authorization.k8s.io" !== r.group ? _.find(n.SECURITY_CHECK_WHITELIST, {
resource: r.resource,
group: r.group
}) || u.push(t) : l.push(t); else {
var o = _.get(t, "roleRef.name");
"view" !== o && "system:image-puller" !== o && c.push(t);
} else s.push(t); else i.push(t);
}
}), i.length) {
var d = _.uniq(_.map(i, function(e) {
return "API version " + _.get(e, "apiVersion", "<none>") + " for kind " + r(e.kind);
}));
o.push({
type: "warning",
message: "Some resources will not be created.",
details: "The following resource versions are not supported by the server: " + d.join(", ")
});
}
if (s.length) {
var m = _.uniq(_.map(s, function(e) {
return r(e.kind);
}));
o.push({
type: "warning",
message: "This will create resources outside of the project, which might impact all users of the cluster.",
details: "Typically only cluster administrators can create these resources. The cluster-level resources being created are: " + m.join(", ")
});
}
if (c.length) {
var p = [];
_.each(c, function(e) {
_.each(e.subjects, function(e) {
var t = r(e.kind) + " ";
"ServiceAccount" === e.kind && (t += (e.namespace || a) + "/"), t += e.name, p.push(t);
});
}), p = _.uniq(p), o.push({
type: "warning",
message: "This will grant permissions to your project.",
details: "Permissions are being granted to: " + p.join(", ")
});
}
if (l.length && o.push({
type: "info",
message: "This will create additional membership roles within the project.",
details: "Admins will be able to grant these custom roles to users, groups, and service accounts."
}), u.length) {
var f = _.uniq(_.map(u, function(e) {
return r(e.kind);
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
groupBySelector: function(t, n, r) {
var a = {}, o = {};
return r = r || {}, _.each(n, function(e) {
o[e.metadata.uid] = new LabelSelector(e.spec.selector);
}), _.each(t, function(t) {
if (!r.include || r.include(t)) {
var i = _.filter(n, function(n) {
var a = o[n.metadata.uid];
return r.matchTemplate ? a.matches(e(t)) : r.matchSelector ? a.covers(new LabelSelector(t.spec.selector)) : a.matches(t);
});
i.length || _.set(a, [ "", t.metadata.name ], t), _.each(i, function(e) {
var n = _.get(e, r.key || "metadata.name", "");
_.set(a, [ n, t.metadata.name ], t);
});
}
}), a;
}
};
}), angular.module("openshiftConsole").factory("CatalogService", [ "$filter", "$q", "$window", "APIService", "AuthService", "Catalog", "Constants", "KeywordService", "Logger", "NotificationsService", function(e, t, n, r, a, o, i, s, c, l) {
var u, d = e("tags"), m = r.getPreferredVersion("servicebindings"), p = r.getPreferredVersion("clusterserviceclasses"), f = r.getPreferredVersion("serviceinstances"), g = r.getPreferredVersion("clusterserviceplans"), v = !i.DISABLE_SERVICE_CATALOG_LANDING_PAGE && r.apiInfo(m) && r.apiInfo(p) && r.apiInfo(f) && r.apiInfo(g), h = function() {
c.debug("ProjectsService: clearing catalog items cache"), u = null;
};
a.onUserChanged(h), a.onLogout(h);
var y = {};
_.each(i.CATALOG_CATEGORIES, function(e) {
_.each(e.items, function(e) {
y[e.id] = e;
var t = _.get(e, "subcategories", []);
_.each(t, function(e) {
_.each(e.items, function(e) {
y[e.id] = e;
});
});
});
});
var b = function(e, t) {
e = e.toLowerCase();
var n;
for (n = 0; n < t.length; n++) if (e === t[n].toLowerCase()) return !0;
return !1;
}, S = function(e, t) {
var n = _.get(e, "categoryAliases", []), r = [ e.id ].concat(n);
return _.some(r, function(e) {
return b(e, t);
});
}, C = function(e) {
return e.from && "ImageStreamTag" === e.from.kind && -1 === e.from.name.indexOf(":") && !e.from.namespace;
}, w = e("displayName"), P = [ "metadata.name", 'metadata.annotations["openshift.io/display-name"]', "metadata.annotations.description" ];
return {
SERVICE_CATALOG_ENABLED: v,
getCatalogItems: function(e) {
return u && !e ? (c.debug("CatalogService: returning cached catalog items"), t.when(u)) : (c.debug("CatalogService: getCatalogItems, force refresh", e), o.getCatalogItems(!0).then(_.spread(function(e, t) {
if (t) {
var n = {
type: "error",
message: t
};
l.addNotification(n);
}
return u = e, e;
})));
},
getCategoryItem: function(e) {
return y[e];
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
var r = !1;
_.each(y, function(a) {
(function(e) {
return _.some(e.status.tags, function(e) {
var t = n[e.tag] || [];
return S(a, t) && b("builder", t) && !b("hidden", t);
});
})(e) && (t[a.id] = t[a.id] || [], t[a.id].push(e), r = !0);
}), r || _.some(e.status.tags, function(e) {
var t = n[e.tag] || [];
return b("builder", t) && !b("hidden", t);
}) && (t[""] = t[""] || [], t[""].push(e));
}
}), t;
},
categorizeTemplates: function(e) {
var t = {};
return _.each(e, function(e) {
var n = d(e), r = !1;
_.each(y, function(a) {
S(a, n) && (t[a.id] = t[a.id] || [], t[a.id].push(e), r = !0);
}), r || (t[""] = t[""] || [], t[""].push(e));
}), t;
},
referencesSameImageStream: C,
filterImageStreams: function(e, t) {
if (!t.length) return e;
var n = [];
return _.each(e, function(e) {
var r = _.get(e, "metadata.name", ""), a = w(e, !0), o = [], i = {}, s = {};
_.each(e.spec.tags, function(e) {
if (C(e)) return i[e.name] = e.from.name, s[e.from.name] = s[e.from.name] || [], void s[e.from.name].push(e.name);
o.push(e);
});
var c = _.keyBy(o, "name");
_.each(t, function(e) {
e.test(r) || a && e.test(a) || _.each(o, function(t) {
var n = _.get(t, "annotations.tags", "");
if (/\bbuilder\b/.test(n) && !/\bhidden\b/.test(n)) {
if (!e.test(t.name) && !_.some(s[t.name], function(t) {
return e.test(t);
})) {
var r = _.get(t, "annotations.description");
r && e.test(r) || delete c[t.name];
}
} else delete c[t.name];
});
});
var l;
_.isEmpty(c) || ((l = angular.copy(e)).status.tags = _.filter(l.status.tags, function(e) {
var t = i[e.tag];
return t ? c[t] : c[e.tag];
}), n.push(l));
}), n;
},
filterTemplates: function(e, t) {
return s.filterForKeywords(e, P, t);
}
};
} ]), angular.module("openshiftConsole").factory("ModalsService", [ "$uibModal", function(e) {
return {
confirm: function(t) {
return e.open({
templateUrl: "views/modals/confirm.html",
controller: "ConfirmModalController",
resolve: {
modalConfig: t
}
}).result;
},
confirmSaveLog: function(t) {
return e.open({
templateUrl: "views/modals/confirm-save-log.html",
controller: "ConfirmSaveLogController",
resolve: {
object: t
}
}).result;
},
showJenkinsfileExamples: function() {
e.open({
templateUrl: "views/modals/jenkinsfile-examples-modal.html",
controller: "JenkinsfileExamplesModalController",
size: "lg"
});
},
showComputeUnitsHelp: function() {
e.open({
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
var r, a, o;
switch (e.kind) {
case "Pod":
r = "oc logs " + e.metadata.name, n && (r += " -c " + n);
break;

case "DeploymentConfig":
r = "oc logs dc/" + e.metadata.name;
break;

case "ReplicationController":
a = t(e, "deploymentConfig"), o = t(e, "deploymentVersion"), r = a && o ? "oc logs --version " + o + " dc/" + a : "oc logs rc/" + e.metadata.name;
break;

case "BuildConfig":
r = "oc logs bc/" + e.metadata.name;
break;

case "Build":
a = t(e, "buildConfig"), r = "oc logs --version " + (o = t(e, "buildNumber")) + " bc/" + a;
break;

default:
return null;
}
return r += " -n " + e.metadata.namespace;
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
e.env = e.env || [], e.envFrom = e.envFrom || [];
});
},
compact: function(e) {
var r = n(e);
_.each(r, function(e) {
e.env = t.compactEntries(e.env), e.envFrom = _.reject(e.envFrom, function(e) {
return !_.get(e, "configMapRef.name") && !_.get(e, "secretRef.name");
});
});
},
copyAndNormalize: function(e) {
var t = angular.copy(e);
return this.normalize(t), t;
},
isEnvironmentEqual: function(e, t) {
var r = n(e), a = n(t);
if (r.length !== a.length) return !1;
var o, i, s, c, l;
for (o = 0; o < r.length; o++) {
if (r[o].name !== a[o].name) return !1;
if (i = r[o].env || [], s = a[o].env || [], c = r[o].envFrom || [], l = a[o].envFrom || [], !_.isEqual(i, s) || !_.isEqual(c, l)) return !1;
}
return !0;
},
mergeEdits: function(e, t) {
var r, a = angular.copy(t), o = n(e), i = n(a);
for (r = 0; r < i.length; r++) i[r].env = _.get(o, [ r, "env" ], []), i[r].envFrom = _.get(o, [ r, "envFrom" ], []);
return a;
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
}, r = [ "apiObj", "cannotDelete", "isReadonly", "isReadonlyKey", "isReadonlyValue", "keyValidator", "keyValidatorError", "keyValidatorErrorTooltip", "keyValidatorErrorTooltipIcon", "refType", "selected", "selectedValueFrom", "selectedValueFromKey", "valueValidatorError", "valueIcon", "valueIconTooltip", "valueAlt", "valueValidator", "valueValidatorErrorTooltip", "valueValidatorErrorTooltipIcon" ], a = function(e) {
return _.each(r, function(t) {
e[t] = void 0, delete e[t];
}), e;
}, o = function(e) {
return _.compact(_.map(e, function(e) {
return (e = a(e)).name || e.value || e.valueFrom ? e : void 0;
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
cleanEntry: a,
cleanEntries: function(e) {
return _.map(e, a);
},
compactEntries: o,
mapEntries: function(e) {
return Logger.log("DEPRECATED: mapEntries() drops valueFrom from the entry."), _.reduce(o(e), function(e, t) {
return e[t.name] = t.value, e;
}, {});
},
setFocusOn: function(n, r) {
e(function() {
var e = _.head(t.document.querySelectorAll(n));
e && (e.focus(), r && (e.value = "", e.value = r));
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
var r = _.groupBy(t, e);
return n && _.mapValues(r, function(e) {
return _.sortBy(e, n);
}), r;
},
sortAppNames: function(e) {
e.sort(t);
}
};
}), angular.module("openshiftConsole").factory("ResourceAlertsService", [ "$filter", "AlertMessageService", "DeploymentsService", "Navigate", "NotificationsService", "QuotaService", function(e, t, n, r, a, o) {
var i = e("annotation"), s = e("humanizeKind"), c = e("deploymentStatus"), l = e("groupedPodWarnings"), u = function(e, t, n, r) {
e[t + "-" + n.reason] = {
type: r,
message: n.message
};
};
return {
getPodAlerts: function(e, n) {
if (_.isEmpty(e)) return {};
var a = {}, o = l(e);
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
var l = r.resourceURL(i.pod, "Pod", n), u = URI(l).addSearch({
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
a[s] = c;
}
}), a;
},
getDeploymentStatusAlerts: function(e, t) {
if (!e || !t) return {};
var n, a = {}, o = _.get(e, "metadata.name"), s = c(t), l = i(t, "deploymentVersion"), u = l ? o + " #" + l : t.metadata.name, d = r.resourceURL(t);
switch (s) {
case "Cancelled":
a[t.metadata.uid + "-cancelled"] = {
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
}).toString(), a[t.metadata.uid + "-failed"] = {
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
return a;
},
getPausedDeploymentAlerts: function(t) {
var r = {};
return _.get(t, "spec.paused") && (r[t.metadata.uid + "-paused"] = {
type: "info",
message: t.metadata.name + " is paused.",
details: "This will stop any new rollouts or triggers from running until resumed.",
links: [ {
href: "",
label: "Resume Rollouts",
onClick: function() {
return n.setPaused(t, !1, {
namespace: t.metadata.namespace
}).then(_.noop, function(n) {
r[t.metadata.uid + "-pause-error"] = {
type: "error",
message: "An error occurred resuming the " + s(t.kind) + ".",
details: e("getErrorDetails")(n)
};
}), !0;
}
} ]
}), r;
},
getServiceInstanceAlerts: function(e) {
var t = {};
if (!e) return t;
var n = e.metadata.uid, r = _.find(e.status.conditions, {
reason: "ErrorFindingNamespaceForInstance"
}), a = _.find(e.status.conditions, {
reason: "ProvisionFailed"
}), o = _.find(e.status.conditions, {
reason: "DeprovisioningFailed"
});
return r && u(t, n, r, "warning"), a && u(t, n, a, "error"), o && u(t, n, o, "error"), t;
},
setQuotaNotifications: function(e, t, n) {
var r = o.getQuotaNotifications(e, t, n);
_.each(r, function(e) {
a.isNotificationPermanentlyHidden(e) || a.addNotification(e);
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
var r = sessionStorage.getItem(n);
r || !t.state.expandAll ? t.expanded = "true" === r : t.expanded = !0;
} else t.expanded = !1;
};
return {
getNotifications: function(e, t) {
var n = _.get(e, "metadata.uid");
return n ? _.get(t, [ "notificationsByObjectUID", n ]) : null;
},
ui: {
toggleExpand: function(t, n) {
if (n || !($(t.target).closest("a").length > 0 || $(t.target).closest("button").length > 0)) {
var r = e(this.apiObject);
r && (this.expanded = !this.expanded, sessionStorage.setItem(r, this.expanded ? "true" : "false"));
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
var r = !1;
_.each(e(t), function(e) {
e.controller && (r = !0, n[e.uid] = n[e.uid] || [], n[e.uid].push(t));
}), r || (n[""] = n[""] || [], n[""].push(t));
}), n;
},
filterForController: function(t, n) {
var r = _.get(n, "metadata.uid");
return _.filter(t, function(t) {
return _.some(e(t), {
uid: r,
controller: !0
});
});
}
};
}), angular.module("openshiftConsole").factory("ServiceInstancesService", [ "$filter", "$q", "$uibModal", "APIService", "BindingService", "CatalogService", "DataService", "Logger", "NotificationsService", function(e, t, n, r, a, o, i, s, c) {
var l = r.getPreferredVersion("clusterserviceclasses"), u = r.getPreferredVersion("clusterserviceplans"), d = function(e) {
return _.get(e, "spec.clusterServiceClassRef.name");
}, m = function(e) {
return _.get(e, "spec.clusterServicePlanRef.name");
}, p = function(e, n) {
if (angular.isDefined(n)) return t.when(n);
var o = {
namespace: e.metadata.namespace
}, s = r.getPreferredVersion("servicebindings");
return i.list(s, o).then(function(t) {
return n = t.by("metadata.name"), a.getBindingsForResource(n, e);
});
}, f = function(t) {
var n = {
namespace: t.metadata.namespace
}, a = r.getPreferredVersion("serviceinstances");
c.hideNotification("deprovision-service-error");
var o = {
propagationPolicy: null
};
return i.delete(a, t.metadata.name, n, o).then(function() {
c.addNotification({
type: "success",
message: "Provisioned service '" + t.metadata.name + "' was marked for deletion."
});
}, function(n) {
c.addNotification({
id: "deprovision-service-error",
type: "error",
message: "An error occurred while deleting provisioned service " + t.metadata.name + ".",
details: e("getErrorDetails")(n)
}), s("An error occurred while deleting provisioned service " + t.metadata.name + ".", n);
});
}, g = function(t, n) {
if (o.SERVICE_CATALOG_ENABLED) {
var a = {
namespace: t.metadata.namespace
}, l = r.getPreferredVersion("servicebindings");
p(t, n).then(function(t) {
_.each(t, function(t) {
if (!t.metadata.deletionTimestamp) {
var n = {
propagationPolicy: null
};
i.delete(l, t.metadata.name, a, n).then(function() {
c.addNotification({
type: "success",
message: "Binding " + t.metadata.name + "' was marked for deletion."
});
}).catch(function(n) {
c.addNotification({
type: "error",
message: "Binding " + t.metadata.name + "' could not be deleted.",
details: e("getErrorDetails")(n)
}), s.error("Binding " + t.metadata.name + "' could not be deleted.", n);
});
}
});
});
}
};
return {
getServiceClassNameForInstance: d,
fetchServiceClassForInstance: function(e) {
var t = d(e);
return i.get(l, t, {});
},
getServicePlanNameForInstance: m,
fetchServicePlanForInstance: function(e) {
var t = m(e);
return i.get(u, t, {});
},
isCurrentPlan: function(e, t) {
return m(e) === _.get(t, "metadata.name");
},
deprovision: function(e, t) {
var r, a = {
kind: e.kind,
displayName: e.metadata.name,
okButtonText: "Delete",
okButtonClass: "btn-danger",
cancelButtonText: "Cancel",
delete: function() {
r.close("delete");
}
};
return (r = n.open({
templateUrl: "views/modals/delete-resource.html",
controller: "ConfirmModalController",
resolve: {
modalConfig: function() {
return a;
}
}
})).result.then(function() {
g(e, t), f(e);
});
}
};
} ]), angular.module("openshiftConsole").controller("LandingPageController", [ "$scope", "$rootScope", "AuthService", "CatalogService", "Constants", "DataService", "Navigate", "NotificationsService", "RecentlyViewedServiceItems", "GuidedTourService", "HTMLService", "$timeout", "$q", "$routeParams", "$location", function(e, t, n, r, a, o, i, s, c, l, u, d, m, p, f) {
function g() {
var t = f.search();
return t.serviceExternalName ? _.find(e.catalogItems, {
resource: {
spec: {
externalName: t.serviceExternalName
}
}
}) : null;
}
function v() {
var n = g();
if (n) e.$broadcast("open-overlay-panel", n); else if (y) if (p.startTour) d(function() {
f.replace(), f.search("startTour", null), e.startGuidedTour();
}, 500); else if (_.get(h, "auto_launch")) {
var r = "openshift/viewedHomePage/" + t.user.metadata.name;
"true" !== localStorage.getItem(r) && d(function() {
e.startGuidedTour() && localStorage.setItem(r, "true");
}, 500);
}
}
var h = _.get(a, "GUIDED_TOURS.landing_page_tour"), y = h && h.enabled && h.steps;
e.saasOfferings = a.SAAS_OFFERINGS, e.viewMembership = function(e) {
i.toProjectMembership(e.metadata.name);
}, y && (e.startGuidedTour = function() {
return !u.isWindowBelowBreakpoint(u.WINDOW_SIZE_SM) && (l.startTour(h.steps), !0);
}), s.clearNotifications();
var b = function() {
var t = _.get(e, "template.metadata.uid");
t && c.addItem(t);
}, S = function(e) {
return "PartialObjectMetadata" === e.kind;
}, C = function(e) {
return S(e) ? o.get("templates", e.metadata.name, {
namespace: e.metadata.namespace
}) : m.when(e);
};
e.templateSelected = function(t) {
C(t).then(function(t) {
_.set(e, "ordering.panelName", "template"), e.template = t;
});
}, e.closeOrderingPanel = function() {
e.template && (b(), e.template = null), _.set(e, "ordering.panelName", "");
}, e.deployImageSelected = function() {
_.set(e, "ordering.panelName", "deployImage");
}, e.fromFileSelected = function() {
_.set(e, "ordering.panelName", "fromFile");
}, e.fromProjectSelected = function() {
_.set(e, "ordering.panelName", "fromProject");
}, n.withUser().then(function() {
r.getCatalogItems().then(function(t) {
e.catalogItems = t, v();
});
}), e.$on("$destroy", function() {
b();
}), y && e.$on("$locationChangeStart", function(t) {
f.search().startTour && (e.startGuidedTour(), t.preventDefault());
});
} ]), angular.module("openshiftConsole").controller("ProjectBrowseCatalogController", [ "$scope", "$q", "$routeParams", "DataService", "AuthorizationService", "Catalog", "CatalogService", "Navigate", "NotificationsService", "ProjectsService", function(e, t, n, r, a, o, i, s, c, l) {
var u = n.project;
l.get(u).then(function() {
a.getProjectRules(u).then(function() {
if (a.canIAddToProject(u)) {
var r, l, d = i.getCatalogItems().then(function(e) {
r = e;
}), m = o.getProjectCatalogItems(u).then(_.spread(function(e, t) {
l = e, t && c.addNotification({
type: "error",
message: t
});
}));
t.all([ d, m ]).then(function() {
e.catalogItems = o.sortCatalogItems(_.concat(r, l)), n.filter && (e.keywordFilter = n.filter);
});
} else s.toProjectOverview(u);
});
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
} ]), angular.module("openshiftConsole").controller("ProjectsController", [ "$scope", "$filter", "$location", "$route", "$timeout", "AuthService", "DataService", "KeywordService", "Navigate", "Logger", "ProjectsService", function(e, t, n, r, a, o, i, s, c, l, u) {
var d, m, p = [], f = [], g = !1;
e.alerts = e.alerts || {}, e.loading = !0, e.showGetStarted = !1, e.canCreate = void 0, e.search = {
text: ""
}, e.limitListTo = 250;
var v, h = [ "metadata.name", 'metadata.annotations["openshift.io/display-name"]', 'metadata.annotations["openshift.io/description"]', 'metadata.annotations["openshift.io/requester"]' ], y = function() {
e.projects = s.filterForKeywords(m, h, f);
}, b = t("displayName"), S = function() {
var t = _.get(e, "sortConfig.currentField.id");
v !== t && (e.sortConfig.isAscending = "metadata.creationTimestamp" !== t);
var n = function(e) {
return b(e).toLowerCase();
}, r = e.sortConfig.isAscending ? "asc" : "desc";
switch (t) {
case 'metadata.annotations["openshift.io/display-name"]':
m = _.orderBy(d, [ n, "metadata.name" ], [ r ]);
break;

case 'metadata.annotations["openshift.io/requester"]':
m = _.orderBy(d, [ t, n ], [ r, "asc" ]);
break;

default:
m = _.orderBy(d, [ t ], [ r ]);
}
v = t;
}, C = function() {
S(), y();
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
onSortChange: C
};
var w = function(t) {
d = _.toArray(t.by("metadata.name")), e.loading = !1, e.showGetStarted = _.isEmpty(d) && !e.isProjectListIncomplete, C();
}, P = function() {
g || u.list().then(w);
};
e.newProjectPanelShown = !1, e.createProject = function(t) {
for (var n = _.get(t, "target"); n && !angular.element(n).hasClass("btn"); ) n = n.parentElement;
e.popupElement = n, e.newProjectPanelShown = !0;
}, e.closeNewProjectPanel = function() {
e.newProjectPanelShown = !1;
}, e.onNewProject = function() {
e.newProjectPanelShown = !1, P();
}, e.editProjectPanelShown = !1, e.editProject = function(t) {
e.editingProject = t, e.editProjectPanelShown = !0;
}, e.closeEditProjectPanel = function() {
e.editProjectPanelShown = !1;
}, e.onEditProject = function() {
e.editProjectPanelShown = !1, P();
}, e.onDeleteProject = P, e.goToProject = function(e) {
c.toProjectOverview(e);
}, e.$watch("search.text", _.debounce(function(t) {
e.keywords = f = s.generateKeywords(t), e.$applyAsync(y);
}, 350)), o.withUser().then(function() {
u.list().then(function(t) {
e.isProjectListIncomplete = u.isProjectListIncomplete(), w(t), !e.isProjectListIncomplete && _.size(d) <= 250 && (p.push(u.watch(e, w)), g = !0);
}, function() {
e.isProjectListIncomplete = !0, e.loading = !1, d = [], C();
});
}), u.canCreate().then(function() {
e.canCreate = !0;
}, function(t) {
e.canCreate = !1;
var n = t.data || {};
if (403 !== t.status) {
var r = "Failed to determine create project permission";
return 0 !== t.status && (r += " (" + t.status + ")"), void l.warn(r);
}
if (n.details) {
var a = [];
_.forEach(n.details.causes || [], function(e) {
e.message && a.push(e.message);
}), _.isEmpty(a) || (e.newProjectMessage = a.join("\n"));
}
}), e.$on("$destroy", function() {
i.unwatchAll(p);
});
} ]), angular.module("openshiftConsole").controller("PodsController", [ "$filter", "$routeParams", "$scope", "APIService", "DataService", "ProjectsService", "LabelFilter", "Logger", function(e, t, n, r, a, o, i, s) {
n.projectName = t.project, n.pods = {}, n.unfilteredPods = {}, n.labelSuggestions = {}, n.clearFilter = function() {
i.clear();
};
var c = r.getPreferredVersion("pods"), l = [];
o.get(t.project).then(_.spread(function(e, t) {
function r() {
n.filterWithZeroResults = !i.getLabelSelector().isEmpty() && _.isEmpty(n.pods) && !_.isEmpty(n.unfilteredPods);
}
n.project = e, l.push(a.watch(c, t, function(e) {
n.podsLoaded = !0, n.unfilteredPods = e.by("metadata.name"), n.pods = i.getLabelSelector().select(n.unfilteredPods), i.addLabelSuggestionsFromResources(n.unfilteredPods, n.labelSuggestions), i.setLabelSuggestions(n.labelSuggestions), r(), s.log("pods (subscribe)", n.unfilteredPods);
})), i.onActiveFiltersChanged(function(e) {
n.$evalAsync(function() {
n.pods = e.select(n.unfilteredPods), r();
});
}), n.$on("$destroy", function() {
a.unwatchAll(l);
});
}));
} ]), angular.module("openshiftConsole").controller("PodController", [ "$filter", "$routeParams", "$scope", "$timeout", "$uibModal", "APIService", "DataService", "FullscreenService", "ImageStreamResolver", "Logger", "MetricsService", "OwnerReferencesService", "PodsService", "ProjectsService", function(e, t, n, r, a, o, i, s, c, l, u, d, m, p) {
n.projectName = t.project, n.pod = null, n.imageStreams = {}, n.imagesByDockerReference = {}, n.imageStreamImageRefByDockerReference = {}, n.builds = {}, n.alerts = {}, n.terminalDisconnectAlert = {}, n.renderOptions = n.renderOptions || {}, n.renderOptions.hideFilterWidget = !0, n.logOptions = {}, n.terminalTabWasSelected = !1, n.breadcrumbs = [ {
title: "Pods",
link: "project/" + t.project + "/browse/pods"
}, {
title: t.pod
} ], n.terminalDisconnectAlert.disconnect = {
type: "warning",
message: "This terminal has been disconnected. If you reconnect, your terminal history will be lost."
}, n.noContainersYet = !0, n.selectedTab = {};
var f = o.getPreferredVersion("imagestreams"), g = o.getPreferredVersion("builds");
n.podsVersion = o.getPreferredVersion("pods"), n.podsLogVersion = o.getPreferredVersion("pods/log"), n.eventsVersion = o.getPreferredVersion("events"), n.deploymentConfigsVersion = o.getPreferredVersion("deploymentconfigs");
var v = [], h = null;
u.isAvailable().then(function(e) {
n.metricsAvailable = e;
});
var y = function() {
if (n.pod) {
var e = _.find(n.pod.status.containerStatuses, {
name: n.logOptions.container
}), t = _.get(e, "state"), r = _.head(_.keys(t)), a = _.includes([ "running", "waiting", "terminated" ], r) ? r : "", o = _.get(e, "lastState"), i = _.head(_.keys(o)), s = _.get(e, "state.waiting");
angular.extend(n, {
containerStatusKey: a,
containerStateReason: _.get(t, [ r, "reason" ])
}), s ? angular.extend(n, {
lasStatusKey: i,
containerStartTime: _.get(o, [ i, "startedAt" ]),
containerEndTime: _.get(o, [ i, "finishedAt" ])
}) : angular.extend(n, {
containerStartTime: _.get(t, [ r, "startedAt" ]),
containerEndTime: _.get(t, [ r, "finishedAt" ])
});
}
}, b = function() {
var e = $("<span>").css({
position: "absolute",
top: "-100px"
}).addClass("terminal-font").text(_.repeat("x", 10)).appendTo("body"), t = {
width: e.width() / 10,
height: e.height()
};
return e.remove(), t;
}(), S = $(window), C = function(e) {
e || (e = 0), b.height && b.width && n.selectedTab.terminal && !(e > 10) && n.$apply(function() {
var t = $(".container-terminal-wrapper").get(0);
if (t) {
var a = t.getBoundingClientRect();
if (0 !== a.left || 0 !== a.top || 0 !== a.width || 0 !== a.height) {
var o = S.width(), i = S.height(), s = o - a.left - 54, c = i - a.top - 36;
n.terminalCols = Math.max(_.floor(s / b.width), 80), n.terminalRows = Math.max(_.floor(c / b.height), 24);
} else r(function() {
C(e + 1);
}, 50);
} else r(function() {
C(e + 1);
}, 50);
});
};
n.$watch("selectedTab.terminal", function(e) {
e ? (b.height && b.width ? $(window).on("resize.terminalsize", _.debounce(C, 100)) : l.warn("Unable to calculate the bounding box for a character.  Terminal will not be able to resize."), r(C, 0)) : $(window).off("resize.terminalsize");
}), n.onTerminalSelectChange = function(e) {
_.each(n.containerTerminals, function(e) {
e.isVisible = !1;
}), e.isVisible = !0, e.isUsed = !0, n.selectedTerminalContainer = e;
};
var w = function(e) {
var t = _.get(e, "state", {});
return _.head(_.keys(t));
}, P = function() {
var e = [];
_.each(n.pod.spec.containers, function(t) {
var r = _.find(n.pod.status.containerStatuses, {
name: t.name
}), a = w(r);
e.push({
containerName: t.name,
isVisible: !1,
isUsed: !1,
containerState: a
});
});
var t = _.head(e);
return t.isVisible = !0, t.isUsed = !0, n.selectedTerminalContainer = t, e;
}, j = function(e) {
n.noContainersYet && (n.noContainersYet = 0 === n.containersRunning(e.status.containerStatuses));
}, k = function(e) {
_.each(e, function(e) {
var t = _.find(n.pod.status.containerStatuses, {
name: e.containerName
}), r = w(t);
e.containerState = r;
});
}, I = e("annotation"), R = function(e, t) {
if (n.loaded = !0, n.pod = e, n.dcName = I(e, "deploymentConfig"), n.rcName = I(e, "deployment"), n.deploymentVersion = I(e, "deploymentVersion"), n.logCanRun = !_.includes([ "New", "Pending", "Unknown" ], e.status.phase), y(), delete n.controllerRef, !n.dcName) {
var r = d.getControllerReferences(e);
n.controllerRef = _.find(r, function(e) {
return "ReplicationController" === e.kind || "ReplicaSet" === e.kind || "Build" === e.kind;
});
}
"DELETED" === t && (n.alerts.deleted = {
type: "warning",
message: "This pod has been deleted."
});
};
p.get(t.project).then(_.spread(function(r, o) {
h = o, n.project = r, n.projectContext = o, i.get(n.podsVersion, t.pod, o, {
errorNotification: !1
}).then(function(e) {
R(e);
var r = {};
r[e.metadata.name] = e, n.logOptions.container = t.container || e.spec.containers[0].name, n.containerTerminals = P(), j(e), c.fetchReferencedImageStreamImages(r, n.imagesByDockerReference, n.imageStreamImageRefByDockerReference, h), v.push(i.watchObject(n.podsVersion, t.pod, o, function(e, t) {
R(e, t), k(n.containerTerminals), j(e);
}));
}, function(t) {
n.loaded = !0, n.alerts.load = {
type: "error",
message: "The pod details could not be loaded.",
details: e("getErrorDetails")(t)
};
}), n.$watch("logOptions.container", y), v.push(i.watch(f, o, function(e) {
n.imageStreams = e.by("metadata.name"), c.buildDockerRefMapForImageStreams(n.imageStreams, n.imageStreamImageRefByDockerReference), c.fetchReferencedImageStreamImages(n.pods, n.imagesByDockerReference, n.imageStreamImageRefByDockerReference, o), l.log("imagestreams (subscribe)", n.imageStreams);
})), v.push(i.watch(g, o, function(e) {
n.builds = e.by("metadata.name"), l.log("builds (subscribe)", n.builds);
}));
var u, d = function() {
var t = n.debugPod;
u && (i.unwatch(u), u = null), $(window).off("beforeunload.debugPod"), t && (i.delete(n.podsVersion, t.metadata.name, o, {
gracePeriodSeconds: 0
}).then(_.noop, function(r) {
n.alerts["debug-container-error"] = {
type: "error",
message: "Could not delete pod " + t.metadata.name,
details: e("getErrorDetails")(r)
};
}), n.debugPod = null);
}, p = function() {
$(".terminal:visible").focus();
};
n.hasFullscreen = s.hasFullscreen(!0), n.fullscreenTerminal = function() {
s.requestFullscreen("#container-terminal-wrapper"), setTimeout(p);
}, n.exitFullscreen = function() {
s.exitFullscreen();
}, n.debugTerminal = function(t) {
var r = m.generateDebugPod(n.pod, t);
r ? i.create(n.podsVersion, null, r, o).then(function(e) {
var s = _.find(n.pod.spec.containers, {
name: t
});
n.debugPod = e, $(window).on("beforeunload.debugPod", function() {
return "Are you sure you want to leave with the debug terminal open? The debug pod will not be deleted unless you close the dialog.";
}), u = i.watchObject(n.podsVersion, r.metadata.name, o, function(e) {
n.debugPod = e;
}), a.open({
templateUrl: "views/modals/debug-terminal.html",
controller: "DebugTerminalModalController",
scope: n,
resolve: {
container: function() {
return s;
},
image: function() {
return _.get(n, [ "imagesByDockerReference", s.image ]);
}
}
}).result.then(d);
}, function(r) {
n.alerts["debug-container-error"] = {
type: "error",
message: "Could not debug container " + t,
details: e("getErrorDetails")(r)
};
}) : n.alerts["debug-container-error"] = {
type: "error",
message: "Could not debug container " + t
};
}, n.containersRunning = function(e) {
var t = 0;
return e && e.forEach(function(e) {
e.state && e.state.running && t++;
}), t;
}, n.$on("$destroy", function() {
i.unwatchAll(v), d(), $(window).off("resize.terminalsize");
});
}));
} ]), angular.module("openshiftConsole").controller("OverviewController", [ "$scope", "$filter", "$q", "$location", "$routeParams", "AlertMessageService", "APIService", "AppsService", "BindingService", "BuildsService", "CatalogService", "Constants", "DataService", "DeploymentsService", "HomePagePreferenceService", "HPAService", "HTMLService", "ImageStreamResolver", "KeywordService", "LabelFilter", "Logger", "MetricsService", "Navigate", "OwnerReferencesService", "PodsService", "ProjectsService", "PromiseUtils", "ResourceAlertsService", "RoutesService", "ServiceInstancesService", OverviewController ]), angular.module("openshiftConsole").controller("QuotaController", [ "$filter", "$routeParams", "$scope", "APIService", "DataService", "Logger", "ProjectsService", function(e, t, n, r, a, o, i) {
n.projectName = t.project, n.limitRanges = {}, n.limitsByType = {}, n.labelSuggestions = {}, n.alerts = n.alerts || {}, n.quotaHelp = "Limits resource usage within this project.", n.emptyMessageLimitRanges = "Loading...", n.limitRangeHelp = "Defines minimum and maximum constraints for runtime resources such as memory and CPU.", n.renderOptions = n.renderOptions || {}, n.renderOptions.hideFilterWidget = !0;
var s = r.getPreferredVersion("appliedclusterresourcequotas"), c = r.getPreferredVersion("resourcequotas"), l = r.getPreferredVersion("limitranges"), u = [], d = e("usageValue");
n.isAtLimit = function(e, t) {
var n = e.status.total || e.status, r = d(_.get(n, [ "hard", t ]));
if (!r) return !1;
var a = d(_.get(n, [ "used", t ]));
return !!a && a >= r;
};
var m = e("humanizeQuotaResource"), p = function(e, t) {
return "cpu" === e || "requests.cpu" === e ? "cpu" === t || "requests.cpu" === t ? 0 : -1 : "cpu" === t || "requests.cpu" === t ? 1 : "memory" === e || "requests.memory" === e ? "memory" === t || "requests.memory" === t ? 0 : -1 : "memory" === t || "requests.memory" === t ? 1 : "limits.cpu" === e ? "limits.cpu" === t ? 0 : -1 : "limits.cpu" === t ? 1 : "limits.memory" === e ? "limits.memory" === t ? 0 : -1 : "limits.memory" === t ? 1 : (e = m(e), t = m(t), e.localeCompare(t));
}, f = function(e) {
var t = {};
return _.each(e, function(e) {
var n = _.get(e, "spec.quota.hard") || _.get(e, "spec.hard"), r = _.keys(n).sort(p);
t[e.metadata.name] = r;
}), t;
};
i.get(t.project).then(_.spread(function(e, r) {
n.project = e, u.push(a.watch(c, r, function(e) {
n.quotas = _.sortBy(e.by("metadata.name"), "metadata.name"), n.orderedTypesByQuota = f(n.quotas), o.log("quotas", n.quotas);
}, {
poll: !0,
pollInterval: 6e4
})), u.push(a.watch(s, r, function(e) {
n.clusterQuotas = _.sortBy(e.by("metadata.name"), "metadata.name"), n.orderedTypesByClusterQuota = f(n.clusterQuotas), n.namespaceUsageByClusterQuota = {}, _.each(n.clusterQuotas, function(e) {
if (e.status) {
var r = _.find(e.status.namespaces, {
namespace: t.project
});
n.namespaceUsageByClusterQuota[e.metadata.name] = r.status;
}
}), o.log("cluster quotas", n.clusterQuotas);
}, {
poll: !0,
pollInterval: 6e4
})), u.push(a.watch(l, r, function(e) {
n.limitRanges = _.sortBy(e.by("metadata.name"), "metadata.name"), n.emptyMessageLimitRanges = "There are no limit ranges set on this project.", angular.forEach(n.limitRanges, function(e) {
var t = e.metadata.name;
n.limitsByType[t] = {}, angular.forEach(e.spec.limits, function(e) {
var r = n.limitsByType[t][e.type] = {};
angular.forEach(e.max, function(e, t) {
r[t] = r[t] || {}, r[t].max = e;
}), angular.forEach(e.min, function(e, t) {
r[t] = r[t] || {}, r[t].min = e;
}), angular.forEach(e.default, function(e, t) {
r[t] = r[t] || {}, r[t].default = e;
}), angular.forEach(e.defaultRequest, function(e, t) {
r[t] = r[t] || {}, r[t].defaultRequest = e;
}), angular.forEach(e.maxLimitRequestRatio, function(e, t) {
r[t] = r[t] || {}, r[t].maxLimitRequestRatio = e;
});
});
}), o.log("limitRanges", n.limitRanges);
}, {
poll: !0,
pollInterval: 6e4
})), n.$on("$destroy", function() {
a.unwatchAll(u);
});
}));
} ]), angular.module("openshiftConsole").controller("MonitoringController", [ "$routeParams", "$location", "$scope", "$filter", "BuildsService", "DataService", "ImageStreamResolver", "KeywordService", "Logger", "MetricsService", "Navigate", "PodsService", "ProjectsService", "$rootScope", function(e, t, n, r, a, o, i, s, c, l, u, d, m, p) {
n.projectName = e.project, n.alerts = n.alerts || {}, n.renderOptions = n.renderOptions || {}, n.renderOptions.showEventsSidebar = !0, n.renderOptions.collapseEventsSidebar = "true" === localStorage.getItem("monitoring.eventsidebar.collapsed");
var f = r("isIE")(), g = [];
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
var v = r("isNil");
n.filters = {
hideOlderResources: v(e.hideOlderResources) || "true" === e.hideOlderResources,
text: ""
};
var h, y, b, S;
l.isAvailable().then(function(e) {
n.metricsAvailable = e;
});
var C = r("orderObjectsByDate"), w = [ "metadata.name" ], P = [], j = function() {
n.filteredPods = s.filterForKeywords(S, w, P), n.filteredReplicationControllers = s.filterForKeywords(y, w, P), n.filteredReplicaSets = s.filterForKeywords(b, w, P), n.filteredBuilds = s.filterForKeywords(h, w, P), n.filteredStatefulSets = s.filterForKeywords(_.values(n.statefulSets), w, P);
}, k = function(e) {
n.logOptions.pods[e.metadata.name] = {
container: e.spec.containers[0].name
}, n.logCanRun.pods[e.metadata.name] = !_.includes([ "New", "Pending", "Unknown" ], e.status.phase);
}, I = function(e) {
n.logOptions.replicationControllers[e.metadata.name] = {};
var t = r("annotation")(e, "deploymentVersion");
t && (n.logOptions.replicationControllers[e.metadata.name].version = t), n.logCanRun.replicationControllers[e.metadata.name] = !_.includes([ "New", "Pending" ], r("deploymentStatus")(e));
}, R = function(e) {
n.logOptions.builds[e.metadata.name] = {}, n.logCanRun.builds[e.metadata.name] = !_.includes([ "New", "Pending", "Error" ], e.status.phase);
}, T = function() {
n.filteredStatefulSets = s.filterForKeywords(_.values(n.statefulSets), w, P);
}, E = function() {
S = _.filter(n.pods, function(e) {
return !n.filters.hideOlderResources || "Succeeded" !== e.status.phase && "Failed" !== e.status.phase;
}), n.filteredPods = s.filterForKeywords(S, w, P);
}, N = r("isIncompleteBuild"), D = r("buildConfigForBuild"), A = r("isRecentBuild"), B = function() {
moment().subtract(5, "m");
h = _.filter(n.builds, function(e) {
if (!n.filters.hideOlderResources) return !0;
if (N(e)) return !0;
var t = D(e);
return t ? n.latestBuildByConfig[t].metadata.name === e.metadata.name : A(e);
}), n.filteredBuilds = s.filterForKeywords(h, w, P);
}, L = r("deploymentStatus"), V = r("deploymentIsInProgress"), O = function() {
y = _.filter(n.replicationControllers, function(e) {
return !n.filters.hideOlderResources || (V(e) || "Active" === L(e));
}), n.filteredReplicationControllers = s.filterForKeywords(y, w, P);
}, U = function() {
b = _.filter(n.replicaSets, function(e) {
return !n.filters.hideOlderResources || _.get(e, "status.replicas");
}), n.filteredReplicaSets = s.filterForKeywords(b, w, P);
};
n.toggleItem = function(e, t, a, o) {
var i = $(e.target);
if (o || !i || !i.closest("a", t).length) {
var s, c;
switch (a.kind) {
case "Build":
s = !n.expanded.builds[a.metadata.name], n.expanded.builds[a.metadata.name] = s, c = s ? "event.resource.highlight" : "event.resource.clear-highlight", p.$emit(c, a);
var l = _.get(n.podsByName, r("annotation")(a, "buildPod"));
l && p.$emit(c, l);
break;

case "ReplicationController":
s = !n.expanded.replicationControllers[a.metadata.name], n.expanded.replicationControllers[a.metadata.name] = s, c = s ? "event.resource.highlight" : "event.resource.clear-highlight", p.$emit(c, a);
var u = r("annotation")(a, "deployerPod");
u && p.$emit(c, {
kind: "Pod",
metadata: {
name: u
}
}), _.each(n.podsByOwnerUID[a.metadata.uid], function(e) {
p.$emit(c, e);
});
break;

case "ReplicaSet":
s = !n.expanded.replicaSets[a.metadata.name], n.expanded.replicaSets[a.metadata.name] = s, c = s ? "event.resource.highlight" : "event.resource.clear-highlight", p.$emit(c, a), _.each(n.podsByOwnerUID[a.metadata.uid], function(e) {
p.$emit(c, e);
});
break;

case "Pod":
s = !n.expanded.pods[a.metadata.name], n.expanded.pods[a.metadata.name] = s, c = s ? "event.resource.highlight" : "event.resource.clear-highlight", p.$emit(c, a);
break;

case "StatefulSet":
s = !n.expanded.statefulSets[a.metadata.name], n.expanded.statefulSets[a.metadata.name] = s, c = s ? "event.resource.highlight" : "event.resource.clear-highlight", p.$emit(c, a);
}
}
}, n.viewPodsForSet = function(e) {
var t = _.get(n, [ "podsByOwnerUID", e.metadata.uid ], []);
_.isEmpty(t) || u.toPodsForDeployment(e, t);
}, m.get(e.project).then(_.spread(function(e, r) {
n.project = e, n.projectContext = r, g.push(o.watch("pods", r, function(e) {
n.podsByName = e.by("metadata.name"), n.pods = C(n.podsByName, !0), n.podsByOwnerUID = d.groupByOwnerUID(n.pods), n.podsLoaded = !0, _.each(n.pods, k), E(), c.log("pods", n.pods);
})), g.push(o.watch({
resource: "statefulsets",
group: "apps",
version: "v1beta1"
}, r, function(e) {
n.statefulSets = e.by("metadata.name"), n.statefulSetsLoaded = !0, T(), c.log("statefulSets", n.statefulSets);
}, {
poll: f,
pollInterval: 6e4
})), g.push(o.watch("replicationcontrollers", r, function(e) {
n.replicationControllers = C(e.by("metadata.name"), !0), n.replicationControllersLoaded = !0, _.each(n.replicationControllers, I), O(), c.log("replicationcontrollers", n.replicationControllers);
})), g.push(o.watch("builds", r, function(e) {
n.builds = C(e.by("metadata.name"), !0), n.latestBuildByConfig = a.latestBuildByConfig(n.builds), n.buildsLoaded = !0, _.each(n.builds, R), B(), c.log("builds", n.builds);
})), g.push(o.watch({
group: "extensions",
resource: "replicasets"
}, r, function(e) {
n.replicaSets = C(e.by("metadata.name"), !0), n.replicaSetsLoaded = !0, U(), c.log("replicasets", n.replicaSets);
}, {
poll: f,
pollInterval: 6e4
})), n.$on("$destroy", function() {
o.unwatchAll(g);
}), n.$watch("filters.hideOlderResources", function() {
E(), B(), O(), U(), T();
var e = t.search();
e.hideOlderResources = n.filters.hideOlderResources ? "true" : "false", t.replace().search(e);
}), n.$watch("kindSelector.selected.kind", function() {
var e = t.search();
e.kind = n.kindSelector.selected.kind, t.replace().search(e);
}), n.$watch("filters.text", _.debounce(function() {
n.filterKeywords = P = s.generateKeywords(n.filters.text), n.$apply(j);
}, 50, {
maxWait: 250
})), n.$watch("renderOptions.collapseEventsSidebar", function(e, t) {
e !== t && (localStorage.setItem("monitoring.eventsidebar.collapsed", n.renderOptions.collapseEventsSidebar ? "true" : "false"), p.$emit("metrics.charts.resize"));
});
}));
} ]), angular.module("openshiftConsole").controller("MembershipController", [ "$filter", "$location", "$routeParams", "$scope", "$timeout", "$uibModal", "APIService", "AuthService", "AuthorizationService", "DataService", "ProjectsService", "MembershipService", "NotificationsService", "RoleBindingsService", "RolesService", function(e, t, n, r, a, o, i, s, c, l, u, d, m, p, f) {
var g, v = n.project, h = e("humanizeKind"), y = e("annotation"), b = e("canI"), S = i.getPreferredVersion("serviceaccounts");
r.roleBindingsVersion = i.getPreferredVersion("rolebindings");
var C = [], w = {
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
}
}, P = function(e, t, n) {
m.addNotification({
type: e,
message: t,
details: n
});
}, j = function() {
r.disableAddForm = !1, r.newBinding.name = "", r.newBinding.namespace = v, r.newBinding.newRole = null;
}, k = function(e) {
l.list(S, e).then(function(e) {
var t = _.keys(e.by("metadata.name")).sort();
angular.extend(r, {
serviceAccounts: t,
refreshServiceAccounts: function(e) {
e && !_.includes(r.serviceAccounts, e) ? r.serviceAccounts = [ e ].concat(t) : r.serviceAccounts = t;
}
});
});
}, I = function(e) {
l.list(r.roleBindingsVersion, g, null, {
errorNotification: !1
}).then(function(e) {
angular.extend(r, {
canShowRoles: !0,
roleBindings: e.by("metadata.name"),
subjectKindsForUI: d.mapRolebindingsForUI(e.by("metadata.name"), C)
}), j();
}, function() {
e && (r.roleBindings[e.metadata.name] = e, r.subjectKindsForUI = d.mapRolebindingsForUI(r.roleBindings, C)), j();
});
}, R = function(t, n) {
r.disableAddForm = !0, p.create(t, n, v, g).then(function() {
I(), P("success", w.update.subject.success({
roleName: t.metadata.name,
subjectName: n.name
}));
}, function(r) {
j(), I(), P("error", w.update.subject.error({
roleName: t.metadata.name,
subjectName: n.name
}), e("getErrorDetails")(r));
});
}, T = function(t, n, a) {
r.disableAddForm = !0, p.addSubject(t, n, a, g).then(function() {
I(), P("success", w.update.subject.success({
roleName: t.roleRef.name,
subjectName: n.name
}));
}, function(r) {
j(), I(), P("error", w.update.subject.error({
roleName: t.roleRef.name,
subjectName: n.name
}), e("getErrorDetails")(r));
});
}, E = {};
n.tab && (E[n.tab] = !0);
var N = d.getSubjectKinds();
angular.extend(r, {
selectedTab: E,
projectName: v,
forms: {},
subjectKinds: N,
newBinding: {
role: "",
kind: n.tab || "User",
name: ""
},
toggleEditMode: function() {
j(), r.mode.edit = !r.mode.edit;
},
mode: {
edit: !1
},
selectTab: function(e) {
r.newBinding.kind = e, r.newBinding.name = "";
}
}), angular.extend(r, {
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
var t = _.get(e, "metadata.namespace"), n = _.get(e, "metadata.name"), r = t ? t + " / " + n + ": " : "";
return e ? r + (y(e, "description") || "") : "";
}
}
});
var D = function(e, t, n, a) {
var o = {
title: "Confirm Removal",
alerts: {},
detailsMarkup: w.remove.areYouSure.html.subject({
roleName: n,
kindName: h(t),
subjectName: e
}),
okButtonText: "Remove",
okButtonClass: "btn-danger",
cancelButtonText: "Cancel"
};
return _.isEqual(e, a) && (o.detailsMarkup = w.remove.areYouSure.html.self({
roleName: n,
subjectName: e
}), d.isLastRole(r.user.metadata.name, r.roleBindings) && (o.alerts.currentUserLabelRole = {
type: "error",
message: w.notice.yourLastRole({
roleName: n
})
})), _.isEqual(t, "ServiceAccount") && _.startsWith(n, "system:") && (o.alerts.editingServiceAccountRole = {
type: "error",
message: w.warning.serviceAccount()
}), o;
};
s.withUser().then(function(e) {
r.user = e;
}), u.list().then(function(e) {
var t = _.keys(e.by("metadata.name")).sort();
angular.extend(r, {
projects: t,
selectProject: function(e) {
r.newBinding.name = "", k({
namespace: e
});
},
refreshProjects: function(e) {
e && !_.includes(r.projects, e) ? r.projects = [ e ].concat(t) : r.projects = t;
}
});
}), u.get(n.project).then(_.spread(function(n, a) {
g = a, I(), k(g), angular.extend(r, {
project: n,
subjectKinds: N,
canUpdateRolebindings: b("rolebindings", "update", v),
confirmRemove: function(n, a, i, s) {
var l = null, u = D(n, a, i, r.user.metadata.name);
_.isEqual(n, r.user.metadata.name) && d.isLastRole(r.user.metadata.name, r.roleBindings) && (l = !0), o.open({
templateUrl: "views/modals/confirm.html",
controller: "ConfirmModalController",
resolve: {
modalConfig: function() {
return u;
}
}
}).result.then(function() {
p.removeSubject(n, i, s, r.roleBindings, g).then(function(e) {
l ? t.url("catalog") : (c.getProjectRules(v, !0).then(function() {
I(e[0]);
var t = b("rolebindings", "update", v);
angular.extend(r, {
canUpdateRolebindings: t,
mode: {
edit: !!r.mode.edit && t
}
});
}), P("success", w.remove.success({
roleName: i,
subjectName: n
})));
}, function(t) {
P("error", w.remove.error({
roleName: i,
subjectName: n
}), e("getErrorDetails")(t));
});
});
},
addRoleTo: function(e, t, n, a) {
var o = {
name: e,
kind: t
};
"ServiceAccount" === t && (o.namespace = a);
var i = _.find(r.roleBindings, {
roleRef: {
name: n.metadata.name
}
});
i && _.some(i.subjects, o) ? P("error", w.update.subject.exists({
roleName: n.metadata.name,
subjectName: e
})) : i ? T(i, o, a) : R(n, o);
}
}), f.listAllRoles(g, {
errorNotification: !1
}).then(function(e) {
C = d.mapRolesForUI(_.head(e).by("metadata.name"), _.last(e).by("metadata.name"));
var t = d.sortRoles(C), n = d.filterRoles(C), a = function(e, t) {
return _.some(t, {
metadata: {
name: e
}
});
};
I(), angular.extend(r, {
toggle: {
roles: !1
},
filteredRoles: n,
toggleRoles: function() {
r.toggle.roles = !r.toggle.roles, r.toggle.roles ? r.filteredRoles = t : (r.filteredRoles = n, a(r.newBinding.role, n) || (r.newBinding.role = null));
}
});
});
}));
} ]), angular.module("openshiftConsole").controller("BuildsController", [ "$filter", "$location", "$routeParams", "$scope", "APIService", "BuildsService", "DataService", "LabelFilter", "Logger", "ProjectsService", function(e, t, n, r, a, o, i, s, c, l) {
r.projectName = n.project, r.builds = {}, r.unfilteredBuildConfigs = {}, r.buildConfigs = void 0, r.labelSuggestions = {}, r.latestByConfig = {}, r.clearFilter = function() {
s.clear();
};
var u = e("buildConfigForBuild"), d = a.getPreferredVersion("builds"), m = a.getPreferredVersion("buildconfigs"), p = [];
l.get(n.project).then(_.spread(function(t, n) {
function a(e) {
var t = s.getLabelSelector();
if (t.isEmpty()) return !0;
var n = u(e) || "";
return n && r.unfilteredBuildConfigs[n] ? !!r.buildConfigs[n] : t.matches(e);
}
function l(e) {
if (u(e)) return !1;
var t = s.getLabelSelector();
return !!t.isEmpty() || t.matches(e);
}
function f() {
r.latestByConfig = o.latestBuildByConfig(r.builds, a), r.buildsNoConfig = _.pickBy(r.builds, l), angular.forEach(r.buildConfigs, function(e, t) {
r.latestByConfig[t] = r.latestByConfig[t] || null;
});
}
function g() {
var e = _.omitBy(r.latestByConfig, _.isNull);
r.filterWithZeroResults = !s.getLabelSelector().isEmpty() && _.isEmpty(r.buildConfigs) && _.isEmpty(e);
}
r.project = t;
var v = e("isJenkinsPipelineStrategy");
p.push(i.watch(d, n, function(e) {
r.buildsLoaded = !0, r.builds = _.omitBy(e.by("metadata.name"), v), f(), s.addLabelSuggestionsFromResources(r.builds, r.labelSuggestions), c.log("builds (subscribe)", r.builds);
})), p.push(i.watch(m, n, function(e) {
r.unfilteredBuildConfigs = _.omitBy(e.by("metadata.name"), v), s.addLabelSuggestionsFromResources(r.unfilteredBuildConfigs, r.labelSuggestions), s.setLabelSuggestions(r.labelSuggestions), r.buildConfigs = s.getLabelSelector().select(r.unfilteredBuildConfigs), f(), g(), c.log("buildconfigs (subscribe)", r.buildConfigs);
})), s.onActiveFiltersChanged(function(e) {
r.$evalAsync(function() {
r.buildConfigs = e.select(r.unfilteredBuildConfigs), f(), g();
});
}), r.$on("$destroy", function() {
i.unwatchAll(p);
});
}));
} ]), angular.module("openshiftConsole").controller("PipelinesController", [ "$filter", "$routeParams", "$scope", "APIService", "BuildsService", "Constants", "DataService", "Logger", "Navigate", "ProjectsService", function(e, t, n, r, a, o, i, s, c, l) {
n.projectName = t.project, n.alerts = n.alerts || {}, n.buildConfigs = {};
var u = r.getPreferredVersion("builds"), d = r.getPreferredVersion("templates");
n.buildConfigsVersion = r.getPreferredVersion("buildconfigs"), n.buildConfigsInstantiateVersion = r.getPreferredVersion("buildconfigs/instantiate");
var m = [];
l.get(t.project).then(_.spread(function(t, r) {
n.project = t;
var s = {}, l = e("buildConfigForBuild"), p = e("isIncompleteBuild"), f = e("isJenkinsPipelineStrategy"), g = e("isNewerResource"), v = function(e, t) {
if (!p(t)) {
n.statsByConfig[e] || (n.statsByConfig[e] = {
count: 0,
totalDuration: 0
});
var r = n.statsByConfig[e];
r.count++, r.totalDuration += a.getDuration(t), r.avgDuration = _.round(r.totalDuration / r.count);
}
}, h = function() {
var e = {}, t = {};
n.statsByConfig = {}, _.each(s, function(r) {
if (f(r)) {
var a = l(r) || "";
n.buildConfigs[a] || (n.buildConfigs[a] = null), p(r) ? _.set(e, [ a, r.metadata.name ], r) : g(r, t[a]) && (t[a] = r), v(a, r);
}
}), _.each(t, function(t, n) {
_.set(e, [ n, t.metadata.name ], t);
}), n.interestingBuildsByConfig = e;
};
m.push(i.watch(u, r, function(e) {
n.buildsLoaded = !0, s = e.by("metadata.name"), h();
}));
var y = !1;
m.push(i.watch(n.buildConfigsVersion, r, function(e) {
if (n.buildConfigsLoaded = !0, n.buildConfigs = _.pickBy(e.by("metadata.name"), f), _.isEmpty(n.buildConfigs) && !y && (y = !0, o.SAMPLE_PIPELINE_TEMPLATE)) {
var t = o.SAMPLE_PIPELINE_TEMPLATE.name, r = o.SAMPLE_PIPELINE_TEMPLATE.namespace;
i.get(d, t, {
namespace: r
}, {
errorNotification: !1
}).then(function(e) {
n.createSampleURL = c.createFromTemplateURL(e, n.projectName);
});
}
h();
})), n.startBuild = a.startBuild, n.$on("$destroy", function() {
i.unwatchAll(m);
});
}));
} ]), angular.module("openshiftConsole").controller("BuildConfigController", [ "$scope", "$filter", "$routeParams", "APIService", "AuthorizationService", "BuildsService", "ImagesService", "DataService", "LabelFilter", "ModalsService", "NotificationsService", "ProjectsService", "SecretsService", "keyValueEditorUtils", function(e, t, n, r, a, o, i, s, c, l, u, d, m, p) {
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
}), e.buildConfigsVersion = r.getPreferredVersion("buildconfigs"), e.buildsVersion = r.getPreferredVersion("builds"), e.buildConfigsInstantiateVersion = r.getPreferredVersion("buildconfigs/instantiate"), e.secretsVersion = r.getPreferredVersion("secrets"), e.emptyMessage = "Loading...", e.aceLoaded = function(e) {
var t = e.getSession();
t.setOption("tabSize", 2), t.setOption("useSoftTabs", !0), e.$blockScrolling = 1 / 0;
};
var f = t("buildConfigForBuild"), g = t("buildStrategy"), v = t("orderByDisplayName"), h = t("getErrorDetails"), y = [], b = [], S = [];
e.valueFromObjects = [];
var C = function(t) {
e.updatedBuildConfig = angular.copy(t), e.envVars = g(e.updatedBuildConfig).env || [];
};
e.compareTriggers = function(e, t) {
return _.isNumber(e.value) ? -1 : "ConfigChange" === e.value ? -1 : "ConfigChange" === t.value ? 1 : "ImageChange" === e.value ? -1 : "ImageChange" === t.value ? 1 : e.value.localeCompare(t.value);
}, e.saveEnvVars = function() {
u.hideNotification("save-bc-env-error"), e.envVars = _.filter(e.envVars, "name"), g(e.updatedBuildConfig).env = p.compactEntries(angular.copy(e.envVars)), s.update(e.buildConfigsVersion, n.buildconfig, e.updatedBuildConfig, e.projectContext).then(function() {
u.addNotification({
type: "success",
message: "Environment variables for build config " + e.buildConfigName + " were successfully updated."
}), e.forms.bcEnvVars.$setPristine();
}, function(n) {
u.addNotification({
id: "save-bc-env-error",
type: "error",
message: "An error occurred updating environment variables for build config " + e.buildConfigName + ".",
details: t("getErrorDetails")(n)
});
});
}, e.clearEnvVarUpdates = function() {
C(e.buildConfig), e.forms.bcEnvVars.$setPristine();
};
var w, P = function(n, a) {
e.loaded = !0, e.buildConfig = n, e.buildConfigPaused = o.isPaused(e.buildConfig), e.buildConfig.spec.source.images && (e.imageSources = e.buildConfig.spec.source.images, e.imageSourcesPaths = [], e.imageSources.forEach(function(n) {
e.imageSourcesPaths.push(t("destinationSourcePair")(n.paths));
}));
var c = _.get(g(n), "from", {}), l = c.kind + "/" + c.name + "/" + (c.namespace || e.projectName);
w !== l && (_.includes([ "ImageStreamTag", "ImageStreamImage" ], c.kind) ? (w = l, s.get(r.kindToResource(c.kind), c.name, {
namespace: c.namespace || e.projectName
}, {
errorNotification: !1
}).then(function(t) {
e.BCEnvVarsFromImage = i.getEnvironment(t);
}, function() {
e.BCEnvVarsFromImage = [];
})) : e.BCEnvVarsFromImage = []), C(n), "DELETED" === a && (e.alerts.deleted = {
type: "warning",
message: "This build configuration has been deleted."
}, e.buildConfigDeleted = !0), !e.forms.bcEnvVars || e.forms.bcEnvVars.$pristine ? C(n) : e.alerts.background_update = {
type: "warning",
message: "This build configuration has been updated in the background. Saving your changes may create a conflict or cause loss of data.",
links: [ {
label: "Reload Environment Variables",
onClick: function() {
return e.clearEnvVarUpdates(), !0;
}
} ]
}, e.paused = o.isPaused(e.buildConfig);
};
d.get(n.project).then(_.spread(function(r, i) {
function d() {
c.getLabelSelector().isEmpty() || !$.isEmptyObject(e.builds) || $.isEmptyObject(e.unfilteredBuilds) ? delete e.alerts.builds : e.alerts.builds = {
type: "warning",
details: "The active filters are hiding all builds."
};
}
e.project = r, e.projectContext = i, s.get(e.buildConfigsVersion, n.buildconfig, i, {
errorNotification: !1
}).then(function(t) {
P(t), y.push(s.watchObject(e.buildConfigsVersion, n.buildconfig, i, P));
}, function(n) {
e.loaded = !0, e.alerts.load = {
type: "error",
message: 404 === n.status ? "This build configuration can not be found, it may have been deleted." : "The build configuration details could not be loaded.",
details: 404 === n.status ? "Any remaining build history for this build will be shown." : t("getErrorDetails")(n)
};
}), s.list("configmaps", i, null, {
errorNotification: !1
}).then(function(t) {
b = v(t.by("metadata.name")), e.valueFromObjects = b.concat(S);
}, function(e) {
403 !== e.code && u.addNotification({
id: "build-config-list-config-maps-error",
type: "error",
message: "Could not load config maps.",
details: h(e)
});
}), a.canI(e.secretsVersion, "list", n.project) && s.list("secrets", i, null, {
errorNotification: !1
}).then(function(t) {
S = v(t.by("metadata.name")), e.webhookSecrets = m.groupSecretsByType(t).webhook, e.valueFromObjects = b.concat(S);
}, function(e) {
403 !== e.code && u.addNotification({
id: "build-config-list-secrets-error",
type: "error",
message: "Could not load secrets.",
details: h(e)
});
}), y.push(s.watch(e.buildsVersion, i, function(t, r, a) {
if (e.emptyMessage = "No builds to show", r) {
if (f(a) === n.buildconfig) {
var i = a.metadata.name;
switch (r) {
case "ADDED":
case "MODIFIED":
e.unfilteredBuilds[i] = a;
break;

case "DELETED":
delete e.unfilteredBuilds[i];
}
}
} else e.unfilteredBuilds = o.validatedBuildsForBuildConfig(n.buildconfig, t.by("metadata.name"));
e.builds = c.getLabelSelector().select(e.unfilteredBuilds), d(), c.addLabelSuggestionsFromResources(e.unfilteredBuilds, e.labelSuggestions), c.setLabelSuggestions(e.labelSuggestions), e.orderedBuilds = o.sortBuilds(e.builds, !0), e.latestBuild = _.head(e.orderedBuilds);
}, {
http: {
params: {
labelSelector: t("labelName")("buildConfig") + "=" + _.truncate(e.buildConfigName, {
length: 63,
omission: ""
})
}
}
})), c.onActiveFiltersChanged(function(t) {
e.$apply(function() {
e.builds = t.select(e.unfilteredBuilds), e.orderedBuilds = o.sortBuilds(e.builds, !0), e.latestBuild = _.head(e.orderedBuilds), d();
});
}), e.startBuild = function() {
o.startBuild(e.buildConfig);
}, e.showJenkinsfileExamples = function() {
l.showJenkinsfileExamples();
}, e.$on("$destroy", function() {
s.unwatchAll(y);
});
}));
} ]), angular.module("openshiftConsole").controller("BuildController", [ "$scope", "$filter", "$routeParams", "APIService", "BuildsService", "DataService", "ModalsService", "Navigate", "ProjectsService", function(e, t, n, r, a, o, i, s, c) {
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
}), e.buildsVersion = r.getPreferredVersion("builds"), e.buildConfigsVersion = r.getPreferredVersion("buildconfigs"), e.podsVersion = r.getPreferredVersion("pods");
var l, u = t("annotation"), d = [], m = function(t) {
e.logCanRun = !_.includes([ "New", "Pending", "Error" ], t.status.phase);
}, p = function() {
e.buildConfig ? e.canBuild = a.canBuild(e.buildConfig) : e.canBuild = !1;
};
c.get(n.project).then(_.spread(function(r, s) {
e.project = r, e.projectContext = s, e.logOptions = {};
var c = function() {
e.eventObjects = l ? [ e.build, l ] : [ e.build ];
}, f = function(t, n) {
e.loaded = !0, e.build = t, m(t), c();
var r = u(t, "buildNumber");
r && e.breadcrumbs[2] && (e.breadcrumbs[2].title = "#" + r), "DELETED" === n && (e.alerts.deleted = {
type: "warning",
message: "This build has been deleted."
});
var a;
l || (a = u(t, "buildPod")) && o.get(e.podsVersion, a, s, {
errorNotification: !1
}).then(function(e) {
l = e, c();
});
}, g = function(t, n) {
"DELETED" === n && (e.alerts.deleted = {
type: "warning",
message: "Build configuration " + e.buildConfigName + " has been deleted."
}, e.buildConfigDeleted = !0), e.buildConfig = t, e.buildConfigPaused = a.isPaused(e.buildConfig), p();
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
a.cancelBuild(e.build, e.buildConfigName);
}, e.cloneBuild = function() {
e.build && e.canBuild && a.cloneBuild(e.build, e.buildConfigName);
}, e.showJenkinsfileExamples = function() {
i.showJenkinsfileExamples();
}, e.$on("$destroy", function() {
o.unwatchAll(d);
});
}));
} ]), angular.module("openshiftConsole").controller("ImageController", [ "$filter", "$scope", "$routeParams", "APIService", "DataService", "ImageStreamsService", "imageLayers", "ProjectsService", function(e, t, n, r, a, o, i, s) {
function c(e, r) {
var a = o.tagsByName(e);
t.imageStream = e, t.tagsByName = a, t.tagName = n.tag;
var i = a[n.tag];
i ? (delete t.alerts.load, m(i, r)) : t.alerts.load = {
type: "error",
message: "The image tag was not found in the stream."
};
}
t.projectName = n.project, t.imageStream = null, t.image = null, t.layers = null, t.tagsByName = {}, t.alerts = {}, t.renderOptions = t.renderOptions || {}, t.renderOptions.hideFilterWidget = !0, t.breadcrumbs = [ {
title: "Image Streams",
link: "project/" + n.project + "/browse/images"
}, {
title: n.imagestream,
link: "project/" + n.project + "/browse/images/" + n.imagestream
}, {
title: ":" + n.tag
} ];
var l = r.getPreferredVersion("imagestreamtags"), u = r.getPreferredVersion("imagestreams"), d = [], m = _.debounce(function(r, o) {
var s = n.imagestream + ":" + n.tag;
a.get(l, s, o).then(function(e) {
t.loaded = !0, t.image = e.image, t.layers = i(t.image);
}, function(n) {
t.loaded = !0, t.alerts.load = {
type: "error",
message: "The image details could not be loaded.",
details: e("getErrorDetails")(n)
};
});
}, 200), p = function(e, n, r) {
c(e, n), "DELETED" === r && (t.alerts.deleted = {
type: "warning",
message: "This image stream has been deleted."
});
};
s.get(n.project).then(_.spread(function(r, o) {
t.project = r, a.get(u, n.imagestream, o, {
errorNotification: !1
}).then(function(e) {
p(e, o), d.push(a.watchObject(u, n.imagestream, o, function(e, t) {
p(e, o, t);
}));
}, function(n) {
t.loaded = !0, t.alerts.load = {
type: "error",
message: "The image stream details could not be loaded.",
details: e("getErrorDetails")(n)
};
}), t.$on("$destroy", function() {
a.unwatchAll(d);
});
}));
} ]), angular.module("openshiftConsole").controller("ImagesController", [ "$filter", "$routeParams", "$scope", "APIService", "DataService", "LabelFilter", "Logger", "ProjectsService", function(e, t, n, r, a, o, i, s) {
n.projectName = t.project, n.imageStreams = {}, n.unfilteredImageStreams = {}, n.missingStatusTagsByImageStream = {}, n.builds = {}, n.labelSuggestions = {}, n.clearFilter = function() {
o.clear();
};
var c = r.getPreferredVersion("imagestreams"), l = [];
s.get(t.project).then(_.spread(function(e, t) {
function r() {
angular.forEach(n.unfilteredImageStreams, function(e, t) {
var r = n.missingStatusTagsByImageStream[t] = {};
if (e.spec && e.spec.tags) {
var a = {};
e.status && e.status.tags && angular.forEach(e.status.tags, function(e) {
a[e.tag] = !0;
}), angular.forEach(e.spec.tags, function(e) {
a[e.name] || (r[e.name] = e);
});
}
});
}
function s() {
n.filterWithZeroResults = !o.getLabelSelector().isEmpty() && _.isEmpty(n.imageStreams) && !_.isEmpty(n.unfilteredImageStreams);
}
n.project = e, l.push(a.watch(c, t, function(e) {
n.imageStreamsLoaded = !0, n.unfilteredImageStreams = e.by("metadata.name"), o.addLabelSuggestionsFromResources(n.unfilteredImageStreams, n.labelSuggestions), o.setLabelSuggestions(n.labelSuggestions), n.imageStreams = o.getLabelSelector().select(n.unfilteredImageStreams), r(), s(), i.log("image streams (subscribe)", n.imageStreams);
})), o.onActiveFiltersChanged(function(e) {
n.$evalAsync(function() {
n.imageStreams = e.select(n.unfilteredImageStreams), s();
});
}), n.$on("$destroy", function() {
a.unwatchAll(l);
});
}));
} ]), angular.module("openshiftConsole").controller("ImageStreamController", [ "$filter", "$routeParams", "$scope", "APIService", "DataService", "ImageStreamsService", "Navigate", "ProjectsService", function(e, t, n, r, a, o, i, s) {
n.projectName = t.project, n.imageStream = null, n.tags = [], n.tagShowOlder = {}, n.alerts = {}, n.renderOptions = n.renderOptions || {}, n.renderOptions.hideFilterWidget = !0, n.breadcrumbs = [ {
title: "Image Streams",
link: "project/" + t.project + "/browse/images"
}, {
title: t.imagestream
} ], n.emptyMessage = "Loading...", n.imageStreamsVersion = r.getPreferredVersion("imagestreams");
var c = [];
s.get(t.project).then(_.spread(function(r, i) {
n.project = r, a.get(n.imageStreamsVersion, t.imagestream, i, {
errorNotification: !1
}).then(function(e) {
n.loaded = !0, n.imageStream = e, n.emptyMessage = "No tags to show", c.push(a.watchObject(n.imageStreamsVersion, t.imagestream, i, function(e, t) {
"DELETED" === t && (n.alerts.deleted = {
type: "warning",
message: "This image stream has been deleted."
}), n.imageStream = e, n.tags = _.toArray(o.tagsByName(n.imageStream));
}));
}, function(t) {
n.loaded = !0, n.alerts.load = {
type: "error",
message: "The image stream details could not be loaded.",
details: e("getErrorDetails")(t)
};
}), n.$on("$destroy", function() {
a.unwatchAll(c);
});
})), n.imagestreamPath = function(e, t) {
if (!t.status) return "";
var n = i.resourceURL(e.metadata.name, "ImageStream", e.metadata.namespace);
return t && (n += "/" + t.name), n;
};
} ]), angular.module("openshiftConsole").controller("DeploymentsController", [ "$scope", "$filter", "$routeParams", "APIService", "DataService", "DeploymentsService", "LabelFilter", "Logger", "OwnerReferencesService", "ProjectsService", function(e, t, n, r, a, o, i, s, c, l) {
function u() {
var t = _.isEmpty(e.unfilteredDeploymentConfigs) && _.isEmpty(e.unfilteredReplicationControllers) && _.isEmpty(e.unfilteredDeployments) && _.isEmpty(e.unfilteredReplicaSets), n = !i.getLabelSelector().isEmpty(), r = _.isEmpty(e.deploymentConfigs) && _.isEmpty(e.replicationControllersByDC[""]) && _.isEmpty(e.deployments) && _.isEmpty(e.replicaSets);
e.showEmptyState = t, e.filterWithZeroResults = n && r && !t;
}
e.projectName = n.project, e.replicationControllers = {}, e.unfilteredDeploymentConfigs = {}, e.unfilteredDeployments = {}, e.replicationControllersByDC = {}, e.labelSuggestions = {}, e.emptyMessage = "Loading...", e.expandedDeploymentConfigRow = {}, e.unfilteredReplicaSets = {}, e.unfilteredReplicationControllers = {}, e.showEmptyState = !0, e.clearFilter = function() {
i.clear();
};
var d, m, p = t("annotation"), f = r.getPreferredVersion("deployments"), g = r.getPreferredVersion("deploymentconfigs"), v = r.getPreferredVersion("replicationcontrollers"), h = r.getPreferredVersion("replicasets"), y = function() {
d && m && (e.replicaSetsByDeploymentUID = c.groupByControllerUID(d), e.unfilteredReplicaSets = _.get(e, [ "replicaSetsByDeploymentUID", "" ], {}), i.addLabelSuggestionsFromResources(e.unfilteredReplicaSets, e.labelSuggestions), i.setLabelSuggestions(e.labelSuggestions), e.replicaSets = i.getLabelSelector().select(e.unfilteredReplicaSets), e.latestReplicaSetByDeploymentUID = {}, _.each(e.replicaSetsByDeploymentUID, function(t, n) {
n && (e.latestReplicaSetByDeploymentUID[n] = o.getActiveReplicaSet(t, m[n]));
}), u());
}, b = [];
l.get(n.project).then(_.spread(function(n, r) {
e.project = n, b.push(a.watch(v, r, function(n, r, a) {
e.replicationControllers = n.by("metadata.name");
var c, l;
if (a && (c = p(a, "deploymentConfig"), l = a.metadata.name), e.replicationControllersByDC = o.associateDeploymentsToDeploymentConfig(e.replicationControllers, e.deploymentConfigs, !0), e.replicationControllersByDC[""] && (e.unfilteredReplicationControllers = e.replicationControllersByDC[""], i.addLabelSuggestionsFromResources(e.unfilteredReplicationControllers, e.labelSuggestions), i.setLabelSuggestions(e.labelSuggestions), e.replicationControllersByDC[""] = i.getLabelSelector().select(e.replicationControllersByDC[""])), u(), r) {
if ("ADDED" === r || "MODIFIED" === r && [ "New", "Pending", "Running" ].indexOf(t("deploymentStatus")(a)) > -1) e.deploymentConfigDeploymentsInProgress[c] = e.deploymentConfigDeploymentsInProgress[c] || {}, e.deploymentConfigDeploymentsInProgress[c][l] = a; else if ("MODIFIED" === r) {
var d = t("deploymentStatus")(a);
"Complete" !== d && "Failed" !== d || delete e.deploymentConfigDeploymentsInProgress[c][l];
}
} else e.deploymentConfigDeploymentsInProgress = o.associateRunningDeploymentToDeploymentConfig(e.replicationControllersByDC);
a ? "DELETED" !== r && (a.causes = t("deploymentCauses")(a)) : angular.forEach(e.replicationControllers, function(e) {
e.causes = t("deploymentCauses")(e);
}), s.log("replicationControllers (subscribe)", e.replicationControllers);
})), b.push(a.watch(h, r, function(t) {
d = t.by("metadata.name"), y(), s.log("replicasets (subscribe)", e.replicaSets);
})), b.push(a.watch(g, r, function(t) {
e.deploymentConfigsLoaded = !0, e.unfilteredDeploymentConfigs = t.by("metadata.name"), i.addLabelSuggestionsFromResources(e.unfilteredDeploymentConfigs, e.labelSuggestions), i.setLabelSuggestions(e.labelSuggestions), e.deploymentConfigs = i.getLabelSelector().select(e.unfilteredDeploymentConfigs), e.emptyMessage = "No deployment configurations to show", e.replicationControllersByDC = o.associateDeploymentsToDeploymentConfig(e.replicationControllers, e.deploymentConfigs, !0), e.replicationControllersByDC[""] && (e.unfilteredReplicationControllers = e.replicationControllersByDC[""], e.replicationControllersByDC[""] = i.getLabelSelector().select(e.replicationControllersByDC[""])), u(), s.log("deploymentconfigs (subscribe)", e.deploymentConfigs);
})), b.push(a.watch(f, r, function(t) {
m = e.unfilteredDeployments = t.by("metadata.uid"), i.addLabelSuggestionsFromResources(e.unfilteredDeployments, e.labelSuggestions), i.setLabelSuggestions(e.labelSuggestions), e.deployments = i.getLabelSelector().select(e.unfilteredDeployments), y(), s.log("deployments (subscribe)", e.unfilteredDeployments);
})), e.showDeploymentConfigTable = function() {
var t = _.size(e.replicationControllersByDC);
return t > 1 || 1 === t && !e.replicationControllersByDC[""];
}, i.onActiveFiltersChanged(function(t) {
e.$evalAsync(function() {
e.deploymentConfigs = t.select(e.unfilteredDeploymentConfigs), e.replicationControllersByDC = o.associateDeploymentsToDeploymentConfig(e.replicationControllers, e.deploymentConfigs, !0), e.replicationControllersByDC[""] && (e.unfilteredReplicationControllers = e.replicationControllersByDC[""], e.replicationControllersByDC[""] = i.getLabelSelector().select(e.replicationControllersByDC[""])), e.deployments = t.select(e.unfilteredDeployments), e.replicaSets = t.select(e.unfilteredReplicaSets), u();
});
}), e.$on("$destroy", function() {
a.unwatchAll(b);
});
}));
} ]), angular.module("openshiftConsole").controller("DeploymentController", [ "$scope", "$filter", "$routeParams", "APIService", "DataService", "DeploymentsService", "HPAService", "ImageStreamResolver", "LabelFilter", "Logger", "ModalsService", "Navigate", "OwnerReferencesService", "ProjectsService", "StorageService", function(e, t, n, r, a, o, i, s, c, l, u, d, m, p, f) {
var g = {};
e.projectName = n.project, e.name = n.deployment, e.replicaSetsForDeployment = {}, e.unfilteredReplicaSetsForDeployment = {}, e.labelSuggestions = {}, e.emptyMessage = "Loading...", e.forms = {}, e.alerts = {}, e.imagesByDockerReference = {}, e.breadcrumbs = [ {
title: "Deployments",
link: "project/" + n.project + "/browse/deployments"
}, {
title: n.deployment
} ];
var v = r.getPreferredVersion("builds"), h = r.getPreferredVersion("replicasets"), y = r.getPreferredVersion("limitranges"), b = r.getPreferredVersion("imagestreams");
e.deploymentsVersion = r.getPreferredVersion("deployments"), e.eventsVersion = r.getPreferredVersion("events"), e.horizontalPodAutoscalersVersion = r.getPreferredVersion("horizontalpodautoscalers"), e.healthCheckURL = d.healthCheckURL(n.project, "Deployment", n.deployment, e.deploymentsVersion.group);
var S = [];
p.get(n.project).then(_.spread(function(r, d) {
function p() {
c.getLabelSelector().isEmpty() || !_.isEmpty(e.replicaSetsForDeployment) || _.isEmpty(e.unfilteredReplicaSetsForDeployment) ? delete e.alerts["filter-hiding-all"] : e.alerts["filter-hiding-all"] = {
type: "warning",
details: "The active filters are hiding all rollout history."
};
}
e.project = r, e.projectContext = d;
var C = {}, w = function() {
i.getHPAWarnings(e.deployment, e.autoscalers, C, r).then(function(t) {
e.hpaWarnings = t;
});
};
a.get(e.deploymentsVersion, n.deployment, d, {
errorNotification: !1
}).then(function(t) {
e.loaded = !0, e.deployment = t, w(), S.push(a.watchObject(e.deploymentsVersion, n.deployment, d, function(t, n) {
"DELETED" === n && (e.alerts.deleted = {
type: "warning",
message: "This deployment has been deleted."
}), e.deployment = t, e.updatingPausedState = !1, w(), s.fetchReferencedImageStreamImages([ t.spec.template ], e.imagesByDockerReference, g, d);
})), S.push(a.watch(h, d, function(n) {
e.emptyMessage = "No deployments to show";
var r = n.by("metadata.name");
r = m.filterForController(r, t), e.inProgressDeployment = _.chain(r).filter("status.replicas").length > 1, e.unfilteredReplicaSetsForDeployment = o.sortByRevision(r), e.replicaSetsForDeployment = c.getLabelSelector().select(e.unfilteredReplicaSetsForDeployment), p(), c.addLabelSuggestionsFromResources(e.unfilteredReplicaSetsForDeployment, e.labelSuggestions), c.setLabelSuggestions(e.labelSuggestions);
}));
}, function(n) {
e.loaded = !0, e.alerts.load = {
type: "error",
message: 404 === n.status ? "This deployment can not be found, it may have been deleted." : "The deployment details could not be loaded.",
details: t("getErrorDetails")(n)
};
}), a.list(y, d).then(function(e) {
C = e.by("metadata.name"), w();
}), S.push(a.watch(b, d, function(t) {
var n = t.by("metadata.name");
s.buildDockerRefMapForImageStreams(n, g), e.deployment && s.fetchReferencedImageStreamImages([ e.deployment.spec.template ], e.imagesByDockerReference, g, d), l.log("imagestreams (subscribe)", e.imageStreams);
})), S.push(a.watch(e.horizontalPodAutoscalersVersion, d, function(t) {
e.autoscalers = i.filterHPA(t.by("metadata.name"), "Deployment", n.deployment), w();
})), S.push(a.watch(v, d, function(t) {
e.builds = t.by("metadata.name"), l.log("builds (subscribe)", e.builds);
})), c.onActiveFiltersChanged(function(t) {
e.$evalAsync(function() {
e.replicaSetsForDeployment = t.select(e.unfilteredReplicaSetsForDeployment), p();
});
}), e.scale = function(n) {
o.scale(e.deployment, n).then(_.noop, function(n) {
e.alerts = e.alerts || {}, e.alerts.scale = {
type: "error",
message: "An error occurred scaling the deployment.",
details: t("getErrorDetails")(n)
};
});
}, e.setPaused = function(n) {
e.updatingPausedState = !0, o.setPaused(e.deployment, n, d).then(_.noop, function(r) {
e.updatingPausedState = !1, e.alerts = e.alerts || {}, e.alerts.scale = {
type: "error",
message: "An error occurred " + (n ? "pausing" : "resuming") + " the deployment.",
details: t("getErrorDetails")(r)
};
});
}, e.removeVolume = function(t) {
var n;
n = _.get(e, "deployment.spec.paused") ? "This will remove the volume from the deployment." : "This will remove the volume from the deployment and start a new rollout.", t.persistentVolumeClaim ? n += " It will not delete the persistent volume claim." : t.secret ? n += " It will not delete the secret." : t.configMap && (n += " It will not delete the config map.");
u.confirm({
title: "Remove volume " + t.name + "?",
details: n,
okButtonText: "Remove",
okButtonClass: "btn-danger",
cancelButtonText: "Cancel"
}).then(function() {
f.removeVolume(e.deployment, t, d);
});
}, e.$on("$destroy", function() {
a.unwatchAll(S);
});
}));
} ]), angular.module("openshiftConsole").controller("DeploymentConfigController", [ "$scope", "$filter", "$routeParams", "APIService", "BreadcrumbsService", "DataService", "DeploymentsService", "HPAService", "ImageStreamResolver", "ModalsService", "Navigate", "NotificationsService", "Logger", "ProjectsService", "StorageService", "LabelFilter", "labelNameFilter", function(e, t, n, r, a, o, i, s, c, l, u, d, m, p, f, g, v) {
var h = {};
e.projectName = n.project, e.deploymentConfigName = n.deploymentconfig, e.deploymentConfig = null, e.deployments = {}, e.unfilteredDeployments = {}, e.imagesByDockerReference = {}, e.builds = {}, e.labelSuggestions = {}, e.forms = {}, e.alerts = {}, e.breadcrumbs = a.getBreadcrumbs({
name: n.deploymentconfig,
kind: "DeploymentConfig",
namespace: n.project
}), e.emptyMessage = "Loading...", e.deploymentConfigsInstantiateVersion = r.getPreferredVersion("deploymentconfigs/instantiate"), e.deploymentConfigsVersion = r.getPreferredVersion("deploymentconfigs"), e.eventsVersion = r.getPreferredVersion("events"), e.horizontalPodAutoscalersVersion = r.getPreferredVersion("horizontalpodautoscalers");
var y = r.getPreferredVersion("builds"), b = r.getPreferredVersion("imagestreams"), S = r.getPreferredVersion("limitranges"), C = r.getPreferredVersion("replicationcontrollers");
e.healthCheckURL = u.healthCheckURL(n.project, "DeploymentConfig", n.deploymentconfig, e.deploymentConfigsVersion.group);
var w = t("mostRecent"), P = t("orderObjectsByDate"), j = [];
p.get(n.project).then(_.spread(function(r, a) {
function u() {
g.getLabelSelector().isEmpty() || !$.isEmptyObject(e.deployments) || $.isEmptyObject(e.unfilteredDeployments) ? delete e.alerts.deployments : e.alerts.deployments = {
type: "warning",
details: "The active filters are hiding all deployments."
};
}
e.project = r, e.projectContext = a;
var d = {}, p = function() {
s.getHPAWarnings(e.deploymentConfig, e.autoscalers, d, r).then(function(t) {
e.hpaWarnings = t;
});
};
o.get(e.deploymentConfigsVersion, n.deploymentconfig, a, {
errorNotification: !1
}).then(function(r) {
e.loaded = !0, e.deploymentConfig = r, e.strategyParams = t("deploymentStrategyParams")(r), p(), j.push(o.watchObject(e.deploymentConfigsVersion, n.deploymentconfig, a, function(t, n) {
"DELETED" === n && (e.alerts.deleted = {
type: "warning",
message: "This deployment configuration has been deleted."
}), e.deploymentConfig = t, e.updatingPausedState = !1, p(), c.fetchReferencedImageStreamImages([ t.spec.template ], e.imagesByDockerReference, h, a);
}));
}, function(n) {
e.loaded = !0, e.alerts.load = {
type: "error",
message: 404 === n.status ? "This deployment configuration can not be found, it may have been deleted." : "The deployment configuration details could not be loaded.",
details: 404 === n.status ? "Any remaining deployment history for this deployment will be shown." : t("getErrorDetails")(n)
};
}), j.push(o.watch(C, a, function(r, a, o) {
var s = n.deploymentconfig;
if (e.emptyMessage = "No deployments to show", a) {
if (i.deploymentBelongsToConfig(o, n.deploymentconfig)) {
var c = o.metadata.name;
switch (a) {
case "ADDED":
case "MODIFIED":
e.unfilteredDeployments[c] = o, t("deploymentIsInProgress")(o) ? (e.deploymentConfigDeploymentsInProgress[s] = e.deploymentConfigDeploymentsInProgress[s] || {}, e.deploymentConfigDeploymentsInProgress[s][c] = o) : e.deploymentConfigDeploymentsInProgress[s] && delete e.deploymentConfigDeploymentsInProgress[s][c], o.causes = t("deploymentCauses")(o);
break;

case "DELETED":
delete e.unfilteredDeployments[c], e.deploymentConfigDeploymentsInProgress[s] && delete e.deploymentConfigDeploymentsInProgress[s][c];
}
}
} else {
var l = i.associateDeploymentsToDeploymentConfig(r.by("metadata.name"));
e.unfilteredDeployments = l[n.deploymentconfig] || {}, angular.forEach(e.unfilteredDeployments, function(e) {
e.causes = t("deploymentCauses")(e);
}), e.deploymentConfigDeploymentsInProgress = i.associateRunningDeploymentToDeploymentConfig(l);
}
e.deployments = g.getLabelSelector().select(e.unfilteredDeployments), e.orderedDeployments = P(e.deployments, !0), e.deploymentInProgress = !!_.size(e.deploymentConfigDeploymentsInProgress[s]), e.mostRecent = w(e.unfilteredDeployments), u(), g.addLabelSuggestionsFromResources(e.unfilteredDeployments, e.labelSuggestions), g.setLabelSuggestions(e.labelSuggestions);
}, {
http: {
params: {
labelSelector: v("deploymentConfig") + "=" + e.deploymentConfigName
}
}
})), o.list(S, a).then(function(e) {
d = e.by("metadata.name"), p();
}), j.push(o.watch(b, a, function(t) {
var n = t.by("metadata.name");
c.buildDockerRefMapForImageStreams(n, h), e.deploymentConfig && c.fetchReferencedImageStreamImages([ e.deploymentConfig.spec.template ], e.imagesByDockerReference, h, a), m.log("imagestreams (subscribe)", e.imageStreams);
})), j.push(o.watch(y, a, function(t) {
e.builds = t.by("metadata.name"), m.log("builds (subscribe)", e.builds);
})), j.push(o.watch(e.horizontalPodAutoscalersVersion, a, function(t) {
e.autoscalers = s.filterHPA(t.by("metadata.name"), "DeploymentConfig", n.deploymentconfig), p();
})), g.onActiveFiltersChanged(function(t) {
e.$apply(function() {
e.deployments = t.select(e.unfilteredDeployments), e.orderedDeployments = P(e.deployments, !0), u();
});
}), e.canDeploy = function() {
return !!e.deploymentConfig && (!e.deploymentConfig.metadata.deletionTimestamp && (!e.deploymentInProgress && !e.deploymentConfig.spec.paused));
}, e.startLatestDeployment = function() {
e.canDeploy() && i.startLatestDeployment(e.deploymentConfig, a);
}, e.scale = function(n) {
i.scale(e.deploymentConfig, n).then(_.noop, function(n) {
e.alerts["scale-error"] = {
type: "error",
message: "An error occurred scaling the deployment config.",
details: t("getErrorDetails")(n)
};
});
}, e.setPaused = function(n) {
e.updatingPausedState = !0, i.setPaused(e.deploymentConfig, n, a).then(_.noop, function(r) {
e.updatingPausedState = !1, e.alerts["pause-error"] = {
type: "error",
message: "An error occurred " + (n ? "pausing" : "resuming") + " the deployment config.",
details: t("getErrorDetails")(r)
};
});
};
var k = function() {
if (_.get(e, "deploymentConfig.spec.paused")) return !1;
var t = _.get(e, "deploymentConfig.spec.triggers", []);
return _.some(t, {
type: "ConfigChange"
});
};
e.removeVolume = function(t) {
var n;
n = k() ? "This will remove the volume from the deployment config and trigger a new deployment." : "This will remove the volume from the deployment config.", t.persistentVolumeClaim ? n += " It will not delete the persistent volume claim." : t.secret ? n += " It will not delete the secret." : t.configMap && (n += " It will not delete the config map.");
l.confirm({
title: "Remove volume " + t.name + "?",
details: n,
okButtonText: "Remove",
okButtonClass: "btn-danger",
cancelButtonText: "Cancel"
}).then(function() {
f.removeVolume(e.deploymentConfig, t, a);
});
}, e.$on("$destroy", function() {
o.unwatchAll(j);
});
}));
} ]), angular.module("openshiftConsole").controller("ReplicaSetController", [ "$scope", "$filter", "$routeParams", "APIService", "AuthorizationService", "BreadcrumbsService", "DataService", "DeploymentsService", "HPAService", "ImageStreamResolver", "keyValueEditorUtils", "kind", "Logger", "MetricsService", "ModalsService", "Navigate", "OwnerReferencesService", "PodsService", "ProjectsService", "StorageService", function(e, t, n, r, a, o, i, s, c, l, u, d, m, p, f, g, v, h, y, b) {
var S = !1, C = t("annotation"), w = t("humanizeKind")(d), P = t("hasDeployment"), j = r.getPreferredVersion("builds"), k = r.getPreferredVersion("imagestreams"), I = r.getPreferredVersion("horizontalpodautoscalers"), R = r.getPreferredVersion("limitranges"), T = r.getPreferredVersion("pods"), E = r.getPreferredVersion("replicasets"), N = r.getPreferredVersion("replicationcontrollers"), D = r.getPreferredVersion("resourcequotas"), A = r.getPreferredVersion("appliedclusterresourcequotas");
switch (d) {
case "ReplicaSet":
e.resource = E, e.healthCheckURL = g.healthCheckURL(n.project, "ReplicaSet", n.replicaSet, "extensions");
break;

case "ReplicationController":
e.resource = N, e.healthCheckURL = g.healthCheckURL(n.project, "ReplicationController", n.replicaSet);
}
var $ = {};
e.projectName = n.project, e.kind = d, e.replicaSet = null, e.deploymentConfig = null, e.deploymentConfigMissing = !1, e.imagesByDockerReference = {}, e.builds = {}, e.alerts = {}, e.renderOptions = e.renderOptions || {}, e.renderOptions.hideFilterWidget = !0, e.forms = {}, e.logOptions = {}, e.deploymentsVersion = r.getPreferredVersion("deployments"), e.deploymentConfigsVersion = r.getPreferredVersion("deploymentconfigs"), e.eventsVersion = r.getPreferredVersion("events"), e.deploymentConfigsLogVersion = "deploymentconfigs/log";
var B = [];
p.isAvailable().then(function(t) {
e.metricsAvailable = t;
});
var L = t("deploymentStatus"), V = function(t) {
e.logCanRun = !_.includes([ "New", "Pending" ], L(t));
}, O = t("isIE")();
y.get(n.project).then(_.spread(function(r, u) {
e.project = r, e.projectContext = u;
var p = {}, y = function() {
if (e.hpaForRS = c.filterHPA(p, d, n.replicaSet), e.deploymentConfigName && e.isActive) {
var t = c.filterHPA(p, "DeploymentConfig", e.deploymentConfigName);
e.autoscalers = e.hpaForRS.concat(t);
} else if (e.deployment && e.isActive) {
var r = c.filterHPA(p, "Deployment", e.deployment.metadata.name);
e.autoscalers = e.hpaForRS.concat(r);
} else e.autoscalers = e.hpaForRS;
}, N = function() {
B.push(i.watch(e.resource, u, function(t) {
var n, r = [];
angular.forEach(t.by("metadata.name"), function(t) {
(C(t, "deploymentConfig") || "") === e.deploymentConfigName && r.push(t);
}), n = s.getActiveDeployment(r), e.isActive = n && n.metadata.uid === e.replicaSet.metadata.uid, y();
}));
}, U = function() {
c.getHPAWarnings(e.replicaSet, e.autoscalers, e.limitRanges, r).then(function(t) {
e.hpaWarnings = t;
});
}, F = function(r) {
var a = C(r, "deploymentConfig");
if (a) {
S = !0, e.deploymentConfigName = a;
var o = C(r, "deploymentVersion");
o && (e.logOptions.version = o), e.healthCheckURL = g.healthCheckURL(n.project, "DeploymentConfig", a), i.get(e.deploymentConfigsVersion, a, u, {
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
}, x = function() {
e.isActive = s.isActiveReplicaSet(e.replicaSet, e.deployment);
}, M = function(t) {
return _.some(t, function(t) {
if (_.get(t, "status.replicas") && _.get(t, "metadata.uid") !== _.get(e.replicaSet, "metadata.uid")) {
var n = v.getControllerReferences(t);
return _.some(n, {
uid: e.deployment.metadata.uid
});
}
});
}, q = !1, z = function() {
var t = v.getControllerReferences(e.replicaSet), r = _.find(t, {
kind: "Deployment"
});
r && i.get(e.deploymentsVersion, r.name, u).then(function(t) {
e.deployment = t, e.healthCheckURL = g.healthCheckURL(n.project, "Deployment", t.metadata.name, "apps"), B.push(i.watchObject(e.deploymentsVersion, t.metadata.name, u, function(t, r) {
if ("DELETED" === r) return e.alerts["deployment-deleted"] = {
type: "warning",
message: "The deployment controlling this replica set has been deleted."
}, e.healthCheckURL = g.healthCheckURL(n.project, "ReplicaSet", n.replicaSet, "extensions"), e.deploymentMissing = !0, void delete e.deployment;
e.deployment = t, e.breadcrumbs = o.getBreadcrumbs({
object: e.replicaSet,
displayName: "#" + s.getRevision(e.replicaSet),
parent: {
title: e.deployment.metadata.name,
link: g.resourceURL(e.deployment)
},
humanizedKind: "Deployments"
}), x(), y();
})), B.push(i.watch(E, u, function(e) {
var t = e.by("metadata.name");
q = M(t);
}));
});
}, H = function() {
if (!_.isEmpty($)) {
var t = _.get(e, "replicaSet.spec.template");
t && l.fetchReferencedImageStreamImages([ t ], e.imagesByDockerReference, $, u);
}
};
i.get(e.resource, n.replicaSet, u, {
errorNotification: !1
}).then(function(t) {
switch (e.loaded = !0, e.replicaSet = t, V(t), d) {
case "ReplicationController":
F(t);
break;

case "ReplicaSet":
z();
}
U(), e.breadcrumbs = o.getBreadcrumbs({
object: t
}), B.push(i.watchObject(e.resource, n.replicaSet, u, function(t, n) {
"DELETED" === n && (e.alerts.deleted = {
type: "warning",
message: "This " + w + " has been deleted."
}), e.replicaSet = t, V(t), U(), H(), e.deployment && x();
})), e.deploymentConfigName && N(), B.push(i.watch(T, u, function(t) {
var n = t.by("metadata.name");
e.podsForDeployment = h.filterForOwner(n, e.replicaSet);
}));
}, function(r) {
e.loaded = !0, e.alerts.load = {
type: "error",
message: "The " + w + " details could not be loaded.",
details: t("getErrorDetails")(r)
}, e.breadcrumbs = o.getBreadcrumbs({
name: n.replicaSet,
kind: d,
namespace: n.project
});
}), B.push(i.watch(e.resource, u, function(n, r, a) {
e.replicaSets = n.by("metadata.name"), "ReplicationController" === d && (e.deploymentsByDeploymentConfig = s.associateDeploymentsToDeploymentConfig(e.replicaSets));
var o, i;
a && (o = C(a, "deploymentConfig"), i = a.metadata.name), e.deploymentConfigDeploymentsInProgress = e.deploymentConfigDeploymentsInProgress || {}, r ? "ADDED" === r || "MODIFIED" === r && t("deploymentIsInProgress")(a) ? (e.deploymentConfigDeploymentsInProgress[o] = e.deploymentConfigDeploymentsInProgress[o] || {}, e.deploymentConfigDeploymentsInProgress[o][i] = a) : "MODIFIED" === r && e.deploymentConfigDeploymentsInProgress[o] && delete e.deploymentConfigDeploymentsInProgress[o][i] : e.deploymentConfigDeploymentsInProgress = s.associateRunningDeploymentToDeploymentConfig(e.deploymentsByDeploymentConfig), a ? "DELETED" !== r && (a.causes = t("deploymentCauses")(a)) : angular.forEach(e.replicaSets, function(e) {
e.causes = t("deploymentCauses")(e);
});
})), B.push(i.watch(k, u, function(e) {
var t = e.by("metadata.name");
l.buildDockerRefMapForImageStreams(t, $), H(), m.log("imagestreams (subscribe)", t);
})), B.push(i.watch(j, u, function(t) {
e.builds = t.by("metadata.name"), m.log("builds (subscribe)", e.builds);
})), B.push(i.watch(I, u, function(e) {
p = e.by("metadata.name"), y(), U();
}, {
poll: O,
pollInterval: 6e4
})), i.list(R, u).then(function(t) {
e.limitRanges = t.by("metadata.name"), U();
});
B.push(i.watch(D, u, function(t) {
e.quotas = t.by("metadata.name");
}, {
poll: !0,
pollInterval: 6e4
})), B.push(i.watch(A, u, function(t) {
e.clusterQuotas = t.by("metadata.name");
}, {
poll: !0,
pollInterval: 6e4
}));
var G = t("deploymentIsLatest");
e.showRollbackAction = function() {
return "Complete" === L(e.replicaSet) && !G(e.replicaSet, e.deploymentConfig) && !e.replicaSet.metadata.deletionTimestamp && a.canI("deploymentconfigrollbacks", "create");
}, e.retryFailedDeployment = function(t) {
s.retryFailedDeployment(t, u, e);
}, e.rollbackToDeployment = function(t, n, r, a) {
s.rollbackToDeployment(t, n, r, a, u, e);
}, e.cancelRunningDeployment = function(e) {
s.cancelRunningDeployment(e, u);
}, e.scale = function(n) {
var r = e.deployment || e.deploymentConfig || e.replicaSet;
s.scale(r, n).then(_.noop, function(n) {
e.alerts = e.alerts || {}, e.alerts.scale = {
type: "error",
message: "An error occurred scaling.",
details: t("getErrorDetails")(n)
};
});
};
var K = t("hasDeploymentConfig");
e.isScalable = function() {
return !!_.isEmpty(e.autoscalers) && (!K(e.replicaSet) && !P(e.replicaSet) || (!(!e.deploymentConfigMissing && !e.deploymentMissing) || !(!e.deploymentConfig && !e.deployment) && (e.isActive && !q)));
}, e.removeVolume = function(n) {
var r = "This will remove the volume from the " + t("humanizeKind")(e.replicaSet.kind) + ".";
n.persistentVolumeClaim ? r += " It will not delete the persistent volume claim." : n.secret ? r += " It will not delete the secret." : n.configMap && (r += " It will not delete the config map.");
f.confirm({
title: "Remove volume " + n.name + "?",
details: r,
okButtonText: "Remove",
okButtonClass: "btn-danger",
cancelButtonText: "Cancel"
}).then(function() {
b.removeVolume(e.replicaSet, n, u);
});
}, e.$on("$destroy", function() {
i.unwatchAll(B);
});
}));
} ]), angular.module("openshiftConsole").controller("StatefulSetsController", [ "$scope", "$routeParams", "APIService", "DataService", "ProjectsService", "LabelFilter", "PodsService", function(e, t, n, r, a, o, i) {
e.projectName = t.project, e.labelSuggestions = {}, e.clearFilter = function() {
o.clear();
};
var s = n.getPreferredVersion("pods"), c = n.getPreferredVersion("statefulsets"), l = [];
a.get(t.project).then(_.spread(function(t, n) {
function a() {
e.filterWithZeroResults = !o.getLabelSelector().isEmpty() && _.isEmpty(e.statefulSets) && !_.isEmpty(e.unfilteredStatefulSets);
}
e.project = t, l.push(r.watch(c, n, function(t) {
angular.extend(e, {
loaded: !0,
unfilteredStatefulSets: t.by("metadata.name")
}), e.statefulSets = o.getLabelSelector().select(e.unfilteredStatefulSets), o.addLabelSuggestionsFromResources(e.unfilteredStatefulSets, e.labelSuggestions), o.setLabelSuggestions(e.labelSuggestions), a();
})), l.push(r.watch(s, n, function(t) {
e.pods = t.by("metadata.name"), e.podsByOwnerUID = i.groupByOwnerUID(e.pods);
})), o.onActiveFiltersChanged(function(t) {
e.$evalAsync(function() {
e.statefulSets = t.select(e.unfilteredStatefulSets), a();
});
}), e.$on("$destroy", function() {
r.unwatchAll(l);
});
}));
} ]), angular.module("openshiftConsole").controller("StatefulSetController", [ "$filter", "$scope", "$routeParams", "APIService", "BreadcrumbsService", "DataService", "MetricsService", "ProjectsService", "PodsService", function(e, t, n, r, a, o, i, s, c) {
t.projectName = n.project, t.statefulSetName = n.statefulset, t.forms = {}, t.alerts = {}, t.breadcrumbs = a.getBreadcrumbs({
name: t.statefulSetName,
kind: "StatefulSet",
namespace: n.project
});
var l = r.getPreferredVersion("pods"), u = r.getPreferredVersion("resourcequotas"), d = r.getPreferredVersion("appliedclusterresourcequotas");
t.statefulSetsVersion = r.getPreferredVersion("statefulsets");
var m, p = [];
i.isAvailable().then(function(e) {
t.metricsAvailable = e;
}), s.get(n.project).then(_.spread(function(n, r) {
m = r, o.get(t.statefulSetsVersion, t.statefulSetName, r, {
errorNotification: !1
}).then(function(e) {
angular.extend(t, {
project: n,
projectContext: r,
statefulSet: e,
loaded: !0,
isScalable: function() {
return !1;
},
scale: function() {}
}), p.push(o.watchObject(t.statefulSetsVersion, t.statefulSetName, r, function(e) {
t.statefulSet = e;
})), p.push(o.watch(l, r, function(n) {
var r = n.by("metadata.name");
t.podsForStatefulSet = c.filterForOwner(r, e);
}));
p.push(o.watch(u, r, function(e) {
t.quotas = e.by("metadata.name");
}, {
poll: !0,
pollInterval: 6e4
})), p.push(o.watch(d, r, function(e) {
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
o.unwatchAll(p);
});
} ]), angular.module("openshiftConsole").controller("ServicesController", [ "$filter", "$routeParams", "$scope", "APIService", "DataService", "ProjectsService", "LabelFilter", "Logger", function(e, t, n, r, a, o, i, s) {
n.projectName = t.project, n.services = {}, n.unfilteredServices = {}, n.routesByService = {}, n.routes = {}, n.labelSuggestions = {}, n.clearFilter = function() {
i.clear();
};
var c = r.getPreferredVersion("services"), l = [];
o.get(t.project).then(_.spread(function(e, t) {
function r() {
n.filterWithZeroResults = !i.getLabelSelector().isEmpty() && _.isEmpty(n.services) && !_.isEmpty(n.unfilteredServices);
}
n.project = e, l.push(a.watch(c, t, function(e) {
n.servicesLoaded = !0, n.unfilteredServices = e.by("metadata.name"), i.addLabelSuggestionsFromResources(n.unfilteredServices, n.labelSuggestions), i.setLabelSuggestions(n.labelSuggestions), n.services = i.getLabelSelector().select(n.unfilteredServices), r(), s.log("services (subscribe)", n.unfilteredServices);
})), i.onActiveFiltersChanged(function(e) {
n.$evalAsync(function() {
n.services = e.select(n.unfilteredServices), r();
});
}), n.$on("$destroy", function() {
a.unwatchAll(l);
});
}));
} ]), angular.module("openshiftConsole").controller("ServiceController", [ "$scope", "$routeParams", "APIService", "DataService", "Logger", "ProjectsService", "$filter", function(e, t, n, r, a, o, i) {
e.projectName = t.project, e.service = null, e.services = null, e.alerts = {}, e.renderOptions = e.renderOptions || {}, e.renderOptions.hideFilterWidget = !0, e.breadcrumbs = [ {
title: "Services",
link: "project/" + t.project + "/browse/services"
}, {
title: t.service
} ], e.podFailureReasons = {
Pending: "This pod will not receive traffic until all of its containers have been created."
};
var s = n.getPreferredVersion("pods"), c = n.getPreferredVersion("endpoints");
e.eventsVersion = n.getPreferredVersion("events"), e.routesVersion = n.getPreferredVersion("routes"), e.servicesVersion = n.getPreferredVersion("services");
var l = {}, u = [], d = function() {
e.service && (e.portsByRoute = {}, _.each(e.service.spec.ports, function(t) {
var n = !1;
t.nodePort && (e.showNodePorts = !0), _.each(e.routesForService, function(r) {
r.spec.port && r.spec.port.targetPort !== t.name && r.spec.port.targetPort !== t.targetPort || (e.portsByRoute[r.metadata.name] = e.portsByRoute[r.metadata.name] || [], e.portsByRoute[r.metadata.name].push(t), n = !0);
}), n || (e.portsByRoute[""] = e.portsByRoute[""] || [], e.portsByRoute[""].push(t));
}));
}, m = function() {
if (e.podsForService = {}, e.service) {
var t = new LabelSelector(e.service.spec.selector);
e.podsForService = t.select(l);
}
}, p = function(t, n) {
e.loaded = !0, e.service = t, m(), d(), "DELETED" === n && (e.alerts.deleted = {
type: "warning",
message: "This service has been deleted."
});
};
o.get(t.project).then(_.spread(function(n, o) {
e.project = n, e.projectContext = o, r.get(e.servicesVersion, t.service, o, {
errorNotification: !1
}).then(function(n) {
p(n), u.push(r.watchObject(e.servicesVersion, t.service, o, p));
}, function(t) {
e.loaded = !0, e.alerts.load = {
type: "error",
message: "The service details could not be loaded.",
details: i("getErrorDetails")(t)
};
}), u.push(r.watch(e.servicesVersion, o, function(t) {
e.services = t.by("metadata.name");
})), u.push(r.watch(s, o, function(e) {
l = e.by("metadata.name"), m();
})), u.push(r.watch(c, o, function(n) {
e.podsWithEndpoints = {};
var r = n.by("metadata.name")[t.service];
r && _.each(r.subsets, function(t) {
_.each(t.addresses, function(t) {
"Pod" === _.get(t, "targetRef.kind") && (e.podsWithEndpoints[t.targetRef.name] = !0);
});
});
})), u.push(r.watch(e.routesVersion, o, function(n) {
e.routesForService = {}, angular.forEach(n.by("metadata.name"), function(n) {
"Service" === n.spec.to.kind && n.spec.to.name === t.service && (e.routesForService[n.metadata.name] = n);
}), d(), a.log("routes (subscribe)", e.routesForService);
})), e.$on("$destroy", function() {
r.unwatchAll(u);
});
}));
} ]), angular.module("openshiftConsole").controller("ServiceInstancesController", [ "$scope", "$filter", "$routeParams", "APIService", "BindingService", "Constants", "DataService", "LabelFilter", "Logger", "ProjectsService", function(e, t, n, r, a, o, i, s, c, l) {
e.bindingsByInstanceRef = {}, e.labelSuggestions = {}, e.projectName = n.project, e.serviceClasses = {}, e.serviceInstances = {}, e.unfilteredServiceInstances = {}, e.clearFilter = function() {
s.clear();
};
var u = r.getPreferredVersion("servicebindings"), d = r.getPreferredVersion("clusterserviceclasses");
e.serviceInstancesVersion = r.getPreferredVersion("serviceinstances");
var m = [], p = function() {
e.serviceInstances = s.getLabelSelector().select(e.unfilteredServiceInstances);
}, f = function() {
e.unfilteredServiceInstances = a.sortServiceInstances(e.unfilteredServiceInstances, e.serviceClasses);
};
e.getServiceClass = function(t) {
var n = _.get(t, "spec.clusterServiceClassRef.name");
return _.get(e, [ "serviceClasses", n ]);
}, l.get(n.project).then(_.spread(function(t, n) {
function r() {
e.filterWithZeroResults = !s.getLabelSelector().isEmpty() && _.isEmpty(e.serviceInstances) && !_.isEmpty(e.unfilteredServiceInstances);
}
e.project = t, e.projectContext = n, m.push(i.watch(u, n, function(t) {
var n = t.by("metadata.name");
e.bindingsByInstanceRef = _.groupBy(n, "spec.instanceRef.name");
})), m.push(i.watch(e.serviceInstancesVersion, n, function(t) {
e.serviceInstancesLoaded = !0, e.unfilteredServiceInstances = t.by("metadata.name"), f(), p(), r(), s.addLabelSuggestionsFromResources(e.unfilteredServiceInstances, e.labelSuggestions), s.setLabelSuggestions(e.labelSuggestions), c.log("provisioned services (subscribe)", e.unfilteredServiceInstances);
})), i.list(d, {}, function(t) {
e.serviceClasses = t.by("metadata.name"), f(), p();
}), s.onActiveFiltersChanged(function(t) {
e.$evalAsync(function() {
e.serviceInstances = t.select(e.unfilteredServiceInstances), r();
});
}), e.$on("$destroy", function() {
i.unwatchAll(m);
});
}));
} ]), angular.module("openshiftConsole").controller("ServiceInstanceController", [ "$scope", "$filter", "$routeParams", "APIService", "BindingService", "AuthorizationService", "Catalog", "DataService", "Logger", "ProjectsService", "SecretsService", "ServiceInstancesService", function(e, t, n, r, a, o, i, s, c, l, u, d) {
e.alerts = {}, e.projectName = n.project, e.serviceInstance = null, e.serviceClass = null, e.serviceClasses = null, e.editDialogShown = !1, e.breadcrumbs = [ {
title: "Provisioned Services",
link: "project/" + n.project + "/browse/service-instances"
} ], e.deprovision = function() {
e.serviceInstance.metadata.deletionTimestamp || d.deprovision(e.serviceInstance, e.bindings);
}, e.showEditDialog = function() {
e.editDialogShown = !0;
}, e.showParameterValues = !1, e.toggleShowParameterValues = function() {
e.showParameterValues = !e.showParameterValues;
}, e.closeEditDialog = function() {
e.editDialogShown = !1;
};
var m = r.getPreferredVersion("servicebindings");
e.eventsVersion = r.getPreferredVersion("events"), e.serviceInstancesVersion = r.getPreferredVersion("serviceinstances");
var p, f, g = [], v = [], h = t("serviceInstanceDisplayName"), y = t("isServiceInstanceFailed"), b = function() {
e.breadcrumbs.push({
title: e.displayName
});
}, S = function() {
if (e.serviceInstance && e.parameterSchema) {
s.unwatchAll(v), v = [], e.allowParametersReveal = o.canI("secrets", "get", e.projectName), e.parameterData = {}, e.opaqueParameterKeys = [];
var t = e.allowParametersReveal ? "" : "*****";
_.each(_.keys(_.get(e.parameterSchema, "properties")), function(n) {
e.parameterData[n] = t;
});
var n = _.get(e.serviceInstance, "status.externalProperties.parameters", {});
_.each(_.keys(n), function(t) {
"<redacted>" === n[t] ? e.parameterData[t] = "*****" : (e.parameterData[t] = n[t], e.opaqueParameterKeys.push(t));
}), e.allowParametersReveal && _.each(_.get(e.serviceInstance, "spec.parametersFrom"), function(t) {
v.push(s.watchObject("secrets", _.get(t, "secretKeyRef.name"), e.projectContext, function(n) {
try {
var r = JSON.parse(u.decodeSecretData(n.data)[t.secretKeyRef.key]);
_.extend(e.parameterData, r);
} catch (e) {
c.warn("Unable to load parameters from secret " + _.get(t, "secretKeyRef.name"), e);
}
}));
});
}
}, C = function() {
if (e.plan && e.serviceClass && e.serviceInstance) {
var t = _.get(e.plan, "spec.instanceUpdateParameterSchema"), n = _.size(_.get(t, "properties")) > 0 || _.get(e.serviceClass, "spec.planUpdatable") && _.size(e.servicePlans) > 1;
e.editAvailable = n && !y(e.serviceInstance) && !_.get(e.serviceInstance, "status.asyncOpInProgress") && !_.get(e.serviceInstance, "metadata.deletionTimestamp");
}
}, w = function() {
e.parameterFormDefinition = angular.copy(_.get(e.plan, "spec.externalMetadata.schemas.service_instance.update.openshift_form_definition")), e.parameterSchema = _.get(e.plan, "spec.instanceCreateParameterSchema"), S();
}, P = function() {
var t = _.get(e.serviceInstance, "spec.clusterServicePlanRef.name");
e.plan = _.find(e.servicePlans, {
metadata: {
name: t
}
}), w(), C();
}, j = function() {
e.serviceClass && !f && (e.servicePlans ? P() : f = i.getServicePlansForServiceClass(e.serviceClass).then(function(t) {
var n = _.get(e.serviceInstance, "spec.clusterServicePlanRef.name");
e.servicePlans = _.reject(t.by("metadata.name"), function(e) {
return _.get(e, "status.removedFromBrokerCatalog") && e.metadata.name !== n;
}), P(), f = null;
}));
}, k = function() {
e.serviceInstance && !p && (e.serviceClass ? j() : p = d.fetchServiceClassForInstance(e.serviceInstance).then(function(t) {
e.serviceClass = t, e.displayName = h(e.serviceInstance, e.serviceClass), b(), p = null, j();
}));
}, I = function(t, n) {
e.loaded = !0, e.serviceInstance = t, "DELETED" === n && (e.alerts.deleted = {
type: "warning",
message: "This provisioned service has been deleted."
}), k(), S(), C();
};
l.get(n.project).then(_.spread(function(r, o) {
e.project = r, e.projectContext = o, s.get(e.serviceInstancesVersion, n.instance, o, {
errorNotification: !1
}).then(function(t) {
I(t), g.push(s.watchObject(e.serviceInstancesVersion, n.instance, o, I)), g.push(s.watch(m, o, function(n) {
var r = n.by("metadata.name");
e.bindings = a.getBindingsForResource(r, t);
}));
}, function(n) {
e.loaded = !0, e.alerts.load = {
type: "error",
message: "The provisioned service details could not be loaded.",
details: t("getErrorDetails")(n)
};
});
}, function(n) {
e.loaded = !0, e.alerts.load = {
type: "error",
message: "The service details could not be loaded.",
details: t("getErrorDetails")(n)
};
})), e.$on("$destroy", function() {
s.unwatchAll(g), s.unwatchAll(v);
});
} ]), angular.module("openshiftConsole").controller("SecretsController", [ "$routeParams", "$scope", "APIService", "DataService", "LabelFilter", "ProjectsService", function(e, t, n, r, a, o) {
t.projectName = e.project, t.labelSuggestions = {}, t.clearFilter = function() {
a.clear();
}, t.secretsVersion = n.getPreferredVersion("secrets");
var i = [];
o.get(e.project).then(_.spread(function(e, n) {
function o() {
t.filterWithZeroResults = !a.getLabelSelector().isEmpty() && _.isEmpty(t.secrets) && !_.isEmpty(t.unfilteredSecrets);
}
t.project = e, t.context = n, i.push(r.watch(t.secretsVersion, n, function(e) {
t.unfilteredSecrets = _.sortBy(e.by("metadata.name"), [ "type", "metadata.name" ]), t.secretsLoaded = !0, a.addLabelSuggestionsFromResources(t.unfilteredSecrets, t.labelSuggestions), a.setLabelSuggestions(t.labelSuggestions), t.secrets = a.getLabelSelector().select(t.unfilteredSecrets), o();
})), a.onActiveFiltersChanged(function(e) {
t.$evalAsync(function() {
t.secrets = e.select(t.unfilteredSecrets), o();
});
}), t.$on("$destroy", function() {
r.unwatchAll(i);
});
}));
} ]), angular.module("openshiftConsole").controller("SecretController", [ "$routeParams", "$filter", "$scope", "APIService", "DataService", "ProjectsService", "SecretsService", function(e, t, n, r, a, o, i) {
n.projectName = e.project, n.secretName = e.secret, n.view = {
showSecret: !1
}, n.alerts = n.alerts || {}, n.breadcrumbs = [ {
title: "Secrets",
link: "project/" + e.project + "/browse/secrets"
}, {
title: n.secretName
} ], n.secretsVersion = r.getPreferredVersion("secrets");
var s = [], c = function(e, t) {
n.secret = e, "DELETED" !== t ? n.decodedSecretData = i.decodeSecretData(n.secret.data) : n.alerts.deleted = {
type: "warning",
message: "This secret has been deleted."
};
};
n.addToApplicationVisible = !1, n.addToApplication = function() {
n.secret.data && (n.addToApplicationVisible = !0);
}, n.closeAddToApplication = function() {
n.addToApplicationVisible = !1;
}, o.get(e.project).then(_.spread(function(e, r) {
n.project = e, n.context = r, a.get(n.secretsVersion, n.secretName, r, {
errorNotification: !1
}).then(function(e) {
n.loaded = !0, c(e), s.push(a.watchObject(n.secretsVersion, n.secretName, r, c));
}, function(e) {
n.loaded = !0, n.alerts.load = {
type: "error",
message: "The secret details could not be loaded.",
details: t("getErrorDetails")(e)
};
}), n.$on("$destroy", function() {
a.unwatchAll(s);
});
}));
} ]), angular.module("openshiftConsole").controller("CreateSecretController", [ "$filter", "$location", "$routeParams", "$scope", "$window", "ApplicationGenerator", "AuthorizationService", "DataService", "Navigate", "ProjectsService", function(e, t, n, r, a, o, i, s, c, l) {
r.alerts = {}, r.projectName = n.project, r.breadcrumbs = [ {
title: "Secrets",
link: "project/" + r.projectName + "/browse/secrets"
}, {
title: "Create Secret"
} ], l.get(n.project).then(_.spread(function(e, o) {
r.project = e, r.context = o, i.canI("secrets", "create", n.project) ? r.navigateBack = function() {
n.then ? t.url(n.then) : a.history.back();
} : c.toErrorPage("You do not have authority to create secrets in project " + n.project + ".", "access_denied");
}));
} ]), angular.module("openshiftConsole").controller("ConfigMapsController", [ "$scope", "$routeParams", "APIService", "DataService", "LabelFilter", "ProjectsService", function(e, t, n, r, a, o) {
e.projectName = t.project, e.loaded = !1, e.labelSuggestions = {}, e.configMapsVersion = n.getPreferredVersion("configmaps"), e.clearFilter = function() {
a.clear();
};
var i, s = [], c = function() {
e.filterWithZeroResults = !a.getLabelSelector().isEmpty() && _.isEmpty(e.configMaps) && !_.isEmpty(i);
}, l = function() {
a.addLabelSuggestionsFromResources(i, e.labelSuggestions), a.setLabelSuggestions(e.labelSuggestions);
}, u = function() {
var t = a.getLabelSelector().select(i);
e.configMaps = _.sortBy(t, "metadata.name"), c();
};
o.get(t.project).then(_.spread(function(t, n) {
e.project = t, s.push(r.watch(e.configMapsVersion, n, function(t) {
i = t.by("metadata.name"), l(), u(), e.loaded = !0;
})), a.onActiveFiltersChanged(function() {
e.$evalAsync(u);
}), e.$on("$destroy", function() {
r.unwatchAll(s);
});
}));
} ]), angular.module("openshiftConsole").controller("ConfigMapController", [ "$scope", "$routeParams", "APIService", "BreadcrumbsService", "DataService", "ProjectsService", function(e, t, n, r, a, o) {
e.projectName = t.project, e.alerts = e.alerts || {}, e.loaded = !1, e.labelSuggestions = {}, e.breadcrumbs = r.getBreadcrumbs({
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
}, o.get(t.project).then(_.spread(function(n, r) {
e.project = n, a.get(e.configMapsVersion, t.configMap, r, {
errorNotification: !1
}).then(function(e) {
s(e), i.push(a.watchObject("configmaps", t.configMap, r, s));
}, function(t) {
e.loaded = !0, e.error = t;
}), e.$on("$destroy", function() {
a.unwatchAll(i);
});
}));
} ]), angular.module("openshiftConsole").controller("CreateConfigMapController", [ "$filter", "$routeParams", "$scope", "$window", "APIService", "AuthorizationService", "DataService", "Navigate", "NotificationsService", "ProjectsService", function(e, t, n, r, a, o, i, s, c, l) {
n.projectName = t.project, n.breadcrumbs = [ {
title: "Config Maps",
link: "project/" + n.projectName + "/browse/config-maps"
}, {
title: "Create Config Map"
} ];
var u = function() {
c.hideNotification("create-config-map-error");
};
n.$on("$destroy", u);
var d = function() {
r.history.back();
};
n.cancel = d, l.get(t.project).then(_.spread(function(r, l) {
n.project = r, o.canI("configmaps", "create", t.project) ? (n.configMap = {
apiVersion: "v1",
kind: "ConfigMap",
metadata: {
namespace: t.project
},
data: {}
}, n.createConfigMap = function() {
if (n.createConfigMapForm.$valid) {
u(), n.disableInputs = !0;
var t = a.objectToResourceGroupVersion(n.configMap);
i.create(t, null, n.configMap, l).then(function() {
c.addNotification({
type: "success",
message: "Config map " + n.configMap.metadata.name + " successfully created."
}), d();
}, function(t) {
n.disableInputs = !1, c.addNotification({
id: "create-config-map-error",
type: "error",
message: "An error occurred creating the config map.",
details: e("getErrorDetails")(t)
});
});
}
}) : s.toErrorPage("You do not have authority to create config maps in project " + t.project + ".", "access_denied");
}));
} ]), angular.module("openshiftConsole").controller("RoutesController", [ "$filter", "$routeParams", "$scope", "APIService", "DataService", "LabelFilter", "ProjectsService", function(e, t, n, r, a, o, i) {
n.projectName = t.project, n.unfilteredRoutes = {}, n.routes = {}, n.labelSuggestions = {}, n.clearFilter = function() {
o.clear();
};
var s = r.getPreferredVersion("services");
n.routesVersion = r.getPreferredVersion("routes");
var c = [];
i.get(t.project).then(_.spread(function(e, t) {
function r() {
n.filterWithZeroResults = !o.getLabelSelector().isEmpty() && _.isEmpty(n.routes) && !_.isEmpty(n.unfilteredRoutes);
}
n.project = e, c.push(a.watch(n.routesVersion, t, function(e) {
n.routesLoaded = !0, n.unfilteredRoutes = e.by("metadata.name"), o.addLabelSuggestionsFromResources(n.unfilteredRoutes, n.labelSuggestions), o.setLabelSuggestions(n.labelSuggestions), n.routes = o.getLabelSelector().select(n.unfilteredRoutes), r();
})), c.push(a.watch(s, t, function(e) {
n.services = e.by("metadata.name");
})), o.onActiveFiltersChanged(function(e) {
n.$evalAsync(function() {
n.routes = e.select(n.unfilteredRoutes), r();
});
}), n.$on("$destroy", function() {
a.unwatchAll(c);
});
}));
} ]), angular.module("openshiftConsole").controller("RouteController", [ "$scope", "$filter", "$routeParams", "AlertMessageService", "APIService", "DataService", "ProjectsService", "RoutesService", function(e, t, n, r, a, o, i, s) {
e.projectName = n.project, e.route = null, e.alerts = {}, e.renderOptions = e.renderOptions || {}, e.renderOptions.hideFilterWidget = !0, e.breadcrumbs = [ {
title: "Routes",
link: "project/" + n.project + "/browse/routes"
}, {
title: n.route
} ];
var c = a.getPreferredVersion("services");
e.routesVersion = a.getPreferredVersion("routes");
var l, u = [], d = function(t, n) {
e.loaded = !0, e.route = t, l = s.isCustomHost(t), "DELETED" === n && (e.alerts.deleted = {
type: "warning",
message: "This route has been deleted."
});
}, m = function(t) {
return "router-host-" + _.get(e, "route.metadata.uid") + "-" + t.host + "-" + t.routerCanonicalHostname;
};
e.showRouterHostnameAlert = function(t, n) {
if (!l) return !1;
if (!t || !t.host || !t.routerCanonicalHostname) return !1;
if (!n || "True" !== n.status) return !1;
var a = m(t);
return !r.isAlertPermanentlyHidden(a, e.projectName);
}, i.get(n.project).then(_.spread(function(r, a) {
e.project = r, o.get(e.routesVersion, n.route, a, {
errorNotification: !1
}).then(function(t) {
d(t), u.push(o.watchObject(e.routesVersion, n.route, a, d));
}, function(n) {
e.loaded = !0, e.alerts.load = {
type: "error",
message: "The route details could not be loaded.",
details: t("getErrorDetails")(n)
};
}), u.push(o.watch(c, a, function(t) {
e.services = t.by("metadata.name");
})), e.$on("$destroy", function() {
o.unwatchAll(u);
});
}));
} ]), angular.module("openshiftConsole").controller("StorageController", [ "$filter", "$routeParams", "$scope", "APIService", "AlertMessageService", "DataService", "LabelFilter", "Logger", "ProjectsService", "QuotaService", function(e, t, n, r, a, o, i, s, c, l) {
n.projectName = t.project, n.pvcs = {}, n.unfilteredPVCs = {}, n.labelSuggestions = {}, n.alerts = n.alerts || {}, n.outOfClaims = !1, n.clearFilter = function() {
i.clear();
};
var u = function() {
var e = a.isAlertPermanentlyHidden("storage-quota-limit-reached", n.projectName);
if (n.outOfClaims = l.isAnyStorageQuotaExceeded(n.quotas, n.clusterQuotas), !e && n.outOfClaims) {
if (n.alerts.quotaExceeded) return;
n.alerts.quotaExceeded = {
type: "warning",
message: "Storage quota limit has been reached. You will not be able to create any new storage.",
links: [ {
href: "project/" + n.projectName + "/quota",
label: "View Quota"
}, {
href: "",
label: "Don't Show Me Again",
onClick: function() {
return a.permanentlyHideAlert("storage-quota-limit-reached", n.projectName), !0;
}
} ]
};
} else delete n.alerts.quotaExceeded;
}, d = r.getPreferredVersion("resourcequotas"), m = r.getPreferredVersion("appliedclusterresourcequotas");
n.persistentVolumeClaimsVersion = r.getPreferredVersion("persistentvolumeclaims");
var p = [];
c.get(t.project).then(_.spread(function(e, t) {
function r() {
n.filterWithZeroResults = !i.getLabelSelector().isEmpty() && $.isEmptyObject(n.pvcs) && !$.isEmptyObject(n.unfilteredPVCs);
}
n.project = e, p.push(o.watch(n.persistentVolumeClaimsVersion, t, function(e) {
n.pvcsLoaded = !0, n.unfilteredPVCs = e.by("metadata.name"), i.addLabelSuggestionsFromResources(n.unfilteredPVCs, n.labelSuggestions), i.setLabelSuggestions(n.labelSuggestions), n.pvcs = i.getLabelSelector().select(n.unfilteredPVCs), r(), s.log("pvcs (subscribe)", n.unfilteredPVCs);
})), i.onActiveFiltersChanged(function(e) {
n.$evalAsync(function() {
n.pvcs = e.select(n.unfilteredPVCs), r();
});
}), n.$on("$destroy", function() {
o.unwatchAll(p);
}), o.list(d, {
namespace: n.projectName
}, function(e) {
n.quotas = e.by("metadata.name"), u();
}), o.list(m, {
namespace: n.projectName
}, function(e) {
n.clusterQuotas = e.by("metadata.name"), u();
});
}));
} ]), angular.module("openshiftConsole").controller("OtherResourcesController", [ "$routeParams", "$location", "$scope", "AuthorizationService", "DataService", "ProjectsService", "$filter", "LabelFilter", "Logger", "APIService", function(e, t, n, r, a, o, i, s, c, l) {
function u() {
n.filterWithZeroResults = !s.getLabelSelector().isEmpty() && _.isEmpty(n.resources) && !_.isEmpty(n.unfilteredResources);
}
function d() {
var e = n.kindSelector.selected;
if (e) {
var r = t.search();
r.kind = e.kind, r.group = e.group || "", t.replace().search(r), n.selectedResource = {
resource: l.kindToResource(e.kind),
group: e.group || ""
}, a.list({
group: e.group,
resource: l.kindToResource(e.kind)
}, n.context).then(function(t) {
n.unfilteredResources = t.by("metadata.name"), n.labelSuggestions = {}, s.addLabelSuggestionsFromResources(n.unfilteredResources, n.labelSuggestions), s.setLabelSuggestions(n.labelSuggestions), n.resources = s.getLabelSelector().select(n.unfilteredResources), n.resourceName = l.kindToResource(e.kind, !0), u();
});
}
}
n.projectName = e.project, n.labelSuggestions = {}, n.kindSelector = {
disabled: !0
}, n.kinds = _.filter(l.availableKinds(), function(e) {
switch (e.kind) {
case "AppliedClusterResourceQuota":
case "Build":
case "BuildConfig":
case "ConfigMap":
case "Deployment":
case "DeploymentConfig":
case "Event":
case "ImageStream":
case "ImageStreamImage":
case "ImageStreamImport":
case "ImageStreamMapping":
case "ImageStreamTag":
case "LimitRange":
case "PersistentVolumeClaim":
case "Pod":
case "ReplicaSet":
case "ReplicationController":
case "ResourceQuota":
case "Route":
case "Secret":
case "Service":
case "ServiceInstance":
case "StatefulSet":
return !1;

default:
return !0;
}
}), n.clearFilter = function() {
s.clear();
};
var m = function(e) {
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
var p;
n.isDuplicateKind = function(e) {
return p || (p = _.countBy(n.kinds, "kind")), p[e] > 1;
};
var f = function(e, t) {
return _.some(n.kinds, function(n) {
return n.kind === e && (!n.group && !t || n.group === t);
});
};
o.get(e.project).then(_.spread(function(t, a) {
n.kinds = _.filter(n.kinds, function(e) {
var t = {
resource: l.kindToResource(e.kind),
group: e.group || ""
};
return !!m(e) && (!!r.checkResource(t.resource) && r.canI(t, "list", n.projectName));
}), n.project = t, n.context = a, n.kindSelector.disabled = !1, e.kind && f(e.kind, e.group) && (_.set(n, "kindSelector.selected.kind", e.kind), _.set(n, "kindSelector.selected.group", e.group || ""));
})), n.loadKind = d, n.$watch("kindSelector.selected", function() {
s.clear(), d();
});
var g = i("humanizeKind");
n.matchKind = function(e, t) {
return -1 !== g(e).toLowerCase().indexOf(t.toLowerCase());
}, s.onActiveFiltersChanged(function(e) {
n.$evalAsync(function() {
n.resources = e.select(n.unfilteredResources), u();
});
});
} ]), angular.module("openshiftConsole").controller("PersistentVolumeClaimController", [ "$filter", "$scope", "$routeParams", "APIService", "DataService", "ProjectsService", function(e, t, n, r, a, o) {
t.projectName = n.project, t.pvc = null, t.alerts = {}, t.renderOptions = t.renderOptions || {}, t.renderOptions.hideFilterWidget = !0, t.breadcrumbs = [ {
title: "Storage",
link: "project/" + n.project + "/browse/storage"
}, {
title: n.pvc
} ], t.pvcVersion = r.getPreferredVersion("persistentvolumeclaims"), t.eventsVersion = r.getPreferredVersion("events");
var i = [], s = function(e, n) {
t.pvc = e, t.loaded = !0, "DELETED" === n && (t.alerts.deleted = {
type: "warning",
message: "This persistent volume claim has been deleted."
});
};
o.get(n.project).then(_.spread(function(r, o) {
t.project = r, t.projectContext = o, a.get(t.pvcVersion, n.pvc, o, {
errorNotification: !1
}).then(function(e) {
s(e), i.push(a.watchObject(t.pvcVersion, n.pvc, o, s));
}, function(n) {
t.loaded = !0, t.alerts.load = {
type: "error",
message: "The persistent volume claim details could not be loaded.",
details: e("getErrorDetails")(n)
};
}), t.$on("$destroy", function() {
a.unwatchAll(i);
});
}));
} ]), angular.module("openshiftConsole").controller("SetLimitsController", [ "$filter", "$location", "$parse", "$routeParams", "$scope", "APIService", "AuthorizationService", "BreadcrumbsService", "DataService", "LimitRangesService", "Navigate", "NotificationsService", "ProjectsService", function(e, t, n, r, a, o, i, s, c, l, u, d, m) {
if (r.kind && r.name) {
var p = [ "Deployment", "DeploymentConfig", "ReplicaSet", "ReplicationController" ];
if (_.includes(p, r.kind)) {
var f = e("humanizeKind"), g = f(r.kind, !0) + " " + r.name;
a.name = r.name, "ReplicationController" !== r.kind && "ReplicaSet" !== r.kind || (a.showPodWarning = !0), a.renderOptions = {
hideFilterWidget: !0
}, a.breadcrumbs = s.getBreadcrumbs({
name: r.name,
kind: r.kind,
namespace: r.project,
subpage: "Edit Resource Limits"
});
var v = e("getErrorDetails"), h = function(e, t) {
d.addNotification({
id: "set-compute-limits-error",
type: "error",
message: e,
details: t
});
}, y = function() {
t.url(a.resourceURL);
}, b = function() {
d.hideNotification("set-compute-limits-error");
};
a.cancel = y, a.$on("$destroy", b);
var S = o.getPreferredVersion("limitranges");
m.get(r.project).then(_.spread(function(e, t) {
a.hideCPU = l.hasClusterResourceOverrides(e);
var n = {
resource: o.kindToResource(r.kind),
group: r.group
};
if (i.canI(n, "update", r.project)) {
c.get(n, a.name, t).then(function(r) {
var o = a.object = angular.copy(r);
a.breadcrumbs = s.getBreadcrumbs({
object: o,
project: e,
subpage: "Edit Resource Limits"
}), a.resourceURL = u.resourceURL(o), a.containers = _.get(o, "spec.template.spec.containers"), a.save = function() {
a.disableInputs = !0, b(), c.update(n, a.name, o, t).then(function() {
d.addNotification({
type: "success",
message: g + " was updated."
}), y();
}, function(e) {
a.disableInputs = !1, h(g + " could not be updated.", v(e));
});
};
}, function(e) {
h(g + " could not be loaded.", v(e));
});
var m = function() {
a.hideCPU || (a.cpuProblems = l.validatePodLimits(a.limitRanges, "cpu", a.containers, e)), a.memoryProblems = l.validatePodLimits(a.limitRanges, "memory", a.containers, e);
};
c.list(S, t).then(function(e) {
a.limitRanges = e.by("metadata.name"), _.isEmpty(a.limitRanges) || a.$watch("containers", m, !0);
});
} else u.toErrorPage("You do not have authority to update " + f(r.kind) + " " + r.name + ".", "access_denied");
}));
} else u.toErrorPage("Health checks are not supported for kind " + r.kind + ".");
} else u.toErrorPage("Kind or name parameter missing.");
} ]), angular.module("openshiftConsole").controller("EditBuildConfigController", [ "$scope", "$filter", "$location", "$routeParams", "$window", "APIService", "AuthorizationService", "DataService", "Navigate", "NotificationsService", "ProjectsService", "SOURCE_URL_PATTERN", "SecretsService", "keyValueEditorUtils", function(e, t, n, r, a, o, i, s, c, l, u, d, m, p) {
e.projectName = r.project, e.buildConfig = null, e.alerts = {}, e.sourceURLPattern = d, e.options = {}, e.jenkinsfileOptions = {
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
}, e.breadcrumbs = [], r.isPipeline ? (e.breadcrumbs.push({
title: "Pipelines",
link: "project/" + r.project + "/browse/pipelines"
}), e.breadcrumbs.push({
title: r.buildconfig,
link: "project/" + r.project + "/browse/pipelines/" + r.buildconfig
})) : (e.breadcrumbs.push({
title: "Builds",
link: "project/" + r.project + "/browse/builds"
}), e.breadcrumbs.push({
title: r.buildconfig,
link: "project/" + r.project + "/browse/builds/" + r.buildconfig
})), e.breadcrumbs.push({
title: r.isPipeline ? "Edit Pipelines" : "Edit Builds"
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
webhookTriggers: [],
imageChangeTriggers: [],
builderImageChangeTrigger: {},
configChangeTrigger: {}
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
var t = !_.isEmpty(_.get(e, "buildConfig.spec.postCommit.args")), n = !_.isEmpty(_.get(e, "buildConfig.spec.postCommit.command")), r = !!_.get(e, "buildConfig.spec.postCommit.script");
e.view.hasHooks = t || n || r;
var a;
a = t && n ? "commandArgs" : t && r ? "scriptArgs" : t ? "args" : r ? "script" : "command", e.buildHookSelection.type = _.find(e.buildHookTypes, {
id: a
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
var v = o.getPreferredVersion("buildconfigs"), h = o.getPreferredVersion("secrets"), y = [], b = t("buildStrategy"), S = t("orderByDisplayName"), C = t("getErrorDetails"), w = [], P = [];
e.valueFromObjects = [];
var j = function() {
var t;
e.buildConfig ? (t = c.resourceURL(e.buildConfig), n.path(t)) : a.history.back();
};
e.cancel = j;
var k = function() {
l.hideNotification("edit-build-config-error"), l.hideNotification("edit-build-config-conflict"), l.hideNotification("edit-build-config-deleted");
};
e.$on("$destroy", k), u.get(r.project).then(_.spread(function(n, a) {
e.project = n, e.context = a, i.canI("buildconfigs", "update", r.project) ? (s.get(v, r.buildconfig, a, {
errorNotification: !1
}).then(function(t) {
e.buildConfig = t, f(), e.updatedBuildConfig = angular.copy(e.buildConfig), e.buildStrategy = b(e.updatedBuildConfig), e.strategyType = e.buildConfig.spec.strategy.type, e.envVars = e.buildStrategy.env || [], e.triggers = I(e.triggers, e.buildConfig.spec.triggers), e.sources = B(e.sources, e.buildConfig.spec.source), _.has(t, "spec.strategy.jenkinsPipelineStrategy.jenkinsfile") && (e.jenkinsfileOptions.type = "inline"), i.canI(h, "list", r.project) && s.list(h, a).then(function(t) {
var n = m.groupSecretsByType(t), r = _.mapValues(n, function(e) {
return _.map(e, "metadata.name");
});
e.webhookSecrets = m.groupSecretsByType(t).webhook, e.webhookSecrets.unshift(""), e.secrets.secretsByType = _.each(r, function(e) {
e.unshift("");
}), D(), P = S(t.by("metadata.name")), e.valueFromObjects = w.concat(P);
});
var n = function(e, n) {
e.type = n && n.kind ? n.kind : "None";
var r = {}, a = "", o = "";
r = "ImageStreamTag" === e.type ? {
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
}, a = "ImageStreamImage" === e.type ? (n.namespace || t.metadata.namespace) + "/" + n.name : "", o = "DockerImage" === e.type ? n.name : "", e.imageStreamTag = r, e.imageStreamImage = a, e.dockerImage = o;
};
n(e.imageOptions.from, e.buildStrategy.from), n(e.imageOptions.to, e.updatedBuildConfig.spec.output.to), e.sources.images && (e.sourceImages = e.buildConfig.spec.source.images, 1 === _.size(e.sourceImages) ? (e.imageSourceTypes = angular.copy(e.buildFromTypes), n(e.imageOptions.fromSource, e.sourceImages[0].from), e.imageSourcePaths = _.map(e.sourceImages[0].paths, function(e) {
return {
name: e.sourcePath,
value: e.destinationDir
};
})) : (e.imageSourceFromObjects = [], e.sourceImages.forEach(function(t) {
e.imageSourceFromObjects.push(t.from);
}))), e.options.forcePull = !!e.buildStrategy.forcePull, "Docker" === e.strategyType && (e.options.noCache = !!e.buildConfig.spec.strategy.dockerStrategy.noCache, e.buildFromTypes.push("None")), y.push(s.watchObject(v, r.buildconfig, a, function(t, n) {
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
}), s.list("configmaps", a, null, {
errorNotification: !1
}).then(function(t) {
w = S(t.by("metadata.name")), e.valueFromObjects = w.concat(P);
}, function(e) {
403 !== e.code && l.addNotification({
id: "edit-build-config-list-config-maps-error",
type: "error",
message: "Could not load config maps.",
details: C(e)
});
})) : c.toErrorPage("You do not have authority to update build config " + r.buildconfig + ".", "access_denied");
}));
var I = function(n, r) {
function a(n, r) {
return t("imageObjectRef")(n, e.projectName) === t("imageObjectRef")(r, e.projectName);
}
var o = b(e.buildConfig).from;
return r.forEach(function(e) {
switch (e.type) {
case "Generic":
case "GitHub":
case "GitLab":
case "Bitbucket":
n.webhookTriggers.push({
lastTriggerType: e.type,
data: e
});
break;

case "ImageChange":
var t = e.imageChange.from;
t || (t = o);
var r = {
present: !0,
data: e
};
a(t, o) ? n.builderImageChangeTrigger = r : n.imageChangeTriggers.push(r);
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
var R = function(e) {
return _.map(p.compactEntries(e), function(e) {
return {
sourcePath: e.name,
destinationDir: e.value
};
});
}, T = function(t) {
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
var r = t.imageStreamImage.split("/");
(n = {
kind: t.type,
name: _.last(r)
}).namespace = 1 !== _.size(r) ? _.head(r) : e.buildConfig.metadata.namespace;
}
return n;
}, E = function(e) {
return _.filter(e, function(e) {
return !_.isEmpty(e.data.type) && !_.isEmpty(e.data[_.toLower(e.data.type)]);
});
}, N = function() {
var t = [].concat(e.triggers.imageChangeTriggers, e.triggers.builderImageChangeTrigger, e.triggers.configChangeTrigger);
return t = _.filter(t, function(e) {
return _.has(e, "disabled") && !e.disabled || e.present;
}), t = t.concat(E(e.triggers.webhookTriggers)), t = _.map(t, "data");
}, D = function() {
switch (e.secrets.picked = {
gitSecret: e.buildConfig.spec.source.sourceSecret ? [ e.buildConfig.spec.source.sourceSecret ] : [ {
name: ""
} ],
pullSecret: b(e.buildConfig).pullSecret ? [ b(e.buildConfig).pullSecret ] : [ {
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
e.secrets.picked.sourceSecrets = b(e.buildConfig).secrets || [ {
secretSource: {
name: ""
},
mountPath: ""
} ];
}
}, A = function(e, t, n) {
t.name ? e[n] = t : delete e[n];
}, $ = function(t, n) {
var r = "Custom" === e.strategyType ? "secretSource" : "secret", a = _.filter(n, function(e) {
return e[r].name;
});
_.isEmpty(a) ? delete t.secrets : t.secrets = a;
}, B = function(e, t) {
return "None" === t.type ? e : (e.none = !1, angular.forEach(t, function(t, n) {
e[n] = !0;
}), e);
};
e.save = function() {
switch (e.disableInputs = !0, g(), b(e.updatedBuildConfig).forcePull = e.options.forcePull, e.strategyType) {
case "Docker":
b(e.updatedBuildConfig).noCache = e.options.noCache;
break;

case "JenkinsPipeline":
"path" === e.jenkinsfileOptions.type ? delete e.updatedBuildConfig.spec.strategy.jenkinsPipelineStrategy.jenkinsfile : delete e.updatedBuildConfig.spec.strategy.jenkinsPipelineStrategy.jenkinsfilePath;
}
switch (e.sources.images && !_.isEmpty(e.sourceImages) && (e.updatedBuildConfig.spec.source.images[0].paths = R(e.imageSourcePaths), e.updatedBuildConfig.spec.source.images[0].from = T(e.imageOptions.fromSource)), "None" === e.imageOptions.from.type ? delete b(e.updatedBuildConfig).from : b(e.updatedBuildConfig).from = T(e.imageOptions.from), "None" === e.imageOptions.to.type ? delete e.updatedBuildConfig.spec.output.to : e.updatedBuildConfig.spec.output.to = T(e.imageOptions.to), b(e.updatedBuildConfig).env = p.compactEntries(e.envVars), A(e.updatedBuildConfig.spec.source, _.head(e.secrets.picked.gitSecret), "sourceSecret"), A(b(e.updatedBuildConfig), _.head(e.secrets.picked.pullSecret), "pullSecret"), A(e.updatedBuildConfig.spec.output, _.head(e.secrets.picked.pushSecret), "pushSecret"), e.strategyType) {
case "Source":
case "Docker":
$(e.updatedBuildConfig.spec.source, e.secrets.picked.sourceSecrets);
break;

case "Custom":
$(b(e.updatedBuildConfig), e.secrets.picked.sourceSecrets);
}
e.updatedBuildConfig.spec.triggers = N(), k(), s.update(v, e.updatedBuildConfig.metadata.name, e.updatedBuildConfig, e.context).then(function() {
l.addNotification({
type: "success",
message: "Build config " + e.updatedBuildConfig.metadata.name + " was successfully updated."
}), j();
}, function(n) {
e.disableInputs = !1, l.addNotification({
id: "edit-build-config-error",
type: "error",
message: "An error occurred updating build config " + e.updatedBuildConfig.metadata.name + ".",
details: t("getErrorDetails")(n)
});
});
}, e.$on("$destroy", function() {
s.unwatchAll(y);
});
} ]), angular.module("openshiftConsole").controller("EditConfigMapController", [ "$filter", "$routeParams", "$scope", "$window", "APIService", "DataService", "BreadcrumbsService", "Navigate", "NotificationsService", "ProjectsService", function(e, t, n, r, a, o, i, s, c, l) {
var u = [];
n.forms = {}, n.projectName = t.project, n.breadcrumbs = i.getBreadcrumbs({
name: t.configMap,
kind: "ConfigMap",
namespace: t.project,
subpage: "Edit Config Map"
});
var d = function(e) {
return _.get(e, "metadata.resourceVersion");
}, m = function() {
c.hideNotification("edit-config-map-error");
}, p = function() {
r.history.back();
};
n.cancel = p;
var f = a.getPreferredVersion("configmaps");
l.get(t.project).then(_.spread(function(r, a) {
o.get(f, t.configMap, a, {
errorNotification: !1
}).then(function(e) {
n.loaded = !0, n.breadcrumbs = i.getBreadcrumbs({
name: t.configMap,
object: e,
project: r,
subpage: "Edit Config Map"
}), n.configMap = e, u.push(o.watchObject(f, t.configMap, a, function(e, t) {
n.resourceChanged = d(e) !== d(n.configMap), n.resourceDeleted = "DELETED" === t;
}));
}, function(n) {
s.toErrorPage("Could not load config map " + t.configMap + ". " + e("getErrorDetails")(n));
}), n.updateConfigMap = function() {
n.forms.editConfigMapForm.$valid && (m(), n.disableInputs = !0, o.update(f, n.configMap.metadata.name, n.configMap, a).then(function() {
c.addNotification({
type: "success",
message: "Config map " + n.configMap.metadata.name + " successfully updated."
}), p();
}, function(t) {
n.disableInputs = !1, c.addNotification({
id: "edit-config-map-error",
type: "error",
message: "An error occurred updating the config map.",
details: e("getErrorDetails")(t)
});
}));
}, n.$on("$destroy", function() {
o.unwatchAll(u), m();
});
}));
} ]), angular.module("openshiftConsole").controller("EditDeploymentConfigController", [ "$scope", "$filter", "$location", "$routeParams", "$uibModal", "$window", "APIService", "AuthorizationService", "BreadcrumbsService", "DataService", "EnvironmentService", "Navigate", "NotificationsService", "ProjectsService", "SecretsService", "keyValueEditorUtils", function(e, t, n, r, a, o, i, s, c, l, u, d, m, p, f, g) {
e.projectName = r.project, e.deploymentConfig = null, e.alerts = {}, e.view = {
advancedStrategyOptions: !1,
advancedImageOptions: !1
}, e.triggers = {}, e.breadcrumbs = c.getBreadcrumbs({
name: r.name,
kind: r.kind,
namespace: r.project,
subpage: "Edit Deployment Config"
}), e.deploymentConfigStrategyTypes = [ "Recreate", "Rolling", "Custom" ];
var v = t("orderByDisplayName"), h = t("getErrorDetails"), y = function(t, n) {
e.alerts["from-value-objects"] = {
type: "error",
message: t,
details: n
};
}, b = i.getPreferredVersion("deploymentconfigs"), S = i.getPreferredVersion("configmaps"), C = i.getPreferredVersion("secrets"), w = [], P = [], j = [];
e.valueFromObjects = [];
var k = function(e) {
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
p.get(r.project).then(_.spread(function(n, a) {
e.project = n, e.context = a, s.canI("deploymentconfigs", "update", r.project) ? l.get(b, r.deploymentconfig, a, {
errorNotification: !1
}).then(function(t) {
e.deploymentConfig = t, e.breadcrumbs = c.getBreadcrumbs({
object: t,
project: n,
subpage: "Edit"
});
e.updatedDeploymentConfig = angular.copy(e.deploymentConfig), e.containerNames = _.map(e.deploymentConfig.spec.template.spec.containers, "name"), e.containerConfigByName = function(t, n) {
var r = {}, a = _.filter(n, {
type: "ImageChange"
});
return _.each(t, function(t) {
var n = _.find(a, function(e) {
return _.includes(e.imageChangeParams.containerNames, t.name);
}), o = {};
if (t.env = t.env || [], r[t.name] = {
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
_.set(r, [ t.name, "triggerData" ], o);
}), r;
}(e.updatedDeploymentConfig.spec.template.spec.containers, e.updatedDeploymentConfig.spec.triggers), e.secrets = {
pullSecrets: angular.copy(e.deploymentConfig.spec.template.spec.imagePullSecrets) || [ {
name: ""
} ]
}, e.volumeNames = _.map(e.deploymentConfig.spec.template.spec.volumes, "name"), e.strategyData = angular.copy(e.deploymentConfig.spec.strategy), e.originalStrategy = e.strategyData.type, e.strategyParamsPropertyName = k(e.strategyData.type), e.triggers.hasConfigTrigger = _.some(e.updatedDeploymentConfig.spec.triggers, {
type: "ConfigChange"
}), "Custom" !== e.strategyData.type || _.has(e.strategyData, "customParams.environment") || (e.strategyData.customParams.environment = []), l.list(S, a, null, {
errorNotification: !1
}).then(function(t) {
P = v(t.by("metadata.name")), e.availableConfigMaps = P, e.valueFromObjects = P.concat(j);
}, function(e) {
403 !== e.status && y("Could not load config maps", h(e));
}), l.list(C, a, null, {
errorNotification: !1
}).then(function(t) {
j = v(t.by("metadata.name")), e.availableSecrets = j, e.valueFromObjects = P.concat(j);
var n = f.groupSecretsByType(t), r = _.mapValues(n, function(e) {
return _.map(e, "metadata.name");
});
e.secretsByType = _.each(r, function(e) {
e.unshift("");
});
}, function(e) {
403 !== e.status && y("Could not load secrets", h(e));
}), w.push(l.watchObject(b, r.deploymentconfig, a, function(t, n) {
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
}) : d.toErrorPage("You do not have authority to update deployment config " + r.deploymentconfig + ".", "access_denied");
}));
var I = function() {
return "Custom" !== e.strategyData.type && "Custom" !== e.originalStrategy && e.strategyData.type !== e.originalStrategy;
}, R = function(t) {
_.has(e.strategyData, t) || a.open({
templateUrl: "views/modals/confirm.html",
controller: "ConfirmModalController",
resolve: {
modalConfig: function() {
return {
alerts: e.alerts,
title: "Keep some existing " + e.originalStrategy.toLowerCase() + " strategy parameters?",
details: "The timeout parameter and any pre or post lifecycle hooks will be copied from " + e.originalStrategy.toLowerCase() + " strategy to " + e.strategyData.type.toLowerCase() + " strategy. After saving the changes, " + e.originalStrategy.toLowerCase() + " strategy parameters will be removed.",
okButtonText: "Yes",
okButtonClass: "btn-primary",
cancelButtonText: "No"
};
}
}
}).result.then(function() {
e.strategyData[t] = angular.copy(e.strategyData[k(e.originalStrategy)]);
}, function() {
e.strategyData[t] = {};
});
};
e.strategyChanged = function() {
var t = k(e.strategyData.type);
I() ? R(t) : _.has(e.strategyData, t) || ("Custom" !== e.strategyData.type ? e.strategyData[t] = {} : e.strategyData[t] = {
image: "",
command: [],
environment: []
}), e.strategyParamsPropertyName = t;
};
var T = function(e, t, n, r) {
var a = {
kind: "ImageStreamTag",
namespace: t.namespace,
name: t.imageStream + ":" + t.tagObject.tag
};
return n ? (n.imageChangeParams.from = a, n.imageChangeParams.automatic = r) : n = {
type: "ImageChange",
imageChangeParams: {
automatic: r,
containerNames: [ e ],
from: a
}
}, n;
}, E = function() {
var t = _.reject(e.updatedDeploymentConfig.spec.triggers, function(e) {
return "ImageChange" === e.type || "ConfigChange" === e.type;
});
return _.each(e.containerConfigByName, function(n, r) {
n.hasDeploymentTrigger ? t.push(T(r, n.triggerData.istag, n.triggerData.data, n.triggerData.automatic)) : _.find(e.updatedDeploymentConfig.spec.template.spec.containers, {
name: r
}).image = n.image;
}), e.triggers.hasConfigTrigger && t.push({
type: "ConfigChange"
}), t;
}, N = function() {
m.hideNotification("edit-deployment-config-error");
};
e.save = function() {
if (e.disableInputs = !0, _.each(e.containerConfigByName, function(t, n) {
_.find(e.updatedDeploymentConfig.spec.template.spec.containers, {
name: n
}).env = g.compactEntries(t.env);
}), I() && delete e.strategyData[k(e.originalStrategy)], "Rolling" === e.strategyData.type) {
var r = e.strategyData[e.strategyParamsPropertyName].maxSurge, a = Number(r);
"" === r ? e.strategyData[e.strategyParamsPropertyName].maxSurge = null : _.isFinite(a) && (e.strategyData[e.strategyParamsPropertyName].maxSurge = a);
var o = e.strategyData[e.strategyParamsPropertyName].maxUnavailable, i = Number(o);
"" === o ? e.strategyData[e.strategyParamsPropertyName].maxUnavailable = null : _.isFinite(i) && (e.strategyData[e.strategyParamsPropertyName].maxUnavailable = i);
}
"Custom" !== e.strategyData.type && _.each([ "pre", "mid", "post" ], function(t) {
_.has(e.strategyData, [ e.strategyParamsPropertyName, t, "execNewPod", "env" ]) && (e.strategyData[e.strategyParamsPropertyName][t].execNewPod.env = g.compactEntries(e.strategyData[e.strategyParamsPropertyName][t].execNewPod.env));
}), _.has(e, "strategyData.customParams.environment") && (e.strategyData.customParams.environment = g.compactEntries(e.strategyData.customParams.environment)), e.updatedDeploymentConfig.spec.template.spec.imagePullSecrets = _.filter(e.secrets.pullSecrets, "name"), e.updatedDeploymentConfig.spec.strategy = e.strategyData, e.updatedDeploymentConfig.spec.triggers = E(), N(), l.update(b, e.updatedDeploymentConfig.metadata.name, e.updatedDeploymentConfig, e.context).then(function() {
m.addNotification({
type: "success",
message: "Deployment config " + e.updatedDeploymentConfig.metadata.name + " was successfully updated."
});
var t = d.resourceURL(e.updatedDeploymentConfig);
n.url(t);
}, function(n) {
e.disableInputs = !1, m.addNotification({
id: "edit-deployment-config-error",
type: "error",
message: "An error occurred updating deployment config " + e.updatedDeploymentConfig.metadata.name + ".",
details: t("getErrorDetails")(n)
});
});
}, e.cancel = function() {
o.history.back();
}, e.$on("$destroy", function() {
l.unwatchAll(w), N();
});
} ]), angular.module("openshiftConsole").controller("EditAutoscalerController", [ "$scope", "$filter", "$routeParams", "$window", "APIService", "AuthorizationService", "BreadcrumbsService", "DataService", "HPAService", "MetricsService", "Navigate", "NotificationsService", "ProjectsService", "keyValueEditorUtils", function(e, t, n, r, a, o, i, s, c, l, u, d, m, p) {
if (n.kind && n.name) {
var f = [ "Deployment", "DeploymentConfig", "HorizontalPodAutoscaler", "ReplicaSet", "ReplicationController" ];
if (_.includes(f, n.kind)) {
e.kind = n.kind, e.name = n.name, "HorizontalPodAutoscaler" === n.kind ? e.disableInputs = !0 : (e.targetKind = n.kind, e.targetName = n.name), e.autoscaling = {
name: e.name
}, e.labels = [], l.isAvailable().then(function(t) {
e.metricsWarning = !t;
});
var g = t("getErrorDetails"), v = function() {
r.history.back();
};
e.cancel = v;
var h = function() {
d.hideNotification("edit-hpa-error");
};
e.$on("$destroy", h);
var y = a.getPreferredVersion("horizontalpodautoscalers"), b = a.getPreferredVersion("limitranges");
m.get(n.project).then(_.spread(function(t, r) {
e.project = t;
var l = "HorizontalPodAutoscaler" === n.kind ? "update" : "create";
if (o.canI({
resource: "horizontalpodautoscalers",
group: "autoscaling"
}, l, n.project)) {
var m = function(t) {
e.disableInputs = !0, (t = angular.copy(t)).metadata.labels = p.mapEntries(p.compactEntries(e.labels)), t.spec.minReplicas = e.autoscaling.minReplicas, t.spec.maxReplicas = e.autoscaling.maxReplicas, t.spec.targetCPUUtilizationPercentage = e.autoscaling.targetCPU, s.update(y, t.metadata.name, t, r).then(function(e) {
d.addNotification({
type: "success",
message: "Horizontal pod autoscaler " + e.metadata.name + " successfully updated."
}), v();
}, function(t) {
e.disableInputs = !1, d.addNotification({
id: "edit-hpa-error",
type: "error",
message: "An error occurred creating the horizontal pod autoscaler.",
details: g(t)
});
});
}, f = {};
f = "HorizontalPodAutoscaler" === n.kind ? {
resource: "horizontalpodautoscalers",
group: "autoscaling",
version: "v1"
} : {
resource: a.kindToResource(n.kind),
group: n.group
}, s.get(f, n.name, r).then(function(a) {
if (e.labels = _.map(_.get(a, "metadata.labels", {}), function(e, t) {
return {
name: t,
value: e
};
}), e.usesV2Metrics = c.usesV2Metrics(a), "HorizontalPodAutoscaler" === n.kind) e.targetKind = _.get(a, "spec.scaleTargetRef.kind"), e.targetName = _.get(a, "spec.scaleTargetRef.name"), _.assign(e.autoscaling, {
minReplicas: _.get(a, "spec.minReplicas"),
maxReplicas: _.get(a, "spec.maxReplicas"),
targetCPU: _.get(a, "spec.targetCPUUtilizationPercentage")
}), e.disableInputs = !1, e.save = function() {
m(a);
}, e.breadcrumbs = i.getBreadcrumbs({
name: e.targetName,
kind: e.targetKind,
namespace: n.project,
project: t,
subpage: "Autoscale"
}); else {
e.breadcrumbs = i.getBreadcrumbs({
object: a,
project: t,
subpage: "Autoscale"
}), e.save = function() {
e.disableInputs = !0, h();
var t = {
apiVersion: "autoscaling/v1",
kind: "HorizontalPodAutoscaler",
metadata: {
name: e.autoscaling.name,
labels: p.mapEntries(p.compactEntries(e.labels))
},
spec: {
scaleTargetRef: {
kind: a.kind,
name: a.metadata.name,
apiVersion: a.apiVersion
},
minReplicas: e.autoscaling.minReplicas,
maxReplicas: e.autoscaling.maxReplicas,
targetCPUUtilizationPercentage: e.autoscaling.targetCPU
}
};
s.create(y, null, t, r).then(function(e) {
d.addNotification({
type: "success",
message: "Horizontal pod autoscaler " + e.metadata.name + " successfully created."
}), v();
}, function(t) {
e.disableInputs = !1, d.addNotification({
id: "edit-hpa-error",
type: "error",
message: "An error occurred creating the horizontal pod autoscaler.",
details: g(t)
});
});
};
var o = {}, l = function() {
var n = _.get(a, "spec.template.spec.containers", []);
e.showCPURequestWarning = !c.hasCPURequest(n, o, t);
};
s.list(b, r).then(function(e) {
o = e.by("metadata.name"), l();
});
}
});
} else u.toErrorPage("You do not have authority to " + l + " horizontal pod autoscalers in project " + n.project + ".", "access_denied");
}));
} else u.toErrorPage("Autoscaling not supported for kind " + n.kind + ".");
} else u.toErrorPage("Kind or name parameter missing.");
} ]), angular.module("openshiftConsole").controller("EditHealthChecksController", [ "$filter", "$location", "$routeParams", "$scope", "AuthorizationService", "BreadcrumbsService", "APIService", "DataService", "Navigate", "NotificationsService", "ProjectsService", function(e, t, n, r, a, o, i, s, c, l, u) {
if (n.kind && n.name) {
var d = [ "Deployment", "DeploymentConfig", "ReplicaSet", "ReplicationController" ];
if (_.includes(d, n.kind)) {
r.name = n.name, r.resourceURL = c.resourceURL(r.name, n.kind, n.project), r.breadcrumbs = o.getBreadcrumbs({
name: n.name,
kind: n.kind,
namespace: n.project,
subpage: "Edit Health Checks"
}), r.previousProbes = {};
var m = e("getErrorDetails"), p = e("upperFirst"), f = function(e, t) {
l.addNotification({
id: "add-health-check-error",
type: "error",
message: e,
details: t
});
}, g = function() {
t.url(r.resourceURL);
};
r.cancel = g;
var v = function() {
l.hideNotification("add-health-check-error");
};
r.$on("$destroy", v), u.get(n.project).then(_.spread(function(t, u) {
var d = e("humanizeKind")(n.kind) + ' "' + r.name + '"', h = {
resource: i.kindToResource(n.kind),
group: n.group
};
a.canI(h, "update", n.project) ? s.get(h, r.name, u).then(function(e) {
var a = r.object = angular.copy(e);
r.breadcrumbs = o.getBreadcrumbs({
object: a,
project: t,
subpage: "Edit Health Checks"
}), r.containers = _.get(a, "spec.template.spec.containers"), r.addProbe = function(e, t) {
e[t] = _.get(r.previousProbes, [ e.name, t ], {}), r.form.$setDirty();
}, r.removeProbe = function(e, t) {
_.set(r.previousProbes, [ e.name, t ], e[t]), delete e[t], r.form.$setDirty();
}, r.save = function() {
r.disableInputs = !0, v(), s.update(i.kindToResource(n.kind), r.name, a, u).then(function() {
l.addNotification({
type: "success",
message: p(d) + " was updated."
}), g();
}, function(e) {
r.disableInputs = !1, f(p(d) + " could not be updated.", m(e));
});
};
}, function(e) {
f(p(d) + " could not be loaded.", m(e));
}) : c.toErrorPage("You do not have authority to update " + d + ".", "access_denied");
}));
} else c.toErrorPage("Health checks are not supported for kind " + n.kind + ".");
} else c.toErrorPage("Kind or name parameter missing.");
} ]), angular.module("openshiftConsole").controller("EditRouteController", [ "$filter", "$location", "$routeParams", "$scope", "APIService", "AuthorizationService", "DataService", "Navigate", "NotificationsService", "ProjectsService", "RoutesService", function(e, t, n, r, a, o, i, s, c, l, u) {
r.renderOptions = {
hideFilterWidget: !0
}, r.projectName = n.project, r.routeName = n.route, r.loading = !0, r.routeURL = s.resourceURL(r.routeName, "Route", r.projectName), r.breadcrumbs = [ {
title: "Routes",
link: "project/" + r.projectName + "/browse/routes"
}, {
title: r.routeName,
link: r.routeURL
}, {
title: "Edit"
} ];
var d = function() {
c.hideNotification("edit-route-error");
};
r.$on("$destroy", d);
var m = function() {
t.path(r.routeURL);
};
r.cancel = m;
var p, f = a.getPreferredVersion("routes"), g = a.getPreferredVersion("services");
l.get(n.project).then(_.spread(function(t, a) {
if (r.project = t, o.canI("routes", "update", n.project)) {
var l, v = e("orderByDisplayName"), h = function() {
s.toErrorPage('Editing routes with non-service targets is unsupported. You can edit the route with the "Edit YAML" action instead.');
};
i.get(f, r.routeName, a).then(function(e) {
"Service" === e.spec.to.kind ? (l = angular.copy(e), p = _.get(l, "spec.host"), "Subdomain" === _.get(l, "spec.wildcardPolicy") && (p = "*." + u.getSubdomain(l)), r.routing = {
host: p,
wildcardPolicy: _.get(l, "spec.wildcardPolicy"),
path: _.get(l, "spec.path"),
targetPort: _.get(l, "spec.port.targetPort"),
tls: angular.copy(_.get(l, "spec.tls"))
}, i.list(g, a).then(function(e) {
r.loading = !1;
var t = e.by("metadata.name");
r.routing.to = l.spec.to, r.routing.alternateServices = [], _.each(_.get(l, "spec.alternateBackends"), function(e) {
if ("Service" !== e.kind) return h(), !1;
r.routing.alternateServices.push(e);
}), r.services = v(t);
})) : h();
}, function() {
s.toErrorPage("Could not load route " + r.routeName + ".");
});
var y = function() {
var e = angular.copy(l), t = _.get(r, "routing.to.name");
_.set(e, "spec.to.name", t);
var n = _.get(r, "routing.to.weight");
isNaN(n) || _.set(e, "spec.to.weight", n);
var a = r.routing.host;
p !== a && (a.startsWith("*.") && (a = "wildcard" + a.substring(1)), e.spec.host = a), e.spec.path = r.routing.path;
var o = r.routing.targetPort;
o ? _.set(e, "spec.port.targetPort", o) : delete e.spec.port, _.get(r, "routing.tls.termination") ? (e.spec.tls = r.routing.tls, "passthrough" === e.spec.tls.termination && (delete e.spec.path, delete e.spec.tls.certificate, delete e.spec.tls.key, delete e.spec.tls.caCertificate), "reencrypt" !== e.spec.tls.termination && delete e.spec.tls.destinationCACertificate) : delete e.spec.tls;
var i = _.get(r, "routing.alternateServices", []);
return _.isEmpty(i) ? delete e.spec.alternateBackends : e.spec.alternateBackends = _.map(i, function(e) {
return {
kind: "Service",
name: e.name,
weight: e.weight
};
}), e;
};
r.updateRoute = function() {
if (r.form.$valid) {
d(), r.disableInputs = !0;
var t = y();
i.update(f, r.routeName, t, a).then(function() {
c.addNotification({
type: "success",
message: "Route " + r.routeName + " was successfully updated."
}), m();
}, function(t) {
r.disableInputs = !1, c.addNotification({
type: "error",
id: "edit-route-error",
message: "An error occurred updating route " + r.routeName + ".",
details: e("getErrorDetails")(t)
});
});
}
};
} else s.toErrorPage("You do not have authority to update route " + n.routeName + ".", "access_denied");
}));
} ]), angular.module("openshiftConsole").controller("EditYAMLController", [ "$scope", "$filter", "$location", "$routeParams", "$window", "APIService", "AuthorizationService", "BreadcrumbsService", "DataService", "Navigate", "NotificationsService", "ProjectsService", function(e, t, n, r, a, o, i, s, c, l, u, d) {
if (r.kind && r.name) {
var m = t("humanizeKind");
e.alerts = {}, e.name = r.name, e.resourceURL = l.resourceURL(e.name, r.kind, r.project), e.breadcrumbs = [ {
title: r.name,
link: r.returnURL
}, {
title: "Edit YAML"
} ];
var p = function() {
e.modified = !1, r.returnURL ? n.url(r.returnURL) : a.history.back();
}, f = [];
d.get(r.project).then(_.spread(function(n, a) {
var s = {
resource: o.kindToResource(r.kind),
group: r.group
};
i.canI(s, "update", r.project) ? (c.get(s, e.name, a, {
errorNotification: !1
}).then(function(n) {
var i = n;
_.set(e, "updated.resource", angular.copy(n)), e.$watch("updated.resource", function(t, n) {
t !== n && (e.modified = !0);
});
var l = function(e) {
return _.get(e, "metadata.resourceVersion");
};
e.save = function() {
var n = e.updated.resource;
if (e.modified = !1, n.kind === i.kind) {
var a = o.objectToResourceGroupVersion(i), s = o.objectToResourceGroupVersion(n);
s ? s.group === a.group ? o.apiInfo(s) ? (e.updatingNow = !0, c.update(a, i.metadata.name, n, {
namespace: i.metadata.namespace
}).then(function(t) {
var a = _.get(n, "metadata.resourceVersion");
if (_.get(t, "metadata.resourceVersion") === a) return e.alerts["no-changes-applied"] = {
type: "warning",
message: "No changes were applied to " + m(r.kind) + " " + r.name + ".",
details: "Make sure any new fields you may have added are supported API fields."
}, void (e.updatingNow = !1);
u.addNotification({
type: "success",
message: m(r.kind, !0) + " " + r.name + " was successfully updated."
}), p();
}, function(n) {
e.updatingNow = !1, e.error = {
message: t("getErrorDetails")(n)
};
})) : e.error = {
message: o.unsupportedObjectKindOrVersion(n)
} : e.error = {
message: "Cannot change resource group (original: " + (a.group || "<none>") + ", modified: " + (s.group || "<none>") + ")."
} : e.error = {
message: o.invalidObjectKindOrVersion(n)
};
} else e.error = {
message: "Cannot change resource kind (original: " + i.kind + ", modified: " + (n.kind || "<unspecified>") + ")."
};
}, e.cancel = function() {
p();
}, f.push(c.watchObject(s, e.name, a, function(t, n) {
e.resourceChanged = l(t) !== l(i), e.resourceDeleted = "DELETED" === n;
}, {
errorNotification: !1
}));
}, function(e) {
l.toErrorPage("Could not load " + m(r.kind) + " '" + r.name + "'. " + t("getErrorDetails")(e));
}), e.$on("$destroy", function() {
c.unwatchAll(f);
})) : l.toErrorPage("You do not have authority to update " + m(r.kind) + " " + r.name + ".", "access_denied");
}));
} else l.toErrorPage("Kind or name parameter missing.");
} ]), angular.module("openshiftConsole").controller("BrowseCategoryController", [ "$scope", "$filter", "$location", "$q", "$routeParams", "$uibModal", "Constants", "DataService", "LabelFilter", "Navigate", "ProjectsService", function(e, t, n, r, a, o, i, s, c, l, u) {
e.projectName = a.project;
var d = function(t, n) {
var r;
return _.some(t, function(t) {
if (r = _.find(t.items, {
id: n
})) {
e.category = r;
var a = _.get(r, "subcategories", []);
return e.subcategories = [ {
id: "",
label: ""
} ].concat(a), !0;
}
return !1;
}), r;
}, m = i.CATALOG_CATEGORIES, p = "none" === a.category ? "" : a.category;
if (e.category = d(m, p), e.category) {
var f;
!a.subcategory || (e.category, p = "none" === a.subcategory ? "" : a.subcategory, f = _.get(e.category, "subcategories", []), e.category = d(f, p), e.category) ? (e.alerts = e.alerts || {}, u.get(a.project).then(_.spread(function(t, n) {
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
}), "openshift" === a.project ? (e.projectImageStreams = [], e.projectTemplates = []) : (s.list("imagestreams", n).then(function(t) {
e.projectImageStreams = t.by("metadata.name");
}), s.list("templates", n, null, {
partialObjectMetadataList: !0
}).then(function(t) {
e.projectTemplates = t.by("metadata.name");
}));
}))) : l.toErrorPage("Catalog category " + a.category + "/" + a.subcategory + " not found.");
} else l.toErrorPage("Catalog category " + a.category + " not found.");
} ]), angular.module("openshiftConsole").controller("CreateFromImageController", [ "$scope", "$filter", "$parse", "$q", "$routeParams", "$uibModal", "APIService", "ApplicationGenerator", "DataService", "HPAService", "ImagesService", "LimitRangesService", "Logger", "MetricsService", "Navigate", "NotificationsService", "ProjectsService", "QuotaService", "SOURCE_URL_PATTERN", "SecretsService", "TaskList", "failureObjectNameFilter", "keyValueEditorUtils", function(e, t, n, r, a, o, i, s, c, l, u, d, m, p, f, g, v, h, y, b, S, C, w) {
var P = t("displayName"), j = t("humanize");
e.projectName = a.project, e.sourceURLPattern = y;
var k = a.imageStream;
if (k) if (a.imageTag) {
e.displayName = a.displayName, e.advancedOptions = "true" === a.advanced;
var I = {
name: "app",
value: ""
}, R = t("orderByDisplayName"), T = t("getErrorDetails"), E = {}, N = function() {
g.hideNotification("create-builder-list-config-maps-error"), g.hideNotification("create-builder-list-secrets-error"), _.each(E, function(e) {
!e.id || "error" !== e.type && "warning" !== e.type || g.hideNotification(e.id);
});
};
e.$on("$destroy", N);
var D = i.getPreferredVersion("configmaps"), A = i.getPreferredVersion("limitranges"), $ = i.getPreferredVersion("imagestreams"), B = i.getPreferredVersion("imagestreamtags"), L = i.getPreferredVersion("secrets"), V = i.getPreferredVersion("resourcequotas"), O = i.getPreferredVersion("appliedclusterresourcequotas");
v.get(a.project).then(_.spread(function(t, n) {
e.project = t, a.sourceURI && (e.sourceURIinParams = !0), e.hasClusterResourceOverrides = d.hasClusterResourceOverrides(t);
var i = function() {
e.cpuProblems = d.validatePodLimits(e.limitRanges, "cpu", [ e.container ], t), e.memoryProblems = d.validatePodLimits(e.limitRanges, "memory", [ e.container ], t);
};
c.list(A, n).then(function(t) {
e.limitRanges = t.by("metadata.name"), _.isEmpty(e.limitRanges) || e.$watch("container", i, !0);
});
var v, y, C = function() {
e.scaling.autoscale && !e.hasClusterResourceOverrides ? e.showCPURequestWarning = !l.hasCPURequest([ e.container ], e.limitRanges, t) : e.showCPURequestWarning = !1;
};
c.list(V, n).then(function(e) {
v = e.by("metadata.name"), m.log("quotas", v);
}), c.list(O, n).then(function(e) {
y = e.by("metadata.name"), m.log("cluster quotas", y);
}), e.$watch("scaling.autoscale", C), e.$watch("container", C, !0), e.$watch("name", function(e, t) {
I.value && I.value !== t || (I.value = e);
}), function(r) {
r.name = a.name, r.imageName = k, r.imageTag = a.imageTag, r.namespace = a.namespace, r.buildConfig = {
buildOnSourceChange: !0,
buildOnImageChange: !0,
buildOnConfigChange: !0,
secrets: {
gitSecret: [ {
name: ""
} ]
},
sourceUrl: a.sourceURI,
gitRef: a.sourceRef,
contextDir: a.contextDir
}, r.buildConfigEnvVars = [], r.deploymentConfig = {
deployOnNewImage: !0,
deployOnConfigChange: !0
}, r.DCEnvVarsFromImage, r.DCEnvVarsFromUser = [], r.routing = {
include: !0,
portOptions: []
}, r.labelArray = [ I ], r.annotations = {}, r.scaling = {
replicas: 1,
autoscale: !1,
autoscaleOptions: [ {
label: "Manual",
value: !1
}, {
label: "Automatic",
value: !0
} ]
}, r.container = {
resources: {}
}, r.cpuRequestCalculated = d.isRequestCalculated("cpu", t), r.cpuLimitCalculated = d.isLimitCalculated("cpu", t), r.memoryRequestCalculated = d.isRequestCalculated("memory", t), r.fillSampleRepo = function() {
var e;
(r.image || r.image.metadata || r.image.metadata.annotations) && (e = r.image.metadata.annotations, r.buildConfig.sourceUrl = e.sampleRepo || "", r.buildConfig.gitRef = e.sampleRef || "", r.buildConfig.contextDir = e.sampleContextDir || "", (e.sampleRef || e.sampleContextDir) && (r.advancedSourceOptions = !0));
}, r.usingSampleRepo = function() {
return r.buildConfig.sourceUrl === _.get(r, "image.metadata.annotations.sampleRepo");
}, p.isAvailable().then(function(t) {
e.metricsWarning = !t;
});
var o = [], i = [];
e.valueFromObjects = [], c.list(D, n, null, {
errorNotification: !1
}).then(function(t) {
o = R(t.by("metadata.name")), e.valueFromObjects = o.concat(i);
}, function(e) {
403 !== e.code && g.addNotification({
id: "create-builder-list-config-maps-error",
type: "error",
message: "Could not load config maps.",
details: T(e)
});
}), c.list(L, n, null, {
errorNotification: !1
}).then(function(t) {
i = R(t.by("metadata.name")), e.valueFromObjects = o.concat(i);
var n = b.groupSecretsByType(t), r = _.mapValues(n, function(e) {
return _.map(e, "metadata.name");
});
e.secretsByType = _.each(r, function(e) {
e.unshift("");
});
}, function(e) {
403 !== e.code && g.addNotification({
id: "create-builder-list-secrets-error",
type: "error",
message: "Could not load secrets.",
details: T(e)
});
}), c.get($, r.imageName, {
namespace: r.namespace || a.project
}).then(function(e) {
r.imageStream = e;
var t = r.imageTag;
c.get(B, e.metadata.name + ":" + t, {
namespace: r.namespace
}).then(function(e) {
r.image = e.image, r.DCEnvVarsFromImage = u.getEnvironment(e);
var t = s.parsePorts(e.image);
_.isEmpty(t) ? (r.routing.include = !1, r.routing.portOptions = []) : (r.routing.portOptions = _.map(t, function(e) {
var t = s.getServicePort(e);
return {
port: t.name,
label: t.targetPort + "/" + t.protocol
};
}), r.routing.targetPort = r.routing.portOptions[0].port);
}, function() {
f.toErrorPage("Cannot create from source: the specified image could not be retrieved.");
});
}, function() {
f.toErrorPage("Cannot create from source: the specified image could not be retrieved.");
});
}(e);
var U, F = function() {
var t = {
started: "Creating application " + e.name + " in project " + e.projectDisplayName(),
success: "Created application " + e.name + " in project " + e.projectDisplayName(),
failure: "Failed to create " + e.name + " in project " + e.projectDisplayName()
}, o = {};
S.clear(), S.add(t, o, a.project, function() {
var t = r.defer();
return c.batch(U, n).then(function(n) {
var r = [], a = !1;
_.isEmpty(n.failure) ? r.push({
type: "success",
message: "All resources for application " + e.name + " were created successfully."
}) : (a = !0, n.failure.forEach(function(e) {
r.push({
type: "error",
message: "Cannot create " + j(e.object.kind).toLowerCase() + ' "' + e.object.metadata.name + '". ',
details: e.data.message
});
}), n.success.forEach(function(e) {
r.push({
type: "success",
message: "Created " + j(e.kind).toLowerCase() + ' "' + e.metadata.name + '" successfully. '
});
})), t.resolve({
alerts: r,
hasErrors: a
});
}), t.promise;
}), f.toNextSteps(e.name, e.projectName, {
usingSampleRepo: e.usingSampleRepo()
});
}, x = function(e) {
o.open({
templateUrl: "views/modals/confirm.html",
controller: "ConfirmModalController",
resolve: {
modalConfig: function() {
return {
alerts: e,
title: "Confirm Creation",
details: "Problems were detected while checking your application configuration.",
okButtonText: "Create Anyway",
okButtonClass: "btn-danger",
cancelButtonText: "Cancel"
};
}
}
}).result.then(F);
}, M = function(t) {
N(), E = t.quotaAlerts || [], e.nameTaken || _.some(E, {
type: "error"
}) ? (e.disableInputs = !1, _.each(E, function(e) {
e.id = _.uniqueId("create-builder-alert-"), g.addNotification(e);
})) : _.isEmpty(E) ? F() : (x(E), e.disableInputs = !1);
};
e.projectDisplayName = function() {
return P(this.project) || this.projectName;
}, e.createApp = function() {
e.disableInputs = !0, N(), e.buildConfig.envVars = w.compactEntries(e.buildConfigEnvVars), e.deploymentConfig.envVars = w.compactEntries(e.DCEnvVarsFromUser), e.labels = w.mapEntries(w.compactEntries(e.labelArray));
var t = s.generate(e);
U = [], angular.forEach(t, function(e) {
null !== e && (m.debug("Generated resource definition:", e), U.push(e));
});
var r = s.ifResourcesDontExist(U, e.projectName), a = h.getLatestQuotaAlerts(U, n), o = function(t) {
return e.nameTaken = t.nameTaken, a;
};
r.then(o, o).then(M, M);
};
})), e.cancel = function() {
f.toProjectOverview(e.projectName);
};
} else f.toErrorPage("Cannot create from source: a base image tag was not specified"); else f.toErrorPage("Cannot create from source: a base image was not specified");
} ]), angular.module("openshiftConsole").controller("NextStepsController", [ "$filter", "$routeParams", "$scope", "APIService", "DataService", "Logger", "ProjectsService", function(e, t, n, r, a, o, i) {
e("displayName");
var s = [];
n.alerts = [], n.loginBaseUrl = a.openshiftAPIBaseUrl(), n.buildConfigs = {}, n.projectName = t.project, n.fromSampleRepo = t.fromSample, n.name = t.name;
var c = r.getPreferredVersion("buildconfigs");
i.get(t.project).then(_.spread(function(e, r) {
n.project = e, s.push(a.watch(c, r, function(e) {
n.buildConfigs = e.by("metadata.name"), n.createdBuildConfig = n.buildConfigs[t.name], o.log("buildconfigs (subscribe)", n.buildConfigs);
})), n.$on("$destroy", function() {
a.unwatchAll(s);
});
}));
} ]), angular.module("openshiftConsole").controller("NewFromTemplateController", [ "$filter", "$location", "$parse", "$routeParams", "$scope", "AuthorizationService", "CachedTemplateService", "DataService", "Navigate", "NotificationsService", "ProjectsService", function(e, t, n, r, a, o, i, s, c, l, u) {
function d(e, t) {
var n = _.get(e, "spec.triggers", []), r = _.find(n, function(e) {
if ("ImageChange" !== e.type) return !1;
var n = _.get(e, "imageChangeParams.containerNames", []);
return _.includes(n, t.name);
});
return _.get(r, "imageChangeParams.from.name");
}
function m(e) {
for (var t = [], n = P.exec(e); n; ) t.push(n[1]), n = P.exec(e);
return t;
}
function p() {
var e = v();
a.templateImages = _.map(j, function(t) {
return _.isEmpty(t.usesParameters) ? t : {
name: _.template(t.name, {
interpolate: P
})(e),
usesParameters: t.usesParameters
};
});
}
function f(e) {
var t = [], n = b(e);
return n && angular.forEach(n, function(n) {
var r = n.image, a = d(e, n);
a && (r = a), r && t.push(r);
}), t;
}
function g(e) {
j = [];
var t = [], n = {};
angular.forEach(e.objects, function(e) {
if ("BuildConfig" === e.kind) {
var r = w(S(e), y);
r && j.push({
name: r,
usesParameters: m(r)
});
var a = w(C(e), y);
a && (n[a] = !0);
}
"DeploymentConfig" === e.kind && (t = t.concat(f(e)));
}), t.forEach(function(e) {
n[e] || j.push({
name: e,
usesParameters: m(e)
});
}), j = _.uniqBy(j, "name");
}
function v() {
var e = {};
return _.each(a.template.parameters, function(t) {
e[t.name] = t.value;
}), e;
}
var h = r.template, y = r.namespace || "", b = n("spec.template.spec.containers"), S = n("spec.strategy.sourceStrategy.from || spec.strategy.dockerStrategy.from || spec.strategy.customStrategy.from"), C = n("spec.output.to"), w = e("imageObjectRef");
if (h) {
r.templateParamsMap && (a.prefillParameters = function() {
try {
return JSON.parse(r.templateParamsMap);
} catch (e) {
l.addNotification({
id: "template-params-invalid-json",
type: "error",
message: "Could not prefill parameter values.",
details: "The `templateParamsMap` URL parameter is not valid JSON. " + e
});
}
}());
var P = /\${([a-zA-Z0-9\_]+)}/g, j = [];
u.get(r.project).then(_.spread(function(e) {
if (a.project = e, o.canI("processedtemplates", "create", r.project)) if (y) s.get("templates", h, {
namespace: y || a.project.metadata.name
}).then(function(e) {
a.template = e, g(e);
_.some(j, function(e) {
return !_.isEmpty(e.usesParameters);
}) ? (a.parameterDisplayNames = {}, _.each(e.parameters, function(e) {
a.parameterDisplayNames[e.name] = e.displayName || e.name;
}), a.$watch("template.parameters", _.debounce(function() {
a.$apply(p);
}, 50, {
maxWait: 250
}), !0)) : a.templateImages = j;
}, function() {
c.toErrorPage("Cannot create from template: the specified template could not be retrieved.");
}); else {
if (a.template = i.getTemplate(), _.isEmpty(a.template)) {
var n = URI("error").query({
error: "not_found",
error_description: "Template wasn't found in cache."
}).toString();
t.url(n);
}
i.clearTemplate();
} else c.toErrorPage("You do not have authority to process templates in project " + r.project + ".", "access_denied");
}));
} else c.toErrorPage("Cannot create from template: a template name was not specified.");
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
} ]), angular.module("openshiftConsole").controller("OAuthController", [ "$scope", "$location", "$q", "APIService", "AuthService", "DataService", "Logger", "RedirectLoginService", function(e, t, n, r, a, o, i, s) {
var c = i.get("auth");
e.completeLogin = function() {}, e.cancelLogin = function() {
t.replace(), t.url("./");
};
var l = r.getPreferredVersion("users");
s.finish().then(function(n) {
var r = n.token, i = n.then, s = n.verified, u = n.ttl, d = {
errorNotification: !1,
http: {
auth: {
token: r,
triggerLogin: !1
}
}
};
c.log("OAuthController, got token, fetching user", d), o.get(l, "~", {}, d).then(function(n) {
if (c.log("OAuthController, got user", n), e.completeLogin = function() {
a.setUser(n, r, u);
var e = i || "./";
URI(e).is("absolute") && (c.log("OAuthController, invalid absolute redirect", e), e = "./"), c.log("OAuthController, redirecting", e), t.replace(), t.url(e);
}, s) e.completeLogin(); else {
e.confirmUser = n;
var o = a.UserStore().getUser();
o && o.metadata.name !== n.metadata.name && (e.overriddenUser = o);
}
}).catch(function(e) {
var n = URI("error").query({
error: "user_fetch_failed"
}).toString();
c.error("OAuthController, error fetching user", e, "redirecting", n), t.replace(), t.url(n);
});
}).catch(function(e) {
var n = URI("error").query({
error: e.error || "",
error_description: e.error_description || "",
error_uri: e.error_uri || ""
}).toString();
c.error("OAuthController, error", e, "redirecting", n), t.replace(), t.url(n);
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
} ]), angular.module("openshiftConsole").controller("LogoutController", [ "$scope", "$routeParams", "$log", "AuthService", "AUTH_CFG", function(e, t, n, r, a) {
if (n.debug("LogoutController"), r.isLoggedIn()) n.debug("LogoutController, logged in, initiating logout"), e.logoutMessage = "Logging out...", r.startLogout().finally(function() {
r.isLoggedIn() ? (n.debug("LogoutController, logout failed, still logged in"), e.logoutMessage = 'You could not be logged out. Return to the <a href="./">console</a>.') : a.logout_uri ? (n.debug("LogoutController, logout completed, redirecting to AUTH_CFG.logout_uri", a.logout_uri), window.location.href = a.logout_uri) : (n.debug("LogoutController, logout completed, reloading the page"), window.location.reload(!1));
}); else if (a.logout_uri) n.debug("LogoutController, logout completed, redirecting to AUTH_CFG.logout_uri", a.logout_uri), e.logoutMessage = "Logging out...", window.location.href = a.logout_uri; else {
n.debug("LogoutController, not logged in, logout complete");
var o = "You are logged out.";
"timeout" === t.cause && (o = "You have been logged out due to inactivity."), e.logoutMessage = o + ' Return to the <a href="./">console</a>.';
}
} ]), angular.module("openshiftConsole").controller("CreateController", [ "$scope", "$filter", "$location", "$q", "$routeParams", "$uibModal", "CatalogService", "Constants", "DataService", "LabelFilter", "Logger", "ProjectsService", function(e, t, n, r, a, o, i, s, c, l, u, d) {
e.projectName = a.project, e.categories = s.CATALOG_CATEGORIES, e.alerts = e.alerts || {}, d.get(a.project).then(_.spread(function(t, n) {
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
}), "openshift" === a.project ? (e.projectImageStreams = [], e.projectTemplates = []) : (c.list("imagestreams", n).then(function(t) {
e.projectImageStreams = t.by("metadata.name");
}), c.list("templates", n, null, {
partialObjectMetadataList: !0
}).then(function(t) {
e.projectTemplates = t.by("metadata.name");
}));
}));
} ]), angular.module("openshiftConsole").controller("CreateFromURLController", [ "$scope", "$routeParams", "$location", "$filter", "APIService", "AuthService", "AuthorizationService", "DataService", "Navigate", "ProjectsService", function(e, t, n, r, a, o, i, s, c, l) {
o.withUser(), e.alerts = {}, e.selected = {};
var u = function(t) {
e.alerts.invalidImageStream = {
type: "error",
message: 'The requested image stream "' + t + '" could not be loaded.'
};
}, d = function(t) {
e.alerts.invalidImageTag = {
type: "error",
message: 'The requested image stream tag "' + t + '" could not be loaded.'
};
}, m = function(t) {
e.alerts.invalidTemplate = {
type: "error",
message: 'The requested template "' + t + '" could not be loaded.'
};
}, p = function() {
try {
return t.templateParamsMap && JSON.parse(t.templateParamsMap) || {};
} catch (t) {
e.alerts.invalidTemplateParams = {
type: "error",
message: "The templateParamsMap is not valid JSON. " + t
};
}
}, f = a.getPreferredVersion("imagestreams"), g = a.getPreferredVersion("imagestreamtags"), v = a.getPreferredVersion("templates"), h = window.OPENSHIFT_CONSTANTS.CREATE_FROM_URL_WHITELIST, y = [ "namespace", "name", "imageStream", "imageTag", "sourceURI", "sourceRef", "contextDir", "template", "templateParamsMap" ], b = _.pickBy(t, function(e, t) {
return _.includes(y, t) && _.isString(e);
});
b.namespace = b.namespace || "openshift";
_.includes(h, b.namespace) ? b.imageStream && b.template ? e.alerts.invalidResource = {
type: "error",
message: "Image streams and templates cannot be combined."
} : b.imageStream || b.template ? b.name && !function(e) {
return _.size(e) < 25 && /^[a-z]([-a-z0-9]*[a-z0-9])?$/.test(e);
}(b.name) ? function(t) {
e.alerts.invalidImageStream = {
type: "error",
message: 'The app name "' + t + "\" is not valid.  An app name is an alphanumeric (a-z, and 0-9) string with a maximum length of 24 characters, where the first character is a letter (a-z), and the '-' character is allowed anywhere except the first or last character."
};
}(b.name) : (b.imageStream && s.get(f, b.imageStream, {
namespace: b.namespace
}, {
errorNotification: !1
}).then(function(t) {
e.imageStream = t, s.get(g, t.metadata.name + ":" + b.imageTag, {
namespace: b.namespace
}, {
errorNotification: !1
}).then(function(t) {
e.imageStreamTag = t, e.validationPassed = !0, e.resource = t, b.displayName = r("displayName")(t);
}, function() {
d(b.imageTag);
});
}, function() {
u(b.imageStream);
}), b.template && s.get(v, b.template, {
namespace: b.namespace
}, {
errorNotification: !1
}).then(function(t) {
e.template = t, p() && (e.validationPassed = !0, e.resource = t);
}, function() {
m(b.template);
})) : e.alerts.resourceRequired = {
type: "error",
message: "An image stream or template is required."
} : function(t) {
e.alerts.invalidNamespace = {
type: "error",
message: 'Resources from the namespace "' + t + '" are not permitted.'
};
}(b.namespace), angular.extend(e, {
createDetails: b,
createWithProject: function(r) {
r = r || e.selected.project.metadata.name;
var a = t.imageStream ? c.createFromImageURL(e.imageStream, b.imageTag, r, b) : c.createFromTemplateURL(e.template, r, b);
n.url(a);
}
}), e.projects = {}, e.canCreateProject = void 0, l.list().then(function(t) {
e.loaded = !0, e.projects = r("orderByDisplayName")(t.by("metadata.name")), e.noProjects = _.isEmpty(e.projects);
}), l.canCreate().then(function() {
e.canCreateProject = !0;
}, function() {
e.canCreateProject = !1;
}), e.forms = {}, e.canIAddToProject = !0, e.canIAddToSelectedProject = function(t) {
var n = _.get(t, "metadata.name");
i.getProjectRules(n).then(function() {
e.canIAddToProject = i.canIAddToProject(n), e.forms && e.forms.selectProjectForm.selectProject.$setValidity("cannotAddToProject", e.canIAddToProject);
});
};
} ]), angular.module("openshiftConsole").controller("CreateProjectController", [ "$scope", "$location", "$window", "AuthService", "Constants", function(e, t, n, r, a) {
var o = !a.DISABLE_SERVICE_CATALOG_LANDING_PAGE;
e.onProjectCreated = function(e) {
o ? n.history.back() : t.path("project/" + e + "/create");
}, r.withUser();
} ]), angular.module("openshiftConsole").controller("EditProjectController", [ "$scope", "$routeParams", "$filter", "$location", "DataService", "ProjectsService", "Navigate", function(e, t, n, r, a, o, i) {
e.alerts = {};
var s = n("annotation"), c = n("annotationName");
o.get(t.project).then(_.spread(function(a) {
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
project: a,
editableFields: l(a),
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
e.disableInputs = !0, o.update(t.project, u(a, e.editableFields)).then(function() {
t.then ? r.path(t.then) : i.toProjectOverview(a.metadata.name);
}, function(t) {
e.disableInputs = !1, e.editableFields = l(a), e.alerts.update = {
type: "error",
message: "An error occurred while updating the project",
details: n("getErrorDetails")(t)
};
});
}
});
}));
} ]), angular.module("openshiftConsole").controller("CreateRouteController", [ "$filter", "$routeParams", "$scope", "$window", "APIService", "ApplicationGenerator", "AuthorizationService", "DataService", "Navigate", "NotificationsService", "ProjectsService", "keyValueEditorUtils", function(e, t, n, r, a, o, i, s, c, l, u, d) {
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
var m = a.getPreferredVersion("routes"), p = a.getPreferredVersion("services"), f = function() {
l.hideNotification("create-route-error");
};
n.$on("$destroy", f);
var g = function() {
r.history.back();
};
n.cancel = g, u.get(t.project).then(_.spread(function(r, u) {
if (n.project = r, i.canI(m, "create", t.project)) {
var v, h = e("orderByDisplayName");
n.routing.to = {
kind: "Service",
name: n.serviceName,
weight: 1
};
var y, b = function() {
var e = y, t = _.get(n, "routing.to.name");
y = _.get(v, [ t, "metadata", "labels" ], {});
var r = d.mapEntries(d.compactEntries(n.labels)), a = _.assign(r, y);
e && (a = _.omitBy(a, function(t, n) {
return e[n] && !y[n];
})), n.labels = _.map(a, function(e, t) {
return {
name: t,
value: e
};
});
};
s.list(p, u).then(function(e) {
v = e.by("metadata.name"), n.services = h(v), n.$watch("routing.to.name", b);
}), n.createRoute = function() {
if (n.createRouteForm.$valid) {
f(), n.disableInputs = !0;
var t = n.routing.to.name, r = d.mapEntries(d.compactEntries(n.labels)), i = o.createRoute(n.routing, t, r), c = _.get(n, "routing.alternateServices", []);
_.isEmpty(c) || (i.spec.to.weight = _.get(n, "routing.to.weight"), i.spec.alternateBackends = _.map(c, function(e) {
return {
kind: "Service",
name: e.name,
weight: e.weight
};
}));
var m = a.objectToResourceGroupVersion(i);
s.create(m, null, i, u).then(function() {
l.addNotification({
type: "success",
message: "Route " + i.metadata.name + " was successfully created."
}), g();
}, function(t) {
n.disableInputs = !1, l.addNotification({
type: "error",
id: "create-route-error",
message: "An error occurred creating the route.",
details: e("getErrorDetails")(t)
});
});
}
};
} else c.toErrorPage("You do not have authority to create routes in project " + t.project + ".", "access_denied");
}));
} ]), angular.module("openshiftConsole").controller("AttachPVCController", [ "$filter", "$routeParams", "$scope", "$window", "APIService", "AuthorizationService", "BreadcrumbsService", "DataService", "QuotaService", "Navigate", "NotificationsService", "ProjectsService", "StorageService", "RELATIVE_PATH_PATTERN", function(e, t, n, r, a, o, i, s, c, l, u, d, m, p) {
if (t.kind && t.name) {
var f = [ "Deployment", "DeploymentConfig", "ReplicaSet", "ReplicationController" ], g = e("humanizeKind");
if (_.includes(f, t.kind)) {
var v = {
resource: a.kindToResource(t.kind),
group: t.group
};
n.projectName = t.project, n.kind = t.kind, n.name = t.name, n.RELATIVE_PATH_PATTERN = p, n.outOfClaims = !1, n.attach = {
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
}), n.pvcVersion = a.getPreferredVersion("persistentvolumeclaims");
var h = a.getPreferredVersion("resourcequotas"), y = a.getPreferredVersion("appliedclusterresourcequotas");
d.get(t.project).then(_.spread(function(a, d) {
if (n.project = a, o.canI(v, "update", t.project)) {
var p = e("orderByDisplayName"), f = e("getErrorDetails"), b = e("generateName"), S = function(e, t) {
n.disableInputs = !0, u.addNotification({
id: "attach-pvc-error",
type: "error",
message: e,
details: t
});
}, C = function() {
u.hideNotification("attach-pvc-error");
};
n.$on("$destroy", C);
var w = function() {
r.history.back();
};
n.cancel = w;
var P = function(e) {
return n.attach.allContainers || n.attach.containers[e.name];
}, j = function() {
var e = _.get(n, "attach.resource.spec.template");
n.existingMountPaths = m.getMountPaths(e, P);
};
n.$watchGroup([ "attach.resource", "attach.allContainers" ], j), n.$watch("attach.containers", j, !0);
s.get(v, t.name, d).then(function(e) {
n.attach.resource = e, n.breadcrumbs = i.getBreadcrumbs({
object: e,
project: a,
subpage: "Add Storage"
});
var t = _.get(e, "spec.template");
n.existingVolumeNames = m.getVolumeNames(t);
}, function(e) {
S(t.name + " could not be loaded.", f(e));
}), s.list(n.pvcVersion, d).then(function(e) {
n.pvcs = p(e.by("metadata.name")), _.isEmpty(n.pvcs) || n.attach.persistentVolumeClaim || (n.attach.persistentVolumeClaim = _.head(n.pvcs));
}), s.list(h, {
namespace: n.projectName
}, function(e) {
n.quotas = e.by("metadata.name"), n.outOfClaims = c.isAnyStorageQuotaExceeded(n.quotas, n.clusterQuotas);
}), s.list(y, {
namespace: n.projectName
}, function(e) {
n.clusterQuotas = e.by("metadata.name"), n.outOfClaims = c.isAnyStorageQuotaExceeded(n.quotas, n.clusterQuotas);
}), n.attachPVC = function() {
if (n.disableInputs = !0, C(), n.attachPVCForm.$valid) {
n.attach.volumeName || (n.attach.volumeName = b("volume-"));
var e = n.attach.resource, r = _.get(e, "spec.template"), a = n.attach.persistentVolumeClaim, o = n.attach.volumeName, i = n.attach.mountPath, c = n.attach.subPath, l = n.attach.readOnly;
i && angular.forEach(r.spec.containers, function(e) {
if (P(e)) {
var t = m.createVolumeMount(o, i, c, l);
e.volumeMounts || (e.volumeMounts = []), e.volumeMounts.push(t);
}
});
var p = m.createVolume(o, a);
r.spec.volumes || (r.spec.volumes = []), r.spec.volumes.push(p), s.update(v, e.metadata.name, n.attach.resource, d).then(function() {
var e;
i || (e = "No mount path was provided. The volume reference was added to the configuration, but it will not be mounted into running pods."), u.addNotification({
type: "success",
message: "Persistent volume claim " + a.metadata.name + " added to " + g(t.kind) + " " + t.name + ".",
details: e
}), w();
}, function(e) {
S("An error occurred attaching the persistent volume claim to the " + g(t.kind) + ".", f(e)), n.disableInputs = !1;
});
}
};
} else l.toErrorPage("You do not have authority to update " + g(t.kind) + " " + t.name + ".", "access_denied");
}));
} else l.toErrorPage("Storage is not supported for kind " + g(t.kind) + ".");
} else l.toErrorPage("Kind or name parameter missing.");
} ]), angular.module("openshiftConsole").controller("AddConfigVolumeController", [ "$filter", "$location", "$routeParams", "$scope", "$window", "APIService", "AuthorizationService", "BreadcrumbsService", "DataService", "Navigate", "NotificationsService", "ProjectsService", "StorageService", "RELATIVE_PATH_PATTERN", function(e, t, n, r, a, o, i, s, c, l, u, d, m, p) {
if (n.kind && n.name) {
var f = [ "Deployment", "DeploymentConfig", "ReplicaSet", "ReplicationController" ];
if (_.includes(f, n.kind)) {
var g = {
resource: o.kindToResource(n.kind),
group: n.group
};
r.projectName = n.project, r.kind = n.kind, r.name = n.name, r.attach = {
allContainers: !0,
pickKeys: !1
}, r.forms = {}, r.RELATIVE_PATH_PATTERN = p, r.breadcrumbs = s.getBreadcrumbs({
name: n.name,
kind: n.kind,
namespace: n.project,
subpage: "Add Config Files"
}), r.configMapVersion = o.getPreferredVersion("configmaps"), r.secretVersion = o.getPreferredVersion("secrets");
var v = e("humanizeKind");
r.groupByKind = function(e) {
return v(e.kind);
};
r.$watch("attach.source", function() {
_.set(r, "attach.items", [ {} ]);
});
var h = function() {
r.forms.addConfigVolumeForm.$setDirty();
}, y = function() {
a.history.back();
};
r.cancel = y;
var b = function(e, t) {
u.addNotification({
id: "add-config-volume-error",
type: "error",
message: e,
details: t
});
}, S = function() {
u.hideNotification("add-config-volume-error");
};
r.$on("$destroy", S), r.addItem = function() {
r.attach.items.push({}), h();
}, r.removeItem = function(e) {
r.attach.items.splice(e, 1), h();
}, d.get(n.project).then(_.spread(function(t, a) {
if (r.project = t, i.canI(g, "update", n.project)) {
var o = e("orderByDisplayName"), d = e("getErrorDetails"), p = e("generateName");
c.get(g, n.name, a, {
errorNotification: !1
}).then(function(e) {
r.targetObject = e, r.breadcrumbs = s.getBreadcrumbs({
object: e,
project: t,
subpage: "Add Config Files"
});
}, function(e) {
r.error = e;
}), c.list(r.configMapVersion, a, null, {
errorNotification: !1
}).then(function(e) {
r.configMaps = o(e.by("metadata.name"));
}, function(e) {
403 !== e.status ? b("Could not load config maps", d(e)) : r.configMaps = [];
}), c.list(r.secretVersion, a, null, {
errorNotification: !1
}).then(function(e) {
r.secrets = o(e.by("metadata.name"));
}, function(e) {
403 !== e.status ? b("Could not load secrets", d(e)) : r.secrets = [];
});
var f = function(e) {
return r.attach.allContainers || r.attach.containers[e.name];
}, h = function() {
var e = _.get(r, "targetObject.spec.template");
r.existingMountPaths = m.getMountPaths(e, f);
};
r.$watchGroup([ "targetObject", "attach.allContainers" ], h), r.$watch("attach.containers", h, !0);
r.$watch("attach.items", function() {
var e = _.map(r.attach.items, "path");
r.itemPaths = _.compact(e);
}, !0), r.addVolume = function() {
if (!r.forms.addConfigVolumeForm.$invalid) {
var t = r.targetObject, o = _.get(r, "attach.source"), i = _.get(t, "spec.template"), s = p("volume-"), l = {
name: s,
mountPath: _.get(r, "attach.mountPath")
};
"Secret" === o.kind && (l.readOnly = !0), _.each(i.spec.containers, function(e) {
f(e) && (e.volumeMounts = e.volumeMounts || [], e.volumeMounts.push(l));
});
var m, v = {
name: s
};
switch (r.attach.pickKeys && (m = r.attach.items), o.kind) {
case "ConfigMap":
v.configMap = {
name: o.metadata.name,
items: m
};
break;

case "Secret":
v.secret = {
secretName: o.metadata.name,
items: m
};
}
i.spec.volumes = i.spec.volumes || [], i.spec.volumes.push(v), r.disableInputs = !0, S();
var h = e("humanizeKind"), C = h(o.kind), w = h(n.kind);
c.update(g, t.metadata.name, r.targetObject, a).then(function() {
u.addNotification({
type: "success",
message: "Successfully added " + C + " " + o.metadata.name + " to " + w + " " + n.name + "."
}), y();
}, function(e) {
r.disableInputs = !1, b("An error occurred attaching the " + C + " to the " + w + ".", d(e));
});
}
};
} else l.toErrorPage("You do not have authority to update " + v(n.kind) + " " + n.name + ".", "access_denied");
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
} ]), angular.module("openshiftConsole").controller("ConfirmScaleController", [ "$scope", "$uibModalInstance", "resource", "type", function(e, t, n, r) {
e.resource = n, e.type = r, e.confirmScale = function() {
t.close("confirmScale");
}, e.cancel = function() {
t.dismiss("cancel");
};
} ]), angular.module("openshiftConsole").controller("ConfirmSaveLogController", [ "$scope", "$uibModalInstance", "object", "CLIHelp", function(e, t, n, r) {
e.object = n, e.command = r.getLogsCommand(n), e.save = function() {
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
} ]), angular.module("openshiftConsole").controller("DebugTerminalModalController", [ "$scope", "$filter", "$uibModalInstance", "container", "image", function(e, t, n, r, a) {
e.container = r, e.image = a, e.$watch("debugPod.status.containerStatuses", function() {
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
var r = n.getDependentServices(e.service);
e.options = _.filter(t, function(t) {
return t !== e.service && !_.includes(r, t.metadata.name);
}), 1 === _.size(e.options) && _.set(e, "link.selectedService", _.head(e.options));
}), e.link = function() {
t.close(_.get(e, "link.selectedService"));
}, e.cancel = function() {
t.dismiss();
};
} ]), angular.module("openshiftConsole").controller("LogoutModalController", [ "$timeout", "$location", "$filter", "$scope", "$uibModalInstance", "Constants", function(e, t, n, r, a, o) {
r.endTimestamp = moment().add(30, "seconds").toString();
var i = e(function() {
r.logout();
}, 3e4);
r.logout = function() {
e.cancel(i), a.close("logout");
}, r.cancel = function() {
e.cancel(i), a.close("cancel");
}, r.$on("$destroy", function() {
e.cancel(i);
});
} ]), angular.module("openshiftConsole").controller("JenkinsfileExamplesModalController", [ "$scope", "$uibModalInstance", function(e, t) {
e.close = function() {
t.close("close");
};
} ]), angular.module("openshiftConsole").controller("AboutComputeUnitsModalController", [ "$scope", "$uibModalInstance", function(e, t) {
e.close = function() {
t.close("close");
};
} ]), angular.module("openshiftConsole").controller("SetHomePageModalController", [ "$scope", "$uibModalInstance", "HomePagePreferenceService", "ProjectsService", function(e, t, n, r) {
e.homePagePreference = n.getHomePagePreference(), e.availableProjects = [], e.selectedProject = null, e.onProjectSelected = function(t) {
e.selectedProject = t;
}, e.onOpen = function() {
e.homePagePreference = "project-overview";
}, e.preselectedProjectName = n.getHomePageProjectName(), r.list().then(function(t) {
e.availableProjects = _.toArray(t.by("metadata.name")), e.availableProjects = _.reject(e.availableProjects, "metadata.deletionTimestamp"), 1 === e.availableProjects.length ? e.selectedProject = e.availableProjects[0] : e.preselectedProjectName && (e.selectedProject = _.find(e.availableProjects, {
metadata: {
name: e.preselectedProjectName
}
}));
}), e.setHomePage = function() {
var r = {
type: e.homePagePreference
};
"project-overview" === e.homePagePreference && e.selectedProject && (r.project = e.selectedProject.metadata.name), n.setHomePagePreference(r), t.close("setHomePage");
}, e.cancel = function() {
t.dismiss("cancel");
};
} ]), angular.module("openshiftConsole").controller("AboutController", [ "$scope", "$q", "AuthService", "Constants", "DataService", function(e, t, n, r, a) {
n.withUser(), e.version = {
master: {},
console: r.VERSION.console || "unknown"
};
var o = e.version.master, i = [];
i.push(a.getKubernetesMasterVersion().then(function(e) {
o.kubernetes = e.data.gitVersion;
})), i.push(a.getOpenShiftMasterVersion().then(function(e) {
o.openshift = e.data.gitVersion;
})), t.all(i).finally(function() {
o.kubernetes = o.kubernetes || "unknown", o.openshift = o.openshift || "unknown";
});
} ]), angular.module("openshiftConsole").controller("CommandLineController", [ "$scope", "DataService", "AuthService", "Constants", function(e, t, n, r) {
n.withUser(), e.cliDownloadURL = r.CLI, e.cliDownloadURLPresent = e.cliDownloadURL && !_.isEmpty(e.cliDownloadURL), e.loginBaseURL = t.openshiftAPIBaseUrl(), r.DISABLE_COPY_LOGIN_COMMAND || (e.sessionToken = n.UserStore().getToken());
} ]), angular.module("openshiftConsole").controller("CreatePersistentVolumeClaimController", [ "$filter", "$routeParams", "$scope", "$window", "APIService", "ApplicationGenerator", "AuthorizationService", "DataService", "Navigate", "NotificationsService", "ProjectsService", "keyValueEditorUtils", function(e, t, n, r, a, o, i, s, c, l, u, d) {
n.projectName = t.project, n.accessModes = "ReadWriteOnce", n.claim = {}, n.breadcrumbs = [ {
title: "Storage",
link: "project/" + n.projectName + "/browse/storage"
}, {
title: "Create Storage"
} ];
var m = {
kind: "PersistentVolumeClaim",
apiVersion: "v1",
metadata: {
name: void 0,
labels: {},
annotations: {}
},
spec: {
resources: {
requests: {}
}
}
}, p = a.objectToResourceGroupVersion(m), f = function() {
l.hideNotification("create-pvc-error");
};
n.$on("$destroy", f);
var g = function() {
r.history.back();
};
n.cancel = g, u.get(t.project).then(_.spread(function(r, a) {
function o() {
var e = angular.copy(m);
e.metadata.name = n.claim.name, e.spec.accessModes = [ n.claim.accessModes || "ReadWriteOnce" ];
var t = n.claim.unit || "Mi";
if (e.spec.resources.requests.storage = n.claim.amount + t, n.claim.selectedLabels) {
var r = d.mapEntries(d.compactEntries(n.claim.selectedLabels));
_.isEmpty(r) || _.set(e, "spec.selector.matchLabels", r);
}
return n.claim.storageClass && "No Storage Class" !== n.claim.storageClass.metadata.name && (e.metadata.annotations["volume.beta.kubernetes.io/storage-class"] = n.claim.storageClass.metadata.name), e;
}
n.project = r, i.canI(p, "create", t.project) ? n.createPersistentVolumeClaim = function() {
if (f(), n.createPersistentVolumeClaimForm.$valid) {
n.disableInputs = !0;
var t = o();
s.create(p, null, t, a).then(function(e) {
l.addNotification({
type: "success",
message: "Persistent volume claim " + e.metadata.name + " successfully created."
}), g();
}, function(t) {
n.disableInputs = !1, l.addNotification({
id: "create-pvc-error",
type: "error",
message: "An error occurred requesting storage.",
details: e("getErrorDetails")(t)
});
});
}
} : c.toErrorPage("You do not have authority to create persistent volume claims in project " + t.project + ".", "access_denied");
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
link: function(e, t, r, a) {
e.hideBuild = !1, e.$watch("build", function(t) {
e.hideBuild = n(t);
});
},
templateUrl: "views/directives/_build-close.html"
};
} ]), angular.module("openshiftConsole").directive("createSecret", [ "$filter", "AuthorizationService", "APIService", "DataService", "NotificationsService", "ApplicationGenerator", "DNS1123_SUBDOMAIN_VALIDATION", function(e, t, n, r, a, o, i) {
var s = n.getPreferredVersion("serviceaccounts"), c = n.getPreferredVersion("secrets");
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
link: function(l) {
l.nameValidation = i, l.secretReferenceValidation = {
pattern: /^[a-zA-Z0-9\-_]+$/,
minLength: 8,
description: "Secret reference key must consist of lower-case, upper-case letters, numbers, dash, and underscore."
}, l.secretAuthTypeMap = {
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
},
webhook: {
label: "Webhook Secret",
authTypes: [ {
id: "Opaque",
label: "Webhook Secret"
} ]
}
}, l.secretTypes = _.keys(l.secretAuthTypeMap), l.type ? l.newSecret = {
type: l.type,
authType: l.secretAuthTypeMap[l.type].authTypes[0].id,
data: {},
linkSecret: !_.isEmpty(l.serviceAccountToLink),
pickedServiceAccountToLink: l.serviceAccountToLink || ""
} : l.newSecret = {
type: "source",
authType: "kubernetes.io/basic-auth",
data: {},
linkSecret: !1,
pickedServiceAccountToLink: ""
}, l.add = {
gitconfig: !1,
cacert: !1
}, t.canI("serviceaccounts", "list") && t.canI("serviceaccounts", "update") && r.list(s, l, function(e) {
l.serviceAccounts = e.by("metadata.name"), l.serviceAccountsNames = _.keys(l.serviceAccounts);
});
var u = function(e, t) {
var n = {
apiVersion: "v1",
kind: "Secret",
metadata: {
name: l.newSecret.data.secretName
},
type: t,
stringData: {}
};
switch (t) {
case "kubernetes.io/basic-auth":
e.passwordToken ? n.stringData.password = e.passwordToken : n.type = "Opaque", e.username && (n.stringData.username = e.username), e.gitconfig && (n.stringData[".gitconfig"] = e.gitconfig), e.cacert && (n.stringData["ca.crt"] = e.cacert);
break;

case "kubernetes.io/ssh-auth":
n.stringData["ssh-privatekey"] = e.privateKey, e.gitconfig && (n.stringData[".gitconfig"] = e.gitconfig);
break;

case "kubernetes.io/dockerconfigjson":
var r = ".dockerconfigjson";
JSON.parse(e.dockerConfig).auths || (n.type = "kubernetes.io/dockercfg", r = ".dockercfg"), n.stringData[r] = e.dockerConfig;
break;

case "kubernetes.io/dockercfg":
var a = window.btoa(e.dockerUsername + ":" + e.dockerPassword), o = {};
o[e.dockerServer] = {
username: e.dockerUsername,
password: e.dockerPassword,
email: e.dockerMail,
auth: a
}, n.stringData[".dockercfg"] = JSON.stringify(o);
break;

case "Opaque":
e.webhookSecretKey && (n.stringData.WebHookSecretKey = e.webhookSecretKey);
}
return n;
}, d = function() {
a.hideNotification("create-secret-error");
}, m = function(t) {
var o = angular.copy(l.serviceAccounts[l.newSecret.pickedServiceAccountToLink]), i = n.objectToResourceGroupVersion(o);
switch (l.newSecret.type) {
case "source":
o.secrets.push({
name: t.metadata.name
});
break;

case "image":
o.imagePullSecrets.push({
name: t.metadata.name
});
}
r.update(i, l.newSecret.pickedServiceAccountToLink, o, l).then(function(e) {
a.addNotification({
type: "success",
message: "Secret " + t.metadata.name + " was created and linked with service account " + e.metadata.name + "."
}), l.onCreate({
newSecret: t
});
}, function(n) {
a.addNotification({
type: "success",
message: "Secret " + t.metadata.name + " was created."
}), l.serviceAccountToLink || a.addNotification({
id: "secret-sa-link-error",
type: "error",
message: "An error occurred while linking the secret with service account " + l.newSecret.pickedServiceAccountToLink + ".",
details: e("getErrorDetails")(n)
}), l.onCreate({
newSecret: t
});
});
}, p = _.debounce(function() {
try {
JSON.parse(l.newSecret.data.dockerConfig), l.invalidConfigFormat = !1;
} catch (e) {
l.invalidConfigFormat = !0;
}
}, 300, {
leading: !0
});
l.aceChanged = p, l.nameChanged = function() {
l.nameTaken = !1;
}, l.generateWebhookSecretKey = function() {
l.newSecret.data.webhookSecretKey = o._generateSecret();
}, l.create = function() {
d();
var n = u(l.newSecret.data, l.newSecret.authType);
r.create(c, null, n, l).then(function(e) {
l.newSecret.linkSecret && l.serviceAccountsNames.contains(l.newSecret.pickedServiceAccountToLink) && t.canI("serviceaccounts", "update") ? m(e) : (a.addNotification({
type: "success",
message: "Secret " + n.metadata.name + " was created."
}), l.onCreate({
newSecret: e
}));
}, function(t) {
"AlreadyExists" !== (t.data || {}).reason ? a.addNotification({
id: "create-secret-error",
type: "error",
message: "An error occurred while creating the secret.",
details: e("getErrorDetails")(t)
}) : l.nameTaken = !0;
});
}, l.cancel = function() {
d(), l.onCancel();
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
}).directive("timeRemainingFromNow", function() {
return {
restrict: "E",
scope: {
endTimestamp: "="
},
template: '<span data-timestamp="{{endTimestamp}}" class="countdown">{{endTimestamp | countdownToTimestamp}}</span>'
};
}), angular.module("openshiftConsole").directive("deleteLink", [ "$uibModal", "$location", "$filter", "$q", "hashSizeFilter", "APIService", "DataService", "Navigate", "NotificationsService", "Logger", function(e, t, n, r, a, o, i, s, c, l) {
var u = o.getPreferredVersion("horizontalpodautoscalers");
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
link: function(r, a, d) {
"Project" === d.kind && (r.isProject = !0), r.options = {
deleteHPAs: !0,
deleteImmediately: !1
};
var m = function(e) {
r.stayOnCurrentPage && r.alerts ? r.alerts[e.name] = e.data : c.addNotification(e.data);
}, p = function(e) {
return i.delete(u, e.metadata.name, {
namespace: r.projectName
}).then(function() {
c.addNotification({
type: "success",
message: "Horizontal pod autoscaler " + e.metadata.name + " was marked for deletion."
});
}).catch(function(t) {
m({
name: e.metadata.name,
data: {
type: "error",
message: "Horizontal pod autoscaler " + e.metadata.name + " could not be deleted."
}
}), l.error("HPA " + e.metadata.name + " could not be deleted.", t);
});
}, f = function() {
if (!r.stayOnCurrentPage) if (r.redirectUrl) t.url(r.redirectUrl); else if ("Project" === r.kind) if ("/" !== t.path()) {
var e = URI("/");
t.url(e);
} else r.$emit("deleteProject"); else s.toResourceList(o.kindToResource(r.kind), r.projectName);
};
r.openDeleteModal = function() {
r.disableDelete || e.open({
templateUrl: "views/modals/delete-resource.html",
controller: "DeleteModalController",
scope: r
}).result.then(function() {
var e = r.kind, t = r.resourceName, a = r.typeDisplayName || n("humanizeKind")(e), s = _.capitalize(a) + " '" + (r.displayName ? r.displayName : t) + "'", u = "Project" === r.kind ? {} : {
namespace: r.projectName
}, d = {};
r.options.deleteImmediately && (d.gracePeriodSeconds = 0, d.propagationPolicy = null), "servicecatalog.k8s.io" === r.group && (d.propagationPolicy = null), i.delete({
resource: o.kindToResource(e),
group: r.group
}, t, u, d).then(function() {
c.addNotification({
type: "success",
message: s + " was marked for deletion."
}), r.success && r.success(), r.options.deleteHPAs && _.each(r.hpaList, p), f();
}).catch(function(e) {
m({
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
} ]), angular.module("openshiftConsole").directive("editConfigMap", [ "DNS1123_SUBDOMAIN_VALIDATION", function(e) {
return {
require: "^form",
restrict: "E",
scope: {
configMap: "=model",
showNameInput: "="
},
templateUrl: "views/directives/edit-config-map.html",
link: function(t, n, r, a) {
t.form = a, t.nameValidation = e, t.addItem = function() {
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
} ]), function() {
angular.module("openshiftConsole").component("editEnvironmentFrom", {
controller: [ "$attrs", "$filter", "$scope", "keyValueEditorUtils", "SecretsService", function(e, t, n, r, a) {
var o = this, i = t("canI"), s = t("humanizeKind"), c = _.uniqueId(), l = /^[A-Za-z_][A-Za-z0-9_]*$/, u = !1;
o.setFocusClass = "edit-environment-from-set-focus-" + c, o.isEnvVarInvalid = function(e) {
return !l.test(e);
}, o.hasInvalidEnvVar = function(e) {
return _.some(e, function(e, t) {
return o.isEnvVarInvalid(t);
});
}, o.viewOverlayPanel = function(e) {
o.decodedData = e.data, o.overlayPaneEntryDetails = e, "Secret" === e.kind && (o.decodedData = a.decodeSecretData(e.data)), o.overlayPanelVisible = !0;
}, o.closeOverlayPanel = function() {
o.showSecret = !1, o.overlayPanelVisible = !1;
};
var d = function(e, t) {
e && e.push(t || {});
};
o.onAddRow = function() {
d(o.envFromEntries), r.setFocusOn("." + o.setFocusClass);
}, o.deleteEntry = function(e, t) {
o.envFromEntries && !o.envFromEntries.length || (o.envFromEntries.splice(e, t), o.envFromEntries.length || d(o.envFromEntries), o.updateEntries(o.envFromEntries), o.editEnvironmentFromForm.$setDirty());
}, o.hasOptions = function() {
return !_.isEmpty(o.envFromSelectorOptions);
}, o.hasEntries = function() {
return _.some(o.entries, function(e) {
return _.get(e, "configMapRef.name") || _.get(e, "secretRef.name");
});
}, o.isEnvFromReadonly = function(e) {
return !0 === o.isReadonly || e && !0 === e.isReadonly;
}, o.groupByKind = function(e) {
return s(e.kind);
}, o.dragControlListeners = {
accept: function(e, t) {
return e.itemScope.sortableScope.$id === t.$id;
},
orderChanged: function() {
o.editEnvironmentFromForm.$setDirty();
}
}, o.envFromObjectSelected = function(e, t, n) {
var r = {};
switch (n.kind) {
case "Secret":
r.secretRef = {
name: n.metadata.name
}, delete o.envFromEntries[e].configMapRef;
break;

case "ConfigMap":
r.configMapRef = {
name: n.metadata.name
}, delete o.envFromEntries[e].secretRef;
}
t.prefix && (r.prefix = t.prefix), _.assign(o.envFromEntries[e], r), o.updateEntries(o.envFromEntries);
}, o.updateEntries = function(e) {
u = !0, o.entries = _.filter(e, function(e) {
return e.secretRef || e.configMapRef;
});
};
var m = function() {
var e = {}, t = {};
o.envFromEntries = o.entries || [], o.envFromEntries.length || d(o.envFromEntries), _.each(o.envFromSelectorOptions, function(n) {
switch (n.kind) {
case "ConfigMap":
e[n.metadata.name] = n;
break;

case "Secret":
t[n.metadata.name] = n;
}
}), _.each(o.envFromEntries, function(n) {
var r, a;
if (n.configMapRef && (r = "configMapRef", a = "configmaps"), n.secretRef && (r = "secretRef", a = "secrets"), r && a) {
var o = n[r].name;
n.configMapRef && o in e && (n.selectedEnvFrom = e[o]), n.secretRef && o in t && (n.selectedEnvFrom = t[o]), i(a, "get") || (n.isReadonly = !0);
}
});
};
o.$onInit = function() {
m(), "cannotDelete" in e && (o.cannotDeleteAny = !0), "cannotSort" in e && (o.cannotSort = !0), "showHeader" in e && (o.showHeader = !0), o.envFromEntries && !o.envFromEntries.length && d(o.envFromEntries);
}, n.$watch("$ctrl.entries", function() {
u ? u = !1 : m();
}), o.$onChanges = function(e) {
e.envFromSelectorOptions && m();
};
} ],
bindings: {
entries: "=",
envFromSelectorOptions: "<",
isReadonly: "<?"
},
templateUrl: "views/directives/edit-environment-from.html"
});
}(), angular.module("openshiftConsole").directive("events", [ "$routeParams", "$filter", "APIService", "DataService", "KeywordService", "Logger", function(e, t, n, r, a, o) {
return {
restrict: "E",
scope: {
apiObjects: "=?",
projectContext: "="
},
templateUrl: "views/directives/events.html",
controller: [ "$scope", function(e) {
var t, i = {}, s = [], c = n.getPreferredVersion("events");
e.filter = {
text: ""
};
var l = function(e) {
return _.isEmpty(i) ? e : _.filter(e, function(e) {
return i[e.involvedObject.uid];
});
}, u = [], d = _.get(e, "sortConfig.currentField.id"), m = {
lastTimestamp: !0
}, p = function() {
var t = _.get(e, "sortConfig.currentField.id", "lastTimestamp");
d !== t && (d = t, e.sortConfig.isAscending = !m[d]);
var n = e.sortConfig.isAscending ? "asc" : "desc";
u = _.orderBy(e.events, [ t, "metadata.resourceVersion" ], [ n, n ]);
}, f = [], g = function() {
e.filterExpressions = f = a.generateKeywords(_.get(e, "filter.text"));
}, v = [ "reason", "message", "type" ];
e.resourceKind && e.resourceName || v.splice(0, 0, "involvedObject.name", "involvedObject.kind");
var h = function() {
e.filteredEvents = a.filterForKeywords(u, v, f);
};
e.$watch("filter.text", _.debounce(function() {
g(), e.$evalAsync(h);
}, 50, {
maxWait: 250
}));
var y = function() {
p(), h();
}, b = _.debounce(function() {
t && e.$evalAsync(function() {
e.events = l(t), y();
});
}, 250, {
leading: !0,
trailing: !0,
maxWait: 1e3
});
e.$watch("apiObjects", function(n) {
i = {}, _.each(n, function(e) {
_.get(e, "metadata.uid") && (i[e.metadata.uid] = !0);
}), e.showKindAndName = 1 !== _.size(i), t && b();
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
onSortChange: y
}, t && e.sortConfig.fields.splice(1, 0, {
id: "involvedObject.name",
title: "Name",
sortType: "alpha"
}, {
id: "involvedObject.kind",
title: "Kind",
sortType: "alpha"
});
}), s.push(r.watch(c, e.projectContext, function(n) {
t = n.by("metadata.name"), b(), o.log("events (subscribe)", e.filteredEvents);
}, {
skipDigest: !0
})), e.$on("$destroy", function() {
r.unwatchAll(s);
});
} ]
};
} ]), angular.module("openshiftConsole").directive("eventsSidebar", [ "$rootScope", "APIService", "DataService", "Logger", function(e, t, n, r) {
var a = t.getPreferredVersion("events");
return {
restrict: "E",
scope: {
projectContext: "=",
collapsed: "="
},
templateUrl: "views/directives/events-sidebar.html",
controller: [ "$scope", function(t) {
var o = [];
o.push(n.watch(a, t.projectContext, function(e) {
var n = e.by("metadata.name");
t.events = _.orderBy(n, [ "lastTimestamp" ], [ "desc" ]), t.warningCount = _.size(_.filter(n, {
type: "Warning"
})), r.log("events (subscribe)", t.events);
})), t.highlightedEvents = {}, t.collapseSidebar = function() {
t.collapsed = !0;
};
var i = [];
i.push(e.$on("event.resource.highlight", function(e, n) {
var r = _.get(n, "kind"), a = _.get(n, "metadata.name");
r && a && _.each(t.events, function(e) {
e.involvedObject.kind === r && e.involvedObject.name === a && (t.highlightedEvents[r + "/" + a] = !0);
});
})), i.push(e.$on("event.resource.clear-highlight", function(e, n) {
var r = _.get(n, "kind"), a = _.get(n, "metadata.name");
r && a && _.each(t.events, function(e) {
e.involvedObject.kind === r && e.involvedObject.name === a && (t.highlightedEvents[r + "/" + a] = !1);
});
})), t.$on("$destroy", function() {
n.unwatchAll(o), _.each(i, function(e) {
e();
}), i = null;
});
} ]
};
} ]), angular.module("openshiftConsole").directive("eventsBadge", [ "$filter", "APIService", "DataService", "Logger", function(e, t, n, r) {
var a = t.getPreferredVersion("events");
return {
restrict: "E",
scope: {
projectContext: "=",
sidebarCollapsed: "="
},
templateUrl: "views/directives/events-badge.html",
controller: [ "$scope", function(t) {
var o = [], i = e("orderObjectsByDate");
o.push(n.watch(a, t.projectContext, function(e) {
var n = e.by("metadata.name");
t.events = i(n, !0), t.warningCount = _.size(_.filter(n, {
type: "Warning"
})), t.normalCount = _.size(_.filter(n, {
type: "Normal"
})), r.log("events (subscribe)", t.events);
})), t.expandSidebar = function() {
t.sidebarCollapsed = !1;
}, t.$on("$destroy", function() {
n.unwatchAll(o);
});
} ]
};
} ]), angular.module("openshiftConsole").directive("fromFile", [ "$filter", "$location", "$q", "$uibModal", "APIService", "CachedTemplateService", "DataService", "Navigate", "NotificationsService", "QuotaService", "SecurityCheckService", "TaskList", "ProjectsService", function(e, t, n, r, a, o, i, s, c, l, u, d, m) {
return {
restrict: "E",
scope: {
project: "=",
isDialog: "="
},
templateUrl: "views/directives/from-file.html",
controller: [ "$scope", function(p) {
function f(e) {
return !!e.kind || (p.error = {
message: "Resource is missing kind field."
}, !1);
}
function g(e) {
return !!p.isList || (e.metadata ? e.metadata.name ? !e.metadata.namespace || e.metadata.namespace === p.input.selectedProject.metadata.name || (p.error = {
message: e.kind + " " + e.metadata.name + " can't be created in project " + e.metadata.namespace + ". Can't create resource in different projects."
}, !1) : (p.error = {
message: "Resource name is missing in metadata field."
}, !1) : (p.error = {
message: "Resource is missing metadata field."
}, !1));
}
function v() {
r.open({
templateUrl: "views/modals/process-or-save-template.html",
controller: "ProcessOrSaveTemplateModalController",
scope: p
}).result.then(function() {
p.templateOptions.add ? y() : (o.setTemplate(p.resourceList[0]), b());
});
}
function h() {
r.open({
templateUrl: "views/modals/confirm-replace.html",
controller: "ConfirmReplaceModalController",
scope: p
}).result.then(function() {
l.getLatestQuotaAlerts(p.createResources, {
namespace: p.input.selectedProject.metadata.name
}).then(N);
});
}
function y() {
var e = p.createResources.length, t = p.updateResources.length;
if (p.resourceKind.endsWith("List")) {
var r = [];
t > 0 && r.push(P()), e > 0 && r.push(w()), n.all(r).then(b);
} else C();
}
function b() {
var e, n;
E(), "Template" === p.resourceKind && p.templateOptions.process && !p.errorOccurred ? p.isDialog ? p.$emit("fileImportedFromYAMLOrJSON", {
project: p.input.selectedProject,
template: p.resource
}) : (n = p.templateOptions.add || p.updateResources.length > 0 ? p.input.selectedProject.metadata.name : "", e = s.createFromTemplateURL(p.resource, p.input.selectedProject.metadata.name, {
namespace: n
}), t.url(e)) : p.isDialog ? p.$emit("fileImportedFromYAMLOrJSON", {
project: p.input.selectedProject,
resource: p.resource,
isList: p.isList
}) : (e = s.projectOverviewURL(p.input.selectedProject.metadata.name), t.url(e));
}
function S(e) {
var t = a.objectToResourceGroupVersion(e);
return t ? a.apiInfo(t) ? i.get(t, e.metadata.name, {
namespace: p.input.selectedProject.metadata.name
}, {
errorNotification: !1
}).then(function(t) {
var n = angular.copy(e), r = angular.copy(t.metadata);
r.annotations = e.metadata.annotations, r.labels = e.metadata.labels, n.metadata = r, p.updateResources.push(n);
}, function() {
var t = angular.copy(e);
_.unset(t, "metadata.resourceVersion"), p.createResources.push(t);
}) : (p.errorOccurred = !0, void (p.error = {
message: a.unsupportedObjectKindOrVersion(e)
})) : (p.errorOccurred = !0, void (p.error = {
message: a.invalidObjectKindOrVersion(e)
}));
}
function C() {
var t;
_.isEmpty(p.createResources) ? (t = _.head(p.updateResources), i.update(a.kindToResource(t.kind), t.metadata.name, t, {
namespace: p.input.selectedProject.metadata.name
}).then(function() {
if (!p.isDialog) {
var e = k(t.kind);
c.addNotification({
type: "success",
message: _.capitalize(e) + " " + t.metadata.name + " was successfully updated."
});
}
b();
}, function(n) {
c.addNotification({
id: "from-file-error",
type: "error",
message: "Unable to update the " + k(t.kind) + " '" + t.metadata.name + "'.",
details: e("getErrorDetails")(n)
});
})) : (t = _.head(p.createResources), i.create(a.kindToResource(t.kind), null, t, {
namespace: p.input.selectedProject.metadata.name
}).then(function() {
if (!p.isDialog) {
var e = k(t.kind);
c.addNotification({
type: "success",
message: _.capitalize(e) + " " + t.metadata.name + " was successfully created."
});
}
b();
}, function(n) {
c.addNotification({
id: "from-file-error",
type: "error",
message: "Unable to create the " + k(t.kind) + " '" + t.metadata.name + "'.",
details: e("getErrorDetails")(n)
});
}));
}
function w() {
var e = {
started: "Creating resources in project " + A(p.input.selectedProject),
success: "Creating resources in project " + A(p.input.selectedProject),
failure: "Failed to create some resources in project " + A(p.input.selectedProject)
}, t = {};
d.add(e, t, p.input.selectedProject.metadata.name, function() {
var e = n.defer();
return i.batch(p.createResources, {
namespace: p.input.selectedProject.metadata.name
}, "create").then(function(t) {
var n = [], r = !1;
if (t.failure.length > 0) r = !0, p.errorOccurred = !0, t.failure.forEach(function(e) {
n.push({
type: "error",
message: "Cannot create " + k(e.object.kind) + ' "' + e.object.metadata.name + '". ',
details: e.data.message
});
}), t.success.forEach(function(e) {
n.push({
type: "success",
message: "Created " + k(e.kind) + ' "' + e.metadata.name + '" successfully. '
});
}); else {
var a;
a = p.isList ? "All items in list were created successfully." : k(p.resourceKind) + " " + p.resourceName + " was successfully created.", n.push({
type: "success",
message: a
});
}
e.resolve({
alerts: n,
hasErrors: r
});
}), e.promise;
});
}
function P() {
var e = {
started: "Updating resources in project " + A(p.input.selectedProject),
success: "Updated resources in project " + A(p.input.selectedProject),
failure: "Failed to update some resources in project " + A(p.input.selectedProject)
}, t = {};
d.add(e, t, p.input.selectedProject.metadata.name, function() {
var e = n.defer();
return i.batch(p.updateResources, {
namespace: p.input.selectedProject.metadata.name
}, "update").then(function(t) {
var n = [], r = !1;
if (t.failure.length > 0) r = !0, p.errorOccurred = !0, t.failure.forEach(function(e) {
n.push({
type: "error",
message: "Cannot update " + k(e.object.kind) + ' "' + e.object.metadata.name + '". ',
details: e.data.message
});
}), t.success.forEach(function(e) {
n.push({
type: "success",
message: "Updated " + k(e.kind) + ' "' + e.metadata.name + '" successfully. '
});
}); else {
var a;
a = p.isList ? "All items in list were updated successfully." : k(p.resourceKind) + " " + p.resourceName + " was successfully updated.", n.push({
type: "success",
message: a
});
}
e.resolve({
alerts: n,
hasErrors: r
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
var j;
p.noProjectsCantCreate = !1;
var k = e("humanizeKind"), I = e("getErrorDetails");
d.clear(), p.$on("no-projects-cannot-create", function() {
p.noProjectsCantCreate = !0;
}), p.input = {
selectedProject: p.project
}, p.$watch("input.selectedProject.metadata.name", function() {
p.projectNameTaken = !1;
}), p.aceLoaded = function(e) {
(j = e.getSession()).setOption("tabSize", 2), j.setOption("useSoftTabs", !0), e.setDragDelay = 0, e.$blockScrolling = 1 / 0;
};
var R = function(e) {
r.open({
templateUrl: "views/modals/confirm.html",
controller: "ConfirmModalController",
resolve: {
modalConfig: function() {
return {
alerts: e,
title: "Confirm Creation",
details: "We checked your application for potential problems. Please confirm you still want to create this application.",
okButtonText: "Create Anyway",
okButtonClass: "btn-danger",
cancelButtonText: "Cancel"
};
}
}
}).result.then(y);
}, T = {}, E = function() {
c.hideNotification("from-file-error"), _.each(T, function(e) {
!e.id || "error" !== e.type && "warning" !== e.type || c.hideNotification(e.id);
});
}, N = function(e) {
E(), T = u.getSecurityAlerts(p.createResources, p.input.selectedProject.metadata.name);
var t = e.quotaAlerts || [];
T = T.concat(t), _.filter(T, {
type: "error"
}).length ? (_.each(T, function(e) {
e.id = _.uniqueId("from-file-alert-"), c.addNotification(e);
}), p.disableInputs = !1) : T.length ? (R(T), p.disableInputs = !1) : y();
}, D = function() {
if (_.has(p.input.selectedProject, "metadata.uid")) return n.when(p.input.selectedProject);
var t = p.input.selectedProject.metadata.name, r = p.input.selectedProject.metadata.annotations["new-display-name"], a = e("description")(p.input.selectedProject);
return m.create(t, r, a);
};
p.create = function() {
if (delete p.error, f(p.resource) && (p.resourceKind = p.resource.kind, p.resourceKind.endsWith("List") ? p.isList = !0 : p.isList = !1, g(p.resource))) {
p.isList ? (p.resourceList = p.resource.items, p.resourceName = "") : (p.resourceList = [ p.resource ], p.resourceName = p.resource.metadata.name, "Template" === p.resourceKind && (p.templateOptions = {
process: !0,
add: !1
})), p.updateResources = [], p.createResources = [];
var e = [];
p.errorOccurred = !1, _.forEach(p.resourceList, function(t) {
if (!g(t)) return p.errorOccurred = !0, !1;
e.push(S(t));
}), D().then(function(t) {
p.input.selectedProject = t, n.all(e).then(function() {
p.errorOccurred || (1 === p.createResources.length && "Template" === p.resourceList[0].kind ? v() : _.isEmpty(p.updateResources) ? l.getLatestQuotaAlerts(p.createResources, {
namespace: p.input.selectedProject.metadata.name
}).then(N) : (p.updateTemplate = 1 === p.updateResources.length && "Template" === p.updateResources[0].kind, p.updateTemplate ? v() : h()));
});
}, function(e) {
"AlreadyExists" === e.data.reason ? p.projectNameTaken = !0 : c.addNotification({
id: "import-create-project-error",
type: "error",
message: "An error occurred creating project.",
details: I(e)
});
});
}
}, p.cancel = function() {
E(), s.toProjectOverview(p.input.selectedProject.metadata.name);
};
var A = e("displayName");
p.$on("importFileFromYAMLOrJSON", p.create), p.$on("$destroy", E);
} ]
};
} ]), angular.module("openshiftConsole").directive("oscFileInput", [ "Logger", function(e) {
return {
restrict: "E",
scope: {
model: "=",
required: "<",
disabled: "<ngDisabled",
readonly: "<ngReadonly",
showTextArea: "<",
hideClear: "<?",
helpText: "@?",
dropZoneId: "@?",
onFileAdded: "<?"
},
templateUrl: "views/directives/osc-file-input.html",
link: function(t, n) {
function r(n) {
var r = new FileReader();
r.onloadend = function() {
t.$apply(function() {
t.fileName = n.name, t.model = r.result;
var e = t.onFileAdded;
_.isFunction(e) && e(r.result), r.error || (t.uploadError = !1);
});
}, r.onerror = function(n) {
t.uploadError = !0, e.error("Could not read file", n);
}, r.readAsText(n);
}
function a() {
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
return n.length > 0 && (t.file = _.head(n), r(t.file)), a(), $(".drag-and-drop-zone").trigger("putDropZoneFront", !1), $(".drag-and-drop-zone").trigger("reset"), !1;
}
});
var o = function(e, t) {
var n = t.find("label").outerHeight(), r = n ? t.outerHeight() - n : t.outerHeight(), a = t.outerWidth();
e.css({
width: a + 6,
height: r,
position: "absolute",
"z-index": 100
});
};
e.on("putDropZoneFront", function(e, r) {
if (!t.disabled) {
var a, i = n.find(".drag-and-drop-zone");
return r ? (a = t.dropZoneId ? $("#" + t.dropZoneId) : n, o(i, a)) : i.css("z-index", "-1"), !1;
}
}), e.on("reset", function() {
if (!t.disabled) return c = !1, !1;
});
}), $(document).on("drop." + o, function() {
return a(), n.find(".drag-and-drop-zone").trigger("putDropZoneFront", !1), !1;
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
r(l[0].files[0]), l[0].value = "";
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
var n = e("isAbsoluteURL"), r = e("githubLink");
t.$watchGroup([ "uri", "ref", "contextDir" ], function() {
t.gitLink = r(t.uri, t.ref, t.contextDir), t.isLink = n(t.gitLink);
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
link: function(r, a, o, i) {
r.form = i, r.controls = {}, r.options = {
secureRoute: !1,
alternateServices: !1
};
var s = {
group: "route.openshift.io",
resource: "routes/custom-host"
};
r.canICreateCustomHosts = e("canI")(s, "create"), r.canIUpdateCustomHosts = e("canI")(s, "update");
var c = function() {
return r.existingRoute ? r.canIUpdateCustomHosts : r.canICreateCustomHosts;
};
r.isHostnameReadOnly = function() {
return !c();
}, r.disableWildcards = t.DISABLE_WILDCARD_ROUTES || r.existingRoute && "Subdomain" !== r.route.wildcardPolicy, r.areCertificateInputsReadOnly = function() {
return !r.canICreateCustomHosts;
}, r.areCertificateInputsDisabled = function() {
var e = _.get(r, "route.tls.termination");
return !e || "passthrough" === e;
}, r.isDestinationCACertInputDisabled = function() {
return "reencrypt" !== _.get(r, "route.tls.termination");
}, r.insecureTrafficOptions = [ {
value: "",
label: "None"
}, {
value: "Allow",
label: "Allow"
}, {
value: "Redirect",
label: "Redirect"
} ], _.has(r, "route.tls.insecureEdgeTerminationPolicy") || _.set(r, "route.tls.insecureEdgeTerminationPolicy", "");
r.$watchGroup([ "route.tls.termination", "route.tls.insecureEdgeTerminationPolicy" ], function() {
var e = "passthrough" !== _.get(r, "route.tls.termination") || "Allow" !== _.get(r, "route.tls.insecureEdgeTerminationPolicy");
r.routeForm.insecureTraffic.$setValidity("passthrough", e);
}), r.nameValidation = n, r.disableWildcards ? r.hostnamePattern = n.pattern : r.hostnamePattern = /^(\*(\.[a-z0-9]([-a-z0-9]*[a-z0-9]))+|[a-z0-9]([-a-z0-9]*[a-z0-9])?(\.[a-z0-9]([-a-z0-9]*[a-z0-9])?)*)$/, r.hostnameMaxLength = n.maxlength;
var l = function(e) {
if (e) {
var t = _.get(e, "spec.ports", []);
r.unnamedServicePort = 1 === t.length && !t[0].name, t.length && !r.unnamedServicePort ? r.route.portOptions = _.map(t, function(e) {
return {
port: e.name,
label: e.port + " → " + e.targetPort + " (" + e.protocol + ")"
};
}) : r.route.portOptions = [];
}
};
r.services && !r.route.service && (r.route.service = _.find(r.services)), r.servicesByName, r.services ? r.servicesByName = _.keyBy(r.services, "metadata.name") : r.servicesByName = {}, r.$watch("route.to.name", function(e, t) {
l(r.servicesByName[e]), e === t && r.route.targetPort || (r.route.targetPort = _.get(r, "route.portOptions[0].port")), r.services && (r.alternateServiceOptions = _.reject(r.services, function(t) {
return e === t.metadata.name;
}));
}), r.$watch("route.alternateServices", function(e) {
r.duplicateServices = _(e).map("name").filter(function(e, t, n) {
return _.includes(n, e, t + 1);
}).value(), i.$setValidity("duplicateServices", !r.duplicateServices.length), r.options.alternateServices = !_.isEmpty(e);
}, !0);
var u = function() {
return !!r.route.tls && ((!r.route.tls.termination || "passthrough" === r.route.tls.termination) && (r.route.tls.certificate || r.route.tls.key || r.route.tls.caCertificate || r.route.tls.destinationCACertificate));
};
r.$watch("route.tls.termination", function() {
r.options.secureRoute = !!_.get(r, "route.tls.termination"), r.showCertificatesNotUsedWarning = u();
});
var d;
r.$watch("options.secureRoute", function(e, t) {
if (e !== t) {
var n = _.get(r, "route.tls.termination");
!r.securetRoute && n && (d = n, delete r.route.tls.termination), r.options.secureRoute && !n && _.set(r, "route.tls.termination", d || "edge");
}
}), r.$watch("options.alternateServices", function(e, t) {
e !== t && (e || (r.route.alternateServices = []), e && _.isEmpty(r.route.alternateServices) && r.addAlternateService());
}), r.addAlternateService = function() {
r.route.alternateServices = r.route.alternateServices || [];
var e = _.find(r.services, function(e) {
return e.metadata.name !== r.route.to.service && !_.some(r.route.alternateServices, {
service: e.metadata.name
});
});
_.has(r, "route.to.weight") || _.set(r, "route.to.weight", 1), r.route.alternateServices.push({
service: e.metadata.name,
weight: 1
});
}, r.weightAsPercentage = function(e, t) {
e = e || 0;
var n = _.get(r, "route.to.weight", 0);
if (_.each(r.route.alternateServices, function(e) {
n += _.get(e, "weight", 0);
}), !n) return "";
var a = e / n * 100;
return t ? d3.round(a, 1) + "%" : a;
};
var m = !1;
r.$watch("route.alternateServices.length", function(e) {
if (0 === e && _.has(r, "route.to.weight") && delete r.route.to.weight, 1 === e) {
if (0 === r.route.to.weight && 0 === r.route.alternateServices[0].weight) return void (r.controls.hideSlider = !0);
m = !0, r.controls.rangeSlider = r.weightAsPercentage(r.route.to.weight);
}
}), r.$watch("controls.hideSlider", function(e) {
e || 1 !== _.size(r.route.alternateServices) || (m = !0, r.controls.rangeSlider = r.weightAsPercentage(r.route.to.weight));
}), r.$watch("controls.rangeSlider", function(e, t) {
m ? m = !1 : e !== t && (e = parseInt(e, 10), _.set(r, "route.to.weight", e), _.set(r, "route.alternateServices[0].weight", 100 - e));
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
link: function(e, t, n, r) {
e.form = r, e.id = _.uniqueId("osc-routing-service-"), e.$watchGroup([ "model.name", "serviceOptions" ], function() {
if (_.isEmpty(e.serviceOptions)) e.optionsNames = []; else {
var t = _.get(e, "model.name");
e.optionNames = [], e.selectedExists = !1, e.optionNames = _.map(e.serviceOptions, "metadata.name"), t && !e.allServices[t] && e.optionNames.push(t), t || _.set(e, "model.name", _.head(e.optionNames));
}
});
}
};
}), angular.module("openshiftConsole").directive("oscPersistentVolumeClaim", [ "$filter", "APIService", "DataService", "LimitRangesService", "QuotaService", "ModalsService", "DNS1123_SUBDOMAIN_VALIDATION", function(e, t, n, r, a, o, i) {
var s = t.getPreferredVersion("storageclasses"), c = t.getPreferredVersion("limitranges"), l = t.getPreferredVersion("resourcequotas"), u = t.getPreferredVersion("appliedclusterresourcequotas");
return {
restrict: "E",
scope: {
claim: "=model",
projectName: "="
},
templateUrl: "views/directives/osc-persistent-volume-claim.html",
link: function(t) {
var d = e("amountAndUnit"), m = e("usageValue");
t.nameValidation = i, t.storageClasses = [], t.defaultStorageClass = "", t.claim.unit = "Gi", t.units = [ {
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
} ], t.claim.selectedLabels = [];
var p = [];
t.$watch("useLabels", function(e, n) {
e !== n && (e ? t.claim.selectedLabels = p : (p = t.claim.selectedLabels, t.claim.selectedLabels = []));
}), t.groupUnits = function(e) {
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
}, t.showComputeUnitsHelp = function() {
o.showComputeUnitsHelp();
};
var f = function() {
var e = t.claim.amount && m(t.claim.amount + t.claim.unit), n = _.has(t, "limits.min") && m(t.limits.min), r = _.has(t, "limits.max") && m(t.limits.max), a = !0, o = !0;
e && n && (a = e >= n), e && r && (o = e <= r), t.persistentVolumeClaimForm.capacity.$setValidity("limitRangeMin", a), t.persistentVolumeClaimForm.capacity.$setValidity("limitRangeMax", o);
}, g = function() {
var e = a.isAnyStorageQuotaExceeded(t.quotas, t.clusterQuotas), n = a.willRequestExceedQuota(t.quotas, t.clusterQuotas, "requests.storage", t.claim.amount + t.claim.unit);
t.persistentVolumeClaimForm.capacity.$setValidity("willExceedStorage", !n), t.persistentVolumeClaimForm.capacity.$setValidity("outOfClaims", !e);
};
n.list(s, {}, function(n) {
var r = n.by("metadata.name");
if (!_.isEmpty(r)) {
t.storageClasses = _.sortBy(r, "metadata.name");
var a = e("annotation");
if (t.defaultStorageClass = _.find(t.storageClasses, function(e) {
return "true" === a(e, "storageclass.beta.kubernetes.io/is-default-class");
}), t.defaultStorageClass) t.claim.storageClass = t.defaultStorageClass; else {
var o = {
metadata: {
name: "No Storage Class",
labels: {},
annotations: {
description: "No storage class will be assigned"
}
}
};
t.storageClasses.unshift(o);
}
}
}, {
errorNotification: !1
}), n.list(c, {
namespace: t.projectName
}, function(e) {
var n = e.by("metadata.name");
if (!_.isEmpty(n)) {
t.limits = r.getEffectiveLimitRange(n, "storage", "PersistentVolumeClaim");
var a;
t.limits.min && t.limits.max && m(t.limits.min) === m(t.limits.max) && (a = d(t.limits.max), t.claim.amount = Number(a[0]), t.claim.unit = a[1], t.capacityReadOnly = !0), t.$watchGroup([ "claim.amount", "claim.unit" ], f);
}
}), n.list(l, {
namespace: t.projectName
}, function(e) {
t.quotas = e.by("metadata.name"), t.$watchGroup([ "claim.amount", "claim.unit" ], g);
}), n.list(u, {
namespace: t.projectName
}, function(e) {
t.clusterQuotas = e.by("metadata.name");
});
}
};
} ]), angular.module("openshiftConsole").directive("oscAutoscaling", [ "Constants", "HPAService", "DNS1123_SUBDOMAIN_VALIDATION", function(e, t, n) {
return {
restrict: "E",
scope: {
autoscaling: "=model",
showNameInput: "=?",
nameReadOnly: "=?",
showRequestInput: "=?"
},
templateUrl: "views/directives/osc-autoscaling.html",
link: function(t, r, a) {
t.nameValidation = n;
var o = e.DEFAULT_HPA_CPU_TARGET_PERCENT, i = _.get(t, "autoscaling.targetCPU");
_.isNil(i) && o && _.set(t, "autoscaling.targetCPU", o), "showRequestInput" in a || (t.showRequestInput = !0);
}
};
} ]), angular.module("openshiftConsole").directive("oscSecrets", [ "$uibModal", "$filter", "APIService", "DataService", "SecretsService", function(e, t, n, r, a) {
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
t.secretsVersion = n.getPreferredVersion("secrets"), t.canAddSourceSecret = function() {
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
templateUrl: "views/modals/create-secret.html",
controller: "CreateSecretModalController",
scope: t
}).result.then(function(e) {
r.list(t.secretsVersion, {
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
} ]), angular.module("openshiftConsole").directive("oscSourceSecrets", [ "$uibModal", "$filter", "APIService", "DataService", "SecretsService", function(e, t, n, r, a) {
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
t.secretsVersion = n.getPreferredVersion("secrets"), t.canAddSourceSecret = function() {
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
templateUrl: "views/modals/create-secret.html",
controller: "CreateSecretModalController",
scope: t
}).result.then(function(e) {
r.list(t.secretsVersion, {
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
var n = e("isContainerTerminatedSuccessfully"), r = function(e) {
return _.every(e, n);
};
t.$watch("pod", function(e) {
t.initContainersTerminated = r(e.status.initContainerStatuses), !1 !== t.expandInitContainers && (t.expandInitContainers = !t.initContainersTerminated);
}), t.toggleInitContainer = function() {
t.expandInitContainers = !t.expandInitContainers;
}, t.showDebugAction = function(n) {
if ("Completed" === _.get(t.pod, "status.phase")) return !1;
if (e("annotation")(t.pod, "openshift.io/build.name")) return !1;
if (e("isDebugPod")(t.pod)) return !1;
var r = _.get(n, "state.waiting.reason");
return "ImagePullBackOff" !== r && "ErrImagePull" !== r && (!_.get(n, "state.running") || !n.ready);
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
detailed: "=?"
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
var n = e("orderObjectsByDate"), r = _.debounce(function(e) {
t.$evalAsync(function() {
t.sortedPods = n(e, !0);
});
}, 150, {
maxWait: 500
});
t.$watch("pods", r);
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
controller: [ "$filter", "APIService", "BindingService", "CatalogService", "DataService", ResourceServiceBindings ],
controllerAs: "$ctrl",
bindings: {
project: "<",
projectContext: "<",
apiObject: "<",
createBinding: "&"
},
templateUrl: "views/directives/resource-service-bindings.html"
}), angular.module("openshiftConsole").component("serviceInstanceBindings", {
controller: [ "$filter", "APIService", "BindingService", ServiceInstanceBindings ],
controllerAs: "$ctrl",
bindings: {
isOverview: "<?",
showHeader: "<?",
project: "<",
bindings: "<",
serviceInstance: "<",
serviceClass: "<",
servicePlan: "<"
},
templateUrl: "views/directives/service-instance-bindings.html"
}), angular.module("openshiftConsole").directive("sidebar", [ "$location", "$filter", "$timeout", "$rootScope", "$routeParams", "AuthorizationService", "Constants", "HTMLService", function(e, t, n, r, a, o, i, s) {
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
l.projectName = a.project, _.set(l, "sidebar.secondaryOpen", !1), _.set(r, "nav.showMobileNav", !1), l.activeSecondary = null, l.activePrimary = _.find(l.navItems, function(t) {
return u = e.path().replace("/project/" + l.projectName, ""), c(t, u) ? (l.activeSecondary = null, !0) : _.some(t.secondaryNavSections, function(e) {
var t = _.find(e.items, function(e) {
return c(e, u);
});
return !!t && (l.activeSecondary = t, !0);
});
});
};
d(), l.$on("$routeChangeSuccess", d);
var m = function() {
_.each(l.navItems, function(e) {
e.isHover = !1;
});
};
l.navURL = function(e) {
return e ? t("isAbsoluteURL")(e) ? e : "project/" + l.projectName + e : "";
}, l.show = function(e) {
return !(e.isValid && !e.isValid()) && (!e.canI || (e.canI.addToProject ? l.canIAddToProject : o.canI({
resource: e.canI.resource,
group: e.canI.group
}, e.canI.verb, l.projectName)));
}, l.itemClicked = function(e) {
if (m(), e.href) return l.nav.showMobileNav = !1, void (l.sidebar.secondaryOpen = !1);
e.isHover = !0, e.mobileSecondary = l.isMobile, l.sidebar.showMobileSecondary = l.isMobile, l.sidebar.secondaryOpen = !0;
}, l.onMouseEnter = function(e) {
e.mouseLeaveTimeout && (n.cancel(e.mouseLeaveTimeout), e.mouseLeaveTimeout = null), e.mouseEnterTimeout = n(function() {
e.isHover = !0, e.mouseEnterTimeout = null, l.sidebar.secondaryOpen = !_.isEmpty(e.secondaryNavSections);
}, 200);
}, l.onMouseLeave = function(e) {
e.mouseEnterTimeout && (n.cancel(e.mouseEnterTimeout), e.mouseEnterTimeout = null), e.mouseLeaveTimeout = n(function() {
e.isHover = !1, e.mouseLeaveTimeout = null, l.sidebar.secondaryOpen = _.some(l.navItems, function(e) {
return e.isHover && !_.isEmpty(e.secondaryNavSections);
});
}, 300);
}, l.closeNav = function() {
m(), l.nav.showMobileNav = !1, l.sidebar.secondaryOpen = !1;
}, l.collapseMobileSecondary = function(e, t) {
e.mobileSecondary = !1, t.stopPropagation();
};
var p = function() {
return s.isWindowBelowBreakpoint(s.WINDOW_SIZE_SM);
};
l.isMobile = p();
var f = _.throttle(function() {
var e = p();
e !== l.isMobile && l.$evalAsync(function() {
l.isMobile = e, e || (_.set(r, "nav.showMobileNav", !1), _.each(l.navItems, function(e) {
e.mobileSecondary = !1;
}));
});
}, 50);
$(window).on("resize.verticalnav", f), l.$on("$destroy", function() {
$(window).off(".verticalnav");
});
} ]
};
} ]).directive("oscHeader", [ "$filter", "$location", "$q", "$rootScope", "$routeParams", "$timeout", "APIService", "AuthorizationService", "Catalog", "CatalogService", "Constants", "DataService", "Navigate", "NotificationsService", "ProjectsService", "projectOverviewURLFilter", "RecentlyViewedServiceItems", function(e, t, n, r, a, o, i, s, c, l, u, d, m, p, f, g, v) {
var h = {}, y = [], b = e("displayName"), S = e("uniqueDisplayName"), C = i.getPreferredVersion("templates");
return {
restrict: "EA",
templateUrl: "views/directives/header/header.html",
link: function(i, p) {
i.currentProject = h[a.project];
var w = function(e, t) {
var n;
_.set(r, "nav.collapsed", e), t && (n = e ? "true" : "false", localStorage.setItem("openshift/vertical-nav-collapsed", n));
};
!function() {
var e = "true" === localStorage.getItem("openshift/vertical-nav-collapsed");
w(e);
}();
var P = function() {
return _.get(r, "nav.collapsed", !1);
}, j = function(e) {
_.set(r, "nav.showMobileNav", e);
};
i.toggleNav = function() {
var e = P();
w(!e, !0);
}, i.toggleMobileNav = function() {
var e = _.get(r, "nav.showMobileNav");
j(!e);
}, i.closeMobileNav = function() {
j(!1);
}, i.closeOrderingPanel = function() {
i.orderingPanelVisible = !1;
}, i.showOrderingPanel = function(e) {
i.orderingPanelVisible = !0, i.orderKind = e;
}, i.onSearchToggle = function(e) {
_.set(r, "view.hasProjectSearch", e);
}, i.catalogLandingPageEnabled = !u.DISABLE_SERVICE_CATALOG_LANDING_PAGE;
var k = p.find(".selectpicker"), I = [], R = function() {
var t = i.currentProjectName;
if (t) {
var n = function(e, n) {
var r = $("<option>").attr("value", e.metadata.name).attr("selected", e.metadata.name === t);
return n ? r.text(b(e)) : r.text(S(e, y)), r;
};
_.size(h) <= 100 ? (y = e("orderByDisplayName")(h), I = _.map(y, function(e) {
return n(e, !1);
})) : I = [ n(h[t], !0) ], k.empty(), k.append(I), k.append($('<option data-divider="true"></option>')), k.append($('<option value="">View All Projects</option>')), k.selectpicker("refresh");
}
}, T = function() {
return f.list().then(function(e) {
h = e.by("metadata.name");
});
}, E = function() {
var e = a.project;
if (i.currentProjectName !== e) {
i.currentProjectName = e, i.chromeless = "chromeless" === a.view;
var t, o;
e && !i.chromeless ? (_.set(r, "view.hasProject", !0), i.canIAddToProject = !1, s.getProjectRules(e).then(function() {
if (i.currentProjectName === e && (i.canIAddToProject = s.canIAddToProject(e), i.canIAddToProject)) {
var r = l.getCatalogItems().then(function(e) {
t = e;
}), a = c.getProjectCatalogItems(e).then(_.spread(function(e) {
o = e;
}));
n.all([ r, a ]).then(function() {
i.catalogItems = c.sortCatalogItems(_.concat(t, o));
});
}
}), T().then(function() {
i.currentProjectName && h && (h[i.currentProjectName] || (h[i.currentProjectName] = {
metadata: {
name: i.currentProjectName
}
}), i.currentProject = h[i.currentProjectName], R());
})) : _.set(r, "view.hasProject", !1);
}
}, N = function() {
i.orderingPanelVisible && v.addItem(_.get(i.selectedItem, "resource.metadata.uid"));
}, D = function(e) {
return "PartialObjectMetadata" === e.kind;
}, A = function(e) {
return D(e) ? d.get(C, e.metadata.name, {
namespace: e.metadata.namespace
}) : n.when(e);
};
i.$on("open-overlay-panel", function(e, t) {
i.currentProjectName && (i.servicePlansForItem = null, i.orderKind = _.get(t, "kind"), "Template" !== i.orderKind ? "ClusterServiceClass" !== i.orderKind ? o(function() {
i.selectedItem = t, i.orderingPanelVisible = !0;
}) : c.getServicePlansForServiceClass(_.get(t, "resource.metadata.name")).then(function(e) {
i.servicePlansForItem = _.reject(e.by("metadata.name"), {
status: {
removedFromBrokerCatalog: !0
}
}), i.selectedItem = t, i.orderingPanelVisible = !0;
}) : A(t.resource).then(function(e) {
i.selectedItem = e, i.orderingPanelVisible = !0, i.orderKind = "Template";
}));
});
var B = r.$on("filter-catalog-items", function(e, t) {
if (i.currentProjectName) {
var n = {
filter: t.searchText
};
m.toProjectCatalog(i.currentProjectName, n);
}
});
i.closeOrderingPanel = function() {
v.addItem(_.get(i.selectedItem, "resource.metadata.uid")), i.orderingPanelVisible = !1;
}, E(), i.$on("$routeChangeSuccess", E), k.selectpicker({
iconBase: "fa",
tickIcon: "fa-check"
}).change(function() {
var e = $(this).val(), n = "" === e ? "projects" : g(e);
i.$apply(function() {
t.url(n);
});
}), i.$on("$destroy", function() {
B(), N();
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
var r = {};
e.each(function(e, t) {
var n = $(t).find("a");
n.each(function(e, n) {
n.href && (r[n.href] = t);
}), n.contents().filter(function() {
return 3 === this.nodeType && $.trim(this.nodeValue).length;
}).wrap('<span class="list-group-item-value"/>');
});
var a = function() {
e.removeClass("active");
var t = r[window.location.href];
t && $(t).addClass("active");
};
a(), t.$on("$routeChangeSuccess", a);
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
} ]), angular.module("openshiftConsole").component("alerts", {
bindings: {
alerts: "=",
filter: "<?",
hideCloseButton: "<?"
},
templateUrl: "components/alerts/alerts.html",
controller: function() {
var e = this;
e.close = function(e) {
e.hidden = !0, _.isFunction(e.onClose) && e.onClose();
}, e.onClick = function(t, n) {
_.isFunction(n.onClick) && n.onClick() && e.close(t);
};
}
}), function() {
angular.module("openshiftConsole").component("oscWebhookTriggers", {
controller: [ "$filter", "$scope", "$timeout", "$uibModal", "APIService", function(e, t, n, r, a) {
var o = this;
o.isDeprecated = function(t) {
var n = e("getWebhookSecretData")(t);
return _.has(n, "secret") && !_.has(n, "secretReference.name");
}, o.addEmptyWebhookTrigger = function() {
o.webhookTriggers.push({
lastTriggerType: "",
data: {
type: ""
}
});
var e = o.webhookTriggers.length - 1;
n(function() {
t.$broadcast("focus-index-" + e);
});
};
var i = function(e) {
var t = _.get(e, "data.type");
if (t && !_.isNil(e.data[t.toLowerCase()])) {
var n = _.filter(o.webhookTriggers, function(t) {
return _.isEqual(t.data, e.data);
});
_.each(n, function(e, t) {
var n = 0 === t;
e.isDuplicate = !n;
});
}
}, s = function() {
_.isEmpty(o.webhookTriggers) ? o.addEmptyWebhookTrigger() : _.each(o.webhookTriggers, function(e) {
o.isDeprecated(e) && (e.secretInputType = "password"), e.isDuplicate || i(e);
});
};
o.$onInit = function() {
t.namespace = o.namespace, t.type = o.type, o.secretsVersion = a.getPreferredVersion("secrets"), o.webhookTypesOptions = [ {
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
} ], s();
}, o.toggleSecretInputType = function(e) {
e.secretInputType = "password" === e.secretInputType ? "text" : "password";
}, o.removeWebhookTrigger = function(e, t) {
var n = _.clone(e);
if (1 === o.webhookTriggers.length) {
var r = _.first(o.webhookTriggers);
r.lastTriggerType = "", r.data = {
type: ""
};
} else o.webhookTriggers.splice(t, 1);
o.form.$setDirty(), i(n);
}, o.triggerTypeChange = function(e) {
var t = _.toLower(e.lastTriggerType), n = _.toLower(e.data.type);
e.data[n] = e.data[t], delete e.data[t], e.lastTriggerType = e.data.type, i(e);
}, o.triggerSecretChange = function(e) {
i(e);
}, o.openCreateWebhookSecretModal = function() {
r.open({
templateUrl: "views/modals/create-secret.html",
controller: "CreateSecretModalController",
scope: t
}).result.then(function(e) {
o.webhookSecrets.push(e);
});
};
} ],
controllerAs: "$ctrl",
bindings: {
webhookSecrets: "<",
namespace: "<",
type: "@",
webhookTriggers: "=",
form: "="
},
templateUrl: "components/osc-webhook-triggers/osc-webhook-triggers.html"
});
}(), angular.module("openshiftConsole").directive("parseError", function() {
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
var n, r = "", a = e(t.pod);
for (n = 0; n < _.size(a); n++) r && (r += "<br>"), "error" === a[n].severity && (t.hasError = !0), r += a[n].message;
t.content = r;
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
var n = $("a", t), r = n.get(0);
e.inputText && (r = n.get(1));
var a = new Clipboard(r);
a.on("success", function(e) {
$(e.trigger).attr("title", "Copied!").tooltip("fixTitle").tooltip("show").attr("title", "Copy to Clipboard").tooltip("fixTitle"), e.clearSelection();
}), a.on("error", function(e) {
var t = /Mac/i.test(navigator.userAgent) ? "Press ⌘C to copy" : "Press Ctrl-C to copy";
$(e.trigger).attr("title", t).tooltip("fixTitle").tooltip("show").attr("title", "Copy to Clipboard").tooltip("fixTitle");
}), t.on("$destroy", function() {
a.destroy();
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
var r = new Clipboard(n.get(0));
r.on("success", function() {
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
}), r.on("error", function() {
e.addNotification({
id: "copy-login-command-error",
type: "error",
message: "Unable to copy the login command."
});
}), n.on("$destroy", function() {
r.destroy();
});
}
};
} ]).directive("setHomePage", [ "$uibModal", function(e) {
return {
restrict: "E",
replace: !0,
template: '<a href="">Set Home Page</a>',
link: function(t, n) {
n.bind("click", function() {
e.open({
templateUrl: "views/modals/set-home-page-modal.html",
controller: "SetHomePageModalController"
});
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
}).directive("customIcon", [ "$filter", function(e) {
return {
restrict: "E",
scope: {
resource: "=",
kind: "@",
tag: "=?"
},
controller: [ "$scope", function(t) {
t.$watchGroup([ "resource", "tag" ], function() {
t.tag ? t.icon = e("imageStreamTagAnnotation")(t.resource, "icon", t.tag) : t.icon = e("annotation")(t.resource, "icon"), t.icon && 0 === t.icon.indexOf("data:") ? t.image = t.icon : (t.tag ? t.icon = e("imageStreamTagIconClass")(t.resource, t.tag) : t.icon = e("iconClass")(t.resource, t.kind), t.image = e("imageForIconClass")(t.icon));
});
} ],
templateUrl: "views/directives/_custom-icon.html"
};
} ]).directive("bottomOfWindow", function() {
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
var r = t.search();
r.tab = e[0], t.replace().search(r);
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
link: function(r) {
r.filterAndNavigate = function(a, o) {
r.kind && r.projectName && (r.filterCurrentPage || e.url(r.navigateUrl || "/project/" + r.projectName + "/browse/" + r.kind), t(function() {
var e = {};
e[a] = o, n.setLabelSelector(new LabelSelector(e, !0));
}, 1));
};
}
};
} ]).directive("labelEditor", function() {
function e(e) {
return !(e.length > o) && a.test(e);
}
function t(e) {
return !(e.length > r) && n.test(e);
}
var n = /^(([A-Za-z0-9][-A-Za-z0-9_.]*)?[A-Za-z0-9])?$/, r = 63, a = /^[a-z0-9]([-a-z0-9]*[a-z0-9])?(\.[a-z0-9]([-a-z0-9]*[a-z0-9])?)*$/, o = 253;
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
var r = {
test: function(n) {
var r = n.split("/");
switch (r.length) {
case 1:
return t(r[0]);

case 2:
return e(r[0]) && t(r[1]);
}
return !1;
}
};
angular.extend(n, {
validator: {
key: r,
value: r
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
}, r = function(t) {
var n = {};
if (_.isEmpty(t)) n = {
namespace: e.namespace,
imageStream: "",
tagObject: null
}; else {
var r = t.name.split(":");
n = {
namespace: t.namespace || e.namespace,
imageStream: r[0],
tagObject: {
tag: r[1]
}
};
}
return n;
}, a = function() {
"execNewPod" === e.action.type ? (_.has(e.removedHookParams, "execNewPod") ? e.hookParams.execNewPod = e.removedHookParams.execNewPod : e.hookParams.execNewPod = _.get(e, "hookParams.execNewPod", {}), e.hookParams.execNewPod = _.merge(angular.copy(t), e.hookParams.execNewPod)) : (_.has(e.removedHookParams, "tagImages") ? e.hookParams.tagImages = e.removedHookParams.tagImages : e.hookParams.tagImages = _.get(e, "hookParams.tagImages", [ {} ]), e.hookParams.tagImages = [ _.merge(angular.copy(n), e.hookParams.tagImages[0]) ], e.istagHook = r(_.head(e.hookParams.tagImages).to)), e.hookParams.failurePolicy = _.get(e.hookParams, "failurePolicy", "Abort");
};
e.addHook = function() {
_.isEmpty(e.removedHookParams) ? (e.hookParams = {}, a()) : e.hookParams = e.removedHookParams;
}, e.removeHook = function() {
e.removedHookParams = e.hookParams, delete e.hookParams, e.editForm.$setDirty();
};
e.$watchGroup([ "hookParams", "action.type" ], function() {
e.hookParams && ("execNewPod" === e.action.type ? (e.hookParams.tagImages && (e.removedHookParams.tagImages = e.hookParams.tagImages, delete e.hookParams.tagImages), a()) : "tagImages" === e.action.type && (e.hookParams.execNewPod && (e.removedHookParams.execNewPod = e.hookParams.execNewPod, delete e.hookParams.execNewPod), a()));
}), e.valueFromObjects = [], e.$watchGroup([ "availableSecrets", "availableConfigMaps" ], function() {
var t = e.availableConfigMaps || [], n = e.availableSecrets || [];
e.valueFromObjects = t.concat(n);
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
controller: [ "$filter", "$scope", "APIService", "ApplicationsService", "DataService", "Navigate", "NotificationsService", "StorageService", function(e, t, n, r, a, o, i, s) {
var c = this, l = e("humanizeKind"), u = function(e) {
var t = c.apiObject.metadata.name;
return "ConfigMap" === c.apiObject.kind ? _.some(e.envFrom, {
configMapRef: {
name: t
}
}) : _.some(e.envFrom, {
secretRef: {
name: t
}
});
};
c.checkApplicationContainersRefs = function(e) {
var t = _.get(e, "spec.template.spec.containers");
c.canAddRefToApplication = !_.every(t, u);
};
var d = function() {
var e = {
namespace: c.project.metadata.name
};
r.getApplications(e).then(function(e) {
c.applications = e, c.updating = !1;
});
};
c.$onInit = function() {
c.addType = "env", c.disableInputs = !1, d(), c.canAddRefToApplication = !0;
var e = new RegExp("^[A-Za-z_][A-Za-z0-9_]*$");
c.hasInvalidEnvVars = _.some(c.apiObject.data, function(t, n) {
return !e.test(n);
});
};
var m = function(e) {
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
var t = angular.copy(c.application), r = _.get(t, "spec.template");
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
c.envPrefix && (s.prefix = c.envPrefix), _.each(r.spec.containers, function(e) {
m(e) && !u(e) && (e.envFrom = e.envFrom || [], e.envFrom.push(s));
});
} else {
var l = e("generateName")(c.apiObject.metadata.name + "-"), d = {
name: l,
mountPath: c.mountVolume,
readOnly: !0
};
_.each(r.spec.containers, function(e) {
m(e) && (e.volumeMounts = e.volumeMounts || [], e.volumeMounts.push(d));
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
r.spec.volumes = r.spec.volumes || [], r.spec.volumes.push(p);
}
var f = e("humanizeKind"), g = f(c.apiObject.kind), v = f(t.kind), h = {
namespace: c.project.metadata.name
};
a.update(n.kindToResource(t.kind), t.metadata.name, t, h).then(function() {
i.addNotification({
type: "success",
message: "Successfully added " + g + " " + c.apiObject.metadata.name + " to " + v + " " + t.metadata.name + ".",
links: [ {
href: o.resourceURL(t),
label: "View " + f(t.kind, !0)
} ]
}), angular.isFunction(c.onComplete) && c.onComplete();
}, function(n) {
var r = e("getErrorDetails");
i.addNotification({
type: "error",
message: "An error occurred  adding " + g + " " + c.apiObject.metadata.name + " to " + v + " " + t.metadata.name + ". " + r(n)
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
}), angular.module("openshiftConsole").directive("catalog", [ "CatalogService", "Constants", "KeywordService", "Logger", function(e, t, n, r) {
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
link: function(a) {
function o() {
var t = a.keywords = n.generateKeywords(a.filter.keyword);
if (_.isEmpty(t)) return a.filterActive = !1, a.filteredBuildersByCategory = a.buildersByCategory, void (a.filteredTemplatesByCategory = a.templatesByCategory);
a.filterActive = !0, a.filteredBuildersByCategory = {}, _.each(a.buildersByCategory, function(n, r) {
var o = e.getCategoryItem(r), i = _.reject(t, function(e) {
return e.test(o.label);
});
a.filteredBuildersByCategory[r] = e.filterImageStreams(n, i);
}), a.filteredBuildersNoSubcategory = e.filterImageStreams(a.buildersNoSubcategory, t), a.filteredTemplatesByCategory = {}, _.each(a.templatesByCategory, function(n, r) {
var o = e.getCategoryItem(r), i = _.reject(t, function(e) {
return e.test(o.label);
});
a.filteredTemplatesByCategory[r] = e.filterTemplates(n, i);
}), a.filteredTemplatesNoSubcategory = e.filterTemplates(a.templatesNoSubcategory, t);
}
function i(e) {
var t = _.get(a, "parentCategory.subcategories", []);
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
var r = a.parentCategory.id;
return _.reject(e[r], function(e) {
var t = _.get(e, "metadata.uid");
return !!n[t];
});
}
function s() {
a.noFilterMatches = !0, u = [];
var e = {};
_.each(a.filteredBuildersByCategory, function(t, n) {
e[n] = _.size(t);
}), _.each(a.filteredTemplatesByCategory, function(t, n) {
e[n] = (e[n] || 0) + _.size(t);
}), a.allContentHidden = !0, _.each(a.categories, function(t) {
var n = !1;
_.each(t.items, function(t) {
e[t.id] && (u.push(t), n = !0);
}), _.set(a, [ "hasContent", t.id ], n), n && (a.allContentHidden = !1);
}), a.countByCategory = e, a.hasItemsNoSubcategory = !_.isEmpty(a.buildersNoSubcategory) || !_.isEmpty(a.templatesNoSubcategory), a.countFilteredNoSubcategory = _.size(a.filteredBuildersNoSubcategory) + _.size(a.filteredTemplatesNoSubcategory), a.countFilteredNoSubcategory && (a.allContentHidden = !1);
}
function c() {
return !!a.parentCategory && (1 === u.length && !a.hasItemsNoSubcategory);
}
function l() {
a.loaded = a.projectTemplates && a.openshiftTemplates && a.projectImageStreams && a.openshiftImageStreams, o(), s(), a.loaded && (c() && (a.singleCategory = _.head(u)), r.log("templates by category", a.templatesByCategory), r.log("builder images", a.buildersByCategory));
}
a.categories = _.get(a, "parentCategory.subcategories", t.CATALOG_CATEGORIES), a.loaded = !1, a.emptyCatalog = !0, a.filter = {
keyword: ""
}, a.$watch("filter.keyword", _.debounce(function() {
a.$apply(function() {
o(), s();
});
}, 200, {
maxWait: 1e3,
trailing: !0
}));
var u;
a.$watchGroup([ "openshiftImageStreams", "projectImageStreams" ], function() {
if (a.projectImageStreams && a.openshiftImageStreams) {
var t = _.toArray(a.projectImageStreams).concat(_.toArray(a.openshiftImageStreams));
a.buildersByCategory = e.categorizeImageStreams(t), a.buildersNoSubcategory = i(a.buildersByCategory), a.emptyCatalog = a.emptyCatalog && _.every(a.buildersByCategory, _.isEmpty) && _.isEmpty(a.buildersNoSubcategory), l();
}
}), a.$watchGroup([ "openshiftTemplates", "projectTemplates" ], function() {
if (a.projectTemplates && a.openshiftTemplates) {
var t = _.toArray(a.projectTemplates).concat(_.toArray(a.openshiftTemplates));
a.templatesByCategory = e.categorizeTemplates(t), a.templatesNoSubcategory = i(a.templatesByCategory), a.emptyCatalog = a.emptyCatalog && _.every(a.templatesByCategory, _.isEmpty) && _.isEmpty(a.templatesNoSubcategory), l();
}
});
}
};
} ]), angular.module("openshiftConsole").directive("categoryContent", [ "CatalogService", "Constants", "KeywordService", "Logger", function(e, t, n, r) {
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
function a() {
var r = t.keywords = n.generateKeywords(t.filter.keyword);
t.filteredBuilderImages = e.filterImageStreams(c, r), t.filteredTemplates = e.filterTemplates(l, r);
}
function o() {
return t.projectImageStreams && t.openshiftImageStreams ? _.toArray(t.projectImageStreams).concat(_.toArray(t.openshiftImageStreams)) : [];
}
function i() {
return t.projectTemplates && t.openshiftTemplates ? _.toArray(t.projectTemplates).concat(_.toArray(t.openshiftTemplates)) : [];
}
function s() {
t.loaded = t.projectTemplates && t.openshiftTemplates && t.projectImageStreams && t.openshiftImageStreams, a(), t.emptyCategory = _.isEmpty(c) && _.isEmpty(l), t.loaded && (r.log("templates", l), r.log("builder images", c));
}
var c = [], l = [];
t.filteredTemplates = [], t.filteredBuilderImages = [], t.loaded = !1, t.filter = {
keyword: ""
}, t.$watch("filter.keyword", a), t.$watchGroup([ "openshiftImageStreams", "projectImageStreams" ], function() {
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
var r = e("imageStreamTagTags"), a = {};
n.referencedBy = {};
var o = _.get(n, "imageStream.spec.tags", []), i = {};
_.each(o, function(e) {
i[e.name] = r(n.imageStream, e.name), t.referencesSameImageStream(e) && (a[e.name] = !0, n.referencedBy[e.from.name] = n.referencedBy[e.from.name] || [], n.referencedBy[e.from.name].push(e.name));
});
var s = function(e) {
var t = _.get(i, [ e ], []);
return _.includes(t, "builder") && !_.includes(t, "hidden");
};
n.$watch("imageStream.status.tags", function(e) {
n.tags = _.filter(e, function(e) {
return s(e.tag) && !a[e.tag];
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
}), angular.module("openshiftConsole").directive("podMetrics", [ "$filter", "$interval", "$parse", "$timeout", "$q", "$rootScope", "ChartsService", "ConversionService", "MetricsCharts", "MetricsService", "ModalsService", "usageValueFilter", function(e, t, n, r, a, o, i, s, c, l, u, d) {
return {
restrict: "E",
scope: {
pod: "=",
includedMetrics: "=?",
stackDonut: "=?",
alerts: "=?"
},
templateUrl: "views/directives/pod-metrics.html",
link: function(m) {
function p(e) {
if (!m.pod) return null;
var t = m.options.selectedContainer;
switch (e) {
case "memory/usage":
var n = E(t);
if (n) return s.bytesToMiB(d(n));
break;

case "cpu/usage_rate":
var r = N(t);
if (r) return d(r);
}
return null;
}
function f(e) {
var t = _.head(e.datasets);
if (t.total) {
var n, a = {
type: "donut",
columns: [ [ "Used", t.used ], [ "Available", Math.max(t.available, 0) ] ],
colors: {
Used: t.available > 0 ? "#0088ce" : "#ec7a08",
Available: "#d1d1d1"
}
};
R[t.id] ? R[t.id].load(a) : ((n = B(e)).data = a, r(function() {
A || (R[t.id] = c3.generate(n));
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
var n, a = c.getSparklineData(t), o = e.chartPrefix + "sparkline";
T[o] ? T[o].load(a) : ((n = L(e)).data = a, e.chartDataColors && (n.color = {
pattern: e.chartDataColors
}), r(function() {
A || (T[o] = c3.generate(n));
}));
}
}
function v() {
return "-" + m.options.timeRange.value + "mn";
}
function h() {
return 60 * m.options.timeRange.value * 1e3;
}
function y() {
return Math.floor(h() / D) + "ms";
}
function b(e, t, n) {
var r, a = {
metric: t.id,
type: t.type,
bucketDuration: y()
};
return t.data && t.data.length ? (r = _.last(t.data), a.start = r.end) : a.start = n, m.pod ? _.assign(a, {
namespace: m.pod.metadata.namespace,
pod: m.pod,
containerName: e.containerMetric ? m.options.selectedContainer.name : "pod"
}) : null;
}
function S() {
A || (V = 0, _.each(m.metrics, function(e) {
g(e), f(e);
}));
}
function C(e) {
if (!A) if (V++, m.noData) m.metricsError = {
status: _.get(e, "status", 0),
details: _.get(e, "data.errorMsg") || _.get(e, "statusText") || "Status code " + _.get(e, "status", 0)
}; else if (!(V < 2)) {
var t = "metrics-failed-" + m.uniqueID;
m.alerts[t] = {
type: "error",
message: "An error occurred updating metrics for pod " + _.get(m, "pod.metadata.name", "<unknown>") + ".",
links: [ {
href: "",
label: "Retry",
onClick: function() {
delete m.alerts[t], V = 1, k();
}
} ]
};
}
}
function w() {
return !(m.metricsError || V > 1) && (m.pod && _.get(m, "options.selectedContainer"));
}
function P(e, t, n) {
t.total = p(t.id), t.total && (m.hasLimits = !0);
var r = _.get(n, "usage.value");
isNaN(r) && (r = 0), e.convert && (r = e.convert(r)), t.used = d3.round(r, e.usagePrecision), t.total && (t.available = d3.round(t.total - r, e.usagePrecision)), e.totalUsed += t.used;
}
function j(e, t) {
m.noData = !1;
var n = _.initial(t.data);
e.data ? e.data = _.chain(e.data).takeRight(D).concat(n).value() : e.data = n;
}
function k() {
if (w()) {
var e = v(), t = [];
angular.forEach(m.metrics, function(n) {
var r = [];
n.totalUsed = 0, angular.forEach(n.datasets, function(a) {
var o = b(n, a, e);
if (o) {
var i = l.get(o);
r.push(i), p(a.id) && t.push(l.getCurrentUsage(o).then(function(e) {
P(n, a, e);
}));
}
}), t = t.concat(r), a.all(r).then(function(e) {
A || angular.forEach(e, function(e) {
e && j(_.find(n.datasets, {
id: e.metricID
}), e);
});
});
}), a.all(t).then(S, C).finally(function() {
m.loaded = !0;
});
}
}
m.includedMetrics = m.includedMetrics || [ "cpu", "memory", "network" ];
var I, R = {}, T = {}, E = n("resources.limits.memory"), N = n("resources.limits.cpu"), D = 30, A = !1;
m.uniqueID = c.uniqueID(), m.metrics = [], _.includes(m.includedMetrics, "memory") && m.metrics.push({
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
}), _.includes(m.includedMetrics, "cpu") && m.metrics.push({
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
}), _.includes(m.includedMetrics, "network") && m.metrics.push({
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
}), m.loaded = !1, m.noData = !0, m.showComputeUnitsHelp = function() {
u.showComputeUnitsHelp();
}, l.getMetricsURL().then(function(e) {
m.metricsURL = e;
}), m.options = {
rangeOptions: c.getTimeRangeOptions()
}, m.options.timeRange = _.head(m.options.rangeOptions);
var $ = e("upperFirst"), B = function(e) {
var t = "#" + e.chartPrefix + m.uniqueID + "-donut";
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
var t = e.chartPrefix + m.uniqueID + "-sparkline", n = c.getDefaultSparklineConfig(t, e.units);
return 1 === e.datasets.length && _.set(n, "legend.show", !1), n;
}, V = 0;
(window.OPENSHIFT_CONSTANTS.DISABLE_CUSTOM_METRICS ? a.when({}) : l.getCustomMetrics(m.pod).then(function(e) {
angular.forEach(e, function(e) {
var t = e.description || e.name, n = e.unit || "", r = "custom/" + e.id.replace(/.*\/custom\//, "");
m.metrics.push({
label: t,
units: n,
chartPrefix: "custom-" + _.uniqueId("custom-metric-"),
chartType: "spline",
datasets: [ {
id: r,
label: t,
type: e.type,
data: []
} ]
});
});
})).finally(function() {
m.$watch("options", function() {
_.each(m.metrics, function(e) {
_.each(e.datasets, function(e) {
delete e.data;
});
}), delete m.metricsError, k();
}, !0), I = t(k, c.getDefaultUpdateInterval(), !1);
});
var O = o.$on("metrics.charts.resize", function() {
c.redraw(R), c.redraw(T);
});
m.$on("$destroy", function() {
I && (t.cancel(I), I = null), O && (O(), O = null), angular.forEach(R, function(e) {
e.destroy();
}), R = null, angular.forEach(T, function(e) {
e.destroy();
}), T = null, A = !0;
});
}
};
} ]), angular.module("openshiftConsole").directive("deploymentMetrics", [ "$interval", "$parse", "$timeout", "$q", "$rootScope", "ChartsService", "ConversionService", "MetricsCharts", "MetricsService", "ModalsService", function(e, t, n, r, a, o, i, s, c, l) {
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
function r(e) {
var t, r = {}, a = [ "Date" ], o = [ t = w ? e.compactDatasetLabel || e.label : "Average Usage" ], i = [ a, o ], s = function(e) {
var t = "" + e.start;
return r[t] || (r[t] = {
total: 0,
count: 0
}), r[t];
};
return _.each(I[e.descriptor], function(e) {
_.each(e, function(e) {
var t = s(e);
(!j || j < e.end) && (j = e.end), n(e) || (t.total += e.value, t.count = t.count + 1);
});
}), _.each(r, function(t, n) {
var r;
r = t.count ? t.total / t.count : null, a.push(Number(n)), o.push(e.convert ? e.convert(r) : r);
}), o.length > 1 && (e.lastValue = _.last(o) || 0), i;
}
function o(e, a) {
var o = [], i = {
type: "spline"
};
return t.showAverage ? (_.each(e[a.descriptor], function(e, t) {
h(a.descriptor, t, e);
}), i.type = "area-spline", w && a.compactType && (i.type = a.compactType), i.x = "Date", i.columns = r(a), i) : (_.each(e[a.descriptor], function(e, t) {
h(a.descriptor, t, e);
var r = t + "-dates";
_.set(i, [ "xs", t ], r);
var s = [ r ], c = [ t ];
o.push(s), o.push(c), _.each(I[a.descriptor][t], function(e) {
if (s.push(e.start), (!j || j < e.end) && (j = e.end), n(e)) c.push(e.value); else {
var t = a.convert ? a.convert(e.value) : e.value;
c.push(t);
}
});
}), i.columns = _.sortBy(o, function(e) {
return e[0];
}), i);
}
function u(e) {
P || (N = 0, t.showAverage = _.size(t.pods) > 5 || w, _.each(t.metrics, function(n) {
var r, a = o(e, n), i = n.descriptor;
w && n.compactCombineWith && (i = n.compactCombineWith, n.lastValue && (E[i].lastValue = (E[i].lastValue || 0) + n.lastValue)), S[i] ? (S[i].load(a), t.showAverage ? S[i].legend.hide() : S[i].legend.show()) : ((r = D(n)).data = a, S[i] = c3.generate(r));
}));
}
function d() {
return w ? "-15mn" : "-" + t.options.timeRange.value + "mn";
}
function m() {
return 60 * t.options.timeRange.value * 1e3;
}
function p() {
return w ? "1mn" : Math.floor(m() / C) + "ms";
}
function f() {
var e = _.find(t.pods, "metadata.namespace");
if (e) {
var n = {
pods: t.pods,
namespace: e.metadata.namespace,
bucketDuration: p()
};
return w || (n.containerName = t.options.selectedContainer.name), n.start = j || d(), n;
}
}
function g(e) {
if (!P) if (N++, t.noData) t.metricsError = {
status: _.get(e, "status", 0),
details: _.get(e, "data.errorMsg") || _.get(e, "statusText") || "Status code " + _.get(e, "status", 0)
}; else if (!(N < 2) && t.alerts) {
var n = "metrics-failed-" + t.uniqueID;
t.alerts[n] = {
type: "error",
message: "An error occurred updating metrics.",
links: [ {
href: "",
label: "Retry",
onClick: function() {
delete t.alerts[n], N = 1, y();
}
} ]
};
}
}
function v() {
return _.isEmpty(t.pods) ? (t.loaded = !0, !1) : !t.metricsError && N < 2;
}
function h(e, n, r) {
t.noData = !1;
var a = _.initial(r), o = _.get(I, [ e, n ]);
if (o) {
var i = _.takeRight(o.concat(a), C);
_.set(I, [ e, n ], i);
} else _.set(I, [ e, n ], a);
}
function y() {
if (!R && v()) {
k = Date.now();
var e = f();
c.getPodMetrics(e).then(u, g).finally(function() {
t.loaded = !0;
});
}
}
var b, S = {}, C = 30, w = "compact" === t.profile, P = !1;
t.uniqueID = s.uniqueID();
var j, k, I = {}, R = w, T = function(e) {
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
var E = _.keyBy(t.metrics, "descriptor");
t.loaded = !1, t.noData = !0, t.showComputeUnitsHelp = function() {
l.showComputeUnitsHelp();
};
var N = 0;
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
I = {}, j = null, delete t.metricsError, y();
}, !0), b = e(y, s.getDefaultUpdateInterval(), !1), t.updateInView = function(e) {
R = !e, e && (!k || Date.now() > k + s.getDefaultUpdateInterval()) && y();
};
var A = a.$on("metrics.charts.resize", function() {
s.redraw(S);
});
t.$on("$destroy", function() {
b && (e.cancel(b), b = null), A && (A(), A = null), angular.forEach(S, function(e) {
e.destroy();
}), S = null, P = !0;
});
}
};
} ]), angular.module("openshiftConsole").directive("logViewer", [ "$sce", "$timeout", "$window", "$filter", "$q", "AuthService", "APIService", "APIDiscovery", "DataService", "HTMLService", "ModalsService", "logLinks", "BREAKPOINTS", function(e, t, n, r, a, o, i, s, c, l, u, d) {
var m = $(window), p = $('<tr class="log-line"><td class="log-line-number"></td><td class="log-line-text"></td></tr>').get(0), f = function(e, t) {
var n = p.cloneNode(!0);
n.firstChild.setAttribute("data-line-number", e);
var r = ansi_up.escape_for_html(t), a = ansi_up.ansi_to_html(r), o = l.linkify(a, "_blank", !0);
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
var l, u, p, g = document.documentElement;
t.logViewerID = _.uniqueId("log-viewer"), t.empty = !0;
var v, h;
"ReplicationController" === t.object.kind ? (v = "deploymentconfigs/log", h = r("annotation")(t.object, "deploymentConfig")) : (v = i.kindToResource(t.object.kind) + "/log", h = t.object.metadata.name);
var y, b = function() {
t.$apply(function() {
var e = l.getBoundingClientRect();
t.fixedHeight ? t.showScrollLinks = e && e.height > t.fixedHeight : t.showScrollLinks = e && (e.top < 0 || e.bottom > g.clientHeight);
});
}, S = !1, C = function() {
S ? S = !1 : t.$evalAsync(function() {
t.autoScrollActive = !1;
});
}, w = function() {
u ? $(u).on("scroll", C) : m.on("scroll", C);
}, P = function() {
t.fixedHeight || p.affix({
target: window,
offset: {
top: t.followAffixTop || 0
}
});
}, j = function() {
return $("#" + t.logViewerID + " .log-view-output");
}, k = function(e) {
var n = j(), r = n.offset().top;
if (!(r < 0)) {
var a = $(".ellipsis-pulser").outerHeight(!0), o = t.fixedHeight ? t.fixedHeight : Math.floor($(window).height() - r - a);
t.chromeless || t.fixedHeight || (o -= 40), e ? n.animate({
"min-height": o + "px"
}, "fast") : n.css("min-height", o + "px"), t.fixedHeight && n.css("max-height", o);
}
}, I = function() {
if (!y) {
var e = function() {
clearInterval(y), y = null, t.$evalAsync(function() {
t.sized = !0;
});
}, n = 0;
y = setInterval(function() {
n > 10 ? e() : (n++, j().is(":visible") && (k(), e()));
}, 100);
}
}, R = _.debounce(function() {
k(!0), b(), C();
}, 100);
m.on("resize", R);
var T, E = function() {
S = !0, d.scrollBottom(u);
}, N = document.createDocumentFragment(), D = _.debounce(function() {
l.appendChild(N), N = document.createDocumentFragment(), t.autoScrollActive && E(), t.showScrollLinks || b();
}, 100, {
maxWait: 300
}), A = function(e) {
var t = a.defer();
return T ? (T.onClose(function() {
t.resolve();
}), T.stop()) : t.resolve(), e || (D.cancel(), l && (l.innerHTML = ""), N = document.createDocumentFragment()), t.promise;
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
}, t.options), n = 0, r = function(e) {
n++, N.appendChild(f(n, e)), D();
};
(T = c.createStream(v, h, t.context, e)).onMessage(function(a, o, i) {
t.$evalAsync(function() {
t.empty = !1, "logs" !== t.state && (t.state = "logs", I());
}), a && (e.limitBytes && i >= e.limitBytes && (t.$evalAsync(function() {
t.limitReached = !0, t.loading = !1;
}), A(!0)), r(a), !t.largeLog && n >= e.tailLines && t.$evalAsync(function() {
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
var i = _.get(t.context, "project.metadata.name"), s = _.get(t.options, "container");
i && s && h && a && (angular.extend(t, {
kibanaAuthUrl: e.trustAsResourceUrl(URI(a).segment("auth").segment("token").normalizePathname().toString()),
access_token: o.UserStore().getToken()
}), t.$watchGroup([ "context.project.metadata.name", "options.container", "name" ], function() {
angular.extend(t, {
kibanaArchiveUrl: e.trustAsResourceUrl(d.archiveUri({
namespace: t.context.project.metadata.name,
namespaceUid: t.context.project.metadata.uid,
podname: h,
containername: t.options.container,
backlink: URI.encode(n.location.href)
}, r("annotation")(t.context.project, "loggingDataPrefix")))
});
}));
}), this.cacheScrollableNode = function(e) {
u = e;
}, this.cacheLogNode = function(e) {
l = e;
}, this.cacheAffixable = function(e) {
p = $(e);
}, this.start = function() {
w(), P();
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
t.autoScrollActive = !t.autoScrollActive, t.autoScrollActive && E();
},
goChromeless: d.chromelessLink,
restartLogs: B
}), t.$on("$destroy", function() {
A(), m.off("resize", R), m.off("scroll", C), u && $(u).off("scroll", C);
}), "deploymentconfigs/logs" === v && !h) return t.state = "empty", void (t.emptyStateMessage = "Logs are not available for this replication controller because it was not generated from a deployment configuration.");
t.$watchGroup([ "name", "options.container", "run" ], B);
} ],
require: "logViewer",
link: function(e, n, r, a) {
t(function() {
e.fixedHeight && a.cacheScrollableNode(document.getElementById(e.logViewerID + "-fixed-scrollable")), a.cacheLogNode(document.getElementById(e.logViewerID + "-logContent")), a.cacheAffixable(document.getElementById(e.logViewerID + "-affixedFollow")), a.start();
}, 0);
var o = function() {
var t = $(n).find(".log-line-text").text(), r = _.get(e, "object.metadata.name", "openshift") + ".log", a = new Blob([ t ], {
type: "text/plain;charset=utf-8"
});
saveAs(a, r);
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
} ]), angular.module("openshiftConsole").directive("podDonut", [ "$timeout", "isPullingImageFilter", "isTerminatingFilter", "podWarningsFilter", "numContainersReadyFilter", "Logger", "ChartsService", function(e, t, n, r, a, o, i) {
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
var r;
r = angular.isNumber(e.desired) && e.desired !== n ? "scaling to " + e.desired + "..." : 1 === n ? "pod" : "pods", e.idled ? i.updateDonutCenterText(o[0], "Idle") : i.updateDonutCenterText(o[0], n, r);
}
}
function c(e) {
return a(e) === _.size(e.spec.containers);
}
function l(e) {
if (n(e)) return "Terminating";
var a = r(e);
return _.some(a, {
severity: "error"
}) ? "Error" : _.isEmpty(a) ? t(e) ? "Pulling" : "Running" !== e.status.phase || c(e) ? _.get(e, "status.phase", "Unknown") : "Not Ready" : "Warning";
}
var u, d, m = [ "Running", "Not Ready", "Warning", "Error", "Pulling", "Pending", "Succeeded", "Terminating", "Unknown" ];
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
groups: [ m ],
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
var p = _.debounce(function(t) {
var n = {
columns: []
};
angular.forEach(m, function(e) {
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
}, p, !0), e.$watchGroup([ "desired", "idled" ], s), e.$on("destroy", function() {
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
var t, n, r = window.matchMedia("(max-width: 400px)").matches;
e.chartId = _.uniqueId("route-service-chart-"), n = {
bindto: "#" + e.chartId,
color: {
pattern: [ $.pfPaletteColors.blue, $.pfPaletteColors.orange, $.pfPaletteColors.green, $.pfPaletteColors.red ]
},
legend: {
show: !0,
position: r ? "bottom" : "right"
},
pie: {
label: {
show: !1
}
},
size: {
height: r ? 150 : 115
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
var a, o = function(e) {
return [ e.name, e.weight ];
}, i = function(e) {
return _.head(e);
}, s = function(e) {
var t = {};
_.each(e.columns, function(e) {
var n = i(e);
t[n] = !0;
});
var n = _.get(a, "columns", []);
e.unload = _.chain(n).reject(function(e) {
var n = i(e);
return _.has(t, [ n ]);
}).map(i).value();
};
e.$watch("route", function() {
var r = {
columns: [],
names: {}
};
e.route && (r.columns.push(o(e.route.spec.to)), r.names[e.route.spec.to.name] = _.truncate(e.route.spec.to.name, {
length: 30
}), e.totalWeight = e.route.spec.to.weight, _.each(e.route.spec.alternateBackends, function(t) {
r.columns.push(o(t)), r.names[t.name] = _.truncate(t.name, {
length: 30
}), e.totalWeight += t.weight;
})), e.totalWeight && (t ? (s(r), t.load(r)) : (n.data.columns = r.columns, t = c3.generate(n)), a = r);
}), e.$on("destroy", function() {
t && (t = t.destroy());
});
}
};
}), angular.module("openshiftConsole").directive("deploymentDonut", [ "$filter", "$location", "$timeout", "$uibModal", "DeploymentsService", "HPAService", "QuotaService", "LabelFilter", "Navigate", "NotificationsService", "hashSizeFilter", "hasDeploymentConfigFilter", function(e, t, n, r, a, o, i, s, c, l, u, d) {
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
var m = function() {
o.getHPAWarnings(e.rc, e.hpa, e.limitRanges, e.project).then(function(t) {
e.hpaWarnings = _.map(t, function(e) {
return _.escape(e.message);
}).join("<br>");
});
};
e.$watchGroup([ "limitRanges", "hpa", "project" ], m), e.$watch("rc.spec.template.spec.containers", m, !0);
e.$watchGroup([ "rc.spec.replicas", "rc.status.replicas", "quotas", "clusterQuotas" ], function() {
if (_.get(e.rc, "spec.replicas", 1) > _.get(e.rc, "status.replicas", 0)) {
var t = i.filterQuotasForResource(e.rc, e.quotas), n = i.filterQuotasForResource(e.rc, e.clusterQuotas), r = function(t) {
return !_.isEmpty(i.getResourceLimitAlerts(e.rc, t));
};
e.showQuotaWarning = _.some(t, r) || _.some(n, r);
} else e.showQuotaWarning = !1;
});
var p = function() {
return e.deploymentConfig || e.deployment || e.rc;
}, f = function() {
if (s = !1, angular.isNumber(e.desiredReplicas)) {
var r = p();
return a.scale(r, e.desiredReplicas).then(_.noop, function(e) {
var a = u(r.kind);
return l.addNotification({
id: "deployment-scale-error",
type: "error",
message: "An error occurred scaling " + a + " " + r.metadata.name + ".",
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
e.scalable && (e.desiredReplicas = e.getDesiredReplicas(), 0 !== e.desiredReplicas && (1 !== e.desiredReplicas ? (e.desiredReplicas--, g()) : r.open({
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
link: function(n, r) {
var a = e("usageValue"), o = e("usageWithUnits"), i = e("amountAndUnit");
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
t.updateDonutCenterText(r[0], e, n);
})(i(n.total, n.type, !0));
},
tooltip: {
position: function() {
return {
top: 0,
left: 0
};
},
contents: function(e, t, r, i) {
var c = $('<table class="c3-tooltip"></table>').css({
width: n.width + "px"
}), l = $("<tr/>").appendTo(c), u = $('<td class="name nowrap"></td>').appendTo(l);
$("<span/>").css({
"background-color": i(e[0].id)
}).appendTo(u), $("<span/>").text(e[0].name).appendTo(u);
var d;
d = n.total ? s(e[0].value / a(n.total)) + " of " + o(n.total, n.type) : o(n.used, n.type);
var m = $("<tr/>").appendTo(c);
return $('<td class="value" style="text-align: left;"></td>').text(d).appendTo(m), c.get(0).outerHTML;
}
},
data: {
type: "donut",
order: null
}
};
n.$watchGroup([ "used", "total", "crossProjectUsed" ], _.debounce(function() {
var e = void 0 !== n.crossProjectUsed, t = a(n.used) || 0, r = Math.max((a(n.crossProjectUsed) || 0) - t, 0), o = Math.max(a(n.total) - (r + t), 0), i = {
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
e && i.columns.splice(1, 0, [ "other", r ]), c ? c.load(i) : (_.assign(l.data, i), c = c3.generate(l));
}, 300));
}
};
} ]), angular.module("openshiftConsole").directive("buildTrendsChart", [ "$filter", "$location", "$rootScope", "$timeout", "BuildsService", function(e, t, n, r, a) {
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
var t = [], n = moment.duration(e), r = Math.floor(n.asHours()), a = n.minutes(), o = n.seconds();
return r || a || o ? (r && t.push(r + "h"), a && t.push(a + "m"), r || t.push(o + "s"), t.join(" ")) : "";
};
o.chartID = _.uniqueId("build-trends-chart-");
var l, u, d = _.constant(350), m = {
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
var t = i.json[e], n = a.getStartTimestsamp(t.build);
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
onclick: function(r) {
var a = i.json[r.x].build, o = e("navigateResourceURL")(a);
o && n.$apply(function() {
t.path(o);
});
},
selection: {
enabled: !0
},
order: null,
type: "bar"
}
}, p = function() {
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
return p(), o.completeBuilds.length;
}, function() {
i = {
json: [],
keys: {
x: "buildNumber"
}
};
var e = 0, t = 0;
angular.forEach(o.completeBuilds, function(n) {
var r = a.getBuildNumber(n);
if (r) {
var o = a.getDuration(n);
e += o, t++;
var s = {
buildNumber: r,
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
var p = [], f = [];
angular.forEach(s, function(e) {
n[e] ? p.push(e) : f.push(e);
}), i.keys.value = p, i.groups = [ p ], l ? (i.unload = f, i.done = function() {
setTimeout(function() {
l.flush();
}, d() + 25);
}, l.load(i), g()) : (m.data = angular.extend(i, m.data), r(function() {
l = c3.generate(m), g();
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
link: function(t, n, r, a) {
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
var e = t.input.amount && o(t.input.amount + t.input.unit), n = t.limitRangeMin && o(t.limitRangeMin), r = t.limitRangeMax && o(t.limitRangeMax), a = !0, i = !0;
e && n && (a = e >= n), e && r && (i = e <= r), t.form.amount.$setValidity("limitRangeMin", a), t.form.amount.$setValidity("limitRangeMax", i);
}, u = function() {
var e, n = t.request && o(t.request), r = !0, a = !0;
t.input.amount ? e = o(t.input.amount + t.input.unit) : t.defaultValue && (e = o(t.defaultValue)), n && e && (r = e >= n, t.maxLimitRequestRatio && (a = e / n <= t.maxLimitRequestRatio)), n && !e && t.maxLimitRequestRatio && (a = !1), t.form.amount.$setValidity("limitLargerThanRequest", r), t.form.amount.$setValidity("limitWithinRatio", a);
};
a.$render = function() {
_.spread(function(e, n) {
e ? (t.input.amount = Number(e), t.input.unit = n, c(n)) : t.input.amount = null;
})(i(a.$viewValue, t.type));
}, t.$watchGroup([ "input.amount", "input.unit" ], function() {
l(), u(), t.input.amount ? a.$setViewValue(t.input.amount + t.input.unit) : a.$setViewValue(void 0);
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
var n, r = function(t, n) {
if (e.probe = e.probe || {}, e.previousProbes[n] = e.probe[n], delete e.probe[n], e.probe[t] = e.previousProbes[t], !e.probe[t]) switch (t) {
case "httpGet":
case "tcpSocket":
var r = _.head(e.tcpPorts);
e.probe[t] = {
port: r ? r.containerPort : ""
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
e.probe.httpGet ? n = "httpGet" : e.probe.exec ? n = "exec" : e.probe.tcpSocket ? n = "tcpSocket" : (n = "httpGet", r("httpGet")), _.set(e, "selected.type", n), e.$watch("selected.type", function(e, t) {
e !== t && r(e, t);
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
var n, r, a = e("isMultiline");
t.$watch("args", function() {
r ? r = !1 : _.isEmpty(t.args) || (t.input.args = _.map(t.args, function(e) {
return {
value: e,
multiline: a(e)
};
}), n = !0);
}, !0), t.$watch("input.args", function(e, a) {
n ? n = !1 : e !== a && (r = !0, t.args = _.map(t.input.args, function(e) {
return e.value;
}), t.form.command.$setDirty());
}, !0), t.addArg = function() {
t.nextArg && (t.input.args = t.input.args || [], t.input.args.push({
value: t.nextArg,
multiline: a(t.nextArg)
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
var r = e("annotation");
n.$watch(function() {
return r(n.build, "jenkinsStatus");
}, function(e) {
if (e) try {
n.jenkinsStatus = JSON.parse(e);
} catch (n) {
t.error("Could not parse Jenkins status as JSON", e);
}
});
var a = e("buildConfigForBuild");
n.$watch(function() {
return a(n.build);
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
var r = _.get(e, "route.spec.alternateBackends", []);
_.each(r, n), e.backends.sort(t);
}
}, e.getPercentage = function(t) {
var n = e.total || 100, r = t.weight / n * 100;
return _.round(r) + "%";
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
controller: [ "$scope", "$filter", "APIService", "ApplicationsService", "BindingService", "Catalog", "DataService", "ServiceInstancesService", function(e, t, n, r, a, o, i, s) {
var c, l, u, d, m, p, f = this, g = t("statusCondition"), v = t("enableTechPreviewFeature"), h = n.getPreferredVersion("serviceinstances"), y = n.getPreferredVersion("clusterserviceclasses"), b = n.getPreferredVersion("clusterserviceplans"), S = function() {
var e, t;
_.each(f.serviceInstances, function(n) {
var r = "True" === _.get(g(n, "Ready"), "status");
r && (!e || n.metadata.creationTimestamp > e.metadata.creationTimestamp) && (e = n), r || t && !(n.metadata.creationTimestamp > t.metadata.creationTimestamp) || (t = n);
}), f.serviceToBind = e || t;
}, C = function() {
f.serviceClasses && f.serviceInstances && f.servicePlans && (f.serviceInstances = a.filterBindableServiceInstances(f.serviceInstances, f.serviceClasses, f.servicePlans), f.orderedServiceInstances = a.sortServiceInstances(f.serviceInstances, f.serviceClasses), f.serviceToBind || S());
}, w = function() {
var e = {
namespace: _.get(f.target, "metadata.namespace")
};
r.getApplications(e).then(function(e) {
f.applications = e, f.bindType = f.applications.length ? "application" : "secret-only";
});
}, P = function() {
var e = {
namespace: _.get(f.target, "metadata.namespace")
};
i.list(h, e).then(function(e) {
f.serviceInstances = e.by("metadata.name"), C();
}), i.list(y, {}).then(function(e) {
f.serviceClasses = e.by("metadata.name"), C();
}), i.list(b, {}).then(function(e) {
f.servicePlans = e.by("metadata.name"), C();
});
};
c = {
id: "bindForm",
label: "Binding",
view: "views/directives/bind-service/bind-service-form.html",
valid: !1,
allowClickNav: !0,
onShow: function() {
f.nextTitle = l.hidden ? "Bind" : "Next >", f.podPresets && !d && (d = e.$watch("ctrl.selectionForm.$valid", function(e) {
c.valid = e;
}));
}
}, l = {
id: "bindParameters",
label: "Parameters",
view: "views/directives/bind-service/bind-parameters.html",
hidden: !0,
allowClickNav: !0,
onShow: function() {
f.nextTitle = "Bind", m || (m = e.$watch("ctrl.parametersForm.$valid", function(e) {
l.valid = e;
}));
}
}, u = {
id: "results",
label: "Results",
view: "views/directives/bind-service/results.html",
valid: !0,
allowClickNav: !1,
onShow: function() {
d && (d(), d = void 0), m && (m(), m = void 0), f.nextTitle = "Close", f.wizardComplete = !0, f.bindService();
}
};
e.$watch("ctrl.serviceToBind", function() {
f.serviceToBind && s.fetchServiceClassForInstance(f.serviceToBind).then(function(e) {
f.serviceClass = e;
var t = s.getServicePlanNameForInstance(f.serviceToBind);
i.get(b, t, {}).then(function(e) {
f.plan = e, f.parameterSchema = _.get(f.plan, "spec.serviceBindingCreateParameterSchema"), f.parameterFormDefinition = _.get(f.plan, "spec.externalMetadata.schemas.service_binding.create.openshift_form_definition"), l.hidden = !_.has(f.parameterSchema, "properties"), f.nextTitle = l.hidden ? "Bind" : "Next >", f.hideBack = l.hidden, c.valid = !0;
});
});
}), f.$onInit = function() {
f.serviceSelection = {}, f.projectDisplayName = t("displayName")(f.project), f.podPresets = v("pod_presets"), f.parameterData = {}, f.steps = [ c, l, u ], f.hideBack = l.hidden, "ServiceInstance" === f.target.kind ? (f.bindType = "secret-only", f.appToBind = null, f.serviceToBind = f.target, f.podPresets && w()) : (f.bindType = "application", f.appToBind = f.target, P());
}, f.$onChanges = function(e) {
e.project && !e.project.isFirstChange() && (f.projectDisplayName = t("displayName")(f.project));
}, f.$onDestroy = function() {
d && (d(), d = void 0), m && (m(), m = void 0), p && i.unwatch(p);
}, f.bindService = function() {
var e = "ServiceInstance" === f.target.kind ? f.target : f.serviceToBind, t = "application" === f.bindType ? f.appToBind : void 0, n = {
namespace: _.get(e, "metadata.namespace")
}, r = a.getServiceClassForInstance(e, f.serviceClasses);
a.bindService(e, t, r, f.parameterData).then(function(e) {
f.binding = e, f.error = null, p = i.watchObject(a.bindingResource, _.get(f.binding, "metadata.name"), n, function(e) {
f.binding = e;
});
}, function(e) {
f.error = e;
});
}, f.closeWizard = function() {
_.isFunction(f.onClose) && f.onClose();
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
controller: [ "$scope", "$filter", "APIService", "DataService", function(e, t, n, r) {
var a, o, i = this, s = t("enableTechPreviewFeature"), c = t("serviceInstanceDisplayName"), l = n.getPreferredVersion("servicebindings"), u = function() {
var e = i.selectedBinding.metadata.name;
i.unboundApps = i.appsForBinding(e), r.delete(l, e, o, {
propagationPolicy: null
}).then(_.noop, function(e) {
i.error = e;
});
}, d = function() {
var t = _.head(i.steps);
t.valid = !1, a = e.$watch("ctrl.selectedBinding", function(e) {
t.valid = !!e;
});
}, m = function() {
a && (a(), a = void 0);
}, p = function() {
i.nextTitle = "Delete", d();
}, f = function() {
i.nextTitle = "Close", i.wizardComplete = !0, u(), m();
};
i.$onInit = function() {
var e;
e = "ServiceInstance" === i.target.kind ? s("pod_presets") ? "Applications" : "Bindings" : "Services", i.displayName = c(i.target, i.serviceClass), i.steps = [ {
id: "deleteForm",
label: e,
view: "views/directives/bind-service/delete-binding-select-form.html",
onShow: p
}, {
id: "results",
label: "Results",
view: "views/directives/bind-service/delete-binding-result.html",
onShow: f
} ], o = {
namespace: _.get(i.target, "metadata.namespace")
};
}, i.appsForBinding = function(e) {
return _.get(i.applicationsByBinding, e);
}, i.closeWizard = function() {
_.isFunction(i.onClose) && i.onClose();
}, i.$onDestroy = function() {
m();
};
} ],
controllerAs: "ctrl",
bindings: {
target: "<",
bindings: "<",
applicationsByBinding: "<",
onClose: "<",
serviceClass: "<"
},
templateUrl: "views/directives/unbind-service.html"
});
}(), function() {
angular.module("openshiftConsole").component("processTemplate", {
controller: [ "$filter", "$q", "$scope", "$uibModal", "APIService", "DataService", "Navigate", "NotificationsService", "ProcessedTemplateService", "ProjectsService", "QuotaService", "SecurityCheckService", "TaskList", "keyValueEditorUtils", function(e, t, n, r, a, o, i, s, c, l, u, d, m, p) {
function f(e) {
var t = /^helplink\.(.*)\.title$/, n = /^helplink\.(.*)\.url$/, r = {};
for (var a in e.annotations) {
var o, i = a.match(t);
i ? ((o = r[i[1]] || {}).title = e.annotations[a], r[i[1]] = o) : (i = a.match(n)) && ((o = r[i[1]] || {}).url = e.annotations[a], r[i[1]] = o);
}
return r;
}
function g() {
h.prefillParameters && _.each(h.template.parameters, function(e) {
h.prefillParameters[e.name] && (e.value = h.prefillParameters[e.name]);
}), h.labels = _.map(h.template.labels, function(e, t) {
return {
name: t,
value: e
};
}), T() && h.labels.push({
name: "app",
value: h.template.metadata.name
});
}
var v, h = this, y = e("displayName"), b = e("humanize");
h.noProjectsCantCreate = !1, h.$onInit = function() {
h.labels = [], h.template = angular.copy(h.template), h.templateDisplayName = y(h.template), h.selectedProject = h.project, n.$watch("$ctrl.selectedProject.metadata.name", function() {
h.projectNameTaken = !1;
}), n.$on("no-projects-cannot-create", function() {
h.noProjectsCantCreate = !0;
}), g();
};
var S, C = function() {
var e = {
started: "Creating " + h.templateDisplayName + " in project " + y(h.selectedProject),
success: "Created " + h.templateDisplayName + " in project " + y(h.selectedProject),
failure: "Failed to create " + h.templateDisplayName + " in project " + y(h.selectedProject)
}, r = f(h.template);
m.clear(), m.add(e, r, h.selectedProject.metadata.name, function() {
var e = t.defer();
return o.batch(S, v).then(function(t) {
var n = [], r = !1;
t.failure.length > 0 ? (r = !0, t.failure.forEach(function(e) {
n.push({
type: "error",
message: "Cannot create " + b(e.object.kind).toLowerCase() + ' "' + e.object.metadata.name + '". ',
details: e.data.message
});
}), t.success.forEach(function(e) {
n.push({
type: "success",
message: "Created " + b(e.kind).toLowerCase() + ' "' + e.metadata.name + '" successfully. '
});
})) : n.push({
type: "success",
message: "All items in template " + h.templateDisplayName + " were created successfully."
}), e.resolve({
alerts: n,
hasErrors: r
});
}), e.promise;
}), h.isDialog ? n.$emit("templateInstantiated", {
project: h.selectedProject,
template: h.template
}) : i.toNextSteps(h.templateDisplayName, h.selectedProject.metadata.name);
}, w = function(e) {
r.open({
templateUrl: "views/modals/confirm.html",
controller: "ConfirmModalController",
resolve: {
modalConfig: function() {
return {
alerts: e,
title: "Confirm Creation",
details: "We checked your application for potential problems. Please confirm you still want to create this application.",
okButtonText: "Create Anyway",
okButtonClass: "btn-danger",
cancelButtonText: "Cancel"
};
}
}
}).result.then(C);
}, P = {}, j = function() {
s.hideNotification("process-template-error"), _.each(P, function(e) {
!e.id || "error" !== e.type && "warning" !== e.type || s.hideNotification(e.id);
});
}, k = function(e) {
j(), P = d.getSecurityAlerts(S, h.selectedProject.metadata.name);
var t = e.quotaAlerts || [];
P = P.concat(t), _.filter(P, {
type: "error"
}).length ? (h.disableInputs = !1, _.each(P, function(e) {
e.id = _.uniqueId("process-template-alert-"), s.addNotification(e);
})) : P.length ? (w(P), h.disableInputs = !1) : C();
}, I = function() {
if (_.has(h.selectedProject, "metadata.uid")) return t.when(h.selectedProject);
var n = h.selectedProject.metadata.name, r = h.selectedProject.metadata.annotations["new-display-name"], a = e("description")(h.selectedProject);
return l.create(n, r, a);
}, R = function(e) {
var t = a.objectToResourceGroupVersion(e);
return t.resource = "processedtemplates", t;
};
h.createFromTemplate = function() {
h.disableInputs = !0, I().then(function(e) {
h.selectedProject = e, v = {
namespace: h.selectedProject.metadata.name
}, h.template.labels = p.mapEntries(p.compactEntries(h.labels));
var t = R(h.template);
o.create(t, null, h.template, v).then(function(e) {
c.setTemplateData(e.parameters, h.template.parameters, e.message), S = e.objects, u.getLatestQuotaAlerts(S, v).then(k);
}, function(e) {
h.disableInputs = !1;
var t;
e.data && e.data.message && (t = e.data.message), s.addNotification({
id: "process-template-error",
type: "error",
message: "An error occurred processing the template.",
details: t
});
});
}, function(e) {
if (h.disableInputs = !1, "AlreadyExists" === e.data.reason) h.projectNameTaken = !0; else {
var t;
e.data && e.data.message && (t = e.data.message), s.addNotification({
id: "process-template-error",
type: "error",
message: "An error occurred creating the project.",
details: t
});
}
});
}, h.cancel = function() {
j(), i.toProjectOverview(h.project.metadata.name);
}, n.$on("instantiateTemplate", h.createFromTemplate), n.$on("$destroy", j);
var T = function() {
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
controller: [ "$scope", "$filter", "$routeParams", "Catalog", "DataService", "KeywordService", "NotificationsService", "ProjectsService", "RecentlyViewedProjectsService", function(e, t, n, r, a, o, i, s, c) {
function l() {
return w(_.get(b, "template.metadata.annotations.iconClass", "fa fa-clone"));
}
function u() {
var e = _.get(b, "template.metadata.annotations.iconClass", "fa fa-clone");
return S(e);
}
function d() {
b.steps || (b.steps = [ b.selectStep, b.infoStep, b.configStep, b.resultsStep ]);
}
function m() {
y && (y(), y = void 0);
}
function p() {
e.$broadcast("instantiateTemplate");
}
function f(e, t) {
return o.filterForKeywords(t, [ "name", "tags" ], o.generateKeywords(e));
}
function g(e) {
b.filterConfig.appliedFilters = e, v();
}
function v() {
b.filteredItems = b.catalogItems, b.filterConfig.appliedFilters && b.filterConfig.appliedFilters.length > 0 && _.each(b.filterConfig.appliedFilters, function(e) {
b.filteredItems = f(e.value, b.filteredItems);
}), b.filterConfig.resultsCount = b.filteredItems.length, _.includes(b.filteredItems, b.selectedTemplate) || b.templateSelected();
}
function h() {
b.unfilteredProjects || s.list().then(function(e) {
b.unfilteredProjects = _.toArray(e.by("metadata.name"));
}, function() {
b.unfilteredProjects = [];
}).finally(function() {
P();
});
}
var y, b = this, S = t("imageForIconClass"), C = t("annotation"), w = t("normalizeIconClass");
b.selectStep = {
id: "projectTemplates",
label: "Selection",
view: "views/directives/process-template-dialog/process-template-select.html",
hidden: !0 !== b.useProjectTemplate,
allowed: !0,
valid: !1,
allowClickNav: !0,
onShow: function() {
b.infoStep.selected = !1, b.selectStep.selected = !0, b.configStep.selected = !1, b.resultsStep.selected = !1, b.nextTitle = "Next >", m(), h();
}
}, b.infoStep = {
id: "info",
label: "Information",
view: "views/directives/process-template-dialog/process-template-info.html",
allowed: !0,
valid: !0,
allowClickNav: !0,
onShow: function() {
b.infoStep.selected = !0, b.selectStep.selected = !1, b.configStep.selected = !1, b.resultsStep.selected = !1, b.nextTitle = "Next >", m();
}
}, b.configStep = {
id: "configuration",
label: "Configuration",
view: "views/directives/process-template-dialog/process-template-config.html",
valid: !1,
allowed: !0,
allowClickNav: !0,
onShow: function() {
b.infoStep.selected = !1, b.selectStep.selected = !1, b.configStep.selected = !0, b.resultsStep.selected = !1, b.nextTitle = "Create", b.resultsStep.allowed = b.configStep.valid, y = e.$watch("$ctrl.form.$valid", function(e) {
b.configStep.valid = e && !b.noProjectsCantCreate && b.selectedProject, b.resultsStep.allowed = e;
});
}
}, b.resultsStep = {
id: "results",
label: "Results",
view: "views/directives/process-template-dialog/process-template-results.html",
valid: !0,
allowed: !1,
prevEnabled: !1,
allowClickNav: !1,
onShow: function() {
b.infoStep.selected = !1, b.selectStep.selected = !1, b.configStep.selected = !1, b.resultsStep.selected = !0, b.nextTitle = "Close", m(), b.wizardDone = !0;
}
}, b.$onInit = function() {
b.loginBaseUrl = a.openshiftAPIBaseUrl(), b.preSelectedProject = b.selectedProject = b.project, b.useProjectTemplate && (b.project && (b.templateProject = b.project, b.templateProjectChange()), h()), b.noProjectsCantCreate = !1, e.$on("no-projects-cannot-create", function() {
b.noProjectsCantCreate = !0;
}), b.noProjectsEmptyState = {
title: "No Available Projects",
info: "There are no projects available from which to load templates."
}, b.projectEmptyState = {
title: "No Project Selected",
info: "Please select a project from the dropdown to load templates from that project."
}, b.templatesEmptyState = {
title: "No Templates",
info: "The selected project has no templates available to import."
}, b.filterConfig = {
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
onFilterChange: g
}, n.project || (b.showProjectName = !0);
}, b.$onChanges = function(e) {
e.template && b.template && (d(), b.iconClass = l(), b.image = u(), b.docUrl = C(b.template, "openshift.io/documentation-url"), b.supportUrl = C(b.template, "openshift.io/support-url"), b.vendor = C(b.template, "openshift.io/provider-display-name")), e.useProjectTemplate && d();
}, e.$on("templateInstantiated", function(e, t) {
b.selectedProject = t.project, b.currentStep = b.resultsStep.label;
}), b.$onDestroy = function() {
m();
}, b.next = function(e) {
return e.stepId === b.configStep.id ? (p(), !1) : e.stepId !== b.resultsStep.id || (b.close(), !1);
}, b.close = function() {
var e = b.onDialogClosed();
_.isFunction(e) && e();
}, b.onProjectSelected = function(t) {
b.selectedProject = t, b.configStep.valid = e.$ctrl.form.$valid && b.selectedProject;
}, b.templateSelected = function(e) {
b.selectedTemplate = e, b.template = _.get(e, "resource"), b.selectStep.valid = !!e, b.iconClass = l(), b.image = u(), b.docUrl = C(b.template, "openshift.io/documentation-url"), b.supportUrl = C(b.template, "openshift.io/support-url"), b.vendor = C(b.template, "openshift.io/provider-display-name");
}, b.templateProjectChange = function() {
b.templateProjectName = _.get(b.templateProject, "metadata.name"), b.catalogItems = {}, b.templateSelected(), r.getProjectCatalogItems(b.templateProjectName, !1, !0).then(_.spread(function(e, t) {
b.catalogItems = e, b.totalCount = b.catalogItems.length, g(), t && i.addNotification({
type: "error",
message: t
});
}));
}, b.groupChoicesBy = function(e) {
return c.isRecentlyViewed(e.metadata.uid) ? "Recently Viewed" : "Other Projects";
};
var P = function() {
var e = _.reject(b.unfilteredProjects, "metadata.deletionTimestamp"), n = _.sortBy(e, t("displayName"));
b.searchEnabled = !_.isEmpty(e), b.templateProjects = c.orderByMostRecentlyViewed(n), b.numTemplateProjects = _.size(b.templateProjects), 1 === b.numTemplateProjects && (b.templateProject = _.head(b.templateProjects), b.templateProjectChange());
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
controller: [ "$scope", "$routeParams", "DataService", function(e, t, n) {
var r = this;
r.$onInit = function() {
r.loginBaseUrl = n.openshiftAPIBaseUrl(), r.currentStep = "Image", t.project || (r.showProjectName = !0), e.$on("no-projects-cannot-create", function() {
r.deployForm.$setValidity("required", !1), r.deployImageNewAppCreated = !1;
});
}, r.deployImage = function() {
e.$broadcast("newAppFromDeployImage");
}, e.$on("deployImageNewAppCreated", function(e, t) {
r.selectedProject = t.project, r.appName = t.appName, r.deployImageNewAppCreated = !0, r.currentStep = "Results";
}), r.close = function() {
var e = r.onDialogClosed();
return _.isFunction(e) && e(), r.wizardDone = !1, !0;
}, r.stepChanged = function(e) {
"results" === e.stepId ? (r.nextButtonTitle = "Close", r.wizardDone = !0) : r.nextButtonTitle = "Deploy";
}, r.nextCallback = function(e) {
return "image" === e.stepId ? (r.deployImage(), !1) : "results" !== e.stepId || (r.close(), !1);
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
controller: [ "$scope", "$timeout", "$routeParams", "$filter", "DataService", function(e, t, n, r, a) {
function o() {
return u(_.get(s, "template.metadata.annotations.iconClass", "fa fa-clone"));
}
function i() {
var e = _.get(s, "template.metadata.annotations.iconClass", "fa fa-clone");
return l(e);
}
var s = this, c = r("annotation"), l = r("imageForIconClass"), u = r("normalizeIconClass");
s.$onInit = function() {
s.alerts = {}, s.loginBaseUrl = a.openshiftAPIBaseUrl(), n.project || (s.showProjectName = !0), e.$on("no-projects-cannot-create", function() {
s.importForm.$setValidity("required", !1);
});
}, s.importFile = function() {
e.$broadcast("importFileFromYAMLOrJSON");
}, s.instantiateTemplate = function() {
e.$broadcast("instantiateTemplate");
}, e.$on("fileImportedFromYAMLOrJSON", function(e, n) {
s.selectedProject = n.project, s.template = n.template, s.iconClass = o(), s.image = i(), s.vendor = c(n.template, "openshift.io/provider-display-name"), s.docUrl = c(s.template, "openshift.io/documentation-url"), s.supportUrl = c(s.template, "openshift.io/support-url"), s.actionLabel = "imported", n.isList ? (s.kind = null, s.name = "YAML / JSON") : n.resource && (s.kind = n.resource.kind, s.name = n.resource.metadata.name), t(function() {
s.currentStep = s.template ? "Template Configuration" : "Results";
}, 0);
}), e.$on("templateInstantiated", function(e, t) {
s.selectedProject = t.project, s.name = r("displayName")(s.template), s.actionLabel = null, s.kind = null, s.currentStep = "Results";
}), s.close = function() {
s.template = null;
var e = s.onDialogClosed();
return _.isFunction(e) && e(), s.wizardDone = !1, !0;
}, s.stepChanged = function(e) {
s.currentStep = e.title, "results" === e.stepId ? (s.nextButtonTitle = "Close", s.wizardDone = !0) : s.nextButtonTitle = "Create";
}, s.currentStep = "YAML / JSON", s.nextCallback = function(e) {
return "file" === e.stepId ? (s.importFile(), !1) : "template" === e.stepId ? (s.instantiateTemplate(), !1) : "results" !== e.stepId || (s.close(), !1);
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
function r(e) {
var t = [];
return angular.forEach(e, function(e) {
e.hasErrors && t.push(e);
}), t;
}
var a = this;
a.showParamsTable = !1, a.actionLabel = a.actionLabel || "created";
var o = e.getTemplateData();
a.parameters = o.params, a.templateMessage = o.message, e.clearTemplateData();
var i = function(e) {
var t = _.get(a, "createdBuildConfig.spec.triggers", []);
return _.some(t, {
type: e
});
};
a.createdBuildConfigWithGitHubTrigger = function() {
return i("GitHub");
}, a.createdBuildConfigWithConfigChangeTrigger = function() {
return i("ConfigChange");
}, a.allTasksSuccessful = function(e) {
return !n(e).length && !r(e).length;
}, a.erroredTasks = r, a.pendingTasks = n, a.goToOverview = function() {
_.isFunction(a.onContinue) && a.onContinue(), t.toProjectOverview(a.projectName);
}, a.toggleParamsTable = function() {
a.showParamsTable = !a.showParamsTable;
};
} ],
bindings: {
project: "<",
projectName: "<",
loginBaseUrl: "<",
fromSampleRepo: "<",
createdBuildConfig: "<",
onContinue: "<",
showProjectName: "<",
kind: "<?",
name: "<",
actionLabel: "<?"
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
var r = e("imageSHA");
n.$watchGroup([ "podTemplate", "pods" ], function() {
var e = _.get(n, "podTemplate.spec.containers[0]");
if (e) {
var a = r(e.image);
n.imageIDs = a ? [ a ] : t.getImageIDs(n.pods, e.name);
}
});
}
};
} ]), function() {
angular.module("openshiftConsole").component("serviceBinding", {
controller: [ "APIService", "AuthorizationService", "DataService", "Logger", "SecretsService", "ServiceInstancesService", function(e, t, n, r, a, o) {
var i = this;
i.serviceBindingsVersion = e.getPreferredVersion("servicebindings"), i.secretsVersion = e.getPreferredVersion("secrets"), i.showParameterValues = !1;
var s = {
namespace: i.namespace
}, c = function() {
i.allowParametersReveal = t.canI("secrets", "get", i.namespace), i.parameterData = {}, i.opaqueParameterKeys = [];
var e = i.allowParametersReveal ? "" : "*****";
_.each(_.keys(_.get(i.bindParameterSchema, "properties")), function(t) {
i.parameterData[t] = e;
});
var o = _.get(i.binding, "status.externalProperties.parameters", {});
_.each(_.keys(o), function(e) {
"<redacted>" === o[e] ? i.parameterData[e] = "*****" : (i.parameterData[e] = o[e], i.opaqueParameterKeys.push(e));
}), i.allowParametersReveal && _.each(_.get(i.binding, "spec.parametersFrom"), function(e) {
n.get(i.secretsVersion, _.get(e, "secretKeyRef.name"), s).then(function(t) {
try {
var n = JSON.parse(a.decodeSecretData(t.data)[e.secretKeyRef.key]);
_.extend(i.parameterData, n);
} catch (t) {
r.warn("Unable to load parameters from secret " + _.get(e, "secretKeyRef.name"), t);
}
});
});
}, l = function() {
var t = e.getPreferredVersion("clusterserviceplans");
n.get(t, _.get(i.serviceInstance, "spec.clusterServicePlanRef.name"), s).then(function(e) {
i.bindParameterFormDefinition = angular.copy(_.get(e, "spec.externalMetadata.schemas.service_binding.create.openshift_form_definition")), i.bindParameterSchema = _.get(e, "spec.serviceBindingCreateParameterSchema"), c();
});
}, u = function() {
if ("ServiceInstance" !== _.get(i.refApiObject, "kind")) {
var e = _.get(i.binding, "spec.instanceRef.name");
i.serviceInstance = _.get(i.serviceInstances, [ e ]);
} else i.serviceInstance = i.refApiObject;
var t = o.getServiceClassNameForInstance(i.serviceInstance);
i.serviceClass = _.get(i.serviceClasses, [ t ]);
};
this.$onChanges = function(e) {
(e.binding || e.serviceInstances || e.serviceClasses) && (u(), l());
}, i.toggleShowParameterValues = function() {
i.showParameterValues = !i.showParameterValues;
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
var r = function(e) {
var t = _.get(e, "status.phase");
return _.includes(n.interestingPhases, t);
};
n.$onChanges = _.debounce(function() {
e.$apply(function() {
var e = _.groupBy(n.builds, "status.phase");
if (n.countByPhase = _.mapValues(e, _.size), n.show = _.some(n.builds, r), n.showRunningStage && 1 === n.countByPhase.Running) {
var a = _.head(e.Running);
n.currentStage = t.getCurrentStage(a);
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
controller: [ "$interval", "ConversionService", "MetricsCharts", "MetricsService", function(e, t, n, r) {
var a, o = this, i = !0, s = function(e) {
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
var n = null, r = {};
_.each(e.datasets, function(a) {
_.each(t[a], function(t, a) {
var o = _.last(t);
if (!l(o)) {
r[a] = !0;
var i = e.convert(o.value);
n = (n || 0) + i;
}
});
}), null === n ? delete e.currentUsage : e.currentUsage = n / _.size(r);
}, d = function(e) {
_.each(o.metrics, function(t) {
u(t, e);
});
}, m = function() {
o.error = !0;
}, p = function() {
if (!o.error && !i) {
var e = c();
e && (a = Date.now(), r.getPodMetrics(e).then(d, m));
}
};
o.updateInView = function(e) {
i = !e, e && (!a || Date.now() > a + n.getDefaultUpdateInterval()) && p();
};
var f;
o.$onInit = function() {
f = e(p, n.getDefaultUpdateInterval(), !1), p();
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
controller: [ "$scope", "$filter", "APIService", "DataService", "HTMLService", function(e, t, n, r, a) {
var o, i, s, c = this, l = t("annotation"), u = c.numLines || 7, d = [];
c.lines = [];
var m = _.throttle(function() {
e.$evalAsync(function() {
c.lines = _.clone(d);
});
}, 200), p = 0, f = function(e) {
if (e) {
var t = ansi_up.escape_for_html(e), n = ansi_up.ansi_to_html(t), r = a.linkify(n, "_blank", !0);
p++, d.push({
markup: r,
id: p
}), d.length > u && (d = _.takeRight(d, u)), m();
}
}, g = function() {
s && (s.stop(), s = null);
}, v = function() {
var e = {
follow: !0,
tailLines: u
};
(s = r.createStream(i, o, c.context, e)).start(), s.onMessage(f), s.onClose(function() {
s = null;
});
};
c.$onInit = function() {
"ReplicationController" === c.apiObject.kind ? (i = "deploymentconfigs/log", o = l(c.apiObject, "deploymentConfig")) : (i = n.kindToResource(c.apiObject.kind) + "/log", o = c.apiObject.metadata.name), v();
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
var r = moment().subtract(3, "m");
return moment(n).isAfter(r);
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
controller: [ "$filter", "$uibModal", "APIService", "BuildsService", "CatalogService", "DeploymentsService", "ListRowUtils", "Navigate", "NotificationsService", function(e, t, n, r, a, o, i, s, c) {
var l = this;
_.extend(l, i.ui);
var u = e("canI"), d = e("deploymentIsInProgress"), m = e("isBinaryBuild"), p = e("enableTechPreviewFeature");
l.serviceBindingsVersion = n.getPreferredVersion("servicebindings");
var f = function(e) {
var t = _.get(e, "spec.triggers");
_.isEmpty(t) || (l.imageChangeTriggers = _.filter(t, function(e) {
return "ImageChange" === e.type && _.get(e, "imageChangeParams.automatic");
}));
}, g = function(e) {
e && !l.current && "DeploymentConfig" !== e.kind && "Deployment" !== e.kind && (l.current = e);
}, v = function(e) {
l.rgv = n.objectToResourceGroupVersion(e), g(e), f(e);
};
l.$onChanges = function(e) {
e.apiObject && v(e.apiObject.currentValue);
};
var h = [], y = function(e) {
if (!l.state.hpaByResource) return null;
var t = _.get(e, "kind"), n = _.get(e, "metadata.name");
return _.get(l.state.hpaByResource, [ t, n ], h);
};
l.showBindings = a.SERVICE_CATALOG_ENABLED && p("pod_presets"), l.$doCheck = function() {
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
return !!u("deploymentconfigs/instantiate", "create") || !!u("deploymentconfigs", "update") || !(!l.current || !u("deploymentconfigs/log", "get")) || !(!p("pod_presets") || _.isEmpty(l.state.bindableServiceInstances) || !u(l.serviceBindingsVersion, "create")) || !(!p("pod_presets") || _.isEmpty(n) || !u(l.serviceBindingsVersion, "delete")) || l.showStartPipelineAction() || l.showStartBuildAction();

case "Pod":
return !!u("pods/log", "get") || !!u("pods", "update");

default:
return !((!l.firstPod(l.current) || !u("pods/log", "get")) && !u(l.rgv, "update") && (!p("pod_presets") || _.isEmpty(l.state.bindableServiceInstances) || !u(l.serviceBindingsVersion, "create")) && (!p("pod_presets") || _.isEmpty(n) || !u(l.serviceBindingsVersion, "delete")));
}
}, l.showStartBuildAction = function() {
if (!_.isEmpty(l.pipelines)) return !1;
if (!u("buildconfigs/instantiate", "create")) return !1;
if (1 !== _.size(l.buildConfigs)) return !1;
var e = _.head(l.buildConfigs);
return !m(e);
}, l.showStartPipelineAction = function() {
return u("buildconfigs/instantiate", "create") && 1 === _.size(l.pipelines);
}, l.startBuild = r.startBuild, l.canDeploy = function() {
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
var n, r = e.metadata.name, a = _.get(l, "apiObject.status.latestVersion");
n = 1 === a ? "This will attempt to stop the in-progress deployment. It may take some time to complete." : "This will attempt to stop the in-progress deployment and rollback to the last successful deployment. It may take some time to complete.", t.open({
templateUrl: "views/modals/confirm.html",
controller: "ConfirmModalController",
resolve: {
modalConfig: function() {
return {
title: "Cancel deployment " + r + "?",
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
message: "Deployment " + r + " is no longer in progress."
})) : c.addNotification({
type: "error",
message: "Deployment #" + a + " is no longer the latest."
});
});
}
}, l.urlForImageChangeTrigger = function(t) {
var n = e("stripTag")(_.get(t, "imageChangeParams.from.name")), r = _.get(l, "apiObject.metadata.namespace"), a = _.get(t, "imageChangeParams.from.namespace", r);
return s.resourceURL(n, "ImageStream", a);
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
controller: [ "$filter", "APIService", "AuthorizationService", "BindingService", "ListRowUtils", "ServiceInstancesService", function(e, t, n, r, a, o) {
var i = this, s = e("isBindingFailed"), c = e("isBindingReady"), l = e("serviceInstanceFailedMessage"), u = e("truncate");
_.extend(i, a.ui);
var d = e("serviceInstanceDisplayName");
i.serviceBindingsVersion = t.getPreferredVersion("servicebindings"), i.serviceInstancesVersion = t.getPreferredVersion("serviceinstances");
var m = function() {
var e = o.getServiceClassNameForInstance(i.apiObject);
return _.get(i, [ "state", "serviceClasses", e ]);
}, p = function() {
var e = o.getServicePlanNameForInstance(i.apiObject);
return _.get(i, [ "state", "servicePlans", e ]);
}, f = function() {
_.get(i.apiObject, "metadata.deletionTimestamp") ? i.instanceStatus = "deleted" : s(i.apiObject) ? i.instanceStatus = "failed" : c(i.apiObject) ? i.instanceStatus = "ready" : i.instanceStatus = "pending";
};
i.$doCheck = function() {
f(), i.notifications = a.getNotifications(i.apiObject, i.state), i.serviceClass = m(), i.servicePlan = p(), i.displayName = d(i.apiObject, i.serviceClass), i.isBindable = r.isServiceBindable(i.apiObject, i.serviceClass, i.servicePlan);
}, i.$onChanges = function(e) {
e.bindings && (i.deleteableBindings = _.reject(i.bindings, "metadata.deletionTimestamp"));
}, i.getSecretForBinding = function(e) {
return e && _.get(i, [ "state", "secrets", e.spec.secretName ]);
}, i.actionsDropdownVisible = function() {
return !(_.get(i.apiObject, "metadata.deletionTimestamp") || (!i.isBindable || !n.canI(i.serviceBindingsVersion, "create")) && (_.isEmpty(i.deleteableBindings) || !n.canI(i.serviceBindingsVersion, "delete")) && !n.canI(i.serviceInstancesVersion, "delete"));
}, i.closeOverlayPanel = function() {
_.set(i, "overlay.panelVisible", !1);
}, i.showOverlayPanel = function(e, t) {
_.set(i, "overlay.panelVisible", !0), _.set(i, "overlay.panelName", e), _.set(i, "overlay.state", t);
}, i.getFailedTooltipText = function() {
var e = l(i.apiObject);
if (!e) return "";
var t = u(e, 128);
return e.length !== t.length && (t += "..."), t;
}, i.deprovision = function() {
o.deprovision(i.apiObject, i.deleteableBindings);
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
}), angular.module("openshiftConsole").directive("istagSelect", [ "APIService", "DataService", "ProjectsService", function(e, t, n) {
var r = e.getPreferredVersion("imagestreams");
return {
require: "^form",
restrict: "E",
scope: {
istag: "=model",
selectDisabled: "=",
selectRequired: "=",
includeSharedNamespace: "=",
allowCustomTag: "=",
appendToBody: "="
},
templateUrl: "views/directives/istag-select.html",
controller: [ "$scope", function(e) {
e.isByNamespace = {}, e.isNamesByNamespace = {};
var a = _.get(e, "istag.namespace") && _.get(e, "istag.imageStream") && _.get(e, "istag.tagObject.tag"), o = function(e) {
_.each(e, function(e) {
_.get(e, "status.tags") || _.set(e, "status.tags", []);
});
}, i = function(n) {
if (e.isByNamespace[n] = {}, e.isNamesByNamespace[n] = [], !_.includes(e.namespaces, n)) return e.namespaces.push(n), e.isNamesByNamespace[n] = e.isNamesByNamespace[n].concat(e.istag.imageStream), void (e.isByNamespace[n][e.istag.imageStream] = {
status: {
tags: [ {
tag: e.istag.tagObject.tag
} ]
}
});
t.list(r, {
namespace: n
}, function(t) {
var r = angular.copy(t.by("metadata.name"));
o(r), e.isByNamespace[n] = r, e.isNamesByNamespace[n] = _.keys(r).sort(), _.includes(e.isNamesByNamespace[n], e.istag.imageStream) || (e.isNamesByNamespace[n] = e.isNamesByNamespace[n].concat(e.istag.imageStream), e.isByNamespace[n][e.istag.imageStream] = {
status: {
tags: {}
}
}), _.find(e.isByNamespace[n][e.istag.imageStream].status.tags, {
tag: e.istag.tagObject.tag
}) || e.isByNamespace[n][e.istag.imageStream].status.tags.push({
tag: e.istag.tagObject.tag
});
});
};
n.list().then(function(n) {
e.namespaces = _.keys(n.by("metadata.name")), e.includeSharedNamespace && (e.namespaces = _.uniq([ "openshift" ].concat(e.namespaces))), e.namespaces = e.namespaces.sort(), e.$watch("istag.namespace", function(n) {
if (n && !e.isByNamespace[n]) return a ? (i(n), void (a = !1)) : void t.list(r, {
namespace: n
}, function(t) {
var r = angular.copy(t.by("metadata.name"));
o(r), e.isByNamespace[n] = r, e.isNamesByNamespace[n] = _.keys(r).sort();
});
});
}), e.getTags = function(t) {
e.allowCustomTag && t && !_.find(e.isByNamespace[e.istag.namespace][e.istag.imageStream].status.tags, {
tag: t
}) && (_.remove(e.isByNamespace[e.istag.namespace][e.istag.imageStream].status.tags, function(e) {
return !e.items;
}), e.isByNamespace[e.istag.namespace][e.istag.imageStream].status.tags.unshift({
tag: t
}));
}, e.groupTags = function(t) {
return e.allowCustomTag ? t.items ? "Current Tags" : "New Tag" : "";
};
} ]
};
} ]), angular.module("openshiftConsole").directive("deployImage", [ "$filter", "$q", "$window", "$uibModal", "APIService", "ApplicationGenerator", "DataService", "ImagesService", "Navigate", "NotificationsService", "ProjectsService", "QuotaService", "TaskList", "SecretsService", "keyValueEditorUtils", function(e, t, n, r, a, o, i, s, c, l, u, d, m, p, f) {
var g = a.getPreferredVersion("imagestreamimages"), v = a.getPreferredVersion("configmaps"), h = a.getPreferredVersion("secrets");
return {
restrict: "E",
scope: {
project: "=",
isDialog: "="
},
templateUrl: "views/directives/deploy-image.html",
controller: [ "$scope", function(e) {
e.forms = {}, e.noProjectsCantCreate = !1, e.input = {
selectedProject: e.project
}, e.$watch("input.selectedProject.metadata.name", function() {
e.projectNameTaken = !1;
});
} ],
link: function(n) {
function a() {
var e = f.mapEntries(f.compactEntries(n.labels));
return s.getResources({
name: n.app.name,
image: n.import.name,
namespace: n.import.namespace,
tag: n.import.tag || "latest",
ports: n.ports,
volumes: n.volumes,
env: f.compactEntries(n.env),
labels: e
});
}
n.mode = "istag", n.istag = {}, n.app = {}, n.env = [], n.labels = [ {
name: "app",
value: ""
} ], n.$on("no-projects-cannot-create", function() {
n.noProjectsCantCreate = !0;
});
var p = e("orderByDisplayName"), y = e("getErrorDetails"), b = {}, S = function() {
l.hideNotification("deploy-image-list-config-maps-error"), l.hideNotification("deploy-image-list-secrets-error"), _.each(b, function(e) {
!e.id || "error" !== e.type && "warning" !== e.type || l.hideNotification(e.id);
});
};
n.valueFromNamespace = {};
var C = function() {
if (_.has(n.input.selectedProject, "metadata.uid")) return t.when(n.input.selectedProject);
var r = n.input.selectedProject.metadata.name, a = n.input.selectedProject.metadata.annotations["new-display-name"], o = e("description")(n.input.selectedProject);
return u.create(r, a, o);
}, w = e("stripTag"), P = e("stripSHA"), j = e("humanizeKind"), k = function(e) {
return e.length > 24 ? e.substring(0, 24) : e;
}, I = function() {
var e = _.last(n.import.name.split("/"));
return e = P(e), e = w(e), e = k(e);
};
n.findImage = function() {
n.loading = !0, s.findImage(n.imageName, {
namespace: n.input.selectedProject.metadata.name
}).then(function(e) {
if (n.import = e, n.loading = !1, "Success" === _.get(e, "result.status")) {
n.forms.imageSelection.imageName.$setValidity("imageLoaded", !0);
var t = n.import.image;
t && (n.app.name = I(), n.runsAsRoot = s.runsAsRoot(t), n.ports = o.parsePorts(t), n.volumes = s.getVolumes(t), n.createImageStream = !0);
} else n.import.error = _.get(e, "result.message", "An error occurred finding the image.");
}, function(t) {
n.import = {
error: e("getErrorDetails")(t) || "An error occurred finding the image."
}, n.loading = !1;
});
}, n.$watch("app.name", function(e, t) {
n.nameTaken = !1;
var r = _.find(n.labels, {
name: "app"
});
!r || r.value && r.value !== t || (r.value = e);
}), n.$watch("mode", function(e, t) {
e !== t && (delete n.import, n.istag = {}, "dockerImage" === e ? n.forms.imageSelection.imageName.$setValidity("imageLoaded", !1) : n.forms.imageSelection.imageName.$setValidity("imageLoaded", !0));
}), n.$watch("imageName", function() {
"dockerImage" === n.mode && n.forms.imageSelection.imageName.$setValidity("imageLoaded", !1);
}), n.$watch("istag", function(t, r) {
if (t !== r) if (t.namespace && t.imageStream && t.tagObject) {
var a, c = _.get(t, "tagObject.items[0].image");
n.app.name = k(t.imageStream), n.import = {
name: t.imageStream,
tag: t.tagObject.tag,
namespace: t.namespace
}, c && (a = t.imageStream + "@" + c, n.loading = !0, i.get(g, a, {
namespace: t.namespace
}).then(function(e) {
n.loading = !1, n.import.image = e.image, n.ports = o.parsePorts(e.image), n.volumes = s.getVolumes(e.image), n.runsAsRoot = !1;
}, function(t) {
n.import.error = e("getErrorDetails")(t) || "An error occurred.", n.loading = !1;
}));
} else delete n.import;
}, !0), n.$watch("input.selectedProject", function(e) {
if (n.env = _.reject(n.env, "valueFrom"), _.get(e, "metadata.uid")) {
if (!n.valueFromNamespace[e.metadata.name]) {
var t = [], r = [];
i.list(v, {
namespace: n.input.selectedProject.metadata.name
}, null, {
errorNotification: !1
}).then(function(a) {
t = p(a.by("metadata.name")), n.valueFromNamespace[e.metadata.name] = t.concat(r);
}, function(e) {
403 !== e.status && l.addNotification({
id: "deploy-image-list-config-maps-error",
type: "error",
message: "Could not load config maps.",
details: y(e)
});
}), i.list(h, {
namespace: n.input.selectedProject.metadata.name
}, null, {
errorNotification: !1
}).then(function(a) {
r = p(a.by("metadata.name")), n.valueFromNamespace[e.metadata.name] = r.concat(t);
}, function(e) {
403 !== e.status && l.addNotification({
id: "deploy-image-list-secrets-error",
type: "error",
message: "Could not load secrets.",
details: y(e)
});
});
}
} else n.mode = "istag";
});
var R, T = e("displayName"), E = function() {
var e = {
started: "Deploying image " + n.app.name + " to project " + T(n.input.selectedProject),
success: "Deployed image " + n.app.name + " to project " + T(n.input.selectedProject),
failure: "Failed to deploy image " + n.app.name + " to project " + T(n.input.selectedProject)
};
m.clear(), m.add(e, {}, n.input.selectedProject.metadata.name, function() {
var e = t.defer();
return i.batch(R, {
namespace: n.input.selectedProject.metadata.name
}).then(function(t) {
var r, a = !_.isEmpty(t.failure);
r = a ? (r = _.map(t.failure, function(e) {
return {
type: "error",
message: "Cannot create " + j(e.object.kind).toLowerCase() + ' "' + e.object.metadata.name + '". ',
details: e.data.message
};
})).concat(_.map(t.success, function(e) {
return {
type: "success",
message: "Created " + j(e.kind).toLowerCase() + ' "' + e.metadata.name + '" successfully. '
};
})) : [ {
type: "success",
message: "All resources for image " + n.app.name + " were created successfully."
} ], e.resolve({
alerts: r,
hasErrors: a
});
}), e.promise;
}), n.isDialog ? n.$emit("deployImageNewAppCreated", {
project: n.input.selectedProject,
appName: n.app.name
}) : c.toNextSteps(n.app.name, n.input.selectedProject.metadata.name);
}, N = function(e) {
r.open({
templateUrl: "views/modals/confirm.html",
controller: "ConfirmModalController",
resolve: {
modalConfig: function() {
return {
alerts: e,
title: "Confirm Creation",
details: "Problems were detected while checking your application configuration.",
okButtonText: "Create Anyway",
okButtonClass: "btn-danger",
cancelButtonText: "Cancel"
};
}
}
}).result.then(E);
}, D = function(e) {
b = e.quotaAlerts || [];
var t = _.filter(b, {
type: "error"
});
n.nameTaken || t.length ? (n.disableInputs = !1, _.each(b, function(e) {
e.id = _.uniqueId("deploy-image-alert-"), l.addNotification(e);
})) : b.length ? (N(b), n.disableInputs = !1) : E();
};
n.create = function() {
n.disableInputs = !0, S(), C().then(function(e) {
n.input.selectedProject = e, R = a();
var t = o.ifResourcesDontExist(R, n.input.selectedProject.metadata.name), r = d.getLatestQuotaAlerts(R, {
namespace: n.input.selectedProject.metadata.name
}), i = function(e) {
return n.nameTaken = e.nameTaken, r;
};
t.then(i, i).then(D, D);
}, function(e) {
n.disableInputs = !1, "AlreadyExists" === e.data.reason ? n.projectNameTaken = !0 : l.addNotification({
id: "deploy-image-create-project-error",
type: "error",
message: "An error occurred creating project.",
details: y(e)
});
});
}, n.$on("newAppFromDeployImage", n.create), n.$on("$destroy", S);
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
} ]), angular.module("openshiftConsole").directive("keyValueEditor", [ "$routeParams", "$timeout", "$filter", "keyValueEditorConfig", "keyValueEditorUtils", function(e, t, n, r, a) {
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
link: function(e, n, a) {
var i;
e.validation = {
key: e.keyValidator,
val: e.valueValidator
}, a.keyValidatorRegex && (e.validation.key = e.keyValidatorRegex), a.valueValidatorRegex && (e.validation.val = e.valueValidatorRegex), "grabFocus" in a && (e.grabFocus = !0, t(function() {
e.grabFocus = void 0;
})), "cannotAdd" in a && (e.cannotAdd = !0), "cannotDelete" in a && (e.cannotDeleteAny = !0), "isReadonly" in a && (e.isReadonlyAny = !0), "isReadonlyKeys" in a && (i = e.$watch("entries", function(t) {
t && (_.each(e.entries, function(e) {
e.isReadonlyKey = !0;
}), i());
})), "cannotSort" in a && (e.cannotSort = !0), "showHeader" in a && (e.showHeader = !0), "allowEmptyKeys" in a && (e.allowEmptyKeys = !0), e.groupByKind = function(e) {
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
keyMinlength: r.keyMinlength || a.keyMinlength,
keyMaxlength: r.keyMaxlength || a.keyMaxlength,
valueMinlength: r.valueMinlength || a.valueMinlength,
valueMaxlength: r.valueMaxlength || a.valueMaxlength,
keyValidator: r.keyValidator || a.keyValidator,
valueValidator: r.valueValidator || a.valueValidator,
keyValidatorError: r.keyValidatorError || a.keyValidatorError,
valueValidatorError: r.valueValidatorError || a.valueValidatorError,
keyRequiredError: r.keyRequiredError || a.keyRequiredError,
keyValidatorErrorTooltip: r.keyValidatorErrorTooltip || a.keyValidatorErrorTooltip,
keyValidatorErrorTooltipIcon: r.keyValidatorErrorTooltipIcon || a.keyValidatorErrorTooltipIcon,
valueValidatorErrorTooltip: r.valueValidatorErrorTooltip || a.valueValidatorErrorTooltip,
valueValidatorErrorTooltipIcon: r.valueValidatorErrorTooltipIcon || a.valueValidatorErrorTooltipIcon,
keyPlaceholder: r.keyPlaceholder || a.keyPlaceholder,
valuePlaceholder: r.valuePlaceholder || a.valuePlaceholder
});
},
controller: [ "$scope", function(t) {
var n = [], r = [], o = s++, c = i("secrets", "get"), l = i("configmaps", "get");
angular.extend(t, {
namespace: e.project,
unique: o,
forms: {},
placeholder: a.newEntry(),
setFocusKeyClass: "key-value-editor-set-focus-key-" + o,
setFocusValClass: "key-value-editor-set-focus-value-" + o,
uniqueForKey: a.uniqueForKey,
uniqueForValue: a.uniqueForValue,
dragControlListeners: {
accept: function(e, t) {
return e.itemScope.sortableScope.$id === t.$id;
},
orderChanged: function() {
t.forms.keyValueEditor.$setDirty();
}
},
deleteEntry: function(e, n) {
t.entries.splice(e, n), !t.entries.length && t.addRowLink && a.addEntry(t.entries), t.forms.keyValueEditor.$setDirty();
},
isReadonlySome: function(e) {
return _.includes(n, e);
},
cannotDeleteSome: function(e) {
return _.includes(r, e);
},
onAddRow: function() {
a.addEntry(t.entries), a.setFocusOn("." + t.setFocusKeyClass);
},
onAddRowWithSelectors: function() {
a.addEntryWithSelectors(t.entries), a.setFocusOn("." + t.setFocusKeyClass);
},
isValueFromReadonly: function(e) {
return t.isReadonlyAny || e.isReadonlyValue || e.refType && !e.selectedValueFrom || _.isEmpty(t.valueFromSelectorOptions);
}
}), t.$watch("cannotDelete", function(e) {
angular.isArray(e) && (t.cannotDeleteAny = !1, r = e);
}), t.$watch("isReadonly", function(e) {
angular.isArray(e) && (t.isReadonlyAny = !1, n = e);
}), t.$watch("addRowLink", function(e) {
t.addRowLink = e || "Add row", t.entries && !t.entries.length && a.addEntry(t.entries);
}), t.$watch("entries", function(e) {
e && !e.length && a.addEntry(t.entries), _.each(t.entries, function(e) {
a.altTextForValueFrom(e, t.namespace), a.setEntryPerms(e, c, l);
}), a.findReferenceValueForEntries(e, t.valueFromSelectorOptions);
}), t.$watch("valueFromSelectorOptions", function() {
a.findReferenceValueForEntries(t.entries, t.valueFromSelectorOptions);
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
}, r = function() {
if (t.dirty) return n();
};
$(window).on("beforeunload", r);
var a = t.$on("$routeChangeStart", function(r) {
if (t.dirty) {
var a = new Date().getTime();
confirm(n()) || (new Date().getTime() - a < 50 ? (_.set(window, "OPENSHIFT_CONSTANTS.CONFIRM_DIALOG_BLOCKED", !0), e.warn("Confirm on exit prompt appears to have been blocked by the browser.")) : r.preventDefault());
}
});
t.$on("$destroy", function() {
$(window).off("beforeunload", r), a && a();
});
}
}
};
} ]), function() {
angular.module("openshiftConsole").component("uiAceYaml", {
controller: [ "$scope", function(e) {
var t, n = this, r = function(e) {
return jsyaml.safeLoad(n.model, {
json: !e
});
}, a = function() {
t.getSession().clearAnnotations(), e.$evalAsync(function() {
n.annotations = {};
});
}, o = function(r, a) {
var o = t.getSession(), i = o.getLength(), s = _.get(r, "mark.line", 0), c = _.get(r, "mark.column", 0), l = r.message || "Could not parse content.";
s >= i && (s = i - 1);
var u = {
row: s,
column: c,
text: l,
type: a
};
o.setAnnotations([ u ]), e.$evalAsync(function() {
n.annotations = {}, n.annotations[a] = [ u ];
});
}, i = function(t) {
e.$evalAsync(function() {
n.form.$setValidity("yamlValid", t);
});
};
n.onFileAdded = function(e) {
n.model = e;
}, n.$onInit = function() {
n.resource && (n.model = jsyaml.safeDump(n.resource, {
sortKeys: !0
}));
}, n.aceLoaded = function(e) {
t = e;
var n = e.getSession();
n.setOption("tabSize", 2), n.setOption("useSoftTabs", !0), e.setDragDelay = 0;
}, e.$watch(function() {
return n.model;
}, function(e, t) {
var s;
try {
s = r(!1), i(!0), e !== t && (n.resource = s);
try {
r(!0), a();
} catch (e) {
o(e, "warning");
}
} catch (e) {
o(e, "error"), i(!1);
}
}), n.gotoLine = function(e) {
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
link: function(e, t, n, r) {
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
controller: [ "$filter", "APIService", "DataService", "EnvironmentService", "NotificationsService", function(e, t, n, r, a) {
var o, i, s, c, l = this, u = t.getPreferredVersion("configmaps"), d = t.getPreferredVersion("secrets"), m = !1, p = [], f = [], g = !1, v = e("canI"), h = e("getErrorDetails"), y = e("humanizeKind"), b = e("orderByDisplayName"), S = function(e, t) {
m || (l.form && !l.form.$pristine && l.updatedObject ? r.isEnvironmentEqual(e, t) ? l.updatedObject = r.mergeEdits(l.updatedObject, e) : (m = !0, a.addNotification({
type: "warning",
message: "The environment variables for the " + o + " have been updated in the background.",
details: "Saving your changes may create a conflict or cause loss of data."
})) : l.updatedObject = r.copyAndNormalize(e));
}, C = function() {
n.list(u, {
namespace: l.apiObject.metadata.namespace
}).then(function(e) {
p = b(e.by("metadata.name")), l.valueFromObjects = p.concat(f);
});
}, _ = function() {
v("secrets", "list") && n.list(d, {
namespace: l.apiObject.metadata.namespace
}).then(function(e) {
f = b(e.by("metadata.name")), l.valueFromObjects = p.concat(f);
});
}, w = function() {
g || (g = !0, C(), _());
}, P = function(e, n) {
o = y(e.kind), i = e.metadata.name, s = t.objectToResourceGroupVersion(e), l.canIUpdate = v(s, "update"), c ? c.finally(function() {
S(e, n);
}) : S(e, n), l.containers = r.getContainers(l.updatedObject), l.disableValueFrom || l.ngReadonly || !l.canIUpdate || w();
};
l.$onChanges = function(e) {
e.apiObject && e.apiObject.currentValue && P(e.apiObject.currentValue, e.apiObject.previousValue);
}, l.save = function() {
var e = "save-env-error-" + i;
a.hideNotification(e), r.compact(l.updatedObject), (c = n.update(s, i, l.updatedObject, {
namespace: l.updatedObject.metadata.namespace
})).then(function() {
a.addNotification({
type: "success",
message: "Environment variables for " + o + " " + i + " were successfully updated."
}), l.form.$setPristine();
}, function(t) {
a.addNotification({
id: e,
type: "error",
message: "An error occurred updating environment variables for " + o + " " + i + ".",
details: h(t)
});
}).finally(function() {
c = null;
});
}, l.clearChanges = function() {
l.updatedObject = r.copyAndNormalize(l.apiObject), l.containers = r.getContainers(l.updatedObject), l.form.$setPristine(), m = !1;
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
var r = _.get(n.apiObject, "currentValue");
if (r) switch (t.podTemplate = e("podTemplate")(r), r.kind) {
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
controller: [ "$filter", "$routeParams", "$rootScope", "Constants", function(e, t, n, r) {
var a = this, o = _.get(r, "DISABLE_GLOBAL_EVENT_WATCH"), i = e("isIE")();
a.hide = !0;
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
}, m = function(e) {
a.hide = !e;
};
a.onClick = function() {
n.$emit("NotificationDrawerWrapper.toggle");
};
var p = function(e, t) {
a.showUnreadNotificationsIndicator = !!t;
}, f = function(e, t) {
return _.get(e, "params.project") !== _.get(t, "params.project");
}, g = function() {
l(t.project, p), m(t.project);
}, v = function() {
g(), s.push(n.$on("$routeChangeSuccess", function(e, t, n) {
f(t, n) && g();
})), s.push(n.$on("NotificationDrawerWrapper.onMarkAllRead", function() {
a.showUnreadNotificationsIndicator = !1;
}));
};
a.$onInit = function() {
o || i ? a.hide = !0 : v();
}, a.$onDestroy = function() {
u(), d();
};
} ]
});
}(), function() {
angular.module("openshiftConsole").component("notificationDrawerWrapper", {
templateUrl: "views/directives/notifications/notification-drawer-wrapper.html",
controller: [ "$filter", "$interval", "$location", "$rootScope", "$routeParams", "$scope", "$timeout", "APIService", "Constants", "DataService", "EventsService", "NotificationsService", function(e, t, n, r, a, o, i, s, c, l, u) {
var d, m, p = s.getPreferredVersion("events"), f = s.getPreferredVersion("projects"), g = _.get(c, "DISABLE_GLOBAL_EVENT_WATCH"), v = e("isIE")(), h = this, y = [], b = {}, S = {}, C = {}, w = function(e) {
e || (h.drawerHidden = !0);
}, P = function(e, t) {
return _.get(e, "params.project") !== _.get(t, "params.project");
}, j = function(e) {
return l.get(f, e, {}, {
errorNotification: !1
}).then(function(e) {
return C[e.metadata.name] = e, e;
});
}, k = function(t, n) {
return {
heading: e("displayName")(C[t]),
project: C[t],
notifications: n
};
}, I = function(e) {
return _.filter(e, "unread");
}, R = function() {
_.each(h.notificationGroups, function(e) {
e.totalUnread = I(e.notifications).length, e.hasUnread = !!e.totalUnread, r.$emit("NotificationDrawerWrapper.onUnreadNotifications", e.totalUnread);
});
}, T = function(e) {
_.each(h.notificationGroups, function(t) {
_.remove(t.notifications, {
uid: e.uid,
namespace: e.namespace
});
});
}, E = function(e) {
S[a.project] && delete S[a.project][e.uid], b[a.project] && delete b[a.project][e.uid], T(e);
}, N = function() {
b[a.project] = {}, S[a.project] = {};
}, D = function(e) {
return _.reduce(e, function(e, t) {
return e[t.metadata.uid] = {
actions: null,
uid: t.metadata.uid,
trackByID: t.metadata.uid,
unread: !u.isRead(t.metadata.uid),
type: t.type,
lastTimestamp: t.lastTimestamp,
firstTimestamp: t.firstTimestamp,
event: t
}, e;
}, {});
}, A = function(e) {
return _.reduce(e, function(e, t) {
return u.isImportantAPIEvent(t) && !u.isCleared(t.metadata.uid) && (e[t.metadata.uid] = t), e;
}, {});
}, $ = function(e, t) {
var n = a.project;
return _.assign({}, e[n], t[n]);
}, B = function(e) {
return _.orderBy(e, [ "event.lastTimestamp", "event.metadata.resourceVersion" ], [ "desc", "desc" ]);
}, L = function() {
r.$evalAsync(function() {
h.notificationGroups = [ k(a.project, B($(b, S))) ], R();
});
}, V = function() {
_.each(y, function(e) {
e();
}), y = [];
}, O = function() {
m && (l.unwatch(m), m = null);
}, U = function() {
d && d(), d = null;
}, F = function(e) {
b[a.project] = D(A(e.by("metadata.name"))), L();
}, x = function(e, t) {
var n = t.namespace || a.project, r = t.id ? n + "/" + t.id : _.uniqueId("notification_") + Date.now();
t.showInDrawer && !u.isCleared(r) && (S[n] = S[n] || {}, S[n][r] = {
actions: t.actions,
unread: !u.isRead(r),
trackByID: t.trackByID,
uid: r,
type: t.type,
lastTimestamp: t.timestamp,
message: t.message,
isHTML: t.isHTML,
details: t.details,
namespace: n,
links: t.links
}, L());
}, M = function(e, t) {
O(), e && (m = l.watch(p, {
namespace: e
}, _.debounce(t, 400), {
skipDigest: !0
}));
}, q = _.once(function(e, t) {
U(), d = r.$on("NotificationsService.onNotificationAdded", t);
}), z = function() {
j(a.project).then(function() {
M(a.project, F), q(a.project, x), w(a.project), L();
});
};
angular.extend(h, {
drawerHidden: !0,
allowExpand: !0,
drawerExpanded: "true" === localStorage.getItem("openshift/notification-drawer-expanded"),
drawerTitle: "Notifications",
hasUnread: !1,
showClearAll: !0,
showMarkAllRead: !0,
onClose: function() {
h.drawerHidden = !0;
},
onMarkAllRead: function(e) {
_.each(e.notifications, function(e) {
e.unread = !1, u.markRead(e.uid);
}), L(), r.$emit("NotificationDrawerWrapper.onMarkAllRead");
},
onClearAll: function(e) {
_.each(e.notifications, function(e) {
e.unread = !1, u.markRead(e.uid), u.markCleared(e.uid);
}), N(), L(), r.$emit("NotificationDrawerWrapper.onMarkAllRead");
},
notificationGroups: [],
headingInclude: "views/directives/notifications/header.html",
notificationBodyInclude: "views/directives/notifications/notification-body.html",
customScope: {
clear: function(e, t, n) {
u.markRead(e.uid), u.markCleared(e.uid), n.notifications.splice(t, 1), E(e), L();
},
markRead: function(e) {
e.unread = !1, u.markRead(e.uid), L();
},
close: function() {
h.drawerHidden = !0;
},
onLinkClick: function(e) {
e.onClick(), h.drawerHidden = !0;
},
countUnreadNotifications: R
}
}), o.$watch("$ctrl.drawerExpanded", function(e) {
localStorage.setItem("openshift/notification-drawer-expanded", e ? "true" : "false");
});
var H = function() {
a.project && z(), y.push(r.$on("$routeChangeSuccess", function(e, t, n) {
P(t, n) && (h.customScope.projectName = a.project, z());
})), y.push(r.$on("NotificationDrawerWrapper.toggle", function() {
h.drawerHidden = !h.drawerHidden;
})), y.push(r.$on("NotificationDrawerWrapper.hide", function() {
h.drawerHidden = !0;
})), y.push(r.$on("NotificationDrawerWrapper.clear", function(e, t) {
u.markCleared(t.uid), E(t), R();
}));
};
h.$onInit = function() {
g || v || H();
}, h.$onDestroy = function() {
U(), O(), V();
};
} ]
});
}(), angular.module("openshiftConsole").filter("duration", function() {
return function(e, t, n, r) {
function a(e, t, r) {
0 !== e && (1 !== e ? s.push(e + " " + r) : n ? s.push(t) : s.push("1 " + t));
}
if (!e) return e;
r = r || 2, t = t || new Date();
var o = moment(t).diff(e);
o < 0 && (o = 0);
var i = moment.duration(o), s = [], c = i.years(), l = i.months(), u = i.days(), d = i.hours(), m = i.minutes(), p = i.seconds();
return a(c, "year", "years"), a(l, "month", "months"), a(u, "day", "days"), a(d, "hour", "hours"), a(m, "minute", "minutes"), a(p, "second", "seconds"), 1 === s.length && p && 1 === r ? n ? "minute" : "1 minute" : (0 === s.length && s.push("0 seconds"), s.length > r && (s.length = r), s.join(", "));
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
} ]).filter("countdownToTimestamp", function() {
return function(e) {
var t = moment(new Date(e)).diff(moment(), "seconds");
return t < 0 ? 0 : t;
};
}).filter("timeOnlyDuration", function() {
return function(e) {
var t = [], n = moment.duration(e), r = Math.floor(n.asHours()), a = n.minutes(), o = n.seconds();
return (r < 0 || a < 0 || o < 0) && (r = a = o = 0), r && t.push(r + "h"), a && t.push(a + "m"), r || t.push(o + "s"), t.join(" ");
};
}), angular.module("openshiftConsole").filter("storageClass", [ "annotationFilter", function(e) {
return function(t) {
return e(t, "volume.beta.kubernetes.io/storage-class");
};
} ]).filter("tags", [ "annotationFilter", function(e) {
return function(t, n) {
var r = e(t, n = n || "tags");
return r ? r.split(/\s*,\s*/) : [];
};
} ]).filter("imageStreamLastUpdated", function() {
return function(e) {
var t = e.metadata.creationTimestamp, n = moment(t);
return angular.forEach(e.status.tags, function(e) {
if (!_.isEmpty(e.items)) {
var r = moment(_.head(e.items).created);
r.isAfter(n) && (n = r, t = _.head(e.items).created);
}
}), t;
};
}).filter("buildConfigForBuild", [ "annotationFilter", "labelNameFilter", "labelFilter", function(e, t, n) {
var r = t("buildConfig");
return function(t) {
return e(t, "buildConfig") || n(t, r);
};
} ]).filter("icon", [ "annotationFilter", function(e) {
return function(t) {
var n = e(t, "icon");
return n || "";
};
} ]).filter("iconClass", [ "annotationFilter", function(e) {
return function(t, n) {
var r = e(t, "iconClass");
return r || ("template" === n ? "fa fa-clone" : "");
};
} ]).filter("imageName", function() {
return function(e) {
return e ? e.contains(":") ? e.split(":")[1] : e : "";
};
}).filter("imageStreamName", function() {
return function(e) {
if (!e) return "";
var t, n = e.split("@")[0], r = n.split("/");
return 3 === r.length ? (t = r[2].split(":"), r[1] + "/" + t[0]) : 2 === r.length ? n : 1 === r.length ? (t = n.split(":"))[0] : void 0;
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
for (var n = e.dockerImageMetadata.Config.Env, r = 0; r < _.size(n); r++) {
var a = n[r].split("=");
if (a[0] === t) return a[1];
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
for (var n = _.get(e, "dockerImageMetadata.Config.Env", []), r = 0; r < n.length; r++) {
var a = n[r].split("=");
if ("OPENSHIFT_BUILD_NAME" === a[0]) return t[a[1]];
}
return null;
};
}).filter("webhookURL", [ "canIFilter", "APIService", "DataService", "SecretsService", function(e, t, n, r) {
return function(a, o, i, s, c) {
var l = t.getPreferredVersion("secrets");
return e(l, "list") ? (i = r.getWebhookSecretValue(i, c), n.url({
resource: "buildconfigs/webhooks/" + encodeURIComponent(i) + "/" + encodeURIComponent(o.toLowerCase()),
name: a,
namespace: s
})) : n.url({
resource: "buildconfigs/webhooks/",
name: a,
namespace: s
}) + "<secret>/" + o.toLowerCase();
};
} ]).filter("isWebRoute", [ "routeHostFilter", function(e) {
return function(t) {
return !!e(t, !0) && "Subdomain" !== _.get(t, "spec.wildcardPolicy");
};
} ]).filter("routeWebURL", [ "routeHostFilter", function(e) {
return function(t, n, r) {
var a = (t.spec.tls && "" !== t.spec.tls.tlsTerminationType ? "https" : "http") + "://" + (n || e(t));
return t.spec.path && !r && (a += t.spec.path), a;
};
} ]).filter("routeLabel", [ "RoutesService", "routeHostFilter", "routeWebURLFilter", "isWebRouteFilter", function(e, t, n, r) {
return function(a, o, i) {
if (r(a)) return n(a, o, i);
var s = o || t(a);
return s ? ("Subdomain" === _.get(a, "spec.wildcardPolicy") && (s = "*." + e.getSubdomain(a)), i ? s : (a.spec.path && (s += a.spec.path), s)) : "<unknown host>";
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
var r = e.namespace || t || "";
_.isEmpty(r) || (r += "/");
var a = e.kind;
if ("ImageStreamTag" === a || "ImageStreamImage" === a) return r + e.name;
if ("DockerImage" === a) {
var o = e.name;
return n && (o = o.substring(o.lastIndexOf("/") + 1)), o;
}
return r + e.name;
};
}).filter("orderByDisplayName", [ "displayNameFilter", "toArrayFilter", function(e, t) {
return function(n) {
var r = t(n);
return r.sort(function(t, n) {
var r = e(t) || "", a = e(n) || "";
return r === a && (r = _.get(t, "metadata.name", ""), a = _.get(n, "metadata.name", "")), r.localeCompare(a);
}), r;
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
}).filter("isTroubledPod", [ "isPodStuckFilter", "isContainerLoopingFilter", "isContainerFailedFilter", "isContainerUnpreparedFilter", function(e, t, n, r) {
return function(a) {
if ("Unknown" === a.status.phase) return !0;
if (e(a)) return !0;
if ("Running" === a.status.phase && a.status.containerStatuses) {
var o;
for (o = 0; o < _.size(a.status.containerStatuses); ++o) {
var i = a.status.containerStatuses[o];
if (i.state) {
if (n(i)) return !0;
if (t(i)) return !0;
if (r(i)) return !0;
}
}
}
return !1;
};
} ]).filter("podWarnings", [ "isPodStuckFilter", "isContainerLoopingFilter", "isContainerFailedFilter", "isContainerUnpreparedFilter", "isTerminatingFilter", function(e, t, n, r, a) {
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
n(e) && (a(o) ? i.push({
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
}), r(e) && i.push({
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
var r = n || {};
return _.each(t, function(t) {
var n = e(t);
_.each(n, function(e) {
var t = e.reason + (e.container || "");
r[t] = r[t] || [], r[t].push(e);
});
}), r;
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
} ]).filter("catalogURL", [ "Navigate", function(e) {
return e.catalogURL;
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
return function(t, n, r, a) {
return e.createFromImageURL(t, n, r, a);
};
} ]).filter("createFromTemplateURL", [ "Navigate", function(e) {
return function(t, n, r) {
return e.createFromTemplateURL(t, n, r);
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
return !e.status.completionTimestamp;
}
};
} ]).filter("isRecentBuild", [ "ageLessThanFilter", "isIncompleteBuildFilter", function(e, t) {
return function(n) {
if (!(n && n.status && n.status.phase && n.metadata)) return !1;
if (t(n)) return !0;
var r = n.status.completionTimestamp || n.metadata.creationTimestamp;
return e(r, 5, "minutes");
};
} ]).filter("deploymentCauses", [ "annotationFilter", function(e) {
return function(t) {
if (!t) return [];
var n = e(t, "encodedDeploymentConfig");
if (!n) return [];
try {
var r = $.parseJSON(n);
if (!r) return [];
switch (r.apiVersion) {
case "v1beta1":
return r.details.causes;

case "v1beta3":
case "v1":
return r.status.details ? r.status.details.causes : [];

default:
return Logger.error('Unknown API version "' + r.apiVersion + '" in encoded deployment config for deployment ' + t.metadata.name), r.status && r.status.details && r.status.details.causes ? r.status.details.causes : [];
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
var r = e(n, "deploymentStatus");
return !t(n) || "Complete" === r && n.spec.replicas > 0 ? "Active" : r;
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
return function(n, r) {
return !!e(n, r) || !!t(n);
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
var r = e(t, "jenkinsLogURL");
return !r || n ? r : r.replace(/\/consoleText$/, "/console");
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
return function(r) {
if (e(r)) return t(r);
var a = n(r);
return a ? new URI(a).addSearch("tab", "logs").toString() : null;
};
} ]).filter("jenkinsfileLink", [ "isJenkinsPipelineStrategyFilter", "githubLinkFilter", function(e, t) {
return function(n) {
if (!e(n) || _.has(n, "spec.strategy.jenkinsPipelineStrategy.jenkinsfile")) return "";
var r = _.get(n, "spec.source.git.uri");
if (!r) return "";
var a = _.get(n, "spec.source.git.ref"), o = _.get(n, "spec.strategy.jenkinsPipelineStrategy.jenkinsfilePath", "Jenkinsfile"), i = _.get(n, "spec.source.contextDir");
i && (o = URI.joinPaths(i, o).path());
var s = t(r, a, o);
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
}, r = {
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
return t ? n[e] || e : r[e] || e;
};
}).filter("routeTargetPortMapping", [ "RoutesService", function(e) {
var t = function(e, t, n) {
var r = "Service Port " + (e = e || "<unknown>") + " → Container Port " + (t = t || "<unknown>");
return n && (r += " (" + n + ")"), r;
};
return function(n, r) {
if (!n.spec.port || !n.spec.port.targetPort || !r) return "";
var a = n.spec.port.targetPort, o = e.getServicePortForRoute(a, r);
return o ? t(o.port, o.targetPort, o.protocol) : angular.isString(a) ? t(a, null) : t(null, a);
};
} ]).filter("podStatus", function() {
return function(e) {
if (!e || !e.metadata.deletionTimestamp && !e.status) return "";
if (e.metadata.deletionTimestamp) return "Terminating";
var t, n = !1;
return _.each(e.status.initContainerStatuses, function(e) {
var r = _.get(e, "state");
if (!r.terminated || 0 !== r.terminated.exitCode) return r.terminated ? (t = r.terminated.reason ? "Init " + r.terminated.reason : r.terminated.signal ? "Init Signal: " + r.terminated.signal : "Init Exit Code: " + r.terminated.exitCode, n = !0, !0) : void (r.waiting && r.waiting.reason && "PodInitializing" !== r.waiting.reason && (t = "Init " + r.waiting.reason, n = !0));
}), n || (t = e.status.reason || e.status.phase, _.each(e.status.containerStatuses, function(e) {
var n, r, a = _.get(e, "state.waiting.reason") || _.get(e, "state.terminated.reason");
return a ? (t = a, !0) : (n = _.get(e, "state.terminated.signal")) ? (t = "Signal: " + n, !0) : (r = _.get(e, "state.terminated.exitCode")) ? (t = "Exit Code: " + r, !0) : void 0;
})), t;
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
var r = n.split("/");
return 2 !== r.length ? (Logger.warn('Invalid debug.openshift.io/source-resource annotation value "' + n + '"'), "") : r[1];
};
} ]).filter("entrypoint", function() {
var e = function(e) {
return _.isArray(e) ? e.join(" ") : e;
};
return function(t, n) {
if (!t) return null;
var r, a = e(t.command), o = e(t.args);
if (a && o) return a + " " + o;
if (a) return a;
if (n) {
if (r = e(_.get(n, "dockerImageMetadata.Config.Entrypoint") || [ "/bin/sh", "-c" ]), o) return r + " " + o;
if (a = e(_.get(n, "dockerImageMetadata.Config.Cmd"))) return r + " " + a;
}
return o ? "<image-entrypoint> " + o : null;
};
}).filter("unidleTargetReplicas", [ "annotationFilter", function(e) {
return function(t, n) {
var r;
if (t) try {
r = parseInt(e(t, "idledPreviousScale"));
} catch (e) {
Logger.error("Unable to parse previous scale annotation as a number.");
}
return r || _.get(_.head(n), "spec.minReplicas") || 1;
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
var r = _.find(n, {
name: t.name
});
return e(r) ? "read-only" : _.get(r, "persistentVolumeClaim.readOnly") ? "read-only" : t.readOnly ? "read-only" : "read-write";
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
}).filter("readyConditionMessage", [ "statusConditionFilter", function(e) {
return function(t) {
return _.get(e(t, "Ready"), "message");
};
} ]).filter("failedConditionMessage", [ "statusConditionFilter", function(e) {
return function(t) {
return _.get(e(t, "Failed"), "message");
};
} ]).filter("serviceInstanceConditionMessage", [ "serviceInstanceStatusFilter", "statusConditionFilter", function(e, t) {
return function(n) {
var r = e(n), a = null;
switch (r) {
case "Failed":
case "Ready":
a = _.get(t(n, r), "message");
}
return a;
};
} ]).filter("humanizeReason", function() {
return function(e) {
return _.startCase(e).replace("Back Off", "Back-off").replace("O Auth", "OAuth");
};
}).filter("humanizePodStatus", [ "humanizeReasonFilter", function(e) {
return e;
} ]), angular.module("openshiftConsole").filter("canIDoAny", [ "APIService", "canIFilter", function(e, t) {
var n = {
buildConfigs: [ {
group: "",
resource: "buildconfigs",
verbs: [ "delete", "update" ]
}, {
group: "",
resource: "buildconfigs/instantiate",
verbs: [ "create" ]
} ],
builds: [ _.assign({}, e.getPreferredVersion("builds/clone"), {
verbs: [ "create" ]
}), _.assign({}, e.getPreferredVersion("builds"), {
verbs: [ "delete", "update" ]
}) ],
configmaps: [ {
group: "",
resource: "configmaps",
verbs: [ "update", "delete" ]
} ],
deployments: [ _.assign({}, e.getPreferredVersion("horizontalpodautoscalers"), {
verbs: [ "create", "update" ]
}), _.assign({}, e.getPreferredVersion("deployments"), {
verbs: [ "update", "delete" ]
}) ],
deploymentConfigs: [ _.assign({}, e.getPreferredVersion("horizontalpodautoscalers"), {
verbs: [ "create", "update" ]
}), _.assign({}, e.getPreferredVersion("deploymentconfigs"), {
verbs: [ "create", "update" ]
}) ],
horizontalPodAutoscalers: [ {
group: "autoscaling",
resource: "horizontalpodautoscalers",
verbs: [ "update", "delete" ]
} ],
imageStreams: [ _.assign({}, e.getPreferredVersion("imagestreams"), {
verbs: [ "update", "delete" ]
}) ],
serviceInstances: [ _.assign({}, e.getPreferredVersion("serviceinstances"), {
verbs: [ "update", "delete" ]
}) ],
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
return function(e) {
return _.some(n[e], function(e) {
return _.some(e.verbs, function(n) {
return t({
resource: e.resource,
group: e.group
}, n);
});
});
};
} ]).filter("canIScale", [ "canIFilter", "hasDeploymentConfigFilter", "DeploymentsService", function(e, t, n) {
return function(t) {
var r = n.getScaleResource(t);
return e(r, "update");
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
var r = 1;
switch (t[2]) {
case "E":
r = Math.pow(1e3, 6);
break;

case "P":
r = Math.pow(1e3, 5);
break;

case "T":
r = Math.pow(1e3, 4);
break;

case "G":
r = Math.pow(1e3, 3);
break;

case "M":
r = Math.pow(1e3, 2);
break;

case "K":
case "k":
r = 1e3;
break;

case "m":
r = .001;
break;

case "Ei":
r = Math.pow(1024, 6);
break;

case "Pi":
r = Math.pow(1024, 5);
break;

case "Ti":
r = Math.pow(1024, 4);
break;

case "Gi":
r = Math.pow(1024, 3);
break;

case "Mi":
r = Math.pow(1024, 2);
break;

case "Ki":
r = 1024;
}
return n * r;
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
var r = n ? "core" : "cores";
return (e || "") + r;

default:
return e;
}
};
}).filter("amountAndUnit", [ "humanizeUnitFilter", function(e) {
return function(t, n, r) {
if (!t) return [ t, null ];
var a = /(-?[0-9\.]+)\s*(.*)/.exec(t);
if (!a) return [ t, null ];
var o = a[1], i = a[2];
return r && (i = e(i, n, "1" === o)), [ o, i ];
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
var r = e.match(/^(?:https?:\/\/|git:\/\/|git\+ssh:\/\/|git\+https:\/\/)?(?:[^@]+@)?github\.com[:\/]([^\/]+\/[^\/]+?)(\/|(?:\.git(#.*)?))?$/);
return r && (e = "https://github.com/" + r[1], n && "/" === n.charAt(0) && (n = n.substring(1)), n ? (n = (n = encodeURIComponent(n)).replace("%2F", "/"), e += "/tree/" + encodeURIComponent(t || "master") + "/" + n) : t && "master" !== t && (e += "/tree/" + encodeURIComponent(t))), e;
};
}).filter("yesNo", function() {
return function(e) {
return e ? "Yes" : "No";
};
}).filter("valuesIn", function() {
return function(e, t) {
if (!t) return {};
var n = t.split(","), r = {};
return angular.forEach(e, function(e, t) {
-1 !== n.indexOf(t) && (r[t] = e);
}), r;
};
}).filter("valuesNotIn", function() {
return function(e, t) {
if (!t) return e;
var n = t.split(","), r = {};
return angular.forEach(e, function(e, t) {
-1 === n.indexOf(t) && (r[t] = e);
}), r;
};
}).filter("stripSHAPrefix", function() {
return function(e) {
return e ? e.replace(/^sha256:/, "") : e;
};
}).filter("limitToOrAll", [ "limitToFilter", function(e) {
return function(t, n) {
return isNaN(n) ? t : e(t, n);
};
} ]).filter("getWebhookSecretData", function() {
return function(e) {
var t = _.get(e, "data.type");
return t ? _.get(e, [ "data", _.toLower(t) ]) : null;
};
}).filter("getErrorDetails", function() {
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
return function(t, n, r, a) {
return e.resourceURL(t, n, r, null, {
apiVersion: a
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
return function(t, n, r) {
return e.resourceURL(t, n, r, "edit");
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
var r, a = "long" === t;
switch (e) {
case "ReadWriteOnce":
r = a ? "RWO (Read-Write-Once)" : "Read-Write-Once";
break;

case "ReadOnlyMany":
r = a ? "ROX (Read-Only-Many)" : "Read-Only-Many";
break;

case "ReadWriteMany":
r = a ? "RWX (Read-Write-Many)" : "Read-Write-Many";
break;

default:
r = e;
}
n.push(r);
}), _.uniq(n);
};
}).filter("middleEllipses", function() {
return function(e, t, n) {
if (t < 3) return e;
if (e.length <= t) return e;
n || (n = "...");
var r = Math.floor((t - 1) / 2);
return e.slice(0, r) + n + e.slice(e.length - r);
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
} ]), angular.module("openshiftConsole").factory("logLinks", [ "$anchorScroll", "$document", "$location", "$window", function(e, t, n, r) {
var a = _.template([ "/#/discover?", "_g=(", "time:(", "from:now-1w,", "mode:relative,", "to:now", ")", ")", "&_a=(", "columns:!(kubernetes.container_name,message),", "index:'<%= index %>',", "query:(", "query_string:(", "analyze_wildcard:!t,", 'query:\'kubernetes.pod_name:"<%= podname %>" AND kubernetes.namespace_name:"<%= namespace %>"\'', ")", "),", "sort:!('@timestamp',desc)", ")", "#console_container_name=<%= containername %>", "&console_back_url=<%= backlink %>" ].join(""));
return {
scrollTop: function(e) {
e ? e.scrollTop = 0 : window.scrollTo(null, 0);
},
scrollBottom: function(e) {
e ? e.scrollTop = e.scrollHeight : window.scrollTo(0, document.documentElement.scrollHeight - document.documentElement.clientHeight);
},
chromelessLink: function(e, t) {
if (t) r.open(t, "_blank"); else {
var n = {
view: "chromeless"
};
e && e.container && (n.container = e.container), n = _.flatten([ n ]);
var a = new URI();
_.each(n, function(e) {
a.addSearch(e);
}), r.open(a.toString(), "_blank");
}
},
archiveUri: function(e, t) {
return t = t || "project." + e.namespace + "." + e.namespaceUid, e.index = t + ".*", a(e);
}
};
} ]), angular.module("javaLinkExtension", [ "openshiftConsole" ]).run([ "AuthService", "BaseHref", "DataService", "extensionRegistry", function(e, t, n, r) {
var a = [ "<div row ", 'ng-show="item.url" ', 'class="icon-row" ', 'title="Connect to container">', '<div class="icon-wrap">', '<i class="fa fa-share" aria-hidden="true"></i>', "</div>", "<div flex>", '<a ng-click="item.onClick($event)" ', 'ng-href="item.url">', "Open Java Console", "</a>", "</div>", "</div>" ].join(""), o = function(e, t, r) {
return new URI(n.url({
resource: "pods/proxy",
name: [ "https", t, r || "" ].join(":"),
namespace: e
})).segment("jolokia/");
};
r.add("container-links", _.spread(function(n, r) {
var i = _.find(n.ports || [], function(e) {
return e.name && "jolokia" === e.name.toLowerCase();
});
if (i && "Running" === _.get(r, "status.phase")) {
var s = r.status.containerStatuses, c = _.find(s, function(e) {
return e.name === n.name;
});
if (c && c.ready) {
var l = r.metadata.name, u = r.metadata.namespace, d = o(u, l, i.containerPort).toString();
return {
type: "dom",
node: a,
onClick: function(r) {
r.preventDefault(), r.stopPropagation();
var a = window.location.href, o = n.name || "Untitled Container", i = e.UserStore().getToken() || "", s = new URI().path(t).segment("java").segment("").hash(i).query({
jolokiaUrl: d,
title: o,
returnTo: a
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
node: '<li><a href="catalog?startTour=true">Tour Catalog Home</a></li>'
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
} ]), angular.module("openshiftConsole").run([ "extensionRegistry", "$rootScope", "DataService", "AuthService", function(e, t, n, r) {
e.add("nav-user-dropdown", function() {
var e = [];
_.get(window, "OPENSHIFT_CONSTANTS.DISABLE_COPY_LOGIN_COMMAND") || e.push({
type: "dom",
node: '<li><copy-login-to-clipboard clipboard-text="oc login ' + _.escape(n.openshiftAPIBaseUrl()) + " --token=" + _.escape(r.UserStore().getToken()) + '"></copy-login-to-clipboard></li>'
}), e.push({
type: "dom",
node: "<li><set-home-page></set-home-page></li>"
});
var a = "Log Out";
return t.user.fullName && t.user.fullName !== t.user.metadata.name && (a += " (" + t.user.metadata.name + ")"), e.push({
type: "dom",
node: '<li><a href="logout">' + _.escape(a) + "</a></li>"
}), e;
});
} ]), angular.module("openshiftConsole").run([ "extensionRegistry", "Constants", function(e, t) {
e.add("nav-dropdown-mobile", _.spread(function(e) {
var n = [], r = t.APP_LAUNCHER_NAVIGATION;
return _.each(r, function(e) {
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