'use strict';

/**
 * @ngdoc function
 * @name openshiftConsole.controller:CreatePersistentVolumeClaimController
 * @description
 * # CreatePersistentVolumeClaimController
 * Controller of the openshiftConsole
 */
angular.module('openshiftConsole')
  .controller('CreatePersistentVolumeClaimController',
              function($filter,
                       $routeParams,
                       $scope,
                       $window,
                       APIService,
                       ApplicationGenerator,
                       AuthorizationService,
                       DataService,
                       Navigate,
                       NotificationsService,
                       ProjectsService,
                       keyValueEditorUtils) {
    $scope.projectName = $routeParams.project;
    $scope.accessModes="ReadWriteOnce";
    $scope.claim = {};

    $scope.breadcrumbs = [
      {
        title: "Storage",
        link: "project/" + $scope.projectName + "/browse/storage"
      },
      {
        title: "Create Storage"
      }
    ];

    var pvcTemplate = {
      kind: "PersistentVolumeClaim",
      apiVersion: "v1",
      metadata: {
        name: undefined,
        labels: {},
        annotations: {}
      },
      spec: {
        resources: {
          requests:{}
        }
      }
    };
    var createPVCVersion = APIService.objectToResourceGroupVersion(pvcTemplate);

    var hideErrorNotifications = function() {
      NotificationsService.hideNotification("create-pvc-error");
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
        if (!AuthorizationService.canI(createPVCVersion, 'create', $routeParams.project)) {
          Navigate.toErrorPage('You do not have authority to create persistent volume claims in project ' + $routeParams.project + '.', 'access_denied');
          return;
        }

        $scope.createPersistentVolumeClaim = function() {
          hideErrorNotifications();
          if ($scope.createPersistentVolumeClaimForm.$valid) {
            $scope.disableInputs = true;
            var claim = generatePersistentVolumeClaim();
            DataService.create(createPVCVersion, null, claim, context)
              .then(function(claim) { // Success
                NotificationsService.addNotification({
                  type: "success",
                  message: "Persistent volume claim " + claim.metadata.name + " successfully created."
                });

                navigateBack();
              },
              function(result) { // Failure
                $scope.disableInputs = false;
                NotificationsService.addNotification({
                  id: "create-pvc-error",
                  type: "error",
                  message: "An error occurred requesting storage.",
                  details: $filter('getErrorDetails')(result)
                });
              });
          }
        };

      function generatePersistentVolumeClaim() {
        var pvc = angular.copy(pvcTemplate);
        pvc.metadata.name = $scope.claim.name;
        pvc.spec.accessModes = [$scope.claim.accessModes || "ReadWriteOnce"] ;
        var unit =  $scope.claim.unit || "Mi";
        pvc.spec.resources.requests.storage = $scope.claim.amount + unit;
        if ($scope.claim.selectedLabels) {
          var selectorLabel = keyValueEditorUtils.mapEntries( keyValueEditorUtils.compactEntries($scope.claim.selectedLabels) );
          if (!_.isEmpty(selectorLabel)) {
            _.set(pvc, 'spec.selector.matchLabels', selectorLabel);
          }
        }
        if ($scope.claim.storageClass && $scope.claim.storageClass.metadata.name !== "No Storage Class") {
          //we can only have one storage class per claim
          _.set(pvc, 'spec.storageClassName', $scope.claim.storageClass.metadata.name);
        }

        return pvc;
        }

    }));
  });
