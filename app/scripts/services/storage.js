'use strict';

angular.module("openshiftConsole")
  .factory("StorageService", function(APIService, DataService) {
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
      },

      // Removes the volume and any container volume mounts.
      removeVolume: function(object, volume, context) {
        var copy = angular.copy(object);

        var volumes = _.get(copy, 'spec.template.spec.volumes');
        _.remove(volumes, { name: volume.name });

        var containers = _.get(copy, 'spec.template.spec.containers');
        _.each(containers, function(container) {
          _.remove(container.volumeMounts, { name: volume.name });
        });

        var resource = APIService.objectToResourceGroupVersion(copy);
        return DataService.update(resource, copy.metadata.name, copy, context);
      }
    };
  });
