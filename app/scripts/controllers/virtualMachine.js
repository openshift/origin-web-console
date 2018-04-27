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
    $scope.logOptions = {};
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
    $scope.vm = undefined;
    $scope.ovm = undefined;
    $scope.pods = []; // sorted by creation time, the most recent first
    $scope.loaded = function () {
      return $scope.vmLoaded && $scope.ovmLoaded && $scope.podsLoaded;
    };

    $scope.podsVersion = APIService.getPreferredVersion('pods');
    $scope.eventsVersion = APIService.getPreferredVersion('events');
    $scope.KubevirtVersions = KubevirtVersions;
    $scope.VmActions = VmActions;

    var watches = [];
    var requestContext = null;

    var allPods = {}; // {[podName: string]: Pod}

    function updatePods() {
      if (!$scope.vm) {
        $scope.pods = [];
        return;
      }
      $scope.pods = _(allPods)
        .filter(function (pod) {
          return _.get(pod, 'metadata.labels["kubevirt.io"]') === 'virt-launcher' &&
            _.get(pod, 'metadata.labels["kubevirt.io/domain"]') === $scope.vm.metadata.name;
        })
        .sortBy(function (pod) {
          return new Date(pod.metadata.creationTimestamp);
        })
        .value();
    }

    var vmLoadingError;

    ProjectsService
      .get($routeParams.project)
      .then(_.spread(function(project, context) {
        requestContext = context;
        $scope.project = project;
        $scope.projectContext = context;

        DataService
          .get(KubevirtVersions.virtualMachine, $routeParams.vm, context, { errorNotification: false })
          .then(function (vm) {
            $scope.vm = vm;
            $scope.vmLoaded = true;
            updatePods();
          }, function (error) {
            $scope.vmLoaded = true;
            vmLoadingError = error;
            updateLoadingAlert();
          });

        DataService
          .get(KubevirtVersions.offlineVirtualMachine, $routeParams.vm, context, { errorNotification: false })
          .then(function (ovm) {
            $scope.ovm = ovm;
            $scope.ovmLoaded = true;
          }, function () {
            $scope.ovmLoaded = true;
          });

        watches.push(DataService.watchObject(KubevirtVersions.virtualMachine, $routeParams.vm, context, function(vm, action) {
          $scope.vm = action === 'DELETED' ? undefined : vm;
          updatePods();
          vmLoadingError = undefined;
          updateLoadingAlert();
        }));

        watches.push(DataService.watchObject(KubevirtVersions.offlineVirtualMachine, $routeParams.vm, context, function(ovm, action) {
          $scope.ovm = action === 'DELETED' ? undefined : ovm;
        }));

        watches.push(DataService.watch($scope.podsVersion, context, function(result) {
          $scope.podsLoaded = true;
          allPods = result.by('metadata.name');
          updatePods();
        }));

        function updateLoadingAlert() {
          if (vmLoadingError) {
            $scope.alerts.load = {
              type: 'error',
              message: 'The virtual machine detail could not be loaded.',
              details: $filter('getErrorDetails')(vmLoadingError)
            };
          } else {
            delete $scope.alerts.load;
          }
          if (!$scope.vm && !vmLoadingError) {
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
      },
      canStart: function (ovm) {
        return ovm && _.get(ovm, 'spec.running') !== true;
      },
      canRestart: function (vm, ovm) {
        return vm && ovm;
      },
      canStop: function (ovm) {
        return _.get(ovm, 'spec.running') === true;
      },
    };
  }]);

angular.module('openshiftConsole')
  .component('vmActionsLine', {
    bindings: {
      vm: '<',
      ovm: '<',
      context: '<'
    },
    templateUrl: 'views/directives/vm-actions-line.html',
    controller: ['VmActions', function (VmActions) {
      this.VmActions = VmActions;
    }]
  });

angular.module('openshiftConsole')
  .filter('vmStateText', function () {
    return function (vm, ovm) {
      var vmPhase = _.get(vm, 'status.phase');
      if (vmPhase !== undefined) {
        return vmPhase;
      }
      if (_.get(ovm, 'spec.running') === false) {
        return "Not Running";
      }
      return "Unknown";
    };
  });

angular.module('openshiftConsole')
  .filter('vmMemory', function () {
    return function (vm) {
      return _.get(vm, 'spec.domain.resources.requests.memory');
    };
  });

angular.module('openshiftConsole')
  .filter('vmOs', function () {
    return function (vm) {
      return _.get(vm, 'metadata.labels["kubevirt.io/os"]');
    };
  });

angular.module('openshiftConsole')
  .filter('orDashes', function () {
    return function (input) {
      return input === undefined ? '--' : input;
    };
  });

angular.module('openshiftConsole')
  .directive('vmState', function () {
    return {
      scope: {
        state: '<',
      },
      template: '<vm-state-icon state="state"></vm-state-icon> {{state}}'
    };
  });

angular.module('openshiftConsole')
  .directive('vmStateIcon', function () {
    return {
      scope: {
        state: '<',
      },
      templateUrl: 'views/directives/vm-state-icon.html'
    };
  });
