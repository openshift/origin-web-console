"use strict";

angular.module("openshiftConsole")

  .directive("editLifecycleHook", function(APIService) {
    return {
      restrict: 'E',
      scope: {
        type: "@",
        hookParams: "=model",
        availableVolumes: "=",
        availableContainers: "=",
        availableSecrets: "=",
        availableConfigMaps: "=",
        namespace: "="
      },
      templateUrl: 'views/directives/edit-lifecycle-hook.html',
      controller: function($scope) {

        $scope.secretsVersion = APIService.getPreferredVersion('secrets');
        $scope.configMapsVersion = APIService.getPreferredVersion('configmaps');

        $scope.view = {
          isDisabled: false
        };

        $scope.lifecycleHookFailurePolicyTypes = [
          "Abort",
          "Retry",
          "Ignore"
        ];
        $scope.istagHook = {};
        $scope.removedHookParams = {};

        $scope.action = {
          type: _.has($scope.hookParams, 'tagImages') ? "tagImages" : "execNewPod"
        };

        var defaultExecNewPodObject = {
          command: [],
          env: [],
          volumes: [],
          containerName: $scope.availableContainers[0] || ""
        };

        var defaultTagImageObject = {
          to: {},
          containerName: $scope.availableContainers[0] || ""
        };

        var setImageOptions = function(imageData) {
          var istag = {};
          if (!_.isEmpty(imageData)) {
            var imageNameParts = imageData.name.split(':');
            istag = {
              namespace: imageData.namespace || $scope.namespace,
              imageStream: imageNameParts[0],
              tagObject: {
                tag: imageNameParts[1]
              }
            };
          } else {
            istag = {
              namespace: $scope.namespace,
              imageStream: "",
              tagObject: null
            };
          }
          return istag;
        };

        var setOrDefaultHookParams = function() {
          if ($scope.action.type === "execNewPod") {
            if (_.has($scope.removedHookParams, 'execNewPod')) {
              $scope.hookParams.execNewPod = $scope.removedHookParams.execNewPod;
            } else {
              $scope.hookParams.execNewPod = _.get($scope, 'hookParams.execNewPod', {});
            }
            $scope.hookParams.execNewPod = _.merge(angular.copy(defaultExecNewPodObject), $scope.hookParams.execNewPod);
          } else {
            if (_.has($scope.removedHookParams, 'tagImages')) {
              $scope.hookParams.tagImages = $scope.removedHookParams.tagImages;
            } else {
              $scope.hookParams.tagImages = _.get($scope, 'hookParams.tagImages', [{}]);
            }
            $scope.hookParams.tagImages = [_.merge(angular.copy(defaultTagImageObject), $scope.hookParams.tagImages[0])];
            $scope.istagHook = setImageOptions(_.head($scope.hookParams.tagImages).to);
          }
          $scope.hookParams.failurePolicy = _.get($scope.hookParams, 'failurePolicy', "Abort");
        };

        $scope.addHook = function() {
          if (!_.isEmpty($scope.removedHookParams)) {
            $scope.hookParams = $scope.removedHookParams;
            return;
          }
          $scope.hookParams = {};
          setOrDefaultHookParams();
        };

        $scope.removeHook = function() {
          $scope.removedHookParams = $scope.hookParams;
          delete $scope.hookParams;
          $scope.editForm.$setDirty();
        };

        var paramsChange = function() {
          if (!$scope.hookParams) {
            return;
          }
          if ($scope.action.type === 'execNewPod') {
            if ($scope.hookParams.tagImages) {
              $scope.removedHookParams.tagImages = $scope.hookParams.tagImages;
              delete $scope.hookParams.tagImages;
            }
            setOrDefaultHookParams();
          } else if ($scope.action.type === 'tagImages') {
            if ($scope.hookParams.execNewPod) {
              $scope.removedHookParams.execNewPod = $scope.hookParams.execNewPod;
              delete $scope.hookParams.execNewPod;
            }
            setOrDefaultHookParams();
          }
        };

        $scope.$watchGroup(['hookParams', 'action.type'], paramsChange);

        $scope.valueFromObjects = [];
        $scope.$watchGroup(['availableSecrets', 'availableConfigMaps'], function() {
          var configMaps = $scope.availableConfigMaps || [];
          var secrets = $scope.availableSecrets || [];
          $scope.valueFromObjects = configMaps.concat(secrets);
        });

        $scope.$watch("istagHook.tagObject.tag", function() {
          if (!_.has($scope.istagHook, ['tagObject', 'tag'])) {
            return;
          }
          // Assamble image name when tag changes
          _.set($scope.hookParams, 'tagImages[0].to.kind', 'ImageStreamTag');
          _.set($scope.hookParams, 'tagImages[0].to.namespace', $scope.istagHook.namespace);
          _.set($scope.hookParams, 'tagImages[0].to.name', $scope.istagHook.imageStream + ':' + $scope.istagHook.tagObject.tag);
        });
      }
    };
  })
  .directive("lifecycleHook", function($filter, APIService) {
    return {
      restrict: 'E',
      scope: {
        deploymentConfig: '=',
        type: '@'  // "pre", "mid", or "post"
      },
      templateUrl: 'views/directives/lifecycle-hook.html',
      link: function($scope) {

        $scope.secretsVersion = APIService.getPreferredVersion('secrets');
        $scope.configMapsVersion = APIService.getPreferredVersion('configmaps');

        $scope.$watch('deploymentConfig', function(deploymentConfig) {
          $scope.strategyParams = $filter('deploymentStrategyParams')(deploymentConfig);
        });
      }
    };
  });
