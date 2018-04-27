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
    function (
    $filter,
    $routeParams,
    $scope,
    APIService,
    DataService,
    ProjectsService,
    LabelFilter,
    Logger,
    KubevirtVersions
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

        LabelFilter.onActiveFiltersChanged(function(labelSelector) {
          // trigger a digest loop
          $scope.$evalAsync(function() {
            $scope.pods = labelSelector.select($scope.unfilteredPods);
            filterVms();
          });
        });

        function filterVms() {
          $scope.mergedVms = _($scope.unfilteredMergedVms)
            .filter(function (mergedVm) {
              return (mergedVm.ovm && LabelFilter.getLabelSelector().matches(mergedVm.ovm)) ||
                (mergedVm.vm && LabelFilter.getLabelSelector().matches(mergedVm.vm));
            })
            .sortBy($filter('mergedVmName'))
            .value();
          $scope.filterWithZeroResults = !LabelFilter.getLabelSelector().isEmpty() && _.isEmpty($scope.mergedVms) && !_.isEmpty($scope.unfilteredMergedVms);
        }

        function updateMergedVms() {
          $scope.unfilteredMergedVms = mergeOvmsAndVms($scope.unfilteredOvms, $scope.unfilteredVms);
          LabelFilter.addLabelSuggestionsFromResources($scope.unfilteredOvms, $scope.labelSuggestions);
          LabelFilter.addLabelSuggestionsFromResources($scope.unfilteredVms, $scope.labelSuggestions);
          LabelFilter.setLabelSuggestions($scope.labelSuggestions);
          filterVms();
        }

        /**
         * @param {{ [vmName: string]: Ovm }} ovms
         * @param {{ [vmName: string]: Vm }} vms
         * @return {{ [vmName: string]: { vm?: Vm, ovm?: Ovm } }}
         */
        function mergeOvmsAndVms(ovms, vms) {
          var ovmIdToVm = {};
          var runningOnlyVms = [];
          _.each(vms, function (vm) {
            var ownerReferences = _.get(vm, 'metadata.ownerReferences');
            if (!ownerReferences) {
              runningOnlyVms.push(vm);
              return;
            }
            var ovmReference = _(ownerReferences)
              .filter({ kind: 'OfflineVirtualMachine' })
              .first();
            if (!ovmReference || !ovmReference.uid) {
              runningOnlyVms.push(vm);
              return;
            }
            ovmIdToVm[ovmReference.uid] = vm;
          });

          var mergedVms = _.map(ovms, function (ovm) {
              var ovmId = ovm.metadata.uid;
              var vm = ovmIdToVm[ovmId];
              var mergedVm = {
                ovm: ovm
              };
              if (vm) {
                mergedVm.vm = vm;
                delete ovmIdToVm[ovmId];
              }
              return mergedVm;
            });

          // vms that has ovm reference but no corresponding ovm
          mergedVms = mergedVms.concat(_.map(ovmIdToVm, function (vm) {
            return { vm: vm };
          }));

          mergedVms = mergedVms.concat(_.map(runningOnlyVms, function (vm) {
            return { vm: vm };
          }));

          var mergedVmsByName = _.keyBy(mergedVms, $filter('mergedVmName'));
          return mergedVmsByName;
        }

        $scope.allVmsLoaded = function () {
          return $scope.vmsLoaded && $scope.ovmsLoaded;
        };

        $scope.$on('$destroy', function(){
          DataService.unwatchAll(watches);
        });
      }));
  }]);

angular.module('openshiftConsole')
  .filter('mergedVmId', function () {
    return function (mergedVm) {
      if (mergedVm.ovm) {
        return "ovm:" + mergedVm.ovm.metadata.uid;
      }
      return "vm:" + mergedVm.vm.metadata.uid;
    };
  });

angular.module('openshiftConsole')
  .filter('mergedVmName', function () {
    return function (mergedVm) {
      if (mergedVm.ovm) {
        return mergedVm.ovm.metadata.name;
      }
      return mergedVm.vm.metadata.name;
    };
  });

angular.module('openshiftConsole')
  .filter('mergedVmType', function () {
    return function (mergedVm) {
      return mergedVm.ovm ? '' : 'transient';
    };
  });

