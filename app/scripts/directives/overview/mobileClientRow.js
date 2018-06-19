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
    var isBindingReady = $filter('isBindingReady');
    var isServiceInstanceReady = $filter('isServiceInstanceReady');
    var isMobileClientEnabled = $filter('isMobileClientEnabled');
    var isMobileService = $filter('isMobileService');
    var watches = [];
    var boundServices = 'Bound Mobile Services';
    var unboundServices = 'Unbound Mobile Services';
    row.mobileClientsVersion = APIService.getPreferredVersion('mobileclients');
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
    row.chartHeight = 95;

    _.extend(row, ListRowUtils.ui);

    row.navigateToMobileTab = function(tab, anchor) {
      var resource = _.get(row, 'apiObject.metadata.name');
      var kind = _.get(row, 'apiObject.kind');
      var namespace = _.get(row, 'apiObject.metadata.namespace');
      var opts = {
        tab: tab
      };
      var url = Navigate.resourceURL(resource, kind, namespace, null, opts);

      return anchor ? url + '#' + anchor : url;
    }

    row.updateServicesInfo = function() {
      if (row.mobileClientEnabledServices) {
        row.servicesNotBoundCount = row.mobileClientEnabledServices.length - row.bindings.length;

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
            row.mobileClientEnabledServices = _.filter(row.services, function(service){
              var serviceClass = _.get(serviceClasses, ServiceInstancesService.getServiceClassNameForInstance(service));
              return isMobileClientEnabled(serviceClass);
            });
            row.updateServicesInfo();
          }, { errorNotification: false }));
        });
      }

      if (apiObjectChanges && !row.bindingsWatched) {
        row.bindingsWatched = true;
        watches.push(DataService.watch(serviceBindingsVersion, row.context, function(bindingsData) {
          row.bindings = _.filter(bindingsData.by('metadata.name'), function(binding) {
            return _.get(binding.metadata.annotations, 'binding.aerogear.org/consumer') === _.get(row, 'apiObject.metadata.name') && isBindingReady(binding);
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

    row.actionsDropdownVisible = function () {
      if (_.get(row.apiObject, 'metadata.deletionTimestamp')) {
        return false;
      }

      return AuthorizationService.canI(row.mobileClientsVersion, 'delete');
    };
    row.projectName = $routeParams.project;
    row.browseCatalog = function () {
      Navigate.toProjectCatalog(row.projectName);
    };

    row.$onDestroy = function() {
      DataService.unwatchAll(watches);
    }
  }
})();