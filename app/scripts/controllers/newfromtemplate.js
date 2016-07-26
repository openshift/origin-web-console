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
    $q,
    $location,
    TaskList,
    $parse,
    Navigate,
    $filter,
    imageObjectRefFilter,
    failureObjectNameFilter,
    CachedTemplateService,
    keyValueEditorUtils,
    gettextCatalog) {


    var name = $routeParams.name;

    // If the namespace is not defined, that indicates that the processed Template should be obtained from the 'CachedTemplateService'
    var namespace = $routeParams.namespace || "";

    if (!name) {
      Navigate.toErrorPage(gettextCatalog.getString("Cannot create from template: a template name was not specified."));
      return;
    }

    $scope.emptyMessage = gettextCatalog.getString("Loading...");
    $scope.alerts = {};
    $scope.projectName = $routeParams.project;
    $scope.projectPromise = $.Deferred();
    $scope.labels = [];

    $scope.breadcrumbs = [
      {
        title: $scope.projectName,
        link: "project/" + $scope.projectName
      },
      {
        title: gettextCatalog.getString("Add to Project"),
        link: "project/" + $scope.projectName + "/create"
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

        function deploymentConfigImages(dc) {
          var images = [];
          var containers = dcContainers(dc);
          if (containers) {
            angular.forEach(containers, function(container) {
              var image = container.image;
              // If `container.image` is empty, look to see if it's set from an
              // image change trigger. Trim the string as some templates set
              // container image to " ".
              if (!_.trim(image)) {
                image = findImageFromTrigger(dc, container);
              }

              if (image) {
                images.push(image);
              }
            });
          }
          return images;
        }

        function imageItems(data) {
          var images = [];
          var dcImages = [];
          var outputImages = {};
          angular.forEach(data.objects, function(item) {
            if (item.kind === "BuildConfig") {
              var builder = imageObjectRefFilter(builderImage(item), $scope.projectName);
              if(builder) {
                images.push({ name: builder });
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
              images.push({ name: image });
            }
          });
          return images;
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

        $scope.createFromTemplate = function() {
          $scope.disableInputs = true;
          $scope.template.labels = keyValueEditorUtils.mapEntries(keyValueEditorUtils.compactEntries($scope.labels));
          DataService.create("processedtemplates", null, $scope.template, context).then(
            function(config) { // success
              var titles = {
                started: gettextCatalog.getString("Creating {{name}} in project {{project}}", {name: $scope.templateDisplayName(), project: $scope.projectDisplayName()}),
                success: gettextCatalog.getString("Created {{name}} in project {{project}}", {name: $scope.templateDisplayName(), project: $scope.projectDisplayName()}),
                failure: gettextCatalog.getString("Failed to create {{name}} in project {{project}}", {name: $scope.templateDisplayName(), project: $scope.projectDisplayName()})
              };

              // Cache template parameters and message so they can be displayed in the nexSteps page
              ProcessedTemplateService.setTemplateData(config.parameters, $scope.template.parameters, config.message);

              var helpLinks = getHelpLinks($scope.template);
              TaskList.clear();
              TaskList.add(titles, helpLinks, function() {
                var d = $q.defer();
                DataService.batch(config.objects, context).then(
                  function(result) {
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
                      alerts.push({ type: "success", message: gettextCatalog.getString("All items in template {{name}} were created successfully.", {name: $scope.templateDisplayName()})});
                    }
                    d.resolve({alerts: alerts, hasErrors: hasErrors});
                  }
                );
                return d.promise;
              });
              Navigate.toNextSteps($routeParams.name, $scope.projectName);
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
                  message: gettextCatalog.getString("An error occurred processing the template."),
                  details: details
                };
            }
          );
        };

        function setTemplateParams(labels) {
          $scope.templateImages = imageItems($scope.template);
          $scope.labels = _.map($scope.template.labels, function(value, key) {
            return {
              name: key,
              value: value
            };
          });
        }

        // Missing namespace indicates that the template should be received from from the 'CachedTemplateService'.
        // Otherwise get it via GET call.
        if (!namespace) {
          $scope.template = CachedTemplateService.getTemplate();
          // In case the template can be loaded from 'CachedTemaplteService', show an alert and disable "Create" button.
          if (_.isEmpty($scope.template)) {

            var redirect = URI('error').query({
              error: "not_found",
              error_description: gettextCatalog.getString("Template wasn't found in cache.")
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
            },
            function() {
              Navigate.toErrorPage(gettextCatalog.getString("Cannot create from template: the specified template could not be retrieved."));
            });
        }

    }));

  });
