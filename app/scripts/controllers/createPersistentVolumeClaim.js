'use strict';

/**
 * @ngdoc function
 * @name openshiftConsole.controller:CreatePersistentVolumeClaimController
 * @description
 * # CreatePersistentVolumeClaimController
 * Controller of the openshiftConsole
 */
angular.module('openshiftConsole')
  .controller('CreatePersistentVolumeClaimController', function ($filter, $routeParams, $scope, $window, ApplicationGenerator, DataService, Navigate, ProjectsService,keyValueEditorUtils) {
    $scope.alerts = {};
    $scope.projectName = $routeParams.project;
    $scope.accessModes="ReadWriteOnce";
    $scope.claim = {};

    $scope.breadcrumbs = [
      {
        title: $scope.projectName,
        link: "project/" + $scope.projectName
      },
      {
        title: "Storage",
        link: "project/" + $scope.projectName + "/browse/storage"
      },
      {
        title: "Create Storage"
      }
    ];

    ProjectsService
      .get($routeParams.project)
      .then(_.spread(function(project, context) {
        $scope.project = project;
        // Update project breadcrumb with display name.
        $scope.breadcrumbs[0].title = $filter('displayName')(project);

        $scope.createPersistentVolumeClaim = function() {
          if ($scope.createPersistentVolumeClaimForm.$valid) {
            $scope.disableInputs = true;
            var claim = generatePersistentVolumeClaim();
            DataService.create('persistentvolumeclaims', null, claim, context)
              .then(function() { // Success
                // Return to the previous page
                $window.history.back();
              },
              function(result) { // Failure
                $scope.disableInputs = false;
                $scope.alerts['create-persistent-volume-claim'] = {
                    type: "error",
                    message: "An error occurred requesting storage claim.",
                    details: $filter('getErrorDetails')(result)
                };
              });
          }
        };

      function generatePersistentVolumeClaim() {
        var pvc = {
          kind: "PersistentVolumeClaim",
          apiVersion: "v1",
          metadata: {
            name: $scope.claim.name,
            labels: {},
            annotations: {}
          },
          spec: {
            resources: {
              requests:{}
            },
              selector:{
                matchLabels:{}
            }
          }
        };

          pvc.spec.accessModes = [$scope.claim.accessModes || "ReadWriteOnce"] ;
          var unit =  $scope.claim.unit || "Mi";
          pvc.spec.resources.requests.storage = $scope.claim.amount + unit;
          if ($scope.claim.selectedLabels) {
            pvc.spec.selector.matchLabels = keyValueEditorUtils.mapEntries( keyValueEditorUtils.compactEntries($scope.claim.selectedLabels) );
          }
          else {
            pvc.spec.selector = {};
          }
          if ($scope.claim.storageClass ) {
            //we can only have one storage class per claim
            pvc.metadata.annotations["volume.beta.kubernetes.io/storage-class"] = $scope.claim.storageClass.metadata.name;
          }

          return pvc;
        }

    }));
  });
