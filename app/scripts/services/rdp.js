'use strict';

angular.module("openshiftConsole")
  .factory("RdpService", function(Logger) {
    function findRDPPort (service, rdpPortNumber) {
      var servicePorts = _.get(service, 'spec.ports');
      return _.find(servicePorts, {targetPort: rdpPortNumber});
    }

    return {
      buildRdp: function (address, port) {
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
      },

      fileDownload: function (data, fileName, mimeType) {
        fileName = fileName || "vm.rdp";
        mimeType = mimeType || "application/rdp";

        var blob = new Blob([data], { type: mimeType });
        saveAs(blob, fileName);
      },

      findRDPPort: findRDPPort,

      getAddressPort: function (service, ovm, rdpPortNumber) {
        var rdpPortObj = findRDPPort(service, rdpPortNumber);
        if (!rdpPortObj) {
          return null;
        }

        var type = _.get(service, 'spec.type');
        var port = _.get(rdpPortObj, "port");
        var address;
        switch (type) {
          case 'LoadBalancer':
            address = _.get(service, 'spec.externalIPs[0]');
            if (!address) {
              Logger.warn("External IP is not defined for the LoadBalancer RDP Service: ", service, ovm);
              return null;
            }
            break;
          case 'ClusterIP':
            address = _.get(service, 'spec.clusterIP');
            if (!address) {
              Logger.warn("Cluster IP is not defined for the ClusterIP RDP Service: ", service, ovm);
              return null;
            }
            break;
          case 'NodePort':
            // TODO: Once verified, Service's nodeIP shall be used. Until then, IP from vm-pod-node is more safe
            address = _.get(ovm, '_pod.status.hostIP');
            if (!address) {
              Logger.warn("Node IP (pod.status.hostIP) is not yet known, using NodePort RDP Service: ", service, ovm);
              return null;
            }
            break;
          default:
            console.error('Unrecognized Service type: ', service);
            return null;
        }

        Logger.info('RDP requested for: ', address, port, type);
        return {
          address: address,
          port: port
        };
      }

  };
  });
