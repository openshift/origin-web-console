'use strict';

angular.module('openshiftConsole')
  .directive('serviceGroupNotifications', function($filter, Navigate) {
    return {
      restrict: 'E',
      scope: {
        service: '=',
        childServices: '=',
        deploymentConfigsByService: '=',
        deploymentsByService: '=',
        podsByDeployment: '='
      },
      templateUrl: 'views/directives/service-group-notifications.html',
      link: function($scope) {
        var alertHiddenKey = function(alertID) {
          return 'hide/alert/' + alertID;
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
                    message: dc.metadata.name + " has containers without health checks, which ensure your application is running correctly.",
                    links: [{
                      href: Navigate.healthCheckURL(dc.metadata.namespace, "DeploymentConfig", dc.metadata.name),
                      label: "Add health checks"
                    }],
                    onClose: function() {
                      hideAlert(id);
                    }
                  };
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
          _.each(groupedPodWarnings, function(podWarnings, groupId) {
            if (podWarnings.length) {
              alerts["pod_warning"+groupId] = {
                type: "warning",
                message: podWarnings[0].message
              };
            }
          });
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
