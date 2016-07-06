'use strict';

angular.module("openshiftConsole")
  .factory("BuildsService", function(DataService, $filter){
    function BuildsService() {}

    // Function which will 'instantiate' new build from given buildConfigName
    BuildsService.prototype.startBuild = function(buildConfigName, context, $scope) {
      var req = {
        kind: "BuildRequest",
        apiVersion: "v1",
        metadata: {
          name: buildConfigName
        }
      };
      DataService.create("buildconfigs/instantiate", buildConfigName, req, context).then(
        function(build) { //success
            $scope.alerts = $scope.alerts || {};
            $scope.alerts["create"] =
              {
                type: "success",
                message: "Build " + build.metadata.name + " has started."
              };
        },
        function(result) { //failure
          $scope.alerts = $scope.alerts || {};
          $scope.alerts["create"] =
            {
              type: "error",
              message: "An error occurred while starting the build.",
              details: $filter('getErrorDetails')(result)
            };
        }
      );
    };

    BuildsService.prototype.cancelBuild = function(build, buildConfigName, context, $scope) {
      var canceledBuild = angular.copy(build);
      canceledBuild.status.cancelled = true;
      DataService.update("builds", canceledBuild.metadata.name, canceledBuild, context).then(
        function() {
          $scope.alerts = $scope.alerts || {};
          $scope.alerts["cancel"] =
            {
              type: "success",
              message: "Cancelling build " + build.metadata.name + " of " + buildConfigName + "."
            };
        },
        function(result) {
          $scope.alerts = $scope.alerts || {};
          $scope.alerts["cancel"] =
            {
              type: "error",
              message: "An error occurred cancelling the build.",
              details: $filter('getErrorDetails')(result)
            };
        }
      );
    };

    // Function which will 'clone' build from given buildName
    BuildsService.prototype.cloneBuild = function(buildName, context, $scope) {
      var req = {
        kind: "BuildRequest",
        apiVersion: "v1",
        metadata: {
          name: buildName
        }
      };
      DataService.create("builds/clone", buildName, req, context).then(
        function(build) { //success
            $scope.alerts = $scope.alerts || {};
            var logLink = $filter('buildLogURL')(build);
            var alert = {
              type: "success",
              message: "Build " + buildName + " is being rebuilt as " + build.metadata.name + "."
            };
            if (logLink) {
              alert.links = [{
                href: logLink,
                label: "View Log"
              }];
            }
            $scope.alerts["rebuild"] = alert;
        },
        function(result) { //failure
          $scope.alerts = $scope.alerts || {};
          $scope.alerts["rebuild"] =
            {
              type: "error",
              message: "An error occurred while rerunning the build.",
              details: $filter('getErrorDetails')(result)
            };
        }
      );
    };

    BuildsService.prototype.isPaused = function(buildConfig) {
      return $filter('annotation')(buildConfig, "openshift.io/build-config.paused") === 'true';
    };

    BuildsService.prototype.canBuild = function(buildConfig) {
      if (!buildConfig) {
        return false;
      }

      if (buildConfig.metadata.deletionTimestamp) {
        return false;
      }

      if (this.isPaused(buildConfig)) {
        return false;
      }

      return true;
    };

    var annotation = $filter('annotation');
    BuildsService.prototype.usesDeploymentConfigs = function(buildConfig) {
      var uses = annotation(buildConfig, 'pipeline.alpha.openshift.io/uses');
      if (!uses) {
        return [];
      }

      try {
        uses = JSON.parse(uses);
      } catch(e) {
        Logger.warn('Could not parse "pipeline.alpha.openshift.io/uses" annotation', e);
        return;
      }

      var depoymentConfigs = [];
      _.each(uses, function(resource) {
        if (!resource.name) {
          return;
        }

        if (resource.namespace && resource.namespace !== _.get(buildConfig, 'metadata.namespace')) {
          return;
        }

        if (resource.kind !== 'DeploymentConfig') {
          return;
        }

        depoymentConfigs.push(resource.name);
      });

      return depoymentConfigs;
    };

    // Returns a map of only the builds that belong to a particular build config, needed
    // because we can't filter our watch on the annotation, only on the potentially truncated label
    // Assumes the builds were already pre-filtered based on the label.
    BuildsService.prototype.validatedBuildsForBuildConfig = function(buildConfigName, builds) {
      return _.pick(builds, function(build){
            var buildCfgAnnotation = annotation(build, 'buildConfig');
            return !buildCfgAnnotation || buildCfgAnnotation === buildConfigName;
          });
    };

    return new BuildsService();
  });
