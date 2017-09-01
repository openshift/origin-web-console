"use strict";

angular.module("openshiftConsole")
  .controller("CreateFromImageController",
              function($scope,
                       $filter,
                       $parse,
                       $q,
                       $routeParams,
                       $uibModal,
                       APIService,
                       ApplicationGenerator,
                       DataService,
                       HPAService,
                       ImagesService,
                       LimitRangesService,
                       Logger,
                       MetricsService,
                       Navigate,
                       NotificationsService,
                       ProjectsService,
                       QuotaService,
                       SOURCE_URL_PATTERN,
                       SecretsService,
                       TaskList,
                       failureObjectNameFilter,
                       keyValueEditorUtils) {
    var displayNameFilter = $filter('displayName');
    var humanize = $filter('humanize');

    $scope.projectName = $routeParams.project;
    $scope.sourceURLPattern = SOURCE_URL_PATTERN;
    var imageName = $routeParams.imageStream;

    if(!imageName){
      Navigate.toErrorPage("Cannot create from source: a base image was not specified");
      return;
    }
    if(!$routeParams.imageTag){
      Navigate.toErrorPage("Cannot create from source: a base image tag was not specified");
      return;
    }

    var breadcrumbTitle = $routeParams.displayName || imageName;
    $scope.displayName = $routeParams.displayName;
    $scope.advancedOptions = $routeParams.advanced === 'true';
    $scope.breadcrumbs = [
      {
        title: "Add to Project",
        link: "project/" + $scope.projectName + "/create"
      },
      {
        title: "Catalog",
        link: "project/" + $scope.projectName + "/create?tab=fromCatalog"
      },
      {
        title: breadcrumbTitle
      }
    ];

    var appLabel = {name: 'app', value: ''};

    var orderByDisplayName = $filter('orderByDisplayName');
    var getErrorDetails = $filter('getErrorDetails');

    var quotaAlerts = {};
    var hideErrorNotifications = function() {
      NotificationsService.hideNotification("create-builder-list-config-maps-error");
      NotificationsService.hideNotification("create-builder-list-secrets-error");
      _.each(quotaAlerts, function(alert) {
        if (alert.id && (alert.type === 'error' || alert.type === 'warning')) {
          NotificationsService.hideNotification(alert.id);
        }
      });
    };
    $scope.$on('$destroy', hideErrorNotifications);

    ProjectsService
      .get($routeParams.project)
      .then(_.spread(function(project, context) {
        $scope.project = project;
        if($routeParams.sourceURI) {
          $scope.sourceURIinParams = true;
        }
        function initAndValidate(scope){

          scope.name = $routeParams.name;
          scope.imageName = imageName;
          scope.imageTag = $routeParams.imageTag;
          scope.namespace = $routeParams.namespace;
          scope.buildConfig = {
            buildOnSourceChange: true,
            buildOnImageChange: true,
            buildOnConfigChange: true,
            secrets: {
              gitSecret: [{name: ""}]
            },
            sourceUrl: $routeParams.sourceURI,
            gitRef: $routeParams.sourceRef,
            contextDir: $routeParams.contextDir
          };
          scope.buildConfigEnvVars = [];
          scope.deploymentConfig = {
            deployOnNewImage: true,
            deployOnConfigChange: true
          };
          scope.DCEnvVarsFromImage;
          scope.DCEnvVarsFromUser = [];
          scope.routing = {
            include: true,
            portOptions: []
          };
          scope.labelArray = [appLabel];
          scope.annotations = {};
          scope.scaling = {
            replicas: 1,
            autoscale: false,
            autoscaleOptions: [{
              label: 'Manual',
              value: false
            }, {
              label: 'Automatic',
              value: true
            }]
          };
          scope.container = {
            resources: {}
          };

          // Check if requests or limits are calculated. Memory limit is never calculated.
          scope.cpuRequestCalculated = LimitRangesService.isRequestCalculated('cpu', project);
          scope.cpuLimitCalculated = LimitRangesService.isLimitCalculated('cpu', project);
          scope.memoryRequestCalculated = LimitRangesService.isRequestCalculated('memory', project);

          scope.fillSampleRepo = function() {
            var annotations;
            if (!scope.image && !scope.image.metadata && !scope.image.metadata.annotations) {
              return;
            }

            annotations = scope.image.metadata.annotations;
            scope.buildConfig.sourceUrl = annotations.sampleRepo || "";
            scope.buildConfig.gitRef = annotations.sampleRef || "";
            scope.buildConfig.contextDir = annotations.sampleContextDir || "";
            if (annotations.sampleRef || annotations.sampleContextDir) {
              // Show the advanced source options (without exapnding all
              // advanced options) if the sample repo uses it.
              scope.advancedSourceOptions = true;
            }
          };

          scope.usingSampleRepo = function() {
            return scope.buildConfig.sourceUrl === _.get(scope, 'image.metadata.annotations.sampleRepo');
          };

          // Warn if metrics aren't configured when setting autoscaling options.
          MetricsService.isAvailable().then(function(available) {
            $scope.metricsWarning = !available;
          });

           var configMapDataOrdered = [];
           var secretDataOrdered = [];
           $scope.valueFromObjects = [];

           DataService.list("configmaps", context, null, { errorNotification: false }).then(function(configMapData) {
             configMapDataOrdered = orderByDisplayName(configMapData.by("metadata.name"));
             $scope.valueFromObjects = configMapDataOrdered.concat(secretDataOrdered);
           }, function(e) {
             if (e.code === 403) {
               return;
             }

             NotificationsService.addNotification({
               id: "create-builder-list-config-maps-error",
               type: "error",
               message: "Could not load config maps.",
               details: getErrorDetails(e)
             });
           });

           DataService.list("secrets", context, null, { errorNotification: false }).then(function(secretData) {
             secretDataOrdered = orderByDisplayName(secretData.by("metadata.name"));
             $scope.valueFromObjects = secretDataOrdered.concat(configMapDataOrdered);
             var secretsByType = SecretsService.groupSecretsByType(secretData);
             var secretNamesByType =_.mapValues(secretsByType, function(secretData) {return _.map(secretData, 'metadata.name');});
             // Add empty option to the image/source secrets
             $scope.secretsByType = _.each(secretNamesByType, function(secretsArray) {
               secretsArray.unshift("");
             });
           }, function(e) {
             if (e.code === 403) {
               return;
             }

             NotificationsService.addNotification({
               id: "create-builder-list-secrets-error",
               type: "error",
               message: "Could not load secrets.",
               details: getErrorDetails(e)
             });
           });

          DataService.get("imagestreams", scope.imageName, {namespace: (scope.namespace || $routeParams.project)}).then(function(imageStream){
              scope.imageStream = imageStream;
              var imageName = scope.imageTag;
              DataService.get("imagestreamtags", imageStream.metadata.name + ":" + imageName, {namespace: scope.namespace}).then(function(imageStreamTag){
                  scope.image = imageStreamTag.image;
                  scope.DCEnvVarsFromImage = ImagesService.getEnvironment(imageStreamTag);
                  var ports = ApplicationGenerator.parsePorts(imageStreamTag.image);
                  if (_.isEmpty(ports)) {
                    scope.routing.include = false;
                    scope.routing.portOptions = [];
                  } else {
                    scope.routing.portOptions = _.map(ports, function(portSpec) {
                      var servicePort = ApplicationGenerator.getServicePort(portSpec);
                      return {
                        port: servicePort.name,
                        label: servicePort.targetPort + "/" + servicePort.protocol
                      };
                    });
                    scope.routing.targetPort = scope.routing.portOptions[0].port;
                  }
                }, function(){
                    Navigate.toErrorPage("Cannot create from source: the specified image could not be retrieved.");
                  }
                );
            },
            function(){
              Navigate.toErrorPage("Cannot create from source: the specified image could not be retrieved.");
            });
        }

        var validatePodLimits = function() {
          if (!$scope.hideCPU) {
            $scope.cpuProblems = LimitRangesService.validatePodLimits($scope.limitRanges, 'cpu', [$scope.container], project);
          }
          $scope.memoryProblems = LimitRangesService.validatePodLimits($scope.limitRanges, 'memory', [$scope.container], project);
        };

        DataService.list("limitranges", context).then(function(resp) {
          $scope.limitRanges = resp.by("metadata.name");
          if (!_.isEmpty($scope.limitRanges)) {
            $scope.$watch('container', validatePodLimits, true);
          }
        });

        var checkCPURequest = function() {
          if (!$scope.scaling.autoscale) {
            $scope.showCPURequestWarning = false;
            return;
          }

          // Warn if autoscaling is set, but there won't be a CPU request for the container.
          $scope.showCPURequestWarning = !HPAService.hasCPURequest([$scope.container], $scope.limitRanges, project);
        };

        var quotas, clusterQuotas;

        DataService.list("resourcequotas", context).then(function(resp) {
          quotas = resp.by("metadata.name");
          Logger.log("quotas", quotas);
        });

        // TODO clean up anything not needed here
        DataService.list("appliedclusterresourcequotas", context).then(function(clusterQuotaData) {
          clusterQuotas = clusterQuotaData.by("metadata.name");
          Logger.log("cluster quotas", clusterQuotas);
        });

        $scope.$watch('scaling.autoscale', checkCPURequest);
        $scope.$watch('container', checkCPURequest, true);
        $scope.$watch('name', function(newValue, oldValue) {
          // Only change the app label if the user hasn't modified it themselves.
          if (!appLabel.value || appLabel.value === oldValue) {
            appLabel.value = newValue;
          }
        });

        initAndValidate($scope);

        var generatedResources;
        var createResources = function(){
          var titles = {
            started: "Creating application " + $scope.name + " in project " + $scope.projectDisplayName(),
            success: "Created application " + $scope.name + " in project " + $scope.projectDisplayName(),
            failure: "Failed to create " + $scope.name + " in project " + $scope.projectDisplayName()
          };
          var helpLinks = {};

          TaskList.clear();
          TaskList.add(titles, helpLinks, $routeParams.project, function() {
            var d = $q.defer();
            DataService.batch(generatedResources, context)
              //refactor these helpers to be common for 'newfromtemplate'
              .then(function(result) {
                    var alerts = [];
                    var hasErrors = false;
                    if (!_.isEmpty(result.failure)) {
                      hasErrors = true;
                      result.failure.forEach(
                        function(failure) {
                          alerts.push({
                            type: "error",
                            message: "Cannot create " + humanize(failure.object.kind).toLowerCase() + " \"" + failure.object.metadata.name + "\". ",
                            details: failure.data.message
                          });
                        }
                      );
                      result.success.forEach(
                        function(success) {
                          alerts.push({
                            type: "success",
                            message: "Created " + humanize(success.kind).toLowerCase() + " \"" + success.metadata.name + "\" successfully. "
                          });
                        }
                      );
                    } else {
                      alerts.push({ type: "success", message: "All resources for application " + $scope.name +
                        " were created successfully."});
                    }
                    d.resolve({alerts: alerts, hasErrors: hasErrors});
                  }
                );
                return d.promise;
              });
          Navigate.toNextSteps($scope.name, $scope.projectName, {
            usingSampleRepo: $scope.usingSampleRepo(),
            breadcrumbTitle: breadcrumbTitle
          });
        };

        var launchConfirmationDialog = function(alerts) {
          var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/modals/confirm.html',
            controller: 'ConfirmModalController',
            resolve: {
              modalConfig: function() {
                return {
                  alerts: alerts,
                  message: "Problems were detected while checking your application configuration.",
                  okButtonText: "Create Anyway",
                  okButtonClass: "btn-danger",
                  cancelButtonText: "Cancel"
                };
              }
            }
          });

          modalInstance.result.then(createResources);
        };

        var showWarningsOrCreate = function(result){
          // Hide any previous notifications.
          hideErrorNotifications();
          // Now that all checks are completed, show any Alerts if we need to
          quotaAlerts = result.quotaAlerts || [];
          if ($scope.nameTaken || _.some(quotaAlerts, { type: 'error' })) {
            $scope.disableInputs = false;
            _.each(quotaAlerts, function(alert) {
              alert.id = _.uniqueId('create-builder-alert-');
              NotificationsService.addNotification(alert);
            });
          }
          else if (!_.isEmpty(quotaAlerts)) {
             launchConfirmationDialog(quotaAlerts);
             $scope.disableInputs = false;
          }
          else {
            createResources();
          }
        };

        $scope.projectDisplayName = function() {
          return displayNameFilter(this.project) || this.projectName;
        };

        $scope.createApp = function(){
          $scope.disableInputs = true;
          hideErrorNotifications();
          $scope.buildConfig.envVars = keyValueEditorUtils.compactEntries($scope.buildConfigEnvVars);
          $scope.deploymentConfig.envVars = keyValueEditorUtils.compactEntries($scope.DCEnvVarsFromUser);

          // Remove empty values and convert the label array to a map.
          $scope.labels = keyValueEditorUtils.mapEntries(keyValueEditorUtils.compactEntries($scope.labelArray));

          var resourceMap = ApplicationGenerator.generate($scope);
          //init tasks
          generatedResources = [];
          angular.forEach(resourceMap, function(value){
            if(value !== null){
              Logger.debug("Generated resource definition:", value);
              generatedResources.push(value);
            }
          });

          var nameTakenPromise = ApplicationGenerator.ifResourcesDontExist(generatedResources, $scope.projectName);
          var checkQuotaPromise = QuotaService.getLatestQuotaAlerts(generatedResources, context);
          // Don't want to wait for the name checks to finish before making the calls to quota
          // so kick off the requests above and then chain the promises here
          var setNameTaken = function(result) {
            $scope.nameTaken = result.nameTaken;
            return checkQuotaPromise;
          };
          nameTakenPromise.then(setNameTaken, setNameTaken).then(showWarningsOrCreate, showWarningsOrCreate);
        };
      }));

      $scope.cancel = function() {
        Navigate.toProjectOverview($scope.projectName);
      };
  });
