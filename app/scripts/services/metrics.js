'use strict';

angular.module("openshiftConsole")
  .factory("MetricsService", function($filter, $http, $q, APIDiscovery) {
    var POD_COUNTER_TEMPLATE = "/counters/{containerName}%2F{podUID}%2F{metric}/data";
    var POD_GAUGE_TEMPLATE = "/gauges/{containerName}%2F{podUID}%2F{metric}/data";

    // Used in compact view.
    var POD_QUERY = "?stacked=true&tags=descriptor_name:{metric},type:{type},pod_name:{podName}";
    var POD_STACKED_COUNTER_TEMPLATE = "/counters/data" + POD_QUERY;
    var POD_STACKED_GAUGE_TEMPLATE = "/gauges/data" + POD_QUERY;

    // Find metrics matching the RC selector.
    var RC_QUERY = "?stacked=true&tags=descriptor_name:{metric},type:{type},labels:{labels}";
    var RC_COUNTER_TEMPLATE = "/counters/data" + RC_QUERY;
    var RC_GAUGE_TEMPLATE = "/gauges/data" + RC_QUERY;

    // URL template to show for each type of metric.
    var podURLTemplateByMetric = {
      "cpu/usage": POD_COUNTER_TEMPLATE,
      "memory/usage": POD_GAUGE_TEMPLATE,
      "network/rx": POD_COUNTER_TEMPLATE,
      "network/tx": POD_COUNTER_TEMPLATE
    };

    // URL template to show for each type of metric.
    var podStackedURLTemplateByMetric = {
      "cpu/usage": POD_STACKED_COUNTER_TEMPLATE,
      "memory/usage": POD_STACKED_GAUGE_TEMPLATE,
      "network/rx": POD_STACKED_COUNTER_TEMPLATE,
      "network/tx": POD_STACKED_COUNTER_TEMPLATE
    };

    var deploymentURLTemplateByMetric = {
      "cpu/usage": RC_COUNTER_TEMPLATE,
      "memory/usage": RC_GAUGE_TEMPLATE,
      "network/rx": RC_COUNTER_TEMPLATE,
      "network/tx": RC_COUNTER_TEMPLATE
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
      if (config.pod && !config.stacked && point.samples < 2) {
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

    function labelRegex(selector) {
      var regex = '^';
      _.each(selector, function(value, key) {
        // Use lookarounds to find the labels in any order. They're stored as name:value tags in Hawkular.
        regex += '(?=.*\\b' + key + ':' + value + '\\b)';
      });
      regex += '.*$';

      return regex;
    }

    function getRequestURL(config) {
      return getMetricsURL().then(function(metricsURL) {
        var template;

        // Are we requesting deployment-level metrics?
        var type;
        if (config.deployment) {
          template = metricsURL + deploymentURLTemplateByMetric[config.metric];
          switch (config.metric) {
          case 'network/rx':
          case 'network/tx':
            type = 'pod';
            break;
          default:
            type = 'pod_container';
          }

          var selector = _.get(config, 'deployment.spec.selector', {});
          var labels = labelRegex(selector);
          return URI.expand(template, {
            labels: labels,
            metric: config.metric,
            type: type
          }).toString();
        }

        // Are we requesting stacked pod metrics?
        if (config.stacked) {
          template = metricsURL + podStackedURLTemplateByMetric[config.metric];
          switch (config.metric) {
          case 'network/rx':
          case 'network/tx':
            type = 'pod';
            break;
          default:
            type = 'pod_container';
          }
          return URI.expand(template, {
            podName: config.pod.metadata.name,
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

    var connectionSucceeded, connectionFailed;
    var isAvailable = function(testConnection) {
      return getMetricsURL().then(function(url) {
        if (!url) {
          return false;
        }

        if (!testConnection) {
          return true;
        }

        // A previous connection succeeded.
        if (connectionSucceeded) {
          return true;
        }

        // A previous connection failed.
        if (connectionFailed) {
          return false;
        }

        return $http.get(url).then(function() {
          connectionSucceeded = true;
          return true;
        }, function() {
          connectionFailed = true;
          return false;
        });
      });
    };

    return {
      // Check if the metrics service is available. The service is considered
      // available if a metrics URL is set. Returns a promise resolved with a
      // boolean value.
      isAvailable: isAvailable,

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
          if (!url) {
            return null;
          }

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
