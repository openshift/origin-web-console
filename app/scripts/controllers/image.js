'use strict';

/**
 * @ngdoc function
 * @name openshiftConsole.controller:ImageController
 * @description
 * Controller of the openshiftConsole
 */
angular.module('openshiftConsole')
  .controller('ImageController', function ($scope, $routeParams, DataService, ProjectsService, $filter, ImageStreamsService, gettextCatalog) {
    $scope.projectName = $routeParams.project;
    $scope.imageStream = null;
    $scope.tagsByName = {};
    $scope.tagShowOlder = {};
    $scope.alerts = {};
    $scope.renderOptions = $scope.renderOptions || {};
    $scope.renderOptions.hideFilterWidget = true;
    $scope.breadcrumbs = [
      {
        title: gettextCatalog.getString("Image Streams"),
        link: "project/" + $routeParams.project + "/browse/images"
      },
      {
        title: $routeParams.image
      }
    ];
    $scope.emptyMessage = gettextCatalog.getString("Loading...");

    var watches = [];

    ProjectsService
      .get($routeParams.project)
      .then(_.spread(function(project, context) {
        $scope.project = project;
        DataService.get("imagestreams", $routeParams.image, context).then(
          // success
          function(imageStream) {
            $scope.loaded = true;
            $scope.imageStream = imageStream;
            $scope.emptyMessage = gettextCatalog.getString("No tags to show");

            // If we found the item successfully, watch for changes on it
            watches.push(DataService.watchObject("imagestreams", $routeParams.image, context, function(imageStream, action) {
              if (action === "DELETED") {
                $scope.alerts["deleted"] = {
                  type: "warning",
                  message: gettextCatalog.getString("This image stream has been deleted.")
                };
              }
              $scope.imageStream = imageStream;
              $scope.tagsByName = ImageStreamsService.tagsByName($scope.imageStream);
            }));
          },
          // failure
          function(e) {
            $scope.loaded = true;
            $scope.alerts["load"] = {
              type: "error",
              message: gettextCatalog.getString("The image stream details could not be loaded."),
              details: gettextCatalog.getString("Reason: ") + $filter('getErrorDetails')(e)
            };
          });

        $scope.$on('$destroy', function(){
          DataService.unwatchAll(watches);
        });

      }));
  });
