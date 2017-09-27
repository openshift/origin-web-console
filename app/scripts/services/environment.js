'use strict';

angular.module("openshiftConsole")
  .factory("EnvironmentService",
           function($filter,
                    keyValueEditorUtils) {
    var getContainers = function(apiObject) {
      if (apiObject.kind === 'Pod') {
        return _.get(apiObject, 'spec.containers', []);
      }
      return _.get(apiObject, 'spec.template.spec.containers', []);
    };

    return {
      getContainers: getContainers,

      // Make sure there is an `env` property for each container and add in alt
      // text for any value from entries.
      // Note: This modifies object. It should only be called on a copy.
      normalize: function(object) {
        var containers = getContainers(object);
        _.each(containers, function(container) {
          container.env = container.env || [];
          container.envFrom = container.envFrom || [];
        });
      },

      // Call `keyValueEditorUtils.compactEntries` on the env for each container.
      // Note: This modifies object. It should only be called on a copy.
      compact: function(object) {
        var containers = getContainers(object);
        _.each(containers, function(container) {
          container.env = keyValueEditorUtils.compactEntries(container.env);
        });
      },

      // Copy and normalize the environment for editing using the key value editor.
      // Convenience method since these operations are usually done together.
      copyAndNormalize: function(object) {
        var copy = angular.copy(object);
        this.normalize(copy);
        return copy;
      },

      // Compare the current and previous versions of an object to see if any
      // of the environment variables have changed.
      isEnvironmentEqual: function(left, right) {
        var leftContainers = getContainers(left);
        var rightContainers = getContainers(right);
        if (leftContainers.length !== rightContainers.length) {
          return false;
        }

        var i, leftEnv, rightEnv, leftEnvFrom, rightEnvFrom;
        for (i = 0; i < leftContainers.length; i++) {
          // If a container name has changed, consider it a conflict.
          if (leftContainers[i].name !== rightContainers[i].name) {
            return false;
          }

          // Check if any of the variable names or values are different.
          leftEnv = leftContainers[i].env || [];
          rightEnv = rightContainers[i].env || [];

          leftEnvFrom = leftContainers[i].envFrom || [];
          rightEnvFrom = rightContainers[i].envFrom || [];

          if (!_.isEqual(leftEnv, rightEnv) || !_.isEqual(leftEnvFrom, rightEnvFrom)) {
            return false;
          }
        }

        return true;
      },

      // Returns a copy of `target` with any environment variable edits from
      // `source`. Assumes `source` and `target` have the same containers in
      // their pod templates.
      mergeEdits: function(source, target) {
        var i;
        var copy = angular.copy(target);
        var sourceContainers = getContainers(source);
        var targetContainers = getContainers(copy);
        for (i = 0; i < targetContainers.length; i++) {
          targetContainers[i].env = _.get(sourceContainers, [i, 'env'], []);
          targetContainers[i].envFrom = _.get(sourceContainers, [i, 'envFrom'], []);
        }

        return copy;
      }
    };
  });
