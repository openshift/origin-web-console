'use strict';

angular.module("openshiftConsole")
  .factory("PodsService", function(OwnerReferencesService) {
    return {
      getImageIDs: function(pods, containerName) {
        // Use a map so we only ever add the same SHA once.
        var imageIDs = {};
        var shaPrefixPattern = /^.*sha256:/;
        _.each(pods, function(pod) {
          var sha;
          var containerStatuses = _.get(pod, 'status.containerStatuses', []);
          var containerStatus = _.find(containerStatuses, { name: containerName });
          var id = _.get(containerStatus, 'imageID', '');
          if (shaPrefixPattern.test(id)) {
            sha = id.replace(shaPrefixPattern, '');
            imageIDs[sha] = true;
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
      },

      groupByOwnerUID: function(pods) {
        return OwnerReferencesService.groupByControllerUID(pods);
      },

      filterForOwner: function(pods, owner) {
        return OwnerReferencesService.filterForController(pods, owner);
      }
    };
  });
