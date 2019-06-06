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
                       APIService,
                       ApplicationGenerator,
                       AuthorizationService,
                       DataService,
                       Navigate,
                       NotificationsService,
                       ProjectsService,
                       keyValueEditorUtils,
                       gettextCatalog) {
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
         title: gettextCatalog.getString("Routes"),
         link: "project/" + $scope.projectName + "/browse/routes"
      },
      {
        title: gettextCatalog.getString("Create Route")
      }
    ];

    var routesVersion = APIService.getPreferredVersion('routes');
    var servicesVersion = APIService.getPreferredVersion('services');

    var hideErrorNotifications = function() {
      NotificationsService.hideNotification("create-route-error");
    };
    $scope.$on('$destroy', hideErrorNotifications);

    var navigateBack = function() {
      $window.history.back();
    };
    $scope.cancel = navigateBack;

    ProjectsService
      .get($routeParams.project)
      .then(_.spread(function(project, context) {
        $scope.project = project;

        if (!AuthorizationService.canI(routesVersion, 'create', $routeParams.project)) {
          Navigate.toErrorPage(gettextCatalog.getString('You do not have authority to create routes in project {{project}}.', {project: $routeParams.project}), 'access_denied');
          return;
        }

        var servicesByName;
        var orderByDisplayName = $filter('orderByDisplayName');

        $scope.routing.to = {
          kind: 'Service',
          name: $scope.serviceName,
          weight: 1
        };

        var serviceLabels;
        var copyServiceLabels = function() {
          var previousServiceLabels = serviceLabels;
          var serviceName = _.get($scope, 'routing.to.name');
          serviceLabels = _.get(servicesByName, [serviceName, 'metadata', 'labels'], {});
          var existing = keyValueEditorUtils.mapEntries(keyValueEditorUtils.compactEntries($scope.labels));

          var updated = _.assign(existing, serviceLabels);

          // Remove any labels added for the previous service. Do this last to
          // try to preserve the order of the labels. This prevents the `app`
          // label from moving to the bottom of the list.
          if (previousServiceLabels) {
            updated = _.omitBy(updated, function(value, name) {
              return previousServiceLabels[name] && !serviceLabels[name];
            });
          }

          $scope.labels = _.map(updated, function(value, key) {
            return {
              name: key,
              value: value
            };
          });
        };

        DataService.list(servicesVersion, context).then(function(serviceData) {
          servicesByName = serviceData.by("metadata.name");
          $scope.services = orderByDisplayName(servicesByName);
          // Wait until the services load before trying to copy service labels.
          $scope.$watch('routing.to.name', copyServiceLabels);
        });

        $scope.createRoute = function() {
          if ($scope.createRouteForm.$valid) {
            hideErrorNotifications();
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

            var createRouteVersion = APIService.objectToResourceGroupVersion(route);
            DataService.create(createRouteVersion, null, route, context)
              .then(function() { // Success
                NotificationsService.addNotification({
                    type: "success",
                    message: gettextCatalog.getString("Route {{name}} was successfully created.", {name: route.metadata.name})
                });

                // Return to the previous page
                navigateBack();
              }, function(result) { // Failure
                $scope.disableInputs = false;
                NotificationsService.addNotification({
                  type: "error",
                  id: "create-route-error",
                  message: gettextCatalog.getString("An error occurred creating the route."),
                  details: $filter('getErrorDetails')(result)
                });
              });
          }
        };
    }));
  });
