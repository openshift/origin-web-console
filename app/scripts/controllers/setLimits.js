'use strict';

/**
 * @ngdoc function
 * @name openshiftConsole.controller:CreateRouteController
 * @description
 * # CreateRouteController
 * Controller of the openshiftConsole
 */
angular.module('openshiftConsole')
  .controller('SetLimitsController', function ($filter,
                                               $location,
                                               $parse,
                                               $routeParams,
                                               $scope,
                                               AlertMessageService,
                                               APIService,
                                               DataService,
                                               LimitRangesService,
                                               Navigate,
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

    $scope.alerts = {};
    $scope.renderOptions = {
      hideFilterWidget: true
    };

    $scope.breadcrumbs = [{
      title: $routeParams.project,
      link: "project/" + $routeParams.project
    }, {
      title: "Deployments",
      link: "project/" + $routeParams.project + "/browse/deployments"
    }, {
      title: $scope.name,
      link: $scope.resourceURL
    }, {
      title: "Set Resource Limits"
    }];

    var getErrorDetails = $filter('getErrorDetails');

    var displayError = function(errorMessage, errorDetails) {
      $scope.alerts['set-compute-limits'] = {
        type: "error",
        message: errorMessage,
        details: errorDetails
      };
    };

    ProjectsService
      .get($routeParams.project)
      .then(_.spread(function(project, context) {
        // Update project breadcrumb with display name.
        $scope.breadcrumbs[0].title = $filter('displayName')(project);

        var resourceGroupVersion = {
          resource: APIService.kindToResource($routeParams.kind),
          group: $routeParams.group
        };
        DataService.get(resourceGroupVersion, $scope.name, context).then(
          function(result) {
            var resource = angular.copy(result);
            $scope.resourceURL = Navigate.resourceURL(resource);
            $scope.containers = _.get(resource, 'spec.template.spec.containers');
            $scope.save = function() {
              $scope.disableInputs = true;
              DataService.update(resourceGroupVersion, $scope.name, resource, context).then(
                function() {
                  AlertMessageService.addAlert({
                    name: $scope.name,
                    data: {
                      type: "success",
                      message: displayName + " was updated."
                    }
                  });
                  $location.url($scope.resourceURL);
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

        DataService.list("limitranges", context, function(limitRanges) {
          $scope.limitRanges = limitRanges.by("metadata.name");
          if ($filter('hashSize')(limitRanges) !== 0) {
            $scope.$watch('containers', validatePodLimits, true);
          }
        });
    }));
  });
