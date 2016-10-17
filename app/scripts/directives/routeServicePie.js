"use strict";

angular.module('openshiftConsole')
  .directive('routeServicePie', function() {
    return {
      restrict: 'E',
      scope: {
        route: '=',
      },
      template: '<div ng-show="totalWeight" ng-attr-id="{{chartId}}"></div>',
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

        var getDataset = function(column) {
          return _.head(column);
        };

        var previousData;
        var unloadRemovedServices = function(data) {
          var datasets = {};
          _.each(data.columns, function(column) {
            var dataset = getDataset(column);
            datasets[dataset] = true;
          });

          var previousColumns = _.get(previousData, 'columns', []);
          data.unload = _.chain(previousColumns).reject(function(column) {
            var dataset = getDataset(column);
            return _.has(datasets, [dataset]);
          }).map(getDataset).value();
        };

        function updateChart() {
          var data = {
            columns: []
          };

          if ($scope.route) {
            data.columns.push(getData($scope.route.spec.to));
            $scope.totalWeight = $scope.route.spec.to.weight;
            _.each($scope.route.spec.alternateBackends, function(routeTarget) {
              data.columns.push(getData(routeTarget));
              $scope.totalWeight += routeTarget.weight;
            });
          }

          if (!$scope.totalWeight) {
            return;
          }

          if (!chart) {
            config.data.columns = data.columns;
            chart = c3.generate(config);
          } else {
            unloadRemovedServices(data);
            chart.load(data);
          }

          // Remember previous data so we know what alternate backends to unload when they change.
          previousData = data;
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
