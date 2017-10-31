'use strict';

angular
  .module('openshiftConsole')
  .factory('RoleBindingsService', function($q, DataService) {
    // some API constraints worth nothing:
    // ServiceAccountUsernamePrefix    = "system:serviceaccount:"
    // ServiceAccountUsernameSeparator = ":"
    // ServiceAccountGroupPrefix       = "system:serviceaccounts:"
    // AllServiceAccountsGroup         = "system:serviceaccounts"

    var cache = {};

    // recurse until we get a unique binding name compared to what is cached
    var qualifyBindingName = function(name, suffix) {
      var search = suffix ?
                name + suffix :
                name;
      return _.some(cache, _.matchesProperty('metadata.name', search)) ?
              qualifyBindingName(name, _.uniqueId()) :
              search;
    };

    var bindingTPL = function(role, projectNamespace) {
      var roleName = _.get(role, 'metadata.name');
      var bindingName = roleName ? qualifyBindingName(roleName) : null;
      return {
        kind: 'RoleBinding',
        apiVersion: 'v1',
        metadata: {
          name: bindingName,
          namespace: projectNamespace,
        },
        roleRef: {
          name: _.get(role, 'metadata.name'),
          // Roles have a namespace, clusterRoles do not
          namespace:  _.get(role, 'metadata.namespace'),
        },
        subjects: []
        // userNames & groupNames are legacy, do not use!
        // we literally must null them out when we receive them
      };
    };

    var qualifySubject = function(subject, namespace) {
      // NOTE: so far, SAs are the only ones that need tweaking
      if(_.isEqual(subject.kind, 'ServiceAccount')) {
        subject.namespace = subject.namespace || namespace;
      } else if(_.isEqual(subject.kind, 'SystemUser') || _.isEqual(subject.kind, 'SystemGroup')) {
        if(!_.startsWith(subject.name, 'system:')) {
          subject.name = 'system:'+subject.name;
        }
      }
      return subject;
    };

    var cleanBinding = function(binding) {
      // These generated lists must be removed to be regenerated
      binding.userNames = null;
      binding.groupNames = null;
    };

    var create = function(role, subject, namespace, context) {
      var binding = bindingTPL(role, namespace);
      subject = qualifySubject(subject, namespace);
      binding.subjects.push(angular.copy(subject));
      return DataService.create('rolebindings', null, binding, context);
    };

    var addSubject = function(rb, subject, namespace, context) {
      var tpl = bindingTPL();
      var binding = _.extend(tpl, rb);
      if(!subject) {
        return binding;
      }
      subject = qualifySubject(subject, namespace);
      if(_.isArray(binding.subjects)) {
        if(_.includes(binding.subjects, subject)) {
          return; // nothing to see here, folks.
        }
        binding.subjects.push(subject);
      } else {
        binding.subjects = [subject];
      }
      cleanBinding(binding);
      return DataService.update('rolebindings', binding.metadata.name, binding, context);
    };

    // has to handle multiple bindings or multiple reference to a subject within a single binding
    var removeSubject = function(subjectName, role, namespace, roleBindings, context) {
      var matchingBindings = _.filter(roleBindings, {roleRef: {name: role}});

      return $q.all(
        _.map(matchingBindings, function(binding) {
          var tpl = bindingTPL();
          binding = _.extend(tpl, binding);
          cleanBinding(binding);
          var toMatch = { name: subjectName };
          if(namespace) {
            toMatch.namespace = namespace;
          }

          binding.subjects = _.reject(binding.subjects, toMatch);

          return binding.subjects.length ?
                  DataService.update('rolebindings', binding.metadata.name, binding, context) :
                  DataService.delete('rolebindings', binding.metadata.name, context)
                  // For a delete, resp is simply a 201 or less useful object.
                  // Instead, this intercepts the response & returns the binding object
                  // with the empty .subjects[] list.
                  .then(function() {
                    return binding;
                  });
        }));
    };

    var list = function(context, fn, opts) {
      return DataService
              .list('rolebindings', context, function(resp) {
                cache = resp.by('metadata.name');
                fn(resp);
              }, opts);
    };

    return {
      list: list,
      create: create,
      addSubject: addSubject,
      removeSubject: removeSubject
    };
  });
