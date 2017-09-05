'use strict';

/**
 * @ngdoc function
 * @name openshiftConsole.controller:SetLimitsController
 * @description
 * # CreateRouteController
 * Controller of the openshiftConsole
 */
angular.module('openshiftConsole')
  .controller('SetLimitsController',
              function($filter,
                       $location,
                       $parse,
                       $routeParams,
                       $scope,
                       APIService,
                       AuthorizationService,
                       BreadcrumbsService,
                       DataService,
                       LimitRangesService,
                       Navigate,
                       NotificationsService,
                       ProjectsService) {
    if (!$routeParams.kind || !$routeParams.name) {
      Navigate.toErrorPage("Kind or name parameter missing.");
      return;
    }

    var supportedKinds = [
      'Deployment',
      'DeploymentConfig',
      'ReplicaSet',
      'ReplicationController'
    ];

    if (!_.includes(supportedKinds, $routeParams.kind)) {
      Navigate.toErrorPage("Health checks are not supported for kind " + $routeParams.kind + ".");
      return;
    }

    var humanizeKind = $filter('humanizeKind');
    var displayName = humanizeKind($routeParams.kind, true) + " " + $routeParams.name;

    $scope.name = $routeParams.name;
    if ($routeParams.kind === 'ReplicationController' || $routeParams.kind === 'ReplicaSet') {
      $scope.showPodWarning = true;
    }

    $scope.renderOptions = {
      hideFilterWidget: true
    };

    $scope.breadcrumbs = BreadcrumbsService.getBreadcrumbs({
      name: $routeParams.name,
      kind: $routeParams.kind,
      namespace: $routeParams.project,
      subpage: 'Edit Resource Limits'
    });

    var getErrorDetails = $filter('getErrorDetails');

    var displayError = function(errorMessage, errorDetails) {
      NotificationsService.addNotification({
        id: "set-compute-limits-error",
        type: "error",
        message: errorMessage,
        details: errorDetails
      });
    };

    var navigateBack = function() {
      $location.url($scope.resourceURL);
    };

    var hideErrorNotifications = function() {
      NotificationsService.hideNotification("set-compute-limits-error");
    };

    $scope.cancel = navigateBack;
    $scope.$on('$destroy', hideErrorNotifications);

    ProjectsService
      .get($routeParams.project)
      .then(_.spread(function(project, context) {

        var resourceGroupVersion = {
          resource: APIService.kindToResource($routeParams.kind),
          group: $routeParams.group
        };

        if (!AuthorizationService.canI(resourceGroupVersion, 'update', $routeParams.project)) {
          Navigate.toErrorPage('You do not have authority to update ' +
                               humanizeKind($routeParams.kind) + ' ' + $routeParams.name + '.', 'access_denied');
          return;
        }

        DataService.get(resourceGroupVersion, $scope.name, context).then(
          function(result) {
            var object = $scope.object = angular.copy(result);
            $scope.breadcrumbs = BreadcrumbsService.getBreadcrumbs({
              object: object,
              project: project,
              subpage: 'Edit Resource Limits'
            });
            $scope.resourceURL = Navigate.resourceURL(object);
            $scope.containers = _.get(object, 'spec.template.spec.containers');
            $scope.save = function() {
              $scope.disableInputs = true;
              hideErrorNotifications();
              DataService.update(resourceGroupVersion, $scope.name, object, context).then(
                function() {
                  NotificationsService.addNotification({
                      type: "success",
                      message: displayName + " was updated."
                  });
                  navigateBack();
                },
                function(result) {
                  $scope.disableInputs = false;
                  displayError(displayName + ' could not be updated.', getErrorDetails(result));
                });
            };
          },
          function(result) {
            displayError(displayName + ' could not be loaded.', getErrorDetails(result));
          }
        );

        var validatePodLimits = function() {
          if (!$scope.hideCPU) {
            $scope.cpuProblems = LimitRangesService.validatePodLimits($scope.limitRanges, 'cpu', $scope.containers, project);
          }
          $scope.memoryProblems = LimitRangesService.validatePodLimits($scope.limitRanges, 'memory', $scope.containers, project);
        };

        DataService.list("limitranges", context).then(function(resp) {
          $scope.limitRanges = resp.by("metadata.name");
          if (!_.isEmpty($scope.limitRanges)) {
            $scope.$watch('containers', validatePodLimits, true);
          }
        });
    }));
  });
