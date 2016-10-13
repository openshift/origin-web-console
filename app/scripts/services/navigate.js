"use strict";

angular.module("openshiftConsole")
  .service("Navigate", function($location,
                                $window,
                                $timeout,
                                annotationFilter,
                                LabelFilter,
                                $filter,
                                APIService){
    var annotation = $filter('annotation');
    var buildConfigForBuild = $filter('buildConfigForBuild');
    var isPipeline = $filter('isJenkinsPipelineStrategy');

    // Get the type segment for build URLs. `resource` can be a build or build config.
    var getBuildURLType = function(resource, opts) {
      if (_.get(opts, 'isPipeline')) {
        return "pipelines";
      }

      if (_.isObject(resource) && isPipeline(resource)) {
        // Use "pipelines" instead of "builds" in the URL so the right nav item is highlighted
        // for pipeline builds.
        return "pipelines";
      }

      return "builds";
    };

    return {
      /**
       * Navigate and display the error page.
       *
       * @param {type} message    The message to display to the user
       * @param {type} errorCode  An optional error code to display
       * @returns {undefined}
       */
      toErrorPage: function(message, errorCode, reload) {
        var redirect = URI('error').query({
          error_description: message,
          error: errorCode
        }).toString();
        if (!reload) {
          // Use replace() to avoid breaking the browser back button.
          $location.url(redirect).replace();
        }
        else {
          $window.location.href = redirect;
        }
      },

      /**
       * Navigate and display the project overview page.
       *
       * @param {type} projectName  the project name
       * @returns {undefined}
       */
      toProjectOverview: function(projectName){
        $location.path(this.projectOverviewURL(projectName));
      },

      /**
       * Return the URL for the project overview
       *
       * @param {type}     projectName
       * @returns {String} a URL string for the project overview
       */
      projectOverviewURL: function(projectName){
        return "project/" + encodeURIComponent(projectName) + "/overview";
      },

      /**
       * Return the URL for the fromTemplate page for the picked template
       *
       * @param {String}      projectName  Project name
       * @param {String}      name         Template name
       * @param {String}      namespace    Namespace from which the Template should be loaded
       * @returns {String} a URL string for the fromTemplate page. If the namespace is not set
       * read the template from TemplateService.
       */
      fromTemplateURL: function(projectName, name, namespace){
        namespace = namespace || "";
        return "project/" + encodeURIComponent(projectName) + "/create/fromtemplate?name=" + name + "&namespace=" + namespace;
      },

      /**
       * Navigate and display the next steps after creation page.
       *
       * @param {type} projectName  the project name
       * @returns {undefined}
       */
      toNextSteps: function(name, projectName, searchPart){
        var search = $location.search();
        search.name = name;
        if (_.isObject(searchPart)) {
          _.extend(search, searchPart);
        }
        $location.path("project/" + encodeURIComponent(projectName) + "/create/next").search(search);
      },

      toPodsForDeployment: function(deployment) {
        $location.url("/project/" + deployment.metadata.namespace + "/browse/pods");
        $timeout(function() {
          LabelFilter.setLabelSelector(new LabelSelector(deployment.spec.selector, true));
        }, 1);
      },

      // Resource is either a resource object, or a name.  If resource is a name, kind and namespace must be specified
      // Note that builds and deployments can only have their URL built correctly (including their config in the URL)
      // if resource is an object, otherwise they will fall back to the non-nested URL.
      //
      // `opts` is for additional options. Currently only `opts.isPipeline` is supported for building URLs with a
      // pipeline path segment.
      resourceURL: function(resource, kind, namespace, action, opts) {
        action = action || "browse";
        if (!resource || (!resource.metadata && (!kind || !namespace))) {
          return null;
        }

        // normalize based on the kind of args we got
        if (!kind) {
          kind = resource.kind;
        }
        var group = "";
        if (resource.apiVersion) {
          group = APIService.parseGroupVersion(resource.apiVersion).group;
        }

        if (!namespace) {
          namespace = resource.metadata.namespace;
        }

        var name = resource;
        if (resource.metadata) {
          name = resource.metadata.name;
        }

        var url = URI("")
          .segment("project")
          .segmentCoded(namespace)
          .segment(action);

        switch(kind) {
          case "Build":
            var buildConfigName = $filter('buildConfigForBuild')(resource);
            var typeSegment = getBuildURLType(resource, opts);
            if (buildConfigName) {
              url.segment(typeSegment)
                .segmentCoded(buildConfigName)
                .segmentCoded(name);
            }
            else {
              url.segment(typeSegment + "-noconfig")
                .segmentCoded(name);
            }
            break;
          case "BuildConfig":
            url.segment(getBuildURLType(resource, opts))
              .segmentCoded(name);
            break;
          case "Deployment":
            url.segment("deployment")
              .segmentCoded(name);
            break;
          case "DeploymentConfig":
            url.segment("dc")
              .segmentCoded(name);
            break;
          case "ReplicaSet":
            url.segment("rs")
              .segmentCoded(name);
            break;
          case "ReplicationController":
            url.segment("rc")
              .segmentCoded(name);
            break;
          case "ImageStream":
            url.segment("images")
              .segmentCoded(name);
            break;
          case "Service":
          case "Secret":
          case "Route":
          case "Pod":
          case "PersistentVolumeClaim":
            url.segment(APIService.kindToResource(kind))
            .segmentCoded(name);
            break;
          default:
            url.segment("other")
            .search({
              kind: kind,
              group: group
            });
        }
        return url.toString();
      },

      // Returns the build config URL for a build or the deployment config URL for a deployment.
      configURLForResource: function(resource, /* optional */ action) {
        var bc, dc,
            kind = _.get(resource, 'kind'),
            namespace = _.get(resource, 'metadata.namespace');
        if (!kind || !namespace) {
          return null;
        }

        switch (kind) {
        case 'Build':
          bc = buildConfigForBuild(resource);
          if (!bc) {
            return null;
          }

          return this.resourceURL(bc, 'BuildConfig', namespace, action, {
            isPipeline: isPipeline(resource)
          });

        case 'ReplicationController':
          dc = annotation(resource, 'deploymentConfig');
          if (!dc) {
            return null;
          }
          return this.resourceURL(dc, 'DeploymentConfig', namespace, action);
        }

        return null;
      },

      resourceListURL: function(resource, projectName) {
        var routeMap = {
          'builds': 'builds',
          'buildconfigs': 'builds',
          'deployments': 'deployments',
          'deploymentconfigs': 'deployments',
          'imagestreams': 'images',
          'pods': 'pods',
          'replicasets': 'deployments',
          'replicationcontrollers': 'deployments',
          'routes': 'routes',
          'secrets': 'secrets',
          'services': 'services',
          'persistentvolumeclaims': 'storage'
        };

        return URI.expand("project/{projectName}/browse/{browsePath}", {
          projectName: projectName,
          browsePath: routeMap[resource]
        }).toString();
      },

      /**
       * Navigate to a list view for a resource type
       *
       * @param {String} resource      the resource (e.g., builds or replicationcontrollers)
       * @param {String} projectName   the project name
       * @returns {undefined}
       */
      toResourceList: function(resource, projectName) {
        $location.url(this.resourceListURL(resource, projectName));
      },

      yamlURL: function(object, returnURL) {
        if (!object) {
          return '';
        }

        var groupVersion = APIService.parseGroupVersion(object.apiVersion);
        return URI.expand("project/{projectName}/edit/yaml?kind={kind}&name={name}&group={group}&returnURL={returnURL}", {
          projectName: object.metadata.namespace,
          kind: object.kind,
          name: object.metadata.name,
          group: groupVersion.group || '',
          returnURL: returnURL || ''
        }).toString();
      },

      healthCheckURL: function(projectName, kind, name, group) {
        return URI.expand("project/{projectName}/edit/health-checks?kind={kind}&name={name}&group={group}", {
          projectName: projectName,
          kind: kind,
          name: name,
          group: group || ''
        }).toString();
      }
    };
  });
