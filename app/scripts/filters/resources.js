'use strict';
/* jshint unused: false */

angular.module('openshiftConsole')
  .filter('storageClass', function(annotationFilter) {
    return function(pvc) {
      return annotationFilter(pvc, 'volume.beta.kubernetes.io/storage-class');
    };
  })
  .filter('storageClassAccessMode', function(annotationFilter) {
    return function(storageClass) {
      return annotationFilter(storageClass, 'storage.alpha.openshift.io/access-mode');
    };
  })
  .filter('tags', function(annotationFilter) {
    return function(resource, /* optional */ annotationKey) {
      annotationKey = annotationKey || "tags";
      var tags = annotationFilter(resource, annotationKey);
      if (!tags) {
        return [];
      }
      return tags.split(/\s*,\s*/);
    };
  })
  .filter('imageStreamLastUpdated', function() {
    return function(imageStream) {
      var lastUpdated = imageStream.metadata.creationTimestamp;
      var lastUpdatedMoment = moment(lastUpdated);
      angular.forEach(imageStream.status.tags, function(tag) {
        if (!_.isEmpty(tag.items)) {
          var tagUpdatedMoment = moment(_.head(tag.items).created);
          if (tagUpdatedMoment.isAfter(lastUpdatedMoment)) {
            lastUpdatedMoment = tagUpdatedMoment;
            lastUpdated = _.head(tag.items).created;
          }
        }
      });
      return lastUpdated;
    };
  })
  .filter('buildConfigForBuild', function(annotationFilter, labelNameFilter, labelFilter) {
    var labelName = labelNameFilter('buildConfig');
    return function(build) {
      return annotationFilter(build, 'buildConfig') || labelFilter(build, labelName);
    };
  })
  .filter('icon', function(annotationFilter) {
    return function(resource) {
      var icon = annotationFilter(resource, "icon");
      if (!icon) {
        //FIXME: Return default icon for resource.kind
        return "";
      } else {
        return icon;
      }
    };
  })
  .filter('iconClass', function(annotationFilter) {
    return function(resource, kind) {
      var icon = annotationFilter(resource, "iconClass");
      if (!icon) {
        if (kind === "template") {
          return "fa fa-clone";
        }

        return "";
      }

      return icon;
    };
  })
  .filter('imageName', function() {
    // takes an image name and strips off the leading <algorithm>: from it,
    // if it exists.
    return function(image) {
      if (!image) {
        return "";
      }

      if (!image.contains(":")) {
        return image;
      }

      return image.split(":")[1];
    };
  })
  .filter('imageStreamName', function() {
    return function(image) {
      if (!image) {
        return "";
      }
      // TODO move this parsing method into a utility method

      // remove @sha256:....
      var imageWithoutID = image.split("@")[0];

      var slashSplit = imageWithoutID.split("/");
      var semiColonSplit;
      if (slashSplit.length === 3) {
        semiColonSplit = slashSplit[2].split(":");
        return slashSplit[1] + '/' + semiColonSplit[0];
      }
      else if (slashSplit.length === 2) {
        // TODO umm tough... this could be registry/imageName or imageRepo/imageName
        // have to check if the first bit matches a registry pattern, will handle this later...
        return imageWithoutID;
      }
      else if (slashSplit.length === 1) {
        semiColonSplit = imageWithoutID.split(":");
        return semiColonSplit[0];
      }
    };
  })
  .filter('stripTag', function() {
    // Strips the trailing `:tag` if present from an image name. For instance, returns
    // "jenkins" for "jenkins:latest".
    return function(imageName) {
      if (!imageName) {
        return imageName;
      }

      return imageName.split(':')[0];
    };
  })
  .filter('stripSHA', function() {
    // Strips the trailing `@sha:...` if present from an image name.
    return function(imageName) {
      if (!imageName) {
        return imageName;
      }

      return imageName.split('@')[0];
    };
  })
  .filter('imageSHA', function() {
    // Returns the trailing @sha:`...` if present from an image name.
    return function(imageName) {
      if (!imageName) {
        return imageName;
      }
      var parts = imageName.split('@');
      return parts.length > 1 ? parts[1] : '';
    };
  })
  .filter('imageEnv', function() {
    return function(image, envKey) {
      var envVars = image.dockerImageMetadata.Config.Env;
      for (var i = 0; i < _.size(envVars); i++) {
        var keyValue = envVars[i].split("=");
        if (keyValue[0] === envKey) {
          return keyValue[1];
        }
      }
      return null;
    };
  })
  .filter('destinationSourcePair', function() {
    return function(destination) {
      var pairs = {};
      angular.forEach(destination, function(env) {
        pairs[env.sourcePath] = env.destinationDir;
      });
      return pairs;
    };
  })
  .filter('buildForImage', function() {
    return function(image, builds) {
      // TODO concerned that this gets called anytime any data is changed on the scope,
      // whether its relevant changes or not
      var envVars = _.get(image, 'dockerImageMetadata.Config.Env', []);
      for (var i = 0; i < envVars.length; i++) {
        var keyValue = envVars[i].split("=");
        if (keyValue[0] === "OPENSHIFT_BUILD_NAME") {
          return builds[keyValue[1]];
        }
      }
      return null;
    };
  })
  .filter('webhookURL', function(canIFilter, APIService, DataService, SecretsService) {
    return function(buildConfig, type, secret, project, webhookSecrets) {
      var secretsVersion = APIService.getPreferredVersion('secrets');
      if (canIFilter(secretsVersion, 'list')) {
        secret = SecretsService.getWebhookSecretValue(secret, webhookSecrets);
        return DataService.url({
          // arbitrarily many subresources can be included
          // url encoding of the segments is handled by the url() function
          // subresource segments cannot contain '/'
          resource: "buildconfigs/webhooks/" + encodeURIComponent(secret) + "/" + encodeURIComponent(type.toLowerCase()),
          name: buildConfig,
          namespace: project,
          group: 'build.openshift.io'
        });
      } else {
        // In case user wont have permissions to list Secrets, an incomplaete URL will be build, similar to the one from CLI:
        //
        // https://127.0.0.1:8443/apis/build.openshift.io/v1/namespaces/myproject/buildconfigs/test-build/webhooks/<secret>/github
        //
        var webhookURL = DataService.url({
          resource: "buildconfigs/webhooks/",
          name: buildConfig,
          namespace: project,
          group: 'build.openshift.io'
        });
        return webhookURL + "<secret>/" + type.toLowerCase();
      }
    };
  })
  .filter('isWebRoute', function(routeHostFilter) {
    return function(route){
       return !!routeHostFilter(route, true) &&
              _.get(route, 'spec.wildcardPolicy') !== 'Subdomain';
    };
  })
  .filter('routeWebURL', function(routeHostFilter){
    return function(route, host, omitPath){
        var scheme = (route.spec.tls && route.spec.tls.tlsTerminationType !== "") ? "https" : "http";
        var url = scheme + "://" + (host || routeHostFilter(route));
        if (route.spec.path && !omitPath) {
            url += route.spec.path;
        }
        return url;
    };
  })
  .filter('routeLabel', function(RoutesService, routeHostFilter, routeWebURLFilter, isWebRouteFilter) {
    return function(route, host, omitPath) {
      if (isWebRouteFilter(route)) {
        return routeWebURLFilter(route, host, omitPath);
      }

      var label = (host || routeHostFilter(route));
      if (!label) {
        return '<unknown host>';
      }

      if (_.get(route, 'spec.wildcardPolicy') === 'Subdomain') {
        label = '*.' + RoutesService.getSubdomain(route);
      }

      if(omitPath) {
        return label;
      }

      if (route.spec.path) {
        label += route.spec.path;
      }
      return label;
    };
  })
  .filter('parameterPlaceholder', function() {
    return function(parameter) {
      if (parameter.generate) {
        return "(generated if empty)";
      } else {
        return "";
      }
    };
  })
 .filter('parameterValue', function() {
    return function(parameter) {
      if (!parameter.value && parameter.generate) {
        return "(generated)";
      } else {
        return parameter.value;
      }
    };
  })
  .filter('imageObjectRef', function(){
    return function(objectRef, /* optional */ nsIfUnspecified, shortOutput){
      if (!objectRef) {
        return "";
      }

      var ns = objectRef.namespace || nsIfUnspecified || "";
      if (!_.isEmpty(ns)) {
        ns = ns + "/";
      }
      var kind = objectRef.kind;
      if (kind === "ImageStreamTag" || kind === "ImageStreamImage") {
        return ns+objectRef.name;
      }
      if (kind === "DockerImage") {
        // TODO: replace with real DockerImageReference parse function
        var name = objectRef.name;
        // TODO: should we be removing the n
        if (shortOutput) {
          name = name.substring(name.lastIndexOf("/")+1);
        }
        return name;
      }
      // TODO: we may want to indicate the actual type
      var ref = ns + objectRef.name;
      return ref;
    };
  })
  .filter('orderByDisplayName', function(displayNameFilter, toArrayFilter) {
    return function(items) {
      var itemsArray = toArrayFilter(items);
      itemsArray.sort(function(left, right) {
        var leftName = displayNameFilter(left) || '';
        var rightName = displayNameFilter(right) || '';

        // Fall back to sorting by `metadata.name` if the display names are the
        // same so that the sort is stable.
        if (leftName === rightName) {
          leftName = _.get(left, 'metadata.name', '');
          rightName = _.get(right, 'metadata.name', '');
        }

        return leftName.localeCompare(rightName);
      });

      return itemsArray;
    };
  })
  .filter('isContainerLooping', function() {
    return function(containerStatus) {
      return containerStatus.state.waiting && containerStatus.state.waiting.reason === 'CrashLoopBackOff';
    };
  })
  .filter('isContainerFailed', function() {
    return function(containerStatus) {
      // If this logic ever changes, update the message in podWarnings
      return containerStatus.state.terminated && containerStatus.state.terminated.exitCode !== 0;
    };
  })
  .filter('isContainerTerminatedSuccessfully', function() {
    return function(containerStatus) {
      return containerStatus.state.terminated && containerStatus.state.terminated.exitCode === 0;
    };
  })
  .filter('isContainerUnprepared', function() {
    return function(containerStatus) {
      if (!containerStatus.state.running ||
          containerStatus.ready !== false ||
          !containerStatus.state.running.startedAt) {
        return false;
      }

      // If this logic ever changes, update the message in podWarnings
      var fiveMinutesAgo = moment().subtract(5, 'm');
      var started = moment(containerStatus.state.running.startedAt);
      return started.isBefore(fiveMinutesAgo);
    };
  })
  .filter('isTroubledPod', function(isContainerLoopingFilter, isContainerFailedFilter, isContainerUnpreparedFilter) {
    return function(pod) {
      if (pod.status.phase === 'Unknown') {
        // We always show Unknown pods in a warning state
        return true;
      }

      if (pod.status.phase === 'Running' && pod.status.containerStatuses) {
        // Check container statuses and short circuit when we find any problem.
        var i;
        for (i = 0; i < _.size(pod.status.containerStatuses); ++i) {
          var containerStatus = pod.status.containerStatuses[i];
          if (!containerStatus.state) {
            continue;
          }
          if (isContainerFailedFilter(containerStatus)) {
            return true;
          }
          if (isContainerLoopingFilter(containerStatus)) {
            return true;
          }
          if (isContainerUnpreparedFilter(containerStatus)) {
            return true;
          }
        }
      }

      return false;
    };
  })
  .filter('podWarnings', function(isContainerLoopingFilter, isContainerFailedFilter, isContainerUnpreparedFilter, isTerminatingFilter) {
    return function(pod) {
      var warnings = [];

      if (pod.status.phase === 'Unknown') {
        // We always show Unknown pods in a warning state
        warnings.push({reason: 'Unknown', pod: pod.metadata.name, message: 'The state of the pod could not be obtained. This is typically due to an error communicating with the host of the pod.'});
      }

      if (pod.status.phase === 'Running' && pod.status.containerStatuses) {
        _.each(pod.status.containerStatuses, function(containerStatus) {
          if (!containerStatus.state) {
            return false;
          }

          if (isContainerFailedFilter(containerStatus)) {
            if (isTerminatingFilter(pod)) {
              warnings.push({
                severity: "error",
                reason: "NonZeroExitTerminatingPod",
                pod: pod.metadata.name,
                container: containerStatus.name,
                message: "The container " + containerStatus.name + " did not stop cleanly when terminated (exit code " + containerStatus.state.terminated.exitCode + ")."
              });
            } else {
              warnings.push({
                severity: "warning",
                reason: "NonZeroExit",
                pod: pod.metadata.name,
                container: containerStatus.name,
                message: "The container " + containerStatus.name + " failed (exit code " + containerStatus.state.terminated.exitCode + ")."
              });
            }
          }
          if (isContainerLoopingFilter(containerStatus)) {
            warnings.push({
              severity: "error",
              reason: "Looping",
              pod: pod.metadata.name,
              container: containerStatus.name,
              message: "The container " + containerStatus.name + " is crashing frequently. It must wait before it will be restarted again."
            });
          }
          if (isContainerUnpreparedFilter(containerStatus)) {
            warnings.push({
              severity: "warning",
              reason: "Unprepared",
              pod: pod.metadata.name,
              container: containerStatus.name,
              message: "The container " + containerStatus.name + " has been running for more than five minutes and has not passed its readiness check."
            });
          }
        });
      }

      return warnings.length > 0 ? warnings : null;
    };
  })
  // Groups pod warnings by reason + container name, all messages in a group are expected to be the same
  .filter('groupedPodWarnings', function(podWarningsFilter) {
    return function(pods, existingMap) {
      var groupedPodWarnings = existingMap || {};
      _.each(pods, function(pod) {
        var podWarnings = podWarningsFilter(pod);
        _.each(podWarnings, function(warning) {
          var key = warning.reason + (warning.container || '');
          groupedPodWarnings[key] = groupedPodWarnings[key] || [];
          groupedPodWarnings[key].push(warning);
        });
      });
      return groupedPodWarnings;
    };
  })
  .filter('troubledPods', function(isTroubledPodFilter) {
    return function(pods) {
      var troublePods = [];
      angular.forEach(pods, function(pod){
        if (isTroubledPodFilter(pod)) {
          troublePods.push(pod);
        }
      });
      return troublePods;
    };
  })
  .filter('notTroubledPods', function(isTroubledPodFilter) {
    return function(pods) {
      var notTroublePods = [];
      angular.forEach(pods, function(pod){
        if (!isTroubledPodFilter(pod)) {
          notTroublePods.push(pod);
        }
      });
      return notTroublePods;
    };
  })
  .filter('projectOverviewURL', function(Navigate) {
    return function(project) {
      return angular.isString(project) ?
              Navigate.projectOverviewURL(project) :
              angular.isObject(project) ?
                Navigate.projectOverviewURL(project.metadata && project.metadata.name):
                Navigate.projectOverviewURL(''); // fail case will invoke default route (projects list)
    };
  })
  .filter('catalogURL', function(Navigate) {
    return Navigate.catalogURL;
  })
  .filter('createFromSourceURL', function() {
    return function(projectName, sourceURL) {
      var createURI = URI.expand("project/{project}/catalog/images{?q*}", {
        project: projectName,
        q: {
          builderfor: sourceURL
        }
      });
      return createURI.toString();
    };
  })
  .filter('createFromImageURL', function(Navigate) {
    return function(imageStream, imageTag, projectName, queryParams) {
      return Navigate.createFromImageURL(imageStream, imageTag, projectName, queryParams);
    };
  })
  .filter('createFromTemplateURL', function(Navigate) {
    return function(template, projectName, queryParams) {
      return Navigate.createFromTemplateURL(template, projectName, queryParams);
    };
  })
  .filter('failureObjectName', function() {
    return function(failure) {
      if (!failure.data || !failure.data.details) {
        return null;
      }

      var details = failure.data.details;
      if (details.kind) {
        return (details.id) ? details.kind + " " + details.id : details.kind;
      }

      return details.id;
    };
  })
  .filter('isIncompleteBuild', function(ageLessThanFilter) {
    return function(build) {
      if (!build || !build.status || !build.status.phase){
        return false;
      }

      switch (build.status.phase) {
        case 'New':
        case 'Pending':
        case 'Running':
          return true;
        default:
          if (!build.status.completionTimestamp) {
            return true;
          }
          return false;
      }
    };
  })
  .filter('isRecentBuild', function(ageLessThanFilter, isIncompleteBuildFilter) {
    return function(build) {
      if (!build || !build.status || !build.status.phase || !build.metadata) {
        return false;
      }

      if (isIncompleteBuildFilter(build)) {
        return true;
      }

      var timestamp = build.status.completionTimestamp || build.metadata.creationTimestamp;
      return ageLessThanFilter(timestamp, 5, 'minutes');
    };
  })
  .filter('deploymentCauses', function(annotationFilter) {
    return function(deployment) {
      if (!deployment) {
        return [];
      }

      var configJson = annotationFilter(deployment, 'encodedDeploymentConfig');
      if (!configJson) {
        return [];
      }

      try {
        var depConfig = $.parseJSON(configJson);
        if (!depConfig) {
          return [];
        }

        switch (depConfig.apiVersion) {
          case "v1beta1":
            return depConfig.details.causes;
          case "v1beta3":
          case "v1":
            return  depConfig.status.details ? depConfig.status.details.causes : [];
          default:
          // Unrecognized API version. Log an error.
          Logger.error('Unknown API version "' + depConfig.apiVersion +
                       '" in encoded deployment config for deployment ' +
                       deployment.metadata.name);

          // Try to fall back to the last thing we know.
          if (depConfig.status && depConfig.status.details && depConfig.status.details.causes) {
            return depConfig.status.details.causes;
          }

          return [];
        }
      }
      catch (e) {
        Logger.error("Failed to parse encoded deployment config", e);
        return [];
      }
    };
  })
  .filter('desiredReplicas', function() {
    return function(rc) {
      if (!rc || !rc.spec) {
        return 0;
      }

      // If unset, the default is 1.
      if (rc.spec.replicas === undefined) {
        return 1;
      }

      return rc.spec.replicas;
    };
  })
  .filter('serviceImplicitDNSName', function() {
    return function(service) {
      if (!service || !service.metadata || !service.metadata.name || !service.metadata.namespace) {
        return '';
      }

      // cluster.local suffix is customizable, so leave it off. <name>.<namespace>.svc resolves.
      return service.metadata.name + '.' + service.metadata.namespace + '.svc';
    };
  })
  .filter('podsForPhase', function() {
    return function(pods, phase) {
      var podsForPhase = [];
      angular.forEach(pods, function(pod){
        if (pod.status.phase === phase) {
          podsForPhase.push(pod);
        }
      });
      return podsForPhase;
    };
  })
  .filter('numContainersReady', function() {
    return function(pod) {
      var numReady = 0;
      angular.forEach(pod.status.containerStatuses, function(status) {
        if (status.ready) {
          numReady++;
        }
      });
      return numReady;
    };
  })
  .filter('numContainerRestarts', function() {
    return function(pod) {
      var numRestarts = 0;
      angular.forEach(pod.status.containerStatuses, function(status) {
        numRestarts += status.restartCount;
      });
      return numRestarts;
    };
  })
  .filter('isTerminating', function() {
    return function(resource) {
      return _.has(resource, 'metadata.deletionTimestamp');
    };
  })
  .filter('isPullingImage', function() {
    return function(pod) {
      if (!pod) {
        return false;
      }

      var phase = _.get(pod, 'status.phase');
      if (phase !== 'Pending') {
        return false;
      }

      var containerStatuses = _.get(pod, 'status.containerStatuses');
      if (!containerStatuses) {
        return false;
      }

      var containerPulling = function(containerStatus) {
        // TODO: Update to use the pulling reason when available. We assume
        // ContainerCreating === pulling, which might not be true.
        return _.get(containerStatus, 'state.waiting.reason') === 'ContainerCreating';
      };

      return _.some(containerStatuses, containerPulling);
    };
  })
  .filter('newestResource', function() {
    return function(resources) {
      var newest = null;
      angular.forEach(resources, function(resource) {
        if (!newest) {
          if (resource.metadata.creationTimestamp) {
            newest = resource;
          }
          else {
            return;
          }
        }
        else if (moment(newest.metadata.creationTimestamp).isBefore(resource.metadata.creationTimestamp)) {
          newest = resource;
        }
      });
      return newest;
    };
  })
  .filter('deploymentIsLatest', function(annotationFilter) {
    return function(deployment, deploymentConfig) {
      if (!deploymentConfig || !deployment) {
        return false;
      }
      var deploymentVersion = parseInt(annotationFilter(deployment, 'deploymentVersion'));
      var deploymentConfigVersion = deploymentConfig.status.latestVersion;
      return deploymentVersion === deploymentConfigVersion;
    };
  })
  .filter('deploymentStatus', function(annotationFilter, hasDeploymentConfigFilter) {
    return function(deployment) {
      // We should show Cancelled as an actual status instead of showing Failed
      if (annotationFilter(deployment, 'deploymentCancelled')) {
        return "Cancelled";
      }
      var status = annotationFilter(deployment, 'deploymentStatus');
      // If it is just an RC (non-deployment) or it is a deployment with more than 0 replicas
      if (!hasDeploymentConfigFilter(deployment) || status === "Complete" && deployment.spec.replicas > 0) {
        return "Active";
      }
      return status;
    };
  })
  .filter('deploymentIsInProgress', function(deploymentStatusFilter) {
    return function(deployment) {
      return ['New', 'Pending', 'Running'].indexOf(deploymentStatusFilter(deployment)) > -1;
    };
  })
  .filter('anyDeploymentIsInProgress', function(deploymentIsInProgressFilter) {
    return function(deployments) {
      return _.some(deployments, deploymentIsInProgressFilter);
    };
  })
  .filter('getActiveDeployment', function(DeploymentsService) {
    return function(deployments) {
      return DeploymentsService.getActiveDeployment(deployments);
    };
  })
  .filter('isRecentDeployment', function(deploymentIsLatestFilter, deploymentIsInProgressFilter) {
    return function(deployment, deploymentConfig) {
      if (deploymentIsLatestFilter(deployment, deploymentConfig)) {
        return true;
      }

      if (deploymentIsInProgressFilter(deployment)) {
        return true;
      }

      return false;
    };
  })
  .filter('buildStrategy', function() {
    return function(build) {
      if (!build || !build.spec || !build.spec.strategy) {
        return null;
      }
      switch (build.spec.strategy.type) {
        case 'Source':
          return build.spec.strategy.sourceStrategy;
        case 'Docker':
          return build.spec.strategy.dockerStrategy;
        case 'Custom':
          return build.spec.strategy.customStrategy;
        case 'JenkinsPipeline':
          return build.spec.strategy.jenkinsPipelineStrategy;
        default:
          return null;
      }
    };
  })
  .filter('isBinaryBuild', function() {
    // Accepts a build or build config.
    return function(build) {
      return _.has(build, 'spec.source.binary');
    };
  })
  .filter('isJenkinsPipelineStrategy', function() {
    return function(/* build or build config */ resource) {
      return _.get(resource, 'spec.strategy.type') === 'JenkinsPipeline';
    };
  })
  .filter('jenkinsLogURL', function(annotationFilter) {
    return function(build, asPlainText) {
      var logURL = annotationFilter(build, 'jenkinsLogURL');
      if (!logURL || asPlainText) {
        return logURL;
      }

      // Link to the Jenkins console that follows the log instead of the raw log text.
      return logURL.replace(/\/consoleText$/, '/console');
    };
  })
  .filter('jenkinsBuildURL', function(annotationFilter, jenkinsLogURLFilter) {
    return function(build) {
      return annotationFilter(build, 'jenkinsBuildURL');
    };
  })
  .filter('jenkinsInputURL', function(jenkinsBuildURLFilter) {
    return function(build) {
      // TODO we should have a jenkinsInputURL annotation, waiting on
      // https://github.com/fabric8io/openshift-jenkins-sync-plugin/issues/94
      var buildURL = jenkinsBuildURLFilter(build);
      if (!buildURL) {
        return null;
      }
      return new URI(buildURL).segment("/input/").toString();
    };
  })
  .filter('buildLogURL', function(isJenkinsPipelineStrategyFilter,
                                  jenkinsLogURLFilter,
                                  navigateResourceURLFilter) {
    return function(build) {
      if (isJenkinsPipelineStrategyFilter(build)) {
        return jenkinsLogURLFilter(build);
      }

      var navURL = navigateResourceURLFilter(build);
      if (!navURL) {
        return null;
      }

      return new URI(navURL).addSearch('tab', 'logs').toString();
    };
  })
  .filter('jenkinsfileLink', function(isJenkinsPipelineStrategyFilter, githubLinkFilter) {
    // If this is a GitHub repository and the build config uses a Jenkinsfile path, return a URL to the Jenkinsfile.
    // Returns '' in all other cases.
    return function(/* buildConfig or build */ buildConfig) {
      if (!isJenkinsPipelineStrategyFilter(buildConfig) ||
          _.has(buildConfig, 'spec.strategy.jenkinsPipelineStrategy.jenkinsfile')) {
        return '';
      }

      var sourceURI = _.get(buildConfig, 'spec.source.git.uri');
      if (!sourceURI) {
        return '';
      }

      var ref = _.get(buildConfig, 'spec.source.git.ref'),
          jenkinsfilePath = _.get(buildConfig, 'spec.strategy.jenkinsPipelineStrategy.jenkinsfilePath', 'Jenkinsfile'),
          contextDir = _.get(buildConfig, 'spec.source.contextDir');
      if (contextDir) {
        jenkinsfilePath = URI.joinPaths(contextDir, jenkinsfilePath).path();
      }

      var link = githubLinkFilter(sourceURI, ref, jenkinsfilePath);
      if (!URI(link).is('url')) {
        return '';
      }

      return link;
    };
  })
  .filter('pipelineStageComplete', function () {
    return function(stage) {
      if (!stage) {
        return false;
      }

      return _.indexOf(['ABORTED', 'FAILED', 'SUCCESS'], stage.status) !== -1;
    };
  })
  .filter('pipelineStagePendingInput', function () {
    return function(stage) {
      if (!stage) {
        return false;
      }
      return 'PAUSED_PENDING_INPUT' === stage.status;
    };
  })
  .filter('deploymentStrategyParams', function () {
    return function(deploymentConfig) {
      var strategy = _.get(deploymentConfig, 'spec.strategy.type');
      switch (strategy) {
        case 'Recreate':
          return _.get(deploymentConfig, 'spec.strategy.recreateParams', {});
        case 'Rolling':
          return _.get(deploymentConfig, 'spec.strategy.rollingParams', {});
        case 'Custom':
          return _.get(deploymentConfig, 'spec.strategy.customParams', {});
        default:
          return null;
      }
    };
  })
  .filter('humanizeTLSTermination', function () {
    return function(termination) {
      switch (termination) {
        case 'edge':
          return 'Edge';
        case 'passthrough':
          return 'Passthrough';
        case 'reencrypt':
          return 'Re-encrypt';
        default:
          return termination;
      }
    };
  })
  .filter('kindToResource', function (APIService) {
    return APIService.kindToResource;
  })
  .filter('abbreviateResource', function(APIService) {
    var abbreviated = {
      buildconfigs: 'bc',
      deploymentconfigs: 'dc',
      horizontalpodautoscalers: 'hpa',
      imagestreams: 'is',
      imagestreamtags: 'istag',
      replicasets: 'rs',
      replicationcontrollers: 'rc',
      services: 'svc',
    };
    return function(resource) {
      return abbreviated[resource] || resource;
    };
  })
  .filter('humanizeQuotaResource', function() {
    return function(resourceType, useTitleCase) {
      if (!resourceType) {
        return resourceType;
      }

      var nameTitleCaseFormatMap = {
        'configmaps': 'Config Maps',
        'cpu': 'CPU (Request)',
        'limits.cpu': 'CPU (Limit)',
        'limits.memory': 'Memory (Limit)',
        'memory': 'Memory (Request)',
        'openshift.io/imagesize': 'Image Size',
        'openshift.io/imagestreamsize': 'Image Stream Size',
        'openshift.io/projectimagessize': 'Project Image Size',
        'persistentvolumeclaims': 'Persistent Volume Claims',
        'requests.storage': 'Storage (Request)',
        'pods': 'Pods',
        'replicationcontrollers': 'Replication Controllers',
        'requests.cpu': 'CPU (Request)',
        'requests.memory': 'Memory (Request)',
        'resourcequotas': 'Resource Quotas',
        'secrets': 'Secrets',
        'services': 'Services',
        'services.loadbalancers': 'Service Load Balancers',
        'services.nodeports': 'Service Node Ports'
      };

      var nameFormatMap = {
        'configmaps': 'config maps',
        'cpu': 'CPU (request)',
        'limits.cpu': 'CPU (limit)',
        'limits.memory': 'memory (limit)',
        'memory': 'memory (request)',
        'openshift.io/imagesize': 'image size',
        'openshift.io/imagestreamsize': 'image stream size',
        'openshift.io/projectimagessize': 'project image size',
        'persistentvolumeclaims': 'persistent volume claims',
        'requests.storage': 'storage (request)',
        'replicationcontrollers': 'replication controllers',
        'requests.cpu': 'CPU (request)',
        'requests.memory': 'memory (request)',
        'resourcequotas': 'resource quotas',
        'services.loadbalancers': 'service load balancers',
        'services.nodeports': 'service node ports'
      };
      if (useTitleCase) {
        return nameTitleCaseFormatMap[resourceType] || resourceType;
      }
      return nameFormatMap[resourceType] || resourceType;
    };
  })
  .filter('routeTargetPortMapping', function(RoutesService) {
    var portDisplayValue = function(servicePort, containerPort, protocol) {
      servicePort = servicePort || "<unknown>";
      containerPort = containerPort || "<unknown>";

      // \u2192 is a right arrow (see examples below)
      var mapping = "Service Port " + servicePort  + " \u2192 Container Port " + containerPort;
      if (protocol) {
        mapping += " (" + protocol + ")";
      }

      return mapping;
    };

    // Returns a display value for a route target port that includes the
    // service port, e.g.
    //   Service Port 8080 -> Container Port 8081
    // If no target port for the route or service is undefined, returns an
    // empty string.
    // If the corresponding port is not found, returns
    //   Service Port <unknown> -> Container Port 8081
    // or
    //   Service Port web -> Container Port <unknown>
    return function(route, service) {
      if (!route.spec.port || !route.spec.port.targetPort || !service) {
        return '';
      }

      var targetPort = route.spec.port.targetPort;
      // Find the corresponding service port.
      var servicePort = RoutesService.getServicePortForRoute(targetPort, service);
      if (!servicePort) {
        // Named ports refer to the service port name.
        if (angular.isString(targetPort)) {
          return portDisplayValue(targetPort, null);
        }

        // Numbers refer to the container port.
        return portDisplayValue(null, targetPort);
      }

      return portDisplayValue(servicePort.port, servicePort.targetPort, servicePort.protocol);
    };
  })
  .filter('podStatus', function() {
    // Return results that match
    // https://github.com/openshift/origin/blob/master/vendor/k8s.io/kubernetes/pkg/printers/internalversion/printers.go#L523-L615
    return function(pod) {
      if (!pod || (!pod.metadata.deletionTimestamp && !pod.status)) {
        return '';
      }

      if (pod.metadata.deletionTimestamp) {
        return 'Terminating';
      }

      var initializing = false;
      var reason;

      // Print detailed container reasons if available. Only the first will be
      // displayed if multiple containers have this detail.

      _.each(pod.status.initContainerStatuses, function(initContainerStatus) {
        var initContainerState = _.get(initContainerStatus, 'state');

        if (initContainerState.terminated && initContainerState.terminated.exitCode === 0) {
          // initialization is complete
          return;
        }

        if (initContainerState.terminated) {
          // initialization is failed
          if (!initContainerState.terminated.reason) {
            if (initContainerState.terminated.signal) {
              reason = "Init Signal: " + initContainerState.terminated.signal;
            } else {
              reason = "Init Exit Code: " + initContainerState.terminated.exitCode;
            }
          } else {
            reason = "Init " + initContainerState.terminated.reason;
          }
          initializing = true;
          return true;
        }

        if (initContainerState.waiting && initContainerState.waiting.reason && initContainerState.waiting.reason !== 'PodInitializing') {
          reason = "Init " + initContainerState.waiting.reason;
          initializing = true;
        }
      });

      if (!initializing) {
        reason = pod.status.reason || pod.status.phase;

        _.each(pod.status.containerStatuses, function(containerStatus) {
          var containerReason = _.get(containerStatus, 'state.waiting.reason') || _.get(containerStatus, 'state.terminated.reason'),
              signal,
              exitCode;

          if (containerReason) {
            reason = containerReason;
            return true;
          }

          signal = _.get(containerStatus, 'state.terminated.signal');
          if (signal) {
            reason = "Signal: " + signal;
            return true;
          }

          exitCode = _.get(containerStatus, 'state.terminated.exitCode');
          if (exitCode) {
            reason = "Exit Code: " + exitCode;
            return true;
          }
        });
      }

      return reason;
    };
  })
  .filter('podStartTime', function() {
    return function(pod) {
      var earliestStartTime = null;
      _.each(_.get(pod, 'status.containerStatuses'), function(containerStatus){
        var status = _.get(containerStatus, 'state.running') || _.get(containerStatus, 'state.terminated');
        if (!status) {
          return;
        }
        if (!earliestStartTime || moment(status.startedAt).isBefore(earliestStartTime)) {
          earliestStartTime = status.startedAt;
        }
      });
      return earliestStartTime;
    };
  })
  .filter('podCompletionTime', function() {
    return function(pod) {
      var lastFinishTime = null;
      _.each(_.get(pod, 'status.containerStatuses'), function(containerStatus){
        var status = _.get(containerStatus, 'state.terminated');
        if (!status) {
          return;
        }
        if (!lastFinishTime || moment(status.finishedAt).isAfter(lastFinishTime)) {
          lastFinishTime = status.finishedAt;
        }
      });
      return lastFinishTime;
    };
  })
  .filter('routeIngressCondition', function() {
    return function(ingress, type) {
      if (!ingress) {
        return null;
      }
      return _.find(ingress.conditions, {type: type});
    };
  })
  .filter('routeHost', function() {
    return function (route, onlyAdmitted) {
      if (!_.get(route, 'status.ingress')) {
        return _.get(route, 'spec.host');
      }

      if (!route.status.ingress) {
        return route.spec.host;
      }
      var oldestAdmittedIngress = null;
      angular.forEach(route.status.ingress, function(ingress) {
        if (_.some(ingress.conditions, { type: "Admitted", status: "True" }) &&
            (!oldestAdmittedIngress || oldestAdmittedIngress.lastTransitionTime > ingress.lastTransitionTime)) {
          oldestAdmittedIngress = ingress;
        }
      });

      if (oldestAdmittedIngress) {
        return oldestAdmittedIngress.host;
      }

      return onlyAdmitted ? null : route.spec.host;
    };
  })
  .filter('isRequestCalculated', function(LimitRangesService) {
    return function(computeResource, project) {
      return LimitRangesService.isRequestCalculated(computeResource, project);
    };
  })
  .filter('isLimitCalculated', function(LimitRangesService) {
    return function(computeResource, project) {
      return LimitRangesService.isLimitCalculated(computeResource, project);
    };
  })
  .filter('podTemplate', function() {
    return function(apiObject) {
      if (!apiObject) {
        return null;
      }

      if (apiObject.kind === 'Pod') {
        return apiObject;
      }

      return _.get(apiObject, 'spec.template');
    };
  })
  .filter('hasHealthChecks', function() {
    return function(podTemplate) {
      // Returns true if every container has a readiness or liveness probe.
      var containers = _.get(podTemplate, 'spec.containers', []);
      return _.every(containers, function(container) {
        return container.readinessProbe || container.livenessProbe;
      });
    };
  })
  .filter('scopeDetails', function(sentenceCaseFilter) {
    var scopeMessages = {
      "Terminating": "Affects pods that have an active deadline. These pods usually include builds, deployers, and jobs.",
      "NotTerminating": "Affects pods that do not have an active deadline. These pods usually include your applications.",
      "BestEffort": "Affects pods that do not have resource limits set. These pods have a best effort quality of service.",
      "NotBestEffort": "Affects pods that have at least one resource limit set. These pods do not have a best effort quality of service."
    };
    return function(scope) {
      return scopeMessages[scope] || sentenceCaseFilter(scope);
    };
  })
  .filter('isDebugPod', function(annotationFilter) {
    return function(pod) {
      return !!annotationFilter(pod, 'debug.openshift.io/source-resource');
    };
  })
  .filter('debugPodSourceName', function(annotationFilter) {
    return function(pod) {
      var source = annotationFilter(pod, 'debug.openshift.io/source-resource');
      if (!source) {
        return '';
      }

      var parts = source.split('/');
      if (parts.length !== 2) {
        Logger.warn('Invalid debug.openshift.io/source-resource annotation value "' + source + '"');
        return '';
      }

      return parts[1];
    };
  })
  // Determines the container entrypoint command from the container and docker image metadata.
  .filter('entrypoint', function() {
    // If `cmd` is an array (exec form), converts it to a string for display.
    var toShellForm = function(cmd) {
      if (_.isArray(cmd)) {
        return cmd.join(' ');
      }

      return cmd;
    };

    return function(container, image) {
      if (!container) {
        return null;
      }

      // http://kubernetes.io/docs/user-guide/containers/#how-docker-handles-command-and-arguments
      var entrypoint,
          cmd = toShellForm(container.command),
          args = toShellForm(container.args);

      // If `container.command` is specified, use that instead of image entrypoint. Add `container.args` if present.
      if (cmd && args) {
        return cmd + " " + args;
      }

      if (cmd) {
        return cmd;
      }

      if (image) {
        entrypoint = toShellForm(_.get(image, 'dockerImageMetadata.Config.Entrypoint') || ["/bin/sh", "-c"]);

        // If `container.args` is supplied without `container.command`, use container args with the image entrypoint.
        if (args) {
          return entrypoint + " " + args;
        }

        // Otherwise, use container entrypoint with container command.
        cmd = toShellForm(_.get(image, 'dockerImageMetadata.Config.Cmd'));
        if (cmd) {
          return entrypoint + " " + cmd;
        }
      }

      if (args) {
        return "<image-entrypoint> " + args;
      }

      return null;
    };
  })
  .filter('unidleTargetReplicas', function(annotationFilter) {
    return function(resource, hpa) {
      var previousScale;
      if (resource) {
        try {
          previousScale = parseInt(annotationFilter(resource, 'idledPreviousScale'));
        }
        catch (e) {
          Logger.error("Unable to parse previous scale annotation as a number.");
        }
      }
      return previousScale || _.get(_.head(hpa), 'spec.minReplicas') || 1;
    };
  })
  .filter('lastDeploymentRevision', function(annotationFilter) {
    return function(deployment) {
      if (!deployment) {
        return '';
      }

      var revision = annotationFilter(deployment, 'deployment.kubernetes.io/revision');
      return revision ? "#" + revision : 'Unknown';
    };
  })
  .filter('hasPostCommitHook', function() {
    // Check if a build or build config has a post commit hook.
    return function(build) {
      return _.has(build, 'spec.postCommit.command') ||
             _.has(build, 'spec.postCommit.script') ||
             _.has(build, 'spec.postCommit.args');
    };
  })
  .filter('volumeMountMode', function() {
    var isConfigVolume = function(volume) {
      return _.has(volume, 'configMap') || _.has(volume, 'secret');
    };

    return function(mount, volumes) {
      if (!mount) {
        return '';
      }

      // Config maps and secrets are always read-only, even if not explicitly
      // set in the volume mount.
      var volume = _.find(volumes, { name: mount.name });
      if (isConfigVolume(volume)) {
        return 'read-only';
      }

      if (_.get(volume, 'persistentVolumeClaim.readOnly')) {
        return 'read-only';
      }

      return mount.readOnly ? 'read-only' : 'read-write';
    };
  })
  .filter('managesRollouts', function(APIService) {
    // Return true for API objects that manage rollouts (deployment configs and deployments).
    return function(object) {
      if (!object) {
        return false;
      }

      var rgv = APIService.objectToResourceGroupVersion(object);
      if (rgv.resource === 'deploymentconfigs' && !rgv.group) {
        return true;
      }

      if (rgv.resource === 'deployments' && (rgv.group === 'apps' || rgv.group === 'extensions')) {
        return true;
      }

      return false;
    };
  })
  .filter('hasAlternateBackends', function() {
    return function (route) {
      var alternateBackends = _.get(route, 'spec.alternateBackends', []);
      return !_.isEmpty(alternateBackends);
    };
  })
  .filter('readyConditionMessage', function(statusConditionFilter) {
    return function(instance) {
      return _.get(statusConditionFilter(instance, 'Ready'), 'message');
    };
  })
  .filter('failedConditionMessage', function(statusConditionFilter) {
    return function(instance) {
      return _.get(statusConditionFilter(instance, 'Failed'), 'message');
    };
  })
  .filter('serviceInstanceConditionMessage', function(serviceInstanceStatusFilter, statusConditionFilter) {
    return function(instance) {
      var serviceInstanceStatus = serviceInstanceStatusFilter(instance);
      var serviceInstanceMessage = null;

      switch(serviceInstanceStatus) {
        case 'Failed':
        case 'Ready':
          serviceInstanceMessage = _.get(statusConditionFilter(instance, serviceInstanceStatus), 'message');
          break;
      }

      return serviceInstanceMessage;
    };
  })
  .filter('humanizeReason', function() {
    return function(reason) {
      var humanizedReason = _.startCase(reason);
      // Special case some values like "BackOff" -> "Back-off"
      return humanizedReason.replace("Back Off", "Back-off").replace("O Auth", "OAuth");
    };
  })
  .filter('humanizePodStatus', function(humanizeReasonFilter) {
    return humanizeReasonFilter;
  })
  .filter('donutURL', function(navigateResourceURLFilter) {
    return function(set, pods) {
      if (_.size(pods) === 1) {
        return navigateResourceURLFilter(_.sample(pods));
      }
      if (_.size(pods) > 1) {
        return navigateResourceURLFilter(set);
      }
    };
  });
