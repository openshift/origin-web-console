'use strict';
/* jshint unused: false */

/**
 * @ngdoc function
 * @name openshiftConsole.controller:QuotaController
 * @description
 * # QuotaController
 * Controller of the openshiftConsole
 */
angular.module('openshiftConsole')
  .controller('QuotaController', function ($routeParams,
                                           $scope,
                                           DataService,
                                           ProjectsService,
                                           Logger,
                                           gettextCatalog) {
    $scope.projectName = $routeParams.project;
    $scope.limitRanges = {};
    $scope.limitsByType = {};
    $scope.labelSuggestions = {};
    $scope.alerts = $scope.alerts || {};
    $scope.quotaHelp = gettextCatalog.getString("Limits resource usage within this project.");
    $scope.emptyMessageLimitRanges = gettextCatalog.getString("Loading...");
    $scope.limitRangeHelp = gettextCatalog.getString("Defines minimum and maximum constraints for runtime resources such as memory and CPU.");
    $scope.renderOptions = $scope.renderOptions || {};
    $scope.renderOptions.hideFilterWidget = true;

    var watches = [];

    ProjectsService
      .get($routeParams.project)
      .then(_.spread(function(project, context) {
        $scope.project = project;

        DataService.list("resourcequotas", context, function(quotas) {
          $scope.quotas = quotas.by("metadata.name");
          Logger.log("quotas", $scope.quotas);
        });

        DataService.list("appliedclusterresourcequotas", context, function(quotas) {
          $scope.clusterQuotas = quotas.by("metadata.name");
          $scope.namespaceUsageByClusterQuota = {};
          _.each($scope.clusterQuotas, function(quota, quotaName) {
            if (quota.status) {
              var namespaceUsage = _.find(quota.status.namespaces, { namespace: $routeParams.project });
              $scope.namespaceUsageByClusterQuota[quotaName] = namespaceUsage.status;
            }
          });
          Logger.log("cluster quotas", $scope.clusterQuotas);
        });

        DataService.list("limitranges", context, function(limitRanges) {
          $scope.limitRanges = limitRanges.by("metadata.name");
          $scope.emptyMessageLimitRanges = gettextCatalog.getString("There are no limit ranges set on this project.");
          // Convert to a sane format for a view to a build a table with rows per resource type
          angular.forEach($scope.limitRanges, function(limitRange, name){
            $scope.limitsByType[name] = {};

            angular.forEach(limitRange.spec.limits, function(limit) {
              // We have nested types, top level type is something like "Container"
              var typeLimits = $scope.limitsByType[name][limit.type] = {};
              angular.forEach(limit.max, function(value, type) {
                typeLimits[type] = typeLimits[type] || {};
                typeLimits[type].max = value;
              });
              angular.forEach(limit.min, function(value, type) {
                typeLimits[type] = typeLimits[type] || {};
                typeLimits[type].min = value;
              });
              angular.forEach(limit["default"], function(value, type) {
                typeLimits[type] = typeLimits[type] || {};
                typeLimits[type]["default"] = value;
              });
              angular.forEach(limit.defaultRequest, function(value, type) {
                typeLimits[type] = typeLimits[type] || {};
                typeLimits[type].defaultRequest = value;
              });
              angular.forEach(limit.maxLimitRequestRatio, function(value, type) {
                typeLimits[type] = typeLimits[type] || {};
                typeLimits[type].maxLimitRequestRatio = value;
              });
            });
          });
          Logger.log("limitRanges", $scope.limitRanges);
        });

        $scope.$on('$destroy', function(){
          DataService.unwatchAll(watches);
        });

      }));
  });
