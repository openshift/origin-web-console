'use strict';

/**
 * @ngdoc function
 * @name openshiftConsole.controller:BuildConfigController
 * @description
 * Controller of the openshiftConsole
 */
angular.module('openshiftConsole')
  .controller('BuildConfigController',
              function($scope,
                       $filter,
                       $routeParams,
                       APIService,
                       AuthorizationService,
                       BuildsService,
                       ImagesService,
                       DataService,
                       LabelFilter,
                       ModalsService,
                       NotificationsService,
                       ProjectsService,
                       SecretsService,
                       keyValueEditorUtils) {
    $scope.projectName = $routeParams.project;
    $scope.buildConfigName = $routeParams.buildconfig;
    $scope.buildConfig = null;
    $scope.labelSuggestions = {};
    $scope.alerts = {};
    $scope.breadcrumbs = [];
    $scope.forms = {};
    $scope.expand = {imageEnv: false};

    if ($routeParams.isPipeline) {
      $scope.breadcrumbs.push({
        title: "Pipelines",
        link: "project/" + $routeParams.project + "/browse/pipelines"
      });
    } else {
      $scope.breadcrumbs.push({
        title: "Builds",
        link: "project/" + $routeParams.project + "/browse/builds"
      });
    }
    $scope.breadcrumbs.push({
      title: $routeParams.buildconfig
    });

    $scope.buildConfigsVersion = APIService.getPreferredVersion('buildconfigs');
    $scope.buildsVersion = APIService.getPreferredVersion('builds');
    $scope.buildConfigsInstantiateVersion = APIService.getPreferredVersion('buildconfigs/instantiate');
    $scope.secretsVersion = APIService.getPreferredVersion('secrets');

    $scope.emptyMessage = "Loading...";

    $scope.aceLoaded = function(editor) {
      var session = editor.getSession();
      session.setOption('tabSize', 2);
      session.setOption('useSoftTabs', true);
      editor.$blockScrolling = Infinity;
    };

    var buildConfigForBuild = $filter('buildConfigForBuild');
    var buildStrategy = $filter('buildStrategy');
    var orderByDisplayName = $filter('orderByDisplayName');
    var getErrorDetails = $filter('getErrorDetails');
    var watches = [];
    var configMapDataOrdered = [];
    var secretDataOrdered = [];
    $scope.valueFromObjects = [];

    // copy buildConfig and ensure it has env so that we can edit env vars using key-value-editor
    var copyBuildConfigAndEnsureEnv = function(buildConfig) {
      $scope.updatedBuildConfig = angular.copy(buildConfig);
      $scope.envVars = buildStrategy($scope.updatedBuildConfig).env || [];
    };

    $scope.compareTriggers = function(lhs, rhs) {
      if (_.isNumber(lhs.value)) {
        // This method gets called again with array indices when dealing with duplicates of the same trigger type
        // just let them go in order
        return -1;
      }
      if (lhs.value === "ConfigChange") {
        return -1;
      }
      if (rhs.value === "ConfigChange") {
        return 1;
      }
      if (lhs.value === "ImageChange") {
        return -1;
      }
      if (rhs.value === "ImageChange") {
        return 1;
      }
      return lhs.value.localeCompare(rhs.value);
    };

    $scope.saveEnvVars = function() {
      NotificationsService.hideNotification("save-bc-env-error");
      $scope.envVars = _.filter($scope.envVars, 'name');
      buildStrategy($scope.updatedBuildConfig).env = keyValueEditorUtils.compactEntries(angular.copy($scope.envVars));
      DataService
        .update($scope.buildConfigsVersion, $routeParams.buildconfig, $scope.updatedBuildConfig, $scope.projectContext)
        .then(function success() {
          NotificationsService.addNotification({
            type: "success",
            message: "Environment variables for build config " + $scope.buildConfigName + " were successfully updated."
          });
          $scope.forms.bcEnvVars.$setPristine();
        }, function error(e) {
          NotificationsService.addNotification({
            id: "save-bc-env-error",
            type: "error",
            message: "An error occurred updating environment variables for build config " + $scope.buildConfigName + ".",
            details: $filter('getErrorDetails')(e)
          });
        });
    };

    $scope.clearEnvVarUpdates = function() {
      copyBuildConfigAndEnsureEnv($scope.buildConfig);
      $scope.forms.bcEnvVars.$setPristine();
    };

    var lastLoadedBuildFromImageKey;

    var buildConfigResolved = function(buildConfig, action) {
      $scope.loaded = true;
      $scope.buildConfig = buildConfig;
      $scope.buildConfigPaused = BuildsService.isPaused($scope.buildConfig);
      if ($scope.buildConfig.spec.source.images) {
        $scope.imageSources = $scope.buildConfig.spec.source.images;
        $scope.imageSourcesPaths = [];
        $scope.imageSources.forEach(function(imageSource) {
          $scope.imageSourcesPaths.push($filter('destinationSourcePair')(imageSource.paths));
        });
      }
      var buildFrom = _.get(buildStrategy(buildConfig), 'from', {});
      // We don't want to reload the image every time the BC updates, only load again if the from changes
      var buildFromImageKey = buildFrom.kind + "/" + buildFrom.name + "/" + (buildFrom.namespace || $scope.projectName);
      if (lastLoadedBuildFromImageKey !== buildFromImageKey) {
        if (_.includes(["ImageStreamTag", "ImageStreamImage"], buildFrom.kind)) {
          lastLoadedBuildFromImageKey = buildFromImageKey;
          DataService.get(APIService.kindToResource(buildFrom.kind), buildFrom.name, {namespace: buildFrom.namespace || $scope.projectName}, {errorNotification: false}).then(function(imageStreamImage){
            $scope.BCEnvVarsFromImage = ImagesService.getEnvironment(imageStreamImage);
          }, function() {
            // We may not be able to fetch the image info as the end user, don't reveal any errors
            $scope.BCEnvVarsFromImage = [];
          });
        }
        else {
          $scope.BCEnvVarsFromImage = [];
        }
      }
      copyBuildConfigAndEnsureEnv(buildConfig);
      if (action === "DELETED") {
        $scope.alerts["deleted"] = {
          type: "warning",
          message: "This build configuration has been deleted."
        };
        $scope.buildConfigDeleted = true;
      }
      if (!$scope.forms.bcEnvVars || $scope.forms.bcEnvVars.$pristine) {
        copyBuildConfigAndEnsureEnv(buildConfig);
      } else {
        $scope.alerts["background_update"] = {
          type: "warning",
          message: "This build configuration has been updated in the background. Saving your changes may create a conflict or cause loss of data.",
          links: [
            {
              label: 'Reload Environment Variables',
              onClick: function() {
                $scope.clearEnvVarUpdates();
                return true;
              }
            }
          ]
        };
      }

      $scope.paused = BuildsService.isPaused($scope.buildConfig);
    };

    ProjectsService
      .get($routeParams.project)
      .then(_.spread(function(project, context) {
        $scope.project = project;
        $scope.projectContext = context;
        DataService
          .get($scope.buildConfigsVersion, $routeParams.buildconfig, context, { errorNotification: false })
          .then(function(buildConfig) {
            buildConfigResolved(buildConfig);
            // If we found the item successfully, watch for changes on it
            watches.push(DataService.watchObject($scope.buildConfigsVersion, $routeParams.buildconfig, context, buildConfigResolved));
          },
          // failure
          function(e) {
            $scope.loaded = true;
            $scope.alerts["load"] = {
              type: "error",
              message: e.status === 404 ? "This build configuration can not be found, it may have been deleted." : "The build configuration details could not be loaded.",
              details: e.status === 404 ? "Any remaining build history for this build will be shown." : $filter('getErrorDetails')(e)
            };
          }
        );

        DataService.list("configmaps", context, null, { errorNotification: false }).then(function(configMapData) {
          configMapDataOrdered = orderByDisplayName(configMapData.by("metadata.name"));
          $scope.valueFromObjects = configMapDataOrdered.concat(secretDataOrdered);
        }, function(e) {
          if (e.code === 403) {
            return;
          }

          NotificationsService.addNotification({
            id: "build-config-list-config-maps-error",
            type: "error",
            message: "Could not load config maps.",
            details: getErrorDetails(e)
          });
        });

        if (AuthorizationService.canI($scope.secretsVersion, 'list', $routeParams.project)) {
          DataService.list("secrets", context, null, { errorNotification: false }).then(function(secretData) {
            secretDataOrdered = orderByDisplayName(secretData.by("metadata.name"));
            $scope.webhookSecrets = SecretsService.groupSecretsByType(secretData).webhook;
            $scope.valueFromObjects = configMapDataOrdered.concat(secretDataOrdered);
          }, function(e) {
            if (e.code === 403) {
              return;
            }

            NotificationsService.addNotification({
              id: "build-config-list-secrets-error",
              type: "error",
              message: "Could not load secrets.",
              details: getErrorDetails(e)
            });
          });
        }

      watches.push(DataService.watch($scope.buildsVersion, context, function(builds, action, build) {
        $scope.emptyMessage = "No builds to show";
        if (!action) {
          $scope.unfilteredBuilds = BuildsService.validatedBuildsForBuildConfig($routeParams.buildconfig, builds.by('metadata.name'));
        } else {
          var buildConfigName = buildConfigForBuild(build);
          if (buildConfigName === $routeParams.buildconfig) {
            var buildName = build.metadata.name;
            switch (action) {
              case 'ADDED':
              case 'MODIFIED':
                $scope.unfilteredBuilds[buildName] = build;
                break;
              case 'DELETED':
                delete $scope.unfilteredBuilds[buildName];
                break;
            }
          }
        }

        $scope.builds = LabelFilter.getLabelSelector().select($scope.unfilteredBuilds);
        updateFilterWarning();
        LabelFilter.addLabelSuggestionsFromResources($scope.unfilteredBuilds, $scope.labelSuggestions);
        LabelFilter.setLabelSuggestions($scope.labelSuggestions);

        // Sort now to avoid sorting on every digest loop.
        $scope.orderedBuilds = BuildsService.sortBuilds($scope.builds, true);
        $scope.latestBuild = _.head($scope.orderedBuilds);
      },
      // params object for filtering
      {
        // http is passed to underlying $http calls
        http: {
          params: {
            // because build config names can be > 63 chars but label values can't
            // and we can't do a fieldSelector on annotations.  Plus old builds dont have the annotation.
            labelSelector: $filter('labelName')('buildConfig') + '=' + _.truncate($scope.buildConfigName, {length: 63, omission: ''})
          }
        }
      }));

        function updateFilterWarning() {
          if (!LabelFilter.getLabelSelector().isEmpty() && $.isEmptyObject($scope.builds) && !$.isEmptyObject($scope.unfilteredBuilds)) {
            $scope.alerts["builds"] = {
              type: "warning",
              details: "The active filters are hiding all builds."
            };
          }
          else {
            delete $scope.alerts["builds"];
          }
        }

        LabelFilter.onActiveFiltersChanged(function(labelSelector) {
          // trigger a digest loop
          $scope.$apply(function() {
            $scope.builds = labelSelector.select($scope.unfilteredBuilds);
            $scope.orderedBuilds = BuildsService.sortBuilds($scope.builds, true);
            $scope.latestBuild = _.head($scope.orderedBuilds);
            updateFilterWarning();
          });
        });

        $scope.startBuild = function() {
          BuildsService.startBuild($scope.buildConfig);
        };

        $scope.showJenkinsfileExamples = function() {
          ModalsService.showJenkinsfileExamples();
        };

        $scope.$on('$destroy', function(){
          DataService.unwatchAll(watches);
        });

    }));
  });
