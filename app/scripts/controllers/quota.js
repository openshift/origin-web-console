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
  .controller('QuotaController', function ($filter,
                                           $routeParams,
                                           $scope,
                                           DataService,
                                           ProjectsService,
                                           Logger,
                                           gettext,
                                           gettextCatalog) {
    $scope.projectName = $routeParams.project;
    $scope.limitRanges = {};
    $scope.limitsByType = {};
    $scope.labelSuggestions = {};
    $scope.alerts = $scope.alerts || {};
    $scope.quotaHelp = gettextCatalog.getString(gettext("Limits resource usage within this project."));
    $scope.emptyMessageLimitRanges = gettext("Loading...");
    $scope.limitRangeHelp = gettextCatalog.getString(gettext("Defines minimum and maximum constraints for runtime resources such as memory and CPU."));
    $scope.renderOptions = $scope.renderOptions || {};
    $scope.renderOptions.hideFilterWidget = true;

    var watches = [];

    var usageValue = $filter('usageValue');
    $scope.isAtLimit = function(quota, resourceType) {
      var q = quota.status.total || quota.status;
      var hard = usageValue(_.get(q, ['hard', resourceType]));
      if (!hard) {
        return false;
      }

      var used = usageValue(_.get(q, ['used', resourceType]));
      if (!used) {
        return false;
      }

      return used >= hard;
    };

    // Order the table rows first in the order of the donuts above the table,
    // then alphabetically by humanized label.
    var humanizeQuotaResource = $filter('humanizeQuotaResource');
    var compareResourceType = function(left, right) {
      // CPU Request
      if (left === 'cpu' || left === 'requests.cpu') {
        return right === 'cpu' || right === 'requests.cpu' ? 0 : -1;
      }
      if (right === 'cpu' || right === 'requests.cpu') {
        return 1;
      }

      // Memory Request
      if (left === 'memory' || left === 'requests.memory') {
        return right === 'memory' || right === 'requests.memory' ? 0 : -1;
      }
      if (right === 'memory' || right === 'requests.memory') {
        return 1;
      }

      // CPU Limit
      if (left === 'limits.cpu') {
        return right === 'limits.cpu' ? 0 : -1;
      }
      if (right === 'limits.cpu') {
        return 1;
      }

      // Memory Limit
      if (left === 'limits.memory') {
        return right === 'limits.memory' ? 0 : -1;
      }
      if (right === 'limits.memory') {
        return 1;
      }

      left = humanizeQuotaResource(left);
      right = humanizeQuotaResource(right);
      return left.localeCompare(right);
    };

    var orderTypes = function(quotas) {
      var orderedTypesByQuota = {};
      _.each(quotas, function(quota) {
        var specHard = _.get(quota, 'spec.quota.hard') || _.get(quota, 'spec.hard');
        var orderedTypes = _.keys(specHard).sort(compareResourceType);
        orderedTypesByQuota[quota.metadata.name] = orderedTypes;
      });

      return orderedTypesByQuota;
    };

    ProjectsService
      .get($routeParams.project)
      .then(_.spread(function(project, context) {
        $scope.project = project;

        DataService.list("resourcequotas", context).then(function(resp) {
          $scope.quotas = _.sortBy(resp.by("metadata.name"), "metadata.name");
          $scope.orderedTypesByQuota = orderTypes($scope.quotas);
          Logger.log("quotas", $scope.quotas);
        });

        DataService.list("appliedclusterresourcequotas", context).then(function(resp) {
          $scope.clusterQuotas = _.sortBy(resp.by("metadata.name"), "metadata.name");
          $scope.orderedTypesByClusterQuota = orderTypes($scope.clusterQuotas);
          $scope.namespaceUsageByClusterQuota = {};
          _.each($scope.clusterQuotas, function(quota) {
            if (quota.status) {
              var namespaceUsage = _.find(quota.status.namespaces, { namespace: $routeParams.project });
              $scope.namespaceUsageByClusterQuota[quota.metadata.name] = namespaceUsage.status;
            }
          });
          Logger.log("cluster quotas", $scope.clusterQuotas);
        });

        DataService.list("limitranges", context).then(function(resp) {
          $scope.limitRanges = _.sortBy(resp.by("metadata.name"), "metadata.name");
          $scope.emptyMessageLimitRanges = gettext("There are no limit ranges set on this project.");
          // Convert to a sane format for a view to a build a table with rows per resource type
          angular.forEach($scope.limitRanges, function(limitRange){
            var name = limitRange.metadata.name;
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
