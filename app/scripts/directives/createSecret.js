"use strict";

angular.module("openshiftConsole")

  .directive("createSecret",
             function($filter,
                      AuthorizationService,
                      APIService,
                      DataService,
                      NotificationsService,
                      ApplicationGenerator,
                      DNS1123_SUBDOMAIN_VALIDATION) {

    var serviceAccountsVersion = APIService.getPreferredVersion('serviceaccounts');
    var secretsVersion = APIService.getPreferredVersion('secrets');

    return {
      restrict: 'E',
      scope: {
        type: '=',
        serviceAccountToLink: '=?',
        namespace: '=',
        onCreate: '&',
        onCancel: '&'
      },
      templateUrl: 'views/directives/create-secret.html',
      link: function($scope) {

        $scope.serviceAccountsVersion = APIService.getPreferredVersion('serviceaccounts');

        $scope.nameValidation = DNS1123_SUBDOMAIN_VALIDATION;
        $scope.secretReferenceValidation = {
          pattern: /^[a-zA-Z0-9\-_]+$/,
          minLength: 8,
          description: 'Secret reference key must consist of lower-case, upper-case letters, numbers, dash, and underscore.'
        };

        $scope.secretAuthTypeMap = {
          generic: {
            label: "Generic Secret",
            authTypes: [
              {
                id: "Opaque",
                label: "Generic Secret"
              }
            ]
          },
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
          },
          webhook: {
            label: "Webhook Secret",
            authTypes: [
              {
                id: "Opaque",
                label: "Webhook Secret"
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
            data: {
              genericKeyValues: {
                data: {}
              }
            },
            linkSecret: false,
            pickedServiceAccountToLink: "",
          };
        }

        $scope.add = {
          gitconfig: false,
          cacert: false
        };

        // List SA only if $scope.serviceAccountToLink is not defined so user has to pick one.
        if (AuthorizationService.canI('serviceaccounts', 'list') && AuthorizationService.canI('serviceaccounts', 'update')) {
          DataService.list(serviceAccountsVersion, $scope, function(result) {
            $scope.serviceAccounts = result.by('metadata.name');
            $scope.serviceAccountsNames = _.keys($scope.serviceAccounts);
          });
        }

        var constructSecretObject = function(data, authType) {
          var secret = {
            apiVersion: APIService.toAPIVersion(secretsVersion),
            kind: "Secret",
            metadata: {
              name: $scope.newSecret.data.secretName
            },
            type: authType,
            stringData: {}
          };

          switch (authType) {
            case "kubernetes.io/basic-auth":

              // If the password/token is not entered either .gitconfig or ca.crt has to be provided
              if (data.passwordToken) {
                secret.stringData.password = data.passwordToken;
              } else {
                secret.type = "Opaque";
              }
              if (data.username) {
                secret.stringData.username = data.username;
              }
              if (data.gitconfig) {
                secret.stringData['.gitconfig'] = data.gitconfig;
              }
              if (data.cacert) {
                secret.stringData['ca.crt'] = data.cacert;
              }
              break;
            case "kubernetes.io/ssh-auth":
              secret.stringData['ssh-privatekey'] = data.privateKey;
              if (data.gitconfig) {
                secret.stringData['.gitconfig'] = data.gitconfig;
              }
              break;
            case "kubernetes.io/dockerconfigjson":
              var configType = ".dockerconfigjson";
              if (!JSON.parse(data.dockerConfig).auths) {
                secret.type = "kubernetes.io/dockercfg";
                configType = ".dockercfg";
              }
              secret.stringData[configType] = data.dockerConfig;
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
              secret.stringData['.dockercfg'] = JSON.stringify(configData);
              break;
            case "Opaque":
              if (data.webhookSecretKey) {
                secret.stringData.WebHookSecretKey = data.webhookSecretKey;
              }
              if (data.genericKeyValues.data) {
                // Base64 encode the values.
                secret.data = _.mapValues(data.genericKeyValues.data, window.btoa);
              }
              break;
          }
          return secret;
        };

        var hideErrorNotifications = function() {
          NotificationsService.hideNotification("create-secret-error");
        };

        var linkSecretToServiceAccount = function(secret) {
          var updatedSA = angular.copy($scope.serviceAccounts[$scope.newSecret.pickedServiceAccountToLink]);
          var rgv = APIService.objectToResourceGroupVersion(updatedSA);
          switch ($scope.newSecret.type) {
          case 'source':
            updatedSA.secrets.push({name: secret.metadata.name});
            break;
          case 'image':
            updatedSA.imagePullSecrets.push({name: secret.metadata.name});
            break;
          }

          DataService.update(rgv, $scope.newSecret.pickedServiceAccountToLink, updatedSA, $scope).then(function(sa) {
            // Show a single success message saying the secret was both created and linked.
            NotificationsService.addNotification({
              type: "success",
              message: "Secret " + secret.metadata.name + " was created and linked with service account " + sa.metadata.name + "."
            });
            $scope.onCreate({newSecret: secret});
          }, function(result){
            // Show a success message that the secret was created and a separate error message saying it couldn't be linked.
            NotificationsService.addNotification({
              type: "success",
              message: "Secret " + secret.metadata.name + " was created."
            });

            // Don't show any error related to linking to SA when linking is done automatically.
            if (!$scope.serviceAccountToLink) {
              NotificationsService.addNotification({
                id: "secret-sa-link-error",
                type: "error",
                message: "An error occurred while linking the secret with service account " + $scope.newSecret.pickedServiceAccountToLink + ".",
                details: $filter('getErrorDetails')(result)
              });
            }
            $scope.onCreate({newSecret: secret});
          });
        };

        var updateEditorMode = _.debounce(function(){
          try {
            JSON.parse($scope.newSecret.data.dockerConfig);
            $scope.invalidConfigFormat = false;
          } catch (e) {
            $scope.invalidConfigFormat = true;
          }
        }, 300, {
          'leading': true
        });

        $scope.aceChanged = updateEditorMode;

        $scope.nameChanged = function() {
          $scope.nameTaken = false;
        };

        $scope.generateWebhookSecretKey = function() {
          $scope.newSecret.data.webhookSecretKey = ApplicationGenerator._generateSecret();
        };

        $scope.create = function() {
          hideErrorNotifications();
          var newSecret = constructSecretObject($scope.newSecret.data, $scope.newSecret.authType);
          DataService.create(APIService.objectToResourceGroupVersion(newSecret), null, newSecret, $scope).then(function(secret) { // Success
            // In order to link:
            // - the SA has to be defined
            // - defined SA has to be present in the obtained SA list
            // - user can update SA
            // Else the linking will be skipped
            if ($scope.newSecret.linkSecret && $scope.serviceAccountsNames.contains($scope.newSecret.pickedServiceAccountToLink) && AuthorizationService.canI('serviceaccounts', 'update')) {
              linkSecretToServiceAccount(secret);
            } else {
              NotificationsService.addNotification({
                type: "success",
                message: "Secret " + newSecret.metadata.name + " was created."
              });
              $scope.onCreate({newSecret: secret});
            }
          }, function(result) { // Failure
            var data = result.data || {};
            if (data.reason === 'AlreadyExists') {
              $scope.nameTaken = true;
              return;
            }
            NotificationsService.addNotification({
              id: "create-secret-error",
              type: "error",
              message: "An error occurred while creating the secret.",
              details: $filter('getErrorDetails')(result)
            });
          });
        };

        $scope.cancel = function() {
          hideErrorNotifications();
          $scope.onCancel();
        };
      }
    };
  });
