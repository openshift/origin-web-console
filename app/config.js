'use strict';

(function() {
  // This is the default configuration for the dev mode of the web console.
  // A generated version of this config is created at run-time when running
  // the web console from the openshift binary.
  //
  // To change configuration for local development, copy this file to
  // app/config.local.js and edit the copy.
  var masterPublicHostname = 'localhost:8443';
  var devConsoleHostname = 'localhost:9000';
  window.OPENSHIFT_CONFIG = {
    apis: {
      hostPort: masterPublicHostname,
      prefix: "/apis"
    },
    api: {
      openshift: {
        hostPort: masterPublicHostname,
        prefix: "/oapi"
      },
      k8s: {
        hostPort: masterPublicHostname,
        prefix: "/api"
      }
    },
    auth: {
      oauth_authorize_uri: 'https://' + masterPublicHostname + "/oauth/authorize",
      oauth_token_uri: 'https://' + masterPublicHostname + "/oauth/token",
      oauth_redirect_base: "https://" + devConsoleHostname + "/dev-console",
      oauth_client_id: "openshift-web-console",
      logout_uri: ""
    },
    loggingURL: "",
    metricsURL: "",
    inactivityTimeoutMinutes: 0
  };

  window.OPENSHIFT_VERSION = {
    console: "dev-mode"
  };
})();
