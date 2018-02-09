'use strict';

angular.module("openshiftConsole")
  .factory("HPAService", function($filter, $q, LimitRangesService, MetricsService) {

    var annotation = $filter('annotation');

    // Checks if all containers have a value set for the compute resource request or limit.
    //
    // computeResource  - 'cpu' or 'memory'
    // requestsOrLimits - 'requests' or 'limits'
    // containers       - array of containters from a deployment config or replication controller
    var hasRequestOrLimit = function(computeResource, requestsOrLimits, containers) {
      return _.every(containers, function(container) {
        return _.get(container, ['resources', requestsOrLimits, computeResource]);
      });
    };

    var hasRequestSet = function(computeResource, containers) {
      return hasRequestOrLimit(computeResource, 'requests', containers);
    };

    var hasLimitSet = function(computeResource, containers) {
      return hasRequestOrLimit(computeResource, 'limits', containers);
    };

    // Checks if there's a default for the compute resource request or limit in any LimitRange.
    //
    // computeResource  - 'cpu' or 'memory'
    // defaultType      - 'defaultRequest' or 'defaultLimit'
    // limitRanges     - collection of LimitRange objects (hash or array)
    var hasDefault = function(computeResource, defaultType, limitRanges) {
      var effectiveLimits = LimitRangesService.getEffectiveLimitRange(limitRanges, computeResource, 'Container');
      return !!effectiveLimits[defaultType];
    };

    var hasDefaultRequest = function(computeResource, limitRanges) {
      return hasDefault(computeResource, 'defaultRequest', limitRanges);
    };

    var hasDefaultLimit = function(computeResource, limitRanges) {
      return hasDefault(computeResource, 'defaultLimit', limitRanges);
    };

    // Checks if a CPU request is currently set or will be defaulted for any
    // container when the pod is created. A CPU request is required for autoscaling.
    //
    // containers       - array of containters from a deployment config or replication controller
    // limitRanges      - collection of LimitRange objects (hash or array)
    // project          - the project to determine if cluster resource overrides are enabled
    var hasCPURequest = function(containers, limitRanges, project) {
      // If CRO is enabled, don't try to validate CPU request.
      if (LimitRangesService.hasClusterResourceOverrides(project)) {
        return true;
      }

      if (hasRequestSet('cpu', containers) || hasDefaultRequest('cpu', limitRanges)) {
        return true;
      }

      // The request will be defaulted from the limit when the pod is created.
      if (hasLimitSet('cpu', containers) || hasDefaultLimit('cpu', limitRanges, containers)) {
        return true;
      }

      return false;
    };

    // Filters the HPAs for those referencing kind/name.
    var filterHPA = function(hpaResources, kind, name) {
      return _.filter(hpaResources, function(hpa) {
        return hpa.spec.scaleTargetRef.kind === kind && hpa.spec.scaleTargetRef.name === name;
      });
    };

    var humanizeKind = $filter('humanizeKind');
    var hasDeploymentConfig = $filter('hasDeploymentConfig');


    var hasMetricsAvailableWarning = function(metricsAvailable) {
      if (!metricsAvailable) {
        return {
          message: 'Metrics might not be configured by your cluster administrator. ' +
                   'Metrics are required for autoscaling.',
          reason: 'MetricsNotAvailable'
        };
      }
    };


    var hasCPURequestWarning = function(scaleTarget, limitRanges, project) {
      var containers = _.get(scaleTarget, 'spec.template.spec.containers', []);
      var kind;
      if (!hasCPURequest(containers, limitRanges, project)) {
        kind = humanizeKind(scaleTarget.kind);
        return {
          message: 'This ' + kind + ' does not have any containers with a CPU request set. ' +
                   'Autoscaling will not work without a CPU request.',
          reason: 'NoCPURequest'
        };
      }
    };


    var hasV2HPAAnnotations = function(hpaResources) {
      return _.some(hpaResources, function(hpa) {
        return annotation(hpa, 'autoscaling.alpha.kubernetes.io/metrics');
      });
    };


    var hasCompetingAutoscalersWarning = function(hpaResources) {
      if (_.size(hpaResources) > 1) {
        return {
          message: 'More than one autoscaler is scaling this resource. ' +
                   'This is not recommended because they might compete with each other. ' +
                   'Consider removing all but one autoscaler.',
          reason: 'MultipleHPA'
        };
      }
    };


    var hasCompetingDCAndAutoscalerWarning = function(scaleTarget, hpaResources) {
      // Warn about replication controllers that have both an HPA and DC, but
      // make sure an HPA targets the replication controller directly and
      // not its parent DC.
      var targetsRC = function() {
        return _.some(hpaResources, function(hpa) {
          return _.get(hpa, 'spec.scaleTargetRef.kind') === 'ReplicationController';
        });
      };

      if (scaleTarget.kind === 'ReplicationController' &&
          hasDeploymentConfig(scaleTarget) &&
          _.some(hpaResources, targetsRC)) {
        return {
          message: 'This deployment is scaled by both a deployment configuration and an autoscaler. ' +
                   'This is not recommended because they might compete with each other.',
          reason: 'DeploymentHasHPA'
        };
      }
    };


    // Gets HPA warnings.
    //
    // scaleTarget      - the object being scaled (DC or RC)
    // hpaResources     - collection of HPA resources (already filtered to this object)
    // limitRanges      - collection of LimitRange objects (hash or array)
    // project          - the project to determine if a request/limit ratio is set
    //
    // Returns an array of warnings, each an object with `message` and `reason` properties.
    var getHPAWarnings = function(scaleTarget, hpaResources, limitRanges, project) {
      if (!scaleTarget || _.isEmpty(hpaResources)) {
        return $q.when([]);
      }
      return MetricsService.isAvailable().then(function(metricsAvailable) {
        var isV2HPA = hasV2HPAAnnotations(hpaResources);
        return _.compact([
          hasMetricsAvailableWarning(metricsAvailable),
          // we don't need to show this warning, but if we have it, we should also
          // not show the cpuRequestWarning, until we update to the newer API
          isV2HPA ? false : hasCPURequestWarning(scaleTarget, limitRanges, project),
          hasCompetingAutoscalersWarning(hpaResources),
          hasCompetingDCAndAutoscalerWarning(scaleTarget, hpaResources)
        ]);
      });
    };


    // Group HPAs by the object they scale.
    //
    // Returns an hpaByResource map with
    //   path:   hpaByResource[kind][name]
    //   value:  array of HPA objects
    var groupHPAs = function(horizontalPodAutoscalers) {
      var hpaByResource = {};
      _.each(horizontalPodAutoscalers, function(hpa) {
        var name = hpa.spec.scaleTargetRef.name, kind = hpa.spec.scaleTargetRef.kind;
        if (!name || !kind) {
          return;
        }

        // TODO: Handle groups and subresources in hpa.spec.scaleTargetRef
        // var groupVersion = APIService.parseGroupVersion(hpa.spec.scaleTargetRef.apiVersion) || {};
        // var group = groupVersion.group || '';
        // if (!_.has(hpaByResource, [group, kind, name])) {
        //   _.set(hpaByResource, [group, kind, name], []);
        // }
        // hpaByResource[group][kind][name].push(hpa);

        if (!_.has(hpaByResource, [kind, name])) {
          _.set(hpaByResource, [kind, name], []);
        }
        hpaByResource[kind][name].push(hpa);
      });

      return hpaByResource;
    };

    // currently unsupported by the webconsole
    var usesV2Metrics = function(hpa) {
      return hasV2HPAAnnotations([hpa]);
    };

    return {
      usesV2Metrics: usesV2Metrics,
      hasCPURequest: hasCPURequest,
      filterHPA: filterHPA,
      getHPAWarnings: getHPAWarnings,
      groupHPAs: groupHPAs
    };
  });
