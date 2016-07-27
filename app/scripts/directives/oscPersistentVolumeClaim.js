"use strict";

angular.module("openshiftConsole")
  .directive("oscPersistentVolumeClaim", function(){
    return {
      restrict: 'E',
      scope: {
        claim: "=model"
      },
      templateUrl: 'views/directives/osc-persistent-volume-claim.html',
      link: function(scope) {
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
        }
    };
  });
