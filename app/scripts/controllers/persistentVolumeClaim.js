'use strict';

/**
 * @ngdoc function
 * @name openshiftConsole.controller:PersistentVolumeClaimController
 * @description
 * # StorageController
 * Controller of the openshiftConsole
 */
angular.module('openshiftConsole')
  .controller('PersistentVolumeClaimController', function (
    $filter,
    $scope,
    $routeParams,
    APIService,
    DataService,
    ProjectsService) {
    $scope.projectName = $routeParams.project;
    $scope.pvc = null;
    $scope.alerts = {};
    $scope.renderOptions = $scope.renderOptions || {};
    $scope.renderOptions.hideFilterWidget = true;
    $scope.breadcrumbs = [
      {
        title: "Storage",
        link: "project/" + $routeParams.project + "/browse/storage"
      },
      {
        title: $routeParams.pvc
      }
    ];

    $scope.pvcVersion = APIService.getPreferredVersion('persistentvolumeclaims');
    $scope.eventsVersion = APIService.getPreferredVersion('events');

    var watches = [];

    var pvcResolved = function(pvc, action) {
      $scope.pvc = pvc;
      $scope.loaded = true;
      if (action === "DELETED") {
        $scope.alerts["deleted"] = {
          type: "warning",
          message: "This persistent volume claim has been deleted."
        };
      }
    };

    ProjectsService
    .get($routeParams.project)
    .then(_.spread(function(project, context) {
      $scope.project = project;
      $scope.projectContext = context;
      DataService
        .get($scope.pvcVersion, $routeParams.pvc, context, { errorNotification: false })
        .then(function(pvc) {
          pvcResolved(pvc);
          watches.push(DataService.watchObject($scope.pvcVersion, $routeParams.pvc, context, pvcResolved));
        }, function(e) {
          $scope.loaded = true;
          $scope.alerts["load"] = {
            type: "error",
            message: "The persistent volume claim details could not be loaded.",
            details: $filter('getErrorDetails')(e)
          };
        });

      $scope.$on('$destroy', function(){
        DataService.unwatchAll(watches);
      });

    }));
});
