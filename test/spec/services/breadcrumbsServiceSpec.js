"use strict";

describe("BreadcrumbsService", function() {
  var BreadcrumbsService;

  beforeEach(function() {
    inject(function(_BreadcrumbsService_) {
      BreadcrumbsService = _BreadcrumbsService_;
    });
  });

  describe("#getBreadcrumbs", function() {
    var projectWithDisplayName = {
      apiVersion: "v1",
      kind: "Project",
      metadata: {
        name: "my-project",
        annotations: {
          "openshift.io/display-name": "My Project"
        }
      },
      spec: {},
      status: {}
    };

    var testDC = {
      apiVersion: "v1",
      kind: "DeploymentConfig",
      metadata: {
        name: "my-deployment-config",
        namespace: "my-project"
      },
      // spec and status aren't used by BreadcrumbsService
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
      // spec and status aren't used by BreadcrumbsService
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
      // spec and status aren't used by BreadcrumbsService
      spec: {},
      status: {}
    };

    var vanillaRS = {
      apiVersion: "extensions/v1beta1",
      kind: "ReplicaSet",
      metadata: {
        name: "my-replica-set",
        namespace: "my-project",
      },
      // spec and status aren't used by BreadcrumbsService
      spec: {},
      status: {}
    };

    var testDeployment = {
      apiVersion: "extensions/v1beta1",
      kind: "Deployment",
      metadata: {
        name: "my-deployment",
        namespace: "my-project"
      },
      // spec and status aren't used by BreadcrumbsService
      spec: {},
      status: {}
    };

    it("should generate breadcrumbs for a deployment config", function() {
      var breadcrumbs = BreadcrumbsService.getBreadcrumbs({
        name: "my-deployment-config",
        kind: "DeploymentConfig",
        namespace: "my-project"
      });
      expect(breadcrumbs).toEqual([{
        title: "Deployments",
        link: "project/my-project/browse/deployments"
      }, {
        title: "my-deployment-config"
      }]);
    });

    it("should generate breadcrumbs for a deployment config object", function() {
      var breadcrumbs = BreadcrumbsService.getBreadcrumbs({
        object: testDC
      });

      expect(breadcrumbs).toEqual([{
        title: "Deployments",
        link: "project/my-project/browse/deployments"
      }, {
        title: "my-deployment-config"
      }]);
    });

    it("should generate breadcrumbs for a deployment config object subpage", function() {
      var breadcrumbs = BreadcrumbsService.getBreadcrumbs({
        object: testDC,
        subpage: "Edit Health Checks",
        includeProject: true
      });

      expect(breadcrumbs).toEqual([{
        title: "my-project",
        link: "project/my-project/overview"
      }, {
        title: "Deployments",
        link: "project/my-project/browse/deployments"
      }, {
        title: "my-deployment-config",
        link: "project/my-project/browse/dc/my-deployment-config"
      }, {
        title: "Edit Health Checks"
      }]);
    });

    it("should generate breadcrumbs for a replication controller", function() {
      var breadcrumbs = BreadcrumbsService.getBreadcrumbs({
        name: "my-replication-controller",
        kind: "ReplicationController",
        namespace: "my-project"
      });

      expect(breadcrumbs).toEqual([{
        title: "Replication Controllers",
        link: "project/my-project/browse/deployments"
      }, {
        title: "my-replication-controller"
      }]);
    });

    it("should generate breadcrumbs in a project with a display name", function() {
      var breadcrumbs = BreadcrumbsService.getBreadcrumbs({
        name: "my-replication-controller",
        kind: "ReplicationController",
        namespace: "my-project",
        subpage: "Edit Health Checks",
        project: projectWithDisplayName,
        includeProject: true
      });

      expect(breadcrumbs).toEqual([{
        title: "My Project",
        link: "project/my-project/overview"
      }, {
        title: "Replication Controllers",
        link: "project/my-project/browse/deployments"
      }, {
        title: "my-replication-controller",
        link: "project/my-project/browse/rc/my-replication-controller"
      }, {
        title: "Edit Health Checks"
      }]);
    });

    it("should generate breadcrumbs for a replication controller object that has a deployment config", function() {
      var breadcrumbs = BreadcrumbsService.getBreadcrumbs({
        object: testRC
      });

      expect(breadcrumbs).toEqual([{
        title: "Deployments",
        link: "project/my-project/browse/deployments"
      }, {
        title: "my-deployment-config",
        link: "project/my-project/browse/dc/my-deployment-config"
      }, {
        title: "#3"
      }]);
    });

    it("should generate breadcrumbs for a vanilla replication controller object", function() {
      var breadcrumbs = BreadcrumbsService.getBreadcrumbs({
        object: vanillaRC
      });

      expect(breadcrumbs).toEqual([{
        title: "Replication Controllers",
        link: "project/my-project/browse/deployments"
      }, {
        title: "my-replication-controller"
      }]);
    });

    it("should generate breadcrumbs for a deployment object", function() {
      var breadcrumbs = BreadcrumbsService.getBreadcrumbs({
        object: testDeployment
      });

      expect(breadcrumbs).toEqual([{
        title: "Deployments",
        link: "project/my-project/browse/deployments"
      }, {
        title: "my-deployment"
      }]);
    });

    it("should generate breadcrumbs for a deployment subpage", function() {
      var breadcrumbs = BreadcrumbsService.getBreadcrumbs({
        object: testDeployment,
        subpage: "Edit Health Checks"
      });

      expect(breadcrumbs).toEqual([{
        title: "Deployments",
        link: "project/my-project/browse/deployments"
      }, {
        title: "my-deployment",
        link: "project/my-project/browse/deployment/my-deployment"
      }, {
        title: "Edit Health Checks"
      }]);
    });

    it("should generate breadcrumbs for a vanilla replica set object", function() {
      var breadcrumbs = BreadcrumbsService.getBreadcrumbs({
        object: vanillaRS
      });

      expect(breadcrumbs).toEqual([{
        title: "Replica Sets",
        link: "project/my-project/browse/deployments"
      }, {
        title: "my-replica-set"
      }]);
    });
  });
});
