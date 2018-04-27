'use strict';

angular.module('openshiftConsole')
  .controller('VirtualMachineController', function ($filter,
                                         $routeParams,
                                         $scope,
                                         APIService,
                                         DataService,
                                         Navigate,
                                         ProjectsService,
                                         KubevirtVersions,
                                         VmActions,
                                         MetricsService,
                                         VmHelpers) {
    $scope.projectName = $routeParams.project;
    $scope.alerts = {};
    $scope.logOptions = {};
    $scope.breadcrumbs = [
      {
        title: 'Virtual Machines',
        link: Navigate.resourceListURL(KubevirtVersions.virtualMachine.resource, $routeParams.project)
      },
      {
        title: $routeParams.vm
      }
    ];

    // Must always be initialized so we can watch selectedTab
    $scope.selectedTab = {};
    $scope.vmi = undefined;
    $scope.vm = undefined;
    $scope.pods = []; // sorted by creation time, the most recent first

    $scope.loaded = function () {
      return $scope.vmiLoaded && $scope.vmLoaded && $scope.podsLoaded;
    };

    $scope.podsVersion = APIService.getPreferredVersion('pods');
    $scope.eventsVersion = APIService.getPreferredVersion('events');
    $scope.KubevirtVersions = KubevirtVersions;
    $scope.VmActions = VmActions;

    // Check if the metrics service is available so we know when to show the tab.
    MetricsService.isAvailable().then(function(available) {
      $scope.metricsAvailable = available;
    });

    var watches = [];
    var requestContext = null;
    var vmLoadingError;
    var allPods = {}; // {[podName: string]: Pod}

    ProjectsService
      .get($routeParams.project)
      .then(_.spread(function(project, context) {
        requestContext = context;
        $scope.project = project;
        $scope.projectContext = context;

        DataService
          .get(KubevirtVersions.virtualMachineInstance, $routeParams.vm, context, { errorNotification: false })
          .then(function (vmi) {
            $scope.vmi = vmi;
            $scope.vmiLoaded = true;
          }, function () {
            $scope.vmiLoaded = true;
          });

        DataService
          .get(KubevirtVersions.virtualMachine, $routeParams.vm, context, { errorNotification: false })
          .then(function (vm) {
            $scope.vm = vm;
            $scope.vmLoaded = true;
          }, function (error) {
            $scope.vmLoaded = true;
            vmLoadingError = error;
            updateLoadingAlert();
          });

        watches.push(DataService.watchObject(KubevirtVersions.virtualMachineInstance, $routeParams.vm, context, function(vmi, action) {
          $scope.vmi = action === 'DELETED' ? undefined : vmi;
        }));

        watches.push(DataService.watchObject(KubevirtVersions.virtualMachine, $routeParams.vm, context, function(vm, action) {
          $scope.vm = action === 'DELETED' ? undefined : vm;
          vmLoadingError = undefined;
          updateLoadingAlert();
        }));

        watches.push(DataService.watch($scope.podsVersion, context, function(result) {
          $scope.podsLoaded = true;
          allPods = result.by('metadata.name');
          updatePods();
        }));

        function updatePods() {
          if (!$scope.vmi) {
            $scope.pods = [];
            return;
          }
          $scope.pods = VmHelpers.filterVmiPods(allPods, $scope.vmi.metadata.name);
        }

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
