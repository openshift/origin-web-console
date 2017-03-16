'use strict';

angular.module("openshiftConsole")
  .factory("BuildsService", function(DataService, $filter){

    var annotation = $filter('annotation');
    var buildConfigForBuild = $filter('buildConfigForBuild');
    var isIncompleteBuild = $filter('isIncompleteBuild');
    var isNewer = $filter('isNewerResource');

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

    // TODO: Generalize for other kinds since the annotation is generic.
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

    var incompleteBuilds = function(builds) {
      return _.map(builds, function(build) {
        return isIncompleteBuild(build);
      });
    };

    var completeBuilds = function(builds) {
      return _.map(builds, function(build) {
        return !isIncompleteBuild(build);
      });
    };

    var lastCompleteByBuildConfig = function(builds) {
      return _.reduce(
                builds,
                function(result, build) {
                  if(isIncompleteBuild(build)) {
                    return result;
                  }
                  var bc = $filter('annotation')(build, 'buildConfig');
                  if(isNewer(build, result[bc])) {
                    result[bc] = build;
                  }
                  return result;
                }, {});

    };

    // result: incomplete builds + the single latest build for each build config.
    var interestingBuilds = function(builds) {
      var latestCompleteByConfig = {};
      var incompleteBuilds = _.filter(
                              builds,
                              function(build) {
                                if(isIncompleteBuild(build)) {
                                  return true;
                                }
                                // for efficiency, since we have a loop, if the build is
                                // complete we can build a map of latest complete builds by bcs
                                var bc = $filter('annotation')(build, 'buildConfig');
                                if(isNewer(build, latestCompleteByConfig[bc])) {
                                  latestCompleteByConfig[bc] = build;
                                }
                              });
      // in the end we want a single list for ng-repeating
      return incompleteBuilds
               .concat(
                _.map(
                    latestCompleteByConfig,
                    function(build) {
                      return build;
                    }));
    };

    var imageObjectRef = $filter('imageObjectRef');
    var groupBuildConfigsByOutputImage = function(buildConfigs) {
      var buildConfigsByOutputImage = {};
      _.each(buildConfigs, function(buildConfig) {
        var outputImage = _.get(buildConfig, 'spec.output.to');
        var ref = imageObjectRef(outputImage, buildConfig.metadata.namespace);
        if (!ref) {
          return;
        }

        buildConfigsByOutputImage[ref] = buildConfigsByOutputImage[ref] || [];
        buildConfigsByOutputImage[ref].push(buildConfig);
      });

      return buildConfigsByOutputImage;
    };

    // Sort by date first, falling back to build number in case two builds
    // have the same date.
    var sortBuilds = function(builds, descending) {
      var compareNumbers = function(left, right) {
        var leftNumber = getBuildNumber(left);
        var rightNumber = getBuildNumber(right);

        // Fall back to names if no numbers.
        var leftName, rightName;
        if (!leftNumber && !rightNumber) {
          leftName = _.get(left, 'metadata.name', '');
          rightName = _.get(right, 'metadata.name', '');
          if (descending) {
            return rightName.localeCompare(leftName);
          }
          return leftName.localeCompare(rightName);
        }

        if (!leftNumber) {
          return descending ? 1 : -1;
        }

        if (!rightNumber) {
          return descending ? -1 : 1;
        }

        if (descending) {
          return rightNumber - leftNumber;
        }

        return leftNumber - rightNumber;
      };

      var compareDates = function(left, right) {
        var leftDate = _.get(left, 'metadata.creationTimestamp', '');
        var rightDate = _.get(right, 'metadata.creationTimestamp', '');

        // If the builds have identical dates, sort by number.
        if (leftDate === rightDate) {
          return compareNumbers(left, right);
        }

        // The date format can be sorted using straight string comparison.
        // Example Date: 2016-02-02T21:53:07Z
        if (descending) {
          return rightDate.localeCompare(leftDate);
        }

        return leftDate.localeCompare(rightDate);
      };

      // Compare dates, falling back to build number, then name, if dates are the same.
      return _.toArray(builds).sort(compareDates);
    };

    var getJenkinsStatus = function(pipelineBuild) {
      var json = annotation(pipelineBuild, 'jenkinsStatus');
      if (!json) {
        return null;
      }

      try {
        return JSON.parse(json);
      } catch (e) {
        Logger.error('Could not parse Jenkins status as JSON', json);
        return null;
      }
    };

    var getCurrentStage = function(pipelineBuild) {
      var jenkinsStatus = getJenkinsStatus(pipelineBuild);
      var stages = _.get(jenkinsStatus, 'stages', []);
      return _.last(stages);
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
      getDuration: getDuration,
      incompleteBuilds: incompleteBuilds,
      completeBuilds: completeBuilds,
      lastCompleteByBuildConfig: lastCompleteByBuildConfig,
      interestingBuilds: interestingBuilds,
      groupBuildConfigsByOutputImage: groupBuildConfigsByOutputImage,
      sortBuilds: sortBuilds,
      getJenkinsStatus: getJenkinsStatus,
      getCurrentStage: getCurrentStage
    };
  });
