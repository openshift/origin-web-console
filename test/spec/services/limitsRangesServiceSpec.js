"use strict";

describe("LimitRangesService", function() {
  var LimitRangesService, $window, OPENSHIFT_CONFIG, previousConfig;

  beforeEach(function() {
    inject(function(_LimitRangesService_) {
      LimitRangesService = _LimitRangesService_;
    });
  });

  beforeEach(function() {
    inject(function (_LimitRangesService_, _$window_) {
      LimitRangesService = _LimitRangesService_;
      $window = _$window_;
    });

    OPENSHIFT_CONFIG = $window.OPENSHIFT_CONFIG;

    // Make a copy so we can modify the config and then restore the previous values.
    previousConfig = angular.copy(OPENSHIFT_CONFIG);

    // Make sure this defaults to false for all tests regardless of what is set
    // in config.local.js.
    OPENSHIFT_CONFIG.clusterResourceOverridesEnabled = false;
  });

  afterEach(function () {
    // Restore original constants value.
    $window.OPENSHIFT_CONFIG = previousConfig;
  });

  var mockProject = {
    metadata: {
      name: 'my-project',
      annotations: {}
    }
  };

  describe("#hasClusterResourceOverrides", function() {
    it("should return false if clusterResourceOverridesEnabled is false", function() {
      expect(LimitRangesService.hasClusterResourceOverrides(mockProject)).toBe(false);
    });

    it("should return true if clusterResourceOverridesEnabled is true", function() {
      OPENSHIFT_CONFIG.clusterResourceOverridesEnabled = true;
      expect(LimitRangesService.hasClusterResourceOverrides(mockProject)).toBe(true);
    });

    it("should return false if clusterResourceOverridesEnabled is undefined", function() {
      delete OPENSHIFT_CONFIG.clusterResourceOverridesEnabled;
      expect(LimitRangesService.hasClusterResourceOverrides(mockProject)).toBe(false);
    });

    it("should return false if the project name is exempt", function() {
      OPENSHIFT_CONFIG.clusterResourceOverridesEnabled = true;
      var project = angular.copy(mockProject);
      project.metadata.name = "openshift";
      expect(LimitRangesService.hasClusterResourceOverrides(project)).toBe(false);
    });

    it("should return false if the project prefix is exempt", function() {
      OPENSHIFT_CONFIG.clusterResourceOverridesEnabled = true;
      var project = angular.copy(mockProject);
      project.metadata.name = "openshift-web-console";
      expect(LimitRangesService.hasClusterResourceOverrides(project)).toBe(false);
    });

    it("should return false if the project has the exempt annotation", function() {
      OPENSHIFT_CONFIG.clusterResourceOverridesEnabled = true;
      var project = angular.copy(mockProject);
      project.metadata.annotations['quota.openshift.io/cluster-resource-override-enabled'] = "false";
      expect(LimitRangesService.hasClusterResourceOverrides(project)).toBe(false);
    });
  });

  describe("#validatePodLimits", function() {
    var mockLimitRanges = [{
      metadata: {
        name: 'resource-limits',
        namespace: 'limits',
        selfLink: '/api/v1/namespaces/limits/limitranges/resource-limits',
        uid: '423bc6ef-faf8-11e7-94c1-025000000001',
        resourceVersion: '18632',
        creationTimestamp: '2018-01-16T20:03:02Z'
      },
      spec: {
        limits: [
          {
            type: 'Pod',
            max: {
              cpu: '2',
              memory: '1Gi'
            },
            min: {
              cpu: '19m',
              memory: '100Mi'
            }
          },
          {
            type: 'Container',
            max: {
              cpu: '2',
              memory: '1Gi'
            },
            min: {
              cpu: '19m',
              memory: '100Mi'
            },
            'default': {
              cpu: '1',
              memory: '512Mi'
            },
            defaultRequest: {
              cpu: '50m',
              memory: '256Mi'
            }
          },
          {
            type: 'PersistentVolumeClaim',
            max: {
              storage: '1Gi'
            },
            min: {
              storage: '1Gi'
            }
          }
        ]
      }
    }];

    var memoryTooLow = {
      memory: '50Mi'
    };

    var memoryTooHigh = {
      memory: '2Gi'
    };

    var cpuTooLow = {
      cpu: '10m'
    };

    var cpuTooHigh = {
      cpu: '3'
    };

    var mockContainersWithResources = function(resources) {
      return [{
        name: 'my-container',
        resources: resources
      }];
    };

    var mockContainersWithRequests = function(requests) {
      return mockContainersWithResources({
        requests: requests
      });
    };

    var mockContainersWithLimits = function(limits) {
      return mockContainersWithResources({
        limits: limits
      });
    };

    it("should respect limit range defaults", function() {
      var containers = [{
        name: 'my-container'
      }];

      var cpuProblems = LimitRangesService.validatePodLimits(mockLimitRanges, 'cpu', containers, mockProject);
      expect(cpuProblems.length).toBe(0);

      var memoryProblems = LimitRangesService.validatePodLimits(mockLimitRanges, 'memory', containers, mockProject);
      expect(memoryProblems.length).toBe(0);
    });

    it("should report problems when memory request is too low", function() {
      var containers = mockContainersWithRequests(memoryTooLow);
      var memoryProblems = LimitRangesService.validatePodLimits(mockLimitRanges, 'memory', containers, mockProject);
      expect(memoryProblems.length).toBeGreaterThan(0);
    });

    it("should report problems when memory request is too high", function() {
      var containers = mockContainersWithRequests(memoryTooHigh);
      var memoryProblems = LimitRangesService.validatePodLimits(mockLimitRanges, 'memory', containers, mockProject);
      expect(memoryProblems.length).toBeGreaterThan(0);
    });

    it("should report problems when memory limit is too low", function() {
      var containers = mockContainersWithLimits(memoryTooLow);
      var memoryProblems = LimitRangesService.validatePodLimits(mockLimitRanges, 'memory', containers, mockProject);
      expect(memoryProblems.length).toBeGreaterThan(0);
    });

    it("should report problems when memory limit is too high", function() {
      var containers = mockContainersWithLimits(memoryTooHigh);
      var memoryProblems = LimitRangesService.validatePodLimits(mockLimitRanges, 'memory', containers, mockProject);
      expect(memoryProblems.length).toBeGreaterThan(0);
    });

    it("should report problems when cpu request is too low", function() {
      var containers = mockContainersWithRequests(cpuTooLow);
      var cpuProblems = LimitRangesService.validatePodLimits(mockLimitRanges, 'cpu', containers, mockProject);
      expect(cpuProblems.length).toBeGreaterThan(0);
    });

    it("should report problems when cpu request is too high", function() {
      var containers = mockContainersWithRequests(cpuTooHigh);
      var cpuProblems = LimitRangesService.validatePodLimits(mockLimitRanges, 'cpu', containers, mockProject);
      expect(cpuProblems.length).toBeGreaterThan(0);
    });

    it("should report problems when cpu limit is too low", function() {
      var containers = mockContainersWithLimits(cpuTooLow);
      var cpuProblems = LimitRangesService.validatePodLimits(mockLimitRanges, 'cpu', containers, mockProject);
      expect(cpuProblems.length).toBeGreaterThan(0);
    });

    it("should report problems when cpu limit is too high", function() {
      var containers = mockContainersWithLimits(cpuTooHigh);
      var cpuProblems = LimitRangesService.validatePodLimits(mockLimitRanges, 'cpu', containers, mockProject);
      expect(cpuProblems.length).toBeGreaterThan(0);
    });

    it("should ignore cpu limit problems when cluster resource overrides are enabled", function() {
      OPENSHIFT_CONFIG.clusterResourceOverridesEnabled = true;
      var containers, cpuProblems;

      containers = mockContainersWithLimits(cpuTooHigh);
      cpuProblems = LimitRangesService.validatePodLimits(mockLimitRanges, 'cpu', containers, mockProject);
      expect(cpuProblems.length).toBe(0);

      containers = mockContainersWithLimits(cpuTooLow);
      cpuProblems = LimitRangesService.validatePodLimits(mockLimitRanges, 'cpu', containers, mockProject);
      expect(cpuProblems.length).toBe(0);
    });

    it("should ignore cpu request problems when cluster resource overrides are enabled", function() {
      OPENSHIFT_CONFIG.clusterResourceOverridesEnabled = true;
      var containers, cpuProblems;

      containers = mockContainersWithRequests(cpuTooLow);
      cpuProblems = LimitRangesService.validatePodLimits(mockLimitRanges, 'cpu', containers, mockProject);
      expect(cpuProblems.length).toBe(0);

      containers = mockContainersWithRequests(cpuTooHigh);
      cpuProblems = LimitRangesService.validatePodLimits(mockLimitRanges, 'cpu', containers, mockProject);
      expect(cpuProblems.length).toBe(0);
    });

    it("should ignore cpu limit problems when cluster resource overrides are enabled", function() {
      OPENSHIFT_CONFIG.clusterResourceOverridesEnabled = true;
      var containers, cpuProblems;

      containers = mockContainersWithLimits(cpuTooLow);
      cpuProblems = LimitRangesService.validatePodLimits(mockLimitRanges, 'cpu', containers, mockProject);
      expect(cpuProblems.length).toBe(0);

      containers = mockContainersWithLimits(cpuTooHigh);
      cpuProblems = LimitRangesService.validatePodLimits(mockLimitRanges, 'cpu', containers, mockProject);
      expect(cpuProblems.length).toBe(0);
    });

    it("should ignore memory request problems when cluster resource overrides are enabled", function() {
      OPENSHIFT_CONFIG.clusterResourceOverridesEnabled = true;
      var containers, memoryProblems;

      containers = mockContainersWithRequests(memoryTooLow);
      memoryProblems = LimitRangesService.validatePodLimits(mockLimitRanges, 'memory', containers, mockProject);
      expect(memoryProblems.length).toBe(0);

      containers = mockContainersWithRequests(memoryTooHigh);
      memoryProblems = LimitRangesService.validatePodLimits(mockLimitRanges, 'memory', containers, mockProject);
      expect(memoryProblems.length).toBe(0);
    });

    it("should NOT ignore memory limit problems when cluster resource overrides are enabled", function() {
      OPENSHIFT_CONFIG.clusterResourceOverridesEnabled = true;
      var containers, memoryProblems;

      containers = mockContainersWithLimits(memoryTooLow);
      memoryProblems = LimitRangesService.validatePodLimits(mockLimitRanges, 'memory', containers, mockProject);
      expect(memoryProblems.length).toBeGreaterThan(0);

      containers = mockContainersWithLimits(memoryTooHigh);
      memoryProblems = LimitRangesService.validatePodLimits(mockLimitRanges, 'memory', containers, mockProject);
      expect(memoryProblems.length).toBeGreaterThan(0);
    });
  });
});
