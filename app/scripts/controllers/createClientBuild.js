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
    var debugBuildType = {
      id: 'debug',
      label: 'Debug'
    };
    var releaseBuildType = {
      id: 'release',
      label: 'Release'
    };

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

    $scope.buildTypeMap = {
      android: {
        label: 'Android',
        buildTypes: [debugBuildType, releaseBuildType],
        buildPlatforms: ['android']
      },
      ios: {
        label: 'iOS',
        buildTypes: [debugBuildType, releaseBuildType],
        buildPlatforms: ['ios']
      },
      cordova: {
        label: 'Cordova',
        buildTypes: [debugBuildType, releaseBuildType],
        buildPlatforms: ['android', 'ios']
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

    var createBuildConfig = function(clientConfig) {
      var buildConfig = {
        kind: 'BuildConfig',
        apiVersion: APIService.toAPIVersion(buildConfigsVersion),
        metadata: {
          name: clientConfig.buildName,
          labels:  {
            'mobile-client-build': 'true',
            'mobile-client-id': _.get($routeParams, 'mobileclient'),
            'mobile-client-type': clientConfig.clientType
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
              jenkinsfilePath: clientConfig.jenkinsFilePath,
              env: [
                {
                  name: 'BUILD_CONFIG',
                  value: clientConfig.buildType
                },
                {
                  name: 'PLATFORM',
                  value: clientConfig.buildPlatform
                }
              ]
            }
          }
        }
      };

      if(clientConfig.clientCredentialsName) {
        buildConfig.spec.strategy.jenkinsPipelineStrategy.env.push({
          name: 'BUILD_CREDENTIAL_ID',
          value: $scope.projectName + '-' + clientConfig.clientCredentialsName
        });
      }

      if(clientConfig.credentialsAlias) {
        buildConfig.spec.strategy.jenkinsPipelineStrategy.env.push({
          name: 'BUILD_CREDENTIAL_ALIAS',
          value: clientConfig.credentialsAlias
        });
      }

      if (clientConfig.gitCredentialsName) {
        buildConfig.spec.source.sourceSecret = {
          name: clientConfig.gitCredentialsName
        };
      }

      return buildConfig;
    };

    var createBaseCredentialsSecret = function() {
      return {
        apiVersion: APIService.toAPIVersion(secretsVersion),
        kind: 'Secret',
        metadata: {
          name: '',
          labels:  {
            'mobile-client-build': 'true'
          }
        },
        type: '',
        stringData: {}
      };
    };

    var createGitCredentialsSecret = function(clientConfig) {
      var secret = createBaseCredentialsSecret();
      _.assign(secret.metadata, {name: clientConfig.gitCredentialsName});
      _.assign(secret, {type: clientConfig.authType});

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

    var createClientCredentialsSecret = function(clientConfig) {
      var secret = createBaseCredentialsSecret();
      _.assign(secret.metadata.labels, {
        'credential.sync.jenkins.openshift.io': 'true'
      });
      _.assign(secret.metadata, {name: clientConfig.clientCredentialsName});
      _.assign(secret, {type: 'Opaque'});

      var secretData = {
        password: clientConfig.clientCredentialsPassword
      };

      if (clientConfig.buildPlatform === 'android') {
        secretData['certificate'] = clientConfig.clientCredentials;
      }

      if (clientConfig.buildPlatform === 'ios') {
        secretData['developer-profile'] = clientConfig.clientCredentials;
      }

      // Base64 encode the values.
      secret.data = _.mapValues(secretData, window.btoa);

      return secret;
    };

    ProjectsService
      .get($routeParams.project)
      .then(_.spread(function(project, context) {
        $scope.project = project;
        $scope.context = context;

        DataService.get(APIService.getPreferredVersion('mobileclients'), $routeParams.mobileclient, context).then(function(mobileClient) {
          $scope.mobileClient = mobileClient;
          var clientType = _.get(mobileClient, 'spec.clientType').toLowerCase();
          var buildPlatform = $scope.buildTypeMap[clientType].buildPlatforms[0];
          $scope.newClientBuild = {
            authType: 'public',
            clientType: clientType,
            buildType: debugBuildType.id,
            buildPlatform: buildPlatform
          };
        });
    }));

    $scope.navigateToMobileTab = function(tab) {
      var resource = $routeParams.mobileclient;
      var kind = _.get($scope, 'mobileClient.kind');
      var namespace = $scope.projectName;
      var opts = {
        tab: tab
      };
      $location.url(Navigate.resourceURL(resource, kind, namespace, null, opts));
    };

    $scope.setAdvancedOptions = function(value) {
      $scope.advancedOptions = value;
    };

    var isDebugBuildOrHasSigningCredentials = function() {
      return $scope.newClientBuild.buildType === debugBuildType.id || !$scope.newClientBuild.externalCredential;
    };

    var isAndroidBuild = function() {
      return $scope.newClientBuild.buildPlatform === 'android';
    };
    var isPublicRepo = function() {
      return $scope.newClientBuild.authType === 'public';
    };

    $scope.createClientBuild = function() {
      var clientBuildConfig = createBuildConfig($scope.newClientBuild);
      DataService.create(buildConfigsVersion, null, clientBuildConfig, $scope.context)
        .then(function() {
          if (isPublicRepo()) {
            return;
          }
          var gitSecret = createGitCredentialsSecret($scope.newClientBuild);
          return DataService.create(secretsVersion, null, gitSecret, $scope.context);
        })
        .then(function() {
          if (isAndroidBuild() && isDebugBuildOrHasSigningCredentials()) {
            return;
          }

          var certSecret = createClientCredentialsSecret($scope.newClientBuild);
          return DataService.create(secretsVersion, null, certSecret, $scope.context);
        })
        .then(function() {
          $scope.navigateToMobileTab('builds');
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
