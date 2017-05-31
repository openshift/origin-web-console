'use strict';

/**
 * @ngdoc function
 * @name openshiftConsole.controller:CreateRouteController
 * @description
 * # CreateRouteController
 * Controller of the openshiftConsole
 */
angular.module('openshiftConsole')
  .controller('CreateRouteController',
              function($filter,
                       $routeParams,
                       $scope,
                       $window,
                       ApplicationGenerator,
                       AuthorizationService,
                       DataService,
                       Navigate,
                       ProjectsService,
                       keyValueEditorUtils) {
    $scope.alerts = {};
    $scope.renderOptions = {
      hideFilterWidget: true
    };
    $scope.projectName = $routeParams.project;
    $scope.serviceName = $routeParams.service;
    $scope.labels = [];

    // Prefill route name with the service name.
    $scope.routing = {
      name: $scope.serviceName || ""
    };

    $scope.breadcrumbs = [
      {
        title: $scope.projectName,
        link: "project/" + $scope.projectName
      },
      {
         title: "Routes",
         link: "project/" + $scope.projectName + "/browse/routes"
      },
      {
        title: "Create Route"
      }
    ];

    ProjectsService
      .get($routeParams.project)
      .then(_.spread(function(project, context) {
        $scope.project = project;
        // Update project breadcrumb with display name.
        $scope.breadcrumbs[0].title = $filter('displayName')(project);

        if (!AuthorizationService.canI('routes', 'create', $routeParams.project)) {
          Navigate.toErrorPage('You do not have authority to create routes in project ' + $routeParams.project + '.', 'access_denied');
          return;
        }

        var orderByDisplayName = $filter('orderByDisplayName');

        $scope.routing.to = {
          kind: 'Service',
          name: $scope.serviceName,
          weight: 1
        };
        DataService.list("services", context).then(function(services) {
          $scope.services = orderByDisplayName(services.by("metadata.name"));
        });

        $scope.copyServiceLabels = function() {
          var serviceLabels = _.get($scope, 'routing.to.service.metadata.labels', {});
          var existing = keyValueEditorUtils.mapEntries(keyValueEditorUtils.compactEntries($scope.labels));
          var updated = _.assign(existing, serviceLabels);
          $scope.labels = _.map(updated, function(value, key) {
            return {
              name: key,
              value: value
            };
          });
        };

        $scope.createRoute = function() {
          if ($scope.createRouteForm.$valid) {
            $scope.disableInputs = true;
            var serviceName = $scope.routing.to.name;
            var labels = keyValueEditorUtils.mapEntries(keyValueEditorUtils.compactEntries($scope.labels));

            var route = ApplicationGenerator.createRoute($scope.routing, serviceName, labels);
            var alternateServices = _.get($scope, 'routing.alternateServices', []);
            if (!_.isEmpty(alternateServices)) {
              route.spec.to.weight = _.get($scope, 'routing.to.weight');
              route.spec.alternateBackends = _.map(alternateServices, function(alternate) {
                return {
                  kind: 'Service',
                  name: alternate.name,
                  weight: alternate.weight
                };
              });
            }

            DataService.create('routes', null, route, context)
              .then(function() { // Success
                // Return to the previous page
                $window.history.back();
              }, function(result) { // Failure
                $scope.disableInputs = false;
                $scope.alerts['create-route'] = {
                  type: "error",
                  message: "An error occurred creating the route.",
                  details: $filter('getErrorDetails')(result)
                };
              });
          }
        };
    }));
  });
