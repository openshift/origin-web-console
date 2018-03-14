'use strict';

(function () {
  angular.module('openshiftConsole').component('mobileClientRow', {
    controller: [
      '$scope',
      '$filter',
      '$routeParams',
      'APIService',
      'AuthorizationService',
      'DataService',
      'ListRowUtils',
      'Navigate',
      'ProjectsService',
      MobileAppRow,
    ],
    controllerAs: 'row',
    bindings: {
      apiObject: '<',
      state: '<'
    },
    templateUrl: 'views/overview/_mobile-client-row.html'
  });

  function MobileAppRow($scope, $filter, $routeParams, APIService, AuthorizationService, DataService, ListRowUtils, Navigate, ProjectsService) {
    var row = this;
    row.installType = '';

    _.extend(row, ListRowUtils.ui);

    row.$onChanges = function(changes) {
      if (changes.apiObject) {
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
      Navigate.toProjectCatalog(row.projectName);
    };
  }
})();
