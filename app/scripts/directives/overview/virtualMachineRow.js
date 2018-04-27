'use strict';

(function () {
  angular.module('openshiftConsole').component('virtualMachineRow', {
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
      'KubevirtVersions',
      'VmActions',
      'RdpService',
      VirtualMachineRow
    ],
    controllerAs: 'row',
    bindings: {
      apiObject: '<',
      state: '<',
      vm: '<',
      vmi: '<',
      pods: '<',
      services: '<'
    },
    templateUrl: 'views/overview/_virtual-machine-row.html'
  });

  function VirtualMachineRow(
    $scope,
    $filter,
    $routeParams,
    APIService,
    AuthorizationService,
    DataService,
    ListRowUtils,
    Navigate,
    ProjectsService,
    KubevirtVersions,
    VmActions,
    RdpService) {
    var row = this;
    row.KubevirtVersions = KubevirtVersions;
    row.VmActions = VmActions;

    _.extend(row, ListRowUtils.ui);
    row.actionsDropdownVisible = function () {
      // no actions on those marked for deletion
      if (_.get(row.vm, 'metadata.deletionTimestamp')) {
        return false;
      }

      return $filter('canIDoAny')('virtualMachineInstances') || $filter('canIDoAny')('virtualMachines');
    };
    row.projectName = $routeParams.project;

    /**
     * It creates a copy of VM entity without added dash-starting properties. Used for put operations.
     */
    row.vmCopy = function() {
      var copy = angular.copy(row.vm);
      delete copy._pod;
      delete copy._vm;
      delete copy._services;
      return copy;
    }

    row.isWindowsVmi = function() {
      return RdpService.isWindowsVmi(row.vmi);
    };

    row.getRdpService = function() {
      return RdpService.findRdpService(row.services);
    };

    row.onOpenRemoteDesktop = function() {
      RdpService.openRemoteDesktop(row.vm, row.getRdpService());
    }

  }

})();
