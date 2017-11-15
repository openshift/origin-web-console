'use strict';

/**
 * @ngdoc function
 * @name openshiftConsole.controller:ServicesController
 * @description
 * # ProjectController
 * Controller of the openshiftConsole
 */
angular.module('openshiftConsole')
  .controller('RoutesController', function (
    $filter,
    $routeParams,
    $scope,
    APIService,
    DataService,
    LabelFilter,
    ProjectsService) {
    $scope.projectName = $routeParams.project;
    $scope.unfilteredRoutes = {};
    $scope.routes = {};
    $scope.labelSuggestions = {};
    $scope.clearFilter = function() {
      LabelFilter.clear();
    };

    var servicesVersion = APIService.getPreferredVersion('services');
    $scope.routesVersion = APIService.getPreferredVersion('routes');

    var watches = [];

    ProjectsService
      .get($routeParams.project)
      .then(_.spread(function(project, context) {
        $scope.project = project;
        watches.push(DataService.watch($scope.routesVersion, context, function(routes) {
          $scope.routesLoaded = true;
          $scope.unfilteredRoutes = routes.by("metadata.name");
          LabelFilter.addLabelSuggestionsFromResources($scope.unfilteredRoutes, $scope.labelSuggestions);
          LabelFilter.setLabelSuggestions($scope.labelSuggestions);
          $scope.routes = LabelFilter.getLabelSelector().select($scope.unfilteredRoutes);
          updateFilterMessage();
        }));

        // Watch services to display route warnings.
        watches.push(DataService.watch(servicesVersion, context, function(services) {
          $scope.services = services.by("metadata.name");
        }));

        function updateFilterMessage() {
          $scope.filterWithZeroResults = !LabelFilter.getLabelSelector().isEmpty() && _.isEmpty($scope.routes) && !_.isEmpty($scope.unfilteredRoutes);
        }

        LabelFilter.onActiveFiltersChanged(function(labelSelector) {
          // trigger a digest loop
          $scope.$evalAsync(function() {
            $scope.routes = labelSelector.select($scope.unfilteredRoutes);
            updateFilterMessage();
          });
        });

        $scope.$on('$destroy', function(){
          DataService.unwatchAll(watches);
        });
      }));
  });
