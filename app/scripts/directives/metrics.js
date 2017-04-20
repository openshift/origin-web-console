'use strict';

angular.module('openshiftConsole')
  .directive('metrics', function($interval,
                                 $parse,
                                 $timeout,
                                 $q,
                                 $rootScope,
                                 ChartsService,
                                 ConversionService,
                                 MetricsService,
                                 usageValueFilter) {
    return {
      restrict: 'E',
      scope: {
        // Either pod or deployment must be set
        pod: '=?',
        deployment: '=?',
        // Visual profile, currently either 'compact' or 'full' (default)
        profile: '@?',
        sparklineWidth: '=?',
        sparklineHeight: '=?',
        includedMetrics: '=?' // defaults to ["cpu", "memory", "network"]
      },
      templateUrl: function(elem, attrs) {
        if (attrs.profile === 'compact') {
          return 'views/directives/metrics-compact.html';
        }
        return 'views/directives/metrics.html';
      },
      link: function(scope) {
        scope.includedMetrics = scope.includedMetrics || ["cpu", "memory", "network", "volumes"];
        var donutByMetric = {}, sparklineByMetric = {};
        var intervalPromise;
        var getMemoryLimit = $parse('resources.limits.memory');
        var getCPULimit = $parse('resources.limits.cpu');
        var compact = scope.profile === 'compact';

        // For compact metrics, wait for the element to scroll into view before updating.
        var paused = compact;
        var lastUpdated;
        var updateInterval = 60 * 1000; // 60 seconds
        // Number of data points to display on the chart.
        var numDataPoints = compact ? 15 : 30;

        // Set to true when the route changes so we don't update charts that no longer exist.
        var destroyed = false;
  
        var volumeDataSets = [];
		
        scope.uniqueID = _.uniqueId('metrics-chart-');

        // Metrics to display.
        scope.metrics = [];
        if (_.includes(scope.includedMetrics, "memory")) {
          scope.metrics.push({
            label: "Memory",
            units: "MiB",
            chartPrefix: "memory-",
            convert: ConversionService.bytesToMiB,
            containerMetric: true,
            // The sparkline y-axis will always extend to at least this value.
            smallestYAxisMax: 100,
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
            units: "millicores",
            chartPrefix: "cpu-",
            convert: _.round,
            containerMetric: true,
            // The sparkline y-axis will always extend to at least this value.
            // Avoid spikey charts when rounding very small CPU usage values.
            smallestYAxisMax: 10,
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
            // The sparkline y-axis will always extend to at least this value.
            // Avoid spikey charts when rounding very small network usage values.
            smallestYAxisMax: 1,
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
        generateVolumeDataSets();
        if (_.includes(scope.includedMetrics, "volumes")) {
          scope.metrics.push({
            label: "Volumes",
            units: "MiB",
            chartPrefix: "volumes-",
            chartType: "spline",
            convert: ConversionService.bytesToMiB,
            // The sparkline y-axis will always extend to at least this value.
            // Avoid spikey charts when rounding very small network usage values.
            smallestYAxisMax: 10000,
            datasets: volumeDataSets
          });
        }

        // Set to true when any data has been loaded (or failed to load).
        scope.loaded = false;
        scope.noData = true;

        // Get the URL to show in error messages.
        MetricsService.getMetricsURL().then(function(url) {
          scope.metricsURL = url;
        });

        // Relative time options.
        scope.options = {
          rangeOptions: [{
            label: "Last hour",
            value: 60
          }, {
            label: "Last 4 hours",
            value: 4 * 60
          }, {
            label: "Last day",
            value: 24 * 60
          }, {
            label: "Last 3 days",
            value: 3 * 24 * 60
          }, {
            label: "Last week",
            value: 7 * 24 * 60
          }]
        };
        // Show last hour by default.
        scope.options.timeRange = _.head(scope.options.rangeOptions);

        function generateVolumeDataSets() {
          angular.forEach(scope.pod.spec.volumes, function(volumeData) {
            if (volumeData.persistentVolumeClaim !== undefined) {
              volumeDataSets.push({
                id: "filesystem/usage",
                label: volumeData.name,
                data: []
              });
            }
          });
        }
		
        var createDonutConfig = function(metric) {
          var chartID = '#' + metric.chartPrefix + scope.uniqueID + '-donut';
          return {
            bindto: chartID,
            onrendered: function() {
              ChartsService.updateDonutCenterText(chartID, metric.datasets[0].used, metric.units);
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
          return {
            bindto: '#' + metric.chartPrefix + scope.uniqueID + '-sparkline',
            axis: {
              x: {
                show: !compact,
                type: 'timeseries',
                // With default padding you can have negative axis tick values.
                padding: {
                  left: 0,
                  bottom: 0
                },
                tick: {
                  type: 'timeseries',
                  format: '%a %H:%M'
                }
              },
              y: {
                show: !compact,
                label: metric.units,
                min: 0,
                // With default padding you can have negative axis tick values.
                padding: {
                  left: 0,
                  top: compact ? 5 : 20,
                  bottom: 0
                },
                tick: {
                  format: function(value) {
                    return d3.round(value, 3);
                  }
                }
              }
            },
            legend: {
              show: metric.datasets.length > 1 && !compact
            },
            point: {
              show: false
            },
            size: {
              height: scope.sparklineHeight || (compact ? 35 : 175),
              width: scope.sparklineWidth,
            },
            tooltip: {
              format: {
                value: function(value) {
                  return d3.round(value, 2) + " " + metric.units;
                }
              }
            }
          };
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
          case 'cpu/usage':
            var cpuLimit = getCPULimit(container);
            if (cpuLimit) {
              // Convert cores to millicores.
              return _.round(usageValueFilter(cpuLimit) * 1000);
            }
            break;
          }

          return null;
        }

        function updateChart(metric) {
          var dates, values = {};

          var missingData = _.some(metric.datasets, function(dataset) {
            return !dataset.data;
          });
          if (missingData) {
            return;
          }

          metric.totalUsed = 0;
          var largestValue = 0;
          angular.forEach(metric.datasets, function(dataset) {
            var metricID = dataset.id, metricData = dataset.data;
            dates = ['dates'], values[metricID] = [dataset.label || metricID];

            dataset.total = getLimit(metricID);

            var lastValue = _.last(metricData).value;
            if (isNaN(lastValue)) {
              lastValue = 0;
            }
            if (metric.convert) {
              lastValue = metric.convert(lastValue);
            }

            dataset.used = lastValue;
            if (dataset.total) {
              dataset.available = dataset.total - dataset.used;
            }
            metric.totalUsed += dataset.used;

            angular.forEach(metricData, function(point) {
              dates.push(point.start);
              if (point.value === undefined || point.value === null) {
                // Don't attempt to round null values. These appear as gaps in the chart.
                values[metricID].push(point.value);
              } else {
                var value = metric.convert ? metric.convert(point.value) : point.value;
                switch (metricID) {
                  case 'memory/usage':
                  case 'network/rx':
                  case 'network/tx':
                    values[metricID].push(d3.round(value, 2));
                    break;
                  default:
                    values[metricID].push(d3.round(value));
                }
                largestValue = Math.max(value, largestValue);
              }
            });

            dataset.used = _.round(dataset.used);
            dataset.total = _.round(dataset.total);
            dataset.available = _.round(dataset.available);

            // Donut
            var donutConfig, donutData;
            if (dataset.total) {
              donutData = {
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

              if (!donutByMetric[metricID]) {
                donutConfig = createDonutConfig(metric);
                donutConfig.data = donutData;
                $timeout(function() {
                  donutByMetric[metricID] = c3.generate(donutConfig);
                });
              } else {
                donutByMetric[metricID].load(donutData);
              }
            }
          });

          metric.totalUsed = _.round(metric.totalUsed, 1);

          var columns = [dates].concat(_.values(values));

          // Sparkline

          // Use a reasonable y-axis max value for small data values like 1
          // millicore or 0.1 KiB/s. If left undefined, c3 will generate one
          // that fits the data. Setting a value avoids weird spikes when when
          // CPU or network usage is very low since we round to the nearest
          // millicore or one decimal place for KiB/s.
          var yAxisMax;
          if (largestValue < metric.smallestYAxisMax) {
            yAxisMax = metric.smallestYAxisMax;
          }

          var sparklineConfig, sparklineData = {
            type: metric.chartType || (compact ? 'area-spline' : 'spline'),
            x: 'dates',
            columns: columns
          };

          var chartId = metric.chartPrefix + "sparkline";

          if (!sparklineByMetric[chartId]) {
            sparklineConfig = createSparklineConfig(metric);
            sparklineConfig.axis.y.max = yAxisMax;
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
            sparklineByMetric[chartId].axis.max({
              y: yAxisMax
            });
          }
        }

        function getStartTime() {
          if (compact) {
            // 15 minutes ago
            return "-15mn";
          }

          return "-" + scope.options.timeRange.value + "mn";
        }

        function getTimeRangeMillis() {
          if (compact) {
            // 15 minutes
            return 15 * 60 * 1000;
          }

          return scope.options.timeRange.value * 60 * 1000;
        }

        function getBucketDuration() {
          return Math.floor(getTimeRangeMillis() / numDataPoints) + "ms";
        }

        function getConfig(metric, dataset, start) {
          var lastPoint;
          var config = {
            metric: dataset.id,
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
              containerName: metric.containerMetric ? !compact && scope.options.selectedContainer.name : "pod",
              stacked: true
            });
          }

          if (scope.deployment) {
            return _.assign(config, {
              namespace: scope.deployment.metadata.namespace,
              deployment: scope.deployment
            });
          }

          return null;
        }

        // Make sure there are no errors or missing data before updating.
        function canUpdate() {
          if (scope.metricsError) {
            return false;
          }

          if (scope.deployment) {
            return true;
          }

          return scope.pod && (compact || _.get(scope, 'options.selectedContainer'));
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
          if (paused || !canUpdate()) {
            return;
          }

          var now = Date.now();
          lastUpdated = now;

          // Leave the end time off to use the server's current time as the end
          // time. This prevents an issue where the donut chart shows 0 for
          // current usage if the client clock is ahead of the server clock.
          var start = getStartTime();
          angular.forEach(scope.metrics, function(metric) {
            var promises = [];

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
              promises.push(MetricsService.get(config));
            });

            // Collect all promises from every metric requested into one, so we
            // have all data the chart wants at the time of the chart creation
            // (or timeout updates, etc).
            $q.all(promises).then(
              // success
              function(responses) {
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
                updateChart(metric);
              },
              // failure
              function(responses) {
                if (destroyed) {
                  return;
                }

                angular.forEach(responses, function(response) {
                  scope.metricsError = {
                    status:  _.get(response, 'status', 0),
                    details: _.get(response, 'data.errorMsg') ||
                             _.get(response, 'statusText') ||
                             "Status code " + _.get(response, 'status', 0)
                  };
                });
              }
            ).finally(function() {
              // Even on errors mark metrics as loaded to replace the
              // "Loading..." message with "No metrics to display."
              scope.loaded = true;
            });
          });
        }

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
        // Also update every 30 seconds.
        intervalPromise = $interval(update, updateInterval, false);

        // Pause or resume metrics updates when the element scrolls into and
        // out of view.
        scope.updateInView = function(inview) {
          paused = !inview;

          // Update now if in view and it's been longer than updateInterval.
          if (inview && (!lastUpdated || Date.now() > (lastUpdated + updateInterval))) {
            update();
          }
        };

        $rootScope.$on('metrics.charts.resize', function(){
          $timeout(function() {
            _.each(sparklineByMetric, function(chart) {
              chart.flush();
            });
          }, 0);
        });

        scope.$on('$destroy', function() {
          if (intervalPromise) {
            $interval.cancel(intervalPromise);
            intervalPromise = null;
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
