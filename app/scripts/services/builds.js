'use strict';

angular.module("openshiftConsole")
  .factory("BuildsService", function(DataService, $filter){

    var annotation = $filter('annotation');
    var buildConfigForBuild = $filter('buildConfigForBuild');

    var startBuild = function(buildConfigName, context) {
      var req = {
        kind: "BuildRequest",
        apiVersion: "v1",
        metadata: {
          name: buildConfigName
        }
      };
      return DataService.create("buildconfigs/instantiate", buildConfigName, req, context);
    };

    var cancelBuild = function(build, buildConfigName, context) {
      var canceledBuild = angular.copy(build);
      canceledBuild.status.cancelled = true;
      return DataService.update("builds", canceledBuild.metadata.name, canceledBuild, context);
    };

    var cloneBuild = function(buildName, context) {
      var req = {
        kind: "BuildRequest",
        apiVersion: "v1",
        metadata: {
          name: buildName
        }
      };
      return DataService.create("builds/clone", buildName, req, context);
    };

    var isPaused = function(buildConfig) {
      return annotation(buildConfig, "openshift.io/build-config.paused") === 'true';
    };

    var canBuild = function(buildConfig) {
      if (!buildConfig) {
        return false;
      }
      if (buildConfig.metadata.deletionTimestamp) {
        return false;
      }
      if (isPaused(buildConfig)) {
        return false;
      }
      return true;
    };

    var usesDeploymentConfigs = function(buildConfig) {
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
    var validatedBuildsForBuildConfig = function(buildConfigName, builds) {
      return _.pick(builds, function(build){
            var buildCfgAnnotation = annotation(build, 'buildConfig');
            return !buildCfgAnnotation || buildCfgAnnotation === buildConfigName;
          });
    };

    var isNewer = $filter('isNewerResource');
    var latestBuildByConfig = function(builds, /* optional */ filter) {
      var latestByConfig = {};
      _.each(builds, function(build) {
        var buildConfigName = buildConfigForBuild(build) || "";
        if (filter && !filter(build)) {
          return;
        }

        if (isNewer(build, latestByConfig[buildConfigName])) {
          latestByConfig[buildConfigName] = build;
        }
      });

      return latestByConfig;
    };

    var getBuildNumber = function(build) {
      var buildNumber = annotation(build, 'buildNumber') || parseInt(build.metadata.name.match(/(\d+)$/), 10);
      if (isNaN(buildNumber)) {
        return null;
      }

      return buildNumber;
    };

    var getStartTimestsamp = function(build) {
      return build.status.startTimestamp || build.metadata.creationTimestamp;
    };

    var nsToMS = function(duration) {
      // build.duration is returned in nanoseconds. Convert to ms.
      // 1000 nanoseconds per microsecond
      // 1000 microseconds per millisecond
      return _.round(duration / 1000 / 1000);
    };

    var getDuration = function(build) {
      // Use build.status.duration if available.
      var duration = _.get(build, 'status.duration');
      if (duration) {
        // Convert duration from ns to ms.
        return nsToMS(duration);
      }

      // Fall back to comparing start timestamp to end timestamp.
      var startTimestamp = getStartTimestsamp(build);
      var endTimestamp = build.status.completionTimestamp;
      if (!startTimestamp || !endTimestamp) {
        return 0;
      }

      return moment(endTimestamp).diff(moment(startTimestamp));
    };

    return {
      startBuild: startBuild,
      cancelBuild: cancelBuild,
      cloneBuild: cloneBuild,
      isPaused: isPaused,
      canBuild: canBuild,
      usesDeploymentConfigs: usesDeploymentConfigs,
      validatedBuildsForBuildConfig: validatedBuildsForBuildConfig,
      latestBuildByConfig: latestBuildByConfig,
      getBuildNumber: getBuildNumber,
      getStartTimestsamp: getStartTimestsamp,
      getDuration: getDuration
    };
  });
