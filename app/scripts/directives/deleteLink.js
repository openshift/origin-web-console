'use strict';

angular.module("openshiftConsole")
  .directive("deleteLink",
             function($uibModal,
                      $location,
                      $filter,
                      $q,
                      hashSizeFilter,
                      APIService,
                      DataService,
                      Navigate,
                      NotificationsService,
                      Logger) {
    return {
      restrict: "E",
      scope: {
        // Resource Kind to delete (e.g., "Pod" or "ReplicationController").
        kind: "@",
        // Optional resource group.
        group: "@?",
        // Optional display name for kind.
        typeDisplayName: "@?",
        // Name of the resource to delete.
        resourceName: "@",
        // The name of the resource's project. Optional if kind === "Project".
        projectName: "@",
        // Alerts object for success and error alerts.
        alerts: "=",
        // Optional display name of the resource to delete.
        displayName: "@",
        // Set to true to disable the delete button.
        disableDelete: "=?",
        // Force the user to enter the name before we'll delete the resource (e.g. for projects).
        typeNameToConfirm: "=?",
        // Optional link label. Defaults to "Delete".
        label: "@?",
        // Only show a delete icon with no text.
        buttonOnly: "@",
        // Stay on the current page without redirecting to the resource list.
        stayOnCurrentPage: "=?",
        // Array of associated HPAs for this resource. If set, prompts the user to delete the HPA resources as well.
        hpaList: "=?",
        // Optional callback when the delete succeeds
        success: "=?",
        // Optional redirect URL when the delete succeeds
        redirectUrl: "@?"
      },
      templateUrl: function(elem, attr) {
        if (angular.isDefined(attr.buttonOnly)) {
          return "views/directives/delete-button.html";
        }

        return "views/directives/delete-link.html";
      },
      // Replace so ".dropdown-menu > li > a" styles are applied.
      replace: true,
      link: function(scope, element, attrs) {
        if (attrs.kind === 'Project') {
          scope.isProject = true;
        }

        // Checkbox value
        scope.options = {
          deleteHPAs: true
        };

        var showAlert = function(alert) {
          if (scope.stayOnCurrentPage) {
            scope.alerts[alert.name] = alert.data;
          } else {
            NotificationsService.addNotification(alert.data);
          }
        };

        var deleteHPA = function(hpa) {
          return DataService.delete({
            resource: 'horizontalpodautoscalers',
            group: 'autoscaling'
          }, hpa.metadata.name, { namespace: scope.projectName })
          .then(function() {
            NotificationsService.addNotification({
                type: "success",
                message: "Horizontal Pod Autoscaler " + hpa.metadata.name + " was marked for deletion."
            });
          })
          .catch(function(err) {
            showAlert({
              name: hpa.metadata.name,
              data: {
                type: "error",
                message: "Horizontal Pod Autoscaler " + hpa.metadata.name + " could not be deleted."
              }
            });
            Logger.error("HPA " + hpa.metadata.name + " could not be deleted.", err);
          });
        };

        var navigateToList = function() {
          if (scope.stayOnCurrentPage) {
            return;
          }

          if (scope.redirectUrl) {
            $location.url(scope.redirectUrl);
            return;
          }

          if (scope.kind !== 'Project') {
            Navigate.toResourceList(APIService.kindToResource(scope.kind), scope.projectName);
            return;
          }

          if ($location.path() === '/') {
            scope.$emit('deleteProject');
            return;
          }

          var homeRedirect = URI('/');
          $location.url(homeRedirect);
        };

        scope.openDeleteModal = function() {
          if (scope.disableDelete) {
            return;
          }

          // opening the modal with settings scope as parent
          var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/modals/delete-resource.html',
            controller: 'DeleteModalController',
            scope: scope
          });

          modalInstance.result.then(function() {
            // upon clicking delete button, delete resource and send alert
            var kind = scope.kind;
            var resourceName = scope.resourceName;
            var typeDisplayName = scope.typeDisplayName || $filter('humanizeKind')(kind);
            var formattedResource = typeDisplayName + ' ' + "\'"  + (scope.displayName ? scope.displayName : resourceName) + "\'";
            var context = (scope.kind === 'Project') ? {} : {namespace: scope.projectName};

            DataService.delete({
              resource: APIService.kindToResource(kind),
              // group or undefined
              group: scope.group
            }, resourceName, context)
            .then(function() {
              NotificationsService.addNotification({
                  type: "success",
                  message: _.capitalize(formattedResource) + " was marked for deletion."
              });

              if (scope.success) {
                scope.success();
              }

              // Delete any associated HPAs if requested.
              if (scope.options.deleteHPAs) {
                _.each(scope.hpaList, deleteHPA);
              }

              navigateToList();
            })
            .catch(function(err) {
              // called if failure to delete
              scope.alerts[resourceName] = {
                type: "error",
                message: _.capitalize(formattedResource) + "\'" + " could not be deleted.",
                details: $filter('getErrorDetails')(err)
              };
              Logger.error(formattedResource + " could not be deleted.", err);
            });
          });
        };
      }
    };
  });
