"use strict";

angular.module("openshiftConsole")
  .directive("openShift", function ($resource, $q, $filter, QuotaService, ApplicationGenerator, SecurityCheckService, NotificationsService, $routeParams, DataService, TaskList, Navigate, $window, OctopusService) {
    return {
      restrict: 'E',
      scope: {
        project: '=',
        context: '=',
        isDialog: '='
      },
      templateUrl: 'views/directives/open-shift.html',
      link: function ($scope) {
        $scope.octopuses = [];
        $scope.app = {
          APP_NAME: '应用组名称',
          OCTOPUS_API_NAME: 'oc2-api',
          NAMESPACE: namespace,
          K8S_URI: 'http://192.168.1.140:8011',
          REGISTRY_URI: 'http://192.168.1.140:5000',
          SECRET_NAME: 'octopus',
          SECRET_KEY: 'database-root-password',
          SPRING_DATASOURCE_JDBC: 'jdbc:mysql://octopus-db:3306/saturn_console?useUnicode=true&characterEncoding=utf-8&allowMultiQueries=true',
          OCTOPUS_CONSOLE_NAME: 'oc2-console'
        };
        var form = {};

        var ctrl = this;
        var protocol = $window.location.protocol === "http:" ? "http" : "https";
        var hostPortApi = $window.OPENSHIFT_CONFIG.api.k8s.hostPort + $window.OPENSHIFT_CONFIG.api.k8s.prefix;
        var hostPortOapi = $window.OPENSHIFT_CONFIG.api.openshift.hostPort + $window.OPENSHIFT_CONFIG.api.openshift.prefix;
        var namespace = $routeParams.project
        var bearer = 'Bearer'
        var storage = bearer + ' ' + localStorage.getItem('LocalStorageUserStore.token')
        var humanize = $filter('humanize');
        var generatedResources = [];

        function backend($resource) {
          return {getOpenShift: getOpenShift}
        }

        function getOpenShift(data) {
          return $resource(protocol + '://' + hostPortApi + '/v1/namespaces/:namespace/services', {
            namespace: namespace
          }, {
            get: {headers: {'Authorization': storage}}
          });
        }


        function openshiftList() {
          getOpenShift().get(function (data) {
            var nameArry = []
            $scope.inOpenShift = data
            data.items.forEach(function (element, index) {
              nameArry.push(element.metadata.name)
            })
            $scope.octopuses = nameArry.sort()
          })
        }

        openshiftList()
        var displayName = $filter('displayName');
        var humanizeKind = $filter('humanizeKind');
        var createResources = function () {
          var titles = {
            started: "Deploying image " + $scope.app.APP_NAME + " to project " + displayName($scope.project),
            success: "Deployed image " + $scope.app.APP_NAME + " to project " + displayName($scope.project),
            failure: "Failed to deploy image " + $scope.app.APP_NAME + " to project " + displayName($scope.project)
          };
          TaskList.clear();
          TaskList.add(titles, {}, $scope.project.metadata.APP_NAME, function () {
            var d = $q.defer();
            DataService.batch(generatedResources, $scope.context).then(function (result) {
              var alerts, hasErrors = !_.isEmpty(result.failure);
              if (hasErrors) {
                // Show failure alerts.
                alerts = _.map(result.failure, function (failure) {
                  return {
                    type: "error",
                    message: "Cannot create " + humanizeKind(failure.object.kind).toLowerCase() + " \"" + failure.object.metadata.name + "\". ",
                    details: failure.data.message
                  };
                });
                // Show success alerts.
                alerts = alerts.concat(_.map(result.success, function (success) {
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

          Navigate.toNextSteps($scope.app.APP_NAME, $scope.project.metadata.name);

        };
        var quotaAlerts = {};
        var hideErrorNotifications = function () {
          NotificationsService.hideNotification("deploy-image-list-config-maps-error");
          NotificationsService.hideNotification("deploy-image-list-secrets-error");
          _.each(quotaAlerts, function (alert) {
            if (alert.id && (alert.type === 'error' || alert.type === 'warning')) {
              NotificationsService.hideNotification(alert.id);
            }
          });
        };

        $scope.create = function () {
          hideErrorNotifications()
          form = {
            APP_NAME: $scope.app.APP_NAME,
            OCTOPUS_API_NAME: $scope.app.OCTOPUS_API_NAME,
            NAMESPACE: namespace,
            K8S_URI: $scope.app.K8S_URI,
            REGISTRY_URI: $scope.app.REGISTRY_URI,
            SECRET_NAME: $scope.app.SECRET_NAME,
            SECRET_KEY: $scope.app.SECRET_KEY,
            SPRING_DATASOURCE_JDBC: $scope.app.SPRING_DATASOURCE_JDBC,
            OCTOPUS_CONSOLE_NAME: $scope.app.OCTOPUS_CONSOLE_NAME
          }
          var getServiceV1Data = OctopusService.findServiceV1(form)
          var getDeploymentConfigv1Data = OctopusService.findDeploymentConfigV1(form)
          var getServiceV2Data = OctopusService.findServiceV2(form)
          var getDeploymentConfigv2Data = OctopusService.findDeploymentConfigV2(form)

          generatedResources = [getServiceV1Data, getDeploymentConfigv1Data, getServiceV2Data, getDeploymentConfigv2Data];

          createResources();
        }
      }
    }
  })
