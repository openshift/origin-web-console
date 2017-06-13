'use strict';

angular.module('openshiftConsole')
  .factory('BindingModalUtils', [
    function() {
      return {
        sortApplications: function(deploymentConfigs,
                                    deployments,
                                    replicationControllers,
                                    replicaSets,
                                    statefulSets) {
          // Don't waste time sorting on each data load, just sort when we have them all
          if (deploymentConfigs && deployments && replicationControllers && replicaSets && statefulSets) {
            var apiObjects = deploymentConfigs.concat(deployments)
                                              .concat(replicationControllers)
                                              .concat(replicaSets)
                                              .concat(statefulSets);
            return _.sortByAll(apiObjects, ['metadata.name', 'kind']);
          }
          return null;
        }
      };
    }
  ]);
