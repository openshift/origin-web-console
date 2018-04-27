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
    KubevirtVersions) {
    $scope.projectName = $routeParams.project;
    $scope.labelSuggestions = {};
    $scope.kindSelector = {disabled: true};
    $scope.kinds = _.filter(APIService.availableKinds(), function(kind) {
      switch (kind.kind) {
        case "AppliedClusterResourceQuota":
        case "Build":
        case "BuildConfig":
        case "ConfigMap":
        case "Deployment":
        case "DeploymentConfig":
        case "Event":
        case "ImageStream":
        case "ImageStreamImage":
        case "ImageStreamImport":
        case "ImageStreamMapping":
        case "ImageStreamTag":
        case "LimitRange":
        case "PersistentVolumeClaim":
        case "Pod":
        case "ReplicaSet":
        case "ReplicationController":
        case "ResourceQuota":
        case "Route":
        case "Secret":
        case "Service":
        case "ServiceInstance":
        case "StatefulSet":
        case KubevirtVersions.virtualMachine.kind:
          return false;
        default:
          return true;
      }
    });
    $scope.clearFilter = function () {
      LabelFilter.clear();
    };

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

    function updateFilterMessage() {
      $scope.filterWithZeroResults = !LabelFilter.getLabelSelector().isEmpty() && _.isEmpty($scope.resources) && !_.isEmpty($scope.unfilteredResources);
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
        $scope.resourceName = APIService.kindToResource(selected.kind, true);
        updateFilterMessage();
      });
    }
    $scope.loadKind = loadKind;
    $scope.$watch("kindSelector.selected", function() {
      LabelFilter.clear();
      loadKind();
    });

    var humanizeKind = $filter("humanizeKind");
    $scope.matchKind = function(kind, search) {
      return humanizeKind(kind).toLowerCase().indexOf(search.toLowerCase()) !== -1;
    };

    LabelFilter.onActiveFiltersChanged(function(labelSelector) {
      // trigger a digest loop
      $scope.$evalAsync(function() {
        $scope.resources = labelSelector.select($scope.unfilteredResources);
        updateFilterMessage();
      });
    });
  });
