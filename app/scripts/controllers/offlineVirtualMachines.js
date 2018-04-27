'use strict';

angular.module('openshiftConsole')
  .controller('OfflineVirtualMachinesController', [
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
    $scope.mergedVms = {};       // {{ [vmName: string]: { vm?: Vm, ovm?: Ovm } }}
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

        LabelFilter.onActiveFiltersChanged(function() {
          // trigger a digest loop
          $scope.$evalAsync(function() {
            filterVms();
          });
        });

        function filterVms() {
          $scope.mergedVms = _($scope.unfilteredMergedVms)
            .filter(function (mergedVm) {
              return LabelFilter.getLabelSelector().matches(mergedVm.ovm);
            })
            .sortBy('ovm.metadata.name')
            .value();
          $scope.filterWithZeroResults = !LabelFilter.getLabelSelector().isEmpty() && _.isEmpty($scope.mergedVms) && !_.isEmpty($scope.unfilteredMergedVms);
        }

        function updateMergedVms() {
          $scope.unfilteredMergedVms = mergeOvmsAndVms($scope.unfilteredOvms, $scope.unfilteredVms);
          LabelFilter.addLabelSuggestionsFromResources($scope.unfilteredOvms, $scope.labelSuggestions);
          LabelFilter.setLabelSuggestions($scope.labelSuggestions);
          filterVms();
        }

        /**
         * @param {{ [vmName: string]: Ovm }} ovms
         * @param {{ [vmName: string]: Vm }} vms
         * @return {{ [vmName: string]: { vm?: Vm, ovm?: Ovm } }}
         */
        function mergeOvmsAndVms(ovms, vms) {
          var ovmIdToVm = _.keyBy(vms, getOvmReferenceId);
          var mergedVms = _.map(ovms, function (ovm) {
            var vm = ovmIdToVm[ovm.metadata.uid];
            var mergedVm = { ovm: ovm };
            if (vm) {
              mergedVm.vm = vm;
            }
            return mergedVm;
          });
          return _.keyBy(mergedVms, 'ovm.metadata.name');
        }

        $scope.allVmsLoaded = function () {
          return $scope.vmsLoaded && $scope.ovmsLoaded;
        };

        $scope.$on('$destroy', function(){
          DataService.unwatchAll(watches);
        });
      }));
  }]);
