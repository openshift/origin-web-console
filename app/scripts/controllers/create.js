'use strict';

/**
 * @ngdoc function
 * @name openshiftConsole.controller:CreateController
 * @description
 * # CreateController
 * Controller of the openshiftConsole
 */
angular.module('openshiftConsole')
  .controller('CreateController', function ($scope,
                                            $filter,
                                            $location,
                                            $q,
                                            $routeParams,
                                            $uibModal,
                                            AlertMessageService,
                                            CatalogService,
                                            Constants,
                                            DataService,
                                            LabelFilter,
                                            Logger,
                                            ProjectsService) {
    $scope.projectName = $routeParams.project;

    $scope.categories = Constants.CATALOG_CATEGORIES;

    $scope.alerts = $scope.alerts || {};

    AlertMessageService.getAlerts().forEach(function(alert) {
      $scope.alerts[alert.name] = alert.data;
    });
    AlertMessageService.clearAlerts();

    $scope.breadcrumbs = [
      {
        title: $scope.projectName,
        link: "project/" + $scope.projectName
      },
      {
        title: "Add to Project"
      }
    ];

    ProjectsService
      .get($routeParams.project)
      .then(_.spread(function(project, context) {
        $scope.project = project;
        $scope.context = context;
        // Update project breadcrumb with display name.
        $scope.breadcrumbs[0].title = $filter('displayName')(project);
        // List templates in the project namespace as well as the shared `openshift` namespace.
        DataService.list("templates", context, function(templates) {
          $scope.projectTemplates = templates.by('metadata.name');
        });

        DataService.list("templates", {namespace: "openshift"}, function(templates) {
          $scope.openshiftTemplates = templates.by("metadata.name");
        });

        // List image streams in the project namespace as well as the shared `openshift` namespace.
        DataService.list("imagestreams", context, function(imageStreams) {
          $scope.projectImageStreams = imageStreams.by("metadata.name");
        });

        DataService.list("imagestreams", {namespace: "openshift"}, function(imageStreams) {
          $scope.openshiftImageStreams = imageStreams.by("metadata.name");
        });
      }));
  });
