'use strict';

angular.module("openshiftConsole")
  .factory("MetricsService", function($http, $q, APIDiscovery) {
    var POD_COUNTER_TEMPLATE = "/counters/{containerName}%2F{podUID}%2F{metric}/data";
    var POD_GAUGE_TEMPLATE = "/gauges/{containerName}%2F{podUID}%2F{metric}/data";

    // Use a regex to match the label deployement=<name> at word boundaries. In Hawkular, it's
    // stored as a comma-separated list of values in the form name:value.
    var DEPLOYMENT_COUNTER_TEMPLATE = "/counters/data?stacked=true&tags=descriptor_name:{metric},type:{type},labels:.*\\bdeployment:{deployment}\\b.*";
    var DEPLOYMENT_GAUGE_TEMPLATE = "/gauges/data?stacked=true&tags=descriptor_name:{metric},type:{type},labels:.*\\bdeployment:{deployment}\\b.*";

    // URL template to show for each type of metric.
    var podURLTemplateByMetric = {
      "cpu/usage": POD_COUNTER_TEMPLATE,
      "memory/usage": POD_GAUGE_TEMPLATE,
      "network/rx": POD_COUNTER_TEMPLATE,
      "network/tx": POD_COUNTER_TEMPLATE
    };

    var deploymentURLTemplateByMetric = {
      "cpu/usage": DEPLOYMENT_COUNTER_TEMPLATE,
      "memory/usage": DEPLOYMENT_GAUGE_TEMPLATE,
      "network/rx": DEPLOYMENT_COUNTER_TEMPLATE,
      "network/tx": DEPLOYMENT_COUNTER_TEMPLATE
    };

    var metricsURL;
    function getMetricsURL() {
      if (angular.isDefined(metricsURL)) {
        return $q.when(metricsURL);
      }

      return APIDiscovery.getMetricsURL().then(function(url) {
        // Remove trailing slash if present.
        metricsURL = (url || '').replace(/\/$/, "");
        return metricsURL;
      });
    }

    // Is there engouh data to compare min and max values to calculate a usage
    // rate for a counter metric like CPU or network?
    function canCalculateRate(point, config) {
      // If there isn't a min or max, we can't compare.
      if (!point.min || !point.max) {
        return false;
      }

      if (!point.start || !point.end) {
        return false;
      }

      // For pod metrics, if samples < 2, min and max will always be the same
      // because there aren't enough samples in the bucket.
      // For deployment metrics that are "stacked," samples has a different
      // meaning. It is set to 1 if there is one pod, even when min and max
      // have different values, so don't ignore this point.
      if (config.pod && point.samples < 2) {
        return false;
      }

      return true;
    }

    // Convert cumulative CPU usage in nanoseconds to millicores.
    function millicoresUsed(point, config) {
      if (!canCalculateRate(point, config)) {
        return null;
      }

      var timeInMillis = point.end - point.start;
      if (timeInMillis === 0) {
        return null;
      }

      // Find the usage for just this bucket by comparing min and max.
      // Values are in nanoseconds. Calculate usage in millis.
      var usageInMillis = (point.max - point.min) / 1000000;
      // Convert to millicores.
      return (usageInMillis / timeInMillis) * 1000;
    }

    // Convert cumulative usage to usage rate, doesn't change units.
    function bytesUsedPerSecond(point, config) {
      if (!canCalculateRate(point, config)) {
        return null;
      }

      var seconds = (point.end - point.start) / 1000;
      if (seconds === 0) {
        return null;
      }

      var bytesUsed = point.max - point.min;
      return bytesUsed / seconds;
    }

    function normalize(data, config) {
      if (!data.length) {
        return;
      }

      angular.forEach(data, function(point) {
        // Set point.value to the average or null if no average.
        if (!point.value || point.value === "NaN") {
          var avg = point.avg;
          point.value = (avg && avg !== "NaN") ? avg : null;
        }

        if (config.metric === 'cpu/usage') {
          point.value = millicoresUsed(point, config);
        }

        // Network is cumulative, convert to amount per point.
        if (/network\/rx|tx/.test(config.metric)) {
          point.value = bytesUsedPerSecond(point, config);
        }
      });

      return data;
    }

    function getRequestURL(config) {
      return getMetricsURL().then(function(metricsURL) {
        var template;

        // Are we requesting deployment-level metrics?
        if (config.deployment) {
          template = metricsURL + deploymentURLTemplateByMetric[config.metric];
          var type;
          switch (config.metric) {
          case 'network/rx':
          case 'network/tx':
            type = 'pod';
            break;
          default:
            type = 'pod_container';
          }
          return URI.expand(template, {
            deployment: config.deployment,
            metric: config.metric,
            type: type
          }).toString();
        }

        // Otherwise, get metrics for a pod.
        template = metricsURL + podURLTemplateByMetric[config.metric];
        return URI.expand(template, {
          podUID: config.pod.metadata.uid,
          containerName: config.containerName,
          metric: config.metric
        }).toString();
      });
    }

    return {
      // Check if the metrics service is available. The service is considered
      // available if a metrics URL is set. Returns a promise resolved with a
      // boolean value.
      isAvailable: function() {
        return getMetricsURL().then(function(url) {
          return !!url;
        });
      },

      getMetricsURL: getMetricsURL,

      // Get metrics data for a container.
      //
      // config keyword arguments
      //   pod:            the pod object
      //   containerName:  the container name
      //   metric:         the metric to check, e.g. "memory/usage"
      //   start:          start time in millis
      //   end:            end time in millis
      //
      // Returns a promise resolved with the metrics data.
      get: function(config) {
        return getRequestURL(config).then(function(url) {
          var params = {
            bucketDuration: config.bucketDuration,
            start: config.start
          };

          if (config.end) {
            params.end = config.end;
          }

          return $http.get(url, {
            auth: {},
            headers: {
              Accept: 'application/json',
              'Hawkular-Tenant': config.namespace
            },
            params: params
          }).then(function(response) {
            return _.assign(response, {
              metricID: config.metric,
              data: normalize(response.data, config)
            });
          });
        });
      }
    };
  });
