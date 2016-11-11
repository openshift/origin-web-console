'use strict';

describe('MembershipService', function() {
  var MembershipService;
  var clusterRoles;
  var roles;
  var keyedRoles;
  var roleBindings;

  beforeEach(function(){
    inject(function(_MembershipService_){
      MembershipService = _MembershipService_;
      // limited sample set of roles & clusterRoles
      // reduced role.rules = {empty} in both roles sets
      clusterRoles = [
        {"metadata":{"name":"basic-user"},"rules":{}, "kind": "ClusterRole"},
        {"metadata":{"name":"admin"},"rules":{}, "kind": "ClusterRole"},
        {"metadata":{"name":"view"},"rules":{}, "kind": "ClusterRole"},
        {"metadata":{"name":"edit"},"rules":{}, "kind": "ClusterRole"}
      ];
      roles = [{
          "metadata": { "name": "awesomeview", "namespace": "membership-test" },
          "rules": {},
          "kind": "Role"
      }, {
          "metadata": { "name": "people-who-break-things", "namespace": "membership-test" },
          "rules": {},
          "kind": "Role"
      }];
      keyedRoles = {
        'ClusterRole-admin' : {
          kind: 'ClusterRole',
          metadata: { name:'admin' }
        },
        'ClusterRole-view' : {
          kind: 'ClusterRole',
          metadata: { name:'view' }
        },
        'ClusterRole-edit' : {
          kind: 'ClusterRole',
          metadata: { name:'edit' }
        },
        'Role-awesomeview' : {
          kind: 'Role',
          metadata: { name:'awesomeview' }
        }
      };
      roleBindings = {
        admin: {
          kind: 'RoleBinding', metadata: { name: 'admin' },
          roleRef: { name: 'admin' },
          subjects: [{kind: 'User', name: 'jill'}]
        },
        edit: {
          kind: 'RoleBinding', metadata: { name: 'edit' },
          roleRef: { name: 'edit' },
          subjects: [{kind: 'User', name: 'jack'}]
        },
        view: {
          kind: 'RoleBinding', metadata: { name: 'view' },
          roleRef: { name: 'view' },
          subjects: [{kind: 'User', name: 'jill'}]
        }
      };
    });
  });


  describe('#sortRoles', function() {
    it('should sort provided roles', function() {
      var sorted = [
        {"metadata":{"name":"admin"},"rules":{}, "kind": "ClusterRole"},
        {"metadata":{"name":"basic-user"},"rules":{},"kind": "ClusterRole"},
        {"metadata":{"name":"edit"},"rules":{},"kind": "ClusterRole"},
        {"metadata":{"name":"view"},"rules":{},"kind": "ClusterRole"}
      ];
      expect(MembershipService.sortRoles(clusterRoles)).toEqual(sorted);
    });
  });

  describe('#filterRoles', function() {
    it('should filter out system-only roles', function() {
      var fakeList = [
        // specific roles filter will explicitly pass
        {metadata: {name: 'system:image-puller'}},
        {metadata: {name: 'system:image-pusher'}},
        {metadata: {name: 'system:image-builder'}},
        {metadata: {name: 'system:deployer'}},
        // roles the filter will explicitly reject
        {metadata: {name: 'cluster-magical-scary-role'}},
        {metadata: {name: 'system:special-scary-role'}},
        {metadata: {name: 'registry-ninja'}},
        {metadata: {name: 'self-destruction'}},
        // ignored
        {metadata: {name: 'admin'}},
        {metadata: {name: 'edit'}}
      ];

      expect(MembershipService.filterRoles(fakeList)).toEqual([
        {metadata : {name : 'system:image-puller'}},
        {metadata : {name : 'system:image-pusher' }},
        {metadata : {name : 'system:image-builder'}},
        {metadata : {name : 'system:deployer'}},
        {metadata : {name : 'admin'}},
        {metadata : {name : 'edit'}}
      ]);
    });
  });

  describe('#mapRolesForUI', function() {
    it('should merge clusterRoles & roles into a single object with unique keys to ensure no collisions', function() {
      expect(MembershipService.mapRolesForUI(roles, clusterRoles))
      .toEqual({
          "Role-awesomeview": {
              "metadata": {
                  "name": "awesomeview",
                  "namespace": "membership-test"
              },
              "rules": {},
              "kind": "Role"
          },
          "Role-people-who-break-things": {
              "metadata": {
                  "name": "people-who-break-things",
                  "namespace": "membership-test"
              },
              "rules": {},
              "kind": "Role"
          },
          "ClusterRole-basic-user": {
              "metadata": {
                  "name": "basic-user"
              },
              "rules": {},
              "kind": "ClusterRole"
          },
          "ClusterRole-admin": {
              "metadata": {
                  "name": "admin"
              },
              "rules": {},
              "kind": "ClusterRole"
          },
          "ClusterRole-view": {
              "metadata": {
                  "name": "view"
              },
              "rules": {},
              "kind": "ClusterRole"
          },
          "ClusterRole-edit": {
              "metadata": {
                  "name": "edit"
              },
              "rules": {},
              "kind": "ClusterRole"
          }
      });
    });
  });

  describe('#isLastRole', function() {
    it('should indicate a user\'s last role', function() {
      // jack is bound to 1 role
      expect(MembershipService.isLastRole('jack', roleBindings)).toEqual(true);
      // jill is bound to 2 roles
      expect(MembershipService.isLastRole('jill', roleBindings)).toEqual(false);
    });
  });

  describe('#getSubjectKinds', function() {
    // No test needed, this returns static data
  });

  describe('#mapRolebindingsForUI', function() {
    it('should build a map for the tabbed role list interface', function() {
      expect(MembershipService.mapRolebindingsForUI(roleBindings, keyedRoles))
        .toEqual(
          [{
            "kind": "User",
            "sortOrder": 1,
            "name": "User",
            "subjects": {
                // uniqueKey(namespace, name) -> 'namespace-name'
                "-jill": {
                    "name": "jill",
                    "roles": {
                        "ClusterRole-admin": {
                            "kind": "ClusterRole",
                            "metadata": {
                                "name": "admin"
                            }
                        },
                        "ClusterRole-view" : {
                          "kind": "ClusterRole",
                          "metadata": {
                            "name": "view"
                          }
                        }
                    }
                },
                "-jack": {
                    "name": "jack",
                    "roles": {
                        "ClusterRole-edit": {
                            "kind": "ClusterRole",
                            "metadata": {
                                "name": "edit"
                            }
                        }
                    }
                }
            }
            }, {
                "kind": "Group",
                "sortOrder": 2,
                "name": "Group",
                "subjects": {}
            }, {
                "kind": "ServiceAccount",
                "sortOrder": 3,
                "description": "Service accounts provide a flexible way to control API access without sharing a regular user’s credentials.",
                "helpLinkKey": "service_accounts",
                "name": "ServiceAccount",
                "subjects": {}
            }, {
                "kind": "SystemUser",
                "sortOrder": 4,
                "description": "System users are virtual users automatically provisioned by the system.",
                "helpLinkKey": "users_and_groups",
                "name": "SystemUser",
                "subjects": {}
            }, {
                "kind": "SystemGroup",
                "sortOrder": 5,
                "description": "System groups are virtual groups automatically provisioned by the system.",
                "helpLinkKey": "users_and_groups",
                "name": "SystemGroup",
                "subjects": {}
            }]);
    });
  });

});
