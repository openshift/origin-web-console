'use strict';

angular.module('openshiftConsole')
  .controller('VirtualMachinesController', [
    '$filter',
    '$routeParams',
    '$scope',
    'APIService',
    'DataService',
    'ProjectsService',
    'LabelFilter',
    'Logger',
    'KubevirtVersions',
    'getOvmReferenceId',
    function (
    $filter,
    $routeParams,
    $scope,
    APIService,
    DataService,
    ProjectsService,
    LabelFilter,
    Logger,
    KubevirtVersions,
    getOvmReferenceId
    ) {
    $scope.projectName = $routeParams.project;
    $scope.unfilteredVms = {};   // {{ [vmName: string]: Vm }}
    $scope.unfilteredOvms = {};  // {{ [vmName: string]: Ovm }}
    $scope.unfilteredPods = {};  // {{ [podName: string]: Pod }}
    $scope.mergedVms = {};       // {{ [vmName: string]: { vm: Vm, ovm?: Ovm, pod?: Pod } }}
    $scope.labelSuggestions = {};
    $scope.clearFilter = function() {
      LabelFilter.clear();
    };

    var watches = [];

    ProjectsService
      .get($routeParams.project)
      .then(_.spread(function(project, context) {
        $scope.project = project;

        watches.push(DataService.watch(KubevirtVersions.virtualMachine, context, function(vms) {
          $scope.vmsLoaded = true;
          $scope.unfilteredVms = vms.by("metadata.name");
          updateMergedVms();
        }));

        watches.push(DataService.watch(KubevirtVersions.offlineVirtualMachine, context, function(ovms) {
          $scope.ovmsLoaded = true;
          $scope.unfilteredOvms = ovms.by("metadata.name");
          updateMergedVms();
        }));

        watches.push(DataService.watch(APIService.getPreferredVersion('pods'), context, function(pods) {
          $scope.podsLoaded = true;
          $scope.unfilteredPods = pods.by("metadata.name");
          updateMergedVms();
        }));

        LabelFilter.onActiveFiltersChanged(function() {
          // trigger a digest loop
          $scope.$evalAsync(function() {
            filterVms();
          });
        });

        function filterVms() {
          $scope.mergedVms = _($scope.unfilteredMergedVms)
            .filter(function (mergedVm) {
              return LabelFilter.getLabelSelector().matches(mergedVm.vm);
            })
            .sortBy('vm.metadata.name')
            .value();
          $scope.filterWithZeroResults = !LabelFilter.getLabelSelector().isEmpty() && _.isEmpty($scope.mergedVms) && !_.isEmpty($scope.unfilteredMergedVms);
        }

        function updateMergedVms() {
          $scope.unfilteredMergedVms = mergeOvmsAndVms($scope.unfilteredOvms, $scope.unfilteredVms, $scope.unfilteredPods);
          LabelFilter.addLabelSuggestionsFromResources($scope.unfilteredVms, $scope.labelSuggestions);
          LabelFilter.setLabelSuggestions($scope.labelSuggestions);
          filterVms();
        }

        /**
         * It returns all vms optionally enhanced by ovm reference.
         * @param {{ [vmName: string]: Ovm }} ovms
         * @param {{ [vmName: string]: Vm }} vms
         * @param {{ [podName: string]: Pod }} pods
         * @return {{ [vmName: string]: { vm: Vm, ovm?: Ovm } }}
         */
        function mergeOvmsAndVms(ovms, vms, pods) {
          var ovmIdToOvm = _.keyBy(ovms, 'metadata.uid');
          var vmNameToPod = _(pods)
            .filter(function (pod) {
              return _.get(pod, 'metadata.labels["kubevirt.io"]') && _.get(pod, 'metadata.labels["kubevirt.io/domain"]');
            })
            .keyBy('metadata.labels["kubevirt.io/domain"]')
            .value();
          var vmsArray = _.map(vms, function (vm) {
            var ovmId = getOvmReferenceId(vm);
            var ovm = ovmId && ovmIdToOvm[ovmId];
            var pod = vmNameToPod[vm.metadata.name];
            var mergedVm = { vm: vm };
            if (ovm) {
              mergedVm.ovm = ovm;
            }
            if (pod) {
              mergedVm.pod = pod;
            }
            return mergedVm;
          });
          return _.keyBy(vmsArray, 'vm.metadata.name');
        }

        $scope.allVmsLoaded = function () {
          return $scope.vmsLoaded && $scope.ovmsLoaded && $scope.podsLoaded;
        };

        $scope.$on('$destroy', function(){
          DataService.unwatchAll(watches);
        });
      }));
  }]);

angular.module('openshiftConsole')
  .constant('getOvmReferenceId', function (vm) {
    var references = _.get(vm, 'metadata.ownerReferences');
    if (references === undefined) {
      return undefined;
    }
    return _(references)
      .filter({ kind: 'OfflineVirtualMachine' })
      .first()
      .uid;
  });
