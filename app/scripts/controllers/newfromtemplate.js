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
                       $routeParams,
                       $scope,
                       AlertMessageService,
                       CachedTemplateService,
                       DataService,
                       Navigate,
                       ProjectsService) {
    var name = $routeParams.template;

    // If the namespace is not defined, that indicates that the processed Template should be obtained from the 'CachedTemplateService'
    var namespace = $routeParams.namespace || "";

    if (!name) {
      Navigate.toErrorPage("Cannot create from template: a template name was not specified.");
      return;
    }

    $scope.alerts = {};
    $scope.precheckAlerts = {};

    $scope.breadcrumbs = [
      {
        title: $routeParams.project,
        link: "project/" + $routeParams.project
      },
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

    $scope.alerts = $scope.alerts || {};
    AlertMessageService.getAlerts().forEach(function(alert) {
      $scope.alerts[alert.name] = alert.data;
    });
    AlertMessageService.clearAlerts();

    var displayName = $filter('displayName');
    var getValidTemplateParamsMap = function() {
      try {
        return JSON.parse($routeParams.templateParamsMap);
      } catch (e) {
        $scope.alerts.invalidTemplateParams = {
          type: "error",
          message: "The templateParamsMap is not valid JSON. " + e
        };
      }
    };

    if($routeParams.templateParamsMap) {
      $scope.prefillParameters = getValidTemplateParamsMap();
    }

    ProjectsService
      .get($routeParams.project)
      .then(_.spread(function(project) {
        $scope.project = project;
        // Update project breadcrumb with display name.
        $scope.breadcrumbs[0].title = displayName(project);

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
              $scope.breadcrumbs[3].title = $filter('displayName')(template);
            },
            function() {
              Navigate.toErrorPage("Cannot create from template: the specified template could not be retrieved.");
            });
        }
      }));
  });
