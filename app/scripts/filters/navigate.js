'use strict';

angular.module('openshiftConsole')
  // Resource is either a resource object, or a name.  If resource is a name, kind and namespace must be specified
  // Note that builds and deployments can only have their URL built correctly (including their config in the URL)
  // if resource is an object
  .filter('navigateResourceURL', function(Navigate) {
    return function(resource, kind, namespace, apiVersion) {
      return Navigate.resourceURL(resource, kind, namespace, null, {apiVersion: apiVersion});
    };
  })
  .filter('configURLForResource', function(Navigate) {
    return function(resource, /* optional */ action) {
      return Navigate.configURLForResource(resource, action);
    };
  })
  .filter('editResourceURL', function(Navigate) {
    return function(resource, kind, namespace) {
      var url = Navigate.resourceURL(resource, kind, namespace, "edit");
      return url;
    };
  })
  .filter('editYamlURL', function(Navigate) {
    return function(object, /* optional */ returnURL) {
      return Navigate.yamlURL(object, returnURL);
    };
  })
  .filter('urlForOwnerRef', function(Navigate) {
    return function(ownerReference, namespace) {
      if (!ownerReference) {
        return null;
      }

      return Navigate.resourceURL(ownerReference.name, ownerReference.kind, namespace);
    };
  });
