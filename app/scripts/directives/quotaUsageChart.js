"use strict";

angular.module('openshiftConsole')
  .directive('quotaUsageChart', function($filter, ChartsService) {
    return {
      restrict: 'E',
      scope: {
        used: '=',
        crossProjectUsed: '=?',
        total: '=',
        // 'cpu' or 'memory'
        type: '@',
        // Defaults to 'bottom'.
        // http://c3js.org/reference.html#legend-position
        height: '=?',
        width: '=?'
      },
      // Replace the element so it can be centered using class="center-block".
      replace: true,
      templateUrl: 'views/_quota-usage-chart.html',
      link: function($scope, element) {
        var usageValue = $filter('usageValue');
        var usageWithUnits = $filter('usageWithUnits');
        var amountAndUnit = $filter('amountAndUnit');

        function updateCenterText() {
          var replaceText = _.spread(function(amount, unit) {
            ChartsService.updateDonutCenterText(element[0], amount, unit);
          });
          replaceText(amountAndUnit($scope.total, $scope.type, true));
        }

        $scope.height = $scope.height || 200;
        $scope.width = $scope.width || 175;

        var percentage = function(value) {
          if (!value) {
            return "0%";
          }

          return (Number(value) * 100).toFixed(1) + "%";
        };

        // Chart configuration, see http://c3js.org/reference.html
        $scope.chartID = _.uniqueId('quota-usage-chart-');
        var config = {
          type: "donut",
          bindto: '#' + $scope.chartID,
          donut: {
            label: {
              show: false
            },
            width: 10
          },
          size: {
            height: $scope.height,
            width: $scope.width
          },
          legend: {
            show: true,
            position: $scope.legendPosition || 'bottom',
            item: {
              // Don't hide arcs when clicking the legend.
              onclick: _.noop
            }
          },
          onrendered: updateCenterText,
          tooltip: {
            position: function() {
              return { top: 0, left: 0 };
            },
            // Use custom tooltip HTML to avoid problems with content wrapping.
            // For example,
            //
            // <table class="c3-tooltip" style="width: 175px;">
            //   <tr>
            //     <td class="name nowrap">
            //       <span style="background-color: rgb(31, 119, 180);"></span>
            //       <span>Used</span>
            //     </td>
            //   </tr>
            //   <tr>
            //     <td class="value" style="text-align: left;">34% of 1 GiB</td>
            //   </tr>
            // </table>
            contents: function(d, defaultTitleFormat, defaultValueFormat, color) {
              var table = $('<table class="c3-tooltip"></table>')
                .css({ width: $scope.width + 'px' });

              var trName = $('<tr/>').appendTo(table);
              var tdName = $('<td class="name nowrap"></td>').appendTo(trName);

              // Color
              $('<span/>')
                .css({
                  'background-color': color(d[0].id)
                })
                .appendTo(tdName);

              // Name
              $('<span/>')
                .text(d[0].name)
                .appendTo(tdName);

              // Value
              var value;
              if (!$scope.total) {
                value = usageWithUnits($scope.used, $scope.type);
              } else {
                value = percentage(d[0].value / usageValue($scope.total)) + " of " + usageWithUnits($scope.total, $scope.type);
              }

              var trValue = $('<tr/>').appendTo(table);
              $('<td class="value" style="text-align: left;"></td>')
                .text(value)
                .appendTo(trValue);

              return table.get(0).outerHTML;
            }
          },
          data: {
            type: "donut",
            // Keep groups in our order.
            order: null
          }
        };

        var chart;
        var updateChart = function() {
          var hasCrossProject = $scope.crossProjectUsed !== undefined;
          var used = usageValue($scope.used) || 0,
              crossProjectUsed = Math.max((usageValue($scope.crossProjectUsed) || 0) - used, 0),
              available = Math.max(usageValue($scope.total) - (crossProjectUsed + used), 0),
              data = {
                columns: [
                  ['used', used],
                  ['available', available]
                ],
                colors: {
                  used: available ? "#0088ce" : "#ec7a08",
                  other: available ? "#7dc3e8" : "#f7bd7f",
                  available: "#d1d1d1"
                },
                names: {
                  used: hasCrossProject ? 'Used - This Project' : 'Used',
                  other: 'Used - Other Projects',
                  available: "Available"
                }
              };

          if (hasCrossProject) {
            data.columns.splice(1, 0, ['other', crossProjectUsed]);
          }

          if (!chart) {
            _.assign(config.data, data);
            chart = c3.generate(config);
          } else {
            chart.load(data);
          }
        };
        $scope.$watchGroup(['used', 'total', 'crossProjectUsed'], _.debounce(updateChart, 300));
      }
    };
  });
