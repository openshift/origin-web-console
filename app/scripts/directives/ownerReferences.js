'use strict';

(function() {
  angular.module('openshiftConsole').component('ownerReferences', {
    controller: [
      OwnerReferences
    ],
    controllerAs: 'ctrl',
    bindings: {
      apiObject: '<'
    },
    templateUrl: 'views/directives/owner-references.html'
  });

  function OwnerReferences() {}
}());
