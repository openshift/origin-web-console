"use strict";

describe("EnvironmentService", function() {
  var EnvironmentService;

  beforeEach(function() {
    inject(function(_EnvironmentService_) {
      EnvironmentService = _EnvironmentService_;
    });
  });

  var objectWithContainers = function(containers) {
    var object = {
      metadata: {
        name: 'my-object',
        kind: 'DeploymentConfig'
      },
      spec: {
        replicas: 2
      },
      status: {
        replicas: 2
      }
    };

    // Make a copy to check that the service isn't using object equality (object === object).
    containers = angular.copy(containers);
    _.set(object, 'spec.template.spec.containers', containers);

    return object;
  };

  describe("#isEnvironmentEqual", function() {
    it("should not be equal if different number of containers", function() {
      var oneContainer = objectWithContainers([{
        name: 'one',
        env: []
      }]);
      var twoContainers = objectWithContainers([{
        name: 'one',
        env: []
      }, {
        name: 'two',
        env: []
      }]);

      expect(EnvironmentService.isEnvironmentEqual(oneContainer, twoContainers)).toBe(false);
      expect(EnvironmentService.isEnvironmentEqual(twoContainers, oneContainer)).toBe(false);
    });

    it("should not be equal if a container has a different name", function() {
      var env = [{
        name: 'first',
        value: 'value'
      }, {
        name: 'another',
        value: 'variable'
      }];

      var left = objectWithContainers([{
        name: 'my-container',
        env: env
      }]);

      var right = objectWithContainers([{
        name: 'my-container-renamed',
        env: env
      }]);

      expect(EnvironmentService.isEnvironmentEqual(left, right)).toBe(false);
    });

    it("should not be equal if a container has a different variable value", function() {
      var left = objectWithContainers([{
        name: 'my-container',
        env: [{
          name: 'first',
          value: 'value'
        }, {
          name: 'another',
          value: 'variable'
        }]
      }]);

      var right = objectWithContainers([{
        name: 'my-container',
        env: [{
          name: 'first',
          value: 'value'
        }, {
          name: 'another',
          value: 'modified'
        }]
      }]);

      expect(EnvironmentService.isEnvironmentEqual(left, right)).toBe(false);
    });

    it("should not be equal if a container has a different variable name", function() {
      var left = objectWithContainers([{
        name: 'my-container',
        env: [{
          name: 'first',
          value: 'value'
        }, {
          name: 'another',
          value: 'variable'
        }]
      }]);

      var right = objectWithContainers([{
        name: 'my-container',
        env: [{
          name: 'first',
          value: 'value'
        }, {
          name: 'modified',
          value: 'variable'
        }]
      }]);

      expect(EnvironmentService.isEnvironmentEqual(left, right)).toBe(false);
    });

    it("should be equal if there are no environment variable values", function() {
      var containers = [{
        name: 'my-container'
      }];
      var left = objectWithContainers(containers);
      var right = objectWithContainers(containers);

      expect(EnvironmentService.isEnvironmentEqual(left, right)).toBe(true);
    });

    it("should be equal when the environment is the same", function() {
      var containers = [{
        name: 'my-container',
        env: [{
          name: 'first',
          value: 'value'
        }, {
          name: 'another',
          value: 'variable'
        }]
      }];
      var left = objectWithContainers(containers);
      var right = objectWithContainers(containers);

      expect(EnvironmentService.isEnvironmentEqual(left, right)).toBe(true);
    });

    it("should be equal if there are identical valueFrom values for config maps", function() {
      var containers = [{
        name: 'my-container',
        env: [{
          name: 'first',
          value: 'value'
        }, {
          name: 'another',
          valueFrom: {
            configMapKeyRef: {
              name: 'my-config',
              key: 'my.key'
            }
          }
        }]
      }];
      var left = objectWithContainers(containers);
      var right = objectWithContainers(containers);

      expect(EnvironmentService.isEnvironmentEqual(left, right)).toBe(true);
    });

    it("should not be equal if the valueFrom refers to different object names", function() {
      var left = objectWithContainers([{
        name: 'my-container',
        env: [{
          name: 'first',
          value: 'value'
        }, {
          name: 'another',
          valueFrom: {
            configMapKeyRef: {
              name: 'my-config',
              key: 'my.key'
            }
          }
        }]
      }]);

      var right = objectWithContainers([{
        name: 'my-container',
        env: [{
          name: 'first',
          value: 'value'
        }, {
          name: 'another',
          valueFrom: {
            configMapKeyRef: {
              name: 'my-config-2',
              key: 'my.key'
            }
          }
        }]
      }]);

      expect(EnvironmentService.isEnvironmentEqual(left, right)).toBe(false);
    });

    it("should not be equal if the valueFrom keys are different", function() {
      var left = objectWithContainers([{
        name: 'my-container',
        env: [{
          name: 'first',
          value: 'value'
        }, {
          name: 'another',
          valueFrom: {
            configMapKeyRef: {
              name: 'my-config',
              key: 'my.key'
            }
          }
        }]
      }]);

      var right = objectWithContainers([{
        name: 'my-container',
        env: [{
          name: 'first',
          value: 'value'
        }, {
          name: 'another',
          valueFrom: {
            configMapKeyRef: {
              name: 'my-config',
              key: 'different.key'
            }
          }
        }]
      }]);

      expect(EnvironmentService.isEnvironmentEqual(left, right)).toBe(false);
    });

    it("should be equal if there are identical valueFrom values for secrets", function() {
      var containers = [{
        name: 'my-container',
        env: [{
          name: 'first',
          value: 'value'
        }, {
          name: 'another',
          valueFrom: {
            secretKeyRef: {
              name: 'my-secret',
              key: 'my.key'
            }
          }
        }]
      }];
      var left = objectWithContainers(containers);
      var right = objectWithContainers(containers);

      expect(EnvironmentService.isEnvironmentEqual(left, right)).toBe(true);
    });
  });

  describe("#mergeEdits", function() {
    var originalContainers = [{
      name: 'my-container',
      env: [{
        name: 'FIRST',
        value: 'value'
      }, {
        name: 'ANOTHER',
        valueFrom: {
          secretKeyRef: {
            name: 'my-secret',
            key: 'my.key'
          }
        }
      }],
      envFrom: []
    }, {
      name: 'my-second-container',
      env: [{
        name: 'CONFIG',
        valueFrom: {
          configMapKeyRef: {
            name: 'my-config',
            key: 'my.key'
          }
        }
      }, {
        name: 'FOO',
        value: 'bar'
      }],
      envFrom: []
    }];

    // Change some values.
    var editedContainers = angular.copy(originalContainers);
    editedContainers[0].env[1] = {
      name: 'ANOTHER',
      value: 'modified'
    };
    editedContainers[1].env[1] = {
      name: 'FOO',
      value: 'modified'
    };

    var source = objectWithContainers(editedContainers);
    var target = objectWithContainers(originalContainers);
    _.set(target, 'metadata.annotations', {
      'my-annotation': 'my-value'
    });

    // Change a container property as well to check that we don't stomp other edits.
    target.spec.template.spec.containers[0].image = 'redis';

    it("should correctly merge edited values", function() {
      var merged = EnvironmentService.mergeEdits(source, target);
      var expected = angular.copy(target);
      expected.spec.template.spec.containers[0].env = angular.copy(source.spec.template.spec.containers[0].env);
      expected.spec.template.spec.containers[1].env = angular.copy(source.spec.template.spec.containers[1].env);
      expect(merged).toEqual(expected);
    });

    it("should create a copy of target", function() {
      var merged = EnvironmentService.mergeEdits(source, target);
      expect(merged === target).toBe(false);
    });
  });
});
