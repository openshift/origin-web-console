'use strict';

(function() {
  angular.module('openshiftConsole').component('processTemplate', {
    controller: [
      '$filter',
      '$q',
      '$scope',
      '$uibModal',
      'APIService',
      'DataService',
      'Navigate',
      'NotificationsService',
      'ProcessedTemplateService',
      'ProjectsService',
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
      onProjectSelected: '<',
      availableProjects: '<',
      prefillParameters: '<',
      isDialog: '<'
    },
    templateUrl: 'views/directives/process-template.html'
  });

  function ProcessTemplate($filter,
                          $q,
                          $scope,
                          $uibModal,
                          APIService,
                          DataService,
                          Navigate,
                          NotificationsService,
                          ProcessedTemplateService,
                          ProjectsService,
                          QuotaService,
                          SecurityCheckService,
                          TaskList,
                          keyValueEditorUtils) {
    var ctrl = this;

    var context;

    var displayName = $filter('displayName');
    var humanize = $filter('humanize');

    ctrl.noProjectsCantCreate = false;

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
      // Make a copy of the template to avoid modifying the original if it's cached.
      ctrl.template = angular.copy(ctrl.template);
      ctrl.templateDisplayName = displayName(ctrl.template);
      ctrl.selectedProject = ctrl.project;

      $scope.$watch('$ctrl.selectedProject.metadata.name', function() {
        ctrl.projectNameTaken = false;
      });

      $scope.$on('no-projects-cannot-create', function() {
        ctrl.noProjectsCantCreate = true;
      });

      setTemplateParams();
    };

    var processedResources;
    var createResources = function() {
      var titles = {
        started: "Creating " + ctrl.templateDisplayName + " in project " + displayName(ctrl.selectedProject),
        success: "Created " + ctrl.templateDisplayName + " in project " + displayName(ctrl.selectedProject),
        failure: "Failed to create " + ctrl.templateDisplayName + " in project " + displayName(ctrl.selectedProject)
      };
      var helpLinks = getHelpLinks(ctrl.template);
      TaskList.clear();
      TaskList.add(titles, helpLinks, ctrl.selectedProject.metadata.name, function() {
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

      if (ctrl.isDialog) {
        $scope.$emit('templateInstantiated', {
          project: ctrl.selectedProject,
          template: ctrl.template
        });
      } else {
        Navigate.toNextSteps(ctrl.templateDisplayName, ctrl.selectedProject.metadata.name);
      }
    };

    var launchConfirmationDialog = function(alerts) {
      var modalInstance = $uibModal.open({
        templateUrl: 'views/modals/confirm.html',
        controller: 'ConfirmModalController',
        resolve: {
          modalConfig: function() {
            return {
              alerts: alerts,
              title: "Confirm Creation",
              details: "We checked your application for potential problems. Please confirm you still want to create this application.",
              okButtonText: "Create Anyway",
              okButtonClass: "btn-danger",
              cancelButtonText: "Cancel"
            };
          }
        }
      });

      modalInstance.result.then(createResources);
    };

    var alerts = {};
    var hideNotificationErrors = function() {
      NotificationsService.hideNotification("process-template-error");
      _.each(alerts, function(alert) {
        if (alert.id && (alert.type === 'error' || alert.type === 'warning')) {
          NotificationsService.hideNotification(alert.id);
        }
      });
    };

    var showWarningsOrCreate = function(result) {
      // Hide any previous notifications when form is resubmitted.
      hideNotificationErrors();

      alerts = SecurityCheckService.getSecurityAlerts(processedResources, ctrl.selectedProject.metadata.name);

      // Now that all checks are completed, show any Alerts if we need to
      var quotaAlerts = result.quotaAlerts || [];
      alerts = alerts.concat(quotaAlerts);
      var errorAlerts = _.filter(alerts, {type: 'error'});
      if (errorAlerts.length) {
        ctrl.disableInputs = false;
        _.each(alerts, function(alert) {
          alert.id = _.uniqueId('process-template-alert-');
          NotificationsService.addNotification(alert);
        });
      }
      else if (alerts.length) {
        launchConfirmationDialog(alerts);
        ctrl.disableInputs = false;
      }
      else {
        createResources();
      }
    };

    var createProjectIfNecessary = function() {
      if (_.has(ctrl.selectedProject, 'metadata.uid')) {
        return $q.when(ctrl.selectedProject);
      }

      var newProjName = ctrl.selectedProject.metadata.name;
      var newProjDisplayName = ctrl.selectedProject.metadata.annotations['new-display-name'];
      var newProjDesc = $filter('description')(ctrl.selectedProject);
      return ProjectsService.create(newProjName, newProjDisplayName, newProjDesc);
    };

    var getProcessTemplateVersionForTemplate = function(template) {
      var rgv = APIService.objectToResourceGroupVersion(template);
      rgv.resource = 'processedtemplates';
      return rgv;
    };

    ctrl.createFromTemplate = function() {
      ctrl.disableInputs = true;
      createProjectIfNecessary().then(function(project) {
        ctrl.selectedProject = project;
        context = {
          namespace: ctrl.selectedProject.metadata.name
        };
        ctrl.template.labels = keyValueEditorUtils.mapEntries(keyValueEditorUtils.compactEntries(ctrl.labels));

        var rgv = getProcessTemplateVersionForTemplate(ctrl.template);

        DataService.create(rgv, null, ctrl.template, context).then(
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
            NotificationsService.addNotification({
              id: "process-template-error",
              type: "error",
              message: "An error occurred processing the template.",
              details: details
            });
          }
        );
      }, function(result) {
        ctrl.disableInputs = false;
        if (result.data.reason === 'AlreadyExists') {
          ctrl.projectNameTaken = true;
        } else {
          var details;
          if (result.data && result.data.message) {
            details = result.data.message;
          }
          NotificationsService.addNotification({
            id: "process-template-error",
            type: "error",
            message: "An error occurred creating the project.",
            details: details
          });
        }
      });
    };

    // Only called when not in a dialog.
    ctrl.cancel = function() {
      hideNotificationErrors();
      Navigate.toProjectOverview(ctrl.project.metadata.name);
    };

    // When the process-template component is displayed in a dialog, the create
    // button is outside the component since it is in the wizard footer. Listen
    // for an event for when the button is clicked.
    $scope.$on('instantiateTemplate', ctrl.createFromTemplate);
    $scope.$on('$destroy', hideNotificationErrors);

    var shouldAddAppLabel = function() {
      // If the template defines its own app label, we don't need to add one at all
      if (_.get(ctrl.template, 'labels.app')) {
        return false;
      }

      // Otherwise check if an object in the template has an app label defined
      return !_.some(ctrl.template.objects, "metadata.labels.app");
    };

    function setTemplateParams() {
      if(ctrl.prefillParameters) {
        _.each(ctrl.template.parameters, function(parameter) {
          if (ctrl.prefillParameters[parameter.name]) {
            parameter.value = ctrl.prefillParameters[parameter.name];
          }
        });
      }

      ctrl.labels = _.map(ctrl.template.labels, function(value, key) {
        return {
          name: key,
          value: value
        };
      });

      if (shouldAddAppLabel()) {
        ctrl.labels.push({
          name: 'app',
          value: ctrl.template.metadata.name
        });
      }
    }
  }
})();
