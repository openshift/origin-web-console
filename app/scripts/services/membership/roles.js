'use strict';

angular
  .module('openshiftConsole')
  .factory('RolesService', function(
    $q,
    APIService,
    DataService) {

    var roleBindingsVersion = APIService.getPreferredVersion('rolebindings');
    var clusterRoleBindingsVersion = APIService.getPreferredVersion('clusterroles');

    var listAllRoles = function(context) {
      return $q.all([
        DataService
          .list(roleBindingsVersion, context, null),
        DataService
          .list(clusterRoleBindingsVersion, {}, null)
      ]);
    };

    return {
      listAllRoles: listAllRoles
    };
  });
