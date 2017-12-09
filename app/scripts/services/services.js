'use strict';

angular.module("openshiftConsole")
  .factory("ServicesService", function(
    $filter,
    $q,
    APIService,
    DataService) {

    var servicesVersion = APIService.getPreferredVersion('services');

    var DEPENDENCIES = 'service.alpha.openshift.io/dependencies';
    var INFRASTRUCTURE = 'service.openshift.io/infrastructure';
    var annotation = $filter('annotation');

    var getDependenciesJSON = function(service) {
      var dependenciesAnnotation = annotation(service, DEPENDENCIES);
      if (!dependenciesAnnotation) {
        return null;
      }

      try {
        return JSON.parse(dependenciesAnnotation);
      } catch(e) {
        Logger.warn('Could not parse "service.alpha.openshift.io/dependencies" annotation', e);
        return null;
      }
    };

    var getDependentServices = function(service) {
      var serviceNamespace, dependencies = getDependenciesJSON(service);
      if (!dependencies) {
        return [];
      }

      // Find dependent services. Example annotation:
      //   "service.alpha.openshift.io/dependencies": "[{\"name\": \"database\", \"namespace\": \"\", \"kind\": \"Service\"}]"
      // Default kind if missing is Service and default namespace is this namespace.
      serviceNamespace = _.get(service, 'metadata.namespace');
      var isDependentService = function(dependency) {
        if (!dependency.name) {
          return false;
        }

        if (dependency.kind && dependency.kind !== 'Service') {
          return false;
        }

        if (dependency.namespace && dependency.namespace !== serviceNamespace) {
          return false;
        }

        return true;
      };

      return _.chain(dependencies)
              .filter(isDependentService)
              .map(function(dependency) {
                return dependency.name;
              })
              .value();
    };

    var setDependencies = function(service, dependencies) {
      if (dependencies.length) {
        _.set(service, ['metadata', 'annotations', DEPENDENCIES], JSON.stringify(dependencies));
        return;
      }

      // Remove the annotation if it exists and dependencies is empty.
      if (_.has(service, ['metadata', 'annotations', DEPENDENCIES])) {
        delete service.metadata.annotations[DEPENDENCIES];
      }
    };

    var linkService = function(parent, child) {
      var updatedService = angular.copy(parent);
      var dependencies = getDependenciesJSON(updatedService) || [];
      dependencies.push({
        name: child.metadata.name,
        namespace: (parent.metadata.namespace === child.metadata.namespace) ? '' : child.metadata.namespace,
        kind: child.kind
      });

      setDependencies(updatedService, dependencies);
      return DataService.update(servicesVersion, updatedService.metadata.name, updatedService, {
        namespace: updatedService.metadata.namespace
      });
    };

    var removeServiceLink = function(parent, child) {
      var updatedService = angular.copy(parent);
      var dependencies = getDependenciesJSON(updatedService) || [];

      // Remove the item from the array of dependencies.
      var updatedDependencies = _.reject(dependencies, function(dependency) {
        if (dependency.kind !== child.kind) {
          return false;
        }

        var dependencyNamespace = dependency.namespace || parent.metadata.namespace;
        if (dependencyNamespace !== child.metadata.namespace) {
          return false;
        }

        return dependency.name === child.metadata.name;
      });

      if (updatedDependencies.length === dependencies.length) {
        // Nothing to do. Return a promise that resolves immediately.
        return $q.when(true);
      }

      setDependencies(updatedService, updatedDependencies);
      return DataService.update(servicesVersion, updatedService.metadata.name, updatedService, {
        namespace: updatedService.metadata.namespace
      });
    };

    var isInfrastructure = function(service) {
      return annotation(service, INFRASTRUCTURE) === 'true';
    };

    return {
      // Returns an array of service names that are dependencies in the same namespace as service.
      getDependentServices: getDependentServices,
      linkService: linkService,
      removeServiceLink: removeServiceLink,
      isInfrastructure: isInfrastructure
    };
  });
