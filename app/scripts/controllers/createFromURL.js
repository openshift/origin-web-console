'use strict';

/**
 * @ngdoc function
 * @name openshiftConsole.controller:CreateFromURLController
 * @description
 * Controller of the openshiftConsole
 */
angular.module('openshiftConsole')
  .controller('CreateFromURLController', function (
    $scope,
    $routeParams,
    $location,
    $filter,
    APIService,
    AuthService,
    AuthorizationService,
    DataService,
    Navigate,
    ProjectsService) {
    AuthService.withUser();

    $scope.alerts = {};
    $scope.selected = {};

    var alertInvalidImageStream = function(imageStream) {
      $scope.alerts.invalidImageStream = {
        type: "error",
        message: "The requested image stream \"" + imageStream + "\" could not be loaded."
      };
    };

    var alertInvalidImageTag = function(imageTag) {
      $scope.alerts.invalidImageTag = {
        type: "error",
        message: "The requested image stream tag \"" + imageTag + "\" could not be loaded."
      };
    };

    var alertInvalidName = function(name) {
      $scope.alerts.invalidImageStream = {
        type: "error",
        message: "The app name \"" + name + "\" is not valid.  An app name is an alphanumeric (a-z, and 0-9) string with a maximum length of 24 characters, where the first character is a letter (a-z), and the '-' character is allowed anywhere except the first or last character."
      };
    };

    var alertInvalidNamespace = function(namespace) {
      $scope.alerts.invalidNamespace = {
        type: "error",
        message: "Resources from the namespace \"" + namespace + "\" are not permitted."
      };
    };

    var alertInvalidTemplate = function(template) {
      $scope.alerts.invalidTemplate = {
        type: "error",
        message: "The requested template \"" + template + "\" could not be loaded."
      };
    };

    var alertResourceRequired = function() {
      $scope.alerts.resourceRequired = {
        type: "error",
        message: "An image stream or template is required."
      };
    };

    var showInvalidResource = function() {
      $scope.alerts.invalidResource = {
        type: "error",
        message: "Image streams and templates cannot be combined."
      };
    };

    var getTemplateParamsMap = function () {
      try {
        return $routeParams.templateParamsMap && JSON.parse($routeParams.templateParamsMap) || {};
      }
      catch (e) {
        $scope.alerts.invalidTemplateParams = {
          type: "error",
          message: "The templateParamsMap is not valid JSON. " + e
        };
      }
    };

    var imageStreamsVersion = APIService.getPreferredVersion('imagestreams');
    var imageStreamTagsVersion = APIService.getPreferredVersion('imagestreamtags');
    var templatesVersion = APIService.getPreferredVersion('templates');

    var namespaceWhitelist = window.OPENSHIFT_CONSTANTS.CREATE_FROM_URL_WHITELIST;
    var whiteListedCreateDetailsKeys = ['namespace', 'name', 'imageStream', 'imageTag', 'sourceURI', 'sourceRef', 'contextDir', 'template', 'templateParamsMap'];
    var createDetails = _.pickBy($routeParams, function(value, key) {
      // routeParams without a value (e.g., ?name&) return true, which results in "true" displaying in the UI
      return _.includes(whiteListedCreateDetailsKeys, key) && _.isString(value);
    });
    // if no namespace is specified, set it to 'openshift'
    createDetails.namespace = createDetails.namespace || 'openshift';

    var validateName = function (name) {
      return _.size(name) < 25 && /^[a-z]([-a-z0-9]*[a-z0-9])?$/.test(name);
    };

    var getResources = function() {
      if (createDetails.imageStream) {
        DataService
          .get(imageStreamsVersion, createDetails.imageStream, {namespace: createDetails.namespace}, {
            errorNotification: false
          })
          .then(function(imageStream) {
            $scope.imageStream = imageStream;
            DataService
              .get(imageStreamTagsVersion, imageStream.metadata.name + ":" + createDetails.imageTag, {namespace: createDetails.namespace}, {
                  errorNotification: false
              })
              .then(function(imageStreamTag){
                $scope.imageStreamTag = imageStreamTag;
                $scope.validationPassed = true;
                $scope.resource = imageStreamTag;
                createDetails.displayName = $filter('displayName')(imageStreamTag);
              }, function(){
                alertInvalidImageTag(createDetails.imageTag);
              });
          }, function() {
            alertInvalidImageStream(createDetails.imageStream);
          });
      }
      if (createDetails.template) {
        DataService
          .get(templatesVersion, createDetails.template, {namespace: createDetails.namespace}, {
            errorNotification: false
          })
          .then(function(template) {
            $scope.template = template;
            if(getTemplateParamsMap()) {
              $scope.validationPassed = true;
              $scope.resource = template;
            }
          }, function() {
            alertInvalidTemplate(createDetails.template);
          });
      }
    };

    if (!(_.includes(namespaceWhitelist, createDetails.namespace))) {
      alertInvalidNamespace(createDetails.namespace);
    } else {
      if (createDetails.imageStream && createDetails.template) {
        showInvalidResource();
      } else if (!(createDetails.imageStream) && !(createDetails.template)) {
        alertResourceRequired();
      } else if (createDetails.name && !(validateName(createDetails.name))) {
        alertInvalidName(createDetails.name);
      } else {
        getResources();
      }
    }

    angular.extend($scope, {
      createDetails: createDetails,
      createWithProject: function(projectName) {
        projectName = projectName || $scope.selected.project.metadata.name;
        var url = $routeParams.imageStream ?
                    Navigate.createFromImageURL($scope.imageStream, createDetails.imageTag, projectName, createDetails) :
                    Navigate.createFromTemplateURL($scope.template, projectName, createDetails);
        $location.url(url);
      }
    });

    $scope.projects = {};
    $scope.canCreateProject = undefined;

    ProjectsService.list()
      .then(function(items) {
        $scope.loaded = true;
        $scope.projects = $filter('orderByDisplayName')(items.by("metadata.name"));
        $scope.noProjects = (_.isEmpty($scope.projects));
      });


    // Test if the user can submit project requests. Handle error notifications
    // ourselves because 403 responses are expected.
    ProjectsService
      .canCreate()
      .then(function() {
        $scope.canCreateProject = true;
      }, function() {
        $scope.canCreateProject = false;
      });

    $scope.forms = {};
    // assume the user can add to project by default
    $scope.canIAddToProject = true;

    $scope.canIAddToSelectedProject = function(selectedProject) {
      var selectedProjectName = _.get(selectedProject, 'metadata.name');
      AuthorizationService.getProjectRules(selectedProjectName).then(function() {
        $scope.canIAddToProject = AuthorizationService.canIAddToProject(selectedProjectName);
        if($scope.forms) {
          $scope.forms.selectProjectForm.selectProject.$setValidity('cannotAddToProject', $scope.canIAddToProject);
        }
      });
    };

  });
