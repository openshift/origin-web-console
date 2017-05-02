'use strict';

angular.module('openshiftConsole')
  .directive('podMetrics', function($filter,
                                    $interval,
                                    $parse,
                                    $timeout,
                                    $q,
                                    $rootScope,
                                    ChartsService,
                                    ConversionService,
                                    MetricsCharts,
                                    MetricsService,
                                    ModalsService,
                                    usageValueFilter) {
    return {
      restrict: 'E',
      scope: {
        pod: '=',
        includedMetrics: '=?', // defaults to ["cpu", "memory", "network"]
        stackDonut: '=?', // Keep donut on top of sparkline (e.g. on the monitoring page)
        alerts: '=?'
      },
      templateUrl: 'views/directives/pod-metrics.html',
      link: function(scope) {
        scope.includedMetrics = scope.includedMetrics || ["cpu", "memory", "network"];
        var donutByMetric = {}, sparklineByMetric = {};
        var intervalPromise;
        var getMemoryLimit = $parse('resources.limits.memory');
        var getCPULimit = $parse('resources.limits.cpu');

        // Number of data points to display on the chart.
        var numDataPoints = 30;

        // Set to true when the route changes so we don't update charts that no longer exist.
        var destroyed = false;

        scope.uniqueID = MetricsCharts.uniqueID();

        // Metrics to display.
        scope.metrics = [];
        if (_.includes(scope.includedMetrics, "memory")) {
          scope.metrics.push({
            label: "Memory",
            units: "MiB",
            chartPrefix: "memory-",
            convert: ConversionService.bytesToMiB,
            containerMetric: true,
            datasets: [
              {
                id: "memory/usage",
                label: "Memory",
                data: []
              }
            ]
          });
        }
        if (_.includes(scope.includedMetrics, "cpu")) {
          scope.metrics.push({
            label: "CPU",
            units: "cores",
            chartPrefix: "cpu-",
            convert: ConversionService.millicoresToCores,
            // Max number of decimal places to show for usage donut.
            usagePrecision: 3,
            containerMetric: true,
            datasets: [
              {
                id: "cpu/usage_rate",
                label: "CPU",
                data: []
              }
            ]
          });
        }
        if (_.includes(scope.includedMetrics, "network")) {
          scope.metrics.push({
            label: "Network",
            units: "KiB/s",
            chartPrefix: "network-",
            chartType: "spline",
            convert: ConversionService.bytesToKiB,
            datasets: [
              {
                id: "network/tx_rate",
                label: "Sent",
                data: []
              },
              {
                id: "network/rx_rate",
                label: "Received",
                data: []
              }
            ]
          });
        }

        // Set to true when any data has been loaded (or failed to load).
        scope.loaded = false;
        scope.noData = true;

        scope.showComputeUnitsHelp = function() {
          ModalsService.showComputeUnitsHelp();
        };

        // Get the URL to show in error messages.
        MetricsService.getMetricsURL().then(function(url) {
          scope.metricsURL = url;
        });

        // Relative time options.
        scope.options = {
          rangeOptions: MetricsCharts.getTimeRangeOptions()
        };
        scope.options.timeRange = _.head(scope.options.rangeOptions);

        var upperFirst = $filter('upperFirst');
        var createDonutConfig = function(metric) {
          var chartID = '#' + metric.chartPrefix + scope.uniqueID + '-donut';
          return {
            bindto: chartID,
            onrendered: function() {
              ChartsService.updateDonutCenterText(chartID, metric.datasets[0].used,
                                                  upperFirst(metric.units) + " Used");
            },
            donut: {
              label: {
                show: false
              },
              width: 10
            },
            legend: {
              show: false
            },
            size: {
              height: 175,
              widht: 175
            }
          };
        };

        var createSparklineConfig = function(metric) {
          var chartID = metric.chartPrefix + scope.uniqueID + '-sparkline';
          var config = MetricsCharts.getDefaultSparklineConfig(chartID, metric.units);
          if (metric.datasets.length === 1) {
            _.set(config, 'legend.show', false);
          }

          return config;
        };

        function getLimit(metricID) {
          if (!scope.pod) {
            return null;
          }

          var container = scope.options.selectedContainer;
          switch (metricID) {
          case 'memory/usage':
            var memLimit = getMemoryLimit(container);
            if (memLimit) {
              // Convert to MiB. usageValueFilter returns bytes.
              return ConversionService.bytesToMiB(usageValueFilter(memLimit));
            }
            break;
          case 'cpu/usage_rate':
            var cpuLimit = getCPULimit(container);
            if (cpuLimit) {
              return usageValueFilter(cpuLimit);
            }
            break;
          }

          return null;
        }

        function updateDonut(metric) {
          var dataset = _.head(metric.datasets);
          if (!dataset.total) {
            return;
          }

          var donutData = {
            type: 'donut',
            columns: [
              ['Used', dataset.used],
              ['Available', Math.max(dataset.available, 0)]
            ],
            colors: {
              // Blue if not at limit, orange if at or over limit
              Used: (dataset.available > 0) ? "#0088ce" : "#ec7a08",
              Available: "#d1d1d1"
            }
          };

          var donutConfig;
          if (!donutByMetric[dataset.id]) {
            donutConfig = createDonutConfig(metric);
            donutConfig.data = donutData;
            $timeout(function() {
              if (destroyed) {
                return;
              }

              donutByMetric[dataset.id] = c3.generate(donutConfig);
            });
          } else {
            donutByMetric[dataset.id].load(donutData);
          }
        }

        function updateSparkline(metric) {
          var missingData = _.some(metric.datasets, function(dataset) {
            return !dataset.data;
          });
          if (missingData) {
            return;
          }

          var dataByID = {};
          _.each(metric.datasets, function(dataset) {
            dataByID[dataset.id] = dataset.data;
          });

          var sparklineData = MetricsCharts.getSparklineData(dataByID);
          var chartId = metric.chartPrefix + "sparkline";

          var sparklineConfig;
          if (!sparklineByMetric[chartId]) {
            sparklineConfig = createSparklineConfig(metric);
            sparklineConfig.data = sparklineData;
            if (metric.chartDataColors) {
              sparklineConfig.color = { pattern: metric.chartDataColors };
            }
            $timeout(function() {
              if (destroyed) {
                return;
              }

              sparklineByMetric[chartId] = c3.generate(sparklineConfig);
            });
          } else {
            sparklineByMetric[chartId].load(sparklineData);
          }
        }

        function getStartTime() {
          return "-" + scope.options.timeRange.value + "mn";
        }

        function getTimeRangeMillis() {
          return scope.options.timeRange.value * 60 * 1000;
        }

        function getBucketDuration() {
          return Math.floor(getTimeRangeMillis() / numDataPoints) + "ms";
        }

        function getConfig(metric, dataset, start) {
          var lastPoint;
          var config = {
            metric: dataset.id,
            type: dataset.type,
            bucketDuration: getBucketDuration()
          };

          // Leave the end time off to use the server's current time as the
          // end time. This prevents an issue where the donut chart shows 0
          // for current usage if the client clock is ahead of the server
          // clock.
          if (dataset.data && dataset.data.length) {
            lastPoint = _.last(dataset.data);
            config.start = lastPoint.end;
          } else {
            config.start = start;
          }

          if (scope.pod) {
            return _.assign(config, {
              namespace: scope.pod.metadata.namespace,
              pod: scope.pod,
              containerName: metric.containerMetric ? scope.options.selectedContainer.name : "pod"
            });
          }

          return null;
        }

        // Track the number of consecutive failures.
        var failureCount = 0;

        function metricsSucceeded() {
          if (destroyed) {
            return;
          }

          // Reset the number of failures on a successful request.
          failureCount = 0;

          _.each(scope.metrics, function(metric) {
            updateSparkline(metric);
            updateDonut(metric);
          });
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

          // Show an alert if we've failed more than once.
          // Use scope.$id in the alert ID so that it is unique on pages that
          // use the directive multiple times like monitoring.
          var alertID = 'metrics-failed-' + scope.uniqueID;
          scope.alerts[alertID] = {
            type: 'error',
            message: 'An error occurred updating metrics for pod ' + _.get(scope, 'pod.metadata.name', '<unknown>') + '.',
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

        function getCustomMetrics() {
          if (window.OPENSHIFT_CONSTANTS.DISABLE_CUSTOM_METRICS) {
            return $q.when({});
          }

          // Load any custom metrics onto the page
          return MetricsService.getCustomMetrics(scope.pod).then(function(response) {
            angular.forEach(response, function(metric) {

              // set the label to the description if specified
              var label = metric.description || metric.name;

              // get the unit value if specified
              var unit =  metric.unit || "";

              // A typical metric ID is of the form "pod/<pod-id>/custom/<some-endpoint-info>"
              // such as "pod/be381d4b-87fc-11e5-b2a3-525400b33d1d/custom/JVM-Heap-Memory-Used".
              // We only want part of the metric ID - "custom/" and everything after it.
              var datasetId = "custom/" + metric.id.replace(/.*\/custom\//, '');

              scope.metrics.push({
                label: label,
                units: unit,
                chartPrefix: "custom-" + _.uniqueId('custom-metric-'),
                chartType: "spline",

                datasets: [
                  {
                    id: datasetId,
                    label: label,
                    type: metric.type,
                    data: []
                  },
                ]
              });
            });
          });
        }

        // Make sure there are no errors or missing data before updating.
        function canUpdate() {
          if (scope.metricsError || failureCount > 1) {
            return false;
          }

          return scope.pod && _.get(scope, 'options.selectedContainer');
        }

        function updateCurrentUsage(metric, dataset, response) {
          dataset.total = getLimit(dataset.id);
          if (dataset.total) {
            scope.hasLimits = true;
          }

          var currentUsage = _.get(response, 'usage.value');
          if (isNaN(currentUsage)) {
            currentUsage = 0;
          }
          if (metric.convert) {
            currentUsage = metric.convert(currentUsage);
          }

          dataset.used = d3.round(currentUsage, metric.usagePrecision);
          if (dataset.total) {
            dataset.available = d3.round(dataset.total - currentUsage, metric.usagePrecision);
          }
          metric.totalUsed += dataset.used;
        }

        function updateData(dataset, response) {
          scope.noData = false;

          // Throw out the last data point, which is a partial bucket.
          var newData = _.initial(response.data);
          if (!dataset.data) {
            dataset.data = newData;
            return;
          }

          dataset.data =
            _.chain(dataset.data)
            // Don't include more than then last `numDataPoints`
            .takeRight(numDataPoints)
            // Add the new values.
            .concat(newData)
            .value();
        }

        function update() {
          if (!canUpdate()) {
            return;
          }

          // Leave the end time off to use the server's current time as the end
          // time. This prevents an issue where the donut chart shows 0 for
          // current usage if the client clock is ahead of the server clock.
          var start = getStartTime();
          var allPromises = [];
          angular.forEach(scope.metrics, function(metric) {
            var datasetPromises = [];

            metric.totalUsed = 0;

            // On metrics that require more than one set of data (e.g. network
            // incoming and outgoing traffic) we perform one request for each,
            // but collect and handle all requests in one single promise below.
            // It's important that every metric uses the same 'start' timestamp
            // so that the returned data for every metric fit in the same
            // collection of 'dates' and can be displayed in exactly the same
            // point in time in the graph.
            angular.forEach(metric.datasets, function(dataset) {
              var config = getConfig(metric, dataset, start);
              if (!config) {
                return;
              }
              var promise = MetricsService.get(config);
              datasetPromises.push(promise);

              // Only request current usage if we have a limit. This lets us
              // show consistent values inside the donut chart no matter what
              // time range is selected.
              var limit = getLimit(dataset.id);
              if (limit) {
                allPromises.push(MetricsService.getCurrentUsage(config).then(function(response) {
                  updateCurrentUsage(metric, dataset, response);
                }));
              }
            });

            allPromises = allPromises.concat(datasetPromises);

            // Collect all promises from every metric requested into one, so we
            // have all data the chart wants at the time of the chart creation
            // (or timeout updates, etc).
            $q.all(datasetPromises).then(function(responses) {
              if (destroyed) {
                return;
              }

              angular.forEach(responses, function(response) {
                if (!response) {
                  return;
                }

                var dataset = _.find(metric.datasets, {
                  id: response.metricID
                });
                updateData(dataset, response);
              });
            });
          });

          // Handle failures when any request fails.
          $q.all(allPromises).then(metricsSucceeded, metricsFailed).finally(function() {
            // Even on errors mark metrics as loaded to replace the
            // "Loading..." message with "No metrics to display."
            scope.loaded = true;
          });
        }

        // Request custom metrics before calling update the first time.
        getCustomMetrics().finally(function() {
          // Updates immediately and then on options changes.
          scope.$watch('options', function() {
            // Remove any existing data so that we request data for the new container or time range.
            _.each(scope.metrics, function(metric) {
              _.each(metric.datasets, function(dataset) {
                delete dataset.data;
              });
            });
            delete scope.metricsError;
            update();
          }, true);
          intervalPromise = $interval(update, MetricsCharts.getDefaultUpdateInterval(), false);
        });

        var unbindResizeHandler = $rootScope.$on('metrics.charts.resize', function() {
          MetricsCharts.redraw(donutByMetric);
          MetricsCharts.redraw(sparklineByMetric);
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

          angular.forEach(donutByMetric, function(chart) {
            chart.destroy();
          });
          donutByMetric = null;

          angular.forEach(sparklineByMetric, function(chart) {
            chart.destroy();
          });
          sparklineByMetric = null;

          destroyed = true;
        });
      }
    };
  });
