'use strict';

angular.module("openshiftConsole")
  .factory("LimitRangesService", function($filter) {
    var usageValue = $filter('usageValue');
    var usageWithUnits = $filter('usageWithUnits');

    var isSmaller = function(candidate, previous) {
      if (!candidate) {
        return false;
      }

      // No previous value, so use candidate.
      if (!previous) {
        return true;
      }

      // Normalize units to compare.
      return usageValue(candidate) < usageValue(previous);
    };

    var isLarger = function(candidate, previous) {
      if (!candidate) {
        return false;
      }

      // No previous value, so use candidate.
      if (!previous) {
        return true;
      }

      // Normalize units to compare.
      return usageValue(candidate) > usageValue(previous);
    };

    // Reconciles multiple limit range resources for a compute resource ('cpu'
    // or 'memory') and resource type ('Container' or 'Pod'). Returns an object
    // with the following properties if defined:
    //
    //   min, max, defaultLimit, defaultRequest, maxLimitRequestRatio
    //
    // For example,
    //
    // {
    //   min: "100m",
    //   max: "2",
    //   defaultLimit: "300m",
    //   defaultRequest: "200m",
    //   maxLimitRequestRatio: "10"
    //   min: "200m",
    //   max: "2",
    // }

    var getEffectiveLimitRange = function(limitRanges, computeResource, resourceType) {
      var effectiveRange = {};
      angular.forEach(limitRanges, function(limitRange) {
        angular.forEach(limitRange.spec.limits, function(limit) {
          if (limit.type !== resourceType) {
            return;
          }

          // Find the largest minimum.
          if (limit.min && isLarger(limit.min[computeResource], effectiveRange.min)) {
            effectiveRange.min = limit.min[computeResource];
          }
          // Find the smallest maximum.
          if (limit.max && isSmaller(limit.max[computeResource], effectiveRange.max)) {
            effectiveRange.max = limit.max[computeResource];
          }
          // Find default limit and request.
          // TODO: Decide the correct behavior when there is more than one
          //       limit range with different defaults set.
          if (limit['default']) {
            effectiveRange.defaultLimit = limit['default'][computeResource] || effectiveRange.defaultLimit;
          }
          if (limit.defaultRequest) {
            effectiveRange.defaultRequest = limit.defaultRequest[computeResource] || effectiveRange.defaultRequest;
          }
          // Find the smallest max limit/request ratio.
          var maxRatio;
          if (limit.maxLimitRequestRatio) {
            maxRatio = limit.maxLimitRequestRatio[computeResource];
            if (maxRatio && (!effectiveRange.maxLimitRequestRatio ||
                             maxRatio < effectiveRange.maxLimitRequestRatio)) {
              effectiveRange.maxLimitRequestRatio = maxRatio;
            }
          }
        });
      });

      return effectiveRange;
    };

    // Tests that the total request and total limit for all containers is
    // within the limit range minimum and maximum, respectively, for the pod.
    // Returns an array of error messages, or an empty array if no problems.
    var validatePodLimits = function(limitRanges, computeResource, containers) {
      if (!containers || !containers.length) {
        return [];
      }

      var podLimits = getEffectiveLimitRange(limitRanges, computeResource, 'Pod');
      var containerLimits = getEffectiveLimitRange(limitRanges, computeResource, 'Container');

      // Use usageValue to normalize units.
      var requestTotal = 0,
          limitTotal = 0,
          min = podLimits.min && usageValue(podLimits.min),
          max = podLimits.max && usageValue(podLimits.max),
          problems = [],
          computeResourceLabel = $filter('computeResourceLabel')(computeResource, true);

      // Total the usage for all containers.
      angular.forEach(containers, function(container) {
        // If no resources set, validate against defaults.
        var resources = container.resources || {};

        var request = (resources.requests && resources.requests[computeResource]) || containerLimits.defaultRequest;
        if (request) {
          requestTotal += usageValue(request);
        }

        var limit = (resources.limits && resources.limits[computeResource]) || containerLimits.defaultLimit;
        if (limit) {
          limitTotal += usageValue(limit);
        }
      });

      if (min && requestTotal < min) {
        problems.push(computeResourceLabel + " request total for all containers is less than pod minimum (" + usageWithUnits(podLimits.min, computeResource) + ").");
      }
      if (max && requestTotal > max) {
        problems.push(computeResourceLabel + " request total for all containers is greater than pod maximum (" + usageWithUnits(podLimits.max, computeResource) + ").");
      }

      if (min && limitTotal < min) {
        problems.push(computeResourceLabel + " limit total for all containers is less than pod minimum (" + usageWithUnits(podLimits.min, computeResource) + ").");
      }
      if (max && limitTotal > max) {
        problems.push(computeResourceLabel + " limit total for all containers is greater than pod maximum (" + usageWithUnits(podLimits.max, computeResource) + ").");
      }

      return problems;
    };

    return {
      getEffectiveLimitRange: getEffectiveLimitRange,
      validatePodLimits: validatePodLimits
    };
  });
