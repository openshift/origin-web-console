'use strict';

/**
 * @ngdoc function
 * @name openshiftConsole.controller:EditAutoscalerController
 * @description
 * # EditAutoscalerController
 * Controller of the openshiftConsole
 */
angular.module('openshiftConsole')
  .controller('EditAutoscalerController',
              function ($scope,
                        $filter,
                        $routeParams,
                        $window,
                        APIService,
                        AuthorizationService,
                        BreadcrumbsService,
                        DataService,
                        HPAService,
                        MetricsService,
                        Navigate,
                        NotificationsService,
                        ProjectsService,
                        keyValueEditorUtils,
                        gettextCatalog) {
    if (!$routeParams.kind || !$routeParams.name) {
      Navigate.toErrorPage(gettextCatalog.getString("Kind or name parameter missing."));
      return;
    }

    var supportedKinds = [
      'Deployment',
      'DeploymentConfig',
      'HorizontalPodAutoscaler',
      'ReplicaSet',
      'ReplicationController'
    ];

    if (!_.includes(supportedKinds, $routeParams.kind)) {
      Navigate.toErrorPage(gettextCatalog.getString("Autoscaling not supported for kind {{kind}}.",{kind: $routeParams.kind}));
      return;
    }

    $scope.kind = $routeParams.kind;
    $scope.name = $routeParams.name;
    if ($routeParams.kind === "HorizontalPodAutoscaler") {
      // Wait for the HPA data to load before enabling the form controls.
      // This is only necessary when editing an existing HPA.
      $scope.disableInputs = true;
    } else {
      $scope.targetKind = $routeParams.kind;
      $scope.targetName = $routeParams.name;
    }

    $scope.autoscaling = {
      name: $scope.name
    };

    $scope.labels = [];

    // Warn if metrics aren't configured when setting autoscaling options.
    MetricsService.isAvailable().then(function(available) {
      $scope.metricsWarning = !available;
    });

    var getErrorDetails = $filter('getErrorDetails');

    var navigateBack = function() {
      $window.history.back();
    };
    $scope.cancel = navigateBack;

    var hideErrorNotifications = function() {
      NotificationsService.hideNotification('edit-hpa-error');
    };
    $scope.$on('$destroy', hideErrorNotifications);

    var horizontalPodAutoscalerVersion = APIService.getPreferredVersion('horizontalpodautoscalers');
    var limitRangesVersion = APIService.getPreferredVersion('limitranges');


    ProjectsService
      .get($routeParams.project)
      .then(_.spread(function(project, context) {
        // Update project breadcrumb with display name.
        $scope.project = project;

        var verb = $routeParams.kind === 'HorizontalPodAutoscaler' ? 'update' : 'create';
        if (!AuthorizationService.canI({ resource: 'horizontalpodautoscalers', group: 'autoscaling' }, verb, $routeParams.project)) {
          var msg = gettextCatalog.getString('You do not have authority to {{verb}} horizontal pod autoscalers in project {{project}}.',{verb: verb, project: $routeParams.project});
          Navigate.toErrorPage(msg, 'access_denied');
          return;
        }

        var updateHPA = function(hpa) {
          $scope.disableInputs = true;

          hpa = angular.copy(hpa);
          hpa.metadata.labels = keyValueEditorUtils.mapEntries(keyValueEditorUtils.compactEntries($scope.labels));
          hpa.spec.minReplicas = $scope.autoscaling.minReplicas;
          hpa.spec.maxReplicas = $scope.autoscaling.maxReplicas;
          hpa.spec.targetCPUUtilizationPercentage = $scope.autoscaling.targetCPU;

          DataService.update(horizontalPodAutoscalerVersion, hpa.metadata.name, hpa, context)
            .then(function(hpa) { // Success
              NotificationsService.addNotification({
                type: 'success',
                message: gettextCatalog.getString('Horizontal pod autoscaler {{name}} successfully updated.',{name: hpa.metadata.name})
              });

              navigateBack();
            }, function(result) { // Failure
              $scope.disableInputs = false;
              NotificationsService.addNotification({
                id: 'edit-hpa-error',
                type: 'error',
                message: gettextCatalog.getString('An error occurred creating the horizontal pod autoscaler.'),
                details: getErrorDetails(result)
              });
            });
        };

        var resourceGroup = {};
        if ($routeParams.kind === "HorizontalPodAutoscaler") {
          // Fetch the HPA we're editing. This form knows how to edit autoscaling/v1 HPA objects
          resourceGroup = {
            resource: "horizontalpodautoscalers",
            group: "autoscaling",
            version: "v1"
          };
        } else {
          // Fetch the resource we're going to create an HPA for
          resourceGroup = {
            resource: APIService.kindToResource($routeParams.kind),
            group: $routeParams.group
          };
        }

        DataService.get(resourceGroup, $routeParams.name, context).then(function(resource) {
          var createHPA = function() {
            $scope.disableInputs = true;
            hideErrorNotifications();
            var hpa = {
              apiVersion: "autoscaling/v1",
              kind: "HorizontalPodAutoscaler",
              metadata: {
                name: $scope.autoscaling.name,
                labels: keyValueEditorUtils.mapEntries(keyValueEditorUtils.compactEntries($scope.labels))
              },
              spec: {
                scaleTargetRef: {
                  kind: resource.kind,
                  name: resource.metadata.name,
                  apiVersion: resource.apiVersion
                },
                minReplicas: $scope.autoscaling.minReplicas,
                maxReplicas: $scope.autoscaling.maxReplicas,
                targetCPUUtilizationPercentage: $scope.autoscaling.targetCPU
              }
            };

            DataService.create(horizontalPodAutoscalerVersion, null, hpa, context)
              .then(function(hpa) { // Success
                NotificationsService.addNotification({
                  type: 'success',
                  message: gettextCatalog.getString('Horizontal pod autoscaler {{name}} successfully created.',{name: hpa.metadata.name})
                });

                navigateBack();
              }, function(result) { // Failure
                $scope.disableInputs = false;
                NotificationsService.addNotification({
                  id: 'edit-hpa-error',
                  type: 'error',
                  message: gettextCatalog.getString('An error occurred creating the horizontal pod autoscaler.'),
                  details: getErrorDetails(result)
                });
              });
          };

          $scope.labels = _.map(
                            _.get(resource, 'metadata.labels', {}),
                            function(val, key) {
                              return {
                                name: key,
                                value: val
                              };
                            });

          $scope.usesV2Metrics = HPAService.usesV2Metrics(resource);

          // Are we editing an existing HPA?
          if ($routeParams.kind === "HorizontalPodAutoscaler") {
            $scope.targetKind = _.get(resource, 'spec.scaleTargetRef.kind');
            $scope.targetName = _.get(resource, 'spec.scaleTargetRef.name');
            _.assign($scope.autoscaling, {
              minReplicas: _.get(resource, 'spec.minReplicas'),
              maxReplicas: _.get(resource, 'spec.maxReplicas'),
              targetCPU: _.get(resource, 'spec.targetCPUUtilizationPercentage')
            });
            $scope.disableInputs = false;

            // Update the existing HPA.
            $scope.save = function() {
              updateHPA(resource);
            };

            // Build the breadcrumb for the target resource. (HPAs don't have a dedicated page.)
            $scope.breadcrumbs = BreadcrumbsService.getBreadcrumbs({
              name: $scope.targetName,
              kind: $scope.targetKind,
              namespace: $routeParams.project,
              project: project,
              subpage: 'Autoscale'
            });
          } else {
            $scope.breadcrumbs = BreadcrumbsService.getBreadcrumbs({
              object: resource,
              project: project,
              subpage: 'Autoscale'
            });

            // Create a new HPA.
            $scope.save = createHPA;

            var limitRanges = {};
            var checkCPURequest = function() {
              var containers = _.get(resource, 'spec.template.spec.containers', []);
              $scope.showCPURequestWarning = !HPAService.hasCPURequest(containers, limitRanges, project);
            };

            // List limit ranges in this project to determine if there is a default
            // CPU request for autoscaling.
            DataService.list(limitRangesVersion, context).then(function(resp) {
              limitRanges = resp.by("metadata.name");
              checkCPURequest();
            });
          }
        });
    }));
  });
