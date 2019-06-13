"use strict";

function OverviewController(e, t, n, a, r, o, i, s, c, l, u, d, m, p, g, f, h, v, y, b, S, C, w, P, k, j, I, T, R, N, A, E) {
function D(e) {
var t = e.metadata.ownerReferences;
return t ? _(t).filter({
kind: "OfflineVirtualMachine"
}).map("uid").first() : null;
}
function B() {
if (L.offlineVirtualMachines && L.virtualMachines && L.pods) {
var e = _(L.pods).values().filter(function(e) {
return !!_.get(e, 'metadata.labels["kubevirt.io/vmUID"]');
}).keyBy('metadata.labels["kubevirt.io/vmUID"]').value(), t = _(L.virtualMachines).values().filter(function(e) {
return !!D(e);
}).keyBy(function(e) {
return D(e);
}).value(), n = [];
_.each(L.offlineVirtualMachines, function(a) {
var r = a.metadata.uid, o = t[r];
if (o) {
a._vm = o;
var i = e[o.metadata.uid];
i && (a._pod = i, n.push(i));
}
}), L.monopods && (L.monopods = _(L.monopods).filter(function(e) {
return !_.includes(n, e);
}).keyBy("metadata.name").value());
}
}
var L = this, V = t("isIE")();
e.projectName = r.project;
var O = r.isHomePage;
L.catalogLandingPageEnabled = !d.DISABLE_SERVICE_CATALOG_LANDING_PAGE;
var U = t("annotation"), x = t("canI"), F = t("buildConfigForBuild"), M = t("deploymentIsInProgress"), q = t("imageObjectRef"), z = t("isJenkinsPipelineStrategy"), H = t("isNewerResource"), G = t("label"), K = t("podTemplate"), W = i.getPreferredVersion("buildconfigs"), Y = i.getPreferredVersion("builds"), J = i.getPreferredVersion("appliedclusterresourcequotas"), Q = i.getPreferredVersion("daemonsets"), Z = i.getPreferredVersion("deploymentconfigs"), X = i.getPreferredVersion("deployments"), ee = i.getPreferredVersion("horizontalpodautoscalers"), te = i.getPreferredVersion("imagestreams"), ne = i.getPreferredVersion("limitranges"), ae = i.getPreferredVersion("pods"), re = i.getPreferredVersion("replicasets"), oe = i.getPreferredVersion("replicationcontrollers"), ie = i.getPreferredVersion("resourcequotas"), se = i.getPreferredVersion("routes"), ce = i.getPreferredVersion("servicebindings"), le = i.getPreferredVersion("clusterserviceclasses"), ue = i.getPreferredVersion("serviceinstances"), de = i.getPreferredVersion("clusterserviceplans"), me = i.getPreferredVersion("services"), pe = i.getPreferredVersion("statefulsets"), ge = i.getPreferredVersion("templates");
L.buildConfigsInstantiateVersion = i.getPreferredVersion("buildconfigs/instantiate");
var fe, he, ve = {}, ye = {}, be = {}, Se = L.state = {
alerts: {},
builds: {},
clusterQuotas: {},
imageStreamImageRefByDockerReference: {},
imagesByDockerReference: {},
limitRanges: {},
limitWatches: V,
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
L.state.breakpoint = h.getBreakpoint();
var Ce = _.throttle(function() {
var t = h.getBreakpoint();
L.state.breakpoint !== t && e.$evalAsync(function() {
L.state.breakpoint = t;
});
}, 50);
$(window).on("resize.overview", Ce), L.showGetStarted = !1, L.showLoading = !0, L.filterByOptions = [ {
id: "name",
label: "Name"
}, {
id: "label",
label: "Label"
} ], L.filterBy = b.getLabelSelector().isEmpty() ? "name" : "label", L.viewByOptions = [ {
id: "app",
label: "Application"
}, {
id: "resource",
label: "Resource Type"
}, {
id: "pipeline",
label: "Pipeline"
} ];
var we = function(e) {
return _.get(e, "metadata.name");
}, _e = function(e) {
return _.get(e, "metadata.uid");
}, Pe = function() {
return _.size(L.deploymentConfigs) + _.size(L.vanillaReplicationControllers) + _.size(L.deployments) + _.size(L.vanillaReplicaSets) + _.size(L.statefulSets) + _.size(L.daemonSets) + _.size(L.monopods) + _.size(L.state.serviceInstances) + _.size(L.mobileClients) + _.size(L.offlineVirtualMachines);
}, ke = function() {
return _.size(L.filteredDeploymentConfigs) + _.size(L.filteredReplicationControllers) + _.size(L.filteredDeployments) + _.size(L.filteredReplicaSets) + _.size(L.filteredStatefulSets) + _.size(L.filteredDaemonSets) + _.size(L.filteredMonopods) + _.size(L.filteredServiceInstances) + _.size(L.filteredMobileClients) + _.size(L.filteredOfflineVirtualMachines);
}, je = function() {
L.size = Pe(), L.filteredSize = ke();
var e = 0 === L.size, t = L.deploymentConfigs && L.replicationControllers && L.deployments && L.replicaSets && L.statefulSets && L.daemonSets && L.pods && L.state.serviceInstances;
Se.expandAll = t && 1 === L.size, L.showGetStarted = t && e, L.showLoading = !t && e, L.everythingFiltered = !e && !L.filteredSize, L.hidePipelineOtherResources = "pipeline" === L.viewBy && (L.filterActive || _.isEmpty(L.pipelineBuildConfigs));
}, Ie = function(e) {
return s.groupByApp(e, "metadata.name");
}, Te = function(e) {
var t = [], n = null;
return _.each(e, function(e) {
R.isOverviewAppRoute(e) ? t.push(e) : n = n ? R.getPreferredDisplayRoute(n, e) : e;
}), !t.length && n && t.push(n), R.sortRoutesByScore(t);
}, Re = _.debounce(function() {
e.$evalAsync(function() {
if (L.routesToDisplayByApp = {}, L.routes) {
var e = [ L.filteredDeploymentConfigsByApp, L.filteredReplicationControllersByApp, L.filteredDeploymentsByApp, L.filteredReplicaSetsByApp, L.filteredStatefulSetsByApp, L.filteredDaemonSetsByApp, L.filteredMonopodsByApp ];
_.each(L.apps, function(t) {
var n = {};
_.each(e, function(e) {
var a = _.get(e, t, []);
_.each(a, function(e) {
var t = _e(e), a = _.get(Se, [ "servicesByObjectUID", t ], []);
_.each(a, function(e) {
var t = _.get(Se, [ "routesByService", e.metadata.name ], []);
_.assign(n, _.keyBy(t, "metadata.name"));
});
});
}), L.routesToDisplayByApp[t] = Te(n);
});
}
});
}, 300, {
maxWait: 1500
}), Ne = function() {
L.filteredDeploymentConfigsByApp = Ie(L.filteredDeploymentConfigs), L.filteredReplicationControllersByApp = Ie(L.filteredReplicationControllers), L.filteredDeploymentsByApp = Ie(L.filteredDeployments), L.filteredReplicaSetsByApp = Ie(L.filteredReplicaSets), L.filteredStatefulSetsByApp = Ie(L.filteredStatefulSets), L.filteredDaemonSetsByApp = Ie(L.filteredDaemonSets), L.filteredMonopodsByApp = Ie(L.filteredMonopods), L.apps = _.union(_.keys(L.filteredDeploymentConfigsByApp), _.keys(L.filteredReplicationControllersByApp), _.keys(L.filteredDeploymentsByApp), _.keys(L.filteredReplicaSetsByApp), _.keys(L.filteredStatefulSetsByApp), _.keys(L.filteredDaemonSetsByApp), _.keys(L.filteredMonopodsByApp)), s.sortAppNames(L.apps), Re();
}, Ae = function() {
var e = _.filter(L.deploymentConfigs, function(e) {
var t = we(e);
return _.isEmpty(Se.pipelinesByDeploymentConfig[t]);
});
L.deploymentConfigsNoPipeline = _.sortBy(e, "metadata.name"), L.pipelineViewHasOtherResources = !(_.isEmpty(L.deploymentConfigsNoPipeline) && _.isEmpty(L.vanillaReplicationControllers) && _.isEmpty(L.deployments) && _.isEmpty(L.vanillaReplicaSets) && _.isEmpty(L.statefulSets) && _.isEmpty(L.monopods));
}, Ee = function() {
L.disableFilter = "pipeline" === L.viewBy && _.isEmpty(L.pipelineBuildConfigs);
}, De = function(e) {
return b.getLabelSelector().select(e);
}, $e = [ "metadata.name", "spec.clusterServiceClassExternalName" ], Be = function(e) {
return y.filterForKeywords(e, $e, Se.filterKeywords);
}, Le = function(e) {
switch (L.filterBy) {
case "label":
return De(e);

case "name":
return Be(e);
}
return e;
}, Ve = function() {
switch (L.filterBy) {
case "label":
return !b.getLabelSelector().isEmpty();

case "name":
return !_.isEmpty(Se.filterKeywords);
}
}, Oe = function() {
L.filteredDeploymentConfigs = Le(L.deploymentConfigs), L.filteredReplicationControllers = Le(L.vanillaReplicationControllers), L.filteredDeployments = Le(L.deployments), L.filteredReplicaSets = Le(L.vanillaReplicaSets), L.filteredStatefulSets = Le(L.statefulSets), L.filteredDaemonSets = Le(L.daemonSets), L.filteredMonopods = Le(L.monopods), L.filteredPipelineBuildConfigs = Le(L.pipelineBuildConfigs), L.filteredServiceInstances = Le(Se.orderedServiceInstances), L.filteredMobileClients = Le(L.mobileClients), L.filteredOfflineVirtualMachines = Le(L.offlineVirtualMachines), L.filterActive = Ve(), Ne(), je();
}, Ue = r.project + "/overview/view-by";
L.viewBy = localStorage.getItem(Ue) || "app", e.$watch(function() {
return L.viewBy;
}, function(e) {
localStorage.setItem(Ue, e), Ee(), $e = "app" === L.viewBy ? [ "metadata.name", "metadata.labels.app" ] : [ "metadata.name" ], Oe(), "pipeline" === L.viewBy ? b.setLabelSuggestions(ye) : b.setLabelSuggestions(ve);
}), d.DISABLE_OVERVIEW_METRICS || (C.isAvailable(!0).then(function(e) {
Se.showMetrics = e;
}), e.$on("metrics-connection-failed", function(e, t) {
o.isAlertPermanentlyHidden("metrics-connection-failed") || Se.alerts["metrics-connection-failed"] || (Se.alerts["metrics-connection-failed"] = {
type: "warning",
message: E.getString("An error occurred getting metrics."),
links: [ {
href: t.url,
label: E.getString("Open Metrics URL"),
target: "_blank"
}, {
href: "",
label: E.getString("Don't Show Me Again"),
onClick: function() {
return o.permanentlyHideAlert("metrics-connection-failed"), !0;
}
} ]
});
}));
var xe = function(e) {
return e && "Pod" === e.kind;
}, Fe = function(e) {
var t = _e(e);
return t ? xe(e) ? [ e ] : _.get(L, [ "state", "podsByOwnerUID", t ], []) : [];
}, Me = function(e, t) {
var n = _e(e);
Se.notificationsByObjectUID[n] = t || {};
}, qe = function(e) {
var t = _e(e);
return t ? _.get(Se, [ "notificationsByObjectUID", t ], {}) : {};
}, ze = function(e) {
if (_e(e)) {
var t = Fe(e), n = T.getPodAlerts(t, r.project);
Me(e, n);
}
}, He = function(e) {
_.each(e, ze);
}, Ge = function(e) {
var t = we(e);
return t ? be[t] : null;
}, Ke = function(e) {
var t = we(e);
return t ? _.get(L, [ "replicationControllersByDeploymentConfig", t ]) : [];
};
L.getPreviousReplicationController = function(e) {
var t = Ke(e);
return _.size(t) < 2 ? null : t[1];
};
var We = function(e) {
var t = {}, n = Ge(e);
_.assign(t, T.getDeploymentStatusAlerts(e, n), T.getPausedDeploymentAlerts(e));
var a = Ke(e);
_.each(a, function(e) {
var n = qe(e);
_.assign(t, n);
}), Me(e, t);
}, Ye = function() {
_.each(L.deploymentConfigs, We);
}, Je = function(e) {
var t = _e(e);
return t ? _.get(L, [ "replicaSetsByDeploymentUID", t ]) : {};
}, Qe = function(e) {
var t = T.getPausedDeploymentAlerts(e), n = Je(e);
_.each(n, function(e) {
var n = qe(e);
_.assign(t, n);
}), Me(e, t);
}, Ze = function() {
_.each(L.deployments, Qe);
}, Xe = function() {
He(L.replicationControllers), He(L.replicaSets), He(L.statefulSets), He(L.daemonSets), He(L.monopods);
}, et = _.debounce(function() {
e.$evalAsync(function() {
Xe(), Ye(), Ze();
});
}, 500), tt = function(e) {
_.isEmpty(e) || (b.addLabelSuggestionsFromResources(e, ve), "pipeline" !== L.viewBy && b.setLabelSuggestions(ve));
}, nt = function(e) {
_.isEmpty(e) || (b.addLabelSuggestionsFromResources(e, ye), "pipeline" === L.viewBy && b.setLabelSuggestions(ye));
}, at = function(e) {
return "Succeeded" !== e.status.phase && "Failed" !== e.status.phase && (!G(e, "openshift.io/deployer-pod-for.name") && (!U(e, "openshift.io/build.name") && "slave" !== G(e, "jenkins")));
}, rt = function() {
Se.podsByOwnerUID = k.groupByOwnerUID(L.pods), L.monopods = _.filter(Se.podsByOwnerUID[""], at), B();
}, ot = function(e) {
return !!_.get(e, "status.replicas") || (!U(e, "deploymentConfig") || M(e));
}, it = function(e) {
return U(e, "deploymentConfig");
}, st = function() {
if (L.deploymentConfigs && L.replicationControllers) {
var e = [];
L.replicationControllersByDeploymentConfig = {}, L.currentByDeploymentConfig = {}, be = {};
var t = {}, n = {};
_.each(L.replicationControllers, function(a) {
var r = it(a) || "";
(!r || !L.deploymentConfigs[r] && _.get(a, "status.replicas")) && e.push(a);
var o = be[r];
o && !H(a, o) || (be[r] = a);
var i;
"Complete" === U(a, "deploymentStatus") && ((i = t[r]) && !H(a, i) || (t[r] = a)), ot(a) && _.set(n, [ r, a.metadata.name ], a);
}), _.each(t, function(e, t) {
_.set(n, [ t, e.metadata.name ], e);
}), _.each(n, function(e, t) {
var n = p.sortByDeploymentVersion(e, !0);
L.replicationControllersByDeploymentConfig[t] = n, L.currentByDeploymentConfig[t] = _.head(n);
}), L.vanillaReplicationControllers = _.sortBy(e, "metadata.name"), Ye();
}
}, ct = function(e, t) {
if (_.get(e, "status.replicas")) return !0;
var n = p.getRevision(e);
return !n || !!t && p.getRevision(t) === n;
}, lt = function() {
L.replicaSets && fe && (L.replicaSetsByDeploymentUID = P.groupByControllerUID(L.replicaSets), L.currentByDeploymentUID = {}, _.each(L.replicaSetsByDeploymentUID, function(e, t) {
if (t) {
var n = fe[t], a = _.filter(e, function(e) {
return ct(e, n);
}), r = p.sortByRevision(a);
L.replicaSetsByDeploymentUID[t] = r, L.currentByDeploymentUID[t] = _.head(r);
}
}), L.vanillaReplicaSets = _.sortBy(L.replicaSetsByDeploymentUID[""], "metadata.name"), Ze());
}, ut = {}, dt = function(e) {
e && Se.allServices && _.each(e, function(e) {
var t = [], n = _e(e), a = K(e);
_.each(ut, function(e, n) {
e.matches(a) && t.push(Se.allServices[n]);
}), Se.servicesByObjectUID[n] = _.sortBy(t, "metadata.name");
});
}, mt = function() {
if (Se.allServices) {
ut = _.mapValues(Se.allServices, function(e) {
return new LabelSelector(e.spec.selector);
});
var e = [ L.deploymentConfigs, L.vanillaReplicationControllers, L.deployments, L.vanillaReplicaSets, L.statefulSets, L.daemonSets, L.monopods ];
_.each(e, dt), Re();
}
}, pt = function() {
var e = R.groupByService(L.routes, !0);
Se.routesByService = _.mapValues(e, R.sortRoutesByScore), Re();
}, gt = function() {
Se.hpaByResource = f.groupHPAs(L.horizontalPodAutoscalers);
}, ft = function(e) {
var t = F(e), n = L.buildConfigs[t];
if (n) {
L.recentPipelinesByBuildConfig[t] = L.recentPipelinesByBuildConfig[t] || [], L.recentPipelinesByBuildConfig[t].push(e);
var a = l.usesDeploymentConfigs(n);
_.each(a, function(t) {
Se.recentPipelinesByDeploymentConfig[t] = Se.recentPipelinesByDeploymentConfig[t] || [], Se.recentPipelinesByDeploymentConfig[t].push(e);
}), Ae();
}
}, ht = {}, vt = function() {
ht = l.groupBuildConfigsByOutputImage(L.buildConfigs);
}, yt = function(e) {
var t = _e(e);
if (t) return _.get(Se, [ "buildConfigsByObjectUID", t ], []);
}, bt = function(e) {
var t = [], n = yt(e);
_.each(n, function(e) {
var n = _.get(Se, [ "recentBuildsByBuildConfig", e.metadata.name ], []);
t = t.concat(n);
});
var a = we(e);
_.set(Se, [ "recentBuildsByDeploymentConfig", a ], t);
}, St = function(e, t) {
var n = _e(t);
n && _.set(Se, [ "buildConfigsByObjectUID", n ], e);
}, Ct = function() {
var e = [];
L.deploymentConfigsByPipeline = {}, Se.pipelinesByDeploymentConfig = {}, _.each(L.buildConfigs, function(t) {
if (z(t)) {
e.push(t);
var n = l.usesDeploymentConfigs(t), a = we(t);
_.set(L, [ "deploymentConfigsByPipeline", a ], n), _.each(n, function(e) {
Se.pipelinesByDeploymentConfig[e] = Se.pipelinesByDeploymentConfig[e] || [], Se.pipelinesByDeploymentConfig[e].push(t);
});
}
}), L.pipelineBuildConfigs = _.sortBy(e, "metadata.name"), Ae(), nt(L.pipelineBuildConfigs), Ee();
}, wt = function() {
Se.buildConfigsByObjectUID = {}, _.each(L.deploymentConfigs, function(e) {
var t = [], n = _.get(e, "spec.triggers");
_.each(n, function(n) {
var a = _.get(n, "imageChangeParams.from");
if (a) {
var r = q(a, e.metadata.namespace), o = ht[r];
_.isEmpty(o) || (t = t.concat(o));
}
}), t = _.sortBy(t, "metadata.name"), St(t, e), bt(e);
});
}, _t = function() {
Ct(), wt();
}, Pt = function() {
_.each(L.deploymentConfigs, bt);
}, kt = function() {
if (Se.builds && L.buildConfigs) {
L.recentPipelinesByBuildConfig = {}, Se.recentBuildsByBuildConfig = {}, Se.recentPipelinesByDeploymentConfig = {};
var e = {};
_.each(l.interestingBuilds(Se.builds), function(t) {
var n = F(t);
z(t) ? ft(t) : (e[n] = e[n] || [], e[n].push(t));
}), L.recentPipelinesByBuildConfig = _.mapValues(L.recentPipelinesByBuildConfig, function(e) {
return l.sortBuilds(e, !0);
}), Se.recentPipelinesByDeploymentConfig = _.mapValues(Se.recentPipelinesByDeploymentConfig, function(e) {
return l.sortBuilds(e, !0);
}), Se.recentBuildsByBuildConfig = _.mapValues(e, function(e) {
return l.sortBuilds(e, !0);
}), Pt();
}
}, jt = function() {
T.setQuotaNotifications(Se.quotas, Se.clusterQuotas, r.project);
};
L.clearFilter = function() {
b.clear(), L.filterText = "";
}, e.$watch(function() {
return L.filterText;
}, _.debounce(function(t, n) {
t !== n && (Se.filterKeywords = y.generateKeywords(t), e.$evalAsync(Oe));
}, 50, {
maxWait: 250
})), e.$watch(function() {
return L.filterBy;
}, function(e, t) {
e !== t && (L.clearFilter(), Oe());
}), e.browseCatalog = function() {
w.toProjectCatalog(e.projectName);
}, b.onActiveFiltersChanged(function() {
e.$evalAsync(Oe);
}), L.startBuild = l.startBuild;
var It = function() {
if (Se.bindingsByApplicationUID = {}, Se.applicationsByBinding = {}, Se.deleteableBindingsByApplicationUID = {}, !_.isEmpty(Se.bindings)) {
var e = [ L.deployments, L.deploymentConfigs, L.vanillaReplicationControllers, L.vanillaReplicaSets, L.statefulSets, L.daemonSets ];
if (!_.some(e, function(e) {
return !e;
})) {
var t = c.getPodPresetSelectorsForBindings(Se.bindings);
_.each(e, function(e) {
_.each(e, function(e) {
var n = _e(e), a = new LabelSelector(_.get(e, "spec.selector"));
Se.bindingsByApplicationUID[n] = [], Se.deleteableBindingsByApplicationUID[n] = [], _.each(t, function(t, r) {
t.covers(a) && (Se.bindingsByApplicationUID[n].push(Se.bindings[r]), _.get(Se.bindings[r], "metadata.deletionTimestamp") || Se.deleteableBindingsByApplicationUID[n].push(Se.bindings[r]), Se.applicationsByBinding[r] = Se.applicationsByBinding[r] || [], Se.applicationsByBinding[r].push(e));
});
});
}), L.bindingsByInstanceRef = _.reduce(L.bindingsByInstanceRef, function(e, t, n) {
return e[n] = _.sortBy(t, function(e) {
var t = _.get(Se.applicationsByBinding, [ e.metadata.name ]);
return _.get(_.head(t), [ "metadata", "name" ]) || e.metadata.name;
}), e;
}, {});
}
}
}, Tt = function() {
Se.bindableServiceInstances = c.filterBindableServiceInstances(Se.serviceInstances, Se.serviceClasses, Se.servicePlans), Se.orderedServiceInstances = c.sortServiceInstances(Se.serviceInstances, Se.serviceClasses);
}, Rt = [], Nt = O ? {
skipErrorNotFound: !0
} : {};
j.get(r.project, Nt).then(_.spread(function(t, a) {
Se.project = e.project = t, Se.context = e.context = a;
var r = function() {
L.pods && v.fetchReferencedImageStreamImages(L.pods, Se.imagesByDockerReference, Se.imageStreamImageRefByDockerReference, a);
}, o = function(e) {
L.daemonSets = e.by("metadata.name"), dt(L.daemonSetData), dt(L.monopods), He(L.daemonSets), tt(L.daemonSets), It(), Oe(), S.log("daemonsets", L.daemonSets);
}, i = !1, s = function() {
i || (Rt.push(m.watch(Q, a, o, {
poll: V,
pollInterval: 6e4
})), i = !0);
}, c = function(e) {
var t = P.getOwnerReferences(e);
return _.some(t, {
controller: !0,
kind: "DaemonSet"
});
}, l = function() {
i || _.some(L.pods, c) && s();
};
if (Rt.push(m.watch(ae, a, function(e, t) {
L.pods = e.by("metadata.name"), rt(), r(), et(), dt(L.monopods), He(L.monopods), tt(L.monopods), Oe(), t && "ADDED" !== t || l(), S.log("pods (subscribe)", L.pods);
})), Rt.push(m.watch(oe, a, function(e) {
L.replicationControllers = e.by("metadata.name"), st(), dt(L.vanillaReplicationControllers), dt(L.monopods), He(L.vanillaReplicationControllers), tt(L.vanillaReplicationControllers), It(), Oe(), S.log("replicationcontrollers (subscribe)", L.replicationControllers);
})), Rt.push(m.watch(Z, a, function(e) {
L.deploymentConfigs = e.by("metadata.name"), st(), dt(L.deploymentConfigs), dt(L.vanillaReplicationControllers), tt(L.deploymentConfigs), Ze(), _t(), Pt(), It(), Oe(), S.log("deploymentconfigs (subscribe)", L.deploymentConfigs);
})), Rt.push(m.watch(re, a, function(e) {
L.replicaSets = e.by("metadata.name"), lt(), dt(L.vanillaReplicaSets), dt(L.monopods), He(L.vanillaReplicaSets), tt(L.vanillaReplicaSets), It(), Oe(), S.log("replicasets (subscribe)", L.replicaSets);
})), Rt.push(m.watch(X, a, function(e) {
fe = e.by("metadata.uid"), L.deployments = _.sortBy(fe, "metadata.name"), lt(), dt(L.deployments), dt(L.vanillaReplicaSets), tt(L.deployments), It(), Oe(), S.log("deployments (subscribe)", L.deploymentsByUID);
})), Rt.push(m.watch(Y, a, function(e) {
Se.builds = e.by("metadata.name"), kt(), S.log("builds (subscribe)", Se.builds);
})), Rt.push(m.watch(pe, a, function(e) {
L.statefulSets = e.by("metadata.name"), dt(L.statefulSets), dt(L.monopods), He(L.statefulSets), tt(L.statefulSets), It(), Oe(), S.log("statefulsets (subscribe)", L.statefulSets);
}, {
poll: V,
pollInterval: 6e4
})), m.list(Q, a, function(e) {
o(e), _.isEmpty(L.daemonSets) || s();
}), Rt.push(m.watch(me, a, function(e) {
Se.allServices = e.by("metadata.name"), mt(), S.log("services (subscribe)", Se.allServices);
}, {
poll: V,
pollInterval: 6e4
})), Rt.push(m.watch(se, a, function(e) {
L.routes = e.by("metadata.name"), pt(), S.log("routes (subscribe)", L.routes);
}, {
poll: V,
pollInterval: 6e4
})), Rt.push(m.watch(W, a, function(e) {
L.buildConfigs = e.by("metadata.name"), vt(), _t(), kt(), Oe(), S.log("buildconfigs (subscribe)", L.buildConfigs);
}, {
poll: V,
pollInterval: 6e4
})), Rt.push(m.watch(ee, a, function(e) {
L.horizontalPodAutoscalers = e.by("metadata.name"), gt(), S.log("autoscalers (subscribe)", L.horizontalPodAutoscalers);
}, {
poll: V,
pollInterval: 6e4
})), Rt.push(m.watch(te, a, function(e) {
he = e.by("metadata.name"), v.buildDockerRefMapForImageStreams(he, Se.imageStreamImageRefByDockerReference), r(), S.log("imagestreams (subscribe)", he);
}, {
poll: V,
pollInterval: 6e4
})), Rt.push(m.watch(ie, a, function(e) {
Se.quotas = e.by("metadata.name"), jt();
}, {
poll: !0,
pollInterval: 6e4
})), Rt.push(m.watch(J, a, function(e) {
Se.clusterQuotas = e.by("metadata.name"), jt();
}, {
poll: !0,
pollInterval: 6e4
})), e.AEROGEAR_MOBILE_ENABLED && Rt.push(m.watch({
group: "mobile.k8s.io",
version: "v1alpha1",
resource: "mobileclients"
}, a, function(e) {
L.mobileClients = e.by("metadata.name"), Oe(), S.log("mobileclients (subscribe)", e);
}, {
poll: V,
pollInterval: 6e4
})), e.KUBEVIRT_ENABLED) {
Rt.push(m.watch(A.offlineVirtualMachine, a, function(e) {
L.offlineVirtualMachines = e.by("metadata.name"), B(), Oe();
}, {
poll: V,
pollInterval: 6e4
}));
Rt.push(m.watch(A.virtualMachine, a, function(e) {
L.virtualMachines = e.by("metadata.name"), B(), Oe();
}, {
poll: V,
pollInterval: 6e4
}));
}
var p, g, f = {}, h = {};
u.SERVICE_CATALOG_ENABLED && x(ue, "watch") && (p = function(e) {
var t = N.getServiceClassNameForInstance(e);
if (!t) return n.when();
var a = _.get(Se, [ "serviceClasses", t ]);
return a ? n.when(a) : (f[t] || (f[t] = m.get(le, t, {}).then(function(e) {
return Se.serviceClasses[t] = e, e;
}).finally(function() {
delete h[t];
})), f[t]);
}, g = function(e) {
var t = N.getServicePlanNameForInstance(e);
if (!t) return n.when();
var a = _.get(Se, [ "servicePlans", t ]);
return a ? n.when(a) : (h[t] || (h[t] = m.get(de, t, {}).then(function(e) {
return Se.servicePlans[t] = e, e;
}).finally(function() {
delete h[t];
})), h[t]);
}, Rt.push(m.watch(ue, a, function(e) {
Se.serviceInstances = e.by("metadata.name");
var t = [];
_.each(Se.serviceInstances, function(e) {
var n = T.getServiceInstanceAlerts(e);
Me(e, n), t.push(p(e)), t.push(g(e));
}), I.waitForAll(t).finally(function() {
Tt(), Oe();
}), tt(Se.serviceInstances);
}, {
poll: V,
pollInterval: 6e4
}))), u.SERVICE_CATALOG_ENABLED && x(ce, "watch") && Rt.push(m.watch(ce, a, function(e) {
Se.bindings = e.by("metadata.name"), L.bindingsByInstanceRef = _.groupBy(Se.bindings, "spec.instanceRef.name"), It();
}, {
poll: V,
pollInterval: 6e4
})), m.list(ne, a, function(e) {
Se.limitRanges = e.by("metadata.name");
});
var y = d.SAMPLE_PIPELINE_TEMPLATE;
y && m.get(ge, y.name, {
namespace: y.namespace
}, {
errorNotification: !1
}).then(function(t) {
L.samplePipelineURL = w.createFromTemplateURL(t, e.projectName);
}), e.$on("$destroy", function() {
m.unwatchAll(Rt), $(window).off(".overview");
});
}), function(t) {
O && _.get(t, "notFound") && (g.notifyInvalidProjectHomePage(e.projectName), w.toProjectList());
});
}

function ResourceServiceBindings(e, t, n, a, r) {
var o, i = this, s = e("enableTechPreviewFeature");
i.bindings = [], i.bindableServiceInstances = [], i.serviceClasses = [], i.serviceInstances = [], i.showBindings = a.SERVICE_CATALOG_ENABLED && s("pod_presets");
var c = e("isIE")(), l = [], u = e("canI"), d = i.serviceBindingsVersion = t.getPreferredVersion("servicebindings"), m = t.getPreferredVersion("clusterserviceclasses"), p = t.getPreferredVersion("serviceinstances"), g = t.getPreferredVersion("clusterserviceplans"), f = function() {
i.apiObject && i.bindings && (i.bindings = n.getBindingsForResource(i.bindings, i.apiObject));
}, h = function() {
i.bindableServiceInstances = n.filterBindableServiceInstances(i.serviceInstances, i.serviceClasses, o), i.orderedServiceInstances = n.sortServiceInstances(i.serviceInstances, i.serviceClasses);
};
i.createBinding = function() {
i.overlayPanelVisible = !0, i.overlayPanelName = "bindService";
}, i.closeOverlayPanel = function() {
i.overlayPanelVisible = !1;
};
var v = function() {
r.unwatchAll(l), l = [], a.SERVICE_CATALOG_ENABLED && u(d, "watch") && l.push(r.watch(d, i.projectContext, function(e) {
i.bindings = e.by("metadata.name"), f();
}, {
poll: c,
pollInterval: 6e4
})), a.SERVICE_CATALOG_ENABLED && u(p, "watch") && (l.push(r.watch(p, i.projectContext, function(e) {
i.serviceInstances = e.by("metadata.name"), h();
}, {
poll: c,
pollInterval: 6e4
})), r.list(m, {}, function(e) {
i.serviceClasses = e.by("metadata.name"), h();
}), r.list(g, {}, function(e) {
o = e.by("metadata.name");
}));
};
i.$onChanges = function(e) {
e.projectContext && i.showBindings && v();
}, i.$onDestroy = function() {
r.unwatchAll(l);
};
}

function ServiceInstanceBindings(e, t, n) {
var a = this, r = e("canI"), o = a.serviceBindingsVersion = t.getPreferredVersion("servicebindings"), i = function() {
a.bindable = r(o, "create") && n.isServiceBindable(a.serviceInstance, a.serviceClass, a.servicePlan);
};
a.createBinding = function() {
a.overlayPanelVisible = !0;
}, a.closeOverlayPanel = function() {
a.overlayPanelVisible = !1;
}, a.$onChanges = function() {
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
expanding_persistent_volumes: "dev_guide/expanding_persistent_volumes.html",
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
iconClass: "pficon pficon-catalog",
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
"icon-cordova": "cordova.png",
"icon-datagrid": "datagrid.svg",
"icon-datavirt": "datavirt.svg",
"icon-debian": "debian.svg",
"icon-decisionserver": "decisionserver.svg",
"icon-django": "django.svg",
"icon-dotnet": "dotnet.svg",
"icon-drupal": "drupal.svg",
"icon-eap": "eap.svg",
"icon-elastic": "elastic.svg",
"icon-erlang": "erlang.svg",
"icon-fedora": "fedora.svg",
"icon-freebsd": "freebsd.svg",
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
"icon-kubevirt": "kubevirt.svg",
"icon-laravel": "laravel.svg",
"icon-load-balancer": "load-balancer.svg",
"icon-mariadb": "mariadb.svg",
"icon-mediawiki": "mediawiki.svg",
"icon-memcached": "memcached.svg",
"icon-mongodb": "mongodb.svg",
"icon-mssql": "mssql.svg",
"icon-mysql-database": "mysql-database.svg",
"icon-nginx": "nginx.svg",
"icon-nodejs": "nodejs.svg",
"icon-openjdk": "openjdk.svg",
"icon-openshift": "openshift.svg",
"icon-openstack": "openstack.svg",
"icon-other-linux": "other-linux.svg",
"icon-other-unknown": "other-unknown.svg",
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
"icon-suse": "suse.svg",
"icon-symfony": "symfony.svg",
"icon-tomcat": "tomcat.svg",
"icon-ubuntu": "ubuntu.svg",
"icon-wildfly": "wildfly.svg",
"icon-windows": "windows.svg",
"icon-wordpress": "wordpress.svg",
"icon-xamarin": "xamarin.svg",
"icon-zend": "zend.svg"
},
CLUSTER_RESOURCE_OVERRIDES_EXEMPT_PROJECT_NAMES: [ "openshift", "kubernetes", "kube" ],
CLUSTER_RESOURCE_OVERRIDES_EXEMPT_PROJECT_PREFIXES: [ "openshift-", "kubernetes-", "kube-" ]
}), angular.module("gettext").run([ "gettextCatalog", function(e) {
e.setStrings("zh_CN", {
". Can't create resource in different projects.": ".在不同的项目中无法创建资源.",
". The web console has a 5 MiB file limit.": "web console 限制文件5M以下.",
". You cannot create new storage since you are at quota.": ".在配额时，你无法创建新存储.",
"(Build and Runtime)": "(构建和运行时间)",
"(cannot be changed)": "(无法被修改)",
"(Paused)": "(已暂停)",
"(Runtime only)": "(运行时间)",
"{{deployment.metadata.name}} is paused.": "{{deployment.metadata.name}}已暂停.",
"{{deployment.status.updatedReplicas}} up to date": "{{deployment.status.updatedReplicas}}已更新",
"{{deploymentConfig.metadata.name}} is paused.": "{{deploymentConfig.metadata.name}}已暂停.",
"{{event.count}} times in the last": "最近{{event.count}}次",
"{{notification.event.count}} times in the last": "最近{{notification.event.count}}次",
"{{notificationGroup.totalUnread}} Unread": "{{notificationGroup.totalUnread}}未读",
"A cluster admin can create a project for you by running the command": "集群管理员可以通过运行该命令为您创建项目",
"A command is required.": "命令是必需的。",
"A container will default to request this amount of a compute resource if no request is specified. The system will guarantee the requested amount of compute resource when scheduling a container for execution. If a quota is enabled for this compute resource, the quota usage is incremented by the requested value.": "如果未指定任何请求，容器将默认为请求此数量的计算资源。 在安排容器执行时，系统将保证所请求的计算资源量。 如果为此计算资源启用了配额，则配额使用量将按请求的值递增。",
"A file will be created in this directory for each key from the config\n                        map or secret. The file contents will be the value of the key.": "在该目录下将给每个来自config map 或者secret的key创建一个文件 。 文件内容将是密钥的值。",
"A Git repository URL is required.": "需要Git仓库URL。",
"A Jenkinsfile is a Groovy script that defines your pipeline. In the Jenkinsfile, you can declare\n    pipeline stages and run one or more steps within each stage. Here are some examples you can use\n    in your pipelines.": "Jenkinsfile是一个定义pipeline的Groovy脚本。 在Jenkinsfile中，您可以声明pipeline阶段并在每个阶段中运行一个或多个步骤。 以下是您可以在pipelines使用的一些示例。",
"A liveness probe checks if the container is still running. If the liveness\n                  probe fails, the container is killed.": "Liveness Probe检查容器是否仍在运行。 如果Liveness Probe失败，容器被杀死。",
"a mistyped address": "一个错误的地址",
"A name is required.": "名称必须.",
"A new deployment will start automatically when": "新部署将自动启动当",
"A persistent volume claim is required to attach to this": "持久化卷声明需要挂载到",
"A project is required in order to complete the installation.": "需要一个项目才能完成安装。",
"A readiness probe checks if the container is ready to handle requests. A\n                  failed readiness probe means that a container should not receive any traffic\n                  from a proxy, even if it's running.": "readiness probe检查容器是否准备好处理请求。 探测出失败意味着容器不应接收任何来自代理的流量，即使它正在运行。",
"A short description.": "简述.",
"A token is a form of a password.": "token是密码的一种形式。",
"A token is a form of a password. Do not share your API token.": "token是密码的一种形式，勿与API token共享.",
"A unique key for this {{type}} entry.": "{{type}}的唯一键。",
"A unique name for the {{type}} within the project.": "项目中{{type}}的唯一名称。",
"A unique name for the horizontal pod autoscaler within the project.": "项目中horizontal pod 自动扩缩容的唯一名称。",
"A unique name for the route within the project.": "项目中路径的唯一名称。",
"A unique name for the storage claim within the project.": "项目中存储声明的唯一名称。",
"A valid environment variable name must consist of alphabetic characters, digits, '_', '-', or '.', and must not start with a digit.": "合法的环境变量名称必须由字母字符，数字，“_”，“ - ”或“。”组成，并且不得以数字开头。",
"A valid name is applied to all generated resources. It is an alphanumeric (a-z, and 0-9) string with a maximum length of 24 characters, where the first character is a letter (a-z), and the '-' character is allowed anywhere except the first or last character.": "有效名称将应用于所有生成的资源。 它是一个字母数字（a-z和0-9）字符串，最大长度为24个字符，其中第一个字符是字母（a-z），除了第一个或最后一个字符外，允许使用“ - ”字符。",
"A value for replicas is required.": "replicas是必须的。",
"Abort deployment on failure": "失败时中止部署",
About: "关于",
"About Compute Resources": "关于计算资源",
Access: "访问",
"Access denied": "拒绝访问",
"Access Mode": "访问模式",
"Access Modes": "访问模式",
"Access Modes:": "访问模式",
Account: "帐户",
"Action:": "操作:",
Actions: "操作",
"Active Deadline:": "活动截止日期：",
Add: "添加",
"Add a mobile service to your project. Or connect to external service.": "向您的项目添加移动服务。 或连接到外部服务。",
"Add ALL Values from Config Map or Secret": "从Config Map或Secret添加所有值",
"Add an existing persistent volume claim to the template of": "将现有持久卷声明添加到模板",
"Add Another Secret": "添加另一个Secret",
"Add Another Service": "添加另一个Service",
"Add argument": "添加参数",
"Add Autoscaler": "添加自动扩缩容",
"Add Config Files": "添加配置文件",
"Add Config Files to {{dcName}}": "添加配置文件到 {{dcName}}",
"Add Config Files to {{name}}": "添加配置文件到 {{name}}",
"Add content to your project from the catalog of web frameworks, databases, and other components. You may also deploy an existing image, create or replace resources from their YAML or JSON definitions, or select an item shared from another project.": "从Web框架，数据库和其他组件的目录中向项目添加内容。 您还可以部署现有映像，从其YAML或JSON定义创建或替换资源，或选择从另一个项目共享的项目。",
"Add Health Checks": "添加健康检查",
"Add Item": "添加项",
"Add Liveness Probe": "添加Liveness Probe",
"Add only certain keys or use paths that are different than the key names.": "仅添加某些键或使用与键名称不同的路径。",
"Add Readiness Probe": "添加Readiness Probe",
"Add Storage": "添加存储",
"Add Storage to {{dcName}}": "添加存储到 {{dcName}}",
"Add Storage to {{name}}": "添加存储到 {{name}}",
"Add Template": "添加模板",
"Add this": "添加",
"Add to Application": "添加到应用",
"Add to Project": "添加到项目",
"Add Value from Config Map or Secret": "从Config Map或Secret添加值",
"Add values from a config map or secret as volume. This will make the data available as files for": "将config map或secret中的值添加为卷。 这将使数据可用作文件",
additional: "额外",
"Admission status unknown for router '{{ingress.routerName}}'": "路由器“{{ingress.routerName}}”的许可状态未知",
"advanced image options.": "高级镜像选项。",
"advanced options": "高级选项",
"advanced strategy options.": "高级策略选项。",
"After downloading and installing it, you can start by logging in. You are currently logged into this console as": "下载并安装后，您可以从登录开始。您当前登录此控制台",
"After you login to your account you will get a list of projects that you can switch between:": "登录到您的帐户后，您将获得可以在以下项之间切换的项目列表：",
Age: "年龄",
ago: "之前",
"All content is hidden by the current filter.": "所有内容都被当前筛选条件隐藏。",
"All events hidden by filter.": "所有事件都被当前筛选条件隐藏。",
"All items in list were created successfully.": "列表中的所有项目都已成功创建。",
"All items in list were updated successfully.": "列表中的所有项目都已成功更新。",
"All items in template {{name}} were created successfully.": "{{name}} 模板中的所有项已创建成功.",
"All pipelines are filtered.": "所有pipelines已被过滤掉.",
"All resources for application {{name}} were created successfully.": "已成功创建应用程序{{name}}的所有资源。",
"All resources for image {{name}} were created successfully.": "镜像{{name}}的所有资源都已成功创建。",
allocated: "分配",
"allocated unknown size": "分配未知的大小",
allocation: "分配",
"already exists.": "已经存在。",
"Alternate service for route traffic.": "路由流量的备用服务。",
"Alternate Services": "替代服务",
"Always pull the builder image from the docker registry, even if it is present locally": "始终从docker注册表中提取构建器映像，即使它在本地存在",
"An error has occurred": "发生错误",
"An error occurred  adding {{source}} {{name}} to {{target}} {{app}}.": "添加{{source}} {{name}}到 {{target}} {{app}}出错.",
"An error occurred {{status}} the deployment config.": " deployment config出现错误 {{status}}.",
"An error occurred {{status}} the deployment.": "deployment出现错误{{status}}.",
"An error occurred attaching the {{sourceKind}} to the {{targetKind}}.": "挂载 {{sourceKind}} 到 {{targetKind}}出错.",
"An error occurred attaching the persistent volume claim to the {{kind}}.": "将持久卷声明附加到{{kind}}时发生错误。",
"An error occurred creating project.": "创建项目出错.",
"An error occurred creating the config map.": "创建 config map出错.",
"An error occurred creating the horizontal pod autoscaler.": "创建 horizontal pod自动扩缩容出错.",
"An error occurred creating the project.": "创建项目出错.",
"An error occurred creating the route.": "创建路由出错.",
"An error occurred deleting the binding.": "删除绑定时发生错误。",
"An error occurred finding the image.": "查找镜像出错.",
"An error occurred getting metrics.": "获取指标时出错。",
"An error occurred loading the log.": "加载日志时出错。",
"An error occurred processing the template.": "处理模板时出错。",
"An error occurred requesting storage.": "请求存储时发生错误。",
"An error occurred scaling {{kind}} {{name}}.": "扩展 {{kind}} {{name}}发生错误.",
"An error occurred scaling the deployment config.": "扩展部署配置时发生错误。",
"An error occurred scaling the deployment.": "扩展部署时发生错误。",
"An error occurred scaling.": "扩缩容发生错误。",
"An error occurred starting the debug pod.": "启动调试pod时发生错误。",
"An error occurred updating build config {{name}}.": "更新构建配置{{name}}时发生错误。",
"An error occurred updating deployment config {{name}}.": "更新部署配置{{name}}时发生错误。",
"An error occurred updating environment variables for {{kind}} {{name}}.": "为 {{kind}} {{name}}更新环境变量出现错误.",
"An error occurred updating environment variables for build config {{name}}.": "更新构建配置{{name}}的环境变量时发生错误。",
"An error occurred updating metrics for pod {{pod}}.": "为pod {{pod}}更新指标出现错误.",
"An error occurred updating metrics.": "更新指标发生错误.",
"An error occurred updating route {{routeName}}.": "更新路径 {{routeName}}发生错误.",
"An error occurred updating the config map.": "更新config map发生错误。",
"An error occurred updating the resources.": "更新资源发生错误.",
"An error occurred while creating the secret.": "创建secret出现错误.",
"An error occurred while linking the secret with service account {{link}}.": "将secret与服务帐户{{link}}关联时发生错误。",
"An error occurred while updating the project": "更新项目出现错误",
"An error occurred.": "出现错误.",
"an image is pushed to": "镜像推送到",
"An image stream or template is required.": "image stream 或 模板是必须的.",
"An image that can carry out the deployment.": "可以执行部署的镜像。",
"an out-of-date link": "一个过时的链接",
"and any running pods.": "以及任何正在运行的pod。",
"and its data will no longer be available to your applications.": "并且您的应用程序将无法再使用其数据。",
"and the": "和",
"Any remaining build history for this build will be shown.": "将显示此版本的任何剩余构建历史记录。",
"Any remaining deployment history for this deployment will be shown.": "将显示此部署的任何剩余部署历史记录。",
Application: "应用",
"Application Console": "应用控制台",
Applications: "应用",
"Applied Parameter Values": "应用参数值",
"Are you sure you want to delete the": "您确定要删除",
"Are you sure you want to leave with the debug terminal open? The debug pod will not be deleted unless you close the dialog.": "你确定要打开调试终端吗？ 除非关闭对话框，否则不会删除调试pod。",
"Are you sure you want to scale": "你确定要扩缩容",
Arguments: "参数",
as: "作为",
"Authentication Type": "认证类型",
"authored by": "作者是",
"authored by {{build.spec.revision.git.author.name}}": "作者是{{build.spec.revision.git.author.name}}",
"Autodeploy when": "自动部署当",
"Automatically build a new image when the builder image changes": "镜像构建器更改时自动生成新镜像",
"Automatically building a new image when the builder image changes allows your code to always run on the latest updates.": "在镜像构建器更改时自动构建镜像允许代码始终在最新更新上运行。",
"Automatically start a new deployment when the deployment configuration changes": "部署配置更改时自动启动新部署",
"Automatically start a new deployment when the image changes": "镜像更改时自动启动新部署",
"Autoscaler Name": "Autoscaler名称",
"Autoscaling is not enabled. There are no autoscalers for this": "Autoscaling没有开启，没有autoscalers适用",
"Autoscaling is not enabled. There are no autoscalers for this deployment config.": "Autoscaling没有开启，没有autoscalers适用部署配置。",
"Autoscaling not supported for kind {{kind}}.": "Autoscaling不支持 {{kind}}类型。",
available: "可用",
"Available of": "可提供",
Average: "平均",
"Average build duration {{averageDurationText}}": "平均构建持续时间{{averageDurationText}}",
"Average Duration": "平均持续时间",
"Average per pod": "每个pod的平均值",
"Average Usage": "平均使用率",
Back: "返回",
"Back to": "返回",
"Back to catalog": "返回目录",
"Back to overview": "返回概述",
"Basic CLI Operations": "基本CLI操作",
"Binary Input as File:": "二进制输入为文件：",
"Binary Units": "二进制单位",
Bind: "绑定",
Binding: "绑定",
"Binding for the following has been deleted:": "已删除以下绑定：",
Bindings: "绑定",
"Bitbucket Webhook URL:": "Bitbucket Webhook网址：",
Browse: "浏览",
"Browse Catalog": "浏览目录",
"Browse Mobile Services": "浏览移动服务",
"Build config {{name}} was successfully updated.": "Build config{{name}}已成功更新。",
"build configuration {{buildConfig.metadata.name}}.": "build configuration {{name}}已被删除.",
"Build configuration {{name}} has been deleted.": "Build configuration {{name}}已被删除.",
"Build hooks allow you to run commands at the end of the build to verify the image.": "Build hooks 允许您在构建结束时运行命令以验证镜像。",
"Build Strategy": "Build策略",
"Build Strategy:": "Build策略：",
"Builder Image:": "Builder 镜像:",
"Builds source code": "Builds源码",
"Builds triggered from this Build Configuration will run all at the same time. The order in which they will finish is not guaranteed.": "从Build Configuration触发的Builds将同时运行。 他们将完成的顺序无法保证。",
"Builds triggered from this Build Configuration will run one at the time, in the order they have been triggered.": "从Build Configuration触发的Builds将按照它们被触发的顺序运行一个。",
"Builds triggered from this Build Configuration will run one at the time. When a currently running build completes, the next build that will run is the latest build created. Other queued builds will be cancelled.": "从此Build Configuration触发的Builds将在当时运行一个。 当前正在运行的构建完成时，将运行的下一个构建是创建的最新构建。 其他排队的构建将被取消。",
"Builds triggered from this Build Configuration will run using the": "从此Build Configuration触发的Builds将使用",
"Builds will create an image from": "Builds将创建一个镜像从",
"but none are loaded on this project.": "但是这个项目都没有加载。",
"CA Certificate": "CA证书",
"CA Certificate File": "CA证书文件",
"CA Certificate:": "CA证书：",
"can't be created in project {{name}}": "无法在项目{{name}}中创建",
"Can't be greater than": "不能大于",
"Can't be less than": "不能小于",
"Can't be longer than {{hostnameMaxLength}} characters.": "不能超过{{hostnameMaxLength}}个字符。",
"Can't be longer than {{nameValidation.maxlength}} characters.": "不能超过{{nameValidation.maxlength}}个字符。",
"Can't be negative.": "不能否定。",
Cancel: "取消",
"Cancel Build": "取消Build",
"Cannot change resource group (original:": "无法修改资源组 (original:",
"Cannot change resource kind (original:": "无法修改资源类型 (original:",
"Cannot create": "无法创建",
"Cannot create from source: a base image tag was not specified": "无法从资源中创建:镜像 tag不明确",
"Cannot create from source: a base image was not specified": "无法从资源中创建:镜像不明确",
"Cannot create from source: the specified image could not be retrieved.": "无法从资源中创建:镜像无法获取.",
"Cannot create from template: a template name was not specified.": "无法从模板中创建:模板名称不明确.",
"Cannot create from template: the specified template could not be retrieved.": "无法从模板中创建:模板无法获取.",
"Cannot update": "无法更新",
Capacity: "容量",
"Capacity:": "容量：",
Catalog: "目录",
"Catalog category {{category}} not found.": "找不到目录类别{{category}}。",
"Catalog category {{category}}/{{subcategory}}not found.": "未找到目录类别{{category}} / {{subcategory}}。",
"Catalog Home (Default)": "目录主页（默认）",
Certificate: "证书",
"Certificate:": "证书：",
Certificates: "证书",
change: "改变",
"Change Of:": "改变",
"Changes will only apply to new pods.": "更改仅适用于新的pods。",
"Check events": "检查事件",
"Check Server Connection": "检查服务器连接",
"Checkout source code and run shell commands on a node labelled 'maven':": "在标记为“maven”的节点上签出源代码并运行shell命令：",
"Choose a Project": "选择一个项目",
"Choose Existing Project": "选择现有项目",
"Choose from web frameworks, databases, and other components to add content to your project.": "从Web框架，数据库和其他组件中进行选择，以向项目添加内容。",
"Claim name:": "Claim 名称：",
Clear: "清除",
"Clear All Filters": "清除筛选",
"Clear Changes": "清除修改",
"Clear notification": "清除通知",
"clear the value": "清除值",
"Clear Value": "清除值",
"CLI Reference": "CLI参考",
Close: "关闭",
"Cluster Console": "集群控制台",
"Cluster IP": "集群IP",
CN: "中文",
Collapse: "折叠",
"Collapse event sidebar": "折叠事件侧栏",
"Collapse to a single line input": "折叠为单行输入",
Command: "命令",
"command line tools": "命令行工具",
"Command Line Tools": "命令行工具",
"Command:": "命令：",
"completed successfully": "成功完成。",
"Compute Resources": "计算资源",
"Config change": "配置变更",
"Config Change For:": "配置变更：",
"Config map {{configMap.metadata.name}} has changed since you started editing it.\n                      You'll need to copy any changes you've made and edit the config map again.": "自您开始编辑后，Config map{{configMap.metadata.name}}已更改。\n                       您需要复制您所做的任何更改并再次编辑config map。",
"Config map {{name}} successfully created.": "Config map{{name}}创建成功.",
"Config map {{name}} successfully updated.": "Config map{{name}}更新成功。",
"Config map {configMap.metadata.name}} has been deleted since you started editing it.": "自您开始编辑后，Config map{configMap.metadata.name}}已被删除。",
"Config maps hold key-value pairs that can be used in pods to read application\n              configuration.": "Config maps 包含可在pod中用于读取应用配置的键值对。",
"Config maps hold key-value pairs that can be used in pods to read application configuration.": "Config maps 包含可在pod中用于读取应用配置的键值对。",
Configuration: "配置",
"Configuration File": "配置文件",
"Configuration file should be in JSON format.": "配置文件应为JSON格式。",
"Configure a webhook build trigger": "配置webhook build trigger",
confirm: "确认",
"Confirm Creation": "确认创建",
"Confirm Delete": "确认删除",
"Confirm Login": "确认登陆",
"Confirm on exit prompt appears to have been blocked by the browser.": "退出提示确认似乎已被浏览器阻止。",
"Confirm Removal": "确认移除",
"Confirm Replace": "确认替换",
"Confirm Save": "确认保存",
"Confirm Scale Down": "确认缩容",
"Confirm User Change": "确认用户变更",
Container: "容器",
"Container {{container.name}}": "容器 {{container.name}}",
"Container health is periodically checked using readiness and liveness probes.": "readiness and liveness probes进行定期检查容器健康状况。",
"Container Metrics": "容器指标",
"Container Name": "容器名称",
"Container Restarts": "容器重启",
"Container:": "容器：",
Containers: "容器",
"Containers Ready": "容器准备就绪",
"Containers:": "容器：",
"contains keys that are not valid environment variable names. Only": "包含无效环境变量名称的键值。只有",
Continue: "继续",
"Continue Session": "继续Session",
"Continue to the project overview": "继续至项目概述",
"Continue with deployment on failure": "失败继续部署",
"Copy to Clipboard": "复制到剪贴板",
"could not be deleted.": "不能被删除.",
"could not be expanded.": "无法扩展.",
"could not be loaded.": "无法加载.",
"could not be updated.": "无法更新.",
"Could not debug container": "无法调试容器",
"Could not delete pod": "无法删除pod",
"Could not find any images for": "未找到任何镜像",
"Could not load": "无法加载",
"Could not load config map {{config}}.": "无法加载{{config}}config map.",
"Could not load config maps": "无法加载config maps",
"Could not load config maps.": "无法加载config maps.",
"Could not load image metadata.": "无法加载镜像元数据.",
"Could not load route {{routeName}}.": "无法加载{{routeName}}.",
"Could not load secrets": "无法加载secrets",
"Could not load secrets.": "无法加载secrets.",
"Could not parse Jenkins status as JSON": "Jenkins状态无法解析为JSON",
"Could not prefill parameter values.": "无法预填充参数值。",
"Could not read file": "无法读取文件",
"Could not start container {{container.name}}.": "无法启动容器{{container.name}}。",
"CPU is often measured in units called 'millicores'. Each millicore is equivalent to": "CPU通常以称为“millicores”的单位来衡量。 每个millicore相当于",
"CPU metrics might not be available. In order to use horizontal pod autoscalers,\n                                your cluster administrator must have properly configured cluster metrics.": "CPU指标可能不可用。 为了使用horizontal pod autoscalers，您的群集管理员必须具有正确配置的群集指标",
"CPU Request": "CPU请求",
"CPU Request Target": "CPU请求目标",
Create: "创建",
"Create a New Project": "创建一个新项目",
"Create a project for your application.": "为您的应用程序创建一个项目。",
"Create a request for an administrator-defined storage asset by specifying size and permissions for a best fit.": "通过指定最佳匹配的大小和权限，创建对管理员定义的存储池的请求。",
"Create a route to the application": "创建到应用程序的路由",
"create an image pull secret": "创建镜像拉取 secret",
"Create Anyway": "仍然创建",
"Create Binding": "创建Binding",
"Create Config Map": "创建Config Map",
"Create New Secret": "创建新的Secret",
"Create or replace resources from their YAML or JSON definitions. If adding a template, you'll have\n    the option to process the template.": "从YAML或JSON定义创建或替换资源。 如果添加模板，您将拥有处理模板的选项。",
"Create Project": "创建项目",
"Create Route": "创建路由",
"Create Sample Pipeline": "创建Sample Pipeline",
"Create Secret": "创建Secret",
"Create Storage": "创建存储",
"Create the objects defined in the template. You will have an opportunity to fill in template parameters.": "创建模板中定义的对象。 您将有机会填写模板参数。",
created: "创建于",
Created: "创建于",
"Created {{kind}}  {{name}}  successfully.": "创建{{kind}}  {{name}}成功.",
"Created {{name}} in project {{project}}": "在项目{{project}}中创建{{name}}",
"Created application {{name}} in project {{projectName}}": "在项目{{projectName}}中创建了应用{{name}}",
"created from": "创建于",
"Creating {{name}} in project {{project}}": "在项目{{project}}中创建{{name}}",
"Creating application {{name}} in project {{projectName}}": "在项目{{projectName}}中创建应用程序{{name}}",
"Creating resources in project {{name}}": "在项目{{name}}中创建资源",
"Creation Date": "创建时间",
Creator: "创建人",
"Credentials Store": "凭证存储",
"Current Usage:": "当前使用率：",
"Custom certificates cannot be used with passthrough termination.": "自定义证书不能与passthrough termination一起使用。",
"Debug Container {{container.name}}": "调试容器{{container.name}}",
"Debug in Terminal": "在终端中调试",
"Decimal Units": "十进制单位",
Default: "默认",
"Defines minimum and maximum constraints for runtime resources such as memory and CPU.": "定义运行时资源（如内存和CPU）的最小和最大限制。",
"Delay can't be negative.": "延迟不能是负数。",
"delay,": "延迟，",
Delete: "删除",
"Delete Binding": "删除Binding",
"Delete pod immediately without waiting for the processes to terminate gracefully": "立即删除pod而不等待进程正常终止",
"Delete row": "删除行",
"Delete This Service": "删除此服务",
"Deletion of Binding Failed": "删除Binding失败",
Deploy: "部署",
"Deploy an existing image from an image stream tag or image registry.": "从 image stream tag 或image registry部署已有的镜像.",
"Deploy Image": "部署镜像",
"Deploy images from an image stream tag": "从 image stream tag 部署镜像.",
"Deployed image {{name}} to project {{project}}": "已部署镜像{{name}}到 {{project}}.",
"Deploying image {{name}} to project {{project}}": "正在部署镜像{{name}}到 {{project}}.",
"Deployment config {{name}} was successfully updated.": "部署配置{{name}}更新成功.",
"deployment config or deployment.": "部署config或deployment。",
"Deployment configuration changes": "部署配置更改",
"deployment strategy": "部署策略",
"Deployment Strategy": "部署策略",
"deployment trigger": "部署触发",
"Deployment:": "部署：",
Deployments: "部署",
Description: "描述",
"Desired storage capacity.": "期望的存储容量。",
"Destination Directory": "目标目录",
Details: "详情",
"Directory where the files will be available at build time.": "文件在构建时可用的目录。",
Dismiss: "丢弃",
"Display Name": "显示名称",
"Do not share your API token. To reveal your token, press the copy to clipboard button and then paste the clipboard contents.": "不要共享您的API token。 要显示您的token，请按复制到剪贴板按钮，然后粘贴剪贴板内容。",
"Do you want to replace the existing resources?": "您想替换现有资源吗？",
"Do you want to replace with the new content?": "您想要替换新内容吗？",
"Dockerfile Path": "Dockerfile 路径",
documentation: "文档",
Documentation: "文档",
"documentation for instructions about downloading and installing the oc client tool.": "有关下载和安装oc客户端工具的说明的文档。",
"documentation.": "文档。",
"does not have any containers with a CPU": "没有任何带CPU的容器",
"does not have health checks": "没有健康检查",
"Don't Show Me Again": "不再显示",
"Done Editing": "完成编辑",
Download: "下载",
"Drop file here": "删除文件",
'Duplicate key "{{item.key}}". Keys must be unique within the {{type}}.': "重复的keys值“{{item.key}}”。 在{{type}}中keys必须是唯一的。",
Duration: "持续时间",
"Duration:": "持续时间：",
"Each container running on a node uses compute resources like CPU and memory. You can specify\n      how much CPU and memory a container needs to improve scheduling and performance.": "在节点上运行的每个容器都使用CPU和内存等计算资源。 你可以指定容器需要多少CPU和内存来改善调度和性能。",
Edit: "编辑",
"Edit Autoscaler": "编辑Autoscaler",
"Edit Build Config": "编辑Build Config",
"Edit Config Map": "编辑Config Map",
"Edit Configuration": "编辑配置",
"Edit Deployment Config": "编辑Deployment Config",
"Edit Health Checks": "编辑Health Checks",
"Edit Membership": "编辑成员",
"Edit Parameters": "编辑参数",
"Edit Pipeline": "编辑Pipeline",
"Edit Project": "编辑项目",
"Edit Project {{project.metadata.name}}": "编辑{{project.metadata.name}}项目",
"Edit Resource": "编辑资源",
"Edit Resource Limits": "编辑资源限制",
"Edit Route {{routeName}}": "编辑{{routeName}}路由",
"edit weights as integers": "将权重编辑为整数",
"Edit Weights Using Percentage Slider": "使用百分比滑块编辑权重",
"Edit YAML": "编辑YAML",
'Editing routes with non-service targets is unsupported. You can edit the route with the "Edit YAML" action instead.': "不支持编辑非服务目标路由，你可以用“编辑YAML”来替代.",
email: "邮箱",
Email: "邮箱",
"Email is required.": "邮箱是必须的.",
"Email must be in the form of": "邮箱必须采用以下形式：",
EN: "英文",
"encountered an error.": "遇到错误。",
"End of log": "日志结束",
"Enter a label and value to use for your storage.": "输入要用于存储的标签和值。",
"Enter the arguments that will be appended to the command.": "输入将附加到命令的参数。",
"Enter the arguments that will be appended to the default image entry point.": "输入将附加到image entry point的参数。",
"Enter the arguments that will be appended to the script.": "输入将附加到脚本的参数。",
"Enter the command to run inside the container. The command is considered successful if its\n        exit code is 0. Drag and drop to reorder arguments.": "输入要在容器内运行的命令。 如果命令被认为是成功，退出代码为0.拖放以重新排序参数。",
Environment: "环境",
"Environment From": "环境来自",
"Environment variables": "环境变量",
"Environment Variables": "环境变量",
"Environment variables are used to configure and pass information to running containers.  These environment variables will be available during your build and at runtime.": "环境变量用于配置信息并将信息传递给正在运行的容器。 这些环境变量将在构建期间和运行时可用。",
"Environment variables can be edited on deployment config": "可以在部署配置上编辑环境变量",
"Environment variables can be edited on the": "编辑环境变量可被编辑在",
"Environment variables can be edited on the deployment": "可以在部署中编辑环境变量",
"Environment variables for build config {{name}} were successfully updated.": "build config{{name}}的环境变量已成功更新。",
"Environment variables for{{kind}} {{name}} were successfully updated.": "{{kind}} {{name}}的环境变量已成功更新。",
"Environment variables to supply to the hook pod's container.": "提供hook pod容器的环境变量。",
"Environment variables were set by": "设置环境变量的是",
"Environment Variables:": "环境变量",
error: "错误",
Error: "错误",
Errors: "错误",
Events: "事件",
"Execute docker build without reusing cached instructions.": "执行docker build而不重用缓存的指令。",
"Exit code:": "退出代码：",
Expand: "展开",
"Expand event sidebar": "展开事件侧栏",
"Expand Persistent Volume Claim": "扩展Persistent Volume Claim",
"expand request has been submitted.": "扩展请求已提交。",
"Expand to enter multiline input": "展开以进入多行输入",
"Exposed on router": "暴露在路由器上",
"External Hostname:": "外网主机名：",
"External IP": "外网IP",
"External IPs:": "外网IP：",
"Fail the deployment if the hook fails.": "如果hook失败，则部署失败。",
failed: "失败",
"Failed to create {{name}} in project {{project}}": "无法在项目{{project}}中创建{{name}}",
"Failed to create {{name}} in project {{projectName}}": "无法在项目{{projectName}}中创建{{name}}",
"Failed to create some resources in project {{name}}": "无法在项目{{name}}中创建一些资源",
"Failed to deployed image {{name}} to project {{project}}": "无法将镜像{{name}}部署到项目{{project}}",
"Failed to process the resource.": "无法处理资源。",
"Failed to update some resources in project {{name}}": "无法更新项目{{name}}中的某些资源",
"failed.": "失败",
"Failure Policy": "失败政策",
"Failure Policy:": "失败政策：",
"File with credentials and other configuration for connecting to a secured image registry.": "具有凭据和其他配置的文件，用于连接到安全的image registry。",
Filter: "筛选",
"Filter by Keyword": "按关键词筛选",
"Filter by labels": "按标签筛选",
"Filter by name": "按名称筛选",
"Filter by name or description": "按名称或描述筛选",
Follow: "跟随",
"For other information about the command line tools, check the": "有关命令行工具的其他信息，请查看",
"for source, routes, builds, and deployments.": "用于资源，路由，构建和部署。",
"from image": "来自镜像",
"from parameters": "通过参数",
Generate: "生成",
"Generic Webhook URL:": "通用Webhook URL：",
"Get Started with the CLI": "开始使用CLI",
"Get started with your project.": "开始你的项目。",
"Get Support": "获取支持",
"Git Configuration File": "Git配置文件",
"Git Reference": "Git参考",
"Git Repository URL": "Git仓库地址",
"Git URL of the source code to build.": "需要build的源代码Git URL。",
"Go to End": "前往底部",
"Go to Project": "前往项目",
"Go to Top": "前往顶部",
"Grace Period:": "宽限期：",
"Group service to {{service.metadata.name}}": "将服务分组到{{service.metadata.name}}",
"has already been added to this application.": "已添加到此应用程序中。",
"has been deleted since you started editing it.": "自您开始编辑后已被删除。",
"has changed since you started editing it. You'll need to copy any changes you've made and edit again the": "自从你开始编辑它以来已经改变了。 您需要复制您所做的任何更改并再次编辑",
"has no properties.": "没有属性。",
"Health checks are not supported for kind {{kind}}.": "Health checks不支持{{kind}}类型.",
"Health Checks:": "健康检查：",
Help: "帮助",
"helps you learn about\n              OpenShift and start exploring its features. From getting started with creating your first application\n              to trying out more advanced build and deployment techniques, it provides guidance on setting up and\n              managing your OpenShift environment as an application developer.": "帮助您了解OpenShift并开始探索其功能。 从开始创建您的第一个应用程序为了尝试更高级的构建和部署技术，它提供了有关设置和安装的指导作为应用程序开发人员管理您的OpenShift环境。",
Hide: "隐藏",
"Hide Advanced Image Options": "隐藏镜像高级选项",
"Hide Advanced Strategy Options": "隐藏策略高级选项",
"Hide examples": "隐藏例子",
"Hide Image Environment Variables": "隐藏镜像环境变量",
History: "历史",
"Hook Types": "Hook类型",
"Horizontal pod autoscaler {{name}} could not be deleted.": "无法删除Horizontal pod autoscaler {{name}} .",
"Horizontal pod autoscaler {{name}} successfully created.": "Horizontal pod autoscaler {{name}} 创建成功.",
"Horizontal pod autoscaler {{name}} successfully updated.": "Horizontal pod autoscaler {{name}} 更新成功.",
"Horizontal pod autoscaler {{name}} was marked for deletion.": "Horizontal pod autoscaler {{name}} 被标记用于删除.",
Hostname: "主机名",
"Hostname must consist of lower-case letters, numbers, periods, and hyphens. It must start and end with a letter or number.": "主机名必须由小写字母，数字，句点和连字符组成。 它必须以字母或数字开头和结尾。",
"Hostname:": "主机名：",
"How long to wait after the container starts before checking its health.": "在检查其运行状况之前，容器启动后等待多长时间。",
"How long to wait for a pod to scale up before giving up.": "在放弃之前等待pod扩容多长时间。",
"How long to wait for the probe to finish. If the time is exceeded, the probe is considered failed.": "等待probe完成多长时间。 如果超过时间，则认为probe失败。",
"HPA {{name}} could not be deleted.": "无法删除HPA {{name}}.",
"Identifies the resources created for this application.": "标识为此应用创建的资源。",
"Identifies the resources created for this image.": "标识为此image创建的资源。",
"Idled due to inactivity.": "由于不活动而空转。",
"If another storage class is not chosen, the default storage class": "如果未选择其他存储类，则为默认存储类",
"If not specified, a hostname is generated.": "如果未指定，则生成主机名。",
"If specified, the compute resource must have a request and limit that are both non-zero, where limit divided by request is less than or equal to the specified amount; this represents the max burst for the compute resource during execution.": "如果指定，则计算资源必须具有非零的请求和限制，其中limit除以请求小于或等于指定的量; 这表示执行期间计算资源的最大突发。",
"If this is unexpected, click Cancel. This could be an attempt to trick you into acting as another user.": "如果这是意外，请单击“取消”。 这可能是一种诱骗你扮演另一个用户的企图。",
"If this isn't what you want,": "如果这不是你想要的，",
"If unchecked, a new rollout will start on save.": "如果未选中，则会在保存时启动新的rollout。",
"If you do not have any existing projects, you can create one:": "如果您没有任何现有项目，可以创建一个：",
"If you need to create resources in this project, a project administrator can grant you additional access by running this command:": "如果需要在此项目中创建资源，项目管理员可以通过运行此命令授予您额外的访问权限：",
"If you want to log into the CLI using the same session token:": "如果要使用相同的session token登录CLI：",
"If your Git repository is private, view the": "如果您的Git存储库是私有的，请查看",
"Ignore hook failures and continue the deployment.": "忽略hook故障并继续部署。",
Image: "镜像",
"Image {{import.name}} runs as the\n            root user which might not be permitted by your cluster\n            administrator.": "Image{{import.name}}1️⃣root运行，群集管理员可能不允许以root运行。",
"Image change": "镜像变化",
"Image Configuration": "镜像配置",
"Image Environment Variables": "镜像环境变量",
"Image Name": "镜像名称",
"Image Registry Server Address": "Image Registry Server地址",
"Image registry server address is required.": "Image registry服务器地址是必需的。",
"Image search is only available for existing projects.": "镜像搜索仅适用于现有项目。",
"Image Source From": "镜像资源来自",
"Image Sources:": "镜像资源",
"Image streams and templates cannot be combined.": "无法组合Image streams和模板。",
"Image value set": "设置镜像值",
Images: "镜像",
"Import YAML / JSON": "导入YAML/JSON",
"in the": "在",
"Increase the capacity of claim": "增加claim容量",
info: "信息",
Information: "信息",
"Init container": "初始化容器",
"Init Containers": "初始化容器",
"Initial Delay": "初始延迟",
"Input Required": "必须输入",
"Insecure Traffic": "不安全Traffic",
"Insecure Traffic:": "不安全Traffic：",
"Instance Name": "实例名",
"instead.": "替换。",
"Interval can't be negative.": "Interval不能是负数。",
"Invalid request": "不合法请求",
is: "是",
"is not valid JSON.": "不是合法的JSON.",
"is Red Hat's container application platform\n                  that allows developers to quickly develop, host, and scale applications in a cloud environment.": "是Red Hat的容器应用程序平台，这允许开发人员在云环境中快速开发，托管和扩展应用程序。",
"is required.": "是必须的。",
"It cannot be undone.": "无法撤消。",
"It will not delete the config map.": "将删除config map.",
"It will not delete the persistent volume claim.": "不删除persistent volume claim.",
"It will not delete the secret.": "不删除secret.",
"Jenkins Pipeline Configuration": "Jenkins Pipeline配置",
"Jenkinsfile Examples": "Jenkinsfile 例子",
"Jenkinsfile Path:": "Jenkinsfile路径",
"Jenkinsfile Source Path": "Jenkinsfile资源路径",
"Jenkinsfile Type": "Jenkinsfile类型",
"Keep some existing {{name}} strategy parameters?": "保留一些现有的{{name}}策略参数？",
"Key is required.": "key是必须的。",
"Keys and Paths": "Keys 和 Paths",
"Keys may not be longer than 253 characters.": "Keys长度不得超过253个字符。",
"Keys may only consist of letters, numbers, periods, hyphens, and underscores.": "Keys可能只包含字母，数字，句点，连字符和下划线。",
"keys with valid names will be added as environment variables.": "具有有效名称的keys将添加为环境变量。",
Keyword: "关键词",
Kind: "类型",
"Kind and Name": "类型和名称",
"Kind or name parameter missing.": "缺少类型或名称参数。",
Labels: "标签",
"Labels are used to organize, group, or select objects and resources, such as pods.": "标签用于组织，分组或选择对象和资源，例如pod。",
Language: "语言",
"Last 15 Minutes": "至少15分钟",
"Last Build": "最新Build",
"Last Scaled:": "最近扩容：",
"Last State": "最新状态",
"Last Version": "最新版本",
"Launch the first build when the build configuration is created": "在build configuration创建好时启动第一个build",
"Learn More": "了解更多",
"Learn more about": "了解更多关于",
limit: "限制",
Limit: "限制",
"Limit can't be less than request": "限制不能低于要求",
"Limit cannot be more than {{maxLimitRequestRatio}} times request value.": "限制不能超过{{maxLimitRequestRatio}}次请求值。",
"Limit is required if request is set.": "如果设置了请求，则需要限制。",
"Limit Range": "限制范围",
"limit reached.": "达到限制值。",
"limit.": "限制。",
Limits: "限制",
"Limits resource usage across a set of projects.": "一组项目中资源使用限制.",
"Limits resource usage within this project.": "项目中资源使用限制.",
"Link secret to a service account.": "将secret链接到服务帐户。",
"List by": "列表按",
"List of named volumes to copy to the hook pod.": "命名为volumes的列表复制到 hook pod。",
"Loading image metadata for": "加载镜像元数据为",
"Loading...": "加载中…",
"Log from": "日志来自",
"log lines and new log messages will be displayed because of the large log size.": "行日志和新日志信息将显示，因为日志过多。",
"Log out": "退出",
"Log Out": "退出",
"Logging in": "登陆中",
"Logging out...": "退出中…",
"Login command copied.": "登录命令已复制。",
Logs: "日志",
"Logs are not available for replica sets.": "日志不适用于replica sets。",
"Logs are not available for stateful sets.": "日志不适用于stateful sets。",
"Logs are not available for this replication controller because it was not generated from a deployment configuration.": "日志不适用于此replication controller，因为它不是从deployment configuration生成的。",
"Logs are not available.": "日志不可用。",
"Make sure any new fields you may have added are supported API fields.": "确保您添加的任何新字段都是受支持的API字段。",
"Make sure this is something you really want to do!": "确保这是你真正想做的事情！",
"Making code changes": "进行代码更改",
"Mark Read": "标记阅读",
"Marked for Deletion": "标记为删除",
Max: "最大",
"Max Limit/Request": "最大限制/请求",
"Max Pods": "最大Pods",
"Max pods is a required field.": "最大pods是必填字段。",
"Max pods must be a number.": "最大pods必须是一个数字。",
"Max pods must be greater than or equal to": "最大 pods必须大于或等于",
"Max Pods:": "最大Pods：",
"Max Surge:": "最大Surge:",
"Max Unavailable:": "最大不可用：",
"max:": "最大：",
"Maximum Number of Surge Pods": " Surge Pods的最大数值",
"Maximum Number of Unavailable Pods": "不可用pods的最大数值",
Membership: "成员",
Memory: "内存",
"Memory and Storage": "内存和存储",
"Memory and storage are measured in binary units like": "内存和存储以二进制单位测量",
"Memory:": "内存：",
Message: "消息",
"Message Unread.": "未读消息：",
"Message:": "消息：",
Messages: "消息",
"Metrics are not available.": "Metrics不可用。",
"Metrics might not be configured by your cluster administrator. Metrics are required for autoscaling.": "群集管理员可能未配置Metrics。 autoscaling需要Metrics。",
"Mid hooks execute after the previous deployment is scaled down to zero and before the first pod of the new deployment is created.": "在之前的deployment缩容到零之后并且在创建新deployment的第一个pod之前执行中间hooks。",
Min: "最小",
"Min Pods": "最小Pods",
"Min pods must be a number.": "最小pods必须是一个数字。",
"Min pods must be a whole number.": "最小pods必须是一个整数。",
"Min pods must be greater than or equal to 1.": "最小pods必须大于或等于1。",
"min pods, which is": "最小pods，是",
"Min Pods:": "最小Pods",
"Min Ready:": "最小准备：",
"min:": "最小",
"Minimum character count is {{keyMinlength}}": "最小字符数为{{keyMinlength}}",
"Minimum character count is {{valueMinlength}}": "最小字符数为{{valueMinlength}}",
"Mode:": "模式：",
Monitoring: "监控",
"More than one image tag is defined. To change image tags, use the YAML editor.": "定义了多个image tag。 要更改image tags，请使用YAML编辑器。",
"Mount path": "挂载路径",
"Mount Path": "挂载路径",
"Mount path for the volume inside the container. If not specified, the volume will not be mounted automatically.": "容器内卷的挂载路径。 如果未指定，则不会自动装入卷。",
"Mount path for the volume.": "卷的挂载路径。",
"Mount Path for the volume. A file will be created in this directory for each key from the": "卷的挂载路径。 将在此目录中为每个键创建一个文件来自",
"Mount path must be a valid path to a directory starting with": "挂载路径必须是合法的目录路径，开头是",
"Mount the volume as read-only.": "将卷挂载为只读。",
"Mount:": "挂载：",
"Move row": "移动行",
"Must be a non-negative whole number or percentage.": "必须是非负整数或百分比。",
"Must be a number.": "必须是一个数字。",
"Must be a positive number.": "必须是正数。",
"Must be a whole number greater than or equal to 0.": "必须是大于或等于0的整数。",
"Must be a whole number.": "必须是一个整数。",
"My Projects": "我的项目",
"My Projects List": "我的项目列表",
Name: "名称",
"Name can't have more than 24 characters.": "名称不能超出24个字符。",
"Name is required.": "名称是必须的。",
"Name must be an alphanumeric (a-z, 0-9) string with a maximum length\n              of 24 characters where the first character is a letter (a-z). The '-'\n              character is allowed anywhere except the first or last character.": "名称必须是具有最大长度的字母数字（a-z，0-9）字符串24个字符，其中第一个字符是字母（a-z）。 除第一个或最后一个字符外，允许使用字符 - 。",
"Name must have at least 2 characters.": "名称至少两个字符。",
'Names will be prefixed with "{{entry.prefix}}"': "名称将以“{{entry.prefix}}为前缀”",
Namespace: "命名空间",
"Namespace:": "命名空间：",
"namespace. An image or template is required to add content.": "命名空间。添加内容需要镜像或模板。",
Networking: "网络",
"new {{subjectKind.name}} role": "新的{{subjectKind.name}}角色",
"New Image For:": "新Image：",
"New image is available": "新image可用",
Next: "下一步",
"Next >": "下一步>",
No: "无",
"No {{resourceName}} have been added to project {{projectName}}.": "项目{{projectName}}中未添加{{resourceName}}。",
"No Available Projects": "没有可用的项目",
"No bindings": "无bindings",
"No builds": "无builds",
"No builds have been added to project {{projectName}}.": "项目{{projectName}}中没有添加任何builds。",
"No builds to show": "没有要显示的builds",
"No builds.": "无builds。",
"No changes were applied to {{kind}} {{name}}.": "没有对{{kind}} {{name}}进行任何更改。",
"No config maps have been added to project {{projectName}}.": "没有为项目{{projectName}}添加config maps。",
"No config maps or secrets have been added as Environment From.": "没有config maps或secrets作为环境来源添加。",
"No config maps or secrets.": "无 config maps 或 secrets.",
"No config maps.": "无config maps.",
"No data.": "无数据。",
"No deployments": "无deployments",
"No deployments for": "无deployments",
"No deployments have been added to project {{projectName}}.": "没有为项目{{projectName}}添加任何deployments。",
"No deployments to show": "没有deployments要显示",
"No deployments.": "无deployments。",
"No environment variables set in the": "没有设置环境变量在",
"No events to show.": "没有要显示的事件。",
"No events.": "无事件",
"No image metadata found.": "无镜像元数据。",
"No image streams have been added to project {{projectName}}.": "没有向项目{{projectName}}添加image streams。",
"No image streams.": "无 image streams。",
"No images or templates are loaded for the category {{category.label}}.": "没有为{{category.label}}加载镜像或模板。",
"No images or templates are loaded for this project or the shared": "没有镜像或模板被加载为了该项目或共享的",
"No images or templates.": "无镜像或模板。",
"No layer information is available for this image.": "此镜像没有可用的分层信息。",
"no longer exists.": "不复存在。",
"No metrics to display.": "没有要显示的metrics。",
"No mount path was provided. The volume reference was added to the configuration, but it will not be mounted into running pods.": "没有提供安装路径。 卷参考已添加到配置中，但不会将其装入正在运行的pod中。",
"No persistent volume claims have been added to project {{projectName}}.": "项目{{projectName}}中未添加persistent volume claims。",
"No persistent volume claims.": " 无persistent volume claim。",
"No pipeline builds have run for {{buildConfigName}}.": "没有为{{buildConfigName}}运行pipeline builds。",
"No pipeline runs.": "无pipeline运行。",
"No pipelines have been added to project {{projectName}}.": "项目{{projectName}}中没有添加任何pipelines。",
"No pipelines.": "无pipelines.",
"No pods have been added to project {{projectName}}.": "项目{{projectName}}中未添加任何pods。",
"No pods.": "无pods。",
"No Project Selected": "未选择项目",
"No provisioned services have been added to project {{projectName}}.": "没有为项目{{projectName}}添加配置服务。",
"No provisioned services.": "没有配置服务。",
"no revision information,": "没有修订信息，",
"No Routes": "无 Routes",
"No routes have been added to project {{projectName}}.": "没有为项目{{projectName}}添加routes。",
"No routes or ports to show": "没有要显示的routes或端口",
"No routes.": "无routes。",
"No running containers": "没有运行的容器",
"No secrets have been added to project {{projectName}}.": "项目{{projectName}}没有添加任何secrets。",
"No secrets.": "无secrets。",
"No services have been added to project {{projectName}}.": "没有为项目{{projectName}}添加任何服务。",
"No services.": "无服务。",
"No source inputs have been defined for this build configuration.": "没有为此build configuration定义任何source inputs。",
"No stages have started.": "没有开始的stages。",
"No stateful sets have been added to project {{projectName}}.": "项目{{projectName}}中没有添加任何stateful sets。",
"No stateful sets.": "无stateful sets。",
"No tags to show": "没有要显示的tags",
"No Templates": "无模板",
"No Traffic": "无Traffic",
"No username and password.": "没有用户名和密码。",
"No value": "没有值",
"Node:": "节点：",
none: "无",
None: "无",
Normal: "正常",
"Not all containers have health checks": "并非所有容器都有健康检查",
"Not available": "不可用",
"Not found": "未发现",
"not started": "未开始",
"Note that this will start a new build.": "请注意，这将启动新build。",
"Note: This setting is browser-specific and will not be maintained across browsers.": "注意：此设置是特定于浏览器的，不会跨浏览器进行维护。",
Notifications: "通知",
"one of the images referenced by this deployment config changes.": "此deployment config修改引用其中一个images。",
"Only the first {{limitListTo}} projects are displayed.\n                Filter by keyword or change sort options to see other\n                projects.": "仅显示第一个{{limitListTo}}项目。按关键字过滤或更改排序选项以查看其他项目。",
"Only the previous": "只有前",
"Open Fullscreen Terminal": "打开全屏终端",
"Open Metrics URL": "打开 Metrics URL",
"Open socket on port {{probe.tcpSocket.port}}": "打开socket在端口 {{probe.tcpSocket.port}}",
"OpenShift helps you quickly develop, host, and scale applications.": "OpenShift可帮助您快速开发，托管和扩展应用程序。",
"Operating System:": "操作系统：",
"Optional branch, tag, or commit.": "可选的branch, tag, or commit.",
"Optional path to the Jenkinsfile relative to the context dir.\n                    Defaults to the Jenkinsfile in context dir.": "相对于context dir的Jenkinsfile可选路径。默认为context dir中的Jenkinsfile。",
"Optional path within the volume from which it will be mounted into the\n                    container. Defaults to the volume's root.": "将挂载到容器的卷中的可选路径。 默认为卷的根目录。",
"Optional subdirectory for the application source code, used as the context directory for the build.": "应用源代码的可选子目录，用作build的上下文目录。",
"Optional username for Git authentication.": "Git身份验证的可选用户名。",
"Optionally, you can specify a prefix to use with environment variables.": "（可选）您可以指定用于环境变量的前缀。",
or: "或",
"or contain": "或包含",
"or decimal units like": "或十进制单位类似",
"Original Command:": "原始命令：",
other: "其他",
Other: "其他",
"Other containers can access this service through the hostname": "其他容器可以通过主机名访问此服务",
"other images": "其他镜像",
"Other Projects": "其他项目",
"Other Replication Controllers": "其他Replication Controllers",
"Other Resources": "其他资源",
"Other Trigger:": "其他Trigger:",
others: "其他",
"Output Image:": "输出镜像：",
"Output To:": "输出到：",
"Over limit of": "超过限制值-",
Overview: "概览",
"Overview Page for": "概览-",
"Page Not Found :(": "未发现页面:(",
Parameters: "参数",
"Passthrough routes can't use the insecure traffic policy 'Allow'.": "Passthrough routes不能使用不安全的流量策略’允许’。",
password: "密码",
Password: "密码",
"Password is required.": "密码是必须.",
"Password or Token": "密码或Token",
"Password or token for Git authentication. Required if a ca.crt or .gitconfig file is not specified.": "Git身份验证的密码或token。 如果未指定ca.crt或.gitconfig文件，则为必需。",
"Password or token is required.": "密码或token是必需的。",
Path: "路径",
"Path at which to mount the secret.": "安装secret的路径。",
"path elements.": "路径元素。",
"Path must be a relative path. It cannot start with": "路径必须是相对路径。不能开头是",
"Path must be a relative path. It cannot start with / or contain .. path elements.": "路径必须是相对路径。 它不能以 / 或包含 .. 路径元素开头。",
"Path must start with": "路径必须开头是",
"Path that the router watches to route traffic to the service.": "router监视 route traffic到service的路径。",
"Path value will not be used. Paths cannot be set for passthrough TLS.": "路径值无法使用。 无法为passthrough TLS设置路径。",
"Path:": "路径：",
"Paths must be unique.": "路径必须是唯一的。",
"Paths:": "Paths:",
"Pause Rollouts": "暂停Rollouts",
"Pause rollouts for this": "暂停Rollouts",
"Pausing lets you make changes without triggering a rollout. You can resume rollouts at any time.": "暂停可让您在不触发rollouts的情况下进行更改。 您可以随时恢复rollouts。",
Pending: "加载中",
"Percentage of traffic sent to each service. Drag the slider to adjust the values or": "发送到每项服务的流量百分比。 拖动滑块可调整值或",
"Permissions to the mounted volume.": "已挂载卷的权限。",
"Persistent volume claim {{name}} added to {{kind}} {{route}}.": "Persistent volume claim {{name}} 已被添加到 {{kind}} {{route}}.",
"Persistent volume claim {{name}} successfully created.": "Persistent volume claim {{name}}创建成功.",
"Pick the config source. Its data will be mounted as a volume in the container.": "选择配置源。 其数据将作为卷安装在容器中。",
"pipelines have been added to project {{projectName}}.": "pipelines已被添加到 {{projectName}}.",
Plan: "计划",
"Please enter a valid key.": "请输入有效key。",
"Please enter a valid name.": "请输入有效的名字。",
"Please enter a valid prefix.": "请输入有效的前缀。",
"Please select a project from the dropdown to load templates from that project.": "请从下拉列表中选择一个项目以从该项目加载模板。",
"Please wait while you are logged in": "您在登录时请稍候",
"Pod status:": "Pod状态：",
policy: "策略",
"Policy for traffic on insecure schemes like HTTP.": "不安全方案的流量策略如HTTP。",
Port: "端口",
Ports: "端口",
"Ports:": "端口：",
"Post hooks execute after the deployment strategy completes.": "在部署策略完成后执行Post hooks 。",
"Pre hooks execute before the deployment begins.": "在部署开始之前执行预hooks。",
Prefix: "前缀",
"Prefix can contain numbers, letters, and underscores, but can not start with a number.": "前缀可以包含数字，字母和下划线，但不能以数字开头。",
"Private Key": "私钥",
"Private SSH key file for Git authentication.": "用于Git身份验证的私有SSH密钥文件。",
"Problems were detected while checking your application configuration.": "检查应用配置时检测到问题。",
"Process the template": "处理模板",
"Progress Deadline:": "进度截止日期：",
project: "项目",
"Project Name": "项目名称",
"Project Quota": "项目配额",
"Prompt for manual input:": "提示手动输入：",
Provider: "提供商",
"Provider:": "提供商：",
"Provisioned Services": "预配服务",
"Public hostname for the route.": "路由的公共主机名。",
"Push Secret:": "推送Secret:",
"Push To": "推送到",
Quota: "配额",
Ratio: "比率",
"Read only": "只读",
"Read Only (ROX)": "只读(ROX)",
"read-only": "只读",
"read-write": "读写",
ready: "准备",
"Ready:": "准备：",
Reason: "原因",
"Reason and": "原因和",
Rebuild: "重新构建",
"Receiving Traffic": "接收流量",
"Recent Runs": "最近运行",
"Recently Viewed": "最近打开",
"Refer to the": "参考",
"Rejected by router": "被路由器拒绝",
reload: "重新加载",
Reload: "重新加载",
"Reload Environment Variables": "重新加载环境变量",
Remove: "移除",
"Remove {{service.metadata.name}} from service group": "从服务组中删除{{service.metadata.name}}",
"Remove build secret": "删除build secret",
"Remove Item": "移除项",
"Remove Liveness Probe": "移除Liveness Probe",
"Remove Readiness Probe": "移除 Readiness Probe",
"Remove role {{role.metadata.name}} from {{subject.name}}": "从{{subject.name}}中删除角色{{role.metadata.name}}",
"Remove Service": "移除Service",
"Remove volume {{name}}?": "移除卷 {{name}}?",
"Remove volume{{name}}?": "移除卷 {{name}}?",
Replace: "替换",
"replica count and selector": "副本计数和选择器",
"Replicas can't be negative.": "Replicas不能是负数。",
"Replicas must be a whole number.": "Replicas必须是整数。",
"Replicas must be an integer value greater than or equal to 0.": "副本必须是大于或等于0的整数值。",
request: "要求",
Request: "要求",
"request.": "要求。",
"Requested Capacity:": "要求的容量：",
"Requests and": "要求和",
"Resource is missing kind field.": "资源缺少类型字段。",
"Resource is missing metadata field.": "资源缺少元数据字段。",
"Resource limits control how much CPU and memory a container will consume on a node.": "资源限制控制容器在节点上消耗的CPU和内存量。",
"Resource limits control how much memory a container will consume on a node.": "资源限制控制容器在节点上消耗的内存量。",
"Resource Limits: {{name}}": "资源限制：{{name}}",
"Resource name is missing in metadata field.": "metadata中缺少资源名.",
"Resource Type": "资源类型",
Resources: "资源",
'Resources from the namespace "{{name}}" are not permitted.': "不允许使用命名空间“{{name}}”中的资源。",
Restart: "重新开始",
"Restart Count:": "重启计数：",
"Restart Policy:": "重启策略：",
Results: "结果",
"Retry the hook until it succeeds": "重试hook直到成功",
"Retry the hook until it succeeds.": "重试hook直到成功",
"Return to the": "返回到",
"Revision History Limit:": "修订历史限制：",
Roles: "角色",
"Route {{name}} was successfully created.": "已成功创建路由{{name}}。",
"Route {{routeName}} was successfully updated.": "路由{{routeName}}已成功更新。",
Routes: "路由",
"Routes - External Traffic": "路由-外网流量",
"Routes can be secured using several TLS termination types for serving certificates.": "可以使用多种TLS终止类型来保护路由以提供证书。",
"Routes can direct traffic to multiple services for A/B testing. Each service has a weight\n            controlling how much traffic it gets.": "路由可以将流量引导到多个服务以进行A / B测试。 每项服务都有一个权重控制它获得的流量。",
"Routes:": "路由：",
"Routing is a way to make your application publicly visible.": "路由是一种使您的应用程序公开可见的方法。",
"Run a specific command in a new pod": "在新pod中运行特定命令",
"Run an OpenShift build and deployment:": "运行OpenShift构建和部署：",
"Run build hooks after image is built": "构建镜像后运行构建hooks",
"Run Policy": "运行策略",
"Run policy type": "运行策略类型",
"Run Policy:": "运行策略：",
"Runs a command in a new pod using the container from the deployment template. You can add additional environment variables and volumes.": "使用部署模板中的容器在新pod中运行命令。 您可以添加其他环境变量和卷。",
"runs after the deployment strategy completes": "部署策略完成后运行",
"runs after the previous deployment is scaled down to zero and before the first pod of the new deployment is created": "运行在之前的部署缩容到零之后，并且在新部署创建第一个pod之前",
"runs before the deployment begins": "运行在部署开始之前",
Save: "保存",
"Save partial log for {{object.metadata.name}}?": "保存{{object.metadata.name}}的部分日志？",
"Save the template to the project. This will make the template available to anyone who can view the project.": "将模板保存到项目中。 这将使模板可供任何可以查看项目的人使用。",
"Saving your changes may create a conflict or cause loss of data.": "保存修改可能导致冲突和数据丢失.",
Scale: "扩缩容",
"Scale down": "缩容",
"Scale Down": "缩容",
"Scale replicas automatically based on CPU usage.": "根据CPU使用率自动扩展replicas。",
"Scale replicas manually or automatically based on CPU usage.": "根据CPU使用率手动或自动扩展replicas。",
"Scale up": "扩容",
"Scaling may be affected.": "扩容可能会受到影响。",
"Scopes:": "作用域：",
Script: "脚本",
"Script:": "脚本：",
seconds: "秒",
"Secret {{secret}} was created and linked with service account {{name}}.": "Secret{{secret}}已创建并与服务帐户{{name}}相关联。",
"Secret {{secret}} was created.": "Secret {{secret}} 已创建.",
"Secret for authentication when pulling images from a secured registry.": "从安全的registry中拉取镜像时进行身份验证的Secret。",
"Secret for authentication when pushing images to a secured registry.": "将镜像推送到安全registry时进行身份验证的Secret。",
"Secret Name": "Secret名称",
"Secret reference key must consist of lower-case, upper-case letters, numbers, dash, and underscore.": "Secret reference key必须由小写字母，大写字母，数字，短划线和下划线组成。",
"Secret Type": "Secret类型",
"Secret with credentials for pulling your source code.": "具有证书可以拉取源代码的Secret。",
"Secret:": "Secret",
"Secrets allow you to authenticate to a private Git repository or a private image registry.": "Secrets允许您对私有Git仓库或私有 image registry进行身份验证。",
"Secure route": "安全路由",
Security: "安全",
"Select a binding to delete from {{ctrl.displayName}}": "从{{ctrl.displayName}}中选择要删除的binding",
"Select a new role for {{subject.name}}": "为{{subject.name}}选择一个新角色",
"Select a project": "选择一个项目",
"Select a resource from the list above...": "从上面的列表中选择一个资源…",
"Select a role": "选择一个角色",
"Select a service account": "选择一个服务帐户",
"Select an image stream tag or enter an image name.": "选择一个image stream tag或者输入镜像名.",
"Select from Project": "从项目中选择",
"select specific containers": "选择特定容器",
"Select specific keys and paths": "选择特定的keys和路径",
"Select storage to use": "选择要使用的存储",
"Select storage to use.": "选择要使用的存储",
"Select the keys to use and the file paths where each key will be exposed.\n                    The file paths are relative to the mount path.\n                    The contents of each file will be the value of the key.": "选择要使用的keys以及将公开每个keys的文件路径。文件路径相对于挂载路径。每个文件的内容都是key的值。",
Selection: "选择",
Selector: "选择者",
"Selector:": "选择：",
"Selectors:": "选择：",
Service: "服务",
"Service - Internal Traffic": "服务 - 内部流量",
"Service {{duplicate.metadata.name}} cannot be added twice.": "服务{{duplicate.metadata.name}}无法添加两次。",
"Service {{model.name}} does not exist.": "服务{{model.name}}不存在。",
"Service {{model.name}} has a single, unnamed port. A route cannot specifically target\n          an unnamed service port. If more service ports are added later, the route will also direct\n          traffic to them.": "Service {{model.name}}有一个未命名的端口。 路由无法专门定位一个未命名的服务端口。 如果稍后添加更多服务端口，则路由也将引导流量给他们。",
"Service account": "服务帐户",
"Service Account": "服务帐户",
"Service account default will need image pull authority to deploy images from {{istag.namespace}}. You can grant authority with the command:": "服务帐户默认需要镜像拉取权限才能从{{istag.namespace}}部署图像。 您可以使用以下命令授予权限：",
"Service accounts provide a flexible way to control API access without sharing a regular user’s credentials.": "服务帐户提供了一种灵活的方式来控制API访问，而无需共享常规用户的凭据。",
"Service Catalog": "服务目录",
"Service Port": "服务端口",
"Service to route to.": "路由服务。",
"Service Weights": "服务权重",
services: "服务",
Services: "服务",
"services in your project to expose with a route.": "项目中的服务通过路由开放。",
"Session Timeout Warning": "会话超时警告",
"Set Home Page": "设置主页",
"Set to the key {{entry.valueFrom.configMapKeyRef.key}} in config map": "设置为config map中的key {{entry.valueFrom.configMapKeyRef.key}}",
"Set to the key {{entry.valueFrom.secretKeyRef.key}} in secret": "设置为secret中的key {{entry.valueFrom.secretKeyRef.key}}",
"set. Autoscaling will not work without a CPU": "设置。没有CPU自动扩容无法工作",
Severity: "严重",
"Shared Access (RWX)": "共享访问（RWX）",
Show: "显示",
"Show hidden roles": "显示隐藏角色",
"Show Image Environment Variables": "显示镜像环境变量",
"Show Obfuscated Secret": "显示Obfuscated Secret",
"Show parameter values": "显示参数值",
"Single User (RWO)": "单用户（RWO）",
Size: "大小",
"Size is required.": "大小是必填的。",
"Some items already exist:": "有些项目已存在：",
"Sorry, but the page you were trying to view does not exist.": "抱歉，您尝试查看的页面不存在。",
"Sort by": "排序按",
"Source and Destination Paths": "源和目标路径",
"source code will be built and deployed unless otherwise specified in the next step.": "除非在下一步中另有说明，否则将构建和部署源代码。",
"Source Commit:": "来源提交：",
"Source Configuration": "源配置",
"Source Context Dir:": "源上下文目录：",
"Source Ref:": "来源参考：",
"source repository": "源仓库",
"Source Repository:": "源仓库：",
"Source secret to copy into the builder pod at build time.": "在构建时复制到builder pod中的Source secret 。",
"Source secret to mount into the builder pod at build time.": "在构建时挂载到 builder pod中的Source secret。",
"Source Type:": "Source类型：",
"Specify details about how volumes are going to be mounted inside containers.": "指定有关如何在容器内装入卷的详细信息。",
"Split traffic across multiple services": "跨多个服务拆分流量",
"SSH Private Key": "SSH私钥",
Start: "开始",
"Start a new build to create an image from": "启动新build去创建镜像从",
"Start Build": "开始构建",
"Start Deployment": "开始部署",
"Start Pipeline": "开始Pipeline",
started: "开始",
"Started:": "开始：",
"State:": "状态：",
Status: "状态",
"Status has not been reported on this quota usage record.  Any resources limited by this quota record can not be allocated.": "尚未报告此配额使用记录的状态。 无法分配受此配额记录限制的任何资源。",
"Status Reason:": "状态原因：",
"Status:": "状态：",
Stop: "停止",
"Stop Following": "停止跟随",
Storage: "存储",
"Storage claim": "存储claim",
"storage class": "存储类",
"Storage Class": "存储类",
"Storage classes are set by the administrator to define types of storage the users can select.": "管理员设置存储类以定义用户可以选择的存储类型。",
"Storage is not supported for kind {{kind}}.": "存储不支持 {{kind}}类型.",
"Storage quota limit has been reached. You will not be able to create any new storage.": "已达到存储配额限制。 您将无法创建任何新存储。",
"Storage quota will be exceeded.": "将超出存储配额。",
Strategy: "策略",
"Strategy Type": "策略类型",
"Strategy:": "策略：",
Subpath: "子路径",
Success: "成功",
"Successfully added": "添加成功",
"successfully.": "成功。",
"Switch to": "切换到",
"Switch Users": "切换用户",
"System roles are hidden by default and do not typically need to be managed.": "默认情况下隐藏系统角色，通常不需要进行管理。",
"tab, or run the following command:": "选项卡，或运行以下命令：",
"Tag As": "标记为",
"Tag image if the deployment succeeds": "如果部署成功，则标记图像",
Tags: "标记",
"Tags the current image as an image stream tag if the deployment succeeds.": "如果部署成功，则将当前image标记为image stream tag。",
"Target CPU percentage must be a number.": "目标CPU百分比必须是数字。",
"Target CPU percentage must be a whole number.": "目标CPU百分比必须是整数。",
"Target CPU percentage must be greater than 1.": "目标CPU百分比必须大于1。",
"Target Port": "目标端口",
"Target port for traffic.": "用于traffic的目标端口。",
"Target Port:": "目标端口：",
Template: "模板",
"Template Configuration": "模板配置",
"template for container {{container.name}}.": "容器{{container.name}}的模板。",
"Template wasn't found in cache.": "cache未发现Template.",
Terminal: "终止",
"Termination Type:": "终止类型：",
"The {{displayKind}} details could not be loaded.": "无法加载{{displayKind}}详细信息。",
"The {{type}} has no items.": " {{type}}没有没有条目",
"The active filters are hiding all builds.": "当前过滤条件隐藏了所有builds.",
"The active filters are hiding all deployments.": "当前过滤条件隐藏了所有deployments.",
"The active filters are hiding all rollout history.": "当前过滤条件隐藏了所有 rollout 历史.",
"The app name \"{{name}}\" is not valid.  An app name is an alphanumeric (a-z, and 0-9) string with a maximum length of 24 characters, where the first character is a letter (a-z), and the '-' character is allowed anywhere except the first or last character.": "app名称”{{name}}”不合法.app名称必须由(a-z, and 0-9)之间字母和数字组成，最长24个字符，首字母需是(a-z)之间字母，’-‘可以在任何位置，除了首尾.”",
"The build configuration details could not be loaded.": "build配置详情无法加载.",
"The build details could not be loaded.": "build详情无法加载.",
"The build run policy describes the order in which the builds created from the build configuration should run.": "build运行策略描述了从构建配置创建的构建应该运行的顺序。",
"The build strategy had no environment variables defined.": "构建策略没有定义环境变量。",
"The builder image has additional environment variables defined.  Variables defined below will overwrite any from the image with the same name.": "builder image具有定义的其他环境变量。 下面定义的变量将覆盖具有相同名称的镜像中的任何变量。",
"The certificate or key you've set will not be used.": "您将设置的证书或密钥将不会被使用。",
"The complete list of your projects could not be loaded.\n                  Type a project name to go to that project.": "无法加载完整的项目列表。输入要转到该项目的项目名称。",
"The config map could not be loaded.": "config map 无法加载.",
"The config map has no items.": "该config map没有项目。",
"The current filter is hiding all projects.": "当前过滤条件隐藏了所有项目.",
"The current filters are hiding all pods.": "当前过滤条件隐藏了所有pods.",
"The current filters are hiding all stateful sets.": "当前过滤条件隐藏了所有stateful sets.",
'The current value is "{{parameter.value}}", which is not empty.': "当前值为“{{parameter.value}}”，该值不为空。",
"The custom strategy allows you to specify container image that will provide your own deployment behavior.": "自定义策略允许您指定将提供您自己的部署行为的容器镜像。",
"The default limit defines the maximum amount of compute resource the container may have access to during execution if no limit is specified. If no request is made for the compute resource on the container or via a Default Request value, the container will default to request the limit.": "如果未指定限制，则默认限制定义容器在执行期间可以访问的最大计算资源量。 如果没有请求容器上的计算资源或通过默认请求值，容器将默认请求限制。",
"The deployment configuration details could not be loaded.": "deployment配置详情无法加载.",
"The deployment controlling this replica set has been deleted.": "deployment controlling this replica set已被删除.",
"The deployment details could not be loaded.": "deployment详情无法被加载.",
"The destination CA certificate will be removed from the route.\n                Destination CA certificates are only used for re-encrypt termination.": "目标CA证书将从路由中删除。目标CA证书仅用于re-encrypt termination。",
"The DNS admin should set up a CNAME from the route's hostname, {{ingress.host}},to the router's canonical hostname, {{ingress.routerCanonicalHostname}}.": "DNS管理员应该将路由的主机名{{ingress.host}}中的CNAME设置为路由器的规范主机名{{ingress.routerCanonicalHostname}}。",
"The environment variables for the {{kind}} have been updated in the background.": " {{kind}}环境变量已在后台更新.",
"The file": "文件",
"The file contents will be the value of the key.": "文件内容将是密钥的值。",
"The file is too large.": "文件过大.",
"The filter is hiding all {{resourceName}}.": "当前过滤条件隐藏了所有{{resourceName}}.",
"The filter is hiding all builds.": "当前过滤条件隐藏了所有builds.",
"The filter is hiding all config maps.": "当前过滤条件隐藏了所有config maps.",
"The filter is hiding all image streams.": "当前过滤条件隐藏了所有image streams.",
"The filter is hiding all persistent volume claims.": "当前过滤条件隐藏了所有persistent volume claims.",
"The filter is hiding all pods.": "当前过滤条件隐藏了所有pods",
"The filter is hiding all provisioned services.": "当前过滤条件隐藏了所有provisioned services.",
"The filter is hiding all resources.": "当前过滤条件隐藏了所有资源.",
"The filter is hiding all routes.": "当前过滤条件隐藏了所有路由.",
"The filter is hiding all secrets.": "当前过滤条件隐藏了所有secrets。",
"The filter is hiding all services.": "当前过滤条件隐藏了所有服务.",
"The hostname can't be changed after the route is created.": "创建路由后，无法更改主机名。",
"The image details could not be loaded.": "镜像详情无法加载.",
"The image may not exist or it may be in a secure registry. Check that you have entered the image name correctly or": "镜像可能不存在，也可能位于安全的registry中。 检查您是否正确输入了镜像名称",
"The image stream details could not be loaded.": " image stream详情无法加载.",
"The image tag was not found in the stream.": "stream中未发现该镜像标签.",
"The key must have at least {{secretReferenceValidation.minLength}} characters.": "密钥必须至少包含{{secretReferenceValidation.minLength}}个字符。",
"The log might not be complete. Continuing will save only the content currently displayed.": "日志可能不完整。 继续将仅保存当前显示的内容。",
"the log to see new messages.": "日志以查看新消息。",
"The logs are no longer available or could not be loaded.": "日志不可用或无法加载.",
"The lower limit for the number of pods that can be set by the autoscaler.\n      If not specified, defaults to 1.": "自动扩容可以设置的pod数量的下限。如果未指定，则默认为1。",
"The maximum amount of this compute resource that can be requested.  The limit must also be below the maximum value.": "可以请求的此计算资源的最大数量。 限制也必须低于最大值。",
"The maximum number of pods that can be scheduled above the original number of pods while the rolling deployment is in progress. This can be either a percentage (10%) or a whole number (1).": "滚动部署正在进行时，可以在原始pod数量之上调度的最大pod数。 这可以是百分比（10％）或整数（1）。",
"The maximum number of pods that can be unavailable during the rolling deployment. This can be either a percentage (10%) or a whole number (1).": "滚动部署期间可用的最大pod数。 这可以是百分比（10％）或整数（1）。",
"The maximum web console log size has been reached. Use the command-line interface or": "已达到最大Web控制台日志大小。 使用命令行界面或",
"The minimum amount of this compute resource that can be requested.": "可以请求的此计算资源的最小数量。",
"The mount path is already used. Please choose another mount path.": "挂载路径已使用。 请选择其他挂载路径。",
"The name must have at least 2 characters.": "名称必须至少包含2个字符。",
"The number of instances of your image.": "镜像的实例数。",
"The percentage of the CPU request that each pod should ideally be using.\n      Pods will be added or removed periodically when CPU usage exceeds or\n      drops below this target value.": "理想情况下每个pod应使用的CPU请求百分比。 当CPU使用率超过或低于此目标值时，将定期添加或删除Pod。",
"The persistent volume claim details could not be loaded.": "persistent volume claim详情无法加载.",
"The pod details could not be loaded.": "pod详情无法加载.",
"The provisioned service details could not be loaded.": "provisioned service详情无法加载.",
"The recreate strategy has basic rollout behavior and supports lifecycle hooks for injecting code into the deployment process.": "重新创建策略具有基本的部署行为，并支持生命周期钩子，用于将代码注入部署过程。",
"The requested capacity may not be less than the current capacity.": "请求的容量可能不小于当前容量。",
'The requested image stream tag " {{tag}} " could not be loaded.': "无法加载请求的image stream tag“{{tag}}”。",
'The requested image stream" {{image}} " could not be loaded.': "无法加载请求的图像流“{{image}}”。",
'The requested template "{{template}}" could not be loaded.': "无法加载请求的模板“{{template}}”。",
"The rolling strategy will wait for pods to pass their readiness check, scale down old components and then scale up.": "滚动策略将等待pod通过准备检查，缩小旧组件，然后按比例放大。",
"The route details could not be loaded.": "路由详情无法加载.",
"The route is not accepting traffic yet because it has not been admitted by a router.": "该路由尚未接受流量，因为它尚未被路由器接受。",
"The route is unsecured.": "该路由是不安全的。",
"The secret details could not be loaded.": "secret详情无法加载.",
"The selected project has no templates available to import.": "所选项目没有可导入的模板。",
"The service details could not be loaded.": "服务详情无法加载.",
"The service failed.": "服务失败了。",
"The service is not yet ready.": "该服务尚未准备好。",
"The service was marked for deletion": "该服务已标记为删除",
"The service was marked for deletion.": "该服务已标记为删除。",
"The stateful set details could not be loaded.": "stateful set详情无法加载.",
"The templateParamsMap is not valid JSON.": "templateParamsMap不是合法的JSON.",
"The timeout parameter and any pre or post lifecycle hooks will be copied from {{strategy}} strategy to {{type}} strategy. After saving the changes, {{original}} strategy parameters will be removed.": "超时参数以及任何生命周期前或后期挂钩都将从{{strategy}}策略复制到{{type}}策略。 保存更改后，系统会删除{{original}}策略参数。",
"The upper limit for the number of pods that can be set by the autoscaler.": "autoscaler可以设置的pod数量的上限。",
"The volume will be mounted into all containers. You can": "卷将挂载到所有容器中。 您可以",
"There are no": "没有",
"There are no annotations on this resource.": "此资源没有注释。",
"There are no builds in this project.": "该项目中没有builds。",
"There are no config maps or secrets in project": "项目中没有 config maps或secrets",
"There are no deployments in this project.": "此项目中没有部署。",
"There are no editable source types for this build config.": "此 build config没有可编辑的源类型。",
"There are no limit ranges set on this project.": "此项目没有设置限制范围。",
"There are no pods in this project.": "这个项目没有pods。",
"There are no projects available from which to load templates.": "没有可用于加载模板的项目。",
"There are no resource quotas set on this project.": "此项目没有设置资源配额。",
"There are no service bindings.": "没有服务绑定。",
"There are no stateful sets in this project.": "此项目中没有stateful sets。",
"There was an error reading the file. Please copy the file content into the text area.": "读取文件时出错。 请将文件内容复制到文本区域。",
"These variables exist on the image and will be available at runtime. You may override them below.": "这些变量存在于镜像上，并且在运行时可用。 你可以在下面覆盖它们。",
"This {{displayKind}} has been deleted.": "{{displayKind}}已被删除.",
"This autoscaler uses a newer API, consider editing it with the": "此自动扩容使用较新的API，请考虑使用",
"This build configuration can not be found, it may have been deleted.": "无法找到此构建配置，它可能已被删除。",
"This build configuration has been deleted.": "build配置已被删除.",
"This build configuration has been updated in the background. Saving your changes may create a conflict or cause loss of data.": "build配置已在后台更新.保存修改可能导致冲突或丢失数据.",
"This build configuration has changed since you started editing it. You'll need to copy any changes you've made and edit again.": "build配置已被修改,若编辑，你需要复制你的修改并且再编辑.",
"This build has been deleted.": "build已被删除.",
"This can be a time-consuming process.": "这可能是一个耗时的过程。",
"This config map has been deleted.": "config map已被删除.",
"This deployment can not be found, it may have been deleted.": "无法找到此部署，它可能已被删除。",
"This deployment config is part of the pipeline": "此部署配置是pipeline的一部分",
"This deployment configuration can not be found, it may have been deleted.": "无法找到此部署配置，它可能已被删除。",
"This deployment configuration has been deleted.": "deployment配置已被删除.",
"This deployment configuration has changed since you started editing it. You'll need to copy any changes you've made and edit again.": "deployment配置已修改，若要编辑，你需要复制之前的修改然后再次编辑.",
"This deployment has been deleted.": "deployment已被删除.",
"This file contains binary content.": "该文件包含二进制内容。",
"This image declares volumes and will default to use non-persistent, host-local storage.\n          You can add persistent storage later to the deployment config.": "image declares volumes,会默认使用non-persistent, host-local存储.\n你可以添加persistent storage到deployment config.",
"This image stream has been deleted.": "image stream已被删除.",
"This image will be deployed in Deployment Config": "此映像将部署在Deployment Config中",
"This might not be a valid Git URL. Check that it is the correct URL to a remote Git repository.": "这可能不是有效的Git URL。 检查它是否是远程Git存储库的正确URL。",
"This name is already in use within the project. Please choose a different name.": "该名称已在项目中使用。 请选择其他名称。",
"This name is already in use. Please choose a different name.": "这个名字已被使用。 请选择其他名称。",
"This pauses any in-progress rollouts and stops new rollouts from running until the deployment is resumed.": "这将暂停所有正在进行的部署，并停止运行新的部署，直到部署恢复为止。",
"This persistent volume claim has been deleted.": " persistent volume claim已被删除.",
"This pipeline is not associated with any deployments.": "pipeline没有关联任何deployments.",
"This pod has been deleted.": "pod已被删除.",
"This pod will not receive traffic until all of its containers have been created.": "pod不会收到traffic，直到它所有的容器均创建成功.",
"This provisioned service has been deleted.": "provisioned service已被shanc.",
"This resource has an autoscaler associated with it.\n            It is recommended you delete the autoscaler with the resource it scales.": "此资源具有与之关联的autoscaler。建议您使用扩展的资源删除autoscaler。",
"This resource has autoscalers associated with it.\n            It is recommended you delete the autoscalers with the resource they scale.": "此资源具有与之关联的autoscalers。建议您使用扩容的资源删除autoscalers。",
"This route has been deleted.": "route已被删除.",
"This route splits traffic across multiple services.": "此路由将流量分配到多个服务。",
"this route to enable secure network traffic.": "此路由可启用安全网络流量。",
"This secret has been deleted.": "secret已被删除.",
"This secret has no data.": "secret无数据",
"This secret value contains non-printable characters and is displayed as a Base64-encoded string.": " secret值包含不可打印的字符，并显示为Base64编码的字符串。",
"This service has been deleted.": "service已被删除.",
"This target port will route to": "此目标端口将路由到",
"This temporary pod has a modified entrypoint command to debug a failing container. The pod\n        will be available for one hour and will be deleted when the terminal window is closed.": "此临时pod具有修改的入口点命令以调试失败的容器。 该pod将在一小时后可用，并在终端窗口关闭时删除。",
"This terminal has been disconnected. If you reconnect, your terminal history will be lost.": "此终端已断开连接。 如果重新连接，终端历史记录将丢失。",
"This will 'delete all resources' associated with the": "将删除“所有资源”关联",
"This will delete the": "将删除",
"This will delete the deployment config, all rollout history, and any running pods.": "这将删除部署配置，所有部署历史记录和任何正在运行的pod。",
"This will delete the deployment, all rollout history, and any running pods.": "这将删除部署，所有部署历史记录和任何正在运行的pods。",
"This will overwrite the current version of the template.": "这将覆盖当前版本的模板。",
"This will prevent a value from being generated.": "这将阻止生成值。",
"This will remove the volume from the {{kind}}.": "这将从 {{kind}}移除卷.",
"This will remove the volume from the deployment and start a new rollout.": "将从deployment移除卷,开始一个新的rollout.",
"This will remove the volume from the deployment config and trigger a new deployment.": "将从deployment config移除卷以及触发新的deployment.",
"This will remove the volume from the deployment config.": "将从deployment config移除卷.",
"This will remove the volume from the deployment.": "将从deployment移除卷.",
"This will stop any new rollouts or triggers from running until resumed.": "这将阻止任何新的rollouts或triggers运行直到恢复。",
Time: "时间",
"Time Range:": "时间范围：",
"Time to wait between polling deployment status after running a pod.": "运行pod后轮询部署状态之间的等待时间。",
"Time to wait between retrying to run individual pod.": "重试运行单个pod之间的等待时间。",
timeout: "超时",
Timeout: "超时",
"Timeout can't be negative.": "超时不能是负数。",
"Timeout must be greater than or equal to one.": "超时必须大于或等于1。",
"Timeout:": "超时：",
"TLS certificates for edge and re-encrypt termination. If not specified, the router's default\n        certificate is used.": "用于边缘和重新加密终止的TLS证书。 如果未指定，则使用路由器的默认证书。",
"TLS is not enabled.": "TLS未启用。",
"TLS Settings": "TLS设置",
"TLS Termination": "TLS终止",
to: "到",
"to 0 replicas? This will stop all pods for the {{type}}.": "到0 replicas？ 这将停止{{type}}的所有pods。",
"To add an image stream or template from a file, use the editor in the": "要从文件添加 image stream或模板，请编辑器在",
"to application": "到应用",
"To claim storage from a persistent volume, refer to the documentation on": "要从持久卷中声明存储，请参阅上的文档",
"To deploy an image from a private repository, you must": "从私人仓库部署镜像,你必须",
"to ensure your application is running correctly.": "确保您的应用程序正常运行。",
"To get the complete log, run the command": "要获取完整日志，请运行该命令",
"To learn more, visit the OpenShift": "要了解更多，请访问OpenShift",
"To see application logs, view the logs for one of the replica set's": "要查看应用日志，请查看其中一个replica的日志",
"To see application logs, view the logs for one of the stateful sets's": "要查看应用日志，请查看其中一个有stateful sets的日志",
"to see what stages will run.": "看看会运行什么阶段。",
"To set additional parameters or edit lifecycle hooks, view": "要设置其他参数或编辑生命周期钩子，查看",
"To set secrets for pulling your images from private image registries, view": "要设置从私有 image registries中拉取映镜像的secrets，请查看",
"to set up authentication.": "来设置身份验证。",
"To show a high level overview of the current project:": "显示当前项目的高级概述：",
"to use as a volume for this": "用作卷",
"to volume": "到卷",
"Toggle navigation": "切换导航",
Traffic: "流量",
"Traffic Split": "流量划分",
"Try It": "试一试",
Type: "类型",
"Type name": "类型名称",
"Type:": "类型",
"Unable to calculate the bounding box for a character.  Terminal will not be able to resize.": "无法计算角色的边界框。 终端无法调整大小。",
"Unable to copy the login command.": "无法复制登录命令。",
"Unable to create the": "无法创建",
"Unable to load parameters from secret": "无法从secret加载参数",
"Unable to update the": "无法更新",
unavailable: "不可用",
"Unique name of the new secret.": "新secret的唯一名称。",
"Unique name used to identify this volume. If not specified, a volume name is generated.": "用于标识此卷的唯一名称。 如果未指定，则生成卷名。",
Unit: "单位",
unknown: "未知",
Unknown: "未知",
"Unknown deployment strategy type:": "未知的部署策略类型：",
"Update Period": "更新时间",
"Update period can't be negative.": "更新时间不能是负数",
"Update Period:": "更新期间：",
"Update Template": "更新模板",
"Update the display name and description of your project. The project's unique name cannot be modified.": "更新项目的显示名称和描述。 项目的唯一名称无法修改。",
Updated: "更新",
"Updated resources in project {{name}}": "{{name}}资源更新成功",
Updating: "更新中",
"Updating resources in project {{name}}": "更新项目{{name}}中的资源",
"Upload a file by dragging & dropping, selecting it, or pasting from the clipboard.": "通过拖放，选择或从剪贴板粘贴来上载文件。",
"Uptime:": "运行时间：",
Usage: "使用率",
"Use a custom .gitconfig file": "使用自定义.gitconfig文件",
"Use a custom ca.crt file": "使用自定义ca.crt文件",
"Use a Jenkinsfile from the source repository or specify the\n                    Jenkinsfile content directly in the build configuration.": "使用源存储库中的Jenkinsfile或直接在构建配置中指定Jenkinsfile内容。",
"Use all keys and values from": "使用所有键和值",
"Use HTTPS": "使用HTTPS",
"Use label selectors to request storage": "使用label selectors来请求存储",
"Use the following settings from {{replicaSet.metadata.name}} when rolling back:": "回滚时使用{{replicaSet.metadata.name}}中的以下设置：",
"Use the image for this container as the source of the tag.": "使用此容器的镜像作为标记的来源。",
Used: "使用",
"Used (All Projects)": "使用(所有项目)",
"Used (This Project)": "使用(本项目)",
username: "用户名",
Username: "用户名",
"Username is required.": "用户名是必需的。",
using: "使用中",
"using persistent volumes": "使用持久卷",
Value: "值",
"Value of the secret will be supplied when invoking the webhook.": "调用webhook时将提供secret值。",
Version: "版本",
View: "查看",
"View All Events": "查看所有Events",
"View Archive": "查看档案",
"View Details": "查看详情",
"View Documentation": "查看文档",
"View Events": "查看Events",
"View Full Log": "查看完整日志",
"View Log": "查看日志",
"View Logs": "查看日志",
"View Membership": "查看成员",
"View Pipeline Runs": "查看运行的Pipeline",
"View pods for": "查看pods为了",
"View Quota": "查看配额",
"View Quota&nbsp;": "查看Quota…",
"View Secret": "查看Secret",
"View the": "查看",
"View the file": "查看文件",
"Virtual Machines": "虚拟机",
Volume: "卷",
"Volume File:": "卷文件：",
"Volume mount in that path already exists. Please choose another mount path.": "卷挂载的路径已经存在。 请选择其他挂载路径。",
"Volume Name": "卷名称",
"Volume name already exists. Please choose another name.": "卷名已存在。 请选择其他名称。",
"Volume names cannot be longer than 63 characters.": "卷名已存在。请选择其他名称。",
"Volume names may only contain lower-case letters, numbers, and dashes.\n                      They may not start or end with a dash.": "卷名称只能包含小写字母，数字和短划线。它们可能无法以破折号开始或结束。",
Volumes: "卷",
"Volumes are not supported for kind {{kind}}.": "卷不支持 {{kind}}类型.",
"Volumes:": "卷：",
"waiting for": "等待",
"waiting for allocation,": "等待分配，",
"Waiting for container {{container.name}} to start...": "等待容器{{container.name}}开始……",
warning: "警告",
Warning: "警告",
"Warning:": "警告",
"Warning: The deployment's deployment config is missing.": "警告：缺少部署的部署配置。",
warnings: "警告",
Warnings: "警告",
"was cancelled": "已取消",
"was cancelled.": "已取消",
"was created.": "已创建",
"was marked for deletion.": "被标记为删除。",
"was successfully created.": "被创建成功.",
"was successfully updated.": "被更新成功.",
"was updated.": "已更新.",
"We checked your application for potential problems. Please confirm you still want to create this application.": "我们检查了您的申请是否存在潜在问 请确认您仍想创建此应用程序。",
Weight: "权重",
"Weight is a number between 0 and 256 that specifies the relative weight against other\n          route services.": "权重是0到256之间的数字，用于指定与其他路线服务相对的权重。",
"Welcome to OpenShift.": "欢迎来到OpenShift。",
"Welcome to project {{projectName}}.": "欢迎使用项目{{projectName}}。",
"What are": "什么是",
"What are GiB?": "什么是GiB？",
"What would you like to do?": "你想做什么？",
"What's a Jenkinsfile?": "什么是Jenkinsfile？",
"When you navigate away from this pod, any open terminal connections will be closed.\n                      This will kill any foreground processes you started from the&nbsp;terminal.": "当您离开此pod时，将关闭所有打开的终端连接。这将终止您从终端开始的所有前台进程。",
"Wildcard Policy:": "Wildcard 策略：",
"Wildcard subdomains may start with": "Wildcard subdomains开头是",
"will be added to all containers. You can": "被添加到所有容器，你可以",
"will be load balanced by Service": "将被负载平衡通过服务",
"will be used.": "将被使用。",
"will track this image.": "将跟踪此镜像。",
"with access to this project.": "可以访问这个项目。",
"with routers that support wildcard subdomains.": "路由支持wildcard subdomains。",
"With the OpenShift command line interface (CLI), you can create applications and manage OpenShift\n              projects from a terminal. To get started using the CLI, visit": "使用OpenShift命令行界面（CLI），您可以创建应用程序并管理OpenShift来自终端的项目。 要开始使用CLI，请访问",
"With the OpenShift command line interface (CLI), you can create applications and manage OpenShift projects from a terminal.": "使用OpenShift命令行界面（CLI），您可以从终端创建应用程序并管理OpenShift项目。",
"with your image registry credentials and try again.": "使用您的image registry credentials，然后重试。",
"with your image registry credentials.": "使用您的image registry credentials.",
Yes: "是",
"You are about to change users from": "您即将更改用户从",
"You are being logged in as": "您将登陆为",
"You are currently logged in under the user account '{{user.metadata.name}}'.": "您目前以用户帐户“{{user.metadata.name}}”登录。",
"You are logged out.": "你已退出.",
"You are not authorized to add to this project.": "您无权添加到此项目。",
"You are set up to use the example git repository. If you would like to modify the source code, fork the": "您已设置为使用示例git仓库。 如果你想修改源代码，请fork",
"You can download the oc client tool using the links below. For more information about downloading and installing it, please refer to the": "您可以使用下面的链接下载oc客户端工具。 有关下载和安装它的更多信息，请参阅",
"You can use": "您可以使用",
"You could not be logged out. Return to the": "您无法退出,返回到",
"You do not have authority to {{verb}} horizontal pod autoscalers in project {{project}}.": "您没有权限在 {{project}}中 {{verb}} horizontal pod autoscalers.",
"You do not have authority to create config maps in project {{project}}.": "您没有权限在 {{project}}中创建 config maps.",
"You do not have authority to create persistent volume claims in project {{project}}.": "您没有权限在 {{project}}中创建 persistent volume claims.",
"You do not have authority to create routes in project {{project}}.": "您没有权限在 {{project}}中创建路由.",
"You do not have authority to create secrets in project {{project}}.": "您没有权限在 {{project}}中创建secrets.",
"You do not have authority to process templates in project {{project}}.": "您没有权限在 {{project}}中出路模板.",
"You do not have authority to update": "您没有权限更新",
"You do not have authority to update build config {{buildconfig}}.": "您没有权限更新{{buildconfig}}.",
"You do not have authority to update deployment config": "您没有权限更新 deployment config",
"You do not have authority to update route": "您没有权限更新路由",
"You do not have permission to view roles in this project.": "您没有权限在 {{project}}中创建路由.",
"You have been logged out due to inactivity.": "您长时间未操作，您已退出.",
"You have unsaved changes. Leave this page anyway?": "你没有保存修改，确认离开页面?",
"You must have a bindable service in your namespace in order to create bindings.": "您必须在命名空间中具有可绑定服务才能创建绑定。",
"You must select at least one container.": "您必须至少选择一个容器。",
"You should configure resource limits below for autoscaling.\n                              Autoscaling will not work without a CPU request.": "您应该在下面配置资源限制以进行自动扩容。 没有CPU要求，自动扩容将无法工作。",
"You will be logged out in": "您将退出在",
"You will need to redeploy your pods for this to take effect.": "您需要重新部署pod才能使其生效。",
"Your session is about to expire due to inactivity.": "由于不活动，您的会话即将过期。",
Zone: "空间"
});
} ]), angular.module("gettext").run([ "gettextCatalog", function(e) {
e.setStrings("zh_CN", {
"{{ form.add || 'Add'}}": "{{ form.add || ’添加’}}",
"A cluster admin can create a project for you by running the command:": "集群管理员通过运行命令创建项目：",
"a project.": "一个项目。",
"A unique name for the project.": "唯一的项目名称。",
"Add to Project": "添加到项目",
"advanced options": "高级选项",
All: "全部",
"An error occurred creating the application.": "创建应用发生错误。",
"An error occurred provisioning the service.": "配置服务发生错误。",
"An error occurred updating the service.": "更新服务发生错误。",
"Application Name": "应用名词",
"Application name can't be more than 24 characters.": "应用名称不能超出24个字符。",
"Application name consists of lower-case letters, numbers, and dashes. It must start with a letter and can't end with a '-' .": "应用名称由小写字母，数组，横线组成。必须以字母开头且不能以-结尾。",
"Application name is required.": "应用名称必填。",
"Application name must be at least 2 characters.": "应用名至少两个字符。",
Back: "返回",
Binding: "绑定",
"Browse Catalog": "浏览目录",
"Browse resources for {{$ctrl.serviceClass.name}}:": "浏览资源 {{$ctrl.serviceClass.name}}:",
Cancel: "取消",
"Catalog Search": "搜索目录",
"Clear All Filters": "清空过滤",
"Clear Search Input": "清空输入",
Close: "关闭",
Configuration: "配置",
"Confirm Login": "确认登陆",
"Confirm User Change": "确认切换用户",
Continue: "继续",
"Continue to the project overview": "继续前往项目概述",
Create: "创建",
"Create Project": "创建项目",
"Custom Add": "自定义添加",
Databases: "数据库",
"Delete Project": "删除项目",
"Deploy Image": "部署镜像",
"Edit Project": "编辑项目",
Error: "错误",
"failed to create in": "创建失败在",
"Failed to determine create project permission": "创建项目授权失败",
"Failed to list instances in namespace": "命名空间中列实例名单失败",
"failed to provision in": "准备失败在",
"Filter by Keyword": "按关键词过滤",
"Filter projects by name": "按项目名过滤",
"Get Support": "获取支持",
"Getting Started": "开始",
"Git Repository": "Git仓库",
"Git repository is required.": "Git仓库必填。",
"Go to Project": "前往项目",
"has been added successfully to": "被成功添加到",
"has been created successfully in": "被成功创建到",
"has been updated successfully in": "更新成功在",
Help: "帮助",
"Home Page Tour": "首页",
"If this is unexpected, click Cancel. This could be an attempt to trick you into acting as another user.": "如果发生意外，点击取消。",
"If you have a private Git repository or need to change application defaults, view": "如果您有私人仓库或者需要切换默认应用，查看",
Image: "镜像",
"Image Dependencies": "镜像依赖",
"Import YAML / JSON": "导入YAML/JSON",
Information: "信息",
"is being created in": "正在被创建在",
"is being provisioned in": "正在被分配在",
"is being updated in": "正在被更新在",
Items: "项",
Keyword: "关键词",
Languages: "语言",
"Log out": "退出",
"Logging in…": "登陆中&hellip;",
Logout: "退出",
Middleware: "中间件",
More: "更多",
"My Projects": "我的项目",
"Name must have at least two characters.": "名称至少两个字符。",
"Next >": "下一步>",
"No catalog items have been loaded.": "未加载到目录。",
"No description provided.": "未提供描述。",
"No items.": "没有可显示的条目。",
"No Plans Available": "没有可选择的计划",
"No Projects Found": "未发现项目",
"No results found for Keyword:": "没有匹配到结果根据关键词：",
"No results match.": "没有匹配到结果。",
"or create": "或创建",
Other: "其他",
"Other Projects": "其他项目",
Parameters: "参数",
Pending: "加载中",
Plan: "计划",
"Please select": "请选择",
"Please wait while you are logged in…": "登陆中请等待&hellip;",
"Project Description": "项目描述",
"Project Display Name": "项目显示名称",
"Project Name": "项目名",
"Project names may only contain lower-case letters, numbers, and dashes.\n        They may not start or end with a dash.": "项目名称由小写字母，数组，横线组成。必须以字母开头且不能以-结尾。",
"Recently Viewed": "最近打开",
Results: "结果",
"results for Keyword:": "结果根据关键词：",
"Return to the": "返回到",
Retype: "重新输入",
"Search Catalog": "搜索目录",
"See Loading the Default Image Streams and Templates": "查看加载默认的 Image Streams and Templates",
"Select a Plan": "选择plan",
"Select from Project": "从项目中选择",
"Select or create project": "选择或者创建项目",
"Select project": "选择项目",
"Services cannot be provisioned without a project.": "没有项目，Services不能分配。",
Success: "成功",
"Switch Users": "切换用户",
"The active filters are hiding all catalog items.": "当前过滤条件隐藏了所有目录项。",
"The binding will be created after the service has been provisioned.": "绑定关系将在分配服务后创建。",
"The complete list of your projects could not be loaded. Type a project name to go to that project.": "无法加载完整的项目目录。请输入项目名并前往。",
"There are no plans currently available for this service.": "当前没有可供该服务选择的计划。",
"This may take several minutes.": "将持续几分钟。",
"This might not be a valid Git URL. Check that it is the correct URL to a remote Git repository.": "Git URL可能不合法.检查Git URL，这是连接远程 Git 仓库的URL。",
"This name is already in use. Please choose a different name.": "该名称已使用，请选择其他名称。",
to: "到",
"to bind this service to your application. Binding this service creates a secret containing the information necessary for your application to use the service.": "绑定该服务到你的应用中。绑定服务创建一个secret，其包含能使用该服务的必要应用信息。",
"to check the status of your application as it builds and deploys.": "去检查应用状态 例如构建和部署时。",
"to check the status of your service.": "去检查服务状态。",
"Toggle navigation": "切换导航",
Update: "更新",
Updating: "更新中",
"values don't match.": "值不匹配。",
Version: "版本",
"View all": "查看所有",
"View All": "查看所有",
"View Documentation": "查看Documentation",
"View Membership": "查看成员",
"View the result for Keyword:": "查看结果按关键词：",
"Virtual Machines": "虚拟机",
Virtualization: "虚拟化",
"You are about to change users from": "你将切换用户从",
"You are being logged in as": "你正在登陆",
"You are not authorized to add to this project.": "您未被授权添加项目。"
});
} ]), angular.module("openshiftConsole", [ "ngAnimate", "ngCookies", "ngResource", "ngRoute", "ngSanitize", "kubernetesUI", "registryUI.images", "ui.bootstrap", "patternfly.charts", "patternfly.navigation", "patternfly.sort", "patternfly.notification", "openshiftConsoleTemplates", "ui.ace", "extension-registry", "as.sortable", "ui.select", "angular-inview", "angularMoment", "ab-base64", "openshiftCommonServices", "openshiftCommonUI", "webCatalog", "gettext" ]).config([ "$routeProvider", "$uibModalProvider", "HomePagePreferenceServiceProvider", function(e, t, n) {
var a, r = {
templateUrl: "views/projects.html",
controller: "ProjectsController"
};
a = _.get(window, "OPENSHIFT_CONSTANTS.DISABLE_SERVICE_CATALOG_LANDING_PAGE") ? r : {
templateUrl: "views/landing-page.html",
controller: "LandingPageController",
reloadOnSearch: !1
}, e.when("/projects", r), e.when("/", {
redirectTo: function() {
return n.$get().getHomePagePath();
}
}).when("/catalog", a).when("/create-project", {
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
} ]).run([ "$rootScope", "$cookieStore", "gettextCatalog", function(e, t, n) {
e.language = t.get("openshift_language") || "zh_CN", n.setCurrentLanguage(e.language);
} ]).run([ "$rootScope", "LabelFilter", function(e, t) {
t.persistFilterState(!0), e.$on("$routeChangeSuccess", function() {
t.readPersistedState();
});
} ]).run([ "$location", "$uibModal", "AuthService", function(e, t, n) {
function a() {
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
var r = window.OPENSHIFT_CONFIG.inactivityTimeoutMinutes;
if (r) {
var o, i, s = "origin-web-console-last-interaction-timestamp", c = !1, l = function() {
o = setInterval(function() {
if (n.isLoggedIn()) {
var e = Date.parse(localStorage.getItem(s));
isNaN(e) && (Logger.warn("Last interaction timestamp has been corrupted. The logout timeout will be restarted."), e = new Date()), new Date() - e > 6e4 * r && a();
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
e.originalEvent.key === s ? u() : "origin-web-console-inactivity-logout" === e.originalEvent.key && "true" === localStorage.getItem("origin-web-console-inactivity-logout") && p();
}), n.onUserChanged(function() {
m(!1);
}), d(), $(document).bind("click keydown", _.throttle(d, 500));
}
} ]).run([ "durationFilter", "timeOnlyDurationFromTimestampsFilter", "countdownToTimestampFilter", function(e, t, n) {
setInterval(function() {
$(".duration[data-timestamp]").text(function(n, a) {
var r = $(this).data("timestamp"), o = $(this).data("omit-single"), i = $(this).data("precision");
return $(this).data("time-only") ? t(r, null) || a : e(r, null, o, i) || a;
}), $(".countdown[data-timestamp]").text(function(e, t) {
var a = $(this).data("timestamp");
return n(a);
});
}, 1e3);
} ]).run([ "IS_IOS", function(e) {
e && $("body").addClass("ios");
} ]).run([ "$rootScope", "APIService", function(e, t) {
e.AEROGEAR_MOBILE_ENABLED = !!t.apiInfo({
resource: "mobileclients",
group: "mobile.k8s.io"
}), e.AEROGEAR_MOBILE_ENABLED && window.OPENSHIFT_CONSTANTS.SERVICE_CATALOG_CATEGORIES.push({
id: "mobile",
label: "Mobile",
subCategories: [ {
id: "apps",
label: "Apps",
tags: [ "mobile" ],
icon: "fa fa-mobile"
}, {
id: "services",
label: "Services",
tags: [ "mobile-service" ],
icon: "fa fa-database"
} ]
}), Logger.info("AEROGEAR_MOBILE_ENABLED: " + e.AEROGEAR_MOBILE_ENABLED);
} ]).run([ "$rootScope", "APIService", "KubevirtVersions", function(e, t, n) {} ]), pluginLoader.addModule("openshiftConsole"), angular.module("openshiftConsole").factory("HawtioExtension", [ "extensionRegistry", function(e) {
return console.warn("HawtioExtension.add() has been deprecated.  Please migrate to angular-extension-registry https://github.com/openshift/angular-extension-registry"), {
add: function(t, n) {
e.add(t, function(e) {
return {
type: "dom",
node: n(e)
};
});
}
};
} ]), angular.module("openshiftConsole").factory("BrowserStore", [ function() {
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
} ]), angular.module("openshiftConsole").factory("AggregatedLoggingService", [ "$q", "Logger", "DataService", function(e, t, n) {
var a;
return {
isOperationsUser: function() {
if (void 0 !== a) return t.log("AggregatedLoggingService, using cached user"), e.when(a);
t.log("AggregatedLoggingService, loading whether user is Operations user");
var r = {
apiVersion: "authorization.k8s.io/v1",
kind: "SelfSubjectAccessReview",
spec: {
resourceAttributes: {
resource: "pods/log",
namespace: "default",
verb: "view"
}
}
};
return n.create({
group: "authorization.k8s.io",
version: "v1",
resource: "selfsubjectaccessreviews"
}, null, r, {
namespace: "default"
}).then(function(e) {
return a = e.status.allowed;
}, function() {
return !1;
});
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
apiVersion: "apps.openshift.io/v1"
},
minReplicas: e.scaling.minReplicas,
maxReplicas: e.scaling.maxReplicas,
targetCPUUtilizationPercentage: e.scaling.targetCPU
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
name: e.imageName + ":" + e.imageTag,
namespace: e.namespace
},
env: n
}
},
triggers: a
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
catalogURL: function(e) {
var t = angular.isString(e) ? e : _.get(e, "metadata.name");
return t ? "project/" + encodeURIComponent(t) + "/catalog" : "catalog";
},
toProjectCatalog: function(t, n) {
var a = e.path(this.catalogURL(t));
n && a.search(n);
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
toPodsForDeployment: function(e, t) {
1 !== _.size(t) ? this.toResourceURL(e) : this.toResourceURL(_.sample(t));
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
if (e.metadata) p = i.objectToResourceGroupVersion(e); else if (_.get(r, "apiVersion")) {
var g = i.kindToResource(t), f = i.parseGroupVersion(r.apiVersion);
f.resource = g, p = i.toResourceGroupVersion(f);
} else p = i.toResourceGroupVersion(i.kindToResource(t));
if (!i.apiInfo(p)) return null;
c.segment("other").search({
kind: t,
group: p.group
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
} ]), angular.module("openshiftConsole").factory("ImageStreamResolver", [ "$q", "APIService", "DataService", function(e, t, n) {
function a() {}
var r = t.getPreferredVersion("imagestreamimages");
return a.prototype.fetchReferencedImageStreamImages = function(t, a, o, i) {
var s = {};
return angular.forEach(t, function(e) {
angular.forEach(e.spec.containers, function(e) {
var t = e.image;
if (t && !a[t] && !s[t]) {
var c = o[t];
if (c) {
var l = c.split("@"), u = n.get(r, c, i);
u.then(function(e) {
if (e && e.image) {
var n = angular.copy(e.image);
n.imageStreamName = l[0], n.imageStreamNamespace = i.project.metadata.name, a[t] = n;
}
}), s[t] = u;
}
}
});
}), e.all(s);
}, a.prototype.buildDockerRefMapForImageStreams = function(e, t) {
angular.forEach(e, function(e) {
angular.forEach(e.status.tags, function(n) {
angular.forEach(n.items, function(n) {
n.image && (t[n.dockerImageReference] = e.metadata.name + "@" + n.image);
});
});
});
}, new a();
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
} ]), angular.module("openshiftConsole").factory("BuildsService", [ "$filter", "$q", "APIService", "DataService", "Navigate", "NotificationsService", function(e, t, n, a, r, o) {
var i = n.getPreferredVersion("buildconfigs/instantiate"), s = n.getPreferredVersion("builds/clone"), c = e("annotation"), l = e("buildConfigForBuild"), u = e("getErrorDetails"), d = e("isIncompleteBuild"), m = e("isJenkinsPipelineStrategy"), p = e("isNewerResource"), g = function(e) {
var t = c(e, "buildNumber") || parseInt(e.metadata.name.match(/(\d+)$/), 10);
return isNaN(t) ? null : t;
}, f = function(e, t) {
var n = g(e);
return t && n ? t + " #" + n : e.metadata.name;
}, h = function(e) {
return "true" === c(e, "openshift.io/build-config.paused");
}, v = function(e) {
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
return a.create(i, e.metadata.name, c, l).then(function(t) {
var n, a, i = f(t, e.metadata.name), c = _.get(e, "spec.runPolicy");
"Serial" === c || "SerialLatestOnly" === c ? (n = _.capitalize(s) + " " + i + " successfully queued.", a = "Builds for " + e.metadata.name + " are configured to run one at a time.") : n = _.capitalize(s) + " " + i + " successfully created.", o.addNotification({
type: "success",
message: n,
details: a,
links: [ {
href: r.resourceURL(t),
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
cancelBuild: function(e, r) {
var i = m(e) ? "pipeline" : "build", s = f(e, r), c = {
namespace: e.metadata.namespace
}, l = angular.copy(e), d = n.objectToResourceGroupVersion(l);
return l.status.cancelled = !0, a.update(d, l.metadata.name, l, c).then(function() {
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
var c = m(e) ? "pipeline" : "build", l = f(e, i), d = {
kind: "BuildRequest",
apiVersion: n.toAPIVersion(s),
metadata: {
name: e.metadata.name
}
}, p = {
namespace: e.metadata.namespace
};
return a.create(s, e.metadata.name, d, p).then(function(e) {
var t = f(e, i);
o.addNotification({
type: "success",
message: _.capitalize(c) + " " + l + " is being rebuilt as " + t + ".",
links: [ {
href: r.resourceURL(e),
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
isPaused: h,
canBuild: function(e) {
return !!e && !e.metadata.deletionTimestamp && !h(e);
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
var a = l(e) || "";
t && !t(e) || p(e, n[a]) && (n[a] = e);
}), n;
},
getBuildNumber: g,
getBuildDisplayName: f,
getStartTimestsamp: v,
getDuration: function(e) {
var t = _.get(e, "status.duration");
if (t) return y(t);
var n = v(e), a = e.status.completionTimestamp;
return n && a ? moment(a).diff(moment(n)) : 0;
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
var a = e("annotation")(n, "buildConfig");
return p(n, t[a]) && (t[a] = n), t;
}, {});
},
interestingBuilds: function(t) {
var n = {};
return _.filter(t, function(t) {
if (d(t)) return !0;
var a = e("annotation")(t, "buildConfig");
p(t, n[a]) && (n[a] = t);
}).concat(_.map(n, function(e) {
return e;
}));
},
groupBuildConfigsByOutputImage: function(e) {
var t = {};
return _.each(e, function(e) {
var n = _.get(e, "spec.output.to"), a = b(n, e.metadata.namespace);
a && (t[a] = t[a] || [], t[a].push(e));
}), t;
},
sortBuilds: function(e, t) {
var n = function(e, n) {
var a, r, o = g(e), i = g(n);
return o || i ? o ? i ? t ? i - o : o - i : t ? -1 : 1 : t ? 1 : -1 : (a = _.get(e, "metadata.name", ""), r = _.get(n, "metadata.name", ""), t ? r.localeCompare(a) : a.localeCompare(r));
};
return _.toArray(e).sort(function(e, a) {
var r = _.get(e, "metadata.creationTimestamp", ""), o = _.get(a, "metadata.creationTimestamp", "");
return r === o ? n(e, a) : t ? o.localeCompare(r) : r.localeCompare(o);
});
},
getJenkinsStatus: S,
getCurrentStage: function(e) {
var t = S(e), n = _.get(t, "stages", []);
return _.last(n);
}
};
} ]), angular.module("openshiftConsole").factory("DeploymentsService", [ "$filter", "$q", "APIService", "DataService", "LabelFilter", "NotificationsService", function(e, t, n, a, r, o) {
function i() {}
var s = n.getPreferredVersion("deploymentconfigs/instantiate"), c = n.getPreferredVersion("deploymentconfigs/rollback"), l = n.getPreferredVersion("pods"), u = n.getPreferredVersion("replicationcontrollers"), d = e("annotation");
i.prototype.startLatestDeployment = function(t, r) {
var i = {
kind: "DeploymentRequest",
apiVersion: n.toAPIVersion(s),
name: t.metadata.name,
latest: !0,
force: !0
};
a.create(s, t.metadata.name, i, r).then(function(e) {
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
}, i.prototype.retryFailedDeployment = function(t, r, i) {
var s = angular.copy(t), c = n.objectToResourceGroupVersion(t), u = t.metadata.name, m = d(t, "deploymentConfig");
a.list(l, r, function(t) {
var n = t.by("metadata.name");
angular.forEach(n, function(t) {
var n = e("annotationName")("deployerPodFor");
t.metadata.labels[n] === u && a.delete(l, t.metadata.name, i).then(function() {
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
var p = e("annotationName")("deploymentStatus"), g = e("annotationName")("deploymentStatusReason"), f = e("annotationName")("deploymentCancelled");
s.metadata.annotations[p] = "New", delete s.metadata.annotations[g], delete s.metadata.annotations[f], a.update(c, u, s, r).then(function() {
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
}, i.prototype.rollbackToDeployment = function(t, r, i, s, l) {
var u = t.metadata.name, m = d(t, "deploymentConfig"), p = {
apiVersion: n.toAPIVersion(c),
kind: "DeploymentConfigRollback",
name: m,
spec: {
from: {
name: u
},
includeTemplate: !0,
includeReplicationMeta: r,
includeStrategy: i,
includeTriggers: s
}
};
a.create(c, m, p, l).then(function(t) {
var r = n.objectToResourceGroupVersion(t);
a.update(r, m, t, l).then(function(e) {
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
var r = t.metadata.name, i = e("annotation")(t, "deploymentConfig"), s = angular.copy(t), c = e("annotationName")("deploymentCancelled"), l = e("annotationName")("deploymentStatusReason");
s.metadata.annotations[c] = "true", s.metadata.annotations[l] = "The deployment was cancelled by the user", a.update(u, r, s, n).then(function() {
o.addNotification({
type: "success",
message: "Cancelled deployment " + r + " of " + i + "."
});
}, function(t) {
o.addNotification({
id: "cancel-deployment-error",
type: "error",
message: "An error occurred while cancelling the deployment.",
details: e("getErrorDetails")(t)
});
});
}, i.prototype.associateDeploymentsToDeploymentConfig = function(t, n, a) {
var o = {}, i = r.getLabelSelector();
return angular.forEach(t, function(t, r) {
var s = e("annotation")(t, "deploymentConfig");
(!a || n && n[s] || i.matches(t)) && (o[s = s || ""] = o[s] || {}, o[s][r] = t);
}), angular.forEach(n, function(e, t) {
o[t] = o[t] || {};
}), o;
}, i.prototype.deploymentBelongsToConfig = function(t, n) {
return !(!t || !n) && n === e("annotation")(t, "deploymentConfig");
}, i.prototype.associateRunningDeploymentToDeploymentConfig = function(t) {
var n = {};
return angular.forEach(t, function(t, a) {
n[a] = {}, angular.forEach(t, function(t, r) {
var o = e("deploymentStatus")(t);
"New" !== o && "Pending" !== o && "Running" !== o || (n[a][r] = t);
});
}), n;
}, i.prototype.getActiveDeployment = function(t) {
var n = e("deploymentIsInProgress"), a = e("annotation"), r = null;
return _.each(t, function(e) {
if (n(e)) return r = null, !1;
"Complete" === a(e, "deploymentStatus") && (!r || r.metadata.creationTimestamp < e.metadata.creationTimestamp) && (r = e);
}), r;
}, i.prototype.getRevision = function(e) {
return d(e, "deployment.kubernetes.io/revision");
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
var r = this.getScaleResource(e);
if (!r) return t.reject({
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
return a.update(r, e.metadata.name, o, {
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
return i.prototype.isScalable = function(e, t, n, a, r) {
if (p(e.metadata.name, a)) return !1;
var o = d(e, "deploymentConfig");
return !o || !!t && (!t[o] || !m(o, n) && _.get(r, [ o, "metadata", "name" ]) === e.metadata.name);
}, i.prototype.groupByDeploymentConfig = function(t) {
var n = {};
return _.each(t, function(t) {
var a = e("annotation")(t, "deploymentConfig") || "";
_.set(n, [ a, t.metadata.name ], t);
}), n;
}, i.prototype.sortByDeploymentVersion = function(e, t) {
return _.toArray(e).sort(function(e, n) {
var a, r, o = parseInt(d(e, "deploymentVersion"), 10), i = parseInt(d(n, "deploymentVersion"), 10);
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
}, i.prototype.setPaused = function(e, t, r) {
var o = angular.copy(e), i = n.objectToResourceGroupVersion(e);
return _.set(o, "spec.paused", t), a.update(i, e.metadata.name, o, r);
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
}), angular.module("openshiftConsole").factory("MembershipService", [ "$filter", "APIService", "Constants", "gettextCatalog", function(e, t, n, a) {
e("annotation");
var r = function() {
return _.reduce(_.slice(arguments), function(e, t, n) {
return t ? _.isEqual(n, 0) ? t : e + "-" + t : e;
}, "");
}, o = function() {
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
description: a.getString("Service accounts provide a flexible way to control API access without sharing a regular user’s credentials."),
helpLinkKey: "service_accounts",
name: "ServiceAccount",
subjects: {}
}
};
}, i = function(e) {
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
return _.merge(i(e), i(t));
},
isLastRole: function(e, t) {
return 1 === _.filter(t, function(t) {
return _.some(t.subjects, {
name: e
});
}).length;
},
getSubjectKinds: o,
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
}, o());
return _.sortBy(n, "sortOrder");
}
};
} ]), angular.module("openshiftConsole").factory("RolesService", [ "$q", "APIService", "DataService", function(e, t, n) {
var a = t.getPreferredVersion("roles"), r = t.getPreferredVersion("clusterroles");
return {
listAllRoles: function(t) {
return e.all([ n.list(a, t, null), n.list(r, {}, null) ]);
}
};
} ]), angular.module("openshiftConsole").factory("RoleBindingsService", [ "$q", "APIService", "DataService", function(e, t, n) {
var a = t.getPreferredVersion("rolebindings"), r = function(e, t) {
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
create: function(e, a, i, s) {
var c = r(e, i), l = t.objectToResourceGroupVersion(c);
return a = o(a, i), c.subjects.push(angular.copy(a)), n.create(l, null, c, s);
},
addSubject: function(e, a, i, s) {
var c = r(), l = _.extend(c, e), u = t.objectToResourceGroupVersion(l);
if (!a) return l;
if (a = o(a, i), _.isArray(l.subjects)) {
if (_.includes(l.subjects, a)) return;
l.subjects.push(a);
} else l.subjects = [ a ];
return n.update(u, l.metadata.name, l, s);
},
removeSubject: function(t, o, i, s, c) {
var l = _.filter(s, {
roleRef: {
name: o
}
});
return e.all(_.map(l, function(e) {
var o = r();
e = _.extend(o, e);
var s = {
name: t
};
return i && (s.namespace = i), e.subjects = _.reject(e.subjects, s), e.subjects.length ? n.update(a, e.metadata.name, e, c) : n.delete(a, e.metadata.name, c).then(function() {
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
return n = "counter" === e.type ? t + g : t + p, URI.expand(n, {
podUID: e.pod.metadata.uid,
containerName: e.containerName,
metric: e.metric
}).toString();
});
}
var u, d, m, p = "/gauges/{containerName}%2F{podUID}%2F{metric}/data", g = "/counters/{containerName}%2F{podUID}%2F{metric}/data", f = function(e) {
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
var a = f(n), o = _.get(r, [ a.podUID, "metadata", "name" ]), s = i(e);
_.set(t, [ a.descriptor, o ], s);
};
return _.each(e.data.counter, n), _.each(e.data.gauge, n), t;
});
}, v = _.template("descriptor_name:network/tx_rate|network/rx_rate,type:pod,pod_id:<%= uid %>"), y = _.template("descriptor_name:memory/usage|cpu/usage_rate,type:pod_container,pod_id:<%= uid %>,container_name:<%= containerName %>"), b = _.template("descriptor_name:network/tx_rate|network/rx_rate|memory/usage|cpu/usage_rate,type:pod,pod_id:<%= uid %>");
return {
isAvailable: function(e) {
return o().then(function(n) {
return !!n && (!e || !!d || !m && t.get(n).then(function() {
return d = !0, !0;
}, function(e) {
return m = !0, a.$broadcast("metrics-connection-failed", {
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
} ]), angular.module("openshiftConsole").factory("LimitRangesService", [ "$filter", "$window", "Constants", function(e, t, n) {
var a = e("annotation"), r = e("usageValue"), o = e("usageWithUnits"), i = function(e, t) {
return !!e && (!t || r(e) < r(t));
}, s = function(e, t) {
return !!e && (!t || r(e) > r(t));
}, c = function(e) {
return _.includes(n.CLUSTER_RESOURCE_OVERRIDES_EXEMPT_PROJECT_NAMES, e);
}, l = function(e) {
return _.some(n.CLUSTER_RESOURCE_OVERRIDES_EXEMPT_PROJECT_PREFIXES, function(t) {
return _.startsWith(e, t);
});
}, u = function(e) {
var t = a(e, "quota.openshift.io/cluster-resource-override-enabled");
return !!t && "true" !== t;
}, d = function(e) {
var t = _.get(e, "metadata.name");
return c(t) || l(t) || u(e);
}, m = function(e) {
return !!_.get(t, "OPENSHIFT_CONFIG.clusterResourceOverridesEnabled") && !d(e);
}, p = function(e, t) {
return m(t);
}, g = function(e, t) {
return "cpu" === e && m(t);
}, f = function(e, t, n) {
var a = {};
return angular.forEach(e, function(e) {
angular.forEach(e.spec.limits, function(e) {
if (e.type === n) {
e.min && s(e.min[t], a.min) && (a.min = e.min[t]), e.max && i(e.max[t], a.max) && (a.max = e.max[t]), e.default && (a.defaultLimit = e.default[t] || a.defaultLimit), e.defaultRequest && (a.defaultRequest = e.defaultRequest[t] || a.defaultRequest);
var r;
e.maxLimitRequestRatio && (r = e.maxLimitRequestRatio[t]) && (!a.maxLimitRequestRatio || r < a.maxLimitRequestRatio) && (a.maxLimitRequestRatio = r);
}
});
}), a;
};
return {
getEffectiveLimitRange: f,
hasClusterResourceOverrides: m,
isRequestCalculated: p,
isLimitCalculated: g,
validatePodLimits: function(t, n, a, i) {
if (!a || !a.length) return [];
var s = f(t, n, "Pod"), c = f(t, n, "Container"), l = 0, u = 0, d = s.min && r(s.min), m = s.max && r(s.max), h = [], v = e("computeResourceLabel")(n, !0);
return angular.forEach(a, function(e) {
var t = e.resources || {}, a = t.requests && t.requests[n] || c.defaultRequest;
a && (l += r(a));
var o = t.limits && t.limits[n] || c.defaultLimit;
o && (u += r(o));
}), p(0, i) || (d && l < d && h.push(v + " request total for all containers is less than pod minimum (" + o(s.min, n) + ")."), m && l > m && h.push(v + " request total for all containers is greater than pod maximum (" + o(s.max, n) + ").")), g(n, i) || (d && u < d && h.push(v + " limit total for all containers is less than pod minimum (" + o(s.min, n) + ")."), m && u > m && h.push(v + " limit total for all containers is greater than pod maximum (" + o(s.max, n) + ").")), h;
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
return "true" === s(e, "console.alpha.openshift.io/overview-app-route");
}, u = function(e) {
var t = 0;
l(e) && (t += 21), i(e) && (t += 11);
var n = _.get(e, "spec.alternateBackends");
return _.isEmpty(n) || (t += 5), c(e) && (t += 3), e.spec.tls && (t += 1), t;
}, d = function(e) {
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
var n = u(e);
return u(t) > n ? t : e;
},
groupByService: function(e, t) {
return t ? d(e) : _.groupBy(e, "spec.to.name");
},
getSubdomain: function(e) {
return _.get(e, "spec.host", "").replace(/^[a-z0-9]([-a-z0-9]*[a-z0-9])\./, "");
},
isCustomHost: c,
isOverviewAppRoute: l,
sortRoutesByScore: function(e) {
return _.orderBy(e, [ u ], [ "desc" ]);
}
};
} ]), angular.module("openshiftConsole").factory("ChartsService", [ "Logger", function(e) {
return {
updateDonutCenterText: function(t, n, a) {
var r = d3.select(t).select("text.c3-chart-arcs-title");
r ? (r.selectAll("*").remove(), r.insert("tspan").text(n).classed(a ? "donut-title-big-pf" : "donut-title-med-pf", !0).attr("dy", a ? 0 : 5).attr("x", 0), a && r.insert("tspan").text(a).classed("donut-title-small-pf", !0).attr("dy", 20).attr("x", 0)) : e.warn("Can't select donut title element");
}
};
} ]), angular.module("openshiftConsole").service("HomePagePreferenceService", [ "$location", "$timeout", "$q", "$uibModal", "AuthService", "Logger", "Navigate", "NotificationsService", function(e, t, n, a, r, o, i, s) {
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
return a.open({
templateUrl: "views/modals/set-home-page-modal.html",
controller: "SetHomePageModalController"
}), !0;
}
} ]
});
}
};
} ]), angular.module("openshiftConsole").factory("HPAService", [ "$filter", "$q", "LimitRangesService", "MetricsService", function(e, t, n, a) {
var r = e("annotation"), o = function(e, t, n) {
return _.every(n, function(n) {
return _.get(n, [ "resources", t, e ]);
});
}, i = function(e, t) {
return o(e, "requests", t);
}, s = function(e, t) {
return o(e, "limits", t);
}, c = function(e, t, a) {
return !!n.getEffectiveLimitRange(a, e, "Container")[t];
}, l = function(e, t) {
return c(e, "defaultRequest", t);
}, u = function(e, t) {
return c(e, "defaultLimit", t);
}, d = function(e, t, a) {
return !!n.hasClusterResourceOverrides(a) || (!(!i("cpu", e) && !l("cpu", t)) || !(!s("cpu", e) && !u("cpu", t)));
}, m = e("humanizeKind"), p = e("hasDeploymentConfig"), g = function(e) {
if (!e) return {
message: "Metrics might not be configured by your cluster administrator. Metrics are required for autoscaling.",
reason: "MetricsNotAvailable"
};
}, f = function(e, t, n) {
var a, r = _.get(e, "spec.template.spec.containers", []);
if (!d(r, t, n)) return a = m(e.kind), {
message: "This " + a + " does not have any containers with a CPU request set. Autoscaling will not work without a CPU request.",
reason: "NoCPURequest"
};
}, h = function(e) {
return _.some(e, function(e) {
return r(e, "autoscaling.alpha.kubernetes.io/metrics");
});
}, v = function(e) {
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
return h([ e ]);
},
hasCPURequest: d,
filterHPA: function(e, t, n) {
return _.filter(e, function(e) {
return e.spec.scaleTargetRef.kind === t && e.spec.scaleTargetRef.name === n;
});
},
getHPAWarnings: function(e, n, r, o) {
return !e || _.isEmpty(n) ? t.when([]) : a.isAvailable().then(function(t) {
var a = h(n);
return _.compact([ g(t), !a && f(e, r, o), v(n), y(e, n) ]);
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
}), angular.module("openshiftConsole").factory("SecretsService", [ "$filter", "base64", "Logger", "NotificationsService", function(e, t, n, a) {
var r = e("isNonPrintable"), o = function(t, r) {
a.addNotification({
type: "error",
message: "Base64-encoded " + r + " string could not be decoded.",
details: e("getErrorDetails")(t)
}), n.error("Base64-encoded " + r + " string could not be decoded.", t);
}, i = function(e) {
var n = _.pick(e, [ "email", "username", "password" ]);
if (e.auth) try {
_.spread(function(e, t) {
n.username = e, n.password = t;
})(_.split(t.decode(e.auth), ":", 2));
} catch (e) {
return void o(e, "username:password");
}
return n;
}, s = function(e, n) {
var a, r = {
auths: {}
};
try {
a = JSON.parse(t.decode(e));
} catch (e) {
o(e, n);
}
return a.auths ? (_.each(a.auths, function(e, t) {
e.auth ? r.auths[t] = i(e) : r.auths[t] = e;
}), a.credsStore && (r.credsStore = a.credsStore)) : _.each(a, function(e, t) {
r.auths[t] = i(e);
}), r;
}, c = function(e) {
var n = {}, a = _.mapValues(e, function(e, a) {
if (!e) return "";
var o;
return ".dockercfg" === a || ".dockerconfigjson" === a ? s(e, a) : (o = t.decode(e), r(o) ? (n[a] = !0, e) : o);
});
return a.$$nonprintable = n, a;
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
_.get(e, [ "data", "WebHookSecretKey" ]) ? t.webhook.push(e) : t.source.push(e);
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
decodeSecretData: c,
getWebhookSecretValue: function(e, t) {
if (_.get(e, "secretReference.name") && t) {
var n = _.find(t, {
metadata: {
name: e.secretReference.name
}
});
return c(n.data).WebHookSecretKey;
}
return _.get(e, "secret");
}
};
} ]), angular.module("openshiftConsole").factory("ServicesService", [ "$filter", "$q", "APIService", "DataService", function(e, t, n, a) {
var r = n.getPreferredVersion("services"), o = "service.alpha.openshift.io/dependencies", i = e("annotation"), s = function(e) {
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
}), c(n, o), a.update(r, n.metadata.name, n, {
namespace: n.metadata.namespace
});
},
removeServiceLink: function(e, n) {
var o = angular.copy(e), i = s(o) || [], l = _.reject(i, function(t) {
return t.kind === n.kind && (t.namespace || e.metadata.namespace) === n.metadata.namespace && t.name === n.metadata.name;
});
return l.length === i.length ? t.when(!0) : (c(o, l), a.update(r, o.metadata.name, o, {
namespace: o.metadata.namespace
}));
},
isInfrastructure: function(e) {
return "true" === i(e, "service.openshift.io/infrastructure");
}
};
} ]), angular.module("openshiftConsole").factory("ImagesService", [ "$filter", "APIService", "ApplicationGenerator", "DataService", function(e, t, n, a) {
var r = t.getPreferredVersion("imagestreamimports"), o = function(e) {
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
apiVersion: t.toAPIVersion(r),
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
return a.create(r, null, o, n).then(function(e) {
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
var t = [], a = {
"openshift.io/generated-by": "OpenShiftWebConsole"
}, r = o(e.env), i = [], s = [], c = 0;
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
}, a),
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
annotations: a
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
annotations: a
},
spec: {
volumes: i,
containers: [ {
name: e.name,
image: e.image,
ports: e.ports,
env: r,
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
annotations: a
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
} ]), angular.module("openshiftConsole").factory("QuotaService", [ "$filter", "$location", "$rootScope", "$routeParams", "$q", "APIService", "Constants", "DataService", "EventsService", "Logger", "NotificationsService", function(e, t, n, a, r, o, i, s, c, l, u) {
var d = o.getPreferredVersion("resourcequotas"), m = o.getPreferredVersion("appliedclusterresourcequotas"), p = e("isNil"), g = e("usageValue"), f = e("usageWithUnits"), h = e("percent"), v = function(e) {
return _.every(e.spec.containers, function(e) {
var t = _.some(_.get(e, "resources.requests"), function(e) {
return !p(e) && 0 !== g(e);
}), n = _.some(_.get(e, "resources.limits"), function(e) {
return !p(e) && 0 !== g(e);
});
return !t && !n;
});
}, y = function(e) {
return _.has(e, "spec.activeDeadlineSeconds");
}, b = function(e, t) {
var n = v(e), a = y(e);
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
}, S = function(e, t) {
return e ? "Pod" === e.kind ? b(e, t) : _.has(e, "spec.template") ? b(e.spec.template, t) : t : t;
}, C = e("humanizeQuotaResource"), w = e("humanizeKind"), P = function(e, t, n) {
var a = e.status.total || e.status;
if (g(a.hard[n]) <= g(a.used[n])) {
var r, o;
return r = "Pod" === t.kind ? "You will not be able to create the " + w(t.kind) + " '" + t.metadata.name + "'." : "You can still create " + w(t.kind) + " '" + t.metadata.name + "' but no pods will be created until resources are freed.", o = "pods" === n ? "You are at your quota for pods." : "You are at your quota for " + C(n) + " on pods.", {
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
}, k = {
cpu: "resources.requests.cpu",
"requests.cpu": "resources.requests.cpu",
"limits.cpu": "resources.limits.cpu",
memory: "resources.requests.memory",
"requests.memory": "resources.requests.memory",
"limits.memory": "resources.limits.memory",
persistentvolumeclaims: "resources.limits.persistentvolumeclaims",
"requests.storage": "resources.request.storage"
}, j = function(e, t, n, a) {
var r = e.status.total || e.status, o = k[a], i = 0;
if (_.each(n.spec.containers, function(e) {
var t = _.get(e, o);
t && (i += g(t));
}), g(r.hard[a]) < g(r.used[a]) + i) {
var s;
return s = "Pod" === t.kind ? "You may not be able to create the " + w(t.kind) + " '" + t.metadata.name + "'." : "You can still create " + w(t.kind) + " '" + t.metadata.name + "' but you may not have pods created until resources are freed.", {
type: "warning",
message: "You are close to your quota for " + C(a) + " on pods.",
details: s,
links: [ {
href: "project/" + e.metadata.namespace + "/quota",
label: "View Quota",
target: "_blank"
} ]
};
}
}, I = function(e, t) {
var n = [], a = "Pod" === e.kind ? e : _.get(e, "spec.template");
return a ? (_.each([ "cpu", "memory", "requests.cpu", "requests.memory", "limits.cpu", "limits.memory", "pods" ], function(r) {
var o = t.status.total || t.status;
if (("Pod" !== e.kind || "pods" !== r) && _.has(o, [ "hard", r ]) && _.has(o, [ "used", r ])) {
var i = P(t, e, r);
if (i) n.push(i); else if ("pods" !== r) {
var s = j(t, e, a, r);
s && n.push(s);
}
}
}), n) : n;
}, T = function(e, t, n) {
var a = [];
return e && t ? (_.each(e, function(e) {
var r = S(e, t), i = S(e, n), s = o.objectToResourceGroupVersion(e);
if (s) {
var c = o.kindToResource(e.kind, !0), l = w(e.kind), u = "";
s.group && (u = s.group + "/"), u += s.resource;
var d = function(t) {
var n = t.status.total || t.status;
!p(n.hard[u]) && g(n.hard[u]) <= g(n.used[u]) && a.push({
type: "error",
message: "You are at your quota of " + n.hard[u] + " " + ("1" === n.hard[u] ? l : c) + " in this project.",
details: "You will not be able to create the " + l + " '" + e.metadata.name + "'.",
links: [ {
href: "project/" + t.metadata.namespace + "/quota",
label: "View Quota",
target: "_blank"
} ]
}), a = a.concat(I(e, t));
};
_.each(r, d), _.each(i, d);
}
}), a) : a;
}, R = [ "cpu", "requests.cpu", "memory", "requests.memory", "limits.cpu", "limits.memory" ], N = function(e, t, n, a, r) {
var o, s = "Your project is " + (a < t ? "over" : "at") + " quota. ";
return o = _.includes(R, r) ? s + "It is using " + h(t / a, 0) + " of " + f(n, r) + " " + C(r) + "." : s + "It is using " + t + " of " + a + " " + C(r) + ".", o = _.escape(o), i.QUOTA_NOTIFICATION_MESSAGE && i.QUOTA_NOTIFICATION_MESSAGE[r] && (o += " " + i.QUOTA_NOTIFICATION_MESSAGE[r]), o;
}, A = function(e, t, n) {
var a = function(e) {
var t = e.status.total || e.status;
return _.some(t.hard, function(e, a) {
if ("resourcequotas" === a) return !1;
if (!n || _.includes(n, a)) {
if (!(e = g(e))) return !1;
var r = g(_.get(t, [ "used", a ]));
return !!r && e <= r;
}
});
};
return _.some(e, a) || _.some(t, a);
};
return {
filterQuotasForResource: S,
isBestEffortPod: v,
isTerminatingPod: y,
getResourceLimitAlerts: I,
getQuotaAlerts: T,
getLatestQuotaAlerts: function(e, t) {
var n, a, o = [];
return o.push(s.list(d, t).then(function(e) {
n = e.by("metadata.name"), l.log("quotas", n);
})), o.push(s.list(m, t).then(function(e) {
a = e.by("metadata.name"), l.log("cluster quotas", a);
})), r.all(o).then(function() {
return {
quotaAlerts: T(e, n, a)
};
});
},
isAnyQuotaExceeded: A,
isAnyStorageQuotaExceeded: function(e, t) {
return A(e, t, [ "requests.storage", "persistentvolumeclaims" ]);
},
willRequestExceedQuota: function(e, t, n, a) {
var r = function(e) {
var t = e.status.total || e.status, r = g(a);
if (!n) return !1;
var o = _.get(t.hard, n);
if (!(o = g(o))) return !1;
var i = g(_.get(t, [ "used", n ]));
return i ? o < i + r : o < r;
};
return _.some(e, r) || _.some(t, r);
},
getQuotaNotifications: function(e, r, o) {
var i = [], s = function(e) {
var r = e.status.total || e.status;
_.each(r.hard, function(e, s) {
var c = g(e), l = _.get(r, [ "used", s ]), d = g(l);
"resourcequotas" !== s && c && d && c <= d && i.push({
id: o + "/quota-limit-reached-" + s,
namespace: o,
type: c < d ? "warning" : "info",
message: N(0, d, e, c, s),
isHTML: !0,
skipToast: !0,
showInDrawer: !0,
actions: [ {
name: "View Quotas",
title: "View project quotas",
onClick: function() {
t.url("/project/" + a.project + "/quota"), n.$emit("NotificationDrawerWrapper.hide");
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
return _.each(e, s), _.each(r, s), i;
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
var m = _.uniq(_.map(s, function(e) {
return a(e.kind);
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
var t = a(e.kind) + " ";
"ServiceAccount" === e.kind && (t += (e.namespace || r) + "/"), t += e.name, p.push(t);
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
var g = _.uniq(_.map(u, function(e) {
return a(e.kind);
}));
o.push({
type: "warning",
message: "This will create resources that may have security or project behavior implications.",
details: "Make sure you understand what they do before creating them. The resources being created are: " + g.join(", ")
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
}), angular.module("openshiftConsole").factory("CatalogService", [ "$filter", "$q", "$window", "APIService", "AuthService", "Catalog", "Constants", "KeywordService", "Logger", "NotificationsService", function(e, t, n, a, r, o, i, s, c, l) {
var u, d = e("tags"), m = a.getPreferredVersion("servicebindings"), p = a.getPreferredVersion("clusterserviceclasses"), g = a.getPreferredVersion("serviceinstances"), f = a.getPreferredVersion("clusterserviceplans"), h = !i.DISABLE_SERVICE_CATALOG_LANDING_PAGE && a.apiInfo(m) && a.apiInfo(p) && a.apiInfo(g) && a.apiInfo(f), v = function() {
c.debug("ProjectsService: clearing catalog items cache"), u = null;
};
r.onUserChanged(v), r.onLogout(v);
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
var n = _.get(e, "categoryAliases", []), a = [ e.id ].concat(n);
return _.some(a, function(e) {
return b(e, t);
});
}, C = function(e) {
return e.from && "ImageStreamTag" === e.from.kind && -1 === e.from.name.indexOf(":") && !e.from.namespace;
}, w = e("displayName"), P = [ "metadata.name", 'metadata.annotations["openshift.io/display-name"]', "metadata.annotations.description" ];
return {
SERVICE_CATALOG_ENABLED: h,
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
var a = !1;
_.each(y, function(r) {
(function(e) {
return _.some(e.status.tags, function(e) {
var t = n[e.tag] || [];
return S(r, t) && b("builder", t) && !b("hidden", t);
});
})(e) && (t[r.id] = t[r.id] || [], t[r.id].push(e), a = !0);
}), a || _.some(e.status.tags, function(e) {
var t = n[e.tag] || [];
return b("builder", t) && !b("hidden", t);
}) && (t[""] = t[""] || [], t[""].push(e));
}
}), t;
},
categorizeTemplates: function(e) {
var t = {};
return _.each(e, function(e) {
var n = d(e), a = !1;
_.each(y, function(r) {
S(r, n) && (t[r.id] = t[r.id] || [], t[r.id].push(e), a = !0);
}), a || (t[""] = t[""] || [], t[""].push(e));
}), t;
},
referencesSameImageStream: C,
filterImageStreams: function(e, t) {
if (!t.length) return e;
var n = [];
return _.each(e, function(e) {
var a = _.get(e, "metadata.name", ""), r = w(e, !0), o = [], i = {}, s = {};
_.each(e.spec.tags, function(e) {
if (C(e)) return i[e.name] = e.from.name, s[e.from.name] = s[e.from.name] || [], void s[e.from.name].push(e.name);
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
e.env = e.env || [], e.envFrom = e.envFrom || [];
});
},
compact: function(e) {
var a = n(e);
_.each(a, function(e) {
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
var a = n(e), r = n(t);
if (a.length !== r.length) return !1;
var o, i, s, c, l;
for (o = 0; o < a.length; o++) {
if (a[o].name !== r[o].name) return !1;
if (i = a[o].env || [], s = r[o].env || [], c = a[o].envFrom || [], l = r[o].envFrom || [], !_.isEqual(i, s) || !_.isEqual(c, l)) return !1;
}
return !0;
},
mergeEdits: function(e, t) {
var a, r = angular.copy(t), o = n(e), i = n(r);
for (a = 0; a < i.length; a++) i[a].env = _.get(o, [ a, "env" ], []), i[a].envFrom = _.get(o, [ a, "envFrom" ], []);
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
return n.setPaused(t, !1, {
namespace: t.metadata.namespace
}).then(_.noop, function(n) {
a[t.metadata.uid + "-pause-error"] = {
type: "error",
message: "An error occurred resuming the " + s(t.kind) + ".",
details: e("getErrorDetails")(n)
};
}), !0;
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
if (n || !($(t.target).closest("a").length > 0 || $(t.target).closest("button").length > 0)) {
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
}), angular.module("openshiftConsole").factory("ServiceInstancesService", [ "$filter", "$q", "$uibModal", "APIService", "BindingService", "CatalogService", "DataService", "Logger", "NotificationsService", function(e, t, n, a, r, o, i, s, c) {
var l = a.getPreferredVersion("clusterserviceclasses"), u = a.getPreferredVersion("clusterserviceplans"), d = function(e) {
return _.get(e, "spec.clusterServiceClassRef.name");
}, m = function(e) {
return _.get(e, "spec.clusterServicePlanRef.name");
}, p = function(e, n) {
if (angular.isDefined(n)) return t.when(n);
var o = {
namespace: e.metadata.namespace
}, s = a.getPreferredVersion("servicebindings");
return i.list(s, o).then(function(t) {
return n = t.by("metadata.name"), r.getBindingsForResource(n, e);
});
}, g = function(t) {
var n = {
namespace: t.metadata.namespace
}, r = a.getPreferredVersion("serviceinstances");
c.hideNotification("deprovision-service-error");
var o = {
propagationPolicy: null
};
return i.delete(r, t.metadata.name, n, o).then(function() {
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
}, f = function(t, n) {
if (o.SERVICE_CATALOG_ENABLED) {
var r = {
namespace: t.metadata.namespace
}, l = a.getPreferredVersion("servicebindings");
p(t, n).then(function(t) {
_.each(t, function(t) {
if (!t.metadata.deletionTimestamp) {
var n = {
propagationPolicy: null
};
i.delete(l, t.metadata.name, r, n).then(function() {
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
var a, r = {
kind: e.kind,
displayName: e.metadata.name,
okButtonText: "Delete",
okButtonClass: "btn-danger",
cancelButtonText: "Cancel",
delete: function() {
a.close("delete");
}
};
return (a = n.open({
templateUrl: "views/modals/delete-resource.html",
controller: "ConfirmModalController",
resolve: {
modalConfig: function() {
return r;
}
}
})).result.then(function() {
f(e, t), g(e);
});
}
};
} ]), angular.module("openshiftConsole").controller("LandingPageController", [ "$scope", "$rootScope", "AuthService", "CatalogService", "Constants", "DataService", "Navigate", "NotificationsService", "RecentlyViewedServiceItems", "GuidedTourService", "HTMLService", "$timeout", "$q", "$routeParams", "$location", function(e, t, n, a, r, o, i, s, c, l, u, d, m, p, g) {
function f() {
var t = g.search();
return t.serviceExternalName ? _.find(e.catalogItems, {
resource: {
spec: {
externalName: t.serviceExternalName
}
}
}) : null;
}
function h() {
var n = f();
if (n) e.$broadcast("open-overlay-panel", n); else if (y) if (p.startTour) d(function() {
g.replace(), g.search("startTour", null), e.startGuidedTour();
}, 500); else if (_.get(v, "auto_launch")) {
var a = "openshift/viewedHomePage/" + t.user.metadata.name;
"true" !== localStorage.getItem(a) && d(function() {
e.startGuidedTour() && localStorage.setItem(a, "true");
}, 500);
}
}
var v = _.get(r, "GUIDED_TOURS.landing_page_tour"), y = v && v.enabled && v.steps;
e.saasOfferings = r.SAAS_OFFERINGS, e.viewMembership = function(e) {
i.toProjectMembership(e.metadata.name);
}, y && (e.startGuidedTour = function() {
return !u.isWindowBelowBreakpoint(u.WINDOW_SIZE_SM) && (l.startTour(v.steps), !0);
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
a.getCatalogItems().then(function(t) {
e.catalogItems = t, h();
});
}), e.$on("$destroy", function() {
b();
}), y && e.$on("$locationChangeStart", function(t) {
g.search().startTour && (e.startGuidedTour(), t.preventDefault());
});
} ]), angular.module("openshiftConsole").controller("ProjectBrowseCatalogController", [ "$scope", "$q", "$routeParams", "DataService", "AuthorizationService", "Catalog", "CatalogService", "Navigate", "NotificationsService", "ProjectsService", function(e, t, n, a, r, o, i, s, c, l) {
var u = n.project;
l.get(u).then(function() {
r.getProjectRules(u).then(function() {
if (r.canIAddToProject(u)) {
var a, l, d = i.getCatalogItems().then(function(e) {
a = e;
}), m = o.getProjectCatalogItems(u).then(_.spread(function(e, t) {
l = e, t && c.addNotification({
type: "error",
message: t
});
}));
t.all([ d, m ]).then(function() {
e.catalogItems = o.sortCatalogItems(_.concat(a, l)), n.filter && (e.keywordFilter = n.filter);
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
} ]), angular.module("openshiftConsole").controller("ProjectsController", [ "$scope", "$filter", "$location", "$route", "$timeout", "AuthService", "DataService", "KeywordService", "Navigate", "Logger", "ProjectsService", "gettextCatalog", function(e, t, n, a, r, o, i, s, c, l, u, d) {
var m, p, g = [], f = [], h = !1;
e.alerts = e.alerts || {}, e.loading = !0, e.showGetStarted = !1, e.canCreate = void 0, e.search = {
text: ""
}, e.limitListTo = 250;
var v, y = [ "metadata.name", 'metadata.annotations["openshift.io/display-name"]', 'metadata.annotations["openshift.io/description"]', 'metadata.annotations["openshift.io/requester"]' ], b = function() {
e.projects = s.filterForKeywords(p, y, f);
}, S = t("displayName"), C = function() {
var t = _.get(e, "sortConfig.currentField.id");
v !== t && (e.sortConfig.isAscending = "metadata.creationTimestamp" !== t);
var n = function(e) {
return S(e).toLowerCase();
}, a = e.sortConfig.isAscending ? "asc" : "desc";
switch (t) {
case 'metadata.annotations["openshift.io/display-name"]':
p = _.orderBy(m, [ n, "metadata.name" ], [ a ]);
break;

case 'metadata.annotations["openshift.io/requester"]':
p = _.orderBy(m, [ t, n ], [ a, "asc" ]);
break;

default:
p = _.orderBy(m, [ t ], [ a ]);
}
v = t;
}, w = function() {
C(), b();
};
e.sortConfig = {
fields: [ {
id: 'metadata.annotations["openshift.io/display-name"]',
title: d.getString("Display Name"),
sortType: "alpha"
}, {
id: "metadata.name",
title: d.getString("Name"),
sortType: "alpha"
}, {
id: 'metadata.annotations["openshift.io/requester"]',
title: d.getString("Creator"),
sortType: "alpha"
}, {
id: "metadata.creationTimestamp",
title: d.getString("Creation Date"),
sortType: "alpha"
} ],
isAscending: !0,
onSortChange: w
};
var P = function(t) {
m = _.toArray(t.by("metadata.name")), e.loading = !1, e.showGetStarted = _.isEmpty(m) && !e.isProjectListIncomplete, w();
}, k = function() {
h || u.list().then(P);
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
e.keywords = f = s.generateKeywords(t), e.$applyAsync(b);
}, 350)), o.withUser().then(function() {
u.list().then(function(t) {
e.isProjectListIncomplete = u.isProjectListIncomplete(), P(t), !e.isProjectListIncomplete && _.size(m) <= 250 && (g.push(u.watch(e, P)), h = !0);
}, function() {
e.isProjectListIncomplete = !0, e.loading = !1, m = [], w();
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
i.unwatchAll(g);
});
} ]), angular.module("openshiftConsole").controller("PodsController", [ "$filter", "$routeParams", "$scope", "APIService", "DataService", "ProjectsService", "LabelFilter", "Logger", function(e, t, n, a, r, o, i, s) {
n.projectName = t.project, n.pods = {}, n.unfilteredPods = {}, n.labelSuggestions = {}, n.clearFilter = function() {
i.clear();
};
var c = a.getPreferredVersion("pods"), l = [];
o.get(t.project).then(_.spread(function(e, t) {
function a() {
n.filterWithZeroResults = !i.getLabelSelector().isEmpty() && _.isEmpty(n.pods) && !_.isEmpty(n.unfilteredPods);
}
n.project = e, l.push(r.watch(c, t, function(e) {
n.podsLoaded = !0, n.unfilteredPods = e.by("metadata.name"), n.pods = i.getLabelSelector().select(n.unfilteredPods), i.addLabelSuggestionsFromResources(n.unfilteredPods, n.labelSuggestions), i.setLabelSuggestions(n.labelSuggestions), a(), s.log("pods (subscribe)", n.unfilteredPods);
})), i.onActiveFiltersChanged(function(e) {
n.$evalAsync(function() {
n.pods = e.select(n.unfilteredPods), a();
});
}), n.$on("$destroy", function() {
r.unwatchAll(l);
});
}));
} ]), angular.module("openshiftConsole").controller("PodController", [ "$filter", "$rootScope", "$routeParams", "$scope", "$timeout", "$uibModal", "APIService", "DataService", "FullscreenService", "ImageStreamResolver", "Logger", "MetricsService", "OwnerReferencesService", "PodsService", "ProjectsService", "gettextCatalog", function(e, t, n, a, r, o, i, s, c, l, u, d, m, p, g, f) {
a.projectName = n.project, a.pod = null, a.imageStreams = {}, a.imagesByDockerReference = {}, a.imageStreamImageRefByDockerReference = {}, a.builds = {}, a.alerts = {}, a.terminalDisconnectAlert = {}, a.renderOptions = a.renderOptions || {}, a.renderOptions.hideFilterWidget = !0, a.logOptions = {}, a.terminalTabWasSelected = !1, a.breadcrumbs = [ {
title: "Pods",
link: "project/" + n.project + "/browse/pods"
}, {
title: n.pod
} ], a.terminalDisconnectAlert.disconnect = {
type: "warning",
message: f.getString("This terminal has been disconnected. If you reconnect, your terminal history will be lost.")
}, a.noContainersYet = !0, a.selectedTab = {};
var h = i.getPreferredVersion("imagestreams"), v = i.getPreferredVersion("builds");
a.podsVersion = i.getPreferredVersion("pods"), a.podsLogVersion = i.getPreferredVersion("pods/log"), a.eventsVersion = i.getPreferredVersion("events"), a.deploymentConfigsVersion = i.getPreferredVersion("deploymentconfigs");
var y = [], b = null, S = null;
d.isAvailable().then(function(e) {
a.metricsAvailable = e;
});
var C = function() {
if (a.pod) {
var e = _.find(a.pod.status.containerStatuses, {
name: a.logOptions.container
}), t = _.get(e, "state"), n = _.head(_.keys(t)), r = _.includes([ "running", "waiting", "terminated" ], n) ? n : "", o = _.get(e, "lastState"), i = _.head(_.keys(o)), s = _.get(e, "state.waiting");
angular.extend(a, {
containerStatusKey: r,
containerStateReason: _.get(t, [ n, "reason" ])
}), s ? angular.extend(a, {
lasStatusKey: i,
containerStartTime: _.get(o, [ i, "startedAt" ]),
containerEndTime: _.get(o, [ i, "finishedAt" ])
}) : angular.extend(a, {
containerStartTime: _.get(t, [ n, "startedAt" ]),
containerEndTime: _.get(t, [ n, "finishedAt" ])
});
}
}, w = function() {
var e = $("<span>").css({
position: "absolute",
top: "-100px"
}).addClass("terminal-font").text(_.repeat("x", 10)).appendTo("body"), t = {
width: e.width() / 10,
height: e.height()
};
return e.remove(), t;
}(), P = $(window), k = function(e) {
e || (e = 0), w.height && w.width && a.selectedTab.terminal && !(e > 10) && a.$evalAsync(function() {
var t = $(".container-terminal-wrapper").get(0);
if (t) {
var n = t.getBoundingClientRect();
if (0 !== n.left || 0 !== n.top || 0 !== n.width || 0 !== n.height) {
var o = P.height(), i = n.width - 17, s = o - n.top - 36;
a.terminalCols = Math.max(_.floor(i / w.width), 80), a.terminalRows = Math.max(_.floor(s / w.height), 24);
} else r(function() {
k(e + 1);
}, 50);
} else r(function() {
k(e + 1);
}, 50);
});
}, j = function() {
$(window).on("resize.terminalsize", _.debounce(k, 100)), b || (b = t.$on("oscHeader.toggleNav", function() {
setTimeout(k, 150);
}));
}, I = function() {
$(window).off("resize.terminalsize"), b && (b(), b = null);
};
a.$watch("selectedTab.terminal", function(e) {
e ? (w.height && w.width ? j() : u.warn(f.getString("Unable to calculate the bounding box for a character.  Terminal will not be able to resize.")), r(k, 0)) : I();
}), a.onTerminalSelectChange = function(e) {
_.each(a.containerTerminals, function(e) {
e.isVisible = !1;
}), e.isVisible = !0, e.isUsed = !0, a.selectedTerminalContainer = e;
};
var T = function(e) {
var t = _.get(e, "state", {});
return _.head(_.keys(t));
}, R = function() {
var e = [];
_.each(a.pod.spec.containers, function(t) {
var n = _.find(a.pod.status.containerStatuses, {
name: t.name
}), r = T(n);
e.push({
containerName: t.name,
isVisible: !1,
isUsed: !1,
containerState: r
});
});
var t = _.head(e);
return t.isVisible = !0, t.isUsed = !0, a.selectedTerminalContainer = t, e;
}, N = function(e) {
a.noContainersYet && (a.noContainersYet = 0 === a.containersRunning(e.status.containerStatuses));
}, A = function(e) {
_.each(e, function(e) {
var t = _.find(a.pod.status.containerStatuses, {
name: e.containerName
}), n = T(t);
e.containerState = n;
});
}, E = e("annotation"), D = function(e, t) {
if (a.loaded = !0, a.pod = e, a.dcName = E(e, "deploymentConfig"), a.rcName = E(e, "deployment"), a.deploymentVersion = E(e, "deploymentVersion"), a.logCanRun = !_.includes([ "New", "Pending", "Unknown" ], e.status.phase), C(), delete a.controllerRef, !a.dcName) {
var n = m.getControllerReferences(e);
a.controllerRef = _.find(n, function(e) {
return "ReplicationController" === e.kind || "ReplicaSet" === e.kind || "Build" === e.kind || "StatefulSet" === e.kind;
});
}
"DELETED" === t && (a.alerts.deleted = {
type: "warning",
message: f.getString("This pod has been deleted.")
});
};
g.get(n.project).then(_.spread(function(t, r) {
S = r, a.project = t, a.projectContext = r, s.get(a.podsVersion, n.pod, r, {
errorNotification: !1
}).then(function(e) {
D(e);
var t = {};
t[e.metadata.name] = e, a.logOptions.container = n.container || e.spec.containers[0].name, a.containerTerminals = R(), N(e), l.fetchReferencedImageStreamImages(t, a.imagesByDockerReference, a.imageStreamImageRefByDockerReference, S), y.push(s.watchObject(a.podsVersion, n.pod, r, function(e, t) {
D(e, t), A(a.containerTerminals), N(e);
}));
}, function(t) {
a.loaded = !0, a.alerts.load = {
type: "error",
message: f.getString("The pod details could not be loaded."),
details: e("getErrorDetails")(t)
};
}), a.$watch("logOptions.container", C), y.push(s.watch(h, r, function(e) {
a.imageStreams = e.by("metadata.name"), l.buildDockerRefMapForImageStreams(a.imageStreams, a.imageStreamImageRefByDockerReference), l.fetchReferencedImageStreamImages(a.pods, a.imagesByDockerReference, a.imageStreamImageRefByDockerReference, r), u.log("imagestreams (subscribe)", a.imageStreams);
})), y.push(s.watch(v, r, function(e) {
a.builds = e.by("metadata.name"), u.log("builds (subscribe)", a.builds);
}));
var d, m = function() {
var t = a.debugPod;
d && (s.unwatch(d), d = null), $(window).off("beforeunload.debugPod"), t && (s.delete(a.podsVersion, t.metadata.name, r, {
gracePeriodSeconds: 0
}).then(_.noop, function(n) {
a.alerts["debug-container-error"] = {
type: "error",
message: f.getString("Could not delete pod ") + t.metadata.name,
details: e("getErrorDetails")(n)
};
}), a.debugPod = null);
}, g = function() {
$(".terminal:visible").focus();
};
a.hasFullscreen = c.hasFullscreen(!0), a.fullscreenTerminal = function() {
c.requestFullscreen("#container-terminal-wrapper"), setTimeout(g);
}, a.exitFullscreen = function() {
c.exitFullscreen();
}, a.debugTerminal = function(t) {
var n = p.generateDebugPod(a.pod, t);
n ? s.create(i.objectToResourceGroupVersion(n), null, n, r).then(function(e) {
var i = _.find(a.pod.spec.containers, {
name: t
});
a.debugPod = e, $(window).on("beforeunload.debugPod", function() {
return f.getString("Are you sure you want to leave with the debug terminal open? The debug pod will not be deleted unless you close the dialog.");
}), d = s.watchObject(a.podsVersion, n.metadata.name, r, function(e) {
a.debugPod = e;
}), o.open({
templateUrl: "views/modals/debug-terminal.html",
controller: "DebugTerminalModalController",
scope: a,
resolve: {
container: function() {
return i;
},
image: function() {
return _.get(a, [ "imagesByDockerReference", i.image ]);
}
}
}).result.then(m);
}, function(n) {
a.alerts["debug-container-error"] = {
type: "error",
message: f.getString("Could not debug container ") + t,
details: e("getErrorDetails")(n)
};
}) : a.alerts["debug-container-error"] = {
type: "error",
message: f.getString("Could not debug container ") + t
};
}, a.containersRunning = function(e) {
var t = 0;
return e && e.forEach(function(e) {
e.state && e.state.running && t++;
}), t;
}, a.$on("$destroy", function() {
s.unwatchAll(y), m(), I();
});
}));
} ]), angular.module("openshiftConsole").controller("OverviewController", [ "$scope", "$filter", "$q", "$location", "$routeParams", "AlertMessageService", "APIService", "AppsService", "BindingService", "BuildsService", "CatalogService", "Constants", "DataService", "DeploymentsService", "HomePagePreferenceService", "HPAService", "HTMLService", "ImageStreamResolver", "KeywordService", "LabelFilter", "Logger", "MetricsService", "Navigate", "OwnerReferencesService", "PodsService", "ProjectsService", "PromiseUtils", "ResourceAlertsService", "RoutesService", "ServiceInstancesService", "KubevirtVersions", "gettextCatalog", OverviewController ]), angular.module("openshiftConsole").controller("QuotaController", [ "$filter", "$routeParams", "$scope", "APIService", "DataService", "Logger", "ProjectsService", "gettextCatalog", function(e, t, n, a, r, o, i, s) {
n.projectName = t.project, n.limitRanges = {}, n.limitsByType = {}, n.labelSuggestions = {}, n.alerts = n.alerts || {}, n.quotaHelp = s.getString("Limits resource usage within this project."), n.emptyMessageLimitRanges = s.getString("Loading..."), n.limitRangeHelp = s.getString("Defines minimum and maximum constraints for runtime resources such as memory and CPU."), n.renderOptions = n.renderOptions || {}, n.renderOptions.hideFilterWidget = !0;
var c = a.getPreferredVersion("appliedclusterresourcequotas"), l = a.getPreferredVersion("resourcequotas"), u = a.getPreferredVersion("limitranges"), d = [], m = e("usageValue");
n.isAtLimit = function(e, t) {
var n = e.status.total || e.status, a = m(_.get(n, [ "hard", t ]));
if (!a) return !1;
var r = m(_.get(n, [ "used", t ]));
return !!r && r >= a;
};
var p = e("humanizeQuotaResource"), g = function(e, t) {
return "cpu" === e || "requests.cpu" === e ? "cpu" === t || "requests.cpu" === t ? 0 : -1 : "cpu" === t || "requests.cpu" === t ? 1 : "memory" === e || "requests.memory" === e ? "memory" === t || "requests.memory" === t ? 0 : -1 : "memory" === t || "requests.memory" === t ? 1 : "limits.cpu" === e ? "limits.cpu" === t ? 0 : -1 : "limits.cpu" === t ? 1 : "limits.memory" === e ? "limits.memory" === t ? 0 : -1 : "limits.memory" === t ? 1 : (e = p(e), t = p(t), e.localeCompare(t));
}, f = function(e) {
var t = {};
return _.each(e, function(e) {
var n = _.get(e, "spec.quota.hard") || _.get(e, "spec.hard"), a = _.keys(n).sort(g);
t[e.metadata.name] = a;
}), t;
};
i.get(t.project).then(_.spread(function(e, a) {
n.project = e, d.push(r.watch(l, a, function(e) {
n.quotas = _.sortBy(e.by("metadata.name"), "metadata.name"), n.orderedTypesByQuota = f(n.quotas), o.log("quotas", n.quotas);
}, {
poll: !0,
pollInterval: 6e4
})), d.push(r.watch(c, a, function(e) {
n.clusterQuotas = _.sortBy(e.by("metadata.name"), "metadata.name"), n.orderedTypesByClusterQuota = f(n.clusterQuotas), n.namespaceUsageByClusterQuota = {}, _.each(n.clusterQuotas, function(e) {
if (e.status) {
var a = _.find(e.status.namespaces, {
namespace: t.project
});
n.namespaceUsageByClusterQuota[e.metadata.name] = a.status;
}
}), o.log("cluster quotas", n.clusterQuotas);
}, {
poll: !0,
pollInterval: 6e4
})), d.push(r.watch(u, a, function(e) {
n.limitRanges = _.sortBy(e.by("metadata.name"), "metadata.name"), n.emptyMessageLimitRanges = s.getString("There are no limit ranges set on this project."), angular.forEach(n.limitRanges, function(e) {
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
}, {
poll: !0,
pollInterval: 6e4
})), n.$on("$destroy", function() {
r.unwatchAll(d);
});
}));
} ]), angular.module("openshiftConsole").controller("MonitoringController", [ "$routeParams", "$location", "$scope", "$filter", "APIService", "BuildsService", "DataService", "ImageStreamResolver", "KeywordService", "Logger", "MetricsService", "Navigate", "PodsService", "ProjectsService", "$rootScope", function(e, t, n, a, r, o, i, s, c, l, u, d, m, p, g) {
n.projectName = e.project, n.alerts = n.alerts || {}, n.renderOptions = n.renderOptions || {}, n.renderOptions.showEventsSidebar = !0, n.renderOptions.collapseEventsSidebar = "true" === localStorage.getItem("monitoring.eventsidebar.collapsed"), n.buildsLogVersion = r.getPreferredVersion("builds/log"), n.podsLogVersion = r.getPreferredVersion("pods/log"), n.deploymentConfigsLogVersion = r.getPreferredVersion("deploymentconfigs/log");
var f = a("isIE")(), h = [];
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
var v = a("isNil");
n.filters = {
hideOlderResources: v(e.hideOlderResources) || "true" === e.hideOlderResources,
text: ""
};
var y, b, S, C;
u.isAvailable().then(function(e) {
n.metricsAvailable = e;
});
var w = a("orderObjectsByDate"), P = [ "metadata.name" ], k = [], j = function() {
n.filteredPods = c.filterForKeywords(C, P, k), n.filteredReplicationControllers = c.filterForKeywords(b, P, k), n.filteredReplicaSets = c.filterForKeywords(S, P, k), n.filteredBuilds = c.filterForKeywords(y, P, k), n.filteredStatefulSets = c.filterForKeywords(_.values(n.statefulSets), P, k);
}, I = function(e) {
n.logOptions.pods[e.metadata.name] = {
container: e.spec.containers[0].name
}, n.logCanRun.pods[e.metadata.name] = !_.includes([ "New", "Pending", "Unknown" ], e.status.phase);
}, T = function(e) {
n.logOptions.replicationControllers[e.metadata.name] = {};
var t = a("annotation")(e, "deploymentVersion");
t && (n.logOptions.replicationControllers[e.metadata.name].version = t), n.logCanRun.replicationControllers[e.metadata.name] = !_.includes([ "New", "Pending" ], a("deploymentStatus")(e));
}, R = function(e) {
n.logOptions.builds[e.metadata.name] = {}, n.logCanRun.builds[e.metadata.name] = !_.includes([ "New", "Pending", "Error" ], e.status.phase);
}, N = function() {
n.filteredStatefulSets = c.filterForKeywords(_.values(n.statefulSets), P, k);
}, A = function() {
C = _.filter(n.pods, function(e) {
return !n.filters.hideOlderResources || "Succeeded" !== e.status.phase && "Failed" !== e.status.phase;
}), n.filteredPods = c.filterForKeywords(C, P, k);
}, E = a("isIncompleteBuild"), D = a("buildConfigForBuild"), B = a("isRecentBuild"), L = function() {
moment().subtract(5, "m");
y = _.filter(n.builds, function(e) {
if (!n.filters.hideOlderResources) return !0;
if (E(e)) return !0;
var t = D(e);
return t ? n.latestBuildByConfig[t].metadata.name === e.metadata.name : B(e);
}), n.filteredBuilds = c.filterForKeywords(y, P, k);
}, V = a("deploymentStatus"), O = a("deploymentIsInProgress"), U = function() {
b = _.filter(n.replicationControllers, function(e) {
return !n.filters.hideOlderResources || (O(e) || "Active" === V(e));
}), n.filteredReplicationControllers = c.filterForKeywords(b, P, k);
}, x = function() {
S = _.filter(n.replicaSets, function(e) {
return !n.filters.hideOlderResources || _.get(e, "status.replicas");
}), n.filteredReplicaSets = c.filterForKeywords(S, P, k);
};
n.toggleItem = function(e, t, r, o) {
var i = $(e.target);
if (o || !i || !i.closest("a", t).length) {
var s, c;
switch (r.kind) {
case "Build":
s = !n.expanded.builds[r.metadata.name], n.expanded.builds[r.metadata.name] = s, c = s ? "event.resource.highlight" : "event.resource.clear-highlight", g.$emit(c, r);
var l = _.get(n.podsByName, a("annotation")(r, "buildPod"));
l && g.$emit(c, l);
break;

case "ReplicationController":
s = !n.expanded.replicationControllers[r.metadata.name], n.expanded.replicationControllers[r.metadata.name] = s, c = s ? "event.resource.highlight" : "event.resource.clear-highlight", g.$emit(c, r);
var u = a("annotation")(r, "deployerPod");
u && g.$emit(c, {
kind: "Pod",
metadata: {
name: u
}
}), _.each(n.podsByOwnerUID[r.metadata.uid], function(e) {
g.$emit(c, e);
});
break;

case "ReplicaSet":
s = !n.expanded.replicaSets[r.metadata.name], n.expanded.replicaSets[r.metadata.name] = s, c = s ? "event.resource.highlight" : "event.resource.clear-highlight", g.$emit(c, r), _.each(n.podsByOwnerUID[r.metadata.uid], function(e) {
g.$emit(c, e);
});
break;

case "Pod":
s = !n.expanded.pods[r.metadata.name], n.expanded.pods[r.metadata.name] = s, c = s ? "event.resource.highlight" : "event.resource.clear-highlight", g.$emit(c, r);
break;

case "StatefulSet":
s = !n.expanded.statefulSets[r.metadata.name], n.expanded.statefulSets[r.metadata.name] = s, c = s ? "event.resource.highlight" : "event.resource.clear-highlight", g.$emit(c, r);
}
}
}, p.get(e.project).then(_.spread(function(e, a) {
n.project = e, n.projectContext = a, h.push(i.watch("pods", a, function(e) {
n.podsByName = e.by("metadata.name"), n.pods = w(n.podsByName, !0), n.podsByOwnerUID = m.groupByOwnerUID(n.pods), n.podsLoaded = !0, _.each(n.pods, I), A(), l.log("pods", n.pods);
})), h.push(i.watch({
resource: "statefulsets",
group: "apps",
version: "v1beta1"
}, a, function(e) {
n.statefulSets = e.by("metadata.name"), n.statefulSetsLoaded = !0, N(), l.log("statefulSets", n.statefulSets);
}, {
poll: f,
pollInterval: 6e4
})), h.push(i.watch("replicationcontrollers", a, function(e) {
n.replicationControllers = w(e.by("metadata.name"), !0), n.replicationControllersLoaded = !0, _.each(n.replicationControllers, T), U(), l.log("replicationcontrollers", n.replicationControllers);
})), h.push(i.watch("builds", a, function(e) {
n.builds = w(e.by("metadata.name"), !0), n.latestBuildByConfig = o.latestBuildByConfig(n.builds), n.buildsLoaded = !0, _.each(n.builds, R), L(), l.log("builds", n.builds);
})), h.push(i.watch({
group: "extensions",
resource: "replicasets"
}, a, function(e) {
n.replicaSets = w(e.by("metadata.name"), !0), n.replicaSetsLoaded = !0, x(), l.log("replicasets", n.replicaSets);
}, {
poll: f,
pollInterval: 6e4
})), n.$on("$destroy", function() {
i.unwatchAll(h);
}), n.$watch("filters.hideOlderResources", function() {
A(), L(), U(), x(), N();
var e = t.search();
e.hideOlderResources = n.filters.hideOlderResources ? "true" : "false", t.replace().search(e);
}), n.$watch("kindSelector.selected.kind", function() {
var e = t.search();
e.kind = n.kindSelector.selected.kind, t.replace().search(e);
}), n.$watch("filters.text", _.debounce(function() {
n.filterKeywords = k = c.generateKeywords(n.filters.text), n.$apply(j);
}, 50, {
maxWait: 250
})), n.$watch("renderOptions.collapseEventsSidebar", function(e, t) {
e !== t && (localStorage.setItem("monitoring.eventsidebar.collapsed", n.renderOptions.collapseEventsSidebar ? "true" : "false"), g.$emit("metrics.charts.resize"));
});
}));
} ]), angular.module("openshiftConsole").controller("MembershipController", [ "$filter", "$location", "$routeParams", "$scope", "$timeout", "$uibModal", "APIService", "AuthService", "AuthorizationService", "DataService", "ProjectsService", "MembershipService", "NotificationsService", "RoleBindingsService", "RolesService", "gettextCatalog", function(e, t, n, a, r, o, i, s, c, l, u, d, m, p, g, f) {
var h, v = n.project, y = e("humanizeKind"), b = e("annotation"), S = e("canI"), C = i.getPreferredVersion("serviceaccounts");
a.roleBindingsVersion = i.getPreferredVersion("rolebindings");
var w = [], P = {
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
}, k = function(e, t, n) {
m.addNotification({
type: e,
message: t,
details: n
});
}, j = function() {
a.disableAddForm = !1, a.newBinding.name = "", a.newBinding.namespace = v, a.newBinding.newRole = null;
}, I = function(e) {
l.list(C, e).then(function(e) {
var t = _.keys(e.by("metadata.name")).sort();
angular.extend(a, {
serviceAccounts: t,
refreshServiceAccounts: function(e) {
e && !_.includes(a.serviceAccounts, e) ? a.serviceAccounts = [ e ].concat(t) : a.serviceAccounts = t;
}
});
});
}, T = function(e) {
l.list(a.roleBindingsVersion, h, null, {
errorNotification: !1
}).then(function(e) {
angular.extend(a, {
canShowRoles: !0,
roleBindings: e.by("metadata.name"),
subjectKindsForUI: d.mapRolebindingsForUI(e.by("metadata.name"), w)
}), j();
}, function() {
e && (a.roleBindings[e.metadata.name] = e, a.subjectKindsForUI = d.mapRolebindingsForUI(a.roleBindings, w)), j();
});
}, R = function(t, n) {
a.disableAddForm = !0, p.create(t, n, v, h).then(function() {
T(), k("success", P.update.subject.success({
roleName: t.metadata.name,
subjectName: n.name
}));
}, function(a) {
j(), T(), k("error", P.update.subject.error({
roleName: t.metadata.name,
subjectName: n.name
}), e("getErrorDetails")(a));
});
}, N = function(t, n, r) {
a.disableAddForm = !0, p.addSubject(t, n, r, h).then(function() {
T(), k("success", P.update.subject.success({
roleName: t.roleRef.name,
subjectName: n.name
}));
}, function(a) {
j(), T(), k("error", P.update.subject.error({
roleName: t.roleRef.name,
subjectName: n.name
}), e("getErrorDetails")(a));
});
}, A = {};
n.tab && (A[n.tab] = !0);
var E = d.getSubjectKinds();
angular.extend(a, {
selectedTab: A,
projectName: v,
forms: {},
subjectKinds: E,
newBinding: {
role: "",
kind: n.tab || "User",
name: ""
},
toggleEditMode: function() {
j(), a.mode.edit = !a.mode.edit;
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
return e ? a + (b(e, "description") || "") : "";
}
}
});
var D = function(e, t, n, r) {
var o = {
title: f.getString("Confirm Removal"),
alerts: {},
detailsMarkup: P.remove.areYouSure.html.subject({
roleName: n,
kindName: y(t),
subjectName: e
}),
okButtonText: f.getString("Remove"),
okButtonClass: "btn-danger",
cancelButtonText: f.getString("Cancel")
};
return _.isEqual(e, r) && (o.detailsMarkup = P.remove.areYouSure.html.self({
roleName: n,
subjectName: e
}), d.isLastRole(a.user.metadata.name, a.roleBindings) && (o.alerts.currentUserLabelRole = {
type: "error",
message: P.notice.yourLastRole({
roleName: n
})
})), _.isEqual(t, "ServiceAccount") && _.startsWith(n, "system:") && (o.alerts.editingServiceAccountRole = {
type: "error",
message: P.warning.serviceAccount()
}), o;
};
s.withUser().then(function(e) {
a.user = e;
}), u.list().then(function(e) {
var t = _.keys(e.by("metadata.name")).sort();
angular.extend(a, {
projects: t,
selectProject: function(e) {
a.newBinding.name = "", I({
namespace: e
});
},
refreshProjects: function(e) {
e && !_.includes(a.projects, e) ? a.projects = [ e ].concat(t) : a.projects = t;
}
});
}), u.get(n.project).then(_.spread(function(n, r) {
h = r, T(), I(h), angular.extend(a, {
project: n,
subjectKinds: E,
canUpdateRolebindings: S("rolebindings", "update", v),
confirmRemove: function(n, r, i, s) {
var l = null, u = D(n, r, i, a.user.metadata.name);
_.isEqual(n, a.user.metadata.name) && d.isLastRole(a.user.metadata.name, a.roleBindings) && (l = !0), o.open({
templateUrl: "views/modals/confirm.html",
controller: "ConfirmModalController",
resolve: {
modalConfig: function() {
return u;
}
}
}).result.then(function() {
p.removeSubject(n, i, s, a.roleBindings, h).then(function(e) {
l ? t.url("catalog") : (c.getProjectRules(v, !0).then(function() {
T(e[0]);
var t = S("rolebindings", "update", v);
angular.extend(a, {
canUpdateRolebindings: t,
mode: {
edit: !!a.mode.edit && t
}
});
}), k("success", P.remove.success({
roleName: i,
subjectName: n
})));
}, function(t) {
k("error", P.remove.error({
roleName: i,
subjectName: n
}), e("getErrorDetails")(t));
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
i && _.some(i.subjects, o) ? k("error", P.update.subject.exists({
roleName: n.metadata.name,
subjectName: e
})) : i ? N(i, o, r) : R(n, o);
}
}), g.listAllRoles(h, {
errorNotification: !1
}).then(function(e) {
w = d.mapRolesForUI(_.head(e).by("metadata.name"), _.last(e).by("metadata.name"));
var t = d.sortRoles(w), n = d.filterRoles(w), r = function(e, t) {
return _.some(t, {
metadata: {
name: e
}
});
};
T(), angular.extend(a, {
toggle: {
roles: !1
},
filteredRoles: n,
toggleRoles: function() {
a.toggle.roles = !a.toggle.roles, a.toggle.roles ? a.filteredRoles = t : (a.filteredRoles = n, r(a.newBinding.role, n) || (a.newBinding.role = null));
}
});
});
}));
} ]), angular.module("openshiftConsole").controller("BuildsController", [ "$filter", "$location", "$routeParams", "$scope", "APIService", "BuildsService", "DataService", "LabelFilter", "Logger", "ProjectsService", function(e, t, n, a, r, o, i, s, c, l) {
a.projectName = n.project, a.builds = {}, a.unfilteredBuildConfigs = {}, a.buildConfigs = void 0, a.labelSuggestions = {}, a.latestByConfig = {}, a.clearFilter = function() {
s.clear();
};
var u = e("buildConfigForBuild"), d = r.getPreferredVersion("builds"), m = r.getPreferredVersion("buildconfigs"), p = [];
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
function g() {
a.latestByConfig = o.latestBuildByConfig(a.builds, r), a.buildsNoConfig = _.pickBy(a.builds, l), angular.forEach(a.buildConfigs, function(e, t) {
a.latestByConfig[t] = a.latestByConfig[t] || null;
});
}
function f() {
var e = _.omitBy(a.latestByConfig, _.isNull);
a.filterWithZeroResults = !s.getLabelSelector().isEmpty() && _.isEmpty(a.buildConfigs) && _.isEmpty(e);
}
a.project = t;
var h = e("isJenkinsPipelineStrategy");
p.push(i.watch(d, n, function(e) {
a.buildsLoaded = !0, a.builds = _.omitBy(e.by("metadata.name"), h), g(), s.addLabelSuggestionsFromResources(a.builds, a.labelSuggestions), c.log("builds (subscribe)", a.builds);
})), p.push(i.watch(m, n, function(e) {
a.unfilteredBuildConfigs = _.omitBy(e.by("metadata.name"), h), s.addLabelSuggestionsFromResources(a.unfilteredBuildConfigs, a.labelSuggestions), s.setLabelSuggestions(a.labelSuggestions), a.buildConfigs = s.getLabelSelector().select(a.unfilteredBuildConfigs), g(), f(), c.log("buildconfigs (subscribe)", a.buildConfigs);
})), s.onActiveFiltersChanged(function(e) {
a.$evalAsync(function() {
a.buildConfigs = e.select(a.unfilteredBuildConfigs), g(), f();
});
}), a.$on("$destroy", function() {
i.unwatchAll(p);
});
}));
} ]), angular.module("openshiftConsole").controller("PipelinesController", [ "$filter", "$routeParams", "$scope", "APIService", "BuildsService", "Constants", "DataService", "Logger", "Navigate", "ProjectsService", function(e, t, n, a, r, o, i, s, c, l) {
n.projectName = t.project, n.alerts = n.alerts || {}, n.buildConfigs = {};
var u = a.getPreferredVersion("builds"), d = a.getPreferredVersion("templates");
n.buildConfigsVersion = a.getPreferredVersion("buildconfigs"), n.buildConfigsInstantiateVersion = a.getPreferredVersion("buildconfigs/instantiate");
var m = [];
l.get(t.project).then(_.spread(function(t, a) {
n.project = t;
var s = {}, l = e("buildConfigForBuild"), p = e("isIncompleteBuild"), g = e("isJenkinsPipelineStrategy"), f = e("isNewerResource"), h = function(e, t) {
if (!p(t)) {
n.statsByConfig[e] || (n.statsByConfig[e] = {
count: 0,
totalDuration: 0
});
var a = n.statsByConfig[e];
a.count++, a.totalDuration += r.getDuration(t), a.avgDuration = _.round(a.totalDuration / a.count);
}
}, v = function() {
var e = {}, t = {};
n.statsByConfig = {}, _.each(s, function(a) {
if (g(a)) {
var r = l(a) || "";
n.buildConfigs[r] || (n.buildConfigs[r] = null), p(a) ? _.set(e, [ r, a.metadata.name ], a) : f(a, t[r]) && (t[r] = a), h(r, a);
}
}), _.each(t, function(t, n) {
_.set(e, [ n, t.metadata.name ], t);
}), n.interestingBuildsByConfig = e;
};
m.push(i.watch(u, a, function(e) {
n.buildsLoaded = !0, s = e.by("metadata.name"), v();
}));
var y = !1;
m.push(i.watch(n.buildConfigsVersion, a, function(e) {
if (n.buildConfigsLoaded = !0, n.buildConfigs = _.pickBy(e.by("metadata.name"), g), _.isEmpty(n.buildConfigs) && !y && (y = !0, o.SAMPLE_PIPELINE_TEMPLATE)) {
var t = o.SAMPLE_PIPELINE_TEMPLATE.name, a = o.SAMPLE_PIPELINE_TEMPLATE.namespace;
i.get(d, t, {
namespace: a
}, {
errorNotification: !1
}).then(function(e) {
n.createSampleURL = c.createFromTemplateURL(e, n.projectName);
});
}
v();
})), n.startBuild = r.startBuild, n.$on("$destroy", function() {
i.unwatchAll(m);
});
}));
} ]), angular.module("openshiftConsole").controller("BuildConfigController", [ "$scope", "$filter", "$routeParams", "APIService", "AuthorizationService", "BuildsService", "ImagesService", "DataService", "LabelFilter", "ModalsService", "NotificationsService", "ProjectsService", "SecretsService", "keyValueEditorUtils", "gettextCatalog", function(e, t, n, a, r, o, i, s, c, l, u, d, m, p, g) {
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
}), e.buildConfigsVersion = a.getPreferredVersion("buildconfigs"), e.buildsVersion = a.getPreferredVersion("builds"), e.buildsLogVersion = a.getPreferredVersion("builds/log"), e.buildConfigsInstantiateVersion = a.getPreferredVersion("buildconfigs/instantiate"), e.eventsVersion = a.getPreferredVersion("events"), e.secretsVersion = a.getPreferredVersion("secrets"), e.emptyMessage = g.getString("Loading..."), e.aceLoaded = function(e) {
var t = e.getSession();
t.setOption("tabSize", 2), t.setOption("useSoftTabs", !0), e.$blockScrolling = 1 / 0;
};
var f = t("buildConfigForBuild"), h = t("buildStrategy"), v = t("orderByDisplayName"), y = t("getErrorDetails"), b = [], S = [], C = [];
e.valueFromObjects = [];
var w = function(t) {
e.updatedBuildConfig = angular.copy(t), e.envVars = h(e.updatedBuildConfig).env || [];
};
e.compareTriggers = function(e, t) {
return _.isNumber(e.value) ? -1 : "ConfigChange" === e.value ? -1 : "ConfigChange" === t.value ? 1 : "ImageChange" === e.value ? -1 : "ImageChange" === t.value ? 1 : e.value.localeCompare(t.value);
}, e.saveEnvVars = function() {
u.hideNotification("save-bc-env-error"), e.envVars = _.filter(e.envVars, "name"), h(e.updatedBuildConfig).env = p.compactEntries(angular.copy(e.envVars)), s.update(e.buildConfigsVersion, n.buildconfig, e.updatedBuildConfig, e.projectContext).then(function() {
u.addNotification({
type: "success",
message: g.getString("Environment variables for build config {{name}} were successfully updated.", {
name: e.buildConfigName
})
}), e.forms.bcEnvVars.$setPristine();
}, function(n) {
u.addNotification({
id: "save-bc-env-error",
type: "error",
message: g.getString("An error occurred updating environment variables for build config {{name}}.", {
name: e.buildConfigName
}),
details: t("getErrorDetails")(n)
});
});
}, e.clearEnvVarUpdates = function() {
w(e.buildConfig), e.forms.bcEnvVars.$setPristine();
};
var P, k = function(n, r) {
e.loaded = !0, e.buildConfig = n, e.buildConfigPaused = o.isPaused(e.buildConfig), e.buildConfig.spec.source.images && (e.imageSources = e.buildConfig.spec.source.images, e.imageSourcesPaths = [], e.imageSources.forEach(function(n) {
e.imageSourcesPaths.push(t("destinationSourcePair")(n.paths));
}));
var c = _.get(h(n), "from", {}), l = c.kind + "/" + c.name + "/" + (c.namespace || e.projectName);
P !== l && (_.includes([ "ImageStreamTag", "ImageStreamImage" ], c.kind) ? (P = l, s.get(a.kindToResource(c.kind), c.name, {
namespace: c.namespace || e.projectName
}, {
errorNotification: !1
}).then(function(t) {
e.BCEnvVarsFromImage = i.getEnvironment(t);
}, function() {
e.BCEnvVarsFromImage = [];
})) : e.BCEnvVarsFromImage = []), w(n), "DELETED" === r && (e.alerts.deleted = {
type: "warning",
message: g.getString("This build configuration has been deleted.")
}, e.buildConfigDeleted = !0), !e.forms.bcEnvVars || e.forms.bcEnvVars.$pristine ? w(n) : e.alerts.background_update = {
type: "warning",
message: g.getString("This build configuration has been updated in the background. Saving your changes may create a conflict or cause loss of data."),
links: [ {
label: g.getString("Reload Environment Variables"),
onClick: function() {
return e.clearEnvVarUpdates(), !0;
}
} ]
}, e.paused = o.isPaused(e.buildConfig);
};
d.get(n.project).then(_.spread(function(a, i) {
function d() {
c.getLabelSelector().isEmpty() || !$.isEmptyObject(e.builds) || $.isEmptyObject(e.unfilteredBuilds) ? delete e.alerts.builds : e.alerts.builds = {
type: "warning",
details: g.getString("The active filters are hiding all builds.")
};
}
e.project = a, e.projectContext = i, s.get(e.buildConfigsVersion, n.buildconfig, i, {
errorNotification: !1
}).then(function(t) {
k(t), b.push(s.watchObject(e.buildConfigsVersion, n.buildconfig, i, k));
}, function(n) {
e.loaded = !0, e.alerts.load = {
type: "error",
message: 404 === n.status ? g.getString("This build configuration can not be found, it may have been deleted.") : g.getString("The build configuration details could not be loaded."),
details: 404 === n.status ? g.getString("Any remaining build history for this build will be shown.") : t("getErrorDetails")(n)
};
}), s.list("configmaps", i, null, {
errorNotification: !1
}).then(function(t) {
S = v(t.by("metadata.name")), e.valueFromObjects = S.concat(C);
}, function(e) {
403 !== e.code && u.addNotification({
id: "build-config-list-config-maps-error",
type: "error",
message: g.getString("Could not load config maps."),
details: y(e)
});
}), r.canI(e.secretsVersion, "list", n.project) && s.list("secrets", i, null, {
errorNotification: !1
}).then(function(t) {
C = v(t.by("metadata.name")), e.webhookSecrets = m.groupSecretsByType(t).webhook, e.valueFromObjects = S.concat(C);
}, function(e) {
403 !== e.code && u.addNotification({
id: "build-config-list-secrets-error",
type: "error",
message: g.getString("Could not load secrets."),
details: y(e)
});
}), b.push(s.watch(e.buildsVersion, i, function(t, a, r) {
if (e.emptyMessage = g.getString("No builds to show"), a) {
if (f(r) === n.buildconfig) {
var i = r.metadata.name;
switch (a) {
case "ADDED":
case "MODIFIED":
e.unfilteredBuilds[i] = r;
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
s.unwatchAll(b);
});
}));
} ]), angular.module("openshiftConsole").controller("BuildController", [ "$scope", "$filter", "$routeParams", "APIService", "BuildsService", "DataService", "ModalsService", "Navigate", "ProjectsService", "gettextCatalog", function(e, t, n, a, r, o, i, s, c, l) {
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
}), e.buildsVersion = a.getPreferredVersion("builds"), e.buildsCloneVersion = a.getPreferredVersion("builds/clone"), e.buildsLogVersion = a.getPreferredVersion("builds/log"), e.buildConfigsVersion = a.getPreferredVersion("buildconfigs"), e.eventsVersion = a.getPreferredVersion("events"), e.podsVersion = a.getPreferredVersion("pods");
var u, d = t("annotation"), m = [], p = function(t) {
e.logCanRun = !_.includes([ "New", "Pending", "Error" ], t.status.phase);
}, g = function() {
e.buildConfig ? e.canBuild = r.canBuild(e.buildConfig) : e.canBuild = !1;
};
c.get(n.project).then(_.spread(function(a, s) {
e.project = a, e.projectContext = s, e.logOptions = {};
var c = function() {
e.eventObjects = u ? [ e.build, u ] : [ e.build ];
}, f = function(t, n) {
e.loaded = !0, e.build = t, p(t), c();
var a = d(t, "buildNumber");
a && e.breadcrumbs[2] && (e.breadcrumbs[2].title = "#" + a), "DELETED" === n && (e.alerts.deleted = {
type: "warning",
message: l.getString("This build has been deleted.")
});
var r;
u || (r = d(t, "buildPod")) && o.get(e.podsVersion, r, s, {
errorNotification: !1
}).then(function(e) {
u = e, c();
});
}, h = function(t, n) {
"DELETED" === n && (e.alerts.deleted = {
type: "warning",
message: l.getString("Build configuration {{name}} has been deleted.", {
name: e.buildConfigName
})
}, e.buildConfigDeleted = !0), e.buildConfig = t, e.buildConfigPaused = r.isPaused(e.buildConfig), g();
};
o.get(e.buildsVersion, n.build, s, {
errorNotification: !1
}).then(function(t) {
f(t), m.push(o.watchObject(e.buildsVersion, n.build, s, f)), m.push(o.watchObject(e.buildConfigsVersion, n.buildconfig, s, h));
}, function(n) {
e.loaded = !0, e.alerts.load = {
type: "error",
message: l.getString("The build details could not be loaded."),
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
o.unwatchAll(m);
});
}));
} ]), angular.module("openshiftConsole").controller("ImageController", [ "$filter", "$scope", "$routeParams", "APIService", "DataService", "ImageStreamsService", "imageLayers", "ProjectsService", "gettextCatalog", function(e, t, n, a, r, o, i, s, c) {
function l(e, a) {
var r = o.tagsByName(e);
t.imageStream = e, t.tagsByName = r, t.tagName = n.tag;
var i = r[n.tag];
i ? (delete t.alerts.load, p(i, a)) : t.alerts.load = {
type: "error",
message: c.getString("The image tag was not found in the stream.")
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
var u = a.getPreferredVersion("imagestreamtags"), d = a.getPreferredVersion("imagestreams"), m = [], p = _.debounce(function(a, o) {
var s = n.imagestream + ":" + n.tag;
r.get(u, s, o).then(function(e) {
t.loaded = !0, t.image = e.image, t.layers = i(t.image);
}, function(n) {
t.loaded = !0, t.alerts.load = {
type: "error",
message: c.getString("The image details could not be loaded."),
details: e("getErrorDetails")(n)
};
});
}, 200), g = function(e, n, a) {
l(e, n), "DELETED" === a && (t.alerts.deleted = {
type: "warning",
message: c.getString("This image stream has been deleted.")
});
};
s.get(n.project).then(_.spread(function(a, o) {
t.project = a, r.get(d, n.imagestream, o, {
errorNotification: !1
}).then(function(e) {
t.loaded = !0, g(e, o), m.push(r.watchObject(d, n.imagestream, o, function(e, t) {
g(e, o, t);
}));
}, function(n) {
t.loaded = !0, t.alerts.load = {
type: "error",
message: c.getString("The image stream details could not be loaded."),
details: e("getErrorDetails")(n)
};
}), t.$on("$destroy", function() {
r.unwatchAll(m);
});
}));
} ]), angular.module("openshiftConsole").controller("ImagesController", [ "$filter", "$routeParams", "$scope", "APIService", "DataService", "LabelFilter", "Logger", "ProjectsService", function(e, t, n, a, r, o, i, s) {
n.projectName = t.project, n.imageStreams = {}, n.missingStatusTagsByImageStream = {}, n.builds = {}, n.labelSuggestions = {}, n.clearFilter = function() {
o.clear();
};
var c, l = a.getPreferredVersion("imagestreams"), u = [];
s.get(t.project).then(_.spread(function(e, t) {
function a() {
_.each(c, function(e) {
var t = n.missingStatusTagsByImageStream[e.metadata.name] = {};
if (e.spec && e.spec.tags) {
var a = {};
e.status && e.status.tags && angular.forEach(e.status.tags, function(e) {
a[e.tag] = !0;
}), angular.forEach(e.spec.tags, function(e) {
a[e.name] || (t[e.name] = e);
});
}
});
}
function s() {
n.filterWithZeroResults = !o.getLabelSelector().isEmpty() && _.isEmpty(n.imageStreams) && !_.isEmpty(c);
}
n.project = e, u.push(r.watch(l, t, function(e) {
n.imageStreamsLoaded = !0, c = _.sortBy(e.by("metadata.name"), "metadata.name"), o.addLabelSuggestionsFromResources(c, n.labelSuggestions), o.setLabelSuggestions(n.labelSuggestions), n.imageStreams = o.getLabelSelector().select(c), a(), s(), i.log("image streams (subscribe)", n.imageStreams);
})), o.onActiveFiltersChanged(function(e) {
n.$evalAsync(function() {
n.imageStreams = e.select(c), s();
});
}), n.$on("$destroy", function() {
r.unwatchAll(u);
});
}));
} ]), angular.module("openshiftConsole").controller("ImageStreamController", [ "$filter", "$routeParams", "$scope", "APIService", "DataService", "ImageStreamsService", "Navigate", "ProjectsService", "gettextCatalog", function(e, t, n, a, r, o, i, s, c) {
n.projectName = t.project, n.imageStream = null, n.tags = [], n.tagShowOlder = {}, n.alerts = {}, n.renderOptions = n.renderOptions || {}, n.renderOptions.hideFilterWidget = !0, n.breadcrumbs = [ {
title: "Image Streams",
link: "project/" + t.project + "/browse/images"
}, {
title: t.imagestream
} ], n.emptyMessage = c.getString("Loading..."), n.imageStreamsVersion = a.getPreferredVersion("imagestreams");
var l = [];
s.get(t.project).then(_.spread(function(a, i) {
n.project = a, r.get(n.imageStreamsVersion, t.imagestream, i, {
errorNotification: !1
}).then(function(e) {
n.loaded = !0, n.imageStream = e, n.emptyMessage = c.getString("No tags to show"), l.push(r.watchObject(n.imageStreamsVersion, t.imagestream, i, function(e, t) {
"DELETED" === t && (n.alerts.deleted = {
type: "warning",
message: c.getString("This image stream has been deleted.")
}), n.imageStream = e, n.tags = _.toArray(o.tagsByName(n.imageStream));
}));
}, function(t) {
n.loaded = !0, n.alerts.load = {
type: "error",
message: c.getString("The image stream details could not be loaded."),
details: e("getErrorDetails")(t)
};
}), n.$on("$destroy", function() {
r.unwatchAll(l);
});
})), n.imagestreamPath = function(e, t) {
if (!t.status) return "";
var n = i.resourceURL(e.metadata.name, "ImageStream", e.metadata.namespace);
return t && (n += "/" + t.name), n;
};
} ]), angular.module("openshiftConsole").controller("DeploymentsController", [ "$scope", "$filter", "$routeParams", "APIService", "DataService", "DeploymentsService", "LabelFilter", "Logger", "OwnerReferencesService", "ProjectsService", "gettextCatalog", function(e, t, n, a, r, o, i, s, c, l, u) {
function d() {
var t = _.isEmpty(e.unfilteredDeploymentConfigs) && _.isEmpty(e.unfilteredReplicationControllers) && _.isEmpty(e.unfilteredDeployments) && _.isEmpty(e.unfilteredReplicaSets), n = !i.getLabelSelector().isEmpty(), a = _.isEmpty(e.deploymentConfigs) && _.isEmpty(e.replicationControllersByDC[""]) && _.isEmpty(e.deployments) && _.isEmpty(e.replicaSets);
e.showEmptyState = t, e.filterWithZeroResults = n && a && !t;
}
e.projectName = n.project, e.replicationControllers = {}, e.unfilteredDeploymentConfigs = {}, e.unfilteredDeployments = {}, e.replicationControllersByDC = {}, e.labelSuggestions = {}, e.emptyMessage = u.getString("Loading..."), e.expandedDeploymentConfigRow = {}, e.unfilteredReplicaSets = {}, e.unfilteredReplicationControllers = {}, e.showEmptyState = !0, e.clearFilter = function() {
i.clear();
};
var m, p, g = t("annotation"), f = a.getPreferredVersion("deployments"), h = a.getPreferredVersion("deploymentconfigs"), v = a.getPreferredVersion("replicationcontrollers"), y = a.getPreferredVersion("replicasets"), b = function() {
m && p && (e.replicaSetsByDeploymentUID = c.groupByControllerUID(m), e.unfilteredReplicaSets = _.get(e, [ "replicaSetsByDeploymentUID", "" ], {}), i.addLabelSuggestionsFromResources(e.unfilteredReplicaSets, e.labelSuggestions), i.setLabelSuggestions(e.labelSuggestions), e.replicaSets = i.getLabelSelector().select(e.unfilteredReplicaSets), e.latestReplicaSetByDeploymentUID = {}, _.each(e.replicaSetsByDeploymentUID, function(t, n) {
n && (e.latestReplicaSetByDeploymentUID[n] = o.getActiveReplicaSet(t, p[n]));
}), d());
}, S = [];
l.get(n.project).then(_.spread(function(n, a) {
e.project = n, S.push(r.watch(v, a, function(n, a, r) {
e.replicationControllers = n.by("metadata.name");
var c, l;
if (r && (c = g(r, "deploymentConfig"), l = r.metadata.name), e.replicationControllersByDC = o.associateDeploymentsToDeploymentConfig(e.replicationControllers, e.deploymentConfigs, !0), e.replicationControllersByDC[""] && (e.unfilteredReplicationControllers = e.replicationControllersByDC[""], i.addLabelSuggestionsFromResources(e.unfilteredReplicationControllers, e.labelSuggestions), i.setLabelSuggestions(e.labelSuggestions), e.replicationControllersByDC[""] = i.getLabelSelector().select(e.replicationControllersByDC[""])), d(), a) {
if ("ADDED" === a || "MODIFIED" === a && [ "New", "Pending", "Running" ].indexOf(t("deploymentStatus")(r)) > -1) e.deploymentConfigDeploymentsInProgress[c] = e.deploymentConfigDeploymentsInProgress[c] || {}, e.deploymentConfigDeploymentsInProgress[c][l] = r; else if ("MODIFIED" === a) {
var u = t("deploymentStatus")(r);
"Complete" !== u && "Failed" !== u || delete e.deploymentConfigDeploymentsInProgress[c][l];
}
} else e.deploymentConfigDeploymentsInProgress = o.associateRunningDeploymentToDeploymentConfig(e.replicationControllersByDC);
r ? "DELETED" !== a && (r.causes = t("deploymentCauses")(r)) : angular.forEach(e.replicationControllers, function(e) {
e.causes = t("deploymentCauses")(e);
}), s.log("replicationControllers (subscribe)", e.replicationControllers);
})), S.push(r.watch(y, a, function(t) {
m = t.by("metadata.name"), b(), s.log("replicasets (subscribe)", e.replicaSets);
})), S.push(r.watch(h, a, function(t) {
e.deploymentConfigsLoaded = !0, e.unfilteredDeploymentConfigs = t.by("metadata.name"), i.addLabelSuggestionsFromResources(e.unfilteredDeploymentConfigs, e.labelSuggestions), i.setLabelSuggestions(e.labelSuggestions), e.deploymentConfigs = i.getLabelSelector().select(e.unfilteredDeploymentConfigs), e.emptyMessage = "No deployment configurations to show", e.replicationControllersByDC = o.associateDeploymentsToDeploymentConfig(e.replicationControllers, e.deploymentConfigs, !0), e.replicationControllersByDC[""] && (e.unfilteredReplicationControllers = e.replicationControllersByDC[""], e.replicationControllersByDC[""] = i.getLabelSelector().select(e.replicationControllersByDC[""])), d(), s.log("deploymentconfigs (subscribe)", e.deploymentConfigs);
})), S.push(r.watch(f, a, function(t) {
p = e.unfilteredDeployments = t.by("metadata.uid"), i.addLabelSuggestionsFromResources(e.unfilteredDeployments, e.labelSuggestions), i.setLabelSuggestions(e.labelSuggestions), e.deployments = i.getLabelSelector().select(e.unfilteredDeployments), b(), s.log("deployments (subscribe)", e.unfilteredDeployments);
})), e.showDeploymentConfigTable = function() {
var t = _.size(e.replicationControllersByDC);
return t > 1 || 1 === t && !e.replicationControllersByDC[""];
}, i.onActiveFiltersChanged(function(t) {
e.$evalAsync(function() {
e.deploymentConfigs = t.select(e.unfilteredDeploymentConfigs), e.replicationControllersByDC = o.associateDeploymentsToDeploymentConfig(e.replicationControllers, e.deploymentConfigs, !0), e.replicationControllersByDC[""] && (e.unfilteredReplicationControllers = e.replicationControllersByDC[""], e.replicationControllersByDC[""] = i.getLabelSelector().select(e.replicationControllersByDC[""])), e.deployments = t.select(e.unfilteredDeployments), e.replicaSets = t.select(e.unfilteredReplicaSets), d();
});
}), e.$on("$destroy", function() {
r.unwatchAll(S);
});
}));
} ]), angular.module("openshiftConsole").controller("DeploymentController", [ "$scope", "$filter", "$routeParams", "APIService", "DataService", "DeploymentsService", "HPAService", "ImageStreamResolver", "LabelFilter", "Logger", "ModalsService", "Navigate", "OwnerReferencesService", "ProjectsService", "StorageService", "gettextCatalog", function(e, t, n, a, r, o, i, s, c, l, u, d, m, p, g, f) {
var h = {};
e.projectName = n.project, e.name = n.deployment, e.replicaSetsForDeployment = {}, e.unfilteredReplicaSetsForDeployment = {}, e.labelSuggestions = {}, e.emptyMessage = f.getString("Loading..."), e.forms = {}, e.alerts = {}, e.imagesByDockerReference = {}, e.breadcrumbs = [ {
title: f.getString("Deployments"),
link: "project/" + n.project + "/browse/deployments"
}, {
title: n.deployment
} ];
var v = a.getPreferredVersion("builds"), y = a.getPreferredVersion("replicasets"), b = a.getPreferredVersion("limitranges"), S = a.getPreferredVersion("imagestreams");
e.deploymentsVersion = a.getPreferredVersion("deployments"), e.eventsVersion = a.getPreferredVersion("events"), e.horizontalPodAutoscalersVersion = a.getPreferredVersion("horizontalpodautoscalers"), e.healthCheckURL = d.healthCheckURL(n.project, "Deployment", n.deployment, e.deploymentsVersion.group);
var C = [];
p.get(n.project).then(_.spread(function(a, d) {
function p() {
c.getLabelSelector().isEmpty() || !_.isEmpty(e.replicaSetsForDeployment) || _.isEmpty(e.unfilteredReplicaSetsForDeployment) ? delete e.alerts["filter-hiding-all"] : e.alerts["filter-hiding-all"] = {
type: "warning",
details: f.getString("The active filters are hiding all rollout history.")
};
}
e.project = a, e.projectContext = d;
var w = {}, P = function() {
i.getHPAWarnings(e.deployment, e.autoscalers, w, a).then(function(t) {
e.hpaWarnings = t;
});
};
r.get(e.deploymentsVersion, n.deployment, d, {
errorNotification: !1
}).then(function(t) {
e.loaded = !0, e.deployment = t, P(), C.push(r.watchObject(e.deploymentsVersion, n.deployment, d, function(t, n) {
"DELETED" === n && (e.alerts.deleted = {
type: "warning",
message: f.getString("This deployment has been deleted.")
}), e.deployment = t, e.updatingPausedState = !1, P(), s.fetchReferencedImageStreamImages([ t.spec.template ], e.imagesByDockerReference, h, d);
})), C.push(r.watch(y, d, function(n) {
e.emptyMessage = f.getString("No deployments to show");
var a = n.by("metadata.name");
a = m.filterForController(a, t), e.inProgressDeployment = _.chain(a).filter("status.replicas").length > 1, e.unfilteredReplicaSetsForDeployment = o.sortByRevision(a), e.replicaSetsForDeployment = c.getLabelSelector().select(e.unfilteredReplicaSetsForDeployment), p(), c.addLabelSuggestionsFromResources(e.unfilteredReplicaSetsForDeployment, e.labelSuggestions), c.setLabelSuggestions(e.labelSuggestions);
}));
}, function(n) {
e.loaded = !0, e.alerts.load = {
type: "error",
message: 404 === n.status ? f.getString("This deployment can not be found, it may have been deleted.") : f.getString("The deployment details could not be loaded."),
details: t("getErrorDetails")(n)
};
}), r.list(b, d).then(function(e) {
w = e.by("metadata.name"), P();
}), C.push(r.watch(S, d, function(t) {
var n = t.by("metadata.name");
s.buildDockerRefMapForImageStreams(n, h), e.deployment && s.fetchReferencedImageStreamImages([ e.deployment.spec.template ], e.imagesByDockerReference, h, d), l.log("imagestreams (subscribe)", e.imageStreams);
})), C.push(r.watch(e.horizontalPodAutoscalersVersion, d, function(t) {
e.autoscalers = i.filterHPA(t.by("metadata.name"), "Deployment", n.deployment), P();
})), C.push(r.watch(v, d, function(t) {
e.builds = t.by("metadata.name"), l.log("builds (subscribe)", e.builds);
})), c.onActiveFiltersChanged(function(t) {
e.$evalAsync(function() {
e.replicaSetsForDeployment = t.select(e.unfilteredReplicaSetsForDeployment), p();
});
}), e.scale = function(n) {
o.scale(e.deployment, n).then(_.noop, function(n) {
e.alerts = e.alerts || {}, e.alerts.scale = {
type: "error",
message: f.getString("An error occurred scaling the deployment."),
details: t("getErrorDetails")(n)
};
});
}, e.setPaused = function(n) {
e.updatingPausedState = !0, o.setPaused(e.deployment, n, d).then(_.noop, function(a) {
e.updatingPausedState = !1, e.alerts = e.alerts || {};
var r = n ? "pausing" : "resuming";
e.alerts.scale = {
type: "error",
message: f.getString("An error occurred {{status}} the deployment.", {
status: r
}),
details: t("getErrorDetails")(a)
};
});
}, e.removeVolume = function(t) {
var n;
n = _.get(e, "deployment.spec.paused") ? f.getString("This will remove the volume from the deployment.") : f.getString("This will remove the volume from the deployment and start a new rollout."), t.persistentVolumeClaim ? n += f.getString(" It will not delete the persistent volume claim.") : t.secret ? n += f.getString(" It will not delete the secret.") : t.configMap && (n += f.getString(" It will not delete the config map."));
u.confirm({
title: f.getString("Remove volume {{name}}?", {
name: t.name
}),
details: n,
okButtonText: f.getString("Remove"),
okButtonClass: "btn-danger",
cancelButtonText: f.getString("Cancel")
}).then(function() {
g.removeVolume(e.deployment, t, d);
});
}, e.$on("$destroy", function() {
r.unwatchAll(C);
});
}));
} ]), angular.module("openshiftConsole").controller("DeploymentConfigController", [ "$scope", "$filter", "$routeParams", "APIService", "BreadcrumbsService", "DataService", "DeploymentsService", "HPAService", "ImageStreamResolver", "ModalsService", "Navigate", "NotificationsService", "Logger", "ProjectsService", "StorageService", "LabelFilter", "labelNameFilter", "gettextCatalog", function(e, t, n, a, r, o, i, s, c, l, u, d, m, p, g, f, h, v) {
var y = {};
e.projectName = n.project, e.deploymentConfigName = n.deploymentconfig, e.deploymentConfig = null, e.deployments = {}, e.unfilteredDeployments = {}, e.imagesByDockerReference = {}, e.builds = {}, e.labelSuggestions = {}, e.forms = {}, e.alerts = {}, e.breadcrumbs = r.getBreadcrumbs({
name: n.deploymentconfig,
kind: "DeploymentConfig",
namespace: n.project
}), e.emptyMessage = v.getString("Loading..."), e.deploymentConfigsInstantiateVersion = a.getPreferredVersion("deploymentconfigs/instantiate"), e.deploymentConfigsVersion = a.getPreferredVersion("deploymentconfigs"), e.eventsVersion = a.getPreferredVersion("events"), e.horizontalPodAutoscalersVersion = a.getPreferredVersion("horizontalpodautoscalers");
var b = a.getPreferredVersion("builds"), S = a.getPreferredVersion("imagestreams"), C = a.getPreferredVersion("limitranges"), w = a.getPreferredVersion("replicationcontrollers");
e.healthCheckURL = u.healthCheckURL(n.project, "DeploymentConfig", n.deploymentconfig, e.deploymentConfigsVersion.group);
var P = t("mostRecent"), k = t("orderObjectsByDate"), j = [];
p.get(n.project).then(_.spread(function(a, r) {
function u() {
f.getLabelSelector().isEmpty() || !$.isEmptyObject(e.deployments) || $.isEmptyObject(e.unfilteredDeployments) ? delete e.alerts.deployments : e.alerts.deployments = {
type: "warning",
details: v.getString("The active filters are hiding all deployments.")
};
}
e.project = a, e.projectContext = r;
var d = {}, p = function() {
s.getHPAWarnings(e.deploymentConfig, e.autoscalers, d, a).then(function(t) {
e.hpaWarnings = t;
});
};
o.get(e.deploymentConfigsVersion, n.deploymentconfig, r, {
errorNotification: !1
}).then(function(a) {
e.loaded = !0, e.deploymentConfig = a, e.strategyParams = t("deploymentStrategyParams")(a), p(), j.push(o.watchObject(e.deploymentConfigsVersion, n.deploymentconfig, r, function(t, n) {
"DELETED" === n && (e.alerts.deleted = {
type: "warning",
message: v.getString("This deployment configuration has been deleted.")
}), e.deploymentConfig = t, e.updatingPausedState = !1, p(), c.fetchReferencedImageStreamImages([ t.spec.template ], e.imagesByDockerReference, y, r);
}));
}, function(n) {
e.loaded = !0, e.alerts.load = {
type: "error",
message: 404 === n.status ? v.getString("This deployment configuration can not be found, it may have been deleted.") : v.getString("The deployment configuration details could not be loaded."),
details: 404 === n.status ? v.getString("Any remaining deployment history for this deployment will be shown.") : t("getErrorDetails")(n)
};
}), j.push(o.watch(w, r, function(a, r, o) {
var s = n.deploymentconfig;
if (e.emptyMessage = v.getString("No deployments to show"), r) {
if (i.deploymentBelongsToConfig(o, n.deploymentconfig)) {
var c = o.metadata.name;
switch (r) {
case "ADDED":
case "MODIFIED":
e.unfilteredDeployments[c] = o, t("deploymentIsInProgress")(o) ? (e.deploymentConfigDeploymentsInProgress[s] = e.deploymentConfigDeploymentsInProgress[s] || {}, e.deploymentConfigDeploymentsInProgress[s][c] = o) : e.deploymentConfigDeploymentsInProgress[s] && delete e.deploymentConfigDeploymentsInProgress[s][c], o.causes = t("deploymentCauses")(o);
break;

case "DELETED":
delete e.unfilteredDeployments[c], e.deploymentConfigDeploymentsInProgress[s] && delete e.deploymentConfigDeploymentsInProgress[s][c];
}
}
} else {
var l = i.associateDeploymentsToDeploymentConfig(a.by("metadata.name"));
e.unfilteredDeployments = l[n.deploymentconfig] || {}, angular.forEach(e.unfilteredDeployments, function(e) {
e.causes = t("deploymentCauses")(e);
}), e.deploymentConfigDeploymentsInProgress = i.associateRunningDeploymentToDeploymentConfig(l);
}
e.deployments = f.getLabelSelector().select(e.unfilteredDeployments), e.orderedDeployments = k(e.deployments, !0), e.deploymentInProgress = !!_.size(e.deploymentConfigDeploymentsInProgress[s]), e.mostRecent = P(e.unfilteredDeployments), u(), f.addLabelSuggestionsFromResources(e.unfilteredDeployments, e.labelSuggestions), f.setLabelSuggestions(e.labelSuggestions);
}, {
http: {
params: {
labelSelector: h("deploymentConfig") + "=" + e.deploymentConfigName
}
}
})), o.list(C, r).then(function(e) {
d = e.by("metadata.name"), p();
}), j.push(o.watch(S, r, function(t) {
var n = t.by("metadata.name");
c.buildDockerRefMapForImageStreams(n, y), e.deploymentConfig && c.fetchReferencedImageStreamImages([ e.deploymentConfig.spec.template ], e.imagesByDockerReference, y, r), m.log("imagestreams (subscribe)", e.imageStreams);
})), j.push(o.watch(b, r, function(t) {
e.builds = t.by("metadata.name"), m.log("builds (subscribe)", e.builds);
})), j.push(o.watch(e.horizontalPodAutoscalersVersion, r, function(t) {
e.autoscalers = s.filterHPA(t.by("metadata.name"), "DeploymentConfig", n.deploymentconfig), p();
})), f.onActiveFiltersChanged(function(t) {
e.$apply(function() {
e.deployments = t.select(e.unfilteredDeployments), e.orderedDeployments = k(e.deployments, !0), u();
});
}), e.canDeploy = function() {
return !!e.deploymentConfig && (!e.deploymentConfig.metadata.deletionTimestamp && (!e.deploymentInProgress && !e.deploymentConfig.spec.paused));
}, e.startLatestDeployment = function() {
e.canDeploy() && i.startLatestDeployment(e.deploymentConfig, r);
}, e.scale = function(n) {
i.scale(e.deploymentConfig, n).then(_.noop, function(n) {
e.alerts["scale-error"] = {
type: "error",
message: v.getString("An error occurred scaling the deployment config."),
details: t("getErrorDetails")(n)
};
});
}, e.setPaused = function(n) {
e.updatingPausedState = !0, i.setPaused(e.deploymentConfig, n, r).then(_.noop, function(a) {
e.updatingPausedState = !1;
var r = n ? "pausing" : "resuming";
e.alerts["pause-error"] = {
type: "error",
message: v.getString("An error occurred {{status}} the deployment config.", {
status: r
}),
details: t("getErrorDetails")(a)
};
});
};
var I = function() {
if (_.get(e, "deploymentConfig.spec.paused")) return !1;
var t = _.get(e, "deploymentConfig.spec.triggers", []);
return _.some(t, {
type: "ConfigChange"
});
};
e.removeVolume = function(t) {
var n;
n = I() ? v.getString("This will remove the volume from the deployment config and trigger a new deployment.") : v.getString("This will remove the volume from the deployment config."), t.persistentVolumeClaim ? n += v.getString(" It will not delete the persistent volume claim.") : t.secret ? n += v.getString(" It will not delete the secret.") : t.configMap && (n += v.getString(" It will not delete the config map."));
l.confirm({
title: v.getString("Remove volume {{name}}?", {
name: t.name
}),
details: n,
okButtonText: v.getString("Remove"),
okButtonClass: "btn-danger",
cancelButtonText: v.getString("Cancel")
}).then(function() {
g.removeVolume(e.deploymentConfig, t, r);
});
}, e.$on("$destroy", function() {
o.unwatchAll(j);
});
}));
} ]), angular.module("openshiftConsole").controller("ReplicaSetController", [ "$scope", "$filter", "$routeParams", "APIService", "AuthorizationService", "BreadcrumbsService", "DataService", "DeploymentsService", "HPAService", "ImageStreamResolver", "keyValueEditorUtils", "kind", "Logger", "MetricsService", "ModalsService", "Navigate", "OwnerReferencesService", "PodsService", "ProjectsService", "StorageService", "gettextCatalog", function(e, t, n, a, r, o, i, s, c, l, u, d, m, p, g, f, h, v, y, b, S) {
var C = !1, w = t("annotation"), P = t("humanizeKind")(d), k = t("hasDeployment"), j = a.getPreferredVersion("builds"), I = a.getPreferredVersion("imagestreams"), T = a.getPreferredVersion("horizontalpodautoscalers"), R = a.getPreferredVersion("limitranges"), N = a.getPreferredVersion("pods"), A = a.getPreferredVersion("replicasets"), E = a.getPreferredVersion("replicationcontrollers"), D = a.getPreferredVersion("resourcequotas"), $ = a.getPreferredVersion("appliedclusterresourcequotas");
switch (d) {
case "ReplicaSet":
e.resource = A, e.healthCheckURL = f.healthCheckURL(n.project, "ReplicaSet", n.replicaSet, "extensions");
break;

case "ReplicationController":
e.resource = E, e.healthCheckURL = f.healthCheckURL(n.project, "ReplicationController", n.replicaSet);
}
var B = {};
e.projectName = n.project, e.kind = d, e.replicaSet = null, e.deploymentConfig = null, e.deploymentConfigMissing = !1, e.imagesByDockerReference = {}, e.builds = {}, e.alerts = {}, e.renderOptions = e.renderOptions || {}, e.renderOptions.hideFilterWidget = !0, e.forms = {}, e.logOptions = {}, e.deploymentsVersion = a.getPreferredVersion("deployments"), e.deploymentConfigsVersion = a.getPreferredVersion("deploymentconfigs"), e.eventsVersion = a.getPreferredVersion("events"), e.deploymentConfigsLogVersion = "deploymentconfigs/log";
var L = [];
p.isAvailable().then(function(t) {
e.metricsAvailable = t;
});
var V = t("deploymentStatus"), O = function(t) {
e.logCanRun = !_.includes([ "New", "Pending" ], V(t));
}, U = t("isIE")();
y.get(n.project).then(_.spread(function(a, u) {
e.project = a, e.projectContext = u;
var p = {}, y = function() {
if (e.hpaForRS = c.filterHPA(p, d, n.replicaSet), e.deploymentConfigName && e.isActive) {
var t = c.filterHPA(p, "DeploymentConfig", e.deploymentConfigName);
e.autoscalers = e.hpaForRS.concat(t);
} else if (e.deployment && e.isActive) {
var a = c.filterHPA(p, "Deployment", e.deployment.metadata.name);
e.autoscalers = e.hpaForRS.concat(a);
} else e.autoscalers = e.hpaForRS;
}, E = function() {
L.push(i.watch(e.resource, u, function(t) {
var n, a = [];
angular.forEach(t.by("metadata.name"), function(t) {
(w(t, "deploymentConfig") || "") === e.deploymentConfigName && a.push(t);
}), n = s.getActiveDeployment(a), e.isActive = n && n.metadata.uid === e.replicaSet.metadata.uid, y();
}));
}, x = function() {
c.getHPAWarnings(e.replicaSet, e.autoscalers, e.limitRanges, a).then(function(t) {
e.hpaWarnings = t;
});
}, F = function(a) {
var r = w(a, "deploymentConfig");
if (r) {
C = !0, e.deploymentConfigName = r;
var o = w(a, "deploymentVersion");
o && (e.logOptions.version = o), e.healthCheckURL = f.healthCheckURL(n.project, "DeploymentConfig", r), i.get(e.deploymentConfigsVersion, r, u, {
errorNotification: !1
}).then(function(t) {
e.deploymentConfig = t;
}, function(n) {
404 !== n.status ? e.alerts.load = {
type: "error",
message: S.getString("The deployment configuration details could not be loaded."),
details: t("getErrorDetails")(n)
} : e.deploymentConfigMissing = !0;
});
}
}, M = function() {
e.isActive = s.isActiveReplicaSet(e.replicaSet, e.deployment);
}, q = function(t) {
return _.some(t, function(t) {
if (_.get(t, "status.replicas") && _.get(t, "metadata.uid") !== _.get(e.replicaSet, "metadata.uid")) {
var n = h.getControllerReferences(t);
return _.some(n, {
uid: e.deployment.metadata.uid
});
}
});
}, z = !1, H = function() {
var t = h.getControllerReferences(e.replicaSet), a = _.find(t, {
kind: "Deployment"
});
a && i.get(e.deploymentsVersion, a.name, u).then(function(t) {
e.deployment = t, e.healthCheckURL = f.healthCheckURL(n.project, "Deployment", t.metadata.name, "apps"), L.push(i.watchObject(e.deploymentsVersion, t.metadata.name, u, function(t, a) {
if ("DELETED" === a) return e.alerts["deployment-deleted"] = {
type: "warning",
message: S.getString("The deployment controlling this replica set has been deleted.")
}, e.healthCheckURL = f.healthCheckURL(n.project, "ReplicaSet", n.replicaSet, "extensions"), e.deploymentMissing = !0, void delete e.deployment;
e.deployment = t, e.breadcrumbs = o.getBreadcrumbs({
object: e.replicaSet,
displayName: "#" + s.getRevision(e.replicaSet),
parent: {
title: e.deployment.metadata.name,
link: f.resourceURL(e.deployment)
},
humanizedKind: "Deployments"
}), M(), y();
})), L.push(i.watch(A, u, function(e) {
var t = e.by("metadata.name");
z = q(t);
}));
});
}, G = function() {
if (!_.isEmpty(B)) {
var t = _.get(e, "replicaSet.spec.template");
t && l.fetchReferencedImageStreamImages([ t ], e.imagesByDockerReference, B, u);
}
};
i.get(e.resource, n.replicaSet, u, {
errorNotification: !1
}).then(function(t) {
switch (e.loaded = !0, e.replicaSet = t, O(t), d) {
case "ReplicationController":
F(t);
break;

case "ReplicaSet":
H();
}
x(), e.breadcrumbs = o.getBreadcrumbs({
object: t
}), L.push(i.watchObject(e.resource, n.replicaSet, u, function(t, n) {
"DELETED" === n && (e.alerts.deleted = {
type: "warning",
message: S.getString("This {{displayKind}} has been deleted.", {
displayKind: P
})
}), e.replicaSet = t, O(t), x(), G(), e.deployment && M();
})), e.deploymentConfigName && E(), L.push(i.watch(N, u, function(t) {
var n = t.by("metadata.name");
e.podsForDeployment = v.filterForOwner(n, e.replicaSet);
}));
}, function(a) {
e.loaded = !0, e.alerts.load = {
type: "error",
message: S.getString("The {{displayKind}} details could not be loaded.", {
displayKind: P
}),
details: t("getErrorDetails")(a)
}, e.breadcrumbs = o.getBreadcrumbs({
name: n.replicaSet,
kind: d,
namespace: n.project
});
}), L.push(i.watch(e.resource, u, function(n, a, r) {
e.replicaSets = n.by("metadata.name"), "ReplicationController" === d && (e.deploymentsByDeploymentConfig = s.associateDeploymentsToDeploymentConfig(e.replicaSets));
var o, i;
r && (o = w(r, "deploymentConfig"), i = r.metadata.name), e.deploymentConfigDeploymentsInProgress = e.deploymentConfigDeploymentsInProgress || {}, a ? "ADDED" === a || "MODIFIED" === a && t("deploymentIsInProgress")(r) ? (e.deploymentConfigDeploymentsInProgress[o] = e.deploymentConfigDeploymentsInProgress[o] || {}, e.deploymentConfigDeploymentsInProgress[o][i] = r) : "MODIFIED" === a && e.deploymentConfigDeploymentsInProgress[o] && delete e.deploymentConfigDeploymentsInProgress[o][i] : e.deploymentConfigDeploymentsInProgress = s.associateRunningDeploymentToDeploymentConfig(e.deploymentsByDeploymentConfig), r ? "DELETED" !== a && (r.causes = t("deploymentCauses")(r)) : angular.forEach(e.replicaSets, function(e) {
e.causes = t("deploymentCauses")(e);
});
})), L.push(i.watch(I, u, function(e) {
var t = e.by("metadata.name");
l.buildDockerRefMapForImageStreams(t, B), G(), m.log("imagestreams (subscribe)", t);
})), L.push(i.watch(j, u, function(t) {
e.builds = t.by("metadata.name"), m.log("builds (subscribe)", e.builds);
})), L.push(i.watch(T, u, function(e) {
p = e.by("metadata.name"), y(), x();
}, {
poll: U,
pollInterval: 6e4
})), i.list(R, u).then(function(t) {
e.limitRanges = t.by("metadata.name"), x();
});
L.push(i.watch(D, u, function(t) {
e.quotas = t.by("metadata.name");
}, {
poll: !0,
pollInterval: 6e4
})), L.push(i.watch($, u, function(t) {
e.clusterQuotas = t.by("metadata.name");
}, {
poll: !0,
pollInterval: 6e4
}));
var K = t("deploymentIsLatest");
e.showRollbackAction = function() {
return "Complete" === V(e.replicaSet) && !K(e.replicaSet, e.deploymentConfig) && !e.replicaSet.metadata.deletionTimestamp && r.canI("deploymentconfigrollbacks", "create");
}, e.retryFailedDeployment = function(t) {
s.retryFailedDeployment(t, u, e);
}, e.rollbackToDeployment = function(t, n, a, r) {
s.rollbackToDeployment(t, n, a, r, u, e);
}, e.cancelRunningDeployment = function(e) {
s.cancelRunningDeployment(e, u);
}, e.scale = function(n) {
var a = e.deployment || e.deploymentConfig || e.replicaSet;
s.scale(a, n).then(_.noop, function(n) {
e.alerts = e.alerts || {}, e.alerts.scale = {
type: "error",
message: S.getString("An error occurred scaling."),
details: t("getErrorDetails")(n)
};
});
};
var W = t("hasDeploymentConfig");
e.isScalable = function() {
return !!_.isEmpty(e.autoscalers) && (!W(e.replicaSet) && !k(e.replicaSet) || (!(!e.deploymentConfigMissing && !e.deploymentMissing) || !(!e.deploymentConfig && !e.deployment) && (e.isActive && !z)));
}, e.removeVolume = function(n) {
var a = S.getString("This will remove the volume from the {{kind}}.", {
kind: t("humanizeKind")(e.replicaSet.kind)
});
n.persistentVolumeClaim ? a += S.getString(" It will not delete the persistent volume claim.") : n.secret ? a += S.getString(" It will not delete the secret.") : n.configMap && (a += S.getString(" It will not delete the config map."));
g.confirm({
title: S.getString("Remove volume{{name}}?", {
name: n.name
}),
details: a,
okButtonText: S.getString("Remove"),
okButtonClass: "btn-danger",
cancelButtonText: S.getString("Cancel")
}).then(function() {
b.removeVolume(e.replicaSet, n, u);
});
}, e.$on("$destroy", function() {
i.unwatchAll(L);
});
}));
} ]), angular.module("openshiftConsole").controller("StatefulSetsController", [ "$scope", "$routeParams", "APIService", "DataService", "ProjectsService", "LabelFilter", "PodsService", function(e, t, n, a, r, o, i) {
e.projectName = t.project, e.labelSuggestions = {}, e.clearFilter = function() {
o.clear();
};
var s = n.getPreferredVersion("pods"), c = n.getPreferredVersion("statefulsets"), l = [];
r.get(t.project).then(_.spread(function(t, n) {
function r() {
e.filterWithZeroResults = !o.getLabelSelector().isEmpty() && _.isEmpty(e.statefulSets) && !_.isEmpty(e.unfilteredStatefulSets);
}
e.project = t, l.push(a.watch(c, n, function(t) {
angular.extend(e, {
loaded: !0,
unfilteredStatefulSets: t.by("metadata.name")
}), e.statefulSets = o.getLabelSelector().select(e.unfilteredStatefulSets), o.addLabelSuggestionsFromResources(e.unfilteredStatefulSets, e.labelSuggestions), o.setLabelSuggestions(e.labelSuggestions), r();
})), l.push(a.watch(s, n, function(t) {
e.pods = t.by("metadata.name"), e.podsByOwnerUID = i.groupByOwnerUID(e.pods);
})), o.onActiveFiltersChanged(function(t) {
e.$evalAsync(function() {
e.statefulSets = t.select(e.unfilteredStatefulSets), r();
});
}), e.$on("$destroy", function() {
a.unwatchAll(l);
});
}));
} ]), angular.module("openshiftConsole").controller("StatefulSetController", [ "$filter", "$scope", "$routeParams", "APIService", "BreadcrumbsService", "DataService", "MetricsService", "ProjectsService", "PodsService", "gettextCatalog", function(e, t, n, a, r, o, i, s, c, l) {
t.projectName = n.project, t.statefulSetName = n.statefulset, t.forms = {}, t.alerts = {}, t.breadcrumbs = r.getBreadcrumbs({
name: t.statefulSetName,
kind: "StatefulSet",
namespace: n.project
});
var u = a.getPreferredVersion("pods"), d = a.getPreferredVersion("resourcequotas"), m = a.getPreferredVersion("appliedclusterresourcequotas");
t.statefulSetsVersion = a.getPreferredVersion("statefulsets");
var p, g = [];
i.isAvailable().then(function(e) {
t.metricsAvailable = e;
}), s.get(n.project).then(_.spread(function(n, a) {
p = a, o.get(t.statefulSetsVersion, t.statefulSetName, a, {
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
}), g.push(o.watchObject(t.statefulSetsVersion, t.statefulSetName, a, function(e) {
t.statefulSet = e;
})), g.push(o.watch(u, a, function(n) {
var a = n.by("metadata.name");
t.podsForStatefulSet = c.filterForOwner(a, e);
}));
g.push(o.watch(d, a, function(e) {
t.quotas = e.by("metadata.name");
}, {
poll: !0,
pollInterval: 6e4
})), g.push(o.watch(m, a, function(e) {
t.clusterQuotas = e.by("metadata.name");
}, {
poll: !0,
pollInterval: 6e4
}));
}, function(n) {
t.loaded = !0, t.alerts.load = {
type: "error",
message: l.getString("The stateful set details could not be loaded."),
details: e("getErrorDetails")(n)
};
});
})), t.$on("$destroy", function() {
o.unwatchAll(g);
});
} ]), angular.module("openshiftConsole").controller("ServicesController", [ "$filter", "$routeParams", "$scope", "APIService", "DataService", "ProjectsService", "LabelFilter", "Logger", function(e, t, n, a, r, o, i, s) {
n.projectName = t.project, n.services = {}, n.unfilteredServices = {}, n.routesByService = {}, n.routes = {}, n.labelSuggestions = {}, n.clearFilter = function() {
i.clear();
};
var c = a.getPreferredVersion("services"), l = [];
o.get(t.project).then(_.spread(function(e, t) {
function a() {
n.filterWithZeroResults = !i.getLabelSelector().isEmpty() && _.isEmpty(n.services) && !_.isEmpty(n.unfilteredServices);
}
n.project = e, l.push(r.watch(c, t, function(e) {
n.servicesLoaded = !0, n.unfilteredServices = e.by("metadata.name"), i.addLabelSuggestionsFromResources(n.unfilteredServices, n.labelSuggestions), i.setLabelSuggestions(n.labelSuggestions), n.services = i.getLabelSelector().select(n.unfilteredServices), a(), s.log("services (subscribe)", n.unfilteredServices);
})), i.onActiveFiltersChanged(function(e) {
n.$evalAsync(function() {
n.services = e.select(n.unfilteredServices), a();
});
}), n.$on("$destroy", function() {
r.unwatchAll(l);
});
}));
} ]), angular.module("openshiftConsole").controller("ServiceController", [ "$scope", "$routeParams", "APIService", "DataService", "Logger", "ProjectsService", "$filter", "gettextCatalog", function(e, t, n, a, r, o, i, s) {
e.projectName = t.project, e.service = null, e.services = null, e.alerts = {}, e.renderOptions = e.renderOptions || {}, e.renderOptions.hideFilterWidget = !0, e.breadcrumbs = [ {
title: "Services",
link: "project/" + t.project + "/browse/services"
}, {
title: t.service
} ], e.podFailureReasons = {
Pending: s.getString("This pod will not receive traffic until all of its containers have been created.")
};
var c = n.getPreferredVersion("pods"), l = n.getPreferredVersion("endpoints");
e.eventsVersion = n.getPreferredVersion("events"), e.routesVersion = n.getPreferredVersion("routes"), e.servicesVersion = n.getPreferredVersion("services");
var u = {}, d = [], m = function() {
e.service && (e.portsByRoute = {}, _.each(e.service.spec.ports, function(t) {
var n = !1;
t.nodePort && (e.showNodePorts = !0), _.each(e.routesForService, function(a) {
a.spec.port && a.spec.port.targetPort !== t.name && a.spec.port.targetPort !== t.targetPort || (e.portsByRoute[a.metadata.name] = e.portsByRoute[a.metadata.name] || [], e.portsByRoute[a.metadata.name].push(t), n = !0);
}), n || (e.portsByRoute[""] = e.portsByRoute[""] || [], e.portsByRoute[""].push(t));
}));
}, p = function() {
if (e.podsForService = {}, e.service) {
var t = new LabelSelector(e.service.spec.selector);
e.podsForService = t.select(u);
}
}, g = function(t, n) {
e.loaded = !0, e.service = t, p(), m(), "DELETED" === n && (e.alerts.deleted = {
type: "warning",
message: s.getString("This service has been deleted.")
});
};
o.get(t.project).then(_.spread(function(n, o) {
e.project = n, e.projectContext = o, a.get(e.servicesVersion, t.service, o, {
errorNotification: !1
}).then(function(n) {
g(n), d.push(a.watchObject(e.servicesVersion, t.service, o, g));
}, function(t) {
e.loaded = !0, e.alerts.load = {
type: "error",
message: s.getString("The service details could not be loaded."),
details: i("getErrorDetails")(t)
};
}), d.push(a.watch(e.servicesVersion, o, function(t) {
e.services = t.by("metadata.name");
})), d.push(a.watch(c, o, function(e) {
u = e.by("metadata.name"), p();
})), d.push(a.watch(l, o, function(n) {
e.podsWithEndpoints = {};
var a = n.by("metadata.name")[t.service];
a && _.each(a.subsets, function(t) {
_.each(t.addresses, function(t) {
"Pod" === _.get(t, "targetRef.kind") && (e.podsWithEndpoints[t.targetRef.name] = !0);
});
});
})), d.push(a.watch(e.routesVersion, o, function(n) {
e.routesForService = {}, angular.forEach(n.by("metadata.name"), function(n) {
"Service" === n.spec.to.kind && n.spec.to.name === t.service && (e.routesForService[n.metadata.name] = n);
}), m(), r.log("routes (subscribe)", e.routesForService);
})), e.$on("$destroy", function() {
a.unwatchAll(d);
});
}));
} ]), angular.module("openshiftConsole").controller("ServiceInstancesController", [ "$scope", "$filter", "$routeParams", "APIService", "BindingService", "Constants", "DataService", "LabelFilter", "Logger", "ProjectsService", function(e, t, n, a, r, o, i, s, c, l) {
e.bindingsByInstanceRef = {}, e.labelSuggestions = {}, e.projectName = n.project, e.serviceClasses = {}, e.serviceInstances = {}, e.unfilteredServiceInstances = {}, e.clearFilter = function() {
s.clear();
};
var u = a.getPreferredVersion("servicebindings"), d = a.getPreferredVersion("clusterserviceclasses");
e.serviceInstancesVersion = a.getPreferredVersion("serviceinstances");
var m = [], p = function() {
e.serviceInstances = s.getLabelSelector().select(e.unfilteredServiceInstances);
}, g = function() {
e.unfilteredServiceInstances = r.sortServiceInstances(e.unfilteredServiceInstances, e.serviceClasses);
};
e.getServiceClass = function(t) {
var n = _.get(t, "spec.clusterServiceClassRef.name");
return _.get(e, [ "serviceClasses", n ]);
}, l.get(n.project).then(_.spread(function(t, n) {
function a() {
e.filterWithZeroResults = !s.getLabelSelector().isEmpty() && _.isEmpty(e.serviceInstances) && !_.isEmpty(e.unfilteredServiceInstances);
}
e.project = t, e.projectContext = n, m.push(i.watch(u, n, function(t) {
var n = t.by("metadata.name");
e.bindingsByInstanceRef = _.groupBy(n, "spec.instanceRef.name");
})), m.push(i.watch(e.serviceInstancesVersion, n, function(t) {
e.serviceInstancesLoaded = !0, e.unfilteredServiceInstances = t.by("metadata.name"), g(), p(), a(), s.addLabelSuggestionsFromResources(e.unfilteredServiceInstances, e.labelSuggestions), s.setLabelSuggestions(e.labelSuggestions), c.log("provisioned services (subscribe)", e.unfilteredServiceInstances);
})), i.list(d, {}, function(t) {
e.serviceClasses = t.by("metadata.name"), g(), p();
}), s.onActiveFiltersChanged(function(t) {
e.$evalAsync(function() {
e.serviceInstances = t.select(e.unfilteredServiceInstances), a();
});
}), e.$on("$destroy", function() {
i.unwatchAll(m);
});
}));
} ]), angular.module("openshiftConsole").controller("ServiceInstanceController", [ "$scope", "$filter", "$routeParams", "APIService", "BindingService", "AuthorizationService", "Catalog", "DataService", "Logger", "ProjectsService", "SecretsService", "ServiceInstancesService", "gettextCatalog", function(e, t, n, a, r, o, i, s, c, l, u, d, m) {
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
var p = a.getPreferredVersion("servicebindings");
e.eventsVersion = a.getPreferredVersion("events"), e.serviceInstancesVersion = a.getPreferredVersion("serviceinstances");
var g, f, h = [], v = [], y = t("serviceInstanceDisplayName"), b = t("isServiceInstanceFailed"), S = function() {
e.breadcrumbs.push({
title: e.displayName
});
}, C = function() {
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
var a = JSON.parse(u.decodeSecretData(n.data)[t.secretKeyRef.key]);
_.extend(e.parameterData, a);
} catch (e) {
c.warn(m.getString("Unable to load parameters from secret ") + _.get(t, "secretKeyRef.name"), e);
}
}));
});
}
}, w = function() {
if (e.plan && e.serviceClass && e.serviceInstance) {
var t = _.get(e.plan, "spec.instanceUpdateParameterSchema"), n = _.size(_.get(t, "properties")) > 0 || _.get(e.serviceClass, "spec.planUpdatable") && _.size(e.servicePlans) > 1;
e.editAvailable = n && !b(e.serviceInstance) && !_.get(e.serviceInstance, "status.asyncOpInProgress") && !_.get(e.serviceInstance, "metadata.deletionTimestamp");
}
}, P = function() {
e.parameterFormDefinition = angular.copy(_.get(e.plan, "spec.externalMetadata.schemas.service_instance.update.openshift_form_definition")), e.parameterSchema = _.get(e.plan, "spec.instanceCreateParameterSchema"), C();
}, k = function() {
var t = _.get(e.serviceInstance, "spec.clusterServicePlanRef.name");
e.plan = _.find(e.servicePlans, {
metadata: {
name: t
}
}), P(), w();
}, j = function() {
e.serviceClass && !f && (e.servicePlans ? k() : f = i.getServicePlansForServiceClass(e.serviceClass).then(function(t) {
var n = _.get(e.serviceInstance, "spec.clusterServicePlanRef.name");
e.servicePlans = _.reject(t.by("metadata.name"), function(e) {
return _.get(e, "status.removedFromBrokerCatalog") && e.metadata.name !== n;
}), k(), f = null;
}));
}, I = function() {
e.serviceInstance && !g && (e.serviceClass ? j() : g = d.fetchServiceClassForInstance(e.serviceInstance).then(function(t) {
e.serviceClass = t, e.displayName = y(e.serviceInstance, e.serviceClass), S(), g = null, j();
}));
}, T = function(t, n) {
e.loaded = !0, e.serviceInstance = t, "DELETED" === n && (e.alerts.deleted = {
type: "warning",
message: m.getString("This provisioned service has been deleted.")
}), I(), C(), w();
};
l.get(n.project).then(_.spread(function(a, o) {
e.project = a, e.projectContext = o, s.get(e.serviceInstancesVersion, n.instance, o, {
errorNotification: !1
}).then(function(t) {
T(t), h.push(s.watchObject(e.serviceInstancesVersion, n.instance, o, T)), h.push(s.watch(p, o, function(n) {
var a = n.by("metadata.name");
e.bindings = r.getBindingsForResource(a, t);
}));
}, function(n) {
e.loaded = !0, e.alerts.load = {
type: "error",
message: m.getString("The provisioned service details could not be loaded."),
details: t("getErrorDetails")(n)
};
});
}, function(n) {
e.loaded = !0, e.alerts.load = {
type: "error",
message: m.getString("The service details could not be loaded."),
details: t("getErrorDetails")(n)
};
})), e.$on("$destroy", function() {
s.unwatchAll(h), s.unwatchAll(v);
});
} ]), angular.module("openshiftConsole").controller("SecretsController", [ "$routeParams", "$scope", "APIService", "DataService", "LabelFilter", "ProjectsService", function(e, t, n, a, r, o) {
t.projectName = e.project, t.labelSuggestions = {}, t.clearFilter = function() {
r.clear();
}, t.secretsVersion = n.getPreferredVersion("secrets");
var i = [];
o.get(e.project).then(_.spread(function(e, n) {
function o() {
t.filterWithZeroResults = !r.getLabelSelector().isEmpty() && _.isEmpty(t.secrets) && !_.isEmpty(t.unfilteredSecrets);
}
t.project = e, t.context = n, i.push(a.watch(t.secretsVersion, n, function(e) {
t.unfilteredSecrets = _.sortBy(e.by("metadata.name"), [ "type", "metadata.name" ]), t.secretsLoaded = !0, r.addLabelSuggestionsFromResources(t.unfilteredSecrets, t.labelSuggestions), r.setLabelSuggestions(t.labelSuggestions), t.secrets = r.getLabelSelector().select(t.unfilteredSecrets), o();
})), r.onActiveFiltersChanged(function(e) {
t.$evalAsync(function() {
t.secrets = e.select(t.unfilteredSecrets), o();
});
}), t.$on("$destroy", function() {
a.unwatchAll(i);
});
}));
} ]), angular.module("openshiftConsole").controller("SecretController", [ "$routeParams", "$filter", "$scope", "APIService", "DataService", "ProjectsService", "SecretsService", "gettextCatalog", function(e, t, n, a, r, o, i, s) {
n.projectName = e.project, n.secretName = e.secret, n.view = {
showSecret: !1
}, n.alerts = n.alerts || {}, n.breadcrumbs = [ {
title: "Secrets",
link: "project/" + e.project + "/browse/secrets"
}, {
title: n.secretName
} ], n.secretsVersion = a.getPreferredVersion("secrets");
var c = [], l = function(e, t) {
n.secret = e, "DELETED" !== t ? n.decodedSecretData = i.decodeSecretData(n.secret.data) : n.alerts.deleted = {
type: "warning",
message: s.getString("This secret has been deleted.")
};
};
n.addToApplicationVisible = !1, n.addToApplication = function() {
n.secret.data && (n.addToApplicationVisible = !0);
}, n.closeAddToApplication = function() {
n.addToApplicationVisible = !1;
}, o.get(e.project).then(_.spread(function(e, a) {
n.project = e, n.context = a, r.get(n.secretsVersion, n.secretName, a, {
errorNotification: !1
}).then(function(e) {
n.loaded = !0, l(e), c.push(r.watchObject(n.secretsVersion, n.secretName, a, l));
}, function(e) {
n.loaded = !0, n.alerts.load = {
type: "error",
message: s.getString("The secret details could not be loaded."),
details: t("getErrorDetails")(e)
};
}), n.$on("$destroy", function() {
r.unwatchAll(c);
});
}));
} ]), angular.module("openshiftConsole").controller("CreateSecretController", [ "$filter", "$location", "$routeParams", "$scope", "$window", "ApplicationGenerator", "AuthorizationService", "DataService", "Navigate", "ProjectsService", "gettextCatalog", function(e, t, n, a, r, o, i, s, c, l, u) {
a.alerts = {}, a.projectName = n.project, a.breadcrumbs = [ {
title: u.getString("Secrets"),
link: "project/" + a.projectName + "/browse/secrets"
}, {
title: u.getString("Create Secret")
} ], l.get(n.project).then(_.spread(function(e, o) {
a.project = e, a.context = o, i.canI("secrets", "create", n.project) ? a.navigateBack = function() {
n.then ? t.url(n.then) : r.history.back();
} : c.toErrorPage(u.getString("You do not have authority to create secrets in project {{project}}.", {
project: n.project
}), "access_denied");
}));
} ]), angular.module("openshiftConsole").controller("ConfigMapsController", [ "$scope", "$routeParams", "APIService", "DataService", "LabelFilter", "ProjectsService", function(e, t, n, a, r, o) {
e.projectName = t.project, e.loaded = !1, e.labelSuggestions = {}, e.configMapsVersion = n.getPreferredVersion("configmaps"), e.clearFilter = function() {
r.clear();
};
var i, s = [], c = function() {
e.filterWithZeroResults = !r.getLabelSelector().isEmpty() && _.isEmpty(e.configMaps) && !_.isEmpty(i);
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
e.$evalAsync(u);
}), e.$on("$destroy", function() {
a.unwatchAll(s);
});
}));
} ]), angular.module("openshiftConsole").controller("ConfigMapController", [ "$scope", "$routeParams", "APIService", "BreadcrumbsService", "DataService", "ProjectsService", "gettextCatalog", function(e, t, n, a, r, o, i) {
e.projectName = t.project, e.alerts = e.alerts || {}, e.loaded = !1, e.labelSuggestions = {}, e.breadcrumbs = a.getBreadcrumbs({
name: t.configMap,
kind: "ConfigMap",
namespace: t.project
}), e.configMapsVersion = n.getPreferredVersion("configmaps");
var s = [], c = function(t, n) {
e.loaded = !0, e.configMap = t, "DELETED" === n && (e.alerts.deleted = {
type: "warning",
message: i.getString("This config map has been deleted.")
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
c(e), s.push(r.watchObject("configmaps", t.configMap, a, c));
}, function(t) {
e.loaded = !0, e.error = t;
}), e.$on("$destroy", function() {
r.unwatchAll(s);
});
}));
} ]), angular.module("openshiftConsole").controller("CreateConfigMapController", [ "$filter", "$routeParams", "$scope", "$window", "APIService", "AuthorizationService", "DataService", "Navigate", "NotificationsService", "ProjectsService", "gettextCatalog", function(e, t, n, a, r, o, i, s, c, l, u) {
n.projectName = t.project, n.breadcrumbs = [ {
title: u.getString("Config Maps"),
link: "project/" + n.projectName + "/browse/config-maps"
}, {
title: u.getString("Create Config Map")
} ];
var d = function() {
c.hideNotification("create-config-map-error");
};
n.$on("$destroy", d);
var m = function() {
a.history.back();
};
n.cancel = m, l.get(t.project).then(_.spread(function(a, l) {
n.project = a, o.canI("configmaps", "create", t.project) ? (n.configMap = {
apiVersion: "v1",
kind: "ConfigMap",
metadata: {
namespace: t.project
},
data: {}
}, n.createConfigMap = function() {
if (n.createConfigMapForm.$valid) {
d(), n.disableInputs = !0;
var t = r.objectToResourceGroupVersion(n.configMap);
i.create(t, null, n.configMap, l).then(function() {
c.addNotification({
type: "success",
message: u.getString("Config map {{name}} successfully created.", {
name: n.configMap.metadata.name
})
}), m();
}, function(t) {
n.disableInputs = !1, c.addNotification({
id: "create-config-map-error",
type: "error",
message: u.getString("An error occurred creating the config map."),
details: e("getErrorDetails")(t)
});
});
}
}) : s.toErrorPage(u.getString("You do not have authority to create config maps in project {{project}}.", {
project: t.project
}), "access_denied");
}));
} ]), angular.module("openshiftConsole").controller("RoutesController", [ "$filter", "$routeParams", "$scope", "APIService", "DataService", "LabelFilter", "ProjectsService", function(e, t, n, a, r, o, i) {
n.projectName = t.project, n.unfilteredRoutes = {}, n.routes = {}, n.labelSuggestions = {}, n.clearFilter = function() {
o.clear();
};
var s = a.getPreferredVersion("services");
n.routesVersion = a.getPreferredVersion("routes");
var c = [];
i.get(t.project).then(_.spread(function(e, t) {
function a() {
n.filterWithZeroResults = !o.getLabelSelector().isEmpty() && _.isEmpty(n.routes) && !_.isEmpty(n.unfilteredRoutes);
}
n.project = e, c.push(r.watch(n.routesVersion, t, function(e) {
n.routesLoaded = !0, n.unfilteredRoutes = e.by("metadata.name"), o.addLabelSuggestionsFromResources(n.unfilteredRoutes, n.labelSuggestions), o.setLabelSuggestions(n.labelSuggestions), n.routes = o.getLabelSelector().select(n.unfilteredRoutes), a();
})), c.push(r.watch(s, t, function(e) {
n.services = e.by("metadata.name");
})), o.onActiveFiltersChanged(function(e) {
n.$evalAsync(function() {
n.routes = e.select(n.unfilteredRoutes), a();
});
}), n.$on("$destroy", function() {
r.unwatchAll(c);
});
}));
} ]), angular.module("openshiftConsole").controller("RouteController", [ "$scope", "$filter", "$routeParams", "AlertMessageService", "APIService", "DataService", "ProjectsService", "RoutesService", "$cookieStore", "gettextCatalog", "$rootScope", function(e, t, n, a, r, o, i, s, c, l, u) {
e.projectName = n.project, e.route = null, e.alerts = {}, e.renderOptions = e.renderOptions || {}, e.renderOptions.hideFilterWidget = !0, e.breadcrumbs = [ {
title: l.getString("Routes"),
link: "project/" + n.project + "/browse/routes"
}, {
title: n.route
} ];
var d = r.getPreferredVersion("services");
e.routesVersion = r.getPreferredVersion("routes");
var m, p = [], g = function(t, n) {
e.loaded = !0, e.route = t, m = s.isCustomHost(t), "DELETED" === n && (e.alerts.deleted = {
type: "warning",
message: l.getString("This route has been deleted.")
});
}, f = function(t) {
return "router-host-" + _.get(e, "route.metadata.uid") + "-" + t.host + "-" + t.routerCanonicalHostname;
};
e.showRouterHostnameAlert = function(t, n) {
if (!m) return !1;
if (!t || !t.host || !t.routerCanonicalHostname) return !1;
if (!n || "True" !== n.status) return !1;
var r = f(t);
return !a.isAlertPermanentlyHidden(r, e.projectName);
}, i.get(n.project).then(_.spread(function(a, r) {
e.project = a, o.get(e.routesVersion, n.route, r, {
errorNotification: !1
}).then(function(t) {
g(t), p.push(o.watchObject(e.routesVersion, n.route, r, g));
}, function(n) {
e.loaded = !0, e.alerts.load = {
type: "error",
message: l.getString("The route details could not be loaded."),
details: t("getErrorDetails")(n)
};
}), p.push(o.watch(d, r, function(t) {
e.services = t.by("metadata.name");
})), e.$on("$destroy", function() {
o.unwatchAll(p);
});
})), u.language = c.get("openshift_language") || "zh_CN", l.setCurrentLanguage(u.language), console.log(u.language);
} ]), angular.module("openshiftConsole").controller("StorageController", [ "$filter", "$routeParams", "$scope", "APIService", "AlertMessageService", "DataService", "LabelFilter", "Logger", "ProjectsService", "QuotaService", "gettextCatalog", function(e, t, n, a, r, o, i, s, c, l, u) {
n.projectName = t.project, n.pvcs = {}, n.unfilteredPVCs = {}, n.labelSuggestions = {}, n.alerts = n.alerts || {}, n.outOfClaims = !1, n.clearFilter = function() {
i.clear();
};
var d = function() {
var e = r.isAlertPermanentlyHidden("storage-quota-limit-reached", n.projectName);
if (n.outOfClaims = l.isAnyStorageQuotaExceeded(n.quotas, n.clusterQuotas), !e && n.outOfClaims) {
if (n.alerts.quotaExceeded) return;
n.alerts.quotaExceeded = {
type: "warning",
message: u.getString("Storage quota limit has been reached. You will not be able to create any new storage."),
links: [ {
href: "project/" + n.projectName + "/quota",
label: u.getString("View Quota")
}, {
href: "",
label: u.getString("Don't Show Me Again"),
onClick: function() {
return r.permanentlyHideAlert("storage-quota-limit-reached", n.projectName), !0;
}
} ]
};
} else delete n.alerts.quotaExceeded;
}, m = a.getPreferredVersion("resourcequotas"), p = a.getPreferredVersion("appliedclusterresourcequotas");
n.persistentVolumeClaimsVersion = a.getPreferredVersion("persistentvolumeclaims");
var g = [];
c.get(t.project).then(_.spread(function(e, t) {
function a() {
n.filterWithZeroResults = !i.getLabelSelector().isEmpty() && $.isEmptyObject(n.pvcs) && !$.isEmptyObject(n.unfilteredPVCs);
}
n.project = e, g.push(o.watch(n.persistentVolumeClaimsVersion, t, function(e) {
n.pvcsLoaded = !0, n.unfilteredPVCs = e.by("metadata.name"), i.addLabelSuggestionsFromResources(n.unfilteredPVCs, n.labelSuggestions), i.setLabelSuggestions(n.labelSuggestions), n.pvcs = i.getLabelSelector().select(n.unfilteredPVCs), a(), s.log("pvcs (subscribe)", n.unfilteredPVCs);
})), i.onActiveFiltersChanged(function(e) {
n.$evalAsync(function() {
n.pvcs = e.select(n.unfilteredPVCs), a();
});
}), n.$on("$destroy", function() {
o.unwatchAll(g);
}), o.list(m, {
namespace: n.projectName
}, function(e) {
n.quotas = e.by("metadata.name"), d();
}), o.list(p, {
namespace: n.projectName
}, function(e) {
n.clusterQuotas = e.by("metadata.name"), d();
});
}));
} ]), angular.module("openshiftConsole").controller("OtherResourcesController", [ "$routeParams", "$location", "$scope", "AuthorizationService", "DataService", "ProjectsService", "$filter", "LabelFilter", "Logger", "APIService", function(e, t, n, a, r, o, i, s, c, l) {
function u() {
n.filterWithZeroResults = !s.getLabelSelector().isEmpty() && _.isEmpty(n.resources) && !_.isEmpty(n.unfilteredResources);
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
var g = function(e, t) {
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
return !!m(e) && (!!a.checkResource(t.resource) && a.canI(t, "list", n.projectName));
}), n.project = t, n.context = r, n.kindSelector.disabled = !1, e.kind && g(e.kind, e.group) && (_.set(n, "kindSelector.selected.kind", e.kind), _.set(n, "kindSelector.selected.group", e.group || ""));
})), n.loadKind = d, n.$watch("kindSelector.selected", function() {
s.clear(), d();
});
var f = i("humanizeKind");
n.matchKind = function(e, t) {
return -1 !== f(e).toLowerCase().indexOf(t.toLowerCase());
}, s.onActiveFiltersChanged(function(e) {
n.$evalAsync(function() {
n.resources = e.select(n.unfilteredResources), u();
});
});
} ]), angular.module("openshiftConsole").controller("PersistentVolumeClaimController", [ "$filter", "$scope", "$routeParams", "APIService", "DataService", "ProjectsService", "gettextCatalog", function(e, t, n, a, r, o, i) {
t.projectName = n.project, t.pvc = null, t.alerts = {}, t.renderOptions = t.renderOptions || {}, t.renderOptions.hideFilterWidget = !0, t.breadcrumbs = [ {
title: "Storage",
link: "project/" + n.project + "/browse/storage"
}, {
title: n.pvc
} ], t.storageClassesVersion = a.getPreferredVersion("storageclasses"), t.pvcVersion = a.getPreferredVersion("persistentvolumeclaims"), t.eventsVersion = a.getPreferredVersion("events"), t.isExpansionAllowed = !1;
var s = e("storageClass"), c = [], l = function(e) {
t.isExpansionAllowed = (!e || e.allowVolumeExpansion) && "Bound" === t.pvc.status.phase;
}, u = function(e) {
var n = s(t.pvc);
n !== _.get(s, "metadata.name") && r.get(t.storageClassesVersion, n, {}).then(function(a) {
t.isExpansionAllowed = (!a || a.allowVolumeExpansion) && "Bound" === e.status.phase, c.push(r.watchObject(t.storageClassesVersion, n, {
namespace: t.projectContext
}, l));
});
}, d = function(e, n) {
t.pvc = e, t.loaded = !0, u(e), "DELETED" === n && (t.alerts.deleted = {
type: "warning",
message: i.getString("This persistent volume claim has been deleted.")
});
};
o.get(n.project).then(_.spread(function(a, o) {
t.project = a, t.projectContext = o, r.get(t.pvcVersion, n.pvc, o, {
errorNotification: !1
}).then(function(e) {
d(e), c.push(r.watchObject(t.pvcVersion, n.pvc, o, d));
}, function(n) {
t.loaded = !0, t.alerts.load = {
type: "error",
message: i.getString("The persistent volume claim details could not be loaded."),
details: e("getErrorDetails")(n)
};
}), t.$on("$destroy", function() {
r.unwatchAll(c);
});
}));
} ]), angular.module("openshiftConsole").controller("SetLimitsController", [ "$filter", "$location", "$parse", "$routeParams", "$scope", "APIService", "AuthorizationService", "BreadcrumbsService", "DataService", "LimitRangesService", "Navigate", "NotificationsService", "ProjectsService", function(e, t, n, a, r, o, i, s, c, l, u, d, m) {
if (a.kind && a.name) {
var p = [ "Deployment", "DeploymentConfig", "ReplicaSet", "ReplicationController" ];
if (_.includes(p, a.kind)) {
var g = e("humanizeKind"), f = g(a.kind, !0) + " " + a.name;
r.name = a.name, "ReplicationController" !== a.kind && "ReplicaSet" !== a.kind || (r.showPodWarning = !0), r.renderOptions = {
hideFilterWidget: !0
}, r.breadcrumbs = s.getBreadcrumbs({
name: a.name,
kind: a.kind,
namespace: a.project,
subpage: gettextCatalog.getString("Edit Resource Limits")
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
r.cancel = y, r.$on("$destroy", b);
var S = o.getPreferredVersion("limitranges");
m.get(a.project).then(_.spread(function(e, t) {
r.hideCPU = l.hasClusterResourceOverrides(e);
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
subpage: gettextCatalog.getString("Edit Resource Limits")
}), r.resourceURL = u.resourceURL(o), r.containers = _.get(o, "spec.template.spec.containers"), r.save = function() {
r.disableInputs = !0, b(), c.update(n, r.name, o, t).then(function() {
d.addNotification({
type: "success",
message: f + gettextCatalog.getString(" was updated.")
}), y();
}, function(e) {
r.disableInputs = !1, v(f + gettextCatalog.getString(" could not be updated."), h(e));
});
};
}, function(e) {
v(f + gettextCatalog.getString(" could not be loaded."), h(e));
});
var m = function() {
r.hideCPU || (r.cpuProblems = l.validatePodLimits(r.limitRanges, "cpu", r.containers, e)), r.memoryProblems = l.validatePodLimits(r.limitRanges, "memory", r.containers, e);
};
c.list(S, t).then(function(e) {
r.limitRanges = e.by("metadata.name"), _.isEmpty(r.limitRanges) || r.$watch("containers", m, !0);
});
} else u.toErrorPage(gettextCatalog.getString("You do not have authority to update ") + g(a.kind) + " " + a.name + ".", "access_denied");
}));
} else u.toErrorPage(gettextCatalog.getString("Health checks are not supported for kind {{kind}}.", {
kind: a.kind
}));
} else u.toErrorPage(gettextCatalog.getString("Kind or name parameter missing."));
} ]), angular.module("openshiftConsole").controller("EditBuildConfigController", [ "$scope", "$filter", "$location", "$routeParams", "$window", "APIService", "AuthorizationService", "DataService", "Navigate", "NotificationsService", "ProjectsService", "SOURCE_URL_PATTERN", "SecretsService", "keyValueEditorUtils", "gettextCatalog", function(e, t, n, a, r, o, i, s, c, l, u, d, m, p, g) {
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
return g.getString("Enter the arguments that will be appended to the default image entry point.");

case "commandArgs":
return g.getString("Enter the arguments that will be appended to the command.");

case "scriptArgs":
return g.getString("Enter the arguments that will be appended to the script.");
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
}, h = function() {
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
var v = o.getPreferredVersion("buildconfigs"), y = o.getPreferredVersion("secrets"), b = [], S = t("buildStrategy"), C = t("orderByDisplayName"), w = t("getErrorDetails"), P = [], k = [];
e.valueFromObjects = [];
var j = function() {
var t;
e.buildConfig ? (t = c.resourceURL(e.buildConfig), n.path(t)) : r.history.back();
};
e.cancel = j;
var I = function() {
l.hideNotification("edit-build-config-error"), l.hideNotification("edit-build-config-conflict"), l.hideNotification("edit-build-config-deleted");
};
e.$on("$destroy", I), u.get(a.project).then(_.spread(function(n, r) {
if (e.project = n, e.context = r, i.canI("buildconfigs", "update", a.project)) s.get(v, a.buildconfig, r, {
errorNotification: !1
}).then(function(t) {
e.buildConfig = t, f(), e.updatedBuildConfig = angular.copy(e.buildConfig), e.buildStrategy = S(e.updatedBuildConfig), e.strategyType = e.buildConfig.spec.strategy.type, e.envVars = e.buildStrategy.env || [], e.triggers = T(e.triggers, e.buildConfig.spec.triggers), e.sources = L(e.sources, e.buildConfig.spec.source), _.has(t, "spec.strategy.jenkinsPipelineStrategy.jenkinsfile") && (e.jenkinsfileOptions.type = "inline"), i.canI(y, "list", a.project) && s.list(y, r).then(function(t) {
var n = m.groupSecretsByType(t), a = _.mapValues(n, function(e) {
return _.map(e, "metadata.name");
});
e.webhookSecrets = m.groupSecretsByType(t).webhook, e.webhookSecrets.unshift(""), e.secrets.secretsByType = _.each(a, function(e) {
e.unshift("");
}), D(), k = C(t.by("metadata.name")), e.valueFromObjects = P.concat(k);
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
}))), e.options.forcePull = !!e.buildStrategy.forcePull, "Docker" === e.strategyType && (e.options.noCache = !!e.buildConfig.spec.strategy.dockerStrategy.noCache, e.buildFromTypes.push("None")), b.push(s.watchObject(v, a.buildconfig, r, function(t, n) {
"MODIFIED" === n && l.addNotification({
id: "edit-build-config-conflict",
type: "warning",
message: g.getString("This build configuration has changed since you started editing it. You'll need to copy any changes you've made and edit again.")
}), "DELETED" === n && (l.addNotification({
id: "edit-build-config-deleted",
type: "warning",
message: g.getString("This build configuration has been deleted.")
}), e.disableInputs = !0), e.buildConfig = t;
})), e.loaded = !0;
}, function(n) {
e.loaded = !0, e.alerts.load = {
type: "error",
message: g.getString("The build configuration details could not be loaded."),
details: "Reason: " + t("getErrorDetails")(n)
};
}), s.list("configmaps", r, null, {
errorNotification: !1
}).then(function(t) {
P = C(t.by("metadata.name")), e.valueFromObjects = P.concat(k);
}, function(e) {
403 !== e.code && l.addNotification({
id: "edit-build-config-list-config-maps-error",
type: "error",
message: g.getString("Could not load config maps."),
details: w(e)
});
}); else {
var o = g.getString("You do not have authority to update build config {{buildconfig}}.", {
buildconfig: a.buildconfig
});
c.toErrorPage(o, "access_denied");
}
}));
var T = function(n, a) {
function r(n, a) {
return t("imageObjectRef")(n, e.projectName) === t("imageObjectRef")(a, e.projectName);
}
var o = S(e.buildConfig).from;
return a.forEach(function(e) {
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
var R = function(e) {
return _.map(p.compactEntries(e), function(e) {
return {
sourcePath: e.name,
destinationDir: e.value
};
});
}, N = function(t) {
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
}, A = function(e) {
return _.filter(e, function(e) {
return !_.isEmpty(e.data.type) && !_.isEmpty(e.data[_.toLower(e.data.type)]);
});
}, E = function() {
var t = [].concat(e.triggers.imageChangeTriggers, e.triggers.builderImageChangeTrigger, e.triggers.configChangeTrigger);
return t = _.filter(t, function(e) {
return _.has(e, "disabled") && !e.disabled || e.present;
}), t = t.concat(A(e.triggers.webhookTriggers)), t = _.map(t, "data");
}, D = function() {
switch (e.secrets.picked = {
gitSecret: e.buildConfig.spec.source.sourceSecret ? [ e.buildConfig.spec.source.sourceSecret ] : [ {
name: ""
} ],
pullSecret: S(e.buildConfig).pullSecret ? [ S(e.buildConfig).pullSecret ] : [ {
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
e.secrets.picked.sourceSecrets = S(e.buildConfig).secrets || [ {
secretSource: {
name: ""
},
mountPath: ""
} ];
}
}, $ = function(e, t, n) {
t.name ? e[n] = t : delete e[n];
}, B = function(t, n) {
var a = "Custom" === e.strategyType ? "secretSource" : "secret", r = _.filter(n, function(e) {
return e[a].name;
});
_.isEmpty(r) ? delete t.secrets : t.secrets = r;
}, L = function(e, t) {
return "None" === t.type ? e : (e.none = !1, angular.forEach(t, function(t, n) {
e[n] = !0;
}), e);
};
e.save = function() {
switch (e.disableInputs = !0, h(), S(e.updatedBuildConfig).forcePull = e.options.forcePull, e.strategyType) {
case "Docker":
S(e.updatedBuildConfig).noCache = e.options.noCache;
break;

case "JenkinsPipeline":
"path" === e.jenkinsfileOptions.type ? delete e.updatedBuildConfig.spec.strategy.jenkinsPipelineStrategy.jenkinsfile : delete e.updatedBuildConfig.spec.strategy.jenkinsPipelineStrategy.jenkinsfilePath;
}
switch (e.sources.images && !_.isEmpty(e.sourceImages) && (e.updatedBuildConfig.spec.source.images[0].paths = R(e.imageSourcePaths), e.updatedBuildConfig.spec.source.images[0].from = N(e.imageOptions.fromSource)), "None" === e.imageOptions.from.type ? delete S(e.updatedBuildConfig).from : S(e.updatedBuildConfig).from = N(e.imageOptions.from), "None" === e.imageOptions.to.type ? delete e.updatedBuildConfig.spec.output.to : e.updatedBuildConfig.spec.output.to = N(e.imageOptions.to), S(e.updatedBuildConfig).env = p.compactEntries(e.envVars), $(e.updatedBuildConfig.spec.source, _.head(e.secrets.picked.gitSecret), "sourceSecret"), $(S(e.updatedBuildConfig), _.head(e.secrets.picked.pullSecret), "pullSecret"), $(e.updatedBuildConfig.spec.output, _.head(e.secrets.picked.pushSecret), "pushSecret"), e.strategyType) {
case "Source":
case "Docker":
B(e.updatedBuildConfig.spec.source, e.secrets.picked.sourceSecrets);
break;

case "Custom":
B(S(e.updatedBuildConfig), e.secrets.picked.sourceSecrets);
}
e.updatedBuildConfig.spec.triggers = E(), I(), s.update(v, e.updatedBuildConfig.metadata.name, e.updatedBuildConfig, e.context).then(function() {
l.addNotification({
type: "success",
message: g.getString("Build config {{name}} was successfully updated.", {
name: e.updatedBuildConfig.metadata.name
})
}), j();
}, function(n) {
e.disableInputs = !1, l.addNotification({
id: "edit-build-config-error",
type: "error",
message: g.getString("An error occurred updating build config {{name}}.", {
name: e.updatedBuildConfig.metadata.name
}),
details: t("getErrorDetails")(n)
});
});
}, e.$on("$destroy", function() {
s.unwatchAll(b);
});
} ]), angular.module("openshiftConsole").controller("EditConfigMapController", [ "$filter", "$routeParams", "$scope", "$window", "APIService", "DataService", "BreadcrumbsService", "Navigate", "NotificationsService", "ProjectsService", "gettextCatalog", function(e, t, n, a, r, o, i, s, c, l, u) {
var d = [];
n.forms = {}, n.projectName = t.project, n.breadcrumbs = i.getBreadcrumbs({
name: t.configMap,
kind: "ConfigMap",
namespace: t.project,
subpage: u.getString("Edit Config Map")
});
var m = function(e) {
return _.get(e, "metadata.resourceVersion");
}, p = function() {
c.hideNotification("edit-config-map-error");
}, g = function() {
a.history.back();
};
n.cancel = g;
var f = r.getPreferredVersion("configmaps");
l.get(t.project).then(_.spread(function(a, r) {
o.get(f, t.configMap, r, {
errorNotification: !1
}).then(function(e) {
n.loaded = !0, n.breadcrumbs = i.getBreadcrumbs({
name: t.configMap,
object: e,
project: a,
subpage: u.getString("Edit Config Map")
}), n.configMap = e, d.push(o.watchObject(f, t.configMap, r, function(e, t) {
n.resourceChanged = m(e) !== m(n.configMap), n.resourceDeleted = "DELETED" === t;
}));
}, function(n) {
s.toErrorPage(u.getString("Could not load config map {{config}}. ", {
config: t.configMap
}) + e("getErrorDetails")(n));
}), n.updateConfigMap = function() {
n.forms.editConfigMapForm.$valid && (p(), n.disableInputs = !0, o.update(f, n.configMap.metadata.name, n.configMap, r).then(function() {
c.addNotification({
type: "success",
message: u.getString("Config map {{name}} successfully updated.", {
name: n.configMap.metadata.name
})
}), g();
}, function(t) {
n.disableInputs = !1, c.addNotification({
id: "edit-config-map-error",
type: "error",
message: u.getString("An error occurred updating the config map."),
details: e("getErrorDetails")(t)
});
}));
}, n.$on("$destroy", function() {
o.unwatchAll(d), p();
});
}));
} ]), angular.module("openshiftConsole").controller("EditDeploymentConfigController", [ "$scope", "$filter", "$location", "$routeParams", "$uibModal", "$window", "APIService", "AuthorizationService", "BreadcrumbsService", "DataService", "EnvironmentService", "Navigate", "NotificationsService", "ProjectsService", "SecretsService", "keyValueEditorUtils", "gettextCatalog", function(e, t, n, a, r, o, i, s, c, l, u, d, m, p, g, f, h) {
e.projectName = a.project, e.deploymentConfig = null, e.alerts = {}, e.view = {
advancedStrategyOptions: !1,
advancedImageOptions: !1
}, e.triggers = {}, e.breadcrumbs = c.getBreadcrumbs({
name: a.name,
kind: a.kind,
namespace: a.project,
subpage: h.getString("Edit Deployment Config")
}), e.deploymentConfigStrategyTypes = [ "Recreate", "Rolling", "Custom" ];
var v = t("orderByDisplayName"), y = t("getErrorDetails"), b = function(t, n) {
e.alerts["from-value-objects"] = {
type: "error",
message: t,
details: n
};
}, S = i.getPreferredVersion("deploymentconfigs"), C = i.getPreferredVersion("configmaps"), w = i.getPreferredVersion("secrets"), P = [], k = [], j = [];
e.valueFromObjects = [];
var I = function(e) {
switch (e) {
case "Recreate":
return "recreateParams";

case "Rolling":
return "rollingParams";

case "Custom":
return "customParams";

default:
return void Logger.error(h.getString("Unknown deployment strategy type: ") + e);
}
};
p.get(a.project).then(_.spread(function(n, r) {
e.project = n, e.context = r, s.canI("deploymentconfigs", "update", a.project) ? l.get(S, a.deploymentconfig, r, {
errorNotification: !1
}).then(function(t) {
e.deploymentConfig = t, e.breadcrumbs = c.getBreadcrumbs({
object: t,
project: n,
subpage: h.getString("Edit")
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
}, e.volumeNames = _.map(e.deploymentConfig.spec.template.spec.volumes, "name"), e.strategyData = angular.copy(e.deploymentConfig.spec.strategy), e.originalStrategy = e.strategyData.type, e.strategyParamsPropertyName = I(e.strategyData.type), e.triggers.hasConfigTrigger = _.some(e.updatedDeploymentConfig.spec.triggers, {
type: "ConfigChange"
}), "Custom" !== e.strategyData.type || _.has(e.strategyData, "customParams.environment") || (e.strategyData.customParams.environment = []), l.list(C, r, null, {
errorNotification: !1
}).then(function(t) {
k = v(t.by("metadata.name")), e.availableConfigMaps = k, e.valueFromObjects = k.concat(j);
}, function(e) {
403 !== e.status && b(h.getString("Could not load config maps"), y(e));
}), l.list(w, r, null, {
errorNotification: !1
}).then(function(t) {
j = v(t.by("metadata.name")), e.availableSecrets = j, e.valueFromObjects = k.concat(j);
var n = g.groupSecretsByType(t), a = _.mapValues(n, function(e) {
return _.map(e, "metadata.name");
});
e.secretsByType = _.each(a, function(e) {
e.unshift("");
});
}, function(e) {
403 !== e.status && b(h.getString("Could not load secrets"), y(e));
}), P.push(l.watchObject(S, a.deploymentconfig, r, function(t, n) {
"MODIFIED" === n && (e.alerts["updated/deleted"] = {
type: "warning",
message: h.getString("This deployment configuration has changed since you started editing it. You'll need to copy any changes you've made and edit again.")
}), "DELETED" === n && (e.alerts["updated/deleted"] = {
type: "warning",
message: h.getString("This deployment configuration has been deleted.")
}, e.disableInputs = !0), e.deploymentConfig = t;
})), e.loaded = !0;
}, function(n) {
e.loaded = !0, e.alerts.load = {
type: "error",
message: h.getString("The deployment configuration details could not be loaded."),
details: t("getErrorDetails")(n)
};
}) : d.toErrorPage(h.getString("You do not have authority to update deployment config ") + a.deploymentconfig + ".", "access_denied");
}));
var T = function() {
return "Custom" !== e.strategyData.type && "Custom" !== e.originalStrategy && e.strategyData.type !== e.originalStrategy;
}, R = function(t) {
_.has(e.strategyData, t) || r.open({
templateUrl: "views/modals/confirm.html",
controller: "ConfirmModalController",
resolve: {
modalConfig: function() {
return {
alerts: e.alerts,
title: h.getString("Keep some existing {{name}} strategy parameters?", {
name: e.originalStrategy.toLowerCase()
}),
details: h.getString("The timeout parameter and any pre or post lifecycle hooks will be copied from {{strategy}} strategy to {{type}} strategy. After saving the changes, {{original}} strategy parameters will be removed.", {
strategy: e.originalStrategy.toLowerCase(),
type: e.strategyData.type.toLowerCase(),
original: e.originalStrategy.toLowerCase()
}),
okButtonText: h.getString("Yes"),
okButtonClass: "btn-primary",
cancelButtonText: h.getString("No")
};
}
}
}).result.then(function() {
e.strategyData[t] = angular.copy(e.strategyData[I(e.originalStrategy)]);
}, function() {
e.strategyData[t] = {};
});
};
e.strategyChanged = function() {
var t = I(e.strategyData.type);
T() ? R(t) : _.has(e.strategyData, t) || ("Custom" !== e.strategyData.type ? e.strategyData[t] = {} : e.strategyData[t] = {
image: "",
command: [],
environment: []
}), e.strategyParamsPropertyName = t;
};
var N = function(e, t, n, a) {
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
}, A = function() {
var t = _.reject(e.updatedDeploymentConfig.spec.triggers, function(e) {
return "ImageChange" === e.type || "ConfigChange" === e.type;
});
return _.each(e.containerConfigByName, function(n, a) {
n.hasDeploymentTrigger ? t.push(N(a, n.triggerData.istag, n.triggerData.data, n.triggerData.automatic)) : _.find(e.updatedDeploymentConfig.spec.template.spec.containers, {
name: a
}).image = n.image;
}), e.triggers.hasConfigTrigger && t.push({
type: "ConfigChange"
}), t;
}, E = function() {
m.hideNotification("edit-deployment-config-error");
};
e.save = function() {
if (e.disableInputs = !0, _.each(e.containerConfigByName, function(t, n) {
_.find(e.updatedDeploymentConfig.spec.template.spec.containers, {
name: n
}).env = f.compactEntries(t.env);
}), T() && delete e.strategyData[I(e.originalStrategy)], "Rolling" === e.strategyData.type) {
var a = e.strategyData[e.strategyParamsPropertyName].maxSurge, r = Number(a);
"" === a ? e.strategyData[e.strategyParamsPropertyName].maxSurge = null : _.isFinite(r) && (e.strategyData[e.strategyParamsPropertyName].maxSurge = r);
var o = e.strategyData[e.strategyParamsPropertyName].maxUnavailable, i = Number(o);
"" === o ? e.strategyData[e.strategyParamsPropertyName].maxUnavailable = null : _.isFinite(i) && (e.strategyData[e.strategyParamsPropertyName].maxUnavailable = i);
}
"Custom" !== e.strategyData.type && _.each([ "pre", "mid", "post" ], function(t) {
_.has(e.strategyData, [ e.strategyParamsPropertyName, t, "execNewPod", "env" ]) && (e.strategyData[e.strategyParamsPropertyName][t].execNewPod.env = f.compactEntries(e.strategyData[e.strategyParamsPropertyName][t].execNewPod.env));
}), _.has(e, "strategyData.customParams.environment") && (e.strategyData.customParams.environment = f.compactEntries(e.strategyData.customParams.environment)), e.updatedDeploymentConfig.spec.template.spec.imagePullSecrets = _.filter(e.secrets.pullSecrets, "name"), e.updatedDeploymentConfig.spec.strategy = e.strategyData, e.updatedDeploymentConfig.spec.triggers = A(), E(), l.update(S, e.updatedDeploymentConfig.metadata.name, e.updatedDeploymentConfig, e.context).then(function() {
m.addNotification({
type: "success",
message: h.getString("Deployment config {{name}} was successfully updated.", {
name: e.updatedDeploymentConfig.metadata.name
})
});
var t = d.resourceURL(e.updatedDeploymentConfig);
n.url(t);
}, function(n) {
e.disableInputs = !1, m.addNotification({
id: "edit-deployment-config-error",
type: "error",
message: h.getString("An error occurred updating deployment config {{name}}.", {
name: e.updatedDeploymentConfig.metadata.name
}),
details: t("getErrorDetails")(n)
});
});
}, e.cancel = function() {
o.history.back();
}, e.$on("$destroy", function() {
l.unwatchAll(P), E();
});
} ]), angular.module("openshiftConsole").controller("EditAutoscalerController", [ "$scope", "$filter", "$routeParams", "$window", "APIService", "AuthorizationService", "BreadcrumbsService", "DataService", "HPAService", "MetricsService", "Navigate", "NotificationsService", "ProjectsService", "keyValueEditorUtils", "gettextCatalog", function(e, t, n, a, r, o, i, s, c, l, u, d, m, p, g) {
if (n.kind && n.name) {
var f = [ "Deployment", "DeploymentConfig", "HorizontalPodAutoscaler", "ReplicaSet", "ReplicationController" ];
if (_.includes(f, n.kind)) {
e.kind = n.kind, e.name = n.name, "HorizontalPodAutoscaler" === n.kind ? e.disableInputs = !0 : (e.targetKind = n.kind, e.targetName = n.name), e.autoscaling = {
name: e.name
}, e.labels = [], l.isAvailable().then(function(t) {
e.metricsWarning = !t;
});
var h = t("getErrorDetails"), v = function() {
a.history.back();
};
e.cancel = v;
var y = function() {
d.hideNotification("edit-hpa-error");
};
e.$on("$destroy", y);
var b = r.getPreferredVersion("horizontalpodautoscalers"), S = r.getPreferredVersion("limitranges");
m.get(n.project).then(_.spread(function(t, a) {
e.project = t;
var l = "HorizontalPodAutoscaler" === n.kind ? "update" : "create";
if (o.canI({
resource: "horizontalpodautoscalers",
group: "autoscaling"
}, l, n.project)) {
var m = function(t) {
e.disableInputs = !0, (t = angular.copy(t)).metadata.labels = p.mapEntries(p.compactEntries(e.labels)), t.spec.minReplicas = e.autoscaling.minReplicas, t.spec.maxReplicas = e.autoscaling.maxReplicas, t.spec.targetCPUUtilizationPercentage = e.autoscaling.targetCPU, s.update(b, t.metadata.name, t, a).then(function(e) {
d.addNotification({
type: "success",
message: g.getString("Horizontal pod autoscaler {{name}} successfully updated.", {
name: e.metadata.name
})
}), v();
}, function(t) {
e.disableInputs = !1, d.addNotification({
id: "edit-hpa-error",
type: "error",
message: g.getString("An error occurred creating the horizontal pod autoscaler."),
details: h(t)
});
});
}, f = {};
f = "HorizontalPodAutoscaler" === n.kind ? {
resource: "horizontalpodautoscalers",
group: "autoscaling",
version: "v1"
} : {
resource: r.kindToResource(n.kind),
group: n.group
}, s.get(f, n.name, a).then(function(r) {
if (e.labels = _.map(_.get(r, "metadata.labels", {}), function(e, t) {
return {
name: t,
value: e
};
}), e.usesV2Metrics = c.usesV2Metrics(r), "HorizontalPodAutoscaler" === n.kind) e.targetKind = _.get(r, "spec.scaleTargetRef.kind"), e.targetName = _.get(r, "spec.scaleTargetRef.name"), _.assign(e.autoscaling, {
minReplicas: _.get(r, "spec.minReplicas"),
maxReplicas: _.get(r, "spec.maxReplicas"),
targetCPU: _.get(r, "spec.targetCPUUtilizationPercentage")
}), e.disableInputs = !1, e.save = function() {
m(r);
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
}), e.save = function() {
e.disableInputs = !0, y();
var t = {
apiVersion: "autoscaling/v1",
kind: "HorizontalPodAutoscaler",
metadata: {
name: e.autoscaling.name,
labels: p.mapEntries(p.compactEntries(e.labels))
},
spec: {
scaleTargetRef: {
kind: r.kind,
name: r.metadata.name,
apiVersion: r.apiVersion
},
minReplicas: e.autoscaling.minReplicas,
maxReplicas: e.autoscaling.maxReplicas,
targetCPUUtilizationPercentage: e.autoscaling.targetCPU
}
};
s.create(b, null, t, a).then(function(e) {
d.addNotification({
type: "success",
message: g.getString("Horizontal pod autoscaler {{name}} successfully created.", {
name: e.metadata.name
})
}), v();
}, function(t) {
e.disableInputs = !1, d.addNotification({
id: "edit-hpa-error",
type: "error",
message: g.getString("An error occurred creating the horizontal pod autoscaler."),
details: h(t)
});
});
};
var o = {}, l = function() {
var n = _.get(r, "spec.template.spec.containers", []);
e.showCPURequestWarning = !c.hasCPURequest(n, o, t);
};
s.list(S, a).then(function(e) {
o = e.by("metadata.name"), l();
});
}
});
} else {
var C = g.getString("You do not have authority to {{verb}} horizontal pod autoscalers in project {{project}}.", {
verb: l,
project: n.project
});
u.toErrorPage(C, "access_denied");
}
}));
} else u.toErrorPage(g.getString("Autoscaling not supported for kind {{kind}}.", {
kind: n.kind
}));
} else u.toErrorPage(g.getString("Kind or name parameter missing."));
} ]), angular.module("openshiftConsole").controller("EditHealthChecksController", [ "$filter", "$location", "$routeParams", "$scope", "AuthorizationService", "BreadcrumbsService", "APIService", "DataService", "Navigate", "NotificationsService", "ProjectsService", "gettextCatalog", function(e, t, n, a, r, o, i, s, c, l, u, d) {
if (n.kind && n.name) {
var m = [ "Deployment", "DeploymentConfig", "ReplicaSet", "ReplicationController" ];
if (_.includes(m, n.kind)) {
a.name = n.name, a.resourceURL = c.resourceURL(a.name, n.kind, n.project), a.breadcrumbs = o.getBreadcrumbs({
name: n.name,
kind: n.kind,
namespace: n.project,
subpage: d.getString("Edit Health Checks")
}), a.previousProbes = {};
var p = e("getErrorDetails"), g = e("upperFirst"), f = function(e, t) {
l.addNotification({
id: "add-health-check-error",
type: "error",
message: e,
details: t
});
}, h = function() {
t.url(a.resourceURL);
};
a.cancel = h;
var v = function() {
l.hideNotification("add-health-check-error");
};
a.$on("$destroy", v), u.get(n.project).then(_.spread(function(t, u) {
var m = e("humanizeKind")(n.kind) + ' "' + a.name + '"', y = {
resource: i.kindToResource(n.kind),
group: n.group
};
r.canI(y, "update", n.project) ? s.get(y, a.name, u).then(function(e) {
var r = a.object = angular.copy(e);
a.breadcrumbs = o.getBreadcrumbs({
object: r,
project: t,
subpage: d.getString("Edit Health Checks")
}), a.containers = _.get(r, "spec.template.spec.containers"), a.addProbe = function(e, t) {
e[t] = _.get(a.previousProbes, [ e.name, t ], {}), a.form.$setDirty();
}, a.removeProbe = function(e, t) {
_.set(a.previousProbes, [ e.name, t ], e[t]), delete e[t], a.form.$setDirty();
}, a.save = function() {
a.disableInputs = !0, v(), s.update(i.kindToResource(n.kind), a.name, r, u).then(function() {
l.addNotification({
type: "success",
message: g(m) + d.getString(" was updated.")
}), h();
}, function(e) {
a.disableInputs = !1, f(g(m) + d.getString(" could not be updated."), p(e));
});
};
}, function(e) {
f(g(m) + d.getString(" could not be loaded."), p(e));
}) : c.toErrorPage(d.getString("You do not have authority to update ") + m + ".", "access_denied");
}));
} else c.toErrorPage(d.getString("Health checks are not supported for kind {{kind}}.", {
kind: n.kind
}));
} else c.toErrorPage(d.getString("Kind or name parameter missing."));
} ]), angular.module("openshiftConsole").controller("EditRouteController", [ "$filter", "$location", "$routeParams", "$scope", "APIService", "AuthorizationService", "DataService", "Navigate", "NotificationsService", "ProjectsService", "RoutesService", "gettextCatalog", function(e, t, n, a, r, o, i, s, c, l, u, d) {
a.renderOptions = {
hideFilterWidget: !0
}, a.projectName = n.project, a.routeName = n.route, a.loading = !0, a.routeURL = s.resourceURL(a.routeName, "Route", a.projectName), a.breadcrumbs = [ {
title: d.getString("Routes"),
link: "project/" + a.projectName + "/browse/routes"
}, {
title: a.routeName,
link: a.routeURL
}, {
title: d.getString("Edit")
} ];
var m = function() {
c.hideNotification("edit-route-error");
};
a.$on("$destroy", m);
var p = function() {
t.path(a.routeURL);
};
a.cancel = p;
var g, f = r.getPreferredVersion("routes"), h = r.getPreferredVersion("services");
l.get(n.project).then(_.spread(function(t, r) {
if (a.project = t, o.canI("routes", "update", n.project)) {
var l, v = e("orderByDisplayName"), y = function() {
s.toErrorPage(d.getString('Editing routes with non-service targets is unsupported. You can edit the route with the "Edit YAML" action instead.'));
};
i.get(f, a.routeName, r).then(function(e) {
"Service" === e.spec.to.kind ? (l = angular.copy(e), g = _.get(l, "spec.host"), "Subdomain" === _.get(l, "spec.wildcardPolicy") && (g = "*." + u.getSubdomain(l)), a.routing = {
host: g,
wildcardPolicy: _.get(l, "spec.wildcardPolicy"),
path: _.get(l, "spec.path"),
targetPort: _.get(l, "spec.port.targetPort"),
tls: angular.copy(_.get(l, "spec.tls"))
}, i.list(h, r).then(function(e) {
a.loading = !1;
var t = e.by("metadata.name");
a.routing.to = l.spec.to, a.routing.alternateServices = [], _.each(_.get(l, "spec.alternateBackends"), function(e) {
if ("Service" !== e.kind) return y(), !1;
a.routing.alternateServices.push(e);
}), a.services = v(t);
})) : y();
}, function() {
s.toErrorPage(d.getString("Could not load route {{routeName}}.", {
routeName: a.routeName
}));
});
var b = function() {
var e = angular.copy(l), t = _.get(a, "routing.to.name");
_.set(e, "spec.to.name", t);
var n = _.get(a, "routing.to.weight");
isNaN(n) || _.set(e, "spec.to.weight", n);
var r = a.routing.host;
g !== r && (r.startsWith("*.") && (r = "wildcard" + r.substring(1)), e.spec.host = r), e.spec.path = a.routing.path;
var o = a.routing.targetPort;
o ? _.set(e, "spec.port.targetPort", o) : delete e.spec.port, _.get(a, "routing.tls.termination") ? (e.spec.tls = a.routing.tls, "passthrough" === e.spec.tls.termination && (delete e.spec.path, delete e.spec.tls.certificate, delete e.spec.tls.key, delete e.spec.tls.caCertificate), "reencrypt" !== e.spec.tls.termination && delete e.spec.tls.destinationCACertificate) : delete e.spec.tls;
var i = _.get(a, "routing.alternateServices", []);
return _.isEmpty(i) ? delete e.spec.alternateBackends : e.spec.alternateBackends = _.map(i, function(e) {
return {
kind: "Service",
name: e.name,
weight: e.weight
};
}), e;
};
a.updateRoute = function() {
if (a.form.$valid) {
m(), a.disableInputs = !0;
var t = b();
i.update(f, a.routeName, t, r).then(function() {
c.addNotification({
type: "success",
message: d.getString("Route {{routeName}} was successfully updated.", {
routeName: a.routeName
})
}), p();
}, function(t) {
a.disableInputs = !1, c.addNotification({
type: "error",
id: "edit-route-error",
message: d.getString("An error occurred updating route {{routeName}}.", {
routeName: a.routeName
}),
details: e("getErrorDetails")(t)
});
});
}
};
} else s.toErrorPage(d.getString("You do not have authority to update route ") + n.routeName + ".", "access_denied");
}));
} ]), angular.module("openshiftConsole").controller("EditYAMLController", [ "$scope", "$filter", "$location", "$routeParams", "$window", "APIService", "AuthorizationService", "BreadcrumbsService", "DataService", "Navigate", "NotificationsService", "ProjectsService", "gettextCatalog", function(e, t, n, a, r, o, i, s, c, l, u, d, m) {
if (a.kind && a.name) {
var p = t("humanizeKind");
e.alerts = {}, e.name = a.name, e.resourceURL = l.resourceURL(e.name, a.kind, a.project), e.breadcrumbs = [ {
title: a.name,
link: a.returnURL
}, {
title: m.getString("Edit YAML")
} ];
var g = function() {
e.modified = !1, a.returnURL ? n.url(a.returnURL) : r.history.back();
}, f = [];
d.get(a.project).then(_.spread(function(n, r) {
var s = {
resource: o.kindToResource(a.kind),
group: a.group
};
i.canI(s, "update", a.project) ? (c.get(s, e.name, r, {
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
var r = o.objectToResourceGroupVersion(i), s = o.objectToResourceGroupVersion(n);
s ? s.group === r.group ? o.apiInfo(s) ? (e.updatingNow = !0, c.update(r, i.metadata.name, n, {
namespace: i.metadata.namespace
}).then(function(t) {
var r = _.get(n, "metadata.resourceVersion");
if (_.get(t, "metadata.resourceVersion") === r) return e.alerts["no-changes-applied"] = {
type: "warning",
message: m.getString("No changes were applied to {{kind}} {{name}}.", {
kind: p(a.kind),
name: a.name
}),
details: m.getString("Make sure any new fields you may have added are supported API fields.")
}, void (e.updatingNow = !1);
u.addNotification({
type: "success",
message: p(a.kind, !0) + " " + a.name + m.getString(" was successfully updated.")
}), g();
}, function(n) {
e.updatingNow = !1, e.error = {
message: t("getErrorDetails")(n)
};
})) : e.error = {
message: o.unsupportedObjectKindOrVersion(n)
} : e.error = {
message: m.getString("Cannot change resource group (original: ") + (r.group || "<none>") + ", modified: " + (s.group || "<none>") + ")."
} : e.error = {
message: o.invalidObjectKindOrVersion(n)
};
} else e.error = {
message: m.getString("Cannot change resource kind (original: ") + i.kind + ", modified: " + (n.kind || "<unspecified>") + ")."
};
}, e.cancel = function() {
g();
}, f.push(c.watchObject(s, e.name, r, function(t, n) {
e.resourceChanged = l(t) !== l(i), e.resourceDeleted = "DELETED" === n;
}, {
errorNotification: !1
}));
}, function(e) {
l.toErrorPage(m.getString("Could not load ") + p(a.kind) + " '" + a.name + "'. " + t("getErrorDetails")(e));
}), e.$on("$destroy", function() {
c.unwatchAll(f);
})) : l.toErrorPage(m.getString("You do not have authority to update ") + p(a.kind) + " " + a.name + ".", "access_denied");
}));
} else l.toErrorPage(m.getString("Kind or name parameter missing."));
} ]), angular.module("openshiftConsole").controller("BrowseCategoryController", [ "$scope", "$filter", "$location", "$q", "$routeParams", "$uibModal", "Constants", "DataService", "LabelFilter", "Navigate", "ProjectsService", "gettextCatalog", function(e, t, n, a, r, o, i, s, c, l, u, d) {
e.projectName = r.project;
var m = function(t, n) {
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
}, p = i.CATALOG_CATEGORIES, g = "none" === r.category ? "" : r.category;
if (e.category = m(p, g), e.category) {
var f;
!r.subcategory || (e.category, g = "none" === r.subcategory ? "" : r.subcategory, f = _.get(e.category, "subcategories", []), e.category = m(f, g), e.category) ? (e.alerts = e.alerts || {}, u.get(r.project).then(_.spread(function(t, n) {
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
}))) : l.toErrorPage(d.getString("Catalog category {{category}}/{{subcategory}}not found.", {
category: r.category,
subcategory: r.subcategory
}));
} else l.toErrorPage(d.getString("Catalog category {{category}} not found.", {
category: r.category
}));
} ]), angular.module("openshiftConsole").controller("CreateFromImageController", [ "$scope", "$filter", "$parse", "$q", "$routeParams", "$uibModal", "APIService", "ApplicationGenerator", "DataService", "HPAService", "ImagesService", "LimitRangesService", "Logger", "MetricsService", "Navigate", "NotificationsService", "ProjectsService", "QuotaService", "SOURCE_URL_PATTERN", "SecretsService", "TaskList", "failureObjectNameFilter", "keyValueEditorUtils", "gettextCatalog", function(e, t, n, a, r, o, i, s, c, l, u, d, m, p, g, f, h, v, y, b, S, C, w, P) {
var k = t("displayName"), j = t("humanize");
e.projectName = r.project, e.sourceURLPattern = y;
var I = r.imageStream;
if (I) if (r.imageTag) {
e.displayName = r.displayName, e.advancedOptions = "true" === r.advanced;
var T = {
name: "app",
value: ""
}, R = t("orderByDisplayName"), N = t("getErrorDetails"), A = {}, E = function() {
f.hideNotification("create-builder-list-config-maps-error"), f.hideNotification("create-builder-list-secrets-error"), _.each(A, function(e) {
!e.id || "error" !== e.type && "warning" !== e.type || f.hideNotification(e.id);
});
};
e.$on("$destroy", E);
var D = i.getPreferredVersion("configmaps"), $ = i.getPreferredVersion("limitranges"), B = i.getPreferredVersion("imagestreams"), L = i.getPreferredVersion("imagestreamtags"), V = i.getPreferredVersion("secrets"), O = i.getPreferredVersion("resourcequotas"), U = i.getPreferredVersion("appliedclusterresourcequotas");
h.get(r.project).then(_.spread(function(t, n) {
e.project = t, r.sourceURI && (e.sourceURIinParams = !0), e.hasClusterResourceOverrides = d.hasClusterResourceOverrides(t);
var i = function() {
e.cpuProblems = d.validatePodLimits(e.limitRanges, "cpu", [ e.container ], t), e.memoryProblems = d.validatePodLimits(e.limitRanges, "memory", [ e.container ], t);
};
c.list($, n).then(function(t) {
e.limitRanges = t.by("metadata.name"), _.isEmpty(e.limitRanges) || e.$watch("container", i, !0);
});
var h, y, C = function() {
e.scaling.autoscale && !e.hasClusterResourceOverrides ? e.showCPURequestWarning = !l.hasCPURequest([ e.container ], e.limitRanges, t) : e.showCPURequestWarning = !1;
};
c.list(O, n).then(function(e) {
h = e.by("metadata.name"), m.log("quotas", h);
}), c.list(U, n).then(function(e) {
y = e.by("metadata.name"), m.log("cluster quotas", y);
}), e.$watch("scaling.autoscale", C), e.$watch("container", C, !0), e.$watch("name", function(e, t) {
T.value && T.value !== t || (T.value = e);
}), function(a) {
a.name = r.name, a.imageName = I, a.imageTag = r.imageTag, a.namespace = r.namespace, a.buildConfig = {
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
}, a.labelArray = [ T ], a.annotations = {}, a.scaling = {
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
}, p.isAvailable().then(function(t) {
e.metricsWarning = !t;
});
var o = [], i = [];
e.valueFromObjects = [], c.list(D, n, null, {
errorNotification: !1
}).then(function(t) {
o = R(t.by("metadata.name")), e.valueFromObjects = o.concat(i);
}, function(e) {
403 !== e.code && f.addNotification({
id: "create-builder-list-config-maps-error",
type: "error",
message: P.getString("Could not load config maps."),
details: N(e)
});
}), c.list(V, n, null, {
errorNotification: !1
}).then(function(t) {
i = R(t.by("metadata.name")), e.valueFromObjects = o.concat(i);
var n = b.groupSecretsByType(t), a = _.mapValues(n, function(e) {
return _.map(e, "metadata.name");
});
e.secretsByType = _.each(a, function(e) {
e.unshift("");
});
}, function(e) {
403 !== e.code && f.addNotification({
id: "create-builder-list-secrets-error",
type: "error",
message: P.getString("Could not load secrets."),
details: N(e)
});
}), c.get(B, a.imageName, {
namespace: a.namespace || r.project
}).then(function(e) {
a.imageStream = e;
var t = a.imageTag;
c.get(L, e.metadata.name + ":" + t, {
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
g.toErrorPage(P.getString("Cannot create from source: the specified image could not be retrieved."));
});
}, function() {
g.toErrorPage(P.getString("Cannot create from source: the specified image could not be retrieved."));
});
}(e);
var x, F = function() {
var t = {
started: P.getString("Creating application {{name}} in project {{projectName}}", {
name: e.name,
projectName: e.projectDisplayName()
}),
success: P.getString("Created application {{name}} in project {{projectName}}", {
name: e.name,
projectName: e.projectDisplayName()
}),
failure: P.getString("Failed to create {{name}} in project {{projectName}}", {
name: e.name,
projectName: e.projectDisplayName()
})
}, o = {};
S.clear(), S.add(t, o, r.project, function() {
var t = a.defer();
return c.batch(x, n).then(function(n) {
var a = [], r = !1;
_.isEmpty(n.failure) ? a.push({
type: "success",
message: P.getString("All resources for application {{name}} were created successfully.", {
name: e.name
})
}) : (r = !0, n.failure.forEach(function(e) {
a.push({
type: "error",
message: P.getString("Cannot create ") + j(e.object.kind).toLowerCase() + ' "' + e.object.metadata.name + '". ',
details: e.data.message
});
}), n.success.forEach(function(e) {
a.push({
type: "success",
message: P.getString("Created {{kind}}  {{name}}  successfully. ", {
kind: j(e.kind).toLowerCase(),
name: e.metadata.name
})
});
})), t.resolve({
alerts: a,
hasErrors: r
});
}), t.promise;
}), g.toNextSteps(e.name, e.projectName, {
usingSampleRepo: e.usingSampleRepo()
});
}, M = function(e) {
o.open({
templateUrl: "views/modals/confirm.html",
controller: "ConfirmModalController",
resolve: {
modalConfig: function() {
return {
alerts: e,
title: P.getString("Confirm Creation"),
details: P.getString("Problems were detected while checking your application configuration."),
okButtonText: P.getString("Create Anyway"),
okButtonClass: "btn-danger",
cancelButtonText: P.getString("Cancel")
};
}
}
}).result.then(F);
}, q = function(t) {
E(), A = t.quotaAlerts || [], e.nameTaken || _.some(A, {
type: "error"
}) ? (e.disableInputs = !1, _.each(A, function(e) {
e.id = _.uniqueId("create-builder-alert-"), f.addNotification(e);
})) : _.isEmpty(A) ? F() : (M(A), e.disableInputs = !1);
};
e.projectDisplayName = function() {
return k(this.project) || this.projectName;
}, e.createApp = function() {
e.disableInputs = !0, E(), e.buildConfig.envVars = w.compactEntries(e.buildConfigEnvVars), e.deploymentConfig.envVars = w.compactEntries(e.DCEnvVarsFromUser), e.labels = w.mapEntries(w.compactEntries(e.labelArray));
var t = s.generate(e);
x = [], angular.forEach(t, function(e) {
null !== e && (m.debug("Generated resource definition:", e), x.push(e));
});
var a = s.ifResourcesDontExist(x, e.projectName), r = v.getLatestQuotaAlerts(x, n), o = function(t) {
return e.nameTaken = t.nameTaken, r;
};
a.then(o, o).then(q, q);
};
})), e.cancel = function() {
g.toProjectOverview(e.projectName);
};
} else g.toErrorPage(P.getString("Cannot create from source: a base image tag was not specified")); else g.toErrorPage(P.getString("Cannot create from source: a base image was not specified"));
} ]), angular.module("openshiftConsole").controller("NextStepsController", [ "$filter", "$routeParams", "$scope", "APIService", "DataService", "Logger", "ProjectsService", function(e, t, n, a, r, o, i) {
e("displayName");
var s = [];
n.alerts = [], n.loginBaseUrl = r.openshiftAPIBaseUrl(), n.buildConfigs = {}, n.projectName = t.project, n.fromSampleRepo = t.fromSample, n.name = t.name;
var c = a.getPreferredVersion("buildconfigs");
i.get(t.project).then(_.spread(function(e, a) {
n.project = e, s.push(r.watch(c, a, function(e) {
n.buildConfigs = e.by("metadata.name"), n.createdBuildConfig = n.buildConfigs[t.name], o.log("buildconfigs (subscribe)", n.buildConfigs);
})), n.$on("$destroy", function() {
r.unwatchAll(s);
});
}));
} ]), angular.module("openshiftConsole").controller("NewFromTemplateController", [ "$filter", "$location", "$parse", "$routeParams", "$scope", "AuthorizationService", "CachedTemplateService", "DataService", "Navigate", "NotificationsService", "ProjectsService", "gettextCatalog", function(e, t, n, a, r, o, i, s, c, l, u, d) {
function m(e, t) {
var n = _.get(e, "spec.triggers", []), a = _.find(n, function(e) {
if ("ImageChange" !== e.type) return !1;
var n = _.get(e, "imageChangeParams.containerNames", []);
return _.includes(n, t.name);
});
return _.get(a, "imageChangeParams.from.name");
}
function p(e) {
for (var t = [], n = k.exec(e); n; ) t.push(n[1]), n = k.exec(e);
return t;
}
function g() {
var e = v();
r.templateImages = _.map(j, function(t) {
return _.isEmpty(t.usesParameters) ? t : {
name: _.template(t.name, {
interpolate: k
})(e),
usesParameters: t.usesParameters
};
});
}
function f(e) {
var t = [], n = S(e);
return n && angular.forEach(n, function(n) {
var a = n.image, r = m(e, n);
r && (a = r), a && t.push(a);
}), t;
}
function h(e) {
j = [];
var t = [], n = {};
angular.forEach(e.objects, function(e) {
if ("BuildConfig" === e.kind) {
var a = P(C(e), b);
a && j.push({
name: a,
usesParameters: p(a)
});
var r = P(w(e), b);
r && (n[r] = !0);
}
"DeploymentConfig" === e.kind && (t = t.concat(f(e)));
}), t.forEach(function(e) {
n[e] || j.push({
name: e,
usesParameters: p(e)
});
}), j = _.uniqBy(j, "name");
}
function v() {
var e = {};
return _.each(r.template.parameters, function(t) {
e[t.name] = t.value;
}), e;
}
var y = a.template, b = a.namespace || "", S = n("spec.template.spec.containers"), C = n("spec.strategy.sourceStrategy.from || spec.strategy.dockerStrategy.from || spec.strategy.customStrategy.from"), w = n("spec.output.to"), P = e("imageObjectRef");
if (y) {
a.templateParamsMap && (r.prefillParameters = function() {
try {
return JSON.parse(a.templateParamsMap);
} catch (e) {
l.addNotification({
id: "template-params-invalid-json",
type: "error",
message: d.getString("Could not prefill parameter values."),
details: "The `templateParamsMap` URL parameter" + d.getString("is not valid JSON. ") + e
});
}
}());
var k = /\${([a-zA-Z0-9\_]+)}/g, j = [];
u.get(a.project).then(_.spread(function(e) {
if (r.project = e, o.canI("processedtemplates", "create", a.project)) if (b) s.get("templates", y, {
namespace: b || r.project.metadata.name
}).then(function(e) {
r.template = e, h(e);
_.some(j, function(e) {
return !_.isEmpty(e.usesParameters);
}) ? (r.parameterDisplayNames = {}, _.each(e.parameters, function(e) {
r.parameterDisplayNames[e.name] = e.displayName || e.name;
}), r.$watch("template.parameters", _.debounce(function() {
r.$apply(g);
}, 50, {
maxWait: 250
}), !0)) : r.templateImages = j;
}, function() {
c.toErrorPage(d.getString("Cannot create from template: the specified template could not be retrieved."));
}); else {
if (r.template = i.getTemplate(), _.isEmpty(r.template)) {
var n = URI("error").query({
error: "not_found",
error_description: d.getString("Template wasn't found in cache.")
}).toString();
t.url(n);
}
i.clearTemplate();
} else c.toErrorPage(d.getString("You do not have authority to process templates in project {{project}}.", {
project: a.project
}), "access_denied");
}));
} else c.toErrorPage(d.getString("Cannot create from template: a template name was not specified."));
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
} ]), angular.module("openshiftConsole").controller("EventsController", [ "$routeParams", "$scope", "ProjectsService", "gettextCatalog", function(e, t, n, a) {
t.projectName = e.project, t.renderOptions = {
hideFilterWidget: !0
}, t.breadcrumbs = [ {
title: a.getString("Monitoring"),
link: "project/" + e.project + "/monitoring"
}, {
title: a.getString("Events")
} ], n.get(e.project).then(_.spread(function(e, n) {
t.project = e, t.projectContext = n;
}));
} ]), angular.module("openshiftConsole").controller("OAuthController", [ "$scope", "$location", "$q", "APIService", "AuthService", "DataService", "Logger", "RedirectLoginService", function(e, t, n, a, r, o, i, s) {
var c = i.get("auth");
e.completeLogin = function() {}, e.cancelLogin = function() {
t.replace(), t.url("./");
};
var l = a.getPreferredVersion("users");
s.finish().then(function(n) {
var a = n.token, i = n.then, s = n.verified, u = n.ttl, d = {
errorNotification: !1,
http: {
auth: {
token: a,
triggerLogin: !1
}
}
};
c.log("OAuthController, got token, fetching user", d), o.get(l, "~", {}, d).then(function(n) {
if (c.log("OAuthController, got user", n), e.completeLogin = function() {
r.setUser(n, a, u);
var e = i || "./";
URI(e).is("absolute") && (c.log("OAuthController, invalid absolute redirect", e), e = "./"), c.log("OAuthController, redirecting", e), t.replace(), t.url(e);
}, s) e.completeLogin(); else {
e.confirmUser = n;
var o = r.UserStore().getUser();
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
} ]), angular.module("openshiftConsole").controller("ErrorController", [ "$scope", "$window", "gettextCatalog", function(e, t, n) {
var a = URI(window.location.href).query(!0);
switch (a.error) {
case "access_denied":
e.errorMessage = n.getString("Access denied");
break;

case "not_found":
e.errorMessage = n.getString("Not found");
break;

case "invalid_request":
e.errorMessage = n.getString("Invalid request");
break;

case "API_DISCOVERY":
e.errorLinks = [ {
href: window.location.protocol + "//" + window.OPENSHIFT_CONFIG.api.openshift.hostPort + window.OPENSHIFT_CONFIG.api.openshift.prefix,
label: n.getString("Check Server Connection"),
target: "_blank"
} ];
break;

default:
e.errorMessage = n.getString("An error has occurred");
}
a.error_description && (e.errorDetails = a.error_description), e.reloadConsole = function() {
t.location.href = "/";
};
} ]), angular.module("openshiftConsole").controller("LogoutController", [ "$scope", "$routeParams", "$log", "AuthService", "AUTH_CFG", "gettextCatalog", function(e, t, n, a, r, o) {
if (n.debug("LogoutController"), a.isLoggedIn()) n.debug("LogoutController, logged in, initiating logout"), e.logoutMessage = o.getString("Logging out..."), a.startLogout().finally(function() {
a.isLoggedIn() ? (n.debug("LogoutController, logout failed, still logged in"), e.logoutMessage = o.getString("You could not be logged out. Return to the ") + '<a href="./">console</a>.') : r.logout_uri ? (n.debug("LogoutController, logout completed, redirecting to AUTH_CFG.logout_uri", r.logout_uri), window.location.href = r.logout_uri) : (n.debug("LogoutController, logout completed, reloading the page"), window.location.reload(!1));
}); else if (r.logout_uri) n.debug("LogoutController, logout completed, redirecting to AUTH_CFG.logout_uri", r.logout_uri), e.logoutMessage = o.getString("Logging out..."), window.location.href = r.logout_uri; else {
n.debug("LogoutController, not logged in, logout complete");
var i = o.getString("You are logged out.");
"timeout" === t.cause && (i = o.getString("You have been logged out due to inactivity.")), e.logoutMessage = i + o.getString(" Return to the ") + '<a href="./">console</a>.';
}
} ]), angular.module("openshiftConsole").controller("CreateController", [ "$scope", "$filter", "$location", "$q", "$routeParams", "$uibModal", "CatalogService", "Constants", "DataService", "LabelFilter", "Logger", "ProjectsService", function(e, t, n, a, r, o, i, s, c, l, u, d) {
e.projectName = r.project, e.categories = s.CATALOG_CATEGORIES, e.alerts = e.alerts || {}, d.get(r.project).then(_.spread(function(t, n) {
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
} ]), angular.module("openshiftConsole").controller("CreateFromURLController", [ "$scope", "$routeParams", "$location", "$filter", "APIService", "AuthService", "AuthorizationService", "DataService", "Navigate", "ProjectsService", "gettextCatalog", function(e, t, n, a, r, o, i, s, c, l, u) {
o.withUser(), e.alerts = {}, e.selected = {};
var d = function(t) {
e.alerts.invalidImageStream = {
type: "error",
message: u.getString('The requested image stream" {{image}} " could not be loaded.', {
image: t
})
};
}, m = function(t) {
e.alerts.invalidImageTag = {
type: "error",
message: u.getString('The requested image stream tag " {{tag}} " could not be loaded.', {
tag: t
})
};
}, p = function(t) {
e.alerts.invalidTemplate = {
type: "error",
message: u.getString('The requested template "{{template}}" could not be loaded.', {
template: t
})
};
}, g = function() {
try {
return t.templateParamsMap && JSON.parse(t.templateParamsMap) || {};
} catch (t) {
e.alerts.invalidTemplateParams = {
type: "error",
message: u.getString("The templateParamsMap is not valid JSON. ") + t
};
}
}, f = r.getPreferredVersion("imagestreams"), h = r.getPreferredVersion("imagestreamtags"), v = r.getPreferredVersion("templates"), y = window.OPENSHIFT_CONSTANTS.CREATE_FROM_URL_WHITELIST, b = [ "namespace", "name", "imageStream", "imageTag", "sourceURI", "sourceRef", "contextDir", "template", "templateParamsMap" ], S = _.pickBy(t, function(e, t) {
return _.includes(b, t) && _.isString(e);
});
S.namespace = S.namespace || "openshift";
_.includes(y, S.namespace) ? S.imageStream && S.template ? e.alerts.invalidResource = {
type: "error",
message: u.getString("Image streams and templates cannot be combined.")
} : S.imageStream || S.template ? S.name && !function(e) {
return _.size(e) < 25 && /^[a-z]([-a-z0-9]*[a-z0-9])?$/.test(e);
}(S.name) ? function(t) {
e.alerts.invalidImageStream = {
type: "error",
message: u.getString("The app name \"{{name}}\" is not valid.  An app name is an alphanumeric (a-z, and 0-9) string with a maximum length of 24 characters, where the first character is a letter (a-z), and the '-' character is allowed anywhere except the first or last character.", {
name: t
})
};
}(S.name) : (S.imageStream && s.get(f, S.imageStream, {
namespace: S.namespace
}, {
errorNotification: !1
}).then(function(t) {
e.imageStream = t, s.get(h, t.metadata.name + ":" + S.imageTag, {
namespace: S.namespace
}, {
errorNotification: !1
}).then(function(t) {
e.imageStreamTag = t, e.validationPassed = !0, e.resource = t, S.displayName = a("displayName")(t);
}, function() {
m(S.imageTag);
});
}, function() {
d(S.imageStream);
}), S.template && s.get(v, S.template, {
namespace: S.namespace
}, {
errorNotification: !1
}).then(function(t) {
e.template = t, g() && (e.validationPassed = !0, e.resource = t);
}, function() {
p(S.template);
})) : e.alerts.resourceRequired = {
type: "error",
message: u.getString("An image stream or template is required.")
} : function(t) {
e.alerts.invalidNamespace = {
type: "error",
message: u.getString('Resources from the namespace "{{name}}" are not permitted.', {
name: t
})
};
}(S.namespace), angular.extend(e, {
createDetails: S,
createWithProject: function(a) {
a = a || e.selected.project.metadata.name;
var r = t.imageStream ? c.createFromImageURL(e.imageStream, S.imageTag, a, S) : c.createFromTemplateURL(e.template, a, S);
n.url(r);
}
}), e.projects = {}, e.canCreateProject = void 0, l.list().then(function(t) {
e.loaded = !0, e.projects = a("orderByDisplayName")(t.by("metadata.name")), e.noProjects = _.isEmpty(e.projects);
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
} ]), angular.module("openshiftConsole").controller("CreateProjectController", [ "$scope", "$location", "$window", "AuthService", "Constants", function(e, t, n, a, r) {
var o = !r.DISABLE_SERVICE_CATALOG_LANDING_PAGE;
e.onProjectCreated = function(e) {
o ? n.history.back() : t.path("project/" + e + "/create");
}, a.withUser();
} ]), angular.module("openshiftConsole").controller("EditProjectController", [ "$scope", "$routeParams", "$filter", "$location", "DataService", "ProjectsService", "Navigate", "gettextCatalog", function(e, t, n, a, r, o, i, s) {
e.alerts = {};
var c = n("annotation"), l = n("annotationName");
o.get(t.project).then(_.spread(function(r) {
var u = function(e) {
return {
description: c(e, "description"),
displayName: c(e, "displayName")
};
}, d = function(e, t) {
var n = angular.copy(e);
return n.metadata.annotations[l("description")] = t.description, n.metadata.annotations[l("displayName")] = t.displayName, n;
};
angular.extend(e, {
project: r,
editableFields: u(r),
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
e.disableInputs = !0, o.update(t.project, d(r, e.editableFields)).then(function() {
t.then ? a.path(t.then) : i.toProjectOverview(r.metadata.name);
}, function(t) {
e.disableInputs = !1, e.editableFields = u(r), e.alerts.update = {
type: "error",
message: s.getString("An error occurred while updating the project"),
details: n("getErrorDetails")(t)
};
});
}
});
}));
} ]), angular.module("openshiftConsole").controller("CreateRouteController", [ "$filter", "$routeParams", "$scope", "$window", "APIService", "ApplicationGenerator", "AuthorizationService", "DataService", "Navigate", "NotificationsService", "ProjectsService", "keyValueEditorUtils", "gettextCatalog", function(e, t, n, a, r, o, i, s, c, l, u, d, m) {
n.renderOptions = {
hideFilterWidget: !0
}, n.projectName = t.project, n.serviceName = t.service, n.labels = [], n.routing = {
name: n.serviceName || ""
}, n.breadcrumbs = [ {
title: m.getString("Routes"),
link: "project/" + n.projectName + "/browse/routes"
}, {
title: m.getString("Create Route")
} ];
var p = r.getPreferredVersion("routes"), g = r.getPreferredVersion("services"), f = function() {
l.hideNotification("create-route-error");
};
n.$on("$destroy", f);
var h = function() {
a.history.back();
};
n.cancel = h, u.get(t.project).then(_.spread(function(a, u) {
if (n.project = a, i.canI(p, "create", t.project)) {
var v, y = e("orderByDisplayName");
n.routing.to = {
kind: "Service",
name: n.serviceName,
weight: 1
};
var b, S = function() {
var e = b, t = _.get(n, "routing.to.name");
b = _.get(v, [ t, "metadata", "labels" ], {});
var a = d.mapEntries(d.compactEntries(n.labels)), r = _.assign(a, b);
e && (r = _.omitBy(r, function(t, n) {
return e[n] && !b[n];
})), n.labels = _.map(r, function(e, t) {
return {
name: t,
value: e
};
});
};
s.list(g, u).then(function(e) {
v = e.by("metadata.name"), n.services = y(v), n.$watch("routing.to.name", S);
}), n.createRoute = function() {
if (n.createRouteForm.$valid) {
f(), n.disableInputs = !0;
var t = n.routing.to.name, a = d.mapEntries(d.compactEntries(n.labels)), i = o.createRoute(n.routing, t, a), c = _.get(n, "routing.alternateServices", []);
_.isEmpty(c) || (i.spec.to.weight = _.get(n, "routing.to.weight"), i.spec.alternateBackends = _.map(c, function(e) {
return {
kind: "Service",
name: e.name,
weight: e.weight
};
}));
var p = r.objectToResourceGroupVersion(i);
s.create(p, null, i, u).then(function() {
l.addNotification({
type: "success",
message: m.getString("Route {{name}} was successfully created.", {
name: i.metadata.name
})
}), h();
}, function(t) {
n.disableInputs = !1, l.addNotification({
type: "error",
id: "create-route-error",
message: m.getString("An error occurred creating the route."),
details: e("getErrorDetails")(t)
});
});
}
};
} else c.toErrorPage(m.getString("You do not have authority to create routes in project {{project}}.", {
project: t.project
}), "access_denied");
}));
} ]), angular.module("openshiftConsole").controller("AttachPVCController", [ "$filter", "$routeParams", "$scope", "$window", "APIService", "AuthorizationService", "BreadcrumbsService", "DataService", "QuotaService", "Navigate", "NotificationsService", "ProjectsService", "StorageService", "RELATIVE_PATH_PATTERN", "gettextCatalog", function(e, t, n, a, r, o, i, s, c, l, u, d, m, p, g) {
if (t.kind && t.name) {
var f = [ "Deployment", "DeploymentConfig", "ReplicaSet", "ReplicationController" ], h = e("humanizeKind");
if (_.includes(f, t.kind)) {
var v = {
resource: r.kindToResource(t.kind),
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
subpage: g.getString("Add Storage")
}), n.pvcVersion = r.getPreferredVersion("persistentvolumeclaims");
var y = r.getPreferredVersion("resourcequotas"), b = r.getPreferredVersion("appliedclusterresourcequotas");
d.get(t.project).then(_.spread(function(r, d) {
if (n.project = r, o.canI(v, "update", t.project)) {
var p = e("orderByDisplayName"), f = e("getErrorDetails"), S = e("generateName"), C = function(e, t) {
n.disableInputs = !0, u.addNotification({
id: "attach-pvc-error",
type: "error",
message: e,
details: t
});
}, w = function() {
u.hideNotification("attach-pvc-error");
};
n.$on("$destroy", w);
var P = function() {
a.history.back();
};
n.cancel = P;
var k = function(e) {
return n.attach.allContainers || n.attach.containers[e.name];
}, j = function() {
var e = _.get(n, "attach.resource.spec.template");
n.existingMountPaths = m.getMountPaths(e, k);
};
n.$watchGroup([ "attach.resource", "attach.allContainers" ], j), n.$watch("attach.containers", j, !0);
var I = function() {
var e = _.get(n, "attach.persistentVolumeClaim");
if (e) {
var t = _.get(n, "attach.resource.spec.template.spec.volumes"), a = _.find(t, {
persistentVolumeClaim: {
claimName: e.metadata.name
}
});
a ? (n.attach.volumeName = a.name, n.volumeAlreadyMounted = !0) : n.volumeAlreadyMounted && (n.attach.volumeName = "", n.volumeAlreadyMounted = !1);
}
};
n.onPVCSelected = I;
s.get(v, t.name, d).then(function(e) {
n.attach.resource = e, n.breadcrumbs = i.getBreadcrumbs({
object: e,
project: r,
subpage: g.getString("Add Storage")
});
var t = _.get(e, "spec.template");
n.existingVolumeNames = m.getVolumeNames(t), I();
}, function(e) {
C(t.name + g.getString(" could not be loaded."), f(e));
}), s.list(n.pvcVersion, d).then(function(e) {
n.pvcs = p(e.by("metadata.name")), _.isEmpty(n.pvcs) || n.attach.persistentVolumeClaim || (n.attach.persistentVolumeClaim = _.head(n.pvcs), I());
}), s.list(y, {
namespace: n.projectName
}, function(e) {
n.quotas = e.by("metadata.name"), n.outOfClaims = c.isAnyStorageQuotaExceeded(n.quotas, n.clusterQuotas);
}), s.list(b, {
namespace: n.projectName
}, function(e) {
n.clusterQuotas = e.by("metadata.name"), n.outOfClaims = c.isAnyStorageQuotaExceeded(n.quotas, n.clusterQuotas);
}), n.attachPVC = function() {
if (n.disableInputs = !0, w(), n.attachPVCForm.$valid) {
n.attach.volumeName || (n.attach.volumeName = S("volume-"));
var e = n.attach.resource, a = _.get(e, "spec.template"), r = n.attach.persistentVolumeClaim, o = n.attach.volumeName, i = n.attach.mountPath, c = n.attach.subPath, l = n.attach.readOnly;
i && angular.forEach(a.spec.containers, function(e) {
if (k(e)) {
var t = m.createVolumeMount(o, i, c, l);
e.volumeMounts || (e.volumeMounts = []), e.volumeMounts.push(t);
}
}), n.volumeAlreadyMounted || (a.spec.volumes = a.spec.volumes || [], a.spec.volumes.push(m.createVolume(o, r))), s.update(v, e.metadata.name, n.attach.resource, d).then(function() {
var e;
i || (e = g.getString("No mount path was provided. The volume reference was added to the configuration, but it will not be mounted into running pods.")), u.addNotification({
type: "success",
message: g.getString("Persistent volume claim {{name}} added to {{kind}} {{route}}.", {
name: r.metadata.name,
kind: h(t.kind),
route: t.name
}),
details: e
}), P();
}, function(e) {
C(g.getString("An error occurred attaching the persistent volume claim to the {{kind}}.", {
kind: h(t.kind)
}), f(e)), n.disableInputs = !1;
});
}
};
} else l.toErrorPage(g.getString("You do not have authority to update ") + h(t.kind) + " " + t.name + ".", "access_denied");
}));
} else l.toErrorPage(g.getString("Storage is not supported for kind {{kind}}.", {
kind: h(t.kind)
}));
} else l.toErrorPage(g.getString("Kind or name parameter missing."));
} ]), angular.module("openshiftConsole").controller("AddConfigVolumeController", [ "$filter", "$location", "$routeParams", "$scope", "$window", "APIService", "AuthorizationService", "BreadcrumbsService", "DataService", "Navigate", "NotificationsService", "ProjectsService", "StorageService", "RELATIVE_PATH_PATTERN", "gettextCatalog", function(e, t, n, a, r, o, i, s, c, l, u, d, m, p, g) {
if (n.kind && n.name) {
var f = [ "Deployment", "DeploymentConfig", "ReplicaSet", "ReplicationController" ];
if (_.includes(f, n.kind)) {
var h = {
resource: o.kindToResource(n.kind),
group: n.group
};
a.projectName = n.project, a.kind = n.kind, a.name = n.name, a.attach = {
allContainers: !0,
pickKeys: !1
}, a.forms = {}, a.RELATIVE_PATH_PATTERN = p, a.breadcrumbs = s.getBreadcrumbs({
name: n.name,
kind: n.kind,
namespace: n.project,
subpage: g.getString("Add Config Files")
}), a.configMapVersion = o.getPreferredVersion("configmaps"), a.secretVersion = o.getPreferredVersion("secrets");
var v = e("humanizeKind");
a.groupByKind = function(e) {
return v(e.kind);
};
a.$watch("attach.source", function() {
_.set(a, "attach.items", [ {} ]);
});
var y = function() {
a.forms.addConfigVolumeForm.$setDirty();
}, b = function() {
r.history.back();
};
a.cancel = b;
var S = function(e, t) {
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
a.attach.items.push({}), y();
}, a.removeItem = function(e) {
a.attach.items.splice(e, 1), y();
}, d.get(n.project).then(_.spread(function(t, r) {
if (a.project = t, i.canI(h, "update", n.project)) {
var o = e("orderByDisplayName"), d = e("getErrorDetails"), p = e("generateName");
c.get(h, n.name, r, {
errorNotification: !1
}).then(function(e) {
a.targetObject = e, a.breadcrumbs = s.getBreadcrumbs({
object: e,
project: t,
subpage: g.getString("Add Config Files")
});
}, function(e) {
a.error = e;
}), c.list(a.configMapVersion, r, null, {
errorNotification: !1
}).then(function(e) {
a.configMaps = o(e.by("metadata.name"));
}, function(e) {
403 !== e.status ? S(g.getString("Could not load config maps"), d(e)) : a.configMaps = [];
}), c.list(a.secretVersion, r, null, {
errorNotification: !1
}).then(function(e) {
a.secrets = o(e.by("metadata.name"));
}, function(e) {
403 !== e.status ? S(g.getString("Could not load secrets"), d(e)) : a.secrets = [];
});
var f = function(e) {
return a.attach.allContainers || a.attach.containers[e.name];
}, y = function() {
var e = _.get(a, "targetObject.spec.template");
a.existingMountPaths = m.getMountPaths(e, f);
};
a.$watchGroup([ "targetObject", "attach.allContainers" ], y), a.$watch("attach.containers", y, !0);
a.$watch("attach.items", function() {
var e = _.map(a.attach.items, "path");
a.itemPaths = _.compact(e);
}, !0), a.addVolume = function() {
if (!a.forms.addConfigVolumeForm.$invalid) {
var t = a.targetObject, o = _.get(a, "attach.source"), i = _.get(t, "spec.template"), s = p("volume-"), l = {
name: s,
mountPath: _.get(a, "attach.mountPath")
};
"Secret" === o.kind && (l.readOnly = !0), _.each(i.spec.containers, function(e) {
f(e) && (e.volumeMounts = e.volumeMounts || [], e.volumeMounts.push(l));
});
var m, v = {
name: s
};
switch (a.attach.pickKeys && (m = a.attach.items), o.kind) {
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
i.spec.volumes = i.spec.volumes || [], i.spec.volumes.push(v), a.disableInputs = !0, C();
var y = e("humanizeKind"), w = y(o.kind), P = y(n.kind);
c.update(h, t.metadata.name, a.targetObject, r).then(function() {
u.addNotification({
type: "success",
message: g.getString("Successfully added ") + w + " " + o.metadata.name + g.getString(" to ") + P + " " + n.name + "."
}), b();
}, function(e) {
a.disableInputs = !1, S(g.getString("An error occurred attaching the {{sourceKind}} to the {{targetKind}}.", {
sourceKind: w,
targetKind: P
}), d(e));
});
}
};
} else l.toErrorPage(g.getString("You do not have authority to update ") + v(n.kind) + " " + n.name + ".", "access_denied");
}));
} else l.toErrorPage(g.getString("Volumes are not supported for kind {{kind}}.", {
kind: n.kind
}));
} else l.toErrorPage(g.getString("Kind or name parameter missing."));
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
} ]), angular.module("openshiftConsole").controller("EditPvcModalController", [ "APIService", "DataService", "$filter", "LimitRangesService", "QuotaService", "$scope", "$uibModalInstance", function(e, t, n, a, r, o, i) {
var s = e.getPreferredVersion("limitranges"), c = e.getPreferredVersion("resourcequotas"), l = e.getPreferredVersion("appliedclusterresourcequotas"), u = n("amountAndUnit"), d = (n("usageWithUnits"), n("usageValue")), m = u(o.pvc.spec.resources.requests.storage);
o.projectName = o.pvc.metadata.namespace, o.typeDisplayName = n("humanizeKind")(o.pvc.metadata.name), o.claim = {}, o.claim.capacity = Number(m[0]), o.claim.unit = m[1], o.disableButton = !0, o.currentCapacityUnits = angular.copy(o.claim), o.units = [ {
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
} ], o.groupUnits = function(e) {
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
}, o.expand = function() {
o.updatedCapacity = o.claim.capacity + o.claim.unit, i.close(o.updatedCapacity);
}, o.cancel = function() {
i.dismiss("cancel");
};
var p = function() {
var e = o.claim.capacity && d(o.claim.capacity + o.claim.unit), t = !0, n = !0;
t = e >= (_.has(o, "limits.min") && d(o.limits.min)), n = e <= (_.has(o, "limits.max") && d(o.limits.max)), o.expandPersistentVolumeClaimForm.capacity.$setValidity("limitRangeMin", t), o.expandPersistentVolumeClaimForm.capacity.$setValidity("limitRangeMax", n);
}, g = function() {
var e = o.claim.capacity && d(o.claim.capacity + o.claim.unit), t = o.currentCapacityUnits.capacity && d(o.currentCapacityUnits.capacity + o.currentCapacityUnits.unit), n = r.willRequestExceedQuota(o.quotas, o.clusterQuotas, "requests.storage", e - t);
o.expandPersistentVolumeClaimForm.capacity.$setValidity("willExceedStorage", !n);
}, f = function(e) {
var t = (o.claim.capacity && d(o.claim.capacity + o.claim.unit)) > (o.currentCapacityUnits.capacity && d(o.currentCapacityUnits.capacity + o.currentCapacityUnits.unit));
o.expandPersistentVolumeClaimForm.capacity.$setValidity("checkCurrentCapacity", t);
};
t.list(s, {
namespace: o.projectName
}, function(e) {
var t = e.by("metadata.name");
if (o.$watchGroup([ "claim.capacity", "claim.unit" ], f), o.disableButton = !1, !_.isEmpty(t)) {
if (o.limits = a.getEffectiveLimitRange(t, "storage", "PersistentVolumeClaim"), o.limits.min && o.limits.max && d(o.limits.min) === d(o.limits.max)) {
var n = u(o.limits.max);
o.claim.capacity = Number(n[0]), o.claim.unit = n[1], o.capacityReadOnly = !0;
}
o.$watchGroup([ "claim.capacity", "claim.unit" ], p);
}
}), t.list(c, {
namespace: o.projectName
}, function(e) {
o.quotas = e.by("metadata.name"), o.$watchGroup([ "claim.capacity", "claim.unit" ], g);
}), t.list(l, {
namespace: o.projectName
}, function(e) {
o.clusterQuotas = e.by("metadata.name");
});
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
} ]), angular.module("openshiftConsole").controller("LogoutModalController", [ "$timeout", "$location", "$filter", "$scope", "$uibModalInstance", "Constants", function(e, t, n, a, r, o) {
a.endTimestamp = moment().add(30, "seconds").toString();
var i = e(function() {
a.logout();
}, 3e4);
a.logout = function() {
e.cancel(i), r.close("logout");
}, a.cancel = function() {
e.cancel(i), r.close("cancel");
}, a.$on("$destroy", function() {
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
} ]), angular.module("openshiftConsole").controller("SetHomePageModalController", [ "$scope", "$uibModalInstance", "HomePagePreferenceService", "ProjectsService", function(e, t, n, a) {
e.homePagePreference = n.getHomePagePreference(), e.availableProjects = [], e.selectedProject = null, e.onProjectSelected = function(t) {
e.selectedProject = t;
}, e.onOpen = function() {
e.homePagePreference = "project-overview";
}, e.preselectedProjectName = n.getHomePageProjectName(), a.list().then(function(t) {
e.availableProjects = _.toArray(t.by("metadata.name")), e.availableProjects = _.reject(e.availableProjects, "metadata.deletionTimestamp"), 1 === e.availableProjects.length ? e.selectedProject = e.availableProjects[0] : e.preselectedProjectName && (e.selectedProject = _.find(e.availableProjects, {
metadata: {
name: e.preselectedProjectName
}
}));
}), e.setHomePage = function() {
var a = {
type: e.homePagePreference
};
"project-overview" === e.homePagePreference && e.selectedProject && (a.project = e.selectedProject.metadata.name), n.setHomePagePreference(a), t.close("setHomePage");
}, e.cancel = function() {
t.dismiss("cancel");
};
} ]), angular.module("openshiftConsole").controller("AboutController", [ "$scope", "$q", "AuthService", "Constants", "DataService", function(e, t, n, a, r) {
n.withUser(), e.version = {
master: {},
console: a.VERSION.console || "unknown"
};
var o = e.version.master, i = [];
i.push(r.getKubernetesMasterVersion().then(function(e) {
o.kubernetes = e.data.gitVersion;
})), i.push(r.getOpenShiftMasterVersion().then(function(e) {
o.openshift = e.data.gitVersion;
})), t.all(i).finally(function() {
o.kubernetes = o.kubernetes || "unknown", o.openshift = o.openshift || "unknown";
});
} ]), angular.module("openshiftConsole").controller("CommandLineController", [ "$scope", "DataService", "AuthService", "Constants", function(e, t, n, a) {
n.withUser(), e.cliDownloadURL = a.CLI, e.cliDownloadURLPresent = e.cliDownloadURL && !_.isEmpty(e.cliDownloadURL), e.loginBaseURL = t.openshiftAPIBaseUrl(), a.DISABLE_COPY_LOGIN_COMMAND || (e.sessionToken = n.UserStore().getToken());
} ]), angular.module("openshiftConsole").controller("CreatePersistentVolumeClaimController", [ "$filter", "$routeParams", "$scope", "$window", "APIService", "ApplicationGenerator", "AuthorizationService", "DataService", "Navigate", "NotificationsService", "ProjectsService", "keyValueEditorUtils", "gettextCatalog", function(e, t, n, a, r, o, i, s, c, l, u, d, m) {
n.projectName = t.project, n.accessModes = "ReadWriteOnce", n.claim = {}, n.breadcrumbs = [ {
title: m.getString("Storage"),
link: "project/" + n.projectName + "/browse/storage"
}, {
title: m.getString("Create Storage")
} ];
var p = {
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
}, g = r.objectToResourceGroupVersion(p), f = function() {
l.hideNotification("create-pvc-error");
};
n.$on("$destroy", f);
var h = function() {
a.history.back();
};
n.cancel = h, u.get(t.project).then(_.spread(function(a, r) {
function o() {
var e = angular.copy(p);
e.metadata.name = n.claim.name, e.spec.accessModes = [ n.claim.accessModes || "ReadWriteOnce" ];
var t = n.claim.unit || "Mi";
if (e.spec.resources.requests.storage = n.claim.amount + t, n.claim.selectedLabels) {
var a = d.mapEntries(d.compactEntries(n.claim.selectedLabels));
_.isEmpty(a) || _.set(e, "spec.selector.matchLabels", a);
}
return n.claim.storageClass && "No Storage Class" !== n.claim.storageClass.metadata.name && (e.metadata.annotations["volume.beta.kubernetes.io/storage-class"] = n.claim.storageClass.metadata.name), e;
}
n.project = a, i.canI(g, "create", t.project) ? n.createPersistentVolumeClaim = function() {
if (f(), n.createPersistentVolumeClaimForm.$valid) {
n.disableInputs = !0;
var t = o();
s.create(g, null, t, r).then(function(e) {
l.addNotification({
type: "success",
message: m.getString("Persistent volume claim {{name}} successfully created.", {
name: e.metadata.name
})
}), h();
}, function(t) {
n.disableInputs = !1, l.addNotification({
id: "create-pvc-error",
type: "error",
message: m.getString("An error occurred requesting storage."),
details: e("getErrorDetails")(t)
});
});
}
} : c.toErrorPage(m.getString("You do not have authority to create persistent volume claims in project {{project}}.", {
project: t.project
}), "access_denied");
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
} ]), angular.module("openshiftConsole").directive("createSecret", [ "$filter", "AuthorizationService", "APIService", "DataService", "NotificationsService", "ApplicationGenerator", "DNS1123_SUBDOMAIN_VALIDATION", "gettextCatalog", function(e, t, n, a, r, o, i, s) {
var c = n.getPreferredVersion("serviceaccounts"), l = n.getPreferredVersion("secrets");
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
link: function(u) {
u.serviceAccountsVersion = n.getPreferredVersion("serviceaccounts"), u.nameValidation = i, u.secretReferenceValidation = {
pattern: /^[a-zA-Z0-9\-_]+$/,
minLength: 8,
description: s.getString("Secret reference key must consist of lower-case, upper-case letters, numbers, dash, and underscore.")
}, u.secretAuthTypeMap = {
generic: {
label: "Generic Secret",
authTypes: [ {
id: "Opaque",
label: "Generic Secret"
} ]
},
image: {
label: "Image Secret",
authTypes: [ {
id: "kubernetes.io/dockerconfigjson",
label: "Image Registry Credentials"
}, {
id: "kubernetes.io/dockercfg",
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
}, u.secretTypes = _.keys(u.secretAuthTypeMap), u.type ? u.newSecret = {
type: u.type,
authType: u.secretAuthTypeMap[u.type].authTypes[0].id,
data: {},
linkSecret: !_.isEmpty(u.serviceAccountToLink),
pickedServiceAccountToLink: u.serviceAccountToLink || ""
} : u.newSecret = {
type: "source",
authType: "kubernetes.io/basic-auth",
data: {
genericKeyValues: {
data: {}
}
},
linkSecret: !1,
pickedServiceAccountToLink: ""
}, u.add = {
gitconfig: !1,
cacert: !1
}, t.canI("serviceaccounts", "list") && t.canI("serviceaccounts", "update") && a.list(c, u, function(e) {
u.serviceAccounts = e.by("metadata.name"), u.serviceAccountsNames = _.keys(u.serviceAccounts);
});
var d = function(e, t) {
var a = {
apiVersion: n.toAPIVersion(l),
kind: "Secret",
metadata: {
name: u.newSecret.data.secretName
},
type: t,
stringData: {}
};
switch (t) {
case "kubernetes.io/basic-auth":
e.passwordToken ? a.stringData.password = e.passwordToken : a.type = "Opaque", e.username && (a.stringData.username = e.username), e.gitconfig && (a.stringData[".gitconfig"] = e.gitconfig), e.cacert && (a.stringData["ca.crt"] = e.cacert);
break;

case "kubernetes.io/ssh-auth":
a.stringData["ssh-privatekey"] = e.privateKey, e.gitconfig && (a.stringData[".gitconfig"] = e.gitconfig);
break;

case "kubernetes.io/dockerconfigjson":
var r = window.btoa(e.dockerUsername + ":" + e.dockerPassword), o = {
auths: {}
};
o.auths[e.dockerServer] = {
username: e.dockerUsername,
password: e.dockerPassword,
email: e.dockerMail,
auth: r
}, a.stringData[".dockerconfigjson"] = JSON.stringify(o);
break;

case "kubernetes.io/dockercfg":
var i = ".dockerconfigjson";
JSON.parse(e.dockerConfig).auths || (a.type = "kubernetes.io/dockercfg", i = ".dockercfg"), a.stringData[i] = e.dockerConfig;
break;

case "Opaque":
e.webhookSecretKey && (a.stringData.WebHookSecretKey = e.webhookSecretKey), _.get(e, "genericKeyValues.data") && (a.data = _.mapValues(e.genericKeyValues.data, window.btoa));
}
return a;
}, m = function() {
r.hideNotification("create-secret-error");
}, p = function(t) {
var o = angular.copy(u.serviceAccounts[u.newSecret.pickedServiceAccountToLink]), i = n.objectToResourceGroupVersion(o);
switch (u.newSecret.type) {
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
a.update(i, u.newSecret.pickedServiceAccountToLink, o, u).then(function(e) {
r.addNotification({
type: "success",
message: s.getString("Secret {{secret}} was created and linked with service account {{name}}.", {
secret: t.metadata.name,
name: e.metadata.name
})
}), u.onCreate({
newSecret: t
});
}, function(n) {
r.addNotification({
type: "success",
message: s.getString("Secret {{secret}} was created.", {
secret: t.metadata.name
})
}), u.serviceAccountToLink || r.addNotification({
id: "secret-sa-link-error",
type: "error",
message: s.getString("An error occurred while linking the secret with service account {{link}}.", {
link: u.newSecret.pickedServiceAccountToLink
}),
details: e("getErrorDetails")(n)
}), u.onCreate({
newSecret: t
});
});
}, g = _.debounce(function() {
try {
JSON.parse(u.newSecret.data.dockerConfig), u.invalidConfigFormat = !1;
} catch (e) {
u.invalidConfigFormat = !0;
}
}, 300, {
leading: !0
});
u.aceChanged = g, u.nameChanged = function() {
u.nameTaken = !1;
}, u.generateWebhookSecretKey = function() {
u.newSecret.data.webhookSecretKey = o._generateSecret();
}, u.create = function() {
m();
var o = d(u.newSecret.data, u.newSecret.authType);
a.create(n.objectToResourceGroupVersion(o), null, o, u).then(function(e) {
u.newSecret.linkSecret && u.serviceAccountsNames.contains(u.newSecret.pickedServiceAccountToLink) && t.canI("serviceaccounts", "update") ? p(e) : (r.addNotification({
type: "success",
message: "Secret " + o.metadata.name + s.getString(" was created.")
}), u.onCreate({
newSecret: e
}));
}, function(t) {
"AlreadyExists" !== (t.data || {}).reason ? r.addNotification({
id: "create-secret-error",
type: "error",
message: s.getString("An error occurred while creating the secret."),
details: e("getErrorDetails")(t)
}) : u.nameTaken = !0;
});
}, u.cancel = function() {
m(), u.onCancel();
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
}), angular.module("openshiftConsole").directive("deleteLink", [ "$uibModal", "$location", "$filter", "$q", "hashSizeFilter", "APIService", "DataService", "Navigate", "NotificationsService", "Logger", "gettextCatalog", function(e, t, n, a, r, o, i, s, c, l, u) {
var d = o.getPreferredVersion("horizontalpodautoscalers");
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
link: function(a, r, m) {
"Project" === m.kind && (a.isProject = !0), a.options = {
deleteHPAs: !0,
deleteImmediately: !1
};
var p = function(e) {
a.stayOnCurrentPage && a.alerts ? a.alerts[e.name] = e.data : c.addNotification(e.data);
}, g = function(e) {
return i.delete(d, e.metadata.name, {
namespace: a.projectName
}).then(function() {
c.addNotification({
type: "success",
message: u.getString("Horizontal pod autoscaler {{name}} was marked for deletion.", {
name: e.metadata.name
})
});
}).catch(function(t) {
p({
name: e.metadata.name,
data: {
type: "error",
message: u.getString("Horizontal pod autoscaler {{name}} could not be deleted.", {
name: e.metadata.name
})
}
}), l.error(u.getString("HPA {{name}} could not be deleted.", {
name: e.metadata.name
}), t);
});
}, f = function() {
if (!a.stayOnCurrentPage) if (a.redirectUrl) t.url(a.redirectUrl); else if ("Project" === a.kind) if ("/" !== t.path()) {
var e = URI("/");
t.url(e);
} else a.$emit("deleteProject"); else s.toResourceList(o.kindToResource(a.kind), a.projectName);
};
a.openDeleteModal = function() {
a.disableDelete || e.open({
templateUrl: "views/modals/delete-resource.html",
controller: "DeleteModalController",
scope: a
}).result.then(function() {
var e = a.kind, t = a.resourceName, r = a.typeDisplayName || n("humanizeKind")(e), s = _.capitalize(r) + " '" + (a.displayName ? a.displayName : t) + "'", d = "Project" === a.kind ? {} : {
namespace: a.projectName
}, m = {};
a.options.deleteImmediately && (m.gracePeriodSeconds = 0, m.propagationPolicy = null), "servicecatalog.k8s.io" === a.group && (m.propagationPolicy = null), i.delete({
resource: o.kindToResource(e),
group: a.group
}, t, d, m).then(function() {
c.addNotification({
type: "success",
message: s + u.getString(" was marked for deletion.")
}), a.success && a.success(), a.options.deleteHPAs && _.each(a.hpaList, g), f();
}).catch(function(e) {
p({
name: t,
data: {
type: "error",
message: _.capitalize(s) + "'" + u.getString(" could not be deleted."),
details: n("getErrorDetails")(e)
}
}), l.error(s + u.getString(" could not be deleted."), e);
});
});
};
}
};
} ]), angular.module("openshiftConsole").directive("editConfigMapOrSecret", [ "DNS1123_SUBDOMAIN_VALIDATION", function(e) {
return {
require: "^form",
restrict: "E",
scope: {
map: "=model",
showNameInput: "=",
type: "@",
readAsBinaryString: "=?"
},
templateUrl: "views/directives/edit-config-map-or-secret.html",
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
var o = t.$watch("map", function(e) {
e && (t.data = _.map(e.data, function(e, t) {
return {
key: t,
value: e
};
}), _.sortBy(t.data, "key"), _.isEmpty(t.data) && t.addItem(), o(), t.$watch("data", function(e) {
var n = {};
_.each(e, function(e) {
n[e.key] = e.value;
}), _.set(t, "map.data", n);
}, !0));
});
}
};
} ]), angular.module("openshiftConsole").directive("editPvc", [ "$uibModal", "$filter", "$routeParams", "APIService", "DataService", "ProjectsService", "NotificationsService", "Logger", "gettextCatalog", function(e, t, n, a, r, o, i, s, c) {
return {
restrict: "E",
scope: {
pvc: "<"
},
template: '<a href="" ng-click="openEditModal()" role="button">Expand PVC</a>',
replace: !0,
link: function(n) {
n.openEditModal = function() {
var o = e.open({
templateUrl: "views/modals/edit-pvc-resource.html",
controller: "EditPvcModalController",
scope: n
}), l = function() {
i.hideNotification("expand-pvc-error");
};
n.$on("$destroy", l), o.result.then(function(e) {
l();
var o = angular.copy(n.pvc);
_.set(o, "spec.resources.requests.storage", e);
var u = n.pvc.kind, d = n.pvc.metadata.name, m = t("humanizeKind")(u) + " '" + d + "'";
r.update({
resource: a.kindToResource(u)
}, d, o, {
namespace: n.pvc.metadata.namespace
}).then(function() {
i.addNotification({
type: "success",
message: m + c.getString(" expand request has been submitted.")
});
}).catch(function(e) {
i.addNotification({
id: "expand-pvc-error",
type: "error",
message: "Could not save " + m,
details: t("getErrorDetails")(e)
}), s.error(m + c.getString(" could not be expanded."), e);
});
});
};
}
};
} ]), function() {
angular.module("openshiftConsole").component("editEnvironmentFrom", {
controller: [ "$attrs", "$filter", "$scope", "keyValueEditorUtils", "SecretsService", function(e, t, n, a, r) {
var o = this, i = t("canI"), s = t("humanizeKind"), c = _.uniqueId(), l = /^[A-Za-z_][A-Za-z0-9_]*$/, u = !1;
o.setFocusClass = "edit-environment-from-set-focus-" + c, o.isEnvVarInvalid = function(e) {
return !l.test(e);
}, o.hasInvalidEnvVar = function(e) {
return _.some(e, function(e, t) {
return o.isEnvVarInvalid(t);
});
}, o.viewOverlayPanel = function(e) {
o.decodedData = e.data, o.overlayPaneEntryDetails = e, "Secret" === e.kind && (o.decodedData = r.decodeSecretData(e.data)), o.overlayPanelVisible = !0;
}, o.closeOverlayPanel = function() {
o.showSecret = !1, o.overlayPanelVisible = !1;
};
var d = function(e, t) {
e && e.push(t || {});
};
o.onAddRow = function() {
d(o.envFromEntries), a.setFocusOn("." + o.setFocusClass);
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
var a = {};
switch (n.kind) {
case "Secret":
a.secretRef = {
name: n.metadata.name
}, delete o.envFromEntries[e].configMapRef;
break;

case "ConfigMap":
a.configMapRef = {
name: n.metadata.name
}, delete o.envFromEntries[e].secretRef;
}
t.prefix && (a.prefix = t.prefix), _.assign(o.envFromEntries[e], a), o.updateEntries(o.envFromEntries);
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
var a, r;
if (n.configMapRef && (a = "configMapRef", r = "configmaps"), n.secretRef && (a = "secretRef", r = "secrets"), a && r) {
var o = n[a].name;
n.configMapRef && o in e && (n.selectedEnvFrom = e[o]), n.secretRef && o in t && (n.selectedEnvFrom = t[o]), i(r, "get") || (n.isReadonly = !0);
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
}(), angular.module("openshiftConsole").directive("events", [ "$routeParams", "$filter", "APIService", "DataService", "KeywordService", "Logger", function(e, t, n, a, r, o) {
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
}, g = [], f = function() {
e.filterExpressions = g = r.generateKeywords(_.get(e, "filter.text"));
}, h = [ "reason", "message", "type" ];
e.resourceKind && e.resourceName || h.splice(0, 0, "involvedObject.name", "involvedObject.kind");
var v = function() {
e.filteredEvents = r.filterForKeywords(u, h, g);
};
e.$watch("filter.text", _.debounce(function() {
f(), e.$evalAsync(v);
}, 50, {
maxWait: 250
}));
var y = function() {
p(), v();
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
}), s.push(a.watch(c, e.projectContext, function(n) {
t = n.by("metadata.name"), b(), o.log("events (subscribe)", e.filteredEvents);
}, {
skipDigest: !0
})), e.$on("$destroy", function() {
a.unwatchAll(s);
});
} ]
};
} ]), angular.module("openshiftConsole").directive("eventsSidebar", [ "$rootScope", "APIService", "DataService", "Logger", function(e, t, n, a) {
var r = t.getPreferredVersion("events");
return {
restrict: "E",
scope: {
projectContext: "=",
collapsed: "="
},
templateUrl: "views/directives/events-sidebar.html",
controller: [ "$scope", function(t) {
var o = [];
o.push(n.watch(r, t.projectContext, function(e) {
var n = e.by("metadata.name");
t.events = _.orderBy(n, [ "lastTimestamp" ], [ "desc" ]), t.warningCount = _.size(_.filter(n, {
type: "Warning"
})), a.log("events (subscribe)", t.events);
})), t.highlightedEvents = {}, t.collapseSidebar = function() {
t.collapsed = !0;
};
var i = [];
i.push(e.$on("event.resource.highlight", function(e, n) {
var a = _.get(n, "kind"), r = _.get(n, "metadata.name");
a && r && _.each(t.events, function(e) {
e.involvedObject.kind === a && e.involvedObject.name === r && (t.highlightedEvents[a + "/" + r] = !0);
});
})), i.push(e.$on("event.resource.clear-highlight", function(e, n) {
var a = _.get(n, "kind"), r = _.get(n, "metadata.name");
a && r && _.each(t.events, function(e) {
e.involvedObject.kind === a && e.involvedObject.name === r && (t.highlightedEvents[a + "/" + r] = !1);
});
})), t.$on("$destroy", function() {
n.unwatchAll(o), _.each(i, function(e) {
e();
}), i = null;
});
} ]
};
} ]), angular.module("openshiftConsole").directive("eventsBadge", [ "$filter", "APIService", "DataService", "Logger", function(e, t, n, a) {
var r = t.getPreferredVersion("events");
return {
restrict: "E",
scope: {
projectContext: "=",
sidebarCollapsed: "="
},
templateUrl: "views/directives/events-badge.html",
controller: [ "$scope", function(t) {
var o = [], i = e("orderObjectsByDate");
o.push(n.watch(r, t.projectContext, function(e) {
var n = e.by("metadata.name");
t.events = i(n, !0), t.warningCount = _.size(_.filter(n, {
type: "Warning"
})), t.normalCount = _.size(_.filter(n, {
type: "Normal"
})), a.log("events (subscribe)", t.events);
})), t.expandSidebar = function() {
t.sidebarCollapsed = !1;
}, t.$on("$destroy", function() {
n.unwatchAll(o);
});
} ]
};
} ]), angular.module("openshiftConsole").directive("fromFile", [ "$filter", "$location", "$q", "$uibModal", "APIService", "CachedTemplateService", "DataService", "Navigate", "NotificationsService", "QuotaService", "SecurityCheckService", "TaskList", "ProjectsService", "gettextCatalog", function(e, t, n, a, r, o, i, s, c, l, u, d, m, p) {
return {
restrict: "E",
scope: {
project: "=",
isDialog: "="
},
templateUrl: "views/directives/from-file.html",
controller: [ "$scope", function(g) {
function f(e) {
return !!e.kind || (g.error = {
message: p.getString("Resource is missing kind field.")
}, !1);
}
function h(e) {
return !!g.isList || (e.metadata ? e.metadata.name ? !e.metadata.namespace || e.metadata.namespace === g.input.selectedProject.metadata.name || (g.error = {
message: e.kind + " " + e.metadata.name + p.getString(" can't be created in project {{name}}", {
name: e.metadata.namespace
}) + p.getString(". Can't create resource in different projects.")
}, !1) : (g.error = {
message: p.getString("Resource name is missing in metadata field.")
}, !1) : (g.error = {
message: p.getString("Resource is missing metadata field.")
}, !1));
}
function v() {
a.open({
templateUrl: "views/modals/process-or-save-template.html",
controller: "ProcessOrSaveTemplateModalController",
scope: g
}).result.then(function() {
g.templateOptions.add ? b() : (o.setTemplate(g.resourceList[0]), S());
});
}
function y() {
a.open({
templateUrl: "views/modals/confirm-replace.html",
controller: "ConfirmReplaceModalController",
scope: g
}).result.then(function() {
l.getLatestQuotaAlerts(g.createResources, {
namespace: g.input.selectedProject.metadata.name
}).then(E);
});
}
function b() {
var e = g.createResources.length, t = g.updateResources.length;
if (g.resourceKind.endsWith("List")) {
var a = [];
t > 0 && a.push(k()), e > 0 && a.push(P()), n.all(a).then(S);
} else w();
}
function S() {
var e, n;
A(), "Template" === g.resourceKind && g.templateOptions.process && !g.errorOccurred ? g.isDialog ? g.$emit("fileImportedFromYAMLOrJSON", {
project: g.input.selectedProject,
template: g.resource
}) : (n = g.templateOptions.add || g.updateResources.length > 0 ? g.input.selectedProject.metadata.name : "", e = s.createFromTemplateURL(g.resource, g.input.selectedProject.metadata.name, {
namespace: n
}), t.url(e)) : g.isDialog ? g.$emit("fileImportedFromYAMLOrJSON", {
project: g.input.selectedProject,
resource: g.resource,
isList: g.isList
}) : (e = s.projectOverviewURL(g.input.selectedProject.metadata.name), t.url(e));
}
function C(e) {
var t = r.objectToResourceGroupVersion(e);
return t ? r.apiInfo(t) ? i.get(t, e.metadata.name, {
namespace: g.input.selectedProject.metadata.name
}, {
errorNotification: !1
}).then(function(t) {
var n = angular.copy(e), a = angular.copy(t.metadata);
a.annotations = e.metadata.annotations, a.labels = e.metadata.labels, n.metadata = a, g.updateResources.push(n);
}, function() {
var t = angular.copy(e);
_.unset(t, "metadata.resourceVersion"), g.createResources.push(t);
}) : (g.errorOccurred = !0, void (g.error = {
message: r.unsupportedObjectKindOrVersion(e)
})) : (g.errorOccurred = !0, void (g.error = {
message: r.invalidObjectKindOrVersion(e)
}));
}
function w() {
var t;
_.isEmpty(g.createResources) ? (t = _.head(g.updateResources), i.update(r.objectToResourceGroupVersion(t), t.metadata.name, t, {
namespace: g.input.selectedProject.metadata.name
}).then(function() {
if (!g.isDialog) {
var e = I(t.kind);
c.addNotification({
type: "success",
message: _.capitalize(e) + " " + t.metadata.name + p.getString(" was successfully updated.")
});
}
S();
}, function(n) {
c.addNotification({
id: "from-file-error",
type: "error",
message: p.getString("Unable to update the ") + I(t.kind) + " '" + t.metadata.name + "'.",
details: e("getErrorDetails")(n)
});
})) : (t = _.head(g.createResources), i.create(r.objectToResourceGroupVersion(t), null, t, {
namespace: g.input.selectedProject.metadata.name
}).then(function() {
if (!g.isDialog) {
var e = I(t.kind);
c.addNotification({
type: "success",
message: _.capitalize(e) + " " + t.metadata.name + p.getString(" was successfully created.")
});
}
S();
}, function(n) {
c.addNotification({
id: "from-file-error",
type: "error",
message: p.getString("Unable to create the ") + I(t.kind) + " '" + t.metadata.name + "'.",
details: e("getErrorDetails")(n)
});
}));
}
function P() {
var e = {
started: p.getString("Creating resources in project {{name}}", {
name: $(g.input.selectedProject)
}),
success: p.getString("Creating resources in project {{name}}", {
name: $(g.input.selectedProject)
}),
failure: p.getString("Failed to create some resources in project {{name}}", {
name: $(g.input.selectedProject)
})
}, t = {};
d.add(e, t, g.input.selectedProject.metadata.name, function() {
var e = n.defer();
return i.batch(g.createResources, {
namespace: g.input.selectedProject.metadata.name
}, "create").then(function(t) {
var n = [], a = !1;
if (t.failure.length > 0) a = !0, g.errorOccurred = !0, t.failure.forEach(function(e) {
n.push({
type: "error",
message: p.getString("Cannot create ") + I(e.object.kind) + ' "' + e.object.metadata.name + '". ',
details: e.data.message
});
}), t.success.forEach(function(e) {
n.push({
type: "success",
message: p.getString("Created ") + I(e.kind) + ' "' + e.metadata.name + '"' + p.getString("successfully.")
});
}); else {
var r;
r = g.isList ? p.getString("All items in list were created successfully.") : I(g.resourceKind) + " " + g.resourceName + p.getString(" was successfully created."), n.push({
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
started: p.getString("Updating resources in project {{name}}", {
name: $(g.input.selectedProject)
}),
success: p.getString("Updated resources in project {{name}}", {
name: $(g.input.selectedProject)
}),
failure: p.getString("Failed to update some resources in project {{name}}", {
name: $(g.input.selectedProject)
})
}, t = {};
d.add(e, t, g.input.selectedProject.metadata.name, function() {
var e = n.defer();
return i.batch(g.updateResources, {
namespace: g.input.selectedProject.metadata.name
}, "update").then(function(t) {
var n = [], a = !1;
if (t.failure.length > 0) a = !0, g.errorOccurred = !0, t.failure.forEach(function(e) {
n.push({
type: "error",
message: p.getString("Cannot update ") + I(e.object.kind) + ' "' + e.object.metadata.name + '". ',
details: e.data.message
});
}), t.success.forEach(function(e) {
n.push({
type: "success",
message: p.getString("Updated ") + I(e.kind) + ' "' + e.metadata.name + '" ' + p.getString("successfully.")
});
}); else {
var r;
r = g.isList ? p.getString("All items in list were updated successfully.") : I(g.resourceKind) + " " + g.resourceName + p.getString(" was successfully updated."), n.push({
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
message: p.getString("An error occurred updating the resources."),
details: "Status: " + t.status + ". " + t.data
}), e.resolve({
alerts: n
});
}), e.promise;
});
}
var j;
g.noProjectsCantCreate = !1;
var I = e("humanizeKind"), T = e("getErrorDetails");
d.clear(), g.$on("no-projects-cannot-create", function() {
g.noProjectsCantCreate = !0;
}), g.input = {
selectedProject: g.project
}, g.$watch("input.selectedProject.metadata.name", function() {
g.projectNameTaken = !1;
}), g.aceLoaded = function(e) {
(j = e.getSession()).setOption("tabSize", 2), j.setOption("useSoftTabs", !0), e.setDragDelay = 0, e.$blockScrolling = 1 / 0;
};
var R = function(e) {
a.open({
templateUrl: "views/modals/confirm.html",
controller: "ConfirmModalController",
resolve: {
modalConfig: function() {
return {
alerts: e,
title: p.getString("Confirm Creation"),
details: p.getString("We checked your application for potential problems. Please confirm you still want to create this application."),
okButtonText: p.getString("Create Anyway"),
okButtonClass: "btn-danger",
cancelButtonText: p.getString("Cancel")
};
}
}
}).result.then(b);
}, N = {}, A = function() {
c.hideNotification("from-file-error"), _.each(N, function(e) {
!e.id || "error" !== e.type && "warning" !== e.type || c.hideNotification(e.id);
});
}, E = function(e) {
A(), N = u.getSecurityAlerts(g.createResources, g.input.selectedProject.metadata.name);
var t = e.quotaAlerts || [];
N = N.concat(t), _.filter(N, {
type: "error"
}).length ? (_.each(N, function(e) {
e.id = _.uniqueId("from-file-alert-"), c.addNotification(e);
}), g.disableInputs = !1) : N.length ? (R(N), g.disableInputs = !1) : b();
}, D = function() {
if (_.has(g.input.selectedProject, "metadata.uid")) return n.when(g.input.selectedProject);
var t = g.input.selectedProject.metadata.name, a = g.input.selectedProject.metadata.annotations["new-display-name"], r = e("description")(g.input.selectedProject);
return m.create(t, a, r);
};
g.create = function() {
if (delete g.error, f(g.resource) && (g.resourceKind = g.resource.kind, g.resourceKind.endsWith("List") ? g.isList = !0 : g.isList = !1, h(g.resource))) {
g.isList ? (g.resourceList = g.resource.items, g.resourceName = "") : (g.resourceList = [ g.resource ], g.resourceName = g.resource.metadata.name, "Template" === g.resourceKind && (g.templateOptions = {
process: !0,
add: !1
})), g.updateResources = [], g.createResources = [];
var e = [];
g.errorOccurred = !1, _.forEach(g.resourceList, function(t) {
if (!h(t)) return g.errorOccurred = !0, !1;
e.push(C(t));
}), D().then(function(t) {
g.input.selectedProject = t, n.all(e).then(function() {
g.errorOccurred || (1 === g.createResources.length && "Template" === g.resourceList[0].kind ? v() : _.isEmpty(g.updateResources) ? l.getLatestQuotaAlerts(g.createResources, {
namespace: g.input.selectedProject.metadata.name
}).then(E) : (g.updateTemplate = 1 === g.updateResources.length && "Template" === g.updateResources[0].kind, g.updateTemplate ? v() : y()));
});
}, function(e) {
"AlreadyExists" === e.data.reason ? g.projectNameTaken = !0 : c.addNotification({
id: "import-create-project-error",
type: "error",
message: p.getString("An error occurred creating project."),
details: T(e)
});
});
}
}, g.cancel = function() {
A(), s.toProjectOverview(g.input.selectedProject.metadata.name);
};
var $ = e("displayName");
g.$on("importFileFromYAMLOrJSON", g.create), g.$on("$destroy", A);
} ]
};
} ]), angular.module("openshiftConsole").directive("oscFileInput", [ "$filter", "Logger", "NotificationsService", "gettextCatalog", function(e, t, n, a) {
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
onFileAdded: "<?",
readAsBinaryString: "<?",
isBinaryFile: "=?"
},
templateUrl: "views/directives/osc-file-input.html",
link: function(r, o) {
function i(o) {
if (o.size > 5242880) n.addNotification({
type: "error",
message: a.getString("The file is too large."),
details: a.getString("The file ") + o.name + a.getString(" is ") + e("humanizeSize")(o.size) + a.getString(". The web console has a 5 MiB file limit.")
}); else {
var i = new FileReader();
i.onloadend = function() {
r.$apply(function() {
r.fileName = o.name, r.model = i.result, r.isBinaryFile = c(i.result);
var e = r.onFileAdded;
_.isFunction(e) && e(i.result), i.error || (r.uploadError = !1);
});
}, i.onerror = function(e) {
r.uploadError = !0, t.error(a.getString("Could not read file"), e);
}, r.readAsBinaryString ? i.readAsBinaryString(o) : i.readAsText(o);
}
}
function s() {
o.find(".drag-and-drop-zone").removeClass("show-drag-and-drop-zone highlight-drag-and-drop-zone");
}
var c = e("isNonPrintable"), l = _.uniqueId("osc-file-input-");
r.dropMessageID = l + "-drop-message", r.helpID = l + "-help", r.supportsFileUpload = window.File && window.FileReader && window.FileList && window.Blob, r.uploadError = !1;
var u = "#" + r.dropMessageID, d = !1, m = !1, p = o.find("input[type=file]");
setTimeout(function() {
var e = o.find(".drag-and-drop-zone");
e.on("dragover", function() {
r.disabled || (e.addClass("highlight-drag-and-drop-zone"), d = !0);
}), o.find(".drag-and-drop-zone p").on("dragover", function() {
r.disabled || (d = !0);
}), e.on("dragleave", function() {
r.disabled || (d = !1, _.delay(function() {
d || e.removeClass("highlight-drag-and-drop-zone");
}, 200));
}), e.on("drop", function(e) {
if (!r.disabled) {
var t = _.get(e, "originalEvent.dataTransfer.files", []);
return t.length > 0 && (r.file = _.head(t), i(r.file)), s(), $(".drag-and-drop-zone").trigger("putDropZoneFront", !1), $(".drag-and-drop-zone").trigger("reset"), !1;
}
});
var t = function(e, t) {
var n = t.find("label").outerHeight(), a = n ? t.outerHeight() - n : t.outerHeight(), r = t.outerWidth();
e.css({
width: r + 6,
height: a,
position: "absolute",
"z-index": 100
});
};
e.on("putDropZoneFront", function(e, n) {
if (!r.disabled) {
var a, i = o.find(".drag-and-drop-zone");
return n ? (a = r.dropZoneId ? $("#" + r.dropZoneId) : o, t(i, a)) : i.css("z-index", "-1"), !1;
}
}), e.on("reset", function() {
if (!r.disabled) return m = !1, !1;
});
}), $(document).on("drop." + l, function() {
return s(), o.find(".drag-and-drop-zone").trigger("putDropZoneFront", !1), !1;
}), $(document).on("dragenter." + l, function() {
if (!r.disabled) return m = !0, o.find(".drag-and-drop-zone").addClass("show-drag-and-drop-zone"), o.find(".drag-and-drop-zone").trigger("putDropZoneFront", !0), !1;
}), $(document).on("dragover." + l, function() {
if (!r.disabled) return m = !0, o.find(".drag-and-drop-zone").addClass("show-drag-and-drop-zone"), !1;
}), $(document).on("dragleave." + l, function() {
return m = !1, _.delay(function() {
m || o.find(".drag-and-drop-zone").removeClass("show-drag-and-drop-zone");
}, 200), !1;
}), r.cleanInputValues = function() {
r.model = "", r.fileName = "", r.isBinaryFile = !1, p[0].value = "";
}, p.change(function() {
i(p[0].files[0]), p[0].value = "";
}), r.$on("$destroy", function() {
$(u).off(), $(document).off("drop." + l).off("dragenter." + l).off("dragover." + l).off("dragleave." + l);
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
}, a.disableWildcards = t.DISABLE_WILDCARD_ROUTES || a.existingRoute && "Subdomain" !== a.route.wildcardPolicy, a.areCertificateInputsReadOnly = function() {
return !a.canICreateCustomHosts;
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
var m = !1;
a.$watch("route.alternateServices.length", function(e) {
if (0 === e && _.has(a, "route.to.weight") && delete a.route.to.weight, 1 === e) {
if (0 === a.route.to.weight && 0 === a.route.alternateServices[0].weight) return void (a.controls.hideSlider = !0);
m = !0, a.controls.rangeSlider = a.weightAsPercentage(a.route.to.weight);
}
}), a.$watch("controls.hideSlider", function(e) {
e || 1 !== _.size(a.route.alternateServices) || (m = !0, a.controls.rangeSlider = a.weightAsPercentage(a.route.to.weight));
}), a.$watch("controls.rangeSlider", function(e, t) {
m ? m = !1 : e !== t && (e = parseInt(e, 10), _.set(a, "route.to.weight", e), _.set(a, "route.alternateServices[0].weight", 100 - e));
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
}), angular.module("openshiftConsole").directive("oscPersistentVolumeClaim", [ "$filter", "APIService", "DataService", "LimitRangesService", "QuotaService", "ModalsService", "DNS1123_SUBDOMAIN_VALIDATION", function(e, t, n, a, r, o, i) {
var s = t.getPreferredVersion("storageclasses"), c = t.getPreferredVersion("limitranges"), l = t.getPreferredVersion("resourcequotas"), u = t.getPreferredVersion("appliedclusterresourcequotas");
return {
restrict: "E",
scope: {
claim: "=model",
projectName: "="
},
templateUrl: "views/directives/osc-persistent-volume-claim.html",
link: function(t) {
var d = e("amountAndUnit"), m = e("storageClassAccessMode"), p = e("usageValue");
t.nameValidation = i, t.storageClasses = [], t.defaultStorageClass = "", t.claim.accessModes = "ReadWriteOnce", t.claim.unit = "Gi", t.units = [ {
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
var g = [];
t.$watch("useLabels", function(e, n) {
e !== n && (e ? t.claim.selectedLabels = g : (g = t.claim.selectedLabels, t.claim.selectedLabels = []));
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
}, t.onStorageClassSelected = function(e) {
var n = m(e);
n && (t.claim.accessModes = n);
};
var f = function() {
var e = t.claim.amount && p(t.claim.amount + t.claim.unit), n = _.has(t, "limits.min") && p(t.limits.min), a = _.has(t, "limits.max") && p(t.limits.max), r = !0, o = !0;
e && n && (r = e >= n), e && a && (o = e <= a), t.persistentVolumeClaimForm.capacity.$setValidity("limitRangeMin", r), t.persistentVolumeClaimForm.capacity.$setValidity("limitRangeMax", o);
}, h = function() {
var e = r.isAnyStorageQuotaExceeded(t.quotas, t.clusterQuotas), n = r.willRequestExceedQuota(t.quotas, t.clusterQuotas, "requests.storage", t.claim.amount + t.claim.unit);
t.persistentVolumeClaimForm.capacity.$setValidity("willExceedStorage", !n), t.persistentVolumeClaimForm.capacity.$setValidity("outOfClaims", !e);
};
n.list(s, {}, function(n) {
var a = n.by("metadata.name");
if (!_.isEmpty(a)) {
t.storageClasses = _.sortBy(a, "metadata.name");
var r = e("annotation");
if (t.defaultStorageClass = _.find(t.storageClasses, function(e) {
return "true" === r(e, "storageclass.beta.kubernetes.io/is-default-class");
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
t.limits = a.getEffectiveLimitRange(n, "storage", "PersistentVolumeClaim");
var r;
t.limits.min && t.limits.max && p(t.limits.min) === p(t.limits.max) && (r = d(t.limits.max), t.claim.amount = Number(r[0]), t.claim.unit = r[1], t.capacityReadOnly = !0), t.$watchGroup([ "claim.amount", "claim.unit" ], f);
}
}), n.list(l, {
namespace: t.projectName
}, function(e) {
t.quotas = e.by("metadata.name"), t.$watchGroup([ "claim.amount", "claim.unit" ], h);
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
showRequestInput: "&"
},
templateUrl: "views/directives/osc-autoscaling.html",
link: function(t, a, r) {
t.nameValidation = n;
var o = e.DEFAULT_HPA_CPU_TARGET_PERCENT, i = _.get(t, "autoscaling.targetCPU");
_.isNil(i) && o && _.set(t, "autoscaling.targetCPU", o), "showRequestInput" in r || (t.showRequestInput = !0);
}
};
} ]), angular.module("openshiftConsole").directive("oscSecrets", [ "$uibModal", "$filter", "APIService", "DataService", "SecretsService", function(e, t, n, a, r) {
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
a.list(t.secretsVersion, {
namespace: t.namespace
}, function(n) {
var a = r.groupSecretsByType(n), o = _.mapValues(a, function(e) {
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
} ]), angular.module("openshiftConsole").directive("oscSourceSecrets", [ "$uibModal", "$filter", "APIService", "DataService", "SecretsService", function(e, t, n, a, r) {
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
a.list(t.secretsVersion, {
namespace: t.namespace
}, function(n) {
var a = r.groupSecretsByType(n), o = _.mapValues(a, function(e) {
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
}), angular.module("openshiftConsole").directive("containerStatuses", [ "$filter", "APIService", function(e, t) {
return {
restrict: "E",
scope: {
pod: "=",
onDebugTerminal: "=?",
detailed: "=?"
},
templateUrl: "views/_container-statuses.html",
link: function(n) {
n.hasDebugTerminal = angular.isFunction(n.onDebugTerminal), n.podsVersion = t.getPreferredVersion("pods");
var a = e("isContainerTerminatedSuccessfully"), r = function(e) {
return _.every(e, a);
};
n.$watch("pod", function(e) {
n.initContainersTerminated = r(e.status.initContainerStatuses), !1 !== n.expandInitContainers && (n.expandInitContainers = !n.initContainersTerminated);
}), n.toggleInitContainer = function() {
n.expandInitContainers = !n.expandInitContainers;
}, n.showDebugAction = function(t) {
if ("Completed" === _.get(n.pod, "status.phase")) return !1;
if (e("annotation")(n.pod, "openshift.io/build.name")) return !1;
if (e("isDebugPod")(n.pod)) return !1;
var a = _.get(t, "state.waiting.reason");
return "ImagePullBackOff" !== a && "ErrImagePull" !== a && (!_.get(t, "state.running") || !t.ready);
}, n.debugTerminal = function(e) {
if (n.hasDebugTerminal) return n.onDebugTerminal.call(this, e);
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
}).directive("volumes", [ "APIService", function(e) {
return {
restrict: "E",
scope: {
volumes: "=",
namespace: "=",
canRemove: "=?",
removeFn: "&?"
},
templateUrl: "views/_volumes.html",
link: function(t) {
t.secretsVersion = e.getPreferredVersion("secrets");
}
};
} ]).directive("volumeClaimTemplates", function() {
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
}), angular.module("openshiftConsole").directive("sidebar", [ "$location", "$filter", "$timeout", "$rootScope", "$routeParams", "APIService", "AuthorizationService", "Constants", "HTMLService", "gettextCatalog", function(e, t, n, a, r, o, i, s, c, l) {
var u = function(e, t) {
return e.href === t || _.some(e.prefixes, function(e) {
return _.startsWith(t, e);
});
};
return {
restrict: "E",
templateUrl: "views/_sidebar.html",
controller: [ "$scope", function(d) {
function m(e) {
return g.hasOwnProperty(e) ? g[e] : e;
}
var p, g = {
Overview: l.getString("Overview"),
Applications: l.getString("Applications"),
Deployments: l.getString("Deployments"),
"Stateful Sets": l.getString("Stateful Sets"),
Pods: l.getString("Pods"),
Services: l.getString("Services"),
Routes: l.getString("Routes"),
"Provisioned Services": l.getString("Provisioned Services"),
Builds: l.getString("Builds"),
Pipelines: l.getString("Pipelines"),
Images: l.getString("Images"),
Resources: l.getString("Resources"),
Quota: l.getString("Quota"),
Membership: l.getString("Membership"),
"Config Maps": l.getString("Config Maps"),
Secrets: l.getString("Secrets"),
"Other Resources": l.getString("Other Resources"),
Storage: l.getString("Storage"),
Monitoring: l.getString("Monitoring"),
Events: l.getString("Events"),
Logs: l.getString("Logs"),
Metrics: l.getString("Metrics"),
Catalog: l.getString("Catalog")
};
d.navItems = s.PROJECT_NAVIGATION, d.navItems.map(function(e) {
e.label = m(e.label), e.secondaryNavSections && e.secondaryNavSections.map(function(e) {
e.items.map(function(e) {
e.label = m(e.label);
});
});
}), d.sidebar = {};
var f = function() {
d.projectName = r.project, _.set(d, "sidebar.secondaryOpen", !1), _.set(a, "nav.showMobileNav", !1), d.activeSecondary = null, d.activePrimary = _.find(d.navItems, function(t) {
return p = e.path().replace("/project/" + d.projectName, ""), u(t, p) ? (d.activeSecondary = null, !0) : _.some(t.secondaryNavSections, function(e) {
var t = _.find(e.items, function(e) {
return u(e, p);
});
return !!t && (d.activeSecondary = t, !0);
});
});
};
f(), d.$on("$routeChangeSuccess", f);
var h = function() {
_.each(d.navItems, function(e) {
e.isHover = !1;
});
};
d.navURL = function(e) {
return e ? t("isAbsoluteURL")(e) ? e : "project/" + d.projectName + e : "";
}, d.show = function(e) {
if (!(!e.isValid || e.isValid())) return !1;
if (!e.canI) return !0;
if (e.canI.addToProject) return d.canIAddToProject;
var t = _.pick(e.canI, [ "resource", "group", "version" ]);
return o.apiInfo(t) && i.canI(t, e.canI.verb, d.projectName);
}, d.itemClicked = function(e) {
if (h(), e.href) return d.nav.showMobileNav = !1, void (d.sidebar.secondaryOpen = !1);
e.isHover = !0, e.mobileSecondary = d.isMobile, d.sidebar.showMobileSecondary = d.isMobile, d.sidebar.secondaryOpen = !0;
}, d.onMouseEnter = function(e) {
e.mouseLeaveTimeout && (n.cancel(e.mouseLeaveTimeout), e.mouseLeaveTimeout = null), e.mouseEnterTimeout = n(function() {
e.isHover = !0, e.mouseEnterTimeout = null, d.sidebar.secondaryOpen = !_.isEmpty(e.secondaryNavSections);
}, 200);
}, d.onMouseLeave = function(e) {
e.mouseEnterTimeout && (n.cancel(e.mouseEnterTimeout), e.mouseEnterTimeout = null), e.mouseLeaveTimeout = n(function() {
e.isHover = !1, e.mouseLeaveTimeout = null, d.sidebar.secondaryOpen = _.some(d.navItems, function(e) {
return e.isHover && !_.isEmpty(e.secondaryNavSections);
});
}, 300);
}, d.closeNav = function() {
h(), d.nav.showMobileNav = !1, d.sidebar.secondaryOpen = !1;
}, d.collapseMobileSecondary = function(e, t) {
e.mobileSecondary = !1, t.stopPropagation();
};
var v = function() {
return c.isWindowBelowBreakpoint(c.WINDOW_SIZE_SM);
};
d.isMobile = v();
var y = _.throttle(function() {
var e = v();
e !== d.isMobile && d.$evalAsync(function() {
d.isMobile = e, e || (_.set(a, "nav.showMobileNav", !1), _.each(d.navItems, function(e) {
e.mobileSecondary = !1;
}));
});
}, 50);
$(window).on("resize.verticalnav", y), d.$on("$destroy", function() {
$(window).off(".verticalnav");
});
} ]
};
} ]).directive("oscHeader", [ "$filter", "$location", "$q", "$rootScope", "$routeParams", "$timeout", "APIService", "AuthorizationService", "Catalog", "CatalogService", "Constants", "DataService", "Navigate", "NotificationsService", "ProjectsService", "projectOverviewURLFilter", "RecentlyViewedServiceItems", function(e, t, n, a, r, o, i, s, c, l, u, d, m, p, g, f, h) {
var v = {}, y = [], b = e("displayName"), S = e("uniqueDisplayName"), C = i.getPreferredVersion("templates");
return {
restrict: "EA",
templateUrl: "views/directives/header/header.html",
link: function(i, p) {
i.currentProject = v[r.project];
var w = function(e, t) {
var n;
_.set(a, "nav.collapsed", e), t && (n = e ? "true" : "false", localStorage.setItem("openshift/vertical-nav-collapsed", n));
};
!function() {
var e = "true" === localStorage.getItem("openshift/vertical-nav-collapsed");
w(e);
}();
var P = function() {
return _.get(a, "nav.collapsed", !1);
}, k = function(e) {
_.set(a, "nav.showMobileNav", e);
}, j = function(e) {
"/catalog" === t.path() ? e.selectpicker("val", "catalog") : e.selectpicker("val", "application-console");
}, I = function(e) {
i.$evalAsync(function() {
t.url(e);
});
};
i.toggleNav = function() {
var e = P();
w(!e, !0), a.$emit("oscHeader.toggleNav");
}, i.toggleMobileNav = function() {
var e = _.get(a, "nav.showMobileNav");
k(!e);
}, i.closeMobileNav = function() {
k(!1);
}, i.closeOrderingPanel = function() {
i.orderingPanelVisible = !1;
}, i.showOrderingPanel = function(e) {
i.orderingPanelVisible = !0, i.orderKind = e;
}, i.onSearchToggle = function(e) {
_.set(a, "view.hasProjectSearch", e);
}, i.catalogLandingPageEnabled = !u.DISABLE_SERVICE_CATALOG_LANDING_PAGE;
var T = p.find(".contextselector");
i.clusterConsoleURL = window.OPENSHIFT_CONFIG.adminConsoleURL, T.on("loaded.bs.select", function() {
j(T);
}).change(function() {
switch ($(this).val()) {
case "catalog":
I("/catalog");
break;

case "application-console":
I("/projects");
break;

case "cluster-console":
window.location.assign(i.clusterConsoleURL);
}
});
var R = p.find(".project-picker"), N = [], A = function() {
var t = i.currentProjectName;
if (t) {
var n = function(e, n) {
var a = $("<option>").attr("value", e.metadata.name).attr("selected", e.metadata.name === t);
return n ? a.text(b(e)) : a.text(S(e, y)), a;
};
_.size(v) <= 100 ? (y = e("orderByDisplayName")(v), N = _.map(y, function(e) {
return n(e, !1);
})) : N = [ n(v[t], !0) ], R.empty(), R.append(N), R.append($('<option data-divider="true"></option>')), R.append($('<option value="">View All Projects</option>')), R.selectpicker("refresh");
}
}, E = function() {
return g.list().then(function(e) {
v = e.by("metadata.name");
});
}, D = function() {
j(T);
var e = r.project;
if (i.currentProjectName !== e) {
i.currentProjectName = e, i.chromeless = "chromeless" === r.view;
var t, o;
e && !i.chromeless ? (_.set(a, "view.hasProject", !0), i.canIAddToProject = !1, s.getProjectRules(e).then(function() {
if (i.currentProjectName === e && (i.canIAddToProject = s.canIAddToProject(e), i.canIAddToProject)) {
var a = l.getCatalogItems().then(function(e) {
t = e;
}), r = c.getProjectCatalogItems(e).then(_.spread(function(e) {
o = e;
}));
n.all([ a, r ]).then(function() {
i.catalogItems = c.sortCatalogItems(_.concat(t, o));
});
}
}), E().then(function() {
i.currentProjectName && v && (v[i.currentProjectName] || (v[i.currentProjectName] = {
metadata: {
name: i.currentProjectName
}
}), i.currentProject = v[i.currentProjectName], A());
})) : _.set(a, "view.hasProject", !1);
}
}, B = function() {
i.orderingPanelVisible && h.addItem(_.get(i.selectedItem, "resource.metadata.uid"));
}, L = function(e) {
return "PartialObjectMetadata" === e.kind;
}, V = function(e) {
return L(e) ? d.get(C, e.metadata.name, {
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
}) : V(t.resource).then(function(e) {
i.selectedItem = e, i.orderingPanelVisible = !0, i.orderKind = "Template";
}));
});
var O = a.$on("filter-catalog-items", function(e, t) {
if (i.currentProjectName) {
var n = {
filter: t.searchText
};
m.toProjectCatalog(i.currentProjectName, n);
}
});
i.closeOrderingPanel = function() {
h.addItem(_.get(i.selectedItem, "resource.metadata.uid")), i.orderingPanelVisible = !1;
}, D(), i.$on("$routeChangeSuccess", D), R.change(function() {
var e = $(this).val(), t = "" === e ? "projects" : f(e);
I(t);
}), i.$on("$destroy", function() {
O(), B();
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
angular.module("openshiftConsole").component("istagSelect", {
controller: [ "$scope", "APIService", "DataService", "ProjectsService", function(e, t, n, a) {
var r = this, o = t.getPreferredVersion("imagestreams");
r.isByNamespace = {}, r.isNamesByNamespace = {};
var i = _.get(r, "istag.namespace") && _.get(r, "istag.imageStream") && _.get(r, "istag.tagObject.tag"), s = function(e) {
_.each(e, function(e) {
_.get(e, "status.tags") || _.set(e, "status.tags", []);
});
}, c = function(e) {
if (r.isByNamespace[e] = {}, r.isNamesByNamespace[e] = [], !_.includes(r.namespaces, e)) return r.namespaces.push(e), r.isNamesByNamespace[e] = r.isNamesByNamespace[e].concat(r.istag.imageStream), void (r.isByNamespace[e][r.istag.imageStream] = {
status: {
tags: [ {
tag: r.istag.tagObject.tag
} ]
}
});
n.list(o, {
namespace: e
}, function(t) {
var n = angular.copy(t.by("metadata.name"));
s(n), r.isByNamespace[e] = n, r.isNamesByNamespace[e] = _.keys(n).sort(), _.includes(r.isNamesByNamespace[e], r.istag.imageStream) || (r.isNamesByNamespace[e] = r.isNamesByNamespace[e].concat(r.istag.imageStream), r.isByNamespace[e][r.istag.imageStream] = {
status: {
tags: {}
}
}), _.find(r.isByNamespace[e][r.istag.imageStream].status.tags, {
tag: r.istag.tagObject.tag
}) || r.isByNamespace[e][r.istag.imageStream].status.tags.push({
tag: r.istag.tagObject.tag
});
});
};
a.list().then(function(e) {
r.namespaces = _.keys(e.by("metadata.name")), r.includeSharedNamespace && (r.namespaces = _.uniq([ "openshift" ].concat(r.namespaces))), r.namespaces = r.namespaces.sort(), r.namespaceChanged(r.istag.namespace);
}), r.namespaceChanged = function(e) {
if (i || (r.istag.imageStream = null, r.istag.tagObject = null), e && !r.isByNamespace[e]) return i ? (c(e), void (i = !1)) : void n.list(o, {
namespace: e
}, function(t) {
var n = angular.copy(t.by("metadata.name"));
s(n), r.isByNamespace[e] = n, r.isNamesByNamespace[e] = _.keys(n).sort();
});
}, r.getTags = function(e) {
r.allowCustomTag && e && !_.find(r.isByNamespace[r.istag.namespace][r.istag.imageStream].status.tags, {
tag: e
}) && (_.remove(r.isByNamespace[r.istag.namespace][r.istag.imageStream].status.tags, function(e) {
return !e.items;
}), r.isByNamespace[r.istag.namespace][r.istag.imageStream].status.tags.unshift({
tag: e
}));
}, r.groupTags = function(e) {
return r.allowCustomTag ? e.items ? "Current Tags" : "New Tag" : "";
};
} ],
controllerAs: "$ctrl",
bindings: {
istag: "=model",
selectDisabled: "<",
selectRequired: "<",
includeSharedNamespace: "<",
allowCustomTag: "<",
appendToBody: "<"
},
require: {
parent: "^form"
},
templateUrl: "components/istag-select/istag-select.html"
});
}(), function() {
angular.module("openshiftConsole").component("oscWebhookTriggers", {
controller: [ "$filter", "$scope", "$timeout", "$uibModal", "APIService", function(e, t, n, a, r) {
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
t.namespace = o.namespace, t.type = o.type, o.secretsVersion = r.getPreferredVersion("secrets"), o.webhookTypesOptions = [ {
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
var a = _.first(o.webhookTriggers);
a.lastTriggerType = "", a.data = {
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
a.open({
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
}).directive("copyLoginToClipboard", [ "NotificationsService", "gettextCatalog", function(e, t) {
return {
restrict: "E",
replace: !0,
scope: {
clipboardText: "@"
},
template: '<a href="" data-clipboard-text="">Copy Login Command</a>',
link: function(n, a) {
var r = new Clipboard(a.get(0));
r.on("success", function() {
e.addNotification({
id: "copy-login-command-success",
type: "success",
message: t.getString("Login command copied.")
});
e.addNotification({
id: "openshift/token-warning",
type: "warning",
message: t.getString("A token is a form of a password. Do not share your API token."),
links: [ {
href: "",
label: t.getString("Don't Show Me Again"),
onClick: function() {
return e.permanentlyHideNotification("openshift/token-warning"), !0;
}
} ]
});
}), r.on("error", function() {
e.addNotification({
id: "copy-login-command-error",
type: "error",
message: t.getString("Unable to copy the login command.")
});
}), a.on("$destroy", function() {
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
var a = t.search();
a.tab = e[0], t.replace().search(a);
}
}, !0);
}
};
} ]).directive("switchLanguage", [ "$cookieStore", "$rootScope", "gettextCatalog", function(e, t, n) {
return {
restrict: "E",
replace: !0,
template: '<div class="language-switch"><span class="language-text">' + n.getString("Language") + '</span><span id="zh_CNLanguageBtn" class="language-btn" ng-class="{\'active\': isZh}" ng-click="switchLanguage(\'zh_CN\')">' + n.getString("CN") + '</span><span id="enLanguageBtn" class="language-btn" ng-class="{\'active\': isEn}" ng-click="switchLanguage(\'en\')">' + n.getString("EN") + "</span></div>",
link: function(n) {
n.switchLanguage = function(t) {
$("#zh_CNLanguageBtn").toggleClass("active-language"), $("#enLanguageBtn").toggleClass("active-language"), e.put("openshift_language", t), window.location.reload();
}, n.isZh = "zh_CN" === t.language, n.isEn = "en" === t.language;
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
}), angular.module("openshiftConsole").directive("editLifecycleHook", [ "APIService", function(e) {
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
controller: [ "$scope", function(t) {
t.secretsVersion = e.getPreferredVersion("secrets"), t.configMapsVersion = e.getPreferredVersion("configmaps"), t.view = {
isDisabled: !1
}, t.lifecycleHookFailurePolicyTypes = [ "Abort", "Retry", "Ignore" ], t.istagHook = {}, t.removedHookParams = {}, t.action = {
type: _.has(t.hookParams, "tagImages") ? "tagImages" : "execNewPod"
};
var n = {
command: [],
env: [],
volumes: [],
containerName: t.availableContainers[0] || ""
}, a = {
to: {},
containerName: t.availableContainers[0] || ""
}, r = function(e) {
var n = {};
if (_.isEmpty(e)) n = {
namespace: t.namespace,
imageStream: "",
tagObject: null
}; else {
var a = e.name.split(":");
n = {
namespace: e.namespace || t.namespace,
imageStream: a[0],
tagObject: {
tag: a[1]
}
};
}
return n;
}, o = function() {
"execNewPod" === t.action.type ? (_.has(t.removedHookParams, "execNewPod") ? t.hookParams.execNewPod = t.removedHookParams.execNewPod : t.hookParams.execNewPod = _.get(t, "hookParams.execNewPod", {}), t.hookParams.execNewPod = _.merge(angular.copy(n), t.hookParams.execNewPod)) : (_.has(t.removedHookParams, "tagImages") ? t.hookParams.tagImages = t.removedHookParams.tagImages : t.hookParams.tagImages = _.get(t, "hookParams.tagImages", [ {} ]), t.hookParams.tagImages = [ _.merge(angular.copy(a), t.hookParams.tagImages[0]) ], t.istagHook = r(_.head(t.hookParams.tagImages).to)), t.hookParams.failurePolicy = _.get(t.hookParams, "failurePolicy", "Abort");
};
t.addHook = function() {
_.isEmpty(t.removedHookParams) ? (t.hookParams = {}, o()) : t.hookParams = t.removedHookParams;
}, t.removeHook = function() {
t.removedHookParams = t.hookParams, delete t.hookParams, t.editForm.$setDirty();
};
t.$watchGroup([ "hookParams", "action.type" ], function() {
t.hookParams && ("execNewPod" === t.action.type ? (t.hookParams.tagImages && (t.removedHookParams.tagImages = t.hookParams.tagImages, delete t.hookParams.tagImages), o()) : "tagImages" === t.action.type && (t.hookParams.execNewPod && (t.removedHookParams.execNewPod = t.hookParams.execNewPod, delete t.hookParams.execNewPod), o()));
}), t.valueFromObjects = [], t.$watchGroup([ "availableSecrets", "availableConfigMaps" ], function() {
var e = t.availableConfigMaps || [], n = t.availableSecrets || [];
t.valueFromObjects = e.concat(n);
}), t.$watch("istagHook.tagObject.tag", function() {
_.has(t.istagHook, [ "tagObject", "tag" ]) && (_.set(t.hookParams, "tagImages[0].to.kind", "ImageStreamTag"), _.set(t.hookParams, "tagImages[0].to.namespace", t.istagHook.namespace), _.set(t.hookParams, "tagImages[0].to.name", t.istagHook.imageStream + ":" + t.istagHook.tagObject.tag));
});
} ]
};
} ]).directive("lifecycleHook", [ "$filter", "APIService", function(e, t) {
return {
restrict: "E",
scope: {
deploymentConfig: "=",
type: "@"
},
templateUrl: "views/directives/lifecycle-hook.html",
link: function(n) {
n.secretsVersion = t.getPreferredVersion("secrets"), n.configMapsVersion = t.getPreferredVersion("configmaps"), n.$watch("deploymentConfig", function(t) {
n.strategyParams = e("deploymentStrategyParams")(t);
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
controller: [ "$filter", "$scope", "APIService", "ApplicationsService", "DataService", "Navigate", "NotificationsService", "StorageService", "gettextCatalog", function(e, t, n, a, r, o, i, s, c) {
var l = this, u = e("humanizeKind"), d = function(e) {
var t = l.apiObject.metadata.name;
return "ConfigMap" === l.apiObject.kind ? _.some(e.envFrom, {
configMapRef: {
name: t
}
}) : _.some(e.envFrom, {
secretRef: {
name: t
}
});
};
l.checkApplicationContainersRefs = function(e) {
var t = _.get(e, "spec.template.spec.containers");
l.canAddRefToApplication = !_.every(t, d);
};
var m = function() {
var e = {
namespace: l.project.metadata.name
};
a.getApplications(e).then(function(e) {
l.applications = e, l.updating = !1;
});
};
l.$onInit = function() {
l.addType = "env", l.disableInputs = !1, m(), l.canAddRefToApplication = !0;
var e = new RegExp("^[A-Za-z_][A-Za-z0-9_]*$");
l.hasInvalidEnvVars = _.some(l.apiObject.data, function(t, n) {
return !e.test(n);
});
};
var p = function(e) {
return l.attachAllContainers || l.attachContainers[e.name];
};
l.$postLink = function() {
t.$watch(function() {
return l.application;
}, function() {
var e = _.get(l.application, "spec.template");
l.existingMountPaths = s.getMountPaths(e), l.attachAllContainers = !0;
});
}, l.groupByKind = function(e) {
return u(e.kind);
}, l.addToApplication = function() {
var t = angular.copy(l.application), a = _.get(t, "spec.template");
if (l.disableInputs = !0, "env" === l.addType) {
var s = {};
switch (l.apiObject.kind) {
case "Secret":
s.secretRef = {
name: l.apiObject.metadata.name
};
break;

case "ConfigMap":
s.configMapRef = {
name: l.apiObject.metadata.name
};
}
l.envPrefix && (s.prefix = l.envPrefix), _.each(a.spec.containers, function(e) {
p(e) && !d(e) && (e.envFrom = e.envFrom || [], e.envFrom.push(s));
});
} else {
var u = e("generateName")(l.apiObject.metadata.name + "-"), m = {
name: u,
mountPath: l.mountVolume,
readOnly: !0
};
_.each(a.spec.containers, function(e) {
p(e) && (e.volumeMounts = e.volumeMounts || [], e.volumeMounts.push(m));
});
var g = {
name: u
};
switch (l.apiObject.kind) {
case "Secret":
g.secret = {
secretName: l.apiObject.metadata.name
};
break;

case "ConfigMap":
g.configMap = {
name: l.apiObject.metadata.name
};
}
a.spec.volumes = a.spec.volumes || [], a.spec.volumes.push(g);
}
var f = e("humanizeKind"), h = f(l.apiObject.kind), v = f(t.kind), y = {
namespace: l.project.metadata.name
};
r.update(n.objectToResourceGroupVersion(t), t.metadata.name, t, y).then(function() {
i.addNotification({
type: "success",
message: c.getString("Successfully added ") + h + " " + l.apiObject.metadata.name + c.getString(" to ") + v + " " + t.metadata.name + ".",
links: [ {
href: o.resourceURL(t),
label: c.getString("View ") + f(t.kind, !0)
} ]
}), angular.isFunction(l.onComplete) && l.onComplete();
}, function(n) {
var a = e("getErrorDetails");
i.addNotification({
type: "error",
message: c.getString("An error occurred  adding {{source}} {{name}} to {{target}} {{app}}. ", {
source: h,
name: l.apiObject.metadata.name,
target: v,
app: t.metadata.name
}) + a(n)
});
}).finally(function() {
l.disableInputs = !1;
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
}), angular.module("openshiftConsole").directive("podMetrics", [ "$filter", "$interval", "$parse", "$timeout", "$q", "$rootScope", "ChartsService", "ConversionService", "MetricsCharts", "MetricsService", "ModalsService", "usageValueFilter", "gettextCatalog", function(e, t, n, a, r, o, i, s, c, l, u, d, m) {
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
function g(e) {
if (!p.pod) return null;
var t = p.options.selectedContainer;
switch (e) {
case "memory/usage":
var n = A(t);
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
R[t.id] ? R[t.id].load(r) : ((n = L(e)).data = r, a(function() {
$ || (R[t.id] = c3.generate(n));
}));
}
}
function h(e) {
if (!_.some(e.datasets, function(e) {
return !e.data;
})) {
var t = {};
_.each(e.datasets, function(e) {
t[e.id] = e.data;
});
var n, r = c.getSparklineData(t), o = e.chartPrefix + "sparkline";
N[o] ? N[o].load(r) : ((n = V(e)).data = r, e.chartDataColors && (n.color = {
pattern: e.chartDataColors
}), a(function() {
$ || (N[o] = c3.generate(n));
}));
}
}
function v() {
return "-" + p.options.timeRange.value + "mn";
}
function y() {
return 60 * p.options.timeRange.value * 1e3;
}
function b() {
return Math.floor(y() / D) + "ms";
}
function S(e, t, n) {
var a, r = {
metric: t.id,
type: t.type,
bucketDuration: b()
};
return t.data && t.data.length ? (a = _.last(t.data), r.start = a.end) : r.start = n, p.pod ? _.assign(r, {
namespace: p.pod.metadata.namespace,
pod: p.pod,
containerName: e.containerMetric ? p.options.selectedContainer.name : "pod"
}) : null;
}
function C() {
$ || (O = 0, _.each(p.metrics, function(e) {
h(e), f(e);
}));
}
function w(e) {
if (!$) if (O++, p.noData) p.metricsError = {
status: _.get(e, "status", 0),
details: _.get(e, "data.errorMsg") || _.get(e, "statusText") || "Status code " + _.get(e, "status", 0)
}; else if (!(O < 2)) {
var t = "metrics-failed-" + p.uniqueID;
p.alerts[t] = {
type: "error",
message: m.getString("An error occurred updating metrics for pod {{pod}}.", {
pod: _.get(p, "pod.metadata.name", "<unknown>")
}),
links: [ {
href: "",
label: "Retry",
onClick: function() {
delete p.alerts[t], O = 1, I();
}
} ]
};
}
}
function P() {
return !(p.metricsError || O > 1) && (p.pod && _.get(p, "options.selectedContainer"));
}
function k(e, t, n) {
t.total = g(t.id), t.total && (p.hasLimits = !0);
var a = _.get(n, "usage.value");
isNaN(a) && (a = 0), e.convert && (a = e.convert(a)), t.used = d3.round(a, e.usagePrecision), t.total && (t.available = d3.round(t.total - a, e.usagePrecision)), e.totalUsed += t.used;
}
function j(e, t) {
p.noData = !1;
var n = _.initial(t.data);
e.data ? e.data = _.chain(e.data).takeRight(D).concat(n).value() : e.data = n;
}
function I() {
if (P()) {
var e = v(), t = [];
angular.forEach(p.metrics, function(n) {
var a = [];
n.totalUsed = 0, angular.forEach(n.datasets, function(r) {
var o = S(n, r, e);
if (o) {
var i = l.get(o);
a.push(i), g(r.id) && t.push(l.getCurrentUsage(o).then(function(e) {
k(n, r, e);
}));
}
}), t = t.concat(a), r.all(a).then(function(e) {
$ || angular.forEach(e, function(e) {
e && j(_.find(n.datasets, {
id: e.metricID
}), e);
});
});
}), r.all(t).then(C, w).finally(function() {
p.loaded = !0;
});
}
}
p.includedMetrics = p.includedMetrics || [ "cpu", "memory", "network" ];
var T, R = {}, N = {}, A = n("resources.limits.memory"), E = n("resources.limits.cpu"), D = 30, $ = !1;
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
var B = e("upperFirst"), L = function(e) {
var t = "#" + e.chartPrefix + p.uniqueID + "-donut";
return {
bindto: t,
onrendered: function() {
i.updateDonutCenterText(t, e.datasets[0].used, B(e.units) + " Used");
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
}, V = function(e) {
var t = e.chartPrefix + p.uniqueID + "-sparkline", n = c.getDefaultSparklineConfig(t, e.units);
return 1 === e.datasets.length && _.set(n, "legend.show", !1), n;
}, O = 0;
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
}), delete p.metricsError, I();
}, !0), T = t(I, c.getDefaultUpdateInterval(), !1);
});
var U = o.$on("metrics.charts.resize", function() {
c.redraw(R), c.redraw(N);
});
p.$on("$destroy", function() {
T && (t.cancel(T), T = null), U && (U(), U = null), angular.forEach(R, function(e) {
e.destroy();
}), R = null, angular.forEach(N, function(e) {
e.destroy();
}), N = null, $ = !0;
});
}
};
} ]), angular.module("openshiftConsole").directive("deploymentMetrics", [ "$interval", "$parse", "$timeout", "$q", "$rootScope", "ChartsService", "ConversionService", "MetricsCharts", "MetricsService", "ModalsService", "gettextCatalog", function(e, t, n, a, r, o, i, s, c, l, u) {
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
var t, a = {}, r = [ "Date" ], o = [ t = P ? e.compactDatasetLabel || e.label : "Average Usage" ], i = [ r, o ], s = function(e) {
var t = "" + e.start;
return a[t] || (a[t] = {
total: 0,
count: 0
}), a[t];
};
return _.each(T[e.descriptor], function(e) {
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
y(r.descriptor, t, e);
}), i.type = "area-spline", P && r.compactType && (i.type = r.compactType), i.x = "Date", i.columns = a(r), i) : (_.each(e[r.descriptor], function(e, t) {
y(r.descriptor, t, e);
var a = t + "-dates";
_.set(i, [ "xs", t ], a);
var s = [ a ], c = [ t ];
o.push(s), o.push(c), _.each(T[r.descriptor][t], function(e) {
if (s.push(e.start), (!j || j < e.end) && (j = e.end), n(e)) c.push(e.value); else {
var t = r.convert ? r.convert(e.value) : e.value;
c.push(t);
}
});
}), i.columns = _.sortBy(o, function(e) {
return e[0];
}), i);
}
function d(e) {
k || (E = 0, t.showAverage = _.size(t.pods) > 5 || P, _.each(t.metrics, function(n) {
var a, r = o(e, n), i = n.descriptor;
P && n.compactCombineWith && (i = n.compactCombineWith, n.lastValue && (A[i].lastValue = (A[i].lastValue || 0) + n.lastValue)), C[i] ? (C[i].load(r), t.showAverage ? C[i].legend.hide() : C[i].legend.show()) : ((a = D(n)).data = r, C[i] = c3.generate(a));
}));
}
function m() {
return P ? "-15mn" : "-" + t.options.timeRange.value + "mn";
}
function p() {
return 60 * t.options.timeRange.value * 1e3;
}
function g() {
return P ? "1mn" : Math.floor(p() / w) + "ms";
}
function f() {
var e = _.find(t.pods, "metadata.namespace");
if (e) {
var n = {
pods: t.pods,
namespace: e.metadata.namespace,
bucketDuration: g()
};
return P || (n.containerName = t.options.selectedContainer.name), n.start = j || m(), n;
}
}
function h(e) {
if (!k) if (E++, t.noData) t.metricsError = {
status: _.get(e, "status", 0),
details: _.get(e, "data.errorMsg") || _.get(e, "statusText") || "Status code " + _.get(e, "status", 0)
}; else if (!(E < 2) && t.alerts) {
var n = "metrics-failed-" + t.uniqueID;
t.alerts[n] = {
type: "error",
message: u.getString("An error occurred updating metrics."),
links: [ {
href: "",
label: "Retry",
onClick: function() {
delete t.alerts[n], E = 1, b();
}
} ]
};
}
}
function v() {
return _.isEmpty(t.pods) ? (t.loaded = !0, !1) : !t.metricsError && E < 2;
}
function y(e, n, a) {
t.noData = !1;
var r = _.initial(a), o = _.get(T, [ e, n ]);
if (o) {
var i = _.takeRight(o.concat(r), w);
_.set(T, [ e, n ], i);
} else _.set(T, [ e, n ], r);
}
function b() {
if (!R && v()) {
I = Date.now();
var e = f();
c.getPodMetrics(e).then(d, h).finally(function() {
t.loaded = !0;
});
}
}
var S, C = {}, w = 30, P = "compact" === t.profile, k = !1;
t.uniqueID = s.uniqueID();
var j, I, T = {}, R = P, N = function(e) {
return e >= 1024;
};
t.metrics = [ {
label: "Memory",
units: "MiB",
convert: i.bytesToMiB,
formatUsage: function(e) {
return N(e) && (e /= 1024), s.formatUsage(e);
},
usageUnits: function(e) {
return N(e) ? "GiB" : "MiB";
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
var A = _.keyBy(t.metrics, "descriptor");
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
var n = s.getDefaultSparklineConfig(e.chartID, e.units, P);
return _.set(n, "legend.show", !P && !t.showAverage), n;
};
t.$watch("options", function() {
T = {}, j = null, delete t.metricsError, b();
}, !0), S = e(b, s.getDefaultUpdateInterval(), !1), t.updateInView = function(e) {
R = !e, e && (!I || Date.now() > I + s.getDefaultUpdateInterval()) && b();
};
var $ = r.$on("metrics.charts.resize", function() {
s.redraw(C);
});
t.$on("$destroy", function() {
S && (e.cancel(S), S = null), $ && ($(), $ = null), angular.forEach(C, function(e) {
e.destroy();
}), C = null, k = !0;
});
}
};
} ]), angular.module("openshiftConsole").directive("logViewer", [ "$sce", "$timeout", "$window", "$filter", "$q", "AggregatedLoggingService", "APIService", "APIDiscovery", "AuthService", "DataService", "HTMLService", "ModalsService", "logLinks", "BREAKPOINTS", "gettextCatalog", function(e, t, n, a, r, o, i, s, c, l, u, d, m, p) {
var g = $(window), f = $('<tr class="log-line"><td class="log-line-number"></td><td class="log-line-text"></td></tr>').get(0), h = function(e, t) {
var n = f.cloneNode(!0);
n.firstChild.setAttribute("data-line-number", e);
var a = ansi_up.escape_for_html(t), r = ansi_up.ansi_to_html(a), o = u.linkify(r, "_blank", !0);
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
controller: [ "$scope", function(e) {
var t, c, u, d = document.documentElement;
e.logViewerID = _.uniqueId("log-viewer"), e.empty = !0;
var f, v;
"ReplicationController" === e.object.kind ? (f = "deploymentconfigs/log", v = a("annotation")(e.object, "deploymentConfig")) : (f = i.kindToResource(e.object.kind) + "/log", v = e.object.metadata.name);
var y, b = function() {
e.$apply(function() {
var n = t.getBoundingClientRect();
e.fixedHeight ? e.showScrollLinks = n && n.height > e.fixedHeight : e.showScrollLinks = n && (n.top < 0 || n.bottom > d.clientHeight);
});
}, S = !1, C = function() {
S ? S = !1 : e.$evalAsync(function() {
e.autoScrollActive = !1;
});
}, w = function() {
c ? $(c).on("scroll", C) : g.on("scroll", C);
}, P = function() {
e.fixedHeight || u.affix({
target: window,
offset: {
top: e.followAffixTop || 0
}
});
}, k = function() {
return $("#" + e.logViewerID + " .log-view-output");
}, j = function(t) {
var n = k(), a = n.offset().top;
if (!(a < 0)) {
var r = $(".ellipsis-pulser").outerHeight(!0), o = e.fixedHeight ? e.fixedHeight : Math.floor($(window).height() - a - r);
e.chromeless || e.fixedHeight || (o -= 40), t ? n.animate({
"min-height": o + "px"
}, "fast") : n.css("min-height", o + "px"), e.fixedHeight && n.css("max-height", o);
}
}, I = function() {
if (!y) {
var t = function() {
clearInterval(y), y = null, e.$evalAsync(function() {
e.sized = !0;
});
}, n = 0;
y = setInterval(function() {
n > 10 ? t() : (n++, k().is(":visible") && (j(), t()));
}, 100);
}
}, T = _.debounce(function() {
j(!0), b(), C();
}, 100);
g.on("resize", T);
var R, N = function() {
S = !0, m.scrollBottom(c);
}, A = document.createDocumentFragment(), E = _.debounce(function() {
t.appendChild(A), A = document.createDocumentFragment(), e.autoScrollActive && N(), e.showScrollLinks || b();
}, 100, {
maxWait: 300
}), D = function(e) {
var n = r.defer();
return R ? (R.onClose(function() {
n.resolve();
}), R.stop()) : n.resolve(), e || (E.cancel(), t && (t.innerHTML = ""), A = document.createDocumentFragment()), n.promise;
}, B = function() {
D().then(function() {
e.$evalAsync(function() {
if (e.run) {
angular.extend(e, {
loading: !0,
autoScrollActive: !0,
largeLog: !1,
limitReached: !1,
showScrollLinks: !1,
state: ""
});
var t = angular.extend({
follow: !0,
tailLines: 5e3,
limitBytes: 10485760
}, e.options), n = 0, a = "", r = function(e) {
return /\n$/.test(e);
}, o = function(e) {
return e.match(/^.*(\n|$)/gm);
}, i = function(e) {
var t = a + e;
r(e) ? (a = "", n++, A.appendChild(h(n, t)), E()) : a = t;
}, s = function(e) {
var t = o(e);
_.each(t, i);
};
(R = l.createStream(f, v, e.context, t)).onMessage(function(a, r, o) {
e.$evalAsync(function() {
e.empty = !1, "logs" !== e.state && (e.state = "logs", I());
}), a && (t.limitBytes && o >= t.limitBytes && (e.$evalAsync(function() {
e.limitReached = !0, e.loading = !1;
}), D(!0)), s(a), !e.largeLog && n >= t.tailLines && e.$evalAsync(function() {
e.largeLog = !0;
}));
}), R.onClose(function() {
R = null, e.$evalAsync(function() {
e.loading = !1, e.autoScrollActive = !1, 0 !== n || e.emptyStateMessage || (e.state = "empty", e.emptyStateMessage = p.getString("The logs are no longer available or could not be loaded."));
});
}), R.onError(function() {
R = null, e.$evalAsync(function() {
angular.extend(e, {
loading: !1,
autoScrollActive: !1
}), 0 === n ? (e.state = "empty", e.emptyStateMessage = p.getString("The logs are no longer available or could not be loaded.")) : e.errorWhileRunning = !0;
});
}), R.start();
}
});
});
};
if (s.getLoggingURL(e.context.project).then(function(t) {
var r = _.get(e.context, "project.metadata.name"), i = _.get(e.options, "container");
r && i && v && t && o.isOperationsUser().then(function(r) {
e.$watchGroup([ "context.project.metadata.name", "options.container", "name" ], function() {
angular.extend(e, {
kibanaArchiveUrl: m.archiveUri({
baseURL: t,
namespace: e.context.project.metadata.name,
namespaceUid: e.context.project.metadata.uid,
podname: v,
containername: e.options.container,
backlink: URI.encode(n.location.href)
}, a("annotation")(e.context.project, "loggingDataPrefix"), r)
});
});
});
}), this.cacheScrollableNode = function(e) {
c = e;
}, this.cacheLogNode = function(e) {
t = e;
}, this.cacheAffixable = function(e) {
u = $(e);
}, this.start = function() {
w(), P();
}, angular.extend(e, {
ready: !0,
loading: !0,
autoScrollActive: !0,
state: !1,
onScrollBottom: function() {
m.scrollBottom(c);
},
onScrollTop: function() {
e.autoScrollActive = !1, m.scrollTop(c), $("#" + e.logViewerID + "-affixedFollow").affix("checkPosition");
},
toggleAutoScroll: function() {
e.autoScrollActive = !e.autoScrollActive, e.autoScrollActive && N();
},
goChromeless: m.chromelessLink,
restartLogs: B
}), e.$on("$destroy", function() {
D(), g.off("resize", T), g.off("scroll", C), c && $(c).off("scroll", C);
}), "deploymentconfigs/logs" === f && !v) return e.state = "empty", void (e.emptyStateMessage = p.getString("Logs are not available for this replication controller because it was not generated from a deployment configuration."));
e.$watchGroup([ "name", "options.container", "run" ], B);
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
e.largeLog ? d.confirmSaveLog(e.object).then(o) : o();
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
}), angular.module("openshiftConsole").directive("deploymentDonut", [ "$filter", "$location", "$timeout", "$uibModal", "DeploymentsService", "HPAService", "QuotaService", "LabelFilter", "Navigate", "NotificationsService", "hashSizeFilter", "hasDeploymentConfigFilter", "gettextCatalog", function(e, t, n, a, r, o, i, s, c, l, u, d, m) {
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
var g = function() {
return e.deploymentConfig || e.deployment || e.rc;
}, f = function() {
if (s = !1, angular.isNumber(e.desiredReplicas)) {
var a = g();
return r.scale(a, e.desiredReplicas).then(_.noop, function(e) {
var r = u(a.kind);
return l.addNotification({
id: "deployment-scale-error",
type: "error",
message: m.getString("An error occurred scaling {{kind}} {{name}}.", {
kind: r,
name: a.metadata.name
}),
details: t("getErrorDetails")(e)
}), n.reject(e);
});
}
}, h = _.debounce(f, 650);
e.viewPodsForDeployment = function(t) {
_.isEmpty(e.pods) || c.toPodsForDeployment(t, e.pods);
}, e.scaleUp = function() {
e.scalable && (e.desiredReplicas = e.getDesiredReplicas(), e.desiredReplicas++, h(), s = !0);
}, e.scaleDown = function() {
e.scalable && (e.desiredReplicas = e.getDesiredReplicas(), 0 !== e.desiredReplicas && (1 !== e.desiredReplicas ? (e.desiredReplicas--, h()) : a.open({
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
e.desiredReplicas = e.getDesiredReplicas() - 1, h(), s = !0;
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
order: null,
type: "bar"
}
}, p = function() {
o.completeBuilds = [];
var t = e("isIncompleteBuild");
angular.forEach(o.builds, function(e) {
t(e) || o.completeBuilds.push(e);
});
}, g = !1, f = function() {
u && g ? l.ygrids([ {
value: u,
class: "build-trends-avg-line"
} ]) : l.ygrids.remove();
};
o.toggleAvgLine = function() {
g = !g, f();
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
var p = [], g = [];
angular.forEach(s, function(e) {
n[e] ? p.push(e) : g.push(e);
}), i.keys.value = p, i.groups = [ p ], l ? (i.unload = g, i.done = function() {
setTimeout(function() {
l.flush();
}, d() + 25);
}, l.load(i), f()) : (m.data = angular.extend(i, m.data), a(function() {
l = c3.generate(m), f();
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
} ]), angular.module("openshiftConsole").directive("buildPipeline", [ "$filter", "APIService", "Logger", "gettextCatalog", function(e, t, n, a) {
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
link: function(r) {
r.buildLogsVersion = t.getPreferredVersion("builds/log");
var o = e("annotation");
r.$watch(function() {
return o(r.build, "jenkinsStatus");
}, function(e) {
if (e) try {
r.jenkinsStatus = JSON.parse(e);
} catch (t) {
n.error(a.getString("Could not parse Jenkins status as JSON"), e);
}
});
var i = e("buildConfigForBuild");
r.$watch(function() {
return i(r.build);
}, function(e) {
r.buildConfigName = e;
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
controller: [ "$scope", "$filter", "APIService", "ApplicationsService", "BindingService", "Catalog", "DataService", "ServiceInstancesService", "gettextCatalog", function(e, t, n, a, r, o, i, s, c) {
var l, u, d, m, p, g, f = this, h = t("statusCondition"), v = t("enableTechPreviewFeature"), y = n.getPreferredVersion("serviceinstances"), b = n.getPreferredVersion("clusterserviceclasses"), S = n.getPreferredVersion("clusterserviceplans"), C = function() {
var e, t;
_.each(f.serviceInstances, function(n) {
var a = "True" === _.get(h(n, "Ready"), "status");
a && (!e || n.metadata.creationTimestamp > e.metadata.creationTimestamp) && (e = n), a || t && !(n.metadata.creationTimestamp > t.metadata.creationTimestamp) || (t = n);
}), f.serviceToBind = e || t;
}, w = function() {
f.serviceClasses && f.serviceInstances && f.servicePlans && (f.serviceInstances = r.filterBindableServiceInstances(f.serviceInstances, f.serviceClasses, f.servicePlans), f.orderedServiceInstances = r.sortServiceInstances(f.serviceInstances, f.serviceClasses), f.serviceToBind || C());
}, P = function() {
var e = {
namespace: _.get(f.target, "metadata.namespace")
};
a.getApplications(e).then(function(e) {
f.applications = e, f.bindType = f.applications.length ? "application" : "secret-only";
});
}, k = function() {
var e = {
namespace: _.get(f.target, "metadata.namespace")
};
i.list(y, e).then(function(e) {
f.serviceInstances = e.by("metadata.name"), w();
}), i.list(b, {}).then(function(e) {
f.serviceClasses = e.by("metadata.name"), w();
}), i.list(S, {}).then(function(e) {
f.servicePlans = e.by("metadata.name"), w();
});
};
l = {
id: "bindForm",
label: c.getString("Binding"),
view: "views/directives/bind-service/bind-service-form.html",
valid: !1,
allowClickNav: !0,
onShow: function() {
f.nextTitle = u.hidden ? c.getString("Bind") : c.getString("Next >"), f.podPresets && !m && (m = e.$watch("ctrl.selectionForm.$valid", function(e) {
l.valid = e;
}));
}
}, u = {
id: "bindParameters",
label: c.getString("Parameters"),
view: "views/directives/bind-service/bind-parameters.html",
hidden: !0,
allowClickNav: !0,
onShow: function() {
f.nextTitle = c.getString("Bind"), p || (p = e.$watch("ctrl.parametersForm.$valid", function(e) {
u.valid = e;
}));
}
}, d = {
id: "results",
label: c.getString("Results"),
view: "views/directives/bind-service/results.html",
valid: !0,
allowClickNav: !1,
onShow: function() {
m && (m(), m = void 0), p && (p(), p = void 0), f.nextTitle = c.getString("Close"), f.wizardComplete = !0, f.bindService();
}
};
e.$watch("ctrl.serviceToBind", function() {
f.serviceToBind && s.fetchServiceClassForInstance(f.serviceToBind).then(function(e) {
f.serviceClass = e;
var t = s.getServicePlanNameForInstance(f.serviceToBind);
i.get(S, t, {}).then(function(e) {
f.plan = e, f.parameterSchema = _.get(f.plan, "spec.serviceBindingCreateParameterSchema"), f.parameterFormDefinition = _.get(f.plan, "spec.externalMetadata.schemas.service_binding.create.openshift_form_definition"), u.hidden = !_.has(f.parameterSchema, "properties"), f.nextTitle = u.hidden ? c.getString("Bind") : c.getString("Next >"), f.hideBack = u.hidden, l.valid = !0;
});
});
}), f.$onInit = function() {
f.serviceSelection = {}, f.projectDisplayName = t("displayName")(f.project), f.podPresets = v("pod_presets"), f.parameterData = {}, f.steps = [ l, u, d ], f.hideBack = u.hidden, "ServiceInstance" === f.target.kind ? (f.bindType = "secret-only", f.appToBind = null, f.serviceToBind = f.target, f.podPresets && P()) : (f.bindType = "application", f.appToBind = f.target, k());
}, f.$onChanges = function(e) {
e.project && !e.project.isFirstChange() && (f.projectDisplayName = t("displayName")(f.project));
}, f.$onDestroy = function() {
m && (m(), m = void 0), p && (p(), p = void 0), g && i.unwatch(g);
}, f.bindService = function() {
var e = "ServiceInstance" === f.target.kind ? f.target : f.serviceToBind, t = "application" === f.bindType ? f.appToBind : void 0, n = {
namespace: _.get(e, "metadata.namespace")
}, a = r.getServiceClassForInstance(e, f.serviceClasses);
r.bindService(e, t, a, f.parameterData).then(function(e) {
f.binding = e, f.error = null, g = i.watchObject(r.bindingResource, _.get(f.binding, "metadata.name"), n, function(e) {
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
controller: [ "$scope", "$filter", "APIService", "DataService", "gettextCatalog", function(e, t, n, a, r) {
var o, i, s = this, c = t("enableTechPreviewFeature"), l = t("serviceInstanceDisplayName"), u = n.getPreferredVersion("servicebindings"), d = function() {
var e = s.selectedBinding.metadata.name;
s.unboundApps = s.appsForBinding(e), a.delete(u, e, i, {
propagationPolicy: null
}).then(_.noop, function(e) {
s.error = e;
});
}, m = function() {
var t = _.head(s.steps);
t.valid = !1, o = e.$watch("ctrl.selectedBinding", function(e) {
t.valid = !!e;
});
}, p = function() {
o && (o(), o = void 0);
}, g = function() {
s.nextTitle = r.getString("Delete"), m();
}, f = function() {
s.nextTitle = r.getString("Close"), s.wizardComplete = !0, d(), p();
};
s.$onInit = function() {
var e;
e = "ServiceInstance" === s.target.kind ? c("pod_presets") ? "Applications" : "Bindings" : "Services", s.displayName = l(s.target, s.serviceClass), s.steps = [ {
id: "deleteForm",
label: e,
view: "views/directives/bind-service/delete-binding-select-form.html",
onShow: g
}, {
id: "results",
label: "Results",
view: "views/directives/bind-service/delete-binding-result.html",
onShow: f
} ], i = {
namespace: _.get(s.target, "metadata.namespace")
};
}, s.appsForBinding = function(e) {
return _.get(s.applicationsByBinding, e);
}, s.closeWizard = function() {
_.isFunction(s.onClose) && s.onClose();
}, s.$onDestroy = function() {
p();
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
controller: [ "$filter", "$q", "$scope", "$uibModal", "APIService", "DataService", "Navigate", "NotificationsService", "ProcessedTemplateService", "ProjectsService", "QuotaService", "SecurityCheckService", "TaskList", "keyValueEditorUtils", "gettextCatalog", function(e, t, n, a, r, o, i, s, c, l, u, d, m, p, g) {
function f(e) {
var t = /^helplink\.(.*)\.title$/, n = /^helplink\.(.*)\.url$/, a = {};
for (var r in e.annotations) {
var o, i = r.match(t);
i ? ((o = a[i[1]] || {}).title = e.annotations[r], a[i[1]] = o) : (i = r.match(n)) && ((o = a[i[1]] || {}).url = e.annotations[r], a[i[1]] = o);
}
return a;
}
function h() {
y.prefillParameters && _.each(y.template.parameters, function(e) {
y.prefillParameters[e.name] && (e.value = y.prefillParameters[e.name]);
}), y.labels = _.map(y.template.labels, function(e, t) {
return {
name: t,
value: e
};
}), N() && y.labels.push({
name: "app",
value: y.template.metadata.name
});
}
var v, y = this, b = e("displayName"), S = e("humanize");
y.noProjectsCantCreate = !1, y.$onInit = function() {
y.labels = [], y.template = angular.copy(y.template), y.templateDisplayName = b(y.template), y.selectedProject = y.project, n.$watch("$ctrl.selectedProject.metadata.name", function() {
y.projectNameTaken = !1;
}), n.$on("no-projects-cannot-create", function() {
y.noProjectsCantCreate = !0;
}), h();
};
var C, w = function() {
var e = {
started: g.getString("Creating {{name}} in project {{project}}", {
name: y.templateDisplayName,
project: b(y.selectedProject)
}),
success: g.getString("Created {{name}} in project {{project}}", {
name: y.templateDisplayName,
project: b(y.selectedProject)
}),
failure: g.getString("Failed to create {{name}} in project {{project}}", {
name: y.templateDisplayName,
project: b(y.selectedProject)
})
}, a = f(y.template);
m.clear(), m.add(e, a, y.selectedProject.metadata.name, function() {
var e = t.defer();
return o.batch(C, v).then(function(t) {
var n = [], a = !1;
t.failure.length > 0 ? (a = !0, t.failure.forEach(function(e) {
n.push({
type: "error",
message: g.getString("Cannot create ") + S(e.object.kind).toLowerCase() + ' "' + e.object.metadata.name + '". ',
details: e.data.message
});
}), t.success.forEach(function(e) {
n.push({
type: "success",
message: g.getString("Created ") + S(e.kind).toLowerCase() + ' "' + e.metadata.name + '"' + g.getString("successfully. ")
});
})) : n.push({
type: "success",
message: g.getString("All items in template {{name}} were created successfully.", {
name: y.templateDisplayName
})
}), e.resolve({
alerts: n,
hasErrors: a
});
}), e.promise;
}), y.isDialog ? n.$emit("templateInstantiated", {
project: y.selectedProject,
template: y.template
}) : i.toNextSteps(y.templateDisplayName, y.selectedProject.metadata.name);
}, P = function(e) {
a.open({
templateUrl: "views/modals/confirm.html",
controller: "ConfirmModalController",
resolve: {
modalConfig: function() {
return {
alerts: e,
title: g.getString("Confirm Creation"),
details: g.getString("We checked your application for potential problems. Please confirm you still want to create this application."),
okButtonText: g.getString("Create Anyway"),
okButtonClass: "btn-danger",
cancelButtonText: g.getString("Cancel")
};
}
}
}).result.then(w);
}, k = {}, j = function() {
s.hideNotification("process-template-error"), _.each(k, function(e) {
!e.id || "error" !== e.type && "warning" !== e.type || s.hideNotification(e.id);
});
}, I = function(e) {
j(), k = d.getSecurityAlerts(C, y.selectedProject.metadata.name);
var t = e.quotaAlerts || [];
k = k.concat(t), _.filter(k, {
type: "error"
}).length ? (y.disableInputs = !1, _.each(k, function(e) {
e.id = _.uniqueId("process-template-alert-"), s.addNotification(e);
})) : k.length ? (P(k), y.disableInputs = !1) : w();
}, T = function() {
if (_.has(y.selectedProject, "metadata.uid")) return t.when(y.selectedProject);
var n = y.selectedProject.metadata.name, a = y.selectedProject.metadata.annotations["new-display-name"], r = e("description")(y.selectedProject);
return l.create(n, a, r);
}, R = function(e) {
var t = r.objectToResourceGroupVersion(e);
return t.resource = "processedtemplates", t;
};
y.createFromTemplate = function() {
y.disableInputs = !0, T().then(function(e) {
y.selectedProject = e, v = {
namespace: y.selectedProject.metadata.name
}, y.template.labels = p.mapEntries(p.compactEntries(y.labels));
var t = R(y.template);
o.create(t, null, y.template, v).then(function(e) {
c.setTemplateData(e.parameters, y.template.parameters, e.message), C = e.objects, u.getLatestQuotaAlerts(C, v).then(I);
}, function(e) {
y.disableInputs = !1;
var t;
e.data && e.data.message && (t = e.data.message), s.addNotification({
id: "process-template-error",
type: "error",
message: g.getString("An error occurred processing the template."),
details: t
});
});
}, function(e) {
if (y.disableInputs = !1, "AlreadyExists" === e.data.reason) y.projectNameTaken = !0; else {
var t;
e.data && e.data.message && (t = e.data.message), s.addNotification({
id: "process-template-error",
type: "error",
message: g.getString("An error occurred creating the project."),
details: t
});
}
});
}, y.cancel = function() {
j(), i.toProjectOverview(y.project.metadata.name);
}, n.$on("instantiateTemplate", y.createFromTemplate), n.$on("$destroy", j);
var N = function() {
return !_.get(y.template, "labels.app") && !_.some(y.template.objects, "metadata.labels.app");
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
controller: [ "$scope", "$filter", "$routeParams", "Catalog", "DataService", "KeywordService", "NotificationsService", "ProjectsService", "RecentlyViewedProjectsService", "gettextCatalog", function(e, t, n, a, r, o, i, s, c, l) {
function u() {
return P(_.get(S, "template.metadata.annotations.iconClass", "fa fa-clone"));
}
function d() {
var e = _.get(S, "template.metadata.annotations.iconClass", "fa fa-clone");
return C(e);
}
function m() {
S.steps || (S.steps = [ S.selectStep, S.infoStep, S.configStep, S.resultsStep ]);
}
function p() {
b && (b(), b = void 0);
}
function g() {
e.$broadcast("instantiateTemplate");
}
function f(e, t) {
return o.filterForKeywords(t, [ "name", "tags" ], o.generateKeywords(e));
}
function h(e) {
S.filterConfig.appliedFilters = e, v();
}
function v() {
S.filteredItems = S.catalogItems, S.filterConfig.appliedFilters && S.filterConfig.appliedFilters.length > 0 && _.each(S.filterConfig.appliedFilters, function(e) {
S.filteredItems = f(e.value, S.filteredItems);
}), S.filterConfig.resultsCount = S.filteredItems.length, _.includes(S.filteredItems, S.selectedTemplate) || S.templateSelected();
}
function y() {
S.unfilteredProjects || s.list().then(function(e) {
S.unfilteredProjects = _.toArray(e.by("metadata.name"));
}, function() {
S.unfilteredProjects = [];
}).finally(function() {
k();
});
}
var b, S = this, C = t("imageForIconClass"), w = t("annotation"), P = t("normalizeIconClass");
S.selectStep = {
id: "projectTemplates",
label: l.getString("Selection"),
view: "views/directives/process-template-dialog/process-template-select.html",
hidden: !0 !== S.useProjectTemplate,
allowed: !0,
valid: !1,
allowClickNav: !0,
onShow: function() {
S.infoStep.selected = !1, S.selectStep.selected = !0, S.configStep.selected = !1, S.resultsStep.selected = !1, S.nextTitle = l.getString("Next >"), p(), y();
}
}, S.infoStep = {
id: "info",
label: l.getString("Information"),
view: "views/directives/process-template-dialog/process-template-info.html",
allowed: !0,
valid: !0,
allowClickNav: !0,
onShow: function() {
S.infoStep.selected = !0, S.selectStep.selected = !1, S.configStep.selected = !1, S.resultsStep.selected = !1, S.nextTitle = l.getString("Next >"), p();
}
}, S.configStep = {
id: "configuration",
label: l.getString("Configuration"),
view: "views/directives/process-template-dialog/process-template-config.html",
valid: !1,
allowed: !0,
allowClickNav: !0,
onShow: function() {
S.infoStep.selected = !1, S.selectStep.selected = !1, S.configStep.selected = !0, S.resultsStep.selected = !1, S.nextTitle = l.getString("Create"), S.resultsStep.allowed = S.configStep.valid, b = e.$watch("$ctrl.form.$valid", function(e) {
S.configStep.valid = e && !S.noProjectsCantCreate && S.selectedProject, S.resultsStep.allowed = e;
});
}
}, S.resultsStep = {
id: "results",
label: l.getString("Results"),
view: "views/directives/process-template-dialog/process-template-results.html",
valid: !0,
allowed: !1,
prevEnabled: !1,
allowClickNav: !1,
onShow: function() {
S.infoStep.selected = !1, S.selectStep.selected = !1, S.configStep.selected = !1, S.resultsStep.selected = !0, S.nextTitle = l.getString("Close"), p(), S.wizardDone = !0;
}
}, S.$onInit = function() {
S.loginBaseUrl = r.openshiftAPIBaseUrl(), S.preSelectedProject = S.selectedProject = S.project, S.useProjectTemplate && (S.project && (S.templateProject = S.project, S.templateProjectChange()), y()), S.noProjectsCantCreate = !1, e.$on("no-projects-cannot-create", function() {
S.noProjectsCantCreate = !0;
}), S.noProjectsEmptyState = {
title: l.getString("No Available Projects"),
info: l.getString("There are no projects available from which to load templates.")
}, S.projectEmptyState = {
title: l.getString("No Project Selected"),
info: l.getString("Please select a project from the dropdown to load templates from that project.")
}, S.templatesEmptyState = {
title: l.getString("No Templates"),
info: l.getString("The selected project has no templates available to import.")
}, S.filterConfig = {
fields: [ {
id: "keyword",
title: l.getString("Keyword"),
placeholder: l.getString("Filter by Keyword"),
filterType: "text"
} ],
inlineResults: !0,
showTotalCountResults: !0,
itemsLabel: "Item",
itemsLabelPlural: "Items",
resultsCount: 0,
appliedFilters: [],
onFilterChange: h
}, n.project || (S.showProjectName = !0);
}, S.$onChanges = function(e) {
e.template && S.template && (m(), S.iconClass = u(), S.image = d(), S.docUrl = w(S.template, "openshift.io/documentation-url"), S.supportUrl = w(S.template, "openshift.io/support-url"), S.vendor = w(S.template, "openshift.io/provider-display-name")), e.useProjectTemplate && m();
}, e.$on("templateInstantiated", function(e, t) {
S.selectedProject = t.project, S.currentStep = S.resultsStep.label;
}), S.$onDestroy = function() {
p();
}, S.next = function(e) {
return e.stepId === S.configStep.id ? (g(), !1) : e.stepId !== S.resultsStep.id || (S.close(), !1);
}, S.close = function() {
var e = S.onDialogClosed();
_.isFunction(e) && e();
}, S.onProjectSelected = function(t) {
S.selectedProject = t, S.configStep.valid = e.$ctrl.form.$valid && S.selectedProject;
}, S.templateSelected = function(e) {
S.selectedTemplate = e, S.template = _.get(e, "resource"), S.selectStep.valid = !!e, S.iconClass = u(), S.image = d(), S.docUrl = w(S.template, "openshift.io/documentation-url"), S.supportUrl = w(S.template, "openshift.io/support-url"), S.vendor = w(S.template, "openshift.io/provider-display-name");
}, S.templateProjectChange = function() {
S.templateProjectName = _.get(S.templateProject, "metadata.name"), S.catalogItems = {}, S.templateSelected(), a.getProjectCatalogItems(S.templateProjectName, !1, !0).then(_.spread(function(e, t) {
S.catalogItems = e, S.totalCount = S.catalogItems.length, h(), t && i.addNotification({
type: "error",
message: t
});
}));
}, S.groupChoicesBy = function(e) {
return c.isRecentlyViewed(e.metadata.uid) ? l.getString("Recently Viewed") : l.getString("Other Projects");
};
var k = function() {
var e = _.reject(S.unfilteredProjects, "metadata.deletionTimestamp"), n = _.sortBy(e, t("displayName"));
S.searchEnabled = !_.isEmpty(e), S.templateProjects = c.orderByMostRecentlyViewed(n), S.numTemplateProjects = _.size(S.templateProjects), 1 === S.numTemplateProjects && (S.templateProject = _.head(S.templateProjects), S.templateProjectChange());
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
controller: [ "$scope", "$routeParams", "DataService", "gettextCatalog", function(e, t, n, a) {
var r = this;
r.$onInit = function() {
r.loginBaseUrl = n.openshiftAPIBaseUrl(), r.currentStep = a.getString("Image"), t.project || (r.showProjectName = !0), e.$on("no-projects-cannot-create", function() {
r.deployForm.$setValidity("required", !1), r.deployImageNewAppCreated = !1;
});
}, r.deployImage = function() {
e.$broadcast("newAppFromDeployImage");
}, e.$on("deployImageNewAppCreated", function(e, t) {
r.selectedProject = t.project, r.appName = t.appName, r.deployImageNewAppCreated = !0, r.currentStep = a.getString("Results");
}), r.close = function() {
var e = r.onDialogClosed();
return _.isFunction(e) && e(), r.wizardDone = !1, !0;
}, r.stepChanged = function(e) {
"results" === e.stepId ? (r.nextButtonTitle = a.getString("Close"), r.wizardDone = !0) : r.nextButtonTitle = a.getString("Deploy");
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
controller: [ "$scope", "$timeout", "$routeParams", "$filter", "DataService", "gettextCatalog", function(e, t, n, a, r, o) {
function i() {
return d(_.get(c, "template.metadata.annotations.iconClass", "fa fa-clone"));
}
function s() {
var e = _.get(c, "template.metadata.annotations.iconClass", "fa fa-clone");
return u(e);
}
var c = this, l = a("annotation"), u = a("imageForIconClass"), d = a("normalizeIconClass");
c.$onInit = function() {
c.alerts = {}, c.loginBaseUrl = r.openshiftAPIBaseUrl(), n.project || (c.showProjectName = !0), e.$on("no-projects-cannot-create", function() {
c.importForm.$setValidity("required", !1);
});
}, c.importFile = function() {
e.$broadcast("importFileFromYAMLOrJSON");
}, c.instantiateTemplate = function() {
e.$broadcast("instantiateTemplate");
}, e.$on("fileImportedFromYAMLOrJSON", function(e, n) {
c.selectedProject = n.project, c.template = n.template, c.iconClass = i(), c.image = s(), c.vendor = l(n.template, "openshift.io/provider-display-name"), c.docUrl = l(c.template, "openshift.io/documentation-url"), c.supportUrl = l(c.template, "openshift.io/support-url"), c.actionLabel = "imported", n.isList ? (c.kind = null, c.name = "YAML / JSON") : n.resource && (c.kind = n.resource.kind, c.name = n.resource.metadata.name), t(function() {
c.currentStep = c.template ? "Template Configuration" : "Results";
}, 0);
}), e.$on("templateInstantiated", function(e, t) {
c.selectedProject = t.project, c.name = a("displayName")(c.template), c.actionLabel = null, c.kind = null, c.currentStep = o.getString("Results");
}), c.close = function() {
c.template = null;
var e = c.onDialogClosed();
return _.isFunction(e) && e(), c.wizardDone = !1, !0;
}, c.stepChanged = function(e) {
c.currentStep = e.title, "results" === e.stepId ? (c.nextButtonTitle = o.getString("Close"), c.wizardDone = !0) : c.nextButtonTitle = o.getString("Create");
}, c.currentStep = "YAML / JSON", c.nextCallback = function(e) {
return "file" === e.stepId ? (c.importFile(), !1) : "template" === e.stepId ? (c.instantiateTemplate(), !1) : "results" !== e.stepId || (c.close(), !1);
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
r.showParamsTable = !1, r.actionLabel = r.actionLabel || "created";
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
controller: [ "APIService", "AuthorizationService", "DataService", "Logger", "SecretsService", "ServiceInstancesService", function(e, t, n, a, r, o) {
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
var n = JSON.parse(r.decodeSecretData(t.data)[e.secretKeyRef.key]);
_.extend(i.parameterData, n);
} catch (t) {
a.warn("Unable to load parameters from secret " + _.get(e, "secretKeyRef.name"), t);
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
}(), angular.module("openshiftConsole").directive("dropdownItem", [ "$compile", function(e) {
return {
restrict: "E",
transclude: !0,
scope: {
action: "&",
enabled: "@"
},
link: function(t, n, a, r, o) {
function i() {
var n = "true" === t.enabled ? '<li><a ng-click="action()" href="" ng-transclude></a></li>' : '<li class="disabled"><a ng-click="$event.stopPropagation()" ng-transclude></a></li>', a = e(n, o)(t);
s.replaceWith(a), s = a;
}
var s = n;
t.$watch("action", i), t.$watch("enabled", i);
}
};
} ]), angular.module("openshiftConsole").directive("optionalLink", function() {
return {
restrict: "E",
scope: {
link: "@"
},
transclude: !0,
template: '<a ng-href="{{link}}" ng-transclude ng-if="link"></a><span ng-transclude ng-if="!link"></span>'
};
}), function() {
angular.module("openshiftConsole").component("mobileClientRow", {
controller: [ "$scope", "$filter", "$routeParams", "APIService", "AuthorizationService", "DataService", "ListRowUtils", "Navigate", "ProjectsService", function(e, t, n, a, r, o, i, s, c) {
var l = this;
l.installType = "", _.extend(l, i.ui), l.$onChanges = function(e) {
if (e.apiObject) switch (l.bundleDisplay = l.apiObject.spec.appIdentifier, l.clientType = l.apiObject.spec.clientType.toUpperCase(), l.apiObject.spec.clientType) {
case "android":
l.installType = "gradle";
break;

case "iOS":
l.installType = "cocoapods";
break;

case "cordova":
l.installType = "npm";
}
}, l.mobileclientVersion = {
group: "mobile.k8s.io",
version: "v1alpha1",
resource: "mobileclients"
}, l.actionsDropdownVisible = function() {
return !_.get(l.apiObject, "metadata.deletionTimestamp") && r.canI(l.mobileclientVersion, "delete");
}, l.projectName = n.project, l.browseCatalog = function() {
s.toProjectCatalog(l.projectName);
};
} ],
controllerAs: "row",
bindings: {
apiObject: "<",
state: "<"
},
templateUrl: "views/overview/_mobile-client-row.html"
});
}(), function() {
angular.module("openshiftConsole").component("virtualMachineRow", {
controller: [ "$scope", "$filter", "$routeParams", "APIService", "AuthorizationService", "DataService", "ListRowUtils", "Navigate", "ProjectsService", "KubevirtVersions", "moment", function(e, t, n, a, r, o, i, s, c, l, u) {
function d() {
return g.apiObject.spec.running;
}
function m() {
var e = angular.copy(g.apiObject);
return delete e._pod, delete e._vm, e;
}
function p(t) {
var n = m();
return n.spec.running = t, o.update(l.offlineVirtualMachine.resource, n.metadata.name, n, e.$parent.context);
}
var g = this;
g.OfflineVirtualMachineVersion = l.offlineVirtualMachine, _.extend(g, i.ui), g.actionsDropdownVisible = function() {
return !_.get(g.apiObject, "metadata.deletionTimestamp") && r.canI(l.offlineVirtualMachine, "delete");
}, g.projectName = n.project, g.startOvm = function() {
p(!0);
}, g.stopOvm = function() {
p(!1);
}, g.restartOvm = function() {
return o.delete(l.virtualMachine, g.apiObject._vm.metadata.name, e.$parent.context);
}, g.canStartOvm = function() {
return !d();
}, g.canStopOvm = function() {
return d();
}, g.canRestartOvm = function() {
return d() && g.apiObject._vm && "Running" === _.get(g.apiObject, "_pod.status.phase");
};
} ],
controllerAs: "row",
bindings: {
apiObject: "<",
state: "<"
},
templateUrl: "views/overview/_virtual-machine-row.html"
}), angular.module("openshiftConsole").filter("vmPodUptime", function() {
return function(e) {
var t = _(_.get(e, "status.containerStatuses")).filter({
name: "compute"
}).map("state.running.startedAt").first() || _.get(e, "status.startTime");
return t ? moment(t).fromNow(!0) : "--";
};
}), angular.module("openshiftConsole").directive("vmState", function() {
function e(e) {
var t = _.get(e, "_vm.status.phase");
return void 0 !== t ? t : _.get(e, ".spec.running") ? "Unknown" : "Not Running";
}
function t(t) {
return e(t.ovm);
}
function n(n) {
n.$watch(t, function() {
n.status = e(n.ovm);
});
}
return n.$inject = [ "$scope" ], {
scope: {
ovm: "<"
},
controller: n,
templateUrl: "views/overview/_vm-status.html"
};
}), angular.module("openshiftConsole").constant("KubevirtVersions", {
offlineVirtualMachine: {
resource: "offlinevirtualmachines",
group: "kubevirt.io",
version: "v1alpha1"
},
virtualMachine: {
resource: "virtualmachines",
group: "kubevirt.io",
version: "v1alpha1"
}
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
}, m = function() {
o.error = !0;
}, p = function() {
if (!o.error && !i) {
var e = c();
e && (r = Date.now(), a.getPodMetrics(e).then(d, m));
}
};
o.updateInView = function(e) {
i = !e, e && (!r || Date.now() > r + n.getDefaultUpdateInterval()) && p();
};
var g;
o.$onInit = function() {
g = e(p, n.getDefaultUpdateInterval(), !1), p();
}, o.$onDestroy = function() {
g && (e.cancel(g), g = null);
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
var m = _.throttle(function() {
e.$evalAsync(function() {
c.lines = _.clone(d);
});
}, 200), p = 0, g = function(e) {
if (e) {
var t = ansi_up.escape_for_html(e), n = ansi_up.ansi_to_html(t), a = r.linkify(n, "_blank", !0);
p++, d.push({
markup: a,
id: p
}), d.length > u && (d = _.takeRight(d, u)), m();
}
}, f = function() {
s && (s.stop(), s = null);
}, h = function() {
var e = {
follow: !0,
tailLines: u
};
(s = a.createStream(i, o, c.context, e)).start(), s.onMessage(g), s.onClose(function() {
s = null;
});
};
c.$onInit = function() {
"ReplicationController" === c.apiObject.kind ? (i = "deploymentconfigs/log", o = l(c.apiObject, "deploymentConfig")) : (i = n.kindToResource(c.apiObject.kind) + "/log", o = c.apiObject.metadata.name), h();
}, c.$onDestroy = function() {
f();
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
var u = e("canI"), d = e("deploymentIsInProgress"), m = e("isBinaryBuild"), p = e("enableTechPreviewFeature");
l.deploymentConfigsInstantiateVersion = n.getPreferredVersion("deploymentconfigs/instantiate"), l.replicationControllersVersion = n.getPreferredVersion("replicationcontrollers"), l.serviceBindingsVersion = n.getPreferredVersion("servicebindings"), l.deploymentConfigsVersion = n.getPreferredVersion("deploymentconfigs"), l.deploymentConfigsInstantiateVersion = n.getPreferredVersion("deploymentconfigs/instantiate"), l.deploymentConfigsLogVersion = n.getPreferredVersion("deploymentconfigs/log"), l.podsVersion = n.getPreferredVersion("pods"), l.podsLogVersion = n.getPreferredVersion("pods/log");
var g = function(e) {
var t = _.get(e, "spec.triggers");
_.isEmpty(t) || (l.imageChangeTriggers = _.filter(t, function(e) {
return "ImageChange" === e.type && _.get(e, "imageChangeParams.automatic");
}));
}, f = function(e) {
e && !l.current && "DeploymentConfig" !== e.kind && "Deployment" !== e.kind && (l.current = e);
}, h = function(e) {
l.rgv = n.objectToResourceGroupVersion(e), f(e), g(e);
};
l.$onChanges = function(e) {
e.apiObject && h(e.apiObject.currentValue);
};
var v = [], y = function(e) {
if (!l.state.hpaByResource) return null;
var t = _.get(e, "kind"), n = _.get(e, "metadata.name");
return _.get(l.state.hpaByResource, [ t, n ], v);
};
l.showBindings = r.SERVICE_CATALOG_ENABLED && p("pod_presets"), l.$doCheck = function() {
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
templateUrl: "views/modals/confirm.html",
controller: "ConfirmModalController",
resolve: {
modalConfig: function() {
return {
title: "Cancel deployment " + a + "?",
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
controller: [ "$filter", "APIService", "AuthorizationService", "BindingService", "ListRowUtils", "ServiceInstancesService", function(e, t, n, a, r, o) {
var i = this, s = e("isBindingFailed"), c = e("isBindingReady"), l = e("serviceInstanceFailedMessage"), u = e("truncate");
_.extend(i, r.ui);
var d = e("serviceInstanceDisplayName");
i.serviceBindingsVersion = t.getPreferredVersion("servicebindings"), i.serviceInstancesVersion = t.getPreferredVersion("serviceinstances");
var m = function() {
var e = o.getServiceClassNameForInstance(i.apiObject);
return _.get(i, [ "state", "serviceClasses", e ]);
}, p = function() {
var e = o.getServicePlanNameForInstance(i.apiObject);
return _.get(i, [ "state", "servicePlans", e ]);
}, g = function() {
_.get(i.apiObject, "metadata.deletionTimestamp") ? i.instanceStatus = "deleted" : s(i.apiObject) ? i.instanceStatus = "failed" : c(i.apiObject) ? i.instanceStatus = "ready" : i.instanceStatus = "pending";
};
i.$doCheck = function() {
g(), i.notifications = r.getNotifications(i.apiObject, i.state), i.serviceClass = m(), i.servicePlan = p(), i.displayName = d(i.apiObject, i.serviceClass), i.isBindable = a.isServiceBindable(i.apiObject, i.serviceClass, i.servicePlan);
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
}), angular.module("openshiftConsole").directive("deployImage", [ "$filter", "$q", "$window", "$uibModal", "APIService", "ApplicationGenerator", "DataService", "ImagesService", "Navigate", "NotificationsService", "ProjectsService", "QuotaService", "TaskList", "SecretsService", "keyValueEditorUtils", "gettextCatalog", function(e, t, n, a, r, o, i, s, c, l, u, d, m, p, g, f) {
var h = r.getPreferredVersion("imagestreamimages"), v = r.getPreferredVersion("configmaps"), y = r.getPreferredVersion("secrets");
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
function r() {
var e = g.mapEntries(g.compactEntries(n.labels));
return s.getResources({
name: n.app.name,
image: n.import.name,
namespace: n.import.namespace,
tag: n.import.tag || "latest",
ports: n.ports,
volumes: n.volumes,
env: g.compactEntries(n.env),
labels: e
});
}
n.mode = "istag", n.istag = {}, n.app = {}, n.env = [], n.labels = [ {
name: "app",
value: ""
} ], n.$on("no-projects-cannot-create", function() {
n.noProjectsCantCreate = !0;
});
var p = e("orderByDisplayName"), b = e("getErrorDetails"), S = {}, C = function() {
l.hideNotification("deploy-image-list-config-maps-error"), l.hideNotification("deploy-image-list-secrets-error"), _.each(S, function(e) {
!e.id || "error" !== e.type && "warning" !== e.type || l.hideNotification(e.id);
});
};
n.valueFromNamespace = {};
var w = function() {
if (_.has(n.input.selectedProject, "metadata.uid")) return t.when(n.input.selectedProject);
var a = n.input.selectedProject.metadata.name, r = n.input.selectedProject.metadata.annotations["new-display-name"], o = e("description")(n.input.selectedProject);
return u.create(a, r, o);
}, P = e("stripTag"), k = e("stripSHA"), j = e("humanizeKind"), I = function(e) {
return e.length > 24 ? e.substring(0, 24) : e;
}, T = function() {
var e = _.last(n.import.name.split("/"));
return e = k(e), e = P(e), e = I(e);
};
n.findImage = function() {
n.loading = !0, s.findImage(n.imageName, {
namespace: n.input.selectedProject.metadata.name
}).then(function(e) {
if (n.import = e, n.loading = !1, "Success" === _.get(e, "result.status")) {
n.forms.imageSelection.imageName.$setValidity("imageLoaded", !0);
var t = n.import.image;
t && (n.app.name = T(), n.runsAsRoot = s.runsAsRoot(t), n.ports = o.parsePorts(t), n.volumes = s.getVolumes(t), n.createImageStream = !0);
} else n.import.error = _.get(e, "result.message", "An error occurred finding the image.");
}, function(t) {
n.import = {
error: e("getErrorDetails")(t) || f.getString("An error occurred finding the image.")
}, n.loading = !1;
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
var r, c = _.get(t, "tagObject.items[0].image");
n.app.name = I(t.imageStream), n.import = {
name: t.imageStream,
tag: t.tagObject.tag,
namespace: t.namespace
}, c && (r = t.imageStream + "@" + c, n.loading = !0, i.get(h, r, {
namespace: t.namespace
}).then(function(e) {
n.loading = !1, n.import.image = e.image, n.ports = o.parsePorts(e.image), n.volumes = s.getVolumes(e.image), n.runsAsRoot = !1;
}, function(t) {
n.import.error = e("getErrorDetails")(t) || f.getString("An error occurred."), n.loading = !1;
}));
} else delete n.import;
}, !0), n.$watch("input.selectedProject", function(e) {
if (n.env = _.reject(n.env, "valueFrom"), _.get(e, "metadata.uid")) {
if (!n.valueFromNamespace[e.metadata.name]) {
var t = [], a = [];
i.list(v, {
namespace: n.input.selectedProject.metadata.name
}, null, {
errorNotification: !1
}).then(function(r) {
t = p(r.by("metadata.name")), n.valueFromNamespace[e.metadata.name] = t.concat(a);
}, function(e) {
403 !== e.status && l.addNotification({
id: "deploy-image-list-config-maps-error",
type: "error",
message: f.getString("Could not load config maps."),
details: b(e)
});
}), i.list(y, {
namespace: n.input.selectedProject.metadata.name
}, null, {
errorNotification: !1
}).then(function(r) {
a = p(r.by("metadata.name")), n.valueFromNamespace[e.metadata.name] = a.concat(t);
}, function(e) {
403 !== e.status && l.addNotification({
id: "deploy-image-list-secrets-error",
type: "error",
message: f.getString("Could not load secrets."),
details: b(e)
});
});
}
} else n.mode = "istag";
});
var R, N = e("displayName"), A = function() {
var e = {
started: f.getString("Deploying image {{name}} to project {{project}}", {
name: n.app.name,
project: N(n.input.selectedProject)
}),
success: f.getString("Deployed image {{name}} to project {{project}}", {
name: n.app.name,
project: N(n.input.selectedProject)
}),
failure: f.getString("Failed to deployed image {{name}} to project {{project}}", {
name: n.app.name,
project: N(n.input.selectedProject)
})
};
m.clear(), m.add(e, {}, n.input.selectedProject.metadata.name, function() {
var e = t.defer();
return i.batch(R, {
namespace: n.input.selectedProject.metadata.name
}).then(function(t) {
var a, r = !_.isEmpty(t.failure);
a = r ? (a = _.map(t.failure, function(e) {
return {
type: "error",
message: f.getString("Cannot create ") + j(e.object.kind).toLowerCase() + ' "' + e.object.metadata.name + '". ',
details: e.data.message
};
})).concat(_.map(t.success, function(e) {
return {
type: "success",
message: f.getString("Created ") + j(e.kind).toLowerCase() + ' "' + e.metadata.name + '" ' + f.getString("successfully.")
};
})) : [ {
type: "success",
message: f.getString("All resources for image {{name}} were created successfully.", {
name: n.app.name
})
} ], e.resolve({
alerts: a,
hasErrors: r
});
}), e.promise;
}), n.isDialog ? n.$emit("deployImageNewAppCreated", {
project: n.input.selectedProject,
appName: n.app.name
}) : c.toNextSteps(n.app.name, n.input.selectedProject.metadata.name);
}, E = function(e) {
a.open({
templateUrl: "views/modals/confirm.html",
controller: "ConfirmModalController",
resolve: {
modalConfig: function() {
return {
alerts: e,
title: f.getString("Confirm Creation"),
details: f.getString("Problems were detected while checking your application configuration."),
okButtonText: f.getString("Create Anyway"),
okButtonClass: "btn-danger",
cancelButtonText: f.getString("Cancel")
};
}
}
}).result.then(A);
}, D = function(e) {
S = e.quotaAlerts || [];
var t = _.filter(S, {
type: "error"
});
n.nameTaken || t.length ? (n.disableInputs = !1, _.each(S, function(e) {
e.id = _.uniqueId("deploy-image-alert-"), l.addNotification(e);
})) : S.length ? (E(S), n.disableInputs = !1) : A();
};
n.create = function() {
n.disableInputs = !0, C(), w().then(function(e) {
n.input.selectedProject = e, R = r();
var t = o.ifResourcesDontExist(R, n.input.selectedProject.metadata.name), a = d.getLatestQuotaAlerts(R, {
namespace: n.input.selectedProject.metadata.name
}), i = function(e) {
return n.nameTaken = e.nameTaken, a;
};
t.then(i, i).then(D, D);
}, function(e) {
n.disableInputs = !1, "AlreadyExists" === e.data.reason ? n.projectNameTaken = !0 : l.addNotification({
id: "deploy-image-create-project-error",
type: "error",
message: f.getString("An error occurred creating project."),
details: b(e)
});
});
}, n.openCreateWebhookSecretModal = function() {
var e = n.$new();
e.type = "image", e.namespace = n.input.selectedProject.metadata.name, a.open({
templateUrl: "views/modals/create-secret.html",
controller: "CreateSecretModalController",
scope: e
});
}, n.$on("newAppFromDeployImage", n.create), n.$on("$destroy", C);
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
} ]), angular.module("openshiftConsole").directive("keyValueEditor", [ "$routeParams", "$timeout", "$filter", "APIService", "keyValueEditorConfig", "keyValueEditorUtils", function(e, t, n, a, r, o) {
var i = n("humanizeKind"), s = n("canI"), c = 1e3;
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
var o;
e.validation = {
key: e.keyValidator,
val: e.valueValidator
}, a.keyValidatorRegex && (e.validation.key = e.keyValidatorRegex), a.valueValidatorRegex && (e.validation.val = e.valueValidatorRegex), "grabFocus" in a && (e.grabFocus = !0, t(function() {
e.grabFocus = void 0;
})), "cannotAdd" in a && (e.cannotAdd = !0), "cannotDelete" in a && (e.cannotDeleteAny = !0), "isReadonly" in a && (e.isReadonlyAny = !0), "isReadonlyKeys" in a && (o = e.$watch("entries", function(t) {
t && (_.each(e.entries, function(e) {
e.isReadonlyKey = !0;
}), o());
})), "cannotSort" in a && (e.cannotSort = !0), "showHeader" in a && (e.showHeader = !0), "allowEmptyKeys" in a && (e.allowEmptyKeys = !0), e.groupByKind = function(e) {
return i(e.kind);
}, e.valueFromObjectSelected = function(e, t) {
"ConfigMap" === t.kind ? (e.valueFrom.configMapKeyRef = {
name: t.metadata.name
}, delete e.valueFrom.secretKeyRef) : "Secret" === t.kind && (e.valueFrom.secretKeyRef = {
name: t.metadata.name
}, delete e.valueFrom.configMapKeyRef), delete e.selectedValueFromKey;
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
var n = [], r = [], i = c++;
t.configMapVersion = a.getPreferredVersion("configmaps"), t.secretsVersion = a.getPreferredVersion("secrets");
var l = s(t.secretsVersion, "get"), u = s(t.configMapVersion, "get");
angular.extend(t, {
namespace: e.project,
unique: i,
forms: {},
placeholder: o.newEntry(),
setFocusKeyClass: "key-value-editor-set-focus-key-" + i,
setFocusValClass: "key-value-editor-set-focus-value-" + i,
uniqueForKey: o.uniqueForKey,
uniqueForValue: o.uniqueForValue,
dragControlListeners: {
accept: function(e, t) {
return e.itemScope.sortableScope.$id === t.$id;
},
orderChanged: function() {
t.forms.keyValueEditor.$setDirty();
}
},
deleteEntry: function(e, n) {
t.entries.splice(e, n), !t.entries.length && t.addRowLink && o.addEntry(t.entries), t.forms.keyValueEditor.$setDirty();
},
isReadonlySome: function(e) {
return _.includes(n, e);
},
cannotDeleteSome: function(e) {
return _.includes(r, e);
},
onAddRow: function() {
o.addEntry(t.entries), o.setFocusOn("." + t.setFocusKeyClass);
},
onAddRowWithSelectors: function() {
o.addEntryWithSelectors(t.entries), o.setFocusOn("." + t.setFocusKeyClass);
},
isValueFromReadonly: function(e) {
return t.isReadonlyAny || e.isReadonlyValue || e.refType && !e.selectedValueFrom || _.isEmpty(t.valueFromSelectorOptions);
}
}), t.$watch("cannotDelete", function(e) {
angular.isArray(e) && (t.cannotDeleteAny = !1, r = e);
}), t.$watch("isReadonly", function(e) {
angular.isArray(e) && (t.isReadonlyAny = !1, n = e);
}), t.$watch("addRowLink", function(e) {
t.addRowLink = e || "Add row", t.entries && !t.entries.length && o.addEntry(t.entries);
}), t.$watch("entries", function(e) {
e && !e.length && o.addEntry(t.entries), _.each(t.entries, function(e) {
o.altTextForValueFrom(e, t.namespace), o.setEntryPerms(e, l, u);
}), o.findReferenceValueForEntries(e, t.valueFromSelectorOptions);
}), t.$watch("valueFromSelectorOptions", function() {
o.findReferenceValueForEntries(t.entries, t.valueFromSelectorOptions);
});
} ]
};
} ]), angular.module("openshiftConsole").directive("confirmOnExit", [ "Logger", "gettextCatalog", function(e, t) {
return {
scope: {
dirty: "=",
message: "="
},
link: function(n) {
if (!_.get(window, "OPENSHIFT_CONSTANTS.DISABLE_CONFIRM_ON_EXIT") && !_.get(window, "OPENSHIFT_CONSTANTS.CONFIRM_DIALOG_BLOCKED")) {
var a = function() {
return n.message || t.getString("You have unsaved changes. Leave this page anyway?");
}, r = function() {
if (n.dirty) return a();
};
$(window).on("beforeunload", r);
var o = n.$on("$routeChangeStart", function(r) {
if (n.dirty) {
var o = new Date().getTime();
confirm(a()) || (new Date().getTime() - o < 50 ? (_.set(window, "OPENSHIFT_CONSTANTS.CONFIRM_DIALOG_BLOCKED", !0), e.warn(t.getString("Confirm on exit prompt appears to have been blocked by the browser."))) : r.preventDefault());
}
});
n.$on("$destroy", function() {
$(window).off("beforeunload", r), o && o();
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
s = a(!1), i(!0), e !== t && (n.resource = s);
try {
a(!0), r();
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
controller: [ "$filter", "APIService", "DataService", "EnvironmentService", "NotificationsService", "gettextCatalog", function(e, t, n, a, r, o) {
var i, s, c, l, u = this, d = t.getPreferredVersion("configmaps"), m = t.getPreferredVersion("secrets"), p = !1, g = [], f = [], h = !1, v = e("canI"), y = e("getErrorDetails"), b = e("humanizeKind"), S = e("orderByDisplayName"), C = function(e, t) {
p || (u.form && !u.form.$pristine && u.updatedObject ? a.isEnvironmentEqual(e, t) ? u.updatedObject = a.mergeEdits(u.updatedObject, e) : (p = !0, r.addNotification({
type: "warning",
message: o.getString("The environment variables for the {{kind}} have been updated in the background.", {
kind: i
}),
details: o.getString("Saving your changes may create a conflict or cause loss of data.")
})) : u.updatedObject = a.copyAndNormalize(e));
}, w = function() {
n.list(d, {
namespace: u.apiObject.metadata.namespace
}).then(function(e) {
g = S(e.by("metadata.name")), u.valueFromObjects = g.concat(f);
});
}, _ = function() {
v("secrets", "list") && n.list(m, {
namespace: u.apiObject.metadata.namespace
}).then(function(e) {
f = S(e.by("metadata.name")), u.valueFromObjects = g.concat(f);
});
}, P = function() {
h || (h = !0, w(), _());
}, k = function(e, n) {
i = b(e.kind), s = e.metadata.name, c = t.objectToResourceGroupVersion(e), u.canIUpdate = v(c, "update"), l ? l.finally(function() {
C(e, n);
}) : C(e, n), u.containers = a.getContainers(u.updatedObject), u.disableValueFrom || u.ngReadonly || !u.canIUpdate || P();
};
u.$onChanges = function(e) {
e.apiObject && e.apiObject.currentValue && k(e.apiObject.currentValue, e.apiObject.previousValue);
}, u.save = function() {
var e = "save-env-error-" + s;
r.hideNotification(e), a.compact(u.updatedObject), (l = n.update(c, s, u.updatedObject, {
namespace: u.updatedObject.metadata.namespace
})).then(function() {
r.addNotification({
type: "success",
message: o.getString("Environment variables for{{kind}} {{name}} were successfully updated.", {
kind: i,
name: s
})
}), u.form.$setPristine();
}, function(t) {
r.addNotification({
id: e,
type: "error",
message: o.getString("An error occurred updating environment variables for {{kind}} {{name}}.", {
kind: i,
name: s
}),
details: y(t)
});
}).finally(function() {
l = null;
});
}, u.clearChanges = function() {
u.updatedObject = a.copyAndNormalize(u.apiObject), u.containers = a.getContainers(u.updatedObject), u.form.$setPristine(), p = !1;
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
var r = this, o = _.get(a, "DISABLE_GLOBAL_EVENT_WATCH"), i = e("isIE")();
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
}, m = function(e) {
r.hide = !e;
};
r.onClick = function() {
n.$emit("NotificationDrawerWrapper.toggle");
};
var p = function(e, t) {
r.showUnreadNotificationsIndicator = !!t;
}, g = function(e, t) {
return _.get(e, "params.project") !== _.get(t, "params.project");
}, f = function() {
l(t.project, p), m(t.project);
}, h = function() {
f(), s.push(n.$on("$routeChangeSuccess", function(e, t, n) {
g(t, n) && f();
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
controller: [ "$filter", "$interval", "$location", "$rootScope", "$routeParams", "$scope", "$timeout", "APIService", "Constants", "DataService", "EventsService", "NotificationsService", function(e, t, n, a, r, o, i, s, c, l, u) {
var d, m, p = s.getPreferredVersion("events"), g = s.getPreferredVersion("projects"), f = _.get(c, "DISABLE_GLOBAL_EVENT_WATCH"), h = e("isIE")(), v = this, y = [], b = {}, S = {}, C = {}, w = function(e) {
e || (v.drawerHidden = !0);
}, P = function(e, t) {
return _.get(e, "params.project") !== _.get(t, "params.project");
}, k = function(e) {
return l.get(g, e, {}, {
errorNotification: !1
}).then(function(e) {
return C[e.metadata.name] = e, e;
});
}, j = function(t, n) {
return {
heading: e("displayName")(C[t]),
project: C[t],
notifications: n
};
}, I = function(e) {
return _.filter(e, "unread");
}, T = function() {
_.each(v.notificationGroups, function(e) {
e.totalUnread = I(e.notifications).length, e.hasUnread = !!e.totalUnread, a.$emit("NotificationDrawerWrapper.onUnreadNotifications", e.totalUnread);
});
}, R = function(e) {
_.each(v.notificationGroups, function(t) {
_.remove(t.notifications, {
uid: e.uid,
namespace: e.namespace
});
});
}, N = function(e) {
S[r.project] && delete S[r.project][e.uid], b[r.project] && delete b[r.project][e.uid], R(e);
}, A = function() {
b[r.project] = {}, S[r.project] = {};
}, E = function(e) {
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
}, D = function(e) {
return _.reduce(e, function(e, t) {
return u.isImportantAPIEvent(t) && !u.isCleared(t.metadata.uid) && (e[t.metadata.uid] = t), e;
}, {});
}, $ = function(e, t) {
var n = r.project;
return _.assign({}, e[n], t[n]);
}, B = function(e) {
return _.orderBy(e, [ "event.lastTimestamp", "event.metadata.resourceVersion" ], [ "desc", "desc" ]);
}, L = function() {
a.$evalAsync(function() {
v.notificationGroups = [ j(r.project, B($(b, S))) ], T();
});
}, V = function() {
_.each(y, function(e) {
e();
}), y = [];
}, O = function() {
m && (l.unwatch(m), m = null);
}, U = function() {
d && d(), d = null;
}, x = function(e) {
b[r.project] = E(D(e.by("metadata.name"))), L();
}, F = function(e, t) {
var n = t.namespace || r.project, a = t.id ? n + "/" + t.id : _.uniqueId("notification_") + Date.now();
t.showInDrawer && !u.isCleared(a) && (S[n] = S[n] || {}, S[n][a] = {
actions: t.actions,
unread: !u.isRead(a),
trackByID: t.trackByID,
uid: a,
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
U(), d = a.$on("NotificationsService.onNotificationAdded", t);
}), z = function() {
k(r.project).then(function() {
M(r.project, x), q(r.project, F), w(r.project), L();
});
};
angular.extend(v, {
drawerHidden: !0,
allowExpand: !0,
drawerExpanded: "true" === localStorage.getItem("openshift/notification-drawer-expanded"),
drawerTitle: "Notifications",
hasUnread: !1,
showClearAll: !0,
showMarkAllRead: !0,
onClose: function() {
v.drawerHidden = !0;
},
onMarkAllRead: function(e) {
_.each(e.notifications, function(e) {
e.unread = !1, u.markRead(e.uid);
}), L(), a.$emit("NotificationDrawerWrapper.onMarkAllRead");
},
onClearAll: function(e) {
_.each(e.notifications, function(e) {
e.unread = !1, u.markRead(e.uid), u.markCleared(e.uid);
}), A(), L(), a.$emit("NotificationDrawerWrapper.onMarkAllRead");
},
notificationGroups: [],
headingInclude: "views/directives/notifications/header.html",
notificationBodyInclude: "views/directives/notifications/notification-body.html",
customScope: {
clear: function(e, t, n) {
u.markRead(e.uid), u.markCleared(e.uid), n.notifications.splice(t, 1), N(e), L();
},
markRead: function(e) {
e.unread = !1, u.markRead(e.uid), L();
},
close: function() {
v.drawerHidden = !0;
},
onLinkClick: function(e) {
e.onClick(), v.drawerHidden = !0;
},
countUnreadNotifications: T
}
}), o.$watch("$ctrl.drawerExpanded", function(e) {
localStorage.setItem("openshift/notification-drawer-expanded", e ? "true" : "false");
});
var H = function() {
r.project && z(), y.push(a.$on("$routeChangeSuccess", function(e, t, n) {
P(t, n) && (v.customScope.projectName = r.project, z());
})), y.push(a.$on("NotificationDrawerWrapper.toggle", function() {
v.drawerHidden = !v.drawerHidden;
})), y.push(a.$on("NotificationDrawerWrapper.hide", function() {
v.drawerHidden = !0;
})), y.push(a.$on("NotificationDrawerWrapper.clear", function(e, t) {
u.markCleared(t.uid), N(t), T();
}));
};
v.$onInit = function() {
f || h || H();
}, v.$onDestroy = function() {
U(), O(), V();
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
var i = moment.duration(o), s = [], c = i.years(), l = i.months(), u = i.days(), d = i.hours(), m = i.minutes(), p = i.seconds();
return r(c, "year", "years"), r(l, "month", "months"), r(u, "day", "days"), r(d, "hour", "hours"), r(m, "minute", "minutes"), r(p, "second", "seconds"), 1 === s.length && p && 1 === a ? n ? "minute" : "1 minute" : (0 === s.length && s.push("0 seconds"), s.length > a && (s.length = a), s.join(", "));
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
var t = [], n = moment.duration(e), a = Math.floor(n.asHours()), r = n.minutes(), o = n.seconds();
return (a < 0 || r < 0 || o < 0) && (a = r = o = 0), a && t.push(a + "h"), r && t.push(r + "m"), a || t.push(o + "s"), t.join(" ");
};
}), angular.module("openshiftConsole").filter("storageClass", [ "annotationFilter", function(e) {
return function(t) {
return e(t, "volume.beta.kubernetes.io/storage-class");
};
} ]).filter("storageClassAccessMode", [ "annotationFilter", function(e) {
return function(t) {
return e(t, "storage.alpha.openshift.io/access-mode");
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
}).filter("webhookURL", [ "canIFilter", "APIService", "DataService", "SecretsService", function(e, t, n, a) {
return function(r, o, i, s, c) {
var l = t.getPreferredVersion("secrets");
return e(l, "list") ? (i = a.getWebhookSecretValue(i, c), n.url({
resource: "buildconfigs/webhooks/" + encodeURIComponent(i) + "/" + encodeURIComponent(o.toLowerCase()),
name: r,
namespace: s,
group: "build.openshift.io"
})) : n.url({
resource: "buildconfigs/webhooks/",
name: r,
namespace: s,
group: "build.openshift.io"
}) + "<secret>/" + o.toLowerCase();
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
} ]).filter("isContainerLooping", function() {
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
}).filter("isTroubledPod", [ "isContainerLoopingFilter", "isContainerFailedFilter", "isContainerUnpreparedFilter", function(e, t, n) {
return function(a) {
if ("Unknown" === a.status.phase) return !0;
if ("Running" === a.status.phase && a.status.containerStatuses) {
var r;
for (r = 0; r < _.size(a.status.containerStatuses); ++r) {
var o = a.status.containerStatuses[r];
if (o.state) {
if (t(o)) return !0;
if (e(o)) return !0;
if (n(o)) return !0;
}
}
}
return !1;
};
} ]).filter("podWarnings", [ "isContainerLoopingFilter", "isContainerFailedFilter", "isContainerUnpreparedFilter", "isTerminatingFilter", function(e, t, n, a) {
return function(r) {
var o = [];
return "Unknown" === r.status.phase && o.push({
reason: "Unknown",
pod: r.metadata.name,
message: "The state of the pod could not be obtained. This is typically due to an error communicating with the host of the pod."
}), "Running" === r.status.phase && r.status.containerStatuses && _.each(r.status.containerStatuses, function(i) {
if (!i.state) return !1;
t(i) && (a(r) ? o.push({
severity: "error",
reason: "NonZeroExitTerminatingPod",
pod: r.metadata.name,
container: i.name,
message: "The container " + i.name + " did not stop cleanly when terminated (exit code " + i.state.terminated.exitCode + ")."
}) : o.push({
severity: "warning",
reason: "NonZeroExit",
pod: r.metadata.name,
container: i.name,
message: "The container " + i.name + " failed (exit code " + i.state.terminated.exitCode + ")."
})), e(i) && o.push({
severity: "error",
reason: "Looping",
pod: r.metadata.name,
container: i.name,
message: "The container " + i.name + " is crashing frequently. It must wait before it will be restarted again."
}), n(i) && o.push({
severity: "warning",
reason: "Unprepared",
pod: r.metadata.name,
container: i.name,
message: "The container " + i.name + " has been running for more than five minutes and has not passed its readiness check."
});
}), o.length > 0 ? o : null;
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
return !e.status.completionTimestamp;
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
var t, n = !1;
return _.each(e.status.initContainerStatuses, function(e) {
var a = _.get(e, "state");
if (!a.terminated || 0 !== a.terminated.exitCode) return a.terminated ? (t = a.terminated.reason ? "Init " + a.terminated.reason : a.terminated.signal ? "Init Signal: " + a.terminated.signal : "Init Exit Code: " + a.terminated.exitCode, n = !0, !0) : void (a.waiting && a.waiting.reason && "PodInitializing" !== a.waiting.reason && (t = "Init " + a.waiting.reason, n = !0));
}), n || (t = e.status.reason || e.status.phase, _.each(e.status.containerStatuses, function(e) {
var n, a, r = _.get(e, "state.waiting.reason") || _.get(e, "state.terminated.reason");
return r ? (t = r, !0) : (n = _.get(e, "state.terminated.signal")) ? (t = "Signal: " + n, !0) : (a = _.get(e, "state.terminated.exitCode")) ? (t = "Exit Code: " + a, !0) : void 0;
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
var a = e(n), r = null;
switch (a) {
case "Failed":
case "Ready":
r = _.get(t(n, a), "message");
}
return r;
};
} ]).filter("humanizeReason", function() {
return function(e) {
return _.startCase(e).replace("Back Off", "Back-off").replace("O Auth", "OAuth");
};
}).filter("humanizePodStatus", [ "humanizeReasonFilter", function(e) {
return e;
} ]).filter("donutURL", [ "navigateResourceURLFilter", function(e) {
return function(t, n) {
return 1 === _.size(n) ? e(_.sample(n)) : _.size(n) > 1 ? e(t) : void 0;
};
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
} ]).filter("isNonPrintable", function() {
return function(e) {
return !!e && /[\x00-\x09\x0E-\x1F]/.test(e);
};
}), angular.module("openshiftConsole").factory("logLinks", [ "$anchorScroll", "$document", "$location", "$window", function(e, t, n, a) {
var r = _.template([ "<%= baseURL %>#/discover?", "_g=(", "time:(", "from:now-1w,", "mode:relative,", "to:now", ")", ")", "&_a=(", "columns:!(kubernetes.container_name,message),", "index:'<%= index %>',", "query:(", "query_string:(", "analyze_wildcard:!t,", 'query:\'kubernetes.pod_name:"<%= podname %>" AND kubernetes.namespace_name:"<%= namespace %>"\'', ")", "),", "sort:!('@timestamp',desc)", ")", "#console_container_name=<%= containername %>", "&console_back_url=<%= backlink %>" ].join(""));
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
archiveUri: function(e, t, n) {
return !n || t && !t.startsWith("project.") || (t = "project"), t = t || "project." + e.namespace + "." + e.namespaceUid, e.index = t + ".*", "/" !== e.baseURL.substr(-1) && (e.baseURL += "/"), r(e);
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
} ]), angular.module("openshiftConsole").run([ "extensionRegistry", "$rootScope", "DataService", "AuthService", function(e, t, n, a) {
e.add("nav-user-dropdown", function() {
var e = [];
e.push({
type: "dom",
node: "<li><switch-language></switch-language></li>"
}), _.get(window, "OPENSHIFT_CONSTANTS.DISABLE_COPY_LOGIN_COMMAND") || e.push({
type: "dom",
node: '<li><copy-login-to-clipboard clipboard-text="oc login ' + _.escape(n.openshiftAPIBaseUrl()) + " --token=" + _.escape(a.UserStore().getToken()) + '"></copy-login-to-clipboard></li>'
}), e.push({
type: "dom",
node: "<li><set-home-page></set-home-page></li>"
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