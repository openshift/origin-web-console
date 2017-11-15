'use strict';

/**
 * @ngdoc function
 * @name openshiftConsole.controller:PodsController
 * @description
 * # ProjectController
 * Controller of the openshiftConsole
 */
angular.module('openshiftConsole')
  .controller('PodsController', function (
    $filter,
    $routeParams,
    $scope,
    APIService,
    DataService,
    ProjectsService,
    LabelFilter,
    Logger) {
    $scope.projectName = $routeParams.project;
    $scope.pods = {};
    $scope.unfilteredPods = {};
    // TODO should we add links to the image streams the pod is using
    // $scope.imageStreams = {};
    // $scope.imagesByDockerReference = {};
    // $scope.imageStreamImageRefByDockerReference = {}; // lets us determine if a particular container's docker image reference belongs to an imageStream
    $scope.labelSuggestions = {};
    $scope.clearFilter = function() {
      LabelFilter.clear();
    };

    var podsVersion = APIService.getPreferredVersion('pods');

    var watches = [];

    ProjectsService
      .get($routeParams.project)
      .then(_.spread(function(project, context) {
        $scope.project = project;
        watches.push(DataService.watch(podsVersion, context, function(pods) {
          $scope.podsLoaded = true;
          $scope.unfilteredPods = pods.by("metadata.name");
          $scope.pods = LabelFilter.getLabelSelector().select($scope.unfilteredPods);
          // TODO should we add links to the image streams the pod is using
          //ImageStreamResolver.fetchReferencedImageStreamImages($scope.pods, $scope.imagesByDockerReference, $scope.imageStreamImageRefByDockerReference, $scope);
          LabelFilter.addLabelSuggestionsFromResources($scope.unfilteredPods, $scope.labelSuggestions);
          LabelFilter.setLabelSuggestions($scope.labelSuggestions);
          updateFilterMessage();
          Logger.log("pods (subscribe)", $scope.unfilteredPods);
        }));

        // TODO should we add links to the image streams the pod is using
        // // Sets up subscription for imageStreams
        // watches.push(DataService.watch("imagestreams", $scope, function(imageStreams) {
        //   $scope.imageStreams = imageStreams.by("metadata.name");
        //   ImageStreamResolver.buildDockerRefMapForImageStreams($scope.imageStreams, $scope.imageStreamImageRefByDockerReference);
        //   ImageStreamResolver.fetchReferencedImageStreamImages($scope.pods, $scope.imagesByDockerReference, $scope.imageStreamImageRefByDockerReference, $scope);
        //   Logger.log("imagestreams (subscribe)", $scope.imageStreams);
        // }));

        function updateFilterMessage() {
          $scope.filterWithZeroResults = !LabelFilter.getLabelSelector().isEmpty() && _.isEmpty($scope.pods) && !_.isEmpty($scope.unfilteredPods);
        }

        LabelFilter.onActiveFiltersChanged(function(labelSelector) {
          // trigger a digest loop
          $scope.$evalAsync(function() {
            $scope.pods = labelSelector.select($scope.unfilteredPods);
            updateFilterMessage();
          });
        });

        $scope.$on('$destroy', function(){
          DataService.unwatchAll(watches);
        });
      }));
  });
