'use strict';

(function () {
  angular.module('openshiftConsole').component('mobileClientRow', {
    controller: [
      '$filter',
      '$location',
      '$routeParams',
      'APIService',
      'AuthorizationService',
      'BuildsService',
      'DataService',
      'ListRowUtils',
      'Navigate',
      'ServiceInstancesService',
      MobileAppRow,
    ],
    controllerAs: 'row',
    bindings: {
      apiObject: '<',
      state: '<'
    },
    templateUrl: 'views/overview/_mobile-client-row.html'
  });

  function MobileAppRow($filter, $location, $routeParams, APIService, AuthorizationService, BuildsService, DataService, ListRowUtils, Navigate, ServiceInstancesService) {
    var row = this;
    var serviceInstancesVersion = APIService.getPreferredVersion('serviceinstances');
    var serviceClassesVersion = APIService.getPreferredVersion('clusterserviceclasses');
    var serviceBindingsVersion = APIService.getPreferredVersion('servicebindings');
    var buildsVersion = APIService.getPreferredVersion('builds');
    var isServiceInstanceReady = $filter('isServiceInstanceReady');
    var isMobileService = $filter('isMobileService');
    var watches = [];
    var boundServices = 'Bound Services';
    var unboundServices = 'Unbound Services';
    row.installType = '';
    row.config = {
      'chartId': _.get(row, 'apiObject.metadata.name') + '-services-info',
      'legend': {
        'show': true,
        'position': 'right'
      },
      colors: {}
    };
    row.config.colors[boundServices] = $.pfPaletteColors.blue;
    row.config.colors[unboundServices] = $.pfPaletteColors.orange;
    row.chartHeight = 80;

    _.extend(row, ListRowUtils.ui);

    row.navigateToMobileTab = function(tab) {
      var resource = _.get(row, 'apiObject.metadata.name');
      var kind = _.get(row, 'apiObject.kind');
      var namespace = _.get(row, 'apiObject.metadata.namespace');
      var opts = {
        tab: tab
      };
      return Navigate.resourceURL(resource, kind, namespace, null, opts);
    }

    row.navigateToBuild = function(build) {
      var resource = _.get(build, 'metadata.labels.buildconfig');
      var namespace = _.get(build, 'metadata.namespace');
      return Navigate.resourceURL(resource, BUILD_CONFIG_KIND, namespace);
    }

    row.updateServicesInfo = function() {
      if (row.services) {
        row.servicesNotBoundCount = row.services.length - row.bindings.length;

        row.data = [
          [boundServices, row.bindings.length],
          [unboundServices, row.servicesNotBoundCount]
        ];
      }
    };

    row.$onChanges = function(changes) {
      var apiObjectChanges = changes.apiObject && changes.apiObject.currentValue;
      if (apiObjectChanges) {
        row.bundleDisplay = row.apiObject.spec.appIdentifier;
        row.clientType = row.apiObject.spec.clientType.toUpperCase();
        switch (row.apiObject.spec.clientType) {
          case 'android':
            row.installType = 'gradle';
            break;
          case 'iOS':
            row.installType = 'cocoapods';
            break;
          case 'cordova':
            row.installType = 'npm';
            break;
        }
      }

      if (apiObjectChanges && !row.context) {
        row.context = {namespace: _.get(row, 'apiObject.metadata.namespace')};
      }

      if (apiObjectChanges && !row.serviceInstancesWatched) {
        row.serviceInstancesWatched = true;
        DataService.list(serviceClassesVersion, row.context, function(serviceClasses) {
          serviceClasses = serviceClasses.by('metadata.name');
          watches.push(DataService.watch(serviceInstancesVersion, row.context, function(serviceinstances) {
            row.services = _.filter(serviceinstances.by('metadata.name'), function(serviceInstance){
              var serviceClass = _.get(serviceClasses, ServiceInstancesService.getServiceClassNameForInstance(serviceInstance));
              return isMobileService(serviceClass) && isServiceInstanceReady(serviceInstance);
            });
            row.updateServicesInfo();
          }, { errorNotification: false }));
        });
      }

      if (apiObjectChanges && !row.bindingsWatched) {
        row.bindingsWatched = true;
        watches.push(DataService.watch(serviceBindingsVersion, row.context, function(bindingsData) {
          row.bindings = _.filter(bindingsData.by('metadata.name'), function(binding) {
            return _.get(binding.metadata.annotations, 'binding.aerogear.org/consumer') === _.get(row, 'apiObject.metadata.name');
          });
          row.updateServicesInfo();
        }));
      }

      if (apiObjectChanges && !row.buildsWatched) {
        row.buildsWatched = true;
        watches.push(DataService.watch(buildsVersion, row.context, function(buildsData) {    
          // Filter builds by mobile client id
          var builds = _.filter(buildsData.by('metadata.name'), function(build) {
            return _.get(build, 'metadata.labels.mobile-client-id') === _.get(row, 'apiObject.metadata.name');
          });
          row.builds = BuildsService.sortBuilds(builds, true);
        }));
      }
    };

    row.mobileclientVersion = {
      group: "mobile.k8s.io",
      version: "v1alpha1",
      resource: "mobileclients"
    };
    row.actionsDropdownVisible = function () {
      // no actions on those marked for deletion
      if (_.get(row.apiObject, 'metadata.deletionTimestamp')) {
        return false;
      }

      // We can delete mobileclients
      return AuthorizationService.canI(row.mobileclientVersion, 'delete');
    };
    row.projectName = $routeParams.project;
    row.browseCatalog = function () {
      Navigate.toProjectCatalog(row.projectName, {category: 'mobile', subcategory: 'services'});
    };

    row.$onDestroy = function() {
      DataService.unwatchAll(watches);
    }
  }
})();
