'use strict';

angular
  .module('openshiftConsole')
  .factory('RoleBindingsService', function(
    $q,
    APIService,
    DataService) {

    var roleBindingsVersion = APIService.getPreferredVersion('rolebindings');

    var bindingTPL = function(role, projectNamespace) {
      return {
        kind: 'RoleBinding',
        apiVersion: 'v1',
        metadata: {
          generateName: _.get(role, 'metadata.name') + '-',
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
      if(_.isEqual(subject.kind, 'ServiceAccount')) {
        subject.namespace = subject.namespace || namespace;
      }
      return subject;
    };

    var create = function(role, subject, namespace, context) {
      var binding = bindingTPL(role, namespace);
      var rgv = APIService.objectToResourceGroupVersion(binding);
      subject = qualifySubject(subject, namespace);
      binding.subjects.push(angular.copy(subject));
      return DataService.create(rgv, null, binding, context);
    };

    var addSubject = function(rb, subject, namespace, context) {
      var tpl = bindingTPL();
      var binding = _.extend(tpl, rb);
      var rgv = APIService.objectToResourceGroupVersion(binding);
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
      return DataService.update(rgv, binding.metadata.name, binding, context);
    };

    // has to handle multiple bindings or multiple reference to a subject within a single binding
    var removeSubject = function(subjectName, role, namespace, roleBindings, context) {
      var matchingBindings = _.filter(roleBindings, {roleRef: {name: role}});

      return $q.all(
        _.map(matchingBindings, function(binding) {
          var tpl = bindingTPL();
          binding = _.extend(tpl, binding);
          var toMatch = { name: subjectName };
          if(namespace) {
            toMatch.namespace = namespace;
          }

          binding.subjects = _.reject(binding.subjects, toMatch);

          return binding.subjects.length ?
                  DataService.update(roleBindingsVersion, binding.metadata.name, binding, context) :
                  DataService.delete(roleBindingsVersion, binding.metadata.name, context)
                  // For a delete, resp is simply a 201 or less useful object.
                  // Instead, this intercepts the response & returns the binding object
                  // with the empty .subjects[] list.
                  .then(function() {
                    return binding;
                  });
        }));
    };

    return {
      create: create,
      addSubject: addSubject,
      removeSubject: removeSubject
    };
  });
