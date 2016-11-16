'use strict';

angular.module("openshiftConsole")
  .factory("StorageService", function() {
    return {
      createVolume: function(name, persistentVolumeClaim) {
        return {
          name: name,
          persistentVolumeClaim: {
            claimName: persistentVolumeClaim.metadata.name
          }
        };
      },
      createVolumeMount: function(name, mountPath) {
        return {
          name: name,
          mountPath: mountPath
        };
      },
      // Gets the volume names currently defined in the pod template.
      getVolumeNames: function(podTemplate) {
        var volumes = _.get(podTemplate, 'spec.volumes', []);
        return _.map(volumes, 'name');
      },
      // Gets the mount paths currently defined in the pod template.  An
      // optional filter function for matching specific containers can be used.
      getMountPaths: function(podTemplate, /* optional function */ matchContainer) {
        var mountPaths = [];
        var containers = _.get(podTemplate, 'spec.containers', []);
        _.each(containers, function(container) {
          if (matchContainer && !matchContainer(container)) {
            return;
          }

          var mounts = _.get(container, 'volumeMounts', []);
          _.each(mounts, function(mount) {
            mountPaths.push(mount.mountPath);
          });
        });

        return mountPaths;
      }
    };
  });
