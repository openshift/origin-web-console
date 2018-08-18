'use strict';

angular.module('openshiftConsole')
  .controller('EditPvcModalController', function(APIService, DataService, $filter, LimitRangesService, QuotaService, $scope, $uibModalInstance) {

    var limitRangesVersion = APIService.getPreferredVersion('limitranges');
    var resourceQuotasVersion = APIService.getPreferredVersion('resourcequotas');
    var appliedClusterResourceQuotasVersion = APIService.getPreferredVersion('appliedclusterresourcequotas');

    var amountAndUnit = $filter('amountAndUnit');
    var usageWithUnits = $filter('usageWithUnits');
    var usageValue = $filter('usageValue');

    var allocatedAmountAndUnit = amountAndUnit($scope.pvc.spec.resources.requests['storage']);

    $scope.projectName = $scope.pvc.metadata.namespace;
    $scope.typeDisplayName = $filter('humanizeKind')($scope.pvc.metadata.name);
    $scope.claim = {}
    $scope.claim.capacity = Number(allocatedAmountAndUnit[0]);
    $scope.claim.unit = allocatedAmountAndUnit[1];
    $scope.disableButton = true;

    $scope.currentCapacityUnits = angular.copy($scope.claim);

    $scope.units = [{
      value: "Mi",
      label: "MiB"
    }, {
      value: "Gi",
      label: "GiB"
    }, {
      value: "Ti",
      label: "TiB"
    }, {
      value: "M",
      label: "MB"
    }, {
      value: "G",
      label: "GB"
    }, {
      value: "T",
      label: "TB"
    }];

    $scope.groupUnits = function(unit) {
      switch (unit.value) {
      case 'Mi':
      case 'Gi':
      case 'Ti':
        return 'Binary Units';
      case 'M':
      case 'G':
      case 'T':
        return 'Decimal Units';
      }

      return '';
    };

    $scope.expand = function() {
      $scope.updatedCapacity = $scope.claim.capacity + $scope.claim.unit;
      $uibModalInstance.close($scope.updatedCapacity);
    };

    $scope.cancel = function() {
      $uibModalInstance.dismiss('cancel');
    };

    var validateLimitRange = function() {
      // Use usageValue filter to normalize units for comparison.
      var value = $scope.claim.capacity && usageValue($scope.claim.capacity + $scope.claim.unit);
      var min = _.has($scope, 'limits.min') && usageValue($scope.limits.min);
      var max = _.has($scope, 'limits.max') && usageValue($scope.limits.max);
      var minValid = true;
      var maxValid = true;

      minValid = value >= min;
      maxValid = value <= max;

      $scope.expandPersistentVolumeClaimForm.capacity.$setValidity('limitRangeMin', minValid);
      $scope.expandPersistentVolumeClaimForm.capacity.$setValidity('limitRangeMax', maxValid);
    };

    var validateQuota = function() {
      var newValue = $scope.claim.capacity && usageValue($scope.claim.capacity + $scope.claim.unit);
      var oldValue = $scope.currentCapacityUnits.capacity && usageValue($scope.currentCapacityUnits.capacity + $scope.currentCapacityUnits.unit);
      var willExceedStorage = QuotaService.willRequestExceedQuota($scope.quotas, $scope.clusterQuotas, 'requests.storage', (newValue - oldValue));
      $scope.expandPersistentVolumeClaimForm.capacity.$setValidity('willExceedStorage', !willExceedStorage);
    };

    var validateCapacityValid = function (value) {
      var value = $scope.claim.capacity && usageValue($scope.claim.capacity + $scope.claim.unit);
      var currentValue = $scope.currentCapacityUnits.capacity && usageValue($scope.currentCapacityUnits.capacity + $scope.currentCapacityUnits.unit);
      var requestValid = value > currentValue;
      $scope.expandPersistentVolumeClaimForm.capacity.$setValidity('checkCurrentCapacity', requestValid);
    }

    DataService.list(limitRangesVersion, { namespace: $scope.projectName }, function(limitRangeData) {
      var limitRanges = limitRangeData.by('metadata.name');
      $scope.$watchGroup(['claim.capacity', 'claim.unit'], validateCapacityValid);
      $scope.disableButton = false;
      if (_.isEmpty(limitRanges)) {
        return;
      }

      $scope.limits = LimitRangesService.getEffectiveLimitRange(limitRanges, 'storage', 'PersistentVolumeClaim');
      if ($scope.limits.min && $scope.limits.max) {
        var minUsage = usageValue($scope.limits.min);
        var maxUsage = usageValue($scope.limits.max);
        if (minUsage === maxUsage) {
          var requiredAmountAndUnit = amountAndUnit($scope.limits.max);
          $scope.claim.capacity = Number(requiredAmountAndUnit[0]);
          $scope.claim.unit = requiredAmountAndUnit[1];
          $scope.capacityReadOnly = true;
        }
      }

      $scope.$watchGroup(['claim.capacity', 'claim.unit'], validateLimitRange);
    });

    DataService.list(resourceQuotasVersion, { namespace: $scope.projectName }, function(quotaData) {
      $scope.quotas = quotaData.by('metadata.name');
      $scope.$watchGroup(['claim.capacity', 'claim.unit'], validateQuota);
    });

    DataService.list(appliedClusterResourceQuotasVersion, { namespace: $scope.projectName }, function(quotaData) {
      $scope.clusterQuotas = quotaData.by('metadata.name');
    });

  });
