'use strict';

/**
 * @ngdoc function
 * @name openshiftConsole.controller:NewFromTemplateController
 * @description
 * # NewFromTemplateController
 * Controller of the openshiftConsole
 */
angular.module('openshiftConsole')
  .controller('NewFromTemplateController',
              function($filter,
                       $location,
                       $parse,
                       $routeParams,
                       $scope,
                       CachedTemplateService,
                       DataService,
                       Navigate,
                       NotificationsService,
                       ProjectsService) {
    var name = $routeParams.template;

    // If the namespace is not defined, that indicates that the processed Template should be obtained from the 'CachedTemplateService'
    var namespace = $routeParams.namespace || "";

    var dcContainers = $parse('spec.template.spec.containers');
    var builderImage = $parse('spec.strategy.sourceStrategy.from || spec.strategy.dockerStrategy.from || spec.strategy.customStrategy.from');
    var outputImage = $parse('spec.output.to');
    var imageObjectRef = $filter('imageObjectRef');

    if (!name) {
      Navigate.toErrorPage("Cannot create from template: a template name was not specified.");
      return;
    }

    $scope.breadcrumbs = [
      {
        title: "Add to Project",
        link: "project/" + $routeParams.project + "/create"
      },
      {
        title: "Catalog",
        link: "project/" + $routeParams.project + "/create?tab=fromCatalog"
      },
      {
        title: name
      }
    ];

    var getValidTemplateParamsMap = function() {
      try {
        return JSON.parse($routeParams.templateParamsMap);
      } catch (e) {
        NotificationsService.addNotification({
          id: "template-params-invalid-json",
          type: "error",
          message: "Could not prefill parameter values.",
          details: "The `templateParamsMap` URL parameter is not valid JSON. " + e
        });
      }
    };

    if ($routeParams.templateParamsMap) {
      $scope.prefillParameters = getValidTemplateParamsMap();
    }

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
          var builder = imageObjectRef(builderImage(item), namespace);
          if(builder) {
            images.push({
              name: builder,
              usesParameters: getParametersInImage(builder)
            });
          }
          var output = imageObjectRef(outputImage(item), namespace);
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
      images = _.uniqBy(images, 'name');
    }

    function getParameterValues() {
      var values = {};
      _.each($scope.template.parameters, function(parameter) {
        values[parameter.name] = parameter.value;
      });

      return values;
    }

    ProjectsService
      .get($routeParams.project)
      .then(_.spread(function(project) {
        $scope.project = project;

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
        } else {
          DataService.get("templates", name, {namespace: (namespace || $scope.project.metadata.name)}).then(
            function(template) {
              $scope.template = template;
              $scope.breadcrumbs[2].title = $filter('displayName')(template);
              findTemplateImages(template);
              var imageUsesParameters = function(image) {
                return !_.isEmpty(image.usesParameters);
              };

              if (_.some(images, imageUsesParameters)) {
                $scope.parameterDisplayNames = {};
                _.each(template.parameters, function(parameter) {
                  $scope.parameterDisplayNames[parameter.name] = parameter.displayName || parameter.name;
                });

                $scope.$watch('template.parameters', _.debounce(function() {
                  $scope.$apply(resolveParametersInImages);
                }, 50, { maxWait: 250 }), true);
              } else {
                $scope.templateImages = images;
              }
            },
            function() {
              Navigate.toErrorPage("Cannot create from template: the specified template could not be retrieved.");
            });
        }
      }));
  });
