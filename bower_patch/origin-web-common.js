/**
 * @name  openshiftCommonServices
 *
 * @description
 *   Base module for openshiftCommonServices.
 */
angular.module('openshiftCommonServices', ['ab-base64'])
  .config(["AuthServiceProvider", function(AuthServiceProvider) {
    AuthServiceProvider.UserStore('MemoryUserStore');
  }])
  .constant("API_CFG", _.get(window.OPENSHIFT_CONFIG, "api", {}))
  .constant("APIS_CFG", _.get(window.OPENSHIFT_CONFIG, "apis", {}))
  .constant("AUTH_CFG", _.get(window.OPENSHIFT_CONFIG, "auth", {}))
  .config(["$httpProvider", "AuthServiceProvider", "RedirectLoginServiceProvider", "AUTH_CFG", function($httpProvider, AuthServiceProvider, RedirectLoginServiceProvider, AUTH_CFG) {
    $httpProvider.interceptors.push('AuthInterceptor');

    AuthServiceProvider.LoginService('RedirectLoginService');
    AuthServiceProvider.LogoutService('DeleteTokenLogoutService');
    // TODO: fall back to cookie store when localStorage is unavailable (see known issues at http://caniuse.com/#feat=namevalue-storage)
    AuthServiceProvider.UserStore('LocalStorageUserStore');

    RedirectLoginServiceProvider.OAuthClientID(AUTH_CFG.oauth_client_id);
    RedirectLoginServiceProvider.OAuthAuthorizeURI(AUTH_CFG.oauth_authorize_uri);
    RedirectLoginServiceProvider.OAuthTokenURI(AUTH_CFG.oauth_token_uri);
    RedirectLoginServiceProvider.OAuthRedirectURI(URI(AUTH_CFG.oauth_redirect_base).segment("oauth").toString());
  }]);

hawtioPluginLoader.addModule('openshiftCommonServices');

// API Discovery, this runs before the angular app is bootstrapped
// TODO we want this to be possible with a single request against the API instead of being dependent on the numbers of groups and versions
hawtioPluginLoader.registerPreBootstrapTask(function(next) {
  // Skips api discovery, needed to run spec tests
  if ( _.get(window, "OPENSHIFT_CONFIG.api.k8s.resources") ) {
    next();
    return;
  }

  var api = {
    k8s: {},
    openshift: {}
  };
  var apis = {};
  var API_DISCOVERY_ERRORS = [];
  var protocol = window.location.protocol + "//";

  // Fetch /api/v1 for legacy k8s resources, we will never bump the version of these legacy apis so fetch version immediately
  var k8sBaseURL = protocol + window.OPENSHIFT_CONFIG.api.k8s.hostPort + window.OPENSHIFT_CONFIG.api.k8s.prefix;
  var k8sDeferred = $.get(k8sBaseURL + "/v1")
    .done(function(data) {
      api.k8s.v1 = _.indexBy(data.resources, 'name');
    })
    .fail(function(data, textStatus, jqXHR) {
      API_DISCOVERY_ERRORS.push({
        data: data,
        textStatus: textStatus,
        xhr: jqXHR
      });
    });

  // Fetch /oapi/v1 for legacy openshift resources, we will never bump the version of these legacy apis so fetch version immediately
  var osBaseURL = protocol + window.OPENSHIFT_CONFIG.api.openshift.hostPort + window.OPENSHIFT_CONFIG.api.openshift.prefix;
  var osDeferred = $.get(osBaseURL + "/v1")
    .done(function(data) {
      api.openshift.v1 = _.indexBy(data.resources, 'name');
    })
    .fail(function(data, textStatus, jqXHR) {
      API_DISCOVERY_ERRORS.push({
        data: data,
        textStatus: textStatus,
        xhr: jqXHR
      });
    });

  // Fetch /apis to get the list of groups and versions, then fetch each group/
  // Because the api discovery doc returns arrays and we want maps, this creates a structure like:
  // {
  //   extensions: {
  //     name: "extensions",
  //     preferredVersion: "v1beta1",
  //     versions: {
  //       v1beta1: {
  //         version: "v1beta1",
  //         groupVersion: "extensions/v1beta1"
  //         resources: {
  //           daemonsets: {
  //             /* resource returned from discovery API */
  //           }
  //         }
  //       }
  //     }
  //   }
  // }
  var apisBaseURL = protocol + window.OPENSHIFT_CONFIG.apis.hostPort + window.OPENSHIFT_CONFIG.apis.prefix;
  var getGroups = function(baseURL, hostPrefix, data) {
    var apisDeferredVersions = [];
    _.each(data.groups, function(apiGroup) {
      var group = {
        name: apiGroup.name,
        preferredVersion: apiGroup.preferredVersion.version,
        versions: {},
        hostPrefix: hostPrefix
      };
      apis[group.name] = group;
      _.each(apiGroup.versions, function(apiVersion) {
        var versionStr = apiVersion.version;
        group.versions[versionStr] = {
          version: versionStr,
          groupVersion: apiVersion.groupVersion
        };
        apisDeferredVersions.push($.get(baseURL + "/" + apiVersion.groupVersion)
          .done(function(data) {
            group.versions[versionStr].resources = _.indexBy(data.resources, 'name');
          })
          .fail(function(data, textStatus, jqXHR) {
            API_DISCOVERY_ERRORS.push({
              data: data,
              textStatus: textStatus,
              xhr: jqXHR
            });
          }));
      });
    });
    return $.when.apply(this, apisDeferredVersions);
  };
  var apisDeferred = $.get(apisBaseURL)
    .then(_.partial(getGroups, apisBaseURL, null), function(data, textStatus, jqXHR) {
      API_DISCOVERY_ERRORS.push({
        data: data,
        textStatus: textStatus,
        xhr: jqXHR
      });
    });

  // Additional servers can be defined for debugging and prototyping against new servers not yet served by the aggregator
  // There can not be any conflicts in the groups/resources from these API servers.
  var additionalDeferreds = [];
  _.each(window.OPENSHIFT_CONFIG.additionalServers, function(server) {
   var baseURL = (server.protocol ? (server.protocol + "://") : protocol) + server.hostPort + server.prefix;
   additionalDeferreds.push($.get(baseURL)
    .then(_.partial(getGroups, baseURL, server), function(data, textStatus, jqXHR) {
      if (server.required !== false) {
        API_DISCOVERY_ERRORS.push({
          data: data,
          textStatus: textStatus,
          xhr: jqXHR
        });
      }
    }));
  });

  // Will be called on success or failure
  var discoveryFinished = function() {
    window.OPENSHIFT_CONFIG.api.k8s.resources = api.k8s;
    window.OPENSHIFT_CONFIG.api.openshift.resources = api.openshift;
    window.OPENSHIFT_CONFIG.apis.groups = apis;
    if (API_DISCOVERY_ERRORS.length) {
      window.OPENSHIFT_CONFIG.apis.API_DISCOVERY_ERRORS = API_DISCOVERY_ERRORS;
    }
    next();
  };
  var allDeferreds = [
    k8sDeferred,
    osDeferred,
    apisDeferred
  ];
  allDeferreds = allDeferreds.concat(additionalDeferreds);
  $.when.apply(this, allDeferreds).always(discoveryFinished);
});


;/**
 * @name  openshiftCommonUI
 *
 * @description
 *   Base module for openshiftCommonUI.
 */
angular.module('openshiftCommonUI', [])
// Sometimes we need to know the css breakpoints, make sure to update this
// if they ever change!
.constant("BREAKPOINTS", {
  screenXsMin:  480,   // screen-xs
  screenSmMin:  768,   // screen-sm
  screenMdMin:  992,   // screen-md
  screenLgMin:  1200,  // screen-lg
  screenXlgMin: 1600   // screen-xlg
})
// DNS1123 subdomain patterns are used for name validation of many resources,
// including persistent volume claims, config maps, and secrets.
// See https://github.com/kubernetes/kubernetes/blob/master/pkg/api/validation/validation.go
.constant('DNS1123_SUBDOMAIN_VALIDATION', {
  pattern: /^[a-z0-9]([-a-z0-9]*[a-z0-9])?(\.[a-z0-9]([-a-z0-9]*[a-z0-9])?)*$/,
  maxlength: 253,
  description: 'Name must consist of lower-case letters, numbers, periods, and hyphens. It must start and end with a letter or a number.'
})
// http://stackoverflow.com/questions/9038625/detect-if-device-is-ios
.constant('IS_IOS', /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream);


hawtioPluginLoader.addModule('openshiftCommonUI');
;angular.module('openshiftCommonUI').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('src/components/binding/bindApplicationForm.html',
    "<div class=\"bind-form\">\n" +
    "  <form>\n" +
    "    <div class=\"form-group\">\n" +
    "      <label>\n" +
    "        <h3 translate>Create a binding for application <strong>{{ctrl.applicationName}}</strong></h3>\n" +
    "      </label>\n" +
    "      <span class=\"help-block\" translate>\n" +
    "        Bindings create a secret containing the necessary information for an application to use a service.\n" +
    "      </span>\n" +
    "    </div>\n" +
    "  </form>\n" +
    "\n" +
    "  <label ng-if=\"!ctrl.allowNoBinding\" translate>\n" +
    "    Select a service:\n" +
    "  </label>\n" +
    "  <form name=\"ctrl.formName\">\n" +
    "    <fieldset>\n" +
    "      <div class=\"radio\">\n" +
    "        <div ng-if=\"ctrl.allowNoBinding\" class=\"bind-service-selection\">\n" +
    "          <label>\n" +
    "            <input type=\"radio\" ng-model=\"ctrl.serviceToBind\" ng-value=\"null\">\n" +
    "            <translate>Do not bind at this time.</translate>\n" +
    "          </label>\n" +
    "          <div class=\"bind-description\">\n" +
    "          <span class=\"help-block service-instance-name\">\n" +
    "            Bindings can be created later from within a project.\n" +
    "          </span>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "        <div ng-repeat=\"serviceInstance in ctrl.bindableServiceInstances\" class=\"bind-service-selection\">\n" +
    "          <label>\n" +
    "            <input type=\"radio\" ng-model=\"ctrl.serviceToBind\" ng-value=\"serviceInstance\">\n" +
    "            {{ctrl.serviceClasses[serviceInstance.spec.serviceClassName].externalMetadata.displayName || serviceInstance.spec.serviceClassName}}\n" +
    "          </label>\n" +
    "          <div class=\"bind-description\">\n" +
    "            <span class=\"pficon pficon-info\"\n" +
    "                  ng-if=\"!(serviceInstance | isServiceInstanceReady)\"\n" +
    "                  data-content=\"{{'This service is not yet ready. If you bind to it, then the binding will be pending until the service is ready.'|translate}}\"\n" +
    "                  data-toggle=\"popover\"\n" +
    "                  data-trigger=\"hover\">\n" +
    "            </span>\n" +
    "            <span class=\"help-block service-instance-name\">\n" +
    "              {{serviceInstance.metadata.name}}\n" +
    "            </span>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "        <h4 ng-if=\"!ctrl.bindableServiceInstances.length\">\n" +
    "          <span class=\"pficon pficon-info\" aria-hidden=\"true\"></span>\n" +
    "          <span class=\"help-block service-instance-name\" translate>\n" +
    "            There are no bindable services in this project\n" +
    "          </span>\n" +
    "        </h4>\n" +
    "      </div>\n" +
    "    </fieldset>\n" +
    "  </form>\n" +
    "</div>\n"
  );


  $templateCache.put('src/components/binding/bindResults.html',
    "<div ng-if=\"!ctrl.error\">\n" +
    "  <div ng-if=\"!(ctrl.binding | isBindingReady)\" class=\"bind-status\" ng-class=\"{'text-center': !ctrl.progressInline, 'show-progress': !ctrl.progressInline}\">\n" +
    "    <div class=\"spinner\" ng-class=\"{'spinner-sm': ctrl.progressInline, 'spinner-inline': ctrl.progressInline, 'spinner-lg': !ctrl.progressInline}\" aria-hidden=\"true\"></div>\n" +
    "    <h3 class=\"bind-message\">\n" +
    "      <span class=\"sr-only\" translate>Pending</span>\n" +
    "      <div class=\"bind-pending-message\" ng-class=\"{'progress-inline': ctrl.progressInline}\" translate>The binding was created but is not ready yet.</div>\n" +
    "    </h3>\n" +
    "  </div>\n" +
    "  <div ng-if=\"(ctrl.binding | isBindingReady)\">\n" +
    "    <div class=\"bind-status\">\n" +
    "      <span class=\"pficon pficon-ok\" aria-hidden=\"true\"></span>\n" +
    "      <span class=\"sr-only\" translate>Success</span>\n" +
    "      <h3 class=\"bind-message\" translate>\n" +
    "        <strong>{{ctrl.serviceToBind}}</strong> <span>has been bound</span> <span ng-if=\"ctrl.bindType === 'application'\"> to <strong>{{ctrl.applicationToBind}}</strong> successfully</span>\n" +
    "      </h3>\n" +
    "    </div>\n" +
    "    <div class=\"sub-title\">\n" +
    "      <translate>The binding operation created the secret</translate>\n" +
    "      <a ng-if=\"ctrl.secretHref && 'secrets' | canI : 'list'\"\n" +
    "         ng-href=\"{{ctrl.secretHref}}\">{{ctrl.binding.spec.secretName}}</a>\n" +
    "      <span ng-if=\"!ctrl.secretHref || !('secrets' | canI : 'list')\">{{ctrl.binding.spec.secretName}}</span>\n" +
    "      <translate>that you may need to reference in your application.</translate>\n" +
    "      <span ng-if=\"ctrl.showPodPresets\" translate>Its data will be available to your application as environment variables.</span>\n" +
    "    </div>\n" +
    "    <div class=\"alert alert-info bind-info\">\n" +
    "      <span class=\"pficon pficon-info\" aria-hidden=\"true\"></span>\n" +
    "      <span class=\"sr-only\" translate>Info</span>\n" +
    "      <translate>The binding secret will only be available to new pods. You will need to redeploy your application.</translate>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "<div ng-if=\"ctrl.error\">\n" +
    "  <div class=\"bind-status\">\n" +
    "    <span class=\"pficon pficon-error-circle-o text-danger\" aria-hidden=\"true\"></span>\n" +
    "    <span class=\"sr-only\" translate>Error</span>\n" +
    "    <h3 class=\"bind-message\">\n" +
    "      <span translate>Binding Failed</span>\n" +
    "    </h3>\n" +
    "  </div>\n" +
    "  <div class=\"sub-title\">\n" +
    "    <span ng-if=\"ctrl.error.data.message\">\n" +
    "      {{ctrl.error.data.message | upperFirst}}\n" +
    "    </span>\n" +
    "    <span ng-if=\"!ctrl.error.data.message\" translate>\n" +
    "      An error occurred creating the binding.\n" +
    "    </span>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('src/components/binding/bindServiceForm.html',
    "<div class=\"bind-form\">\n" +
    "  <form>\n" +
    "    <div class=\"form-group\">\n" +
    "        <label>\n" +
    "          <h3><translate>Create a binding for</translate> <strong>{{ctrl.serviceClass.externalMetadata.displayName || ctrl.serviceClassName}}</strong></h3>\n" +
    "        </label>\n" +
    "        <span class=\"help-block\" translate>Bindings create a secret containing the necessary information for an application to use this service.</span>\n" +
    "    </div>\n" +
    "  </form>\n" +
    "\n" +
    "  <form name=\"ctrl.formName\" class=\"mar-bottom-lg\">\n" +
    "    <fieldset>\n" +
    "      <div class=\"radio\">\n" +
    "        <label class=\"bind-choice\" ng-disabled=\"!ctrl.applications.length\">\n" +
    "          <input type=\"radio\" ng-model=\"ctrl.bindType\" value=\"application\" ng-disabled=\"!ctrl.applications.length\">\n" +
    "          <translate>Create a secret and inject it into an application</translate>\n" +
    "        </label>\n" +
    "        <div class=\"application-select\">\n" +
    "          <ui-select ng-model=\"ctrl.appToBind\"\n" +
    "                     ng-disabled=\"ctrl.bindType !== 'application'\"\n" +
    "                     ng-required=\"ctrl.bindType === 'application'\">\n" +
    "            <ui-select-match placeholder=\"{{ctrl.applications.length ? 'Select an application' : 'There are no applications in this project'}}\">\n" +
    "              <span>\n" +
    "                {{$select.selected.metadata.name}}\n" +
    "                <small class=\"text-muted\">&ndash; {{$select.selected.kind | humanizeKind : true}}</small>\n" +
    "              </span>\n" +
    "            </ui-select-match>\n" +
    "            <ui-select-choices\n" +
    "              repeat=\"application in (ctrl.applications) | filter : { metadata: { name: $select.search } } track by (application | uid)\"\n" +
    "              group-by=\"ctrl.groupByKind\">\n" +
    "              <span ng-bind-html=\"application.metadata.name | highlight : $select.search\"></span>\n" +
    "            </ui-select-choices>\n" +
    "          </ui-select>\n" +
    "        </div>\n" +
    "        <label class=\"bind-choice\">\n" +
    "          <input type=\"radio\" ng-model=\"ctrl.bindType\" value=\"secret-only\">\n" +
    "          Create a secret in <strong>{{ctrl.projectName}}</strong> to be used later\n" +
    "        </label>\n" +
    "        <div class=\"help-block bind-description\" translate>\n" +
    "          Secrets can be referenced later from an application.\n" +
    "        </div>\n" +
    "        <label ng-if=\"ctrl.allowNoBinding\" class=\"bind-choice\">\n" +
    "          <input type=\"radio\" ng-model=\"ctrl.bindType\" value=\"none\">\n" +
    "          <translate>Do not bind at this time</translate>\n" +
    "        </label>\n" +
    "        <div ng-if=\"ctrl.allowNoBinding\" class=\"help-block bind-description\">\n" +
    "          <translate>Bindings can be created later from within a project.</translate>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </fieldset>\n" +
    "  </form>\n" +
    "</div>\n"
  );


  $templateCache.put('src/components/create-project/createProject.html',
    "<form name=\"createProjectForm\" novalidate>\n" +
    "  <fieldset ng-disabled=\"disableInputs\">\n" +
    "    <div class=\"form-group\">\n" +
    "      <label for=\"name\" class=\"required\" translate>Name</label>\n" +
    "      <span ng-class=\"{'has-error': (createProjectForm.name.$error.pattern && createProjectForm.name.$touched) || nameTaken}\">\n" +
    "        <input class=\"form-control input-lg\"\n" +
    "            name=\"name\"\n" +
    "            id=\"name\"\n" +
    "            placeholder=\"{{'my-project'|translate}}\"\n" +
    "            type=\"text\"\n" +
    "            required\n" +
    "            take-focus\n" +
    "            minlength=\"2\"\n" +
    "            maxlength=\"63\"\n" +
    "            pattern=\"[a-z0-9]([-a-z0-9]*[a-z0-9])?\"\n" +
    "            aria-describedby=\"nameHelp\"\n" +
    "            ng-model=\"name\"\n" +
    "            ng-model-options=\"{ updateOn: 'default blur' }\"\n" +
    "            ng-change=\"nameTaken = false\"\n" +
    "            autocorrect=\"off\"\n" +
    "            autocapitalize=\"off\"\n" +
    "            spellcheck=\"false\">\n" +
    "      </span>\n" +
    "      <div>\n" +
    "        <span class=\"help-block\" translate>A unique name for the project.</span>\n" +
    "      </div>\n" +
    "      <div class=\"has-error\">\n" +
    "        <span id=\"nameHelp\" class=\"help-block\" ng-if=\"createProjectForm.name.$error.required && createProjectForm.name.$dirty\" translate>\n" +
    "          Name is required.\n" +
    "        </span>\n" +
    "      </div>\n" +
    "      <div class=\"has-error\">\n" +
    "        <span id=\"nameHelp\" class=\"help-block\" ng-if=\"createProjectForm.name.$error.minlength && createProjectForm.name.$touched\" translate>\n" +
    "          Name must have at least two characters.\n" +
    "        </span>\n" +
    "      </div>\n" +
    "      <div class=\"has-error\">\n" +
    "        <span id=\"nameHelp\" class=\"help-block\" ng-if=\"createProjectForm.name.$error.pattern && createProjectForm.name.$touched\" translate>\n" +
    "          Project names may only contain lower-case letters, numbers, and dashes. They may not start or end with a dash.\n" +
    "        </span>\n" +
    "      </div>\n" +
    "      <div class=\"has-error\">\n" +
    "        <span class=\"help-block\" ng-if=\"nameTaken\" translate>\n" +
    "          This name is already in use. Please choose a different name.\n" +
    "        </span>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"form-group\">\n" +
    "      <label for=\"displayName\" translate>Display Name</label>\n" +
    "      <input class=\"form-control input-lg\"\n" +
    "          name=\"displayName\"\n" +
    "          id=\"displayName\"\n" +
    "          placeholder=\"{{'My Project'|translate}}\"\n" +
    "          type=\"text\"\n" +
    "          ng-model=\"displayName\">\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"form-group\">\n" +
    "      <label for=\"description\" translate>Description</label>\n" +
    "      <textarea class=\"form-control input-lg\"\n" +
    "          name=\"description\"\n" +
    "          id=\"description\"\n" +
    "          placeholder=\"{{'A short description.'|translate}}\"\n" +
    "          ng-model=\"description\"></textarea>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"button-group\">\n" +
    "      <button type=\"submit\"\n" +
    "          class=\"btn btn-primary btn-lg\"\n" +
    "          ng-class=\"{'dialog-btn': isDialog}\"\n" +
    "          ng-click=\"createProject()\"\n" +
    "          ng-disabled=\"createProjectForm.$invalid || nameTaken || disableInputs\"\n" +
    "          value=\"\" translate>\n" +
    "        Create\n" +
    "      </button>\n" +
    "      <button\n" +
    "          class=\"btn btn-default btn-lg\"\n" +
    "          ng-class=\"{'dialog-btn': isDialog}\"\n" +
    "          ng-click=\"cancelCreateProject()\" translate>\n" +
    "        Cancel\n" +
    "      </button>\n" +
    "    </div>\n" +
    "  </fieldset>\n" +
    "</form>\n"
  );


  $templateCache.put('src/components/delete-project/delete-project-button.html',
    "<div class=\"actions\">\n" +
    "  <!-- Avoid whitespace inside the link -->\n" +
    "  <a href=\"\"\n" +
    "     ng-click=\"$event.stopPropagation(); openDeleteModal()\"\n" +
    "     role=\"button\"\n" +
    "     class=\"action-button\"\n" +
    "     ng-attr-aria-disabled=\"{{disableDelete ? 'true' : undefined}}\"\n" +
    "     ng-class=\"{ 'disabled-link': disableDelete }\"\n" +
    "    ><i class=\"fa fa-trash-o\" aria-hidden=\"true\"\n" +
    "  ></i><span class=\"sr-only\"><translate>Delete Project</translate> {{projectName}}</span></a>\n" +
    "</div>\n"
  );


  $templateCache.put('src/components/delete-project/delete-project-modal.html',
    "<div class=\"delete-resource-modal\">\n" +
    "  <!-- Use a form so that the enter key submits when typing a project name to confirm. -->\n" +
    "  <form>\n" +
    "    <div class=\"modal-body\">\n" +
    "      <h1 translate>Are you sure you want to delete the project '<strong>{{displayName ? displayName : projectName}}</strong>'?</h1>\n" +
    "      <p translate>\n" +
    "        This will <strong>delete all resources</strong> associated with the project {{displayName ? displayName : projectName}} and <strong>cannot be undone</strong>.  Make sure this is something you really want to do!\n" +
    "      </p>\n" +
    "      <div ng-show=\"typeNameToConfirm\">\n" +
    "        <p translate>Type the name of the project to confirm.</p>\n" +
    "        <p>\n" +
    "          <label class=\"sr-only\" for=\"resource-to-delete\" translate>project to delete</label>\n" +
    "          <input\n" +
    "              ng-model=\"confirmName\"\n" +
    "              id=\"resource-to-delete\"\n" +
    "              type=\"text\"\n" +
    "              class=\"form-control input-lg\"\n" +
    "              autocorrect=\"off\"\n" +
    "              autocapitalize=\"off\"\n" +
    "              spellcheck=\"false\"\n" +
    "              autofocus>\n" +
    "        </p>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "    <div class=\"modal-footer\">\n" +
    "      <button ng-disabled=\"typeNameToConfirm && confirmName !== projectName && confirmName !== displayName\" class=\"btn btn-lg btn-danger\" type=\"submit\" ng-click=\"delete();\" translate>Delete</button>\n" +
    "      <button class=\"btn btn-lg btn-default\" type=\"button\" ng-click=\"cancel();\" translate>Cancel</button>\n" +
    "    </div>\n" +
    "  </form>\n" +
    "</div>\n"
  );


  $templateCache.put('src/components/delete-project/delete-project.html',
    "<a href=\"javascript:void(0)\"\n" +
    "   ng-click=\"openDeleteModal()\"\n" +
    "   role=\"button\"\n" +
    "   ng-attr-aria-disabled=\"{{disableDelete ? 'true' : undefined}}\"\n" +
    "   ng-class=\"{ 'disabled-link': disableDelete }\"\n" +
    ">{{label || 'Delete'}}</a>\n"
  );


  $templateCache.put('src/components/edit-project/editProject.html',
    "<form name=\"editProjectForm\">\n" +
    "  <fieldset ng-disabled=\"disableInputs\">\n" +
    "    <div class=\"form-group\">\n" +
    "      <label for=\"displayName\" translate>Display Name</label>\n" +
    "      <input class=\"form-control input-lg\"\n" +
    "             name=\"displayName\"\n" +
    "             id=\"displayName\"\n" +
    "             placeholder=\"{{'My Project'|translate}}\"\n" +
    "             type=\"text\"\n" +
    "             ng-model=\"editableFields.displayName\">\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"form-group\">\n" +
    "      <label for=\"description\" translate>Description</label>\n" +
    "                    <textarea class=\"form-control input-lg\"\n" +
    "                              name=\"description\"\n" +
    "                              id=\"description\"\n" +
    "                              placeholder=\"{{'A short description.'|translate}}\"\n" +
    "                              ng-model=\"editableFields.description\"></textarea>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"button-group\">\n" +
    "      <button type=\"submit\"\n" +
    "              class=\"btn btn-primary btn-lg\"\n" +
    "              ng-class=\"{'dialog-btn': isDialog}\"\n" +
    "              ng-click=\"update()\"\n" +
    "              ng-disabled=\"editProjectForm.$invalid || disableInputs\"\n" +
    "              value=\"\">{{submitButtonLabel}}</button>\n" +
    "      <button\n" +
    "          class=\"btn btn-default btn-lg\"\n" +
    "          ng-class=\"{'dialog-btn': isDialog}\"\n" +
    "          ng-click=\"cancelEditProject()\">\n" +
    "        Cancel\n" +
    "      </button>\n" +
    "    </div>\n" +
    "  </fieldset>\n" +
    "</form>\n"
  );


  $templateCache.put('src/components/toast-notifications/toast-notifications.html',
    "<div class=\"toast-notifications-list-pf\">\n" +
    "  <div ng-repeat=\"(notificationID, notification) in notifications track by (notificationID + (notification.message || notification.details))\" ng-if=\"!notification.hidden || notification.isHover\"\n" +
    "       ng-mouseenter=\"setHover(notification, true)\" ng-mouseleave=\"setHover(notification, false)\">\n" +
    "    <div class=\"toast-pf alert {{notification.type | alertStatus}}\" ng-class=\"{'alert-dismissable': !hideCloseButton}\">\n" +
    "      <button ng-if=\"!hideCloseButton\" type=\"button\" class=\"close\" ng-click=\"close(notification)\">\n" +
    "        <span class=\"pficon pficon-close\" aria-hidden=\"true\"></span>\n" +
    "        <span class=\"sr-only\" translate>Close</span>\n" +
    "      </button>\n" +
    "      <span class=\"{{notification.type | alertIcon}}\" aria-hidden=\"true\"></span>\n" +
    "      <span class=\"sr-only\">{{notification.type}}</span>\n" +
    "      <span class=\"toast-notification-message\" ng-if=\"notification.message\">{{notification.message}}</span>\n" +
    "      <span ng-if=\"notification.details\">\n" +
    "        <truncate-long-text\n" +
    "          limit=\"200\"\n" +
    "          content=\"notification.details\"\n" +
    "          use-word-boundary=\"true\"\n" +
    "          expandable=\"true\"\n" +
    "          hide-collapse=\"true\">\n" +
    "        </truncate-long-text>\n" +
    "      </span>\n" +
    "      <span ng-repeat=\"link in notification.links\">\n" +
    "        <a ng-if=\"!link.href\" href=\"\" ng-click=\"onClick(notification, link)\" role=\"button\">{{link.label}}</a>\n" +
    "        <a ng-if=\"link.href\" ng-href=\"{{link.href}}\" ng-attr-target=\"{{link.target}}\">{{link.label}}</a>\n" +
    "        <span ng-if=\"!$last\" class=\"toast-action-divider\">|</span>\n" +
    "      </span>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('src/components/truncate-long-text/truncateLongText.html',
    "<!--\n" +
    "  Do not remove class `truncated-content` (here or below) even though it's not\n" +
    "  styled directly in origin-web-common.  `truncated-content` is used by\n" +
    "  origin-web-console in certain contexts.\n" +
    "-->\n" +
    "<span ng-if=\"!truncated\" ng-bind-html=\"content | highlightKeywords : keywords\" class=\"truncated-content\"></span>\n" +
    "<span ng-if=\"truncated\">\n" +
    "  <span ng-if=\"!toggles.expanded\">\n" +
    "    <span ng-attr-title=\"{{content}}\" class=\"truncation-block\">\n" +
    "      <span ng-bind-html=\"truncatedContent | highlightKeywords : keywords\" class=\"truncated-content\"></span>&hellip;\n" +
    "    </span>\n" +
    "    <a ng-if=\"expandable\" href=\"\" ng-click=\"toggles.expanded = true\" class=\"nowrap\" translate>See All</a>\n" +
    "  </span>\n" +
    "  <span ng-if=\"toggles.expanded\">\n" +
    "    <div ng-if=\"prettifyJson\" class=\"well\">\n" +
    "      <span ng-if=\"!hideCollapse\" class=\"pull-right\" style=\"margin-top: -10px;\"><a href=\"\" ng-click=\"toggles.expanded = false\" class=\"truncation-collapse-link\" translate>Collapse</a></span>\n" +
    "      <span ng-bind-html=\"content | prettifyJSON | highlightKeywords : keywords\" class=\"pretty-json truncated-content\"></span>\n" +
    "    </div>\n" +
    "    <span ng-if=\"!prettifyJson\">\n" +
    "      <span ng-if=\"!hideCollapse\" class=\"pull-right\"><a href=\"\" ng-click=\"toggles.expanded = false\" class=\"truncation-collapse-link\" translate>Collapse</a></span>\n" +
    "      <span ng-bind-html=\"content | highlightKeywords : keywords\" class=\"truncated-content\"></span>\n" +
    "    </span>\n" +
    "  </span>\n" +
    "</span>\n"
  );

}]);
;'use strict';

angular.module('openshiftCommonUI').component('bindApplicationForm', {
  controllerAs: 'ctrl',
  bindings: {
    allowNoBinding: '<?',
    createBinding: '=',
    applicationName: '=',
    formName: '=',
    serviceClasses: '<',
    serviceInstances: '<',
    serviceToBind: '='
  },
  templateUrl: 'src/components/binding/bindApplicationForm.html',
  controller: ["BindingService", function (BindingService) {
    var ctrl = this;
    ctrl.$onChanges = function (changeObj) {
      if (changeObj.serviceInstances || changeObj.serviceClasses) {
        ctrl.bindableServiceInstances = _.filter(ctrl.serviceInstances, isBindable);
      }
    };

    function isBindable(serviceInstance) {
      return BindingService.isServiceBindable(serviceInstance, ctrl.serviceClasses);
    }
  }]
});
;'use strict';

angular.module('openshiftCommonUI').component('bindResults', {
  controllerAs: 'ctrl',
  bindings: {
    error: '<',
    binding: '<',
    progressInline: '@',
    serviceToBind: '<',
    bindType: '@',
    applicationToBind: '<',
    showPodPresets: '<',
    secretHref: '<'
  },
  templateUrl: 'src/components/binding/bindResults.html',
  controller: function() {
    var ctrl = this;
    ctrl.$onInit = function () {
      ctrl.progressInline = ctrl.progressInline === 'true';
    };

    ctrl.$onChanges = function(onChangesObj) {
      if (onChangesObj.progressInline) {
        ctrl.progressInline = ctrl.progressInline === 'true';
      }
    }
  }
});


;'use strict';

angular.module('openshiftCommonUI').component('bindServiceForm', {
  controllerAs: 'ctrl',
  bindings: {
    serviceClass: '<',
    serviceClassName: '<',
    applications: '<',
    formName: '=',
    allowNoBinding: '<?',
    projectName: '<',
    bindType: '=', // One of: 'none', 'application', 'secret-only'
    appToBind: '=' // only applicable to 'application' bindType
  },
  templateUrl: 'src/components/binding/bindServiceForm.html',
  controller: ["$filter", function ($filter) {
    var ctrl = this;

    var humanizeKind = $filter('humanizeKind');
    ctrl.groupByKind = function(object) {
      return humanizeKind(object.kind);
    };
  }]
});
;"use strict";

angular.module("openshiftCommonUI")

  .directive("createProject", ["$window", function($window) {
    return {
      restrict: 'E',
      scope: {
        redirectAction: '&',
        onCancel: '&?',
        isDialog: '@'
      },
      templateUrl: 'src/components/create-project/createProject.html',
      controller: ["$scope", "$filter", "$location", "DataService", "NotificationsService", "displayNameFilter", function($scope, $filter, $location, DataService, NotificationsService, displayNameFilter) {
        if(!($scope.submitButtonLabel)) {
          $scope.submitButtonLabel = 'Create';
        }

        $scope.isDialog = $scope.isDialog === 'true';

        var hideErrorNotifications = function() {
          NotificationsService.hideNotification('create-project-error');
        };

        $scope.createProject = function() {
          $scope.disableInputs = true;
          if ($scope.createProjectForm.$valid) {
            DataService
              .create('projectrequests', null, {
                apiVersion: "v1",
                kind: "ProjectRequest",
                metadata: {
                  name: $scope.name
                },
                displayName: $scope.displayName,
                description: $scope.description
              }, $scope)
              .then(function(data) {
                // angular is actually wrapping the redirect action
                var cb = $scope.redirectAction();
                if (cb) {
                  cb(encodeURIComponent(data.metadata.name));
                } else {
                  $location.path("project/" + encodeURIComponent(data.metadata.name) + "/create");
                }
                NotificationsService.addNotification({
                  type: "success",
                  message: "Project \'"  + displayNameFilter(data) + "\' was successfully created."
                });
              }, function(result) {
                $scope.disableInputs = false;
                var data = result.data || {};
                if (data.reason === 'AlreadyExists') {
                  $scope.nameTaken = true;
                } else {
                  var msg = data.message || 'An error occurred creating the project.';
                  NotificationsService.addNotification({
                    id: 'create-project-error',
                    type: 'error',
                    message: msg
                  });
                }
              });
          }
        };

        $scope.cancelCreateProject = function() {
          if ($scope.onCancel) {
            var cb = $scope.onCancel();
            if (cb) {
              cb();
            }
          } else {
            $window.history.back();
          }
        };

        $scope.$on("$destroy", hideErrorNotifications);
      }],
    };
  }]);
;'use strict';

angular.module("openshiftCommonUI")
  .directive("deleteProject", ["$uibModal", "$location", "$filter", "$q", "hashSizeFilter", "APIService", "DataService", "NotificationsService", "Logger", function ($uibModal, $location, $filter, $q, hashSizeFilter, APIService, DataService, NotificationsService, Logger) {
    return {
      restrict: "E",
      scope: {
        // The name of project to delete
        projectName: "@",
        // Optional display name of the project to delete.
        displayName: "@",
        // Set to true to disable the delete button.
        disableDelete: "=?",
        // Force the user to enter the name before we'll delete the project.
        typeNameToConfirm: "=?",
        // Optional link label. Defaults to "Delete".
        label: "@?",
        // Only show a delete icon with no text.
        buttonOnly: "@",
        // Stay on the current page without redirecting to the projects list.
        stayOnCurrentPage: "=?",
        // Optional callback when the delete succeeds
        success: "=?",
        // Optional redirect URL when the delete succeeds
        redirectUrl: "@?"
      },
      templateUrl: function(elem, attr) {
        if (angular.isDefined(attr.buttonOnly)) {
          return "src/components/delete-project/delete-project-button.html";
        }

        return "src/components/delete-project/delete-project.html";
      },
      // Replace so ".dropdown-menu > li > a" styles are applied.
      replace: true,
      link: function(scope, element, attrs) {
        var showAlert = function(alert) {
          NotificationsService.addNotification(alert.data);
        };

        var navigateToList = function() {
          if (scope.stayOnCurrentPage) {
            return;
          }

          if (scope.redirectUrl) {
            $location.url(scope.redirectUrl);
            return;
          }

          if ($location.path() === '/') {
            scope.$emit('deleteProject');
            return;
          }

          var homeRedirect = URI('/');
          $location.url(homeRedirect);
        };

        scope.openDeleteModal = function() {
          if (scope.disableDelete) {
            return;
          }

          // opening the modal with settings scope as parent
          var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'src/components/delete-project/delete-project-modal.html',
            controller: 'DeleteProjectModalController',
            scope: scope
          });

          modalInstance.result.then(function() {
            // upon clicking delete button, delete resource and send alert
            var projectName = scope.projectName;
            var formattedResource = "Project \'"  + scope.displayName + "\'";
            var context = {};

            DataService.delete({
              resource: APIService.kindToResource("Project")
            }, projectName, context)
            .then(function() {
              showAlert({
                name: projectName,
                data: {
                  type: "success",
                  message: formattedResource + " was marked for deletion."
                }
              });

              if (scope.success) {
                scope.success();
              }

              navigateToList();
            })
            .catch(function(err) {
              // called if failure to delete
              var alert = {
                type: "error",
                message: formattedResource + " could not be deleted.",
                details: $filter('getErrorDetails')(err)
              };
              NotificationsService.addNotification(alert);
              Logger.error(formattedResource + " could not be deleted.", err);
            });
          });
        };
      }
    };
  }]);

;'use strict';
/* jshint unused: false */

/**
 * @ngdoc function
 * @name openshiftCommonUI.controller:DeleteProjectModalController
 */
angular.module('openshiftCommonUI')
  .controller('DeleteProjectModalController', ["$scope", "$uibModalInstance", function ($scope, $uibModalInstance) {
    $scope.delete = function() {
      $uibModalInstance.close('delete');
    };

    $scope.cancel = function() {
      $uibModalInstance.dismiss('cancel');
    };
  }]);
;"use strict";

angular.module("openshiftCommonUI")

  .directive("editProject", ["$window", function($window) {
    return {
      restrict: 'E',
      scope: {
        project: '=',
        alerts: '=',
        submitButtonLabel: '@',
        redirectAction: '&',
        onCancel: '&',
        isDialog: '@'
      },
      templateUrl: 'src/components/edit-project/editProject.html',
      controller: ["$scope", "$filter", "$location", "DataService", "NotificationsService", "annotationNameFilter", "displayNameFilter", function($scope, $filter, $location, DataService, NotificationsService, annotationNameFilter, displayNameFilter) {
        if(!($scope.submitButtonLabel)) {
          $scope.submitButtonLabel = 'Save';
        }

        $scope.isDialog = $scope.isDialog === 'true';

        var annotation = $filter('annotation');
        var annotationName = $filter('annotationName');

        var editableFields = function(resource) {
          return {
            description: annotation(resource, 'description'),
            displayName: annotation(resource, 'displayName')
          };
        };

        var mergeEditable = function(project, editable) {
          var toSubmit = angular.copy(project);
          toSubmit.metadata.annotations[annotationName('description')] = editable.description;
          toSubmit.metadata.annotations[annotationName('displayName')] = editable.displayName;
          return toSubmit;
        };

        var cleanEditableAnnotations = function(resource) {
          var paths = [
            annotationNameFilter('description'),
            annotationNameFilter('displayName')
          ];
          _.each(paths, function(path) {
            if(!resource.metadata.annotations[path]) {
              delete resource.metadata.annotations[path];
            }
          });
          return resource;
        };

        var showAlert = function(alert) {
          $scope.alerts["update"] = alert;
          NotificationsService.addNotification(alert);
        };

        $scope.editableFields = editableFields($scope.project);

        $scope.update = function() {
          $scope.disableInputs = true;
          if ($scope.editProjectForm.$valid) {
            DataService
              .update(
                'projects',
                $scope.project.metadata.name,
                cleanEditableAnnotations(mergeEditable($scope.project, $scope.editableFields)),
                {projectName: $scope.project.name},
                {errorNotification: false})
              .then(function(project) {
                // angular is actually wrapping the redirect action :/
                var cb = $scope.redirectAction();
                if (cb) {
                  cb(encodeURIComponent($scope.project.metadata.name));
                }

                showAlert({
                  type: "success",
                  message: "Project \'"  + displayNameFilter(project) + "\' was successfully updated."
                });
              }, function(result) {
                $scope.disableInputs = false;
                $scope.editableFields = editableFields($scope.project);
                showAlert({
                  type: "error",
                  message: "An error occurred while updating the project",
                  details: $filter('getErrorDetails')(result)
                });
              });
          }
        };

        $scope.cancelEditProject = function() {
          var cb = $scope.onCancel();
          if (cb) {
            cb();
          } else {
            $window.history.back();
          }
        };
      }],
    };
  }]);
;'use strict';
// oscUnique is a validation directive
// use:
// Put it on an input or other DOM node with an ng-model attribute.
// Pass a list (array, or object) via osc-unique="list"
//
// Sets model $valid true||false
// - model is valid so long as the item is not already in the list
//
// Key off $valid to enable/disable/sow/etc other objects
//
// Validates that the ng-model is unique in a list of values.
// ng-model: 'foo'
// oscUnique: ['foo', 'bar', 'baz']       // false, the string 'foo' is in the list
// oscUnique: [1,2,4]                     // true, the string 'foo' is not in the list
// oscUnique: {foo: true, bar: false}     // false, the object has key 'foo'
// NOTES:
// - non-array values passed to oscUnqiue will be transformed into an array.
//   - oscUnqiue: 'foo' => [0,1,2]  (probably not what you want, so don't pass a string)
// - objects passed will be converted to a list of object keys.
//   - { foo: false } would still be invalid, because the key exists (value is ignored)
//   - recommended to pass an array
//
// Example:
// - prevent a button from being clickable if the input value has already been used
// <input ng-model="key" osc-unique="keys" />
// <button ng-disabled="form.key.$error.oscUnique" ng-click="submit()">Submit</button>
//
angular.module('openshiftCommonUI')
  .directive('oscUnique', function() {
    return {
      restrict: 'A',
      scope: {
        oscUnique: '='
      },
      require: 'ngModel',
      link: function($scope, $elem, $attrs, ctrl) {
        var list = [];

        $scope.$watchCollection('oscUnique', function(newVal) {
          list = _.isArray(newVal) ?
                    newVal :
                    _.keys(newVal);
        });

        ctrl.$parsers.unshift(function(value) {
          // is valid so long as it doesn't already exist
          ctrl.$setValidity('oscUnique', !_.includes(list, value));
          return value;
        });
      }
    };
  });
;'use strict';

angular.module('openshiftCommonUI')
  // This triggers when an element has either a toggle or data-toggle attribute set on it
  .directive('toggle', ["IS_IOS", function(IS_IOS) {
    // Sets the CSS cursor value on the document body to allow dismissing the tooltips on iOS.
    // See https://github.com/twbs/bootstrap/issues/16028#issuecomment-236269114
    var setCursor = function(cursor) {
      $('body').css('cursor', cursor);
    };
    var setCursorPointer = _.partial(setCursor, 'pointer');
    var setCursorAuto = _.partial(setCursor, 'auto');
    if (IS_IOS) {
      $(document).on('shown.bs.popover', setCursorPointer);
      $(document).on('shown.bs.tooltip', setCursorPointer);
      $(document).on('hide.bs.popover', setCursorAuto);
      $(document).on('hide.bs.tooltip', setCursorAuto);
    }

    return {
      restrict: 'A',
      scope: {
        dynamicContent: '@?'
      },
      link: function($scope, element, attrs) {
        var popupConfig = {
          container: attrs.container || "body",
          placement: attrs.placement || "auto"
        };
        if (attrs) {
          switch(attrs.toggle) {
            case "popover":
              // If dynamic-content attr is set at all, even if it hasn't evaluated to a value
              if (attrs.dynamicContent || attrs.dynamicContent === "") {
                $scope.$watch('dynamicContent', function() {
                  $(element).popover("destroy");
                  // Destroy is asynchronous. Wait for it to complete before updating content.
                  // See https://github.com/twbs/bootstrap/issues/16376
                  //     https://github.com/twbs/bootstrap/issues/15607
                  //     http://stackoverflow.com/questions/27238938/bootstrap-popover-destroy-recreate-works-only-every-second-time
                  // Destroy calls hide, which takes 150ms to complete.
                  //     https://github.com/twbs/bootstrap/blob/87121181c8a4b63192865587381d4b8ada8de30c/js/tooltip.js#L31
                  setTimeout(function() {
                    $(element)
                      .attr("data-content", $scope.dynamicContent)
                      .popover(popupConfig);
                  }, 200);
                });
              }
              $(element).popover(popupConfig);
              $scope.$on('$destroy', function(){
                $(element).popover("destroy");
              });
              break;
            case "tooltip":
              // If dynamic-content attr is set at all, even if it hasn't evaluated to a value
              if (attrs.dynamicContent || attrs.dynamicContent === "") {
                $scope.$watch('dynamicContent', function() {
                  $(element).tooltip("destroy");
                  // Destroy is asynchronous. Wait for it to complete before updating content.
                  // See https://github.com/twbs/bootstrap/issues/16376
                  //     https://github.com/twbs/bootstrap/issues/15607
                  //     http://stackoverflow.com/questions/27238938/bootstrap-popover-destroy-recreate-works-only-every-second-time
                  // Destroy calls hide, which takes 150ms to complete.
                  //     https://github.com/twbs/bootstrap/blob/87121181c8a4b63192865587381d4b8ada8de30c/js/tooltip.js#L31
                  setTimeout(function() {
                    $(element)
                      .attr("title", $scope.dynamicContent)
                      .tooltip(popupConfig);
                  }, 200);
                });
              }
              $(element).tooltip(popupConfig);
              $scope.$on('$destroy', function(){
                $(element).tooltip("destroy");
              });
              break;
            case "dropdown":
              if (attrs.hover === "dropdown") {
                $(element).dropdownHover({delay: 200});
                $(element).dropdown();
              }
              break;
          }
        }
      }
    };
  }]);
;'use strict';

angular.module('openshiftCommonUI')
  // The HTML5 `autofocus` attribute does not work reliably with Angular,
  // so define our own directive
  .directive('takeFocus', ["$timeout", function($timeout) {
    return {
      restrict: 'A',
      link: function(scope, element) {
        // Add a delay to allow other asynchronous components to load.
        $timeout(function() {
          $(element).focus();
        }, 300);
      }
    };
  }]);
;'use strict';

angular.module('openshiftCommonUI')
  .directive('tileClick', function() {
    return {
      restrict: 'AC',
      link: function($scope, element) {
        $(element).click(function (evt) {
          // Don't trigger tile target if the user clicked directly on a link or button inside the tile or any child of a .tile-click-prevent element.
          var t = $(evt.target);
          if (t && (t.closest("a", element).length || t.closest("button", element).length) || t.closest(".tile-click-prevent", element).length) {
            return;
          }
          $('a.tile-target', element).trigger("click");
        });
      }
    };
  });
;'use strict';

angular.module('openshiftCommonUI')
  .directive('toastNotifications', ["NotificationsService", "$rootScope", "$timeout", function(NotificationsService, $rootScope, $timeout) {
    return {
      restrict: 'E',
      scope: {},
      templateUrl: 'src/components/toast-notifications/toast-notifications.html',
      link: function($scope) {
        $scope.notifications = [];

        // A notification is removed if it has hidden set and the user isn't
        // currently hovering over it.
        var isRemoved = function(notification) {
          return notification.hidden && !notification.isHover;
        };

        var removeNotification = function(notification) {
          notification.isHover = false;
          notification.hidden = true;
        };

        // Remove items that are now hidden to keep the array from growing
        // indefinitely. We loop over the entire array each digest loop, even
        // if everything is hidden, and any watch update triggers a new digest
        // loop. If the array grows large, it can hurt performance.
        var pruneRemovedNotifications = function() {
          $scope.notifications = _.reject($scope.notifications, isRemoved);
        };

        $scope.close = function(notification) {
          removeNotification(notification);
          if (_.isFunction(notification.onClose)) {
            notification.onClose();
          }
        };

        $scope.onClick = function(notification, link) {
          if (_.isFunction(link.onClick)) {
            // If onClick() returns true, also hide the alert.
            var close = link.onClick();
            if (close) {
              removeNotification(notification);
            }
          }
        };

        $scope.setHover = function(notification, isHover) {
          // Don't change anything if the notification was already removed.
          // Avoids a potential issue where the flag is reset during the slide
          // out animation.
          if (!isRemoved(notification)) {
            notification.isHover = isHover;
          }
        };

        // Listen for updates from NotificationsService to show a notification.
        var deregisterNotificationListener = $rootScope.$on('NotificationsService.onNotificationAdded', function(event, notification) {
          $scope.notifications.push(notification);
          if (NotificationsService.isAutoDismiss(notification)) {
            $timeout(function () {
              notification.hidden = true;
            }, NotificationsService.dismissDelay);
          }

          // Whenever we add a new notification, also remove any hidden toasts
          // so that the array doesn't grow indefinitely.
          pruneRemovedNotifications();
        });

        $scope.$on('$destroy', function() {
          if (deregisterNotificationListener) {
            deregisterNotificationListener();
            deregisterNotificationListener = null;
          }
        });
      }
    };
  }]);
;'use strict';

angular.module('openshiftCommonUI')
  // Truncates text to a length, adding a tooltip and an ellipsis if truncated.
  // Different than `text-overflow: ellipsis` because it allows for multiline text.
  .directive('truncateLongText', ["truncateFilter", function(truncateFilter) {
    return {
      restrict: 'E',
      scope: {
        content: '=',
        limit: '=',
        newlineLimit: '=',
        useWordBoundary: '=',
        expandable: '=',
        // When expandable is on, optionally hide the collapse link so text can only be expanded. (Used for toast notifications.)
        hideCollapse: '=',
        keywords: '=highlightKeywords',  // optional keywords to highlight using the `highlightKeywords` filter
        prettifyJson: '='                // prettifies JSON blobs when expanded, only used if expandable is true
      },
      templateUrl: 'src/components/truncate-long-text/truncateLongText.html',
      link: function(scope) {
        scope.toggles = {expanded: false};
        scope.$watch('content', function(content) {
          if (content) {
            scope.truncatedContent = truncateFilter(content, scope.limit, scope.useWordBoundary, scope.newlineLimit);
            scope.truncated = scope.truncatedContent.length !== content.length;
          }
          else {
            scope.truncatedContent = null;
            scope.truncated = false;
          }
        });
      }
    };
  }]);
;'use strict';

angular.module('openshiftCommonUI')
  .filter("alertStatus", function() {
    return function (type) {
      var status;

      switch(type) {
        case 'error':
          status = 'alert-danger';
          break;
        case 'warning':
          status = 'alert-warning';
          break;
        case 'success':
          status = 'alert-success';
          break;
        default:
          status = 'alert-info';
      }

      return status;
    };
  })
  .filter('alertIcon', function() {
    return function (type) {
      var icon;

      switch(type) {
        case 'error':
          icon = 'pficon pficon-error-circle-o';
          break;
        case 'warning':
          icon = 'pficon pficon-warning-triangle-o';
          break;
        case 'success':
          icon = 'pficon pficon-ok';
          break;
        default:
          icon = 'pficon pficon-info';
      }

      return icon;
    };
  });
;'use strict';
/* jshint unused: false */

angular.module('openshiftCommonUI')
  .filter('annotationName', function() {
    // This maps an annotation key to all known synonymous keys to insulate
    // the referring code from key renames across API versions.
    var annotationMap = {
      "buildConfig":              ["openshift.io/build-config.name"],
      "deploymentConfig":         ["openshift.io/deployment-config.name"],
      "deployment":               ["openshift.io/deployment.name"],
      "pod":                      ["openshift.io/deployer-pod.name"],
      "deployerPod":              ["openshift.io/deployer-pod.name"],
      "deployerPodFor":           ["openshift.io/deployer-pod-for.name"],
      "deploymentStatus":         ["openshift.io/deployment.phase"],
      "deploymentStatusReason":   ["openshift.io/deployment.status-reason"],
      "deploymentCancelled":      ["openshift.io/deployment.cancelled"],
      "encodedDeploymentConfig":  ["openshift.io/encoded-deployment-config"],
      "deploymentVersion":        ["openshift.io/deployment-config.latest-version"],
      "displayName":              ["openshift.io/display-name"],
      "description":              ["openshift.io/description"],
      "buildNumber":              ["openshift.io/build.number"],
      "buildPod":                 ["openshift.io/build.pod-name"],
      "jenkinsBuildURL":          ["openshift.io/jenkins-build-uri"],
      "jenkinsLogURL":            ["openshift.io/jenkins-log-url"],
      "jenkinsStatus":            ["openshift.io/jenkins-status-json"],
      "idledAt":                  ["idling.alpha.openshift.io/idled-at"],
      "idledPreviousScale":       ["idling.alpha.openshift.io/previous-scale"],
      "systemOnly":               ["authorization.openshift.io/system-only"]
    };
    return function(annotationKey) {
      return annotationMap[annotationKey] || null;
    };
  })
  .filter('annotation', ["annotationNameFilter", function(annotationNameFilter) {
    return function(resource, key) {
      if (resource && resource.metadata && resource.metadata.annotations) {
        // If the key's already in the annotation map, return it.
        if (resource.metadata.annotations[key] !== undefined) {
          return resource.metadata.annotations[key];
        }
        // Try and return a value for a mapped key.
        var mappings = annotationNameFilter(key) || [];
        for (var i=0; i < mappings.length; i++) {
          var mappedKey = mappings[i];
          if (resource.metadata.annotations[mappedKey] !== undefined) {
            return resource.metadata.annotations[mappedKey];
          }
        }
        // Couldn't find anything.
        return null;
      }
      return null;
    };
  }])
  .filter('imageStreamTagAnnotation', function() {
    // Look up annotations on ImageStream.spec.tags[tag].annotations
    return function(resource, key, /* optional */ tagName) {
      tagName = tagName || 'latest';
      if (resource && resource.spec && resource.spec.tags){
        var tags = resource.spec.tags;
        for(var i=0; i < _.size(tags); ++i){
          var tag = tags[i];
          if(tagName === tag.name && tag.annotations){
            return tag.annotations[key];
          }
        }
      }

      return null;
    };
  })
  .filter('imageStreamTagTags', ["imageStreamTagAnnotationFilter", function(imageStreamTagAnnotationFilter) {
    // Return ImageStream.spec.tag[tag].annotation.tags as an array
    return function(resource, /* optional */ tagName) {
      var imageTags = imageStreamTagAnnotationFilter(resource, 'tags', tagName);
      if (!imageTags) {
        return [];
      }

      return imageTags.split(/\s*,\s*/);
    };
  }])
  .filter('imageStreamTagIconClass', ["imageStreamTagAnnotationFilter", function(imageStreamTagAnnotationFilter) {
  return function(resource, /* optional */ tagName) {
    var icon = imageStreamTagAnnotationFilter(resource, "iconClass", tagName);
    return (icon) ? icon : "fa fa-cube";
  };
}]);
;'use strict';

angular
  .module('openshiftCommonUI')
  .filter('canI', ["AuthorizationService", function(AuthorizationService) {
    return function(resource, verb, projectName) {
      return AuthorizationService.canI(resource, verb, projectName);
    };
  }])
  .filter('canIAddToProject', ["AuthorizationService", function(AuthorizationService) {
    return function(namespace) {
      return AuthorizationService.canIAddToProject(namespace);
    };
  }]);
;'use strict';

angular.module('openshiftCommonUI')
  .filter('isNewerResource', function() {
    // Checks if candidate is newer than other.
    return function(candidate, other) {
      var candidateCreation = _.get(candidate, 'metadata.creationTimestamp');
      if (!candidateCreation) {
        return false;
      }

      var otherCreation = _.get(other, 'metadata.creationTimestamp');
      if (!otherCreation) {
        return true;
      }

      // The date format can be compared using straight string comparison.
      // Example Date: 2016-02-02T21:53:07Z
      return candidateCreation > otherCreation;
    };
  })
  .filter('mostRecent', ["isNewerResourceFilter", function(isNewerResourceFilter) {
    return function(objects) {
      var mostRecent = null;
      _.each(objects, function(object) {
        if (!mostRecent || isNewerResourceFilter(object, mostRecent)) {
          mostRecent = object;
        }
      });

      return mostRecent;
    };
  }])
  .filter('orderObjectsByDate', ["toArrayFilter", function(toArrayFilter) {
    return function(items, reverse) {
      items = toArrayFilter(items);

      /*
       * Note: This is a hotspot in our code. We sort frequently by date on
       *       the overview and browse pages.
       */

      items.sort(function (a, b) {
        if (!a.metadata || !a.metadata.creationTimestamp || !b.metadata || !b.metadata.creationTimestamp) {
          throw "orderObjectsByDate expects all objects to have the field metadata.creationTimestamp";
        }

        // The date format can be sorted using straight string comparison.
        // Compare as strings for performance.
        // Example Date: 2016-02-02T21:53:07Z
        if (a.metadata.creationTimestamp < b.metadata.creationTimestamp) {
          return reverse ? 1 : -1;
        }

        if (a.metadata.creationTimestamp > b.metadata.creationTimestamp) {
          return reverse ? -1 : 1;
        }

        return 0;
      });

      return items;
    };
  }]);
;'use strict';

angular.module('openshiftCommonUI')
  .filter('highlightKeywords', ["KeywordService", function(KeywordService) {
    // Returns HTML wrapping the matching words in a `mark` tag.
    return function(str, keywords, caseSensitive) {
      if (!str) {
        return str;
      }

      if (_.isEmpty(keywords)) {
        return _.escape(str);
      }

      // If passed a plain string, get the keywords from KeywordService.
      if (_.isString(keywords)) {
        keywords = KeywordService.generateKeywords(keywords);
      }

      // Combine the keywords into a single regex.
      var source = _.map(keywords, function(keyword) {
        if (_.isRegExp(keyword)) {
          return keyword.source;
        }
        return _.escapeRegExp(keyword);
      }).join('|');

      // Search for matches.
      var match;
      var result = '';
      var lastIndex = 0;
      var flags = caseSensitive ? 'g' : 'ig';
      var regex = new RegExp(source, flags);
      while ((match = regex.exec(str)) !== null) {
        // Escape any text between the end of the last match and the start of
        // this match, and add it to the result.
        if (lastIndex < match.index) {
          result += _.escape(str.substring(lastIndex, match.index));
        }

        // Wrap the match in a `mark` element to use the Bootstrap / Patternfly highlight styles.
        result += "<mark>" + _.escape(match[0]) + "</mark>";
        lastIndex = regex.lastIndex;
      }

      // Escape any remaining text and add it to the result.
      if (lastIndex < str.length) {
        result += _.escape(str.substring(lastIndex));
      }

      return result;
    };
  }]);
;'use strict';

angular.module('openshiftCommonUI')
// Usage: <span ng-bind-html="text | linkify : '_blank'"></span>
//
// Prefer this to the AngularJS `linky` filter since it only matches http and
// https URLs. We've had issues with incorretly matching email addresses.
//
// https://github.com/openshift/origin-web-console/issues/315
// See also HTMLService.linkify
.filter('linkify', ["HTMLService", function(HTMLService) {
  return function(text, target, alreadyEscaped) {
    return HTMLService.linkify(text, target, alreadyEscaped);
  };
}]);
;'use strict';

angular.module('openshiftCommonUI')
  .filter('parseJSON', function() {
    return function(json) {
      // return original value if its null or undefined
      if (!json) {
        return null;
      }

      // return the parsed obj if its valid
      try {
        var jsonObj = JSON.parse(json);
        if (typeof jsonObj === "object") {
          return jsonObj;
        }
        else {
          return null;
        }
      }
      catch (e) {
        // it wasn't valid json
        return null;
      }
    };
  });
;'use strict';

angular.module('openshiftCommonUI')
  .filter('prettifyJSON', ["parseJSONFilter", function(parseJSONFilter) {
    return function(json) {
      var jsonObj = parseJSONFilter(json);
      if (jsonObj) {
        return JSON.stringify(jsonObj, null, 4);
      }
      else {
        // it wasn't a json object, return the original value
        return json;
      }
    };
  }]);
;'use strict';
/* jshint unused: false */

angular.module('openshiftCommonUI')
  // this filter is intended for use with the "track by" in an ng-repeat
  // when uid is not defined it falls back to object identity for uniqueness
  .filter('uid', function() {
    return function(resource) {
      if (resource && resource.metadata && resource.metadata.uid) {
        return resource.metadata.uid;
      }
      else {
        return resource;
      }
    };
  })
  .filter('labelName', function() {
    var labelMap = {
      'buildConfig' : ["openshift.io/build-config.name"],
      'deploymentConfig' : ["openshift.io/deployment-config.name"]
    };
    return function(labelKey) {
      return labelMap[labelKey];
    };
  })
  .filter('description', ["annotationFilter", function(annotationFilter) {
    return function(resource) {
      // Prefer `openshift.io/description`, but fall back to `kubernetes.io/description`.
      // Templates use simply `description` without a namespace.
      return annotationFilter(resource, 'openshift.io/description') ||
             annotationFilter(resource, 'kubernetes.io/description') ||
             annotationFilter(resource, 'description');
    };
  }])
  .filter('displayName', ["annotationFilter", function(annotationFilter) {
    // annotationOnly - if true, don't fall back to using metadata.name when
    //                  there's no displayName annotation
    return function(resource, annotationOnly) {
      var displayName = annotationFilter(resource, "displayName");
      if (displayName || annotationOnly) {
        return displayName;
      }

      if (resource && resource.metadata) {
        return resource.metadata.name;
      }

      return null;
    };
  }])
  .filter('uniqueDisplayName', ["displayNameFilter", function(displayNameFilter){
    function countNames(projects){
      var nameCount = {};
      angular.forEach(projects, function(project, key){
        var displayName = displayNameFilter(project);
        nameCount[displayName] = (nameCount[displayName] || 0) + 1;
      });
      return nameCount;
    }
    return function (resource, projects){
      if (!resource) {
        return '';
      }
      var displayName = displayNameFilter(resource);
      var name = resource.metadata.name;
      if (displayName !== name && countNames(projects)[displayName] > 1 ){
        return displayName + ' (' + name + ')';
      }
      return displayName;
    };
  }])
  .filter('searchProjects', ["displayNameFilter", function(displayNameFilter) {
    return function(projects, text) {
      if (!text) {
        return projects;
      }

      // Lowercase the search string and project display name to perform a case-insensitive search.
      text = text.toLowerCase();
      return _.filter(projects, function(project) {
        if (_.includes(project.metadata.name, text)) {
          return true;
        }

        var displayName = displayNameFilter(project, true);
        if (displayName && _.includes(displayName.toLowerCase(), text)) {
          return true;
        }

        return false;
      });
    };
  }])
  .filter('label', function() {
    return function(resource, key) {
      if (resource && resource.metadata && resource.metadata.labels) {
        return resource.metadata.labels[key];
      }
      return null;
    };
  })
  .filter('humanizeKind', ["startCaseFilter", function (startCaseFilter) {
    // Changes "ReplicationController" to "replication controller".
    // If useTitleCase, returns "Replication Controller".
    return function(kind, useTitleCase) {
      if (!kind) {
        return kind;
      }

      var humanized = _.startCase(kind);
      if (useTitleCase) {
        return humanized;
      }

      return humanized.toLowerCase();
    };
  }])
  // gets the status condition that matches provided type
  // statusCondition(object, 'Ready')
  .filter('statusCondition', function() {
    return function(apiObject, type) {
      if (!apiObject) {
        return null;
      }

      return _.find(_.get(apiObject, 'status.conditions'), {type: type});
    };
  })
  .filter('isServiceInstanceReady', ["statusConditionFilter", function(statusConditionFilter) {
    return function(apiObject) {
      return _.get(statusConditionFilter(apiObject, 'Ready'), 'status') === 'True';
    };
  }])
  .filter('isBindingReady', ["isServiceInstanceReadyFilter", function(isServiceInstanceReadyFilter) {
    return isServiceInstanceReadyFilter;
  }])
  .filter('hasDeployment', ["annotationFilter", function(annotationFilter) {
    return function(object) {
      return !!annotationFilter(object, 'deployment.kubernetes.io/revision');
    };
  }])
  .filter('hasDeploymentConfig', ["annotationFilter", function(annotationFilter) {
    return function(deployment) {
      return !!annotationFilter(deployment, 'deploymentConfig');
    };
  }])
;
;'use strict';
angular.module('openshiftCommonUI')
  .filter('camelToLower', function() {
    return function(str) {
      if (!str) {
        return str;
      }

      // Use the special logic in _.startCase to handle camel case strings, kebab
      // case strings, snake case strings, etc.
      return _.startCase(str).toLowerCase();
    };
  })
  .filter('upperFirst', function() {
    // Uppercase the first letter of a string (without making any other changes).
    // Different than `capitalize` because it doesn't lowercase other letters.
    return function(str) {
      if (!str) {
        return str;
      }

      return str.charAt(0).toUpperCase() + str.slice(1);
    };
  })
  .filter('sentenceCase', ["camelToLowerFilter", "upperFirstFilter", function(camelToLowerFilter, upperFirstFilter) {
    // Converts a camel case string to sentence case
    return function(str) {
      if (!str) {
        return str;
      }

      // Unfortunately, _.lowerCase() and _.upperFirst() aren't in our lodash version.
      var lower = camelToLowerFilter(str);
      return upperFirstFilter(lower);
    };
  }])
  .filter('startCase', function () {
    return function(str) {
      if (!str) {
        return str;
      }

      // https://lodash.com/docs#startCase
      return _.startCase(str);
    };
  })
  .filter('capitalize', function() {
    return function(input) {
      return _.capitalize(input);
    };
  })
  .filter('isMultiline', function() {
    return function(str, ignoreTrailing) {
      if (!str) {
        return false;
      }

      var index = str.search(/\r|\n/);
      if (index === -1) {
        return false;
      }

      // Ignore a final, trailing newline?
      if (ignoreTrailing) {
        return index !== (str.length - 1);
      }

      return true;
    };
  });
;'use strict';

angular.module('openshiftCommonUI')
  .filter('truncate', function() {
    return function(str, charLimit, useWordBoundary, newlineLimit) {
      if (!str) {
        return str;
      }

      var truncated = str;

      if (charLimit) {
        truncated = truncated.substring(0, charLimit);
      }

      if (newlineLimit) {
        var nthNewline = str.split("\n", newlineLimit).join("\n").length;
        truncated = truncated.substring(0, nthNewline);
      }

      if (useWordBoundary !== false) {
        // Find the last word break, but don't look more than 10 characters back.
        // Make sure we show at least the first 5 characters.
        var startIndex = Math.max(4, charLimit - 10);
        var lastSpace = truncated.lastIndexOf(/\s/, startIndex);
        if (lastSpace !== -1) {
          truncated = truncated.substring(0, lastSpace);
        }
      }

      return truncated;
    };
  });
;'use strict';

angular.module('openshiftCommonUI')
  .filter("toArray", function() {
    return _.toArray;
  })
  .filter('size', function() {
    return _.size;
  })
  .filter('hashSize', ["$log", function($log) {
    return function(hash) {
      if (!hash) {
        return 0;
      }
      return Object.keys(hash).length;
    };
  }])
  // Wraps _.filter. Works with hashes, unlike ngFilter, which only works
  // with arrays.
  .filter('filterCollection', function() {
    return function(collection, predicate) {
      if (!collection || !predicate) {
        return collection;
      }
      return _.filter(collection, predicate);
    };
  })
  .filter('generateName', function() {
    return function(prefix, length) {
      if (!prefix) {
        prefix = "";
      }
      if (!length) {
        length = 5;
      }
      var randomString = Math.round((Math.pow(36, length + 1) - Math.random() * Math.pow(36, length))).toString(36).slice(1);
      return prefix + randomString;
    };
  })
  .filter("getErrorDetails", ["upperFirstFilter", function(upperFirstFilter) {
    return function(result, capitalize) {
      var error = result.data || {};
      if (error.message) {
        return capitalize ? upperFirstFilter(error.message) : error.message;
      }

      var status = result.status || error.status;
      if (status) {
        return "Status: " + status;
      }

      return "";
    };
  }]);
;'use strict';

angular.module("openshiftCommonServices")
  .service("AlertMessageService", function(){
    var alertHiddenKey = function(alertID, namespace) {
      if (!namespace) {
        return 'hide/alert/' + alertID;
      }

      return 'hide/alert/' + namespace + '/' + alertID;
    };
    return {
      isAlertPermanentlyHidden: function(alertID, namespace) {
        var key = alertHiddenKey(alertID, namespace);
        return localStorage.getItem(key) === 'true';
      },
      permanentlyHideAlert: function(alertID, namespace) {
        var key = alertHiddenKey(alertID,namespace);
        localStorage.setItem(key, 'true');
      }
    };
  });
;'use strict';

// ResourceGroupVersion represents a fully qualified resource
function ResourceGroupVersion(resource, group, version) {
  this.resource = resource;
  this.group    = group;
  this.version  = version;
  return this;
}
// toString() includes the group and version information if present
ResourceGroupVersion.prototype.toString = function() {
  var s = this.resource;
  if (this.group)   { s += "/" + this.group;   }
  if (this.version) { s += "/" + this.version; }
  return s;
};
// primaryResource() returns the resource with any subresources removed
ResourceGroupVersion.prototype.primaryResource = function() {
  if (!this.resource) { return ""; }
  var i = this.resource.indexOf('/');
  if (i === -1) { return this.resource; }
  return this.resource.substring(0,i);
};
// subresources() returns a (possibly empty) list of subresource segments
ResourceGroupVersion.prototype.subresources = function() {
  var segments = (this.resource || '').split("/");
  segments.shift();
  return segments;
};
// equals() returns true if the given resource, group, and version match.
// If omitted, group and version are not compared.
ResourceGroupVersion.prototype.equals = function(resource, group, version) {
  if (this.resource !== resource) { return false; }
  if (arguments.length === 1)     { return true;  }
  if (this.group !== group)       { return false; }
  if (arguments.length === 2)     { return true;  }
  if (this.version !== version)   { return false; }
  return true;
};

angular.module('openshiftCommonServices')
.factory('APIService', ["API_CFG", "APIS_CFG", "AuthService", "Constants", "Logger", "$q", "$http", "$filter", "$window", function(API_CFG,
                                APIS_CFG,
                                AuthService,
                                Constants,
                                Logger,
                                $q,
                                $http,
                                $filter,
                                $window) {
  // Set the default api versions the console will use if otherwise unspecified
  var defaultVersion = {
    "":           "v1",
    "extensions": "v1beta1"
  };

  // toResourceGroupVersion() returns a ResourceGroupVersion.
  // If resource is already a ResourceGroupVersion, returns itself.
  //
  // if r is a string, the empty group and default version for the empty group are assumed.
  //
  // if r is an object, the resource, group, and version attributes are read.
  // a missing group attribute defaults to the legacy group.
  // a missing version attribute defaults to the default version for the group, or undefined if the group is unknown.
  //
  // if r is already a ResourceGroupVersion, it is returned as-is
  var toResourceGroupVersion = function(r) {
    if (r instanceof ResourceGroupVersion) {
      return r;
    }
    var resource, group, version;
    if (angular.isString(r)) {
      resource = normalizeResource(r);
      group = '';
      version = defaultVersion[group];
    } else if (r && r.resource) {
      resource = normalizeResource(r.resource);
      group = r.group || '';
      version = r.version || defaultVersion[group] || _.get(APIS_CFG, ["groups", group, "preferredVersion"]);
    }
    return new ResourceGroupVersion(resource, group, version);
  };

  // normalizeResource lowercases the first segment of the given resource. subresources can be case-sensitive.
  function normalizeResource(resource) {
    if (!resource) {
      return resource;
    }
    var i = resource.indexOf('/');
    if (i === -1) {
      return resource.toLowerCase();
    }
    return resource.substring(0, i).toLowerCase() + resource.substring(i);
  }

  // port of group_version.go#ParseGroupVersion
  var parseGroupVersion = function(apiVersion) {
    if (!apiVersion) {
      return undefined;
    }
    var parts = apiVersion.split("/");
    if (parts.length === 1) {
      if (parts[0] === "v1") {
        return {group: '', version: parts[0]};
      }
      return {group: parts[0], version: ''};
    }
    if (parts.length === 2) {
      return {group:parts[0], version: parts[1]};
    }
    Logger.warn('Invalid apiVersion "' + apiVersion + '"');
    return undefined;
  };

  var objectToResourceGroupVersion = function(apiObject) {
    if (!apiObject || !apiObject.kind || !apiObject.apiVersion) {
      return undefined;
    }
    var resource = kindToResource(apiObject.kind);
    if (!resource) {
      return undefined;
    }
    var groupVersion = parseGroupVersion(apiObject.apiVersion);
    if (!groupVersion) {
      return undefined;
    }
    return new ResourceGroupVersion(resource, groupVersion.group, groupVersion.version);
  };

  // deriveTargetResource figures out the fully qualified destination to submit the object to.
  // if resource is a string, and the object's kind matches the resource, the object's group/version are used.
  // if resource is a ResourceGroupVersion, and the object's kind and group match, the object's version is used.
  // otherwise, resource is used as-is.
  var deriveTargetResource = function(resource, object) {
    if (!resource || !object) {
      return undefined;
    }
    var objectResource = kindToResource(object.kind);
    var objectGroupVersion = parseGroupVersion(object.apiVersion);
    var resourceGroupVersion = toResourceGroupVersion(resource);
    if (!objectResource || !objectGroupVersion || !resourceGroupVersion) {
      return undefined;
    }

    // We specified something like "pods"
    if (angular.isString(resource)) {
      // If the object had a matching kind {"kind":"Pod","apiVersion":"v1"}, use the group/version from the object
      if (resourceGroupVersion.equals(objectResource)) {
        resourceGroupVersion.group = objectGroupVersion.group;
        resourceGroupVersion.version = objectGroupVersion.version;
      }
      return resourceGroupVersion;
    }

    // If the resource was already a fully specified object,
    // require the group to match as well before taking the version from the object
    if (resourceGroupVersion.equals(objectResource, objectGroupVersion.group)) {
      resourceGroupVersion.version = objectGroupVersion.version;
    }
    return resourceGroupVersion;
  };

  // port of restmapper.go#kindToResource
  // humanize will add spaces between words in the resource
  function kindToResource(kind, humanize) {
    if (!kind) {
      return "";
    }
    var resource = kind;
    if (humanize) {
      var humanizeKind = $filter("humanizeKind");
      resource = humanizeKind(resource);
    }
    resource = String(resource).toLowerCase();
    if (resource === 'endpoints' || resource === 'securitycontextconstraints') {
      // no-op, plural is the singular
    }
    else if (resource[resource.length-1] === 's') {
      resource = resource + 'es';
    }
    else if (resource[resource.length-1] === 'y') {
      resource = resource.substring(0, resource.length-1) + 'ies';
    }
    else {
      resource = resource + 's';
    }

    return resource;
  }

  function kindToResourceGroupVersion(kind) {
    return toResourceGroupVersion({
      resource: kindToResource(kind.kind),
      group: kind.group
    });
  }

  // apiInfo returns the host/port, prefix, group, and version for the given resource,
  // or undefined if the specified resource/group/version is known not to exist.
  var apiInfo = function(resource) {
    // If API discovery had any failures, calls to api info should redirect to the error page
    if (APIS_CFG.API_DISCOVERY_ERRORS) {
      var possibleCertFailure  = _.every(APIS_CFG.API_DISCOVERY_ERRORS, function(error){
        return _.get(error, "data.status") === 0;
      });
      if (possibleCertFailure && !AuthService.isLoggedIn()) {
        // will trigger a login flow which will redirect to the api server
        AuthService.withUser();
        return;
      }
      // Otherwise go to the error page, the server might be down.  Can't use Navigate.toErrorPage or it will create a circular dependency
      $window.location.href = URI('error').query({
        error_description: "Unable to load details about the server. If the problem continues, please contact your system administrator.",
        error: "API_DISCOVERY"
      }).toString();
      return;
    }

    resource = toResourceGroupVersion(resource);
    var primaryResource = resource.primaryResource();
    var discoveredResource;
    // API info for resources in an API group, if the resource was not found during discovery return undefined
    if (resource.group) {
      discoveredResource = _.get(APIS_CFG, ["groups", resource.group, "versions", resource.version, "resources", primaryResource]);
      if (!discoveredResource) {
        return undefined;
      }
      var hostPrefixObj = _.get(APIS_CFG, ["groups", resource.group, 'hostPrefix']) || APIS_CFG;
      return {
        resource: resource.resource,
        group:    resource.group,
        version:  resource.version,
        protocol: hostPrefixObj.protocol,
        hostPort: hostPrefixObj.hostPort,
        prefix:   hostPrefixObj.prefix,
        namespaced: discoveredResource.namespaced,
        verbs: discoveredResource.verbs
      };
    }

    // Resources without an API group could be legacy k8s or origin resources.
    // Scan through resources to determine which this is.
    var api;
    for (var apiName in API_CFG) {
      api = API_CFG[apiName];
      discoveredResource = _.get(api, ["resources", resource.version, primaryResource]);
      if (!discoveredResource) {
        continue;
      }
      return {
        resource: resource.resource,
        version:  resource.version,
        hostPort: api.hostPort,
        prefix:   api.prefix,
        namespaced: discoveredResource.namespaced,
        verbs: discoveredResource.verbs
      };
    }
    return undefined;
  };

  var invalidObjectKindOrVersion = function(apiObject) {
    var kind = "<none>";
    var version = "<none>";
    if (apiObject && apiObject.kind)       { kind    = apiObject.kind;       }
    if (apiObject && apiObject.apiVersion) { version = apiObject.apiVersion; }
    return "Invalid kind ("+kind+") or API version ("+version+")";
  };
  var unsupportedObjectKindOrVersion = function(apiObject) {
    var kind = "<none>";
    var version = "<none>";
    if (apiObject && apiObject.kind)       { kind    = apiObject.kind;       }
    if (apiObject && apiObject.apiVersion) { version = apiObject.apiVersion; }
    return "The API version "+version+" for kind " + kind + " is not supported by this server";
  };

  // Returns an array of available kinds, including their group
  var calculateAvailableKinds = function(includeClusterScoped) {
    var kinds = [];
    var rejectedKinds = _.map(Constants.AVAILABLE_KINDS_BLACKLIST, function(kind) {
      return _.isString(kind) ?
              { kind: kind, group: '' } :
              kind;
    });


    // ignore the legacy openshift kinds, these have been migrated to api groups
    _.each(_.pick(API_CFG, function(value, key) {
      return key !== 'openshift';
    }), function(api) {
      _.each(api.resources.v1, function(resource) {
        if (resource.namespaced || includeClusterScoped) {
          // Exclude subresources and any rejected kinds
          if (_.contains(resource.name, '/') || _.find(rejectedKinds, { kind: resource.kind, group: '' })) {
            return;
          }

          kinds.push({
            kind: resource.kind,
            group:  ''
          });
        }
      });
    });

   // Kinds under api groups
    _.each(APIS_CFG.groups, function(group) {
      // Use the console's default version first, and the server's preferred version second
      var preferredVersion = defaultVersion[group.name] || group.preferredVersion;
      _.each(group.versions[preferredVersion].resources, function(resource) {
        // Exclude subresources and any rejected kinds
        if (_.contains(resource.name, '/') || _.find(rejectedKinds, {kind: resource.kind, group: group.name})) {
          return;
        }

        // Exclude duplicate kinds we know about that map to the same storage as another group/kind
        // This is unusual, so we are special casing these
        if (group.name === "extensions" && resource.kind === "HorizontalPodAutoscaler") {
          return;
        }

        if (resource.namespaced || includeClusterScoped) {
          kinds.push({
            kind: resource.kind,
            group: group.name
          });
        }
      });
    });

    return _.uniq(kinds, false, function(value) {
      return value.group + "/" + value.kind;
    });
  };

  var namespacedKinds = calculateAvailableKinds(false);
  var allKinds = calculateAvailableKinds(true);

  var availableKinds = function(includeClusterScoped) {
    return includeClusterScoped ? allKinds : namespacedKinds;
  };

  return {
    toResourceGroupVersion: toResourceGroupVersion,

    parseGroupVersion: parseGroupVersion,

    objectToResourceGroupVersion: objectToResourceGroupVersion,

    deriveTargetResource: deriveTargetResource,

    kindToResource: kindToResource,

    kindToResourceGroupVersion: kindToResourceGroupVersion,

    apiInfo: apiInfo,

    invalidObjectKindOrVersion: invalidObjectKindOrVersion,
    unsupportedObjectKindOrVersion: unsupportedObjectKindOrVersion,
    availableKinds: availableKinds
  };
}]);
;'use strict';

angular.module('openshiftCommonServices')
// In a config step, set the desired user store and login service. For example:
//   AuthServiceProvider.setUserStore('LocalStorageUserStore')
//   AuthServiceProvider.setLoginService('RedirectLoginService')
//
// AuthService provides the following functions:
//   withUser()
//     returns a promise that resolves when there is a current user
//     starts a login if there is no current user
//   setUser(user, token[, ttl])
//     sets the current user and token to use for authenticated requests
//     if ttl is specified, it indicates how many seconds the user and token are valid
//     triggers onUserChanged callbacks if the new user is different than the current user
//   requestRequiresAuth(config)
//     returns true if the request is to a protected URL
//   addAuthToRequest(config)
//     adds auth info to the request, if available
//     if specified, uses config.auth.token as the token, otherwise uses the token store
//   startLogin()
//     returns a promise that is resolved when the login is complete
//   onLogin(callback)
//     the given callback is called whenever a login is completed
//   onUserChanged(callback)
//     the given callback is called whenever the current user changes
.provider('AuthService', function() {
  var _userStore = "";
  this.UserStore = function(userStoreName) {
    if (userStoreName) {
      _userStore = userStoreName;
    }
    return _userStore;
  };
  var _loginService = "";
  this.LoginService = function(loginServiceName) {
    if (loginServiceName) {
      _loginService = loginServiceName;
    }
    return _loginService;
  };
  var _logoutService = "";
  this.LogoutService = function(logoutServiceName) {
    if (logoutServiceName) {
      _logoutService = logoutServiceName;
    }
    return _logoutService;
  };

  var loadService = function(injector, name, setter) {
  	if (!name) {
  	  throw setter + " not set";
  	} else if (angular.isString(name)) {
  	  return injector.get(name);
  	} else {
  	  return injector.invoke(name);
  	}
  };

  this.$get = ["$q", "$injector", "$log", "$rootScope", "Logger", "base64", function($q, $injector, $log, $rootScope, Logger, base64) {
    var authLogger = Logger.get("auth");
    authLogger.log('AuthServiceProvider.$get', arguments);

    var _loginCallbacks = $.Callbacks();
    var _logoutCallbacks = $.Callbacks();
    var _userChangedCallbacks = $.Callbacks();

    var _loginPromise = null;
    var _logoutPromise = null;

    var userStore = loadService($injector, _userStore, "AuthServiceProvider.UserStore()");
    if (!userStore.available()) {
      Logger.error("AuthServiceProvider.$get user store " + _userStore + " not available");
    }
    var loginService = loadService($injector, _loginService, "AuthServiceProvider.LoginService()");
    var logoutService = loadService($injector, _logoutService, "AuthServiceProvider.LogoutService()");

    return {

      // Returns the configured user store
      UserStore: function() {
        return userStore;
      },

      // Returns true if currently logged in.
      isLoggedIn: function() {
        return !!userStore.getUser();
      },

      // Returns a promise of a user, which is resolved with a logged in user. Triggers a login if needed.
      withUser: function() {
        var user = userStore.getUser();
        if (user) {
          $rootScope.user = user;
          authLogger.log('AuthService.withUser()', user);
          return $q.when(user);
        } else {
          authLogger.log('AuthService.withUser(), calling startLogin()');
          return this.startLogin();
        }
      },

      setUser: function(user, token, ttl) {
        authLogger.log('AuthService.setUser()', user, token, ttl);
        var oldUser = userStore.getUser();
        userStore.setUser(user, ttl);
        userStore.setToken(token, ttl);

        $rootScope.user = user;

        var oldName = oldUser && oldUser.metadata && oldUser.metadata.name;
        var newName = user    && user.metadata    && user.metadata.name;
        if (oldName !== newName) {
          authLogger.log('AuthService.setUser(), user changed', oldUser, user);
          _userChangedCallbacks.fire(user);
        }
      },

      requestRequiresAuth: function(config) {
        var requiresAuth = !!config.auth;
        authLogger.log('AuthService.requestRequiresAuth()', config.url.toString(), requiresAuth);
        return requiresAuth;
      },
      addAuthToRequest: function(config) {
        // Use the given token, if provided
        var token = "";
        if (config && config.auth && config.auth.token) {
          token = config.auth.token;
          authLogger.log('AuthService.addAuthToRequest(), using token from request config', token);
        } else {
          token = userStore.getToken();
          authLogger.log('AuthService.addAuthToRequest(), using token from user store', token);
        }
        if (!token) {
          authLogger.log('AuthService.addAuthToRequest(), no token available');
          return false;
        }

        // Handle web socket requests with a parameter
        if (config.method === 'WATCH') {
          // Ensure protocols is defined
          config.protocols = config.protocols || [];

          // Ensure protocols is an array
          if (!_.isArray(config.protocols)) {
            config.protocols = [config.protocols];
          }

          // Ensure protocols has at least one item in it (for the server to echo back once the bearer protocol is stripped out)
          if (config.protocols.length == 0) {
            config.protocols.unshift("undefined");
          }

          // Prepend the bearer token protocol
          config.protocols.unshift("base64url.bearer.authorization.k8s.io."+base64.urlencode(token));

          authLogger.log('AuthService.addAuthToRequest(), added token protocol', config.protocols);
        } else {
          config.headers["Authorization"] = "Bearer " + token;
          authLogger.log('AuthService.addAuthToRequest(), added token header', config.headers["Authorization"]);
        }
        return true;
      },

      startLogin: function() {
        if (_loginPromise) {
          authLogger.log("Login already in progress");
          return _loginPromise;
        }
        var self = this;
        _loginPromise = loginService.login().then(function(result) {
          self.setUser(result.user, result.token, result.ttl);
          _loginCallbacks.fire(result.user);
        }).catch(function(err) {
          Logger.error(err);
        }).finally(function() {
          _loginPromise = null;
        });
        return _loginPromise;
      },

      startLogout: function() {
        if (_logoutPromise) {
          authLogger.log("Logout already in progress");
          return _logoutPromise;
        }
        var self = this;
        var user = userStore.getUser();
        var token = userStore.getToken();
        var wasLoggedIn = this.isLoggedIn();
        _logoutPromise = logoutService.logout(user, token).then(function() {
          authLogger.log("Logout service success");
        }).catch(function(err) {
          authLogger.error("Logout service error", err);
        }).finally(function() {
          // Clear the user and token
          self.setUser(null, null);
          // Make sure isLoggedIn() returns false before we fire logout callbacks
          var isLoggedIn = self.isLoggedIn();
          // Only fire logout callbacks if we transitioned from a logged in state to a logged out state
          if (wasLoggedIn && !isLoggedIn) {
            _logoutCallbacks.fire();
          }
          _logoutPromise = null;
        });
        return _logoutPromise;
      },

      // TODO: add a way to unregister once we start doing in-page logins
      onLogin: function(callback) {
        _loginCallbacks.add(callback);
      },
      // TODO: add a way to unregister once we start doing in-page logouts
      onLogout: function(callback) {
        _logoutCallbacks.add(callback);
      },
      // TODO: add a way to unregister once we start doing in-page user changes
      onUserChanged: function(callback) {
        _userChangedCallbacks.add(callback);
      }
    };
  }];
})
// register the interceptor as a service
.factory('AuthInterceptor', ['$q', 'AuthService', function($q, AuthService) {
  var pendingRequestConfigs = [];
  // TODO: subscribe to user change events to empty the saved configs
  // TODO: subscribe to login events to retry the saved configs

  return {
    // If auth is not needed, or is already present, returns a config
    // If auth is needed and not present, starts a login flow and returns a promise of a config
    request: function(config) {
      // Requests that don't require auth can continue
      if (!AuthService.requestRequiresAuth(config)) {
        // console.log("No auth required", config.url);
        return config;
      }

      // If we could add auth info, we can continue
      if (AuthService.addAuthToRequest(config)) {
        // console.log("Auth added", config.url);
        return config;
      }

      // We should have added auth info, but couldn't

      // If we were specifically told not to trigger a login, return
      if (config.auth && config.auth.triggerLogin === false) {
        return config;
      }

      // 1. Set up a deferred and remember this config, so we can add auth info and resume once login is complete
      var deferred = $q.defer();
      pendingRequestConfigs.push([deferred, config, 'request']);
      // 2. Start the login flow
      AuthService.startLogin();
      // 3. Return the deferred's promise
      return deferred.promise;
    },

    responseError: function(rejection) {
      var authConfig = rejection.config.auth || {};

      // Requests that didn't require auth can continue
      if (!AuthService.requestRequiresAuth(rejection.config)) {
        // console.log("No auth required", rejection.config.url);
        return $q.reject(rejection);
      }

      // If we were specifically told not to trigger a login, return
      if (authConfig.triggerLogin === false) {
        return $q.reject(rejection);
      }

      // detect if this is an auth error (401) or other error we should trigger a login flow for
      var status = rejection.status;
      switch (status) {
        case 401:
          // console.log('responseError', status);
          // 1. Set up a deferred and remember this config, so we can add auth info and retry once login is complete
          var deferred = $q.defer();
          pendingRequestConfigs.push([deferred, rejection.config, 'responseError']);
          // 2. Start the login flow
          AuthService.startLogin();
          // 3. Return the deferred's promise
          return deferred.promise;
        default:
          return $q.reject(rejection);
      }
    }
  };
}]);
;'use strict';

angular.module("openshiftCommonServices")
  .factory("AuthorizationService", ["$q", "$cacheFactory", "Logger", "$interval", "APIService", "DataService", function($q, $cacheFactory, Logger, $interval, APIService, DataService){

    var currentProject = null;
    var cachedRulesByProject = $cacheFactory('rulesCache', {
          number: 10
        });
    // Permisive mode will cause no checks to be done for the user actions.
    var permissiveMode = false;

    var REVIEW_RESOURCES = ["localresourceaccessreviews", "localsubjectaccessreviews", "resourceaccessreviews", "selfsubjectaccessreviews", "selfsubjectrulesreviews", "subjectaccessreviews"];

    // Transform data from:
    // rules = {resources: ["jobs"], apiGroups: ["extensions"], verbs:["create","delete","get","list","update"]}
    // into:
    // normalizedRules = {"extensions": {"jobs": ["create","delete","get","list","update"]}}
    var normalizeRules = function(rules) {
      var normalizedRules = {};
      _.each(rules, function(rule) {
        _.each(rule.apiGroups, function(apiGroup) {
          if (!normalizedRules[apiGroup]) {
            normalizedRules[apiGroup] = {};
          }
          _.each(rule.resources, function(resource) {
            normalizedRules[apiGroup][resource] = rule.verbs;
          });
        });
      });
      return normalizedRules;
    };

    // Check if resource name meets one of following conditions, since those resources can't be create/update via `Add to project` page:
    //  - 'projectrequests'
    //  - subresource that contains '/', eg: 'builds/source', 'builds/logs', ...
    //  - resource is in REVIEW_RESOURCES list
    var checkResource = function(resource) {
      if (resource === "projectrequests" || _.contains(resource, "/") || _.contains(REVIEW_RESOURCES, resource)) {
        return false;
      } else {
        return true;
      }
    };

    // Check if user can create/update any resource on the 'Add to project' so the button will be displayed.
    var canAddToProjectCheck = function(rules) {
      return _.some(rules, function(rule) {
        return _.some(rule.resources, function(resource) {
          return checkResource(resource) && !_.isEmpty(_.intersection(rule.verbs ,(["*", "create", "update"])));
        });
      });
    };

    // forceRefresh is a boolean to bust the cache & request new perms
    var getProjectRules = function(projectName, forceRefresh) {
      var deferred = $q.defer();
      currentProject = projectName;
      var projectRules = cachedRulesByProject.get(projectName);
      var rulesResource = "selfsubjectrulesreviews";
      if (!projectRules || projectRules.forceRefresh || forceRefresh) {
        // Check if APIserver contains 'selfsubjectrulesreviews' resource. If not switch to permissive mode.
        if (APIService.apiInfo(rulesResource)) {
          Logger.log("AuthorizationService, loading user rules for " + projectName + " project");
          var object = {kind: "SelfSubjectRulesReview",
                        apiVersion: "v1"
                      };
          DataService.create(rulesResource, null, object, {namespace: projectName}).then(
            function(data) {
              var normalizedData = normalizeRules(data.status.rules);
              var canUserAddToProject = canAddToProjectCheck(data.status.rules);
              cachedRulesByProject.put(projectName, {rules: normalizedData,
                                                      canAddToProject: canUserAddToProject,
                                                      forceRefresh: false,
                                                      cacheTimestamp: _.now()
                                                    });
              deferred.resolve();
            }, function() {
              permissiveMode = true;
              deferred.resolve();
          });
        } else {
          Logger.log("AuthorizationService, resource 'selfsubjectrulesreviews' is not part of APIserver. Switching into permissive mode.");
          permissiveMode = true;
          deferred.resolve();
        }
      } else {
        // Using cached data.
        Logger.log("AuthorizationService, using cached rules for " + projectName + " project");
        if ((_.now() - projectRules.cacheTimestamp) >= 600000) {
          projectRules.forceRefresh = true;
        }
        deferred.resolve();
      }
      return deferred.promise;
    };

    var getRulesForProject = function(projectName) {
      return _.get(cachedRulesByProject.get(projectName || currentProject), ['rules']);
    };

    // _canI checks whether any rule allows the specified verb (directly or via a wildcard verb) on the literal group and resource.
    var _canI = function(rules, verb, group, resource) {
      var resources = rules[group];
      if (!resources) {
        return false;
      }
      var verbs = resources[resource];
      if (!verbs) {
        return false;
      }
      return _.contains(verbs, verb) || _.contains(verbs, '*');
    };

    // canI checks whether any rule allows the specified verb on the specified group-resource (directly or via a wildcard rule).
    var canI = function(resource, verb, projectName) {
      if (permissiveMode) {
        return true;
      }

      // normalize to structured form
      var r = APIService.toResourceGroupVersion(resource);
      var rules = getRulesForProject(projectName || currentProject);
      if (!rules) {
        return false;
      }
      return _canI(rules, verb, r.group, r.resource) ||
             _canI(rules, verb, '*',     '*'       ) ||
             _canI(rules, verb, r.group, '*'       ) ||
             _canI(rules, verb, '*',     r.resource);
    };

    var canIAddToProject = function(projectName) {
      if (permissiveMode) {
        return true;
      } else {
        return !!_.get(cachedRulesByProject.get(projectName || currentProject), ['canAddToProject']);
      }
    };

    return {
      checkResource: checkResource,
      getProjectRules: getProjectRules,
      canI: canI,
      canIAddToProject: canIAddToProject,
      getRulesForProject: getRulesForProject
    };
  }]);
;'use strict';

angular.module('openshiftCommonServices')
  .factory('base64util', function() {
    return {
      pad: function(data){
        if (!data) { return ""; }
        switch (data.length % 4) {
          case 1:  return data + "===";
          case 2:  return data + "==";
          case 3:  return data + "=";
          default: return data;
        }
      }
    };
  });
;'use strict';

angular.module("openshiftCommonServices")
  .service("BindingService",
           ["$filter", "$q", "AuthService", "DataService", "DNS1123_SUBDOMAIN_VALIDATION", function($filter,
                    $q,
                    AuthService,
                    DataService,
                    DNS1123_SUBDOMAIN_VALIDATION) {
    var bindingResource = {
      group: 'servicecatalog.k8s.io',
      resource: 'bindings'
    };

    var getServiceClassForInstance = function(serviceInstance, serviceClasses) {
      var serviceClassName = _.get(serviceInstance, 'spec.serviceClassName');
      return _.get(serviceClasses, [serviceClassName]);
    };

    var getPlanForInstance = function(serviceInstance, serviceClass) {
      var planName = _.get(serviceInstance, 'spec.planName');
      return _.find(serviceClass.plans, { name: planName });
    };

    var getBindParameters = function(serviceInstance, serviceClass) {
      var plan = getPlanForInstance(serviceInstance, serviceClass);
      if (_.has(plan, ['alphaBindingCreateParameterSchema', 'properties', 'template.openshift.io/requester-username'])) {
        return AuthService.withUser().then(function(user) {
          return {
            'template.openshift.io/requester-username': user.metadata.name
          };
        });
      }

      return $q.when({});
    };

    var generateName = $filter('generateName');
    var makeBinding = function (serviceInstance, application, parameters) {
      var instanceName = serviceInstance.metadata.name;
      var relatedObjName = generateName(_.trunc(instanceName, DNS1123_SUBDOMAIN_VALIDATION.maxlength - 6) + '-');
      var binding = {
        kind: 'Binding',
        apiVersion: 'servicecatalog.k8s.io/v1alpha1',
        metadata: {
          generateName: instanceName + '-'
        },
        spec: {
          instanceRef: {
            name: instanceName
          },
          secretName: relatedObjName
        }
      };

      if (!_.isEmpty(parameters)) {
        binding.spec.parameters = parameters;
      }

      var appSelector = _.get(application, 'spec.selector');
      if (appSelector) {
        if (!appSelector.matchLabels && !appSelector.matchExpressions) {
          // Then this is the old format of selector, pod preset requires the new format
          appSelector = {
            matchLabels: appSelector
          };
        }
        binding.spec.alphaPodPresetTemplate = {
          name: relatedObjName,
          selector: appSelector
        };
      }

      return binding;
    };

    return {
      bindingResource: bindingResource,
      getServiceClassForInstance: getServiceClassForInstance,

      // Create a binding for `serviceInstance`. If an `application` API object
      // is specified, also create a pod preset for that application using its
      // `spec.selector`. `serviceClass` is required to determine if any
      // parameters need to be set when creating the binding.
      bindService: function(serviceInstance, application, serviceClass) {
        return getBindParameters(serviceInstance, serviceClass).then(function (parameters) {
          var newBinding = makeBinding(serviceInstance, application, parameters);
          var context = {
            namespace: serviceInstance.metadata.namespace
          };
          return DataService.create(bindingResource, null, newBinding, context);
        });
      },

      isServiceBindable: function(serviceInstance, serviceClasses) {
        var serviceClass = getServiceClassForInstance(serviceInstance, serviceClasses);
        if (!serviceClass) {
          return !!serviceInstance;
        }

        var plan = getPlanForInstance(serviceInstance, serviceClass);
        var planBindable = _.get(plan, 'bindable');
        if (planBindable === true) {
          return true;
        }
        if (planBindable === false) {
          return false;
        }

        // If `plan.bindable` is not set, fall back to `serviceClass.bindable`.
        return serviceClass.bindable;
      }
    };
  }]);
;'use strict';

angular.module('openshiftCommonServices')
  .factory('Constants', function() {
    var constants = _.clone(window.OPENSHIFT_CONSTANTS || {});
    var version = _.clone(window.OPENSHIFT_VERSION || {});
    constants.VERSION = version;
    return constants;
  });
;'use strict';
/* jshint eqeqeq: false, unused: false, expr: true */

angular.module('openshiftCommonServices')
.factory('DataService', ["$cacheFactory", "$http", "$ws", "$rootScope", "$q", "API_CFG", "APIService", "Logger", "$timeout", "base64", "base64util", function($cacheFactory, $http, $ws, $rootScope, $q, API_CFG, APIService, Logger, $timeout, base64, base64util) {

  function Data(array) {
    this._data = {};
    this._objectsByAttribute(array, "metadata.name", this._data);
  }

  Data.prototype.by = function(attr) {
    // TODO store already generated indices
    if (attr === "metadata.name") {
      return this._data;
    }
    var map = {};
    for (var key in this._data) {
      _objectByAttribute(this._data[key], attr, map, null);
    }
    return map;

  };

  Data.prototype.update = function(object, action) {
    _objectByAttribute(object, "metadata.name", this._data, action);
  };


  // actions is whether the object was (ADDED|DELETED|MODIFIED).  ADDED is assumed if actions is not
  // passed.  If objects is a hash then actions must be a hash with the same keys.  If objects is an array
  // then actions must be an array of the same order and length.
  Data.prototype._objectsByAttribute = function(objects, attr, map, actions) {
    angular.forEach(objects, function(obj, key) {
      _objectByAttribute(obj, attr, map, actions ? actions[key] : null);
    });
  };

  // Handles attr with dot notation
  // TODO write lots of tests for this helper
  // Note: this lives outside the Data prototype for now so it can be used by the helper in DataService as well
  function _objectByAttribute(obj, attr, map, action) {
    var subAttrs = attr.split(".");
    var attrValue = obj;
    for (var i = 0; i < subAttrs.length; i++) {
      attrValue = attrValue[subAttrs[i]];
      if (attrValue === undefined) {
        return;
      }
    }

    if ($.isArray(attrValue)) {
      // TODO implement this when we actually need it
    }
    else if ($.isPlainObject(attrValue)) {
      for (var key in attrValue) {
        var val = attrValue[key];
        if (!map[key]) {
          map[key] = {};
        }
        if (action === "DELETED") {
          delete map[key][val];
        }
        else {
          map[key][val] = obj;
        }
      }
    }
    else {
      if (action === "DELETED") {
        delete map[attrValue];
      }
      else {
        map[attrValue] = obj;
      }
    }
  }

  function DataService() {
    this._listDeferredMap = {};
    this._watchCallbacksMap = {};
    this._watchObjectCallbacksMap = {};
    this._watchOperationMap = {};
    this._listOperationMap = {};
    this._resourceVersionMap = {};
    this._dataCache = $cacheFactory('dataCache', {
      // 25 is a reasonable number to keep at least one or two projects worth of data in cache
      number: 25
    });
    this._immutableDataCache = $cacheFactory('immutableDataCache', {
      // 50 is a reasonable number for the immutable resources that are stored per resource instead of grouped by type
      number: 50
    });
    this._watchOptionsMap = {};
    this._watchWebsocketsMap = {};
    this._watchPollTimeoutsMap = {};
    this._websocketEventsMap = {};

    var self = this;
    $rootScope.$on( "$routeChangeStart", function(event, next, current) {
      self._websocketEventsMap = {};
    });
  }

// resource:  API resource (e.g. "pods")
// context:   API context (e.g. {project: "..."})
// callback:  (optional) function to be called with the list of the requested resource and context,
//            parameters passed to the callback:
//            Data:   a Data object containing the (context-qualified) results
//                    which includes a helper method for returning a map indexed
//                    by attribute (e.g. data.by('metadata.name'))
// opts:      http - options to pass to the inner $http call
//
// returns a promise
  DataService.prototype.list = function(resource, context, callback, opts) {
    resource = APIService.toResourceGroupVersion(resource);
    var key = this._uniqueKey(resource, null, context, _.get(opts, 'http.params'));
    var deferred = this._listDeferred(key);
    if (callback) {
      deferred.promise.then(callback);
    }

    if (this._isCached(key)) {
      // A watch operation is running, and we've already received the
      // initial set of data for this resource
      deferred.resolve(this._data(key));
    }
    else if (this._listInFlight(key)) {
      // no-op, our callback will get called when listOperation completes
    }
    else {
      this._startListOp(resource, context, opts);
    }
    return deferred.promise;
  };

// resource:  API resource (e.g. "pods")
// name:      API name, the unique name for the object
// context:   API context (e.g. {project: "..."})
// opts:
//   http - options to pass to the inner $http call
//   gracePeriodSeconds - duration in seconds to wait before deleting the resource
// Returns a promise resolved with response data or rejected with {data:..., status:..., headers:..., config:...} when the delete call completes.
  DataService.prototype.delete = function(resource, name, context, opts) {
    resource = APIService.toResourceGroupVersion(resource);
    opts = opts || {};
    var deferred = $q.defer();
    var self = this;
    var data, headers = {};
    var data = {
      kind: "DeleteOptions",
      apiVersion: "v1"
    };
    if (_.has(opts, 'propagationPolicy')) {
      // Use a has check so that explicitly setting propagationPolicy to null passes through and doesn't fallback to default behavior
      data.propagationPolicy = opts.propagationPolicy;
    }
    else {
      // Default to "Foreground" (cascading) if no propagationPolicy was given.
      data.propagationPolicy = 'Foreground';
    }
    var headers = {
      'Content-Type': 'application/json'
    };
    // Differentiate between 0 and undefined
    if (_.has(opts, 'gracePeriodSeconds')) {
      data.gracePeriodSeconds = opts.gracePeriodSeconds;
    }
    this._getNamespace(resource, context, opts).then(function(ns){
      $http(angular.extend({
        method: 'DELETE',
        auth: {},
        data: data,
        headers: headers,
        url: self._urlForResource(resource, name, context, false, ns)
      }, opts.http || {}))
      .success(function(data, status, headerFunc, config, statusText) {
        deferred.resolve(data);
      })
      .error(function(data, status, headers, config) {
        deferred.reject({
          data: data,
          status: status,
          headers: headers,
          config: config
        });
      });
    });
    return deferred.promise;
  };


// resource:  API resource (e.g. "pods")
// name:      API name, the unique name for the object
// object:    API object data(eg. { kind: "Build", parameters: { ... } } )
// context:   API context (e.g. {project: "..."})
// opts:      http - options to pass to the inner $http call
// Returns a promise resolved with response data or rejected with {data:..., status:..., headers:..., config:...} when the delete call completes.
  DataService.prototype.update = function(resource, name, object, context, opts) {
    resource = APIService.deriveTargetResource(resource, object);
    opts = opts || {};
    var deferred = $q.defer();
    var self = this;
    this._getNamespace(resource, context, opts).then(function(ns){
      $http(angular.extend({
        method: 'PUT',
        auth: {},
        data: object,
        url: self._urlForResource(resource, name, context, false, ns)
      }, opts.http || {}))
      .success(function(data, status, headerFunc, config, statusText) {
        deferred.resolve(data);
      })
      .error(function(data, status, headers, config) {
        deferred.reject({
          data: data,
          status: status,
          headers: headers,
          config: config
        });
      });
    });
    return deferred.promise;
  };

// TODO: Enable PATCH when it's added to CORS Access-Control-Allow-Methods

// resource:  API resource group version object (e.g. { group: "", resource: "pods", version: "v1" }).
//            Must be the full resource group version because it can't be derived from the patch object.
// name:      API name, the unique name for the object
// object:    API object data(eg. { kind: "Build", parameters: { ... } } )
// context:   API context (e.g. {project: "..."})
// opts:      http - options to pass to the inner $http call
// Returns a promise resolved with response data or rejected with {data:..., status:..., headers:..., config:...} when the delete call completes.
// DataService.prototype.patch = function(resourceGroupVersion, name, object, context, opts) {
//   opts = opts || {};
//   var deferred = $q.defer();
//   var self = this;
//   this._getNamespace(resourceGroupVersion, context, opts).then(function(ns){
//     $http(angular.extend({
//       method: 'PATCH',
//       auth: {},
//       data: object,
//       url: self._urlForResource(resourceGroupVersion, name, context, false, ns)
//     }, opts.http || {}))
//     .success(function(data, status, headerFunc, config, statusText) {
//       deferred.resolve(data);
//     })
//     .error(function(data, status, headers, config) {
//       deferred.reject({
//         data: data,
//         status: status,
//         headers: headers,
//         config: config
//       });
//     });
//   });
//   return deferred.promise;
// };

// resource:  API resource (e.g. "pods")
// name:      API name, the unique name for the object.
//            In case the name of the Object is provided, expected format of 'resource' parameter is 'resource/subresource', eg: 'buildconfigs/instantiate'.
// object:    API object data(eg. { kind: "Build", parameters: { ... } } )
// context:   API context (e.g. {project: "..."})
// opts:      http - options to pass to the inner $http call
// Returns a promise resolved with response data or rejected with {data:..., status:..., headers:..., config:...} when the delete call completes.
  DataService.prototype.create = function(resource, name, object, context, opts) {
    resource = APIService.deriveTargetResource(resource, object);
    opts = opts || {};
    var deferred = $q.defer();
    var self = this;
    this._getNamespace(resource, context, opts).then(function(ns){
      $http(angular.extend({
        method: 'POST',
        auth: {},
        data: object,
        url: self._urlForResource(resource, name, context, false, ns)
      }, opts.http || {}))
      .success(function(data, status, headerFunc, config, statusText) {
        deferred.resolve(data);
      })
      .error(function(data, status, headers, config) {
        deferred.reject({
          data: data,
          status: status,
          headers: headers,
          config: config
        });
      });
    });
    return deferred.promise;
  };

  // objects:   Array of API object data(eg. [{ kind: "Build", parameters: { ... } }] )
  // context:   API context (e.g. {project: "..."})
  // opts:      action - defines the REST action that will be called
  //                   - available actions: create, update
  //            http - options to pass to the inner $http call
  // Returns a promise resolved with an an object like: { success: [], failure: [] }
  // where success and failure contain an array of results from the individual
  // create calls.
  DataService.prototype.batch = function(objects, context, action, opts) {
    var deferred = $q.defer();
    var successResults = [];
    var failureResults = [];
    var self = this;
    var remaining = objects.length;
    action = action || 'create';

    function _checkDone() {
      if (remaining === 0) {
        deferred.resolve({ success: successResults, failure: failureResults });
      }
    }

    _.each(objects, function(object) {
      var resource = APIService.objectToResourceGroupVersion(object);
      if (!resource) {
        // include the original object, so the error handler can display the kind/name
        failureResults.push({object: object, data: {message: APIService.invalidObjectKindOrVersion(object)}});
        remaining--;
        _checkDone();
        return;
      }
      if (!APIService.apiInfo(resource)) {
        // include the original object, so the error handler can display the kind/name
        failureResults.push({object: object, data: {message: APIService.unsupportedObjectKindOrVersion(object)}});
        remaining--;
        _checkDone();
        return;
      }

      var success = function(data) {
        // include the original object, so the error handler can display the kind/name
        data.object = object;
        successResults.push(data);
        remaining--;
        _checkDone();
      };
      var failure = function(data) {
        // include the original object, so the handler can display the kind/name
        data.object = object;
        failureResults.push(data);
        remaining--;
        _checkDone();
      };

      switch(action) {
      case "create":
        self.create(resource, null, object, context, opts).then(success, failure);
        break;
      case "update":
        self.update(resource, object.metadata.name, object, context, opts).then(success, failure);
        break;
      default:
        // default case to prevent unspecified actions and typos
        return deferred.reject({
          data: "Invalid '" + action + "'  action.",
          status: 400,
          headers: function() { return null; },
          config: {},
          object: object
        });
      }
    });
    return deferred.promise;
  };

// resource:  API resource (e.g. "pods")
// name:      API name, the unique name for the object
// context:   API context (e.g. {project: "..."})
// opts:      force - always request (default is false)
//            http - options to pass to the inner $http call
//            errorNotification - will popup an error notification if the API request fails (default true)
  DataService.prototype.get = function(resource, name, context, opts) {
    resource = APIService.toResourceGroupVersion(resource);
    opts = opts || {};
    var key = this._uniqueKey(resource, name, context, _.get(opts, 'http.params'));
    var force = !!opts.force;
    delete opts.force;

    var deferred = $q.defer();

    var existingImmutableData = this._immutableData(key);

    // special case, if we have an immutable item, we can return it immediately
    if (this._hasImmutable(resource, existingImmutableData, name)) {
      $timeout(function() {
        // we can be guaranteed this wont change on us, just send what we have in existingData
        deferred.resolve(existingImmutableData.by('metadata.name')[name]);
      }, 0);
    }
    else {
      var self = this;
      this._getNamespace(resource, context, opts).then(function(ns){
        $http(angular.extend({
          method: 'GET',
          auth: {},
          url: self._urlForResource(resource, name, context, false, ns)
        }, opts.http || {}))
        .success(function(data, status, headerFunc, config, statusText) {
          if (self._isImmutable(resource)) {
            if (!existingImmutableData) {
              self._immutableData(key, [data]);
            }
            else {
              existingImmutableData.update(data, "ADDED");
            }
          }
          deferred.resolve(data);
        })
        .error(function(data, status, headers, config) {
          if (opts.errorNotification !== false) {
            var msg = "Failed to get " + resource + "/" + name;
            if (status !== 0) {
              msg += " (" + status + ")";
            }
            // Use `$rootScope.$emit` instead of NotificationsService directly
            // so that DataService doesn't add a dependency on `openshiftCommonUI`
            $rootScope.$emit('NotificationsService.addNotification', {
              type: 'error',
              message: msg
            });
          }
          deferred.reject({
            data: data,
            status: status,
            headers: headers,
            config: config
          });
        });
      });
    }
    return deferred.promise;
  };

// TODO (bpeterse): Create a new Streamer service & get this out of DataService.
DataService.prototype.createStream = function(resource, name, context, opts, isRaw) {
  var self = this;
  resource = APIService.toResourceGroupVersion(resource);

  var protocols = isRaw ? 'binary.k8s.io' : 'base64.binary.k8s.io';
  var identifier = 'stream_';
  var openQueue = {};
  var messageQueue = {};
  var closeQueue = {};
  var errorQueue = {};

  var stream;
  var makeStream = function() {
     return self._getNamespace(resource, context, {})
                .then(function(params) {
                  var cumulativeBytes = 0;
                  return  $ws({
                            url: self._urlForResource(resource, name, context, true, _.extend(params, opts)),
                            auth: {},
                            onopen: function(evt) {
                              _.each(openQueue, function(fn) {
                                fn(evt);
                              });
                            },
                            onmessage: function(evt) {
                              if(!_.isString(evt.data)) {
                                Logger.log('log stream response is not a string', evt.data);
                                return;
                              }

                              var message;
                              if(!isRaw) {
                                message = base64.decode(base64util.pad(evt.data));
                                // Count bytes for log streams, which will stop when limitBytes is reached.
                                // There's no other way to detect we've reach the limit currently.
                                cumulativeBytes += message.length;
                              }

                              _.each(messageQueue, function(fn) {
                                if(isRaw) {
                                  fn(evt.data);
                                } else {
                                  fn(message, evt.data, cumulativeBytes);
                                }
                              });
                            },
                            onclose: function(evt) {
                              _.each(closeQueue, function(fn) {
                                fn(evt);
                              });
                            },
                            onerror: function(evt) {
                              _.each(errorQueue, function(fn) {
                                fn(evt);
                              });
                            },
                            protocols: protocols
                          }).then(function(ws) {
                            Logger.log("Streaming pod log", ws);
                            return ws;
                          });
                });
  };
  return {
    onOpen: function(fn) {
      if(!_.isFunction(fn)) {
        return;
      }
      var id = _.uniqueId(identifier);
      openQueue[id] = fn;
      return id;
    },
    onMessage: function(fn) {
      if(!_.isFunction(fn)) {
        return;
      }
      var id = _.uniqueId(identifier);
      messageQueue[id] = fn;
      return id;
    },
    onClose: function(fn) {
      if(!_.isFunction(fn)) {
        return;
      }
      var id = _.uniqueId(identifier);
      closeQueue[id] = fn;
      return id;
    },
    onError: function(fn) {
      if(!_.isFunction(fn)) {
        return;
      }
      var id = _.uniqueId(identifier);
      errorQueue[id] = fn;
      return id;
    },
    // can remove any callback from open, message, close or error
    remove: function(id) {
      if (openQueue[id]) { delete openQueue[id]; }
      if (messageQueue[id]) { delete messageQueue[id]; }
      if (closeQueue[id]) { delete closeQueue[id]; }
      if (errorQueue[id]) { delete errorQueue[id]; }
    },
    start: function() {
      stream = makeStream();
      return stream;
    },
    stop: function() {
      stream.then(function(ws) {
        ws.close();
      });
    }
  };
};


// resource:  API resource (e.g. "pods")
// context:   API context (e.g. {project: "..."})
// callback:  optional function to be called with the initial list of the requested resource,
//            and when updates are received, parameters passed to the callback:
//            Data:   a Data object containing the (context-qualified) results
//                    which includes a helper method for returning a map indexed
//                    by attribute (e.g. data.by('metadata.name'))
//            event:  specific event that caused this call ("ADDED", "MODIFIED",
//                    "DELETED", or null) callbacks can optionally use this to
//                    more efficiently process updates
//            obj:    specific object that caused this call (may be null if the
//                    entire list was updated) callbacks can optionally use this
//                    to more efficiently process updates
// opts:      options
//            poll:   true | false - whether to poll the server instead of opening
//                    a websocket. Default is false.
//            pollInterval: in milliseconds, how long to wait between polling the server
//                    only applies if poll=true.  Default is 5000.
//            http:   similar to .get, etc. at this point, only used to pass http.params for filtering
//            errorNotification: will popup an error notification if the API request fails (default true)
// returns handle to the watch, needed to unwatch e.g.
//        var handle = DataService.watch(resource,context,callback[,opts])
//        DataService.unwatch(handle)
  DataService.prototype.watch = function(resource, context, callback, opts) {
    resource = APIService.toResourceGroupVersion(resource);
    opts = opts || {};
    var key = this._uniqueKey(resource, null, context, _.get(opts, 'http.params'));
    if (callback) {
      // If we were given a callback, add it
      this._watchCallbacks(key).add(callback);
    }
    else if (!this._watchCallbacks(key).has()) {
      // We can be called with no callback in order to re-run a list/watch sequence for existing callbacks
      // If there are no existing callbacks, return
      return {};
    }

    var existingWatchOpts = this._watchOptions(key);
    if (existingWatchOpts) {
      // Check any options for compatibility with existing watch
      if (!!existingWatchOpts.poll !== !!opts.poll) { // jshint ignore:line
        throw "A watch already exists for " + resource + " with a different polling option.";
      }
    }
    else {
      this._watchOptions(key, opts);
    }

    var self = this;
    if (this._isCached(key)) {
      if (callback) {
        $timeout(function() {
          callback(self._data(key));
        }, 0);
      }
    }
    else {
      if (callback) {
        var resourceVersion = this._resourceVersion(key);
        if (this._data(key)) {
          $timeout(function() {
            // If the cached data is still the latest that we have, send it to the callback
            if (resourceVersion === self._resourceVersion(key)) {
              callback(self._data(key)); // but just in case, still pull from the current data map
            }
          }, 0);
        }
      }
      if (!this._listInFlight(key)) {
        this._startListOp(resource, context, opts);
      }
    }

    // returned handle needs resource, context, and callback in order to unwatch
    return {
      resource: resource,
      context: context,
      callback: callback,
      opts: opts
    };
  };



// resource:  API resource (e.g. "pods")
// name:      API name, the unique name for the object
// context:   API context (e.g. {project: "..."})
// callback:  optional function to be called with the initial list of the requested resource,
//            and when updates are received, parameters passed to the callback:
//            obj:    the requested object
//            event:  specific event that caused this call ("ADDED", "MODIFIED",
//                    "DELETED", or null) callbacks can optionally use this to
//                    more efficiently process updates
// opts:      options
//            poll:   true | false - whether to poll the server instead of opening
//                    a websocket. Default is false.
//            pollInterval: in milliseconds, how long to wait between polling the server
//                    only applies if poll=true.  Default is 5000.
//
// returns handle to the watch, needed to unwatch e.g.
//        var handle = DataService.watch(resource,context,callback[,opts])
//        DataService.unwatch(handle)
  DataService.prototype.watchObject = function(resource, name, context, callback, opts) {
    resource = APIService.toResourceGroupVersion(resource);
    opts = opts || {};
    var key = this._uniqueKey(resource, name, context, _.get(opts, 'http.params'));
    var wrapperCallback;
    if (callback) {
      // If we were given a callback, add it
      this._watchObjectCallbacks(key).add(callback);
      var self = this;
      wrapperCallback = function(items, event, item) {
        // If we got an event for a single item, only fire the callback if its the item we care about
        if (item && item.metadata.name === name) {
          self._watchObjectCallbacks(key).fire(item, event);
        }
        else if (!item) {
          // Otherwise its an initial listing, see if we can find the item we care about in the list
          var itemsByName = items.by("metadata.name");
          if (itemsByName[name]) {
            self._watchObjectCallbacks(key).fire(itemsByName[name]);
          }
        }
      };
    }
    else if (!this._watchObjectCallbacks(key).has()) {
      // This block may not be needed yet, don't expect this would get called without a callback currently...
      return {};
    }

    // For now just watch the type, eventually we may want to do something more complicated
    // and watch just the object if the type is not already being watched
    var handle = this.watch(resource, context, wrapperCallback, opts);
    handle.objectCallback = callback;
    handle.objectName = name;

    return handle;
  };

  DataService.prototype.unwatch = function(handle) {
    var resource = handle.resource;
    var objectName = handle.objectName;
    var context = handle.context;
    var callback = handle.callback;
    var objectCallback = handle.objectCallback;
    var opts = handle.opts;
    var key = this._uniqueKey(resource, null, context, _.get(opts, 'http.params'));

    if (objectCallback && objectName) {
      var objectKey = this._uniqueKey(resource, objectName, context, _.get(opts, 'http.params'));
      var objCallbacks = this._watchObjectCallbacks(objectKey);
      objCallbacks.remove(objectCallback);
    }

    var callbacks = this._watchCallbacks(key);
    if (callback) {
      callbacks.remove(callback);
    }
    if (!callbacks.has()) {
      if (opts && opts.poll) {
        clearTimeout(this._watchPollTimeouts(key));
        this._watchPollTimeouts(key, null);
      }
      else if (this._watchWebsockets(key)){
        // watchWebsockets may not have been set up yet if the projectPromise never resolves
        var ws = this._watchWebsockets(key);
        // Make sure the onclose listener doesn't reopen this websocket.
        ws.shouldClose = true;
        ws.close();
        this._watchWebsockets(key, null);
      }

      this._watchInFlight(key, false);
      this._watchOptions(key, null);
    }
  };

  // Takes an array of watch handles and unwatches them
  DataService.prototype.unwatchAll = function(handles) {
    for (var i = 0; i < handles.length; i++) {
      this.unwatch(handles[i]);
    }
  };

  DataService.prototype._watchCallbacks = function(key) {
    if (!this._watchCallbacksMap[key]) {
      this._watchCallbacksMap[key] = $.Callbacks();
    }
    return this._watchCallbacksMap[key];
  };

  DataService.prototype._watchObjectCallbacks = function(key) {
    if (!this._watchObjectCallbacksMap[key]) {
      this._watchObjectCallbacksMap[key] = $.Callbacks();
    }
    return this._watchObjectCallbacksMap[key];
  };

  DataService.prototype._listDeferred = function(key) {
    if (!this._listDeferredMap[key]) {
      this._listDeferredMap[key] = $q.defer();
    }
    return this._listDeferredMap[key];
  };

  DataService.prototype._watchInFlight = function(key, op) {
    if (!op && op !== false) {
      return this._watchOperationMap[key];
    }
    else {
      this._watchOperationMap[key] = op;
    }
  };

  DataService.prototype._listInFlight = function(key, op) {
    if (!op && op !== false) {
      return this._listOperationMap[key];
    }
    else {
      this._listOperationMap[key] = op;
    }
  };

  DataService.prototype._resourceVersion = function(key, rv) {
    if (!rv) {
      return this._resourceVersionMap[key];
    }
    else {
      this._resourceVersionMap[key] = rv;
    }
  };

  // uses $cacheFactory to impl LRU cache
  DataService.prototype._data = function(key, data) {
    return data ?
           this._dataCache.put(key, new Data(data)) :
           this._dataCache.get(key);
  };

    // uses $cacheFactory to impl LRU cache
  DataService.prototype._immutableData = function(key, data) {
    return data ?
           this._immutableDataCache.put(key, new Data(data)) :
           this._immutableDataCache.get(key);
  };

  DataService.prototype._isCached = function(key) {
    return this._watchInFlight(key) &&
           this._resourceVersion(key) &&
           (!!this._data(key));
  };

  DataService.prototype._watchOptions = function(key, opts) {
    if (opts === undefined) {
      return this._watchOptionsMap[key];
    }
    else {
      this._watchOptionsMap[key] = opts;
    }
  };

  DataService.prototype._watchPollTimeouts = function(key, timeout) {
    if (!timeout) {
      return this._watchPollTimeoutsMap[key];
    }
    else {
      this._watchPollTimeoutsMap[key] = timeout;
    }
  };

  DataService.prototype._watchWebsockets = function(key, timeout) {
    if (!timeout) {
      return this._watchWebsocketsMap[key];
    }
    else {
      this._watchWebsocketsMap[key] = timeout;
    }
  };

  // Maximum number of websocket events to track per resource/context in _websocketEventsMap.
  var maxWebsocketEvents = 10;

  DataService.prototype._addWebsocketEvent = function(key, eventType) {
    var events = this._websocketEventsMap[key];
    if (!events) {
      events = this._websocketEventsMap[key] = [];
    }

    // Add the event to the end of the array with the time in millis.
    events.push({
      type: eventType,
      time: Date.now()
    });

    // Only keep 10 events. Shift the array to make room for the new event.
    while (events.length > maxWebsocketEvents) { events.shift(); }
  };

  function isTooManyRecentEvents(events) {
    // If we've had more than 10 events in 30 seconds, stop.
    // The oldest event is at index 0.
    var recentDuration = 1000 * 30;
    return events.length >= maxWebsocketEvents && (Date.now() - events[0].time) < recentDuration;
  }

  function isTooManyConsecutiveCloses(events) {
    var maxConsecutiveCloseEvents = 5;
    if (events.length < maxConsecutiveCloseEvents) {
      return false;
    }

    // Make sure the last 5 events were not close events, which means the
    // connection is not succeeding. This check is necessary if connection
    // timeouts take longer than 6 seconds.
    for (var i = events.length - maxConsecutiveCloseEvents; i < events.length; i++) {
      if (events[i].type !== 'close') {
        return false;
      }
    }

    return true;
  }

  DataService.prototype._isTooManyWebsocketRetries = function(key) {
    var events = this._websocketEventsMap[key];
    if (!events) {
      return false;
    }

    if (isTooManyRecentEvents(events)) {
      Logger.log("Too many websocket open or close events for resource/context in a short period", key, events);
      return true;
    }

    if (isTooManyConsecutiveCloses(events)) {
      Logger.log("Too many consecutive websocket close events for resource/context", key, events);
      return true;
    }

    return false;
  };


  // will take an object, filter & sort it for consistent unique key generation
  // uses encodeURIComponent internally because keys can have special characters, such as '='
  var paramsForKey = function(params) {
    var keys = _.keysIn(
                  _.pick(
                    params,
                    ['fieldSelector', 'labelSelector'])
                ).sort();
    return _.reduce(
            keys,
            function(result, key, i) {
              return result + key + '=' + encodeURIComponent(params[key]) +
                      ((i < (keys.length-1)) ? '&' : '');
            }, '?');

  };


  // - creates a unique key representing a resource in its context (project)
  //    - primary use case for caching
  //    - proxies to _urlForResource to generate unique keys
  // - ensure namespace if available
  // - ensure only witelisted url params used for keys (fieldSelector, labelSelector) via paramsForKey
  //   and that these are consistently ordered
  // - NOTE: Do not use the key as your url for API requests. This function does not use the 'isWebsocket'
  //         bool.  Both websocket & http operations should respond with the same data from cache if key matches
  //         so the unique key will always include http://
  DataService.prototype._uniqueKey = function(resource, name, context, params) {
    var ns = context && context.namespace ||
             _.get(context, 'project.metadata.name') ||
             context.projectName;
    return this._urlForResource(resource, name, context, null, angular.extend({}, {}, {namespace: ns})).toString() + paramsForKey(params || {});
  };


  DataService.prototype._startListOp = function(resource, context, opts) {
    opts = opts || {};
    var key = this._uniqueKey(resource, null, context, _.get(opts, 'http.params'));
    // mark the operation as in progress
    this._listInFlight(key, true);

    var self = this;
    if (context.projectPromise && !resource.equals("projects")) {
      context.projectPromise.done(function(project) {
        $http(angular.extend({
          method: 'GET',
          auth: {},
          url: self._urlForResource(resource, null, context, false, {namespace: project.metadata.name})
        }, opts.http || {}))
        .success(function(data, status, headerFunc, config, statusText) {
          self._listOpComplete(key, resource, context, opts, data);
        }).error(function(data, status, headers, config) {
          // mark list op as complete
          self._listInFlight(key, false);
          var deferred = self._listDeferred(key);
          delete self._listDeferredMap[key];
          deferred.reject(data, status, headers, config);

          if (!_.get(opts, 'errorNotification', true)) {
            return;
          }

          var msg = "Failed to list " + resource;
          if (status !== 0) {
            msg += " (" + status + ")";
          }
          // Use `$rootScope.$emit` instead of NotificationsService directly
          // so that DataService doesn't add a dependency on `openshiftCommonUI`
          $rootScope.$emit('NotificationsService.addNotification', {
            type: 'error',
            message: msg
          });
        });
      });
    }
    else {
      $http({
        method: 'GET',
        auth: {},
        url: this._urlForResource(resource, null, context),
      }).success(function(data, status, headerFunc, config, statusText) {
        self._listOpComplete(key, resource, context, opts, data);
      }).error(function(data, status, headers, config) {
        // mark list op as complete
        self._listInFlight(key, false);
        var deferred = self._listDeferred(key);
        delete self._listDeferredMap[key];
        deferred.reject(data, status, headers, config);

        if (!_.get(opts, 'errorNotification', true)) {
          return;
        }

        var msg = "Failed to list " + resource;
        if (status !== 0) {
          msg += " (" + status + ")";
        }
        // Use `$rootScope.$emit` instead of NotificationsService directly
        // so that DataService doesn't add a dependency on `openshiftCommonUI`
        $rootScope.$emit('NotificationsService.addNotification', {
          type: 'error',
          message: msg
        });
      });
    }
  };

  DataService.prototype._listOpComplete = function(key, resource, context, opts, data) {
    if (!data.items) {
      console.warn("List request for " + resource + " returned a null items array.  This is an invalid API response.");
    }
    var items = data.items || [];
    // Here we normalize all items to have a kind property.
    // One of the warts in the kubernetes REST API is that items retrieved
    // via GET on a list resource won't have a kind property set.
    // See: https://github.com/kubernetes/kubernetes/issues/3030
    if (data.kind && data.kind.indexOf("List") === data.kind.length - 4) {
      angular.forEach(items, function(item) {
        if (!item.kind) {
          item.kind = data.kind.slice(0, -4);
        }
        if (!item.apiVersion) {
          item.apiVersion = data.apiVersion;
        }
      });
    }

    // mark list op as complete
    this._listInFlight(key, false);
    var deferred = this._listDeferred(key);
    delete this._listDeferredMap[key];

    this._resourceVersion(key, data.resourceVersion || data.metadata.resourceVersion);
    this._data(key, items);
    deferred.resolve(this._data(key));
    this._watchCallbacks(key).fire(this._data(key));

    if (this._watchCallbacks(key).has()) {
      var watchOpts = this._watchOptions(key) || {};
      if (watchOpts.poll) {
        this._watchInFlight(key, true);
        this._watchPollTimeouts(key, setTimeout($.proxy(this, "_startListOp", resource, context), watchOpts.pollInterval || 5000));
      }
      else if (!this._watchInFlight(key)) {
        this._startWatchOp(key, resource, context, opts, this._resourceVersion(key));
      }
    }
  };

  DataService.prototype._startWatchOp = function(key, resource, context, opts, resourceVersion) {
    this._watchInFlight(key, true);
    // Note: current impl uses one websocket per resource
    // eventually want a single websocket connection that we
    // send a subscription request to for each resource

    // Only listen for updates if websockets are available
    if ($ws.available()) {
      var self = this;
      var params =  _.get(opts, 'http.params') || {};
      params.watch = true;
      if (resourceVersion) {
        params.resourceVersion = resourceVersion;
      }
      if (context.projectPromise && !resource.equals("projects")) {
        context.projectPromise.done(function(project) {
          params.namespace = project.metadata.name;
          $ws({
            method: "WATCH",
            url: self._urlForResource(resource, null, context, true, params),
            auth:      {},
            onclose:   $.proxy(self, "_watchOpOnClose",   resource, context, opts),
            onmessage: $.proxy(self, "_watchOpOnMessage", resource, context, opts),
            onopen:    $.proxy(self, "_watchOpOnOpen",    resource, context, opts)
          }).then(function(ws) {
            Logger.log("Watching", ws);
            self._watchWebsockets(key, ws);
          });
        });
      }
      else {
        $ws({
          method: "WATCH",
          url: self._urlForResource(resource, null, context, true, params),
          auth:      {},
          onclose:   $.proxy(self, "_watchOpOnClose",   resource, context, opts),
          onmessage: $.proxy(self, "_watchOpOnMessage", resource, context, opts),
          onopen:    $.proxy(self, "_watchOpOnOpen",    resource, context, opts)
        }).then(function(ws){
          Logger.log("Watching", ws);
          self._watchWebsockets(key, ws);
        });
      }
    }
  };

  DataService.prototype._watchOpOnOpen = function(resource, context, opts, event) {
    Logger.log('Websocket opened for resource/context', resource, context);
    var key = this._uniqueKey(resource, null, context, _.get(opts, 'http.params'));
    this._addWebsocketEvent(key, 'open');
  };

  DataService.prototype._watchOpOnMessage = function(resource, context, opts, event) {
    var key = this._uniqueKey(resource, null, context, _.get(opts, 'http.params'));
    try {
      var eventData = $.parseJSON(event.data);

      if (eventData.type == "ERROR") {
        Logger.log("Watch window expired for resource/context", resource, context);
        if (event.target) {
          event.target.shouldRelist = true;
        }
        return;
      }
      else if (eventData.type === "DELETED") {
        // Add this ourselves since the API doesn't add anything
        // this way the views can use it to trigger special behaviors
        if (eventData.object && eventData.object.metadata && !eventData.object.metadata.deletionTimestamp) {
          eventData.object.metadata.deletionTimestamp = (new Date()).toISOString();
        }
      }

      if (eventData.object) {
        this._resourceVersion(key, eventData.object.resourceVersion || eventData.object.metadata.resourceVersion);
      }
      // TODO do we reset all the by() indices, or simply update them, since we should know what keys are there?
      // TODO let the data object handle its own update
      this._data(key).update(eventData.object, eventData.type);
      var self = this;
      // Wrap in a $timeout which will trigger an $apply to mirror $http callback behavior
      // without timeout this is triggering a repeated digest loop
      $timeout(function() {
        self._watchCallbacks(key).fire(self._data(key), eventData.type, eventData.object);
      }, 0);
    }
    catch (e) {
      // TODO: surface in the UI?
      Logger.error("Error processing message", resource, event.data);
    }
  };

  DataService.prototype._watchOpOnClose = function(resource, context, opts, event) {
    var eventWS = event.target;
    var key = this._uniqueKey(resource, null, context, _.get(opts, 'http.params'));

    if (!eventWS) {
      Logger.log("Skipping reopen, no eventWS in event", event);
      return;
    }

    var registeredWS = this._watchWebsockets(key);
    if (!registeredWS) {
      Logger.log("Skipping reopen, no registeredWS for resource/context", resource, context);
      return;
    }

    // Don't reopen a web socket that is no longer registered for this resource/context
    if (eventWS !== registeredWS) {
      Logger.log("Skipping reopen, eventWS does not match registeredWS", eventWS, registeredWS);
      return;
    }

    // We are the registered web socket for this resource/context, and we are no longer in flight
    // Unlock this resource/context in case we decide not to reopen
    this._watchInFlight(key, false);

    // Don't reopen web sockets we closed ourselves
    if (eventWS.shouldClose) {
      Logger.log("Skipping reopen, eventWS was explicitly closed", eventWS);
      return;
    }

    // Don't reopen clean closes (for example, navigating away from the page to example.com)
    if (event.wasClean) {
      Logger.log("Skipping reopen, clean close", event);
      return;
    }

    // Don't reopen if no one is listening for this data any more
    if (!this._watchCallbacks(key).has()) {
      Logger.log("Skipping reopen, no listeners registered for resource/context", resource, context);
      return;
    }

    // Don't reopen if we've failed this resource/context too many times
    if (this._isTooManyWebsocketRetries(key)) {
      // Show an error notication unless disabled in opts.
      if (_.get(opts, 'errorNotification', true)) {
        // Use `$rootScope.$emit` instead of NotificationsService directly
        // so that DataService doesn't add a dependency on `openshiftCommonUI`
        $rootScope.$emit('NotificationsService.addNotification', {
          id: 'websocket_retry_halted',
          type: 'error',
          message: 'Server connection interrupted.',
          links: [{
            label: 'Refresh',
            onClick: function() {
              window.location.reload();
            }
          }]
        });
      }
      return;
    }

    // Keep track of this event.
    this._addWebsocketEvent(key, 'close');

    // If our watch window expired, we have to relist to get a new resource version to watch from
    if (eventWS.shouldRelist) {
      Logger.log("Relisting for resource/context", resource, context);
      // Restart a watch() from the beginning, which triggers a list/watch sequence
      // The watch() call is responsible for setting _watchInFlight back to true
      // Add a short delay to avoid a scenario where we make non-stop requests
      // When the timeout fires, if no callbacks are registered for this
      //   resource/context, or if a watch is already in flight, `watch()` is a no-op
      var self = this;
      setTimeout(function() {
        self.watch(resource, context);
      }, 2000);
      return;
    }

    // Attempt to re-establish the connection after a two-second back-off
    // Re-mark ourselves as in-flight to prevent other callers from jumping in in the meantime
    Logger.log("Rewatching for resource/context", resource, context);
    this._watchInFlight(key, true);
    setTimeout(
      $.proxy(this, "_startWatchOp", key, resource, context, opts, this._resourceVersion(key)),
      2000
    );
  };

  var URL_ROOT_TEMPLATE         = "{protocol}://{+hostPort}{+prefix}{/group}/{version}/";
  var URL_GET_LIST              = URL_ROOT_TEMPLATE + "{resource}{?q*}";
  var URL_OBJECT                = URL_ROOT_TEMPLATE + "{resource}/{name}{/subresource*}{?q*}";
  var URL_NAMESPACED_GET_LIST   = URL_ROOT_TEMPLATE + "namespaces/{namespace}/{resource}{?q*}";
  var URL_NAMESPACED_OBJECT     = URL_ROOT_TEMPLATE + "namespaces/{namespace}/{resource}/{name}{/subresource*}{?q*}";


  DataService.prototype._urlForResource = function(resource, name, context, isWebsocket, params) {
    var apiInfo = APIService.apiInfo(resource);
    if (!apiInfo) {
      Logger.error("_urlForResource called with unknown resource", resource, arguments);
      return null;
    }

    var serviceProtocol = apiInfo.protocol || window.location.protocol;
    var protocol;
    params = params || {};
    if (isWebsocket) {
      protocol = serviceProtocol === "http:" ? "ws" : "wss";
    }
    else {
      protocol = serviceProtocol === "http:" ? "http" : "https";
    }

    if (context && context.namespace && !params.namespace) {
      params.namespace = context.namespace;
    }

    if (apiInfo.namespaced && !params.namespace) {
      Logger.error("_urlForResource called for a namespaced resource but no namespace provided", resource, arguments);
      return null;
    }

    var namespaceInPath = apiInfo.namespaced;
    var namespace = null;
    if (namespaceInPath) {
      namespace = params.namespace;
      params = angular.copy(params);
      delete params.namespace;
    }
    var template;
    var templateOptions = {
      protocol: protocol,
      hostPort: apiInfo.hostPort,
      prefix: apiInfo.prefix,
      group: apiInfo.group,
      version: apiInfo.version,
      resource: resource.primaryResource(),
      subresource: resource.subresources(),
      name: name,
      namespace: namespace,
      q: params
    };
    if (name) {
      template = namespaceInPath ? URL_NAMESPACED_OBJECT : URL_OBJECT;
    }
    else {
      template = namespaceInPath ? URL_NAMESPACED_GET_LIST : URL_GET_LIST;
    }
    return URI.expand(template, templateOptions).toString();
  };

  DataService.prototype.url = function(options) {
    if (options && options.resource) {
      var opts = angular.copy(options);
      delete opts.resource;
      delete opts.group;
      delete opts.version;
      delete opts.name;
      delete opts.isWebsocket;
      var resource = APIService.toResourceGroupVersion({
        resource: options.resource,
        group:    options.group,
        version:  options.version
      });
      return this._urlForResource(resource, options.name, null, !!options.isWebsocket, opts);
    }
    return null;
  };

  DataService.prototype.openshiftAPIBaseUrl = function() {
    var protocol = window.location.protocol === "http:" ? "http" : "https";
    var hostPort = API_CFG.openshift.hostPort;
    return new URI({protocol: protocol, hostname: hostPort}).toString();
  };

  // Immutables are flagged here as we should not need to fetch them more than once.
  var IMMUTABLE_RESOURCE = {
    imagestreamimages: true
  };

  // - request once and never need to request again, these do not change!
  DataService.prototype._isImmutable = function(resource) {
    return !!IMMUTABLE_RESOURCE[resource.resource];
  };

  // do we already have the data for this?
  DataService.prototype._hasImmutable = function(resource, existingData, name) {
    return this._isImmutable(resource) && existingData && existingData.by('metadata.name')[name];
  };

  DataService.prototype._getNamespace = function(resource, context, opts) {
    var deferred = $q.defer();
    if (opts.namespace) {
      deferred.resolve({namespace: opts.namespace});
    }
    else if (context.projectPromise && !resource.equals("projects")) {
      context.projectPromise.done(function(project) {
        deferred.resolve({namespace: project.metadata.name});
      });
    }
    else {
      deferred.resolve(null);
    }
    return deferred.promise;
  };

  return new DataService();
}]);
;'use strict';

// Logout strategies
angular.module('openshiftCommonServices')
.provider('DeleteTokenLogoutService', function() {

  this.$get = ["$q", "$injector", "Logger", function($q, $injector, Logger) {
    var authLogger = Logger.get("auth");

    return {
      logout: function(user, token) {
        authLogger.log("DeleteTokenLogoutService.logout()", user, token);

        // If we don't have a token, we're done
        if (!token) {
          authLogger.log("DeleteTokenLogoutService, no token, returning immediately");
          return $q.when({});
        }

        // Lazily get the data service. Can't explicitly depend on it or we get circular dependencies.
        var DataService = $injector.get('DataService');
        // Use the token to delete the token
        // Never trigger a login when deleting our token
        var opts = {http: {auth: {token: token, triggerLogin: false}}};
        // TODO: Change this to return a promise that "succeeds" even if the token delete fails?
        return DataService.delete("oauthaccesstokens", token, {}, opts);
      },
    };
  }];
});
;'use strict';

angular.module("openshiftCommonServices")
  .service("KeywordService", function(){

    var generateKeywords = function(filterText) {
      if (!filterText) {
        return [];
      }

      var keywords = _.uniq(filterText.match(/\S+/g));

      // Sort the longest keyword first.
      keywords.sort(function(a, b){
        return b.length - a.length;
      });

      // Convert the keyword to a case-insensitive regular expression for the filter.
      return _.map(keywords, function(keyword) {
        return new RegExp(_.escapeRegExp(keyword), "i");
      });
    };

    var filterForKeywords = function(objects, filterFields, keywords) {
      var filteredObjects = objects;
      if (_.isEmpty(keywords)) {
        return filteredObjects;
      }

      // Find resources that match all keywords.
      angular.forEach(keywords, function(regex) {
        var matchesKeyword = function(obj) {
          var i;
          for (i = 0; i < filterFields.length; i++) {
            var value = _.get(obj, filterFields[i]);
            if (value && regex.test(value)) {
              return true;
            }
          }

          return false;
        };

        filteredObjects = _.filter(filteredObjects, matchesKeyword);
      });
      return filteredObjects;
    };

    return {
      filterForKeywords: filterForKeywords,
      generateKeywords: generateKeywords
    };
  });
;'use strict';

angular.module('openshiftCommonServices')
.provider('Logger', function() {
  this.$get = function() {
    // Wraps the global Logger from https://github.com/jonnyreeves/js-logger
    var OSLogger = Logger.get("OpenShift");
    var logger = {
      get: function(name) {
        var logger = Logger.get("OpenShift/" + name);
        var logLevel = "OFF";
        if (localStorage) {
          logLevel = localStorage['OpenShiftLogLevel.' + name] || logLevel;
        }
        logger.setLevel(Logger[logLevel]);
        return logger;
      },
      log: function() {
        OSLogger.log.apply(OSLogger, arguments);
      },
      info: function() {
        OSLogger.info.apply(OSLogger, arguments);
      },
      debug: function() {
        OSLogger.debug.apply(OSLogger, arguments);
      },
      warn: function() {
        OSLogger.warn.apply(OSLogger, arguments);
      },
      error: function() {
        OSLogger.error.apply(OSLogger, arguments);
      }
    };

    // Set default log level
    var logLevel = "ERROR";
    if (localStorage) {
      logLevel = localStorage['OpenShiftLogLevel.main'] || logLevel;
    }
    OSLogger.setLevel(Logger[logLevel]);
    return logger;
  };
});
;'use strict';
/* jshint unused: false */

// UserStore objects able to remember user and tokens for the current user
angular.module('openshiftCommonServices')
.provider('MemoryUserStore', function() {
  this.$get = ["Logger", function(Logger){
    var authLogger = Logger.get("auth");
    var _user = null;
    var _token = null;
    return {
      available: function() {
        return true;
      },
      getUser: function(){
        authLogger.log("MemoryUserStore.getUser", _user);
        return _user;
      },
      setUser: function(user, ttl) {
        // TODO: honor ttl
        authLogger.log("MemoryUserStore.setUser", user);
        _user = user;
      },
      getToken: function() {
        authLogger.log("MemoryUserStore.getToken", _token);
        return _token;
      },
      setToken: function(token, ttl) {
        // TODO: honor ttl
        authLogger.log("MemoryUserStore.setToken", token);
        _token = token;
      }
    };
  }];
})
.provider('SessionStorageUserStore', function() {
  this.$get = ["Logger", function(Logger){
    var authLogger = Logger.get("auth");
    var userkey = "SessionStorageUserStore.user";
    var tokenkey = "SessionStorageUserStore.token";
    return {
      available: function() {
        try {
          var x = String(new Date().getTime());
          sessionStorage['SessionStorageUserStore.test'] = x;
          var y = sessionStorage['SessionStorageUserStore.test'];
          sessionStorage.removeItem('SessionStorageUserStore.test');
          return x === y;
        } catch(e) {
          return false;
        }
      },
      getUser: function(){
        try {
          var user = JSON.parse(sessionStorage[userkey]);
          authLogger.log("SessionStorageUserStore.getUser", user);
          return user;
        } catch(e) {
          authLogger.error("SessionStorageUserStore.getUser", e);
          return null;
        }
      },
      setUser: function(user, ttl) {
        // TODO: honor ttl
        if (user) {
          authLogger.log("SessionStorageUserStore.setUser", user);
          sessionStorage[userkey] = JSON.stringify(user);
        } else {
          authLogger.log("SessionStorageUserStore.setUser", user, "deleting");
          sessionStorage.removeItem(userkey);
        }
      },
      getToken: function() {
        try {
          var token = sessionStorage[tokenkey];
          authLogger.log("SessionStorageUserStore.getToken", token);
          return token;
        } catch(e) {
          authLogger.error("SessionStorageUserStore.getToken", e);
          return null;
        }
      },
      setToken: function(token, ttl) {
        // TODO: honor ttl
        if (token) {
          authLogger.log("SessionStorageUserStore.setToken", token);
          sessionStorage[tokenkey] = token;
        } else {
          authLogger.log("SessionStorageUserStore.setToken", token, "deleting");
          sessionStorage.removeItem(tokenkey);
        }
      }
    };
  }];
})
.provider('LocalStorageUserStore', function() {
  this.$get = ["Logger", function(Logger){
    var authLogger = Logger.get("auth");
    var userkey = "LocalStorageUserStore.user";
    var tokenkey = "LocalStorageUserStore.token";

    var ttlKey = function(key) {
      return key + ".ttl";
    };
    var setTTL = function(key, ttl) {
      if (ttl) {
        var expires = new Date().getTime() + ttl*1000;
        localStorage[ttlKey(key)] = expires;
        authLogger.log("LocalStorageUserStore.setTTL", key, ttl, new Date(expires).toString());
      } else {
        localStorage.removeItem(ttlKey(key));
        authLogger.log("LocalStorageUserStore.setTTL deleting", key);
      }
    };
    var isTTLExpired = function(key) {
      var ttl = localStorage[ttlKey(key)];
      if (!ttl) {
        return false;
      }
      var expired = parseInt(ttl) < new Date().getTime();
      authLogger.log("LocalStorageUserStore.isTTLExpired", key, expired);
      return expired;
    };

    return {
      available: function() {
        try {
          var x = String(new Date().getTime());
          localStorage['LocalStorageUserStore.test'] = x;
          var y = localStorage['LocalStorageUserStore.test'];
          localStorage.removeItem('LocalStorageUserStore.test');
          return x === y;
        } catch(e) {
          return false;
        }
      },
      getUser: function(){
        try {
          if (isTTLExpired(userkey)) {
            authLogger.log("LocalStorageUserStore.getUser expired");
            localStorage.removeItem(userkey);
            setTTL(userkey, null);
            return null;
          }
          var user = JSON.parse(localStorage[userkey]);
          authLogger.log("LocalStorageUserStore.getUser", user);
          return user;
        } catch(e) {
          authLogger.error("LocalStorageUserStore.getUser", e);
          return null;
        }
      },
      setUser: function(user, ttl) {
        if (user) {
          authLogger.log("LocalStorageUserStore.setUser", user, ttl);
          localStorage[userkey] = JSON.stringify(user);
          setTTL(userkey, ttl);
        } else {
          authLogger.log("LocalStorageUserStore.setUser", user, "deleting");
          localStorage.removeItem(userkey);
          setTTL(userkey, null);
        }
      },
      getToken: function() {
        try {
          if (isTTLExpired(tokenkey)) {
            authLogger.log("LocalStorageUserStore.getToken expired");
            localStorage.removeItem(tokenkey);
            setTTL(tokenkey, null);
            return null;
          }
          var token = localStorage[tokenkey];
          authLogger.log("LocalStorageUserStore.getToken", token);
          return token;
        } catch(e) {
          authLogger.error("LocalStorageUserStore.getToken", e);
          return null;
        }
      },
      setToken: function(token, ttl) {
        if (token) {
          authLogger.log("LocalStorageUserStore.setToken", token, ttl);
          localStorage[tokenkey] = token;
          setTTL(tokenkey, ttl);
        } else {
          authLogger.log("LocalStorageUserStore.setToken", token, ttl, "deleting");
          localStorage.removeItem(tokenkey);
          setTTL(tokenkey, null);
        }
      }
    };
  }];
});
;'use strict';

angular.module('openshiftCommonServices')
  .factory('ProjectsService',
    ["$location", "$q", "AuthService", "DataService", "annotationNameFilter", "AuthorizationService", function($location, $q, AuthService, DataService, annotationNameFilter, AuthorizationService) {


      var cleanEditableAnnotations = function(resource) {
        var paths = [
              annotationNameFilter('description'),
              annotationNameFilter('displayName')
            ];
        _.each(paths, function(path) {
          if(!resource.metadata.annotations[path]) {
            delete resource.metadata.annotations[path];
          }
        });
        return resource;
      };

      return {
        get: function(projectName) {
          return  AuthService
                    .withUser()
                    .then(function() {
                      var context = {
                        // TODO: swap $.Deferred() for $q.defer()
                        projectPromise: $.Deferred(),
                        projectName: projectName,
                        project: undefined
                      };
                      return DataService
                              .get('projects', projectName, context, {errorNotification: false})
                              .then(function(project) {
                                return AuthorizationService
                                        .getProjectRules(projectName)
                                        .then(function() {
                                          context.project = project;
                                          context.projectPromise.resolve(project);
                                          // TODO: fix need to return context & projectPromise
                                          return [project, context];
                                        });
                              }, function(e) {
                                context.projectPromise.reject(e);
                                var description = 'The project could not be loaded.';
                                var type = 'error';
                                if(e.status === 403) {
                                  description = 'The project ' + context.projectName + ' does not exist or you are not authorized to view it.';
                                  type = 'access_denied';
                                } else if (e.status === 404) {
                                  description = 'The project ' + context.projectName + ' does not exist.';
                                  type = 'not_found';
                                }
                                $location
                                  .url(
                                    URI('error')
                                      .query({
                                        "error" : type,
                                        "error_description": description
                                      })
                                      .toString());
                                return $q.reject();
                              });
                    });
          },
          update: function(projectName, data) {
            return DataService
                    .update('projects', projectName, cleanEditableAnnotations(data), {projectName: projectName}, {errorNotification: false});
          },
          canCreate: function() {
            return DataService.get("projectrequests", null, {}, { errorNotification: false});
          }
        };
    }]);
;'use strict';

// Login strategies
angular.module('openshiftCommonServices')
.provider('RedirectLoginService', function() {
  var _oauth_client_id = "";
  var _oauth_authorize_uri = "";
  var _oauth_token_uri = "";
  var _oauth_redirect_uri = "";

  this.OAuthClientID = function(id) {
    if (id) {
      _oauth_client_id = id;
    }
    return _oauth_client_id;
  };
  this.OAuthAuthorizeURI = function(uri) {
    if (uri) {
      _oauth_authorize_uri = uri;
    }
    return _oauth_authorize_uri;
  };
  this.OAuthTokenURI = function(uri) {
    if (uri) {
      _oauth_token_uri = uri;
    }
    return _oauth_token_uri;
  };
  this.OAuthRedirectURI = function(uri) {
    if (uri) {
      _oauth_redirect_uri = uri;
    }
    return _oauth_redirect_uri;
  };

  this.$get = ["$injector", "$location", "$q", "Logger", "base64", function($injector, $location, $q, Logger, base64) {
    var authLogger = Logger.get("auth");

    var getRandomInts = function(length) {
      var randomValues;

      if (window.crypto && window.Uint32Array) {
        try {
          var r = new Uint32Array(length);
          window.crypto.getRandomValues(r);
          randomValues = [];
          for (var j=0; j < length; j++) {
            randomValues.push(r[j]);
          }
        } catch(e) {
          authLogger.debug("RedirectLoginService.getRandomInts: ", e);
          randomValues = null;
        }
      }

      if (!randomValues) {
        randomValues = [];
        for (var i=0; i < length; i++) {
          randomValues.push(Math.floor(Math.random() * 4294967296));
        }
      }

      return randomValues;
    };

    var nonceKey = "RedirectLoginService.nonce";
    var makeState = function(then) {
      var nonce = String(new Date().getTime()) + "-" + getRandomInts(8).join("");
      try {
        window.localStorage[nonceKey] = nonce;
      } catch(e) {
        authLogger.log("RedirectLoginService.makeState, localStorage error: ", e);
      }
      return base64.urlencode(JSON.stringify({then: then, nonce:nonce}));
    };
    var parseState = function(state) {
      var retval = {
        then: null,
        verified: false
      };

      var nonce = "";
      try {
        nonce = window.localStorage[nonceKey];
        window.localStorage.removeItem(nonceKey);
      } catch(e) {
        authLogger.log("RedirectLoginService.parseState, localStorage error: ", e);
      }

      try {
        var data = state ? JSON.parse(base64.urldecode(state)) : {};
        if (data && data.nonce && nonce && data.nonce === nonce) {
          retval.verified = true;
          retval.then = data.then;
        }
      } catch(e) {
        authLogger.error("RedirectLoginService.parseState, state error: ", e);
      }
      authLogger.error("RedirectLoginService.parseState", retval);
      return retval;
    };

    return {
      // Returns a promise that resolves with {user:{...}, token:'...', ttl:X}, or rejects with {error:'...'[,error_description:'...',error_uri:'...']}
      login: function() {
        if (_oauth_client_id === "") {
          return $q.reject({error:'invalid_request', error_description:'RedirectLoginServiceProvider.OAuthClientID() not set'});
        }
        if (_oauth_authorize_uri === "") {
          return $q.reject({error:'invalid_request', error_description:'RedirectLoginServiceProvider.OAuthAuthorizeURI() not set'});
        }
        if (_oauth_redirect_uri === "") {
          return $q.reject({error:'invalid_request', error_description:'RedirectLoginServiceProvider.OAuthRedirectURI not set'});
        }

        // Never send a local fragment to remote servers
        var returnUri = new URI($location.url()).fragment("");
        var authorizeParams = {
          client_id: _oauth_client_id,
          response_type: 'token',
          state: makeState(returnUri.toString()),
          redirect_uri: _oauth_redirect_uri
        };

        if (_oauth_token_uri) {
          authorizeParams.response_type = "code";
          // TODO: add PKCE
        }

        var deferred = $q.defer();
        var uri = new URI(_oauth_authorize_uri);
        uri.query(authorizeParams);
        authLogger.log("RedirectLoginService.login(), redirecting", uri.toString());
        window.location.href = uri.toString();
        // Return a promise we never intend to keep, because we're redirecting to another page
        return deferred.promise;
      },

      // Parses oauth callback parameters from window.location
      // Returns a promise that resolves with {token:'...',then:'...',verified:true|false}, or rejects with {error:'...'[,error_description:'...',error_uri:'...']}
      // If no token and no error is present, resolves with {}
      // Example error codes: https://tools.ietf.org/html/rfc6749#section-5.2
      finish: function() {
        // Obtain the $http service.
        // Can't declare the dependency directly because it causes a cycle between $http->AuthInjector->AuthService->RedirectLoginService
        var http = $injector.get("$http");

        // handleParams handles error or access_token responses
        var handleParams = function(params, stateData) {
          // Handle an error response from the OAuth server
          if (params.error) {
            authLogger.log("RedirectLoginService.finish(), error", params.error, params.error_description, params.error_uri);
            return $q.reject({
              error: params.error,
              error_description: params.error_description,
              error_uri: params.error_uri
            });
          }

          // Handle an access_token fragment response
          if (params.access_token) {
            return $q.when({
              token: params.access_token,
              ttl: params.expires_in,
              then: stateData.then,
              verified: stateData.verified
            });
          }

          // No token and no error is invalid
          return $q.reject({
            error: "invalid_request",
            error_description: "No API token returned"
          });
        };

        // Get url
        var u = new URI($location.url());

        // Read params
        var queryParams = u.query(true);
        var fragmentParams = new URI("?" + u.fragment()).query(true);
        authLogger.log("RedirectLoginService.finish()", queryParams, fragmentParams);

        // immediate error
        if (queryParams.error) {
          return handleParams(queryParams, parseState(queryParams.state));
        }
        // implicit error
        if (fragmentParams.error) {
          return handleParams(fragmentParams, parseState(fragmentParams.state));
        }
        // implicit success
        if (fragmentParams.access_token) {
          return handleParams(fragmentParams, parseState(fragmentParams.state));
        }
        // code flow
        if (_oauth_token_uri && queryParams.code) {
          // verify before attempting to exchange code for token
          // hard-fail state verification errors for code exchange
          var stateData = parseState(queryParams.state);
          if (!stateData.verified) {
            return $q.reject({
              error: "invalid_request",
              error_description: "Client state could not be verified"
            });
          }

          var tokenPostData = [
            "grant_type=authorization_code",
            "code="         + encodeURIComponent(queryParams.code),
            "redirect_uri=" + encodeURIComponent(_oauth_redirect_uri),
            "client_id="    + encodeURIComponent(_oauth_client_id)
          ].join("&");

          return http({
            method: "POST",
            url: _oauth_token_uri,
            headers: {
              "Authorization": "Basic " + window.btoa(_oauth_client_id+":"),
              "Content-Type": "application/x-www-form-urlencoded"
            },
            data: tokenPostData
          }).then(function(response){
            return handleParams(response.data, stateData);
          }, function(response) {
            authLogger.log("RedirectLoginService.finish(), error getting access token", response);
            return handleParams(response.data, stateData);
          });
        }

        // No token and no error is invalid
        return $q.reject({
          error: "invalid_request",
          error_description: "No API token returned"
        });
      }
    };
  }];
});
;'use strict';

// Provide a websocket implementation that behaves like $http
// Methods:
//   $ws({
//     url: "...", // required
//     method: "...", // defaults to WATCH
//   })
//   returns a promise to the opened WebSocket
//
//   $ws.available()
//   returns true if WebSockets are available to use
angular.module('openshiftCommonServices')
.provider('$ws', ["$httpProvider", function($httpProvider) {

  // $get method is called to build the $ws service
  this.$get = ["$q", "$injector", "Logger", function($q, $injector, Logger) {
    var authLogger = Logger.get("auth");
    authLogger.log("$wsProvider.$get", arguments);

    // Build list of interceptors from $httpProvider when constructing the $ws service
    // Build in reverse-order, so the last interceptor added gets to handle the request first
    var _interceptors = [];
    angular.forEach($httpProvider.interceptors, function(interceptorFactory) {
      if (angular.isString(interceptorFactory)) {
      	_interceptors.unshift($injector.get(interceptorFactory));
      } else {
      	_interceptors.unshift($injector.invoke(interceptorFactory));
      }
    });

    // Implement $ws()
    var $ws = function(config) {
      config.method = angular.uppercase(config.method || "WATCH");

      authLogger.log("$ws (pre-intercept)", config.url.toString());
      var serverRequest = function(config) {
        authLogger.log("$ws (post-intercept)", config.url.toString());
        var ws = new WebSocket(config.url, config.protocols);
        if (config.onclose)   { ws.onclose   = config.onclose;   }
        if (config.onmessage) { ws.onmessage = config.onmessage; }
        if (config.onopen)    { ws.onopen    = config.onopen;    }
        if (config.onerror)   { ws.onerror    = config.onerror;  }
        return ws;
      };

      // Apply interceptors to request config
      var chain = [serverRequest, undefined];
      var promise = $q.when(config);
      angular.forEach(_interceptors, function(interceptor) {
        if (interceptor.request || interceptor.requestError) {
          chain.unshift(interceptor.request, interceptor.requestError);
        }
        // TODO: figure out how to get interceptors to handle response errors from web sockets
        // if (interceptor.response || interceptor.responseError) {
        //   chain.push(interceptor.response, interceptor.responseError);
        // }
      });
      while (chain.length) {
        var thenFn = chain.shift();
        var rejectFn = chain.shift();
        promise = promise.then(thenFn, rejectFn);
      }
      return promise;
    };

    // Implement $ws.available()
    $ws.available = function() {
      try {
        return !!WebSocket;
      }
      catch(e) {
        return false;
      }
    };

    return $ws;
  }];
}]);
;'use strict';

angular.module('openshiftCommonUI').factory('GuidedTourService', function() {
  var hopscotchConfig = {};
  var innerConfig;
  var bubbleHeight = 175;

  var startTour = function(tourConfig, onTourEndCB) {
    $('body').append('<div id="guided_tour_backdrop" class="modal-backdrop fade guided-tour-backdrop"></div>');

    innerConfig = {
      onTourEndCB: onTourEndCB,
      bubblePadding: 5,
      arrowWidth: 10,
      onStart: handleTourStart,
      onEnd: handleTourEnd,
      onClose: handleTourEnd,
      showPrevButton: true,
      i18n: {
        nextBtn: 'Next >',
        prevBtn: '< Back'
      }
    };
    hopscotchConfig = {};
    angular.merge(hopscotchConfig, innerConfig, tourConfig);

    setupSteps();
    makeStepTargetVisible(0);

    hopscotch.startTour(hopscotchConfig, 0);
  };

  var cancelTour = function() {
    hopscotch.endTour();
  };

  function handleTourStart() {
    $('#guided_tour_backdrop').click(cancelTour);
  }

  function handleTourEnd() {
    $('#guided_tour_backdrop').remove();
    if (angular.isFunction(hopscotchConfig.onTourEndCB)) {
      hopscotchConfig.onTourEndCB();
    }
  }

  function setupSteps() {
    _.forEach(hopscotchConfig.steps, function(step) {
      step.onNextOrig = step.onNext;
      step.onPrevOrig = step.onPrev;
      step.onNext = onStepNext;
      step.onPrev = onStepPrev;
      step.fixedElement = true;

      // Since we use a title area, move up to get arrow out of title area
      if (angular.isUndefined(step.yOffset) && (step.placement === 'right' || step.placement === 'left' )) {
        step.yOffset = -45;
      }

      step.title = _.isFunction(step.title) ? step.title() : step.title;
      step.content = _.isFunction(step.content) ? step.content() : step.content;
      step.target = _.isFunction(step.target) ? step.target() : step.target;
      step.placement = _.isFunction(step.placement) ? step.placement() : step.placement;
    });
  }

  function onStepNext() {
    var stepNum = hopscotch.getCurrStepNum() - 1;
    var stepConfig = hopscotchConfig.steps[stepNum];

    if (stepConfig) {
      if (stepConfig.onNextOrig) {
        stepConfig.onNextOrig();
      }

      makeStepTargetVisible(stepNum + 1);
    }
  }

  function onStepPrev() {
    var stepNum = hopscotch.getCurrStepNum() + 1;
    var stepConfig = hopscotchConfig.steps[stepNum];

    if (stepConfig) {
      if (stepConfig.onPrevOrig) {
        stepConfig.onPrevOrig();
      }

      makeStepTargetVisible(stepNum - 1);
    }
  }

  function makeStepTargetVisible(stepNum) {
    var stepConfig = hopscotchConfig.steps[stepNum];

    if (!stepConfig) {
      return;
    }

    if (stepConfig.preShow) {
      stepConfig.preShow();
    }

    if (stepConfig.targetScrollElement) {
      var scrollElement = $('body').find(stepConfig.targetScrollElement)[0];
      var targetElement = $('body').find(stepConfig.target)[0];

      if (scrollElement && scrollElement) {

        var offsetTop = getOffsetTopFromScrollElement(targetElement, scrollElement);
        if (stepConfig.placement === 'top') {
          offsetTop -= bubbleHeight;
        } else {
          offsetTop += bubbleHeight;
        }

        if (offsetTop > scrollElement.clientHeight) {
          scrollElement.scrollTop = offsetTop;
        } else {
          scrollElement.scrollTop = 0;
        }
      }
    }
  }

  function getOffsetTopFromScrollElement(targetElement, scrollElement) {
    if (!targetElement || targetElement === scrollElement) {
      return 0;
    } else {
      return targetElement.offsetTop + getOffsetTopFromScrollElement(targetElement.offsetParent, scrollElement);
    }
  }

  return {
    startTour: startTour,
    cancelTour: cancelTour
  };
});
;'use strict';

angular.module("openshiftCommonUI")
  .factory("HTMLService", ["BREAKPOINTS", function(BREAKPOINTS) {
    var WINDOW_SIZE_XXS = 'xxs';
    var WINDOW_SIZE_XS = 'xs';
    var WINDOW_SIZE_SM = 'sm';
    var WINDOW_SIZE_MD = 'md';
    var WINDOW_SIZE_LG = 'lg';

    return {
      WINDOW_SIZE_XXS: WINDOW_SIZE_XXS,
      WINDOW_SIZE_XS: WINDOW_SIZE_XS,
      WINDOW_SIZE_SM: WINDOW_SIZE_SM,
      WINDOW_SIZE_MD: WINDOW_SIZE_MD,
      WINDOW_SIZE_LG: WINDOW_SIZE_LG,

      // Ge the breakpoint for the current screen width.
      getBreakpoint: function() {
        if (window.innerWidth < BREAKPOINTS.screenXsMin) {
          return WINDOW_SIZE_XXS;
        }

        if (window.innerWidth < BREAKPOINTS.screenSmMin) {
          return WINDOW_SIZE_XS;
        }

        if (window.innerWidth < BREAKPOINTS.screenMdMin) {
          return WINDOW_SIZE_SM;
        }

        if (window.innerWidth < BREAKPOINTS.screenLgMin) {
          return WINDOW_SIZE_MD;
        }

        return WINDOW_SIZE_LG;
      },

      isWindowBelowBreakpoint: function(size) {
        switch(size) {
          case WINDOW_SIZE_XXS:
            return false; // Nothing is below xxs
            break;
          case WINDOW_SIZE_XS:
            return window.innerWidth < BREAKPOINTS.screenXsMin;
            break;
          case WINDOW_SIZE_SM:
            return window.innerWidth < BREAKPOINTS.screenSmMin;
            break;
          case WINDOW_SIZE_MD:
            return window.innerWidth < BREAKPOINTS.screenMdMin;
            break;
          case WINDOW_SIZE_LG:
            return window.innerWidth < BREAKPOINTS.screenLgMin;
            break;
          default:
            return true;
        }
      },

      isWindowAboveBreakpoint: function(size) {
        switch(size) {
          case WINDOW_SIZE_XS:
            return window.innerWidth >= BREAKPOINTS.screenXsMin;
            break;
          case WINDOW_SIZE_SM:
            return window.innerWidth >= BREAKPOINTS.screenSmMin;
            break;
          case WINDOW_SIZE_MD:
            return window.innerWidth >= BREAKPOINTS.screenMdMin;
            break;
          case WINDOW_SIZE_LG:
            return window.innerWidth >= BREAKPOINTS.screenLgMin;
            break;
          default:
            return true;
        }
      },

      // Based on https://github.com/drudru/ansi_up/blob/v1.3.0/ansi_up.js#L93-L97
      // and https://github.com/angular/angular.js/blob/v1.5.8/src/ngSanitize/filter/linky.js#L131-L132
      // The AngularJS `linky` regex will avoid matching special characters like `"` at
      // the end of the URL.
      //
      // text:            The text to linkify. Assumes `text` is NOT HTML-escaped unless
      //                  `alreadyEscaped` is true.
      // target:          The optional link target (for instance, '_blank')
      // alreadyEscaped:  `true` if the text has already been HTML escaped
      //                  (like log content that has been run through ansi_up.ansi_to_html)
      //
      // Returns an HTML escaped string with http:// and https:// URLs changed to clickable links.
      linkify: function(text, target, alreadyEscaped) {
        if (!text) {
          return text;
        }

        // First HTML escape the content.
        if (!alreadyEscaped) {
          text = _.escape(text);
        }

        // Replace any URLs with links.
        return text.replace(/https?:\/\/[A-Za-z0-9._%+-]+\S*[^\s.;,(){}<>"\u201d\u2019]/gm, function(str) {
          if (target) {
            return "<a href=\"" + str + "\" target=\"" + target + "\">" + str + "</a>";
          }

          return "<a href=\"" + str + "\">" + str + "</a>";
        });
      }
    };
  }]);
;'use strict';

angular.module('openshiftCommonUI').provider('NotificationsService', function() {
  this.dismissDelay = 8000;
  this.autoDismissTypes = ['info', 'success'];

  this.$get = ["$rootScope", function($rootScope) {
    var notifications = [];
    var dismissDelay = this.dismissDelay;
    var autoDismissTypes = this.autoDismissTypes;

    var notificationHiddenKey = function(notificationID, namespace) {
      if (!namespace) {
        return 'hide/notification/' + notificationID;
      }

      return 'hide/notification/' + namespace + '/' + notificationID;
    };

    var addNotification = function (notification) {
      if (isNotificationPermanentlyHidden(notification) || isNotificationVisible(notification)) {
        return;
      }

      notifications.push(notification);
      $rootScope.$emit('NotificationsService.onNotificationAdded', notification);
    };

    var hideNotification = function (notificationID) {
      if (!notificationID) {
        return;
      }

      _.each(notifications, function(notification) {
        if (notification.id === notificationID) {
          notification.hidden = true;
        }
      });
    };

    var getNotifications = function () {
      return notifications;
    };

    var clearNotifications = function () {
      _.take(notifications, 0);
    };

    var isNotificationPermanentlyHidden = function (notification) {
      if (!notification.id) {
        return false;
      }

      var key = notificationHiddenKey(notification.id, notification.namespace);
      return localStorage.getItem(key) === 'true';
    };

    var permanentlyHideNotification = function (notificationID, namespace) {
      var key = notificationHiddenKey(notificationID, namespace);
      localStorage.setItem(key, 'true');
    };

    // Is there a visible toast notification with the same ID right now?
    var isNotificationVisible = function (notification) {
      if (!notification.id) {
        return false;
      }

      return _.some(notifications, function(next) {
        return !next.hidden && notification.id === next.id;
      });
    };

    var isAutoDismiss = function(notification) {
      return _.includes(autoDismissTypes, notification.type);
    };

    // Also handle `addNotification` events on $rootScope, which is used by DataService.
    $rootScope.$on('NotificationsService.addNotification', function(event, data) {
      addNotification(data);
    });

    return {
      addNotification: addNotification,
      hideNotification: hideNotification,
      getNotifications: getNotifications,
      clearNotifications: clearNotifications,
      isNotificationPermanentlyHidden: isNotificationPermanentlyHidden,
      permanentlyHideNotification: permanentlyHideNotification,
      isAutoDismiss: isAutoDismiss,
      dismissDelay: dismissDelay,
      autoDismissTypes: autoDismissTypes
    };
  }];

  this.setDismissDelay = function(delayInMs) {
    this.dismissDelay = delayInMs;
  };

  this.setAutoDismissTypes = function(arrayOfTypes) {
    this.autoDismissTypes = arrayOfTypes;
  };

});
