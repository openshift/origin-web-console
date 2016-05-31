'use strict';

/**
 * @ngdoc function
 * @name openshiftConsole.controller:EditRouteController
 * @description
 * # EditRouteController
 * Controller of the openshiftConsole
 */
angular.module('openshiftConsole')
  .controller('EditRouteController', function ($filter,
                                               $location,
                                               $routeParams,
                                               $scope,
                                               AlertMessageService,
                                               DataService,
                                               Navigate,
                                               ProjectsService,
                                               gettextCatalog) {
    $scope.alerts = {};
    $scope.renderOptions = {
      hideFilterWidget: true
    };
    $scope.projectName = $routeParams.project;
    $scope.routeName = $routeParams.route;
    $scope.loading = true;

    $scope.routeURL = Navigate.resourceURL($scope.routeName, "Route", $scope.projectName);
    $scope.breadcrumbs = [{
      title: $scope.projectName,
      link: 'project/' + $scope.projectName
    }, {
      title: gettextCatalog.getString('Routes'),
      link: 'project/' + $scope.projectName + '/browse/routes'
    }, {
      title: $scope.routeName,
      link: $scope.routeURL
    }, {
      title: gettextCatalog.getString("Edit")
    }];

    ProjectsService
      .get($routeParams.project)
      .then(_.spread(function(project, context) {
        $scope.project = project;
        // Update project breadcrumb with display name.
        $scope.breadcrumbs[0].title = $filter('displayName')(project);

        var orderByDisplayName = $filter('orderByDisplayName');

        var route;
        DataService.get("routes", $scope.routeName, context).then(
          function(original) {
            route = angular.copy(original);
            $scope.routing = {
              service: _.get(route, 'spec.to.name'),
              host: _.get(route, 'spec.host'),
              path: _.get(route, 'spec.path'),
              targetPort: _.get(route, 'spec.port.targetPort'),
              tls: angular.copy(_.get(route, 'spec.tls'))
            };

            DataService.list("services", context, function(services) {
              var servicesByName = services.by("metadata.name");
              var to = _.get(route, 'spec.to', {});
              $scope.loading = false;
              $scope.services = orderByDisplayName(servicesByName);
              $scope.routing.to = {
                service: servicesByName[to.name],
                weight: to.weight
              };
              $scope.routing.alternateServices = [];
              _.each(_.get(route, 'spec.alternateBackends'), function(alternateBackend) {
                if (alternateBackend.kind !== 'Service') {
                  Navigate.toErrorPage(gettextCatalog.getString('Editing routes with non-service targets is unsupported. You can edit the route with the "Edit YAML" action instead.'));
                  return false;
                }

                $scope.routing.alternateServices.push({
                  service: servicesByName[alternateBackend.name],
                  weight: alternateBackend.weight
                });
              });
            });
          },
          function() {
            Navigate.toErrorPage(gettextCatalog.getString("Could not load route {{name}}.", {name: $scope.routeName}));
          });

        // Update the fields in the route from what was entered in the form.
        var updateRouteFields = function() {
          var serviceName = _.get($scope, 'routing.to.service.metadata.name');
          _.set(route, 'spec.to.name', serviceName);
          var weight = _.get($scope, 'routing.to.weight');
          if (!isNaN(weight)) {
            _.set(route, 'spec.to.weight', weight);
          }

          route.spec.path = $scope.routing.path;

          var targetPort = $scope.routing.targetPort;
          if (targetPort) {
            _.set(route, 'spec.port.targetPort', targetPort);
          } else {
            delete route.spec.port;
          }

          if (_.get($scope, 'routing.tls.termination')) {
            route.spec.tls = $scope.routing.tls;
          } else {
            delete route.spec.tls;
          }

          var alternateServices = _.get($scope, 'routing.alternateServices', []);
          if (_.isEmpty(alternateServices)) {
            delete route.spec.alternateBackends;
          } else {
            route.spec.alternateBackends = _.map(alternateServices, function(alternate) {
              return {
                kind: 'Service',
                name: _.get(alternate, 'service.metadata.name'),
                weight: alternate.weight
              };
            });
          }
        };

        $scope.updateRoute = function() {
          if ($scope.form.$valid) {
            $scope.disableInputs = true;
            updateRouteFields();
            DataService.update('routes', $scope.routeName, route, context)
              .then(function() { // Success
                AlertMessageService.addAlert({
                  name: $scope.routeName,
                  data: {
                    type: "success",
                    message: gettextCatalog.getString("Route {{name}} was successfully updated.", {name: $scope.routeName})
                  }
                });
                $location.path($scope.routeURL);
              }, function(response) { // Failure
                $scope.disableInputs = false;
                $scope.alerts['update-route'] = {
                  type: "error",
                  message: gettextCatalog.getString("An error occurred updating route {{name}}.", {name: $scope.routeName}),
                  details: $filter('getErrorDetails')(response)
                };
              });
          }
        };
    }));
  });
