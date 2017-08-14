'use strict';

// Assigns global constants to things like external documentation, links to external resources, annotations and naming, etc.
// Can be customized using custom scripts in the master config file that override one or multiple of these objects.
// Reference: https://docs.openshift.org/latest/install_config/web_console_customization.html#loading-custom-scripts-and-stylesheets

// NOTE: Update extensions/examples/online-extensions.js if you add a new help link to this map.

if (angular.isUndefined(window.OPENSHIFT_CONSTANTS)) {
  window.OPENSHIFT_CONSTANTS = {};
}

angular.extend(window.OPENSHIFT_CONSTANTS, {
  // Maps links to specific topics in external documentation.
  HELP_BASE_URL: "https://docs.openshift.org/latest/",
  HELP: {
    "cli":                     "cli_reference/index.html",
    "get_started_cli":         "cli_reference/get_started_cli.html",
    "basic_cli_operations":    "cli_reference/basic_cli_operations.html",
    "build-triggers":          "dev_guide/builds/triggering_builds.html",
    "webhooks":                "dev_guide/builds/triggering_builds.html#webhook-triggers",
    "new_app":                 "dev_guide/application_lifecycle/new_app.html",
    "start-build":             "dev_guide/builds/basic_build_operations.html#starting-a-build",
    "deployment-operations":   "cli_reference/basic_cli_operations.html#build-and-deployment-cli-operations",
    "route-types":             "architecture/core_concepts/routes.html#route-types",
    "persistent_volumes":      "dev_guide/persistent_volumes.html",
    "compute_resources":       "dev_guide/compute_resources.html",
    "pod_autoscaling":         "dev_guide/pod_autoscaling.html",
    "application_health":      "dev_guide/application_health.html",
    "source_secrets":          "dev_guide/builds/build_inputs.html#using-secrets-during-build",
    "git_secret":              "dev_guide/builds/build_inputs.html#source-clone-secrets",
    "pull_secret":             "dev_guide/managing_images.html#using-image-pull-secrets",
    "managing_secrets":        "dev_guide/service_accounts.html#managing-allowed-secrets",
    "creating_secrets":        "dev_guide/secrets.html#creating-secrets",
    "storage_classes":         "install_config/persistent_storage/dynamically_provisioning_pvs.html",
    "selector_label":          "install_config/persistent_storage/selector_label_binding.html",
    "rolling_strategy":        "dev_guide/deployments/deployment_strategies.html#rolling-strategy",
    "recreate_strategy":       "dev_guide/deployments/deployment_strategies.html#recreate-strategy",
    "custom_strategy":         "dev_guide/deployments/deployment_strategies.html#custom-strategy",
    "lifecycle_hooks":         "dev_guide/deployments/deployment_strategies.html#lifecycle-hooks",
    "new_pod_exec":            "dev_guide/deployments/deployment_strategies.html#pod-based-lifecycle-hook",
    "authorization":           "architecture/additional_concepts/authorization.html",
    "roles":                   "architecture/additional_concepts/authorization.html#roles",
    "service_accounts":        "dev_guide/service_accounts.html",
    "users_and_groups":        "architecture/additional_concepts/authentication.html#users-and-groups",
    "pipeline-builds":         "architecture/core_concepts/builds_and_image_streams.html#pipeline-build",
    "pipeline-plugin":         "using_images/other_images/jenkins.html#openshift-origin-pipeline-plug-in",
    "quota":                   "dev_guide/compute_resources.html",
    "config-maps":             "dev_guide/configmaps.html",
    "secrets":                 "dev_guide/secrets.html",
    "deployments":             "dev_guide/deployments/how_deployments_work.html",
    //"stateful-sets":           "", // TODO: docs are in progress
    "pods":                    "architecture/core_concepts/pods_and_services.html#pods",
    "services":                "architecture/core_concepts/pods_and_services.html#services",
    "routes":                  "architecture/core_concepts/routes.html",
    "builds":                  "architecture/core_concepts/builds_and_image_streams.html#builds",
    "image-streams":           "architecture/core_concepts/builds_and_image_streams.html#image-streams",
    "storage":                 "architecture/additional_concepts/storage.html",
    "build-hooks":             "dev_guide/builds/build_hooks.html",
    // default should remain last, add new links above
    "default":                 "welcome/index.html"
  },
  // Maps links names to URL's where the CLI tools can be downloaded, may point directly to files or to external pages in a CDN, for example.
  CLI: {
    "Latest Release":          "https://github.com/openshift/origin/releases/latest"
  },
  // The default CPU target percentage for horizontal pod autoscalers created or edited in the web console.
  // This value is set in the HPA when the input is left blank.
  DEFAULT_HPA_CPU_TARGET_PERCENT: 80,

  // true indicates that deployment metrics should be disabled on the web console overview
  DISABLE_OVERVIEW_METRICS: false,

  // true indicates that custom metrics should be disabled when viewing pod metrics
  DISABLE_CUSTOM_METRICS: false,

  // true indicates that none of the routers support wildcard subdomains and
  // removes the option from the route creation form.
  DISABLE_WILDCARD_ROUTES: true,

  // true indicates that the web console should not show confirmation prompts
  // when users navigate away from a page without saving.
  DISABLE_CONFIRM_ON_EXIT: false,

  // This blacklist hides certain kinds from the "Other Resources" page because they are unpersisted, disallowed for most end users, or not supported by openshift but exist in kubernetes
  AVAILABLE_KINDS_BLACKLIST: [],
  // Currently disables watch on events used by the drawer
  DISABLE_GLOBAL_EVENT_WATCH: false,
  ENABLE_TECH_PREVIEW_FEATURE: {
    // Enable the new landing page and service catalog experience
    service_catalog_landing_page: false,
    // Set to `true` when the template service broker is enabled for the cluster in master-config.yaml
    template_service_broker: false,
    pod_presets: false
  },

  SAMPLE_PIPELINE_TEMPLATE: {
    name: "jenkins-pipeline-example",
    namespace: "openshift"
  },

  // only resources from the namespaces listed below can be utilized with create from url (/create)
  // 'openshift' should always be included
  CREATE_FROM_URL_WHITELIST: ['openshift'],

  // Namespaced resources not in this whitelist will be flagged to users as potential concerns in template processing
  // and Import YAML/JSON.  This typically shouldn't be customized but can be if necessary.
  SECURITY_CHECK_WHITELIST: [
    {resource: 'buildconfigs', group: ''},
    {resource: 'buildconfigs', group: 'build.openshift.io'},
    {resource: 'builds', group: ''},
    {resource: 'builds', group: 'build.openshift.io'},
    {resource: 'configmaps', group: ''},
    {resource: 'daemonsets', group: 'extensions'},
    {resource: 'deployments', group: 'apps'},
    {resource: 'deployments', group: 'extensions'},
    {resource: 'deploymentconfigs', group: ''},
    {resource: 'deploymentconfigs', group: 'apps.openshift.io'},
    {resource: 'endpoints', group: ''},
    {resource: 'events', group: ''},
    {resource: 'horizontalpodautoscalers', group: 'autoscaling'},
    {resource: 'horizontalpodautoscalers', group: 'extensions'},
    {resource: 'imagestreamimages', group: ''},
    {resource: 'imagestreamimages', group: 'image.openshift.io'},
    {resource: 'imagestreams', group: ''},
    {resource: 'imagestreams', group: 'image.openshift.io'},
    {resource: 'imagestreamtags', group: ''},
    {resource: 'imagestreamtags', group: 'image.openshift.io'},
    {resource: 'ingresses', group: 'extensions'},
    {resource: 'jobs', group: 'batch'},
    {resource: 'persistentvolumeclaims', group: ''},
    {resource: 'pods', group: ''},
    {resource: 'podtemplates', group: ''},
    {resource: 'replicasets', group: 'extensions'},
    {resource: 'replicationcontrollers', group: ''},
    {resource: 'routes', group: ''},
    {resource: 'routes', group: 'route.openshift.io'},
    {resource: 'secrets', group: ''},
    {resource: 'serviceaccounts', group: ''},
    {resource: 'services', group: ''},
    {resource: 'statefulsets', group: 'apps'}
  ],
  // TODO:
  // This map can drive both the drawer & toast messages by
  // updating it to the following format:
  // { drawer: true, toast: true  }
  // or perhaps this, where an event may apply to multiple resources
  // (though reuse of events is not super common, this could be overkill):
  // Failed: {
  //   resources: [{ group: 'apps', resource: 'deployments' }],
  //   drawer: true,
  //   toast: true
  // }
  // TODO: Also consider an API_OBJECTS_TO_IGNORE
  // map that can blacklist some, for example, if FailedCreate
  // applies to many but we don't want to see all.
  EVENTS_TO_SHOW: {
    // General events that apply to more than one api object
    FailedCreate: true,
    FailedDelete: true,
    FailedUpdate: true,
    // Build
    BuildCancelled: true,
    BuildCompleted: true,
    BuildFailed: true,
    BuildStarted: true,
    // BuildConfig
    BuildConfigInstantiateFailed: true,
    // Deployment
    DeploymentCancelled: true,
    Failed: true,
    ScalingReplicaSet: true,
    // DeploymentConfig
    DeploymentCreated: true,
    DeploymentCreationFailed: true,
    // HorizontalPodAutoscaler
    FailedRescale: true,
    SuccessfulRescale: true,
    // Pod
    BackOff: true,
    FailedSync: true,
    Unhealthy: true,
    // PVC
    FailedBinding: true,
    ProvisioningFailed: true,
    VolumeDeleted: true,
    // Service
    LoadBalancerUpdateFailed: true,
    // Service Catalog
    Deprovisioning: true,
    ErrorAsyncOperationInProgress: true,
    ErrorCallingProvision: true,
    ErrorInjectingBindResult: true,
    ProvisionedSuccessfully: true,
    Provisioning: true,
    ReferencesNonexistentInstance: true,
    ReferencesNonexistentServiceClass: true,
    ReferencesNonexistentServicePlan: true,
    UnbindCallFailed: true
  },

  // href's will be prefixed with /project/{{projectName}} unless they are absolute URLs
  PROJECT_NAVIGATION: [
    {
      label: "Overview",
      iconClass: "fa fa-dashboard",
      href: "/overview"
    },
    {
      label: "Applications",
      iconClass: "fa fa-cubes",
      secondaryNavSections: [
        {
          items: [
            {
              label: "Deployments",
              href: "/browse/deployments",
              prefixes: [
                "/add-config-volume",
                "/attach-pvc",
                "/browse/deployment/",
                "/browse/dc/",
                "/browse/rs/",
                "/browse/rc/",
                "/edit/autoscaler",
                "/edit/dc/",
                "/edit/health-checks",
                "/set-limits"
              ]
            },
            {
              label: "Stateful Sets",
              href: "/browse/stateful-sets",
              prefixes: [
                "/browse/stateful-sets/"
              ]
            },
            {
              label: "Pods",
              href: "/browse/pods",
              prefixes: [
                "/browse/pods/"
              ]
            },
            {
              label: "Services",
              href: "/browse/services",
              prefixes: [
                "/browse/services/"
              ]
            },
            {
              label: "Routes",
              href: "/browse/routes",
              prefixes: [
                "/browse/routes/",
                "/create-route",
                "/edit/routes/"
              ]
            }
          ]
        }
      ]
    },
    {
      label: "Builds",
      iconClass: "pficon pficon-build",
      secondaryNavSections: [
        {
          items: [
            {
              label: "Builds",
              href: "/browse/builds",
              prefixes: [
                "/browse/builds/",
                "/browse/builds-noconfig/",
                "/edit/builds/"
              ]
            },
            {
              label: "Pipelines",
              href: "/browse/pipelines",
              prefixes: [
                "/browse/pipelines/",
                "/edit/pipelines/"
              ]
            },
            {
              label: "Images",
              href: "/browse/images",
              prefixes: [
                "/browse/images/"
              ]
            }
          ]
        }
      ]
    },
    {
      label: "Resources",
      iconClass: "fa fa-files-o",
      secondaryNavSections: [
        {
          items: [
            {
              label: "Quota",
              href: "/quota"
            },
            {
              label: "Membership",
              href: "/membership",
              // supports: {resource: '', verb: '', group: '' }
              canI: {
                resource: 'rolebindings',
                verb: 'list'
              }
            },
            {
              label: "Config Maps",
              href: "/browse/config-maps",
              prefixes: [
                "/browse/config-maps/",
                "/create-config-map",
                "/edit/config-maps/"
              ]
            },
            {
              label: "Secrets",
              href: "/browse/secrets",
              prefixes: [
                "/browse/secrets/",
                "/create-secret"
              ],
              canI: {
                resource: 'secrets',
                verb: 'list'
              }
            },
            {
              label: "Other Resources",
              href: "/browse/other"
            }
          ]
        }
      ]
    },
    {
      label: "Storage",
      iconClass: "pficon pficon-container-node",
      href: "/browse/storage",
      prefixes: [
        "/browse/storage/",
        "/create-pvc"
      ]
    },
    {
      label: "Monitoring",
      iconClass: "pficon pficon-screen",
      href: "/monitoring",
      prefixes: [
        "/browse/events"
      ]
      // TODO uncomment when we have at least one of metrics or logs pages and then take off the href going straight to events
      // secondaryNavSections: [
      //   {
      //     items: [
      //       {
      //         label: "Events",
      //         href: "/browse/events"
      //       },
      //       {
      //         label: "Logs",
      //         href: "#" // TODO
      //       },
      //       {
      //         label: "Metrics",
      //         href: "#" // TODO
      //       }
      //     ]
      //   }
      // ]
    }
  ],
  CATALOG_CATEGORIES: [
    {
      id: 'languages',
      label: "Languages",
      iconClassDefault: "fa fa-code",
      items: [
        {
          id: "java",
          label: "Java",
          iconClass: "font-icon icon-openjdk",
          subcategories: [{
            id: 'java-subcategories',
            items: [
              {
                id: "amq",
                label: "Red Hat JBoss A-MQ"
              },
              {
                id: "processserver",
                label: "Red Hat JBoss BPM Suite"
              },
              {
                id: "decisionserver",
                label: "Red Hat JBoss BRMS"
              },
              {
                id: "datagrid",
                label: "Red Hat JBoss Data Grid"
              },
              {
                id: "eap",
                label: "Red Hat JBoss EAP"
              },
              {
                id: "jboss-fuse",
                label: "Red Hat JBoss Fuse"
              },
              {
                id: "tomcat",
                label: "Red Hat JBoss Web Server (Tomcat)"
              },
              {
                id: "sso",
                label: "Red Hat Single Sign-On"
              },
              {
                id: "wildfly",
                label: "WildFly"
              }
            ]
          }]
        },
        {
          id: "javascript",
          categoryAliases: ["nodejs","js"],
          label: "JavaScript",
          iconClass: "font-icon icon-js"
        },
        {
          id: "dotnet",
          label: ".NET",
          iconClass: "font-icon icon-dotnet"
        },
        {
          id: "perl",
          label: "Perl",
          iconClass: "font-icon icon-perl"
        },
        {
          id: "php",
          label: "PHP",
          iconClass: "font-icon icon-php"
        },
        {
          id: "python",
          label: "Python",
          iconClass: "font-icon icon-python"
        },
        {
          id: "ruby",
          label: "Ruby",
          iconClass: "font-icon icon-ruby"
        },
        {
          id: "Golang",
          categoryAliases: ["go"],
          label: "Go",
          iconClass: "font-icon icon-go-gopher"
        }
      ]
    },
    {
      id: 'technologies',
      label: "Technologies",
      items: [
        {
          id: "business-process-services",
          categoryAliases: ["decisionserver","processserver"],
          label: "Business Process Services",
          description: "Model, automate, and orchestrate business processes across applications, services, and data."
        },
        {
          id: "ci-cd",
          categoryAliases:["jenkins"],
          label: "Continuous Integration & Deployment",
          description: "Automate the build, test, and deployment of your application with each new code revision."
        },
        {
          id: "datastore",
          categoryAliases: ["database","datagrid"],
          label: "Data Stores",
          description: "Store and manage collections of data."
        },
        {
          id: "messaging",
          label: "Messaging",
          description: "Facilitate communication between applications and distributed processes with a messaging server."
        },
        {
          id: "integration",
          label: "Integration",
          description: "Connect with other applications and data to enhance functionality without duplication."
        },
        {
          id: "single-sign-on",
          categoryAliases: ["sso"],
          label: "Single Sign-On",
          description: "A centralized authentication server for users to log in, log out, register, and manage user accounts for applications and RESTful web services."
        },
        {
          id: "",
          label: "Uncategorized",
          description: ""
        }
      ]
    }
  ],
  SAAS_OFFERINGS: [
    // Example application link to add to the top of the landing page.
    // {
    //   id: 1,
    //   title: 'Microservices Application',
    //   icon: 'fa fa-cubes',
    //   url: 'https://www.example.com/',
    //   description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt.'
    // }
  ],
  APP_LAUNCHER_NAVIGATION: [
    // Example application link to show in the masthead application launcher beside the help and user menus.
    // {
    //   title: 'Dashboard',
    //   iconClass: 'fa fa-dashboard',
    //   href: 'http://example.com/',
    //   tooltip: 'Open Dashboard'
    // }
  ]
});
