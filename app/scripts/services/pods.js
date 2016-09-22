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
      },

      groupByReplicationController: function(pods, replicationControllers) {
        var podsByRC = {};
        _.each(pods, function(pod) {
          var rc = _.find(replicationControllers, function(rc) {
            var rcSelector = new LabelSelector(rc.spec.selector);
            return rcSelector.matches(pod);
          });

          var rcName = _.get(rc, 'metadata.name', '');
          _.set(podsByRC, [rcName, pod.metadata.name], pod);
        });

        return podsByRC;
      },

      // includeFn is an optional filter to only include certain pods in the map
      // common use case is to hide infrastructure pods like build and deployer
      groupByService: function(pods, services, includeFn) {
        var podsBySvc = {};
        _.each(pods, function(pod) {
          if (includeFn && !includeFn(pod)) {
            return;
          }
          var svc = _.find(services, function(svc) {
            var svcSelector = new LabelSelector(svc.spec.selector);
            return svcSelector.matches(pod);
          });

          var svcName = _.get(svc, 'metadata.name', '');
          _.set(podsBySvc, [svcName, pod.metadata.name], pod);
        });

        return podsBySvc;        
      }
    };
  });
