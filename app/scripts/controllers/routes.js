'use strict';

/**
 * @ngdoc function
 * @name openshiftConsole.controller:ServicesController
 * @description
 * # ProjectController
 * Controller of the openshiftConsole
 */
angular.module('openshiftConsole')
  .controller('RoutesController', function ($routeParams, $scope, DataService, $filter, LabelFilter, ProjectsService, gettext) {
    $scope.projectName = $routeParams.project;
    $scope.unfilteredRoutes = {};
    $scope.routes = {};
    $scope.labelSuggestions = {};
    $scope.alerts = $scope.alerts || {};
    $scope.emptyMessage = gettext("Loading...");

    var watches = [];

    ProjectsService
      .get($routeParams.project)
      .then(_.spread(function(project, context) {
        $scope.project = project;
        watches.push(DataService.watch("routes", context, function(routes) {
          $scope.unfilteredRoutes = routes.by("metadata.name");
          LabelFilter.addLabelSuggestionsFromResources($scope.unfilteredRoutes, $scope.labelSuggestions);
          LabelFilter.setLabelSuggestions($scope.labelSuggestions);
          $scope.routes = LabelFilter.getLabelSelector().select($scope.unfilteredRoutes);
          $scope.emptyMessage = gettext("No routes to show");
          updateFilterWarning();
        }));

        // Watch services to display route warnings.
        watches.push(DataService.watch("services", context, function(services) {
          $scope.services = services.by("metadata.name");
        }));

        function updateFilterWarning() {
          if (!LabelFilter.getLabelSelector().isEmpty() && $.isEmptyObject($scope.routes)  && !$.isEmptyObject($scope.unfilteredRoutes)) {
            $scope.alerts["routes"] = {
              type: "warning",
              details: "The active filters are hiding all routes."
            };
          }
          else {
            delete $scope.alerts["routes"];
          }
        }

        LabelFilter.onActiveFiltersChanged(function(labelSelector) {
          // trigger a digest loop
          $scope.$apply(function() {
            $scope.routes = labelSelector.select($scope.unfilteredRoutes);
            updateFilterWarning();
          });
        });

        $scope.$on('$destroy', function(){
          DataService.unwatchAll(watches);
        });
      }));
  });
