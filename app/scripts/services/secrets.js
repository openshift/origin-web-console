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
            secretsByType.source.push(secret);
            break;
          case 'kubernetes.io/dockercfg':
          case 'kubernetes.io/dockerconfigjson':
            secretsByType.image.push(secret);
            break;
        }
      });      
      return secretsByType;
    };

    var decodeDockercfg = function(encodedData) {
      var decodedSecretData = {};
      var decodedData = JSON.parse(window.atob(encodedData));
      _.each(decodedData, function(data, serverName) {
        decodedSecretData[serverName] = {
          username: data.username,
          password: data.password,
          email: data.email
        };
      });
      return decodedSecretData;
    };

    var decodeDockerconfigjson = function(encodedData) {
      var decodedSecretData = {};
      var decodedData = JSON.parse(window.atob(encodedData));
      _.each(decodedData.auths, function(data, serverName) {
        var usernamePassword = window.atob(data.auth).split(":");
        decodedSecretData[serverName] = {
          username: usernamePassword[0],
          password: usernamePassword[1],
          email: data.email
        };
      });
      return decodedSecretData;
    };

    var decodeSecretData = function(secretData) {
      return _.mapValues(secretData, function(data, paramName) {
        switch (paramName) {
          case ".dockercfg":
            return decodeDockercfg(data);
          case ".dockerconfigjson":
            return decodeDockerconfigjson(data);
          case "username":
          case "password":
          case ".gitconfig":
          case "ssh-privatekey":
          case "ca.crt":
            return window.atob(data);
          default:
            return data;
        }
      });
    };

    return {
      groupSecretsByType: groupSecretsByType,
      decodeSecretData: decodeSecretData
    };
  });
