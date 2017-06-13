'use strict';

/**
 * @ngdoc function
 * @name openshiftConsole.controller:EditProjectController
 * @description
 * # EditProjectController
 * Controller of the openshiftConsole
 */
angular.module('openshiftConsole')
  .controller('EditProjectController', function ($scope,
                                                 $routeParams,
                                                 $filter,
                                                 $location,
                                                 DataService,
                                                 ProjectsService,
                                                 Navigate) {
    $scope.alerts = {};

    var annotation = $filter('annotation');
    var annotationName = $filter('annotationName');

    ProjectsService
      .get($routeParams.project)
      .then(_.spread(function(project) {

        var editableFields = function(resource) {
          return {
            description: annotation(resource, 'description'),
            displayName: annotation(resource, 'displayName')
          };
        };

        var mergeEditable = function(resource, editable) {
          var toSubmit = angular.copy(resource);
          toSubmit.metadata.annotations[annotationName('description')] = editable.description;
          toSubmit.metadata.annotations[annotationName('displayName')] = editable.displayName;
          return toSubmit;
        };

        angular.extend($scope, {
          project: project,
          editableFields: editableFields(project),
          show: {
            editing: false
          },
          actions: {
            canSubmit: false
          },
          canSubmit: function(bool) {
            $scope.actions.canSubmit = bool;
          },
          update: function() {
            $scope.disableInputs = true;
            ProjectsService
              .update($routeParams.project, mergeEditable(project, $scope.editableFields))
              .then(function() {
                if ($routeParams.then) {
                  $location.path($routeParams.then);
                }
                else {
                  Navigate.toProjectOverview(project.metadata.name);
                }
              }, function(result) {
                $scope.disableInputs = false;
                $scope.editableFields = editableFields(project);
                $scope.alerts["update"] = {
                  type: "error",
                  message: "An error occurred while updating the project",
                  details: $filter('getErrorDetails')(result)
                };
              });
          }
        });
      }));
  });
