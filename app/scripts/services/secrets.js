'use strict';

angular.module("openshiftConsole")
  .factory("SecretsService", function($filter, base64, Logger, NotificationsService){
    var isNonPrintable = $filter('isNonPrintable');

    var groupSecretsByType = function(secrets) {
      var secretsByType = {
        source: [],
        image: [],
        webhook: [],
        other: []
      };

      _.each(secrets.by('metadata.name'), function(secret) {
        switch (secret.type) {
          case 'kubernetes.io/basic-auth':
          case 'kubernetes.io/ssh-auth':
          case 'Opaque':
            if (secret.data.WebHookSecretKey) {
              secretsByType.webhook.push(secret);
            } else {
              secretsByType.source.push(secret);
            }
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
          setParams(_.split(base64.decode(serverData.auth), ':', 2));
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
        decodedData = JSON.parse(base64.decode(encodedData));
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
        if (!data) {
          return '';
        }
        var decoded;
        if (configType === ".dockercfg" || configType === ".dockerconfigjson") {
          return decodeDockerConfig(data, configType);
        } else {
          decoded = base64.decode(data);
          // Allow whitespace like newlines and tabs, but detect other
          // non-printable characters in the unencoded data.
          if (isNonPrintable(decoded)) {
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

    var getWebhookSecretValue = function(secret, webhookSecrets) {
      // 'secretReference' field is an indicator the the webhook is using SecretRef
      // otherwise the secret is in the deprecated plain form.
      // In case the 'webhookSecrets' are not provided, the user doesnt have permisions
      // to list Secrets
      if (_.get(secret, 'secretReference.name') && webhookSecrets) {
        var matchingSecret = _.find(webhookSecrets, {metadata:{name: secret.secretReference.name}});
        return decodeSecretData(matchingSecret.data).WebHookSecretKey;
      } else {
        return _.get(secret, 'secret');
      }
    };

    return {
      groupSecretsByType: groupSecretsByType,
      decodeSecretData: decodeSecretData,
      getWebhookSecretValue: getWebhookSecretValue
    };
  });
