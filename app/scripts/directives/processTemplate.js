'use strict';

angular.module('openshiftConsole').component('processTemplate', {
  controller: [
    '$filter',
    '$parse',
    '$q',
    '$scope',
    '$uibModal',
    'DataService',
    'Navigate',
    'ProcessedTemplateService',
    'QuotaService',
    'SecurityCheckService',
    'TaskList',
    'keyValueEditorUtils',
    ProcessTemplate
  ],
  controllerAs: '$ctrl',
  bindings: {
    template: '<',
    project: '<',
    alerts: '<',
    prefillParameters: '<'
  },
  templateUrl: 'views/directives/process-template.html'
});

function ProcessTemplate($filter,
                         $parse,
                         $q,
                         $scope,
                         $uibModal,
                         DataService,
                         Navigate,
                         ProcessedTemplateService,
                         QuotaService,
                         SecurityCheckService,
                         TaskList,
                         keyValueEditorUtils) {
  var ctrl = this;

  var context;
  var projectDisplayName;

  var dcContainers = $parse('spec.template.spec.containers');
  var builderImage = $parse('spec.strategy.sourceStrategy.from || spec.strategy.dockerStrategy.from || spec.strategy.customStrategy.from');
  var outputImage = $parse('spec.output.to');

  var displayName = $filter('displayName');
  var humanize = $filter('humanize');
  var imageObjectRef = $filter('imageObjectRef');

  function findImageFromTrigger(dc, container) {
    var triggers = _.get(dc, 'spec.triggers', []);
    // Find an image change trigger whose container name matches.
    var matchingTrigger = _.find(triggers, function(trigger) {
      if (trigger.type !== 'ImageChange') {
        return false;
      }

      var containerNames = _.get(trigger, 'imageChangeParams.containerNames', []);
      return _.includes(containerNames, container.name);
    });

    return _.get(matchingTrigger, 'imageChangeParams.from.name');
  }

  // Test for variable expressions like ${MY_PARAMETER} in the image.
  var TEMPLATE_VARIABLE_EXPRESSION = /\${([a-zA-Z0-9\_]+)}/g;
  function getParametersInImage(image) {
    var parameters = [];
    var match = TEMPLATE_VARIABLE_EXPRESSION.exec(image);
    while (match) {
      parameters.push(match[1]);
      match = TEMPLATE_VARIABLE_EXPRESSION.exec(image);
    }

    return parameters;
  }

  function getParameterValues() {
    var values = {};
    _.each(ctrl.template.parameters, function(parameter) {
      values[parameter.name] = parameter.value;
    });

    return values;
  }

  var images = [];
  function resolveParametersInImages() {
    var values = getParameterValues();
    ctrl.templateImages = _.map(images, function(image) {
      if (_.isEmpty(image.usesParameters)) {
        return image;
      }

      var template = _.template(image.name, { interpolate: TEMPLATE_VARIABLE_EXPRESSION });
      return {
        name: template(values),
        usesParameters: image.usesParameters
      };
    });
  }

  function deploymentConfigImages(dc) {
    var dcImages = [];
    var containers = dcContainers(dc);
    if (containers) {
      angular.forEach(containers, function(container) {
        var image = container.image;
        // Look to see if `container.image` is set from an image change trigger.
        var imageFromTrigger = findImageFromTrigger(dc, container);
        if (imageFromTrigger) {
          image = imageFromTrigger;
        }

        if (image) {
          dcImages.push(image);
        }
      });
    }

    return dcImages;
  }

  function findTemplateImages(data) {
    images = [];
    var dcImages = [];
    var outputImages = {};
    angular.forEach(data.objects, function(item) {
      if (item.kind === "BuildConfig") {
        var builder = imageObjectRef(builderImage(item), ctrl.project.metadata.name);
        if(builder) {
          images.push({
            name: builder,
            usesParameters: getParametersInImage(builder)
          });
        }
        var output = imageObjectRef(outputImage(item), ctrl.project.metadata.name);
        if (output) {
          outputImages[output] = true;
        }
      }
      if (item.kind === "DeploymentConfig") {
        dcImages = dcImages.concat(deploymentConfigImages(item));
      }
    });
    dcImages.forEach(function(image) {
      if (!outputImages[image]) {
        images.push({
          name: image,
          usesParameters: getParametersInImage(image)
        });
      }
    });
    images = _.uniq(images, false, 'name');
  }

  function getHelpLinks(template) {
    var helpLinkName = /^helplink\.(.*)\.title$/;
    var helpLinkURL = /^helplink\.(.*)\.url$/;
    var helpLinks = {};
    for (var attr in template.annotations) {
      var match = attr.match(helpLinkName);
      var link;
      if (match) {
        link = helpLinks[match[1]] || {};
        link.title = template.annotations[attr];
        helpLinks[match[1]] = link;
      }
      else {
        match = attr.match(helpLinkURL);
        if (match) {
          link = helpLinks[match[1]] || {};
          link.url = template.annotations[attr];
          helpLinks[match[1]] = link;
        }
      }
    }
    return helpLinks;
  }

  ctrl.$onInit = function() {
    ctrl.labels = [];
    ctrl.templateDisplayName = displayName(ctrl.template);
    context = {
      namespace: ctrl.project.metadata.name
    };
    projectDisplayName = displayName(ctrl.project);
    setTemplateParams();
  };

  var processedResources;
  var createResources = function() {
    var titles = {
      started: "Creating " + ctrl.templateDisplayName + " in project " + projectDisplayName,
      success: "Created " + ctrl.templateDisplayName + " in project " + projectDisplayName,
      failure: "Failed to create " + ctrl.templateDisplayName + " in project " + projectDisplayName
    };
    var helpLinks = getHelpLinks(ctrl.template);
    TaskList.clear();
    TaskList.add(titles, helpLinks, ctrl.project.metadata.name, function() {
      var d = $q.defer();
      DataService.batch(processedResources, context).then(
        function(result) {
          var alerts = [];
          var hasErrors = false;
          if (result.failure.length > 0) {
            hasErrors = true;
            result.failure.forEach(
              function(failure) {
                alerts.push({
                  type: "error",
                  message: "Cannot create " + humanize(failure.object.kind).toLowerCase() + " \"" + failure.object.metadata.name + "\". ",
                  details: failure.data.message
                });
              }
            );
            result.success.forEach(
              function(success) {
                alerts.push({
                  type: "success",
                  message: "Created " + humanize(success.kind).toLowerCase() + " \"" + success.metadata.name + "\" successfully. "
                });
              }
            );
          } else {
            alerts.push({ type: "success", message: "All items in template " + ctrl.templateDisplayName +
              " were created successfully."});
          }
          d.resolve({alerts: alerts, hasErrors: hasErrors});
        }
      );
      return d.promise;
    });
    Navigate.toNextSteps(ctrl.templateDisplayName, ctrl.project.metadata.name);
  };

  var launchConfirmationDialog = function(alerts) {
    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'views/modals/confirm.html',
      controller: 'ConfirmModalController',
      resolve: {
        modalConfig: function() {
          return {
            alerts: alerts,
            message: "We checked your application for potential problems. Please confirm you still want to create this application.",
            okButtonText: "Create Anyway",
            okButtonClass: "btn-danger",
            cancelButtonText: "Cancel"
          };
        }
      }
    });

    modalInstance.result.then(createResources);
  };

  var showWarningsOrCreate = function(result) {
    var alerts = SecurityCheckService.getSecurityAlerts(processedResources, ctrl.project.metadata.name);

    // Now that all checks are completed, show any Alerts if we need to
    var quotaAlerts = result.quotaAlerts || [];
    alerts = alerts.concat(quotaAlerts);
    var errorAlerts = _.filter(alerts, {type: 'error'});
    if (errorAlerts.length) {
      ctrl.disableInputs = false;
      ctrl.precheckAlerts = alerts;
    }
    else if (alerts.length) {
       launchConfirmationDialog(alerts);
       ctrl.disableInputs = false;
    }
    else {
      createResources();
    }
  };

  ctrl.createFromTemplate = function() {
    ctrl.disableInputs = true;
    var userLabels = keyValueEditorUtils.mapEntries(keyValueEditorUtils.compactEntries(ctrl.labels));
    var systemLabels = keyValueEditorUtils.mapEntries(keyValueEditorUtils.compactEntries(ctrl.systemLabels));
    ctrl.template.labels = _.extend(systemLabels, userLabels);

    DataService.create("processedtemplates", null, ctrl.template, context).then(
      function(config) { // success
        // Cache template parameters and message so they can be displayed in the nexSteps page
        ProcessedTemplateService.setTemplateData(config.parameters, ctrl.template.parameters, config.message);
        processedResources = config.objects;

        QuotaService.getLatestQuotaAlerts(processedResources, context).then(showWarningsOrCreate);
      },
      function(result) { // failure
        ctrl.disableInputs = false;
        var details;
        if (result.data && result.data.message) {
          details = result.data.message;
        }
        ctrl.alerts["process"] =
          {
            type: "error",
            message: "An error occurred processing the template.",
            details: details
          };
      }
    );
  };

  var shouldAddAppLabel = function() {
    // If the template defines its own app label, we don't need to add one at all
    if (_.get(ctrl.template, 'labels.app')) {
      return false;
    }

    // Otherwise check if an object in the template has an app label defined
    return !_.some(ctrl.template.objects, "metadata.labels.app");
  };

  function setTemplateParams() {
    ctrl.parameterDisplayNames = {};
    _.each(ctrl.template.parameters, function(parameter) {
      ctrl.parameterDisplayNames[parameter.name] = parameter.displayName || parameter.name;
    });

    if(ctrl.prefillParameters) {
      _.each(ctrl.template.parameters, function(parameter) {
        if (ctrl.prefillParameters[parameter.name]) {
          parameter.value = ctrl.prefillParameters[parameter.name];
        }
      });
    }

    findTemplateImages(ctrl.template);
    var imageUsesParameters = function(image) {
      return !_.isEmpty(image.usesParameters);
    };
    if (_.some(images, imageUsesParameters)) {
      $scope.$watch(function() {
        return ctrl.template.parameters;
      }, _.debounce(function() {
        $scope.$apply(resolveParametersInImages);
      }, 50, { maxWait: 250 }), true);
    } else {
      ctrl.templateImages = images;
    }

    ctrl.systemLabels = _.map(ctrl.template.labels, function(value, key) {
      return {
        name: key,
        value: value
      };
    });

    if (shouldAddAppLabel()) {
      ctrl.systemLabels.push({
        name: 'app',
        value: ctrl.template.metadata.name
      });
    }
  }
}
