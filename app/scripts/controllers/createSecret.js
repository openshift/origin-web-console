'use strict';

/**
 * @ngdoc function
 * @name openshiftConsole.controller:CreateSecretController
 * @description
 * # CreateSecretController
 * Controller of the openshiftConsole
 */
angular.module('openshiftConsole')
  .controller('CreateSecretController',
              function($filter,
                       $location,
                       $routeParams,
                       $scope,
                       $window,
                       ApplicationGenerator,
                       AuthorizationService,
                       DataService,
                       Navigate,
                       ProjectsService,
                       gettextCatalog) {
    $scope.alerts = {};
    $scope.projectName = $routeParams.project;

    $scope.breadcrumbs = [
      {
         title: gettextCatalog.getString("Secrets"),
         link: "project/" + $scope.projectName + "/browse/secrets"
      },
      {
        title: gettextCatalog.getString("Create Secret")
      }
    ];

    ProjectsService
      .get($routeParams.project)
      .then(_.spread(function(project, context) {
        $scope.project = project;
        $scope.context = context;

        if (!AuthorizationService.canI('secrets', 'create', $routeParams.project)) {
          Navigate.toErrorPage(gettextCatalog.getString('You do not have authority to create secrets in project {{project}}.', {project: $routeParams.project}), 'access_denied');
          return;
        }

        $scope.navigateBack = function() {
          if ($routeParams.then) {
            $location.url($routeParams.then);
            return;
          }

          $window.history.back();
        };
    }));
  });
