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
      'moment',
      'RdpService',
      VirtualMachineRow
    ],
    controllerAs: 'row',
    bindings: {
      apiObject: '<',
      state: '<'
    },
    templateUrl: 'views/overview/_virtual-machine-row.html'
  });

  var RDP_PORT = 3389;

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
    moment,
    RdpService) {
    var row = this;
    row.OfflineVirtualMachineVersion = KubevirtVersions.offlineVirtualMachine;

    _.extend(row, ListRowUtils.ui);
    row.actionsDropdownVisible = function () {
      // no actions on those marked for deletion
      if (_.get(row.apiObject, 'metadata.deletionTimestamp')) {
        return false;
      }

      // We can delete offline virtual machine
      return AuthorizationService.canI(KubevirtVersions.offlineVirtualMachine, 'delete');
    };
    row.projectName = $routeParams.project;

    function createOvmCopy() {
      var copy = angular.copy(row.apiObject);
      delete copy._pod;
      delete copy._vm;
      return copy;
    }

    function setOvmRunning(running) {
      var startedOvm = createOvmCopy();
      startedOvm.spec.running = running;
      return DataService.update(
        KubevirtVersions.offlineVirtualMachine.resource,
        startedOvm.metadata.name,
        startedOvm,
        $scope.$parent.context
      );
    }

    row.isOvmRunning = function () {
      return row.apiObject.spec.running;
    };
    row.isOvmInRunningPhase = function () {
      return row.isOvmRunning() &&
        row.apiObject._vm &&
        _.get(row.apiObject, '_pod.status.phase') === 'Running';
    };
    row.startOvm = function () {
      setOvmRunning(true);
    };
    row.stopOvm = function () {
      setOvmRunning(false);
    };
    row.restartOvm = function () {
      return DataService.delete(
        KubevirtVersions.virtualMachine,
        row.apiObject._vm.metadata.name,
        $scope.$parent.context
      );
    };
    row.canStartOvm = function () {
      return !row.isOvmRunning();
    };
    row.canStopOvm = function () {
      return row.isOvmRunning();
    };
    row.canRestartOvm = function () {
      return row.isOvmInRunningPhase();
    };
    row.isWindowsVM = function () {
      // https://github.com/kubevirt/kubevirt/blob/576d232e3c181134e69719cdb2d624ac52e7eecb/docs/devel/guest-os-info.md
      var ovm = row.apiObject;
      var vm = row.apiObject._vm;
      var os = _.get(vm, ['metadata', 'labels', 'kubevirt.io/os']) || _.get(ovm, ['metadata', 'labels', 'kubevirt.io/os']);
      return (os && _.startsWith(os, 'win'));
    };
    row.isRdpService = function () {
      var ovm = row.apiObject;
      return !_.isEmpty(ovm.services);
    };

    /**
     * Requires Service object to be created:
     *   https://github.com/kubevirt/user-guide/blob/master/workloads/virtual-machines/expose-service.md
     */
    row.onOpenRemoteDesktop = function () {
      var ovm = row.apiObject;
      if (_.isEmpty(ovm.services)) {
        return ;
      }
      var service = _.find(ovm.services, function (service) {return RdpService.findRDPPort(service, RDP_PORT);}); // a service which one of the ports is RDP
      var addressPort = RdpService.getAddressPort(service, ovm, RDP_PORT);
      if (addressPort) {
        RdpService.fileDownload(RdpService.buildRdp(addressPort.address, addressPort.port));
      }
    };
  }

  angular.module('openshiftConsole').filter('vmPodUptime', function () {
    return function (pod) {
      var computeContainerStartTime = _(_.get(pod, 'status.containerStatuses'))
        .filter({ name: "compute" })
        .map('state.running.startedAt')
        .first();
      var startTime = computeContainerStartTime || _.get(pod, 'status.startTime');
      if (!startTime) {
        return '--';
      }
      return moment(startTime).fromNow(true);
    };
  });

  angular.module('openshiftConsole').directive('vmState', function () {
    function getOvmStatus(ovm) {
      var vmPhase = _.get(ovm, '_vm.status.phase');
      if (vmPhase !== undefined) {
        return vmPhase;
      }
      if (!_.get(ovm, '.spec.running')) {
        return "Not Running";
      }
      return "Unknown";
    }

    function getOvmStatusFromScope(scope) {
      return getOvmStatus(scope.ovm);
    }

    function controller ($scope) {
      function onOvmChange() {
        $scope.status = getOvmStatus($scope.ovm);
      }
      $scope.$watch(getOvmStatusFromScope, onOvmChange);
    }

    return {
      scope: {
        ovm: '<'
      },
      controller: controller,
      templateUrl: 'views/overview/_vm-status.html'
    };
  });

  angular.module('openshiftConsole').constant('KubevirtVersions', {
    offlineVirtualMachine: {
      resource: "offlinevirtualmachines",
      group: "kubevirt.io",
      version: "v1alpha1"
    },
    virtualMachine: {
      resource: "virtualmachines",
      group: "kubevirt.io",
      version: "v1alpha1"
    }
  });
})();
