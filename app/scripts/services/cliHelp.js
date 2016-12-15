'use strict';

angular.module("openshiftConsole")
  .factory("CLIHelp", function($filter) {
    var annotation = $filter('annotation');

    // Gets the logs command for an API object.
    //
    // object - a pod, deployment config, replication controller, build config, or build
    // containerName - container name for the pod (optional)
    var getLogsCommand = function(object, /* optional */ containerName) {
      if (!object) {
        return null;
      }

      var command, name, version;
      switch (object.kind) {
        case 'Pod':
          command = 'oc logs ' + object.metadata.name;
          if (containerName) {
            command += ' -c ' + containerName;
          }
          break;
        case 'DeploymentConfig':
          command = 'oc logs dc/' + object.metadata.name;
          break;
        case 'ReplicationController':
          name = annotation(object, 'deploymentConfig');
          version = annotation(object, 'deploymentVersion');
          if (name && version) {
            command = 'oc logs --version ' + version + ' dc/' + name;
          } else {
            command = 'oc logs rc/' + object.metadata.name;
          }
          break;
        case 'BuildConfig':
          command = 'oc logs bc/' + object.metadata.name;
          break;
        case 'Build':
          name = annotation(object, 'buildConfig');
          version = annotation(object, 'buildNumber');
          command = 'oc logs --version ' + version + ' bc/' + name;
          break;
        default:
          return null;
      }
      command += ' -n ' + object.metadata.namespace;

      return command;
    };

    return {
      getLogsCommand: getLogsCommand
    };
  });

