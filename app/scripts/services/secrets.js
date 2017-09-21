'use strict';

angular.module("openshiftConsole")
  .factory("SecretsService", function(){

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

    var decodeDockercfg = function(encodedData) {
      var decodedSecretData = {
        auths: {}
      };
      var decodedData = JSON.parse(window.atob(encodedData));
      _.each(decodedData, function(data, serverName) {
        decodedSecretData.auths[serverName] = {
          username: data.username,
          password: data.password,
          email: data.email
        };
      });
      return decodedSecretData;
    };

    var decodeDockerconfigjson = function(encodedData) {
      var decodedSecretData = {
        auths: {}
      };
      var decodedData = JSON.parse(window.atob(encodedData));
      _.each(decodedData.auths, function(data, serverName) {
        if (!data.auth) {
          decodedSecretData.auths[serverName] = data;
          return;
        }

        var usernamePassword = window.atob(data.auth).split(":");
        decodedSecretData.auths[serverName] = {
          username: usernamePassword[0],
          password: usernamePassword[1],
          email: data.email
        };
      });

      if (decodedData.credsStore) {
        decodedSecretData.credsStore = decodedData.credsStore;
      }

      return decodedSecretData;
    };

    var decodeSecretData = function(secretData) {
      var nonPrintable = {};
      var decodedSecret = _.mapValues(secretData, function(data, paramName) {
        var decoded, isNonPrintable;
        switch (paramName) {
        case ".dockercfg":
          return decodeDockercfg(data);
        case ".dockerconfigjson":
          return decodeDockerconfigjson(data);
        default:
          decoded = window.atob(data);
          // Allow whitespace like newlines and tabs, but detect other
          // non-printable characters in the unencoded data.
          // http://stackoverflow.com/questions/1677644/detect-non-printable-characters-in-javascript
          isNonPrintable = /[\x00-\x09\x0E-\x1F]/.test(decoded);
          if (isNonPrintable) {
            nonPrintable[paramName] = true;
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
