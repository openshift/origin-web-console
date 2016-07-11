"use strict";

angular.module('openshiftConsole')
  .directive('routeServicePie', function() {
    return {
      restrict: 'E',
      scope: {
        route: '=',
      },
      template: '<div ng-attr-id="{{chartId}}"></div>',
      link: function($scope) {
        var chart, config;

        $scope.chartId = _.uniqueId('route-service-chart-');

        config = {
          bindto: '#' + $scope.chartId,
          color: {
            pattern: [$.pfPaletteColors.blue, $.pfPaletteColors.orange, $.pfPaletteColors.green, $.pfPaletteColors.red]
          },
          legend: {
            show: true,
            position: 'right'
          },
          pie: {
            label: {
              show: false
            }
          },
          size: {
            height: 115,
            width: 260
          },
          data: {
            type: "pie",
            // Keep groups in our order.
            order: null,
            selection: {
              enabled: false
            }
          }
        };

        var getData = function(routeTarget) {
          return [
            routeTarget.name,
            routeTarget.weight
          ];
        };

        function updateChart() {
          var data = {
            columns: []
          };

          if ($scope.route) {
            data.columns.push(getData($scope.route.spec.to));
            _.each($scope.route.spec.alternateBackends, function(routeTarget) {
              data.columns.push(getData(routeTarget));
            });
          }

          if (!chart) {
            config.data.columns = data.columns;
            chart = c3.generate(config);
          } else {
            chart.load(data);
          }
        }

        $scope.$watch('route', updateChart);

        $scope.$on('destroy', function() {
          if (chart) {
            // http://c3js.org/reference.html#api-destroy
            chart = chart.destroy();
          }
        });
      }
    };
  });
