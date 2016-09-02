'use strict';

angular.module("openshiftConsole")
  .factory("PodsService", function() {
    return {
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

      // Takes in a collection of pods and a collection of resources that
      // control pods (replication controllers, replica sets, pet sets) and
      // matches each pod to its owner.
      //
      // Returns: hash where the UID of the owner is the key and a hash of pods
      //          is the value
      groupByOwnerUID: function(pods, owners) {
        var podsByOwnerUID = {};
        var selectorByOnwerUID = {};
        _.each(owners, function(owner) {
          selectorByOnwerUID[owner.metadata.uid] = new LabelSelector(owner.spec.selector);
        });

        // Look at each pod.
        _.each(pods, function(pod) {
          var foundOwner = false;
          _.each(owners, function(owner) {
            var uid = owner.metadata.uid;
            var selector = selectorByOnwerUID[uid];
            if (selector.matches(pod)) {
              _.set(podsByOwnerUID, [uid, pod.metadata.name], pod);
              foundOwner = true;
            }
          });

          if (!foundOwner) {
            _.set(podsByOwnerUID, ['', pod.metadata.name], pod);
          }
        });

        return podsByOwnerUID;
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
