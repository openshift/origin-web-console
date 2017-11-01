'use strict';

(function () {
  angular.module('openshiftConsole').component('openSquid', {
    controller: [
      '$filter',
      '$q',
      '$scope',
      '$uibModal',
      'DataService',
      'Navigate',
      'NotificationsService',
      'ProcessedTemplateService',
      'SquidService',
      'TaskList',
      ProcessTemplate
    ],
    controllerAs: '$ctrl',
    bindings: {
      template: '<',
      project: '<',
      prefillParameters: '<',
      isDialog: '<'
    },
    templateUrl: 'views/directives/squid-form.html'
  });

  function ProcessTemplate($filter,
                           $q,
                           $scope,
                           $uibModal,
                           DataService,
                           Navigate,
                           NotificationsService,
                           ProcessedTemplateService,
                           SquidService,
                           TaskList) {
    var ctrl = this;
    var context;
    var displayName = $filter('displayName');
    var humanize = $filter('humanize');
    var processedResources;
    ctrl.appParams = {};

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

    function getTemplateParams(params) {
      angular.forEach(params, function(param) {
        if(param.name !== 'K8S_NAMESPACE') {
          ctrl.appParams[param.name] = param;
        }
      });
    }

    function fillTemplateParams(params) {
      angular.forEach(params, function (param) {
        if(param.name === 'K8S_NAMESPACE') {
          param.value = ctrl.selectedProject.metadata.name;
        }
      });
    }

    ctrl.$onInit = function () {
      ctrl.labels = [];
      // Make a copy of the template to avoid modifying the original if it's cached.
      ctrl.template = SquidService.squidTemplate()
      ctrl.templateDisplayName = displayName(ctrl.template);
      ctrl.selectedProject = ctrl.project;
      getTemplateParams(ctrl.template.parameters);
    };

    var createResources = function () {
      var titles = {
        started: "Creating " + ctrl.templateDisplayName + " in project " + displayName(ctrl.selectedProject),
        success: "Created " + ctrl.templateDisplayName + " in project " + displayName(ctrl.selectedProject),
        failure: "Failed to create " + ctrl.templateDisplayName + " in project " + displayName(ctrl.selectedProject)
      };
      var helpLinks = getHelpLinks(ctrl.template);
      TaskList.clear();
      TaskList.add(titles, ctrl.template, ctrl.selectedProject.metadata.name, function () {
        var d = $q.defer();
        DataService.batch(processedResources, context).then(
          function (result) {
            var alerts = [];
            var hasErrors = false;
            if (result.failure.length > 0) {
              hasErrors = true;
              result.failure.forEach(
                function (failure) {
                  alerts.push({
                    type: "error",
                    message: "Cannot create " + humanize(failure.object.kind).toLowerCase() + " \"" + failure.object.metadata.name + "\". ",
                    details: failure.data.message
                  });
                }
              );
              result.success.forEach(
                function (success) {
                  alerts.push({
                    type: "success",
                    message: "Created " + humanize(success.kind).toLowerCase() + " \"" + success.metadata.name + "\" successfully. "
                  });
                }
              );
            } else {
              alerts.push({
                type: "success", message: "All items in template " + ctrl.templateDisplayName +
                " were created successfully."
              });
            }
            d.resolve({alerts: alerts, hasErrors: hasErrors});
          }
        );
        return d.promise;
      });

      if (ctrl.isDialog) {
        $scope.$emit('templateInstantiated', {
          project: ctrl.selectedProject,
          template: ctrl.template
        });
      } else {
        Navigate.toNextSteps(ctrl.templateDisplayName, ctrl.selectedProject.metadata.name);
      }
    };

    var alerts = {};
    var hideNotificationErrors = function () {
      NotificationsService.hideNotification("process-template-error");
      _.each(alerts, function (alert) {
        if (alert.id && (alert.type === 'error' || alert.type === 'warning')) {
          NotificationsService.hideNotification(alert.id);
        }
      });
    };

    var showWarningsOrCreate = function (result) {
      // Hide any previous notifications when form is resubmitted.
      hideNotificationErrors();
      createResources();
    };

    ctrl.createFromSquid = function () {
      fillTemplateParams(ctrl.template.parameters);
      context = {
        namespace: ctrl.selectedProject.metadata.name
      };
      DataService.create("processedtemplates", null, ctrl.template, context).then(
        function (config) { // success
          console.log('config', config)
          // Cache template parameters and message so they can be displayed in the nexSteps page
          ProcessedTemplateService.setTemplateData(config.parameters, ctrl.template.parameters, config.message);
          processedResources = config.objects;
          showWarningsOrCreate();
        },
        function (result) { // failure
          ctrl.disableInputs = false;
          var details;
          if (result.data && result.data.message) {
            details = result.data.message;
          }
          NotificationsService.addNotification({
            id: "process-template-error",
            type: "error",
            message: "An error occurred processing the template.",
            details: details
          });
        }
      );
    };


    // Only called when not in a dialog.
    ctrl.cancel = function () {
      hideNotificationErrors();
      Navigate.toProjectOverview(ctrl.project.metadata.name);
    };

  }
})();
