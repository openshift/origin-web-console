'use strict';

(function() {
  angular.module('openshiftConsole').component('mobileClientDownloadUrl', {
    controller: [
      'APIService',
      'DataService',
      MobileClientDownloadUrl
    ],
    bindings: {
      mobileBuild: '<',
      showPanel: '<'
    },
    templateUrl: 'views/mobile-client-download-url.html'
  });

  function MobileClientDownloadUrl(
    APIService,
    DataService
  ) {
    var ctrl = this;
    ctrl.BUILD_DOWNLOAD_ANNOTATION = 'aerogear.org/download-mobile-artifact-url';
    ctrl.SET_BUILD_DOWNLOAD_ANNOTATION = 'aerogear.org/download-mobile-artifact';
    var buildsVersion = APIService.getPreferredVersion('builds');

    ctrl.$onChanges = function(changes) {
      var mobileBuildChanges = changes.mobileBuild && changes.mobileBuild.currentValue;

      if (mobileBuildChanges) {
        var annotations = _.get(ctrl, 'mobileBuild.metadata.annotations', {});
        ctrl.url = annotations[ctrl.BUILD_DOWNLOAD_ANNOTATION];
      }

      if (mobileBuildChanges && !ctrl.context) {
        ctrl.context = {namespace:_.get(ctrl, 'mobileBuild.metadata.namespace')};
      }

      var showPanelChanges = changes.showPanel && changes.showPanel.currentValue;
      if (showPanelChanges) {
        var downloadUrl = ctrl.mobileBuild.metadata.annotations[ctrl.BUILD_DOWNLOAD_ANNOTATION];
        if (!downloadUrl) {
          var build = angular.copy(ctrl.mobileBuild);
          build.metadata.annotations[ctrl.SET_BUILD_DOWNLOAD_ANNOTATION] = 'true';
          DataService.update(buildsVersion, build.metadata.name, build, ctrl.context);
        }
      }
    };
  }
})();