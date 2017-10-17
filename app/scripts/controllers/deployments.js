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
                                                 APIService,
                                                 DataService,
                                                 DeploymentsService,
                                                 LabelFilter,
                                                 Logger,
                                                 OwnerReferencesService,
                                                 ProjectsService) {
    $scope.projectName = $routeParams.project;
    $scope.replicationControllers = {};
    $scope.unfilteredDeploymentConfigs = {};
    $scope.unfilteredDeployments = {};
    $scope.replicationControllersByDC = {};
    $scope.labelSuggestions = {};
    $scope.emptyMessage = "Loading...";
    $scope.expandedDeploymentConfigRow = {};
    $scope.unfilteredReplicaSets = {};
    $scope.unfilteredReplicationControllers = {};
    $scope.showEmptyState = true;
    $scope.clearFilter = function() {
      LabelFilter.clear();
    };

    var replicaSets, deploymentsByUID;
    var annotation = $filter('annotation');

    var deploymentsVersion = APIService.getPreferredVersion('deployments');
    var deploymentConfigsVersion = APIService.getPreferredVersion('deploymentconfigs');
    var replicationControllersVersion = APIService.getPreferredVersion('replicationcontrollers');
    var replicaSetsVersion = APIService.getPreferredVersion('replicasets');

    function updateFilterMessage() {

      var unfilteredDeploymentsEmpty =
        _.isEmpty($scope.unfilteredDeploymentConfigs) &&
        _.isEmpty($scope.unfilteredReplicationControllers) &&
        _.isEmpty($scope.unfilteredDeployments) &&
        _.isEmpty($scope.unfilteredReplicaSets);

      var isFiltering = !LabelFilter.getLabelSelector().isEmpty();

      var filteredDeploymentsEmpty =
        _.isEmpty($scope.deploymentConfigs) &&
        _.isEmpty($scope.replicationControllersByDC['']) &&
        _.isEmpty($scope.deployments) &&
        _.isEmpty($scope.replicaSets);

      $scope.showEmptyState = unfilteredDeploymentsEmpty;
      $scope.filterWithZeroResults = isFiltering && filteredDeploymentsEmpty && !unfilteredDeploymentsEmpty;
    }

    var groupReplicaSets = function() {
      if (!replicaSets || !deploymentsByUID) {
        return;
      }

      $scope.replicaSetsByDeploymentUID = OwnerReferencesService.groupByControllerUID(replicaSets);
      $scope.unfilteredReplicaSets = _.get($scope, ['replicaSetsByDeploymentUID', ''], {});
      LabelFilter.addLabelSuggestionsFromResources($scope.unfilteredReplicaSets, $scope.labelSuggestions);
      LabelFilter.setLabelSuggestions($scope.labelSuggestions);
      $scope.replicaSets = LabelFilter.getLabelSelector().select($scope.unfilteredReplicaSets);

      $scope.latestReplicaSetByDeploymentUID = {};
      _.each($scope.replicaSetsByDeploymentUID, function(replicaSets, deploymentUID) {
        if (!deploymentUID) {
          return;
        }

        $scope.latestReplicaSetByDeploymentUID[deploymentUID] =
          DeploymentsService.getActiveReplicaSet(replicaSets, deploymentsByUID[deploymentUID]);
      });
      updateFilterMessage();
    };

    var watches = [];
    ProjectsService
      .get($routeParams.project)
      .then(_.spread(function(project, context) {
        $scope.project = project;

        watches.push(DataService.watch(replicationControllersVersion, context, function(replicationControllers, action, replicationController) {
          $scope.replicationControllers = replicationControllers.by("metadata.name");

          var dcName, rcName;
          if (replicationController) {
            dcName = annotation(replicationController, 'deploymentConfig');
            rcName = replicationController.metadata.name;
          }

          $scope.replicationControllersByDC = DeploymentsService.associateDeploymentsToDeploymentConfig($scope.replicationControllers, $scope.deploymentConfigs, true);
          if ($scope.replicationControllersByDC['']) {
            $scope.unfilteredReplicationControllers = $scope.replicationControllersByDC[''];
            LabelFilter.addLabelSuggestionsFromResources($scope.unfilteredReplicationControllers, $scope.labelSuggestions);
            LabelFilter.setLabelSuggestions($scope.labelSuggestions);
            $scope.replicationControllersByDC[''] = LabelFilter.getLabelSelector().select($scope.replicationControllersByDC['']);
          }
          updateFilterMessage();

          if (!action) {
            // Loading of the page that will create deploymentConfigDeploymentsInProgress structure, which will associate running deployment to his deploymentConfig.
            $scope.deploymentConfigDeploymentsInProgress = DeploymentsService.associateRunningDeploymentToDeploymentConfig($scope.replicationControllersByDC);
          } else if (action === 'ADDED' || (action === 'MODIFIED' && ['New', 'Pending', 'Running'].indexOf($filter('deploymentStatus')(replicationController)) > -1)) {
            // When new deployment id instantiated/cloned, or in case of a retry, associate him to his deploymentConfig and add him into deploymentConfigDeploymentsInProgress structure.
            $scope.deploymentConfigDeploymentsInProgress[dcName] = $scope.deploymentConfigDeploymentsInProgress[dcName] || {};
            $scope.deploymentConfigDeploymentsInProgress[dcName][rcName] = replicationController;
          } else if (action === 'MODIFIED') {
            // After the deployment ends remove him from the deploymentConfigDeploymentsInProgress structure.
            var status = $filter('deploymentStatus')(replicationController);
            if (status === "Complete" || status === "Failed"){
              delete $scope.deploymentConfigDeploymentsInProgress[dcName][rcName];
            }
          }

          // Extract the causes from the encoded deployment config
          if (replicationController) {
            if (action !== "DELETED") {
              replicationController.causes = $filter('deploymentCauses')(replicationController);
            }
          }
          else {
            angular.forEach($scope.replicationControllers, function(replicationController) {
              replicationController.causes = $filter('deploymentCauses')(replicationController);
            });
          }

          Logger.log("replicationControllers (subscribe)", $scope.replicationControllers);
        }));

        watches.push(DataService.watch(replicaSetsVersion, context, function(replicaSetsData) {
          replicaSets = replicaSetsData.by("metadata.name");
          groupReplicaSets();
          Logger.log("replicasets (subscribe)", $scope.replicaSets);
        }));

        watches.push(DataService.watch(deploymentConfigsVersion, context, function(deploymentConfigs) {
          $scope.deploymentConfigsLoaded = true;
          $scope.unfilteredDeploymentConfigs = deploymentConfigs.by("metadata.name");
          LabelFilter.addLabelSuggestionsFromResources($scope.unfilteredDeploymentConfigs, $scope.labelSuggestions);
          LabelFilter.setLabelSuggestions($scope.labelSuggestions);
          $scope.deploymentConfigs = LabelFilter.getLabelSelector().select($scope.unfilteredDeploymentConfigs);
          $scope.emptyMessage = "No deployment configurations to show";
          $scope.replicationControllersByDC = DeploymentsService.associateDeploymentsToDeploymentConfig($scope.replicationControllers, $scope.deploymentConfigs, true);
          if ($scope.replicationControllersByDC['']) {
            $scope.unfilteredReplicationControllers = $scope.replicationControllersByDC[''];
            $scope.replicationControllersByDC[''] = LabelFilter.getLabelSelector().select($scope.replicationControllersByDC['']);
          }
          updateFilterMessage();
          Logger.log("deploymentconfigs (subscribe)", $scope.deploymentConfigs);
        }));

        watches.push(DataService.watch(deploymentsVersion, context, function(deploymentData) {
          deploymentsByUID = $scope.unfilteredDeployments = deploymentData.by("metadata.uid");
          LabelFilter.addLabelSuggestionsFromResources($scope.unfilteredDeployments, $scope.labelSuggestions);
          LabelFilter.setLabelSuggestions($scope.labelSuggestions);
          $scope.deployments = LabelFilter.getLabelSelector().select($scope.unfilteredDeployments);
          groupReplicaSets();
          Logger.log("deployments (subscribe)", $scope.unfilteredDeployments);
        }));

        // Does the deployment config table have content?
        $scope.showDeploymentConfigTable = function() {
          var size = _.size($scope.replicationControllersByDC);
          return size > 1 || (size === 1 && !$scope.replicationControllersByDC['']);
        };

        LabelFilter.onActiveFiltersChanged(function(labelSelector) {
          // trigger a digest loop
          $scope.$evalAsync(function() {
            $scope.deploymentConfigs = labelSelector.select($scope.unfilteredDeploymentConfigs);
            $scope.replicationControllersByDC = DeploymentsService.associateDeploymentsToDeploymentConfig($scope.replicationControllers, $scope.deploymentConfigs, true);
            if ($scope.replicationControllersByDC['']) {
              $scope.unfilteredReplicationControllers = $scope.replicationControllersByDC[''];
              $scope.replicationControllersByDC[''] = LabelFilter.getLabelSelector().select($scope.replicationControllersByDC['']);
            }
            $scope.deployments = labelSelector.select($scope.unfilteredDeployments);
            $scope.replicaSets = labelSelector.select($scope.unfilteredReplicaSets);
            updateFilterMessage();
          });
        });

        $scope.$on('$destroy', function(){
          DataService.unwatchAll(watches);
        });
      }));
  });
