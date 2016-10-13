"use strict";

angular.module("openshiftConsole")

  .directive("createSecret", function(DataService, AuthorizationService) {
    return {
      restrict: 'E',
      scope: {
        type: '=',
        serviceAccountToLink: '=?',
        namespace: '=',
        postCreateAction: '&',
        cancel: '&'
      },
      templateUrl: 'views/directives/create-secret.html',
      link: function($scope, $filter) {
        $scope.alerts = {};

        $scope.secretAuthTypeMap = {
          image: {
            label: "Image Secret",
            authTypes: [
              {
                id: "kubernetes.io/dockercfg",
                label: "Image Registry Credentials"
              },
              {
                id: "kubernetes.io/dockerconfigjson",
                label: "Configuration File"
              }
            ]
          },
          source: {
            label: "Source Secret",
            authTypes: [
              {
                id: "kubernetes.io/basic-auth",
                label: "Basic Authentication"
              },
              {
                id: "kubernetes.io/ssh-auth",
                label: "SSH Key"
              }
            ]
          }
        };

        $scope.secretTypes = _.keys($scope.secretAuthTypeMap);
        // newSecret format:
        //   - type:                       image || source
        //   - authType:                   image  = [kubernetes.io/dockercfg, "kubernetes.io/dockerconfigjson"]
        //                                 source = ["kubernetes.io/basic-auth, "kubernetes.io/ssh-auth"]
        //   - data:                       based on the authentication type
        //   - pickedServiceAccountToLink  based on the view in which the directive is used.
        //                                  - if in BC the 'builder' SA if picked automatically
        //                                  - if in DC the 'deployer' SA if picked automatically
        //                                  - else the user will have to pick the SA and type of linking
        if ($scope.type) {
          $scope.newSecret = {
            type: $scope.type,
            authType: $scope.secretAuthTypeMap[$scope.type].authTypes[0].id,
            data: {},
            linkSecret: !_.isEmpty($scope.serviceAccountToLink),
            pickedServiceAccountToLink: $scope.serviceAccountToLink || "",
          };
        } else {
          $scope.newSecret = {
            type: "source",
            authType: "kubernetes.io/basic-auth",
            data: {},
            linkSecret: false,
            pickedServiceAccountToLink: "",
          };
        }
        $scope.addGitconfig = false;
        $scope.addCaCert = false;

        // List SA only if $scope.serviceAccountToLink is not defined so user has to pick one.
        if (!$scope.serviceAccountToLink && AuthorizationService.canI('serviceaccounts', 'list') && AuthorizationService.canI('serviceaccounts', 'update')) {
          DataService.list("serviceaccounts", $scope, function(result) {
            $scope.serviceAccounts = result.by('metadata.name');
            $scope.serviceAccountsNames = _.keys($scope.serviceAccounts);
          });
        }

        var constructSecretObject = function(data, authType) {
          var secret = {
            apiVersion: "v1",
            kind: "Secret",
            metadata: {
              name: $scope.newSecret.data.secretName
            },
            type: authType,
            data: {}
          };

          switch (authType) {
            case "kubernetes.io/basic-auth":
              // If the password/token is not entered either .gitconfig or ca.crt has to be provided
              if (data.passwordToken) {
                secret.data = {password: window.btoa(data.passwordToken)};
              } else {
                secret.type = "Opaque";
              }
              if (data.username) {
                secret.data.username = window.btoa(data.username);
              }
              if (data.gitconfig) {
                secret.data[".gitconfig"] = window.btoa(data.gitconfig);
              }
              if (data.cacert) {
                secret.data["ca.crt"] = window.btoa(data.cacert);
              }
              break;
            case "kubernetes.io/ssh-auth":
              secret.data = {'ssh-privatekey': window.btoa(data.privateKey)};
              if (data.gitconfig) {
                secret.data[".gitconfig"] = window.btoa(data.gitconfig);
              }
              break;
            case "kubernetes.io/dockerconfigjson":
              var encodedConfig = window.btoa(data.dockerConfig);
              if (JSON.parse(data.dockerConfig).auths) {
                secret.data[".dockerconfigjson"] = encodedConfig;
              } else {
                secret.type = "kubernetes.io/dockercfg";
                secret.data[".dockercfg"] = encodedConfig;
              }
              break;
            case "kubernetes.io/dockercfg":
              var auth = window.btoa(data.dockerUsername + ":" + data.dockerPassword);
              var configData = {};
              configData[data.dockerServer] = {
                username: data.dockerUsername,
                password: data.dockerPassword,
                email: data.dockerMail,
                auth: auth
              };
              secret.data[".dockercfg"] = window.btoa(JSON.stringify(configData));
              break;
          }
          return secret;
        };

        var linkSecretToServiceAccount = function(secret) {
          var updatedSA = angular.copy($scope.serviceAccounts[$scope.newSecret.pickedServiceAccountToLink]);
          switch ($scope.newSecret.type) {
          case 'source':
            updatedSA.secrets.push({name: secret.metadata.name});
            break;
          case 'image':
            updatedSA.imagePullSecrets.push({name: secret.metadata.name});
            break;
          }
          // Don't show any error related to linking to SA when linking is done automatically 
          var options = $scope.serviceAccountToLink ? {errorNotification: false} : {};
          DataService.update('serviceaccounts', $scope.newSecret.pickedServiceAccountToLink, updatedSA, $scope, options).then(function(sa) {
            var alert = {
              name: 'createAndLink',
              data: {
                type: "success",
                message: "Secret " + secret.metadata.name + " was created and linked with service account " + sa.metadata.name + "."
              }
            };
            $scope.postCreateAction({newSecret: secret, creationAlert: alert});
          }, function(result){
            $scope.alerts = {
              name: 'createAndLink',
              data: {
                type: "error",
                message: "An error occurred while linking the secret with service account.",
                details: $filter('getErrorDetails')(result)
              }
            };
          });
        };

        $scope.create = function() {
          $scope.alerts = {};
          var newSecret = constructSecretObject($scope.newSecret.data, $scope.newSecret.authType);
          DataService.create('secrets', null, newSecret, $scope).then(function(secret) { // Success
            if ($scope.newSecret.linkSecret && $scope.newSecret.pickedServiceAccountToLink && AuthorizationService.canI('serviceaccounts', 'update')) {
              linkSecretToServiceAccount(secret);
            } else {
              var alert = {
                name: 'create',
                data: {
                  type: "success",
                  message: "Secret " + newSecret.metadata.name + " was created."
                }
              };
              $scope.postCreateAction({newSecret: secret, creationAlert: alert});
            }
          }, function(result) { // Failure
            var data = result.data || {};
            if (data.reason === 'AlreadyExists') {
              $scope.nameTaken = true;
              return;
            }
            $scope.alerts["create"] = {
              type: "error",
              message: "An error occurred while creating the secret.",
              details: $filter('getErrorDetails')(result)
            };
          });
        };
      },
    };
  });
