'use strict';

/**
 * @ngdoc function
 * @name openshiftConsole.controller:EditBuildConfigController
 * @description
 * Controller of the openshiftConsole
 */
angular.module('openshiftConsole')
  .controller('EditBuildConfigController',
              function($scope,
                       $filter,
                       $location,
                       $routeParams,
                       $window,
                       ApplicationGenerator,
                       AuthorizationService,
                       DataService,
                       Navigate,
                       NotificationsService,
                       ProjectsService,
                       SOURCE_URL_PATTERN,
                       SecretsService,
                       keyValueEditorUtils) {

    $scope.projectName = $routeParams.project;
    $scope.buildConfig = null;
    $scope.alerts = {};
    $scope.sourceURLPattern = SOURCE_URL_PATTERN;
    $scope.options = {};
    $scope.jenkinsfileOptions = {
      type: 'path'
    };
    $scope.selectTypes = {
      ImageStreamTag: "Image Stream Tag",
      ImageStreamImage: "Image Stream Image",
      DockerImage: "Docker Image Repository"
    };

    $scope.buildFromTypes = [
      "ImageStreamTag",
      "ImageStreamImage",
      "DockerImage"
    ];
    $scope.pushToTypes = [
      "ImageStreamTag",
      "DockerImage",
      "None"
    ];

    $scope.jenkinsfileTypes = [{
      "id": "path",
      "title": "From Source Repository"
    }, {
      "id": "inline",
      "title": "Inline"
    }];
    $scope.view = {
      advancedOptions: false,
      hasHooks: false
    };
    $scope.breadcrumbs = [];

    if ($routeParams.isPipeline) {
      $scope.breadcrumbs.push({
        title: "Pipelines",
        link: "project/" + $routeParams.project + "/browse/pipelines"
      });
      $scope.breadcrumbs.push({
        title: $routeParams.buildconfig,
        link: "project/" + $routeParams.project + "/browse/pipelines/" + $routeParams.buildconfig
      });
    } else {
      $scope.breadcrumbs.push({
        title: "Builds",
        link: "project/" + $routeParams.project + "/browse/builds"
      });
      $scope.breadcrumbs.push({
        title: $routeParams.buildconfig,
        link: "project/" + $routeParams.project + "/browse/builds/" + $routeParams.buildconfig
      });
    }

    $scope.breadcrumbs.push({
      title: $routeParams.isPipeline ? "Edit Pipelines" : "Edit Builds"
    });

    $scope.imageOptions = {
      from: {},
      to: {},
      fromSource: {}
    };

    $scope.sources = {
      "binary": false,
      "dockerfile": false,
      "git": false,
      "images": false,
      "contextDir": false,
      "none": true
    };

    $scope.triggers = {
      githubWebhooks: [],
      gitlabWebhooks: [],
      bitbucketWebhooks: [],
      genericWebhooks: [],
      imageChangeTriggers: [],
      builderImageChangeTrigger: {},
      configChangeTrigger: {}
    };

    $scope.createTriggerSelect = {
      selectedType: "",
      options: [{
        type: 'github',
        label: 'GitHub'
      }, {
        type: 'gitlab',
        label: 'GitLab'
      }, {
        type: 'bitbucket',
        label: 'Bitbucket'
      }, {
        type: 'generic',
        label: 'Generic'
      }]
    };

    $scope.runPolicyTypes = [
      "Serial",
      "Parallel",
      "SerialLatestOnly"
    ];

    $scope.buildHookTypes = [{
      id: "command",
      label: "Command"
    }, {
      id: "script",
      label: "Shell Script"
    }, {
      id: "args",
      label: "Arguments to default image entry point"
    }, {
      id: "commandArgs",
      label: "Command with arguments"
    }, {
      id: "scriptArgs",
      label: "Shell script with arguments"
    }];

    $scope.buildHookSelection = {
      type: {}
    };

    $scope.getArgumentsDescription = function() {
      var commandType = _.get($scope, 'buildHookSelection.type.id', '');
      switch (commandType) {
      case 'args':
        return 'Enter the arguments that will be appended to the default image entry point.';
      case 'commandArgs':
        return 'Enter the arguments that will be appended to the command.';
      case 'scriptArgs':
        return 'Enter the arguments that will be appended to the script.';
      }

      return null;
    };

    var getInitialBuildHookSelection = function() {
      var hasArgs = !_.isEmpty(_.get($scope, 'buildConfig.spec.postCommit.args'));
      var hasCommand = !_.isEmpty(_.get($scope, 'buildConfig.spec.postCommit.command'));
      var hasScript = !!_.get($scope, 'buildConfig.spec.postCommit.script');
      $scope.view.hasHooks = hasArgs || hasCommand || hasScript;

      var id;

      if (hasArgs && hasCommand) {
        id = 'commandArgs';
      } else if (hasArgs && hasScript) {
        id = 'scriptArgs';
      } else if (hasArgs) {
        id = 'args';
      } else if (hasScript) {
        id = 'script';
      } else {
        id = 'command';
      }

      $scope.buildHookSelection.type = _.find($scope.buildHookTypes, { id: id });
    };

    var clearIncompatibleBuildHookFields = function() {
      if (!$scope.view.hasHooks) {
        delete $scope.updatedBuildConfig.spec.postCommit.command;
        delete $scope.updatedBuildConfig.spec.postCommit.args;
        delete $scope.updatedBuildConfig.spec.postCommit.script;
      } else {
        switch ($scope.buildHookSelection.type.id) {
          case "script":
            delete $scope.updatedBuildConfig.spec.postCommit.command;
            delete $scope.updatedBuildConfig.spec.postCommit.args;
            break;
          case "command":
            delete $scope.updatedBuildConfig.spec.postCommit.script;
            delete $scope.updatedBuildConfig.spec.postCommit.args;
            break;
          case "args":
            delete $scope.updatedBuildConfig.spec.postCommit.script;
            delete $scope.updatedBuildConfig.spec.postCommit.command;
            break;
          case "scriptArgs":
            delete $scope.updatedBuildConfig.spec.postCommit.command;
            break;
          case "commandArgs":
            delete $scope.updatedBuildConfig.spec.postCommit.script;
            break;
        }
      }
    };

    $scope.secrets = {};
    var watches = [];
    var buildStrategy = $filter('buildStrategy');

    var navigateBack = function() {
      var buildConfigURL;
      if ($scope.buildConfig) {
        buildConfigURL = Navigate.resourceURL($scope.buildConfig);
        $location.path(buildConfigURL);
      } else {
        $window.history.back();
      }
    };
    $scope.cancel = navigateBack;

    var hideErrorNotifications = function() {
      // TODO: Add method to NotificationsService for passing a list of IDs.
      NotificationsService.hideNotification("edit-build-config-error");
      NotificationsService.hideNotification("edit-build-config-conflict");
      NotificationsService.hideNotification("edit-build-config-deleted");
    };
    $scope.$on('$destroy', hideErrorNotifications);

    ProjectsService
      .get($routeParams.project)
      .then(_.spread(function(project, context) {
        $scope.project = project;
        $scope.context = context;

        if (!AuthorizationService.canI('buildconfigs', 'update', $routeParams.project)) {
          Navigate.toErrorPage('You do not have authority to update build config ' +
                               $routeParams.buildconfig + '.', 'access_denied');
          return;
        }

        DataService.get("buildconfigs", $routeParams.buildconfig, context, { errorNotification: false }).then(
          // success
          function(buildConfig) {
            $scope.buildConfig = buildConfig;
            getInitialBuildHookSelection();

            $scope.updatedBuildConfig = angular.copy($scope.buildConfig);
            $scope.buildStrategy = buildStrategy($scope.updatedBuildConfig);
            $scope.strategyType = $scope.buildConfig.spec.strategy.type;
            $scope.envVars = $scope.buildStrategy.env || [];
            $scope.triggers = getTriggerMap($scope.triggers, $scope.buildConfig.spec.triggers);
            $scope.sources = getSourceMap($scope.sources, $scope.buildConfig.spec.source);

            if (_.has(buildConfig, 'spec.strategy.jenkinsPipelineStrategy.jenkinsfile')) {
              $scope.jenkinsfileOptions.type = 'inline';
            }

            DataService.list("secrets", context).then(function(secrets) {
              var secretsByType = SecretsService.groupSecretsByType(secrets);
              var secretNamesByType =_.mapValues(secretsByType, function(secrets) {return _.map(secrets, 'metadata.name');});
              // Add empty option to the image/source secrets
              $scope.secrets.secretsByType = _.each(secretNamesByType, function(secretsArray) {
                secretsArray.unshift("");
              });
              loadBuildConfigSecrets();
            });

            var setImageOptions = function(imageOptions, imageData) {
              imageOptions.type = (imageData && imageData.kind) ? imageData.kind : "None";
              var istag = {},
                  isimage = "",
                  dockerImage = "";

              if (imageOptions.type === "ImageStreamTag") {
                istag = {namespace: imageData.namespace || buildConfig.metadata.namespace, imageStream: imageData.name.split(':')[0], tagObject: {tag: imageData.name.split(':')[1]}};
              } else {
                istag = {namespace: "", imageStream: "", tagObject: {tag: ""}};
              }

              if (imageOptions.type === "ImageStreamImage") {
                isimage = (imageData.namespace || buildConfig.metadata.namespace) + "/" + imageData.name;
              } else {
                isimage = "";
              }

              dockerImage = imageOptions.type === "DockerImage" ? imageData.name : "";

              imageOptions.imageStreamTag = istag;
              imageOptions.imageStreamImage = isimage;
              imageOptions.dockerImage = dockerImage;
            };

            setImageOptions($scope.imageOptions.from, $scope.buildStrategy.from);
            setImageOptions($scope.imageOptions.to, $scope.updatedBuildConfig.spec.output.to);

            if ($scope.sources.images) {
              $scope.sourceImages = $scope.buildConfig.spec.source.images;
              // If only one Image Source is present in the buildConfig make it editable, if more then one show them as readonly.
              if (_.size($scope.sourceImages) === 1) {
                $scope.imageSourceTypes = angular.copy($scope.buildFromTypes);
                setImageOptions($scope.imageOptions.fromSource, $scope.sourceImages[0].from);
                $scope.imageSourcePaths = _.map($scope.sourceImages[0].paths, function(path) {
                  return {
                    name: path.sourcePath,
                    value: path.destinationDir
                  };
                });
              } else {
                $scope.imageSourceFromObjects = [];
                $scope.sourceImages.forEach(function(sourceImage) {
                  $scope.imageSourceFromObjects.push(sourceImage.from);
                });
              }
            }

            $scope.options.forcePull = !!$scope.buildStrategy.forcePull;
            if ($scope.strategyType === "Docker") {
              $scope.options.noCache = !!$scope.buildConfig.spec.strategy.dockerStrategy.noCache;
              // Only DockerStrategy can have empty Strategy object and therefore it's from object
              $scope.buildFromTypes.push("None");
            }

            // If we found the item successfully, watch for changes on it
            watches.push(DataService.watchObject("buildconfigs", $routeParams.buildconfig, context, function(buildConfig, action) {
              if (action === 'MODIFIED') {
                NotificationsService.addNotification({
                  id: "edit-build-config-conflict",
                  type: "warning",
                  message: "This build configuration has changed since you started editing it. You'll need to copy any changes you've made and edit again."
                });
              }
              if (action === "DELETED") {
                NotificationsService.addNotification({
                  id: "edit-build-config-deleted",
                  type: "warning",
                  message: "This build configuration has been deleted."
                });
                $scope.disableInputs = true;
              }
              $scope.buildConfig = buildConfig;
            }));
            $scope.loaded = true;
          },
          // failure
          function(e) {
            $scope.loaded = true;
            $scope.alerts["load"] = {
              type: "error",
              message: "The build configuration details could not be loaded.",
              details: "Reason: " + $filter('getErrorDetails')(e)
            };
          }
        );
      })
    );

    var getTriggerMap = function(triggerMap, triggers) {
      // Even if `from` is set in the image change trigger check if its not pointing to the builder image
      function isBuilder(imageChangeFrom, buildConfigFrom) {
        var imageChangeRef = $filter('imageObjectRef')(imageChangeFrom, $scope.projectName);
        var builderRef = $filter('imageObjectRef')(buildConfigFrom, $scope.projectName);
        return imageChangeRef === builderRef;
      }
      var buildConfigFrom = buildStrategy($scope.buildConfig).from;

      triggers.forEach(function(trigger) {
        switch (trigger.type) {
          case "Generic":
            triggerMap.genericWebhooks.push({disabled: false, data: trigger});
            break;
          case "GitHub":
            triggerMap.githubWebhooks.push({disabled: false, data: trigger});
            break;
          case "GitLab":
            triggerMap.gitlabWebhooks.push({disabled: false, data: trigger});
            break;
          case "Bitbucket":
            triggerMap.bitbucketWebhooks.push({disabled: false, data: trigger});
            break;
          case "ImageChange":
            var imageChangeFrom = trigger.imageChange.from;
            if (!imageChangeFrom) {
              imageChangeFrom = buildConfigFrom;
            }
            var triggerRecord =  {present: true, data: trigger};
            if (isBuilder(imageChangeFrom, buildConfigFrom)) {
              triggerMap.builderImageChangeTrigger = triggerRecord;
            } else {
              triggerMap.imageChangeTriggers.push(triggerRecord);
            }
            break;
          case "ConfigChange":
            triggerMap.configChangeTrigger = {present: true, data: trigger};
            break;
        }
      });

      // If the builder imageChange trigger is not present, pre-populate the imageChangeTriggers array with it
      // and set the builderImageChangeTrigger object with it.
      if (_.isEmpty(triggerMap.builderImageChangeTrigger)) {
        triggerMap.builderImageChangeTrigger = {present: false, data: {imageChange: {}, type: "ImageChange"}};
      }
      if (_.isEmpty(triggerMap.configChangeTrigger)) {
        triggerMap.configChangeTrigger = {present: false, data: {type: "ConfigChange"}};
      }
      return triggerMap;
    };

    $scope.aceLoaded = function(editor) {
      var session = editor.getSession();
      session.setOption('tabSize', 2);
      session.setOption('useSoftTabs', true);
      editor.$blockScrolling = Infinity;
    };

    var updatedImageSourcePath = function(imageSourcePaths) {
      return _.map(
              keyValueEditorUtils.compactEntries(imageSourcePaths),
              function(path) {
              	return {
                  sourcePath: path.name,
                  destinationDir: path.value
                };
              });
    };

    var constructImageObject = function(optionsModel) {
      var imageObject = {};
      switch (optionsModel.type) {
      case 'ImageStreamTag':
        imageObject = {
          kind: optionsModel.type,
          name: optionsModel.imageStreamTag.imageStream + ":" + optionsModel.imageStreamTag.tagObject.tag
        };
        if (optionsModel.imageStreamTag.namespace !== $scope.buildConfig.metadata.namespace) {
          imageObject.namespace = optionsModel.imageStreamTag.namespace;
        }
        break;
      case 'DockerImage':
        imageObject = {
          kind: optionsModel.type,
          name: optionsModel.dockerImage
        };
        break;
      case 'ImageStreamImage':
        var namespaceAndName = optionsModel.imageStreamImage.split("/");
        imageObject = {
          kind: optionsModel.type,
          name: _.last(namespaceAndName)
        };
        imageObject.namespace = (_.size(namespaceAndName) !== 1) ? _.head(namespaceAndName) : $scope.buildConfig.metadata.namespace;
        break;
      }
      return imageObject;
    };

    var updateTriggers = function() {
      var triggers = [].concat($scope.triggers.githubWebhooks,
                              $scope.triggers.gitlabWebhooks,
                              $scope.triggers.bitbucketWebhooks,
                              $scope.triggers.genericWebhooks,
                              $scope.triggers.imageChangeTriggers,
                              $scope.triggers.builderImageChangeTrigger,
                              $scope.triggers.configChangeTrigger);
      // Filter webhook triggers that are not disabled or imageChange triggers that are present
      triggers = _.filter(triggers, function(trigger) {
        // The condition has to check if the value exist and  is set to 'false' in case of webhook triggers and 'true' in case of imageChange and configChange triggers.
        return (_.has(trigger, 'disabled') && !trigger.disabled) || trigger.present;
      });
      triggers = _.map(triggers, 'data');
      return triggers;
    };

    var loadBuildConfigSecrets = function() {
      $scope.secrets.picked = {
        gitSecret: $scope.buildConfig.spec.source.sourceSecret ? [$scope.buildConfig.spec.source.sourceSecret] : [{name: ""}],
        pullSecret: buildStrategy($scope.buildConfig).pullSecret ? [buildStrategy($scope.buildConfig).pullSecret] : [{name: ""}],
        pushSecret: $scope.buildConfig.spec.output.pushSecret ? [$scope.buildConfig.spec.output.pushSecret] : [{name: ""}]
      };

      switch ($scope.strategyType) {
      case "Source":
      case "Docker":
        $scope.secrets.picked.sourceSecrets = $scope.buildConfig.spec.source.secrets || [{secret: { name: ""}, destinationDir: ""}];
        break;
      case "Custom":
        $scope.secrets.picked.sourceSecrets = buildStrategy($scope.buildConfig).secrets || [{secretSource: { name: ""}, mountPath: ""}];
        break;
      }
    };

    var updateSecrets = function(object, pickedSecret, secretFieldName) {
      if (pickedSecret.name) {
        object[secretFieldName] = pickedSecret;
      } else {
        delete object[secretFieldName];
      }
    };

    var updateSourceSecrets = function(object, pickedSecrets) {
      var property = $scope.strategyType === "Custom" ? "secretSource" : "secret";
      var nonEmptySecrets = _.filter(pickedSecrets, function(secret) {
        return secret[property].name;
      });
      if (!_.isEmpty(nonEmptySecrets)) {
        object.secrets = nonEmptySecrets;
      } else {
        delete object.secrets;
      }
    };

    var getSourceMap = function(sourceMap, sources) {
      if (sources.type === "None") {
        return sourceMap;
      }
      sourceMap.none = false;
      angular.forEach(sources, function(value, key) {
        sourceMap[key] = true;
      });
      return sourceMap;
    };

    $scope.addWebhookTrigger = function(webhookLabel) {
      if (!webhookLabel) {
        return;
      }
      var webhook = {
        disabled: false,
        data: {
          type: webhookLabel
        }
      };
      var webhookType = _.find($scope.createTriggerSelect.options, function(o) {return o.label === webhookLabel}).type
      webhook.data[webhookType] = {
        secret: ApplicationGenerator._generateSecret()
      };
      $scope.triggers[webhookType + "Webhooks"].push(webhook);
    };

    $scope.save = function() {
      $scope.disableInputs = true;
      clearIncompatibleBuildHookFields();
      // Update Configuration
      buildStrategy($scope.updatedBuildConfig).forcePull = $scope.options.forcePull;

      switch ($scope.strategyType) {
      case 'Docker':
        buildStrategy($scope.updatedBuildConfig).noCache = $scope.options.noCache;
        break;
      case 'JenkinsPipeline':
        if ($scope.jenkinsfileOptions.type === 'path') {
          delete $scope.updatedBuildConfig.spec.strategy.jenkinsPipelineStrategy.jenkinsfile;
        } else {
          delete $scope.updatedBuildConfig.spec.strategy.jenkinsPipelineStrategy.jenkinsfilePath;
        }
        break;
      }

      // If imageSources are present update each ones From and Paths.
      if ($scope.sources.images && !_.isEmpty($scope.sourceImages)) {
        $scope.updatedBuildConfig.spec.source.images[0].paths  = updatedImageSourcePath($scope.imageSourcePaths);
        // Construct updated imageSource builder image object based on it's kind for the only imageSource
        $scope.updatedBuildConfig.spec.source.images[0].from = constructImageObject($scope.imageOptions.fromSource);
      }

      // Construct updated builder image object based on it's kind
      if ($scope.imageOptions.from.type === "None") {
        delete buildStrategy($scope.updatedBuildConfig).from;
      } else {
        buildStrategy($scope.updatedBuildConfig).from = constructImageObject($scope.imageOptions.from);
      }

      // Construct updated output image object based on it's kind. Only Image Stream Tag, Docker Image and None can
      // be specified for the output image. Not Image Stream Image since they are immutable.
      if ($scope.imageOptions.to.type === "None") {
        // If user will change the output reference to 'None' shall the potential PushSecret be deleted as well?
        // This case won't delete them.
        delete $scope.updatedBuildConfig.spec.output.to;
      } else {
        $scope.updatedBuildConfig.spec.output.to = constructImageObject($scope.imageOptions.to);
      }
      // Update envVars
      buildStrategy($scope.updatedBuildConfig).env = keyValueEditorUtils.compactEntries($scope.envVars);

      // Update secrets
      updateSecrets($scope.updatedBuildConfig.spec.source, _.head($scope.secrets.picked.gitSecret), "sourceSecret");
      updateSecrets(buildStrategy($scope.updatedBuildConfig), _.head($scope.secrets.picked.pullSecret), "pullSecret");
      updateSecrets($scope.updatedBuildConfig.spec.output, _.head($scope.secrets.picked.pushSecret), "pushSecret");

      switch ($scope.strategyType) {
      case "Source":
      case "Docker":
        updateSourceSecrets($scope.updatedBuildConfig.spec.source, $scope.secrets.picked.sourceSecrets);
        break;
      case "Custom":
        updateSourceSecrets(buildStrategy($scope.updatedBuildConfig), $scope.secrets.picked.sourceSecrets);
        break;
      }

      // Update triggers
      $scope.updatedBuildConfig.spec.triggers = updateTriggers();
      hideErrorNotifications();
      DataService.update("buildconfigs", $scope.updatedBuildConfig.metadata.name, $scope.updatedBuildConfig, $scope.context).then(
        function() {
          NotificationsService.addNotification({
            type: "success",
            message: "Build config " + $scope.updatedBuildConfig.metadata.name + " was successfully updated."
          });
          navigateBack();
        },
        function(result) {
          $scope.disableInputs = false;

          NotificationsService.addNotification({
            id: "edit-build-config-error",
            type: "error",
            message: "An error occurred updating build config " + $scope.updatedBuildConfig.metadata.name + ".",
            details: $filter('getErrorDetails')(result)
          });
        }
      );
    };

    $scope.$on('$destroy', function(){
      DataService.unwatchAll(watches);
    });
  });
