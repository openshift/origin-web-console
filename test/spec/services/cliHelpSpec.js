"use strict";

describe("CLIHelp", function() {
  var CLIHelp;

  beforeEach(function() {
    inject(function(_CLIHelp_) {
      CLIHelp = _CLIHelp_;
    });
  });

  describe("#getLogsCommand", function() {
    var testPod = {
      apiVersion: "v1",
      kind: "Pod",
      metadata: {
        name: "lonely-pod",
        namespace: "my-project",
      },
      spec: {
        containers: [
          {
            name: "hello-openshift",
            image: "openshift/hello-openshift",
            ports: [
              {
                containerPort: 8080,
                protocol: "TCP"
              }
            ],
            resources: {},
          }
        ],
      },
      status: {}
    };

    var testDC = {
      apiVersion: "v1",
      kind: "DeploymentConfig",
      metadata: {
        name: "my-deployment-config",
        namespace: "my-project"
      },
      // spec and status aren't used by CLIHelp
      spec: {},
      status: {}
    };

    var testRC = {
      apiVersion: "v1",
      kind: "ReplicationController",
      metadata: {
        name: "my-deployment-config-3",
        namespace: "my-project",
        annotations: {
          "openshift.io/deployment-config.name": "my-deployment-config",
          "openshift.io/deployment-config.latest-version": 3
        }
      },
      // spec and status aren't used by CLIHelp
      spec: {},
      status: {}
    };

    var vanillaRC = {
      apiVersion: "v1",
      kind: "ReplicationController",
      metadata: {
        name: "my-replication-controller",
        namespace: "my-project",
      },
      // spec and status aren't used by CLIHelp
      spec: {},
      status: {}
    };

    var testBC = {
      apiVersion: "v1",
      kind: "BuildConfig",
      metadata: {
        name: "my-build",
        namespace: "my-project"
      },
      // spec and status aren't used by CLIHelp
      spec: {},
      status: {}
    };

    var testBuild = {
      apiVersion: "v1",
      kind: "Build",
      metadata: {
        name: "my-build-3",
        namespace: "my-project",
        annotations: {
          "openshift.io/build-config.name": "my-build",
          "openshift.io/build.number": 3
        }
      },
      // spec and status aren't used by CLIHelp
      spec: {},
      status: {}
    };

    it("should get the logs command for a pod", function() {
      var command = CLIHelp.getLogsCommand(testPod);
      expect(command).toEqual('oc logs lonely-pod -n my-project');
    });

    it("should get the logs command for a pod given a container name", function() {
      var command = CLIHelp.getLogsCommand(testPod, 'hello-openshift');
      expect(command).toEqual('oc logs lonely-pod -c hello-openshift -n my-project');
    });

    it("should get the logs command for a deployment config", function() {
      var command = CLIHelp.getLogsCommand(testDC);
      expect(command).toEqual('oc logs dc/my-deployment-config -n my-project');
    });

    it("should get the logs command for a replication controller owned by a deployment config", function() {
      var command = CLIHelp.getLogsCommand(testRC);
      expect(command).toEqual('oc logs --version 3 dc/my-deployment-config -n my-project');
    });

    it("should get the logs command for a replication controller NOT owned by a deployment config", function() {
      var command = CLIHelp.getLogsCommand(vanillaRC);
      expect(command).toEqual('oc logs rc/my-replication-controller -n my-project');
    });

    it("should get the logs command for a build config", function() {
      var command = CLIHelp.getLogsCommand(testBC);
      expect(command).toEqual('oc logs bc/my-build -n my-project');
    });

    it("should get the logs command for a build", function() {
      var command = CLIHelp.getLogsCommand(testBuild);
      expect(command).toEqual('oc logs --version 3 bc/my-build -n my-project');
    });

    it("should return null when object is null", function() {
      var command = CLIHelp.getLogsCommand();
      expect(command).toBeNull();
    });

    it("should return null for other kinds", function() {
      var command = CLIHelp.getLogsCommand({
        apiVersion: 'v1',
        kind: 'UnknownKind',
        metadata: {
          name: 'unknown-object',
          namespace: 'my-project'
        }
      });
      expect(command).toBeNull();
    });
  });
});
