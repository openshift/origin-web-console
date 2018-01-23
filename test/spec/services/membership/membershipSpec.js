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
        {"metadata":{"name":"basic-user"},"rules":{}, "kind": "ClusterRole", apiVersion: 'rbac.authorization.k8s.io/v1'},
        {"metadata":{"name":"admin"},"rules":{}, "kind": "ClusterRole", apiVersion: 'rbac.authorization.k8s.io/v1'},
        {"metadata":{"name":"view"},"rules":{}, "kind": "ClusterRole", apiVersion: 'rbac.authorization.k8s.io/v1'},
        {"metadata":{"name":"edit"},"rules":{}, "kind": "ClusterRole", apiVersion: 'rbac.authorization.k8s.io/v1'}
      ];
      roles = [{
          "metadata": { "name": "awesomeview", "namespace": "membership-test" },
          "rules": {},
          "kind": "Role",
          apiVersion: 'rbac.authorization.k8s.io/v1'
      }, {
          "metadata": { "name": "people-who-break-things", "namespace": "membership-test" },
          "rules": {},
          "kind": "Role",
          apiVersion: 'rbac.authorization.k8s.io/v1'
      }, {
          "metadata": { "name": "deleteservices", "namespace": "membership-test" },
          "rules": {},
          "kind": "Role",
          apiVersion: 'rbac.authorization.k8s.io/v1'
      }];

      roleBindings = {
        admin: {
          kind: 'RoleBinding', metadata: { name: 'admin' },
          roleRef: { name: 'admin', kind: 'ClusterRole', apiGroup: 'rbac.authorization.k8s.io' },
          subjects: [{kind: 'User', name: 'jill'}]
        },
        edit: {
          kind: 'RoleBinding', metadata: { name: 'edit' },
          roleRef: { name: 'edit', kind: 'ClusterRole', apiGroup: 'rbac.authorization.k8s.io' },
          subjects: [{kind: 'User', name: 'jack'}]
        },
        view: {
          kind: 'RoleBinding', metadata: { name: 'view' },
          roleRef: { name: 'view', kind: 'ClusterRole', apiGroup: 'rbac.authorization.k8s.io' },
          subjects: [{kind: 'User', name: 'jill'}]
        },
        systemImagePuller: {
          kind: 'RoleBinding', metadata: { name: 'system:image-puller' },
          roleRef: { name: 'system:image-puller', kind: 'ClusterRole', apiGroup: 'rbac.authorization.k8s.io' },
          subjects: [{kind: 'ServiceAccount', name: 'foo', namespace: 'fake-project'}]
        },
        // custom rolebinding for a custom role
        deleteservices: {
          kind: 'RoleBinding', metadata: { name: 'deleteservices' },
          roleRef: { name: 'deleteservices', kind: 'Role', apiGroup: 'rbac.authorization.k8s.io' },
          subjects: [{kind: 'User', name: 'jenny'}]
        }
      };
    });
  });


  describe('#sortRoles', function() {
    it('should sort provided roles', function() {
      var sortedAlphabetical = [
        {"metadata":{"name":"admin"},"rules":{}, "kind": "ClusterRole", apiVersion: 'rbac.authorization.k8s.io/v1'},
        {"metadata":{"name":"basic-user"},"rules":{},"kind": "ClusterRole", apiVersion: 'rbac.authorization.k8s.io/v1'},
        {"metadata":{"name":"edit"},"rules":{},"kind": "ClusterRole", apiVersion: 'rbac.authorization.k8s.io/v1'},
        {"metadata":{"name":"view"},"rules":{},"kind": "ClusterRole", apiVersion: 'rbac.authorization.k8s.io/v1'}
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

    it('should filter ClusterRoles, but allow Roles to pass through', function() {
      var roles = [
        {metadata: {name: 'admin'}},
        {metadata: {name: 'basic-user'}},
        {metadata: {name: 'edit'}},
        {metadata: {name: 'ThisIsNotACluserRole'}, kind: 'Role'},
        {metadata: {name: 'ThisIsAClusterRole'}, kind: 'ClusterRole'}
      ];
      expect(MembershipService.filterRoles(roles)).toEqual([
          {metadata: {name: 'admin'}},
          {metadata: {name: 'basic-user'}},
          {metadata: {name: 'edit'}},
          {metadata: {name: 'ThisIsNotACluserRole'}, kind: 'Role'}
      ]);
    });
  });

  describe('#mapRolesForUI', function() {

    describe('when building a map of clusterRoles and roles', function() {
        it('should build a map of unqiue keys to ensure no collisions', function() {
          var mappedRoles = MembershipService.mapRolesForUI(roles, clusterRoles);
          expect(_.keys(mappedRoles)).toEqual([
            'rbac.authorization.k8s.io-Role-awesomeview',
            'rbac.authorization.k8s.io-Role-people-who-break-things',
            'rbac.authorization.k8s.io-Role-deleteservices',
            'rbac.authorization.k8s.io-ClusterRole-basic-user',
            'rbac.authorization.k8s.io-ClusterRole-admin',
            'rbac.authorization.k8s.io-ClusterRole-view',
            'rbac.authorization.k8s.io-ClusterRole-edit'
          ]);
        });
    });

    // last one....
    it('should build a map of clusterRoles and roles with unique keys to ensure no collisions', function() {
      var mappedRoles = MembershipService.mapRolesForUI(roles, clusterRoles);

      // the ugly manual JSON blob comparison
      expect(mappedRoles)
      .toEqual({
        "rbac.authorization.k8s.io-Role-awesomeview":{
          "metadata":{
             "name":"awesomeview",
             "namespace":"membership-test"
          },
          "rules":{

          },
          "kind":"Role",
          "apiVersion":"rbac.authorization.k8s.io/v1"
        },
        "rbac.authorization.k8s.io-Role-people-who-break-things":{
          "metadata":{
             "name":"people-who-break-things",
             "namespace":"membership-test"
          },
          "rules":{

          },
          "kind":"Role",
          "apiVersion":"rbac.authorization.k8s.io/v1"
        },
        "rbac.authorization.k8s.io-Role-deleteservices":{
          "metadata":{
             "name":"deleteservices",
             "namespace":"membership-test"
          },
          "rules":{

          },
          "kind":"Role",
          "apiVersion":"rbac.authorization.k8s.io/v1"
        },
        "rbac.authorization.k8s.io-ClusterRole-basic-user":{
          "metadata":{
             "name":"basic-user"
          },
          "rules":{

          },
          "kind":"ClusterRole",
          "apiVersion":"rbac.authorization.k8s.io/v1"
        },
        "rbac.authorization.k8s.io-ClusterRole-admin":{
          "metadata":{
             "name":"admin"
          },
          "rules":{

          },
          "kind":"ClusterRole",
          "apiVersion":"rbac.authorization.k8s.io/v1"
        },
        "rbac.authorization.k8s.io-ClusterRole-view":{
          "metadata":{
             "name":"view"
          },
          "rules":{

          },
          "kind":"ClusterRole",
          "apiVersion":"rbac.authorization.k8s.io/v1"
        },
        "rbac.authorization.k8s.io-ClusterRole-edit":{
          "metadata":{
             "name":"edit"
          },
          "rules":{

          },
          "kind":"ClusterRole",
          "apiVersion":"rbac.authorization.k8s.io/v1"
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

      expect(kinds['User'].kind).toEqual('User');
      expect(kinds['Group'].kind).toEqual('Group');
      expect(kinds['ServiceAccount'].kind).toEqual('ServiceAccount');
    });
  });

  describe('#mapRolebindingsForUI', function() {
    it('Should return rolebindings in the following order: User, Group, ServiceAccount', function() {
      var mappedRoles = MembershipService.mapRolesForUI(roles, clusterRoles);
      var mappedRolebindings = MembershipService.mapRolebindingsForUI(roleBindings, mappedRoles);
      var orderedKinds = _.map(mappedRolebindings, 'kind');
      expect(orderedKinds[0]).toEqual('User');
      expect(orderedKinds[1]).toEqual('Group');
      expect(orderedKinds[2]).toEqual('ServiceAccount');
    });

    it('should put subjects under the appropriate kind', function() {
      var mappedRoles = MembershipService.mapRolesForUI(roles, clusterRoles);
      var mappedRolebindings = MembershipService.mapRolebindingsForUI(roleBindings, mappedRoles);
      expect(_.map(mappedRolebindings[0].subjects, 'name')).toEqual(['jill', 'jack', 'jenny']);
      expect(_.map(mappedRolebindings[2].subjects, 'name')).toEqual(['foo']);
    });

    it('should list appropriate roles for a subject under a kind heading', function() {
      var mappedRoles = MembershipService.mapRolesForUI(roles, clusterRoles);
      var mappedRolebindings = MembershipService.mapRolebindingsForUI(roleBindings, mappedRoles);
      var firstBinding = _.first(mappedRolebindings);
      var firstBindingSubjects = _.toArray(firstBinding.subjects);
      var firstSubject = _.first(firstBindingSubjects);
      var firstSubjectRoles = _.toArray(firstSubject.roles);
      var firstRoleNames = _.map(firstSubjectRoles, function(role) {
        return role.metadata.name;
      });
      expect(firstRoleNames).toEqual(['admin', 'view']);
    });

    describe('when given a set of rolebindings and roles', function() {

      var mockRolebindingsByKindForUI = [{
          "kind": "User",
          "sortOrder": 1,
          "name": "User",
          "subjects": {
              "-jill": {
                  "name": "jill",
                  "roles": {
                     "rbac.authorization.k8s.io-ClusterRole-admin":{
                        "metadata":{
                           "name":"admin"
                        },
                        "rules":{

                        },
                        "kind":"ClusterRole",
                        "apiVersion":"rbac.authorization.k8s.io/v1"
                     },
                     "rbac.authorization.k8s.io-ClusterRole-view":{
                        "metadata":{
                           "name":"view"
                        },
                        "rules":{

                        },
                        "kind":"ClusterRole",
                        "apiVersion":"rbac.authorization.k8s.io/v1"
                     }
                  }
              },
              "-jack": {
                  "name": "jack",
                  "roles": {
                     "rbac.authorization.k8s.io-ClusterRole-edit":{
                        "metadata":{
                           "name":"edit"
                        },
                        "rules":{

                        },
                        "kind":"ClusterRole",
                        "apiVersion":"rbac.authorization.k8s.io/v1"
                     }
                  }
              },
              "-jenny": {
                  "name": "jenny",
                  "roles": {
                    "rbac.authorization.k8s.io-Role-deleteservices":{
                        "kind":"Role",
                        "metadata":{
                           "name":"deleteservices",
                           namespace: 'membership-test'
                        },
                        rules: {},
                        apiVersion: 'rbac.authorization.k8s.io/v1',
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
      }];

      _.each(mockRolebindingsByKindForUI, function(mockRBByKind, mappedIndex) {

        it('should create a map of 3 tabs according to Kinds with a kind property', function() {
          var mappedRoles = MembershipService.mapRolesForUI(roles, clusterRoles);
          var allMappedKinds = MembershipService.mapRolebindingsForUI(roleBindings, mappedRoles);
          var kind = allMappedKinds[mappedIndex];
          expect(kind.kind).toEqual(mockRBByKind.kind);
        });

        it('should create a map of 3 tabs matching a predetermined sortOrder property', function() {
          var mappedRoles = MembershipService.mapRolesForUI(roles, clusterRoles);
          var allMappedKinds = MembershipService.mapRolebindingsForUI(roleBindings, mappedRoles);
          var kind = allMappedKinds[mappedIndex];
          expect(kind.sortOrder).toEqual(mockRBByKind.sortOrder);
        });

        it('should create a map of 3 tabs each with a description property', function() {
          var mappedRoles = MembershipService.mapRolesForUI(roles, clusterRoles);
          var allMappedKinds = MembershipService.mapRolebindingsForUI(roleBindings, mappedRoles);
          var kind = allMappedKinds[mappedIndex];
          expect(kind.description).toEqual(mockRBByKind.description);
        });

        it('should create a map of 3 tabs each with a helpLinkKey property', function() {
          var mappedRoles = MembershipService.mapRolesForUI(roles, clusterRoles);
          var allMappedKinds = MembershipService.mapRolebindingsForUI(roleBindings, mappedRoles);
          var kind = allMappedKinds[mappedIndex];
          expect(kind.helpLinkKey).toEqual(mockRBByKind.helpLinkKey);
        });

        it('should create a map of 3 tabs with a correct name property', function() {
          var mappedRoles = MembershipService.mapRolesForUI(roles, clusterRoles);
          var allMappedKinds = MembershipService.mapRolebindingsForUI(roleBindings, mappedRoles);
          var kind = allMappedKinds[mappedIndex];
          expect(kind.name).toEqual(mockRBByKind.name);
        });

        it('should create a map of 3 tabs with the correct set of subjects', function() {
          var mappedRoles = MembershipService.mapRolesForUI(roles, clusterRoles);
          var allMappedKinds = MembershipService.mapRolebindingsForUI(roleBindings, mappedRoles);

          var kind = allMappedKinds[mappedIndex];
          _.each(kind.subjects, function(subject, subjectKey) {
            expect(subject.name).toEqual(mockRBByKind.subjects[subjectKey].name);
            expect(subject.namespace).toEqual(mockRBByKind.subjects[subjectKey].namespace);
            expect(subject.roles).toEqual(mockRBByKind.subjects[subjectKey].roles);

          });

        });

        it('should create a map of 3 tabs that exactly match the expected output structure', function() {
          var mappedRoles = MembershipService.mapRolesForUI(roles, clusterRoles);
          var allMappedKinds = MembershipService.mapRolebindingsForUI(roleBindings, mappedRoles);
          var kind = allMappedKinds[mappedIndex];
          // finally, test the whole structure for anything unexpected.
          // this is terrible for debugging, but ensures we know the objects
          // completely match.
          expect(kind).toEqual(mockRBByKind);
        });
      });

    });

  });

});
