'use strict';

(function() {
  angular.module('openshiftConsole').component('mobileClientDownloadUrl', {
    controller: [
      '$filter',
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
    $filter,
    APIService,
    DataService
  ) {
    var ctrl = this;
    var annotationName = $filter('annotationName');
    var BUILD_DOWNLOAD_ANNOTATION = annotationName('mobileGetBuildDownload');
    var SET_BUILD_DOWNLOAD_ANNOTATION = annotationName('mobileSetBuildDownload');
    var buildsVersion = APIService.getPreferredVersion('builds');

    ctrl.$onChanges = function(changes) {
      var mobileBuildChanges = changes.mobileBuild && changes.mobileBuild.currentValue;
      var context = {namespace:_.get(ctrl, 'mobileBuild.metadata.namespace')};

      if (mobileBuildChanges) {
        var annotations = _.get(ctrl, 'mobileBuild.metadata.annotations', {});
        ctrl.url = annotations[BUILD_DOWNLOAD_ANNOTATION];
      }

      var showPanelChanges = changes.showPanel && changes.showPanel.currentValue;
      if (showPanelChanges) {
        var downloadUrl = ctrl.mobileBuild.metadata.annotations[BUILD_DOWNLOAD_ANNOTATION];
        if (!downloadUrl) {
          ctrl.requestBuildDownloadUrl(context);
        }
      }
    };

    ctrl.requestBuildDownloadUrl = function(context) {
      var build = angular.copy(ctrl.mobileBuild);
      build.metadata.annotations[SET_BUILD_DOWNLOAD_ANNOTATION] = 'true';
      DataService.update(buildsVersion, build.metadata.name, build, context);
    };
  }
})();
