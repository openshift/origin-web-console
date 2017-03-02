angular.module('openshiftConsoleTemplates', []).run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('views/_alerts.html',
    "<div ng-attr-row=\"{{toast}}\" ng-attr-wrap=\"{{toast}}\">\n" +
    "<div ng-repeat=\"(alertID, alert) in (alerts | filterCollection : filter) track by (alertID + (alert.message || alert.details))\" ng-if=\"!alert.hidden\" class=\"alert-wrapper animate-repeat\" ng-class=\"{'animate-slide': animateSlide}\">\n" +
    "<div class=\"alert word-break\" ng-class=\"{\n" +
    "      'alert-danger': alert.type === 'error',\n" +
    "      'alert-warning': alert.type === 'warning',\n" +
    "      'alert-success': alert.type === 'success',\n" +
    "      'alert-info': !alert.type || alert.type === 'info',\n" +
    "      'toast-pf': toast,\n" +
    "      'mar-left-sm': toast\n" +
    "    }\">\n" +
    "<button ng-if=\"!hideCloseButton\" ng-click=\"close(alert)\" type=\"button\" class=\"close\">\n" +
    "<span class=\"pficon pficon-close\" aria-hidden=\"true\"></span>\n" +
    "<span class=\"sr-only\">Close</span>\n" +
    "</button>\n" +
    "<span class=\"pficon\" aria-hidden=\"true\" ng-class=\"{\n" +
    "        'pficon-error-circle-o': alert.type === 'error',\n" +
    "        'pficon-warning-triangle-o': alert.type === 'warning',\n" +
    "        'pficon-ok': alert.type === 'success',\n" +
    "        'pficon-info': !alert.type || alert.type === 'info'\n" +
    "      }\"></span>\n" +
    "<span class=\"sr-only\">{{alert.type}}</span>\n" +
    "<span ng-if=\"alert.message\" style=\"margin-right: 5px\" ng-class=\"{'strong': !toast}\">{{alert.message}}</span><span ng-if=\"alert.details\">{{alert.details}}</span>\n" +
    "<span ng-repeat=\"link in alert.links\">\n" +
    "<a ng-if=\"!link.href\" href=\"\" ng-click=\"onClick(alert, link)\" role=\"button\" ng-attr-target=\"{{link.target}}\">{{link.label}}</a>\n" +
    "<a ng-if=\"link.href\" href=\"{{link.href}}\" ng-click=\"onClick(alert, link)\" ng-attr-target=\"{{link.target}}\">{{link.label}}</a>\n" +
    "<span ng-if=\"!$last\" class=\"action-divider\">|</span>\n" +
    "</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/_build-trends-chart.html',
    " <div class=\"build-trends-responsive\" aria-hidden=\"true\" ng-show=\"completeBuilds.length >= minBuilds()\">\n" +
    "<div class=\"build-trends-container\">\n" +
    "\n" +
    "<div ng-attr-id=\"{{chartID}}\" class=\"build-trends-chart\"></div>\n" +
    "\n" +
    "<div ng-if=\"averageDurationText\" class=\"avg-duration pull-right\">\n" +
    "<a href=\"\" ng-click=\"toggleAvgLine()\" title=\"Toggle average line\" role=\"button\" class=\"action-button\">\n" +
    "<span class=\"avg-duration-text text-muted\">\n" +
    "<svg width=\"25\" height=\"20\">\n" +
    "<line class=\"build-trends-avg-line\" x1=\"0\" y1=\"10\" x2=\"25\" y2=\"10\"/>\n" +
    "</svg>\n" +
    "<span style=\"vertical-align: top\">Average: {{averageDurationText}}</span>\n" +
    "</span>\n" +
    "</a>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "\n" +
    "<div ng-if=\"completeBuilds.length < minBuilds()\" class=\"gutter-bottom\"></div>\n" +
    "<div ng-if=\"averageDurationText\" class=\"sr-only\">\n" +
    "Average build duration {{averageDurationText}}\n" +
    "</div>"
  );


  $templateCache.put('views/_cannot-create-project.html',
    "<span ng-if=\"!newProjectMessage\">A cluster admin can create a project for you by running the command\n" +
    "<code>oadm new-project &lt;projectname&gt; --admin={{user.metadata.name || '&lt;YourUsername&gt;'}}</code></span>\n" +
    "<span ng-if=\"newProjectMessage\" ng-bind-html=\"newProjectMessage | linkify : '_blank'\" class=\"projects-instructions-link\"></span>"
  );


  $templateCache.put('views/_compute-resource.html',
    "<ng-form name=\"form\">\n" +
    "<fieldset class=\"form-inline compute-resource\">\n" +
    "<label ng-if=\"label\">{{label}}</label>\n" +
    "<div class=\"resource-size\" ng-class=\"{ 'has-error': form.$invalid }\">\n" +
    "<div class=\"resource-amount\">\n" +
    "<label class=\"sr-only\" ng-attr-for=\"{{id}}\">Amount</label>\n" +
    "<input type=\"number\" name=\"amount\" ng-attr-id=\"{{id}}\" ng-model=\"input.amount\" min=\"0\" ng-attr-placeholder=\"{{placeholder}}\" class=\"form-control\" ng-attr-aria-describedby=\"{{description ? id + '-help' : undefined}}\">\n" +
    "</div>\n" +
    "<div class=\"resource-unit\">\n" +
    "<label class=\"sr-only\" ng-attr-for=\"{{id}}-unit\">Unit</label>\n" +
    "<ui-select search-enabled=\"false\" ng-model=\"input.unit\" input-id=\"{{id}}-unit\">\n" +
    "<ui-select-match>{{$select.selected.label}}</ui-select-match>\n" +
    "<ui-select-choices repeat=\"option.value as option in units\" group-by=\"groupUnits\">\n" +
    "{{option.label}}\n" +
    "</ui-select-choices>\n" +
    "</ui-select>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"description\" class=\"help-block\" ng-attr-id=\"{{id}}-help\">\n" +
    "{{description}}\n" +
    "</div>\n" +
    "<div ng-if=\"form.$invalid\" class=\"has-error\">\n" +
    "<div ng-if=\"form.amount.$error.number\" class=\"help-block\">\n" +
    "Must be a number.\n" +
    "</div>\n" +
    "<div ng-if=\"form.amount.$error.min\" class=\"help-block\">\n" +
    "Can't be negative.\n" +
    "</div>\n" +
    "<div ng-if=\"form.amount.$error.limitRangeMin\" class=\"help-block\">\n" +
    "Can't be less than {{limitRangeMin | usageWithUnits : type}}.\n" +
    "</div>\n" +
    "<div ng-if=\"form.amount.$error.limitRangeMax\" class=\"help-block\">\n" +
    "Can't be greater than {{limitRangeMax | usageWithUnits : type}}.\n" +
    "</div>\n" +
    "<div ng-if=\"form.amount.$error.limitLargerThanRequest\" class=\"help-block\">\n" +
    "Limit can't be less than request ({{request | usageWithUnits : type}}).\n" +
    "</div>\n" +
    "<div ng-if=\"form.amount.$error.limitWithinRatio\" class=\"help-block\">\n" +
    "<span ng-if=\"!input.amount && !defaultValue\">\n" +
    "Limit is required if request is set. (Max Limit/Request Ratio: {{maxLimitRequestRatio}})\n" +
    "</span>\n" +
    "<span ng-if=\"input.amount || defaultValue\">\n" +
    "Limit cannot be more than {{maxLimitRequestRatio}} times request value. (Request: {{request | usageWithUnits : type}},\n" +
    "\n" +
    "Limit: {{(input.amount ? (input.amount + input.unit) : defaultValue) | usageWithUnits : type}})\n" +
    "</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "</fieldset>\n" +
    "</ng-form>"
  );


  $templateCache.put('views/_config-file-params.html',
    "<div ng-repeat=\"(serverName, data) in secretData\" class=\"image-source-item\">\n" +
    "<h3>{{serverName}}</h3>\n" +
    "<dt>username</dt>\n" +
    "<dd class=\"word-break\">{{data.username}}</dd>\n" +
    "<dt>password</dt>\n" +
    "<dd ng-if=\"view.showSecret\">\n" +
    "<copy-to-clipboard clipboard-text=\"data.password\" display-wide=\"true\"></copy-to-clipboard>\n" +
    "</dd>\n" +
    "<dd ng-if=\"!view.showSecret\">*****</dd>\n" +
    "<dt>email</dt>\n" +
    "<dd class=\"word-break\">{{data.email}}</dd>\n" +
    "</div>"
  );


  $templateCache.put('views/_deployment-config-metadata.html',
    "<div ng-if=\"deploymentConfigId != ''\" class=\"metadata\">\n" +
    "<span>Created from deployment config {{deploymentConfigId}}</span>\n" +
    "<span ng-if=\"!exists\" data-toggle=\"tooltip\" title=\"Deployment config no longer exists\" class=\"pficon pficon-error-circle-o\" style=\"cursor: help\"></span>\n" +
    "<span ng-if=\"exists && differentService\" data-toggle=\"tooltip\" title=\"The template for this deployment config has changed. New deployments will not be included in this list.\" class=\"pficon pficon-error-circle-o\" style=\"cursor: help\"></span>\n" +
    "</div>"
  );


  $templateCache.put('views/_edit-request-limit.html',
    "<ng-form name=\"form\" ng-if=\"!requestCalculated || !limitCalculated\">\n" +
    "<h3>\n" +
    "{{type | computeResourceLabel : true}}\n" +
    "<small ng-if=\"limits.min && limits.max\">\n" +
    "{{limits.min | usageWithUnits : type}} min to {{limits.max | usageWithUnits : type}} max\n" +
    "</small>\n" +
    "<small ng-if=\"limits.min && !limits.max\">\n" +
    "Min: {{limits.min | usageWithUnits : type}}\n" +
    "</small>\n" +
    "<small ng-if=\"limits.max && !limits.min\">\n" +
    "Max: {{limits.max | usageWithUnits : type}}\n" +
    "</small>\n" +
    "</h3>\n" +
    "\n" +
    "<compute-resource ng-model=\"resources.requests[type]\" type=\"{{type}}\" label=\"Request\" description=\"The minimum amount of {{type | computeResourceLabel}} the container is guaranteed.\" default-value=\"limits.defaultRequest\" limit-range-min=\"limits.min\" limit-range-max=\"limits.max\" max-limit-request-ratio=\"limits.maxLimitRequestRatio\" ng-if=\"!requestCalculated\">\n" +
    "</compute-resource>\n" +
    "\n" +
    "<compute-resource ng-model=\"resources.limits[type]\" type=\"{{type}}\" label=\"{{requestCalculated ? undefined : 'Limit'}}\" description=\"The maximum amount of {{type | computeResourceLabel}} the container is allowed to use when running.\" default-value=\"limits.defaultLimit\" limit-range-min=\"limits.min\" limit-range-max=\"limits.max\" request=\"requestCalculated ? undefined : resources.requests[type]\" max-limit-request-ratio=\"limits.maxLimitRequestRatio\" ng-if=\"!hideLimit\">\n" +
    "</compute-resource>\n" +
    "<div class=\"learn-more-block\">\n" +
    "<a href=\"\" ng-click=\"showComputeUnitsHelp()\">What are\n" +
    "<span ng-if=\"type === 'cpu'\">millicores</span><span ng-if=\"type === 'memory'\">MiB</span>?</a>\n" +
    "</div>\n" +
    "</ng-form>"
  );


  $templateCache.put('views/_overview-deployment.html',
    " <div class=\"osc-object components-panel deployment-block\" kind=\"ReplicationController\" resource=\"rc\" ng-init=\"hasDeploymentConfig = (deploymentConfigId && (rc | annotation:'deploymentConfig') && (rc | annotation:'deploymentVersion'))\">\n" +
    "\n" +
    "<div class=\"connector\">\n" +
    "<i class=\"fa fa-search\"></i>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"component-block component-meta\" ng-if=\"hasDeploymentConfig\">\n" +
    "<div class=\"component\">\n" +
    "<div class=\"component-label\">\n" +
    "<span>Deployment: </span>\n" +
    "<span class=\"nowrap\">\n" +
    "<a class=\"subtle-link\" ng-href=\"{{deploymentConfigId | navigateResourceURL : 'DeploymentConfig' : rc.metadata.namespace}}\">{{deploymentConfigId}}</a>,\n" +
    "<a class=\"subtle-link\" ng-href=\"{{rc | navigateResourceURL}}\">#{{rc | annotation:'deploymentVersion'}}</a>\n" +
    "</span>\n" +
    "<span ng-if=\"deploymentConfigMissing\" data-toggle=\"tooltip\" title=\"The deployment config this deployment was created from no longer exists.\" class=\"pficon pficon-warning-triangle-o\" style=\"cursor: help\"></span>\n" +
    "<span ng-if=\"deploymentConfigDifferentService\" data-toggle=\"tooltip\" title=\"The deployment config this deployment was created from has changed. New deployments will not be included in this list.\" class=\"pficon pficon-warning-triangle-o\" style=\"cursor: help\"></span>\n" +
    "\n" +
    "<span ng-if=\"rc | deploymentIsInProgress\">&mdash; <i class=\"fa fa-refresh\" aria-hidden=\"true\"></i> In progress</span>\n" +
    "<span ng-switch=\"rc | deploymentStatus\" class=\"hide-ng-leave\">\n" +
    "<span ng-switch-when=\"Cancelled\">&mdash; <span class=\"text-warning\"><i class=\"fa fa-ban\" aria-hidden=\"true\"></i> Cancelled</span></span>\n" +
    "<span ng-switch-when=\"Failed\">&mdash; <span class=\"text-danger\"><i class=\"fa fa-times\" aria-hidden=\"true\"></i> Failed</span></span>\n" +
    "</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"component meta-data\">\n" +
    "<span am-time-ago=\"rc.metadata.creationTimestamp\"></span><span ng-if=\"rc.causes.length\"><span>\n" +
    "<span class=\"deployment-trigger\" ng-repeat=\"cause in rc.causes\">\n" +
    "<span ng-switch=\"cause.type\">\n" +
    "<span ng-switch-when=\"ImageChange\">\n" +
    "<span ng-if=\"cause.imageTrigger.from\">\n" +
    "from <abbr title=\"{{cause.imageTrigger.from | imageObjectRef : null : true}}\">image</abbr> change\n" +
    "</span>\n" +
    "</span>\n" +
    "<span ng-switch-when=\"ConfigChange\">from config change</span>\n" +
    "<span ng-switch-default>{{cause.type}}</span>\n" +
    "</span>\n" +
    "</span>\n" +
    "</span>\n" +
    "</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"component-block component-meta\" ng-if=\"!hasDeploymentConfig\">\n" +
    "<div class=\"component\">\n" +
    "<div class=\"component-label\">\n" +
    "Replication Controller:\n" +
    "<a class=\"subtle-link nowrap\" ng-href=\"{{rc | navigateResourceURL}}\">{{rc.metadata.name}}</a>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"component meta-data\">\n" +
    "created <span am-time-ago=\"rc.metadata.creationTimestamp\"></span>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div row mobile=\"column\" axis=\"center center\" class=\"pod-block\">\n" +
    "<div column class=\"deployment-pods\" axis=\"center center\">\n" +
    "<deployment-donut rc=\"rc\" deployment-config=\"deploymentConfig\" pods=\"pods\" hpa=\"hpa\" quotas=\"quotas\" cluster-quotas=\"clusterQuotas\" limit-ragnes=\"limitRanges\" scalable=\"scalable\" alerts=\"alerts\">\n" +
    "</deployment-donut>\n" +
    "</div>\n" +
    "\n" +
    "<div column grow=\"2\" class=\"pod-template-column\">\n" +
    "\n" +
    "<div flex></div>\n" +
    "<pod-template pod-template=\"rc.spec.template\" images-by-docker-reference=\"imagesByDockerReference\" builds=\"builds\">\n" +
    "</pod-template>\n" +
    "\n" +
    "<div flex></div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/_overview-monopod.html',
    " <div class=\"tile-container components-panel deployment-block osc-object\" kind=\"Pod\" resource=\"pod\">\n" +
    "<div class=\"connector\">\n" +
    "<i class=\"fa fa-search\"></i>\n" +
    "</div>\n" +
    "<div class=\"component-block component-meta\">\n" +
    "<div class=\"component\">\n" +
    "<span class=\"component-label\">Pod: {{pod.metadata.name}}</span>\n" +
    "</div>\n" +
    "<div class=\"component meta-data\">\n" +
    "created <span am-time-ago=\"pod.metadata.creationTimestamp\"></span>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div row mobile=\"column\" axis=\"center center\" class=\"pod-block\">\n" +
    "<div row>\n" +
    "\n" +
    "<div flex class=\"visible-xs-block\"></div>\n" +
    "<div column class=\"overview-pods\">\n" +
    "<div column>\n" +
    "<pod-donut pods=\"[pod]\" ng-click=\"viewPod()\"></pod-donut>\n" +
    "</div>\n" +
    "</div>\n" +
    "\n" +
    "<div flex class=\"visible-xs-block\"></div>\n" +
    "</div>\n" +
    "<div column grow=\"2\">\n" +
    "\n" +
    "<div flex></div>\n" +
    "<pod-template pod-template=\"pod\"></pod-template>\n" +
    "\n" +
    "<div flex></div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/_parse-error.html',
    "<div ng-show=\"error && !hidden\" class=\"alert alert-danger animate-show\">\n" +
    "<button ng-click=\"hidden = true\" type=\"button\" class=\"close\" aria-hidden=\"true\">\n" +
    "<span class=\"pficon pficon-close\"></span>\n" +
    "</button>\n" +
    "<span class=\"pficon pficon-error-circle-o\"></span>\n" +
    "<strong>Failed to process the resource.</strong>\n" +
    "<div class=\"pre-wrap\" ng-if=\"error.message\">{{error.message}}</div>\n" +
    "</div>"
  );


  $templateCache.put('views/_pod-template.html',
    " <div ng-if=\"detailed && addHealthCheckUrl && !(podTemplate | hasHealthChecks)\" class=\"alert alert-info\">\n" +
    "<span class=\"pficon pficon-info\" aria-hidden=\"true\"></span>\n" +
    "<span ng-if=\"podTemplate.spec.containers.length === 1\">This container has no health checks</span>\n" +
    "<span ng-if=\"podTemplate.spec.containers.length > 1\">Not all containers have health checks</span>\n" +
    "to ensure your application is running correctly.\n" +
    "<a ng-href=\"{{addHealthCheckUrl}}\" class=\"nowrap\">Add Health Checks</a>\n" +
    "</div>\n" +
    "<div class=\"pod-template-container\">\n" +
    "<div class=\"pod-template-block\" ng-repeat=\"container in podTemplate.spec.containers\">\n" +
    "<div class=\"pod-template\">\n" +
    "<div class=\"component-label\">Container: {{container.name}}</div>\n" +
    "<div row ng-if=\"container.image\" class=\"pod-template-image icon-row\">\n" +
    "<div class=\"icon-wrap\">\n" +
    "<span class=\"pficon pficon-image\" aria-hidden=\"true\"></span>\n" +
    "</div>\n" +
    "<div flex class=\"word-break\">\n" +
    "<span class=\"pod-template-key\">Image:</span>\n" +
    "<span ng-if=\"!imagesByDockerReference[container.image]\">{{container.image | imageStreamName}}</span>\n" +
    "<span ng-if=\"imagesByDockerReference[container.image]\">\n" +
    "<a ng-href=\"{{imagesByDockerReference[container.image].imageStreamName | navigateResourceURL : 'ImageStream' : imagesByDockerReference[container.image].imageStreamNamespace}}\">{{container.image | imageStreamName}}</a>\n" +
    "<span class=\"hash\" title=\"{{imagesByDockerReference[container.image].metadata.name}}\">{{imagesByDockerReference[container.image].metadata.name | stripSHAPrefix | limitTo: 7}}</span>\n" +
    "<span ng-if=\"imagesByDockerReference[container.image].dockerImageMetadata.Size\" class=\"small text-muted nowrap\">\n" +
    "{{imagesByDockerReference[container.image].dockerImageMetadata.Size | humanizeSize}}\n" +
    "</span>\n" +
    "</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"imagesByDockerReference && container.image && (image = imagesByDockerReference[container.image])\" class=\"pod-template-build\">\n" +
    "<div row class=\"icon-row\" ng-if=\"build = (image | buildForImage : builds)\">\n" +
    "<div class=\"icon-wrap\">\n" +
    "<span class=\"fa fa-refresh\" aria-hidden=\"true\"></span>\n" +
    "</div>\n" +
    "<div flex class=\"word-break\">\n" +
    "<span class=\"pod-template-key\">Build:</span>\n" +
    "<span ng-if=\"build | configURLForResource\">\n" +
    "<a ng-href=\"{{build | configURLForResource}}\">{{build | buildConfigForBuild}}</a>,\n" +
    "</span>\n" +
    "<a ng-href=\"{{build | navigateResourceURL}}\">\n" +
    "<span ng-if=\"(build | annotation : 'buildNumber')\">#{{build | annotation : 'buildNumber'}}</span>\n" +
    "<span ng-if=\"!(build | annotation : 'buildNumber')\">{{build.metadata.name}}</span>\n" +
    "</a>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div row class=\"icon-row\" ng-if=\"build.spec.source\">\n" +
    "<div class=\"icon-wrap\">\n" +
    "<span class=\"fa fa-code\" aria-hidden=\"true\"></span>\n" +
    "</div>\n" +
    "<div flex>\n" +
    "<span class=\"pod-template-key\">Source:</span>\n" +
    "<span ng-switch=\"build.spec.source.type\">\n" +
    "<span ng-switch-when=\"Git\">\n" +
    "<span ng-if=\"build.spec.revision.git.commit\">\n" +
    "{{build.spec.revision.git.message}}\n" +
    "<osc-git-link class=\"hash\" uri=\"build.spec.source.git.uri\" ref=\"build.spec.revision.git.commit\">{{build.spec.revision.git.commit | limitTo:7}}</osc-git-link>\n" +
    "<span ng-if=\"detailed && build.spec.revision.git.author\">\n" +
    "authored by {{build.spec.revision.git.author.name}}\n" +
    "</span>\n" +
    "</span>\n" +
    "<span ng-if=\"!build.spec.revision.git.commit\">\n" +
    "<osc-git-link uri=\"build.spec.source.git.uri\">{{build.spec.source.git.uri}}</osc-git-link>\n" +
    "</span>\n" +
    "</span>\n" +
    "<span ng-switch-default>\n" +
    "{{build.spec.source.type || 'Unknown'}}\n" +
    "</span>\n" +
    "</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div row ng-if=\"detailed && (container.command.length || container.args.length)\" class=\"icon-row\">\n" +
    "<div class=\"icon-wrap\">\n" +
    "<span aria-hidden=\"true\" class=\"fa fa-terminal\"></span>\n" +
    "</div>\n" +
    "<div flex class=\"word-break\">\n" +
    "<span class=\"pod-template-key\">\n" +
    "Command:\n" +
    "</span>\n" +
    "<span>\n" +
    "<code class=\"command\">\n" +
    "<truncate-long-text content=\"container | entrypoint : imagesByDockerReference[container.image]\" limit=\"80\" newline-limit=\"1\" expandable=\"true\" use-word-boundary=\"false\">\n" +
    "</truncate-long-text>\n" +
    "</code>\n" +
    "</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div row ng-if=\"container.ports.length > 0\" class=\"pod-template-ports icon-row\">\n" +
    "<div class=\"icon-wrap\">\n" +
    "<span data-icon=\"\" aria-hidden=\"true\" style=\"font-size:16px;line-height:normal\"></span>\n" +
    "</div>\n" +
    "<div flex class=\"word-break\">\n" +
    "<span class=\"pod-template-key\">Ports:</span>\n" +
    "<span ng-repeat=\"port in container.ports | orderBy: 'containerPort'\">\n" +
    "<span><span class=\"nowrap\">{{port.containerPort}}/{{port.protocol}}</span>\n" +
    "<span ng-if=\"port.name\"> <span class=\"nowrap\">({{port.name}})</span></span>\n" +
    "<span ng-if=\"port.hostPort\"> <span class=\"nowrap\"><span class=\"port-icon\">&#8594;</span> {{port.hostPort}}</span></span>\n" +
    "</span>\n" +
    "<span ng-if=\"!$last\">, </span>\n" +
    "</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div row ng-if=\"detailed\" ng-repeat=\"mount in container.volumeMounts\" class=\"icon-row\">\n" +
    "<div class=\"icon-wrap\">\n" +
    "<span aria-hidden=\"true\" class=\"fa fa-database\"></span>\n" +
    "</div>\n" +
    "<div flex class=\"word-break\">\n" +
    "<span class=\"pod-template-key\">Mount:</span>\n" +
    "<span>\n" +
    "{{mount.name}}<span ng-if=\"mount.subPath\">, subpath {{mount.subPath}}</span>&#8201;&#8594;&#8201;<span>{{mount.mountPath}}</span>\n" +
    "<small class=\"text-muted\">{{mount | volumeMountMode : podTemplate.spec.volumes}}</small>\n" +
    "</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div row ng-if=\"detailed && (container.resources.requests.cpu || container.resources.limits.cpu)\" class=\"icon-row\">\n" +
    "<div class=\"icon-wrap\">\n" +
    "<i class=\"fa fa-area-chart\" aria-hidden=\"true\"></i>\n" +
    "</div>\n" +
    "<div flex>\n" +
    "<span class=\"pod-template-key\">CPU:</span>\n" +
    "<span ng-if=\"container.resources.requests.cpu && container.resources.limits.cpu\">\n" +
    "{{container.resources.requests.cpu | usageWithUnits: 'cpu'}} to {{container.resources.limits.cpu | usageWithUnits: 'cpu'}}\n" +
    "</span>\n" +
    "<span ng-if=\"!container.resources.requests.cpu\">\n" +
    "{{container.resources.limits.cpu | usageWithUnits: 'cpu'}} limit\n" +
    "</span>\n" +
    "<span ng-if=\"!container.resources.limits.cpu\">\n" +
    "{{container.resources.requests.cpu | usageWithUnits: 'cpu'}} requested\n" +
    "</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div row ng-if=\"detailed && (container.resources.requests.memory || container.resources.limits.memory)\" class=\"icon-row\">\n" +
    "<div class=\"icon-wrap\">\n" +
    "<i class=\"fa fa-area-chart\" aria-hidden=\"true\"></i>\n" +
    "</div>\n" +
    "<div flex>\n" +
    "<span class=\"pod-template-key\">Memory:</span>\n" +
    "<span ng-if=\"container.resources.requests.memory && container.resources.limits.memory\">\n" +
    "{{container.resources.requests.memory | usageWithUnits: 'memory'}} to {{container.resources.limits.memory | usageWithUnits: 'memory'}}\n" +
    "</span>\n" +
    "<span ng-if=\"!container.resources.requests.memory\">\n" +
    "{{container.resources.limits.memory | usageWithUnits: 'memory'}} limit\n" +
    "</span>\n" +
    "<span ng-if=\"!container.resources.limits.memory\">\n" +
    "{{container.resources.requests.memory | usageWithUnits: 'memory'}} requested\n" +
    "</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div row ng-if=\"detailed && container.readinessProbe\" class=\"icon-row\">\n" +
    "<div class=\"icon-wrap\">\n" +
    "<i class=\"fa fa-medkit\" aria-hidden=\"true\"></i>\n" +
    "</div>\n" +
    "<div flex>\n" +
    "<span class=\"pod-template-key\">Readiness Probe:</span>\n" +
    "<probe probe=\"container.readinessProbe\"></probe>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div row ng-if=\"detailed && container.livenessProbe\" class=\"icon-row\">\n" +
    "<div class=\"icon-wrap\">\n" +
    "<i class=\"fa fa-medkit\" aria-hidden=\"true\"></i>\n" +
    "</div>\n" +
    "<div flex>\n" +
    "<span class=\"pod-template-key\">Liveness Probe:</span>\n" +
    "<probe probe=\"container.livenessProbe\"></probe>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div extension-point extension-name=\"container-links\" extension-types=\"link dom\" extension-args=\"[container, podTemplate]\"></div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/_pods.html',
    " <div class=\"component-block\" ng-if=\"(pods | hashSize) > 3\">\n" +
    "<div class=\"pod-container\">\n" +
    "<div class=\"pod pod-{{phase.toLowerCase()}} pod-multiple osc-object osc-object-stacked\" ng-repeat-start=\"phase in phases\" ng-if=\"(phasePods = (pods | podsForPhase : phase)).length && (troublePods = (phasePods | troubledPods)) && (expandedPhase != phase || warningsExpanded) && (phasePods.length - troublePods.length > 0)\" ng-click=\"expandPhase(phase, false, $event)\" title=\"Expand to see individual pods\">\n" +
    "<div style=\"font-size:24px; line-height: 19px\">\n" +
    "<span>{{phasePods.length - troublePods.length}}</span>\n" +
    "</div>\n" +
    "<div class=\"pod-text\">{{phase}}</div>\n" +
    "<i class=\"fa fa-ellipsis-h\"></i>\n" +
    "</div>\n" +
    "<div class=\"pod pod-warning pod-multiple osc-object osc-object-stacked\" ng-repeat-end ng-if=\"(expandedPhase != phase || !warningsExpanded) && (phasePods = (pods | podsForPhase : phase)).length && (troublePods = (phasePods | troubledPods)).length\" ng-click=\"expandPhase(phase, true, $event)\" title=\"Expand to see individual pods\">\n" +
    "<div style=\"font-size:24px; line-height: 19px\">\n" +
    "<span>{{troublePods.length}}</span>\n" +
    "<span ng-if=\"troublePods.length\" data-content=\"These pods are having problems, view a pod to see more details.\" class=\"pficon pficon-warning-triangle-o\" style=\"font-size: 14px; margin-right: -24px\" data-toggle=\"popover\" data-trigger=\"hover\"></span>\n" +
    "</div>\n" +
    "<div class=\"pod-text\">{{phase}}</div>\n" +
    "<i class=\"fa fa-ellipsis-h\"></i>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"component-block\" ng-if=\"(pods | hashSize) > 3\">\n" +
    "<div ng-if=\"expandedPhase\">\n" +
    "<div ng-if=\"!warningsExpanded\">\n" +
    "<div class=\"pod-container\">\n" +
    "<div class=\"pod pod-{{pod.status.phase.toLowerCase()}} osc-object\" ng-repeat=\"pod in (phasePods = (pods | podsForPhase : expandedPhase | notTroubledPods)) | limitTo : 3 track by (pod | uid)\" kind=\"Pod\" resource=\"pod\">\n" +
    "<pod-content pod=\"pod\" troubled=\"false\"></pod-content>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"pull-right small\" style=\"margin-top: -7px\" ng-if=\"(phasePods = (pods | podsForPhase : expandedPhase | notTroubledPods)).length > 0\">\n" +
    "<span ng-if=\"phasePods.length > 3\" style=\"margin-right: 5px; color: #999\">... and {{phasePods.length - 3}} more</span>\n" +
    "<a href=\"javascript:;\" ng-click=\"expandPhase(null)\" style=\"margin-top: -10px\">Collapse</a>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"warningsExpanded\">\n" +
    "<div class=\"pod-container\">\n" +
    "<div class=\"pod pod-warning osc-object\" ng-repeat=\"pod in (phasePods = (pods | podsForPhase : expandedPhase | troubledPods)) | limitTo : 3 track by (pod | uid)\" kind=\"Pod\" resource=\"pod\">\n" +
    "<pod-content pod=\"pod\" troubled=\"true\"></pod-content>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"pull-right small\" style=\"margin-top: -7px\" ng-if=\"(phasePods = (pods | podsForPhase : expandedPhase | troubledPods)).length > 0\">\n" +
    "<span ng-if=\"phasePods.length > 3\" style=\"margin-right: 5px; color: #999\">... and {{phasePods.length - 3}} more</span>\n" +
    "<a href=\"javascript:;\" ng-click=\"expandPhase(null)\" style=\"margin-top: -10px\">Collapse</a>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"component-block\" ng-if=\"(pods | hashSize) <= 3\">\n" +
    "<div class=\"pod-container\">\n" +
    "<div class=\"animate-repeat pod osc-object\" ng-repeat=\"pod in pods track by (pod | uid)\" kind=\"Pod\" resource=\"pod\" ng-class=\"(isTroubled = (pod | isTroubledPod)) ? 'pod-warning' : ('pod-' + pod.status.phase.toLowerCase())\">\n" +
    "<pod-content pod=\"pod\" troubled=\"isTroubled\"></pod-content>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/_project-page.html',
    "<div ng-class=\"{'show-sidebar-right': renderOptions.showEventsSidebar}\" class=\"wrap\">\n" +
    "<div class=\"sidebar-left collapse navbar-collapse navbar-collapse-1\">\n" +
    "<sidebar></sidebar>\n" +
    "</div>\n" +
    "<div id=\"container-main\" class=\"middle\">\n" +
    "<div ng-transclude>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"renderOptions.showEventsSidebar && !renderOptions.collapseEventsSidebar\" class=\"sidebar-right sidebar-pf sidebar-pf-right\">\n" +
    "<div class=\"right-section\">\n" +
    "<events-sidebar ng-if=\"projectContext\" project-context=\"projectContext\" collapsed=\"renderOptions.collapseEventsSidebar\"></events-sidebar>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/_quota-usage-chart.html',
    "<div ng-attr-id=\"{{chartID}}\" ng-style=\"{ width: width + 'px', height: height + 'px' }\" aria-hidden=\"true\">\n" +
    "</div>"
  );


  $templateCache.put('views/_request-access.html',
    "<p class=\"gutter-top\">\n" +
    "If you need to create resources in this project, a project administrator can grant you additional access by running this command:\n" +
    "</p>\n" +
    "<code>oc policy add-role-to-user &lt;role&gt; {{user.metadata.name}} -n {{projectName}}</code>"
  );


  $templateCache.put('views/_settings-general-info.html',
    "<h3>General information</h3>\n" +
    "<div column ng-if=\"!show.editing\">\n" +
    "<div row mobile=\"column\">\n" +
    "<div flex class=\"settings-item\">\n" +
    "<strong>Name:</strong>\n" +
    "</div>\n" +
    "<div flex grow=\"4\" class=\"project-name settings-item\">\n" +
    "{{projectName}}\n" +
    "</div>\n" +
    "</div>\n" +
    "<div row mobile=\"column\">\n" +
    "<div flex class=\"settings-item\">\n" +
    "<strong>Display Name:</strong>\n" +
    "</div>\n" +
    "<div row flex grow=\"4\" class=\"settings-item\">\n" +
    "<div class=\"project-display-name\" ng-if=\"project | displayName: true\">\n" +
    "{{project | displayName: true}}\n" +
    "</div>\n" +
    "<div class=\"project-display-name no-display-name\" ng-if=\"!(project | displayName: true)\">\n" +
    "<em>No display name</em>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div row mobile=\"column\">\n" +
    "<div flex class=\"settings-item\"><strong>Description:</strong></div>\n" +
    "<div row flex grow=\"4\" class=\"settings-item\">\n" +
    "<div ng-if=\"project | description\">\n" +
    "<truncate-long-text class=\"project-description\" content=\"project | description\" limit=\"1024\" use-word-boundary=\"true\"></truncate-long-text>\n" +
    "</div>\n" +
    "<div ng-if=\"!(project | description)\">\n" +
    "<em>No description</em>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<form name=\"editForm\" novalidate ng-if=\"show.editing\">\n" +
    "<div row mobile=\"column\">\n" +
    "<div flex class=\"settings-item\">\n" +
    "<label>\n" +
    "<strong>Name:</strong>\n" +
    "</label>\n" +
    "</div>\n" +
    "<div flex grow=\"4\" class=\"settings-item\">{{projectName}}</div>\n" +
    "</div>\n" +
    "<div row mobile=\"column\">\n" +
    "<div flex class=\"settings-item\">\n" +
    "<label for=\"settings_display_name\">\n" +
    "<strong>Display Name:</strong>\n" +
    "</label>\n" +
    "</div>\n" +
    "<div flex grow=\"2\">\n" +
    "<input id=\"settings_display_name\" class=\"form-control\" type=\"text\" name=\"settings_display_name\" placeholder=\"project display name\" ng-model=\"editableFields.displayName\">\n" +
    "</div>\n" +
    "<div flex grow=\"2\"></div>\n" +
    "</div>\n" +
    "<div row mobile=\"column\" class=\"form-group\">\n" +
    "<div flex class=\"settings-item\">\n" +
    "<label for=\"settings_description\">\n" +
    "<strong>Description: </strong>\n" +
    "</label>\n" +
    "</div>\n" +
    "<div flex grow=\"2\">\n" +
    "<textarea id=\"settings_description\" class=\"form-control\" name=\"settings_description\" placeholder=\"project description\" ng-model=\"editableFields.description\"></textarea>\n" +
    "</div>\n" +
    "<div flex grow=\"2\"></div>\n" +
    "</div>\n" +
    "<div row>\n" +
    "<div flex conceal=\"mobile\" class=\"settings-item\"></div>\n" +
    "<div flex grow=\"2\">\n" +
    "<button class=\"btn btn-default\" ng-click=\"update()\" ng-disabled=\"editForm.$pristine\">Save</button>\n" +
    "<button class=\"btn btn-default\" ng-click=\"cancel()\">Cancel</button>\n" +
    "</div>\n" +
    "<div flex grow=\"2\" conceal=\"mobile\"></div>\n" +
    "</div>\n" +
    "</form>"
  );


  $templateCache.put('views/_sidebar.html',
    "<nav class=\"navbar navbar-sidebar\">\n" +
    "<ul class=\"nav nav-sidenav-primary\">\n" +
    "<li ng-repeat=\"primaryItem in navItems\" ng-class=\"{ active: primaryItem === activePrimary }\" ng-if=\"show(primaryItem)\">\n" +
    "<a ng-if=\"primaryItem.href\" ng-href=\"{{navURL(primaryItem.href)}}\">\n" +
    "<span class=\"{{primaryItem.iconClass}}\"></span> {{primaryItem.label}}\n" +
    "</a>\n" +
    "<a ng-if=\"!primaryItem.href\" href=\"\" data-toggle=\"dropdown\" class=\"dropdown-toggle\">\n" +
    "<span class=\"{{primaryItem.iconClass}}\"></span> {{primaryItem.label}} <span class=\"fa fa-angle-right\"></span>\n" +
    "</a>\n" +
    "<div ng-if=\"primaryItem.secondaryNavSections.length\" class=\"hover-nav dropdown-menu hidden-xs\">\n" +
    "<ul class=\"nav nav-sidenav-secondary\">\n" +
    "<li ng-repeat-start=\"secondarySection in primaryItem.secondaryNavSections\" ng-if=\"secondarySection.header\" class=\"dropdown-header\">\n" +
    "{{secondarySection.header}}\n" +
    "</li>\n" +
    "<li ng-repeat=\"secondaryItem in secondarySection.items\" ng-class=\"{ active: secondaryItem === activeSecondary }\" ng-if=\"show(secondaryItem)\">\n" +
    "<a ng-href=\"{{navURL(secondaryItem.href)}}\">{{secondaryItem.label}}</a>\n" +
    "</li>\n" +
    "<li ng-repeat-end style=\"display:none\"></li>\n" +
    "</ul>\n" +
    "</div>\n" +
    "<div ng-if=\"primaryItem.secondaryNavSections.length\" class=\"hover-nav visible-xs-block\">\n" +
    "<ul class=\"nav nav-sidenav-secondary\">\n" +
    "<li ng-repeat-start=\"secondarySection in primaryItem.secondaryNavSections\" ng-if=\"secondarySection.header\" class=\"dropdown-header\">\n" +
    "{{secondarySection.header}}\n" +
    "</li>\n" +
    "<li ng-repeat=\"secondaryItem in secondarySection.items\" ng-class=\"{ active: secondaryItem === activeSecondary }\" ng-if=\"show(secondaryItem)\">\n" +
    "<a ng-href=\"{{navURL(secondaryItem.href)}}\">{{secondaryItem.label}}</a>\n" +
    "</li>\n" +
    "<li ng-repeat-end style=\"display:none\"></li>\n" +
    "</ul>\n" +
    "</div>\n" +
    "</li>\n" +
    "</ul>\n" +
    "\n" +
    "<navbar-utility-mobile></navbar-utility-mobile>\n" +
    "</nav>"
  );


  $templateCache.put('views/_tasks.html',
    "<div ng-controller=\"TasksController\">\n" +
    "<div ng-repeat=\"task in tasks()\" ng-if=\"!task.namespace || !projectName || task.namespace === projectName\">\n" +
    "<div class=\"tasks\" ng-class=\"hasTaskWithError() ? 'failure' : 'success'\">\n" +
    "<div class=\"task-content\">\n" +
    "<i class=\"pficon task-icon\" ng-class=\"task.hasErrors ? 'pficon-error-circle-o' : 'pficon-ok'\"></i>\n" +
    "<div class=\"task-info\">\n" +
    "<span class=\"task-title\">\n" +
    "{{ task | taskTitle }}.\n" +
    "</span>\n" +
    "<span class=\"task-links\">\n" +
    "<span>\n" +
    "<a href=\"\" ng-click=\"expanded = !expanded\" role=\"button\">\n" +
    "<span ng-hide=\"expanded\">Show Details</span>\n" +
    "<span ng-show=\"expanded\">Hide Details</span>\n" +
    "</a>\n" +
    "</span>\n" +
    "<span ng-show=\"task.status=='completed'\">\n" +
    "<span class=\"action-divider\" aria-hidden=\"true\">|</span>\n" +
    "<a href=\"\" ng-click=\"delete(task)\" role=\"button\">\n" +
    "Dismiss\n" +
    "</a>\n" +
    "</span>\n" +
    "</span>\n" +
    "<div ng-if=\"task.helpLinks.length\">\n" +
    "<h4>Helpful Links</h4>\n" +
    "<ul class=\"list-unstyled\">\n" +
    "<li ng-repeat=\"link in task.helpLinks\">\n" +
    "<a href=\"{{ link.link }}\" target=\"_blank\">{{ link.title }}</a>\n" +
    "</li>\n" +
    "</ul>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-show=\"expanded\" class=\"task-expanded-details\">\n" +
    "\n" +
    "<alerts alerts=\"task.alerts\" hide-close-button=\"true\"></alerts>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/_templateopt.html',
    "<div class=\"template-options\" ng-show=\"parameters.length\" ng-form=\"paramForm\">\n" +
    "<div class=\"flow\">\n" +
    "<div class=\"flow-block\">\n" +
    "<h2>Parameters</h2>\n" +
    "</div>\n" +
    "<div ng-show=\"canToggle\" class=\"flow-block right\">\n" +
    "<a class=\"action action-inline\" href=\"\" ng-click=\"expand = false\" ng-show=\"expand\"><i class=\"pficon pficon-remove\"></i> Collapse</a>\n" +
    "<a class=\"action action-inline\" href=\"\" ng-click=\"expand = true\" ng-hide=\"expand\"><i class=\"pficon pficon-edit\"></i> Edit Parameters</a>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"form-group options\" ng-repeat=\"parameter in parameters\" ng-show=\"expand\" ng-init=\"paramID = 'param-' + $index\">\n" +
    "<label ng-attr-for=\"{{paramID}}\" ng-attr-title=\"{{parameter.name}}\" ng-class=\"{required: parameter.required}\">{{parameter.displayName || parameter.name}}</label>\n" +
    "<div class=\"parameter-input-wrapper\" ng-class=\"{'has-error': (paramForm[paramID].$error.required && paramForm[paramID].$touched && !cleared), 'has-warning': isOnlyWhitespace(parameter.value)}\">\n" +
    "<input ng-if=\"!expandedParameter\" ng-attr-id=\"{{paramID}}\" ng-attr-name=\"{{paramID}}\" class=\"form-control hide-ng-leave\" type=\"text\" placeholder=\"{{ parameter | parameterPlaceholder }}\" ng-model=\"parameter.value\" ng-required=\"parameter.required && !parameter.generate\" ng-blur=\"cleared = false\" ng-trim=\"false\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\" ng-attr-aria-describedby=\"{{parameter.description ? (paramID + '-description') : undefined}}\">\n" +
    "<a href=\"\" ng-click=\"expandedParameter = !expandedParameter\" class=\"resize-input action-button\" data-toggle=\"tooltip\" data-trigger=\"hover\" dynamic-content=\"{{expandedParameter ? 'Collapse to a single line input. This may strip any new lines you have entered.' : 'Expand to enter multiple lines of content. This is required if you need to include newline characters.'}}\"><i class=\"fa\" ng-class=\"{'fa-expand': !expandedParemeter, 'fa-compress': expandedParameter}\" aria-hidden=\"true\" role=\"presentation\"/><span class=\"sr-only\" ng-if=\"expandedParameter\">Collapse to a single line input</span><span class=\"sr-only\" ng-if=\"!expandedParameter\">Expand to enter multiline input</span></a>\n" +
    "<textarea ng-if=\"expandedParameter\" ng-attr-id=\"{{paramID}}\" ng-attr-name=\"{{paramID}}\" class=\"form-control hide-ng-leave\" placeholder=\"{{ parameter | parameterPlaceholder }}\" ng-model=\"parameter.value\" ng-required=\"parameter.required && !parameter.generate\" ng-blur=\"cleared = false\" ng-trim=\"false\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\" rows=\"6\" ng-attr-aria-describedby=\"{{parameter.description ? (paramID + '-description') : undefined}}\"></textarea>\n" +
    "</div>\n" +
    "<div class=\"help-block\" ng-if=\"parameter.description\" ng-attr-id=\"{{paramID}}-description\">{{parameter.description}}</div>\n" +
    "<div ng-show=\"paramForm[paramID].$error.required && paramForm[paramID].$touched && !cleared\" class=\"has-error\">\n" +
    "<div class=\"help-block\">{{parameter.displayName || parameter.name}} is required.</div>\n" +
    "</div>\n" +
    "<div ng-show=\"isOnlyWhitespace(parameter.value)\" class=\"has-warning help-block\">\n" +
    "The current value is \"{{parameter.value}}\", which is not empty.\n" +
    "<span ng-if=\"parameter.generate\">This will prevent a value from being generated.</span>\n" +
    "If this isn't what you want,\n" +
    "<a href=\"\" ng-click=\"parameter.value=''; cleared = true; focus(paramID)\">clear the value</a>.\n" +
    "</div>\n" +
    "</div>\n" +
    "<ul class=\"list-unstyled env-variable-list\" ng-hide=\"expand\">\n" +
    "<li class=\"options\" ng-repeat=\"parameter in parameters\" ng-init=\"paramID = 'param-' + $index\">\n" +
    "<label for=\"\" class=\"key truncate\" ng-class=\"{required: parameter.required}\" ng-attr-title=\"{{ parameter.name }}\">{{parameter.name}}</label>\n" +
    "<span class=\"value truncate\" ng-attr-title=\"{{parameter | parameterValue}}\">{{ parameter | parameterValue }}</span>\n" +
    "<div class=\"help-block\" ng-if=\"parameter.description\">{{parameter.description}}</div>\n" +
    "<div ng-show=\"paramForm[paramID].$error.required && paramForm[paramID].$touched\" class=\"has-error\">\n" +
    "<div class=\"help-block\">{{parameter.name}} is required.</div>\n" +
    "</div>\n" +
    "</li>\n" +
    "</ul>\n" +
    "</div>"
  );


  $templateCache.put('views/_triggers.html',
    "<div class=\"triggers\">\n" +
    "<div class=\"builds\" ng-repeat=\"trigger in triggers\">\n" +
    "<div ng-if=\"trigger.type === 'ImageChange'\">\n" +
    "<div ng-repeat=\"build in buildsByOutputImage[(trigger.imageChangeParams.from | imageObjectRef : namespace)] | orderObjectsByDate : true track by (build | uid)\" ng-show=\"!(hideBuild)\" class=\"build animate-show animate-hide animate-slide\" kind=\"Build\" resource=\"build\">\n" +
    "<div class=\"build-summary\" ng-class=\"{'dismissible' : !(build | isIncompleteBuild)}\">\n" +
    "<div class=\"build-name\">\n" +
    "Build\n" +
    "<span ng-if=\"build | annotation : 'buildNumber'\">\n" +
    "<span ng-if=\"build | buildConfigForBuild\"><a ng-href=\"{{build | configURLForResource}}\">{{build | buildConfigForBuild}}</a>,</span>\n" +
    "<a ng-href=\"{{build | navigateResourceURL}}\">#{{build | annotation : 'buildNumber'}}</a>\n" +
    "</span>\n" +
    "<span ng-if=\"!(build | annotation : 'buildNumber')\">\n" +
    "{{build.metadata.name}}\n" +
    "</span>\n" +
    "</div>\n" +
    "<div class=\"build-phase\">\n" +
    "<status-icon status=\"build.status.phase\"></status-icon>\n" +
    "<span ng-if=\"!build.status.message || build.status.phase === 'Cancelled'\">{{build.status.phase}}.</span>\n" +
    "<span ng-if=\"build.status.message && build.status.phase !== 'Cancelled'\">{{build.status.message}}.</span>\n" +
    "<span ng-if=\"(build | isIncompleteBuild) && trigger.imageChangeParams.automatic\">A new deployment will be created automatically once the build completes.</span>\n" +
    "</div>\n" +
    "<span am-time-ago=\"build.metadata.creationTimestamp\" class=\"build-timestamp\"></span>\n" +
    "<div ng-if=\"'builds/log' | canI : 'get'\" class=\"build-links\">\n" +
    "<a ng-if=\"!!['New', 'Pending'].indexOf(build.status.phase) && (build | buildLogURL)\" ng-href=\"{{build | buildLogURL}}\">View Log</a>\n" +
    "</div>\n" +
    "<build-close build=\"build\" hide-build=\"hideBuild\"></build-close>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/_volume-claim-templates.html',
    "<div class=\"pod-template-block\">\n" +
    "<div ng-repeat=\"template in templates\" class=\"pod-template\">\n" +
    "<div class=\"component-label\">Storage claim: {{template.metadata.name}}</div>\n" +
    "<div row class=\"pod-template-image icon-row\">\n" +
    "<div class=\"icon-wrap\">\n" +
    "<span class=\"fa fa-lock\" aria-hidden=\"true\"></span>\n" +
    "</div>\n" +
    "<div flex class=\"word-break\">\n" +
    "<span class=\"pod-template-key\">Access Modes:</span>\n" +
    "<span ng-repeat=\"mode in template.spec.accessModes\">\n" +
    "{{mode | sentenceCase }}<span ng-if=\"!$last\">, </span>\n" +
    "</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div row class=\"pod-template-image icon-row\">\n" +
    "<div class=\"icon-wrap\">\n" +
    "<span class=\"fa fa-database\" aria-hidden=\"true\"></span>\n" +
    "</div>\n" +
    "<div flex class=\"word-break\">\n" +
    "<span class=\"pod-template-key\">Capacity:</span>\n" +
    "<span>\n" +
    "{{template.spec.resources.requests.storage}}\n" +
    "</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div row class=\"pod-template-image icon-row\" ng-if=\"template.spec.selector.matchLabels\">\n" +
    "<div class=\"icon-wrap\">\n" +
    "<span class=\"fa fa-tag\" aria-hidden=\"true\"></span>\n" +
    "</div>\n" +
    "<div flex class=\"word-break\">\n" +
    "<span class=\"pod-template-key\">Selector:</span>\n" +
    "<selector selector=\"template.spec.selector\"></selector>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/_volumes.html',
    " <div ng-repeat=\"volume in volumes\">\n" +
    "<h4>\n" +
    "{{volume.name}}\n" +
    "<span ng-if=\"canRemove\" class=\"header-actions\">\n" +
    "<a href=\"\" ng-click=\"removeFn({volume: volume})\">Remove</a>\n" +
    "</span>\n" +
    "</h4>\n" +
    "<dl class=\"dl-horizontal left\">\n" +
    "<div ng-if=\"volume.secret\">\n" +
    "<dt>Type:</dt>\n" +
    "<dd>\n" +
    "secret\n" +
    "<span class=\"small text-muted\">(populated by a secret when the pod is created)</span>\n" +
    "</dd>\n" +
    "<dt>Secret:</dt>\n" +
    "<dd>\n" +
    "<span ng-if=\"'secrets' | canI : 'get'\">\n" +
    "<a ng-href=\"{{volume.secret.secretName | navigateResourceURL : 'Secret' : namespace}}\">{{volume.secret.secretName}}</a>\n" +
    "</span>\n" +
    "<span ng-if=\"!('secrets' | canI : 'get')\">\n" +
    "{{volume.secret.secretName}}\n" +
    "</span>\n" +
    "</dd>\n" +
    "<div ng-repeat=\"item in volume.secret.items\">\n" +
    "<dt>Key to File:</dt>\n" +
    "<dd>{{item.key}}&#8201;&#8594;&#8201;{{item.path}}</dd>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"volume.persistentVolumeClaim\">\n" +
    "<dt>Type:</dt>\n" +
    "<dd>\n" +
    "persistent volume claim\n" +
    "<span class=\"small text-muted\">(reference to a persistent volume claim)</span>\n" +
    "</dd>\n" +
    "<dt>Claim name:</dt>\n" +
    "<dd><a ng-href=\"{{volume.persistentVolumeClaim.claimName | navigateResourceURL : 'PersistentVolumeClaim' : namespace}}\">{{volume.persistentVolumeClaim.claimName}}</a></dd>\n" +
    "<dt>Mode:</dt>\n" +
    "<dd>\n" +
    "<span ng-if=\"volume.persistentVolumeClaim.readOnly\">read-only</span>\n" +
    "<span ng-if=\"!volume.persistentVolumeClaim.readOnly\">read-write</span>\n" +
    "</dd>\n" +
    "</div>\n" +
    "<div ng-if=\"volume.hostPath\">\n" +
    "<dt>Type:</dt>\n" +
    "<dd>\n" +
    "host path\n" +
    "<span class=\"small text-muted\">(bare host directory volume)</span>\n" +
    "</dd>\n" +
    "<dt>Path:</dt>\n" +
    "<dd>{{volume.hostPath.path}}</dd>\n" +
    "</div>\n" +
    "<div ng-if=\"volume.emptyDir\">\n" +
    "<dt>Type:</dt>\n" +
    "<dd>\n" +
    "empty dir\n" +
    "<span class=\"small text-muted\">(temporary directory destroyed with the pod)</span>\n" +
    "</dd>\n" +
    "<dt>Medium:</dt>\n" +
    "<dd>\n" +
    "<span ng-if=\"!volume.emptyDir.medium\">node's default</span>\n" +
    "<span ng-if=\"volume.emptyDir.medium\">{{volume.emptyDir.medium}}</span>\n" +
    "</dd>\n" +
    "</div>\n" +
    "<div ng-if=\"volume.gitRepo\">\n" +
    "<dt>Type:</dt>\n" +
    "<dd>\n" +
    "git repo\n" +
    "<span class=\"small text-muted\">(pulled from git when the pod is created)</span>\n" +
    "</dd>\n" +
    "<dt>Repository:</dt>\n" +
    "<dd>{{volume.gitRepo.repository}}</dd>\n" +
    "<dt ng-if-start=\"volume.gitRepo.revision\">Revision:</dt>\n" +
    "<dd ng-if-end>{{volume.gitRepo.revision}}</dd>\n" +
    "</div>\n" +
    "<div ng-if=\"volume.downwardAPI\">\n" +
    "<dt>Type:</dt>\n" +
    "<dd>\n" +
    "downward API\n" +
    "<span class=\"small text-muted\">(populated with information about the pod)</span>\n" +
    "</dd>\n" +
    "<div ng-repeat=\"item in volume.downwardAPI.items\">\n" +
    "<dt>Volume File:</dt>\n" +
    "<dd>{{item.fieldRef.fieldPath}}&#8201;&#8594;&#8201;{{item.path}}</dd>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"volume.configMap\">\n" +
    "<dt>Type:</dt>\n" +
    "<dd>\n" +
    "config map\n" +
    "<span class=\"small text-muted\">(populated by a config map)</span>\n" +
    "</dd>\n" +
    "<dt>Config Map:</dt>\n" +
    "<dd><a ng-href=\"{{volume.configMap.name | navigateResourceURL : 'ConfigMap' : namespace}}\">{{volume.configMap.name}}</a></dd>\n" +
    "<div ng-repeat=\"item in volume.configMap.items\">\n" +
    "<dt>Key to File:</dt>\n" +
    "<dd>{{item.key}}&#8201;&#8594;&#8201;{{item.path}}</dd>\n" +
    "</div>\n" +
    "</div>\n" +
    "</dl>\n" +
    "</div>"
  );


  $templateCache.put('views/_webhook-trigger-cause.html',
    "{{trigger.message === 'GitHub WebHook' ? 'GitHub webhook' : 'Generic webhook'}}: <span ng-if=\"trigger.githubWebHook.revision || trigger.genericWebHook.revision\"> {{trigger.githubWebHook.revision.git.message || trigger.genericWebHook.revision.git.message}}</span>\n" +
    "<osc-git-link ng-if=\"trigger.githubWebHook.revision || trigger.genericWebHook.revision\" class=\"hash\" uri=\"build.spec.source.git.uri\" ref=\"trigger.githubWebHook.revision.git.commit || trigger.genericWebHook.revision.git.commit\">{{trigger.githubWebHook.revision.git.commit || trigger.genericWebHook.revision.git.commit | limitTo:7}}\n" +
    "</osc-git-link>\n" +
    "<span ng-if=\"trigger.githubWebHook.revision || trigger.genericWebHook.revision\">\n" +
    "authored by {{trigger.githubWebHook.revision.git.author.name || trigger.genericWebHook.revision.git.author.name}},\n" +
    "</span>\n" +
    "<span ng-if=\"trigger.genericWebHook && !trigger.genericWebHook.revision\">\n" +
    "no revision information,\n" +
    "</span>\n" +
    "<a href=\"\" ng-if=\"!showSecret\" ng-click=\"toggleSecret()\">Show Obfuscated Secret</a>\n" +
    "<span ng-if=\"showSecret\">\n" +
    "{{trigger.githubWebHook.secret || trigger.genericWebHook.secret}}\n" +
    "</span>"
  );


  $templateCache.put('views/about.html',
    "<default-header class=\"top-header\"></default-header>\n" +
    "<div class=\"wrap no-sidebar\">\n" +
    "<div class=\"sidebar-left collapse navbar-collapse navbar-collapse-2\">\n" +
    "<navbar-utility-mobile></navbar-utility-mobile>\n" +
    "</div>\n" +
    "<div class=\"middle surface-shaded\">\n" +
    "\n" +
    "<div class=\"middle-section\">\n" +
    "<div class=\"middle-container\">\n" +
    "<div class=\"middle-content\">\n" +
    "<div class=\"container surface-shaded gutter-top\">\n" +
    "<div class=\"row\">\n" +
    "<div class=\"col-md-12\">\n" +
    "<div class=\"about\">\n" +
    "<div class=\"row\">\n" +
    "<div class=\"col-md-2 about-icon gutter-top hidden-sm hidden-xs\">\n" +
    "<img src=\"images/openshift-logo.svg\"/>\n" +
    "</div>\n" +
    "<div class=\"col-md-9\">\n" +
    "<h1>Red Hat OpenShift <span class=\"about-reg\">&reg;</span></h1>\n" +
    "<h2>About</h2>\n" +
    "<p><a target=\"_blank\" href=\"https://openshift.com\">OpenShift</a> is Red Hat's Platform-as-a-Service (PaaS) that allows developers to quickly develop, host, and scale applications in a cloud environment.</p>\n" +
    "<h2 id=\"version\">Version</h2>\n" +
    "<dl class=\"dl-horizontal left\">\n" +
    "<dt>OpenShift Master:</dt>\n" +
    "<dd>{{version.master.openshift || 'unknown'}}</dd>\n" +
    "<dt>Kubernetes Master:</dt>\n" +
    "<dd>{{version.master.kubernetes || 'unknown'}}</dd>\n" +
    "</dl>\n" +
    "<p>The <a target=\"_blank\" href=\"{{'welcome' | helpLink}}\">documentation</a> contains information and guides to help you learn about OpenShift and start exploring its features. From getting started with creating your first application, to trying out more advanced build and deployment techniques, it provides what you need to set up and manage your OpenShift environment as an application developer.</p>\n" +
    "<p>With the OpenShift command line interface (CLI), you can create applications and manage OpenShift projects from a terminal. To get started using the CLI, visit <a href=\"command-line\">Command Line Tools</a>.\n" +
    "</p>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/add-config-volume.html',
    "<default-header class=\"top-header\"></default-header>\n" +
    "<div class=\"wrap no-sidebar\">\n" +
    "<div class=\"sidebar-left collapse navbar-collapse navbar-collapse-2\">\n" +
    "<navbar-utility-mobile></navbar-utility-mobile>\n" +
    "</div>\n" +
    "<div class=\"add-to-project middle surface-shaded\">\n" +
    "\n" +
    "<div class=\"middle-section\">\n" +
    "<div class=\"middle-container\">\n" +
    "<div class=\"middle-content\">\n" +
    "<div class=\"container surface-shaded\">\n" +
    "<div class=\"row\">\n" +
    "<div class=\"col-md-10 col-md-offset-1\">\n" +
    "<breadcrumbs breadcrumbs=\"breadcrumbs\"></breadcrumbs>\n" +
    "<alerts alerts=\"alerts\"></alerts>\n" +
    "<div ng-if=\"!error && (!targetObject || !configMaps || !secrets)\">Loading...</div>\n" +
    "<div ng-if=\"error\" class=\"empty-state-message text-center\">\n" +
    "<h2>The {{kind | humanizeKind}} could not be loaded.</h2>\n" +
    "<p>{{error | getErrorDetails}}</p>\n" +
    "</div>\n" +
    "<div ng-if=\"targetObject && configMaps && secrets\">\n" +
    "<div ng-if=\"!configMaps.length && !secrets.length && !('configmaps' | canI : 'create') && !('secrets' | canI : 'create')\" class=\"empty-state-message empty-state-full-page\">\n" +
    "<h2 class=\"text-center\">No config maps or secrets.</h2>\n" +
    "<p class=\"gutter-top\">\n" +
    "There are no config maps or secrets in project {{project | displayName}} to use as a volume for this {{kind | humanizeKind}}.\n" +
    "</p>\n" +
    "<p ng-if=\"targetObject\"><a ng-href=\"{{targetObject | navigateResourceURL}}\">Back to {{kind | humanizeKind}} {{name}}</a></p>\n" +
    "</div>\n" +
    "<div ng-if=\"configMaps.length || secrets.length || ('configmaps' | canI : 'create') || ('secrets' | canI : 'create')\" class=\"mar-top-xl\">\n" +
    "<h1>Add Config Files</h1>\n" +
    "<div class=\"help-block\">\n" +
    "Add values from a config map or secret as volume. This will make the data available as files for {{kind | humanizeKind}} {{name}}.\n" +
    "</div>\n" +
    "<form name=\"forms.addConfigVolumeForm\" class=\"mar-top-lg\">\n" +
    "<fieldset ng-disabled=\"disableInputs\">\n" +
    "<div class=\"form-group\">\n" +
    "<label class=\"required\">Source</label>\n" +
    "<ui-select ng-model=\"attach.source\" ng-required=\"true\">\n" +
    "<ui-select-match placeholder=\"Select config map or secret\">\n" +
    "<span>\n" +
    "{{$select.selected.metadata.name}}\n" +
    "<small class=\"text-muted\">&ndash; {{$select.selected.kind | humanizeKind : true}}</small>\n" +
    "</span>\n" +
    "</ui-select-match>\n" +
    "<ui-select-choices repeat=\"source in (configMaps.concat(secrets)) | filter : { metadata: { name: $select.search } } track by (source | uid)\" group-by=\"groupByKind\">\n" +
    "<span ng-bind-html=\"source.metadata.name | highlight : $select.search\"></span>\n" +
    "</ui-select-choices>\n" +
    "</ui-select>\n" +
    "<div ng-if=\"('configmaps' | canI : 'create') || ('secrets' | canI : 'create')\" class=\"mar-top-md\">\n" +
    "<span ng-if=\"'configmaps' | canI : 'create'\">\n" +
    "<a ng-href=\"project/{{project.metadata.name}}/create-config-map\">Create Config Map</a>\n" +
    "</span>\n" +
    "<span ng-if=\"'secrets' | canI : 'create'\">\n" +
    "<span ng-if=\"'configmaps' | canI : 'create'\" class=\"action-divider\" aria-hidden=\"true\">|</span>\n" +
    "<a ng-href=\"project/{{project.metadata.name}}/create-secret\">Create Secret</a>\n" +
    "</span>\n" +
    "</div>\n" +
    "<div class=\"help-block\">\n" +
    "Pick the config source. Its data will be mounted as a volume in the container.\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"form-group\">\n" +
    "<label for=\"mount-path\" class=\"required\">Mount Path</label>\n" +
    "<input id=\"mount-path\" class=\"form-control\" type=\"text\" name=\"mountPath\" ng-model=\"attach.mountPath\" required ng-pattern=\"/^\\/.*$/\" osc-unique=\"existingMountPaths\" placeholder=\"example: /data\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\" aria-describedby=\"mount-path-help\">\n" +
    "<div>\n" +
    "<span id=\"mount-path-help\" class=\"help-block\">\n" +
    "Mount path for the volume.\n" +
    "<span ng-if=\"!attach.pickKeys\">\n" +
    "A file will be created in this directory for each key from the config map or secret. The file contents will be the value of the key.\n" +
    "</span>\n" +
    "</span>\n" +
    "</div>\n" +
    "<div class=\"has-error\" ng-show=\"forms.addConfigVolumeForm.mountPath.$error.pattern && forms.addConfigVolumeForm.mountPath.$touched\">\n" +
    "<span class=\"help-block\">\n" +
    "Mount path must be a valid path to a directory starting with <code>/</code>.\n" +
    "</span>\n" +
    "</div>\n" +
    "<div class=\"has-error\" ng-show=\"forms.addConfigVolumeForm.mountPath.$error.oscUnique\">\n" +
    "<span class=\"help-block\">\n" +
    "The mount path is already used. Please choose another mount path.\n" +
    "</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"form-group\">\n" +
    "<div class=\"checkbox\">\n" +
    "<label>\n" +
    "<input id=\"select-keys\" type=\"checkbox\" ng-model=\"attach.pickKeys\" ng-disabled=\"!attach.source\" aria-describedby=\"select-keys-help\">\n" +
    "Select specific keys and paths\n" +
    "</label>\n" +
    "<div id=\"select-keys-help\" class=\"help-block\">\n" +
    "Add only certain keys or use paths that are different than the key names.\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"attach.pickKeys && attach.source\" class=\"mar-bottom-md\">\n" +
    "<h3>Keys and Paths</h3>\n" +
    "<div class=\"help-block mar-bottom-md\">\n" +
    "Select the keys to use and the file paths where each key will be exposed. The file paths are relative to the mount path. The contents of each file will be the value of the key.\n" +
    "</div>\n" +
    "<div ng-repeat=\"item in attach.items\">\n" +
    "<div class=\"row\">\n" +
    "<div class=\"form-group col-md-6\">\n" +
    "<label class=\"required\">Key</label>\n" +
    "<ui-select ng-model=\"item.key\" ng-required=\"true\">\n" +
    "<ui-select-match placeholder=\"Pick a key\">\n" +
    "{{$select.selected}}\n" +
    "</ui-select-match>\n" +
    "<ui-select-choices repeat=\"key in attach.source.data | keys | filter : $select.search\">\n" +
    "<span ng-bind-html=\"key | highlight : $select.search\"></span>\n" +
    "</ui-select-choices>\n" +
    "</ui-select>\n" +
    "</div>\n" +
    "<div class=\"form-group col-md-6\">\n" +
    "<label ng-attr-for=\"path-{{$id}}\" class=\"required\">Path</label>\n" +
    "<input ng-attr-id=\"path-{{$id}}\" class=\"form-control\" ng-class=\"{ 'has-error': forms.addConfigVolumeForm['path-' + $id].$invalid && forms.addConfigVolumeForm['path-' + $id].$touched }\" type=\"text\" name=\"path-{{$id}}\" ng-model=\"item.path\" ng-pattern=\"RELATIVE_PATH_PATTERN\" required osc-unique=\"itemPaths\" placeholder=\"example: config/app.properties\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\">\n" +
    "<div class=\"has-error\" ng-show=\"forms.addConfigVolumeForm['path-' + $id].$error.pattern\">\n" +
    "<span class=\"help-block\">\n" +
    "Path must be a relative path. It cannot start with <code>/</code> or contain <code>..</code> path elements.\n" +
    "</span>\n" +
    "</div>\n" +
    "<div class=\"has-error\" ng-show=\"forms.addConfigVolumeForm['path-' + $id].$error.oscUnique\">\n" +
    "<span class=\"help-block\">\n" +
    "Paths must be unique.\n" +
    "</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"mar-bottom-md\">\n" +
    "<a ng-hide=\"attach.items.length === 1\" href=\"\" ng-click=\"removeItem($index)\">Remove item</a>\n" +
    "<span ng-if=\"$last\">\n" +
    "<span ng-hide=\"attach.items.length === 1\" class=\"action-divider\" aria-hidden=\"true\">|</span>\n" +
    "<a href=\"\" ng-click=\"addItem()\">Add item</a>\n" +
    "</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"targetObject.spec.template.spec.containers.length > 1\">\n" +
    "<h3 ng-class=\"{ hidden: attach.allContainers && !attach.pickKeys }\">Containers</h3>\n" +
    "<div ng-if=\"attach.allContainers\">\n" +
    "The volume will be mounted into all containers. You can\n" +
    "<a href=\"\" ng-click=\"attach.allContainers = false\">select specific containers</a>\n" +
    "instead.\n" +
    "</div>\n" +
    "<div ng-if=\"!attach.allContainers\" class=\"form-group\">\n" +
    "<label class=\"sr-only required\">Containers</label>\n" +
    "<select-containers ng-model=\"attach.containers\" pod-template=\"targetObject.spec.template\" ng-required=\"true\" help-text=\"Add the volume to the selected containers.\">\n" +
    "</select-containers>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"button-group gutter-top gutter-bottom\">\n" +
    "<button type=\"submit\" class=\"btn btn-primary btn-lg\" ng-click=\"addVolume()\" ng-disabled=\"forms.addConfigVolumeForm.$invalid || disableInputs\">Add</button>\n" +
    "<a class=\"btn btn-default btn-lg\" role=\"button\" href=\"#\" back>Cancel</a>\n" +
    "</div>\n" +
    "</fieldset>\n" +
    "</form>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/attach-pvc.html',
    "<default-header class=\"top-header\"></default-header>\n" +
    "<div class=\"wrap no-sidebar\">\n" +
    "<div class=\"sidebar-left collapse navbar-collapse navbar-collapse-2\">\n" +
    "<navbar-utility-mobile></navbar-utility-mobile>\n" +
    "</div>\n" +
    "<div class=\"add-to-project middle surface-shaded\">\n" +
    "\n" +
    "<div class=\"middle-section\">\n" +
    "<div class=\"middle-container\">\n" +
    "<div class=\"middle-content\">\n" +
    "<div class=\"container surface-shaded\">\n" +
    "<div class=\"row\">\n" +
    "<div class=\"col-md-10 col-md-offset-1\">\n" +
    "<breadcrumbs breadcrumbs=\"breadcrumbs\"></breadcrumbs>\n" +
    "<alerts alerts=\"alerts\"></alerts>\n" +
    "<div ng-show=\"!pvcs || !attach.resource\">Loading...</div>\n" +
    "<div ng-show=\"pvcs && !pvcs.length && attach.resource\" class=\"empty-state-message empty-state-full-page\">\n" +
    "<h2 class=\"text-center\">No persistent volume claims.</h2>\n" +
    "<p class=\"gutter-top\">\n" +
    "A <b>persistent volume claim</b> is required to attach to this {{kind | humanizeKind}}, but none are loaded on this project.\n" +
    "</p>\n" +
    "<div ng-if=\"project && ('persistentvolumeclaims' | canI : 'create')\" class=\"text-center\">\n" +
    "<a ng-href=\"project/{{project.metadata.name}}/create-pvc\" class=\"btn btn-primary\">Create Storage</a>\n" +
    "</div>\n" +
    "<p ng-if=\"project && !('persistentvolumeclaims' | canI : 'create')\">\n" +
    "To claim storage from a persistent volume, refer to the documentation on <a target=\"_blank\" ng-href=\"{{'persistent_volumes' | helpLink}}\">using persistent volumes</a>.\n" +
    "</p>\n" +
    "<p ng-if=\"attach.resource\"><a ng-href=\"{{attach.resource | navigateResourceURL}}\">Back to {{kind | humanizeKind}} {{name}}</a></p>\n" +
    "</div>\n" +
    "<div ng-show=\"pvcs && pvcs.length && attach.resource\" class=\"mar-top-xl\">\n" +
    "<h1>Add Storage</h1>\n" +
    "<div class=\"help-block\">\n" +
    "Add an existing persistent volume claim to the template of {{kind | humanizeKind}} {{name}}.\n" +
    "</div>\n" +
    "<form name=\"attachPVCForm\" class=\"mar-top-lg\">\n" +
    "<fieldset ng-disabled=\"disableInputs\">\n" +
    "<div class=\"form-group\">\n" +
    "<label for=\"persistentVolumeClaim\" class=\"required\">Storage</label>\n" +
    "<table style=\"margin-bottom:0;background-color:transparent\" class=\"table table-condensed table-borderless\">\n" +
    "<tbody>\n" +
    "<tr ng-repeat=\"pvc in pvcs track by (pvc | uid)\">\n" +
    "<td style=\"padding-left:0\">\n" +
    "<input type=\"radio\" name=\"persistentVolumeClaim\" ng-model=\"attach.persistentVolumeClaim\" ng-value=\"pvc\" aria-describedby=\"pvc-help\">\n" +
    "</td>\n" +
    "<td><a ng-href=\"{{pvc | navigateResourceURL}}\">{{pvc.metadata.name}}</a></td>\n" +
    "<td ng-if=\"pvc.spec.volumeName\">{{pvc.status.capacity['storage'] | usageWithUnits: 'storage'}}</td>\n" +
    "<td ng-if=\"!pvc.spec.volumeName\">{{pvc.spec.resources.requests['storage'] | usageWithUnits: 'storage'}}</td>\n" +
    "<td>({{pvc.spec.accessModes | accessModes | join}})</td>\n" +
    "<td>\n" +
    "{{pvc.status.phase}}\n" +
    "<span ng-if=\"pvc.spec.volumeName\">\n" +
    "to volume <strong>{{pvc.spec.volumeName}}</strong>\n" +
    "</span>\n" +
    "</td>\n" +
    "</tr>\n" +
    "</tbody>\n" +
    "</table>\n" +
    "</div>\n" +
    "<div ng-if=\"!(project && ('persistentvolumeclaims' | canI : 'create'))\" class=\"help-block\">\n" +
    "Select storage to use.\n" +
    "</div>\n" +
    "<div ng-if=\"project && ('persistentvolumeclaims' | canI : 'create')\" class=\"help-block\">\n" +
    "Select storage to use or <a ng-href=\"project/{{project.metadata.name}}/create-pvc\">create storage</a>.\n" +
    "</div>\n" +
    "<h3>Volume</h3>\n" +
    "<div class=\"help-block\">\n" +
    "Specify details about how volumes are going to be mounted inside containers.\n" +
    "</div>\n" +
    "<div class=\"form-group mar-top-xl\">\n" +
    "<label for=\"mount-path\">Mount Path</label>\n" +
    "<input id=\"mount-path\" class=\"form-control\" type=\"text\" name=\"mountPath\" ng-model=\"attach.mountPath\" ng-pattern=\"/^\\/.*$/\" osc-unique=\"existingMountPaths\" placeholder=\"example: /data\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\" aria-describedby=\"mount-path-help\">\n" +
    "<div>\n" +
    "<span id=\"mount-path-help\" class=\"help-block\">Mount path for the volume inside the container. If not specified, the volume will not be mounted automatically.</span>\n" +
    "</div>\n" +
    "<div class=\"has-error\" ng-show=\"attachPVCForm.mountPath.$error.pattern && attachPVCForm.mountPath.$touched\">\n" +
    "<span class=\"help-block\">\n" +
    "Mount path must be a valid path to a directory starting with <code>/</code>.\n" +
    "</span>\n" +
    "</div>\n" +
    "<div class=\"has-error\" ng-show=\"attachPVCForm.mountPath.$error.oscUnique\">\n" +
    "<span class=\"help-block\">\n" +
    "Volume mount in that path already exists. Please choose another mount path.\n" +
    "</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"form-group\">\n" +
    "<label for=\"sub-path\">Subpath</label>\n" +
    "<input id=\"sub-path\" class=\"form-control\" type=\"text\" name=\"subPath\" ng-model=\"attach.subPath\" placeholder=\"example: application/resources\" ng-pattern=\"RELATIVE_PATH_PATTERN\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\" aria-describedby=\"sub-path-help\">\n" +
    "<div id=\"sub-path-help\" class=\"help-block\">\n" +
    "Optional path within the volume from which it will be mounted into the container. Defaults to the volume's root.\n" +
    "</div>\n" +
    "<div class=\"has-error\" ng-show=\"attachPVCForm.subPath.$error.pattern && attachPVCForm.subPath.$touched\">\n" +
    "<span class=\"help-block\">\n" +
    "Path must be a relative path. It cannot start with <code>/</code> or contain <code>..</code> path elements.\n" +
    "</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"form-group\">\n" +
    "<label for=\"volume-name\">Volume Name</label>\n" +
    "\n" +
    "<input id=\"volume-path\" class=\"form-control\" type=\"text\" name=\"volumeName\" ng-model=\"attach.volumeName\" osc-unique=\"existingVolumeNames\" ng-pattern=\"/^[a-z0-9]([-a-z0-9]*[a-z0-9])?$/\" maxlength=\"63\" placeholder=\"(generated if empty)\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\" aria-describedby=\"volume-name-help\">\n" +
    "<div>\n" +
    "<span id=\"volume-name-help\" class=\"help-block\">Unique name used to identify this volume. If not specified, a volume name is generated.</span>\n" +
    "</div>\n" +
    "<div class=\"has-error\" ng-show=\"attachPVCForm.volumeName.$error.pattern && attachPVCForm.volumeName.$touched\">\n" +
    "<span class=\"help-block\">\n" +
    "Volume names may only contain lower-case letters, numbers, and dashes. They may not start or end with a dash.\n" +
    "</span>\n" +
    "</div>\n" +
    "<div class=\"has-error\" ng-show=\"attachPVCForm.volumeName.$error.maxlength\">\n" +
    "<span class=\"help-block\">\n" +
    "Volume names cannot be longer than 63 characters.\n" +
    "</span>\n" +
    "</div>\n" +
    "<div class=\"has-error\" ng-show=\"attachPVCForm.volumeName.$error.oscUnique\">\n" +
    "<span class=\"help-block\">\n" +
    "Volume name already exists. Please choose another name.\n" +
    "</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"form-group\">\n" +
    "<div class=\"checkbox\">\n" +
    "<label>\n" +
    "<input type=\"checkbox\" ng-model=\"attach.readOnly\" aria-describedby=\"read-only-help\">\n" +
    "Read only\n" +
    "</label>\n" +
    "<div id=\"read-only-help\" class=\"help-block\">\n" +
    "Mount the volume as read-only.\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "\n" +
    "<div ng-if=\"attach.resource.spec.template.spec.containers.length > 1\">\n" +
    "<div ng-if=\"attach.allContainers\">\n" +
    "The volume will be mounted into all containers. You can\n" +
    "<a href=\"\" ng-click=\"attach.allContainers = false\">select specific containers</a>\n" +
    "instead.\n" +
    "</div>\n" +
    "<div ng-if=\"!attach.allContainers\" class=\"form-group\">\n" +
    "<label class=\"required\">Containers</label>\n" +
    "<select-containers ng-model=\"attach.containers\" pod-template=\"attach.resource.spec.template\" ng-required=\"true\" help-text=\"Add the volume to the selected containers.\">\n" +
    "</select-containers>\n" +
    "</div>\n" +
    "</div>\n" +
    "<pause-rollouts-checkbox ng-if=\"attach.resource | managesRollouts\" deployment=\"attach.resource\">\n" +
    "</pause-rollouts-checkbox>\n" +
    "<div class=\"button-group gutter-top gutter-bottom\">\n" +
    "<button type=\"submit\" class=\"btn btn-primary btn-lg\" ng-click=\"attachPVC()\" ng-disabled=\"attachPVCForm.$invalid || disableInputs || !attachPVC\">Add</button>\n" +
    "<a class=\"btn btn-default btn-lg\" role=\"button\" href=\"#\" back>Cancel</a>\n" +
    "</div>\n" +
    "</fieldset>\n" +
    "</form>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/browse/_build-details.html',
    "<div class=\"resource-details\">\n" +
    "<div class=\"row\">\n" +
    "<div class=\"col-sm-12\">\n" +
    "<h3>Status</h3>\n" +
    "<dl class=\"dl-horizontal left\">\n" +
    "<dt>Status:</dt>\n" +
    "<dd>\n" +
    "<status-icon status=\"build.status.phase\"></status-icon>\n" +
    "<span ng-if=\"!build.status.message || build.status.phase === 'Cancelled'\">{{build.status.phase}}</span>\n" +
    "<span ng-if=\"build.status.message && build.status.phase !== 'Cancelled'\">{{build.status.message}}</span>\n" +
    "<span ng-if=\"build | jenkinsLogURL\">\n" +
    "<span class=\"text-muted\">&ndash;</span>\n" +
    "<a ng-href=\"{{build | jenkinsLogURL}}\" target=\"_blank\">View Log</a>\n" +
    "</span>\n" +
    "</dd>\n" +
    "<dt>Started:</dt>\n" +
    "<dd>\n" +
    "<span ng-if=\"build.status.startTimestamp\">\n" +
    "<span am-time-ago=\"build.status.startTimestamp\"></span>\n" +
    "<span><span class=\"text-muted\">&ndash;</span> {{build.status.startTimestamp | date : 'medium'}}</span>\n" +
    "</span>\n" +
    "<span ng-if=\"!build.status.startTimestamp\"><em>not started</em></span>\n" +
    "</dd>\n" +
    "<dt>Duration:</dt>\n" +
    "<dd>\n" +
    "<span ng-switch=\"build.status.phase\" class=\"hide-ng-leave\">\n" +
    "<span ng-switch-when=\"Complete\">{{(build.status.startTimestamp || build.metadata.creationTimestamp) | duration : build.status.completionTimestamp}}</span>\n" +
    "<span ng-switch-when=\"Failed\">{{build.status.startTimestamp | duration : build.status.completionTimestamp}}</span>\n" +
    "<span ng-switch-when=\"Running\">running for <duration-until-now timestamp=\"build.status.startTimestamp\"></duration-until-now></span>\n" +
    "<span ng-switch-when=\"New\">waiting for <duration-until-now timestamp=\"build.metadata.creationTimestamp\"></duration-until-now></span>\n" +
    "<span ng-switch-when=\"Pending\">waiting for <duration-until-now timestamp=\"build.metadata.creationTimestamp\"></duration-until-now></span>\n" +
    "<span ng-switch-default>\n" +
    "<span ng-if=\"build.status.startTimestamp\">{{build.status.startTimestamp | duration : build.status.completionTimestamp}}</span>\n" +
    "<span ng-if=\"!build.status.startTimestamp\">waited for {{build.metadata.creationTimestamp | duration : build.status.completionTimestamp}}</span>\n" +
    "</span>\n" +
    "</span>\n" +
    "</dd>\n" +
    "<div ng-if=\"build.spec.triggeredBy.length\">\n" +
    "<dt>Triggered By:</dt>\n" +
    "<dd>\n" +
    "<div ng-repeat=\"trigger in build.spec.triggeredBy\">\n" +
    "<div ng-switch=\"trigger.message\">\n" +
    "<span ng-switch-when=\"Manually triggered\">Manual build</span>\n" +
    "<span ng-switch-when=\"GitHub WebHook\">\n" +
    "<ng-include src=\" 'views/_webhook-trigger-cause.html' \"></ng-include>\n" +
    "</span>\n" +
    "<span ng-switch-when=\"Generic WebHook\">\n" +
    "<ng-include src=\" 'views/_webhook-trigger-cause.html' \"></ng-include>\n" +
    "</span>\n" +
    "<span ng-switch-when=\"Image change\">\n" +
    "{{trigger.message}} for {{trigger.imageChangeBuild.fromRef.name}}\n" +
    "</span>\n" +
    "<span ng-switch-default ng-bind-html=\"trigger.message | linkify : '_blank'\"></span>\n" +
    "</div>\n" +
    "</div>\n" +
    "</dd>\n" +
    "</div>\n" +
    "</dl>\n" +
    "<h3>Configuration <span class=\"small\" ng-if=\"buildConfigName\">created from <a href=\"{{build | configURLForResource}}\">{{buildConfigName}}</a></span></h3>\n" +
    "<dl class=\"dl-horizontal left\">\n" +
    "<dt>Build Strategy:</dt>\n" +
    "<dd>{{build.spec.strategy.type | startCase}}</dd>\n" +
    "<dt ng-if-start=\"(build | buildStrategy).from\">Builder Image:</dt>\n" +
    "<dd ng-if-end class=\"truncate\">{{(build | buildStrategy).from | imageObjectRef : build.metadata.namespace}}<span ng-if=\"!(build | buildStrategy).from\"><em>none</em></span></dd>\n" +
    "<dt>Source Type:</dt>\n" +
    "<dd>{{build.spec.source.type}}</dd>\n" +
    "<dt ng-if-start=\"build.spec.source.git.uri\">Source Repo:</dt>\n" +
    "<dd ng-if-end><span class=\"word-break\"><osc-git-link uri=\"build.spec.source.git.uri\" ref=\"build.spec.source.git.ref\" context-dir=\"build.spec.source.contextDir\">{{build.spec.source.git.uri}}</osc-git-link></span></dd>\n" +
    "<dt ng-if-start=\"build.spec.source.git.ref\">Source Ref:</dt>\n" +
    "<dd ng-if-end>{{build.spec.source.git.ref}}</dd>\n" +
    "<dt ng-if-start=\"build.spec.source.contextDir\">Source Context Dir:</dt>\n" +
    "<dd ng-if-end>{{build.spec.source.contextDir}}</dd>\n" +
    "<dt ng-if-start=\"outputTo = build.spec.output.to\">Output Image:</dt>\n" +
    "<dd ng-if-end>\n" +
    "<a ng-if=\"outputTo.kind === 'ImageStreamTag' && (!outputTo.namespace || build.metadata.namespace === outputTo.namespace)\" ng-href=\"{{outputTo.name | navigateResourceURL : 'ImageStreamTag' : build.metadata.namespace}}\">\n" +
    "{{outputTo | imageObjectRef : build.metadata.namespace}}\n" +
    "</a>\n" +
    "<span ng-if=\"outputTo.kind !== 'ImageStreamTag' || (outputTo.namespace && build.metadata.namespace !== outputTo.namespace)\">\n" +
    "{{outputTo | imageObjectRef : build.metadata.namespace}}\n" +
    "</span>\n" +
    "</dd>\n" +
    "<dt ng-if-start=\"build.spec.output.pushSecret.name\">Push Secret:</dt>\n" +
    "<dd ng-if-end>{{build.spec.output.pushSecret.name}}</dd>\n" +
    "<dt ng-if-start=\"build.spec.strategy.jenkinsPipelineStrategy.jenkinsfilePath\">\n" +
    "Jenkinsfile Path:\n" +
    "</dt>\n" +
    "<dd>\n" +
    "<span ng-if=\"build | jenkinsfileLink\">\n" +
    "<a ng-href=\"{{build | jenkinsfileLink}}\">{{build.spec.strategy.jenkinsPipelineStrategy.jenkinsfilePath}}</a>\n" +
    "</span>\n" +
    "<span ng-if=\"!(build | jenkinsfileLink)\">\n" +
    "{{build.spec.strategy.jenkinsPipelineStrategy.jenkinsfilePath}}\n" +
    "</span>\n" +
    "</dd>\n" +
    "<div ng-if-end class=\"small\">\n" +
    "<a href=\"\" ng-click=\"showJenkinsfileExamples()\">What's a Jenkinsfile?</a>\n" +
    "</div>\n" +
    "<div ng-if-start=\"build.spec.strategy.jenkinsPipelineStrategy.jenkinsfile\" class=\"small pull-right mar-top-sm\">\n" +
    "<a href=\"\" ng-click=\"showJenkinsfileExamples()\">What's a Jenkinsfile?</a>\n" +
    "</div>\n" +
    "<dt>\n" +
    "Jenkinsfile:\n" +
    "</dt>\n" +
    "<dd></dd>\n" +
    "<div ng-if-end ui-ace=\"{\n" +
    "          mode: 'groovy',\n" +
    "          theme: 'eclipse',\n" +
    "          showGutter: false,\n" +
    "          rendererOptions: {\n" +
    "            fadeFoldWidgets: true,\n" +
    "            highlightActiveLine: false,\n" +
    "            showPrintMargin: false\n" +
    "          },\n" +
    "          advanced: {\n" +
    "            highlightActiveLine: false\n" +
    "          }\n" +
    "        }\" readonly=\"readonly\" ng-model=\"build.spec.strategy.jenkinsPipelineStrategy.jenkinsfile\" class=\"ace-bordered ace-inline ace-read-only\"></div>\n" +
    "</dl>\n" +
    "<div ng-if=\"build | hasPostCommitHook\">\n" +
    "<h3>Post-Commit Hooks</h3>\n" +
    "<build-hooks build=\"build\"></build-hooks>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<annotations annotations=\"build.metadata.annotations\"></annotations>\n" +
    "</div>"
  );


  $templateCache.put('views/browse/_pod-details.html',
    "<div class=\"resource-details\">\n" +
    "<div class=\"row\">\n" +
    "<div class=\"col-lg-6\">\n" +
    "<h3>\n" +
    "Status\n" +
    "<small ng-if=\"pod | isDebugPod\">\n" +
    "debugging\n" +
    "<a ng-href=\"{{pod | debugPodSourceName | navigateResourceURL : 'Pod' : pod.metadata.namespace}}\">{{pod | debugPodSourceName}}</a>\n" +
    "</small>\n" +
    "</h3>\n" +
    "<dl class=\"dl-horizontal left\">\n" +
    "<dt>Status:</dt>\n" +
    "<dd>\n" +
    "<status-icon status=\"pod | podStatus\"></status-icon>\n" +
    "{{pod | podStatus | sentenceCase}}<span ng-if=\"pod | podCompletionTime\">, ran for {{(pod | podStartTime) | duration : (pod | podCompletionTime)}}</span>\n" +
    "<span ng-if=\"pod.metadata.deletionTimestamp\">(expires {{pod.metadata.deletionTimestamp | date : 'medium'}})</span>\n" +
    "</dd>\n" +
    "<dt ng-if-start=\"pod.status.message\">Message:</dt>\n" +
    "<dd ng-if-end>{{pod.status.message}}</dd>\n" +
    "<dt ng-if-start=\"dcName\">\n" +
    "Deployment:\n" +
    "</dt>\n" +
    "<dd ng-if-end>\n" +
    "<a ng-href=\"{{dcName | navigateResourceURL : 'DeploymentConfig' : pod.metadata.namespace}}\">{{dcName}}</a><span ng-if=\"rcName\">,\n" +
    "<a ng-href=\"{{rcName | navigateResourceURL : 'ReplicationController' : pod.metadata.namespace}}\"><span ng-if=\"deploymentVersion\">#{{deploymentVersion}}</span><span ng-if=\"!deploymentVersion\">{{rcName}}</span></a></span>\n" +
    "</dd>\n" +
    "<dt ng-if-start=\"pod.metadata.deletionTimestamp && pod.spec.terminationGracePeriodSeconds\">Grace Period:</dt>\n" +
    "<dd ng-if-end>\n" +
    "\n" +
    "<span ng-if=\"pod.spec.terminationGracePeriodSeconds < 60\">\n" +
    "{{pod.spec.terminationGracePeriodSeconds}} seconds\n" +
    "</span>\n" +
    "<span ng-if=\"pod.spec.terminationGracePeriodSeconds >= 60\">\n" +
    "{{pod.spec.terminationGracePeriodSeconds | humanizeDurationValue : 'seconds'}}\n" +
    "</span>\n" +
    "</dd>\n" +
    "<dt>IP:</dt>\n" +
    "<dd>{{pod.status.podIP || 'unknown'}}</dd>\n" +
    "<dt>Node:</dt>\n" +
    "<dd>{{pod.spec.nodeName || 'unknown'}} <span ng-if=\"pod.status.hostIP && pod.spec.nodeName != pod.status.hostIP\">({{pod.status.hostIP}})</span></dd>\n" +
    "<dt>Restart Policy:</dt>\n" +
    "<dd>{{pod.spec.restartPolicy || 'Always'}}</dd>\n" +
    "<dt ng-if-start=\"pod.spec.activeDeadlineSeconds\">Active Deadline:</dt>\n" +
    "<dd ng-if-end>\n" +
    "\n" +
    "<span ng-if=\"pod.spec.activeDeadlineSeconds < 60\">\n" +
    "{{pod.spec.activeDeadlineSeconds}} seconds\n" +
    "</span>\n" +
    "<span ng-if=\"pod.spec.activeDeadlineSeconds >= 60\">\n" +
    "{{pod.spec.activeDeadlineSeconds | humanizeDurationValue : 'seconds'}}\n" +
    "</span>\n" +
    "<span ng-if=\"pod.status.phase === 'Running' && pod.status.startTime\" class=\"text-muted\">\n" +
    "(<duration-until-now timestamp=\"pod.status.startTime\"></duration-until-now> elapsed)\n" +
    "</span>\n" +
    "</dd>\n" +
    "</dl>\n" +
    "<div ng-repeat=\"containerStatus in pod.status.containerStatuses | orderBy:'name'\">\n" +
    "<h4>Container {{containerStatus.name}}</h4>\n" +
    "<dl class=\"dl-horizontal left\">\n" +
    "<dt>State:</dt>\n" +
    "<dd>\n" +
    "<kubernetes-object-describe-container-state container-state=\"containerStatus.state\"></kubernetes-object-describe-container-state>\n" +
    "</dd>\n" +
    "<dt ng-if=\"!(containerStatus.lastState | isEmptyObj)\">Last State</dt>\n" +
    "<dd ng-if=\"!(containerStatus.lastState | isEmptyObj)\">\n" +
    "<kubernetes-object-describe-container-state container-state=\"containerStatus.lastState\"></kubernetes-object-describe-container-state>\n" +
    "</dd>\n" +
    "<dt>Ready:</dt>\n" +
    "<dd>{{containerStatus.ready}}</dd>\n" +
    "<dt>Restart Count:</dt>\n" +
    "<dd>{{containerStatus.restartCount}}</dd>\n" +
    "<div ng-if=\"showDebugAction(containerStatus) && ('pods' | canI : 'create')\" class=\"debug-pod-action\">\n" +
    "<a href=\"\" ng-click=\"debugTerminal(containerStatus.name)\" role=\"button\">Debug in Terminal</a>\n" +
    "</div>\n" +
    "</dl>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"col-lg-6\">\n" +
    "<h3>Template</h3>\n" +
    "<pod-template pod-template=\"pod\" images-by-docker-reference=\"imagesByDockerReference\" builds=\"builds\" detailed=\"true\">\n" +
    "</pod-template>\n" +
    "<h4>Volumes</h4>\n" +
    "<volumes ng-if=\"pod.spec.volumes.length\" volumes=\"pod.spec.volumes\" namespace=\"project.metadata.name\"></volumes>\n" +
    "<div ng-if=\"!pod.spec.volumes.length\">none</div>\n" +
    "<p ng-if=\"dcName && ('deploymentconfigs' | canI : 'update')\">\n" +
    "<a ng-href=\"project/{{project.metadata.name}}/attach-pvc?kind=DeploymentConfig&name={{dcName}}\">Add Storage to {{dcName}}</a>\n" +
    "<span class=\"action-divider\" aria-hidden=\"true\">|</span>\n" +
    "<a ng-href=\"project/{{project.metadata.name}}/add-config-volume?kind=DeploymentConfig&name={{dcName}}\">Add Config Files to {{dcName}}</a>\n" +
    "</p>\n" +
    "</div>\n" +
    "</div>\n" +
    "<annotations annotations=\"pod.metadata.annotations\"></annotations>\n" +
    "</div>"
  );


  $templateCache.put('views/browse/_replica-set-actions.html',
    "<div ng-if=\"('replicaSets' | canIDoAny)\" class=\"pull-right dropdown\">\n" +
    "<button type=\"button\" class=\"dropdown-toggle btn btn-default actions-dropdown-btn hidden-xs\" data-toggle=\"dropdown\">\n" +
    "Actions\n" +
    "<span class=\"caret\"></span>\n" +
    "</button>\n" +
    "<a href=\"\" class=\"dropdown-toggle actions-dropdown-kebab visible-xs-inline\" data-toggle=\"dropdown\"><i class=\"fa fa-ellipsis-v\"></i><span class=\"sr-only\">Actions</span></a>\n" +
    "<ul class=\"dropdown-menu actions action-button\">\n" +
    "<li ng-if=\"deployment && ({ group: 'extensions', resource: 'deployments' } | canI : 'update')\">\n" +
    "<a ng-href=\"project/{{project.metadata.name}}/attach-pvc?kind=Deployment&name={{deployment.metadata.name}}&group=extensions\" role=\"button\">Add Storage</a>\n" +
    "</li>\n" +
    "<li ng-if=\"!deployment && ({ group: 'extensions', resource: 'replicasets' } | canI : 'update')\">\n" +
    "<a ng-href=\"project/{{project.metadata.name}}/attach-pvc?kind=ReplicaSet&name={{replicaSet.metadata.name}}&group=extensions\" role=\"button\">Add Storage</a>\n" +
    "</li>\n" +
    "<li ng-if=\"!autoscalers.length && ({ group: 'extensions', resource: 'horizontalpodautoscalers' } | canI : 'create')\">\n" +
    "<a ng-href=\"project/{{projectName}}/edit/autoscaler?kind=ReplicaSet&name={{replicaSet.metadata.name}}&group=extensions\" ng-if=\"!deployment\" role=\"button\">Add Autoscaler</a>\n" +
    "<a ng-href=\"project/{{projectName}}/edit/autoscaler?kind=Deployment&name={{deployment.metadata.name}}&group=extensions\" ng-if=\"deployment\" role=\"button\">Add Autoscaler</a>\n" +
    "</li>\n" +
    "<li ng-if=\"deployment && ({ group: 'extensions', resource: 'deployments' } | canI : 'update')\">\n" +
    "<a ng-href=\"project/{{projectName}}/set-limits?kind=Deployment&name={{deployment.metadata.name}}&group=extensions\" role=\"button\">Edit Resource Limits</a>\n" +
    "</li>\n" +
    "<li ng-if=\"!deployment && ({ group: 'extensions', resource: 'replicasets' } | canI : 'update')\">\n" +
    "<a ng-href=\"project/{{projectName}}/set-limits?kind=ReplicaSet&name={{replicaSet.metadata.name}}&group=extensions\" role=\"button\">Edit Resource Limits</a>\n" +
    "</li>\n" +
    "<li ng-if=\"(!deployment && ({ group: 'extensions', resource: 'replicasets' } | canI : 'update')) || (deployment && ({group: 'extensions', resource: 'deployments' } | canI : 'update'))\">\n" +
    "<a ng-href=\"{{healthCheckURL}}\" role=\"button\">Edit Health Checks</a>\n" +
    "</li>\n" +
    "<li ng-if=\"{ group: 'extensions', resource: 'replicasets' } | canI : 'update'\">\n" +
    "<a ng-href=\"{{replicaSet | editYamlURL}}\" role=\"button\">Edit YAML</a>\n" +
    "</li>\n" +
    "<li ng-if=\"{ group: 'extensions', resource: 'replicasets' } | canI : 'delete'\">\n" +
    "\n" +
    "<delete-link kind=\"ReplicaSet\" group=\"extensions\" resource-name=\"{{replicaSet.metadata.name}}\" project-name=\"{{replicaSet.metadata.namespace}}\" replicas=\"replicaSet.status.replicas\" hpa-list=\"hpaForRS\" alerts=\"alerts\">\n" +
    "</delete-link>\n" +
    "</li>\n" +
    "</ul>\n" +
    "</div>"
  );


  $templateCache.put('views/browse/_replica-set-details.html',
    "<div class=\"row\" style=\"max-width: 650px\">\n" +
    "<div class=\"col-sm-4 col-sm-push-8 browse-deployment-donut\">\n" +
    "<deployment-donut rc=\"replicaSet\" deployment=\"deployment\" deployment-config=\"deploymentConfig\" pods=\"podsForDeployment\" hpa=\"autoscalers\" scalable=\"isScalable()\" alerts=\"alerts\">\n" +
    "</deployment-donut>\n" +
    "</div>\n" +
    "<div class=\"col-sm-8 col-sm-pull-4\">\n" +
    "<dl class=\"dl-horizontal left\">\n" +
    "<dt ng-if-start=\"replicaSet | hasDeploymentConfig\">Status:</dt>\n" +
    "<dd ng-if-end>\n" +
    "<status-icon status=\"replicaSet | deploymentStatus\"></status-icon>\n" +
    "{{replicaSet | deploymentStatus}}\n" +
    "<span style=\"margin-left: 7px\">\n" +
    "<button ng-show=\"!rollBackCollapsed && showRollbackAction()\" ng-disabled=\"(deploymentConfigDeploymentsInProgress[deploymentConfigName] | hashSize) > 0\" type=\"button\" class=\"btn btn-default btn-xs\" ng-click=\"rollBackCollapsed = !rollBackCollapsed\">Roll Back</button>\n" +
    "<div ng-show=\"rollBackCollapsed\" class=\"well well-sm\">\n" +
    "Use the following settings from {{replicaSet.metadata.name}} when rolling back:\n" +
    "<div class=\"checkbox\">\n" +
    "<label>\n" +
    "<input type=\"checkbox\" ng-model=\"changeScaleSettings\" ng-disabled=\"(deploymentConfigDeploymentsInProgress[deploymentConfigName] | hashSize) > 0\"> replica count and selector\n" +
    "</label>\n" +
    "</div>\n" +
    "<div class=\"checkbox\">\n" +
    "<label>\n" +
    "<input type=\"checkbox\" ng-model=\"changeStrategy\" ng-disabled=\"(deploymentConfigDeploymentsInProgress[deploymentConfigName] | hashSize) > 0\"> deployment strategy\n" +
    "</label>\n" +
    "</div>\n" +
    "<div class=\"checkbox\">\n" +
    "<label>\n" +
    "<input type=\"checkbox\" ng-model=\"changeTriggers\" ng-disabled=\"(deploymentConfigDeploymentsInProgress[deploymentConfigName] | hashSize) > 0\"> deployment trigger\n" +
    "</label>\n" +
    "</div>\n" +
    "<button type=\"button\" ng-click=\"rollbackToDeployment(replicaSet, changeScaleSettings, changeStrategy, changeTriggers)\" ng-disabled=\"(deploymentConfigDeploymentsInProgress[deploymentConfigName] | hashSize) > 0\" class=\"btn btn-default btn-xs\">Roll Back</button>\n" +
    "</div>\n" +
    "\n" +
    "<button ng-show=\"(replicaSet | deploymentIsInProgress) && !replicaSet.metadata.deletionTimestamp && ('replicationcontrollers' | canI : 'update')\" type=\"button\" ng-click=\"cancelRunningDeployment(replicaSet)\" class=\"btn btn-default btn-xs\">Cancel</button>\n" +
    "</span>\n" +
    "</dd>\n" +
    "<dt ng-if-start=\"replicaSet | hasDeploymentConfig\">Deployment Config:</dt>\n" +
    "<dd ng-if-end>\n" +
    "<a ng-href=\"{{replicaSet | configURLForResource}}\">{{deploymentConfigName}}</a>\n" +
    "</dd>\n" +
    "<dt ng-if-start=\"replicaSet | annotation:'deploymentStatusReason'\">Status Reason:</dt>\n" +
    "<dd ng-if-end>\n" +
    "{{replicaSet | annotation:'deploymentStatusReason'}}\n" +
    "</dd>\n" +
    "<dt ng-if-start=\"replicaSet | deploymentIsInProgress\">Duration:</dt>\n" +
    "<dd ng-if-end>\n" +
    "<span ng-switch=\"replicaSet | deploymentStatus\" class=\"hide-ng-leave\">\n" +
    "<span ng-switch-when=\"Running\">running for <duration-until-now timestamp=\"replicaSet.metadata.creationTimestamp\"></duration-until-now></span>\n" +
    "<span ng-switch-default>waiting for <duration-until-now timestamp=\"replicaSet.metadata.creationTimestamp\"></duration-until-now></span>\n" +
    "</span>\n" +
    "</dd>\n" +
    "<dt>Selectors:</dt>\n" +
    "<dd>\n" +
    "<selector selector=\"replicaSet.spec.selector\"></selector>\n" +
    "</dd>\n" +
    "<dt>Replicas:</dt>\n" +
    "<dd>\n" +
    "\n" +
    "<replicas status=\"replicaSet.status.replicas\" spec=\"replicaSet.spec.replicas\" disable-scaling=\"!isScalable()\" scale-fn=\"scale(replicas)\" deployment=\"replicaSet\">\n" +
    "</replicas>\n" +
    "<span ng-if=\"autoscalers.length\">(autoscaled)</span>\n" +
    "</dd>\n" +
    "</dl>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"row\">\n" +
    "<div class=\"col-lg-6\">\n" +
    "<div class=\"deployment-detail\">\n" +
    "<h3>Template</h3>\n" +
    "<pod-template pod-template=\"replicaSet.spec.template\" images-by-docker-reference=\"imagesByDockerReference\" builds=\"builds\" detailed=\"true\" add-health-check-url=\"{{((!deploymentConfig || isActive) && ('deploymentconfigs' | canI : 'update')) ? healthCheckURL : ''}}\">\n" +
    "</pod-template>\n" +
    "<h4>Volumes</h4>\n" +
    "<div ng-if=\"kind === 'ReplicaSet'\">\n" +
    "<div ng-if=\"deployment\">\n" +
    "<volumes volumes=\"replicaSet.spec.template.spec.volumes\" namespace=\"project.metadata.name\"></volumes>\n" +
    "<div ng-if=\"{ group: 'extensions', resource: 'deployments' } | canI : 'update'\">\n" +
    "<a ng-href=\"project/{{project.metadata.name}}/attach-pvc?kind=Deployment&name={{deployment.metadata.name}}&group=extensions\">Add Storage</a>\n" +
    "<span class=\"action-divider\" aria-hidden=\"true\">|</span>\n" +
    "<a ng-href=\"project/{{project.metadata.name}}/add-config-volume?kind=Deployment&name={{deployment.metadata.name}}\">Add Config Files</a>\n" +
    "</div>\n" +
    "<div ng-if=\"!replicaSet.spec.template.spec.volumes.length && !({ group: 'extensions', resource: 'deployments' } | canI : 'update')\">none</div>\n" +
    "</div>\n" +
    "<div ng-if=\"!deployment\">\n" +
    "<div ng-if=\"resource | canI : 'update'\">\n" +
    "<volumes volumes=\"replicaSet.spec.template.spec.volumes\" namespace=\"project.metadata.name\" can-remove=\"true\" remove-fn=\"removeVolume(volume)\">\n" +
    "</volumes>\n" +
    "<a ng-href=\"project/{{project.metadata.name}}/attach-pvc?kind=ReplicaSet&name={{replicaSet.metadata.name}}&group=extensions\">Add Storage</a>\n" +
    "<span class=\"action-divider\" aria-hidden=\"true\">|</span>\n" +
    "<a ng-href=\"project/{{project.metadata.name}}/add-config-volume?kind=ReplicaSet&name={{replicaSet.metadata.name}}&group=extensions\">Add Config Files</a>\n" +
    "</div>\n" +
    "<div ng-if=\"!(resource | canI : 'update')\">\n" +
    "<volumes volumes=\"replicaSet.spec.template.spec.volumes\" namespace=\"project.metadata.name\"></volumes>\n" +
    "<span ng-if=\"!replicaSet.spec.template.spec.volumes.length\">none</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"kind === 'ReplicationController'\">\n" +
    "<div ng-if=\"deploymentConfigName\">\n" +
    "<volumes volumes=\"replicaSet.spec.template.spec.volumes\" namespace=\"project.metadata.name\"></volumes>\n" +
    "<div ng-if=\"'deploymentconfigs' | canI : 'update'\">\n" +
    "<a ng-href=\"project/{{project.metadata.name}}/attach-pvc?kind=DeploymentConfig&name={{deploymentConfigName}}\">Add Storage to {{deploymentConfigName}}</a>\n" +
    "<span class=\"action-divider\" aria-hidden=\"true\">|</span>\n" +
    "<a ng-href=\"project/{{project.metadata.name}}/add-config-volume?kind=DeploymentConfig&name={{deploymentConfigName}}\">Add Config Files to {{deploymentConfigName}}</a>\n" +
    "</div>\n" +
    "<div ng-if=\"!replicaSet.spec.template.spec.volumes.length && !('deploymentconfigs' | canI : 'update')\">none</div>\n" +
    "</div>\n" +
    "<div ng-if=\"!deploymentConfigName\">\n" +
    "<div ng-if=\"resource | canI : 'update'\">\n" +
    "<volumes volumes=\"replicaSet.spec.template.spec.volumes\" namespace=\"project.metadata.name\" can-remove=\"true\" remove-fn=\"removeVolume(volume)\">\n" +
    "</volumes>\n" +
    "<a ng-href=\"project/{{project.metadata.name}}/attach-pvc?kind=ReplicationController&name={{replicaSet.metadata.name}}\">Add Storage</a>\n" +
    "<span class=\"action-divider\" aria-hidden=\"true\">|</span>\n" +
    "<a ng-href=\"project/{{project.metadata.name}}/add-config-volume?kind=ReplicationController&name={{replicaSet.metadata.name}}\">Add Config Files</a>\n" +
    "</div>\n" +
    "<div ng-if=\"!(resource | canI : 'update')\">\n" +
    "<volumes volumes=\"replicaSet.spec.template.spec.volumes\" namespace=\"project.metadata.name\"></volumes>\n" +
    "<span ng-if=\"!replicaSet.spec.template.spec.volumes.length\">none</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "\n" +
    "<div ng-if=\"!deploymentConfigName || autoscalers.length\">\n" +
    "<h3>Autoscaling</h3>\n" +
    "\n" +
    "<div ng-repeat=\"warning in hpaWarnings\" class=\"alert alert-warning\">\n" +
    "<span class=\"pficon pficon-warning-triangle-o\" aria-hidden=\"true\"></span>\n" +
    "<span class=\"sr-only\">Warning:</span>\n" +
    "{{warning.message}}\n" +
    "\n" +
    "<span ng-if=\"warning.reason === 'NoCPURequest'\">\n" +
    "\n" +
    "<a ng-href=\"project/{{projectName}}/set-limits?kind=DeploymentConfig&name={{deploymentConfigName}}\" ng-if=\"deploymentConfigName && !deploymentConfigMissing && ('deploymentconfigs' | canI : 'update')\" role=\"button\">Edit Resource\n" +
    "<span ng-if=\"!('cpu' | isRequestCalculated : project)\">Requests and</span> Limits</a>\n" +
    "\n" +
    "<a ng-href=\"project/{{projectName}}/set-limits?kind=ReplicationController&name={{replicaSet.metadata.name}}\" ng-if=\"!deploymentConfigName && kind === 'ReplicationController' && (resource | canI : 'update')\" role=\"button\">Edit Resource\n" +
    "<span ng-if=\"!('cpu' | isRequestCalculated : project)\">Requests and</span> Limits</a>\n" +
    "<a ng-href=\"project/{{projectName}}/set-limits?kind=ReplicaSet&name={{replicaSet.metadata.name}}&group=extensions\" ng-if=\"!deploymentConfigName && kind === 'ReplicaSet' && (resource | canI : 'update')\" role=\"button\">Edit Resource\n" +
    "<span ng-if=\"!('cpu' | isRequestCalculated : project)\">Requests and</span> Limits</a>\n" +
    "</span>\n" +
    "</div>\n" +
    "\n" +
    "<div ng-if=\"!autoscalers.length\">\n" +
    "<span ng-if=\"{resource: 'horizontalpodautoscalers', group: 'extensions'} | canI : 'create'\">\n" +
    "<a ng-if=\"replicaSet.kind === 'ReplicaSet' && !deployment\" ng-href=\"project/{{projectName}}/edit/autoscaler?kind=ReplicaSet&name={{replicaSet.metadata.name}}&group=extensions\" role=\"button\">Add Autoscaler</a>\n" +
    "<a ng-if=\"replicaSet.kind === 'ReplicaSet' && deployment\" ng-href=\"project/{{projectName}}/edit/autoscaler?kind=Deployment&name={{deployment.metadata.name}}&group=extensions\" role=\"button\">Add Autoscaler</a>\n" +
    "<a ng-if=\"replicaSet.kind === 'ReplicationController' && !deploymentConfigName\" ng-href=\"project/{{projectName}}/edit/autoscaler?kind=ReplicationController&name={{replicaSet.metadata.name}}\" role=\"button\">Add Autoscaler</a>\n" +
    "<a ng-if=\"replicaSet.kind === 'ReplicationController' && deploymentConfigName\" ng-href=\"project/{{projectName}}/edit/autoscaler?kind=DeploymentConfig&name={{deploymentConfigName}}\" role=\"button\">Add Autoscaler</a>\n" +
    "</span>\n" +
    "<span ng-if=\"!({resource: 'horizontalpodautoscalers', group: 'extensions'} | canI : 'create')\">\n" +
    "Autoscaling is not enabled. There are no autoscalers for this\n" +
    "<span ng-if=\"deploymentConfigName\">deployment config or deployment.</span>\n" +
    "<span ng-if=\"!deploymentConfigName\">{{replicaSet.kind | humanizeKind}}.</span>\n" +
    "</span>\n" +
    "</div>\n" +
    "\n" +
    "<div ng-repeat=\"hpa in autoscalers | orderBy : 'name'\">\n" +
    "<hpa hpa=\"hpa\" show-scale-target=\"hpa.spec.scaleRef.kind !== 'ReplicationController'\" alerts=\"alerts\">\n" +
    "</hpa>\n" +
    "</div>\n" +
    "</div>\n" +
    "<h3>Pods</h3>\n" +
    "<pods-table pods=\"podsForDeployment\"></pods-table>\n" +
    "<annotations annotations=\"replicaSet.metadata.annotations\"></annotations>"
  );


  $templateCache.put('views/browse/_replication-controller-actions.html',
    "<div ng-if=\"(('replicationControllers' | canIDoAny) || (!deploymentConfigName && !autoscalers.length && ({ group: 'extensions', resource: 'horizontalpodautoscalers' } | canI : 'create')))\" class=\"pull-right dropdown\">\n" +
    "<button type=\"button\" class=\"dropdown-toggle btn btn-default actions-dropdown-btn hidden-xs\" data-toggle=\"dropdown\">\n" +
    "Actions\n" +
    "<span class=\"caret\"></span>\n" +
    "</button>\n" +
    "<a href=\"\" class=\"dropdown-toggle actions-dropdown-kebab visible-xs-inline\" data-toggle=\"dropdown\"><i class=\"fa fa-ellipsis-v\"></i><span class=\"sr-only\">Actions</span></a>\n" +
    "<ul class=\"dropdown-menu actions action-button\">\n" +
    "<li ng-if=\"deploymentConfigName && ('deploymentconfigs' | canI : 'update')\">\n" +
    "<a ng-href=\"project/{{project.metadata.name}}/attach-pvc?kind=DeploymentConfig&name={{deploymentConfigName}}\" role=\"button\">Add Storage</a>\n" +
    "</li>\n" +
    "<li ng-if=\"!deploymentConfigName && ('replicationcontrollers' | canI : 'update')\">\n" +
    "<a ng-href=\"project/{{project.metadata.name}}/attach-pvc?kind=ReplicationController&name={{replicaSet.metadata.name}}\" role=\"button\">Add Storage</a>\n" +
    "</li>\n" +
    "<li ng-if=\"!autoscalers.length && ({resource: 'horizontalpodautoscalers', group: 'extensions'} | canI : 'create')\">\n" +
    "\n" +
    "<a ng-href=\"project/{{projectName}}/edit/autoscaler?kind=ReplicationController&name={{replicaSet.metadata.name}}\" ng-if=\"!deploymentConfigName\" role=\"button\">Add Autoscaler</a>\n" +
    "<a ng-href=\"project/{{projectName}}/edit/autoscaler?kind=DeploymentConfig&name={{deploymentConfigName}}\" ng-if=\"deploymentConfigName\" role=\"button\">Add Autoscaler</a>\n" +
    "</li>\n" +
    "<li ng-if=\"deploymentConfigName && ('deploymentconfigs' | canI : 'update')\">\n" +
    "<a ng-href=\"project/{{projectName}}/set-limits?kind=DeploymentConfig&name={{deploymentConfigName}}\" role=\"button\">Edit Resource Limits</a>\n" +
    "</li>\n" +
    "<li ng-if=\"!deploymentConfigName && ('replicationcontrollers' | canI : 'update')\">\n" +
    "<a ng-href=\"project/{{projectName}}/set-limits?kind=ReplicationController&name={{replicaSet.metadata.name}}\" role=\"button\">Edit Resource Limits</a>\n" +
    "</li>\n" +
    "\n" +
    "<li ng-if=\"(!deploymentConfigName && ('replicationcontrollers' | canI : 'update')) || (deploymentConfigName && ('deploymentconfigs' | canI : 'update'))\">\n" +
    "<a ng-href=\"{{healthCheckURL}}\" role=\"button\">Edit Health Checks</a>\n" +
    "</li>\n" +
    "<li ng-if=\"'replicationcontrollers' | canI : 'update'\">\n" +
    "<a ng-href=\"{{replicaSet | editYamlURL}}\" role=\"button\">Edit YAML</a>\n" +
    "</li>\n" +
    "<li ng-if=\"'replicationcontrollers' | canI : 'delete'\">\n" +
    "<delete-link kind=\"ReplicationController\" type-display-name=\"deployment\" resource-name=\"{{replicaSet.metadata.name}}\" project-name=\"{{replicaSet.metadata.namespace}}\" alerts=\"alerts\" replicas=\"replicaSet.status.replicas\" hpa-list=\"hpaForRS\" redirect-url=\"{{replicaSet | configURLForResource}}\">\n" +
    "</delete-link>\n" +
    "</li>\n" +
    "</ul>\n" +
    "</div>"
  );


  $templateCache.put('views/browse/build-config.html',
    "<project-header class=\"top-header\"></project-header>\n" +
    "<project-page>\n" +
    "\n" +
    "<div class=\"middle-section\">\n" +
    "<div class=\"middle-container\">\n" +
    "<div class=\"middle-header\">\n" +
    "<div class=\"container-fluid\">\n" +
    "<breadcrumbs breadcrumbs=\"breadcrumbs\"></breadcrumbs>\n" +
    "<alerts alerts=\"alerts\"></alerts>\n" +
    "<h1 class=\"contains-actions\">\n" +
    "<div class=\"pull-right dropdown\" ng-if=\"buildConfig\" ng-hide=\"!('buildConfigs' | canIDoAny)\">\n" +
    "\n" +
    "<button class=\"btn btn-default hidden-xs\" ng-if=\"'buildconfigs/instantiate' | canI : 'create'\" ng-click=\"startBuild()\">\n" +
    "<span ng-if=\"!(buildConfig | isJenkinsPipelineStrategy)\">\n" +
    "Start Build\n" +
    "</span>\n" +
    "<span ng-if=\"buildConfig | isJenkinsPipelineStrategy\">\n" +
    "Start Pipeline\n" +
    "</span>\n" +
    "</button>\n" +
    "\n" +
    "<button type=\"button\" class=\"dropdown-toggle actions-dropdown-btn btn btn-default hidden-xs\" data-toggle=\"dropdown\">\n" +
    "Actions\n" +
    "<span class=\"caret\" aria-hidden=\"true\"></span>\n" +
    "</button>\n" +
    "<a href=\"\" class=\"dropdown-toggle actions-dropdown-kebab visible-xs-inline\" data-toggle=\"dropdown\"><i class=\"fa fa-ellipsis-v\"></i><span class=\"sr-only\">Actions</span></a>\n" +
    "<ul class=\"dropdown-menu actions action-button\">\n" +
    "<li class=\"visible-xs-inline\" ng-if=\"'buildconfigs/instantiate' | canI : 'create'\">\n" +
    "<a href=\"\" role=\"button\" ng-click=\"startBuild()\">\n" +
    "<span ng-if=\"!(buildConfig | isJenkinsPipelineStrategy)\">\n" +
    "Start Build\n" +
    "</span>\n" +
    "<span ng-if=\"buildConfig | isJenkinsPipelineStrategy\">\n" +
    "Start Pipeline\n" +
    "</span>\n" +
    "</a>\n" +
    "</li>\n" +
    "<li ng-if=\"'buildconfigs' | canI : 'update'\">\n" +
    "<a ng-href=\"{{buildConfig | editResourceURL}}\" role=\"button\">Edit</a>\n" +
    "</li>\n" +
    "<li ng-if=\"'buildconfigs' | canI : 'update'\">\n" +
    "<a ng-href=\"{{buildConfig | editYamlURL}}\" role=\"button\">Edit YAML</a>\n" +
    "</li>\n" +
    "<li ng-if=\"'buildconfigs' | canI : 'delete'\">\n" +
    "<delete-link kind=\"BuildConfig\" resource-name=\"{{buildConfig.metadata.name}}\" project-name=\"{{buildConfig.metadata.namespace}}\" alerts=\"alerts\">\n" +
    "</delete-link>\n" +
    "</li>\n" +
    "</ul>\n" +
    "</div>\n" +
    "{{buildConfigName}}\n" +
    "<span class=\"pficon pficon-warning-triangle-o\" ng-if=\"buildConfigPaused || buildConfigDeleted\" aria-hidden=\"true\" data-toggle=\"tooltip\" data-original-title=\"{{buildConfigDeleted ? 'This build configuration no longer exists' : 'Building from build configuration ' + buildConfig.metadata.name + ' has been paused.'}}\">\n" +
    "</span>\n" +
    "<small class=\"meta\" ng-if=\"buildConfig\">created <span am-time-ago=\"buildConfig.metadata.creationTimestamp\"></span></small>\n" +
    "</h1>\n" +
    "<labels labels=\"buildConfig.metadata.labels\" clickable=\"true\" kind=\"builds\" title-kind=\"build configs\" project-name=\"{{buildConfig.metadata.namespace}}\" limit=\"3\"></labels>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"middle-content\" persist-tab-state>\n" +
    "<div class=\"container-fluid\">\n" +
    "<div ng-if=\"!loaded\">Loading...</div>\n" +
    "<div class=\"row\" ng-if=\"loaded\">\n" +
    "<div class=\"col-md-12\" ng-class=\"{ 'hide-tabs' : !buildConfig }\">\n" +
    "<uib-tabset>\n" +
    "<uib-tab active=\"selectedTab.history\">\n" +
    "<uib-tab-heading>History</uib-tab-heading>\n" +
    "\n" +
    "<div ng-if=\"!unfilteredBuilds\" class=\"gutter-bottom\">Loading...</div>\n" +
    "\n" +
    "<div ng-if=\"buildConfig && unfilteredBuilds && (unfilteredBuilds | hashSize) === 0\" class=\"empty-state-message text-center\">\n" +
    "<h2>No builds.</h2>\n" +
    "<p>\n" +
    "<span ng-if=\"!buildConfig.spec.strategy.jenkinsPipelineStrategy\">\n" +
    "<span ng-if=\"!('buildconfigs/instantiate' | canI : 'create')\">\n" +
    "Builds will create an image from\n" +
    "</span>\n" +
    "<span ng-if=\"'buildconfigs/instantiate' | canI : 'create'\">\n" +
    "Start a new build to create an image from\n" +
    "</span>\n" +
    "<span ng-if=\"buildConfig.spec.source.type === 'Git'\">\n" +
    "source repository\n" +
    "<span class=\"word-break\"><osc-git-link uri=\"buildConfig.spec.source.git.uri\" ref=\"buildConfig.spec.source.git.ref\" context-dir=\"buildConfig.spec.source.contextDir\">{{buildConfig.spec.source.git.uri}}</osc-git-link></span>\n" +
    "</span>\n" +
    "<span ng-if=\"buildConfig.spec.source.type !== 'Git'\">\n" +
    "build configuration {{buildConfig.metadata.name}}.\n" +
    "</span>\n" +
    "</span>\n" +
    "<span ng-if=\"buildConfig.spec.strategy.jenkinsPipelineStrategy\">\n" +
    "No pipeline builds have run for {{buildConfigName}}.\n" +
    "<br>\n" +
    "<span ng-if=\"buildConfig.spec.strategy.jenkinsPipelineStrategy.jenkinsfile\">\n" +
    "View the <a ng-href=\"{{(buildConfig | navigateResourceURL) + '?tab=configuration'}}\">Jenkinsfile</a> to see what stages will run.\n" +
    "</span>\n" +
    "<span ng-if=\"buildConfig.spec.strategy.jenkinsPipelineStrategy.jenkinsfilePath\">\n" +
    "View the file <code>{{buildConfig.spec.strategy.jenkinsPipelineStrategy.jenkinsfilePath}}</code> in the\n" +
    "<a ng-if=\"buildConfig | jenkinsfileLink\" ng-href=\"buildConfig | jenkinsfileLink\">source repository</a>\n" +
    "<span ng-if=\"!(buildConfig | jenkinsfileLink)\">source repository</span>\n" +
    "to see what stages will run.\n" +
    "</span>\n" +
    "</span>\n" +
    "</p>\n" +
    "<button class=\"btn btn-primary btn-lg\" ng-click=\"startBuild(buildConfig.metadata.name)\" ng-if=\"'buildconfigs/instantiate' | canI : 'create'\">\n" +
    "<span ng-if=\"!(buildConfig | isJenkinsPipelineStrategy)\">\n" +
    "Start Build\n" +
    "</span>\n" +
    "<span ng-if=\"buildConfig | isJenkinsPipelineStrategy\">\n" +
    "Start Pipeline\n" +
    "</span>\n" +
    "</button>\n" +
    "</div>\n" +
    "\n" +
    "<div ng-if=\"builds && (builds | hashSize) > 0\" class=\"build-config-summary\">\n" +
    "\n" +
    "<div class=\"h3\">\n" +
    "<span class=\"last-status\">\n" +
    "<status-icon status=\"latestBuild.status.phase\"></status-icon>\n" +
    "Build\n" +
    "\n" +
    "<a ng-href=\"{{latestBuild | navigateResourceURL}}\"><span ng-if=\"latestBuild | annotation : 'buildNumber'\">#{{latestBuild | annotation : 'buildNumber'}}</span><span ng-if=\"!(latestBuild | annotation : 'buildNumber')\">{{latestBuild.metadata.name}}</span></a>\n" +
    "<span ng-switch=\"latestBuild.status.phase\" class=\"hide-ng-leave\">\n" +
    "<span ng-switch-when=\"Failed\">failed.</span>\n" +
    "<span ng-switch-when=\"Error\">encountered an error.</span>\n" +
    "<span ng-switch-when=\"Cancelled\">was cancelled.</span>\n" +
    "<span ng-switch-default>is {{latestBuild.status.phase | lowercase}}.</span>\n" +
    "</span>\n" +
    "</span>\n" +
    "<span ng-if=\"latestBuild | buildLogURL\">\n" +
    "\n" +
    "<span ng-if=\"latestBuild | isJenkinsPipelineStrategy\">\n" +
    "<a ng-href=\"{{latestBuild | buildLogURL}}\" target=\"_blank\">View Log</a>\n" +
    "</span>\n" +
    "\n" +
    "<span ng-if=\"!(latestBuild | isJenkinsPipelineStrategy) && ('builds/log' | canI : 'get')\">\n" +
    "<a ng-href=\"{{latestBuild | buildLogURL}}\">View Log</a>\n" +
    "</span>\n" +
    "</span>\n" +
    "</div>\n" +
    "<div class=\"last-timestamp meta text-muted\">\n" +
    "<span ng-if=\"!latestBuild.status.startTimestamp\">\n" +
    "created <span am-time-ago=\"latestBuild.metadata.creationTimestamp\"></span>\n" +
    "</span>\n" +
    "<span ng-if=\"latestBuild.status.startTimestamp\">\n" +
    "started <span am-time-ago=\"latestBuild.status.startTimestamp\"></span>\n" +
    "</span>\n" +
    "</div>\n" +
    "<build-trends-chart builds=\"builds\"></build-trends-chart>\n" +
    "</div>\n" +
    "<div ng-if=\"loaded && (unfilteredBuilds | hashSize) > 0\" class=\"mar-bottom-xl\">\n" +
    "<div class=\"table-filter-wrapper\">\n" +
    "<project-filter></project-filter>\n" +
    "</div>\n" +
    "<table ng-if=\"!(buildConfig | isJenkinsPipelineStrategy)\" class=\"table table-bordered table-hover table-mobile\">\n" +
    "<thead>\n" +
    "<tr>\n" +
    "<th>Build</th>\n" +
    "<th>Status</th>\n" +
    "<th>Duration</th>\n" +
    "<th>Created</th>\n" +
    "</tr>\n" +
    "</thead>\n" +
    "<tbody ng-if=\"(builds | hashSize) == 0\">\n" +
    "<tr><td colspan=\"3\"><em>{{emptyMessage}}</em></td></tr>\n" +
    "</tbody>\n" +
    "<tbody ng-if=\"(builds | hashSize) > 0\">\n" +
    "<tr ng-repeat=\"build in orderedBuilds\">\n" +
    "<td data-title=\"Build\">\n" +
    "\n" +
    "<span ng-if=\"build | annotation : 'buildNumber'\">\n" +
    "<a ng-href=\"{{build | navigateResourceURL}}\">#{{build | annotation : 'buildNumber'}}</a>\n" +
    "</span>\n" +
    "<span ng-if=\"!(build | annotation : 'buildNumber')\">\n" +
    "<a ng-href=\"{{build | navigateResourceURL}}\">{{build.metadata.name}}</a>\n" +
    "</span>\n" +
    "</td>\n" +
    "<td data-title=\"Status\">\n" +
    "<div row class=\"status\">\n" +
    "<status-icon status=\"build.status.phase\" disable-animation></status-icon>\n" +
    "<span ng-if=\"!build.status.reason || build.status.phase === 'Cancelled'\">{{build.status.phase}}</span>\n" +
    "<span ng-if=\"build.status.reason && build.status.phase !== 'Cancelled'\">{{build.status.reason | sentenceCase}}</span>\n" +
    "</div>\n" +
    "</td>\n" +
    "<td data-title=\"Duration\">\n" +
    "<duration-until-now ng-if=\"build.status.startTimestamp && !build.status.completionTimestamp\" timestamp=\"build.status.startTimestamp\" time-only></duration-until-now>\n" +
    "<span ng-if=\"build.status.startTimestamp && build.status.completionTimestamp\">{{build.status.startTimestamp | duration : build.status.completionTimestamp}}</span>\n" +
    "</td>\n" +
    "<td data-title=\"Created\">\n" +
    "<span am-time-ago=\"build.metadata.creationTimestamp\"></span>\n" +
    "</td>\n" +
    "</tr>\n" +
    "</tbody>\n" +
    "</table>\n" +
    "<div ng-if=\"buildConfig | isJenkinsPipelineStrategy\">\n" +
    "<build-pipeline build=\"build\" ng-repeat=\"build in orderedBuilds track by (build | uid)\"></build-pipeline>\n" +
    "<table ng-if=\"(builds | hashSize) === 0\" class=\"table table-bordered table-hover table-mobile\">\n" +
    "<tbody><tr><td><em>{{emptyMessage}}</em></td></tr></tbody>\n" +
    "</table>\n" +
    "</div>\n" +
    "</div>\n" +
    "</uib-tab>\n" +
    "<uib-tab active=\"selectedTab.configuration\" ng-if=\"buildConfig\">\n" +
    "<uib-tab-heading>Configuration</uib-tab-heading>\n" +
    "<div class=\"resource-details\">\n" +
    "<div class=\"row\">\n" +
    "<div class=\"col-lg-6\">\n" +
    "\n" +
    "<h3 class=\"hidden visible-lg visible-xl\">Details</h3>\n" +
    "<dl class=\"dl-horizontal left\">\n" +
    "<div>\n" +
    "<dt>Build Strategy:</dt>\n" +
    "<dd>{{buildConfig.spec.strategy.type | startCase}}</dd>\n" +
    "</div>\n" +
    "<div ng-if=\"buildConfig.spec.source\">\n" +
    "<div ng-if=\"buildConfig.spec.source.type == 'Git'\">\n" +
    "<dt>Source Repo:</dt>\n" +
    "<dd><span class=\"word-break\"><osc-git-link uri=\"buildConfig.spec.source.git.uri\" ref=\"buildConfig.spec.source.git.ref\" context-dir=\"buildConfig.spec.source.contextDir\">{{buildConfig.spec.source.git.uri}}</osc-git-link></span></dd>\n" +
    "<dt ng-if=\"buildConfig.spec.source.git.ref\">Source Ref:</dt>\n" +
    "<dd ng-if=\"buildConfig.spec.source.git.ref\">{{buildConfig.spec.source.git.ref}}</dd>\n" +
    "<dt ng-if=\"buildConfig.spec.source.contextDir\">Source Context Dir:</dt>\n" +
    "<dd ng-if=\"buildConfig.spec.source.contextDir\">{{buildConfig.spec.source.contextDir}}</dd>\n" +
    "</div>\n" +
    "<div ng-if=\"buildConfig.spec.strategy.jenkinsPipelineStrategy.jenkinsfilePath\">\n" +
    "<dt>Jenkinsfile Path:</dt>\n" +
    "<dd ng-if=\"buildConfig | jenkinsfileLink\">\n" +
    "<a ng-href=\"{{buildConfig | jenkinsfileLink}}\">{{buildConfig.spec.strategy.jenkinsPipelineStrategy.jenkinsfilePath}}</a>\n" +
    "</dd>\n" +
    "<dd ng-if=\"!(buildConfig | jenkinsfileLink)\">\n" +
    "{{buildConfig.spec.strategy.jenkinsPipelineStrategy.jenkinsfilePath}}\n" +
    "</dd>\n" +
    "<div class=\"small\">\n" +
    "<a href=\"\" ng-click=\"showJenkinsfileExamples()\">What's a Jenkinsfile?</a>\n" +
    "</div>\n" +
    "</div>\n" +
    "<dt ng-if-start=\"buildConfig.spec.source.binary.asFile\">Binary Input as File:</dt>\n" +
    "<dd ng-if-end>{{buildConfig.spec.source.binary.asFile}}</dd>\n" +
    "<div ng-if=\"buildConfig.spec.source.type == 'None' && !(buildConfig | isJenkinsPipelineStrategy)\">\n" +
    "<dt>Source:</dt>\n" +
    "<dd>\n" +
    "<i>none</i>\n" +
    "<span class=\"help action-inline\">\n" +
    "<a href>\n" +
    "<i class=\"pficon pficon-help\" data-toggle=\"tooltip\" aria-hidden=\"true\" data-original-title=\"No source inputs have been defined for this build configuration.\">\n" +
    "</i>\n" +
    "</a>\n" +
    "</span>\n" +
    "</dd>\n" +
    "</div>\n" +
    "<div ng-if=\"buildConfig.spec.source.images\" class=\"image-sources\">\n" +
    "<dt>Image Sources:</dt>\n" +
    "<dd></dd>\n" +
    "<div ng-repeat=\"imageSource in imageSources\" class=\"image-source-item\">\n" +
    "<h4>{{imageSource.from | imageObjectRef : buildConfig.metadata.namespace}}</h4>\n" +
    "<dl class=\"dl-horizontal left\">\n" +
    "<div class=\"is-item-description\">\n" +
    "<dt>Paths:</dt>\n" +
    "<div ng-repeat=\"(source, destination) in imageSourcesPaths[$index]\" class=\"image-source-paths\">\n" +
    "<dd><span class=\"source-path\">{{source}}</span><i class=\"fa fa-long-arrow-right\"></i><span class=\"destination-dir\">{{destination}}</span></dd>\n" +
    "</div>\n" +
    "</div>\n" +
    "</dl>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<dt ng-if-start=\"buildFrom = (buildConfig | buildStrategy).from\">Builder Image:</dt>\n" +
    "<dd ng-if-end>\n" +
    "<a ng-if=\"buildFrom.kind === 'ImageStreamTag' && (!buildFrom.namespace || buildConfig.metadata.namespace === buildFrom.namespace)\" ng-href=\"{{buildFrom.name | navigateResourceURL : 'ImageStreamTag' : buildConfig.metadata.namespace}}\">\n" +
    "{{buildFrom | imageObjectRef : buildConfig.metadata.namespace}}\n" +
    "</a>\n" +
    "<span ng-if=\"buildFrom.kind !== 'ImageStreamTag' || (buildFrom.namespace && buildConfig.metadata.namespace !== buildFrom.namespace)\">\n" +
    "{{buildFrom | imageObjectRef : buildConfig.metadata.namespace}}\n" +
    "</span>\n" +
    "</dd>\n" +
    "<div ng-if=\"outputTo = buildConfig.spec.output.to\">\n" +
    "<dt>Output To:</dt>\n" +
    "<dd>\n" +
    "<a ng-if=\"outputTo.kind === 'ImageStreamTag' && (!outputTo.namespace || buildConfig.metadata.namespace === outputTo.namespace)\" ng-href=\"{{outputTo.name | navigateResourceURL : 'ImageStreamTag' : buildConfig.metadata.namespace}}\">\n" +
    "{{outputTo | imageObjectRef : buildConfig.metadata.namespace}}\n" +
    "</a>\n" +
    "<span ng-if=\"outputTo.kind !== 'ImageStreamTag' || (outputTo.namespace && buildConfig.metadata.namespace !== outputTo.namespace)\">\n" +
    "{{outputTo | imageObjectRef : buildConfig.metadata.namespace}}\n" +
    "</span>\n" +
    "</dd>\n" +
    "</div>\n" +
    "<div class=\"run-policy\">\n" +
    "<dt>Run Policy:</dt>\n" +
    "<dd>\n" +
    "{{buildConfig.spec.runPolicy | sentenceCase}}\n" +
    "<span class=\"help action-inline\">\n" +
    "<a href ng-switch=\"buildConfig.spec.runPolicy\">\n" +
    "<i ng-switch-when=\"Serial\" class=\"pficon pficon-help\" data-toggle=\"tooltip\" aria-hidden=\"true\" data-original-title=\"Builds triggered from this Build Configuration will run one at the time, in the order they have been triggered.\"></i>\n" +
    "<i ng-switch-when=\"Parallel\" class=\"pficon pficon-help\" data-toggle=\"tooltip\" aria-hidden=\"true\" data-original-title=\"Builds triggered from this Build Configuration will run all at the same time. The order in which they will finish is not guaranteed.\"></i>\n" +
    "<i ng-switch-when=\"SerialLatestOnly\" class=\"pficon pficon-help\" data-toggle=\"tooltip\" aria-hidden=\"true\" data-original-title=\"Builds triggered from this Build Configuration will run one at the time. When a currently running build completes, the next build that will run is the latest build created. Other queued builds will be cancelled.\"></i>\n" +
    "<i ng-switch-default class=\"pficon pficon-help\" data-toggle=\"tooltip\" aria-hidden=\"true\" data-original-title=\"Builds triggered from this Build Configuration will run using the {{buildConfig.spec.runPolicy | sentenceCase}} policy.\"></i>\n" +
    "</a>\n" +
    "</span>\n" +
    "</dd>\n" +
    "</div>\n" +
    "\n" +
    "<div ng-if=\"buildConfig.spec.source.dockerfile\">\n" +
    "<dt>Dockerfile:</dt><dd></dd>\n" +
    "<div ui-ace=\"{\n" +
    "                                  mode: 'dockerfile',\n" +
    "                                  theme: 'dreamweaver',\n" +
    "                                  onLoad: aceLoaded,\n" +
    "                                  highlightActiveLine: false,\n" +
    "                                  showGutter: false,\n" +
    "                                  rendererOptions: {\n" +
    "                                    fadeFoldWidgets: true,\n" +
    "                                    highlightActiveLine: false,\n" +
    "                                    showPrintMargin: false\n" +
    "                                  },\n" +
    "                                  advanced: {\n" +
    "                                    highlightActiveLine: false\n" +
    "                                  }\n" +
    "                                }\" readonly=\"readonly\" ng-model=\"buildConfig.spec.source.dockerfile\" class=\"ace-bordered ace-read-only ace-inline dockerfile-mode mar-top-md\"></div>\n" +
    "</div>\n" +
    "<div ng-if=\"buildConfig.spec.strategy.jenkinsPipelineStrategy.jenkinsfile\">\n" +
    "<div class=\"small pull-right mar-top-sm\">\n" +
    "<a href=\"\" ng-click=\"showJenkinsfileExamples()\">What's a Jenkinsfile?</a>\n" +
    "</div>\n" +
    "<dt>\n" +
    "Jenkinsfile:\n" +
    "</dt><dd></dd>\n" +
    "<div ui-ace=\"{\n" +
    "                                  mode: 'groovy',\n" +
    "                                  theme: 'eclipse',\n" +
    "                                  showGutter: false,\n" +
    "                                  rendererOptions: {\n" +
    "                                    fadeFoldWidgets: true,\n" +
    "                                    highlightActiveLine: false,\n" +
    "                                    showPrintMargin: false\n" +
    "                                  },\n" +
    "                                  advanced: {\n" +
    "                                    highlightActiveLine: false\n" +
    "                                  }\n" +
    "                                }\" readonly=\"readonly\" ng-model=\"buildConfig.spec.strategy.jenkinsPipelineStrategy.jenkinsfile\" class=\"ace-bordered ace-inline ace-read-only\"></div>\n" +
    "</div>\n" +
    "</dl>\n" +
    "<div ng-if=\"buildConfig | hasPostCommitHook\">\n" +
    "<h3>Post-Commit Hooks</h3>\n" +
    "<build-hooks build=\"buildConfig\"></build-hooks>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"col-lg-6\">\n" +
    "<h3>Triggers</h3>\n" +
    "<dl class=\"dl-horizontal left\">\n" +
    "<div ng-repeat=\"trigger in buildConfig.spec.triggers\">\n" +
    "<div ng-switch=\"trigger.type\">\n" +
    "<div ng-switch-when=\"GitHub\">\n" +
    "<dt>GitHub Webhook URL:\n" +
    "<a href=\"{{'webhooks' | helpLink}}\" target=\"_blank\"><span class=\"learn-more-block\">Learn More&nbsp;<i class=\"fa fa-external-link\" aria-hidden=\"true\"></i></span></a>\n" +
    "</dt>\n" +
    "<dd>\n" +
    "<copy-to-clipboard clipboard-text=\"buildConfig.metadata.name | webhookURL : trigger.type : trigger.github.secret : project.metadata.name\"></copy-to-clipboard>\n" +
    "</dd>\n" +
    "</div>\n" +
    "<div ng-switch-when=\"Generic\">\n" +
    "<dt>Generic Webhook URL:\n" +
    "<a href=\"{{'webhooks' | helpLink}}\" target=\"_blank\"><span class=\"learn-more-block\">Learn More&nbsp;<i class=\"fa fa-external-link\" aria-hidden=\"true\"></i></span></a>\n" +
    "</dt>\n" +
    "<dd>\n" +
    "<copy-to-clipboard clipboard-text=\"buildConfig.metadata.name | webhookURL : trigger.type : trigger.generic.secret : project.metadata.name\"></copy-to-clipboard>\n" +
    "</dd>\n" +
    "</div>\n" +
    "<div ng-switch-when=\"ImageChange\">\n" +
    "<dt>\n" +
    "New Image For:\n" +
    "</dt>\n" +
    "<dd ng-init=\"triggerFrom = (trigger.imageChange.from || (buildConfig | buildStrategy).from)\">\n" +
    "<a ng-if=\"triggerFrom.kind === 'ImageStreamTag' && (!triggerFrom.namespace || buildConfig.metadata.namespace === triggerFrom.namespace)\" ng-href=\"{{triggerFrom.name | navigateResourceURL : 'ImageStreamTag' : buildConfig.metadata.namespace}}\">\n" +
    "{{triggerFrom | imageObjectRef : buildConfig.metadata.namespace}}\n" +
    "</a>\n" +
    "<span ng-if=\"triggerFrom.kind !== 'ImageStreamTag' || (triggerFrom.namespace && buildConfig.metadata.namespace !== triggerFrom.namespace)\">\n" +
    "{{triggerFrom | imageObjectRef : buildConfig.metadata.namespace}}\n" +
    "</span>\n" +
    "</dd>\n" +
    "</div>\n" +
    "<div ng-switch-when=\"ConfigChange\">\n" +
    "<dt>Config Change For:</dt>\n" +
    "<dd>Build config {{buildConfig.metadata.name}}</dd>\n" +
    "</div>\n" +
    "<div ng-switch-default>\n" +
    "<dt>Other Trigger:</dt>\n" +
    "<dd>{{trigger.type}}</dd>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<dt>Manual (CLI):\n" +
    "<a href=\"{{'start-build' | helpLink}}\" target=\"_blank\">\n" +
    "<span class=\"learn-more-block\">Learn More&nbsp;<i class=\"fa fa-external-link\" aria-hidden=\"true\"> </i></span>\n" +
    "</a>\n" +
    "</dt>\n" +
    "<dd>\n" +
    "<copy-to-clipboard clipboard-text=\"'oc start-build ' + buildConfig.metadata.name + ' -n ' + project.metadata.name\"></copy-to-clipboard>\n" +
    "</dd>\n" +
    "</dl>\n" +
    "</div>\n" +
    "</div>\n" +
    "<annotations annotations=\"buildConfig.metadata.annotations\"></annotations>\n" +
    "</div>\n" +
    "</uib-tab>\n" +
    "<uib-tab heading=\"Environment\" active=\"selectedTab.environment\" ng-if=\"buildConfig && !(buildConfig | isJenkinsPipelineStrategy)\">\n" +
    "<uib-tab-heading>Environment</uib-tab-heading>\n" +
    "<h3>Environment Variables</h3>\n" +
    "<p ng-if=\"BCEnvVarsFromImage.length\">\n" +
    "The builder image has additional environment variables defined. Variables defined below will overwrite any from the image with the same name.\n" +
    "<a href=\"\" ng-click=\"expand.imageEnv = true\" ng-if=\"!expand.imageEnv\">Show Image Environment Variables</a>\n" +
    "<a href=\"\" ng-click=\"expand.imageEnv = false\" ng-if=\"expand.imageEnv\">Hide Image Environment Variables</a>\n" +
    "</p>\n" +
    "<key-value-editor ng-if=\"expand.imageEnv\" entries=\"BCEnvVarsFromImage\" key-placeholder=\"Name\" value-placeholder=\"Value\" is-readonly cannot-add cannot-sort cannot-delete show-header></key-value-editor>\n" +
    "<ng-form name=\"forms.bcEnvVars\" class=\"mar-bottom-xl block\">\n" +
    "<div ng-if=\"'buildconfigs' | canI : 'update'\">\n" +
    "<key-value-editor entries=\"envVars\" key-placeholder=\"Name\" value-placeholder=\"Value\" key-validator=\"[A-Za-z_][A-Za-z0-9_]*\" key-validator-error=\"Please enter a valid key\" key-validator-error-tooltip=\"A valid environment variable name is an alphanumeric (a-z and 0-9) string beginning with a letter that may contain underscores.\" add-row-link=\"Add Environment Variable\" show-header></key-value-editor>\n" +
    "<button class=\"btn btn-default\" ng-click=\"saveEnvVars()\" ng-disabled=\"forms.bcEnvVars.$pristine || forms.bcEnvVars.$invalid\">Save</button>\n" +
    "<a ng-if=\"!forms.bcEnvVars.$pristine\" href=\"\" ng-click=\"clearEnvVarUpdates()\" class=\"mar-left-sm\" style=\"vertical-align: -2px\">Clear Changes</a>\n" +
    "</div>\n" +
    "<key-value-editor ng-if=\"!('buildconfigs' | canI : 'update')\" entries=\"envVars\" key-placeholder=\"Name\" value-placeholder=\"Value\" is-readonly cannot-add cannot-sort cannot-delete show-header></key-value-editor>\n" +
    "</ng-form>\n" +
    "</uib-tab>\n" +
    "</uib-tabset>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</project-page>"
  );


  $templateCache.put('views/browse/build.html',
    "<project-header class=\"top-header\"></project-header>\n" +
    "<project-page>\n" +
    "\n" +
    "<div class=\"middle-section\">\n" +
    "<div class=\"middle-container\">\n" +
    "<div class=\"middle-header\">\n" +
    "<div class=\"container-fluid\">\n" +
    "<breadcrumbs breadcrumbs=\"breadcrumbs\"></breadcrumbs>\n" +
    "<alerts alerts=\"alerts\"></alerts>\n" +
    "<div ng-if=\"!loaded\" class=\"mar-top-xl\">Loading...</div>\n" +
    "<div ng-if=\"build\">\n" +
    "<h1 class=\"contains-actions\">\n" +
    "<div class=\"pull-right dropdown\" ng-hide=\"!('builds' | canIDoAny)\">\n" +
    "\n" +
    "<button class=\"btn btn-default hidden-xs\" ng-click=\"cancelBuild()\" ng-if=\"!build.metadata.deletionTimestamp && (build | isIncompleteBuild) && ('builds' | canI : 'update')\">Cancel Build</button>\n" +
    "<button class=\"btn btn-default hidden-xs\" ng-click=\"cloneBuild()\" ng-hide=\"build.metadata.deletionTimestamp || (build | isIncompleteBuild) || !('builds/clone' | canI : 'create')\" ng-disabled=\"!canBuild\">Rebuild</button>\n" +
    "\n" +
    "<button type=\"button\" class=\"dropdown-toggle btn btn-default actions-dropdown-btn hidden-xs\" data-toggle=\"dropdown\">\n" +
    "Actions\n" +
    "<span class=\"caret\" aria-hidden=\"true\"></span>\n" +
    "</button>\n" +
    "<a href=\"\" class=\"dropdown-toggle actions-dropdown-kebab visible-xs-inline\" data-toggle=\"dropdown\"><i class=\"fa fa-ellipsis-v\"></i><span class=\"sr-only\">Actions</span></a>\n" +
    "<ul class=\"dropdown-menu actions action-button\">\n" +
    "<li ng-if=\"'buildconfigs' | canI : 'update'\">\n" +
    "<a ng-href=\"{{buildConfig | editResourceURL}}\" role=\"button\">\n" +
    "<span ng-if=\"!(buildConfig | isJenkinsPipelineStrategy)\">\n" +
    "Edit Configuration\n" +
    "</span>\n" +
    "<span ng-if=\"buildConfig | isJenkinsPipelineStrategy\">\n" +
    "Edit Pipeline\n" +
    "</span>\n" +
    "</a>\n" +
    "</li>\n" +
    "<li class=\"divider\" ng-if=\"'buildconfigs' | canI : 'update'\"></li>\n" +
    "<li ng-if=\"!build.metadata.deletionTimestamp && (build | isIncompleteBuild) && ('builds' | canI : 'update')\" class=\"visible-xs-inline\">\n" +
    "<a href=\"\" role=\"button\" ng-click=\"cancelBuild()\">Cancel Build</a>\n" +
    "</li>\n" +
    "<li class=\"visible-xs-inline\" ng-class=\"{ disabled: !canBuild }\" ng-hide=\"build.metadata.deletionTimestamp || (build | isIncompleteBuild) || !('builds/clone' | canI : 'create')\">\n" +
    "<a href=\"\" role=\"button\" ng-click=\"cloneBuild()\" ng-attr-aria-disabled=\"{{canBuild ? undefined : 'true'}}\" ng-class=\"{ 'disabled-link': !canBuild }\">Rebuild</a>\n" +
    "</li>\n" +
    "<li ng-if=\"('builds' | canI : 'update')\">\n" +
    "<a ng-href=\"{{build | editYamlURL}}\" role=\"button\">Edit YAML</a>\n" +
    "</li>\n" +
    "<li ng-if=\"('builds' | canI : 'delete')\">\n" +
    "<delete-link kind=\"Build\" resource-name=\"{{build.metadata.name}}\" project-name=\"{{build.metadata.namespace}}\" alerts=\"alerts\" redirect-url=\"{{build | configURLForResource}}\">\n" +
    "</delete-link>\n" +
    "</li>\n" +
    "</ul>\n" +
    "</div>\n" +
    "{{build.metadata.name}}\n" +
    "<span class=\"pficon pficon-warning-triangle-o\" ng-if=\"buildConfigPaused || buildConfigDeleted\" aria-hidden=\"true\" data-toggle=\"tooltip\" data-original-title=\"{{buildConfigDeleted ? 'The build configuration for this build no longer exists.' : 'Building from build configuration ' + buildConfig.metadata.name + ' has been paused.'}}\">\n" +
    "</span>\n" +
    "<small class=\"meta\">created <span am-time-ago=\"build.metadata.creationTimestamp\"></span></small>\n" +
    "</h1>\n" +
    "<labels ng-if=\"buildConfigName\" labels=\"build.metadata.labels\" clickable=\"true\" kind=\"builds\" title-kind=\"builds for build config {{buildConfigName}}\" project-name=\"{{build.metadata.namespace}}\" limit=\"3\" navigate-url=\"project/{{build.metadata.namespace}}/browse/builds/{{buildConfigName}}\"></labels>\n" +
    "<labels ng-if=\"!buildConfigName\" labels=\"build.metadata.labels\" limit=\"3\"></labels>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"middle-content\" persist-tab-state>\n" +
    "<div class=\"container-fluid\">\n" +
    "<div class=\"row\" ng-if=\"build\">\n" +
    "<div class=\"col-md-12\">\n" +
    "<uib-tabset>\n" +
    "<uib-tab active=\"selectedTab.details\">\n" +
    "<uib-tab-heading>Details</uib-tab-heading>\n" +
    "<build-pipeline build=\"build\" ng-if=\"build | isJenkinsPipelineStrategy\"></build-pipeline>\n" +
    "<ng-include src=\" 'views/browse/_build-details.html' \"></ng-include>\n" +
    "</uib-tab>\n" +
    "<uib-tab heading=\"Environment\" active=\"selectedTab.environment\" ng-if=\"!(build | isJenkinsPipelineStrategy)\">\n" +
    "<uib-tab-heading>Environment</uib-tab-heading>\n" +
    "<h3>Environment Variables</h3>\n" +
    "<p ng-if=\"'buildconfigs' | canI : 'update'\">\n" +
    "<span class=\"pficon pficon-info\" aria-hidden=\"true\"></span>\n" +
    "Environment variables can be edited on the <a ng-href=\"{{build | configURLForResource}}?tab=environment\">build configuration</a>.\n" +
    "</p>\n" +
    "<key-value-editor entries=\"(build | buildStrategy).env\" key-placeholder=\"Name\" value-placeholder=\"Value\" cannot-add cannot-delete cannot-sort is-readonly show-header class=\"mar-bottom-xl block\"></key-value-editor>\n" +
    "<p ng-if=\"!(build | buildStrategy).env\"><em>The build strategy had no environment variables defined.</em></p>\n" +
    "</uib-tab>\n" +
    "<uib-tab active=\"selectedTab.logs\" ng-if=\"!(build | isJenkinsPipelineStrategy) && ('builds/log' | canI : 'get')\">\n" +
    "<uib-tab-heading>Logs</uib-tab-heading>\n" +
    "<log-viewer ng-if=\"selectedTab.logs\" follow-affix-top=\"390\" object=\"build\" context=\"projectContext\" options=\"logOptions\" empty=\"logEmpty\" run=\"logCanRun\">\n" +
    "<label>Status:</label>\n" +
    "<status-icon status=\"build.status.phase\"></status-icon>\n" +
    "<span class=\"space-after\">{{build.status.phase}}</span>\n" +
    "<div ng-if=\"build.status.startTimestamp && !logEmpty\" class=\"log-timestamps\">\n" +
    "Log from {{build.status.startTimestamp | date : 'medium'}}\n" +
    "<span ng-if=\"build.status.completionTimestamp\">\n" +
    "to {{build.status.completionTimestamp | date : 'medium'}}\n" +
    "</span>\n" +
    "</div>\n" +
    "</log-viewer>\n" +
    "</uib-tab>\n" +
    "<uib-tab active=\"selectedTab.events\" ng-if=\"('events' | canI : 'watch')\">\n" +
    "<uib-tab-heading>Events</uib-tab-heading>\n" +
    "<events resource-kind=\"Pod\" resource-name=\"{{build | annotation : 'buildPod'}}\" project-context=\"projectContext\" ng-if=\"selectedTab.events\"></events>\n" +
    "</uib-tab>\n" +
    "</uib-tabset>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</project-page>"
  );


  $templateCache.put('views/browse/config-map.html',
    "<project-header class=\"top-header\"></project-header>\n" +
    "<project-page>\n" +
    "\n" +
    "<div class=\"middle-section\">\n" +
    "<div class=\"middle-container\">\n" +
    "<div class=\"middle-header\">\n" +
    "<div class=\"container-fluid\">\n" +
    "<breadcrumbs breadcrumbs=\"breadcrumbs\"></breadcrumbs>\n" +
    "<alerts alerts=\"alerts\"></alerts>\n" +
    "<div ng-if=\"!loaded\" class=\"mar-top-xl\">Loading...</div>\n" +
    "<div ng-if=\"loaded && error\" class=\"empty-state-message text-center\">\n" +
    "<h2>The config map could not be loaded.</h2>\n" +
    "<p>{{error | getErrorDetails}}</p>\n" +
    "</div>\n" +
    "<div ng-if=\"loaded && !error\">\n" +
    "<h1 class=\"contains-actions\">\n" +
    "<div class=\"pull-right dropdown\" ng-if=\"'configmaps' | canIDoAny\">\n" +
    "<button type=\"button\" class=\"dropdown-toggle btn btn-default actions-dropdown-btn hidden-xs\" data-toggle=\"dropdown\">\n" +
    "Actions\n" +
    "<span class=\"caret\"></span>\n" +
    "</button>\n" +
    "<a href=\"\" class=\"dropdown-toggle actions-dropdown-kebab visible-xs-inline\" data-toggle=\"dropdown\"><i class=\"fa fa-ellipsis-v\"></i><span class=\"sr-only\">Actions</span></a>\n" +
    "<ul class=\"dropdown-menu actions action-link\">\n" +
    "<li ng-if=\"'configmaps' | canI : 'update'\">\n" +
    "<a ng-href=\"{{configMap | editResourceURL}}\" role=\"button\">Edit</a>\n" +
    "</li>\n" +
    "<li ng-if=\"'configmaps' | canI : 'update'\">\n" +
    "<a ng-href=\"{{configMap | editYamlURL}}\" role=\"button\">Edit YAML</a>\n" +
    "</li>\n" +
    "<li ng-if=\"'configmaps' | canI : 'delete'\">\n" +
    "<delete-link kind=\"ConfigMap\" resource-name=\"{{configMap.metadata.name}}\" project-name=\"{{configMap.metadata.namespace}}\" alerts=\"alerts\">\n" +
    "</delete-link>\n" +
    "</li>\n" +
    "</ul>\n" +
    "</div>\n" +
    "{{configMap.metadata.name}}\n" +
    "<small class=\"meta\">created <span am-time-ago=\"configMap.metadata.creationTimestamp\"></span></small>\n" +
    "</h1>\n" +
    "<labels labels=\"configMap.metadata.labels\" clickable=\"true\" kind=\"config-maps\" title-kind=\"config maps\" project-name=\"{{configMap.metadata.namespace}}\" limit=\"3\"></labels>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"middle-content\">\n" +
    "<div class=\"container-fluid\">\n" +
    "<div ng-if=\"configMap\" class=\"row\">\n" +
    "<div class=\"col-sm-12\">\n" +
    "<div ng-if=\"!(configMap.data | hashSize)\" class=\"empty-state-message text-center\">\n" +
    "<h2>The config map has no items.</h2>\n" +
    "</div>\n" +
    "<div ng-if=\"configMap.data | hashSize\" class=\"table-responsive\">\n" +
    "<table class=\"table table-bordered table-bordered-columns config-map-table key-value-table\">\n" +
    "<tbody>\n" +
    "<tr ng-repeat=\"(prop, value) in configMap.data\">\n" +
    "<td class=\"key\">{{prop}}</td>\n" +
    "<td class=\"value\">\n" +
    "<truncate-long-text content=\"value\" limit=\"1024\" newlinelimit=\"20\" expandable=\"true\">\n" +
    "</truncate-long-text>\n" +
    "</td>\n" +
    "</tr>\n" +
    "</tbody>\n" +
    "</table>\n" +
    "</div>\n" +
    "<annotations annotations=\"configMap.metadata.annotations\"></annotations>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</project-page>"
  );


  $templateCache.put('views/browse/config-maps.html',
    "<project-header class=\"top-header\"></project-header>\n" +
    "<project-page>\n" +
    "\n" +
    "<div class=\"middle-section\">\n" +
    "<div class=\"middle-container\">\n" +
    "<div class=\"middle-header header-toolbar\">\n" +
    "<div class=\"container-fluid\">\n" +
    "<div class=\"page-header page-header-bleed-right page-header-bleed-left\">\n" +
    "<div class=\"pull-right\" ng-if=\"project && ('configmaps' | canI : 'create')\">\n" +
    "<a ng-href=\"project/{{project.metadata.name}}/create-config-map\" class=\"btn btn-default\">Create Config Map</a>\n" +
    "</div>\n" +
    "<h1>\n" +
    "Config Maps\n" +
    "<span class=\"page-header-link\">\n" +
    "<a ng-href=\"{{'config-maps' | helpLink}}\" target=\"_blank\">\n" +
    "Learn More <i class=\"fa fa-external-link\" aria-hidden=\"true\"></i>\n" +
    "</a>\n" +
    "</span>\n" +
    "</h1>\n" +
    "</div>\n" +
    "<div ng-if=\"!renderOptions.showGetStarted\" class=\"data-toolbar\">\n" +
    "<div class=\"data-toolbar-filter\">\n" +
    "<project-filter></project-filter>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"middle-content\">\n" +
    "<div class=\"container-fluid\">\n" +
    "<alerts alerts=\"alerts\"></alerts>\n" +
    "<div class=\"row\">\n" +
    "<div class=\"col-md-12\">\n" +
    "<div ng-if=\"!loaded\">Loading...</div>\n" +
    "<div ng-if=\"loaded\">\n" +
    "<table class=\"table table-bordered table-hover table-mobile table-layout-fixed\">\n" +
    "<colgroup>\n" +
    "<col class=\"col-sm-5\">\n" +
    "</colgroup>\n" +
    "<thead>\n" +
    "<tr>\n" +
    "<th>Name</th>\n" +
    "<th>Created</th>\n" +
    "<th>Labels</th>\n" +
    "</tr>\n" +
    "</thead>\n" +
    "<tbody ng-if=\"(configMaps | hashSize) == 0\">\n" +
    "<tr><td colspan=\"3\"><em>No config maps to show</em></td></tr>\n" +
    "</tbody>\n" +
    "<tbody ng-if=\"(configMaps | hashSize) > 0\">\n" +
    "<tr ng-repeat=\"configMap in configMaps\">\n" +
    "<td data-title=\"Name\">\n" +
    "<a href=\"{{configMap | navigateResourceURL}}\">{{configMap.metadata.name}}</a>\n" +
    "</td>\n" +
    "<td data-title=\"Created\">\n" +
    "<span am-time-ago=\"configMap.metadata.creationTimestamp\"></span>\n" +
    "</td>\n" +
    "<td data-title=\"Labels\">\n" +
    "<em ng-if=\"(configMap.metadata.labels | hashSize) === 0\">none</em>\n" +
    "<labels labels=\"configMap.metadata.labels\" clickable=\"true\" kind=\"Config Map\" project-name=\"{{configMap.metadata.namespace}}\" limit=\"3\" filter-current-page=\"true\"></labels>\n" +
    "</td>\n" +
    "</tr>\n" +
    "</tbody>\n" +
    "</table>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</project-page>"
  );


  $templateCache.put('views/browse/deployment-config.html',
    "<project-header class=\"top-header\"></project-header>\n" +
    "<project-page>\n" +
    "\n" +
    "<div class=\"middle-section\">\n" +
    "<div class=\"middle-container\">\n" +
    "<div class=\"middle-header\">\n" +
    "<div class=\"container-fluid\">\n" +
    "<breadcrumbs breadcrumbs=\"breadcrumbs\"></breadcrumbs>\n" +
    "<alerts alerts=\"alerts\"></alerts>\n" +
    "<div>\n" +
    "<h1 class=\"contains-actions\">\n" +
    "<div class=\"pull-right dropdown\" ng-if=\"deploymentConfig\" ng-hide=\"!('deploymentConfigs' | canIDoAny)\">\n" +
    "\n" +
    "<button ng-if=\"'deploymentconfigs' | canI : 'update'\" class=\"btn btn-default hidden-xs\" ng-click=\"startLatestDeployment()\" ng-disabled=\"!canDeploy()\">\n" +
    "Deploy\n" +
    "</button>\n" +
    "\n" +
    "<button type=\"button\" class=\"dropdown-toggle btn btn-default actions-dropdown-btn hidden-xs\" data-toggle=\"dropdown\">\n" +
    "Actions\n" +
    "<span class=\"caret\" aria-hidden=\"true\"></span>\n" +
    "</button>\n" +
    "<a href=\"\" class=\"dropdown-toggle actions-dropdown-kebab visible-xs-inline\" data-toggle=\"dropdown\"><i class=\"fa fa-ellipsis-v\"></i><span class=\"sr-only\">Actions</span></a>\n" +
    "<ul class=\"dropdown-menu actions action-button\">\n" +
    "<li class=\"visible-xs-inline\" ng-class=\"{ disabled: !canDeploy() }\" ng-if=\"'deploymentconfigs' | canI : 'update'\">\n" +
    "<a href=\"\" role=\"button\" ng-attr-aria-disabled=\"{{canDeploy() ? undefined : 'true'}}\" ng-class=\"{ 'disabled-link': !canDeploy() }\" ng-click=\"startLatestDeployment()\">Deploy</a>\n" +
    "</li>\n" +
    "<li ng-if=\"'deploymentconfigs' | canI : 'update'\">\n" +
    "<a ng-href=\"{{deploymentConfig | editResourceURL}}\" role=\"button\">Edit</a>\n" +
    "</li>\n" +
    "<li class=\"divider\" ng-if=\"'deploymentconfigs' | canI : 'update'\"></li>\n" +
    "<li ng-if=\"!deploymentConfig.spec.paused && !updatingPausedState && ('deploymentconfigs' | canI : 'update')\">\n" +
    "<a href=\"\" ng-click=\"setPaused(true)\" role=\"button\">Pause Rollouts</a>\n" +
    "</li>\n" +
    "<li ng-if=\"deploymentConfig.spec.paused && !updatingPausedState && ('deploymentconfigs' | canI : 'update')\">\n" +
    "<a href=\"\" ng-click=\"setPaused(false)\" role=\"button\">Resume Rollouts</a>\n" +
    "</li>\n" +
    "<li ng-if=\"'deploymentconfigs' | canI : 'update'\">\n" +
    "<a ng-href=\"project/{{project.metadata.name}}/attach-pvc?kind=DeploymentConfig&name={{deploymentConfig.metadata.name}}\" role=\"button\">Add Storage</a>\n" +
    "</li>\n" +
    "<li ng-if=\"!autoscalers.length && ({resource: 'horizontalpodautoscalers', group: 'extensions'} | canI : 'create')\">\n" +
    "\n" +
    "<a ng-href=\"project/{{projectName}}/edit/autoscaler?kind=DeploymentConfig&name={{deploymentConfig.metadata.name}}\" role=\"button\">Add Autoscaler</a>\n" +
    "</li>\n" +
    "<li ng-if=\"autoscalers.length === 1 && ({resource: 'horizontalpodautoscalers', group: 'extensions'} | canI : 'update')\">\n" +
    "\n" +
    "<a ng-href=\"project/{{projectName}}/edit/autoscaler?kind=HorizontalPodAutoscaler&group=extensions&name={{autoscalers[0].metadata.name}}\" role=\"button\">Edit Autoscaler</a>\n" +
    "</li>\n" +
    "<li ng-if=\"'deploymentconfigs' | canI : 'update'\">\n" +
    "<a ng-href=\"project/{{projectName}}/set-limits?kind=DeploymentConfig&name={{deploymentConfig.metadata.name}}\" role=\"button\">Edit Resource Limits</a>\n" +
    "</li>\n" +
    "<li ng-if=\"'deploymentconfigs' | canI : 'update'\">\n" +
    "<a ng-href=\"{{healthCheckURL}}\" role=\"button\">Edit Health Checks</a>\n" +
    "</li>\n" +
    "<li ng-if=\"'deploymentconfigs' | canI : 'update'\">\n" +
    "<a ng-href=\"{{deploymentConfig | editYamlURL}}\" role=\"button\">Edit YAML</a>\n" +
    "</li>\n" +
    "<li class=\"divider\" ng-if=\"'deploymentconfigs' | canI : 'update'\"></li>\n" +
    "<li ng-if=\"'deploymentconfigs' | canI : 'delete'\">\n" +
    "<delete-link kind=\"DeploymentConfig\" resource-name=\"{{deploymentConfig.metadata.name}}\" project-name=\"{{deploymentConfig.metadata.namespace}}\" alerts=\"alerts\" hpa-list=\"autoscalers\">\n" +
    "</delete-link>\n" +
    "</li>\n" +
    "</ul>\n" +
    "</div>\n" +
    "{{deploymentConfigName}}\n" +
    "\n" +
    "<small class=\"meta\" ng-if=\"deploymentConfig\">created <span am-time-ago=\"deploymentConfig.metadata.creationTimestamp\"></span></small>\n" +
    "</h1>\n" +
    "<labels labels=\"deploymentConfig.metadata.labels\" clickable=\"true\" kind=\"deployments\" title-kind=\"deployment configs\" project-name=\"{{deploymentConfig.metadata.namespace}}\" limit=\"3\"></labels>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"middle-content\" persist-tab-state>\n" +
    "<div class=\"container-fluid\">\n" +
    "<div ng-if=\"!loaded\">Loading...</div>\n" +
    "<div class=\"row\" ng-if=\"loaded\">\n" +
    "<div class=\"col-md-12\" ng-class=\"{ 'hide-tabs' : !deploymentConfig }\">\n" +
    "<div ng-if=\"deploymentConfig.spec.paused\" class=\"alert alert-info animate-if\">\n" +
    "<span class=\"pficon pficon-info\" aria-hidden=\"true\"></span>\n" +
    "<strong>{{deploymentConfig.metadata.name}} is paused.</strong>\n" +
    "This will stop any new rollouts or triggers from running until resumed.\n" +
    "<span ng-if=\"!updatingPausedState && ('deploymentconfigs' | canI : 'update')\" class=\"nowrap\">\n" +
    "<a href=\"\" ng-click=\"setPaused(false)\" role=\"button\">Resume Rollouts</a>\n" +
    "</span>\n" +
    "</div>\n" +
    "<uib-tabset>\n" +
    "<uib-tab active=\"selectedTab.history\">\n" +
    "<uib-tab-heading>History</uib-tab-heading>\n" +
    "<div ng-if=\"mostRecent\" class=\"deployment-config-summary\">\n" +
    "\n" +
    "<div class=\"h3\">\n" +
    "<span class=\"latest-status\">\n" +
    "<status-icon status=\"mostRecent | deploymentStatus\"></status-icon>\n" +
    "Deployment\n" +
    "\n" +
    "<a ng-href=\"{{mostRecent | navigateResourceURL}}\"><span ng-if=\"mostRecent | annotation : 'deploymentVersion'\">#{{mostRecent | annotation : 'deploymentVersion'}}</span><span ng-if=\"!(mostRecent | annotation : 'deploymentVersion')\">{{mostRecent.metadata.name}}</span></a>\n" +
    "<span ng-if=\"(mostRecent | deploymentStatus) !== 'Failed'\">is</span>\n" +
    "{{mostRecent | deploymentStatus | lowercase}}.\n" +
    "<a ng-href=\"{{mostRecent | navigateResourceURL}}?tab=logs\">View Log</a>\n" +
    "</span>\n" +
    "\n" +
    "</div>\n" +
    "<div class=\"last-timestamp meta text-muted\">\n" +
    "created <span am-time-ago=\"mostRecent.metadata.creationTimestamp\"></span>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"table-filter-wrapper\">\n" +
    "<project-filter></project-filter>\n" +
    "</div>\n" +
    "<table class=\"table table-bordered table-hover table-mobile\">\n" +
    "<thead>\n" +
    "<tr>\n" +
    "<th>Deployment</th>\n" +
    "<th>Status</th>\n" +
    "<th>Created</th>\n" +
    "<th>Trigger</th>\n" +
    "</tr>\n" +
    "</thead>\n" +
    "<tbody ng-if=\"(deployments | hashSize) == 0\">\n" +
    "<tr><td colspan=\"4\"><em>{{emptyMessage}}</em></td></tr>\n" +
    "</tbody>\n" +
    "<tbody ng-if=\"(deployments | hashSize) > 0\">\n" +
    "<tr ng-repeat=\"deployment in orderedDeployments\">\n" +
    "<td data-title=\"Deployment\">\n" +
    "\n" +
    "<span ng-if=\"deployment | annotation : 'deploymentVersion'\">\n" +
    "<a ng-href=\"{{deployment | navigateResourceURL}}\">#{{deployment | annotation : 'deploymentVersion'}}</a>\n" +
    "<span ng-if=\"deploymentConfig.status.latestVersion == (deployment | annotation : 'deploymentVersion')\">(latest)</span>\n" +
    "</span>\n" +
    "</td>\n" +
    "<td data-title=\"Status\">\n" +
    "<div row class=\"status\">\n" +
    "<status-icon status=\"deployment | deploymentStatus\" disable-animation></status-icon>\n" +
    "<span flex>\n" +
    "{{deployment | deploymentStatus}}<span ng-if=\"(deployment | deploymentStatus) == 'Active' || (deployment | deploymentStatus) == 'Running'\">,\n" +
    "<span ng-if=\"deployment.spec.replicas !== deployment.status.replicas\">{{deployment.status.replicas}}/</span>{{deployment.spec.replicas}} replica<span ng-if=\"deployment.spec.replicas != 1\">s</span></span>\n" +
    "</span>\n" +
    "\n" +
    "</div>\n" +
    "</td>\n" +
    "<td data-title=\"Created\">\n" +
    "<span am-time-ago=\"deployment.metadata.creationTimestamp\"></span>\n" +
    "</td>\n" +
    "<td data-title=\"Trigger\">\n" +
    "<span ng-if=\"!deployment.causes.length\">Unknown</span>\n" +
    "<span ng-if=\"deployment.causes.length\">\n" +
    "<span ng-repeat=\"cause in deployment.causes\">\n" +
    "<span ng-switch=\"cause.type\">\n" +
    "<span ng-switch-when=\"ImageChange\">\n" +
    "<span ng-if=\"cause.imageTrigger.from\">\n" +
    "<abbr title=\"{{cause.imageTrigger.from | imageObjectRef : null : true}}\">Image</abbr> change\n" +
    "</span>\n" +
    "</span>\n" +
    "<span ng-switch-when=\"ConfigChange\">Config change</span>\n" +
    "<span ng-switch-default>{{cause.type}}</span>\n" +
    "</span>\n" +
    "</span>\n" +
    "</span>\n" +
    "</td>\n" +
    "</tr>\n" +
    "</tbody>\n" +
    "</table>\n" +
    "</uib-tab>\n" +
    "<uib-tab active=\"selectedTab.configuration\">\n" +
    "<uib-tab-heading>Configuration</uib-tab-heading>\n" +
    "<div class=\"resource-details\" ng-if=\"deploymentConfig\">\n" +
    "<div class=\"row\">\n" +
    "<div class=\"col-lg-6\">\n" +
    "\n" +
    "<h3 class=\"hidden visible-lg visible-xl\">Details</h3>\n" +
    "<dl class=\"dl-horizontal left\">\n" +
    "<dt>Selectors:</dt>\n" +
    "<dd>\n" +
    "<selector selector=\"deploymentConfig.spec.selector\"></selector>\n" +
    "</dd>\n" +
    "<dt>Replicas:</dt>\n" +
    "<dd>\n" +
    "<replicas spec=\"deploymentConfig.spec.replicas\" disable-scaling=\"autoscalers.length || deploymentInProgress\" scale-fn=\"scale(replicas)\" deployment=\"deploymentConfig\"></replicas>\n" +
    "<span ng-if=\"autoscalers.length\">(autoscaled)</span>\n" +
    "</dd>\n" +
    "<dt ng-if-start=\"deploymentConfig.spec.strategy.type\">Strategy:</dt>\n" +
    "<dd ng-if-end>{{deploymentConfig.spec.strategy.type}}</dd>\n" +
    "<div ng-if=\"deploymentConfig.spec.strategy.rollingParams || deploymentConfig.spec.strategy.recreateParams\">\n" +
    "<dt>Timeout:</dt>\n" +
    "<dd>{{strategyParams.timeoutSeconds}} sec</dd>\n" +
    "<dt ng-if-start=\"deploymentConfig.spec.strategy.rollingParams\">Update Period:</dt>\n" +
    "<dd>{{strategyParams.updatePeriodSeconds}} sec</dd>\n" +
    "<dt>Interval:</dt>\n" +
    "<dd>{{strategyParams.intervalSeconds}} sec</dd>\n" +
    "<dt>Max Unavailable:</dt>\n" +
    "<dd>{{strategyParams.maxUnavailable}}</dd>\n" +
    "<dt>Max Surge:</dt>\n" +
    "<dd ng-if-end>{{strategyParams.maxSurge}}</dd>\n" +
    "</div>\n" +
    "\n" +
    "</dl>\n" +
    "<h3>Template</h3>\n" +
    "<pod-template pod-template=\"deploymentConfig.spec.template\" images-by-docker-reference=\"imagesByDockerReference\" builds=\"builds\" detailed=\"true\" add-health-check-url=\"{{('deploymentconfigs' | canI : 'update') ? healthCheckURL : ''}}\">\n" +
    "</pod-template>\n" +
    "<h3>Volumes</h3>\n" +
    "<p ng-if=\"!deploymentConfig.spec.template.spec.volumes.length && !('deploymentconfigs' | canI : 'update')\">\n" +
    "none\n" +
    "</p>\n" +
    "<volumes volumes=\"deploymentConfig.spec.template.spec.volumes\" namespace=\"project.metadata.name\" can-remove=\"'deploymentconfigs' | canI : 'update'\" remove-fn=\"removeVolume(volume)\">\n" +
    "</volumes>\n" +
    "<p ng-if=\"'deploymentconfigs' | canI : 'update'\">\n" +
    "<a ng-href=\"project/{{project.metadata.name}}/attach-pvc?kind=DeploymentConfig&name={{deploymentConfig.metadata.name}}\">Add Storage</a>\n" +
    "<span class=\"action-divider\" aria-hidden=\"true\">|</span>\n" +
    "<a ng-href=\"project/{{project.metadata.name}}/add-config-volume?kind=DeploymentConfig&name={{deploymentConfig.metadata.name}}\">Add Config Files</a>\n" +
    "</p>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"col-lg-6\">\n" +
    "<h3>Autoscaling</h3>\n" +
    "\n" +
    "<div ng-repeat=\"warning in hpaWarnings\" class=\"alert alert-warning\">\n" +
    "<span class=\"pficon pficon-warning-triangle-o\" aria-hidden=\"true\"></span>\n" +
    "<span class=\"sr-only\">Warning:</span>\n" +
    "{{warning.message}}\n" +
    "\n" +
    "<a ng-href=\"project/{{projectName}}/set-limits?kind=DeploymentConfig&name={{deploymentConfig.metadata.name}}\" ng-if=\"warning.reason === 'NoCPURequest' && ('deploymentconfigs' | canI : 'update')\" role=\"button\">Edit Resource\n" +
    "<span ng-if=\"!('cpu' | isRequestCalculated : project)\">Requests and</span> Limits</a>\n" +
    "</div>\n" +
    "\n" +
    "<div ng-if=\"!autoscalers.length\">\n" +
    "<a ng-if=\"{resource: 'horizontalpodautoscalers', group: 'extensions'} | canI : 'create'\" ng-href=\"project/{{projectName}}/edit/autoscaler?kind=DeploymentConfig&name={{deploymentConfig.metadata.name}}\" role=\"button\">Add Autoscaler</a>\n" +
    "<span ng-if=\"!({resource: 'horizontalpodautoscalers', group: 'extensions'} | canI : 'create')\">Autoscaling is not enabled. There are no autoscalers for this deployment config.</span>\n" +
    "</div>\n" +
    "\n" +
    "<div ng-repeat=\"hpa in autoscalers\">\n" +
    "<hpa hpa=\"hpa\" project=\"project\" show-scale-target=\"false\" alerts=\"alerts\"></hpa>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"col-lg-6\" ng-if=\"deploymentConfig.spec.strategy.type !== 'Custom'\">\n" +
    "<h3>\n" +
    "Hooks\n" +
    "<span class=\"learn-more-inline\">\n" +
    "<a ng-href=\"{{'lifecycle_hooks' | helpLink}}\" target=\"_blank\">Learn More&nbsp;<i class=\"fa fa-external-link\" aria-hidden=\"true\"></i></a>\n" +
    "</span>\n" +
    "</h3>\n" +
    "<div ng-if=\"strategyParams.pre\">\n" +
    "<lifecycle-hook deployment-config=\"deploymentConfig\" type=\"pre\"></lifecycle-hook>\n" +
    "</div>\n" +
    "<div ng-if=\"strategyParams.mid\">\n" +
    "<lifecycle-hook deployment-config=\"deploymentConfig\" type=\"mid\"></lifecycle-hook>\n" +
    "</div>\n" +
    "<div ng-if=\"strategyParams.post\">\n" +
    "<lifecycle-hook deployment-config=\"deploymentConfig\" type=\"post\"></lifecycle-hook>\n" +
    "</div>\n" +
    "<div ng-if=\"!strategyParams.pre && !strategyParams.mid && !strategyParams.post\">\n" +
    "none\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"col-lg-6\">\n" +
    "<h3>Triggers</h3>\n" +
    "<dl class=\"dl-horizontal left\">\n" +
    "<dt>Manual (CLI):\n" +
    "<a href=\"{{'deployment-operations' | helpLink}}\" target=\"_blank\">\n" +
    "<span class=\"learn-more-block\">Learn More&nbsp;<i class=\"fa fa-external-link\" aria-hidden=\"true\"></i></span>\n" +
    "</a>\n" +
    "</dt>\n" +
    "<dd>\n" +
    "<copy-to-clipboard clipboard-text=\"'oc rollout latest dc/' + deploymentConfig.metadata.name + ' -n ' + project.metadata.name\"></copy-to-clipboard>\n" +
    "</dd>\n" +
    "<div ng-repeat=\"trigger in deploymentConfig.spec.triggers\">\n" +
    "<span ng-switch=\"trigger.type\">\n" +
    "<span ng-switch-default>{{trigger.type}}</span>\n" +
    "<span ng-switch-when=\"ImageChange\" ng-if=\"trigger.imageChangeParams.from\">\n" +
    "<dt>New Image For:</dt>\n" +
    "<dd>\n" +
    "{{trigger.imageChangeParams.from | imageObjectRef : deploymentConfig.metadata.namespace}}\n" +
    "<small ng-if=\"!trigger.imageChangeParams.automatic\" class=\"text-muted\">(disabled)</small>\n" +
    "</dd>\n" +
    "</span>\n" +
    "<span ng-switch-when=\"ConfigChange\">\n" +
    "<dt>Change Of:</dt>\n" +
    "<dd>Config</dd>\n" +
    "</span>\n" +
    "</span>\n" +
    "</div>\n" +
    "</dl>\n" +
    "</div>\n" +
    "</div>\n" +
    "<annotations annotations=\"deploymentConfig.metadata.annotations\"></annotations>\n" +
    "</div>\n" +
    "</uib-tab>\n" +
    "<uib-tab heading=\"Environment\" active=\"selectedTab.environment\" ng-if=\"deploymentConfig\">\n" +
    "<uib-tab-heading>Environment</uib-tab-heading>\n" +
    "<ng-form name=\"forms.dcEnvVars\" class=\"mar-bottom-xl block\">\n" +
    "<div ng-repeat=\"container in updatedDeploymentConfig.spec.template.spec.containers\">\n" +
    "<h3>Container {{container.name}} Environment Variables</h3>\n" +
    "<key-value-editor ng-if=\"!('deploymentconfigs' | canI : 'update')\" entries=\"container.env\" key-placeholder=\"Name\" value-placeholder=\"Value\" cannot-add cannot-sort cannot-delete is-readonly show-header></key-value-editor>\n" +
    "<key-value-editor ng-if=\"'deploymentconfigs' | canI : 'update'\" entries=\"container.env\" key-placeholder=\"Name\" value-placeholder=\"Value\" key-validator=\"[A-Za-z_][A-Za-z0-9_]*\" key-validator-error=\"Please enter a valid key\" key-validator-error-tooltip=\"A valid environment variable name is an alphanumeric (a-z and 0-9) string beginning with a letter that may contain underscores.\" add-row-link=\"Add Environment Variable\" show-header></key-value-editor>\n" +
    "</div>\n" +
    "<button class=\"btn btn-default\" ng-if=\"'deploymentconfigs' | canI : 'update'\" ng-click=\"saveEnvVars()\" ng-disabled=\"forms.dcEnvVars.$pristine || forms.dcEnvVars.$invalid\">Save</button>\n" +
    "<a ng-if=\"!forms.dcEnvVars.$pristine\" href=\"\" ng-click=\"clearEnvVarUpdates()\" class=\"mar-left-sm\" style=\"vertical-align: -2px\">Clear Changes</a>\n" +
    "</ng-form>\n" +
    "</uib-tab>\n" +
    "<uib-tab active=\"selectedTab.events\" ng-if=\"'events' | canI : 'watch'\">\n" +
    "<uib-tab-heading>Events</uib-tab-heading>\n" +
    "<events resource-kind=\"DeploymentConfig\" resource-name=\"{{deploymentConfig.metadata.name}}\" project-context=\"projectContext\" ng-if=\"selectedTab.events\"></events>\n" +
    "</uib-tab>\n" +
    "</uib-tabset>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</project-page>"
  );


  $templateCache.put('views/browse/deployment.html',
    "<project-header class=\"top-header\"></project-header>\n" +
    "<project-page>\n" +
    "\n" +
    "<div class=\"middle-section\">\n" +
    "<div class=\"middle-container\">\n" +
    "<div class=\"middle-header\">\n" +
    "<div class=\"container-fluid\">\n" +
    "<breadcrumbs breadcrumbs=\"breadcrumbs\"></breadcrumbs>\n" +
    "<alerts alerts=\"alerts\"></alerts>\n" +
    "<div>\n" +
    "<h1 class=\"contains-actions\">\n" +
    "<div class=\"pull-right dropdown\" ng-if=\"deployment\" ng-hide=\"!('deployments' | canIDoAny)\">\n" +
    "<button type=\"button\" class=\"dropdown-toggle btn btn-default actions-dropdown-btn hidden-xs\" data-toggle=\"dropdown\">\n" +
    "Actions\n" +
    "<span class=\"caret\" aria-hidden=\"true\"></span>\n" +
    "</button>\n" +
    "<a href=\"\" class=\"dropdown-toggle actions-dropdown-kebab visible-xs-inline\" data-toggle=\"dropdown\"><i class=\"fa fa-ellipsis-v\"></i><span class=\"sr-only\">Actions</span></a>\n" +
    "<ul class=\"dropdown-menu actions action-button\">\n" +
    "<li ng-if=\"!deployment.spec.paused && !updatingPausedState && ({ group: 'extensions', resource: 'deployments' } | canI : 'update')\">\n" +
    "<a href=\"\" ng-click=\"setPaused(true)\" role=\"button\">Pause Rollouts</a>\n" +
    "</li>\n" +
    "<li ng-if=\"deployment.spec.paused && !updatingPausedState && ({ group: 'extensions', resource: 'deployments' } | canI : 'update')\">\n" +
    "<a href=\"\" ng-click=\"setPaused(false)\" role=\"button\">Resume Rollouts</a>\n" +
    "</li>\n" +
    "<li class=\"divider\" ng-if=\"!updatingPausedState && ({ group: 'extensions', resource: 'deployments' } | canI : 'update')\"></li>\n" +
    "<li ng-if=\"{ group: 'extensions', resource: 'deployments' } | canI : 'update'\">\n" +
    "<a ng-href=\"project/{{project.metadata.name}}/attach-pvc?kind=Deployment&name={{deployment.metadata.name}}&group=extensions\" role=\"button\">Add Storage</a>\n" +
    "</li>\n" +
    "<li ng-if=\"!autoscalers.length && ({resource: 'horizontalpodautoscalers', group: 'extensions'} | canI : 'create')\">\n" +
    "\n" +
    "<a ng-href=\"project/{{projectName}}/edit/autoscaler?kind=Deployment&name={{deployment.metadata.name}}&group=extensions\" role=\"button\">Add Autoscaler</a>\n" +
    "</li>\n" +
    "<li ng-if=\"autoscalers.length === 1 && ({resource: 'horizontalpodautoscalers', group: 'extensions'} | canI : 'update')\">\n" +
    "\n" +
    "<a ng-href=\"project/{{projectName}}/edit/autoscaler?kind=HorizontalPodAutoscaler&group=extensions&name={{autoscalers[0].metadata.name}}\" role=\"button\">Edit Autoscaler</a>\n" +
    "</li>\n" +
    "<li ng-if=\"{ group: 'extensions', resource: 'deployments' } | canI : 'update'\">\n" +
    "<a ng-href=\"project/{{projectName}}/set-limits?kind=Deployment&name={{deployment.metadata.name}}&group=extensions\" role=\"button\">Edit Resource Limits</a>\n" +
    "</li>\n" +
    "<li ng-if=\"{ group: 'extensions', resource: 'deployments' } | canI : 'update'\">\n" +
    "<a ng-href=\"{{healthCheckURL}}\" role=\"button\">Edit Health Checks</a>\n" +
    "</li>\n" +
    "<li ng-if=\"{ group: 'extensions', resource: 'deployments' } | canI : 'update'\">\n" +
    "<a ng-href=\"{{deployment | editYamlURL}}\" role=\"button\">Edit YAML</a>\n" +
    "</li>\n" +
    "<li class=\"divider\" ng-if=\"{ group: 'extensions', resource: 'deployments' } | canI : 'update'\"></li>\n" +
    "<li ng-if=\"{ group: 'extensions', resource: 'deployments' } | canI : 'delete'\">\n" +
    "<delete-link kind=\"Deployment\" group=\"extensions\" resource-name=\"{{deployment.metadata.name}}\" project-name=\"{{deployment.metadata.namespace}}\" alerts=\"alerts\" hpa-list=\"autoscalers\">\n" +
    "</delete-link>\n" +
    "</li>\n" +
    "</ul>\n" +
    "</div>\n" +
    "{{name}}\n" +
    "<small class=\"meta\" ng-if=\"deployment\">created <span am-time-ago=\"deployment.metadata.creationTimestamp\"></span></small>\n" +
    "</h1>\n" +
    "<labels labels=\"deployment.metadata.labels\" clickable=\"true\" kind=\"deployments\" project-name=\"{{deployment.metadata.namespace}}\" limit=\"3\"></labels>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"middle-content\" persist-tab-state>\n" +
    "<div class=\"container-fluid\">\n" +
    "<div ng-if=\"!loaded\">Loading...</div>\n" +
    "<div class=\"row\" ng-if=\"loaded\">\n" +
    "<div class=\"col-md-12\" ng-class=\"{ 'hide-tabs' : !deployment }\">\n" +
    "<div ng-if=\"deployment.spec.paused\" class=\"alert alert-info animate-if\">\n" +
    "<span class=\"pficon pficon-info\" aria-hidden=\"true\"></span>\n" +
    "<strong>{{deployment.metadata.name}} is paused.</strong>\n" +
    "This pauses any in-progress rollouts and stops new rollouts from running until the deployment is resumed.\n" +
    "<span ng-if=\"!updatingPausedState && ({ group: 'extensions', resource: 'deployments' } | canI : 'update')\" class=\"nowrap\">\n" +
    "<a href=\"\" ng-click=\"setPaused(false)\" role=\"button\">Resume Rollouts</a>\n" +
    "</span>\n" +
    "</div>\n" +
    "<uib-tabset>\n" +
    "<uib-tab active=\"selectedTab.history\">\n" +
    "<uib-tab-heading>History</uib-tab-heading>\n" +
    "<div ng-if=\"replicaSetsForDeployment | hashSize\">\n" +
    "<table class=\"table table-bordered table-hover table-mobile table-layout-fixed\">\n" +
    "<colgroup>\n" +
    "<col class=\"col-sm-2\">\n" +
    "<col class=\"col-sm-4\">\n" +
    "<col class=\"col-sm-3\">\n" +
    "<col class=\"col-sm-3\">\n" +
    "</colgroup>\n" +
    "<thead>\n" +
    "<tr>\n" +
    "<th>Version</th>\n" +
    "<th>Name</th>\n" +
    "<th>Replicas</th>\n" +
    "<th>Created</th>\n" +
    "</tr>\n" +
    "</thead>\n" +
    "<tbody>\n" +
    "<tr ng-repeat=\"replicaSet in replicaSetsForDeployment\">\n" +
    "<td data-title=\"Version\">\n" +
    "#{{replicaSet | annotation : 'deployment.kubernetes.io/revision'}}\n" +
    "</td>\n" +
    "<td data-title=\"Name\">\n" +
    "<a ng-href=\"{{replicaSet | navigateResourceURL}}\">{{replicaSet.metadata.name}}</a>\n" +
    "</td>\n" +
    "<td data-title=\"Replicas\">\n" +
    "<span ng-if=\"replicaSet.status.replicas !== replicaSet.spec.replicas\">{{replicaSet.status.replicas}}/</span>{{replicaSet.spec.replicas}} replica<span ng-if=\"replicaSet.spec.replicas != 1\">s</span>\n" +
    "</td>\n" +
    "<td data-title=\"Created\">\n" +
    "<span am-time-ago=\"replicaSet.metadata.creationTimestamp\"></span>\n" +
    "</td>\n" +
    "</tr>\n" +
    "</tbody>\n" +
    "</table>\n" +
    "</div>\n" +
    "</uib-tab>\n" +
    "<uib-tab active=\"selectedTab.configuration\">\n" +
    "<uib-tab-heading>Configuration</uib-tab-heading>\n" +
    "<div class=\"resource-details\" ng-if=\"deployment\">\n" +
    "<div class=\"row\">\n" +
    "<div class=\"col-lg-6\">\n" +
    "\n" +
    "<h3 class=\"hidden visible-lg visible-xl\">Details</h3>\n" +
    "<dl class=\"dl-horizontal left\">\n" +
    "<dt>Selectors:</dt>\n" +
    "<dd>\n" +
    "<selector selector=\"deployment.spec.selector\"></selector>\n" +
    "</dd>\n" +
    "<dt>Replicas:</dt>\n" +
    "<dd>\n" +
    "<replicas spec=\"deployment.spec.replicas\" disable-scaling=\"inProgressDeployment || autoscalers.length\" scale-fn=\"scale(replicas)\" deployment=\"deployment\"></replicas>\n" +
    "<span ng-if=\"autoscalers.length\">(autoscaled)</span>\n" +
    "<div ng-if=\"deployment.status.updatedReplicas\">\n" +
    "{{deployment.status.updatedReplicas}} up to date\n" +
    "</div>\n" +
    "<div ng-if=\"deployment.status.availableReplicas || deployment.status.unavailableReplicas\">\n" +
    "<span ng-if=\"deployment.status.availableReplicas\">{{deployment.status.availableReplicas}} available<span ng-if=\"deployment.status.unavailableReplicas\">,</span></span>\n" +
    "<span ng-if=\"deployment.status.unavailableReplicas\">{{deployment.status.unavailableReplicas}} unavailable</span>\n" +
    "</div>\n" +
    "</dd>\n" +
    "<dt>Strategy:</dt>\n" +
    "<dd>{{deployment.spec.strategy.type | sentenceCase}}</dd>\n" +
    "<dt ng-if-start=\"deployment.spec.strategy.rollingUpdate\">\n" +
    "Max Unavailable:\n" +
    "<span data-toggle=\"tooltip\" title=\"The maximum number of pods that can be unavailable during the update process.\" class=\"pficon pficon-help text-muted small\"></span>\n" +
    "</dt>\n" +
    "<dd>\n" +
    "<span ng-if=\"deployment.spec.strategy.rollingUpdate.maxUnavailable | isNil\">1</span>\n" +
    "<span ng-if=\"!(deployment.spec.strategy.rollingUpdate.maxUnavailable | isNil)\">\n" +
    "{{deployment.spec.strategy.rollingUpdate.maxUnavailable}}\n" +
    "</span>\n" +
    "</dd>\n" +
    "<dt>\n" +
    "Max Surge:\n" +
    "<span data-toggle=\"tooltip\" title=\"The maximum number of pods that can be created above the desired number of pods.\" class=\"pficon pficon-help text-muted small\"></span>\n" +
    "</dt>\n" +
    "<dd ng-if-end>\n" +
    "<span ng-if=\"deployment.spec.strategy.rollingUpdate.maxSurge | isNil\">1</span>\n" +
    "<span ng-if=\"!(deployment.spec.strategy.rollingUpdate.maxSurge | isNil)\">\n" +
    "{{deployment.spec.strategy.rollingUpdate.maxSurge}}\n" +
    "</span>\n" +
    "</dd>\n" +
    "<dt>\n" +
    "Min Ready:\n" +
    "<span data-toggle=\"tooltip\" title=\"The minimum number of seconds a new pod must be ready before it is considered available.\" class=\"pficon pficon-help text-muted small\"></span>\n" +
    "</dt>\n" +
    "<dd>\n" +
    "{{deployment.spec.minReadySeconds || 0}} sec\n" +
    "</dd>\n" +
    "</dl>\n" +
    "<h3>Template</h3>\n" +
    "<pod-template pod-template=\"deployment.spec.template\" images-by-docker-reference=\"imagesByDockerReference\" builds=\"builds\" detailed=\"true\" add-health-check-url=\"{{ ({ group: 'extensions', resource: 'deployments' } | canI : 'update') ? healthCheckURL : '' }}\">\n" +
    "</pod-template>\n" +
    "</div>\n" +
    "<div class=\"col-lg-6\">\n" +
    "<h3>Volumes</h3>\n" +
    "<p ng-if=\"!deployment.spec.template.spec.volumes.length && !({ group: 'extensions', resource: 'deployments' } | canI : 'update')\">\n" +
    "none\n" +
    "</p>\n" +
    "<volumes volumes=\"deployment.spec.template.spec.volumes\" namespace=\"project.metadata.name\" can-remove=\"{ group: 'extensions', resource: 'deployments' } | canI : 'update'\" remove-fn=\"removeVolume(volume)\">\n" +
    "</volumes>\n" +
    "<div ng-if=\"{ group: 'extensions', resource: 'deployments' } | canI : 'update'\">\n" +
    "<a ng-href=\"project/{{project.metadata.name}}/attach-pvc?kind=Deployment&name={{deployment.metadata.name}}&group=extensions\">Add Storage</a>\n" +
    "<span class=\"action-divider\" aria-hidden=\"true\">|</span>\n" +
    "<a ng-href=\"project/{{project.metadata.name}}/add-config-volume?kind=Deployment&name={{deployment.metadata.name}}&group=extensions\">Add Config Files</a>\n" +
    "</div>\n" +
    "<h3>Autoscaling</h3>\n" +
    "\n" +
    "<div ng-repeat=\"warning in hpaWarnings\" class=\"alert alert-warning\">\n" +
    "<span class=\"pficon pficon-warning-triangle-o\" aria-hidden=\"true\"></span>\n" +
    "<span class=\"sr-only\">Warning:</span>\n" +
    "{{warning.message}}\n" +
    "\n" +
    "<a ng-href=\"project/{{projectName}}/set-limits?kind=Deployment&name={{deployment.metadata.name}}&group=extensions\" ng-if=\"warning.reason === 'NoCPURequest' && ({ group: 'extensions', resource: 'deployments' } | canI : 'update')\" role=\"button\">Edit Resource\n" +
    "<span ng-if=\"!('cpu' | isRequestCalculated : project)\">Requests and</span> Limits</a>\n" +
    "</div>\n" +
    "\n" +
    "<div ng-if=\"!autoscalers.length\">\n" +
    "<a ng-if=\"{resource: 'horizontalpodautoscalers', group: 'extensions'} | canI : 'create'\" ng-href=\"project/{{projectName}}/edit/autoscaler?kind=Deployment&name={{deployment.metadata.name}}&group=extensions\" role=\"button\">Add Autoscaler</a>\n" +
    "<span ng-if=\"!({resource: 'horizontalpodautoscalers', group: 'extensions'} | canI : 'create')\">none</span>\n" +
    "</div>\n" +
    "\n" +
    "<div ng-repeat=\"hpa in autoscalers\">\n" +
    "<hpa hpa=\"hpa\" project=\"project\" show-scale-target=\"false\" alerts=\"alerts\"></hpa>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"mar-top-md\">\n" +
    "<annotations annotations=\"deployment.metadata.annotations\"></annotations>\n" +
    "</div>\n" +
    "</div>\n" +
    "</uib-tab>\n" +
    "<uib-tab heading=\"Environment\" active=\"selectedTab.environment\" ng-if=\"deployment\">\n" +
    "<uib-tab-heading>Environment</uib-tab-heading>\n" +
    "<ng-form name=\"forms.deploymentEnvVars\">\n" +
    "<div ng-repeat=\"container in updatedDeployment.spec.template.spec.containers\">\n" +
    "<h3>Container {{container.name}} Environment Variables</h3>\n" +
    "<key-value-editor ng-if=\"!({ group: 'extensions', resource: 'deployments' } | canI : 'update')\" entries=\"container.env\" key-placeholder=\"Name\" value-placeholder=\"Value\" cannot-add cannot-sort cannot-delete is-readonly show-header></key-value-editor>\n" +
    "<key-value-editor ng-if=\"{ group: 'extensions', resource: 'deployments' } | canI : 'update'\" entries=\"container.env\" key-placeholder=\"Name\" value-placeholder=\"Value\" key-validator=\"[A-Za-z_][A-Za-z0-9_]*\" key-validator-error=\"Please enter a valid key\" key-validator-error-tooltip=\"A valid environment variable name is an alphanumeric (a-z and 0-9) string beginning with a letter that may contain underscores.\" add-row-link=\"Add Environment Variable\" show-header></key-value-editor>\n" +
    "</div>\n" +
    "<button class=\"btn btn-default\" ng-if=\"{ group: 'extensions', resource: 'deployments' } | canI : 'update'\" ng-click=\"saveEnvVars()\" ng-disabled=\"forms.deploymentEnvVars.$pristine || forms.deploymentEnvVars.$invalid\">Save</button>\n" +
    "<a ng-if=\"!forms.deploymentEnvVars.$pristine\" href=\"\" ng-click=\"clearEnvVarUpdates()\" class=\"mar-left-sm\" style=\"vertical-align: -2px\">Clear Changes</a>\n" +
    "</ng-form>\n" +
    "</uib-tab>\n" +
    "<uib-tab active=\"selectedTab.events\" ng-if=\"'events' | canI : 'watch'\">\n" +
    "<uib-tab-heading>Events</uib-tab-heading>\n" +
    "<events resource-kind=\"Deployment\" resource-name=\"{{deployment.metadata.name}}\" project-context=\"projectContext\" ng-if=\"selectedTab.events\"></events>\n" +
    "</uib-tab>\n" +
    "</uib-tabset>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</project-page>"
  );


  $templateCache.put('views/browse/image.html',
    "<project-header class=\"top-header\"></project-header>\n" +
    "<project-page class=\"image\">\n" +
    "\n" +
    "<div class=\"middle-section\">\n" +
    "<div class=\"middle-container\">\n" +
    "<div class=\"middle-header\">\n" +
    "<div class=\"container-fluid\">\n" +
    "<breadcrumbs breadcrumbs=\"breadcrumbs\"></breadcrumbs>\n" +
    "<alerts alerts=\"alerts\"></alerts>\n" +
    "<div ng-if=\"!imageStream\" class=\"mar-top-xl\">Loading...</div>\n" +
    "<div ng-if=\"imageStream\">\n" +
    "<h1>\n" +
    "{{imageStream.metadata.name}}:{{tagName}}\n" +
    "</h1>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"middle-content\" persist-tab-state>\n" +
    "<div class=\"container-fluid\">\n" +
    "<div ng-if=\"imageStream && !image\">Loading...</div>\n" +
    "<div class=\"row\" ng-if=\"image\">\n" +
    "<div class=\"col-md-12\">\n" +
    "<registry-image-pull settings=\"settings\" names=\"[ imageStream.metadata.name + ':' + tagName ]\">\n" +
    "</registry-image-pull>\n" +
    "<uib-tabset>\n" +
    "<uib-tab heading=\"Details\" active=\"selectedTab.body\">\n" +
    "<uib-tab-heading>Details</uib-tab-heading>\n" +
    "<registry-image-body image=\"image\">\n" +
    "</registry-image-body>\n" +
    "<registry-image-meta image=\"image\">\n" +
    "</registry-image-meta>\n" +
    "</uib-tab>\n" +
    "<uib-tab heading=\"Config\" active=\"selectedTab.config\">\n" +
    "<uib-tab-heading>Configuration</uib-tab-heading>\n" +
    "<registry-image-config image=\"image\">\n" +
    "</registry-image-config>\n" +
    "</uib-tab>\n" +
    "<uib-tab heading=\"Layers\" active=\"selectedTab.meta\">\n" +
    "<uib-tab-heading>Layers</uib-tab-heading>\n" +
    "<p ng-if=\"!layers.length\"><em>No layer information is available for this image.</em></p>\n" +
    "<registry-image-layers layers=\"layers\" ng-if=\"layers.length\" class=\"mar-bottom-xl block\">\n" +
    "</registry-image-layers>\n" +
    "</uib-tab>\n" +
    "</uib-tabset>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</project-page>"
  );


  $templateCache.put('views/browse/imagestream.html',
    "<project-header class=\"top-header\"></project-header>\n" +
    "<project-page>\n" +
    "\n" +
    "<div class=\"middle-section\">\n" +
    "<div class=\"middle-container\">\n" +
    "<div class=\"middle-header\">\n" +
    "<div class=\"container-fluid\">\n" +
    "<breadcrumbs breadcrumbs=\"breadcrumbs\"></breadcrumbs>\n" +
    "<alerts alerts=\"alerts\"></alerts>\n" +
    "<div ng-if=\"!imageStream\" class=\"mar-top-xl\">Loading...</div>\n" +
    "<div ng-if=\"imageStream\">\n" +
    "<h1 class=\"contains-actions\">\n" +
    "<div class=\"pull-right dropdown\" ng-hide=\"!('imageStreams' | canIDoAny)\">\n" +
    "<button type=\"button\" class=\"dropdown-toggle btn btn-default actions-dropdown-btn hidden-xs\" data-toggle=\"dropdown\">\n" +
    "Actions\n" +
    "<span class=\"caret\" aria-hidden=\"true\"></span>\n" +
    "</button>\n" +
    "<a href=\"\" class=\"dropdown-toggle actions-dropdown-kebab visible-xs-inline\" data-toggle=\"dropdown\"><i class=\"fa fa-ellipsis-v\"></i><span class=\"sr-only\">Actions</span></a>\n" +
    "<ul class=\"dropdown-menu actions action-button\">\n" +
    "<li ng-if=\"'imagestreams' | canI : 'update'\">\n" +
    "<a ng-href=\"{{imageStream | editYamlURL}}\" role=\"button\">Edit YAML</a>\n" +
    "</li>\n" +
    "<li ng-if=\"'imagestreams' | canI : 'delete'\">\n" +
    "<delete-link kind=\"ImageStream\" resource-name=\"{{imageStream.metadata.name}}\" project-name=\"{{imageStream.metadata.namespace}}\" alerts=\"alerts\">\n" +
    "</delete-link>\n" +
    "</li>\n" +
    "</ul>\n" +
    "</div>\n" +
    "{{imageStream.metadata.name}}\n" +
    "<small class=\"meta\">created <span am-time-ago=\"imageStream.metadata.creationTimestamp\"></span></small>\n" +
    "</h1>\n" +
    "<labels labels=\"imageStream.metadata.labels\" clickable=\"true\" kind=\"images\" project-name=\"{{imageStream.metadata.namespace}}\" limit=\"3\"></labels>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"middle-content\">\n" +
    "<div class=\"container-fluid\">\n" +
    "<div class=\"row\" ng-if=\"imageStream\">\n" +
    "<div class=\"col-md-12\">\n" +
    "<div class=\"resource-details\">\n" +
    "<dl class=\"dl-horizontal left\">\n" +
    "<dt ng-if-start=\"imageStream.spec.dockerImageRepository\">Follows docker repo:</dt>\n" +
    "<dd ng-if-end>{{imageStream.spec.dockerImageRepository}}</dd>\n" +
    "<dt>Docker pull spec:</dt>\n" +
    "<dd>{{imageStream.status.dockerImageRepository}}</dd>\n" +
    "</dl>\n" +
    "<annotations annotations=\"imageStream.metadata.annotations\"></annotations>\n" +
    "</div>\n" +
    "<table class=\"table table-bordered table-hover table-mobile mar-top-xl\">\n" +
    "<thead>\n" +
    "<tr>\n" +
    "<th>Tag</th>\n" +
    "<th>From</th>\n" +
    "<th>Latest Image</th>\n" +
    "<th>Created</th>\n" +
    "<th>Pull Spec</th>\n" +
    "</tr>\n" +
    "</thead>\n" +
    "<tbody ng-if=\"(tagsByName | hashSize) == 0\">\n" +
    "<tr><td colspan=\"5\"><em>{{emptyMessage}}</em></td></tr>\n" +
    "</tbody>\n" +
    "<tbody ng-repeat=\"tag in tagsByName | orderBy : 'name'\">\n" +
    "<tr>\n" +
    "<td data-title=\"Tag\">\n" +
    "<a ng-if=\"tag.status\" ng-href=\"{{imageStream | navigateResourceURL}}/{{tag.name}}\">{{tag.name}}</a>\n" +
    "<span ng-if=\"!tag.status\">{{tag.name}}</span>\n" +
    "</td>\n" +
    "<td data-title=\"From\">\n" +
    "\n" +
    "<span ng-if=\"!tag.spec.from\"><em>pushed</em></span>\n" +
    "<div ng-if=\"tag.spec.from\" ng-attr-title=\"{{tag.spec.from.name}}\" class=\"td-long-string\">\n" +
    "<span ng-if=\"!tag.spec.from._imageStreamName\">\n" +
    "{{tag.spec.from.name}}\n" +
    "</span>\n" +
    "<span ng-if=\"tag.spec.from._imageStreamName\">\n" +
    "<span ng-if=\"tag.spec.from._imageStreamName === imageStream.metadata.name\">{{tag.spec.from._completeName}}</span>\n" +
    "<span ng-if=\"tag.spec.from._imageStreamName !== imageStream.metadata.name\">\n" +
    "<a ng-href=\"{{tag.spec.from._imageStreamName | navigateResourceURL : 'ImageStream' : (tag.spec.from.namespace || imageStream.metadata.namespace)}}\"><span ng-if=\"tag.spec.from.namespace && tag.spec.from.namespace !== imageStream.metadata.namespace\">{{tag.spec.from.namespace}}/</span>{{tag.spec.from._imageStreamName}}</a>{{tag.spec.from._nameConnector}}{{tag.spec.from._idOrTag}}\n" +
    "</span>\n" +
    "</span>\n" +
    "</div>\n" +
    "</td>\n" +
    "<td data-title=\"Latest Image\">\n" +
    "<div ng-if=\"!tag.status\">\n" +
    "<div ng-if=\"imageStream | annotation : 'openshift.io/image.dockerRepositoryCheck'\">\n" +
    "<span class=\"pficon pficon-warning-triangle-o\" style=\"margin-right: 5px\" ng-attr-title=\"{{imageStream | annotation : 'openshift.io/image.dockerRepositoryCheck'}}\"></span>\n" +
    "<span>Unable to resolve</span>\n" +
    "</div>\n" +
    "<div ng-if=\"!(imageStream | annotation : 'openshift.io/image.dockerRepositoryCheck')\">\n" +
    "<span ng-if=\"!tag.spec.from\">Not yet synced</span>\n" +
    "\n" +
    "<span ng-if=\"tag.spec.from\">Unresolved</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"tag.status\">\n" +
    "<span ng-if=\"tag.status.items.length && tag.status.items[0].image\" class=\"nowrap\">\n" +
    "<short-id id=\"{{tag.status.items[0].image | imageName}}\"></short-id>\n" +
    "<a href=\"\" ng-if=\"tag.status.items.length > 1\" ng-click=\"tagShowOlder[tag.name] = !tagShowOlder[tag.name]\" ng-attr-title=\"{{tagShowOlder[tag.name] ? 'Hide Older Images' : 'Show Older Images'}}\"><span class=\"fa fa-clock-o\"></span><span class=\"fa fa-caret-up\" ng-if=\"tagShowOlder[tag.name]\" style=\"margin-left: 3px\"></span></a>\n" +
    "</span>\n" +
    "<span ng-if=\"!tag.status.items.length\"><em>none</em></span>\n" +
    "</div>\n" +
    "</td>\n" +
    "<td data-title=\"Created\">\n" +
    "<span ng-if=\"tag.status.items.length && tag.status.items[0].image\">\n" +
    "<span am-time-ago=\"tag.status.items[0].created\"></span>\n" +
    "</span>\n" +
    "</td>\n" +
    "<td data-title=\"Pull Spec\">\n" +
    "\n" +
    "<div ng-if=\"tag.status.items.length && tag.status.items[0].dockerImageReference\">\n" +
    "<div ng-attr-title=\"{{tag.status.items[0].dockerImageReference}}\" class=\"td-long-string\">\n" +
    "{{tag.status.items[0].dockerImageReference}}\n" +
    "</div>\n" +
    "</div>\n" +
    "</td>\n" +
    "</tr>\n" +
    "<tr ng-repeat=\"item in tag.status.items\" ng-if=\"tagShowOlder[tag.name] && !$first && item.image\">\n" +
    "<td data-title=\"Tag\"><span class=\"hidden-xs\">&nbsp;</span><span class=\"visible-xs\">{{tag.name}}</span></td>\n" +
    "<td class=\"hidden-xs\">&nbsp;</td>\n" +
    "<td data-title=\"Older Image\">\n" +
    "<short-id id=\"{{item.image | imageName}}\"></short-id>\n" +
    "</td>\n" +
    "<td data-title=\"Created\">\n" +
    "<span am-time-ago=\"item.created\"></span>\n" +
    "</td>\n" +
    "<td data-title=\"Pull Spec\">\n" +
    "<div ng-if=\"item.dockerImageReference\" ng-attr-title=\"{{item.dockerImageReference}}\" class=\"td-long-string\">\n" +
    "{{item.dockerImageReference}}\n" +
    "</div>\n" +
    "</td>\n" +
    "</tr>\n" +
    "</tbody>\n" +
    "</table>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</project-page>"
  );


  $templateCache.put('views/browse/persistent-volume-claim.html',
    "<project-header class=\"top-header\"></project-header>\n" +
    "<project-page>\n" +
    "\n" +
    "<div class=\"middle-section\">\n" +
    "<div class=\"middle-container\">\n" +
    "<div class=\"middle-header\">\n" +
    "<div class=\"container-fluid\">\n" +
    "<breadcrumbs breadcrumbs=\"breadcrumbs\"></breadcrumbs>\n" +
    "<alerts alerts=\"alerts\"></alerts>\n" +
    "<div ng-if=\"!loaded\">Loading...</div>\n" +
    "<div ng-if=\"pvc\">\n" +
    "<h1 class=\"contains-actions\">\n" +
    "<div class=\"pull-right dropdown\" ng-hide=\"!('persistentVolumeClaims' | canIDoAny)\">\n" +
    "<button type=\"button\" class=\"dropdown-toggle btn btn-default actions-dropdown-btn hidden-xs\" data-toggle=\"dropdown\">\n" +
    "Actions\n" +
    "<span class=\"caret\" aria-hidden=\"true\"></span>\n" +
    "</button>\n" +
    "<a href=\"\" class=\"dropdown-toggle actions-dropdown-kebab visible-xs-inline\" data-toggle=\"dropdown\"><i class=\"fa fa-ellipsis-v\"></i><span class=\"sr-only\">Actions</span></a>\n" +
    "<ul class=\"dropdown-menu actions action-button\">\n" +
    "<li ng-if=\"!pvc.spec.volumeName\">\n" +
    "<a ng-href=\"{{pvc | editYamlURL}}\" role=\"button\">Edit YAML</a>\n" +
    "</li>\n" +
    "<li>\n" +
    "<delete-link ng-if=\"'persistentvolumeclaims' | canI : 'delete'\" kind=\"PersistentVolumeClaim\" resource-name=\"{{pvc.metadata.name}}\" project-name=\"{{pvc.metadata.namespace}}\" alerts=\"alerts\">\n" +
    "</delete-link>\n" +
    "</li>\n" +
    "</ul>\n" +
    "</div>\n" +
    "{{pvc.metadata.name}}\n" +
    "<small class=\"meta\" ng-if=\"!pvc.spec.volumeName\">\n" +
    "<span ng-if=\"pvc.spec.resources.requests['storage']\">\n" +
    "waiting for {{pvc.spec.resources.requests['storage'] | usageWithUnits: 'storage'}} allocation,\n" +
    "</span>\n" +
    "<span ng-if=\"!pvc.spec.resources.requests['storage']\">waiting for allocation,</span>\n" +
    "</small>\n" +
    "<small class=\"meta\">created <span am-time-ago=\"pvc.metadata.creationTimestamp\"></span></small>\n" +
    "</h1>\n" +
    "<labels labels=\"pvc.metadata.labels\" clickable=\"true\" kind=\"storage\" project-name=\"{{pvc.metadata.namespace}}\" limit=\"3\"></labels>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"middle-content\">\n" +
    "<div class=\"container-fluid\">\n" +
    "<div class=\"row\" ng-if=\"pvc\">\n" +
    "<div class=\"col-md-12\">\n" +
    "<div class=\"resource-details\">\n" +
    "<dl class=\"dl-horizontal left\">\n" +
    "<dt>Status:</dt>\n" +
    "<dd>\n" +
    "<status-icon status=\"pvc.status.phase\" disable-animation></status-icon>\n" +
    "{{pvc.status.phase}}\n" +
    "<span ng-if=\"pvc.spec.volumeName\">to volume <strong>{{pvc.spec.volumeName}}</strong></span>\n" +
    "</dd>\n" +
    "<dt ng-if=\"pvc.spec.volumeName\">Capacity:</dt>\n" +
    "<dd ng-if=\"pvc.spec.volumeName\">\n" +
    "<span ng-if=\"pvc.status.capacity['storage']\">\n" +
    "allocated {{pvc.status.capacity['storage'] | usageWithUnits: 'storage'}}\n" +
    "</span>\n" +
    "<span ng-if=\"!pvc.status.capacity['storage']\">allocated unknown size</span>\n" +
    "</dd>\n" +
    "<dt>Requested Capacity:</dt>\n" +
    "<dd>\n" +
    "<span ng-if=\"pvc.spec.resources.requests['storage']\">\n" +
    "{{pvc.spec.resources.requests['storage'] | usageWithUnits: 'storage'}}\n" +
    "</span>\n" +
    "<span ng-if=\"!pvc.spec.resources.requests['storage']\"><em>none</em></span>\n" +
    "</dd>\n" +
    "<dt>Access Modes:</dt>\n" +
    "<dd>{{pvc.spec.accessModes | accessModes:'long' | join}}</dd>\n" +
    "</dl>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</project-page>"
  );


  $templateCache.put('views/browse/pod.html',
    "<project-header class=\"top-header\"></project-header>\n" +
    "<project-page class=\"pod\">\n" +
    "\n" +
    "<div class=\"middle-section\">\n" +
    "<div class=\"middle-container\">\n" +
    "<div class=\"middle-header\">\n" +
    "<div class=\"container-fluid\">\n" +
    "<breadcrumbs breadcrumbs=\"breadcrumbs\"></breadcrumbs>\n" +
    "<alerts alerts=\"alerts\"></alerts>\n" +
    "<div ng-if=\"!loaded\" class=\"mar-top-xl\">Loading...</div>\n" +
    "<div ng-if=\"pod\">\n" +
    "<h1 class=\"contains-actions\">\n" +
    "<div class=\"pull-right dropdown\" ng-hide=\"!('pods' | canIDoAny)\">\n" +
    "<button type=\"button\" class=\"dropdown-toggle actions-dropdown-btn btn btn-default hidden-xs\" data-toggle=\"dropdown\">\n" +
    "Actions\n" +
    "<span class=\"caret\"></span>\n" +
    "</button>\n" +
    "<a href=\"\" class=\"dropdown-toggle actions-dropdown-kebab visible-xs-inline\" data-toggle=\"dropdown\"><i class=\"fa fa-ellipsis-v\"></i><span class=\"sr-only\">Actions</span></a>\n" +
    "<ul class=\"dropdown-menu actions action-button\">\n" +
    "<li ng-if=\"(pod | annotation:'deploymentConfig') && ('deploymentconfigs' | canI : 'update')\">\n" +
    "<a ng-href=\"project/{{project.metadata.name}}/attach-pvc?kind=DeploymentConfig&name={{pod | annotation:'deploymentConfig'}}\" role=\"button\">Add Storage</a>\n" +
    "</li>\n" +
    "<li ng-if=\"'pods' | canI : 'update'\">\n" +
    "<a ng-href=\"{{pod | editYamlURL}}\" role=\"button\">Edit YAML</a>\n" +
    "</li>\n" +
    "<li ng-if=\"'pods' | canI : 'delete'\">\n" +
    "<delete-link kind=\"Pod\" resource-name=\"{{pod.metadata.name}}\" project-name=\"{{pod.metadata.namespace}}\" alerts=\"alerts\">\n" +
    "</delete-link>\n" +
    "</li>\n" +
    "</ul>\n" +
    "</div>\n" +
    "{{pod.metadata.name}}\n" +
    "<span ng-if=\"pod | isTroubledPod\">\n" +
    "<pod-warnings pod=\"pod\"></pod-warnings>\n" +
    "</span>\n" +
    "<small class=\"meta\">created <span am-time-ago=\"pod.metadata.creationTimestamp\"></span></small>\n" +
    "</h1>\n" +
    "<labels labels=\"pod.metadata.labels\" clickable=\"true\" kind=\"pods\" project-name=\"{{pod.metadata.namespace}}\" limit=\"3\"></labels>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"middle-content\" persist-tab-state>\n" +
    "<div class=\"container-fluid\">\n" +
    "<div class=\"row\" ng-if=\"pod\">\n" +
    "<div class=\"col-md-12\">\n" +
    "<uib-tabset>\n" +
    "<uib-tab heading=\"Details\" active=\"selectedTab.details\">\n" +
    "<uib-tab-heading>Details</uib-tab-heading>\n" +
    "<ng-include src=\" 'views/browse/_pod-details.html' \"></ng-include>\n" +
    "</uib-tab>\n" +
    "<uib-tab heading=\"Environment\" active=\"selectedTab.environment\">\n" +
    "<uib-tab-heading>Environment</uib-tab-heading>\n" +
    "<div ng-repeat=\"container in containersEnv\">\n" +
    "<h3>Container {{container.name}} Environment Variables</h3>\n" +
    "<key-value-editor entries=\"container.env\" is-readonly cannot-add cannot-sort cannot-delete ng-if=\"container.env.length\"></key-value-editor>\n" +
    "<em ng-if=\"!container.env.length\">The container specification has no environment variables set.</em>\n" +
    "</div>\n" +
    "</uib-tab>\n" +
    "<uib-tab ng-if=\"metricsAvailable\" heading=\"Metrics\" active=\"selectedTab.metrics\">\n" +
    "\n" +
    "<pod-metrics ng-if=\"selectedTab.metrics\" pod=\"pod\" alerts=\"alerts\">\n" +
    "</pod-metrics>\n" +
    "</uib-tab>\n" +
    "<uib-tab active=\"selectedTab.logs\" ng-if=\"'pods/log' | canI : 'get'\">\n" +
    "<uib-tab-heading>Logs</uib-tab-heading>\n" +
    "<log-viewer ng-if=\"selectedTab.logs\" follow-affix-top=\"390\" object=\"pod\" context=\"projectContext\" options=\"logOptions\" empty=\"logEmpty\" run=\"logCanRun\">\n" +
    "<span class=\"container-details\">\n" +
    "<label for=\"selectLogContainer\">Container:</label>\n" +
    "<span ng-if=\"pod.spec.containers.length === 1\">\n" +
    "{{pod.spec.containers[0].name}}\n" +
    "</span>\n" +
    "<ui-select ng-init=\"logOptions.container = pod.spec.containers[0].name\" ng-show=\"pod.spec.containers.length > 1\" ng-model=\"logOptions.container\" input-id=\"selectLogContainer\">\n" +
    "<ui-select-match>{{$select.selected.name}}</ui-select-match>\n" +
    "<ui-select-choices repeat=\"container.name as container in pod.spec.containers\">\n" +
    "<div ng-bind-html=\"container.name | highlight : $select.search\"></div>\n" +
    "</ui-select-choices>\n" +
    "</ui-select>\n" +
    "<span class=\"container-state\" ng-if=\"containerStateReason || containerStatusKey\">\n" +
    "<span class=\"dash\">&mdash;</span>\n" +
    "<status-icon status=\"containerStateReason || (containerStatusKey | capitalize)\"></status-icon>\n" +
    "<span>{{containerStateReason || containerStatusKey | sentenceCase}}</span>\n" +
    "</span>\n" +
    "<span ng-if=\"containerStartTime && !logEmpty\">\n" +
    "<span class=\"log-timestamps\">Log from {{containerStartTime | date : 'medium'}} <span ng-if=\"containerEndTime\">to {{containerEndTime | date : 'medium'}}</span></span>\n" +
    "</span>\n" +
    "</span>\n" +
    "</log-viewer>\n" +
    "</uib-tab>\n" +
    "<uib-tab active=\"selectedTab.terminal\" select=\"terminalTabWasSelected = true\" ng-init=\"containers = pod.status.containerStatuses\">\n" +
    "<uib-tab-heading>Terminal</uib-tab-heading>\n" +
    "<div ng-if=\"noContainersYet\" class=\"empty-state-message text-center\">\n" +
    "<h2>\n" +
    "No running containers\n" +
    "</h2>\n" +
    "</div>\n" +
    "<div ng-if=\"!noContainersYet\">\n" +
    "<div class=\"mar-bottom-md mar-top-xl\">\n" +
    "<span class=\"pficon pficon-info\" aria-hidden=\"true\"></span>\n" +
    "When you navigate away from this pod, any open terminal connections will be closed. This will kill any foreground processes you started from the terminal.\n" +
    "</div>\n" +
    "<alerts ng-if=\"selectedTerminalContainer.status === 'disconnected'\" alerts=\"terminalDisconnectAlert\"></alerts>\n" +
    "<div class=\"mar-left-xl mar-bottom-xl\">\n" +
    "<div class=\"row\">\n" +
    "<div class=\"pad-left-none pad-bottom-md col-sm-6 col-lg-4\">\n" +
    "<span ng-if=\"pod.spec.containers.length === 1\">\n" +
    "<label for=\"selectLogContainer\">Container:</label>\n" +
    "{{pod.spec.containers[0].name}}\n" +
    "</span>\n" +
    "<ui-select ng-model=\"selectedTerminalContainer\" on-select=\"onTerminalSelectChange(selectedTerminalContainer)\" ng-if=\"pod.spec.containers.length > 1\" class=\"mar-left-none pad-left-none pad-right-none\">\n" +
    "<ui-select-match class=\"truncate\" placeholder=\"Container Name\">\n" +
    "<span class=\"pad-left-md\">\n" +
    "{{selectedTerminalContainer.containerName}}\n" +
    "</span>\n" +
    "</ui-select-match>\n" +
    "<ui-select-choices repeat=\"term in containerTerminals | filter: $select.search\" ui-disable-choice=\"(term.containerState !== 'running') && !term.isUsed\">\n" +
    "<div row>\n" +
    "<span ng-bind-html=\"term.containerName | highlight: $select.search\">\n" +
    "</span>\n" +
    "<span flex></span>\n" +
    "<span ng-if=\"term.isUsed && (term.containerState === 'running')\" ng-class=\"{'text-muted' : (term.status === 'disconnected')}\">\n" +
    "{{term.status}}\n" +
    "</span>\n" +
    "<span ng-if=\"term.containerState !== 'running'\" ng-class=\"{'text-muted' : !term.isUsed}\">\n" +
    "{{term.containerState}}\n" +
    "</span>\n" +
    "</div>\n" +
    "</ui-select-choices>\n" +
    "</ui-select>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"container-terminal-wrapper\">\n" +
    "<div class=\"row\" ng-repeat=\"term in containerTerminals\">\n" +
    "<div class=\"column\">\n" +
    "<kubernetes-container-terminal prevent=\"!terminalTabWasSelected\" ng-if=\"term.isUsed\" ng-show=\"term.isVisible\" pod=\"pod\" container=\"term.containerName\" status=\"term.status\" rows=\"terminalRows\" cols=\"terminalCols\" autofocus=\"true\" command=\"[&quot;/bin/sh&quot;, &quot;-i&quot;, &quot;-c&quot;, &quot;TERM=xterm /bin/sh&quot;]\">\n" +
    "</kubernetes-container-terminal>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</uib-tab>\n" +
    "<uib-tab active=\"selectedTab.events\" ng-if=\"'events' | canI : 'watch'\">\n" +
    "<uib-tab-heading>Events</uib-tab-heading>\n" +
    "<events resource-kind=\"Pod\" resource-name=\"{{pod.metadata.name}}\" project-context=\"projectContext\" ng-if=\"selectedTab.events\"></events>\n" +
    "</uib-tab>\n" +
    "</uib-tabset>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</project-page>"
  );


  $templateCache.put('views/browse/replica-set.html',
    "<project-header class=\"top-header\"></project-header>\n" +
    "<project-page>\n" +
    "\n" +
    "<div class=\"middle-section\">\n" +
    "<div class=\"middle-container\">\n" +
    "<div class=\"middle-header\">\n" +
    "<div class=\"container-fluid\">\n" +
    "<breadcrumbs breadcrumbs=\"breadcrumbs\"></breadcrumbs>\n" +
    "<alerts alerts=\"alerts\"></alerts>\n" +
    "<div ng-if=\"!loaded\" class=\"mar-top-md\">Loading...</div>\n" +
    "<div ng-if=\"replicaSet\">\n" +
    "<h1 class=\"contains-actions\">\n" +
    "\n" +
    "<ng-include ng-if=\"kind === 'ReplicaSet'\" src=\" 'views/browse/_replica-set-actions.html' \">\n" +
    "</ng-include>\n" +
    "<ng-include ng-if=\"kind === 'ReplicationController'\" src=\" 'views/browse/_replication-controller-actions.html' \">\n" +
    "</ng-include>\n" +
    "{{replicaSet.metadata.name}}\n" +
    "<span ng-if=\"deploymentConfigMissing\" class=\"pficon pficon-warning-triangle-o\" style=\"cursor: help; vertical-align: middle\" data-toggle=\"tooltip\" data-trigger=\"hover\" title=\"The deployment's deployment config is missing.\" aria-hidden=\"true\">\n" +
    "</span>\n" +
    "<span ng-if=\"deploymentConfigMissing\" class=\"sr-only\">Warning: The deployment's deployment config is missing.</span>\n" +
    "<small class=\"meta\">created <span am-time-ago=\"replicaSet.metadata.creationTimestamp\"></span></small>\n" +
    "</h1>\n" +
    "<labels ng-if=\"deploymentConfigName\" labels=\"replicaSet.metadata.labels\" clickable=\"true\" kind=\"deployments\" title-kind=\"deployments for deployment config {{deploymentConfigName}}\" project-name=\"{{replicaSet.metadata.namespace}}\" limit=\"3\" navigate-url=\"{{replicaSet | configURLForResource}}\"></labels>\n" +
    "<labels ng-if=\"!deploymentConfigName\" labels=\"replicaSet.metadata.labels\" clickable=\"true\" kind=\"deployments\" project-name=\"{{replicaSet.metadata.namespace}}\" limit=\"3\"></labels>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"middle-content\" persist-tab-state>\n" +
    "<div class=\"container-fluid\">\n" +
    "<div class=\"row\" ng-if=\"replicaSet\">\n" +
    "<div class=\"col-md-12\">\n" +
    "<uib-tabset>\n" +
    "<uib-tab active=\"selectedTab.details\">\n" +
    "<uib-tab-heading>Details</uib-tab-heading>\n" +
    "<div class=\"resource-details\">\n" +
    "<ng-include src=\" 'views/browse/_replica-set-details.html' \"></ng-include>\n" +
    "</div>\n" +
    "</uib-tab>\n" +
    "<uib-tab heading=\"Environment\" active=\"selectedTab.environment\">\n" +
    "<uib-tab-heading>Environment</uib-tab-heading>\n" +
    "\n" +
    "<div ng-if=\"(replicaSet | hasDeployment) || (replicaSet | hasDeploymentConfig)\">\n" +
    "<p ng-if=\"deployment && ({ group: 'extensions', resource: 'deployments' } | canI : 'update')\">\n" +
    "<span class=\"pficon pficon-info\" aria-hidden=\"true\"></span>\n" +
    "Environment variables can be edited on the <a ng-href=\"{{deployment | navigateResourceURL}}?tab=environment\">deployment</a>.\n" +
    "</p>\n" +
    "<p ng-if=\"(replicaSet | hasDeploymentConfig) && ('deploymentconfigs' | canI : 'update')\">\n" +
    "<span class=\"pficon pficon-info\" aria-hidden=\"true\"></span>\n" +
    "Environment variables can be edited on the <a ng-href=\"{{replicaSet | configURLForResource}}?tab=environment\">deployment configuration</a>.\n" +
    "</p>\n" +
    "<div ng-repeat=\"container in updatedReplicaSet.spec.template.spec.containers\">\n" +
    "<h3>Container {{container.name}} Environment Variables</h3>\n" +
    "<key-value-editor ng-if=\"container.env.length\" entries=\"container.env\" key-placeholder=\"Name\" value-placeholder=\"Value\" cannot-add cannot-delete cannot-sort is-readonly show-header></key-value-editor>\n" +
    "<em ng-if=\"!container.env.length\">The container specification has no environment variables set.</em>\n" +
    "</div>\n" +
    "</div>\n" +
    "<ng-form ng-if=\"!(replicaSet | hasDeployment) && !(replicaSet | hasDeploymentConfig)\" name=\"forms.envForm\">\n" +
    "<div ng-repeat=\"container in updatedReplicaSet.spec.template.spec.containers\">\n" +
    "<div ng-if=\"resource | canI : 'update'\">\n" +
    "<key-value-editor entries=\"container.env\" key-placeholder=\"Name\" value-placeholder=\"Value\" key-validator=\"[A-Za-z_][A-Za-z0-9_]*\" key-validator-error=\"Please enter a valid key\" key-validator-error-tooltip=\"A valid environment variable name is an alphanumeric (a-z and 0-9) string beginning with a letter that may contain underscores.\" add-row-link=\"Add Environment Variable\" show-header></key-value-editor>\n" +
    "<button class=\"btn btn-default\" ng-click=\"saveEnvVars()\" ng-disabled=\"forms.envForm.$pristine || forms.envForm.$invalid\">Save</button>\n" +
    "<a ng-if=\"!forms.envForm.$pristine\" href=\"\" ng-click=\"clearEnvVarUpdates()\" class=\"mar-left-sm\" style=\"vertical-align: -2px\">Clear changes</a>\n" +
    "</div>\n" +
    "<div ng-if=\"!(resource | canI : 'update')\">\n" +
    "<key-value-editor ng-if=\"container.env.length\" entries=\"container.env\" key-placeholder=\"Name\" value-placeholder=\"Value\" cannot-add cannot-delete cannot-sort is-readonly show-header></key-value-editor>\n" +
    "<em ng-if=\"!container.env.length\">The container specification has no environment variables set.</em>\n" +
    "</div>\n" +
    "</div>\n" +
    "</ng-form>\n" +
    "</uib-tab>\n" +
    "<uib-tab ng-if=\"metricsAvailable\" heading=\"Metrics\" active=\"selectedTab.metrics\">\n" +
    "\n" +
    "<deployment-metrics ng-if=\"selectedTab.metrics && podsForDeployment\" pods=\"podsForDeployment\" containers=\"replicaSet.spec.template.spec.containers\" alerts=\"alerts\">\n" +
    "</deployment-metrics>\n" +
    "</uib-tab>\n" +
    "<uib-tab ng-if=\"deploymentConfigName && logOptions.version && ('deploymentconfigs/log' | canI : 'get')\" active=\"selectedTab.logs\">\n" +
    "<uib-tab-heading>Logs</uib-tab-heading>\n" +
    "<log-viewer ng-if=\"selectedTab.logs\" follow-affix-top=\"390\" object=\"replicaSet\" context=\"projectContext\" options=\"logOptions\" empty=\"logEmpty\" run=\"logCanRun\">\n" +
    "<span ng-if=\"replicaSet | deploymentStatus\">\n" +
    "<label>Status:</label>\n" +
    "<status-icon status=\"replicaSet | deploymentStatus\"></status-icon>\n" +
    "{{replicaSet | deploymentStatus}}\n" +
    "</span>\n" +
    "</log-viewer>\n" +
    "</uib-tab>\n" +
    "<uib-tab active=\"selectedTab.events\" ng-if=\"'events' | canI : 'watch'\">\n" +
    "<uib-tab-heading>Events</uib-tab-heading>\n" +
    "<events resource-kind=\"{{kind}}\" resource-name=\"{{replicaSet.metadata.name}}\" project-context=\"projectContext\" ng-if=\"selectedTab.events\"></events>\n" +
    "</uib-tab>\n" +
    "</uib-tabset>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</project-page>"
  );


  $templateCache.put('views/browse/route.html',
    "<project-header class=\"top-header\"></project-header>\n" +
    "<project-page>\n" +
    "\n" +
    "<div class=\"middle-section\">\n" +
    "<div class=\"middle-container\">\n" +
    "<div class=\"middle-header\">\n" +
    "<div class=\"container-fluid\">\n" +
    "<breadcrumbs breadcrumbs=\"breadcrumbs\"></breadcrumbs>\n" +
    "<alerts alerts=\"alerts\"></alerts>\n" +
    "<div ng-if=\"!loaded\" class=\"mar-top-xl\">Loading...</div>\n" +
    "<div ng-if=\"route\">\n" +
    "<h1 class=\"contains-actions\">\n" +
    "<div class=\"pull-right dropdown\" ng-hide=\"!('routes' | canIDoAny)\">\n" +
    "<button type=\"button\" class=\"dropdown-toggle btn btn-default actions-dropdown-btn hidden-xs\" data-toggle=\"dropdown\">\n" +
    "Actions\n" +
    "<span class=\"caret\" aria-hidden=\"true\"></span>\n" +
    "</button>\n" +
    "<a href=\"\" class=\"dropdown-toggle actions-dropdown-kebab visible-xs-inline\" data-toggle=\"dropdown\"><i class=\"fa fa-ellipsis-v\"></i><span class=\"sr-only\">Actions</span></a>\n" +
    "<ul class=\"dropdown-menu actions action-button\">\n" +
    "<li ng-if=\"'routes' | canI : 'update'\">\n" +
    "<a ng-href=\"{{route | editResourceURL}}\" role=\"button\">Edit</a>\n" +
    "</li>\n" +
    "<li ng-if=\"'routes' | canI : 'update'\">\n" +
    "<a ng-href=\"{{route | editYamlURL}}\" role=\"button\">Edit YAML</a>\n" +
    "</li>\n" +
    "<li ng-if=\"'routes' | canI : 'delete'\">\n" +
    "<delete-link kind=\"Route\" resource-name=\"{{route.metadata.name}}\" project-name=\"{{route.metadata.namespace}}\" alerts=\"alerts\">\n" +
    "</delete-link>\n" +
    "</li>\n" +
    "</ul>\n" +
    "</div>\n" +
    "{{route.metadata.name}}\n" +
    "<route-warnings ng-if=\"route.spec.to.kind !== 'Service' || services\" route=\"route\" service=\"services[route.spec.to.name]\">\n" +
    "</route-warnings>\n" +
    "<small class=\"meta\">created <span am-time-ago=\"route.metadata.creationTimestamp\"></span></small>\n" +
    "</h1>\n" +
    "<labels labels=\"route.metadata.labels\" clickable=\"true\" kind=\"routes\" project-name=\"{{route.metadata.namespace}}\" limit=\"3\"></labels>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"middle-content\">\n" +
    "<div class=\"container-fluid\">\n" +
    "<div class=\"row\" ng-if=\"route\">\n" +
    "<div class=\"col-sm-12\">\n" +
    "<div class=\"resource-details\">\n" +
    "<div ng-if=\"!route.status.ingress\" class=\"route-status\">\n" +
    "<span class=\"h3\">\n" +
    "{{route | routeLabel : null : true}}\n" +
    "</span>\n" +
    "<div class=\"meta\">\n" +
    "<status-icon status=\"'Pending'\"></status-icon>\n" +
    "The route is not accepting traffic yet because it has not been admitted by a router.\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-repeat=\"ingress in route.status.ingress\" ng-init=\"admittedCondition = (ingress | routeIngressCondition : 'Admitted')\" class=\"route-status\">\n" +
    "<div class=\"h3\">\n" +
    "<span ng-if=\"(route | isWebRoute)\">\n" +
    "<a ng-href=\"{{route | routeWebURL : ingress.host}}\" target=\"_blank\">{{route | routeLabel : ingress.host : true}}</a>\n" +
    "</span>\n" +
    "<span ng-if=\"!(route | isWebRoute)\">\n" +
    "{{route | routeLabel : ingress.host}}\n" +
    "</span>\n" +
    "</div>\n" +
    "<div class=\"meta\">\n" +
    "<span ng-if=\"!admittedCondition\">Admission status unknown for router '{{ingress.routerName}}'</span>\n" +
    "<span ng-if=\"admittedCondition.status === 'True'\">\n" +
    "<status-icon status=\"'Succeeded'\"></status-icon>\n" +
    "Exposed on router '{{ingress.routerName}}' <span am-time-ago=\"admittedCondition.lastTransitionTime\"></span>\n" +
    "</span>\n" +
    "<span ng-if=\"admittedCondition.status === 'False'\">\n" +
    "<status-icon status=\"'Error'\"></status-icon>\n" +
    "Rejected by router '{{ingress.routerName}}' <span am-time-ago=\"admittedCondition.lastTransitionTime\"></span>\n" +
    "</span>\n" +
    "</div>\n" +
    "<div ng-if=\"showRouterHostnameAlert(ingress, admittedCondition)\" class=\"mar-top-lg\">\n" +
    "<div class=\"alert alert-info\">\n" +
    "<span class=\"pficon pficon-info\" aria-hidden=\"true\"></span>\n" +
    "<span class=\"mar-right-sm\">\n" +
    "The DNS admin should set up a CNAME from the route's hostname, {{ingress.host}}, to the router's canonical hostname, {{ingress.routerCanonicalHostname}}.\n" +
    "</span>\n" +
    "<a href=\"\" ng-click=\"hideRouterHostnameAlert(ingress)\" role=\"button\" class=\"nowrap\">Don't Show Me Again</a>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<h4 class=\"mar-top-xl\">Details</h4>\n" +
    "<dl class=\"dl-horizontal left\">\n" +
    "<dt ng-if-start=\"route.spec.wildcardPolicy && route.spec.wildcardPolicy !== 'None' && route.spec.wildcardPolicy !== 'Subdomain'\">Wildcard Policy:</dt>\n" +
    "<dd ng-if-end>{{route.spec.wildcardPolicy}}</dd>\n" +
    "<dt>Path:</dt>\n" +
    "<dd>\n" +
    "<span ng-if=\"route.spec.path\">{{route.spec.path}}</span>\n" +
    "<span ng-if=\"!route.spec.path\"><em>none</em></span>\n" +
    "</dd>\n" +
    "<dt>{{route.spec.to.kind || \"Routes To\"}}:</dt>\n" +
    "<dd>\n" +
    "<a ng-href=\"{{route.spec.to.name | navigateResourceURL : route.spec.to.kind : route.metadata.namespace}}\">{{route.spec.to.name}}</a>\n" +
    "</dd>\n" +
    "<dt>Target Port:</dt>\n" +
    "<dd>\n" +
    "<span ng-if=\"route.spec.port.targetPort\">\n" +
    "{{route.spec.port.targetPort}}\n" +
    "</span>\n" +
    "<span ng-if=\"!route.spec.port.targetPort\"><em>any</em></span>\n" +
    "</dd>\n" +
    "<div ng-if=\"route.spec.port.targetPort && route.spec.to.kind === 'Service' && (route | routeTargetPortMapping : services[route.spec.to.name])\" class=\"help-block\">\n" +
    "This target port will route to {{route | routeTargetPortMapping : services[route.spec.to.name]}}.\n" +
    "</div>\n" +
    "</dl>\n" +
    "<div ng-if=\"route.spec.alternateBackends.length\" class=\"row\">\n" +
    "<div class=\"col-sm-12 mar-bottom-lg\">\n" +
    "<h4>Traffic</h4>\n" +
    "<div class=\"help-block\">\n" +
    "This route splits traffic across multiple services.\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"col-sm-5 col-sm-push-7 mar-bottom-lg\">\n" +
    "<route-service-pie route=\"route\"></route-service-pie>\n" +
    "</div>\n" +
    "<div class=\"col-sm-7 col-sm-pull-5\">\n" +
    "<table class=\"table table-bordered\">\n" +
    "<thead>\n" +
    "<tr>\n" +
    "<th>Service</th>\n" +
    "<th>Weight</th>\n" +
    "</tr>\n" +
    "</thead>\n" +
    "<tbody>\n" +
    "<tr>\n" +
    "<td>\n" +
    "<a ng-href=\"{{route.spec.to.name | navigateResourceURL : route.spec.to.kind : route.metadata.namespace}}\">{{route.spec.to.name}}</a>\n" +
    "</td>\n" +
    "<td>\n" +
    "{{route.spec.to.weight}}\n" +
    "</td>\n" +
    "</tr>\n" +
    "<tr ng-repeat=\"alternate in route.spec.alternateBackends\">\n" +
    "<td>\n" +
    "<a ng-href=\"{{alternate.name | navigateResourceURL : alternate.kind : route.metadata.namespace}}\">{{alternate.name}}</a>\n" +
    "</td>\n" +
    "<td>\n" +
    "{{alternate.weight}}\n" +
    "</td>\n" +
    "</tr>\n" +
    "</tbody>\n" +
    "</table>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div style=\"margin-bottom: 10px\">\n" +
    "<h4>TLS Settings</h4>\n" +
    "<dl class=\"dl-horizontal left\" ng-if=\"route.spec.tls\">\n" +
    "<dt>Termination Type:</dt>\n" +
    "<dd>{{route.spec.tls.termination | humanizeTLSTermination}}</dd>\n" +
    "<dt>Insecure Traffic:</dt>\n" +
    "<dd>{{route.spec.tls.insecureEdgeTerminationPolicy || 'None'}}</dd>\n" +
    "<dt>Certificate:</dt>\n" +
    "<dd>\n" +
    "<span ng-show=\"route.spec.tls.certificate && !reveal.certificate\">\n" +
    "<a href=\"\" ng-click=\"reveal.certificate = true\">Show</a>\n" +
    "</span>\n" +
    "<span ng-if=\"!route.spec.tls.certificate\"><em>none</em></span>\n" +
    "</dd>\n" +
    "<div ng-if=\"reveal.certificate\">\n" +
    "<pre class=\"clipped\">{{route.spec.tls.certificate}}</pre>\n" +
    "</div>\n" +
    "<dt>Key:</dt>\n" +
    "<dd>\n" +
    "<span ng-if=\"route.spec.tls.key && !reveal.key\">\n" +
    "<a href=\"\" ng-click=\"reveal.key = true\">Show</a>\n" +
    "</span>\n" +
    "<span ng-if=\"!route.spec.tls.key\"><em>none</em></span>\n" +
    "</dd>\n" +
    "<div ng-if=\"reveal.key\">\n" +
    "<pre class=\"clipped\">{{route.spec.tls.key}}</pre>\n" +
    "</div>\n" +
    "<dt>CA Certificate:</dt>\n" +
    "<dd>\n" +
    "<span ng-show=\"route.spec.tls.caCertificate && !reveal.caCertificate\">\n" +
    "<a href=\"\" ng-click=\"reveal.caCertificate = true\">Show</a>\n" +
    "</span>\n" +
    "<span ng-if=\"!route.spec.tls.caCertificate\"><em>none</em></span>\n" +
    "</dd>\n" +
    "<div ng-if=\"reveal.caCertificate\">\n" +
    "<pre class=\"clipped\">{{route.spec.tls.caCertificate}}</pre>\n" +
    "</div>\n" +
    "<dt>Destination CA Cert:</dt>\n" +
    "<dd>\n" +
    "<span ng-show=\"route.spec.tls.destinationCACertificate && !reveal.destinationCACertificate\">\n" +
    "<a href=\"\" ng-click=\"reveal.destinationCACertificate = true\">Show</a>\n" +
    "</span>\n" +
    "<span ng-if=\"!route.spec.tls.destinationCACertificate\"><em>none</em></span>\n" +
    "</dd>\n" +
    "<div ng-if=\"reveal.destinationCACertificate\">\n" +
    "<pre class=\"clipped\">{{route.spec.tls.destinationCACertificate}}</pre>\n" +
    "</div>\n" +
    "</dl>\n" +
    "<div ng-if=\"!route.spec.tls\"><em>TLS is not enabled for this route</em></div>\n" +
    "</div>\n" +
    "<annotations annotations=\"route.metadata.annotations\"></annotations>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</project-page>"
  );


  $templateCache.put('views/browse/routes.html',
    "<project-header class=\"top-header\"></project-header>\n" +
    "<project-page>\n" +
    "\n" +
    "<div class=\"middle-section\">\n" +
    "<div class=\"middle-container\">\n" +
    "<div class=\"middle-header header-toolbar\">\n" +
    "<div class=\"container-fluid\">\n" +
    "<div class=\"page-header page-header-bleed-right page-header-bleed-left\">\n" +
    "<div class=\"pull-right\" ng-if=\"project && ('routes' | canI : 'create')\">\n" +
    "<a ng-href=\"project/{{project.metadata.name}}/create-route\" class=\"btn btn-default\">Create Route</a>\n" +
    "</div>\n" +
    "<h1>\n" +
    "Routes\n" +
    "<span class=\"page-header-link\">\n" +
    "<a ng-href=\"{{'routes' | helpLink}}\" target=\"_blank\">\n" +
    "Learn More <i class=\"fa fa-external-link\" aria-hidden=\"true\"></i>\n" +
    "</a>\n" +
    "</span>\n" +
    "</h1>\n" +
    "</div>\n" +
    "<div ng-if=\"!renderOptions.showGetStarted\" class=\"data-toolbar\">\n" +
    "<div class=\"data-toolbar-filter\">\n" +
    "<project-filter></project-filter>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"middle-content\">\n" +
    "<div class=\"container-fluid\">\n" +
    "<alerts alerts=\"alerts\"></alerts>\n" +
    "<div class=\"row\">\n" +
    "<div class=\"col-md-12\">\n" +
    "<table class=\"table table-bordered table-hover table-mobile table-layout-fixed\">\n" +
    "<colgroup>\n" +
    "<col class=\"col-sm-3\">\n" +
    "<col class=\"col-sm-3\">\n" +
    "<col class=\"col-sm-2\">\n" +
    "<col class=\"col-sm-2\">\n" +
    "<col class=\"col-sm-2\">\n" +
    "</colgroup>\n" +
    "<thead>\n" +
    "<tr>\n" +
    "<th>{{customNameHeader || 'Name'}}</th>\n" +
    "<th>Hostname</th>\n" +
    "<th>Routes To</th>\n" +
    "<th>Target Port</th>\n" +
    "<th>TLS Termination</th>\n" +
    "</tr>\n" +
    "</thead>\n" +
    "<tbody ng-if=\"(routes | hashSize) == 0\">\n" +
    "<tr><td colspan=\"5\"><em>{{emptyMessage || 'No routes to show'}}</em></td></tr>\n" +
    "</tbody>\n" +
    "<tbody ng-if=\"(routes | hashSize) > 0\">\n" +
    "<tr ng-repeat=\"route in routes | orderObjectsByDate : true\">\n" +
    "<td data-title=\"{{ customNameHeader || 'Name' }}\">\n" +
    "<a href=\"{{route | navigateResourceURL}}\">{{route.metadata.name}}</a>\n" +
    "<route-warnings ng-if=\"route.spec.to.kind !== 'Service' || services\" route=\"route\" service=\"services[route.spec.to.name]\">\n" +
    "</route-warnings>\n" +
    "</td>\n" +
    "<td data-title=\"Hostname\">\n" +
    "<span ng-if=\"(route | isWebRoute)\">\n" +
    "<a href=\"{{route | routeWebURL}}\" target=\"_blank\">{{route | routeLabel}}</a>\n" +
    "</span>\n" +
    "<span ng-if=\"!(route | isWebRoute)\">\n" +
    "{{route | routeLabel}}\n" +
    "</span>\n" +
    "<span ng-if=\"!route.status.ingress\" data-toggle=\"popover\" data-trigger=\"hover\" data-content=\"The route is not accepting traffic yet because it has not been admitted by a router.\" style=\"cursor: help; padding-left: 5px\">\n" +
    "<status-icon status=\"'Pending'\"></status-icon>\n" +
    "<span class=\"sr-only\">Pending</span>\n" +
    "</span>\n" +
    "</td>\n" +
    "<td data-title=\"Routes To\">\n" +
    "<span ng-if=\"route.spec.to.kind !== 'Service'\">{{route.spec.to.kind}}: {{route.spec.to.name}}</span>\n" +
    "<span ng-if=\"route.spec.to.kind === 'Service'\"><a ng-href=\"{{route.spec.to.name | navigateResourceURL : 'Service': route.metadata.namespace}}\">{{route.spec.to.name}}</a></span>\n" +
    "</td>\n" +
    "\n" +
    "<td data-title=\"Target Port\">\n" +
    "<span ng-if=\"route.spec.port.targetPort\">\n" +
    "<span ng-if=\"route.spec.to.kind !== 'Service'\">{{route.spec.port.targetPort}}</span>\n" +
    "\n" +
    "<span ng-if=\"route.spec.to.kind === 'Service'\" ng-attr-title=\"{{route | routeTargetPortMapping : services[route.spec.to.name]}}\">\n" +
    "{{route.spec.port.targetPort}}\n" +
    "</span>\n" +
    "</span>\n" +
    "<span ng-if=\"!route.spec.port.targetPort\">&nbsp;</span>\n" +
    "</td>\n" +
    "\n" +
    "<td data-title=\"Termination\">\n" +
    "{{route.spec.tls.termination | humanizeTLSTermination}}\n" +
    "<span ng-if=\"!route.spec.tls.termination\">&nbsp;</span>\n" +
    "</td>\n" +
    "</tr>\n" +
    "</tbody>\n" +
    "</table>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</project-page>"
  );


  $templateCache.put('views/browse/secret.html',
    "<project-header class=\"top-header\"></project-header>\n" +
    "<project-page>\n" +
    "\n" +
    "<div class=\"middle-section\">\n" +
    "<div class=\"middle-container\">\n" +
    "<div class=\"middle-header\">\n" +
    "<div class=\"container-fluid\">\n" +
    "<breadcrumbs breadcrumbs=\"breadcrumbs\"></breadcrumbs>\n" +
    "<alerts alerts=\"alerts\"></alerts>\n" +
    "<div ng-if=\"!loaded\" class=\"mar-top-xl\">Loading...</div>\n" +
    "<div ng-if=\"loaded\">\n" +
    "<h1 class=\"contains-actions\">\n" +
    "<div class=\"pull-right dropdown\" ng-hide=\"!('secrets' | canIDoAny)\">\n" +
    "<button type=\"button\" class=\"dropdown-toggle btn btn-default actions-dropdown-btn hidden-xs\" data-toggle=\"dropdown\">\n" +
    "Actions\n" +
    "<span class=\"caret\"></span>\n" +
    "</button>\n" +
    "<a href=\"\" class=\"dropdown-toggle actions-dropdown-kebab visible-xs-inline\" data-toggle=\"dropdown\"><i class=\"fa fa-ellipsis-v\"></i><span class=\"sr-only\">Actions</span></a>\n" +
    "<ul class=\"dropdown-menu actions action-link\">\n" +
    "<li ng-if=\"'secrets' | canI : 'update'\">\n" +
    "<a ng-href=\"{{secret | editYamlURL}}\" role=\"button\">Edit YAML</a>\n" +
    "</li>\n" +
    "<li ng-if=\"'secrets' | canI : 'delete'\">\n" +
    "<delete-link kind=\"Secret\" resource-name=\"{{secret.metadata.name}}\" project-name=\"{{secret.metadata.namespace}}\" alerts=\"alerts\">\n" +
    "</delete-link>\n" +
    "</li>\n" +
    "</ul>\n" +
    "</div>\n" +
    "{{secret.metadata.name}}\n" +
    "<small class=\"meta\">created <span am-time-ago=\"secret.metadata.creationTimestamp\"></span></small>\n" +
    "</h1>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"middle-content\">\n" +
    "<div class=\"container-fluid\">\n" +
    "<div ng-if=\"secret\" class=\"row\">\n" +
    "<div class=\"col-sm-12\">\n" +
    "<div class=\"resource-details\">\n" +
    "<h2 class=\"mar-top-none\">\n" +
    "{{secret.type}}\n" +
    "<small class=\"mar-left-sm\"><a href=\"\" ng-click=\"view.showSecret = !view.showSecret\">{{view.showSecret ? \"Hide\" : \"Reveal\"}} Secret</a></small>\n" +
    "</h2>\n" +
    "<dl class=\"secret-data left\">\n" +
    "<div ng-repeat=\"(secretDataName, secretData) in decodedSecretData\" class=\"image-source-item\">\n" +
    "<div ng-switch=\"secretDataName\">\n" +
    "<div ng-switch-when=\".dockercfg\">\n" +
    "<ng-include src=\" 'views/_config-file-params.html' \"></ng-include>\n" +
    "</div>\n" +
    "<div ng-switch-when=\".dockerconfigjson\">\n" +
    "<ng-include src=\" 'views/_config-file-params.html' \"></ng-include>\n" +
    "</div>\n" +
    "<div ng-switch-default>\n" +
    "<dt ng-attr-title=\"{{secretDataName}}\">{{secretDataName}}</dt>\n" +
    "<dd ng-if=\"view.showSecret\">\n" +
    "<copy-to-clipboard clipboard-text=\"secretData\" multiline=\"secretData | isMultiline : true\" display-wide=\"true\">\n" +
    "</copy-to-clipboard>\n" +
    "<div ng-if=\"decodedSecretData.$$nonprintable[secretDataName]\" class=\"help-block\">\n" +
    "This secret value contains non-printable characters and is displayed as a Base64-encoded string.\n" +
    "</div>\n" +
    "</dd>\n" +
    "<dd ng-if=\"!view.showSecret\">*****</dd>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</dl>\n" +
    "<annotations annotations=\"secret.metadata.annotations\"></annotations>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</project-page>"
  );


  $templateCache.put('views/browse/service.html',
    "<project-header class=\"top-header\"></project-header>\n" +
    "<project-page>\n" +
    "\n" +
    "<div class=\"middle-section\">\n" +
    "<div class=\"middle-container\">\n" +
    "<div class=\"middle-header\">\n" +
    "<div class=\"container-fluid\">\n" +
    "<breadcrumbs breadcrumbs=\"breadcrumbs\"></breadcrumbs>\n" +
    "<alerts alerts=\"alerts\"></alerts>\n" +
    "<div ng-if=\"!loaded\" class=\"mar-top-xl\">Loading...</div>\n" +
    "<div ng-if=\"service\">\n" +
    "<h1 class=\"contains-actions\">\n" +
    "<div class=\"pull-right dropdown\" ng-hide=\"!('services' | canIDoAny)\">\n" +
    "<button type=\"button\" class=\"dropdown-toggle btn btn-default actions-dropdown-btn hidden-xs\" data-toggle=\"dropdown\">\n" +
    "Actions\n" +
    "<span class=\"caret\"></span>\n" +
    "</button>\n" +
    "<a href=\"\" class=\"dropdown-toggle actions-dropdown-kebab visible-xs-inline\" data-toggle=\"dropdown\"><i class=\"fa fa-ellipsis-v\"></i><span class=\"sr-only\">Actions</span></a>\n" +
    "<ul class=\"dropdown-menu actions action-link\">\n" +
    "<li ng-if=\"'routes' | canI : 'create'\">\n" +
    "<a ng-href=\"project/{{project.metadata.name}}/create-route?service={{service.metadata.name}}\" role=\"button\">Create Route</a>\n" +
    "</li>\n" +
    "<li ng-if=\"'services' | canI : 'update'\">\n" +
    "<a ng-href=\"{{service | editYamlURL}}\" role=\"button\">Edit YAML</a>\n" +
    "</li>\n" +
    "<li ng-if=\"'services' | canI : 'delete'\">\n" +
    "<delete-link kind=\"Service\" resource-name=\"{{service.metadata.name}}\" project-name=\"{{service.metadata.namespace}}\" alerts=\"alerts\">\n" +
    "</delete-link>\n" +
    "</li>\n" +
    "</ul>\n" +
    "</div>\n" +
    "{{service.metadata.name}}\n" +
    "<small class=\"meta\">created <span am-time-ago=\"service.metadata.creationTimestamp\"></span></small>\n" +
    "</h1>\n" +
    "<labels labels=\"service.metadata.labels\" clickable=\"true\" kind=\"services\" project-name=\"{{service.metadata.namespace}}\" limit=\"3\"></labels>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"middle-content\" persist-tab-state>\n" +
    "<div class=\"container-fluid\">\n" +
    "<div class=\"row\" ng-if=\"service\">\n" +
    "<div class=\"col-md-12\">\n" +
    "<uib-tabset>\n" +
    "<uib-tab active=\"selectedTab.details\">\n" +
    "<uib-tab-heading>Details</uib-tab-heading>\n" +
    "<div class=\"resource-details\">\n" +
    "<dl class=\"dl-horizontal left\">\n" +
    "<dt>Selectors:</dt>\n" +
    "<dd>\n" +
    "<span ng-if=\"!service.spec.selector\"><em>none</em></span>\n" +
    "<span ng-repeat=\"(selectorLabel, selectorValue) in service.spec.selector\"> {{selectorLabel}}={{selectorValue}}<span ng-show=\"!$last\">, </span></span>\n" +
    "</dd>\n" +
    "<dt>Type:</dt>\n" +
    "<dd>{{service.spec.type}}</dd>\n" +
    "<dt>IP:</dt>\n" +
    "<dd>{{service.spec.clusterIP}}</dd>\n" +
    "<dt>Hostname:</dt>\n" +
    "<dd>\n" +
    "{{service.metadata.name}}.{{service.metadata.namespace}}.svc\n" +
    "<span data-toggle=\"popover\" data-trigger=\"hover\" data-content=\"{{'This address is only resolvable from within the cluster.'}}\" style=\"cursor: help; padding-left: 5px\">\n" +
    "<span class=\"pficon pficon-info\" aria-hidden=\"true\" data-toggle=\"tooltip\" style=\"cursor: help\"></span>\n" +
    "</span>\n" +
    "</dd>\n" +
    "<dt ng-if-start=\"service.spec.externalName\">External Hostname:</dt>\n" +
    "<dd ng-if-end>{{service.spec.externalName}}</dd>\n" +
    "<dt>Session affinity:</dt>\n" +
    "<dd>{{service.spec.sessionAffinity}}</dd>\n" +
    "<dt ng-if-start=\"service.status.loadBalancer.ingress.length\">Ingress Points:</dt>\n" +
    "<dd ng-if-end>\n" +
    "<span ng-repeat=\"ingress in service.status.loadBalancer.ingress\">{{ingress.ip}}<span ng-if=\"!$last\">, </span></span>\n" +
    "</dd>\n" +
    "<dt ng-if-start=\"service.spec.externalIPs.length\">External IPs:</dt>\n" +
    "<dd ng-if-end>\n" +
    "<span ng-repeat=\"externalIP in service.spec.externalIPs\">{{externalIP}}<span ng-if=\"!$last\">, </span></span>\n" +
    "</dd>\n" +
    "<dt ng-if-start=\"(routesForService | hashSize) == 0\">Routes:</dt>\n" +
    "<dd ng-if-end>\n" +
    "<span>\n" +
    "<a ng-href=\"project/{{project.metadata.name}}/create-route?service={{service.metadata.name}}\" ng-if=\"'routes' | canI : 'create'\">Create route</a>\n" +
    "<span ng-if=\"!('routes' | canI : 'create')\"><em>None</em></span>\n" +
    "</span>\n" +
    "</dd>\n" +
    "</dl>\n" +
    "<h3>Traffic</h3>\n" +
    "<div>\n" +
    "<traffic-table ports-by-route=\"portsByRoute\" routes=\"routesForService\" services=\"services\" show-node-ports=\"showNodePorts\" custom-name-header=\"'Route'\"></traffic-table>\n" +
    "</div>\n" +
    "<p>\n" +
    "Learn more about <a ng-href=\"{{'route-types' | helpLink}}\" target=\"_blank\">routes</a> and <a ng-href=\"{{'services' | helpLink}}\" target=\"_blank\">services</a>.\n" +
    "</p>\n" +
    "<h3>Pods</h3>\n" +
    "<div>\n" +
    "<pods-table pods=\"podsForService\" active-pods=\"podsWithEndpoints\" custom-name-header=\"'Pod'\" pod-failure-reasons=\"podFailureReasons\"></pods-table>\n" +
    "</div>\n" +
    "<annotations annotations=\"service.metadata.annotations\"></annotations>\n" +
    "</div>\n" +
    "</uib-tab>\n" +
    "<uib-tab active=\"selectedTab.events\" ng-if=\"'events' | canI : 'watch'\">\n" +
    "<uib-tab-heading>Events</uib-tab-heading>\n" +
    "<events resource-kind=\"Service\" resource-name=\"{{service.metadata.name}}\" project-context=\"projectContext\" ng-if=\"selectedTab.events\"></events>\n" +
    "</uib-tab>\n" +
    "</uib-tabset>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</project-page>"
  );


  $templateCache.put('views/browse/stateful-set.html',
    "<project-header class=\"top-header\"></project-header>\n" +
    "<project-page>\n" +
    "<div class=\"middle-section\">\n" +
    "<div class=\"middle-container\">\n" +
    "<div class=\"middle-header\">\n" +
    "<div class=\"container-fluid\">\n" +
    "<div row mobile=\"column\" class=\"tech-preview-header\">\n" +
    "<breadcrumbs breadcrumbs=\"breadcrumbs\"></breadcrumbs>\n" +
    "<span class=\"pad-top-md\">\n" +
    "<span class=\"label label-warning\">Technology Preview</span>\n" +
    "</span>\n" +
    "</div>\n" +
    "<alerts alerts=\"alerts\"></alerts>\n" +
    "<div>\n" +
    "<h1>\n" +
    "{{statefulSet.metadata.name}}\n" +
    "<div class=\"pull-right dropdown\" ng-if=\"statefulSet\" ng-show=\"resourceGroupVersion.resource | canIDoAny\">\n" +
    "<button type=\"button\" class=\"dropdown-toggle btn btn-default actions-dropdown-btn hidden-xs\" data-toggle=\"dropdown\">\n" +
    "Actions\n" +
    "<span class=\"caret\" aria-hidden=\"true\"></span>\n" +
    "</button>\n" +
    "<a href=\"\" class=\"dropdown-toggle actions-dropdown-kebab visible-xs-inline\" data-toggle=\"dropdown\">\n" +
    "<i class=\"fa fa-ellipsis-v\"></i><span class=\"sr-only\">Actions</span>\n" +
    "</a>\n" +
    "<ul class=\"dropdown-menu actions action-button\">\n" +
    "<li ng-if=\"resourceGroupVersion | canI : 'update'\">\n" +
    "<a ng-href=\"{{statefulSet | editYamlURL}}\" role=\"button\">Edit YAML</a>\n" +
    "</li>\n" +
    "<li ng-if=\"resourceGroupVersion | canI : 'delete'\">\n" +
    "<delete-link kind=\"StatefulSet\" group=\"apps\" resource-name=\"{{statefulSet.metadata.name}}\" project-name=\"{{statefulSet.metadata.namespace}}\" replicas=\"statefulSet.spec.replicas\" alerts=\"alerts\">\n" +
    "</delete-link>\n" +
    "</li>\n" +
    "</ul>\n" +
    "</div>\n" +
    "</h1>\n" +
    "<labels labels=\"statefulSet.metadata.labels\" clickable=\"true\" kind=\"stateful-sets\" title-kind=\"stateful sets\" project-name=\"{{statefulSet.metadata.namespace}}\" limit=\"3\"></labels>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"middle-content\" persist-tab-state>\n" +
    "<div class=\"container-fluid\">\n" +
    "<div ng-if=\"!loaded\">Loading...</div>\n" +
    "<div class=\"row\" ng-if=\"loaded\">\n" +
    "<div class=\"col-md-12\">\n" +
    "<uib-tabset>\n" +
    "<uib-tab active=\"selectedTab.details\">\n" +
    "<uib-tab-heading>Details</uib-tab-heading>\n" +
    "<div class=\"row\" style=\"max-width: 650px\">\n" +
    "<div class=\"col-sm-4 col-sm-push-8 browse-deployment-donut\">\n" +
    "\n" +
    "<deployment-donut rc=\"statefulSet\" pods=\"podsForStatefulSet\" scalable=\"isScalable()\" alerts=\"alerts\">\n" +
    "</deployment-donut>\n" +
    "</div>\n" +
    "<div class=\"col-sm-8 col-sm-pull-4\">\n" +
    "<dl class=\"dl-horizontal left\">\n" +
    "<dt>Status:</dt>\n" +
    "<dd>\n" +
    "<status-icon status=\"statefulSet | deploymentStatus\"></status-icon>\n" +
    "{{statefulSet | deploymentStatus}}\n" +
    "</dd>\n" +
    "<dt>Replicas:</dt>\n" +
    "<dd>\n" +
    "\n" +
    "<span ng-if=\"(podsForStatefulSet | hashSize) !== statefulSet.spec.replicas\">{{podsForStatefulSet | hashSize}}/</span>{{statefulSet.spec.replicas}} replica<span ng-if=\"statefulSet.spec.replicas != 1\">s</span>\n" +
    "\n" +
    "</dd>\n" +
    "</dl>\n" +
    "<h3>Template</h3>\n" +
    "<pod-template pod-template=\"statefulSet.spec.template\" detailed=\"true\">\n" +
    "</pod-template>\n" +
    "<volume-claim-templates templates=\"statefulSet.spec.volumeClaimTemplates\" namespace=\"project.metadata.name\">\n" +
    "</volume-claim-templates>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"row\">\n" +
    "<div class=\"col-md-12\">\n" +
    "<h3>Volumes</h3>\n" +
    "<p ng-if=\"!statefulSet.spec.template.spec.volumes.length\">\n" +
    "none\n" +
    "</p>\n" +
    "<volumes volumes=\"statefulSet.spec.template.spec.volumes\" namespace=\"project.metadata.name\">\n" +
    "</volumes>\n" +
    "<h3>Pods</h3>\n" +
    "<pods-table pods=\"podsForStatefulSet\"></pods-table>\n" +
    "<annotations annotations=\"statefulSet.metadata.annotations\"></annotations>\n" +
    "</div>\n" +
    "</div>\n" +
    "</uib-tab>\n" +
    "<uib-tab active=\"selectedTab.environment\" ng-if=\"statefulSet\">\n" +
    "<uib-tab-heading>Environment</uib-tab-heading>\n" +
    "<div class=\"resource-environment\">\n" +
    "<ng-form name=\"forms.statefulSetEnvVars\">\n" +
    "<div ng-repeat=\"container in statefulSet.spec.template.spec.containers\">\n" +
    "<h3>Container {{container.name}} Environment Variables</h3>\n" +
    "<p>\n" +
    "Environment variables for stateful sets are readonly.\n" +
    "<span ng-if=\"!(container.env.length)\">\n" +
    "There are no environment variables for this container.\n" +
    "</span>\n" +
    "</p>\n" +
    "<key-value-editor entries=\"container.env\" key-placeholder=\"Name\" value-placeholder=\"Value\" is-readonly cannot-add cannot-delete cannot-sort show-header></key-value-editor>\n" +
    "</div>\n" +
    "</ng-form>\n" +
    "</div>\n" +
    "</uib-tab>\n" +
    "<uib-tab ng-if=\"metricsAvailable\" active=\"selectedTab.metrics\">\n" +
    "<uib-tab-heading>Metrics</uib-tab-heading>\n" +
    "<div class=\"resource-metrics\">\n" +
    "<deployment-metrics ng-if=\"selectedTab.metrics && podsForStatefulSet\" pods=\"podsForStatefulSet\" containers=\"statefulSet.spec.template.spec.containers\" alerts=\"alerts\">\n" +
    "</deployment-metrics>\n" +
    "</div>\n" +
    "</uib-tab>\n" +
    "<uib-tab active=\"selectedTab.events\">\n" +
    "<uib-tab-heading>Events</uib-tab-heading>\n" +
    "<div class=\"resource-events\">\n" +
    "<events resource-kind=\"StatefulSet\" resource-name=\"{{statefulSet.metadata.name}}\" project-context=\"projectContext\" ng-if=\"selectedTab.events\"></events>\n" +
    "</div>\n" +
    "</uib-tab>\n" +
    "</uib-tabset>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</project-page>"
  );


  $templateCache.put('views/browse/stateful-sets.html',
    "<project-header class=\"top-header\"></project-header>\n" +
    "<project-page>\n" +
    "<div class=\"middle-section\">\n" +
    "<div class=\"middle-container\">\n" +
    "<div class=\"middle-header header-toolbar\">\n" +
    "<div class=\"container-fluid\">\n" +
    "<div class=\"page-header page-header-bleed-right page-header-bleed-left\">\n" +
    "<span class=\"pad-top-xs pull-right\">\n" +
    "<span class=\"label label-warning\">Technology Preview</span>\n" +
    "</span>\n" +
    "<h1>\n" +
    "Stateful Sets\n" +
    "\n" +
    "</h1>\n" +
    "</div>\n" +
    "<div ng-if=\"!renderOptions.showGetStarted\" class=\"data-toolbar\">\n" +
    "<div class=\"data-toolbar-filter\">\n" +
    "<project-filter></project-filter>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"middle-content\" persist-tab-state>\n" +
    "<div class=\"container-fluid\">\n" +
    "<alerts alerts=\"alerts\"></alerts>\n" +
    "<div ng-if=\"!loaded\">Loading...</div>\n" +
    "<div class=\"row\" ng-if=\"loaded\">\n" +
    "<div class=\"col-md-12\">\n" +
    "<table class=\"table table-bordered table-hover table-mobile table-layout-fixed\">\n" +
    "<colgroup>\n" +
    "<col class=\"col-sm-5\">\n" +
    "</colgroup>\n" +
    "<thead>\n" +
    "<tr>\n" +
    "<th>Name</th>\n" +
    "<th>Replicas</th>\n" +
    "<th>Created</th>\n" +
    "</tr>\n" +
    "</thead>\n" +
    "<tbody ng-if=\"(statefulSets | hashSize) == 0\">\n" +
    "<tr>\n" +
    "<td colspan=\"3\"><em>No stateful sets to show</em></td>\n" +
    "</tr>\n" +
    "</tbody>\n" +
    "<tbody ng-repeat=\"(statefulSetName, statefulSet) in statefulSets\">\n" +
    "<tr>\n" +
    "<td data-title=\"Name\">\n" +
    "<a ng-href=\"{{statefulSet | navigateResourceURL}}\">{{statefulSet.metadata.name}}</a>\n" +
    "</td>\n" +
    "<td data-title=\"Replicas\">\n" +
    "<span ng-if=\"(podsByOwnerUID[statefulSet.metadata.uid] | hashSize) !== statefulSet.spec.replicas\">{{podsByOwnerUID[statefulSet.metadata.uid] | hashSize}}/</span>{{statefulSet.spec.replicas}} replica<span ng-if=\"statefulSet.spec.replicas != 1\">s</span>\n" +
    "\n" +
    "</td>\n" +
    "<td data-title=\"Created\">\n" +
    "<span am-time-ago=\"statefulSet.metadata.creationTimestamp\"></span>\n" +
    "</td>\n" +
    "</tr>\n" +
    "</tbody>\n" +
    "</table>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</project-page>"
  );


  $templateCache.put('views/builds.html',
    "<project-header class=\"top-header\"></project-header>\n" +
    "<project-page>\n" +
    "\n" +
    "<div class=\"middle-section\">\n" +
    "<div class=\"middle-container\">\n" +
    "<div class=\"middle-header header-toolbar\">\n" +
    "<div class=\"container-fluid\">\n" +
    "<div class=\"page-header page-header-bleed-right page-header-bleed-left\">\n" +
    "<h1>\n" +
    "Builds\n" +
    "<span class=\"page-header-link\">\n" +
    "<a ng-href=\"{{'builds' | helpLink}}\" target=\"_blank\">\n" +
    "Learn More <i class=\"fa fa-external-link\" aria-hidden=\"true\"></i>\n" +
    "</a>\n" +
    "</span>\n" +
    "</h1>\n" +
    "</div>\n" +
    "<div ng-if=\"!renderOptions.showGetStarted\" class=\"data-toolbar\">\n" +
    "<div class=\"data-toolbar-filter\">\n" +
    "<project-filter></project-filter>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"middle-content\">\n" +
    "<div class=\"container-fluid\">\n" +
    "<alerts alerts=\"alerts\"></alerts>\n" +
    "<div class=\"row\">\n" +
    "<div class=\"col-md-12\">\n" +
    "<table class=\"table table-bordered table-hover table-mobile table-layout-fixed\">\n" +
    "<colgroup>\n" +
    "<col class=\"col-sm-2\">\n" +
    "<col class=\"col-sm-1\">\n" +
    "<col class=\"col-sm-2\">\n" +
    "<col class=\"col-sm-2\">\n" +
    "<col class=\"col-sm-2\">\n" +
    "<col class=\"col-sm-1\">\n" +
    "<col class=\"col-sm-2 hidden-sm\">\n" +
    "</colgroup>\n" +
    "<thead>\n" +
    "<tr>\n" +
    "<th>Name</th>\n" +
    "<th>Last Build</th>\n" +
    "<th>Status</th>\n" +
    "<th>Duration</th>\n" +
    "<th>Created</th>\n" +
    "<th>Type</th>\n" +
    "<th ng-class=\"{'hidden-sm' : (latestByConfig | hashSize)}\">Source</th>\n" +
    "</tr>\n" +
    "</thead>\n" +
    "<tbody ng-if=\"!(latestByConfig | hashSize)\">\n" +
    "<tr><td colspan=\"7\"><em>{{emptyMessage}}</em></td></tr>\n" +
    "</tbody>\n" +
    "<tbody ng-if=\"(latestByConfig | hashSize)\">\n" +
    "<tr ng-repeat=\"(buildConfigName, latestBuild) in latestByConfig\">\n" +
    "\n" +
    "<td ng-if-start=\"!latestBuild\" data-title=\"Name\">\n" +
    "<a href=\"{{buildConfigs[buildConfigName] | navigateResourceURL}}\">{{buildConfigName}}</a>\n" +
    "</td>\n" +
    "<td data-title=\"Last Build\"><em>No builds</em></td>\n" +
    "<td class=\"hidden-xs\">&nbsp;</td>\n" +
    "<td class=\"hidden-xs\">&nbsp;</td>\n" +
    "<td class=\"hidden-xs\">&nbsp;</td>\n" +
    "<td data-title=\"Type\">{{buildConfigs[buildConfigName].spec.strategy.type | startCase}}</td>\n" +
    "<td ng-if-end data-title=\"Source\" class=\"hidden-sm\">\n" +
    "<span ng-if=\"buildConfigs[buildConfigName].spec.source.type == 'None'\"><i>none</i></span>\n" +
    "<span ng-if=\"buildConfigs[buildConfigName].spec.source.type == 'Git'\"><osc-git-link uri=\"buildConfigs[buildConfigName].spec.source.git.uri\" ref=\"buildConfigs[buildConfigName].spec.source.git.ref\" context-dir=\"buildConfigs[buildConfigName].spec.source.contextDir\">{{buildConfigs[buildConfigName].spec.source.git.uri}}</osc-git-link></span></td>\n" +
    "\n" +
    "\n" +
    "<td ng-if-start=\"latestBuild && (buildConfigs[buildConfigName] || !unfilteredBuildConfigs[buildConfigName])\" data-title=\"Name\">\n" +
    "<a ng-if=\"buildConfigName\" href=\"{{latestBuild | configURLForResource}}\">{{buildConfigName}}</a>\n" +
    "<span ng-if=\"buildConfigs && buildConfigName && !buildConfigs[buildConfigName]\" class=\"pficon pficon-warning-triangle-o\" data-toggle=\"tooltip\" title=\"This build config no longer exists\" style=\"cursor: help\"></span>\n" +
    "<span ng-if=\"buildConfigName == ''\"><em>none</em></span>\n" +
    "</td>\n" +
    "<td data-title=\"Last Build\">\n" +
    "\n" +
    "<span ng-if=\"(latestBuild | annotation : 'buildNumber') && buildConfigName\">\n" +
    "<a ng-href=\"{{latestBuild | navigateResourceURL}}\">#{{latestBuild | annotation : 'buildNumber'}}</a>\n" +
    "</span>\n" +
    "<span ng-if=\"!(latestBuild | annotation : 'buildNumber') && buildConfigName\">\n" +
    "<a ng-href=\"{{latestBuild | navigateResourceURL}}\">{{latestBuild.metadata.name}}</a>\n" +
    "</span>\n" +
    "<span ng-if=\"buildConfigName == ''\">\n" +
    "<a ng-href=\"{{latestBuild | navigateResourceURL}}\">{{latestBuild.metadata.name}}</a>\n" +
    "</span>\n" +
    "</td>\n" +
    "<td data-title=\"Status\">\n" +
    "<div row class=\"status\">\n" +
    "\n" +
    "<status-icon status=\"latestBuild.status.phase\" disable-animation></status-icon>\n" +
    "<span ng-if=\"!latestBuild.status.reason || latestBuild.status.phase === 'Cancelled'\">{{latestBuild.status.phase}}</span>\n" +
    "<span ng-if=\"latestBuild.status.reason && latestBuild.status.phase !== 'Cancelled'\">{{latestBuild.status.reason | sentenceCase}}</span>\n" +
    "</div>\n" +
    "</td>\n" +
    "<td data-title=\"Duration\">\n" +
    "<duration-until-now ng-if=\"latestBuild.status.startTimestamp && !latestBuild.status.completionTimestamp\" timestamp=\"latestBuild.status.startTimestamp\" time-only></duration-until-now>\n" +
    "<span ng-if=\"latestBuild.status.startTimestamp && latestBuild.status.completionTimestamp\">{{latestBuild.status.startTimestamp | duration : latestBuild.status.completionTimestamp}}</span>\n" +
    "</td>\n" +
    "<td data-title=\"Created\">\n" +
    "<span am-time-ago=\"latestBuild.metadata.creationTimestamp\"></span>\n" +
    "</td>\n" +
    "<td data-title=\"Type\">{{latestBuild.spec.strategy.type | startCase}}</td>\n" +
    "<td ng-if-end data-title=\"Source\" class=\"hidden-sm\">\n" +
    "<span ng-if=\"latestBuild.spec.source\">\n" +
    "<span ng-if=\"latestBuild.spec.source.type == 'None'\">\n" +
    "<i>none</i>\n" +
    "</span>\n" +
    "<osc-git-link uri=\"latestBuild.spec.source.git.uri\" ref=\"latestBuild.spec.source.git.ref\" context-dir=\"latestBuild.spec.source.contextDir\">{{latestBuild.spec.source.git.uri}}</osc-git-link>\n" +
    "</span>\n" +
    "</td>\n" +
    "</tr>\n" +
    "</tbody>\n" +
    "</table>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</project-page>"
  );


  $templateCache.put('views/catalog/_image.html',
    "<div class=\"col-xxs-12 col-xs-6 col-sm-6 col-md-4\">\n" +
    "<div class=\"card-pf\">\n" +
    "<div class=\"card-pf-body card-pf-body-with-version\">\n" +
    "<div class=\"card-pf-details\">\n" +
    "<div class=\"card-pf-title-with-icon\">\n" +
    "<custom-icon resource=\"imageStream\" kind=\"image\" tag=\"is.tag.tag\" class=\"image-icon\"></custom-icon>\n" +
    "<h2 class=\"card-pf-title\">\n" +
    "<span ng-bind-html=\"imageStream | displayName | highlightKeywords : keywords\"></span>\n" +
    "</h2>\n" +
    "</div>\n" +
    "<p class=\"card-pf-badge\">Builds source code</p>\n" +
    "<p>\n" +
    "<truncate-long-text class=\"project-description\" content=\"imageStream | imageStreamTagAnnotation : 'description' : is.tag.tag\" limit=\"200\" highlight-keywords=\"keywords\" use-word-boundary=\"true\"></truncate-long-text>\n" +
    "</p>\n" +
    "<p ng-if=\"imageStream | imageStreamTagAnnotation : 'provider' : is.tag.tag\">\n" +
    "Provider: {{imageStream | imageStreamTagAnnotation : 'provider' : is.tag.tag}}\n" +
    "</p>\n" +
    "\n" +
    "<p ng-if=\"imageStream.metadata.namespace !== 'openshift'\">\n" +
    "Namespace: {{imageStream.metadata.namespace}}\n" +
    "</p>\n" +
    "</div>\n" +
    "<p class=\"card-pf-version\">\n" +
    "Version\n" +
    "<ui-select ng-model=\"is.tag\" search-enabled=\"false\">\n" +
    "<ui-select-match>\n" +
    "<span>\n" +
    "{{$select.selected.tag}}\n" +
    "<small ng-repeat=\"otherTag in referencedBy[$select.selected.tag]\">\n" +
    "<span ng-if=\"$first\"> &mdash; </span>{{otherTag}}<span ng-if=\"!$last\">,</span>\n" +
    "</small>\n" +
    "</span>\n" +
    "</ui-select-match>\n" +
    "<ui-select-choices repeat=\"tag in tags track by tag.tag\">\n" +
    "{{tag.tag}}\n" +
    "<small ng-repeat=\"otherTag in referencedBy[tag.tag]\">\n" +
    "<span ng-if=\"$first\"> &mdash; </span>{{otherTag}}<span ng-if=\"!$last\">,</span>\n" +
    "</small>\n" +
    "</ui-select-choices>\n" +
    "</ui-select>\n" +
    "</p>\n" +
    "</div>\n" +
    "<div class=\"card-pf-footer clearfix\">\n" +
    "<a class=\"btn btn-default pull-right\" ng-href=\"{{imageStream | createFromImageURL : is.tag.tag : project}}\">\n" +
    "Select\n" +
    "</a>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/catalog/_template.html',
    "<div class=\"col-xxs-12 col-xs-6 col-sm-6 col-md-4\">\n" +
    "<div class=\"card-pf\">\n" +
    "<div class=\"card-pf-body\">\n" +
    "<div class=\"card-pf-title-with-icon\">\n" +
    "<custom-icon resource=\"template\" kind=\"template\" class=\"image-icon\"></custom-icon>\n" +
    "<h2 class=\"card-pf-title\">\n" +
    "<span ng-bind-html=\"template | displayName | highlightKeywords : keywords\"></span>\n" +
    "</h2>\n" +
    "</div>\n" +
    "<p>\n" +
    "<truncate-long-text class=\"project-description\" content=\"(template | description) || template.metadata.name\" limit=\"200\" use-word-boundary=\"true\" highlight-keywords=\"keywords\"></truncate-long-text>\n" +
    "</p>\n" +
    "<p ng-if=\"template | annotation : 'provider'\">\n" +
    "Provider: {{template | annotation : 'provider'}}\n" +
    "</p>\n" +
    "\n" +
    "<p ng-if=\"template.metadata.namespace !== 'openshift'\">\n" +
    "Namespace: {{template.metadata.namespace}}\n" +
    "</p>\n" +
    "</div>\n" +
    "<div class=\"card-pf-footer clearfix\">\n" +
    "<a class=\"btn btn-default pull-right\" ng-href=\"{{template | createFromTemplateURL : project}}\">\n" +
    "Select\n" +
    "</a>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/catalog/catalog.html',
    "<p ng-if=\"!loaded\">Loading...</p>\n" +
    "<div ng-if=\"emptyCatalog && loaded\" class=\"empty-state-message empty-state-full-page\">\n" +
    "<h2 class=\"text-center\">No images or templates.</h2>\n" +
    "<p class=\"gutter-top\">\n" +
    "No images or templates are loaded for this project or the shared\n" +
    "<code>openshift</code> namespace. An image or template is required to add content.\n" +
    "</p>\n" +
    "<p>\n" +
    "To add an image stream or template from a file, use the editor in the\n" +
    "<strong>Import YAML / JSON</strong> tab, or run the following command:\n" +
    "<div><code>oc create -f &lt;filename&gt; -n {{projectName}}</code></div>\n" +
    "</p>\n" +
    "<p><a href=\"{{projectName | projectOverviewURL}}\">Back to overview</a></p>\n" +
    "</div>\n" +
    "<div ng-show=\"!emptyCatalog && loaded && !singleCategory\">\n" +
    "<p ng-if=\"!parentCategory\">Choose from web frameworks, databases, and other components to add content to your project.</p>\n" +
    "<form role=\"form\" fit class=\"search-pf has-button\">\n" +
    "<div class=\"form-group has-clear\">\n" +
    "\n" +
    "<div class=\"search-pf-input-group\">\n" +
    "<label for=\"search\" class=\"sr-only\">Filter by name or description</label>\n" +
    "<input ng-model=\"filter.keyword\" type=\"search\" id=\"search\" placeholder=\"Filter by name or description\" class=\"search-input form-control\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\">\n" +
    "<button type=\"button\" class=\"clear\" aria-hidden=\"true\" ng-if=\"filter.keyword\" ng-click=\"filter.keyword = ''\">\n" +
    "<span class=\"pficon pficon-close\"></span>\n" +
    "</button>\n" +
    "</div>\n" +
    "</div>\n" +
    "</form>\n" +
    "<div ng-if=\"allContentHidden\" class=\"empty-state-message text-center h2\">\n" +
    "All content is hidden by the current filter.\n" +
    "<a href=\"\" ng-click=\"filter.keyword = ''\">Clear Filter</a>\n" +
    "</div>\n" +
    "<div ng-if=\"!filterActive\">\n" +
    "<div ng-repeat=\"category in categories\" ng-if=\"hasContent[category.id]\">\n" +
    "<h2 class=\"h3\" ng-if=\"category.label\">{{category.label}}</h2>\n" +
    "<div class=\"row tile-row\" ng-class=\"{ 'mar-top-xl': !category.label || category.items.length < 2 }\">\n" +
    "<div ng-repeat=\"item in category.items\" ng-if=\"countByCategory[item.id]\" class=\"col-xxs-12 col-xs-6 col-sm-6 col-md-4\">\n" +
    "<div class=\"tile tile-click\" ng-class=\"{ 'tile-sans-icon' : !item.iconClass, 'tile-sans-description' : !item.description }\">\n" +
    "<div class=\"tile-title\">\n" +
    "<div ng-if=\"item.iconClass || category.iconClassDefault\" class=\"image-icon\">\n" +
    "<span aria-hidden=\"true\" class=\"{{item.iconClass || category.iconClassDefault}}\"></span>\n" +
    "</div>\n" +
    "<h3>\n" +
    "\n" +
    "<a ng-if=\"!parentCategory\" ng-href=\"project/{{projectName}}/create/category/{{item.id || 'none'}}\" class=\"tile-target\">\n" +
    "{{item.label}}\n" +
    "</a>\n" +
    "\n" +
    "<a ng-if=\"parentCategory\" ng-href=\"project/{{projectName}}/create/category/{{parentCategory.id}}/{{item.id || 'none'}}\" class=\"tile-target\">\n" +
    "{{item.label}}\n" +
    "</a>\n" +
    "</h3>\n" +
    "\n" +
    "</div>\n" +
    "<p ng-if=\"item.description\">{{item.description}}</p>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"hasItemsNoSubcategory\">\n" +
    "<div class=\"row row-cards-pf row-cards-pf-flex\">\n" +
    "<catalog-image image-stream=\"builder\" project=\"{{projectName}}\" is-builder=\"true\" ng-repeat=\"builder in buildersNoSubcategory track by (builder | uid)\">\n" +
    "</catalog-image>\n" +
    "<catalog-template template=\"template\" project=\"{{projectName}}\" ng-repeat=\"template in templatesNoSubcategory | orderBy : ['metadata.name', 'metadata.namespace'] track by (template | uid)\">\n" +
    "</catalog-template>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"filterActive\">\n" +
    "<div ng-repeat=\"category in categories\" ng-if=\"hasContent[category.id]\">\n" +
    "<div ng-repeat=\"item in category.items\" ng-if=\"countByCategory[item.id]\">\n" +
    "<h2 class=\"h3\">\n" +
    "<span ng-bind-html=\"item.label | highlightKeywords : keywords\"></span>\n" +
    "<span class=\"tile-item-count badge\">{{countByCategory[item.id] || 0}}</span>\n" +
    "</h2>\n" +
    "<div class=\"row row-cards-pf row-cards-pf-flex mar-top-xl\">\n" +
    "<catalog-image image-stream=\"builder\" project=\"{{projectName}}\" is-builder=\"true\" keywords=\"keywords\" ng-repeat=\"builder in filteredBuildersByCategory[item.id] track by (builder | uid)\">\n" +
    "</catalog-image>\n" +
    "<catalog-template template=\"template\" project=\"{{projectName}}\" keywords=\"keywords\" ng-repeat=\"template in filteredTemplatesByCategory[item.id] | orderBy : ['metadata.name', 'metadata.namespace'] track by (template | uid)\">\n" +
    "</catalog-template>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"countFilteredNoSubcategory\">\n" +
    "<h2 class=\"h3\">\n" +
    "Other {{parentCategory.label}}\n" +
    "<span class=\"tile-item-count badge\">{{countFilteredNoSubcategory}}</span>\n" +
    "</h2>\n" +
    "<div class=\"row row-cards-pf row-cards-pf-flex mar-top-xl\">\n" +
    "<catalog-image image-stream=\"builder\" project=\"{{projectName}}\" is-builder=\"true\" keywords=\"keywords\" ng-repeat=\"builder in filteredBuildersNoSubcategory track by (builder | uid)\">\n" +
    "</catalog-image>\n" +
    "<catalog-template template=\"template\" project=\"{{projectName}}\" keywords=\"keywords\" ng-repeat=\"template in filteredTemplatesNoSubcategory | orderBy : ['metadata.name', 'metadata.namespace'] track by (template | uid)\">\n" +
    "</catalog-template>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "\n" +
    "<div ng-if=\"singleCategory\">\n" +
    "<category-content project-name=\"projectName\" project-image-streams=\"projectImageStreams\" openshift-image-streams=\"openshiftImageStreams\" project-templates=\"projectTemplates\" openshift-templates=\"openshiftTemplates\" category=\"singleCategory\">\n" +
    "</category-content>\n" +
    "</div>"
  );


  $templateCache.put('views/catalog/category-content.html',
    "<p ng-if=\"!loaded\">Loading...</p>\n" +
    "<div ng-if=\"emptyCategory && loaded\" class=\"empty-state-message empty-state-full-page\">\n" +
    "<h2 class=\"text-center\">No images or templates.</h2>\n" +
    "<p class=\"gutter-top\">\n" +
    "No images or templates are loaded for the category {{category.label}}.\n" +
    "</p>\n" +
    "<p>\n" +
    "To add an image stream or template from a file, use the editor in the\n" +
    "<strong>Import YAML / JSON</strong> tab, or run the following command:\n" +
    "<div><code>oc create -f &lt;filename&gt; -n {{projectName}}</code></div>\n" +
    "</p>\n" +
    "<p><a ng-href=\"project/{{projectName}}/create\">Back to catalog</a></p>\n" +
    "</div>\n" +
    "<div ng-if=\"loaded && !emptyCategory && !catalog.subcategories\">\n" +
    "<form role=\"form\" fit class=\"search-pf has-button mar-bottom-xl\">\n" +
    "<div class=\"form-group has-clear\">\n" +
    "\n" +
    "<div class=\"search-pf-input-group\">\n" +
    "<label for=\"search\" class=\"sr-only\">Filter by name or description</label>\n" +
    "<input ng-model=\"filter.keyword\" type=\"search\" id=\"search\" placeholder=\"Filter by name or description\" class=\"search-input form-control\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\">\n" +
    "<button type=\"button\" class=\"clear\" aria-hidden=\"true\" ng-if=\"filter.keyword\" ng-click=\"filter.keyword = ''\">\n" +
    "<span class=\"pficon pficon-close\"></span>\n" +
    "</button>\n" +
    "</div>\n" +
    "</div>\n" +
    "</form>\n" +
    "<div ng-if=\"!filteredBuilderImages.length && !filteredTemplates.length && loaded\" class=\"empty-state-message text-center h2\">\n" +
    "All content is hidden by the current filter.\n" +
    "<a href=\"\" ng-click=\"filter.keyword = ''\">Clear Filter</a>\n" +
    "</div>\n" +
    "<div class=\"row row-cards-pf row-cards-pf-flex mar-top-xl\">\n" +
    "<catalog-image image-stream=\"builder\" project=\"{{projectName}}\" is-builder=\"true\" keywords=\"keywords\" ng-repeat=\"builder in filteredBuilderImages track by (builder | uid)\">\n" +
    "</catalog-image>\n" +
    "<catalog-template template=\"template\" project=\"{{projectName}}\" keywords=\"keywords\" ng-repeat=\"template in filteredTemplates | orderBy : ['metadata.name', 'metadata.namespace'] track by (template | uid)\">\n" +
    "</catalog-template>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/command-line.html',
    "<default-header class=\"top-header\"></default-header>\n" +
    "<div class=\"wrap no-sidebar\">\n" +
    "<div class=\"sidebar-left collapse navbar-collapse navbar-collapse-2\">\n" +
    "<navbar-utility-mobile></navbar-utility-mobile>\n" +
    "</div>\n" +
    "<div class=\"middle surface-shaded\">\n" +
    "\n" +
    "<div class=\"middle-section\">\n" +
    "<div class=\"middle-container\">\n" +
    "<div class=\"middle-content\">\n" +
    "<div class=\"container surface-shaded gutter-top\">\n" +
    "<div class=\"row\">\n" +
    "<div class=\"col-md-12\">\n" +
    "<div class=\"command-line\">\n" +
    "<h1 id=\"cli\">Command Line Tools</h1>\n" +
    "<p>\n" +
    "With the OpenShift command line interface (CLI), you can create applications and manage OpenShift projects from a terminal.\n" +
    "<span ng-if=\"cliDownloadURLPresent\">\n" +
    "You can download the <code>oc</code> client tool using the links below. For more information about downloading and installing it, please refer to the <a target=\"_blank\" href=\"{{'get_started_cli' | helpLink}}\">Get Started with the CLI</a> documentation.\n" +
    "</span>\n" +
    "<span ng-if=\"!cliDownloadURLPresent\">\n" +
    "Refer to the <a target=\"_blank\" href=\"{{'get_started_cli' | helpLink}}\">Get Started with the CLI</a> documentation for instructions about downloading and installing the <code>oc</code> client tool.\n" +
    "</span>\n" +
    "<div ng-if=\"cliDownloadURLPresent\">\n" +
    "<label class=\"cli-download-label\">Download <code>oc</code>:</label>\n" +
    "<div ng-repeat=\"(key, value) in cliDownloadURL\">\n" +
    "\n" +
    "<a ng-href=\"{{value}}\" class=\"cli-download-link\" target=\"_self\">\n" +
    "{{key}}\n" +
    "<i class=\"fa fa-external-link\"></i>\n" +
    "</a>\n" +
    "</div>\n" +
    "</div>\n" +
    "</p>\n" +
    "<p>\n" +
    "After downloading and installing it, you can start by logging in using<span ng-if=\"sessionToken\"> this current session token</span>:\n" +
    "<copy-to-clipboard display-wide=\"true\" clipboard-text=\"'oc login ' + loginBaseURL + ' --token=' + sessionToken\" input-text=\"'oc login ' + loginBaseURL + ' --token=<hidden>'\"></copy-to-clipboard>\n" +
    "<pre class=\"code prettyprint ng-binding\" ng-if=\"!sessionToken\">\n" +
    "                      oc login {{loginBaseURL}}\n" +
    "                    </pre>\n" +
    "</p>\n" +
    "<div class=\"alert alert-warning\">\n" +
    "<span class=\"pficon pficon-warning-triangle-o\" aria-hidden=\"true\"></span>\n" +
    "<strong>A token is a form of a password.</strong>\n" +
    "Do not share your API token.\n" +
    "</div>\n" +
    "<p>After you login to your account you will get a list of projects that you can switch between:\n" +
    "<copy-to-clipboard display-wide=\"true\" clipboard-text=\"'oc project <project-name>'\"></copy-to-clipboard>\n" +
    "</p>\n" +
    "<p>If you do not have any existing projects, you can create one:\n" +
    "<copy-to-clipboard display-wide=\"true\" clipboard-text=\"'oc new-project <project-name>'\"></copy-to-clipboard>\n" +
    "</p>\n" +
    "<p>To show a high level overview of the current project:\n" +
    "<copy-to-clipboard display-wide=\"true\" clipboard-text=\"'oc status'\"></copy-to-clipboard>\n" +
    "</p>\n" +
    "<p>For other information about the command line tools, check the <a target=\"_blank\" href=\"{{'cli' | helpLink}}\">CLI Reference</a> and <a target=\"_blank\" href=\"{{'basic_cli_operations' | helpLink}}\">Basic CLI Operations</a>.</p>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/create-config-map.html',
    "<default-header class=\"top-header\"></default-header>\n" +
    "<div class=\"wrap no-sidebar\">\n" +
    "<div class=\"sidebar-left collapse navbar-collapse navbar-collapse-2\">\n" +
    "<navbar-utility-mobile></navbar-utility-mobile>\n" +
    "</div>\n" +
    "<div class=\"middle surface-shaded\">\n" +
    "\n" +
    "<div class=\"middle-section\">\n" +
    "<div class=\"middle-container\">\n" +
    "<div class=\"middle-content\">\n" +
    "<div class=\"container surface-shaded\">\n" +
    "<div class=\"row\">\n" +
    "<div class=\"col-md-10 col-md-offset-1\">\n" +
    "<breadcrumbs breadcrumbs=\"breadcrumbs\"></breadcrumbs>\n" +
    "<alerts alerts=\"alerts\"></alerts>\n" +
    "<div class=\"mar-top-xl\">\n" +
    "<h1>Create Config Map</h1>\n" +
    "<div class=\"help-block\">\n" +
    "Config maps hold key-value pairs that can be used in pods to read application configuration.\n" +
    "</div>\n" +
    "<form name=\"createConfigMapForm\" class=\"mar-top-xl\">\n" +
    "<fieldset ng-disabled=\"disableInputs\">\n" +
    "<edit-config-map model=\"configMap\" show-name-input=\"true\"></edit-config-map>\n" +
    "<div class=\"button-group gutter-top gutter-bottom\">\n" +
    "<button type=\"submit\" class=\"btn btn-primary btn-lg\" ng-click=\"createConfigMap()\" ng-disabled=\"createConfigMapForm.$invalid || disableInputs\" value=\"\">Create</button>\n" +
    "<a class=\"btn btn-default btn-lg\" href=\"#\" back>Cancel</a>\n" +
    "</div>\n" +
    "</fieldset>\n" +
    "</form>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/create-from-url.html',
    "<default-header class=\"top-header\"></default-header>\n" +
    "<div class=\"wrap no-sidebar\">\n" +
    "<div class=\"sidebar-left collapse navbar-collapse navbar-collapse-2\">\n" +
    "<navbar-utility-mobile></navbar-utility-mobile>\n" +
    "</div>\n" +
    "<div class=\"middle surface-shaded\">\n" +
    "\n" +
    "<div class=\"middle-section\">\n" +
    "<div class=\"middle-container\">\n" +
    "<div class=\"middle-content\">\n" +
    "<div class=\"container surface-shaded gutter-top\">\n" +
    "<div class=\"row\">\n" +
    "<div class=\"col-md-12\">\n" +
    "<div ng-if=\"!loaded\">Loading...</div>\n" +
    "<div ng-if=\"loaded\">\n" +
    "<alerts alerts=\"alerts\" hide-close-button=\"true\"></alerts>\n" +
    "<osc-image-summary resource=\"resource\"></osc-image-summary>\n" +
    "<p ng-if=\"validationPassed && createDetails.sourceURI\">Source code from <a href=\"{{createDetails.sourceURI}}\">{{createDetails.sourceURI}}</a> will be built and deployed unless otherwise specified in the next step.</p>\n" +
    "<div ng-if=\"validationPassed\">\n" +
    "<div ng-if=\"noProjects && canCreateProject\">\n" +
    "<h2>Create a New Project</h2>\n" +
    "<create-project alerts=\"alerts\" submit-button-label=\"Next\" redirect-action=\"createWithProject\"></create-project>\n" +
    "</div>\n" +
    "<div ng-if=\"!noProjects && !canCreateProject\">\n" +
    "<h2>Choose a Project</h2>\n" +
    "<ui-select ng-model=\"selected.project\">\n" +
    "<ui-select-match placeholder=\"Project name\">\n" +
    "{{$select.selected | displayName}}\n" +
    "</ui-select-match>\n" +
    "<ui-select-choices repeat=\"project in projects | searchProjects : $select.search\">\n" +
    "<span ng-bind-html=\"project | displayName | highlightKeywords : $select.search\"></span>\n" +
    "<span ng-if=\"project | displayName : true\" class=\"small text-muted\">\n" +
    "&ndash;\n" +
    "<span ng-bind-html=\"project.metadata.name | highlightKeywords : $select.search\"></span>\n" +
    "</span>\n" +
    "</ui-select-choices>\n" +
    "</ui-select>\n" +
    "</div>\n" +
    "<div ng-if=\"!noProjects && canCreateProject\">\n" +
    "<uib-tabset>\n" +
    "<uib-tab>\n" +
    "<uib-tab-heading>Choose Existing Project</uib-tab-heading>\n" +
    "<ui-select ng-model=\"selected.project\">\n" +
    "<ui-select-match placeholder=\"Project name\">\n" +
    "{{$select.selected | displayName}}\n" +
    "</ui-select-match>\n" +
    "<ui-select-choices repeat=\"project in projects | searchProjects : $select.search\">\n" +
    "<span ng-bind-html=\"project | displayName | highlightKeywords : $select.search\"></span>\n" +
    "<span ng-if=\"project | displayName : true\" class=\"small text-muted\">\n" +
    "&ndash;\n" +
    "<span ng-bind-html=\"project.metadata.name | highlightKeywords : $select.search\"></span>\n" +
    "</span>\n" +
    "</ui-select-choices>\n" +
    "</ui-select>\n" +
    "<div class=\"button-group mar-bottom-lg mar-top-lg\">\n" +
    "<button type=\"submit\" class=\"btn btn-primary btn-lg\" ng-click=\"createWithProject()\" ng-disabled=\"!(selected.project)\" value=\"\">Next</button>\n" +
    "<a class=\"btn btn-default btn-lg\" href=\"#\" back>Cancel</a>\n" +
    "</div>\n" +
    "</uib-tab>\n" +
    "<uib-tab>\n" +
    "<uib-tab-heading>Create a New Project</uib-tab-heading>\n" +
    "<create-project alerts=\"alerts\" submit-button-label=\"Next\" redirect-action=\"createWithProject\"></create-project>\n" +
    "</uib-tab>\n" +
    "</uib-tabset>\n" +
    "</div>\n" +
    "<p ng-if=\"!canCreateProject\" class=\"mar-top-md\">\n" +
    "<span ng-if=\"noProjects\">A project is required in order to complete the installation.</span>\n" +
    "<ng-include src=\"'views/_cannot-create-project.html'\"></ng-include>\n" +
    "</p>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/create-persistent-volume-claim.html',
    "<default-header class=\"top-header\"></default-header>\n" +
    "<div class=\"wrap no-sidebar\">\n" +
    "<div class=\"sidebar-left collapse navbar-collapse navbar-collapse-2\">\n" +
    "<navbar-utility-mobile></navbar-utility-mobile>\n" +
    "</div>\n" +
    "<div class=\"middle surface-shaded\">\n" +
    "\n" +
    "<div class=\"middle-section\">\n" +
    "<div class=\"middle-container\">\n" +
    "<div class=\"middle-content\">\n" +
    "<div class=\"container surface-shaded\">\n" +
    "<div class=\"row\">\n" +
    "<div class=\"col-md-10 col-md-offset-1\">\n" +
    "<breadcrumbs breadcrumbs=\"breadcrumbs\"></breadcrumbs>\n" +
    "<alerts alerts=\"alerts\"></alerts>\n" +
    "<div class=\"mar-top-xl\">\n" +
    "<h1>Create Storage</h1>\n" +
    "<div class=\"help-block\">\n" +
    "Create a request for an administrator-defined storage asset by specifying size and permissions for a best fit.\n" +
    "<a href=\"{{'persistent_volumes' | helpLink}}\" target=\"_blank\"><span class=\"learn-more-inline\">Learn More&nbsp;<i class=\"fa fa-external-link\" aria-hidden=\"true\"></i></span></a>\n" +
    "</div>\n" +
    "<form name=\"createPersistentVolumeClaimForm\" class=\"mar-top-lg\">\n" +
    "<fieldset ng-disabled=\"disableInputs\">\n" +
    "<osc-persistent-volume-claim model=\"claim\" project-name=\"projectName\"></osc-persistent-volume-claim>\n" +
    "<div class=\"button-group gutter-bottom\">\n" +
    "<button type=\"submit\" class=\"btn btn-primary btn-lg\" ng-click=\"createPersistentVolumeClaim()\" ng-disabled=\"createPersistentVolumeClaimForm.$invalid || disableInputs\" value=\"\">Create</button>\n" +
    "<a class=\"btn btn-default btn-lg\" href=\"\" back>Cancel</a>\n" +
    "</div>\n" +
    "</fieldset>\n" +
    "</form>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/create-project.html',
    "<default-header class=\"top-header\"></default-header>\n" +
    "<div class=\"wrap no-sidebar\">\n" +
    "<div class=\"sidebar-left collapse navbar-collapse navbar-collapse-2\">\n" +
    "<navbar-utility-mobile></navbar-utility-mobile>\n" +
    "</div>\n" +
    "<div class=\"middle surface-shaded\">\n" +
    "\n" +
    "<div class=\"middle-section\">\n" +
    "<div class=\"middle-container\">\n" +
    "<div class=\"middle-content\">\n" +
    "<div class=\"container surface-shaded gutter-top\">\n" +
    "<div class=\"col-md-12\">\n" +
    "<h1>New Project</h1>\n" +
    "<alerts alerts=\"alerts\"></alerts>\n" +
    "<create-project alerts=\"alerts\"></create-project>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/create-route.html',
    "<default-header class=\"top-header\"></default-header>\n" +
    "<div class=\"wrap no-sidebar\">\n" +
    "<div class=\"sidebar-left collapse navbar-collapse navbar-collapse-2\">\n" +
    "<navbar-utility-mobile></navbar-utility-mobile>\n" +
    "</div>\n" +
    "<div class=\"middle surface-shaded\">\n" +
    "\n" +
    "<div class=\"middle-section\">\n" +
    "<div class=\"middle-container\">\n" +
    "<div class=\"middle-content\">\n" +
    "<div class=\"container surface-shaded\">\n" +
    "<div class=\"row\">\n" +
    "<div class=\"col-md-10 col-md-offset-1\">\n" +
    "<breadcrumbs breadcrumbs=\"breadcrumbs\"></breadcrumbs>\n" +
    "<alerts alerts=\"alerts\"></alerts>\n" +
    "<div class=\"mar-top-xl\">\n" +
    "<h1>Create Route</h1>\n" +
    "<div class=\"help-block\">\n" +
    "Routing is a way to make your application publicly visible.\n" +
    "</div>\n" +
    "<form name=\"createRouteForm\" class=\"mar-top-xl osc-form\">\n" +
    "<div ng-if=\"!services\">Loading...</div>\n" +
    "<div ng-if=\"services\">\n" +
    "<fieldset ng-disabled=\"disableInputs\">\n" +
    "<osc-routing model=\"routing\" services=\"services\" show-name-input=\"true\">\n" +
    "</osc-routing>\n" +
    "<label-editor labels=\"labels\" expand=\"true\" can-toggle=\"false\" help-text=\"Labels for this route.\">\n" +
    "</label-editor>\n" +
    "<a href=\"\" ng-click=\"copyServiceLabels()\">Copy Service Labels</a>\n" +
    "<div class=\"button-group gutter-top gutter-bottom\">\n" +
    "<button type=\"submit\" class=\"btn btn-primary btn-lg\" ng-click=\"createRoute()\" ng-disabled=\"createRouteForm.$invalid || disableInputs || !createRoute\" value=\"\">Create</button>\n" +
    "<a class=\"btn btn-default btn-lg\" href=\"#\" back>Cancel</a>\n" +
    "</div>\n" +
    "</fieldset>\n" +
    "</div>\n" +
    "</form>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/create-secret.html',
    "<default-header class=\"top-header\"></default-header>\n" +
    "<div class=\"wrap no-sidebar\">\n" +
    "<div class=\"sidebar-left collapse navbar-collapse navbar-collapse-2\">\n" +
    "<navbar-utility-mobile></navbar-utility-mobile>\n" +
    "</div>\n" +
    "<div class=\"middle surface-shaded\">\n" +
    "\n" +
    "<div class=\"middle-section\">\n" +
    "<div class=\"middle-container\">\n" +
    "<div class=\"middle-content\">\n" +
    "<div class=\"container surface-shaded\">\n" +
    "<div class=\"row\">\n" +
    "<div class=\"col-md-10 col-md-offset-1\">\n" +
    "<div ng-if=\"!project\" class=\"mar-top-md\">Loading...</div>\n" +
    "<div ng-if=\"project\">\n" +
    "<breadcrumbs breadcrumbs=\"breadcrumbs\"></breadcrumbs>\n" +
    "<alerts alerts=\"alerts\"></alerts>\n" +
    "<div class=\"mar-top-xl\">\n" +
    "<h1>Create Secret</h1>\n" +
    "<div class=\"help-block\">\n" +
    "Secrets allow you to authenticate to a private Git repository or a private image registry.\n" +
    "</div>\n" +
    "<create-secret namespace=\"projectName\" alerts=\"alerts\" post-create-action=\"postCreateAction(newSecret, creationAlert)\" cancel=\"cancel()\">\n" +
    "</create-secret>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/create.html',
    "<default-header class=\"top-header\"></default-header>\n" +
    "<div class=\"wrap no-sidebar\">\n" +
    "<div class=\"sidebar-left collapse navbar-collapse navbar-collapse-2\">\n" +
    "<navbar-utility-mobile></navbar-utility-mobile>\n" +
    "</div>\n" +
    "<div class=\"add-to-project middle surface-shaded\">\n" +
    "\n" +
    "<div class=\"middle-section\">\n" +
    "<div class=\"middle-container\">\n" +
    "<div class=\"middle-content\" persist-tab-state>\n" +
    "<div class=\"container surface-shaded\">\n" +
    "<breadcrumbs breadcrumbs=\"breadcrumbs\"></breadcrumbs>\n" +
    "<alerts alerts=\"alerts\"></alerts>\n" +
    "<div class=\"row\">\n" +
    "<div class=\"col-md-12\">\n" +
    "<uib-tabset class=\"mar-top-none\">\n" +
    "<uib-tab active=\"selectedTab.fromCatalog\">\n" +
    "<uib-tab-heading>Browse Catalog</uib-tab-heading>\n" +
    "<catalog project-name=\"projectName\" project-image-streams=\"projectImageStreams\" openshift-image-streams=\"openshiftImageStreams\" project-templates=\"projectTemplates\" openshift-templates=\"openshiftTemplates\">\n" +
    "</catalog>\n" +
    "</uib-tab>\n" +
    "<uib-tab active=\"selectedTab.deployImage\">\n" +
    "<uib-tab-heading>Deploy Image</uib-tab-heading>\n" +
    "<deploy-image project=\"projectName\" context=\"context\" alerts=\"alerts\"></deploy-image>\n" +
    "</uib-tab>\n" +
    "<uib-tab active=\"selectedTab.fromFile\">\n" +
    "<uib-tab-heading>Import YAML / JSON</uib-tab-heading>\n" +
    "<from-file></from-file>\n" +
    "</uib-tab>\n" +
    "</uib-tabset>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/create/category.html',
    "<default-header class=\"top-header\"></default-header>\n" +
    "<div class=\"wrap no-sidebar\">\n" +
    "<div class=\"sidebar-left collapse navbar-collapse navbar-collapse-2\">\n" +
    "<navbar-utility-mobile></navbar-utility-mobile>\n" +
    "</div>\n" +
    "<div class=\"middle surface-shaded\">\n" +
    "\n" +
    "<div class=\"middle-section\">\n" +
    "<div class=\"middle-container\">\n" +
    "<div class=\"middle-content\">\n" +
    "<div class=\"container surface-shaded\">\n" +
    "<breadcrumbs breadcrumbs=\"breadcrumbs\"></breadcrumbs>\n" +
    "<div class=\"row\">\n" +
    "<div class=\"col-md-12\">\n" +
    "<h1>{{category.label}}</h1>\n" +
    "<div ng-if=\"category.description\" class=\"help-block mar-bottom-lg\">{{category.description}}</div>\n" +
    "\n" +
    "<div ng-if=\"category.subcategories\">\n" +
    "<catalog project-name=\"projectName\" project-image-streams=\"projectImageStreams\" openshift-image-streams=\"openshiftImageStreams\" project-templates=\"projectTemplates\" openshift-templates=\"openshiftTemplates\" category=\"category\">\n" +
    "</catalog>\n" +
    "</div>\n" +
    "\n" +
    "<div ng-if=\"!category.subcategories\">\n" +
    "<category-content project-name=\"projectName\" project-image-streams=\"projectImageStreams\" openshift-image-streams=\"openshiftImageStreams\" project-templates=\"projectTemplates\" openshift-templates=\"openshiftTemplates\" category=\"category\">\n" +
    "</category-content>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/create/fromimage.html',
    "<default-header class=\"top-header\"></default-header>\n" +
    "<div class=\"wrap no-sidebar\">\n" +
    "<div class=\"sidebar-left collapse navbar-collapse navbar-collapse-2\">\n" +
    "<navbar-utility-mobile></navbar-utility-mobile>\n" +
    "</div>\n" +
    "<div class=\"middle surface-shaded\">\n" +
    "\n" +
    "<div class=\"middle-section\">\n" +
    "<div class=\"middle-container\">\n" +
    "<div class=\"middle-content\">\n" +
    "<div class=\"container surface-shaded\">\n" +
    "<div class=\"row\">\n" +
    "<div class=\"col-md-12\">\n" +
    "<breadcrumbs breadcrumbs=\"breadcrumbs\"></breadcrumbs>\n" +
    "<div ng-if=\"imageStream\">\n" +
    "{{ emptyMessage }}\n" +
    "</div>\n" +
    "<div class=\"osc-form\" ng-show=\"imageStream\">\n" +
    "<alerts alerts=\"alerts\"></alerts>\n" +
    "<div class=\"row\">\n" +
    "<div class=\"col-md-2 icon hidden-sm hidden-xs\">\n" +
    "<custom-icon resource=\"imageStream\" kind=\"image\" tag=\"imageTag\"></custom-icon>\n" +
    "</div>\n" +
    "<div class=\"col-md-8\">\n" +
    "<fieldset ng-disabled=\"disableInputs\">\n" +
    "<osc-image-summary resource=\"image\" name=\"displayName || imageName\" tag=\"imageTag\"></osc-image-summary>\n" +
    "<div class=\"clearfix visible-xs-block\"></div>\n" +
    "<form class=\"\" ng-show=\"imageStream\" novalidate name=\"form\" ng-submit=\"createApp()\">\n" +
    "<div style=\"margin-bottom: 15px\">\n" +
    "<div class=\"form-group\">\n" +
    "<label for=\"appname\" class=\"required\">Name</label>\n" +
    "\n" +
    "<div ng-class=\"{'has-error': (form.appname.$error.required && form.appname.$dirty) || (form.appname.$invalid && shouldValidateName) || nameTaken}\">\n" +
    "<input type=\"text\" required take-focus minlength=\"2\" maxlength=\"24\" pattern=\"[a-z]([-a-z0-9]*[a-z0-9])?\" ng-model=\"name\" id=\"appname\" name=\"appname\" ng-change=\"nameTaken = false\" ng-blur=\"shouldValidateName = form.appname.$dirty\" class=\"form-control\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\">\n" +
    "</div>\n" +
    "<div class=\"help-block\">Identifies the resources created for this application.</div>\n" +
    "<div class=\"has-error\" ng-show=\"form.appname.$error.required && form.appname.$dirty\">\n" +
    "<span class=\"help-block\">A name is required.</span>\n" +
    "</div>\n" +
    "<div class=\"has-error\" ng-show=\"form.appname.$error.pattern && shouldValidateName\">\n" +
    "<span class=\"help-block\"><strong>Please enter a valid name.</strong>\n" +
    "<p>A valid name is applied to all generated resources. It is an alphanumeric (a-z, and 0-9) string with a maximum length of 24 characters, where the first character is a letter (a-z), and the '-' character is allowed anywhere except the first or last character.</p>\n" +
    "</span>\n" +
    "</div>\n" +
    "<div class=\"has-error\" ng-show=\"form.appname.$error.minlength && shouldValidateName\">\n" +
    "<span class=\"help-block\">The name must have at least 2 characters.</span>\n" +
    "</div>\n" +
    "<div class=\"has-error\" ng-show=\"nameTaken\">\n" +
    "<span class=\"help-block\">This name is already in use within the project. Please choose a different name.</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"row\">\n" +
    "<div ng-class=\"{\n" +
    "                              'col-md-8': advancedOptions || advancedSourceOptions,\n" +
    "                              'col-lg-12': !advancedOptions && !advancedSourceOptions\n" +
    "                            }\">\n" +
    "<div class=\"form-group\">\n" +
    "<label for=\"sourceUrl\" class=\"required\">Git Repository URL</label>\n" +
    "<div ng-class=\"{\n" +
    "                                  'has-warning': buildConfig.sourceUrl && form.sourceUrl.$touched && !sourceURLPattern.test(buildConfig.sourceUrl),\n" +
    "                                  'has-error': (form.sourceUrl.$error.required && form.sourceUrl.$dirty)\n" +
    "                                }\">\n" +
    "\n" +
    "<input class=\"form-control\" id=\"sourceUrl\" name=\"sourceUrl\" type=\"text\" required aria-describedby=\"from_source_help\" ng-model=\"buildConfig.sourceUrl\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\">\n" +
    "</div>\n" +
    "<div ng-if=\"!(sourceURIinParams) && image.metadata.annotations.sampleRepo\" class=\"help-block\">\n" +
    "Sample repository for {{imageName}}: {{image.metadata.annotations.sampleRepo}}<span ng-if=\"image.metadata.annotations.sampleRef\">, ref: {{image.metadata.annotations.sampleRef}}</span><span ng-if=\"image.metadata.annotations.sampleContextDir\">, context dir: {{image.metadata.annotations.sampleContextDir}}</span>\n" +
    "<a href=\"\" ng-click=\"fillSampleRepo()\" style=\"margin-left: 3px\" class=\"nowrap\">Try It<i class=\"fa fa-level-up\" style=\"margin-left: 3px; font-size: 17px\"></i></a>\n" +
    "</div>\n" +
    "<div class=\"has-error\" ng-show=\"form.sourceUrl.$error.required && form.sourceUrl.$dirty\">\n" +
    "<span class=\"help-block\">A Git repository URL is required.</span>\n" +
    "</div>\n" +
    "<div class=\"has-warning\" ng-if=\"buildConfig.sourceUrl && form.sourceUrl.$touched && !sourceURLPattern.test(buildConfig.sourceUrl)\">\n" +
    "<span class=\"help-block\">This might not be a valid Git URL. Check that it is the correct URL to a remote Git repository.</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"col-md-4\" ng-show=\"advancedOptions || advancedSourceOptions\">\n" +
    "<div class=\"form-group\">\n" +
    "<label for=\"gitref\">Git Reference</label>\n" +
    "<div>\n" +
    "<input id=\"gitref\" ng-model=\"buildConfig.gitRef\" type=\"text\" placeholder=\"master\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\" class=\"form-control\">\n" +
    "</div>\n" +
    "<div class=\"help-block\">Optional branch, tag, or commit.</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "\n" +
    "<div ng-show=\"advancedOptions || advancedSourceOptions\" class=\"form-group\">\n" +
    "<label for=\"contextdir\">Context Dir</label>\n" +
    "<div>\n" +
    "<input id=\"contextdir\" ng-model=\"buildConfig.contextDir\" type=\"text\" placeholder=\"/\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\" class=\"form-control\">\n" +
    "</div>\n" +
    "<div class=\"help-block\">Optional subdirectory for the application source code, used as the context directory for the build.</div>\n" +
    "</div>\n" +
    "\n" +
    "<div ng-show=\"advancedOptions\">\n" +
    "\n" +
    "<div class=\"form-group\" ng-if=\"project\">\n" +
    "<osc-secrets model=\"buildConfig.secrets.gitSecret\" namespace=\"projectName\" display-type=\"source\" type=\"source\" service-account-to-link=\"builder\" secrets-by-type=\"secretsByType\" alerts=\"alerts\" allow-multiple-secrets=\"false\">\n" +
    "</osc-secrets>\n" +
    "</div>\n" +
    "\n" +
    "<osc-form-section header=\"Routing\" about-title=\"Routing\" about=\"Routing is a way to make your application publicly visible. Otherwise you may only be able to access your application by its IP address, if allowed by the system administrator.\" expand=\"true\" can-toggle=\"false\" ng-if=\"routing.portOptions.length\">\n" +
    "<div class=\"form-group checkbox\">\n" +
    "<label>\n" +
    "<input type=\"checkbox\" ng-model=\"routing.include\">\n" +
    "Create a route to the application\n" +
    "</label>\n" +
    "</div>\n" +
    "<osc-routing model=\"routing\" routing-disabled=\"!routing.include\">\n" +
    "</osc-routing>\n" +
    "</osc-form-section>\n" +
    "\n" +
    "<osc-form-section header=\"Build Configuration\" about-title=\"Build Configuration\" about=\"A build configuration describes how to build your deployable image.  This includes\n" +
    "                                your source, the base builder image, and when to launch new builds.\" expand=\"true\" can-toggle=\"false\">\n" +
    "<div class=\"checkbox\">\n" +
    "<label>\n" +
    "<input type=\"checkbox\" ng-model=\"buildConfig.buildOnSourceChange\"/>\n" +
    "Configure a webhook build trigger\n" +
    "<span class=\"help action-inline\">\n" +
    "<a href data-toggle=\"tooltip\" data-original-title=\"The source repository must be configured to use the webhook to trigger a build when source is committed.\">\n" +
    "<i class=\"pficon pficon-help\"></i>\n" +
    "</a>\n" +
    "</span>\n" +
    "</label>\n" +
    "</div>\n" +
    "<div class=\"checkbox\">\n" +
    "<label>\n" +
    "<input type=\"checkbox\" ng-model=\"buildConfig.buildOnImageChange\"/>\n" +
    "Automatically build a new image when the builder image changes\n" +
    "<span class=\"help action-inline\">\n" +
    "<a href data-toggle=\"tooltip\" data-original-title=\"Automatically building a new image when the builder image changes allows your code to always run on the latest updates.\">\n" +
    "<i class=\"pficon pficon-help\"></i>\n" +
    "</a>\n" +
    "</span>\n" +
    "</label>\n" +
    "</div>\n" +
    "<div class=\"checkbox\">\n" +
    "<label>\n" +
    "<input type=\"checkbox\" ng-model=\"buildConfig.buildOnConfigChange\"/>\n" +
    "Launch the first build when the build configuration is created\n" +
    "</label>\n" +
    "</div>\n" +
    "<h3>Environment Variables <span class=\"appended-icon\">(Build and Runtime) <span class=\"help action-inline\">\n" +
    "<a href data-toggle=\"tooltip\" data-original-title=\"Environment variables are used to configure and pass information to running containers.  These environment variables will be available during your build and at runtime.\">\n" +
    "<i class=\"pficon pficon-help\"></i>\n" +
    "</a>\n" +
    "</span></span></h3>\n" +
    "<key-value-editor entries=\"buildConfigEnvVars\" key-placeholder=\"name\" value-placeholder=\"value\" key-validator=\"[a-zA-Z_][a-zA-Z0-9_]*\" key-validator-error-tooltip=\"A valid environment variable name is an alphanumeric (a-z and 0-9) string beginning with a letter that may contain underscores.\" add-row-link=\"Add Environment Variable\"></key-value-editor>\n" +
    "</osc-form-section>\n" +
    "\n" +
    "<osc-form-section header=\"Deployment Configuration\" about-title=\"Deployment Configuration\" about=\"Deployment configurations describe how your application is configured\n" +
    "                                by the cluster and under what conditions it should be recreated (e.g. when the image changes).\" expand=\"true\" can-toggle=\"false\">\n" +
    "<div class=\"animate-drawer\" ng-show=\"$parent.expand\">\n" +
    "<h3>Autodeploy when</h3>\n" +
    "<div class=\"checkbox\">\n" +
    "<label>\n" +
    "<input type=\"checkbox\" ng-model=\"deploymentConfig.deployOnNewImage\">\n" +
    "New image is available\n" +
    "</label>\n" +
    "</div>\n" +
    "<div class=\"checkbox\">\n" +
    "<label>\n" +
    "<input type=\"checkbox\" ng-model=\"deploymentConfig.deployOnConfigChange\">\n" +
    "Deployment configuration changes\n" +
    "</label>\n" +
    "</div>\n" +
    "<div>\n" +
    "<h3>Environment Variables <span class=\"appended-icon\">(Runtime only) <span class=\"help action-inline\">\n" +
    "<a href=\"\" data-toggle=\"tooltip\" data-original-title=\"Environment variables are used to configure and pass information to running containers.  These environment variables will only be available at runtime.\">\n" +
    "<i class=\"pficon pficon-help\"></i>\n" +
    "</a>\n" +
    "</span></span></h3>\n" +
    "<p ng-show=\"DCEnvVarsFromImage.length\">\n" +
    "<a href=\"\" ng-click=\"showDCEnvs = (!showDCEnvs)\">\n" +
    "{{showDCEnvs ? 'Hide' : 'Show'}} Image Environment Variables\n" +
    "</a>\n" +
    "</p>\n" +
    "<div ng-show=\"showDCEnvs\">\n" +
    "<div class=\"help-block\">\n" +
    "<p>These variables exist on the image and will be available at runtime. You may override them below.</p>\n" +
    "</div>\n" +
    "<key-value-editor entries=\"DCEnvVarsFromImage\" is-readonly cannot-add cannot-sort cannot-delete></key-value-editor>\n" +
    "</div>\n" +
    "<key-value-editor entries=\"DCEnvVarsFromUser\" key-placeholder=\"name\" value-placeholder=\"value\" key-validator=\"[a-zA-Z_][a-zA-Z0-9_]*\" key-validator-error-tooltip=\"A valid environment variable name is an alphanumeric (a-z and 0-9) string beginning with a letter that may contain underscores.\" add-row-link=\"Add Environment Variable\"></key-value-editor>\n" +
    "</div>\n" +
    "</div>\n" +
    "</osc-form-section>\n" +
    "\n" +
    "<osc-form-section header=\"Scaling\" about-title=\"Scaling\" about=\"Scaling defines the number of running instances of your built image.\" expand=\"true\" can-toggle=\"false\">\n" +
    "<div class=\"form-group\">\n" +
    "<label for=\"scale-type\">Strategy</label>\n" +
    "<ui-select ng-model=\"scaling.autoscale\" input-id=\"scale-type\" search-enabled=\"false\" aria-describedby=\"scale-type-help\">\n" +
    "<ui-select-match>{{$select.selected.label}}</ui-select-match>\n" +
    "<ui-select-choices repeat=\"option.value as option in scaling.autoscaleOptions\">\n" +
    "{{option.label}}\n" +
    "</ui-select-choices>\n" +
    "</ui-select>\n" +
    "<div class=\"help-block\" id=\"scale-type-help\">\n" +
    "Scale replicas manually or automatically based on CPU usage.\n" +
    "</div>\n" +
    "<div class=\"learn-more-block\">\n" +
    "<a href=\"{{'pod_autoscaling' | helpLink}}\" target=\"_blank\">Learn More&nbsp;<i class=\"fa fa-external-link\" aria-hidden=\"true\"></i></a>\n" +
    "</div>\n" +
    "<div class=\"has-warning\" ng-if=\"metricsWarning && scaling.autoscale\">\n" +
    "<span class=\"help-block\">\n" +
    "CPU metrics might not be available. In order to use horizontal pod autoscalers, your cluster administrator must have properly configured cluster metrics.\n" +
    "</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"form-group\" ng-if=\"!scaling.autoscale\">\n" +
    "<label class=\"number\">Replicas</label>\n" +
    "<input type=\"number\" class=\"form-control\" min=\"0\" name=\"replicas\" ng-model=\"scaling.replicas\" ng-required=\"!scaling.autoscale\" ng-disabled=\"scaling.autoscale\" ng-pattern=\"/^\\d+$/\" aria-describedby=\"replicas-help\">\n" +
    "<div id=\"replicas-help\">\n" +
    "<span class=\"help-block\">The number of instances of your image.</span>\n" +
    "</div>\n" +
    "<div class=\"has-error\" ng-show=\"form.replicas.$dirty && form.replicas.$invalid\">\n" +
    "<span class=\"help-block\">Replicas must be an integer value greater than or equal to 0.</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "<osc-autoscaling ng-if=\"scaling.autoscale\" model=\"scaling\" project=\"project\">\n" +
    "</osc-autoscaling>\n" +
    "<div class=\"has-warning\" ng-if=\"showCPURequestWarning\">\n" +
    "<span class=\"help-block\">\n" +
    "You should configure resource limits below for autoscaling. Autoscaling will not work without a CPU\n" +
    "<span ng-if=\"'cpu' | isRequestCalculated : project\">limit.</span>\n" +
    "<span ng-if=\"!('cpu' | isRequestCalculated : project)\">request.</span>\n" +
    "<span ng-if=\"'cpu' | isLimitCalculated : project\">\n" +
    "The CPU limit will be automatically calculated from the container memory limit.\n" +
    "</span>\n" +
    "</span>\n" +
    "</div>\n" +
    "</osc-form-section>\n" +
    "\n" +
    "<osc-form-section header=\"Resource Limits\" about-title=\"Resource Limits\" about=\"Resource limits control compute resource usage by a container on a node.\" expand=\"true\" can-toggle=\"false\">\n" +
    "<edit-request-limit resources=\"container.resources\" type=\"cpu\" limit-ranges=\"limitRanges\" project=\"project\">\n" +
    "</edit-request-limit>\n" +
    "<edit-request-limit resources=\"container.resources\" type=\"memory\" limit-ranges=\"limitRanges\" project=\"project\">\n" +
    "</edit-request-limit>\n" +
    "<div ng-repeat=\"problem in cpuProblems\" class=\"has-error\">\n" +
    "<span class=\"help-block\">{{problem}}</span>\n" +
    "</div>\n" +
    "<div ng-repeat=\"problem in memoryProblems\" class=\"has-error\">\n" +
    "<span class=\"help-block\">{{problem}}</span>\n" +
    "</div>\n" +
    "</osc-form-section>\n" +
    "\n" +
    "<label-editor labels=\"userDefinedLabels\" system-labels=\"systemLabels\" expand=\"true\" can-toggle=\"false\" help-text=\"Each label is applied to each created resource.\">\n" +
    "</label-editor>\n" +
    "</div>\n" +
    "<div class=\"mar-top-md\">\n" +
    "<span ng-if=\"!advancedOptions\">Show</span>\n" +
    "<span ng-if=\"advancedOptions\">Hide</span>\n" +
    "<a href=\"\" ng-click=\"advancedOptions = !advancedOptions\" role=\"button\">advanced options</a>\n" +
    "for source, routes, builds, and deployments.\n" +
    "</div>\n" +
    "<alerts alerts=\"quotaAlerts\"></alerts>\n" +
    "<div class=\"buttons gutter-bottom\" ng-class=\"{'gutter-top': !alerts.length}\">\n" +
    "\n" +
    "<button type=\"submit\" class=\"btn btn-primary btn-lg\" ng-disabled=\"form.$invalid || nameTaken || cpuProblems.length || memoryProblems.length || disableInputs\">Create</button>\n" +
    "<a class=\"btn btn-default btn-lg\" href=\"{{projectName | projectOverviewURL}}\">Cancel</a>\n" +
    "</div>\n" +
    "</form>\n" +
    "</fieldset>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/create/next-steps.html',
    "<default-header class=\"top-header\"></default-header>\n" +
    "<div class=\"wrap no-sidebar\">\n" +
    "<div class=\"sidebar-left collapse navbar-collapse navbar-collapse-2\">\n" +
    "<navbar-utility-mobile></navbar-utility-mobile>\n" +
    "</div>\n" +
    "<div class=\"middle surface-shaded\">\n" +
    "\n" +
    "<div class=\"middle-section\">\n" +
    "<div class=\"middle-container\">\n" +
    "<div class=\"middle-content\">\n" +
    "<div class=\"container surface-shaded next-steps\">\n" +
    "<breadcrumbs breadcrumbs=\"breadcrumbs\"></breadcrumbs>\n" +
    "<div ng-controller=\"TasksController\">\n" +
    "<h1 ng-if=\"!tasks().length\">Completed. <a href=\"project/{{projectName}}/overview\">Go to overview</a>.</h1>\n" +
    "<h1 ng-if=\"tasks().length && allTasksSuccessful(tasks())\">Application created. <a href=\"project/{{projectName}}/overview\">Continue to overview</a>.</h1>\n" +
    "<h1 ng-if=\"pendingTasks(tasks()).length\">Creating...</h1>\n" +
    "<h1 ng-if=\"!pendingTasks(tasks()).length && erroredTasks(tasks()).length\">Completed, with errors</h1>\n" +
    "<div ng-repeat=\"task in tasks()\" ng-if=\"tasks().length && !allTasksSuccessful(tasks())\">\n" +
    "<div class=\"tasks\" ng-class=\"hasTaskWithError() ? 'failure' : 'success'\">\n" +
    "<div class=\"task-content\">\n" +
    "<i class=\"pficon task-icon\" ng-class=\"task.hasErrors ? 'pficon-error-circle-o' : 'pficon-ok'\"></i>\n" +
    "<div class=\"task-info\">\n" +
    "{{ task | taskTitle }}.\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"alerts task-expanded-details\">\n" +
    "<div ng-repeat=\"alert in task.alerts\">\n" +
    "<div ng-switch=\"alert.type\">\n" +
    "<div ng-switch-when=\"error\" class=\"alert alert-danger\">\n" +
    "<span class=\"pficon pficon-error-circle-o\"></span>\n" +
    "<span ng-if=\"alert.message\">{{alert.message}}</span><span ng-if=\"alert.details\">{{alert.details}}.</span>\n" +
    "</div>\n" +
    "<div ng-switch-when=\"warning\" class=\"alert alert-warning\">\n" +
    "<span class=\"pficon pficon-warning-triangle-o\"></span>\n" +
    "<span ng-if=\"alert.message\">{{alert.message}}</span><span ng-if=\"alert.details\">{{alert.details}}.</span>\n" +
    "</div>\n" +
    "<div ng-switch-when=\"success\" class=\"alert alert-success\">\n" +
    "<span class=\"pficon pficon-ok\"></span>\n" +
    "<span ng-if=\"alert.message\">{{alert.message}}</span><span ng-if=\"alert.details\">{{alert.details}}.</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"alert alert-info template-message\" ng-if=\"templateMessage.length\">\n" +
    "<span class=\"pficon pficon-info\" aria-hidden=\"true\"></span>\n" +
    "<div class=\"resource-description\" ng-bind-html=\"templateMessage | linkify : '_blank'\"></div>\n" +
    "</div>\n" +
    "<div class=\"row\" ng-controller=\"TasksController\">\n" +
    "<div ng-if=\"!pendingTasks(tasks()).length && erroredTasks(tasks()).length\" class=\"col-md-12\">\n" +
    "<h2>Things you can do</h2>\n" +
    "<p>Go to the <a href=\"project/{{projectName}}/overview\">overview page</a> to see more details about this project. Make sure you don't already have <a href=\"project/{{projectName}}/browse/services\">services</a>, <a href=\"project/{{projectName}}/browse/builds\">build configs</a>, <a href=\"project/{{projectName}}/browse/deployments\">deployment configs</a>, or other resources with the same names you are trying to create. Refer to the <a target=\"_blank\" href=\"{{'new_app' | helpLink}}\">documentation for creating new applications</a> for more information.</p>\n" +
    "<h3>Command line tools</h3>\n" +
    "<p>You may want to use the <code>oc</code> command line tool to help with troubleshooting. After <a target=\"_blank\" href=\"command-line\">downloading and installing</a> it, you can log in, switch to this particular project, and try some commands :</p>\n" +
    "<pre class=\"code prettyprint\">oc login {{loginBaseUrl}}\n" +
    "oc project {{projectName}}\n" +
    "oc logs -h</pre>\n" +
    "<p>For more information about the command line tools, check the <a target=\"_blank\" href=\"{{'cli' | helpLink}}\">CLI Reference</a> and <a target=\"_blank\" href=\"{{'basic_cli_operations' | helpLink}}\">Basic CLI Operations</a>.</p>\n" +
    "</div>\n" +
    "<div ng-if=\"allTasksSuccessful(tasks())\" ng-class=\"createdBuildConfigWithGitHubTrigger() ? 'col-md-6' : 'col-md-12'\">\n" +
    "<h2>Manage your app</h2>\n" +
    "<p>The web console is convenient, but if you need deeper control you may want to try our command line tools.</p>\n" +
    "<h3>Command line tools</h3>\n" +
    "<p><a target=\"_blank\" href=\"command-line\">Download and install</a> the <code>oc</code> command line tool. After that, you can start by logging in, switching to this particular project, and displaying an overview of it, by doing:</p>\n" +
    "<pre class=\"code prettyprint\">oc login {{loginBaseUrl}}\n" +
    "oc project {{projectName}}\n" +
    "oc status</pre>\n" +
    "<p>For more information about the command line tools, check the <a target=\"_blank\" href=\"{{'cli' | helpLink}}\">CLI Reference</a> and <a target=\"_blank\" href=\"{{'basic_cli_operations' | helpLink}}\">Basic CLI Operations</a>.</p>\n" +
    "</div>\n" +
    "<div ng-if=\"createdBuildConfig\" class=\"col-md-6\">\n" +
    "<h2>Making code changes</h2>\n" +
    "<p ng-if=\"fromSampleRepo\">\n" +
    "You are set up to use the example git repository. If you would like to modify the source code, fork the <osc-git-link uri=\"createdBuildConfig.spec.source.git.uri\">{{createdBuildConfig.spec.source.git.uri}}</osc-git-link> repository to an OpenShift-visible git account and <a href=\"{{createdBuildConfig | editResourceURL}}\">edit the <strong>{{createdBuildConfig.metadata.name}}</strong> build config</a> to point to your fork.\n" +
    "<span ng-if=\"createdBuildConfigWithConfigChangeTrigger()\">Note that this will start a new build.</span>\n" +
    "</p>\n" +
    "<div ng-repeat=\"trigger in createdBuildConfig.spec.triggers\" ng-if=\"trigger.type == 'GitHub'\">\n" +
    "<p>\n" +
    "A GitHub <a target=\"_blank\" href=\"{{'webhooks' | helpLink}}\">webhook trigger</a> has been created for the <strong>{{createdBuildConfig.metadata.name}}</strong> build config.\n" +
    "</p>\n" +
    "<p ng-if=\"fromSampleRepo\">\n" +
    "You can configure the webhook in the forked repository's settings, using the following payload URL:\n" +
    "</p>\n" +
    "<p ng-if=\"!fromSampleRepo\">\n" +
    "<span ng-if=\"createdBuildConfig.spec.source.git.uri | isGithubLink\">\n" +
    "You can now set up the webhook in the GitHub repository settings if you own it, in <a target=\"_blank\" class=\"word-break\" href=\"{{createdBuildConfig.spec.source.git.uri | githubLink}}/settings/hooks\">{{createdBuildConfig.spec.source.git.uri | githubLink}}/settings/hooks</a>, using the following payload URL:\n" +
    "</span>\n" +
    "<span ng-if=\"!(createdBuildConfig.spec.source.git.uri | isGithubLink)\">\n" +
    "Your source does not appear to be a URL to a GitHub repository. If you have a GitHub repository that you want to trigger this build from then use the following payload URL:\n" +
    "</span>\n" +
    "</p>\n" +
    "<copy-to-clipboard clipboard-text=\"createdBuildConfig.metadata.name | webhookURL : trigger.type : trigger.github.secret : projectName\"></copy-to-clipboard>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"parameters.all.length\">\n" +
    "<h2>Applied Parameter Values</h2>\n" +
    "<p>These parameters often include things like passwords. If you will need to reference these values later, copy them to a safe location.\n" +
    "<span ng-if=\"parameters.generated.length > 1\">Parameters <span ng-repeat=\"paramName in parameters.generated\">{{paramName}}<span ng-if=\"!$last\">, </span></span> were generated automatically.</span>\n" +
    "<span ng-if=\"parameters.generated.length === 1\">Parameter {{parameters.generated[0]}} was generated automatically.</span>\n" +
    "</p>\n" +
    "<div ng-if=\"!showParamsTable\" class=\"center\">\n" +
    "<a href=\"\" ng-click=\"toggleParamsTable()\">Show parameter values</a>\n" +
    "</div>\n" +
    "<key-value-editor ng-if=\"showParamsTable\" entries=\"parameters.all\" key-placeholder=\"Name\" value-placeholder=\"Value\" cannot-add cannot-delete cannot-sort show-header is-readonly></key-value-editor>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/deployments.html',
    "<project-header class=\"top-header\"></project-header>\n" +
    "<project-page>\n" +
    "\n" +
    "<div class=\"middle-section\">\n" +
    "<div class=\"middle-container\">\n" +
    "<div class=\"middle-header header-toolbar\">\n" +
    "<div class=\"container-fluid\">\n" +
    "<div class=\"page-header page-header-bleed-right page-header-bleed-left\">\n" +
    "<h1>\n" +
    "Deployments\n" +
    "<span class=\"page-header-link\">\n" +
    "<a ng-href=\"{{'deployments' | helpLink}}\" target=\"_blank\">\n" +
    "Learn More <i class=\"fa fa-external-link\" aria-hidden=\"true\"></i>\n" +
    "</a>\n" +
    "</span>\n" +
    "</h1>\n" +
    "</div>\n" +
    "<div ng-if=\"!renderOptions.showGetStarted\" class=\"data-toolbar\">\n" +
    "<div class=\"data-toolbar-filter\">\n" +
    "<project-filter></project-filter>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"middle-content\">\n" +
    "<div class=\"container-fluid\">\n" +
    "<alerts alerts=\"alerts\"></alerts>\n" +
    "<div class=\"row\">\n" +
    "<div class=\"col-md-12\">\n" +
    "<h3 ng-if=\"(deployments | hashSize) || (replicaSets | hashSize)\">Deployment Configurations</h3>\n" +
    "<table class=\"table table-bordered table-hover table-mobile table-layout-fixed\">\n" +
    "<colgroup>\n" +
    "<col class=\"col-sm-3\">\n" +
    "<col class=\"col-sm-2\">\n" +
    "<col class=\"col-sm-3\">\n" +
    "<col class=\"col-sm-2\">\n" +
    "<col class=\"col-sm-2\">\n" +
    "</colgroup>\n" +
    "<thead>\n" +
    "<tr>\n" +
    "<th>Name</th>\n" +
    "<th>Last Version</th>\n" +
    "<th>Status</th>\n" +
    "<th>Created</th>\n" +
    "<th>Trigger</th>\n" +
    "</tr>\n" +
    "</thead>\n" +
    "\n" +
    "<tbody ng-if=\"showEmptyMessage()\">\n" +
    "\n" +
    "<tr><td colspan=\"5\"><em>{{emptyMessage}}</em></td></tr>\n" +
    "</tbody>\n" +
    "<tbody ng-if=\"!showEmptyMessage()\">\n" +
    "<tr ng-repeat-start=\"(dcName, replicationControllersForDC) in replicationControllersByDC\" ng-if=\"dcName && (deploymentConfigs[dcName] || !unfilteredDeploymentConfigs[dcName])\" style=\"display: none\"></tr>\n" +
    "\n" +
    "<tr ng-if=\"(replicationControllersForDC | hashSize) == 0 && dcName\">\n" +
    "<td data-title=\"Name\">\n" +
    "<a ng-if=\"deploymentConfigs[dcName]\" href=\"{{dcName | navigateResourceURL : 'DeploymentConfig' : projectName}}\">{{dcName}}</a>\n" +
    "<span ng-if=\"deploymentConfigs[dcName].status.details.message\" class=\"pficon pficon-warning-triangle-o\" style=\"cursor: help\" data-toggle=\"popover\" data-trigger=\"hover\" dynamic-content=\"{{deploymentConfigs[dcName].status.details.message}}\"></span>\n" +
    "</td>\n" +
    "<td data-title=\"Last Version\"><em>No deployments</em></td>\n" +
    "<td class=\"hidden-xs\">&nbsp;</td>\n" +
    "<td class=\"hidden-xs\">&nbsp;</td>\n" +
    "<td class=\"hidden-xs\">&nbsp;</td>\n" +
    "</tr>\n" +
    "\n" +
    "<tr ng-repeat=\"replicationController in replicationControllersForDC | orderObjectsByDate : true | limitTo : 1\" ng-if=\"dcName\">\n" +
    "<td data-title=\"Name\">\n" +
    "<a ng-href=\"{{replicationController | configURLForResource}}\">{{dcName}}</a>\n" +
    "\n" +
    "<span ng-if=\"deploymentConfigs && !deploymentConfigs[dcName]\" class=\"pficon pficon-warning-triangle-o\" data-toggle=\"tooltip\" title=\"This deployment config no longer exists\" style=\"cursor: help\"></span>\n" +
    "</td>\n" +
    "<td data-title=\"Last Version\">\n" +
    "\n" +
    "<span ng-if=\"replicationController | annotation : 'deploymentVersion'\">\n" +
    "<a ng-href=\"{{replicationController | navigateResourceURL}}\">#{{replicationController | annotation : 'deploymentVersion'}}</a>\n" +
    "</span>\n" +
    "<span ng-if=\"!(replicationController | annotation : 'deploymentVersion')\">\n" +
    "<a ng-href=\"{{replicationController | navigateResourceURL}}\">{{replicationController.metadata.name}}</a>\n" +
    "</span>\n" +
    "</td>\n" +
    "<td data-title=\"Status\">\n" +
    "<div row class=\"status\">\n" +
    "<status-icon status=\"replicationController | deploymentStatus\" disable-animation></status-icon>\n" +
    "<span flex>\n" +
    "{{replicationController | deploymentStatus}}<span ng-if=\"(replicationController | deploymentStatus) == 'Active' || (replicationController | deploymentStatus) == 'Running'\">,\n" +
    "<span ng-if=\"replicationController.spec.replicas !== replicationController.status.replicas\">{{replicationController.status.replicas}}/</span>{{replicationController.spec.replicas}} replica<span ng-if=\"replicationController.spec.replicas != 1\">s</span></span>\n" +
    "</span>\n" +
    "</div>\n" +
    "\n" +
    "</td>\n" +
    "<td data-title=\"Created\">\n" +
    "<span am-time-ago=\"replicationController.metadata.creationTimestamp\"></span>\n" +
    "</td>\n" +
    "<td data-title=\"Trigger\">\n" +
    "<span ng-if=\"!replicationController.causes.length\">Unknown</span>\n" +
    "<span ng-if=\"replicationController.causes.length\">\n" +
    "<span ng-repeat=\"cause in replicationController.causes\">\n" +
    "<span ng-switch=\"cause.type\">\n" +
    "<span ng-switch-when=\"ImageChange\">\n" +
    "<span ng-if=\"cause.imageTrigger.from\">\n" +
    "<abbr title=\"{{cause.imageTrigger.from | imageObjectRef : null : true}}\">Image</abbr> change\n" +
    "</span>\n" +
    "</span>\n" +
    "<span ng-switch-when=\"ConfigChange\">Config change</span>\n" +
    "<span ng-switch-default>{{cause.type}}</span>\n" +
    "</span>\n" +
    "</span>\n" +
    "</span>\n" +
    "</td>\n" +
    "</tr>\n" +
    "<tr ng-repeat-end style=\"display: none\"></tr>\n" +
    "</tbody>\n" +
    "</table>\n" +
    "<div ng-if=\"deployments | hashSize\">\n" +
    "<h3>Deployments</h3>\n" +
    "<table class=\"table table-bordered table-hover table-mobile table-layout-fixed\">\n" +
    "<colgroup>\n" +
    "<col class=\"col-sm-4\">\n" +
    "<col class=\"col-sm-2\">\n" +
    "<col class=\"col-sm-2\">\n" +
    "<col class=\"col-sm-2\">\n" +
    "<col class=\"col-sm-2\">\n" +
    "</colgroup>\n" +
    "<thead>\n" +
    "<tr>\n" +
    "<th>Name</th>\n" +
    "<th>Last Version</th>\n" +
    "<th>Replicas</th>\n" +
    "<th>Created</th>\n" +
    "<th>Strategy</th>\n" +
    "</tr>\n" +
    "</thead>\n" +
    "<tbody>\n" +
    "<tr ng-repeat=\"deployment in deployments | orderObjectsByDate : true\">\n" +
    "<td data-title=\"Name\">\n" +
    "<a ng-href=\"{{deployment | navigateResourceURL}}\">{{deployment.metadata.name}}</a>\n" +
    "</td>\n" +
    "<td data-title=\"Last Version\">\n" +
    "<span ng-if=\"latestReplicaSetByDeployment[deployment.metadata.name]\">\n" +
    "<a ng-href=\"{{latestReplicaSetByDeployment[deployment.metadata.name] | navigateResourceURL}}\">{{deployment | lastDeploymentRevision}}</a>\n" +
    "</span>\n" +
    "<span ng-if=\"!latestReplicaSetByDeployment[deployment.metadata.name]\">\n" +
    "{{deployment | lastDeploymentRevision}}\n" +
    "</span>\n" +
    "</td>\n" +
    "<td data-title=\"Replicas\">\n" +
    "<span ng-if=\"deployment.status.replicas !== deployment.spec.replicas\">{{deployment.status.replicas}}/</span>{{deployment.spec.replicas}} replica<span ng-if=\"deployment.spec.replicas != 1\">s</span>\n" +
    "</td>\n" +
    "<td data-title=\"Created\">\n" +
    "<span am-time-ago=\"deployment.metadata.creationTimestamp\"></span>\n" +
    "</td>\n" +
    "<td data-title=\"Strategy\">\n" +
    "{{deployment.spec.strategy.type | sentenceCase}}\n" +
    "</td>\n" +
    "</tr>\n" +
    "</tbody>\n" +
    "</table>\n" +
    "</div>\n" +
    "<div ng-if=\"replicaSets | hashSize\" id=\"replica-sets\">\n" +
    "<h3>Replica Sets</h3>\n" +
    "<table class=\"table table-bordered table-hover table-mobile table-layout-fixed\">\n" +
    "<colgroup>\n" +
    "<col class=\"col-sm-4\">\n" +
    "</colgroup>\n" +
    "<thead>\n" +
    "<tr>\n" +
    "<th>Name</th>\n" +
    "<th>Replicas</th>\n" +
    "<th>Created</th>\n" +
    "</tr>\n" +
    "</thead>\n" +
    "<tbody>\n" +
    "<tr ng-repeat=\"replicaSet in replicaSets | orderObjectsByDate : true\">\n" +
    "<td data-title=\"Name\">\n" +
    "<a ng-href=\"{{replicaSet | navigateResourceURL}}\">{{replicaSet.metadata.name}}</a>\n" +
    "</td>\n" +
    "<td data-title=\"Replicas\">\n" +
    "<span ng-if=\"replicaSet.status.replicas !== replicaSet.spec.replicas\">{{replicaSet.status.replicas}}/</span>{{replicaSet.spec.replicas}} replica<span ng-if=\"replicaSet.spec.replicas != 1\">s</span>\n" +
    "</td>\n" +
    "<td data-title=\"Created\">\n" +
    "<span am-time-ago=\"replicaSet.metadata.creationTimestamp\"></span>\n" +
    "</td>\n" +
    "</tr>\n" +
    "</tbody>\n" +
    "</table>\n" +
    "</div>\n" +
    "<div ng-if=\"(unfilteredReplicationControllers | hashSize) > 0\" id=\"replica-controllers\">\n" +
    "<h3>Other Replication Controllers</h3>\n" +
    "<table class=\"table table-bordered table-hover table-mobile table-layout-fixed\">\n" +
    "<colgroup>\n" +
    "<col class=\"col-sm-5\">\n" +
    "</colgroup>\n" +
    "<thead>\n" +
    "<tr>\n" +
    "<th>Name</th>\n" +
    "<th>Replicas</th>\n" +
    "<th>Created</th>\n" +
    "</tr>\n" +
    "</thead>\n" +
    "<tbody ng-if=\"(replicationControllersByDC[''] | hashSize) === 0\"><tr><td colspan=\"3\"><em>No replication controllers to show</em></td></tr></tbody>\n" +
    "<tbody ng-if=\"(replicationControllersByDC[''] | hashSize) > 0\">\n" +
    "\n" +
    "<tr ng-repeat=\"deployment in replicationControllersByDC[''] | orderObjectsByDate : true\">\n" +
    "<td data-title=\"Name\">\n" +
    "<a ng-href=\"{{deployment | navigateResourceURL}}\">{{deployment.metadata.name}}</a>\n" +
    "</td>\n" +
    "<td data-title=\"Replicas\">\n" +
    "<span ng-if=\"deployment.status.replicas !== deployment.spec.replicas\">{{deployment.status.replicas}}/</span>{{deployment.spec.replicas}} replica<span ng-if=\"deployment.spec.replicas != 1\">s</span>\n" +
    "</td>\n" +
    "<td data-title=\"Created\">\n" +
    "<span am-time-ago=\"deployment.metadata.creationTimestamp\"></span>\n" +
    "</td>\n" +
    "</tr>\n" +
    "</tbody>\n" +
    "</table>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</project-page>"
  );


  $templateCache.put('views/directives/_build-close.html',
    "<button ng-hide=\"build | isIncompleteBuild\" ng-click=\"onHideBuild()\" type=\"button\" class=\"close\">\n" +
    "<span class=\"pficon pficon-close\" aria-hidden=\"true\"></span>\n" +
    "<span class=\"sr-only\">Dismiss</span>\n" +
    "</button>"
  );


  $templateCache.put('views/directives/_build-pipeline-collapsed.html',
    "<div class=\"build-pipeline-collapsed animate-show animate-hide animate-slide\" ng-show=\"!hideBuild\">\n" +
    "<div class=\"build-summary\" ng-class=\"{'dismissible' : !(build | isIncompleteBuild)}\">\n" +
    "<div class=\"build-name\">\n" +
    "Pipeline\n" +
    "<a ng-href=\"{{build | configURLForResource}}\">{{buildConfigName}}</a>,\n" +
    "<a ng-href=\"{{build | navigateResourceURL}}\">#{{build | annotation : 'buildNumber'}}</a>\n" +
    "</div>\n" +
    "<div class=\"build-phase\">\n" +
    "<status-icon status=\"build.status.phase\"></status-icon>\n" +
    "{{build.status.phase}}\n" +
    "</div>\n" +
    "<span am-time-ago=\"build.metadata.creationTimestamp\" class=\"build-timestamp\"></span>\n" +
    "<div ng-include=\"'views/directives/_build-pipeline-links.html'\" class=\"build-links\"></div>\n" +
    "<build-close build=\"build\" hide-build=\"hideBuild\"></build-close>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/directives/_build-pipeline-expanded.html',
    "<div flex class=\"build-pipeline\">\n" +
    "<div class=\"build-summary\">\n" +
    "<div ng-if=\"buildConfigNameOnExpanded\" class=\"build-name\">\n" +
    "<a ng-href=\"{{build | configURLForResource}}\">{{buildConfigName}}</a>\n" +
    "</div>\n" +
    "<div class=\"build-phase\">\n" +
    "<span class=\"status-icon\" ng-class=\"build.status.phase\">\n" +
    "<span ng-switch=\"build.status.phase\" class=\"hide-ng-leave\">\n" +
    "<span ng-switch-when=\"Complete\" aria-hidden=\"true\">\n" +
    "<i class=\"fa fa-check-circle fa-fw\"></i>\n" +
    "</span>\n" +
    "<span ng-switch-when=\"Failed\" aria-hidden=\"true\">\n" +
    "<i class=\"fa fa-times-circle fa-fw\"></i>\n" +
    "</span>\n" +
    "<span ng-switch-default>\n" +
    "<status-icon status=\"build.status.phase\"></status-icon>\n" +
    "</span>\n" +
    "</span>\n" +
    "</span>\n" +
    "<a ng-href=\"{{build | navigateResourceURL}}\">Build #{{build | annotation : 'buildNumber'}}</a>\n" +
    "</div>\n" +
    "<span am-time-ago=\"build.metadata.creationTimestamp\" class=\"build-timestamp\"></span>\n" +
    "<div ng-include=\"'views/directives/_build-pipeline-links.html'\" class=\"build-links\"></div>\n" +
    "</div>\n" +
    "<div class=\"pipeline-container\">\n" +
    "<div class=\"pipeline\" ng-if=\"!jenkinsStatus.stages.length\">\n" +
    "<div class=\"pipeline-stage no-stages\">\n" +
    "<div class=\"pipeline-stage-name\">No stages have started.</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"pipeline\">\n" +
    "<div class=\"pipeline-stage\" ng-repeat=\"stage in jenkinsStatus.stages track by stage.id\">\n" +
    "<div column class=\"pipeline-stage-column\">\n" +
    "<div title=\"{{stage.name}}\" class=\"pipeline-stage-name\" ng-class=\"build.status.phase\">\n" +
    "{{stage.name}}\n" +
    "</div>\n" +
    "<pipeline-status ng-if=\"stage.status\" status=\"stage.status\"></pipeline-status>\n" +
    "<div class=\"pipeline-actions\" ng-if=\"stage | pipelineStagePendingInput\">\n" +
    "<a ng-href=\"{{build | jenkinsInputURL}}\" target=\"_blank\">Input Required</a>\n" +
    "</div>\n" +
    "<div class=\"pipeline-time\" ng-class=\"stage.status\" ng-if=\"stage.durationMillis && !(stage | pipelineStagePendingInput)\">{{stage.durationMillis | timeOnlyDuration}}</div>\n" +
    "<div class=\"pipeline-time\" ng-class=\"stage.status\" ng-if=\"!stage.durationMillis && !(stage | pipelineStagePendingInput)\">not started</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/directives/_build-pipeline-links.html',
    "<div ng-if=\"(build | buildLogURL) && ('builds/log' | canI : 'get')\" class=\"pipeline-link\"><a ng-href=\"{{build | buildLogURL}}\" target=\"_blank\">View Log</a></div>"
  );


  $templateCache.put('views/directives/_click-to-reveal.html',
    "<a class=\"reveal-contents-link\" href=\"javascript:;\">{{linkText || \"Show\"}}</a>\n" +
    "<span style=\"display: none\" class=\"reveal-contents\" ng-transclude></span>"
  );


  $templateCache.put('views/directives/_copy-to-clipboard.html',
    "<div class=\"copy-to-clipboard\" ng-class=\"{'limit-width': !displayWide, 'copy-to-clipboard-multiline': multiline, 'input-group': !hidden}\">\n" +
    "<input ng-if=\"!multiline\" id=\"{{id}}\" type=\"text\" class=\"form-control\" value=\"{{inputText || clipboardText}}\" ng-disabled=\"isDisabled\" ng-readonly=\"!isDisabled\" select-on-focus>\n" +
    "<pre ng-if=\"multiline\" id=\"{{id}}\">{{inputText || clipboardText}}</pre>\n" +
    "<span ng-class=\"{ 'input-group-btn': !multiline }\" ng-hide=\"hidden\">\n" +
    "<a ng-show=\"!inputText\" data-clipboard-target=\"#{{id}}\" href=\"\" ng-disabled=\"isDisabled\" data-toggle=\"tooltip\" title=\"Copy to clipboard\" role=\"button\" class=\"btn btn-default\"><i class=\"fa fa-clipboard\"/></a>\n" +
    "<a ng-show=\"inputText\" data-clipboard-text=\"{{clipboardText}}\" href=\"\" ng-disabled=\"isDisabled\" data-toggle=\"tooltip\" title=\"Copy to clipboard\" role=\"button\" class=\"btn btn-default\"><i class=\"fa fa-clipboard\"/></a>\n" +
    "</span>\n" +
    "</div>"
  );


  $templateCache.put('views/directives/_create-project-form.html',
    "<form name=\"createProjectForm\">\n" +
    "<fieldset ng-disabled=\"disableInputs\">\n" +
    "<div class=\"form-group\">\n" +
    "<label for=\"name\" class=\"required\">Name</label>\n" +
    "<span ng-class=\"{'has-error': (createProjectForm.name.$error.pattern && createProjectForm.name.$touched) || nameTaken}\">\n" +
    "<input class=\"form-control input-lg\" name=\"name\" id=\"name\" placeholder=\"my-project\" type=\"text\" required take-focus minlength=\"2\" maxlength=\"63\" pattern=\"[a-z0-9]([-a-z0-9]*[a-z0-9])?\" aria-describedby=\"nameHelp\" ng-model=\"name\" ng-model-options=\"{ updateOn: 'default blur' }\" ng-change=\"nameTaken = false\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\">\n" +
    "</span>\n" +
    "<div>\n" +
    "<span class=\"help-block\">A unique name for the project.</span>\n" +
    "</div>\n" +
    "<div class=\"has-error\">\n" +
    "<span id=\"nameHelp\" class=\"help-block\" ng-if=\"createProjectForm.name.$error.minlength && createProjectForm.name.$touched\">\n" +
    "Name must have at least two characters.\n" +
    "</span>\n" +
    "</div>\n" +
    "<div class=\"has-error\">\n" +
    "<span id=\"nameHelp\" class=\"help-block\" ng-if=\"createProjectForm.name.$error.pattern && createProjectForm.name.$touched\">\n" +
    "Project names may only contain lower-case letters, numbers, and dashes. They may not start or end with a dash.\n" +
    "</span>\n" +
    "</div>\n" +
    "<div class=\"has-error\">\n" +
    "<span class=\"help-block\" ng-if=\"nameTaken\">\n" +
    "This name is already in use. Please choose a different name.\n" +
    "</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"form-group\">\n" +
    "<label for=\"displayName\">Display Name</label>\n" +
    "<input class=\"form-control input-lg\" name=\"displayName\" id=\"displayName\" placeholder=\"My Project\" type=\"text\" ng-model=\"displayName\">\n" +
    "</div>\n" +
    "<div class=\"form-group\">\n" +
    "<label for=\"description\">Description</label>\n" +
    "<textarea class=\"form-control input-lg\" name=\"description\" id=\"description\" placeholder=\"A short description.\" ng-model=\"description\"></textarea>\n" +
    "</div>\n" +
    "<div class=\"button-group\">\n" +
    "<button type=\"submit\" class=\"btn btn-primary btn-lg\" ng-click=\"createProject()\" ng-disabled=\"createProjectForm.$invalid || nameTaken || disableInputs\" value=\"\">Create</button>\n" +
    "<a class=\"btn btn-default btn-lg\" href=\"#\" back>Cancel</a>\n" +
    "</div>\n" +
    "</fieldset>\n" +
    "</form>"
  );


  $templateCache.put('views/directives/_custom-icon.html',
    "<span ng-if=\"!isDataIcon\" aria-hidden=\"true\" ng-class=\"icon.contains('fa ') ? icon : 'font-icon ' + icon\"></span>\n" +
    "<img ng-if=\"isDataIcon\" alt=\"\" ng-src=\"{{icon}}\">"
  );


  $templateCache.put('views/directives/_edit-command.html',
    "<ng-form name=\"form\">\n" +
    "<p ng-hide=\"input.args.length\"><em>No {{type || 'command'}} set.</em></p>\n" +
    "<p ng-show=\"input.args.length\" as-sortable ng-model=\"input.args\" class=\"command-args\">\n" +
    "<span ng-repeat=\"arg in input.args\" as-sortable-item class=\"form-group\">\n" +
    "<span class=\"input-group\">\n" +
    "\n" +
    "<input type=\"text\" ng-model=\"arg.value\" ng-if=\"!arg.multiline\" required class=\"form-control\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\">\n" +
    "\n" +
    "<textarea ng-model=\"arg.value\" ng-if=\"arg.multiline\" rows=\"5\" required class=\"form-control\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\">\n" +
    "        </textarea>\n" +
    "<span as-sortable-item-handle class=\"input-group-addon action-button drag-handle\">\n" +
    "<i class=\"fa fa-bars\" aria-hidden=\"true\"></i>\n" +
    "</span>\n" +
    "<a href=\"\" ng-click=\"removeArg($index)\" class=\"input-group-addon action-button remove-arg\" title=\"Remove Item\">\n" +
    "<span class=\"sr-only\">Remove Item</span>\n" +
    "<i class=\"pficon pficon-close\" aria-hidden=\"true\"></i>\n" +
    "</a>\n" +
    "</span>\n" +
    "</span>\n" +
    "</p>\n" +
    "<div class=\"form-group\">\n" +
    "<label class=\"sr-only\" ng-attr-for=\"{{id}}-add-arg\">\n" +
    "<span ng-if=\"placeholder\">{{placeholder}}</span>\n" +
    "<span ng-if=\"!placeholder\">Add argument</span>\n" +
    "</label>\n" +
    "\n" +
    "<span ng-show=\"!multiline\" class=\"input-group\">\n" +
    "<input type=\"text\" ng-model=\"nextArg\" name=\"nextArg\" ng-attr-id=\"{{id}}-add-arg\" on-enter=\"addArg()\" ng-attr-placeholder=\"{{placeholder || 'Add argument'}}\" class=\"form-control\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\">\n" +
    "<span class=\"input-group-btn\">\n" +
    "\n" +
    "<a class=\"btn btn-default\" href=\"\" ng-click=\"addArg()\" ng-disabled=\"!nextArg\" ng-attr-aria-disabled=\"!nextArg\" role=\"button\">Add</a>\n" +
    "</span>\n" +
    "</span>\n" +
    "\n" +
    "<span ng-show=\"multiline\">\n" +
    "<textarea ng-model=\"nextArg\" name=\"nextArg\" rows=\"10\" ng-attr-id=\"{{id}}-add-arg\" ng-attr-placeholder=\"{{placeholder || 'Add argument'}}\" class=\"form-control\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\">\n" +
    "      </textarea>\n" +
    "<div class=\"mar-top-md\">\n" +
    "<a class=\"btn btn-default\" href=\"\" ng-click=\"addArg()\" ng-disabled=\"!nextArg\" ng-attr-aria-disabled=\"!nextArg\" role=\"button\">Add</a>\n" +
    "</div>\n" +
    "</span>\n" +
    "<div class=\"help-block\">\n" +
    "<span ng-if=\"description\">{{description}}</span>\n" +
    "<span ng-if=\"!description\">\n" +
    "Enter the command to run inside the container. The command is considered successful if its exit code is 0. Drag and drop to reorder arguments.\n" +
    "</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"mar-top-sm mar-bottom-md\">\n" +
    "<a href=\"\" ng-click=\"multiline = !multiline\">Switch to {{multiline ? 'Single-line' : 'Multiline'}} Editor</a>\n" +
    "<span ng-show=\"input.args.length\">\n" +
    "<span class=\"action-divider\">|</span>\n" +
    "<a href=\"\" ng-click=\"clear()\" role=\"button\">Clear {{ (type || 'Command') | upperFirst }}</a>\n" +
    "</span>\n" +
    "</div>\n" +
    "\n" +
    "<input type=\"hidden\" name=\"command\" ng-model=\"input.args\" ng-required=\"isRequired\">\n" +
    "<div ng-if=\"form.command.$dirty && form.command.$error.required\" class=\"has-error\">\n" +
    "<span class=\"help-block\">A command is required.</span>\n" +
    "</div>\n" +
    "</ng-form>"
  );


  $templateCache.put('views/directives/_edit-probe.html',
    "<ng-form name=\"form\">\n" +
    "<div class=\"form-group\">\n" +
    "<label class=\"required\">Type</label>\n" +
    "<ui-select ng-model=\"selected.type\" required search-enabled=\"false\">\n" +
    "<ui-select-match>{{$select.selected.label}}</ui-select-match>\n" +
    "<ui-select-choices repeat=\"item.id as item in types\">{{item.label}}</ui-select-choices>\n" +
    "</ui-select>\n" +
    "</div>\n" +
    "<fieldset ng-if=\"selected.type === 'httpGet'\">\n" +
    "<div class=\"form-group\">\n" +
    "<div class=\"checkbox\">\n" +
    "<label>\n" +
    "<input type=\"checkbox\" ng-model=\"probe.httpGet.scheme\" ng-true-value=\" 'HTTPS' \" ng-false-value=\" 'HTTP' \">\n" +
    "Use HTTPS\n" +
    "</label>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"form-group\">\n" +
    "<label ng-attr-for=\"{{id}}-path\">Path</label>\n" +
    "<div>\n" +
    "<input ng-attr-id=\"{{id}}-path\" ng-model=\"probe.httpGet.path\" type=\"text\" placeholder=\"/\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\" class=\"form-control\">\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"form-group\">\n" +
    "<label class=\"required\">Port</label>\n" +
    "<ui-select ng-model=\"probe.httpGet.port\" required>\n" +
    "<ui-select-match>{{$select.selected.containerPort}}</ui-select-match>\n" +
    "<ui-select-choices repeat=\"port.containerPort as port in portOptions\" refresh=\"refreshPorts($select.search, $select.selected)\" refresh-delay=\"200\">{{port.containerPort}}</ui-select-choices>\n" +
    "</ui-select>\n" +
    "</div>\n" +
    "</fieldset>\n" +
    "<fieldset ng-if=\"selected.type === 'exec'\">\n" +
    "<label class=\"required\">Command</label>\n" +
    "<edit-command args=\"probe.exec.command\" is-required=\"true\"></edit-command>\n" +
    "</fieldset>\n" +
    "<fieldset ng-if=\"selected.type === 'tcpSocket'\">\n" +
    "<div class=\"form-group\">\n" +
    "<label class=\"required\">Port</label>\n" +
    "<ui-select ng-model=\"probe.tcpSocket.port\" required>\n" +
    "<ui-select-match>{{$select.selected.containerPort}}</ui-select-match>\n" +
    "<ui-select-choices repeat=\"port.containerPort as port in portOptions\" refresh=\"refreshPorts($select.search, $select.selected)\" refresh-delay=\"200\">{{port.containerPort}}</ui-select-choices>\n" +
    "</ui-select>\n" +
    "</div>\n" +
    "</fieldset>\n" +
    "<div class=\"form-group\">\n" +
    "<label ng-attr-for=\"{{id}}-initial-delay\">Initial Delay</label>\n" +
    "<span class=\"input-group\" ng-class=\"{ 'has-error': form.initialDelaySeconds.$invalid && form.initialDelaySeconds.$touched }\">\n" +
    "<input type=\"number\" name=\"initialDelaySeconds\" ng-model=\"probe.initialDelaySeconds\" ng-pattern=\"/^\\d+$/\" min=\"0\" select-on-focus ng-attr-id=\"{{id}}-initial-delay\" class=\"form-control\" ng-attr-aria-describedby=\"{{id}}-delay-description\">\n" +
    "<span class=\"input-group-addon\">seconds</span>\n" +
    "</span>\n" +
    "<div class=\"help-block\" ng-attr-id=\"{{id}}-delay-description\">\n" +
    "How long to wait after the container starts before checking its health.\n" +
    "</div>\n" +
    "<div ng-if=\"form.initialDelaySeconds.$invalid && form.initialDelaySeconds.$touched\" class=\"has-error\">\n" +
    "<div ng-if=\"form.initialDelaySeconds.$error.number\" class=\"help-block\">\n" +
    "Must be a number.\n" +
    "</div>\n" +
    "<div ng-if=\"form.initialDelaySeconds.$error.min\" class=\"help-block\">\n" +
    "Delay can't be negative.\n" +
    "</div>\n" +
    "<span ng-if=\"form.initialDelaySeconds.$error.pattern && !form.initialDelaySeconds.$error.min\" class=\"help-block\">\n" +
    "Must be a whole number.\n" +
    "</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"form-group\">\n" +
    "<label ng-attr-for=\"{{id}}-timeout\">Timeout</label>\n" +
    "<span class=\"input-group\" ng-class=\"{ 'has-error': form.timeoutSeconds.$invalid && form.timeoutSeconds.$touched }\">\n" +
    "<input type=\"number\" name=\"timeoutSeconds\" ng-model=\"probe.timeoutSeconds\" ng-pattern=\"/^\\d+$/\" min=\"1\" placeholder=\"1\" select-on-focus ng-attr-id=\"{{id}}-timeout\" class=\"form-control\" ng-attr-aria-describedby=\"{{id}}-timeout-description\">\n" +
    "<span class=\"input-group-addon\">seconds</span>\n" +
    "</span>\n" +
    "<div class=\"help-block\" ng-attr-id=\"{{id}}-timeout-description\">\n" +
    "How long to wait for the probe to finish. If the time is exceeded, the probe is considered failed.\n" +
    "</div>\n" +
    "<div ng-if=\"form.timeoutSeconds.$invalid && form.timeoutSeconds.$touched\" class=\"has-error\">\n" +
    "<div ng-if=\"form.timeoutSeconds.$error.number\" class=\"help-block\">\n" +
    "Must be a number.\n" +
    "</div>\n" +
    "<div ng-if=\"form.timeoutSeconds.$error.min\" class=\"help-block\">\n" +
    "Timeout must be greater than or equal to one.\n" +
    "</div>\n" +
    "<span ng-if=\"form.timeoutSeconds.$error.pattern && !form.timeoutSeconds.$error.min\" class=\"help-block\">\n" +
    "Must be a whole number.\n" +
    "</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "</ng-form>"
  );


  $templateCache.put('views/directives/_ellipsis-loader.html',
    "<div class=\"ellipsis-loader dots\"><div></div></div>"
  );


  $templateCache.put('views/directives/_ellipsis-pulser.html',
    "<div class=\"ellipsis-pulser ellipsis-{{size || 'md'}} ellipsis-{{color || 'dark'}} ellipsis-{{display || 'block'}}\">\n" +
    "<span ng-if=\"msg\" class=\"ellipsis-msg\">{{msg}}</span>\n" +
    "<div class=\"dot pulse\"></div>\n" +
    "<div class=\"dot pulse\"></div>\n" +
    "<div class=\"dot pulse\"></div>\n" +
    "</div>"
  );


  $templateCache.put('views/directives/_pod-content.html',
    "<div class=\"pod-text\" ng-switch=\"pod.status.phase\">\n" +
    "<strong class=\"pod-status-label\">{{pod.status.phase}}</strong>\n" +
    "<span ng-if=\"troubled\">\n" +
    "<pod-warnings pod=\"pod\" style=\"margin-right: -15px\"></pod-warnings>\n" +
    "</span>\n" +
    "<div ng-switch-when=\"Pending\">\n" +
    "<span ng-if=\"!pod.spec.nodeName\">scheduling...</span>\n" +
    "<span ng-if=\"pod.spec.nodeName && !pod.status.startTime\">scheduled</span>\n" +
    "<span ng-if=\"pod.spec.nodeName && pod.status.startTime\">pulling...</span>\n" +
    "</div>\n" +
    "<div ng-switch-default>\n" +
    "&nbsp;\n" +
    "<span ng-if=\"pod.status.podIP\">{{pod.status.podIP}}</span>\n" +
    "<span am-time-ago-if=\"!pod.status.podIP\" timestamp=\"pod.status.startTime\"></span>\n" +
    "&nbsp;\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/directives/_probe.html',
    " <span ng-if=\"probe.httpGet\">\n" +
    "GET {{probe.httpGet.path || '/'}} on port {{probe.httpGet.port || 'unknown'}} ({{probe.httpGet.scheme || 'HTTP'}})\n" +
    "</span>\n" +
    "<span ng-if=\"probe.exec.command\">\n" +
    "<code class=\"command\">\n" +
    "<truncate-long-text content=\"probe.exec.command.join(' ')\" limit=\"80\" newline-limit=\"1\" expandable=\"true\" use-word-boundary=\"false\">\n" +
    "</truncate-long-text>\n" +
    "</code>\n" +
    "</span>\n" +
    "<span ng-if=\"probe.tcpSocket\">\n" +
    "Open socket on port {{probe.tcpSocket.port}}\n" +
    "</span>\n" +
    "<small class=\"text-muted\">\n" +
    "<span ng-if=\"probe.initialDelaySeconds\" class=\"nowrap\">{{probe.initialDelaySeconds}}s delay,</span>\n" +
    "<span class=\"nowrap\">{{probe.timeoutSeconds || 1}}s timeout</span>\n" +
    "</small>"
  );


  $templateCache.put('views/directives/_project-filter.html',
    "<div class=\"filter\">\n" +
    "<div class=\"form-group\">\n" +
    "<label ng-if=\"!renderOptions || !renderOptions.hideFilterWidget\" class=\"control-label sr-only\">Filter by labels</label>\n" +
    "<div class=\"navbar-filter-widget\"></div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"active-filters\"></div>"
  );


  $templateCache.put('views/directives/_status-icon.html',
    "<span ng-switch=\"status\" class=\"hide-ng-leave status-icon\">\n" +
    "<span ng-switch-when=\"Cancelled\" class=\"fa fa-ban text-muted\" aria-hidden=\"true\"></span>\n" +
    "<span ng-switch-when=\"Complete\" class=\"fa fa-check text-success\" aria-hidden=\"true\"></span>\n" +
    "<span ng-switch-when=\"Completed\" class=\"fa fa-check text-success\" aria-hidden=\"true\"></span>\n" +
    "<span ng-switch-when=\"Active\" class=\"fa fa-refresh\" aria-hidden=\"true\"></span>\n" +
    "<span ng-switch-when=\"Error\" class=\"fa fa-times text-danger\" aria-hidden=\"true\"></span>\n" +
    "<span ng-switch-when=\"Failed\" class=\"fa fa-times text-danger\" aria-hidden=\"true\"></span>\n" +
    "<span ng-switch-when=\"New\" class=\"spinner spinner-xs spinner-inline\" aria-hidden=\"true\"></span>\n" +
    "<span ng-switch-when=\"Pending\" class=\"spinner spinner-xs spinner-inline\" aria-hidden=\"true\"></span>\n" +
    "<span ng-switch-when=\"Running\" class=\"fa fa-refresh\" aria-hidden=\"true\" ng-class=\"{'fa-spin' : spinning}\"></span>\n" +
    "<span ng-switch-when=\"Succeeded\" class=\"fa fa-check text-success\" aria-hidden=\"true\"></span>\n" +
    "<span ng-switch-when=\"Bound\" class=\"fa fa-check text-success\" aria-hidden=\"true\"></span>\n" +
    "<span ng-switch-when=\"Terminating\" class=\"fa fa-times text-danger\" aria-hidden=\"true\"></span>\n" +
    "<span ng-switch-when=\"Terminated\" class=\"fa fa-times text-danger\" aria-hidden=\"true\"></span>\n" +
    "<span ng-switch-when=\"Unknown\" class=\"fa fa-question text-danger\" aria-hidden=\"true\"></span>\n" +
    "\n" +
    "<span ng-switch-when=\"ContainerCreating\" class=\"spinner spinner-xs spinner-inline\" aria-hidden=\"true\"></span>\n" +
    "<span ng-switch-when=\"CrashLoopBackOff\" class=\"fa fa-times text-danger\" aria-hidden=\"true\"></span>\n" +
    "<span ng-switch-when=\"ImagePullBackOff\" class=\"fa fa-times text-danger\" aria-hidden=\"true\"></span>\n" +
    "<span ng-switch-when=\"ImageInspectError\" class=\"fa fa-times text-danger\" aria-hidden=\"true\"></span>\n" +
    "<span ng-switch-when=\"ErrImagePull\" class=\"fa fa-times text-danger\" aria-hidden=\"true\"></span>\n" +
    "<span ng-switch-when=\"ErrImageNeverPull\" class=\"fa fa-times text-danger\" aria-hidden=\"true\"></span>\n" +
    "<span ng-switch-when=\"no matching container\" class=\"fa fa-times text-danger\" aria-hidden=\"true\"></span>\n" +
    "<span ng-switch-when=\"RegistryUnavailable\" class=\"fa fa-times text-danger\" aria-hidden=\"true\"></span>\n" +
    "<span ng-switch-when=\"RunContainerError\" class=\"fa fa-times text-danger\" aria-hidden=\"true\"></span>\n" +
    "<span ng-switch-when=\"KillContainerError\" class=\"fa fa-times text-danger\" aria-hidden=\"true\"></span>\n" +
    "<span ng-switch-when=\"VerifyNonRootError\" class=\"fa fa-times text-danger\" aria-hidden=\"true\"></span>\n" +
    "<span ng-switch-when=\"SetupNetworkError\" class=\"fa fa-times text-danger\" aria-hidden=\"true\"></span>\n" +
    "<span ng-switch-when=\"TeardownNetworkError\" class=\"fa fa-times text-danger\" aria-hidden=\"true\"></span>\n" +
    "<span ng-switch-when=\"DeadlineExceeded\" class=\"fa fa-times text-danger\" aria-hidden=\"true\"></span>\n" +
    "</span>"
  );


  $templateCache.put('views/directives/_warnings-popover.html',
    "<span ng-if=\"content\">\n" +
    "<span dynamic-content=\"{{content | middleEllipses:350:'...<br>...'}}\" data-toggle=\"popover\" data-trigger=\"hover\" data-html=\"true\" class=\"pficon warnings-popover\" ng-class=\"{'pficon-warning-triangle-o': !hasError, 'pficon-error-circle-o': hasError}\" aria-hidden=\"true\">\n" +
    "</span>\n" +
    "<span class=\"sr-only\">{{content}}</span>\n" +
    "</span>"
  );


  $templateCache.put('views/directives/action-chip.html',
    "<span class=\"action-chip\">\n" +
    "<span ng-if=\"key && !(keyHelp)\" class=\"item key truncate\">\n" +
    "{{key}}\n" +
    "</span>\n" +
    "<a ng-if=\"key && keyHelp\" href=\"\" class=\"item key truncate\" data-toggle=\"popover\" data-trigger=\"focus\" data-content=\"{{keyHelp}}\">\n" +
    "{{key}}\n" +
    "</a>\n" +
    "<span ng-if=\"value && !(valueHelp)\" class=\"item value truncate\">\n" +
    "{{value}}\n" +
    "</span>\n" +
    "<a ng-if=\"value && valueHelp\" href=\"\" class=\"item value truncate\" data-toggle=\"popover\" data-trigger=\"focus\" data-content=\"{{valueHelp}}\">\n" +
    "{{value}}\n" +
    "</a>\n" +
    "<a href=\"\" class=\"item action\" ng-if=\"showAction\" ng-click=\"action()\" ng-attr-title=\"actionTitle\">\n" +
    "<i ng-class=\"icon || 'pficon pficon-close'\"></i>\n" +
    "</a>\n" +
    "</span>"
  );


  $templateCache.put('views/directives/annotations.html',
    "<p ng-class=\"{'mar-bottom-xl': !expandAnnotations}\">\n" +
    "<a href=\"\" ng-click=\"toggleAnnotations()\" ng-if=\"!expandAnnotations\">Show Annotations</a>\n" +
    "<a href=\"\" ng-click=\"toggleAnnotations()\" ng-if=\"expandAnnotations\">Hide Annotations</a>\n" +
    "</p>\n" +
    "<div ng-if=\"expandAnnotations\">\n" +
    "<div ng-if=\"annotations\" class=\"table-responsive\">\n" +
    "<table class=\"table table-bordered table-bordered-columns key-value-table\">\n" +
    "<tbody>\n" +
    "<tr ng-repeat=\"(annotationKey, annotationValue) in annotations\">\n" +
    "<td class=\"key\">{{annotationKey}}</td>\n" +
    "<td class=\"value\">\n" +
    "<truncate-long-text content=\"annotationValue | prettifyJSON\" limit=\"500\" newlinelimit=\"20\" expandable=\"true\">\n" +
    "</truncate-long-text>\n" +
    "</td>\n" +
    "</tr>\n" +
    "</tbody>\n" +
    "</table>\n" +
    "</div>\n" +
    "<p ng-if=\"!annotations\" class=\"mar-bottom-xl\">\n" +
    "There are no annotations on this resource.\n" +
    "</p>\n" +
    "</div>"
  );


  $templateCache.put('views/directives/breadcrumbs.html',
    "<ol class=\"breadcrumb\" ng-if=\"breadcrumbs.length\">\n" +
    "<li ng-repeat=\"breadcrumb in breadcrumbs\" ng-class=\"{'active': !$last}\">\n" +
    "<a ng-if=\"!$last && breadcrumb.link\" href=\"{{breadcrumb.link}}\">{{breadcrumb.title}}</a>\n" +
    "<a ng-if=\"!$last && !breadcrumb.link\" href=\"\" back>{{breadcrumb.title}}</a>\n" +
    "<strong ng-if=\"$last\">{{breadcrumb.title}}</strong>\n" +
    "</li>\n" +
    "</ol>"
  );


  $templateCache.put('views/directives/build-hooks.html',
    " <dl ng-class=\"{ 'dl-horizontal left': !build.spec.postCommit.script || !(build.spec.postCommit.script | isMultiline)}\">\n" +
    "<dt ng-if-start=\"build.spec.postCommit.command\">Command:</dt>\n" +
    "<dd ng-if-end>\n" +
    "<code class=\"command\">\n" +
    "<truncate-long-text content=\"build.spec.postCommit.command.join(' ')\" limit=\"80\" newline-limit=\"1\" expandable=\"true\" use-word-boundary=\"false\">\n" +
    "</truncate-long-text>\n" +
    "</code>\n" +
    "</dd>\n" +
    "<dt ng-if-start=\"build.spec.postCommit.script\">Script:</dt>\n" +
    "<dd ng-if-end>\n" +
    "<code ng-if=\"!(build.spec.postCommit.script | isMultiline)\" class=\"command\">\n" +
    "<truncate-long-text content=\"build.spec.postCommit.script\" limit=\"80\" expandable=\"true\" use-word-boundary=\"false\">\n" +
    "</truncate-long-text>\n" +
    "</code>\n" +
    "<div ng-if=\"build.spec.postCommit.script | isMultiline\" ui-ace=\"{\n" +
    "        mode: 'sh',\n" +
    "        theme: 'eclipse',\n" +
    "        rendererOptions: {\n" +
    "          fadeFoldWidgets: true,\n" +
    "          showPrintMargin: false\n" +
    "        }\n" +
    "      }\" ng-model=\"build.spec.postCommit.script\" readonly=\"readonly\" class=\"ace-bordered ace-read-only ace-inline mar-top-md mar-bottom-md\">\n" +
    "</div>\n" +
    "</dd>\n" +
    "<dt ng-if-start=\"build.spec.postCommit.args\">Args:</dt>\n" +
    "<dd ng-if-end>\n" +
    "<code class=\"command\">\n" +
    "<truncate-long-text content=\"build.spec.postCommit.args.join(' ')\" limit=\"80\" newline-limit=\"1\" expandable=\"true\" use-word-boundary=\"false\">\n" +
    "</truncate-long-text>\n" +
    "</code>\n" +
    "</dd>\n" +
    "</dl>"
  );


  $templateCache.put('views/directives/build-pipeline.html',
    "<div>\n" +
    "<div ng-if=\"expandOnlyRunning\">\n" +
    "<div class=\"animate-if\" ng-if=\"build.status.phase === 'Running'\" ng-include=\"'views/directives/_build-pipeline-expanded.html'\"></div>\n" +
    "<div class=\"animate-if\" ng-if=\"build.status.phase !== 'Running'\" ng-include=\"'views/directives/_build-pipeline-collapsed.html'\"></div>\n" +
    "</div>\n" +
    "<div ng-if=\"!expandOnlyRunning\" ng-include=\"'views/directives/_build-pipeline-expanded.html'\"></div>\n" +
    "</div>"
  );


  $templateCache.put('views/directives/build-status.html',
    "<status-icon status=\"build.status.phase\" disable-animation></status-icon>\n" +
    "<span ng-if=\"!build.status.reason || build.status.phase === 'Cancelled'\">{{build.status.phase}}</span>\n" +
    "<span ng-if=\"build.status.reason && build.status.phase !== 'Cancelled'\">{{build.status.reason | sentenceCase}}</span><span ng-switch=\"build.status.phase\" class=\"hide-ng-leave\" ng-if=\"build.status.startTimestamp\"><span ng-switch-when=\"Complete\">, ran for {{build.status.startTimestamp | timeOnlyDurationFromTimestamps : build.status.completionTimestamp}}</span><span ng-switch-when=\"Failed\">, ran for {{build.status.startTimestamp | timeOnlyDurationFromTimestamps : build.status.completionTimestamp}}</span><span ng-switch-when=\"Cancelled\"> after {{build.status.startTimestamp | timeOnlyDurationFromTimestamps : build.status.completionTimestamp}}</span><span ng-switch-when=\"Running\"> for <time-only-duration-until-now timestamp=\"build.status.startTimestamp\" time-only></time-only-duration-until-now></span><span ng-switch-when=\"New\"></span><span ng-switch-when=\"Pending\"></span><span ng-switch-default>, ran for {{build.status.startTimestamp | duration : build.status.completionTimestamp}}</span>\n" +
    "</span>"
  );


  $templateCache.put('views/directives/create-secret.html',
    "<alerts alerts=\"alerts\"></alerts>\n" +
    "<ng-form name=\"secretForm\" class=\"create-secret-form\">\n" +
    "<div for=\"secretType\" ng-if=\"!type\" class=\"form-group mar-top-lg\">\n" +
    "<label>Secret Type</label>\n" +
    "<ui-select required ng-model=\"newSecret.type\" search-enabled=\"false\" ng-change=\"newSecret.authType = secretAuthTypeMap[newSecret.type].authTypes[0].id\">\n" +
    "<ui-select-match>{{$select.selected | upperFirst}} Secret</ui-select-match>\n" +
    "<ui-select-choices repeat=\"type in secretTypes\">\n" +
    "{{type | upperFirst}} Secret\n" +
    "</ui-select-choices>\n" +
    "</ui-select>\n" +
    "</div>\n" +
    "<div ng-if=\"newSecret.type\">\n" +
    "<div class=\"form-group\">\n" +
    "<label for=\"secretName\" class=\"required\">Secret Name</label>\n" +
    "<span ng-class=\"{'has-error': nameTaken || (secretForm.secretName.$invalid && secretForm.secretName.$touched)}\">\n" +
    "<input class=\"form-control\" id=\"secretName\" name=\"secretName\" ng-model=\"newSecret.data.secretName\" type=\"text\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\" aria-describedby=\"secret-name-help\" ng-pattern=\"nameValidation.pattern\" ng-maxlength=\"nameValidation.maxlength\" required>\n" +
    "</span>\n" +
    "<div class=\"has-error\" ng-show=\"nameTaken\">\n" +
    "<span class=\"help-block\">\n" +
    "This name is already in use. Please choose a different name.\n" +
    "</span>\n" +
    "</div>\n" +
    "<div class=\"has-error\" ng-show=\"secretForm.secretName.$invalid\">\n" +
    "<div ng-show=\"secretForm.secretName.$error.pattern && secretForm.secretName.$touched\" class=\"help-block\">\n" +
    "{{nameValidation.description}}\n" +
    "</div>\n" +
    "<div ng-show=\"secretForm.secretName.$error.required && secretForm.secretName.$touched\" class=\"help-block\">\n" +
    "Name is required.\n" +
    "</div>\n" +
    "<div ng-show=\"secretForm.secretName.$error.maxlength && secretForm.secretName.$touched\" class=\"help-block\">\n" +
    "Can't be longer than {{nameValidation.maxlength}} characters.\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"help-block\" id=\"secret-name-help\">\n" +
    "Unique name of the new secret.\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"form-group\">\n" +
    "<label for=\"authentificationType\">Authentication Type</label>\n" +
    "<ui-select required ng-model=\"newSecret.authType\" search-enabled=\"false\">\n" +
    "<ui-select-match>{{$select.selected.label}}</ui-select-match>\n" +
    "<ui-select-choices repeat=\"type.id as type in secretAuthTypeMap[newSecret.type].authTypes\">\n" +
    "{{type.label}}\n" +
    "</ui-select-choices>\n" +
    "</ui-select>\n" +
    "</div>\n" +
    "<div ng-if=\"newSecret.authType === 'kubernetes.io/basic-auth'\">\n" +
    "<div class=\"form-group\">\n" +
    "<label for=\"username\">Username</label>\n" +
    "<div>\n" +
    "<input class=\"form-control\" id=\"username\" name=\"username\" ng-model=\"newSecret.data.username\" type=\"text\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\" aria-describedby=\"username-help\">\n" +
    "</div>\n" +
    "<div class=\"help-block\" id=\"username-help\">\n" +
    "Optional username for Git authentication.\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"form-group\" ng-class=\"{ 'has-error' : secretForm.passwordToken.$invalid && secretForm.passwordToken.$touched }\">\n" +
    "<label ng-class=\"{ required: !add.cacert && !add.gitconfig }\" for=\"passwordToken\">Password or Token</label>\n" +
    "<input class=\"form-control\" id=\"passwordToken\" name=\"passwordToken\" ng-model=\"newSecret.data.passwordToken\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\" aria-describedby=\"password-token-help\" type=\"password\" ng-required=\"!add.cacert && !add.gitconfig\">\n" +
    "</div>\n" +
    "<div class=\"has-error\" ng-show=\"secretForm.passwordToken.$error.required && secretForm.passwordToken.$touched\">\n" +
    "<div class=\"help-block\">\n" +
    "Password or token is required.\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"help-block\" id=\"password-token-help\">\n" +
    "Password or token for Git authentication. Required if a ca.crt or .gitconfig file is not specified.\n" +
    "</div>\n" +
    "<div class=\"form-group\">\n" +
    "<div class=\"checkbox\">\n" +
    "<label>\n" +
    "<input type=\"checkbox\" ng-model=\"add.cacert\">\n" +
    "Use a custom ca.crt file\n" +
    "</label>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"form-group\" ng-if=\"add.cacert\" id=\"cacert\">\n" +
    "<label class=\"required\" for=\"cacert\">CA Certificate File</label>\n" +
    "<osc-file-input id=\"cacert-file-input\" model=\"newSecret.data.cacert\" drop-zone-id=\"cacert\" help-text=\"Upload your ca.crt file.\" required=\"true\"></osc-file-input>\n" +
    "<div ui-ace=\"{\n" +
    "          mode: 'txt',\n" +
    "          theme: 'eclipse',\n" +
    "          rendererOptions: {\n" +
    "            fadeFoldWidgets: true,\n" +
    "            showPrintMargin: false\n" +
    "          }\n" +
    "        }\" ng-model=\"newSecret.data.cacert\" class=\"create-secret-editor ace-bordered\" id=\"cacert-editor\" required></div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"newSecret.authType === 'kubernetes.io/ssh-auth'\">\n" +
    "<div class=\"form-group\" id=\"private-key\">\n" +
    "<label for=\"privateKey\" class=\"required\">SSH Private Key</label>\n" +
    "<osc-file-input id=\"private-key-file-input\" model=\"newSecret.data.privateKey\" drop-zone-id=\"private-key\" help-text=\"Upload your private SSH key file.\"></osc-file-input>\n" +
    "<div ui-ace=\"{\n" +
    "          theme: 'eclipse',\n" +
    "          rendererOptions: {\n" +
    "            fadeFoldWidgets: true,\n" +
    "            showPrintMargin: false\n" +
    "          }\n" +
    "        }\" ng-model=\"newSecret.data.privateKey\" class=\"create-secret-editor ace-bordered\" id=\"private-key-editor\" required></div>\n" +
    "<div class=\"help-block\">\n" +
    "Private SSH key file for Git authentication.\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"newSecret.type === 'source'\">\n" +
    "<div class=\"form-group\">\n" +
    "<div class=\"checkbox\">\n" +
    "<label>\n" +
    "<input type=\"checkbox\" ng-model=\"add.gitconfig\">\n" +
    "Use a custom .gitconfig file\n" +
    "</label>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"form-group\" ng-if=\"add.gitconfig\" id=\"gitconfig\">\n" +
    "<label class=\"required\" for=\"gitconfig\">Git Configuration File</label>\n" +
    "<osc-file-input id=\"gitconfig-file-input\" model=\"newSecret.data.gitconfig\" drop-zone-id=\"gitconfig\" help-text=\"Upload your .gitconfig or  file.\" required=\"true\"></osc-file-input>\n" +
    "<div ui-ace=\"{\n" +
    "          mode: 'ini',\n" +
    "          theme: 'eclipse',\n" +
    "          rendererOptions: {\n" +
    "            fadeFoldWidgets: true,\n" +
    "            showPrintMargin: false\n" +
    "          }\n" +
    "        }\" ng-model=\"newSecret.data.gitconfig\" class=\"create-secret-editor ace-bordered\" id=\"gitconfig-editor\" required></div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"newSecret.authType === 'kubernetes.io/dockercfg'\">\n" +
    "<div class=\"form-group\" ng-class=\"{ 'has-error' : secretForm.dockerServer.$invalid && secretForm.dockerServer.$touched }\">\n" +
    "<label for=\"dockerServer\" class=\"required\">Image Registry Server Address</label>\n" +
    "<div>\n" +
    "<input class=\"form-control\" id=\"dockerServer\" name=\"dockerServer\" ng-model=\"newSecret.data.dockerServer\" type=\"text\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\" required>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-show=\"secretForm.dockerServer.$error.required && secretForm.dockerServer.$touched\" class=\"has-error\">\n" +
    "<div class=\"help-block\">\n" +
    "Image registry server address is required.\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"form-group\" ng-class=\"{ 'has-error' : secretForm.dockerUsername.$invalid && secretForm.dockerUsername.$touched }\">\n" +
    "<label for=\"dockerUsername\" class=\"required\">Username</label>\n" +
    "<div>\n" +
    "<input class=\"form-control\" id=\"dockerUsername\" name=\"dockerUsername\" ng-model=\"newSecret.data.dockerUsername\" type=\"text\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\" required>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-show=\"secretForm.dockerUsername.$error.required && secretForm.dockerUsername.$touched\" class=\"has-error\">\n" +
    "<div class=\"help-block\">\n" +
    "Username is required.\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"form-group\" ng-class=\"{ 'has-error' : secretForm.dockerPassword.$invalid && secretForm.dockerPassword.$touched }\">\n" +
    "<label for=\"dockerPassword\" class=\"required\">Password</label>\n" +
    "<div>\n" +
    "<input class=\"form-control\" id=\"dockerPassword\" name=\"dockerPassword\" ng-model=\"newSecret.data.dockerPassword\" type=\"password\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\" required>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-show=\"secretForm.dockerPassword.$error.required && secretForm.dockerPassword.$touched\" class=\"has-error\">\n" +
    "<div class=\"help-block\">\n" +
    "Password is required.\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"form-group\" ng-class=\"{ 'has-error' : secretForm.dockerEmail.$invalid && secretForm.dockerEmail.$touched }\">\n" +
    "<label for=\"dockerEmail\" class=\"required\">Email</label>\n" +
    "<div>\n" +
    "<input class=\"form-control\" type=\"email\" id=\"dockerEmail\" name=\"dockerEmail\" ng-model=\"newSecret.data.dockerMail\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\" required>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"has-error\" ng-show=\"secretForm.dockerEmail.$invalid\">\n" +
    "<div ng-show=\"secretForm.dockerEmail.$error.email && secretForm.dockerEmail.$touched\" class=\"help-block\">\n" +
    "Email must be in the form of <var>user@domain</var>.\n" +
    "</div>\n" +
    "<div ng-show=\"secretForm.dockerEmail.$error.required && secretForm.dockerEmail.$touched\" class=\"help-block\">\n" +
    "Email is required.\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"newSecret.authType === 'kubernetes.io/dockerconfigjson'\">\n" +
    "<div class=\"form-group\" id=\"docker-config\">\n" +
    "<label for=\"dockerConfig\" class=\"required\">Configuration File</label>\n" +
    "<osc-file-input id=\"dockercfg-file-input\" model=\"newSecret.data.dockerConfig\" drop-zone-id=\"docker-config\" help-text=\"Upload a .dockercfg or .docker/config.json file\" required=\"true\"></osc-file-input>\n" +
    "<div ui-ace=\"{\n" +
    "          mode: 'json',\n" +
    "          theme: 'eclipse',\n" +
    "          onChange: aceChanged,\n" +
    "          rendererOptions: {\n" +
    "            fadeFoldWidgets: true,\n" +
    "            showPrintMargin: false\n" +
    "          }\n" +
    "        }\" ng-model=\"newSecret.data.dockerConfig\" class=\"create-secret-editor ace-bordered\" id=\"dockerconfig-editor\" required></div>\n" +
    "<div class=\"help-block\">\n" +
    "File with credentials and other configuration for connecting to a secured image registry.\n" +
    "</div>\n" +
    "<div class=\"has-warning\" ng-show=\"invalidConfigFormat\">\n" +
    "<span class=\"help-block\">\n" +
    "Configuration file should be in JSON format.\n" +
    "</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"('serviceaccounts' | canI : 'update') && !serviceAccountToLink\">\n" +
    "<div class=\"form-group\">\n" +
    "<div class=\"checkbox\">\n" +
    "<label>\n" +
    "<input type=\"checkbox\" ng-model=\"newSecret.linkSecret\">\n" +
    "Link secret to a service account.\n" +
    "<a href=\"{{'managing_secrets' | helpLink}}\" target=\"_blank\"><span class=\"learn-more-inline\">Learn More&nbsp;<i class=\"fa fa-external-link\" aria-hidden=\"true\"></i></span></a>\n" +
    "</label>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"newSecret.linkSecret\">\n" +
    "<div class=\"form-group\">\n" +
    "<label class=\"required\">Service Account</label>\n" +
    "<ui-select required ng-model=\"newSecret.pickedServiceAccountToLink\">\n" +
    "<ui-select-match placeholder=\"Service Account Name\">{{$select.selected}}</ui-select-match>\n" +
    "<ui-select-choices repeat=\"sa in (serviceAccountsNames | filter : $select.search)\">\n" +
    "<div ng-bind-html=\"sa | highlight : $select.search\"></div>\n" +
    "</ui-select-choices>\n" +
    "</ui-select>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"buttons gutter-top-bottom\">\n" +
    "<button class=\"btn btn-lg btn-primary\" type=\"button\" ng-disabled=\"secretForm.$invalid || secretForm.$pristine || invalidConfigFormat\" ng-click=\"create()\">Create</button>\n" +
    "<button class=\"btn btn-lg btn-default\" type=\"button\" ng-click=\"cancel()\">Cancel</button>\n" +
    "</div>\n" +
    "</ng-form>"
  );


  $templateCache.put('views/directives/delete-button.html',
    "<div class=\"actions\">\n" +
    "\n" +
    "<a href=\"\" ng-click=\"$event.stopPropagation(); openDeleteModal()\" role=\"button\" class=\"action-button\" ng-attr-aria-disabled=\"{{disableDelete ? 'true' : undefined}}\" ng-class=\"{ 'disabled-link': disableDelete }\"><i class=\"fa fa-trash-o\" aria-hidden=\"true\"></i><span class=\"sr-only\">Delete {{kind | humanizeKind}} {{resourceName}}</span></a>\n" +
    "</div>"
  );


  $templateCache.put('views/directives/delete-link.html',
    "<a href=\"javascript:void(0)\" ng-click=\"openDeleteModal()\" role=\"button\" ng-attr-aria-disabled=\"{{disableDelete ? 'true' : undefined}}\" ng-class=\"{ 'disabled-link': disableDelete }\">{{label || 'Delete'}}</a>"
  );


  $templateCache.put('views/directives/deploy-image.html',
    "<div class=\"deploy-image\">\n" +
    "<p>\n" +
    "Deploy an existing image from an image stream tag or Docker pull spec.\n" +
    "</p>\n" +
    "<form>\n" +
    "<fieldset ng-disabled=\"loading\">\n" +
    "<div class=\"radio\">\n" +
    "<label>\n" +
    "<input type=\"radio\" ng-model=\"mode\" value=\"istag\">\n" +
    "Image Stream Tag\n" +
    "</label>\n" +
    "</div>\n" +
    "<fieldset>\n" +
    "<istag-select model=\"istag\" select-disabled=\"mode !== 'istag'\" include-shared-namespace=\"true\"></istag-select>\n" +
    "<div ng-if=\"mode == 'istag' && istag.namespace && istag.namespace !== 'openshift' && istag.namespace !== project\" class=\"alert alert-warning\">\n" +
    "<span class=\"pficon pficon-warning-triangle-o\" aria-hidden=\"true\"></span>\n" +
    "Service account <strong>default</strong> will need image pull authority to deploy images from <strong>{{istag.namespace}}</strong>. You can grant authority with the command:\n" +
    "<p>\n" +
    "<code>oc policy add-role-to-user system:image-puller system:serviceaccount:{{project}}:default -n {{istag.namespace}}</code>\n" +
    "</p>\n" +
    "</div>\n" +
    "</fieldset>\n" +
    "<div class=\"radio\">\n" +
    "<label>\n" +
    "<input type=\"radio\" ng-model=\"mode\" value=\"dockerImage\">\n" +
    "Image Name\n" +
    "</label>\n" +
    "</div>\n" +
    "<div class=\"form-group\">\n" +
    "<label for=\"imageName\" class=\"sr-only\">Image name or pull spec</label>\n" +
    "<div class=\"input-group\">\n" +
    "<input type=\"search\" id=\"imageName\" ng-model=\"imageName\" required select-on-focus ng-disabled=\"mode !== 'dockerImage'\" placeholder=\"Image name or pull spec\" class=\"form-control\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\">\n" +
    "<span class=\"input-group-btn\">\n" +
    "<button class=\"btn btn-default\" type=\"submit\" ng-disabled=\"!imageName\" ng-click=\"findImage()\">\n" +
    "<i class=\"fa fa-search\" aria-hidden=\"true\"></i>\n" +
    "<span class=\"sr-only\">Find</span>\n" +
    "</button>\n" +
    "</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "</fieldset>\n" +
    "</form>\n" +
    "<div ng-if=\"loading || !import\" class=\"empty-state-message text-muted text-center\">\n" +
    "<span class=\"fa fa-cube icon-lg hero-icon\" aria-hidden=\"true\"></span>\n" +
    "<div ng-if=\"!loading\" class=\"h2\">Select an image stream tag or enter an image name.</div>\n" +
    "<div ng-if=\"loading\" class=\"h2 truncate\">Loading image metadata for {{imageName | stripSHA}}...</div>\n" +
    "</div>\n" +
    "<div class=\"row mar-bottom-md\" ng-if-start=\"!loading && import.image\">\n" +
    "<div class=\"col-sm-12 mar-top-lg mar-bottom-lg\">\n" +
    "<div class=\"separator\"></div>\n" +
    "</div>\n" +
    "<div class=\"col-sm-2 hidden-xs text-right h2\">\n" +
    "<span class=\"fa fa-cube text-muted\" style=\"font-size: 100px\" aria-hidden=\"true\"></span>\n" +
    "</div>\n" +
    "<div class=\"col-sm-10\">\n" +
    "<div ng-if=\"runsAsRoot\" class=\"alert alert-warning\">\n" +
    "<span class=\"pficon pficon-warning-triangle-o\" aria-hidden=\"true\"></span>\n" +
    "Image <strong>{{import.name}}</strong> runs as the\n" +
    "<strong>root</strong> user which might not be permitted by your cluster administrator.\n" +
    "</div>\n" +
    "<h2>\n" +
    "<span ng-if=\"mode === 'dockerImage'\">{{import.name}}</span>\n" +
    "<span ng-if=\"mode === 'istag'\">{{istag.imageStream}}<span ng-if=\"import.tag\">:{{import.tag}}</span></span>\n" +
    "<small>\n" +
    "<span ng-if=\"import.result.ref.registry\">from {{import.result.ref.registry}},</span>\n" +
    "<span am-time-ago=\"import.image.dockerImageMetadata.Created\"></span>,\n" +
    "<span ng-if=\"import.image.dockerImageMetadata.Size\">{{import.image.dockerImageMetadata.Size | humanizeSize}},</span>\n" +
    "{{import.image.dockerImageLayers.length}} layers\n" +
    "</small>\n" +
    "</h2>\n" +
    "<ul>\n" +
    "<li ng-if=\"!import.namespace\">Image Stream <strong>{{app.name || \"&lt;name&gt;\"}}:{{import.tag || 'latest'}}</strong> will track this image.</li>\n" +
    "<li>This image will be deployed in Deployment Config <strong>{{app.name || \"&lt;name&gt;\"}}</strong>.</li>\n" +
    "<li ng-if=\"ports.length\">\n" +
    "<span ng-if=\"ports.length === 1\">Port</span>\n" +
    "<span ng-if=\"ports.length > 1\">Ports</span>\n" +
    "<span ng-repeat=\"port in ports\">\n" +
    "<span ng-if=\"!$first && $last\">and</span>\n" +
    "{{port.containerPort}}/{{port.protocol}}<span ng-if=\"!$last && ports.length > 2\">,</span>\n" +
    "</span>\n" +
    "will be load balanced by Service <strong>{{app.name || \"&lt;name&gt;\"}}</strong>.\n" +
    "<div>Other containers can access this service through the hostname <strong>{{app.name || \"&lt;name&gt;\"}}</strong>.</div>\n" +
    "</li>\n" +
    "</ul>\n" +
    "<div ng-if=\"(volumes | hashSize) > 0\" class=\"help-block\">\n" +
    "This image declares volumes and will default to use non-persistent, host-local storage. You can add persistent storage later to the deployment config.\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"row\" ng-if-end>\n" +
    "<div class=\"col-sm-12\">\n" +
    "<form name=\"form\" class=\"osc-form\">\n" +
    "<div class=\"form-group\">\n" +
    "<label for=\"name\" class=\"required\">Name</label>\n" +
    "<div ng-class=\"{'has-error': form.name.$invalid || nameTaken}\">\n" +
    "<input type=\"text\" required select-on-focus minlength=\"2\" maxlength=\"24\" pattern=\"[a-z]([-a-z0-9]*[a-z0-9])?\" ng-model=\"app.name\" id=\"name\" name=\"name\" class=\"form-control\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\">\n" +
    "</div>\n" +
    "<div class=\"help-block\">Identifies the resources created for this image.</div>\n" +
    "<div class=\"has-error\" ng-show=\"form.name.$invalid\">\n" +
    "<div class=\"help-block\" ng-show=\"form.name.$error.required\">\n" +
    "A name is required.\n" +
    "</div>\n" +
    "<div class=\"help-block\" ng-show=\"form.name.$error.pattern\">\n" +
    "Name must be an alphanumeric (a-z, 0-9) string with a maximum length of 24 characters where the first character is a letter (a-z). The '-' character is allowed anywhere except the first or last character.\n" +
    "</div>\n" +
    "<div class=\"help-block\" ng-show=\"form.name.$error.minlength\">\n" +
    "Name must have at least 2 characters.\n" +
    "</div>\n" +
    "<div class=\"help-block\" ng-show=\"form.name.$error.maxlength\">\n" +
    "Name can't have more than 24 characters.\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"has-error\" ng-show=\"nameTaken\">\n" +
    "<span class=\"help-block\">This name is already in use within the project. Please choose a different name.</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "<osc-secrets model=\"pullSecrets\" namespace=\"project\" display-type=\"pull\" type=\"image\" secrets-by-type=\"secretsByType\" service-account-to-link=\"default\" alerts=\"alerts\" allow-multiple-secrets=\"true\">\n" +
    "</osc-secrets>\n" +
    "<osc-form-section header=\"Environment Variables\" about-title=\"Environment Variables\" about=\"Environment variables are used to configure and pass information to running containers.\" expand=\"true\" can-toggle=\"false\" class=\"first-section\">\n" +
    "<key-value-editor entries=\"env\" key-placeholder=\"Name\" key-validator=\"[A-Za-z_][A-Za-z0-9_]*\" key-validator-error=\"A valid environment variable name is an alphanumeric (a-z and 0-9) string beginning with a letter that may contain underscores.\" value-placeholder=\"Value\" add-row-link=\"Add Environment Variable\"></key-value-editor>\n" +
    "</osc-form-section>\n" +
    "<label-editor labels=\"labels\" system-labels=\"systemLabels\" expand=\"true\" can-toggle=\"false\" help-text=\"Each label is applied to each created resource.\">\n" +
    "</label-editor>\n" +
    "<alerts alerts=\"alerts\"></alerts>\n" +
    "<div class=\"button-group gutter-bottom\" ng-class=\"{'gutter-top': !alerts.length}\">\n" +
    "<button type=\"submit\" class=\"btn btn-primary btn-lg\" ng-click=\"create()\" value=\"\" ng-disabled=\"form.$invalid || nameTaken || disableInputs\">Create</button>\n" +
    "<a class=\"btn btn-default btn-lg\" href=\"#\" back>Cancel</a>\n" +
    "</div>\n" +
    "</form>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"!loading && import.error\" class=\"empty-state-message text-center\">\n" +
    "<h2>\n" +
    "<i class=\"pficon pficon-error-circle-o\" aria-hidden=\"true\"></i>\n" +
    "Could not load image metadata.\n" +
    "</h2>\n" +
    "<p>{{import.error | upperFirst}}</p>\n" +
    "</div>\n" +
    "<div ng-if=\"!loading && import && !import.error && !import.image\" class=\"empty-state-message text-center\">\n" +
    "<h2>\n" +
    "No image metadata found.\n" +
    "</h2>\n" +
    "<p>Could not find any images for {{import.name | stripTag}}:{{import.tag}}.</p>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/directives/deployment-donut.html',
    "<div column class=\"deployment-donut\">\n" +
    "<div row>\n" +
    "<div column>\n" +
    "<pod-donut pods=\"pods\" desired=\"getDesiredReplicas()\" idled=\"isIdled\" ng-click=\"viewPodsForDeployment(rc)\" ng-class=\"{ clickable: (pods | hashSize) > 0 }\">\n" +
    "</pod-donut>\n" +
    "\n" +
    "<a href=\"\" class=\"sr-only\" ng-click=\"viewPodsForDeployment(rc)\" ng-if=\"(pods | hashSize) > 0\" role=\"button\">\n" +
    "View pods for {{rc | displayName}}\n" +
    "</a>\n" +
    "</div>\n" +
    "\n" +
    "<div column class=\"scaling-controls fade-inline\" ng-if=\"(hpa && !hpa.length) && ((deploymentConfig || rc) | canIScale) && !isIdled\">\n" +
    "<div>\n" +
    "<a href=\"\" ng-click=\"scaleUp()\" ng-class=\"{ disabled: !scalable }\" ng-attr-title=\"{{!scalable ? undefined : 'Scale up'}}\" ng-attr-aria-disabled=\"{{!scalable ? 'true' : undefined}}\">\n" +
    "<i class=\"fa fa-chevron-up\"></i>\n" +
    "<span class=\"sr-only\">Scale up</span>\n" +
    "</a>\n" +
    "</div>\n" +
    "<div>\n" +
    "\n" +
    "<a href=\"\" ng-click=\"scaleDown()\" ng-class=\"{ disabled: !scalable || getDesiredReplicas() === 0 }\" ng-attr-title=\"{{(!scalable || getDesiredReplicas() === 0) ? undefined : 'Scale down'}}\" ng-attr-aria-disabled=\"{{(!scalable || getDesiredReplicas() === 0) ? 'true' : undefined}}\" role=\"button\">\n" +
    "<i class=\"fa fa-chevron-down\"></i>\n" +
    "<span class=\"sr-only\">Scale down</span>\n" +
    "</a>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div row ng-if=\"hpa.length\" class=\"scaling-details\">\n" +
    "<div>\n" +
    "Autoscaled:\n" +
    "<span class=\"nowrap\">min: {{hpa[0].spec.minReplicas || 1}},</span>\n" +
    "<span class=\"nowrap\">\n" +
    "max: {{hpa[0].spec.maxReplicas}}\n" +
    "<span ng-if=\"hpaWarnings\" dynamic-content=\"{{hpaWarnings}}\" data-toggle=\"popover\" data-trigger=\"hover\" data-html=\"true\" class=\"pficon pficon-warning-triangle-o hpa-warning\" aria-hidden=\"true\">\n" +
    "</span>\n" +
    "</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"scaling-details\" ng-if=\"showQuotaWarning\">\n" +
    "<span class=\"pficon pficon-warning-triangle-o\"></span>\n" +
    "<a ng-href=\"project/{{rc.metadata.namespace}}/quota\">Quota</a>\n" +
    "limit reached.\n" +
    "</div>\n" +
    "<div class=\"scaling-details\" ng-if=\"showQuotaWarning\">\n" +
    "Scaling may be affected.\n" +
    "<a ng-if=\"rc.kind !== 'StatefulSet'\" ng-href=\"{{rc | navigateResourceURL}}?tab=events\">Check events</a>\n" +
    "<a ng-if=\"rc.kind === 'StatefulSet'\" ng-href=\"project/{{rc.metadata.namespace}}/browse/events\">Check events</a>\n" +
    "</div>\n" +
    "<div class=\"scaling-details\" ng-if=\"isIdled && (!getDesiredReplicas())\">\n" +
    "<div ng-if=\"(!resuming)\">\n" +
    "<span>Idled due to inactivity.</span>\n" +
    "<a href=\"\" ng-click=\"unIdle()\">Start {{(deploymentConfig || rc) | unidleTargetReplicas : hpa}} pod{{ ((deploymentConfig || rc) | unidleTargetReplicas : hpa) > 1 ? 's' : ''}}</a>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/directives/deployment-metrics.html',
    "<div class=\"metrics\">\n" +
    "<div ng-if=\"!metricsError\" class=\"metrics-options\">\n" +
    "<div class=\"pull-right learn-more-block hidden-xs\">\n" +
    "<a href=\"\" ng-click=\"showComputeUnitsHelp()\">About Compute Resources</a>\n" +
    "</div>\n" +
    "<div ng-if=\"containers.length\" class=\"form-group\">\n" +
    "<label for=\"selectContainer\">Container:</label>\n" +
    "<div class=\"select-container\">\n" +
    "<span ng-show=\"containers.length === 1\">\n" +
    "{{options.selectedContainer.name}}\n" +
    "</span>\n" +
    "<ui-select ng-show=\"containers.length > 1\" ng-model=\"options.selectedContainer\" input-id=\"selectContainer\">\n" +
    "<ui-select-match>{{$select.selected.name}}</ui-select-match>\n" +
    "<ui-select-choices repeat=\"container in containers | filter : { name: $select.search }\">\n" +
    "<div ng-bind-html=\"container.name | highlight : $select.search\"></div>\n" +
    "</ui-select-choices>\n" +
    "</ui-select>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"form-group\">\n" +
    "<label for=\"timeRange\">Time Range:</label>\n" +
    "<div class=\"select-range\">\n" +
    "<ui-select ng-model=\"options.timeRange\" search-enabled=\"false\" ng-disabled=\"metricsError\" input-id=\"timeRange\">\n" +
    "<ui-select-match>{{$select.selected.label}}</ui-select-match>\n" +
    "<ui-select-choices repeat=\"range in options.rangeOptions\">\n" +
    "{{range.label}}\n" +
    "</ui-select-choices>\n" +
    "</ui-select>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<ellipsis-pulser color=\"dark\" size=\"sm\" msg=\"Loading metrics\" ng-if=\"!loaded\"></ellipsis-pulser>\n" +
    "<div ng-if=\"loaded && noData && !metricsError\" class=\"mar-top-md\">\n" +
    "No metrics to display.\n" +
    "</div>\n" +
    "<div ng-if=\"metricsError\" class=\"empty-state-message text-center\">\n" +
    "<h2>\n" +
    "<span class=\"pficon pficon-error-circle-o\" aria-hidden=\"true\"></span>\n" +
    "Metrics are not available.\n" +
    "</h2>\n" +
    "<p>\n" +
    "An error occurred getting metrics<span ng-if=\"options.selectedContainer.name\">\n" +
    "for container {{options.selectedContainer.name}}</span><span ng-if=\"metricsURL\">\n" +
    "from <a ng-href=\"{{metricsURL}}\">{{metricsURL}}</a></span>.\n" +
    "</p>\n" +
    "<p class=\"text-muted\">\n" +
    "{{metricsError.details}}\n" +
    "</p>\n" +
    "</div>\n" +
    "<div ng-repeat=\"metric in metrics\" ng-show=\"!noData && !metricsError\" class=\"metrics-full\">\n" +
    "<h2 class=\"metric-label\">\n" +
    "{{metric.label}}\n" +
    "<small ng-if=\"showAverage\">\n" +
    "Average per pod\n" +
    "</small>\n" +
    "</h2>\n" +
    "\n" +
    "<div ng-attr-id=\"{{metric.chartID}}\" class=\"metrics-sparkline\"></div>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/directives/edit-config-map.html',
    "<ng-form name=\"configMapForm\">\n" +
    "<fieldset>\n" +
    "\n" +
    "<div ng-show=\"showNameInput\" class=\"form-group\">\n" +
    "<label for=\"config-map-name\" class=\"required\">Name</label>\n" +
    "\n" +
    "<div ng-class=\"{ 'has-error': configMapForm.name.$invalid && configMapForm.name.$touched }\">\n" +
    "<input id=\"config-map-name\" class=\"form-control\" type=\"text\" name=\"name\" ng-model=\"configMap.metadata.name\" ng-required=\"showNameInput\" ng-pattern=\"nameValidation.pattern\" ng-maxlength=\"nameValidation.maxlength\" placeholder=\"my-config-map\" select-on-focus autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\" aria-describedby=\"config-map-name-help\">\n" +
    "</div>\n" +
    "<div>\n" +
    "<span id=\"config-map-name-help\" class=\"help-block\">A unique name for the config map within the project.</span>\n" +
    "</div>\n" +
    "<div class=\"has-error\" ng-show=\"configMapForm.name.$error.pattern && configMapForm.name.$touched\">\n" +
    "<span class=\"help-block\">\n" +
    "{{nameValidation.description}}\n" +
    "</span>\n" +
    "</div>\n" +
    "<div class=\"has-error\" ng-show=\"configMapForm.name.$error.required && configMapForm.name.$touched\">\n" +
    "<span class=\"help-block\">\n" +
    "Name is required.\n" +
    "</span>\n" +
    "</div>\n" +
    "<div class=\"has-error\" ng-show=\"configMapForm.name.$error.maxlength\">\n" +
    "<span class=\"help-block\">\n" +
    "Can't be longer than {{nameValidation.maxlength}} characters.\n" +
    "</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"!data.length\">\n" +
    "<p><em>The config map has no items.</em></p>\n" +
    "<a href=\"\" ng-click=\"addItem()\">Add Item</a>\n" +
    "</div>\n" +
    "<div ng-repeat=\"item in data\" ng-init=\"keys = getKeys()\">\n" +
    "<div class=\"form-group\">\n" +
    "<label ng-attr-for=\"key-{{$id}}\" class=\"required\">Key</label>\n" +
    "\n" +
    "<div ng-class=\"{ 'has-error': configMapForm['key-' + $id].$invalid && configMapForm['key-' + $id].$touched }\">\n" +
    "<input class=\"form-control\" name=\"key-{{$id}}\" ng-attr-id=\"key-{{$id}}\" type=\"text\" ng-model=\"item.key\" required ng-pattern=\"/^[-._a-zA-Z0-9]+$/\" ng-maxlength=\"253\" osc-unique=\"keys\" placeholder=\"my.key\" select-on-focus autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\" aria-describedby=\"key-{{$id}}-help\">\n" +
    "</div>\n" +
    "<div class=\"help-block\">\n" +
    "A unique key for this config map entry.\n" +
    "</div>\n" +
    "<div class=\"has-error\" ng-show=\"configMapForm['key-' + $id].$error.required && configMapForm['key-' + $id].$touched\">\n" +
    "<span class=\"help-block\">\n" +
    "Key is required.\n" +
    "</span>\n" +
    "</div>\n" +
    "<div class=\"has-error\" ng-show=\"configMapForm['key-' + $id].$error.oscUnique && configMapForm['key-' + $id].$touched\">\n" +
    "<span class=\"help-block\">\n" +
    "Duplicate key \"{{item.key}}\". Keys must be unique within the config map.\n" +
    "</span>\n" +
    "</div>\n" +
    "<div class=\"has-error\" ng-show=\"configMapForm['key-' + $id].$error.pattern && configMapForm['key-' + $id].$touched\">\n" +
    "<span class=\"help-block\">\n" +
    "Config map keys may only consist of letters, numbers, periods, hyphens, and underscores.\n" +
    "</span>\n" +
    "</div>\n" +
    "<div class=\"has-error\" ng-show=\"configMapForm['key-' + $id].$error.maxlength\">\n" +
    "<span class=\"help-block\">\n" +
    "Config map keys may not be longer than 253 characters.\n" +
    "</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"form-group\" ng-attr-id=\"drop-zone-{{$id}}\">\n" +
    "<label ng-attr-for=\"name-{{$id}}\">Value</label>\n" +
    "<osc-file-input model=\"item.value\" drop-zone-id=\"drop-zone-{{$id}}\" help-text=\"Enter a value for the config map entry or use the contents of a file.\"></osc-file-input>\n" +
    "<div ui-ace=\"{\n" +
    "          theme: 'eclipse',\n" +
    "          rendererOptions: {\n" +
    "            showPrintMargin: false\n" +
    "          }\n" +
    "        }\" ng-model=\"item.value\" class=\"ace-bordered ace-inline-small mar-top-sm\" ng-attr-id=\"value-{{$id}}\"></div>\n" +
    "</div>\n" +
    "<div class=\"mar-bottom-md\">\n" +
    "<a href=\"\" ng-click=\"removeItem($index)\">Remove Item</a>\n" +
    "<span ng-if=\"$last\">\n" +
    "<span class=\"action-divider\">|</span>\n" +
    "<a href=\"\" ng-click=\"addItem()\">Add Item</a>\n" +
    "</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div>\n" +
    "</div>\n" +
    "</fieldset>\n" +
    "</ng-form>"
  );


  $templateCache.put('views/directives/edit-lifecycle-hook.html',
    "<ng-form name=\"editForm\">\n" +
    "<div ng-switch=\"type\">\n" +
    "<div class=\"help-block\" ng-switch-when=\"pre\">Pre hooks execute before the deployment begins.</div>\n" +
    "<div class=\"help-block\" ng-switch-when=\"mid\">Mid hooks execute after the previous deployment is scaled down to zero and before the first pod of the new deployment is created.</div>\n" +
    "<div class=\"help-block\" ng-switch-when=\"post\">Post hooks execute after the deployment strategy completes.</div>\n" +
    "</div>\n" +
    "<div class=\"gutter-top\" ng-if=\"hookParams\">\n" +
    "<fieldset ng-disabled=\"view.isDisabled\">\n" +
    "<div class=\"form-group\">\n" +
    "<label for=\"actionType\" class=\"required\">Lifecycle Action</label><br/>\n" +
    "<div class=\"radio\">\n" +
    "<label class=\"radio-inline\">\n" +
    "<input type=\"radio\" name=\"{{type}}-action-newpod\" ng-model=\"action.type\" value=\"execNewPod\" aria-describedby=\"action-help\">\n" +
    "Run a specific command in a new pod\n" +
    "</label>\n" +
    "<label class=\"radio-inline\">\n" +
    "<input type=\"radio\" name=\"{{type}}-action-images\" ng-model=\"action.type\" value=\"tagImages\" aria-describedby=\"action-help\">\n" +
    "Tag image if the deployment succeeds\n" +
    "</label>\n" +
    "</div>\n" +
    "<div id=\"action-help\" class=\"help-block\">\n" +
    "<span ng-if=\"action.type === 'execNewPod'\">Runs a command in a new pod using the container from the deployment template. You can add additional environment variables and volumes.</span>\n" +
    "<span ng-if=\"action.type === 'tagImages'\">Tags the current image as an image stream tag if the deployment succeeds.</span>\n" +
    "<a href=\"{{'new_pod_exec' | helpLink}}\" aria-hidden=\"true\" target=\"_blank\"><span class=\"learn-more-inline\">Learn More&nbsp;<i class=\"fa fa-external-link\"></i></span></a>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"action.type === 'execNewPod'\">\n" +
    "<div class=\"form-group\">\n" +
    "<label class=\"required\">Container Name</label>\n" +
    "<ui-select ng-model=\"hookParams.execNewPod.containerName\" required>\n" +
    "<ui-select-match>{{$select.selected}}</ui-select-match>\n" +
    "<ui-select-choices repeat=\"container in (availableContainers | filter : $select.search)\" ng-disabled=\"view.isDisabled\">\n" +
    "<div ng-bind-html=\"container | highlight : $select.search\"></div>\n" +
    "</ui-select-choices>\n" +
    "</ui-select>\n" +
    "</div>\n" +
    "<div class=\"form-group\">\n" +
    "<label class=\"required\">Command</label>\n" +
    "<edit-command args=\"hookParams.execNewPod.command\" is-required=\"true\"></edit-command>\n" +
    "</div>\n" +
    "<div class=\"form-group\">\n" +
    "<label>Environment Variables</label>\n" +
    "<key-value-editor entries=\"hookParams.execNewPod.env\" key-validator=\"[a-zA-Z_][a-zA-Z0-9_]*\" key-validator-error-tooltip=\"A valid environment variable name is an alphanumeric (a-z and 0-9) string beginning with a letter that may contain underscores.\" add-row-link=\"Add Environment Variable\"></key-value-editor>\n" +
    "<div class=\"help-block\">\n" +
    "Environment variables to supply to the hook pod's container.\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"form-group\">\n" +
    "<label>Volumes</label>\n" +
    "<ui-select multiple=\"multiple\" placeholder=\"Select volume\" ng-model=\"hookParams.execNewPod.volumes\" ng-disabled=\"view.isDisabled\">\n" +
    "<ui-select-match>{{$item}}</ui-select-match>\n" +
    "<ui-select-choices repeat=\"volume in availableVolumes | filter : $select.search\">\n" +
    "<div ng-bind-html=\"volume | highlight : $select.search\"></div>\n" +
    "</ui-select-choices>\n" +
    "</ui-select>\n" +
    "<div class=\"help-block\">\n" +
    "List of named volumes to copy to the hook pod.\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"action.type === 'tagImages'\">\n" +
    "<div ng-repeat=\"tagImage in hookParams.tagImages\">\n" +
    "<div ng-if=\"hookParams.tagImages.length === 1\">\n" +
    "<div class=\"form-group\">\n" +
    "<label class=\"required\">Container Name</label>\n" +
    "<ui-select ng-model=\"tagImage.containerName\" ng-disabled=\"view.isDisabled\" required>\n" +
    "<ui-select-match>{{$select.selected}}</ui-select-match>\n" +
    "<ui-select-choices repeat=\"container in (availableContainers | filter : $select.search)\">\n" +
    "<div ng-bind-html=\"container | highlight : $select.search\"></div>\n" +
    "</ui-select-choices>\n" +
    "</ui-select>\n" +
    "<div class=\"help-block\">\n" +
    "Use the image for this container as the source of the tag.\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"form-group\">\n" +
    "<label class=\"required\">Tag As</label>\n" +
    "<istag-select model=\"istagHook\" allow-custom-tag=\"true\" select-disabled=\"view.isDisabled\"></istag-select>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"read-only-tag-image\" ng-if=\"hookParams.tagImages.length > 1\">\n" +
    "<p class=\"read-only-info\" ng-if=\"$first\">\n" +
    "<span class=\"pficon pficon-info\" aria-hidden=\"true\"></span>\n" +
    "More than one image tag is defined. To change image tags, use the YAML editor.\n" +
    "</p>\n" +
    "{{tagImage.containerName}}&nbsp;&rarr;&nbsp;{{tagImage.to.namespace || namespace}}/{{tagImage.to.name}}\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"form-group failure-policy\">\n" +
    "<label class=\"required picker-label\">Failure Policy</label>\n" +
    "<ui-select ng-model=\"hookParams.failurePolicy\" search-enabled=\"false\" ng-disabled=\"view.isDisabled\">\n" +
    "<ui-select-match>{{$select.selected}}</ui-select-match>\n" +
    "<ui-select-choices repeat=\"failurePolicyTypes in lifecycleHookFailurePolicyTypes\">\n" +
    "{{failurePolicyTypes}}\n" +
    "</ui-select-choices>\n" +
    "</ui-select>\n" +
    "<div ng-switch=\"hookParams.failurePolicy\">\n" +
    "<div class=\"help-block\" ng-switch-when=\"Retry\">Retry the hook until it succeeds.</div>\n" +
    "<div class=\"help-block\" ng-switch-when=\"Abort\">Fail the deployment if the hook fails.</div>\n" +
    "<div class=\"help-block\" ng-switch-when=\"Ignore\">Ignore hook failures and continue the deployment.</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</fieldset>\n" +
    "</div>\n" +
    "<span>\n" +
    "<a href=\"\" role=\"button\" ng-if=\"!hookParams\" ng-click=\"addHook()\">Add {{type | upperFirst}} Lifecycle Hook</a>\n" +
    "<a href=\"\" role=\"button\" ng-if=\"hookParams\" ng-click=\"removeHook()\">Remove {{type | upperFirst}} Lifecycle Hook</a>\n" +
    "</span>\n" +
    "</ng-form>"
  );


  $templateCache.put('views/directives/edit-webhook-triggers.html',
    "<h5>{{type}} webhooks\n" +
    "<span class=\"help action-inline\">\n" +
    "<a href=\"\" aria-hidden=\"true\">\n" +
    "<span class=\"sr-only\">{{typeInfo}}</span>\n" +
    "<i class=\"pficon pficon-help\" data-toggle=\"tooltip\" aria-hidden=\"true\" data-original-title=\"{{typeInfo}}\"></i>\n" +
    "</a>\n" +
    "</span>\n" +
    "</h5>\n" +
    "<div ng-repeat=\"trigger in triggers\">\n" +
    "<div class=\"trigger-info\">\n" +
    "<span class=\"trigger-url\">\n" +
    "<copy-to-clipboard is-disabled=\"trigger.disabled\" clipboard-text=\"bcName | webhookURL : trigger.data.type : trigger.data[(type === 'GitHub') ? 'github' : 'generic'].secret : projectName\"></copy-to-clipboard>\n" +
    "</span>\n" +
    "<span class=\"visible-xs-inline trigger-actions\">\n" +
    "<a href=\"\" ng-if=\"!trigger.disabled\" class=\"action-icon\" ng-click=\"trigger.disabled = true; form.$setDirty()\" role=\"button\">\n" +
    "<span class=\"pficon pficon-close\" aria-hidden=\"true\" title=\"Remove\"></span>\n" +
    "<span class=\"sr-only\">Remove</span>\n" +
    "</a>\n" +
    "<a href=\"\" ng-if=\"trigger.disabled\" class=\"action-icon\" ng-click=\"trigger.disabled = false\" role=\"button\">\n" +
    "<span class=\"fa fa-repeat\" aria-hidden=\"true\" title=\"Undo\"></span>\n" +
    "<span class=\"sr-only\">Undo</span>\n" +
    "</a>\n" +
    "</span>\n" +
    "<span class=\"hidden-xs trigger-actions\">\n" +
    "<a href=\"\" role=\"button\" ng-if=\"!trigger.disabled\" ng-click=\"trigger.disabled = true; form.$setDirty()\">Remove</a>\n" +
    "<a href=\"\" role=\"button\" ng-if=\"trigger.disabled\" ng-click=\"trigger.disabled = false\">Undo</a>\n" +
    "</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "<span>\n" +
    "<a href=\"\" role=\"button\" ng-click=\"addWebhookTrigger(type)\">Add {{type}} Webhook</a>\n" +
    "</span>"
  );


  $templateCache.put('views/directives/environment.html',
    "<div ng-if=\"envVars.length\" class=\"table-responsive\" style=\"margin-top: 5px\">\n" +
    "<table class=\"table table-bordered environment-variables\">\n" +
    "<thead>\n" +
    "<tr>\n" +
    "<th>Name</th>\n" +
    "<th>Value</th>\n" +
    "</tr>\n" +
    "</thead>\n" +
    "<tbody>\n" +
    "<tr ng-repeat=\"env in envVars\">\n" +
    "<td>{{env.name}}</td>\n" +
    "<td ng-if=\"!env.valueFrom\">\n" +
    "<truncate-long-text class=\"env-var-value\" content=\"env.value\" limit=\"200\" newline-limit=\"3\" expandable=\"true\" prettify-json=\"true\"></truncate-long-text>\n" +
    "</td>\n" +
    "<td ng-if=\"env.valueFrom\">\n" +
    "<span class=\"fa fa-external-link-square\" style=\"cursor: help\" data-toggle=\"popover\" data-trigger=\"hover\" data-content=\"This is a referenced value that will be generated when a container is created.  On running pods you can check the resolved values by going to the Terminal tab and echoing the environment variable.\"></span>\n" +
    "<span ng-repeat=\"(key, value) in env.valueFrom\">\n" +
    "<span ng-switch on=\"key\">\n" +
    "<span ng-switch-when=\"configMapKeyRef\">\n" +
    "Set to the key <b>{{value.key}}</b> in config map <b>{{value.name}}</b>.\n" +
    "</span>\n" +
    "<span ng-switch-when=\"secretKeyRef\">\n" +
    "Set to the key <b>{{value.key}}</b> in secret <b>{{value.name}}</b>.\n" +
    "</span>\n" +
    "<span ng-switch-when=\"fieldRef\">\n" +
    "Set to the field <b>{{value.fieldPath}}</b> in the current object.\n" +
    "</span>\n" +
    "<span ng-switch-default>\n" +
    "Set to a reference on a <b>{{key}}</b>.\n" +
    "</span>\n" +
    "</span>\n" +
    "</span>\n" +
    "</td>\n" +
    "</tr>\n" +
    "</tbody>\n" +
    "</table>\n" +
    "</div>"
  );


  $templateCache.put('views/directives/events-badge.html',
    "<a ng-href=\"project/{{projectContext.projectName}}/browse/events\" class=\"events-badge visible-xs\"><span class=\"event-label\">Events</span><span ng-if=\"warningCount\" class=\"mar-left-md\"><span class=\"pficon pficon-warning-triangle-o mar-right-sm\" aria-hidden=\"true\"></span><span class=\"sr-only\">Warning</span><span class=\"event-count\">{{warningCount}}</span></span><span ng-if=\"normalCount\" class=\"mar-left-sm\"><span class=\"pficon pficon-info mar-right-sm\" aria-hidden=\"true\"></span><span class=\"sr-only\">Normal</span><span class=\"event-count\">{{normalCount}}</span></span></a>\n" +
    "<a href=\"\" ng-click=\"expandSidebar()\" ng-if=\"sidebarCollapsed\" class=\"events-badge hidden-xs\"><span class=\"events-sidebar-expand fa fa-arrow-circle-o-left mar-right-md\"><span class=\"sr-only\">Expand event sidebar</span></span><span class=\"event-label\">Events</span><span ng-if=\"warningCount\" class=\"mar-left-md\"><span class=\"pficon pficon-warning-triangle-o mar-right-sm\" aria-hidden=\"true\"></span><span class=\"sr-only\">Warning</span><span class=\"event-count\">{{warningCount}}</span></span><span ng-if=\"normalCount\" class=\"mar-left-sm\"><span class=\"pficon pficon-info mar-right-sm\" aria-hidden=\"true\"></span><span class=\"sr-only\">Normal</span><span class=\"event-count\">{{normalCount}}</span></span></a>"
  );


  $templateCache.put('views/directives/events-sidebar.html',
    "<div class=\"right-container events-sidebar\" ng-hide=\"sidebarCollapsed\">\n" +
    "<div class=\"sidebar-header right-header\">\n" +
    "<div>\n" +
    "<h2>\n" +
    "<span class=\"events-sidebar-collapse\"><a href=\"\" class=\"fa fa-arrow-circle-o-right\" title=\"Collapse event sidebar\" ng-click=\"collapseSidebar()\"><span class=\"sr-only\">Collapse event sidebar</span></a></span>\n" +
    "Events\n" +
    "<small ng-if=\"warningCount\" class=\"warning-count\">\n" +
    "<span class=\"pficon pficon-warning-triangle-o\"></span>\n" +
    "{{warningCount}}\n" +
    "<span class=\"hidden-xs hidden-sm\">\n" +
    "<span ng-if=\"warningCount === 1\">warning</span>\n" +
    "<span ng-if=\"warningCount > 1\">warnings</span>\n" +
    "</span>\n" +
    "</small>\n" +
    "</h2>\n" +
    "</div>\n" +
    "<div ng-if=\"events | hashSize\" class=\"event-details-link\">\n" +
    "<a ng-href=\"project/{{projectContext.projectName}}/browse/events\">View Details</a>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"right-content\">\n" +
    "<ellipsis-pulser color=\"dark\" size=\"sm\" msg=\"Loading\" ng-if=\"!events\" class=\"events\"></ellipsis-pulser>\n" +
    "<div ng-if=\"events\" class=\"events\">\n" +
    "<div ng-if=\"!(events | hashSize)\" class=\"mar-left-xl\">\n" +
    "<em>No events.</em>\n" +
    "</div>\n" +
    "<div ng-repeat=\"event in events track by (event | uid)\" class=\"event animate-repeat\" ng-class=\"{'highlight': highlightedEvents[event.involvedObject.kind + '/' + event.involvedObject.name]}\">\n" +
    "<span class=\"sr-only\">{{event.type}}</span>\n" +
    "<div class=\"event-icon\" aria-hidden=\"true\">\n" +
    "<div ng-switch=\"event.type\" class=\"hide-ng-leave\">\n" +
    "<span ng-switch-when=\"Warning\" class=\"pficon pficon-warning-triangle-o\"></span>\n" +
    "<span ng-switch-when=\"Normal\" class=\"pficon pficon-info text-muted\"></span>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"event-details\">\n" +
    "<div class=\"detail-group\">\n" +
    "<div class=\"event-reason\">\n" +
    "{{event.reason | sentenceCase}}\n" +
    "</div>\n" +
    "<div class=\"event-object\">\n" +
    "{{event.involvedObject.kind | kindToResource | abbreviateResource}}/{{event.involvedObject.name}}\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"detail-group\">\n" +
    "<div class=\"event-message\">\n" +
    "{{event.message}}\n" +
    "</div>\n" +
    "<div class=\"event-timestamp\">\n" +
    "<span am-time-ago=\"event.lastTimestamp\"></span>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"event.count > 1\" class=\"text-muted small\">\n" +
    "{{event.count}} times in the last\n" +
    "<duration-until-now timestamp=\"event.firstTimestamp\" omit-single=\"true\" precision=\"1\"></duration-until-now>\n" +
    "</div>\n" +
    "<div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/directives/events.html',
    "<div ng-if=\"!events\">\n" +
    "Loading...\n" +
    "</div>\n" +
    "<div ng-if=\"events\" class=\"events\">\n" +
    "<div class=\"data-toolbar\">\n" +
    "<form role=\"form\" class=\"search-pf has-button\">\n" +
    "<div class=\"form-group filter-controls has-clear\">\n" +
    "<div class=\"search-pf-input-group\">\n" +
    "<label for=\"events-filter\" class=\"sr-only\">Filter</label>\n" +
    "<input type=\"search\" placeholder=\"Filter by keyword\" class=\"form-control\" id=\"events-filter\" ng-model=\"filter.text\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\">\n" +
    "<button type=\"button\" class=\"clear\" aria-hidden=\"true\" ng-if=\"filter.text\" ng-click=\"filter.text = ''\">\n" +
    "<span class=\"pficon pficon-close\"></span>\n" +
    "</button>\n" +
    "</div>\n" +
    "</div>\n" +
    "</form>\n" +
    "<div class=\"vertical-divider\"></div>\n" +
    "<div class=\"sort-group\">\n" +
    "<span class=\"sort-label\">Sort by</span>\n" +
    "<div pf-sort config=\"sortConfig\" class=\"sort-controls\"></div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<table class=\"table table-bordered table-condensed table-mobile table-hover table-layout-fixed events-table\" ng-class=\"{ 'table-empty': (filteredEvents | hashSize) === 0 }\">\n" +
    "<thead>\n" +
    "<tr>\n" +
    "<th id=\"time\">Time</th>\n" +
    "\n" +
    "<th id=\"kind-name\" ng-if=\"!resourceKind || !resourceName\">\n" +
    "<span class=\"hidden-xs-inline visible-sm-inline visible-md-inline hidden-lg-inline\">Kind and Name</span>\n" +
    "<span class=\"visible-lg-inline\">Name</span>\n" +
    "</th>\n" +
    "<th id=\"kind\" ng-if=\"!resourceKind || !resourceName\" class=\"hidden-sm hidden-md\">\n" +
    "<span class=\"visible-lg-inline\">Kind</span>\n" +
    "</th>\n" +
    "<th id=\"severity\" class=\"hidden-xs hidden-sm hidden-md\"><span class=\"sr-only\">Severity</span></th>\n" +
    "<th id=\"reason\" class=\"hidden-sm hidden-md\"><span class=\"visible-lg-inline\">Reason</span></th>\n" +
    "<th id=\"message\"><span class=\"hidden-xs-inline visible-sm-inline visible-md-inline hidden-lg-inline\">Reason and </span>Message</th>\n" +
    "</tr>\n" +
    "</thead>\n" +
    "<tbody ng-if=\"(filteredEvents | hashSize) === 0\">\n" +
    "<tr>\n" +
    "<td class=\"hidden-lg\" colspan=\"{{!resourceKind || !resourceName ? 3 : 2}}\">\n" +
    "<span ng-if=\"(events | hashSize) === 0\"><em>No events to show.</em></span>\n" +
    "<span ng-if=\"(events | hashSize) > 0\">\n" +
    "All events hidden by filter.\n" +
    "<a href=\"\" ng-click=\"filter.text = ''\" role=\"button\">Clear Filter</a>\n" +
    "</span>\n" +
    "</td>\n" +
    "<td class=\"hidden-xs hidden-sm hidden-md\" colspan=\"{{!resourceKind || !resourceName ? 6 : 4}}\">\n" +
    "<span ng-if=\"(events | hashSize) === 0\"><em>No events to show.</em></span>\n" +
    "<span ng-if=\"(events | hashSize) > 0\">\n" +
    "All events hidden by filter.\n" +
    "<a href=\"\" ng-click=\"filter.text = ''\" role=\"button\">Clear Filter</a>\n" +
    "</span>\n" +
    "</td>\n" +
    "</tr>\n" +
    "</tbody>\n" +
    "<tbody ng-if=\"(filteredEvents | hashSize) > 0\">\n" +
    "<tr ng-repeat=\"event in filteredEvents\">\n" +
    "<td data-title=\"Time\" class=\"nowrap\">{{event.lastTimestamp | date:'mediumTime'}}</td>\n" +
    "<td ng-if=\"!resourceKind || !resourceName\" data-title=\"Name\">\n" +
    "<div class=\"hidden-xs-block visible-sm-block visible-md-block hidden-lg-block\">\n" +
    "<span ng-bind-html=\"event.involvedObject.kind | humanizeKind : true | highlightKeywords : filterExpressions\"></span>\n" +
    "</div>\n" +
    "<span ng-init=\"resourceURL = (event.involvedObject.name | navigateResourceURL : event.involvedObject.kind : event.metadata.namespace : event.involvedObject.apiVersion)\">\n" +
    "<a ng-href=\"{{resourceURL}}\" ng-if=\"resourceURL\"><span ng-bind-html=\"event.involvedObject.name | highlightKeywords : filterExpressions\"></span></a>\n" +
    "<span ng-if=\"!resourceURL\" ng-bind-html=\"event.involvedObject.name | highlightKeywords : filterExpressions\"></span>\n" +
    "</span>\n" +
    "</td>\n" +
    "<td ng-if=\"!resourceKind || !resourceName\" class=\"hidden-sm hidden-md\" data-title=\"Kind\">\n" +
    "<span ng-bind-html=\"event.involvedObject.kind | humanizeKind : true | highlightKeywords : filterExpressions\"></span>\n" +
    "</td>\n" +
    "<td data-title=\"Severity\" class=\"hidden-xs hidden-sm hidden-md text-center severity-icon-td\">\n" +
    "<span class=\"sr-only\">{{event.type}}</span>\n" +
    "<span class=\"pficon pficon-warning-triangle-o\" ng-show=\"event.type === 'Warning'\" aria-hidden=\"true\" data-toggle=\"tooltip\" data-original-title=\"Warning\"></span></td>\n" +
    "<td class=\"hidden-sm hidden-md\" data-title=\"Reason\">\n" +
    "<span ng-bind-html=\"event.reason | sentenceCase | highlightKeywords : filterExpressions\"></span>&nbsp;<span class=\"visible-xs-inline pficon pficon-warning-triangle-o\" ng-show=\"event.type === 'Warning'\" aria-hidden=\"true\" data-toggle=\"tooltip\" data-original-title=\"Warning\"></span>\n" +
    "</td>\n" +
    "<td data-title=\"Message\">\n" +
    "<div class=\"hidden-xs-block visible-sm-block visible-md-block hidden-lg-block\">\n" +
    "<span ng-bind-html=\"event.reason | sentenceCase | highlightKeywords : filterExpressions\"></span>&nbsp;\n" +
    "<span class=\"pficon pficon-warning-triangle-o\" ng-show=\"event.type === 'Warning'\" aria-hidden=\"true\" data-toggle=\"tooltip\" data-original-title=\"Warning\"></span>\n" +
    "</div>\n" +
    "\n" +
    "<truncate-long-text content=\"event.message\" limit=\"1000\" newline-limit=\"4\" use-word-boundary=\"true\" highlight-keywords=\"filterExpressions\" expandable=\"true\">\n" +
    "</truncate-long-text>\n" +
    "<div ng-if=\"event.count > 1\" class=\"text-muted small\">\n" +
    "{{event.count}} times in the last\n" +
    "<duration-until-now timestamp=\"event.firstTimestamp\" omit-single=\"true\" precision=\"1\"></duration-until-now>\n" +
    "</div>\n" +
    "</td>\n" +
    "</tr>\n" +
    "</tbody>\n" +
    "</table>\n" +
    "</div>"
  );


  $templateCache.put('views/directives/from-file.html',
    "<p>\n" +
    "Create or replace resources from their YAML or JSON definitions. If adding a template, you'll have the option to process the template.\n" +
    "</p>\n" +
    "<parse-error error=\"error\" ng-show=\"error\"></parse-error>\n" +
    "<div class=\"row\">\n" +
    "<div class=\"col-sm-12 pod-bottom-xl\">\n" +
    "<form name=\"form\">\n" +
    "<div class=\"form-group\" id=\"from-file\">\n" +
    "<osc-file-input model=\"editorContent\" drop-zone-id=\"from-file\" help-text=\"Upload file by dragging & dropping, selecting it, or pasting from the clipboard.\" ng-disabled=\"false\"></osc-file-input>\n" +
    "<div ui-ace=\"{\n" +
    "          mode: 'yaml',\n" +
    "          theme: 'eclipse',\n" +
    "          onLoad: aceLoaded,\n" +
    "          onChange: aceChanged,\n" +
    "          rendererOptions: {\n" +
    "            fadeFoldWidgets: true,\n" +
    "            showPrintMargin: false\n" +
    "          }\n" +
    "        }\" ng-model=\"editorContent\" class=\"editor ace-bordered yaml-mode\" id=\"add-component-editor\" required></div>\n" +
    "</div>\n" +
    "<alerts alerts=\"alerts\"></alerts>\n" +
    "<div class=\"buttons gutter-bottom\" ng-class=\"{'gutter-top': !alerts.length}\">\n" +
    "<button type=\"submit\" ng-click=\"create()\" ng-disabled=\"editorErrorAnnotation || !editorContent\" class=\"btn btn-primary btn-lg\">\n" +
    "Create\n" +
    "</button>\n" +
    "<a class=\"btn btn-default btn-lg\" href=\"{{projectName | projectOverviewURL}}\">\n" +
    "Cancel\n" +
    "</a>\n" +
    "</div>\n" +
    "</form>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/directives/header/_navbar-utility-mobile.html',
    "<nav class=\"navbar navbar-sidebar visible-xs-block\">\n" +
    "<ul extension-point extension-name=\"nav-dropdown-mobile\" extension-types=\"dom\" extension-args=\"[user]\" class=\"nav nav-sidenav-primary\"></ul>\n" +
    "</nav>"
  );


  $templateCache.put('views/directives/header/_navbar-utility.html',
    "<ul class=\"nav navbar-nav navbar-right navbar-iconic\">\n" +
    "<li extension-point extension-name=\"nav-system-status\" extension-types=\"dom\"></li>\n" +
    "<li uib-dropdown>\n" +
    "<a uib-dropdown-toggle class=\"nav-item-iconic\" id=\"help-dropdown\" href=\"\">\n" +
    "<span title=\"Help\" class=\"fa pficon-help\" aria-hidden=\"true\"></span>\n" +
    "<span class=\"sr-only\">Help</span>\n" +
    "<span class=\"caret\" aria-hidden=\"true\"></span>\n" +
    "</a>\n" +
    "<ul class=\"uib-dropdown-menu\" aria-labelledby=\"help-dropdown\" extension-point extension-name=\"nav-help-dropdown\" extension-types=\"dom html\"></ul>\n" +
    "</li>\n" +
    "<li uib-dropdown ng-cloak ng-if=\"user\">\n" +
    "<a href=\"\" uib-dropdown-toggle id=\"user-dropdown\" class=\"nav-item-iconic\">\n" +
    "<span class=\"pf-icon pficon-user\" aria-hidden=\"true\"></span>\n" +
    "<span class=\"username truncate\">{{user.fullName || user.metadata.name}}</span> <span class=\"caret\" aria-hidden=\"true\"></span>\n" +
    "</a>\n" +
    "<ul class=\"uib-dropdown-menu\" aria-labelledby=\"user-dropdown\" extension-point extension-name=\"nav-user-dropdown\" extension-types=\"dom html\"></ul>\n" +
    "</li>\n" +
    "</ul>"
  );


  $templateCache.put('views/directives/header/default-header.html',
    "<nav class=\"navbar navbar-pf-alt\" role=\"navigation\">\n" +
    "<div row>\n" +
    "<div class=\"navbar-header\">\n" +
    "\n" +
    "<div row class=\"navbar-flex-btn toggle-menu\">\n" +
    "<button type=\"button\" class=\"navbar-toggle project-action-btn ng-isolate-scope\" data-toggle=\"collapse\" data-target=\".navbar-collapse-2\">\n" +
    "<span class=\"sr-only\">Toggle navigation</span>\n" +
    "<span class=\"icon-bar\"></span>\n" +
    "<span class=\"icon-bar\"></span>\n" +
    "<span class=\"icon-bar\"></span>\n" +
    "</button>\n" +
    "</div>\n" +
    "\n" +
    "<a class=\"navbar-brand\" id=\"openshift-logo\" href=\"./\">\n" +
    "<div id=\"header-logo\"></div>\n" +
    "</a>\n" +
    "</div>\n" +
    "\n" +
    "<navbar-utility class=\"collapse navbar-collapse\"></navbar-utility>\n" +
    "<div row extension-point extension-name=\"nav-system-status-mobile\" extension-types=\"dom\" class=\"navbar-flex-btn hide-if-empty\"></div>\n" +
    "</div>\n" +
    "</nav>"
  );


  $templateCache.put('views/directives/header/project-header.html',
    "<nav class=\"navbar navbar-pf-alt\" role=\"navigation\">\n" +
    "<div row flex class=\"navbar-header hidden-xs\">\n" +
    "<a class=\"navbar-home\" href=\"./\"><span class=\"fa-fw pficon pficon-home\" aria-hidden=\"true\"></span> <span class=\"visible-xlg-inline-block\"> Projects</span></a>\n" +
    "</div>\n" +
    "<div class=\"nav navbar-project-menu\">\n" +
    "<div row>\n" +
    "\n" +
    "<div row class=\"navbar-flex-btn toggle-menu\">\n" +
    "<button type=\"button\" class=\"navbar-toggle project-action-btn ng-isolate-scope\" data-toggle=\"collapse\" data-target=\".navbar-collapse-1\">\n" +
    "<span class=\"sr-only\">Toggle navigation</span>\n" +
    "<span class=\"icon-bar\"></span>\n" +
    "<span class=\"icon-bar\"></span>\n" +
    "<span class=\"icon-bar\"></span>\n" +
    "</button>\n" +
    "</div>\n" +
    "<div flex class=\"form-group\">\n" +
    "\n" +
    "\n" +
    "<select class=\"selectpicker form-control\" data-selected-text-format=\"count>3\" id=\"boostrapSelect\" title=\"\"></select>\n" +
    "</div>\n" +
    "\n" +
    "<div row class=\"navbar-flex-btn project-action\" ng-if=\"project.metadata.name | canIAddToProject\">\n" +
    "<a row class=\"project-action-btn\" href=\"project/{{project.metadata.name}}/create\" ng-disabled=\"project.status.phase != 'Active'\" title=\"Add to project\">\n" +
    "<i class=\"fa fa-plus visible-xs-inline-block\"></i><span class=\"hidden-xs\">Add to project</span>\n" +
    "</a>\n" +
    "</div>\n" +
    "<div row extension-point extension-name=\"nav-system-status-mobile\" extension-types=\"dom\" class=\"navbar-flex-btn hide-if-empty\"></div>\n" +
    "</div>\n" +
    "</div> \n" +
    "<navbar-utility class=\"hidden-xs\"></navbar-utility>\n" +
    "</nav>"
  );


  $templateCache.put('views/directives/hpa.html',
    "<h4>\n" +
    "{{hpa.metadata.name}}\n" +
    "\n" +
    "<span ng-if=\"'horizontalPodAutoscalers' | canIDoAny\" class=\"header-actions\">\n" +
    "<a ng-if=\"{resource: 'horizontalpodautoscalers', group: 'extensions'} | canI : 'update'\" ng-href=\"project/{{hpa.metadata.namespace}}/edit/autoscaler?kind=HorizontalPodAutoscaler&group=extensions&name={{hpa.metadata.name}}\" role=\"button\">Edit</a>\n" +
    "<span class=\"action-divider\">|</span>\n" +
    "<delete-link ng-if=\"{resource: 'horizontalpodautoscalers', group: 'extensions'} | canI : 'delete'\" kind=\"HorizontalPodAutoscaler\" group=\"extensions\" resource-name=\"{{hpa.metadata.name}}\" project-name=\"{{hpa.metadata.namespace}}\" label=\"Remove\" alerts=\"alerts\" stay-on-current-page=\"true\">\n" +
    "</delete-link>\n" +
    "</span>\n" +
    "</h4>\n" +
    "<dl class=\"dl-horizontal left\" style=\"margin-bottom: 10px\">\n" +
    "<dt ng-if-start=\"showScaleTarget && hpa.spec.scaleRef.kind && hpa.spec.scaleRef.name\">{{hpa.spec.scaleRef.kind | humanizeKind : true}}:</dt>\n" +
    "<dd ng-if-end>\n" +
    "<a ng-href=\"{{hpa.spec.scaleRef.name | navigateResourceURL : hpa.spec.scaleRef.kind : hpa.metadata.namespace}}\">{{hpa.spec.scaleRef.name}}</a>\n" +
    "</dd>\n" +
    "<dt>Min Pods:</dt>\n" +
    "<dd>{{hpa.spec.minReplicas || 1}}</dd>\n" +
    "<dt>Max Pods:</dt>\n" +
    "<dd>{{hpa.spec.maxReplicas}}</dd>\n" +
    "<dt ng-if-start=\"hpa.spec.cpuUtilization.targetPercentage\">\n" +
    "CPU\n" +
    "<span ng-if=\"'cpu' | isRequestCalculated : project\">Limit</span>\n" +
    "<span ng-if=\"!('cpu' | isRequestCalculated : project)\">Request</span>\n" +
    "Target:\n" +
    "</dt>\n" +
    "<dd ng-if-end>{{hpa.spec.cpuUtilization.targetPercentage | hpaCPUPercent : project}}%</dd>\n" +
    "<dt>\n" +
    "Current Usage:\n" +
    "</dt>\n" +
    "<dd ng-if=\"hpa.status.currentCPUUtilizationPercentage | isNil\">\n" +
    "<em>Not available</em>\n" +
    "</dd>\n" +
    "<dd ng-if=\"!(hpa.status.currentCPUUtilizationPercentage | isNil)\">\n" +
    "{{hpa.status.currentCPUUtilizationPercentage | hpaCPUPercent : project}}%\n" +
    "</dd>\n" +
    "<dt ng-if-start=\"hpa.status.lastScaleTime\">Last Scaled:</dt>\n" +
    "<dd ng-if-end><span am-time-ago=\"hpa.status.lastScaleTime\"></span></dd>\n" +
    "</dl>"
  );


  $templateCache.put('views/directives/istag-select.html',
    "<ng-form name=\"istagForm\">\n" +
    "<fieldset ng-disabled=\"selectDisabled\">\n" +
    "<div class=\"row\">\n" +
    "<div class=\"form-group col-sm-4\">\n" +
    "<label class=\"sr-only\">Namespace</label>\n" +
    "<ui-select required ng-model=\"istag.namespace\" ng-disabled=\"selectDisabled\" ng-change=\"istag.imageStream = null; istag.tagObject = null;\">\n" +
    "<ui-select-match placeholder=\"Namespace\">{{$select.selected}}</ui-select-match>\n" +
    "<ui-select-choices repeat=\"namespace in (namespaces | filter : $select.search)\">\n" +
    "<div ng-bind-html=\"namespace | highlight : $select.search\"></div>\n" +
    "</ui-select-choices>\n" +
    "</ui-select>\n" +
    "<div class=\"istag-separator\">/</div>\n" +
    "</div>\n" +
    "<div class=\"form-group col-sm-4\">\n" +
    "<label class=\"sr-only\">Image Stream</label>\n" +
    "<ui-select required ng-model=\"istag.imageStream\" ng-disabled=\"!istag.namespace || selectDisabled\" ng-change=\"istag.tagObject = null\">\n" +
    "<ui-select-match placeholder=\"Image Stream\">{{$select.selected}}</ui-select-match>\n" +
    "<ui-select-choices repeat=\"imageStream in (isNamesByNamespace[istag.namespace] | filter : $select.search)\">\n" +
    "<div ng-bind-html=\"imageStream | highlight : $select.search\"></div>\n" +
    "</ui-select-choices>\n" +
    "</ui-select>\n" +
    "<div class=\"istag-separator\">:</div>\n" +
    "</div>\n" +
    "<div class=\"form-group col-sm-4\">\n" +
    "<label class=\"sr-only\">Tag</label>\n" +
    "<ui-select required ng-model=\"istag.tagObject\" ng-disabled=\"!istag.imageStream || selectDisabled\">\n" +
    "<ui-select-match placeholder=\"Tag\">{{$select.selected.tag}}</ui-select-match>\n" +
    "<ui-select-choices group-by=\"groupTags\" repeat=\"statusTag in (isByNamespace[istag.namespace][istag.imageStream].status.tags | filter : { tag: $select.search })\" refresh=\"getTags($select.search)\" refresh-delay=\"200\">\n" +
    "<div ng-bind-html=\"statusTag.tag | highlight : $select.search\"></div>\n" +
    "</ui-select-choices>\n" +
    "</ui-select>\n" +
    "</div>\n" +
    "</div>\n" +
    "</fieldset>\n" +
    "</ng-form>"
  );


  $templateCache.put('views/directives/label-editor.html',
    "<osc-form-section header=\"Labels\" about-title=\"Labels\" about=\"Labels are used to organize, group, or select objects and resources, such as pods.\" expand=\"expand\" can-toggle=\"canToggle\">\n" +
    "<div ng-if=\"systemLabels.length\">\n" +
    "<div class=\"help-block\">\n" +
    "The following labels are being added automatically. If you want to override them, you can do so below.\n" +
    "</div>\n" +
    "<key-value-editor entries=\"systemLabels\" is-readonly cannot-sort cannot-delete cannot-add key-placeholder=\"Name\"></key-value-editor>\n" +
    "</div>\n" +
    "<div ng-if=\"helpText && ((labels | hashSize) !== 0 || $parent.expand)\" class=\"help-block\">\n" +
    "{{helpText}}\n" +
    "</div>\n" +
    "<div ng-show=\"expand\" ng-class=\"{ 'gutter-top': !helpText }\">\n" +
    "<key-value-editor entries=\"labels\" key-placeholder=\"Name\" key-maxlength=\"63\" key-validator-regex=\"validator.key\" value-placeholder=\"Value\" value-maxlength=\"63\" value-validator-regex=\"validator.value\" key-validator-error-tooltip=\"A valid object label has the form [domain/]name where a name is an alphanumeric (a-z, and 0-9) string,\n" +
    "                                   with a maximum length of 63 characters, with the '-' character allowed anywhere except the first or last\n" +
    "                                   character. A domain is a sequence of names separated by the '.' character with a maximum length of 253 characters.\" value-validator-error-tooltip=\"A valid label value is an alphanumeric (a-z, and 0-9) string, with a maximum length of 63 characters, with the '-'\n" +
    "                                     character allowed anywhere except the first or last character.\" add-row-link=\"Add Label\"></key-value-editor>\n" +
    "</div>\n" +
    "<div ng-hide=\"expand\">\n" +
    "<key-value-editor entries=\"labels\" key-placeholder=\"Labels\" cannot-sort cannot-delete cannot-add is-readonly></key-value-editor>\n" +
    "</div>\n" +
    "</osc-form-section>"
  );


  $templateCache.put('views/directives/labels.html',
    "<div row wrap ng-if=\"(labels | hashSize) > 0\">\n" +
    "<span row nowrap=\"nowrap\" ng-repeat=\"(labelKey, labelValue) in labels\" class=\"k8s-label\" ng-if=\"!limit || $index < limit\">\n" +
    "<span row class=\"label-pair\" ng-if=\"clickable\">\n" +
    "<a href=\"\" class=\"label-key label truncate\" ng-click=\"filterAndNavigate(labelKey)\" ng-attr-title=\"All {{titleKind || kind}} with the label '{{labelKey}}' (any value)\">{{labelKey}}</a><a href=\"\" class=\"label-value label truncate\" ng-click=\"filterAndNavigate(labelKey, labelValue)\" ng-attr-title=\"All {{titleKind || kind}} with the label '{{labelKey}}={{labelValue}}'\">{{labelValue}}<span ng-if=\"labelValue === ''\"><em>&lt;empty&gt;</em></span></a>\n" +
    "</span>\n" +
    "<span row class=\"label-pair\" ng-if=\"!clickable\">\n" +
    "<span class=\"label-key label truncate\">{{labelKey}}</span><span class=\"label-value label truncate\">{{labelValue}}</span>\n" +
    "</span>\n" +
    "</span>\n" +
    "<a href=\"\" class=\"small\" ng-click=\"limit = null\" ng-show=\"limit && limit < (labels | hashSize)\" style=\"padding-left: 5px; vertical-align: middle\">More labels...</a>\n" +
    "</div>"
  );


  $templateCache.put('views/directives/lifecycle-hook.html',
    "<h4>\n" +
    "{{type | upperFirst}} Hook\n" +
    "<span ng-switch=\"type\">\n" +
    "<small ng-switch-when=\"pre\">&ndash; runs before the deployment begins</small>\n" +
    "<small ng-switch-when=\"mid\">&ndash; runs after the previous deployment is scaled down to zero and before the first pod of the new deployment is created</small>\n" +
    "<small ng-switch-when=\"post\">&ndash; runs after the deployment strategy completes</small>\n" +
    "</span>\n" +
    "</h4>\n" +
    "<dl class=\"dl-horizontal left\">\n" +
    "<dt>Action:</dt>\n" +
    "<dd>{{strategyParams[type].execNewPod ? \"Run a command\" : \"Tag the image\"}}</dd>\n" +
    "<dt>Failure Policy:</dt>\n" +
    "<dd>{{strategyParams[type].failurePolicy}}\n" +
    "<span class=\"help action-inline\">\n" +
    "<a href ng-switch=\"strategyParams[type].failurePolicy\">\n" +
    "<i ng-switch-when=\"Ignore\" class=\"pficon pficon-help\" data-toggle=\"tooltip\" aria-hidden=\"true\" data-original-title=\"Continue with deployment on failure\"></i>\n" +
    "<i ng-switch-when=\"Abort\" class=\"pficon pficon-help\" data-toggle=\"tooltip\" aria-hidden=\"true\" data-original-title=\"Abort deployment on failure\"></i>\n" +
    "<i ng-switch-when=\"Retry\" class=\"pficon pficon-help\" data-toggle=\"tooltip\" aria-hidden=\"true\" data-original-title=\"Retry the hook until it succeeds\"></i>\n" +
    "</a>\n" +
    "</span>\n" +
    "</dd>\n" +
    "<div ng-if=\"strategyParams[type].execNewPod\">\n" +
    "<h5 class=\"container-name\">Container {{strategyParams[type].execNewPod.containerName}}</h5>\n" +
    "<dl class=\"dl-horizontal left\">\n" +
    "<dt>Command:</dt>\n" +
    "<dd>\n" +
    "<code class=\"command\">\n" +
    "<span ng-repeat=\"arg in strategyParams[type].execNewPod.command\">\n" +
    "<truncate-long-text content=\"arg\" limit=\"80\" newline-limit=\"1\" expandable=\"false\" use-word-boundary=\"false\"></truncate-long-text>\n" +
    "</span>\n" +
    "</code>\n" +
    "</dd>\n" +
    "<dt ng-if-start=\"strategyParams[type].execNewPod.env\">Environment Variables:</dt>\n" +
    "<dd ng-if-end>\n" +
    "<div ng-repeat=\"env in strategyParams[type].execNewPod.env\">\n" +
    "<div class=\"truncate\" ng-attr-title=\"{{env.value}}\">{{env.name}}={{env.value}}</div>\n" +
    "</div>\n" +
    "</dd>\n" +
    "<dt ng-if-start=\"strategyParams[type].execNewPod.volumes\">Volumes:</dt>\n" +
    "<dd ng-if-end>\n" +
    "<div ng-repeat=\"volume in strategyParams[type].execNewPod.volumes\">\n" +
    "{{volume}}\n" +
    "</div>\n" +
    "</dd>\n" +
    "</dl>\n" +
    "</div>\n" +
    "<div ng-if=\"strategyParams[type].tagImages\">\n" +
    "<div ng-repeat=\"tagImage in strategyParams[type].tagImages\">\n" +
    "<h5 class=\"container-name\">Container {{tagImage.containerName}}</h5>\n" +
    "<dl class=\"dl-horizontal left\">\n" +
    "<div>Tag image as <a ng-if=\"!tagImage.to.namespace || tagImage.to.namespace === deploymentConfig.metadata.namespace\" ng-href=\"{{tagImage.to.name | navigateResourceURL : 'ImageStreamTag' : deploymentConfig.metadata.namespace}}\">{{tagImage.to | imageObjectRef : deploymentConfig.metadata.namespace}}</a>\n" +
    "<span ng-if=\"tagImage.to.namespace && tagImage.to.namespace !== deploymentConfig.metadata.namespace\">{{tagImage.to | imageObjectRef : deploymentConfig.metadata.namespace}}</span></div>\n" +
    "</dl>\n" +
    "</div>\n" +
    "</div>\n" +
    "</dl>"
  );


  $templateCache.put('views/directives/logs/_log-raw.html',
    "<pre>\n" +
    "<code>\n" +
    "{{::log}}\n" +
    "</code>\n" +
    "</pre>"
  );


  $templateCache.put('views/directives/logs/_log-viewer.html',
    "<div class=\"log-header\" ng-if=\"!chromeless\">\n" +
    "<div ng-transclude class=\"log-status\"></div>\n" +
    "<div class=\"log-actions\">\n" +
    "<span extension-point extension-name=\"log-links\" extension-types=\"link dom\" extension-args=\"[object, options]\"></span>\n" +
    "<span ng-if=\"kibanaAuthUrl\">\n" +
    "<form action=\"{{kibanaAuthUrl}}\" method=\"POST\">\n" +
    "<input type=\"hidden\" name=\"redirect\" value=\"{{kibanaArchiveUrl}}\">\n" +
    "<input type=\"hidden\" name=\"access_token\" value=\"{{access_token}}\">\n" +
    "<button class=\"btn btn-link\">View Archive</button>\n" +
    "</form>\n" +
    "<span ng-if=\"state && state !== 'empty'\" class=\"action-divider\">|</span>\n" +
    "</span>\n" +
    "<span ng-if=\"canSave && state && state !== 'empty'\">\n" +
    "<a href=\"\" ng-click=\"saveLog()\" role=\"button\">\n" +
    "Save\n" +
    "<i class=\"fa fa-download\"></i></a>\n" +
    "<span ng-if=\"state && state !== 'empty'\" class=\"action-divider\">|</span>\n" +
    "</span>\n" +
    "<a ng-if=\"state && state !== 'empty'\" href=\"\" ng-click=\"goChromeless(options, fullLogUrl)\" role=\"button\">\n" +
    "Expand\n" +
    "<i class=\"fa fa-external-link\"></i></a>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"largeLog\" class=\"alert alert-info log-size-warning\">\n" +
    "<span class=\"pficon pficon-info\" aria-hidden=\"true\"></span>\n" +
    "Only the previous {{options.tailLines || 5000}} log lines and new log messages will be displayed because of the large log size.\n" +
    "</div>\n" +
    "\n" +
    "<div ng-if=\"(!state)\">\n" +
    "<ellipsis-pulser ng-if=\"!chromeless\" color=\"dark\" size=\"sm\" display=\"inline\" msg=\"Loading log\" class=\"log-pending-ellipsis\"></ellipsis-pulser>\n" +
    "<ellipsis-pulser ng-if=\"chromeless\" color=\"light\" size=\"sm\" display=\"inline\" msg=\"Loading log\" class=\"log-pending-ellipsis\"></ellipsis-pulser>\n" +
    "</div>\n" +
    "<div class=\"empty-state-message text-center\" ng-if=\"state=='empty'\" ng-class=\"{'log-fixed-height': fixedHeight}\">\n" +
    "<h2>Logs are not available.</h2>\n" +
    "<p>\n" +
    "{{emptyStateMessage}}\n" +
    "</p>\n" +
    "<div ng-if=\"kibanaAuthUrl\">\n" +
    "<form action=\"{{kibanaAuthUrl}}\" method=\"POST\">\n" +
    "<input type=\"hidden\" name=\"redirect\" value=\"{{kibanaArchiveUrl}}\">\n" +
    "<input type=\"hidden\" name=\"access_token\" value=\"{{access_token}}\">\n" +
    "<button class=\"btn btn-primary btn-lg\">\n" +
    "View Archive\n" +
    "</button>\n" +
    "</form>\n" +
    "</div>\n" +
    "</div>\n" +
    "\n" +
    "<div ng-show=\"state=='logs'\">\n" +
    "<div class=\"log-view\" ng-attr-id=\"{{logViewerID}}\" ng-class=\"{'log-fixed-height': fixedHeight}\">\n" +
    "<div id=\"{{logViewerID}}-affixedFollow\" class=\"log-scroll log-scroll-top\">\n" +
    "<a ng-if=\"loading\" href=\"\" ng-click=\"toggleAutoScroll()\">\n" +
    "<span ng-if=\"!autoScrollActive\">Follow</span>\n" +
    "<span ng-if=\"autoScrollActive\">Stop Following</span>\n" +
    "</a>\n" +
    "<a ng-if=\"!loading\" href=\"\" ng-show=\"showScrollLinks\" ng-click=\"onScrollBottom()\">\n" +
    "Go to End\n" +
    "</a>\n" +
    "</div>\n" +
    "<div class=\"log-view-output\" id=\"{{logViewerID}}-fixed-scrollable\">\n" +
    "<table>\n" +
    "<tbody id=\"{{logViewerID}}-logContent\"></tbody>\n" +
    "</table>\n" +
    "<div ng-if=\"(!loading) && (!limitReached) && (!errorWhileRunning) && state=='logs'\" class=\"log-end-msg\">\n" +
    "End of log\n" +
    "</div>\n" +
    "</div>\n" +
    "\n" +
    "<ellipsis-pulser color=\"light\" size=\"md\" ng-show=\"loading\"></ellipsis-pulser>\n" +
    "<div ng-show=\"showScrollLinks\" class=\"log-scroll log-scroll-bottom\">\n" +
    "<a href=\"\" ng-click=\"onScrollTop()\">Go to Top</a>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "\n" +
    "<div ng-if=\"limitReached\" class=\"text-muted\">\n" +
    "The maximum web console log size has been reached. Use the command-line interface or\n" +
    "<a href=\"\" ng-click=\"restartLogs()\">reload</a> the log to see new messages.\n" +
    "</div>\n" +
    "<div ng-if=\"errorWhileRunning\" class=\"text-muted\">\n" +
    "An error occurred loading the log.\n" +
    "<a href=\"\" ng-click=\"restartLogs()\">Reload</a>\n" +
    "</div>"
  );


  $templateCache.put('views/directives/metrics-compact.html',
    "<div in-view=\"updateInView($inview)\" in-view-options=\"{ debounce: 50 }\">\n" +
    "<div ng-repeat=\"metric in metrics\" ng-if=\"!metric.compactCombineWith\" class=\"metrics-compact\">\n" +
    "<div ng-attr-id=\"{{metric.chartID}}\" class=\"metrics-sparkline\"></div>\n" +
    "<div class=\"metrics-usage\">\n" +
    "<div class=\"usage-value\">\n" +
    "<span class=\"fade-inline\" ng-hide=\"metric.lastValue | isNil\">\n" +
    "{{metric.formatUsage(metric.lastValue)}}\n" +
    "</span>\n" +
    "<span ng-if=\"metric.lastValue | isNil\" class=\"text-muted\" aria-hidden=\"true\">\n" +
    "--\n" +
    "</span>\n" +
    "</div>\n" +
    "<div class=\"usage-label\">\n" +
    "{{metric.usageUnits(metric.lastValue) | capitalize}} {{metric.compactLabel || metric.label}}\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/directives/osc-autoscaling.html',
    "<ng-form name=\"form\">\n" +
    "<div class=\"autoscaling-form\">\n" +
    "<div ng-show=\"showNameInput\" class=\"form-group\">\n" +
    "<label for=\"hpa-name\" class=\"required\">Autoscaler Name</label>\n" +
    "<span ng-class=\"{ 'has-error': form.name.$touched && form.name.$invalid }\">\n" +
    "<input id=\"hpa-name\" class=\"form-control\" type=\"text\" name=\"name\" ng-model=\"autoscaling.name\" ng-required=\"showNameInput\" ng-readonly=\"nameReadOnly\" ng-pattern=\"nameValidation.pattern\" ng-maxlength=\"nameValidation.maxlength\" placeholder=\"my-hpa\" select-on-focus autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\" aria-describedby=\"hpa-name-help\">\n" +
    "</span>\n" +
    "<div>\n" +
    "<span id=\"hpa-name-help\" class=\"help-block\">\n" +
    "A unique name for the horizontal pod autoscaler within the project.\n" +
    "</span>\n" +
    "</div>\n" +
    "<div class=\"has-error\" ng-show=\"form.name.$invalid && form.name.$touched\">\n" +
    "<span ng-if=\"form.name.$error.required\" class=\"help-block\">\n" +
    "Name is required.\n" +
    "</span>\n" +
    "<span ng-show=\"form.name.$error.pattern\" class=\"help-block\">\n" +
    "{{nameValidation.description}}\n" +
    "</span>\n" +
    "<span ng-show=\"form.name.$error.maxlength\" class=\"help-block\">\n" +
    "<span class=\"help-block\">\n" +
    "Can't be longer than {{nameValidation.maxlength}} characters.\n" +
    "</span>\n" +
    "</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"form-group\">\n" +
    "<label>Min Pods</label>\n" +
    "<span ng-class=\"{ 'has-error': form.minReplicas.$dirty && form.minReplicas.$invalid }\">\n" +
    "<input type=\"number\" class=\"form-control\" min=\"1\" name=\"minReplicas\" placeholder=\"1\" ng-model=\"autoscaling.minReplicas\" ng-pattern=\"/^\\d+$/\" aria-describedby=\"min-replicas-help\">\n" +
    "</span>\n" +
    "<div id=\"min-replicas-help\" class=\"help-block\">\n" +
    "The lower limit for the number of pods that can be set by the autoscaler. If not specified, defaults to 1.\n" +
    "</div>\n" +
    "<div class=\"has-error\" ng-show=\"form.minReplicas.$dirty && form.minReplicas.$invalid\">\n" +
    "<span ng-if=\"form.minReplicas.$error.number\" class=\"help-block\">\n" +
    "Min pods must be a number.\n" +
    "</span>\n" +
    "<span ng-if=\"form.minReplicas.$error.pattern\" class=\"help-block\">\n" +
    "Min pods must be a whole number.\n" +
    "</span>\n" +
    "<span ng-if=\"form.minReplicas.$error.min\" class=\"help-block\">\n" +
    "Min pods must be greater than or equal to 1.\n" +
    "</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"form-group\">\n" +
    "<label class=\"required\">Max Pods</label>\n" +
    "<span ng-class=\"{ 'has-error': (form.minReplicas.$dirty || form.maxReplicas.$dirty) && form.maxReplicas.$invalid }\">\n" +
    "<input type=\"number\" class=\"form-control\" name=\"maxReplicas\" placeholder=\"4\" required min=\"{{autoscaling.minReplicas || 1}}\" ng-model=\"autoscaling.maxReplicas\" ng-pattern=\"/^\\d+$/\" aria-describedby=\"max-replicas-help\">\n" +
    "</span>\n" +
    "<div id=\"max-replicas-help\" class=\"help-block\">\n" +
    "The upper limit for the number of pods that can be set by the autoscaler.\n" +
    "</div>\n" +
    "<div class=\"has-error\" ng-show=\"(form.minReplicas.$dirty || form.maxReplicas.$dirty) && form.maxReplicas.$invalid\">\n" +
    "<span ng-if=\"form.maxReplicas.$error.number\" class=\"help-block\">\n" +
    "Max pods must be a number.\n" +
    "</span>\n" +
    "<span ng-if=\"form.minReplicas.$error.pattern\" class=\"help-block\">\n" +
    "Min pods must be a whole number.\n" +
    "</span>\n" +
    "<span class=\"help-block\" ng-if=\"form.maxReplicas.$error.min\">\n" +
    "Max pods must be greater than or equal to\n" +
    "<span ng-if=\"autoscaling.minReplicas\">min pods, which is</span>\n" +
    "{{autoscaling.minReplicas || 1}.\n" +
    "</span>\n" +
    "<span class=\"help-block\" ng-if=\"form.maxReplicas.$error.required\">\n" +
    "Max pods is a required field.\n" +
    "</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"form-group\">\n" +
    "<label>\n" +
    "CPU\n" +
    "<span ng-if=\"isRequestCalculated\">Limit</span>\n" +
    "<span ng-if=\"!isRequestCalculated\">Request</span>\n" +
    "Target\n" +
    "</label>\n" +
    "<div class=\"input-group\" ng-class=\"{ 'has-error': form.targetCPU.$invalid && form.targetCPU.$touched }\">\n" +
    "<input type=\"number\" class=\"form-control\" min=\"1\" name=\"targetCPU\" ng-attr-placeholder=\"{{defaultTargetCPUDisplayValue}}\" ng-model=\"targetCPUInput.percent\" ng-pattern=\"/^\\d+$/\" aria-describedby=\"target-cpu-help\">\n" +
    "<span class=\"input-group-addon\">%</span>\n" +
    "</div>\n" +
    "<div id=\"target-cpu-help\" class=\"help-block\">\n" +
    "The percentage of the CPU\n" +
    "<span ng-if=\"isRequestCalculated\">limit</span>\n" +
    "<span ng-if=\"!isRequestCalculated\">request</span>\n" +
    "that each pod should ideally be using. Pods will be added or removed periodically when CPU usage exceeds or drops below this target value. Defaults to {{defaultTargetCPUDisplayValue}}%.\n" +
    "</div>\n" +
    "<div class=\"learn-more-block\">\n" +
    "<a href=\"{{'compute_resources' | helpLink}}\" target=\"_blank\">Learn More&nbsp;<i class=\"fa fa-external-link\" aria-hidden=\"true\"></i></a>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"has-error\" style=\"margin-top: 10px\" ng-show=\"form.targetCPU.$touched && form.targetCPU.$invalid\">\n" +
    "<span ng-if=\"form.targetCPU.$error.number\" class=\"help-block\">\n" +
    "Target CPU percentage must be a number.\n" +
    "</span>\n" +
    "<span ng-if=\"form.targetCPU.$error.pattern\" class=\"help-block\">\n" +
    "Target CPU percentage must be a whole number.\n" +
    "</span>\n" +
    "<span ng-if=\"form.targetCPU.$error.min\" class=\"help-block\">\n" +
    "Target CPU percentage must be greater than 1.\n" +
    "</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</ng-form>"
  );


  $templateCache.put('views/directives/osc-file-input.html',
    "<div class=\"osc-file-input\">\n" +
    "<div ng-attr-id=\"{{dropMessageID}}\" class=\"drag-and-drop-zone\">\n" +
    "<p>Drop file here</p>\n" +
    "</div>\n" +
    "<div class=\"input-group\">\n" +
    "<input type=\"text\" class=\"form-control\" ng-model=\"fileName\" readonly=\"readonly\" ng-show=\"supportsFileUpload\" ng-disabled=\"disabled\" ng-attr-aria-describedby=\"{{helpText ? helpID : undefined}}\">\n" +
    "<span class=\"input-group-btn\">\n" +
    "<span class=\"btn btn-default btn-file\" ng-show=\"supportsFileUpload\" ng-attr-disabled=\"{{ disabled || undefined }}\">\n" +
    "Browse&hellip;\n" +
    "<input type=\"file\" ng-disabled=\"disabled\" class=\"form-control\">\n" +
    "</span>\n" +
    "</span>\n" +
    "</div>\n" +
    "<div ng-if=\"helpText\">\n" +
    "<span ng-attr-id=\"{{helpID}}\" class=\"help-block\">{{::helpText}}</span>\n" +
    "</div>\n" +
    "<div class=\"has-error\" ng-show=\"uploadError\">\n" +
    "<span class=\"help-block\">There was an error reading the file. Please copy the file content into the text area.</span>\n" +
    "</div>\n" +
    "<textarea class=\"form-control\" rows=\"5\" ng-show=\"showTextArea || !supportsFileUpload\" ng-model=\"model\" ng-required=\"required\" ng-disabled=\"disabled\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\" ng-attr-aria-describedby=\"{{helpText ? helpID : undefined}}\">\n" +
    "  </textarea>\n" +
    "<a href=\"\" ng-show=\"(model || fileName) && !disabled\" ng-click=\"cleanInputValues()\">Clear Value</a>\n" +
    "</div>"
  );


  $templateCache.put('views/directives/osc-form-section.html',
    "<div class=\"flow h2-help-block\">\n" +
    "<div class=\"flow-block\">\n" +
    "<h2>{{header}}</h2>\n" +
    "</div>\n" +
    "<div class=\"flow-block right\">\n" +
    "<ul class=\"list-inline\">\n" +
    "<li ng-if=\"canToggle\">\n" +
    "<a class=\"action action-inline\" href ng-click=\"toggle()\" ng-hide=\"expand\"><i class=\"pficon pficon-edit\"></i>{{editText}} {{aboutTitle}}</a>\n" +
    "<a class=\"action action-inline\" href ng-click=\"toggle()\" ng-show=\"expand\"><i class=\"pficon pficon-remove\"></i>Collapse</a>\n" +
    "</li>\n" +
    "<li>\n" +
    "<span class=\"help action-inline\">\n" +
    "<i class=\"pficon pficon-help\"></i>\n" +
    "<a href data-toggle=\"tooltip\" data-original-title=\"{{about}}\">About {{aboutTitle}}</a>\n" +
    "</span>\n" +
    "</li>\n" +
    "</ul>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-transclude></div>"
  );


  $templateCache.put('views/directives/osc-image-summary.html',
    "<h1>{{ name || (resource | displayName) }}</h1>\n" +
    "<div class=\"resource-description\" ng-bind-html=\"resource | description | linkify : '_blank'\"></div>\n" +
    "<div class=\"resource-metadata\">\n" +
    "<div ng-show=\"resource | annotation:'provider'\">Provider: {{ resource | annotation:'provider' }}</div>\n" +
    "<div ng-show=\"resource.metadata.namespace && resource.metadata.namespace !=='openshift'\">Namespace: {{ resource.metadata.namespace }}</div>\n" +
    "<div ng-show=\"resource | annotation:'version'\">Version: {{ resource | annotation:'version' }}</div>\n" +
    "</div>"
  );


  $templateCache.put('views/directives/osc-key-values.html',
    "<ng-form hidden name=\"clean\">\n" +
    "<input name=\"isClean\" ng-model=\"keyValuesClean\">\n" +
    "</ng-form>\n" +
    "<div class=\"labels\">\n" +
    "<div class=\"form-inline labels-edit\" ng-show=\"editable\">\n" +
    "<ng-form class=\"edit-label\" name=\"form\" novalidate>\n" +
    "<div row cross-axis=\"start\">\n" +
    "<div flex grow=\"5\" shrink=\"5\" class=\"form-group\" ng-class=\"{'has-error': form.key.$error.oscKeyValid}\" style=\"margin-right: 10px\">\n" +
    "<input class=\"form-control\" type=\"text\" name=\"key\" ng-attr-placeholder=\"{{keyTitle}}\" ng-model=\"key\" ng-model-options=\"{ debounce: 200 }\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\" osc-input-validator=\"key\" osc-unique=\"entries\" on-enter=\"form.$valid && addEntry()\" ng-keyup=\"isClean()\">\n" +
    "</div>\n" +
    "<div flex grow=\"5\" shrink=\"5\" class=\"form-group\" ng-class=\"{'has-error': form.value.$error.oscValueValid}\" style=\"margin-right: 10px\">\n" +
    "<input class=\"form-control\" type=\"text\" name=\"value\" ng-attr-placeholder=\"{{valueTitle}}\" ng-model=\"value\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\" osc-input-validator=\"value\" on-enter=\"form.$valid && addEntry()\" ng-keyup=\"isClean()\">\n" +
    "</div>\n" +
    "\n" +
    "<a class=\"btn btn-default add-key-value\" href=\"\" role=\"button\" ng-click=\"addEntry()\" ng-disabled=\"form.$invalid || !key || !value\">\n" +
    "Add\n" +
    "</a>\n" +
    "</div>\n" +
    "<div ng-if=\"showCommmitWarning\" class=\"has-error\">\n" +
    "<span class=\"help-block\">\n" +
    "Please add or <a href=\"\" ng-click=\"clear()\">clear</a> this {{(keyTitle || 'key') | lowercase}}-{{(valueTitle || 'value') | lowercase}} pair\n" +
    "</span>\n" +
    "</div>\n" +
    "<div row class=\"has-error\" ng-show=\"form.key.$error.oscUnique\">\n" +
    "<span class=\"help-block\">\n" +
    "Duplicate {{(keyTitle || 'key') | lowercase}}: {{key}}\n" +
    "</span>\n" +
    "</div>\n" +
    "<div row class=\"has-error\" ng-show=\"form.key.$error.oscKeyValid\">\n" +
    "<span class=\"help-block\">Please enter a valid {{setErrorText(keyValidator)}}\n" +
    "<span class=\"help action-inline\" ng-if=\"keyValidationTooltip\">\n" +
    "<a href=\"\" data-toggle=\"tooltip\" data-original-title=\"{{keyValidationTooltip}}\">\n" +
    "<i class=\"pficon pficon-help\"></i>\n" +
    "</a>\n" +
    "</span>\n" +
    "</span>\n" +
    "</div>\n" +
    "<div row class=\"has-error\" ng-show=\"form.value.$error.oscValueValid\">\n" +
    "<span class=\"help-block\">Please enter a valid value\n" +
    "<span class=\"help action-inline\" ng-if=\"keyValidationTooltip\">\n" +
    "<a href=\"\" data-toggle=\"tooltip\" data-original-title=\"{{valueValidationTooltip}}\">\n" +
    "<i class=\"pficon pficon-help\"></i>\n" +
    "</a>\n" +
    "</span>\n" +
    "</span>\n" +
    "</div>\n" +
    "</ng-form>\n" +
    "<div class=\"gutter-top\">\n" +
    "\n" +
    "<div ng-repeat=\"(key,value) in entries | valuesIn:readonlyKeys\">\n" +
    "<div row cross-axis=\"start\">\n" +
    "<div flex grow=\"5\" shrink=\"5\" class=\"truncate\">{{key}}</div>\n" +
    "<div flex grow=\"5\" shrink=\"5\" style=\"margin-left: 10px\" class=\"truncate\">{{value}}</div>\n" +
    "<div main-axis=\"end\" cross-axis=\"baseline\" style=\"flex-basis: 50px; max-width: 50px\">\n" +
    "&nbsp;\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "\n" +
    "<div ng-repeat=\"(key,value) in entries | valuesNotIn:readonlyKeys\">\n" +
    "<div row cross-axis=\"start\" ng-controller=\"KeyValuesEntryController\">\n" +
    "\n" +
    "<div flex grow=\"5\" shrink=\"5\" class=\"truncate\" ng-attr-title=\"{{key}}\">{{key}}</div>\n" +
    "<div flex grow=\"5\" shrink=\"5\" class=\"truncate\" ng-hide=\"editing\" ng-attr-title=\"{{value}}\" style=\"margin-left: 10px\">\n" +
    "{{value}}\n" +
    "</div>\n" +
    "<div row main-axis=\"end\" cross-axis=\"baseline\" ng-hide=\"editing\" style=\"flex-basis: 50px\">\n" +
    "<a href=\"\" ng-click=\"edit()\" class=\"btn btn-default btn-xs\" title=\"Edit\">\n" +
    "<i class=\"pficon pficon-edit\"></i>\n" +
    "</a>\n" +
    "<a href=\"\" ng-click=\"deleteEntry(key)\" class=\"btn btn-default btn-xs\" title=\"Delete\" ng-if=\"allowDelete(key)\">\n" +
    "<i class=\"fa fa-times\"></i>\n" +
    "</a>\n" +
    "</div>\n" +
    "\n" +
    "<div row cross-axis=\"start\" flex grow=\"5\" shrink=\"5\" ng-show=\"editing\">\n" +
    "<input class=\"form-control\" type=\"text\" ng-value=\"value\" ng-model=\"value\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\" style=\"margin-left: 6px\">\n" +
    "</div>\n" +
    "<div row main-axis=\"end\" cross-axis=\"baseline\" ng-show=\"editing\" style=\"flex-basis: 50px\">\n" +
    "<div>\n" +
    "<a href=\"\" ng-click=\"update(key, value, $parent.entries)\" class=\"btn btn-default btn-xs\" title=\"Submit\">\n" +
    "<i class=\"icon icon-ok\"></i>\n" +
    "</a>\n" +
    "</div>\n" +
    "<a href=\"\" ng-click=\"cancel()\" class=\"btn btn-default btn-xs\" title=\"Cancel\">\n" +
    "<i class=\"icon icon-remove\"></i>\n" +
    "</a>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-hide=\"editable\">\n" +
    "<div ng-if=\"(entries | hashSize) === 0\"><strong>None</strong></div>\n" +
    "<ul ng-if=\"(entries | hashSize) !== 0\" class=\"labels-readonly label-list list-unstyled\">\n" +
    "<li ng-repeat=\"(key,value) in entries\">\n" +
    "<span class=\"key truncate\" ng-attr-title=\"{{key}}\">{{key}}</span>\n" +
    "<span class=\"value truncate\" ng-attr-title=\"{{value}}\">{{ value }}</span>\n" +
    "</li>\n" +
    "</ul>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/directives/osc-object-describer.html',
    "<div>\n" +
    "<div ng-if=\"!resource\">\n" +
    "<p>Select an object to see more details.</p>\n" +
    "<span class=\"sidebar-help\">\n" +
    "<p>A <strong>pod</strong> contains one or more Docker containers that run together on a node, containing your application code.</p>\n" +
    "<p>A <strong>service</strong> groups pods and provides a common DNS name and an optional, load-balanced IP address to access them.</p>\n" +
    "<p>A <strong>deployment</strong> is an update to your application, triggered by a changed image or configuration.</p>\n" +
    "</span>\n" +
    "</div>\n" +
    "<kubernetes-object-describer kind=\"{{kind}}\" resource=\"resource\" ng-if=\"resource\"></kubernetes-object-describer>\n" +
    "</div>"
  );


  $templateCache.put('views/directives/osc-persistent-volume-claim.html',
    "<ng-form name=\"persistentVolumeClaimForm\">\n" +
    "<fieldset ng-disabled=\"claimDisabled\">\n" +
    "<div ng-if=\"storageClasses.length\" class=\"form-group\">\n" +
    "\n" +
    "<label>Storage Class</label>\n" +
    "<div>\n" +
    "<ui-select ng-model=\"claim.storageClass\" theme=\"bootstrap\" search-enabled=\"true\" title=\"Select a storage class\" class=\"select-role\">\n" +
    "<ui-select-match placeholder=\"Select a storage class\">\n" +
    "<span>\n" +
    "{{$select.selected.metadata.name}}\n" +
    "</span>\n" +
    "</ui-select-match>\n" +
    "<ui-select-choices repeat=\"sclass as sclass in storageClasses | toArray | filter : { metadata: { name: $select.search } } \">\n" +
    "<div>\n" +
    "<span ng-bind-html=\"sclass.metadata.name  | highlight : $select.search\"></span>\n" +
    "<span ng-if=\"sclass.parameters.type || sclass.parameters.zone || (sclass | description)\" class=\"text-muted\">\n" +
    "<small>&ndash;\n" +
    "<span ng-if=\"sclass.parameters.type\">\n" +
    "Type: {{sclass.parameters.type}}\n" +
    "</span>\n" +
    "<span ng-if=\"sclass.parameters.zone\">\n" +
    "<span ng-if=\"sclass.parameters.type\">|</span>\n" +
    "Zone: {{sclass.parameters.zone}}\n" +
    "</span>\n" +
    "<span ng-if=\"sclass | description\">\n" +
    "<span ng-if=\"sclass.parameters.type || sclass.parameters.zone\">|</span>\n" +
    "{{sclass | description}}\n" +
    "</span>\n" +
    "</small>\n" +
    "</span>\n" +
    "</div>\n" +
    "</ui-select-choices>\n" +
    "</ui-select>\n" +
    "</div>\n" +
    "<div id=\"claim-storage-class-help\" class=\"help-block\">\n" +
    "Storage classes are set by the administrator to define types of storage the users can select.\n" +
    "<span ng-if=\"defaultStorageClass\"> If another storage class is not chosen, the default storage class <var>{{defaultStorageClass.metadata.name}}</var> will be used.</span>\n" +
    "<div class=\"learn-more-block\">\n" +
    "<a ng-href=\"{{'storage_classes' | helpLink}}\" target=\"_blank\">Learn More&nbsp;<i class=\"fa fa-external-link\" aria-hidden=\"true\"> </i></a>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"form-group\">\n" +
    "<label for=\"claim-name\" class=\"required\">Name</label>\n" +
    "<span ng-class=\"{ 'has-error': persistentVolumeClaimForm.name.$invalid && persistentVolumeClaimForm.name.$touched && !claimDisabled }\">\n" +
    "<input id=\"claim-name\" class=\"form-control\" type=\"text\" name=\"name\" ng-model=\"claim.name\" ng-required=\"true\" ng-pattern=\"nameValidation.pattern\" ng-maxlength=\"nameValidation.maxlength\" placeholder=\"my-storage-claim\" select-on-focus autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\" aria-describedby=\"claim-name-help\">\n" +
    "</span>\n" +
    "<div>\n" +
    "<span id=\"claim-name-help\" class=\"help-block\">A unique name for the storage claim within the project.</span>\n" +
    "</div>\n" +
    "<div class=\"has-error\" ng-show=\"persistentVolumeClaimForm.name.$error.required && persistentVolumeClaimForm.name.$touched && !claimDisabled\">\n" +
    "<span class=\"help-block\">\n" +
    "Name is required.\n" +
    "</span>\n" +
    "</div>\n" +
    "<div class=\"has-error\" ng-show=\"persistentVolumeClaimForm.name.$error.pattern && persistentVolumeClaimForm.name.$touched && !claimDisabled\">\n" +
    "<span class=\"help-block\">\n" +
    "{{nameValidation.description}}\n" +
    "</span>\n" +
    "</div>\n" +
    "<div class=\"has-error\" ng-show=\"persistentVolumeClaimForm.name.$error.maxlength && persistentVolumeClaimForm.name.$touched && !claimDisabled\">\n" +
    "<span class=\"help-block\">\n" +
    "Can't be longer than {{nameValidation.maxlength}} characters.\n" +
    "</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"form-group\">\n" +
    "<label class=\"required\">Access Mode</label>\n" +
    "<div class=\"radio\">\n" +
    "<label class=\"radio-inline\">\n" +
    "<input type=\"radio\" name=\"accessModes\" ng-model=\"claim.accessModes\" value=\"ReadWriteOnce\" aria-describedby=\"access-modes-help\" ng-checked=\"true\">\n" +
    "Single User (RWO)\n" +
    "</label>\n" +
    "<label class=\"radio-inline\">\n" +
    "<input type=\"radio\" id=\"accessModes\" name=\"accessModes\" ng-model=\"claim.accessModes\" value=\"ReadWriteMany\" aria-describedby=\"access-modes-help\">\n" +
    "Shared Access (RWX)\n" +
    "</label>\n" +
    "<label class=\"radio-inline\">\n" +
    "<input type=\"radio\" name=\"accessModes\" ng-model=\"claim.accessModes\" value=\"ReadOnlyMany\" aria-describedby=\"access-modes-help\">\n" +
    "Read Only (ROX)\n" +
    "</label>\n" +
    "</div>\n" +
    "<div>\n" +
    "<span id=\"access-modes-help\" class=\"help-block\">Permissions to the mounted volume.</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "\n" +
    "<div ng-if=\"capacityReadOnly\" class=\"form-group mar-bottom-xl\">\n" +
    "<label>Size</label>\n" +
    "<div class=\"static-form-value-large\">\n" +
    "{{claim.amount}} {{claim.unit | humanizeUnit : 'storage'}}\n" +
    "<small>(cannot be changed)</small>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"!capacityReadOnly\" class=\"form-group\">\n" +
    "<fieldset class=\"form-inline compute-resource\">\n" +
    "<label class=\"required\">\n" +
    "Size\n" +
    "<small ng-if=\"limits.min && limits.max\">\n" +
    "{{limits.min | usageWithUnits : 'storage'}} min to {{limits.max | usageWithUnits : 'storage'}} max\n" +
    "</small>\n" +
    "<small ng-if=\"limits.min && !limits.max\">\n" +
    "Min: {{limits.min | usageWithUnits : 'storage'}}\n" +
    "</small>\n" +
    "<small ng-if=\"limits.max && !limits.min\">\n" +
    "Max: {{limits.max | usageWithUnits : 'storage'}}\n" +
    "</small>\n" +
    "</label>\n" +
    "<div class=\"resource-size\" ng-class=\"{ 'has-error': persistentVolumeClaimForm.capacity.$invalid && persistentVolumeClaimForm.capacity.$touched && !claimDisabled }\">\n" +
    "<div class=\"resource-amount\">\n" +
    "<label for=\"claim-amount\" class=\"sr-only\">Amount</label>\n" +
    "<input type=\"number\" name=\"capacity\" id=\"claim-amount\" ng-model=\"claim.amount\" required min=\"0\" class=\"form-control\" aria-describedby=\"claim-capacity-help\">\n" +
    "</div>\n" +
    "<div class=\"resource-unit\">\n" +
    "<label class=\"sr-only\">Unit</label>\n" +
    "<ui-select search-enabled=\"false\" ng-model=\"claim.unit\" input-id=\"claim-capacity-unit\">\n" +
    "<ui-select-match>{{$select.selected.label}}</ui-select-match>\n" +
    "<ui-select-choices repeat=\"option.value as option in units\" group-by=\"groupUnits\">\n" +
    "{{option.label}}\n" +
    "</ui-select-choices>\n" +
    "</ui-select>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div id=\"claim-capacity-help\" class=\"help-block\">\n" +
    "Desired storage capacity.\n" +
    "</div>\n" +
    "<div ng-if=\"persistentVolumeClaimForm.capacity.$touched && !claimDisabled\">\n" +
    "<div class=\"has-error\" ng-show=\"persistentVolumeClaimForm.capacity.$error.required\">\n" +
    "<span class=\"help-block\">\n" +
    "Size is required.\n" +
    "</span>\n" +
    "</div>\n" +
    "<div class=\"has-error\" ng-show=\"persistentVolumeClaimForm.capacity.$error.number\">\n" +
    "<span class=\"help-block\">\n" +
    "Must be a number.\n" +
    "</span>\n" +
    "</div>\n" +
    "<div class=\"has-error\" ng-show=\"persistentVolumeClaimForm.capacity.$error.min\">\n" +
    "<span class=\"help-block\">\n" +
    "Must be a positive number.\n" +
    "</span>\n" +
    "</div>\n" +
    "<div ng-if=\"persistentVolumeClaimForm.capacity.$error.limitRangeMin\" class=\"has-error\">\n" +
    "<span class=\"help-block\">\n" +
    "Can't be less than {{limits.min | usageWithUnits : 'storage'}}.\n" +
    "</span>\n" +
    "</div>\n" +
    "<div ng-if=\"persistentVolumeClaimForm.capacity.$error.limitRangeMax\" class=\"has-error\">\n" +
    "<span class=\"help-block\">\n" +
    "Can't be greater than {{limits.max | usageWithUnits : 'storage'}}.\n" +
    "</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"learn-more-block mar-top-sm\">\n" +
    "<a href=\"\" ng-click=\"showComputeUnitsHelp()\">What are GiB?</a>\n" +
    "</div>\n" +
    "</fieldset>\n" +
    "</div>\n" +
    "\n" +
    "<div ng-show=\"!showAdvancedOptions\" class=\"mar-bottom-xl\">\n" +
    "Use\n" +
    "<a href=\"\" ng-click=\"showAdvancedOptions = true\">label selectors</a>\n" +
    "to request storage.\n" +
    "</div>\n" +
    "<div ng-show=\"showAdvancedOptions\" class=\"form-group\">\n" +
    "<fieldset class=\"compute-resource\">\n" +
    "<label>Label Selector</label>\n" +
    "<div class=\"help-block mar-bottom-lg\">\n" +
    "Enter a label and value to use for your storage.\n" +
    "<div class=\"learn-more-block\">\n" +
    "<a ng-href=\"{{'selector_label' | helpLink}}\" target=\"_blank\">Learn More&nbsp;<i class=\"fa fa-external-link\" aria-hidden=\"true\"></i></a>\n" +
    "</div>\n" +
    "</div>\n" +
    "<key-value-editor entries=\"claim.selectedLabels\" key-placeholder=\"label\" value-placeholder=\"value\" key-validator=\"[a-zA-Z][a-zA-Z0-9_-]*\" key-validator-error-tooltip=\"A valid label name is an alphanumeric (a-z and 0-9) string beginning with a letter that may contain underscores and dashes.\" add-row-link=\"Add Label\"></key-value-editor>\n" +
    "</fieldset>\n" +
    "</div>\n" +
    "</fieldset>\n" +
    "</ng-form>"
  );


  $templateCache.put('views/directives/osc-routing-service.html',
    "<ng-form name=\"routingServiceForm\">\n" +
    "<div class=\"row\">\n" +
    "<div class=\"form-group\" ng-class=\"{ 'col-sm-6': showWeight, 'col-sm-12': !showWeight }\">\n" +
    "<label for=\"{{id}}-service-select\" class=\"required\">\n" +
    "Service\n" +
    "</label>\n" +
    "<ui-select ng-model=\"model.service\" input-id=\"{{id}}-service-select\" aria-describedby=\"{{id}}-service-help\" required>\n" +
    "<ui-select-match>{{$select.selected.metadata.name}}</ui-select-match>\n" +
    "<ui-select-choices repeat=\"service in (services | filter : {metadata: { name: $select.search }}) track by (service | uid)\">\n" +
    "<div ng-bind-html=\"service.metadata.name | highlight : $select.search\"></div>\n" +
    "</ui-select-choices>\n" +
    "</ui-select>\n" +
    "<div>\n" +
    "<span ng-attr-id=\"{{id}}-service-help\" class=\"help-block\">\n" +
    "<span ng-if=\"!isAlternate\">Service to route to.</span>\n" +
    "<span ng-if=\"isAlternate\">Alternate service for route traffic.</span>\n" +
    "</span>\n" +
    "</div>\n" +
    "<div ng-if=\"(services | hashSize) === 0\" class=\"has-error\">\n" +
    "<span class=\"help-block\">\n" +
    "There are no <span ng-if=\"is-alternate\">additional</span> services in your project to expose with a route.\n" +
    "</span>\n" +
    "</div>\n" +
    "<div ng-if=\"unnamedServicePort\" class=\"has-warning\">\n" +
    "<span class=\"help-block\">\n" +
    "Service {{route.service.metadata.name}} has a single, unnamed port. A route cannot specifically target an unnamed service port. If more service ports are added later, the route will also direct traffic to them.\n" +
    "</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"showWeight\" class=\"form-group col-sm-6\">\n" +
    "<label for=\"{{id}}-service-weight\" class=\"required\">Weight</label>\n" +
    "<input ng-model=\"model.weight\" name=\"weight\" id=\"{{id}}-service-weight\" type=\"number\" required min=\"0\" max=\"256\" ng-pattern=\"/^\\d+$/\" class=\"form-control\" aria-describedby=\"{{id}}-weight-help\">\n" +
    "<div>\n" +
    "<span id=\"{{id}}-weight-help\" class=\"help-block\">\n" +
    "Weight is a number between 0 and 256 that specifies the relative weight against other route services.\n" +
    "</span>\n" +
    "<div ng-if=\"routingServiceForm.weight.$dirty && routingServiceForm.weight.$invalid\" class=\"has-error\">\n" +
    "<div ng-if=\"routingServiceForm.weight.$error.number\" class=\"help-block\">\n" +
    "Must be a number.\n" +
    "</div>\n" +
    "\n" +
    "<div ng-if=\"routingServiceForm.weight.$error.pattern\" class=\"help-block\">\n" +
    "Must be a whole number greater than or equal to 0.\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</ng-form>"
  );


  $templateCache.put('views/directives/osc-routing.html',
    "<ng-form name=\"routeForm\">\n" +
    "<fieldset ng-disabled=\"routingDisabled\">\n" +
    "\n" +
    "<div ng-show=\"showNameInput\" class=\"form-group\">\n" +
    "<label for=\"route-name\" class=\"required\">Name</label>\n" +
    "<span ng-class=\"{ 'has-error': routeForm.name.$invalid && routeForm.name.$touched && !routingDisabled }\">\n" +
    "<input id=\"route-name\" class=\"form-control\" type=\"text\" name=\"name\" ng-model=\"route.name\" ng-required=\"showNameInput\" ng-pattern=\"nameValidation.pattern\" ng-maxlength=\"nameValidation.maxlength\" placeholder=\"my-route\" select-on-focus autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\" aria-describedby=\"route-name-help\">\n" +
    "</span>\n" +
    "<div>\n" +
    "<span id=\"route-name-help\" class=\"help-block\">A unique name for the route within the project.</span>\n" +
    "</div>\n" +
    "<div class=\"has-error\" ng-show=\"routeForm.name.$error.pattern && routeForm.name.$touched && !routingDisabled\">\n" +
    "<span class=\"help-block\">\n" +
    "{{nameValidation.description}}\n" +
    "</span>\n" +
    "</div>\n" +
    "<div class=\"has-error\" ng-show=\"routeForm.name.$error.maxlength && routeForm.name.$touched && !routingDisabled\">\n" +
    "<span class=\"help-block\">\n" +
    "Can't be longer than {{nameValidation.maxlength}} characters.\n" +
    "</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"form-group\">\n" +
    "<label for=\"host\">Hostname</label>\n" +
    "<span ng-class=\"{ 'has-error': routeForm.host.$invalid && routeForm.host.$touched && !routingDisabled }\">\n" +
    "<input id=\"host\" class=\"form-control\" type=\"text\" name=\"host\" ng-model=\"route.host\" ng-pattern=\"hostnamePattern\" ng-maxlength=\"hostnameMaxLength\" ng-readonly=\"hostReadOnly\" placeholder=\"www.example.com\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\" aria-describedby=\"route-host-help\">\n" +
    "</span>\n" +
    "<div>\n" +
    "<span id=\"route-host-help\" class=\"help-block\">\n" +
    "<p>\n" +
    "Public hostname for the route.\n" +
    "<span ng-if=\"!hostReadOnly\">\n" +
    "If not specified, a hostname is generated.\n" +
    "</span>\n" +
    "<span ng-if=\"!disableWildcards\">\n" +
    "You can use <var>*.example.com</var> with routers that support wildcard subdomains.\n" +
    "</span>\n" +
    "</p>\n" +
    "<p>The hostname can't be changed after the route is created.</p>\n" +
    "</span>\n" +
    "</div>\n" +
    "<div class=\"has-error\" ng-show=\"routeForm.host.$error.pattern && routeForm.host.$touched && !routingDisabled\">\n" +
    "<span class=\"help-block\">\n" +
    "Hostname must consist of lower-case letters, numbers, periods, and hyphens. It must start and end with a letter or number.\n" +
    "<span ng-if=\"!disableWildcards\">Wildcard subdomains may start with <var>*.</var></span>\n" +
    "</span>\n" +
    "</div>\n" +
    "<div class=\"has-error\" ng-show=\"routeForm.host.$error.maxlength && routeForm.host.$touched && !routingDisabled\">\n" +
    "<span class=\"help-block\">\n" +
    "Can't be longer than {{hostnameMaxLength}} characters.\n" +
    "</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"form-group\">\n" +
    "<label for=\"path\">Path</label>\n" +
    "<span ng-class=\"{ 'has-error': routeForm.path.$invalid && routeForm.path.$touched && !routingDisabled }\">\n" +
    "<input id=\"path\" class=\"form-control\" type=\"text\" name=\"path\" ng-model=\"route.path\" ng-pattern=\"/^\\/.*$/\" ng-disabled=\"route.tls.termination === 'passthrough'\" placeholder=\"/\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\" aria-describedby=\"route-path-help\">\n" +
    "</span>\n" +
    "<div>\n" +
    "<span id=\"route-path-help\" class=\"help-block\">\n" +
    "Path that the router watches to route traffic to the service.\n" +
    "</span>\n" +
    "</div>\n" +
    "<div class=\"has-error\" ng-show=\"routeForm.path.$error.pattern && routeForm.path.$touched && !routingDisabled\">\n" +
    "<span class=\"help-block\">\n" +
    "Path must start with <code>/</code>\n" +
    "</span>\n" +
    "</div>\n" +
    "<div class=\"has-warning\" ng-show=\"route.path && route.tls.termination === 'passthrough'\">\n" +
    "<span class=\"help-block\">\n" +
    "Path value will not be used. Paths cannot be set for passthrough TLS.\n" +
    "</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "\n" +
    "<div ng-if=\"services\">\n" +
    "<osc-routing-service model=\"route.to\" services=\"services\" show-weight=\"route.alternateServices.length > 1 || (controls.hideSlider && route.alternateServices.length)\">\n" +
    "</osc-routing-service>\n" +
    "</div>\n" +
    "\n" +
    "<div ng-if=\"route.portOptions.length\" class=\"form-group\">\n" +
    "<label for=\"routeTargetPort\">Target Port</label>\n" +
    "<ui-select ng-if=\"route.portOptions.length\" ng-model=\"route.targetPort\" input-id=\"routeTargetPort\" search-enabled=\"false\" aria-describedby=\"target-port-help\">\n" +
    "<ui-select-match>{{$select.selected.label}}</ui-select-match>\n" +
    "<ui-select-choices repeat=\"portOption.port as portOption in route.portOptions\">\n" +
    "{{portOption.label}}\n" +
    "</ui-select-choices>\n" +
    "</ui-select>\n" +
    "<div>\n" +
    "<span id=\"target-port-help\" class=\"help-block\">\n" +
    "Target port for traffic.\n" +
    "</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "\n" +
    "<div ng-if=\"alternateServiceOptions.length\">\n" +
    "<h3>Alternate Services</h3>\n" +
    "<div class=\"form-group\">\n" +
    "<div class=\"checkbox\">\n" +
    "<label>\n" +
    "<input type=\"checkbox\" ng-model=\"options.alternateServices\" aria-describedby=\"secure-route-help\">\n" +
    "Split traffic across multiple services\n" +
    "</label>\n" +
    "<div class=\"help-block\">\n" +
    "Routes can direct traffic to multiple services for A/B testing. Each service has a weight controlling how much traffic it gets.\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-repeat=\"alternate in route.alternateServices\" class=\"form-group\">\n" +
    "<osc-routing-service model=\"alternate\" services=\"alternateServiceOptions\" is-alternate=\"true\" show-weight=\"route.alternateServices.length > 1 || controls.hideSlider\">\n" +
    "</osc-routing-service>\n" +
    "<a href=\"\" ng-click=\"route.alternateServices.splice($index, 1)\">Remove Service</a>\n" +
    "<span ng-if=\"$last && route.alternateServices.length < alternateServiceOptions.length\">\n" +
    "<span class=\"action-divider\">|</span>\n" +
    "<a href=\"\" ng-click=\"addAlternateService()\">Add Another Service</a>\n" +
    "</span>\n" +
    "</div>\n" +
    "<div ng-repeat=\"duplicate in duplicateServices\" class=\"has-error mar-bottom-lg\">\n" +
    "<span class=\"help-block\">\n" +
    "Service {{duplicate.metadata.name}} cannot be added twice.\n" +
    "</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "\n" +
    "<div ng-if=\"route.alternateServices.length === 1 && !controls.hideSlider\">\n" +
    "<h3>Service Weights</h3>\n" +
    "<div class=\"form-group\">\n" +
    "<div class=\"weight-slider-values\">\n" +
    "<div>\n" +
    "<span class=\"service-name\">{{route.to.service.metadata.name}}</span>\n" +
    "<span class=\"weight-percentage\">{{weightAsPercentage(route.to.weight, true)}}</span>\n" +
    "</div>\n" +
    "<div>\n" +
    "<span class=\"weight-percentage hidden-xs\">{{weightAsPercentage(route.alternateServices[0].weight, true)}}</span>\n" +
    "<span class=\"service-name\">{{route.alternateServices[0].service.metadata.name}}</span>\n" +
    "<span class=\"weight-percentage visible-xs-inline\">{{weightAsPercentage(route.alternateServices[0].weight, true)}}</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "<label class=\"sr-only\" for=\"weight-slider\">Service {{route.to.service.metadata.name}} Weight</label>\n" +
    "<input id=\"weight-slider\" type=\"range\" min=\"0\" max=\"100\" step=\"1\" list=\"ticks\" ng-model=\"controls.rangeSlider\" aria-describedby=\"weight-slider-help\" class=\"mar-top-md\">\n" +
    "<datalist id=\"ticks\">\n" +
    "<option>0</option>\n" +
    "<option>25</option>\n" +
    "<option>50</option>\n" +
    "<option>75</option>\n" +
    "<option>100</option>\n" +
    "</datalist>\n" +
    "<div class=\"help-block\" id=\"weight-slider-help\">\n" +
    "Percentage of traffic sent to each service. Drag the slider to adjust the values or\n" +
    "<a href=\"\" ng-click=\"controls.hideSlider = true\">edit weights as integers</a>.\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<h3>Security</h3>\n" +
    "<div class=\"checkbox\">\n" +
    "<label>\n" +
    "<input type=\"checkbox\" ng-model=\"options.secureRoute\" aria-describedby=\"secure-route-help\">\n" +
    "Secure route\n" +
    "</label>\n" +
    "<div class=\"help-block\" id=\"secure-route-help\">\n" +
    "Routes can be secured using several TLS termination types for serving certificates.\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-show=\"options.secureRoute\">\n" +
    "\n" +
    "<div class=\"form-group\">\n" +
    "<label for=\"tlsTermination\">TLS Termination</label>\n" +
    "<ui-select ng-model=\"route.tls.termination\" input-id=\"tlsTermination\" search-enabled=\"false\">\n" +
    "<ui-select-match>{{$select.selected | humanizeTLSTermination}}</ui-select-match>\n" +
    "<ui-select-choices repeat=\"option in ['edge', 'passthrough', 'reencrypt']\">\n" +
    "{{option | humanizeTLSTermination}}\n" +
    "</ui-select-choices>\n" +
    "</ui-select>\n" +
    "<div class=\"learn-more-block help-block\">\n" +
    "<a href=\"{{'route-types' | helpLink}}\" target=\"_blank\">Learn More&nbsp;<i class=\"fa fa-external-link\" aria-hidden=\"true\"></i></a>\n" +
    "</div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"form-group\">\n" +
    "<label for=\"insecureTraffic\">Insecure Traffic</label>\n" +
    "\n" +
    "<input type=\"hidden\" name=\"insecureTraffic\">\n" +
    "<ui-select ng-model=\"route.tls.insecureEdgeTerminationPolicy\" name=\"insecureTraffic\" input-id=\"insecureTraffic\" aria-describedby=\"route-insecure-policy-help\" search-enabled=\"false\">\n" +
    "<ui-select-match>{{$select.selected.label}}</ui-select-match>\n" +
    "<ui-select-choices repeat=\"option.value as option in insecureTrafficOptions\" ui-disable-choice=\"route.tls.termination === 'passthrough' && option.value === 'Allow'\">\n" +
    "{{option.label}}\n" +
    "</ui-select-choices>\n" +
    "</ui-select>\n" +
    "<div>\n" +
    "<span id=\"route-insecure-policy-help\" class=\"help-block\">\n" +
    "Policy for traffic on insecure schemes like HTTP.\n" +
    "</span>\n" +
    "</div>\n" +
    "<div ng-if=\"routeForm.insecureTraffic.$error.passthrough\" class=\"has-warning\">\n" +
    "<span class=\"help-block\">\n" +
    "Passthrough routes can't use the insecure traffic policy <var>Allow</var>.\n" +
    "</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "\n" +
    "<h3>Certificates</h3>\n" +
    "<div class=\"help-block\">\n" +
    "TLS certificates for edge and re-encrypt termination. If not specified, the router's default certificate is used.\n" +
    "</div>\n" +
    "<div ng-if=\"showCertificatesNotUsedWarning\" class=\"has-warning\">\n" +
    "<span class=\"help-block\">\n" +
    "The certificate or key you've set will not be used.\n" +
    "<span ng-if=\"!route.tls.termination\">\n" +
    "The route is unsecured.\n" +
    "</span>\n" +
    "<span ng-if=\"route.tls.termination === 'passthrough'\">\n" +
    "Custom certificates cannot be used with passthrough termination.\n" +
    "</span>\n" +
    "</span>\n" +
    "</div>\n" +
    "<fieldset class=\"mar-top-md\">\n" +
    "<div>\n" +
    "<div class=\"form-group\" id=\"certificate-file\">\n" +
    "<label>Certificate</label>\n" +
    "<osc-file-input model=\"route.tls.certificate\" drop-zone-id=\"certificate-file\" show-text-area=\"true\" help-text=\"The PEM format certificate. Upload file by dragging & dropping, selecting it, or pasting from the clipbard.\" ng-disabled=\"disableCertificateInputs()\">\n" +
    "</osc-file-input>\n" +
    "</div>\n" +
    "<div class=\"form-group\" id=\"private-key-file\">\n" +
    "<label>Private Key</label>\n" +
    "<osc-file-input model=\"route.tls.key\" drop-zone-id=\"private-key-file\" show-text-area=\"true\" help-text=\"The PEM format key. Upload file by dragging & dropping, selecting it, or pasting from the clipboard.\" ng-disabled=\"disableCertificateInputs()\">\n" +
    "</osc-file-input>\n" +
    "</div>\n" +
    "<div class=\"form-group\" id=\"ca-certificate-file\">\n" +
    "<label>CA Certificate</label>\n" +
    "<osc-file-input model=\"route.tls.caCertificate\" drop-zone-id=\"ca-certificate-file\" show-text-area=\"true\" help-text=\"The PEM format CA certificate. Upload file by dragging & dropping, selecting it, or pasting from the clipboard.\" ng-disabled=\"disableCertificateInputs()\">\n" +
    "</osc-file-input>\n" +
    "</div>\n" +
    "<div class=\"form-group\" id=\"dest-ca-certificate-file\">\n" +
    "<label>Destination CA Certificate</label>\n" +
    "<osc-file-input model=\"route.tls.destinationCACertificate\" show-text-area=\"true\" drop-zone-id=\"dest-ca-certificate-file\" help-text=\"The PEM format CA certificate to validate the endpoint certificate for re-encrypt termination. Upload file by dragging & dropping, selecting it, or pasting from the clipboard.\" ng-disabled=\"route.tls.termination !== 'reencrypt'\">\n" +
    "</osc-file-input>\n" +
    "\n" +
    "<div ng-if=\"route.tls.destinationCACertificate && route.tls.termination !== 'reencrypt' && !showCertificatesNotUsedWarning\" class=\"has-warning\">\n" +
    "<span class=\"help-block\">\n" +
    "The destination CA certificate will be removed from the route. Destination CA certificates are only used for re-encrypt termination.\n" +
    "</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</fieldset>\n" +
    "</div>\n" +
    "</fieldset>\n" +
    "</ng-form>"
  );


  $templateCache.put('views/directives/osc-secrets.html',
    "<ng-form name=\"secretsForm\" class=\"osc-secrets-form\">\n" +
    "<div class=\"form-group\">\n" +
    "<div class=\"basic-secrets\">\n" +
    "<div class=\"input-labels\">\n" +
    "<label class=\"input-label\">\n" +
    "{{displayType | startCase}} Secret\n" +
    "</label>\n" +
    "</div>\n" +
    "<div ng-repeat=\"pickedSecret in pickedSecrets\">\n" +
    "<div class=\"secret-row\">\n" +
    "<div class=\"secret-name\">\n" +
    "<ui-select ng-disabled=\"disableInput\" ng-model=\"pickedSecret.name\">\n" +
    "<ui-select-match placeholder=\"Secret name\">{{$select.selected}}</ui-select-match>\n" +
    "<ui-select-choices repeat=\"secret in (secretsByType[type] | filter : $select.search)\">\n" +
    "<div ng-bind-html=\"secret | highlight : $select.search\"></div>\n" +
    "</ui-select-choices>\n" +
    "</ui-select>\n" +
    "</div>\n" +
    "<div class=\"remove-secret\">\n" +
    "<a ng-click=\"removeSecret($index)\" href=\"\" role=\"button\" class=\"btn-remove\">\n" +
    "<span class=\"pficon pficon-close\" aria-hidden=\"true\"></span>\n" +
    "<span class=\"sr-only\">Remove build secret</span>\n" +
    "</a>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"help-blocks\" ng-switch=\"displayType\">\n" +
    "<div class=\"help-block\" ng-switch-when=\"source\">\n" +
    "Secret with credentials for pulling your source code.\n" +
    "<a href=\"{{'git_secret' | helpLink}}\" target=\"_blank\"><span class=\"learn-more-inline\">Learn More&nbsp;<i class=\"fa fa-external-link\" aria-hidden=\"true\"></i></span></a>\n" +
    "</div>\n" +
    "<div class=\"help-block\" ng-switch-when=\"pull\">\n" +
    "Secret for authentication when pulling images from a secured registry.\n" +
    "<a href=\"{{'pull_secret' | helpLink}}\" target=\"_blank\"><span class=\"learn-more-inline\">Learn More&nbsp;<i class=\"fa fa-external-link\" aria-hidden=\"true\"></i></span></a>\n" +
    "</div>\n" +
    "<div class=\"help-block\" ng-switch-when=\"push\">\n" +
    "Secret for authentication when pushing images to a secured registry.\n" +
    "<a href=\"{{'pull_secret' | helpLink}}\" target=\"_blank\"><span class=\"learn-more-inline\">Learn More&nbsp;<i class=\"fa fa-external-link\" aria-hidden=\"true\"></i></span></a>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"osc-secret-actions\" ng-if=\"!disableInput\">\n" +
    "<span ng-if=\"canAddSourceSecret()\">\n" +
    "<a href=\"\" role=\"button\" ng-click=\"addSourceSecret()\">Add Another Secret</a>\n" +
    "<span ng-if=\"'secrets' | canI : 'create'\" class=\"action-divider\">|</span>\n" +
    "</span>\n" +
    "<a href=\"\" ng-if=\"'secrets' | canI : 'create'\" role=\"button\" ng-click=\"openCreateSecretModal()\">Create New Secret</a>\n" +
    "</div>\n" +
    "</ng-form>"
  );


  $templateCache.put('views/directives/osc-source-secrets.html',
    "<ng-form name=\"secretsForm\" class=\"osc-secrets-form\">\n" +
    "<div ng-if=\"strategyType !== 'Custom'\">\n" +
    "<div class=\"form-group\">\n" +
    "<div class=\"advanced-secrets\">\n" +
    "<div class=\"input-labels\">\n" +
    "<label class=\"input-label\">\n" +
    "Build Secret\n" +
    "</label>\n" +
    "<label class=\"input-label\">\n" +
    "Destination Directory\n" +
    "</label>\n" +
    "</div>\n" +
    "<div ng-repeat=\"pickedSecret in pickedSecrets\">\n" +
    "<div class=\"secret-row\">\n" +
    "<div class=\"secret-name\">\n" +
    "<ui-select ng-required=\"pickedSecret.destinationDir\" ng-model=\"pickedSecret.secret.name\">\n" +
    "<ui-select-match placeholder=\"Secret name\">{{$select.selected}}</ui-select-match>\n" +
    "<ui-select-choices repeat=\"secret in (secretsByType[type] | filter : $select.search)\">\n" +
    "<div ng-bind-html=\"secret | highlight : $select.search\"></div>\n" +
    "</ui-select-choices>\n" +
    "</ui-select>\n" +
    "</div>\n" +
    "<div class=\"destination-dir\">\n" +
    "<input class=\"form-control\" id=\"destinationDir\" name=\"destinationDir\" ng-model=\"pickedSecret.destinationDir\" type=\"text\" placeholder=\"/\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\">\n" +
    "</div>\n" +
    "<div class=\"remove-secret\">\n" +
    "<a ng-click=\"removeSecret($index)\" href=\"\" role=\"button\" class=\"btn-remove\">\n" +
    "<span class=\"pficon pficon-close\" aria-hidden=\"true\"></span>\n" +
    "<span class=\"sr-only\">Remove build secret</span>\n" +
    "</a>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"help-blocks\">\n" +
    "<div class=\"help-block\">Source secret to copy into the builder pod at build time.</div>\n" +
    "<div class=\"help-block\">Directory where the files will be available at build time.</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"strategyType === 'Custom'\">\n" +
    "<div class=\"form-group\">\n" +
    "<div class=\"advanced-secrets\">\n" +
    "<div class=\"input-labels\">\n" +
    "<label class=\"input-label\">\n" +
    "Build Secret\n" +
    "</label>\n" +
    "<label class=\"input-label\">\n" +
    "Mount path\n" +
    "</label>\n" +
    "</div>\n" +
    "<div ng-repeat=\"pickedSecret in pickedSecrets\">\n" +
    "<div class=\"secret-row\">\n" +
    "<div class=\"secret-name\">\n" +
    "<ui-select ng-required=\"pickedSecret.mountPath\" ng-model=\"pickedSecret.secretSource.name\">\n" +
    "<ui-select-match placeholder=\"Secret name\">{{$select.selected}}</ui-select-match>\n" +
    "<ui-select-choices repeat=\"secret in (secretsByType[type] | filter : $select.search)\">\n" +
    "<div ng-bind-html=\"secret | highlight : $select.search\"></div>\n" +
    "</ui-select-choices>\n" +
    "</ui-select>\n" +
    "</div>\n" +
    "<div class=\"destination-dir\">\n" +
    "<input class=\"form-control\" id=\"mountPath\" name=\"mountPath\" ng-model=\"pickedSecret.mountPath\" type=\"text\" placeholder=\"/\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\">\n" +
    "</div>\n" +
    "<div class=\"remove-secret\">\n" +
    "<a ng-click=\"removeSecret($index)\" href=\"\" role=\"button\" class=\"btn-remove\">\n" +
    "<span class=\"pficon pficon-close\" aria-hidden=\"true\"></span>\n" +
    "<span class=\"sr-only\">Remove build secret</span>\n" +
    "</a>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"help-blocks\">\n" +
    "<div class=\"help-block\">Source secret to mount into the builder pod at build time.</div>\n" +
    "<div class=\"help-block\">Path at which to mount the secret.</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"osc-secret-actions\">\n" +
    "<span ng-if=\"canAddSourceSecret()\">\n" +
    "<a href=\"\" role=\"button\" ng-click=\"addSourceSecret()\">Add Another Secret</a>\n" +
    "<span ng-if=\"'secrets' | canI : 'create'\" class=\"action-divider\">|</span>\n" +
    "</span>\n" +
    "<a href=\"\" ng-if=\"'secrets' | canI : 'create'\" role=\"button\" ng-click=\"openCreateSecretModal()\">Create New Secret</a>\n" +
    "</div>\n" +
    "</ng-form>"
  );


  $templateCache.put('views/directives/pause-rollouts-checkbox.html',
    "<div ng-if=\"alwaysVisible || !missingConfigChangeTrigger\" class=\"form-group pause-rollouts-checkbox\">\n" +
    "<div class=\"checkbox\">\n" +
    "<label>\n" +
    "<input type=\"checkbox\" ng-disabled=\"disabled\" ng-model=\"deployment.spec.paused\" aria-describedby=\"pause-help\">\n" +
    "Pause rollouts for this {{deployment.kind | humanizeKind}}\n" +
    "</label>\n" +
    "<div id=\"pause-help\" class=\"help-block\">\n" +
    "Pausing lets you make changes without triggering a rollout. You can resume rollouts at any time.\n" +
    "<span ng-if=\"!alwaysVisible\">If unchecked, a new rollout will start on save.</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/directives/pipeline-status.html',
    "<div class=\"pipeline-status-bar\" ng-class=\"status\">\n" +
    "<div class=\"pipeline-line\"></div>\n" +
    "<div class=\"pipeline-circle\">\n" +
    "<div class=\"clip1\"></div>\n" +
    "<div class=\"clip2\"></div>\n" +
    "<div class=\"inner-circle\">\n" +
    "<div class=\"inner-circle-fill\"></div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/directives/pod-donut.html',
    "<div ng-attr-id=\"{{chartId}}\" class=\"pod-donut\"></div>\n" +
    "\n" +
    "<div class=\"sr-only\">\n" +
    "<div ng-if=\"(pods | hashSize) === 0\">No pods.</div>\n" +
    "<div ng-if=\"(pods | hashSize) !== 0\">\n" +
    "Pod status:\n" +
    "<span ng-repeat=\"column in podStatusData\" ng-if=\"column[1]\">{{column[1]}} {{column[0]}}</span>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/directives/pod-metrics.html',
    "<div class=\"metrics mar-top-xl\" ng-if=\"pod || deployment\">\n" +
    "<div ng-show=\"!metricsError\" class=\"metrics-options\">\n" +
    "<div class=\"pull-right learn-more-block hidden-xs\">\n" +
    "<a href=\"\" ng-click=\"showComputeUnitsHelp()\">About Compute Resources</a>\n" +
    "</div>\n" +
    "\n" +
    "<div ng-if=\"pod.spec.containers.length\" class=\"form-group\">\n" +
    "<label for=\"selectContainer\">Container:</label>\n" +
    "<div class=\"select-container\">\n" +
    "<span ng-show=\"pod.spec.containers.length === 1\">\n" +
    "{{pod.spec.containers[0].name}}\n" +
    "</span>\n" +
    "<ui-select ng-init=\"options.selectedContainer = pod.spec.containers[0]\" ng-show=\"pod.spec.containers.length > 1\" ng-model=\"options.selectedContainer\" input-id=\"selectContainer\">\n" +
    "<ui-select-match>{{$select.selected.name}}</ui-select-match>\n" +
    "<ui-select-choices repeat=\"container in pod.spec.containers | filter : { name: $select.search }\">\n" +
    "<div ng-bind-html=\"container.name | highlight : $select.search\"></div>\n" +
    "</ui-select-choices>\n" +
    "</ui-select>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"form-group\">\n" +
    "<label for=\"timeRange\">Time Range:</label>\n" +
    "<div class=\"select-range\">\n" +
    "<ui-select ng-model=\"options.timeRange\" search-enabled=\"false\" ng-disabled=\"metricsError\" input-id=\"timeRange\">\n" +
    "<ui-select-match>{{$select.selected.label}}</ui-select-match>\n" +
    "<ui-select-choices repeat=\"range in options.rangeOptions\">\n" +
    "{{range.label}}\n" +
    "</ui-select-choices>\n" +
    "</ui-select>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<ellipsis-pulser color=\"dark\" size=\"sm\" msg=\"Loading metrics\" ng-if=\"!loaded\"></ellipsis-pulser>\n" +
    "<div ng-if=\"loaded && noData && !metricsError\" class=\"mar-top-md\">No metrics to display.</div>\n" +
    "<div ng-if=\"metricsError\" class=\"empty-state-message text-center\">\n" +
    "<h2>\n" +
    "<span class=\"pficon pficon-error-circle-o\" aria-hidden=\"true\"></span>\n" +
    "Metrics are not available.\n" +
    "</h2>\n" +
    "<p>\n" +
    "An error occurred getting metrics<span ng-if=\"options.selectedContainer.name\">\n" +
    "for container {{options.selectedContainer.name}}</span><span ng-if=\"metricsURL\">\n" +
    "from <a ng-href=\"{{metricsURL}}\">{{metricsURL}}</a></span>.\n" +
    "</p>\n" +
    "<p class=\"text-muted\">\n" +
    "{{metricsError.details}}\n" +
    "</p>\n" +
    "</div>\n" +
    "<div ng-repeat=\"metric in metrics\" ng-if=\"!noData && !metricsError\" class=\"metrics-full\">\n" +
    "<h2 ng-class=\"{ 'has-limit': metric.datasets[0].total }\">\n" +
    "{{metric.label}}\n" +
    "<small ng-if=\"pod.spec.containers.length > 1\">\n" +
    "<span ng-if=\"metric.containerMetric\">Container Metrics</span>\n" +
    "<span ng-if=\"!metric.containerMetric\">Pod Metrics</span>\n" +
    "</small>\n" +
    "</h2>\n" +
    "\n" +
    "\n" +
    "<div ng-if=\"metric.datasets[0].total\" class=\"utilization-trend-chart-pf\">\n" +
    "<div class=\"current-values\">\n" +
    "<div ng-if=\"metric.datasets[0].available >= 0\">\n" +
    "<h1 class=\"available-count pull-left\">\n" +
    "{{metric.datasets[0].available}}\n" +
    "</h1>\n" +
    "<div class=\"available-text pull-left\">\n" +
    "<div>Available of</div>\n" +
    "<div>{{metric.datasets[0].total}} {{metric.units}}</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"metric.datasets[0].available < 0\">\n" +
    "<h1 class=\"available-count pull-left\">\n" +
    "{{metric.datasets[0].available | abs}}\n" +
    "</h1>\n" +
    "<div class=\"available-text pull-left\">\n" +
    "<div><strong>Over limit of</strong></div>\n" +
    "<div>{{metric.datasets[0].total}} {{metric.units}}</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "\n" +
    "<div style=\"clear: both\"></div>\n" +
    "<div class=\"row\">\n" +
    "\n" +
    "<div ng-if=\"metric.datasets[0].total\" ng-class=\"{ 'col-sm-12 col-md-3 col-md-push-9': !stackDonut }\">\n" +
    "<div ng-attr-id=\"{{metric.chartPrefix + uniqueID}}-donut\" class=\"metrics-donut\"></div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"col-sm-12\" ng-class=\"{ 'col-md-9': hasLimits && !stackDonut, 'col-md-pull-3': metric.datasets[0].total && !stackDonut}\">\n" +
    "<div ng-attr-id=\"{{metric.chartPrefix + uniqueID}}-sparkline\" class=\"metrics-sparkline\"></div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/directives/pods-table.html',
    "<table class=\"table table-bordered table-hover table-mobile table-layout-fixed\">\n" +
    "<colgroup>\n" +
    "<col class=\"col-sm-4\">\n" +
    "</colgroup>\n" +
    "<thead>\n" +
    "<tr>\n" +
    "<th>{{customNameHeader || 'Name'}}</th>\n" +
    "<th>Status</th>\n" +
    "<th>Containers Ready</th>\n" +
    "<th>Container Restarts</th>\n" +
    "<th>Age</th>\n" +
    "<th ng-if=\"activePods\">Receiving Traffic</th>\n" +
    "</tr>\n" +
    "</thead>\n" +
    "<tbody ng-if=\"(pods | hashSize) == 0\">\n" +
    "<tr><td colspan=\"{{activePods ? 6 : 5}}\"><em>{{emptyMessage || 'No pods to show'}}</em></td></tr>\n" +
    "</tbody>\n" +
    "<tbody ng-if=\"(pods | hashSize) > 0\">\n" +
    "<tr ng-repeat=\"pod in pods | orderObjectsByDate : true\">\n" +
    "<td data-title=\"{{customNameHeader || 'Name'}}\">\n" +
    "<a href=\"{{pod | navigateResourceURL}}\">{{pod.metadata.name}}</a>\n" +
    "<span ng-if=\"pod | isDebugPod\">\n" +
    "<i class=\"fa fa-bug info-popover\" aria-hidden=\"true\" data-toggle=\"popover\" data-trigger=\"hover\" dynamic-content=\"Debugging pod {{pod | debugPodSourceName}}\"></i>\n" +
    "<span class=\"sr-only\">Debugging pod {{pod | debugPodSourceName}}</span>\n" +
    "</span>\n" +
    "</td>\n" +
    "<td data-title=\"Status\">\n" +
    "<div row class=\"status\">\n" +
    "<status-icon status=\"pod | podStatus\" disable-animation></status-icon>\n" +
    "<span flex>{{pod | podStatus | sentenceCase}}</span>\n" +
    "</div>\n" +
    "</td>\n" +
    "<td data-title=\"Ready\">{{pod | numContainersReady}}/{{pod.spec.containers.length}}</td>\n" +
    "<td data-title=\"Restarts\">{{pod | numContainerRestarts}}</td>\n" +
    "<td data-title=\"Age\"><span am-time-ago=\"pod.metadata.creationTimestamp\" am-without-suffix=\"true\"></span></td>\n" +
    "<td ng-if=\"activePods\" data-title=\"Receiving Traffic\">\n" +
    "<span ng-if=\"activePods[pod.metadata.name]\">\n" +
    "<span class=\"fa fa-fw fa-check text-success\" aria-hidden=\"true\"></span>\n" +
    "<span class=\"sr-only\">Yes</span>\n" +
    "</span>\n" +
    "<span ng-if=\"!activePods[pod.metadata.name]\">\n" +
    "<span data-toggle=\"popover\" data-trigger=\"hover\" data-content=\"{{podFailureReasons[pod.status.phase] || 'This pod has no endpoints and is not accepting traffic.'}}\" style=\"cursor: help\">\n" +
    "<span class=\"fa fa-fw fa-times text-danger\" aria-hidden=\"true\" data-toggle=\"tooltip\" style=\"cursor: help\"></span>\n" +
    "<span class=\"sr-only\">No</span>\n" +
    "</span>\n" +
    "</span>\n" +
    "</td>\n" +
    "</tr>\n" +
    "</tbody>\n" +
    "</table>"
  );


  $templateCache.put('views/directives/replicas.html',
    "<span ng-show=\"!model.editing\">\n" +
    "<span ng-if=\"status === undefined\">{{spec}} replica<span ng-if=\"spec !== 1\">s</span></span>\n" +
    "<span ng-if=\"status !== undefined\">{{status}} current / {{spec}} desired</span>\n" +
    "<a href=\"\" title=\"Edit\" class=\"action-button\" ng-if=\"!disableScaling && scaleFn && (deployment | canIScale)\" ng-click=\"model.desired = spec; model.editing = true\">\n" +
    "<i class=\"pficon pficon-edit mar-left-sm\"></i>\n" +
    "<span class=\"sr-only\">Edit</span>\n" +
    "</a>\n" +
    "</span>\n" +
    "<span ng-show=\"!disableScaling && model.editing\">\n" +
    "<form name=\"form.scaling\" ng-submit=\"scale()\" class=\"form-inline\">\n" +
    "<span ng-class=\"{'has-error': form.scaling.$invalid}\">\n" +
    "<input type=\"number\" name=\"desired\" ng-model=\"model.desired\" ng-required=\"true\" min=\"0\" ng-pattern=\"/^\\-?\\d+$/\" focus-when=\"{{model.editing}}\" select-on-focus class=\"input-number\">\n" +
    "</span>\n" +
    "<a href=\"\" title=\"Scale\" class=\"action-button\" ng-attr-aria-disabled=\"{{form.scaling.$invalid ? 'true' : undefined}}\" ng-click=\"scale()\" role=\"button\">\n" +
    "<i class=\"icon icon-ok\" style=\"margin-left: 5px\"></i>\n" +
    "<span class=\"sr-only\">Scale</span>\n" +
    "</a>\n" +
    "<a href=\"\" title=\"Cancel\" class=\"action-button\" ng-click=\"cancel()\" role=\"button\">\n" +
    "<i class=\"icon icon-remove\" style=\"margin-left: 5px\"></i>\n" +
    "<span class=\"sr-only\">Cancel</span>\n" +
    "</a>\n" +
    "<div ng-if=\"form.scaling.$invalid\" class=\"has-error\">\n" +
    "<div ng-if=\"form.scaling.desired.$error.required\" class=\"help-block\">\n" +
    "A value for replicas is required.\n" +
    "</div>\n" +
    "<div ng-if=\"form.scaling.desired.$error.pattern\" class=\"help-block\">\n" +
    "Replicas must be a whole number.\n" +
    "</div>\n" +
    "<div ng-if=\"form.scaling.desired.$error.min\" class=\"help-block\">\n" +
    "Replicas can't be negative.\n" +
    "</div>\n" +
    "</div>\n" +
    "</form>\n" +
    "</span>"
  );


  $templateCache.put('views/directives/select-containers.html',
    "<ng-form name=\"forms.containerSelect\">\n" +
    "<div class=\"checkbox\" ng-repeat=\"container in template.spec.containers\">\n" +
    "<label class=\"truncate\">\n" +
    "<input type=\"checkbox\" ng-model=\"containers[container.name]\" ng-required=\"required && !containerSelected\">\n" +
    "<b>{{container.name}}</b>\n" +
    "<span class=\"hidden-xs\">\n" +
    "from image\n" +
    "<i ng-attr-title=\"{{container.image}}\">{{container.image}}</i>\n" +
    "</span>\n" +
    "</label>\n" +
    "</div>\n" +
    "<div ng-if=\"helpText\" class=\"help-block\">\n" +
    "{{helpText}}\n" +
    "</div>\n" +
    "<div class=\"has-error\" ng-if=\"required && forms.containerSelect.$dirty && !containerSelected\">\n" +
    "<span class=\"help-block\">\n" +
    "You must select at least one container.\n" +
    "</span>\n" +
    "</div>\n" +
    "</ng-form>"
  );


  $templateCache.put('views/directives/selector.html',
    "<div ng-if=\"!selector\">none</div>\n" +
    "<div ng-if=\"selector\">\n" +
    "<div ng-if=\"selector.matchLabels || selector.matchExpressions\">\n" +
    "<div ng-repeat=\"(selectorLabel, selectorValue) in selector.matchLabels\">\n" +
    "{{selectorLabel}}={{selectorValue}}\n" +
    "</div>\n" +
    "<div ng-repeat=\"requirement in selector.matchExpressions\">\n" +
    "{{requirement.key}} {{requirement.operator | startCase | lowercase}}\n" +
    "<span ng-repeat=\"value in requirement.values\">\n" +
    "<span ng-if=\"$first\">(</span>{{value}}<span ng-if=\"!$last\">, </span><span ng-if=\"$last\">)</span>\n" +
    "</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"!selector.matchLabels && !selector.matchExpressions\">\n" +
    "<div ng-repeat=\"(selectorLabel, selectorValue) in selector\">\n" +
    "{{selectorLabel}}={{selectorValue}}\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/directives/service-group-notifications.html',
    "<alerts alerts=\"alerts\" filter=\"showAlert\" toast=\"true\" animate-slide=\"true\"></alerts>"
  );


  $templateCache.put('views/directives/traffic-table.html',
    " <table class=\"table table-bordered table-hover table-mobile\">\n" +
    "<thead>\n" +
    "<tr>\n" +
    "<th>{{customNameHeader || 'Route'}}<span ng-if=\"showNodePorts\"> / Node Port</span></th>\n" +
    "<th role=\"presentation\"></th>\n" +
    "<th>Service Port</th>\n" +
    "<th role=\"presentation\"></th>\n" +
    "<th>Target Port</th>\n" +
    "<th>Hostname</th>\n" +
    "<th>TLS Termination</th>\n" +
    "</tr>\n" +
    "</thead>\n" +
    "<tbody ng-if=\"(portsByRoute | hashSize) == 0\">\n" +
    "<tr><td colspan=\"7\"><em>{{emptyMessage || 'No routes or ports to show'}}</em></td></tr>\n" +
    "</tbody>\n" +
    "<tbody ng-if=\"(portsByRoute | hashSize) > 0\">\n" +
    "<tr ng-repeat-start=\"(routeName,ports) in portsByRoute\" style=\"display: none\"></tr>\n" +
    "<tr ng-repeat=\"port in ports\" ng-if=\"routeName !== ''\">\n" +
    "<td data-title=\"{{customNameHeader || 'Route'}}{{ showNodePorts ? ' / Node Port' : '' }}\">\n" +
    "<a href=\"{{routes[routeName] | navigateResourceURL}}\">{{routes[routeName].metadata.name}}</a>\n" +
    "<route-warnings ng-if=\"routes[routeName].spec.to.kind !== 'Service' || services\" route=\"routes[routeName]\" service=\"services[routes[routeName].spec.to.name]\">\n" +
    "</route-warnings>\n" +
    "<span ng-if=\"showNodePorts\">\n" +
    "<span ng-if=\"port.nodePort\"> / {{port.nodePort}}</span>\n" +
    "</span>\n" +
    "</td>\n" +
    "<td role=\"presentation\" class=\"text-muted arrow\"></td>\n" +
    "<td data-title=\"Service Port\">\n" +
    "{{port.port}}/{{port.protocol}}\n" +
    "<span ng-if=\"port.name\">({{port.name}})</span>\n" +
    "</td>\n" +
    "<td role=\"presentation\" class=\"text-muted arrow\"></td>\n" +
    "<td data-title=\"Target Port\">\n" +
    "{{port.targetPort}}\n" +
    "</td>\n" +
    "<td data-title=\"Hostname\">\n" +
    "<span ng-if=\"(routes[routeName] | isWebRoute)\" class=\"word-break\">\n" +
    "<a href=\"{{routes[routeName] | routeWebURL}}\" target=\"_blank\">{{routes[routeName] | routeLabel}}</a>\n" +
    "</span>\n" +
    "<span ng-if=\"!(routes[routeName] | isWebRoute)\" class=\"word-break\">\n" +
    "{{routes[routeName] | routeLabel}}\n" +
    "</span>\n" +
    "<span ng-if=\"!routes[routeName].status.ingress\" data-toggle=\"popover\" data-trigger=\"hover\" data-content=\"The route is not accepting traffic yet because it has not been admitted by a router.\" style=\"cursor: help; padding-left: 5px\">\n" +
    "<status-icon status=\"'Pending'\"></status-icon>\n" +
    "<span class=\"sr-only\">Pending</span>\n" +
    "</span>\n" +
    "</td>\n" +
    "\n" +
    "<td data-title=\"Termination\">\n" +
    "{{routes[routeName].spec.tls.termination | humanizeTLSTermination}}\n" +
    "<span ng-if=\"!routes[routeName].spec.tls.termination\">&nbsp;</span>\n" +
    "</td>\n" +
    "</tr>\n" +
    "<tr ng-repeat-end style=\"display: none\"></tr>\n" +
    "<tr ng-repeat=\"port in portsByRoute['']\">\n" +
    "<td data-title=\"{{customNameHeader || 'Route'}}{{ showNodePorts ? ' / Node Port' : '' }}\">\n" +
    "<span ng-if=\"!port.nodePort\" class=\"text-muted\">none</span>\n" +
    "<span ng-if=\"port.nodePort\">{{port.nodePort}}</span>\n" +
    "</td>\n" +
    "<td role=\"presentation\" class=\"text-muted arrow\"></td>\n" +
    "<td data-title=\"Service Port\">\n" +
    "{{port.port}}/{{port.protocol}}\n" +
    "<span ng-if=\"port.name\">({{port.name}})</span>\n" +
    "</td>\n" +
    "<td role=\"presentation\" class=\"text-muted arrow\"></td>\n" +
    "<td data-title=\"Target Port\">\n" +
    "{{port.targetPort}}\n" +
    "</td>\n" +
    "<td data-title=\"Hostname\"><span class=\"text-muted\">none</span></td>\n" +
    "<td data-title=\"Termination\">\n" +
    "<span class=\"text-muted\">none</span>\n" +
    "</td>\n" +
    "</tr>\n" +
    "</tbody>\n" +
    "</table>"
  );


  $templateCache.put('views/directives/truncate-long-text.html',
    "<span ng-if=\"!truncated\" ng-bind-html=\"content | highlightKeywords : keywords\" class=\"truncated-content\"></span>\n" +
    "<span ng-if=\"truncated\">\n" +
    "<span ng-if=\"!toggles.expanded\">\n" +
    "<span ng-attr-title=\"{{content}}\">\n" +
    "<span ng-bind-html=\"truncatedContent | highlightKeywords : keywords\" class=\"truncated-content\"></span>&hellip;\n" +
    "</span>\n" +
    "<a ng-if=\"expandable\" href=\"\" ng-click=\"toggles.expanded = true\" style=\"margin-left: 5px; white-space: nowrap\">See all</a>\n" +
    "</span>\n" +
    "<span ng-if=\"toggles.expanded\">\n" +
    "<div ng-if=\"prettifyJson\" class=\"well\">\n" +
    "<span class=\"pull-right\" style=\"margin-top: -10px\"><a href=\"\" ng-click=\"toggles.expanded = false\">Collapse</a></span>\n" +
    "<span ng-bind-html=\"content | prettifyJSON | highlightKeywords : keywords\" class=\"pretty-json truncated-content\"></span>\n" +
    "</div>\n" +
    "<span ng-if=\"!prettifyJson\">\n" +
    "<span class=\"pull-right\"><a href=\"\" ng-click=\"toggles.expanded = false\">Collapse</a></span>\n" +
    "<span ng-bind-html=\"content | highlightKeywords : keywords\" class=\"truncated-content\"></span>\n" +
    "</span>\n" +
    "</span>\n" +
    "</span>"
  );


  $templateCache.put('views/edit/autoscaler.html',
    "<default-header class=\"top-header\"></default-header>\n" +
    "<div class=\"wrap no-sidebar\">\n" +
    "<div class=\"sidebar-left collapse navbar-collapse navbar-collapse-2\">\n" +
    "<navbar-utility-mobile></navbar-utility-mobile>\n" +
    "</div>\n" +
    "<div class=\"middle surface-shaded\">\n" +
    "\n" +
    "<div class=\"middle-section\">\n" +
    "<div class=\"middle-container\">\n" +
    "<div class=\"middle-content\">\n" +
    "<div class=\"container surface-shaded\" style=\"max-width: 900px\">\n" +
    "<breadcrumbs breadcrumbs=\"breadcrumbs\"></breadcrumbs>\n" +
    "<div class=\"row\">\n" +
    "<div class=\"col-md-12\">\n" +
    "<alerts alerts=\"alerts\"></alerts>\n" +
    "<div ng-if=\"!targetKind || !targetName || !project\" class=\"mar-top-md\">\n" +
    "Loading...\n" +
    "</div>\n" +
    "<form name=\"form\" ng-submit=\"save()\" class=\"osc-form\" ng-show=\"targetKind && targetName\">\n" +
    "<h1>\n" +
    "Autoscale {{targetKind | humanizeKind : true}} {{targetName}}\n" +
    "</h1>\n" +
    "<div class=\"help-block\">\n" +
    "Scale replicas automatically based on CPU usage.\n" +
    "</div>\n" +
    "<div class=\"learn-more-block\" ng-class=\"{ 'gutter-bottom': metricsWarning || showCPURequestWarning }\">\n" +
    "<a href=\"{{'pod_autoscaling' | helpLink}}\" target=\"_blank\">Learn More&nbsp;<i class=\"fa fa-external-link\" aria-hidden> </i></a>\n" +
    "</div>\n" +
    "\n" +
    "<div ng-if=\"metricsWarning\" class=\"alert alert-warning\">\n" +
    "<span class=\"pficon pficon-warning-triangle-o\" aria-hidden=\"true\"></span>\n" +
    "<span class=\"sr-only\">Warning:</span>\n" +
    "Metrics might not be configured by your cluster administrator. Metrics are required for autoscaling.\n" +
    "</div>\n" +
    "\n" +
    "<div ng-if=\"showCPURequestWarning\" class=\"alert alert-warning\">\n" +
    "<span class=\"pficon pficon-warning-triangle-o\" aria-hidden=\"true\"></span>\n" +
    "<span class=\"sr-only\">Warning:</span>\n" +
    "This {{targetKind | humanizeKind}} does not have any containers with a CPU\n" +
    "<span ng-if=\"'cpu' | isRequestCalculated : project\">limit</span>\n" +
    "<span ng-if=\"!('cpu' | isRequestCalculated : project)\">request</span>\n" +
    "set. Autoscaling will not work without a CPU\n" +
    "<span ng-if=\"'cpu' | isRequestCalculated : project\">limit.</span>\n" +
    "<span ng-if=\"!('cpu' | isRequestCalculated : project)\">request.</span>\n" +
    "</div>\n" +
    "<fieldset ng-disabled=\"disableInputs\" class=\"gutter-top\">\n" +
    "<osc-autoscaling model=\"autoscaling\" project=\"project\" show-name-input=\"true\" name-read-only=\"kind === 'HorizontalPodAutoscaler'\">\n" +
    "</osc-autoscaling>\n" +
    "<label-editor labels=\"labels\" expand=\"true\" can-toggle=\"false\"></label-editor>\n" +
    "<div class=\"buttons gutter-top\">\n" +
    "<button type=\"submit\" class=\"btn btn-primary btn-lg\" ng-disabled=\"form.$invalid || form.$pristine\">\n" +
    "Save\n" +
    "</button>\n" +
    "<a href=\"\" class=\"btn btn-default btn-lg\" back>Cancel</a>\n" +
    "</div>\n" +
    "</fieldset>\n" +
    "</form>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/edit/build-config.html',
    "<default-header class=\"top-header\"></default-header>\n" +
    "<div class=\"wrap no-sidebar\">\n" +
    "<div class=\"sidebar-left collapse navbar-collapse navbar-collapse-2\">\n" +
    "<navbar-utility-mobile></navbar-utility-mobile>\n" +
    "</div>\n" +
    "<div class=\"middle surface-shaded\">\n" +
    "\n" +
    "<div class=\"middle-section\" ng-show=\"buildConfig\">\n" +
    "<div class=\"middle-container\">\n" +
    "<div class=\"middle-content\">\n" +
    "<div class=\"container surface-shaded\">\n" +
    "<breadcrumbs breadcrumbs=\"breadcrumbs\"></breadcrumbs>\n" +
    "<alerts alerts=\"alerts\"></alerts>\n" +
    "<div ng-if=\"!loaded\">Loading...</div>\n" +
    "<h1>\n" +
    "Edit Build Config {{buildConfig.metadata.name}}\n" +
    "<small>&mdash; {{strategyType | startCase}} Build Strategy</small>\n" +
    "</h1>\n" +
    "<fieldset ng-disabled=\"disableInputs\">\n" +
    "<form class=\"edit-form\" name=\"form\" novalidate ng-submit=\"save()\">\n" +
    "<div class=\"row\">\n" +
    "<div class=\"col-lg-12\">\n" +
    "<div ng-if=\"buildConfig.spec.source.type !== 'None'\" class=\"section\">\n" +
    "<h3>Source Configuration</h3>\n" +
    "<dl class=\"dl-horizontal left\">\n" +
    "<div ng-if=\"sources.git\">\n" +
    "<div class=\"row\">\n" +
    "<div ng-class=\"{\n" +
    "                              'col-lg-8': view.advancedOptions,\n" +
    "                              'col-lg-12': !view.advancedOptions}\">\n" +
    "<div class=\"form-group\">\n" +
    "<label for=\"sourceUrl\" class=\"required\">Git Repository URL</label>\n" +
    "<div ng-class=\"{\n" +
    "                                  'has-warning': form.sourceUrl.$touched && !sourceURLPattern.test(updatedBuildConfig.spec.source.git.uri),\n" +
    "                                  'has-error': form.sourceUrl.$touched && form.sourceUrl.$error.required\n" +
    "                                }\">\n" +
    "\n" +
    "<input class=\"form-control\" id=\"sourceUrl\" name=\"sourceUrl\" ng-model=\"updatedBuildConfig.spec.source.git.uri\" type=\"text\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\" aria-describedby=\"source-url-help\" required>\n" +
    "</div>\n" +
    "<div class=\"help-block\" id=\"source-url-help\">\n" +
    "Git URL of the source code to build.\n" +
    "<span ng-if=\"!view.advancedOptions\">If your Git repository is private, view the <a href=\"\" ng-click=\"view.advancedOptions = true\">advanced options</a> to set up authentication.</span>\n" +
    "</div>\n" +
    "<div class=\"has-error\" ng-if=\"form.sourceUrl.$touched && form.sourceUrl.$error.required\">\n" +
    "<span class=\"help-block\">A Git repository URL is required.</span>\n" +
    "</div>\n" +
    "<div class=\"has-warning\" ng-if=\"updatedBuildConfig.spec.source.git.uri && form.sourceUrl.$touched && !sourceURLPattern.test(updatedBuildConfig.spec.source.git.uri)\">\n" +
    "<span class=\"help-block\">This might not be a valid Git URL. Check that it is the correct URL to a remote Git repository.</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"col-lg-4\" ng-if=\"view.advancedOptions\">\n" +
    "<div class=\"form-group editor\">\n" +
    "<label for=\"sourceRef\">Git Reference</label>\n" +
    "<div>\n" +
    "<input class=\"form-control\" id=\"sourceRef\" name=\"sourceRef\" type=\"text\" ng-model=\"updatedBuildConfig.spec.source.git.ref\" placeholder=\"master\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\" aria-describedby=\"source-ref-help\">\n" +
    "</div>\n" +
    "<div class=\"help-block\" id=\"source-ref-help\">Optional branch, tag, or commit.</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"view.advancedOptions\">\n" +
    "<div class=\"form-group\">\n" +
    "<label for=\"sourceContextDir\">Context Dir</label>\n" +
    "<div>\n" +
    "<input class=\"form-control\" id=\"sourceContextDir\" name=\"sourceContextDir\" type=\"text\" ng-model=\"updatedBuildConfig.spec.source.contextDir\" placeholder=\"/\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\" aria-describedby=\"context-dir-help\">\n" +
    "</div>\n" +
    "<div class=\"help-block\" id=\"context-dir-help\">Optional subdirectory for the application source code, used as the context directory for the build.</div>\n" +
    "</div>\n" +
    "<div class=\"form-group\">\n" +
    "<osc-secrets model=\"secrets.picked.gitSecret\" namespace=\"projectName\" display-type=\"source\" type=\"source\" service-account-to-link=\"builder\" secrets-by-type=\"secrets.secretsByType\" alerts=\"alerts\">\n" +
    "</osc-secrets>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"sources.dockerfile\">\n" +
    "<div class=\"form-group\">\n" +
    "<label for=\"buildFrom\">Dockerfile</label>\n" +
    "<div ui-ace=\"{\n" +
    "                              mode: 'dockerfile',\n" +
    "                              theme: 'dreamweaver',\n" +
    "                              rendererOptions: {\n" +
    "                                fadeFoldWidgets: true,\n" +
    "                                showPrintMargin: false\n" +
    "                              }\n" +
    "                            }\" ng-model=\"updatedBuildConfig.spec.source.dockerfile\" class=\"ace-bordered ace-inline dockerfile-mode\"></div>\n" +
    "</div>\n" +
    "<div class=\"form-group\" ng-if=\"updatedBuildConfig.spec.strategy.dockerStrategy.dockerfilePath && view.advancedOptions\">\n" +
    "<label for=\"dockerfilePath\">Dockerfile Path</label>\n" +
    "<div>\n" +
    "<input class=\"form-control\" id=\"dockerfilePath\" name=\"dockerfilePath\" type=\"text\" ng-model=\"updatedBuildConfig.spec.strategy.dockerStrategy.dockerfilePath\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\">\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"form-group\" ng-if=\"strategyType === 'Docker' && view.advancedOptions\">\n" +
    "<div class=\"checkbox\">\n" +
    "<label>\n" +
    "<input type=\"checkbox\" ng-model=\"options.noCache\">\n" +
    "Execute docker build without reusing cached instructions.\n" +
    "<span class=\"help action-inline\">\n" +
    "<a href=\"\">\n" +
    "<i class=\"pficon pficon-help\" data-toggle=\"tooltip\" aria-hidden=\"true\" data-original-title=\"Will run the docker build with '--no-cache=true' flag\">\n" +
    "</i>\n" +
    "</a>\n" +
    "</span>\n" +
    "</label>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"form-groups\" ng-show=\"sources.images\">\n" +
    "<div class=\"single-image-source\" ng-if=\"sourceImages.length === 1\">\n" +
    "<div class=\"form-group\">\n" +
    "<label>Image Source From</label>\n" +
    "<ui-select required ng-model=\"imageOptions.fromSource.type\" search-enabled=\"false\">\n" +
    "<ui-select-match>{{$select.selected | startCase}}</ui-select-match>\n" +
    "<ui-select-choices repeat=\"type in imageSourceTypes\">\n" +
    "{{type | startCase}}\n" +
    "</ui-select-choices>\n" +
    "</ui-select>\n" +
    "</div>\n" +
    "<div class=\"form-group\" ng-if=\"imageOptions.fromSource.type==='ImageStreamTag'\">\n" +
    "<istag-select include-shared-namespace=\"true\" model=\"imageOptions.fromSource.imageStreamTag\"></istag-select>\n" +
    "</div>\n" +
    "<div ng-if=\"imageOptions.fromSource.type==='ImageStreamImage'\" class=\"form-group\">\n" +
    "<label for=\"imageSourceImage\">Image Stream Image</label>\n" +
    "<div>\n" +
    "<input class=\"form-control\" type=\"text\" ng-model=\"imageOptions.fromSource.imageStreamImage\" placeholder=\"example: openshift/ruby-20-centos7@603bfa418\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\" required>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"imageOptions.fromSource.type==='DockerImage'\" class=\"form-group\">\n" +
    "<label for=\"imageSourceLink\">Docker Image Repository</label>\n" +
    "<div>\n" +
    "<input class=\"form-control\" id=\"imageSourceLink\" name=\"imageSourceLink\" type=\"text\" ng-model=\"imageOptions.fromSource.dockerImage\" placeholder=\"example: centos/ruby-20-centos7:latest\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\" required>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"form-group\">\n" +
    "<label for=\"buildFrom\">Source and Destination Paths<span class=\"help action-inline\">\n" +
    "<a href=\"\">\n" +
    "<i class=\"pficon pficon-help\" data-toggle=\"tooltip\" aria-hidden=\"true\" data-original-title=\"Paths is a list of source and destination paths to copy from the image. At least one pair has to be specified.\"></i>\n" +
    "</a>\n" +
    "</span></label>\n" +
    "<key-value-editor entries=\"imageSourcePaths\" key-placeholder=\"Source Path\" key-validator=\"\\/.*?$\" value-placeholder=\"Destination Dir\" key-validator-error-tooltip=\"A valid Source Path is an absolute path beginning with '/'\" add-row-link=\"Add image source path\"></key-value-editor>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"multiple-image-source\" ng-if=\"sourceImages.length !== 1\">\n" +
    "<label for=\"imageSourceFrom\">Image Source From<span class=\"help action-inline\">\n" +
    "<a href=\"\">\n" +
    "<i class=\"pficon pficon-info\" style=\"cursor: help\" aria-hidden=\"true\" data-toggle=\"tooltip\" data-original-title=\"This Build Config contains more then one Image Source. To edit them use the YAML editor.\">\n" +
    "</i>\n" +
    "</a>\n" +
    "</span></label>\n" +
    "<div ng-repeat=\"fromObject in imageSourceFromObjects\" class=\"imageSourceItem\">\n" +
    "{{selectTypes[fromObject.kind]}}: {{fromObject | imageObjectRef : buildConfig.metadata.namespace}}\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</dl>\n" +
    "<div ng-if=\"!sources.git && !sources.dockerfile && !sources.images\">\n" +
    "There are no editable source types for this build config.\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"updatedBuildConfig | isJenkinsPipelineStrategy\" class=\"section\">\n" +
    "<h3 ng-class=\"{ 'with-divider': !sources.none }\">Jenkins Pipeline Configuration</h3>\n" +
    "<div class=\"form-group\" ng-if=\"buildConfig.spec.source.type === 'Git'\">\n" +
    "<label for=\"jenkinsfile-type\">Jenkinsfile Type</label>\n" +
    "<ui-select search-enabled=\"false\" ng-model=\"jenkinsfileOptions.type\" input-id=\"jenkinsfile-type\" aria-describedby=\"jenkinsfile-type-help\">\n" +
    "<ui-select-match>{{$select.selected.title}}</ui-select-match>\n" +
    "<ui-select-choices repeat=\"type.id as type in jenkinsfileTypes\">\n" +
    "{{type.title}}\n" +
    "</ui-select-choices>\n" +
    "</ui-select>\n" +
    "<div class=\"help-block\" id=\"jenkinsfile-type-help\">\n" +
    "Use a Jenkinsfile from the source repository or specify the Jenkinsfile content directly in the build configuration.\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"jenkinsfileOptions.type === 'path'\" class=\"form-group\">\n" +
    "<label for=\"jenkinsfilePath\">Jenkinsfile Source Path</label>\n" +
    "<input class=\"form-control\" id=\"jenkinsfilePath\" name=\"jenkinsfilePath\" type=\"text\" ng-model=\"updatedBuildConfig.spec.strategy.jenkinsPipelineStrategy.jenkinsfilePath\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\" aria-describedby=\"jenkinsfile-path-help\">\n" +
    "<div class=\"help-block\" id=\"jenkinsfile-path-help\">\n" +
    "Optional path to the Jenkinsfile relative to the context dir. Defaults to the Jenkinsfile in context dir.\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"jenkinsfileOptions.type === 'inline'\">\n" +
    "<label>Jenkinsfile</label>\n" +
    "<div ui-ace=\"{\n" +
    "                          mode: 'groovy',\n" +
    "                          theme: 'eclipse',\n" +
    "                          rendererOptions: {\n" +
    "                            fadeFoldWidgets: true,\n" +
    "                            showPrintMargin: false\n" +
    "                          }\n" +
    "                        }\" ng-model=\"updatedBuildConfig.spec.strategy.jenkinsPipelineStrategy.jenkinsfile\" class=\"ace-bordered ace-inline\"></div>\n" +
    "</div>\n" +
    "<div class=\"mar-top-md mar-bottom-md\">\n" +
    "<a ng-if=\"!view.jenkinsfileExamples\" href=\"\" ng-click=\"view.jenkinsfileExamples = true\">What's a Jenkinsfile?</a>\n" +
    "</div>\n" +
    "<div ng-if=\"view.jenkinsfileExamples\" class=\"editor-examples\">\n" +
    "<div class=\"pull-right mar-top-md\">\n" +
    "<a href=\"\" ng-click=\"view.jenkinsfileExamples = false\">Hide examples</a>\n" +
    "</div>\n" +
    "<h4>Jenkinsfile Examples</h4>\n" +
    "<ng-include src=\"'views/edit/jenkinsfile-examples.html'\"></ng-include>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"sources.none && !(updatedBuildConfig | isJenkinsPipelineStrategy)\">\n" +
    "<div class=\"form-group\">\n" +
    "<i>No source inputs have been defined for this build configuration.</i>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"strategyType !== 'JenkinsPipeline'\" class=\"section\">\n" +
    "<h3 class=\"with-divider\">Image Configuration</h3>\n" +
    "<dl class=\"dl-horizontal left\">\n" +
    "<div>\n" +
    "<div class=\"form-group\">\n" +
    "<label for=\"buildFrom\">Build From</label>\n" +
    "<ui-select required ng-model=\"imageOptions.from.type\" search-enabled=\"false\">\n" +
    "<ui-select-match>{{$select.selected | startCase}}</ui-select-match>\n" +
    "<ui-select-choices repeat=\"type in buildFromTypes\">\n" +
    "{{type | startCase}}\n" +
    "</ui-select-choices>\n" +
    "</ui-select>\n" +
    "</div>\n" +
    "<div class=\"form-group\" ng-if=\"imageOptions.from.type==='ImageStreamTag'\">\n" +
    "<istag-select include-shared-namespace=\"true\" model=\"imageOptions.from.imageStreamTag\"></istag-select>\n" +
    "</div>\n" +
    "<div ng-if=\"imageOptions.from.type==='DockerImage'\" class=\"form-group\">\n" +
    "<label for=\"FromTypeLink\">Docker Image Repository</label>\n" +
    "<div>\n" +
    "<input class=\"form-control\" type=\"text\" ng-model=\"imageOptions.from.dockerImage\" autocorrect=\"off\" autocapitalize=\"off\" placeholder=\"example: centos/ruby-20-centos7:latest\" spellcheck=\"false\" required>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"imageOptions.from.type==='ImageStreamImage'\" class=\"form-group\">\n" +
    "<label for=\"FromTypeImage\">Image Stream Image</label>\n" +
    "<div>\n" +
    "<input class=\"form-control\" type=\"text\" ng-model=\"imageOptions.from.imageStreamImage\" placeholder=\"example: openshift/ruby-20-centos7@603bfa418\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\" required>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"form-group\" ng-if=\"project && strategyType !== 'JenkinsPipeline'\">\n" +
    "\n" +
    "<div ng-show=\"view.advancedOptions\">\n" +
    "<osc-secrets model=\"secrets.picked.pullSecret\" namespace=\"projectName\" display-type=\"pull\" type=\"image\" secrets-by-type=\"secrets.secretsByType\" service-account-to-link=\"builder\" alerts=\"alerts\">\n" +
    "</osc-secrets>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"form-group\" ng-if=\"view.advancedOptions\">\n" +
    "<div class=\"checkbox\">\n" +
    "<label>\n" +
    "<input type=\"checkbox\" ng-model=\"options.forcePull\">\n" +
    "Always pull the builder image from the docker registry, even if it is present locally\n" +
    "</label>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div>\n" +
    "<div class=\"form-group\">\n" +
    "<label for=\"buildFrom\">Push To</label>\n" +
    "<ui-select required ng-model=\"imageOptions.to.type\" search-enabled=\"false\">\n" +
    "<ui-select-match>{{$select.selected | startCase}}</ui-select-match>\n" +
    "<ui-select-choices repeat=\"type in pushToTypes\">\n" +
    "{{type | startCase}}\n" +
    "</ui-select-choices>\n" +
    "</ui-select>\n" +
    "</div>\n" +
    "<div class=\"form-group\" ng-if=\"imageOptions.to.type==='ImageStreamTag'\">\n" +
    "<istag-select model=\"imageOptions.to.imageStreamTag\" allow-custom-tag=\"true\"></istag-select>\n" +
    "</div>\n" +
    "<div ng-if=\"imageOptions.to.type==='DockerImage'\" class=\"form-group\">\n" +
    "<label for=\"pushToLink\">Docker Image Repository</label>\n" +
    "<div>\n" +
    "<input class=\"form-control\" id=\"pushToLink\" name=\"pushToLink\" type=\"text\" ng-model=\"imageOptions.to.dockerImage\" placeholder=\"example: centos/ruby-20-centos7:latest\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\" required>\n" +
    "</div>\n" +
    "</div>\n" +
    "\n" +
    "<div ng-if=\"project\">\n" +
    "\n" +
    "<div class=\"form-group\" ng-show=\"view.advancedOptions\">\n" +
    "<osc-secrets model=\"secrets.picked.pushSecret\" namespace=\"projectName\" display-type=\"push\" type=\"image\" disable-input=\"imageOptions.to.type==='None'\" service-account-to-link=\"builder\" secrets-by-type=\"secrets.secretsByType\" alerts=\"alerts\">\n" +
    "</osc-secrets>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</dl>\n" +
    "</div>\n" +
    "<div ng-if=\"!(updatedBuildConfig | isJenkinsPipelineStrategy)\" class=\"section\">\n" +
    "<h3 class=\"with-divider\">Environment Variables<span class=\"help action-inline\">\n" +
    "<a href=\"\">\n" +
    "<i class=\"pficon pficon-help\" data-toggle=\"tooltip\" aria-hidden=\"true\" data-original-title=\"Environment variables are used to configure and pass information to running containers.  These environment variables will be available during your build and at runtime.\"></i>\n" +
    "</a>\n" +
    "</span></h3>\n" +
    "<div>\n" +
    "<key-value-editor ng-if=\"envVars\" entries=\"envVars\" key-validator=\"[a-zA-Z_][a-zA-Z0-9_]*\" key-validator-error-tooltip=\"A valid environment variable name is an alphanumeric (a-z and 0-9) string beginning with a letter that may contain underscores.\" add-row-link=\"Add Environment Variable\"></key-value-editor>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"sources.git || !(updatedBuildConfig | isJenkinsPipelineStrategy)\" class=\"section\">\n" +
    "\n" +
    "<div ng-show=\"view.advancedOptions\">\n" +
    "<h3 class=\"with-divider\">Triggers\n" +
    "<a ng-href=\"{{'build-triggers' | helpLink}}\" target=\"_blank\"><span class=\"learn-more-inline\">Learn More&nbsp;<i class=\"fa fa-external-link\" aria-hidden=\"true\"></i></span></a>\n" +
    "</h3>\n" +
    "<dl class=\"dl-horizontal left\">\n" +
    "<div>\n" +
    "<div ng-if=\"sources.git\">\n" +
    "<edit-webhook-triggers type=\"GitHub\" type-info=\"The GitHub source repository must be configured to use the webhook to trigger a build when source is committed.\" triggers=\"triggers.githubWebhooks\" form=\"form\" bc-name=\"buildConfig.metadata.name\" project-name=\"project.metadata.name\">\n" +
    "</edit-webhook-triggers>\n" +
    "<edit-webhook-triggers type=\"Generic\" type-info=\"A generic webhook can be triggered by any system capable of making a web request.\" triggers=\"triggers.genericWebhooks\" form=\"form\" bc-name=\"buildConfig.metadata.name\" project-name=\"project.metadata.name\">\n" +
    "</edit-webhook-triggers>\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "<div ng-if=\"!(updatedBuildConfig | isJenkinsPipelineStrategy)\">\n" +
    "<h5>Image change</h5>\n" +
    "<div class=\"checkbox\">\n" +
    "<label>\n" +
    "<input type=\"checkbox\" ng-model=\"triggers.builderImageChangeTrigger.present\" ng-disabled=\"imageOptions.from.type === 'None'\">\n" +
    "Automatically build a new image when the builder image changes\n" +
    "<span class=\"help action-inline\">\n" +
    "<a href>\n" +
    "<i class=\"pficon pficon-help\" aria-hidden=\"true\" data-toggle=\"tooltip\" data-original-title=\"Automatically building a new image when the builder image changes allows your code to always run on the latest updates.\">\n" +
    "</i>\n" +
    "</a>\n" +
    "</span>\n" +
    "</label>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</dl>\n" +
    "</div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"section\" ng-if=\"project && !(updatedBuildConfig | isJenkinsPipelineStrategy)\">\n" +
    "\n" +
    "<div ng-show=\"view.advancedOptions\">\n" +
    "<h3 class=\"with-divider\">\n" +
    "Build Secrets\n" +
    "<a href=\"{{'source_secrets' | helpLink}}\" target=\"_blank\"><span class=\"learn-more-inline\">Learn More&nbsp;<i class=\"fa fa-external-link\" aria-hidden=\"true\"></i></span></a>\n" +
    "</h3>\n" +
    "<div class=\"form-group\">\n" +
    "<osc-source-secrets model=\"secrets.picked.sourceSecrets\" namespace=\"projectName\" secrets-by-type=\"secrets.secretsByType\" strategy-type=\"strategyType\" service-account-to-link=\"builder\" alerts=\"alerts\" display-type=\"source\" type=\"source\">\n" +
    "</osc-source-secrets>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"section mar-bottom-lg\" ng-if=\"view.advancedOptions\">\n" +
    "<h3 class=\"with-divider\">Run Policy\n" +
    "<span class=\"help action-inline\">\n" +
    "<a href=\"\">\n" +
    "<i class=\"pficon pficon-help\" data-toggle=\"tooltip\" aria-hidden=\"true\" data-original-title=\"The build run policy describes the order in which the builds created from the build configuration should run.\"></i>\n" +
    "</a>\n" +
    "</span>\n" +
    "</h3>\n" +
    "<div class=\"form-group\">\n" +
    "<label class=\"sr-only\">Run policy type</label>\n" +
    "<ui-select required ng-model=\"updatedBuildConfig.spec.runPolicy\" search-enabled=\"false\">\n" +
    "<ui-select-match>{{$select.selected | sentenceCase}}</ui-select-match>\n" +
    "<ui-select-choices repeat=\"type in runPolicyTypes\">\n" +
    "{{type | sentenceCase}}\n" +
    "</ui-select-choices>\n" +
    "</ui-select>\n" +
    "</div>\n" +
    "<div ng-switch=\"updatedBuildConfig.spec.runPolicy\">\n" +
    "<div class=\"help-block\" ng-switch-when=\"Serial\">Builds triggered from this Build Configuration will run one at the time, in the order they have been triggered.</div>\n" +
    "<div class=\"help-block\" ng-switch-when=\"Parallel\">Builds triggered from this Build Configuration will run all at the same time. The order in which they will finish is not guaranteed.</div>\n" +
    "<div class=\"help-block\" ng-switch-when=\"SerialLatestOnly\">Builds triggered from this Build Configuration will run one at the time. When a currently running build completes, the next build that will run is the latest build created. Other queued builds will be cancelled.</div>\n" +
    "<div class=\"help-block\" ng-switch-default>Builds triggered from this Build Configuration will run using the {{updatedBuildConfig.spec.runPolicy | sentenceCase}} policy.</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"!(updatedBuildConfig | isJenkinsPipelineStrategy)\" class=\"section\">\n" +
    "\n" +
    "<div ng-show=\"view.advancedOptions\">\n" +
    "<h3 class=\"with-divider\">\n" +
    "Post-Commit Hooks\n" +
    "<span class=\"help action-inline\">\n" +
    "<a href=\"{{'build-hooks' | helpLink}}\" aria-hidden=\"true\" target=\"_blank\"><span class=\"learn-more-inline\">Learn More&nbsp;<i class=\"fa fa-external-link\"></i></span></a>\n" +
    "</span>\n" +
    "</h3>\n" +
    "<div class=\"checkbox\">\n" +
    "<label>\n" +
    "<input type=\"checkbox\" ng-model=\"view.hasHooks\" aria-describedby=\"build-hooks-help\">\n" +
    "Run build hooks after image is built\n" +
    "</label>\n" +
    "<div class=\"help-block\" id=\"build-hooks-help\">\n" +
    "Build hooks allow you to run commands at the end of the build to verify the image.\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"view.hasHooks\">\n" +
    "<div class=\"form-group\">\n" +
    "<label>Hook Types</label>\n" +
    "<ui-select ng-model=\"buildHookSelection.type\" title=\"Choose a type of build hook\">\n" +
    "<ui-select-match>{{$select.selected.label}}</ui-select-match>\n" +
    "<ui-select-choices repeat=\"type in buildHookTypes\">\n" +
    "{{type.label}}\n" +
    "</ui-select-choices>\n" +
    "</ui-select>\n" +
    "</div>\n" +
    "<fieldset>\n" +
    "<div ng-if=\"buildHookSelection.type.id === 'script' || buildHookSelection.type.id === 'scriptArgs'\">\n" +
    "<label class=\"required\">Script</label>\n" +
    "<div ui-ace=\"{\n" +
    "                                  mode: 'sh',\n" +
    "                                  theme: 'eclipse',\n" +
    "                                  rendererOptions: {\n" +
    "                                    fadeFoldWidgets: true,\n" +
    "                                    showPrintMargin: false\n" +
    "                                  }\n" +
    "                                }\" ng-model=\"updatedBuildConfig.spec.postCommit.script\" required class=\"ace-bordered ace-inline\">\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"buildHookSelection.type.id === 'command' || buildHookSelection.type.id === 'commandArgs'\">\n" +
    "<label class=\"required\">Command</label>\n" +
    "<edit-command args=\"updatedBuildConfig.spec.postCommit.command\" placeholder=\"Add to command\" is-required=\"true\">\n" +
    "</edit-command>\n" +
    "</div>\n" +
    "<div ng-if=\"buildHookSelection.type.id === 'args' || buildHookSelection.type.id === 'commandArgs' || buildHookSelection.type.id === 'scriptArgs' \" ng-class=\"{ 'mar-top-lg': buildHookSelection.type.id === 'scriptArgs' }\">\n" +
    "<label class=\"required\">Arguments</label>\n" +
    "<edit-command args=\"updatedBuildConfig.spec.postCommit.args\" type=\"arguments\" description=\"getArgumentsDescription()\" is-required=\"true\">\n" +
    "</edit-command>\n" +
    "</div>\n" +
    "</fieldset>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"gutter-top\">\n" +
    "<a href=\"\" ng-click=\"view.advancedOptions = !view.advancedOptions\" role=\"button\">{{view.advancedOptions ? 'Hide' : 'Show'}} advanced options</a>\n" +
    "</div>\n" +
    "<div class=\"buttons gutter-top-bottom\">\n" +
    "<button type=\"submit\" class=\"btn btn-primary btn-lg\" ng-disabled=\"form.$invalid || form.$pristine || disableInputs\">\n" +
    "Save\n" +
    "</button>\n" +
    "<a class=\"btn btn-default btn-lg\" href=\"{{updatedBuildConfig | navigateResourceURL}}\">\n" +
    "Cancel\n" +
    "</a>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</form>\n" +
    "</fieldset>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/edit/config-map.html',
    "<default-header class=\"top-header\"></default-header>\n" +
    "<div class=\"wrap no-sidebar\">\n" +
    "<div class=\"sidebar-left collapse navbar-collapse navbar-collapse-2\">\n" +
    "<navbar-utility-mobile></navbar-utility-mobile>\n" +
    "</div>\n" +
    "<div class=\"middle surface-shaded\">\n" +
    "\n" +
    "<div class=\"middle-section\">\n" +
    "<div class=\"middle-container\">\n" +
    "<div class=\"middle-content\">\n" +
    "<div class=\"container surface-shaded\">\n" +
    "<div class=\"row\">\n" +
    "<div class=\"col-md-10 col-md-offset-1\">\n" +
    "<breadcrumbs breadcrumbs=\"breadcrumbs\"></breadcrumbs>\n" +
    "<alerts alerts=\"alerts\"></alerts>\n" +
    "<div class=\"mar-top-xl\">\n" +
    "<h1>Edit Config Map {{configMap.metadata.name}}</h1>\n" +
    "<div class=\"help-block\">\n" +
    "Config maps hold key-value pairs that can be used in pods to read application configuration.\n" +
    "</div>\n" +
    "<div class=\"mar-top-xl\">\n" +
    "<div ng-if=\"!loaded\">Loading...</div>\n" +
    "<form ng-if=\"loaded\" name=\"forms.editConfigMapForm\">\n" +
    "<div ng-if=\"resourceChanged && !resourceDeleted && !updatingNow\" class=\"alert alert-warning\">\n" +
    "<span class=\"pficon pficon-warning-triangle-o\" aria-hidden=\"true\"></span>\n" +
    "<span class=\"sr-only\">Warning:</span>\n" +
    "Config map {{configMap.metadata.name}} has changed since you started editing it. You'll need to copy any changes you've made and edit the config map again.\n" +
    "</div>\n" +
    "<div ng-if=\"resourceDeleted\" class=\"alert alert-warning\">\n" +
    "<span class=\"pficon pficon-warning-triangle-o\" aria-hidden=\"true\"></span>\n" +
    "<span class=\"sr-only\">Warning:</span>\n" +
    "Config map {[configMap.metadata.name}} has been deleted since you started editing it.\n" +
    "</div>\n" +
    "<fieldset ng-disabled=\"disableInputs\">\n" +
    "<edit-config-map model=\"configMap\"></edit-config-map>\n" +
    "<div class=\"button-group gutter-top gutter-bottom\">\n" +
    "<button type=\"submit\" class=\"btn btn-primary btn-lg\" ng-click=\"updateConfigMap()\" ng-disabled=\"forms.editConfigMapForm.$invalid || forms.editConfigMapForm.$pristine || disableInputs || resourceChanged || resourceDeleted\" value=\"\">Save</button>\n" +
    "<a class=\"btn btn-default btn-lg\" href=\"#\" back>Cancel</a>\n" +
    "</div>\n" +
    "</fieldset>\n" +
    "</form>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/edit/deployment-config.html',
    "<default-header class=\"top-header\"></default-header>\n" +
    "<div class=\"wrap no-sidebar\">\n" +
    "<div class=\"sidebar-left collapse navbar-collapse navbar-collapse-2\">\n" +
    "<navbar-utility-mobile></navbar-utility-mobile>\n" +
    "</div>\n" +
    "<div class=\"middle surface-shaded\">\n" +
    "\n" +
    "<div class=\"middle-section\" ng-show=\"deploymentConfig\">\n" +
    "<div class=\"middle-container\">\n" +
    "<div class=\"middle-content\">\n" +
    "<div class=\"container surface-shaded\">\n" +
    "<breadcrumbs breadcrumbs=\"breadcrumbs\"></breadcrumbs>\n" +
    "<alerts alerts=\"alerts\"></alerts>\n" +
    "<div ng-if=\"!loaded\">Loading...</div>\n" +
    "<div ng-if=\"loaded\">\n" +
    "<h1>\n" +
    "Edit Deployment Config {{deploymentConfig.metadata.name}}\n" +
    "</h1>\n" +
    "<fieldset ng-disabled=\"disableInputs\">\n" +
    "<form class=\"edit-form\" name=\"form\" novalidate ng-submit=\"save()\">\n" +
    "<div class=\"row\">\n" +
    "<div class=\"col-lg-12\">\n" +
    "<div class=\"section\">\n" +
    "<h3>Deployment Strategy</h3>\n" +
    "<dl class=\"dl-horizontal left\">\n" +
    "{{strategyParamsName}}\n" +
    "<div class=\"form-group strategy-name\">\n" +
    "<label class=\"picker-label\">Strategy Type</label>\n" +
    "<ui-select ng-model=\"strategyData.type\" search-enabled=\"false\" ng-change=\"strategyChanged()\">\n" +
    "<ui-select-match>{{$select.selected}}</ui-select-match>\n" +
    "<ui-select-choices repeat=\"strategyType in deploymentConfigStrategyTypes\">\n" +
    "{{strategyType}}\n" +
    "</ui-select-choices>\n" +
    "</ui-select>\n" +
    "<div>\n" +
    "<span ng-switch=\"strategyData.type\">\n" +
    "<span class=\"help-block\" ng-switch-when=\"Recreate\">\n" +
    "The recreate strategy has basic rollout behavior and supports lifecycle hooks for injecting code into the deployment process.\n" +
    "<a ng-href=\"{{'recreate_strategy' | helpLink}}\" target=\"_blank\"><span class=\"learn-more-inline\">Learn More&nbsp;<i class=\"fa fa-external-link\" aria-hidden=\"true\"></i></span></a>\n" +
    "</span>\n" +
    "<span class=\"help-block\" ng-switch-when=\"Rolling\">\n" +
    "The rolling strategy will wait for pods to pass their readiness check, scale down old components and then scale up.\n" +
    "<a ng-href=\"{{'rolling_strategy' | helpLink}}\" target=\"_blank\"><span class=\"learn-more-inline\">Learn More&nbsp;<i class=\"fa fa-external-link\" aria-hidden=\"true\"></i></span></a>\n" +
    "</span>\n" +
    "<span class=\"help-block\" ng-switch-when=\"Custom\">\n" +
    "The custom strategy allows you to specify container image that will provide your own deployment behavior.\n" +
    "<a ng-href=\"{{'custom_strategy' | helpLink}}\" target=\"_blank\"><span class=\"learn-more-inline\">Learn More&nbsp;<i class=\"fa fa-external-link\" aria-hidden=\"true\"></i></span></a>\n" +
    "</span>\n" +
    "</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"strategyData.type === 'Custom'\">\n" +
    "<div class=\"form-group\">\n" +
    "<label for=\"imageName\" class=\"required\">Image Name</label>\n" +
    "<div>\n" +
    "<input class=\"form-control\" id=\"imageName\" name=\"imageName\" ng-model=\"strategyData.customParams.image\" type=\"text\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\" aria-describedby=\"image-name-help\" required>\n" +
    "</div>\n" +
    "<div class=\"help-block\" id=\"image-name-help\">An image that can carry out the deployment.</div>\n" +
    "</div>\n" +
    "<div class=\"form-group\">\n" +
    "<label>Command</label>\n" +
    "<edit-command args=\"strategyData.customParams.command\"></edit-command>\n" +
    "</div>\n" +
    "<div class=\"form-group\">\n" +
    "<label>Environment Variables</label>\n" +
    "<key-value-editor entries=\"strategyData.customParams.environment\" key-validator=\"[a-zA-Z_][a-zA-Z0-9_]*\" key-validator-error-tooltip=\"A valid environment variable name is an alphanumeric (a-z and 0-9) string beginning with a letter that may contain underscores.\" add-row-link=\"Add Environment Variable\"></key-value-editor>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"strategyData.type !== 'Custom'\">\n" +
    "<div class=\"form-group\">\n" +
    "<label for=\"strategyTimeout\">Timeout</label>\n" +
    "<span class=\"input-group\" ng-class=\"{ 'has-error': form.strategyTimeout.$invalid && form.strategyTimeout.$touched }\">\n" +
    "<input id=\"strategyTimeout\" type=\"number\" name=\"strategyTimeout\" ng-model=\"strategyData[strategyParamsPropertyName].timeoutSeconds\" placeholder=\"600\" ng-pattern=\"/^\\d+$/\" min=\"0\" select-on-focus class=\"form-control\" aria-describedby=\"strategyTimeout\">\n" +
    "<span class=\"input-group-addon\">seconds</span>\n" +
    "</span>\n" +
    "<div class=\"help-block\" ng-attr-id=\"strategyTimeout\">\n" +
    "How long to wait for a pod to scale up before giving up.\n" +
    "</div>\n" +
    "<div ng-if=\"form.strategyTimeout.$invalid && form.strategyTimeout.$touched\" class=\"has-error\">\n" +
    "<div ng-if=\"form.strategyTimeout.$error.number\" class=\"help-block\">\n" +
    "Must be a number.\n" +
    "</div>\n" +
    "<div ng-if=\"form.strategyTimeout.$error.min\" class=\"help-block\">\n" +
    "Timeout can't be negative.\n" +
    "</div>\n" +
    "<span ng-if=\"form.strategyTimeout.$error.pattern && !form.strategyTimeout.$error.min\" class=\"help-block\">\n" +
    "Must be a whole number.\n" +
    "</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"strategyData.type === 'Rolling'\">\n" +
    "\n" +
    "<div ng-show=\"view.advancedStrategyOptions\">\n" +
    "<div class=\"form-group\">\n" +
    "<label for=\"updatePeriod\">Update Period</label>\n" +
    "<span class=\"input-group\" ng-class=\"{ 'has-error': form.updatePeriod.$invalid && form.updatePeriod.$touched }\">\n" +
    "<input id=\"updatePeriod\" type=\"number\" placeholder=\"1\" name=\"updatePeriod\" ng-model=\"strategyData[strategyParamsPropertyName].updatePeriodSeconds\" ng-pattern=\"/^\\d+$/\" min=\"0\" select-on-focus class=\"form-control\" aria-describedby=\"updatePeriod\">\n" +
    "<span class=\"input-group-addon\">seconds</span>\n" +
    "</span>\n" +
    "<div class=\"help-block\" id=\"updatePeriod\">\n" +
    "Time to wait between retrying to run individual pod.\n" +
    "</div>\n" +
    "<div ng-if=\"form.updatePeriod.$invalid && form.updatePeriod.$touched\" class=\"has-error\">\n" +
    "<div ng-if=\"form.updatePeriod.$error.number\" class=\"help-block\">\n" +
    "Must be a number.\n" +
    "</div>\n" +
    "<div ng-if=\"form.updatePeriod.$error.min\" class=\"help-block\">\n" +
    "Update period can't be negative.\n" +
    "</div>\n" +
    "<span ng-if=\"form.updatePeriod.$error.pattern && !form.updatePeriod.$error.min\" class=\"help-block\">\n" +
    "Must be a whole number.\n" +
    "</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"form-group\">\n" +
    "<label for=\"interval\">Interval</label>\n" +
    "<span class=\"input-group\" ng-class=\"{ 'has-error': form.interval.$invalid && form.interval.$touched }\">\n" +
    "<input id=\"interval\" type=\"number\" placeholder=\"1\" name=\"interval\" ng-model=\"strategyData[strategyParamsPropertyName].intervalSeconds\" ng-pattern=\"/^\\d+$/\" min=\"0\" select-on-focus class=\"form-control\" aria-describedby=\"interval\">\n" +
    "<span class=\"input-group-addon\">seconds</span>\n" +
    "</span>\n" +
    "<div class=\"help-block\" ng-attr-id=\"interval\">\n" +
    "Time to wait between polling deployment status after running a pod.\n" +
    "</div>\n" +
    "<div ng-if=\"form.interval.$invalid && form.interval.$touched\" class=\"has-error\">\n" +
    "<div ng-if=\"form.interval.$error.number\" class=\"help-block\">\n" +
    "Must be a number.\n" +
    "</div>\n" +
    "<div ng-if=\"form.interval.$error.min\" class=\"help-block\">\n" +
    "Interval can't be negative.\n" +
    "</div>\n" +
    "<span ng-if=\"form.interval.$error.pattern && !form.interval.$error.min\" class=\"help-block\">\n" +
    "Must be a whole number.\n" +
    "</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"form-group\">\n" +
    "<label for=\"maxUnavailable\">Maximum Number of Unavailable Pods</label>\n" +
    "<div ng-class=\"{ 'has-error': form.maxUnavailable.$invalid && form.maxUnavailable.$touched }\">\n" +
    "<input id=\"maxUnavailable\" type=\"text\" placeholder=\"25%\" name=\"maxUnavailable\" ng-model=\"strategyData[strategyParamsPropertyName].maxUnavailable\" ng-pattern=\"/^\\d+%?$/\" select-on-focus class=\"form-control\" aria-describedby=\"max-unavailable-help\">\n" +
    "</div>\n" +
    "<div class=\"help-block\">\n" +
    "The maximum number of pods that can be unavailable during the rolling deployment. This can be either a percentage (10%) or a whole number (1).\n" +
    "</div>\n" +
    "<div ng-if=\"form.maxUnavailable.$invalid && form.maxUnavailable.$touched && form.maxUnavailable.$error.pattern\" class=\"has-error\">\n" +
    "<span class=\"help-block\">\n" +
    "Must be a non-negative whole number or percentage.\n" +
    "</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"form-group\">\n" +
    "<label for=\"maxSurge\">Maximum Number of Surge Pods</label>\n" +
    "<div ng-class=\"{ 'has-error': form.maxSurge.$invalid && form.maxSurge.$touched }\">\n" +
    "<input id=\"maxSurge\" type=\"text\" placeholder=\"25%\" name=\"maxSurge\" ng-model=\"strategyData[strategyParamsPropertyName].maxSurge\" ng-pattern=\"/^\\d+%?$/\" select-on-focus class=\"form-control\" aria-describedby=\"maxSurge\">\n" +
    "</div>\n" +
    "<div class=\"help-block\">\n" +
    "The maximum number of pods that can be scheduled above the original number of pods while the rolling deployment is in progress. This can be either a percentage (10%) or a whole number (1).\n" +
    "</div>\n" +
    "<div ng-if=\"form.maxSurge.$invalid && form.maxSurge.$touched && form.maxSurge.$error.pattern\" class=\"has-error\">\n" +
    "<span class=\"help-block\">\n" +
    "Must be a non-negative whole number or percentage.\n" +
    "</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "\n" +
    "<div ng-show=\"view.advancedStrategyOptions\">\n" +
    "<div class=\"lifecycle-hooks\">\n" +
    "<div class=\"lifecycle-hook\" id=\"pre-lifecycle-hook\">\n" +
    "<h3>Pre Lifecycle Hook</h3>\n" +
    "<edit-lifecycle-hook model=\"strategyData[strategyParamsPropertyName].pre\" type=\"pre\" available-volumes=\"volumeNames\" available-containers=\"containerNames\" namespace=\"projectName\">\n" +
    "</edit-lifecycle-hook>\n" +
    "</div>\n" +
    "<div ng-if=\"strategyData.type !== 'Rolling'\" class=\"lifecycle-hook\" id=\"mid-lifecycle-hook\">\n" +
    "<h3>Mid Lifecycle Hook</h3>\n" +
    "<edit-lifecycle-hook model=\"strategyData[strategyParamsPropertyName].mid\" type=\"mid\" available-volumes=\"volumeNames\" available-containers=\"containerNames\" namespace=\"projectName\">\n" +
    "</edit-lifecycle-hook>\n" +
    "</div>\n" +
    "<div class=\"lifecycle-hook\" id=\"post-lifecycle-hook\">\n" +
    "<h3>Post Lifecycle Hook</h3>\n" +
    "<edit-lifecycle-hook model=\"strategyData[strategyParamsPropertyName].post\" type=\"post\" available-volumes=\"volumeNames\" available-containers=\"containerNames\" namespace=\"projectName\">\n" +
    "</edit-lifecycle-hook>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"mar-top-lg\" ng-if=\"strategyData.type !== 'Custom'\">\n" +
    "<div ng-if=\"!view.advancedStrategyOptions\">To set additional parameters or edit lifecycle hooks, view <a href=\"\" ng-click=\"view.advancedStrategyOptions = true\">advanced strategy options.</a></div>\n" +
    "<a ng-if=\"view.advancedStrategyOptions\" href=\"\" ng-click=\"view.advancedStrategyOptions = false\">Hide Advanced Strategy Options</a>\n" +
    "</div>\n" +
    "</dl>\n" +
    "</div>\n" +
    "<div class=\"section\">\n" +
    "<h3 class=\"with-divider\">Images</h3>\n" +
    "<dl class=\"dl-horizontal left\">\n" +
    "<div ng-repeat=\"(containerName, containerConfig) in containerConfigByName\">\n" +
    "<div class=\"container-name\">\n" +
    "<h4>Container {{containerName}}</h4>\n" +
    "</div>\n" +
    "<div class=\"checkbox form-group\">\n" +
    "<label>\n" +
    "<input type=\"checkbox\" ng-model=\"containerConfig.hasDeploymentTrigger\">\n" +
    "Deploy images from an image stream tag\n" +
    "</label>\n" +
    "</div>\n" +
    "<div ng-if=\"containerConfig.hasDeploymentTrigger\">\n" +
    "<label class=\"required\">Image Stream Tag</label>\n" +
    "<istag-select model=\"containerConfig.triggerData.istag\" select-disabled=\"disableInputs\" include-shared-namespace=\"true\"></istag-select>\n" +
    "<div class=\"checkbox form-group\">\n" +
    "<label>\n" +
    "<input type=\"checkbox\" ng-model=\"containerConfig.triggerData.automatic\">\n" +
    "Automatically start a new deployment when the image changes\n" +
    "</label>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"!containerConfig.hasDeploymentTrigger\" class=\"form-group\">\n" +
    "<label for=\"imageName\" class=\"required\">Image Name</label>\n" +
    "<input class=\"form-control\" id=\"imageName\" name=\"imageName\" ng-model=\"containerConfig.image\" type=\"text\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\" required>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"checkbox form-group\">\n" +
    "<label>\n" +
    "<input type=\"checkbox\" ng-model=\"triggers.hasConfigTrigger\">\n" +
    "Automatically start a new deployment when the deployment configuration changes\n" +
    "</label>\n" +
    "</div>\n" +
    "\n" +
    "<div ng-show=\"view.advancedImageOptions\">\n" +
    "<div class=\"mar-top-lg\">\n" +
    "<osc-secrets model=\"secrets.pullSecrets\" namespace=\"projectName\" display-type=\"pull\" type=\"image\" secrets-by-type=\"secretsByType\" service-account-to-link=\"default\" alerts=\"alerts\" allow-multiple-secrets=\"true\">\n" +
    "</osc-secrets>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"mar-top-lg\">\n" +
    "<div ng-if=\"!view.advancedImageOptions\">To set secrets for pulling your images from private image registries, view <a href=\"\" ng-click=\"view.advancedImageOptions = true\">advanced image options.</a></div>\n" +
    "<a ng-if=\"view.advancedImageOptions\" href=\"\" ng-click=\"view.advancedImageOptions = false\">Hide Advanced Image Options</a>\n" +
    "</div>\n" +
    "</dl>\n" +
    "</div>\n" +
    "<div class=\"section\">\n" +
    "<h3 class=\"with-divider\">Environment Variables</h3>\n" +
    "<div ng-repeat=\"(containerName, containerConfig) in containerConfigByName\">\n" +
    "<div class=\"container-name\">\n" +
    "<h4>Container {{containerName}}</h4>\n" +
    "</div>\n" +
    "<key-value-editor ng-if=\"containerConfig\" entries=\"containerConfig.env\" key-validator=\"[a-zA-Z_][a-zA-Z0-9_]*\" key-validator-error-tooltip=\"A valid environment variable name is an alphanumeric (a-z and 0-9) string beginning with a letter that may contain underscores.\" add-row-link=\"Add Environment Variable\"></key-value-editor>\n" +
    "</div>\n" +
    "</div>\n" +
    "<pause-rollouts-checkbox deployment=\"updatedDeploymentConfig\" always-visible=\"true\">\n" +
    "</pause-rollouts-checkbox>\n" +
    "<div class=\"buttons gutter-top-bottom\">\n" +
    "<button type=\"submit\" class=\"btn btn-primary btn-lg\" ng-disabled=\"form.$invalid || form.$pristine || disableInputs\">\n" +
    "Save\n" +
    "</button>\n" +
    "<a class=\"btn btn-default btn-lg\" href=\"{{updatedDeploymentConfig | navigateResourceURL}}\">\n" +
    "Cancel\n" +
    "</a>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</form>\n" +
    "</fieldset>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/edit/health-checks.html',
    "<default-header class=\"top-header\"></default-header>\n" +
    "<div class=\"wrap no-sidebar\">\n" +
    "<div class=\"sidebar-left collapse navbar-collapse navbar-collapse-2\">\n" +
    "<navbar-utility-mobile></navbar-utility-mobile>\n" +
    "</div>\n" +
    "<div class=\"middle surface-shaded\">\n" +
    "\n" +
    "<div class=\"middle-section\">\n" +
    "<div class=\"middle-container\">\n" +
    "<div class=\"middle-content\">\n" +
    "<div class=\"container surface-shaded\">\n" +
    "<breadcrumbs breadcrumbs=\"breadcrumbs\"></breadcrumbs>\n" +
    "<div class=\"row\">\n" +
    "<div class=\"col-md-12\">\n" +
    "<alerts alerts=\"alerts\"></alerts>\n" +
    "<div ng-show=\"!containers.length\" class=\"mar-top-md\">Loading...</div>\n" +
    "<form ng-show=\"containers.length\" name=\"form\" class=\"health-checks-form\">\n" +
    "<h1>Health Checks: {{name}}</h1>\n" +
    "<div class=\"help-block\">\n" +
    "Container health is periodically checked using readiness and liveness probes.\n" +
    "<div class=\"learn-more-block\">\n" +
    "<a href=\"{{'application_health' | helpLink}}\" target=\"_blank\">Learn More&nbsp;<i class=\"fa fa-external-link\" aria-hidden=\"true\"></i></a>\n" +
    "</div>\n" +
    "</div>\n" +
    "<fieldset ng-disabled=\"disableInputs\">\n" +
    "<div ng-repeat=\"container in containers\">\n" +
    "<h2 ng-if=\"containers.length > 1\">Container {{container.name}}</h2>\n" +
    "<h3>Readiness Probe</h3>\n" +
    "<div class=\"help-block mar-bottom-md\" ng-if=\"$first\">\n" +
    "A readiness probe checks if the container is ready to handle requests. A failed readiness probe means that a container should not receive any traffic from a proxy, even if it's running.\n" +
    "</div>\n" +
    "<div ng-if=\"!container.readinessProbe\">\n" +
    "<a href=\"\" ng-click=\"addProbe(container, 'readinessProbe')\">Add Readiness Probe</a>\n" +
    "</div>\n" +
    "<div ng-if=\"container.readinessProbe\">\n" +
    "<edit-probe probe=\"container.readinessProbe\" exposed-ports=\"container.ports\" ng-if=\"container.readinessProbe\">\n" +
    "</edit-probe>\n" +
    "<p>\n" +
    "<a href=\"\" ng-click=\"removeProbe(container, 'readinessProbe')\">Remove Readiness Probe</a>\n" +
    "</p>\n" +
    "</div>\n" +
    "<h3>Liveness Probe</h3>\n" +
    "<div class=\"help-block mar-bottom-md\" ng-if=\"$first\">\n" +
    "A liveness probe checks if the container is still running. If the liveness probe fails, the container is killed.\n" +
    "</div>\n" +
    "<div ng-if=\"!container.livenessProbe\">\n" +
    "<a href=\"\" ng-click=\"addProbe(container, 'livenessProbe')\">Add Liveness Probe</a>\n" +
    "</div>\n" +
    "<div ng-if=\"container.livenessProbe\">\n" +
    "<edit-probe probe=\"container.livenessProbe\" exposed-ports=\"container.ports\">\n" +
    "</edit-probe>\n" +
    "<p>\n" +
    "<a href=\"\" ng-click=\"removeProbe(container, 'livenessProbe')\">Remove Liveness Probe</a>\n" +
    "</p>\n" +
    "</div>\n" +
    "</div>\n" +
    "<pause-rollouts-checkbox ng-if=\"object | managesRollouts\" deployment=\"object\">\n" +
    "</pause-rollouts-checkbox>\n" +
    "<div class=\"button-group gutter-top gutter-bottom\">\n" +
    "<button type=\"submit\" class=\"btn btn-primary btn-lg\" ng-click=\"save()\" ng-disabled=\"form.$invalid || form.$pristine || disableInputs\" value=\"\">Save</button>\n" +
    "<a class=\"btn btn-default btn-lg\" ng-href=\"{{resourceURL}}\">Cancel</a>\n" +
    "</div>\n" +
    "</fieldset>\n" +
    "</form>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/edit/jenkinsfile-examples.html',
    "<div class=\"jenkinsfile-examples\">\n" +
    "<p>\n" +
    "A Jenkinsfile is a Groovy script that defines your pipeline. In the Jenkinsfile, you can declare pipeline stages and run one or more steps within each stage. Here are some examples you can use in your pipelines.\n" +
    "</p>\n" +
    "<p>\n" +
    "Run an OpenShift build and deployment:\n" +
    "<copy-to-clipboard display-wide=\"true\" clipboard-text=\"'node {\n" +
    "  stage(\\'Build\\') {\n" +
    "    openshiftBuild(buildConfig: \\'my-build-config\\', showBuildLogs: \\'true\\')\n" +
    "  }\n" +
    "  stage(\\'Deploy\\') {\n" +
    "    openshiftDeploy(deploymentConfig: \\'my-deployment-config\\')\n" +
    "  }\n" +
    "}\n" +
    "'\" multiline=\"true\">\n" +
    "</copy-to-clipboard>\n" +
    "</p>\n" +
    "<p>\n" +
    "Checkout source code and run shell commands on a node labelled <var>maven:</var>\n" +
    "<copy-to-clipboard display-wide=\"true\" clipboard-text=\"'node(\\'maven\\') {\n" +
    "  stage(\\'Checkout\\') {\n" +
    "    checkout scm\n" +
    "  }\n" +
    "  stage(\\'Build\\') {\n" +
    "    sh \\'mvn install\\'\n" +
    "  }\n" +
    "  stage(\\'Unit Test\\') {\n" +
    "    sh \\'mvn test\\'\n" +
    "  }\n" +
    "}\n" +
    "'\" multiline=\"true\">\n" +
    "</copy-to-clipboard>\n" +
    "</p>\n" +
    "<p>\n" +
    "Prompt for manual input:\n" +
    "<copy-to-clipboard display-wide=\"true\" clipboard-text=\"'node {\n" +
    "  stage(\\'Approve\\') {\n" +
    "    input \\'Promote to production?\\'\n" +
    "  }\n" +
    "}\n" +
    "'\" multiline=\"true\">\n" +
    "</copy-to-clipboard>\n" +
    "</p>\n" +
    "<p>\n" +
    "Learn more about\n" +
    "<a ng-href=\"{{ 'pipeline-builds' | helpLink}}\" target=\"_blank\">Pipeline Builds</a>\n" +
    "and the\n" +
    "<a ng-href=\"{{ 'pipeline-plugin' | helpLink}}\" target=\"_blank\">OpenShift Pipeline Plugin</a>.\n" +
    "</p>\n" +
    "</div>"
  );


  $templateCache.put('views/edit/project.html',
    "<default-header class=\"top-header\"></default-header>\n" +
    "<div class=\"wrap no-sidebar\">\n" +
    "<div class=\"sidebar-left collapse navbar-collapse navbar-collapse-2\">\n" +
    "<navbar-utility-mobile></navbar-utility-mobile>\n" +
    "</div>\n" +
    "<div class=\"middle surface-shaded\">\n" +
    "\n" +
    "<div class=\"middle-section\">\n" +
    "<div class=\"middle-container\">\n" +
    "<div class=\"middle-content\">\n" +
    "<div class=\"container surface-shaded gutter-top\">\n" +
    "<div class=\"col-md-12\">\n" +
    "<h1 style=\"margin-bottom: 5px\">Edit Project {{project.metadata.name}}</h1>\n" +
    "<div class=\"help-block mar-bottom-lg\">Update the display name and description of your project. The project's unique name cannot be modified.</div>\n" +
    "<alerts alerts=\"alerts\"></alerts>\n" +
    "<form name=\"editProjectForm\">\n" +
    "<fieldset ng-disabled=\"disableInputs\">\n" +
    "<div class=\"form-group\">\n" +
    "<label for=\"displayName\">Display Name</label>\n" +
    "<input class=\"form-control input-lg\" name=\"displayName\" id=\"displayName\" placeholder=\"My Project\" type=\"text\" ng-model=\"editableFields.displayName\">\n" +
    "</div>\n" +
    "<div class=\"form-group\">\n" +
    "<label for=\"description\">Description</label>\n" +
    "<textarea class=\"form-control input-lg\" name=\"description\" id=\"description\" placeholder=\"A short description.\" ng-model=\"editableFields.description\"></textarea>\n" +
    "</div>\n" +
    "<div class=\"button-group\">\n" +
    "<button type=\"submit\" class=\"btn btn-primary btn-lg\" ng-click=\"update()\" ng-disabled=\"editProjectForm.$invalid || disableInputs\" value=\"\">Save</button>\n" +
    "<a class=\"btn btn-default btn-lg\" href=\"#\" back>Cancel</a>\n" +
    "</div>\n" +
    "</fieldset>\n" +
    "</form>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/edit/route.html',
    "<default-header class=\"top-header\"></default-header>\n" +
    "<div class=\"wrap no-sidebar\">\n" +
    "<div class=\"sidebar-left collapse navbar-collapse navbar-collapse-2\">\n" +
    "<navbar-utility-mobile></navbar-utility-mobile>\n" +
    "</div>\n" +
    "<div class=\"middle surface-shaded\">\n" +
    "\n" +
    "<div class=\"middle-section\">\n" +
    "<div class=\"middle-container\">\n" +
    "<div class=\"middle-content\">\n" +
    "<div class=\"container surface-shaded\">\n" +
    "<div class=\"col-md-10 col-md-offset-1\">\n" +
    "<breadcrumbs breadcrumbs=\"breadcrumbs\"></breadcrumbs>\n" +
    "<alerts alerts=\"alerts\"></alerts>\n" +
    "<h1>Edit Route {{routeName}}</h1>\n" +
    "<div ng-if=\"loading\">\n" +
    "Loading...\n" +
    "</div>\n" +
    "<form name=\"form\">\n" +
    "<fieldset ng-disabled=\"disableInputs\" ng-if=\"!loading\">\n" +
    "<osc-routing model=\"routing\" services=\"services\" show-name-input=\"false\" host-read-only=\"true\">\n" +
    "</osc-routing>\n" +
    "<div class=\"button-group gutter-top gutter-bottom\">\n" +
    "<button type=\"submit\" class=\"btn btn-primary btn-lg\" ng-click=\"updateRoute()\" ng-disabled=\"form.$invalid || disableInputs\" value=\"\">Save</button>\n" +
    "<a class=\"btn btn-default btn-lg\" ng-href=\"{{routeURL}}\">Cancel</a>\n" +
    "</div>\n" +
    "</fieldset>\n" +
    "</form>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/edit/yaml.html',
    "<default-header class=\"top-header\"></default-header>\n" +
    "<div class=\"wrap no-sidebar\">\n" +
    "<div class=\"sidebar-left collapse navbar-collapse navbar-collapse-2\">\n" +
    "<navbar-utility-mobile></navbar-utility-mobile>\n" +
    "</div>\n" +
    "<div class=\"middle surface-shaded edit-yaml\">\n" +
    "\n" +
    "<div class=\"middle-section\">\n" +
    "<div class=\"middle-container\">\n" +
    "<div class=\"middle-content\">\n" +
    "<div class=\"container surface-shaded\">\n" +
    "<breadcrumbs breadcrumbs=\"breadcrumbs\"></breadcrumbs>\n" +
    "<alerts alerts=\"alerts\"></alerts>\n" +
    "<div ng-if=\"!resource\" class=\"pad-top-md\">Loading...</div>\n" +
    "<div ng-if=\"resource\" class=\"pad-top-md\">\n" +
    "<h1 class=\"truncate\">Edit <span class=\"hidden-xs\">{{resource.kind | humanizeKind : true}}</span> {{resource.metadata.name}}</h1>\n" +
    "<parse-error error=\"error\" ng-if=\"error\"></parse-error>\n" +
    "<div ng-if=\"resourceChanged && !resourceDeleted && !updatingNow\" class=\"alert alert-warning\">\n" +
    "<span class=\"pficon pficon-warning-triangle-o\" aria-hidden=\"true\"></span>\n" +
    "<span class=\"sr-only\">Warning:</span>\n" +
    "{{resource.kind | humanizeKind | upperFirst}} <strong>{{resource.metadata.name}}</strong> has changed since you started editing it. You'll need to copy any changes you've made and edit the {{resource.kind | humanizeKind}} again.\n" +
    "</div>\n" +
    "<div ng-if=\"resourceDeleted\" class=\"alert alert-warning\">\n" +
    "<span class=\"pficon pficon-warning-triangle-o\" aria-hidden=\"true\"></span>\n" +
    "<span class=\"sr-only\">Warning:</span>\n" +
    "{{resource.kind | humanizeKind | upperFirst}} <strong>{{resource.metadata.name}}</strong> has been deleted since you started editing it.\n" +
    "</div>\n" +
    "\n" +
    "<div ui-ace=\"{\n" +
    "                mode: 'yaml',\n" +
    "                theme: 'eclipse',\n" +
    "                onLoad: aceLoaded,\n" +
    "                rendererOptions: {\n" +
    "                  showPrintMargin: false\n" +
    "                }\n" +
    "              }\" ng-model=\"editor.model\" class=\"editor ace-bordered yaml-mode\"></div>\n" +
    "<div class=\"button-group mar-top-xl\">\n" +
    "<button class=\"btn btn-lg btn-primary\" type=\"button\" ng-click=\"save()\" ng-disabled=\"!modified || resourceChanged || resourceDeleted || updatingNow\">Save</button>\n" +
    "<button class=\"btn btn-lg btn-default\" type=\"button\" ng-disabled=\"updatingNow\" ng-click=\"cancel()\">Cancel</button>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/events.html',
    "<project-header class=\"top-header\"></project-header>\n" +
    "<project-page>\n" +
    "\n" +
    "<div class=\"middle-section\">\n" +
    "<div class=\"middle-container\">\n" +
    "<div class=\"middle-header\">\n" +
    "<div class=\"container-fluid\">\n" +
    "<breadcrumbs breadcrumbs=\"breadcrumbs\"></breadcrumbs>\n" +
    "<div class=\"page-header page-header-bleed-right page-header-bleed-left\">\n" +
    "<h1>Events</h1>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"middle-content\">\n" +
    "<div class=\"container-fluid\">\n" +
    "<alerts alerts=\"alerts\"></alerts>\n" +
    "<div class=\"row\">\n" +
    "<div class=\"col-md-12\" ng-if=\"projectContext\">\n" +
    "<events project-context=\"projectContext\" ng-if=\"projectContext\"></events>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</project-page>"
  );


  $templateCache.put('views/images.html',
    "<project-header class=\"top-header\"></project-header>\n" +
    "<project-page>\n" +
    "\n" +
    "<div class=\"middle-section\">\n" +
    "<div class=\"middle-container\">\n" +
    "<div class=\"middle-header header-toolbar\">\n" +
    "<div class=\"container-fluid\">\n" +
    "<div class=\"page-header page-header-bleed-right page-header-bleed-left\">\n" +
    "<h1>\n" +
    "Image Streams\n" +
    "<span class=\"page-header-link\">\n" +
    "<a ng-href=\"{{'image-streams' | helpLink}}\" target=\"_blank\">\n" +
    "Learn More <i class=\"fa fa-external-link\" aria-hidden=\"true\"></i>\n" +
    "</a>\n" +
    "</span>\n" +
    "</h1>\n" +
    "</div>\n" +
    "<div class=\"data-toolbar\">\n" +
    "<div class=\"data-toolbar-filter\">\n" +
    "<project-filter></project-filter>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"middle-content\">\n" +
    "<div class=\"container-fluid\">\n" +
    "<alerts alerts=\"alerts\"></alerts>\n" +
    "<div class=\"row\">\n" +
    "<div class=\"col-md-12\">\n" +
    "<table class=\"table table-bordered table-hover table-mobile table-layout-fixed\">\n" +
    "<colgroup>\n" +
    "<col class=\"col-sm-3\">\n" +
    "<col class=\"col-sm-5\">\n" +
    "<col class=\"col-sm-2\">\n" +
    "<col class=\"col-sm-2\">\n" +
    "</colgroup>\n" +
    "<thead>\n" +
    "<tr>\n" +
    "<th>Name</th>\n" +
    "<th>Docker Repo</th>\n" +
    "<th>Tags</th>\n" +
    "<th>Updated</th>\n" +
    "</tr>\n" +
    "</thead>\n" +
    "<tbody ng-if=\"(imageStreams | hashSize) == 0\">\n" +
    "<tr><td colspan=\"4\"><em>{{emptyMessage}}</em></td></tr>\n" +
    "</tbody>\n" +
    "<tbody ng-if=\"(imageStreams | hashSize) > 0\">\n" +
    "<tr ng-repeat=\"imageStream in imageStreams | orderObjectsByDate : true\">\n" +
    "<td data-title=\"Name\"><a href=\"{{imageStream | navigateResourceURL}}\">{{imageStream.metadata.name}}</a></td>\n" +
    "<td data-title=\"Docker Repo\">\n" +
    "<span ng-if=\"!imageStream.status.dockerImageRepository && !imageStream.spec.dockerImageRepository\"><em>unknown</em></span>\n" +
    "<span ng-if=\"imageStream.status.dockerImageRepository || imageStream.spec.dockerImageRepository\">{{imageStream.status.dockerImageRepository || imageStream.spec.dockerImageRepository}}</span>\n" +
    "</td>\n" +
    "<td data-title=\"Tags\">\n" +
    "<span ng-if=\"!imageStream.status.tags.length\"><em>none</em></span>\n" +
    "<span ng-repeat=\"tag in imageStream.status.tags | limitTo: 4\">{{tag.tag}}<span ng-if=\"!$last\">,\n" +
    "</span></span><span ng-if=\"imageStream.status.tags.length === 5\">, {{imageStream.status.tags[4].tag}}</span><span ng-if=\"imageStream.status.tags.length > 5\">, and {{imageStream.status.tags.length - 4}} others</span>\n" +
    "</td>\n" +
    "<td data-title=\"Updated\"><span am-time-ago=\"imageStream | imageStreamLastUpdated\"></span></td>\n" +
    "</tr>\n" +
    "</tbody>\n" +
    "</table>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</project-page>"
  );


  $templateCache.put('views/logs/chromeless-build-log.html',
    "<default-header class=\"top-header\"></default-header>\n" +
    "<div class=\"sidebar-left collapse navbar-collapse navbar-collapse-2\">\n" +
    "<navbar-utility-mobile></navbar-utility-mobile>\n" +
    "</div>\n" +
    "<div class=\"wrap chromeless\">\n" +
    "\n" +
    "<div id=\"container-main\" class=\"middle\">\n" +
    "<div class=\"middle-section\">\n" +
    "<div class=\"middle-container\">\n" +
    "<div class=\"middle-header\">\n" +
    "<div class=\"container-fluid\">\n" +
    "<alerts alerts=\"alerts\"></alerts>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"middle-content\">\n" +
    "<log-viewer ng-if=\"build\" object=\"build\" context=\"projectContext\" status=\"build.status.phase\" time-start=\"build.status.startTimestamp | date : 'medium'\" time-end=\"build.status.completionTimestamp | date : 'medium'\" chromeless=\"true\" run=\"logCanRun\" flex>\n" +
    "</log-viewer>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/logs/chromeless-deployment-log.html',
    "<default-header class=\"top-header\"></default-header>\n" +
    "<div class=\"sidebar-left collapse navbar-collapse navbar-collapse-2\">\n" +
    "<navbar-utility-mobile></navbar-utility-mobile>\n" +
    "</div>\n" +
    "<div class=\"wrap chromeless\">\n" +
    "\n" +
    "<div id=\"container-main\" class=\"middle\">\n" +
    "<div class=\"middle-section\">\n" +
    "<div class=\"middle-container\">\n" +
    "<div class=\"middle-header\">\n" +
    "<div class=\"container-fluid\">\n" +
    "<alerts alerts=\"alerts\"></alerts>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"middle-content\">\n" +
    "<log-viewer ng-if=\"deploymentConfigName && logOptions.version\" object=\"replicaSet\" context=\"projectContext\" options=\"logOptions\" chromeless=\"true\" run=\"logCanRun\" flex>\n" +
    "</log-viewer>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/logs/chromeless-pod-log.html',
    "<default-header class=\"top-header\"></default-header>\n" +
    "<div class=\"sidebar-left collapse navbar-collapse navbar-collapse-2\">\n" +
    "<navbar-utility-mobile></navbar-utility-mobile>\n" +
    "</div>\n" +
    "<div class=\"wrap chromeless\">\n" +
    "\n" +
    "<div id=\"container-main\" class=\"middle\">\n" +
    "<div class=\"middle-section\">\n" +
    "<div class=\"middle-container\">\n" +
    "<div class=\"middle-header\">\n" +
    "<div class=\"container-fluid\">\n" +
    "<alerts alerts=\"alerts\"></alerts>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"middle-content\">\n" +
    "<log-viewer ng-if=\"pod\" object=\"pod\" context=\"projectContext\" options=\"logOptions\" status=\"pod.status.phase\" time-start=\"pod.status.startTime | date : 'medium'\" chromeless=\"true\" run=\"logCanRun\" flex>\n" +
    "</log-viewer>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/logs/textonly_log.html',
    " <log-viewer logs=\"logs\" loading=\"logsLoading\"></log-viewer>"
  );


  $templateCache.put('views/membership.html',
    "<project-header class=\"top-header\"></project-header>\n" +
    "<project-page class=\"membership\" ng-if=\"project\">\n" +
    "<div class=\"middle-section\">\n" +
    "<div class=\"middle-container\">\n" +
    "<div class=\"middle-header\">\n" +
    "<div class=\"container-fluid\">\n" +
    "<div class=\"page-header page-header-bleed-right page-header-bleed-left\">\n" +
    "<h1>\n" +
    "<a class=\"pull-right btn btn-default\" href=\"\" ng-if=\"canUpdateRolebindings\" ng-click=\"toggleEditMode()\">\n" +
    "<span ng-if=\"!(mode.edit)\">Edit Membership</span>\n" +
    "<span ng-if=\"mode.edit\">Done Editing</span>\n" +
    "</a>\n" +
    "Membership\n" +
    "<span class=\"page-header-link\">\n" +
    "<a ng-href=\"{{'roles' | helpLink}}\" target=\"_blank\">\n" +
    "Learn More <i class=\"fa fa-external-link\" aria-hidden=\"true\"></i>\n" +
    "</a>\n" +
    "</span>\n" +
    "</h1>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"middle-content\" persist-tab-state>\n" +
    "<div class=\"container-fluid\">\n" +
    "<alerts alerts=\"alerts\"></alerts>\n" +
    "<div class=\"row\">\n" +
    "<div class=\"col-md-12\">\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"!('rolebindings' | canI : 'list')\">\n" +
    "<p>You do not have permission to view roles in this project.</p>\n" +
    "</div>\n" +
    "<uib-tabset ng-if=\"'rolebindings' | canI : 'list'\">\n" +
    "<uib-tab ng-repeat=\"subjectKind in subjectKindsForUI | orderBy: 'sortOrder'\" active=\"selectedTab[subjectKind.name]\" select=\"selectTab(subjectKind.name)\">\n" +
    "<uib-tab-heading>\n" +
    "{{subjectKind.name | startCase}}s&nbsp;({{subjectKind.subjects | hashSize}})\n" +
    "</uib-tab-heading>\n" +
    "<div ng-if=\"subjectKind.description\">\n" +
    "<p>\n" +
    "{{subjectKind.description}}\n" +
    "<a ng-if=\"subjectKind.helpLinkKey\" target=\"_blank\" ng-href=\"{{subjectKind.helpLinkKey | helpLink}}\" class=\"learn-more-inline\">\n" +
    "Learn More <i class=\"fa fa-external-link\" aria-hidden=\"true\"></i>\n" +
    "</a>\n" +
    "</p>\n" +
    "</div>\n" +
    "<div column class=\"content-pane\" ng-class=\"'content-' + subjectKind.name.toLowerCase()\">\n" +
    "<div class=\"col-heading item-row\" row mobile=\"column\" flex-collapse-fix>\n" +
    "<div class=\"col-name\" flex conceal=\"mobile\" ng-class=\"{ 'half-width': !mode.edit }\">\n" +
    "<h3>Name</h3>\n" +
    "</div>\n" +
    "<div class=\"col-roles\" flex conceal=\"mobile\">\n" +
    "<h3>Roles</h3>\n" +
    "</div>\n" +
    "<div ng-if=\"mode.edit\" class=\"col-add-role\" conceal=\"tablet\" flex-collapse-fix>\n" +
    "<h3>\n" +
    "Add Another Role\n" +
    "</h3>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"(subjectKind.subjects | hashSize) === 0\">\n" +
    "<p>\n" +
    "<em>There are no {{ subjectKind.name | humanizeKind }}s with access to this project.</em>\n" +
    "</p>\n" +
    "</div>\n" +
    "<div ng-repeat=\"subject in subjectKind.subjects\" class=\"item-row highlight-hover\" row mobile=\"column\">\n" +
    "<div class=\"col-name\" row flex cross-axis=\"center\" ng-class=\"{ 'half-width': !mode.edit }\">\n" +
    "<a ng-if=\"subject.namespace\" target=\"_blank\" ng-href=\"project/{{project.metadata.name}}/browse/other?kind=ServiceAccount\">\n" +
    "<span>\n" +
    "{{subject.namespace}} /\n" +
    "</span>\n" +
    "<strong>\n" +
    "{{subject.name}}\n" +
    "</strong>\n" +
    "</a>\n" +
    "<span ng-if=\"!subject.namespace\">\n" +
    "<strong>\n" +
    "{{subject.name}}\n" +
    "</strong>\n" +
    "<span class=\"current-user\" ng-if=\"subject.name === user.metadata.name\">\n" +
    "(you)\n" +
    "</span>\n" +
    "</span>\n" +
    "</div>\n" +
    "<div class=\"action-set\" flex row tablet=\"column\" mobile=\"column\">\n" +
    "<div class=\"col-roles\" row tablet=\"column\" flex wrap axis=\"start\">\n" +
    "<action-chip ng-repeat=\"role in subject.roles\" key=\"role.metadata.name\" key-help=\"roleHelp(role)\" show-action=\"mode.edit\" action=\"confirmRemove(subject.name, subjectKind.name, role.metadata.name)\" action-title=\"remove role {{role}} from {{subject.name}}\"></action-chip>\n" +
    "</div>\n" +
    "<div ng-if=\"mode.edit\" class=\"col-add-role\">\n" +
    "<div row>\n" +
    "<ui-select ng-if=\"filteredRoles.length\" ng-model=\"subject.newRole\" theme=\"bootstrap\" search-enabled=\"true\" title=\"Select a new role for {{subjectKind.name}}\" class=\"select-role\" flex>\n" +
    "<ui-select-match placeholder=\"Select a role\">\n" +
    "<span ng-bind=\"subject.newRole.metadata.name\"></span>\n" +
    "</ui-select-match>\n" +
    "<ui-select-choices repeat=\"role as role in filteredRoles | filter: excludeExistingRoles(subject.roles) | filter: $select.search | orderBy: 'metadata.name'\">\n" +
    "<div>{{ role.metadata.name }}</div>\n" +
    "<div ng-if=\"role | annotation : 'description'\">\n" +
    "<small>{{role | annotation : 'description'}}</small>\n" +
    "</div>\n" +
    "</ui-select-choices>\n" +
    "</ui-select>\n" +
    "<button ng-disabled=\"disableAddForm || (!subject.newRole)\" ng-click=\"addRoleTo(subject.name, subjectKind.name, subject.newRole)\" class=\"btn btn-default add-role-to\">\n" +
    "Add\n" +
    "</button>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<ng-form class=\"new-binding\" novalidate name=\"forms.newBindingForm\" ng-if=\"newBinding\">\n" +
    "<div ng-if=\"mode.edit\" class=\"item-row form-new-role\" row mobile=\"column\">\n" +
    "<div class=\"col-name pad-bottom-none\" row mobile=\"column\" tablet=\"column\">\n" +
    "<label ng-attr-for=\"newBindingName\" class=\"sr-only\">\n" +
    "Name\n" +
    "</label>\n" +
    "\n" +
    "<input ng-if=\"newBinding.kind !== 'ServiceAccount'\" type=\"text\" class=\"form-control input-name\" placeholder=\"Name\" ng-model=\"newBinding.name\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\">\n" +
    "\n" +
    "<div ng-if=\"newBinding.kind === 'ServiceAccount'\" class=\"service-account-namespace\" aria-hidden=\"true\">\n" +
    "<ui-select ng-model=\"newBinding.namespace\" on-select=\"selectProject($item, $model)\" theme=\"bootstrap\" search-enabled=\"true\" title=\"Select a project\" class=\"select-role pad-bottom-sm\">\n" +
    "<ui-select-match placeholder=\"Select a project\">\n" +
    "<span>{{newBinding.namespace}}</span>\n" +
    "</ui-select-match>\n" +
    "<ui-select-choices repeat=\"projectName in projects | filter: $select.search\" refresh=\"refreshProjects($select.search)\" refresh-delay=\"200\">\n" +
    "<div ng-bind-html=\"projectName | highlight : $select.search\"></div>\n" +
    "</ui-select-choices>\n" +
    "</ui-select>\n" +
    "</div>\n" +
    "<span ng-if=\"newBinding.kind === 'ServiceAccount'\" class=\"mar-left-md mar-right-md hidden-xs\">/</span>\n" +
    "\n" +
    "<div ng-if=\"newBinding.kind === 'ServiceAccount'\" class=\"service-account-name\">\n" +
    "<ui-select ng-model=\"newBinding.name\" theme=\"bootstrap\" search-enabled=\"true\" title=\"Select a service account\" class=\"select-role\">\n" +
    "<ui-select-match placeholder=\"Service account\">\n" +
    "<span>{{newBinding.name}}</span>\n" +
    "</ui-select-match>\n" +
    "<ui-select-choices repeat=\"saName in serviceAccounts | filter: $select.search\" refresh=\"refreshServiceAccounts($select.search)\" refresh-delay=\"200\">\n" +
    "<div ng-bind-html=\"saName | highlight : $select.search\"></div>\n" +
    "</ui-select-choices>\n" +
    "</ui-select>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"action-set\" flex row tablet=\"column\" mobile=\"column\">\n" +
    "<div class=\"col-roles\" flex row tablet=\"column\">&nbsp;</div>\n" +
    "<div class=\"col-add-role\">\n" +
    "<div ng-show=\"mode.edit\" row>\n" +
    "<ui-select ng-if=\"filteredRoles.length\" ng-model=\"newBinding.newRole\" theme=\"bootstrap\" search-enabled=\"true\" title=\"new {{subjectKind.name}} role\" class=\"select-role\" flex>\n" +
    "<ui-select-match placeholder=\"Select a role\">\n" +
    "<span ng-bind=\"newBinding.newRole.metadata.name\"></span>\n" +
    "</ui-select-match>\n" +
    "<ui-select-choices repeat=\"role as role in filteredRoles | filter: $select.search | orderBy: 'metadata.name'\">\n" +
    "<div>{{ role.metadata.name }}</div>\n" +
    "<div ng-if=\"role | annotation : 'description'\">\n" +
    "<small>{{role | annotation : 'description'}}</small>\n" +
    "</div>\n" +
    "</ui-select-choices>\n" +
    "</ui-select>\n" +
    "<button ng-disabled=\"disableAddForm || (!newBinding.name) || (!newBinding.newRole)\" ng-click=\"addRoleTo(newBinding.name, newBinding.kind, newBinding.newRole, newBinding.namespace)\" class=\"btn btn-default add-role-to\">\n" +
    "Add\n" +
    "</button>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</ng-form>\n" +
    "<div ng-if=\"mode.edit\" row mobile=\"column\">\n" +
    "<div class=\"col-name hidden-xs\">&nbsp;</div>\n" +
    "<div class=\"action-set\" flex row tablet=\"column\" mobile=\"column\">\n" +
    "<div class=\"col-roles hidden-xs\" flex>&nbsp;</div>\n" +
    "<div class=\"col-add-role\" row>\n" +
    "<div class=\"checkbox\">\n" +
    "<label>\n" +
    "<input type=\"checkbox\" class=\"toggle-hidden\" ng-click=\"showAllRoles($event)\">\n" +
    "Show hidden roles</label>&nbsp;<a href=\"\" class=\"action-inline\" data-toggle=\"popover\" data-trigger=\"hover focus\" data-content=\"System roles are hidden by default and do not typically need to be managed.\"><i class=\"pficon pficon-help\"></i></a>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</uib-tab>\n" +
    "</uib-tabset>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</project-page>"
  );


  $templateCache.put('views/modals/about-compute-units-modal.html',
    "<div>\n" +
    "<div class=\"modal-body\">\n" +
    "<h2>\n" +
    "Compute Resources\n" +
    "<span class=\"page-header-link\">\n" +
    "<a href=\"{{'compute_resources' | helpLink}}\" target=\"_blank\">Learn More <i class=\"fa fa-external-link\" aria-hidden=\"true\"></i></a>\n" +
    "</span>\n" +
    "</h2>\n" +
    "<div>\n" +
    "Each container running on a node uses compute resources like CPU and memory. You can specify how much CPU and memory a container needs to improve scheduling and performance.\n" +
    "</div>\n" +
    "<h3>CPU</h3>\n" +
    "<p>\n" +
    "CPU is often measured in units called <var>millicores</var>. Each millicore is equivalent to <sup>1</sup>&frasl;<sub>1000</sub> of a CPU&nbsp;core.\n" +
    "</p>\n" +
    "<pre>\n" +
    "1000 millcores  =  1 core\n" +
    "</pre>\n" +
    "<h3>Memory and Storage</h3>\n" +
    "<p>\n" +
    "Memory and storage are measured in binary units like <var>KiB</var>, <var>MiB</var>, <var>GiB</var>, and <var>TiB</var> or decimal units like <var>kB</var>, <var>MB</var>, <var>GB</var>, and&nbsp;<var>TB</var>.\n" +
    "</p>\n" +
    "<div class=\"row\">\n" +
    "<div class=\"col-sm-6\">\n" +
    "<h4>Binary Units</h4>\n" +
    "<pre>\n" +
    "1024 bytes  =  1 KiB\n" +
    "1024 KiB    =  1 MiB\n" +
    "1024 MiB    =  1 GiB\n" +
    "1024 GiB    =  1 TiB\n" +
    "</pre>\n" +
    "</div>\n" +
    "<div class=\"col-sm-6\">\n" +
    "<h4>Decimal Units</h4>\n" +
    "<pre>\n" +
    "1000 bytes  =  1 kB\n" +
    "1000 kB     =  1 MB\n" +
    "1000 MB     =  1 GB\n" +
    "1000 GB     =  1 TB\n" +
    "</pre>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"modal-footer\">\n" +
    "<button class=\"btn btn-lg btn-default\" type=\"button\" ng-click=\"ok()\">OK</button>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/modals/confirm-replace.html',
    "<div class=\"modal-resource-action\">\n" +
    "<div class=\"modal-body\">\n" +
    "<div ng-if=\"!isList\">\n" +
    "<h1>{{resourceKind}} '<strong>{{resourceName}}</strong>' already exists</h1>\n" +
    "<p>Do you want to replace with the new content?</p>\n" +
    "</div>\n" +
    "<div ng-if=\"isList\">\n" +
    "<h1>Some items already exist:</h1>\n" +
    "<dl class=\"dl-horizontal\">\n" +
    "<dt ng-repeat-start=\"resource in updateResources\">{{resource.kind}}</dt>\n" +
    "<dd ng-repeat-end>{{resource.metadata.name}}</dd>\n" +
    "</dl>\n" +
    "<p>Do you want to replace the existing resources?</p>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"modal-footer\">\n" +
    "<button class=\"btn btn-lg btn-primary\" type=\"button\" ng-click=\"replace();\">Replace</button>\n" +
    "<button class=\"btn btn-lg btn-default\" type=\"button\" ng-click=\"cancel();\">Cancel</button>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/modals/confirm-save-log.html',
    "<div class=\"modal-resource-action\">\n" +
    "<div class=\"modal-body\">\n" +
    "<h1>Save partial log for <strong>{{object.metadata.name}}</strong>?</h1>\n" +
    "<div class=\"mar-bottom-xl\">\n" +
    "The log might not be complete. Continuing will save only the content currently displayed.\n" +
    "<span ng-if=\"command\">To get the complete log, run the command</span>\n" +
    "</div>\n" +
    "<copy-to-clipboard ng-if=\"command\" display-wide=\"true\" clipboard-text=\"command\"></copy-to-clipboard>\n" +
    "<div class=\"mar-top-xl\">\n" +
    "Learn more about the <a href=\"command-line\" target=\"_blank\">command line tools</a>.\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"modal-footer\">\n" +
    "<button class=\"btn btn-lg btn-primary\" type=\"button\" ng-click=\"save()\">Save</button>\n" +
    "<button class=\"btn btn-lg btn-default\" type=\"button\" ng-click=\"cancel()\">Cancel</button>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/modals/confirm.html',
    "<div class=\"modal-resource-action\">\n" +
    "<div class=\"modal-body\">\n" +
    "<h1>{{message}}</h1>\n" +
    "<p ng-if=\"details\">{{details}}</p>\n" +
    "<p ng-if=\"detailsMarkup\" ng-bind-html=\"detailsMarkup\"></p>\n" +
    "<alerts ng-if=\"alerts\" alerts=\"alerts\" hide-close-button=\"true\"></alerts>\n" +
    "</div>\n" +
    "<div class=\"modal-footer\">\n" +
    "<button class=\"btn btn-lg\" ng-class=\"okButtonClass\" type=\"button\" ng-click=\"confirm()\">{{okButtonText}}</button>\n" +
    "<button class=\"btn btn-lg btn-default\" type=\"button\" ng-click=\"cancel()\">{{cancelButtonText}}</button>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/modals/confirmScale.html',
    "<div class=\"modal-resource-action\">\n" +
    "<div class=\"modal-body\">\n" +
    "<h1>Scale down {{type}} <strong>{{resource | displayName}}</strong>?</h1>\n" +
    "<p>\n" +
    "Are you sure you want to scale <strong>{{resource | displayName}}</strong> to 0 replicas? This will stop all pods for the {{type}}.\n" +
    "</p>\n" +
    "</div>\n" +
    "<div class=\"modal-footer\">\n" +
    "<button class=\"btn btn-lg btn-danger\" type=\"button\" ng-click=\"confirmScale()\">Scale Down</button>\n" +
    "<button class=\"btn btn-lg btn-default\" type=\"button\" ng-click=\"cancel()\">Cancel</button>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/modals/create-secret.html',
    "<div class=\"create-secret-modal\">\n" +
    "<div class=\"modal-header\">\n" +
    "<h2>\n" +
    "Create {{type | capitalize}} Secret\n" +
    "<span ng-switch=\"type\">\n" +
    "<a ng-switch-when=\"source\" ng-href=\"{{'git_secret' | helpLink}}\" target=\"_blank\"><span class=\"learn-more-inline\">Learn More&nbsp;<i class=\"fa fa-external-link\" aria-hidden=\"true\"></i></span></a>\n" +
    "<a ng-switch-when=\"image\" ng-href=\"{{'pull_secret' | helpLink}}\" target=\"_blank\"><span class=\"learn-more-inline\">Learn More&nbsp;<i class=\"fa fa-external-link\" aria-hidden=\"true\"></i></span></a>\n" +
    "<a ng-switch-default ng-href=\"{{'source_secrets' | helpLink}}\" target=\"_blank\"><span class=\"learn-more-inline\">Learn More&nbsp;<i class=\"fa fa-external-link\" aria-hidden=\"true\"></i></span></a>\n" +
    "</span>\n" +
    "</h2>\n" +
    "</div>\n" +
    "<div class=\"modal-body\">\n" +
    "<create-secret type=\"type\" service-account-to-link=\"serviceAccountToLink\" namespace=\"namespace\" alerts=\"alerts\" post-create-action=\"postCreateAction(newSecret, creationAlert)\" cancel=\"cancel()\"></create-secret>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/modals/debug-terminal.html',
    "<div class=\"modal-debug-terminal\">\n" +
    "<div class=\"modal-header\">\n" +
    "<h2>Debug Container {{container.name}}</h2>\n" +
    "<small class=\"text-muted\">\n" +
    "{{debugPod.metadata.name}} &mdash;\n" +
    "<status-icon status=\"debugPod | podStatus\"></status-icon>\n" +
    "{{debugPod | podStatus | sentenceCase}}\n" +
    "</small>\n" +
    "</div>\n" +
    "<div class=\"modal-body\">\n" +
    "<div ng-if=\"!containerState.running\" class=\"empty-state-message text-center\">\n" +
    "\n" +
    "<h2 ng-if=\"debugPod.status.phase !== 'Failed'\" class=\"text-muted\">\n" +
    "Waiting for container {{container.name}} to start...\n" +
    "</h2>\n" +
    "\n" +
    "<div ng-if=\"debugPod.status.phase === 'Failed'\">\n" +
    "<h2>\n" +
    "<span class=\"pficon pficon-error-circle-o\" aria-hidden=\"true\"></span>\n" +
    "Could not start container {{container.name}}.\n" +
    "</h2>\n" +
    "<p>\n" +
    "An error occurred starting the debug pod.\n" +
    "<span ng-if=\"containerState.terminated.message\">{{containerState.terminated.message}}</span>\n" +
    "<span ng-if=\"containerState.terminated.exitCode\" class=\"text-muted\">Exit code: {{containerState.terminated.exitCode}}</span>\n" +
    "</p>\n" +
    "</div>\n" +
    "</div>\n" +
    "\n" +
    "<div ng-if=\"containerState.running\">\n" +
    "<div class=\"help-block\">\n" +
    "This temporary pod has a modified entrypoint command to debug a failing container. The pod will be available for one hour and will be deleted when the terminal window is closed.\n" +
    "</div>\n" +
    "<div ng-if=\"container | entrypoint : image\" class=\"original-cmd-msg\">\n" +
    "<label>Original Command:</label>\n" +
    "<code>\n" +
    "<truncate-long-text content=\"container | entrypoint : image\" limit=\"80\" newline-limit=\"1\" expandable=\"false\" use-word-boundary=\"false\">\n" +
    "</truncate-long-text>\n" +
    "</code>\n" +
    "\n" +
    "\n" +
    "</div>\n" +
    "<kubernetes-container-terminal pod=\"debugPod\" container=\"container.name\" autofocus=\"true\" command=\"[&quot;/bin/sh&quot;, &quot;-i&quot;, &quot;-c&quot;, &quot;TERM=xterm /bin/sh&quot;]\">\n" +
    "</kubernetes-container-terminal>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"modal-footer\">\n" +
    "<button class=\"btn btn-lg btn-primary\" type=\"button\" ng-click=\"close()\">Close</button>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/modals/delete-project.html',
    "<div class=\"modal-project-delete\">\n" +
    "<div class=\"modal-body\">\n" +
    "<h1>Are you sure you want to delete the project '<strong>{{project | displayName}}</strong>'?</h1>\n" +
    "<p>This will <strong>delete all resources</strong> associated with the project {{project | displayName}} and <strong>cannot be undone</strong>. Make sure this is something you really want to do!</p>\n" +
    "</div>\n" +
    "<div class=\"modal-footer\">\n" +
    "<button class=\"btn btn-lg btn-danger\" type=\"button\" ng-click=\"delete();\">Delete this project</button>\n" +
    "<button class=\"btn btn-lg btn-default\" type=\"button\" ng-click=\"cancel();\">Cancel</button>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/modals/delete-resource.html',
    "<div class=\"modal-resource-action\">\n" +
    "\n" +
    "<form>\n" +
    "<div class=\"modal-body\">\n" +
    "<h1>Are you sure you want to delete the {{typeDisplayName || (kind | humanizeKind)}} '<strong>{{displayName ? displayName : resourceName}}</strong>'?</h1>\n" +
    "<div ng-if=\"replicas\" class=\"alert alert-warning\">\n" +
    "<span class=\"pficon pficon-warning-triangle-o\" aria-hidden=\"true\"></span>\n" +
    "<span class=\"sr-only\">Warning:</span>\n" +
    "<strong>{{resourceName}}</strong> has running pods. Deleting the {{typeDisplayName || (kind | humanizeKind)}} will <strong>not</strong> delete the pods it controls. Consider scaling the {{typeDisplayName || (kind | humanizeKind)}} down to 0 before continuing.\n" +
    "</div>\n" +
    "<p>This<span ng-if=\"isProject\"> will <strong>delete all resources</strong> associated with the project {{displayName ? displayName : resourceName}} and</span> <strong>cannot be undone</strong>. Make sure this is something you really want to do!</p>\n" +
    "<div ng-show=\"typeNameToConfirm\">\n" +
    "<p>Type the name of the {{typeDisplayName || (kind | humanizeKind)}} to confirm.</p>\n" +
    "<p>\n" +
    "<label class=\"sr-only\" for=\"resource-to-delete\">{{typeDisplayName || (kind | humanizeKind)}} to delete</label>\n" +
    "<input ng-model=\"confirmName\" id=\"resource-to-delete\" type=\"text\" class=\"form-control input-lg\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\" autofocus>\n" +
    "</p>\n" +
    "</div>\n" +
    "<div ng-switch=\"kind\">\n" +
    "<div ng-switch-when=\"Deployment\">\n" +
    "<strong>Note:</strong> None of the replica sets created by this deployment will be deleted. To delete the deployment and all of its replica sets, you can run the command\n" +
    "<pre class=\"code prettyprint mar-top-md\">oc delete deployment {{resourceName}} -n {{projectName}}</pre>\n" +
    "Learn more about the <a href=\"command-line\">command line tools</a>.\n" +
    "</div>\n" +
    "<div ng-switch-when=\"DeploymentConfig\">\n" +
    "<strong>Note:</strong> None of the deployments created by this deployment config will be deleted. To delete the deployment config and all of its deployments, you can run the command\n" +
    "<pre class=\"code prettyprint mar-top-md\">oc delete dc {{resourceName}} -n {{projectName}}</pre>\n" +
    "Learn more about the <a href=\"command-line\">command line tools</a>.\n" +
    "</div>\n" +
    "<div ng-switch-when=\"BuildConfig\">\n" +
    "<strong>Note:</strong> None of the builds created by this build config will be deleted. To delete the build config and all of its builds, you can run the command\n" +
    "<pre class=\"code prettyprint mar-top-md\">oc delete bc {{resourceName}} -n {{projectName}}</pre>\n" +
    "Learn more about the <a href=\"command-line\">command line tools</a>.\n" +
    "</div>\n" +
    "</div>\n" +
    "\n" +
    "<div ng-if=\"hpaList.length > 0\">\n" +
    "<p>\n" +
    "<span ng-if=\"hpaList.length === 1\">\n" +
    "This resource has an autoscaler associated with it. It is recommended you delete the autoscaler with the resource it scales.\n" +
    "</span>\n" +
    "<span ng-if=\"hpaList.length > 1\">\n" +
    "This resource has autoscalers associated with it. It is recommended you delete the autoscalers with the resource they scale.\n" +
    "</span>\n" +
    "</p>\n" +
    "<label>\n" +
    "<input type=\"checkbox\" ng-model=\"options.deleteHPAs\">\n" +
    "Delete\n" +
    "<span ng-if=\"hpaList.length === 1\">\n" +
    "Horizontal Pod Autoscaler '<strong>{{hpaList[0].metadata.name}}</strong>'\n" +
    "</span>\n" +
    "<span ng-if=\"hpaList.length > 1\">\n" +
    "{{hpaList.length}} associated Horizontal Pod Autoscalers\n" +
    "</span>\n" +
    "</label>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"modal-footer\">\n" +
    "<button ng-disabled=\"typeNameToConfirm && confirmName !== resourceName && confirmName !== displayName\" class=\"btn btn-lg btn-danger\" type=\"submit\" ng-click=\"delete();\">Delete</button>\n" +
    "<button class=\"btn btn-lg btn-default\" type=\"button\" ng-click=\"cancel();\">Cancel</button>\n" +
    "</div>\n" +
    "</form>\n" +
    "</div>"
  );


  $templateCache.put('views/modals/jenkinsfile-examples-modal.html',
    "<div class=\"jenkinsfile-examples-modal\">\n" +
    "<div class=\"modal-body\">\n" +
    "<h2>Jenkinsfile Examples</h2>\n" +
    "<ng-include src=\"'views/edit/jenkinsfile-examples.html'\"></ng-include>\n" +
    "</div>\n" +
    "<div class=\"modal-footer\">\n" +
    "<button class=\"btn btn-lg btn-default\" type=\"button\" ng-click=\"ok()\">OK</button>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/modals/link-service.html',
    "<div class=\"modal-resource-action\">\n" +
    "<div class=\"modal-body\">\n" +
    "<h4>Group Service to {{service.metadata.name}}</h4>\n" +
    "<div class=\"help-block mar-bottom-md\">\n" +
    "Choose a service that <strong>{{service.metadata.name}}</strong> uses. This groups the services together in the overview.\n" +
    "</div>\n" +
    "<form>\n" +
    "<label class=\"sr-only\" for=\"childService\">Service:</label>\n" +
    "<ui-select ng-model=\"link.selectedService\" autofocus theme=\"bootstrap\" title=\"Choose a service\">\n" +
    "<ui-select-match placeholder=\"Choose a service...\">{{$select.selected.metadata.name}}</ui-select-match>\n" +
    "<ui-select-choices repeat=\"service in options | toArray | filter : { metadata: { name: $select.search } } | orderBy : 'metadata.name'\">\n" +
    "<div ng-bind-html=\"service.metadata.name | highlight : $select.search\"></div>\n" +
    "</ui-select-choices>\n" +
    "</ui-select>\n" +
    "</form>\n" +
    "</div>\n" +
    "<div class=\"modal-footer\">\n" +
    "<button class=\"btn btn-lg btn-primary\" type=\"button\" ng-click=\"link()\" ng-disabled=\"!link.selectedService\">OK</button>\n" +
    "<button class=\"btn btn-lg btn-default\" type=\"button\" ng-click=\"cancel()\">Cancel</button>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/modals/process-template.html',
    "<div class=\"modal-resource-action\">\n" +
    "<div class=\"modal-body\">\n" +
    "<h1>{{updateTemplate ? \"Update\" : \"Add\"}} Template</h1>\n" +
    "<p>What would you like to do?</p>\n" +
    "<div>\n" +
    "<label>\n" +
    "<input type=\"checkbox\" ng-model=\"templateOptions.process\"/>\n" +
    "<strong>Process the template</strong>\n" +
    "</label>\n" +
    "<span id=\"helpBlock\" class=\"help-block\">Create the objects defined in the template. You will have an opportunity to fill in template parameters.</span>\n" +
    "</div>\n" +
    "<div>\n" +
    "<label>\n" +
    "<input type=\"checkbox\" ng-model=\"templateOptions.add\"/>\n" +
    "<strong>{{updateTemplate ? \"Update\" : \"Save\"}} template</strong>\n" +
    "</label>\n" +
    "<span id=\"helpBlock\" class=\"help-block\">{{updateTemplate ? \"This will overwrite the current version of the template.\" : \"Save the template to the project. This will make the template available to anyone who can view the project.\"}}</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"modal-footer\">\n" +
    "<button class=\"btn btn-lg btn-primary\" type=\"button\" ng-click=\"continue();\" ng-disabled=\"!templateOptions.process && !templateOptions.add\">Continue</button>\n" +
    "<button class=\"btn btn-lg btn-default\" type=\"button\" ng-click=\"cancel();\">Cancel</button>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/monitoring.html',
    "<project-header class=\"top-header\"></project-header>\n" +
    "<project-page class=\"monitoring\">\n" +
    "\n" +
    "<div class=\"middle-section monitoring-page\" ng-class=\"{ 'sidebar-open': !renderOptions.collapseEventsSidebar }\">\n" +
    "<div class=\"middle-container\">\n" +
    "<div class=\"middle-header header-toolbar\">\n" +
    "<div class=\"container-fluid\">\n" +
    "<div class=\"page-header page-header-bleed-right page-header-bleed-left\">\n" +
    "<h1>\n" +
    "Monitoring\n" +
    "<events-badge project-context=\"projectContext\" ng-if=\"projectContext\" class=\"pull-right\" sidebar-collapsed=\"renderOptions.collapseEventsSidebar\"></events-badge>\n" +
    "</h1>\n" +
    "</div>\n" +
    "<div class=\"data-toolbar\">\n" +
    "<ui-select class=\"data-toolbar-dropdown\" ng-model=\"kindSelector.selected\" theme=\"bootstrap\" search-enabled=\"true\" ng-disabled=\"kindSelector.disabled\" title=\"Choose a resource\">\n" +
    "<ui-select-match placeholder=\"Choose a resource\">{{$select.selected.label ? $select.selected.label : ($select.selected.kind | humanizeKind : true)}}</ui-select-match>\n" +
    "<ui-select-choices repeat=\"kind in kinds | filter : {kind: $select.search} : matchKind\">\n" +
    "<div ng-bind-html=\"(kind.label ? kind.label : (kind.kind | humanizeKind : true)) | highlight: $select.search\"></div>\n" +
    "</ui-select-choices>\n" +
    "</ui-select>\n" +
    "<div class=\"vertical-divider\"></div>\n" +
    "<div class=\"data-toolbar-filter\">\n" +
    "<form role=\"form\" class=\"search-pf has-button\">\n" +
    "<div class=\"form-group filter-controls has-clear\">\n" +
    "<div class=\"search-pf-input-group\">\n" +
    "<label for=\"name-filter\" class=\"sr-only\">Filter by name</label>\n" +
    "<input type=\"search\" placeholder=\"Filter by name\" class=\"form-control\" id=\"name-filter\" ng-model=\"filters.text\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\">\n" +
    "<button type=\"button\" class=\"clear\" aria-hidden=\"true\" ng-if=\"filters.text\" ng-click=\"filters.text = ''\">\n" +
    "<span class=\"pficon pficon-close\"></span>\n" +
    "</button>\n" +
    "</div>\n" +
    "</div>\n" +
    "</form>\n" +
    "</div>\n" +
    "<div class=\"checkbox nowrap\">\n" +
    "<label>\n" +
    "<input type=\"checkbox\" ng-model=\"filters.hideOlderResources\">Hide older resources\n" +
    "</label>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"middle-content\">\n" +
    "<div class=\"container-fluid\">\n" +
    "<alerts alerts=\"alerts\"></alerts>\n" +
    "<div class=\"row\">\n" +
    "<div class=\"col-md-12\">\n" +
    "<div ng-if=\"kindSelector.selected.kind === 'All' || kindSelector.selected.kind === 'Pods'\">\n" +
    "<h2>Pods</h2>\n" +
    "<div class=\"list-view-pf\">\n" +
    "<div class=\"list-group-item\" ng-if=\"!(filteredPods | hashSize)\">\n" +
    "<div class=\"list-view-pf-main-info\">\n" +
    "<ellipsis-pulser color=\"dark\" size=\"sm\" msg=\"Loading pods\" ng-if=\"!podsLoaded\"></ellipsis-pulser>\n" +
    "<em>\n" +
    "<div ng-if=\"(pods | hashSize) > 0\">The current filters are hiding all pods.</div>\n" +
    "<span ng-if=\"podsLoaded && (pods | hashSize) === 0\">There are no pods in this project.</span>\n" +
    "</em>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"list-group-item list-group-item-expandable\" ng-repeat-start=\"pod in filteredPods track by (pod | uid)\" ng-click=\"toggleItem($event, this, pod)\" ng-class=\"{'expanded': expanded.pods[pod.metadata.name]}\">\n" +
    "<div class=\"list-view-pf-checkbox\">\n" +
    "<button class=\"sr-only\">{{expanded.pods[pod.metadata.name] ? 'Collapse' : 'Expand'}}</button>\n" +
    "<span ng-if=\"expanded.pods[pod.metadata.name]\">\n" +
    "<span class=\"fa fa-angle-down\"></span>\n" +
    "</span>\n" +
    "<span ng-if=\"!expanded.pods[pod.metadata.name]\">\n" +
    "<span class=\"fa fa-angle-right\"></span>\n" +
    "</span>\n" +
    "</div>\n" +
    "<div class=\"list-view-pf-main-info\">\n" +
    "<div class=\"list-view-pf-body\">\n" +
    "<div class=\"list-view-pf-description\">\n" +
    "<div class=\"list-group-item-heading\">\n" +
    "<a ng-href=\"{{pod | navigateResourceURL}}\"><span ng-bind-html=\"pod.metadata.name | highlightKeywords : filterKeywords\"></span></a>\n" +
    "<small>created <span am-time-ago=\"pod.metadata.creationTimestamp\"></span></small>\n" +
    "</div>\n" +
    "<div class=\"list-group-item-text\">\n" +
    "<status-icon status=\"pod | podStatus\" disable-animation></status-icon>\n" +
    "{{pod | podStatus | sentenceCase}}\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"list-view-pf-additional-info\">\n" +
    "<div class=\"list-view-pf-additional-info-item\">\n" +
    "<span class=\"pficon fa-fw pficon-image\"></span>\n" +
    "<image-names pod-template=\"pod\" pods=\"[pod]\"></image-names>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-repeat-end ng-if=\"expanded.pods[pod.metadata.name]\" class=\"list-group-expanded-section\" ng-class=\"{'expanded': expanded.pods[pod.metadata.name]}\">\n" +
    "<log-viewer ng-if=\"'pods/log' | canI : 'get'\" object=\"pod\" context=\"projectContext\" options=\"logOptions.pods[pod.metadata.name]\" empty=\"logEmpty.pods[pod.metadata.name]\" run=\"logCanRun.pods[pod.metadata.name]\" fixed-height=\"250\" full-log-url=\"(pod | navigateResourceURL) + '?view=chromeless'\">\n" +
    "<span class=\"container-details\">\n" +
    "<label for=\"selectLogContainer\">Container:</label>\n" +
    "<span ng-if=\"pod.spec.containers.length === 1\">\n" +
    "{{pod.spec.containers[0].name}}\n" +
    "</span>\n" +
    "<ui-select ng-init=\"logOptions.pods[pod.metadata.name].container = pod.spec.containers[0].name\" ng-show=\"pod.spec.containers.length > 1\" ng-model=\"logOptions.pods[pod.metadata.name].container\" input-id=\"selectLogContainer\">\n" +
    "<ui-select-match>{{$select.selected.name}}</ui-select-match>\n" +
    "<ui-select-choices repeat=\"container.name as container in pod.spec.containers\">\n" +
    "<div ng-bind-html=\"container.name | highlight : $select.search\"></div>\n" +
    "</ui-select-choices>\n" +
    "</ui-select>\n" +
    "</span>\n" +
    "</log-viewer>\n" +
    "\n" +
    "<div class=\"mar-top-lg\" ng-if=\"metricsAvailable\">\n" +
    "<pod-metrics pod=\"pod\" stack-donut=\"!renderOptions.collapseEventsSidebar\" alerts=\"alerts\"></pod-metrics>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"kindSelector.selected.kind === 'All' || kindSelector.selected.kind === 'ReplicationControllers'\">\n" +
    "<h2>Deployments</h2>\n" +
    "<div class=\"list-view-pf\">\n" +
    "<div class=\"list-group-item\" ng-if=\"!(filteredReplicationControllers | hashSize) && !(filteredReplicaSets | hashSize)\">\n" +
    "<div class=\"list-view-pf-main-info\">\n" +
    "<ellipsis-pulser color=\"dark\" size=\"sm\" msg=\"Loading deployments\" ng-if=\"!replicationControllersLoaded\"></ellipsis-pulser>\n" +
    "<em>\n" +
    "<div ng-if=\"(replicationControllers | hashSize) > 0 || (replicaSets | hashSize) > 0\">The current filters are hiding all deployments.</div>\n" +
    "<span ng-if=\"replicationControllersLoaded && !(replicationControllers | hashSize) && replicaSetsLoaded && !(replicaSets | hashSize)\">There are no deployments in this project.</span>\n" +
    "</em>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"list-group-item list-group-item-expandable\" ng-repeat-start=\"replicationController in filteredReplicationControllers track by (replicationController | uid)\" ng-click=\"toggleItem($event, this, replicationController)\" ng-class=\"{'expanded': expanded.replicationControllers[replicationController.metadata.name]}\">\n" +
    "<div class=\"list-view-pf-checkbox\">\n" +
    "<button class=\"sr-only\">{{expanded.replicationControllers[replicationController.metadata.name] ? 'Collapse' : 'Expand'}}</button>\n" +
    "<span ng-if=\"expanded.replicationControllers[replicationController.metadata.name]\">\n" +
    "<span class=\"fa fa-angle-down\"></span>\n" +
    "</span>\n" +
    "<span ng-if=\"!expanded.replicationControllers[replicationController.metadata.name]\">\n" +
    "<span class=\"fa fa-angle-right\"></span>\n" +
    "</span>\n" +
    "</div>\n" +
    "<div class=\"list-view-pf-main-info\">\n" +
    "<div class=\"list-view-pf-body\">\n" +
    "<div class=\"list-view-pf-description\">\n" +
    "<div class=\"list-group-item-heading\">\n" +
    "<a ng-href=\"{{replicationController | navigateResourceURL}}\"><span ng-bind-html=\"replicationController.metadata.name | highlightKeywords : filterKeywords\"></span></a>\n" +
    "<small>created <span am-time-ago=\"replicationController.metadata.creationTimestamp\"></span></small>\n" +
    "</div>\n" +
    "<div class=\"list-group-item-text\">\n" +
    "<status-icon status=\"replicationController | deploymentStatus\" disable-animation></status-icon>\n" +
    "{{replicationController | deploymentStatus | sentenceCase}}<span ng-if=\"(replicationController | deploymentStatus) === 'Active'\">, {{replicationController.status.replicas}} replica<span ng-if=\"replicationController.status.replicas !== 1\">s</span></span>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"list-view-pf-additional-info\">\n" +
    "<div class=\"list-view-pf-additional-info-item\">\n" +
    "<span class=\"pficon fa-fw pficon-image\"></span>\n" +
    "<image-names pod-template=\"replicationController.spec.template\" pods=\"podsByOwnerUID[replicationController.metadata.uid]\">\n" +
    "</image-names>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-repeat-end ng-if=\"expanded.replicationControllers[replicationController.metadata.name]\" class=\"list-group-expanded-section\" ng-class=\"{'expanded': expanded.replicationControllers[replicationController.metadata.name]}\">\n" +
    "\n" +
    "<log-viewer ng-if=\"'deploymentconfigs/log' | canI : 'get'\" object=\"replicationController\" context=\"projectContext\" options=\"logOptions.replicationControllers[replicationController.metadata.name]\" empty=\"logEmpty.replicationControllers[replicationController.metadata.name]\" run=\"logCanRun.replicationControllers[replicationController.metadata.name]\" fixed-height=\"250\" full-log-url=\"(replicationController | navigateResourceURL) + '?view=chromeless'\">\n" +
    "</log-viewer>\n" +
    "<div class=\"mar-top-lg\" ng-if=\"metricsAvailable\">\n" +
    "<deployment-metrics pods=\"podsByOwnerUID[replicationController.metadata.uid]\" containers=\"replicationController.spec.template.spec.containers\" alerts=\"alerts\">\n" +
    "</deployment-metrics>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"list-group-item list-group-item-expandable\" ng-repeat-start=\"replicaSet in filteredReplicaSets track by (replicaSet | uid)\" ng-click=\"toggleItem($event, this, replicaSet)\" ng-class=\"{'expanded': expanded.replicaSets[replicaSet.metadata.name]}\">\n" +
    "<div class=\"list-view-pf-checkbox\">\n" +
    "<button class=\"sr-only\">{{expanded.replicaSets[replicaSet.metadata.name] ? 'Collapse' : 'Expand'}}</button>\n" +
    "<span ng-if=\"expanded.replicaSets[replicaSet.metadata.name]\">\n" +
    "<span class=\"fa fa-angle-down\"></span>\n" +
    "</span>\n" +
    "<span ng-if=\"!expanded.replicaSets[replicaSet.metadata.name]\">\n" +
    "<span class=\"fa fa-angle-right\"></span>\n" +
    "</span>\n" +
    "</div>\n" +
    "<div class=\"list-view-pf-main-info\">\n" +
    "<div class=\"list-view-pf-body\">\n" +
    "<div class=\"list-view-pf-description\">\n" +
    "<div class=\"list-group-item-heading\">\n" +
    "<a ng-href=\"{{replicaSet | navigateResourceURL}}\"><span ng-bind-html=\"replicaSet.metadata.name | highlightKeywords : filterKeywords\"></span></a>\n" +
    "<small>created <span am-time-ago=\"replicaSet.metadata.creationTimestamp\"></span></small>\n" +
    "</div>\n" +
    "<div class=\"list-group-item-text\">\n" +
    "{{replicaSet.status.replicas}} replica<span ng-if=\"replicaSet.status.replicas !== 1\">s</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"list-view-pf-additional-info\">\n" +
    "<div class=\"list-view-pf-additional-info-item\">\n" +
    "<span class=\"pficon fa-fw pficon-image\"></span>\n" +
    "<image-names pod-template=\"replicaSet.spec.template\" pods=\"podsByOwnerUID[replicaSet.metadata.uid]\">\n" +
    "</image-names>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-repeat-end ng-if=\"expanded.replicaSets[replicaSet.metadata.name]\" class=\"list-group-expanded-section\" ng-class=\"{'expanded': expanded.replicaSets[replicaSet.metadata.name]}\">\n" +
    "Logs are not available for replica sets.\n" +
    "<span ng-if=\"podsByOwnerUID[replicaSet.metadata.uid] | hashSize\">\n" +
    "To see application logs, view the logs for one of the replica set's\n" +
    "<a href=\"\" ng-click=\"viewPodsForReplicaSet(replicaSet)\">pods</a>.\n" +
    "</span>\n" +
    "<div class=\"mar-top-lg\" ng-if=\"metricsAvailable\">\n" +
    "<deployment-metrics pods=\"podsByOwnerUID[replicaSet.metadata.uid]\" containers=\"replicaSet.spec.template.spec.containers\" alerts=\"alerts\">\n" +
    "</deployment-metrics>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"kindSelector.selected.kind === 'All' || kindSelector.selected.kind === 'StatefulSets'\">\n" +
    "<h2>Stateful Sets</h2>\n" +
    "<div class=\"list-view-pf\">\n" +
    "<div class=\"list-group-item\" ng-if=\"!(filteredStatefulSets | hashSize)\">\n" +
    "<div class=\"list-view-pf-main-info\">\n" +
    "<ellipsis-pulser color=\"dark\" size=\"sm\" msg=\"Loading stateful sets\" ng-if=\"!statefulSetsLoaded\"></ellipsis-pulser>\n" +
    "<em>\n" +
    "<div ng-if=\"(statefulSets | hashSize) > 0\">The current filters are hiding all stateful sets.</div>\n" +
    "<span ng-if=\"statefulSetsLoaded && (statefulSets | hashSize) === 0\">There are no stateful sets in this project.</span>\n" +
    "</em>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"list-group-item list-group-item-expandable\" ng-repeat-start=\"set in filteredStatefulSets track by (set | uid)\" ng-click=\"toggleItem($event, this, set)\" ng-class=\"{'expanded': expanded.statefulSets[set.metadata.name]}\">\n" +
    "<div class=\"list-view-pf-checkbox\">\n" +
    "<button class=\"sr-only\">{{expanded.statefulSets[set.metadata.name] ? 'Collapse' : 'Expand'}}</button>\n" +
    "<span ng-if=\"expanded.statefulSets[set.metadata.name]\">\n" +
    "<span class=\"fa fa-angle-down\"></span>\n" +
    "</span>\n" +
    "<span ng-if=\"!expanded.statefulSets[set.metadata.name]\">\n" +
    "<span class=\"fa fa-angle-right\"></span>\n" +
    "</span>\n" +
    "</div>\n" +
    "<div class=\"list-view-pf-main-info\">\n" +
    "<div class=\"list-view-pf-body\">\n" +
    "<div class=\"list-view-pf-description\">\n" +
    "<div class=\"list-group-item-heading\">\n" +
    "<a ng-href=\"{{set | navigateResourceURL}}\"><span ng-bind-html=\"set.metadata.name | highlightKeywords : filterKeywords\"></span></a>\n" +
    "<small>created <span am-time-ago=\"set.metadata.creationTimestamp\"></span></small>\n" +
    "</div>\n" +
    "<div class=\"list-group-item-text\">\n" +
    "<status-icon status=\"set | deploymentStatus\" disable-animation></status-icon>\n" +
    "{{set | deploymentStatus | sentenceCase}},\n" +
    "<span ng-if=\"(podsByOwnerUID[set.metadata.uid] | hashSize) !== set.spec.replicas\">{{podsByOwnerUID[set.metadata.uid] | hashSize}}/</span>{{set.spec.replicas}} replica<span ng-if=\"set.spec.replicas != 1\">s</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"list-view-pf-additional-info\">\n" +
    "<div class=\"list-view-pf-additional-info-item\">\n" +
    "<span class=\"pficon fa-fw pficon-image\"></span>\n" +
    "<image-names pod-template=\"set.spec.template\" pods=\"podsByOwnerUID[set.metadata.uid]\"></image-names>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-repeat-end ng-if=\"expanded.statefulSets[set.metadata.name]\" class=\"list-group-expanded-section\" ng-class=\"{'expanded': expanded.statefulSets[set.metadata.name]}\">\n" +
    "Logs are not available for stateful sets.\n" +
    "<span ng-if=\"podsByOwnerUID[set.metadata.uid] | hashSize\">\n" +
    "To see application logs, view the logs for one of the stateful sets's\n" +
    "<a href=\"\" ng-click=\"viewPodsForReplicaSet(set)\">pods</a>.\n" +
    "</span>\n" +
    "<div class=\"mar-top-lg\" ng-if=\"metricsAvailable\">\n" +
    "<deployment-metrics pods=\"podsByOwnerUID[set.metadata.uid]\" containers=\"set.spec.template.spec.containers\" alerts=\"alerts\">\n" +
    "</deployment-metrics>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"kindSelector.selected.kind === 'All' || kindSelector.selected.kind === 'Builds'\">\n" +
    "<h2>Builds</h2>\n" +
    "<div class=\"list-view-pf\">\n" +
    "<div class=\"list-group-item\" ng-if=\"!(filteredBuilds | hashSize)\">\n" +
    "<div class=\"list-view-pf-main-info\">\n" +
    "<ellipsis-pulser color=\"dark\" size=\"sm\" msg=\"Loading builds\" ng-if=\"!buildsLoaded\"></ellipsis-pulser>\n" +
    "<em>\n" +
    "<div ng-if=\"(builds | hashSize) > 0\">The current filters are hiding all builds.</div>\n" +
    "<span ng-if=\"buildsLoaded && (builds | hashSize) === 0\">There are no builds in this project.</span>\n" +
    "</em>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"list-group-item list-group-item-expandable\" ng-repeat-start=\"build in filteredBuilds track by (build | uid)\" ng-click=\"toggleItem($event, this, build)\" ng-class=\"{'expanded': expanded.builds[build.metadata.name]}\">\n" +
    "<div class=\"list-view-pf-checkbox\">\n" +
    "<button class=\"sr-only\">{{expanded.builds[build.metadata.name] ? 'Collapse' : 'Expand'}}</button>\n" +
    "<span ng-if=\"expanded.builds[build.metadata.name]\">\n" +
    "<span class=\"fa fa-angle-down\"></span>\n" +
    "</span>\n" +
    "<span ng-if=\"!expanded.builds[build.metadata.name]\">\n" +
    "<span class=\"fa fa-angle-right\"></span>\n" +
    "</span>\n" +
    "</div>\n" +
    "<div class=\"list-view-pf-main-info\">\n" +
    "<div class=\"list-view-pf-body\">\n" +
    "<div class=\"list-view-pf-description\">\n" +
    "<div class=\"list-group-item-heading\">\n" +
    "<a ng-href=\"{{build | navigateResourceURL}}\"><span ng-bind-html=\"build.metadata.name | highlightKeywords : filterKeywords\"></span></a>\n" +
    "<small>created <span am-time-ago=\"build.metadata.creationTimestamp\"></span></small>\n" +
    "</div>\n" +
    "<div class=\"list-group-item-text\">\n" +
    "<build-status build=\"build\"></build-status>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"list-view-pf-additional-info\">\n" +
    "<div class=\"list-view-pf-additional-info-item\">\n" +
    "<span ng-if=\"build.spec.source.type || build.spec.revision.git.commit || build.spec.source.git.uri\">\n" +
    "<span class=\"fa fa-fw fa-code\"></span>\n" +
    "<span ng-if=\"build.spec.revision.git.commit\">\n" +
    "{{build.spec.revision.git.message}}\n" +
    "<osc-git-link class=\"hash\" uri=\"build.spec.source.git.uri\" ref=\"build.spec.revision.git.commit\">{{build.spec.revision.git.commit | limitTo:7}}</osc-git-link>\n" +
    "<span ng-if=\"detailed && build.spec.revision.git.author\">\n" +
    "authored by {{build.spec.revision.git.author.name}}\n" +
    "</span>\n" +
    "</span>\n" +
    "<span ng-if=\"!build.spec.revision.git.commit && build.spec.source.git.uri\">\n" +
    "<osc-git-link uri=\"build.spec.source.git.uri\">{{build.spec.source.git.uri}}</osc-git-link>\n" +
    "</span>\n" +
    "<span ng-if=\"build.spec.source.type && !build.spec.source.git\">\n" +
    "Source: {{build.spec.source.type}}\n" +
    "</span>\n" +
    "</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-repeat-end ng-if=\"expanded.builds[build.metadata.name]\" class=\"list-group-expanded-section\" ng-class=\"{'expanded': expanded.builds[build.metadata.name]}\">\n" +
    "\n" +
    "<log-viewer ng-if=\"'builds/log' | canI : 'get'\" object=\"build\" context=\"projectContext\" options=\"logOptions.builds[build.metadata.name]\" empty=\"logEmpty.builds[build.metadata.name]\" run=\"logCanRun.builds[build.metadata.name]\" fixed-height=\"250\" full-log-url=\"(build | navigateResourceURL) + '?view=chromeless'\">\n" +
    "<div ng-if=\"build.status.startTimestamp && !logEmpty.builds[build.metadata.name]\" class=\"log-timestamps\" style=\"margin-left: 0\">\n" +
    "Log from {{build.status.startTimestamp | date : 'medium'}}\n" +
    "<span ng-if=\"build.status.completionTimestamp\">\n" +
    "to {{build.status.completionTimestamp | date : 'medium'}}\n" +
    "</span>\n" +
    "</div>\n" +
    "</log-viewer>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</project-page>"
  );


  $templateCache.put('views/newfromtemplate.html',
    "<default-header class=\"top-header\"></default-header>\n" +
    "<div class=\"wrap no-sidebar\">\n" +
    "<div class=\"sidebar-left collapse navbar-collapse navbar-collapse-2\">\n" +
    "<navbar-utility-mobile></navbar-utility-mobile>\n" +
    "</div>\n" +
    "<div class=\"middle surface-shaded\">\n" +
    "\n" +
    "<div class=\"middle-section\">\n" +
    "<div class=\"middle-container\">\n" +
    "<div class=\"middle-content\">\n" +
    "<div class=\"container surface-shaded\">\n" +
    "<div class=\"row\">\n" +
    "<div class=\"col-md-12\">\n" +
    "<breadcrumbs breadcrumbs=\"breadcrumbs\"></breadcrumbs>\n" +
    "<div ng-hide=\"template\">\n" +
    "{{ emptyMessage }}\n" +
    "</div>\n" +
    "<div class=\"osc-form\" ng-show=\"template\">\n" +
    "<alerts alerts=\"alerts\"></alerts>\n" +
    "<div class=\"row\">\n" +
    "<div class=\"col-md-2 icon hidden-sm hidden-xs\">\n" +
    "<custom-icon resource=\"template\" kind=\"template\"></custom-icon>\n" +
    "</div>\n" +
    "<div class=\"col-md-8\">\n" +
    "<fieldset ng-disabled=\"disableInputs\">\n" +
    "<osc-image-summary resource=\"template\"></osc-image-summary>\n" +
    "<div ng-if=\"templateImages.length\" class=\"images\">\n" +
    "<h2>Images</h2>\n" +
    "<ul class=\"list-unstyled\" ng-repeat=\"image in templateImages\">\n" +
    "<li>\n" +
    "<i class=\"pficon pficon-image\" aria-hidden=\"true\"></i>\n" +
    "<span class=\"name\">\n" +
    "{{ image.name }}\n" +
    "</span>\n" +
    "<span ng-if=\"image.usesParameters.length\" class=\"text-muted small\">\n" +
    "<span ng-if=\"!image.name\">Image value set</span>\n" +
    "from parameter<span ng-if=\"image.usesParameters.length > 1\">s</span>\n" +
    "<span ng-repeat=\"parameterName in image.usesParameters\">\n" +
    "{{parameterDisplayNames[parameterName]}}<span ng-if=\"!$last\">,</span>\n" +
    "</span>\n" +
    "</span>\n" +
    "</li>\n" +
    "</ul>\n" +
    "</div>\n" +
    "<form name=\"templateForm\">\n" +
    "<template-options parameters=\"template.parameters\" expand=\"true\" can-toggle=\"false\"></template-options>\n" +
    "<label-editor labels=\"labels\" system-labels=\"systemLabels\" expand=\"true\" can-toggle=\"false\" help-text=\"Each label is applied to each created resource.\">\n" +
    "</label-editor>\n" +
    "<alerts alerts=\"quotaAlerts\"></alerts>\n" +
    "<div class=\"buttons gutter-top-bottom\">\n" +
    "<button class=\"btn btn-primary btn-lg\" ng-click=\"createFromTemplate()\" ng-disabled=\"templateForm.$invalid || disableInputs\">Create</button>\n" +
    "<a class=\"btn btn-default btn-lg\" href=\"{{projectName | projectOverviewURL}}\">Cancel</a>\n" +
    "</div>\n" +
    "</form>\n" +
    "</fieldset>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/other-resources.html',
    "<project-header class=\"top-header\"></project-header>\n" +
    "<project-page>\n" +
    "\n" +
    "<div class=\"middle-section\">\n" +
    "<div class=\"middle-container\">\n" +
    "<div class=\"middle-header header-toolbar\">\n" +
    "<div class=\"container-fluid\">\n" +
    "<div class=\"page-header page-header-bleed-right page-header-bleed-left\">\n" +
    "<h1>Other Resources</h1>\n" +
    "</div>\n" +
    "<div class=\"data-toolbar other-resources-toolbar\">\n" +
    "<ui-select class=\"data-toolbar-dropdown\" ng-model=\"kindSelector.selected\" theme=\"bootstrap\" search-enabled=\"true\" ng-disabled=\"kindSelector.disabled\" title=\"Choose a resource\">\n" +
    "<ui-select-match placeholder=\"Choose a resource to list...\">{{$select.selected.kind | humanizeKind : true}}</ui-select-match>\n" +
    "<ui-select-choices repeat=\"kind in kinds | filter : {kind: $select.search} : matchKind | orderBy : 'kind'\">\n" +
    "<div ng-bind-html=\"(kind.kind | humanizeKind : true) | highlight: $select.search\"></div>\n" +
    "</ui-select-choices>\n" +
    "</ui-select>\n" +
    "<div class=\"vertical-divider\"></div>\n" +
    "<div class=\"data-toolbar-filter\">\n" +
    "<project-filter></project-filter>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"middle-content\">\n" +
    "<div class=\"container-fluid\">\n" +
    "<alerts alerts=\"alerts\"></alerts>\n" +
    "<div class=\"row\">\n" +
    "<div class=\"col-md-12\">\n" +
    "<table class=\"table table-bordered table-mobile table-layout-fixed\" ng-class=\"{ 'table-empty': (resources | hashSize) === 0 }\">\n" +
    "<colgroup>\n" +
    "<col class=\"col-sm-3\">\n" +
    "<col class=\"col-sm-2\">\n" +
    "<col class=\"col-sm-5\">\n" +
    "<col class=\"col-sm-2\">\n" +
    "</colgroup>\n" +
    "<thead>\n" +
    "<tr>\n" +
    "<th>Name</th>\n" +
    "<th>Created</th>\n" +
    "<th>Labels</th>\n" +
    "<th><span class=\"sr-only\">Actions</span></th>\n" +
    "</tr>\n" +
    "</thead>\n" +
    "<tbody ng-if=\"(resources | hashSize) == 0\">\n" +
    "<tr><td colspan=\"4\"><em>{{emptyMessage}}</em></td></tr>\n" +
    "</tbody>\n" +
    "<tbody ng-if=\"(resources | hashSize) > 0\">\n" +
    "<tr ng-repeat=\"resource in resources | orderObjectsByDate : true\">\n" +
    "<td data-title=\"Name\">{{resource.metadata.name}}</td>\n" +
    "<td data-title=\"Created\"><span am-time-ago=\"resource.metadata.creationTimestamp\"></span></td>\n" +
    "<td data-title=\"Labels\">\n" +
    "<em ng-if=\"(resource.metadata.labels | hashSize) === 0\">none</em>\n" +
    "<labels labels=\"resource.metadata.labels\" clickable=\"true\" kind=\"{{kindSelector.selected.kind | kindToResource : true }}\" project-name=\"{{resource.metadata.namespace}}\" limit=\"3\" filter-current-page=\"true\"></labels></td>\n" +
    "<td data-title=\"Actions\" class=\"text-xs-left text-right\">\n" +
    "<span uib-dropdown ng-hide=\"!(selectedResource | canI : 'update') && !(selectedResource | canI : 'delete')\">\n" +
    "<button type=\"button\" class=\"dropdown-toggle btn btn-default\" data-toggle=\"dropdown\">\n" +
    "Actions\n" +
    "<span class=\"caret\"></span>\n" +
    "</button>\n" +
    "<ul class=\"uib-dropdown-menu dropdown-menu-right\" aria-labelledby=\"{{resource.metadata.name}}_actions\">\n" +
    "<li ng-if=\"selectedResource | canI : 'update'\">\n" +
    "<a ng-href=\"{{resource | editYamlURL : getReturnURL()}}\" role=\"button\">Edit YAML</a>\n" +
    "</li>\n" +
    "<li ng-if=\"selectedResource | canI : 'delete'\">\n" +
    "<delete-link kind=\"{{kindSelector.selected.kind}}\" group=\"{{kindSelector.selected.group}}\" resource-name=\"{{resource.metadata.name}}\" project-name=\"{{resource.metadata.namespace}}\" alerts=\"alerts\" stay-on-current-page=\"true\" success=\"loadKind\">\n" +
    "</delete-link>\n" +
    "</li>\n" +
    "</ul>\n" +
    "</span>\n" +
    "</td>\n" +
    "</tr>\n" +
    "</tbody>\n" +
    "</table>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</project-page>"
  );


  $templateCache.put('views/overview.html',
    "<project-header class=\"top-header\"></project-header>\n" +
    "<project-page class=\"overview\">\n" +
    "\n" +
    "<div class=\"middle-section\">\n" +
    "<div class=\"middle-container\">\n" +
    "<div class=\"middle-content surface-shaded\" in-view-container>\n" +
    "<div class=\"container-fluid surface-shaded\">\n" +
    "<tasks></tasks>\n" +
    "<alerts alerts=\"alerts\"></alerts>\n" +
    "<div class=\"row\">\n" +
    "<div class=\"col-md-12\">\n" +
    "\n" +
    "<div ng-if=\"renderOptions.showGetStarted\">\n" +
    "\n" +
    "<div class=\"empty-project text-center\">\n" +
    "<div ng-if=\"project.metadata.name | canIAddToProject\">\n" +
    "<h2>Get started with your project.</h2>\n" +
    "<p class=\"gutter-top\">\n" +
    "Use your source or an example repository to build an application image, or add components like databases and message queues.\n" +
    "</p>\n" +
    "<p class=\"gutter-top\">\n" +
    "<a ng-href=\"project/{{projectName}}/create\" class=\"btn btn-lg btn-primary\">\n" +
    "Add to Project\n" +
    "</a>\n" +
    "</p>\n" +
    "</div>\n" +
    "<div ng-if=\"!(project.metadata.name | canIAddToProject)\">\n" +
    "<h2>Welcome to project {{projectName}}.</h2>\n" +
    "<ng-include src=\"'views/_request-access.html'\"></ng-include>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"renderOptions.showLoading\" class=\"loading-message\">\n" +
    "Loading...\n" +
    "</div>\n" +
    "<div class=\"service-group-with-route-row\" ng-repeat=\"service in topLevelServices\" ng-if=\"service.metadata.labels.app || routesByService[service.metadata.name].length || childServicesByParent[service.metadata.name].length\">\n" +
    "<overview-service-group></overview-service-group>\n" +
    "</div>\n" +
    "<div row wrap class=\"standalone-service-row\">\n" +
    "<div ng-repeat=\"service in topLevelServices\" ng-if=\"!service.metadata.labels.app && !routesByService[service.metadata.name].length && !childServicesByParent[service.metadata.name].length\" class=\"standalone-service\">\n" +
    "<overview-service-group></overview-service-group>\n" +
    "</div>\n" +
    "</div>\n" +
    "\n" +
    "<div row wrap ng-if=\"hasUnservicedContent()\" class=\"unserviced-row\">\n" +
    "\n" +
    "<div ng-repeat=\"(dcName, deploymentConfig) in deploymentConfigsByService[''] track by (deploymentConfig | uid)\" class=\"no-service\">\n" +
    "<overview-deployment-config class=\"overview-tile-wrapper\"></overview-deployment-config>\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "<div ng-repeat=\"(deploymentName, deployment) in deploymentsByService[''] track by (deployment | uid)\" class=\"no-service\" ng-if=\"replicaSets = visibleRSByDeploymentAndService[''][deploymentName]\"> \n" +
    "<overview-deployment class=\"overview-tile-wrapper\"></overview-deployment>\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "<div ng-repeat=\"set in replicationControllersByService[''] | orderBy : 'metadata.name' track by (set | uid)\" ng-if=\"!(set | annotation : 'deploymentConfig') || !deploymentConfigs[(set | annotation : 'deploymentConfig')]\" class=\"no-service\">\n" +
    "<overview-set class=\"overview-tile-wrapper\"></overview-set>\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "<div ng-repeat=\"set in replicaSetsByService[''] | orderBy : 'metadata.name' track by (set | uid)\" ng-if=\"!(set | annotation : 'deployment.kubernetes.io/revision')\" class=\"no-service\">\n" +
    "<overview-set class=\"overview-tile-wrapper\"></overview-set>\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "<div ng-repeat=\"set in statefulSetsByService[''] | orderBy : 'metadata.name' track by (set | uid)\" class=\"no-service\">\n" +
    "<overview-set class=\"overview-tile-wrapper\"></overview-set>\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "<div ng-repeat=\"pod in monopodsByService[''] | orderBy : 'metadata.name' track by (pod | uid)\" class=\"no-service\">\n" +
    "<overview-pod class=\"overview-tile-wrapper\"></overview-pod>\n" +
    "</div>\n" +
    "\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</project-page>"
  );


  $templateCache.put('views/overview/_dc.html',
    "<div class=\"overview-tile\" ng-class=\"{ 'deployment-in-progress': inProgressDeployment }\">\n" +
    "<ng-include src=\"'views/overview/_service-header.html'\"></ng-include>\n" +
    "<div class=\"overview-tile-header\">\n" +
    "<div class=\"rc-header\">\n" +
    "<div>\n" +
    "Deployment Config\n" +
    "<a ng-href=\"{{deploymentConfig | navigateResourceURL}}\">{{deploymentConfig.metadata.name}}</a>\n" +
    "<small class=\"overview-timestamp\" ng-if=\"activeReplicationController && !inProgressDeployment\">\n" +
    "<span class=\"hidden-xs\">&ndash;</span>\n" +
    "<span am-time-ago=\"activeReplicationController.metadata.creationTimestamp\"></span>\n" +
    "</small>\n" +
    "</div>\n" +
    "<div>\n" +
    "<div class=\"small\">\n" +
    "<image-names ng-if=\"activeReplicationController && !inProgressDeployment && showMetrics\" pod-template=\"activeReplicationController.spec.template\" pods=\"podsByOwnerUID[activeReplicationController.metadata.uid]\">\n" +
    "</image-names>\n" +
    "</div>\n" +
    "<div ng-if=\"inProgressDeployment\" class=\"small\">\n" +
    "{{deploymentConfig.spec.strategy.type}} <ellipsis-pulser color=\"dark\" size=\"sm\" display=\"inline\" msg=\"deployment in progress\"></ellipsis-pulser>\n" +
    "<span ng-if=\"'deploymentconfigs/log' | canI : 'get'\" class=\"deployment-log-link\">\n" +
    "<a ng-href=\"{{inProgressDeployment | navigateResourceURL}}?tab=logs\">View Log</a>\n" +
    "<span ng-if=\"'replicationcontrollers' | canI: 'update'\" class=\"action-divider\">|</span>\n" +
    "</span>\n" +
    "<span ng-if=\"'replicationcontrollers' | canI : 'update'\" class=\"deployment-log-link\">\n" +
    "<a href=\"\" ng-click=\"cancelDeployment()\" role=\"button\">Cancel</a>\n" +
    "</span>\n" +
    "</div>\n" +
    "<div ng-if=\"deploymentConfig.spec.paused\" class=\"small\">\n" +
    "<span class=\"pficon pficon-info\" aria-hidden=\"true\"></span>\n" +
    "Deployment is paused.\n" +
    "<span ng-if=\"'deploymentconfigs' | canI : 'update'\">\n" +
    "<a href=\"\" ng-click=\"resumeDeployment()\" role=\"button\">Resume</a>\n" +
    "</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"!(orderedReplicationControllers | hashSize)\" class=\"empty-dc\">\n" +
    "<h2>No deployments.</h2>\n" +
    "<div ng-if=\"imageChangeTriggers.length\">\n" +
    "A new deployment will start automatically when\n" +
    "<span ng-if=\"imageChangeTriggers.length === 1\">\n" +
    "an image is available for\n" +
    "<a ng-href=\"{{urlForImageChangeTrigger(imageChangeTriggers[0], deploymentConfig)}}\">\n" +
    "{{imageChangeTriggers[0].imageChangeParams.from | imageObjectRef : deploymentConfig.metadata.namespace}}</a>.\n" +
    "</span>\n" +
    "<span ng-if=\"imageChangeParams.length > 1\">\n" +
    "one of the images for this deployment config changes.\n" +
    "</span>\n" +
    "</div>\n" +
    "<div ng-if=\"!imageChangeTriggers.length\">\n" +
    "<div ng-if=\"pipeline = pipelinesForDC[deploymentConfig.metadata.name][0]\">\n" +
    "<p>\n" +
    "This deployment config is part of pipeline\n" +
    "<a ng-href=\"{{pipeline | navigateResourceURL}}\">{{pipeline.metadata.name}}</a>.\n" +
    "</p>\n" +
    "<div ng-if=\"('buildconfigs/instantiate' | canI : 'create')\">\n" +
    "<button class=\"btn btn-primary\" ng-click=\"startPipeline(pipeline)\">\n" +
    "Start Pipeline\n" +
    "</button>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"!pipelinesForDC[deploymentConfig.metadata.name].length\">\n" +
    "<p>\n" +
    "No deployments have started for\n" +
    "<a ng-href=\"{{deploymentConfig | navigateResourceURL}}\">{{deploymentConfig.metadata.name}}</a>.\n" +
    "</p>\n" +
    "<button ng-if=\"'deploymentconfigs' | canI : 'update'\" class=\"btn btn-primary\" ng-click=\"startDeployment(deploymentConfig)\">\n" +
    "Start Deployment\n" +
    "</button>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div column flex class=\"shield\" ng-if=\"activeReplicationController\" ng-class=\"{ 'shield-lg': (activeReplicationController | annotation: 'deploymentVersion').length > 3 }\">\n" +
    "<a ng-href=\"{{activeReplicationController | navigateResourceURL}}\">\n" +
    "<span class=\"shield-number\">#{{activeReplicationController | annotation: 'deploymentVersion'}}</span>\n" +
    "</a>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div row class=\"overview-tile-body\">\n" +
    "\n" +
    "<div column class=\"overview-donut\" ng-repeat=\"replicationController in orderedReplicationControllers track by (replicationController | uid)\" ng-class=\"{ latest: isDeploymentLatest(replicationController) }\" ng-if=\"!activeReplicationController || !(isDeploymentLatest(replicationController) && ((replicationController | deploymentStatus) == 'Cancelled' || (replicationController | deploymentStatus) == 'Failed'))\">\n" +
    "<deployment-donut rc=\"replicationController\" deployment-config=\"deploymentConfig\" pods=\"podsByOwnerUID[replicationController.metadata.uid]\" hpa=\"getHPA(deploymentConfig) || getHPA(replicationController)\" limit-ranges=\"limitRanges\" quotas=\"quotas\" cluster-quotas=\"clusterQuotas\" scalable=\"isScalableReplicationController(replicationController)\" alerts=\"alerts\">\n" +
    "</deployment-donut>\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "<div column class=\"overview-donut-connector\" ng-class=\"{'contains-deployment-status-msg':orderedReplicationControllers.length === 1}\" ng-if=\"inProgressDeployment\">\n" +
    "<div ng-if=\"orderedReplicationControllers.length > 1\" class=\"deployment-connector-arrow\">\n" +
    "</div>\n" +
    "<div ng-if=\"orderedReplicationControllers.length === 1\" class=\"deployment-status-msg\">\n" +
    "<status-icon status=\"orderedReplicationControllers[0] | deploymentStatus\"></status-icon>\n" +
    "Deployment&nbsp;#{{orderedReplicationControllers[0] | annotation : 'deploymentVersion'}} {{orderedReplicationControllers[0] | deploymentStatus | lowercase}}\n" +
    "</div>\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "<div column class=\"overview-unsuccessful-state\" ng-if=\"!activeReplicationController && !inProgressDeployment\" ng-switch=\"orderedReplicationControllers[0] | deploymentStatus\">\n" +
    "<div ng-switch-when=\"Cancelled\">\n" +
    "<span class=\"deployment-status-msg\">\n" +
    "<i class=\"fa fa-ban\" aria-hidden=\"true\"></i>\n" +
    "{{deploymentConfig.metadata.name}}\n" +
    "<a ng-href=\"{{orderedReplicationControllers[0] | navigateResourceURL}}\">#{{orderedReplicationControllers[0] | annotation: 'deploymentVersion'}}</a>\n" +
    "cancelled\n" +
    "</span>\n" +
    "</div>\n" +
    "<div ng-switch-when=\"Failed\">\n" +
    "<span class=\"text-danger deployment-status-msg\">\n" +
    "<i class=\"fa fa-times\" aria-hidden=\"true\"></i>\n" +
    "{{deploymentConfig.metadata.name}}\n" +
    "<a ng-href=\"{{orderedReplicationControllers[0] | navigateResourceURL}}\">#{{orderedReplicationControllers[0] | annotation: 'deploymentVersion'}}</a>\n" +
    "failed\n" +
    "</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "<div column class=\"overview-tile-details\" ng-if=\"activeReplicationController && !inProgressDeployment\">\n" +
    "\n" +
    "\n" +
    "<deployment-metrics ng-if=\"showMetrics && !collapse\" pods=\"podsByOwnerUID[activeReplicationController.metadata.uid]\" containers=\"activeReplicationController.spec.template.spec.containers\" profile=\"compact\" class=\"overview-metrics\">\n" +
    "</deployment-metrics>\n" +
    "<pod-template ng-if=\"!showMetrics\" pod-template=\"activeReplicationController.spec.template\"></pod-template>\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/overview/_deployment.html',
    "<div class=\"overview-tile\" ng-class=\"{ 'deployment-in-progress': inProgressDeployment }\">\n" +
    "<ng-include src=\"'views/overview/_service-header.html'\"></ng-include>\n" +
    "<div class=\"overview-tile-header\">\n" +
    "<div class=\"rc-header\">\n" +
    "<div>\n" +
    "Deployment\n" +
    "<a ng-href=\"{{deployment | navigateResourceURL}}\">{{deploymentName}}</a>\n" +
    "<small class=\"overview-timestamp\" ng-if=\"latestReplicaSet\">\n" +
    "<span class=\"hidden-xs\">&ndash;</span>\n" +
    "<span am-time-ago=\"latestReplicaSet.metadata.creationTimestamp\"></span>\n" +
    "</small>\n" +
    "</div>\n" +
    "<div class=\"small truncate\">\n" +
    "<image-names ng-if=\"latestReplicaSet && !inProgressDeployment && showMetrics\" pod-template=\"latestReplicaSet.spec.template\" pods=\"podsByOwnerUID[latestReplicaSet.metadata.uid]\">\n" +
    "</image-names>\n" +
    "</div>\n" +
    "<div ng-if=\"inProgressDeployment\" class=\"small\">\n" +
    "{{deployment.spec.strategy.type | sentenceCase}}\n" +
    "<ellipsis-pulser color=\"dark\" size=\"sm\" display=\"inline\" msg=\"in progress\"></ellipsis-pulser>\n" +
    "</div>\n" +
    "<div ng-if=\"deployment.spec.paused\" class=\"small\">\n" +
    "<span class=\"pficon pficon-info\" aria-hidden=\"true\"></span>\n" +
    "Deployment is paused.\n" +
    "<span ng-if=\"{ group: 'extensions', resource: 'deployments' } | canI : 'update'\">\n" +
    "<a href=\"\" ng-click=\"resumeDeployment()\" role=\"button\">Resume</a>\n" +
    "</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div column flex class=\"shield\" ng-if=\"latestReplicaSet && latestRevision && !inProgressDeployment\" ng-class=\"{ 'shield-lg': latestRevision.length > 3 }\">\n" +
    "<a ng-href=\"{{latestReplicaSet | navigateResourceURL}}\">\n" +
    "<span class=\"shield-number\">#{{latestRevision}}</span>\n" +
    "</a>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div row class=\"overview-tile-body\">\n" +
    "\n" +
    "<div column class=\"overview-donut\" ng-repeat=\"replicaSet in replicaSets | limitTo : 2 track by (replicaSet | uid)\" ng-class=\"{ latest: replicaSet === latestReplicaSet }\">\n" +
    "<deployment-donut deployment=\"deployment\" rc=\"replicaSet\" pods=\"podsByOwnerUID[replicaSet.metadata.uid]\" hpa=\"getHPA(deployment) || getHPA(replicaSet)\" limit-ranges=\"limitRanges\" scalable=\"replicaSet === latestReplicaSet && !inProgressDeployment\" alerts=\"alerts\">\n" +
    "</deployment-donut>\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "<div column class=\"overview-donut-connector\" ng-if=\"inProgressDeployment\">\n" +
    "<div class=\"deployment-connector-arrow\"></div>\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "<div column class=\"overview-tile-details\" ng-if=\"latestReplicaSet && !inProgressDeployment\">\n" +
    "\n" +
    "\n" +
    "<deployment-metrics ng-if=\"showMetrics && !collapse\" pods=\"podsByOwnerUID[latestReplicaSet.metadata.uid]\" containers=\"latestReplicaSet.spec.template.spec.containers\" profile=\"compact\" class=\"overview-metrics\">\n" +
    "</deployment-metrics>\n" +
    "<pod-template ng-if=\"!showMetrics\" pod-template=\"latestReplicaSet.spec.template\"></pod-template>\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/overview/_image-names.html',
    "<span>{{podTemplate.spec.containers[0].image | imageStreamName}}</span>\n" +
    "<span ng-repeat=\"id in imageIDs\" title=\"{{id}}\">\n" +
    "<span class=\"hash\">{{id | stripSHAPrefix | limitTo: 7}}</span><span ng-if=\"!$last\">,</span>\n" +
    "</span>\n" +
    "<span ng-if=\"podTemplate.spec.containers.length > 1\"> and {{podTemplate.spec.containers.length - 1}} other image<span ng-if=\"podTemplate.spec.containers.length > 2\">s</span></span>"
  );


  $templateCache.put('views/overview/_pod.html',
    "<div class=\"overview-tile\" ng-if=\"pod.kind === 'Pod'\">\n" +
    "<ng-include src=\"'views/overview/_service-header.html'\"></ng-include>\n" +
    "<div class=\"rc-header\"> \n" +
    "<div>\n" +
    "Pod\n" +
    "<a ng-href=\"{{pod | navigateResourceURL}}\">{{pod.metadata.name}}</a>\n" +
    "<small class=\"overview-timestamp\">\n" +
    "<span class=\"hidden-xs\">&ndash;</span>\n" +
    "<span am-time-ago=\"pod.metadata.creationTimestamp\"></span>\n" +
    "</small>\n" +
    "</div>\n" +
    "<div class=\"small\">\n" +
    "<image-names ng-if=\"showMetrics\" pod-template=\"pod\" pods=\"[pod]\"></image-names>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div row class=\"overview-tile-body\">\n" +
    "<div column class=\"overview-donut\">\n" +
    "<pod-donut pods=\"[pod]\" class=\"clickable\" ng-click=\"viewPod()\">\n" +
    "</pod-donut>\n" +
    "\n" +
    "<a href=\"\" class=\"sr-only\" ng-click=\"viewPod()\" role=\"button\">\n" +
    "View pod\n" +
    "</a>\n" +
    "</div>\n" +
    "<div column class=\"overview-tile-details\">\n" +
    "<deployment-metrics ng-if=\"showMetrics && !collapse\" pods=\"[pod]\" containers=\"pod.spec.containers\" profile=\"compact\" class=\"overview-metrics\">\n" +
    "</deployment-metrics>\n" +
    "<pod-template ng-if=\"!showMetrics\" pod-template=\"pod\"></pod-template>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/overview/_service-group.html',
    "<div class=\"service-group\">\n" +
    "<div class=\"service-group-header\" ng-if=\"service.metadata.labels.app || displayRoute\" ng-click=\"toggleCollapse($event)\" ng-class=\"{ 'has-app-label': appName }\">\n" +
    "<h2 ng-if=\"appName\" class=\"app-name\">\n" +
    "<i class=\"fa fa-angle-down fa-fw\" aria-hidden=\"true\" ng-if=\"!collapse\"></i>\n" +
    "<i class=\"fa fa-angle-right fa-fw\" aria-hidden=\"true\" ng-if=\"collapse\"></i>\n" +
    "{{appName | startCase}}\n" +
    "<span ng-if=\"isDuplicateApp(appName)\" class=\"small\">\n" +
    "{{service.metadata.name}}\n" +
    "</span>\n" +
    "</h2>\n" +
    "<h3 class=\"route-title truncate\">\n" +
    "<span ng-if=\"appName && (displayRoute | isWebRoute)\">\n" +
    "<i class=\"fa fa-external-link small\" aria-hidden=\"true\"></i>\n" +
    "</span>\n" +
    "<span ng-if=\"!appName\">\n" +
    "<i class=\"fa fa-angle-down fa-fw\" aria-hidden=\"true\" ng-if=\"!collapse\"></i>\n" +
    "<i class=\"fa fa-angle-right fa-fw\" aria-hidden=\"true\" ng-if=\"collapse\"></i>\n" +
    "</span>\n" +
    "<a ng-if=\"displayRoute | isWebRoute\" target=\"_blank\" ng-href=\"{{displayRoute | routeWebURL}}\">{{displayRoute | routeLabel}}</a>\n" +
    "<span ng-if=\"displayRoute && !(displayRoute | isWebRoute)\" class=\"non-web-route\">{{displayRoute | routeLabel}}</span>\n" +
    "<span ng-if=\"routeWarningsByService[service.metadata.name] && routesByService[service.metadata.name].length === 1\">\n" +
    "<route-warnings warnings=\"routeWarningsByService[service.metadata.name]\"></route-warnings>\n" +
    "</span>\n" +
    "<small ng-if=\"(primaryServiceRoutes | hashSize) > 1\" class=\"other-routes-msg\">\n" +
    "and\n" +
    "<a ng-href=\"project/{{projectName}}/browse/routes\">{{(primaryServiceRoutes | hashSize) - 1}} other route<span ng-if=\"(primaryServiceRoutes | hashSize) > 2\">s</span></a>\n" +
    "</small>\n" +
    "</h3>\n" +
    "<span ng-if=\"!displayRoute\" class=\"create-route-link\">\n" +
    "<a ng-if=\"'routes' | canI : 'create'\" ng-href=\"project/{{service.metadata.namespace}}/create-route?service={{service.metadata.name}}\">Create Route</a>\n" +
    "</span>\n" +
    "</div>\n" +
    "<div>\n" +
    "<div class=\"service-group-triggers\">\n" +
    "<div ng-repeat=\"dc in allDeploymentConfigsInGroup\">\n" +
    "<div row ng-repeat=\"pipeline in recentPipelinesByDC[dc.metadata.name] | orderObjectsByDate : true track by (pipeline | uid)\" class=\"build-pipeline-wrapper animate-repeat animate-slide\">\n" +
    "<build-pipeline flex build=\"pipeline\" expand-only-running=\"true\" build-config-name-on-expanded=\"true\"></build-pipeline>\n" +
    "</div>\n" +
    "<div>\n" +
    "<triggers triggers=\"dc.spec.triggers\" builds-by-output-image=\"recentBuildsByOutputImage\" namespace=\"dc.metadata.namespace\"></triggers>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "\n" +
    "<service-group-notifications ng-if=\"service\"></service-group-notifications>\n" +
    "<div uib-collapse=\"collapse\" class=\"service-group-body\">\n" +
    "\n" +
    "<div class=\"overview-services\" ng-class=\"{ 'single-alternate-service': (alternateServices | hashSize) === 1 && totalWeight }\">\n" +
    "<overview-service ng-init=\"isPrimary = true\" class=\"primary-service\"></overview-service>\n" +
    "<overview-service ng-init=\"isAlternate = true\" ng-repeat=\"service in alternateServices\" class=\"alternate-service\">\n" +
    "</overview-service>\n" +
    "<overview-service ng-init=\"isChild = true\" ng-repeat=\"service in childServices\">\n" +
    "</overview-service>\n" +
    "<div flex column ng-if=\"alternateServices.length === 0 && childServices.length === 0 && service\" class=\"no-child-services-block\">\n" +
    "<div class=\"no-child-services-message\">\n" +
    "<div class=\"empty-tile\">\n" +
    "<h2>No grouped services.</h2>\n" +
    "<p>\n" +
    "No services are grouped with <a ng-href=\"{{service | navigateResourceURL}}\">{{service.metadata.name}}</a>.\n" +
    "<span ng-if=\"(services | hashSize) > 1 && ('services' | canI : 'update')\">Add a service to group them together.</span>\n" +
    "</p>\n" +
    "<div ng-if=\"(services | hashSize) > 1 && ('services' | canI : 'update')\">\n" +
    "<button class=\"btn btn-primary\" ng-click=\"linkService()\">\n" +
    "Group Service\n" +
    "</button>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/overview/_service-header.html',
    "<div row class=\"service-title\" ng-if=\"service\">\n" +
    "<div class=\"service-name\">\n" +
    "<span class=\"pficon pficon-service\" aria-hidden=\"true\" title=\"Service\"></span>\n" +
    "<span class=\"sr-only\">Service</span>\n" +
    "<a ng-href=\"{{service | navigateResourceURL}}\">{{service.metadata.name}}</a>\n" +
    "\n" +
    "<span ng-if=\"!isAlternate && alternateServices.length && !isChild && ('services' | canI : 'update')\" class=\"small mar-left-sm mar-right-sm\">\n" +
    "<ng-include src=\"'views/overview/_service-linking-button.html'\"></ng-include>\n" +
    "</span>\n" +
    "</div>\n" +
    "<div ng-if=\"alternateServices.length && !isChild\" class=\"service-metadata\">\n" +
    "<ng-include src=\"'views/overview/_traffic-percent.html'\"></ng-include>\n" +
    "</div>\n" +
    "\n" +
    "<div ng-if=\"(!alternateServices.length || isChild) && ('services' | canI : 'update')\">\n" +
    "<ng-include src=\"'views/overview/_service-linking-button.html'\"></ng-include>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/overview/_service-linking-button.html',
    " <a href=\"\" ng-if=\"isPrimary && (services | hashSize) > ((childServices | hashSize) + 1)\" ng-click=\"linkService()\" role=\"button\" ng-attr-title=\"Group service to {{service.metadata.name}}\"><i class=\"fa fa-chain action-button link-service-button\" aria-hidden=\"true\"></i><span class=\"sr-only\">Group service to {{service.metadata.name}}</span></a>\n" +
    "<a href=\"\" ng-if=\"isChild\" ng-click=\"removeLink(service)\" role=\"button\" ng-attr-title=\"Remove {{service.metadata.name}} from service group\"><i class=\"fa fa-chain-broken action-button link-service-button\" aria-hidden=\"true\"></i><span class=\"sr-only\">Remove {{service.metadata.name}} from service group</span></a>"
  );


  $templateCache.put('views/overview/_service.html',
    "<div ng-if=\"!tileCount\" class=\"no-deployments-block\">\n" +
    "<div column class=\"no-deployments-message\">\n" +
    "<ng-include src=\"'views/overview/_service-header.html'\"></ng-include>\n" +
    "<div class=\"empty-tile\">\n" +
    "<h2>No deployments or pods.</h2>\n" +
    "<p>\n" +
    "Service\n" +
    "<a ng-href=\"{{service | navigateResourceURL}}\">{{service.metadata.name}}</a>\n" +
    "does not route to any deployments or pods.\n" +
    "</p>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-attr-row=\"{{!service ? '' : undefined}}\" ng-attr-wrap=\"{{!service ? '' : undefined}}\" ng-if=\"tileCount\" class=\"deployment-block\" ng-class=\"{\n" +
    "       'no-service': !service,\n" +
    "       'service-multiple-targets': tileCount > 1\n" +
    "     }\">\n" +
    "<div ng-repeat=\"deploymentConfig in deploymentConfigs track by (deploymentConfig | uid)\" class=\"overview-tile-wrapper\">\n" +
    "\n" +
    "<overview-deployment-config></overview-deployment-config>\n" +
    "\n" +
    "</div>\n" +
    "<div ng-repeat=\"set in replicationControllers track by (set | uid)\" class=\"overview-tile-wrapper\">\n" +
    "\n" +
    "<overview-set></overview-set>\n" +
    "\n" +
    "</div>\n" +
    "<div ng-repeat=\"(deploymentName, replicaSets) in visibleReplicaSetsByDeployment track by deploymentName\" class=\"overview-tile-wrapper\">\n" +
    "\n" +
    "<overview-deployment ng-if=\"deploymentName\"></overview-deployment>\n" +
    "\n" +
    "\n" +
    "<div ng-if=\"!deploymentName\" ng-repeat=\"set in replicaSets | orderObjectsByDate : true track by (set | uid)\" class=\"overview-tile-wrapper\">\n" +
    "<overview-set></overview-set>\n" +
    "</div>\n" +
    "\n" +
    "</div>\n" +
    "<div class=\"overview-tile-wrapper\" ng-repeat=\"set in statefulSetsByService[service.metadata.name] track by (set | uid)\">\n" +
    "<overview-set></overview-set>\n" +
    "</div>\n" +
    "\n" +
    "<div ng-repeat=\"pod in monopodsByService[service.metadata.name || ''] | orderObjectsByDate : true track by (pod | uid)\" class=\"overview-tile-wrapper\">\n" +
    "<overview-pod></overview-pod>\n" +
    "</div>\n" +
    "\n" +
    "</div>"
  );


  $templateCache.put('views/overview/_set.html',
    "<div class=\"overview-tile\">\n" +
    "<ng-include src=\"'views/overview/_service-header.html'\"></ng-include>\n" +
    "<div class=\"overview-tile-header\">\n" +
    "<div class=\"rc-header\">\n" +
    "<div>\n" +
    "{{set.kind | humanizeKind : true}}\n" +
    "<a ng-href=\"{{set | navigateResourceURL}}\">{{set.metadata.name}}</a>\n" +
    "<small class=\"overview-timestamp\">\n" +
    "<span class=\"hidden-xs\">&ndash;</span>\n" +
    "<span am-time-ago=\"set.metadata.creationTimestamp\"></span>\n" +
    "</small>\n" +
    "</div>\n" +
    "<div class=\"small\">\n" +
    "<image-names ng-if=\"showMetrics\" pod-template=\"set.spec.template\" pods=\"podsByOwnerUID[set.metadata.uid]\">\n" +
    "</image-names>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div row class=\"overview-tile-body\">\n" +
    "<div column class=\"overview-donut\" ng-class=\"{ latest: isDeploymentLatest(set) }\">\n" +
    "<deployment-donut rc=\"set\" deployment-config=\"deploymentConfigs[dcName]\" pods=\"podsByOwnerUID[set.metadata.uid]\" hpa=\"getHPA(set)\" limit-ranges=\"limitRanges\" quotas=\"quotas\" cluster-quotas=\"clusterQuotas\" scalable=\"isScalableReplicationController(set)\" alerts=\"alerts\">\n" +
    "</deployment-donut>\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "<div column class=\"overview-tile-details\">\n" +
    "<deployment-metrics ng-if=\"showMetrics && !collapse\" pods=\"podsByOwnerUID[set.metadata.uid]\" containers=\"set.spec.template.spec.containers\" profile=\"compact\" class=\"overview-metrics\">\n" +
    "</deployment-metrics>\n" +
    "<pod-template ng-if=\"!showMetrics\" pod-template=\"set.spec.template\"></pod-template>\n" +
    "</div>\n" +
    "\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/overview/_traffic-percent.html',
    "<div ng-if=\"!totalWeight\">\n" +
    "No Traffic\n" +
    "</div>\n" +
    "<div ng-if=\"totalWeight\">\n" +
    "<span class=\"visible-xs visible-sm\">\n" +
    "Traffic {{(weightByService[service.metadata.name] / totalWeight) | percent}}\n" +
    "</span>\n" +
    "<div class=\"hidden-xs hidden-sm\">\n" +
    "<span class=\"traffic-label\">Traffic</span>\n" +
    "\n" +
    "<div class=\"progress progress-sm\" ng-style=\"{ width: ((weightByService[service.metadata.name] / totalWeight * 250) | number) + 'px'}\">\n" +
    "<div class=\"progress-bar\">\n" +
    "<span>\n" +
    "{{(weightByService[service.metadata.name] / totalWeight) | percent}}\n" +
    "</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/pipelines.html',
    "<project-header class=\"top-header\"></project-header>\n" +
    "<project-page>\n" +
    "\n" +
    "<div class=\"middle-section\">\n" +
    "<div class=\"middle-container\">\n" +
    "<div class=\"middle-header\">\n" +
    "<div class=\"container-fluid\">\n" +
    "<div class=\"page-header page-header-bleed-right page-header-bleed-left\">\n" +
    "<h1>\n" +
    "Pipelines\n" +
    "<span class=\"page-header-link\">\n" +
    "<a ng-href=\"{{'pipeline-builds' | helpLink}}\" target=\"_blank\">\n" +
    "Learn More <i class=\"fa fa-external-link\" aria-hidden=\"true\"></i>\n" +
    "</a>\n" +
    "</span>\n" +
    "</h1>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"middle-content pipelines-page\">\n" +
    "<div class=\"container-fluid\">\n" +
    "<alerts alerts=\"alerts\"></alerts>\n" +
    "<div class=\"row\">\n" +
    "<div class=\"col-md-12\">\n" +
    "<div ng-if=\"!(buildConfigs | hashSize)\" class=\"mar-top-lg\">\n" +
    "<div ng-if=\"!buildConfigsLoaded\">\n" +
    "Loading...\n" +
    "</div>\n" +
    "<div ng-if=\"buildConfigsLoaded\" class=\"empty-state-message text-center\">\n" +
    "<h2>No pipelines.</h2>\n" +
    "<div ng-if=\"project.metadata.name | canIAddToProject\">\n" +
    "<p>\n" +
    "No pipelines have been added to project {{projectName}}.\n" +
    "<br>\n" +
    "Learn more about\n" +
    "<a ng-href=\"{{ 'pipeline-builds' | helpLink}}\" target=\"_blank\">Pipeline Builds</a>\n" +
    "and the\n" +
    "<a ng-href=\"{{ 'pipeline-plugin' | helpLink}}\" target=\"_blank\">OpenShift Pipeline Plugin</a>.\n" +
    "</p>\n" +
    "<p ng-if=\"(project.metadata.name | canIAddToProject) && createSampleURL\">\n" +
    "<a ng-href=\"{{createSampleURL}}\" class=\"btn btn-lg btn-primary\">\n" +
    "Create Sample Pipeline\n" +
    "</a>\n" +
    "</p>\n" +
    "</div>\n" +
    "<div ng-if=\"!(project.metadata.name | canIAddToProject)\">\n" +
    "<ng-include src=\"'views/_request-access.html'\"></ng-include>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-repeat=\"(buildConfigName, buildConfig) in buildConfigs\" ng-if=\"!buildConfig || (buildConfig | isJenkinsPipelineStrategy)\" class=\"animate-repeat\">\n" +
    "<div ng-if=\"buildConfig\">\n" +
    "<div class=\"pull-right\">\n" +
    "<button class=\"btn btn-default\" ng-if=\"'buildconfigs/instantiate' | canI : 'create'\" ng-click=\"startBuild(buildConfigName)\">\n" +
    "Start Pipeline\n" +
    "</button>\n" +
    "</div>\n" +
    "<h2 class=\"mar-top-none\">\n" +
    "<a ng-href=\"{{buildConfig | navigateResourceURL}}\">{{buildConfigName}}</a>\n" +
    "<small>created <span am-time-ago=\"buildConfig.metadata.creationTimestamp\"></span></small>\n" +
    "</h2>\n" +
    "<div ng-if=\"buildConfig.spec.source.git.uri\">\n" +
    "Source Repository:\n" +
    "<span class=\"word-break\" ng-if=\"buildConfigs[buildConfigName].spec.source.type == 'Git'\"><osc-git-link uri=\"buildConfigs[buildConfigName].spec.source.git.uri\" ref=\"buildConfigs[buildConfigName].spec.source.git.ref\" context-dir=\"buildConfigs[buildConfigName].spec.source.contextDir\">{{buildConfigs[buildConfigName].spec.source.git.uri}}</osc-git-link></span>\n" +
    "</div>\n" +
    "</div>\n" +
    "\n" +
    "<div ng-if=\"!buildConfig\">\n" +
    "<h2>{{buildConfigName}}</h2>\n" +
    "\n" +
    "<div ng-if=\"buildConfigsLoaded\" class=\"alert alert-warning\">\n" +
    "<span class=\"pficon pficon-warning-triangle-o\" aria-hidden=\"true\"></span>\n" +
    "<span class=\"sr-only\">Warning:</span>\n" +
    "Build config <strong>{{buildConfigName}}</strong> no longer exists.\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"buildsLoaded && !(interestingBuildsByConfig[buildConfigName] | hashSize)\">\n" +
    "<p>\n" +
    "No pipeline builds have run for {{buildConfigName}}.\n" +
    "<span ng-if=\"buildConfig.spec.strategy.jenkinsPipelineStrategy.jenkinsfile\">\n" +
    "View the <a ng-href=\"{{(buildConfig | navigateResourceURL) + '?tab=configuration'}}\">Jenkinsfile</a> to see what stages will run.\n" +
    "</span>\n" +
    "<span ng-if=\"buildConfig.spec.strategy.jenkinsPipelineStrategy.jenkinsfilePath\">\n" +
    "View the file <code>{{buildConfig.spec.strategy.jenkinsPipelineStrategy.jenkinsfilePath}}</code> in the\n" +
    "<a ng-if=\"buildConfig | jenkinsfileLink\" ng-href=\"buildConfig | jenkinsfileLink\">source repository</a>\n" +
    "<span ng-if=\"!(buildConfig | jenkinsfileLink)\">source repository</span>\n" +
    "to see what stages will run.\n" +
    "</span>\n" +
    "</p>\n" +
    "</div>\n" +
    "<div ng-if=\"interestingBuildsByConfig[buildConfigName] | hashSize\">\n" +
    "<div ng-if=\"!(statsByConfig[buildConfigName].avgDuration | isNil)\" class=\"hidden-xs pull-right text-muted\">\n" +
    "Average Duration: {{statsByConfig[buildConfigName].avgDuration | timeOnlyDuration}}\n" +
    "</div>\n" +
    "<h4>\n" +
    "Recent Runs\n" +
    "<small ng-if=\"!(statsByConfig[buildConfigName].avgDuration | isNil)\" class=\"visible-xs-block mar-top-xs text-muted\">\n" +
    "Average Duration: {{statsByConfig[buildConfigName].avgDuration | timeOnlyDuration}}\n" +
    "</small>\n" +
    "</h4>\n" +
    "<div ng-repeat=\"build in (interestingBuildsByConfig[buildConfigName] | orderObjectsByDate : true) track by (build | uid)\" class=\"animate-repeat\">\n" +
    "<build-pipeline build=\"build\"></build-pipeline>\n" +
    "</div>\n" +
    "<div ng-if=\"buildConfig\" class=\"mar-top-sm mar-bottom-xl\">\n" +
    "<a ng-href=\"{{buildConfigs[buildConfigName] | navigateResourceURL}}\">View Pipeline Runs</a>\n" +
    "<span ng-if=\"'buildconfigs' | canI : 'update'\">\n" +
    "<span class=\"action-divider\">|</span>\n" +
    "<a ng-href=\"{{buildConfig | editResourceURL}}\" role=\"button\">Edit Pipeline</a>\n" +
    "</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</project-page>"
  );


  $templateCache.put('views/pods.html',
    "<project-header class=\"top-header\"></project-header>\n" +
    "<project-page>\n" +
    "\n" +
    "<div class=\"middle-section\">\n" +
    "<div class=\"middle-container\">\n" +
    "<div class=\"middle-header header-toolbar\">\n" +
    "<div class=\"container-fluid\">\n" +
    "<div class=\"page-header page-header-bleed-right page-header-bleed-left\">\n" +
    "<h1>\n" +
    "Pods\n" +
    "<span class=\"page-header-link\">\n" +
    "<a ng-href=\"{{'pods' | helpLink}}\" target=\"_blank\">\n" +
    "Learn More <i class=\"fa fa-external-link\" aria-hidden=\"true\"></i>\n" +
    "</a>\n" +
    "</span>\n" +
    "</h1>\n" +
    "</div>\n" +
    "<div ng-if=\"!renderOptions.showGetStarted\" class=\"data-toolbar\">\n" +
    "<div class=\"data-toolbar-filter\">\n" +
    "<project-filter></project-filter>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"middle-content\">\n" +
    "<div class=\"container-fluid\">\n" +
    "<alerts alerts=\"alerts\"></alerts>\n" +
    "<div class=\"row\">\n" +
    "<div class=\"col-md-12\">\n" +
    "<pods-table pods=\"pods\" empty-message=\"emptyMessage\"></pods-table>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</project-page>"
  );


  $templateCache.put('views/project.html',
    "<project-header class=\"top-header\"></project-header>\n" +
    "<project-page class=\"project-overview-page\">\n" +
    "\n" +
    "<div class=\"middle-section\">\n" +
    "<div class=\"middle-container\">\n" +
    "<div class=\"middle-header header-toolbar\">\n" +
    "<div class=\"container-fluid\">\n" +
    "<tasks></tasks>\n" +
    "<div ng-if=\"renderOptions.showToolbar\" class=\"page-header page-header-bleed-right page-header-bleed-left\">\n" +
    "<h1 title=\"Overview\">Overview</h1>\n" +
    "</div>\n" +
    "\n" +
    "<alerts alerts=\"alerts\"></alerts>\n" +
    "<div ng-if=\"renderOptions.showToolbar\" class=\"data-toolbar\">\n" +
    "<div class=\"data-toolbar-filter\">\n" +
    "<project-filter></project-filter>\n" +
    "</div>\n" +
    "<div class=\"data-toolbar-views pad-left-lg\">\n" +
    "<div class=\"actions\">\n" +
    "<div class=\"btn-group\">\n" +
    "<label class=\"btn btn-default\" ng-model=\"$parent.overviewMode\" uib-btn-radio=\"'tiles'\" title=\"Tile View\">\n" +
    "<i class=\"fa fa-list\"></i>\n" +
    "</label>\n" +
    "<label class=\"btn btn-default\" ng-model=\"$parent.overviewMode\" uib-btn-radio=\"'topology'\" title=\"Topology View\">\n" +
    "<i class=\"pficon pficon-topology\"></i>\n" +
    "</label>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"middle-content surface-shaded\">\n" +
    "<div class=\"container-fluid surface-shaded\">\n" +
    "<div class=\"row\">\n" +
    "<div class=\"col-md-12\">\n" +
    "\n" +
    "<div ng-if=\"(services | hashSize) === 0 && (monopodsByService[''] | hashSize) === 0 && (deploymentsByServiceByDeploymentConfig[''] | hashSize) === 0\">\n" +
    "\n" +
    "<div ng-if=\"renderOptions.showGetStarted\" class=\"empty-project text-center\">\n" +
    "<h2>Get started with your project.</h2>\n" +
    "<p class=\"gutter-top\">\n" +
    "Use your source or an example repository to build an application image, or add components like databases and message queues.\n" +
    "</p>\n" +
    "<p class=\"gutter-top\">\n" +
    "<a ng-href=\"project/{{projectName}}/create\" class=\"btn btn-lg btn-primary\">\n" +
    "Add to Project\n" +
    "</a>\n" +
    "</p>\n" +
    "</div>\n" +
    "\n" +
    "<div ng-if=\"!renderOptions.showGetStarted\">\n" +
    "<em>{{emptyMessage}}</em>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"overviewMode == 'topology' && !renderOptions.showGetStarted\" class=\"kube-topology-block\">\n" +
    "<kubernetes-topology-graph bottom-of-window=\"1\" items=\"topologyItems\" relations=\"topologyRelations\" kinds=\"topologyKinds\" selection=\"topologySelection\">\n" +
    "</kubernetes-topology-graph>\n" +
    "<svg class=\"kube-topology\" hidden>\n" +
    "<defs>\n" +
    "<g class=\"Pod\" id=\"vertex-Pod\">\n" +
    "<circle r=\"16\"></circle>\n" +
    "<text y=\"6\" x=\"0.5\">&#xf1b3;</text>\n" +
    "</g>\n" +
    "<g class=\"Service\" id=\"vertex-Service\">\n" +
    "<circle r=\"16\"></circle>\n" +
    "<text y=\"10\" x=\"1\">&#xe61e;</text>\n" +
    "</g>\n" +
    "<g class=\"ReplicationController\" id=\"vertex-ReplicationController\">\n" +
    "<circle r=\"16\"></circle>\n" +
    "<text y=\"9\">&#xe624;</text>\n" +
    "</g>\n" +
    "<g class=\"DeploymentConfig\" id=\"vertex-DeploymentConfig\">\n" +
    "<circle r=\"16\"></circle>\n" +
    "<text y=\"8\">&#xf013;</text>\n" +
    "</g>\n" +
    "<g class=\"Route\" id=\"vertex-Route\">\n" +
    "<circle r=\"16\"></circle>\n" +
    "<text y=\"9\">&#xe625;</text>\n" +
    "</g>\n" +
    "</defs>\n" +
    "</svg>\n" +
    "</div>\n" +
    "<div ng-if=\"overviewMode == 'tiles'\">\n" +
    "\n" +
    "<section ng-repeat=\"(serviceId, service) in services\" class=\"components components-group\" ng-attr-id=\"service-{{serviceId}}\">\n" +
    "<div class=\"osc-object components-panel service\" ng-init=\"numPorts = service.spec.ports.length\" kind=\"Service\" resource=\"service\">\n" +
    "<div class=\"component-block\">\n" +
    "<div class=\"component\">\n" +
    "<div ng-attr-title=\"{{service | serviceImplicitDNSName}}\" class=\"component-label\">\n" +
    "\n" +
    "Service <span ng-if=\"displayRouteByService[serviceId]\">: <a class=\"subtle-link service\" href=\"{{service | navigateResourceURL}}\">{{serviceId}}</a></span>\n" +
    "</div>\n" +
    "\n" +
    "<h2 ng-if=\"displayRouteByService[serviceId]\" ng-init=\"otherRoutes = (routesByService[serviceId] | hashSize) - 1\">\n" +
    "<span ng-if=\"(displayRouteByService[serviceId] | isWebRoute)\">\n" +
    "\n" +
    "<a href=\"{{displayRouteByService[serviceId] | routeWebURL}}\" class=\"route\" target=\"_blank\">{{displayRouteByService[serviceId] | routeLabel}}</a>\n" +
    "</span>\n" +
    "\n" +
    "<span ng-if=\"!(displayRouteByService[serviceId] | isWebRoute)\" class=\"route\">\n" +
    "{{displayRouteByService[serviceId] | routeLabel}}\n" +
    "</span>\n" +
    "<span class=\"small\" ng-if=\"otherRoutes\">\n" +
    "(and\n" +
    "<a href=\"project/{{projectName}}/browse/routes\"><span ng-if=\"otherRoutes === 1\">one other route</span><span ng-if=\"otherRoutes > 1\">{{otherRoutes}} other routes</span></a>)\n" +
    "</span>\n" +
    "<span ng-if=\"!otherRoutes\">\n" +
    "<route-warnings warnings=\"routeWarningsByService[serviceId][displayRouteByService[serviceId].metadata.name]\"></route-warnings>\n" +
    "</span>\n" +
    "<div ng-if=\"(routeWarningsByService[serviceId] | hashSize) > 0 && otherRoutes\">\n" +
    "<small>\n" +
    "<span class=\"pficon pficon-warning-triangle-o\" aria-hidden=\"true\"></span>\n" +
    "This service has <a href=\"project/{{projectName}}/browse/routes\">routes</a> with warnings.\n" +
    "</small>\n" +
    "</div>\n" +
    "</h2>\n" +
    "\n" +
    "\n" +
    "<h2 ng-if=\"!displayRouteByService[serviceId]\">\n" +
    "<a class=\"service\" href=\"{{service | navigateResourceURL}}\">{{serviceId}}</a>\n" +
    "</h2>\n" +
    "</div>\n" +
    "<div class=\"component meta-data\">\n" +
    "<span ng-if=\"numPorts\" class=\"ports\">\n" +
    "\n" +
    "<span ng-repeat=\"portMapping in service.spec.ports | orderBy:'port' | limitTo:2\">\n" +
    "\n" +
    "<span class=\"port-mappings\">\n" +
    "\n" +
    "<span ng-attr-title=\"{{portMapping.name}}\">{{portMapping.port}}/{{portMapping.protocol}}</span>&#8201;&#8594;&#8201;{{portMapping.targetPort}}<span ng-if=\"$index < (numPorts - 1)\">, </span></span>\n" +
    "</span>\n" +
    "<span ng-if=\"numPorts > 2\" ng-init=\"numRemaining = numPorts - 2\" class=\"more-ports\">\n" +
    "and {{numRemaining}} {{numRemaining == 1 ? \"other\" : \"others\"}}\n" +
    "</span>\n" +
    "</span>\n" +
    "<div ng-if=\"!displayRouteByService[serviceId]\" class=\"add-route-link\">\n" +
    "<a ng-href=\"project/{{project.metadata.name}}/create-route?service={{service.metadata.name}}\">Create Route</a>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "\n" +
    "<div ng-repeat=\"(deploymentConfigId, deploymentConfig) in deploymentConfigsByService[serviceId]\" ng-if=\"!deploymentsByServiceByDeploymentConfig[serviceId][deploymentConfigId]\">\n" +
    "\n" +
    "<triggers triggers=\"deploymentConfig.spec.triggers\" builds-by-output-image=\"recentBuildsByOutputImage\" namespace=\"projectName\"></triggers>\n" +
    "</div>\n" +
    "\n" +
    "<div ng-repeat=\"(deploymentConfigId, deployments) in deploymentsByServiceByDeploymentConfig[serviceId]\">\n" +
    "\n" +
    "<div ng-if=\"deploymentConfigsByService[serviceId][deploymentConfigId]\">\n" +
    "\n" +
    "<triggers triggers=\"deploymentConfigsByService[serviceId][deploymentConfigId].spec.triggers\" builds-by-output-image=\"recentBuildsByOutputImage\" namespace=\"projectName\"></triggers>\n" +
    "</div>\n" +
    "<div ng-repeat=\"deployment in deployments | orderObjectsByDate : true track by (deployment | uid)\" ng-if=\"isVisibleDeployment(deployment)\" class=\"animate-repeat\">\n" +
    "\n" +
    "<topology-deployment rc=\"deployment\" deployment-config-id=\"deploymentConfigId\" deployment-config-missing=\"deploymentConfigs && !deploymentConfigs[deploymentConfigId]\" deployment-config-different-service=\"deploymentConfigs[deploymentConfigId] && !deploymentConfigsByService[serviceId][deploymentConfigId]\" deployment-config=\"deploymentConfigs[deploymentConfigId]\" scalable=\"isScalable(deployment, deploymentConfigId)\" hpa=\"getHPA(deployment.metadata.name, deploymentConfigId)\" limit-ranges=\"limitRanges\" project=\"project\" images-by-docker-reference=\"imagesByDockerReference\" builds=\"builds\" pods=\"podsByDeployment[deployment.metadata.name]\" alerts=\"alerts\">\n" +
    "</topology-deployment>\n" +
    "</div>\n" +
    "</div>\n" +
    "\n" +
    "<div ng-repeat=\"pod in monopodsByService[serviceId] track by (pod | uid)\">\n" +
    "<overview-monopod pod=\"pod\"></overview-monopod>\n" +
    "</div>\n" +
    "\n" +
    "<div ng-if=\"(podsByService[serviceId] | hashSize) === 0 && (deploymentsByServiceByDeploymentConfig[serviceId] | hashSize) === 0\" class=\"osc-object components-panel deployment-block deployments none\">\n" +
    "<span class=\"pficon pficon-info\"></span> There are no pods or deployments for this service.\n" +
    "</div>\n" +
    "</section>\n" +
    "\n" +
    "<section ng-repeat=\"(deploymentConfigId, deployments) in deploymentsByServiceByDeploymentConfig['']\" class=\"components\">\n" +
    "<div ng-repeat=\"(deploymentId, deployment) in deploymentsByServiceByDeploymentConfig[''][deploymentConfigId] track by (deployment | uid)\" ng-if=\"isVisibleDeployment(deployment)\">\n" +
    "<div class=\"builds-no-service\" ng-if=\"deploymentConfigs[deploymentConfigId] && deploymentConfigsByService[''][deploymentConfigId]\">\n" +
    "\n" +
    "<triggers triggers=\"deploymentConfigs[deploymentConfigId].spec.triggers\" builds-by-output-image=\"recentBuildsByOutputImage\" namespace=\"projectName\"></triggers>\n" +
    "</div>\n" +
    "\n" +
    "<topology-deployment rc=\"deployment\" deployment-config-id=\"deploymentConfigId\" deployment-config-missing=\"deploymentConfigs && !deploymentConfigs[deploymentConfigId]\" deployment-config-different-service=\"deploymentConfigs[deploymentConfigId] && !deploymentConfigsByService[''][deploymentConfigId]\" scalable=\"isScalable(deployment, deploymentConfigId)\" hpa=\"getHPA(deployment.metadata.name, deploymentConfigId)\" limit-ranges=\"limitRanges\" project=\"project\" images-by-docker-reference=\"imagesByDockerReference\" builds=\"builds\" pods=\"podsByDeployment[deployment.metadata.name]\">\n" +
    "</topology-deployment>\n" +
    "</div>\n" +
    "</section>\n" +
    "<section ng-repeat=\"pod in monopodsByService[''] track by (pod | uid)\" class=\"components\">\n" +
    "<overview-monopod pod=\"pod\"></overview-monopod>\n" +
    "</section>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</project-page>"
  );


  $templateCache.put('views/projects.html',
    "<default-header class=\"top-header\"></default-header>\n" +
    "<div class=\"wrap no-sidebar\">\n" +
    "<div class=\"sidebar-left collapse navbar-collapse navbar-collapse-2\">\n" +
    "<navbar-utility-mobile></navbar-utility-mobile>\n" +
    "</div>\n" +
    "<div class=\"middle surface-shaded\">\n" +
    "\n" +
    "<div class=\"middle-section\">\n" +
    "<div class=\"middle-container\">\n" +
    "<div class=\"middle-content\">\n" +
    "<div class=\"container surface-shaded\"> \n" +
    "<div class=\"row\">\n" +
    "<div class=\"col-md-12\">\n" +
    "<div ng-if=\"alerts\" class=\"alerts\">\n" +
    "<alerts alerts=\"alerts\"></alerts>\n" +
    "</div>\n" +
    "<div ng-if=\"!showGetStarted\">\n" +
    "<div ng-if=\"loading\" class=\"empty-state-message\">\n" +
    "<h2 class=\"text-center\">Loading...</h2>\n" +
    "</div>\n" +
    "<div ng-if=\"!loading\">\n" +
    "<div class=\"projects-header\">\n" +
    "<div class=\"projects-bar\">\n" +
    "<h1>Projects</h1>\n" +
    "<div class=\"projects-options\">\n" +
    "<div class=\"projects-add\" ng-if=\"canCreate\">\n" +
    "<a href=\"create-project\" class=\"btn btn-md btn-primary\">\n" +
    "New Project\n" +
    "</a>\n" +
    "</div>\n" +
    "<div class=\"projects-search\">\n" +
    "<form role=\"form\" class=\"search-pf has-button\">\n" +
    "<div class=\"form-group has-clear\">\n" +
    "<div class=\"search-pf-input-group\">\n" +
    "<label for=\"search-projects\" class=\"sr-only\">Search</label>\n" +
    "<input type=\"search\" class=\"form-control\" placeholder=\"Search\" id=\"search-projects\" ng-model=\"search.text\">\n" +
    "<button type=\"button\" class=\"clear\" aria-hidden=\"true\" ng-if=\"search.text\" ng-click=\"search.text = ''\">\n" +
    "<span class=\"pficon pficon-close\"></span>\n" +
    "</button>\n" +
    "</div>\n" +
    "</div>\n" +
    "</form>\n" +
    "<span class=\"vertical-divider\"></span>\n" +
    "<span class=\"projects-sort-label\">Sort by</span>\n" +
    "<div class=\"projects-sort\">\n" +
    "<div pf-sort config=\"sortConfig\" class=\"sort-controls\"></div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"!projects.length\" class=\"h3\">\n" +
    "The current filter is hiding all projects.\n" +
    "<a href=\"\" ng-click=\"search.text = ''\" role=\"button\">Clear Filter</a>\n" +
    "</div>\n" +
    "<div class=\"list-group list-view-pf projects-list\">\n" +
    "<div ng-repeat=\"project in projects\" class=\"list-group-item project-info tile-click\">\n" +
    "<div row class=\"list-view-pf-actions project-actions\" ng-if=\"project.status.phase == 'Active'\">\n" +
    "<span class=\"fa-lg project-action-item\" title=\"View and Edit Membership\">\n" +
    "<a ng-href=\"project/{{project.metadata.name}}/membership\" class=\"action-button\">\n" +
    "<i class=\"pficon pficon-users\" aria-hidden=\"true\"></i>\n" +
    "<span class=\"sr-only\">View and Edit Membership</span>\n" +
    "</a>\n" +
    "</span>\n" +
    "<span class=\"fa-lg project-action-item\" title=\"Edit Display Name and Description\">\n" +
    "\n" +
    "<a ng-href=\"project/{{project.metadata.name}}/edit?then=./\" class=\"action-button\">\n" +
    "<i class=\"fa fa-pencil\" aria-hidden=\"true\"></i>\n" +
    "<span class=\"sr-only\">Edit Display Name and Description</span>\n" +
    "</a>\n" +
    "</span>\n" +
    "<span title=\"Delete Project\">\n" +
    "<delete-link class=\"fa-lg project-action-item\" kind=\"Project\" resource-name=\"{{project.metadata.name}}\" project-name=\"{{project.metadata.name}}\" display-name=\"{{(project | displayName)}}\" type-name-to-confirm=\"true\" stay-on-current-page=\"true\" alerts=\"alerts\" button-only>\n" +
    "</delete-link>\n" +
    "</span>\n" +
    "</div>\n" +
    "<div class=\"list-view-pf-main-info\">\n" +
    "<div class=\"list-view-pf-description project-names\">\n" +
    "<div class=\"list-group-item-heading project-name-item\">\n" +
    "<h2 class=\"h1\">\n" +
    "<a class=\"tile-target\" ng-href=\"project/{{project.metadata.name}}\" title=\"{{project | displayName}}\"><span ng-bind-html=\"project | displayName | highlightKeywords : keywords\"></span></a>\n" +
    "<span ng-if=\"project.status.phase != 'Active'\" data-toggle=\"tooltip\" title=\"This project has been marked for deletion.\" class=\"pficon pficon-warning-triangle-o\"></span>\n" +
    "</h2>\n" +
    "<small>\n" +
    "<span ng-if=\"project | displayName : true\"><span ng-bind-html=\"project.metadata.name | highlightKeywords : keywords\"></span> &ndash;</span>\n" +
    "created\n" +
    "<span ng-if=\"project | annotation : 'openshift.io/requester'\">by <span ng-bind-html=\"project | annotation : 'openshift.io/requester' | highlightKeywords : keywords\"></span></span>\n" +
    "<span am-time-ago=\"project.metadata.creationTimestamp\"></span>\n" +
    "</small>\n" +
    "</div>\n" +
    "<div class=\"list-view-pf-additional-info project-additional-info\">\n" +
    "<span class=\"list-group-item-text project-description\">\n" +
    "<truncate-long-text ng-if=\"!keywords.length\" content=\"project | description\" limit=\"265\" newline-limit=\"10\" use-word-boundary=\"true\"></truncate-long-text>\n" +
    "<span class=\"highlighted-content\" ng-if=\"keywords.length\" ng-bind-html=\"project | description | truncate : 1000 | highlightKeywords : keywords\"></span>\n" +
    "</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<p class=\"projects-instructions\" ng-if=\"canCreate === false\" ng-include=\"'views/_cannot-create-project.html'\"></p>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"showGetStarted\">\n" +
    "<div class=\"empty-state-message empty-state-full-page text-center\">\n" +
    "<h1>Welcome to OpenShift.</h1>\n" +
    "<p>\n" +
    "OpenShift helps you quickly develop, host, and scale applications.<br>\n" +
    "<span ng-if=\"canCreate\">Create a project for your application.</span>\n" +
    "</p>\n" +
    "<a ng-if=\"canCreate\" href=\"create-project\" class=\"btn btn-lg btn-primary\">New Project</a>\n" +
    "<p>To learn more, visit the OpenShift <a target=\"_blank\" ng-href=\"{{'' | helpLink}}\">documentation</a>.</p>\n" +
    "<p class=\"projects-instructions\" ng-if=\"canCreate === false\" ng-include=\"'views/_cannot-create-project.html'\"></p>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/quota.html',
    "<project-header class=\"top-header\"></project-header>\n" +
    "<project-page>\n" +
    "\n" +
    "<div class=\"middle-section\">\n" +
    "<div class=\"middle-container\">\n" +
    "<div class=\"middle-content\">\n" +
    "<div class=\"container-fluid mar-top-xl\">\n" +
    "<alerts alerts=\"alerts\"></alerts>\n" +
    "<div class=\"row\">\n" +
    "<div class=\"col-md-12\">\n" +
    "<h1>\n" +
    "<span ng-if=\"clusterQuotas | hashSize\">Cluster </span>Quota\n" +
    "<span class=\"page-header-link\">\n" +
    "<a ng-href=\"{{'quota' | helpLink}}\" target=\"_blank\">\n" +
    "Learn More <i class=\"fa fa-external-link\" aria-hidden=\"true\"></i>\n" +
    "</a>\n" +
    "</span>\n" +
    "</h1>\n" +
    "<div ng-if=\"!(quotas | hashSize) && !(clusterQuotas | hashSize)\" class=\"mar-top-xl\">\n" +
    "<div class=\"help-block\">{{quotaHelp}}</div>\n" +
    "<p><em ng-if=\"!quotas && !clusterQuotas\">Loading...</em><em ng-if=\"quotas || clusterQuotas\">There are no resource quotas set on this project.</em></p>\n" +
    "</div>\n" +
    "<div ng-repeat=\"quota in clusterQuotas | orderBy: 'metadata.name'\" class=\"gutter-bottom\">\n" +
    "<h2 ng-if=\"(clusterQuotas | hashSize) > 1\">{{quota.metadata.name}}</h2>\n" +
    "<div ng-if=\"$first\" class=\"help-block\">Limits resource usage across a set of projects.</div>\n" +
    "<dl ng-if=\"quota.spec.quota.scopes.length\">\n" +
    "<dt>Scopes:</dt>\n" +
    "<dd>\n" +
    "<div ng-repeat=\"scope in quota.spec.quota.scopes\">\n" +
    "{{scope | startCase}}\n" +
    "<span class=\"text-muted small\" ng-if=\"scope | scopeDetails\">&mdash; {{scope | scopeDetails}}</span>\n" +
    "</div>\n" +
    "</dd>\n" +
    "</dl>\n" +
    "<div>\n" +
    "<div row wrap style=\"justify-content: center\">\n" +
    "<div ng-if=\"quota.status.total.hard.cpu\" class=\"mar-lg\">\n" +
    "<h3 class=\"text-center\">CPU <small>Request</small></h3>\n" +
    "<quota-usage-chart height=\"240\" used=\"namespaceUsageByClusterQuota[quota.metadata.name].used.cpu\" total=\"quota.status.total.hard.cpu\" cross-project-used=\"quota.status.total.used.cpu\" type=\"cpu\" class=\"quota-chart\"></quota-usage-chart>\n" +
    "</div>\n" +
    "<div ng-if=\"quota.status.total.hard.memory\" class=\"mar-lg\">\n" +
    "<h3 class=\"text-center\">Memory <small>Request</small></h3>\n" +
    "<quota-usage-chart height=\"240\" used=\"namespaceUsageByClusterQuota[quota.metadata.name].used.memory\" cross-project-used=\"quota.status.total.used.memory\" total=\"quota.status.total.hard.memory\" type=\"memory\" class=\"quota-chart\"></quota-usage-chart>\n" +
    "</div>\n" +
    "<div ng-if=\"quota.status.total.hard['requests.cpu']\" class=\"mar-lg\">\n" +
    "<h3 class=\"text-center\">CPU <small>Request</small></h3>\n" +
    "<quota-usage-chart height=\"240\" used=\"namespaceUsageByClusterQuota[quota.metadata.name].used['requests.cpu']\" cross-project-used=\"quota.status.total.used['requests.cpu']\" total=\"quota.status.total.hard['requests.cpu']\" type=\"cpu\" class=\"quota-chart\"></quota-usage-chart>\n" +
    "</div>\n" +
    "<div ng-if=\"quota.status.total.hard['requests.memory']\" class=\"mar-lg\">\n" +
    "<h3 class=\"text-center\">Memory <small>Request</small></h3>\n" +
    "<quota-usage-chart height=\"240\" used=\"namespaceUsageByClusterQuota[quota.metadata.name].used['requests.memory']\" cross-project-used=\"quota.status.total.used['requests.memory']\" total=\"quota.status.total.hard['requests.memory']\" type=\"memory\" class=\"quota-chart\"></quota-usage-chart>\n" +
    "</div>\n" +
    "<div ng-if=\"quota.status.total.hard['limits.cpu']\" class=\"mar-lg\">\n" +
    "<h3 class=\"text-center\">CPU <small>Limit</small></h3>\n" +
    "<quota-usage-chart height=\"240\" used=\"namespaceUsageByClusterQuota[quota.metadata.name].used['limits.cpu']\" cross-project-used=\"quota.status.total.used['limits.cpu']\" total=\"quota.status.total.hard['limits.cpu']\" type=\"cpu\" class=\"quota-chart\"></quota-usage-chart>\n" +
    "</div>\n" +
    "<div ng-if=\"quota.status.total.hard['limits.memory']\" class=\"mar-lg\">\n" +
    "<h3 class=\"text-center\">Memory <small>Limit</small></h3>\n" +
    "<quota-usage-chart height=\"240\" used=\"namespaceUsageByClusterQuota[quota.metadata.name].used['limits.memory']\" cross-project-used=\"quota.status.total.used['limits.memory']\" total=\"quota.status.total.hard['limits.memory']\" type=\"memory\" class=\"quota-chart\"></quota-usage-chart>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"table-responsive\">\n" +
    "<table class=\"table\">\n" +
    "<thead>\n" +
    "<th>Resource Type</th>\n" +
    "<th>Used (This Project)</th>\n" +
    "<th>Used (All Projects)</th>\n" +
    "<th>Max</th>\n" +
    "</thead>\n" +
    "<tbody>\n" +
    "<tr ng-if=\"!quota.status.total.used\" class=\"danger\">\n" +
    "<td colspan=\"5\">\n" +
    "<span data-toggle=\"tooltip\" title=\"Missing quota status\" class=\"pficon pficon-error-circle-o\" style=\"cursor: help\"></span>\n" +
    "Status has not been reported on this quota usage record. Any resources limited by this quota record can not be allocated.\n" +
    "</td>\n" +
    "</tr>\n" +
    "\n" +
    "<tr ng-repeat=\"resourceType in orderedTypesByClusterQuota[quota.metadata.name]\" ng-if=\"resourceType !== 'resourcequotas'\" ng-class=\"{\n" +
    "                              warning: isAtLimit(quota, resourceType),\n" +
    "                              disabled: (quota.status.total.hard[resourceType] || quota.spec.quota.hard[resourceType]) === '0'\n" +
    "                            }\">\n" +
    "<td>\n" +
    "{{resourceType | humanizeQuotaResource : true}}\n" +
    "<span ng-if=\"isAtLimit(quota, resourceType)\" data-toggle=\"tooltip\" title=\"Quota limit reached.\" class=\"pficon pficon-warning-triangle-o warnings-popover\"></span>\n" +
    "<span ng-if=\"(quota.status.total.hard[resourceType] || quota.spec.quota.hard[resourceType]) === '0'\" data-toggle=\"tooltip\" title=\"You are not allowed to create resources of this type.\" class=\"pficon pficon-info warnings-popover\"></span>\n" +
    "</td>\n" +
    "<td>\n" +
    "<span ng-if=\"!namespaceUsageByClusterQuota[quota.metadata.name].used\">&mdash;</span>\n" +
    "<span ng-if=\"namespaceUsageByClusterQuota[quota.metadata.name].used\">{{namespaceUsageByClusterQuota[quota.metadata.name].used[resourceType] | usageWithUnits : resourceType}}</span>\n" +
    "</td>\n" +
    "<td>\n" +
    "<span ng-if=\"!quota.status.total.used\">&mdash;</span>\n" +
    "<span ng-if=\"quota.status.total.used\">{{quota.status.total.used[resourceType] | usageWithUnits : resourceType}}</span>\n" +
    "</td>\n" +
    "<td>\n" +
    "<span ng-if=\"!quota.status.total.hard\">{{quota.spec.quota.hard[resourceType] | usageWithUnits : resourceType}}</span>\n" +
    "<span ng-if=\"quota.status.total.hard\">{{quota.status.total.hard[resourceType] | usageWithUnits : resourceType}}</span>\n" +
    "</td>\n" +
    "</tr>\n" +
    "</tbody>\n" +
    "</table>\n" +
    "</div>\n" +
    "</div>\n" +
    "<h1 ng-if=\"(clusterQuotas | hashSize) && (quotas | hashSize)\">Project Quota</h1>\n" +
    "<div ng-repeat=\"quota in quotas | orderBy: 'metadata.name'\" class=\"gutter-bottom\">\n" +
    "<h2 ng-if=\"(quotas | hashSize) > 1\">{{quota.metadata.name}}</h2>\n" +
    "<div ng-if=\"$first\" class=\"help-block mar-bottom-md\">{{quotaHelp}}</div>\n" +
    "<dl ng-if=\"quota.spec.scopes.length\">\n" +
    "<dt>Scopes:</dt>\n" +
    "<dd>\n" +
    "<div ng-repeat=\"scope in quota.spec.scopes\">\n" +
    "{{scope | startCase}}\n" +
    "<span class=\"text-muted small\" ng-if=\"scope | scopeDetails\">&mdash; {{scope | scopeDetails}}</span>\n" +
    "</div>\n" +
    "</dd>\n" +
    "</dl>\n" +
    "<div>\n" +
    "<div row wrap style=\"justify-content: center\">\n" +
    "<div column ng-if=\"quota.status.hard.cpu\" class=\"mar-lg\">\n" +
    "<h3 class=\"text-center\">CPU <small>Request</small></h3>\n" +
    "<quota-usage-chart used=\"quota.status.used.cpu\" total=\"quota.status.hard.cpu\" type=\"cpu\" class=\"quota-chart\"></quota-usage-chart>\n" +
    "</div>\n" +
    "<div column ng-if=\"quota.status.hard.memory\" class=\"mar-lg\">\n" +
    "<h3 class=\"text-center\">Memory <small>Request</small></h3>\n" +
    "<quota-usage-chart used=\"quota.status.used.memory\" total=\"quota.status.hard.memory\" type=\"memory\" class=\"quota-chart\"></quota-usage-chart>\n" +
    "</div>\n" +
    "<div column ng-if=\"quota.status.hard['requests.cpu']\" class=\"mar-lg\">\n" +
    "<h3 class=\"text-center\">CPU <small>Request</small></h3>\n" +
    "<quota-usage-chart used=\"quota.status.used['requests.cpu']\" total=\"quota.status.hard['requests.cpu']\" type=\"cpu\" class=\"quota-chart\"></quota-usage-chart>\n" +
    "</div>\n" +
    "<div column ng-if=\"quota.status.hard['requests.memory']\" class=\"mar-lg\">\n" +
    "<h3 class=\"text-center\">Memory <small>Request</small></h3>\n" +
    "<quota-usage-chart used=\"quota.status.used['requests.memory']\" total=\"quota.status.hard['requests.memory']\" type=\"memory\" class=\"quota-chart\"></quota-usage-chart>\n" +
    "</div>\n" +
    "<div ng-if=\"quota.status.hard['limits.cpu']\" class=\"mar-lg\">\n" +
    "<h3 class=\"text-center\">CPU <small>Limit</small></h3>\n" +
    "<quota-usage-chart used=\"quota.status.used['limits.cpu']\" total=\"quota.status.hard['limits.cpu']\" type=\"cpu\" class=\"quota-chart\"></quota-usage-chart>\n" +
    "</div>\n" +
    "<div ng-if=\"quota.status.hard['limits.memory']\" class=\"mar-lg\">\n" +
    "<h3 class=\"text-center\">Memory <small>Limit</small></h3>\n" +
    "<quota-usage-chart used=\"quota.status.used['limits.memory']\" total=\"quota.status.hard['limits.memory']\" type=\"memory\" class=\"quota-chart\"></quota-usage-chart>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"table-responsive\">\n" +
    "<table class=\"table\">\n" +
    "<thead>\n" +
    "<th>Resource Type</th>\n" +
    "<th>Used</th>\n" +
    "<th>Max</th>\n" +
    "</thead>\n" +
    "<tbody>\n" +
    "<tr ng-if=\"!quota.status.used\" class=\"danger\">\n" +
    "<td colspan=\"5\">\n" +
    "<span data-toggle=\"tooltip\" title=\"Missing quota status\" class=\"pficon pficon-error-circle-o\" style=\"cursor: help\"></span>\n" +
    "Status has not been reported on this quota usage record. Any resources limited by this quota record can not be allocated.\n" +
    "</td>\n" +
    "</tr>\n" +
    "\n" +
    "<tr ng-repeat=\"resourceType in orderedTypesByQuota[quota.metadata.name]\" ng-if=\"resourceType !== 'resourcequotas'\" ng-class=\"{\n" +
    "                              warning: isAtLimit(quota, resourceType),\n" +
    "                              disabled: (quota.status.hard[resourceType] || quota.spec.hard[resourceType]) === '0'\n" +
    "                            }\">\n" +
    "<td>\n" +
    "{{resourceType | humanizeQuotaResource : true}}\n" +
    "<span ng-if=\"isAtLimit(quota, resourceType)\" data-toggle=\"tooltip\" title=\"Quota limit reached.\" class=\"pficon pficon-warning-triangle-o warnings-popover\"></span>\n" +
    "<span ng-if=\"(quota.status.hard[resourceType] || quota.spec.hard[resourceType]) === '0'\" data-toggle=\"tooltip\" title=\"You are not allowed to create resources of this type.\" class=\"pficon pficon-info warnings-popover\"></span>\n" +
    "</td>\n" +
    "<td>\n" +
    "<span ng-if=\"!quota.status.used\">&mdash;</span>\n" +
    "<span ng-if=\"quota.status.used\">{{quota.status.used[resourceType] | usageWithUnits : resourceType}}</span>\n" +
    "</td>\n" +
    "<td>\n" +
    "<span ng-if=\"!quota.status.hard\">{{quota.spec.hard[resourceType] | usageWithUnits : resourceType}}</span>\n" +
    "<span ng-if=\"quota.status.hard\">{{quota.status.hard[resourceType] | usageWithUnits : resourceType}}</span>\n" +
    "</td>\n" +
    "</tr>\n" +
    "</tbody>\n" +
    "</table>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"limit-ranges-section\">\n" +
    "<h1>Limit Range</h1>\n" +
    "<div ng-if=\"!(limitRanges | hashSize)\">\n" +
    "<div class=\"help-block\">{{limitRangeHelp}}</div>\n" +
    "<p><em>{{emptyMessageLimitRanges}}</em></p>\n" +
    "</div>\n" +
    "<div ng-repeat=\"(limitRangeName, limitRange) in limitRanges\">\n" +
    "<h2 ng-if=\"(limitRanges | hashSize) > 1\">{{limitRangeName}}</h2>\n" +
    "<div ng-if=\"$first\" class=\"help-block mar-bottom-md\">{{limitRangeHelp}}</div>\n" +
    "<div class=\"table-responsive\">\n" +
    "<table class=\"table\">\n" +
    "<thead>\n" +
    "<th>Resource Type</th>\n" +
    "<th>\n" +
    "<span class=\"nowrap\">\n" +
    "Min\n" +
    "<i class=\"small pficon pficon-help\" data-toggle=\"tooltip\" title=\"The minimum amount of this compute resource that can be requested.\"></i>\n" +
    "</span>\n" +
    "</th>\n" +
    "<th>\n" +
    "<span class=\"nowrap\">\n" +
    "Max\n" +
    "<i class=\"small pficon pficon-help\" data-toggle=\"tooltip\" title=\"The maximum amount of this compute resource that can be requested.  The limit must also be below the maximum value.\"></i>\n" +
    "</span>\n" +
    "</th>\n" +
    "<th>\n" +
    "Default\n" +
    "<span class=\"nowrap\">\n" +
    "Request\n" +
    "<i class=\"small pficon pficon-help\" data-toggle=\"tooltip\" title=\"A container will default to request this amount of a compute resource if no request is specified. The system will guarantee the requested amount of compute resource when scheduling a container for execution. If a quota is enabled for this compute resource, the quota usage is incremented by the requested value.\"></i>\n" +
    "</span>\n" +
    "</th>\n" +
    "<th>\n" +
    "Default\n" +
    "<span class=\"nowrap\">\n" +
    "Limit\n" +
    "<i class=\"small pficon pficon-help\" data-toggle=\"tooltip\" title=\"The default limit defines the maximum amount of compute resource the container may have access to during execution if no limit is specified. If no request is made for the compute resource on the container or via a Default Request value, the container will default to request the limit.\"></i>\n" +
    "</span>\n" +
    "</th>\n" +
    "<th>\n" +
    "Max Limit/Request\n" +
    "<span class=\"nowrap\">\n" +
    "Ratio\n" +
    "<i class=\"small pficon pficon-help\" data-toggle=\"tooltip\" title=\"If specified, the compute resource must have a request and limit that are both non-zero, where limit divided by request is less than or equal to the specified amount; this represents the max burst for the compute resource during execution.\"></i>\n" +
    "</span>\n" +
    "</th>\n" +
    "</thead>\n" +
    "<tbody>\n" +
    "<tr ng-repeat-start=\"limit in limitRange.spec.limits\"></tr>\n" +
    "<tr ng-repeat=\"(type, typeLimits) in limitsByType[limitRangeName][limit.type]\">\n" +
    "<td>{{limit.type}} {{type | computeResourceLabel : true}}</td>\n" +
    "<td>{{(typeLimits.min | usageWithUnits : type) || \"&mdash;\"}}</td>\n" +
    "<td>{{(typeLimits.max | usageWithUnits : type) || \"&mdash;\"}}</td>\n" +
    "<td>{{(typeLimits.defaultRequest | usageWithUnits : type) || \"&mdash;\"}}</td>\n" +
    "<td>{{(typeLimits[\"default\"] | usageWithUnits : type) || \"&mdash;\"}}</td>\n" +
    "<td>{{typeLimits.maxLimitRequestRatio || \"&mdash;\"}}</td>\n" +
    "</tr>\n" +
    "<tr ng-repeat-end></tr>\n" +
    "</tbody>\n" +
    "</table>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</project-page>"
  );


  $templateCache.put('views/secrets.html',
    "<project-header class=\"top-header\"></project-header>\n" +
    "<project-page>\n" +
    "\n" +
    "<div class=\"middle-section\">\n" +
    "<div class=\"middle-container\">\n" +
    "<div class=\"middle-header\">\n" +
    "<div class=\"container-fluid\">\n" +
    "<div class=\"page-header page-header-bleed-right page-header-bleed-left\">\n" +
    "<div class=\"pull-right\" ng-if=\"project && ('secrets' | canI : 'create')\">\n" +
    "<a ng-href=\"project/{{project.metadata.name}}/create-secret\" class=\"btn btn-default\">Create Secret</a>\n" +
    "</div>\n" +
    "<h1>\n" +
    "Secrets\n" +
    "<span class=\"page-header-link\">\n" +
    "<a ng-href=\"{{'secrets' | helpLink}}\" target=\"_blank\">\n" +
    "Learn More <i class=\"fa fa-external-link\" aria-hidden=\"true\"></i>\n" +
    "</a>\n" +
    "</span>\n" +
    "</h1>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"middle-content\">\n" +
    "<div class=\"container-fluid\">\n" +
    "<alerts alerts=\"alerts\"></alerts>\n" +
    "<div ng-if=\"!loaded\" class=\"mar-top-xl\">Loading...</div>\n" +
    "<div ng-if=\"loaded\" class=\"row\">\n" +
    "<div class=\"col-md-12\">\n" +
    "<h2>Source Secrets</h2>\n" +
    "<table class=\"table table-bordered table-hover table-mobile secrets-table table-layout-fixed\">\n" +
    "<colgroup>\n" +
    "<col class=\"col-sm-5\">\n" +
    "<col class=\"col-sm-5\">\n" +
    "</colgroup>\n" +
    "<thead>\n" +
    "<tr>\n" +
    "<th>Name</th>\n" +
    "<th>Type</th>\n" +
    "<th>Created</th>\n" +
    "</tr>\n" +
    "</thead>\n" +
    "\n" +
    "<tbody ng-if=\"secretsByType.source.length === 0\">\n" +
    "\n" +
    "<tr><td colspan=\"3\"><em>No secrets</em></td></tr>\n" +
    "</tbody>\n" +
    "<tbody ng-if=\"secretsByType.source.length > 0\">\n" +
    "<tr ng-if=\"secret\" ng-repeat=\"secret in secretsByType.source | orderBy : 'metadata.name'\">\n" +
    "<td data-title=\"Name\">\n" +
    "<a ng-href=\"{{secret | navigateResourceURL}}\">{{secret.metadata.name}}</a>\n" +
    "</td>\n" +
    "<td data-title=\"Type\">\n" +
    "{{secret.type}}\n" +
    "</td>\n" +
    "<td data-title=\"Created\">\n" +
    "<span am-time-ago=\"secret.metadata.creationTimestamp\"></span>\n" +
    "</td>\n" +
    "</tr>\n" +
    "</tbody>\n" +
    "</table>\n" +
    "<div ng-if=\"secretsByType.images.length !== 0\">\n" +
    "<h2>Image Secrets</h2>\n" +
    "<table class=\"table table-bordered table-hover table-mobile secrets-table table-layout-fixed\">\n" +
    "<colgroup>\n" +
    "<col class=\"col-sm-5\">\n" +
    "<col class=\"col-sm-5\">\n" +
    "</colgroup>\n" +
    "<thead>\n" +
    "<tr>\n" +
    "<th>Name</th>\n" +
    "<th>Type</th>\n" +
    "<th>Created</th>\n" +
    "</tr>\n" +
    "</thead>\n" +
    "<tbody>\n" +
    "<tr ng-repeat=\"secret in secretsByType.image | orderBy : 'metadata.name'\">\n" +
    "<td data-title=\"Name\">\n" +
    "<a ng-href=\"{{secret | navigateResourceURL}}\">{{secret.metadata.name}}</a>\n" +
    "</td>\n" +
    "<td data-title=\"Type\">\n" +
    "{{secret.type}}\n" +
    "</td>\n" +
    "<td data-title=\"Created\">\n" +
    "<span am-time-ago=\"secret.metadata.creationTimestamp\"></span>\n" +
    "</td>\n" +
    "</tr>\n" +
    "</tbody>\n" +
    "</table>\n" +
    "</div>\n" +
    "<div ng-if=\"secretsByType.other.length !== 0\">\n" +
    "<h2>Other Secrets</h2>\n" +
    "<table class=\"table table-bordered table-hover table-mobile secrets-table table-layout-fixed\">\n" +
    "<colgroup>\n" +
    "<col class=\"col-sm-5\">\n" +
    "<col class=\"col-sm-5\">\n" +
    "</colgroup>\n" +
    "<thead>\n" +
    "<tr>\n" +
    "<th>Name</th>\n" +
    "<th>Type</th>\n" +
    "<th>Created</th>\n" +
    "</tr>\n" +
    "</thead>\n" +
    "<tbody>\n" +
    "<tr ng-repeat=\"secret in secretsByType.other | orderBy : 'metadata.name'\">\n" +
    "<td data-title=\"Name\">\n" +
    "<a ng-href=\"{{secret | navigateResourceURL}}\">{{secret.metadata.name}}</a>\n" +
    "</td>\n" +
    "<td data-title=\"Type\">\n" +
    "{{secret.type}}\n" +
    "</td>\n" +
    "<td data-title=\"Created\">\n" +
    "<span am-time-ago=\"secret.metadata.creationTimestamp\"></span>\n" +
    "</td>\n" +
    "</tr>\n" +
    "</tbody>\n" +
    "</table>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</project-page>"
  );


  $templateCache.put('views/services.html',
    "<project-header class=\"top-header\"></project-header>\n" +
    "<project-page>\n" +
    "\n" +
    "<div class=\"middle-section\">\n" +
    "<div class=\"middle-container\">\n" +
    "<div class=\"middle-header header-toolbar\">\n" +
    "<div class=\"container-fluid\">\n" +
    "<div class=\"page-header page-header-bleed-right page-header-bleed-left\">\n" +
    "<h1>\n" +
    "Services\n" +
    "<span class=\"page-header-link\">\n" +
    "<a ng-href=\"{{'services' | helpLink}}\" target=\"_blank\">\n" +
    "Learn More <i class=\"fa fa-external-link\" aria-hidden=\"true\"></i>\n" +
    "</a>\n" +
    "</span>\n" +
    "</h1>\n" +
    "</div>\n" +
    "<div class=\"data-toolbar\">\n" +
    "<div class=\"data-toolbar-filter\">\n" +
    "<project-filter></project-filter>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"middle-content\">\n" +
    "<div class=\"container-fluid\">\n" +
    "<alerts alerts=\"alerts\"></alerts>\n" +
    "<div class=\"row\">\n" +
    "<div class=\"col-md-12\">\n" +
    "<table class=\"table table-bordered table-hover table-mobile table-layout-fixed\">\n" +
    "<colgroup>\n" +
    "<col class=\"col-sm-3\">\n" +
    "</colgroup>\n" +
    "<thead>\n" +
    "<tr>\n" +
    "<th>Name</th>\n" +
    "<th>Cluster IP</th>\n" +
    "<th>External IP</th>\n" +
    "<th>Ports</th>\n" +
    "<th>Selector</th>\n" +
    "<th>Age</th>\n" +
    "</tr>\n" +
    "</thead>\n" +
    "<tbody ng-if=\"(services | hashSize) == 0\">\n" +
    "<tr><td colspan=\"6\"><em>{{emptyMessage}}</em></td></tr>\n" +
    "</tbody>\n" +
    "<tbody ng-if=\"(services | hashSize) > 0\">\n" +
    "<tr ng-repeat=\"service in services | orderObjectsByDate : true\">\n" +
    "<td data-title=\"Name\"><a href=\"{{service | navigateResourceURL}}\">{{service.metadata.name}}</a></td>\n" +
    "<td data-title=\"Cluster IP\">{{service.spec.clusterIP}}</td>\n" +
    "<td data-title=\"External IP\">\n" +
    "<span ng-if=\"!service.status.loadBalancer.ingress.length\"><em>none</em></span>\n" +
    "<span ng-repeat=\"ingress in service.status.loadBalancer.ingress | limitTo: 4\">{{ingress.ip}}<span ng-if=\"!$last\">,\n" +
    "</span></span><span ng-if=\"service.status.loadBalancer.ingress.length === 5\">, {{service.status.loadBalancer.ingress[4].ip}}</span><span ng-if=\"service.status.loadBalancer.ingress.length > 5\">, and {{service.status.loadBalancer.ingress.length - 4}} others</span>\n" +
    "</td>\n" +
    "<td data-title=\"Ports\">\n" +
    "<span ng-if=\"!service.spec.ports.length\"><em>none</em></span>\n" +
    "<span ng-repeat=\"portMapping in service.spec.ports | limitTo: 4\">{{portMapping.port}}/{{portMapping.protocol}}<span ng-if=\"!$last\">,\n" +
    "</span></span><span ng-if=\"service.spec.ports.length === 5\">, {{service.spec.ports[4].port}}/{{service.spec.ports[4].protocol}}</span><span ng-if=\"service.spec.ports.length > 5\">, and {{service.spec.ports.length - 4}} others</span>\n" +
    "</td>\n" +
    "<td data-title=\"Selector\">\n" +
    "<span ng-if=\"!service.spec.selector\"><em>none</em></span>\n" +
    "<span ng-repeat=\"(selectorLabel, selectorValue) in service.spec.selector\">{{selectorLabel}}={{selectorValue}}<span ng-show=\"!$last\">, </span></span>\n" +
    "</td>\n" +
    "<td data-title=\"Age\"><span am-time-ago=\"service.metadata.creationTimestamp\" am-without-suffix=\"true\"></span></td>\n" +
    "</tr>\n" +
    "</tbody>\n" +
    "</table>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</project-page>"
  );


  $templateCache.put('views/set-limits.html',
    "<default-header class=\"top-header\"></default-header>\n" +
    "<div class=\"wrap no-sidebar\">\n" +
    "<div class=\"sidebar-left collapse navbar-collapse navbar-collapse-2\">\n" +
    "<navbar-utility-mobile></navbar-utility-mobile>\n" +
    "</div>\n" +
    "<div class=\"middle surface-shaded\">\n" +
    "\n" +
    "<div class=\"middle-section\">\n" +
    "<div class=\"middle-container\">\n" +
    "<div class=\"middle-content\">\n" +
    "<div class=\"container surface-shaded\">\n" +
    "<breadcrumbs breadcrumbs=\"breadcrumbs\"></breadcrumbs>\n" +
    "<div class=\"row\">\n" +
    "<div class=\"col-md-12\">\n" +
    "<alerts alerts=\"alerts\"></alerts>\n" +
    "<div ng-show=\"!containers.length\">Loading...</div>\n" +
    "<form ng-if=\"containers.length\" name=\"form\" class=\"set-limits-form\">\n" +
    "<h1>Resource Limits: {{name}}</h1>\n" +
    "<div class=\"help-block\">\n" +
    "Resource limits control how much <span ng-if=\"!hideCPU\">CPU and</span> memory a container will consume on a node.\n" +
    "<div class=\"learn-more-block\" ng-class=\"{ 'gutter-bottom': showPodWarning }\">\n" +
    "<a href=\"{{'compute_resources' | helpLink}}\" target=\"_blank\">Learn More <i class=\"fa fa-external-link\" aria-hidden=\"true\"></i></a>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"showPodWarning\" class=\"alert alert-warning\">\n" +
    "<span class=\"pficon pficon-warning-triangle-o\" aria-hidden=\"true\"></span>\n" +
    "Changes will only apply to new pods.\n" +
    "</div>\n" +
    "<fieldset ng-disabled=\"disableInputs\">\n" +
    "<div ng-repeat=\"container in containers\" ng-init=\"formName = container.name + '-form'\">\n" +
    "<h2 ng-if=\"containers.length > 1\">Container {{container.name}}</h2>\n" +
    "<edit-request-limit resources=\"container.resources\" type=\"cpu\" limit-ranges=\"limitRanges\" project=\"project\">\n" +
    "</edit-request-limit>\n" +
    "<edit-request-limit resources=\"container.resources\" type=\"memory\" limit-ranges=\"limitRanges\" project=\"project\">\n" +
    "</edit-request-limit>\n" +
    "</div>\n" +
    "<div ng-repeat=\"problem in cpuProblems\" class=\"has-error\">\n" +
    "<span class=\"help-block\">{{problem}}</span>\n" +
    "</div>\n" +
    "<div ng-repeat=\"problem in memoryProblems\" class=\"has-error\">\n" +
    "<span class=\"help-block\">{{problem}}</span>\n" +
    "</div>\n" +
    "<pause-rollouts-checkbox ng-if=\"object | managesRollouts\" deployment=\"object\">\n" +
    "</pause-rollouts-checkbox>\n" +
    "<div class=\"button-group gutter-top gutter-bottom\">\n" +
    "<button type=\"submit\" class=\"btn btn-primary btn-lg\" ng-click=\"save()\" ng-disabled=\"form.$pristine || form.$invalid || disableInputs || cpuProblems.length || memoryProblems.length\" value=\"\">Save</button>\n" +
    "<a class=\"btn btn-default btn-lg\" ng-href=\"{{resourceURL}}\">Cancel</a>\n" +
    "</div>\n" +
    "</fieldset>\n" +
    "</form>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/settings.html',
    "<project-header class=\"top-header\"></project-header>\n" +
    "<project-page>\n" +
    "\n" +
    "<div class=\"middle-section\">\n" +
    "<div class=\"middle-container\">\n" +
    "<div class=\"middle-header\">\n" +
    "<div class=\"container-fluid\">\n" +
    "<breadcrumbs breadcrumbs=\"breadcrumbs\"></breadcrumbs>\n" +
    "<alerts alerts=\"alerts\"></alerts>\n" +
    "<h1 class=\"contains-actions\">\n" +
    "<div class=\"pull-right dropdown\" ng-hide=\"!project || !('projects' | canIDoAny)\">\n" +
    "<button type=\"button\" class=\"dropdown-toggle btn btn-default actions-dropdown-btn hidden-xs\" data-toggle=\"dropdown\">\n" +
    "Actions\n" +
    "<span class=\"caret\" aria-hidden=\"true\"></span>\n" +
    "</button>\n" +
    "<a href=\"\" class=\"dropdown-toggle actions-dropdown-kebab visible-xs-inline\" data-toggle=\"dropdown\"><i class=\"fa fa-ellipsis-v\"></i><span class=\"sr-only\">Actions</span></a>\n" +
    "<ul class=\"dropdown-menu actions action-button\">\n" +
    "<li ng-if=\"project && ('projects' | canI : 'update')\">\n" +
    "<a href=\"\" role=\"button\" class=\"button-edit\" ng-click=\"setEditing(true)\" ng-class=\"{ 'disabled-link': show.editing }\">Edit</a>\n" +
    "</li>\n" +
    "<li ng-if=\"project && ('projects' | canI : 'delete)'\">\n" +
    "<delete-link class=\"button-delete\" kind=\"Project\" resource-name=\"{{project.metadata.name}}\" project-name=\"{{project.metadata.name}}\" display-name=\"{{(project | displayName)}}\" type-name-to-confirm=\"true\" alerts=\"alerts\">\n" +
    "</delete-link>\n" +
    "</li>\n" +
    "</ul>\n" +
    "</div>\n" +
    "Project Settings\n" +
    "</h1>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"middle-content\">\n" +
    "<div class=\"container-fluid\">\n" +
    "<div class=\"row\">\n" +
    "<div class=\"col-md-12\">\n" +
    "<div class=\"resource-details\">\n" +
    "<div class=\"row\">\n" +
    "<div class=\"col-lg-6\">\n" +
    "<ng-include src=\"'views/_settings-general-info.html'\"></ng-include>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"!(quotas | hashSize) && !(clusterQuotas | hashSize)\">\n" +
    "<h2>\n" +
    "<span>Quota</span>\n" +
    "</h2>\n" +
    "<div class=\"help-block\">{{quotaHelp}}</div>\n" +
    "<p><em ng-if=\"!quotas && !clusterQuotas\">Loading...</em><em ng-if=\"quotas || clusterQuotas\">There are no resource quotas set on this project.</em></p>\n" +
    "</div>\n" +
    "<div ng-repeat=\"quota in clusterQuotas | orderBy: 'metadata.name'\" class=\"gutter-bottom\">\n" +
    "<h2>\n" +
    "Cluster Quota <span ng-if=\"(clusterQuotas | hashSize) > 1\">{{quota.metadata.name}}</span>\n" +
    "</h2>\n" +
    "<div ng-if=\"$first\" class=\"help-block\">Limits resource usage across a set of projects.</div>\n" +
    "<dl ng-if=\"quota.spec.quota.scopes.length\">\n" +
    "<dt>Scopes:</dt>\n" +
    "<dd>\n" +
    "<div ng-repeat=\"scope in quota.spec.quota.scopes\">\n" +
    "{{scope | startCase}}\n" +
    "<span class=\"text-muted small\" ng-if=\"scope | scopeDetails\">&mdash; {{scope | scopeDetails}}</span>\n" +
    "</div>\n" +
    "</dd>\n" +
    "</dl>\n" +
    "<div>\n" +
    "<div row wrap style=\"justify-content: center\">\n" +
    "<div ng-if=\"quota.status.total.hard.cpu\" class=\"mar-lg\">\n" +
    "<h3 class=\"text-center\">CPU <small>Request</small></h3>\n" +
    "<quota-usage-chart height=\"240\" used=\"namespaceUsageByClusterQuota[quota.metadata.name].used.cpu\" total=\"quota.status.total.hard.cpu\" cross-project-used=\"quota.status.total.used.cpu\" type=\"cpu\" class=\"quota-chart\"></quota-usage-chart>\n" +
    "</div>\n" +
    "<div ng-if=\"quota.status.total.hard.memory\" class=\"mar-lg\">\n" +
    "<h3 class=\"text-center\">Memory <small>Request</small></h3>\n" +
    "<quota-usage-chart height=\"240\" used=\"namespaceUsageByClusterQuota[quota.metadata.name].used.memory\" cross-project-used=\"quota.status.total.used.memory\" total=\"quota.status.total.hard.memory\" type=\"memory\" class=\"quota-chart\"></quota-usage-chart>\n" +
    "</div>\n" +
    "<div ng-if=\"quota.status.total.hard['requests.cpu']\" class=\"mar-lg\">\n" +
    "<h3 class=\"text-center\">CPU <small>Request</small></h3>\n" +
    "<quota-usage-chart height=\"240\" used=\"namespaceUsageByClusterQuota[quota.metadata.name].used['requests.cpu']\" cross-project-used=\"quota.status.total.used['requests.cpu']\" total=\"quota.status.total.hard['requests.cpu']\" type=\"cpu\" class=\"quota-chart\"></quota-usage-chart>\n" +
    "</div>\n" +
    "<div ng-if=\"quota.status.total.hard['requests.memory']\" class=\"mar-lg\">\n" +
    "<h3 class=\"text-center\">Memory <small>Request</small></h3>\n" +
    "<quota-usage-chart height=\"240\" used=\"namespaceUsageByClusterQuota[quota.metadata.name].used['requests.memory']\" cross-project-used=\"quota.status.total.used['requests.memory']\" total=\"quota.status.total.hard['requests.memory']\" type=\"memory\" class=\"quota-chart\"></quota-usage-chart>\n" +
    "</div>\n" +
    "<div ng-if=\"quota.status.total.hard['limits.cpu']\" class=\"mar-lg\">\n" +
    "<h3 class=\"text-center\">CPU <small>Limit</small></h3>\n" +
    "<quota-usage-chart height=\"240\" used=\"namespaceUsageByClusterQuota[quota.metadata.name].used['limits.cpu']\" cross-project-used=\"quota.status.total.used['limits.cpu']\" total=\"quota.status.total.hard['limits.cpu']\" type=\"cpu\" class=\"quota-chart\"></quota-usage-chart>\n" +
    "</div>\n" +
    "<div ng-if=\"quota.status.total.hard['limits.memory']\" class=\"mar-lg\">\n" +
    "<h3 class=\"text-center\">Memory <small>Limit</small></h3>\n" +
    "<quota-usage-chart height=\"240\" used=\"namespaceUsageByClusterQuota[quota.metadata.name].used['limits.memory']\" cross-project-used=\"quota.status.total.used['limits.memory']\" total=\"quota.status.total.hard['limits.memory']\" type=\"memory\" class=\"quota-chart\"></quota-usage-chart>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"table-responsive\">\n" +
    "<table class=\"table\">\n" +
    "<thead>\n" +
    "<th>Resource type</th>\n" +
    "<th>Used (this project)</th>\n" +
    "<th>Used (all projects)</th>\n" +
    "<th>Max</th>\n" +
    "</thead>\n" +
    "<tbody>\n" +
    "<tr ng-if=\"!quota.status.total.used\" class=\"danger\">\n" +
    "<td colspan=\"5\">\n" +
    "<span data-toggle=\"tooltip\" title=\"Missing quota status\" class=\"pficon pficon-error-circle-o\" style=\"cursor: help\"></span>\n" +
    "Status has not been reported on this quota usage record. Any resources limited by this quota record can not be allocated.\n" +
    "</td>\n" +
    "</tr>\n" +
    "\n" +
    "<tr ng-repeat=\"(resourceType, specMax) in quota.spec.quota.hard\" ng-if=\"resourceType !== 'resourcequotas'\" ng-class=\"{\n" +
    "                              warning: (quota.status.total.used[resourceType] | usageValue) >= (quota.status.total.hard[resourceType] | usageValue)\n" +
    "                            }\">\n" +
    "<td>\n" +
    "{{resourceType | humanizeQuotaResource : true}}\n" +
    "<span ng-if=\"(quota.status.total.used[resourceType] | usageValue) >= (quota.status.total.hard[resourceType] | usageValue)\" data-toggle=\"tooltip\" title=\"Quota limit reached\" class=\"pficon pficon-warning-triangle-o\" style=\"cursor: help; vertical-align: middle\"></span>\n" +
    "</td>\n" +
    "<td>\n" +
    "<span ng-if=\"!namespaceUsageByClusterQuota[quota.metadata.name].used\">&mdash;</span>\n" +
    "<span ng-if=\"namespaceUsageByClusterQuota[quota.metadata.name].used\">{{namespaceUsageByClusterQuota[quota.metadata.name].used[resourceType] | usageWithUnits : resourceType}}</span>\n" +
    "</td>\n" +
    "<td>\n" +
    "<span ng-if=\"!quota.status.total.used\">&mdash;</span>\n" +
    "<span ng-if=\"quota.status.total.used\">{{quota.status.total.used[resourceType] | usageWithUnits : resourceType}}</span>\n" +
    "</td>\n" +
    "<td>\n" +
    "<span ng-if=\"!quota.status.total.hard\">{{specMax | usageWithUnits : resourceType}}</span>\n" +
    "<span ng-if=\"quota.status.total.hard\">{{quota.status.total.hard[resourceType] | usageWithUnits : resourceType}}</span>\n" +
    "</td>\n" +
    "</tr>\n" +
    "</tbody>\n" +
    "</table>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-repeat=\"quota in quotas | orderBy: 'metadata.name'\" class=\"gutter-bottom\">\n" +
    "<h2>\n" +
    "<span ng-if=\"(clusterQuotas | hashSize)\">Project </span>Quota <span ng-if=\"(quotas | hashSize) > 1\">{{quota.metadata.name}}</span>\n" +
    "</h2>\n" +
    "<div ng-if=\"$first\" class=\"help-block\">{{quotaHelp}}</div>\n" +
    "<dl ng-if=\"quota.spec.scopes.length\">\n" +
    "<dt>Scopes:</dt>\n" +
    "<dd>\n" +
    "<div ng-repeat=\"scope in quota.spec.scopes\">\n" +
    "{{scope | startCase}}\n" +
    "<span class=\"text-muted small\" ng-if=\"scope | scopeDetails\">&mdash; {{scope | scopeDetails}}</span>\n" +
    "</div>\n" +
    "</dd>\n" +
    "</dl>\n" +
    "<div>\n" +
    "<div row wrap style=\"justify-content: center\">\n" +
    "<div column ng-if=\"quota.status.hard.cpu\" class=\"mar-lg\">\n" +
    "<h3 class=\"text-center\">CPU <small>Request</small></h3>\n" +
    "<quota-usage-chart used=\"quota.status.used.cpu\" total=\"quota.status.hard.cpu\" type=\"cpu\" class=\"quota-chart\"></quota-usage-chart>\n" +
    "</div>\n" +
    "<div column ng-if=\"quota.status.hard.memory\" class=\"mar-lg\">\n" +
    "<h3 class=\"text-center\">Memory <small>Request</small></h3>\n" +
    "<quota-usage-chart used=\"quota.status.used.memory\" total=\"quota.status.hard.memory\" type=\"memory\" class=\"quota-chart\"></quota-usage-chart>\n" +
    "</div>\n" +
    "<div column ng-if=\"quota.status.hard['requests.cpu']\" class=\"mar-lg\">\n" +
    "<h3 class=\"text-center\">CPU <small>Request</small></h3>\n" +
    "<quota-usage-chart used=\"quota.status.used['requests.cpu']\" total=\"quota.status.hard['requests.cpu']\" type=\"cpu\" class=\"quota-chart\"></quota-usage-chart>\n" +
    "</div>\n" +
    "<div column ng-if=\"quota.status.hard['requests.memory']\" class=\"mar-lg\">\n" +
    "<h3 class=\"text-center\">Memory <small>Request</small></h3>\n" +
    "<quota-usage-chart used=\"quota.status.used['requests.memory']\" total=\"quota.status.hard['requests.memory']\" type=\"memory\" class=\"quota-chart\"></quota-usage-chart>\n" +
    "</div>\n" +
    "<div ng-if=\"quota.status.hard['limits.cpu']\" class=\"mar-lg\">\n" +
    "<h3 class=\"text-center\">CPU <small>Limit</small></h3>\n" +
    "<quota-usage-chart used=\"quota.status.used['limits.cpu']\" total=\"quota.status.hard['limits.cpu']\" type=\"cpu\" class=\"quota-chart\"></quota-usage-chart>\n" +
    "</div>\n" +
    "<div ng-if=\"quota.status.hard['limits.memory']\" class=\"mar-lg\">\n" +
    "<h3 class=\"text-center\">Memory <small>Limit</small></h3>\n" +
    "<quota-usage-chart used=\"quota.status.used['limits.memory']\" total=\"quota.status.hard['limits.memory']\" type=\"memory\" class=\"quota-chart\"></quota-usage-chart>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"table-responsive\">\n" +
    "<table class=\"table\">\n" +
    "<thead>\n" +
    "<th>Resource type</th>\n" +
    "<th>Used</th>\n" +
    "<th>Max</th>\n" +
    "</thead>\n" +
    "<tbody>\n" +
    "<tr ng-if=\"!quota.status.used\" class=\"danger\">\n" +
    "<td colspan=\"5\">\n" +
    "<span data-toggle=\"tooltip\" title=\"Missing quota status\" class=\"pficon pficon-error-circle-o\" style=\"cursor: help\"></span>\n" +
    "Status has not been reported on this quota usage record. Any resources limited by this quota record can not be allocated.\n" +
    "</td>\n" +
    "</tr>\n" +
    "\n" +
    "<tr ng-repeat=\"(resourceType, specMax) in quota.spec.hard\" ng-if=\"resourceType !== 'resourcequotas'\" ng-class=\"{\n" +
    "                              warning: (quota.status.used[resourceType] | usageValue) >= (quota.status.hard[resourceType] | usageValue)\n" +
    "                            }\">\n" +
    "<td>\n" +
    "{{resourceType | humanizeQuotaResource : true}}\n" +
    "<span ng-if=\"(quota.status.used[resourceType] | usageValue) >= (quota.status.hard[resourceType] | usageValue)\" data-toggle=\"tooltip\" title=\"Quota limit reached\" class=\"pficon pficon-warning-triangle-o\" style=\"cursor: help; vertical-align: middle\"></span>\n" +
    "</td>\n" +
    "<td>\n" +
    "<span ng-if=\"!quota.status.used\">&mdash;</span>\n" +
    "<span ng-if=\"quota.status.used\">{{quota.status.used[resourceType] | usageWithUnits : resourceType}}</span>\n" +
    "</td>\n" +
    "<td>\n" +
    "<span ng-if=\"!quota.status.hard\">{{specMax | usageWithUnits : resourceType}}</span>\n" +
    "<span ng-if=\"quota.status.hard\">{{quota.status.hard[resourceType] | usageWithUnits : resourceType}}</span>\n" +
    "</td>\n" +
    "</tr>\n" +
    "</tbody>\n" +
    "</table>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"(limitRanges | hashSize) === 0\">\n" +
    "<h2>Limit Range</h2>\n" +
    "<div class=\"help-block\">{{limitRangeHelp}}</div>\n" +
    "<p><em>{{emptyMessageLimitRanges}}</em></p>\n" +
    "</div>\n" +
    "<div ng-repeat=\"(limitRangeName, limitRange) in limitRanges\">\n" +
    "<h2>\n" +
    "Limit Range <span ng-if=\"(limitRanges | hashSize) > 1\">{{limitRangeName}}</span>\n" +
    "</h2>\n" +
    "<div ng-if=\"$first\" class=\"help-block\">{{limitRangeHelp}}</div>\n" +
    "<div class=\"table-responsive\">\n" +
    "<table class=\"table\">\n" +
    "<thead>\n" +
    "<th>Resource type</th>\n" +
    "<th>\n" +
    "<span class=\"nowrap\">\n" +
    "Min\n" +
    "<i class=\"small pficon pficon-help\" data-toggle=\"tooltip\" title=\"The minimum amount of this compute resource that can be requested.\"></i>\n" +
    "</span>\n" +
    "</th>\n" +
    "<th>\n" +
    "<span class=\"nowrap\">\n" +
    "Max\n" +
    "<i class=\"small pficon pficon-help\" data-toggle=\"tooltip\" title=\"The maximum amount of this compute resource that can be requested.  The limit must also be below the maximum value.\"></i>\n" +
    "</span>\n" +
    "</th>\n" +
    "<th>\n" +
    "Default\n" +
    "<span class=\"nowrap\">\n" +
    "Request\n" +
    "<i class=\"small pficon pficon-help\" data-toggle=\"tooltip\" title=\"A container will default to request this amount of a compute resource if no request is specified. The system will guarantee the requested amount of compute resource when scheduling a container for execution. If a quota is enabled for this compute resource, the quota usage is incremented by the requested value.\"></i>\n" +
    "</span>\n" +
    "</th>\n" +
    "<th>\n" +
    "Default\n" +
    "<span class=\"nowrap\">\n" +
    "Limit\n" +
    "<i class=\"small pficon pficon-help\" data-toggle=\"tooltip\" title=\"The default limit defines the maximum amount of compute resource the container may have access to during execution if no limit is specified. If no request is made for the compute resource on the container or via a Default Request value, the container will default to request the limit.\"></i>\n" +
    "</span>\n" +
    "</th>\n" +
    "<th>\n" +
    "Max Limit/Request\n" +
    "<span class=\"nowrap\">\n" +
    "Ratio\n" +
    "<i class=\"small pficon pficon-help\" data-toggle=\"tooltip\" title=\"If specified, the compute resource must have a request and limit that are both non-zero, where limit divided by request is less than or equal to the specified amount; this represents the max burst for the compute resource during execution.\"></i>\n" +
    "</span>\n" +
    "</th>\n" +
    "</thead>\n" +
    "<tbody>\n" +
    "<tr ng-repeat-start=\"limit in limitRange.spec.limits\"></tr>\n" +
    "<tr ng-repeat=\"(type, typeLimits) in limitsByType[limitRangeName][limit.type]\">\n" +
    "<td>{{limit.type}} {{type | computeResourceLabel : true}}</td>\n" +
    "<td>{{(typeLimits.min | usageWithUnits : type) || \"&mdash;\"}}</td>\n" +
    "<td>{{(typeLimits.max | usageWithUnits : type) || \"&mdash;\"}}</td>\n" +
    "<td>{{(typeLimits.defaultRequest | usageWithUnits : type) || \"&mdash;\"}}</td>\n" +
    "<td>{{(typeLimits[\"default\"] | usageWithUnits : type) || \"&mdash;\"}}</td>\n" +
    "<td>{{typeLimits.maxLimitRequestRatio || \"&mdash;\"}}</td>\n" +
    "</tr>\n" +
    "<tr ng-repeat-end></tr>\n" +
    "</tbody>\n" +
    "</table>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</project-page>"
  );


  $templateCache.put('views/storage.html',
    "<project-header class=\"top-header\"></project-header>\n" +
    "<project-page>\n" +
    "\n" +
    "<div class=\"middle-section\">\n" +
    "<div class=\"middle-container\">\n" +
    "<div class=\"middle-header header-toolbar\">\n" +
    "<div class=\"container-fluid\">\n" +
    "<div class=\"page-header page-header-bleed-right page-header-bleed-left\">\n" +
    "<h1>\n" +
    "Storage\n" +
    "<span class=\"page-header-link\">\n" +
    "<a ng-href=\"{{'storage' | helpLink}}\" target=\"_blank\">\n" +
    "Learn More <i class=\"fa fa-external-link\" aria-hidden=\"true\"></i>\n" +
    "</a>\n" +
    "</span>\n" +
    "</h1>\n" +
    "</div>\n" +
    "<div ng-if=\"!renderOptions.showGetStarted\" class=\"data-toolbar\">\n" +
    "<div class=\"data-toolbar-filter\">\n" +
    "<project-filter></project-filter>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"middle-content\">\n" +
    "<div class=\"container-fluid\">\n" +
    "<alerts alerts=\"alerts\"></alerts>\n" +
    "<div class=\"row\">\n" +
    "<div class=\"col-md-12\">\n" +
    "<div class=\"section-header page-header-bleed-right page-header-bleed-left\">\n" +
    "<div class=\"hidden-xs pull-right\" ng-if=\"project && ('persistentvolumeclaims' | canI : 'create')\">\n" +
    "<a ng-href=\"project/{{project.metadata.name}}/create-pvc\" class=\"btn btn-default\">Create Storage</a>\n" +
    "</div>\n" +
    "<h2>Persistent Volume Claims</h2>\n" +
    "<div class=\"visible-xs-block mar-bottom-sm\" ng-if=\"project && ('persistentvolumeclaims' | canI : 'create')\">\n" +
    "<a ng-href=\"project/{{project.metadata.name}}/create-pvc\" class=\"btn btn-default\">Create Storage</a>\n" +
    "</div>\n" +
    "</div>\n" +
    "<table class=\"table table-bordered table-hover table-mobile table-layout-fixed\" ng-class=\"{ 'table-empty': (pvcs | hashSize) === 0 }\">\n" +
    "<colgroup>\n" +
    "<col class=\"col-sm-5\">\n" +
    "</colgroup>\n" +
    "<thead>\n" +
    "<tr>\n" +
    "<th>Name</th>\n" +
    "<th>Status</th>\n" +
    "<th>Capacity</th>\n" +
    "<th>Access Modes</th>\n" +
    "<th>Age</th>\n" +
    "</tr>\n" +
    "</thead>\n" +
    "<tbody ng-if=\"(pvcs | hashSize) === 0\">\n" +
    "<tr><td colspan=\"5\"><em>{{emptyMessage}}</em></td></tr>\n" +
    "</tbody>\n" +
    "<tbody ng-if=\"(pvcs | hashSize) > 0\">\n" +
    "<tr ng-repeat=\"pvc in pvcs | orderObjectsByDate : true\">\n" +
    "<td data-title=\"Name\"><a ng-href=\"{{pvc | navigateResourceURL}}\">{{pvc.metadata.name}}</a>\n" +
    "<span ng-if=\"pvc | storageClass\" class=\"text-muted\"> using storage class {{pvc | storageClass}}</span>\n" +
    "</td>\n" +
    "<td data-title=\"Status\">\n" +
    "<status-icon status=\"pvc.status.phase\" disable-animation></status-icon>\n" +
    "{{pvc.status.phase}}\n" +
    "<span ng-if=\"pvc.spec.volumeName\">to volume <strong>{{pvc.spec.volumeName}}</strong></span>\n" +
    "</td>\n" +
    "<td data-title=\"Capacity\">\n" +
    "<span ng-if=\"pvc.spec.volumeName\">\n" +
    "<span ng-if=\"pvc.status.capacity['storage']\">{{pvc.status.capacity['storage'] | usageWithUnits: 'storage'}}</span>\n" +
    "<span ng-if=\"!pvc.status.capacity['storage']\">unknown</span>\n" +
    "</span>\n" +
    "<span ng-if=\"!pvc.spec.volumeName\">\n" +
    "<span>-</span>\n" +
    "</span>\n" +
    "</td>\n" +
    "<td data-title=\"Access Modes\">{{pvc.spec.accessModes | accessModes:'long' | join}}</td>\n" +
    "<td data-title=\"Age\"><span am-time-ago=\"pvc.metadata.creationTimestamp\" am-without-suffix=\"true\"></span></td>\n" +
    "</tr>\n" +
    "</tbody>\n" +
    "</table>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</project-page>"
  );


  $templateCache.put('views/util/error.html',
    "<default-header class=\"top-header\"></default-header>\n" +
    "<div class=\"wrap no-sidebar\">\n" +
    "<div class=\"sidebar-left collapse navbar-collapse navbar-collapse-2\">\n" +
    "<navbar-utility-mobile></navbar-utility-mobile>\n" +
    "</div>\n" +
    "<div class=\"middle surface-shaded\">\n" +
    "<div class=\"container surface-shaded\">\n" +
    "<div>\n" +
    "<h1>Error</h1>\n" +
    "<h4>{{errorMessage}}</h4>\n" +
    "<div>{{errorDetails}}</div>\n" +
    "<div ng-if=\"errorLinks.length\">\n" +
    "<a ng-repeat-start=\"link in errorLinks\" ng-href=\"{{link.href}}\" target=\"{{link.target || '_blank'}}\">{{link.label}}</a>\n" +
    "<span ng-repeat-end ng-if=\"!$last\" class=\"action-divider mar-right-xs\">|</span>\n" +
    "</div>\n" +
    "<br>\n" +
    "<div>Return to the <a href=\"\" ng-click=\"reloadConsole()\">console</a>.</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/util/logout.html',
    "<default-header class=\"top-header logged-out\"></default-header>\n" +
    "<div class=\"wrap no-sidebar\">\n" +
    "<div class=\"middle surface-shaded\">\n" +
    "<div class=\"container surface-shaded\">\n" +
    "<div>\n" +
    "<h1>Log out</h1>\n" +
    "<div ng-bind-html=\"logoutMessage\"></div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/util/oauth.html',
    "<default-header class=\"top-header logged-out\"></default-header>\n" +
    "<div class=\"wrap no-sidebar\">\n" +
    "<div class=\"middle surface-shaded\">\n" +
    "<div class=\"container surface-shaded\">\n" +
    "<div ng-if=\"!confirmUser\">\n" +
    "<h1 style=\"margin-top: 10px\">Logging in&hellip;</h1>\n" +
    "<p>Please wait while you are logged in&hellip;</p>\n" +
    "</div>\n" +
    "<div ng-if=\"confirmUser && !overriddenUser\">\n" +
    "<h1 style=\"margin-top: 10px\">Confirm Login</h1>\n" +
    "<p>You are being logged in as <code>{{confirmUser.metadata.name}}</code>.</p>\n" +
    "<button class=\"btn btn-lg btn-primary\" type=\"button\" ng-click=\"completeLogin();\">Continue</button>\n" +
    "<button class=\"btn btn-lg btn-default\" type=\"button\" ng-click=\"cancelLogin();\">Cancel</button>\n" +
    "</div>\n" +
    "<div ng-if=\"confirmUser && overriddenUser\">\n" +
    "<h1 style=\"margin-top: 10px\">Confirm User Change</h1>\n" +
    "<p>You are about to change users from <code>{{overriddenUser.metadata.name}}</code> to <code>{{confirmUser.metadata.name}}</code>.</p>\n" +
    "<p>If this is unexpected, click Cancel. This could be an attempt to trick you into acting as another user.</p>\n" +
    "<button class=\"btn btn-lg btn-danger\" type=\"button\" ng-click=\"completeLogin();\">Switch Users</button>\n" +
    "<button class=\"btn btn-lg btn-primary\" type=\"button\" ng-click=\"cancelLogin();\">Cancel</button>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>"
  );

}]);
