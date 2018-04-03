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
      VirtualMachineRow
    ],
    controllerAs: 'row',
    bindings: {
      apiObject: '<',
      state: '<'
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
    KubevirtVersions) {
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

    function isOvmRunning() {
      return row.apiObject.spec.running;
    }

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
      return !isOvmRunning();
    };
    row.canStopOvm = function () {
      return isOvmRunning();
    };
    row.canRestartOvm = function () {
      return isOvmRunning()
        && row.apiObject._vm
        && _.get(row.apiObject, '_pod.status.phase') === 'Running';
    };
  }

  angular.module('openshiftConsole').directive('vmState', function () {
    function getOvmStatus(ovm) {
      var vmPhase = _.get(ovm, '_vm.status.phase');
      if (vmPhase !== undefined) {
        return vmPhase;
      }
      if (!_.get(ovm, '.spec.running')) {
        return "Off";
      }
      return "Unknown";
    }

    function controller ($scope, $element, $attrs) {
      function onOvmChange() {
        $scope.status = getOvmStatus($scope.ovm);
      }
      $scope.$watch('ovm', onOvmChange);
      console.log('ovm', $scope.ovm);
    }

    return {
      scope: {
        ovm: '<'
      },
      controller: controller,
      templateUrl: 'views/overview/_vm-status.html'
    }
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
