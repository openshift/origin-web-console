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
    'VmHelpers',
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
    VmHelpers
    ) {
    $scope.projectName = $routeParams.project;
    $scope.unfilteredVmis = {};   // {{ [vmName: string]: Vmi }}
    $scope.unfilteredVms = {};  // {{ [vmName: string]: Vm }}
    $scope.mergedVms = {};       // {{ [vmName: string]: { vmi?: Vmi, vm: Vm } }}
    $scope.labelSuggestions = {};
    $scope.clearFilter = function() {
      LabelFilter.clear();
    };

    var watches = [];

    ProjectsService
      .get($routeParams.project)
      .then(_.spread(function(project, context) {
        $scope.project = project;

        watches.push(DataService.watch(KubevirtVersions.virtualMachineInstance, context, function(vmis) {
          $scope.vmisLoaded = true;
          $scope.unfilteredVmis = vmis.by('metadata.name');
          updateMergedVms();
        }));

        watches.push(DataService.watch(KubevirtVersions.virtualMachine, context, function(vms) {
          $scope.vmsLoaded = true;
          $scope.unfilteredVms = vms.by('metadata.name');
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
          $scope.unfilteredMergedVms = mergeVmsAndVmis($scope.unfilteredVms, $scope.unfilteredVmis);
          LabelFilter.addLabelSuggestionsFromResources($scope.unfilteredVms, $scope.labelSuggestions);
          LabelFilter.setLabelSuggestions($scope.labelSuggestions);
          filterVms();
        }

        /**
         * @param {{ [vmName: string]: Vm }} vms
         * @param {{ [vmName: string]: Vmi }} vmis
         * @return {{ [vmName: string]: { vm?: Vm, ovm?: Ovm } }}
         */
        function mergeVmsAndVmis(vms, vmis) {
          var vmIdToVmi = _.keyBy(vmis, VmHelpers.getVmReferenceId);
          var mergedVms = _.map(vms, function (vm) {
            var vmi = vmIdToVmi[vm.metadata.uid];
            var mergedVm = { vm: vm };
            if (vmi) {
              mergedVm.vmi = vmi;
            }
            return mergedVm;
          });
          return _.keyBy(mergedVms, 'vm.metadata.name');
        }

        $scope.allVmsLoaded = function () {
          return $scope.vmisLoaded && $scope.vmsLoaded;
        };

        $scope.$on('$destroy', function(){
          DataService.unwatchAll(watches);
        });
      }));
  }]);

angular.module('openshiftConsole')
  .factory('VmHelpers', [
    'KubevirtVersions',
    function (KubevirtVersions) {

      /**
       * @param {Pod} pod
       * @return {?string} virtual machine instance domain name if the pod is a 'virt-launcher' pod,
       *                   `null` otherwise
       */
      function getDomainName(pod) {
        var isVirtLauncher = _.get(pod, 'metadata.labels["kubevirt.io"]') === 'virt-launcher';
        var domainName = _.get(pod, 'metadata.labels["kubevirt.io/domain"]');
        return (isVirtLauncher && domainName) || null;
      }

      return {
        getVmReferenceId: function (vmi) {
          var references = _.get(vmi, 'metadata.ownerReferences');
          if (references === undefined) {
            return undefined;
          }
          return _(references)
            .filter({ kind: KubevirtVersions.virtualMachine.kind })
            .first()
            .uid;
        },
        /**
         * @param {Array<Pod>} pods all pods
         * @param {string} vmiDomainName domain name
         * @returns {Array<Pod>} virt-launcher pods related to the vmi of specified name
         *                       sorted by creation time starting by the latest
         */
        filterVmiPods: function (pods, vmiDomainName) {
          return _(pods)
            .filter(function (pod) {
              return getDomainName(pod) === vmiDomainName;
            })
            .sortBy(function (pod) {
              return new Date(pod.metadata.creationTimestamp);
            })
            .value();
        },
        getDomainName: getDomainName
      };
    }]);

angular.module('openshiftConsole').constant('KubevirtVersions', {
  virtualMachine: {
    resource: 'virtualmachines',
    group: 'kubevirt.io',
    version: 'v1alpha2',
    kind: 'VirtualMachine'
  },
  virtualMachineInstance: {
    resource: 'virtualmachineinstances',
    group: 'kubevirt.io',
    version: 'v1alpha2',
    kind: 'VirtualMachineInstance'
  }
});
