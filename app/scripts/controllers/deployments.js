'use strict';

/**
 * @ngdoc function
 * @name openshiftConsole.controller:DeploymentsController
 * @description
 * # ProjectController
 * Controller of the openshiftConsole
 */
angular.module('openshiftConsole')
  .controller('DeploymentsController', function ($scope,
                                                 $filter,
                                                 $routeParams,
                                                 AlertMessageService,
                                                 DataService,
                                                 DeploymentsService,
                                                 ImageStreamResolver,
                                                 LabelFilter,
                                                 Logger,
                                                 ProjectsService) {
    $scope.projectName = $routeParams.project;
    // TODO: Rename to avoid confusion with k8s deployments.
    $scope.deployments = {};
    $scope.unfilteredDeploymentConfigs = {};
    $scope.unfilteredK8SDeployments = {};
    // leave undefined so we know when data is loaded
    $scope.deploymentsByDeploymentConfig = {};
    $scope.labelSuggestions = {};
    $scope.alerts = $scope.alerts || {};
    $scope.emptyMessage = "Loading...";
    $scope.expandedDeploymentConfigRow = {};
    $scope.unfilteredReplicaSets = {};
    $scope.unfilteredReplicationControllers = {};

    // get and clear any alerts
    AlertMessageService.getAlerts().forEach(function(alert) {
      $scope.alerts[alert.name] = alert.data;
    });
    AlertMessageService.clearAlerts();

    var watches = [];
    ProjectsService
      .get($routeParams.project)
      .then(_.spread(function(project, context) {
        $scope.project = project;
        watches.push(DataService.watch("replicationcontrollers", context, function(deployments, action, deployment) {
          $scope.deployments = deployments.by("metadata.name");

          var deploymentConfigName;
          var deploymentName;
          if (deployment) {
            deploymentConfigName = $filter('annotation')(deployment, 'deploymentConfig');
            deploymentName = deployment.metadata.name;
          }

          $scope.deploymentsByDeploymentConfig = DeploymentsService.associateDeploymentsToDeploymentConfig($scope.deployments, $scope.deploymentConfigs, true);
          if ($scope.deploymentsByDeploymentConfig['']) {
            $scope.unfilteredReplicationControllers = $scope.deploymentsByDeploymentConfig[''];
            LabelFilter.addLabelSuggestionsFromResources($scope.unfilteredReplicationControllers, $scope.labelSuggestions);
            LabelFilter.setLabelSuggestions($scope.labelSuggestions);
            $scope.deploymentsByDeploymentConfig[''] = LabelFilter.getLabelSelector().select($scope.deploymentsByDeploymentConfig['']);
          }
          updateFilterWarning();

          if (!action) {
            // Loading of the page that will create deploymentConfigDeploymentsInProgress structure, which will associate running deployment to his deploymentConfig.
            $scope.deploymentConfigDeploymentsInProgress = DeploymentsService.associateRunningDeploymentToDeploymentConfig($scope.deploymentsByDeploymentConfig);
          } else if (action === 'ADDED' || (action === 'MODIFIED' && ['New', 'Pending', 'Running'].indexOf($filter('deploymentStatus')(deployment)) > -1)) {
            // When new deployment id instantiated/cloned, or in case of a retry, associate him to his deploymentConfig and add him into deploymentConfigDeploymentsInProgress structure.
            $scope.deploymentConfigDeploymentsInProgress[deploymentConfigName] = $scope.deploymentConfigDeploymentsInProgress[deploymentConfigName] || {};
            $scope.deploymentConfigDeploymentsInProgress[deploymentConfigName][deploymentName] = deployment;
          } else if (action === 'MODIFIED') {
            // After the deployment ends remove him from the deploymentConfigDeploymentsInProgress structure.
            var status = $filter('deploymentStatus')(deployment);
            if (status === "Complete" || status === "Failed"){
              delete $scope.deploymentConfigDeploymentsInProgress[deploymentConfigName][deploymentName];
            }
          }

          // Extract the causes from the encoded deployment config
          if (deployment) {
            if (action !== "DELETED") {
              deployment.causes = $filter('deploymentCauses')(deployment);
            }
          }
          else {
            angular.forEach($scope.deployments, function(deployment) {
              deployment.causes = $filter('deploymentCauses')(deployment);
            });
          }

          Logger.log("deployments (subscribe)", $scope.deployments);
        }));

        watches.push(DataService.watch({
          group: "extensions",
          resource: "replicasets"
        }, context, function(replicaSets) {
          // TODO: This should be updated to only include replica sets that do not have a deployment.
          $scope.unfilteredReplicaSets = replicaSets.by("metadata.name");
          LabelFilter.addLabelSuggestionsFromResources($scope.unfilteredReplicaSets, $scope.labelSuggestions);
          LabelFilter.setLabelSuggestions($scope.labelSuggestions);
          $scope.replicaSets = LabelFilter.getLabelSelector().select($scope.unfilteredReplicaSets);
          Logger.log("replicasets (subscribe)", $scope.replicaSets);
        }));

        watches.push(DataService.watch("deploymentconfigs", context, function(deploymentConfigs) {
          $scope.unfilteredDeploymentConfigs = deploymentConfigs.by("metadata.name");
          LabelFilter.addLabelSuggestionsFromResources($scope.unfilteredDeploymentConfigs, $scope.labelSuggestions);
          LabelFilter.setLabelSuggestions($scope.labelSuggestions);
          $scope.deploymentConfigs = LabelFilter.getLabelSelector().select($scope.unfilteredDeploymentConfigs);
          $scope.emptyMessage = "No deployment configurations to show";
          $scope.deploymentsByDeploymentConfig = DeploymentsService.associateDeploymentsToDeploymentConfig($scope.deployments, $scope.deploymentConfigs, true);
          if ($scope.deploymentsByDeploymentConfig['']) {
            $scope.unfilteredReplicationControllers = $scope.deploymentsByDeploymentConfig[''];
            $scope.deploymentsByDeploymentConfig[''] = LabelFilter.getLabelSelector().select($scope.deploymentsByDeploymentConfig['']);
          }
          updateFilterWarning();
          Logger.log("deploymentconfigs (subscribe)", $scope.deploymentConfigs);
        }));

        watches.push(DataService.watch({
          group: "extensions",
          resource: "deployments"
        }, context, function(k8sDeployments) {
          $scope.unfilteredK8SDeployments = k8sDeployments.by("metadata.name");
          LabelFilter.addLabelSuggestionsFromResources($scope.unfilteredK8SDeployments, $scope.labelSuggestions);
          LabelFilter.setLabelSuggestions($scope.labelSuggestions);
          $scope.k8sDeployments = LabelFilter.getLabelSelector().select($scope.unfilteredK8SDeployments);
          Logger.log("k8sDeployments (subscribe)", $scope.unfilteredK8SDeployments);
        }));

        function updateFilterWarning() {
          var isFiltering = !LabelFilter.getLabelSelector().isEmpty();
          if (!isFiltering) {
            delete $scope.alerts["deployments"];
            return;
          }

          var unfilteredDeploymentsEmpty =
            _.isEmpty($scope.unfilteredDeploymentConfigs) &&
            _.isEmpty($scope.unfilteredReplicationControllers) &&
            _.isEmpty($scope.unfilteredK8SDeployments) &&
            _.isEmpty($scope.unfilteredReplicaSets);
          if (unfilteredDeploymentsEmpty) {
            delete $scope.alerts["deployments"];
            return;
          }

          var filteredDeploymentsEmpty =
            _.isEmpty($scope.deploymentConfigs) &&
            _.isEmpty($scope.deploymentsByDeploymentConfig['']) &&
            _.isEmpty($scope.k8sDeployments) &&
            _.isEmpty($scope.replicaSets);
          if (!filteredDeploymentsEmpty) {
            delete $scope.alerts["deployments"];
            return;
          }

          $scope.alerts["deployments"] = {
            type: "warning",
            details: "The active filters are hiding all deployments."
          };
        }

        $scope.showEmptyMessage = function() {
          if ($filter('hashSize')($scope.deploymentsByDeploymentConfig) === 0) {
            return true;
          }

          if ($filter('hashSize')($scope.deploymentsByDeploymentConfig) === 1 && $scope.deploymentsByDeploymentConfig['']) {
            return true;
          }

          return false;
        };

        LabelFilter.onActiveFiltersChanged(function(labelSelector) {
          // trigger a digest loop
          $scope.$apply(function() {
            $scope.deploymentConfigs = labelSelector.select($scope.unfilteredDeploymentConfigs);
            $scope.deploymentsByDeploymentConfig = DeploymentsService.associateDeploymentsToDeploymentConfig($scope.deployments, $scope.deploymentConfigs, true);
            if ($scope.deploymentsByDeploymentConfig['']) {
              $scope.unfilteredReplicationControllers = $scope.deploymentsByDeploymentConfig[''];
              $scope.deploymentsByDeploymentConfig[''] = LabelFilter.getLabelSelector().select($scope.deploymentsByDeploymentConfig['']);
            }
            $scope.k8sDeployments = labelSelector.select($scope.unfilteredK8SDeployments);
            $scope.replicaSets = labelSelector.select($scope.unfilteredReplicaSets);
            updateFilterWarning();
          });
        });

        $scope.$on('$destroy', function(){
          DataService.unwatchAll(watches);
        });
      }));
  });
