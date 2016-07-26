'use strict';

angular.module('openshiftConsole')
  .directive('serviceGroupNotifications', function($filter, Navigate, gettextCatalog) {
    return {
      restrict: 'E',
      scope: {
        service: '=',
        childServices: '=',
        deploymentConfigsByService: '=',
        deploymentsByService: '=',
        podsByDeployment: '=',
        collapsed: '='
      },
      templateUrl: 'views/directives/service-group-notifications.html',
      link: function($scope) {
        var alertHiddenKey = function(alertID) {
          var namespace = _.get($scope, 'service.metadata.namespace');
          return 'hide/alert/' + namespace + '/' + alertID;
        };

        var isAlertHidden = function(alertID) {
          var key = alertHiddenKey(alertID);
          return localStorage.getItem(key) === 'true';
        };

        var hideAlert = function(alertID) {
          var key = alertHiddenKey(alertID);
          localStorage.setItem(key, 'true');
        };

        var hasHealthChecks = $filter('hasHealthChecks');
        var alerts = $scope.alerts = {};
        var svcs = [];
        var setDCNotifications = function() {
           _.each(svcs, function(svc) {
             var svcName = _.get(svc, "metadata.name", '');
            // Get notifications for DCs in this service group
            if ($scope.deploymentConfigsByService) {
              _.each($scope.deploymentConfigsByService[svcName], function(dc) {
                var id = "health_checks_" + dc.metadata.uid;
                if (!hasHealthChecks(dc.spec.template)) {
                  if (isAlertHidden(id)) {
                    return;
                  }
                  alerts[id] = {
                    type: "info",
                    message: gettextCatalog.getString("{{name}} has containers without health checks, which ensure your application is running correctly.", {name: dc.metadata.name}),
                    onClose: function() {
                      hideAlert(id);
                    }
                  };
                  if ($filter('canI')("deploymentconfigs", "update")) {
                    alerts[id].links = [{
                                          href: Navigate.healthCheckURL(dc.metadata.namespace, "DeploymentConfig", dc.metadata.name),
                                          label: gettextCatalog.getString("Add health checks")
                                        }];
                  }
                }
                else {
                  delete alerts[id];
                }
              });
            }
          });
        };

        var setDeploymentNotifications = function() {
          var groupedPodWarnings = {};
          // clear out pod warning alerts
          _.each(alerts, function(alert, alertId) {
            if (alertId.indexOf("pod_warning") >= 0) {
              delete alert[alertId];
            }
          });
          _.each(svcs, function(svc) {
            // Get notifications for deployments in this service group
            var svcName = _.get(svc, "metadata.name", '');
            if ($scope.deploymentsByService && $scope.podsByDeployment) {
              _.each($scope.deploymentsByService[svcName], function(deployment) {
                $filter('groupedPodWarnings')($scope.podsByDeployment[deployment.metadata.name], groupedPodWarnings);
              });
            }
          });

          _.each(groupedPodWarnings, function(podWarnings, groupID) {
            var warning = _.head(podWarnings);
            if (!warning) {
              return;
            }

            var alertID = "pod_warning" + groupID;
            var alert = {
              type: "warning",
              message: warning.message
            };

            // Handle certain warnings specially.
            switch (warning.reason) {
            case "NonZeroExit":
              // Add a View Log link for crashing containers.
              var podLink = Navigate.resourceURL(warning.pod, "Pod", $scope.service.metadata.namespace);
              var logLink = URI(podLink).addSearch({ tab: "logs", container: warning.container }).toString();
              alert.links = [{
                href: logLink,
                label: gettextCatalog.getString("View Log")
              }];
              break;

            case "NonZeroExitTerminatingPod":
              // Allow users to permanently dismiss the non-zero exit code message for terminating pods.
              if (isAlertHidden(alertID)) {
                return;
              }

              alert.links = [{
                href: "",
                label: gettextCatalog.getString("Don't show me again"),
                onClick: function() {
                  // Hide the alert on future page loads.
                  hideAlert(alertID);

                  // Return true close the existing alert.
                  return true;
                }
              }];
              break;
            }

            alerts[alertID] = alert;
          });
        };

        $scope.showAlert = function(alert) {
          if (!$scope.collapsed) {
            return true;
          }

          // Hide info alerts when collapsed.
          return alert.type !== 'info';
        };

        // TODO worried about how this will perform
        $scope.$watchGroup(['service', 'childServices'], function() {
          svcs = ($scope.childServices || []).concat([$scope.service]);
          setDCNotifications();
          setDeploymentNotifications();
        });
        $scope.$watch('deploymentConfigsByService', function() {
          setDCNotifications();
        });
        $scope.$watchGroup(['podsByDeployment', 'deploymentsByService'], function() {
          setDeploymentNotifications();
        });
      }
    };
  });
