'use strict';

angular.module('openshiftConsole')
  .directive('deploymentMetrics', function($interval,
                                           $parse,
                                           $timeout,
                                           $q,
                                           $rootScope,
                                           ChartsService,
                                           ConversionService,
                                           MetricsCharts,
                                           MetricsService,
                                           ModalsService) {
    return {
      restrict: 'E',
      scope: {
        pods: '=',
        // Take in the list of containers rather than reading from the pod spec
        // in case pods is empty.
        containers: '=',
        // Optional: set to 'compact' to show smaller charts (for the overview)
        profile: '@',
        alerts: '=?'
      },
      templateUrl: function(elem, attrs) {
        if (attrs.profile === 'compact') {
          return 'views/directives/metrics-compact.html';
        }
        return 'views/directives/deployment-metrics.html';
      },
      link: function(scope) {
        var chartByMetric = {};
        var intervalPromise;
        var numDataPoints = 30;
        var compact = scope.profile === 'compact';

        // Set to true when the route changes so we don't update charts that no longer exist.
        var destroyed = false;

        scope.uniqueID = MetricsCharts.uniqueID();

        // Map of metric.type -> podName -> metrics data
        var data = {};

        // The last data point timestamp we've gotten.
        var lastTimestamp;

        // Wait until the charts are in view before fetching metrics.
        var paused = compact;

        // Track when we last requested metrics. When we scroll into view, this
        // helps decide whether to update immediately or wait until the next
        // interval tick.
        var lastUpdated;

        // Should we display the current usage as GiB when showing compact metrics?
        var displayAsGiB = function(usageInMiB) {
          return usageInMiB >= 1024;
        };

        // Metrics to display.
        scope.metrics = [{
          label: "Memory",
          units: "MiB",
          convert: ConversionService.bytesToMiB,
          formatUsage: function(value) {
            if (displayAsGiB(value)) {
              value = value / 1024;
            }
            return MetricsCharts.formatUsage(value);
          },
          usageUnits: function(value) {
            return displayAsGiB(value) ? 'GiB' : 'MiB';
          },
          descriptor: 'memory/usage',
          type: 'pod_container',
          chartID: "memory-" + scope.uniqueID
        }, {
          label: "CPU",
          units: "cores",
          convert: ConversionService.millicoresToCores,
          formatUsage: MetricsCharts.formatUsage,
          usageUnits: function() {
            return 'cores';
          },
          descriptor: 'cpu/usage_rate',
          type: 'pod_container',
          chartID: "cpu-" + scope.uniqueID
        }, {
          label: "Network (Sent)",
          units: "KiB/s",
          convert: ConversionService.bytesToKiB,
          formatUsage: MetricsCharts.formatUsage,
          usageUnits: function() {
            return 'KiB/s';
          },
          descriptor: 'network/tx_rate',
          type: 'pod',
          compactLabel: "Network",
          compactDatasetLabel: "Sent",
          compactType: 'spline',
          chartID: "network-tx-" + scope.uniqueID
        }, {
          label: "Network (Received)",
          units: "KiB/s",
          convert: ConversionService.bytesToKiB,
          formatUsage: MetricsCharts.formatUsage,
          usageUnits: function() {
            return 'KiB/s';
          },
          descriptor: 'network/rx_rate',
          type: 'pod',
          compactCombineWith: 'network/tx_rate',
          compactDatasetLabel: "Received",
          compactType: 'spline',
          chartID: "network-rx-" + scope.uniqueID
        }];

        var metricByID = _.keyBy(scope.metrics, 'descriptor');

        // Set to true when any data has been loaded (or failed to load).
        scope.loaded = false;
        scope.noData = true;

        scope.showComputeUnitsHelp = function() {
          ModalsService.showComputeUnitsHelp();
        };

        // Track the number of consecutive failures.
        var failureCount = 0;

        // Get the URL to show in error messages.
        MetricsService.getMetricsURL().then(function(url) {
          scope.metricsURL = url;
        });

        // Relative time options.
        scope.options = {
          rangeOptions: MetricsCharts.getTimeRangeOptions()
        };
        // Show last hour by default.
        scope.options.timeRange = _.head(scope.options.rangeOptions);
        scope.options.selectedContainer = _.head(scope.containers);

        var createSparklineConfig = function(metric) {
          var config = MetricsCharts.getDefaultSparklineConfig(metric.chartID, metric.units, compact);
          _.set(config, 'legend.show', !compact && !scope.showAverage);

          return config;
        };

        function isNil(point) {
          return point.value === null || point.value === undefined;
        }

        function averages(metric) {
          var label;
          if (compact) {
            label = metric.compactDatasetLabel || metric.label;
          } else {
            label = "Average Usage";
          }
          var averageData = {},
              dates = ['Date'],
              values = [label],
              columns = [dates, values];

          var getStats = function(point) {
            // Convert start timestamp to a string to use it as a key.
            var key = "" + point.start;
            if (!averageData[key]) {
              averageData[key] = {
                total: 0,
                count: 0
              };
            }

            return averageData[key];
          };

          _.each(data[metric.descriptor], function(podData) {
            _.each(podData, function(point) {
              var stats = getStats(point);

              if (!lastTimestamp || lastTimestamp < point.end) {
                lastTimestamp = point.end;
              }

              if (isNil(point)) {
                return;
              }
              stats.total += point.value;
              stats.count = stats.count + 1;
            });
          });

          _.each(averageData, function(stats, timestamp) {
            var avg;
            if (stats.count) {
              avg = stats.total / stats.count;
            } else {
              avg = null;
            }

            dates.push(Number(timestamp));
            values.push(metric.convert ? metric.convert(avg) : avg);
          });

          if (values.length > 1) {
            metric.lastValue = _.last(values) || 0;
          }

          return columns;
        }

        function getChartData(newData, metric) {
          var columns = [];
          var chartData = {
            type: 'spline'
          };

          // If there are too many pods, show only an average line.
          if (scope.showAverage) {
            _.each(newData[metric.descriptor], function(podData, podName) {
              updateData(metric.descriptor, podName, podData);
            });
            chartData.type = 'area-spline';
            if (compact && metric.compactType) {
              chartData.type = metric.compactType;
            }

            chartData.x = 'Date';
            chartData.columns = averages(metric);
            return chartData;
          }

          // Iterate over the data for each pod.
          _.each(newData[metric.descriptor], function(podData, podName) {
            updateData(metric.descriptor, podName, podData);
            var dateName = podName + "-dates";
            _.set(chartData, ['xs', podName], dateName);

            var timestamps = [dateName];
            var dataPoints = [podName];
            columns.push(timestamps);
            columns.push(dataPoints);

            // Look at each data point for this pod.
            _.each(data[metric.descriptor][podName], function(point) {
              timestamps.push(point.start);

              if (!lastTimestamp || lastTimestamp < point.end) {
                lastTimestamp = point.end;
              }

              if (isNil(point)) {
                dataPoints.push(point.value);
              } else {
                var value = metric.convert ? metric.convert(point.value) : point.value;
                dataPoints.push(value);
              }
            });
          });

          // Sort columns by pod names to ensure each pod has the same color in all charts.
          chartData.columns = _.sortBy(columns, function(column) {
            return column[0];
          });
          return chartData;
        }

        function processData(newData) {
          if (destroyed) {
            return;
          }

          // Reset the number of failures on a successful request.
          failureCount = 0;

          // Show an average instead of a multiline chart when there are many pods.
          scope.showAverage = _.size(scope.pods) > 5 || compact;

          // Iterate over each metric.
          _.each(scope.metrics, function(metric) {
            var config;
            // Get chart data for that metric.
            var chartData = getChartData(newData, metric);
            var descriptor = metric.descriptor;
            if (compact && metric.compactCombineWith) {
              descriptor = metric.compactCombineWith;
              if (metric.lastValue) {
                metricByID[descriptor].lastValue = (metricByID[descriptor].lastValue || 0) + metric.lastValue;
              }
            }

            if (!chartByMetric[descriptor]) {
              config = createSparklineConfig(metric);
              config.data = chartData;
              chartByMetric[descriptor] = c3.generate(config);
            } else {
              chartByMetric[descriptor].load(chartData);
              if (scope.showAverage) {
                chartByMetric[descriptor].legend.hide();
              } else {
                chartByMetric[descriptor].legend.show();
              }
            }
          });
        }

        function getStartTime() {
          if (compact) {
            // 15 minutes ago
            return "-15mn";
          }

          return "-" + scope.options.timeRange.value + "mn";
        }

        function getTimeRangeMillis() {
          return scope.options.timeRange.value * 60 * 1000;
        }

        function getBucketDuration() {
          if (compact) {
            return "1mn";
          }

          return Math.floor(getTimeRangeMillis() / numDataPoints) + "ms";
        }

        function getConfig() {
          // Read the namespace from one of the pods since the namespace is not
          // passed into the directive.
          var pod = _.find(scope.pods, 'metadata.namespace');
          if (!pod) {
            return;
          }
          var config = {
            pods: scope.pods,
            namespace: pod.metadata.namespace,
            bucketDuration: getBucketDuration()
          };

          if (!compact) {
            config.containerName = scope.options.selectedContainer.name;
          }

          // Leave the end time off to use the server's current time as the
          // end time. This prevents an issue where the donut chart shows 0
          // for current usage if the client clock is ahead of the server
          // clock.
          if (lastTimestamp) {
            config.start = lastTimestamp;
          } else {
            config.start = getStartTime();
          }

          return config;
        }

        // If the first request for metrics fails, show an empty state error message.
        // Otherwise show an alert if more than one consecutive request fails.
        function metricsFailed(response) {
          if (destroyed) {
            return;
          }

          failureCount++;
          if (scope.noData) {
            // Show an empty state message if the first request for data fails.
            scope.metricsError = {
              status:  _.get(response, 'status', 0),
              details: _.get(response, 'data.errorMsg') ||
                       _.get(response, 'statusText') ||
                       "Status code " + _.get(response, 'status', 0)
            };
            return;
          }

          // If this is the first failure and a previous request succeeded, wait and try again.
          if (failureCount < 2) {
            return;
          }

          if (scope.alerts) {
            // Show an alert if we've failed more than once.
            // Use scope.$id in the alert ID so that it is unique on pages that
            // use the directive multiple times like monitoring.
            var alertID = 'metrics-failed-' + scope.uniqueID;
            scope.alerts[alertID] = {
              type: 'error',
              message: 'An error occurred updating metrics.',
              links: [{
                href: '',
                label: 'Retry',
                onClick: function() {
                  delete scope.alerts[alertID];
                  // Reset failure count to 1 to trigger a retry.
                  failureCount = 1;
                  update();
                }
              }]
            };
          }
        }

        // Make sure there are no errors or missing data before updating.
        function canUpdate() {
          var noPods = _.isEmpty(scope.pods);
          if (noPods) {
            // Show the no metrics message.
            scope.loaded = true;
            return false;
          }
          return !scope.metricsError && failureCount < 2;
        }

        function updateData(metricType, podName, podData) {
          scope.noData = false;

          // Throw out the last data point, which is a partial bucket.
          var current = _.initial(podData);
          var previous = _.get(data, [metricType, podName]);
          if (!previous) {
            _.set(data, [metricType, podName], current);
            return;
          }

          // Don't include more than then last `numDataPoints`
          var updated = _.takeRight(previous.concat(current), numDataPoints);
          _.set(data, [metricType, podName], updated);
        }

        function update() {
          if (paused || !canUpdate()) {
            return;
          }
          lastUpdated = Date.now();
          var config = getConfig();
          MetricsService.getPodMetrics(config).then(processData, metricsFailed).finally(function() {
            // Even on errors mark metrics as loaded to replace the
            // "Loading..." message with "No metrics to display."
            scope.loaded = true;
          });
        }

        // Updates immediately and then on options changes.
        scope.$watch('options', function() {
          // Clear the data.
          data = {};
          lastTimestamp = null;
          delete scope.metricsError;

          update();
        }, true);
        intervalPromise = $interval(update, MetricsCharts.getDefaultUpdateInterval(), false);

        // Pause or resume metrics updates when the element scrolls into and
        // out of view.
        scope.updateInView = function(inview) {
          paused = !inview;

          // Update now if in view and it's been longer than updateInterval.
          if (inview && (!lastUpdated || Date.now() > (lastUpdated + MetricsCharts.getDefaultUpdateInterval()))) {
            update();
          }
        };

        var unbindResizeHandler = $rootScope.$on('metrics.charts.resize', function(){
          MetricsCharts.redraw(chartByMetric);
        });

        scope.$on('$destroy', function() {
          if (intervalPromise) {
            $interval.cancel(intervalPromise);
            intervalPromise = null;
          }

          if (unbindResizeHandler) {
            unbindResizeHandler();
            unbindResizeHandler = null;
          }

          angular.forEach(chartByMetric, function(chart) {
            chart.destroy();
          });
          chartByMetric = null;

          destroyed = true;
        });
      }
    };
  });
