'use strict';

/**
 * @ngdoc function
 * @name openshiftConsole.controller:CreateConfigMapController
 * @description
 * # CreateConfigMapController
 * Controller of the openshiftConsole
 */
angular.module('openshiftConsole')
  .controller('CreateConfigMapController',
              function ($filter,
                        $routeParams,
                        $scope,
                        $window,
                        APIService,
                        AuthorizationService,
                        DataService,
                        Navigate,
                        NotificationsService,
                        ProjectsService,
                        gettextCatalog) {
    $scope.projectName = $routeParams.project;

    // TODO: Update BreadcrumbsService to handle create pages.
    $scope.breadcrumbs = [
      {
         title: gettextCatalog.getString("Config Maps"),
         link: "project/" + $scope.projectName + "/browse/config-maps"
      },
      {
        title: gettextCatalog.getString("Create Config Map")
      }
    ];

    var hideErrorNotifications = function() {
      NotificationsService.hideNotification("create-config-map-error");
    };
    $scope.$on('$destroy', hideErrorNotifications);

    var navigateBack = function() {
      $window.history.back();
    };
    $scope.cancel = navigateBack;

    ProjectsService
      .get($routeParams.project)
      .then(_.spread(function(project, context) {
        $scope.project = project;

        if (!AuthorizationService.canI('configmaps', 'create', $routeParams.project)) {
          Navigate.toErrorPage(gettextCatalog.getString('You do not have authority to create config maps in project {{project}}.', {project: $routeParams.project}), 'access_denied');
          return;
        }

        $scope.configMap = {
          apiVersion: 'v1',
          kind: 'ConfigMap',
          metadata: {
            namespace: $routeParams.project
          },
          data: {}
        };

        $scope.createConfigMap = function() {
          if ($scope.createConfigMapForm.$valid) {
            hideErrorNotifications();
            $scope.disableInputs = true;
            var createConfigMapVersion = APIService.objectToResourceGroupVersion($scope.configMap);
            DataService.create(createConfigMapVersion, null, $scope.configMap, context)
              .then(function() { // Success
                NotificationsService.addNotification({
                  type: "success",
                  message: gettextCatalog.getString("Config map {{name}} successfully created.", {name: $scope.configMap.metadata.name})
                });
                // Return to the previous page.
                navigateBack();
              }, function(result) { // Failure
                $scope.disableInputs = false;
                NotificationsService.addNotification({
                  id: "create-config-map-error",
                  type: "error",
                  message: gettextCatalog.getString("An error occurred creating the config map."),
                  details: $filter('getErrorDetails')(result)
                });
              });
          }
        };
    }));
  });
