"use strict";

angular.module("openshiftConsole")
  .directive("oscPersistentVolumeClaim",
             function($filter,
                      DataService,
                      LimitRangesService,
                      ModalsService,
                      DNS1123_SUBDOMAIN_VALIDATION) {
    return {
      restrict: 'E',
      scope: {
        claim: "=model",
        projectName: "="
      },
      templateUrl: 'views/directives/osc-persistent-volume-claim.html',
      link: function(scope) {
        var amountAndUnit = $filter('amountAndUnit');
        var usageValue = $filter('usageValue');

        scope.nameValidation = DNS1123_SUBDOMAIN_VALIDATION;

        scope.storageClasses = [];
        scope.defaultStorageClass = "";
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

        DataService.list({group: 'storage.k8s.io', resource: 'storageclasses'}, {}, function(storageClassData) {
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

        DataService.list('limitranges', { namespace: scope.projectName }, function(limitRangeData) {
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
      }
    };
  });
