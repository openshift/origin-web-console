"use strict";

angular.module("openshiftConsole")

  .directive("lifecycleHook", function() {
    return {
      restrict: 'E',
      scope: {
        type: "@",
        hookParams: "=model",
        availableVolumes: "=",
        availableContainers: "=",
        namespace: "="
      },
      templateUrl: 'views/directives/lifecycle-hook.html',
      controller: function($scope) {
        $scope.view = {
          isDisabled: false
        };
        $scope.view.hookExists = !_.isEmpty($scope.hookParams);

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
              tagObject: {
                tag: ""
              }
            };
          }
          return istag;
        };
        
        var setOrDefaultHookParams = function() {
          $scope.hookParams.failurePolicy = _.get($scope.hookParams, 'failurePolicy', "Abort");
          if ($scope.action.type === "execNewPod") {
            if (_.has($scope.removedHookParams, 'execNewPod')) {
              $scope.hookParams.execNewPod = $scope.removedHookParams.execNewPod;
              return;
            }
            $scope.hookParams.execNewPod = _.merge(defaultExecNewPodObject, $scope.hookParams.execNewPod);
          } else {
            if (_.has($scope.removedHookParams, 'tagImages')) {
              $scope.hookParams.tagImages = $scope.removedHookParams.tagImages;
              return;
            }
            $scope.hookParams.tagImages = [_.merge(defaultTagImageObject, $scope.hookParams.tagImages)];
            $scope.istagHook = setImageOptions(_.head($scope.hookParams.tagImages).to);
          }
        };

        $scope.addHook = function() {
          if (!_.isEmpty($scope.removedHookParams)) {
            $scope.hookParams = $scope.removedHookParams;
            $scope.view.hookExists = true;
            return;
          }
          $scope.hookParams = {};
          setOrDefaultHookParams();
          $scope.view.hookExists = true;
        };

        $scope.removeHook = function() {
          $scope.removedHookParams = $scope.hookParams;
          delete $scope.hookParams;
          $scope.view.hookExists = false;
          $scope.editForm.$setDirty();
        };

        $scope.$watch("action.type", function() {
          if ($scope.action.type === 'execNewPod' && _.has($scope.hookParams, 'tagImages')) {
            $scope.removedHookParams['tagImages'] = $scope.hookParams.tagImages;
            delete $scope.hookParams.tagImages;
            setOrDefaultHookParams();
          } else if ($scope.action.type === 'tagImages') {
            if (_.has($scope.hookParams, 'execNewPod')) {
              $scope.removedHookParams['execNewPod'] = $scope.hookParams.execNewPod;
              delete $scope.hookParams.execNewPod;
              setOrDefaultHookParams();
            } else {
              $scope.istagHook = setImageOptions(_.head($scope.hookParams.tagImages).to);
            }
          }
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
  });
