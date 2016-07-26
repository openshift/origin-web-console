"use strict";

angular.module("openshiftConsole")
  .controller("CreateFromImageController", function ($scope,
      Logger,
      $q,
      $routeParams,
      APIService,
      DataService,
      ProjectsService,
      Navigate,
      ApplicationGenerator,
      LimitRangesService,
      MetricsService,
      HPAService,
      TaskList,
      failureObjectNameFilter,
      $filter,
      $parse,
      SOURCE_URL_PATTERN,
      keyValueEditorUtils,
      gettextCatalog
    ){
    var displayNameFilter = $filter('displayName');
    var humanize = $filter('humanize');

    $scope.projectName = $routeParams.project;
    $scope.sourceURLPattern = SOURCE_URL_PATTERN;
    var imageName = $routeParams.imageName;

    $scope.breadcrumbs = [
      {
        title: $scope.projectName,
        link: "project/" + $scope.projectName
      },
      {
        title: "Add to Project",
        link: "project/" + $scope.projectName + "/create"
      },
      {
        title: imageName
      }
    ];

    ProjectsService
      .get($routeParams.project)
      .then(_.spread(function(project, context) {
        $scope.project = project;
        // Update project breadcrumb with display name.
        $scope.breadcrumbs[0].title = $filter('displayName')(project);
        function initAndValidate(scope){

          if(!imageName){
            Navigate.toErrorPage(gettextCatalog.getString("Cannot create from source: a base image was not specified"));
          }
          if(!$routeParams.imageTag){
            Navigate.toErrorPage(gettextCatalog.getString("Cannot create from source: a base image tag was not specified"));
          }

          scope.emptyMessage = gettextCatalog.getString("Loading...");
          scope.imageName = imageName;
          scope.imageTag = $routeParams.imageTag;
          scope.namespace = $routeParams.namespace;
          scope.buildConfig = {
            buildOnSourceChange: true,
            buildOnImageChange: true,
            buildOnConfigChange: true
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
          scope.labels = [];
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
          };

          scope.usingSampleRepo = function() {
            return scope.buildConfig.sourceUrl === _.get(scope, 'image.metadata.annotations.sampleRepo');
          };

          // Warn if metrics aren't configured when setting autoscaling options.
          MetricsService.isAvailable().then(function(available) {
            $scope.metricsWarning = !available;
          });

          DataService.get("imagestreams", scope.imageName, {namespace: (scope.namespace || $routeParams.project)}).then(function(imageStream){
              scope.imageStream = imageStream;
              var imageName = scope.imageTag;
              DataService.get("imagestreamtags", imageStream.metadata.name + ":" + imageName, {namespace: scope.namespace}).then(function(imageStreamTag){
                  scope.image = imageStreamTag.image;
                  scope.DCEnvVarsFromImage = _.map(
                                              _.get(imageStreamTag, 'image.dockerImageMetadata.Config.Env'),
                                              function(entry) {
                                                var pair = entry.split('=');
                                                return {
                                                  name: _.head(pair),
                                                  value:_.last(pair)
                                                };
                                              });
                  var ports = ApplicationGenerator.parsePorts(imageStreamTag.image);
                  if (ports.length === 0) {
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
                    Navigate.toErrorPage(gettextCatalog.getString("Cannot create from source: the specified image could not be retrieved."));
                  }
                );
            },
            function(){
              Navigate.toErrorPage(gettextCatalog.getString("Cannot create from source: the specified image could not be retrieved."));
            });
        }

        var validatePodLimits = function() {
          if (!$scope.hideCPU) {
            $scope.cpuProblems = LimitRangesService.validatePodLimits($scope.limitRanges, 'cpu', [$scope.container], project);
          }
          $scope.memoryProblems = LimitRangesService.validatePodLimits($scope.limitRanges, 'memory', [$scope.container], project);
        };

        DataService.list("limitranges", context, function(limitRanges) {
          $scope.limitRanges = limitRanges.by("metadata.name");
          if ($filter('hashSize')(limitRanges) !== 0) {
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

        $scope.$watch('scaling.autoscale', checkCPURequest);
        $scope.$watch('container', checkCPURequest, true);

        initAndValidate($scope);

        var ifResourcesDontExist = function(apiObjects, namespace){
          var result = $q.defer();
          var successResults = [];
          var failureResults = [];
          var remaining = apiObjects.length;

          function _checkDone() {
            if (remaining === 0) {
              if(successResults.length > 0){
                //means some resources exist with the given nanme
                result.reject(successResults);
              }
              else {
                //means no resources exist with the given nanme
                result.resolve(apiObjects);
              }
            }
          }

          apiObjects.forEach(function(apiObject) {
            var resource = APIService.objectToResourceGroupVersion(apiObject);
            if (!resource) {
              failureResults.push({data: {message: APIService.invalidObjectKindOrVersion(apiObject)}});
              remaining--;
              _checkDone();
              return;
            }
            if (!APIService.apiInfo(resource)) {
              failureResults.push({data: {message: APIService.unsupportedObjectKindOrVersion(apiObject)}});
              remaining--;
              _checkDone();
              return;
            }
            DataService.get(resource, apiObject.metadata.name, {namespace: (namespace || $routeParams.project)}, {errorNotification: false}).then(
              function (data) {
                successResults.push(data);
                remaining--;
                _checkDone();
              },
              function (data) {
                failureResults.push(data);
                remaining--;
                _checkDone();
              }
            );
          });
          return result.promise;
        };

        var createResources = function(resources){
          var titles = {
            started: gettextCatalog.getString("Creating application {{name}} in project {{project}}", {name: $scope.name, project: $scope.projectDisplayName()}),
            success: gettextCatalog.getString("Created application {{name}} in project {{project}}", {name: $scope.name, project: $scope.projectDisplayName()}),
            failure: gettextCatalog.getString("Failed to create {{name}} in project {{project}}", {name: $scope.name, project: $scope.projectDisplayName()})
          };
          var helpLinks = {};

          TaskList.clear();
          TaskList.add(titles, helpLinks, function(){
            var d = $q.defer();
            DataService.batch(resources, context)
              //refactor these helpers to be common for 'newfromtemplate'
              .then(function(result) {
                    var alerts = [];
                    var hasErrors = false;
                    if (result.failure.length > 0) {
                      hasErrors = true;
                      result.failure.forEach(
                        function(failure) {
                          alerts.push({
                            type: "error",
                            message: gettextCatalog.getString("Cannot create {{kind}} \"{{name}}\". ", {kind: humanize(failure.object.kind).toLowerCase(), name: failure.object.metadata.name}),
                            details: failure.data.message
                          });
                        }
                      );
                      result.success.forEach(
                        function(success) {
                          alerts.push({
                            type: "success",
                            message: gettextCatalog.getString("Created {{kind}} \"{{name}}\" successfully. ", {kind: humanize(success.kind).toLowerCase(), name: success.metadata.name})
                          });
                        }
                      );
                    } else {
                      alerts.push({ type: "success", message: gettextCatalog.getString("All resources for application {{name}} were created successfully.", {name: $scope.name})});
                    }
                    d.resolve({alerts: alerts, hasErrors: hasErrors});
                  }
                );
                return d.promise;
              },
              function(result) { // failure
                $scope.alerts["create"] =
                  {
                    type: "error",
                    message: gettextCatalog.getString("An error occurred creating the application."),
                    details: gettextCatalog.getString("Status: {{status}}. {{data}}", {status: result.status, data: result.data})
                  };
              }
            );
          Navigate.toNextSteps($scope.name, $scope.projectName, $scope.usingSampleRepo() ? {"fromSample": true} : null);
        };

        var elseShowWarning = function(){
          $scope.nameTaken = true;
          $scope.disableInputs = false;
        };

        $scope.projectDisplayName = function() {
          return displayNameFilter(this.project) || this.projectName;
        };

        $scope.createApp = function(){
          $scope.disableInputs = true;
          $scope.buildConfig.envVars = keyValueEditorUtils.mapEntries(keyValueEditorUtils.compactEntries($scope.buildConfigEnvVars));
          $scope.deploymentConfig.envVars = keyValueEditorUtils.mapEntries(keyValueEditorUtils.compactEntries($scope.DCEnvVarsFromUser));
          $scope.labels = keyValueEditorUtils.mapEntries(keyValueEditorUtils.compactEntries($scope.labels));

          var resourceMap = ApplicationGenerator.generate($scope);
          //init tasks
          var resources = [];
          angular.forEach(resourceMap, function(value){
            if(value !== null){
              Logger.debug("Generated resource definition:", value);
              resources.push(value);
            }
          });

          ifResourcesDontExist(resources, $scope.projectName, $scope)
            .then(createResources, elseShowWarning);
        };
      }));
  });
