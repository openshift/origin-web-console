"use strict";

angular.module('openshiftConsole')
  .directive('podDonut', function($timeout,
                                  isPullingImageFilter,
                                  isTerminatingFilter,
                                  podWarningsFilter,
                                  numContainersReadyFilter,
                                  Logger,
                                  ChartsService) {
    // Make sure our charts always have unique IDs even if the same deployment
    // or monopod is shown on the overview more than once.

    return {
      restrict: 'E',
      scope: {
        pods: '=',
        desired: '=?',
        idled: '=?',
        mini: '=?'
      },
      templateUrl: 'views/directives/pod-donut.html',
      link: function($scope, element) {
        var chart, config;

        // The phases to show (in order).
        var phases = ["Running", "Not Ready", "Warning", "Error", "Pulling", "Pending", "Succeeded", "Terminating", "Unknown"];

        $scope.chartId = _.uniqueId('pods-donut-chart-');

        function updatePodCount() {
          // Don't show failed pods like evicted pods in the donut.
          var pods = _.reject($scope.pods, { status: { phase: 'Failed' } });
          var total = _.size(pods);
          if ($scope.mini) {
            $scope.$evalAsync(function() {
              $scope.total = total;
            });
            return;
          }

          var smallText;
          if (!angular.isNumber($scope.desired) || $scope.desired === total) {
            smallText = (total === 1) ? "pod" : "pods";
          } else {
            smallText = "scaling to " + $scope.desired + "...";
          }

          if($scope.idled) {
            ChartsService.updateDonutCenterText(element[0], 'Idle');
          } else {
            ChartsService.updateDonutCenterText(element[0], total, smallText);
          }
        }

        // c3.js config for the pods donut chart
        config = {
          type: "donut",
          bindto: '#' + $scope.chartId,
          donut: {
            // disable hover expansion
            expand: false,
            label: {
              show: false
            },
            width: $scope.mini ? 5 : 10
          },
          size: {
            height: $scope.mini ? 45 : 150,
            width: $scope.mini ? 45 : 150
          },
          legend: {
            show: false
          },
          onrendered: updatePodCount,
          tooltip: {
            format: {
              value: function(value, ratio, id) {
                // We add all phases to the data, even if count 0, to force a cut-line at the top of the donut.
                // Don't show tooltips for phases with 0 count.
                if (!value) {
                  return undefined;
                }

                // Disable the tooltip for empty donuts.
                if (id === "Empty") {
                  return undefined;
                }

                // Show the count rather than a percentage.
                return value;
              }
            }
          },
          transition: {
            duration: 350
          },
          data: {
            type: "donut",
            groups: [ phases ],
            // Keep groups in our order.
            order: null,
            colors: {
              // Dummy group for an empty chart. Gray outline added in CSS.
              Empty: "#ffffff",
              Running: "#00b9e4",
              "Not Ready": "#beedf9",
              // Use a shade of orange that looks good with overview alerts for warning pods.
              Warning: "#f39d3c",
              Error: "#d9534f",
              Pulling: "#d1d1d1",
              Pending: "#ededed",
              Succeeded: "#3f9c35",
              Terminating: "#00659c",
              Unknown: "#f9d67a"
            },
            selection: {
              enabled: false
            }
          }
        };

        if ($scope.mini) {
          config.padding = {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
          };
        }

        function updateChart(countByPhase) {
          var data = {
            columns: []
          };
          angular.forEach(phases, function(phase) {
            data.columns.push([phase, countByPhase[phase] || 0]);
          });

          if (_.isEmpty(countByPhase)) {
            // Add a dummy group to draw an arc, which we style in CSS.
            data.columns.push(["Empty", 1]);
          } else {
            // Unload the dummy group if present when there's real data.
            data.unload = "Empty";
          }

          if (!chart) {
            config.data.columns = data.columns;
            chart = c3.generate(config);
          } else {
            chart.load(data);
          }

          // Add to scope for sr-only text.
          $scope.podStatusData = data.columns;
        }

        function isReady(pod) {
          var numReady = numContainersReadyFilter(pod);
          var total = _.size(pod.spec.containers);

          return numReady === total;
        }

        function getPhase(pod) {
          if (isTerminatingFilter(pod)) {
            return 'Terminating';
          }

          var warnings = podWarningsFilter(pod);
          if (_.some(warnings, { severity: 'error' })) {
            return 'Error';
          } else if (!_.isEmpty(warnings)) {
            return 'Warning';
          }

          if (isPullingImageFilter(pod)) {
            return 'Pulling';
          }

          // Also count running, but not ready, as its own phase.
          if (pod.status.phase === 'Running' && !isReady(pod)) {
            return 'Not Ready';
          }

          return _.get(pod, 'status.phase', 'Unknown');
        }

        function countPodPhases() {
          var countByPhase = {};

          angular.forEach($scope.pods, function(pod) {
            var phase = getPhase(pod);
            countByPhase[phase] = (countByPhase[phase] || 0) + 1;
          });

          return countByPhase;
        }

        var debounceUpdate = _.debounce(updateChart, 350, { maxWait: 500 });
        $scope.$watch(countPodPhases, debounceUpdate, true);
        $scope.$watchGroup(['desired','idled'], updatePodCount);

        $scope.$on('destroy', function() {
          if (chart) {
            // http://c3js.org/reference.html#api-destroy
            chart = chart.destroy();
          }
        });
      }
    };
  });
