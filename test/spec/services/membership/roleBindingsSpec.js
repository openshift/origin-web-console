'use strict';

describe('RoleBindingsService', function() {
  var RoleBindingsService;
  var $rootScope;

  beforeEach(module('openshiftConsole', function($provide) {
    // Mocking DataService to eliminate $http & the need to use $httpBackend to mock requests
    var DataServiceMock = {
      create: function(resource, name, object) {
        return { then: function(fn) { fn(object);}};
      },
      update: function(resource, name, object) {
        return { then: function(fn) { fn(object);}};
      },
      // delete may not need to return anything
      delete: function(resource, name, object) {
        return { then: function(fn) { fn(object);}};
      }
    };
    $provide.service('DataService', function() {
      return DataServiceMock;
    });
  }));

  beforeEach(inject(function(_$rootScope_, _RoleBindingsService_) {
    RoleBindingsService = _RoleBindingsService_;
    $rootScope = _$rootScope_;
  }));

  describe('#addSubject', function() {
    it('should add the subject to the rolebinding subject list', function() {
      RoleBindingsService
        .addSubject({subjects: []}, {name: 'jane', kind: 'user'})
        .then(function(resp) {
          expect(resp.subjects).toEqual([{ name: 'jane', kind: 'user'}]);
        });
    });
    it('should provide defaults for a rolebinding object', function() {
      RoleBindingsService
        .addSubject({
          metadata: { name: 'admin'},
          subjects: []
        }, {name: 'jane', kind: 'user'})
        .then(function(resp) {
          expect(resp.kind).toEqual('RoleBinding');
          expect(resp.apiVersion).toEqual('v1');
          expect(_.keys(resp.roleRef)).toEqual(['name', 'namespace']);
        });
    });

    it('should return the binding if no new subject provided', function() {
      // TODO: the early rejection should still be a thenable object!
      var binding = RoleBindingsService
                      .addSubject({
                        metadata: { name: 'admin'},
                        subjects: []
                      }, null);
      expect(binding.subjects).toEqual([]);
      expect(binding.kind).toEqual('RoleBinding');
      expect(binding.apiVersion).toEqual('v1');
    });
    // TODO: this logic is currently in the controller,
    // but it prob should be pushed up into the service
    // it('should not add a subject if the subject is already present', function() {
    //   RoleBindingsService
    //     .addSubject({
    //       metadata: { name: 'admin'},
    //       subjects: [{name: 'jane', kind: 'user'}]
    //     }, {name: 'jane', kind: 'user'})
    //     .then(function(resp) {
    //       expect(resp.subjects).toEqual([{name: 'jane', kind: 'user'}]);
    //     });
    // });
  });

  describe('#removeSubject', function() {
    it('should update the rolebinding by removing the subject from the subject list', function() {
      var bindings = [{
        roleRef: { name: 'admin'},
        subjects: [
          {name: 'jane', kind: 'user'},
          {name: 'jack', kind: 'user'}
        ]
      }];
      RoleBindingsService
        .removeSubject('jane', 'admin', null, bindings)
        .then(function(resp) {
          expect(resp[0].subjects).toEqual([{
              name: 'jack',
              kind: 'user'
          }]);
        });
      // resolve $q.all() via digest loop
      $rootScope.$digest();
    });

    it('should honor the namespace of a subject if provided', function() {
      var bindings = [{
        roleRef: { name: 'admin'},
        subjects: [
          // multiple jim, only one should be removed in test 1
          {name: 'jim',  kind: 'user'},
          {name: 'jim',  kind: 'user', namespace: 'yourproject'},
          {name: 'jim',  kind: 'user', namespace: 'myproject'},
          {name: 'jack', kind: 'user'}
        ]
      }, {
        roleRef: { name: 'view'},
        subjects: [
          // multiple jane, only one should be removed in test 2
          {name: 'jane', kind: 'user', namespace: 'myproject'},
          {name: 'jack', kind: 'user', namespace: 'yourproject'},
          {name: 'jane', kind: 'user', namespace: 'herproject'},
          {name: 'jack', kind: 'user', namespace: 'hisproject'}
        ]
      }];

      // test 1
      RoleBindingsService
        .removeSubject('jim', 'admin', 'myproject', bindings)
        .then(function(resp) {
          expect(resp[0].subjects).toEqual([
            {name: 'jim',  kind: 'user'},
            {name: 'jim',  kind: 'user', namespace: 'yourproject'},
            {name: 'jack', kind: 'user'}
          ]);

        });

      // test 2
      RoleBindingsService
        .removeSubject('jane', 'view', 'herproject', bindings)
        .then(function(resp) {
          expect(resp[0].subjects).toEqual([
            {name: 'jane', kind: 'user', namespace: 'myproject'},
            {name: 'jack', kind: 'user', namespace: 'yourproject'},
            {name: 'jack', kind: 'user', namespace: 'hisproject'}
          ]);
        });
      // resolve $q.all() via digest loop
      $rootScope.$digest();

    });

    it('should delete the rolebinding if the removed subject was the only subject', function() {
      var bindings = [{
        roleRef: { name: 'admin'},
        subjects: [{name: 'jane', kind: 'user'}]
      }];
      RoleBindingsService
        .removeSubject('jane', 'admin', null, bindings)
        .then(function(resp) {
          expect(resp[0]).toBe(undefined);
        });
      $rootScope.$digest();
    });

    it('should remove the subject from all rolebindings for a particular roleRef', function() {
      var bindings = [{
        metadata: {name: 'admin01'},
        roleRef:  {name: 'admin'},
        subjects: [{name: 'jane', kind: 'user'}, {name: 'jack', kind: 'user'}]
      },{
        metadata: {name: 'admin02'},
        roleRef:  {name: 'admin'},
        subjects: [{name: 'jane', kind: 'user'}, {name: 'jack', kind: 'user'}]
      },{
        metadata: {name: 'view'},
        roleRef:  {name: 'view'},
        subjects: [{name: 'jane', kind: 'user'}, {name: 'jack', kind: 'user'}]
      }];
      RoleBindingsService
        .removeSubject('jane', 'admin', null, bindings)
        .then(function(resp) {
          _.each(resp, function(roleBinding) {
            expect(roleBinding.subjects).toEqual([ {name: 'jack', kind: 'user'}]);
          });
        });
      $rootScope.$digest();
    });

    it('should delete multiple rolebindings from a list of rolebindings if subjects for any rolebinding are empty', function() {
      var bindings = [{
        metadata: {name: 'admin01'},
        roleRef:  {name: 'admin'},
        subjects: [{name: 'jane', kind: 'user'}]
      },{
        metadata: {name: 'admin02'},
        roleRef:  {name: 'admin'},
        subjects: [{name: 'jane', kind: 'user'}, {name: 'jack', kind: 'user'}]
      },{
        metadata: {name: 'admin03'},
        roleRef:  {name: 'admin'},
        subjects: [{name: 'jane', kind: 'user'}]
      }];
      RoleBindingsService
        .removeSubject('jane', 'admin', null, bindings)
        .then(function(resp) {
          expect(resp[0]).toBe(undefined);
          expect(resp[1].subjects).toEqual([ {name: 'jack', kind: 'user'}]);
          expect(resp[2]).toBe(undefined);
        });
      $rootScope.$digest();
    });
  });

});
