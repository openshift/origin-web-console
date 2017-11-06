'use strict';

angular.module("openshiftConsole")
  .factory("SecretsService", function($filter, Logger, NotificationsService){

    var groupSecretsByType = function(secrets) {
      var secretsByType = {
        source: [],
        image: [],
        other: []
      };

      _.each(secrets.by('metadata.name'), function(secret) {
        switch (secret.type) {
          case 'kubernetes.io/basic-auth':
          case 'kubernetes.io/ssh-auth':
          case 'Opaque':
            secretsByType.source.push(secret);
            break;
          case 'kubernetes.io/dockercfg':
          case 'kubernetes.io/dockerconfigjson':
            secretsByType.image.push(secret);
            break;
          default:
            secretsByType.other.push(secret);
        }
      });
      return secretsByType;
    };

    var handleDecodeException = function(error, encodedStringType) {
      NotificationsService.addNotification({
        type: "error",
        message: 'Base64-encoded ' + encodedStringType + ' string could not be decoded.',
        details: $filter('getErrorDetails')(error)
      });
      Logger.error('Base64-encoded ' + encodedStringType + ' string could not be decoded.', error);
    };

    var getServerParams = function(serverData) {
      var params = _.pick(serverData, ['email', 'username', 'password']);
      if (serverData.auth) {
        try {
          // Decode Base64-encoded username:password string.
          var setParams = _.spread(function(username, password) {
            params.username = username;
            params.password = password;
          });
          setParams(_.split(window.atob(serverData.auth), ':', 2));
        } catch(e) {
          handleDecodeException(e, 'username:password');
          return;
        }
      }
      return params;
    };

    // decodeDockerConfig handles both Docker configuration file formats, which are:
    //  - .dockercfg
    //    {
    //      "auths": {
    //        "https://index.docker.io/v1/": {
    //          "auth": "dGVzdHVzZXI6dGVzdHB3",
    //          "email": "jhadvig@test.com"
    //        }
    //      }
    //    }
    //
    //  - .dockerconfigjson
    //    {
    //      "auths": {
    //        "https://index.docker.io/v1/": {
    //          "auth": "dGVzdHVzZXI6dGVzdHB3",
    //          "email": "mail@test.com"
    //        }
    //      }
    //    }
    //
    var decodeDockerConfig = function(encodedData, configType) {
      var decodedData;
      var decodedSecretData = {
        auths: {}
      };

      try {
        decodedData = JSON.parse(window.atob(encodedData));
      } catch(e) {
        handleDecodeException(e, configType);
      }

      if (decodedData.auths) {
        _.each(decodedData.auths, function(serverData, serverName) {
          if (!serverData.auth) {
            decodedSecretData.auths[serverName] = serverData;
            return;
          }
          decodedSecretData.auths[serverName] = getServerParams(serverData);
        });

        if (decodedData.credsStore) {
          decodedSecretData.credsStore = decodedData.credsStore;
        }
      } else {
        _.each(decodedData, function(serverData, serverName) {
          decodedSecretData.auths[serverName] = getServerParams(serverData);
        });
      }

      return decodedSecretData;
    };


    var decodeSecretData = function(secretData) {
      var nonPrintable = {};
      var decodedSecret = _.mapValues(secretData, function(data, configType) {
        var decoded, isNonPrintable;
        if (configType === ".dockercfg" || configType === ".dockerconfigjson") {
          return decodeDockerConfig(data, configType);
        } else {
          decoded = window.atob(data);
          // Allow whitespace like newlines and tabs, but detect other
          // non-printable characters in the unencoded data.
          // http://stackoverflow.com/questions/1677644/detect-non-printable-characters-in-javascript
          isNonPrintable = /[\x00-\x09\x0E-\x1F]/.test(decoded);
          if (isNonPrintable) {
            nonPrintable[configType] = true;
            return data;
          }
          return decoded;
        }
      });

      // Add a property to indicate when the decoded data contains
      // non-printable characters. Use the `$$` prefix so it's not
      // considered part of the data.
      decodedSecret.$$nonprintable = nonPrintable;

      return decodedSecret;
    };

    return {
      groupSecretsByType: groupSecretsByType,
      decodeSecretData: decodeSecretData
    };
  });
