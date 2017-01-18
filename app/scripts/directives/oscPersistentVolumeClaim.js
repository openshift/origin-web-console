"use strict";

angular.module("openshiftConsole")
  .directive("oscPersistentVolumeClaim",
             function(DataService,
                      ModalsService) {
    return {
      restrict: 'E',
      scope: {
        claim: "=model"
      },
      templateUrl: 'views/directives/osc-persistent-volume-claim.html',
      link: function(scope) {
        scope.storageClasses = [];
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

        DataService.list({group: 'storage.k8s.io', resource: 'storageclasses'}, {}, function(storageClasses) {
          scope.storageClasses = storageClasses.by('metadata.name');
        }, {errorNotification: false});
      }
    };
  });
