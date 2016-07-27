'use strict';

/**
 * @ngdoc function
 * @name openshiftConsole.controller:ImageController
 * @description
 * Controller of the openshiftConsole
 */
angular.module('openshiftConsole')
  .controller('ImageController', function ($scope, $routeParams, DataService, ProjectsService, $filter, ImageStreamsService) {
    $scope.projectName = $routeParams.project;
    $scope.imageStream = null;
    $scope.image = null;
    $scope.tagsByName = {};
    $scope.alerts = {};
    $scope.renderOptions = $scope.renderOptions || {};
    $scope.renderOptions.hideFilterWidget = true;

    $scope.breadcrumbs = [
      {
        title: "Image Streams",
        link: "project/" + $routeParams.project + "/browse/images"
      },
      {
        title: $routeParams.imagestream,
        link: "project/" + $routeParams.project + "/browse/images/" + $routeParams.imagestream
      },
      {
        title: ":" + $routeParams.tag
      }
    ];

    $scope.emptyMessage = "Loading...";

    // Check for a ?tab=<name> query param to allow linking directly to a tab.
    if ($routeParams.tab) {
      $scope.selectedTab = {};
      $scope.selectedTab[$routeParams.tab] = true;
    }

    var watches = [];

    var fetchImageStreamTag = _.debounce(function(tagData, context) {
      var name;
      if (tagData.spec) {
        name = tagData.spec.from.name;
      } else {
        name = $routeParams.imagestream + ":" + $routeParams.tag;
      }
      DataService.get("imagestreamtags", name, context).then(
        // success
        function(imageStreamTag) {
          $scope.loaded = true;
          $scope.image = imageStreamTag.image;
        },
        // failure
        function(e) {
          $scope.loaded = true;
          $scope.alerts["load"] = {
            type: "error",
            message: "The image details could not be loaded.",
            details: "Reason: " + $filter('getErrorDetails')(e)
          };
        }
      );
    }, 200);

    function populateWithImageStream(imageStream, context) {
      var tagsByName = ImageStreamsService.tagsByName(imageStream);

      $scope.imageStream = imageStream;
      $scope.tagsByName = tagsByName;
      $scope.tagName = $routeParams.tag;

      var tagData = tagsByName[$routeParams.tag];
      if (!tagData) {
        $scope.alerts["load"] = {
          type: "error",
          message: "The image tag was not found in the stream.",
        };
        return;
      }

      delete $scope.alerts["load"];
      fetchImageStreamTag(tagData, context);
    }

    ProjectsService
      .get($routeParams.project)
      .then(_.spread(function(project, context) {
        $scope.project = project;
        DataService.get("imagestreams", $routeParams.imagestream, context).then(
          // success
          function(imageStream) {
            $scope.emptyMessage = "";
            populateWithImageStream(imageStream, context);

            // If we found the item successfully, watch for changes on it
            watches.push(DataService.watchObject("imagestreams", $routeParams.imagestream, context, function(imageStream, action) {
              if (action === "DELETED") {
                $scope.alerts["deleted"] = {
                  type: "warning",
                  message: "This image stream has been deleted."
                };
              }
              populateWithImageStream(imageStream, context);
            }));
          },
          // failure
          function(e) {
            $scope.loaded = true;
            $scope.alerts["load"] = {
              type: "error",
              message: "The image stream details could not be loaded.",
              details: "Reason: " + $filter('getErrorDetails')(e)
            };
          });

        $scope.$on('$destroy', function(){
          DataService.unwatchAll(watches);
        });

      }));
  });
