'use strict';

angular.module("openshiftConsole")
  .factory("MetricsCharts", function($timeout, ConversionService) {
    var getValue = function(point, metricID) {
      if (point.value === undefined || point.value === null) {
        // null values appear as gaps in the chart.
        return null;
      }

      switch (metricID) {
      case 'memory/usage':
        return _.round(ConversionService.bytesToMiB(point.value), 2);
      case 'cpu/usage_rate':
        return ConversionService.millicoresToCores(point.value);
      case 'network/rx_rate':
      case 'network/tx_rate':
        return _.round(ConversionService.bytesToKiB(point.value), 2);
      default:
        return _.round(point.value);
      }
    };

    var labels = {
      'memory/usage': 'Memory',
      'cpu/usage_rate': 'CPU',
      'network/tx_rate': 'Sent',
      'network/rx_rate': 'Received'
    };

    return {
      uniqueID: function() {
        return _.uniqueId('metrics-');
      },

      getDefaultUpdateInterval: function() {
        return 60 * 1000; // 60 seconds
      },

      getTimeRangeOptions: function() {
        return [{
          label: "Last hour",
          value: 60
        }, {
          label: "Last 4 hours",
          value: 4 * 60
        }, {
          label: "Last 12 hours",
          value: 12 * 60
        }, {
          label: "Last day",
          value: 24 * 60
        }, {
          label: "Last 3 days",
          value: 3 * 24 * 60
        }, {
          label: "Last week",
          value: 7 * 24 * 60
        }];
      },

      getDefaultSparklineConfig: function(chartID, units, compact) {
        return {
          bindto: '#' + chartID,
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
              label: units,
              min: 0,
              // With default padding you can have negative axis tick values.
              padding: {
                left: 0,
                top: 20,
                bottom: 0
              }
            }
          },
          point: {
            show: false
          },
          size: {
            height: compact ? 35 : 175
          },
          tooltip: {
            format: {
              value: function(value) {
                var precision = units === 'cores' ? 3 : 2;
                return d3.round(value, precision) + " " + units;
              }
            },
          }
        };
      },

      getSparklineData: function(datasets) {
        var chartData = {
          type: 'spline',
          x: 'dates',
	  names: labels
        };

        var dates, values = {};
        _.each(datasets, function(data, id) {
          dates = ['dates'], values[id] = [id];
          _.each(data, function(point) {
            var value = getValue(point, id);
            dates.push(point.start);
            values[id].push(value);
          });
        });

        chartData.columns = [dates].concat(_.values(values));
        return chartData;
      },

      formatUsage: function(usage) {
        if (usage < 0.001) {
          return '0';
        }

        if (usage < 1) {
          return d3.format('.1r')(usage);
        }

        return d3.format('.2r')(usage);
      },

      redraw: function(charts) {
        $timeout(function() {
          _.each(charts, function(chart) {
            chart.flush();
          });
        }, 0);
      }
    };
  });
