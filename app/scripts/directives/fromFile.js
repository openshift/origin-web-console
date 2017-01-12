'use strict';

angular.module("openshiftConsole")
  .directive("fromFile", function($q,
                                  $uibModal,
                                  $location,
                                  $filter,
                                  CachedTemplateService,
                                  AlertMessageService,
                                  Navigate,
                                  TaskList,
                                  DataService,
                                  APIService,
                                  QuotaService,
                                  SecurityCheckService) {
    return {
      restrict: "E",
      scope: false,
      templateUrl: "views/directives/from-file.html",
      controller: function($scope) {
        var aceEditorSession;
        var humanizeKind = $filter('humanizeKind');
        TaskList.clear();

        $scope.aceLoaded = function(editor) {
          aceEditorSession = editor.getSession();
          aceEditorSession.setOption('tabSize', 2);
          aceEditorSession.setOption('useSoftTabs', true);
          editor.setDragDelay = 0;
          editor.$blockScrolling = Infinity;
        };

        var checkErrorAnnotations = function() {
          var editorAnnotations = aceEditorSession.getAnnotations();
          $scope.editorErrorAnnotation = _.some(editorAnnotations, { type: 'error' });
        };


        // Determine whats the input format (JSON/YAML) and set appropriate view mode
        var updateEditorMode = _.debounce(function(){
          try {
            JSON.parse($scope.editorContent);
            aceEditorSession.setMode("ace/mode/json");
          } catch (e) {
            try {
              jsyaml.safeLoad($scope.editorContent);
              aceEditorSession.setMode("ace/mode/yaml");
            } catch (e) {}
          }
          $scope.$apply(checkErrorAnnotations);
        }, 300);

        // Check if the editor isn't empty to disable the 'Add' button. Also check in what format the input is in (JSON/YAML) and change
        // the editor accordingly.
        $scope.aceChanged = updateEditorMode;

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

          modalInstance.result.then(createAndUpdate);
        };

        var showWarningsOrCreate = function(result){
          var alerts = SecurityCheckService.getSecurityAlerts($scope.createResources, $scope.projectName);

          // Now that all checks are completed, show any Alerts if we need to
          var quotaAlerts = result.quotaAlerts || [];
          alerts = alerts.concat(quotaAlerts);
          var errorAlerts = _.filter(alerts, {type: 'error'});
          if (errorAlerts.length) {
            $scope.disableInputs = false;
            $scope.alerts = alerts;
          }
          else if (alerts.length) {
             launchConfirmationDialog(alerts);
             $scope.disableInputs = false;
          }
          else {
            createAndUpdate();
          }
        };

        var resource;

        $scope.create = function() {
          $scope.alerts = {};
          delete $scope.error;

          // Trying to auto-detect what format the input is in. Since parsing JSON throws only SyntexError
          // exception if the string to parse is not valid JSON, it is tried first and then the YAML parser
          // is trying to parse the string. If that fails it will print the reason. In case the real reason
          // is JSON related the printed reason will be "Reason: Unable to parse", in case of YAML related
          // reason the true reason will be printed, since YAML parser throws an error object with needed
          // data.
          try {
            resource = JSON.parse($scope.editorContent);
          } catch (e) {
            try {
              resource = jsyaml.safeLoad($scope.editorContent);
            } catch (e) {
              $scope.error = e;
              return;
            }
          }

          if (!isKindValid(resource)) {
            return;
          }

          $scope.resourceKind = resource.kind;
          $scope.resourceKind.endsWith("List") ? $scope.isList = true : $scope.isList = false;

          if (!isMetadataValid(resource)) {
            return;
          }
          if ($scope.isList) {
            $scope.resourceList = resource.items;
            $scope.resourceName = '';
          } else {
            $scope.resourceList = [resource];
            $scope.resourceName = resource.metadata.name;
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
          $scope.errorOccured = false;
          _.forEach($scope.resourceList, function(item) {
            if (!isMetadataValid(item)) {
              $scope.errorOccured = true;
              return false;
            }
            resourceCheckPromises.push(checkIfExists(item));
          });

          $q.all(resourceCheckPromises).then(function() {
            if ($scope.errorOccured) {
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
              QuotaService.getLatestQuotaAlerts($scope.createResources, $scope.context).then(showWarningsOrCreate);
            }
          });
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
          if (item.metadata.namespace && item.metadata.namespace !== $scope.projectName) {
            $scope.error = {
              message: item.kind + " " + item.metadata.name + " can't be created in project " + item.metadata.namespace + ". Can't create resource in different projects."
            };
            return false;
          }
          return true;
        }

        function openTemplateProcessModal() {
          var modalInstance = $uibModal.open({
            animation: true,
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
            animation: true,
            templateUrl: 'views/modals/confirm-replace.html',
            controller: 'ConfirmReplaceModalController',
            scope: $scope
          });
          modalInstance.result.then(function() {
            QuotaService.getLatestQuotaAlerts($scope.createResources, $scope.context).then(showWarningsOrCreate);
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
          _.set($scope, 'confirm.doneEditing', true);

          var path;
          if ($scope.resourceKind === "Template" && $scope.templateOptions.process && !$scope.errorOccured) {
            var namespace = ($scope.templateOptions.add || $scope.updateResources.length > 0) ? $scope.projectName : "";
            path = Navigate.createFromTemplateURL(resource, $scope.projectName, {namespace: namespace});
          } else {
            path = Navigate.projectOverviewURL($scope.projectName);
          }
          $location.url(path);
        }

        function checkIfExists(item) {

          // check for invalid and unsupported object kind and version
          var resourceGroupVersion = APIService.objectToResourceGroupVersion(item);
          if (!resourceGroupVersion) {
            $scope.errorOccured = true;
            $scope.error = { message: APIService.invalidObjectKindOrVersion(item) };
            return;
          }
          if (!APIService.apiInfo(resourceGroupVersion)) {
            $scope.errorOccured = true;
            $scope.error = { message: APIService.unsupportedObjectKindOrVersion(item) };
            return;
          }

          // Check if the resource already exists. If it does, replace it spec with the new one.
          return DataService.get(resourceGroupVersion, item.metadata.name, $scope.context, {errorNotification: false}).then(
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
              $scope.createResources.push(item);
          });
        }

        // createUpdateSingleResource function will create/update just a single resource on a none-List resource kind.
        function createUpdateSingleResource() {
          var resource;
          if (!_.isEmpty($scope.createResources)) {
            resource = _.head($scope.createResources);
            DataService.create(APIService.kindToResource(resource.kind), null, resource, {namespace: $scope.projectName}).then(
              // create resource success
              function() {
                AlertMessageService.addAlert({
                  name: resource.metadata.name,
                  data: {
                    type: "success",
                    message: resource.kind + " " + resource.metadata.name + " was successfully created."
                  }
                });
                redirect();
              },
              // create resource failure
              function(result) {
                $scope.alerts["create"+resource.metadata.name] = {
                  type: "error",
                  message: "Unable to create the " + humanizeKind(resource.kind) + " '" + resource.metadata.name + "'.",
                  details: $filter('getErrorDetails')(result)
                };
              });
          } else {
            resource = _.head($scope.updateResources);
            DataService.update(APIService.kindToResource(resource.kind), resource.metadata.name, resource, {namespace: $scope.projectName}).then(
              // update resource success
              function() {
                AlertMessageService.addAlert({
                  name: resource.metadata.name,
                  data: {
                    type: "success",
                    message: resource.kind + " " + resource.metadata.name + " was successfully updated."
                  }
                });
                redirect();
              },
              // update resource failure
              function(result) {
                $scope.alerts["update"+resource.metadata.name] = {
                  type: "error",
                  message: "Unable to update the " + humanizeKind(resource.kind) + " '" + resource.metadata.name + "'.",
                  details: $filter('getErrorDetails')(result)
                };
              });
          }

        }

        function createResourceList(){
          var titles = {
            started: "Creating resources in project " + $scope.projectName,
            success: "Creating resources in project " + $scope.projectName,
            failure: "Failed to create some resources in project " + $scope.projectName
          };
          var helpLinks = {};
          TaskList.add(titles, helpLinks, $scope.projectName, function() {
            var d = $q.defer();

            DataService.batch($scope.createResources, $scope.context, "create").then(
              function(result) {
                var alerts = [];
                var hasErrors = false;
                if (result.failure.length > 0) {
                  hasErrors = true;
                  $scope.errorOccured = true;
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
            started: "Updating resources in project " + $scope.projectName,
            success: "Updated resources in project " + $scope.projectName,
            failure: "Failed to update some resources in project " + $scope.projectName
          };
          var helpLinks = {};
          TaskList.add(titles, helpLinks, $scope.projectName, function() {
            var d = $q.defer();

            DataService.batch($scope.updateResources, $scope.context, "update").then(
              function(result) {
                var alerts = [];
                var hasErrors = false;
                if (result.failure.length > 0) {
                  hasErrors = true;
                  $scope.errorOccured = true;
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
      }
    };
  });
