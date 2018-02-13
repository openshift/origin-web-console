'use strict';

/**
 * @ngdoc function
 * @name openshiftConsole.controller:AboutController
 * @description
 * Controller of the openshiftConsole
 */
angular.module('openshiftConsole')
  .controller('AboutController',
              function($scope,
                       $q,
                       AuthService,
                       Constants,
                       DataService) {
    AuthService.withUser();

    $scope.version = {
      master: {},
      console: Constants.VERSION.console || 'unknown'
    };

    var masterVersion = $scope.version.master;
    var requests = [];

    // Request the latest versions from the server. The version in constants
    // might be stale since it's only requested at startup.
    requests.push(DataService.getKubernetesMasterVersion().then(function(version) {
      masterVersion.kubernetes = version.data.gitVersion;
    }));

    requests.push(DataService.getOpenShiftMasterVersion().then(function(version) {
      masterVersion.openshift = version.data.gitVersion;
    }));

    $q.all(requests).finally(function() {
      // Fall back to the versions in Constants if we could not get the version
      // from the server. Set the value to 'unknown' only after the requests
      // have completed to avoid it flickering on page load.
      masterVersion.kubernetes = masterVersion.kubernetes || 'unknown';
      masterVersion.openshift = masterVersion.openshift || 'unknown';
    });
  });
