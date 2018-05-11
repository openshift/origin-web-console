'use strict';

/**
 * @ngdoc function
 * @name openshiftConsole.controller:CreateClientBuildController
 * @description
 * # CreateClientBuildController
 * Controller of the openshiftConsole
 */
angular.module('openshiftConsole')
  .controller('CreateClientBuildController', function(
    $filter,
    $location,
    $routeParams,
    $scope,
    $window,
    APIService,
    DataService,
    Navigate,
    ProjectsService,
    SOURCE_URL_PATTERN
  ) {

    var buildConfigsVersion = APIService.getPreferredVersion('buildconfigs');
    var secretsVersion = APIService.getPreferredVersion('secrets');

    $scope.alerts = [];
    $scope.projectName = $routeParams.project;
    $scope.sourceURLPattern = SOURCE_URL_PATTERN;

    $scope.breadcrumbs = [
      {
         title: 'mobile client',
         link: 'project/' + $scope.projectName + '/browse/mobile-clients/' + $routeParams.mobileclient
      },
      {
        title: 'Create client build'
      }
    ];

    $scope.newClientBuild = {
      authType: 'public',
      clientType: 'android',
      buildType: 'debug'
    };
    
    $scope.buildTypeMap = {
      android: {
        label: 'Android',
        buildTypes: [
          {
            id: 'debug',
            label: 'Debug'
          },
          {
            id: 'release',
            label: 'Release'
          }
        ]
      }
    };

    $scope.authTypes = [
      {
        id: 'public',
        label: 'Public'
      },
      {
        id: 'kubernetes.io/basic-auth',
        label: 'Basic Authentication'
      },
      {
        id: 'kubernetes.io/ssh-auth',
        label: 'SSH Key'
      }
    ];

    var createBuildConfig = function(clientConfig, secret) {
      var buildConfig = {
        kind: 'BuildConfig',
        apiVersion: APIService.toAPIVersion(buildConfigsVersion),
        metadata: {
          name: clientConfig.buildName,
          labels:  {
            'mobile-client-build': 'true'
          }
        },
        spec: {
          source: {
            git: {
              uri: clientConfig.gitUri,
              ref: clientConfig.gitRef
            }
          },
          strategy: {
            jenkinsPipelineStrategy: {
              jenkinsfilePath: clientConfig.jenkinsfilePath,
              env: [
                {
                  name: 'BUILD_CONFIG',
                  value: clientConfig.buildType
                }
              ]
            }
          }
        }
      };

      if(clientConfig.buildType === 'release') {
        buildConfig.spec.strategy.jenkinsPipelineStrategy.env.push({name: 'BUILD_CREDENTIAL_ID', value: $scope.projectName + '-' + clientConfig.androidSecretName});
        if(clientConfig.androidKeyStoreKeyAlias) {
          buildConfig.spec.strategy.jenkinsPipelineStrategy.env.push({name: 'BUILD_CREDENTIAL_ALIAS', value: clientConfig.androidKeyStoreKeyAlias});
        }
      }

      if (clientConfig.authType !== 'public') {
        buildConfig.spec.source.sourceSecret = {
          name: clientConfig.credentialsName
        };
      }

      return buildConfig;
    };

    var createGitCredentialsSecret = function(clientConfig) {
      var secret = {
        apiVersion: APIService.toAPIVersion(secretsVersion),
        kind: 'Secret',
        metadata: {
          name: clientConfig.credentialsName,
          labels:  {
            'mobile-client-build': 'true'
          }
        },
        type: clientConfig.authType,
        stringData: {}
      };

      switch (clientConfig.authType) {
        case 'kubernetes.io/basic-auth':
          secret.stringData.password = clientConfig.passwordToken;
          secret.stringData.username = clientConfig.username;
          secret.type = 'Opaque';
          break;
        case 'kubernetes.io/ssh-auth':
          secret.stringData['ssh-privatekey'] = clientConfig.privateKey;
          break;
      }

      return secret;
    };

    var createAndroidKeyStoreSecret = function(clientConfig) {
      var secret = {
        apiVersion: APIService.toAPIVersion(secretsVersion),
        kind: 'Secret',
        metadata: {
          name:  clientConfig.androidSecretName,
          labels:  {
            'mobile-client-build': 'true',
            'credential.sync.jenkins.openshift.io': 'true'
          }
        },
        type: 'Opaque',
        stringData: {}
      };

      var secretData =  {
        certificate: clientConfig.androidKeyStore,
        password: clientConfig.androidKeyStorePassword
      };
      // Base64 encode the values.
      secret.data = _.mapValues(secretData, window.btoa);

      return secret;
    };

    ProjectsService
      .get($routeParams.project)
      .then(_.spread(function(project, context) {
        $scope.project = project;
        $scope.context = context;
    }));

    $scope.navigateBack = function() {
      if ($routeParams.then) {
        $location.url($routeParams.then);
        return;
      }

      $window.history.back();
    };

    $scope.setAdvancedOptions = function(value) {
      $scope.advancedOptions = value;
    };

    $scope.createClientBuild = function() {
      var clientBuildConfig = createBuildConfig($scope.newClientBuild);
      DataService.create(buildConfigsVersion, null, clientBuildConfig, $scope.context)
        .then(function() {
          if ($scope.newClientBuild.authType === 'public') {
            return Promise.resolve();
          }

          var gitSecret = createGitCredentialsSecret($scope.newClientBuild);
          return DataService.create(secretsVersion, null, gitSecret, $scope.context);
        })
        .then(function() {
          if ($scope.newClientBuild.buildType === 'debug') {
            return Promise.resolve();
          }

          var certSecret = createAndroidKeyStoreSecret($scope.newClientBuild);
          return DataService.create(secretsVersion, null, certSecret, $scope.context)
        })
        .then(function() {
          $scope.navigateBack();
        })
        .catch(function(err) {
          $scope.alerts.push({
            type: 'error',
            message: 'An error occured while creating the mobile client build.',
            details: $filter('getErrorDetails')(err)
          });
        });
    };
  });
