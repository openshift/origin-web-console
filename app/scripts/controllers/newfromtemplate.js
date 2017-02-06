'use strict';
/* jshint unused: false */

/**
 * @ngdoc function
 * @name openshiftConsole.controller:NewFromTemplateController
 * @description
 * # NewFromTemplateController
 * Controller of the openshiftConsole
 */
angular.module('openshiftConsole')
  .controller('NewFromTemplateController', function (
    $scope,
    $http,
    $routeParams,
    DataService,
    ProcessedTemplateService,
    AlertMessageService,
    ProjectsService,
    QuotaService,
    $q,
    $location,
    TaskList,
    $parse,
    Navigate,
    $filter,
    $uibModal,
    imageObjectRefFilter,
    failureObjectNameFilter,
    CachedTemplateService,
    keyValueEditorUtils,
    Constants) {

    var name = $routeParams.template;

    // If the namespace is not defined, that indicates that the processed Template should be obtained from the 'CachedTemplateService'
    var namespace = $routeParams.namespace || "";

    if (!name) {
      Navigate.toErrorPage("Cannot create from template: a template name was not specified.");
      return;
    }

    $scope.alerts = {};
    $scope.quotaAlerts = {};
    $scope.projectName = $routeParams.project;
    $scope.projectPromise = $.Deferred();
    $scope.labels = [];
    $scope.systemLabels = [];

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
        title: "Catalog",
        link: "project/" + $scope.projectName + "/create?tab=fromCatalog"
      },
      {
        title: name
      }
    ];

    $scope.alerts = $scope.alerts || {};
    AlertMessageService.getAlerts().forEach(function(alert) {
      $scope.alerts[alert.name] = alert.data;
    });
    AlertMessageService.clearAlerts();

    var displayNameFilter = $filter('displayName');
    var humanize = $filter('humanize');

    var dcContainers = $parse('spec.template.spec.containers');
    var builderImage = $parse('spec.strategy.sourceStrategy.from || spec.strategy.dockerStrategy.from || spec.strategy.customStrategy.from');
    var outputImage = $parse('spec.output.to');

    var getValidTemplateParamsMap = function () {
      try {
        return JSON.parse($routeParams.templateParamsMap);
      }
      catch (e) {
        $scope.alerts.invalidTemplateParams = {
          type: "error",
          message: "The templateParamsMap is not valid JSON. " + e
        };
      }
    };

    ProjectsService
      .get($routeParams.project)
      .then(_.spread(function(project, context) {
        $scope.project = project;
        // Update project breadcrumb with display name.
        $scope.breadcrumbs[0].title = $filter('displayName')(project);

        function findImageFromTrigger(dc, container) {
          var triggers = _.get(dc, 'spec.triggers', []);
          // Find an image change trigger whose container name matches.
          var matchingTrigger = _.find(triggers, function(trigger) {
            if (trigger.type !== 'ImageChange') {
              return false;
            }

            var containerNames = _.get(trigger, 'imageChangeParams.containerNames', []);
            return _.includes(containerNames, container.name);
          });

          return _.get(matchingTrigger, 'imageChangeParams.from.name');
        }

        // Test for variable expressions like ${MY_PARAMETER} in the image.
        var TEMPLATE_VARIABLE_EXPRESSION = /\${([a-zA-Z0-9\_]+)}/g;
        function getParametersInImage(image) {
          var parameters = [];
          var match = TEMPLATE_VARIABLE_EXPRESSION.exec(image);
          while (match) {
            parameters.push(match[1]);
            match = TEMPLATE_VARIABLE_EXPRESSION.exec(image);
          }

          return parameters;
        }

        function getParameterValues() {
          var values = {};
          _.each($scope.template.parameters, function(parameter) {
            values[parameter.name] = parameter.value;
          });

          return values;
        }

        var images = [];
        function resolveParametersInImages() {
          var values = getParameterValues();
          $scope.templateImages = _.map(images, function(image) {
            if (_.isEmpty(image.usesParameters)) {
              return image;
            }

            var template = _.template(image.name, { interpolate: TEMPLATE_VARIABLE_EXPRESSION });
            return {
              name: template(values),
              usesParameters: image.usesParameters
            };
          });
        }

        function deploymentConfigImages(dc) {
          var dcImages = [];
          var containers = dcContainers(dc);
          if (containers) {
            angular.forEach(containers, function(container) {
              var image = container.image;
              // Look to see if `container.image` is set from an image change trigger.
              var imageFromTrigger = findImageFromTrigger(dc, container);
              if (imageFromTrigger) {
                image = imageFromTrigger;
              }

              if (image) {
                dcImages.push(image);
              }
            });
          }

          return dcImages;
        }

        function findTemplateImages(data) {
          images = [];
          var dcImages = [];
          var outputImages = {};
          angular.forEach(data.objects, function(item) {
            if (item.kind === "BuildConfig") {
              var builder = imageObjectRefFilter(builderImage(item), $scope.projectName);
              if(builder) {
                images.push({
                  name: builder,
                  usesParameters: getParametersInImage(builder)
                });
              }
              var output = imageObjectRefFilter(outputImage(item), $scope.projectName);
              if (output) {
                outputImages[output] = true;
              }
            }
            if (item.kind === "DeploymentConfig") {
              dcImages = dcImages.concat(deploymentConfigImages(item));
            }
          });
          dcImages.forEach(function(image) {
            if (!outputImages[image]) {
              images.push({
                name: image,
                usesParameters: getParametersInImage(image)
              });
            }
          });
          images = _.uniq(images, false, 'name');
        }

        function getHelpLinks(template) {
          var helpLinkName = /^helplink\.(.*)\.title$/;
          var helpLinkURL = /^helplink\.(.*)\.url$/;
          var helpLinks = {};
          for (var attr in template.annotations) {
            var match = attr.match(helpLinkName);
            var link;
            if (match) {
              link = helpLinks[match[1]] || {};
              link.title = template.annotations[attr];
              helpLinks[match[1]] = link;
            }
            else {
              match = attr.match(helpLinkURL);
              if (match) {
                link = helpLinks[match[1]] || {};
                link.url = template.annotations[attr];
                helpLinks[match[1]] = link;
              }
            }
          }
          return helpLinks;
        }

        $scope.projectDisplayName = function() {
          return displayNameFilter(this.project) || this.projectName;
        };

        $scope.templateDisplayName = function() {
          return displayNameFilter(this.template);
        };

        var processedResources;
        var createResources = function() {
          var titles = {
            started: "Creating " + $scope.templateDisplayName() + " in project " + $scope.projectDisplayName(),
            success: "Created " + $scope.templateDisplayName() + " in project " + $scope.projectDisplayName(),
            failure: "Failed to create " + $scope.templateDisplayName() + " in project " + $scope.projectDisplayName()
          };
          var helpLinks = getHelpLinks($scope.template);
          TaskList.clear();
          TaskList.add(titles, helpLinks, $routeParams.project, function() {
            var d = $q.defer();
            DataService.batch(processedResources, context).then(
              function(result) {
                var alerts = [];
                var hasErrors = false;
                if (result.failure.length > 0) {
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
                  alerts.push({ type: "success", message: "All items in template " + $scope.templateDisplayName() +
                    " were created successfully."});
                }
                d.resolve({alerts: alerts, hasErrors: hasErrors});
              }
            );
            return d.promise;
          });
          Navigate.toNextSteps(name, $scope.projectName);
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

        var showWarningsOrCreate = function(result) {
          // Now that all checks are completed, show any Alerts if we need to
          var quotaAlerts = result.quotaAlerts || [];
          var errorAlerts = _.filter(quotaAlerts, {type: 'error'});
          if (errorAlerts.length) {
            $scope.disableInputs = false;
            $scope.quotaAlerts = quotaAlerts;
          }
          else if (quotaAlerts.length) {
             launchConfirmationDialog(quotaAlerts);
             $scope.disableInputs = false;
          }
          else {
            createResources();
          }
        };

        $scope.createFromTemplate = function() {
          $scope.disableInputs = true;
          var userLabels = keyValueEditorUtils.mapEntries(keyValueEditorUtils.compactEntries($scope.labels));
          var systemLabels = keyValueEditorUtils.mapEntries(keyValueEditorUtils.compactEntries($scope.systemLabels));
          $scope.template.labels = _.extend(systemLabels, userLabels);

          DataService.create("processedtemplates", null, $scope.template, context).then(
            function(config) { // success
              // Cache template parameters and message so they can be displayed in the nexSteps page
              ProcessedTemplateService.setTemplateData(config.parameters, $scope.template.parameters, config.message);
              processedResources = config.objects;

              QuotaService.getLatestQuotaAlerts(processedResources, context).then(showWarningsOrCreate);
            },
            function(result) { // failure
              $scope.disableInputs = false;
              var details;
              if (result.data && result.data.message) {
                details = result.data.message;
              }
              $scope.alerts["process"] =
                {
                  type: "error",
                  message: "An error occurred processing the template.",
                  details: details
                };
            }
          );
        };

        var shouldAddAppLabel = function() {
          // If the template defines its own app label, we don't need to add one at all
          if (_.get($scope.template, 'labels.app')) {
            return false;
          }

          // Otherwise check if an object in the template has an app label defined
          return !_.some($scope.template.objects, "metadata.labels.app");
        };

        function setTemplateParams(labels) {
          $scope.parameterDisplayNames = {};
          _.each($scope.template.parameters, function(parameter) {
            $scope.parameterDisplayNames[parameter.name] = parameter.displayName || parameter.name;
          });

          if($routeParams.templateParamsMap) {
            var templateParams = getValidTemplateParamsMap();
            _.each($scope.template.parameters, function(parameter) {
              if (templateParams[parameter.name]) {
                parameter.value = templateParams[parameter.name];
              }
            });
          }

          findTemplateImages($scope.template);
          var imageUsesParameters = function(image) {
            return !_.isEmpty(image.usesParameters);
          };
          if (_.some(images, imageUsesParameters)) {
            $scope.$watch('template.parameters', _.debounce(function(parameters) {
              $scope.$apply(resolveParametersInImages);
            }, 50, { maxWait: 250 }), true);
          } else {
            $scope.templateImages = images;
          }

          $scope.systemLabels = _.map($scope.template.labels, function(value, key) {
            return {
              name: key,
              value: value
            };
          });

          if (shouldAddAppLabel()) {
            $scope.systemLabels.push({
              name: 'app',
              value: $scope.template.metadata.name
            });
          }
        }

        // Missing namespace indicates that the template should be received from from the 'CachedTemplateService'.
        // Otherwise get it via GET call.
        if (!namespace) {
          $scope.template = CachedTemplateService.getTemplate();
          // In case the template can be loaded from 'CachedTemaplteService', show an alert and disable "Create" button.
          if (_.isEmpty($scope.template)) {

            var redirect = URI('error').query({
              error: "not_found",
              error_description: "Template wasn't found in cache."
            }).toString();
            $location.url(redirect);
          }
          CachedTemplateService.clearTemplate();
          setTemplateParams();
        } else {
          DataService.get("templates", name, {namespace: (namespace || $scope.projectName)}).then(
            function(template) {
              $scope.template = template;
              setTemplateParams();
              $scope.breadcrumbs[3].title = $filter('displayName')(template);
            },
            function() {
              Navigate.toErrorPage("Cannot create from template: the specified template could not be retrieved.");
            });
        }

    }));

  });
