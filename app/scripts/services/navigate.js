"use strict";

angular.module("openshiftConsole")
  .service("Navigate", function($location,
                                $window,
                                $timeout,
                                annotationFilter,
                                LabelFilter,
                                $filter,
                                APIService,
                                KubevirtVersions){
    var annotation = $filter('annotation');
    var buildConfigForBuild = $filter('buildConfigForBuild');
    var isPipeline = $filter('isJenkinsPipelineStrategy');
    var displayNameFilter = $filter('displayName');

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

      toProjectList: function(){
        $location.path('projects');
      },

      membershipURL: function(projectName) {
        return "project/" + encodeURIComponent(projectName) + "/membership";
      },

      toProjectMembership: function(projectName) {
        $location.path(this.membershipURL(projectName));
      },

      /**
       * Return the URL for the project catalog browse page
       *
       * @param {Object|String}     project - Can be a project object or the project's name (string)
       * @returns {String} a URL string for the project catalog browse page
       */
      catalogURL: function(project) {
        var projectName = angular.isString(project) ? project : _.get(project, 'metadata.name');
        if (!projectName) {
          return 'catalog';
        }

        return "project/" + encodeURIComponent(projectName) + "/catalog";
      },

      /**
       * Navigate and display the project catalog browse page.
       *
       * @param {Object|String} project - Can be a project object or the project's name (string)
       * @param {Object} search - optional search object (supports initial filters via a filter field)
       * @returns {undefined}
       */
      toProjectCatalog: function(project, search) {
        var loc = $location.path(this.catalogURL(project));
        if (search) {
          loc.search(search);
        }
      },

      quotaURL: function(projectName) {
        return "project/" + encodeURIComponent(projectName) + "/quota";
      },

      createFromImageURL: function(imageStream, imageTag, projectName, queryParams) {
        var createURI = URI.expand("project/{project}/create/fromimage{?q*}", {
          project: projectName,
          q: angular.extend ({
            imageStream: imageStream.metadata.name,
            imageTag: imageTag,
            namespace: imageStream.metadata.namespace,
            displayName: displayNameFilter(imageStream)
          }, queryParams || {})
        });
        return createURI.toString();
      },

      createFromTemplateURL: function(template, projectName, queryParams) {
        var createURI = URI.expand("project/{project}/create/fromtemplate{?q*}", {
          project: projectName,
          q: angular.extend ({
            template: template.metadata.name,
            namespace: template.metadata.namespace
          }, queryParams || {})
        });
        return createURI.toString();
      },

      /**
       * Navigate and display the next steps after creation page.
       *
       * @param {type} projectName  the project name
       * @returns {undefined}
       */
      toNextSteps: function(name, projectName, searchPart) {
        var search = {
          name: name
        };

        if (_.isObject(searchPart)) {
          _.extend(search, searchPart);
        }

        $location.path("project/" + encodeURIComponent(projectName) + "/create/next").search(search);
      },

      toPodsForDeployment: function(deployment, pods) {
        if (_.size(pods) === 1) {
          this.toResourceURL(_.sample(pods));
          return;
        }
        this.toResourceURL(deployment);
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
          case "ConfigMap":
            url.segment('config-maps')
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
          case "ImageStreamTag":
            var ind = name.indexOf(':');
            url.segment("images")
              .segmentCoded(name.substring(0, ind))
              .segmentCoded(name.substring(ind + 1));
            break;
          case "ServiceInstance":
            url.segment("service-instances")
              .segmentCoded(name);
            break;
          case "StatefulSet":
            url.segment("stateful-sets")
              .segmentCoded(name);
            break;
          case "PersistentVolumeClaim":
          case "Pod":
          case "Route":
          case "Secret":
          case "Service":
            url.segment(APIService.kindToResource(kind))
              .segmentCoded(name);
            break;
          case KubevirtVersions.virtualMachineInstance.kind:
            url.segment('virtual-machine-instances')
              .segmentCoded(name);
            break;
          case KubevirtVersions.virtualMachine.kind:
            url.segment('virtual-machines')
              .segmentCoded(name);
            break;
          default:
            var rgv;
            if (resource.metadata) {
              rgv = APIService.objectToResourceGroupVersion(resource);
            }
            else if (_.get(opts, "apiVersion")) {
              var r = APIService.kindToResource(kind);
              var gv = APIService.parseGroupVersion(opts.apiVersion);
              gv.resource = r;
              rgv = APIService.toResourceGroupVersion(gv);
            }
            else {
              rgv = APIService.toResourceGroupVersion(APIService.kindToResource(kind));
            }
            var apiInfo = APIService.apiInfo(rgv);
            if (!apiInfo) {
              // This is not an API object we know about from discovery
              // We won't be able to navigate to it in Other Resources
              return null;
            }
            url.segment("other")
            .search({
              kind: kind,
              group: rgv.group
            });
        }

        if (_.get(opts, "tab")) {
          url.setSearch("tab", opts.tab);
        }

        return url.toString();
      },

      // Navigate to the URL of the resource
      toResourceURL: function (resource) {
        $location.url(this.resourceURL(resource));
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
          'configmaps': 'config-maps',
          'deployments': 'deployments',
          'deploymentconfigs': 'deployments',
          'imagestreams': 'images',
          'pods': 'pods',
          'replicasets': 'deployments',
          'replicationcontrollers': 'deployments',
          'routes': 'routes',
          'secrets': 'secrets',
          'services': 'services',
          'serviceinstances': 'service-instances',
          'persistentvolumeclaims': 'storage',
          'statefulsets' : 'stateful-sets',
        };
        routeMap[KubevirtVersions.virtualMachine.resource] = 'virtual-machines';

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
