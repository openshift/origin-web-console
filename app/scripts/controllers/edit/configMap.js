'use strict';

/**
 * @ngdoc function
 * @name openshiftConsole.controller:EditConfigMapController
 * @description
 * # EditConfigMapController
 * Controller of the openshiftConsole
 */
angular.module('openshiftConsole')
  .controller('EditConfigMapController',
              function ($filter,
                        $routeParams,
                        $scope,
                        $window,
                        DataService,
                        BreadcrumbsService,
                        Navigate,
                        NotificationsService,
                        ProjectsService) {
    var watches = [];
    $scope.forms = {};
    $scope.projectName = $routeParams.project;

    $scope.breadcrumbs = BreadcrumbsService.getBreadcrumbs({
      name: $routeParams.configMap,
      kind: 'ConfigMap',
      namespace: $routeParams.project,
      subpage: 'Edit Config Map'
    });

    var getVersion = function(resource) {
      return _.get(resource, 'metadata.resourceVersion');
    };

    var hideErrorNotifications = function() {
      NotificationsService.hideNotification("edit-config-map-error");
    };

    var navigateBack = function() {
      $window.history.back();
    };
    $scope.cancel = navigateBack;

    ProjectsService
      .get($routeParams.project)
      .then(_.spread(function(project, context) {
        DataService
          .get("configmaps", $routeParams.configMap, context, { errorNotification: false })
          .then(function(configMap) {
            $scope.loaded = true;
            $scope.breadcrumbs = BreadcrumbsService.getBreadcrumbs({
              name: $routeParams.configMap,
              object: configMap,
              project: project,
              subpage: 'Edit Config Map'
            });
            $scope.configMap = configMap;
            watches.push(DataService.watchObject("configmaps", $routeParams.configMap, context, function(newValue, action) {
              $scope.resourceChanged = getVersion(newValue) !== getVersion($scope.configMap);
              $scope.resourceDeleted = action === "DELETED";
            }));
          }, function(e) {
            Navigate.toErrorPage("Could not load config map " + $routeParams.configMap + ". " +
                                 $filter('getErrorDetails')(e));
          });

        $scope.updateConfigMap = function() {
          if ($scope.forms.editConfigMapForm.$valid) {
            hideErrorNotifications();
            $scope.disableInputs = true;

            DataService.update('configmaps', $scope.configMap.metadata.name, $scope.configMap, context)
              .then(function() { // Success
                NotificationsService.addNotification({
                  type: "success",
                  message: "Config map " + $scope.configMap.metadata.name + " successfully updated."
                });
                navigateBack();
              }, function(result) { // Failure
                $scope.disableInputs = false;
                NotificationsService.addNotification({
                  id: "edit-config-map-error",
                  type: "error",
                  message: "An error occurred updating the config map.",
                  details: $filter('getErrorDetails')(result)
                });
              });
          }
        };

        $scope.$on('$destroy', function(){
          DataService.unwatchAll(watches);
          hideErrorNotifications();
        });
    }));
  });
