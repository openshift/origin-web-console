"use strict";

angular.module("openshiftConsole")
  .directive("deployImage", function($filter,
                                     $q,
                                     $window,
                                     $uibModal,
                                     APIService,
                                     ApplicationGenerator,
                                     DataService,
                                     ImagesService,
                                     Navigate,
                                     NotificationsService,
                                     ProjectsService,
                                     QuotaService,
                                     TaskList,
                                     SecretsService,
                                     keyValueEditorUtils) {

    var imageStreamImagesVersion = APIService.getPreferredVersion('imagestreamimages');
    var configMapsVersion = APIService.getPreferredVersion('configmaps');
    var secretsVersion = APIService.getPreferredVersion('secrets');

    return {
      restrict: 'E',
      scope: {
        project: '=',
        isDialog: '='
      },
      templateUrl: 'views/directives/deploy-image.html',
      controller: function($scope) {
        // Must be initialized the controller. The link function is too late.
        $scope.forms = {};
        $scope.noProjectsCantCreate = false;

        $scope.input = {
          selectedProject: $scope.project
        };

        $scope.$watch('input.selectedProject.metadata.name', function() {
          $scope.projectNameTaken = false;
        });
      },
      link: function($scope) {
        // Pick from an image stream tag or Docker image name.
        $scope.mode = "istag"; // "istag" or "dockerImage"

        // Selected image stream tag.
        $scope.istag = {};

        $scope.app = {};
        $scope.env = [];
        $scope.labels = [{
          name: 'app',
          value: ''
        }];

        $scope.$on('no-projects-cannot-create', function() {
          $scope.noProjectsCantCreate = true;
        });

        var orderByDisplayName = $filter('orderByDisplayName');
        var getErrorDetails = $filter('getErrorDetails');

        var quotaAlerts = {};
        var hideErrorNotifications = function() {
          NotificationsService.hideNotification("deploy-image-list-config-maps-error");
          NotificationsService.hideNotification("deploy-image-list-secrets-error");
          _.each(quotaAlerts, function(alert) {
            if (alert.id && (alert.type === 'error' || alert.type === 'warning')) {
              NotificationsService.hideNotification(alert.id);
            }
          });
        };

        $scope.valueFromNamespace = {};

        var createProjectIfNecessary = function() {
          if (_.has($scope.input.selectedProject, 'metadata.uid')) {
            return $q.when($scope.input.selectedProject);
          }

          var newProjName = $scope.input.selectedProject.metadata.name;
          var newProjDisplayName = $scope.input.selectedProject.metadata.annotations['new-display-name'];
          var newProjDesc = $filter('description')($scope.input.selectedProject);
          return ProjectsService.create(newProjName, newProjDisplayName, newProjDesc);
        };

        var stripTag = $filter('stripTag');
        var stripSHA = $filter('stripSHA');
        var humanizeKind = $filter('humanizeKind');

        var trimNameToLength = function(name) {
          if (name.length > 24) {
            return name.substring(0, 24);
          }

          return name;
        };

        // Change image names like "openshift/hello-openshift:latest" to "hello-openshift", which can be used as an app name.
        var getName = function() {
          // Remove everything through the last '/'.
          var name = _.last($scope.import.name.split('/'));

          // Strip the SHA or tag if present.
          name = stripSHA(name);
          name = stripTag(name);
          name = trimNameToLength(name);

          return name;
        };

        function getResources() {
          var labels = keyValueEditorUtils.mapEntries(keyValueEditorUtils.compactEntries($scope.labels));

          return ImagesService.getResources({
            name: $scope.app.name,
            image: $scope.import.name,
            namespace: $scope.import.namespace,
            tag: $scope.import.tag || 'latest',
            ports: $scope.ports,
            volumes: $scope.volumes,
            env: keyValueEditorUtils.compactEntries($scope.env),
            labels: labels
          });
        }

        $scope.findImage = function() {
          $scope.loading = true;
          ImagesService.findImage($scope.imageName, {namespace: $scope.input.selectedProject.metadata.name})
            .then(
              // success
              function(response) {
                $scope.import = response;
                $scope.loading = false;

                if (_.get(response, 'result.status') !== 'Success') {
                  $scope.import.error = _.get(response, 'result.message', 'An error occurred finding the image.');
                  return;
                }

                $scope.forms.imageSelection.imageName.$setValidity("imageLoaded", true);

                var image = $scope.import.image;
                if (image) {
                  $scope.app.name = getName();
                  $scope.runsAsRoot = ImagesService.runsAsRoot(image);
                  $scope.ports = ApplicationGenerator.parsePorts(image);
                  $scope.volumes = ImagesService.getVolumes(image);
                  $scope.createImageStream = true;
                }
              },
              // failure
              function(response) {
                $scope.import = {
                  error: $filter('getErrorDetails')(response) || 'An error occurred finding the image.'
                };
                $scope.loading = false;
              });
          };

          $scope.$watch('app.name', function(name, previous) {
            $scope.nameTaken = false;

            var appLabel = _.find($scope.labels, { name: 'app' });
            if (appLabel && (!appLabel.value || appLabel.value === previous)) {
              appLabel.value = name;
            }
          });

          $scope.$watch('mode', function(newMode, oldMode) {
            if (newMode === oldMode) {
              return;
            }

            delete $scope.import;
            $scope.istag = {};

            if (newMode === 'dockerImage') {
              $scope.forms.imageSelection.imageName.$setValidity("imageLoaded", false);
            }
            else {
              // reset this to true so it doesn't block form submission
              $scope.forms.imageSelection.imageName.$setValidity("imageLoaded", true);
            }
          });

          $scope.$watch('imageName', function() {
            if ($scope.mode === 'dockerImage') {
              $scope.forms.imageSelection.imageName.$setValidity("imageLoaded", false);
            }
          });

          $scope.$watch('istag', function(istag, old) {
            if (istag === old) {
              return;
            }

            if (!istag.namespace || !istag.imageStream || !istag.tagObject) {
              delete $scope.import;
              return;
            }

            var dockerRef, image = _.get(istag, 'tagObject.items[0].image');
            $scope.app.name = trimNameToLength(istag.imageStream);

            $scope.import = {
              name: istag.imageStream,
              tag: istag.tagObject.tag,
              namespace: istag.namespace
            };

            if (!image) {
              return;
            }

            dockerRef = istag.imageStream + "@" + image;
            $scope.loading = true;
            DataService.get(imageStreamImagesVersion, dockerRef, { namespace: istag.namespace }).then(function(response) {
              $scope.loading = false;
              $scope.import.image = response.image;
              $scope.ports = ApplicationGenerator.parsePorts(response.image);
              $scope.volumes = ImagesService.getVolumes(response.image);
              // Don't show the runs as root warning for image stream tags.
              $scope.runsAsRoot = false;
            }, function(response) {
              $scope.import.error = $filter('getErrorDetails')(response) || 'An error occurred.';
              $scope.loading = false;
            });
          }, true);

          $scope.$watch('input.selectedProject', function(project){
            // clear any existing valueFrom env to avoid invalid data
            $scope.env = _.reject($scope.env, 'valueFrom');

            // if the project doesn't have metadata.uid, that means project creation is occurring
            if (!(_.get(project, 'metadata.uid'))) {
              // image search requires a project, so ensure $scope.mode is set to 'istag'
              $scope.mode = "istag";
              return;
            }
            if ($scope.valueFromNamespace[project.metadata.name]) {
              // if we already have the data, return early
              return;
            }
            var configMapDataOrdered = [];
            var secretDataOrdered = [];

            DataService.list(configMapsVersion, {namespace: $scope.input.selectedProject.metadata.name}, null, { errorNotification: false }).then(function(configMapData) {
              configMapDataOrdered = orderByDisplayName(configMapData.by("metadata.name"));
              $scope.valueFromNamespace[project.metadata.name] = configMapDataOrdered.concat(secretDataOrdered);
            }, function(e) {
              if (e.status === 403) {
               return;
              }

              NotificationsService.addNotification({
                id: "deploy-image-list-config-maps-error",
                type: "error",
                message: "Could not load config maps.",
                details: getErrorDetails(e)
              });
            });

            DataService.list(secretsVersion, {namespace: $scope.input.selectedProject.metadata.name}, null, { errorNotification: false }).then(function(secretData) {
              secretDataOrdered = orderByDisplayName(secretData.by("metadata.name"));
              $scope.valueFromNamespace[project.metadata.name] = secretDataOrdered.concat(configMapDataOrdered);
            }, function(e) {
              if (e.status === 403) {
                return;
              }

              NotificationsService.addNotification({
                id: "deploy-image-list-secrets-error",
                type: "error",
                message: "Could not load secrets.",
                details: getErrorDetails(e)
              });
            });
          });

          var displayName = $filter('displayName');
          var generatedResources;
          var createResources = function() {
            var titles = {
              started: "Deploying image " + $scope.app.name + " to project " + displayName($scope.input.selectedProject),
              success: "Deployed image " + $scope.app.name + " to project " + displayName($scope.input.selectedProject),
              failure: "Failed to deploy image " + $scope.app.name + " to project " + displayName($scope.input.selectedProject)
            };
            TaskList.clear();
            TaskList.add(titles, {}, $scope.input.selectedProject.metadata.name, function() {
              var d = $q.defer();
              DataService.batch(generatedResources, {namespace: $scope.input.selectedProject.metadata.name}).then(function(result) {
                var alerts, hasErrors = !_.isEmpty(result.failure);
                if (hasErrors) {
                  // Show failure alerts.
                  alerts = _.map(result.failure, function(failure) {
                    return {
                      type: "error",
                      message: "Cannot create " + humanizeKind(failure.object.kind).toLowerCase() + " \"" + failure.object.metadata.name + "\". ",
                      details: failure.data.message
                    };
                  });
                  // Show success alerts.
                  alerts = alerts.concat(_.map(result.success, function(success) {
                    return {
                      type: "success",
                      message: "Created " + humanizeKind(success.kind).toLowerCase() + " \"" + success.metadata.name + "\" successfully. "
                    };
                  }));
                } else {
                  // Only show one success message when everything worked.
                  alerts = [{
                    type: "success",
                    message: "All resources for image " + $scope.app.name + " were created successfully."
                  }];
                }
                d.resolve({alerts: alerts, hasErrors: hasErrors});
              });

              return d.promise;
            });

            if ($scope.isDialog) {
              $scope.$emit('deployImageNewAppCreated', {
                project: $scope.input.selectedProject,
                appName: $scope.app.name
              });
            } else {
              Navigate.toNextSteps($scope.app.name, $scope.input.selectedProject.metadata.name);
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
                    details: "Problems were detected while checking your application configuration.",
                    okButtonText: "Create Anyway",
                    okButtonClass: "btn-danger",
                    cancelButtonText: "Cancel"
                  };
                }
              }
            });

            modalInstance.result.then(createResources);
          };

          var showWarningsOrCreate = function(result){
            // Now that all checks are completed, show any warnings if we need to
            quotaAlerts = result.quotaAlerts || [];
            var errorAlerts = _.filter(quotaAlerts, {type: 'error'});
            if ($scope.nameTaken || errorAlerts.length) {
              $scope.disableInputs = false;
              _.each(quotaAlerts, function(alert) {
                alert.id = _.uniqueId('deploy-image-alert-');
                NotificationsService.addNotification(alert);
              });
            }
            else if (quotaAlerts.length) {
              launchConfirmationDialog(quotaAlerts);
              $scope.disableInputs = false;
            }
            else {
              createResources();
            }
          };

          $scope.create = function() {
            $scope.disableInputs = true;
            hideErrorNotifications();
            createProjectIfNecessary().then(function(project) {
              $scope.input.selectedProject = project;
              generatedResources = getResources();

              var nameTakenPromise = ApplicationGenerator.ifResourcesDontExist(generatedResources, $scope.input.selectedProject.metadata.name);
              var checkQuotaPromise = QuotaService.getLatestQuotaAlerts(generatedResources, {namespace: $scope.input.selectedProject.metadata.name});
              // Don't want to wait for the name checks to finish before making the calls to quota
              // so kick off the requests above and then chain the promises here
              var setNameTaken = function(result) {
                $scope.nameTaken = result.nameTaken;
                return checkQuotaPromise;
              };
              nameTakenPromise.then(setNameTaken, setNameTaken).then(showWarningsOrCreate, showWarningsOrCreate);
            }, function(e) {
              $scope.disableInputs = false;
              if (e.data.reason === 'AlreadyExists') {
                $scope.projectNameTaken = true;
              } else {
                NotificationsService.addNotification({
                  id: "deploy-image-create-project-error",
                  type: "error",
                  message: "An error occurred creating project.",
                  details: getErrorDetails(e)
                });
              }
            });
          };

          $scope.openCreateWebhookSecretModal = function() {
            var dialogScope = $scope.$new();
            dialogScope.type = "image";
            dialogScope.namespace = $scope.input.selectedProject.metadata.name;
            $uibModal.open({
              templateUrl: 'views/modals/create-secret.html',
              controller: 'CreateSecretModalController',
              scope: dialogScope
            });
          };

          // When the deploy-image component is displayed in a dialog, the create
          // button is outside the component since it is in the wizard footer. Listen
          // for an event for when the button is clicked.
          $scope.$on('newAppFromDeployImage', $scope.create);
          $scope.$on('$destroy', hideErrorNotifications);
      }
    };
  });
