'use strict';

/**
 * @ngdoc function
 * @name openshiftConsole.controller:EditDeploymentConfigController
 * @description
 * Controller of the openshiftConsole
 */
angular.module('openshiftConsole')
  .controller('EditDeploymentConfigController', function ($scope, $routeParams, $uibModal, DataService, BreadcrumbsService, SecretsService, ProjectsService, $filter, ApplicationGenerator, Navigate, $location, AlertMessageService, SOURCE_URL_PATTERN, keyValueEditorUtils) {
    $scope.projectName = $routeParams.project;
    $scope.deploymentConfig = null;
    $scope.alerts = {};
    $scope.view = {
      advancedStrategyOptions: false,
      advancedImageOptions: false
    };
    $scope.breadcrumbs = BreadcrumbsService.getBreadcrumbs({
      name: $routeParams.name,
      kind: $routeParams.kind,
      namespace: $routeParams.project,
      subpage: 'Edit Deployment Config',
      includeProject: true
    });

    $scope.deploymentConfigStrategyTypes = [
      "Recreate",
      "Rolling",
      "Custom"
    ];

    AlertMessageService.getAlerts().forEach(function(alert) {
      $scope.alerts[alert.name] = alert.data;
    });
    AlertMessageService.clearAlerts();
    var watches = [];

    var getParamsPropertyName = function(strategyType) {
      switch (strategyType) {
      case "Recreate":
        return "recreateParams";
      case "Rolling":
        return "rollingParams";
      case "Custom":
        return "customParams";
      default:
        Logger.error('Unknown deployment strategy type: ' + strategyType);
        return;
      }
    };

    ProjectsService
      .get($routeParams.project)
      .then(_.spread(function(project, context) {
        $scope.project = project;
        $scope.context = context;
        DataService.get("deploymentconfigs", $routeParams.deploymentconfig, context).then(
          // success
          function(deploymentConfig) {
            $scope.deploymentConfig = deploymentConfig;

            $scope.breadcrumbs = BreadcrumbsService.getBreadcrumbs({
              object: deploymentConfig,
              project: project,
              subpage: 'Edit',
              includeProject: true
            });

            // Create map which will associate concatiner name to container's data(envVar, trigger and image which will be used on manual deployment) 
            var mapContainerConfigByName = function(containers, triggers) {
              var containerConfigByName = {};
              var imageChangeTriggers = _.filter(triggers, {type: 'ImageChange'});
              _.each(containers, function(container) {
                var imageChangeTriggerForContainer = _.find(imageChangeTriggers, function(trigger) {
                  return _.includes(trigger.imageChangeParams.containerNames, container.name);
                });
                var triggerData = {};
                containerConfigByName[container.name] = {
                  env: container.env || [],
                  image: container.image,
                  hasDeploymentTrigger: !_.isEmpty(imageChangeTriggerForContainer)
                };
                if (imageChangeTriggerForContainer) {
                  var triggerFromData = imageChangeTriggerForContainer.imageChangeParams.from;
                  var triggerImageNameParts = triggerFromData.name.split(':');
                  triggerData = {
                    data: imageChangeTriggerForContainer,
                    istag: {namespace: triggerFromData.namespace || $scope.projectName, imageStream: triggerImageNameParts[0], tagObject: {tag: triggerImageNameParts[1]}}
                  };
                } else {
                  triggerData = {
                    istag: {namespace: "", imageStream: ""}
                  };
                }
                _.set(containerConfigByName, [container.name, 'triggerData'], triggerData);
              });
              return containerConfigByName;
            };

            $scope.updatedDeploymentConfig = angular.copy($scope.deploymentConfig);
            $scope.containerNames = _.map($scope.deploymentConfig.spec.template.spec.containers, 'name');
            $scope.containerConfigByName = mapContainerConfigByName($scope.updatedDeploymentConfig.spec.template.spec.containers, $scope.updatedDeploymentConfig.spec.triggers);
            $scope.pullSecrets = $scope.deploymentConfig.spec.template.spec.imagePullSecrets || [{name: ''}];
            $scope.volumeNames = _.map($scope.deploymentConfig.spec.template.spec.volumes, 'name');
            $scope.strategyData = angular.copy($scope.deploymentConfig.spec.strategy);
            $scope.originalStrategy = $scope.strategyData.type;
            $scope.strategyParamsPropertyName = getParamsPropertyName($scope.strategyData.type);

            // If strategy is 'Custom' and no environment variables are present, initiliaze them.
            if ($scope.strategyData.type === 'Custom' && !_.has($scope.strategyData, 'customParams.environment')) {
              $scope.strategyData.customParams.environment = [];
            }
            
            DataService.list("secrets", context, function(secrets) {
              var secretsByType = SecretsService.groupSecretsByType(secrets);
              // Add empty option to the image/source secrets
              $scope.secretsByType = _.each(secretsByType, function(secretsArray) {
                secretsArray.unshift("");
              });
            });

            // If we found the item successfully, watch for changes on it
            watches.push(DataService.watchObject("deploymentconfigs", $routeParams.deploymentconfig, context, function(deploymentConfig, action) {
              if (action === 'MODIFIED') {
                $scope.alerts["updated/deleted"] = {
                  type: "warning",
                  message: "This deployment configuration has changed since you started editing it. You'll need to copy any changes you've made and edit again."
                };
              }
              if (action === "DELETED") {
                $scope.alerts["updated/deleted"] = {
                  type: "warning",
                  message: "This deployment configuration has been deleted."
                };
                $scope.disableInputs = true;
              }
              $scope.deploymentConfig = deploymentConfig;
            }));
            $scope.loaded = true;
          },
          // failure
          function(e) {
            $scope.loaded = true;
            $scope.alerts["load"] = {
              type: "error",
              message: "The deployment configuration details could not be loaded.",
              details: $filter('getErrorDetails')(e)
            };
          }
        );
      })
    );

    // helper for detemining if strategy switch was done between Rolling <-> Recreate strategy
    var isRollingRecreateSwitch = function() {
      return ($scope.strategyData.type !== 'Custom' && $scope.originalStrategy !== 'Custom' && $scope.strategyData.type !== $scope.originalStrategy);
    };

    var promptToMoveParams = function(pickedStrategyParams) {
      if (_.has($scope.strategyData, pickedStrategyParams)) {
        return;
      }
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'views/modals/confirm.html',
        controller: 'ConfirmModalController',
        resolve: {
          modalConfig: function() {
            return {
              alerts: $scope.alerts,
              message: "Some of your existing " + $scope.originalStrategy.toLowerCase() + " strategy parameters can be used for the " + $scope.strategyData.type.toLowerCase() + " strategy. Keep parameters?",
              details: "The timeout parameter and any pre or post lifecycle hooks will be copied from " + $scope.originalStrategy.toLowerCase() + " strategy to " + $scope.strategyData.type.toLowerCase() + " strategy. After saving the changes, " + $scope.originalStrategy.toLowerCase() + " strategy parameters will be removed.",
              okButtonText: "Yes",
              okButtonClass: "btn-primary",
              cancelButtonText: "No"
            };
          }
        }
      });
      modalInstance.result.then(function () {
        // Move parameters that belong to the origial strategy to the picked one.
        $scope.strategyData[pickedStrategyParams] = $scope.strategyData[getParamsPropertyName($scope.originalStrategy)];
        $scope.paramsMoved = getParamsPropertyName($scope.originalStrategy);
      }, function() {
        // Create empty parameters for the newly picked strategy
        $scope.strategyData[pickedStrategyParams] = {};
      });
    };

    $scope.strategyChanged = function() {
      var pickedStrategyParams = getParamsPropertyName($scope.strategyData.type);
      if (isRollingRecreateSwitch()) {
        promptToMoveParams(pickedStrategyParams);
      } else {
        if (!_.has($scope.strategyData, pickedStrategyParams)) {
          if ($scope.strategyData.type !== 'Custom') {
            $scope.strategyData[pickedStrategyParams] = {};
          } else {
            $scope.strategyData[pickedStrategyParams] = {
              image: "",
              command: [],
              environment: []
            };
          }
        }
      }
      $scope.strategyParamsPropertyName = pickedStrategyParams;
    };

    var assembleImageChangeTrigger = function(containerName, ist, trigger) {
      var istagObject = {
        kind: "ImageStreamTag",
        namespace: ist.namespace,
        name: ist.imageStream + ':' + ist.tagObject.tag
      };
      if (trigger) {
        trigger.imageChangeParams.from = istagObject;
      } else {
        trigger = {
          type: "ImageChange",
          imageChangeParams: {
            automatic: true,
            containerNames: [containerName],
            from: istagObject
          }
        };
      }
      return trigger;
    };

    var updateTriggers = function() {
      var updatedTriggers = _.filter($scope.updatedDeploymentConfig.spec.triggers, function(trigger) {return trigger.type !== 'ImageChange'});
      _.each($scope.containerConfigByName, function(containerData, containerName) {
        if (containerData.hasDeploymentTrigger) {
          updatedTriggers.push(assembleImageChangeTrigger(containerName, containerData.triggerData.istag, containerData.triggerData.data));
        } else {
          var imageSpec = _.find($scope.updatedDeploymentConfig.spec.template.spec.containers, { name: containerName });
          imageSpec.image = containerData.image;
        }
      });
      return updatedTriggers;
    };

    $scope.save = function() {
      $scope.disableInputs = true;

      // Update env for each container
      _.each($scope.containerConfigByName, function(containerData, containerName) {
        var matchingContainer = _.find($scope.updatedDeploymentConfig.spec.template.spec.containers, { name: containerName });
        matchingContainer.env = keyValueEditorUtils.compactEntries(containerData.env);
      });

      // Remove parameters of previously set strategy, if user moved 
      if ($scope.paramsMoved && isRollingRecreateSwitch()) {
        delete $scope.strategyData[getParamsPropertyName($scope.originalStrategy)];
      }

      if ($scope.strategyData.type !== 'Custom') {
        _.each(['pre', 'mid', 'post'], function(hookType) {
          if (_.has($scope.strategyData, [$scope.strategyParamsPropertyName, hookType, 'execNewPod', 'env'])) {
            $scope.strategyData[$scope.strategyParamsPropertyName][hookType].execNewPod.env = keyValueEditorUtils.compactEntries($scope.strategyData[$scope.strategyParamsPropertyName][hookType].execNewPod.env);
          }
        });
      } else if (_.has($scope, 'strategyData.customParams.environment')) {
        $scope.strategyData.customParams.environment = keyValueEditorUtils.compactEntries($scope.strategyData.customParams.environment);
      }
      // Update image pull secrets 
      $scope.updatedDeploymentConfig.spec.template.spec.imagePullSecrets = $scope.pullSecrets
      $scope.updatedDeploymentConfig.spec.strategy = $scope.strategyData;
      $scope.updatedDeploymentConfig.spec.triggers = updateTriggers();

      DataService.update("deploymentconfigs", $scope.updatedDeploymentConfig.metadata.name, $scope.updatedDeploymentConfig, $scope.context).then(
        function() {
          AlertMessageService.addAlert({
            name: $scope.updatedDeploymentConfig.metadata.name,
            data: {
              type: "success",
              message: "Deployment config " + $scope.updatedDeploymentConfig.metadata.name + " was successfully updated."
            }
          });
          var returnURL = Navigate.resourceURL($scope.updatedDeploymentConfig);
          $location.url(returnURL);
        },
        function(result) {
          $scope.disableInputs = false;
          $scope.alerts["save"] = {
            type: "error",
            message: "An error occurred updating deployment config " + $scope.updatedDeploymentConfig.metadata.name + ".",
            details: $filter('getErrorDetails')(result)
          };
        }
      );
    };

    $scope.$on('$destroy', function(){
      DataService.unwatchAll(watches);
    });
  });
