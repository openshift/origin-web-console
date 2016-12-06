'use strict';

angular
  .module('openshiftConsole')
  .factory('RolesService', function($q, DataService) {

    var listAllRoles = function(context) {
      return $q.all([
        DataService
          .list('roles', context, null),
        DataService
          .list('clusterroles', {}, null)
      ]);
    };

    return {
      listAllRoles: listAllRoles
    };
  });
