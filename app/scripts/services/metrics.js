'use strict';

angular.module("openshiftConsole")
  .factory("MetricsService", function($filter, $http, $q, APIDiscovery) {
    var POD_GAUGE_TEMPLATE = "/gauges/{containerName}%2F{podUID}%2F{metric}/data";
    // Used in compact view.
    var POD_STACKED_TEMPLATE = "/gauges/data?stacked=true&tags=descriptor_name:{metric},type:{type},pod_name:{podName}";

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

    function normalize(data) {
      if (!data.length) {
        return;
      }

      _.each(data, function(point) {
        // Set point.value to the average or null if no average.
        if (!point.value || point.value === "NaN") {
          var avg = point.avg;
          point.value = (avg && avg !== "NaN") ? avg : null;
        }
      });

      return data;
    }

    // values must not contain regex special characters.
    // Otherwise use _.map(values, _.escapeRegExp)
    function matchValues(values) {
      return values.join("|");
    }

    function getStatsQueryURL() {
      return getMetricsURL().then(function(metricsURL) {
        if (!metricsURL) {
          return metricsURL;
        }
        return metricsURL + "/metrics/stats/query";
      });
    }

    function getMetricType(metric) {
      switch (metric) {
        case 'network/rx_rate':
        case 'network/tx_rate':
          return 'pod';
        default:
          return 'pod_container';
      }
    }

    function getRequestURL(config) {
      return getMetricsURL().then(function(metricsURL) {
        var template;
        var type = getMetricType(config.metric);

        // Are we requesting stacked pod metrics?
        if (config.stacked) {
          template = metricsURL + POD_STACKED_TEMPLATE;
          return URI.expand(template, {
            podName: config.pod.metadata.name,
            metric: config.metric,
            type: type
          }).toString();
        }

        // Otherwise, get metrics for a pod.
        template = metricsURL + POD_GAUGE_TEMPLATE;
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

    var getMetricInfo = function(metricID) {
      // Example descriptor:
      //   ruby-helloworld/6f7881e1-52c4-11e6-a5dc-080027893417/memory/usage
      var segments = metricID.split('/');
      return {
        podUID: segments[1],
        descriptor: segments[2] + '/' + segments[3]
      };
    };

    var query = function(url, data, config) {
      var podsByUID = _.indexBy(config.pods, 'metadata.uid');
      return $http.post(url, data, {
        auth: {},
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Hawkular-Tenant': config.namespace
        }
      }).then(function(response) {
        var result = {};
        var processResponse = function(data, metricID) {
          var info = getMetricInfo(metricID);
          var podName = _.get(podsByUID, [info.podUID, 'metadata', 'name']);
          var normalizedData = normalize(data);
          _.set(result, [info.descriptor, podName], normalizedData);
        };

        _.each(response.data.counter, processResponse);
        _.each(response.data.gauge, processResponse);

        return result;
      });
    };

    // Network metrics are collected at the pod level.
    var podQueryTemplate = _.template("descriptor_name:network/tx_rate|network/rx_rate,type:pod,pod_id:<%= uid %>");
    var containerQueryTemplate = _.template("descriptor_name:memory/usage|cpu/usage_rate,type:pod_container,pod_id:<%= uid %>,container_name:<%= containerName %>");
    var getPodMetrics = function(config) {
      return getStatsQueryURL().then(function(url) {
        var request = {
          bucketDuration: config.bucketDuration,
          start: config.start
        };

        if (config.end) {
          request.end = config.end;
        }

        var promises = [];
        var matchPods = matchValues(_.map(config.pods, 'metadata.uid'));
        var containerQuery = _.assign({
          tags: containerQueryTemplate({
            uid: matchPods,
            containerName: config.containerName
          })
        }, request);
        promises.push(query(url, containerQuery, config));

        var podQuery = _.assign({
          tags: podQueryTemplate({
            uid: matchPods
          })
        }, request);
        promises.push(query(url, podQuery, config));
        return $q.all(promises).then(function(results) {
          var result = {};
          _.each(results, function(next) {
            _.assign(result, next);
          });
          return result;
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
      //   start:          start time in millis, or relative time like "-60mn"
      //   end:            end time in millis (optional)
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
              data: normalize(response.data)
            });
          });
        });
      },

      // Get metrics data for a collection of pods (memory, CPU, network send and received).
      //
      // config keyword arguments
      //   pods:           the pods collection (hash or array)
      //   containerName:  the container name
      //   start:          start time in millis
      //   end:            end time in millis (optional)
      //
      // Returns a promise resolved with the metrics data.
      getPodMetrics: getPodMetrics,
    };
  });
