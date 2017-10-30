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
        },
        systemImagePuller: {
          kind: 'RoleBinding', metadata: { name: 'system:image-puller' },
          roleRef: { name: 'system:image-puller' },
          subjects: [{kind: 'ServiceAccount', name: 'foo', namespace: 'fake-project'}]
        }
      };
    });
  });


  describe('#sortRoles', function() {
    it('should sort provided roles', function() {
      var sortedAlphabetical = [
        {"metadata":{"name":"admin"},"rules":{}, "kind": "ClusterRole"},
        {"metadata":{"name":"basic-user"},"rules":{},"kind": "ClusterRole"},
        {"metadata":{"name":"edit"},"rules":{},"kind": "ClusterRole"},
        {"metadata":{"name":"view"},"rules":{},"kind": "ClusterRole"}
      ];
      expect(MembershipService.sortRoles(clusterRoles)).toEqual(sortedAlphabetical);
    });
  });

  describe('#filterRoles', function() {
    // constants.js window.OPENSHIFT_CONSTANTS.MEMBERSHIP_WHITELIST
    it('should filter out roles that do not exist in MEMBERSHIP_WHITELIST', function() {
      var fakeList = [
        {metadata: {name: 'admin'}},
        {metadata: {name: 'basic-user'}},
        {metadata: {name: 'edit'}},
        {metadata: {name: 'not-an-admin'}},
        {metadata: {name: 'not-a-basic-user'}},
        {metadata: {name: 'system-only-thing-that-does-secret-stuff'}}
      ];

      expect(MembershipService.filterRoles(fakeList)).toEqual([
          {metadata: {name: 'admin'}},
          {metadata: {name: 'basic-user'}},
          {metadata: {name: 'edit'}}
      ]);
    });
  });

  describe('#mapRolesForUI', function() {


    it('should build a map of clusterRoles and roles with unique keys to ensure no collisions', function() {
      var mappedRoles = MembershipService.mapRolesForUI(roles, clusterRoles);
      expect(_.keys(mappedRoles)).toEqual([
        'Role-awesomeview',
        'Role-people-who-break-things',
        'ClusterRole-basic-user',
        'ClusterRole-admin',
        'ClusterRole-view',
        'ClusterRole-edit'
      ]);
      // the ugly manual JSON blob comparison
      expect(mappedRoles)
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
    it('should return the kind list in the preferred order', function() {
      var kinds = MembershipService.getSubjectKinds();
      expect(kinds['User'].sortOrder).toEqual(1);
      expect(kinds['Group'].sortOrder).toEqual(2);
      expect(kinds['ServiceAccount'].sortOrder).toEqual(3);
      expect(kinds['SystemUser'].sortOrder).toEqual(4);
      expect(kinds['SystemGroup'].sortOrder).toEqual(5);

      expect(kinds['User'].kind).toEqual('User');
      expect(kinds['Group'].kind).toEqual('Group');
      expect(kinds['ServiceAccount'].kind).toEqual('ServiceAccount');
      expect(kinds['SystemUser'].kind).toEqual('SystemUser');
      expect(kinds['SystemGroup'].kind).toEqual('SystemGroup');

      expect(kinds['SystemUser'].helpLinkKey).toEqual('users_and_groups');
      expect(kinds['SystemGroup'].helpLinkKey).toEqual('users_and_groups');
    });
  });

  describe('#mapRolebindingsForUI', function() {
    it('Should return rolebindings in the following order: User, Group, ServiceAccount, SystemUser, SystemGroup', function() {
      var mappedRolebindings = MembershipService.mapRolebindingsForUI(roleBindings, keyedRoles);
      var orderedKinds = _.map(mappedRolebindings, 'kind');
      expect(orderedKinds[0]).toEqual('User');
      expect(orderedKinds[1]).toEqual('Group');
      expect(orderedKinds[2]).toEqual('ServiceAccount');
      expect(orderedKinds[3]).toEqual('SystemUser');
      expect(orderedKinds[4]).toEqual('SystemGroup');
    });

    it('should put subjects under the appropriate kind', function() {
      var mappedRolebindings = MembershipService.mapRolebindingsForUI(roleBindings, keyedRoles);
      expect(_.map(mappedRolebindings[0].subjects, 'name')).toEqual(['jill', 'jack']);
      expect(_.map(mappedRolebindings[2].subjects, 'name')).toEqual(['foo']);
    });

    it('should list appropriate roles for a subject under a kind heading', function() {
      var mappedRolebindings = MembershipService.mapRolebindingsForUI(roleBindings, keyedRoles);
      var firstBinding = _.first(mappedRolebindings);
      var firstBindingSubjects = _.toArray(firstBinding.subjects);
      var firstSubject = _.first(firstBindingSubjects);
      var firstSubjectRoles = _.toArray(firstSubject.roles);
      var firstRoleNames = _.map(firstSubjectRoles, function(role) {
        return role.metadata.name;
      });
      expect(firstRoleNames).toEqual(['admin', 'view']);
    });


    // NOTE: ideally the above tests catch any issues as they do a better job of
    // declaring intent, if not, this test will compare raw output.
    it('should build a map for the tabbed role list interface', function() {

      // the full output tree should match
      expect(MembershipService.mapRolebindingsForUI(roleBindings, keyedRoles))
        .toEqual([{
            "kind": "User",
            "sortOrder": 1,
            "name": "User",
            "subjects": {
                "-jill": {
                    "name": "jill",
                    "roles": {
                        "ClusterRole-admin": {
                            "kind": "ClusterRole",
                            "metadata": {
                                "name": "admin"
                            }
                        },
                        "ClusterRole-view": {
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
            "subjects": {
                "fake-project-foo": {
                    "name": "foo",
                    "namespace": "fake-project",
                    "roles": {}
                }
            }
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
