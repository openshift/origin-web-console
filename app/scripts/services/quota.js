'use strict';

angular.module("openshiftConsole")
  .factory("QuotaService", function(APIService,
                                    $filter,
                                    $q,
                                    DataService,
                                    Logger) {

    var isNil = $filter('isNil');
    var usageValue = $filter('usageValue');
    var isBestEffortPod = function(pod) {
      // To be best effort a pod must not have any containers that have non-zero requests or limits
      // Break out as soon as we find any pod with a non-zero request or limit
      return _.every(pod.spec.containers, function(container){
        var hasNonZeroRequest = _.some(_.get(container, 'resources.requests'), function(request){
          return !isNil(request) && usageValue(request) !== 0;
        });
        var hasNonZeroLimit = _.some(_.get(container, 'resources.limits'), function(limit){
          return !isNil(limit) && usageValue(limit) !== 0;
        });
        return !hasNonZeroRequest && !hasNonZeroLimit;
      });
    };

    var isTerminatingPod = function(pod) {
      // a pod is terminating if activeDeadlineSeconds is set, ADS can be zero
      return _.has(pod, 'spec.activeDeadlineSeconds');
    };

    var filterQuotasForPodTemplate = function(podTemplate, quotas) {
      var bestEffortPod = isBestEffortPod(podTemplate);
      var terminatingPod = isTerminatingPod(podTemplate);
      return _.filter(quotas, function(quota){
        // A quota matches a pod if all scopes match the pod
        // Break out early if we find any scope that does not match
        var matchesPod = function(scope) {
          switch(scope) {
            case "Terminating":
              return terminatingPod;
            case "NotTerminating":
              return !terminatingPod;
            case "BestEffort":
              return bestEffortPod;
            case "NotBestEffort":
              return !bestEffortPod;
          }
          return true;
        };
        var scopes = quota.spec.quota ? quota.spec.quota.scopes : quota.spec.scopes;
        return _.every(scopes, matchesPod);
      });
    };

    var filterQuotasForResource = function(resource, quotas) {
      if (!resource) {
        return quotas;
      }
      if (resource.kind === 'Pod') {
        return filterQuotasForPodTemplate(resource, quotas);
      }
      else if (_.has(resource, "spec.template")) {
        return filterQuotasForPodTemplate(resource.spec.template, quotas);
      }
      // We plan on having other resources that scopes will affect
      return quotas;
    };

    var humanizeQuotaResource = $filter('humanizeQuotaResource');
    var humanizeKind = $filter('humanizeKind');

    var getQuotaResourceReachedAlert = function(quota, resource, type) {
      var q = quota.status.total || quota.status;
      if (usageValue(q.hard[type]) <= usageValue(q.used[type])) {
        var details, message;
        if (resource.kind === 'Pod') {
          details = "You will not be able to create the " + humanizeKind(resource.kind) + " '" + resource.metadata.name + "'.";
        }
        else {
          details = "You can still create " + humanizeKind(resource.kind) + " '" + resource.metadata.name + "' but no pods will be created until resources are freed.";
        }
        if (type === "pods") {
          message = 'You are at your quota for pods.';
        }
        else {
          message = 'You are at your quota for ' + humanizeQuotaResource(type) + ' on pods.';
        }
        return {
          type: resource.kind === 'Pod' ? 'error' : 'warning',
          message: message,
          details: details,
          links: [{
            href: "project/" + quota.metadata.namespace + "/quota",
            label: "View Quota",
            target: "_blank"
          }]
        };
      }
      return null;
    };

    var QUOTA_TYPE_TO_RESOURCE = {
      'cpu': "resources.requests.cpu",
      'requests.cpu': "resources.requests.cpu",
      'limits.cpu': "resources.limits.cpu",
      'memory': "resources.requests.memory",
      'requests.memory': "resources.requests.memory",
      'limits.memory': "resources.limits.memory"
    };

    var getRequestedResourceQuotaAlert = function(quota, resource, podTemplate, type) {
      var q = quota.status.total || quota.status;
      var containerField = QUOTA_TYPE_TO_RESOURCE[type];
      var templateTotal = 0;
      _.each(podTemplate.spec.containers, function(container) {
        var templateVal = _.get(container, containerField);
        if (templateVal) {
          templateTotal += usageValue(templateVal);
        }
      });
      if (usageValue(q.hard[type]) < usageValue(q.used[type]) + templateTotal) {
        var detail;
        if (resource.kind === 'Pod') {
          detail = "You may not be able to create the " + humanizeKind(resource.kind) + " '" + resource.metadata.name + "'.";
        }
        else {
          detail = "You can still create " + humanizeKind(resource.kind) + " '" + resource.metadata.name + "' but you may not have pods created until resources are freed.";
        }
        return {
          type: 'warning',
          message: 'You are close to your quota for ' + humanizeQuotaResource(type) + " on pods.",
          details: detail,
          links: [{
            href: "project/" + quota.metadata.namespace + "/quota",
            label: "View Quota",
            target: "_blank"
          }]
        };
      }
    };

    var getResourceLimitAlerts = function(resource, quota){
      var alerts = [];
      var podTemplate = resource.kind === "Pod" ? resource : _.get(resource, 'spec.template');
      if (!podTemplate) {
        // Didn't have a pod template, so we don't care about this resource
        return alerts;
      }

      // Otherwise this is a pod or something that creates pods so return alerts if we are at quota already
      // for any of these.  If you add new types to this list, add them to the type map above, or exclude
      // them from the total checks.
      _.each([
        'cpu',
        'memory',
        'requests.cpu',
        'requests.memory',
        'limits.cpu',
        'limits.memory',
        'pods'
      ], function(type) {
        var q = quota.status.total || quota.status;
        // Don't check 'pods' quota if the resource is a pod, that will create duplicate warnings in combination with getQuotaAlerts
        if (resource.kind === 'Pod' && type === 'pods') {
          return;
        }
        if (!isNil(q.hard[type])) {
          var quotaReachedAlert = getQuotaResourceReachedAlert(quota, resource, type);
          if (quotaReachedAlert) {
            alerts.push(quotaReachedAlert);
          }
          else if (type !== 'pods') {
            // Only calculate this if we havent already reached quota
            var requestedAlert = getRequestedResourceQuotaAlert(quota, resource, podTemplate, type);
            if (requestedAlert) {
              alerts.push(requestedAlert);
            }
          }
        }
      });

      return alerts;
    };

    var getQuotaAlerts = function(resources, quotas, clusterQuotas) {
      var alerts = [];

      if (!resources || !quotas) {
        return alerts;
      }

      _.each(resources, function(resource) {
        var filteredQuotas = filterQuotasForResource(resource, quotas);
        var filteredClusterQuotas = filterQuotasForResource(resource, clusterQuotas);

        var rgv = APIService.objectToResourceGroupVersion(resource);
        var humanizedResource = APIService.kindToResource(resource.kind, true);
        var humanizedKind = humanizeKind(resource.kind);
        var quotaKey = "";
        if (rgv.group) {
          quotaKey = rgv.group + "/";
        }
        quotaKey += rgv.resource;
        var alertsForQuota = function(quota) {
          var q = quota.status.total || quota.status;
          if(!isNil(q.hard[quotaKey]) && usageValue(q.hard[quotaKey]) <= usageValue(q.used[quotaKey])) {
            alerts.push({
              type: 'error',
              message: "You are at your quota of " + q.hard[quotaKey] + " " + (q.hard[quotaKey] === "1" ? humanizedKind : humanizedResource) +
                        " in this project.",
              details: "You will not be able to create the " + humanizedKind + " '" + resource.metadata.name + "'.",
              links: [{
                href: "project/" + quota.metadata.namespace + "/quota",
                label: "View Quota",
                target: "_blank"
              }]
            });
          }

          alerts = alerts.concat(getResourceLimitAlerts(resource, quota));
        };
        _.each(filteredQuotas, alertsForQuota);
        _.each(filteredClusterQuotas, alertsForQuota);
      });

      return alerts;
    };

    var getLatestQuotaAlerts = function(resources, context) {
      var result = $q.defer();
      var quotaAlerts = [];
      var quotas, clusterQuotas;
      var remaining = 2;
      function _checkDone() {
        if (remaining === 0) {
          quotaAlerts = getQuotaAlerts(resources, quotas, clusterQuotas);
          result.resolve({quotaAlerts: quotaAlerts});
        }
      }

      // double check using the latest quotas
      DataService.list("resourcequotas", context, function(quotaData) {
        quotas = quotaData.by("metadata.name");
        Logger.log("quotas", quotas);
        remaining--;
        _checkDone();
      });

      DataService.list("appliedclusterresourcequotas", context, function(clusterQuotaData) {
        clusterQuotas = clusterQuotaData.by("metadata.name");
        Logger.log("cluster quotas", clusterQuotas);
        remaining--;
        _checkDone();
      });

      // TODO when DataService.List supports error callbacks an error retrieving the lists should reject the promise
      // So that failing to check your quota doesn't block app creation.

      return result.promise;
    };

    var isAnyQuotaExceeded = function(quotas, clusterQuotas) {
        var isExceeded = function(quota) {
          var q = quota.status.total || quota.status;
          return _.some(q.hard, function(hard, quotaKey) {
            // We always ignore quota warnings about being out of resourcequotas since end users cant do anything about it
            if (quotaKey === 'resourcequotas') {
              return false;
            }
            return !isNil(hard) && usageValue(hard) <= usageValue(q.used[quotaKey]);
          });
        };
        return _.some(quotas, isExceeded) || _.some(clusterQuotas, isExceeded);
    };

    return {
      filterQuotasForResource: filterQuotasForResource,
      isBestEffortPod: isBestEffortPod,
      isTerminatingPod: isTerminatingPod,
      getResourceLimitAlerts: getResourceLimitAlerts,
      // Gets quota alerts relevant to a set of resources
      // Returns: Array of alerts
      getQuotaAlerts: getQuotaAlerts,
      getLatestQuotaAlerts: getLatestQuotaAlerts,
      isAnyQuotaExceeded: isAnyQuotaExceeded
    };
  });
