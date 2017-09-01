'use strict';

/**
 * @ngdoc function
 * @name openshiftConsole.controller:PodsController
 * @description
 * # ProjectController
 * Controller of the openshiftConsole
 */
angular.module('openshiftConsole')
  .controller('PodsController', function ($routeParams, $scope, DataService, ProjectsService, $filter, LabelFilter, Logger, gettext) {
    $scope.projectName = $routeParams.project;
    $scope.pods = {};
    $scope.unfilteredPods = {};
    // TODO should we add links to the image streams the pod is using
    // $scope.imageStreams = {};
    // $scope.imagesByDockerReference = {};
    // $scope.imageStreamImageRefByDockerReference = {}; // lets us determine if a particular container's docker image reference belongs to an imageStream
    $scope.labelSuggestions = {};
    $scope.alerts = $scope.alerts || {};
    $scope.emptyMessage = gettext("Loading...");

    var watches = [];

    ProjectsService
      .get($routeParams.project)
      .then(_.spread(function(project, context) {
        $scope.project = project;
        watches.push(DataService.watch("pods", context, function(pods) {
          $scope.unfilteredPods = pods.by("metadata.name");
          $scope.pods = LabelFilter.getLabelSelector().select($scope.unfilteredPods);
          $scope.emptyMessage = gettext("No pods to show");
          // TODO should we add links to the image streams the pod is using
          //ImageStreamResolver.fetchReferencedImageStreamImages($scope.pods, $scope.imagesByDockerReference, $scope.imageStreamImageRefByDockerReference, $scope);
          LabelFilter.addLabelSuggestionsFromResources($scope.unfilteredPods, $scope.labelSuggestions);
          LabelFilter.setLabelSuggestions($scope.labelSuggestions);
          updateFilterWarning();
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

        function updateFilterWarning() {
          if (!LabelFilter.getLabelSelector().isEmpty() && $.isEmptyObject($scope.pods) && !$.isEmptyObject($scope.unfilteredPods)) {
            $scope.alerts["pods"] = {
              type: "warning",
              details: "The active filters are hiding all pods."
            };
          }
          else {
            delete $scope.alerts["pods"];
          }
        }

        LabelFilter.onActiveFiltersChanged(function(labelSelector) {
          // trigger a digest loop
          $scope.$apply(function() {
            $scope.pods = labelSelector.select($scope.unfilteredPods);
            updateFilterWarning();
          });
        });

        $scope.$on('$destroy', function(){
          DataService.unwatchAll(watches);
        });
      }));
  });
