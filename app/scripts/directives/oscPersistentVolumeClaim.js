"use strict";

angular.module("openshiftConsole")
  .directive("oscPersistentVolumeClaim",
             function($filter,
                      APIService,
                      DataService,
                      LimitRangesService,
                      QuotaService,
                      ModalsService,
                      DNS1123_SUBDOMAIN_VALIDATION) {

    var storageClassesVersion = APIService.getPreferredVersion('storageclasses');
    var limitRangesVersion = APIService.getPreferredVersion('limitranges');
    var resourceQuotasVersion = APIService.getPreferredVersion('resourcequotas');
    var appliedClusterResourceQuotasVersion = APIService.getPreferredVersion('appliedclusterresourcequotas');

    return {
      restrict: 'E',
      scope: {
        claim: "=model",
        projectName: "="
      },
      templateUrl: 'views/directives/osc-persistent-volume-claim.html',
      link: function(scope) {
        var amountAndUnit = $filter('amountAndUnit');
        var storageClassAccessMode = $filter('storageClassAccessMode');
        var usageValue = $filter('usageValue');

        scope.nameValidation = DNS1123_SUBDOMAIN_VALIDATION;

        scope.storageClasses = [];
        scope.defaultStorageClass = "";
        // Default to ReadWriteOnce access mode for new PVCs.
        scope.claim.accessModes = 'ReadWriteOnce';
        scope.claim.unit = 'Gi';
        scope.units = [{
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
        scope.claim.selectedLabels = [];

        var previousLabels = [];
        scope.$watch('useLabels', function(useLabels, previousValue) {
          if (useLabels === previousValue) {
            return;
          }

          // Prefill the previous values if the checkbox was unchecked and checked again.
          if (useLabels) {
            scope.claim.selectedLabels = previousLabels;
          } else {
            previousLabels = scope.claim.selectedLabels;
            scope.claim.selectedLabels = [];
          }
        });

        scope.groupUnits = function(unit) {
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

        scope.showComputeUnitsHelp = function() {
          ModalsService.showComputeUnitsHelp();
        };

        scope.onStorageClassSelected = function(storageClass) {
          // Update to use the access mode from the storage class if set.
          var accessMode = storageClassAccessMode(storageClass);
          if (accessMode) {
            scope.claim.accessModes = accessMode;
          }
        };

        var validateLimitRange = function() {
          // Use usageValue filter to normalize units for comparison.
          var value = scope.claim.amount && usageValue(scope.claim.amount + scope.claim.unit);
          var min = _.has(scope, 'limits.min') && usageValue(scope.limits.min);
          var max = _.has(scope, 'limits.max') && usageValue(scope.limits.max);
          var minValid = true;
          var maxValid = true;

          // Test against limit range min if defined.
          if (value && min) {
            minValid = value >= min;
          }

          // Test against limit range max if defined.
          if (value && max) {
            maxValid = value <= max;
          }

          scope.persistentVolumeClaimForm.capacity.$setValidity('limitRangeMin', minValid);
          scope.persistentVolumeClaimForm.capacity.$setValidity('limitRangeMax', maxValid);
        };

        var validateQuota = function() {
          var outOfClaims = QuotaService.isAnyStorageQuotaExceeded(scope.quotas, scope.clusterQuotas);
          var willExceedStorage = QuotaService.willRequestExceedQuota(scope.quotas, scope.clusterQuotas, 'requests.storage', (scope.claim.amount + scope.claim.unit));
          scope.persistentVolumeClaimForm.capacity.$setValidity('willExceedStorage', !willExceedStorage);
          scope.persistentVolumeClaimForm.capacity.$setValidity('outOfClaims', !outOfClaims);
        };

        DataService.list(storageClassesVersion, {}, function(storageClassData) {
           var storageClasses = storageClassData.by('metadata.name');
           if (_.isEmpty(storageClasses)) {
             return;
           }

           scope.storageClasses = _.sortBy(storageClasses, 'metadata.name');
           var annotation = $filter('annotation');
           scope.defaultStorageClass = _.find(scope.storageClasses, function(storageClass) {
             return annotation(storageClass, 'storageclass.beta.kubernetes.io/is-default-class') === 'true';
           });
           if (!scope.defaultStorageClass)  { //if there is no default, set a no storage class option
             var noclass = {
               metadata: {
                 name: "No Storage Class",
                 labels: {},
                 annotations: {
                   description:  "No storage class will be assigned"
                 }
               }
             };
             scope.storageClasses.unshift(noclass);
           } else {
             scope.claim.storageClass = scope.defaultStorageClass;
           }
         }, {errorNotification: false});

        DataService.list(limitRangesVersion, { namespace: scope.projectName }, function(limitRangeData) {
          var limitRanges = limitRangeData.by('metadata.name');
          if (_.isEmpty(limitRanges)) {
            return;
          }

          scope.limits = LimitRangesService.getEffectiveLimitRange(limitRanges, 'storage', 'PersistentVolumeClaim');
          // If min === max, set the capacity to the required value and make the field readonly.
          var requiredAmountAndUnit;
          if (scope.limits.min && scope.limits.max) {
            var minUsage = usageValue(scope.limits.min);
            var maxUsage = usageValue(scope.limits.max);
            if (minUsage === maxUsage) {
              requiredAmountAndUnit = amountAndUnit(scope.limits.max);
              scope.claim.amount = Number(requiredAmountAndUnit[0]);
              scope.claim.unit = requiredAmountAndUnit[1];
              scope.capacityReadOnly = true;
            }
          }

          scope.$watchGroup(['claim.amount', 'claim.unit'], validateLimitRange);
        });

        DataService.list(resourceQuotasVersion, { namespace: scope.projectName }, function(quotaData) {
          scope.quotas = quotaData.by('metadata.name');
          scope.$watchGroup(['claim.amount', 'claim.unit'], validateQuota);
        });
        DataService.list(appliedClusterResourceQuotasVersion, { namespace: scope.projectName }, function(quotaData) {
          scope.clusterQuotas = quotaData.by('metadata.name');
        });
      }
    };
  });
