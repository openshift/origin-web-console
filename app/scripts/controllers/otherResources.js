'use strict';

/**
 * @ngdoc function
 * @name openshiftConsole.controller:OtherResourcesController
 * @description
 * # ProjectController
 * Controller of the openshiftConsole
 */
angular.module('openshiftConsole')
  .controller('OtherResourcesController', function ($routeParams, $scope, AlertMessageService, AuthorizationService, DataService, ProjectsService, $filter, LabelFilter, Logger, APIService, gettextCatalog ) {
    $scope.projectName = $routeParams.project;
    $scope.labelSuggestions = {};
    $scope.alerts = $scope.alerts || {};
    $scope.emptyMessage = gettextCatalog.getString("Select a resource from the list above ...");
    $scope.kindSelector = {disabled: true};
    $scope.kinds = _.filter(APIService.availableKinds(), function(kind) {
      switch (kind.kind) {
        case "ReplicationController":
        case "DeploymentConfig":
        case "BuildConfig":
        case "Build":
        case "Pod":
        case "PersistentVolumeClaim":
        case "Event":
        case "Service":
        case "Route":
        case "ImageStream":
        case "ImageStreamTag":
        case "ImageStreamImage":
        case "ImageStreamImport":
        case "ImageStreamMapping":
        case "Deployment":
        case "LimitRange":
        case "ResourceQuota":
          return false;
        default:
          return true;
      }
    });

    // get and clear any alerts
    AlertMessageService.getAlerts().forEach(function(alert) {
      $scope.alerts[alert.name] = alert.data;
    });
    AlertMessageService.clearAlerts();

    ProjectsService
      .get($routeParams.project)
      .then(_.spread(function(project, context) {
        $scope.kinds = _.filter($scope.kinds, function(kind){
          var resource = APIService.kindToResource(kind.kind);
          return AuthorizationService.canI("list", kind.group ? kind.group + "/" + resource : resource, $scope.projectName);
        });
        $scope.project = project;
        $scope.context = context;
        $scope.kindSelector.disabled = false;
      }));

    function updateFilterWarning() {
      if (!LabelFilter.getLabelSelector().isEmpty() && $.isEmptyObject($scope.resources)  && !$.isEmptyObject($scope.unfilteredResources)) {
        $scope.alerts["resources"] = {
          type: "warning",
          details: gettextCatalog.getString("The active filters are hiding all {{kind}}.", {kind: APIService.kindToResource($scope.kindSelector.selected.kind, true)})
        };
      }
      else {
        delete $scope.alerts["resources"];
      }
    }
    
    function loadKind() {
      var selected = $scope.kindSelector.selected;
      if (!selected) {
        return;
      }
      $scope.selectedResource = (selected.group) ? selected.group + "/" + APIService.kindToResource(selected.kind) : APIService.kindToResource(selected.kind);
      // TODO - We can't watch because some of these resources do not support it (roles and rolebindings)
      DataService.list({
          group: selected.group,
          resource: APIService.kindToResource(selected.kind)
        }, $scope.context, function(resources) {
        $scope.unfilteredResources = resources.by("metadata.name");
        // Clear the suggestions since they'll be different for each resource type
        $scope.labelSuggestions = {};
        LabelFilter.addLabelSuggestionsFromResources($scope.unfilteredResources, $scope.labelSuggestions);
        LabelFilter.setLabelSuggestions($scope.labelSuggestions);
        $scope.resources = LabelFilter.getLabelSelector().select($scope.unfilteredResources);
        $scope.emptyMessage = gettextCatalog.getString("No {{kind}} to show", {kind: APIService.kindToResource(selected.kind, true)});
        updateFilterWarning();
      });   
    }
    $scope.loadKind = loadKind;
    $scope.$watch("kindSelector.selected", function() {
      $scope.alerts = {};
      loadKind();
    });
    
    var humanizeKind = $filter("humanizeKind");
    $scope.matchKind = function(kind, search) {     
      return humanizeKind(kind).toLowerCase().indexOf(search.toLowerCase()) !== -1;
    };
      
    LabelFilter.onActiveFiltersChanged(function(labelSelector) {
      // trigger a digest loop
      $scope.$apply(function() {
        $scope.resources = labelSelector.select($scope.unfilteredResources);
        updateFilterWarning();
      });
    });
  });
