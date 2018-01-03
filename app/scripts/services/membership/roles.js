'use strict';

angular
  .module('openshiftConsole')
  .factory('RolesService', function(
    $q,
    APIService,
    DataService) {

    var rolesVersion = APIService.getPreferredVersion('roles');
    var clusterRolesVersion = APIService.getPreferredVersion('clusterroles');

    var listAllRoles = function(context) {
      return $q.all([
        DataService
          .list(rolesVersion, context, null),
        DataService
          .list(clusterRolesVersion, {}, null)
      ]);
    };

    return {
      listAllRoles: listAllRoles
    };
  });
