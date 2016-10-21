'use strict';

angular
  .module('openshiftConsole')
  .factory('RolesService', function($q, DataService) {

    var listClusterRoles = function(cb, opts) {
      DataService.list('clusterroles', {}, cb, opts);
    };

    var listRoles = function(context, cb, opts) {
      DataService.list('roles', context, cb, opts);
    };

    // wraps the 2 API list calls in a promise for easier use, similar to above get()
    var listAllRoles = function(context) {
      var deferred = $q.defer();
      var result = [];

      var resolve = function(resp) {
        result.push(resp.by('metadata.name'));
        if(_.isEqual(result.length, 2)) {
          deferred.resolve(result);
        }
      };

      listRoles(context, function(resp) {
        resolve(resp);
      });
      listClusterRoles(function(resp) {
        resolve(resp);
      });

      return deferred.promise;
    };


    return {
      listAllRoles: listAllRoles
    };
  });
