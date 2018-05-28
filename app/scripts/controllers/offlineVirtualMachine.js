'use strict';

angular.module('openshiftConsole')
  .controller('OfflineVirtualMachineController', function ($filter,
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
        title: "Offline Virtual Machines",
        link: "project/" + $routeParams.project + "/browse/offline-virtual-machines"
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
    var ovmLoadingError;
    var allPods = {}; // {[podName: string]: Pod}

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
          }, function () {
            $scope.vmLoaded = true;
          });

        DataService
          .get(KubevirtVersions.offlineVirtualMachine, $routeParams.vm, context, { errorNotification: false })
          .then(function (ovm) {
            $scope.ovm = ovm;
            $scope.ovmLoaded = true;
          }, function (error) {
            $scope.ovmLoaded = true;
            ovmLoadingError = error;
            updateLoadingAlert();
          });

        watches.push(DataService.watchObject(KubevirtVersions.virtualMachine, $routeParams.vm, context, function(vm, action) {
          $scope.vm = action === 'DELETED' ? undefined : vm;
        }));

        watches.push(DataService.watchObject(KubevirtVersions.offlineVirtualMachine, $routeParams.vm, context, function(ovm, action) {
          $scope.ovm = action === 'DELETED' ? undefined : ovm;
          ovmLoadingError = undefined;
          updateLoadingAlert();
        }));

        watches.push(DataService.watch($scope.podsVersion, context, function(result) {
          $scope.podsLoaded = true;
          allPods = result.by('metadata.name');
          updatePods();
        }));

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

        function updateLoadingAlert() {
          if (ovmLoadingError) {
            $scope.alerts.load = {
              type: 'error',
              message: 'The offline virtual machine detail could not be loaded.',
              details: $filter('getErrorDetails')(ovmLoadingError)
            };
          } else {
            delete $scope.alerts.load;
          }
          if (!$scope.ovm && !ovmLoadingError) {
            $scope.alerts.deleted = {
              type: 'warning',
              message: 'The offline virtual machine ' + $routeParams.vm + ' has been deleted.'
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
