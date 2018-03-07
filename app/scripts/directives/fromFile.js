'use strict';

angular.module("openshiftConsole")
  .directive("fromFile", function($filter,
                                  $location,
                                  $q,
                                  $uibModal,
                                  APIService,
                                  CachedTemplateService,
                                  DataService,
                                  Navigate,
                                  NotificationsService,
                                  QuotaService,
                                  SecurityCheckService,
                                  TaskList,
                                  ProjectsService) {
    return {
      restrict: "E",
      scope: {
        project: '=',
        isDialog: '='
      },
      templateUrl: "views/directives/from-file.html",
      controller: function($scope) {
        var aceEditorSession;
        $scope.noProjectsCantCreate = false;

        var humanizeKind = $filter('humanizeKind');
        var getErrorDetails = $filter('getErrorDetails');
        TaskList.clear();

        $scope.$on('no-projects-cannot-create', function() {
          $scope.noProjectsCantCreate = true;
        });

        $scope.input = {
          selectedProject: $scope.project
        };

        $scope.$watch('input.selectedProject.metadata.name', function() {
          $scope.projectNameTaken = false;
        });

        $scope.aceLoaded = function(editor) {
          aceEditorSession = editor.getSession();
          aceEditorSession.setOption('tabSize', 2);
          aceEditorSession.setOption('useSoftTabs', true);
          editor.setDragDelay = 0;
          editor.$blockScrolling = Infinity;
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

          modalInstance.result.then(createAndUpdate);
        };

        var alerts = {};
        var hideErrorNotifications = function() {
          NotificationsService.hideNotification("from-file-error");
          _.each(alerts, function(alert) {
            if (alert.id && (alert.type === 'error' || alert.type === 'warning')) {
              NotificationsService.hideNotification(alert.id);
            }
          });
        };

        var showWarningsOrCreate = function(result){
          // Hide any previous notifications when form is resubmitted.
          hideErrorNotifications();
          alerts = SecurityCheckService.getSecurityAlerts($scope.createResources, $scope.input.selectedProject.metadata.name);

          // Now that all checks are completed, show any Alerts if we need to
          var quotaAlerts = result.quotaAlerts || [];
          alerts = alerts.concat(quotaAlerts);
          var errorAlerts = _.filter(alerts, {type: 'error'});
          if (errorAlerts.length) {
            _.each(alerts, function(alert) {
              alert.id = _.uniqueId('from-file-alert-');
              NotificationsService.addNotification(alert);
            });
            $scope.disableInputs = false;
          }
          else if (alerts.length) {
             launchConfirmationDialog(alerts);
             $scope.disableInputs = false;
          }
          else {
            createAndUpdate();
          }
        };

        var createProjectIfNecessary = function() {
          if (_.has($scope.input.selectedProject, 'metadata.uid')) {
            return $q.when($scope.input.selectedProject);
          }

          var newProjName = $scope.input.selectedProject.metadata.name;
          var newProjDisplayName = $scope.input.selectedProject.metadata.annotations['new-display-name'];
          var newProjDesc = $filter('description')($scope.input.selectedProject);
          return ProjectsService.create(newProjName, newProjDisplayName, newProjDesc);
        };

        $scope.create = function() {
          delete $scope.error;

          // Trying to auto-detect what format the input is in. Since parsing JSON throws only SyntexError
          // exception if the string to parse is not valid JSON, it is tried first and then the YAML parser
          // is trying to parse the string. If that fails it will print the reason. In case the real reason
          // is JSON related the printed reason will be "Reason: Unable to parse", in case of YAML related
          // reason the true reason will be printed, since YAML parser throws an error object with needed
          // data.

          if (!isKindValid($scope.resource)) {
            return;
          }

          $scope.resourceKind = $scope.resource.kind;
          $scope.resourceKind.endsWith("List") ? $scope.isList = true : $scope.isList = false;

          if (!isMetadataValid($scope.resource)) {
            return;
          }
          if ($scope.isList) {
            $scope.resourceList = $scope.resource.items;
            $scope.resourceName = '';
          } else {
            $scope.resourceList = [$scope.resource];
            $scope.resourceName = $scope.resource.metadata.name;
            if ($scope.resourceKind === "Template") {
              $scope.templateOptions = {
                process: true,
                add: false
              };
            }
          }

          $scope.updateResources = [];
          $scope.createResources = [];

          var resourceCheckPromises = [];
          $scope.errorOccurred = false;
          _.forEach($scope.resourceList, function(item) {
            if (!isMetadataValid(item)) {
              $scope.errorOccurred = true;
              return false;
            }
            resourceCheckPromises.push(checkIfExists(item));
          });

          createProjectIfNecessary().then(function(project) {
            $scope.input.selectedProject = project;
            $q.all(resourceCheckPromises).then(function() {
              if ($scope.errorOccurred) {
                return;
              }
              // If resource is Template and it doesn't exist in the project
              if ($scope.createResources.length === 1 && $scope.resourceList[0].kind === "Template") {
                openTemplateProcessModal();
                // Else if any resources already exist
              } else if (!_.isEmpty($scope.updateResources)) {
                $scope.updateTemplate = $scope.updateResources.length === 1 && $scope.updateResources[0].kind === "Template";
                if ($scope.updateTemplate) {
                  openTemplateProcessModal();
                } else {
                  confirmReplace();
                }
              } else {
                QuotaService.getLatestQuotaAlerts($scope.createResources, {namespace: $scope.input.selectedProject.metadata.name}).then(showWarningsOrCreate);
              }
            });
          }, function(e) {
            if (e.data.reason === 'AlreadyExists') {
              $scope.projectNameTaken = true;
            } else {
              NotificationsService.addNotification({
                id: "import-create-project-error",
                type: "error",
                message: "An error occurred creating project.",
                details: getErrorDetails(e)
              });
            }
          });
        };

        $scope.cancel = function() {
          hideErrorNotifications();
          Navigate.toProjectOverview($scope.input.selectedProject.metadata.name);
        };

        // Takes item that will be inspect kind field.
        function isKindValid(item) {
          if (!item.kind) {
            $scope.error = {
              message: "Resource is missing kind field."
            };
            return false;
          }
          return true;
        }

        // Takes item that will be inspect metadata fields and if the item is meant to be created in current namespace
        function isMetadataValid(item) {
          if ($scope.isList) {
            return true;
          }
          if (!item.metadata) {
            $scope.error = {
              message: "Resource is missing metadata field."
            };
            return false;
          }
          if (!item.metadata.name) {
            $scope.error = {
              message: "Resource name is missing in metadata field."
            };
            return false;
          }
          if (item.metadata.namespace && item.metadata.namespace !== $scope.input.selectedProject.metadata.name) {
            $scope.error = {
              message: item.kind + " " + item.metadata.name + " can't be created in project " + item.metadata.namespace + ". Can't create resource in different projects."
            };
            return false;
          }
          return true;
        }

        function openTemplateProcessModal() {
          var modalInstance = $uibModal.open({
            templateUrl: 'views/modals/process-or-save-template.html',
            controller: 'ProcessOrSaveTemplateModalController',
            scope: $scope
          });
          modalInstance.result.then(function() {
            if ($scope.templateOptions.add) {
              createAndUpdate();
            } else {
              CachedTemplateService.setTemplate($scope.resourceList[0]);
              redirect();
            }
          });
        }

        function confirmReplace() {
          var modalInstance = $uibModal.open({
            templateUrl: 'views/modals/confirm-replace.html',
            controller: 'ConfirmReplaceModalController',
            scope: $scope
          });
          modalInstance.result.then(function() {
            QuotaService.getLatestQuotaAlerts($scope.createResources, {namespace: $scope.input.selectedProject.metadata.name}).then(showWarningsOrCreate);
          });
        }

        function createAndUpdate() {
          var createResourcesSum = $scope.createResources.length,
            updateResourcesSum = $scope.updateResources.length;

          if (!$scope.resourceKind.endsWith("List")) {
            createUpdateSingleResource();
          } else {
            var createUpdatePromises = [];
            if (updateResourcesSum > 0) {
              createUpdatePromises.push(updateResourceList());
            }
            if (createResourcesSum > 0) {
              createUpdatePromises.push(createResourceList());
            }
            $q.all(createUpdatePromises).then(redirect);
          }
        }

        // Redirect to newFromTemplate page in case the resource type is Template and user wants to process it.
        // When redirecting to newFromTemplate page, use the cached Template if user doesn't adds it into the
        // namespace by the create process or if the template is being updated.
        function redirect() {
          var path, namespace;

          hideErrorNotifications();
          if ($scope.resourceKind === "Template" && $scope.templateOptions.process && !$scope.errorOccurred) {
            if ($scope.isDialog) {
              $scope.$emit('fileImportedFromYAMLOrJSON', {
                project: $scope.input.selectedProject,
                template: $scope.resource
              });
            }
            else {
              namespace = ($scope.templateOptions.add || $scope.updateResources.length > 0) ? $scope.input.selectedProject.metadata.name : "";
              path = Navigate.createFromTemplateURL($scope.resource, $scope.input.selectedProject.metadata.name, {namespace: namespace});
              $location.url(path);
            }
          }
          else if ($scope.isDialog) {
            $scope.$emit('fileImportedFromYAMLOrJSON', {
              project: $scope.input.selectedProject,
              resource: $scope.resource,
              isList: $scope.isList
            });
          }
          else {
            path = Navigate.projectOverviewURL($scope.input.selectedProject.metadata.name);
            $location.url(path);
          }
        }

        function checkIfExists(item) {

          // check for invalid and unsupported object kind and version
          var resourceGroupVersion = APIService.objectToResourceGroupVersion(item);
          if (!resourceGroupVersion) {
            $scope.errorOccurred = true;
            $scope.error = { message: APIService.invalidObjectKindOrVersion(item) };
            return;
          }
          if (!APIService.apiInfo(resourceGroupVersion)) {
            $scope.errorOccurred = true;
            $scope.error = { message: APIService.unsupportedObjectKindOrVersion(item) };
            return;
          }

          // Check if the resource already exists. If it does, replace it spec with the new one.
          return DataService.get(resourceGroupVersion, item.metadata.name, {namespace: $scope.input.selectedProject.metadata.name}, {errorNotification: false}).then(
            // resource does exist
            function(resource) {
              // All fields, except 'metadata' will be copied from the submitted file.
              var updatedResource = angular.copy(item);
              // Update only 'annotations' and 'labels' fields from the metadata field.
              var updatedMetadata = angular.copy(resource.metadata);
              updatedMetadata.annotations = item.metadata.annotations;
              updatedMetadata.labels = item.metadata.labels;

              updatedResource.metadata = updatedMetadata;
              $scope.updateResources.push(updatedResource);
            },
            // resource doesn't exist with RC 404 or catch other RC
            function() {
              // Either it didn't exist already or we couldn't validate existence for some reason, just continue on
              // and try to create it.
              var createResource = angular.copy(item);
              // Remove resourceVersion if set like `oc create`.
              _.unset(createResource, 'metadata.resourceVersion');
              $scope.createResources.push(createResource);
          });
        }

        // createUpdateSingleResource function will create/update just a single resource on a none-List resource kind.
        function createUpdateSingleResource() {
          var resource;
          if (!_.isEmpty($scope.createResources)) {
            resource = _.head($scope.createResources);
            DataService.create(APIService.objectToResourceGroupVersion(resource), null, resource, {namespace: $scope.input.selectedProject.metadata.name}).then(
              // create resource success
              function() {
                if (!$scope.isDialog) {
                  var kind = humanizeKind(resource.kind);
                  NotificationsService.addNotification({
                    type: "success",
                    message: _.capitalize(kind) + " " + resource.metadata.name + " was successfully created."
                  });
                }

                redirect();
              },
              // create resource failure
              function(result) {
                NotificationsService.addNotification({
                  id: "from-file-error",
                  type: "error",
                  message: "Unable to create the " + humanizeKind(resource.kind) + " '" + resource.metadata.name + "'.",
                  details: $filter('getErrorDetails')(result)
                });
              });
          } else {
            resource = _.head($scope.updateResources);
            DataService.update(APIService.objectToResourceGroupVersion(resource), resource.metadata.name, resource, {namespace: $scope.input.selectedProject.metadata.name}).then(
              // update resource success
              function() {
                if (!$scope.isDialog) {
                  var kind = humanizeKind(resource.kind);
                  NotificationsService.addNotification({
                    type: "success",
                    message: _.capitalize(kind) + " " + resource.metadata.name + " was successfully updated."
                  });
                }

                redirect();
              },
              // update resource failure
              function(result) {
                NotificationsService.addNotification({
                  id: "from-file-error",
                  type: "error",
                  message: "Unable to update the " + humanizeKind(resource.kind) + " '" + resource.metadata.name + "'.",
                  details: $filter('getErrorDetails')(result)
                });
              });
          }
        }

        var displayName = $filter('displayName');
        function createResourceList(){
          var titles = {
            started: "Creating resources in project " + displayName($scope.input.selectedProject),
            success: "Creating resources in project " + displayName($scope.input.selectedProject),
            failure: "Failed to create some resources in project " + displayName($scope.input.selectedProject)
          };
          var helpLinks = {};
          TaskList.add(titles, helpLinks, $scope.input.selectedProject.metadata.name, function() {
            var d = $q.defer();

            DataService.batch($scope.createResources, {namespace: $scope.input.selectedProject.metadata.name}, "create").then(
              function(result) {
                var alerts = [];
                var hasErrors = false;
                if (result.failure.length > 0) {
                  hasErrors = true;
                  $scope.errorOccurred = true;
                  result.failure.forEach(
                    function(failure) {
                      alerts.push({
                        type: "error",
                        message: "Cannot create " + humanizeKind(failure.object.kind) + " \"" + failure.object.metadata.name + "\". ",
                        details: failure.data.message
                      });
                    }
                  );
                  result.success.forEach(
                    function(success) {
                      alerts.push({
                        type: "success",
                        message: "Created " + humanizeKind(success.kind) + " \"" + success.metadata.name + "\" successfully. "
                      });
                    }
                  );
                } else {
                  var alertMsg;
                  if ($scope.isList) {
                    alertMsg = "All items in list were created successfully.";
                  } else {
                    alertMsg = humanizeKind($scope.resourceKind) + " " + $scope.resourceName + " was successfully created.";
                  }
                  alerts.push({ type: "success", message: alertMsg});
                }
                d.resolve({alerts: alerts, hasErrors: hasErrors});
              }
            );
            return d.promise;
          });
        }


        function updateResourceList(){
          var titles = {
            started: "Updating resources in project " + displayName($scope.input.selectedProject),
            success: "Updated resources in project " + displayName($scope.input.selectedProject),
            failure: "Failed to update some resources in project " + displayName($scope.input.selectedProject)
          };
          var helpLinks = {};
          TaskList.add(titles, helpLinks, $scope.input.selectedProject.metadata.name, function() {
            var d = $q.defer();

            DataService.batch($scope.updateResources, {namespace: $scope.input.selectedProject.metadata.name}, "update").then(
              function(result) {
                var alerts = [];
                var hasErrors = false;
                if (result.failure.length > 0) {
                  hasErrors = true;
                  $scope.errorOccurred = true;
                  result.failure.forEach(
                    function(failure) {
                      alerts.push({
                        type: "error",
                        message: "Cannot update " + humanizeKind(failure.object.kind) + " \"" + failure.object.metadata.name + "\". ",
                        details: failure.data.message
                      });
                    }
                  );
                  result.success.forEach(
                    function(success) {
                      alerts.push({
                        type: "success",
                        message: "Updated " + humanizeKind(success.kind) + " \"" + success.metadata.name + "\" successfully. "
                      });
                    }
                  );
                } else {
                  var alertMsg;
                  if ($scope.isList) {
                    alertMsg = "All items in list were updated successfully.";
                  } else {
                    alertMsg = humanizeKind($scope.resourceKind) + " " + $scope.resourceName + " was successfully updated.";
                  }
                  alerts.push({ type: "success", message: alertMsg});
                }
                d.resolve({alerts: alerts, hasErrors: hasErrors});
              },
              function(result) {
                var alerts = [];
                alerts.push({
                    type: "error",
                    message: "An error occurred updating the resources.",
                    details: "Status: " + result.status + ". " + result.data
                  });
                d.resolve({alerts: alerts});
              }
            );
            return d.promise;
          });
        }

        // When the from-file component is displayed in a dialog, the create
        // button is outside the component since it is in the wizard footer. Listen
        // for an event for when the button is clicked.
        $scope.$on('importFileFromYAMLOrJSON', $scope.create);
        $scope.$on('$destroy', hideErrorNotifications);
      }
    };
  });
