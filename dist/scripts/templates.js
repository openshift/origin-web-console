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
    "<span class=\"sr-only\" translate>Close</span>\n" +
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
    "<a href=\"\" ng-click=\"toggleAvgLine()\" title=\"{{'Toggle average line'|translate}}\" role=\"button\" class=\"action-button\">\n" +
    "<span class=\"avg-duration-text text-muted\">\n" +
    "<svg width=\"25\" height=\"20\">\n" +
    "<line class=\"build-trends-avg-line\" x1=\"0\" y1=\"10\" x2=\"25\" y2=\"10\"/>\n" +
    "</svg>\n" +
    "<span style=\"vertical-align: top\" translate>Average: {{averageDurationText}}</span>\n" +
    "</span>\n" +
    "</a>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "\n" +
    "<div ng-if=\"completeBuilds.length < minBuilds()\" class=\"gutter-bottom\"></div>\n" +
    "<div ng-if=\"averageDurationText\" class=\"sr-only\" translate>\n" +
    "Average build duration {{averageDurationText}}\n" +
    "</div>"
  );


  $templateCache.put('views/_cannot-create-project.html',
    "<span ng-if=\"!newProjectMessage\" translate>A cluster admin can create a project for you by running the command <code>oc adm new-project &lt;projectname&gt; --admin={{user.metadata.name || '&lt;YourUsername&gt;'}}</code></span>\n" +
    "<span ng-if=\"newProjectMessage\" ng-bind-html=\"newProjectMessage | linkify : '_blank'\" class=\"projects-instructions-link\"></span>"
  );


  $templateCache.put('views/_compute-resource.html',
    "<ng-form name=\"form\">\n" +
    "<fieldset class=\"form-inline compute-resource\">\n" +
    "<label ng-if=\"label\">{{label}}</label>\n" +
    "<div class=\"resource-size\" ng-class=\"{ 'has-error': form.$invalid }\">\n" +
    "<div class=\"resource-amount\">\n" +
    "<label class=\"sr-only\" ng-attr-for=\"{{id}}\" translate>Amount</label>\n" +
    "<input type=\"number\" name=\"amount\" ng-attr-id=\"{{id}}\" ng-model=\"input.amount\" min=\"0\" ng-attr-placeholder=\"{{placeholder}}\" class=\"form-control\" ng-attr-aria-describedby=\"{{description ? id + '-help' : undefined}}\">\n" +
    "</div>\n" +
    "<div class=\"resource-unit\">\n" +
    "<label class=\"sr-only\" ng-attr-for=\"{{id}}-unit\" translate>Unit</label>\n" +
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
    "<div ng-if=\"form.amount.$error.number\" class=\"help-block\" translate>\n" +
    "Must be a number.\n" +
    "</div>\n" +
    "<div ng-if=\"form.amount.$error.min\" class=\"help-block\" translate>\n" +
    "Can't be negative.\n" +
    "</div>\n" +
    "<div ng-if=\"form.amount.$error.limitRangeMin\" class=\"help-block\" translate>\n" +
    "Can't be less than {{limitRangeMin | usageWithUnits : type}}.\n" +
    "</div>\n" +
    "<div ng-if=\"form.amount.$error.limitRangeMax\" class=\"help-block\" translate>\n" +
    "Can't be greater than {{limitRangeMax | usageWithUnits : type}}.\n" +
    "</div>\n" +
    "<div ng-if=\"form.amount.$error.limitLargerThanRequest\" class=\"help-block\" translate>\n" +
    "Limit can't be less than request ({{request | usageWithUnits : type}}).\n" +
    "</div>\n" +
    "<div ng-if=\"form.amount.$error.limitWithinRatio\" class=\"help-block\">\n" +
    "<span ng-if=\"!input.amount && !defaultValue\" translate>\n" +
    "Limit is required if request is set. (Max Limit/Request Ratio: {{maxLimitRequestRatio}})\n" +
    "</span>\n" +
    "<span ng-if=\"input.amount || defaultValue\">\n" +
    "<translate>Limit cannot be more than {{maxLimitRequestRatio}} times request value.</translate>\n" +
    "(<translate>Request</translate>: {{request | usageWithUnits : type}},\n" +
    "\n" +
    "<translate>Limit</translate>: {{(input.amount ? (input.amount + input.unit) : defaultValue) | usageWithUnits : type}})\n" +
    "</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "</fieldset>\n" +
    "</ng-form>"
  );


  $templateCache.put('views/_config-file-params.html',
    "<div ng-repeat=\"(serverName, data) in secretData\" class=\"image-source-item\">\n" +
    "<h3>{{serverName}}</h3>\n" +
    "<dt translate>username</dt>\n" +
    "<dd class=\"word-break\">{{data.username}}</dd>\n" +
    "<dt translate>password</dt>\n" +
    "<dd ng-if=\"view.showSecret\">\n" +
    "<copy-to-clipboard clipboard-text=\"data.password\" display-wide=\"true\"></copy-to-clipboard>\n" +
    "</dd>\n" +
    "<dd ng-if=\"!view.showSecret\">*****</dd>\n" +
    "<dt translate>email</dt>\n" +
    "<dd class=\"word-break\">{{data.email}}</dd>\n" +
    "</div>"
  );


  $templateCache.put('views/_container-statuses.html',
    " <div ng-if=\"detailed && pod.status.initContainerStatuses.length\">\n" +
    "<h4 class=\"mar-bottom-xl\" row ng-if=\"initContainersTerminated\">\n" +
    "<span><i class=\"fa fa-check text-success\"></i></span>\n" +
    "<span flex>\n" +
    "<ng-pluralize count=\"pod.status.initContainerStatuses.length\" when=\"{'1': '&nbsp;Init container {{pod.status.initContainerStatuses[0].name}}','other': '&nbsp;{} init containers'}\">\n" +
    "</ng-pluralize>\n" +
    "<translate>completed successfully</translate>\n" +
    "</span>\n" +
    "<span ng-if=\"initContainersTerminated\">\n" +
    "<a class=\"page-header-link\" href=\"\" ng-click=\"toggleInitContainer()\">\n" +
    "<span ng-if=\"!expandInitContainers\" translate>Show</span>\n" +
    "<span ng-if=\"expandInitContainers\" translate>Hide</span>\n" +
    "<translate>Details</translate>\n" +
    "</a>\n" +
    "</span>\n" +
    "</h4>\n" +
    "<div class=\"animate-if\" ng-if=\"expandInitContainers\" ng-repeat=\"containerStatus in pod.status.initContainerStatuses track by containerStatus.name\">\n" +
    "<h4 class=\"component-label\" translate>Init container {{containerStatus.name}}</h4>\n" +
    "<dl class=\"dl-horizontal left\">\n" +
    "<dt>State:</dt>\n" +
    "<dd>\n" +
    "<kubernetes-object-describe-container-state container-state=\"containerStatus.state\"></kubernetes-object-describe-container-state>\n" +
    "</dd>\n" +
    "<dt ng-if=\"!(containerStatus.lastState | isEmptyObj)\" translate>Last State</dt>\n" +
    "<dd ng-if=\"!(containerStatus.lastState | isEmptyObj)\">\n" +
    "<kubernetes-object-describe-container-state container-state=\"containerStatus.lastState\"></kubernetes-object-describe-container-state>\n" +
    "</dd>\n" +
    "<dt translate>Ready:</dt>\n" +
    "<dd>{{containerStatus.ready}}</dd>\n" +
    "<dt translate>Restart Count:</dt>\n" +
    "<dd>{{containerStatus.restartCount}}</dd>\n" +
    "</dl>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-repeat=\"containerStatus in pod.status.containerStatuses track by containerStatus.name\">\n" +
    "<h4 translate>Container {{containerStatus.name}}</h4>\n" +
    "<dl class=\"dl-horizontal left\">\n" +
    "<dt translate>State:</dt>\n" +
    "<dd>\n" +
    "<kubernetes-object-describe-container-state container-state=\"containerStatus.state\"></kubernetes-object-describe-container-state>\n" +
    "</dd>\n" +
    "<dt ng-if=\"!(containerStatus.lastState | isEmptyObj)\" translate>Last State</dt>\n" +
    "<dd ng-if=\"!(containerStatus.lastState | isEmptyObj)\">\n" +
    "<kubernetes-object-describe-container-state container-state=\"containerStatus.lastState\"></kubernetes-object-describe-container-state>\n" +
    "</dd>\n" +
    "<dt translate>Ready:</dt>\n" +
    "<dd>{{containerStatus.ready}}</dd>\n" +
    "<dt translate>Restart Count:</dt>\n" +
    "<dd>{{containerStatus.restartCount}}</dd>\n" +
    "<div ng-if=\"hasDebugTerminal && showDebugAction(containerStatus) && ('pods' | canI : 'create')\" class=\"debug-pod-action\">\n" +
    "<a href=\"\" ng-click=\"debugTerminal(containerStatus.name)\" role=\"button\" translate>Debug in Terminal</a>\n" +
    "</div>\n" +
    "</dl>\n" +
    "</div>"
  );


  $templateCache.put('views/_edit-request-limit.html',
    "<ng-form name=\"form\" ng-if=\"!requestCalculated || !limitCalculated\">\n" +
    "<h3>\n" +
    "{{type | computeResourceLabel : true}}\n" +
    "<small ng-if=\"limits.min && limits.max\" translate>\n" +
    "{{limits.min | usageWithUnits : type}} min to {{limits.max | usageWithUnits : type}} max\n" +
    "</small>\n" +
    "<small ng-if=\"limits.min && !limits.max\" translate>\n" +
    "Min: {{limits.min | usageWithUnits : type}}\n" +
    "</small>\n" +
    "<small ng-if=\"limits.max && !limits.min\" translate>\n" +
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
    "<a href=\"\" ng-click=\"showComputeUnitsHelp()\" translate>What are <span ng-if=\"type === 'cpu'\">millicores</span><span ng-if=\"type === 'memory'\">MiB</span>?</a>\n" +
    "</div>\n" +
    "</ng-form>"
  );


  $templateCache.put('views/_image-names.html',
    "<span>{{podTemplate.spec.containers[0].image | imageStreamName}}</span>\n" +
    "<span ng-repeat=\"id in imageIDs\" title=\"{{id}}\">\n" +
    "<span class=\"hash\">{{id | stripSHAPrefix | limitTo: 7}}</span><span ng-if=\"!$last\">,</span>\n" +
    "</span>\n" +
    "<span ng-if=\"podTemplate.spec.containers.length > 1\" translate> and {{podTemplate.spec.containers.length - 1}} other image<span ng-if=\"podTemplate.spec.containers.length > 2\">s</span></span>"
  );


  $templateCache.put('views/_parse-error.html',
    "<div ng-show=\"error && !hidden\" class=\"alert alert-danger animate-show\">\n" +
    "<button ng-click=\"hidden = true\" type=\"button\" class=\"close\" aria-hidden=\"true\">\n" +
    "<span class=\"pficon pficon-close\"></span>\n" +
    "</button>\n" +
    "<span class=\"pficon pficon-error-circle-o\"></span>\n" +
    "<strong translate>Failed to process the resource.</strong>\n" +
    "<div class=\"pre-wrap\" ng-if=\"error.message\">{{error.message}}</div>\n" +
    "</div>"
  );


  $templateCache.put('views/_pod-template-container.html',
    " <div class=\"pod-template\">\n" +
    "<div class=\"component-label\"><span ng-bind-template=\"{{labelPrefix||'Container'}}:\"></span> {{container.name}}</div>\n" +
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
    "<span class=\"pod-template-key\" translate>Build:</span>\n" +
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
    "<div flex class=\"word-break\">\n" +
    "<span class=\"pod-template-key\" translate>Source:</span>\n" +
    "<span ng-switch=\"build.spec.source.type\">\n" +
    "<span ng-switch-when=\"Git\">\n" +
    "<span ng-if=\"build.spec.revision.git.commit\">\n" +
    "{{build.spec.revision.git.message}}\n" +
    "<osc-git-link class=\"hash\" uri=\"build.spec.source.git.uri\" ref=\"build.spec.revision.git.commit\">{{build.spec.revision.git.commit | limitTo:7}}</osc-git-link>\n" +
    "<span ng-if=\"detailed && build.spec.revision.git.author\" translate>\n" +
    "authored by {{build.spec.revision.git.author.name}}\n" +
    "</span>\n" +
    "</span>\n" +
    "<span ng-if=\"!build.spec.revision.git.commit\">\n" +
    "<osc-git-link uri=\"build.spec.source.git.uri\">{{build.spec.source.git.uri}}</osc-git-link>\n" +
    "</span>\n" +
    "</span>\n" +
    "<span ng-switch-default>\n" +
    "{{build.spec.source.type || 'Unknown'|translate}}\n" +
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
    "<span class=\"pod-template-key\" translate>Ports:</span>\n" +
    "<span ng-repeat=\"port in container.ports | orderBy: 'containerPort' | limitToOrAll : detailed ? undefined : 1\">\n" +
    "<span class=\"nowrap\">{{port.containerPort}}/{{port.protocol}}</span><span ng-if=\"port.name\"><span class=\"nowrap\"> ({{port.name}})</span></span><span ng-if=\"port.hostPort\"><span class=\"nowrap\"><span class=\"port-icon\"> &#8594;</span> {{port.hostPort}}</span></span><span ng-if=\"!$last\">, </span>\n" +
    "</span>\n" +
    "<span ng-if=\"!detailed && container.ports.length >= 2\">\n" +
    "and {{container.ports.length - 1}}\n" +
    "<span ng-if=\"container.ports.length > 2\" translate>others</span>\n" +
    "<span ng-if=\"container.ports.length === 2\" translate>other</span>\n" +
    "</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div row ng-if=\"detailed\" ng-repeat=\"mount in container.volumeMounts\" class=\"icon-row\">\n" +
    "<div class=\"icon-wrap\">\n" +
    "<span aria-hidden=\"true\" class=\"fa fa-database\"></span>\n" +
    "</div>\n" +
    "<div flex class=\"word-break\">\n" +
    "<span class=\"pod-template-key\" translate>Mount:</span>\n" +
    "<span>\n" +
    "{{mount.name}}<span ng-if=\"mount.subPath\" translate>, subpath {{mount.subPath}}</span>&#8201;&#8594;&#8201;<span>{{mount.mountPath}}</span>\n" +
    "<small class=\"text-muted\">{{mount | volumeMountMode : podTemplate.spec.volumes}}</small>\n" +
    "</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div row ng-if=\"detailed && (container.resources.requests.cpu || container.resources.limits.cpu)\" class=\"icon-row\">\n" +
    "<div class=\"icon-wrap\">\n" +
    "<i class=\"fa fa-area-chart\" aria-hidden=\"true\"></i>\n" +
    "</div>\n" +
    "<div flex>\n" +
    "<span class=\"pod-template-key\" translate>CPU:</span>\n" +
    "<span ng-if=\"container.resources.requests.cpu && container.resources.limits.cpu\" translate>\n" +
    "{{container.resources.requests.cpu | usageWithUnits: 'cpu'}} to {{container.resources.limits.cpu | usageWithUnits: 'cpu'}}\n" +
    "</span>\n" +
    "<span ng-if=\"!container.resources.requests.cpu\" translate>\n" +
    "{{container.resources.limits.cpu | usageWithUnits: 'cpu'}} limit\n" +
    "</span>\n" +
    "<span ng-if=\"!container.resources.limits.cpu\" translate>\n" +
    "{{container.resources.requests.cpu | usageWithUnits: 'cpu'}} requested\n" +
    "</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div row ng-if=\"detailed && (container.resources.requests.memory || container.resources.limits.memory)\" class=\"icon-row\">\n" +
    "<div class=\"icon-wrap\">\n" +
    "<i class=\"fa fa-area-chart\" aria-hidden=\"true\"></i>\n" +
    "</div>\n" +
    "<div flex>\n" +
    "<span class=\"pod-template-key\" translate>Memory:</span>\n" +
    "<span ng-if=\"container.resources.requests.memory && container.resources.limits.memory\" translate>\n" +
    "{{container.resources.requests.memory | usageWithUnits: 'memory'}} to {{container.resources.limits.memory | usageWithUnits: 'memory'}}\n" +
    "</span>\n" +
    "<span ng-if=\"!container.resources.requests.memory\" translate>\n" +
    "{{container.resources.limits.memory | usageWithUnits: 'memory'}} limit\n" +
    "</span>\n" +
    "<span ng-if=\"!container.resources.limits.memory\" translate>\n" +
    "{{container.resources.requests.memory | usageWithUnits: 'memory'}} requested\n" +
    "</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div row ng-if=\"detailed && container.readinessProbe\" class=\"icon-row\">\n" +
    "<div class=\"icon-wrap\">\n" +
    "<i class=\"fa fa-medkit\" aria-hidden=\"true\"></i>\n" +
    "</div>\n" +
    "<div flex>\n" +
    "<span class=\"pod-template-key\" translate>Readiness Probe:</span>\n" +
    "<probe probe=\"container.readinessProbe\"></probe>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div row ng-if=\"detailed && container.livenessProbe\" class=\"icon-row\">\n" +
    "<div class=\"icon-wrap\">\n" +
    "<i class=\"fa fa-medkit\" aria-hidden=\"true\"></i>\n" +
    "</div>\n" +
    "<div flex>\n" +
    "<span class=\"pod-template-key\" translate>Liveness Probe:</span>\n" +
    "<probe probe=\"container.livenessProbe\"></probe>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/_pod-template.html',
    " <div ng-if=\"detailed && addHealthCheckUrl && !(podTemplate | hasHealthChecks)\" class=\"alert alert-info\">\n" +
    "<span class=\"pficon pficon-info\" aria-hidden=\"true\"></span>\n" +
    "<span ng-if=\"podTemplate.spec.containers.length === 1\" translate>Container {{podTemplate.spec.containers[0].name}} does not have health checks</span>\n" +
    "<span ng-if=\"podTemplate.spec.containers.length > 1\" translate>Not all containers have health checks</span>\n" +
    "<translate>to ensure your application is running correctly.</translate>\n" +
    "<a ng-href=\"{{addHealthCheckUrl}}\" class=\"nowrap\" translate>Add Health Checks</a>\n" +
    "</div>\n" +
    "<div ng-if=\"detailed && podTemplate.spec.initContainers.length\">\n" +
    "<h4 translate>Init Containers</h4>\n" +
    "<div class=\"pod-template-container\">\n" +
    "<div class=\"pod-template-block\" ng-repeat=\"container in podTemplate.spec.initContainers\">\n" +
    "<pod-template-container pod-template-container=\"container\" images-by-docker-reference=\"imagesByDockerReference\" builds=\"builds\" detailed=\"detailed\" label-prefix=\"Init Container\"></pod-template-container>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div>\n" +
    "<h4 ng-if=\"detailed\" translate>Containers</h4>\n" +
    "<div class=\"pod-template-container\">\n" +
    "<div class=\"pod-template-block\" ng-repeat=\"container in podTemplate.spec.containers\">\n" +
    "<pod-template-container pod-template-container=\"container\" images-by-docker-reference=\"imagesByDockerReference\" builds=\"builds\" detailed=\"detailed\"></pod-template-container>\n" +
    "<div extension-point extension-name=\"container-links\" extension-types=\"link dom\" extension-args=\"[container, podTemplate]\"></div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/_project-page.html',
    "<div ng-class=\"{'show-sidebar-right': renderOptions.showEventsSidebar}\" class=\"wrap\">\n" +
    "<div class=\"sidebar-left collapse navbar-collapse navbar-collapse-1\">\n" +
    "<sidebar></sidebar>\n" +
    "</div>\n" +
    "<div id=\"container-main\" class=\"middle\" in-view-container>\n" +
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
    "<p class=\"gutter-top\" translate>\n" +
    "If you need to create resources in this project, a project administrator can grant you additional access by running this command:\n" +
    "</p>\n" +
    "<code>oc policy add-role-to-user &lt;role&gt; {{user.metadata.name}} -n {{projectName}}</code>"
  );


  $templateCache.put('views/_sidebar.html',
    "<nav class=\"navbar navbar-sidebar\">\n" +
    "<ul class=\"nav nav-sidenav-primary\">\n" +
    "<li ng-if=\"'service_catalog_landing_page' | enableTechPreviewFeature\" class=\"visible-xs-block\">\n" +
    "<a href=\"./\"><span class=\"pficon pficon-home\" aria-hidden=\"true\"></span> <translate>Home</translate></a>\n" +
    "</li>\n" +
    "<li ng-repeat=\"primaryItem in navItems\" ng-class=\"{ active: primaryItem === activePrimary }\" ng-if=\"show(primaryItem)\">\n" +
    "<a ng-if=\"primaryItem.href\" ng-href=\"{{navURL(primaryItem.href)}}\">\n" +
    "<span class=\"{{primaryItem.iconClass}}\"></span> {{primaryItem.label|translate}}\n" +
    "</a>\n" +
    "<a ng-if=\"!primaryItem.href\" href=\"\" data-toggle=\"dropdown\" class=\"dropdown-toggle\">\n" +
    "<span class=\"{{primaryItem.iconClass}}\"></span> {{primaryItem.label|translate}} <span class=\"fa fa-angle-right\"></span>\n" +
    "</a>\n" +
    "<div ng-if=\"primaryItem.secondaryNavSections.length\" class=\"hover-nav dropdown-menu hidden-xs\">\n" +
    "<ul class=\"nav nav-sidenav-secondary\">\n" +
    "<li ng-repeat-start=\"secondarySection in primaryItem.secondaryNavSections\" ng-if=\"secondarySection.header\" class=\"dropdown-header\">\n" +
    "{{secondarySection.header}}\n" +
    "</li>\n" +
    "<li ng-repeat=\"secondaryItem in secondarySection.items\" ng-class=\"{ active: secondaryItem === activeSecondary }\" ng-if=\"show(secondaryItem)\">\n" +
    "<a ng-href=\"{{navURL(secondaryItem.href)}}\">{{secondaryItem.label|translate}}</a>\n" +
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
    "<a ng-href=\"{{navURL(secondaryItem.href)}}\">{{secondaryItem.label|translate}}</a>\n" +
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
    "<span ng-hide=\"expanded\" translate>Show Details</span>\n" +
    "<span ng-show=\"expanded\" translate>Hide Details</span>\n" +
    "</a>\n" +
    "</span>\n" +
    "<span ng-show=\"task.status=='completed'\">\n" +
    "<span class=\"action-divider\" aria-hidden=\"true\">|</span>\n" +
    "<a href=\"\" ng-click=\"delete(task)\" role=\"button\" translate>\n" +
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
    "<div class=\"template-options\" ng-form=\"paramForm\">\n" +
    "<div ng-if=\"!isDialog && parameters.length\" class=\"flow\">\n" +
    "<div class=\"flow-block\">\n" +
    "<h2 translate>Parameters</h2>\n" +
    "</div>\n" +
    "<div ng-show=\"canToggle\" class=\"flow-block right\">\n" +
    "<a class=\"action action-inline\" href=\"\" ng-click=\"expand = false\" ng-show=\"expand\"><i class=\"pficon pficon-remove\"></i> <translate>Collapse</translate></a>\n" +
    "<a class=\"action action-inline\" href=\"\" ng-click=\"expand = true\" ng-hide=\"expand\"><i class=\"pficon pficon-edit\"></i> <translate>Edit Parameters</translate></a>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-transclude></div>\n" +
    "<div class=\"form-group options\" ng-repeat=\"parameter in parameters\" ng-show=\"expand\" ng-init=\"paramID = 'param-' + $index\">\n" +
    "<label ng-attr-for=\"{{paramID}}\" ng-attr-title=\"{{parameter.name}}\" ng-class=\"{required: parameter.required}\">{{parameter.displayName || parameter.name}}</label>\n" +
    "<div class=\"parameter-input-wrapper\" ng-class=\"{\n" +
    "          'has-error': (paramForm[paramID].$error.required && paramForm[paramID].$touched && !cleared),\n" +
    "          'has-warning': isOnlyWhitespace(parameter.value)\n" +
    "        }\">\n" +
    "<input ng-if=\"!expandedParameter\" ng-attr-id=\"{{paramID}}\" ng-attr-name=\"{{paramID}}\" class=\"form-control hide-ng-leave\" type=\"text\" placeholder=\"{{ parameter | parameterPlaceholder }}\" ng-model=\"parameter.value\" ng-required=\"parameter.required && !parameter.generate\" ng-blur=\"cleared = false\" ng-trim=\"false\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\" ng-attr-aria-describedby=\"{{parameter.description ? (paramID + '-description') : undefined}}\">\n" +
    "<a href=\"\" ng-click=\"expandedParameter = !expandedParameter\" class=\"resize-input action-button\" data-toggle=\"tooltip\" data-trigger=\"hover\" dynamic-content=\"{{expandedParameter ? singleText : multiText|translate}}\"><i class=\"fa\" ng-class=\"{'fa-expand': !expandedParemeter, 'fa-compress': expandedParameter}\" aria-hidden=\"true\" role=\"presentation\"/><span class=\"sr-only\" ng-if=\"expandedParameter\" translate>Collapse to a single line input</span><span class=\"sr-only\" ng-if=\"!expandedParameter\" translate>Expand to enter multiline input</span></a>\n" +
    "<textarea ng-if=\"expandedParameter\" ng-attr-id=\"{{paramID}}\" ng-attr-name=\"{{paramID}}\" class=\"form-control hide-ng-leave\" placeholder=\"{{ parameter | parameterPlaceholder }}\" ng-model=\"parameter.value\" ng-required=\"parameter.required && !parameter.generate\" ng-blur=\"cleared = false\" ng-trim=\"false\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\" rows=\"6\" ng-attr-aria-describedby=\"{{parameter.description ? (paramID + '-description') : undefined}}\"></textarea>\n" +
    "<div class=\"help-block\" ng-if=\"parameter.description\" ng-attr-id=\"{{paramID}}-description\">{{parameter.description}}</div>\n" +
    "<div ng-show=\"paramForm[paramID].$error.required && paramForm[paramID].$touched && !cleared\" class=\"has-error\">\n" +
    "<div class=\"help-block\">{{parameter.displayName || parameter.name}} is required.</div>\n" +
    "</div>\n" +
    "<div ng-show=\"isOnlyWhitespace(parameter.value)\" class=\"has-warning help-block\">\n" +
    "<translate>The current value is \"{{parameter.value}}\", which is not empty.</translate>\n" +
    "<span ng-if=\"parameter.generate\" translate>This will prevent a value from being generated.</span>\n" +
    "<translate>If this isn't what you want,</translate>\n" +
    "<a href=\"\" ng-click=\"parameter.value=''; cleared = true; focus(paramID)\" translate>clear the value</a>.\n" +
    "</div>\n" +
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
    "<a href=\"\" ng-click=\"removeFn({volume: volume})\" translate>Remove</a>\n" +
    "</span>\n" +
    "</h4>\n" +
    "<dl class=\"dl-horizontal left\">\n" +
    "<div ng-if=\"volume.secret\">\n" +
    "<dt>Type:</dt>\n" +
    "<dd>\n" +
    "secret\n" +
    "<span class=\"small text-muted\" translate>(populated by a secret when the pod is created)</span>\n" +
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
    "<dt translate>Type:</dt>\n" +
    "<dd>\n" +
    "<translate>persistent volume claim</translate>\n" +
    "<span class=\"small text-muted\" translate>(reference to a persistent volume claim)</span>\n" +
    "</dd>\n" +
    "<dt translate>Claim name:</dt>\n" +
    "<dd><a ng-href=\"{{volume.persistentVolumeClaim.claimName | navigateResourceURL : 'PersistentVolumeClaim' : namespace}}\">{{volume.persistentVolumeClaim.claimName}}</a></dd>\n" +
    "<dt translate>Mode:</dt>\n" +
    "<dd>\n" +
    "<span ng-if=\"volume.persistentVolumeClaim.readOnly\" translate>read-only</span>\n" +
    "<span ng-if=\"!volume.persistentVolumeClaim.readOnly\" translate>read-write</span>\n" +
    "</dd>\n" +
    "</div>\n" +
    "<div ng-if=\"volume.hostPath\">\n" +
    "<dt translate>Type:</dt>\n" +
    "<dd>\n" +
    "<translate>host path</translate>\n" +
    "<span class=\"small text-muted\" translate>(bare host directory volume)</span>\n" +
    "</dd>\n" +
    "<dt translate>Path:</dt>\n" +
    "<dd>{{volume.hostPath.path}}</dd>\n" +
    "</div>\n" +
    "<div ng-if=\"volume.emptyDir\">\n" +
    "<dt translate>Type:</dt>\n" +
    "<dd>\n" +
    "<translate>empty dir</translate>\n" +
    "<span class=\"small text-muted\" translate>(temporary directory destroyed with the pod)</span>\n" +
    "</dd>\n" +
    "<dt translate>Medium:</dt>\n" +
    "<dd>\n" +
    "<span ng-if=\"!volume.emptyDir.medium\" translate>node's default</span>\n" +
    "<span ng-if=\"volume.emptyDir.medium\">{{volume.emptyDir.medium}}</span>\n" +
    "</dd>\n" +
    "</div>\n" +
    "<div ng-if=\"volume.gitRepo\">\n" +
    "<dt translate>Type:</dt>\n" +
    "<dd>\n" +
    "<translate>git repo</translate>\n" +
    "<span class=\"small text-muted\" translate>(pulled from git when the pod is created)</span>\n" +
    "</dd>\n" +
    "<dt translate>Repository:</dt>\n" +
    "<dd>{{volume.gitRepo.repository}}</dd>\n" +
    "<dt ng-if-start=\"volume.gitRepo.revision\" translate>Revision:</dt>\n" +
    "<dd ng-if-end>{{volume.gitRepo.revision}}</dd>\n" +
    "</div>\n" +
    "<div ng-if=\"volume.downwardAPI\">\n" +
    "<dt translate>Type:</dt>\n" +
    "<dd>\n" +
    "<translate>downward API</translate>\n" +
    "<span class=\"small text-muted\" translate>(populated with information about the pod)</span>\n" +
    "</dd>\n" +
    "<div ng-repeat=\"item in volume.downwardAPI.items\">\n" +
    "<dt translate>Volume File:</dt>\n" +
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
    "<a href=\"\" ng-if=\"!showSecret\" ng-click=\"toggleSecret()\" translate>Show Obfuscated Secret</a>\n" +
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
    "<h1 translate>Red Hat DataMan OS <span class=\"about-reg\">&reg;</span></h1>\n" +
    "<h2 translate>About</h2>\n" +
    "<p translate><a target=\"_blank\" href=\"https://openshift.com\">OpenShift</a> is Red Hat's Platform-as-a-Service (PaaS) that allows developers to quickly develop, host, and scale applications in a cloud environment.</p>\n" +
    "<h2 id=\"version\" translate>Version</h2>\n" +
    "<dl class=\"dl-horizontal left\">\n" +
    "<dt translate>OpenShift Master:</dt>\n" +
    "<dd>{{version.master.openshift || 'unknown'}}</dd>\n" +
    "<dt translate>Kubernetes Master:</dt>\n" +
    "<dd>{{version.master.kubernetes || 'unknown'}}</dd>\n" +
    "</dl>\n" +
    "<p translate>The <a target=\"_blank\" ng-href=\"{{'welcome' | helpLink}}\">documentation</a> helps you learn about OpenShift and start exploring its features. From getting started with creating your first application to trying out more advanced build and deployment techniques, it provides guidance on setting up and managing your OpenShift environment as an application developer.</p>\n" +
    "<p translate>With the OpenShift command line interface (CLI), you can create applications and manage OpenShift projects from a terminal. To get started using the CLI, visit <a href=\"command-line\">Command Line Tools</a>.\n" +
    "</p>\n" +
    "<h2 translate>Account</h2>\n" +
    "<p translate>You are currently logged in under the user account <strong>{{user.metadata.name}}</strong>.</p>\n" +
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
    "<div ng-if=\"!error && (!targetObject || !configMaps || !secrets)\" translate>Loading...</div>\n" +
    "<div ng-if=\"error\" class=\"empty-state-message text-center\">\n" +
    "<h2 translate>The {{kind | humanizeKind}} could not be loaded.</h2>\n" +
    "<p>{{error | getErrorDetails}}</p>\n" +
    "</div>\n" +
    "<div ng-if=\"targetObject && configMaps && secrets\">\n" +
    "<div ng-if=\"!configMaps.length && !secrets.length && !('configmaps' | canI : 'create') && !('secrets' | canI : 'create')\" class=\"empty-state-message empty-state-full-page\">\n" +
    "<h2 class=\"text-center\" translate>No config maps or secrets.</h2>\n" +
    "<p class=\"gutter-top\" translate>\n" +
    "There are no config maps or secrets in project {{project | displayName}} to use as a volume for this {{kind | humanizeKind}}.\n" +
    "</p>\n" +
    "<p ng-if=\"targetObject\"><a ng-href=\"{{targetObject | navigateResourceURL}}\" translate>Back to {{kind | humanizeKind}} {{name}}</a></p>\n" +
    "</div>\n" +
    "<div ng-if=\"configMaps.length || secrets.length || ('configmaps' | canI : 'create') || ('secrets' | canI : 'create')\" class=\"mar-top-xl\">\n" +
    "<h1 translate>Add Config Files</h1>\n" +
    "<div class=\"help-block\" translate>\n" +
    "Add values from a config map or secret as volume. This will make the data available as files for {{kind | humanizeKind}} {{name}}.\n" +
    "</div>\n" +
    "<form name=\"forms.addConfigVolumeForm\" class=\"mar-top-lg\">\n" +
    "<fieldset ng-disabled=\"disableInputs\">\n" +
    "<div class=\"form-group\">\n" +
    "<label class=\"required\" translate>Source</label>\n" +
    "<ui-select ng-model=\"attach.source\" ng-required=\"true\">\n" +
    "<ui-select-match placeholder=\"{{'Select config map or secret'|translate}}\">\n" +
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
    "<a ng-href=\"project/{{project.metadata.name}}/create-config-map\" translate>Create Config Map</a>\n" +
    "</span>\n" +
    "<span ng-if=\"'secrets' | canI : 'create'\">\n" +
    "<span ng-if=\"'configmaps' | canI : 'create'\" class=\"action-divider\" aria-hidden=\"true\">|</span>\n" +
    "<a ng-href=\"project/{{project.metadata.name}}/create-secret\" translate>Create Secret</a>\n" +
    "</span>\n" +
    "</div>\n" +
    "<div class=\"help-block\" translate>\n" +
    "Pick the config source. Its data will be mounted as a volume in the container.\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"form-group\">\n" +
    "<label for=\"mount-path\" class=\"required\" translate>Mount Path</label>\n" +
    "<input id=\"mount-path\" class=\"form-control\" type=\"text\" name=\"mountPath\" ng-model=\"attach.mountPath\" required ng-pattern=\"/^\\/.*$/\" osc-unique=\"existingMountPaths\" placeholder=\"example: /data\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\" aria-describedby=\"mount-path-help\">\n" +
    "<div>\n" +
    "<span id=\"mount-path-help\" class=\"help-block\" translate>\n" +
    "Mount path for the volume.\n" +
    "<span ng-if=\"!attach.pickKeys\">\n" +
    "A file will be created in this directory for each key from the config map or secret. The file contents will be the value of the key.\n" +
    "</span>\n" +
    "</span>\n" +
    "</div>\n" +
    "<div class=\"has-error\" ng-show=\"forms.addConfigVolumeForm.mountPath.$error.pattern && forms.addConfigVolumeForm.mountPath.$touched\">\n" +
    "<span class=\"help-block\" translate>\n" +
    "Mount path must be a valid path to a directory starting with <code>/</code>.\n" +
    "</span>\n" +
    "</div>\n" +
    "<div class=\"has-error\" ng-show=\"forms.addConfigVolumeForm.mountPath.$error.oscUnique\">\n" +
    "<span class=\"help-block\" translate>\n" +
    "The mount path is already used. Please choose another mount path.\n" +
    "</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"form-group\">\n" +
    "<div class=\"checkbox\">\n" +
    "<label>\n" +
    "<input id=\"select-keys\" type=\"checkbox\" ng-model=\"attach.pickKeys\" ng-disabled=\"!attach.source\" aria-describedby=\"select-keys-help\" translate>\n" +
    "Select specific keys and paths\n" +
    "</label>\n" +
    "<div id=\"select-keys-help\" class=\"help-block\" translate>\n" +
    "Add only certain keys or use paths that are different than the key names.\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"attach.pickKeys && attach.source\" class=\"mar-bottom-md\">\n" +
    "<h3 translate>Keys and Paths</h3>\n" +
    "<div class=\"help-block mar-bottom-md\">\n" +
    "<translate>Select the keys to use and the file paths where each key will be exposed.</translate>\n" +
    "<translate>The file paths are relative to the mount path.</translate>\n" +
    "<translate>The contents of each file will be the value of the key.</translate>\n" +
    "</div>\n" +
    "<div ng-repeat=\"item in attach.items\">\n" +
    "<div class=\"row\">\n" +
    "<div class=\"form-group col-md-6\">\n" +
    "<label class=\"required\">Key</label>\n" +
    "<ui-select ng-model=\"item.key\" ng-required=\"true\">\n" +
    "<ui-select-match placeholder=\"{{'Pick a key'|translate}}\">\n" +
    "{{$select.selected}}\n" +
    "</ui-select-match>\n" +
    "<ui-select-choices repeat=\"key in attach.source.data | keys | filter : $select.search\">\n" +
    "<span ng-bind-html=\"key | highlight : $select.search\"></span>\n" +
    "</ui-select-choices>\n" +
    "</ui-select>\n" +
    "</div>\n" +
    "<div class=\"form-group col-md-6\">\n" +
    "<label ng-attr-for=\"path-{{$id}}\" class=\"required\" translate>Path</label>\n" +
    "<input ng-attr-id=\"path-{{$id}}\" class=\"form-control\" ng-class=\"{ 'has-error': forms.addConfigVolumeForm['path-' + $id].$invalid && forms.addConfigVolumeForm['path-' + $id].$touched }\" type=\"text\" name=\"path-{{$id}}\" ng-model=\"item.path\" ng-pattern=\"RELATIVE_PATH_PATTERN\" required osc-unique=\"itemPaths\" placeholder=\"example: config/app.properties\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\">\n" +
    "<div class=\"has-error\" ng-show=\"forms.addConfigVolumeForm['path-' + $id].$error.pattern\">\n" +
    "<span class=\"help-block\" translate>\n" +
    "Path must be a relative path. It cannot start with <code>/</code> or contain <code>..</code> path elements.\n" +
    "</span>\n" +
    "</div>\n" +
    "<div class=\"has-error\" ng-show=\"forms.addConfigVolumeForm['path-' + $id].$error.oscUnique\">\n" +
    "<span class=\"help-block\" translate>\n" +
    "Paths must be unique.\n" +
    "</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"mar-bottom-md\">\n" +
    "<a ng-hide=\"attach.items.length === 1\" href=\"\" ng-click=\"removeItem($index)\" translate>Remove Item</a>\n" +
    "<span ng-if=\"$last\">\n" +
    "<span ng-hide=\"attach.items.length === 1\" class=\"action-divider\" aria-hidden=\"true\">|</span>\n" +
    "<a href=\"\" ng-click=\"addItem()\" translate>Add Item</a>\n" +
    "</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"targetObject.spec.template.spec.containers.length > 1\">\n" +
    "<h3 ng-class=\"{ hidden: attach.allContainers && !attach.pickKeys }\" translate>Containers</h3>\n" +
    "<div ng-if=\"attach.allContainers\" translate>\n" +
    "The volume will be mounted into all containers. You can <a href=\"\" ng-click=\"attach.allContainers = false\">select specific containers</a> instead.\n" +
    "</div>\n" +
    "<div ng-if=\"!attach.allContainers\" class=\"form-group\">\n" +
    "<label class=\"sr-only required\" translate>Containers</label>\n" +
    "<select-containers ng-model=\"attach.containers\" pod-template=\"targetObject.spec.template\" ng-required=\"true\" help-text=\"{{'Add the volume to the selected containers.'|translate}}\">\n" +
    "</select-containers>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"button-group gutter-top gutter-bottom\">\n" +
    "<button type=\"submit\" class=\"btn btn-primary btn-lg\" ng-click=\"addVolume()\" ng-disabled=\"forms.addConfigVolumeForm.$invalid || disableInputs\" translate>Add</button>\n" +
    "<a class=\"btn btn-default btn-lg\" role=\"button\" href=\"\" ng-click=\"cancel()\" translate>Cancel</a>\n" +
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
    "<div ng-show=\"!pvcs || !attach.resource\" translate>Loading...</div>\n" +
    "<div ng-show=\"pvcs && !pvcs.length && attach.resource\" class=\"empty-state-message empty-state-full-page\">\n" +
    "<h2 class=\"text-center\" translate>No persistent volume claims.</h2>\n" +
    "<p class=\"gutter-top\" translate>\n" +
    "A <b>persistent volume claim</b> is required to attach to this {{kind | humanizeKind}}, but none are loaded on this project.\n" +
    "</p>\n" +
    "<div ng-if=\"project && ('persistentvolumeclaims' | canI : 'create')\" class=\"text-center\">\n" +
    "<a ng-href=\"project/{{project.metadata.name}}/create-pvc\" class=\"btn btn-primary\" translate>Create Storage</a>\n" +
    "</div>\n" +
    "<p ng-if=\"project && !('persistentvolumeclaims' | canI : 'create')\" translate>\n" +
    "To claim storage from a persistent volume, refer to the documentation on <a target=\"_blank\" ng-href=\"{{'persistent_volumes' | helpLink}}\">using persistent volumes</a>.\n" +
    "</p>\n" +
    "<p ng-if=\"attach.resource\"><a ng-href=\"{{attach.resource | navigateResourceURL}}\" translate>Back to {{kind | humanizeKind}} {{name}}</a></p>\n" +
    "</div>\n" +
    "<div ng-show=\"pvcs && pvcs.length && attach.resource\" class=\"mar-top-xl\">\n" +
    "<h1 translate>Add Storage</h1>\n" +
    "<div class=\"help-block\" translate>\n" +
    "Add an existing persistent volume claim to the template of {{kind | humanizeKind}} {{name}}.\n" +
    "</div>\n" +
    "<form name=\"attachPVCForm\" class=\"mar-top-lg\">\n" +
    "<fieldset ng-disabled=\"disableInputs\">\n" +
    "<div class=\"form-group\">\n" +
    "<label for=\"persistentVolumeClaim\" class=\"required\" translate>Storage</label>\n" +
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
    "<span ng-if=\"pvc.spec.volumeName\" translate>\n" +
    "to volume <strong>{{pvc.spec.volumeName}}</strong>\n" +
    "</span>\n" +
    "</td>\n" +
    "</tr>\n" +
    "</tbody>\n" +
    "</table>\n" +
    "</div>\n" +
    "<div ng-if=\"!(project && ('persistentvolumeclaims' | canI : 'create'))\" class=\"help-block\" translate>\n" +
    "Select storage to use.\n" +
    "</div>\n" +
    "<div ng-if=\"project && ('persistentvolumeclaims' | canI : 'create')\" class=\"help-block\">\n" +
    "<translate>Select storage to use<span ng-if=\"!outOfClaims\"> or <a ng-href=\"project/{{project.metadata.name}}/create-pvc\">create storage</a>.</span></translate>\n" +
    "<span ng-if=\"outOfClaims\" translate>. You cannot create new storage since you are at quota.</span>\n" +
    "</div>\n" +
    "<h3 translate>Volume</h3>\n" +
    "<div class=\"help-block\" translate>\n" +
    "Specify details about how volumes are going to be mounted inside containers.\n" +
    "</div>\n" +
    "<div class=\"form-group mar-top-xl\">\n" +
    "<label for=\"mount-path\" translate>Mount Path</label>\n" +
    "<input id=\"mount-path\" class=\"form-control\" type=\"text\" name=\"mountPath\" ng-model=\"attach.mountPath\" ng-pattern=\"/^\\/.*$/\" osc-unique=\"existingMountPaths\" placeholder=\"example: /data\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\" aria-describedby=\"mount-path-help\">\n" +
    "<div>\n" +
    "<span id=\"mount-path-help\" class=\"help-block\" translate>Mount path for the volume inside the container. If not specified, the volume will not be mounted automatically.</span>\n" +
    "</div>\n" +
    "<div class=\"has-error\" ng-show=\"attachPVCForm.mountPath.$error.pattern && attachPVCForm.mountPath.$touched\">\n" +
    "<span class=\"help-block\" translate>\n" +
    "Mount path must be a valid path to a directory starting with <code>/</code>.\n" +
    "</span>\n" +
    "</div>\n" +
    "<div class=\"has-error\" ng-show=\"attachPVCForm.mountPath.$error.oscUnique\">\n" +
    "<span class=\"help-block\" translate>\n" +
    "Volume mount in that path already exists. Please choose another mount path.\n" +
    "</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"form-group\">\n" +
    "<label for=\"sub-path\" translate>Subpath</label>\n" +
    "<input id=\"sub-path\" class=\"form-control\" type=\"text\" name=\"subPath\" ng-model=\"attach.subPath\" placeholder=\"example: application/resources\" ng-pattern=\"RELATIVE_PATH_PATTERN\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\" aria-describedby=\"sub-path-help\">\n" +
    "<div id=\"sub-path-help\" class=\"help-block\" translate>\n" +
    "Optional path within the volume from which it will be mounted into the container. Defaults to the volume's root.\n" +
    "</div>\n" +
    "<div class=\"has-error\" ng-show=\"attachPVCForm.subPath.$error.pattern && attachPVCForm.subPath.$touched\">\n" +
    "<span class=\"help-block\" translate>\n" +
    "Path must be a relative path. It cannot start with <code>/</code> or contain <code>..</code> path elements.\n" +
    "</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"form-group\">\n" +
    "<label for=\"volume-name\" translate>Volume Name</label>\n" +
    "\n" +
    "<input id=\"volume-path\" class=\"form-control\" type=\"text\" name=\"volumeName\" ng-model=\"attach.volumeName\" osc-unique=\"existingVolumeNames\" ng-pattern=\"/^[a-z0-9]([-a-z0-9]*[a-z0-9])?$/\" maxlength=\"63\" placeholder=\"(generated if empty)\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\" aria-describedby=\"volume-name-help\">\n" +
    "<div>\n" +
    "<span id=\"volume-name-help\" class=\"help-block\" translate>Unique name used to identify this volume. If not specified, a volume name is generated.</span>\n" +
    "</div>\n" +
    "<div class=\"has-error\" ng-show=\"attachPVCForm.volumeName.$error.pattern && attachPVCForm.volumeName.$touched\">\n" +
    "<span class=\"help-block\">\n" +
    "<translate>Volume names may only contain lower-case letters, numbers, and dashes.</translate>\n" +
    "<translate>They may not start or end with a dash.</translate>\n" +
    "</span>\n" +
    "</div>\n" +
    "<div class=\"has-error\" ng-show=\"attachPVCForm.volumeName.$error.maxlength\">\n" +
    "<span class=\"help-block\" translate>\n" +
    "Volume names cannot be longer than 63 characters.\n" +
    "</span>\n" +
    "</div>\n" +
    "<div class=\"has-error\" ng-show=\"attachPVCForm.volumeName.$error.oscUnique\">\n" +
    "<span class=\"help-block\" translate>\n" +
    "Volume name already exists. Please choose another name.\n" +
    "</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"form-group\">\n" +
    "<div class=\"checkbox\">\n" +
    "<label>\n" +
    "<input type=\"checkbox\" ng-model=\"attach.readOnly\" aria-describedby=\"read-only-help\" translate>\n" +
    "Read only\n" +
    "</label>\n" +
    "<div id=\"read-only-help\" class=\"help-block\" translate>\n" +
    "Mount the volume as read-only.\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "\n" +
    "<div ng-if=\"attach.resource.spec.template.spec.containers.length > 1\">\n" +
    "<div ng-if=\"attach.allContainers\" translate>\n" +
    "The volume will be mounted into all containers. You can <a href=\"\" ng-click=\"attach.allContainers = false\">select specific containers</a> instead.\n" +
    "</div>\n" +
    "<div ng-if=\"!attach.allContainers\" class=\"form-group\">\n" +
    "<label class=\"required\" translate>Containers</label>\n" +
    "<select-containers ng-model=\"attach.containers\" pod-template=\"attach.resource.spec.template\" ng-required=\"true\" help-text=\"{{'Add the volume to the selected containers.'|translate}}\">\n" +
    "</select-containers>\n" +
    "</div>\n" +
    "</div>\n" +
    "<pause-rollouts-checkbox ng-if=\"attach.resource | managesRollouts\" deployment=\"attach.resource\">\n" +
    "</pause-rollouts-checkbox>\n" +
    "<div class=\"button-group gutter-top gutter-bottom\">\n" +
    "<button type=\"submit\" class=\"btn btn-primary btn-lg\" ng-click=\"attachPVC()\" ng-disabled=\"attachPVCForm.$invalid || disableInputs || !attachPVC\" translate>Add</button>\n" +
    "<a class=\"btn btn-default btn-lg\" role=\"button\" ng-click=\"cancel()\" translate>Cancel</a>\n" +
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
    "<a ng-href=\"{{build | jenkinsLogURL}}\" target=\"_blank\" translate>View Log</a>\n" +
    "</span>\n" +
    "</dd>\n" +
    "<dt>Started:</dt>\n" +
    "<dd>\n" +
    "<span ng-if=\"build.status.startTimestamp\">\n" +
    "<span am-time-ago=\"build.status.startTimestamp\"></span>\n" +
    "<span><span class=\"text-muted\">&ndash;</span> {{build.status.startTimestamp | date : 'medium'}}</span>\n" +
    "</span>\n" +
    "<span ng-if=\"!build.status.startTimestamp\"><em translate>not started</em></span>\n" +
    "</dd>\n" +
    "<dt translate>Duration:</dt>\n" +
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
    "<dt translate>Triggered By:</dt>\n" +
    "<dd>\n" +
    "<div ng-repeat=\"trigger in build.spec.triggeredBy\">\n" +
    "<div ng-switch=\"trigger.message\">\n" +
    "<span ng-switch-when=\"Manually triggered\" translate>Manual build</span>\n" +
    "<span ng-switch-when=\"GitHub WebHook\">\n" +
    "<ng-include src=\" 'views/_webhook-trigger-cause.html' \"></ng-include>\n" +
    "</span>\n" +
    "<span ng-switch-when=\"Generic WebHook\">\n" +
    "<ng-include src=\" 'views/_webhook-trigger-cause.html' \"></ng-include>\n" +
    "</span>\n" +
    "<span ng-switch-when=\"Image change\" translate>\n" +
    "{{trigger.message}} for {{trigger.imageChangeBuild.fromRef.name}}\n" +
    "</span>\n" +
    "<span ng-switch-default ng-bind-html=\"trigger.message | linkify : '_blank'\"></span>\n" +
    "</div>\n" +
    "</div>\n" +
    "</dd>\n" +
    "</div>\n" +
    "</dl>\n" +
    "<h3>Configuration <span class=\"small\" ng-if=\"buildConfigName\" translate>created from <a href=\"{{build | configURLForResource}}\">{{buildConfigName}}</a></span></h3>\n" +
    "<dl class=\"dl-horizontal left\">\n" +
    "<dt translate>Build Strategy:</dt>\n" +
    "<dd>{{build.spec.strategy.type | startCase}}</dd>\n" +
    "<dt ng-if-start=\"(build | buildStrategy).from\" translate>Builder Image:</dt>\n" +
    "<dd ng-if-end class=\"truncate\">{{(build | buildStrategy).from | imageObjectRef : build.metadata.namespace}}<span ng-if=\"!(build | buildStrategy).from\"><em translate>none</em></span></dd>\n" +
    "<dt translate>Source Type:</dt>\n" +
    "<dd>{{build.spec.source.type}}</dd>\n" +
    "<dt ng-if-start=\"build.spec.source.git.uri\">Source Repo:</dt>\n" +
    "<dd ng-if-end><span class=\"word-break\"><osc-git-link uri=\"build.spec.source.git.uri\" ref=\"build.spec.source.git.ref\" context-dir=\"build.spec.source.contextDir\">{{build.spec.source.git.uri}}</osc-git-link></span></dd>\n" +
    "<dt ng-if-start=\"build.spec.source.git.ref\" translate>Source Ref:</dt>\n" +
    "<dd ng-if-end>{{build.spec.source.git.ref}}</dd>\n" +
    "<dt ng-if-start=\"build.spec.source.contextDir\" translate>Source Context Dir:</dt>\n" +
    "<dd ng-if-end>{{build.spec.source.contextDir}}</dd>\n" +
    "<dt ng-if-start=\"build.spec.revision.git.commit\" translate>Source Commit:</dt>\n" +
    "<dd ng-if-end>\n" +
    "{{build.spec.revision.git.message}}\n" +
    "<osc-git-link class=\"hash\" uri=\"build.spec.source.git.uri\" ref=\"build.spec.revision.git.commit\">{{build.spec.revision.git.commit | limitTo:7}}</osc-git-link>\n" +
    "<span ng-if=\"build.spec.revision.git.author\" translate>\n" +
    "authored by {{build.spec.revision.git.author.name}}\n" +
    "</span>\n" +
    "</dd>\n" +
    "<dt ng-if-start=\"outputTo = build.spec.output.to\" translate>Output Image:</dt>\n" +
    "<dd ng-if-end>\n" +
    "<a ng-if=\"outputTo.kind === 'ImageStreamTag' && (!outputTo.namespace || build.metadata.namespace === outputTo.namespace)\" ng-href=\"{{outputTo.name | navigateResourceURL : 'ImageStreamTag' : build.metadata.namespace}}\">\n" +
    "{{outputTo | imageObjectRef : build.metadata.namespace}}\n" +
    "</a>\n" +
    "<span ng-if=\"outputTo.kind !== 'ImageStreamTag' || (outputTo.namespace && build.metadata.namespace !== outputTo.namespace)\">\n" +
    "{{outputTo | imageObjectRef : build.metadata.namespace}}\n" +
    "</span>\n" +
    "</dd>\n" +
    "<dt ng-if-start=\"build.spec.output.pushSecret.name\" translate>Push Secret:</dt>\n" +
    "<dd ng-if-end>{{build.spec.output.pushSecret.name}}</dd>\n" +
    "<dt ng-if-start=\"build.spec.strategy.jenkinsPipelineStrategy.jenkinsfilePath\" translate>\n" +
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
    "<a href=\"\" ng-click=\"showJenkinsfileExamples()\" translate>What's a Jenkinsfile?</a>\n" +
    "</div>\n" +
    "<div ng-if-start=\"build.spec.strategy.jenkinsPipelineStrategy.jenkinsfile\" class=\"small pull-right mar-top-sm\">\n" +
    "<a href=\"\" ng-click=\"showJenkinsfileExamples()\" translate>What's a Jenkinsfile?</a>\n" +
    "</div>\n" +
    "<dt translate>\n" +
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
    "<h3 translate>Post-Commit Hooks</h3>\n" +
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
    "<translate>Status</translate>\n" +
    "<small ng-if=\"pod | isDebugPod\">\n" +
    "debugging\n" +
    "<a ng-href=\"{{pod | debugPodSourceName | navigateResourceURL : 'Pod' : pod.metadata.namespace}}\">{{pod | debugPodSourceName}}</a>\n" +
    "</small>\n" +
    "</h3>\n" +
    "<dl class=\"dl-horizontal left\">\n" +
    "<dt translate>Status:</dt>\n" +
    "<dd>\n" +
    "<status-icon status=\"pod | podStatus\"></status-icon>\n" +
    "{{pod | podStatus | sentenceCase}}<span ng-if=\"pod | podCompletionTime\" translate>, ran for {{(pod | podStartTime) | duration : (pod | podCompletionTime)}}</span>\n" +
    "<span ng-if=\"pod.metadata.deletionTimestamp\" translate>(expires {{pod.metadata.deletionTimestamp | date : 'medium'}})</span>\n" +
    "</dd>\n" +
    "<dt ng-if-start=\"pod.status.message\" translate>Message:</dt>\n" +
    "<dd ng-if-end>{{pod.status.message}}</dd>\n" +
    "<dt ng-if-start=\"dcName\" translate>\n" +
    "Deployment:\n" +
    "</dt>\n" +
    "<dd ng-if-end>\n" +
    "<a ng-href=\"{{dcName | navigateResourceURL : 'DeploymentConfig' : pod.metadata.namespace}}\">{{dcName}}</a><span ng-if=\"rcName\">,\n" +
    "<a ng-href=\"{{rcName | navigateResourceURL : 'ReplicationController' : pod.metadata.namespace}}\"><span ng-if=\"deploymentVersion\">#{{deploymentVersion}}</span><span ng-if=\"!deploymentVersion\">{{rcName}}</span></a></span>\n" +
    "</dd>\n" +
    "<dt ng-if-start=\"!dcName && controllerRef\">\n" +
    "{{controllerRef.kind | humanizeKind : true}}:\n" +
    "</dt>\n" +
    "<dd ng-if-end>\n" +
    "<a ng-href=\"{{controllerRef.name | navigateResourceURL : controllerRef.kind : pod.metadata.namespace}}\">{{controllerRef.name}}</a>\n" +
    "</dd>\n" +
    "<dt ng-if-start=\"pod.metadata.deletionTimestamp && pod.spec.terminationGracePeriodSeconds\" translate>Grace Period:</dt>\n" +
    "<dd ng-if-end>\n" +
    "\n" +
    "<span ng-if=\"pod.spec.terminationGracePeriodSeconds < 60\">\n" +
    "{{pod.spec.terminationGracePeriodSeconds}} seconds\n" +
    "</span>\n" +
    "<span ng-if=\"pod.spec.terminationGracePeriodSeconds >= 60\">\n" +
    "{{pod.spec.terminationGracePeriodSeconds | humanizeDurationValue : 'seconds'}}\n" +
    "</span>\n" +
    "</dd>\n" +
    "<dt translate>IP:</dt>\n" +
    "<dd>{{pod.status.podIP || 'unknown'}}</dd>\n" +
    "<dt translate>Node:</dt>\n" +
    "<dd>{{pod.spec.nodeName || 'unknown'}} <span ng-if=\"pod.status.hostIP && pod.spec.nodeName != pod.status.hostIP\">({{pod.status.hostIP}})</span></dd>\n" +
    "<dt translate>Restart Policy:</dt>\n" +
    "<dd>{{pod.spec.restartPolicy || 'Always'}}</dd>\n" +
    "<dt ng-if-start=\"pod.spec.activeDeadlineSeconds\" translate>Active Deadline:</dt>\n" +
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
    "<div>\n" +
    "<container-statuses pod=\"pod\" on-debug-terminal=\"debugTerminal\" detailed=\"true\"></container-statuses>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"col-lg-6\">\n" +
    "<h3 translate>Template</h3>\n" +
    "<pod-template pod-template=\"pod\" images-by-docker-reference=\"imagesByDockerReference\" builds=\"builds\" detailed=\"true\">\n" +
    "</pod-template>\n" +
    "<h4 translate>Volumes</h4>\n" +
    "<volumes ng-if=\"pod.spec.volumes.length\" volumes=\"pod.spec.volumes\" namespace=\"project.metadata.name\"></volumes>\n" +
    "<div ng-if=\"!pod.spec.volumes.length\" translate>none</div>\n" +
    "<p ng-if=\"dcName && ('deploymentconfigs' | canI : 'update')\">\n" +
    "<a ng-href=\"project/{{project.metadata.name}}/attach-pvc?kind=DeploymentConfig&name={{dcName}}\" translate>Add Storage to {{dcName}}</a>\n" +
    "<span class=\"action-divider\" aria-hidden=\"true\">|</span>\n" +
    "<a ng-href=\"project/{{project.metadata.name}}/add-config-volume?kind=DeploymentConfig&name={{dcName}}\" translate>Add Config Files to {{dcName}}</a>\n" +
    "</p>\n" +
    "</div>\n" +
    "</div>\n" +
    "<annotations annotations=\"pod.metadata.annotations\"></annotations>\n" +
    "</div>"
  );


  $templateCache.put('views/browse/_replica-set-actions.html',
    "<div ng-if=\"('replicaSets' | canIDoAny)\" class=\"pull-right dropdown\">\n" +
    "<button type=\"button\" class=\"dropdown-toggle btn btn-default actions-dropdown-btn hidden-xs\" data-toggle=\"dropdown\">\n" +
    "<translate>Actions</translate>\n" +
    "<span class=\"caret\"></span>\n" +
    "</button>\n" +
    "<a href=\"\" class=\"dropdown-toggle actions-dropdown-kebab visible-xs-inline\" data-toggle=\"dropdown\"><i class=\"fa fa-ellipsis-v\"></i><span class=\"sr-only\" translate>Actions</span></a>\n" +
    "<ul class=\"dropdown-menu dropdown-menu-right actions action-button\">\n" +
    "<li ng-if=\"deployment && ({ group: 'extensions', resource: 'deployments' } | canI : 'update')\">\n" +
    "<a ng-href=\"project/{{project.metadata.name}}/attach-pvc?kind=Deployment&name={{deployment.metadata.name}}&group=extensions\" role=\"button\" translate>Add Storage</a>\n" +
    "</li>\n" +
    "<li ng-if=\"!deployment && ({ group: 'extensions', resource: 'replicasets' } | canI : 'update')\">\n" +
    "<a ng-href=\"project/{{project.metadata.name}}/attach-pvc?kind=ReplicaSet&name={{replicaSet.metadata.name}}&group=extensions\" role=\"button\" translate>Add Storage</a>\n" +
    "</li>\n" +
    "<li ng-if=\"!autoscalers.length && ({ group: 'autoscaling', resource: 'horizontalpodautoscalers' } | canI : 'create')\">\n" +
    "<a ng-href=\"project/{{projectName}}/edit/autoscaler?kind=ReplicaSet&name={{replicaSet.metadata.name}}&group=extensions\" ng-if=\"!deployment\" role=\"button\" translate>Add Autoscaler</a>\n" +
    "<a ng-href=\"project/{{projectName}}/edit/autoscaler?kind=Deployment&name={{deployment.metadata.name}}&group=extensions\" ng-if=\"deployment\" role=\"button\" translate>Add Autoscaler</a>\n" +
    "</li>\n" +
    "<li ng-if=\"deployment && ({ group: 'extensions', resource: 'deployments' } | canI : 'update')\">\n" +
    "<a ng-href=\"project/{{projectName}}/set-limits?kind=Deployment&name={{deployment.metadata.name}}&group=extensions\" role=\"button\" translate>Edit Resource Limits</a>\n" +
    "</li>\n" +
    "<li ng-if=\"!deployment && ({ group: 'extensions', resource: 'replicasets' } | canI : 'update')\">\n" +
    "<a ng-href=\"project/{{projectName}}/set-limits?kind=ReplicaSet&name={{replicaSet.metadata.name}}&group=extensions\" role=\"button\" translate>Edit Resource Limits</a>\n" +
    "</li>\n" +
    "<li ng-if=\"(!deployment && ({ group: 'extensions', resource: 'replicasets' } | canI : 'update')) || (deployment && ({group: 'extensions', resource: 'deployments' } | canI : 'update'))\">\n" +
    "<a ng-href=\"{{healthCheckURL}}\" role=\"button\" translate>Edit Health Checks</a>\n" +
    "</li>\n" +
    "<li ng-if=\"{ group: 'extensions', resource: 'replicasets' } | canI : 'update'\">\n" +
    "<a ng-href=\"{{replicaSet | editYamlURL}}\" role=\"button\" translate>Edit YAML</a>\n" +
    "</li>\n" +
    "<li ng-if=\"{ group: 'extensions', resource: 'replicasets' } | canI : 'delete'\">\n" +
    "\n" +
    "<delete-link kind=\"ReplicaSet\" group=\"extensions\" resource-name=\"{{replicaSet.metadata.name}}\" project-name=\"{{replicaSet.metadata.namespace}}\" hpa-list=\"hpaForRS\" alerts=\"alerts\" translate>\n" +
    "Delete\n" +
    "</delete-link>\n" +
    "</li>\n" +
    "</ul>\n" +
    "</div>"
  );


  $templateCache.put('views/browse/_replica-set-details.html',
    "<div class=\"row\" style=\"max-width: 650px\">\n" +
    "<div class=\"col-sm-4 col-sm-push-8 browse-deployment-donut\">\n" +
    "<deployment-donut rc=\"replicaSet\" deployment=\"deployment\" deployment-config=\"deploymentConfig\" pods=\"podsForDeployment\" hpa=\"autoscalers\" scalable=\"isScalable()\" limit-ranges=\"limitRanges\" project=\"project\" quotas=\"quotas\" cluster-quotas=\"clusterQuotas\">\n" +
    "</deployment-donut>\n" +
    "</div>\n" +
    "<div class=\"col-sm-8 col-sm-pull-4\">\n" +
    "<dl class=\"dl-horizontal left\">\n" +
    "<dt ng-if-start=\"replicaSet | hasDeploymentConfig\" translate>Status:</dt>\n" +
    "<dd ng-if-end>\n" +
    "<status-icon status=\"replicaSet | deploymentStatus\"></status-icon>\n" +
    "{{replicaSet | deploymentStatus}}\n" +
    "<span style=\"margin-left: 7px\">\n" +
    "<button ng-show=\"!rollBackCollapsed && showRollbackAction()\" ng-disabled=\"(deploymentConfigDeploymentsInProgress[deploymentConfigName] | hashSize) > 0\" type=\"button\" class=\"btn btn-default btn-xs\" ng-click=\"rollBackCollapsed = !rollBackCollapsed\">Roll Back</button>\n" +
    "<div ng-show=\"rollBackCollapsed\" class=\"well well-sm\">\n" +
    "<translate>Use the following settings from {{replicaSet.metadata.name}} when rolling back:</translate>\n" +
    "<div class=\"checkbox\">\n" +
    "<label>\n" +
    "<input type=\"checkbox\" ng-model=\"changeScaleSettings\" ng-disabled=\"(deploymentConfigDeploymentsInProgress[deploymentConfigName] | hashSize) > 0\"> <translate>replica count and selector</translate>\n" +
    "</label>\n" +
    "</div>\n" +
    "<div class=\"checkbox\">\n" +
    "<label>\n" +
    "<input type=\"checkbox\" ng-model=\"changeStrategy\" ng-disabled=\"(deploymentConfigDeploymentsInProgress[deploymentConfigName] | hashSize) > 0\"> <translate>deployment strategy</translate>\n" +
    "</label>\n" +
    "</div>\n" +
    "<div class=\"checkbox\">\n" +
    "<label>\n" +
    "<input type=\"checkbox\" ng-model=\"changeTriggers\" ng-disabled=\"(deploymentConfigDeploymentsInProgress[deploymentConfigName] | hashSize) > 0\"> <translate>deployment trigger</translate>\n" +
    "</label>\n" +
    "</div>\n" +
    "<button type=\"button\" ng-click=\"rollbackToDeployment(replicaSet, changeScaleSettings, changeStrategy, changeTriggers)\" ng-disabled=\"(deploymentConfigDeploymentsInProgress[deploymentConfigName] | hashSize) > 0\" class=\"btn btn-default btn-xs\" translate>Roll Back</button>\n" +
    "</div>\n" +
    "\n" +
    "<button ng-show=\"(replicaSet | deploymentIsInProgress) && !replicaSet.metadata.deletionTimestamp && ('replicationcontrollers' | canI : 'update')\" type=\"button\" ng-click=\"cancelRunningDeployment(replicaSet)\" class=\"btn btn-default btn-xs\" translate>Cancel</button>\n" +
    "</span>\n" +
    "</dd>\n" +
    "<dt ng-if-start=\"replicaSet | hasDeploymentConfig\" translate>Deployment Config:</dt>\n" +
    "<dd ng-if-end>\n" +
    "<a ng-href=\"{{replicaSet | configURLForResource}}\">{{deploymentConfigName}}</a>\n" +
    "</dd>\n" +
    "<dt ng-if-start=\"deployment\" translate>Deployment:</dt>\n" +
    "<dd ng-if-end>\n" +
    "<a ng-href=\"{{deployment | navigateResourceURL}}\">{{deployment.metadata.name}}</a>\n" +
    "</dd>\n" +
    "<dt ng-if-start=\"replicaSet | annotation:'deploymentStatusReason'\" translate>Status Reason:</dt>\n" +
    "<dd ng-if-end>\n" +
    "{{replicaSet | annotation:'deploymentStatusReason'}}\n" +
    "</dd>\n" +
    "<dt ng-if-start=\"replicaSet | deploymentIsInProgress\" translate>Duration:</dt>\n" +
    "<dd ng-if-end>\n" +
    "<span ng-switch=\"replicaSet | deploymentStatus\" class=\"hide-ng-leave\">\n" +
    "<span ng-switch-when=\"Running\" translate>running for <duration-until-now timestamp=\"replicaSet.metadata.creationTimestamp\"></duration-until-now></span>\n" +
    "<span ng-switch-default translate>waiting for <duration-until-now timestamp=\"replicaSet.metadata.creationTimestamp\"></duration-until-now></span>\n" +
    "</span>\n" +
    "</dd>\n" +
    "<dt translate>Selectors:</dt>\n" +
    "<dd>\n" +
    "<selector selector=\"replicaSet.spec.selector\"></selector>\n" +
    "</dd>\n" +
    "<dt translate>Replicas:</dt>\n" +
    "<dd>\n" +
    "\n" +
    "<replicas status=\"replicaSet.status.replicas\" spec=\"replicaSet.spec.replicas\" disable-scaling=\"!isScalable()\" scale-fn=\"scale(replicas)\" deployment=\"replicaSet\">\n" +
    "</replicas>\n" +
    "<span ng-if=\"autoscalers.length\" translate>(autoscaled)</span>\n" +
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
    "<a ng-href=\"project/{{project.metadata.name}}/attach-pvc?kind=Deployment&name={{deployment.metadata.name}}&group=extensions\" translate>Add Storage</a>\n" +
    "<span class=\"action-divider\" aria-hidden=\"true\">|</span>\n" +
    "<a ng-href=\"project/{{project.metadata.name}}/add-config-volume?kind=Deployment&name={{deployment.metadata.name}}\" translate>Add Config Files</a>\n" +
    "</div>\n" +
    "<div ng-if=\"!replicaSet.spec.template.spec.volumes.length && !({ group: 'extensions', resource: 'deployments' } | canI : 'update')\" translate>none</div>\n" +
    "</div>\n" +
    "<div ng-if=\"!deployment\">\n" +
    "<div ng-if=\"resource | canI : 'update'\">\n" +
    "<volumes volumes=\"replicaSet.spec.template.spec.volumes\" namespace=\"project.metadata.name\" can-remove=\"true\" remove-fn=\"removeVolume(volume)\">\n" +
    "</volumes>\n" +
    "<a ng-href=\"project/{{project.metadata.name}}/attach-pvc?kind=ReplicaSet&name={{replicaSet.metadata.name}}&group=extensions\" translate>Add Storage</a>\n" +
    "<span class=\"action-divider\" aria-hidden=\"true\">|</span>\n" +
    "<a ng-href=\"project/{{project.metadata.name}}/add-config-volume?kind=ReplicaSet&name={{replicaSet.metadata.name}}&group=extensions\" translate>Add Config Files</a>\n" +
    "</div>\n" +
    "<div ng-if=\"!(resource | canI : 'update')\">\n" +
    "<volumes volumes=\"replicaSet.spec.template.spec.volumes\" namespace=\"project.metadata.name\"></volumes>\n" +
    "<span ng-if=\"!replicaSet.spec.template.spec.volumes.length\" translate>none</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"kind === 'ReplicationController'\">\n" +
    "<div ng-if=\"deploymentConfigName\">\n" +
    "<volumes volumes=\"replicaSet.spec.template.spec.volumes\" namespace=\"project.metadata.name\"></volumes>\n" +
    "<div ng-if=\"'deploymentconfigs' | canI : 'update'\">\n" +
    "<a ng-href=\"project/{{project.metadata.name}}/attach-pvc?kind=DeploymentConfig&name={{deploymentConfigName}}\" translate>Add Storage to {{deploymentConfigName}}</a>\n" +
    "<span class=\"action-divider\" aria-hidden=\"true\">|</span>\n" +
    "<a ng-href=\"project/{{project.metadata.name}}/add-config-volume?kind=DeploymentConfig&name={{deploymentConfigName}}\" translate>Add Config Files to {{deploymentConfigName}}</a>\n" +
    "</div>\n" +
    "<div ng-if=\"!replicaSet.spec.template.spec.volumes.length && !('deploymentconfigs' | canI : 'update')\" translate>none</div>\n" +
    "</div>\n" +
    "<div ng-if=\"!deploymentConfigName\">\n" +
    "<div ng-if=\"resource | canI : 'update'\">\n" +
    "<volumes volumes=\"replicaSet.spec.template.spec.volumes\" namespace=\"project.metadata.name\" can-remove=\"true\" remove-fn=\"removeVolume(volume)\">\n" +
    "</volumes>\n" +
    "<a ng-href=\"project/{{project.metadata.name}}/attach-pvc?kind=ReplicationController&name={{replicaSet.metadata.name}}\" translate>Add Storage</a>\n" +
    "<span class=\"action-divider\" aria-hidden=\"true\">|</span>\n" +
    "<a ng-href=\"project/{{project.metadata.name}}/add-config-volume?kind=ReplicationController&name={{replicaSet.metadata.name}}\" translate>Add Config Files</a>\n" +
    "</div>\n" +
    "<div ng-if=\"!(resource | canI : 'update')\">\n" +
    "<volumes volumes=\"replicaSet.spec.template.spec.volumes\" namespace=\"project.metadata.name\"></volumes>\n" +
    "<span ng-if=\"!replicaSet.spec.template.spec.volumes.length\" translate>none</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "\n" +
    "<div ng-if=\"!deploymentConfigName || autoscalers.length\">\n" +
    "<h3 translate>Autoscaling</h3>\n" +
    "\n" +
    "<div ng-repeat=\"warning in hpaWarnings\" class=\"alert alert-warning\">\n" +
    "<span class=\"pficon pficon-warning-triangle-o\" aria-hidden=\"true\"></span>\n" +
    "<span class=\"sr-only\" translate>Warning:</span>\n" +
    "{{warning.message}}\n" +
    "\n" +
    "<span ng-if=\"warning.reason === 'NoCPURequest'\">\n" +
    "\n" +
    "<a ng-href=\"project/{{projectName}}/set-limits?kind=DeploymentConfig&name={{deploymentConfigName}}\" ng-if=\"deploymentConfigName && !deploymentConfigMissing && ('deploymentconfigs' | canI : 'update')\" role=\"button\" translate>Edit Resource <span ng-if=\"!('cpu' | isRequestCalculated : project)\">Requests and</span> Limits</a>\n" +
    "\n" +
    "<a ng-href=\"project/{{projectName}}/set-limits?kind=ReplicationController&name={{replicaSet.metadata.name}}\" ng-if=\"!deploymentConfigName && kind === 'ReplicationController' && (resource | canI : 'update')\" role=\"button\" translate>Edit Resource <span ng-if=\"!('cpu' | isRequestCalculated : project)\">Requests and</span> Limits</a>\n" +
    "<a ng-href=\"project/{{projectName}}/set-limits?kind=ReplicaSet&name={{replicaSet.metadata.name}}&group=extensions\" ng-if=\"!deploymentConfigName && kind === 'ReplicaSet' && (resource | canI : 'update')\" role=\"button\" translate>Edit Resource <span ng-if=\"!('cpu' | isRequestCalculated : project)\">Requests and</span> Limits</a>\n" +
    "</span>\n" +
    "</div>\n" +
    "\n" +
    "<div ng-if=\"!autoscalers.length\">\n" +
    "<span ng-if=\"{resource: 'horizontalpodautoscalers', group: 'autoscaling'} | canI : 'create'\">\n" +
    "<a ng-if=\"replicaSet.kind === 'ReplicaSet' && !deployment\" ng-href=\"project/{{projectName}}/edit/autoscaler?kind=ReplicaSet&name={{replicaSet.metadata.name}}&group=extensions\" role=\"button\" translate>Add Autoscaler</a>\n" +
    "<a ng-if=\"replicaSet.kind === 'ReplicaSet' && deployment\" ng-href=\"project/{{projectName}}/edit/autoscaler?kind=Deployment&name={{deployment.metadata.name}}&group=extensions\" role=\"button\" translate>Add Autoscaler</a>\n" +
    "<a ng-if=\"replicaSet.kind === 'ReplicationController' && !deploymentConfigName\" ng-href=\"project/{{projectName}}/edit/autoscaler?kind=ReplicationController&name={{replicaSet.metadata.name}}\" role=\"button\" translate>Add Autoscaler</a>\n" +
    "<a ng-if=\"replicaSet.kind === 'ReplicationController' && deploymentConfigName\" ng-href=\"project/{{projectName}}/edit/autoscaler?kind=DeploymentConfig&name={{deploymentConfigName}}\" role=\"button\" translate>Add Autoscaler</a>\n" +
    "</span>\n" +
    "<span ng-if=\"!({resource: 'horizontalpodautoscalers', group: 'autoscaling'} | canI : 'create')\">\n" +
    "<translate>Autoscaling is not enabled. There are no autoscalers for this</translate>\n" +
    "<span ng-if=\"deploymentConfigName\" translate>deployment config or deployment.</span>\n" +
    "<span ng-if=\"!deploymentConfigName\">{{replicaSet.kind | humanizeKind}}.</span>\n" +
    "</span>\n" +
    "</div>\n" +
    "\n" +
    "<div ng-repeat=\"hpa in autoscalers | orderBy : 'name'\">\n" +
    "<hpa hpa=\"hpa\" show-scale-target=\"hpa.spec.scaleTargetRef.kind !== 'ReplicationController'\" alerts=\"alerts\">\n" +
    "</hpa>\n" +
    "</div>\n" +
    "</div>\n" +
    "<h3>Pods</h3>\n" +
    "<pods-table pods=\"podsForDeployment\"></pods-table>\n" +
    "<annotations annotations=\"replicaSet.metadata.annotations\"></annotations>"
  );


  $templateCache.put('views/browse/_replication-controller-actions.html',
    "<div ng-if=\"(('replicationControllers' | canIDoAny) || (!deploymentConfigName && !autoscalers.length && ({ group: 'autoscaling', resource: 'horizontalpodautoscalers' } | canI : 'create')))\" class=\"pull-right dropdown\">\n" +
    "<button type=\"button\" class=\"dropdown-toggle btn btn-default actions-dropdown-btn hidden-xs\" data-toggle=\"dropdown\">\n" +
    "<translate>Actions</translate>\n" +
    "<span class=\"caret\"></span>\n" +
    "</button>\n" +
    "<a href=\"\" class=\"dropdown-toggle actions-dropdown-kebab visible-xs-inline\" data-toggle=\"dropdown\"><i class=\"fa fa-ellipsis-v\"></i><span class=\"sr-only\" translate>Actions</span></a>\n" +
    "<ul class=\"dropdown-menu dropdown-menu-right actions action-button\">\n" +
    "<li ng-if=\"deploymentConfigName && ('deploymentconfigs' | canI : 'update')\">\n" +
    "<a ng-href=\"project/{{project.metadata.name}}/attach-pvc?kind=DeploymentConfig&name={{deploymentConfigName}}\" role=\"button\" translate>Add Storage</a>\n" +
    "</li>\n" +
    "<li ng-if=\"!deploymentConfigName && ('replicationcontrollers' | canI : 'update')\">\n" +
    "<a ng-href=\"project/{{project.metadata.name}}/attach-pvc?kind=ReplicationController&name={{replicaSet.metadata.name}}\" role=\"button\" translate>Add Storage</a>\n" +
    "</li>\n" +
    "<li ng-if=\"!autoscalers.length && ({resource: 'horizontalpodautoscalers', group: 'autoscaling'} | canI : 'create')\">\n" +
    "\n" +
    "<a ng-href=\"project/{{projectName}}/edit/autoscaler?kind=ReplicationController&name={{replicaSet.metadata.name}}\" ng-if=\"!deploymentConfigName\" role=\"button\" translate>Add Autoscaler</a>\n" +
    "<a ng-href=\"project/{{projectName}}/edit/autoscaler?kind=DeploymentConfig&name={{deploymentConfigName}}\" ng-if=\"deploymentConfigName\" role=\"button\" translate>Add Autoscaler</a>\n" +
    "</li>\n" +
    "<li ng-if=\"deploymentConfigName && ('deploymentconfigs' | canI : 'update')\">\n" +
    "<a ng-href=\"project/{{projectName}}/set-limits?kind=DeploymentConfig&name={{deploymentConfigName}}\" role=\"button\" translate>Edit Resource Limits</a>\n" +
    "</li>\n" +
    "<li ng-if=\"!deploymentConfigName && ('replicationcontrollers' | canI : 'update')\">\n" +
    "<a ng-href=\"project/{{projectName}}/set-limits?kind=ReplicationController&name={{replicaSet.metadata.name}}\" role=\"button\" translate>Edit Resource Limits</a>\n" +
    "</li>\n" +
    "\n" +
    "<li ng-if=\"(!deploymentConfigName && ('replicationcontrollers' | canI : 'update')) || (deploymentConfigName && ('deploymentconfigs' | canI : 'update'))\">\n" +
    "<a ng-href=\"{{healthCheckURL}}\" role=\"button\" translate>Edit Health Checks</a>\n" +
    "</li>\n" +
    "<li ng-if=\"'replicationcontrollers' | canI : 'update'\">\n" +
    "<a ng-href=\"{{replicaSet | editYamlURL}}\" role=\"button\" translate>Edit YAML</a>\n" +
    "</li>\n" +
    "<li ng-if=\"'replicationcontrollers' | canI : 'delete'\">\n" +
    "<delete-link kind=\"ReplicationController\" type-display-name=\"{{deploymentConfigName ? 'deployment' : 'replication controller'}}\" resource-name=\"{{replicaSet.metadata.name}}\" project-name=\"{{replicaSet.metadata.namespace}}\" alerts=\"alerts\" hpa-list=\"hpaForRS\" redirect-url=\"{{replicaSet | configURLForResource}}\" translate>\n" +
    "Delete\n" +
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
    "<button class=\"btn btn-default hidden-xs\" ng-if=\"('buildconfigs/instantiate' | canI : 'create') && !(buildConfig | isBinaryBuild)\" ng-click=\"startBuild()\">\n" +
    "<span ng-if=\"!(buildConfig | isJenkinsPipelineStrategy)\" translate>\n" +
    "Start Build\n" +
    "</span>\n" +
    "<span ng-if=\"buildConfig | isJenkinsPipelineStrategy\" translate>\n" +
    "Start Pipeline\n" +
    "</span>\n" +
    "</button>\n" +
    "\n" +
    "<button type=\"button\" class=\"dropdown-toggle actions-dropdown-btn btn btn-default hidden-xs\" data-toggle=\"dropdown\">\n" +
    "<translate>Actions</translate>\n" +
    "<span class=\"caret\" aria-hidden=\"true\"></span>\n" +
    "</button>\n" +
    "<a href=\"\" class=\"dropdown-toggle actions-dropdown-kebab visible-xs-inline\" data-toggle=\"dropdown\"><i class=\"fa fa-ellipsis-v\"></i><span class=\"sr-only\">Actions</span></a>\n" +
    "<ul class=\"dropdown-menu dropdown-menu-right actions action-button\">\n" +
    "<li class=\"visible-xs-inline\" ng-if=\"('buildconfigs/instantiate' | canI : 'create') && !(buildConfig | isBinaryBuild)\">\n" +
    "<a href=\"\" role=\"button\" ng-click=\"startBuild()\">\n" +
    "<span ng-if=\"!(buildConfig | isJenkinsPipelineStrategy)\" translate>\n" +
    "Start Build\n" +
    "</span>\n" +
    "<span ng-if=\"buildConfig | isJenkinsPipelineStrategy\" translate>\n" +
    "Start Pipeline\n" +
    "</span>\n" +
    "</a>\n" +
    "</li>\n" +
    "<li ng-if=\"'buildconfigs' | canI : 'update'\">\n" +
    "<a ng-href=\"{{buildConfig | editResourceURL}}\" role=\"button\" translate>Edit</a>\n" +
    "</li>\n" +
    "<li ng-if=\"'buildconfigs' | canI : 'update'\">\n" +
    "<a ng-href=\"{{buildConfig | editYamlURL}}\" role=\"button\" translate>Edit YAML</a>\n" +
    "</li>\n" +
    "<li ng-if=\"'buildconfigs' | canI : 'delete'\">\n" +
    "<delete-link kind=\"BuildConfig\" resource-name=\"{{buildConfig.metadata.name}}\" project-name=\"{{buildConfig.metadata.namespace}}\" alerts=\"alerts\" translate>Delete\n" +
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
    "<div ng-if=\"!loaded\" translate>Loading...</div>\n" +
    "<div class=\"row\" ng-if=\"loaded\">\n" +
    "<div class=\"col-md-12\" ng-class=\"{ 'hide-tabs' : !buildConfig }\">\n" +
    "<uib-tabset>\n" +
    "<uib-tab active=\"selectedTab.history\">\n" +
    "<uib-tab-heading translate>History</uib-tab-heading>\n" +
    "\n" +
    "<div ng-if=\"!unfilteredBuilds\" class=\"gutter-bottom\" translate>Loading...</div>\n" +
    "\n" +
    "<div ng-if=\"buildConfig && unfilteredBuilds && (unfilteredBuilds | hashSize) === 0\" class=\"empty-state-message text-center\">\n" +
    "<h2 translate>No builds.</h2>\n" +
    "<p>\n" +
    "<span ng-if=\"!buildConfig.spec.strategy.jenkinsPipelineStrategy\">\n" +
    "<span ng-if=\"!('buildconfigs/instantiate' | canI : 'create')\" translate>\n" +
    "Builds will create an image from\n" +
    "</span>\n" +
    "<span ng-if=\"'buildconfigs/instantiate' | canI : 'create'\" translate>\n" +
    "Start a new build to create an image from\n" +
    "</span>\n" +
    "<span ng-if=\"buildConfig.spec.source.type === 'Git'\">\n" +
    "<translate>source repository</translate>\n" +
    "<span class=\"word-break\"><osc-git-link uri=\"buildConfig.spec.source.git.uri\" ref=\"buildConfig.spec.source.git.ref\" context-dir=\"buildConfig.spec.source.contextDir\">{{buildConfig.spec.source.git.uri}}</osc-git-link></span>\n" +
    "</span>\n" +
    "<span ng-if=\"buildConfig.spec.source.type !== 'Git'\" translate>\n" +
    "build configuration {{buildConfig.metadata.name}}.\n" +
    "</span>\n" +
    "</span>\n" +
    "<span ng-if=\"buildConfig.spec.strategy.jenkinsPipelineStrategy\">\n" +
    "<translate>No pipeline builds have run for {{buildConfigName}}.</translate>\n" +
    "<br>\n" +
    "<span ng-if=\"buildConfig.spec.strategy.jenkinsPipelineStrategy.jenkinsfile\" translate>\n" +
    "View the <a ng-href=\"{{(buildConfig | navigateResourceURL) + '?tab=configuration'}}\">Jenkinsfile</a> to see what stages will run.\n" +
    "</span>\n" +
    "<span ng-if=\"buildConfig.spec.strategy.jenkinsPipelineStrategy.jenkinsfilePath\">\n" +
    "<translate>View the file <code>{{buildConfig.spec.strategy.jenkinsPipelineStrategy.jenkinsfilePath}}</code> in the</translate>\n" +
    "<a ng-if=\"buildConfig | jenkinsfileLink\" ng-href=\"buildConfig | jenkinsfileLink\" translate>source repository</a>\n" +
    "<span ng-if=\"!(buildConfig | jenkinsfileLink)\" translate>source repository</span>\n" +
    "<translate>to see what stages will run.</translate>\n" +
    "</span>\n" +
    "</span>\n" +
    "</p>\n" +
    "<button class=\"btn btn-primary btn-lg\" ng-click=\"startBuild()\" ng-if=\"('buildconfigs/instantiate' | canI : 'create') && !(buildConfig | isBinaryBuild)\">\n" +
    "<span ng-if=\"!(buildConfig | isJenkinsPipelineStrategy)\" translate>\n" +
    "Start Build\n" +
    "</span>\n" +
    "<span ng-if=\"buildConfig | isJenkinsPipelineStrategy\" translate>\n" +
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
    "<translate>Build</translate>\n" +
    "\n" +
    "<a ng-href=\"{{latestBuild | navigateResourceURL}}\"><span ng-if=\"latestBuild | annotation : 'buildNumber'\">#{{latestBuild | annotation : 'buildNumber'}}</span><span ng-if=\"!(latestBuild | annotation : 'buildNumber')\">{{latestBuild.metadata.name}}</span></a>\n" +
    "<span ng-switch=\"latestBuild.status.phase\" class=\"hide-ng-leave\">\n" +
    "<span ng-switch-when=\"Failed\" translate>failed.</span>\n" +
    "<span ng-switch-when=\"Error\" translate>encountered an error.</span>\n" +
    "<span ng-switch-when=\"Cancelled\" translate>was cancelled.</span>\n" +
    "<span ng-switch-default><translate>is</translate> {{latestBuild.status.phase | lowercase}}.</span>\n" +
    "</span>\n" +
    "</span>\n" +
    "<span ng-if=\"latestBuild | buildLogURL\">\n" +
    "\n" +
    "<span ng-if=\"latestBuild | isJenkinsPipelineStrategy\">\n" +
    "<a ng-href=\"{{latestBuild | buildLogURL}}\" target=\"_blank\" translate>View Log</a>\n" +
    "</span>\n" +
    "\n" +
    "<span ng-if=\"!(latestBuild | isJenkinsPipelineStrategy) && ('builds/log' | canI : 'get')\">\n" +
    "<a ng-href=\"{{latestBuild | buildLogURL}}\" translate>View Log</a>\n" +
    "</span>\n" +
    "</span>\n" +
    "</div>\n" +
    "<div class=\"last-timestamp meta text-muted\">\n" +
    "<span ng-if=\"!latestBuild.status.startTimestamp\">\n" +
    "<translate>created</translate> <span am-time-ago=\"latestBuild.metadata.creationTimestamp\"></span>\n" +
    "</span>\n" +
    "<span ng-if=\"latestBuild.status.startTimestamp\">\n" +
    "<translate>started</translate> <span am-time-ago=\"latestBuild.status.startTimestamp\"></span>\n" +
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
    "<th translate>Build</th>\n" +
    "<th translate>Status</th>\n" +
    "<th translate>Duration</th>\n" +
    "<th translate>Created</th>\n" +
    "</tr>\n" +
    "</thead>\n" +
    "<tbody ng-if=\"(builds | hashSize) == 0\">\n" +
    "<tr><td colspan=\"3\"><em>{{emptyMessage|translate}}</em></td></tr>\n" +
    "</tbody>\n" +
    "<tbody ng-if=\"(builds | hashSize) > 0\">\n" +
    "<tr ng-repeat=\"build in orderedBuilds track by (build | uid)\">\n" +
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
    "<tbody><tr><td><em>{{emptyMessage|translate}}</em></td></tr></tbody>\n" +
    "</table>\n" +
    "</div>\n" +
    "</div>\n" +
    "</uib-tab>\n" +
    "<uib-tab active=\"selectedTab.configuration\" ng-if=\"buildConfig\">\n" +
    "<uib-tab-heading translate>Configuration</uib-tab-heading>\n" +
    "<div class=\"resource-details\">\n" +
    "<div class=\"row\">\n" +
    "<div class=\"col-lg-6\">\n" +
    "\n" +
    "<h3 class=\"hidden visible-lg visible-xl\" translate>Details</h3>\n" +
    "<dl class=\"dl-horizontal left\">\n" +
    "<div>\n" +
    "<dt translate>Build Strategy:</dt>\n" +
    "<dd>{{buildConfig.spec.strategy.type | startCase}}</dd>\n" +
    "</div>\n" +
    "<div ng-if=\"buildConfig.spec.source\">\n" +
    "<div ng-if=\"buildConfig.spec.source.type == 'Git'\">\n" +
    "<dt translate>Source Repo:</dt>\n" +
    "<dd><span class=\"word-break\"><osc-git-link uri=\"buildConfig.spec.source.git.uri\" ref=\"buildConfig.spec.source.git.ref\" context-dir=\"buildConfig.spec.source.contextDir\">{{buildConfig.spec.source.git.uri}}</osc-git-link></span></dd>\n" +
    "<dt ng-if=\"buildConfig.spec.source.git.ref\" translate>Source Ref:</dt>\n" +
    "<dd ng-if=\"buildConfig.spec.source.git.ref\">{{buildConfig.spec.source.git.ref}}</dd>\n" +
    "<dt ng-if=\"buildConfig.spec.source.contextDir\" translate>Source Context Dir:</dt>\n" +
    "<dd ng-if=\"buildConfig.spec.source.contextDir\">{{buildConfig.spec.source.contextDir}}</dd>\n" +
    "</div>\n" +
    "<div ng-if=\"buildConfig.spec.strategy.jenkinsPipelineStrategy.jenkinsfilePath\">\n" +
    "<dt translate>Jenkinsfile Path:</dt>\n" +
    "<dd ng-if=\"buildConfig | jenkinsfileLink\">\n" +
    "<a ng-href=\"{{buildConfig | jenkinsfileLink}}\">{{buildConfig.spec.strategy.jenkinsPipelineStrategy.jenkinsfilePath}}</a>\n" +
    "</dd>\n" +
    "<dd ng-if=\"!(buildConfig | jenkinsfileLink)\">\n" +
    "{{buildConfig.spec.strategy.jenkinsPipelineStrategy.jenkinsfilePath}}\n" +
    "</dd>\n" +
    "<div class=\"small\">\n" +
    "<a href=\"\" ng-click=\"showJenkinsfileExamples()\" translate>What's a Jenkinsfile?</a>\n" +
    "</div>\n" +
    "</div>\n" +
    "<dt ng-if-start=\"buildConfig.spec.source.binary.asFile\" translate>Binary Input as File:</dt>\n" +
    "<dd ng-if-end>{{buildConfig.spec.source.binary.asFile}}</dd>\n" +
    "<div ng-if=\"buildConfig.spec.source.type == 'None' && !(buildConfig | isJenkinsPipelineStrategy)\">\n" +
    "<dt translate>Source:</dt>\n" +
    "<dd>\n" +
    "<i translate>none</i>\n" +
    "<span class=\"help action-inline\">\n" +
    "<a href>\n" +
    "<i class=\"pficon pficon-help\" data-toggle=\"tooltip\" aria-hidden=\"true\" data-original-title=\"No source inputs have been defined for this build configuration.\">\n" +
    "</i>\n" +
    "</a>\n" +
    "</span>\n" +
    "</dd>\n" +
    "</div>\n" +
    "<div ng-if=\"buildConfig.spec.source.images\" class=\"image-sources\">\n" +
    "<dt translate>Image Sources:</dt>\n" +
    "<dd></dd>\n" +
    "<div ng-repeat=\"imageSource in imageSources\" class=\"image-source-item\">\n" +
    "<h4>{{imageSource.from | imageObjectRef : buildConfig.metadata.namespace}}</h4>\n" +
    "<dl class=\"dl-horizontal left\">\n" +
    "<div class=\"is-item-description\">\n" +
    "<dt translate>Paths:</dt>\n" +
    "<div ng-repeat=\"(source, destination) in imageSourcesPaths[$index]\" class=\"image-source-paths\">\n" +
    "<dd><span class=\"source-path\">{{source}}</span><i class=\"fa fa-long-arrow-right\"></i><span class=\"destination-dir\">{{destination}}</span></dd>\n" +
    "</div>\n" +
    "</div>\n" +
    "</dl>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<dt ng-if-start=\"buildFrom = (buildConfig | buildStrategy).from\" translate>Builder Image:</dt>\n" +
    "<dd ng-if-end>\n" +
    "<a ng-if=\"buildFrom.kind === 'ImageStreamTag' && (!buildFrom.namespace || buildConfig.metadata.namespace === buildFrom.namespace)\" ng-href=\"{{buildFrom.name | navigateResourceURL : 'ImageStreamTag' : buildConfig.metadata.namespace}}\">\n" +
    "{{buildFrom | imageObjectRef : buildConfig.metadata.namespace}}\n" +
    "</a>\n" +
    "<span ng-if=\"buildFrom.kind !== 'ImageStreamTag' || (buildFrom.namespace && buildConfig.metadata.namespace !== buildFrom.namespace)\">\n" +
    "{{buildFrom | imageObjectRef : buildConfig.metadata.namespace}}\n" +
    "</span>\n" +
    "</dd>\n" +
    "<div ng-if=\"outputTo = buildConfig.spec.output.to\">\n" +
    "<dt translate>Output To:</dt>\n" +
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
    "<dt translate>Run Policy:</dt>\n" +
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
    "                                mode: 'dockerfile',\n" +
    "                                theme: 'dreamweaver',\n" +
    "                                onLoad: aceLoaded,\n" +
    "                                highlightActiveLine: false,\n" +
    "                                showGutter: false,\n" +
    "                                rendererOptions: {\n" +
    "                                  fadeFoldWidgets: true,\n" +
    "                                  highlightActiveLine: false,\n" +
    "                                  showPrintMargin: false\n" +
    "                                },\n" +
    "                                advanced: {\n" +
    "                                  highlightActiveLine: false\n" +
    "                                }\n" +
    "                              }\" readonly=\"readonly\" ng-model=\"buildConfig.spec.source.dockerfile\" class=\"ace-bordered ace-read-only ace-inline dockerfile-mode mar-top-md\"></div>\n" +
    "</div>\n" +
    "<div ng-if=\"buildConfig.spec.strategy.jenkinsPipelineStrategy.jenkinsfile\">\n" +
    "<div class=\"small pull-right mar-top-sm\">\n" +
    "<a href=\"\" ng-click=\"showJenkinsfileExamples()\">What's a Jenkinsfile?</a>\n" +
    "</div>\n" +
    "<dt>\n" +
    "Jenkinsfile:\n" +
    "</dt><dd></dd>\n" +
    "<div ui-ace=\"{\n" +
    "                                mode: 'groovy',\n" +
    "                                theme: 'eclipse',\n" +
    "                                showGutter: false,\n" +
    "                                rendererOptions: {\n" +
    "                                  fadeFoldWidgets: true,\n" +
    "                                  highlightActiveLine: false,\n" +
    "                                  showPrintMargin: false\n" +
    "                                },\n" +
    "                                advanced: {\n" +
    "                                  highlightActiveLine: false\n" +
    "                                }\n" +
    "                              }\" readonly=\"readonly\" ng-model=\"buildConfig.spec.strategy.jenkinsPipelineStrategy.jenkinsfile\" class=\"ace-bordered ace-inline ace-read-only\"></div>\n" +
    "</div>\n" +
    "</dl>\n" +
    "<div ng-if=\"buildConfig | hasPostCommitHook\">\n" +
    "<h3 translate>Post-Commit Hooks</h3>\n" +
    "<build-hooks build=\"buildConfig\"></build-hooks>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"col-lg-6\">\n" +
    "<h3><translate>Triggers</translate> <a href=\"{{'build-triggers' | helpLink}}\" target=\"_blank\"><span class=\"learn-more-inline\">Learn More&nbsp;<i class=\"fa fa-external-link\" aria-hidden=\"true\"></i></span></a></h3>\n" +
    "<dl class=\"dl-horizontal left build-triggers\">\n" +
    "<div ng-repeat=\"trigger in buildConfig.spec.triggers | orderBy : 'type' : false : compareTriggers\">\n" +
    "<div ng-switch=\"trigger.type\">\n" +
    "<div ng-switch-when=\"Bitbucket\">\n" +
    "<dt translate>Bitbucket Webhook URL:\n" +
    "</dt>\n" +
    "<dd>\n" +
    "<copy-to-clipboard clipboard-text=\"buildConfig.metadata.name | webhookURL : trigger.type : trigger.bitbucket.secret : project.metadata.name\"></copy-to-clipboard>\n" +
    "</dd>\n" +
    "</div>\n" +
    "<div ng-switch-when=\"GitHub\">\n" +
    "<dt translate>GitHub Webhook URL:\n" +
    "</dt>\n" +
    "<dd>\n" +
    "<copy-to-clipboard clipboard-text=\"buildConfig.metadata.name | webhookURL : trigger.type : trigger.github.secret : project.metadata.name\"></copy-to-clipboard>\n" +
    "</dd>\n" +
    "</div>\n" +
    "<div ng-switch-when=\"GitLab\">\n" +
    "<dt translate>GitLab Webhook URL:\n" +
    "</dt>\n" +
    "<dd>\n" +
    "<copy-to-clipboard clipboard-text=\"buildConfig.metadata.name | webhookURL : trigger.type : trigger.gitlab.secret : project.metadata.name\"></copy-to-clipboard>\n" +
    "</dd>\n" +
    "</div>\n" +
    "<div ng-switch-when=\"Generic\">\n" +
    "<dt translate>Generic Webhook URL:\n" +
    "</dt>\n" +
    "<dd>\n" +
    "<copy-to-clipboard clipboard-text=\"buildConfig.metadata.name | webhookURL : trigger.type : trigger.generic.secret : project.metadata.name\"></copy-to-clipboard>\n" +
    "</dd>\n" +
    "</div>\n" +
    "<div ng-switch-when=\"ImageChange\">\n" +
    "<dt translate>\n" +
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
    "<dt translate>Config Change For:</dt>\n" +
    "<dd translate>Build config {{buildConfig.metadata.name}}</dd>\n" +
    "</div>\n" +
    "<div ng-switch-default>\n" +
    "<dt translate>Other Trigger:</dt>\n" +
    "<dd>{{trigger.type}}</dd>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<dt translate>Manual (CLI):\n" +
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
    "<uib-tab-heading translate>Environment</uib-tab-heading>\n" +
    "<h3 translate>Environment Variables</h3>\n" +
    "<p ng-if=\"BCEnvVarsFromImage.length\">\n" +
    "<translate>The builder image has additional environment variables defined. Variables defined below will overwrite any from the image with the same name.</translate>\n" +
    "<a href=\"\" ng-click=\"expand.imageEnv = true\" ng-if=\"!expand.imageEnv\" translate>Show Image Environment Variables</a>\n" +
    "<a href=\"\" ng-click=\"expand.imageEnv = false\" ng-if=\"expand.imageEnv\" translate>Hide Image Environment Variables</a>\n" +
    "</p>\n" +
    "<key-value-editor ng-if=\"expand.imageEnv\" entries=\"BCEnvVarsFromImage\" key-placeholder=\"{{'Name'|translate}}\" value-placeholder=\"{{'Value'|translate}}\" is-readonly cannot-add cannot-sort cannot-delete show-header></key-value-editor>\n" +
    "<ng-form name=\"forms.bcEnvVars\" class=\"mar-bottom-xl block\">\n" +
    "<div ng-if=\"'buildconfigs' | canI : 'update'\">\n" +
    "<confirm-on-exit dirty=\"forms.bcEnvVars.$dirty\"></confirm-on-exit>\n" +
    "<key-value-editor entries=\"envVars\" key-placeholder=\"{{'Name'|translate}}\" value-placeholder=\"{{'Value'|translate}}\" key-validator=\"[A-Za-z_][A-Za-z0-9_]*\" key-validator-error=\"Please enter a valid key\" key-validator-error-tooltip=\"A valid environment variable name is an alphanumeric (a-z and 0-9) string beginning with a letter that may contain underscores.\" add-row-link=\"Add Environment Variable\" show-header></key-value-editor>\n" +
    "<button class=\"btn btn-default\" ng-click=\"saveEnvVars()\" ng-disabled=\"forms.bcEnvVars.$pristine || forms.bcEnvVars.$invalid\">Save</button>\n" +
    "<a ng-if=\"!forms.bcEnvVars.$pristine\" href=\"\" ng-click=\"clearEnvVarUpdates()\" class=\"mar-left-sm\" style=\"vertical-align: -2px\" translate>Clear Changes</a>\n" +
    "</div>\n" +
    "<key-value-editor ng-if=\"!('buildconfigs' | canI : 'update')\" entries=\"envVars\" key-placeholder=\"{{'Name'|translate}}\" value-placeholder=\"{{'Value'|translate}}\" is-readonly cannot-add cannot-sort cannot-delete show-header></key-value-editor>\n" +
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
    "<div ng-if=\"!loaded\" class=\"mar-top-xl\" translate>Loading...</div>\n" +
    "<div ng-if=\"build\">\n" +
    "<h1 class=\"contains-actions\">\n" +
    "<div class=\"pull-right dropdown\" ng-hide=\"!('builds' | canIDoAny)\">\n" +
    "\n" +
    "<button class=\"btn btn-default hidden-xs\" ng-click=\"cancelBuild()\" ng-if=\"!build.metadata.deletionTimestamp && (build | isIncompleteBuild) && ('builds' | canI : 'update')\">Cancel Build</button>\n" +
    "<button class=\"btn btn-default hidden-xs\" ng-click=\"cloneBuild()\" ng-hide=\"build.metadata.deletionTimestamp || (build | isIncompleteBuild) || !('builds/clone' | canI : 'create') || (build | isBinaryBuild)\" ng-disabled=\"!canBuild\" translate>Rebuild</button>\n" +
    "\n" +
    "<button type=\"button\" class=\"dropdown-toggle btn btn-default actions-dropdown-btn hidden-xs\" data-toggle=\"dropdown\">\n" +
    "<translate>Actions</translate>\n" +
    "<span class=\"caret\" aria-hidden=\"true\"></span>\n" +
    "</button>\n" +
    "<a href=\"\" class=\"dropdown-toggle actions-dropdown-kebab visible-xs-inline\" data-toggle=\"dropdown\"><i class=\"fa fa-ellipsis-v\"></i><span class=\"sr-only\" translate>Actions</span></a>\n" +
    "<ul class=\"dropdown-menu dropdown-menu-right actions action-button\">\n" +
    "<li ng-if=\"'buildconfigs' | canI : 'update'\">\n" +
    "<a ng-href=\"{{buildConfig | editResourceURL}}\" role=\"button\">\n" +
    "<span ng-if=\"!(buildConfig | isJenkinsPipelineStrategy)\" translate>\n" +
    "Edit Configuration\n" +
    "</span>\n" +
    "<span ng-if=\"buildConfig | isJenkinsPipelineStrategy\" translate>\n" +
    "Edit Pipeline\n" +
    "</span>\n" +
    "</a>\n" +
    "</li>\n" +
    "<li class=\"divider\" ng-if=\"'buildconfigs' | canI : 'update'\"></li>\n" +
    "<li ng-if=\"!build.metadata.deletionTimestamp && (build | isIncompleteBuild) && ('builds' | canI : 'update')\" class=\"visible-xs-inline\">\n" +
    "<a href=\"\" role=\"button\" ng-click=\"cancelBuild()\" translate>Cancel Build</a>\n" +
    "</li>\n" +
    "<li class=\"visible-xs-inline\" ng-class=\"{ disabled: !canBuild }\" ng-hide=\"build.metadata.deletionTimestamp || (build | isIncompleteBuild) || !('builds/clone' | canI : 'create') || (build | isBinaryBuild)\">\n" +
    "<a href=\"\" role=\"button\" ng-click=\"cloneBuild()\" ng-attr-aria-disabled=\"{{canBuild ? undefined : 'true'}}\" ng-class=\"{ 'disabled-link': !canBuild }\" translate>Rebuild</a>\n" +
    "</li>\n" +
    "<li ng-if=\"('builds' | canI : 'update')\">\n" +
    "<a ng-href=\"{{build | editYamlURL}}\" role=\"button\" translate>Edit YAML</a>\n" +
    "</li>\n" +
    "<li ng-if=\"('builds' | canI : 'delete')\">\n" +
    "<delete-link kind=\"Build\" resource-name=\"{{build.metadata.name}}\" project-name=\"{{build.metadata.namespace}}\" alerts=\"alerts\" redirect-url=\"{{build | configURLForResource}}\" translate>Delete\n" +
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
    "<uib-tab-heading translate>Details</uib-tab-heading>\n" +
    "<build-pipeline build=\"build\" ng-if=\"build | isJenkinsPipelineStrategy\"></build-pipeline>\n" +
    "<ng-include src=\" 'views/browse/_build-details.html' \"></ng-include>\n" +
    "</uib-tab>\n" +
    "<uib-tab heading=\"Environment\" active=\"selectedTab.environment\" ng-if=\"!(build | isJenkinsPipelineStrategy)\">\n" +
    "<uib-tab-heading>Environment</uib-tab-heading>\n" +
    "<h3 translate>Environment Variables</h3>\n" +
    "<p ng-if=\"'buildconfigs' | canI : 'update'\">\n" +
    "<span class=\"pficon pficon-info\" aria-hidden=\"true\"></span>\n" +
    "<translate>Environment variables can be edited on the <a ng-href=\"{{build | configURLForResource}}?tab=environment\">build configuration</a>.</translate>\n" +
    "</p>\n" +
    "<key-value-editor entries=\"(build | buildStrategy).env\" key-placeholder=\"{{'Name'|translate}}\" value-placeholder=\"{{'Value'|translate}}\" cannot-add cannot-delete cannot-sort is-readonly show-header class=\"mar-bottom-xl block\"></key-value-editor>\n" +
    "<p ng-if=\"!(build | buildStrategy).env\"><em translate>The build strategy had no environment variables defined.</em></p>\n" +
    "</uib-tab>\n" +
    "<uib-tab active=\"selectedTab.logs\" ng-if=\"!(build | isJenkinsPipelineStrategy) && ('builds/log' | canI : 'get')\">\n" +
    "<uib-tab-heading translate>Logs</uib-tab-heading>\n" +
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
    "<uib-tab-heading translate>Events</uib-tab-heading>\n" +
    "<events api-objects=\"eventObjects\" project-context=\"projectContext\" ng-if=\"selectedTab.events\"></events>\n" +
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
    "<div ng-if=\"!loaded\" class=\"mar-top-xl\" translate>Loading...</div>\n" +
    "<div ng-if=\"loaded && error\" class=\"empty-state-message text-center\">\n" +
    "<h2 translate>The config map could not be loaded.</h2>\n" +
    "<p>{{error | getErrorDetails}}</p>\n" +
    "</div>\n" +
    "<div ng-if=\"loaded && !error\">\n" +
    "<h1 class=\"contains-actions\">\n" +
    "<div class=\"pull-right dropdown\" ng-if=\"'configmaps' | canIDoAny\">\n" +
    "<button type=\"button\" class=\"dropdown-toggle btn btn-default actions-dropdown-btn hidden-xs\" data-toggle=\"dropdown\">\n" +
    "<translate>Actions</translate>\n" +
    "<span class=\"caret\"></span>\n" +
    "</button>\n" +
    "<a href=\"\" class=\"dropdown-toggle actions-dropdown-kebab visible-xs-inline\" data-toggle=\"dropdown\"><i class=\"fa fa-ellipsis-v\"></i><span class=\"sr-only\" translate>Actions</span></a>\n" +
    "<ul class=\"dropdown-menu dropdown-menu-right actions action-button\">\n" +
    "<li ng-if=\"'configmaps' | canI : 'update'\">\n" +
    "<a ng-href=\"{{configMap | editResourceURL}}\" role=\"button\" translate>Edit</a>\n" +
    "</li>\n" +
    "<li ng-if=\"'configmaps' | canI : 'update'\">\n" +
    "<a ng-href=\"{{configMap | editYamlURL}}\" role=\"button\" translate>Edit YAML</a>\n" +
    "</li>\n" +
    "<li ng-if=\"'configmaps' | canI : 'delete'\">\n" +
    "<delete-link kind=\"ConfigMap\" resource-name=\"{{configMap.metadata.name}}\" project-name=\"{{configMap.metadata.namespace}}\" alerts=\"alerts\" translate>Delete\n" +
    "</delete-link>\n" +
    "</li>\n" +
    "</ul>\n" +
    "</div>\n" +
    "{{configMap.metadata.name}}\n" +
    "<small class=\"meta\"><translate>created</translate> <span am-time-ago=\"configMap.metadata.creationTimestamp\"></span></small>\n" +
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
    "<h2 translate>The config map has no items.</h2>\n" +
    "</div>\n" +
    "<div ng-if=\"configMap.data | hashSize\" class=\"table-responsive scroll-shadows-horizontal\">\n" +
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
    "<a ng-href=\"project/{{project.metadata.name}}/create-config-map\" class=\"btn btn-default\" translate>Create Config Map</a>\n" +
    "</div>\n" +
    "<h1>\n" +
    "<translate>Config Maps</translate>\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
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
    "<div class=\"middle-content\">\n" +
    "<div class=\"container-fluid\">\n" +
    "<alerts alerts=\"alerts\"></alerts>\n" +
    "<div class=\"row\">\n" +
    "<div class=\"col-md-12\">\n" +
    "<div ng-if=\"!loaded\" translate>Loading...</div>\n" +
    "<div ng-if=\"loaded\">\n" +
    "<table class=\"table table-bordered table-hover table-mobile table-layout-fixed\">\n" +
    "<colgroup>\n" +
    "<col class=\"col-sm-5\">\n" +
    "</colgroup>\n" +
    "<thead>\n" +
    "<tr>\n" +
    "<th translate>Name</th>\n" +
    "<th translate>Created</th>\n" +
    "<th translate>Labels</th>\n" +
    "</tr>\n" +
    "</thead>\n" +
    "<tbody ng-if=\"(configMaps | hashSize) == 0\">\n" +
    "<tr><td colspan=\"3\"><em translate>No config maps to show</em></td></tr>\n" +
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
    "<button ng-if=\"'deploymentconfigs/instantiate' | canI : 'create'\" class=\"btn btn-default hidden-xs\" ng-click=\"startLatestDeployment()\" ng-disabled=\"!canDeploy()\" translate>\n" +
    "Deploy\n" +
    "</button>\n" +
    "\n" +
    "<button type=\"button\" class=\"dropdown-toggle btn btn-default actions-dropdown-btn hidden-xs\" data-toggle=\"dropdown\">\n" +
    "<translate>Actions</translate>\n" +
    "<span class=\"caret\" aria-hidden=\"true\"></span>\n" +
    "</button>\n" +
    "<a href=\"\" class=\"dropdown-toggle actions-dropdown-kebab visible-xs-inline\" data-toggle=\"dropdown\"><i class=\"fa fa-ellipsis-v\"></i><span class=\"sr-only\" translate>Actions</span></a>\n" +
    "<ul class=\"dropdown-menu dropdown-menu-right actions action-button\">\n" +
    "<li class=\"visible-xs-inline\" ng-class=\"{ disabled: !canDeploy() }\" ng-if=\"'deploymentconfigs/instantiate' | canI : 'create'\">\n" +
    "<a href=\"\" role=\"button\" ng-attr-aria-disabled=\"{{canDeploy() ? undefined : 'true'}}\" ng-class=\"{ 'disabled-link': !canDeploy() }\" ng-click=\"startLatestDeployment()\" translate>Deploy</a>\n" +
    "</li>\n" +
    "<li ng-if=\"'deploymentconfigs' | canI : 'update'\">\n" +
    "<a ng-href=\"{{deploymentConfig | editResourceURL}}\" role=\"button\" translate>Edit</a>\n" +
    "</li>\n" +
    "<li class=\"divider\" ng-if=\"'deploymentconfigs' | canI : 'update'\"></li>\n" +
    "<li ng-if=\"!deploymentConfig.spec.paused && !updatingPausedState && ('deploymentconfigs' | canI : 'update')\">\n" +
    "<a href=\"\" ng-click=\"setPaused(true)\" role=\"button\" translate>Pause Rollouts</a>\n" +
    "</li>\n" +
    "<li ng-if=\"deploymentConfig.spec.paused && !updatingPausedState && ('deploymentconfigs' | canI : 'update')\">\n" +
    "<a href=\"\" ng-click=\"setPaused(false)\" role=\"button\" translate>Resume Rollouts</a>\n" +
    "</li>\n" +
    "<li ng-if=\"'deploymentconfigs' | canI : 'update'\">\n" +
    "<a ng-href=\"project/{{project.metadata.name}}/attach-pvc?kind=DeploymentConfig&name={{deploymentConfig.metadata.name}}\" role=\"button\" translate>Add Storage</a>\n" +
    "</li>\n" +
    "<li ng-if=\"!autoscalers.length && ({resource: 'horizontalpodautoscalers', group: 'autoscaling'} | canI : 'create')\">\n" +
    "\n" +
    "<a ng-href=\"project/{{projectName}}/edit/autoscaler?kind=DeploymentConfig&name={{deploymentConfig.metadata.name}}\" role=\"button\" translate>Add Autoscaler</a>\n" +
    "</li>\n" +
    "<li ng-if=\"autoscalers.length === 1 && ({resource: 'horizontalpodautoscalers', group: 'autoscaling'} | canI : 'update')\">\n" +
    "\n" +
    "<a ng-href=\"project/{{projectName}}/edit/autoscaler?kind=HorizontalPodAutoscaler&group=autoscaling&name={{autoscalers[0].metadata.name}}\" role=\"button\" translate>Edit Autoscaler</a>\n" +
    "</li>\n" +
    "<li ng-if=\"'deploymentconfigs' | canI : 'update'\">\n" +
    "<a ng-href=\"project/{{projectName}}/set-limits?kind=DeploymentConfig&name={{deploymentConfig.metadata.name}}\" role=\"button\" translate>Edit Resource Limits</a>\n" +
    "</li>\n" +
    "<li ng-if=\"'deploymentconfigs' | canI : 'update'\">\n" +
    "<a ng-href=\"{{healthCheckURL}}\" role=\"button\" translate>Edit Health Checks</a>\n" +
    "</li>\n" +
    "<li ng-if=\"'deploymentconfigs' | canI : 'update'\">\n" +
    "<a ng-href=\"{{deploymentConfig | editYamlURL}}\" role=\"button\" translate>Edit YAML</a>\n" +
    "</li>\n" +
    "<li class=\"divider\" ng-if=\"'deploymentconfigs' | canI : 'update'\"></li>\n" +
    "<li ng-if=\"'deploymentconfigs' | canI : 'delete'\">\n" +
    "<delete-link kind=\"DeploymentConfig\" resource-name=\"{{deploymentConfig.metadata.name}}\" project-name=\"{{deploymentConfig.metadata.namespace}}\" alerts=\"alerts\" hpa-list=\"autoscalers\" translate>Delete\n" +
    "</delete-link>\n" +
    "</li>\n" +
    "</ul>\n" +
    "</div>\n" +
    "{{deploymentConfigName}}\n" +
    "\n" +
    "<small class=\"meta\" ng-if=\"deploymentConfig\"><translate>created</translate> <span am-time-ago=\"deploymentConfig.metadata.creationTimestamp\"></span></small>\n" +
    "</h1>\n" +
    "<labels labels=\"deploymentConfig.metadata.labels\" clickable=\"true\" kind=\"deployments\" title-kind=\"deployment configs\" project-name=\"{{deploymentConfig.metadata.namespace}}\" limit=\"3\"></labels>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"middle-content\" persist-tab-state>\n" +
    "<div class=\"container-fluid\">\n" +
    "<div ng-if=\"!loaded\" translate>Loading...</div>\n" +
    "<div class=\"row\" ng-if=\"loaded\">\n" +
    "<div class=\"col-md-12\" ng-class=\"{ 'hide-tabs' : !deploymentConfig }\">\n" +
    "<div ng-if=\"deploymentConfig.spec.paused\" class=\"alert alert-info animate-if\">\n" +
    "<span class=\"pficon pficon-info\" aria-hidden=\"true\"></span>\n" +
    "<strong translate>{{deploymentConfig.metadata.name}} is paused.</strong>\n" +
    "<translate>This will stop any new rollouts or triggers from running until resumed.</translate>\n" +
    "<span ng-if=\"!updatingPausedState && ('deploymentconfigs' | canI : 'update')\" class=\"nowrap\">\n" +
    "<a href=\"\" ng-click=\"setPaused(false)\" role=\"button\" translate>Resume Rollouts</a>\n" +
    "</span>\n" +
    "</div>\n" +
    "<uib-tabset>\n" +
    "<uib-tab active=\"selectedTab.history\">\n" +
    "<uib-tab-heading translate>History</uib-tab-heading>\n" +
    "<div ng-if=\"mostRecent\" class=\"deployment-config-summary\">\n" +
    "\n" +
    "<div class=\"h3\">\n" +
    "<span class=\"latest-status\">\n" +
    "<status-icon status=\"mostRecent | deploymentStatus\"></status-icon>\n" +
    "<translate>Deployment</translate>\n" +
    "\n" +
    "<a ng-href=\"{{mostRecent | navigateResourceURL}}\"><span ng-if=\"mostRecent | annotation : 'deploymentVersion'\">#{{mostRecent | annotation : 'deploymentVersion'}}</span><span ng-if=\"!(mostRecent | annotation : 'deploymentVersion')\">{{mostRecent.metadata.name}}</span></a>\n" +
    "<span ng-if=\"(mostRecent | deploymentStatus) !== 'Failed'\" translate>is</span>\n" +
    "{{mostRecent | deploymentStatus | lowercase}}.\n" +
    "<a ng-href=\"{{mostRecent | navigateResourceURL}}?tab=logs\" translate>View Log</a>\n" +
    "</span>\n" +
    "\n" +
    "</div>\n" +
    "<div class=\"last-timestamp meta text-muted\">\n" +
    "<translate>created</translate> <span am-time-ago=\"mostRecent.metadata.creationTimestamp\"></span>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"table-filter-wrapper\">\n" +
    "<project-filter></project-filter>\n" +
    "</div>\n" +
    "<table class=\"table table-bordered table-hover table-mobile\">\n" +
    "<thead>\n" +
    "<tr>\n" +
    "<th translate>Deployment</th>\n" +
    "<th translate>Status</th>\n" +
    "<th translate>Created</th>\n" +
    "<th translate>Trigger</th>\n" +
    "</tr>\n" +
    "</thead>\n" +
    "<tbody ng-if=\"(deployments | hashSize) == 0\">\n" +
    "<tr><td colspan=\"4\"><em>{{emptyMessage|translate}}</em></td></tr>\n" +
    "</tbody>\n" +
    "<tbody ng-if=\"(deployments | hashSize) > 0\">\n" +
    "<tr ng-repeat=\"deployment in orderedDeployments\">\n" +
    "<td data-title=\"Deployment\">\n" +
    "\n" +
    "<span ng-if=\"deployment | annotation : 'deploymentVersion'\">\n" +
    "<a ng-href=\"{{deployment | navigateResourceURL}}\">#{{deployment | annotation : 'deploymentVersion'}}</a>\n" +
    "<span ng-if=\"deploymentConfig.status.latestVersion == (deployment | annotation : 'deploymentVersion')\" translate>(latest)</span>\n" +
    "</span>\n" +
    "</td>\n" +
    "<td data-title=\"Status\">\n" +
    "<div row class=\"status\">\n" +
    "<status-icon status=\"deployment | deploymentStatus\" disable-animation></status-icon>\n" +
    "<span flex>\n" +
    "{{deployment | deploymentStatus}}<span ng-if=\"(deployment | deploymentStatus) == 'Active' || (deployment | deploymentStatus) == 'Running'\">,\n" +
    "<span ng-if=\"deployment.spec.replicas !== deployment.status.replicas\">{{deployment.status.replicas}}/</span><translate>{{deployment.spec.replicas}} replica<span ng-if=\"deployment.spec.replicas != 1\">s</span></translate></span>\n" +
    "</span>\n" +
    "\n" +
    "</div>\n" +
    "</td>\n" +
    "<td data-title=\"Created\">\n" +
    "<span am-time-ago=\"deployment.metadata.creationTimestamp\"></span>\n" +
    "</td>\n" +
    "<td data-title=\"Trigger\">\n" +
    "<span ng-if=\"!deployment.causes.length\" translate>Unknown</span>\n" +
    "<span ng-if=\"deployment.causes.length\">\n" +
    "<span ng-repeat=\"cause in deployment.causes\">\n" +
    "<span ng-switch=\"cause.type\">\n" +
    "<span ng-switch-when=\"ImageChange\">\n" +
    "<span ng-if=\"cause.imageTrigger.from\">\n" +
    "<abbr title=\"{{cause.imageTrigger.from | imageObjectRef : null : true}}\" translate>Image</abbr> <translate>change</translate>\n" +
    "</span>\n" +
    "</span>\n" +
    "<span ng-switch-when=\"ConfigChange\" translate>Config change</span>\n" +
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
    "<uib-tab-heading translate>Configuration</uib-tab-heading>\n" +
    "<div class=\"resource-details\" ng-if=\"deploymentConfig\">\n" +
    "<div class=\"row\">\n" +
    "<div class=\"col-lg-6\">\n" +
    "\n" +
    "<h3 class=\"hidden visible-lg visible-xl\" translate>Details</h3>\n" +
    "<dl class=\"dl-horizontal left\">\n" +
    "<dt translate>Selectors:</dt>\n" +
    "<dd>\n" +
    "<selector selector=\"deploymentConfig.spec.selector\"></selector>\n" +
    "</dd>\n" +
    "<dt translate>Replicas:</dt>\n" +
    "<dd>\n" +
    "<replicas spec=\"deploymentConfig.spec.replicas\" disable-scaling=\"autoscalers.length || deploymentInProgress\" scale-fn=\"scale(replicas)\" deployment=\"deploymentConfig\"></replicas>\n" +
    "<span ng-if=\"autoscalers.length\" translate>(autoscaled)</span>\n" +
    "</dd>\n" +
    "<dt ng-if-start=\"deploymentConfig.spec.strategy.type\" translate>Strategy:</dt>\n" +
    "<dd ng-if-end>{{deploymentConfig.spec.strategy.type}}</dd>\n" +
    "<div ng-if=\"deploymentConfig.spec.strategy.rollingParams || deploymentConfig.spec.strategy.recreateParams\">\n" +
    "<dt translate>Timeout:</dt>\n" +
    "<dd translate>{{strategyParams.timeoutSeconds}} sec</dd>\n" +
    "<dt ng-if-start=\"deploymentConfig.spec.strategy.rollingParams\" translate>Update Period:</dt>\n" +
    "<dd translate>{{strategyParams.updatePeriodSeconds}} sec</dd>\n" +
    "<dt translate>Interval:</dt>\n" +
    "<dd translate>{{strategyParams.intervalSeconds}} sec</dd>\n" +
    "<dt translate>Max Unavailable:</dt>\n" +
    "<dd>{{strategyParams.maxUnavailable}}</dd>\n" +
    "<dt translate>Max Surge:</dt>\n" +
    "<dd ng-if-end>{{strategyParams.maxSurge}}</dd>\n" +
    "</div>\n" +
    "\n" +
    "</dl>\n" +
    "<h3 translate>Template</h3>\n" +
    "<pod-template pod-template=\"deploymentConfig.spec.template\" images-by-docker-reference=\"imagesByDockerReference\" builds=\"builds\" detailed=\"true\" add-health-check-url=\"{{('deploymentconfigs' | canI : 'update') ? healthCheckURL : ''}}\">\n" +
    "</pod-template>\n" +
    "<h3 translate>Volumes</h3>\n" +
    "<p ng-if=\"!deploymentConfig.spec.template.spec.volumes.length && !('deploymentconfigs' | canI : 'update')\" translate>\n" +
    "none\n" +
    "</p>\n" +
    "<volumes volumes=\"deploymentConfig.spec.template.spec.volumes\" namespace=\"project.metadata.name\" can-remove=\"'deploymentconfigs' | canI : 'update'\" remove-fn=\"removeVolume(volume)\">\n" +
    "</volumes>\n" +
    "<p ng-if=\"'deploymentconfigs' | canI : 'update'\">\n" +
    "<a ng-href=\"project/{{project.metadata.name}}/attach-pvc?kind=DeploymentConfig&name={{deploymentConfig.metadata.name}}\" translate>Add Storage</a>\n" +
    "<span class=\"action-divider\" aria-hidden=\"true\">|</span>\n" +
    "<a ng-href=\"project/{{project.metadata.name}}/add-config-volume?kind=DeploymentConfig&name={{deploymentConfig.metadata.name}}\" translate>Add Config Files</a>\n" +
    "</p>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"col-lg-6\">\n" +
    "<h3 translate>Autoscaling</h3>\n" +
    "\n" +
    "<div ng-repeat=\"warning in hpaWarnings\" class=\"alert alert-warning\">\n" +
    "<span class=\"pficon pficon-warning-triangle-o\" aria-hidden=\"true\"></span>\n" +
    "<span class=\"sr-only\" translate>Warning:</span>\n" +
    "{{warning.message}}\n" +
    "\n" +
    "<a ng-href=\"project/{{projectName}}/set-limits?kind=DeploymentConfig&name={{deploymentConfig.metadata.name}}\" ng-if=\"warning.reason === 'NoCPURequest' && ('deploymentconfigs' | canI : 'update')\" role=\"button\" translate>Edit Resource <span ng-if=\"!('cpu' | isRequestCalculated : project)\">Requests and</span> Limits</a>\n" +
    "</div>\n" +
    "\n" +
    "<div ng-if=\"!autoscalers.length\">\n" +
    "<a ng-if=\"{resource: 'horizontalpodautoscalers', group: 'autoscaling'} | canI : 'create'\" ng-href=\"project/{{projectName}}/edit/autoscaler?kind=DeploymentConfig&name={{deploymentConfig.metadata.name}}\" role=\"button\" translate>Add Autoscaler</a>\n" +
    "<span ng-if=\"!({resource: 'horizontalpodautoscalers', group: 'autoscaling'} | canI : 'create')\" translate>Autoscaling is not enabled. There are no autoscalers for this deployment config.</span>\n" +
    "</div>\n" +
    "\n" +
    "<div ng-repeat=\"hpa in autoscalers\">\n" +
    "<hpa hpa=\"hpa\" project=\"project\" show-scale-target=\"false\" alerts=\"alerts\"></hpa>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"col-lg-6\" ng-if=\"deploymentConfig.spec.strategy.type !== 'Custom'\">\n" +
    "<h3>\n" +
    "<translate>Hooks</translate>\n" +
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
    "<div ng-if=\"!strategyParams.pre && !strategyParams.mid && !strategyParams.post\" translate>\n" +
    "none\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"col-lg-6\">\n" +
    "<h3 translate>Triggers</h3>\n" +
    "<dl class=\"dl-horizontal left\">\n" +
    "<dt><translate>Manual (CLI):</translate>\n" +
    "<a href=\"{{'deployment-operations' | helpLink}}\" target=\"_blank\">\n" +
    "<span class=\"learn-more-block\"><translate>Learn More</translate>&nbsp;<i class=\"fa fa-external-link\" aria-hidden=\"true\"></i></span>\n" +
    "</a>\n" +
    "</dt>\n" +
    "<dd>\n" +
    "<copy-to-clipboard clipboard-text=\"'oc rollout latest dc/' + deploymentConfig.metadata.name + ' -n ' + project.metadata.name\"></copy-to-clipboard>\n" +
    "</dd>\n" +
    "<div ng-repeat=\"trigger in deploymentConfig.spec.triggers\">\n" +
    "<span ng-switch=\"trigger.type\">\n" +
    "<span ng-switch-default>{{trigger.type}}</span>\n" +
    "<span ng-switch-when=\"ImageChange\" ng-if=\"trigger.imageChangeParams.from\">\n" +
    "<dt translate>New Image For:</dt>\n" +
    "<dd>\n" +
    "{{trigger.imageChangeParams.from | imageObjectRef : deploymentConfig.metadata.namespace}}\n" +
    "<small ng-if=\"!trigger.imageChangeParams.automatic\" class=\"text-muted\" translate>(disabled)</small>\n" +
    "</dd>\n" +
    "</span>\n" +
    "<span ng-switch-when=\"ConfigChange\">\n" +
    "<dt translate>Change Of:</dt>\n" +
    "<dd translate>Config</dd>\n" +
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
    "<uib-tab-heading translate>Environment</uib-tab-heading>\n" +
    "<ng-form name=\"forms.dcEnvVars\" class=\"mar-bottom-xl block\">\n" +
    "<confirm-on-exit ng-if=\"'deploymentconfigs' | canI : 'update'\" dirty=\"forms.dcEnvVars.$dirty\">\n" +
    "</confirm-on-exit>\n" +
    "<div ng-repeat=\"container in updatedDeploymentConfig.spec.template.spec.containers\">\n" +
    "<h3 translate>Container {{container.name}} Environment Variables</h3>\n" +
    "<key-value-editor ng-if=\"!('deploymentconfigs' | canI : 'update')\" entries=\"container.env\" key-placeholder=\"{{'Name'|translate}}\" value-placeholder=\"{{'Value'|translate}}\" cannot-add cannot-sort cannot-delete is-readonly show-header></key-value-editor>\n" +
    "<key-value-editor ng-if=\"'deploymentconfigs' | canI : 'update'\" entries=\"container.env\" key-placeholder=\"{{'Name'|translate}}\" value-placeholder=\"{{'Value'|translate}}\" value-from-selector-options=\"valueFromObjects\" key-validator=\"[A-Za-z_][A-Za-z0-9_]*\" key-validator-error=\"{{'Please enter a valid key'|translate}}\" key-validator-error-tooltip=\"{{'A valid environment variable name is an alphanumeric (a-z and 0-9) string beginning with a letter that may contain underscores.'|translate}}\" add-row-link=\"{{'Add Environment Variable'|translate}}\" add-row-with-selectors-link=\"{{'Add Environment Variable Using a Config Map or Secret'|translate}}\" show-header></key-value-editor>\n" +
    "</div>\n" +
    "<button class=\"btn btn-default\" ng-if=\"'deploymentconfigs' | canI : 'update'\" ng-click=\"saveEnvVars()\" ng-disabled=\"forms.dcEnvVars.$pristine || forms.dcEnvVars.$invalid\" translate>Save</button>\n" +
    "<a ng-if=\"!forms.dcEnvVars.$pristine\" href=\"\" ng-click=\"clearEnvVarUpdates()\" class=\"mar-left-sm\" style=\"vertical-align: -2px\" translate>Clear Changes</a>\n" +
    "</ng-form>\n" +
    "</uib-tab>\n" +
    "<uib-tab active=\"selectedTab.events\" ng-if=\"'events' | canI : 'watch'\">\n" +
    "<uib-tab-heading translate>Events</uib-tab-heading>\n" +
    "<events api-objects=\"[ deploymentConfig ]\" project-context=\"projectContext\" ng-if=\"selectedTab.events\"></events>\n" +
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
    "<translate>Actions</translate>\n" +
    "<span class=\"caret\" aria-hidden=\"true\"></span>\n" +
    "</button>\n" +
    "<a href=\"\" class=\"dropdown-toggle actions-dropdown-kebab visible-xs-inline\" data-toggle=\"dropdown\"><i class=\"fa fa-ellipsis-v\"></i><span class=\"sr-only\" translate>Actions</span></a>\n" +
    "<ul class=\"dropdown-menu dropdown-menu-right actions action-button\">\n" +
    "<li ng-if=\"!deployment.spec.paused && !updatingPausedState && ({ group: 'extensions', resource: 'deployments' } | canI : 'update')\">\n" +
    "<a href=\"\" ng-click=\"setPaused(true)\" role=\"button\" translate>Pause Rollouts</a>\n" +
    "</li>\n" +
    "<li ng-if=\"deployment.spec.paused && !updatingPausedState && ({ group: 'extensions', resource: 'deployments' } | canI : 'update')\">\n" +
    "<a href=\"\" ng-click=\"setPaused(false)\" role=\"button\" translate>Resume Rollouts</a>\n" +
    "</li>\n" +
    "<li class=\"divider\" ng-if=\"!updatingPausedState && ({ group: 'extensions', resource: 'deployments' } | canI : 'update')\"></li>\n" +
    "<li ng-if=\"{ group: 'extensions', resource: 'deployments' } | canI : 'update'\">\n" +
    "<a ng-href=\"project/{{project.metadata.name}}/attach-pvc?kind=Deployment&name={{deployment.metadata.name}}&group=extensions\" role=\"button\" translate>Add Storage</a>\n" +
    "</li>\n" +
    "<li ng-if=\"!autoscalers.length && ({resource: 'horizontalpodautoscalers', group: 'autoscaling'} | canI : 'create')\">\n" +
    "\n" +
    "<a ng-href=\"project/{{projectName}}/edit/autoscaler?kind=Deployment&name={{deployment.metadata.name}}&group=extensions\" role=\"button\" translate>Add Autoscaler</a>\n" +
    "</li>\n" +
    "<li ng-if=\"autoscalers.length === 1 && ({resource: 'horizontalpodautoscalers', group: 'autoscaling'} | canI : 'update')\">\n" +
    "\n" +
    "<a ng-href=\"project/{{projectName}}/edit/autoscaler?kind=HorizontalPodAutoscaler&group=autoscaling&name={{autoscalers[0].metadata.name}}\" role=\"button\" translate>Edit Autoscaler</a>\n" +
    "</li>\n" +
    "<li ng-if=\"{ group: 'extensions', resource: 'deployments' } | canI : 'update'\">\n" +
    "<a ng-href=\"project/{{projectName}}/set-limits?kind=Deployment&name={{deployment.metadata.name}}&group=extensions\" role=\"button\" translate>Edit Resource Limits</a>\n" +
    "</li>\n" +
    "<li ng-if=\"{ group: 'extensions', resource: 'deployments' } | canI : 'update'\">\n" +
    "<a ng-href=\"{{healthCheckURL}}\" role=\"button\" translate>Edit Health Checks</a>\n" +
    "</li>\n" +
    "\n" +
    "<li ng-if=\"{ group: 'apps', resource: 'deployments' } | canI : 'update'\">\n" +
    "<a ng-href=\"project/{{projectName}}/edit/yaml?kind=Deployment&group=apps&name={{deployment.metadata.name}}\" role=\"button\" translate>Edit YAML</a>\n" +
    "</li>\n" +
    "<li class=\"divider\" ng-if=\"{ group: 'extensions', resource: 'deployments' } | canI : 'update'\"></li>\n" +
    "<li ng-if=\"{ group: 'extensions', resource: 'deployments' } | canI : 'delete'\">\n" +
    "<delete-link kind=\"Deployment\" group=\"extensions\" resource-name=\"{{deployment.metadata.name}}\" project-name=\"{{deployment.metadata.namespace}}\" alerts=\"alerts\" hpa-list=\"autoscalers\" translate>Delete\n" +
    "</delete-link>\n" +
    "</li>\n" +
    "</ul>\n" +
    "</div>\n" +
    "{{name}}\n" +
    "<small class=\"meta\" ng-if=\"deployment\"><translate>created</translate> <span am-time-ago=\"deployment.metadata.creationTimestamp\"></span></small>\n" +
    "</h1>\n" +
    "<labels labels=\"deployment.metadata.labels\" clickable=\"true\" kind=\"deployments\" project-name=\"{{deployment.metadata.namespace}}\" limit=\"3\"></labels>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"middle-content\" persist-tab-state>\n" +
    "<div class=\"container-fluid\">\n" +
    "<div ng-if=\"!loaded\" translate>Loading...</div>\n" +
    "<div class=\"row\" ng-if=\"loaded\">\n" +
    "<div class=\"col-md-12\" ng-class=\"{ 'hide-tabs' : !deployment }\">\n" +
    "<div ng-if=\"deployment.spec.paused\" class=\"alert alert-info animate-if\">\n" +
    "<span class=\"pficon pficon-info\" aria-hidden=\"true\"></span>\n" +
    "<strong translate>{{deployment.metadata.name}} is paused.</strong>\n" +
    "<translate>This pauses any in-progress rollouts and stops new rollouts from running until the deployment is resumed.</translate>\n" +
    "<span ng-if=\"!updatingPausedState && ({ group: 'extensions', resource: 'deployments' } | canI : 'update')\" class=\"nowrap\">\n" +
    "<a href=\"\" ng-click=\"setPaused(false)\" role=\"button\" translate>Resume Rollouts</a>\n" +
    "</span>\n" +
    "</div>\n" +
    "<uib-tabset>\n" +
    "<uib-tab active=\"selectedTab.history\">\n" +
    "<uib-tab-heading translate>History</uib-tab-heading>\n" +
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
    "<th translate>Version</th>\n" +
    "<th translate>Name</th>\n" +
    "<th translate>Replicas</th>\n" +
    "<th translate>Created</th>\n" +
    "</tr>\n" +
    "</thead>\n" +
    "<tbody>\n" +
    "<tr ng-repeat=\"replicaSet in replicaSetsForDeployment\">\n" +
    "<td data-title=\"{{'Version'|translate}}\">\n" +
    "#{{replicaSet | annotation : 'deployment.kubernetes.io/revision'}}\n" +
    "</td>\n" +
    "<td data-title=\"{{'Name'|translate}}\">\n" +
    "<a ng-href=\"{{replicaSet | navigateResourceURL}}\">{{replicaSet.metadata.name}}</a>\n" +
    "</td>\n" +
    "<td data-title=\"{{'Replicas'|translate}}\">\n" +
    "<span ng-if=\"replicaSet.status.replicas !== replicaSet.spec.replicas\">{{replicaSet.status.replicas}}/</span><translate>{{replicaSet.spec.replicas}} replica<span ng-if=\"replicaSet.spec.replicas != 1\">s</span></translate>\n" +
    "</td>\n" +
    "<td data-title=\"{{'Created'|translate}}\">\n" +
    "<span am-time-ago=\"replicaSet.metadata.creationTimestamp\"></span>\n" +
    "</td>\n" +
    "</tr>\n" +
    "</tbody>\n" +
    "</table>\n" +
    "</div>\n" +
    "</uib-tab>\n" +
    "<uib-tab active=\"selectedTab.configuration\">\n" +
    "<uib-tab-heading translate>Configuration</uib-tab-heading>\n" +
    "<div class=\"resource-details\" ng-if=\"deployment\">\n" +
    "<div class=\"row\">\n" +
    "<div class=\"col-lg-6\">\n" +
    "\n" +
    "<h3 class=\"hidden visible-lg visible-xl\" translate>Details</h3>\n" +
    "<dl class=\"dl-horizontal left\">\n" +
    "<dt>Selectors:</dt>\n" +
    "<dd>\n" +
    "<selector selector=\"deployment.spec.selector\"></selector>\n" +
    "</dd>\n" +
    "<dt>Replicas:</dt>\n" +
    "<dd>\n" +
    "<replicas spec=\"deployment.spec.replicas\" disable-scaling=\"inProgressDeployment || autoscalers.length\" scale-fn=\"scale(replicas)\" deployment=\"deployment\"></replicas>\n" +
    "<span ng-if=\"autoscalers.length\" translate>(autoscaled)</span>\n" +
    "<div ng-if=\"deployment.status.updatedReplicas\" translate>\n" +
    "{{deployment.status.updatedReplicas}} up to date\n" +
    "</div>\n" +
    "<div ng-if=\"deployment.status.availableReplicas || deployment.status.unavailableReplicas\">\n" +
    "<span ng-if=\"deployment.status.availableReplicas\" translate>{{deployment.status.availableReplicas}} available<span ng-if=\"deployment.status.unavailableReplicas\">,</span></span>\n" +
    "<span ng-if=\"deployment.status.unavailableReplicas\" translate>{{deployment.status.unavailableReplicas}} unavailable</span>\n" +
    "</div>\n" +
    "</dd>\n" +
    "<dt>Strategy:</dt>\n" +
    "<dd>{{deployment.spec.strategy.type | sentenceCase}}</dd>\n" +
    "<dt ng-if-start=\"deployment.spec.strategy.rollingUpdate\">\n" +
    "<translate>Max Unavailable:</translate>\n" +
    "<span data-toggle=\"tooltip\" title=\"{{'The maximum number of pods that can be unavailable during the update process.'|translate}}\" class=\"pficon pficon-help text-muted small\"></span>\n" +
    "</dt>\n" +
    "<dd>\n" +
    "<span ng-if=\"deployment.spec.strategy.rollingUpdate.maxUnavailable | isNil\">1</span>\n" +
    "<span ng-if=\"!(deployment.spec.strategy.rollingUpdate.maxUnavailable | isNil)\">\n" +
    "{{deployment.spec.strategy.rollingUpdate.maxUnavailable}}\n" +
    "</span>\n" +
    "</dd>\n" +
    "<dt>\n" +
    "<translate>Max Surge:</translate>\n" +
    "<span data-toggle=\"tooltip\" title=\"{{'The maximum number of pods that can be created above the desired number of pods.'|translate\" class=\"pficon pficon-help text-muted small\"></span>\n" +
    "</dt>\n" +
    "<dd ng-if-end>\n" +
    "<span ng-if=\"deployment.spec.strategy.rollingUpdate.maxSurge | isNil\">1</span>\n" +
    "<span ng-if=\"!(deployment.spec.strategy.rollingUpdate.maxSurge | isNil)\">\n" +
    "{{deployment.spec.strategy.rollingUpdate.maxSurge}}\n" +
    "</span>\n" +
    "</dd>\n" +
    "<dt>\n" +
    "<translate>Min Ready:</translate>\n" +
    "<span data-toggle=\"tooltip\" title=\"{{'The minimum number of seconds a new pod must be ready before it is considered available.'|translate}}\" class=\"pficon pficon-help text-muted small\"></span>\n" +
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
    "<h3 translate>Volumes</h3>\n" +
    "<p ng-if=\"!deployment.spec.template.spec.volumes.length && !({ group: 'extensions', resource: 'deployments' } | canI : 'update')\" translate>\n" +
    "none\n" +
    "</p>\n" +
    "<volumes volumes=\"deployment.spec.template.spec.volumes\" namespace=\"project.metadata.name\" can-remove=\"{ group: 'extensions', resource: 'deployments' } | canI : 'update'\" remove-fn=\"removeVolume(volume)\">\n" +
    "</volumes>\n" +
    "<div ng-if=\"{ group: 'extensions', resource: 'deployments' } | canI : 'update'\">\n" +
    "<a ng-href=\"project/{{project.metadata.name}}/attach-pvc?kind=Deployment&name={{deployment.metadata.name}}&group=extensions\" translate>Add Storage</a>\n" +
    "<span class=\"action-divider\" aria-hidden=\"true\">|</span>\n" +
    "<a ng-href=\"project/{{project.metadata.name}}/add-config-volume?kind=Deployment&name={{deployment.metadata.name}}&group=extensions\" translate>Add Config Files</a>\n" +
    "</div>\n" +
    "<h3 translate>Autoscaling</h3>\n" +
    "\n" +
    "<div ng-repeat=\"warning in hpaWarnings\" class=\"alert alert-warning\">\n" +
    "<span class=\"pficon pficon-warning-triangle-o\" aria-hidden=\"true\"></span>\n" +
    "<span class=\"sr-only\" translate>Warning:</span>\n" +
    "{{warning.message}}\n" +
    "\n" +
    "<a ng-href=\"project/{{projectName}}/set-limits?kind=Deployment&name={{deployment.metadata.name}}&group=extensions\" ng-if=\"warning.reason === 'NoCPURequest' && ({ group: 'extensions', resource: 'deployments' } | canI : 'update')\" role=\"button\" translate>Edit Resource <span ng-if=\"!('cpu' | isRequestCalculated : project)\">Requests and</span> Limits</a>\n" +
    "</div>\n" +
    "\n" +
    "<div ng-if=\"!autoscalers.length\">\n" +
    "<a ng-if=\"{resource: 'horizontalpodautoscalers', group: 'autoscaling'} | canI : 'create'\" ng-href=\"project/{{projectName}}/edit/autoscaler?kind=Deployment&name={{deployment.metadata.name}}&group=extensions\" role=\"button\" translate>Add Autoscaler</a>\n" +
    "<span ng-if=\"!({resource: 'horizontalpodautoscalers', group: 'autoscaling'} | canI : 'create')\">none</span>\n" +
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
    "<uib-tab-heading translate>Environment</uib-tab-heading>\n" +
    "<ng-form name=\"forms.deploymentEnvVars\">\n" +
    "<confirm-on-exit ng-if=\"{ group: 'extensions', resource: 'deployments' } | canI : 'update'\" dirty=\"forms.deploymentEnvVars.$dirty\">\n" +
    "</confirm-on-exit>\n" +
    "<div ng-repeat=\"container in updatedDeployment.spec.template.spec.containers\">\n" +
    "<h3 translate>Container {{container.name}} Environment Variables</h3>\n" +
    "<key-value-editor ng-if=\"!({ group: 'extensions', resource: 'deployments' } | canI : 'update')\" entries=\"container.env\" key-placeholder=\"{{'Name'|translate}}\" value-placeholder=\"{{'Value'|translate}}\" cannot-add cannot-sort cannot-delete is-readonly show-header></key-value-editor>\n" +
    "<key-value-editor ng-if=\"{ group: 'extensions', resource: 'deployments' } | canI : 'update'\" entries=\"container.env\" key-placeholder=\"{{'Name'|translate}}\" value-placeholder=\"{{'Value'|translate}}\" value-from-selector-options=\"valueFromObjects\" key-validator=\"[A-Za-z_][A-Za-z0-9_]*\" key-validator-error=\"{{'Please enter a valid key'|translate}}\" key-validator-error-tooltip=\"{{'A valid environment variable name is an alphanumeric (a-z and 0-9) string beginning with a letter that may contain underscores.'|translate}}\" add-row-link=\"{{'Add Environment Variable'|translate}}\" add-row-with-selectors-link=\"{{'Add Environment Variable Using a Config Map or Secret'|translate}}\" show-header></key-value-editor>\n" +
    "</div>\n" +
    "<button class=\"btn btn-default\" ng-if=\"{ group: 'extensions', resource: 'deployments' } | canI : 'update'\" ng-click=\"saveEnvVars()\" ng-disabled=\"forms.deploymentEnvVars.$pristine || forms.deploymentEnvVars.$invalid\" translate>Save</button>\n" +
    "<a ng-if=\"!forms.deploymentEnvVars.$pristine\" href=\"\" ng-click=\"clearEnvVarUpdates()\" class=\"mar-left-sm\" style=\"vertical-align: -2px\" translate>Clear Changes</a>\n" +
    "</ng-form>\n" +
    "</uib-tab>\n" +
    "<uib-tab active=\"selectedTab.events\" ng-if=\"'events' | canI : 'watch'\">\n" +
    "<uib-tab-heading translate>Events</uib-tab-heading>\n" +
    "<events api-objects=\"[ deployment ]\" project-context=\"projectContext\" ng-if=\"selectedTab.events\"></events>\n" +
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
    "<div ng-if=\"!imageStream\" class=\"mar-top-xl\" translate>Loading...</div>\n" +
    "<div ng-if=\"imageStream\">\n" +
    "<h1>\n" +
    "{{imageStream.metadata.name}}:{{tagName}}\n" +
    "</h1>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"middle-content\" persist-tab-state>\n" +
    "<div class=\"container-fluid\">\n" +
    "<div ng-if=\"imageStream && !image\" translate>Loading...</div>\n" +
    "<div class=\"row\" ng-if=\"image\">\n" +
    "<div class=\"col-md-12\">\n" +
    "<registry-image-pull settings=\"settings\" names=\"[ imageStream.metadata.name + ':' + tagName ]\">\n" +
    "</registry-image-pull>\n" +
    "<uib-tabset>\n" +
    "<uib-tab heading=\"Details\" active=\"selectedTab.body\">\n" +
    "<uib-tab-heading translate>Details</uib-tab-heading>\n" +
    "<registry-image-body image=\"image\">\n" +
    "</registry-image-body>\n" +
    "<registry-image-meta image=\"image\">\n" +
    "</registry-image-meta>\n" +
    "</uib-tab>\n" +
    "<uib-tab heading=\"Config\" active=\"selectedTab.config\">\n" +
    "<uib-tab-heading translate>Configuration</uib-tab-heading>\n" +
    "<registry-image-config image=\"image\">\n" +
    "</registry-image-config>\n" +
    "</uib-tab>\n" +
    "<uib-tab heading=\"Layers\" active=\"selectedTab.meta\">\n" +
    "<uib-tab-heading translate>Layers</uib-tab-heading>\n" +
    "<p ng-if=\"!layers.length\"><em translate>No layer information is available for this image.</em></p>\n" +
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
    "<div ng-if=\"!imageStream\" class=\"mar-top-xl\" translate>Loading...</div>\n" +
    "<div ng-if=\"imageStream\">\n" +
    "<h1 class=\"contains-actions\">\n" +
    "<div class=\"pull-right dropdown\" ng-hide=\"!('imageStreams' | canIDoAny)\">\n" +
    "<button type=\"button\" class=\"dropdown-toggle btn btn-default actions-dropdown-btn hidden-xs\" data-toggle=\"dropdown\">\n" +
    "<translate>Actions</translate>\n" +
    "<span class=\"caret\" aria-hidden=\"true\"></span>\n" +
    "</button>\n" +
    "<a href=\"\" class=\"dropdown-toggle actions-dropdown-kebab visible-xs-inline\" data-toggle=\"dropdown\"><i class=\"fa fa-ellipsis-v\"></i><span class=\"sr-only\" translate>Actions</span></a>\n" +
    "<ul class=\"dropdown-menu dropdown-menu-right actions action-button\">\n" +
    "<li ng-if=\"'imagestreams' | canI : 'update'\">\n" +
    "<a ng-href=\"{{imageStream | editYamlURL}}\" role=\"button\" translate>Edit YAML</a>\n" +
    "</li>\n" +
    "<li ng-if=\"'imagestreams' | canI : 'delete'\">\n" +
    "<delete-link kind=\"ImageStream\" resource-name=\"{{imageStream.metadata.name}}\" project-name=\"{{imageStream.metadata.namespace}}\" alerts=\"alerts\" translate>Delete\n" +
    "</delete-link>\n" +
    "</li>\n" +
    "</ul>\n" +
    "</div>\n" +
    "{{imageStream.metadata.name}}\n" +
    "<small class=\"meta\"><translate>created</translate> <span am-time-ago=\"imageStream.metadata.creationTimestamp\"></span></small>\n" +
    "</h1>\n" +
    "<labels labels=\"imageStream.metadata.labels\" clickable=\"true\" kind=\"images\" project-name=\"{{imageStream.metadata.namespace}}\" limit=\"3\"></labels>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"middle-content\">\n" +
    "<div class=\"container-fluid\">\n" +
    "<div class=\"row\" ng-if=\"imageStream\">\n" +
    "<div class=\"col-md-12\">\n" +
    "<registry-imagestream-body imagestream=\"imageStream\">\n" +
    "</registry-imagestream-body>\n" +
    "<registry-imagestream-meta imagestream=\"imageStream\">\n" +
    "</registry-imagestream-meta>\n" +
    "<registry-imagestream-listing imagestream=\"imageStream\" imagestream-path=\"imagestreamPath\">\n" +
    "</registry-imagestream-listing>\n" +
    "<registry-imagestream-push settings=\"settings\" imagestream=\"imageStream\">\n" +
    "</registry-imagestream-push>\n" +
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
    "<div ng-if=\"!loaded\" translate>Loading...</div>\n" +
    "<div ng-if=\"pvc\">\n" +
    "<h1 class=\"contains-actions\">\n" +
    "<div class=\"pull-right dropdown\" ng-hide=\"!('persistentVolumeClaims' | canIDoAny)\">\n" +
    "<button type=\"button\" class=\"dropdown-toggle btn btn-default actions-dropdown-btn hidden-xs\" data-toggle=\"dropdown\">\n" +
    "<translate>Actions</translate>\n" +
    "<span class=\"caret\" aria-hidden=\"true\"></span>\n" +
    "</button>\n" +
    "<a href=\"\" class=\"dropdown-toggle actions-dropdown-kebab visible-xs-inline\" data-toggle=\"dropdown\"><i class=\"fa fa-ellipsis-v\"></i><span class=\"sr-only\" translate>Actions</span></a>\n" +
    "<ul class=\"dropdown-menu dropdown-menu-right actions action-button\">\n" +
    "<li ng-if=\"!pvc.spec.volumeName\">\n" +
    "<a ng-href=\"{{pvc | editYamlURL}}\" role=\"button\" translate>Edit YAML</a>\n" +
    "</li>\n" +
    "<li>\n" +
    "<delete-link ng-if=\"'persistentvolumeclaims' | canI : 'delete'\" kind=\"PersistentVolumeClaim\" resource-name=\"{{pvc.metadata.name}}\" project-name=\"{{pvc.metadata.namespace}}\" alerts=\"alerts\" translate>Delete\n" +
    "</delete-link>\n" +
    "</li>\n" +
    "</ul>\n" +
    "</div>\n" +
    "{{pvc.metadata.name}}\n" +
    "<small class=\"meta\" ng-if=\"!pvc.spec.volumeName\">\n" +
    "<span ng-if=\"pvc.spec.resources.requests['storage']\" translate>\n" +
    "waiting for {{pvc.spec.resources.requests['storage'] | usageWithUnits: 'storage'}} allocation,\n" +
    "</span>\n" +
    "<span ng-if=\"!pvc.spec.resources.requests['storage']\" translate>waiting for allocation,</span>\n" +
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
    "<uib-tabset>\n" +
    "<uib-tab heading=\"Details\" active=\"selectedTab.details\">\n" +
    "<uib-tab-heading translate>Details</uib-tab-heading>\n" +
    "<div class=\"resource-details\">\n" +
    "<dl class=\"dl-horizontal left\">\n" +
    "<dt translate>Status:</dt>\n" +
    "<dd>\n" +
    "<status-icon status=\"pvc.status.phase\" disable-animation></status-icon>\n" +
    "{{pvc.status.phase}}\n" +
    "<span ng-if=\"pvc.spec.volumeName\" translate>to volume <strong>{{pvc.spec.volumeName}}</strong></span>\n" +
    "</dd>\n" +
    "<dt ng-if=\"pvc.spec.volumeName\" translate>Capacity:</dt>\n" +
    "<dd ng-if=\"pvc.spec.volumeName\">\n" +
    "<span ng-if=\"pvc.status.capacity['storage']\" translate>\n" +
    "allocated {{pvc.status.capacity['storage'] | usageWithUnits: 'storage'}}\n" +
    "</span>\n" +
    "<span ng-if=\"!pvc.status.capacity['storage']\" translate>allocated unknown size</span>\n" +
    "</dd>\n" +
    "<dt translate>Requested Capacity:</dt>\n" +
    "<dd>\n" +
    "<span ng-if=\"pvc.spec.resources.requests['storage']\">\n" +
    "{{pvc.spec.resources.requests['storage'] | usageWithUnits: 'storage'}}\n" +
    "</span>\n" +
    "<span ng-if=\"!pvc.spec.resources.requests['storage']\"><em translate>none</em></span>\n" +
    "</dd>\n" +
    "<dt translate>Access Modes:</dt>\n" +
    "<dd>{{pvc.spec.accessModes | accessModes:'long' | join}}</dd>\n" +
    "</dl>\n" +
    "</div>\n" +
    "</uib-tab>\n" +
    "<uib-tab active=\"selectedTab.events\" ng-if=\"'events' | canI : 'watch'\">\n" +
    "<uib-tab-heading translate>Events</uib-tab-heading>\n" +
    "<events api-objects=\"[ pvc ] \" project-context=\"projectContext\" ng-if=\"selectedTab.events\"></events>\n" +
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
    "<div ng-if=\"!loaded\" class=\"mar-top-xl\" translate>Loading...</div>\n" +
    "<div ng-if=\"pod\">\n" +
    "<h1 class=\"contains-actions\">\n" +
    "<div class=\"pull-right dropdown\" ng-hide=\"!('pods' | canIDoAny)\">\n" +
    "<button type=\"button\" class=\"dropdown-toggle actions-dropdown-btn btn btn-default hidden-xs\" data-toggle=\"dropdown\">\n" +
    "<translate>Actions</translate>\n" +
    "<span class=\"caret\"></span>\n" +
    "</button>\n" +
    "<a href=\"\" class=\"dropdown-toggle actions-dropdown-kebab visible-xs-inline\" data-toggle=\"dropdown\"><i class=\"fa fa-ellipsis-v\"></i><span class=\"sr-only\" translate>Actions</span></a>\n" +
    "<ul class=\"dropdown-menu dropdown-menu-right actions action-button\">\n" +
    "<li ng-if=\"(pod | annotation:'deploymentConfig') && ('deploymentconfigs' | canI : 'update')\">\n" +
    "<a ng-href=\"project/{{project.metadata.name}}/attach-pvc?kind=DeploymentConfig&name={{pod | annotation:'deploymentConfig'}}\" role=\"button\" translate>Add Storage</a>\n" +
    "</li>\n" +
    "<li ng-if=\"'pods' | canI : 'update'\">\n" +
    "<a ng-href=\"{{pod | editYamlURL}}\" role=\"button\" translate>Edit YAML</a>\n" +
    "</li>\n" +
    "<li ng-if=\"'pods' | canI : 'delete'\">\n" +
    "<delete-link kind=\"Pod\" resource-name=\"{{pod.metadata.name}}\" project-name=\"{{pod.metadata.namespace}}\" alerts=\"alerts\" translate>Delete\n" +
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
    "<uib-tab-heading translate>Details</uib-tab-heading>\n" +
    "<ng-include src=\" 'views/browse/_pod-details.html' \"></ng-include>\n" +
    "</uib-tab>\n" +
    "<uib-tab heading=\"Environment\" active=\"selectedTab.environment\">\n" +
    "<uib-tab-heading translate>Environment</uib-tab-heading>\n" +
    "<div ng-repeat=\"container in containersEnv\">\n" +
    "<h3 translate>Container {{container.name}} Environment Variables</h3>\n" +
    "<key-value-editor entries=\"container.env\" is-readonly cannot-add cannot-sort cannot-delete ng-if=\"container.env.length\"></key-value-editor>\n" +
    "<em ng-if=\"!container.env.length\" translate>The container specification has no environment variables set.</em>\n" +
    "</div>\n" +
    "</uib-tab>\n" +
    "<uib-tab ng-if=\"metricsAvailable\" heading=\"Metrics\" active=\"selectedTab.metrics\">\n" +
    "\n" +
    "<pod-metrics ng-if=\"selectedTab.metrics\" pod=\"pod\" alerts=\"alerts\">\n" +
    "</pod-metrics>\n" +
    "</uib-tab>\n" +
    "<uib-tab active=\"selectedTab.logs\" ng-if=\"'pods/log' | canI : 'get'\">\n" +
    "<uib-tab-heading translate>Logs</uib-tab-heading>\n" +
    "<log-viewer ng-if=\"selectedTab.logs\" follow-affix-top=\"390\" object=\"pod\" context=\"projectContext\" options=\"logOptions\" empty=\"logEmpty\" run=\"logCanRun\" ng-class=\"{'log-viewer-select': pod.spec.containers.length > 1}\">\n" +
    "<span class=\"container-details\">\n" +
    "<label for=\"selectLogContainer\" translate>Container:</label>\n" +
    "<span ng-if=\"pod.spec.containers.length === 1\">\n" +
    "{{pod.spec.containers[0].name}}\n" +
    "</span>\n" +
    "<ui-select ng-show=\"pod.spec.containers.length > 1\" ng-model=\"logOptions.container\" input-id=\"selectLogContainer\">\n" +
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
    "<span class=\"log-timestamps\" translate>Log from {{containerStartTime | date : 'medium'}} <span ng-if=\"containerEndTime\">to {{containerEndTime | date : 'medium'}}</span></span>\n" +
    "</span>\n" +
    "</span>\n" +
    "</log-viewer>\n" +
    "</uib-tab>\n" +
    "<uib-tab active=\"selectedTab.terminal\" select=\"terminalTabWasSelected = true\" ng-init=\"containers = pod.status.containerStatuses\">\n" +
    "<uib-tab-heading translate>Terminal</uib-tab-heading>\n" +
    "<div ng-if=\"noContainersYet\" class=\"empty-state-message text-center\">\n" +
    "<h2 translate>\n" +
    "No running containers\n" +
    "</h2>\n" +
    "</div>\n" +
    "<div ng-if=\"!noContainersYet\" class=\"mar-top-xl mar-bottom-xl\">\n" +
    "<div class=\"mar-bottom-md\">\n" +
    "<span class=\"pficon pficon-info\" aria-hidden=\"true\"></span>\n" +
    "<span ng-class=\"{ 'mar-right-md': hasFullscreen }\">\n" +
    "<translate>When you navigate away from this pod, any open terminal connections will be closed.</translate>\n" +
    "<translate>This will kill any foreground processes you started from the&nbsp;terminal.</translate>\n" +
    "</span>\n" +
    "<a href=\"\" ng-if=\"hasFullscreen\" ng-click=\"fullscreenTerminal()\" class=\"nowrap\" aria-hidden=\"true\" translate>Open Fullscreen Terminal</a>\n" +
    "</div>\n" +
    "<alerts ng-if=\"selectedTerminalContainer.status === 'disconnected'\" alerts=\"terminalDisconnectAlert\"></alerts>\n" +
    "<div class=\"mar-left-xl\">\n" +
    "<div class=\"row\">\n" +
    "<div class=\"pad-left-none pad-bottom-md col-sm-6 col-lg-4\">\n" +
    "<span ng-if=\"pod.spec.containers.length === 1\">\n" +
    "<label for=\"selectLogContainer\" translate>Container:</label>\n" +
    "{{pod.spec.containers[0].name}}\n" +
    "</span>\n" +
    "<ui-select ng-model=\"selectedTerminalContainer\" on-select=\"onTerminalSelectChange(selectedTerminalContainer)\" ng-if=\"pod.spec.containers.length > 1\" class=\"mar-left-none pad-left-none pad-right-none\">\n" +
    "<ui-select-match class=\"truncate\" placeholder=\"{{'Container Name'|translate}}\">\n" +
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
    "</div>\n" +
    "<div id=\"container-terminal-wrapper\" class=\"container-terminal-wrapper\" ng-class=\"{ disconnected: selectedTerminalContainer.status === 'disconnected' }\">\n" +
    "<div ng-repeat=\"term in containerTerminals\">\n" +
    "<div ng-if=\"hasFullscreen\" class=\"fullscreen-toggle\" aria-hidden=\"true\">\n" +
    "<a ng-href=\"\" ng-click=\"fullscreenTerminal()\" class=\"go-fullscreen\" title=\"{{'Open Fullscreen Terminal'|translate}}\"><i class=\"fa fa-expand\"></i></a>\n" +
    "<a ng-href=\"\" ng-click=\"exitFullscreen()\" class=\"exit-fullscreen\" title=\"{{'Exit Fullscreen'|translate}}\"><i class=\"fa fa-compress\"></i></a>\n" +
    "</div>\n" +
    "<kubernetes-container-terminal prevent=\"!terminalTabWasSelected\" ng-if=\"term.isUsed\" ng-show=\"term.isVisible\" pod=\"pod\" container=\"term.containerName\" status=\"term.status\" rows=\"terminalRows\" cols=\"terminalCols\" autofocus=\"true\" command=\"[&quot;/bin/sh&quot;, &quot;-i&quot;, &quot;-c&quot;, &quot;TERM=xterm /bin/sh&quot;]\">\n" +
    "</kubernetes-container-terminal>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</uib-tab>\n" +
    "<uib-tab active=\"selectedTab.events\" ng-if=\"'events' | canI : 'watch'\">\n" +
    "<uib-tab-heading translate>Events</uib-tab-heading>\n" +
    "<events api-objects=\"[ pod ]\" project-context=\"projectContext\" ng-if=\"selectedTab.events\"></events>\n" +
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
    "<div ng-if=\"!loaded\" class=\"mar-top-md\" translate>Loading...</div>\n" +
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
    "<span ng-if=\"deploymentConfigMissing\" class=\"sr-only\" translate>Warning: The deployment's deployment config is missing.</span>\n" +
    "<small class=\"meta\"><translate>created</translate> <span am-time-ago=\"replicaSet.metadata.creationTimestamp\"></span></small>\n" +
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
    "<uib-tab-heading translate>Details</uib-tab-heading>\n" +
    "<div class=\"resource-details\">\n" +
    "<ng-include src=\" 'views/browse/_replica-set-details.html' \"></ng-include>\n" +
    "</div>\n" +
    "</uib-tab>\n" +
    "<uib-tab heading=\"Environment\" active=\"selectedTab.environment\">\n" +
    "<uib-tab-heading translate>Environment</uib-tab-heading>\n" +
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
    "<confirm-on-exit dirty=\"forms.envForm.$dirty\"></confirm-on-exit>\n" +
    "<div ng-repeat=\"container in updatedReplicaSet.spec.template.spec.containers\">\n" +
    "<div ng-if=\"resource | canI : 'update'\">\n" +
    "<key-value-editor entries=\"container.env\" key-placeholder=\"Name\" value-placeholder=\"Value\" value-from-selector-options=\"valueFromObjects\" key-validator=\"[A-Za-z_][A-Za-z0-9_]*\" key-validator-error=\"Please enter a valid key\" key-validator-error-tooltip=\"A valid environment variable name is an alphanumeric (a-z and 0-9) string beginning with a letter that may contain underscores.\" add-row-link=\"Add Environment Variable\" add-row-with-selectors-link=\"Add Environment Variable Using a Config Map or Secret\" show-header></key-value-editor>\n" +
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
    "<uib-tab-heading translate>Logs</uib-tab-heading>\n" +
    "<log-viewer ng-if=\"selectedTab.logs\" follow-affix-top=\"390\" object=\"replicaSet\" context=\"projectContext\" options=\"logOptions\" empty=\"logEmpty\" run=\"logCanRun\">\n" +
    "<span ng-if=\"replicaSet | deploymentStatus\">\n" +
    "<label translate>Status:</label>\n" +
    "<status-icon status=\"replicaSet | deploymentStatus\"></status-icon>\n" +
    "{{replicaSet | deploymentStatus}}\n" +
    "</span>\n" +
    "</log-viewer>\n" +
    "</uib-tab>\n" +
    "<uib-tab active=\"selectedTab.events\" ng-if=\"'events' | canI : 'watch'\">\n" +
    "<uib-tab-heading translate>Events</uib-tab-heading>\n" +
    "<events api-objects=\"[ replicaSet ]\" project-context=\"projectContext\" ng-if=\"selectedTab.events\"></events>\n" +
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
    "<div ng-if=\"!loaded\" class=\"mar-top-xl\" translate>Loading...</div>\n" +
    "<div ng-if=\"route\">\n" +
    "<h1 class=\"contains-actions\">\n" +
    "<div class=\"pull-right dropdown\" ng-hide=\"!('routes' | canIDoAny)\">\n" +
    "<button type=\"button\" class=\"dropdown-toggle btn btn-default actions-dropdown-btn hidden-xs\" data-toggle=\"dropdown\">\n" +
    "<translate>Actions</translate>\n" +
    "<span class=\"caret\" aria-hidden=\"true\"></span>\n" +
    "</button>\n" +
    "<a href=\"\" class=\"dropdown-toggle actions-dropdown-kebab visible-xs-inline\" data-toggle=\"dropdown\"><i class=\"fa fa-ellipsis-v\"></i><span class=\"sr-only\" translate>Actions</span></a>\n" +
    "<ul class=\"dropdown-menu dropdown-menu-right actions action-button\">\n" +
    "<li ng-if=\"'routes' | canI : 'update'\">\n" +
    "<a ng-href=\"{{route | editResourceURL}}\" role=\"button\" translate>Edit</a>\n" +
    "</li>\n" +
    "<li ng-if=\"'routes' | canI : 'update'\">\n" +
    "<a ng-href=\"{{route | editYamlURL}}\" role=\"button\" translate>Edit YAML</a>\n" +
    "</li>\n" +
    "<li ng-if=\"'routes' | canI : 'delete'\">\n" +
    "<delete-link kind=\"Route\" resource-name=\"{{route.metadata.name}}\" project-name=\"{{route.metadata.namespace}}\" alerts=\"alerts\" translate>Delete\n" +
    "</delete-link>\n" +
    "</li>\n" +
    "</ul>\n" +
    "</div>\n" +
    "{{route.metadata.name}}\n" +
    "<route-warnings ng-if=\"route.spec.to.kind !== 'Service' || services\" route=\"route\" services=\"services\">\n" +
    "</route-warnings>\n" +
    "<small class=\"meta\"><translate>created</translate> <span am-time-ago=\"route.metadata.creationTimestamp\"></span></small>\n" +
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
    "<translate>The route is not accepting traffic yet because it has not been admitted by a router.</translate>\n" +
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
    "<span ng-if=\"!admittedCondition\" translate>Admission status unknown for router '{{ingress.routerName}}'</span>\n" +
    "<span ng-if=\"admittedCondition.status === 'True'\">\n" +
    "<status-icon status=\"'Succeeded'\"></status-icon>\n" +
    "<translate>Exposed on router '{{ingress.routerName}}'</translate> <span am-time-ago=\"admittedCondition.lastTransitionTime\"></span>\n" +
    "</span>\n" +
    "<span ng-if=\"admittedCondition.status === 'False'\">\n" +
    "<status-icon status=\"'Error'\"></status-icon>\n" +
    "<translate>Rejected by router '{{ingress.routerName}}'</translate> <span am-time-ago=\"admittedCondition.lastTransitionTime\"></span>\n" +
    "</span>\n" +
    "</div>\n" +
    "<div ng-if=\"showRouterHostnameAlert(ingress, admittedCondition)\" class=\"mar-top-lg\">\n" +
    "<div class=\"alert alert-info\">\n" +
    "<span class=\"pficon pficon-info\" aria-hidden=\"true\"></span>\n" +
    "<span class=\"mar-right-sm\" translate>\n" +
    "The DNS admin should set up a CNAME from the route's hostname, {{ingress.host}}, to the router's canonical hostname, {{ingress.routerCanonicalHostname}}.\n" +
    "</span>\n" +
    "<a href=\"\" ng-click=\"hideRouterHostnameAlert(ingress)\" role=\"button\" class=\"nowrap\" translate>Don't Show Me Again</a>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<h4 class=\"mar-top-xl\" translate>Details</h4>\n" +
    "<dl class=\"dl-horizontal left\">\n" +
    "<dt ng-if-start=\"route.spec.wildcardPolicy && route.spec.wildcardPolicy !== 'None' && route.spec.wildcardPolicy !== 'Subdomain'\" translate>Wildcard Policy:</dt>\n" +
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
    "<dt translate>Target Port:</dt>\n" +
    "<dd>\n" +
    "<span ng-if=\"route.spec.port.targetPort\">\n" +
    "{{route.spec.port.targetPort}}\n" +
    "</span>\n" +
    "<span ng-if=\"!route.spec.port.targetPort\"><em>any</em></span>\n" +
    "</dd>\n" +
    "<div ng-if=\"route.spec.port.targetPort && route.spec.to.kind === 'Service' && (route | routeTargetPortMapping : services[route.spec.to.name])\" class=\"help-block\" translate>\n" +
    "This target port will route to {{route | routeTargetPortMapping : services[route.spec.to.name]}}.\n" +
    "</div>\n" +
    "</dl>\n" +
    "<div ng-if=\"route.spec.alternateBackends.length\" class=\"row\">\n" +
    "<div class=\"col-sm-12 mar-bottom-lg\">\n" +
    "<h4 translate>Traffic</h4>\n" +
    "<div class=\"help-block\" translate>\n" +
    "This route splits traffic across multiple services.\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"col-sm-12 col-md-5 col-md-push-7 mar-bottom-lg\">\n" +
    "<route-service-pie route=\"route\"></route-service-pie>\n" +
    "</div>\n" +
    "<div class=\"cold-sm-12 col-md-7 col-md-pull-5\">\n" +
    "<table class=\"table table-bordered\">\n" +
    "<thead>\n" +
    "<tr>\n" +
    "<th translate>Service</th>\n" +
    "<th translate>Weight</th>\n" +
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
    "<h4 translate>TLS Settings</h4>\n" +
    "<dl class=\"dl-horizontal left\" ng-if=\"route.spec.tls\">\n" +
    "<dt translate>Termination Type:</dt>\n" +
    "<dd>{{route.spec.tls.termination | humanizeTLSTermination}}</dd>\n" +
    "<dt translate>Insecure Traffic:</dt>\n" +
    "<dd>{{route.spec.tls.insecureEdgeTerminationPolicy || 'None'}}</dd>\n" +
    "<dt translate>Certificate:</dt>\n" +
    "<dd>\n" +
    "<span ng-show=\"route.spec.tls.certificate && !reveal.certificate\">\n" +
    "<a href=\"\" ng-click=\"reveal.certificate = true\" translate>Show</a>\n" +
    "</span>\n" +
    "<span ng-if=\"!route.spec.tls.certificate\"><em translate>none</em></span>\n" +
    "</dd>\n" +
    "<div ng-if=\"reveal.certificate\">\n" +
    "<pre class=\"clipped\">{{route.spec.tls.certificate}}</pre>\n" +
    "</div>\n" +
    "<dt translate>Key:</dt>\n" +
    "<dd>\n" +
    "<span ng-if=\"route.spec.tls.key && !reveal.key\">\n" +
    "<a href=\"\" ng-click=\"reveal.key = true\" translate>Show</a>\n" +
    "</span>\n" +
    "<span ng-if=\"!route.spec.tls.key\"><em translate>none</em></span>\n" +
    "</dd>\n" +
    "<div ng-if=\"reveal.key\">\n" +
    "<pre class=\"clipped\">{{route.spec.tls.key}}</pre>\n" +
    "</div>\n" +
    "<dt translate>CA Certificate:</dt>\n" +
    "<dd>\n" +
    "<span ng-show=\"route.spec.tls.caCertificate && !reveal.caCertificate\">\n" +
    "<a href=\"\" ng-click=\"reveal.caCertificate = true\" translate>Show</a>\n" +
    "</span>\n" +
    "<span ng-if=\"!route.spec.tls.caCertificate\"><em translate>none</em></span>\n" +
    "</dd>\n" +
    "<div ng-if=\"reveal.caCertificate\">\n" +
    "<pre class=\"clipped\">{{route.spec.tls.caCertificate}}</pre>\n" +
    "</div>\n" +
    "<dt translate>Destination CA Cert:</dt>\n" +
    "<dd>\n" +
    "<span ng-show=\"route.spec.tls.destinationCACertificate && !reveal.destinationCACertificate\">\n" +
    "<a href=\"\" ng-click=\"reveal.destinationCACertificate = true\" translate>Show</a>\n" +
    "</span>\n" +
    "<span ng-if=\"!route.spec.tls.destinationCACertificate\"><em translate>none</em></span>\n" +
    "</dd>\n" +
    "<div ng-if=\"reveal.destinationCACertificate\">\n" +
    "<pre class=\"clipped\">{{route.spec.tls.destinationCACertificate}}</pre>\n" +
    "</div>\n" +
    "</dl>\n" +
    "<p ng-if=\"!route.spec.tls\">\n" +
    "<translate>TLS is not enabled.</translate>\n" +
    "<span ng-if=\"'routes' | canI : 'update'\">\n" +
    "<translate><a ng-href=\"{{route | editResourceURL}}\" role=\"button\">Edit</a> this route to enable secure network traffic.</translate>\n" +
    "</span>\n" +
    "</p>\n" +
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
    "<a ng-href=\"project/{{project.metadata.name}}/create-route\" class=\"btn btn-default\" translate>Create Route</a>\n" +
    "</div>\n" +
    "<h1>\n" +
    "<translate>Routes</translate>\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
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
    "<th>{{customNameHeader || ('Name'|translate)}}</th>\n" +
    "<th translate>Hostname</th>\n" +
    "<th translate>Routes To</th>\n" +
    "<th translate>Target Port</th>\n" +
    "<th translate>TLS Termination</th>\n" +
    "</tr>\n" +
    "</thead>\n" +
    "<tbody ng-if=\"(routes | hashSize) == 0\">\n" +
    "<tr><td colspan=\"5\"><em>{{emptyMessage|translate}}</em></td></tr>\n" +
    "</tbody>\n" +
    "<tbody ng-if=\"(routes | hashSize) > 0\">\n" +
    "<tr ng-repeat=\"route in routes | orderObjectsByDate : true\">\n" +
    "<td data-title=\"{{ customNameHeader || ('Name'|translate) }}\">\n" +
    "<a href=\"{{route | navigateResourceURL}}\">{{route.metadata.name}}</a>\n" +
    "<route-warnings ng-if=\"route.spec.to.kind !== 'Service' || services\" route=\"route\" services=\"services\">\n" +
    "</route-warnings>\n" +
    "</td>\n" +
    "<td data-title=\"{{'Hostname'|translate}}\">\n" +
    "<span ng-if=\"(route | isWebRoute)\">\n" +
    "<a href=\"{{route | routeWebURL}}\" target=\"_blank\">{{route | routeLabel}}</a>\n" +
    "</span>\n" +
    "<span ng-if=\"!(route | isWebRoute)\">\n" +
    "{{route | routeLabel}}\n" +
    "</span>\n" +
    "<span ng-if=\"!route.status.ingress\" data-toggle=\"popover\" data-trigger=\"hover\" data-content=\"{{'The route is not accepting traffic yet because it has not been admitted by a router.'|translate}}\" style=\"cursor: help; padding-left: 5px\">\n" +
    "<status-icon status=\"'Pending'\"></status-icon>\n" +
    "<span class=\"sr-only\" translate>Pending</span>\n" +
    "</span>\n" +
    "</td>\n" +
    "<td data-title=\"{{'Routes To'|translate}}\">\n" +
    "<span ng-if=\"route.spec.to.kind !== 'Service'\">{{route.spec.to.kind}}: {{route.spec.to.name}}</span>\n" +
    "<span ng-if=\"route.spec.to.kind === 'Service'\"><a ng-href=\"{{route.spec.to.name | navigateResourceURL : 'Service': route.metadata.namespace}}\">{{route.spec.to.name}}</a></span>\n" +
    "</td>\n" +
    "\n" +
    "<td data-title=\"{{'Target Port'|translate}}\">\n" +
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
    "<td data-title=\"{{'Termination'|translate}}\">\n" +
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
    "<div ng-if=\"!loaded\" class=\"mar-top-xl\" translate>Loading...</div>\n" +
    "<div ng-if=\"loaded && error\" class=\"empty-state-message text-center\">\n" +
    "<h2 translate>The secret details could not be loaded.</h2>\n" +
    "<p>{{error | getErrorDetails}}</p>\n" +
    "</div>\n" +
    "<div ng-if=\"loaded && !error\">\n" +
    "<h1 class=\"contains-actions\">\n" +
    "<div class=\"pull-right dropdown\" ng-hide=\"!('secrets' | canIDoAny)\">\n" +
    "<button type=\"button\" class=\"dropdown-toggle btn btn-default actions-dropdown-btn hidden-xs\" data-toggle=\"dropdown\">\n" +
    "<translate>Actions</translate>\n" +
    "<span class=\"caret\"></span>\n" +
    "</button>\n" +
    "<a href=\"\" class=\"dropdown-toggle actions-dropdown-kebab visible-xs-inline\" data-toggle=\"dropdown\"><i class=\"fa fa-ellipsis-v\"></i><span class=\"sr-only\" translate>Actions</span></a>\n" +
    "<ul class=\"dropdown-menu dropdown-menu-right actions action-button\">\n" +
    "<li ng-if=\"'secrets' | canI : 'update'\">\n" +
    "<a ng-href=\"{{secret | editYamlURL}}\" role=\"button\" translate>Edit YAML</a>\n" +
    "</li>\n" +
    "<li ng-if=\"'secrets' | canI : 'delete'\">\n" +
    "<delete-link kind=\"Secret\" resource-name=\"{{secret.metadata.name}}\" project-name=\"{{secret.metadata.namespace}}\" alerts=\"alerts\" translate>Delete\n" +
    "</delete-link>\n" +
    "</li>\n" +
    "</ul>\n" +
    "</div>\n" +
    "{{secret.metadata.name}}\n" +
    "<small class=\"meta\"><translate>created</translate> <span am-time-ago=\"secret.metadata.creationTimestamp\"></span></small>\n" +
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
    "<small class=\"mar-left-sm\"><a href=\"\" ng-click=\"view.showSecret = !view.showSecret\" translate>{{view.showSecret ? \"Hide\" : \"Reveal\"}} Secret</a></small>\n" +
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
    "<div ng-if=\"decodedSecretData.$$nonprintable[secretDataName]\" class=\"help-block\" translate>\n" +
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
    "<div ng-if=\"!loaded\" class=\"mar-top-xl\" translate>Loading...</div>\n" +
    "<div ng-if=\"service\">\n" +
    "<h1 class=\"contains-actions\">\n" +
    "<div class=\"pull-right dropdown\" ng-hide=\"!('services' | canIDoAny)\">\n" +
    "<button type=\"button\" class=\"dropdown-toggle btn btn-default actions-dropdown-btn hidden-xs\" data-toggle=\"dropdown\">\n" +
    "<translate>Actions</translate>\n" +
    "<span class=\"caret\"></span>\n" +
    "</button>\n" +
    "<a href=\"\" class=\"dropdown-toggle actions-dropdown-kebab visible-xs-inline\" data-toggle=\"dropdown\"><i class=\"fa fa-ellipsis-v\"></i><span class=\"sr-only\" translate>Actions</span></a>\n" +
    "<ul class=\"dropdown-menu dropdown-menu-right actions action-button\">\n" +
    "<li ng-if=\"'routes' | canI : 'create'\">\n" +
    "<a ng-href=\"project/{{project.metadata.name}}/create-route?service={{service.metadata.name}}\" role=\"button\" translate>Create Route</a>\n" +
    "</li>\n" +
    "<li ng-if=\"'services' | canI : 'update'\">\n" +
    "<a ng-href=\"{{service | editYamlURL}}\" role=\"button\" translate>Edit YAML</a>\n" +
    "</li>\n" +
    "<li ng-if=\"'services' | canI : 'delete'\">\n" +
    "<delete-link kind=\"Service\" resource-name=\"{{service.metadata.name}}\" project-name=\"{{service.metadata.namespace}}\" alerts=\"alerts\" translate>Delete\n" +
    "</delete-link>\n" +
    "</li>\n" +
    "</ul>\n" +
    "</div>\n" +
    "{{service.metadata.name}}\n" +
    "<small class=\"meta\"><translate>created</translate> <span am-time-ago=\"service.metadata.creationTimestamp\"></span></small>\n" +
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
    "<uib-tab-heading translate>Details</uib-tab-heading>\n" +
    "<div class=\"resource-details\">\n" +
    "<dl class=\"dl-horizontal left\">\n" +
    "<dt translate>Selectors:</dt>\n" +
    "<dd>\n" +
    "<span ng-if=\"!service.spec.selector\"><em translate>none</em></span>\n" +
    "<span ng-repeat=\"(selectorLabel, selectorValue) in service.spec.selector\"> {{selectorLabel}}={{selectorValue}}<span ng-show=\"!$last\">, </span></span>\n" +
    "</dd>\n" +
    "<dt translate>Type:</dt>\n" +
    "<dd>{{service.spec.type}}</dd>\n" +
    "<dt translate>IP:</dt>\n" +
    "<dd>{{service.spec.clusterIP}}</dd>\n" +
    "<dt translate>Hostname:</dt>\n" +
    "<dd>\n" +
    "{{service.metadata.name}}.{{service.metadata.namespace}}.svc\n" +
    "<span data-toggle=\"popover\" data-trigger=\"hover\" data-content=\"{{'This address is only resolvable from within the cluster.'|translate}}\" style=\"cursor: help; padding-left: 5px\">\n" +
    "<span class=\"pficon pficon-info\" aria-hidden=\"true\" data-toggle=\"tooltip\" style=\"cursor: help\"></span>\n" +
    "</span>\n" +
    "</dd>\n" +
    "<dt ng-if-start=\"service.spec.externalName\" translate>External Hostname:</dt>\n" +
    "<dd ng-if-end>{{service.spec.externalName}}</dd>\n" +
    "<dt translate>Session affinity:</dt>\n" +
    "<dd>{{service.spec.sessionAffinity}}</dd>\n" +
    "<dt ng-if-start=\"service.status.loadBalancer.ingress.length\" translate>Ingress Points:</dt>\n" +
    "<dd ng-if-end>\n" +
    "<span ng-repeat=\"ingress in service.status.loadBalancer.ingress\">{{ingress.ip}}<span ng-if=\"!$last\">, </span></span>\n" +
    "</dd>\n" +
    "<dt ng-if-start=\"service.spec.externalIPs.length\" translate>External IPs:</dt>\n" +
    "<dd ng-if-end>\n" +
    "<span ng-repeat=\"externalIP in service.spec.externalIPs\">{{externalIP}}<span ng-if=\"!$last\">, </span></span>\n" +
    "</dd>\n" +
    "<dt ng-if-start=\"(routesForService | hashSize) == 0\" translate>Routes:</dt>\n" +
    "<dd ng-if-end>\n" +
    "<span>\n" +
    "<a ng-href=\"project/{{project.metadata.name}}/create-route?service={{service.metadata.name}}\" ng-if=\"'routes' | canI : 'create'\" translate>Create route</a>\n" +
    "<span ng-if=\"!('routes' | canI : 'create')\"><em translate>None</em></span>\n" +
    "</span>\n" +
    "</dd>\n" +
    "</dl>\n" +
    "<h3 translate>Traffic</h3>\n" +
    "<div>\n" +
    "<traffic-table ports-by-route=\"portsByRoute\" routes=\"routesForService\" services=\"services\" show-node-ports=\"showNodePorts\" custom-name-header=\"'Route'\"></traffic-table>\n" +
    "</div>\n" +
    "<p translate>\n" +
    "Learn more about <a ng-href=\"{{'route-types' | helpLink}}\" target=\"_blank\">routes</a> and <a ng-href=\"{{'services' | helpLink}}\" target=\"_blank\">services</a>.\n" +
    "</p>\n" +
    "<h3 translate>Pods</h3>\n" +
    "<div>\n" +
    "<pods-table pods=\"podsForService\" active-pods=\"podsWithEndpoints\" custom-name-header=\"'Pod'\" pod-failure-reasons=\"podFailureReasons\"></pods-table>\n" +
    "</div>\n" +
    "<annotations annotations=\"service.metadata.annotations\"></annotations>\n" +
    "</div>\n" +
    "</uib-tab>\n" +
    "<uib-tab active=\"selectedTab.events\" ng-if=\"'events' | canI : 'watch'\">\n" +
    "<uib-tab-heading translate>Events</uib-tab-heading>\n" +
    "<events api-objects=\"[ service ]\" project-context=\"projectContext\" ng-if=\"selectedTab.events\"></events>\n" +
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
    "<span class=\"label label-warning\" translate>Technology Preview</span>\n" +
    "</span>\n" +
    "</div>\n" +
    "<alerts alerts=\"alerts\"></alerts>\n" +
    "<div>\n" +
    "<h1>\n" +
    "{{statefulSet.metadata.name}}\n" +
    "<div class=\"pull-right dropdown\" ng-if=\"statefulSet\" ng-show=\"resourceGroupVersion.resource | canIDoAny\">\n" +
    "<button type=\"button\" class=\"dropdown-toggle btn btn-default actions-dropdown-btn hidden-xs\" data-toggle=\"dropdown\">\n" +
    "<translate>Actions</translate>\n" +
    "<span class=\"caret\" aria-hidden=\"true\"></span>\n" +
    "</button>\n" +
    "<a href=\"\" class=\"dropdown-toggle actions-dropdown-kebab visible-xs-inline\" data-toggle=\"dropdown\">\n" +
    "<i class=\"fa fa-ellipsis-v\"></i><span class=\"sr-only\" translate>Actions</span>\n" +
    "</a>\n" +
    "<ul class=\"dropdown-menu dropdown-menu-right actions action-button\">\n" +
    "<li ng-if=\"resourceGroupVersion | canI : 'update'\">\n" +
    "<a ng-href=\"{{statefulSet | editYamlURL}}\" role=\"button\" translate>Edit YAML</a>\n" +
    "</li>\n" +
    "<li ng-if=\"resourceGroupVersion | canI : 'delete'\">\n" +
    "<delete-link kind=\"StatefulSet\" group=\"apps\" resource-name=\"{{statefulSet.metadata.name}}\" project-name=\"{{statefulSet.metadata.namespace}}\" alerts=\"alerts\" translate>Delete\n" +
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
    "<div ng-if=\"!loaded\" translate>Loading...</div>\n" +
    "<div class=\"row\" ng-if=\"loaded && statefulSet\">\n" +
    "<div class=\"col-md-12\">\n" +
    "<uib-tabset>\n" +
    "<uib-tab active=\"selectedTab.details\">\n" +
    "<uib-tab-heading translate>Details</uib-tab-heading>\n" +
    "<div class=\"row\" style=\"max-width: 650px\">\n" +
    "<div class=\"col-sm-4 col-sm-push-8 browse-deployment-donut\">\n" +
    "\n" +
    "<deployment-donut rc=\"statefulSet\" pods=\"podsForStatefulSet\" scalable=\"isScalable()\" quotas=\"quotas\" cluster-quotas=\"clusterQuotas\">\n" +
    "</deployment-donut>\n" +
    "</div>\n" +
    "<div class=\"col-sm-8 col-sm-pull-4\">\n" +
    "<dl class=\"dl-horizontal left\">\n" +
    "<dt translate>Status:</dt>\n" +
    "<dd>\n" +
    "<status-icon status=\"statefulSet | deploymentStatus\"></status-icon>\n" +
    "{{statefulSet | deploymentStatus}}\n" +
    "</dd>\n" +
    "<dt translate>Replicas:</dt>\n" +
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
    "<h3 translate>Volumes</h3>\n" +
    "<p ng-if=\"!statefulSet.spec.template.spec.volumes.length\" translate>\n" +
    "none\n" +
    "</p>\n" +
    "<volumes volumes=\"statefulSet.spec.template.spec.volumes\" namespace=\"project.metadata.name\">\n" +
    "</volumes>\n" +
    "<h3 translate>Pods</h3>\n" +
    "<pods-table pods=\"podsForStatefulSet\"></pods-table>\n" +
    "<annotations annotations=\"statefulSet.metadata.annotations\"></annotations>\n" +
    "</div>\n" +
    "</div>\n" +
    "</uib-tab>\n" +
    "<uib-tab active=\"selectedTab.environment\" ng-if=\"statefulSet\">\n" +
    "<uib-tab-heading translate>Environment</uib-tab-heading>\n" +
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
    "<uib-tab-heading translate>Metrics</uib-tab-heading>\n" +
    "<div class=\"resource-metrics\">\n" +
    "<deployment-metrics ng-if=\"selectedTab.metrics && podsForStatefulSet\" pods=\"podsForStatefulSet\" containers=\"statefulSet.spec.template.spec.containers\" alerts=\"alerts\">\n" +
    "</deployment-metrics>\n" +
    "</div>\n" +
    "</uib-tab>\n" +
    "<uib-tab active=\"selectedTab.events\">\n" +
    "<uib-tab-heading translate>Events</uib-tab-heading>\n" +
    "<div class=\"resource-events\">\n" +
    "<events api-objects=\"[ statefulSet ]\" project-context=\"projectContext\" ng-if=\"selectedTab.events\"></events>\n" +
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
    "<span class=\"label label-warning\" translate>Technology Preview</span>\n" +
    "</span>\n" +
    "<h1>\n" +
    "<translate>Stateful Sets</translate>\n" +
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
    "<div ng-if=\"!loaded\" translate>Loading...</div>\n" +
    "<div class=\"row\" ng-if=\"loaded\">\n" +
    "<div class=\"col-md-12\">\n" +
    "<table class=\"table table-bordered table-hover table-mobile table-layout-fixed\">\n" +
    "<colgroup>\n" +
    "<col class=\"col-sm-5\">\n" +
    "</colgroup>\n" +
    "<thead>\n" +
    "<tr>\n" +
    "<th translate>Name</th>\n" +
    "<th translate>Replicas</th>\n" +
    "<th translate>Created</th>\n" +
    "</tr>\n" +
    "</thead>\n" +
    "<tbody ng-if=\"(statefulSets | hashSize) == 0\">\n" +
    "<tr>\n" +
    "<td colspan=\"3\"><em translate>No stateful sets to show</em></td>\n" +
    "</tr>\n" +
    "</tbody>\n" +
    "<tbody ng-repeat=\"(statefulSetName, statefulSet) in statefulSets\">\n" +
    "<tr>\n" +
    "<td data-title=\"Name\">\n" +
    "<a ng-href=\"{{statefulSet | navigateResourceURL}}\">{{statefulSet.metadata.name}}</a>\n" +
    "</td>\n" +
    "<td data-title=\"Replicas\">\n" +
    "<span ng-if=\"(podsByOwnerUID[statefulSet.metadata.uid] | hashSize) !== statefulSet.spec.replicas\">{{podsByOwnerUID[statefulSet.metadata.uid] | hashSize}}/</span><translate>{{statefulSet.spec.replicas}} replica<span ng-if=\"statefulSet.spec.replicas != 1\">s</span></translate>\n" +
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
    "<translate>Builds</translate>\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
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
    "<th translate>Name</th>\n" +
    "<th translate>Last Build</th>\n" +
    "<th translate>Status</th>\n" +
    "<th translate>Duration</th>\n" +
    "<th translate>Created</th>\n" +
    "<th translate>Type</th>\n" +
    "<th ng-class=\"{'hidden-sm' : (latestByConfig | hashSize)}\" translate>Source</th>\n" +
    "</tr>\n" +
    "</thead>\n" +
    "<tbody ng-if=\"!(latestByConfig | hashSize)\">\n" +
    "<tr><td colspan=\"7\"><em>{{emptyMessage|translate}}</em></td></tr>\n" +
    "</tbody>\n" +
    "<tbody ng-if=\"(latestByConfig | hashSize)\">\n" +
    "<tr ng-repeat=\"(buildConfigName, latestBuild) in latestByConfig\">\n" +
    "\n" +
    "<td ng-if-start=\"!latestBuild\" data-title=\"Name\">\n" +
    "<a href=\"{{buildConfigs[buildConfigName] | navigateResourceURL}}\">{{buildConfigName}}</a>\n" +
    "</td>\n" +
    "<td data-title=\"Last Build\"><em translate>No builds</em></td>\n" +
    "<td class=\"hidden-xs\">&nbsp;</td>\n" +
    "<td class=\"hidden-xs\">&nbsp;</td>\n" +
    "<td class=\"hidden-xs\">&nbsp;</td>\n" +
    "<td data-title=\"Type\">{{buildConfigs[buildConfigName].spec.strategy.type | startCase}}</td>\n" +
    "<td ng-if-end data-title=\"Source\" class=\"hidden-sm\">\n" +
    "<span ng-if=\"source = buildConfigs[buildConfigName].spec.source\">\n" +
    "<span ng-switch=\"source.type\">\n" +
    "<span ng-switch-when=\"None\">\n" +
    "<i translate>None</i>\n" +
    "</span>\n" +
    "<span ng-switch-when=\"Git\">\n" +
    "<osc-git-link uri=\"source.git.uri\" ref=\"source.git.ref\" context-dir=\"source.contextDir\">{{source.git.uri}}</osc-git-link>\n" +
    "</span>\n" +
    "<span ng-switch-default>\n" +
    "{{source.type}}\n" +
    "</span>\n" +
    "</span>\n" +
    "</span>\n" +
    "</td>\n" +
    "\n" +
    "\n" +
    "<td ng-if-start=\"latestBuild && (buildConfigs[buildConfigName] || !unfilteredBuildConfigs[buildConfigName])\" data-title=\"Name\">\n" +
    "<a ng-if=\"buildConfigName\" href=\"{{latestBuild | configURLForResource}}\">{{buildConfigName}}</a>\n" +
    "<span ng-if=\"buildConfigs && buildConfigName && !buildConfigs[buildConfigName]\" class=\"pficon pficon-warning-triangle-o\" data-toggle=\"tooltip\" title=\"{{'This build config no longer exists'|translate}}\" style=\"cursor: help\"></span>\n" +
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
    "<span ng-switch=\"latestBuild.spec.source.type\">\n" +
    "<span ng-switch-when=\"None\">\n" +
    "<i>none</i>\n" +
    "</span>\n" +
    "<span ng-switch-when=\"Git\">\n" +
    "<osc-git-link uri=\"latestBuild.spec.source.git.uri\" ref=\"latestBuild.spec.source.git.ref\" context-dir=\"latestBuild.spec.source.contextDir\">{{latestBuild.spec.source.git.uri}}</osc-git-link>\n" +
    "</span>\n" +
    "<span ng-switch-default>\n" +
    "{{latestBuild.spec.source.type}}\n" +
    "</span>\n" +
    "</span>\n" +
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
    "<p class=\"card-pf-badge\" translate>Builds source code</p>\n" +
    "<p>\n" +
    "<truncate-long-text class=\"project-description\" content=\"imageStream | imageStreamTagAnnotation : 'description' : is.tag.tag\" limit=\"200\" highlight-keywords=\"keywords\" use-word-boundary=\"true\"></truncate-long-text>\n" +
    "</p>\n" +
    "<p ng-if=\"imageStream | imageStreamTagAnnotation : 'provider' : is.tag.tag\">\n" +
    "<translate>Provider:</translate> {{imageStream | imageStreamTagAnnotation : 'provider' : is.tag.tag}}\n" +
    "</p>\n" +
    "\n" +
    "<p ng-if=\"imageStream.metadata.namespace !== 'openshift'\">\n" +
    "<translate>Namespace:</translate> {{imageStream.metadata.namespace}}\n" +
    "</p>\n" +
    "</div>\n" +
    "<p class=\"card-pf-version\">\n" +
    "<translate>Version</translate>\n" +
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
    "<a class=\"btn btn-default pull-right\" ng-href=\"{{imageStream | createFromImageURL : is.tag.tag : project}}\" translate>\n" +
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
    "<translate>Provider:</translate> {{template | annotation : 'provider'}}\n" +
    "</p>\n" +
    "\n" +
    "<p ng-if=\"template.metadata.namespace !== 'openshift'\">\n" +
    "<translate>Namespace:</translate> {{template.metadata.namespace}}\n" +
    "</p>\n" +
    "</div>\n" +
    "<div class=\"card-pf-footer clearfix\">\n" +
    "<a class=\"btn btn-default pull-right\" ng-href=\"{{template | createFromTemplateURL : project}}\" translate>\n" +
    "Select\n" +
    "</a>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/catalog/catalog.html',
    "<p ng-if=\"!loaded\" translate>Loading...</p>\n" +
    "<div ng-if=\"emptyCatalog && loaded\" class=\"empty-state-message empty-state-full-page\">\n" +
    "<h2 class=\"text-center\" translate>No images or templates.</h2>\n" +
    "<p class=\"gutter-top\" translate>\n" +
    "No images or templates are loaded for this project or the shared <code>DataMan OS</code> namespace. An image or template is required to add content.\n" +
    "</p>\n" +
    "<p>\n" +
    "<translate>To add an image stream or template from a file, use the editor in the <strong>Import YAML / JSON</strong> tab, or run the following command:</translate>\n" +
    "<div><code>oc create -f &lt;filename&gt; -n {{projectName}}</code></div>\n" +
    "</p>\n" +
    "<p><a href=\"{{projectName | projectOverviewURL}}\" translate>Back to overview</a></p>\n" +
    "</div>\n" +
    "<div ng-show=\"!emptyCatalog && loaded && !singleCategory\">\n" +
    "<p ng-if=\"!parentCategory\" translate>Choose from web frameworks, databases, and other components to add content to your project.</p>\n" +
    "<form role=\"form\" fit class=\"search-pf has-button\">\n" +
    "<div class=\"form-group has-clear\">\n" +
    "\n" +
    "<div class=\"search-pf-input-group\">\n" +
    "<label for=\"search\" class=\"sr-only\" translate>Filter by name or description</label>\n" +
    "<input ng-model=\"filter.keyword\" type=\"search\" id=\"search\" placeholder=\"{{'Filter by name or description'|translate}}\" class=\"search-input form-control\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\">\n" +
    "<button type=\"button\" class=\"clear\" aria-hidden=\"true\" ng-if=\"filter.keyword\" ng-click=\"filter.keyword = ''\">\n" +
    "<span class=\"pficon pficon-close\"></span>\n" +
    "</button>\n" +
    "</div>\n" +
    "</div>\n" +
    "</form>\n" +
    "<div ng-if=\"allContentHidden\" class=\"empty-state-message text-center h2\">\n" +
    "<translate>All content is hidden by the current filter.</translate>\n" +
    "<a href=\"\" ng-click=\"filter.keyword = ''\" translate>Clear Filter</a>\n" +
    "</div>\n" +
    "<div ng-if=\"!filterActive\">\n" +
    "<div ng-repeat=\"category in categories\" ng-if=\"hasContent[category.id]\">\n" +
    "<h2 class=\"h3\" ng-if=\"category.label\">{{category.label|translate}}</h2>\n" +
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
    "{{item.label|translate}}\n" +
    "</a>\n" +
    "\n" +
    "<a ng-if=\"parentCategory\" ng-href=\"project/{{projectName}}/create/category/{{parentCategory.id}}/{{item.id || 'none'}}\" class=\"tile-target\">\n" +
    "{{item.label|translate}}\n" +
    "</a>\n" +
    "</h3>\n" +
    "\n" +
    "</div>\n" +
    "<p ng-if=\"item.description\">{{item.description|translate}}</p>\n" +
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
    "<p ng-if=\"!loaded\" translate>Loading...</p>\n" +
    "<div ng-if=\"emptyCategory && loaded\" class=\"empty-state-message empty-state-full-page\">\n" +
    "<h2 class=\"text-center\" translate>No images or templates.</h2>\n" +
    "<p class=\"gutter-top\" translate>\n" +
    "No images or templates are loaded for the category {{category.label}}.\n" +
    "</p>\n" +
    "<p>\n" +
    "<translate>To add an image stream or template from a file, use the editor in the <strong>Import YAML / JSON</strong> tab, or run the following command:</translate>\n" +
    "<div><code>oc create -f &lt;filename&gt; -n {{projectName}}</code></div>\n" +
    "</p>\n" +
    "<p><a ng-href=\"project/{{projectName}}/create\" translate>Back to catalog</a></p>\n" +
    "</div>\n" +
    "<div ng-if=\"loaded && !emptyCategory && !catalog.subcategories\">\n" +
    "<form role=\"form\" fit class=\"search-pf has-button mar-bottom-xl\">\n" +
    "<div class=\"form-group has-clear\">\n" +
    "\n" +
    "<div class=\"search-pf-input-group\">\n" +
    "<label for=\"search\" class=\"sr-only\" translate>Filter by name or description</label>\n" +
    "<input ng-model=\"filter.keyword\" type=\"search\" id=\"search\" placeholder=\"{{'Filter by name or description'|translate}}\" class=\"search-input form-control\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\">\n" +
    "<button type=\"button\" class=\"clear\" aria-hidden=\"true\" ng-if=\"filter.keyword\" ng-click=\"filter.keyword = ''\">\n" +
    "<span class=\"pficon pficon-close\"></span>\n" +
    "</button>\n" +
    "</div>\n" +
    "</div>\n" +
    "</form>\n" +
    "<div ng-if=\"!filteredBuilderImages.length && !filteredTemplates.length && loaded\" class=\"empty-state-message text-center h2\">\n" +
    "<translate>All content is hidden by the current filter.</translate>\n" +
    "<a href=\"\" ng-click=\"filter.keyword = ''\" translate>Clear Filter</a>\n" +
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
    "<h1 id=\"cli\" translate>Command Line Tools</h1>\n" +
    "<p>\n" +
    "<translate>With the DataMan OS command line interface (CLI), you can create applications and manage DataMan OS projects from a terminal.</translate>\n" +
    "<span ng-if=\"cliDownloadURLPresent\" translate>\n" +
    "You can download the <code>oc</code> client tool using the links below. For more information about downloading and installing it, please refer to the <a target=\"_blank\" href=\"{{'get_started_cli' | helpLink}}\">Get Started with the CLI</a> documentation.\n" +
    "</span>\n" +
    "<span ng-if=\"!cliDownloadURLPresent\" translate>\n" +
    "Refer to the <a target=\"_blank\" href=\"{{'get_started_cli' | helpLink}}\">Get Started with the CLI</a> documentation for instructions about downloading and installing the <code>oc</code> client tool.\n" +
    "</span>\n" +
    "<div ng-if=\"cliDownloadURLPresent\">\n" +
    "<label class=\"cli-download-label\" translate>Download <code>oc</code>:</label>\n" +
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
    "After downloading and installing it, you can start by logging in. You are currently logged into this console as <strong>{{user.metadata.name}}</strong>. If you want to log into the CLI using the same session token:\n" +
    "<copy-to-clipboard display-wide=\"true\" clipboard-text=\"'oc login ' + loginBaseURL + ' --token=' + sessionToken\" input-text=\"'oc login ' + loginBaseURL + ' --token=<hidden>'\"></copy-to-clipboard>\n" +
    "<pre class=\"code prettyprint ng-binding\" ng-if=\"!sessionToken\">\n" +
    "                      oc login {{loginBaseURL}}\n" +
    "                    </pre>\n" +
    "</p>\n" +
    "<div class=\"alert alert-warning\">\n" +
    "<span class=\"pficon pficon-warning-triangle-o\" aria-hidden=\"true\"></span>\n" +
    "<strong translate>A token is a form of a password.</strong>\n" +
    "<translate>Do not share your API token. To reveal your token, press the copy to clipboard button and then paste the clipboard contents.</translate>\n" +
    "</div>\n" +
    "<p><translate>After you login to your account you will get a list of projects that you can switch between:</translate>\n" +
    "<copy-to-clipboard display-wide=\"true\" clipboard-text=\"'oc project <project-name>'\"></copy-to-clipboard>\n" +
    "</p>\n" +
    "<p><translate>If you do not have any existing projects, you can create one:</translate>\n" +
    "<copy-to-clipboard display-wide=\"true\" clipboard-text=\"'oc new-project <project-name>'\"></copy-to-clipboard>\n" +
    "</p>\n" +
    "<p><translate>To show a high level overview of the current project:</translate>\n" +
    "<copy-to-clipboard display-wide=\"true\" clipboard-text=\"'oc status'\"></copy-to-clipboard>\n" +
    "</p>\n" +
    "<p translate>For other information about the command line tools, check the <a target=\"_blank\" href=\"{{'cli' | helpLink}}\">CLI Reference</a> and <a target=\"_blank\" href=\"{{'basic_cli_operations' | helpLink}}\">Basic CLI Operations</a>.</p>\n" +
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
    "<div class=\"mar-top-xl\">\n" +
    "<h1>Create Config Map</h1>\n" +
    "<div class=\"help-block\" translate>\n" +
    "Config maps hold key-value pairs that can be used in pods to read application configuration.\n" +
    "</div>\n" +
    "<form name=\"createConfigMapForm\" class=\"mar-top-xl\">\n" +
    "<fieldset ng-disabled=\"disableInputs\">\n" +
    "<edit-config-map model=\"configMap\" show-name-input=\"true\"></edit-config-map>\n" +
    "<div class=\"button-group gutter-top gutter-bottom\">\n" +
    "<button type=\"submit\" class=\"btn btn-primary btn-lg\" ng-click=\"createConfigMap()\" ng-disabled=\"createConfigMapForm.$invalid || disableInputs\" value=\"\" translate>Create</button>\n" +
    "<a class=\"btn btn-default btn-lg\" href=\"\" ng-click=\"cancel()\" role=\"button\" translate>Cancel</a>\n" +
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
    "<div ng-if=\"!loaded\" translate>Loading...</div>\n" +
    "<div ng-if=\"loaded\">\n" +
    "<alerts alerts=\"alerts\" hide-close-button=\"true\"></alerts>\n" +
    "<osc-image-summary resource=\"resource\"></osc-image-summary>\n" +
    "<p ng-if=\"validationPassed && createDetails.sourceURI\" translate>Source code from <a href=\"{{createDetails.sourceURI}}\">{{createDetails.sourceURI}}</a> will be built and deployed unless otherwise specified in the next step.</p>\n" +
    "<div ng-if=\"validationPassed\">\n" +
    "<div ng-if=\"noProjects && canCreateProject\">\n" +
    "<h2 translate>Create a New Project</h2>\n" +
    "<create-project alerts=\"alerts\" redirect-action=\"createWithProject\"></create-project>\n" +
    "</div>\n" +
    "<div ng-if=\"!noProjects && !canCreateProject\">\n" +
    "<h2 translate>Choose a Project</h2>\n" +
    "<ui-select ng-model=\"selected.project\">\n" +
    "<ui-select-match placeholder=\"{{'Project name'|translate}}\">\n" +
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
    "<uib-tab-heading translate>Choose Existing Project</uib-tab-heading>\n" +
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
    "<a class=\"btn btn-default btn-lg\" href=\"#\" back translate>Cancel</a>\n" +
    "</div>\n" +
    "</uib-tab>\n" +
    "<uib-tab>\n" +
    "<uib-tab-heading translate>Create a New Project</uib-tab-heading>\n" +
    "<create-project alerts=\"alerts\" redirect-action=\"createWithProject\"></create-project>\n" +
    "</uib-tab>\n" +
    "</uib-tabset>\n" +
    "</div>\n" +
    "<p ng-if=\"!canCreateProject\" class=\"mar-top-md\">\n" +
    "<span ng-if=\"noProjects\" translate>A project is required in order to complete the installation.</span>\n" +
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
    "<div class=\"mar-top-xl\">\n" +
    "<h1 translate>Create Storage</h1>\n" +
    "<div class=\"help-block\">\n" +
    "<translate>Create a request for an administrator-defined storage asset by specifying size and permissions for a best fit.</translate>\n" +
    "<a href=\"{{'persistent_volumes' | helpLink}}\" target=\"_blank\"><span class=\"learn-more-inline\" translate>Learn More&nbsp;<i class=\"fa fa-external-link\" aria-hidden=\"true\"></i></span></a>\n" +
    "</div>\n" +
    "<form name=\"createPersistentVolumeClaimForm\" class=\"mar-top-lg\">\n" +
    "<fieldset ng-disabled=\"disableInputs\">\n" +
    "<osc-persistent-volume-claim model=\"claim\" project-name=\"projectName\"></osc-persistent-volume-claim>\n" +
    "<div class=\"button-group gutter-bottom\">\n" +
    "<button type=\"submit\" class=\"btn btn-primary btn-lg\" ng-click=\"createPersistentVolumeClaim()\" ng-disabled=\"createPersistentVolumeClaimForm.$invalid || disableInputs\" value=\"\">Create</button>\n" +
    "<a class=\"btn btn-default btn-lg\" href=\"\" ng-click=\"cancel()\" role=\"button\" translate>Cancel</a>\n" +
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
    "<h1 translate>Create Project</h1>\n" +
    "<create-project redirect-action=\"onProjectCreated\"></create-project>\n" +
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
    "<div class=\"mar-top-xl\">\n" +
    "<h1>Create Route</h1>\n" +
    "<div class=\"help-block\" translate>\n" +
    "Routing is a way to make your application publicly visible.\n" +
    "</div>\n" +
    "<form name=\"createRouteForm\" class=\"mar-top-xl osc-form\">\n" +
    "<div ng-if=\"!services\" translate>Loading...</div>\n" +
    "<div ng-if=\"services\">\n" +
    "<fieldset ng-disabled=\"disableInputs\">\n" +
    "<osc-routing model=\"routing\" services=\"services\" show-name-input=\"true\">\n" +
    "</osc-routing>\n" +
    "<label-editor labels=\"labels\" expand=\"true\" can-toggle=\"false\" help-text=\"{{'Labels for this route.'|translate}}\">\n" +
    "</label-editor>\n" +
    "<a href=\"\" ng-click=\"copyServiceLabels()\" translate>Copy Service Labels</a>\n" +
    "<div class=\"button-group gutter-top gutter-bottom\">\n" +
    "<button type=\"submit\" class=\"btn btn-primary btn-lg\" ng-click=\"createRoute()\" ng-disabled=\"createRouteForm.$invalid || disableInputs || !createRoute\" value=\"\">Create</button>\n" +
    "<a class=\"btn btn-default btn-lg\" href=\"\" ng-click=\"cancel()\" translate>Cancel</a>\n" +
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
    "<div ng-if=\"!project\" class=\"mar-top-md\" translate>Loading...</div>\n" +
    "<div ng-if=\"project\">\n" +
    "<breadcrumbs breadcrumbs=\"breadcrumbs\"></breadcrumbs>\n" +
    "<alerts alerts=\"alerts\"></alerts>\n" +
    "<div class=\"mar-top-xl\">\n" +
    "<h1 translate>Create Secret</h1>\n" +
    "<div class=\"help-block\" translate>\n" +
    "Secrets allow you to authenticate to a private Git repository or a private image registry.\n" +
    "</div>\n" +
    "<create-secret namespace=\"projectName\" alerts=\"alerts\" on-create=\"navigateBack()\" on-cancel=\"navigateBack()\">\n" +
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
    "<uib-tabset class=\"mar-top-none\" ng-if=\"project\">\n" +
    "<uib-tab active=\"selectedTab.fromCatalog\">\n" +
    "<uib-tab-heading translate>Browse Catalog</uib-tab-heading>\n" +
    "<catalog project-name=\"projectName\" project-image-streams=\"projectImageStreams\" openshift-image-streams=\"openshiftImageStreams\" project-templates=\"projectTemplates\" openshift-templates=\"openshiftTemplates\" squid-tab=\"squidTab\">\n" +
    "</catalog>\n" +
    "</uib-tab>\n" +
    "<uib-tab active=\"selectedTab.deployImage\">\n" +
    "<uib-tab-heading translate>Deploy Image</uib-tab-heading>\n" +
    "<form>\n" +
    "<deploy-image project=\"project\" context=\"context\"></deploy-image>\n" +
    "</form>\n" +
    "</uib-tab>\n" +
    "<uib-tab active=\"selectedTab.fromFile\">\n" +
    "<uib-tab-heading translate>Import YAML / JSON</uib-tab-heading>\n" +
    "<from-file project=\"project\" context=\"context\"></from-file>\n" +
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
    "<h1>{{category.label|translate}}</h1>\n" +
    "<div ng-if=\"category.description\" class=\"help-block mar-bottom-lg\">{{category.description|translate}}</div>\n" +
    "\n" +
    "<div ng-if=\"category.subcategories\">\n" +
    "<catalog project-name=\"projectName\" project-image-streams=\"projectImageStreams\" openshift-image-streams=\"openshiftImageStreams\" project-templates=\"projectTemplates\" openshift-templates=\"openshiftTemplates\" squid-tab=\"squidTab\" category=\"category\">\n" +
    "</catalog>\n" +
    "</div>\n" +
    "\n" +
    "<div ng-if=\"!category.subcategories\">\n" +
    "<category-content project-name=\"projectName\" project-image-streams=\"projectImageStreams\" openshift-image-streams=\"openshiftImageStreams\" project-templates=\"projectTemplates\" openshift-templates=\"openshiftTemplates\" squid-tab=\"squidTab\" category=\"category\">\n" +
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
    "<div ng-hide=\"imageStream\" translate>\n" +
    "Loading...\n" +
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
    "<label for=\"appname\" class=\"required\" translate>Name</label>\n" +
    "\n" +
    "<div ng-class=\"{'has-error': (form.appname.$error.required && form.appname.$dirty) || (form.appname.$invalid && shouldValidateName) || nameTaken}\">\n" +
    "<input type=\"text\" required take-focus minlength=\"2\" maxlength=\"24\" pattern=\"[a-z]([-a-z0-9]*[a-z0-9])?\" ng-model=\"name\" id=\"appname\" name=\"appname\" ng-change=\"nameTaken = false\" ng-blur=\"shouldValidateName = form.appname.$dirty\" class=\"form-control\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\">\n" +
    "</div>\n" +
    "<div class=\"help-block\" translate>Identifies the resources created for this application.</div>\n" +
    "<div class=\"has-error\" ng-show=\"form.appname.$error.required && form.appname.$dirty\">\n" +
    "<span class=\"help-block\" translate>A name is required.</span>\n" +
    "</div>\n" +
    "<div class=\"has-error\" ng-show=\"form.appname.$error.pattern && shouldValidateName\">\n" +
    "<span class=\"help-block\"><strong translate>Please enter a valid name.</strong>\n" +
    "<p translate>A valid name is applied to all generated resources. It is an alphanumeric (a-z, and 0-9) string with a maximum length of 24 characters, where the first character is a letter (a-z), and the '-' character is allowed anywhere except the first or last character.</p>\n" +
    "</span>\n" +
    "</div>\n" +
    "<div class=\"has-error\" ng-show=\"form.appname.$error.minlength && shouldValidateName\">\n" +
    "<span class=\"help-block\" translate>The name must have at least 2 characters.</span>\n" +
    "</div>\n" +
    "<div class=\"has-error\" ng-show=\"nameTaken\">\n" +
    "<span class=\"help-block\" translate>This name is already in use within the project. Please choose a different name.</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"row\">\n" +
    "<div ng-class=\"{\n" +
    "                              'col-md-8': advancedOptions || advancedSourceOptions,\n" +
    "                              'col-lg-12': !advancedOptions && !advancedSourceOptions\n" +
    "                            }\">\n" +
    "<div class=\"form-group\">\n" +
    "<label for=\"sourceUrl\" class=\"required\" translate>Git Repository URL</label>\n" +
    "<div ng-class=\"{\n" +
    "                                  'has-warning': buildConfig.sourceUrl && form.sourceUrl.$touched && !sourceURLPattern.test(buildConfig.sourceUrl),\n" +
    "                                  'has-error': (form.sourceUrl.$error.required && form.sourceUrl.$dirty)\n" +
    "                                }\">\n" +
    "\n" +
    "<input class=\"form-control\" id=\"sourceUrl\" name=\"sourceUrl\" type=\"text\" required aria-describedby=\"from_source_help\" ng-model=\"buildConfig.sourceUrl\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\">\n" +
    "</div>\n" +
    "<div ng-if=\"!(sourceURIinParams) && image.metadata.annotations.sampleRepo\" class=\"help-block\">\n" +
    "<translate>Sample repository for</translate> {{imageName}}: {{image.metadata.annotations.sampleRepo}}<span ng-if=\"image.metadata.annotations.sampleRef\">,\n" +
    "<translate>ref</translate>: {{image.metadata.annotations.sampleRef}}</span><span ng-if=\"image.metadata.annotations.sampleContextDir\">,\n" +
    "<translate>context dir</translate>: {{image.metadata.annotations.sampleContextDir}}</span>\n" +
    "<a href=\"\" ng-click=\"fillSampleRepo()\" style=\"margin-left: 3px\" class=\"nowrap\"><translate>Try It</translate><i class=\"fa fa-level-up\" style=\"margin-left: 3px; font-size: 17px\"></i></a>\n" +
    "</div>\n" +
    "<div class=\"has-error\" ng-show=\"form.sourceUrl.$error.required && form.sourceUrl.$dirty\">\n" +
    "<span class=\"help-block\" translate>A Git repository URL is required.</span>\n" +
    "</div>\n" +
    "<div class=\"has-warning\" ng-if=\"buildConfig.sourceUrl && form.sourceUrl.$touched && !sourceURLPattern.test(buildConfig.sourceUrl)\">\n" +
    "<span class=\"help-block\" translate>This might not be a valid Git URL. Check that it is the correct URL to a remote Git repository.</span>\n" +
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
    "<div class=\"help-block\" translate>Optional branch, tag, or commit.</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "\n" +
    "<div ng-show=\"advancedOptions || advancedSourceOptions\" class=\"form-group\">\n" +
    "<label for=\"contextdir\" translate>Context Dir</label>\n" +
    "<div>\n" +
    "<input id=\"contextdir\" ng-model=\"buildConfig.contextDir\" type=\"text\" placeholder=\"/\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\" class=\"form-control\">\n" +
    "</div>\n" +
    "<div class=\"help-block\" translate>Optional subdirectory for the application source code, used as the context directory for the build.</div>\n" +
    "</div>\n" +
    "\n" +
    "<div ng-show=\"advancedOptions\">\n" +
    "\n" +
    "<div class=\"form-group\" ng-if=\"project\">\n" +
    "<osc-secrets model=\"buildConfig.secrets.gitSecret\" namespace=\"projectName\" display-type=\"source\" type=\"source\" service-account-to-link=\"builder\" secrets-by-type=\"secretsByType\" alerts=\"alerts\" allow-multiple-secrets=\"false\">\n" +
    "</osc-secrets>\n" +
    "</div>\n" +
    "\n" +
    "<osc-form-section header=\"Routing\" about-title=\"Routing\" about=\"{{'Routing is a way to make your application publicly visible. Otherwise you may only be able to access your application by its IP address, if allowed by the system administrator.'|translate}}\" expand=\"true\" can-toggle=\"false\" ng-if=\"routing.portOptions.length\">\n" +
    "<div class=\"form-group checkbox\">\n" +
    "<label>\n" +
    "<input type=\"checkbox\" ng-model=\"routing.include\">\n" +
    "<translate>Create a route to the application</translate>\n" +
    "</label>\n" +
    "</div>\n" +
    "<osc-routing model=\"routing\" routing-disabled=\"!routing.include\">\n" +
    "</osc-routing>\n" +
    "</osc-form-section>\n" +
    "\n" +
    "<osc-form-section header=\"Build Configuration\" about-title=\"Build Configuration\" about=\"{{'A build configuration describes how to build your deployable image.  This includes your source, the base builder image, and when to launch new builds.'|translate}}\" expand=\"true\" can-toggle=\"false\">\n" +
    "<div class=\"checkbox\">\n" +
    "<label>\n" +
    "<input type=\"checkbox\" ng-model=\"buildConfig.buildOnSourceChange\"/>\n" +
    "<translate>Configure a webhook build trigger</translate>\n" +
    "<span class=\"help action-inline\">\n" +
    "<a href data-toggle=\"tooltip\" data-original-title=\"{{'The source repository must be configured to use the webhook to trigger a build when source is committed.'|translate}}\">\n" +
    "<i class=\"pficon pficon-help\"></i>\n" +
    "</a>\n" +
    "</span>\n" +
    "</label>\n" +
    "</div>\n" +
    "<div class=\"checkbox\">\n" +
    "<label>\n" +
    "<input type=\"checkbox\" ng-model=\"buildConfig.buildOnImageChange\"/>\n" +
    "<translate>Automatically build a new image when the builder image changes</translate>\n" +
    "<span class=\"help action-inline\">\n" +
    "<a href data-toggle=\"tooltip\" data-original-title=\"{{'Automatically building a new image when the builder image changes allows your code to always run on the latest updates.'|translate}}\">\n" +
    "<i class=\"pficon pficon-help\"></i>\n" +
    "</a>\n" +
    "</span>\n" +
    "</label>\n" +
    "</div>\n" +
    "<div class=\"checkbox\">\n" +
    "<label>\n" +
    "<input type=\"checkbox\" ng-model=\"buildConfig.buildOnConfigChange\"/>\n" +
    "<translate>Launch the first build when the build configuration is created</translate>\n" +
    "</label>\n" +
    "</div>\n" +
    "<h3><translate>Environment Variables</translate> <span class=\"appended-icon\"><translate>(Build and Runtime)</translate> <span class=\"help action-inline\">\n" +
    "<a href data-toggle=\"tooltip\" data-original-title=\"{{'Environment variables are used to configure and pass information to running containers.  These environment variables will be available during your build and at runtime.'|translate}}\">\n" +
    "<i class=\"pficon pficon-help\"></i>\n" +
    "</a>\n" +
    "</span></span></h3>\n" +
    "<key-value-editor entries=\"buildConfigEnvVars\" key-placeholder=\"{{'name'|translate}}\" value-placeholder=\"{{'value'|translate}}\" key-validator=\"[a-zA-Z_][a-zA-Z0-9_]*\" key-validator-error-tooltip=\"{{'A valid environment variable name is an alphanumeric (a-z and 0-9) string beginning with a letter that may contain underscores.'|translate}}\" add-row-link=\"Add Environment Variable\"></key-value-editor>\n" +
    "</osc-form-section>\n" +
    "\n" +
    "<osc-form-section header=\"Deployment Configuration\" about-title=\"{{'Deployment Configuration'|translate}}\" about=\"{{'Deployment configurations describe how your application is configured by the cluster and under what conditions it should be recreated (e.g. when the image changes).'|translate}}\" expand=\"true\" can-toggle=\"false\">\n" +
    "<div class=\"animate-drawer\" ng-show=\"$parent.expand\">\n" +
    "<h3 translate>Autodeploy when</h3>\n" +
    "<div class=\"checkbox\">\n" +
    "<label>\n" +
    "<input type=\"checkbox\" ng-model=\"deploymentConfig.deployOnNewImage\">\n" +
    "<translate>New image is available</translate>\n" +
    "</label>\n" +
    "</div>\n" +
    "<div class=\"checkbox\">\n" +
    "<label>\n" +
    "<input type=\"checkbox\" ng-model=\"deploymentConfig.deployOnConfigChange\">\n" +
    "<translate>Deployment configuration changes</translate>\n" +
    "</label>\n" +
    "</div>\n" +
    "<div>\n" +
    "<h3><translate>Environment Variables</translate> <span class=\"appended-icon\"><translate>(Runtime only)</translate> <span class=\"help action-inline\">\n" +
    "<a href=\"\" data-toggle=\"tooltip\" data-original-title=\"{{'Environment variables are used to configure and pass information to running containers.  These environment variables will only be available at runtime.'|translate}}\">\n" +
    "<i class=\"pficon pficon-help\"></i>\n" +
    "</a>\n" +
    "</span></span></h3>\n" +
    "<p ng-show=\"DCEnvVarsFromImage.length\">\n" +
    "<a href=\"\" ng-click=\"showDCEnvs = (!showDCEnvs)\" translate>\n" +
    "{{showDCEnvs ? 'Hide' : 'Show'}} Image Environment Variables\n" +
    "</a>\n" +
    "</p>\n" +
    "<div ng-show=\"showDCEnvs\">\n" +
    "<div class=\"help-block\">\n" +
    "<p translate>These variables exist on the image and will be available at runtime. You may override them below.</p>\n" +
    "</div>\n" +
    "<key-value-editor entries=\"DCEnvVarsFromImage\" is-readonly cannot-add cannot-sort cannot-delete></key-value-editor>\n" +
    "</div>\n" +
    "<key-value-editor entries=\"DCEnvVarsFromUser\" key-placeholder=\"{{'name'|translate}}\" value-placeholder=\"{{'value'|translate}}\" value-from-selector-options=\"valueFromObjects\" key-validator=\"[a-zA-Z_][a-zA-Z0-9_]*\" key-validator-error-tooltip=\"{{'A valid environment variable name is an alphanumeric (a-z and 0-9) string beginning with a letter that may contain underscores.'|translate}}\" add-row-link=\"Add Environment Variable\" add-row-with-selectors-link=\"Add Environment Variable Using a Config Map or Secret\"></key-value-editor>\n" +
    "</div>\n" +
    "</div>\n" +
    "</osc-form-section>\n" +
    "\n" +
    "<osc-form-section header=\"Scaling\" about-title=\"{{'Scaling'|translate}}\" about=\"{{'Scaling defines the number of running instances of your built image.'|translate}}\" expand=\"true\" can-toggle=\"false\">\n" +
    "<div class=\"form-group\">\n" +
    "<label for=\"scale-type\" translate>Strategy</label>\n" +
    "<ui-select ng-model=\"scaling.autoscale\" input-id=\"scale-type\" search-enabled=\"false\" aria-describedby=\"scale-type-help\">\n" +
    "<ui-select-match>{{$select.selected.label}}</ui-select-match>\n" +
    "<ui-select-choices repeat=\"option.value as option in scaling.autoscaleOptions\">\n" +
    "{{option.label}}\n" +
    "</ui-select-choices>\n" +
    "</ui-select>\n" +
    "<div class=\"help-block\" id=\"scale-type-help\" translate>\n" +
    "Scale replicas manually or automatically based on CPU usage.\n" +
    "</div>\n" +
    "<div class=\"learn-more-block\">\n" +
    "<a href=\"{{'pod_autoscaling' | helpLink}}\" target=\"_blank\"><translate>Learn More</translate>&nbsp;<i class=\"fa fa-external-link\" aria-hidden=\"true\"></i></a>\n" +
    "</div>\n" +
    "<div class=\"has-warning\" ng-if=\"metricsWarning && scaling.autoscale\">\n" +
    "<span class=\"help-block\" translate>\n" +
    "CPU metrics might not be available. In order to use horizontal pod autoscalers, your cluster administrator must have properly configured cluster metrics.\n" +
    "</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"form-group\" ng-if=\"!scaling.autoscale\">\n" +
    "<label class=\"number\" translate>Replicas</label>\n" +
    "<input type=\"number\" class=\"form-control\" min=\"0\" name=\"replicas\" ng-model=\"scaling.replicas\" ng-required=\"!scaling.autoscale\" ng-disabled=\"scaling.autoscale\" ng-pattern=\"/^\\d+$/\" aria-describedby=\"replicas-help\">\n" +
    "<div id=\"replicas-help\">\n" +
    "<span class=\"help-block\" translate>The number of instances of your image.</span>\n" +
    "</div>\n" +
    "<div class=\"has-error\" ng-show=\"form.replicas.$dirty && form.replicas.$invalid\">\n" +
    "<span class=\"help-block\" translate>Replicas must be an integer value greater than or equal to 0.</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "<osc-autoscaling ng-if=\"scaling.autoscale\" model=\"scaling\" project=\"project\">\n" +
    "</osc-autoscaling>\n" +
    "<div class=\"has-warning\" ng-if=\"showCPURequestWarning\">\n" +
    "<span class=\"help-block\">\n" +
    "<translate>You should configure resource limits below for autoscaling.</translate>\n" +
    "<translate>Autoscaling will not work without a CPU</translate>\n" +
    "<span ng-if=\"'cpu' | isRequestCalculated : project\" translate>limit.</span>\n" +
    "<span ng-if=\"!('cpu' | isRequestCalculated : project)\" translate>request.</span>\n" +
    "<span ng-if=\"'cpu' | isLimitCalculated : project\" translate>\n" +
    "The CPU limit will be automatically calculated from the container memory limit.\n" +
    "</span>\n" +
    "</span>\n" +
    "</div>\n" +
    "</osc-form-section>\n" +
    "\n" +
    "<osc-form-section header=\"Resource Limits\" about-title=\"{{'Resource Limits'|translate}}\" about=\"{{'Resource limits control compute resource usage by a container on a node.'|translate}}\" expand=\"true\" can-toggle=\"false\">\n" +
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
    "<label-editor labels=\"userDefinedLabels\" system-labels=\"systemLabels\" expand=\"true\" can-toggle=\"false\" help-text=\"{{'Each label is applied to each created resource.'|translate}}\">\n" +
    "</label-editor>\n" +
    "</div>\n" +
    "<div class=\"mar-top-md\">\n" +
    "<span ng-if=\"!advancedOptions\" translate>Show</span>\n" +
    "<span ng-if=\"advancedOptions\" translate>Hide</span>\n" +
    "<a href=\"\" ng-click=\"advancedOptions = !advancedOptions\" role=\"button\" translate>advanced options</a>\n" +
    "<translate>for source, routes, builds, and deployments.</translate>\n" +
    "</div>\n" +
    "<div class=\"buttons gutter-bottom\" ng-class=\"{'gutter-top': !alerts.length}\">\n" +
    "\n" +
    "<button type=\"submit\" class=\"btn btn-primary btn-lg\" ng-disabled=\"form.$invalid || nameTaken || cpuProblems.length || memoryProblems.length || disableInputs\" translate>Create</button>\n" +
    "<a class=\"btn btn-default btn-lg\" href=\"\" ng-click=\"cancel()\" role=\"button\" translate>Cancel</a>\n" +
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
    "<next-steps project=\"project\" project-name=\"projectName\" login-base-url=\"loginBaseUrl\" from-sample-repo=\"fromSampleRepo\" created-build-config=\"createdBuildConfig\"></next-steps>\n" +
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
    "<translate>Deployments</translate>\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
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
    "<div class=\"middle-content\">\n" +
    "<div class=\"container-fluid\">\n" +
    "<alerts alerts=\"alerts\"></alerts>\n" +
    "<div class=\"row\">\n" +
    "<div class=\"col-md-12\">\n" +
    "<h3 ng-if=\"(deployments | size) || (replicaSets | size)\" translate>Deployment Configurations</h3>\n" +
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
    "<th translate>Name</th>\n" +
    "<th translate>Last Version</th>\n" +
    "<th translate>Status</th>\n" +
    "<th translate>Created</th>\n" +
    "<th translate>Trigger</th>\n" +
    "</tr>\n" +
    "</thead>\n" +
    "\n" +
    "<tbody ng-if=\"showEmptyMessage()\">\n" +
    "\n" +
    "<tr><td colspan=\"5\"><em>{{emptyMessage|translate}}</em></td></tr>\n" +
    "</tbody>\n" +
    "<tbody ng-if=\"!showEmptyMessage()\">\n" +
    "<tr ng-repeat-start=\"(dcName, replicationControllersForDC) in replicationControllersByDC\" ng-if=\"dcName && (deploymentConfigs[dcName] || !unfilteredDeploymentConfigs[dcName])\" style=\"display: none\"></tr>\n" +
    "\n" +
    "<tr ng-if=\"(replicationControllersForDC | hashSize) == 0 && dcName\">\n" +
    "<td data-title=\"Name\">\n" +
    "<a ng-if=\"deploymentConfigs[dcName]\" href=\"{{dcName | navigateResourceURL : 'DeploymentConfig' : projectName}}\">{{dcName}}</a>\n" +
    "<span ng-if=\"deploymentConfigs[dcName].status.details.message\" class=\"pficon pficon-warning-triangle-o\" style=\"cursor: help\" data-toggle=\"popover\" data-trigger=\"hover\" dynamic-content=\"{{deploymentConfigs[dcName].status.details.message}}\"></span>\n" +
    "</td>\n" +
    "<td data-title=\"Last Version\"><em translate>No deployments</em></td>\n" +
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
    "<span ng-if=\"!replicationController.causes.length\" translate>Unknown</span>\n" +
    "<span ng-if=\"replicationController.causes.length\">\n" +
    "<span ng-repeat=\"cause in replicationController.causes\">\n" +
    "<span ng-switch=\"cause.type\">\n" +
    "<span ng-switch-when=\"ImageChange\">\n" +
    "<span ng-if=\"cause.imageTrigger.from\">\n" +
    "<abbr title=\"{{cause.imageTrigger.from | imageObjectRef : null : true}}\" translate>Image</abbr> <translate>change</translate>\n" +
    "</span>\n" +
    "</span>\n" +
    "<span ng-switch-when=\"ConfigChange\" translate>Config change</span>\n" +
    "<span ng-switch-default>{{cause.type}}</span>\n" +
    "</span>\n" +
    "</span>\n" +
    "</span>\n" +
    "</td>\n" +
    "</tr>\n" +
    "<tr ng-repeat-end style=\"display: none\"></tr>\n" +
    "</tbody>\n" +
    "</table>\n" +
    "<div ng-if=\"deployments | size\">\n" +
    "<h3 translate>Deployments</h3>\n" +
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
    "<th translate>Name</th>\n" +
    "<th translate>Last Version</th>\n" +
    "<th translate>Replicas</th>\n" +
    "<th translate>Created</th>\n" +
    "<th translate>Strategy</th>\n" +
    "</tr>\n" +
    "</thead>\n" +
    "<tbody>\n" +
    "<tr ng-repeat=\"deployment in deployments | orderObjectsByDate : true\">\n" +
    "<td data-title=\"Name\">\n" +
    "<a ng-href=\"{{deployment | navigateResourceURL}}\">{{deployment.metadata.name}}</a>\n" +
    "</td>\n" +
    "<td data-title=\"Last Version\">\n" +
    "<span ng-if=\"latestReplicaSetByDeploymentUID[deployment.metadata.uid]\">\n" +
    "<a ng-href=\"{{latestReplicaSetByDeploymentUID[deployment.metadata.uid] | navigateResourceURL}}\">{{deployment | lastDeploymentRevision}}</a>\n" +
    "</span>\n" +
    "<span ng-if=\"!latestReplicaSetByDeploymentUID[deployment.metadata.uid]\">\n" +
    "{{deployment | lastDeploymentRevision}}\n" +
    "</span>\n" +
    "</td>\n" +
    "<td data-title=\"Replicas\">\n" +
    "<span ng-if=\"!(deployment.status.replicas | isNil) && deployment.status.replicas !== deployment.spec.replicas\">{{deployment.status.replicas}}/</span><translate>{{deployment.spec.replicas}} replica<span ng-if=\"deployment.spec.replicas != 1\">s</span></translate>\n" +
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
    "<th translate>Name</th>\n" +
    "<th translate>Replicas</th>\n" +
    "<th translate>Created</th>\n" +
    "</tr>\n" +
    "</thead>\n" +
    "<tbody>\n" +
    "<tr ng-repeat=\"replicaSet in replicaSets | orderObjectsByDate : true\">\n" +
    "<td data-title=\"Name\">\n" +
    "<a ng-href=\"{{replicaSet | navigateResourceURL}}\">{{replicaSet.metadata.name}}</a>\n" +
    "</td>\n" +
    "<td data-title=\"Replicas\">\n" +
    "<span ng-if=\"replicaSet.status.replicas !== replicaSet.spec.replicas\">{{replicaSet.status.replicas}}/</span><translate>{{replicaSet.spec.replicas}} replica<span ng-if=\"replicaSet.spec.replicas != 1\">s</span></translate>\n" +
    "</td>\n" +
    "<td data-title=\"Created\">\n" +
    "<span am-time-ago=\"replicaSet.metadata.creationTimestamp\"></span>\n" +
    "</td>\n" +
    "</tr>\n" +
    "</tbody>\n" +
    "</table>\n" +
    "</div>\n" +
    "<div ng-if=\"(unfilteredReplicationControllers | hashSize) > 0\" id=\"replica-controllers\">\n" +
    "<h3 translate>Other Replication Controllers</h3>\n" +
    "<table class=\"table table-bordered table-hover table-mobile table-layout-fixed\">\n" +
    "<colgroup>\n" +
    "<col class=\"col-sm-5\">\n" +
    "</colgroup>\n" +
    "<thead>\n" +
    "<tr>\n" +
    "<th translate>Name</th>\n" +
    "<th translate>Replicas</th>\n" +
    "<th translate>Created</th>\n" +
    "</tr>\n" +
    "</thead>\n" +
    "<tbody ng-if=\"(replicationControllersByDC[''] | hashSize) === 0\"><tr><td colspan=\"3\"><em translate>No replication controllers to show</em></td></tr></tbody>\n" +
    "<tbody ng-if=\"(replicationControllersByDC[''] | hashSize) > 0\">\n" +
    "\n" +
    "<tr ng-repeat=\"deployment in replicationControllersByDC[''] | orderObjectsByDate : true\">\n" +
    "<td data-title=\"Name\">\n" +
    "<a ng-href=\"{{deployment | navigateResourceURL}}\">{{deployment.metadata.name}}</a>\n" +
    "</td>\n" +
    "<td data-title=\"Replicas\">\n" +
    "<span ng-if=\"deployment.status.replicas !== deployment.spec.replicas\">{{deployment.status.replicas}}/</span><translate>{{deployment.spec.replicas}} replica<span ng-if=\"deployment.spec.replicas != 1\">s</span></translate>\n" +
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
    "<span class=\"sr-only\" translate>Dismiss</span>\n" +
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
    "<a ng-href=\"{{build | navigateResourceURL}}\" translate>Build #{{build | annotation : 'buildNumber'}}</a>\n" +
    "</div>\n" +
    "<span am-time-ago=\"build.metadata.creationTimestamp\" class=\"build-timestamp\"></span>\n" +
    "<div ng-include=\"'views/directives/_build-pipeline-links.html'\" class=\"build-links\"></div>\n" +
    "</div>\n" +
    "<div class=\"pipeline-container\">\n" +
    "<div class=\"pipeline\" ng-if=\"!jenkinsStatus.stages.length\">\n" +
    "<div class=\"pipeline-stage no-stages\">\n" +
    "<div class=\"pipeline-stage-name\" translate>No stages have started.</div>\n" +
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
    "<a ng-href=\"{{build | jenkinsInputURL}}\" target=\"_blank\" translate>Input Required</a>\n" +
    "</div>\n" +
    "<div class=\"pipeline-time\" ng-class=\"stage.status\" ng-if=\"stage.durationMillis && !(stage | pipelineStagePendingInput)\">{{stage.durationMillis | timeOnlyDuration}}</div>\n" +
    "<div class=\"pipeline-time\" ng-class=\"stage.status\" ng-if=\"!stage.durationMillis && !(stage | pipelineStagePendingInput)\" translate>not started</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/directives/_build-pipeline-links.html',
    "<div ng-if=\"(build | buildLogURL) && ('builds/log' | canI : 'get')\" class=\"pipeline-link\"><a ng-href=\"{{build | buildLogURL}}\" target=\"_blank\" translate>View Log</a></div>"
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
    "<a ng-show=\"!inputText\" data-clipboard-target=\"#{{id}}\" href=\"\" ng-disabled=\"isDisabled\" data-toggle=\"tooltip\" data-placement=\"left\" data-container=\".middle\" title=\"{{'Copy to Clipboard'|translate}}\" role=\"button\" class=\"btn btn-default\">\n" +
    "<i class=\"fa fa-clipboard\" aria-hidden=\"true\"></i>\n" +
    "<span class=\"sr-only\" translate>Copy to Clipboard</span>\n" +
    "</a>\n" +
    "<a ng-show=\"inputText\" data-clipboard-text=\"{{clipboardText}}\" href=\"\" ng-disabled=\"isDisabled\" data-toggle=\"tooltip\" data-placement=\"left\" data-container=\".middle\" title=\"{{'Copy to Clipboard'|translate}}\" role=\"button\" class=\"btn btn-default\">\n" +
    "<i class=\"fa fa-clipboard\" aria-hidden=\"true\"></i>\n" +
    "<span class=\"sr-only\" translate>Copy to Clipboard</span>\n" +
    "</a>\n" +
    "</span>\n" +
    "</div>"
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
    "<a href=\"\" ng-click=\"removeArg($index)\" class=\"input-group-addon action-button remove-arg\" title=\"{{'Remove Item'|translate}}\">\n" +
    "<span class=\"sr-only\" translate>Remove Item</span>\n" +
    "<i class=\"pficon pficon-close\" aria-hidden=\"true\"></i>\n" +
    "</a>\n" +
    "</span>\n" +
    "</span>\n" +
    "</p>\n" +
    "<div class=\"form-group\">\n" +
    "<label class=\"sr-only\" ng-attr-for=\"{{id}}-add-arg\">\n" +
    "<span ng-if=\"placeholder\">{{placeholder}}</span>\n" +
    "<span ng-if=\"!placeholder\" translate>Add argument</span>\n" +
    "</label>\n" +
    "\n" +
    "<span ng-show=\"!multiline\" class=\"input-group\">\n" +
    "<input type=\"text\" ng-model=\"nextArg\" name=\"nextArg\" ng-attr-id=\"{{id}}-add-arg\" on-enter=\"addArg()\" ng-attr-placeholder=\"{{placeholder || 'Add argument'}}\" class=\"form-control\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\">\n" +
    "<span class=\"input-group-btn\">\n" +
    "\n" +
    "<a class=\"btn btn-default\" href=\"\" ng-click=\"addArg()\" ng-disabled=\"!nextArg\" ng-attr-aria-disabled=\"!nextArg\" role=\"button\" translate>Add</a>\n" +
    "</span>\n" +
    "</span>\n" +
    "\n" +
    "<span ng-show=\"multiline\">\n" +
    "<textarea ng-model=\"nextArg\" name=\"nextArg\" rows=\"10\" ng-attr-id=\"{{id}}-add-arg\" ng-attr-placeholder=\"{{placeholder || 'Add argument'}}\" class=\"form-control\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\">\n" +
    "      </textarea>\n" +
    "<div class=\"mar-top-md\">\n" +
    "<a class=\"btn btn-default\" href=\"\" ng-click=\"addArg()\" ng-disabled=\"!nextArg\" ng-attr-aria-disabled=\"!nextArg\" role=\"button\" translate>Add</a>\n" +
    "</div>\n" +
    "</span>\n" +
    "<div class=\"help-block\">\n" +
    "<span ng-if=\"description\">{{description}}</span>\n" +
    "<span ng-if=\"!description\" translate>\n" +
    "Enter the command to run inside the container. The command is considered successful if its exit code is 0. Drag and drop to reorder arguments.\n" +
    "</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"mar-top-sm mar-bottom-md\">\n" +
    "<a href=\"\" ng-click=\"multiline = !multiline\" translate>Switch to {{multiline ? 'Single-line' : 'Multiline'}} Editor</a>\n" +
    "<span ng-show=\"input.args.length\">\n" +
    "<span class=\"action-divider\">|</span>\n" +
    "<a href=\"\" ng-click=\"clear()\" role=\"button\" translate>Clear {{ (type || 'Command') | upperFirst }}</a>\n" +
    "</span>\n" +
    "</div>\n" +
    "\n" +
    "<input type=\"hidden\" name=\"command\" ng-model=\"input.args\" ng-required=\"isRequired\">\n" +
    "<div ng-if=\"form.command.$dirty && form.command.$error.required\" class=\"has-error\">\n" +
    "<span class=\"help-block\" translate>A command is required.</span>\n" +
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
    "<translate>Use HTTPS</translate>\n" +
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
    "<label class=\"required\" translate>Command</label>\n" +
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
    "<label ng-attr-for=\"{{id}}-initial-delay\" translate>Initial Delay</label>\n" +
    "<span class=\"input-group\" ng-class=\"{ 'has-error': form.initialDelaySeconds.$invalid && form.initialDelaySeconds.$touched }\">\n" +
    "<input type=\"number\" name=\"initialDelaySeconds\" ng-model=\"probe.initialDelaySeconds\" ng-pattern=\"/^\\d+$/\" min=\"0\" select-on-focus ng-attr-id=\"{{id}}-initial-delay\" class=\"form-control\" ng-attr-aria-describedby=\"{{id}}-delay-description\">\n" +
    "<span class=\"input-group-addon\" translate>seconds</span>\n" +
    "</span>\n" +
    "<div class=\"help-block\" ng-attr-id=\"{{id}}-delay-description\" translate>\n" +
    "How long to wait after the container starts before checking its health.\n" +
    "</div>\n" +
    "<div ng-if=\"form.initialDelaySeconds.$invalid && form.initialDelaySeconds.$touched\" class=\"has-error\">\n" +
    "<div ng-if=\"form.initialDelaySeconds.$error.number\" class=\"help-block\" translate>\n" +
    "Must be a number.\n" +
    "</div>\n" +
    "<div ng-if=\"form.initialDelaySeconds.$error.min\" class=\"help-block\" translate>\n" +
    "Delay can't be negative.\n" +
    "</div>\n" +
    "<span ng-if=\"form.initialDelaySeconds.$error.pattern && !form.initialDelaySeconds.$error.min\" class=\"help-block\" translate>\n" +
    "Must be a whole number.\n" +
    "</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"form-group\">\n" +
    "<label ng-attr-for=\"{{id}}-timeout\">Timeout</label>\n" +
    "<span class=\"input-group\" ng-class=\"{ 'has-error': form.timeoutSeconds.$invalid && form.timeoutSeconds.$touched }\">\n" +
    "<input type=\"number\" name=\"timeoutSeconds\" ng-model=\"probe.timeoutSeconds\" ng-pattern=\"/^\\d+$/\" min=\"1\" placeholder=\"1\" select-on-focus ng-attr-id=\"{{id}}-timeout\" class=\"form-control\" ng-attr-aria-describedby=\"{{id}}-timeout-description\">\n" +
    "<span class=\"input-group-addon\" translate>seconds</span>\n" +
    "</span>\n" +
    "<div class=\"help-block\" ng-attr-id=\"{{id}}-timeout-description\" translate>\n" +
    "How long to wait for the probe to finish. If the time is exceeded, the probe is considered failed.\n" +
    "</div>\n" +
    "<div ng-if=\"form.timeoutSeconds.$invalid && form.timeoutSeconds.$touched\" class=\"has-error\">\n" +
    "<div ng-if=\"form.timeoutSeconds.$error.number\" class=\"help-block\" translate>\n" +
    "Must be a number.\n" +
    "</div>\n" +
    "<div ng-if=\"form.timeoutSeconds.$error.min\" class=\"help-block\" translate>\n" +
    "Timeout must be greater than or equal to one.\n" +
    "</div>\n" +
    "<span ng-if=\"form.timeoutSeconds.$error.pattern && !form.timeoutSeconds.$error.min\" class=\"help-block\" translate>\n" +
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


  $templateCache.put('views/directives/_probe.html',
    " <span ng-if=\"probe.httpGet\" translate>\n" +
    "GET {{probe.httpGet.path || '/'}} on port {{probe.httpGet.port || 'unknown'}} ({{probe.httpGet.scheme || 'HTTP'}})\n" +
    "</span>\n" +
    "<span ng-if=\"probe.exec.command\">\n" +
    "<code class=\"command\">\n" +
    "<truncate-long-text content=\"probe.exec.command.join(' ')\" limit=\"80\" newline-limit=\"1\" expandable=\"true\" use-word-boundary=\"false\">\n" +
    "</truncate-long-text>\n" +
    "</code>\n" +
    "</span>\n" +
    "<span ng-if=\"probe.tcpSocket\" translate>\n" +
    "Open socket on port {{probe.tcpSocket.port}}\n" +
    "</span>\n" +
    "<small class=\"text-muted\">\n" +
    "<span ng-if=\"probe.initialDelaySeconds\" class=\"nowrap\" translate>{{probe.initialDelaySeconds}}s delay,</span>\n" +
    "<span class=\"nowrap\" translate>{{probe.timeoutSeconds || 1}}s timeout</span>\n" +
    "</small>"
  );


  $templateCache.put('views/directives/_project-filter.html',
    "<div class=\"filter\">\n" +
    "<div class=\"form-group\">\n" +
    "<label ng-if=\"!renderOptions || !renderOptions.hideFilterWidget\" class=\"control-label sr-only\" translate>Filter by labels</label>\n" +
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
    "<a href=\"\" ng-click=\"toggleAnnotations()\" ng-if=\"!expandAnnotations\" translate>Show Annotations</a>\n" +
    "<a href=\"\" ng-click=\"toggleAnnotations()\" ng-if=\"expandAnnotations\" translate>Hide Annotations</a>\n" +
    "</p>\n" +
    "<div ng-if=\"expandAnnotations\">\n" +
    "<div ng-if=\"annotations\" class=\"table-responsive scroll-shadows-horizontal\">\n" +
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
    "<p ng-if=\"!annotations\" class=\"mar-bottom-xl\" translate>\n" +
    "There are no annotations on this resource.\n" +
    "</p>\n" +
    "</div>"
  );


  $templateCache.put('views/directives/bind-service.html',
    "<div class=\"bind-service-wizard\">\n" +
    "<div pf-wizard hide-header=\"true\" hide-sidebar=\"true\" hide-back-button=\"true\" step-class=\"bind-service-wizard-step\" wizard-ready=\"ctrl.wizardReady\" next-title=\"ctrl.nextTitle\" on-finish=\"ctrl.closeWizard()\" on-cancel=\"ctrl.closeWizard()\" wizard-done=\"ctrl.wizardComplete\" class=\"pf-wizard-no-back\">\n" +
    "<div pf-wizard-step ng-repeat=\"step in ctrl.steps track by $index\" step-title=\"{{step.label}}\" next-enabled=\"step.valid\" on-show=\"step.onShow\" step-id=\"{{step.id}}\" step-priority=\"{{$index}}\">\n" +
    "<div class=\"wizard-pf-main-inner-shadow-covers\">\n" +
    "<div class=\"bind-service-config\">\n" +
    "<div ng-include=\"step.view\" class=\"wizard-pf-main-form-contents\"></div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/directives/bind-service/bind-service-form.html',
    "<div ng-if=\"ctrl.target.kind !== 'Instance'\">\n" +
    "<bind-application-form application-name=\"ctrl.target.metadata.name\" form-name=\"ctrl.selectionForm\" service-classes=\"ctrl.serviceClasses\" service-instances=\"ctrl.orderedServiceInstances\" service-to-bind=\"ctrl.serviceToBind\">\n" +
    "</bind-application-form>\n" +
    "</div>\n" +
    "<div ng-if=\"ctrl.target.kind === 'Instance'\">\n" +
    "<bind-service-form selected-project=\"ctrl.project\" service-class=\"ctrl.serviceClass\" service-class-name=\"ctrl.serviceClassName\" form-name=\"ctrl.selectionForm\" applications=\"ctrl.applications\" project-name=\"ctrl.projectDisplayName\" bind-type=\"ctrl.bindType\" app-to-bind=\"ctrl.appToBind\">\n" +
    "</bind-service-form>\n" +
    "</div>"
  );


  $templateCache.put('views/directives/bind-service/delete-binding-result.html',
    "<div>\n" +
    "<div ng-if=\"!ctrl.error\">\n" +
    "<h3 class=\"mar-top-none\" translate>\n" +
    "Binding for the following has been deleted:\n" +
    "</h3>\n" +
    "<div ng-if=\"ctrl.unboundApps | size\" ng-repeat=\"appForBinding in ctrl.unboundApps track by (appForBinding | uid)\">\n" +
    "{{appForBinding.metadata.name}} <small class=\"text-muted\">&ndash; {{ appForBinding.kind | humanizeKind : true}}</small>\n" +
    "</div>\n" +
    "<div ng-if=\"!(ctrl.unboundApps | size)\">\n" +
    "{{ctrl.selectedBinding.spec.secretName}} <small class=\"text-muted\">&ndash; <translate>Secret</translate></small>\n" +
    "</div>\n" +
    "\n" +
    "<p ng-if=\"ctrl.unboundApps | size\" class=\"mar-top-lg\">\n" +
    "<span class=\"pficon pficon-info\" aria-hidden=\"true\"></span>\n" +
    "<translate>You will need to redeploy your pods for this to take effect.</translate>\n" +
    "</p>\n" +
    "</div>\n" +
    "<div ng-if=\"ctrl.error\">\n" +
    "<div class=\"title\"><translate>Deletion of Binding Failed</translate> <span class=\"fa fa-times text-danger\"></span></div>\n" +
    "<div class=\"sub-title\">\n" +
    "<span ng-if=\"ctrl.error.data.message\">\n" +
    "{{ctrl.error.data.message | upperFirst}}\n" +
    "</span>\n" +
    "<span ng-if=\"!ctrl.error.data.message\" translate>\n" +
    "An error occurred deleting the binding.\n" +
    "</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/directives/bind-service/delete-binding-select-form.html',
    "<h3 class=\"mar-top-none\" translate>\n" +
    "Select a binding to delete from <strong>{{ctrl.displayName}}</strong>\n" +
    "</h3>\n" +
    "<form name=\"ctrl.bindingSelection\" class=\"mar-bottom-lg\">\n" +
    "<fieldset ng-disabled=\"ctrl.isDisabled\">\n" +
    "<div ng-repeat=\"binding in ctrl.bindings\" class=\"radio\">\n" +
    "<label>\n" +
    "<input type=\"radio\" ng-model=\"ctrl.selectedBinding\" ng-value=\"{{binding}}\">\n" +
    "<div ng-if=\"ctrl.appsForBinding(binding.metadata.name) | size\" ng-repeat=\"appForBinding in ctrl.appsForBinding(binding.metadata.name)\">\n" +
    "{{appForBinding.metadata.name}} <small class=\"text-muted\">&ndash; {{ appForBinding.kind | humanizeKind : true}}</small>\n" +
    "</div>\n" +
    "<div ng-if=\"!(ctrl.appsForBinding(binding.metadata.name)  | size)\">\n" +
    "{{binding.spec.secretName}} <small class=\"text-muted\">&ndash; Secret</small>\n" +
    "</div>\n" +
    "</label>\n" +
    "</div>\n" +
    "</fieldset>\n" +
    "</form>"
  );


  $templateCache.put('views/directives/bind-service/results.html',
    "<bind-results error=\"ctrl.error\" binding=\"ctrl.binding\" service-to-bind=\"ctrl.serviceToBind.metadata.name\" bind-type=\"{{ctrl.bindType}}\" application-to-bind=\"ctrl.appToBind.metadata.name\" generated-secret-name=\"ctrl.generatedSecretName\" show-pod-presets=\"'pod_presets' | enableTechPreviewFeature\" secret-href=\"ctrl.generatedSecretName | navigateResourceURL : 'Secret' : ctrl.target.metadata.namespace\">\n" +
    "</bind-results>"
  );


  $templateCache.put('views/directives/breadcrumbs.html',
    "<ol class=\"breadcrumb\" ng-if=\"breadcrumbs.length\">\n" +
    "<li ng-repeat=\"breadcrumb in breadcrumbs\" ng-class=\"{'active': !$last}\">\n" +
    "<a ng-if=\"!$last && breadcrumb.link\" href=\"{{breadcrumb.link}}\">{{breadcrumb.title|translate}}</a>\n" +
    "<a ng-if=\"!$last && !breadcrumb.link\" href=\"\" back>{{breadcrumb.title|translate}}</a>\n" +
    "<strong ng-if=\"$last\">{{breadcrumb.title|translate}}</strong>\n" +
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
    "<div ng-if=\"collapsePending\">\n" +
    "<div ng-if=\"build.status.phase === 'New' || build.status.phase === 'Pending'\" ng-include=\"'views/directives/_build-pipeline-collapsed.html'\"></div>\n" +
    "<div ng-if=\"build.status.phase !== 'New' && build.status.phase !== 'Pending'\" ng-include=\"'views/directives/_build-pipeline-expanded.html'\"></div>\n" +
    "</div>\n" +
    "<div ng-if=\"!expandOnlyRunning && !collapsePending\" ng-include=\"'views/directives/_build-pipeline-expanded.html'\"></div>\n" +
    "</div>"
  );


  $templateCache.put('views/directives/build-status.html',
    "<status-icon status=\"build.status.phase\" disable-animation></status-icon>\n" +
    "<span ng-if=\"!build.status.reason || build.status.phase === 'Cancelled'\">{{build.status.phase}}</span><span ng-if=\"build.status.reason && build.status.phase !== 'Cancelled'\">{{build.status.reason | sentenceCase}}</span><span ng-switch=\"build.status.phase\" class=\"hide-ng-leave\" ng-if=\"build.status.startTimestamp\"><span ng-switch-when=\"Complete\">, ran for {{build.status.startTimestamp | timeOnlyDurationFromTimestamps : build.status.completionTimestamp}}</span><span ng-switch-when=\"Failed\">, ran for {{build.status.startTimestamp | timeOnlyDurationFromTimestamps : build.status.completionTimestamp}}</span><span ng-switch-when=\"Cancelled\"> after {{build.status.startTimestamp | timeOnlyDurationFromTimestamps : build.status.completionTimestamp}}</span><span ng-switch-when=\"Running\"> for <time-only-duration-until-now timestamp=\"build.status.startTimestamp\" time-only></time-only-duration-until-now></span><span ng-switch-when=\"New\"></span><span ng-switch-when=\"Pending\"></span><span ng-switch-default>, ran for {{build.status.startTimestamp | duration : build.status.completionTimestamp}}</span>\n" +
    "</span>"
  );


  $templateCache.put('views/directives/create-secret.html',
    "<ng-form name=\"secretForm\" class=\"create-secret-form\">\n" +
    "<div for=\"secretType\" ng-if=\"!type\" class=\"form-group mar-top-lg\">\n" +
    "<label translate>Secret Type</label>\n" +
    "<ui-select required ng-model=\"newSecret.type\" search-enabled=\"false\" ng-change=\"newSecret.authType = secretAuthTypeMap[newSecret.type].authTypes[0].id\">\n" +
    "<ui-select-match>{{$select.selected | upperFirst}} Secret</ui-select-match>\n" +
    "<ui-select-choices repeat=\"type in secretTypes\" translate>\n" +
    "{{type | upperFirst}} Secret\n" +
    "</ui-select-choices>\n" +
    "</ui-select>\n" +
    "</div>\n" +
    "<div ng-if=\"newSecret.type\">\n" +
    "<div class=\"form-group\">\n" +
    "<label for=\"secretName\" class=\"required\" translate>Secret Name</label>\n" +
    "<span ng-class=\"{'has-error': nameTaken || (secretForm.secretName.$invalid && secretForm.secretName.$touched)}\">\n" +
    "<input class=\"form-control\" id=\"secretName\" name=\"secretName\" ng-model=\"newSecret.data.secretName\" type=\"text\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\" aria-describedby=\"secret-name-help\" ng-pattern=\"nameValidation.pattern\" ng-maxlength=\"nameValidation.maxlength\" ng-change=\"nameChanged()\" required>\n" +
    "</span>\n" +
    "<div class=\"has-error\" ng-show=\"nameTaken\">\n" +
    "<span class=\"help-block\" translate>\n" +
    "This name is already in use. Please choose a different name.\n" +
    "</span>\n" +
    "</div>\n" +
    "<div class=\"has-error\" ng-show=\"secretForm.secretName.$invalid\">\n" +
    "<div ng-show=\"secretForm.secretName.$error.pattern && secretForm.secretName.$touched\" class=\"help-block\">\n" +
    "{{nameValidation.description}}\n" +
    "</div>\n" +
    "<div ng-show=\"secretForm.secretName.$error.required && secretForm.secretName.$touched\" class=\"help-block\" translate>\n" +
    "Name is required.\n" +
    "</div>\n" +
    "<div ng-show=\"secretForm.secretName.$error.maxlength && secretForm.secretName.$touched\" class=\"help-block\" translate>\n" +
    "Can't be longer than {{nameValidation.maxlength}} characters.\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"help-block\" id=\"secret-name-help\" translate>\n" +
    "Unique name of the new secret.\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"form-group\">\n" +
    "<label for=\"authentificationType\" translate>Authentication Type</label>\n" +
    "<ui-select required ng-model=\"newSecret.authType\" search-enabled=\"false\">\n" +
    "<ui-select-match>{{$select.selected.label}}</ui-select-match>\n" +
    "<ui-select-choices repeat=\"type.id as type in secretAuthTypeMap[newSecret.type].authTypes\">\n" +
    "{{type.label}}\n" +
    "</ui-select-choices>\n" +
    "</ui-select>\n" +
    "</div>\n" +
    "<div ng-if=\"newSecret.authType === 'kubernetes.io/basic-auth'\">\n" +
    "<div class=\"form-group\">\n" +
    "<label for=\"username\" translate>Username</label>\n" +
    "<div>\n" +
    "<input class=\"form-control\" id=\"username\" name=\"username\" ng-model=\"newSecret.data.username\" type=\"text\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\" aria-describedby=\"username-help\">\n" +
    "</div>\n" +
    "<div class=\"help-block\" id=\"username-help\" translate>\n" +
    "Optional username for Git authentication.\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"form-group\" ng-class=\"{ 'has-error' : secretForm.passwordToken.$invalid && secretForm.passwordToken.$touched }\">\n" +
    "<label ng-class=\"{ required: !add.cacert && !add.gitconfig }\" for=\"passwordToken\" translate>Password or Token</label>\n" +
    "<input class=\"form-control\" id=\"passwordToken\" name=\"passwordToken\" ng-model=\"newSecret.data.passwordToken\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\" aria-describedby=\"password-token-help\" type=\"password\" ng-required=\"!add.cacert && !add.gitconfig\">\n" +
    "</div>\n" +
    "<div class=\"has-error\" ng-show=\"secretForm.passwordToken.$error.required && secretForm.passwordToken.$touched\">\n" +
    "<div class=\"help-block\" translate>\n" +
    "Password or token is required.\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"help-block\" id=\"password-token-help\" translate>\n" +
    "Password or token for Git authentication. Required if a ca.crt or .gitconfig file is not specified.\n" +
    "</div>\n" +
    "<div class=\"form-group\">\n" +
    "<div class=\"checkbox\">\n" +
    "<label>\n" +
    "<input type=\"checkbox\" ng-model=\"add.cacert\" translate>\n" +
    "Use a custom ca.crt file\n" +
    "</label>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"form-group\" ng-if=\"add.cacert\" id=\"cacert\">\n" +
    "<label class=\"required\" for=\"cacert\" translate>CA Certificate File</label>\n" +
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
    "<label for=\"privateKey\" class=\"required\" translate>SSH Private Key</label>\n" +
    "<osc-file-input id=\"private-key-file-input\" model=\"newSecret.data.privateKey\" drop-zone-id=\"private-key\" help-text=\"Upload your private SSH key file.\"></osc-file-input>\n" +
    "<div ui-ace=\"{\n" +
    "          theme: 'eclipse',\n" +
    "          rendererOptions: {\n" +
    "            fadeFoldWidgets: true,\n" +
    "            showPrintMargin: false\n" +
    "          }\n" +
    "        }\" ng-model=\"newSecret.data.privateKey\" class=\"create-secret-editor ace-bordered\" id=\"private-key-editor\" required></div>\n" +
    "<div class=\"help-block\" translate>\n" +
    "Private SSH key file for Git authentication.\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"newSecret.type === 'source'\">\n" +
    "<div class=\"form-group\">\n" +
    "<div class=\"checkbox\">\n" +
    "<label>\n" +
    "<input type=\"checkbox\" ng-model=\"add.gitconfig\" translate>\n" +
    "Use a custom .gitconfig file\n" +
    "</label>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"form-group\" ng-if=\"add.gitconfig\" id=\"gitconfig\">\n" +
    "<label class=\"required\" for=\"gitconfig\" translate>Git Configuration File</label>\n" +
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
    "<label for=\"dockerServer\" class=\"required\" translate>Image Registry Server Address</label>\n" +
    "<div>\n" +
    "<input class=\"form-control\" id=\"dockerServer\" name=\"dockerServer\" ng-model=\"newSecret.data.dockerServer\" type=\"text\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\" required>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-show=\"secretForm.dockerServer.$error.required && secretForm.dockerServer.$touched\" class=\"has-error\">\n" +
    "<div class=\"help-block\" translate>\n" +
    "Image registry server address is required.\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"form-group\" ng-class=\"{ 'has-error' : secretForm.dockerUsername.$invalid && secretForm.dockerUsername.$touched }\">\n" +
    "<label for=\"dockerUsername\" class=\"required\" translate>Username</label>\n" +
    "<div>\n" +
    "<input class=\"form-control\" id=\"dockerUsername\" name=\"dockerUsername\" ng-model=\"newSecret.data.dockerUsername\" type=\"text\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\" required>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-show=\"secretForm.dockerUsername.$error.required && secretForm.dockerUsername.$touched\" class=\"has-error\">\n" +
    "<div class=\"help-block\" translate>\n" +
    "Username is required.\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"form-group\" ng-class=\"{ 'has-error' : secretForm.dockerPassword.$invalid && secretForm.dockerPassword.$touched }\">\n" +
    "<label for=\"dockerPassword\" class=\"required\" translate>Password</label>\n" +
    "<div>\n" +
    "<input class=\"form-control\" id=\"dockerPassword\" name=\"dockerPassword\" ng-model=\"newSecret.data.dockerPassword\" type=\"password\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\" required>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-show=\"secretForm.dockerPassword.$error.required && secretForm.dockerPassword.$touched\" class=\"has-error\">\n" +
    "<div class=\"help-block\" translate>\n" +
    "Password is required.\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"form-group\" ng-class=\"{ 'has-error' : secretForm.dockerEmail.$invalid && secretForm.dockerEmail.$touched }\">\n" +
    "<label for=\"dockerEmail\" class=\"required\" translate>Email</label>\n" +
    "<div>\n" +
    "<input class=\"form-control\" type=\"email\" id=\"dockerEmail\" name=\"dockerEmail\" ng-model=\"newSecret.data.dockerMail\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\" required>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"has-error\" ng-show=\"secretForm.dockerEmail.$invalid\">\n" +
    "<div ng-show=\"secretForm.dockerEmail.$error.email && secretForm.dockerEmail.$touched\" class=\"help-block\" translate>\n" +
    "Email must be in the form of <var>user@domain</var>.\n" +
    "</div>\n" +
    "<div ng-show=\"secretForm.dockerEmail.$error.required && secretForm.dockerEmail.$touched\" class=\"help-block\" translate>\n" +
    "Email is required.\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"newSecret.authType === 'kubernetes.io/dockerconfigjson'\">\n" +
    "<div class=\"form-group\" id=\"docker-config\">\n" +
    "<label for=\"dockerConfig\" class=\"required\" translate>Configuration File</label>\n" +
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
    "<div class=\"help-block\" translate>\n" +
    "File with credentials and other configuration for connecting to a secured image registry.\n" +
    "</div>\n" +
    "<div class=\"has-warning\" ng-show=\"invalidConfigFormat\">\n" +
    "<span class=\"help-block\" translate>\n" +
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
    "<translate>Link secret to a service account.</translate>\n" +
    "<a href=\"{{'managing_secrets' | helpLink}}\" target=\"_blank\"><span class=\"learn-more-inline\"><translate>Learn More</translate>&nbsp;<i class=\"fa fa-external-link\" aria-hidden=\"true\"></i></span></a>\n" +
    "</label>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"newSecret.linkSecret\">\n" +
    "<div class=\"form-group\">\n" +
    "<label class=\"required\" translate>Service Account</label>\n" +
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
    "<button class=\"btn btn-lg btn-primary\" type=\"button\" ng-disabled=\"secretForm.$invalid || secretForm.$pristine || invalidConfigFormat\" ng-click=\"create()\" translate>Create</button>\n" +
    "<button class=\"btn btn-lg btn-default\" type=\"button\" ng-click=\"cancel()\" translate>Cancel</button>\n" +
    "</div>\n" +
    "</ng-form>"
  );


  $templateCache.put('views/directives/delete-button.html',
    "<div class=\"actions\">\n" +
    "\n" +
    "<a href=\"\" ng-click=\"$event.stopPropagation(); openDeleteModal()\" role=\"button\" class=\"action-button\" ng-attr-aria-disabled=\"{{disableDelete ? 'true' : undefined}}\" ng-class=\"{ 'disabled-link': disableDelete }\"><i class=\"fa fa-trash-o\" aria-hidden=\"true\"></i><span class=\"sr-only\"><translate>Delete</translate> {{kind | humanizeKind}} {{resourceName}}</span></a>\n" +
    "</div>"
  );


  $templateCache.put('views/directives/delete-link.html',
    "<a href=\"javascript:void(0)\" ng-click=\"openDeleteModal()\" role=\"button\" ng-attr-aria-disabled=\"{{disableDelete ? 'true' : undefined}}\" ng-class=\"{ 'disabled-link': disableDelete }\">{{label || ('Delete'|translate)}}</a>"
  );


  $templateCache.put('views/directives/deploy-image-dialog.html',
    "<overlay-panel show-panel=\"$ctrl.visible\" show-close=\"true\" handle-close=\"$ctrl.close\">\n" +
    "<div pf-wizard on-cancel=\"$ctrl.close()\" on-finish=\"$ctrl.close()\" hide-header=\"true\" hide-back-button=\"true\" hide-sidebar=\"true\" next-title=\"$ctrl.nextButtonTitle\" next-callback=\"$ctrl.nextCallback\" current-step=\"$ctrl.currentStep\" step-class=\"order-service-wizard-step\" wizard-done=\"$ctrl.wizardDone\" class=\"pf-wizard-no-back\">\n" +
    "<div pf-wizard-step step-title=\"Image\" step-id=\"image\" step-priority=\"1\" substeps=\"false\" ok-to-nav-away=\"true\" allow-click-nav=\"false\" next-enabled=\"!$ctrl.deployForm.$invalid\">\n" +
    "<div class=\"wizard-pf-main-inner-shadow-covers\">\n" +
    "<div class=\"order-service-config-single-column\">\n" +
    "<div class=\"wizard-pf-main-form-contents\">\n" +
    "<form name=\"$ctrl.deployForm\">\n" +
    "<deploy-image is-dialog=\"true\" project=\"$ctrl.project\" context=\"$ctrl.context\"></deploy-image>\n" +
    "</form>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div pf-wizard-step step-title=\"Results\" step-id=\"results\" step-priority=\"2\" substeps=\"false\" ok-to-nav-away=\"true\" allow-click-nav=\"false\">\n" +
    "<div class=\"wizard-pf-main-inner-shadow-covers\">\n" +
    "<div class=\"order-service-config-single-column\">\n" +
    "<div class=\"wizard-pf-main-form-contents\">\n" +
    "<next-steps project=\"$ctrl.selectedProject\" project-name=\"$ctrl.selectedProject.metadata.name\" login-base-url=\"$ctrl.loginBaseUrl\" on-continue=\"$ctrl.close\">\n" +
    "</next-steps>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div> \n" +
    "</div> \n" +
    "</overlay-panel>"
  );


  $templateCache.put('views/directives/deploy-image.html',
    "<div class=\"deploy-image\">\n" +
    "<p translate>\n" +
    "Deploy an existing image from an image stream tag or docker pull spec.\n" +
    "</p>\n" +
    "<ng-form name=\"forms.imageSelection\">\n" +
    "<fieldset ng-disabled=\"loading\">\n" +
    "<div class=\"radio\">\n" +
    "<label>\n" +
    "<input type=\"radio\" ng-model=\"mode\" value=\"istag\">\n" +
    "<translate>Image Stream Tag</translate>\n" +
    "</label>\n" +
    "</div>\n" +
    "<fieldset>\n" +
    "<istag-select model=\"istag\" select-required=\"mode === 'istag'\" select-disabled=\"mode !== 'istag'\" include-shared-namespace=\"true\"></istag-select>\n" +
    "<div ng-if=\"mode == 'istag' && istag.namespace && istag.namespace !== 'openshift' && istag.namespace !== project.metadata.name\" class=\"alert alert-warning\">\n" +
    "<span class=\"pficon pficon-warning-triangle-o\" aria-hidden=\"true\"></span>\n" +
    "<translate>Service account <strong>default</strong> will need image pull authority to deploy images from <strong>{{istag.namespace}}</strong>. You can grant authority with the command:</translate>\n" +
    "<p>\n" +
    "<code>oc policy add-role-to-user system:image-puller system:serviceaccount:{{project.metadata.name}}:default -n {{istag.namespace}}</code>\n" +
    "</p>\n" +
    "</div>\n" +
    "</fieldset>\n" +
    "<div class=\"radio\">\n" +
    "<label>\n" +
    "<input type=\"radio\" ng-model=\"mode\" value=\"dockerImage\" translate>\n" +
    "Image Name\n" +
    "</label>\n" +
    "</div>\n" +
    "<div class=\"form-group\">\n" +
    "<label for=\"imageName\" class=\"sr-only\" translate>Image name or pull spec</label>\n" +
    "<div class=\"input-group\">\n" +
    "<input type=\"search\" id=\"imageName\" name=\"imageName\" ng-model=\"imageName\" ng-required=\"mode === 'dockerImage'\" select-on-focus ng-disabled=\"mode !== 'dockerImage'\" placeholder=\"{{'Image name or pull spec'|translate}}\" class=\"form-control\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\">\n" +
    "<span class=\"input-group-btn\">\n" +
    "<button class=\"btn btn-default\" type=\"submit\" ng-disabled=\"!imageName\" ng-click=\"findImage()\">\n" +
    "<i class=\"fa fa-search\" aria-hidden=\"true\"></i>\n" +
    "<span class=\"sr-only\" translate>Find</span>\n" +
    "</button>\n" +
    "</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "</fieldset>\n" +
    "</ng-form>\n" +
    "<div ng-if=\"loading || !import\" class=\"empty-state-message text-muted text-center\">\n" +
    "<span class=\"fa fa-cube icon-lg hero-icon\" aria-hidden=\"true\"></span>\n" +
    "<div ng-if=\"!loading\" class=\"h2\" translate>Select an image stream tag or enter an image name.</div>\n" +
    "<div ng-if=\"loading\" class=\"h2\" translate>Loading image metadata for <span class=\"word-break\">{{imageName | stripSHA}}</span>...</div>\n" +
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
    "<translate>Image <strong>{{import.name}}</strong> runs as the <strong>root</strong> user which might not be permitted by your cluster administrator.</translate>\n" +
    "</div>\n" +
    "<h2>\n" +
    "<span ng-if=\"mode === 'dockerImage'\">{{import.name}}</span>\n" +
    "<span ng-if=\"mode === 'istag'\">{{istag.imageStream}}<span ng-if=\"import.tag\">:{{import.tag}}</span></span>\n" +
    "<small>\n" +
    "<span ng-if=\"import.result.ref.registry\">from {{import.result.ref.registry}},</span>\n" +
    "<span am-time-ago=\"import.image.dockerImageMetadata.Created\"></span>,\n" +
    "<span ng-if=\"import.image.dockerImageMetadata.Size\">{{import.image.dockerImageMetadata.Size | humanizeSize}},</span>\n" +
    "<translate>{{import.image.dockerImageLayers.length}} layers</translate>\n" +
    "</small>\n" +
    "</h2>\n" +
    "<ul>\n" +
    "<li ng-if=\"!import.namespace\" translate>Image Stream <strong>{{app.name || \"&lt;name&gt;\"}}:{{import.tag || 'latest'}}</strong> will track this image.</li>\n" +
    "<li translate>This image will be deployed in Deployment Config <strong>{{app.name || \"&lt;name&gt;\"}}</strong>.</li>\n" +
    "<li ng-if=\"ports.length\">\n" +
    "<span ng-if=\"ports.length === 1\" translate>Port</span>\n" +
    "<span ng-if=\"ports.length > 1\" translate>Ports</span>\n" +
    "<span ng-repeat=\"port in ports\">\n" +
    "<span ng-if=\"!$first && $last\" translate>and</span>\n" +
    "{{port.containerPort}}/{{port.protocol}}<span ng-if=\"!$last && ports.length > 2\">,</span>\n" +
    "</span>\n" +
    "<translate>will be load balanced by Service <strong>{{app.name || \"&lt;name&gt;\"}}</strong>.</translate>\n" +
    "<div translate>Other containers can access this service through the hostname <strong>{{app.name || \"&lt;name&gt;\"}}</strong>.</div>\n" +
    "</li>\n" +
    "</ul>\n" +
    "<div ng-if=\"(volumes | hashSize) > 0\" class=\"help-block\">\n" +
    "<translate>This image declares volumes and will default to use non-persistent, host-local storage.</translate>\n" +
    "<translate>You can add persistent storage later to the deployment config.</translate>\n" +
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
    "<div class=\"help-block\" translate>Identifies the resources created for this image.</div>\n" +
    "<div class=\"has-error\" ng-show=\"form.name.$invalid\">\n" +
    "<div class=\"help-block\" ng-show=\"form.name.$error.required\" translate>\n" +
    "A name is required.\n" +
    "</div>\n" +
    "<div class=\"help-block\" ng-show=\"form.name.$error.pattern\">\n" +
    "<translate>Name must be an alphanumeric (a-z, 0-9) string with a maximum length of 24 characters where the first character is a letter (a-z).</translate>\n" +
    "<translate>The '-' character is allowed anywhere except the first or last character.</translate>\n" +
    "</div>\n" +
    "<div class=\"help-block\" ng-show=\"form.name.$error.minlength\" translate>\n" +
    "Name must have at least 2 characters.\n" +
    "</div>\n" +
    "<div class=\"help-block\" ng-show=\"form.name.$error.maxlength\" translate>\n" +
    "Name can't have more than 24 characters.\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"has-error\" ng-show=\"nameTaken\">\n" +
    "<span class=\"help-block\" translate>This name is already in use within the project. Please choose a different name.</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "<osc-secrets model=\"pullSecrets\" namespace=\"project.metadata.name\" display-type=\"pull\" type=\"image\" secrets-by-type=\"secretsByType\" service-account-to-link=\"default\" alerts=\"alerts\" allow-multiple-secrets=\"true\">\n" +
    "</osc-secrets>\n" +
    "<osc-form-section header=\"{{'Environment Variables'|translate}}\" about-title=\"{{'Environment Variables'|translate}}\" about=\"{{'Environment variables are used to configure and pass information to running containers.'|translate}}\" expand=\"true\" can-toggle=\"false\" class=\"first-section\">\n" +
    "<key-value-editor entries=\"env\" key-placeholder=\"{{'Name'|translate}}\" key-validator=\"[A-Za-z_][A-Za-z0-9_]*\" key-validator-error=\"{{'A valid environment variable name is an alphanumeric (a-z and 0-9) string beginning with a letter that may contain underscores.'|translate}}\" value-placeholder=\"{{'Value'|translate}}\" value-from-selector-options=\"valueFromObjects\" add-row-link=\"{{'Add Environment Variable'|translate}}\" add-row-with-selectors-link=\"{{'Add Environment Variable Using a Config Map or Secret'|translate}}\"></key-value-editor>\n" +
    "</osc-form-section>\n" +
    "<label-editor labels=\"labels\" system-labels=\"systemLabels\" expand=\"true\" can-toggle=\"false\" help-text=\"{{'Each label is applied to each created resource.'|translate}}\">\n" +
    "</label-editor>\n" +
    "<alerts alerts=\"alerts\"></alerts>\n" +
    "<div ng-if=\"!isDialog\" class=\"button-group gutter-bottom\" ng-class=\"{'gutter-top': !alerts.length}\">\n" +
    "<button type=\"submit\" class=\"btn btn-primary btn-lg\" ng-click=\"create()\" value=\"\" ng-disabled=\"form.$invalid || nameTaken || disableInputs\" translate>Create</button>\n" +
    "<a class=\"btn btn-default btn-lg\" href=\"#\" back translate>Cancel</a>\n" +
    "</div>\n" +
    "</form>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"!loading && import.error\" class=\"empty-state-message text-center\">\n" +
    "<h2>\n" +
    "<i class=\"pficon pficon-error-circle-o\" aria-hidden=\"true\"></i>\n" +
    "<translate>Could not load image metadata.</translate>\n" +
    "</h2>\n" +
    "<p>{{import.error | upperFirst}}</p>\n" +
    "</div>\n" +
    "<div ng-if=\"!loading && import && !import.error && !import.image\" class=\"empty-state-message text-center\">\n" +
    "<h2 translate>\n" +
    "No image metadata found.\n" +
    "</h2>\n" +
    "<p translate>Could not find any images for {{import.name | stripTag}}:{{import.tag}}.</p>\n" +
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
    "<span class=\"sr-only\" translate>Scale down</span>\n" +
    "</a>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div row ng-if=\"hpa.length\" class=\"scaling-details\">\n" +
    "<div>\n" +
    "<translate>Autoscaled:</translate>\n" +
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
    "<translate><a ng-href=\"project/{{rc.metadata.namespace}}/quota\">Quota</a> limit reached.</translate>\n" +
    "</div>\n" +
    "<div class=\"scaling-details\" ng-if=\"showQuotaWarning\">\n" +
    "<translate>Scaling may be affected.</translate>\n" +
    "<a ng-if=\"rc.kind !== 'StatefulSet'\" ng-href=\"{{rc | navigateResourceURL}}?tab=events\" class=\"check-events\" translate>Check events</a>\n" +
    "<a ng-if=\"rc.kind === 'StatefulSet'\" ng-href=\"project/{{rc.metadata.namespace}}/browse/events\" class=\"check-events\" translate>Check events</a>\n" +
    "</div>\n" +
    "<div class=\"scaling-details\" ng-if=\"isIdled && (!getDesiredReplicas())\">\n" +
    "<div ng-if=\"(!resuming)\">\n" +
    "<span translate>Idled due to inactivity.</span>\n" +
    "<a href=\"\" ng-click=\"unIdle()\" translate>Start {{(deploymentConfig || rc) | unidleTargetReplicas : hpa}} pod{{ ((deploymentConfig || rc) | unidleTargetReplicas : hpa) > 1 ? 's' : ''}}</a>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/directives/deployment-metrics.html',
    "<div class=\"metrics\">\n" +
    "<div ng-if=\"!metricsError\" class=\"metrics-options\">\n" +
    "<div class=\"pull-right learn-more-block hidden-xs\">\n" +
    "<a href=\"\" ng-click=\"showComputeUnitsHelp()\" translate>About Compute Resources</a>\n" +
    "</div>\n" +
    "<div ng-if=\"containers.length\" class=\"form-group\">\n" +
    "<label for=\"selectContainer\" translate>Container:</label>\n" +
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
    "<label for=\"timeRange\" translate>Time Range:</label>\n" +
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
    "<div ng-if=\"loaded && noData && !metricsError\" class=\"mar-top-md\" translate>\n" +
    "No metrics to display.\n" +
    "</div>\n" +
    "<div ng-if=\"metricsError\" class=\"empty-state-message text-center\">\n" +
    "<h2>\n" +
    "<span class=\"pficon pficon-error-circle-o\" aria-hidden=\"true\"></span>\n" +
    "<translate>Metrics are not available.</translate>\n" +
    "</h2>\n" +
    "<p translate>\n" +
    "An error occurred getting metrics<span ng-if=\"options.selectedContainer.name\"> for container {{options.selectedContainer.name}}</span><span ng-if=\"metricsURL\"> from <a ng-href=\"{{metricsURL}}\">{{metricsURL}}</a></span>.\n" +
    "</p>\n" +
    "<p class=\"text-muted\">\n" +
    "{{metricsError.details}}\n" +
    "</p>\n" +
    "</div>\n" +
    "<div ng-repeat=\"metric in metrics\" ng-show=\"!noData && !metricsError\" class=\"metrics-full\">\n" +
    "<h2 class=\"metric-label\">\n" +
    "{{metric.label}}\n" +
    "<small ng-if=\"showAverage\" translate>\n" +
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
    "<label for=\"config-map-name\" class=\"required\" translate>Name</label>\n" +
    "\n" +
    "<div ng-class=\"{ 'has-error': configMapForm.name.$invalid && configMapForm.name.$touched }\">\n" +
    "<input id=\"config-map-name\" class=\"form-control\" type=\"text\" name=\"name\" ng-model=\"configMap.metadata.name\" ng-required=\"showNameInput\" ng-pattern=\"nameValidation.pattern\" ng-maxlength=\"nameValidation.maxlength\" placeholder=\"my-config-map\" select-on-focus autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\" aria-describedby=\"config-map-name-help\">\n" +
    "</div>\n" +
    "<div>\n" +
    "<span id=\"config-map-name-help\" class=\"help-block\" translate>A unique name for the config map within the project.</span>\n" +
    "</div>\n" +
    "<div class=\"has-error\" ng-show=\"configMapForm.name.$error.pattern && configMapForm.name.$touched\">\n" +
    "<span class=\"help-block\">\n" +
    "{{nameValidation.description}}\n" +
    "</span>\n" +
    "</div>\n" +
    "<div class=\"has-error\" ng-show=\"configMapForm.name.$error.required && configMapForm.name.$touched\">\n" +
    "<span class=\"help-block\" translate>\n" +
    "Name is required.\n" +
    "</span>\n" +
    "</div>\n" +
    "<div class=\"has-error\" ng-show=\"configMapForm.name.$error.maxlength\">\n" +
    "<span class=\"help-block\" translate>\n" +
    "Can't be longer than {{nameValidation.maxlength}} characters.\n" +
    "</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"!data.length\">\n" +
    "<p><em translate>The config map has no items.</em></p>\n" +
    "<a href=\"\" ng-click=\"addItem()\" translate>Add Item</a>\n" +
    "</div>\n" +
    "<div ng-repeat=\"item in data\" ng-init=\"keys = getKeys()\">\n" +
    "<div class=\"form-group\">\n" +
    "<label ng-attr-for=\"key-{{$id}}\" class=\"required\" translate>Key</label>\n" +
    "\n" +
    "<div ng-class=\"{ 'has-error': configMapForm['key-' + $id].$invalid && configMapForm['key-' + $id].$touched }\">\n" +
    "<input class=\"form-control\" name=\"key-{{$id}}\" ng-attr-id=\"key-{{$id}}\" type=\"text\" ng-model=\"item.key\" required ng-pattern=\"/^[-._a-zA-Z0-9]+$/\" ng-maxlength=\"253\" osc-unique=\"keys\" placeholder=\"my.key\" select-on-focus autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\" aria-describedby=\"key-{{$id}}-help\">\n" +
    "</div>\n" +
    "<div class=\"help-block\" translate>\n" +
    "A unique key for this config map entry.\n" +
    "</div>\n" +
    "<div class=\"has-error\" ng-show=\"configMapForm['key-' + $id].$error.required && configMapForm['key-' + $id].$touched\">\n" +
    "<span class=\"help-block\" translate>\n" +
    "Key is required.\n" +
    "</span>\n" +
    "</div>\n" +
    "<div class=\"has-error\" ng-show=\"configMapForm['key-' + $id].$error.oscUnique && configMapForm['key-' + $id].$touched\">\n" +
    "<span class=\"help-block\" translate>\n" +
    "Duplicate key \"{{item.key}}\". Keys must be unique within the config map.\n" +
    "</span>\n" +
    "</div>\n" +
    "<div class=\"has-error\" ng-show=\"configMapForm['key-' + $id].$error.pattern && configMapForm['key-' + $id].$touched\">\n" +
    "<span class=\"help-block\" translate>\n" +
    "Config map keys may only consist of letters, numbers, periods, hyphens, and underscores.\n" +
    "</span>\n" +
    "</div>\n" +
    "<div class=\"has-error\" ng-show=\"configMapForm['key-' + $id].$error.maxlength\">\n" +
    "<span class=\"help-block\" translate>\n" +
    "Config map keys may not be longer than 253 characters.\n" +
    "</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"form-group\" ng-attr-id=\"drop-zone-{{$id}}\">\n" +
    "<label ng-attr-for=\"name-{{$id}}\" translate>Value</label>\n" +
    "<osc-file-input model=\"item.value\" drop-zone-id=\"drop-zone-{{$id}}\" help-text=\"{{'Enter a value for the config map entry or use the contents of a file.'|translate}}\"></osc-file-input>\n" +
    "<div ui-ace=\"{\n" +
    "          theme: 'eclipse',\n" +
    "          rendererOptions: {\n" +
    "            showPrintMargin: false\n" +
    "          }\n" +
    "        }\" ng-model=\"item.value\" class=\"ace-bordered ace-inline-small mar-top-sm\" ng-attr-id=\"value-{{$id}}\"></div>\n" +
    "</div>\n" +
    "<div class=\"mar-bottom-md\">\n" +
    "<a href=\"\" ng-click=\"removeItem($index)\" translate>Remove Item</a>\n" +
    "<span ng-if=\"$last\">\n" +
    "<span class=\"action-divider\">|</span>\n" +
    "<a href=\"\" ng-click=\"addItem()\" translate>Add Item</a>\n" +
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
    "<div class=\"help-block\" ng-switch-when=\"pre\" translate>Pre hooks execute before the deployment begins.</div>\n" +
    "<div class=\"help-block\" ng-switch-when=\"mid\" translate>Mid hooks execute after the previous deployment is scaled down to zero and before the first pod of the new deployment is created.</div>\n" +
    "<div class=\"help-block\" ng-switch-when=\"post\" translate>Post hooks execute after the deployment strategy completes.</div>\n" +
    "</div>\n" +
    "<div class=\"gutter-top\" ng-if=\"hookParams\">\n" +
    "<fieldset ng-disabled=\"view.isDisabled\">\n" +
    "<div class=\"form-group\">\n" +
    "<label for=\"actionType\" class=\"required\" translate>Lifecycle Action</label><br/>\n" +
    "<label class=\"radio-inline\">\n" +
    "<input type=\"radio\" name=\"{{type}}-action-newpod\" ng-model=\"action.type\" value=\"execNewPod\" aria-describedby=\"action-help\" translate>\n" +
    "Run a specific command in a new pod\n" +
    "</label>\n" +
    "<label class=\"radio-inline\">\n" +
    "<input type=\"radio\" name=\"{{type}}-action-images\" ng-model=\"action.type\" value=\"tagImages\" aria-describedby=\"action-help\" translate>\n" +
    "Tag image if the deployment succeeds\n" +
    "</label>\n" +
    "<div id=\"action-help\" class=\"help-block\">\n" +
    "<span ng-if=\"action.type === 'execNewPod'\" translate>Runs a command in a new pod using the container from the deployment template. You can add additional environment variables and volumes.</span>\n" +
    "<span ng-if=\"action.type === 'tagImages'\" translate>Tags the current image as an image stream tag if the deployment succeeds.</span>\n" +
    "<a href=\"{{'new_pod_exec' | helpLink}}\" aria-hidden=\"true\" target=\"_blank\"><span class=\"learn-more-inline\"><translate>Learn More</translate>&nbsp;<i class=\"fa fa-external-link\"></i></span></a>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"action.type === 'execNewPod'\">\n" +
    "<div class=\"form-group\">\n" +
    "<label class=\"required\" translate>Container Name</label>\n" +
    "<ui-select ng-model=\"hookParams.execNewPod.containerName\" required>\n" +
    "<ui-select-match>{{$select.selected}}</ui-select-match>\n" +
    "<ui-select-choices repeat=\"container in (availableContainers | filter : $select.search)\" ng-disabled=\"view.isDisabled\">\n" +
    "<div ng-bind-html=\"container | highlight : $select.search\"></div>\n" +
    "</ui-select-choices>\n" +
    "</ui-select>\n" +
    "</div>\n" +
    "<div class=\"form-group\">\n" +
    "<label class=\"required\" translate>Command</label>\n" +
    "<edit-command args=\"hookParams.execNewPod.command\" is-required=\"true\"></edit-command>\n" +
    "</div>\n" +
    "<div class=\"form-group\">\n" +
    "<label translate>Environment Variables</label>\n" +
    "<key-value-editor entries=\"hookParams.execNewPod.env\" key-validator=\"[a-zA-Z_][a-zA-Z0-9_]*\" key-validator-error-tooltip=\"{{'A valid environment variable name is an alphanumeric (a-z and 0-9) string beginning with a letter that may contain underscores.'|translate}}\" value-from-selector-options=\"valueFromObjects\" add-row-with-selectors-link=\"Add Environment Variable Using a Config Map or Secret\" add-row-link=\"Add Environment Variable\"></key-value-editor>\n" +
    "<div class=\"help-block\" translate>\n" +
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
    "<div class=\"help-block\" translate>\n" +
    "List of named volumes to copy to the hook pod.\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"action.type === 'tagImages'\">\n" +
    "<div ng-repeat=\"tagImage in hookParams.tagImages\">\n" +
    "<div ng-if=\"hookParams.tagImages.length === 1\">\n" +
    "<div class=\"form-group\">\n" +
    "<label class=\"required\" translate>Container Name</label>\n" +
    "<ui-select ng-model=\"tagImage.containerName\" ng-disabled=\"view.isDisabled\" required>\n" +
    "<ui-select-match>{{$select.selected}}</ui-select-match>\n" +
    "<ui-select-choices repeat=\"container in (availableContainers | filter : $select.search)\">\n" +
    "<div ng-bind-html=\"container | highlight : $select.search\"></div>\n" +
    "</ui-select-choices>\n" +
    "</ui-select>\n" +
    "<div class=\"help-block\" translate>\n" +
    "Use the image for this container as the source of the tag.\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"form-group\">\n" +
    "<label class=\"required\" translate>Tag As</label>\n" +
    "<istag-select model=\"istagHook\" allow-custom-tag=\"true\" select-required=\"true\" select-disabled=\"view.isDisabled\"></istag-select>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"read-only-tag-image\" ng-if=\"hookParams.tagImages.length > 1\">\n" +
    "<p class=\"read-only-info\" ng-if=\"$first\">\n" +
    "<span class=\"pficon pficon-info\" aria-hidden=\"true\"></span>\n" +
    "<translate>More than one image tag is defined. To change image tags, use the YAML editor.</translate>\n" +
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
    "<div class=\"help-block\" ng-switch-when=\"Retry\" translate>Retry the hook until it succeeds.</div>\n" +
    "<div class=\"help-block\" ng-switch-when=\"Abort\" translate>Fail the deployment if the hook fails.</div>\n" +
    "<div class=\"help-block\" ng-switch-when=\"Ignore\" translate>Ignore hook failures and continue the deployment.</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</fieldset>\n" +
    "</div>\n" +
    "<span>\n" +
    "<a href=\"\" role=\"button\" ng-if=\"!hookParams\" ng-click=\"addHook()\" translate>Add {{type | upperFirst}} Lifecycle Hook</a>\n" +
    "<a href=\"\" role=\"button\" ng-if=\"hookParams\" ng-click=\"removeHook()\" translate>Remove {{type | upperFirst}} Lifecycle Hook</a>\n" +
    "</span>\n" +
    "</ng-form>"
  );


  $templateCache.put('views/directives/edit-webhook-triggers.html',
    "<div class=\"display-webhooks\">\n" +
    "<h5>{{type}} Webhooks\n" +
    "<span class=\"help action-inline\">\n" +
    "<span class=\"sr-only\">{{typeInfo}}</span>\n" +
    "<a href=\"\" aria-hidden=\"true\">\n" +
    "<i class=\"pficon pficon-help\" data-toggle=\"tooltip\" aria-hidden=\"true\" data-original-title=\"{{typeInfo}}\"></i>\n" +
    "</a>\n" +
    "</span>\n" +
    "</h5>\n" +
    "<div ng-repeat=\"trigger in triggers\">\n" +
    "<div class=\"trigger-info\">\n" +
    "<span class=\"trigger-url\">\n" +
    "<copy-to-clipboard is-disabled=\"trigger.disabled\" clipboard-text=\"bcName | webhookURL : trigger.data.type : trigger.data[type.toLowerCase()].secret : projectName\"></copy-to-clipboard>\n" +
    "</span>\n" +
    "<span class=\"visible-xs-inline trigger-actions\">\n" +
    "<a href=\"\" ng-if=\"!trigger.disabled\" class=\"action-icon\" ng-click=\"trigger.disabled = true; form.$setDirty()\" role=\"button\">\n" +
    "<span class=\"pficon pficon-close\" aria-hidden=\"true\" title=\"{{'Remove'|translate}}\"></span>\n" +
    "<span class=\"sr-only\" translate>Remove</span>\n" +
    "</a>\n" +
    "<a href=\"\" ng-if=\"trigger.disabled\" class=\"action-icon\" ng-click=\"trigger.disabled = false\" role=\"button\">\n" +
    "<span class=\"fa fa-repeat\" aria-hidden=\"true\" title=\"{{'Undo'|translate}}\"></span>\n" +
    "<span class=\"sr-only\" translate>Undo</span>\n" +
    "</a>\n" +
    "</span>\n" +
    "<span class=\"hidden-xs trigger-actions\">\n" +
    "<a href=\"\" role=\"button\" ng-if=\"!trigger.disabled\" ng-click=\"trigger.disabled = true; form.$setDirty()\" translate>Remove</a>\n" +
    "<a href=\"\" role=\"button\" ng-if=\"trigger.disabled\" ng-click=\"trigger.disabled = false\" translate>Undo</a>\n" +
    "</span>\n" +
    "</div>\n" +
    "</div>\n" +
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
    "<span class=\"events-sidebar-collapse\"><a href=\"\" class=\"fa fa-arrow-circle-o-right\" title=\"Collapse event sidebar\" ng-click=\"collapseSidebar()\"><span class=\"sr-only\" translate>Collapse event sidebar</span></a></span>\n" +
    "<translate>Events</translate>\n" +
    "<small ng-if=\"warningCount\" class=\"warning-count\">\n" +
    "<span class=\"pficon pficon-warning-triangle-o\"></span>\n" +
    "{{warningCount}}\n" +
    "<span class=\"hidden-xs hidden-sm\">\n" +
    "<span ng-if=\"warningCount === 1\" translate>warning</span>\n" +
    "<span ng-if=\"warningCount > 1\" translate>warnings</span>\n" +
    "</span>\n" +
    "</small>\n" +
    "</h2>\n" +
    "</div>\n" +
    "<div ng-if=\"events | hashSize\" class=\"event-details-link\">\n" +
    "<a ng-href=\"project/{{projectContext.projectName}}/browse/events\" translate>View Details</a>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"right-content\">\n" +
    "<ellipsis-pulser color=\"dark\" size=\"sm\" msg=\"Loading\" ng-if=\"!events\" class=\"events\"></ellipsis-pulser>\n" +
    "<div ng-if=\"events\" class=\"events\">\n" +
    "<div ng-if=\"!(events | hashSize)\" class=\"mar-left-xl\">\n" +
    "<em translate>No events.</em>\n" +
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
    "<translate>{{event.count}} times in the last</translate>\n" +
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
    "<div ng-if=\"!events\" translate>\n" +
    "Loading...\n" +
    "</div>\n" +
    "<div ng-if=\"events\" class=\"events\">\n" +
    "<div class=\"data-toolbar\">\n" +
    "<form role=\"form\" class=\"search-pf has-button\">\n" +
    "<div class=\"form-group filter-controls has-clear\">\n" +
    "<div class=\"search-pf-input-group\">\n" +
    "<label for=\"events-filter\" class=\"sr-only\" translate>Filter</label>\n" +
    "<input type=\"search\" placeholder=\"{{'Filter by keyword'|translate}}\" class=\"form-control\" id=\"events-filter\" ng-model=\"filter.text\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\">\n" +
    "<button type=\"button\" class=\"clear\" aria-hidden=\"true\" ng-if=\"filter.text\" ng-click=\"filter.text = ''\">\n" +
    "<span class=\"pficon pficon-close\"></span>\n" +
    "</button>\n" +
    "</div>\n" +
    "</div>\n" +
    "</form>\n" +
    "<div class=\"vertical-divider\"></div>\n" +
    "<div class=\"sort-group\">\n" +
    "<span class=\"sort-label\" translate>Sort by</span>\n" +
    "<div pf-sort config=\"sortConfig\" class=\"sort-controls\"></div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<table class=\"table table-bordered table-condensed table-mobile table-hover table-layout-fixed events-table\" ng-class=\"{ 'table-empty': (filteredEvents | hashSize) === 0 }\">\n" +
    "<thead>\n" +
    "<tr>\n" +
    "<th id=\"time\" translate>Time</th>\n" +
    "\n" +
    "<th id=\"kind-name\" ng-if=\"showKindAndName\">\n" +
    "<span class=\"hidden-xs-inline visible-sm-inline visible-md-inline hidden-lg-inline\" translate>Kind and Name</span>\n" +
    "<span class=\"visible-lg-inline\" translate>Name</span>\n" +
    "</th>\n" +
    "<th id=\"kind\" ng-if=\"showKindAndName\" class=\"hidden-sm hidden-md\">\n" +
    "<span class=\"visible-lg-inline\" translate>Kind</span>\n" +
    "</th>\n" +
    "<th id=\"severity\" class=\"hidden-xs hidden-sm hidden-md\"><span class=\"sr-only\" translate>Severity</span></th>\n" +
    "<th id=\"reason\" class=\"hidden-sm hidden-md\"><span class=\"visible-lg-inline\" translate>Reason</span></th>\n" +
    "<th id=\"message\"><span class=\"hidden-xs-inline visible-sm-inline visible-md-inline hidden-lg-inline\" translate>Reason and </span><translate>Message</translate></th>\n" +
    "</tr>\n" +
    "</thead>\n" +
    "<tbody ng-if=\"(filteredEvents | hashSize) === 0\">\n" +
    "<tr>\n" +
    "<td class=\"hidden-lg\" colspan=\"{{showKindAndName ? 3 : 2}}\">\n" +
    "<span ng-if=\"(events | hashSize) === 0\"><em translate>No events to show.</em></span>\n" +
    "<span ng-if=\"(events | hashSize) > 0\">\n" +
    "<translate>All events hidden by filter.</translate>\n" +
    "<a href=\"\" ng-click=\"filter.text = ''\" role=\"button\" translate>Clear Filter</a>\n" +
    "</span>\n" +
    "</td>\n" +
    "<td class=\"hidden-xs hidden-sm hidden-md\" colspan=\"{{showKindAndName ? 6 : 4}}\">\n" +
    "<span ng-if=\"(events | hashSize) === 0\"><em translate>No events to show.</em></span>\n" +
    "<span ng-if=\"(events | hashSize) > 0\">\n" +
    "<translate>All events hidden by filter.</translate>\n" +
    "<a href=\"\" ng-click=\"filter.text = ''\" role=\"button\" translate>Clear Filter</a>\n" +
    "</span>\n" +
    "</td>\n" +
    "</tr>\n" +
    "</tbody>\n" +
    "<tbody ng-if=\"(filteredEvents | hashSize) > 0\">\n" +
    "<tr ng-repeat=\"event in filteredEvents\">\n" +
    "<td data-title=\"Time\" class=\"nowrap\">{{event.lastTimestamp | date:'mediumTime'}}</td>\n" +
    "<td ng-if=\"showKindAndName\" data-title=\"Name\">\n" +
    "<div class=\"hidden-xs-block visible-sm-block visible-md-block hidden-lg-block\">\n" +
    "<span ng-bind-html=\"event.involvedObject.kind | humanizeKind : true | highlightKeywords : filterExpressions\"></span>\n" +
    "</div>\n" +
    "<span ng-init=\"resourceURL = (event.involvedObject.name | navigateResourceURL : event.involvedObject.kind : event.metadata.namespace : event.involvedObject.apiVersion)\">\n" +
    "<a ng-href=\"{{resourceURL}}\" ng-if=\"resourceURL\"><span ng-bind-html=\"event.involvedObject.name | highlightKeywords : filterExpressions\"></span></a>\n" +
    "<span ng-if=\"!resourceURL\" ng-bind-html=\"event.involvedObject.name | highlightKeywords : filterExpressions\"></span>\n" +
    "</span>\n" +
    "</td>\n" +
    "<td ng-if=\"showKindAndName\" class=\"hidden-sm hidden-md\" data-title=\"Kind\">\n" +
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
    "<translate>{{event.count}} times in the last</translate>\n" +
    "<duration-until-now timestamp=\"event.firstTimestamp\" omit-single=\"true\" precision=\"1\"></duration-until-now>\n" +
    "</div>\n" +
    "</td>\n" +
    "</tr>\n" +
    "</tbody>\n" +
    "</table>\n" +
    "</div>"
  );


  $templateCache.put('views/directives/from-file-dialog.html',
    "<overlay-panel show-panel=\"$ctrl.visible\" show-close=\"true\" handle-close=\"$ctrl.close\" ng-if=\"$ctrl.project\">\n" +
    "<div pf-wizard on-cancel=\"$ctrl.close()\" on-finish=\"$ctrl.close()\" hide-header=\"true\" hide-sidebar=\"true\" next-title=\"$ctrl.nextButtonTitle\" next-callback=\"$ctrl.nextCallback\" current-step=\"$ctrl.currentStep\" wizard-done=\"$ctrl.wizardDone\" step-class=\"order-service-wizard-step\">\n" +
    "<div pf-wizard-step step-title=\"JSON / YAML\" step-id=\"file\" step-priority=\"1\" substeps=\"false\" ok-to-nav-away=\"true\" allow-click-nav=\"false\" next-enabled=\"!$ctrl.importForm.$invalid\">\n" +
    "<div class=\"wizard-pf-main-inner-shadow-covers\">\n" +
    "<div class=\"order-service-config-single-column\">\n" +
    "<div class=\"wizard-pf-main-form-contents\">\n" +
    "<form name=\"$ctrl.importForm\">\n" +
    "<from-file is-dialog=\"true\" project=\"$ctrl.project\" context=\"$ctrl.context\"></from-file>\n" +
    "</form>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div pf-wizard-step wz-disabled=\"{{!$ctrl.template}}\" step-title=\"{{'Template Configuration'|translate}}\" step-id=\"template\" step-priority=\"2\" substeps=\"false\" ok-to-nav-away=\"true\" allow-click-nav=\"false\" next-enabled=\"!$ctrl.templateForm.$invalid\">\n" +
    "<div class=\"wizard-pf-main-inner-shadow-covers\" ng-if=\"$ctrl.template\">\n" +
    "<div class=\"order-service-details\">\n" +
    "<div class=\"order-service-details-top\">\n" +
    "<div class=\"service-icon\">\n" +
    "<span class=\"icon {{$ctrl.iconClass}}\"></span>\n" +
    "</div>\n" +
    "<div class=\"service-title-area\">\n" +
    "<div class=\"service-title\">\n" +
    "{{$ctrl.template | displayName}}\n" +
    "</div>\n" +
    "<div class=\"order-service-tags\">\n" +
    "<span ng-repeat=\"tag in $ctrl.template.metadata.annotations.tags.split(',')\" class=\"tag\">\n" +
    "{{tag}}\n" +
    "</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"order-service-description-block\">\n" +
    "<p ng-bind-html=\"$ctrl.template | description | linky : '_blank'\" class=\"description\"></p>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"order-service-config\">\n" +
    "<div class=\"wizard-pf-main-form-contents\">\n" +
    "<div class=\"osc-form\">\n" +
    "<alerts alerts=\"$ctrl.alerts\"></alerts>\n" +
    "<form name=\"$ctrl.templateForm\">\n" +
    "<process-template project=\"$ctrl.project\" template=\"$ctrl.template\" alerts=\"$ctrl.alerts\" is-dialog=\"true\"></process-template>\n" +
    "</form>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div pf-wizard-step step-title=\"Results\" step-id=\"results\" step-priority=\"3\" substeps=\"false\" ok-to-nav-away=\"true\" allow-click-nav=\"false\" prev-enabled=\"false\">\n" +
    "<div class=\"wizard-pf-main-inner-shadow-covers\">\n" +
    "<div class=\"order-service-config-single-column\">\n" +
    "<div class=\"wizard-pf-main-form-contents\">\n" +
    "\n" +
    "<next-steps ng-if=\"$ctrl.currentStep === 'Results'\" project=\"$ctrl.selectedProject\" project-name=\"$ctrl.selectedProject.metadata.name\" login-base-url=\"$ctrl.loginBaseUrl\" on-continue=\"$ctrl.close\">\n" +
    "</next-steps>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div> \n" +
    "</div> \n" +
    "</overlay-panel>"
  );


  $templateCache.put('views/directives/from-file.html',
    "<p>\n" +
    "<translate>Create or replace resources from their YAML or JSON definitions.</translate>\n" +
    "<translate>If adding a template, you'll have the option to process the template.</translate>\n" +
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
    "<div ng-if=\"!isDialog\" class=\"buttons gutter-bottom\">\n" +
    "<button type=\"submit\" ng-click=\"create()\" ng-disabled=\"editorErrorAnnotation || !editorContent\" class=\"btn btn-primary btn-lg\" translate>\n" +
    "Create\n" +
    "</button>\n" +
    "<a class=\"btn btn-default btn-lg\" href=\"\" role=\"button\" ng-click=\"cancel()\" translate>\n" +
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
    "<li ng-if=\"launcherApps.length > 0\" pf-application-launcher items=\"launcherApps\" is-list=\"true\"></li>\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "<li uib-dropdown ng-cloak ng-if=\"user\">\n" +
    "<a href=\"\" uib-dropdown-toggle id=\"user-dropdown\" class=\"nav-item-iconic\">\n" +
    "<span class=\"pf-icon pficon-user\" aria-hidden=\"true\"></span>\n" +
    "<span class=\"username truncate\">{{user.fullName || user.metadata.name}}</span> <span class=\"caret\" aria-hidden=\"true\"></span>\n" +
    "</a>\n" +
    "<ul class=\"uib-dropdown-menu\" aria-labelledby=\"user-dropdown\" extension-point extension-name=\"nav-user-dropdown\" extension-types=\"dom html\"></ul>\n" +
    "</li>\n" +
    "</ul>"
  );


  $templateCache.put('views/directives/header/_tech-preview-banner.html',
    "<translate>Technology preview is enabled</translate>"
  );


  $templateCache.put('views/directives/header/default-header.html',
    "<ng-include ng-if=\"globalTechPreviewIndicator\" src=\"'views/directives/header/_tech-preview-banner.html'\" class=\"tech-preview-banner\"></ng-include>\n" +
    "<nav class=\"navbar navbar-pf-alt\" role=\"navigation\">\n" +
    "<div row>\n" +
    "<div class=\"navbar-header\">\n" +
    "\n" +
    "<div row class=\"navbar-flex-btn toggle-menu\">\n" +
    "<button type=\"button\" class=\"navbar-toggle project-action-btn ng-isolate-scope\" data-toggle=\"collapse\" data-target=\".navbar-collapse-2\">\n" +
    "<span class=\"sr-only\" translate>Toggle navigation</span>\n" +
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
    "<ng-include ng-if=\"globalTechPreviewIndicator\" src=\"'views/directives/header/_tech-preview-banner.html'\" class=\"tech-preview-banner\"></ng-include>\n" +
    "<nav class=\"navbar navbar-pf-alt\" role=\"navigation\">\n" +
    "<div class=\"navbar-header hidden-xs\">\n" +
    "<a class=\"navbar-home\" href=\"./\"><span class=\"fa-fw pficon pficon-home\" aria-hidden=\"true\"></span>\n" +
    "<span class=\"visible-xlg-inline-block\">\n" +
    "<span ng-if=\"'service_catalog_landing_page' | enableTechPreviewFeature\" translate>\n" +
    "Home\n" +
    "</span>\n" +
    "<span ng-if=\"!('service_catalog_landing_page' | enableTechPreviewFeature)\" translate>\n" +
    "Projects\n" +
    "</span>\n" +
    "</span></a>\n" +
    "</div>\n" +
    "<div class=\"nav navbar-project-menu\">\n" +
    "\n" +
    "<div row class=\"navbar-flex-btn toggle-menu\">\n" +
    "<button type=\"button\" class=\"navbar-toggle project-action-btn ng-isolate-scope\" data-toggle=\"collapse\" data-target=\".navbar-collapse-1\">\n" +
    "<span class=\"sr-only\" translate>Toggle navigation</span>\n" +
    "<span class=\"icon-bar\"></span>\n" +
    "<span class=\"icon-bar\"></span>\n" +
    "<span class=\"icon-bar\"></span>\n" +
    "</button>\n" +
    "</div>\n" +
    "<div class=\"form-group\">\n" +
    "\n" +
    "<select class=\"selectpicker form-control\" data-selected-text-format=\"count>3\" id=\"boostrapSelect\" title=\"\"></select>\n" +
    "</div>\n" +
    "\n" +
    "<div row class=\"dropdown navbar-flex-btn\" ng-if=\"project.metadata.name | canIAddToProject\" uib-dropdown>\n" +
    "<a row class=\"nav-item-iconic dropdown-toggle add-to-project-btn\" href=\"\" ng-disabled=\"project.status.phase != 'Active'\" title=\"{{'Add to Project'|translate}}\" uib-dropdown-toggle>\n" +
    "<i class=\"fa fa-plus visible-xs-inline-block\" aria-hidden=\"true\" title=\"{{'Add to Project'|translate}}\"></i><span class=\"hidden-xs add-to-project\" translate>Add to Project</span><span class=\"hidden-xs caret\" aria-hidden=\"true\" title=\"{{'Add to Project'|translate}}\"></span>\n" +
    "</a>\n" +
    "<ul role=\"menu\" class=\"uib-dropdown-menu dropdown-menu dropdown-menu-right\">\n" +
    "<li ng-if-start=\"!catalogLandingPageEnabled\" role=\"menuitem\"><a ng-href=\"project/{{projectName}}/create?tab=fromCatalog\" translate>Browse Catalog</a></li>\n" +
    "<li role=\"menuitem\"><a ng-href=\"project/{{projectName}}/create?tab=deployImage\" translate>Deploy Image</a></li>\n" +
    "<li ng-if-end role=\"menuitem\"><a ng-href=\"project/{{projectName}}/create?tab=fromFile\" translate>Import YAML / JSON</a></li>\n" +
    "<li ng-if-start=\"catalogLandingPageEnabled\" role=\"menuitem\"><a href=\"/\" translate>Browse Catalog</a></li>\n" +
    "<li role=\"menuitem\"><a href=\"\" ng-click=\"showOrderingPanel('deployImage')\" translate>Deploy Image</a></li>\n" +
    "<li ng-if-end role=\"menuitem\"><a href=\"\" ng-click=\"showOrderingPanel('fromFile')\" translate>Import YAML / JSON</a></li>\n" +
    "</ul>\n" +
    "</div>\n" +
    "<div row extension-point extension-name=\"nav-system-status-mobile\" extension-types=\"dom\" class=\"navbar-flex-btn hide-if-empty\"></div>\n" +
    "</div> \n" +
    "<navbar-utility class=\"hidden-xs\"></navbar-utility>\n" +
    "</nav>\n" +
    "<deploy-image-dialog visible=\"ordering.panelName === 'deployImage'\" project=\"project\" context=\"context\" on-dialog-closed=\"closeOrderingPanel\"></deploy-image-dialog>\n" +
    "<from-file-dialog visible=\"ordering.panelName === 'fromFile'\" project=\"project\" context=\"context\" on-dialog-closed=\"closeOrderingPanel\"></from-file-dialog>"
  );


  $templateCache.put('views/directives/hpa.html',
    "<h4>\n" +
    "{{hpa.metadata.name}}\n" +
    "\n" +
    "<span ng-if=\"'horizontalPodAutoscalers' | canIDoAny\" class=\"header-actions\">\n" +
    "<a ng-if=\"{resource: 'horizontalpodautoscalers', group: 'autoscaling'} | canI : 'update'\" ng-href=\"project/{{hpa.metadata.namespace}}/edit/autoscaler?kind=HorizontalPodAutoscaler&group=autoscaling&name={{hpa.metadata.name}}\" role=\"button\">Edit</a>\n" +
    "<span class=\"action-divider\">|</span>\n" +
    "<delete-link ng-if=\"{resource: 'horizontalpodautoscalers', group: 'autoscaling'} | canI : 'delete'\" kind=\"HorizontalPodAutoscaler\" group=\"autoscaling\" resource-name=\"{{hpa.metadata.name}}\" project-name=\"{{hpa.metadata.namespace}}\" label=\"Remove\" alerts=\"alerts\" stay-on-current-page=\"true\" translate>Delete\n" +
    "</delete-link>\n" +
    "</span>\n" +
    "</h4>\n" +
    "<dl class=\"dl-horizontal left\" style=\"margin-bottom: 10px\">\n" +
    "<dt ng-if-start=\"showScaleTarget && hpa.spec.scaleTargetRef.kind && hpa.spec.scaleTargetRef.name\">{{hpa.spec.scaleTargetRef.kind | humanizeKind : true}}:</dt>\n" +
    "<dd ng-if-end>\n" +
    "<a ng-href=\"{{hpa.spec.scaleTargetRef.name | navigateResourceURL : hpa.spec.scaleTargetRef.kind : hpa.metadata.namespace}}\">{{hpa.spec.scaleTargetRef.name}}</a>\n" +
    "</dd>\n" +
    "<dt translate>Min Pods:</dt>\n" +
    "<dd>{{hpa.spec.minReplicas || 1}}</dd>\n" +
    "<dt translate>Max Pods:</dt>\n" +
    "<dd>{{hpa.spec.maxReplicas}}</dd>\n" +
    "<dt ng-if-start=\"hpa.spec.targetCPUUtilizationPercentage\">\n" +
    "CPU\n" +
    "<span ng-if=\"'cpu' | isRequestCalculated : project\" translate>Limit</span>\n" +
    "<span ng-if=\"!('cpu' | isRequestCalculated : project)\" translate>Request</span>\n" +
    "<translate>Target</translate>:\n" +
    "</dt>\n" +
    "<dd ng-if-end>{{hpa.spec.targetCPUUtilizationPercentage | hpaCPUPercent : project}}%</dd>\n" +
    "<dt translate>\n" +
    "Current Usage:\n" +
    "</dt>\n" +
    "<dd ng-if=\"hpa.status.currentCPUUtilizationPercentage | isNil\">\n" +
    "<em translate>Not available</em>\n" +
    "</dd>\n" +
    "<dd ng-if=\"!(hpa.status.currentCPUUtilizationPercentage | isNil)\">\n" +
    "{{hpa.status.currentCPUUtilizationPercentage | hpaCPUPercent : project}}%\n" +
    "</dd>\n" +
    "<dt ng-if-start=\"hpa.status.lastScaleTime\" translate>Last Scaled:</dt>\n" +
    "<dd ng-if-end><span am-time-ago=\"hpa.status.lastScaleTime\"></span></dd>\n" +
    "</dl>"
  );


  $templateCache.put('views/directives/istag-select.html',
    "<ng-form name=\"istagForm\">\n" +
    "<fieldset ng-disabled=\"selectDisabled\">\n" +
    "<div class=\"row\">\n" +
    "<div class=\"form-group col-sm-4\">\n" +
    "<label class=\"sr-only\" translate>Namespace</label>\n" +
    "<ui-select ng-required=\"selectRequired\" ng-model=\"istag.namespace\" ng-disabled=\"selectDisabled\" ng-change=\"istag.imageStream = null; istag.tagObject = null;\">\n" +
    "<ui-select-match placeholder=\"{{'Namespace'|translate}}\">{{$select.selected}}</ui-select-match>\n" +
    "<ui-select-choices repeat=\"namespace in (namespaces | filter : $select.search)\">\n" +
    "<div ng-bind-html=\"namespace | highlight : $select.search\"></div>\n" +
    "</ui-select-choices>\n" +
    "</ui-select>\n" +
    "<div class=\"istag-separator\">/</div>\n" +
    "</div>\n" +
    "<div class=\"form-group col-sm-4\">\n" +
    "<label class=\"sr-only\" translate>Image Stream</label>\n" +
    "<ui-select ng-required=\"selectRequired\" ng-model=\"istag.imageStream\" ng-disabled=\"!istag.namespace || selectDisabled\" ng-change=\"istag.tagObject = null\">\n" +
    "<ui-select-match placeholder=\"{{'Image Stream'|translate}}\">{{$select.selected}}</ui-select-match>\n" +
    "<ui-select-choices repeat=\"imageStream in (isNamesByNamespace[istag.namespace] | filter : $select.search)\">\n" +
    "<div ng-bind-html=\"imageStream | highlight : $select.search\"></div>\n" +
    "</ui-select-choices>\n" +
    "</ui-select>\n" +
    "<div class=\"istag-separator\">:</div>\n" +
    "</div>\n" +
    "<div class=\"form-group col-sm-4\">\n" +
    "<label class=\"sr-only\" translate>Tag</label>\n" +
    "<ui-select ng-required=\"selectRequired\" ng-model=\"istag.tagObject\" ng-disabled=\"!istag.imageStream || selectDisabled\">\n" +
    "<ui-select-match placeholder=\"{{'Tag'|translate}}\">{{$select.selected.tag}}</ui-select-match>\n" +
    "<ui-select-choices group-by=\"groupTags\" repeat=\"statusTag in (isByNamespace[istag.namespace][istag.imageStream].status.tags | filter : { tag: $select.search })\" refresh=\"getTags($select.search)\" refresh-delay=\"200\">\n" +
    "<div ng-bind-html=\"statusTag.tag | highlight : $select.search\"></div>\n" +
    "</ui-select-choices>\n" +
    "</ui-select>\n" +
    "</div>\n" +
    "</div>\n" +
    "</fieldset>\n" +
    "</ng-form>"
  );


  $templateCache.put('views/directives/key-value-editor.html',
    "<ng-form name=\"forms.keyValueEditor\" novalidate ng-if=\"entries\">\n" +
    "<div class=\"key-value-editor\" ng-model=\"entries\" as-sortable=\"dragControlListeners\">\n" +
    "<div ng-if=\"showHeader\" class=\"key-value-editor-entry\">\n" +
    "<div class=\"form-group key-value-editor-header key-header\">\n" +
    "<div class=\"input-group\">\n" +
    "<span class=\"help-block\">{{keyPlaceholder}}</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"form-group key-value-editor-header value-header\">\n" +
    "<div class=\"input-group\">\n" +
    "<span class=\"help-block\">{{valuePlaceholder}}</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"key-value-editor-entry\" ng-class-odd=\"'odd'\" ng-class-even=\"'even'\" ng-repeat=\"entry in entries\" as-sortable-item>\n" +
    "\n" +
    "<div class=\"form-group key-value-editor-input\" ng-class=\"{ 'has-error' :  (forms.keyValueEditor[uniqueForKey(unique, $index)].$invalid) }\">\n" +
    "<label for=\"uniqueForKey(unique, $index)\" class=\"sr-only\">{{keyPlaceholder}}</label>\n" +
    "<input type=\"text\" class=\"form-control\" ng-class=\"{ '{{setFocusKeyClass}}' : $last  }\" id=\"{{uniqueForKey(unique, $index)}}\" name=\"{{uniqueForKey(unique, $index)}}\" ng-attr-placeholder=\"{{ (!isReadonlyAny) && keyPlaceholder || ''}}\" ng-minlength=\"{{keyMinlength}}\" maxlength=\"{{keyMaxlength}}\" ng-model=\"entry.name\" ng-readonly=\"isReadonlyAny || isReadonlySome(entry.name) || entry.isReadonlyKey || entry.isReadonly\" ng-pattern=\"validation.key\" ng-value ng-required=\"!allowEmptyKeys && entry.value\" ng-attr-key-value-editor-focus=\"{{grabFocus && $last}}\">\n" +
    "\n" +
    "<span class=\"help-block key-validation-error\" ng-show=\"(forms.keyValueEditor[uniqueForKey(unique, $index)].$error.pattern)\">\n" +
    "<span class=\"validation-text\">{{ entry.keyValidatorError || keyValidatorError }}</span>\n" +
    "<span ng-if=\"entry.keyValidatorErrorTooltip || keyValidatorErrorTooltip\" class=\"help action-inline\">\n" +
    "<a aria-hidden=\"true\" data-toggle=\"tooltip\" data-placement=\"top\" data-original-title=\"{{entry.keyValidatorErrorTooltip || keyValidatorErrorTooltip}}\">\n" +
    "<i class=\"{{entry.keyValidatorErrorTooltipIcon || keyValidatorErrorTooltipIcon}}\"></i>\n" +
    "</a>\n" +
    "</span>\n" +
    "</span>\n" +
    "<span class=\"help-block key-min-length\" ng-show=\"(forms.keyValueEditor[uniqueForKey(unique, $index)].$error.minlength)\">\n" +
    "<span class=\"validation-text\">Minimum character count is {{keyMinlength}}</span>\n" +
    "</span>\n" +
    "<span class=\"help-block key-validation-error\" ng-show=\"(forms.keyValueEditor[uniqueForKey(unique, $index)].$error.required)\">\n" +
    "<span class=\"validation-text\">{{keyRequiredError}}</span>\n" +
    "</span>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"form-group key-value-editor-input\" ng-class=\"forms.keyValueEditor[uniqueForValue(unique, $index)].$invalid ? 'has-error' : ''\">\n" +
    "<label for=\"uniqueForValue(unique, $index)\" class=\"sr-only\">{{valuePlaceholder}}</label>\n" +
    "<div ng-if=\"(!entry.valueFrom)\">\n" +
    "<input type=\"text\" class=\"form-control\" ng-class=\"{ '{{setFocusValClass}}' : $last  }\" id=\"{{uniqueForValue(unique, $index)}}\" name=\"{{uniqueForValue(unique, $index)}}\" ng-attr-placeholder=\"{{ (!isReadonlyAny) && valuePlaceholder || ''}}\" ng-minlength=\"{{valueMinlength}}\" maxlength=\"{{valueMaxlength}}\" ng-model=\"entry.value\" ng-readonly=\"isReadonlyAny || isReadonlySome(entry.name) || entry.isReadonly\" ng-pattern=\"validation.val\" ng-required=\"!allowEmptyKeys && entry.value\">\n" +
    "</div>\n" +
    "<div ng-if=\"entry.valueFrom\">\n" +
    "<div ng-if=\"isValueFromReadonly(entry)\" class=\"faux-input-group\">\n" +
    "<span class=\"faux-form-control-addon {{entry.valueIcon}}\" aria-hidden=\"true\" data-toggle=\"tooltip\" data-placement=\"top\" data-original-title=\"{{entry.valueIconTooltip || valueIconTooltip}}\"></span>\n" +
    "<div class=\"faux-form-control readonly\">\n" +
    "<span ng-switch=\"entry.refType\">\n" +
    "<span ng-switch-when=\"configMapKeyRef\">\n" +
    "<translate>Set to the key {{entry.valueFrom.configMapKeyRef.key}} in config map</translate>\n" +
    "<span ng-if=\"!('configmaps' | canI : 'get')\">\n" +
    "{{entry.valueFrom.configMapKeyRef.name}}\n" +
    "</span>\n" +
    "<a ng-if=\"'configmaps' | canI : 'get'\" ng-href=\"{{entry.apiObj | navigateResourceURL}}\">\n" +
    "{{entry.valueFrom.configMapKeyRef.name}}\n" +
    "</a>\n" +
    "</span>\n" +
    "<span ng-switch-when=\"secretKeyRef\">\n" +
    "<translate>Set to the key {{entry.valueFrom.secretKeyRef.key}} in secret</translate>\n" +
    "<span ng-if=\"!('secrets' | canI : 'get')\">\n" +
    "{{entry.valueFrom.secretKeyRef.name}}\n" +
    "</span>\n" +
    "<a ng-if=\"'secrets' | canI : 'get'\" ng-href=\"{{entry.apiObj | navigateResourceURL}}\">\n" +
    "{{entry.valueFrom.secretKeyRef.name}}\n" +
    "</a>\n" +
    "</span>\n" +
    "<span ng-switch-when=\"fieldRef\">\n" +
    "{{entry.valueAlt}}\n" +
    "</span>\n" +
    "<span ng-switch-default>\n" +
    "{{entry.valueAlt}}\n" +
    "</span>\n" +
    "</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"!isValueFromReadonly(entry)\">\n" +
    "<div class=\"ui-select\">\n" +
    "<ui-select ng-model=\"entry.selectedValueFrom\" ng-required=\"true\" on-select=\"valueFromObjectSelected(entry, $select.selected)\">\n" +
    "<ui-select-match placeholder=\"{{'Select a resource'|translate}}\">\n" +
    "<span>\n" +
    "{{$select.selected.metadata.name}}\n" +
    "<small class=\"text-muted\">&ndash; {{$select.selected.kind | humanizeKind : true}}</small>\n" +
    "</span>\n" +
    "</ui-select-match>\n" +
    "<ui-select-choices repeat=\"source in valueFromSelectorOptions | filter : { metadata: { name: $select.search } } track by (source | uid)\" group-by=\"groupByKind\">\n" +
    "<span ng-bind-html=\"source.metadata.name | highlight : $select.search\"></span>\n" +
    "</ui-select-choices>\n" +
    "</ui-select>\n" +
    "</div>\n" +
    "<div class=\"ui-select\">\n" +
    "<ui-select ng-model=\"entry.selectedValueFromKey\" ng-required=\"true\" on-select=\"valueFromKeySelected(entry, $select.selected)\">\n" +
    "<ui-select-match placeholder=\"{{'Select key'|translate}}\">\n" +
    "{{$select.selected}}\n" +
    "</ui-select-match>\n" +
    "<ui-select-choices repeat=\"key in entry.selectedValueFrom.data | keys\">\n" +
    "<span ng-bind-html=\"key | highlight : $select.search\"></span>\n" +
    "</ui-select-choices>\n" +
    "</ui-select>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "\n" +
    "<span class=\"help-block value-validation-error\" ng-show=\"(forms.keyValueEditor[uniqueForValue(unique, $index)].$error.pattern)\">\n" +
    "<span class=\"validation-text\">{{ entry.valueValidatorError || valueValidatorError}}</span>\n" +
    "<span ng-if=\"entry.valueValidatorErrorTooltip || valueValidatorErrorTooltip\" class=\"help action-inline\">\n" +
    "<a aria-hidden=\"true\" data-toggle=\"tooltip\" data-placement=\"top\" data-original-title=\"{{entry.valueValidatorErrorTooltip || valueValidatorErrorTooltip}}\">\n" +
    "<i class=\"{{entry.valueValidatorErrorTooltipIcon || valueValidatorErrorTooltipIcon}}\"></i>\n" +
    "</a>\n" +
    "</span>\n" +
    "</span>\n" +
    "<span class=\"help-block value-min-length\" ng-show=\"(forms.keyValueEditor[uniqueForValue(unique, $index)].$error.minlength)\">\n" +
    "<span class=\"validation-text\">Minimum character count is {{valueMinlength}}</span>\n" +
    "</span>\n" +
    "</div>\n" +
    "<div class=\"key-value-editor-buttons\">\n" +
    "<span ng-if=\"(!cannotSort) && (entries.length > 1)\" class=\"fa fa-bars sort-row\" role=\"button\" aria-label=\"Move row\" aria-grabbed=\"false\" as-sortable-item-handle></span>\n" +
    "<a href=\"\" class=\"pficon pficon-close delete-row as-sortable-item-delete\" role=\"button\" aria-label=\"Delete row\" ng-hide=\"cannotDeleteAny || cannotDeleteSome(entry.name) || entry.cannotDelete\" ng-click=\"deleteEntry($index, 1)\"></a>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"key-value-editor-entry form-group\" ng-if=\"(!cannotAdd)\">\n" +
    "<a href=\"\" class=\"add-row-link\" role=\"button\" aria-label=\"Add row\" ng-click=\"onAddRow()\">{{ addRowLink }}</a>\n" +
    "<span ng-if=\"valueFromSelectorOptions.length\">\n" +
    "<span class=\"action-divider\" aria-hidden=\"true\"> | </span>\n" +
    "<a href=\"\" class=\"add-row-link\" role=\"button\" aria-label=\"Add row\" ng-click=\"onAddRowWithSelectors()\">{{ addRowWithSelectorsLink }}</a>\n" +
    "</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "</ng-form>"
  );


  $templateCache.put('views/directives/label-editor.html',
    "<osc-form-section header=\"Labels\" about-title=\"Labels\" about=\"{{'Labels are used to organize, group, or select objects and resources, such as pods.'|translate}}\" expand=\"expand\" can-toggle=\"canToggle\">\n" +
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
    "<key-value-editor entries=\"labels\" key-placeholder=\"{{'Name'|translate}}\" key-maxlength=\"63\" key-validator-regex=\"validator.key\" value-placeholder=\"{{'Value'|translate}}\" value-maxlength=\"63\" value-validator-regex=\"validator.value\" key-validator-error-tooltip=\"{{'A valid object label has the form [domain/]name where a name is an alphanumeric (a-z, and 0-9) string, with a maximum length of 63 characters, with the \\'-\\' character allowed anywhere except the first or last character. A domain is a sequence of names separated by the \\'.\\' character with a maximum length of 253 characters.'|translate}}\" value-validator-error-tooltip=\"{{'A valid label value is an alphanumeric (a-z, and 0-9) string, with a maximum length of 63 characters, with the \\'-\\' character allowed anywhere except the first or last character.'|translate}}\" add-row-link=\"{{'Add Label'|translate}}\"></key-value-editor>\n" +
    "</div>\n" +
    "<div ng-hide=\"expand\">\n" +
    "<key-value-editor entries=\"labels\" key-placeholder=\"{{'Labels'|translate}}\" cannot-sort cannot-delete cannot-add is-readonly></key-value-editor>\n" +
    "</div>\n" +
    "</osc-form-section>"
  );


  $templateCache.put('views/directives/labels.html',
    "<div row wrap ng-if=\"(labels | hashSize) > 0\">\n" +
    "<span row nowrap=\"nowrap\" ng-repeat=\"(labelKey, labelValue) in labels\" class=\"k8s-label\" ng-if=\"!limit || $index < limit\">\n" +
    "<span row class=\"label-pair\" ng-if=\"clickable\">\n" +
    "<a href=\"\" class=\"label-key label truncate\" ng-click=\"filterAndNavigate(labelKey)\" ng-attr-title=\"All {{titleKind || kind}} with the label '{{labelKey}}' (any value)\">{{labelKey|translate}}</a><a href=\"\" class=\"label-value label truncate\" ng-click=\"filterAndNavigate(labelKey, labelValue)\" ng-attr-title=\"All {{titleKind || kind}} with the label '{{labelKey}}={{labelValue}}'\">{{labelValue}}<span ng-if=\"labelValue === ''\"><em>&lt;empty&gt;</em></span></a>\n" +
    "</span>\n" +
    "<span row class=\"label-pair\" ng-if=\"!clickable\">\n" +
    "<span class=\"label-key label truncate\">{{labelKey}}</span><span class=\"label-value label truncate\">{{labelValue}}</span>\n" +
    "</span>\n" +
    "</span>\n" +
    "<a href=\"\" class=\"small\" ng-click=\"limit = null\" ng-show=\"limit && limit < (labels | hashSize)\" style=\"padding-left: 5px; vertical-align: middle\" translate>More labels...</a>\n" +
    "</div>"
  );


  $templateCache.put('views/directives/lifecycle-hook.html',
    "<h4>\n" +
    "<translate>{{type | upperFirst}} Hook</translate>\n" +
    "<span ng-switch=\"type\">\n" +
    "<small ng-switch-when=\"pre\">&ndash; <translate>runs before the deployment begins</translate></small>\n" +
    "<small ng-switch-when=\"mid\">&ndash; <translate>runs after the previous deployment is scaled down to zero and before the first pod of the new deployment is created</translate></small>\n" +
    "<small ng-switch-when=\"post\">&ndash; <translate>runs after the deployment strategy completes</translate></small>\n" +
    "</span>\n" +
    "</h4>\n" +
    "<dl class=\"dl-horizontal left\">\n" +
    "<dt translate>Action:</dt>\n" +
    "<dd>{{strategyParams[type].execNewPod ? \"Run a command\" : \"Tag the image\"}}</dd>\n" +
    "<dt translate>Failure Policy:</dt>\n" +
    "<dd>{{strategyParams[type].failurePolicy}}\n" +
    "<span class=\"help action-inline\">\n" +
    "<a href ng-switch=\"strategyParams[type].failurePolicy\">\n" +
    "<i ng-switch-when=\"Ignore\" class=\"pficon pficon-help\" data-toggle=\"tooltip\" aria-hidden=\"true\" data-original-title=\"{{'Continue with deployment on failure'|translate}}\"></i>\n" +
    "<i ng-switch-when=\"Abort\" class=\"pficon pficon-help\" data-toggle=\"tooltip\" aria-hidden=\"true\" data-original-title=\"{{'Abort deployment on failure'|translate}}\"></i>\n" +
    "<i ng-switch-when=\"Retry\" class=\"pficon pficon-help\" data-toggle=\"tooltip\" aria-hidden=\"true\" data-original-title=\"{{'Retry the hook until it succeeds'|translate}}\"></i>\n" +
    "</a>\n" +
    "</span>\n" +
    "</dd>\n" +
    "<div ng-if=\"strategyParams[type].execNewPod\">\n" +
    "<h5 class=\"container-name\" translate>Container {{strategyParams[type].execNewPod.containerName}}</h5>\n" +
    "<dl class=\"dl-horizontal left\">\n" +
    "<dt translate>Command:</dt>\n" +
    "<dd>\n" +
    "<code class=\"command\">\n" +
    "<span ng-repeat=\"arg in strategyParams[type].execNewPod.command\">\n" +
    "<truncate-long-text content=\"arg\" limit=\"80\" newline-limit=\"1\" expandable=\"false\" use-word-boundary=\"false\"></truncate-long-text>\n" +
    "</span>\n" +
    "</code>\n" +
    "</dd>\n" +
    "<dt ng-if-start=\"strategyParams[type].execNewPod.env\" translate>Environment Variables:</dt>\n" +
    "<dd ng-if-end>\n" +
    "<div ng-repeat=\"env in strategyParams[type].execNewPod.env\">\n" +
    "<div class=\"truncate\" ng-attr-title=\"{{env.value}}\">{{env.name}}={{env.value}}</div>\n" +
    "</div>\n" +
    "</dd>\n" +
    "<dt ng-if-start=\"strategyParams[type].execNewPod.volumes\" translate>Volumes:</dt>\n" +
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
    "<div><translate>Tag image as</translate> <a ng-if=\"!tagImage.to.namespace || tagImage.to.namespace === deploymentConfig.metadata.namespace\" ng-href=\"{{tagImage.to.name | navigateResourceURL : 'ImageStreamTag' : deploymentConfig.metadata.namespace}}\">{{tagImage.to | imageObjectRef : deploymentConfig.metadata.namespace}}</a>\n" +
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
    "<button class=\"btn btn-link\" translate>View Archive</button>\n" +
    "</form>\n" +
    "<span ng-if=\"state && state !== 'empty'\" class=\"action-divider\">|</span>\n" +
    "</span>\n" +
    "<span ng-if=\"canSave && state && state !== 'empty'\">\n" +
    "<a href=\"\" ng-click=\"saveLog()\" role=\"button\">\n" +
    "<translate>Save</translate>\n" +
    "<i class=\"fa fa-download\"></i></a>\n" +
    "<span ng-if=\"state && state !== 'empty'\" class=\"action-divider\">|</span>\n" +
    "</span>\n" +
    "<a ng-if=\"state && state !== 'empty'\" href=\"\" ng-click=\"goChromeless(options, fullLogUrl)\" role=\"button\">\n" +
    "<translate>Expand</translate>\n" +
    "<i class=\"fa fa-external-link\"></i></a>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"largeLog\" class=\"alert alert-info log-size-warning\">\n" +
    "<span class=\"pficon pficon-info\" aria-hidden=\"true\"></span>\n" +
    "<translate>Only the previous {{options.tailLines || 5000}} log lines and new log messages will be displayed because of the large log size.</translate>\n" +
    "</div>\n" +
    "\n" +
    "<div ng-if=\"(!state)\">\n" +
    "<ellipsis-pulser ng-if=\"!chromeless\" color=\"dark\" size=\"sm\" display=\"inline\" msg=\"Loading log\" class=\"log-pending-ellipsis\"></ellipsis-pulser>\n" +
    "<ellipsis-pulser ng-if=\"chromeless\" color=\"light\" size=\"sm\" display=\"inline\" msg=\"Loading log\" class=\"log-pending-ellipsis\"></ellipsis-pulser>\n" +
    "</div>\n" +
    "<div class=\"empty-state-message text-center\" ng-if=\"state=='empty'\" ng-class=\"{'log-fixed-height': fixedHeight}\">\n" +
    "<h2 translate>Logs are not available.</h2>\n" +
    "<p>\n" +
    "{{emptyStateMessage}}\n" +
    "</p>\n" +
    "<div ng-if=\"kibanaAuthUrl\">\n" +
    "<form action=\"{{kibanaAuthUrl}}\" method=\"POST\">\n" +
    "<input type=\"hidden\" name=\"redirect\" value=\"{{kibanaArchiveUrl}}\">\n" +
    "<input type=\"hidden\" name=\"access_token\" value=\"{{access_token}}\">\n" +
    "<button class=\"btn btn-primary btn-lg\" translate>\n" +
    "View Archive\n" +
    "</button>\n" +
    "</form>\n" +
    "</div>\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "<div ng-show=\"state=='logs'\" ng-class=\"{ invisible: !sized }\">\n" +
    "<div class=\"log-view\" ng-attr-id=\"{{logViewerID}}\" ng-class=\"{'log-fixed-height': fixedHeight}\">\n" +
    "<div id=\"{{logViewerID}}-affixedFollow\" class=\"log-scroll log-scroll-top\">\n" +
    "<a ng-if=\"loading\" href=\"\" ng-click=\"toggleAutoScroll()\">\n" +
    "<span ng-if=\"!autoScrollActive\" translate>Follow</span>\n" +
    "<span ng-if=\"autoScrollActive\" translate>Stop Following</span>\n" +
    "</a>\n" +
    "<a ng-if=\"!loading\" href=\"\" ng-show=\"showScrollLinks\" ng-click=\"onScrollBottom()\" translate>\n" +
    "Go to End\n" +
    "</a>\n" +
    "</div>\n" +
    "<div class=\"log-view-output\" id=\"{{logViewerID}}-fixed-scrollable\">\n" +
    "<table>\n" +
    "<tbody id=\"{{logViewerID}}-logContent\"></tbody>\n" +
    "</table>\n" +
    "<div ng-if=\"(!loading) && (!limitReached) && (!errorWhileRunning) && state=='logs'\" class=\"log-end-msg\" translate>\n" +
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
    "<div ng-if=\"limitReached\" class=\"text-muted\" translate>\n" +
    "The maximum web console log size has been reached. Use the command-line interface or <a href=\"\" ng-click=\"restartLogs()\">reload</a> the log to see new messages.\n" +
    "</div>\n" +
    "<div ng-if=\"errorWhileRunning\" class=\"text-muted\">\n" +
    "<translate>An error occurred loading the log.</translate>\n" +
    "<a href=\"\" ng-click=\"restartLogs()\" translate>Reload</a>\n" +
    "</div>"
  );


  $templateCache.put('views/directives/metrics-compact.html',
    "<div in-view=\"updateInView($inview)\" in-view-options=\"{ throttle: 50 }\">\n" +
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


  $templateCache.put('views/directives/next-steps.html',
    "<div ng-controller=\"TasksController\">\n" +
    "<h1 ng-if=\"!tasks().length\">Completed. <a href=\"\" ng-click=\"$ctrl.goToOverview()\">Go to overview</a>.</h1>\n" +
    "<h1 ng-if=\"tasks().length && $ctrl.allTasksSuccessful(tasks())\"><translate>Application created.</translate> <a href=\"\" ng-click=\"$ctrl.goToOverview()\" translate>Continue to overview</a>.</h1>\n" +
    "<h1 ng-if=\"$ctrl.pendingTasks(tasks()).length\" translate>Creating...</h1>\n" +
    "<h1 ng-if=\"!$ctrl.pendingTasks(tasks()).length && $ctrl.erroredTasks(tasks()).length\" translate>Completed, with errors</h1>\n" +
    "<div ng-repeat=\"task in tasks()\" ng-if=\"tasks().length && !$ctrl.allTasksSuccessful(tasks())\">\n" +
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
    "<div class=\"alert alert-info template-message\" ng-if=\"$ctrl.templateMessage.length\">\n" +
    "<span class=\"pficon pficon-info\" aria-hidden=\"true\"></span>\n" +
    "<div class=\"resource-description\" ng-bind-html=\"$ctrl.templateMessage | linkify : '_blank'\"></div>\n" +
    "</div>\n" +
    "<div class=\"row\" ng-controller=\"TasksController\">\n" +
    "<div ng-if=\"!$ctrl.pendingTasks(tasks()).length && $ctrl.erroredTasks(tasks()).length\" class=\"col-md-12\">\n" +
    "<h2 translate>Things you can do</h2>\n" +
    "<p translate>Go to the <a href=\"\" ng-click=\"$ctrl.goToOverview()\">overview page</a> to see more details about this project. Make sure you don't already have <a href=\"project/{{$ctrl.projectName}}/browse/services\">services</a>, <a href=\"project/{{$ctrl.projectName}}/browse/builds\">build configs</a>, <a href=\"project/{{$ctrl.projectName}}/browse/deployments\">deployment configs</a>, or other resources with the same names you are trying to create. Refer to the <a target=\"_blank\" href=\"{{'new_app' | helpLink}}\">documentation for creating new applications</a> for more information.</p>\n" +
    "<h3 translate>Command line tools</h3>\n" +
    "<p translate>You may want to use the <code>oc</code> command line tool to help with troubleshooting. After <a target=\"_blank\" href=\"command-line\">downloading and installing</a> it, you can log in, switch to this particular project, and try some commands :</p>\n" +
    "<pre class=\"code prettyprint\">oc login {{$ctrl.loginBaseUrl}}\n" +
    "oc project {{$ctrl.projectName}}\n" +
    "oc logs -h</pre>\n" +
    "<p translate>For more information about the command line tools, check the <a target=\"_blank\" href=\"{{'cli' | helpLink}}\">CLI Reference</a> and <a target=\"_blank\" href=\"{{'basic_cli_operations' | helpLink}}\">Basic CLI Operations</a>.</p>\n" +
    "</div>\n" +
    "<div ng-if=\"$ctrl.allTasksSuccessful(tasks())\" ng-class=\"$ctrl.createdBuildConfigWithGitHubTrigger() ? 'col-md-6' : 'col-md-12'\">\n" +
    "<h2 translate>Manage your app</h2>\n" +
    "<p translate>The web console is convenient, but if you need deeper control you may want to try our command line tools.</p>\n" +
    "<h3 translate>Command line tools</h3>\n" +
    "<p translate><a target=\"_blank\" href=\"command-line\">Download and install</a> the <code>oc</code> command line tool. After that, you can start by logging in, switching to this particular project, and displaying an overview of it, by doing:</p>\n" +
    "<pre class=\"code prettyprint\">oc login {{$ctrl.loginBaseUrl}}\n" +
    "oc project {{$ctrl.projectName}}\n" +
    "oc status</pre>\n" +
    "<p translate>For more information about the command line tools, check the <a target=\"_blank\" href=\"{{'cli' | helpLink}}\">CLI Reference</a> and <a target=\"_blank\" href=\"{{'basic_cli_operations' | helpLink}}\">Basic CLI Operations</a>.</p>\n" +
    "</div>\n" +
    "<div ng-if=\"$ctrl.createdBuildConfig\" class=\"col-md-6\">\n" +
    "<h2 translate>Making code changes</h2>\n" +
    "<p ng-if=\"$ctrl.fromSampleRepo\">\n" +
    "<translate>You are set up to use the example git repository. If you would like to modify the source code, fork the <osc-git-link uri=\"$ctrl.createdBuildConfig.spec.source.git.uri\">{{$ctrl.createdBuildConfig.spec.source.git.uri}}</osc-git-link> repository to an DataMan OS-visible git account and <a href=\"{{$ctrl.createdBuildConfig | editResourceURL}}\">edit the <strong>{{$ctrl.createdBuildConfig.metadata.name}}</strong> build config</a> to point to your fork.</translate>\n" +
    "<span ng-if=\"$ctrl.createdBuildConfigWithConfigChangeTrigger()\" translate>Note that this will start a new build.</span>\n" +
    "</p>\n" +
    "<div ng-repeat=\"trigger in $ctrl.createdBuildConfig.spec.triggers\" ng-if=\"trigger.type == 'GitHub'\">\n" +
    "<p translate>\n" +
    "A GitHub <a target=\"_blank\" href=\"{{'webhooks' | helpLink}}\">webhook trigger</a> has been created for the <strong>{{$ctrl.createdBuildConfig.metadata.name}}</strong> build config.\n" +
    "</p>\n" +
    "<p ng-if=\"$ctrl.fromSampleRepo\" translate>\n" +
    "You can configure the webhook in the forked repository's settings, using the following payload URL:\n" +
    "</p>\n" +
    "<p ng-if=\"!$ctrl.fromSampleRepo\">\n" +
    "<span ng-if=\"$ctrl.createdBuildConfig.spec.source.git.uri | isGithubLink\" translate>\n" +
    "You can now set up the webhook in the GitHub repository settings if you own it, in <a target=\"_blank\" class=\"word-break\" href=\"{{$ctrl.createdBuildConfig.spec.source.git.uri | githubLink}}/settings/hooks\">{{$ctrl.createdBuildConfig.spec.source.git.uri | githubLink}}/settings/hooks</a>, using the following payload URL and specifying a <i>Content type</i> of <code>application/json</code>:\n" +
    "</span>\n" +
    "<span ng-if=\"!($ctrl.createdBuildConfig.spec.source.git.uri | isGithubLink)\" translate>\n" +
    "Your source does not appear to be a URL to a GitHub repository. If you have a GitHub repository that you want to trigger this build from then use the following payload URL and specifying a <i>Content type</i> of <code>application/json</code>:\n" +
    "</span>\n" +
    "</p>\n" +
    "<copy-to-clipboard clipboard-text=\"$ctrl.createdBuildConfig.metadata.name | webhookURL : trigger.type : trigger.github.secret : $ctrl.projectName\"></copy-to-clipboard>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"$ctrl.parameters.all.length\">\n" +
    "<h2 translate>Applied Parameter Values</h2>\n" +
    "<p><translate>These parameters often include things like passwords. If you will need to reference these values later, copy them to a safe location.</translate>\n" +
    "<span ng-if=\"$ctrl.parameters.generated.length > 1\" translate>Parameters <span ng-repeat=\"paramName in $ctrl.parameters.generated\">{{paramName}}<span ng-if=\"!$last\">, </span></span> were generated automatically.</span>\n" +
    "<span ng-if=\"$ctrl.parameters.generated.length === 1\" translate>Parameter {{$ctrl.parameters.generated[0]}} was generated automatically.</span>\n" +
    "</p>\n" +
    "<div ng-if=\"!$ctrl.showParamsTable\" class=\"center\">\n" +
    "<a href=\"\" ng-click=\"$ctrl.toggleParamsTable()\" translate>Show parameter values</a>\n" +
    "</div>\n" +
    "<key-value-editor ng-if=\"$ctrl.showParamsTable\" entries=\"$ctrl.parameters.all\" key-placeholder=\"{{'Name'|translate}}\" value-placeholder=\"{{'Value'|translate}}\" cannot-add cannot-delete cannot-sort show-header is-readonly></key-value-editor>\n" +
    "</div>"
  );


  $templateCache.put('views/directives/osc-autoscaling.html',
    "<ng-form name=\"form\">\n" +
    "<div class=\"autoscaling-form\">\n" +
    "<div ng-show=\"showNameInput\" class=\"form-group\">\n" +
    "<label for=\"hpa-name\" class=\"required\" translate>Autoscaler Name</label>\n" +
    "<span ng-class=\"{ 'has-error': form.name.$touched && form.name.$invalid }\">\n" +
    "<input id=\"hpa-name\" class=\"form-control\" type=\"text\" name=\"name\" ng-model=\"autoscaling.name\" ng-required=\"showNameInput\" ng-readonly=\"nameReadOnly\" ng-pattern=\"nameValidation.pattern\" ng-maxlength=\"nameValidation.maxlength\" select-on-focus autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\" aria-describedby=\"hpa-name-help\">\n" +
    "</span>\n" +
    "<div>\n" +
    "<span id=\"hpa-name-help\" class=\"help-block\" translate>\n" +
    "A unique name for the horizontal pod autoscaler within the project.\n" +
    "</span>\n" +
    "</div>\n" +
    "<div class=\"has-error\" ng-show=\"form.name.$invalid && form.name.$touched\">\n" +
    "<span ng-if=\"form.name.$error.required\" class=\"help-block\" translate>\n" +
    "Name is required.\n" +
    "</span>\n" +
    "<span ng-show=\"form.name.$error.pattern\" class=\"help-block\">\n" +
    "{{nameValidation.description}}\n" +
    "</span>\n" +
    "<span ng-show=\"form.name.$error.maxlength\" class=\"help-block\">\n" +
    "<span class=\"help-block\" translate>\n" +
    "Can't be longer than {{nameValidation.maxlength}} characters.\n" +
    "</span>\n" +
    "</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"form-group\">\n" +
    "<label>Min Pods</label>\n" +
    "<span ng-class=\"{ 'has-error': form.minReplicas.$dirty && form.minReplicas.$invalid }\">\n" +
    "<input type=\"number\" class=\"form-control\" min=\"1\" name=\"minReplicas\" ng-model=\"autoscaling.minReplicas\" ng-pattern=\"/^\\d+$/\" aria-describedby=\"min-replicas-help\">\n" +
    "</span>\n" +
    "<div id=\"min-replicas-help\" class=\"help-block\">\n" +
    "<translate>The lower limit for the number of pods that can be set by the autoscaler.</translate>\n" +
    "<translate>If not specified, defaults to 1.</translate>\n" +
    "</div>\n" +
    "<div class=\"has-error\" ng-show=\"form.minReplicas.$dirty && form.minReplicas.$invalid\">\n" +
    "<span ng-if=\"form.minReplicas.$error.number\" class=\"help-block\" translate>\n" +
    "Min pods must be a number.\n" +
    "</span>\n" +
    "<span ng-if=\"form.minReplicas.$error.pattern\" class=\"help-block\" translate>\n" +
    "Min pods must be a whole number.\n" +
    "</span>\n" +
    "<span ng-if=\"form.minReplicas.$error.min\" class=\"help-block\" translate>\n" +
    "Min pods must be greater than or equal to 1.\n" +
    "</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"form-group\">\n" +
    "<label class=\"required\" translate>Max Pods</label>\n" +
    "<span ng-class=\"{ 'has-error': (form.minReplicas.$dirty || form.maxReplicas.$dirty) && form.maxReplicas.$invalid }\">\n" +
    "<input type=\"number\" class=\"form-control\" name=\"maxReplicas\" required min=\"{{autoscaling.minReplicas || 1}}\" ng-model=\"autoscaling.maxReplicas\" ng-pattern=\"/^\\d+$/\" aria-describedby=\"max-replicas-help\">\n" +
    "</span>\n" +
    "<div id=\"max-replicas-help\" class=\"help-block\" translate>\n" +
    "The upper limit for the number of pods that can be set by the autoscaler.\n" +
    "</div>\n" +
    "<div class=\"has-error\" ng-show=\"(form.minReplicas.$dirty || form.maxReplicas.$dirty) && form.maxReplicas.$invalid\">\n" +
    "<span ng-if=\"form.maxReplicas.$error.number\" class=\"help-block\" translate>\n" +
    "Max pods must be a number.\n" +
    "</span>\n" +
    "<span ng-if=\"form.minReplicas.$error.pattern\" class=\"help-block\" translate>\n" +
    "Min pods must be a whole number.\n" +
    "</span>\n" +
    "<span class=\"help-block\" ng-if=\"form.maxReplicas.$error.min\" translate>\n" +
    "Max pods must be greater than or equal to\n" +
    "<span ng-if=\"autoscaling.minReplicas\">min pods, which is</span>\n" +
    "{{autoscaling.minReplicas || 1}.\n" +
    "</span>\n" +
    "<span class=\"help-block\" ng-if=\"form.maxReplicas.$error.required\" translate>\n" +
    "Max pods is a required field.\n" +
    "</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"form-group\">\n" +
    "<label>\n" +
    "CPU\n" +
    "<span ng-if=\"isRequestCalculated\" translate>Limit</span>\n" +
    "<span ng-if=\"!isRequestCalculated\" translate>Request</span>\n" +
    "<translate>Target</translate>\n" +
    "</label>\n" +
    "<div class=\"input-group\" ng-class=\"{ 'has-error': form.targetCPU.$invalid && form.targetCPU.$touched }\">\n" +
    "<input type=\"number\" class=\"form-control\" min=\"1\" name=\"targetCPU\" ng-model=\"targetCPUInput.percent\" ng-pattern=\"/^\\d+$/\" aria-describedby=\"target-cpu-help\">\n" +
    "<span class=\"input-group-addon\">%</span>\n" +
    "</div>\n" +
    "<div id=\"target-cpu-help\" class=\"help-block\">\n" +
    "<translate>The percentage of the CPU</translate>\n" +
    "<span ng-if=\"isRequestCalculated\" translate>limit</span>\n" +
    "<span ng-if=\"!isRequestCalculated\" translate>request</span>\n" +
    "<translate>that each pod should ideally be using. Pods will be added or removed periodically when CPU usage exceeds or drops below this target value.</translate>\n" +
    "<span ng-if=\"defaultTargetCPUDisplayValue\">Defaults to {{defaultTargetCPUDisplayValue}}%.</span>\n" +
    "</div>\n" +
    "<div class=\"learn-more-block\">\n" +
    "<a href=\"{{'compute_resources' | helpLink}}\" target=\"_blank\"><translate>Learn More</translate>&nbsp;<i class=\"fa fa-external-link\" aria-hidden=\"true\"></i></a>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"has-error\" style=\"margin-top: 10px\" ng-show=\"form.targetCPU.$touched && form.targetCPU.$invalid\">\n" +
    "<span ng-if=\"form.targetCPU.$error.number\" class=\"help-block\" translate>\n" +
    "Target CPU percentage must be a number.\n" +
    "</span>\n" +
    "<span ng-if=\"form.targetCPU.$error.pattern\" class=\"help-block\" translate>\n" +
    "Target CPU percentage must be a whole number.\n" +
    "</span>\n" +
    "<span ng-if=\"form.targetCPU.$error.min\" class=\"help-block\" translate>\n" +
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
    "<p translate>Drop file here</p>\n" +
    "</div>\n" +
    "<div class=\"input-group\">\n" +
    "<input type=\"text\" class=\"form-control\" ng-model=\"fileName\" readonly=\"readonly\" ng-show=\"supportsFileUpload\" ng-disabled=\"disabled\" ng-attr-aria-describedby=\"{{helpText ? helpID : undefined}}\">\n" +
    "<span class=\"input-group-btn\">\n" +
    "<span class=\"btn btn-default btn-file\" ng-show=\"supportsFileUpload\" ng-attr-disabled=\"{{ disabled || undefined }}\">\n" +
    "<translate>Browse&hellip;</translate>\n" +
    "<input type=\"file\" ng-disabled=\"disabled\" class=\"form-control\">\n" +
    "</span>\n" +
    "</span>\n" +
    "</div>\n" +
    "<div ng-if=\"helpText\">\n" +
    "<span ng-attr-id=\"{{helpID}}\" class=\"help-block\">{{::helpText}}</span>\n" +
    "</div>\n" +
    "<div class=\"has-error\" ng-show=\"uploadError\">\n" +
    "<span class=\"help-block\" translate>There was an error reading the file. Please copy the file content into the text area.</span>\n" +
    "</div>\n" +
    "<textarea class=\"form-control\" rows=\"5\" ng-show=\"showTextArea || !supportsFileUpload\" ng-model=\"model\" ng-required=\"required\" ng-disabled=\"disabled\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\" ng-attr-aria-describedby=\"{{helpText ? helpID : undefined}}\">\n" +
    "  </textarea>\n" +
    "<a href=\"\" ng-show=\"(model || fileName) && !disabled\" ng-click=\"cleanInputValues()\" translate>Clear Value</a>\n" +
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
    "<a class=\"action action-inline\" href ng-click=\"toggle()\" ng-show=\"expand\"><i class=\"pficon pficon-remove\"></i><translate>Collapse</translate></a>\n" +
    "</li>\n" +
    "<li>\n" +
    "<span class=\"help action-inline\">\n" +
    "<i class=\"pficon pficon-help\"></i>\n" +
    "<a href data-toggle=\"tooltip\" data-original-title=\"{{about}}\" translate>About {{aboutTitle}}</a>\n" +
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
    "<div ng-show=\"resource.metadata.namespace && resource.metadata.namespace !=='openshift'\" translate>Namespace: {{ resource.metadata.namespace }}</div>\n" +
    "<div ng-show=\"resource | annotation:'version'\" translate>Version: {{ resource | annotation:'version' }}</div>\n" +
    "</div>"
  );


  $templateCache.put('views/directives/osc-persistent-volume-claim.html',
    "<ng-form name=\"persistentVolumeClaimForm\">\n" +
    "<fieldset ng-disabled=\"claimDisabled\">\n" +
    "<div ng-if=\"persistentVolumeClaimForm.capacity.$error.outOfClaims\" class=\"has-error\">\n" +
    "<div class=\"alert alert-danger\">\n" +
    "<span class=\"pficon pficon-error-circle-o\" aria-hidden=\"true\"></span>\n" +
    "<strong translate>Storage quota limit has been reached. You will not be able to create any new storage.</strong>\n" +
    "<a ng-href=\"project/{{projectName}}/quota\" target=\"_blank\" translate>View Quota&nbsp;</a>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"storageClasses.length\" class=\"form-group\">\n" +
    "\n" +
    "<label translate>Storage Class</label>\n" +
    "<div>\n" +
    "<ui-select ng-model=\"claim.storageClass\" theme=\"bootstrap\" search-enabled=\"true\" title=\"{{'Select a storage class'|translate}}\" class=\"select-role\">\n" +
    "<ui-select-match placeholder=\"{{'Select a storage class'|translate}}\">\n" +
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
    "<translate>Storage classes are set by the administrator to define types of storage the users can select.</translate>\n" +
    "<span ng-if=\"defaultStorageClass\" translate> If another storage class is not chosen, the default storage class <var>{{defaultStorageClass.metadata.name}}</var> will be used.</span>\n" +
    "<div class=\"learn-more-block\">\n" +
    "<a ng-href=\"{{'storage_classes' | helpLink}}\" target=\"_blank\"><translate>Learn More</translate>&nbsp;<i class=\"fa fa-external-link\" aria-hidden=\"true\"> </i></a>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"form-group\">\n" +
    "<label for=\"claim-name\" class=\"required\" translate>Name</label>\n" +
    "<span ng-class=\"{ 'has-error': persistentVolumeClaimForm.name.$invalid && persistentVolumeClaimForm.name.$touched && !claimDisabled }\">\n" +
    "<input id=\"claim-name\" class=\"form-control\" type=\"text\" name=\"name\" ng-model=\"claim.name\" ng-required=\"true\" ng-pattern=\"nameValidation.pattern\" ng-maxlength=\"nameValidation.maxlength\" placeholder=\"my-storage-claim\" take-focus select-on-focus autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\" aria-describedby=\"claim-name-help\">\n" +
    "</span>\n" +
    "<div>\n" +
    "<span id=\"claim-name-help\" class=\"help-block\" translate>A unique name for the storage claim within the project.</span>\n" +
    "</div>\n" +
    "<div class=\"has-error\" ng-show=\"persistentVolumeClaimForm.name.$error.required && persistentVolumeClaimForm.name.$touched && !claimDisabled\">\n" +
    "<span class=\"help-block\" translate>\n" +
    "Name is required.\n" +
    "</span>\n" +
    "</div>\n" +
    "<div class=\"has-error\" ng-show=\"persistentVolumeClaimForm.name.$error.pattern && persistentVolumeClaimForm.name.$touched && !claimDisabled\">\n" +
    "<span class=\"help-block\">\n" +
    "{{nameValidation.description}}\n" +
    "</span>\n" +
    "</div>\n" +
    "<div class=\"has-error\" ng-show=\"persistentVolumeClaimForm.name.$error.maxlength && persistentVolumeClaimForm.name.$touched && !claimDisabled\">\n" +
    "<span class=\"help-block\" translate>\n" +
    "Can't be longer than {{nameValidation.maxlength}} characters.\n" +
    "</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"form-group\">\n" +
    "<label class=\"required\" translate>Access Mode</label><br/>\n" +
    "<label class=\"radio-inline\">\n" +
    "<input type=\"radio\" name=\"accessModes\" ng-model=\"claim.accessModes\" value=\"ReadWriteOnce\" aria-describedby=\"access-modes-help\" ng-checked=\"true\" translate>\n" +
    "Single User (RWO)\n" +
    "</label>\n" +
    "<label class=\"radio-inline\">\n" +
    "<input type=\"radio\" id=\"accessModes\" name=\"accessModes\" ng-model=\"claim.accessModes\" value=\"ReadWriteMany\" aria-describedby=\"access-modes-help\" translate>\n" +
    "Shared Access (RWX)\n" +
    "</label>\n" +
    "<label class=\"radio-inline\">\n" +
    "<input type=\"radio\" name=\"accessModes\" ng-model=\"claim.accessModes\" value=\"ReadOnlyMany\" aria-describedby=\"access-modes-help\" translate>\n" +
    "Read Only (ROX)\n" +
    "</label>\n" +
    "<div>\n" +
    "<span id=\"access-modes-help\" class=\"help-block\" translate>Permissions to the mounted volume.</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "\n" +
    "<div ng-if=\"capacityReadOnly\" class=\"form-group mar-bottom-xl\">\n" +
    "<label>Size</label>\n" +
    "<div class=\"static-form-value-large\">\n" +
    "{{claim.amount}} {{claim.unit | humanizeUnit : 'storage'}}\n" +
    "<small translate>(cannot be changed)</small>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"!capacityReadOnly\" class=\"form-group\">\n" +
    "<fieldset class=\"form-inline compute-resource\">\n" +
    "<label class=\"required\">\n" +
    "<translate>Size</translate>\n" +
    "<small ng-if=\"limits.min && limits.max\" translate>\n" +
    "{{limits.min | usageWithUnits : 'storage'}} min to {{limits.max | usageWithUnits : 'storage'}} max\n" +
    "</small>\n" +
    "<small ng-if=\"limits.min && !limits.max\">\n" +
    "<translate>Min:</translate> {{limits.min | usageWithUnits : 'storage'}}\n" +
    "</small>\n" +
    "<small ng-if=\"limits.max && !limits.min\">\n" +
    "<translate>Max:</translate> {{limits.max | usageWithUnits : 'storage'}}\n" +
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
    "<div id=\"claim-capacity-help\" class=\"help-block\" translate>\n" +
    "Desired storage capacity.\n" +
    "</div>\n" +
    "<div ng-if=\"persistentVolumeClaimForm.capacity.$touched && !claimDisabled\">\n" +
    "<div class=\"has-error\" ng-show=\"persistentVolumeClaimForm.capacity.$error.required\">\n" +
    "<span class=\"help-block\" translate>\n" +
    "Size is required.\n" +
    "</span>\n" +
    "</div>\n" +
    "<div class=\"has-error\" ng-show=\"persistentVolumeClaimForm.capacity.$error.number\">\n" +
    "<span class=\"help-block\" translate>\n" +
    "Must be a number.\n" +
    "</span>\n" +
    "</div>\n" +
    "<div class=\"has-error\" ng-show=\"persistentVolumeClaimForm.capacity.$error.min\">\n" +
    "<span class=\"help-block\" translate>\n" +
    "Must be a positive number.\n" +
    "</span>\n" +
    "</div>\n" +
    "<div ng-if=\"persistentVolumeClaimForm.capacity.$error.limitRangeMin\" class=\"has-error\">\n" +
    "<span class=\"help-block\" translate>\n" +
    "Can't be less than {{limits.min | usageWithUnits : 'storage'}}.\n" +
    "</span>\n" +
    "</div>\n" +
    "<div ng-if=\"persistentVolumeClaimForm.capacity.$error.limitRangeMax\" class=\"has-error\">\n" +
    "<span class=\"help-block\" translate>\n" +
    "Can't be greater than {{limits.max | usageWithUnits : 'storage'}}.\n" +
    "</span>\n" +
    "</div>\n" +
    "<div ng-if=\"persistentVolumeClaimForm.capacity.$error.willExceedStorage\" class=\"has-error\">\n" +
    "<span class=\"help-block\">\n" +
    "<translate>Storage quota will be exceeded.</translate> <a ng-href=\"project/{{projectName}}/quota\" target=\"_blank\" translate>View Quota&nbsp;</a>\n" +
    "</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"learn-more-block mar-top-sm\">\n" +
    "<a href=\"\" ng-click=\"showComputeUnitsHelp()\" translate>What are GiB?</a>\n" +
    "</div>\n" +
    "</fieldset>\n" +
    "</div>\n" +
    "\n" +
    "<div ng-show=\"!showAdvancedOptions\" class=\"mar-bottom-xl\">\n" +
    "<translate>Use</translate>\n" +
    "<a href=\"\" ng-click=\"showAdvancedOptions = true\" translate>label selectors</a>\n" +
    "<translate>to request storage.</translate>\n" +
    "</div>\n" +
    "<div ng-show=\"showAdvancedOptions\" class=\"form-group\">\n" +
    "<fieldset class=\"compute-resource\">\n" +
    "<label>Label Selector</label>\n" +
    "<div class=\"help-block mar-bottom-lg\">\n" +
    "<translate>Enter a label and value to use for your storage.</translate>\n" +
    "<div class=\"learn-more-block\">\n" +
    "<a ng-href=\"{{'selector_label' | helpLink}}\" target=\"_blank\"><translate>Learn More</translate>&nbsp;<i class=\"fa fa-external-link\" aria-hidden=\"true\"></i></a>\n" +
    "</div>\n" +
    "</div>\n" +
    "<key-value-editor entries=\"claim.selectedLabels\" key-placeholder=\"{{'label'|translate}}\" value-placeholder=\"{{'value'|translate}}\" key-validator=\"[a-zA-Z][a-zA-Z0-9_-]*\" key-validator-error-tooltip=\"{{'A valid label name is an alphanumeric (a-z and 0-9) string beginning with a letter that may contain underscores and dashes.'|translate}}\" add-row-link=\"{{'Add Label'|translate}}\"></key-value-editor>\n" +
    "</fieldset>\n" +
    "</div>\n" +
    "</fieldset>\n" +
    "</ng-form>"
  );


  $templateCache.put('views/directives/osc-routing-service.html',
    "<ng-form name=\"routingServiceForm\">\n" +
    "<div class=\"row\">\n" +
    "<div class=\"form-group\" ng-class=\"{ 'col-sm-6': showWeight, 'col-sm-12': !showWeight }\">\n" +
    "<label for=\"{{id}}-service-select\" class=\"required\" translate>\n" +
    "Service\n" +
    "</label>\n" +
    "<ui-select ng-model=\"model.name\" input-id=\"{{id}}-service-select\" aria-describedby=\"{{id}}-service-help\" required>\n" +
    "<ui-select-match>{{$select.selected}}</ui-select-match>\n" +
    "<ui-select-choices repeat=\"serviceName in (optionNames | filter : $select.search)\">\n" +
    "<div ng-bind-html=\"serviceName | highlight : $select.search\"></div>\n" +
    "</ui-select-choices>\n" +
    "</ui-select>\n" +
    "<div>\n" +
    "<span ng-attr-id=\"{{id}}-service-help\" class=\"help-block\">\n" +
    "<span ng-if=\"!isAlternate\" translate>Service to route to.</span>\n" +
    "<span ng-if=\"isAlternate\" translate>Alternate service for route traffic.</span>\n" +
    "</span>\n" +
    "</div>\n" +
    "<div ng-if=\"model.name && !allServices[model.name]\" class=\"has-warning\">\n" +
    "<span class=\"help-block\" translate>\n" +
    "Service {{model.name}} does not exist.\n" +
    "</span>\n" +
    "</div>\n" +
    "<div ng-if=\"(optionNames | size) === 0\" class=\"has-error\">\n" +
    "<span class=\"help-block\" translate>\n" +
    "There are no <span ng-if=\"is-alternate\">additional</span> services in your project to expose with a route.\n" +
    "</span>\n" +
    "</div>\n" +
    "<div ng-if=\"warnUnnamedPort\" class=\"has-warning\">\n" +
    "<span class=\"help-block\">\n" +
    "<translate>Service {{model.name}} has a single, unnamed port. A route cannot specifically target an unnamed service port.</translate>\n" +
    "<translate>If more service ports are added later, the route will also direct traffic to them.</translate>\n" +
    "</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"showWeight\" class=\"form-group col-sm-6\">\n" +
    "<label for=\"{{id}}-service-weight\" class=\"required\">Weight</label>\n" +
    "<input ng-model=\"model.weight\" name=\"weight\" id=\"{{id}}-service-weight\" type=\"number\" required min=\"0\" max=\"256\" ng-pattern=\"/^\\d+$/\" class=\"form-control\" aria-describedby=\"{{id}}-weight-help\">\n" +
    "<div>\n" +
    "<span id=\"{{id}}-weight-help\" class=\"help-block\" translate>\n" +
    "Weight is a number between 0 and 256 that specifies the relative weight against other route services.\n" +
    "</span>\n" +
    "<div ng-if=\"routingServiceForm.weight.$dirty && routingServiceForm.weight.$invalid\" class=\"has-error\">\n" +
    "<div ng-if=\"routingServiceForm.weight.$error.number\" class=\"help-block\" translate>\n" +
    "Must be a number.\n" +
    "</div>\n" +
    "\n" +
    "<div ng-if=\"routingServiceForm.weight.$error.pattern\" class=\"help-block\" translate>\n" +
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
    "<label for=\"route-name\" class=\"required\" translate>Name</label>\n" +
    "<span ng-class=\"{ 'has-error': routeForm.name.$invalid && routeForm.name.$touched && !routingDisabled }\">\n" +
    "<input id=\"route-name\" class=\"form-control\" type=\"text\" name=\"name\" ng-model=\"route.name\" ng-required=\"showNameInput\" ng-pattern=\"nameValidation.pattern\" ng-maxlength=\"nameValidation.maxlength\" placeholder=\"my-route\" select-on-focus autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\" aria-describedby=\"route-name-help\">\n" +
    "</span>\n" +
    "<div>\n" +
    "<span id=\"route-name-help\" class=\"help-block\" translate>A unique name for the route within the project.</span>\n" +
    "</div>\n" +
    "<div class=\"has-error\" ng-show=\"routeForm.name.$error.pattern && routeForm.name.$touched && !routingDisabled\">\n" +
    "<span class=\"help-block\">\n" +
    "{{nameValidation.description}}\n" +
    "</span>\n" +
    "</div>\n" +
    "<div class=\"has-error\" ng-show=\"routeForm.name.$error.maxlength && routeForm.name.$touched && !routingDisabled\">\n" +
    "<span class=\"help-block\" translate>\n" +
    "Can't be longer than {{nameValidation.maxlength}} characters.\n" +
    "</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"form-group\">\n" +
    "<label for=\"host\" translate>Hostname</label>\n" +
    "<span ng-class=\"{ 'has-error': routeForm.host.$invalid && routeForm.host.$touched && !routingDisabled }\">\n" +
    "<input id=\"host\" class=\"form-control\" type=\"text\" name=\"host\" ng-model=\"route.host\" ng-pattern=\"hostnamePattern\" ng-maxlength=\"hostnameMaxLength\" ng-readonly=\"hostReadOnly\" placeholder=\"www.example.com\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\" aria-describedby=\"route-host-help\">\n" +
    "</span>\n" +
    "<div>\n" +
    "<span id=\"route-host-help\" class=\"help-block\">\n" +
    "<p>\n" +
    "<translate>Public hostname for the route.</translate>\n" +
    "<span ng-if=\"!hostReadOnly\" translate>\n" +
    "If not specified, a hostname is generated.\n" +
    "</span>\n" +
    "<span ng-if=\"!disableWildcards\" translate>\n" +
    "You can use <var>*.example.com</var> with routers that support wildcard subdomains.\n" +
    "</span>\n" +
    "</p>\n" +
    "<p translate>The hostname can't be changed after the route is created.</p>\n" +
    "</span>\n" +
    "</div>\n" +
    "<div class=\"has-error\" ng-show=\"routeForm.host.$error.pattern && routeForm.host.$touched && !routingDisabled\">\n" +
    "<span class=\"help-block\">\n" +
    "<translate>Hostname must consist of lower-case letters, numbers, periods, and hyphens. It must start and end with a letter or number.</translate>\n" +
    "<span ng-if=\"!disableWildcards\" translate>Wildcard subdomains may start with <var>*.</var></span>\n" +
    "</span>\n" +
    "</div>\n" +
    "<div class=\"has-error\" ng-show=\"routeForm.host.$error.maxlength && routeForm.host.$touched && !routingDisabled\">\n" +
    "<span class=\"help-block\" translate>\n" +
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
    "<span id=\"route-path-help\" class=\"help-block\" translate>\n" +
    "Path that the router watches to route traffic to the service.\n" +
    "</span>\n" +
    "</div>\n" +
    "<div class=\"has-error\" ng-show=\"routeForm.path.$error.pattern && routeForm.path.$touched && !routingDisabled\">\n" +
    "<span class=\"help-block\" translate>\n" +
    "Path must start with <code>/</code>\n" +
    "</span>\n" +
    "</div>\n" +
    "<div class=\"has-warning\" ng-show=\"route.path && route.tls.termination === 'passthrough'\">\n" +
    "<span class=\"help-block\" translate>\n" +
    "Path value will not be used. Paths cannot be set for passthrough TLS.\n" +
    "</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "\n" +
    "<div ng-if=\"services\">\n" +
    "<osc-routing-service model=\"route.to\" service-options=\"services\" all-services=\"servicesByName\" show-weight=\"route.alternateServices.length > 1 || (controls.hideSlider && route.alternateServices.length)\" warn-unnamed-port=\"unnamedServicePort\">\n" +
    "</osc-routing-service>\n" +
    "</div>\n" +
    "\n" +
    "<div ng-if=\"route.portOptions.length\" class=\"form-group\">\n" +
    "<label for=\"routeTargetPort\" translate>Target Port</label>\n" +
    "<ui-select ng-if=\"route.portOptions.length\" ng-model=\"route.targetPort\" input-id=\"routeTargetPort\" search-enabled=\"false\" aria-describedby=\"target-port-help\">\n" +
    "<ui-select-match>{{$select.selected.label}}</ui-select-match>\n" +
    "<ui-select-choices repeat=\"portOption.port as portOption in route.portOptions\">\n" +
    "{{portOption.label}}\n" +
    "</ui-select-choices>\n" +
    "</ui-select>\n" +
    "<div>\n" +
    "<span id=\"target-port-help\" class=\"help-block\" translate>\n" +
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
    "<input type=\"checkbox\" ng-model=\"options.alternateServices\" aria-describedby=\"secure-route-help\" translate>\n" +
    "Split traffic across multiple services\n" +
    "</label>\n" +
    "<div class=\"help-block\" translate>\n" +
    "Routes can direct traffic to multiple services for A/B testing. Each service has a weight controlling how much traffic it gets.\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-repeat=\"alternate in route.alternateServices\" class=\"form-group\">\n" +
    "<osc-routing-service model=\"alternate\" service-options=\"alternateServiceOptions\" all-services=\"servicesByName\" is-alternate=\"true\" show-weight=\"route.alternateServices.length > 1 || controls.hideSlider\">\n" +
    "</osc-routing-service>\n" +
    "<a href=\"\" ng-click=\"route.alternateServices.splice($index, 1)\" translate>Remove Service</a>\n" +
    "<span ng-if=\"$last && route.alternateServices.length < alternateServiceOptions.length\">\n" +
    "<span class=\"action-divider\">|</span>\n" +
    "<a href=\"\" ng-click=\"addAlternateService()\" translate>Add Another Service</a>\n" +
    "</span>\n" +
    "</div>\n" +
    "<div ng-repeat=\"duplicate in duplicateServices\" class=\"has-error mar-bottom-lg\">\n" +
    "<span class=\"help-block\" translate>\n" +
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
    "<span class=\"service-name\">{{route.to.name}}</span>\n" +
    "<span class=\"weight-percentage\">{{weightAsPercentage(route.to.weight, true)}}</span>\n" +
    "</div>\n" +
    "<div>\n" +
    "<span class=\"weight-percentage hidden-xs\">{{weightAsPercentage(route.alternateServices[0].weight, true)}}</span>\n" +
    "<span class=\"service-name\">{{route.alternateServices[0].name}}</span>\n" +
    "<span class=\"weight-percentage visible-xs-inline\">{{weightAsPercentage(route.alternateServices[0].weight, true)}}</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "<label class=\"sr-only\" for=\"weight-slider\" translate>Service {{route.to.service.metadata.name}} Weight</label>\n" +
    "<input id=\"weight-slider\" type=\"range\" min=\"0\" max=\"100\" step=\"1\" list=\"ticks\" ng-model=\"controls.rangeSlider\" aria-describedby=\"weight-slider-help\" class=\"mar-top-md\">\n" +
    "<datalist id=\"ticks\">\n" +
    "<option>0</option>\n" +
    "<option>25</option>\n" +
    "<option>50</option>\n" +
    "<option>75</option>\n" +
    "<option>100</option>\n" +
    "</datalist>\n" +
    "<div class=\"help-block\" id=\"weight-slider-help\" translate>\n" +
    "Percentage of traffic sent to each service. Drag the slider to adjust the values or <a href=\"\" ng-click=\"controls.hideSlider = true\">edit weights as integers</a>.\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<h3 translate>Security</h3>\n" +
    "<div class=\"checkbox\">\n" +
    "<label>\n" +
    "<input type=\"checkbox\" ng-model=\"options.secureRoute\" aria-describedby=\"secure-route-help\">\n" +
    "<translate>Secure route</translate>\n" +
    "</label>\n" +
    "<div class=\"help-block\" id=\"secure-route-help\" translate>\n" +
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
    "<a href=\"{{'route-types' | helpLink}}\" target=\"_blank\"><translate>Learn More</translate>&nbsp;<i class=\"fa fa-external-link\" aria-hidden=\"true\"></i></a>\n" +
    "</div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"form-group\">\n" +
    "<label for=\"insecureTraffic\" translate>Insecure Traffic</label>\n" +
    "\n" +
    "<input type=\"hidden\" name=\"insecureTraffic\">\n" +
    "<ui-select ng-model=\"route.tls.insecureEdgeTerminationPolicy\" name=\"insecureTraffic\" input-id=\"insecureTraffic\" aria-describedby=\"route-insecure-policy-help\" search-enabled=\"false\">\n" +
    "<ui-select-match>{{$select.selected.label}}</ui-select-match>\n" +
    "<ui-select-choices repeat=\"option.value as option in insecureTrafficOptions\" ui-disable-choice=\"route.tls.termination === 'passthrough' && option.value === 'Allow'\">\n" +
    "{{option.label}}\n" +
    "</ui-select-choices>\n" +
    "</ui-select>\n" +
    "<div>\n" +
    "<span id=\"route-insecure-policy-help\" class=\"help-block\" translate>\n" +
    "Policy for traffic on insecure schemes like HTTP.\n" +
    "</span>\n" +
    "</div>\n" +
    "<div ng-if=\"routeForm.insecureTraffic.$error.passthrough\" class=\"has-warning\">\n" +
    "<span class=\"help-block\" translate>\n" +
    "Passthrough routes can't use the insecure traffic policy <var>Allow</var>.\n" +
    "</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "\n" +
    "<h3 translate>Certificates</h3>\n" +
    "<div class=\"help-block\" translate>\n" +
    "TLS certificates for edge and re-encrypt termination. If not specified, the router's default certificate is used.\n" +
    "</div>\n" +
    "<div ng-if=\"showCertificatesNotUsedWarning\" class=\"has-warning\">\n" +
    "<span class=\"help-block\">\n" +
    "<translate>The certificate or key you've set will not be used.</translate>\n" +
    "<span ng-if=\"!route.tls.termination\" translate>\n" +
    "The route is unsecured.\n" +
    "</span>\n" +
    "<span ng-if=\"route.tls.termination === 'passthrough'\" translate>\n" +
    "Custom certificates cannot be used with passthrough termination.\n" +
    "</span>\n" +
    "</span>\n" +
    "</div>\n" +
    "<fieldset class=\"mar-top-md\">\n" +
    "<div>\n" +
    "<div class=\"form-group\" id=\"certificate-file\">\n" +
    "<label translate>Certificate</label>\n" +
    "<osc-file-input model=\"route.tls.certificate\" drop-zone-id=\"certificate-file\" show-text-area=\"true\" help-text=\"{{'The PEM format certificate. Upload file by dragging & dropping, selecting it, or pasting from the clipbard.'|translate}}\" ng-disabled=\"disableCertificateInputs()\">\n" +
    "</osc-file-input>\n" +
    "</div>\n" +
    "<div class=\"form-group\" id=\"private-key-file\">\n" +
    "<label translate>Private Key</label>\n" +
    "<osc-file-input model=\"route.tls.key\" drop-zone-id=\"private-key-file\" show-text-area=\"true\" help-text=\"{{'The PEM format key. Upload file by dragging & dropping, selecting it, or pasting from the clipboard.'|translate}}\" ng-disabled=\"disableCertificateInputs()\">\n" +
    "</osc-file-input>\n" +
    "</div>\n" +
    "<div class=\"form-group\" id=\"ca-certificate-file\">\n" +
    "<label translate>CA Certificate</label>\n" +
    "<osc-file-input model=\"route.tls.caCertificate\" drop-zone-id=\"ca-certificate-file\" show-text-area=\"true\" help-text=\"{{'The PEM format CA certificate. Upload file by dragging & dropping, selecting it, or pasting from the clipboard.'|translate}}\" ng-disabled=\"disableCertificateInputs()\">\n" +
    "</osc-file-input>\n" +
    "</div>\n" +
    "<div class=\"form-group\" id=\"dest-ca-certificate-file\">\n" +
    "<label translate>Destination CA Certificate</label>\n" +
    "<osc-file-input model=\"route.tls.destinationCACertificate\" show-text-area=\"true\" drop-zone-id=\"dest-ca-certificate-file\" help-text=\"{{'The PEM format CA certificate to validate the endpoint certificate for re-encrypt termination. Upload file by dragging & dropping, selecting it, or pasting from the clipboard.'|translate}}\" ng-disabled=\"route.tls.termination !== 'reencrypt'\">\n" +
    "</osc-file-input>\n" +
    "\n" +
    "<div ng-if=\"route.tls.destinationCACertificate && route.tls.termination !== 'reencrypt' && !showCertificatesNotUsedWarning\" class=\"has-warning\">\n" +
    "<span class=\"help-block\">\n" +
    "<translate>The destination CA certificate will be removed from the route.</translate>\n" +
    "<translate>Destination CA certificates are only used for re-encrypt termination.</translate>\n" +
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
    "<label class=\"input-label\" translate>\n" +
    "{{displayType | startCase}} Secret\n" +
    "</label>\n" +
    "</div>\n" +
    "<div ng-repeat=\"pickedSecret in pickedSecrets\">\n" +
    "<div class=\"secret-row\">\n" +
    "<div class=\"secret-name\">\n" +
    "<ui-select ng-disabled=\"disableInput\" ng-model=\"pickedSecret.name\">\n" +
    "<ui-select-match placeholder=\"{{'Secret name'|translate}}\">{{$select.selected}}</ui-select-match>\n" +
    "<ui-select-choices repeat=\"secret in (secretsByType[type] | filter : $select.search)\">\n" +
    "<div ng-bind-html=\"secret | highlight : $select.search\"></div>\n" +
    "</ui-select-choices>\n" +
    "</ui-select>\n" +
    "</div>\n" +
    "<div class=\"remove-secret\">\n" +
    "<a ng-click=\"removeSecret($index)\" href=\"\" role=\"button\" class=\"btn-remove\">\n" +
    "<span class=\"pficon pficon-close\" aria-hidden=\"true\"></span>\n" +
    "<span class=\"sr-only\" translate>Remove build secret</span>\n" +
    "</a>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"help-blocks\" ng-switch=\"displayType\">\n" +
    "<div class=\"help-block\" ng-switch-when=\"source\">\n" +
    "<translate>Secret with credentials for pulling your source code.</translate>\n" +
    "<a href=\"{{'git_secret' | helpLink}}\" target=\"_blank\"><span class=\"learn-more-inline\"><translate>Learn More</translate>&nbsp;<i class=\"fa fa-external-link\" aria-hidden=\"true\"></i></span></a>\n" +
    "</div>\n" +
    "<div class=\"help-block\" ng-switch-when=\"pull\">\n" +
    "<translate>Secret for authentication when pulling images from a secured registry.</translate>\n" +
    "<a href=\"{{'pull_secret' | helpLink}}\" target=\"_blank\"><span class=\"learn-more-inline\"><translate>Learn More</translate>&nbsp;<i class=\"fa fa-external-link\" aria-hidden=\"true\"></i></span></a>\n" +
    "</div>\n" +
    "<div class=\"help-block\" ng-switch-when=\"push\">\n" +
    "<translate>Secret for authentication when pushing images to a secured registry.</translate>\n" +
    "<a href=\"{{'pull_secret' | helpLink}}\" target=\"_blank\"><span class=\"learn-more-inline\"><translate>Learn More</translate>&nbsp;<i class=\"fa fa-external-link\" aria-hidden=\"true\"></i></span></a>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"osc-secret-actions\" ng-if=\"!disableInput\">\n" +
    "<span ng-if=\"canAddSourceSecret()\">\n" +
    "<a href=\"\" role=\"button\" ng-click=\"addSourceSecret()\" translate>Add Another Secret</a>\n" +
    "<span ng-if=\"'secrets' | canI : 'create'\" class=\"action-divider\">|</span>\n" +
    "</span>\n" +
    "<a href=\"\" ng-if=\"'secrets' | canI : 'create'\" role=\"button\" ng-click=\"openCreateSecretModal()\" translate>Create New Secret</a>\n" +
    "</div>\n" +
    "</ng-form>"
  );


  $templateCache.put('views/directives/osc-source-secrets.html',
    "<ng-form name=\"secretsForm\" class=\"osc-secrets-form\">\n" +
    "<div ng-if=\"strategyType !== 'Custom'\">\n" +
    "<div class=\"form-group\">\n" +
    "<div class=\"advanced-secrets\">\n" +
    "<div class=\"input-labels\">\n" +
    "<label class=\"input-label\" translate>\n" +
    "Build Secret\n" +
    "</label>\n" +
    "<label class=\"input-label\" translate>\n" +
    "Destination Directory\n" +
    "</label>\n" +
    "</div>\n" +
    "<div ng-repeat=\"pickedSecret in pickedSecrets\">\n" +
    "<div class=\"secret-row\">\n" +
    "<div class=\"secret-name\">\n" +
    "<ui-select ng-required=\"pickedSecret.destinationDir\" ng-model=\"pickedSecret.secret.name\">\n" +
    "<ui-select-match placeholder=\"{{'Secret name'|translate}}\">{{$select.selected}}</ui-select-match>\n" +
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
    "<span class=\"sr-only\" translate>Remove build secret</span>\n" +
    "</a>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"help-blocks\">\n" +
    "<div class=\"help-block\" translate>Source secret to copy into the builder pod at build time.</div>\n" +
    "<div class=\"help-block\" translate>Directory where the files will be available at build time.</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"strategyType === 'Custom'\">\n" +
    "<div class=\"form-group\">\n" +
    "<div class=\"advanced-secrets\">\n" +
    "<div class=\"input-labels\">\n" +
    "<label class=\"input-label\" translate>\n" +
    "Build Secret\n" +
    "</label>\n" +
    "<label class=\"input-label\" translate>\n" +
    "Mount path\n" +
    "</label>\n" +
    "</div>\n" +
    "<div ng-repeat=\"pickedSecret in pickedSecrets\">\n" +
    "<div class=\"secret-row\">\n" +
    "<div class=\"secret-name\">\n" +
    "<ui-select ng-required=\"pickedSecret.mountPath\" ng-model=\"pickedSecret.secretSource.name\">\n" +
    "<ui-select-match placeholder=\"{{'Secret name'|translate}}\">{{$select.selected}}</ui-select-match>\n" +
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
    "<span class=\"sr-only\" translate>Remove build secret</span>\n" +
    "</a>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"help-blocks\">\n" +
    "<div class=\"help-block\" translate>Source secret to mount into the builder pod at build time.</div>\n" +
    "<div class=\"help-block\" translate>Path at which to mount the secret.</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"osc-secret-actions\">\n" +
    "<span ng-if=\"canAddSourceSecret()\">\n" +
    "<a href=\"\" role=\"button\" ng-click=\"addSourceSecret()\" translate>Add Another Secret</a>\n" +
    "<span ng-if=\"'secrets' | canI : 'create'\" class=\"action-divider\">|</span>\n" +
    "</span>\n" +
    "<a href=\"\" ng-if=\"'secrets' | canI : 'create'\" role=\"button\" ng-click=\"openCreateSecretModal()\" translate>Create New Secret</a>\n" +
    "</div>\n" +
    "</ng-form>"
  );


  $templateCache.put('views/directives/pause-rollouts-checkbox.html',
    "<div ng-if=\"alwaysVisible || !missingConfigChangeTrigger\" class=\"form-group pause-rollouts-checkbox\">\n" +
    "<div class=\"checkbox\">\n" +
    "<label>\n" +
    "<input type=\"checkbox\" ng-disabled=\"disabled\" ng-model=\"deployment.spec.paused\" aria-describedby=\"pause-help\" translate>\n" +
    "Pause rollouts for this {{deployment.kind | humanizeKind}}\n" +
    "</label>\n" +
    "<div id=\"pause-help\" class=\"help-block\">\n" +
    "<translate>Pausing lets you make changes without triggering a rollout. You can resume rollouts at any time.</translate>\n" +
    "<span ng-if=\"!alwaysVisible\" translate>If unchecked, a new rollout will start on save.</span>\n" +
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
    "<div ng-attr-id=\"{{chartId}}\" class=\"pod-donut\" ng-class=\"{ mini: mini }\"></div>\n" +
    "<div ng-if=\"mini\" class=\"donut-mini-text\">\n" +
    "<span ng-if=\"!idled\">\n" +
    "{{total}}\n" +
    "<span ng-if=\"total === 1\">pod</span>\n" +
    "<span ng-if=\"total !== 1\">pods</span>\n" +
    "</span>\n" +
    "<span ng-if=\"idled\" translate>\n" +
    "Idle\n" +
    "</span>\n" +
    "</div>\n" +
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
    "<a href=\"\" ng-click=\"showComputeUnitsHelp()\" translate>About Compute Resources</a>\n" +
    "</div>\n" +
    "\n" +
    "<div ng-if=\"pod.spec.containers.length\" class=\"form-group\">\n" +
    "<label for=\"selectContainer\">Container:</label>\n" +
    "<div class=\"select-container\" ng-class=\"{ 'multiple-containers' : pod.spec.containers.length > 1 }\">\n" +
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
    "<label for=\"timeRange\" translate>Time Range:</label>\n" +
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
    "<div ng-if=\"loaded && noData && !metricsError\" class=\"mar-top-md\" translate>No metrics to display.</div>\n" +
    "<div ng-if=\"metricsError\" class=\"empty-state-message text-center\">\n" +
    "<h2>\n" +
    "<span class=\"pficon pficon-error-circle-o\" aria-hidden=\"true\"></span>\n" +
    "<translate>Metrics are not available.</translate>\n" +
    "</h2>\n" +
    "<p translate>\n" +
    "An error occurred getting metrics<span ng-if=\"options.selectedContainer.name\"> for container {{options.selectedContainer.name}}</span><span ng-if=\"metricsURL\"> from <a ng-href=\"{{metricsURL}}\">{{metricsURL}}</a></span>.\n" +
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
    "<col class=\"col-sm-3\">\n" +
    "</colgroup>\n" +
    "<thead>\n" +
    "<tr>\n" +
    "<th>{{customNameHeader || 'Name'|translate}}</th>\n" +
    "<th translate>Status</th>\n" +
    "<th translate>Containers Ready</th>\n" +
    "<th translate>Container Restarts</th>\n" +
    "<th translate>Age</th>\n" +
    "<th ng-if=\"activePods\" translate>Receiving Traffic</th>\n" +
    "</tr>\n" +
    "</thead>\n" +
    "<tbody ng-if=\"!sortedPods.length\">\n" +
    "<tr><td colspan=\"{{activePods ? 6 : 5}}\"><em ng-if=\"emptyMessage\">{{emptyMessage|translate}}</em><em ng-if=\"!emptyMessage\" translate>No pods to show</em></td></tr>\n" +
    "</tbody>\n" +
    "<tbody ng-if=\"sortedPods.length\">\n" +
    "<tr ng-repeat=\"pod in sortedPods track by (pod | uid)\" class=\"animate-repeat\">\n" +
    "<td data-title=\"{{customNameHeader || 'Name'}}\">\n" +
    "<a href=\"{{pod | navigateResourceURL}}\">{{pod.metadata.name}}</a>\n" +
    "<span ng-if=\"pod | isDebugPod\">\n" +
    "<i class=\"fa fa-bug info-popover\" aria-hidden=\"true\" data-toggle=\"popover\" data-trigger=\"hover\" dynamic-content=\"Debugging pod {{pod | debugPodSourceName}}\"></i>\n" +
    "<span class=\"sr-only\" translate>Debugging pod {{pod | debugPodSourceName}}</span>\n" +
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
    "<span class=\"sr-only\" translate>Yes</span>\n" +
    "</span>\n" +
    "<span ng-if=\"!activePods[pod.metadata.name]\">\n" +
    "<span data-toggle=\"popover\" data-trigger=\"hover\" data-content=\"{{podFailureReasons[pod.status.phase] || 'This pod has no endpoints and is not accepting traffic.'}}\" style=\"cursor: help\">\n" +
    "<span class=\"fa fa-fw fa-times text-danger\" aria-hidden=\"true\" data-toggle=\"tooltip\" style=\"cursor: help\"></span>\n" +
    "<span class=\"sr-only\" translate>No</span>\n" +
    "</span>\n" +
    "</span>\n" +
    "</td>\n" +
    "</tr>\n" +
    "</tbody>\n" +
    "</table>"
  );


  $templateCache.put('views/directives/process-template-dialog.html',
    "<div class=\"order-service\">\n" +
    "<div pf-wizard hide-header=\"true\" hide-sidebar=\"true\" hide-back-button=\"true\" step-class=\"order-service-wizard-step\" wizard-ready=\"$ctrl.wizardReady\" next-title=\"$ctrl.nextTitle\" next-callback=\"$ctrl.next\" on-finish=\"$ctrl.close()\" on-cancel=\"$ctrl.close()\" wizard-done=\"$ctrl.wizardDone\" current-step=\"$ctrl.currentStep\" class=\"pf-wizard-no-back\">\n" +
    "<div pf-wizard-step ng-repeat=\"step in $ctrl.steps track by step.id\" step-title=\"{{step.label}}\" wz-disabled=\"{{step.hidden}}\" allow-click-nav=\"step.allowed\" next-enabled=\"step.valid\" prev-enabled=\"step.prevEnabled\" on-show=\"step.onShow\" step-id=\"{{step.id}}\" step-priority=\"{{$index}}\">\n" +
    "<div class=\"wizard-pf-main-inner-shadow-covers\">\n" +
    "<div class=\"order-service-details\">\n" +
    "<div class=\"order-service-details-top\">\n" +
    "<div class=\"service-icon\">\n" +
    "<span class=\"icon {{$ctrl.iconClass}}\"></span>\n" +
    "</div>\n" +
    "<div class=\"service-title-area\">\n" +
    "<div class=\"service-title\">\n" +
    "{{$ctrl.template | displayName}}\n" +
    "</div>\n" +
    "<div class=\"order-service-tags\">\n" +
    "<span ng-repeat=\"tag in $ctrl.template.metadata.annotations.tags.split(',')\" class=\"tag\">\n" +
    "{{tag}}\n" +
    "</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"order-service-description-block\">\n" +
    "<p ng-bind-html=\"$ctrl.template | description | linky : '_blank'\" class=\"description\"></p>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"order-service-config\">\n" +
    "<div ng-if=\"step.selected\" ng-include=\"step.view\" class=\"wizard-pf-main-form-contents\"></div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/directives/process-template-dialog/process-template-config.html',
    "<div class=\"osc-form\">\n" +
    "<form name=\"$ctrl.form\">\n" +
    "<process-template template=\"$ctrl.template\" is-dialog=\"true\"></process-template>\n" +
    "</form>\n" +
    "</div>"
  );


  $templateCache.put('views/directives/process-template-dialog/process-template-results.html',
    "<next-steps project=\"$ctrl.selectedProject\" project-name=\"$ctrl.selectedProject.metadata.name\" login-base-url=\"$ctrl.loginBaseUrl\">\n" +
    "</next-steps>"
  );


  $templateCache.put('views/directives/process-template.html',
    "<fieldset ng-disabled=\"disableInputs\">\n" +
    "<ng-form name=\"$ctrl.templateForm\">\n" +
    "<template-options is-dialog=\"$ctrl.isDialog\" parameters=\"$ctrl.template.parameters\" expand=\"true\" can-toggle=\"false\">\n" +
    "<select-project ng-if=\"!$ctrl.project\" selected-project=\"$ctrl.selectedProject\" name-taken=\"$ctrl.projectNameTaken\"></select-project>\n" +
    "</template-options>\n" +
    "<label-editor labels=\"$ctrl.labels\" system-labels=\"$ctrl.systemLabels\" expand=\"true\" can-toggle=\"false\" help-text=\"{{'Each label is applied to each created resource.'|translate}}\">\n" +
    "</label-editor>\n" +
    "<div ng-if=\"!$ctrl.isDialog\" class=\"buttons gutter-top-bottom\">\n" +
    "<button class=\"btn btn-primary btn-lg\" ng-click=\"$ctrl.createFromTemplate()\" ng-disabled=\"$ctrl.templateForm.$invalid || $ctrl.disableInputs\" translate>Create</button>\n" +
    "<a class=\"btn btn-default btn-lg\" href=\"\" ng-click=\"$ctrl.cancel()\" role=\"button\" translate>Cancel</a>\n" +
    "</div>\n" +
    "</ng-form>\n" +
    "</fieldset>"
  );


  $templateCache.put('views/directives/replicas.html',
    "<span ng-show=\"!model.editing\">\n" +
    "<span ng-if=\"status === undefined\" translate>{{spec}} replica<span ng-if=\"spec !== 1\">s</span></span>\n" +
    "<span ng-if=\"status !== undefined\" translate>{{status}} current / {{spec}} desired</span>\n" +
    "<a href=\"\" title=\"Edit\" class=\"action-button\" ng-if=\"!disableScaling && scaleFn && (deployment | canIScale)\" ng-click=\"model.desired = spec; model.editing = true\">\n" +
    "<i class=\"pficon pficon-edit mar-left-sm\"></i>\n" +
    "<span class=\"sr-only\" translate>Edit</span>\n" +
    "</a>\n" +
    "</span>\n" +
    "<span ng-show=\"!disableScaling && model.editing\">\n" +
    "<form name=\"form.scaling\" ng-submit=\"scale()\" class=\"form-inline\">\n" +
    "<span ng-class=\"{'has-error': form.scaling.$invalid}\">\n" +
    "<input type=\"number\" name=\"desired\" ng-model=\"model.desired\" ng-required=\"true\" min=\"0\" ng-pattern=\"/^\\-?\\d+$/\" focus-when=\"{{model.editing}}\" select-on-focus class=\"input-number\">\n" +
    "</span>\n" +
    "<a href=\"\" title=\"Scale\" class=\"action-button\" ng-attr-aria-disabled=\"{{form.scaling.$invalid ? 'true' : undefined}}\" ng-click=\"scale()\" role=\"button\">\n" +
    "<i class=\"fa fa-check\" style=\"margin-left: 5px\"></i>\n" +
    "<span class=\"sr-only\" translate>Scale</span>\n" +
    "</a>\n" +
    "<a href=\"\" title=\"Cancel\" class=\"action-button\" ng-click=\"cancel()\" role=\"button\">\n" +
    "<i class=\"fa fa-times\" style=\"margin-left: 5px\"></i>\n" +
    "<span class=\"sr-only\" translate>Cancel</span>\n" +
    "</a>\n" +
    "<div ng-if=\"form.scaling.$invalid\" class=\"has-error\">\n" +
    "<div ng-if=\"form.scaling.desired.$error.required\" class=\"help-block\" translate>\n" +
    "A value for replicas is required.\n" +
    "</div>\n" +
    "<div ng-if=\"form.scaling.desired.$error.pattern\" class=\"help-block\" translate>\n" +
    "Replicas must be a whole number.\n" +
    "</div>\n" +
    "<div ng-if=\"form.scaling.desired.$error.min\" class=\"help-block\" translate>\n" +
    "Replicas can't be negative.\n" +
    "</div>\n" +
    "</div>\n" +
    "</form>\n" +
    "</span>"
  );


  $templateCache.put('views/directives/route-service-bar-chart.html',
    "<div class=\"route-service-bar-chart\">\n" +
    "<h5 translate>Traffic Split</h5>\n" +
    "<div ng-repeat=\"backend in routeServices.backends\">\n" +
    "<div class=\"service-name\" title=\"{{backend.name}}\">\n" +
    "{{backend.name}}\n" +
    "</div>\n" +
    "<div class=\"progress progress-xs\" ng-class=\"{ 'highlight': backend.name === routeServices.highlightService }\">\n" +
    "<div class=\"progress-bar\" ng-style=\"{ width: routeServices.barWidth(backend) }\"></div>\n" +
    "</div>\n" +
    "<div class=\"service-weight\">\n" +
    "{{routeServices.getPercentage(backend)}}\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/directives/select-containers.html',
    "<ng-form name=\"forms.containerSelect\">\n" +
    "<div class=\"checkbox\" ng-repeat=\"container in template.spec.containers\">\n" +
    "<label class=\"truncate\">\n" +
    "<input type=\"checkbox\" ng-model=\"containers[container.name]\" ng-required=\"required && !containerSelected\">\n" +
    "<b>{{container.name}}</b>\n" +
    "<span class=\"hidden-xs\">\n" +
    "<translate>from image</translate>\n" +
    "<i ng-attr-title=\"{{container.image}}\">{{container.image}}</i>\n" +
    "</span>\n" +
    "</label>\n" +
    "</div>\n" +
    "<div ng-if=\"helpText\" class=\"help-block\">\n" +
    "{{helpText}}\n" +
    "</div>\n" +
    "<div class=\"has-error\" ng-if=\"required && forms.containerSelect.$dirty && !containerSelected\">\n" +
    "<span class=\"help-block\" translate>\n" +
    "You must select at least one container.\n" +
    "</span>\n" +
    "</div>\n" +
    "</ng-form>"
  );


  $templateCache.put('views/directives/selector.html',
    "<div ng-if=\"!selector\" translate>none</div>\n" +
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


  $templateCache.put('views/directives/traffic-table.html',
    " <table class=\"table table-bordered table-hover table-mobile\">\n" +
    "<thead>\n" +
    "<tr>\n" +
    "<th>{{customNameHeader || 'Route'}}<span ng-if=\"showNodePorts\" translate> / Node Port</span></th>\n" +
    "<th role=\"presentation\"></th>\n" +
    "<th translate>Service Port</th>\n" +
    "<th role=\"presentation\"></th>\n" +
    "<th translate>Target Port</th>\n" +
    "<th translate>Hostname</th>\n" +
    "<th translate>TLS Termination</th>\n" +
    "</tr>\n" +
    "</thead>\n" +
    "<tbody ng-if=\"(portsByRoute | hashSize) == 0\">\n" +
    "<tr><td colspan=\"7\"><em translate>No routes or ports to show</em></td></tr>\n" +
    "</tbody>\n" +
    "<tbody ng-if=\"(portsByRoute | hashSize) > 0\">\n" +
    "<tr ng-repeat-start=\"(routeName,ports) in portsByRoute\" style=\"display: none\"></tr>\n" +
    "<tr ng-repeat=\"port in ports\" ng-if=\"routeName !== ''\">\n" +
    "<td data-title=\"{{customNameHeader || 'Route'}}{{ showNodePorts ? ' / Node Port' : '' }}\">\n" +
    "<a href=\"{{routes[routeName] | navigateResourceURL}}\">{{routes[routeName].metadata.name}}</a>\n" +
    "<route-warnings ng-if=\"routes[routeName].spec.to.kind !== 'Service' || services\" route=\"routes[routeName]\" services=\"services\">\n" +
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
    "<span ng-if=\"!routes[routeName].status.ingress\" data-toggle=\"popover\" data-trigger=\"hover\" data-content=\"{{'The route is not accepting traffic yet because it has not been admitted by a router.'|translate}}\" style=\"cursor: help; padding-left: 5px\">\n" +
    "<status-icon status=\"'Pending'\"></status-icon>\n" +
    "<span class=\"sr-only\" translate>Pending</span>\n" +
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
    "<td data-title=\"Hostname\"><span class=\"text-muted\" translate>none</span></td>\n" +
    "<td data-title=\"Termination\">\n" +
    "<span class=\"text-muted\" translate>none</span>\n" +
    "</td>\n" +
    "</tr>\n" +
    "</tbody>\n" +
    "</table>"
  );


  $templateCache.put('views/directives/unbind-service.html',
    "<div class=\"bind-service-wizard unbind-service\">\n" +
    "<div pf-wizard hide-header=\"true\" hide-sidebar=\"true\" hide-back-button=\"true\" step-class=\"bind-service-wizard-step\" wizard-ready=\"ctrl.wizardReady\" next-title=\"ctrl.nextTitle\" on-finish=\"ctrl.closeWizard()\" on-cancel=\"ctrl.closeWizard()\" wizard-done=\"ctrl.wizardComplete\" class=\"pf-wizard-no-back\">\n" +
    "<div pf-wizard-step ng-repeat=\"step in ctrl.steps track by $index\" step-title=\"{{step.label}}\" next-enabled=\"step.valid\" on-show=\"step.onShow\" step-id=\"{{step.id}}\" step-priority=\"{{$index}}\">\n" +
    "<div class=\"wizard-pf-main-inner-shadow-covers\">\n" +
    "<div class=\"bind-service-config\">\n" +
    "<div ng-include=\"step.view\" class=\"wizard-pf-main-form-contents\"></div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>"
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
    "<div ng-if=\"!targetKind || !targetName || !project\" class=\"mar-top-md\" translate>\n" +
    "Loading...\n" +
    "</div>\n" +
    "<form name=\"form\" ng-submit=\"save()\" class=\"osc-form\" ng-show=\"targetKind && targetName\">\n" +
    "<h1>\n" +
    "<translate>Autoscale</translate> {{targetKind | humanizeKind : true}} {{targetName}}\n" +
    "</h1>\n" +
    "<div class=\"help-block\" translate>\n" +
    "Scale replicas automatically based on CPU usage.\n" +
    "</div>\n" +
    "<div class=\"learn-more-block\" ng-class=\"{ 'gutter-bottom': metricsWarning || showCPURequestWarning }\">\n" +
    "<a href=\"{{'pod_autoscaling' | helpLink}}\" target=\"_blank\"><translate>Learn More</translate>&nbsp;<i class=\"fa fa-external-link\" aria-hidden> </i></a>\n" +
    "</div>\n" +
    "\n" +
    "<div ng-if=\"metricsWarning\" class=\"alert alert-warning\">\n" +
    "<span class=\"pficon pficon-warning-triangle-o\" aria-hidden=\"true\"></span>\n" +
    "<span class=\"sr-only\" translate>Warning:</span>\n" +
    "<translate>Metrics might not be configured by your cluster administrator. Metrics are required for autoscaling.</translate>\n" +
    "</div>\n" +
    "\n" +
    "<div ng-if=\"showCPURequestWarning\" class=\"alert alert-warning\">\n" +
    "<span class=\"pficon pficon-warning-triangle-o\" aria-hidden=\"true\"></span>\n" +
    "<span class=\"sr-only\" translate>Warning:</span>\n" +
    "<translate>This {{targetKind | humanizeKind}} does not have any containers with a CPU</translate>\n" +
    "<span ng-if=\"'cpu' | isRequestCalculated : project\" translate>limit</span>\n" +
    "<span ng-if=\"!('cpu' | isRequestCalculated : project)\" translate>request</span>\n" +
    "<translate>set. Autoscaling will not work without a CPU</translate>\n" +
    "<span ng-if=\"'cpu' | isRequestCalculated : project\" translate>limit.</span>\n" +
    "<span ng-if=\"!('cpu' | isRequestCalculated : project)\" translate>request.</span>\n" +
    "</div>\n" +
    "<fieldset ng-disabled=\"disableInputs\" class=\"gutter-top\">\n" +
    "<osc-autoscaling model=\"autoscaling\" project=\"project\" show-name-input=\"true\" name-read-only=\"kind === 'HorizontalPodAutoscaler'\">\n" +
    "</osc-autoscaling>\n" +
    "<label-editor labels=\"labels\" expand=\"true\" can-toggle=\"false\"></label-editor>\n" +
    "<div class=\"buttons gutter-top\">\n" +
    "<button type=\"submit\" class=\"btn btn-primary btn-lg\" ng-disabled=\"form.$invalid || form.$pristine\" translate>\n" +
    "Save\n" +
    "</button>\n" +
    "<a href=\"\" ng-click=\"cancel()\" class=\"btn btn-default btn-lg\" role=\"button\" translate>Cancel</a>\n" +
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
    "<div ng-if=\"!loaded\" translate>Loading...</div>\n" +
    "<h1>\n" +
    "<translate>Edit Build Config {{buildConfig.metadata.name}}</translate>\n" +
    "<small translate>&mdash; {{strategyType | startCase}} Build Strategy</small>\n" +
    "</h1>\n" +
    "<fieldset ng-disabled=\"disableInputs\">\n" +
    "<form class=\"edit-form\" name=\"form\" novalidate ng-submit=\"save()\">\n" +
    "<div class=\"row\">\n" +
    "<div class=\"col-lg-12\">\n" +
    "<div ng-if=\"buildConfig.spec.source.type !== 'None'\" class=\"section\">\n" +
    "<h3 translate>Source Configuration</h3>\n" +
    "<dl class=\"dl-horizontal left\">\n" +
    "<div ng-if=\"sources.git\">\n" +
    "<div class=\"row\">\n" +
    "<div ng-class=\"{\n" +
    "                              'col-lg-8': view.advancedOptions,\n" +
    "                              'col-lg-12': !view.advancedOptions}\">\n" +
    "<div class=\"form-group\">\n" +
    "<label for=\"sourceUrl\" class=\"required\" translate>Git Repository URL</label>\n" +
    "<div ng-class=\"{\n" +
    "                                  'has-warning': form.sourceUrl.$touched && !sourceURLPattern.test(updatedBuildConfig.spec.source.git.uri),\n" +
    "                                  'has-error': form.sourceUrl.$touched && form.sourceUrl.$error.required\n" +
    "                                }\">\n" +
    "\n" +
    "<input class=\"form-control\" id=\"sourceUrl\" name=\"sourceUrl\" ng-model=\"updatedBuildConfig.spec.source.git.uri\" type=\"text\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\" aria-describedby=\"source-url-help\" required>\n" +
    "</div>\n" +
    "<div class=\"help-block\" id=\"source-url-help\">\n" +
    "<translate>Git URL of the source code to build.</translate>\n" +
    "<span ng-if=\"!view.advancedOptions\" translate>If your Git repository is private, view the <a href=\"\" ng-click=\"view.advancedOptions = true\">advanced options</a> to set up authentication.</span>\n" +
    "</div>\n" +
    "<div class=\"has-error\" ng-if=\"form.sourceUrl.$touched && form.sourceUrl.$error.required\">\n" +
    "<span class=\"help-block\" translate>A Git repository URL is required.</span>\n" +
    "</div>\n" +
    "<div class=\"has-warning\" ng-if=\"updatedBuildConfig.spec.source.git.uri && form.sourceUrl.$touched && !sourceURLPattern.test(updatedBuildConfig.spec.source.git.uri)\">\n" +
    "<span class=\"help-block\" translate>This might not be a valid Git URL. Check that it is the correct URL to a remote Git repository.</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"col-lg-4\" ng-if=\"view.advancedOptions\">\n" +
    "<div class=\"form-group editor\">\n" +
    "<label for=\"sourceRef\" translate>Git Reference</label>\n" +
    "<div>\n" +
    "<input class=\"form-control\" id=\"sourceRef\" name=\"sourceRef\" type=\"text\" ng-model=\"updatedBuildConfig.spec.source.git.ref\" placeholder=\"master\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\" aria-describedby=\"source-ref-help\">\n" +
    "</div>\n" +
    "<div class=\"help-block\" id=\"source-ref-help\" translate>Optional branch, tag, or commit.</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"view.advancedOptions\">\n" +
    "<div class=\"form-group\">\n" +
    "<label for=\"sourceContextDir\" translate>Context Dir</label>\n" +
    "<div>\n" +
    "<input class=\"form-control\" id=\"sourceContextDir\" name=\"sourceContextDir\" type=\"text\" ng-model=\"updatedBuildConfig.spec.source.contextDir\" placeholder=\"/\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\" aria-describedby=\"context-dir-help\">\n" +
    "</div>\n" +
    "<div class=\"help-block\" id=\"context-dir-help\" translate>Optional subdirectory for the application source code, used as the context directory for the build.</div>\n" +
    "</div>\n" +
    "<div class=\"form-group\">\n" +
    "<osc-secrets model=\"secrets.picked.gitSecret\" namespace=\"projectName\" display-type=\"source\" type=\"source\" service-account-to-link=\"builder\" secrets-by-type=\"secrets.secretsByType\" alerts=\"alerts\">\n" +
    "</osc-secrets>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"sources.dockerfile\">\n" +
    "<div class=\"form-group\">\n" +
    "<label for=\"buildFrom\" translate>Dockerfile</label>\n" +
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
    "<label for=\"dockerfilePath\" translate>Dockerfile Path</label>\n" +
    "<div>\n" +
    "<input class=\"form-control\" id=\"dockerfilePath\" name=\"dockerfilePath\" type=\"text\" ng-model=\"updatedBuildConfig.spec.strategy.dockerStrategy.dockerfilePath\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\">\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"form-group\" ng-if=\"strategyType === 'Docker' && view.advancedOptions\">\n" +
    "<div class=\"checkbox\">\n" +
    "<label>\n" +
    "<input type=\"checkbox\" ng-model=\"options.noCache\">\n" +
    "<translate>Execute docker build without reusing cached instructions.</translate>\n" +
    "<span class=\"help action-inline\">\n" +
    "<a href=\"\">\n" +
    "<i class=\"pficon pficon-help\" data-toggle=\"tooltip\" aria-hidden=\"true\" data-original-title=\"{{'Will run the docker build with \\'--no-cache=true\\' flag'|translate}}\">\n" +
    "</i>\n" +
    "</a>\n" +
    "</span>\n" +
    "</label>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"form-groups\" ng-show=\"sources.images\">\n" +
    "<div class=\"single-image-source\" ng-if=\"sourceImages.length === 1\">\n" +
    "<div class=\"form-group\">\n" +
    "<label translate>Image Source From</label>\n" +
    "<ui-select required ng-model=\"imageOptions.fromSource.type\" search-enabled=\"false\">\n" +
    "<ui-select-match>{{$select.selected | startCase}}</ui-select-match>\n" +
    "<ui-select-choices repeat=\"type in imageSourceTypes\">\n" +
    "{{type | startCase}}\n" +
    "</ui-select-choices>\n" +
    "</ui-select>\n" +
    "</div>\n" +
    "<div class=\"form-group\" ng-if=\"imageOptions.fromSource.type==='ImageStreamTag'\">\n" +
    "<istag-select include-shared-namespace=\"true\" select-required=\"true\" model=\"imageOptions.fromSource.imageStreamTag\"></istag-select>\n" +
    "</div>\n" +
    "<div ng-if=\"imageOptions.fromSource.type==='ImageStreamImage'\" class=\"form-group\">\n" +
    "<label for=\"imageSourceImage\" translate>Image Stream Image</label>\n" +
    "<div>\n" +
    "<input class=\"form-control\" type=\"text\" ng-model=\"imageOptions.fromSource.imageStreamImage\" placeholder=\"example: openshift/ruby-20-centos7@603bfa418\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\" required>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"imageOptions.fromSource.type==='DockerImage'\" class=\"form-group\">\n" +
    "<label for=\"imageSourceLink\" translate>Docker Image Repository</label>\n" +
    "<div>\n" +
    "<input class=\"form-control\" id=\"imageSourceLink\" name=\"imageSourceLink\" type=\"text\" ng-model=\"imageOptions.fromSource.dockerImage\" placeholder=\"example: centos/ruby-20-centos7:latest\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\" required>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"form-group\">\n" +
    "<label for=\"buildFrom\"><translate>Source and Destination Paths</translate><span class=\"help action-inline\">\n" +
    "<a href=\"\">\n" +
    "<i class=\"pficon pficon-help\" data-toggle=\"tooltip\" aria-hidden=\"true\" data-original-title=\"{{'Paths is a list of source and destination paths to copy from the image. At least one pair has to be specified.'|translate}}\"></i>\n" +
    "</a>\n" +
    "</span></label>\n" +
    "<key-value-editor entries=\"imageSourcePaths\" key-placeholder=\"{{'Source Path'|translate}}\" key-validator=\"\\/.*?$\" value-placeholder=\"{{'Destination Dir'|translate}}\" key-validator-error-tooltip=\"{{'A valid Source Path is an absolute path beginning with \\'/\\''|translate}}\" add-row-link=\"Add image source path\"></key-value-editor>\n" +
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
    "<div ng-if=\"!sources.git && !sources.dockerfile && !sources.images\" translate>\n" +
    "There are no editable source types for this build config.\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"updatedBuildConfig | isJenkinsPipelineStrategy\" class=\"section\">\n" +
    "<h3 ng-class=\"{ 'with-divider': !sources.none }\" translate>Jenkins Pipeline Configuration</h3>\n" +
    "<div class=\"form-group\" ng-if=\"buildConfig.spec.source.type === 'Git'\">\n" +
    "<label for=\"jenkinsfile-type\" translate>Jenkinsfile Type</label>\n" +
    "<ui-select search-enabled=\"false\" ng-model=\"jenkinsfileOptions.type\" input-id=\"jenkinsfile-type\" aria-describedby=\"jenkinsfile-type-help\">\n" +
    "<ui-select-match>{{$select.selected.title}}</ui-select-match>\n" +
    "<ui-select-choices repeat=\"type.id as type in jenkinsfileTypes\">\n" +
    "{{type.title}}\n" +
    "</ui-select-choices>\n" +
    "</ui-select>\n" +
    "<div class=\"help-block\" id=\"jenkinsfile-type-help\" translate>\n" +
    "Use a Jenkinsfile from the source repository or specify the Jenkinsfile content directly in the build configuration.\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"jenkinsfileOptions.type === 'path'\" class=\"form-group\">\n" +
    "<label for=\"jenkinsfilePath\" translate>Jenkinsfile Source Path</label>\n" +
    "<input class=\"form-control\" id=\"jenkinsfilePath\" name=\"jenkinsfilePath\" type=\"text\" ng-model=\"updatedBuildConfig.spec.strategy.jenkinsPipelineStrategy.jenkinsfilePath\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\" aria-describedby=\"jenkinsfile-path-help\">\n" +
    "<div class=\"help-block\" id=\"jenkinsfile-path-help\">\n" +
    "<translate>Optional path to the Jenkinsfile relative to the context dir.</translate>\n" +
    "<translate>Defaults to the Jenkinsfile in context dir.</translate>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"jenkinsfileOptions.type === 'inline'\">\n" +
    "<label translate>Jenkinsfile</label>\n" +
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
    "<a ng-if=\"!view.jenkinsfileExamples\" href=\"\" ng-click=\"view.jenkinsfileExamples = true\" translate>What's a Jenkinsfile?</a>\n" +
    "</div>\n" +
    "<div ng-if=\"view.jenkinsfileExamples\" class=\"editor-examples\">\n" +
    "<div class=\"pull-right mar-top-md\">\n" +
    "<a href=\"\" ng-click=\"view.jenkinsfileExamples = false\" translate>Hide examples</a>\n" +
    "</div>\n" +
    "<h4 translate>Jenkinsfile Examples</h4>\n" +
    "<ng-include src=\"'views/edit/jenkinsfile-examples.html'\"></ng-include>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"sources.none && !(updatedBuildConfig | isJenkinsPipelineStrategy)\">\n" +
    "<div class=\"form-group\">\n" +
    "<i translate>No source inputs have been defined for this build configuration.</i>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"strategyType !== 'JenkinsPipeline'\" class=\"section\">\n" +
    "<h3 class=\"with-divider\" translate>Image Configuration</h3>\n" +
    "<dl class=\"dl-horizontal left\">\n" +
    "<div>\n" +
    "<div class=\"form-group\">\n" +
    "<label for=\"buildFrom\" translate>Build From</label>\n" +
    "<ui-select required ng-model=\"imageOptions.from.type\" search-enabled=\"false\">\n" +
    "<ui-select-match>{{$select.selected | startCase}}</ui-select-match>\n" +
    "<ui-select-choices repeat=\"type in buildFromTypes\">\n" +
    "{{type | startCase}}\n" +
    "</ui-select-choices>\n" +
    "</ui-select>\n" +
    "</div>\n" +
    "<div class=\"form-group\" ng-if=\"imageOptions.from.type==='ImageStreamTag'\">\n" +
    "<istag-select include-shared-namespace=\"true\" select-required=\"true\" model=\"imageOptions.from.imageStreamTag\"></istag-select>\n" +
    "</div>\n" +
    "<div ng-if=\"imageOptions.from.type==='DockerImage'\" class=\"form-group\">\n" +
    "<label for=\"FromTypeLink\" translate>Docker Image Repository</label>\n" +
    "<div>\n" +
    "<input class=\"form-control\" type=\"text\" ng-model=\"imageOptions.from.dockerImage\" autocorrect=\"off\" autocapitalize=\"off\" placeholder=\"example: centos/ruby-20-centos7:latest\" spellcheck=\"false\" required>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"imageOptions.from.type==='ImageStreamImage'\" class=\"form-group\">\n" +
    "<label for=\"FromTypeImage\" translate>Image Stream Image</label>\n" +
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
    "<translate>Always pull the builder image from the docker registry, even if it is present locally</translate>\n" +
    "</label>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div>\n" +
    "<div class=\"form-group\">\n" +
    "<label for=\"buildFrom\" translate>Push To</label>\n" +
    "<ui-select required ng-model=\"imageOptions.to.type\" search-enabled=\"false\">\n" +
    "<ui-select-match>{{$select.selected | startCase}}</ui-select-match>\n" +
    "<ui-select-choices repeat=\"type in pushToTypes\">\n" +
    "{{type | startCase}}\n" +
    "</ui-select-choices>\n" +
    "</ui-select>\n" +
    "</div>\n" +
    "<div class=\"form-group\" ng-if=\"imageOptions.to.type==='ImageStreamTag'\">\n" +
    "<istag-select model=\"imageOptions.to.imageStreamTag\" select-required=\"true\" allow-custom-tag=\"true\"></istag-select>\n" +
    "</div>\n" +
    "<div ng-if=\"imageOptions.to.type==='DockerImage'\" class=\"form-group\">\n" +
    "<label for=\"pushToLink\" translate>Docker Image Repository</label>\n" +
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
    "<h3 class=\"with-divider\"><translate>Environment Variables</translate><span class=\"help action-inline\">\n" +
    "<a href=\"\">\n" +
    "<i class=\"pficon pficon-help\" data-toggle=\"tooltip\" aria-hidden=\"true\" data-original-title=\"{{'Environment variables are used to configure and pass information to running containers.  These environment variables will be available during your build and at runtime.'|translate}}\"></i>\n" +
    "</a>\n" +
    "</span></h3>\n" +
    "<div>\n" +
    "<key-value-editor ng-if=\"envVars\" entries=\"envVars\" key-validator=\"[a-zA-Z_][a-zA-Z0-9_]*\" key-validator-error-tooltip=\"{{'A valid environment variable name is an alphanumeric (a-z and 0-9) string beginning with a letter that may contain underscores.'|translate}}\" add-row-link=\"Add Environment Variable\"></key-value-editor>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"sources.git || !(updatedBuildConfig | isJenkinsPipelineStrategy)\" class=\"section\">\n" +
    "\n" +
    "<div ng-show=\"view.advancedOptions\">\n" +
    "<h3 class=\"with-divider\">Triggers\n" +
    "<a ng-href=\"{{'build-triggers' | helpLink}}\" target=\"_blank\"><span class=\"learn-more-inline\"><translate>Learn More</translate>&nbsp;<i class=\"fa fa-external-link\" aria-hidden=\"true\"></i></span></a>\n" +
    "</h3>\n" +
    "<dl class=\"dl-horizontal left\">\n" +
    "<div>\n" +
    "<div ng-if=\"sources.git\">\n" +
    "<edit-webhook-triggers ng-if=\"triggers.githubWebhooks.length\" type=\"GitHub\" type-info=\"{{'The GitHub source repository must be configured to use the webhook to trigger a build when source is committed.'|translate}}\" triggers=\"triggers.githubWebhooks\" form=\"form\" bc-name=\"buildConfig.metadata.name\" project-name=\"project.metadata.name\">\n" +
    "</edit-webhook-triggers>\n" +
    "<edit-webhook-triggers ng-if=\"triggers.genericWebhooks.length\" type=\"Generic\" type-info=\"{{'A generic webhook can be triggered by any system capable of making a web request.'|translate}}\" triggers=\"triggers.genericWebhooks\" form=\"form\" bc-name=\"buildConfig.metadata.name\" project-name=\"project.metadata.name\">\n" +
    "</edit-webhook-triggers>\n" +
    "<edit-webhook-triggers ng-if=\"triggers.gitlabWebhooks.length\" type=\"GitLab\" type-info=\"{{'The GitLab source repository must be configured to use the webhook to trigger a build when source is committed.'|translate}}\" triggers=\"triggers.gitlabWebhooks\" form=\"form\" bc-name=\"buildConfig.metadata.name\" project-name=\"project.metadata.name\">\n" +
    "</edit-webhook-triggers>\n" +
    "<edit-webhook-triggers ng-if=\"triggers.bitbucketWebhooks.length\" type=\"Bitbucket\" type-info=\"{{'The Bitbucket source repository must be configured to use the webhook to trigger a build when source is committed.'|translate}}\" triggers=\"triggers.bitbucketWebhooks\" form=\"form\" bc-name=\"buildConfig.metadata.name\" project-name=\"project.metadata.name\">\n" +
    "</edit-webhook-triggers>\n" +
    "<div class=\"add-webhook\">\n" +
    "<h5 translate>Add Webhook</h5>\n" +
    "<div class=\"trigger-info\">\n" +
    "<span class=\"trigger-url\">\n" +
    "<ui-select ng-model=\"createTriggerSelect.selectedType\" search-enabled=\"false\" title=\"{{'Select a webhooke type'|translate}}\" class=\"select-webhook-type\" flex>\n" +
    "<ui-select-match placeholder=\"{{'Select a webhook type'|translate}}\">\n" +
    "{{ $select.selected.label }}\n" +
    "</ui-select-match>\n" +
    "<ui-select-choices repeat=\"option.label as option in createTriggerSelect.options\">\n" +
    "{{ option.label }}\n" +
    "</ui-select-choices>\n" +
    "</ui-select>\n" +
    "</span>\n" +
    "<span class=\"visible-xs-inline trigger-actions\">\n" +
    "<a href=\"\" ng-class=\"{disabled: !createTriggerSelect.selectedType}\" class=\"action-icon\" ng-click=\"addWebhookTrigger(createTriggerSelect.selectedType)\" role=\"button\">\n" +
    "<span class=\"fa fa-plus\" aria-hidden=\"true\" title=\"{{'Add'|translate}}\"></span>\n" +
    "<span class=\"sr-only\" translate>Add</span>\n" +
    "</a>\n" +
    "</span>\n" +
    "<span class=\"hidden-xs trigger-actions\">\n" +
    "<a href=\"\" ng-class=\"{disabled: !createTriggerSelect.selectedType}\" ng-click=\"addWebhookTrigger(createTriggerSelect.selectedType)\" role=\"button\" translate>Add</a>\n" +
    "</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "<div ng-if=\"!(updatedBuildConfig | isJenkinsPipelineStrategy)\">\n" +
    "<h5 translate>Image change</h5>\n" +
    "<div class=\"checkbox\">\n" +
    "<label>\n" +
    "<input type=\"checkbox\" ng-model=\"triggers.builderImageChangeTrigger.present\" ng-disabled=\"imageOptions.from.type === 'None'\">\n" +
    "<translate>Automatically build a new image when the builder image changes</translate>\n" +
    "<span class=\"help action-inline\">\n" +
    "<a href>\n" +
    "<i class=\"pficon pficon-help\" aria-hidden=\"true\" data-toggle=\"tooltip\" data-original-title=\"{{'Automatically building a new image when the builder image changes allows your code to always run on the latest updates.'|translate}}\">\n" +
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
    "<translate>Build Secrets</translate>\n" +
    "<a href=\"{{'source_secrets' | helpLink}}\" target=\"_blank\"><span class=\"learn-more-inline\"><translate>Learn More</translate>&nbsp;<i class=\"fa fa-external-link\" aria-hidden=\"true\"></i></span></a>\n" +
    "</h3>\n" +
    "<div class=\"form-group\">\n" +
    "<osc-source-secrets model=\"secrets.picked.sourceSecrets\" namespace=\"projectName\" secrets-by-type=\"secrets.secretsByType\" strategy-type=\"strategyType\" service-account-to-link=\"builder\" alerts=\"alerts\" display-type=\"source\" type=\"source\">\n" +
    "</osc-source-secrets>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"section mar-bottom-lg\" ng-if=\"view.advancedOptions\">\n" +
    "<h3 class=\"with-divider\"><translate>Run Policy</translate>\n" +
    "<span class=\"help action-inline\">\n" +
    "<a href=\"\">\n" +
    "<i class=\"pficon pficon-help\" data-toggle=\"tooltip\" aria-hidden=\"true\" data-original-title=\"{{'The build run policy describes the order in which the builds created from the build configuration should run.'|translate}}\"></i>\n" +
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
    "<div class=\"help-block\" ng-switch-when=\"Serial\" translate>Builds triggered from this Build Configuration will run one at the time, in the order they have been triggered.</div>\n" +
    "<div class=\"help-block\" ng-switch-when=\"Parallel\" translate>Builds triggered from this Build Configuration will run all at the same time. The order in which they will finish is not guaranteed.</div>\n" +
    "<div class=\"help-block\" ng-switch-when=\"SerialLatestOnly\" translate>Builds triggered from this Build Configuration will run one at the time. When a currently running build completes, the next build that will run is the latest build created. Other queued builds will be cancelled.</div>\n" +
    "<div class=\"help-block\" ng-switch-default translate>Builds triggered from this Build Configuration will run using the {{updatedBuildConfig.spec.runPolicy | sentenceCase}} policy.</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"!(updatedBuildConfig | isJenkinsPipelineStrategy)\" class=\"section\">\n" +
    "\n" +
    "<div ng-show=\"view.advancedOptions\">\n" +
    "<h3 class=\"with-divider\">\n" +
    "<translate>Post-Commit Hooks</translate>\n" +
    "<span class=\"help action-inline\">\n" +
    "<a href=\"{{'build-hooks' | helpLink}}\" aria-hidden=\"true\" target=\"_blank\"><span class=\"learn-more-inline\"><translate>Learn More</translate>&nbsp;<i class=\"fa fa-external-link\"></i></span></a>\n" +
    "</span>\n" +
    "</h3>\n" +
    "<div class=\"checkbox\">\n" +
    "<label>\n" +
    "<input type=\"checkbox\" ng-model=\"view.hasHooks\" aria-describedby=\"build-hooks-help\">\n" +
    "<translate>Run build hooks after image is built</translate>\n" +
    "</label>\n" +
    "<div class=\"help-block\" id=\"build-hooks-help\">\n" +
    "<translate>Build hooks allow you to run commands at the end of the build to verify the image.</translate>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"view.hasHooks\">\n" +
    "<div class=\"form-group\">\n" +
    "<label translate>Hook Types</label>\n" +
    "<ui-select ng-model=\"buildHookSelection.type\" title=\"{{'Choose a type of build hook'|translate}}\">\n" +
    "<ui-select-match>{{$select.selected.label}}</ui-select-match>\n" +
    "<ui-select-choices repeat=\"type in buildHookTypes\">\n" +
    "{{type.label}}\n" +
    "</ui-select-choices>\n" +
    "</ui-select>\n" +
    "</div>\n" +
    "<fieldset>\n" +
    "<div ng-if=\"buildHookSelection.type.id === 'script' || buildHookSelection.type.id === 'scriptArgs'\">\n" +
    "<label class=\"required\" translate>Script</label>\n" +
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
    "<label class=\"required\" translate>Command</label>\n" +
    "<edit-command args=\"updatedBuildConfig.spec.postCommit.command\" placeholder=\"{{'Add to command'|translate}}\" is-required=\"true\">\n" +
    "</edit-command>\n" +
    "</div>\n" +
    "<div ng-if=\"buildHookSelection.type.id === 'args' || buildHookSelection.type.id === 'commandArgs' || buildHookSelection.type.id === 'scriptArgs' \" ng-class=\"{ 'mar-top-lg': buildHookSelection.type.id === 'scriptArgs' }\">\n" +
    "<label class=\"required\" translate>Arguments</label>\n" +
    "<edit-command args=\"updatedBuildConfig.spec.postCommit.args\" type=\"arguments\" description=\"getArgumentsDescription()\" is-required=\"true\">\n" +
    "</edit-command>\n" +
    "</div>\n" +
    "</fieldset>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"gutter-top\">\n" +
    "<a href=\"\" ng-click=\"view.advancedOptions = !view.advancedOptions\" role=\"button\" translate>{{view.advancedOptions ? 'Hide' : 'Show'}} advanced options</a>\n" +
    "</div>\n" +
    "<div class=\"buttons gutter-top-bottom\">\n" +
    "<button type=\"submit\" class=\"btn btn-primary btn-lg\" ng-disabled=\"form.$invalid || form.$pristine || disableInputs\" translate>\n" +
    "Save\n" +
    "</button>\n" +
    "<button class=\"btn btn-default btn-lg\" ng-click=\"cancel()\" translate>Cancel</button>\n" +
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
    "<div class=\"mar-top-xl\">\n" +
    "<h1 translate>Edit Config Map {{configMap.metadata.name}}</h1>\n" +
    "<div class=\"help-block\" translate>\n" +
    "Config maps hold key-value pairs that can be used in pods to read application configuration.\n" +
    "</div>\n" +
    "<div class=\"mar-top-xl\">\n" +
    "<div ng-if=\"!loaded\" translate>Loading...</div>\n" +
    "<form ng-if=\"loaded\" name=\"forms.editConfigMapForm\">\n" +
    "<div ng-if=\"resourceChanged && !resourceDeleted && !updatingNow\" class=\"alert alert-warning\">\n" +
    "<span class=\"pficon pficon-warning-triangle-o\" aria-hidden=\"true\"></span>\n" +
    "<span class=\"sr-only\" translate>Warning:</span>\n" +
    "<translate>Config map {{configMap.metadata.name}} has changed since you started editing it.</translate>\n" +
    "<translate>You'll need to copy any changes you've made and edit the config map again.</translate>\n" +
    "</div>\n" +
    "<div ng-if=\"resourceDeleted\" class=\"alert alert-warning\">\n" +
    "<span class=\"pficon pficon-warning-triangle-o\" aria-hidden=\"true\"></span>\n" +
    "<span class=\"sr-only\" translate>Warning:</span>\n" +
    "<translate>Config map {[configMap.metadata.name}} has been deleted since you started editing it.</translate>\n" +
    "</div>\n" +
    "<fieldset ng-disabled=\"disableInputs\">\n" +
    "<edit-config-map model=\"configMap\"></edit-config-map>\n" +
    "<div class=\"button-group gutter-top gutter-bottom\">\n" +
    "<button type=\"submit\" class=\"btn btn-primary btn-lg\" ng-click=\"updateConfigMap()\" ng-disabled=\"forms.editConfigMapForm.$invalid || forms.editConfigMapForm.$pristine || disableInputs || resourceChanged || resourceDeleted\" value=\"\" translate>Save</button>\n" +
    "<a class=\"btn btn-default btn-lg\" href=\"\" ng-click=\"cancel()\" role=\"button\">Cancel</a>\n" +
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
    "<div ng-if=\"!loaded\" translate>Loading...</div>\n" +
    "<div ng-if=\"loaded\">\n" +
    "<h1 translate>\n" +
    "Edit Deployment Config {{deploymentConfig.metadata.name}}\n" +
    "</h1>\n" +
    "<fieldset ng-disabled=\"disableInputs\">\n" +
    "<form class=\"edit-form\" name=\"form\" novalidate>\n" +
    "<div class=\"row\">\n" +
    "<div class=\"col-lg-12\">\n" +
    "<div class=\"section\">\n" +
    "<h3 translate>Deployment Strategy</h3>\n" +
    "<dl class=\"dl-horizontal left\">\n" +
    "{{strategyParamsName}}\n" +
    "<div class=\"form-group strategy-name\">\n" +
    "<label class=\"picker-label\" translate>Strategy Type</label>\n" +
    "<ui-select ng-model=\"strategyData.type\" search-enabled=\"false\" ng-change=\"strategyChanged()\">\n" +
    "<ui-select-match>{{$select.selected}}</ui-select-match>\n" +
    "<ui-select-choices repeat=\"strategyType in deploymentConfigStrategyTypes\">\n" +
    "{{strategyType}}\n" +
    "</ui-select-choices>\n" +
    "</ui-select>\n" +
    "<div>\n" +
    "<span ng-switch=\"strategyData.type\">\n" +
    "<span class=\"help-block\" ng-switch-when=\"Recreate\">\n" +
    "<translate>The recreate strategy has basic rollout behavior and supports lifecycle hooks for injecting code into the deployment process.</translate>\n" +
    "<a ng-href=\"{{'recreate_strategy' | helpLink}}\" target=\"_blank\"><span class=\"learn-more-inline\"><translate>Learn More</translate>&nbsp;<i class=\"fa fa-external-link\" aria-hidden=\"true\"></i></span></a>\n" +
    "</span>\n" +
    "<span class=\"help-block\" ng-switch-when=\"Rolling\">\n" +
    "<translate>The rolling strategy will wait for pods to pass their readiness check, scale down old components and then scale up.</translate>\n" +
    "<a ng-href=\"{{'rolling_strategy' | helpLink}}\" target=\"_blank\"><span class=\"learn-more-inline\"><translate>Learn More</translate>&nbsp;<i class=\"fa fa-external-link\" aria-hidden=\"true\"></i></span></a>\n" +
    "</span>\n" +
    "<span class=\"help-block\" ng-switch-when=\"Custom\">\n" +
    "<translate>The custom strategy allows you to specify container image that will provide your own deployment behavior.</translate>\n" +
    "<a ng-href=\"{{'custom_strategy' | helpLink}}\" target=\"_blank\"><span class=\"learn-more-inline\"><translate>Learn More</translate>&nbsp;<i class=\"fa fa-external-link\" aria-hidden=\"true\"></i></span></a>\n" +
    "</span>\n" +
    "</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"strategyData.type === 'Custom'\">\n" +
    "<div class=\"form-group\">\n" +
    "<label for=\"imageName\" class=\"required\" translate>Image Name</label>\n" +
    "<div>\n" +
    "<input class=\"form-control\" id=\"imageName\" name=\"imageName\" ng-model=\"strategyData.customParams.image\" type=\"text\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\" aria-describedby=\"image-name-help\" required>\n" +
    "</div>\n" +
    "<div class=\"help-block\" id=\"image-name-help\" translate>An image that can carry out the deployment.</div>\n" +
    "</div>\n" +
    "<div class=\"form-group\">\n" +
    "<label translate>Command</label>\n" +
    "<edit-command args=\"strategyData.customParams.command\"></edit-command>\n" +
    "</div>\n" +
    "<div class=\"form-group\">\n" +
    "<label translate>Environment Variables</label>\n" +
    "<key-value-editor entries=\"strategyData.customParams.environment\" key-validator=\"[a-zA-Z_][a-zA-Z0-9_]*\" key-validator-error-tooltip=\"{{'A valid environment variable name is an alphanumeric (a-z and 0-9) string beginning with a letter that may contain underscores.'|translate}}\" value-from-selector-options=\"valueFromObjects\" add-row-link=\"Add Environment Variable\" add-row-with-selectors-link=\"Add Environment Variable Using a Config Map or Secret\"></key-value-editor>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"strategyData.type !== 'Custom'\">\n" +
    "<div class=\"form-group\">\n" +
    "<label for=\"strategyTimeout\">Timeout</label>\n" +
    "<span class=\"input-group\" ng-class=\"{ 'has-error': form.strategyTimeout.$invalid && form.strategyTimeout.$touched }\">\n" +
    "<input id=\"strategyTimeout\" type=\"number\" name=\"strategyTimeout\" ng-model=\"strategyData[strategyParamsPropertyName].timeoutSeconds\" placeholder=\"600\" ng-pattern=\"/^\\d+$/\" min=\"0\" select-on-focus class=\"form-control\" aria-describedby=\"strategyTimeout\">\n" +
    "<span class=\"input-group-addon\">seconds</span>\n" +
    "</span>\n" +
    "<div class=\"help-block\" ng-attr-id=\"strategyTimeout\" translate>\n" +
    "How long to wait for a pod to scale up before giving up.\n" +
    "</div>\n" +
    "<div ng-if=\"form.strategyTimeout.$invalid && form.strategyTimeout.$touched\" class=\"has-error\">\n" +
    "<div ng-if=\"form.strategyTimeout.$error.number\" class=\"help-block\" translate>\n" +
    "Must be a number.\n" +
    "</div>\n" +
    "<div ng-if=\"form.strategyTimeout.$error.min\" class=\"help-block\" translate>\n" +
    "Timeout can't be negative.\n" +
    "</div>\n" +
    "<span ng-if=\"form.strategyTimeout.$error.pattern && !form.strategyTimeout.$error.min\" class=\"help-block\" translate>\n" +
    "Must be a whole number.\n" +
    "</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"strategyData.type === 'Rolling'\">\n" +
    "\n" +
    "<div ng-show=\"view.advancedStrategyOptions\">\n" +
    "<div class=\"form-group\">\n" +
    "<label for=\"updatePeriod\" translate>Update Period</label>\n" +
    "<span class=\"input-group\" ng-class=\"{ 'has-error': form.updatePeriod.$invalid && form.updatePeriod.$touched }\">\n" +
    "<input id=\"updatePeriod\" type=\"number\" placeholder=\"1\" name=\"updatePeriod\" ng-model=\"strategyData[strategyParamsPropertyName].updatePeriodSeconds\" ng-pattern=\"/^\\d+$/\" min=\"0\" select-on-focus class=\"form-control\" aria-describedby=\"updatePeriod\">\n" +
    "<span class=\"input-group-addon\" translate>seconds</span>\n" +
    "</span>\n" +
    "<div class=\"help-block\" id=\"updatePeriod\" translate>\n" +
    "Time to wait between retrying to run individual pod.\n" +
    "</div>\n" +
    "<div ng-if=\"form.updatePeriod.$invalid && form.updatePeriod.$touched\" class=\"has-error\">\n" +
    "<div ng-if=\"form.updatePeriod.$error.number\" class=\"help-block\" translate>\n" +
    "Must be a number.\n" +
    "</div>\n" +
    "<div ng-if=\"form.updatePeriod.$error.min\" class=\"help-block\" translate>\n" +
    "Update period can't be negative.\n" +
    "</div>\n" +
    "<span ng-if=\"form.updatePeriod.$error.pattern && !form.updatePeriod.$error.min\" class=\"help-block\" translate>\n" +
    "Must be a whole number.\n" +
    "</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"form-group\">\n" +
    "<label for=\"interval\" translate>Interval</label>\n" +
    "<span class=\"input-group\" ng-class=\"{ 'has-error': form.interval.$invalid && form.interval.$touched }\">\n" +
    "<input id=\"interval\" type=\"number\" placeholder=\"1\" name=\"interval\" ng-model=\"strategyData[strategyParamsPropertyName].intervalSeconds\" ng-pattern=\"/^\\d+$/\" min=\"0\" select-on-focus class=\"form-control\" aria-describedby=\"interval\">\n" +
    "<span class=\"input-group-addon\" translate>seconds</span>\n" +
    "</span>\n" +
    "<div class=\"help-block\" ng-attr-id=\"interval\" translate>\n" +
    "Time to wait between polling deployment status after running a pod.\n" +
    "</div>\n" +
    "<div ng-if=\"form.interval.$invalid && form.interval.$touched\" class=\"has-error\">\n" +
    "<div ng-if=\"form.interval.$error.number\" class=\"help-block\" translate>\n" +
    "Must be a number.\n" +
    "</div>\n" +
    "<div ng-if=\"form.interval.$error.min\" class=\"help-block\" translate>\n" +
    "Interval can't be negative.\n" +
    "</div>\n" +
    "<span ng-if=\"form.interval.$error.pattern && !form.interval.$error.min\" class=\"help-block\" translate>\n" +
    "Must be a whole number.\n" +
    "</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"form-group\">\n" +
    "<label for=\"maxUnavailable\" translate>Maximum Number of Unavailable Pods</label>\n" +
    "<div ng-class=\"{ 'has-error': form.maxUnavailable.$invalid && form.maxUnavailable.$touched }\">\n" +
    "<input id=\"maxUnavailable\" type=\"text\" placeholder=\"25%\" name=\"maxUnavailable\" ng-model=\"strategyData[strategyParamsPropertyName].maxUnavailable\" ng-pattern=\"/^\\d+%?$/\" select-on-focus class=\"form-control\" aria-describedby=\"max-unavailable-help\">\n" +
    "</div>\n" +
    "<div class=\"help-block\" translate>\n" +
    "The maximum number of pods that can be unavailable during the rolling deployment. This can be either a percentage (10%) or a whole number (1).\n" +
    "</div>\n" +
    "<div ng-if=\"form.maxUnavailable.$invalid && form.maxUnavailable.$touched && form.maxUnavailable.$error.pattern\" class=\"has-error\">\n" +
    "<span class=\"help-block\" translate>\n" +
    "Must be a non-negative whole number or percentage.\n" +
    "</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"form-group\">\n" +
    "<label for=\"maxSurge\" translate>Maximum Number of Surge Pods</label>\n" +
    "<div ng-class=\"{ 'has-error': form.maxSurge.$invalid && form.maxSurge.$touched }\">\n" +
    "<input id=\"maxSurge\" type=\"text\" placeholder=\"25%\" name=\"maxSurge\" ng-model=\"strategyData[strategyParamsPropertyName].maxSurge\" ng-pattern=\"/^\\d+%?$/\" select-on-focus class=\"form-control\" aria-describedby=\"maxSurge\">\n" +
    "</div>\n" +
    "<div class=\"help-block\" translate>\n" +
    "The maximum number of pods that can be scheduled above the original number of pods while the rolling deployment is in progress. This can be either a percentage (10%) or a whole number (1).\n" +
    "</div>\n" +
    "<div ng-if=\"form.maxSurge.$invalid && form.maxSurge.$touched && form.maxSurge.$error.pattern\" class=\"has-error\">\n" +
    "<span class=\"help-block\" translate>\n" +
    "Must be a non-negative whole number or percentage.\n" +
    "</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "\n" +
    "<div ng-show=\"view.advancedStrategyOptions\">\n" +
    "<div class=\"lifecycle-hooks\">\n" +
    "<div class=\"lifecycle-hook\" id=\"pre-lifecycle-hook\">\n" +
    "<h3 translate>Pre Lifecycle Hook</h3>\n" +
    "<edit-lifecycle-hook model=\"strategyData[strategyParamsPropertyName].pre\" type=\"pre\" available-volumes=\"volumeNames\" available-containers=\"containerNames\" available-secrets=\"availableSecrets\" available-configmaps=\"availableConfigMaps\" namespace=\"projectName\">\n" +
    "</edit-lifecycle-hook>\n" +
    "</div>\n" +
    "<div ng-if=\"strategyData.type !== 'Rolling'\" class=\"lifecycle-hook\" id=\"mid-lifecycle-hook\">\n" +
    "<h3 translate>Mid Lifecycle Hook</h3>\n" +
    "<edit-lifecycle-hook model=\"strategyData[strategyParamsPropertyName].mid\" type=\"mid\" available-volumes=\"volumeNames\" available-containers=\"containerNames\" available-secrets=\"availableSecrets\" available-configmaps=\"availableConfigMaps\" namespace=\"projectName\">\n" +
    "</edit-lifecycle-hook>\n" +
    "</div>\n" +
    "<div class=\"lifecycle-hook\" id=\"post-lifecycle-hook\">\n" +
    "<h3 translate>Post Lifecycle Hook</h3>\n" +
    "<edit-lifecycle-hook model=\"strategyData[strategyParamsPropertyName].post\" type=\"post\" available-volumes=\"volumeNames\" available-containers=\"containerNames\" available-secrets=\"availableSecrets\" available-configmaps=\"availableConfigMaps\" namespace=\"projectName\">\n" +
    "</edit-lifecycle-hook>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"mar-top-lg\" ng-if=\"strategyData.type !== 'Custom'\">\n" +
    "<div ng-if=\"!view.advancedStrategyOptions\" translate>To set additional parameters or edit lifecycle hooks, view <a href=\"\" ng-click=\"view.advancedStrategyOptions = true\">advanced strategy options.</a></div>\n" +
    "<a ng-if=\"view.advancedStrategyOptions\" href=\"\" ng-click=\"view.advancedStrategyOptions = false\" translate>Hide Advanced Strategy Options</a>\n" +
    "</div>\n" +
    "</dl>\n" +
    "</div>\n" +
    "<div class=\"section\">\n" +
    "<h3 class=\"with-divider\" translate>Images</h3>\n" +
    "<dl class=\"dl-horizontal left\">\n" +
    "<div ng-repeat=\"(containerName, containerConfig) in containerConfigByName\">\n" +
    "<div class=\"container-name\">\n" +
    "<h4 translate>Container {{containerName}}</h4>\n" +
    "</div>\n" +
    "<div class=\"checkbox form-group\">\n" +
    "<label>\n" +
    "<input type=\"checkbox\" ng-model=\"containerConfig.hasDeploymentTrigger\">\n" +
    "<translate>Deploy images from an image stream tag</translate>\n" +
    "</label>\n" +
    "</div>\n" +
    "<div ng-if=\"containerConfig.hasDeploymentTrigger\">\n" +
    "<label class=\"required\" translate>Image Stream Tag</label>\n" +
    "<istag-select model=\"containerConfig.triggerData.istag\" select-required=\"true\" select-disabled=\"disableInputs\" include-shared-namespace=\"true\"></istag-select>\n" +
    "<div class=\"checkbox form-group\">\n" +
    "<label>\n" +
    "<input type=\"checkbox\" ng-model=\"containerConfig.triggerData.automatic\">\n" +
    "<translate>Automatically start a new deployment when the image changes</translate>\n" +
    "</label>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"!containerConfig.hasDeploymentTrigger\" class=\"form-group\">\n" +
    "<label for=\"imageName\" class=\"required\" translate>Image Name</label>\n" +
    "<input class=\"form-control\" id=\"imageName\" name=\"imageName\" ng-model=\"containerConfig.image\" type=\"text\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\" required>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"checkbox form-group\">\n" +
    "<label>\n" +
    "<input type=\"checkbox\" ng-model=\"triggers.hasConfigTrigger\">\n" +
    "<translate>Automatically start a new deployment when the deployment configuration changes</translate>\n" +
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
    "<div ng-if=\"!view.advancedImageOptions\" translate>To set secrets for pulling your images from private image registries, view <a href=\"\" ng-click=\"view.advancedImageOptions = true\">advanced image options.</a></div>\n" +
    "<a ng-if=\"view.advancedImageOptions\" href=\"\" ng-click=\"view.advancedImageOptions = false\" translate>Hide Advanced Image Options</a>\n" +
    "</div>\n" +
    "</dl>\n" +
    "</div>\n" +
    "<div class=\"section\">\n" +
    "<h3 class=\"with-divider\" translate>Environment Variables</h3>\n" +
    "<div ng-repeat=\"(containerName, containerConfig) in containerConfigByName\">\n" +
    "<div class=\"container-name\">\n" +
    "<h4 translate>Container {{containerName}}</h4>\n" +
    "</div>\n" +
    "<key-value-editor ng-if=\"containerConfig\" entries=\"containerConfig.env\" value-from-selector-options=\"valueFromObjects\" key-validator=\"[a-zA-Z_][a-zA-Z0-9_]*\" key-validator-error-tooltip=\"{{'A valid environment variable name is an alphanumeric (a-z and 0-9) string beginning with a letter that may contain underscores.'|translate}}\" add-row-link=\"Add Environment Variable\" add-row-with-selectors-link=\"Add Environment Variable Using a Config Map or Secret\"></key-value-editor>\n" +
    "</div>\n" +
    "</div>\n" +
    "<pause-rollouts-checkbox deployment=\"updatedDeploymentConfig\" always-visible=\"true\">\n" +
    "</pause-rollouts-checkbox>\n" +
    "<div class=\"buttons gutter-top-bottom\">\n" +
    "<button ng-click=\"save()\" class=\"btn btn-primary btn-lg\" ng-disabled=\"form.$invalid || form.$pristine || disableInputs\" translate>\n" +
    "Save\n" +
    "</button>\n" +
    "<button ng-click=\"cancel()\" class=\"btn btn-default btn-lg\" translate>Cancel</button>\n" +
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
    "<div ng-show=\"!containers.length\" class=\"mar-top-md\" translate>Loading...</div>\n" +
    "<form ng-show=\"containers.length\" name=\"form\" class=\"health-checks-form\">\n" +
    "<h1 translate>Health Checks: {{name}}</h1>\n" +
    "<div class=\"help-block\">\n" +
    "<translate>Container health is periodically checked using readiness and liveness probes.</translate>\n" +
    "<div class=\"learn-more-block\">\n" +
    "<a href=\"{{'application_health' | helpLink}}\" target=\"_blank\"><translate>Learn More</translate>&nbsp;<i class=\"fa fa-external-link\" aria-hidden=\"true\"></i></a>\n" +
    "</div>\n" +
    "</div>\n" +
    "<fieldset ng-disabled=\"disableInputs\">\n" +
    "<div ng-repeat=\"container in containers\">\n" +
    "<h2 ng-if=\"containers.length > 1\" translate>Container {{container.name}}</h2>\n" +
    "<h3 translate>Readiness Probe</h3>\n" +
    "<div class=\"help-block mar-bottom-md\" ng-if=\"$first\" translate>\n" +
    "A readiness probe checks if the container is ready to handle requests. A failed readiness probe means that a container should not receive any traffic from a proxy, even if it's running.\n" +
    "</div>\n" +
    "<div ng-if=\"!container.readinessProbe\">\n" +
    "<a href=\"\" ng-click=\"addProbe(container, 'readinessProbe')\" translate>Add Readiness Probe</a>\n" +
    "</div>\n" +
    "<div ng-if=\"container.readinessProbe\">\n" +
    "<edit-probe probe=\"container.readinessProbe\" exposed-ports=\"container.ports\" ng-if=\"container.readinessProbe\">\n" +
    "</edit-probe>\n" +
    "<p>\n" +
    "<a href=\"\" ng-click=\"removeProbe(container, 'readinessProbe')\" translate>Remove Readiness Probe</a>\n" +
    "</p>\n" +
    "</div>\n" +
    "<h3 translate>Liveness Probe</h3>\n" +
    "<div class=\"help-block mar-bottom-md\" ng-if=\"$first\" translate>\n" +
    "A liveness probe checks if the container is still running. If the liveness probe fails, the container is killed.\n" +
    "</div>\n" +
    "<div ng-if=\"!container.livenessProbe\">\n" +
    "<a href=\"\" ng-click=\"addProbe(container, 'livenessProbe')\" translate>Add Liveness Probe</a>\n" +
    "</div>\n" +
    "<div ng-if=\"container.livenessProbe\">\n" +
    "<edit-probe probe=\"container.livenessProbe\" exposed-ports=\"container.ports\">\n" +
    "</edit-probe>\n" +
    "<p>\n" +
    "<a href=\"\" ng-click=\"removeProbe(container, 'livenessProbe')\" translate>Remove Liveness Probe</a>\n" +
    "</p>\n" +
    "</div>\n" +
    "</div>\n" +
    "<pause-rollouts-checkbox ng-if=\"object | managesRollouts\" deployment=\"object\">\n" +
    "</pause-rollouts-checkbox>\n" +
    "<div class=\"button-group gutter-top gutter-bottom\">\n" +
    "<button type=\"submit\" class=\"btn btn-primary btn-lg\" ng-click=\"save()\" ng-disabled=\"form.$invalid || form.$pristine || disableInputs\" value=\"\" translate>Save</button>\n" +
    "<button class=\"btn btn-default btn-lg\" ng-click=\"cancel()\" translate>Cancel</button>\n" +
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
    "<p translate>\n" +
    "A Jenkinsfile is a Groovy script that defines your pipeline. In the Jenkinsfile, you can declare pipeline stages and run one or more steps within each stage. Here are some examples you can use in your pipelines.\n" +
    "</p>\n" +
    "<p>\n" +
    "<translate>Run an DataMan OS build and deployment:</translate>\n" +
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
    "<translate>Checkout source code and run shell commands on a node labelled <var>maven:</var></translate>\n" +
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
    "<translate>Prompt for manual input:</translate>\n" +
    "<copy-to-clipboard display-wide=\"true\" clipboard-text=\"'node {\n" +
    "  stage(\\'Approve\\') {\n" +
    "    input \\'Promote to production?\\'\n" +
    "  }\n" +
    "}\n" +
    "'\" multiline=\"true\">\n" +
    "</copy-to-clipboard>\n" +
    "</p>\n" +
    "<p>\n" +
    "<translate>Learn more about</translate>\n" +
    "<a ng-href=\"{{ 'pipeline-builds' | helpLink}}\" target=\"_blank\" translate>Pipeline Builds</a>\n" +
    "<translate>and the</translate>\n" +
    "<a ng-href=\"{{ 'pipeline-plugin' | helpLink}}\" target=\"_blank\" translate>DataMan OS Pipeline Plugin</a>.\n" +
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
    "<h1 style=\"margin-bottom: 5px\" translate>Edit Project {{project.metadata.name}}</h1>\n" +
    "<div class=\"help-block mar-bottom-lg\" translate>Update the display name and description of your project. The project's unique name cannot be modified.</div>\n" +
    "<alerts alerts=\"alerts\"></alerts>\n" +
    "<form name=\"editProjectForm\">\n" +
    "<fieldset ng-disabled=\"disableInputs\">\n" +
    "<div class=\"form-group\">\n" +
    "<label for=\"displayName\" translate>Display Name</label>\n" +
    "<input class=\"form-control input-lg\" name=\"displayName\" id=\"displayName\" placeholder=\"My Project\" type=\"text\" ng-model=\"editableFields.displayName\">\n" +
    "</div>\n" +
    "<div class=\"form-group\">\n" +
    "<label for=\"description\" translate>Description</label>\n" +
    "<textarea class=\"form-control input-lg\" name=\"description\" id=\"description\" placeholder=\"A short description.\" ng-model=\"editableFields.description\"></textarea>\n" +
    "</div>\n" +
    "<div class=\"button-group\">\n" +
    "<button type=\"submit\" class=\"btn btn-primary btn-lg\" ng-click=\"update()\" ng-disabled=\"editProjectForm.$invalid || disableInputs\" value=\"\" translate>Save</button>\n" +
    "<a class=\"btn btn-default btn-lg\" href=\"#\" back translate>Cancel</a>\n" +
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
    "<div ng-if=\"loading\" translate>\n" +
    "Loading...\n" +
    "</div>\n" +
    "<form name=\"form\">\n" +
    "<fieldset ng-disabled=\"disableInputs\" ng-if=\"!loading\">\n" +
    "<osc-routing model=\"routing\" services=\"services\" show-name-input=\"false\" host-read-only=\"true\">\n" +
    "</osc-routing>\n" +
    "<div class=\"button-group gutter-top gutter-bottom\">\n" +
    "<button type=\"submit\" class=\"btn btn-primary btn-lg\" ng-click=\"updateRoute()\" ng-disabled=\"form.$invalid || disableInputs\" value=\"\" translate>Save</button>\n" +
    "<button class=\"btn btn-default btn-lg\" ng-click=\"cancel()\" translate>Cancel</button>\n" +
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
    "<div ng-if=\"!resource\" class=\"pad-top-md\" translate>Loading...</div>\n" +
    "<div ng-if=\"resource\" class=\"pad-top-md\">\n" +
    "<h1 class=\"truncate\"><translate>Edit</translate> <span class=\"hidden-xs\">{{resource.kind | humanizeKind : true}}</span> {{resource.metadata.name}}</h1>\n" +
    "<parse-error error=\"error\" ng-if=\"error\"></parse-error>\n" +
    "<div ng-if=\"resourceChanged && !resourceDeleted && !updatingNow\" class=\"alert alert-warning\">\n" +
    "<span class=\"pficon pficon-warning-triangle-o\" aria-hidden=\"true\"></span>\n" +
    "<span class=\"sr-only\" translate>Warning:</span>\n" +
    "<translate>{{resource.kind | humanizeKind | upperFirst}} <strong>{{resource.metadata.name}}</strong> has changed since you started editing it.</translate>\n" +
    "<translate>You'll need to copy any changes you've made and edit the {{resource.kind | humanizeKind}} again.</translate>\n" +
    "</div>\n" +
    "<div ng-if=\"resourceDeleted\" class=\"alert alert-warning\">\n" +
    "<span class=\"pficon pficon-warning-triangle-o\" aria-hidden=\"true\"></span>\n" +
    "<span class=\"sr-only\" translate>Warning:</span>\n" +
    "<translate>{{resource.kind | humanizeKind | upperFirst}} <strong>{{resource.metadata.name}}</strong> has been deleted since you started editing it.</translate>\n" +
    "</div>\n" +
    "<confirm-on-exit dirty=\"modified\"></confirm-on-exit>\n" +
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
    "<button class=\"btn btn-lg btn-primary\" type=\"button\" ng-click=\"save()\" ng-disabled=\"!modified || resourceChanged || resourceDeleted || updatingNow\" translate>Save</button>\n" +
    "<button class=\"btn btn-lg btn-default\" type=\"button\" ng-disabled=\"updatingNow\" ng-click=\"cancel()\" translate>Cancel</button>\n" +
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
    "<h1 translate>Events</h1>\n" +
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
    "<translate>Image Streams</translate>\n" +
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
    "<th translate>Name</th>\n" +
    "<th translate>Docker Repo</th>\n" +
    "<th translate>Tags</th>\n" +
    "<th translate>Updated</th>\n" +
    "</tr>\n" +
    "</thead>\n" +
    "<tbody ng-if=\"(imageStreams | hashSize) == 0\">\n" +
    "<tr><td colspan=\"4\"><em>{{emptyMessage|translate}}</em></td></tr>\n" +
    "</tbody>\n" +
    "<tbody ng-if=\"(imageStreams | hashSize) > 0\">\n" +
    "<tr ng-repeat=\"imageStream in imageStreams | orderObjectsByDate : true\">\n" +
    "<td data-title=\"Name\"><a href=\"{{imageStream | navigateResourceURL}}\">{{imageStream.metadata.name}}</a></td>\n" +
    "<td data-title=\"Docker Repo\">\n" +
    "<span ng-if=\"!imageStream.status.dockerImageRepository && !imageStream.spec.dockerImageRepository\"><em translate>unknown</em></span>\n" +
    "<span ng-if=\"imageStream.status.dockerImageRepository || imageStream.spec.dockerImageRepository\">{{imageStream.status.dockerImageRepository || imageStream.spec.dockerImageRepository}}</span>\n" +
    "</td>\n" +
    "<td data-title=\"Tags\">\n" +
    "<span ng-if=\"!imageStream.status.tags.length\"><em translate>none</em></span>\n" +
    "<span ng-repeat=\"tag in imageStream.status.tags | limitTo: 4\">{{tag.tag}}<span ng-if=\"!$last\">,\n" +
    "</span></span><span ng-if=\"imageStream.status.tags.length === 5\">, {{imageStream.status.tags[4].tag}}</span><span ng-if=\"imageStream.status.tags.length > 5\" translate>, and {{imageStream.status.tags.length - 4}} others</span>\n" +
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


  $templateCache.put('views/landing-page.html',
    "<default-header class=\"top-header\"></default-header>\n" +
    "<div class=\"wrap no-sidebar\">\n" +
    "<div class=\"sidebar-left collapse navbar-collapse navbar-collapse-2\">\n" +
    "<navbar-utility-mobile></navbar-utility-mobile>\n" +
    "</div>\n" +
    "<div class=\"middle landing-page\">\n" +
    "\n" +
    "<div class=\"middle-section\">\n" +
    "<div class=\"middle-container\">\n" +
    "<div class=\"middle-content\">\n" +
    "<overlay-panel show-panel=\"template\" show-close=\"true\" handle-close=\"templateDialogClosed\">\n" +
    "<process-template-dialog ng-if=\"template\" template=\"template\" on-dialog-closed=\"templateDialogClosed\"></process-template-dialog>\n" +
    "</overlay-panel>\n" +
    "<landing-page base-project-url=\"project\" on-template-selected=\"templateSelected\">\n" +
    "<landingsearch>\n" +
    "<catalog-search catalog-items=\"catalogItems\" base-project-url=\"project\"></catalog-search>\n" +
    "</landingsearch>\n" +
    "<landingheader>\n" +
    "<div class=\"build-applications-view\">\n" +
    "<saas-list saas-offerings=\"saasOfferings\"></saas-list>\n" +
    "</div>\n" +
    "</landingheader>\n" +
    "<landingbody>\n" +
    "<services-view catalog-items=\"catalogItems\" base-project-url=\"project\"></services-view>\n" +
    "</landingbody>\n" +
    "<landingside>\n" +
    "<projects-summary base-project-url=\"project\" projects-url=\"projects\" start-tour=\"startGuidedTour\" view-edit-membership=\"viewMembership\" catalog-items=\"catalogItems\"></projects-summary>\n" +
    "</landingside>\n" +
    "</landing-page>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>"
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
    "<span ng-if=\"!(mode.edit)\" translate>Edit Membership</span>\n" +
    "<span ng-if=\"mode.edit\" translate>Done Editing</span>\n" +
    "</a>\n" +
    "<translate>Membership</translate>\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
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
    "<p translate>You do not have permission to view roles in this project.</p>\n" +
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
    "<translate>Learn More</translate> <i class=\"fa fa-external-link\" aria-hidden=\"true\"></i>\n" +
    "</a>\n" +
    "</p>\n" +
    "</div>\n" +
    "<div column class=\"content-pane\" ng-class=\"'content-' + subjectKind.name.toLowerCase()\">\n" +
    "<div class=\"col-heading item-row\" row mobile=\"column\" flex-collapse-fix>\n" +
    "<div class=\"col-name\" flex conceal=\"mobile\" ng-class=\"{ 'half-width': !mode.edit }\">\n" +
    "<h3 translate>Name</h3>\n" +
    "</div>\n" +
    "<div class=\"col-roles\" flex conceal=\"mobile\">\n" +
    "<h3 translate>Roles</h3>\n" +
    "</div>\n" +
    "<div ng-if=\"mode.edit\" class=\"col-add-role\" conceal=\"tablet\" flex-collapse-fix>\n" +
    "<h3 translate>\n" +
    "Add Another Role\n" +
    "</h3>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"(subjectKind.subjects | hashSize) === 0\">\n" +
    "<p>\n" +
    "<em translate>There are no {{ subjectKind.name | humanizeKind }}s with access to this project.</em>\n" +
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
    "<span class=\"current-user\" ng-if=\"subject.name === user.metadata.name\" translate>\n" +
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
    "<ui-select-match placeholder=\"{{'Select a role'|translate}}\">\n" +
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
    "<ui-select ng-model=\"newBinding.namespace\" on-select=\"selectProject($item, $model)\" theme=\"bootstrap\" search-enabled=\"true\" title=\"{{'Select a project'|translate}}\" class=\"select-role pad-bottom-sm\">\n" +
    "<ui-select-match placeholder=\"{{'Select a project'|translate}}\">\n" +
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
    "<ui-select ng-model=\"newBinding.name\" theme=\"bootstrap\" search-enabled=\"true\" title=\"{{'Select a service account'|translate}}\" class=\"select-role\">\n" +
    "<ui-select-match placeholder=\"{{'Service account'|translate}}\">\n" +
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
    "<ui-select-match placeholder=\"{{'Select a role'|translate}}\">\n" +
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
    "Show hidden roles</label>&nbsp;<a href=\"\" class=\"action-inline\" data-toggle=\"popover\" data-trigger=\"hover focus\" data-content=\"{{'System roles are hidden by default and do not typically need to be managed.'|translate}}\"><i class=\"pficon pficon-help\"></i></a>\n" +
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
    "<translate>Compute Resources</translate>\n" +
    "<span class=\"page-header-link\">\n" +
    "<a href=\"{{'compute_resources' | helpLink}}\" target=\"_blank\"><translate>Learn More</translate> <i class=\"fa fa-external-link\" aria-hidden=\"true\"></i></a>\n" +
    "</span>\n" +
    "</h2>\n" +
    "<div translate>\n" +
    "Each container running on a node uses compute resources like CPU and memory. You can specify how much CPU and memory a container needs to improve scheduling and performance.\n" +
    "</div>\n" +
    "<h3 translate>CPU</h3>\n" +
    "<p translate>\n" +
    "CPU is often measured in units called <var>millicores</var>. Each millicore is equivalent to <sup>1</sup>&frasl;<sub>1000</sub> of a CPU&nbsp;core.\n" +
    "</p>\n" +
    "<pre translate>\n" +
    "1000 millcores  =  1 core\n" +
    "</pre>\n" +
    "<h3 translate>Memory and Storage</h3>\n" +
    "<p translate>\n" +
    "Memory and storage are measured in binary units like <var>KiB</var>, <var>MiB</var>, <var>GiB</var>, and <var>TiB</var> or decimal units like <var>kB</var>, <var>MB</var>, <var>GB</var>, and&nbsp;<var>TB</var>.\n" +
    "</p>\n" +
    "<div class=\"row\">\n" +
    "<div class=\"col-sm-6\">\n" +
    "<h4 translate>Binary Units</h4>\n" +
    "<pre>\n" +
    "1024 bytes  =  1 KiB\n" +
    "1024 KiB    =  1 MiB\n" +
    "1024 MiB    =  1 GiB\n" +
    "1024 GiB    =  1 TiB\n" +
    "</pre>\n" +
    "</div>\n" +
    "<div class=\"col-sm-6\">\n" +
    "<h4 translate>Decimal Units</h4>\n" +
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
    "<button class=\"btn btn-lg btn-default\" type=\"button\" ng-click=\"ok()\" translate>OK</button>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/modals/confirm-replace.html',
    "<div class=\"modal-resource-action\">\n" +
    "<div class=\"modal-body\">\n" +
    "<div ng-if=\"!isList\">\n" +
    "<h1 translate>{{resourceKind}} '<strong>{{resourceName}}</strong>' already exists</h1>\n" +
    "<p translate>Do you want to replace with the new content?</p>\n" +
    "</div>\n" +
    "<div ng-if=\"isList\">\n" +
    "<h1 translate>Some items already exist:</h1>\n" +
    "<dl class=\"dl-horizontal\">\n" +
    "<dt ng-repeat-start=\"resource in updateResources\">{{resource.kind}}</dt>\n" +
    "<dd ng-repeat-end>{{resource.metadata.name}}</dd>\n" +
    "</dl>\n" +
    "<p translate>Do you want to replace the existing resources?</p>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"modal-footer\">\n" +
    "<button class=\"btn btn-lg btn-primary\" type=\"button\" ng-click=\"replace();\" translate>Replace</button>\n" +
    "<button class=\"btn btn-lg btn-default\" type=\"button\" ng-click=\"cancel();\" translate>Cancel</button>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/modals/confirm-save-log.html',
    "<div class=\"modal-resource-action\">\n" +
    "<div class=\"modal-body\">\n" +
    "<h1 translate>Save partial log for <strong>{{object.metadata.name}}</strong>?</h1>\n" +
    "<div class=\"mar-bottom-xl\">\n" +
    "<translate>The log might not be complete. Continuing will save only the content currently displayed.</translate>\n" +
    "<span ng-if=\"command\" translate>To get the complete log, run the command</span>\n" +
    "</div>\n" +
    "<copy-to-clipboard ng-if=\"command\" display-wide=\"true\" clipboard-text=\"command\"></copy-to-clipboard>\n" +
    "<div class=\"mar-top-xl\" translate>\n" +
    "Learn more about the <a href=\"command-line\" target=\"_blank\">command line tools</a>.\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"modal-footer\">\n" +
    "<button class=\"btn btn-lg btn-primary\" type=\"button\" ng-click=\"save()\" translate>Save</button>\n" +
    "<button class=\"btn btn-lg btn-default\" type=\"button\" ng-click=\"cancel()\" translate>Cancel</button>\n" +
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
    "<h1 translate>Scale down {{type}} <strong>{{resource | displayName}}</strong>?</h1>\n" +
    "<p translate>\n" +
    "Are you sure you want to scale <strong>{{resource | displayName}}</strong> to 0 replicas? This will stop all pods for the {{type}}.\n" +
    "</p>\n" +
    "</div>\n" +
    "<div class=\"modal-footer\">\n" +
    "<button class=\"btn btn-lg btn-danger\" type=\"button\" ng-click=\"confirmScale()\" translate>Scale Down</button>\n" +
    "<button class=\"btn btn-lg btn-default\" type=\"button\" ng-click=\"cancel()\" translate>Cancel</button>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/modals/create-secret.html',
    "<div class=\"create-secret-modal\">\n" +
    "<div class=\"modal-header\">\n" +
    "<h2>\n" +
    "<translate>Create {{type | capitalize}} Secret</translate>\n" +
    "<span ng-switch=\"type\">\n" +
    "<a ng-switch-when=\"source\" ng-href=\"{{'git_secret' | helpLink}}\" target=\"_blank\"><span class=\"learn-more-inline\"><translate>Learn More</translate>&nbsp;<i class=\"fa fa-external-link\" aria-hidden=\"true\"></i></span></a>\n" +
    "<a ng-switch-when=\"image\" ng-href=\"{{'pull_secret' | helpLink}}\" target=\"_blank\"><span class=\"learn-more-inline\"><translate>Learn More</translate>&nbsp;<i class=\"fa fa-external-link\" aria-hidden=\"true\"></i></span></a>\n" +
    "<a ng-switch-default ng-href=\"{{'source_secrets' | helpLink}}\" target=\"_blank\"><span class=\"learn-more-inline\"><translate>Learn More</translate>&nbsp;<i class=\"fa fa-external-link\" aria-hidden=\"true\"></i></span></a>\n" +
    "</span>\n" +
    "</h2>\n" +
    "</div>\n" +
    "<div class=\"modal-body\">\n" +
    "<create-secret type=\"type\" service-account-to-link=\"serviceAccountToLink\" namespace=\"namespace\" on-create=\"onCreate(newSecret)\" on-cancel=\"onCancel()\"></create-secret>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/modals/debug-terminal.html',
    "<div class=\"modal-debug-terminal\">\n" +
    "<div class=\"modal-header\">\n" +
    "<h2 translate>Debug Container {{container.name}}</h2>\n" +
    "<small class=\"text-muted\">\n" +
    "{{debugPod.metadata.name}} &mdash;\n" +
    "<status-icon status=\"debugPod | podStatus\"></status-icon>\n" +
    "{{debugPod | podStatus | sentenceCase}}\n" +
    "</small>\n" +
    "</div>\n" +
    "<div class=\"modal-body\">\n" +
    "<div ng-if=\"!containerState.running\" class=\"empty-state-message text-center\">\n" +
    "\n" +
    "<h2 ng-if=\"debugPod.status.phase !== 'Failed'\" class=\"text-muted\" translate>\n" +
    "Waiting for container {{container.name}} to start...\n" +
    "</h2>\n" +
    "\n" +
    "<div ng-if=\"debugPod.status.phase === 'Failed'\">\n" +
    "<h2>\n" +
    "<span class=\"pficon pficon-error-circle-o\" aria-hidden=\"true\"></span>\n" +
    "<translate>Could not start container {{container.name}}.</translate>\n" +
    "</h2>\n" +
    "<p>\n" +
    "<translate>An error occurred starting the debug pod.</translate>\n" +
    "<span ng-if=\"containerState.terminated.message\">{{containerState.terminated.message}}</span>\n" +
    "<span ng-if=\"containerState.terminated.exitCode\" class=\"text-muted\"><translate>Exit code:</translate> {{containerState.terminated.exitCode}}</span>\n" +
    "</p>\n" +
    "</div>\n" +
    "</div>\n" +
    "\n" +
    "<div ng-if=\"containerState.running\">\n" +
    "<div class=\"help-block\">\n" +
    "<translate>This temporary pod has a modified entrypoint command to debug a failing container.</translate>\n" +
    "<translate>The pod will be available for one hour and will be deleted when the terminal window is closed.</translate>\n" +
    "</div>\n" +
    "<div ng-if=\"container | entrypoint : image\" class=\"original-cmd-msg\">\n" +
    "<label translate>Original Command:</label>\n" +
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
    "<button class=\"btn btn-lg btn-primary\" type=\"button\" ng-click=\"close()\" translate>Close</button>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/modals/delete-project.html',
    "<div class=\"modal-project-delete\">\n" +
    "<div class=\"modal-body\">\n" +
    "<h1 translate>Are you sure you want to delete the project '<strong>{{project | displayName}}</strong>'?</h1>\n" +
    "<p translate>This will <strong>delete all resources</strong> associated with the project {{project | displayName}} and <strong>cannot be undone</strong>. Make sure this is something you really want to do!</p>\n" +
    "</div>\n" +
    "<div class=\"modal-footer\">\n" +
    "<button class=\"btn btn-lg btn-danger\" type=\"button\" ng-click=\"delete();\" translate>Delete this project</button>\n" +
    "<button class=\"btn btn-lg btn-default\" type=\"button\" ng-click=\"cancel();\" translate>Cancel</button>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/modals/delete-resource.html',
    "<div class=\"modal-resource-action\">\n" +
    "\n" +
    "<form>\n" +
    "<div class=\"modal-body\">\n" +
    "<h1 translate>Are you sure you want to delete the {{typeDisplayName || (kind | humanizeKind)}} '<strong>{{displayName ? displayName : resourceName}}</strong>'?</h1>\n" +
    "<p>\n" +
    "<span ng-if=\"kind === 'DeploymentConfig'\" translate>\n" +
    "This will delete the deployment config, all rollout history, and any running pods.\n" +
    "</span>\n" +
    "<span ng-if=\"kind === 'Deployment'\" translate>\n" +
    "This will delete the deployment, all rollout history, and any running pods.\n" +
    "</span>\n" +
    "<span ng-if=\"kind === 'BuildConfig'\" translate>\n" +
    "This will delete the build config and all build history.\n" +
    "</span>\n" +
    "<span ng-if=\"kind === 'ReplicationController' || kind === 'ReplicaSet' || kind === 'StatefulSet'\" translate>\n" +
    "This will delete the {{typeDisplayName || (kind | humanizeKind)}} and any running pods.\n" +
    "</span>\n" +
    "<span ng-if=\"isProject\" translate>\n" +
    "This will <strong>delete all resources</strong> associated with the project {{displayName ? displayName : resourceName}}.\n" +
    "</span>\n" +
    "<translate><strong>It cannot be undone.</strong> Make sure this is something you really want to do!</translate>\n" +
    "</p>\n" +
    "<div ng-show=\"typeNameToConfirm\">\n" +
    "<p translate>Type the name of the {{typeDisplayName || (kind | humanizeKind)}} to confirm.</p>\n" +
    "<p>\n" +
    "<label class=\"sr-only\" for=\"resource-to-delete\" translate>{{typeDisplayName || (kind | humanizeKind)}} to delete</label>\n" +
    "<input ng-model=\"confirmName\" id=\"resource-to-delete\" type=\"text\" class=\"form-control input-lg\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\" autofocus>\n" +
    "</p>\n" +
    "</div>\n" +
    "\n" +
    "<div ng-if=\"kind === 'Pod'\" class=\"checkbox\">\n" +
    "<label>\n" +
    "<input type=\"checkbox\" ng-model=\"options.deleteImmediately\">\n" +
    "<translate>Delete pod immediately without waiting for the processes to terminate gracefully</translate>\n" +
    "</label>\n" +
    "</div>\n" +
    "\n" +
    "<div ng-if=\"hpaList.length > 0\">\n" +
    "<p>\n" +
    "<span ng-if=\"hpaList.length === 1\">\n" +
    "<translate>This resource has an autoscaler associated with it.</translate>\n" +
    "<translate>It is recommended you delete the autoscaler with the resource it scales.</translate>\n" +
    "</span>\n" +
    "<span ng-if=\"hpaList.length > 1\">\n" +
    "<translate>This resource has autoscalers associated with it.</translate>\n" +
    "<translate>It is recommended you delete the autoscalers with the resource they scale.</translate>\n" +
    "</span>\n" +
    "</p>\n" +
    "<div class=\"checkbox\">\n" +
    "<label>\n" +
    "<input type=\"checkbox\" ng-model=\"options.deleteHPAs\">\n" +
    "<translate>Delete</translate>\n" +
    "<span ng-if=\"hpaList.length === 1\" translate>\n" +
    "Horizontal Pod Autoscaler '<strong>{{hpaList[0].metadata.name}}</strong>'\n" +
    "</span>\n" +
    "<span ng-if=\"hpaList.length > 1\" translate>\n" +
    "{{hpaList.length}} associated Horizontal Pod Autoscalers\n" +
    "</span>\n" +
    "</label>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"modal-footer\">\n" +
    "<button ng-disabled=\"typeNameToConfirm && confirmName !== resourceName && confirmName !== displayName\" class=\"btn btn-lg btn-danger\" type=\"submit\" ng-click=\"delete();\" translate>Delete</button>\n" +
    "<button class=\"btn btn-lg btn-default\" type=\"button\" ng-click=\"cancel();\" translate>Cancel</button>\n" +
    "</div>\n" +
    "</form>\n" +
    "</div>"
  );


  $templateCache.put('views/modals/jenkinsfile-examples-modal.html',
    "<div class=\"jenkinsfile-examples-modal\">\n" +
    "<div class=\"modal-body\">\n" +
    "<h2 translate>Jenkinsfile Examples</h2>\n" +
    "<ng-include src=\"'views/edit/jenkinsfile-examples.html'\"></ng-include>\n" +
    "</div>\n" +
    "<div class=\"modal-footer\">\n" +
    "<button class=\"btn btn-lg btn-default\" type=\"button\" ng-click=\"ok()\" translate>OK</button>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/modals/process-or-save-template.html',
    "<div class=\"modal-resource-action\">\n" +
    "<div class=\"modal-body\">\n" +
    "<h1 translate>{{updateTemplate ? \"Update\" : \"Add\"}} Template</h1>\n" +
    "<p translate>What would you like to do?</p>\n" +
    "<div>\n" +
    "<label>\n" +
    "<input type=\"checkbox\" ng-model=\"templateOptions.process\"/>\n" +
    "<strong translate>Process the template</strong>\n" +
    "</label>\n" +
    "<span id=\"helpBlock\" class=\"help-block\" translate>Create the objects defined in the template. You will have an opportunity to fill in template parameters.</span>\n" +
    "</div>\n" +
    "<div>\n" +
    "<label>\n" +
    "<input type=\"checkbox\" ng-model=\"templateOptions.add\"/>\n" +
    "<strong translate>{{updateTemplate ? \"Update\" : \"Save\"}} template</strong>\n" +
    "</label>\n" +
    "<span id=\"helpBlock\" class=\"help-block\">{{updateTemplate ? \"This will overwrite the current version of the template.\" : \"Save the template to the project. This will make the template available to anyone who can view the project.\"}}</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"modal-footer\">\n" +
    "<button class=\"btn btn-lg btn-primary\" type=\"button\" ng-click=\"continue();\" ng-disabled=\"!templateOptions.process && !templateOptions.add\" translate>Continue</button>\n" +
    "<button class=\"btn btn-lg btn-default\" type=\"button\" ng-click=\"cancel();\" translate>Cancel</button>\n" +
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
    "<translate>Monitoring</translate>\n" +
    "<events-badge project-context=\"projectContext\" ng-if=\"projectContext\" class=\"pull-right\" sidebar-collapsed=\"renderOptions.collapseEventsSidebar\"></events-badge>\n" +
    "</h1>\n" +
    "</div>\n" +
    "<div class=\"data-toolbar\">\n" +
    "<ui-select class=\"data-toolbar-dropdown\" ng-model=\"kindSelector.selected\" theme=\"bootstrap\" search-enabled=\"true\" ng-disabled=\"kindSelector.disabled\" title=\"{{'Choose a resource'|translate}}\">\n" +
    "<ui-select-match placeholder=\"{{'Choose a resource'|translate}}\">{{$select.selected.label ? $select.selected.label : ($select.selected.kind | humanizeKind : true)}}</ui-select-match>\n" +
    "<ui-select-choices repeat=\"kind in kinds | filter : {kind: $select.search} : matchKind\">\n" +
    "<div ng-bind-html=\"(kind.label ? kind.label : (kind.kind | humanizeKind : true)) | highlight: $select.search\"></div>\n" +
    "</ui-select-choices>\n" +
    "</ui-select>\n" +
    "<div class=\"vertical-divider\"></div>\n" +
    "<div class=\"data-toolbar-filter\">\n" +
    "<form role=\"form\" class=\"search-pf has-button\">\n" +
    "<div class=\"form-group filter-controls has-clear\">\n" +
    "<div class=\"search-pf-input-group\">\n" +
    "<label for=\"name-filter\" class=\"sr-only\" translate>Filter by name</label>\n" +
    "<input type=\"search\" placeholder=\"{{'Filter by name'|translate}}\" class=\"form-control\" id=\"name-filter\" ng-model=\"filters.text\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\">\n" +
    "<button type=\"button\" class=\"clear\" aria-hidden=\"true\" ng-if=\"filters.text\" ng-click=\"filters.text = ''\">\n" +
    "<span class=\"pficon pficon-close\"></span>\n" +
    "</button>\n" +
    "</div>\n" +
    "</div>\n" +
    "</form>\n" +
    "</div>\n" +
    "<div class=\"checkbox nowrap\">\n" +
    "<label>\n" +
    "<input type=\"checkbox\" ng-model=\"filters.hideOlderResources\"><translate>Hide older resources</translate>\n" +
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
    "<div ng-if=\"(pods | hashSize) > 0\" translate>The current filters are hiding all pods.</div>\n" +
    "<span ng-if=\"podsLoaded && (pods | hashSize) === 0\" translate>There are no pods in this project.</span>\n" +
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
    "<small><translate>created</translate> <span am-time-ago=\"pod.metadata.creationTimestamp\"></span></small>\n" +
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
    "<log-viewer ng-if=\"'pods/log' | canI : 'get'\" object=\"pod\" context=\"projectContext\" options=\"logOptions.pods[pod.metadata.name]\" empty=\"logEmpty.pods[pod.metadata.name]\" run=\"logCanRun.pods[pod.metadata.name]\" fixed-height=\"250\" full-log-url=\"(pod | navigateResourceURL) + '?view=chromeless'\" ng-class=\"{'log-viewer-select': pod.spec.containers.length > 1}\">\n" +
    "<span class=\"container-details\">\n" +
    "<label for=\"selectLogContainer\" translate>Container:</label>\n" +
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
    "<h2 translate>Deployments</h2>\n" +
    "<div class=\"list-view-pf\">\n" +
    "<div class=\"list-group-item\" ng-if=\"!(filteredReplicationControllers | hashSize) && !(filteredReplicaSets | hashSize)\">\n" +
    "<div class=\"list-view-pf-main-info\">\n" +
    "<ellipsis-pulser color=\"dark\" size=\"sm\" msg=\"Loading deployments\" ng-if=\"!replicationControllersLoaded\"></ellipsis-pulser>\n" +
    "<em>\n" +
    "<div ng-if=\"(replicationControllers | hashSize) > 0 || (replicaSets | hashSize) > 0\" translate>The current filters are hiding all deployments.</div>\n" +
    "<span ng-if=\"replicationControllersLoaded && !(replicationControllers | hashSize) && replicaSetsLoaded && !(replicaSets | hashSize)\" translate>There are no deployments in this project.</span>\n" +
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
    "<small><translate>created</translate> <span am-time-ago=\"replicationController.metadata.creationTimestamp\"></span></small>\n" +
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
    "<small><translate>created</translate> <span am-time-ago=\"replicaSet.metadata.creationTimestamp\"></span></small>\n" +
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
    "<translate>Logs are not available for replica sets.</translate>\n" +
    "<span ng-if=\"podsByOwnerUID[replicaSet.metadata.uid] | hashSize\" translate>\n" +
    "To see application logs, view the logs for one of the replica set's <a href=\"\" ng-click=\"viewPodsForReplicaSet(replicaSet)\">pods</a>.\n" +
    "</span>\n" +
    "<div class=\"mar-top-lg\" ng-if=\"metricsAvailable\">\n" +
    "<deployment-metrics pods=\"podsByOwnerUID[replicaSet.metadata.uid]\" containers=\"replicaSet.spec.template.spec.containers\" alerts=\"alerts\">\n" +
    "</deployment-metrics>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"kindSelector.selected.kind === 'All' || kindSelector.selected.kind === 'StatefulSets'\">\n" +
    "<h2 translate>Stateful Sets</h2>\n" +
    "<div class=\"list-view-pf\">\n" +
    "<div class=\"list-group-item\" ng-if=\"!(filteredStatefulSets | hashSize)\">\n" +
    "<div class=\"list-view-pf-main-info\">\n" +
    "<ellipsis-pulser color=\"dark\" size=\"sm\" msg=\"Loading stateful sets\" ng-if=\"!statefulSetsLoaded\"></ellipsis-pulser>\n" +
    "<em>\n" +
    "<div ng-if=\"(statefulSets | hashSize) > 0\" translate>The current filters are hiding all stateful sets.</div>\n" +
    "<span ng-if=\"statefulSetsLoaded && (statefulSets | hashSize) === 0\" translate>There are no stateful sets in this project.</span>\n" +
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
    "<small><translate>created</translate> <span am-time-ago=\"set.metadata.creationTimestamp\"></span></small>\n" +
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
    "<translate>Logs are not available for stateful sets.</translate>\n" +
    "<span ng-if=\"podsByOwnerUID[set.metadata.uid] | hashSize\" translate>\n" +
    "To see application logs, view the logs for one of the stateful sets's <a href=\"\" ng-click=\"viewPodsForReplicaSet(set)\">pods</a>.\n" +
    "</span>\n" +
    "<div class=\"mar-top-lg\" ng-if=\"metricsAvailable\">\n" +
    "<deployment-metrics pods=\"podsByOwnerUID[set.metadata.uid]\" containers=\"set.spec.template.spec.containers\" alerts=\"alerts\">\n" +
    "</deployment-metrics>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"kindSelector.selected.kind === 'All' || kindSelector.selected.kind === 'Builds'\">\n" +
    "<h2 translate>Builds</h2>\n" +
    "<div class=\"list-view-pf\">\n" +
    "<div class=\"list-group-item\" ng-if=\"!(filteredBuilds | hashSize)\">\n" +
    "<div class=\"list-view-pf-main-info\">\n" +
    "<ellipsis-pulser color=\"dark\" size=\"sm\" msg=\"Loading builds\" ng-if=\"!buildsLoaded\"></ellipsis-pulser>\n" +
    "<em>\n" +
    "<div ng-if=\"(builds | hashSize) > 0\" translate>The current filters are hiding all builds.</div>\n" +
    "<span ng-if=\"buildsLoaded && (builds | hashSize) === 0\" translate>There are no builds in this project.</span>\n" +
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
    "<small><translate>created</translate> <span am-time-ago=\"build.metadata.creationTimestamp\"></span></small>\n" +
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
    "<translate>authored by</translate> {{build.spec.revision.git.author.name}}\n" +
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
    "<translate>Log from</translate> {{build.status.startTimestamp | date : 'medium'}}\n" +
    "<span ng-if=\"build.status.completionTimestamp\">\n" +
    "<translate>to</translate> {{build.status.completionTimestamp | date : 'medium'}}\n" +
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
    "<div ng-hide=\"template\" translate>\n" +
    "Loading...\n" +
    "</div>\n" +
    "<div ng-if=\"template\" class=\"row osc-form\">\n" +
    "<div class=\"col-md-2 icon hidden-sm hidden-xs\">\n" +
    "<custom-icon resource=\"template\" kind=\"template\"></custom-icon>\n" +
    "</div>\n" +
    "<div class=\"col-md-8\">\n" +
    "<osc-image-summary resource=\"template\"></osc-image-summary>\n" +
    "<div ng-if=\"templateImages.length\" class=\"images\">\n" +
    "<h2 translate>Images</h2>\n" +
    "<ul class=\"list-unstyled\" ng-repeat=\"image in templateImages\">\n" +
    "<li>\n" +
    "<i class=\"pficon pficon-image\" aria-hidden=\"true\"></i>\n" +
    "<span class=\"name\">\n" +
    "{{image.name}}\n" +
    "</span>\n" +
    "<span ng-if=\"image.usesParameters.length\" class=\"text-muted small\">\n" +
    "<span ng-if=\"!image.name\" translate>Image value set</span>\n" +
    "<translate>from parameter<span ng-if=\"image.usesParameters.length > 1\">s</span></translate>\n" +
    "<span ng-repeat=\"parameterName in image.usesParameters\">\n" +
    "{{parameterDisplayNames[parameterName]}}<span ng-if=\"!$last\">,</span>\n" +
    "</span>\n" +
    "</span>\n" +
    "</li>\n" +
    "</ul>\n" +
    "</div>\n" +
    "<form>\n" +
    "<process-template project=\"project\" template=\"template\" prefill-parameters=\"prefillParameters\">\n" +
    "</process-template>\n" +
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


  $templateCache.put('views/other-resources.html',
    "<project-header class=\"top-header\"></project-header>\n" +
    "<project-page>\n" +
    "\n" +
    "<div class=\"middle-section\">\n" +
    "<div class=\"middle-container\">\n" +
    "<div class=\"middle-header header-toolbar\">\n" +
    "<div class=\"container-fluid\">\n" +
    "<div class=\"page-header page-header-bleed-right page-header-bleed-left\">\n" +
    "<h1 translate>Other Resources</h1>\n" +
    "</div>\n" +
    "<div class=\"data-toolbar other-resources-toolbar\">\n" +
    "<ui-select class=\"data-toolbar-dropdown\" ng-model=\"kindSelector.selected\" theme=\"bootstrap\" search-enabled=\"true\" ng-disabled=\"kindSelector.disabled\" title=\"{{'Choose a resource'|translate}}\">\n" +
    "<ui-select-match placeholder=\"{{'Choose a resource to list...'|translate}}\">{{$select.selected.kind | humanizeKind : true}}</ui-select-match>\n" +
    "<ui-select-choices repeat=\"kind in kinds | filter : {kind: $select.search} : matchKind | orderBy : 'kind'\">\n" +
    "<div ng-bind-html=\"(kind.kind | humanizeKind : true) | highlight: $select.search\"></div>\n" +
    "<small ng-if=\"isDuplicateKind(kind.kind)\" ng-bind-html=\"kind.group | highlight: $select.search\" class=\"text-muted\"></small>\n" +
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
    "<th translate>Name</th>\n" +
    "<th translate>Created</th>\n" +
    "<th translate>Labels</th>\n" +
    "<th><span class=\"sr-only\" translate>Actions</span></th>\n" +
    "</tr>\n" +
    "</thead>\n" +
    "<tbody ng-if=\"(resources | hashSize) == 0\">\n" +
    "<tr><td colspan=\"4\"><em>{{emptyMessage|translate}}</em></td></tr>\n" +
    "</tbody>\n" +
    "<tbody ng-if=\"(resources | hashSize) > 0\">\n" +
    "<tr ng-repeat=\"resource in resources | orderObjectsByDate : true\">\n" +
    "<td data-title=\"Name\">{{resource.metadata.name}}</td>\n" +
    "<td data-title=\"Created\"><span am-time-ago=\"resource.metadata.creationTimestamp\"></span></td>\n" +
    "<td data-title=\"Labels\">\n" +
    "<em ng-if=\"(resource.metadata.labels | hashSize) === 0\" translate>none</em>\n" +
    "<labels labels=\"resource.metadata.labels\" clickable=\"true\" kind=\"{{kindSelector.selected.kind | kindToResource : true }}\" project-name=\"{{resource.metadata.namespace}}\" limit=\"3\" filter-current-page=\"true\"></labels></td>\n" +
    "<td data-title=\"Actions\" class=\"text-xs-left text-right\">\n" +
    "<span uib-dropdown ng-hide=\"!(selectedResource | canI : 'update') && !(selectedResource | canI : 'delete')\">\n" +
    "<button type=\"button\" class=\"dropdown-toggle btn btn-default\" data-toggle=\"dropdown\">\n" +
    "<translate>Actions</translate>\n" +
    "<span class=\"caret\"></span>\n" +
    "</button>\n" +
    "<ul class=\"uib-dropdown-menu dropdown-menu-right\" aria-labelledby=\"{{resource.metadata.name}}_actions\">\n" +
    "<li ng-if=\"selectedResource | canI : 'update'\">\n" +
    "<a ng-href=\"{{resource | editYamlURL : getReturnURL()}}\" role=\"button\" translate>Edit YAML</a>\n" +
    "</li>\n" +
    "<li ng-if=\"selectedResource | canI : 'delete'\">\n" +
    "<delete-link kind=\"{{kindSelector.selected.kind}}\" group=\"{{kindSelector.selected.group}}\" resource-name=\"{{resource.metadata.name}}\" project-name=\"{{resource.metadata.namespace}}\" alerts=\"alerts\" stay-on-current-page=\"true\" success=\"loadKind\" translate>Delete\n" +
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
    "<div class=\"middle-section\">\n" +
    "<div class=\"middle-container\">\n" +
    "\n" +
    "<div ng-if=\"overview.showGetStarted\" class=\"container-fluid empty-state\">\n" +
    "<tasks></tasks>\n" +
    "<alerts alerts=\"overview.state.alerts\"></alerts>\n" +
    "\n" +
    "<div class=\"empty-state-message text-center\">\n" +
    "<div ng-if=\"project.metadata.name | canIAddToProject\">\n" +
    "<h2 translate>Get started with your project.</h2>\n" +
    "<p class=\"gutter-top\" translate>\n" +
    "Use your source or an example repository to build an application image, or add components like databases and message queues.\n" +
    "</p>\n" +
    "<p class=\"gutter-top\">\n" +
    "<a ng-if=\"!('service_catalog_landing_page' | enableTechPreviewFeature)\" ng-href=\"project/{{projectName}}/create\" class=\"btn btn-lg btn-primary\" translate>\n" +
    "Add to Project\n" +
    "</a>\n" +
    "<a ng-if=\"'service_catalog_landing_page' | enableTechPreviewFeature\" ng-href=\"./\" class=\"btn btn-lg btn-primary\" translate>\n" +
    "Browse Catalog\n" +
    "</a>\n" +
    "</p>\n" +
    "</div>\n" +
    "<div ng-if=\"!(project.metadata.name | canIAddToProject)\">\n" +
    "<h2 translate>Welcome to project {{projectName}}.</h2>\n" +
    "<ng-include src=\"'views/_request-access.html'\"></ng-include>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"overview.showLoading\" class=\"container-fluid loading-message\" translate>\n" +
    "Loading...\n" +
    "</div>\n" +
    "<div ng-if=\"!overview.showGetStarted && !overview.showLoading\">\n" +
    "<div class=\"middle-header header-toolbar\">\n" +
    "<div class=\"container-fluid toolbar-container\">\n" +
    "<div class=\"data-toolbar\" role=\"toolbar\" aria-label=\"Filter Toolbar\">\n" +
    "<div class=\"data-toolbar-filter\" role=\"group\">\n" +
    "<ui-select class=\"data-toolbar-dropdown\" ng-model=\"overview.filterBy\" search-enabled=\"false\" append-to-body=\"true\" ng-disabled=\"overview.disableFilter\">\n" +
    "<ui-select-match>{{$select.selected.label | translate}}</ui-select-match>\n" +
    "<ui-select-choices repeat=\"option.id as option in overview.filterByOptions\">\n" +
    "{{option.label | translate}}\n" +
    "</ui-select-choices>\n" +
    "</ui-select>\n" +
    "<div ng-if=\"overview.filterBy === 'label'\" class=\"label-filter\">\n" +
    "\n" +
    "<fieldset ng-disabled=\"overview.disableFilter\">\n" +
    "<project-filter></project-filter>\n" +
    "</fieldset>\n" +
    "</div>\n" +
    "<div ng-if=\"overview.filterBy === 'name'\" class=\"name-filter\">\n" +
    "<form role=\"form\" class=\"search-pf has-button\">\n" +
    "<div class=\"form-group filter-controls has-clear\">\n" +
    "<div class=\"search-pf-input-group\">\n" +
    "<label for=\"name-filter\" class=\"sr-only\" translate>Filter by name</label>\n" +
    "<input type=\"text\" class=\"form-control\" ng-model=\"overview.filterText\" placeholder=\"{{'Filter by name'|translate}}\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\" ng-disabled=\"overview.disableFilter\">\n" +
    "<button type=\"button\" class=\"clear\" aria-hidden=\"true\" ng-if=\"overview.filterText && !overview.disableFilter\" ng-click=\"overview.filterText = ''\">\n" +
    "<span class=\"pficon pficon-close\"></span>\n" +
    "</button>\n" +
    "</div>\n" +
    "</div>\n" +
    "</form>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"vertical-divider\"></div>\n" +
    "<div class=\"view-by-options\">\n" +
    "<span class=\"data-toolbar-label\" translate>List by</span>\n" +
    "<ui-select class=\"data-toolbar-dropdown\" ng-model=\"overview.viewBy\" search-enabled=\"false\">\n" +
    "<ui-select-match>{{$select.selected.label|translate}}</ui-select-match>\n" +
    "<ui-select-choices repeat=\"option.id as option in overview.viewByOptions\">\n" +
    "{{option.label|translate}}\n" +
    "</ui-select-choices>\n" +
    "</ui-select>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"overview.filterActive\" class=\"filter-status\">\n" +
    "<span ng-if=\"overview.viewBy !== 'pipeline'\" translate>\n" +
    "Showing <strong>{{overview.filteredSize}}</strong> of <strong>{{overview.size}}</strong> items\n" +
    "</span>\n" +
    "<span ng-if=\"overview.viewBy === 'pipeline' && overview.pipelineBuildConfigs | hashSize\" translate>\n" +
    "Showing <strong>{{overview.filteredPipelineBuildConfigs | hashSize}}</strong> of <strong>{{overview.pipelineBuildConfigs | hashSize}}</strong> pipelines\n" +
    "</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"middle-content\">\n" +
    "<div class=\"container-fluid\">\n" +
    "<tasks></tasks>\n" +
    "<alerts alerts=\"overview.state.alerts\"></alerts>\n" +
    "</div>\n" +
    "<div class=\"container-fluid\">\n" +
    "<div ng-if=\"overview.everythingFiltered && overview.viewBy !== 'pipeline'\">\n" +
    "<div class=\"empty-state-message text-center h2\">\n" +
    "<translate>The filter is hiding all resources.</translate>\n" +
    "<a href=\"\" ng-click=\"overview.clearFilter()\" translate>Clear Filter</a>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"!overview.everythingFiltered || overview.viewBy === 'pipeline'\">\n" +
    "<div ng-if=\"overview.viewBy === 'app'\" ng-repeat=\"app in overview.apps\">\n" +
    "<div ng-if=\"app\" class=\"app-heading\">\n" +
    "<h2>\n" +
    "<div class=\"component-label\" translate>Application</div>\n" +
    "<span ng-bind-html=\"app | highlightKeywords : overview.state.filterKeywords\"></span>\n" +
    "</h2>\n" +
    "<div ng-if=\"route = overview.bestRouteByApp[app]\" class=\"pull-right\">\n" +
    "<h3 class=\"overview-route\">\n" +
    "<span ng-if=\"route | isWebRoute\">\n" +
    "<a ng-href=\"{{route | routeWebURL}}\" target=\"_blank\">{{route | routeLabel}}</a>\n" +
    "<i class=\"fa fa-external-link small\" aria-hidden=\"true\"></i>\n" +
    "</span>\n" +
    "<span ng-if=\"!(route | isWebRoute)\">{{route | routeLabel}}</span>\n" +
    "</h3>\n" +
    "</div>\n" +
    "</div>\n" +
    "<h2 ng-if=\"!app\" translate>\n" +
    "Other Resources\n" +
    "</h2>\n" +
    "<div class=\"list-pf\">\n" +
    "<overview-list-row ng-repeat=\"deploymentConfig in overview.filteredDeploymentConfigsByApp[app] track by (deploymentConfig | uid)\" ng-init=\"dcName = deploymentConfig.metadata.name\" api-object=\"deploymentConfig\" current=\"overview.currentByDeploymentConfig[dcName]\" previous=\"overview.getPreviousReplicationController(deploymentConfig)\" state=\"overview.state\">\n" +
    "</overview-list-row>\n" +
    "<overview-list-row ng-repeat=\"deployment in overview.filteredDeploymentsByApp[app] track by (deployment | uid)\" api-object=\"deployment\" current=\"overview.currentByDeploymentUID[deployment.metadata.uid]\" previous=\"overview.replicaSetsByDeploymentUID[deployment.metadata.uid][1]\" state=\"overview.state\">\n" +
    "</overview-list-row>\n" +
    "<overview-list-row ng-repeat=\"replicationController in overview.filteredReplicationControllersByApp[app] track by (replicationController | uid)\" api-object=\"replicationController\" current=\"replicationController\" state=\"overview.state\">\n" +
    "</overview-list-row>\n" +
    "<overview-list-row ng-repeat=\"replicaSet in overview.filteredReplicaSetsByApp[app] track by (replicaSet | uid)\" api-object=\"replicaSet\" state=\"overview.state\">\n" +
    "</overview-list-row>\n" +
    "<overview-list-row ng-repeat=\"statefulSet in overview.filteredStatefulSetsByApp[app] track by (statefulSet | uid)\" api-object=\"statefulSet\" state=\"overview.state\">\n" +
    "</overview-list-row>\n" +
    "<overview-list-row ng-repeat=\"pod in overview.filteredMonopodsByApp[app] track by (pod | uid)\" api-object=\"pod\" state=\"overview.state\">\n" +
    "</overview-list-row>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"overview.viewBy === 'resource'\">\n" +
    "<div ng-if=\"overview.filteredDeploymentConfigs | hashSize\">\n" +
    "<h2>\n" +
    "<span ng-if=\"overview.deployments | hashSize\" translate>\n" +
    "Deployment Configs\n" +
    "</span>\n" +
    "<span ng-if=\"!(overview.deployments | hashSize)\" translate>\n" +
    "Deployments\n" +
    "</span>\n" +
    "</h2>\n" +
    "<div class=\"list-pf\">\n" +
    "<overview-list-row ng-repeat=\"deploymentConfig in overview.filteredDeploymentConfigs track by (deploymentConfig | uid)\" ng-init=\"dcName = deploymentConfig.metadata.name\" api-object=\"deploymentConfig\" current=\"overview.currentByDeploymentConfig[dcName]\" previous=\"overview.getPreviousReplicationController(deploymentConfig)\" state=\"overview.state\">\n" +
    "</overview-list-row>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"overview.filteredDeployments | hashSize\">\n" +
    "<h2 translate>Deployments</h2>\n" +
    "<div class=\"list-pf\">\n" +
    "<overview-list-row ng-repeat=\"deployment in overview.filteredDeployments track by (deployment | uid)\" api-object=\"deployment\" current=\"overview.currentByDeploymentUID[deployment.metadata.uid]\" previous=\"overview.replicaSetsByDeploymentUID[deployment.metadata.uid][1]\" state=\"overview.state\">\n" +
    "</overview-list-row>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"overview.filteredReplicationControllers | hashSize\">\n" +
    "<h2 translate>Replication Controllers</h2>\n" +
    "<div class=\"list-pf\">\n" +
    "<overview-list-row ng-repeat=\"replicationController in overview.filteredReplicationControllers track by (replicationController | uid)\" api-object=\"replicationController\" state=\"overview.state\">\n" +
    "</overview-list-row>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"overview.filteredReplicaSets | hashSize\">\n" +
    "<h2 translate>Replica Sets</h2>\n" +
    "<div class=\"list-pf\">\n" +
    "<overview-list-row ng-repeat=\"replicaSet in overview.filteredReplicaSets track by (replicaSet | uid)\" api-object=\"replicaSet\" state=\"overview.state\">\n" +
    "</overview-list-row>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"overview.filteredStatefulSets | hashSize\">\n" +
    "<h2>Stateful Sets</h2>\n" +
    "<div class=\"list-pf\">\n" +
    "<overview-list-row ng-repeat=\"statefulSet in overview.filteredStatefulSets track by (statefulSet | uid)\" api-object=\"statefulSet\" state=\"overview.state\">\n" +
    "</overview-list-row>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"overview.filteredMonopods | hashSize\">\n" +
    "<h2>Pods</h2>\n" +
    "<div class=\"list-pf\">\n" +
    "<overview-list-row ng-repeat=\"pod in overview.filteredMonopods track by (pod | uid)\" api-object=\"pod\" state=\"overview.state\">\n" +
    "</overview-list-row>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"overview.viewBy === 'pipeline'\">\n" +
    "\n" +
    "<div ng-if=\"!overview.pipelineBuildConfigs.length\" class=\"empty-state-message text-center\">\n" +
    "<h2 translate>No pipelines.</h2>\n" +
    "<div ng-if=\"project.metadata.name | canIAddToProject\">\n" +
    "<p>\n" +
    "<translate>No pipelines have been added to project {{projectName}}.</translate>\n" +
    "<br>\n" +
    "<translate>Learn more about</translate>\n" +
    "<a ng-href=\"{{ 'pipeline-builds' | helpLink}}\" target=\"_blank\" translate>Pipeline Builds</a>\n" +
    "<translate>and the</translate>\n" +
    "<a ng-href=\"{{ 'pipeline-plugin' | helpLink}}\" target=\"_blank\" translate>DataMan OS Pipeline Plugin</a>.\n" +
    "</p>\n" +
    "<p ng-if=\"(project.metadata.name | canIAddToProject) && overview.samplePipelineURL\">\n" +
    "<a ng-href=\"{{overview.samplePipelineURL}}\" class=\"btn btn-lg btn-primary\" translate>\n" +
    "Create Sample Pipeline\n" +
    "</a>\n" +
    "</p>\n" +
    "</div>\n" +
    "<div ng-if=\"!(project.metadata.name | canIAddToProject)\">\n" +
    "<ng-include src=\"'views/_request-access.html'\"></ng-include>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"(overview.pipelineBuildConfigs | hashSize) && !(overview.filteredPipelineBuildConfigs | hashSize)\">\n" +
    "<div class=\"empty-state-message text-center h2\">\n" +
    "<translate>All pipelines are filtered.</translate>\n" +
    "<a href=\"\" ng-click=\"overview.clearFilter()\" translate>Clear Filter</a>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-repeat=\"pipeline in overview.filteredPipelineBuildConfigs track by (pipeline | uid)\">\n" +
    "<div ng-if=\"'buildconfigs/instantiate' | canI : 'create'\" class=\"pull-right\">\n" +
    "<button class=\"btn btn-default\" ng-if=\"'buildconfigs/instantiate' | canI : 'create'\" ng-click=\"overview.startBuild(pipeline)\" translate>\n" +
    "Start Pipeline\n" +
    "</button>\n" +
    "</div>\n" +
    "<h2>\n" +
    "<div class=\"component-label\" translate>Pipeline</div>\n" +
    "<span ng-bind-html=\"pipeline.metadata.name | highlightKeywords : overview.state.filterKeywords\"></span>\n" +
    "</h2>\n" +
    "<div ng-if=\"!(overview.recentPipelinesByBuildConfig[pipeline.metadata.name] | hashSize)\" class=\"mar-bottom-lg\" translate>\n" +
    "No pipeline runs.\n" +
    "</div>\n" +
    "<div ng-if=\"overview.recentPipelinesByBuildConfig[pipeline.metadata.name] | hashSize\" class=\"build-pipelines\">\n" +
    "<div ng-repeat=\"pipeline in overview.recentPipelinesByBuildConfig[pipeline.metadata.name] track by (pipeline | uid)\" class=\"row build-pipeline-wrapper animate-repeat\">\n" +
    "<div class=\"col-sm-12\">\n" +
    "<build-pipeline build=\"pipeline\" build-config-name-on-expanded=\"true\" collapse-pending=\"true\"></build-pipeline>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"!overview.deploymentConfigsByPipeline[pipeline.metadata.name].length\" class=\"mar-bottom-lg\" translate>\n" +
    "This pipeline is not associated with any deployments.\n" +
    "</div>\n" +
    "<div ng-if=\"overview.deploymentConfigsByPipeline[pipeline.metadata.name].length\" class=\"list-pf\">\n" +
    "<overview-list-row ng-repeat=\"dcName in overview.deploymentConfigsByPipeline[pipeline.metadata.name]\" api-object=\"overview.deploymentConfigs[dcName]\" current=\"overview.currentByDeploymentConfig[dcName]\" previous=\"overview.getPreviousReplicationController(deploymentConfig)\" state=\"overview.state\" hide-pipelines=\"true\">\n" +
    "</overview-list-row>\n" +
    "</div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"list-pf\" ng-if=\"overview.pipelineViewHasOtherResources && !overview.hidePipelineOtherResources\">\n" +
    "<h2>Other Resources</h2>\n" +
    "<overview-list-row ng-repeat=\"deploymentConfig in overview.deploymentConfigsNoPipeline track by (deploymentConfig | uid)\" ng-init=\"dcName = deploymentConfig.metadata.name\" api-object=\"deploymentConfig\" current=\"overview.currentByDeploymentConfig[dcName]\" previous=\"overview.getPreviousReplicationController(deploymentConfig)\" state=\"overview.state\">\n" +
    "</overview-list-row>\n" +
    "<overview-list-row ng-repeat=\"deployment in overview.deployments track by (deployment | uid)\" api-object=\"deployment\" current=\"overview.currentByDeploymentUID[deployment.metadata.uid]\" previous=\"overview.replicaSetsByDeploymentUID[deployment.metadata.uid][1]\" state=\"overview.state\">\n" +
    "</overview-list-row>\n" +
    "<overview-list-row ng-repeat=\"replicationController in overview.vanillaReplicationControllers track by (replicationController | uid)\" api-object=\"replicationController\" current=\"replicationController\" state=\"overview.state\">\n" +
    "</overview-list-row>\n" +
    "<overview-list-row ng-repeat=\"replicaSet in overview.vanillaReplicaSets track by (replicaSet | uid)\" api-object=\"replicaSet\" state=\"overview.state\">\n" +
    "</overview-list-row>\n" +
    "<overview-list-row ng-repeat=\"statefulSet in overview.statefulSets track by (statefulSet | uid)\" api-object=\"statefulSet\" state=\"overview.state\">\n" +
    "</overview-list-row>\n" +
    "<overview-list-row ng-repeat=\"pod in overview.monopods track by (pod | uid)\" api-object=\"pod\" state=\"overview.state\">\n" +
    "</overview-list-row>\n" +
    "</div>\n" +
    "</div>\n" +
    "\n" +
    "<div ng-if=\"overview.filteredServiceInstances.length && !overview.hidePipelineOtherResources\">\n" +
    "<h2>\n" +
    "Provisioned Services\n" +
    "</h2>\n" +
    "<div class=\"list-pf\">\n" +
    "<service-instance-row ng-repeat=\"serviceInstance in overview.filteredServiceInstances\" api-object=\"serviceInstance\" bindings=\"overview.bindingsByInstanceRef[serviceInstance.metadata.name]\" state=\"overview.state\"></service-instance-row>\n" +
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


  $templateCache.put('views/overview/_build-counts.html',
    "<span ng-if=\"buildCounts.show\" class=\"animate-if\">\n" +
    "<span ng-if=\"buildCounts.label\" class=\"builds-label\">\n" +
    "{{buildCounts.label}}\n" +
    "</span>\n" +
    "<span ng-repeat=\"phase in buildCounts.interestingPhases\" ng-if=\"buildCounts.countByPhase[phase]\" class=\"icon-count\">\n" +
    "<span dynamic-content=\"{{buildCounts.countByPhase[phase]}} {{phase}}\" data-toggle=\"tooltip\" data-trigger=\"hover\" aria-hidden=\"true\">\n" +
    "<span ng-switch=\"phase\" class=\"hide-ng-leave\">\n" +
    "<span ng-switch-when=\"Failed\" class=\"status-icon\">\n" +
    "<i class=\"pficon pficon-error-circle-o text-danger\"></i>\n" +
    "</span>\n" +
    "<span ng-switch-default>\n" +
    "<status-icon status=\"phase\"></status-icon>\n" +
    "</span>\n" +
    "</span>\n" +
    "{{buildCounts.countByPhase[phase]}}\n" +
    "<span class=\"sr-only\">{{phase}}</span>\n" +
    "</span>\n" +
    "</span>\n" +
    "<span ng-if=\"buildCounts.currentStage\" class=\"running-stage\">\n" +
    "Stage {{buildCounts.currentStage.name}}\n" +
    "</span>\n" +
    "</span>"
  );


  $templateCache.put('views/overview/_builds.html',
    "<div ng-if=\"overviewBuilds.buildConfigs.length\" class=\"expanded-section\">\n" +
    "<div class=\"section-title hidden-xs\" translate>Builds</div>\n" +
    "<div ng-repeat=\"buildConfig in overviewBuilds.buildConfigs track by (buildConfig | uid)\" class=\"row\">\n" +
    "<div class=\"col-sm-5 col-md-6\">\n" +
    "<h3 class=\"mar-top-xs\">\n" +
    "<a ng-href=\"{{buildConfig | navigateResourceURL}}\">{{buildConfig.metadata.name}}</a>\n" +
    "</h3>\n" +
    "</div>\n" +
    "<div class=\"col-sm-7 col-md-6 overview-builds-msg\">\n" +
    "<div ng-if=\"!(overviewBuilds.recentBuildsByBuildConfig[buildConfig.metadata.name] | hashSize)\" translate>\n" +
    "No builds.\n" +
    "</div>\n" +
    "<div ng-repeat=\"build in overviewBuilds.recentBuildsByBuildConfig[buildConfig.metadata.name] track by (build | uid)\" class=\"mar-bottom-sm animate-repeat\">\n" +
    "<span ng-if=\"overviewBuilds.showLogs(build)\" class=\"small pull-right view-full-log\">\n" +
    "<a ng-if=\"!!['New', 'Pending'].indexOf(build.status.phase) && (build | buildLogURL)\" ng-href=\"{{build | buildLogURL}}\" translate>View Full Log</a>\n" +
    "</span>\n" +
    "<span ng-switch=\"build.status.phase\" class=\"hide-ng-leave\">\n" +
    "<span ng-switch-when=\"Failed\" class=\"status-icon\">\n" +
    "<i class=\"pficon pficon-error-circle-o text-danger\"></i>\n" +
    "</span>\n" +
    "<span ng-switch-default>\n" +
    "<status-icon status=\"build.status.phase\"></status-icon>\n" +
    "</span>\n" +
    "</span>\n" +
    "<span class=\"h5\">\n" +
    "<translate>Build</translate>\n" +
    "<a ng-href=\"{{build | navigateResourceURL}}\"><span ng-if=\"build | annotation : 'buildNumber'\">#{{build | annotation : 'buildNumber'}}</span><span ng-if=\"!(build | annotation : 'buildNumber')\">{{build.metadata.name}}</span></a>\n" +
    "<span ng-switch=\"build.status.phase\" class=\"hide-ng-leave\">\n" +
    "<span ng-switch-when=\"Failed\" translate>failed</span>\n" +
    "<span ng-switch-when=\"Error\" translate>encountered an error</span>\n" +
    "<span ng-switch-when=\"Cancelled\" translate>was cancelled</span>\n" +
    "<span ng-switch-default><translate>is</translate> {{build.status.phase | lowercase}}</span>\n" +
    "</span>\n" +
    "<ellipsis-pulser ng-if=\"build | isIncompleteBuild\" color=\"dark\" size=\"sm\" display=\"inline\" msg=\"\"></ellipsis-pulser>\n" +
    "<small class=\"text-muted mar-left-md\"><translate>created</translate> <span am-time-ago=\"build.metadata.creationTimestamp\"></span></small>\n" +
    "</span>\n" +
    "<div ng-if=\"overviewBuilds.showLogs(build)\" class=\"animate-if\">\n" +
    "<mini-log api-object=\"build\" context=\"overviewBuilds.context\"></mini-log>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/overview/_list-row-actions.html',
    " <div class=\"list-pf-actions\">\n" +
    "<div ng-if=\"row.canIDoAny()\">\n" +
    "<div ng-switch=\"row.apiObject.kind\">\n" +
    "<div ng-switch-when=\"DeploymentConfig\">\n" +
    "<div uib-dropdown>\n" +
    "<a href=\"\" uib-dropdown-toggle class=\"actions-dropdown-kebab\"><i class=\"fa fa-ellipsis-v\" aria-hidden=\"true\"></i><span class=\"sr-only\" translate>Actions</span></a>\n" +
    "<ul class=\"dropdown-menu dropdown-menu-right\" uib-dropdown-menu role=\"menu\">\n" +
    "<li ng-if=\"row.showStartPipelineAction()\" role=\"menuitem\">\n" +
    "<a href=\"\" ng-click=\"row.startBuild(row.pipelines[0])\" translate>Start Pipeline</a>\n" +
    "</li>\n" +
    "<li ng-if=\"row.showStartBuildAction()\" role=\"menuitem\">\n" +
    "<a href=\"\" ng-click=\"row.startBuild(row.buildConfigs[0])\" translate>Start Build</a>\n" +
    "</li>\n" +
    "<li ng-if=\"'deploymentconfigs/instantiate' | canI : 'create'\" role=\"menuitem\">\n" +
    "<a href=\"\" ng-if=\"row.canDeploy()\" ng-click=\"row.startDeployment()\" translate>Deploy</a>\n" +
    "<a href=\"\" ng-if=\"!(row.canDeploy())\" class=\"disabled-link\" aria-disabled=\"true\" translate>\n" +
    "Deploy <span ng-if=\"row.isPaused()\">(Paused)</span>\n" +
    "</a>\n" +
    "</li>\n" +
    "<li ng-if=\"'deploymentconfigs' | canI : 'update'\" role=\"menuitem\">\n" +
    "<a ng-href=\"{{row.apiObject | editResourceURL}}\" translate>Edit</a>\n" +
    "</li>\n" +
    "<li ng-if=\"('pod_presets' | enableTechPreviewFeature)\n" +
    "                      && row.state.bindableServiceInstances.length\n" +
    "                      && ({resource: 'bindings', group: 'servicecatalog.k8s.io'} | canI : 'create')\" role=\"menuitem\">\n" +
    "<a href=\"\" ng-click=\"row.showOverlayPanel('bindService', {target: row.apiObject})\" translate>Create Binding</a>\n" +
    "</li>\n" +
    "<li ng-if=\"('pod_presets' | enableTechPreviewFeature)\n" +
    "                      && row.state.deleteableBindingsByApplicationUID[row.apiObject.metadata.uid].length\n" +
    "                      && ({resource: 'bindings', group: 'servicecatalog.k8s.io'} | canI : 'delete')\" role=\"menuitem\">\n" +
    "<a href=\"\" ng-click=\"row.showOverlayPanel('unbindService', {target: row.apiObject})\" translate>Delete Binding</a>\n" +
    "</li>\n" +
    "<li ng-if=\"row.current && ('deploymentconfigs/log' | canI : 'get')\" role=\"menuitem\">\n" +
    "<a ng-href=\"{{row.current | navigateResourceURL}}?tab=logs\" translate>View Logs</a>\n" +
    "</li>\n" +
    "</ul>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-switch-when=\"Pod\">\n" +
    "<div uib-dropdown>\n" +
    "<a href=\"\" uib-dropdown-toggle class=\"actions-dropdown-kebab\"><i class=\"fa fa-ellipsis-v\"></i><span class=\"sr-only\" translate>Actions</span></a>\n" +
    "<ul class=\"dropdown-menu dropdown-menu-right\" uib-dropdown-menu role=\"menu\">\n" +
    "<li role=\"menuitem\" ng-if=\"'pods' | canI : 'update'\">\n" +
    "<a ng-href=\"{{row.apiObject | editYamlURL}}\" translate>Edit YAML</a>\n" +
    "</li>\n" +
    "<li role=\"menuitem\" ng-if=\"('pods/log' | canI : 'get')\">\n" +
    "<a ng-href=\"{{row.apiObject | navigateResourceURL}}?tab=logs\" translate>View Logs</a>\n" +
    "</li>\n" +
    "</ul>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-switch-default>\n" +
    "<div uib-dropdown>\n" +
    "<a href=\"\" uib-dropdown-toggle class=\"actions-dropdown-kebab\"><i class=\"fa fa-ellipsis-v\"></i><span class=\"sr-only\" translate>Actions</span></a>\n" +
    "<ul class=\"dropdown-menu dropdown-menu-right\" uib-dropdown-menu role=\"menu\">\n" +
    "<li role=\"menuitem\" ng-if=\"row.rgv | canI : 'update'\">\n" +
    "<a ng-href=\"{{row.apiObject | editYamlURL}}\" translate>Edit YAML</a>\n" +
    "</li>\n" +
    "<li ng-if=\"('pod_presets' | enableTechPreviewFeature)\n" +
    "                      && row.state.bindableServiceInstances.length\n" +
    "                      && ({resource: 'bindings', group: 'servicecatalog.k8s.io'} | canI : 'create')\" role=\"menuitem\">\n" +
    "<a href=\"\" ng-click=\"row.showOverlayPanel('bindService', {target: row.apiObject})\" translate>Create Binding</a>\n" +
    "</li>\n" +
    "<li ng-if=\"('pod_presets' | enableTechPreviewFeature)\n" +
    "                      && row.state.deleteableBindingsByApplicationUID[row.apiObject.metadata.uid].length\n" +
    "                      && ({resource: 'bindings', group: 'servicecatalog.k8s.io'} | canI : 'delete')\" role=\"menuitem\">\n" +
    "<a href=\"\" ng-click=\"row.showOverlayPanel('unbindService', {target: row.apiObject})\" translate>Delete Binding</a>\n" +
    "</li>\n" +
    "<li ng-if=\"(pod = row.firstPod(row.current)) && ('pods/log' | canI : 'get')\" role=\"menuitem\">\n" +
    "<a ng-href=\"{{pod | navigateResourceURL}}?tab=logs\" translate>View Logs</a>\n" +
    "</li>\n" +
    "</ul>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/overview/_list-row-chevron.html',
    "<a href=\"\" ng-click=\"row.toggleExpand($event, true)\" class=\"toggle-expand-link\">\n" +
    "<span ng-if=\"row.expanded\">\n" +
    "<span class=\"fa fa-angle-down\" aria-hidden=\"true\"></span>\n" +
    "<span class=\"sr-only\" translate>Collapse</span>\n" +
    "</span>\n" +
    "<span ng-if=\"!row.expanded\">\n" +
    "<span class=\"fa fa-angle-right\" aria-hidden=\"true\"></span>\n" +
    "<span class=\"sr-only\" translate>Expand</span>\n" +
    "</span>\n" +
    "</a>"
  );


  $templateCache.put('views/overview/_list-row-content.html',
    "<div class=\"list-pf-name\">\n" +
    "<h3>\n" +
    "<div class=\"component-label\">\n" +
    "<span ng-if=\"row.apiObject.kind === 'DeploymentConfig'\" translate>\n" +
    "Deployment\n" +
    "</span>\n" +
    "<span ng-if=\"row.apiObject.kind !== 'DeploymentConfig'\">\n" +
    "{{row.apiObject.kind | humanizeKind}}\n" +
    "</span>\n" +
    "</div>\n" +
    "<a ng-href=\"{{row.apiObject | navigateResourceURL}}\"><span ng-bind-html=\"row.apiObject.metadata.name | highlightKeywords : row.state.filterKeywords\"></span></a><span ng-if=\"row.apiObject.kind === 'DeploymentConfig' && row.current\">,\n" +
    "<a ng-href=\"{{row.current | navigateResourceURL}}\">#{{row.current | annotation : 'deploymentVersion'}}</a>\n" +
    "</span><span ng-if=\"row.apiObject.kind === 'Deployment' && row.current\">,\n" +
    "<a ng-href=\"{{row.current | navigateResourceURL}}\">#{{row.current | annotation : 'deployment.kubernetes.io/revision'}}</a>\n" +
    "</span>\n" +
    "</h3>\n" +
    "<div class=\"status-icons\">\n" +
    "<notification-icon ng-if=\"!row.expanded\" alerts=\"row.notifications\"></notification-icon>\n" +
    "<span class=\"build-count\">\n" +
    "<span ng-if=\"!row.expanded && !row.hidePipelines && (row.recentPipelines | hashSize)\" class=\"pipelines\">\n" +
    "<build-counts builds=\"row.recentPipelines\" label=\"Pipelines\" show-running-stage=\"true\">\n" +
    "</build-counts>\n" +
    "</span>\n" +
    "<span ng-if=\"!row.expanded && (row.recentBuilds | hashSize)\" class=\"builds\">\n" +
    "<build-counts builds=\"row.recentBuilds\" label=\"Builds\"></build-counts>\n" +
    "</span>\n" +
    "</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"row.apiObject.kind === 'DeploymentConfig' && !row.current && !row.expanded\" class=\"list-pf-details hidden-xs hidden-sm\">\n" +
    "<span translate>\n" +
    "No deployments for <a ng-href=\"{{row.apiObject | navigateResourceURL}}\">{{row.apiObject.metadata.name}}</a>\n" +
    "</span>\n" +
    "</div>\n" +
    "<div ng-if=\"row.isDeploymentInProgress()\" class=\"list-pf-details\">\n" +
    "<div ng-if=\"row.apiObject.kind === 'DeploymentConfig'\">\n" +
    "<span class=\"mar-right-sm\">\n" +
    "<span class=\"hidden-xs\">\n" +
    "<translate>{{row.apiObject.spec.strategy.type}} deployment is {{row.current | deploymentStatus | lowercase}}</translate>&thinsp;<ellipsis-pulser color=\"dark\" size=\"sm\" display=\"inline\" msg=\"\"></ellipsis-pulser>\n" +
    "</span>\n" +
    "\n" +
    "<span class=\"hidden visible-xs-inline nowrap\">\n" +
    "<ellipsis-pulser color=\"dark\" size=\"sm\" display=\"inline\" msg=\"Deploying\"></ellipsis-pulser>\n" +
    "</span>\n" +
    "</span>\n" +
    "<a ng-href=\"project/{{row.apiObject.metadata.namespace}}/browse/events\" translate>View Events</a>\n" +
    "<span ng-if=\"'replicationcontrollers' | canI : 'update'\">\n" +
    "<span class=\"action-divider\">|</span>\n" +
    "<a href=\"\" ng-click=\"row.cancelDeployment()\" role=\"button\" translate>Cancel</a>\n" +
    "</span>\n" +
    "</div>\n" +
    "<div ng-if=\"row.apiObject.kind === 'Deployment'\">\n" +
    "<span class=\"hidden-xs\">\n" +
    "{{row.apiObject.spec.strategy.type | sentenceCase}}&nbsp;<ellipsis-pulser color=\"dark\" size=\"sm\" display=\"inline\" msg=\"in progress\"></ellipsis-pulser>\n" +
    "</span>\n" +
    "<span class=\"hidden visible-xs-inline nowrap\">\n" +
    "<ellipsis-pulser color=\"dark\" size=\"sm\" display=\"inline\" msg=\"Deploying\"></ellipsis-pulser>\n" +
    "</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"row.current && !row.isDeploymentInProgress() && !row.expanded\" class=\"list-pf-details\">\n" +
    "<div ng-if=\"row.state.showMetrics && (row.state.breakpoint === 'md' || row.state.breakpoint === 'lg')\" class=\"truncate metrics-collapsed\">\n" +
    "<div ng-if=\"row.apiObject.kind === 'Pod'\">\n" +
    "<metrics-summary pods=\"[row.apiObject]\" containers=\"row.apiObject.spec.containers\">\n" +
    "</metrics-summary>\n" +
    "</div>\n" +
    "<div ng-if=\"row.apiObject.kind !== 'Pod' && row.current\">\n" +
    "<metrics-summary pods=\"row.getPods(row.current)\" containers=\"row.current.spec.template.spec.containers\">\n" +
    "</metrics-summary>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"pods hidden-xs\">\n" +
    "<div ng-if=\"row.apiObject.kind === 'Pod'\">\n" +
    "<a ng-href=\"{{row.apiObject | navigateResourceURL}}\" class=\"mini-donut-link\">\n" +
    "<pod-donut pods=\"[row.apiObject]\" mini=\"true\"></pod-donut>\n" +
    "</a>\n" +
    "</div>\n" +
    "<div ng-if=\"row.apiObject.kind !== 'Pod'\">\n" +
    "<a href=\"\" ng-click=\"row.navigateToPods()\" class=\"mini-donut-link\" ng-class=\"{ 'disabled-link': !(row.getPods(row.current) | size) }\">\n" +
    "<pod-donut pods=\"row.getPods(row.current)\" mini=\"true\"></pod-donut>\n" +
    "</a>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/overview/_list-row-empty-state.html',
    "<h2 translate>No deployments.</h2>\n" +
    "<div ng-if=\"row.imageChangeTriggers.length\">\n" +
    "<translate>A new deployment will start automatically when</translate>\n" +
    "<span ng-if=\"row.imageChangeTriggers.length === 1\">\n" +
    "<translate>an image is pushed to</translate>\n" +
    "<a ng-href=\"{{row.urlForImageChangeTrigger(row.imageChangeTriggers[0])}}\">\n" +
    "{{row.imageChangeTriggers[0].imageChangeParams.from | imageObjectRef : row.apiObject.metadata.namespace}}</a>.\n" +
    "</span>\n" +
    "<span ng-if=\"row.imageChangeParams.length > 1\" translate>\n" +
    "one of the images referenced by this deployment config changes.\n" +
    "</span>\n" +
    "</div>\n" +
    "<div ng-if=\"!row.imageChangeTriggers.length\">\n" +
    "<p>\n" +
    "<translate>No deployments for</translate> {{row.apiObject.kind | humanizeKind}}\n" +
    "<a ng-href=\"{{row.apiObject | navigateResourceURL}}\">{{row.apiObject.metadata.name}}</a>.\n" +
    "</p>\n" +
    "<div ng-if=\"row.apiObject.kind === 'DeploymentConfig'\">\n" +
    "<div ng-if=\"pipeline = row.pipelines[0]\">\n" +
    "<p>\n" +
    "<translate>This deployment config is part of the pipeline</translate>\n" +
    "<a ng-href=\"{{pipeline | navigateResourceURL}}\">{{pipeline.metadata.name}}</a>.\n" +
    "</p>\n" +
    "<div ng-if=\"row.showStartPipelineAction()\">\n" +
    "<button class=\"btn btn-primary\" ng-click=\"row.startBuild(pipeline)\" translate>\n" +
    "Start Pipeline\n" +
    "</button>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"!row.pipelines.length\">\n" +
    "<button ng-if=\"'deploymentconfigs/instantiate' | canI : 'create'\" class=\"btn btn-primary\" ng-click=\"row.startDeployment()\" translate>\n" +
    "Start Deployment\n" +
    "</button>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/overview/_list-row-expanded.html',
    "<div class=\"list-pf-container\">\n" +
    "<div class=\"list-pf-content\">\n" +
    "<alerts alerts=\"row.notifications\"></alerts>\n" +
    "<div ng-if=\"row.current\">\n" +
    "<div class=\"row-expanded-top\" ng-class=\"{\n" +
    "        'metrics-active': row.state.showMetrics,\n" +
    "        'metrics-not-active': !row.state.showMetrics\n" +
    "      }\">\n" +
    "<div ng-if=\"row.state.breakpoint !== 'xxs' && row.state.breakpoint !== 'xs'\" class=\"overview-pod-template\" ng-class=\"{\n" +
    "          'ng-enter': row.previous,\n" +
    "          'hidden-sm hidden-md': row.previous\n" +
    "        }\">\n" +
    "\n" +
    "<pod-template pod-template=\"row.current | podTemplate\" images-by-docker-reference=\"row.state.imagesByDockerReference\" builds=\"row.state.builds\" class=\"hide-ng-leave\">\n" +
    "</pod-template>\n" +
    "</div>\n" +
    "<div class=\"overview-animation-block\" ng-class=\"{\n" +
    "        'animation-in-progress': row.previous\n" +
    "      }\">\n" +
    "<div ng-if=\"row.state.showMetrics && !row.previous\" class=\"overview-metrics\" ng-class=\"{\n" +
    "          'ng-enter': row.previous\n" +
    "        }\">\n" +
    "<div ng-if=\"row.apiObject.kind === 'Pod'\">\n" +
    "<deployment-metrics pods=\"[row.apiObject]\" containers=\"row.apiObject.spec.containers\" profile=\"compact\" alerts=\"row.state.alerts\" class=\"overview-metrics\">\n" +
    "</deployment-metrics>\n" +
    "<h4 class=\"h5\" translate>Usage <small>Last 15 Minutes</small></h4>\n" +
    "</div>\n" +
    "<div ng-if=\"row.apiObject.kind !== 'Pod'\">\n" +
    "<deployment-metrics pods=\"row.getPods(row.current)\" containers=\"row.current.spec.template.spec.containers\" profile=\"compact\" alerts=\"row.state.alerts\">\n" +
    "</deployment-metrics>\n" +
    "<h4 class=\"h5\" translate>Average Usage <small>Last 15 Minutes</small></h4>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"overview-deployment-donut\" ng-class=\"{\n" +
    "            'ng-enter': row.previous,\n" +
    "            'stacked-template': row.state.breakpoint !== 'lg'\n" +
    "        }\">\n" +
    "<div ng-if=\"row.previous\" class=\"previous-donut\">\n" +
    "<deployment-donut rc=\"row.previous\" deployment-config=\"row.apiObject\" pods=\"row.getPods(row.previous)\" hpa=\"row.hpa\" limit-ranges=\"row.state.limitRanges\" project=\"row.state.project\" quotas=\"row.state.quotas\" cluster-quotas=\"row.state.clusterQuotas\" scalable=\"false\">\n" +
    "</deployment-donut>\n" +
    "<div ng-if=\"row.previous\" class=\"deployment-connector\">\n" +
    "<div class=\"deployment-connector-arrow\" aria-hidden=\"true\">\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"latest-donut\">\n" +
    "<div ng-if=\"row.apiObject.kind === 'Pod'\">\n" +
    "<a ng-href=\"{{row.apiObject | navigateResourceURL}}\">\n" +
    "<pod-donut pods=\"[row.apiObject]\"></pod-donut>\n" +
    "</a>\n" +
    "</div>\n" +
    "<div ng-if=\"row.apiObject.kind !== 'Pod'\">\n" +
    "<deployment-donut rc=\"row.current\" deployment-config=\"row.apiObject\" pods=\"row.getPods(row.current)\" hpa=\"row.hpa\" limit-ranges=\"row.state.limitRanges\" project=\"row.state.project\" quotas=\"row.state.quotas\" cluster-quotas=\"row.state.clusterQuotas\" scalable=\"row.isScalable()\">\n" +
    "</deployment-donut>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "\n" +
    "<div ng-if=\"!row.current\" class=\"empty-state-message\">\n" +
    "<div ng-include src=\" 'views/overview/_list-row-empty-state.html' \"></div>\n" +
    "</div>\n" +
    "<div ng-if=\"(row.state.breakpoint === 'xxs' || row.state.breakpoint === 'xs') && !row.state.previous\" class=\"row\">\n" +
    "<div class=\"col-sm-12\">\n" +
    "\n" +
    "<uib-tabset ng-if=\"row.current || (row.services | size) || row.recentPipelines.length || row.buildConfigs.length\" class=\"list-row-tabset\">\n" +
    "<uib-tab active=\"row.selectedTab.networking\" ng-if=\"row.services | size\">\n" +
    "<uib-tab-heading translate>Networking</uib-tab-heading>\n" +
    "<overview-networking row-services=\"row.services\" all-services=\"row.state.allServices\" routes-by-service=\"row.state.routesByService\">\n" +
    "</overview-networking>\n" +
    "</uib-tab>\n" +
    "<uib-tab ng-if=\"row.current\" active=\"row.selectedTab.containers\">\n" +
    "<uib-tab-heading translate>Containers</uib-tab-heading>\n" +
    "\n" +
    "<pod-template pod-template=\"row.current | podTemplate\" images-by-docker-reference=\"row.state.imagesByDockerReference\" builds=\"row.state.builds\"></pod-template>\n" +
    "</uib-tab>\n" +
    "<uib-tab ng-if=\"row.current && row.state.showMetrics && row.state.breakpoint === 'xxs'\" active=\"row.selectedTab.metrics\">\n" +
    "<uib-tab-heading translate>Metrics</uib-tab-heading>\n" +
    "\n" +
    "<div ng-if=\"row.selectedTab.metrics\">\n" +
    "<div ng-if=\"row.apiObject.kind === 'Pod'\">\n" +
    "<deployment-metrics pods=\"[row.apiObject]\" containers=\"row.apiObject.spec.containers\" profile=\"compact\" alerts=\"row.state.alerts\" class=\"overview-metrics\">\n" +
    "</deployment-metrics>\n" +
    "<h4 class=\"h5\" translate>Usage <small>Last 15 Minutes</small></h4>\n" +
    "</div>\n" +
    "<div ng-if=\"row.apiObject.kind !== 'Pod'\">\n" +
    "<deployment-metrics pods=\"row.getPods(row.current)\" containers=\"row.current.spec.template.spec.containers\" profile=\"compact\" alerts=\"row.state.alerts\" class=\"overview-metrics\">\n" +
    "</deployment-metrics>\n" +
    "<h4 class=\"h5\" translate>Average Usage <small>Last 15 Minutes</small></h4>\n" +
    "</div>\n" +
    "</div>\n" +
    "</uib-tab>\n" +
    "<uib-tab ng-if=\"!row.hidePipelines && row.recentPipelines.length\" active=\"row.selectedTab.pipelines\">\n" +
    "<uib-tab-heading>\n" +
    "<translate>Pipelines</translate>\n" +
    "<span class=\"build-count\">\n" +
    "<build-counts builds=\"row.recentPipelines\"></build-counts>\n" +
    "</span>\n" +
    "</uib-tab-heading>\n" +
    "<overview-pipelines recent-pipelines=\"row.recentPipelines\">\n" +
    "</overview-pipelines>\n" +
    "</uib-tab>\n" +
    "<uib-tab ng-if=\"row.buildConfigs.length\" active=\"row.selectedTab.builds\">\n" +
    "<uib-tab-heading>\n" +
    "<translate>Builds</translate>\n" +
    "<span class=\"build-count\">\n" +
    "<build-counts builds=\"row.recentBuilds\"></build-counts>\n" +
    "</span>\n" +
    "</uib-tab-heading>\n" +
    "<overview-builds build-configs=\"row.buildConfigs\" recent-builds-by-build-config=\"row.state.recentBuildsByBuildConfig\" context=\"row.state.context\" hide-log=\"row.state.limitWatches\">\n" +
    "</overview-builds>\n" +
    "</uib-tab>\n" +
    "<uib-tab ng-if=\"row.bindings | size\" active=\"row.selectedTab.bindings\">\n" +
    "<uib-tab-heading translate>Bindings</uib-tab-heading>\n" +
    "<overview-service-bindings bindings=\"row.bindings\" bindable-service-instances=\"row.state.bindableServiceInstances\" service-classes=\"row.state.serviceClasses\" service-instances=\"row.state.serviceInstances\" secrets=\"row.state.secrets\" create-binding=\"row.showOverlayPanel('bindService', {target: row.apiObject})\">\n" +
    "</overview-service-bindings>\n" +
    "</uib-tab>\n" +
    "</uib-tabset>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"row.state.breakpoint !== 'xxs' && row.state.breakpoint !== 'xs'\">\n" +
    "\n" +
    "<overview-networking row-services=\"row.services\" all-services=\"row.state.allServices\" routes-by-service=\"row.state.routesByService\">\n" +
    "</overview-networking>\n" +
    "\n" +
    "<overview-pipelines ng-if=\"!row.hidePipelines\" recent-pipelines=\"row.recentPipelines\">\n" +
    "</overview-pipelines>\n" +
    "\n" +
    "<overview-builds build-configs=\"row.buildConfigs\" recent-builds-by-build-config=\"row.state.recentBuildsByBuildConfig\" context=\"row.state.context\" hide-log=\"row.state.limitWatches\">\n" +
    "</overview-builds>\n" +
    "<overview-service-bindings bindings=\"row.bindings\" bindable-service-instances=\"row.state.bindableServiceInstances\" service-classes=\"row.state.serviceClasses\" service-instances=\"row.state.serviceInstances\" secrets=\"row.state.secrets\" create-binding=\"row.showOverlayPanel('bindService', {target: row.apiObject})\">\n" +
    "</overview-service-bindings>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div> "
  );


  $templateCache.put('views/overview/_list-row.html',
    "<div class=\"list-pf-item\" ng-class=\"{\n" +
    "  'active': row.expanded,\n" +
    "  'deployment-in-progress': row.previous\n" +
    "}\">\n" +
    "<div class=\"list-pf-container\" ng-click=\"row.toggleExpand($event)\">\n" +
    "<div class=\"list-pf-chevron\">\n" +
    "<div ng-include src=\" 'views/overview/_list-row-chevron.html' \" class=\"list-pf-content\"></div>\n" +
    "</div>\n" +
    "<div ng-include src=\" 'views/overview/_list-row-content.html' \" class=\"list-pf-content\"></div>\n" +
    "<div ng-include src=\" 'views/overview/_list-row-actions.html' \"></div>\n" +
    "</div>\n" +
    "<div class=\"list-pf-expansion collapse\" ng-if=\"row.expanded\" ng-class=\"{ in: row.expanded }\">\n" +
    "<div ng-include src=\" 'views/overview/_list-row-expanded.html' \"></div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<overlay-panel single-column=\"true\" show-panel=\"row.overlay.panelVisible\" show-close=\"true\" handle-close=\"row.closeOverlayPanel\">\n" +
    "<div ng-if=\"row.overlay.panelName === 'bindService'\">\n" +
    "<bind-service target=\"row.overlay.state.target\" project=\"row.state.project\" on-close=\"row.closeOverlayPanel\"></bind-service>\n" +
    "</div>\n" +
    "<div ng-if=\"row.overlay.panelName === 'unbindService'\">\n" +
    "<unbind-service target=\"row.overlay.state.target\" bindings=\"row.state.deleteableBindingsByApplicationUID[row.overlay.state.target.metadata.uid]\" on-close=\"row.closeOverlayPanel\"></unbind-service>\n" +
    "</div>\n" +
    "</overlay-panel>"
  );


  $templateCache.put('views/overview/_metrics-summary.html',
    "<div in-view=\"metricsSummary.updateInView($inview)\" in-view-options=\"{ throttle: 50 }\">\n" +
    "<div ng-repeat=\"metric in metricsSummary.metrics\" class=\"metrics-summary\">\n" +
    "<div class=\"usage-value\">\n" +
    "<span class=\"fade-inline\" ng-hide=\"metric.currentUsage | isNil\">\n" +
    "{{metric.formatUsage(metric.currentUsage)}}\n" +
    "</span>\n" +
    "<span ng-if=\"metric.currentUsage | isNil\" class=\"text-muted\" aria-hidden=\"true\">\n" +
    "--\n" +
    "</span>\n" +
    "</div>\n" +
    "<div class=\"usage-label\">\n" +
    "{{metric.usageUnits(metric.currentUsage) | capitalize}} {{metric.label}}\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/overview/_mini-log.html',
    "<div ng-if=\"miniLog.lines.length\" class=\"mini-log\">\n" +
    "<div class=\"mini-log-content\">\n" +
    "<div ng-repeat=\"line in miniLog.lines track by line.id\" ng-bind-html=\"::line.markup\" class=\"mini-log-line\"></div>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/overview/_networking.html',
    "<div ng-if=\"networking.rowServices | size\" class=\"expanded-section networking-section\">\n" +
    "<div class=\"section-title hidden-xs\" translate>Networking</div>\n" +
    "<div ng-repeat=\"service in networking.rowServices\" class=\"row\">\n" +
    "<div class=\"col-sm-5 col-md-6\">\n" +
    "<div class=\"component-label\">\n" +
    "<translate>Service</translate>\n" +
    "<span class=\"sublabel\" translate>Internal Traffic</span>\n" +
    "</div>\n" +
    "<h3>\n" +
    "<a ng-href=\"{{service | navigateResourceURL}}\">{{service.metadata.name}}</a>\n" +
    "</h3>\n" +
    "<span ng-repeat=\"portMapping in service.spec.ports | limitTo : 1\">\n" +
    "{{portMapping.port}}/{{portMapping.protocol}} <span ng-if=\"portMapping.name\">({{portMapping.name}})</span>\n" +
    "<i class=\"fa fa-long-arrow-right text-muted\"></i>\n" +
    "{{portMapping.targetPort}}\n" +
    "</span>\n" +
    "<span ng-if=\"service.spec.ports.length >= 2\">\n" +
    "<translate>and</translate>\n" +
    "<span class=\"nowrap\">\n" +
    "{{service.spec.ports.length - 1}}\n" +
    "<span ng-if=\"service.spec.ports.length > 2\" translate>others</span>\n" +
    "<span ng-if=\"service.spec.ports.length === 2\" translate>other</span>\n" +
    "</span>\n" +
    "</span>\n" +
    "</div>\n" +
    "<div class=\"col-sm-7 col-md-6 overview-routes\">\n" +
    "<div class=\"component-label\">\n" +
    "<translate>Routes</translate>\n" +
    "<span class=\"sublabel\" translate>External Traffic</span>\n" +
    "</div>\n" +
    "<div ng-if=\"networking.routesByService[service.metadata.name] | size\">\n" +
    "<div ng-repeat=\"route in networking.routesByService[service.metadata.name] | limitTo : 2 track by (route | uid)\" class=\"overview-routes\">\n" +
    "<h3>\n" +
    "<span ng-if=\"route | isWebRoute\">\n" +
    "<a ng-href=\"{{route | routeWebURL}}\" target=\"_blank\">{{route | routeLabel}}</a>\n" +
    "<i class=\"fa fa-external-link small\" aria-hidden=\"true\"></i>\n" +
    "</span>\n" +
    "<span ng-if=\"!(route | isWebRoute)\">{{route | routeLabel}}</span>\n" +
    "<route-warnings route=\"route\" services=\"networking.allServices\"></route-warnings>\n" +
    "</h3>\n" +
    "<div class=\"overview-route\" translate>\n" +
    "Route <a ng-href=\"{{route | navigateResourceURL}}\">{{route.metadata.name}}</a><span ng-if=\"route.spec.port.targetPort\">, target port {{route.spec.port.targetPort}}</span>\n" +
    "</div>\n" +
    "<div ng-if=\"route | hasAlternateBackends\">\n" +
    "<route-service-bar-chart route=\"route\" highlight-service=\"service.metadata.name\"></route-service-bar-chart>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"!(networking.routesByService[service.metadata.name] | size)\">\n" +
    "<a ng-if=\"'routes' | canI : 'create'\" ng-href=\"project/{{service.metadata.namespace}}/create-route?service={{service.metadata.name}}\" translate>Create Route</a>\n" +
    "<span ng-if=\"!('routes' | canI : 'create')\" class=\"text-muted\" translate>No Routes</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/overview/_notification-icon.html',
    "<div ng-if=\"notification.byType.error\" class=\"notification-icon-count animate-if\">\n" +
    "<span dynamic-content=\"{{notification.byType.error}}\" data-toggle=\"tooltip\" data-trigger=\"hover\">\n" +
    "<span class=\"pficon pficon-error-circle-o\" aria-hidden=\"true\"></span>\n" +
    "{{notification.countByType.error}}\n" +
    "<span ng-if=\"notification.countByType.error === 1\">\n" +
    "Error\n" +
    "</span>\n" +
    "<span ng-if=\"notification.countByType.error !== 1\">\n" +
    "Errors\n" +
    "</span>\n" +
    "</span>\n" +
    "</div>\n" +
    "<div ng-if=\"notification.byType.warning\" class=\"notification-icon-count animate-if\">\n" +
    "<span dynamic-content=\"{{notification.byType.warning}}\" data-toggle=\"tooltip\" data-trigger=\"hover\">\n" +
    "<span class=\"pficon pficon-warning-triangle-o\" aria-hidden=\"true\"></span>\n" +
    "{{notification.countByType.warning}}\n" +
    "<span ng-if=\"notification.countByType.warning === 1\" translate>\n" +
    "Warning\n" +
    "</span>\n" +
    "<span ng-if=\"notification.countByType.warning !== 1\" translate>\n" +
    "Warnings\n" +
    "</span>\n" +
    "</span>\n" +
    "</div>\n" +
    "<div ng-if=\"notification.byType.info\" class=\"notification-icon-count animate-if\">\n" +
    "<span dynamic-content=\"{{notification.byType.info}}\" data-toggle=\"tooltip\" data-trigger=\"hover\">\n" +
    "<span class=\"pficon pficon-info\" aria-hidden=\"true\"></span>\n" +
    "{{notification.countByType.info}}\n" +
    "<span ng-if=\"notification.countByType.info === 1\" translate>\n" +
    "Message\n" +
    "</span>\n" +
    "<span ng-if=\"notification.countByType.info !== 1\" translate>\n" +
    "Messages\n" +
    "</span>\n" +
    "</span>\n" +
    "</div>"
  );


  $templateCache.put('views/overview/_pipelines.html',
    "<div ng-if=\"overviewPipelines.recentPipelines.length\" class=\"expanded-section\">\n" +
    "<div class=\"section-title no-border hidden-xs\" translate>Pipelines</div>\n" +
    "<div ng-repeat=\"pipeline in overviewPipelines.recentPipelines track by (pipeline | uid)\" class=\"build-pipeline-wrapper animate-repeat\">\n" +
    "<build-pipeline build=\"pipeline\" build-config-name-on-expanded=\"true\" collapse-pending=\"true\"></build-pipeline>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/overview/_service-binding.html',
    "<div class=\"row service-binding\">\n" +
    "<div class=\"col-sm-5 col-md-6\">\n" +
    "<h3 ng-if=\"$ctrl.serviceClass\">\n" +
    "{{$ctrl.serviceClass.externalMetadata.displayName || $ctrl.serviceClass.metadata.name}}\n" +
    "<small>{{$ctrl.binding.spec.instanceRef.name}}</small>\n" +
    "</h3>\n" +
    "<h3 ng-if=\"!$ctrl.serviceClass\">\n" +
    "{{$ctrl.binding.spec.instanceRef.name}}\n" +
    "</h3>\n" +
    "</div>\n" +
    "<div class=\"col-sm-7 col-md-6 overview-bindings\">\n" +
    "<span ng-if=\"!($ctrl.binding | isBindingReady)\">\n" +
    "<status-icon status=\"'Pending'\"></status-icon> <translate>Pending</translate>\n" +
    "</span>\n" +
    "<a ng-if=\"($ctrl.binding | isBindingReady) && ('secrets' | canI : 'get')\" ng-href=\"{{$ctrl.secrets[$ctrl.binding.spec.secretName] | navigateResourceURL}}\" translate>\n" +
    "View Secret\n" +
    "</a>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/overview/_service-bindings.html',
    "<div ng-if=\"($ctrl.bindings | size)\" class=\"expanded-section\">\n" +
    "<div class=\"section-title hidden-xs\" translate>Service Bindings</div>\n" +
    "<overview-service-binding ng-repeat=\"binding in $ctrl.bindings track by (binding | uid)\" binding=\"binding\" service-classes=\"$ctrl.serviceClasses\" service-instances=\"$ctrl.serviceInstances\" secrets=\"$ctrl.secrets\">\n" +
    "</overview-service-binding>\n" +
    "<div ng-if=\"($ctrl.bindableServiceInstances | size) && ({resource: 'bindings', group: 'servicecatalog.k8s.io'} | canI : 'create')\">\n" +
    "<a href=\"\" ng-click=\"$ctrl.createBinding()\" role=\"button\" translate>Create Binding</a>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/overview/_service-header.html',
    "<div row class=\"service-title\" ng-if=\"service\">\n" +
    "<div class=\"service-name truncate\">\n" +
    "<span class=\"pficon pficon-service\" aria-hidden=\"true\" title=\"Service\"></span>\n" +
    "<span class=\"sr-only\" translate>Service</span>\n" +
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


  $templateCache.put('views/overview/_service-instance-row.html',
    "<div class=\"list-pf-item provisioned-service\" ng-class=\"{ active: row.expanded }\">\n" +
    "<div class=\"list-pf-container\" ng-click=\"row.toggleExpand($event)\">\n" +
    "<div class=\"list-pf-chevron\">\n" +
    "<div ng-include src=\" 'views/overview/_list-row-chevron.html' \" class=\"list-pf-content\"></div>\n" +
    "</div>\n" +
    "<div class=\"list-pf-content\">\n" +
    "<div class=\"list-pf-name\">\n" +
    "<h3>\n" +
    "<span ng-bind-html=\"row.displayName | highlightKeywords : row.state.filterKeywords\"></span>\n" +
    "<div ng-bind-html=\"row.apiObject.metadata.name | highlightKeywords : row.state.filterKeywords\" class=\"list-row-longname\"></div>\n" +
    "</h3>\n" +
    "<div class=\"status-icons\">\n" +
    "<notification-icon ng-if=\"!row.expanded\" alerts=\"row.notifications\"></notification-icon>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"list-pf-details\">\n" +
    "<div ng-if=\"!row.expanded\">\n" +
    "<div class=\"hidden-xs hidden-sm\">\n" +
    "<span ng-if=\"!row.bindings.length\n" +
    "                        && row.isBindable\n" +
    "                        && ({resource: 'bindings', group: 'servicecatalog.k8s.io'} | canI : 'create')\">\n" +
    "<a href=\"\" ng-click=\"row.showOverlayPanel('bindService', {target: row.apiObject})\" translate>Create Binding</a>\n" +
    "</span>\n" +
    "<span ng-if=\"row.bindings.length\" class=\"component-label\" translate>Bindings</span>\n" +
    "<p ng-if=\"firstBinding = row.bindings[0]\" class=\"bindings\">\n" +
    "<span ng-if=\"application = row.state.applicationsByBinding[firstBinding.metadata.name][0]\">\n" +
    "{{application.metadata.name}}\n" +
    "</span>\n" +
    "<span ng-if=\"!application\">\n" +
    "{{firstBinding.spec.secretName}}\n" +
    "</span>\n" +
    "<span ng-if=\"row.bindings.length > 1\">\n" +
    "<translate>and</translate>\n" +
    "<a ng-if=\"row.bindings.length > 1\" ng-click=\"row.toggleExpand($event, true)\">\n" +
    "<translate>{{row.bindings.length -1}} other<span ng-if=\"row.bindings.length > 2\">s</span></translate></a>\n" +
    "</span>\n" +
    "</p>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"hidden-xs\" ng-if=\"!row.expanded && row.apiObject.status.dashboardURL\">\n" +
    "<a ng-href=\"{{row.apiObject.status.dashboardURL}}\" target=\"_blank\">\n" +
    "Console\n" +
    "</a> <i class=\"fa fa-external-link small\" aria-hidden=\"true\"></i>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"list-pf-actions\" ng-if=\"row.actionsDropdownVisible()\">\n" +
    "<div uib-dropdown>\n" +
    "<a href=\"\" uib-dropdown-toggle class=\"actions-dropdown-kebab\"><i class=\"fa fa-ellipsis-v\"></i><span class=\"sr-only\" translate>Actions</span></a>\n" +
    "<ul class=\"dropdown-menu dropdown-menu-right\" uib-dropdown-menu role=\"menu\">\n" +
    "<li role=\"menuitem\" ng-if=\"row.isBindable && ({resource: 'bindings', group: 'servicecatalog.k8s.io'} | canI : 'create')\">\n" +
    "<a href=\"\" ng-click=\"row.showOverlayPanel('bindService', {target: row.apiObject})\" translate>Create Binding</a>\n" +
    "</li>\n" +
    "<li role=\"menuitem\" ng-if=\"row.deleteableBindings.length && ({resource: 'bindings', group: 'servicecatalog.k8s.io'} | canI : 'delete')\">\n" +
    "<a href=\"\" ng-click=\"row.showOverlayPanel('unbindService', {target: row.apiObject})\" translate>Delete Binding</a>\n" +
    "</li>\n" +
    "<li role=\"menuitem\">\n" +
    "<a href=\"\" ng-click=\"row.deprovision()\" role=\"button\" ng-if=\"{resource: 'instances', group: 'servicecatalog.k8s.io'} | canI : 'delete'\" translate>Delete</a>\n" +
    "</li>\n" +
    "</ul>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"list-pf-expansion collapse\" ng-if=\"row.expanded\" ng-class=\"{ in: row.expanded }\">\n" +
    "<div class=\"list-pf-container\">\n" +
    "<div class=\"expanded-section\">\n" +
    "<alerts alerts=\"row.notifications\"></alerts>\n" +
    "\n" +
    "<div class=\"row\">\n" +
    "<div class=\"col-sm-12\" ng-if=\"row.description\">\n" +
    "<p class=\"pre-wrap\" ng-bind-html=\"row.description | linky\"></p>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"section-title\" ng-if=\"row.isBindable || row.bindings\">\n" +
    "Application Bindings\n" +
    "</div>\n" +
    "<div class=\"row overview-bindings\" ng-repeat=\"(name, binding) in row.bindings\">\n" +
    "<div class=\"col-sm-5 col-md-6\">\n" +
    "<div ng-if=\"!(row.state.applicationsByBinding[binding.metadata.name] | size)\">\n" +
    "<h3>\n" +
    "<div class=\"component-label\">\n" +
    "Secret\n" +
    "</div>\n" +
    "<span ng-if=\"(binding | isBindingReady) && ('secrets' | canI : 'get')\">\n" +
    "<a ng-if=\"(binding | isBindingReady) && ('secrets' | canI : 'get')\" ng-href=\"{{row.getSecretForBinding(binding) | navigateResourceURL}}\">\n" +
    "{{binding.spec.secretName}}\n" +
    "</a>\n" +
    "</span>\n" +
    "<span ng-if=\"!(binding | isBindingReady) || !('secrets' | canI : 'get')\">\n" +
    "{{binding.spec.secretName}}\n" +
    "</span>\n" +
    "</h3>\n" +
    "</div>\n" +
    "<div ng-repeat=\"target in row.state.applicationsByBinding[binding.metadata.name] track by (target | uid)\">\n" +
    "<h3>\n" +
    "<div class=\"component-label\">\n" +
    "{{target.kind | humanizeKind : true}}\n" +
    "</div>\n" +
    "<a ng-href=\"{{target | navigateResourceURL}}\">{{target.metadata.name}}</a>\n" +
    "</h3>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"col-sm-7 col-md-6 overview-bindings\">\n" +
    "<span ng-if=\"binding.metadata.deletionTimestamp\">\n" +
    "<status-icon status=\"'Pending'\"></status-icon> Deleting\n" +
    "</span>\n" +
    "<span ng-if=\"!(binding | isBindingReady) && !binding.metadata.deletionTimestamp\">\n" +
    "<status-icon status=\"'Pending'\"></status-icon> Pending\n" +
    "</span>\n" +
    "<a ng-if=\"(binding | isBindingReady) && ('secrets' | canI : 'get')\" ng-href=\"{{row.getSecretForBinding(binding) | navigateResourceURL}}\">\n" +
    "View Secret\n" +
    "</a>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"row\" ng-if=\"row.isBindable && ({resource: 'bindings', group: 'servicecatalog.k8s.io'} | canI : 'create')\">\n" +
    "<div class=\"col-sm-12\">\n" +
    "<a href=\"\" ng-click=\"row.showOverlayPanel('bindService', {target: row.apiObject})\">Create Binding</a>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"row\" ng-if=\"!row.bindings.length && (!row.isBindable || !({resource: 'bindings', group: 'servicecatalog.k8s.io'} | canI : 'create'))\">\n" +
    "<div class=\"col-sm-12\">\n" +
    "<em>No bindings</em>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<overlay-panel single-column=\"true\" show-panel=\"row.overlay.panelVisible\" show-close=\"true\" handle-close=\"row.closeOverlayPanel\">\n" +
    "<div ng-if=\"row.overlay.panelName === 'bindService'\">\n" +
    "<bind-service target=\"row.overlay.state.target\" project=\"row.state.project\" on-close=\"row.closeOverlayPanel\"></bind-service>\n" +
    "</div>\n" +
    "<div ng-if=\"row.overlay.panelName === 'unbindService'\">\n" +
    "<unbind-service target=\"row.overlay.state.target\" bindings=\"row.deleteableBindings\" applications-by-binding=\"row.state.applicationsByBinding\" on-close=\"row.closeOverlayPanel\"></unbind-service>\n" +
    "</div>\n" +
    "</overlay-panel>"
  );


  $templateCache.put('views/overview/_service-linking-button.html',
    " <a href=\"\" ng-if=\"isPrimary && (services | hashSize) > ((childServices | hashSize) + 1)\" ng-click=\"linkService()\" role=\"button\" ng-attr-title=\"Group service to {{service.metadata.name}}\"><i class=\"fa fa-chain action-button link-service-button\" aria-hidden=\"true\"></i><span class=\"sr-only\">Group service to {{service.metadata.name}}</span></a>\n" +
    "<a href=\"\" ng-if=\"isChild\" ng-click=\"removeLink(service)\" role=\"button\" ng-attr-title=\"Remove {{service.metadata.name}} from service group\"><i class=\"fa fa-chain-broken action-button link-service-button\" aria-hidden=\"true\"></i><span class=\"sr-only\">Remove {{service.metadata.name}} from service group</span></a>"
  );


  $templateCache.put('views/overview/_traffic-percent.html',
    "<div ng-if=\"!totalWeight\">\n" +
    "No Traffic\n" +
    "</div>\n" +
    "<div ng-if=\"totalWeight\">\n" +
    "<span class=\"visible-xs visible-sm\">\n" +
    "<translate>Traffic</translate> {{(weightByService[service.metadata.name] / totalWeight) | percent}}\n" +
    "</span>\n" +
    "<div class=\"hidden-xs hidden-sm\">\n" +
    "<span class=\"traffic-label\" translate>Traffic</span>\n" +
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
    "<translate>Pipelines</translate>\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
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
    "<div ng-if=\"!buildConfigsLoaded\" translate>\n" +
    "Loading...\n" +
    "</div>\n" +
    "<div ng-if=\"buildConfigsLoaded\" class=\"empty-state-message text-center\">\n" +
    "<h2 translate>No pipelines.</h2>\n" +
    "<div ng-if=\"project.metadata.name | canIAddToProject\">\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "<p ng-if=\"(project.metadata.name | canIAddToProject) && createSampleURL\">\n" +
    "<a ng-href=\"{{createSampleURL}}\" class=\"btn btn-lg btn-primary\" translate>\n" +
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
    "<button class=\"btn btn-default\" ng-if=\"'buildconfigs/instantiate' | canI : 'create'\" ng-click=\"startBuild(buildConfig)\" translate>\n" +
    "Start Pipeline\n" +
    "</button>\n" +
    "</div>\n" +
    "<h2 class=\"mar-top-none\">\n" +
    "<a ng-href=\"{{buildConfig | navigateResourceURL}}\">{{buildConfigName}}</a>\n" +
    "<small><translate>created</translate> <span am-time-ago=\"buildConfig.metadata.creationTimestamp\"></span></small>\n" +
    "</h2>\n" +
    "<div ng-if=\"buildConfig.spec.source.git.uri\">\n" +
    "<translate>Source Repository:</translate>\n" +
    "<span class=\"word-break\" ng-if=\"buildConfigs[buildConfigName].spec.source.type == 'Git'\"><osc-git-link uri=\"buildConfigs[buildConfigName].spec.source.git.uri\" ref=\"buildConfigs[buildConfigName].spec.source.git.ref\" context-dir=\"buildConfigs[buildConfigName].spec.source.contextDir\">{{buildConfigs[buildConfigName].spec.source.git.uri}}</osc-git-link></span>\n" +
    "</div>\n" +
    "</div>\n" +
    "\n" +
    "<div ng-if=\"!buildConfig\">\n" +
    "<h2>{{buildConfigName}}</h2>\n" +
    "\n" +
    "<div ng-if=\"buildConfigsLoaded\" class=\"alert alert-warning\">\n" +
    "<span class=\"pficon pficon-warning-triangle-o\" aria-hidden=\"true\"></span>\n" +
    "<span class=\"sr-only\" translate>Warning:</span>\n" +
    "<translate>Build config <strong>{{buildConfigName}}</strong> no longer exists.</translate>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"buildsLoaded && !(interestingBuildsByConfig[buildConfigName] | hashSize)\">\n" +
    "<p class=\"mar-bottom-xxl\">\n" +
    "<translate>No pipeline builds have run for {{buildConfigName}}.</translate>\n" +
    "<span ng-if=\"buildConfig.spec.strategy.jenkinsPipelineStrategy.jenkinsfile\" translate>\n" +
    "View the <a ng-href=\"{{(buildConfig | navigateResourceURL) + '?tab=configuration'}}\">Jenkinsfile</a> to see what stages will run.\n" +
    "</span>\n" +
    "<span ng-if=\"buildConfig.spec.strategy.jenkinsPipelineStrategy.jenkinsfilePath\">\n" +
    "<translate>View the file <code>{{buildConfig.spec.strategy.jenkinsPipelineStrategy.jenkinsfilePath}}</code> in the</translate>\n" +
    "<a ng-if=\"buildConfig | jenkinsfileLink\" ng-href=\"buildConfig | jenkinsfileLink\" translate>source repository</a>\n" +
    "<span ng-if=\"!(buildConfig | jenkinsfileLink)\" translate>source repository</span>\n" +
    "<translate>to see what stages will run.</translate>\n" +
    "</span>\n" +
    "</p>\n" +
    "</div>\n" +
    "<div ng-if=\"interestingBuildsByConfig[buildConfigName] | hashSize\">\n" +
    "<div ng-if=\"!(statsByConfig[buildConfigName].avgDuration | isNil)\" class=\"hidden-xs pull-right text-muted\">\n" +
    "<translate>Average Duration:</translate>\n" +
    "{{statsByConfig[buildConfigName].avgDuration | timeOnlyDuration}}\n" +
    "</div>\n" +
    "<h4>\n" +
    "<translate>Recent Runs</translate>\n" +
    "<small ng-if=\"!(statsByConfig[buildConfigName].avgDuration | isNil)\" class=\"visible-xs-block mar-top-xs text-muted\">\n" +
    "<translate>Average Duration:</translate>\n" +
    "{{statsByConfig[buildConfigName].avgDuration | timeOnlyDuration}}\n" +
    "</small>\n" +
    "</h4>\n" +
    "<div ng-repeat=\"build in (interestingBuildsByConfig[buildConfigName] | orderObjectsByDate : true) track by (build | uid)\" class=\"animate-repeat\">\n" +
    "<build-pipeline build=\"build\"></build-pipeline>\n" +
    "</div>\n" +
    "<div ng-if=\"buildConfig\" class=\"mar-top-sm mar-bottom-xl\">\n" +
    "<a ng-href=\"{{buildConfigs[buildConfigName] | navigateResourceURL}}\" translate>View Pipeline Runs</a>\n" +
    "<span ng-if=\"'buildconfigs' | canI : 'update'\">\n" +
    "<span class=\"action-divider\">|</span>\n" +
    "<a ng-href=\"{{buildConfig | editResourceURL}}\" role=\"button\" translate>Edit Pipeline</a>\n" +
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
    "<translate>Pods</translate>\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
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
    "<div class=\"middle-content\">\n" +
    "<div class=\"container-fluid\">\n" +
    "<alerts alerts=\"alerts\"></alerts>\n" +
    "<div class=\"row\">\n" +
    "<div class=\"col-md-12\">\n" +
    "<pods-table pods=\"pods\" empty-message=\"emptyMessage|translate\"></pods-table>\n" +
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
    "<h2 class=\"text-center\" translate>Loading...</h2>\n" +
    "</div>\n" +
    "<div ng-if=\"!loading\">\n" +
    "<div class=\"projects-header\">\n" +
    "<div class=\"projects-bar\">\n" +
    "<h1 translate>My Projects</h1>\n" +
    "<div class=\"projects-options\">\n" +
    "<div class=\"projects-add\" ng-if=\"canCreate\">\n" +
    "<a href=\"create-project\" class=\"btn btn-md btn-primary\" translate>\n" +
    "Create Project\n" +
    "</a>\n" +
    "</div>\n" +
    "<div class=\"projects-search\">\n" +
    "<form role=\"form\" class=\"search-pf has-button\">\n" +
    "<div class=\"form-group has-clear\">\n" +
    "<div class=\"search-pf-input-group\">\n" +
    "<label for=\"search-projects\" class=\"sr-only\" translate>Filter by keyword</label>\n" +
    "<input type=\"search\" class=\"form-control\" placeholder=\"{{'Filter by keyword'|translate}}\" id=\"search-projects\" ng-model=\"search.text\">\n" +
    "<button type=\"button\" class=\"clear\" aria-hidden=\"true\" ng-if=\"search.text\" ng-click=\"search.text = ''\">\n" +
    "<span class=\"pficon pficon-close\"></span>\n" +
    "</button>\n" +
    "</div>\n" +
    "</div>\n" +
    "</form>\n" +
    "<span class=\"vertical-divider\"></span>\n" +
    "<span class=\"projects-sort-label\" translate>Sort by</span>\n" +
    "<div class=\"projects-sort\">\n" +
    "<div pf-sort config=\"sortConfig\" class=\"sort-controls\"></div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"!projects.length\" class=\"h3\">\n" +
    "<translate>The current filter is hiding all projects.</translate>\n" +
    "<a href=\"\" ng-click=\"search.text = ''\" role=\"button\" translate>Clear Filter</a>\n" +
    "</div>\n" +
    "<div class=\"list-group list-view-pf projects-list\">\n" +
    "<div ng-repeat=\"project in projects\" class=\"list-group-item project-info tile-click\">\n" +
    "<div class=\"list-view-pf-main-info\">\n" +
    "<div class=\"list-view-pf-description project-names\">\n" +
    "<div class=\"list-group-item-heading project-name-item\">\n" +
    "<h2 class=\"h1\">\n" +
    "<a class=\"tile-target\" ng-href=\"project/{{project.metadata.name}}\" title=\"{{project | displayName}}\"><span ng-bind-html=\"project | displayName | highlightKeywords : keywords\"></span></a>\n" +
    "<span ng-if=\"project.status.phase != 'Active'\" data-toggle=\"tooltip\" title=\"{{'This project has been marked for deletion.'|translate}}\" class=\"pficon pficon-warning-triangle-o\"></span>\n" +
    "</h2>\n" +
    "<small>\n" +
    "<span ng-if=\"project | displayName : true\"><span ng-bind-html=\"project.metadata.name | highlightKeywords : keywords\"></span> &ndash;</span>\n" +
    "<translate>created</translate>\n" +
    "<span ng-if=\"project | annotation : 'openshift.io/requester'\"><translate>by</translate> <span ng-bind-html=\"project | annotation : 'openshift.io/requester' | highlightKeywords : keywords\"></span></span>\n" +
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
    "<div row class=\"list-view-pf-actions list-pf-actions\" ng-if=\"project.status.phase == 'Active'\">\n" +
    "<div uib-dropdown>\n" +
    "<a href=\"\" uib-dropdown-toggle class=\"actions-dropdown-kebab\"><i class=\"fa fa-ellipsis-v\" aria-hidden=\"true\"></i><span class=\"sr-only\" translate>Actions</span></a>\n" +
    "<ul class=\"dropdown-menu dropdown-menu-right\" uib-dropdown-menu role=\"menu\">\n" +
    "<li role=\"menuitem\">\n" +
    "<a ng-href=\"project/{{project.metadata.name}}/membership\" translate>\n" +
    "View Membership\n" +
    "</a>\n" +
    "</li>\n" +
    "<li role=\"menuitem\">\n" +
    "<a ng-href=\"project/{{project.metadata.name}}/edit?then=./\" translate>\n" +
    "Edit Project\n" +
    "</a>\n" +
    "</li>\n" +
    "<li role=\"menuitem\">\n" +
    "<delete-link kind=\"Project\" label=\"{{'Delete Project'|translate}}\" resource-name=\"{{project.metadata.name}}\" project-name=\"{{project.metadata.name}}\" display-name=\"{{(project | displayName)}}\" type-name-to-confirm=\"true\" stay-on-current-page=\"true\" alerts=\"alerts\" translate>Delete\n" +
    "</delete-link>\n" +
    "</li>\n" +
    "</ul>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<p class=\"projects-instructions\" ng-if=\"canCreate === false\" ng-include=\"'views/_cannot-create-project.html'\"></p>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"showGetStarted\">\n" +
    "<div class=\"empty-state-message empty-state-full-page text-center\">\n" +
    "<h1 translate>Welcome to DataMan OS.</h1>\n" +
    "<p>\n" +
    "<translate>DataMan OS helps you quickly develop, host, and scale applications.</translate><br>\n" +
    "<span ng-if=\"canCreate\" translate>Create a project for your application.</span>\n" +
    "</p>\n" +
    "<a ng-if=\"canCreate\" href=\"create-project\" class=\"btn btn-lg btn-primary\" translate>Create Project</a>\n" +
    "\n" +
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
    "<span ng-if=\"clusterQuotas.length\" translate>Cluster </span><translate>Quota</translate>\n" +
    "<span class=\"page-header-link\">\n" +
    "\n" +
    "\n" +
    "\n" +
    "</span>\n" +
    "</h1>\n" +
    "<div ng-if=\"!quotas.length && !clusterQuotas.length\" class=\"mar-top-xl\">\n" +
    "<div class=\"help-block\">{{quotaHelp}}</div>\n" +
    "<p><em ng-if=\"!quotas && !clusterQuotas\" translate>Loading...</em><em ng-if=\"quotas || clusterQuotas\" translate>There are no resource quotas set on this project.</em></p>\n" +
    "</div>\n" +
    "<div ng-repeat=\"quota in clusterQuotas | orderBy: 'metadata.name'\" class=\"gutter-bottom\">\n" +
    "<h2 ng-if=\"clusterQuotas.length\">{{quota.metadata.name}}</h2>\n" +
    "<div ng-if=\"$first\" class=\"help-block\" translate>Limits resource usage across a set of projects.</div>\n" +
    "<dl ng-if=\"quota.spec.quota.scopes.length\">\n" +
    "<dt translate>Scopes:</dt>\n" +
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
    "<h3 class=\"text-center\" translate>CPU <small>Request</small></h3>\n" +
    "<quota-usage-chart height=\"240\" used=\"namespaceUsageByClusterQuota[quota.metadata.name].used.cpu\" total=\"quota.status.total.hard.cpu\" cross-project-used=\"quota.status.total.used.cpu\" type=\"cpu\" class=\"quota-chart\"></quota-usage-chart>\n" +
    "</div>\n" +
    "<div ng-if=\"quota.status.total.hard.memory\" class=\"mar-lg\">\n" +
    "<h3 class=\"text-center\" translate>Memory <small>Request</small></h3>\n" +
    "<quota-usage-chart height=\"240\" used=\"namespaceUsageByClusterQuota[quota.metadata.name].used.memory\" cross-project-used=\"quota.status.total.used.memory\" total=\"quota.status.total.hard.memory\" type=\"memory\" class=\"quota-chart\"></quota-usage-chart>\n" +
    "</div>\n" +
    "<div ng-if=\"quota.status.total.hard['requests.cpu']\" class=\"mar-lg\">\n" +
    "<h3 class=\"text-center\" translate>CPU <small>Request</small></h3>\n" +
    "<quota-usage-chart height=\"240\" used=\"namespaceUsageByClusterQuota[quota.metadata.name].used['requests.cpu']\" cross-project-used=\"quota.status.total.used['requests.cpu']\" total=\"quota.status.total.hard['requests.cpu']\" type=\"cpu\" class=\"quota-chart\"></quota-usage-chart>\n" +
    "</div>\n" +
    "<div ng-if=\"quota.status.total.hard['requests.memory']\" class=\"mar-lg\">\n" +
    "<h3 class=\"text-center\" translate>Memory <small>Request</small></h3>\n" +
    "<quota-usage-chart height=\"240\" used=\"namespaceUsageByClusterQuota[quota.metadata.name].used['requests.memory']\" cross-project-used=\"quota.status.total.used['requests.memory']\" total=\"quota.status.total.hard['requests.memory']\" type=\"memory\" class=\"quota-chart\"></quota-usage-chart>\n" +
    "</div>\n" +
    "<div ng-if=\"quota.status.total.hard['limits.cpu']\" class=\"mar-lg\">\n" +
    "<h3 class=\"text-center\" translate>CPU <small>Limit</small></h3>\n" +
    "<quota-usage-chart height=\"240\" used=\"namespaceUsageByClusterQuota[quota.metadata.name].used['limits.cpu']\" cross-project-used=\"quota.status.total.used['limits.cpu']\" total=\"quota.status.total.hard['limits.cpu']\" type=\"cpu\" class=\"quota-chart\"></quota-usage-chart>\n" +
    "</div>\n" +
    "<div ng-if=\"quota.status.total.hard['limits.memory']\" class=\"mar-lg\">\n" +
    "<h3 class=\"text-center\" translate>Memory <small>Limit</small></h3>\n" +
    "<quota-usage-chart height=\"240\" used=\"namespaceUsageByClusterQuota[quota.metadata.name].used['limits.memory']\" cross-project-used=\"quota.status.total.used['limits.memory']\" total=\"quota.status.total.hard['limits.memory']\" type=\"memory\" class=\"quota-chart\"></quota-usage-chart>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"table-responsive\">\n" +
    "<table class=\"table table-bordered\">\n" +
    "<thead>\n" +
    "<th translate>Resource Type</th>\n" +
    "<th translate>Used (This Project)</th>\n" +
    "<th translate>Used (All Projects)</th>\n" +
    "<th translate>Max</th>\n" +
    "</thead>\n" +
    "<tbody>\n" +
    "<tr ng-if=\"!quota.status.total.used\" class=\"danger\">\n" +
    "<td colspan=\"5\">\n" +
    "<span data-toggle=\"tooltip\" title=\"{{'Missing quota status'|translate}}\" class=\"pficon pficon-error-circle-o\" style=\"cursor: help\"></span>\n" +
    "<translate>Status has not been reported on this quota usage record. Any resources limited by this quota record can not be allocated.</translate>\n" +
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
    "<span ng-if=\"(quota.status.total.hard[resourceType] || quota.spec.quota.hard[resourceType]) === '0'\" data-toggle=\"tooltip\" title=\"{{'You are not allowed to create resources of this type.'|translate}}\" class=\"pficon pficon-info warnings-popover\"></span>\n" +
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
    "<h1 ng-if=\"clusterQuotas.length && quotas.length\" translate>Project Quota</h1>\n" +
    "<div ng-repeat=\"quota in quotas | orderBy: 'metadata.name'\" class=\"gutter-bottom\">\n" +
    "<h2 ng-if=\"quotas.length\">{{quota.metadata.name}}</h2>\n" +
    "<div ng-if=\"$first\" class=\"help-block mar-bottom-md\">{{quotaHelp}}</div>\n" +
    "<dl ng-if=\"quota.spec.scopes.length\">\n" +
    "<dt translate>Scopes:</dt>\n" +
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
    "<h3 class=\"text-center\" translate>CPU <small>Request</small></h3>\n" +
    "<quota-usage-chart used=\"quota.status.used.cpu\" total=\"quota.status.hard.cpu\" type=\"cpu\" class=\"quota-chart\"></quota-usage-chart>\n" +
    "</div>\n" +
    "<div column ng-if=\"quota.status.hard.memory\" class=\"mar-lg\">\n" +
    "<h3 class=\"text-center\" translate>Memory <small>Request</small></h3>\n" +
    "<quota-usage-chart used=\"quota.status.used.memory\" total=\"quota.status.hard.memory\" type=\"memory\" class=\"quota-chart\"></quota-usage-chart>\n" +
    "</div>\n" +
    "<div column ng-if=\"quota.status.hard['requests.cpu']\" class=\"mar-lg\">\n" +
    "<h3 class=\"text-center\" translate>CPU <small>Request</small></h3>\n" +
    "<quota-usage-chart used=\"quota.status.used['requests.cpu']\" total=\"quota.status.hard['requests.cpu']\" type=\"cpu\" class=\"quota-chart\"></quota-usage-chart>\n" +
    "</div>\n" +
    "<div column ng-if=\"quota.status.hard['requests.memory']\" class=\"mar-lg\">\n" +
    "<h3 class=\"text-center\" translate>Memory <small>Request</small></h3>\n" +
    "<quota-usage-chart used=\"quota.status.used['requests.memory']\" total=\"quota.status.hard['requests.memory']\" type=\"memory\" class=\"quota-chart\"></quota-usage-chart>\n" +
    "</div>\n" +
    "<div ng-if=\"quota.status.hard['limits.cpu']\" class=\"mar-lg\">\n" +
    "<h3 class=\"text-center\" translate>CPU <small>Limit</small></h3>\n" +
    "<quota-usage-chart used=\"quota.status.used['limits.cpu']\" total=\"quota.status.hard['limits.cpu']\" type=\"cpu\" class=\"quota-chart\"></quota-usage-chart>\n" +
    "</div>\n" +
    "<div ng-if=\"quota.status.hard['limits.memory']\" class=\"mar-lg\">\n" +
    "<h3 class=\"text-center\" translate>Memory <small>Limit</small></h3>\n" +
    "<quota-usage-chart used=\"quota.status.used['limits.memory']\" total=\"quota.status.hard['limits.memory']\" type=\"memory\" class=\"quota-chart\"></quota-usage-chart>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"table-responsive\">\n" +
    "<table class=\"table table-bordered\">\n" +
    "<thead>\n" +
    "<th translate>Resource Type</th>\n" +
    "<th translate>Used</th>\n" +
    "<th translate>Max</th>\n" +
    "</thead>\n" +
    "<tbody>\n" +
    "<tr ng-if=\"!quota.status.used\" class=\"danger\">\n" +
    "<td colspan=\"5\">\n" +
    "<span data-toggle=\"tooltip\" title=\"{{'Missing quota status'|translate}}\" class=\"pficon pficon-error-circle-o\" style=\"cursor: help\"></span>\n" +
    "<translate>Status has not been reported on this quota usage record. Any resources limited by this quota record can not be allocated.</translate>\n" +
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
    "<span ng-if=\"(quota.status.hard[resourceType] || quota.spec.hard[resourceType]) === '0'\" data-toggle=\"tooltip\" title=\"{{'You are not allowed to create resources of this type.'|translate}}\" class=\"pficon pficon-info warnings-popover\"></span>\n" +
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
    "<h1 translate>Limit Range</h1>\n" +
    "<div ng-if=\"!limitRanges.length\">\n" +
    "<div class=\"help-block\">{{limitRangeHelp}}</div>\n" +
    "<p><em>{{emptyMessageLimitRanges|translate}}</em></p>\n" +
    "</div>\n" +
    "<div ng-repeat=\"limitRange in limitRanges\">\n" +
    "<h2 ng-if=\"limitRanges.length\">{{limitRange.metadata.name}}</h2>\n" +
    "<div ng-if=\"$first\" class=\"help-block mar-bottom-md\">{{limitRangeHelp}}</div>\n" +
    "<div class=\"table-responsive\">\n" +
    "<table class=\"table table-bordered\">\n" +
    "<thead>\n" +
    "<th translate>Resource Type</th>\n" +
    "<th>\n" +
    "<span class=\"nowrap\">\n" +
    "<translate>Min</translate>\n" +
    "<i class=\"small pficon pficon-help\" data-toggle=\"tooltip\" title=\"{{'The minimum amount of this compute resource that can be requested.'|translate}}\"></i>\n" +
    "</span>\n" +
    "</th>\n" +
    "<th>\n" +
    "<span class=\"nowrap\">\n" +
    "<translate>Max</translate>\n" +
    "<i class=\"small pficon pficon-help\" data-toggle=\"tooltip\" title=\"{{'The maximum amount of this compute resource that can be requested.  The limit must also be below the maximum value.'|translate}}\"></i>\n" +
    "</span>\n" +
    "</th>\n" +
    "<th>\n" +
    "<translate>Default</translate>\n" +
    "<span class=\"nowrap\">\n" +
    "<translate>Request</translate>\n" +
    "<i class=\"small pficon pficon-help\" data-toggle=\"tooltip\" title=\"{{'A container will default to request this amount of a compute resource if no request is specified. The system will guarantee the requested amount of compute resource when scheduling a container for execution. If a quota is enabled for this compute resource, the quota usage is incremented by the requested value.'|translate}}\"></i>\n" +
    "</span>\n" +
    "</th>\n" +
    "<th>\n" +
    "<translate>Default</translate>\n" +
    "<span class=\"nowrap\">\n" +
    "<translate>Limit</translate>\n" +
    "<i class=\"small pficon pficon-help\" data-toggle=\"tooltip\" title=\"{{'The default limit defines the maximum amount of compute resource the container may have access to during execution if no limit is specified. If no request is made for the compute resource on the container or via a Default Request value, the container will default to request the limit.'|translate}}\"></i>\n" +
    "</span>\n" +
    "</th>\n" +
    "<th>\n" +
    "<translate>Max Limit/Request</translate>\n" +
    "<span class=\"nowrap\">\n" +
    "<translate>Ratio</translate>\n" +
    "<i class=\"small pficon pficon-help\" data-toggle=\"tooltip\" title=\"{{'If specified, the compute resource must have a request and limit that are both non-zero, where limit divided by request is less than or equal to the specified amount; this represents the max burst for the compute resource during execution.'|translate}}\"></i>\n" +
    "</span>\n" +
    "</th>\n" +
    "</thead>\n" +
    "<tbody>\n" +
    "<tr ng-repeat-start=\"limit in limitRange.spec.limits\"></tr>\n" +
    "<tr ng-repeat=\"(type, typeLimits) in limitsByType[limitRange.metadata.name][limit.type]\">\n" +
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
    "<a ng-href=\"project/{{project.metadata.name}}/create-secret\" class=\"btn btn-default\" translate>Create Secret</a>\n" +
    "</div>\n" +
    "<h1>\n" +
    "Secrets\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "</h1>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"middle-content\">\n" +
    "<div class=\"container-fluid\">\n" +
    "<alerts alerts=\"alerts\"></alerts>\n" +
    "<div ng-if=\"!loaded\" class=\"mar-top-xl\" translate>Loading...</div>\n" +
    "<div ng-if=\"loaded\" class=\"row\">\n" +
    "<div class=\"col-md-12\">\n" +
    "<table class=\"table table-bordered table-hover table-mobile secrets-table table-layout-fixed\">\n" +
    "<colgroup>\n" +
    "<col class=\"col-sm-5\">\n" +
    "<col class=\"col-sm-5\">\n" +
    "</colgroup>\n" +
    "<thead>\n" +
    "<tr>\n" +
    "<th translate>Name</th>\n" +
    "<th translate>Type</th>\n" +
    "<th translate>Created</th>\n" +
    "</tr>\n" +
    "</thead>\n" +
    "\n" +
    "<tbody ng-if=\"!secrets.length\">\n" +
    "\n" +
    "<tr><td colspan=\"3\"><em translate>No secrets</em></td></tr>\n" +
    "</tbody>\n" +
    "<tbody ng-if=\"secrets.length\">\n" +
    "<tr ng-repeat=\"secret in secrets track by (secret | uid)\">\n" +
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
    "<translate>Services</translate>\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
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
    "<th translate>Name</th>\n" +
    "<th translate>Cluster IP</th>\n" +
    "<th translate>External IP</th>\n" +
    "<th translate>Ports</th>\n" +
    "<th translate>Selector</th>\n" +
    "<th translate>Age</th>\n" +
    "</tr>\n" +
    "</thead>\n" +
    "<tbody ng-if=\"(services | hashSize) == 0\">\n" +
    "<tr><td colspan=\"6\"><em>{{emptyMessage|translate}}</em></td></tr>\n" +
    "</tbody>\n" +
    "<tbody ng-if=\"(services | hashSize) > 0\">\n" +
    "<tr ng-repeat=\"service in services | orderObjectsByDate : true\">\n" +
    "<td data-title=\"Name\"><a href=\"{{service | navigateResourceURL}}\">{{service.metadata.name}}</a></td>\n" +
    "<td data-title=\"Cluster IP\">{{service.spec.clusterIP}}</td>\n" +
    "<td data-title=\"External IP\">\n" +
    "<span ng-if=\"!service.status.loadBalancer.ingress.length\"><em translate>none</em></span>\n" +
    "<span ng-repeat=\"ingress in service.status.loadBalancer.ingress | limitTo: 4\">{{ingress.ip}}<span ng-if=\"!$last\">,\n" +
    "</span></span><span ng-if=\"service.status.loadBalancer.ingress.length === 5\">, {{service.status.loadBalancer.ingress[4].ip}}</span><span ng-if=\"service.status.loadBalancer.ingress.length > 5\">,\n" +
    "<translate>and</translate> {{service.status.loadBalancer.ingress.length - 4}} <translate>others</translate></span>\n" +
    "</td>\n" +
    "<td data-title=\"Ports\">\n" +
    "<span ng-if=\"!service.spec.ports.length\"><em translate>none</em></span>\n" +
    "<span ng-repeat=\"portMapping in service.spec.ports | limitTo: 4\">{{portMapping.port}}/{{portMapping.protocol}}<span ng-if=\"!$last\">,\n" +
    "</span></span><span ng-if=\"service.spec.ports.length === 5\">, {{service.spec.ports[4].port}}/{{service.spec.ports[4].protocol}}</span><span ng-if=\"service.spec.ports.length > 5\">,\n" +
    "<translate>and</translate> {{service.spec.ports.length - 4}} <translate>others</translate></span>\n" +
    "</td>\n" +
    "<td data-title=\"Selector\">\n" +
    "<span ng-if=\"!service.spec.selector\"><em translate>none</em></span>\n" +
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
    "<div ng-show=\"!containers.length\">Loading...</div>\n" +
    "<form ng-if=\"containers.length\" name=\"form\" class=\"set-limits-form\">\n" +
    "<h1 translate>Resource Limits: {{name}}</h1>\n" +
    "<div class=\"help-block\">\n" +
    "<translate>Resource limits control how much <span ng-if=\"!hideCPU\">CPU and</span> memory a container will consume on a node.</translate>\n" +
    "<div class=\"learn-more-block\" ng-class=\"{ 'gutter-bottom': showPodWarning }\">\n" +
    "<a href=\"{{'compute_resources' | helpLink}}\" target=\"_blank\"><translate>Learn More</translate> <i class=\"fa fa-external-link\" aria-hidden=\"true\"></i></a>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"showPodWarning\" class=\"alert alert-warning\">\n" +
    "<span class=\"pficon pficon-warning-triangle-o\" aria-hidden=\"true\"></span>\n" +
    "<translate>Changes will only apply to new pods.</translate>\n" +
    "</div>\n" +
    "<fieldset ng-disabled=\"disableInputs\">\n" +
    "<div ng-repeat=\"container in containers\" ng-init=\"formName = container.name + '-form'\">\n" +
    "<h2 ng-if=\"containers.length > 1\" translate>Container {{container.name}}</h2>\n" +
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
    "<button type=\"submit\" class=\"btn btn-primary btn-lg\" ng-click=\"save()\" ng-disabled=\"form.$pristine || form.$invalid || disableInputs || cpuProblems.length || memoryProblems.length\" value=\"\" translate>Save</button>\n" +
    "<button class=\"btn btn-default btn-lg\" ng-click=\"cancel()\" translate>Cancel</button>\n" +
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
    "<translate>Storage</translate>\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
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
    "<div class=\"middle-content\">\n" +
    "<div class=\"container-fluid\">\n" +
    "<alerts alerts=\"alerts\"></alerts>\n" +
    "<div class=\"row\">\n" +
    "<div class=\"col-md-12\">\n" +
    "<div class=\"section-header page-header-bleed-right page-header-bleed-left\">\n" +
    "<div class=\"hidden-xs pull-right\" ng-if=\"project && ('persistentvolumeclaims' | canI : 'create')\">\n" +
    "<a ng-if=\"!outOfClaims\" ng-href=\"project/{{project.metadata.name}}/create-pvc\" class=\"btn btn-default\" translate>Create Storage</a>\n" +
    "<a ng-if=\"outOfClaims\" href=\"\" class=\"btn btn-default disabled\" aria-disabled=\"true\" translate>Create Storage</a>\n" +
    "</div>\n" +
    "<h2 translate>Persistent Volume Claims</h2>\n" +
    "<div class=\"visible-xs-block mar-bottom-sm\" ng-if=\"project && ('persistentvolumeclaims' | canI : 'create')\">\n" +
    "<a ng-if=\"!outOfClaims\" ng-href=\"project/{{project.metadata.name}}/create-pvc\" class=\"btn btn-default\" translate>Create Storage</a>\n" +
    "<a ng-if=\"outOfClaims\" href=\"\" class=\"btn btn-default disabled\" aria-disabled=\"true\" translate>Create Storage</a>\n" +
    "</div>\n" +
    "</div>\n" +
    "<table class=\"table table-bordered table-hover table-mobile table-layout-fixed\" ng-class=\"{ 'table-empty': (pvcs | hashSize) === 0 }\">\n" +
    "<colgroup>\n" +
    "<col class=\"col-sm-5\">\n" +
    "</colgroup>\n" +
    "<thead>\n" +
    "<tr>\n" +
    "<th translate>Name</th>\n" +
    "<th translate>Status</th>\n" +
    "<th translate>Capacity</th>\n" +
    "<th translate>Access Modes</th>\n" +
    "<th translate>Age</th>\n" +
    "</tr>\n" +
    "</thead>\n" +
    "<tbody ng-if=\"(pvcs | hashSize) === 0\">\n" +
    "<tr><td colspan=\"5\"><em>{{emptyMessage|translate}}</em></td></tr>\n" +
    "</tbody>\n" +
    "<tbody ng-if=\"(pvcs | hashSize) > 0\">\n" +
    "<tr ng-repeat=\"pvc in pvcs | orderObjectsByDate : true\">\n" +
    "<td data-title=\"Name\"><a ng-href=\"{{pvc | navigateResourceURL}}\">{{pvc.metadata.name}}</a>\n" +
    "<span ng-if=\"pvc | storageClass\" class=\"text-muted\" translate> using storage class {{pvc | storageClass}}</span>\n" +
    "</td>\n" +
    "<td data-title=\"Status\">\n" +
    "<status-icon status=\"pvc.status.phase\" disable-animation></status-icon>\n" +
    "<translate>{{pvc.status.phase}} <span ng-if=\"pvc.spec.volumeName\">to volume <strong>{{pvc.spec.volumeName}}</strong></span></translate>\n" +
    "</td>\n" +
    "<td data-title=\"Capacity\">\n" +
    "<span ng-if=\"pvc.spec.volumeName\">\n" +
    "<span ng-if=\"pvc.status.capacity['storage']\">{{pvc.status.capacity['storage'] | usageWithUnits: 'storage'}}</span>\n" +
    "<span ng-if=\"!pvc.status.capacity['storage']\" translate>unknown</span>\n" +
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
    "<h1 translate>Error</h1>\n" +
    "<h4>{{errorMessage}}</h4>\n" +
    "<div>{{errorDetails}}</div>\n" +
    "<div ng-if=\"errorLinks.length\">\n" +
    "<a ng-repeat-start=\"link in errorLinks\" ng-href=\"{{link.href}}\" target=\"{{link.target || '_blank'}}\">{{link.label}}</a>\n" +
    "<span ng-repeat-end ng-if=\"!$last\" class=\"action-divider mar-right-xs\">|</span>\n" +
    "</div>\n" +
    "<br>\n" +
    "<div translate>Return to the <a href=\"\" ng-click=\"reloadConsole()\">console</a>.</div>\n" +
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
    "<h1 translate>Log out</h1>\n" +
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
    "<h1 style=\"margin-top: 10px\" translate>Logging in&hellip;</h1>\n" +
    "<p translate>Please wait while you are logged in&hellip;</p>\n" +
    "</div>\n" +
    "<div ng-if=\"confirmUser && !overriddenUser\">\n" +
    "<h1 style=\"margin-top: 10px\" translate>Confirm Login</h1>\n" +
    "<p translate>You are being logged in as <code>{{confirmUser.metadata.name}}</code>.</p>\n" +
    "<button class=\"btn btn-lg btn-primary\" type=\"button\" ng-click=\"completeLogin();\" translate>Continue</button>\n" +
    "<button class=\"btn btn-lg btn-default\" type=\"button\" ng-click=\"cancelLogin();\" translate>Cancel</button>\n" +
    "</div>\n" +
    "<div ng-if=\"confirmUser && overriddenUser\">\n" +
    "<h1 style=\"margin-top: 10px\" translate>Confirm User Change</h1>\n" +
    "<p translate>You are about to change users from <code>{{overriddenUser.metadata.name}}</code> to <code>{{confirmUser.metadata.name}}</code>.</p>\n" +
    "<p translate>If this is unexpected, click Cancel. This could be an attempt to trick you into acting as another user.</p>\n" +
    "<button class=\"btn btn-lg btn-danger\" type=\"button\" ng-click=\"completeLogin();\" translate>Switch Users</button>\n" +
    "<button class=\"btn btn-lg btn-primary\" type=\"button\" ng-click=\"cancelLogin();\" translate>Cancel</button>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>"
  );

}]);
