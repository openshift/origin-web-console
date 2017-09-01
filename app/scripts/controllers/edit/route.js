'use strict';

/**
 * @ngdoc function
 * @name openshiftConsole.controller:EditRouteController
 * @description
 * # EditRouteController
 * Controller of the openshiftConsole
 */
angular.module('openshiftConsole')
  .controller('EditRouteController',
              function($filter,
                       $location,
                       $routeParams,
                       $scope,
                       AuthorizationService,
                       DataService,
                       Navigate,
                       NotificationsService,
                       ProjectsService,
                       RoutesService) {
    $scope.renderOptions = {
      hideFilterWidget: true
    };
    $scope.projectName = $routeParams.project;
    $scope.routeName = $routeParams.route;
    $scope.loading = true;

    $scope.routeURL = Navigate.resourceURL($scope.routeName, "Route", $scope.projectName);
    $scope.breadcrumbs = [{
      title: 'Routes',
      link: 'project/' + $scope.projectName + '/browse/routes'
    }, {
      title: $scope.routeName,
      link: $scope.routeURL
    }, {
      title: "Edit"
    }];

    var hideErrorNotifications = function() {
      NotificationsService.hideNotification("edit-route-error");
    };
    $scope.$on('$destroy', hideErrorNotifications);

    var navigateBack = function() {
      $location.path($scope.routeURL);
    };
    $scope.cancel = navigateBack;

    ProjectsService
      .get($routeParams.project)
      .then(_.spread(function(project, context) {
        $scope.project = project;

        if (!AuthorizationService.canI('routes', 'update', $routeParams.project)) {
          Navigate.toErrorPage('You do not have authority to update route ' + $routeParams.routeName + '.', 'access_denied');
          return;
        }

        var orderByDisplayName = $filter('orderByDisplayName');

        var showNonServiceTargetError = function() {
          Navigate.toErrorPage('Editing routes with non-service targets is unsupported. You can edit the route with the "Edit YAML" action instead.');
        };

        var route;
        DataService.get("routes", $scope.routeName, context).then(
          function(original) {
            if (original.spec.to.kind !== 'Service') {
              showNonServiceTargetError();
              return;
            }

            route = angular.copy(original);
            var host = _.get(route, 'spec.host');
            var isWildcard = _.get(route, 'spec.wildcardPolicy') === 'Subdomain';
            if (isWildcard) {
              // Display the route as a wildcard.
              host = '*.' + RoutesService.getSubdomain(route);
            }
            $scope.routing = {
              host: host,
              wildcardPolicy: _.get(route, 'spec.wildcardPolicy'),
              path: _.get(route, 'spec.path'),
              targetPort: _.get(route, 'spec.port.targetPort'),
              tls: angular.copy(_.get(route, 'spec.tls'))
            };

            DataService.list("services", context).then(function(resp) {
              $scope.loading = false;

              var servicesByName = resp.by("metadata.name");
              $scope.routing.to = route.spec.to;
              $scope.routing.alternateServices = [];
              _.each(_.get(route, 'spec.alternateBackends'), function(alternateBackend) {
                if (alternateBackend.kind !== 'Service') {
                  showNonServiceTargetError();
                  return false;
                }

                $scope.routing.alternateServices.push(alternateBackend);
              });

              $scope.services = orderByDisplayName(servicesByName);
            });
          },
          function() {
            Navigate.toErrorPage("Could not load route " + $scope.routeName + ".");
          });

        // Update the fields in the route from what was entered in the form.
        var updateRouteFields = function() {
          // Make a second copy of the route before making the PUT request.
          // This way if the PUT fails and the user switches termination types,
          // we haven't lost the previously-entered certificates values.
          var updated = angular.copy(route);
          var serviceName = _.get($scope, 'routing.to.name');
          _.set(updated, 'spec.to.name', serviceName);
          var weight = _.get($scope, 'routing.to.weight');
          if (!isNaN(weight)) {
            _.set(updated, 'spec.to.weight', weight);
          }

          updated.spec.path = $scope.routing.path;

          var targetPort = $scope.routing.targetPort;
          if (targetPort) {
            _.set(updated, 'spec.port.targetPort', targetPort);
          } else {
            delete updated.spec.port;
          }

          if (_.get($scope, 'routing.tls.termination')) {
            updated.spec.tls = $scope.routing.tls;

            if (updated.spec.tls.termination === 'passthrough') {
              delete updated.spec.path;
              delete updated.spec.tls.certificate;
              delete updated.spec.tls.key;
              delete updated.spec.tls.caCertificate;
            }

            if (updated.spec.tls.termination !== 'reencrypt') {
              delete updated.spec.tls.destinationCACertificate;
            }
          } else {
            delete updated.spec.tls;
          }

          var alternateServices = _.get($scope, 'routing.alternateServices', []);
          if (_.isEmpty(alternateServices)) {
            delete updated.spec.alternateBackends;
          } else {
            updated.spec.alternateBackends = _.map(alternateServices, function(alternate) {
              return {
                kind: 'Service',
                name: alternate.name,
                weight: alternate.weight
              };
            });
          }

          return updated;
        };

        $scope.updateRoute = function() {
          if ($scope.form.$valid) {
            hideErrorNotifications();
            $scope.disableInputs = true;
            var updated = updateRouteFields();
            DataService.update('routes', $scope.routeName, updated, context)
              .then(function() { // Success
                NotificationsService.addNotification({
                  type: "success",
                  message: "Route " + $scope.routeName + " was successfully updated."
                });
                navigateBack();
              }, function(response) { // Failure
                $scope.disableInputs = false;
                NotificationsService.addNotification({
                  type: "error",
                  id: "edit-route-error",
                  message: "An error occurred updating route " + $scope.routeName + ".",
                  details: $filter('getErrorDetails')(response)
                });
              });
          }
        };
    }));
  });
