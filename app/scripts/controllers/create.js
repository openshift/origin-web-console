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
                                            CatalogService,
                                            Constants,
                                            DataService,
                                            LabelFilter,
                                            Logger,
                                            ProjectsService) {
    $scope.projectName = $routeParams.project;

    $scope.categories = Constants.CATALOG_CATEGORIES;

    $scope.alerts = $scope.alerts || {};

    $scope.breadcrumbs = [
      {
        title: "Add to Project"
      }
    ];

    ProjectsService
      .get($routeParams.project)
      .then(_.spread(function(project, context) {
        $scope.project = project;
        $scope.context = context;

        // List image streams and templates in the both the shared `openshift`
        // namespace and the project namespace.
        DataService.list("imagestreams", {namespace: "openshift"}).then(function(resp) {
            $scope.openshiftImageStreams = resp.by("metadata.name");
          });

        // Request only the template metadata. Otherwise the response contains all of the object definitions, which can be megabytes of data.
        DataService.list("templates", {namespace: "openshift"}, null, {partialObjectMetadataList: true}).then(function(resp) {
            $scope.openshiftTemplates = resp.by("metadata.name");
          });

        // If the current namespace is `openshift`, don't request the same
        // templates and image streams again.
        if ($routeParams.project === 'openshift') {
          $scope.projectImageStreams = [];
          $scope.projectTemplates = [];
        } else {
          DataService.list("imagestreams", context).then(function(resp) {
              $scope.projectImageStreams = resp.by("metadata.name");
            });

          DataService.list("templates", context, null, {partialObjectMetadataList: true}).then(function(resp) {
              $scope.projectTemplates = resp.by("metadata.name");
            });
        }
      }));
  });
