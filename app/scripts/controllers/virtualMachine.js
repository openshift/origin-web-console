'use strict';

angular.module('openshiftConsole')
  .controller('VirtualMachineController', function ($filter,
                                         $routeParams,
                                         $scope,
                                         APIService,
                                         DataService,
                                         ProjectsService,
                                         KubevirtVersions,
                                         VmActions) {
    $scope.projectName = $routeParams.project;
    $scope.alerts = {};
    $scope.renderOptions = $scope.renderOptions || {};
    $scope.renderOptions.hideFilterWidget = true;
    $scope.logOptions = {};
    $scope.terminalTabWasSelected = false;
    $scope.breadcrumbs = [
      {
        title: "Virtual Machines",
        link: "project/" + $routeParams.project + "/browse/virtual-machines"
      },
      {
        title: $routeParams.vm
      }
    ];

    // Must always be initialized so we can watch selectedTab
    $scope.selectedTab = {};
    $scope.mergedVm = {};
    $scope.pods = []; // sorted by creation time, the most recent first
    $scope.loaded = function () {
      return $scope.vmLoaded && $scope.ovmLoaded && $scope.podsLoaded;
    };
    $scope.eventsApiObjects = [];
    function updateEventsApiObjects() {
      var objects = [];
      if ($scope.mergedVm.ovm) {
        objects.push($scope.mergedVm.ovm);
      }
      if ($scope.mergedVm.vm) {
        objects.push($scope.mergedVm.vm);
      }
      objects = objects.concat($scope.pods);
      $scope.eventsApiObjects = objects;
    }

    $scope.podsVersion = APIService.getPreferredVersion('pods');
    $scope.podsLogVersion = APIService.getPreferredVersion('pods/log');
    $scope.eventsVersion = APIService.getPreferredVersion('events');
    $scope.KubevirtVersions = KubevirtVersions;
    $scope.VmActions = VmActions;

    var watches = [];
    var requestContext = null;

    $scope.vmMemory = function (vm) {
      return _.get(vm, 'spec.domain.resources.requests.memory');
    };

    $scope.vmOs = function (vm) {
      return _.get(vm, 'metadata.labels["kubevirt.io/os"]');
    };

    var allPods = {}; // {[podName: string]: Pod}

    function updatePods() {
      if (!$scope.mergedVm.vm) {
        $scope.pods = [];
        return;
      }
      $scope.pods = _(allPods)
        .filter(function (pod) {
          return _.get(pod, 'metadata.labels["kubevirt.io"]') === 'virt-launcher' &&
            _.get(pod, 'metadata.labels["kubevirt.io/domain"]') === $scope.mergedVm.vm.metadata.name;
        })
        .sortBy(function (pod) {
          return new Date(pod.metadata.creationTimestamp);
        })
        .value();
      updateLogVariables();
    }

    function updateLogVariables() {
      $scope.logOptions.container = _.get($scope.pods[0], 'spec.containers[0].name');
      if (!$scope.logOptions.container) {
        return;
      }

      var containerStatus = _.find($scope.pods[0].status.containerStatuses, { name: $scope.logOptions.container });
      var state = _.get(containerStatus, 'state');
      var statusKey = _.head(_.keys(state));
      var lastState = _.get(containerStatus, 'lastState');
      var isWaiting =  _.get(containerStatus, 'state.waiting');
      $scope.logCanRun = !(_.includes(['New', 'Pending', 'Unknown'], $scope.pods[0].status.phase));
      $scope.containerStatusKey = _.includes(['running', 'waiting', 'terminated'], statusKey) ? statusKey : '';
      $scope.containerStateReason = _.get(state, [statusKey, 'reason']);
      var stateForTime = isWaiting ? lastState : state;
      $scope.containerStartTime = _.get(stateForTime, [statusKey, 'startedAt']);
      $scope.containerEndTime = _.get(stateForTime, [statusKey, 'finishedAt']);
    }

    var loadingErrors = {};

    ProjectsService
      .get($routeParams.project)
      .then(_.spread(function(project, context) {
        requestContext = context;
        $scope.project = project;
        $scope.projectContext = context;

        DataService
          .get(KubevirtVersions.virtualMachine, $routeParams.vm, context, { errorNotification: false })
          .then(function (vm) {
            $scope.mergedVm.vm = vm;
            $scope.vmLoaded = true;
            updatePods();
            updateEventsApiObjects();
          }, function (error) {
            $scope.vmLoaded = true;
            loadingErrors.vm = error;
            updateLoadingAlert();
          });

        DataService
          .get(KubevirtVersions.offlineVirtualMachine, $routeParams.vm, context, { errorNotification: false })
          .then(function (ovm) {
            $scope.mergedVm.ovm = ovm;
            $scope.ovmLoaded = true;
            updateEventsApiObjects();
          }, function (error) {
            $scope.ovmLoaded = true;
            loadingErrors.ovm = error;
            updateLoadingAlert();
          });

        watches.push(DataService.watchObject(KubevirtVersions.virtualMachine, $routeParams.vm, context, function(vm, action) {
          $scope.mergedVm.vm = action === 'DELETED' ? undefined : vm;
          updatePods();
          updateEventsApiObjects();
          delete loadingErrors.vm;
          updateLoadingAlert();
        }));

        watches.push(DataService.watchObject(KubevirtVersions.offlineVirtualMachine, $routeParams.vm, context, function(ovm, action) {
          $scope.mergedVm.ovm = action === 'DELETED' ? undefined : ovm;
          updateEventsApiObjects();
          delete loadingErrors.ovm;
          updateLoadingAlert();
        }));

        watches.push(DataService.watch($scope.podsVersion, context, function(result) {
          $scope.podsLoaded = true;
          allPods = result.by('metadata.name');
          updatePods();
          updateEventsApiObjects();
        }));

        function updateLoadingAlert() {
          if (loadingErrors.vm && loadingErrors.ovm) {
            $scope.alerts.load = {
              type: 'error',
              message: 'The virtual machine detail could not be loaded.',
              details: $filter('getErrorDetails')(loadingErrors.vm) + ', ' + $filter('getErrorDetails')(loadingErrors.ovm)
            };
          } else {
            delete $scope.alerts.load;
          }
          if (!$scope.mergedVm.vm && !$scope.mergedVm.ovm && !(loadingErrors.vm && loadingErrors.ovm)) {
            $scope.alerts.deleted = {
              type: 'warning',
              message: 'The virtual machine ' + $routeParams.vm + ' has been deleted.'
            };
          } else {
            delete $scope.alerts.deleted;
          }
        }

        $scope.$on('$destroy', function(){
          DataService.unwatchAll(watches);
        });
    }));
  });

angular.module('openshiftConsole')
  .filter('ovmReference', function () {
    return function (vm) {
      return _(_.get(vm, 'metadata.ownerReferences'))
        .filter({ kind: 'OfflineVirtualMachine'})
        .first();
    };
  });

angular.module('openshiftConsole')
  .constant('mergedVmValueText', function (vmValue, ovmValue, mergedVm) {
    if (vmValue === undefined && ovmValue === undefined) {
      return '--';
    }
    if (_.get(mergedVm, 'ovm.spec.running') && vmValue !== ovmValue) {
      return undefinedToDasheds(vmValue) + ' (' + undefinedToDasheds(ovmValue) + ')';
    }
    var unifiedValue = vmValue !== undefined ? vmValue : ovmValue;
    return undefinedToDasheds(unifiedValue);

    function undefinedToDasheds(value) {
      return value === undefined ? '--' : value;
    }
  });

angular.module('openshiftConsole')
  .component('mergedVmValue', {
    template: '{{$ctrl.text}}<span ng-if="$ctrl.showDifferenceMarker" style="color: orange;"> ⬤</span>',
    controller: ['mergedVmValueText', function (mergedVmValueText) {
      var ctrl = this;
      var previousVmValue = {};
      var previousOvmValue = {};
      ctrl.$doCheck = function () {
        var vmValue = ctrl.selector(ctrl.mergedVm.vm);
        var ovmValue = ctrl.selector(_.get(ctrl.mergedVm.ovm, 'spec.template'));
        if (vmValue !== previousVmValue || ovmValue !== previousOvmValue) {
          ctrl.text = mergedVmValueText(vmValue, ovmValue, ctrl.mergedVm);
          ctrl.showDifferenceMarker = _.get(ctrl.mergedVm, 'ovm.spec.running') && vmValue !== ovmValue;
          previousVmValue = vmValue;
          previousOvmValue = ovmValue;
        }
      };
    }],
    bindings: {
      mergedVm: '<',
      selector: '<'
    }
  });

angular.module('openshiftConsole')
  .filter('mergedVmDeletionTimestamp', function () {
    return function (mergedVm) {
      return _.get(mergedVm.ovm || mergedVm.vm, 'metadata.deletionTimestamp');
    };
  });

angular.module('openshiftConsole')
  .factory('VmActions', [
    'DataService',
    'KubevirtVersions',
    function (DataService, KubevirtVersions) {

    function setOvmRunning(ovm, running, context) {
      var updatedOvm = angular.copy(ovm);
      updatedOvm.spec.running = running;
      DataService.update(
        KubevirtVersions.offlineVirtualMachine.resource,
        ovm.metadata.name,
        updatedOvm,
        context
      );
    }

    return {
      start: function (ovm, context) {
        setOvmRunning(ovm, true, context);
      },
      restart: function (vm, context) {
        DataService.delete(
          KubevirtVersions.virtualMachine,
          vm.metadata.name,
          context
        );
      },
      stop: function (ovm, context) {
        setOvmRunning(ovm, false, context);
      }
    };
  }]);

angular.module('openshiftConsole')
  .filter('canStartMergedVm', function () {
    return function (mergedVm) {
      return mergedVm.ovm && _.get(mergedVm.ovm, 'spec.running') !== true;
    };
  });

angular.module('openshiftConsole')
  .filter('canRestartMergedVm', function () {
    return function (mergedVm) {
      return mergedVm.ovm && mergedVm.vm;
    };
  });

angular.module('openshiftConsole')
  .filter('canStopMergedVm', function () {
    return function (mergedVm) {
      return _.get(mergedVm.ovm, 'spec.running') === true;
    };
  });

angular.module('openshiftConsole')
  .component('vmActionsLine', {
    bindings: {
      mergedVm: '<',
      context: '<'
    },
    templateUrl: 'views/directives/vm-actions-line.html',
    controller: ['VmActions', function (VmActions) {
      this.VmActions = VmActions;
    }]
  });

angular.module('openshiftConsole')
  .filter('mergedVmState', function () {
    return function (mergedVm) {
      var vmPhase = _.get(mergedVm, 'vm.status.phase');
      if (vmPhase !== undefined) {
        return vmPhase;
      }
      if (_.get(mergedVm, 'ovm.spec.running') === false) {
        return "Not Running";
      }
      return "Unknown";
    };
  });

angular.module('openshiftConsole')
  .directive('vmState', function () {
    return {
      scope: {
        state: '<',
      },
      templateUrl: 'views/directives/vm-status.html'
    };
  });
