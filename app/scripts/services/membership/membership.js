'use strict';

angular
  .module('openshiftConsole')
  .factory('MembershipService', function($filter, gettext, gettextCatalog) {

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
            "description":gettextCatalog.getString(gettext("Service accounts provide a flexible way to control API access without sharing a regular user’s credentials.")),
            "helpLinkKey":"service_accounts",
            "name":"ServiceAccount",
            "subjects":{

            }
         },
         "SystemUser":{
            "kind":"SystemUser",
            "sortOrder":4,
            "description":gettextCatalog.getString(gettext("System users are virtual users automatically provisioned by the system.")),
            "helpLinkKey":"users_and_groups",
            "name":"SystemUser",
            "subjects":{

            }
         },
         "SystemGroup":{
            "kind":"SystemGroup",
            "sortOrder":5,
            "description":gettextCatalog.getString(gettext("System groups are virtual groups automatically provisioned by the system.")),
            "helpLinkKey":"users_and_groups",
            "name":"SystemGroup",
            "subjects":{

            }
         }
      };
    };

    var mapRolebindingsForUI =  function(rolebindings, roles) {
      var mapForUI = _.reduce(
                      rolebindings,
                      function(result, rolebinding) {
                        // hmm. dont like this here
                        var roleKey = uniqueKey(rolebinding.roleRef.namespace ? 'Role' : 'ClusterRole', rolebinding.roleRef.name);
                        // each subject, (user, bob; group: hobbits)
                        _.each(rolebinding.subjects, function(subject) {
                          var subjectKey = uniqueKey(subject.namespace, subject.name);
                          if(!result[subject.kind].subjects[subjectKey]) {
                            result[subject.kind].subjects[subjectKey]  = {
                              name: subject.name,
                              namespace: subject.namespace,
                              roles: {}
                            };
                          }
                          if(!_.includes(result[subject.kind].subjects[subjectKey].roles, roleKey)) {
                            result[subject.kind].subjects[subjectKey].roles[roleKey] = roles[roleKey];
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
      return _.filter(roles, function(item) {
        // system-only must be explicitly <string> 'true' to hide the annotation
        return annotation(item, 'systemOnly') !== 'true';
      });
    };

    var keyedRoles = function(roles) {
      return _.reduce(
              roles,
              function(result, role) {
                result[uniqueKey(role.kind, role.metadata.name)] = role;
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
