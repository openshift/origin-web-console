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
      'full address:s:' + address + ':' + port +
      '\nusername:s:Administrator' +
      '\nscreen mode id:i:2' + // set 2 for full screen
      '\nprompt for credentials:i:1' +
      '\ndesktopwidth:i:0' +
      '\ndesktopheight:i:0' +
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
      '\nallow font smoothing:i:1' +
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
    KubevirtVersions,
    moment) {
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
      var os = _.get(vm, 'metadata.labels["kubevirt.io/os"]') || _.get(ovm, 'metadata.labels["kubevirt.io/os"]');
      return (os && _.startsWith(os, 'win'));
    };
    row.isRdpService = function () {
      var ovm = row.apiObject;
      return !_.isEmpty(ovm.services);
    };

    function rdpPortFinder(service) {
      return _.find(_.get(service, 'spec.ports'), function (portObj) {
        return portObj.targetPort === RDP_PORT;
      });
    }

    function getAddressPort(service, ovm) {
      var rdpPortObj = rdpPortFinder(service);
      if (!rdpPortObj) {
        return ;
      }

      var type = _.get(service, 'spec.type');
      var port = _.get(rdpPortObj, "port");
      var address;
      switch (type) {
        case 'LoadBalancer':
          var externalIPs = _.get(service, 'spec.externalIPs');
          if (_.isEmpty(externalIPs)) {
            console.warn("externalIP is not defined for the LoadBalancer RDP Service: ", service, ovm);
            return ;
          }
          address = externalIPs[0];
          break;
        case 'ClusterIP':
          var clusterIP = _.get(service, 'spec.clusterIP');
          if (_.isEmpty(clusterIP)) {
            console.warn("clusterIP is not defined for the ClusterIP RDP Service: ", service, ovm);
            return ;
          }
          address = clusterIP;
          break;
        case 'NodePort':
          // TODO: Once verified, Service's nodeIP shall be used. Until then, IP from vm-pod-node is more safe
          port = _.get(rdpPortObj, "nodePort");
          var nodeIP = _.get(ovm, '_pod.status.hostIP');
          if (_.isEmpty(nodeIP)) {
            console.warn("nodeIP (pod.status.hostIP) is not yet known, using NodePort RDP Service: ", service, ovm);
            return ;
          }
          address = nodeIP;
          break;
        default:
          console.error('Unrecognized Service type: ', service);
          return null;
      }

      console.info('RDP requested for: ', address, port, type);
      return {
        address: address,
        port: port
      };
    }

    /**
     * Requires Service object to be created:
     *   https://github.com/kubevirt/user-guide/blob/master/workloads/virtual-machines/expose-service.md
     */
    row.onOpenRemoteDesktop = function () {
      var ovm = row.apiObject;
      if (_.isEmpty(ovm.services)) {
        return ;
      }
      var service = _.find(ovm.services, rdpPortFinder); // a service which one of the ports is RDP
      var addressPort = getAddressPort(service, ovm);
      if (addressPort) {
        fileDownload(buildRdp(addressPort.address, addressPort.port));
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
