'use strict';

/**
 * @ngdoc function
 * @name openshiftConsole.controller:ImagesController
 * @description
 * # ProjectController
 * Controller of the openshiftConsole
 */
angular.module('openshiftConsole')
  .controller('ImagesController', function (
    $filter,
    $routeParams,
    $scope,
    APIService,
    DataService,
    LabelFilter,
    Logger,
    ProjectsService) {
    $scope.projectName = $routeParams.project;
    $scope.imageStreams = {};
    $scope.unfilteredImageStreams = {};
    $scope.missingStatusTagsByImageStream = {};
    $scope.builds = {};
    $scope.labelSuggestions = {};
    $scope.clearFilter = function() {
      LabelFilter.clear();
    };

    var imageStreamsVersion = APIService.getPreferredVersion('imagestreams');

    var watches = [];

    ProjectsService
      .get($routeParams.project)
      .then(_.spread(function(project, context) {
        $scope.project = project;
        watches.push(DataService.watch(imageStreamsVersion, context, function(imageStreams) {
          $scope.imageStreamsLoaded = true;
          $scope.unfilteredImageStreams = imageStreams.by("metadata.name");
          LabelFilter.addLabelSuggestionsFromResources($scope.unfilteredImageStreams, $scope.labelSuggestions);
          LabelFilter.setLabelSuggestions($scope.labelSuggestions);
          $scope.imageStreams = LabelFilter.getLabelSelector().select($scope.unfilteredImageStreams);
          updateMissingStatusTags();
          updateFilterMessage();
          Logger.log("image streams (subscribe)", $scope.imageStreams);
        }));

        // Check each image stream to see if the spec tags resolve to status tags.
        // We call out missing status tags with a warning.
        function updateMissingStatusTags() {
          angular.forEach($scope.unfilteredImageStreams, function(is, name) {
            var missingStatusTags = $scope.missingStatusTagsByImageStream[name] = {};
            if (!is.spec || !is.spec.tags) {
              return;
            }

            // Index the status tags for this image stream to avoid iterating the list for every spec tag.
            var statusTagMap = {};
            if (is.status && is.status.tags) {
              angular.forEach(is.status.tags, function(tag) {
                statusTagMap[tag.tag] = true;
              });
            }

            // Make sure each spec tag has a corresponding status tag.
            angular.forEach(is.spec.tags, function(specTag) {
              if (!statusTagMap[specTag.name]) {
                missingStatusTags[specTag.name] = specTag;
              }
            });
          });
        }

        function updateFilterMessage() {
          $scope.filterWithZeroResults = !LabelFilter.getLabelSelector().isEmpty() && _.isEmpty($scope.imageStreams) && !_.isEmpty($scope.unfilteredImageStreams);
        }

        LabelFilter.onActiveFiltersChanged(function(labelSelector) {
          // trigger a digest loop
          $scope.$evalAsync(function() {
            $scope.imageStreams = labelSelector.select($scope.unfilteredImageStreams);
            updateFilterMessage();
          });
        });

        $scope.$on('$destroy', function(){
          DataService.unwatchAll(watches);
        });

      }));
  });
