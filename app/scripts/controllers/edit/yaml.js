'use strict';

/**
 * @ngdoc function
 * @name openshiftConsole.controller:EditYAMLController
 * @description
 * # EditYAMLController
 * Controller of the openshiftConsole
 */
angular.module('openshiftConsole')
  .controller('EditYAMLController', function ($scope,
                                              $filter,
                                              $location,
                                              $routeParams,
                                              $window,
                                              APIService,
                                              AuthorizationService,
                                              BreadcrumbsService,
                                              DataService,
                                              Navigate,
                                              NotificationsService,
                                              ProjectsService,
                                              gettextCatalog) {
    if (!$routeParams.kind || !$routeParams.name) {
      Navigate.toErrorPage(gettextCatalog.getString("Kind or name parameter missing."));
      return;
    }

    var humanizeKind = $filter('humanizeKind');
    $scope.alerts = {};
    $scope.name = $routeParams.name;
    $scope.resourceURL = Navigate.resourceURL($scope.name, $routeParams.kind, $routeParams.project);
    $scope.breadcrumbs = [{
      title: $routeParams.name,
      // If returnURL is unspecified, the breadcrumbs directive defaults to back.
      link: $routeParams.returnURL
    }, {
      title: gettextCatalog.getString("Edit YAML")
    }];

    var navigateBack = function() {
      $scope.modified = false;
      if ($routeParams.returnURL) {
        $location.url($routeParams.returnURL);
        return;
      }

      // Default to going back in history if no returnURL.
      $window.history.back();
    };

    var watches = [];
    ProjectsService
      .get($routeParams.project)
      .then(_.spread(function(project, context) {
        var resourceGroupVersion = {
          resource: APIService.kindToResource($routeParams.kind),
          group: $routeParams.group
        };

        if (!AuthorizationService.canI(resourceGroupVersion, 'update', $routeParams.project)) {
          Navigate.toErrorPage(gettextCatalog.getString('You do not have authority to update ') +
                               humanizeKind($routeParams.kind) + ' ' + $routeParams.name + '.', 'access_denied');
          return;
        }

        DataService.get(resourceGroupVersion, $scope.name, context, { errorNotification: false }).then(
          function(result) {
            var original = result;

            // Modify a copy of the resource.
            _.set($scope, 'updated.resource', angular.copy(result));
            $scope.$watch('updated.resource', function(updated, previous) {
              // Skip the initial $watch callback when we first add the listener.
              if (updated === previous) {
                return;
              }

              $scope.modified = true;
            });

            // TODO: Update the BreadcrumbsService to handle types without browse pages.
            // $scope.breadcrumbs = BreadcrumbsService.getBreadcrumbs({
            //   object: resource,
            //   subpage: 'Edit YAML',
            //   includeProject: true
            // });

            var getVersion = function(resource) {
              return _.get(resource, 'metadata.resourceVersion');
            };

            $scope.save = function() {
              var updated = $scope.updated.resource;
              $scope.modified = false;
              if (updated.kind !== original.kind) {
                $scope.error = {
                  message: gettextCatalog.getString('Cannot change resource kind (original: ') + original.kind + ', modified: ' + (updated.kind || '<unspecified>') + ').'
                };
                return;
              }

              var groupVersion = APIService.objectToResourceGroupVersion(original);
              var updatedGroupVersion = APIService.objectToResourceGroupVersion(updated);
              if (!updatedGroupVersion) {
                $scope.error = { message: APIService.invalidObjectKindOrVersion(updated) };
                return;
              }
              if (updatedGroupVersion.group !== groupVersion.group) {
                $scope.error = { message: gettextCatalog.getString('Cannot change resource group (original: ') + (groupVersion.group || '<none>') + ', modified: ' + (updatedGroupVersion.group || '<none>') + ').' };
                return;
              }
              if (!APIService.apiInfo(updatedGroupVersion)) {
                $scope.error = { message: APIService.unsupportedObjectKindOrVersion(updated) };
                return;
              }

              $scope.updatingNow = true;
              DataService.update(groupVersion, original.metadata.name, updated, {
                namespace: original.metadata.namespace
              }).then(
                // success
                function(response) {
                  var editedResourceVersion = _.get(updated, 'metadata.resourceVersion');
                  var newResourceVersion = _.get(response, 'metadata.resourceVersion');
                  if (newResourceVersion === editedResourceVersion) {
                    $scope.alerts['no-changes-applied'] = {
                      type: "warning",
                      message: gettextCatalog.getString("No changes were applied to {{kind}} {{name}}.", {kind: humanizeKind($routeParams.kind), name: $routeParams.name}),
                      details: gettextCatalog.getString("Make sure any new fields you may have added are supported API fields.")
                    };
                    $scope.updatingNow = false;
                    return;
                  }
                  NotificationsService.addNotification({
                      type: "success",
                      message: humanizeKind($routeParams.kind, true) + " " + $routeParams.name + gettextCatalog.getString(" was successfully updated.")
                  });
                  navigateBack();
                },
                // failure
                function(result) {
                  $scope.updatingNow = false;
                  $scope.error = {
                    message: $filter('getErrorDetails')(result)
                  };
                });
            };

            $scope.cancel = function() {
              navigateBack();
            };

            // Watch for changes to warn the user. If the watch failes, ignore the error since it's only used for this warning.
            // Some resources don't support watch.
            watches.push(DataService.watchObject(resourceGroupVersion, $scope.name, context, function(newValue, action) {
              $scope.resourceChanged = getVersion(newValue) !== getVersion(original);
              $scope.resourceDeleted = action === "DELETED";
            }, {
              errorNotification: false
            }));
          },
          // GET failure
          function(e) {
            Navigate.toErrorPage(gettextCatalog.getString("Could not load ") + humanizeKind($routeParams.kind) + " '" + $routeParams.name + "'. " + $filter('getErrorDetails')(e));
          });

          $scope.$on('$destroy', function(){
            DataService.unwatchAll(watches);
          });
      }));
  });
