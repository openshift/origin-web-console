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
                       ApplicationGenerator,
                       AuthorizationService,
                       DataService,
                       Navigate,
                       ProjectsService,
                       keyValueEditorUtils) {
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

        if (!AuthorizationService.canI('persistentvolumeclaims', 'create', $routeParams.project)) {
          Navigate.toErrorPage('You do not have authority to create persistent volume claims in project ' + $routeParams.project + '.', 'access_denied');
          return;
        }

        $scope.createPersistentVolumeClaim = function() {
          if ($scope.createPersistentVolumeClaimForm.$valid) {
            $scope.disableInputs = true;
            var claim = generatePersistentVolumeClaim();
            DataService.create('persistentvolumeclaims', null, claim, context)
              .then(function() { // Success
                _.set($scope, 'confirm.doneEditing', true);
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
            }
          }
        };

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
          pvc.metadata.annotations["volume.beta.kubernetes.io/storage-class"] = $scope.claim.storageClass.metadata.name;
        }

        return pvc;
        }

    }));
  });
