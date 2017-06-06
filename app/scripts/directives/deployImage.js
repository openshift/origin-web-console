"use strict";

angular.module("openshiftConsole")
  .directive("deployImage", function($filter,
                                     $q,
                                     $window,
                                     $uibModal,
                                     ApplicationGenerator,
                                     DataService,
                                     ImagesService,
                                     Navigate,
                                     ProjectsService,
                                     QuotaService,
                                     TaskList,
                                     SecretsService,
                                     keyValueEditorUtils) {
    return {
      restrict: 'E',
      scope: {
        project: '=',
        context: '=',
        alerts: '='
      },
      templateUrl: 'views/directives/deploy-image.html',
      link: function($scope) {
        // Pick from an image stream tag or Docker image name.
        $scope.mode = "istag"; // "istag" or "dockerImage"

        // Selected image stream tag.
        $scope.istag = {};

        $scope.app = {};
        $scope.env = [];
        $scope.labels = [];
        $scope.systemLabels = [{
          name: 'app',
          value: ''
        }];
        $scope.pullSecrets = [{name: ''}];

        var orderByDisplayName = $filter('orderByDisplayName');
        var getErrorDetails = $filter('getErrorDetails');

        var displayError = function(errorMessage, errorDetails) {
          $scope.alerts['from-value-objects'] = {
            type: "error",
            message: errorMessage,
            details: errorDetails
          };
        };

        var configMapDataOrdered = [];
        var secretDataOrdered = [];
        var context = {namespace: $scope.project};
        $scope.valueFromObjects = [];

        DataService.list("configmaps", context, null, { errorNotification: false }).then(function(configMapData) {
          configMapDataOrdered = orderByDisplayName(configMapData.by("metadata.name"));
          $scope.valueFromObjects = configMapDataOrdered.concat(secretDataOrdered);
        }, function(e) {
          if (e.code === 403) {
           return;
          }

          displayError('Could not load config maps', getErrorDetails(e));
        });

        DataService.list("secrets", context, null, { errorNotification: false }).then(function(secretData) {
          secretDataOrdered = orderByDisplayName(secretData.by("metadata.name"));
          $scope.valueFromObjects = secretDataOrdered.concat(configMapDataOrdered);
          var secretsByType = SecretsService.groupSecretsByType(secretData);
          var secretNamesByType =_.mapValues(secretsByType, function(secretData) {return _.map(secretData, 'metadata.name');});
          // Add empty option to the image/source secrets
          $scope.secretsByType = _.each(secretNamesByType, function(secretsArray) {
            secretsArray.unshift("");
          });
        }, function(e) {
          if (e.code === 403) {
            return;
          }

          displayError('Could not load secrets', getErrorDetails(e));
        });

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
          var userLabels = keyValueEditorUtils.mapEntries(keyValueEditorUtils.compactEntries($scope.labels));
          var systemLabels = keyValueEditorUtils.mapEntries(keyValueEditorUtils.compactEntries($scope.systemLabels));

          return ImagesService.getResources({
            name: $scope.app.name,
            image: $scope.import.name,
            namespace: $scope.import.namespace,
            tag: $scope.import.tag || 'latest',
            ports: $scope.ports,
            volumes: $scope.volumes,
            env: keyValueEditorUtils.compactEntries($scope.env),
            labels: _.extend(systemLabels, userLabels),
            pullSecrets: $scope.pullSecrets
          });
        }

        $scope.findImage = function() {
          $scope.loading = true;
          ImagesService.findImage($scope.imageName, $scope.context)
            .then(
              // success
              function(response) {
                $scope.import = response;
                $scope.loading = false;

                if (_.get(response, 'result.status') !== 'Success') {
                  $scope.import.error = _.get(response, 'result.message', 'An error occurred finding the image.');
                  return;
                }

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
                $scope.import.error = $filter('getErrorDetails')(response) || 'An error occurred finding the image.';
                $scope.loading = false;
              });
          };

          $scope.$watch('app.name', function() {
            $scope.nameTaken = false;
            _.set(
              _.find($scope.systemLabels, { name: 'app' }),
              'value',
              $scope.app.name);
          });

          $scope.$watch('mode', function(newMode, oldMode) {
            if (newMode === oldMode) {
              return;
            }

            delete $scope.import;
            $scope.istag = {};
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
            DataService.get('imagestreamimages', dockerRef, { namespace: istag.namespace }).then(function(response) {
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

          var generatedResources;
          var createResources = function() {
            var titles = {
              started: "Deploying image " + $scope.app.name + " to project " + $scope.project + ".",
              success: "Deployed image " + $scope.app.name + " to project " + $scope.project + ".",
              failure: "Failed to deploy image " + $scope.app.name + " to project " + $scope.project + "."
            };
            TaskList.clear();
            TaskList.add(titles, {}, $scope.project, function() {
              var d = $q.defer();
              DataService.batch(generatedResources, $scope.context).then(function(result) {
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

            _.set($scope, 'confirm.doneEditing', true);
            Navigate.toNextSteps($scope.app.name, $scope.project);
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
                    message: "Problems were detected while checking your application configuration.",
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
            var quotaAlerts = result.quotaAlerts || [];
            var errorAlerts = _.filter(quotaAlerts, {type: 'error'});
            if ($scope.nameTaken || errorAlerts.length) {
              $scope.disableInputs = false;
              $scope.alerts = quotaAlerts;
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
            $scope.alerts = {};
            generatedResources = getResources();

            var nameTakenPromise = ApplicationGenerator.ifResourcesDontExist(generatedResources, $scope.project);
            var checkQuotaPromise = QuotaService.getLatestQuotaAlerts(generatedResources, $scope.context);
            // Don't want to wait for the name checks to finish before making the calls to quota
            // so kick off the requests above and then chain the promises here
            var setNameTaken = function(result) {
              $scope.nameTaken = result.nameTaken;
              return checkQuotaPromise;
            };
            nameTakenPromise.then(setNameTaken, setNameTaken).then(showWarningsOrCreate, showWarningsOrCreate);
          };
      }
    };
  });
