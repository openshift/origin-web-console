'use strict';

/**
 * @ngdoc function
 * @name openshiftConsole.controller:ServicesController
 * @description
 * # ProjectController
 * Controller of the openshiftConsole
 */
angular.module('openshiftConsole')
  .controller('ServicesController', function ($routeParams, $scope, DataService, ProjectsService, $filter, LabelFilter, Logger, gettext) {
    $scope.projectName = $routeParams.project;
    $scope.services = {};
    $scope.unfilteredServices = {};
    $scope.routesByService = {};
    $scope.routes = {};
    $scope.labelSuggestions = {};
    $scope.alerts = $scope.alerts || {};
    $scope.emptyMessage = gettext("Loading...");
    $scope.emptyMessageRoutes = gettext("Loading...");

    var watches = [];

    ProjectsService
      .get($routeParams.project)
      .then(_.spread(function(project, context) {
        $scope.project = project;
         watches.push(DataService.watch("services", context, function(services) {
          $scope.unfilteredServices = services.by("metadata.name");
          LabelFilter.addLabelSuggestionsFromResources($scope.unfilteredServices, $scope.labelSuggestions);
          LabelFilter.setLabelSuggestions($scope.labelSuggestions);
          $scope.services = LabelFilter.getLabelSelector().select($scope.unfilteredServices);
          $scope.emptyMessage = gettext("No services to show");
          updateFilterWarning();

          Logger.log("services (subscribe)", $scope.unfilteredServices);
        }));

        function updateFilterWarning() {
          if (!LabelFilter.getLabelSelector().isEmpty() && $.isEmptyObject($scope.services)  && !$.isEmptyObject($scope.unfilteredServices)) {
            $scope.alerts["services"] = {
              type: "warning",
              details: "The active filters are hiding all services."
            };
          }
          else {
            delete $scope.alerts["services"];
          }
        }

        LabelFilter.onActiveFiltersChanged(function(labelSelector) {
          // trigger a digest loop
          $scope.$apply(function() {
            $scope.services = labelSelector.select($scope.unfilteredServices);
            updateFilterWarning();
          });
        });

        $scope.$on('$destroy', function(){
          DataService.unwatchAll(watches);
        });

      }));
  });
