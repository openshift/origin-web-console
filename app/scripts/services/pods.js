'use strict';

angular.module("openshiftConsole")
  .factory("PodsService", function() {
    return {
      getImageIDs: function(pods, containerName) {
        var imageIDs = {};
        _.each(pods, function(pod) {
          var id;
          var containerStatuses = _.get(pod, 'status.containerStatuses', []);
          var containerStatus = _.find(containerStatuses, { name: containerName });
          if (containerStatus && containerStatus.imageID) {
            // Strip the SHA prefix if present. Example imageID:
            //   docker://sha256:eb96a0f8f2d3e0c2447e45b6b309f9e5d436ccc8eac2817a5ccc9fa022c4ce85
            id = containerStatus.imageID.replace(/^docker:\/\/sha256:/, '');
            imageIDs[id] = true;
          }
        });

        return _.keys(imageIDs);
      },

      // Generates a copy of pod for debugging crash loops.
      generateDebugPod: function(pod, containerName) {
        // Copy the pod and make some changes for debugging.
        var debugPod = angular.copy(pod);
        var container = _.find(debugPod.spec.containers, { name: containerName });
        if (!container) {
          return null;
        }

        // Use the same metadata as `oc debug`.
        debugPod.metadata = {
          name: pod.metadata.name + "-debug",
          annotations: {
            "debug.openshift.io/source-container": containerName,
            "debug.openshift.io/source-resource": "pods/" + pod.metadata.name
          },
          labels: {}
        };

        // Never restart.
        debugPod.spec.restartPolicy = "Never";
        delete debugPod.spec.host;
        delete debugPod.spec.nodeName;
        debugPod.status = {};
        delete container.readinessProbe;
        delete container.livenessProbe;

        // Prevent container from stopping immediately.
        container.command = ['sleep'];
        // Sleep for one hour. This will cause the container to stop after one
        // hour if for some reason the pod is not deleted.
        container.args = ['' + (60 * 60)];
        debugPod.spec.containers = [container];

        return debugPod;
      }
    };
  });
