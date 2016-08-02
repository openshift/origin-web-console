'use strict';

angular.module("openshiftConsole")
  .factory("AuthorizationService", function($q, $cacheFactory, Logger, $interval, APIService, DataService){
    
    var currentProject = null;
    var cachedRulesByProject = $cacheFactory('rulesCache', {
          number: 10
        });
    // Permisive mode will cause no checks to be done for the user actions.
    var permissiveMode = false;

    var REVIEW_RESOURCES = ["localresourceaccessreviews", "localsubjectaccessreviews", "resourceaccessreviews", "selfsubjectrulesreviews", "subjectaccessreviews"];

    // Transform data from:
    // rules = {resources: ["jobs"], apiGroups: ["extensions"], verbs:["create","delete","get","list","update"]}
    // into:
    // normalizedRules = {"extensions": {"jobs": ["create","delete","get","list","update"]}}
    var normalizeRules = function(rules) {
      var normalizedRules = {};
      _.each(rules, function(rule) {
        _.each(rule.apiGroups, function(apiGroup) {
          if (!normalizedRules[apiGroup]) {
            normalizedRules[apiGroup] = {};
          }
          _.each(rule.resources, function(resource) {
            normalizedRules[apiGroup][resource] = rule.verbs;
          });
        });
      });
      return normalizedRules;
    };

    // Check if resource name meets one of following conditions, since those resources can't be create/update via `Add to project` page:
    //  - 'projectrequests'
    //  - subresource that contains '/', eg: 'builds/source', 'builds/logs', ...
    //  - resource is in REVIEW_RESOURCES list 
    var checkResource = function(resource) {
      if (resource === "projectrequests" || _.contains(resource, "/") || _.contains(REVIEW_RESOURCES, resource)) {
        return false;
      } else {
        return true;
      }
    };

    // Check if user can create/update any resource on the 'Add to project' so the button will be displayed.
    var canAddToProjectCheck = function(rules) {
      return _.some(rules, function(rule) {
        return _.some(rule.resources, function(resource) {
          return checkResource(resource) && !_.isEmpty(_.intersection(rule.verbs ,(["*", "create", "update"])));
        });
      });
    };

    var getProjectRules = function(projectName) {
      var deferred = $q.defer();
      currentProject = projectName;
      var projectRules = cachedRulesByProject.get(projectName);
      var rulesResource = "selfsubjectrulesreviews";
      if (!projectRules || projectRules.forceRefresh) {
        // Check if APIserver contains 'selfsubjectrulesreviews' resource. If not switch to permissive mode.
        if (APIService.apiInfo(rulesResource)) {
          Logger.log("AuthorizationService, loading user rules for " + projectName + " project");
          var object = {kind: "SelfSubjectRulesReview",
                        apiVersion: "v1"
                      };
          DataService.create(rulesResource, null, object, {namespace: projectName}).then(
            function(data) {
              var normalizedData = normalizeRules(data.status.rules);
              var canUserAddToProject = canAddToProjectCheck(data.status.rules);
              cachedRulesByProject.put(projectName, {rules: normalizedData,
                                                      canAddToProject: canUserAddToProject,
                                                      forceRefresh: false,
                                                      cacheTimestamp: _.now()
                                                    });
              deferred.resolve();
            }, function() {
              permissiveMode = true;
              deferred.resolve();
          });
        } else {
          Logger.log("AuthorizationService, resource 'selfsubjectrulesreviews' is not part of APIserver. Switching into permissive mode.");
          permissiveMode = true;
          deferred.resolve();
        }
      } else {
        // Using cached data.
        Logger.log("AuthorizationService, using cached rules for " + projectName + " project");
        if ((_.now() - projectRules.cacheTimestamp) >= 600000) {
          projectRules.forceRefresh = true;
        }
        deferred.resolve();
      }
      return deferred.promise;
    };

    var getRulesForProject = function(projectName) {
      return _.get(cachedRulesByProject.get(projectName || currentProject), ['rules']);
    };

    // _canI checks whether any rule allows the specified verb (directly or via a wildcard verb) on the literal group and resource.
    var _canI = function(rules, verb, group, resource) {
        var resources = rules[group];
        if (!resources) { 
          return false;
        }
        var verbs = resources[resource];
        if (!verbs) { 
          return false;
        }
        return _.contains(verbs, verb) || _.contains(verbs, '*');
    };

    // canI checks whether any rule allows the specified verb on the specified group-resource (directly or via a wildcard rule).
    var canI = function(resource, verb, projectName) {
      if (permissiveMode) {
        return true;
      }

      // normalize to structured form
      var r = APIService.toResourceGroupVersion(resource);
      var rules = getRulesForProject(projectName || currentProject);
      if (!rules) {
        return false;
      }
      return _canI(rules, verb, r.group, r.resource) ||
             _canI(rules, verb, '*',     '*'       ) ||
             _canI(rules, verb, r.group, '*'       ) ||
             _canI(rules, verb, '*',     r.resource);
    }; 

    var canIAddToProject = function(projectName) {
      if (permissiveMode) {
        return true;
      } else {
        return !!_.get(cachedRulesByProject.get(projectName || currentProject), ['canAddToProject']);
      }
    };

    return {
      checkResource: checkResource,
      getProjectRules: getProjectRules,
      canI: canI,
      canIAddToProject: canIAddToProject,
      getRulesForProject: getRulesForProject
    };
  });
