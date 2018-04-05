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

  var RDP_PORT = 3389;

  function fileDownload(data, fileName, mimeType) {
    fileName = fileName || "vm.rdp";
    mimeType = mimeType || "application/rdp";

    var a = document.createElement('a');
    if (navigator.msSaveBlob) { // IE10
      return navigator.msSaveBlob(new Blob([data], { type: mimeType }), fileName);
    } else if ('download' in a) { // html5 A[download]
      a.href = 'data:' + mimeType + ',' + encodeURIComponent(data);
      a.setAttribute('download', fileName);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      return true;
    } else { // do iframe dataURL download (old ch+FF):
      var f = document.createElement('iframe');
      document.body.appendChild(f);
      f.src = 'data:' + mimeType + ',' + encodeURIComponent(data);
      setTimeout(function () {
        document.body.removeChild(f);
      }, 333);
      return true;
    }
  }

  function buildRdp(address, port) {
    return '' +
      'full address:s:' + address +
      '\nserver port:i: ' + port +
      '\ndesktopwidth:i:1024' +
      '\ndesktopheight:i:768' +
      '\nscreen mode id:i:1' + // set 2 for full screen
      '\nauthentication level:i:2' +
      '\nredirectclipboard:i:1' +
      '\nsession bpp:i:32' +
      '\ncompression:i:1' +
      '\nkeyboardhook:i:2' +
      '\naudiocapturemode:i:0' +
      '\nvideoplaybackmode:i:1' +
      '\nconnection type:i:2' +
      '\ndisplayconnectionbar:i:1' +
      '\ndisable wallpaper:i:1' +
      '\nallow font smoothing:i:0' +
      '\nallow desktop composition:i:0' +
      '\ndisable full window drag:i:1' +
      '\ndisable menu anims:i:1' +
      '\ndisable themes:i:0' +
      '\ndisable cursor setting:i:0' +
      '\nbitmapcachepersistenable:i:1' +
      '\naudiomode:i:0' +
      '\nredirectcomports:i:0' +
      '\nredirectposdevices:i:0' +
      '\nredirectdirectx:i:1' +
      '\nautoreconnection enabled:i:1' +
      '\nprompt for credentials:i:1' +
      '\nnegotiate security layer:i:1' +
      '\nremoteapplicationmode:i:0' +
      '\nalternate shell:s:' +
      '\nshell working directory:s:' +
      '\ngatewayhostname:s:' +
      '\ngatewayusagemethod:i:4' +
      '\ngatewaycredentialssource:i:4' +
      '\ngatewayprofileusagemethod:i:0' +
      '\npromptcredentialonce:i:1' +
      '\nuse redirection server name:i:0' +
      '\n';
  }

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
      return row.isOvmRunning() &&
        row.apiObject._vm &&
        _.get(row.apiObject, '_pod.status.phase') === 'Running';
    };
    row.isWindowsVM = function () {
      var ovm = row.apiObject;
      var os = _.get(ovm, 'metadata.labels["kubevirt.io/os"]');
      return (os && _.startsWith(os, 'win'));
    };
    row.isRdpService = function () {
      var ovm = row.apiObject;
      return !_.isEmpty(ovm.services);
    };

    row.onOpenRemoteDesktop = function () {
      var ovm = row.apiObject;
      if (_.isEmpty(ovm.services)) {// https://github.com/kubevirt/user-guide/blob/master/service.md
        return ;
      }
      var rdpPortFinder = function (service) {
        return _.find(_.get(service, 'spec.ports'), function (portObj) {
          return portObj.targetPort === RDP_PORT;
        });

      };
      var service = _.find(ovm.services, rdpPortFinder);
      var rdpPortObj = rdpPortFinder(service);
      var port = _.get(rdpPortObj, "port");

      if (!port) {
        console.warn("Port is not defined: ", rdpPortObj, ovm);
        return ;
      }
      var externalIPs = _.get(service, 'spec.externalIPs');
      if (_.isEmpty(externalIPs)) {
        console.warn("externalIP is not defined for the RDP Service: ", service, ovm);
        return ;
      }

      var externalIP = externalIPs[0];
      fileDownload(buildRdp(externalIP, port));
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

    function controller ($scope) {
      function onOvmChange() {
        $scope.status = getOvmStatus($scope.ovm);
      }
      $scope.$watch('ovm', onOvmChange);
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
