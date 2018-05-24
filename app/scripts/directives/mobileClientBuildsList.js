'use strict';

(function() {
  angular.module('openshiftConsole').component('mobileClientBuildsList', {
    controller: [
      '$location',
      'APIService',
      'DataService',
      MobileClientBuildsList
    ],
    bindings: {
      mobileClient: '<'
    },
    templateUrl: 'views/mobile-client-builds-list.html'
  });

  function MobileClientBuildsList(
    $location,
    APIService,
    DataService
  ) {
    var ctrl = this;
    var buildConfigsVersion = APIService.getPreferredVersion('buildconfigs');
    var watches = [];  

    ctrl.$onChanges = function(changes) {
      var mobileClientChanged = _.get(changes, "mobileClient.currentValue", false);
      if (mobileClientChanged && !ctrl.context) {
        ctrl.context = {namespace: _.get(ctrl, 'mobileClient.metadata.namespace')};
      }

      if (mobileClientChanged && !ctrl.buildsWatchSet) {
        ctrl.buildsWatchSet = true;
        watches.push(DataService.watch(buildConfigsVersion, ctrl.context, function(buildConfigs) {    
          ctrl.mobileBuildConfigs = _.filter(buildConfigs.by('metadata.name'), function(buildConfig) {
            return _.get(buildConfig, 'metadata.labels.mobile-client-build') === 'true' && _.get(buildConfig, 'metadata.labels.mobile-client-id') === _.get(ctrl, 'mobileClient.metadata.name');
          });
          ctrl.loaded = true;
        }));
      }
    };

    ctrl.goToCreateClientBuild = function() {
      $location.url('project/' + ctrl.mobileClient.metadata.namespace + '/create-client-build/' + ctrl.mobileClient.metadata.name);
    };

    ctrl.$onDestroy = function(){
      DataService.unwatchAll(watches);
    };
  }
})();