'use strict';

(function() {
  angular.module('openshiftConsole').component('mobileClientBuildHistoryItem', {
    controller: [
      MobileClientBuildHistoryItem
    ],
    bindings: {
      build: '<'
    },
    templateUrl: 'views/mobile-client-build-history-item.html'
  });

  function MobileClientBuildHistoryItem() {
    this.toggleBuildDownloadUrl = function() {
      this.buildDownloadPanelExpanded = !this.buildDownloadPanelExpanded;
    };
  }
})();