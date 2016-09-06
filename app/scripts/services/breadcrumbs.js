'use strict';

angular.module("openshiftConsole")
  .service("BreadcrumbsService", function($filter, APIService, Navigate) {
    var annotation = $filter('annotation');
    var projectDisplayName = $filter('displayName');

    var humanizeKind = function(kind) {
      switch (kind) {
      case 'DeploymentConfig':
        return 'Deployments';
      default:
        return _.startCase(APIService.kindToResource(kind, true));
      }
    };

    var getBreadcrumbsForNameAndKind = function(name, kind, namespace, config) {
      var breadcrumbs = [],
          humanizedKind = config.humanizedKind || humanizeKind(kind),
          projectName;

      if (config.includeProject) {
        if (config.project) {
          projectName = projectDisplayName(config.project);
        } else {
          projectName = namespace;
        }

        breadcrumbs.push({
          title: projectName,
          link: Navigate.projectOverviewURL(namespace)
        });
      }

      breadcrumbs.push({
        title: humanizedKind,
        link: Navigate.resourceListURL(APIService.kindToResource(kind), namespace)
      });

      if (config.parent) {
        breadcrumbs.push(config.parent);
      }

      if (config.subpage) {
        breadcrumbs.push({
          title: config.displayName || name,
          link: Navigate.resourceURL(name, kind, namespace)
        });
        breadcrumbs.push({
          title: config.subpage
        });
      } else {
        breadcrumbs.push({
          title: config.displayName || name
        });
      }

      return breadcrumbs;
    };

    var getRCBreadcrumbs = function(replicationController, config) {
      config = config || {};

      var deploymentVersion;
      var dcName = annotation(replicationController, 'deploymentConfig');
      if (dcName) {
        config.humanizedKind = 'Deployments';
        config.parent = {
          title: dcName,
          link: Navigate.configURLForResource(replicationController)
        };
        deploymentVersion = $filter("annotation")(replicationController, "deploymentVersion");
        if (deploymentVersion) {
          config.displayName = '#' + deploymentVersion;
        }
      }

      return getBreadcrumbsForNameAndKind(replicationController.metadata.name,
                                          replicationController.kind,
                                          replicationController.metadata.namespace,
                                          config);
    };

    var getBreadcrumbsForObject = function(object, config) {
      // TODO: handle builds
      switch (object.kind) {
      case 'ReplicationController':
        return getRCBreadcrumbs(object, config);
      default:
        return getBreadcrumbsForNameAndKind(object.metadata.name,
                                            object.kind,
                                            object.metadata.namespace,
                                            config);
      }
    };

    // Gets the breadcrumbs array to use with the breadcrumbs directive.
    //
    // Required `config` Properties
    //
    // object: the object for the breadcrumb
    //   OR
    // name: the name of the object
    // kind: the kind of the object (e.g., 'DeploymentConfig')
    // namespace: the object namespace
    //
    // Optional `config` Properties
    //
    // subpage: the last breadcrumb item, generally used to actions
    // includeProject: include the project name as the first breadcrumb (for pages with no project dropdown)
    // project: the project object (to show the project display name if includeProject is true

    var getBreadcrumbs = function(config) {
      config = config || {};

      if (config.object) {
        return getBreadcrumbsForObject(config.object, config);
      }

      if (config.kind && config.name && config.namespace) {
        return getBreadcrumbsForNameAndKind(config.name, config.kind, config.namespace, config);
      }

      return [];
    };

    return {
      getBreadcrumbs: getBreadcrumbs
    };
  });
