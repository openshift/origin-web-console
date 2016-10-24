"use strict";

angular.module("openshiftConsole")
  .directive("oscPersistentVolumeClaim", function(DataService){
    return {
      restrict: 'E',
      scope: {
        claim: "=model"
      },
      templateUrl: 'views/directives/osc-persistent-volume-claim.html',
      link: function(scope) {
        scope.storageClasses = [];
        scope.claim.unit = 'Mi';
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
          value: "Pi",
          label: "PiB"
        }];
        scope.claim.selectedLabels = [];
        DataService.list({group: 'storage.k8s.io', resource: 'storageclasses'}, {}, function(storageClasses) {
          scope.storageClasses = storageClasses.by('metadata.name');
        }, {errorNotification: false});
      }
    };
  });
