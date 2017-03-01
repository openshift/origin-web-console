'use strict';

/* A WebSocket factory for kubernetesContainerTerminal */
angular.module('openshiftConsole')
.factory("ContainerWebSocket", function(API_CFG, $ws) {
  return function AuthWebSocket(url, protocols) {
    var scheme;
    if (url.indexOf("/") === 0) {
      scheme = window.location.protocol === "http:" ? "ws://" : "wss://";
      url = scheme + API_CFG.openshift.hostPort + url;
    }
    return $ws({ url: url, method: "WATCH", protocols: protocols, auth: {} });
  };
});
