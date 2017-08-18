'use strict';

angular.module("openshiftConsole")
  .factory("MetricsService", function($filter, $http, $q, $rootScope, APIDiscovery) {
    var POD_GAUGE_TEMPLATE = "/gauges/{containerName}%2F{podUID}%2F{metric}/data";
    var POD_COUNTER_TEMPLATE = "/counters/{containerName}%2F{podUID}%2F{metric}/data";

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
        if (point.empty || !_.isNumber(point.avg)) {
          point.value = null;
        } else {
          point.value = point.avg;
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
        return metricsURL + "/m/stats/query";
      });
    }

    function getRequestURL(config) {
      return getMetricsURL().then(function(metricsURL) {
        var template;
        // if no type is specified, it is assumed the metric is a gauge
        if (config.type === "counter") {
          template = metricsURL + POD_COUNTER_TEMPLATE;
        } else {
          template = metricsURL + POD_GAUGE_TEMPLATE;
        }
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
        }, function(response) {
          connectionFailed = true;
          $rootScope.$broadcast('metrics-connection-failed', {
            url: url,
            response: response
          });
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
      var podsByUID = _.keyBy(config.pods, 'metadata.uid');
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

    // Query network metrics. Network metrics are only collected at the pod level.
    var networkQuery = _.template("descriptor_name:network/tx_rate|network/rx_rate,type:pod,pod_id:<%= uid %>");

    // Query memory and CPU usage for one container
    var memoryCpuContainerQuery = _.template("descriptor_name:memory/usage|cpu/usage_rate,type:pod_container,pod_id:<%= uid %>,container_name:<%= containerName %>");

    // Query memory, CPU, and network metrics for all containers (e.g., on the overview).
    var allPodMetrics = _.template("descriptor_name:network/tx_rate|network/rx_rate|memory/usage|cpu/usage_rate,type:pod,pod_id:<%= uid %>");

    var getPodMetrics = function(config) {
      return getStatsQueryURL().then(function(url) {
        var parameters = {
          bucketDuration: config.bucketDuration,
          start: config.start
        };

        if (config.end) {
          parameters.end = config.end;
        }

        var requests = [];
        var promises = [];
        var matchPods = matchValues(_.map(config.pods, 'metadata.uid'));
        if (config.containerName) {
          // If a container name is provided, get only the memory and CPU usage
          // for that container. Network metrics are always pod level, so we
          // need to make two requests.
          requests.push(_.assign({
            tags: memoryCpuContainerQuery({
              uid: matchPods,
              containerName: config.containerName
            })
          }, parameters));

          requests.push(_.assign({
            tags: networkQuery({
              uid: matchPods
            })
          }, parameters));
        } else {
          // If no container name is provided, get the memory, CPU, and network
          // metrics for all containers in the pod.
          requests.push(_.assign({
            tags: allPodMetrics({
              uid: matchPods
            })
          }, parameters));
        }

        _.each(requests, function(request) {
          var promise = query(url, request, config);
          promises.push(promise);
        });

        return $q.all(promises).then(function(results) {
          var result = {};
          _.each(results, function(next) {
            _.assign(result, next);
          });
          return result;
        });
      });
    };

    // Returns custom metrics available for a particular pod
    var getCustomMetrics = function(pod) {
      var namespace = pod.metadata.namespace;
      var podId = pod.metadata.uid;

      return getMetricsURL().then(function(metricsURL) {

        if (!metricsURL) {
          return null;
        }

        var url = metricsURL + "/m";

        var params = {
          tags: "custom_metric:true,pod_id:" + podId
        };

        return $http.get(url, {
          auth: {},
          headers: {
            Accept: 'application/json',
            'Hawkular-Tenant': namespace
          },
          params: params
        }).then(function(response) {
          return _.map(response.data, function(value) {
            return {
              id: value.id,
              name: value.tags.metric_name,
              unit: value.tags.units,
              description: value.tags.description,
              type: value.type
            };
          });
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

      getCurrentUsage: function(config) {
        return getRequestURL(config).then(function(url) {
          if (!url) {
            return null;
          }

          // Request one data point for the last minute.
          var params = {
            bucketDuration: '1mn',
            start: '-1mn'
          };

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
              usage: _.head(normalize(response.data))
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
      getCustomMetrics: getCustomMetrics,
    };
  });
