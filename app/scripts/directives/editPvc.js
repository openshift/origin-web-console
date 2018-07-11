'use strict';

angular.module("openshiftConsole")
  .directive("editPvc",
             function($uibModal,
                      $filter,
                      $routeParams,
                      APIService,
                      DataService,
                      ProjectsService,
                      NotificationsService,
                      Logger) {

    return {
      restrict: "E",
      scope: {
        // pvc object
        pvc: "<",
      },
      template: '<a href="" ng-click="openEditModal()" role="button">Expand PVC</a>',
      replace: true,
      link: function(scope) {

        scope.openEditModal = function() {
          // opening the modal with settings scope as parent
          var modalInstance = $uibModal.open({
            templateUrl: 'views/modals/edit-pvc-resource.html',
            controller: 'EditPvcModalController',
            scope: scope
          });

          var hideErrorNotifications = function() {
            NotificationsService.hideNotification("expand-pvc-error");
          };

          scope.$on('$destroy', hideErrorNotifications);

          modalInstance.result.then(function(updatedSize) {
            hideErrorNotifications();
            var updatedPvc = angular.copy(scope.pvc);
            _.set(updatedPvc, 'spec.resources.requests.storage', updatedSize);
            var kind = scope.pvc.kind;
            var resourceName = scope.pvc.metadata.name;
            var typeDisplayName = $filter('humanizeKind')(kind);
            var formattedResource = typeDisplayName + ' ' + "\'"  + resourceName + "\'";

            DataService.update({
              resource: APIService.kindToResource(kind)
            }, resourceName,
               updatedPvc,
               {namespace: scope.pvc.metadata.namespace })
            .then(function() {
              NotificationsService.addNotification({
                type: "success",
                message: formattedResource + " expand request has been submitted."
              });
            })
            .catch(function(err) {
             // called if failure to edit
              NotificationsService.addNotification({
                id: "expand-pvc-error",
                type: "error",
                message: "Could not save " + formattedResource,
                details: $filter('getErrorDetails')(err)
              });
              Logger.error(formattedResource + " could not be expanded.", err);
            });
          });
        };
      }
    };
  });
