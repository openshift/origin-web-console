"use strict";

angular.module('openshiftConsole')
  .directive('editProbe', function() {
    return {
      restrict: 'E',
      scope: {
        probe: '=',
        exposedPorts: '='
      },
      templateUrl: 'views/directives/_edit-probe.html',
      link: function(scope) {
        scope.id = _.uniqueId('edit-probe-');
        scope.probe = scope.probe || {};

        scope.types = [{
          id: 'httpGet',
          label: 'HTTP GET'
        }, {
          id: 'exec',
          label: 'Container Command'
        }, {
          id: 'tcpSocket',
          label: 'TCP Socket'
        }];

        // Map of previous probes by type so switching to a different type and
        // back remembers the previous values.
        scope.previousProbes = {};

        // Show only TCP ports for HTTP and TCP socket checks.
        scope.tcpPorts = _.filter(scope.exposedPorts, { protocol: "TCP" });
        var initialValue = _.get(scope, 'probe.httpGet.port') || _.get(scope, 'probe.exec.port');
        if (initialValue && !_.some(scope.tcpPorts, { containerPort: initialValue })) {
          scope.tcpPorts = [{
            containerPort: initialValue,
            protocol: 'TCP'
          }].concat(scope.tcpPorts);
        }
        scope.portOptions = scope.tcpPorts;

        var updateSelectedType = function(newType, oldType) {
          scope.probe = scope.probe || {};

          // Remember the values entered for `oldType`.
          scope.previousProbes[oldType] = scope.probe[oldType];
          delete scope.probe[oldType];

          // Use previous values when switching back to `newType` if found.
          scope.probe[newType] = scope.previousProbes[newType];

          // If no previous values, set the defaults.
          if (!scope.probe[newType]) {
            switch (newType) {
            case 'httpGet':
            case 'tcpSocket':
              var firstPort = _.head(scope.tcpPorts);
              scope.probe[newType] = {
                port: firstPort ? firstPort.containerPort : ''
              };
              break;
            case 'exec':
              scope.probe = {
                exec: {
                  command: []
                }
              };
              break;
            }
          }
        };

        // Initialize type from existing data.
        var type;
        if (scope.probe.httpGet) {
          type = 'httpGet';
        } else if (scope.probe.exec) {
          type = 'exec';
        } else if (scope.probe.tcpSocket) {
          type = 'tcpSocket';
        } else {
          // Set defaults for new probe.
          type = 'httpGet';
          updateSelectedType('httpGet');
        }

        _.set(scope, 'selected.type', type);

        scope.$watch('selected.type', function(newType, oldType) {
          if (newType === oldType) {
            return;
          }

          updateSelectedType(newType, oldType);
        });

        // Allow the user to type in a new value.
        scope.refreshPorts = function(search) {
          if (!/^\d+$/.test(search)) {
            return;
          }

          var options = scope.tcpPorts;
          search = parseInt(search, 10);
          if (search && !_.some(options, { containerPort: search })) {
            options = [{
              containerPort: search,
              protocol: 'TCP'
            }].concat(options);
          }

          scope.portOptions = _.uniq(options);
        };
      }
    };
  });
