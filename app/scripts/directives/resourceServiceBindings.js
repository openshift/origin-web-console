'use strict';

angular.module('openshiftConsole').component('resourceServiceBindings', {
  controller: [
    '$filter',
    'APIService',
    'BindingService',
    'CatalogService',
    'DataService',
    ResourceServiceBindings
  ],
  controllerAs: '$ctrl',
  bindings: {
    project: '<',
    projectContext: '<',
    apiObject: '<',
    createBinding: '&'
  },
  templateUrl: 'views/directives/resource-service-bindings.html'
});


function ResourceServiceBindings($filter,
                                 APIService,
                                 BindingService,
                                 CatalogService,
                                 DataService) {
  var ctrl = this;
  var enableTechPreviewFeature = $filter('enableTechPreviewFeature');
  var servicePlans;

  ctrl.bindings = [];
  ctrl.bindableServiceInstances = [];
  ctrl.serviceClasses = [];
  ctrl.serviceInstances = [];
  ctrl.showBindings = CatalogService.SERVICE_CATALOG_ENABLED && enableTechPreviewFeature('pod_presets');

  var limitWatches = $filter('isIE')();
  var DEFAULT_POLL_INTERVAL = 60 * 1000; // milliseconds
  var watches = [];
  var canI = $filter('canI');

  // API versions
  var serviceBindingsVersion = ctrl.serviceBindingsVersion = APIService.getPreferredVersion('servicebindings');
  var serviceClassesVersion = APIService.getPreferredVersion('clusterserviceclasses');
  var serviceInstancesVersion = APIService.getPreferredVersion('serviceinstances');
  var servicePlansVersion = APIService.getPreferredVersion('clusterserviceplans');

  var updateBindings = function() {
    if (!ctrl.apiObject || !ctrl.bindings) {
      return;
    }

    // Get only those bindings applicable to the resource
    ctrl.bindings = BindingService.getBindingsForResource(ctrl.bindings, ctrl.apiObject);
  };

  var sortServiceInstances = function() {
    ctrl.bindableServiceInstances = BindingService.filterBindableServiceInstances(ctrl.serviceInstances, ctrl.serviceClasses, servicePlans);
    ctrl.orderedServiceInstances = BindingService.sortServiceInstances(ctrl.serviceInstances, ctrl.serviceClasses);
  };

  ctrl.createBinding = function() {
    ctrl.overlayPanelVisible = true;
    ctrl.overlayPanelName = 'bindService';
  };

  ctrl.closeOverlayPanel = function() {
    ctrl.overlayPanelVisible = false;
  };

  var updateData = function() {
    DataService.unwatchAll(watches);
    watches = [];

    if (CatalogService.SERVICE_CATALOG_ENABLED && canI(serviceBindingsVersion, 'watch')) {
      watches.push(DataService.watch(serviceBindingsVersion, ctrl.projectContext, function(bindings) {
        ctrl.bindings = bindings.by('metadata.name');
        updateBindings();
      }, {poll: limitWatches, pollInterval: DEFAULT_POLL_INTERVAL}));
    }

    // The canI check on watch should be temporary until we have a different solution for handling secret parameters
    if (CatalogService.SERVICE_CATALOG_ENABLED && canI(serviceInstancesVersion, 'watch')) {
      watches.push(DataService.watch(serviceInstancesVersion, ctrl.projectContext, function(serviceInstances) {
        ctrl.serviceInstances = serviceInstances.by('metadata.name');
        sortServiceInstances();
      }, {poll: limitWatches, pollInterval: DEFAULT_POLL_INTERVAL}));

      // If we can't watch instances don't bother getting service classes either
      DataService.list(serviceClassesVersion, {}, function(serviceClasses) {
        ctrl.serviceClasses = serviceClasses.by('metadata.name');
        sortServiceInstances();
      });

      DataService.list(servicePlansVersion, {}, function(planData) {
        servicePlans = planData.by('metadata.name');
      });
    }
  };

  ctrl.$onChanges = function(onChangesObj) {
    if (onChangesObj.projectContext && ctrl.showBindings) {
      updateData();
    }
  };

  ctrl.$onDestroy = function() {
    DataService.unwatchAll(watches);
  };
}
