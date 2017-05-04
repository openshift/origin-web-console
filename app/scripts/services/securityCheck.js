'use strict';

angular.module("openshiftConsole")
  .factory("SecurityCheckService", function(APIService, $filter, Constants) {
    var humanizeKind = $filter('humanizeKind');
    var getSecurityAlerts = function(resources, project) {
      var alerts = [];
      var unrecognizedResources = [];
      var clusterScopedResources = [];
      var roleBindingResources = [];
      var roleResources = [];
      var notWhitelistedResources = [];
      _.each(resources, function(resource) {
        if (!_.get(resource, "kind")) {
          // This isn't a valid API object
          return;
        }
        var rgv = APIService.objectToResourceGroupVersion(resource);
        var apiInfo = APIService.apiInfo(rgv);
        if (!apiInfo) {
          unrecognizedResources.push(resource);
          return;
        }
        if (!apiInfo.namespaced) {
          clusterScopedResources.push(resource);
        }
        else if (rgv.resource === "rolebindings" && (rgv.group === '' || rgv.group === "rbac.authorization.k8s.io")) {
          // If role in the rolebinding is one of the "safe" ones ignore it (view or image puller), otherwise warn
          var roleRef = _.get(resource, 'roleRef.name');
          if (roleRef !== 'view' && roleRef !== 'system:image-puller') {
            roleBindingResources.push(resource);
          }
        }
        else if (rgv.resource === "roles" && (rgv.group === '' || rgv.group === "rbac.authorization.k8s.io")) {
          roleResources.push(resource);
        }
        else if (!_.find(Constants.SECURITY_CHECK_WHITELIST, {resource: rgv.resource, group: rgv.group})) {
          notWhitelistedResources.push(resource);
        }
      });
      if (unrecognizedResources.length) {
        var unrecognizedStrs = _.uniq(_.map(unrecognizedResources, function(resource) {
          var apiVersion = _.get(resource, 'apiVersion', '<none>');
          return 'API version ' + apiVersion + ' for kind ' + humanizeKind(resource.kind);
        }));
        alerts.push({
          type: 'warning',
          message: "Some resources will not be created.",
          details: "The following resource versions are not supported by the server: " + unrecognizedStrs.join(", ")
        });
      }
      if (clusterScopedResources.length) {
        var clusterStrs = _.uniq(_.map(clusterScopedResources, function(resource) {
          return humanizeKind(resource.kind);
        }));
        alerts.push({
          type: 'warning',
          message: "This will create resources outside of the project, which might impact all users of the cluster.",
          details: "Typically only cluster administrators can create these resources. The cluster-level resources being created are: " + clusterStrs.join(", ")
        });
      }
      if (roleBindingResources.length) {
        var roleBindingStrs = [];
        _.each(roleBindingResources, function(resource){
          _.each(resource.subjects, function(subject) {
            var str = humanizeKind(subject.kind) + " ";
            if (subject.kind === 'ServiceAccount') {
              str += (subject.namespace || project) + "/";
            }
            str += subject.name;
            roleBindingStrs.push(str);
          });
        });
        roleBindingStrs = _.uniq(roleBindingStrs);
        alerts.push({
          type: 'warning',
          message: "This will grant permissions to your project.",
          details: "Permissions are being granted to: " + roleBindingStrs.join(", ")
        });
      }
      if (roleResources.length) {
        alerts.push({
          type: 'info',
          message: "This will create additional membership roles within the project.",
          details: "Admins will be able to grant these custom roles to users, groups, and service accounts."
        });
      }
      if (notWhitelistedResources.length) {
        var notWhitelistStrs = _.uniq(_.map(notWhitelistedResources, function(resource) {
          return humanizeKind(resource.kind);
        }));
        alerts.push({
          type: 'warning',
          message: "This will create resources that may have security or project behavior implications.",
          details: "Make sure you understand what they do before creating them. The resources being created are: " + notWhitelistStrs.join(", ")
        });
      }
      return alerts;
    };

    return {
      // Gets security alerts relevant to a set of resources
      // Returns: Array of alerts
      getSecurityAlerts: getSecurityAlerts
    };
  });
