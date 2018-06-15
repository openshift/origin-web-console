'use strict';

(function() {
  angular.module('openshiftConsole').component('mobileClientBuildsRow', {
    controller: [
      '$location',
      'APIService',
      'BuildsService',
      'DataService',
      'ListRowUtils',
      'Navigate',
      MobileClientBuildsRow
    ],
    controllerAs: 'row',
    bindings: {
      apiObject: '<'
    },
    templateUrl: 'views/mobile-client-builds-row.html'
  });

  function MobileClientBuildsRow(
    $location,
    APIService,
    BuildsService,
    DataService,
    ListRowUtils,
    Navigate
  ) {
    var row = this;
    row.state = {};
    row.buildConfigsInstantiateVersion = APIService.getPreferredVersion('buildconfigs/instantiate');
    row.buildConfigsVersion = APIService.getPreferredVersion('buildconfigs');
    var buildsVersion = APIService.getPreferredVersion('builds');
    var watches = [];
    var anchor;

    _.extend(row, ListRowUtils.ui);

    row.$onChanges = function(changes) {
      var buildConfigChanged = _.get(changes, 'apiObject.currentValue', false);

      if (buildConfigChanged && !row.context) {
        row.context = {namespace:_.get(row, 'apiObject.metadata.namespace')};
      }

      if (buildConfigChanged && row.context && !row.watchSet) {
        row.watchSet = true;
        watches.push(DataService.watch(buildsVersion, row.context, function(buildData) {
          var builds = _.filter(buildData.by('metadata.name'), function(build) {
            return _.get(build, 'metadata.labels.buildconfig') === _.get(row, 'apiObject.metadata.name');
          });
          var sortedBuilds = BuildsService.sortBuilds(builds, true);
          row.latestBuild = _.head(sortedBuilds);
          row.historyBuilds = _.tail(sortedBuilds);
          row.toggleExpandForAnchor();
        }));
      }
    };

    row.isMatchingAnchor = function() {
      var buildId = _.get(row, 'apiObject.metadata.name');
      return $location.hash() && $location.hash() !== anchor && buildId === $location.hash();
    };

    row.toggleExpandForAnchor = function() {
      if (row.isMatchingAnchor()) {
        anchor = $location.hash();
        row.expanded = 'true';
        var key = 'overview/expand/' + _.get(row, 'apiObject.metadata.uid');
        sessionStorage.setItem(key, row.expanded);
      }
    };

    row.startBuild = function() {
      BuildsService.startBuild(row.apiObject);
    };

    row.deleteBuildConfig = function() {
      BuildsService.deleteBuild(row.apiObject);
    };

    row.navigateToBuildConfig = function() {
      var resource = _.get(row, 'apiObject.metadata.name');
      var kind = _.get(row, 'apiObject.kind');
      var namespace = _.get(row, 'apiObject.metadata.namespace');      
      return Navigate.resourceURL(resource, kind, namespace);
    };

    row.toggleBuildHistory = function() {
      row.historyExpanded = !row.historyExpanded;
    };

    row.toggleLatestDownloadUrl = function() {
      row.latestDownloadPanelExpanded = !row.latestDownloadPanelExpanded;
    };

    row.$onDestroy = function() {
      DataService.unwatchAll(watches);
    };
  }
})();
