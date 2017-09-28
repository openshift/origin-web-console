'use strict';

/**
 * @ngdoc function
 * @name openshiftConsole.controller:ImageController
 * @description
 * Controller of the openshiftConsole
 */
angular.module('openshiftConsole')
  .controller('ImageStreamController', function (
    $filter,
    $routeParams,
    $scope,
    APIService,
    DataService,
    ImageStreamsService,
    Navigate,
    ProjectsService) {
    $scope.projectName = $routeParams.project;
    $scope.imageStream = null;
    $scope.tags = [];
    $scope.tagShowOlder = {};
    $scope.alerts = {};
    $scope.renderOptions = $scope.renderOptions || {};
    $scope.renderOptions.hideFilterWidget = true;
    $scope.breadcrumbs = [
      {
        title: "Image Streams",
        link: "project/" + $routeParams.project + "/browse/images"
      },
      {
        title: $routeParams.imagestream
      }
    ];
    $scope.emptyMessage = "Loading...";

    $scope.imageStreamsVersion = APIService.getPreferredVersion('imagestreams');

    var watches = [];

    ProjectsService
      .get($routeParams.project)
      .then(_.spread(function(project, context) {
        $scope.project = project;
        DataService.get($scope.imageStreamsVersion, $routeParams.imagestream, context, { errorNotification: false }).then(
          // success
          function(imageStream) {
            $scope.loaded = true;
            $scope.imageStream = imageStream;
            $scope.emptyMessage = "No tags to show";

            // If we found the item successfully, watch for changes on it
            watches.push(DataService.watchObject($scope.imageStreamsVersion, $routeParams.imagestream, context, function(imageStream, action) {
              if (action === "DELETED") {
                $scope.alerts["deleted"] = {
                  type: "warning",
                  message: "This image stream has been deleted."
                };
              }
              $scope.imageStream = imageStream;
              $scope.tags = _.toArray(ImageStreamsService.tagsByName($scope.imageStream));
            }));
          },
          // failure
          function(e) {
            $scope.loaded = true;
            $scope.alerts["load"] = {
              type: "error",
              message: "The image stream details could not be loaded.",
              details: $filter('getErrorDetails')(e)
            };
          });

        $scope.$on('$destroy', function(){
          DataService.unwatchAll(watches);
        });

      }));

      $scope.imagestreamPath = function imagestreamPath(imagestream, tag) {
        if (!tag.status) {
          return "";
        }
        var url = Navigate.resourceURL(imagestream.metadata.name, "ImageStream", imagestream.metadata.namespace);
        if (tag) {
          url += "/" + tag.name;
        }
        return url;
      };
  });
