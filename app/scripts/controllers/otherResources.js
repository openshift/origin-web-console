'use strict';

angular.module('openshiftConsole')
  .controller('OtherResourcesController', function (
    $routeParams,
    $location,
    $scope,
    AuthorizationService,
    DataService,
    ProjectsService,
    $filter,
    LabelFilter,
    Logger,
    APIService,
    gettext) {
    $scope.projectName = $routeParams.project;
    $scope.labelSuggestions = {};
    $scope.alerts = $scope.alerts || {};
    $scope.emptyMessage = gettext("Select a resource from the list above ...");
    $scope.kindSelector = {disabled: true};
    $scope.kinds = _.filter(APIService.availableKinds(), function(kind) {
      switch (kind.kind) {
        case "ReplicationController":
        case "Deployment":
        case "DeploymentConfig":
        case "BuildConfig":
        case "Build":
        case "ConfigMap":
        case "Pod":
        case "PersistentVolumeClaim":
        case "Event":
        case "Secret":
        case "Service":
        case "Route":
        case "ImageStream":
        case "ImageStreamTag":
        case "ImageStreamImage":
        case "ImageStreamImport":
        case "ImageStreamMapping":
        case "LimitRange":
        case "ReplicaSet":
        case "ResourceQuota":
        case "AppliedClusterResourceQuota":
        case "StatefulSet":
          return false;
        default:
          return true;
      }
    });

    var isListable = function(kind) {
      if(!kind) {
        return;
      }
      var rgv = APIService.kindToResourceGroupVersion(kind);
      var apiInfo = APIService.apiInfo(rgv);
      return apiInfo && apiInfo.verbs ?
              _.includes(apiInfo.verbs, 'list') :
              // if we don't have apiInfo, default to show the item
              // this can happen if the api server is not current
              true;
    };

    $scope.getReturnURL = function() {
      var kind = _.get($scope, 'kindSelector.selected.kind');
      if (!kind) {
        return '';
      }

      return URI.expand("project/{projectName}/browse/other?kind={kind}&group={group}", {
        projectName: $routeParams.project,
        kind: kind,
        group: _.get($scope, 'kindSelector.selected.group', '')
      }).toString();
    };

    var counts;
    $scope.isDuplicateKind = function(kind) {
      if(!counts) {
        counts = _.countBy($scope.kinds, 'kind');
      }
      return counts[kind] > 1;
    };

    var kindExists = function(kind, group) {
      return _.some($scope.kinds, function(next) {
        if (next.kind !== kind) {
          return false;
        }

        if (!next.group && !group) {
          return true;
        }

        return next.group === group;
      });
    };

    ProjectsService
      .get($routeParams.project)
      .then(_.spread(function(project, context) {
        $scope.kinds = _.filter($scope.kinds, function(kind){
          var resourceAndGroup  = {
            resource: APIService.kindToResource(kind.kind),
            group: kind.group || ''
          };
          if(!isListable(kind)) {
            return false;
          }
          // exclude 'projectrequests', subresources, and REVIEW_RESOURCES from the list
          if (AuthorizationService.checkResource(resourceAndGroup.resource)) {
            return AuthorizationService.canI(resourceAndGroup, "list", $scope.projectName);
          } else {
            return false;
          }
        });
        $scope.project = project;
        $scope.context = context;
        $scope.kindSelector.disabled = false;

        // Optional query param to preselect a kind.
        if ($routeParams.kind && kindExists($routeParams.kind, $routeParams.group)) {
          _.set($scope, 'kindSelector.selected.kind', $routeParams.kind);
          _.set($scope, 'kindSelector.selected.group', $routeParams.group || '');
        }
      }));

    function updateFilterWarning() {
      if (!LabelFilter.getLabelSelector().isEmpty() && $.isEmptyObject($scope.resources)  && !$.isEmptyObject($scope.unfilteredResources)) {
        $scope.alerts["resources"] = {
          type: "warning",
          details: "The active filters are hiding all " + APIService.kindToResource($scope.kindSelector.selected.kind, true) + "."
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
      var search = $location.search();
      search.kind = selected.kind;
      search.group = selected.group || '';
      $location.replace().search(search);
      $scope.selectedResource = {resource: APIService.kindToResource(selected.kind), group: (selected.group || '')};
      // TODO - We can't watch because some of these resources do not support it (roles and rolebindings)
      DataService.list({
          group: selected.group,
          resource: APIService.kindToResource(selected.kind)
        }, $scope.context).then(function(resources) {
        $scope.unfilteredResources = resources.by("metadata.name");
        // Clear the suggestions since they'll be different for each resource type
        $scope.labelSuggestions = {};
        LabelFilter.addLabelSuggestionsFromResources($scope.unfilteredResources, $scope.labelSuggestions);
        LabelFilter.setLabelSuggestions($scope.labelSuggestions);
        $scope.resources = LabelFilter.getLabelSelector().select($scope.unfilteredResources);
        $scope.emptyMessage = gettext("No ") + APIService.kindToResource(selected.kind, true) + gettext(" to show");
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
