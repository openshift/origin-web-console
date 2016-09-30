'use strict';

angular.module("openshiftConsole")
  .factory("SecretsService", function(){

    var groupSecretsByType = function(secrets) {
      var secretsByType = {
        source: [],
        image: []
      };

      _.each(secrets.by('metadata.name'), function(secret) {
        switch (secret.type) {
          case 'kubernetes.io/basic-auth':
          case 'kubernetes.io/ssh-auth':
          case 'Opaque':
            secretsByType.source.push(secret.metadata.name);
            break;
          case 'kubernetes.io/dockercfg':
          case 'kubernetes.io/dockerconfigjson':
            secretsByType.image.push(secret.metadata.name);
            break;
        }
      });      
      return secretsByType;
    };

    return {
      groupSecretsByType: groupSecretsByType
    };
  });
