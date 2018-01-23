'use strict';

angular
  .module('openshiftConsole')
  .factory('MembershipService', function($filter, APIService, Constants) {

    var annotation = $filter('annotation');

    var isLastRole = function(userName, roleBindings) {
      return _.filter(
              roleBindings,
              function(binding) {
                return _.some(binding.subjects, { name: userName });
              }).length === 1;
    };

    // internal helper to disambiguate objects with same name, etc:
    //  - Role view
    //  - ClusterRole view
    // arbitrary key creation via any number of provided arguments
    // examples:
    //  - uniqueKey(subject.kind, subject.name) = user-foo
    //  - uniqueKey(role.namespace, role.name) = proj-1-view
    var uniqueKey = function() {
      return _.reduce(
              _.slice(arguments),
              function(result, next, i) {
                return next ?
                      _.isEqual(i, 0) ?
                        next :
                        result + '-' + next :
                      result;
              }, '');
    };

    var getSubjectKinds = function() {
      return {
         "User":{
            "kind":"User",
            "sortOrder":1,
            "name":"User",
            "subjects":{

            }
         },
         "Group":{
            "kind":"Group",
            "sortOrder":2,
            "name":"Group",
            "subjects":{

            }
         },
         "ServiceAccount":{
            "kind":"ServiceAccount",
            "sortOrder":3,
            "description":"Service accounts provide a flexible way to control API access without sharing a regular user’s credentials.",
            "helpLinkKey":"service_accounts",
            "name":"ServiceAccount",
            "subjects":{

            }
         }
      };
    };

    var mapRolebindingsForUI =  function(rolebindings, roles) {
      var mapForUI = _.reduce(
                      rolebindings,
                      function(result, rolebinding) {
                        // matched keyedRoles below for lookups
                        var roleKey = uniqueKey(rolebinding.roleRef.apiGroup, rolebinding.roleRef.kind, rolebinding.roleRef.name);
                        // each subject, (user, bob; group: hobbits)
                        _.each(rolebinding.subjects, function(subject) {
                          var subjectKey = uniqueKey(subject.namespace, subject.name);
                          if(!result[subject.kind].subjects[subjectKey]) {
                            result[subject.kind].subjects[subjectKey]  = {
                              name: subject.name,
                              roles: {}
                            };
                            if(subject.namespace) {
                              result[subject.kind].subjects[subjectKey].namespace = subject.namespace;
                            }
                          }
                          if(!_.includes(result[subject.kind].subjects[subjectKey].roles, roleKey)) {
                            if(roles[roleKey]) {
                              result[subject.kind].subjects[subjectKey].roles[roleKey] = roles[roleKey];
                            }
                          }
                        });
                        return result;
                      },
                      getSubjectKinds());
      return _.sortBy(mapForUI, 'sortOrder');
    };

    var sortRoles = function(roles) {
      return _.sortBy(roles, 'metadata.name');
    };

    var filterRoles = function(roles) {
      return _.filter(roles, function(role) {
        return role.kind === 'Role' || _.includes(Constants.MEMBERSHIP_WHITELIST, role.metadata.name);
      });
    };

    var keyedRoles = function(roles) {
      return _.reduce(
              roles,
              function(result, role) {
                var group = APIService.parseGroupVersion(role.apiVersion).group;
                var roleKey = uniqueKey(group, role.kind, role.metadata.name);
                result[roleKey] = role;
                return result;
              }, {});
    };

    var mapRolesForUI = function(roles, clusterRoles) {
      return _.merge(keyedRoles(roles), keyedRoles(clusterRoles));
    };

    return {
      sortRoles: sortRoles,
      filterRoles: filterRoles,
      mapRolesForUI: mapRolesForUI,
      isLastRole: isLastRole,
      getSubjectKinds: getSubjectKinds,
      mapRolebindingsForUI: mapRolebindingsForUI
    };

  });
