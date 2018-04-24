angular.module('openshiftConsoleTemplates', []).run(['$templateCache', function($templateCache) {
  'use strict';

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
    "<code>oc adm new-project &lt;projectname&gt; --admin={{user.metadata.name || '&lt;YourUsername&gt;'}}</code></span>\n" +
    "<span ng-if=\"newProjectMessage\" ng-bind-html=\"newProjectMessage | linkify : '_blank'\" class=\"projects-instructions-link\"></span>"
  );


  $templateCache.put('views/_compute-resource.html',
    "<ng-form name=\"form\">\n" +
    "<fieldset class=\"form-inline compute-resource\">\n" +
    "<label ng-if=\"label\">{{label}}</label>\n" +
    "<div class=\"resource-size\" ng-class=\"{ 'has-error': form.$invalid }\">\n" +
    "<div class=\"resource-amount\">\n" +
    "<label class=\"sr-only\" ng-attr-for=\"{{id}}\">Amount</label>\n" +
    "<input type=\"number\" name=\"amount\" ng-attr-id=\"{{id}}\" ng-model=\"input.amount\" min=\"0\" pattern=\"\\d+(\\.\\d+)?\" ng-attr-placeholder=\"{{placeholder}}\" select-on-focus class=\"form-control\" ng-attr-aria-describedby=\"{{description ? id + '-help' : undefined}}\">\n" +
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
    "<div ng-repeat=\"(serverName, data) in secretData.auths\" class=\"image-source-item\">\n" +
    "<h3>{{serverName}}</h3>\n" +
    "<dt ng-if-start=\"data.username\">username</dt>\n" +
    "<dd ng-if-end class=\"word-break\">{{data.username}}</dd>\n" +
    "<dt ng-if-start=\"data.password\">password</dt>\n" +
    "<dd ng-if-end>\n" +
    "<span ng-if=\"view.showSecret\">\n" +
    "<copy-to-clipboard clipboard-text=\"data.password\" display-wide=\"true\"></copy-to-clipboard>\n" +
    "</span>\n" +
    "<span ng-if=\"!view.showSecret\">*****</span>\n" +
    "</dd>\n" +
    "<dt ng-if-start=\"data.email\">email</dt>\n" +
    "<dd ng-if-end class=\"word-break\">{{data.email}}</dd>\n" +
    "<div ng-if=\"!data.username && !data.password && !data.email\">\n" +
    "No username and password.\n" +
    "</div>\n" +
    "</div>\n" +
    "<h3 ng-if-start=\"secretData.credsStore\">Credentials Store</h3>\n" +
    "<div ng-if-end>\n" +
    "<span ng-if=\"view.showSecret\">\n" +
    "<copy-to-clipboard clipboard-text=\"secretData.credsStore\" display-wide=\"true\"></copy-to-clipboard>\n" +
    "</span>\n" +
    "<span ng-if=\"!view.showSecret\">*****</span>\n" +
    "</div>"
  );


  $templateCache.put('views/_container-statuses.html',
    " <div ng-if=\"detailed && pod.status.initContainerStatuses.length\">\n" +
    "<h4 class=\"init-container-status mar-bottom-xl\" ng-if=\"initContainersTerminated\">\n" +
    "<span><i class=\"fa fa-check text-success\"></i></span>\n" +
    "<span class=\"init-container-status-detail\">\n" +
    "<ng-pluralize count=\"pod.status.initContainerStatuses.length\" when=\"{'1': '&nbsp;Init container {{pod.status.initContainerStatuses[0].name}}','other': '&nbsp;{} init containers'}\">\n" +
    "</ng-pluralize>\n" +
    "completed successfully\n" +
    "</span>\n" +
    "<span ng-if=\"initContainersTerminated\">\n" +
    "<a class=\"page-header-link\" href=\"\" ng-click=\"toggleInitContainer()\">\n" +
    "<span ng-if=\"!expandInitContainers\">Show</span>\n" +
    "<span ng-if=\"expandInitContainers\">Hide</span>\n" +
    "Details\n" +
    "</a>\n" +
    "</span>\n" +
    "</h4>\n" +
    "<div class=\"animate-if\" ng-if=\"expandInitContainers\" ng-repeat=\"containerStatus in pod.status.initContainerStatuses track by containerStatus.name\">\n" +
    "<h4>Init container {{containerStatus.name}}</h4>\n" +
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
    "</dl>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-repeat=\"containerStatus in pod.status.containerStatuses track by containerStatus.name\">\n" +
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
    "<div ng-if=\"hasDebugTerminal && showDebugAction(containerStatus) && (podsVersion | canI : 'create')\" class=\"debug-pod-action\">\n" +
    "<a href=\"\" ng-click=\"debugTerminal(containerStatus.name)\" role=\"button\">Debug in Terminal</a>\n" +
    "</div>\n" +
    "</dl>\n" +
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


  $templateCache.put('views/_image-names.html',
    "<div class=\"text-prepended-icon\">\n" +
    "<span class=\"pficon pficon-image\" aria-hidden=\"true\"></span>\n" +
    "<span class=\"word-break-all\">{{podTemplate.spec.containers[0].image | imageStreamName}}\n" +
    "<span ng-repeat=\"id in imageIDs\" title=\"{{id}}\">\n" +
    "<span class=\"hash nowrap\">{{id | stripSHAPrefix | limitTo: 7}}</span><span ng-if=\"!$last\">,</span>\n" +
    "</span>\n" +
    "<span class=\"nowrap\" ng-if=\"podTemplate.spec.containers.length > 1\"> and {{podTemplate.spec.containers.length - 1}} other image<span ng-if=\"podTemplate.spec.containers.length > 2\">s</span></span>\n" +
    "</span>\n" +
    "</div>"
  );


  $templateCache.put('views/_init-containers-summary.html',
    "<span ng-if=\"$ctrl.podTemplate.spec.initContainers.length\" class=\"text-muted small\">\n" +
    "<ng-pluralize class=\"mar-right-sm\" count=\"$ctrl.podTemplate.spec.initContainers.length\" when=\"{'1': '&nbsp;{} init container','other': '&nbsp;{} init containers'}\">\n" +
    "</ng-pluralize>\n" +
    "<a ng-href=\"{{$ctrl.apiObject | navigateToTabURL:$ctrl.tab}}\">View Details</a>\n" +
    "</span>"
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


  $templateCache.put('views/_pod-template-container.html',
    " <div class=\"pod-template\">\n" +
    "<div class=\"pod-container-name\">{{container.name}}</div>\n" +
    "<div ng-if=\"container.image\" class=\"pod-template-image icon-row\">\n" +
    "<div class=\"icon-wrap\">\n" +
    "<span class=\"pficon pficon-image\" aria-hidden=\"true\"></span>\n" +
    "</div>\n" +
    "<div class=\"pod-template-detail word-break\">\n" +
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
    "<div class=\"icon-row\" ng-if=\"build = (image | buildForImage : builds)\">\n" +
    "<div class=\"icon-wrap\">\n" +
    "<span class=\"fa fa-refresh\" aria-hidden=\"true\"></span>\n" +
    "</div>\n" +
    "<div class=\"pod-template-detail word-break\">\n" +
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
    "<div class=\"icon-row\" ng-if=\"build.spec.source\">\n" +
    "<div class=\"icon-wrap\">\n" +
    "<span class=\"fa fa-code\" aria-hidden=\"true\"></span>\n" +
    "</div>\n" +
    "<div class=\"pod-template-detail word-break\">\n" +
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
    "<div ng-if=\"detailed && (container.command.length || container.args.length)\" class=\"icon-row\">\n" +
    "<div class=\"icon-wrap\">\n" +
    "<span aria-hidden=\"true\" class=\"fa fa-terminal\"></span>\n" +
    "</div>\n" +
    "<div class=\"pod-template-detail word-break\">\n" +
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
    "<div ng-if=\"container.ports.length > 0\" class=\"pod-template-ports icon-row\">\n" +
    "<div class=\"icon-wrap\">\n" +
    "<span aria-hidden=\"true\" class=\"pficon pficon-port\"></span>\n" +
    "</div>\n" +
    "<div class=\"pod-template-detail word-break\">\n" +
    "<span class=\"pod-template-key\">Ports:</span>\n" +
    "<span ng-repeat=\"port in container.ports | orderBy: 'containerPort' | limitToOrAll : detailed ? undefined : 1\">\n" +
    "<span class=\"nowrap\">{{port.containerPort}}/{{port.protocol}}</span><span ng-if=\"port.name\"><span class=\"nowrap\"> ({{port.name}})</span></span><span ng-if=\"port.hostPort\"><span class=\"nowrap\"><span class=\"port-icon\"> &#8594;</span> {{port.hostPort}}</span></span><span ng-if=\"!$last\">, </span>\n" +
    "</span>\n" +
    "<span ng-if=\"!detailed && container.ports.length >= 2\">\n" +
    "and {{container.ports.length - 1}}\n" +
    "<span ng-if=\"container.ports.length > 2\">others</span>\n" +
    "<span ng-if=\"container.ports.length === 2\">other</span>\n" +
    "</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"detailed\" ng-repeat=\"mount in container.volumeMounts\" class=\"icon-row\">\n" +
    "<div class=\"icon-wrap\">\n" +
    "<span aria-hidden=\"true\" class=\"fa fa-database\"></span>\n" +
    "</div>\n" +
    "<div class=\"pod-template-detail word-break\">\n" +
    "<span class=\"pod-template-key\">Mount:</span>\n" +
    "<span>\n" +
    "{{mount.name}}<span ng-if=\"mount.subPath\">, subpath {{mount.subPath}}</span>&#8201;&#8594;&#8201;<span>{{mount.mountPath}}</span>\n" +
    "<small class=\"text-muted\">{{mount | volumeMountMode : podTemplate.spec.volumes}}</small>\n" +
    "</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"detailed && (container.resources.requests.cpu || container.resources.limits.cpu)\" class=\"icon-row\">\n" +
    "<div class=\"icon-wrap\">\n" +
    "<i class=\"fa fa-area-chart\" aria-hidden=\"true\"></i>\n" +
    "</div>\n" +
    "<div class=\"pod-template-detail\">\n" +
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
    "<div ng-if=\"detailed && (container.resources.requests.memory || container.resources.limits.memory)\" class=\"icon-row\">\n" +
    "<div class=\"icon-wrap\">\n" +
    "<i class=\"fa fa-area-chart\" aria-hidden=\"true\"></i>\n" +
    "</div>\n" +
    "<div class=\"pod-template-detail\">\n" +
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
    "<div ng-if=\"detailed && container.readinessProbe\" class=\"icon-row\">\n" +
    "<div class=\"icon-wrap\">\n" +
    "<i class=\"fa fa-medkit\" aria-hidden=\"true\"></i>\n" +
    "</div>\n" +
    "<div class=\"pod-template-detail\">\n" +
    "<span class=\"pod-template-key\">Readiness Probe:</span>\n" +
    "<probe probe=\"container.readinessProbe\"></probe>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"detailed && container.livenessProbe\" class=\"icon-row\">\n" +
    "<div class=\"icon-wrap\">\n" +
    "<i class=\"fa fa-medkit\" aria-hidden=\"true\"></i>\n" +
    "</div>\n" +
    "<div class=\"pod-template-detail\">\n" +
    "<span class=\"pod-template-key\">Liveness Probe:</span>\n" +
    "<probe probe=\"container.livenessProbe\"></probe>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/_pod-template.html',
    " <div ng-if=\"detailed && addHealthCheckUrl && !(podTemplate | hasHealthChecks)\" class=\"alert alert-info\">\n" +
    "<span class=\"pficon pficon-info\" aria-hidden=\"true\"></span>\n" +
    "<span ng-if=\"podTemplate.spec.containers.length === 1\">Container {{podTemplate.spec.containers[0].name}} does not have health checks</span>\n" +
    "<span ng-if=\"podTemplate.spec.containers.length > 1\">Not all containers have health checks</span>\n" +
    "to ensure your application is running correctly.\n" +
    "<a ng-href=\"{{addHealthCheckUrl}}\" class=\"nowrap\">Add Health Checks</a>\n" +
    "</div>\n" +
    "<div ng-if=\"detailed && podTemplate.spec.initContainers.length\">\n" +
    "<h4>Init Containers</h4>\n" +
    "<div class=\"pod-template-container\">\n" +
    "<div class=\"pod-template-block\" ng-repeat=\"container in podTemplate.spec.initContainers\">\n" +
    "<pod-template-container pod-template-container=\"container\" images-by-docker-reference=\"imagesByDockerReference\" builds=\"builds\" detailed=\"detailed\"></pod-template-container>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div>\n" +
    "<h4 ng-if=\"detailed\">Containers</h4>\n" +
    "<div class=\"pod-template-container\">\n" +
    "<div class=\"pod-template-block\" ng-repeat=\"container in podTemplate.spec.containers\">\n" +
    "<pod-template-container pod-template-container=\"container\" images-by-docker-reference=\"imagesByDockerReference\" builds=\"builds\" detailed=\"detailed\"></pod-template-container>\n" +
    "<div extension-point extension-name=\"container-links\" extension-types=\"link dom\" extension-args=\"[container, podTemplate]\"></div>\n" +
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


  $templateCache.put('views/_sidebar.html',
    "<div class=\"nav-pf-vertical nav-pf-vertical-with-sub-menus\" ng-class=\"{\n" +
    "    collapsed: nav.collapsed && !isMobile,\n" +
    "    'hide-mobile-nav': !nav.showMobileNav && isMobile,\n" +
    "    'hover-secondary-nav-pf': sidebar.secondaryOpen && !isMobile,\n" +
    "    'show-mobile-nav': nav.showMobileNav && isMobile,\n" +
    "    'show-mobile-secondary': nav.showMobileNav && sidebar.showMobileSecondary && isMobile\n" +
    "  }\" on-esc=\"closeNav()\">\n" +
    "<nav ng-if=\"view.hasProject\" class=\"nav-vertical-primary\">\n" +
    "<ul class=\"list-group\">\n" +
    "\n" +
    "<li ng-repeat=\"primaryItem in navItems\" ng-class=\"{\n" +
    "          active: primaryItem === activePrimary,\n" +
    "          'is-hover': primaryItem.isHover,\n" +
    "          'secondary-nav-item-pf': primaryItem.secondaryNavSections.length\n" +
    "        }\" ng-if=\"show(primaryItem)\" ng-mouseenter=\"onMouseEnter(primaryItem)\" ng-mouseleave=\"onMouseLeave(primaryItem)\" class=\"list-group-item\">\n" +
    "<a ng-if=\"primaryItem.href\" ng-href=\"{{navURL(primaryItem.href)}}\" ng-click=\"itemClicked(primaryItem)\">\n" +
    "<span title=\"{{primaryItem.label}}\" class=\"{{primaryItem.iconClass}}\" aria-hidden=\"true\"></span> <span class=\"list-group-item-value\">{{primaryItem.label}}</span> <span ng-if=\"nav.collapsed && !isMobile\" class=\"sr-only\">{{primaryItem.label}}</span>\n" +
    "</a>\n" +
    "<a ng-if=\"!primaryItem.href\" href=\"\" ng-click=\"itemClicked(primaryItem)\">\n" +
    "<span title=\"{{primaryItem.label}}\" class=\"{{primaryItem.iconClass}}\" aria-hidden=\"true\"></span> <span class=\"list-group-item-value\">{{primaryItem.label}}</span> <span ng-if=\"nav.collapsed && !isMobile\" class=\"sr-only\">{{primaryItem.label}}</span>\n" +
    "</a>\n" +
    "\n" +
    "<div ng-if=\"primaryItem.secondaryNavSections.length\" class=\"secondary-nav-item-pf\" ng-class=\"{\n" +
    "            'mobile-nav-item-pf': primaryItem.mobileSecondary && isMobile\n" +
    "          }\">\n" +
    "<div class=\"nav-pf-secondary-nav\">\n" +
    "<div class=\"nav-item-pf-header\">\n" +
    "<a href=\"\" class=\"secondary-collapse-toggle-pf\" ng-click=\"collapseMobileSecondary(primaryItem, $event)\" role=\"button\"><span class=\"sr-only\">Back</span></a>\n" +
    "<span>{{primaryItem.label}}</span>\n" +
    "</div>\n" +
    "<ul class=\"list-group\">\n" +
    "<li ng-repeat-start=\"secondarySection in primaryItem.secondaryNavSections\" ng-if=\"secondarySection.header\" class=\"nav-item-pf-header\">\n" +
    "{{secondarySection.header}}\n" +
    "</li>\n" +
    "<li ng-repeat=\"secondaryItem in secondarySection.items\" ng-class=\"{ active: secondaryItem === activeSecondary }\" ng-if=\"show(secondaryItem)\" class=\"list-group-item\">\n" +
    "<a ng-href=\"{{navURL(secondaryItem.href)}}\" ng-click=\"primaryItem.mobileSecondary = false;\">\n" +
    "<span class=\"list-group-item-value\">{{secondaryItem.label}}</span>\n" +
    "</a>\n" +
    "</li>\n" +
    "<li ng-repeat-end style=\"display:none\"></li>\n" +
    "</ul>\n" +
    "</div>\n" +
    "</div>\n" +
    "</li>\n" +
    "</ul>\n" +
    "</nav>\n" +
    "\n" +
    "<navbar-utility-mobile></navbar-utility-mobile>\n" +
    "</div>"
  );


  $templateCache.put('views/_templateopt.html',
    "<div class=\"template-options\" ng-form=\"paramForm\">\n" +
    "<div ng-if=\"!isDialog && parameters.length\" class=\"flow\">\n" +
    "<div class=\"flow-block\">\n" +
    "<h2>Parameters</h2>\n" +
    "</div>\n" +
    "<div ng-show=\"canToggle\" class=\"flow-block right\">\n" +
    "<a class=\"action action-inline\" href=\"\" ng-click=\"expand = false\" ng-show=\"expand\"><i class=\"pficon pficon-remove\"></i> Collapse</a>\n" +
    "<a class=\"action action-inline\" href=\"\" ng-click=\"expand = true\" ng-hide=\"expand\"><i class=\"pficon pficon-edit\"></i> Edit Parameters</a>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-transclude></div>\n" +
    "<div class=\"form-group options\" ng-repeat=\"parameter in parameters\" ng-show=\"expand\" ng-init=\"paramID = 'param-' + $index\">\n" +
    "<label ng-attr-for=\"{{paramID}}\" ng-attr-title=\"{{parameter.name}}\" ng-class=\"{required: parameter.required}\">{{parameter.displayName || parameter.name}}</label>\n" +
    "<div class=\"parameter-input-wrapper\" ng-class=\"{\n" +
    "          'has-error': (paramForm[paramID].$error.required && paramForm[paramID].$touched && !cleared),\n" +
    "          'has-warning': isOnlyWhitespace(parameter.value)\n" +
    "        }\">\n" +
    "<input ng-if=\"!expandedParameter\" ng-attr-id=\"{{paramID}}\" ng-attr-name=\"{{paramID}}\" class=\"form-control hide-ng-leave\" type=\"text\" placeholder=\"{{ parameter | parameterPlaceholder }}\" ng-model=\"parameter.value\" ng-required=\"parameter.required && !parameter.generate\" ng-blur=\"cleared = false\" ng-trim=\"false\" autocorrect=\"off\" autocapitalize=\"none\" spellcheck=\"false\" ng-attr-aria-describedby=\"{{parameter.description ? (paramID + '-description') : undefined}}\">\n" +
    "<a href=\"\" ng-click=\"expandedParameter = !expandedParameter\" class=\"resize-input action-button\" data-toggle=\"tooltip\" data-trigger=\"hover\" dynamic-content=\"{{expandedParameter ? 'Collapse to a single line input. This may strip any new lines you have entered.' : 'Expand to enter multiple lines of content. This is required if you need to include newline characters.'}}\"><i class=\"fa\" ng-class=\"{'fa-expand': !expandedParemeter, 'fa-compress': expandedParameter}\" aria-hidden=\"true\" role=\"presentation\"/><span class=\"sr-only\" ng-if=\"expandedParameter\">Collapse to a single line input</span><span class=\"sr-only\" ng-if=\"!expandedParameter\">Expand to enter multiline input</span></a>\n" +
    "<textarea ng-if=\"expandedParameter\" ng-attr-id=\"{{paramID}}\" ng-attr-name=\"{{paramID}}\" class=\"form-control hide-ng-leave\" placeholder=\"{{ parameter | parameterPlaceholder }}\" ng-model=\"parameter.value\" ng-required=\"parameter.required && !parameter.generate\" ng-blur=\"cleared = false\" ng-trim=\"false\" autocorrect=\"off\" autocapitalize=\"none\" spellcheck=\"false\" rows=\"6\" ng-attr-aria-describedby=\"{{parameter.description ? (paramID + '-description') : undefined}}\"></textarea>\n" +
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
    "<div class=\"pod-container-name\">Storage claim: {{template.metadata.name}}</div>\n" +
    "<div class=\"pod-template-image icon-row\">\n" +
    "<div class=\"icon-wrap\">\n" +
    "<span class=\"fa fa-lock\" aria-hidden=\"true\"></span>\n" +
    "</div>\n" +
    "<div class=\"pod-template-detail word-break\">\n" +
    "<span class=\"pod-template-key\">Access Modes:</span>\n" +
    "<span ng-repeat=\"mode in template.spec.accessModes\">\n" +
    "{{mode | sentenceCase }}<span ng-if=\"!$last\">, </span>\n" +
    "</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"pod-template-image icon-row\">\n" +
    "<div class=\"icon-wrap\">\n" +
    "<span class=\"fa fa-database\" aria-hidden=\"true\"></span>\n" +
    "</div>\n" +
    "<div class=\"pod-template-detail word-break\">\n" +
    "<span class=\"pod-template-key\">Capacity:</span>\n" +
    "<span>\n" +
    "{{template.spec.resources.requests.storage}}\n" +
    "</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"pod-template-image icon-row\" ng-if=\"template.spec.selector.matchLabels\">\n" +
    "<div class=\"icon-wrap\">\n" +
    "<span class=\"fa fa-tag\" aria-hidden=\"true\"></span>\n" +
    "</div>\n" +
    "<div class=\"pod-template-detail word-break\">\n" +
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
    "<span ng-if=\"secretsVersion | canI : 'get'\">\n" +
    "<a ng-href=\"{{volume.secret.secretName | navigateResourceURL : 'Secret' : namespace}}\">{{volume.secret.secretName}}</a>\n" +
    "</span>\n" +
    "<span ng-if=\"!(secretsVersion | canI : 'get')\">\n" +
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
    "<div class=\"middle surface-shaded\">\n" +
    "<div class=\"middle-content\">\n" +
    "<div class=\"container gutter-top\">\n" +
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
    "<p>\n" +
    "<a target=\"_blank\" href=\"https://www.openshift.com\">OpenShift</a> is Red Hat's container application platform that allows developers to quickly develop, host, and scale applications in a cloud environment.\n" +
    "</p>\n" +
    "<h2 id=\"version\">Version</h2>\n" +
    "<dl class=\"dl-horizontal left\">\n" +
    "<dt>OpenShift Master:</dt>\n" +
    "<dd>\n" +
    "{{version.master.openshift}}\n" +
    "</dd>\n" +
    "<dt>Kubernetes Master:</dt>\n" +
    "<dd>\n" +
    "{{version.master.kubernetes}}\n" +
    "</dd>\n" +
    "<dt>OpenShift Web Console:</dt>\n" +
    "<dd>\n" +
    "{{version.console}}\n" +
    "</dd>\n" +
    "</dl>\n" +
    "<p>\n" +
    "The <a target=\"_blank\" ng-href=\"{{'welcome' | helpLink}}\">documentation</a> helps you learn about OpenShift and start exploring its features. From getting started with creating your first application to trying out more advanced build and deployment techniques, it provides guidance on setting up and managing your OpenShift environment as an application developer.\n" +
    "</p>\n" +
    "<p>\n" +
    "With the OpenShift command line interface (CLI), you can create applications and manage OpenShift projects from a terminal. To get started using the CLI, visit\n" +
    "<a href=\"command-line\">Command Line Tools</a>.\n" +
    "</p>\n" +
    "<h2>Account</h2>\n" +
    "<p>\n" +
    "You are currently logged in under the user account <strong>{{user.metadata.name}}</strong>.\n" +
    "</p>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div> \n" +
    "</div>"
  );


  $templateCache.put('views/add-config-volume.html',
    "<div class=\"add-to-project middle surface-shaded\">\n" +
    "<div class=\"container-fluid\">\n" +
    "<div class=\"row\">\n" +
    "<div class=\"col-md-10\">\n" +
    "<breadcrumbs breadcrumbs=\"breadcrumbs\"></breadcrumbs>\n" +
    "<div ng-if=\"!error && (!targetObject || !configMaps || !secrets)\">Loading...</div>\n" +
    "<div ng-if=\"error\" class=\"empty-state-message text-center\">\n" +
    "<h2>The {{kind | humanizeKind}} could not be loaded.</h2>\n" +
    "<p>{{error | getErrorDetails}}</p>\n" +
    "</div>\n" +
    "<div ng-if=\"targetObject && configMaps && secrets\">\n" +
    "<div ng-if=\"!configMaps.length && !secrets.length && !(configMapVersion | canI : 'create') && !(secretVersion | canI : 'create')\" class=\"empty-state-message empty-state-full-page text-center\">\n" +
    "<h2>No config maps or secrets.</h2>\n" +
    "<p>\n" +
    "There are no config maps or secrets in project {{project | displayName}} to use as a volume for this {{kind | humanizeKind}}.\n" +
    "</p>\n" +
    "<p ng-if=\"targetObject\"><a ng-href=\"{{targetObject | navigateResourceURL}}\">Back to {{kind | humanizeKind}} {{name}}</a></p>\n" +
    "</div>\n" +
    "<div ng-if=\"configMaps.length || secrets.length || (configMapVersion | canI : 'create') || (secretVersion | canI : 'create')\" class=\"mar-top-xl\">\n" +
    "<h1>Add Config Files to {{name}}</h1>\n" +
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
    "<div ng-if=\"(configMapVersion | canI : 'create') || (secretVersion | canI : 'create')\" class=\"mar-top-md\">\n" +
    "<span ng-if=\"configMapVersion | canI : 'create'\">\n" +
    "<a ng-href=\"project/{{project.metadata.name}}/create-config-map\">Create Config Map</a>\n" +
    "</span>\n" +
    "<span ng-if=\"secretVersion | canI : 'create'\">\n" +
    "<span ng-if=\"configMapVersion | canI : 'create'\" class=\"action-divider\" aria-hidden=\"true\">|</span>\n" +
    "<a ng-href=\"project/{{project.metadata.name}}/create-secret\">Create Secret</a>\n" +
    "</span>\n" +
    "</div>\n" +
    "<div class=\"help-block\">\n" +
    "Pick the config source. Its data will be mounted as a volume in the container.\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"form-group\">\n" +
    "<label for=\"mount-path\" class=\"required\">Mount Path</label>\n" +
    "<input id=\"mount-path\" class=\"form-control\" type=\"text\" name=\"mountPath\" ng-model=\"attach.mountPath\" required ng-pattern=\"/^\\/.*$/\" osc-unique=\"existingMountPaths\" placeholder=\"example: /data\" autocorrect=\"off\" autocapitalize=\"none\" spellcheck=\"false\" aria-describedby=\"mount-path-help\">\n" +
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
    "<input ng-attr-id=\"path-{{$id}}\" class=\"form-control\" ng-class=\"{ 'has-error': forms.addConfigVolumeForm['path-' + $id].$invalid && forms.addConfigVolumeForm['path-' + $id].$touched }\" type=\"text\" name=\"path-{{$id}}\" ng-model=\"item.path\" ng-pattern=\"RELATIVE_PATH_PATTERN\" required osc-unique=\"itemPaths\" placeholder=\"example: config/app.properties\" autocorrect=\"off\" autocapitalize=\"none\" spellcheck=\"false\">\n" +
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
    "<a ng-hide=\"attach.items.length === 1\" href=\"\" ng-click=\"removeItem($index)\">Remove Item</a>\n" +
    "<span ng-if=\"$last\">\n" +
    "<span ng-hide=\"attach.items.length === 1\" class=\"action-divider\" aria-hidden=\"true\">|</span>\n" +
    "<a href=\"\" ng-click=\"addItem()\">Add Item</a>\n" +
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
    "<a class=\"btn btn-default btn-lg\" role=\"button\" href=\"\" ng-click=\"cancel()\">Cancel</a>\n" +
    "</div>\n" +
    "</fieldset>\n" +
    "</form>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/attach-pvc.html',
    "<div class=\"add-to-project middle surface-shaded\">\n" +
    "<div class=\"middle-content\">\n" +
    "<div class=\"container-fluid\">\n" +
    "<div class=\"row\">\n" +
    "<div class=\"col-md-10\">\n" +
    "<breadcrumbs breadcrumbs=\"breadcrumbs\"></breadcrumbs>\n" +
    "<div ng-show=\"!pvcs || !attach.resource\">Loading...</div>\n" +
    "<div ng-show=\"pvcs && !pvcs.length && attach.resource\" class=\"empty-state-message empty-state-full-page text-center\">\n" +
    "<h2>No persistent volume claims.</h2>\n" +
    "<p>\n" +
    "A <b>persistent volume claim</b> is required to attach to this {{kind | humanizeKind}}, but none are loaded on this project.\n" +
    "</p>\n" +
    "<div ng-if=\"project && (pvcVersion | canI : 'create')\">\n" +
    "<a ng-href=\"project/{{project.metadata.name}}/create-pvc\" class=\"btn btn-primary\">Create Storage</a>\n" +
    "</div>\n" +
    "<p ng-if=\"project && !(pvcVersion | canI : 'create')\">\n" +
    "To claim storage from a persistent volume, refer to the documentation on <a target=\"_blank\" ng-href=\"{{'persistent_volumes' | helpLink}}\">using persistent volumes</a>.\n" +
    "</p>\n" +
    "<p ng-if=\"attach.resource\"><a ng-href=\"{{attach.resource | navigateResourceURL}}\">Back to {{kind | humanizeKind}} {{name}}</a></p>\n" +
    "</div>\n" +
    "<div ng-show=\"pvcs && pvcs.length && attach.resource\" class=\"mar-top-xl\">\n" +
    "<h1>Add Storage to {{name}}</h1>\n" +
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
    "<input type=\"radio\" name=\"persistentVolumeClaim\" ng-model=\"attach.persistentVolumeClaim\" ng-value=\"pvc\" ng-change=\"onPVCSelected()\" aria-describedby=\"pvc-help\">\n" +
    "</td>\n" +
    "<td><a ng-href=\"{{pvc | navigateResourceURL}}\" target=\"_blank\">{{pvc.metadata.name}}</a></td>\n" +
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
    "<div ng-if=\"!(project && (pvcVersion | canI : 'create'))\" class=\"help-block\">\n" +
    "Select storage to use.\n" +
    "</div>\n" +
    "<div ng-if=\"project && (pvcVersion | canI : 'create')\" class=\"help-block\">\n" +
    "Select storage to use<span ng-if=\"!outOfClaims\"> or <a ng-href=\"project/{{project.metadata.name}}/create-pvc\">create storage</a>.</span>\n" +
    "<span ng-if=\"outOfClaims\">. You cannot create new storage since you are at quota.</span>\n" +
    "</div>\n" +
    "<h3>Volume</h3>\n" +
    "<div class=\"help-block\">\n" +
    "Specify details about how volumes are going to be mounted inside containers.\n" +
    "</div>\n" +
    "<div class=\"form-group mar-top-xl\">\n" +
    "<label for=\"mount-path\">Mount Path</label>\n" +
    "<input id=\"mount-path\" class=\"form-control\" type=\"text\" name=\"mountPath\" ng-model=\"attach.mountPath\" ng-pattern=\"/^\\/.*$/\" osc-unique=\"existingMountPaths\" placeholder=\"example: /data\" autocorrect=\"off\" autocapitalize=\"none\" spellcheck=\"false\" aria-describedby=\"mount-path-help\">\n" +
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
    "<input id=\"sub-path\" class=\"form-control\" type=\"text\" name=\"subPath\" ng-model=\"attach.subPath\" placeholder=\"example: application/resources\" ng-pattern=\"RELATIVE_PATH_PATTERN\" autocorrect=\"off\" autocapitalize=\"none\" spellcheck=\"false\" aria-describedby=\"sub-path-help\">\n" +
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
    "<input id=\"volume-path\" class=\"form-control\" type=\"text\" name=\"volumeName\" ng-model=\"attach.volumeName\" ng-pattern=\"/^[a-z0-9]([-a-z0-9]*[a-z0-9])?$/\" ng-readonly=\"volumeAlreadyMounted\" osc-unique=\"existingVolumeNames\" osc-unique-disabled=\"volumeAlreadyMounted\" maxlength=\"63\" placeholder=\"(generated if empty)\" autocorrect=\"off\" autocapitalize=\"none\" spellcheck=\"false\" aria-describedby=\"volume-name-help\">\n" +
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
    "<a class=\"btn btn-default btn-lg\" role=\"button\" ng-click=\"cancel()\">Cancel</a>\n" +
    "</div>\n" +
    "</fieldset>\n" +
    "</form>\n" +
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
    "<dt ng-if-start=\"build.spec.revision.git.commit\">Source Commit:</dt>\n" +
    "<dd ng-if-end>\n" +
    "<span class=\"word-break\">\n" +
    "{{build.spec.revision.git.message}}\n" +
    "</span>\n" +
    "<osc-git-link class=\"hash\" uri=\"build.spec.source.git.uri\" ref=\"build.spec.revision.git.commit\">{{build.spec.revision.git.commit | limitTo:7}}</osc-git-link>\n" +
    "<span ng-if=\"build.spec.revision.git.author\">\n" +
    "authored by {{build.spec.revision.git.author.name}}\n" +
    "</span>\n" +
    "</dd>\n" +
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
    "{{pod | podStatus | humanizePodStatus}}<span ng-if=\"pod | podCompletionTime\">, ran for {{(pod | podStartTime) | duration : (pod | podCompletionTime)}}</span>\n" +
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
    "<dt ng-if-start=\"!dcName && controllerRef\">\n" +
    "{{controllerRef.kind | humanizeKind : true}}:\n" +
    "</dt>\n" +
    "<dd ng-if-end>\n" +
    "<a ng-href=\"{{controllerRef.name | navigateResourceURL : controllerRef.kind : pod.metadata.namespace}}\">{{controllerRef.name}}</a>\n" +
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
    "<div>\n" +
    "<container-statuses pod=\"pod\" on-debug-terminal=\"debugTerminal\" detailed=\"true\"></container-statuses>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"col-lg-6\">\n" +
    "<h3>Template</h3>\n" +
    "<pod-template pod-template=\"pod\" images-by-docker-reference=\"imagesByDockerReference\" builds=\"builds\" detailed=\"true\">\n" +
    "</pod-template>\n" +
    "<h4>Volumes</h4>\n" +
    "<volumes ng-if=\"pod.spec.volumes.length\" volumes=\"pod.spec.volumes\" namespace=\"project.metadata.name\"></volumes>\n" +
    "<div ng-if=\"!pod.spec.volumes.length\">none</div>\n" +
    "<p ng-if=\"dcName && (deploymentConfigsVersion | canI : 'update')\">\n" +
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
    "<ul class=\"dropdown-menu dropdown-menu-right actions action-button\">\n" +
    "<li ng-if=\"deployment && ({ group: 'apps', resource: 'deployments' } | canI : 'update')\">\n" +
    "<a ng-href=\"project/{{project.metadata.name}}/attach-pvc?kind=Deployment&name={{deployment.metadata.name}}&group=extensions\" role=\"button\">Add Storage</a>\n" +
    "</li>\n" +
    "<li ng-if=\"!deployment && ({ group: 'extensions', resource: 'replicasets' } | canI : 'update')\">\n" +
    "<a ng-href=\"project/{{project.metadata.name}}/attach-pvc?kind=ReplicaSet&name={{replicaSet.metadata.name}}&group=extensions\" role=\"button\">Add Storage</a>\n" +
    "</li>\n" +
    "<li ng-if=\"!autoscalers.length && ({ group: 'autoscaling', resource: 'horizontalpodautoscalers' } | canI : 'create')\">\n" +
    "<a ng-href=\"project/{{projectName}}/edit/autoscaler?kind=ReplicaSet&name={{replicaSet.metadata.name}}&group=extensions\" ng-if=\"!deployment\" role=\"button\">Add Autoscaler</a>\n" +
    "<a ng-href=\"project/{{projectName}}/edit/autoscaler?kind=Deployment&name={{deployment.metadata.name}}&group=extensions\" ng-if=\"deployment\" role=\"button\">Add Autoscaler</a>\n" +
    "</li>\n" +
    "<li ng-if=\"deployment && ({ group: 'apps', resource: 'deployments' } | canI : 'update')\">\n" +
    "<a ng-href=\"project/{{projectName}}/set-limits?kind=Deployment&name={{deployment.metadata.name}}&group=extensions\" role=\"button\">Edit Resource Limits</a>\n" +
    "</li>\n" +
    "<li ng-if=\"!deployment && ({ group: 'extensions', resource: 'replicasets' } | canI : 'update')\">\n" +
    "<a ng-href=\"project/{{projectName}}/set-limits?kind=ReplicaSet&name={{replicaSet.metadata.name}}&group=extensions\" role=\"button\">Edit Resource Limits</a>\n" +
    "</li>\n" +
    "<li ng-if=\"(!deployment && ({ group: 'extensions', resource: 'replicasets' } | canI : 'update')) || (deployment && ({group: 'apps', resource: 'deployments' } | canI : 'update'))\">\n" +
    "<a ng-href=\"{{healthCheckURL}}\" role=\"button\">Edit Health Checks</a>\n" +
    "</li>\n" +
    "<li ng-if=\"{ group: 'extensions', resource: 'replicasets' } | canI : 'update'\">\n" +
    "<a ng-href=\"{{replicaSet | editYamlURL}}\" role=\"button\">Edit YAML</a>\n" +
    "</li>\n" +
    "<li ng-if=\"{ group: 'extensions', resource: 'replicasets' } | canI : 'delete'\">\n" +
    "\n" +
    "<delete-link kind=\"ReplicaSet\" group=\"extensions\" resource-name=\"{{replicaSet.metadata.name}}\" project-name=\"{{replicaSet.metadata.namespace}}\" hpa-list=\"hpaForRS\" alerts=\"alerts\">\n" +
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
    "<dt ng-if-start=\"deployment\">Deployment:</dt>\n" +
    "<dd ng-if-end>\n" +
    "<a ng-href=\"{{deployment | navigateResourceURL}}\">{{deployment.metadata.name}}</a>\n" +
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
    "<div ng-if=\"{ group: 'apps', resource: 'deployments' } | canI : 'update'\">\n" +
    "<a ng-href=\"project/{{project.metadata.name}}/attach-pvc?kind=Deployment&name={{deployment.metadata.name}}&group=apps\">Add Storage</a>\n" +
    "<span class=\"action-divider\" aria-hidden=\"true\">|</span>\n" +
    "<a ng-href=\"project/{{project.metadata.name}}/add-config-volume?kind=Deployment&name={{deployment.metadata.name}}&group=apps\">Add Config Files</a>\n" +
    "</div>\n" +
    "<div ng-if=\"!replicaSet.spec.template.spec.volumes.length && !({ group: 'apps', resource: 'deployments' } | canI : 'update')\">none</div>\n" +
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
    "<a ng-href=\"project/{{project.metadata.name}}/attach-pvc?kind=DeploymentConfig&name={{deploymentConfigName}}\">Add Storage</a>\n" +
    "<span class=\"action-divider\" aria-hidden=\"true\">|</span>\n" +
    "<a ng-href=\"project/{{project.metadata.name}}/add-config-volume?kind=DeploymentConfig&name={{deploymentConfigName}}\">Add Config Files</a>\n" +
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
    "<span ng-if=\"{resource: 'horizontalpodautoscalers', group: 'autoscaling'} | canI : 'create'\">\n" +
    "<a ng-if=\"replicaSet.kind === 'ReplicaSet' && !deployment\" ng-href=\"project/{{projectName}}/edit/autoscaler?kind=ReplicaSet&name={{replicaSet.metadata.name}}&group=extensions\" role=\"button\">Add Autoscaler</a>\n" +
    "<a ng-if=\"replicaSet.kind === 'ReplicaSet' && deployment\" ng-href=\"project/{{projectName}}/edit/autoscaler?kind=Deployment&name={{deployment.metadata.name}}&group=apps\" role=\"button\">Add Autoscaler</a>\n" +
    "<a ng-if=\"replicaSet.kind === 'ReplicationController' && !deploymentConfigName\" ng-href=\"project/{{projectName}}/edit/autoscaler?kind=ReplicationController&name={{replicaSet.metadata.name}}\" role=\"button\">Add Autoscaler</a>\n" +
    "<a ng-if=\"replicaSet.kind === 'ReplicationController' && deploymentConfigName\" ng-href=\"project/{{projectName}}/edit/autoscaler?kind=DeploymentConfig&name={{deploymentConfigName}}\" role=\"button\">Add Autoscaler</a>\n" +
    "</span>\n" +
    "<span ng-if=\"!({resource: 'horizontalpodautoscalers', group: 'autoscaling'} | canI : 'create')\">\n" +
    "Autoscaling is not enabled. There are no autoscalers for this\n" +
    "<span ng-if=\"deploymentConfigName\">deployment config or deployment.</span>\n" +
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
    "<resource-service-bindings project=\"project\" project-context=\"projectContext\" api-object=\"replicaSet\">\n" +
    "</resource-service-bindings>\n" +
    "<annotations annotations=\"replicaSet.metadata.annotations\"></annotations>"
  );


  $templateCache.put('views/browse/_replication-controller-actions.html',
    "<div ng-if=\"(('replicationControllers' | canIDoAny) || (!deploymentConfigName && !autoscalers.length && ({ group: 'autoscaling', resource: 'horizontalpodautoscalers' } | canI : 'create')))\" class=\"pull-right dropdown\">\n" +
    "<button type=\"button\" class=\"dropdown-toggle btn btn-default actions-dropdown-btn hidden-xs\" data-toggle=\"dropdown\">\n" +
    "Actions\n" +
    "<span class=\"caret\"></span>\n" +
    "</button>\n" +
    "<a href=\"\" class=\"dropdown-toggle actions-dropdown-kebab visible-xs-inline\" data-toggle=\"dropdown\"><i class=\"fa fa-ellipsis-v\"></i><span class=\"sr-only\">Actions</span></a>\n" +
    "<ul class=\"dropdown-menu dropdown-menu-right actions action-button\">\n" +
    "<li ng-if=\"deploymentConfigName && ('deploymentconfigs' | canI : 'update')\">\n" +
    "<a ng-href=\"project/{{project.metadata.name}}/attach-pvc?kind=DeploymentConfig&name={{deploymentConfigName}}\" role=\"button\">Add Storage</a>\n" +
    "</li>\n" +
    "<li ng-if=\"!deploymentConfigName && ('replicationcontrollers' | canI : 'update')\">\n" +
    "<a ng-href=\"project/{{project.metadata.name}}/attach-pvc?kind=ReplicationController&name={{replicaSet.metadata.name}}\" role=\"button\">Add Storage</a>\n" +
    "</li>\n" +
    "<li ng-if=\"!autoscalers.length && ({resource: 'horizontalpodautoscalers', group: 'autoscaling'} | canI : 'create')\">\n" +
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
    "<delete-link kind=\"ReplicationController\" type-display-name=\"{{deploymentConfigName ? 'deployment' : 'replication controller'}}\" resource-name=\"{{replicaSet.metadata.name}}\" project-name=\"{{replicaSet.metadata.namespace}}\" alerts=\"alerts\" hpa-list=\"hpaForRS\" redirect-url=\"{{replicaSet | configURLForResource}}\">\n" +
    "</delete-link>\n" +
    "</li>\n" +
    "</ul>\n" +
    "</div>"
  );


  $templateCache.put('views/browse/build-config.html',
    "<div class=\"middle\">\n" +
    "<div class=\"middle-header\">\n" +
    "<div class=\"container-fluid\">\n" +
    "<breadcrumbs breadcrumbs=\"breadcrumbs\"></breadcrumbs>\n" +
    "<alerts alerts=\"alerts\"></alerts>\n" +
    "<h1 class=\"contains-actions\">\n" +
    "<div class=\"pull-right dropdown\" ng-if=\"buildConfig\" ng-hide=\"!('buildConfigs' | canIDoAny)\">\n" +
    "\n" +
    "<button class=\"btn btn-default hidden-xs\" ng-if=\"(buildConfigsInstantiateVersion | canI : 'create') && !(buildConfig | isBinaryBuild)\" ng-click=\"startBuild()\">\n" +
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
    "<ul class=\"dropdown-menu dropdown-menu-right actions action-button\">\n" +
    "<li class=\"visible-xs-inline\" ng-if=\"(buildConfigsInstantiateVersion | canI : 'create') && !(buildConfig | isBinaryBuild)\">\n" +
    "<a href=\"\" role=\"button\" ng-click=\"startBuild()\">\n" +
    "<span ng-if=\"!(buildConfig | isJenkinsPipelineStrategy)\">\n" +
    "Start Build\n" +
    "</span>\n" +
    "<span ng-if=\"buildConfig | isJenkinsPipelineStrategy\">\n" +
    "Start Pipeline\n" +
    "</span>\n" +
    "</a>\n" +
    "</li>\n" +
    "<li ng-if=\"buildConfigsVersion | canI : 'update'\">\n" +
    "<a ng-href=\"{{buildConfig | editResourceURL}}\" role=\"button\">Edit</a>\n" +
    "</li>\n" +
    "<li ng-if=\"buildConfigsVersion | canI : 'update'\">\n" +
    "<a ng-href=\"{{buildConfig | editYamlURL}}\" role=\"button\">Edit YAML</a>\n" +
    "</li>\n" +
    "<li ng-if=\"buildConfigsVersion | canI : 'delete'\">\n" +
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
    "<span ng-if=\"!(buildConfigsInstantiateVersion | canI : 'create')\">\n" +
    "Builds will create an image from\n" +
    "</span>\n" +
    "<span ng-if=\"buildConfigsInstantiateVersion | canI : 'create'\">\n" +
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
    "<button class=\"btn btn-primary btn-lg\" ng-click=\"startBuild()\" ng-if=\"(buildConfigsInstantiateVersion | canI : 'create') && !(buildConfig | isBinaryBuild)\">\n" +
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
    "<div class=\"table-filter-extension\">\n" +
    "<div class=\"data-toolbar\">\n" +
    "<div class=\"data-toolbar-filter\">\n" +
    "<project-filter></project-filter>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<table ng-if=\"!(buildConfig | isJenkinsPipelineStrategy)\" class=\"table table-bordered table-mobile\">\n" +
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
    "<div class=\"status\">\n" +
    "<status-icon status=\"build.status.phase\" disable-animation></status-icon>\n" +
    "<span class=\"status-detail\">\n" +
    "<span ng-if=\"!build.status.reason || build.status.phase === 'Cancelled'\">{{build.status.phase}}</span>\n" +
    "<span ng-if=\"build.status.reason && build.status.phase !== 'Cancelled'\">{{build.status.reason | sentenceCase}}</span>\n" +
    "</span>\n" +
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
    "<table ng-if=\"(builds | hashSize) === 0\" class=\"table table-bordered table-mobile\">\n" +
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
    "<dd><span class=\"source-path\">{{source}}</span><i class=\"fa fa-long-arrow-right\" aria-hidden=\"true\"></i><span class=\"destination-dir\">{{destination}}</span></dd>\n" +
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
    "                          mode: 'dockerfile',\n" +
    "                          theme: 'dreamweaver',\n" +
    "                          onLoad: aceLoaded,\n" +
    "                          highlightActiveLine: false,\n" +
    "                          showGutter: false,\n" +
    "                          rendererOptions: {\n" +
    "                            fadeFoldWidgets: true,\n" +
    "                            highlightActiveLine: false,\n" +
    "                            showPrintMargin: false\n" +
    "                          },\n" +
    "                          advanced: {\n" +
    "                            highlightActiveLine: false\n" +
    "                          }\n" +
    "                        }\" readonly=\"readonly\" ng-model=\"buildConfig.spec.source.dockerfile\" class=\"ace-bordered ace-read-only ace-inline dockerfile-mode mar-top-md\"></div>\n" +
    "</div>\n" +
    "<div ng-if=\"buildConfig.spec.strategy.jenkinsPipelineStrategy.jenkinsfile\">\n" +
    "<div class=\"small pull-right mar-top-sm\">\n" +
    "<a href=\"\" ng-click=\"showJenkinsfileExamples()\">What's a Jenkinsfile?</a>\n" +
    "</div>\n" +
    "<dt>\n" +
    "Jenkinsfile:\n" +
    "</dt><dd></dd>\n" +
    "<div ui-ace=\"{\n" +
    "                          mode: 'groovy',\n" +
    "                          theme: 'eclipse',\n" +
    "                          showGutter: false,\n" +
    "                          rendererOptions: {\n" +
    "                            fadeFoldWidgets: true,\n" +
    "                            highlightActiveLine: false,\n" +
    "                            showPrintMargin: false\n" +
    "                          },\n" +
    "                          advanced: {\n" +
    "                            highlightActiveLine: false\n" +
    "                          }\n" +
    "                        }\" readonly=\"readonly\" ng-model=\"buildConfig.spec.strategy.jenkinsPipelineStrategy.jenkinsfile\" class=\"ace-bordered ace-inline ace-read-only\"></div>\n" +
    "</div>\n" +
    "</dl>\n" +
    "<div ng-if=\"buildConfig | hasPostCommitHook\">\n" +
    "<h3>Post-Commit Hooks</h3>\n" +
    "<build-hooks build=\"buildConfig\"></build-hooks>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"col-lg-6\">\n" +
    "<h3>Triggers <span class=\"pficon pficon-warning-triangle-o\" ng-if=\"!(secretsVersion | canI : 'list')\" aria-hidden=\"true\" data-toggle=\"tooltip\" data-original-title=\"You do not have access to secrets in this project. Webhook URLs require access to secret information to be used.\"></span><a href=\"{{'build-triggers' | helpLink}}\" target=\"_blank\"><span class=\"learn-more-inline\">Learn More&nbsp;<i class=\"fa fa-external-link\" aria-hidden=\"true\"></i></span></a></h3>\n" +
    "<dl class=\"dl-horizontal left build-triggers\">\n" +
    "<div ng-repeat=\"trigger in buildConfig.spec.triggers | orderBy : 'type' : false : compareTriggers\">\n" +
    "<div ng-switch=\"trigger.type\">\n" +
    "<div ng-switch-when=\"Bitbucket\">\n" +
    "<dt>Bitbucket Webhook URL:\n" +
    "</dt>\n" +
    "<dd>\n" +
    "<copy-to-clipboard clipboard-text=\"buildConfig.metadata.name | webhookURL : trigger.type : trigger.bitbucket : project.metadata.name : webhookSecrets\"></copy-to-clipboard>\n" +
    "</dd>\n" +
    "</div>\n" +
    "<div ng-switch-when=\"GitHub\">\n" +
    "<dt>GitHub Webhook URL:\n" +
    "</dt>\n" +
    "<dd>\n" +
    "<copy-to-clipboard clipboard-text=\"buildConfig.metadata.name | webhookURL : trigger.type : trigger.github : project.metadata.name : webhookSecrets\"></copy-to-clipboard>\n" +
    "</dd>\n" +
    "</div>\n" +
    "<div ng-switch-when=\"GitLab\">\n" +
    "<dt>GitLab Webhook URL:\n" +
    "</dt>\n" +
    "<dd>\n" +
    "<copy-to-clipboard clipboard-text=\"buildConfig.metadata.name | webhookURL : trigger.type : trigger.gitlab : project.metadata.name : webhookSecrets\"></copy-to-clipboard>\n" +
    "</dd>\n" +
    "</div>\n" +
    "<div ng-switch-when=\"Generic\">\n" +
    "<dt>Generic Webhook URL:\n" +
    "</dt>\n" +
    "<dd>\n" +
    "<copy-to-clipboard clipboard-text=\"buildConfig.metadata.name | webhookURL : trigger.type : trigger.generic : project.metadata.name : webhookSecrets\"></copy-to-clipboard>\n" +
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
    "<div ng-if=\"buildConfigsVersion | canI : 'update'\">\n" +
    "<confirm-on-exit dirty=\"forms.bcEnvVars.$dirty\"></confirm-on-exit>\n" +
    "<key-value-editor entries=\"envVars\" key-placeholder=\"Name\" value-placeholder=\"Value\" value-from-selector-options=\"valueFromObjects\" key-validator=\"[A-Za-z_][A-Za-z0-9_]*\" key-validator-error=\"Please enter a valid key\" key-validator-error-tooltip=\"A valid environment variable name is an alphanumeric (a-z and 0-9) string beginning with a letter that may contain underscores.\" add-row-link=\"Add Value\" add-row-with-selectors-link=\"Add Value from Config Map or Secret\" show-header></key-value-editor>\n" +
    "<button class=\"btn btn-default\" ng-click=\"saveEnvVars()\" ng-disabled=\"forms.bcEnvVars.$pristine || forms.bcEnvVars.$invalid\">Save</button>\n" +
    "<a ng-if=\"!forms.bcEnvVars.$pristine\" href=\"\" ng-click=\"clearEnvVarUpdates()\" class=\"mar-left-sm\" style=\"vertical-align: -2px\">Clear Changes</a>\n" +
    "</div>\n" +
    "<key-value-editor ng-if=\"!(buildConfigsVersion | canI : 'update')\" entries=\"envVars\" key-placeholder=\"Name\" value-placeholder=\"Value\" is-readonly cannot-add cannot-sort cannot-delete show-header></key-value-editor>\n" +
    "</ng-form>\n" +
    "</uib-tab>\n" +
    "<uib-tab active=\"selectedTab.events\" ng-if=\"('events' | canI : 'watch')\">\n" +
    "<uib-tab-heading>Events</uib-tab-heading>\n" +
    "<events api-objects=\"[ buildConfig ]\" project-context=\"projectContext\" ng-if=\"selectedTab.events\"></events>\n" +
    "</uib-tab>\n" +
    "</uib-tabset>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/browse/build.html',
    "<div class=\"middle\">\n" +
    "<div class=\"middle-header\">\n" +
    "<div class=\"container-fluid\">\n" +
    "<breadcrumbs breadcrumbs=\"breadcrumbs\"></breadcrumbs>\n" +
    "<alerts alerts=\"alerts\"></alerts>\n" +
    "<div ng-if=\"!loaded\" class=\"mar-top-xl\">Loading...</div>\n" +
    "<div ng-if=\"build\">\n" +
    "<h1 class=\"contains-actions\">\n" +
    "<div class=\"pull-right dropdown\" ng-hide=\"!('builds' | canIDoAny)\">\n" +
    "\n" +
    "<button class=\"btn btn-default hidden-xs\" ng-click=\"cancelBuild()\" ng-if=\"!build.metadata.deletionTimestamp && (build | isIncompleteBuild) && (buildsVersion | canI : 'update')\">Cancel Build</button>\n" +
    "<button class=\"btn btn-default hidden-xs\" ng-click=\"cloneBuild()\" ng-hide=\"build.metadata.deletionTimestamp || (build | isIncompleteBuild) || !(buildsCloneVersion | canI : 'create') || (build | isBinaryBuild)\" ng-disabled=\"!canBuild\">Rebuild</button>\n" +
    "\n" +
    "<button type=\"button\" class=\"dropdown-toggle btn btn-default actions-dropdown-btn hidden-xs\" data-toggle=\"dropdown\">\n" +
    "Actions\n" +
    "<span class=\"caret\" aria-hidden=\"true\"></span>\n" +
    "</button>\n" +
    "<a href=\"\" class=\"dropdown-toggle actions-dropdown-kebab visible-xs-inline\" data-toggle=\"dropdown\"><i class=\"fa fa-ellipsis-v\"></i><span class=\"sr-only\">Actions</span></a>\n" +
    "<ul class=\"dropdown-menu dropdown-menu-right actions action-button\">\n" +
    "<li ng-if=\"buildConfigsVersion | canI : 'update'\">\n" +
    "<a ng-href=\"{{buildConfig | editResourceURL}}\" role=\"button\">\n" +
    "<span ng-if=\"!(buildConfig | isJenkinsPipelineStrategy)\">\n" +
    "Edit Configuration\n" +
    "</span>\n" +
    "<span ng-if=\"buildConfig | isJenkinsPipelineStrategy\">\n" +
    "Edit Pipeline\n" +
    "</span>\n" +
    "</a>\n" +
    "</li>\n" +
    "<li class=\"divider\" ng-if=\"buildConfigsVersion | canI : 'update'\"></li>\n" +
    "<li ng-if=\"!build.metadata.deletionTimestamp && (build | isIncompleteBuild) && (buildsVersion | canI : 'update')\" class=\"visible-xs-inline\">\n" +
    "<a href=\"\" role=\"button\" ng-click=\"cancelBuild()\">Cancel Build</a>\n" +
    "</li>\n" +
    "<li class=\"visible-xs-inline\" ng-class=\"{ disabled: !canBuild }\" ng-hide=\"build.metadata.deletionTimestamp || (build | isIncompleteBuild) || !(buildsCloneVersion | canI : 'create') || (build | isBinaryBuild)\">\n" +
    "<a href=\"\" role=\"button\" ng-click=\"cloneBuild()\" ng-attr-aria-disabled=\"{{canBuild ? undefined : 'true'}}\" ng-class=\"{ 'disabled-link': !canBuild }\">Rebuild</a>\n" +
    "</li>\n" +
    "<li ng-if=\"(buildsVersion | canI : 'update')\">\n" +
    "<a ng-href=\"{{build | editYamlURL}}\" role=\"button\">Edit YAML</a>\n" +
    "</li>\n" +
    "<li ng-if=\"(buildsVersion | canI : 'delete')\">\n" +
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
    "<p ng-if=\"buildConfigsVersion | canI : 'update'\">\n" +
    "<span class=\"pficon pficon-info\" aria-hidden=\"true\"></span>\n" +
    "Environment variables can be edited on the <a ng-href=\"{{build | configURLForResource}}?tab=environment\">build configuration</a>.\n" +
    "</p>\n" +
    "<key-value-editor ng-if=\"(build | buildStrategy).env | size\" entries=\"(build | buildStrategy).env\" key-placeholder=\"Name\" value-placeholder=\"Value\" cannot-add cannot-delete cannot-sort is-readonly show-header class=\"mar-bottom-xl block\"></key-value-editor>\n" +
    "<p ng-if=\"!(build | buildStrategy).env\"><em>The build strategy had no environment variables defined.</em></p>\n" +
    "</uib-tab>\n" +
    "<uib-tab active=\"selectedTab.logs\" ng-if=\"!(build | isJenkinsPipelineStrategy) && (buildsLogVersion | canI : 'get')\">\n" +
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
    "<uib-tab active=\"selectedTab.events\" ng-if=\"(eventsVersion | canI : 'watch')\">\n" +
    "<uib-tab-heading>Events</uib-tab-heading>\n" +
    "<events api-objects=\"eventObjects\" project-context=\"projectContext\" ng-if=\"selectedTab.events\"></events>\n" +
    "</uib-tab>\n" +
    "</uib-tabset>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/browse/config-map.html',
    "<div class=\"middle\">\n" +
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
    "<div class=\"pull-right dropdown\">\n" +
    "\n" +
    "<button ng-if=\"project.metadata.name | canIAddToProject\" type=\"button\" class=\"btn btn-default hidden-xs\" ng-click=\"addToApplication()\">\n" +
    "Add to Application\n" +
    "</button>\n" +
    "<button ng-if=\"'configmaps' | canIDoAny\" type=\"button\" class=\"dropdown-toggle btn btn-default actions-dropdown-btn hidden-xs\" data-toggle=\"dropdown\">\n" +
    "Actions\n" +
    "<span class=\"caret\"></span>\n" +
    "</button>\n" +
    "\n" +
    "<a href=\"\" ng-if=\"project.metadata.name | canIAddToProject\" class=\"dropdown-toggle actions-dropdown-kebab visible-xs-inline\" data-toggle=\"dropdown\"><i class=\"fa fa-ellipsis-v\" aria-hidden=\"true\"></i><span class=\"sr-only\">Actions</span></a>\n" +
    "<ul class=\"dropdown-menu dropdown-menu-right actions action-button\">\n" +
    "<li ng-if=\"project.metadata.name | canIAddToProject\" class=\"visible-xs\">\n" +
    "<a href=\"\" role=\"button\" ng-click=\"addToApplication()\">Add to Application</a>\n" +
    "</li>\n" +
    "<li ng-if=\"configMapsVersion | canI : 'update'\">\n" +
    "<a ng-href=\"{{configMap | editResourceURL}}\" role=\"button\">Edit</a>\n" +
    "</li>\n" +
    "<li ng-if=\"configMapsVersion | canI : 'update'\">\n" +
    "<a ng-href=\"{{configMap | editYamlURL}}\" role=\"button\">Edit YAML</a>\n" +
    "</li>\n" +
    "<li ng-if=\"configMapsVersion | canI : 'delete'\">\n" +
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
    "<div ng-if=\"configMap.data | hashSize\" class=\"table-responsive scroll-shadows-horizontal\">\n" +
    "<table class=\"table table-bordered table-bordered-columns config-map-table key-value-table\">\n" +
    "<tbody>\n" +
    "<tr ng-repeat=\"(prop, value) in configMap.data\">\n" +
    "<td class=\"key\">{{prop}}</td>\n" +
    "<td class=\"value\">\n" +
    "<truncate-long-text content=\"value\" limit=\"1024\" newline-limit=\"20\" expandable=\"true\" linkify=\"true\">\n" +
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
    "<overlay-panel class=\"overlay-panel-as-modal add-config-to-application\" show-panel=\"addToApplicationVisible\" handle-close=\"closeAddToApplication\">\n" +
    "<add-config-to-application project=\"project\" api-object=\"configMap\" on-cancel=\"closeAddToApplication\" on-complete=\"closeAddToApplication\"></add-config-to-application>\n" +
    "</overlay-panel>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/browse/config-maps.html',
    "<div class=\"middle\">\n" +
    "<div class=\"middle-header header-toolbar\">\n" +
    "<div class=\"container-fluid\">\n" +
    "<div class=\"page-header page-header-bleed-right page-header-bleed-left\">\n" +
    "<div class=\"pull-right\" ng-if=\"project && (configMapsVersion | canI : 'create') && ((configMaps | hashSize) > 0 || filterWithZeroResults)\">\n" +
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
    "<div ng-if=\"(configMaps | hashSize) > 0 || filterWithZeroResults\" class=\"data-toolbar\">\n" +
    "<div class=\"data-toolbar-filter\">\n" +
    "<project-filter></project-filter>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"middle-content\">\n" +
    "<div class=\"container-fluid\">\n" +
    "<div class=\"row\">\n" +
    "<div class=\"col-md-12\">\n" +
    "<div ng-if=\"(configMaps | hashSize) == 0\">\n" +
    "<p ng-if=\"!loaded\">\n" +
    "Loading...\n" +
    "</p>\n" +
    "<div ng-if=\"loaded\" class=\"empty-state-message text-center\">\n" +
    "<div ng-if=\"!filterWithZeroResults\">\n" +
    "<h2>No config maps.</h2>\n" +
    "<p>No config maps have been added to project {{projectName}}.</p>\n" +
    "<p ng-if=\"project && (configMapsVersion | canI : 'create')\">\n" +
    "<a ng-href=\"project/{{project.metadata.name}}/create-config-map\" class=\"btn btn-primary btn-lg\">Create Config Map</a>\n" +
    "</p>\n" +
    "</div>\n" +
    "<div ng-if=\"filterWithZeroResults\">\n" +
    "<h2>The filter is hiding all config maps. <button type=\"button\" class=\"btn btn-link inline-btn-link\" ng-click=\"clearFilter()\">Clear All Filters</button></h2>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<table ng-if=\"(configMaps | hashSize) > 0\" class=\"table table-bordered table-mobile table-layout-fixed\">\n" +
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
    "<tbody>\n" +
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
    "</div>"
  );


  $templateCache.put('views/browse/deployment-config.html',
    "<div class=\"middle\">\n" +
    "<div class=\"middle-header\">\n" +
    "<div class=\"container-fluid\">\n" +
    "<breadcrumbs breadcrumbs=\"breadcrumbs\"></breadcrumbs>\n" +
    "<alerts alerts=\"alerts\"></alerts>\n" +
    "<div>\n" +
    "<h1 class=\"contains-actions\">\n" +
    "<div class=\"pull-right dropdown\" ng-if=\"deploymentConfig\" ng-hide=\"!('deploymentConfigs' | canIDoAny)\">\n" +
    "\n" +
    "<button ng-if=\"deploymentConfigsInstantiateVersion | canI : 'create'\" class=\"btn btn-default hidden-xs\" ng-click=\"startLatestDeployment()\" ng-disabled=\"!canDeploy()\">\n" +
    "Deploy\n" +
    "</button>\n" +
    "\n" +
    "<button type=\"button\" class=\"dropdown-toggle btn btn-default actions-dropdown-btn hidden-xs\" data-toggle=\"dropdown\">\n" +
    "Actions\n" +
    "<span class=\"caret\" aria-hidden=\"true\"></span>\n" +
    "</button>\n" +
    "<a href=\"\" class=\"dropdown-toggle actions-dropdown-kebab visible-xs-inline\" data-toggle=\"dropdown\"><i class=\"fa fa-ellipsis-v\"></i><span class=\"sr-only\">Actions</span></a>\n" +
    "<ul class=\"dropdown-menu dropdown-menu-right actions action-button\">\n" +
    "<li class=\"visible-xs-inline\" ng-class=\"{ disabled: !canDeploy() }\" ng-if=\"deploymentConfigsInstantiateVersion | canI : 'create'\">\n" +
    "<a href=\"\" role=\"button\" ng-attr-aria-disabled=\"{{canDeploy() ? undefined : 'true'}}\" ng-class=\"{ 'disabled-link': !canDeploy() }\" ng-click=\"startLatestDeployment()\">Deploy</a>\n" +
    "</li>\n" +
    "<li ng-if=\"deploymentConfigsVersion | canI : 'update'\">\n" +
    "<a ng-href=\"{{deploymentConfig | editResourceURL}}\" role=\"button\">Edit</a>\n" +
    "</li>\n" +
    "<li class=\"divider\" ng-if=\"deploymentConfigsVersion | canI : 'update'\"></li>\n" +
    "<li ng-if=\"!deploymentConfig.spec.paused && !updatingPausedState && (deploymentConfigsVersion | canI : 'update')\">\n" +
    "<a href=\"\" ng-click=\"setPaused(true)\" role=\"button\">Pause Rollouts</a>\n" +
    "</li>\n" +
    "<li ng-if=\"deploymentConfig.spec.paused && !updatingPausedState && (deploymentConfigsVersion | canI : 'update')\">\n" +
    "<a href=\"\" ng-click=\"setPaused(false)\" role=\"button\">Resume Rollouts</a>\n" +
    "</li>\n" +
    "<li ng-if=\"deploymentConfigsVersion | canI : 'update'\">\n" +
    "<a ng-href=\"project/{{project.metadata.name}}/attach-pvc?kind=DeploymentConfig&name={{deploymentConfig.metadata.name}}\" role=\"button\">Add Storage</a>\n" +
    "</li>\n" +
    "<li ng-if=\"!autoscalers.length && (horizontalPodAutoscalersVersion | canI : 'create')\">\n" +
    "\n" +
    "<a ng-href=\"project/{{projectName}}/edit/autoscaler?kind=DeploymentConfig&name={{deploymentConfig.metadata.name}}\" role=\"button\">Add Autoscaler</a>\n" +
    "</li>\n" +
    "<li ng-if=\"autoscalers.length === 1 && (horizontalPodAutoscalersVersion | canI : 'update')\">\n" +
    "\n" +
    "<a ng-href=\"project/{{projectName}}/edit/autoscaler?kind=HorizontalPodAutoscaler&group=autoscaling&name={{autoscalers[0].metadata.name}}\" role=\"button\">Edit Autoscaler</a>\n" +
    "</li>\n" +
    "<li ng-if=\"deploymentConfigsVersion | canI : 'update'\">\n" +
    "<a ng-href=\"project/{{projectName}}/set-limits?kind=DeploymentConfig&name={{deploymentConfig.metadata.name}}\" role=\"button\">Edit Resource Limits</a>\n" +
    "</li>\n" +
    "<li ng-if=\"deploymentConfigsVersion | canI : 'update'\">\n" +
    "<a ng-href=\"{{healthCheckURL}}\" role=\"button\">Edit Health Checks</a>\n" +
    "</li>\n" +
    "<li ng-if=\"deploymentConfigsVersion | canI : 'update'\">\n" +
    "<a ng-href=\"{{deploymentConfig | editYamlURL}}\" role=\"button\">Edit YAML</a>\n" +
    "</li>\n" +
    "<li class=\"divider\" ng-if=\"deploymentConfigsVersion | canI : 'update'\"></li>\n" +
    "<li ng-if=\"deploymentConfigsVersion | canI : 'delete'\">\n" +
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
    "<div ng-if=\"deploymentConfig.spec.paused && !updatingPausedState\" class=\"alert alert-info animate-if\">\n" +
    "<span class=\"pficon pficon-info\" aria-hidden=\"true\"></span>\n" +
    "<strong>{{deploymentConfig.metadata.name}} is paused.</strong>\n" +
    "This will stop any new rollouts or triggers from running until resumed.\n" +
    "<span ng-if=\"!updatingPausedState && (deploymentConfigsVersion | canI : 'update')\" class=\"nowrap\">\n" +
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
    "<div class=\"table-filter-extension\">\n" +
    "<div class=\"data-toolbar\">\n" +
    "<div class=\"data-toolbar-filter\">\n" +
    "<project-filter></project-filter>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<table class=\"table table-bordered table-mobile\">\n" +
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
    "<div class=\"status\">\n" +
    "<status-icon status=\"deployment | deploymentStatus\" disable-animation></status-icon>\n" +
    "<span class=\"status-detail\">\n" +
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
    "<pod-template pod-template=\"deploymentConfig.spec.template\" images-by-docker-reference=\"imagesByDockerReference\" builds=\"builds\" detailed=\"true\" add-health-check-url=\"{{(deploymentConfigsVersion | canI : 'update') ? healthCheckURL : ''}}\">\n" +
    "</pod-template>\n" +
    "<h3>Volumes</h3>\n" +
    "<p ng-if=\"!deploymentConfig.spec.template.spec.volumes.length && !(deploymentConfigsVersion | canI : 'update')\">\n" +
    "none\n" +
    "</p>\n" +
    "<volumes volumes=\"deploymentConfig.spec.template.spec.volumes\" namespace=\"project.metadata.name\" can-remove=\"deploymentConfigsVersion | canI : 'update'\" remove-fn=\"removeVolume(volume)\">\n" +
    "</volumes>\n" +
    "<p ng-if=\"deploymentConfigsVersion | canI : 'update'\">\n" +
    "<a ng-href=\"project/{{project.metadata.name}}/attach-pvc?kind=DeploymentConfig&name={{deploymentConfig.metadata.name}}\">Add Storage</a>\n" +
    "<span class=\"action-divider\" aria-hidden=\"true\">|</span>\n" +
    "<a ng-href=\"project/{{project.metadata.name}}/add-config-volume?kind=DeploymentConfig&name={{deploymentConfig.metadata.name}}\">Add Config Files</a>\n" +
    "</p>\n" +
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
    "\n" +
    "<resource-service-bindings project=\"project\" project-context=\"projectContext\" api-object=\"deploymentConfig\">\n" +
    "</resource-service-bindings>\n" +
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
    "<a ng-href=\"project/{{projectName}}/set-limits?kind=DeploymentConfig&name={{deploymentConfig.metadata.name}}\" ng-if=\"warning.reason === 'NoCPURequest' && (deploymentConfigsVersion | canI : 'update')\" role=\"button\">Edit Resource\n" +
    "<span ng-if=\"!('cpu' | isRequestCalculated : project)\">Requests and</span> Limits</a>\n" +
    "</div>\n" +
    "\n" +
    "<div ng-if=\"!autoscalers.length\">\n" +
    "<a ng-if=\"horizontalPodAutoscalersVersion | canI : 'create'\" ng-href=\"project/{{projectName}}/edit/autoscaler?kind=DeploymentConfig&name={{deploymentConfig.metadata.name}}\" role=\"button\">Add Autoscaler</a>\n" +
    "<span ng-if=\"!(horizontalPodAutoscalersVersion | canI : 'create')\">Autoscaling is not enabled. There are no autoscalers for this deployment config.</span>\n" +
    "</div>\n" +
    "\n" +
    "<div ng-repeat=\"hpa in autoscalers\">\n" +
    "<hpa hpa=\"hpa\" project=\"project\" show-scale-target=\"false\" alerts=\"alerts\"></hpa>\n" +
    "</div>\n" +
    "<div ng-if=\"deploymentConfig.spec.strategy.type !== 'Custom'\">\n" +
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
    "<p ng-if=\"!strategyParams.pre && !strategyParams.mid && !strategyParams.post\">\n" +
    "none\n" +
    "</p>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<annotations annotations=\"deploymentConfig.metadata.annotations\"></annotations>\n" +
    "</div>\n" +
    "</uib-tab>\n" +
    "<uib-tab heading=\"Environment\" active=\"selectedTab.environment\" ng-if=\"deploymentConfig\">\n" +
    "<uib-tab-heading>Environment</uib-tab-heading>\n" +
    "<edit-environment-variables api-object=\"deploymentConfig\"></edit-environment-variables>\n" +
    "</uib-tab>\n" +
    "<uib-tab active=\"selectedTab.events\" ng-if=\"eventsVersion | canI : 'watch'\">\n" +
    "<uib-tab-heading>Events</uib-tab-heading>\n" +
    "<events api-objects=\"[ deploymentConfig ]\" project-context=\"projectContext\" ng-if=\"selectedTab.events\"></events>\n" +
    "</uib-tab>\n" +
    "</uib-tabset>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/browse/deployment.html',
    "<div class=\"middle\">\n" +
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
    "<ul class=\"dropdown-menu dropdown-menu-right actions action-button\">\n" +
    "<li ng-if=\"!deployment.spec.paused && !updatingPausedState && (deploymentsVersion | canI : 'update')\">\n" +
    "<a href=\"\" ng-click=\"setPaused(true)\" role=\"button\">Pause Rollouts</a>\n" +
    "</li>\n" +
    "<li ng-if=\"deployment.spec.paused && !updatingPausedState && (deploymentsVersion | canI : 'update')\">\n" +
    "<a href=\"\" ng-click=\"setPaused(false)\" role=\"button\">Resume Rollouts</a>\n" +
    "</li>\n" +
    "<li class=\"divider\" ng-if=\"!updatingPausedState && (deploymentsVersion | canI : 'update')\"></li>\n" +
    "<li ng-if=\"deploymentsVersion | canI : 'update'\">\n" +
    "<a ng-href=\"project/{{project.metadata.name}}/attach-pvc?kind=Deployment&name={{deployment.metadata.name}}&group=apps\" role=\"button\">Add Storage</a>\n" +
    "</li>\n" +
    "<li ng-if=\"!autoscalers.length && (horizontalPodAutoscalersVersion | canI : 'create')\">\n" +
    "\n" +
    "<a ng-href=\"project/{{projectName}}/edit/autoscaler?kind=Deployment&name={{deployment.metadata.name}}&group=apps\" role=\"button\">Add Autoscaler</a>\n" +
    "</li>\n" +
    "<li ng-if=\"autoscalers.length === 1 && (horizontalPodAutoscalersVersion | canI : 'update')\">\n" +
    "\n" +
    "<a ng-href=\"project/{{projectName}}/edit/autoscaler?kind=HorizontalPodAutoscaler&group=autoscaling&name={{autoscalers[0].metadata.name}}\" role=\"button\">Edit Autoscaler</a>\n" +
    "</li>\n" +
    "<li ng-if=\"deploymentsVersion | canI : 'update'\">\n" +
    "<a ng-href=\"project/{{projectName}}/set-limits?kind=Deployment&name={{deployment.metadata.name}}&group=apps\" role=\"button\">Edit Resource Limits</a>\n" +
    "</li>\n" +
    "<li ng-if=\"deploymentsVersion | canI : 'update'\">\n" +
    "<a ng-href=\"{{healthCheckURL}}\" role=\"button\">Edit Health Checks</a>\n" +
    "</li>\n" +
    "<li ng-if=\"deploymentsVersion | canI : 'update'\">\n" +
    "<a ng-href=\"{{deployment | editYamlURL}}\" role=\"button\">Edit YAML</a>\n" +
    "</li>\n" +
    "<li class=\"divider\" ng-if=\"deploymentsVersion | canI : 'update'\"></li>\n" +
    "<li ng-if=\"deploymentsVersion | canI : 'delete'\">\n" +
    "<delete-link kind=\"Deployment\" group=\"apps\" resource-name=\"{{deployment.metadata.name}}\" project-name=\"{{deployment.metadata.namespace}}\" alerts=\"alerts\" hpa-list=\"autoscalers\">\n" +
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
    "<div ng-if=\"deployment.spec.paused && !updatingPausedState\" class=\"alert alert-info animate-if\">\n" +
    "<span class=\"pficon pficon-info\" aria-hidden=\"true\"></span>\n" +
    "<strong>{{deployment.metadata.name}} is paused.</strong>\n" +
    "This pauses any in-progress rollouts and stops new rollouts from running until the deployment is resumed.\n" +
    "<span ng-if=\"!updatingPausedState && (deploymentsVersion | canI : 'update')\" class=\"nowrap\">\n" +
    "<a href=\"\" ng-click=\"setPaused(false)\" role=\"button\">Resume Rollouts</a>\n" +
    "</span>\n" +
    "</div>\n" +
    "<uib-tabset>\n" +
    "<uib-tab active=\"selectedTab.history\">\n" +
    "<uib-tab-heading>History</uib-tab-heading>\n" +
    "<div class=\"table-filter-extension\">\n" +
    "<div class=\"data-toolbar\">\n" +
    "<div class=\"data-toolbar-filter\">\n" +
    "<project-filter></project-filter>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<table class=\"table table-bordered table-mobile table-layout-fixed\">\n" +
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
    "<tbody ng-if=\"(replicaSetsForDeployment | size) == 0\">\n" +
    "<tr><td colspan=\"4\"><em>{{emptyMessage}}</em></td></tr>\n" +
    "</tbody>\n" +
    "<tbody ng-if=\"(replicaSetsForDeployment | size) > 0\">\n" +
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
    "<span ng-if=\"deployment.spec.strategy.rollingUpdate.maxUnavailable | isNil\">25%</span>\n" +
    "<span ng-if=\"!(deployment.spec.strategy.rollingUpdate.maxUnavailable | isNil)\">\n" +
    "{{deployment.spec.strategy.rollingUpdate.maxUnavailable}}\n" +
    "</span>\n" +
    "</dd>\n" +
    "<dt>\n" +
    "Max Surge:\n" +
    "<span data-toggle=\"tooltip\" title=\"The maximum number of pods that can be created above the desired number of pods.\" class=\"pficon pficon-help text-muted small\"></span>\n" +
    "</dt>\n" +
    "<dd ng-if-end>\n" +
    "<span ng-if=\"deployment.spec.strategy.rollingUpdate.maxSurge | isNil\">25%</span>\n" +
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
    "<dt>\n" +
    "Revision History Limit:\n" +
    "<span data-toggle=\"tooltip\" title=\"The number of old replica sets to keep.\" class=\"pficon pficon-help text-muted small\"></span>\n" +
    "</dt>\n" +
    "<dd>\n" +
    "{{deployment.spec.revisionHistoryLimit || 2}}\n" +
    "</dd>\n" +
    "<dt>\n" +
    "Progress Deadline:\n" +
    "<span data-toggle=\"tooltip\" title=\"The amount of time to wait for a deployment to make progress before it's considered failed.\" class=\"pficon pficon-help text-muted small\"></span>\n" +
    "</dt>\n" +
    "<dd>\n" +
    "{{deployment.spec.progressDeadlineSeconds || 600}} sec\n" +
    "</dd>\n" +
    "</dl>\n" +
    "<h3>Template</h3>\n" +
    "<pod-template pod-template=\"deployment.spec.template\" images-by-docker-reference=\"imagesByDockerReference\" builds=\"builds\" detailed=\"true\" add-health-check-url=\"{{ (deploymentsVersion | canI : 'update') ? healthCheckURL : '' }}\">\n" +
    "</pod-template>\n" +
    "</div>\n" +
    "<div class=\"col-lg-6\">\n" +
    "<h3>Volumes</h3>\n" +
    "<p ng-if=\"!deployment.spec.template.spec.volumes.length && !(deploymentsVersion | canI : 'update')\">\n" +
    "none\n" +
    "</p>\n" +
    "<volumes volumes=\"deployment.spec.template.spec.volumes\" namespace=\"project.metadata.name\" can-remove=\"deploymentsVersion | canI : 'update'\" remove-fn=\"removeVolume(volume)\">\n" +
    "</volumes>\n" +
    "<div ng-if=\"deploymentsVersion | canI : 'update'\">\n" +
    "<a ng-href=\"project/{{project.metadata.name}}/attach-pvc?kind=Deployment&name={{deployment.metadata.name}}&group=apps\">Add Storage</a>\n" +
    "<span class=\"action-divider\" aria-hidden=\"true\">|</span>\n" +
    "<a ng-href=\"project/{{project.metadata.name}}/add-config-volume?kind=Deployment&name={{deployment.metadata.name}}&group=apps\">Add Config Files</a>\n" +
    "</div>\n" +
    "<h3>Autoscaling</h3>\n" +
    "\n" +
    "<div ng-repeat=\"warning in hpaWarnings\" class=\"alert alert-warning\">\n" +
    "<span class=\"pficon pficon-warning-triangle-o\" aria-hidden=\"true\"></span>\n" +
    "<span class=\"sr-only\">Warning:</span>\n" +
    "{{warning.message}}\n" +
    "\n" +
    "<a ng-href=\"project/{{projectName}}/set-limits?kind=Deployment&name={{deployment.metadata.name}}&group=apps\" ng-if=\"warning.reason === 'NoCPURequest' && (deploymentsVersion | canI : 'update')\" role=\"button\">Edit Resource\n" +
    "<span ng-if=\"!('cpu' | isRequestCalculated : project)\">Requests and</span> Limits</a>\n" +
    "</div>\n" +
    "\n" +
    "<div ng-if=\"!autoscalers.length\">\n" +
    "<a ng-if=\"horizontalPodAutoscalersVersion | canI : 'create'\" ng-href=\"project/{{projectName}}/edit/autoscaler?kind=Deployment&name={{deployment.metadata.name}}&group=apps\" role=\"button\">Add Autoscaler</a>\n" +
    "<span ng-if=\"!(horizontalPodAutoscalersVersion | canI : 'create')\">none</span>\n" +
    "</div>\n" +
    "\n" +
    "<div ng-repeat=\"hpa in autoscalers\">\n" +
    "<hpa hpa=\"hpa\" project=\"project\" show-scale-target=\"false\" alerts=\"alerts\"></hpa>\n" +
    "</div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"col-lg-6\">\n" +
    "<resource-service-bindings project=\"project\" project-context=\"projectContext\" api-object=\"deployment\">\n" +
    "</resource-service-bindings>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"mar-top-md\">\n" +
    "<annotations annotations=\"deployment.metadata.annotations\"></annotations>\n" +
    "</div>\n" +
    "</div>\n" +
    "</uib-tab>\n" +
    "<uib-tab heading=\"Environment\" active=\"selectedTab.environment\" ng-if=\"deployment\">\n" +
    "<uib-tab-heading>Environment</uib-tab-heading>\n" +
    "<edit-environment-variables api-object=\"deployment\"></edit-environment-variables>\n" +
    "</uib-tab>\n" +
    "<uib-tab active=\"selectedTab.events\" ng-if=\"eventsVersion | canI : 'watch'\">\n" +
    "<uib-tab-heading>Events</uib-tab-heading>\n" +
    "<events api-objects=\"[ deployment ]\" project-context=\"projectContext\" ng-if=\"selectedTab.events\"></events>\n" +
    "</uib-tab>\n" +
    "</uib-tabset>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/browse/image.html',
    "<div class=\"middle image\">\n" +
    "<div class=\"middle-header\">\n" +
    "<div class=\"container-fluid\">\n" +
    "<breadcrumbs breadcrumbs=\"breadcrumbs\"></breadcrumbs>\n" +
    "<alerts alerts=\"alerts\"></alerts>\n" +
    "<div ng-if=\"!loaded\" class=\"mar-top-xl\">Loading...</div>\n" +
    "<div ng-if=\"imageStream\">\n" +
    "<h1>\n" +
    "{{imageStream.metadata.name}}:{{tagName}}\n" +
    "</h1>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"middle-content\" persist-tab-state>\n" +
    "<div class=\"container-fluid\">\n" +
    "<div ng-if=\"!loaded\">Loading...</div>\n" +
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
    "</div>"
  );


  $templateCache.put('views/browse/imagestream.html',
    "<div class=\"middle\">\n" +
    "<div class=\"middle-header\">\n" +
    "<div class=\"container-fluid\">\n" +
    "<breadcrumbs breadcrumbs=\"breadcrumbs\"></breadcrumbs>\n" +
    "<alerts alerts=\"alerts\"></alerts>\n" +
    "<div ng-if=\"!loaded\" class=\"mar-top-xl\">Loading...</div>\n" +
    "<div ng-if=\"imageStream\">\n" +
    "<h1 class=\"contains-actions\">\n" +
    "<div class=\"pull-right dropdown\" ng-hide=\"!('imageStreams' | canIDoAny)\">\n" +
    "<button type=\"button\" class=\"dropdown-toggle btn btn-default actions-dropdown-btn hidden-xs\" data-toggle=\"dropdown\">\n" +
    "Actions\n" +
    "<span class=\"caret\" aria-hidden=\"true\"></span>\n" +
    "</button>\n" +
    "<a href=\"\" class=\"dropdown-toggle actions-dropdown-kebab visible-xs-inline\" data-toggle=\"dropdown\"><i class=\"fa fa-ellipsis-v\"></i><span class=\"sr-only\">Actions</span></a>\n" +
    "<ul class=\"dropdown-menu dropdown-menu-right actions action-button\">\n" +
    "<li ng-if=\"imageStreamsVersion | canI : 'update'\">\n" +
    "<a ng-href=\"{{imageStream | editYamlURL}}\" role=\"button\">Edit YAML</a>\n" +
    "</li>\n" +
    "<li ng-if=\"imageStreamsVersion | canI : 'delete'\">\n" +
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
    "<registry-imagestream-body imagestream=\"imageStream\">\n" +
    "</registry-imagestream-body>\n" +
    "<registry-imagestream-meta imagestream=\"imageStream\">\n" +
    "</registry-imagestream-meta>\n" +
    "<registry-image-listing imagestream=\"imageStream\" imagestream-path=\"imagestreamPath\">\n" +
    "</registry-image-listing>\n" +
    "<registry-imagestream-push settings=\"settings\" imagestream=\"imageStream\">\n" +
    "</registry-imagestream-push>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/browse/persistent-volume-claim.html',
    "<div class=\"middle\">\n" +
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
    "<ul class=\"dropdown-menu dropdown-menu-right actions action-button\">\n" +
    "<li ng-if=\"!pvc.spec.volumeName\">\n" +
    "<a ng-href=\"{{pvc | editYamlURL}}\" role=\"button\">Edit YAML</a>\n" +
    "</li>\n" +
    "<li>\n" +
    "<delete-link ng-if=\"pvcVersion | canI : 'delete'\" kind=\"PersistentVolumeClaim\" resource-name=\"{{pvc.metadata.name}}\" project-name=\"{{pvc.metadata.namespace}}\" alerts=\"alerts\">\n" +
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
    "<uib-tabset>\n" +
    "<uib-tab heading=\"Details\" active=\"selectedTab.details\">\n" +
    "<uib-tab-heading>Details</uib-tab-heading>\n" +
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
    "</uib-tab>\n" +
    "<uib-tab active=\"selectedTab.events\" ng-if=\"eventsVersion | canI : 'watch'\">\n" +
    "<uib-tab-heading>Events</uib-tab-heading>\n" +
    "<events api-objects=\"[ pvc ] \" project-context=\"projectContext\" ng-if=\"selectedTab.events\"></events>\n" +
    "</uib-tab>\n" +
    "</uib-tabset>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/browse/pod.html',
    "<div class=\"middle pod\">\n" +
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
    "<ul class=\"dropdown-menu dropdown-menu-right actions action-button\">\n" +
    "<li ng-if=\"(pod | annotation:'deploymentConfig') && (deploymentConfigsVersion | canI : 'update')\">\n" +
    "<a ng-href=\"project/{{project.metadata.name}}/attach-pvc?kind=DeploymentConfig&name={{pod | annotation:'deploymentConfig'}}\" role=\"button\">Add Storage</a>\n" +
    "</li>\n" +
    "<li ng-if=\"podsVersion | canI : 'update'\">\n" +
    "<a ng-href=\"{{pod | editYamlURL}}\" role=\"button\">Edit YAML</a>\n" +
    "</li>\n" +
    "<li ng-if=\"podsVersion | canI : 'delete'\">\n" +
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
    "<p ng-if=\"dcName\">\n" +
    "<span class=\"pficon pficon-info\" aria-hidden=\"true\"></span>\n" +
    "Environment variables can be edited on deployment config\n" +
    "<a ng-href=\"{{dcName | navigateResourceURL : 'DeploymentConfig' : pod.metadata.namespace}}?tab=environment\">{{dcName}}</a>.\n" +
    "</p>\n" +
    "<p ng-if=\"!dcName && controllerRef\">\n" +
    "<span class=\"pficon pficon-info\" aria-hidden=\"true\"></span>\n" +
    "Environment variables were set by {{controllerRef.kind | humanizeKind}}\n" +
    "<a ng-href=\"{{controllerRef.name | navigateResourceURL : controllerRef.kind : pod.metadata.namespace}}?tab=environment\">{{controllerRef.name}}</a>.\n" +
    "</p>\n" +
    "<edit-environment-variables api-object=\"pod\" ng-readonly=\"true\"></edit-environment-variables>\n" +
    "</uib-tab>\n" +
    "<uib-tab ng-if=\"metricsAvailable\" heading=\"Metrics\" active=\"selectedTab.metrics\">\n" +
    "\n" +
    "<pod-metrics ng-if=\"selectedTab.metrics\" pod=\"pod\" alerts=\"alerts\">\n" +
    "</pod-metrics>\n" +
    "</uib-tab>\n" +
    "<uib-tab active=\"selectedTab.logs\" ng-if=\"podsLogVersion | canI : 'get'\">\n" +
    "<uib-tab-heading>Logs</uib-tab-heading>\n" +
    "<log-viewer ng-if=\"selectedTab.logs\" follow-affix-top=\"390\" object=\"pod\" context=\"projectContext\" options=\"logOptions\" empty=\"logEmpty\" run=\"logCanRun\" ng-class=\"{'log-viewer-select': pod.spec.containers.length > 1}\">\n" +
    "<span class=\"container-details\">\n" +
    "<label for=\"selectLogContainer\">Container:</label>\n" +
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
    "<div ng-if=\"!noContainersYet\" class=\"mar-top-xl mar-bottom-xl\">\n" +
    "<div class=\"mar-bottom-md\">\n" +
    "<span class=\"pficon pficon-info\" aria-hidden=\"true\"></span>\n" +
    "<span ng-class=\"{ 'mar-right-md': hasFullscreen }\">\n" +
    "When you navigate away from this pod, any open terminal connections will be closed. This will kill any foreground processes you started from the&nbsp;terminal.\n" +
    "</span>\n" +
    "<a href=\"\" ng-if=\"hasFullscreen\" ng-click=\"fullscreenTerminal()\" class=\"nowrap\" aria-hidden=\"true\">Open Fullscreen Terminal</a>\n" +
    "</div>\n" +
    "<alerts ng-if=\"selectedTerminalContainer.status === 'disconnected'\" alerts=\"terminalDisconnectAlert\"></alerts>\n" +
    "<div class=\"mar-left-xl\">\n" +
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
    "<div class=\"ui-select-choices-flex\">\n" +
    "<span ng-bind-html=\"term.containerName | highlight: $select.search\">\n" +
    "</span>\n" +
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
    "<a ng-href=\"\" ng-click=\"fullscreenTerminal()\" class=\"go-fullscreen\" title=\"Open Fullscreen Terminal\"><i class=\"fa fa-expand\"></i></a>\n" +
    "<a ng-href=\"\" ng-click=\"exitFullscreen()\" class=\"exit-fullscreen\" title=\"Exit Fullscreen\"><i class=\"fa fa-compress\"></i></a>\n" +
    "</div>\n" +
    "<kubernetes-container-terminal prevent=\"!terminalTabWasSelected\" ng-if=\"term.isUsed\" ng-show=\"term.isVisible\" pod=\"pod\" container=\"term.containerName\" status=\"term.status\" rows=\"terminalRows\" cols=\"terminalCols\" autofocus=\"true\" command=\"[&quot;/bin/sh&quot;, &quot;-i&quot;, &quot;-c&quot;, &quot;TERM=xterm /bin/sh&quot;]\">\n" +
    "</kubernetes-container-terminal>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</uib-tab>\n" +
    "<uib-tab active=\"selectedTab.events\" ng-if=\"eventsVersion | canI : 'watch'\">\n" +
    "<uib-tab-heading>Events</uib-tab-heading>\n" +
    "<events api-objects=\"[ pod ]\" project-context=\"projectContext\" ng-if=\"selectedTab.events\"></events>\n" +
    "</uib-tab>\n" +
    "</uib-tabset>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/browse/replica-set.html',
    "<div class=\"middle\">\n" +
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
    "<p ng-if=\"deployment && (deploymentsVersion | canI : 'update')\">\n" +
    "<span class=\"pficon pficon-info\" aria-hidden=\"true\"></span>\n" +
    "Environment variables can be edited on the deployment\n" +
    "<a ng-href=\"{{deployment | navigateResourceURL}}?tab=environment\">{{deployment.metadata.name}}</a>.\n" +
    "</p>\n" +
    "<p ng-if=\"deploymentConfigName && (deploymentConfigsVersion | canI : 'update')\">\n" +
    "<span class=\"pficon pficon-info\" aria-hidden=\"true\"></span>\n" +
    "Environment variables can be edited on deployment config\n" +
    "<a ng-href=\"{{replicaSet | configURLForResource}}?tab=environment\">{{deploymentConfigName}}</a>.\n" +
    "</p>\n" +
    "\n" +
    "<edit-environment-variables api-object=\"replicaSet\" ng-readonly=\"(replicaSet | hasDeployment) || (replicaSet | hasDeploymentConfig)\">\n" +
    "</edit-environment-variables>\n" +
    "</uib-tab>\n" +
    "<uib-tab ng-if=\"metricsAvailable\" heading=\"Metrics\" active=\"selectedTab.metrics\">\n" +
    "\n" +
    "<deployment-metrics ng-if=\"selectedTab.metrics && podsForDeployment\" pods=\"podsForDeployment\" containers=\"replicaSet.spec.template.spec.containers\" alerts=\"alerts\">\n" +
    "</deployment-metrics>\n" +
    "</uib-tab>\n" +
    "<uib-tab ng-if=\"deploymentConfigName && logOptions.version && (deploymentConfigsLogVersion | canI : 'get')\" active=\"selectedTab.logs\">\n" +
    "<uib-tab-heading>Logs</uib-tab-heading>\n" +
    "<log-viewer ng-if=\"selectedTab.logs\" follow-affix-top=\"390\" object=\"replicaSet\" context=\"projectContext\" options=\"logOptions\" empty=\"logEmpty\" run=\"logCanRun\">\n" +
    "<span ng-if=\"replicaSet | deploymentStatus\">\n" +
    "<label>Status:</label>\n" +
    "<status-icon status=\"replicaSet | deploymentStatus\"></status-icon>\n" +
    "{{replicaSet | deploymentStatus}}\n" +
    "</span>\n" +
    "</log-viewer>\n" +
    "</uib-tab>\n" +
    "<uib-tab active=\"selectedTab.events\" ng-if=\"eventsVersion | canI : 'watch'\">\n" +
    "<uib-tab-heading>Events</uib-tab-heading>\n" +
    "<events api-objects=\"[ replicaSet ]\" project-context=\"projectContext\" ng-if=\"selectedTab.events\"></events>\n" +
    "</uib-tab>\n" +
    "</uib-tabset>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/browse/route.html',
    "<div class=\"middle\">\n" +
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
    "<ul class=\"dropdown-menu dropdown-menu-right actions action-button\">\n" +
    "<li ng-if=\"routesVersion | canI : 'update'\">\n" +
    "<a ng-href=\"{{route | editResourceURL}}\" role=\"button\">Edit</a>\n" +
    "</li>\n" +
    "<li ng-if=\"routesVersion | canI : 'update'\">\n" +
    "<a ng-href=\"{{route | editYamlURL}}\" role=\"button\">Edit YAML</a>\n" +
    "</li>\n" +
    "<li ng-if=\"routesVersion | canI : 'delete'\">\n" +
    "<delete-link kind=\"Route\" resource-name=\"{{route.metadata.name}}\" project-name=\"{{route.metadata.namespace}}\" alerts=\"alerts\">\n" +
    "</delete-link>\n" +
    "</li>\n" +
    "</ul>\n" +
    "</div>\n" +
    "{{route.metadata.name}}\n" +
    "<route-warnings ng-if=\"route.spec.to.kind !== 'Service' || services\" route=\"route\" services=\"services\">\n" +
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
    "<a ng-href=\"{{route | routeWebURL : ingress.host}}\" target=\"_blank\">\n" +
    "{{route | routeLabel : ingress.host : true}}\n" +
    "<i class=\"fa fa-external-link\" aria-hidden=\"true\"></i>\n" +
    "</a>\n" +
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
    "The DNS admin should set up a CNAME from the route's hostname, {{ingress.host}}, to the router's canonical hostname, {{ingress.routerCanonicalHostname}}.\n" +
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
    "<div class=\"col-sm-12 col-md-5 col-md-push-7 mar-bottom-lg\">\n" +
    "<route-service-pie route=\"route\"></route-service-pie>\n" +
    "</div>\n" +
    "<div class=\"cold-sm-12 col-md-7 col-md-pull-5\">\n" +
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
    "<p ng-if=\"!route.spec.tls\">\n" +
    "TLS is not enabled.\n" +
    "<span ng-if=\"routesVersion | canI : 'update'\">\n" +
    "<a ng-href=\"{{route | editResourceURL}}\" role=\"button\">Edit</a> this route to enable secure network traffic.\n" +
    "</span>\n" +
    "</p>\n" +
    "</div>\n" +
    "<annotations annotations=\"route.metadata.annotations\"></annotations>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/browse/routes.html',
    "<div class=\"middle\">\n" +
    "<div class=\"middle-header header-toolbar\">\n" +
    "<div class=\"container-fluid\">\n" +
    "<div class=\"page-header page-header-bleed-right page-header-bleed-left\">\n" +
    "<div class=\"pull-right\" ng-if=\"project && (routesVersion | canI : 'create') && ((routes | hashSize) > 0 || filterWithZeroResults)\">\n" +
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
    "<div ng-if=\"(routes | hashSize) > 0 || filterWithZeroResults\" class=\"data-toolbar\">\n" +
    "<div class=\"data-toolbar-filter\">\n" +
    "<project-filter></project-filter>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"middle-content\">\n" +
    "<div class=\"container-fluid\">\n" +
    "<div class=\"row\">\n" +
    "<div class=\"col-md-12\">\n" +
    "<div ng-if=\"(routes | hashSize) == 0\">\n" +
    "<p ng-if=\"!routesLoaded\">\n" +
    "Loading...\n" +
    "</p>\n" +
    "<div ng-if=\"routesLoaded\" class=\"empty-state-message text-center\">\n" +
    "<div ng-if=\"!filterWithZeroResults\">\n" +
    "<h2>No routes.</h2>\n" +
    "<p>No routes have been added to project {{projectName}}.</p>\n" +
    "<p ng-if=\"project && (routesVersion | canI : 'create') && !filterWithZeroResults\">\n" +
    "<a ng-href=\"project/{{project.metadata.name}}/create-route\" class=\"btn btn-primary btn-lg\">Create Route</a>\n" +
    "</p>\n" +
    "</div>\n" +
    "<div ng-if=\"filterWithZeroResults\">\n" +
    "<h2>The filter is hiding all routes. <button type=\"button\" class=\"btn btn-link inline-btn-link\" ng-click=\"clearFilter()\">Clear All Filters</button></h2>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<table ng-if=\"(routes | hashSize) > 0\" class=\"table table-bordered table-mobile table-layout-fixed\">\n" +
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
    "\n" +
    "<th>Service</th>\n" +
    "<th>Target Port</th>\n" +
    "<th>TLS Termination</th>\n" +
    "</tr>\n" +
    "</thead>\n" +
    "<tbody>\n" +
    "<tr ng-repeat=\"route in routes | orderObjectsByDate : true\">\n" +
    "<td data-title=\"{{ customNameHeader || 'Name' }}\">\n" +
    "<a href=\"{{route | navigateResourceURL}}\">{{route.metadata.name}}</a>\n" +
    "<route-warnings ng-if=\"route.spec.to.kind !== 'Service' || services\" route=\"route\" services=\"services\">\n" +
    "</route-warnings>\n" +
    "</td>\n" +
    "<td data-title=\"Hostname\">\n" +
    "<span ng-if=\"(route | isWebRoute)\">\n" +
    "<a href=\"{{route | routeWebURL}}\" target=\"_blank\">\n" +
    "{{route | routeLabel}}\n" +
    "<i class=\"fa fa-external-link\" aria-hidden=\"true\"></i>\n" +
    "</a>\n" +
    "</span>\n" +
    "<span ng-if=\"!(route | isWebRoute)\">\n" +
    "{{route | routeLabel}}\n" +
    "</span>\n" +
    "<span ng-if=\"!route.status.ingress\" data-toggle=\"popover\" data-trigger=\"hover\" data-content=\"The route is not accepting traffic yet because it has not been admitted by a router.\" style=\"cursor: help; padding-left: 5px\">\n" +
    "<status-icon status=\"'Pending'\"></status-icon>\n" +
    "<span class=\"sr-only\">Pending</span>\n" +
    "</span>\n" +
    "</td>\n" +
    "\n" +
    "<td data-title=\"Service\">\n" +
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
    "</div>"
  );


  $templateCache.put('views/browse/secret.html',
    "<div class=\"middle\">\n" +
    "<div class=\"middle-header\">\n" +
    "<div class=\"container-fluid\">\n" +
    "<breadcrumbs breadcrumbs=\"breadcrumbs\"></breadcrumbs>\n" +
    "<alerts alerts=\"alerts\"></alerts>\n" +
    "<div ng-if=\"!loaded\" class=\"mar-top-xl\">Loading...</div>\n" +
    "<div ng-if=\"secret\">\n" +
    "<h1 class=\"contains-actions\">\n" +
    "<div class=\"pull-right dropdown\">\n" +
    "\n" +
    "<button ng-if=\"project.metadata.name | canIAddToProject\" type=\"button\" class=\"btn btn-default hidden-xs\" ng-disabled=\"!secret.data\" ng-click=\"addToApplication()\">\n" +
    "Add to Application\n" +
    "</button>\n" +
    "<button type=\"button\" class=\"dropdown-toggle btn btn-default actions-dropdown-btn hidden-xs\" data-toggle=\"dropdown\" ng-hide=\"!('secrets' | canIDoAny)\">\n" +
    "Actions\n" +
    "<span class=\"caret\"></span>\n" +
    "</button>\n" +
    "\n" +
    "<a href=\"\" ng-if=\"project.metadata.name | canIAddToProject\" class=\"dropdown-toggle actions-dropdown-kebab visible-xs-inline\" data-toggle=\"dropdown\"><i class=\"fa fa-ellipsis-v\" aria-hidden=\"true\"></i><span class=\"sr-only\">Actions</span></a>\n" +
    "<ul class=\"dropdown-menu dropdown-menu-right actions action-button\">\n" +
    "<li ng-if=\"(project.metadata.name | canIAddToProject)\" class=\"visible-xs\">\n" +
    "<a href=\"\" role=\"button\" ng-class=\"{ 'disabled-link': !secret.data }\" ng-attr-aria-disabled=\"{{!secret.data ? 'true' : undefined}}\" ng-click=\"addToApplication()\">Add to Application</a>\n" +
    "</li>\n" +
    "<li ng-if=\"secretsVersion | canI : 'update'\">\n" +
    "<a ng-href=\"{{secret | editYamlURL}}\" role=\"button\">Edit YAML</a>\n" +
    "</li>\n" +
    "<li ng-if=\"secretsVersion | canI : 'delete'\">\n" +
    "<delete-link kind=\"Secret\" resource-name=\"{{secret.metadata.name}}\" project-name=\"{{secret.metadata.namespace}}\" alerts=\"alerts\">\n" +
    "</delete-link>\n" +
    "</li>\n" +
    "</ul>\n" +
    "</div>\n" +
    "{{secret.metadata.name}}\n" +
    "<small class=\"meta\">created <span am-time-ago=\"secret.metadata.creationTimestamp\"></span></small>\n" +
    "</h1>\n" +
    "<labels labels=\"secret.metadata.labels\" clickable=\"true\" kind=\"secrets\" project-name=\"{{secret.metadata.namespace}}\" limit=\"3\"></labels>\n" +
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
    "<small class=\"mar-left-sm\"><a href=\"\" ng-if=\"secret.data\" ng-click=\"view.showSecret = !view.showSecret\">{{view.showSecret ? \"Hide\" : \"Reveal\"}} Secret</a></small>\n" +
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
    "<dd ng-if=\"view.showSecret && !secretData\"><em>No value</em></dd>\n" +
    "<dd ng-if=\"view.showSecret && secretData\">\n" +
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
    "<div ng-if=\"!secret.data\" class=\"empty-state-message text-center\">\n" +
    "<h2>No data.</h2>\n" +
    "<p>This secret has no data.</p>\n" +
    "</div>\n" +
    "<annotations annotations=\"secret.metadata.annotations\"></annotations>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<overlay-panel class=\"overlay-panel-as-modal add-config-to-application\" show-panel=\"addToApplicationVisible\" handle-close=\"closeAddToApplication\">\n" +
    "<add-config-to-application project=\"project\" api-object=\"secret\" on-cancel=\"closeAddToApplication\" on-complete=\"closeAddToApplication\"></add-config-to-application>\n" +
    "</overlay-panel>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/browse/service-instance.html',
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
    "<div ng-if=\"serviceInstance\">\n" +
    "<h1 class=\"contains-actions\">\n" +
    "<div class=\"pull-right dropdown\" ng-hide=\"!('serviceInstances' | canIDoAny)\">\n" +
    "\n" +
    "<button ng-if=\"editAvailable && (serviceInstancesVersion | canI : 'update')\" class=\"btn btn-default hidden-xs\" ng-click=\"showEditDialog()\">\n" +
    "Edit\n" +
    "</button>\n" +
    "\n" +
    "<button type=\"button\" class=\"dropdown-toggle btn btn-default actions-dropdown-btn hidden-xs\" data-toggle=\"dropdown\">\n" +
    "Actions\n" +
    "<span class=\"caret\"></span>\n" +
    "</button>\n" +
    "<a href=\"\" class=\"dropdown-toggle actions-dropdown-kebab visible-xs-inline\" data-toggle=\"dropdown\"><i class=\"fa fa-ellipsis-v\" aria-hidden=\"true\"></i><span class=\"sr-only\">Actions</span></a>\n" +
    "<ul class=\"dropdown-menu dropdown-menu-right actions action-button\">\n" +
    "<li class=\"visible-xs-inline\" ng-if=\"editAvailable && (serviceInstancesVersion  | canI : 'update')\">\n" +
    "<a href=\"\" role=\"button\" ng-click=\"showEditDialog()\">Edit</a>\n" +
    "</li>\n" +
    "<li ng-if=\"serviceInstancesVersion | canI : 'update'\">\n" +
    "<a ng-href=\"{{serviceInstance | editYamlURL}}\" role=\"button\">Edit YAML</a>\n" +
    "</li>\n" +
    "<li ng-if=\"serviceInstancesVersion | canI : 'delete'\">\n" +
    "<a href=\"\" ng-click=\"deprovision()\" ng-attr-aria-disabled=\"{{serviceInstance.metadata.deletionTimestamp ? 'true' : undefined}}\" ng-class=\"{ 'disabled-link': serviceInstance.metadata.deletionTimestamp }\" role=\"button\">Delete</a>\n" +
    "</li>\n" +
    "</ul>\n" +
    "</div>\n" +
    "{{displayName}}\n" +
    "<small class=\"list-row-longname\" ng-if=\"displayName !== serviceInstance.metadata.name\">\n" +
    "{{serviceInstance.metadata.name}}\n" +
    "</small>\n" +
    "<div>\n" +
    "<small class=\"meta\">created <span am-time-ago=\"serviceInstance.metadata.creationTimestamp\"></span></small>\n" +
    "</div>\n" +
    "</h1>\n" +
    "<labels labels=\"serviceInstance.metadata.labels\" clickable=\"true\" kind=\"service-instances\" project-name=\"{{serviceInstance.metadata.namespace}}\" limit=\"3\"></labels>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"middle-content service-instance-details\" persist-tab-state>\n" +
    "<div class=\"container-fluid\">\n" +
    "<div class=\"row\" ng-if=\"serviceInstance\">\n" +
    "<div class=\"col-md-12\">\n" +
    "<div ng-if=\"serviceInstance.metadata.deletionTimestamp\" class=\"alert word-break alert-warning\">\n" +
    "<span class=\"pficon pficon-warning-triangle-o\" aria-hidden=\"true\"></span>\n" +
    "<span class=\"sr-only\">warning</span>\n" +
    "<span class=\"strong\">The service was marked for deletion</span>\n" +
    "<span class=\"strong\" am-time-ago=\"serviceInstance.metadata.deletionTimestamp\"></span>.\n" +
    "</div>\n" +
    "<uib-tabset>\n" +
    "<uib-tab active=\"selectedTab.details\">\n" +
    "<uib-tab-heading>Details</uib-tab-heading>\n" +
    "<div class=\"resource-details\">\n" +
    "<div class=\"row\">\n" +
    "<div class=\"col-lg-6\">\n" +
    "<h3>Status</h3>\n" +
    "<dl class=\"dl-horizontal left\">\n" +
    "<dt>Status:</dt>\n" +
    "<dd>\n" +
    "<status-icon status=\"serviceInstance | serviceInstanceStatus\" disable-animation></status-icon>\n" +
    "<span>{{serviceInstance | serviceInstanceStatus | sentenceCase}}</span>\n" +
    "</dd>\n" +
    "<dt ng-if-start=\"serviceInstance | serviceInstanceConditionMessage\">Status Reason:</dt>\n" +
    "<dd ng-if-end class=\"instance-status-message\">{{serviceInstance | serviceInstanceConditionMessage}}</dd>\n" +
    "</dl>\n" +
    "<div class=\"hidden-lg\">\n" +
    "<h3 ng-if-start=\"serviceClass.spec.description || serviceClass.spec.externalMetadata.longDescription\">Description</h3>\n" +
    "<p class=\"service-description\"><truncate-long-text limit=\"500\" content=\"serviceClass.spec.description\" use-word-boundary=\"true\" expandable=\"true\" linkify=\"true\">\n" +
    "</truncate-long-text></p>\n" +
    "<p ng-if-end class=\"service-description\"><truncate-long-text limit=\"500\" content=\"serviceClass.spec.externalMetadata.longDescription\" use-word-boundary=\"true\" expandable=\"true\" linkify=\"true\">\n" +
    "</truncate-long-text></p>\n" +
    "</div>\n" +
    "<h3>Plan</h3>\n" +
    "<p ng-bind-html=\"plan.spec.description | linkify : '_blank'\"></p>\n" +
    "<div ng-if=\"parameterSchema.properties\" class=\"config-parameters-form\">\n" +
    "<h3>\n" +
    "<span>Configuration</span>\n" +
    "<a ng-if=\"allowParametersReveal\" href=\"\" class=\"hide-show-link\" ng-click=\"toggleShowParameterValues()\" role=\"button\">\n" +
    "{{showParameterValues ? 'Hide Values' : 'Reveal Values'}}\n" +
    "</a>\n" +
    "</h3>\n" +
    "<form name=\"forms.orderConfigureForm\">\n" +
    "<catalog-parameters hide-values=\"!showParameterValues\" opaque-keys=\"opaqueParameterKeys\" model=\"parameterData\" parameter-schema=\"parameterSchema\" parameter-form-definition=\"parameterFormDefinition\" is-horizontal=\"true\" read-only=\"true\">\n" +
    "</catalog-parameters>\n" +
    "</form>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"col-lg-6\">\n" +
    "<div class=\"hidden-xs hidden-sm hidden-md\">\n" +
    "<h3 ng-if-start=\"serviceClass.spec.description || serviceClass.spec.externalMetadata.longDescription\">Description</h3>\n" +
    "<p class=\"service-description\"><truncate-long-text limit=\"500\" content=\"serviceClass.spec.description\" use-word-boundary=\"true\" expandable=\"true\" linkify=\"true\">\n" +
    "</truncate-long-text></p>\n" +
    "<p ng-if-end class=\"service-description\"><truncate-long-text limit=\"500\" content=\"serviceClass.spec.externalMetadata.longDescription\" use-word-boundary=\"true\" expandable=\"true\" linkify=\"true\">\n" +
    "</truncate-long-text></p>\n" +
    "</div>\n" +
    "<service-instance-bindings show-header=\"true\" project=\"project\" bindings=\"bindings\" service-instance=\"serviceInstance\" service-class=\"serviceClass\" service-plan=\"plan\">\n" +
    "</service-instance-bindings>\n" +
    "</div>\n" +
    "</div>\n" +
    "<annotations annotations=\"serviceInstance.metadata.annotations\"></annotations>\n" +
    "</div>\n" +
    "</uib-tab>\n" +
    "<uib-tab active=\"selectedTab.events\" ng-if=\"eventsVersion | canI : 'watch'\">\n" +
    "<uib-tab-heading>Events</uib-tab-heading>\n" +
    "<events api-objects=\"[ serviceInstance ]\" project-context=\"projectContext\" ng-if=\"selectedTab.events\"></events>\n" +
    "</uib-tab>\n" +
    "</uib-tabset>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<overlay-panel show-panel=\"editDialogShown\" handle-close=\"closeEditDialog\">\n" +
    "<update-service service-instance=\"serviceInstance\" project=\"project\" base-project-url=\"project\" service-class=\"serviceClass\" service-plans=\"servicePlans\" handle-close=\"closeEditDialog\">\n" +
    "</update-service>\n" +
    "</overlay-panel>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</project-page>"
  );


  $templateCache.put('views/browse/service.html',
    "<div class=\"middle\">\n" +
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
    "<ul class=\"dropdown-menu dropdown-menu-right actions action-button\">\n" +
    "<li ng-if=\"routesVersion | canI : 'create'\">\n" +
    "<a ng-href=\"project/{{project.metadata.name}}/create-route?service={{service.metadata.name}}\" role=\"button\">Create Route</a>\n" +
    "</li>\n" +
    "<li ng-if=\"servicesVersion | canI : 'update'\">\n" +
    "<a ng-href=\"{{service | editYamlURL}}\" role=\"button\">Edit YAML</a>\n" +
    "</li>\n" +
    "<li ng-if=\"servicesVersion | canI : 'delete'\">\n" +
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
    "<a ng-href=\"project/{{project.metadata.name}}/create-route?service={{service.metadata.name}}\" ng-if=\"routesVersion | canI : 'create'\">Create route</a>\n" +
    "<span ng-if=\"!(routesVersion | canI : 'create')\"><em>None</em></span>\n" +
    "</span>\n" +
    "</dd>\n" +
    "</dl>\n" +
    "<h3>Traffic</h3>\n" +
    "<div>\n" +
    "<traffic-table ports-by-route=\"portsByRoute\" routes=\"routesForService\" services=\"services\" show-node-ports=\"showNodePorts\" custom-name-header=\"'Route'\"></traffic-table>\n" +
    "</div>\n" +
    "<p>\n" +
    "Learn more about <a ng-href=\"{{'routes' | helpLink}}\" target=\"_blank\">routes</a> and <a ng-href=\"{{'services' | helpLink}}\" target=\"_blank\">services</a>.\n" +
    "</p>\n" +
    "<h3>Pods</h3>\n" +
    "<div>\n" +
    "<pods-table pods=\"podsForService\" active-pods=\"podsWithEndpoints\" custom-name-header=\"'Pod'\" pod-failure-reasons=\"podFailureReasons\"></pods-table>\n" +
    "</div>\n" +
    "<annotations annotations=\"service.metadata.annotations\"></annotations>\n" +
    "</div>\n" +
    "</uib-tab>\n" +
    "<uib-tab active=\"selectedTab.events\" ng-if=\"eventsVersion | canI : 'watch'\">\n" +
    "<uib-tab-heading>Events</uib-tab-heading>\n" +
    "<events api-objects=\"[ service ]\" project-context=\"projectContext\" ng-if=\"selectedTab.events\"></events>\n" +
    "</uib-tab>\n" +
    "</uib-tabset>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/browse/stateful-set.html',
    "<div class=\"middle\">\n" +
    "<div class=\"middle-header\">\n" +
    "<div class=\"container-fluid\">\n" +
    "<breadcrumbs breadcrumbs=\"breadcrumbs\"></breadcrumbs>\n" +
    "<alerts alerts=\"alerts\"></alerts>\n" +
    "<div>\n" +
    "<h1>\n" +
    "{{statefulSet.metadata.name}}\n" +
    "<div class=\"pull-right dropdown\" ng-if=\"statefulSet\" ng-show=\"'statefulsets' | canIDoAny\">\n" +
    "<button type=\"button\" class=\"dropdown-toggle btn btn-default actions-dropdown-btn hidden-xs\" data-toggle=\"dropdown\">\n" +
    "Actions\n" +
    "<span class=\"caret\" aria-hidden=\"true\"></span>\n" +
    "</button>\n" +
    "<a href=\"\" class=\"dropdown-toggle actions-dropdown-kebab visible-xs-inline\" data-toggle=\"dropdown\">\n" +
    "<i class=\"fa fa-ellipsis-v\"></i><span class=\"sr-only\">Actions</span>\n" +
    "</a>\n" +
    "<ul class=\"dropdown-menu dropdown-menu-right actions action-button\">\n" +
    "<li ng-if=\"statefulSetsVersion | canI : 'update'\">\n" +
    "<a ng-href=\"{{statefulSet | editYamlURL}}\" role=\"button\">Edit YAML</a>\n" +
    "</li>\n" +
    "<li ng-if=\"statefulSetsVersion | canI : 'delete'\">\n" +
    "<delete-link kind=\"StatefulSet\" group=\"apps\" resource-name=\"{{statefulSet.metadata.name}}\" project-name=\"{{statefulSet.metadata.namespace}}\" alerts=\"alerts\">\n" +
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
    "<div class=\"row resource-details\" ng-if=\"loaded && statefulSet\">\n" +
    "<div class=\"col-md-12\">\n" +
    "<uib-tabset>\n" +
    "<uib-tab active=\"selectedTab.details\">\n" +
    "<uib-tab-heading>Details</uib-tab-heading>\n" +
    "<div class=\"row\" style=\"max-width: 650px\">\n" +
    "<div class=\"col-sm-4 col-sm-push-8 browse-deployment-donut\">\n" +
    "\n" +
    "<deployment-donut rc=\"statefulSet\" pods=\"podsForStatefulSet\" scalable=\"isScalable()\" quotas=\"quotas\" cluster-quotas=\"clusterQuotas\">\n" +
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
    "</div>\n" +
    "</div>\n" +
    "<div class=\"row\">\n" +
    "<div class=\"col-md-12\">\n" +
    "<h3>Template</h3>\n" +
    "<pod-template pod-template=\"statefulSet.spec.template\" detailed=\"true\">\n" +
    "</pod-template>\n" +
    "<volume-claim-templates templates=\"statefulSet.spec.volumeClaimTemplates\" namespace=\"project.metadata.name\">\n" +
    "</volume-claim-templates>\n" +
    "<h3>Volumes</h3>\n" +
    "<p ng-if=\"!statefulSet.spec.template.spec.volumes.length\">\n" +
    "none\n" +
    "</p>\n" +
    "<volumes volumes=\"statefulSet.spec.template.spec.volumes\" namespace=\"project.metadata.name\">\n" +
    "</volumes>\n" +
    "<h3>Pods</h3>\n" +
    "<pods-table pods=\"podsForStatefulSet\"></pods-table>\n" +
    "<resource-service-bindings project=\"project\" project-context=\"projectContext\" api-object=\"statefulSet\">\n" +
    "</resource-service-bindings>\n" +
    "<annotations annotations=\"statefulSet.metadata.annotations\"></annotations>\n" +
    "</div>\n" +
    "</div>\n" +
    "</uib-tab>\n" +
    "<uib-tab active=\"selectedTab.environment\" ng-if=\"statefulSet\">\n" +
    "<uib-tab-heading>Environment</uib-tab-heading>\n" +
    "<div class=\"resource-environment\">\n" +
    "<edit-environment-variables api-object=\"statefulSet\"></edit-environment-variables>\n" +
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
    "<events api-objects=\"[ statefulSet ]\" project-context=\"projectContext\" ng-if=\"selectedTab.events\"></events>\n" +
    "</div>\n" +
    "</uib-tab>\n" +
    "</uib-tabset>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/browse/stateful-sets.html',
    "<div class=\"middle\">\n" +
    "<div class=\"middle-header header-toolbar\">\n" +
    "<div class=\"container-fluid\">\n" +
    "<div class=\"page-header page-header-bleed-right page-header-bleed-left\">\n" +
    "<h1>\n" +
    "Stateful Sets\n" +
    "\n" +
    "</h1>\n" +
    "</div>\n" +
    "<div ng-if=\"((statefulSets | hashSize) > 0) || filterWithZeroResults\" class=\"data-toolbar\">\n" +
    "<div class=\"data-toolbar-filter\">\n" +
    "<project-filter></project-filter>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"middle-content\" persist-tab-state>\n" +
    "<div class=\"container-fluid\">\n" +
    "<div class=\"row\" ng-if=\"loaded\">\n" +
    "<div class=\"col-md-12\">\n" +
    "<div ng-if=\"(statefulSets | hashSize) == 0\">\n" +
    "<p ng-if=\"!loaded\">\n" +
    "Loading...\n" +
    "</p>\n" +
    "<div ng-if=\"loaded\" class=\"empty-state-message text-center\">\n" +
    "<div ng-if=\"!filterWithZeroResults\">\n" +
    "<h2>No stateful sets.</h2>\n" +
    "<p>No stateful sets have been added to project {{projectName}}.</p>\n" +
    "</div>\n" +
    "<div ng-if=\"filterWithZeroResults\">\n" +
    "<h2>The filter is hiding all stateful sets. <button type=\"button\" class=\"btn btn-link inline-btn-link\" ng-click=\"clearFilter()\">Clear All Filters</button></h2>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<table ng-if=\"(statefulSets | hashSize) > 0\" class=\"table table-bordered table-mobile table-layout-fixed\">\n" +
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
    "</div>"
  );


  $templateCache.put('views/builds.html',
    "<div class=\"middle\">\n" +
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
    "<div ng-if=\"(((latestByConfig | hashSize) || (buildsNoConfig | hashSize)) || filterWithZeroResults)\" class=\"data-toolbar\">\n" +
    "<div class=\"data-toolbar-filter\">\n" +
    "<project-filter></project-filter>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"middle-content\">\n" +
    "<div class=\"container-fluid\">\n" +
    "<div class=\"row\">\n" +
    "<div class=\"col-md-12\">\n" +
    "<div ng-if=\"!(latestByConfig | hashSize) && !(buildsNoConfig | hashSize)\">\n" +
    "<p ng-if=\"!buildsLoaded\">\n" +
    "Loading...\n" +
    "</p>\n" +
    "<div ng-if=\"buildsLoaded\" class=\"empty-state-message text-center\">\n" +
    "<div ng-if=\"!filterWithZeroResults\">\n" +
    "<h2>No builds.</h2>\n" +
    "<p>No builds have been added to project {{projectName}}.</p>\n" +
    "</div>\n" +
    "<div ng-if=\"filterWithZeroResults\">\n" +
    "<h2>The filter is hiding all builds. <button type=\"button\" class=\"btn btn-link inline-btn-link\" ng-click=\"clearFilter()\">Clear All Filters</button></h2>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<table class=\"table table-bordered table-mobile table-layout-fixed\" ng-if=\"(latestByConfig | hashSize) || (buildsNoConfig | hashSize)\">\n" +
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
    "<tbody>\n" +
    "<tr ng-repeat=\"(buildConfigName, latestBuild) in latestByConfig\" ng-if=\"buildConfigName !== ''\">\n" +
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
    "<span ng-if=\"source = buildConfigs[buildConfigName].spec.source\">\n" +
    "<span ng-switch=\"source.type\">\n" +
    "<span ng-switch-when=\"None\">\n" +
    "<i>None</i>\n" +
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
    "<span ng-if=\"buildConfigs && buildConfigName && !buildConfigs[buildConfigName]\" class=\"pficon pficon-warning-triangle-o\" data-toggle=\"tooltip\" title=\"This build config no longer exists\" style=\"cursor: help\"></span>\n" +
    "</td>\n" +
    "<td data-title=\"Last Build\">\n" +
    "\n" +
    "<span ng-if=\"(latestBuild | annotation : 'buildNumber') && buildConfigName\">\n" +
    "<a ng-href=\"{{latestBuild | navigateResourceURL}}\">#{{latestBuild | annotation : 'buildNumber'}}</a>\n" +
    "</span>\n" +
    "<span ng-if=\"!(latestBuild | annotation : 'buildNumber') && buildConfigName\">\n" +
    "<a ng-href=\"{{latestBuild | navigateResourceURL}}\">{{latestBuild.metadata.name}}</a>\n" +
    "</span>\n" +
    "</td>\n" +
    "<td data-title=\"Status\">\n" +
    "<div class=\"status\">\n" +
    "<status-icon status=\"latestBuild.status.phase\" disable-animation></status-icon>\n" +
    "<span class=\"status-detail\">\n" +
    "<span ng-if=\"!latestBuild.status.reason || latestBuild.status.phase === 'Cancelled'\">{{latestBuild.status.phase}}</span>\n" +
    "<span ng-if=\"latestBuild.status.reason && latestBuild.status.phase !== 'Cancelled'\">{{latestBuild.status.reason | sentenceCase}}</span>\n" +
    "</span>\n" +
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
    "\n" +
    "<tr ng-repeat=\"latestBuild in buildsNoConfig track by (latestBuild | uid)\">\n" +
    "<td data-title=\"Name\">\n" +
    "<em>none</em>\n" +
    "</td>\n" +
    "<td data-title=\"Last Build\">\n" +
    "\n" +
    "<a ng-href=\"{{latestBuild | navigateResourceURL}}\">{{latestBuild.metadata.name}}</a>\n" +
    "</td>\n" +
    "<td data-title=\"Status\">\n" +
    "<div class=\"status\">\n" +
    "<status-icon status=\"latestBuild.status.phase\" disable-animation></status-icon>\n" +
    "<span class=\"status-detail\">\n" +
    "<span ng-if=\"!latestBuild.status.reason || latestBuild.status.phase === 'Cancelled'\">{{latestBuild.status.phase}}</span>\n" +
    "<span ng-if=\"latestBuild.status.reason && latestBuild.status.phase !== 'Cancelled'\">{{latestBuild.status.reason | sentenceCase}}</span>\n" +
    "</span>\n" +
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
    "<td data-title=\"Source\" class=\"hidden-sm\">\n" +
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
    "</div>"
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
    "<form role=\"form\" class=\"filter-catalog search-pf has-button\">\n" +
    "<div class=\"form-group has-clear\">\n" +
    "\n" +
    "<div class=\"search-pf-input-group\">\n" +
    "<label for=\"search\" class=\"sr-only\">Filter by name or description</label>\n" +
    "<input ng-model=\"filter.keyword\" type=\"search\" id=\"search\" placeholder=\"Filter by name or description\" class=\"search-input form-control\" autocorrect=\"off\" autocapitalize=\"none\" spellcheck=\"false\">\n" +
    "<button type=\"button\" class=\"clear\" aria-hidden=\"true\" ng-if=\"filter.keyword\" ng-click=\"filter.keyword = ''\">\n" +
    "<span class=\"pficon pficon-close\"></span>\n" +
    "</button>\n" +
    "</div>\n" +
    "</div>\n" +
    "</form>\n" +
    "<div ng-if=\"allContentHidden\" class=\"empty-state-message text-center h2\">\n" +
    "All content is hidden by the current filter.\n" +
    "<button type=\"button\" class=\"btn btn-link inline-btn-link\" ng-click=\"filter.keyword = ''\">Clear All Filters</button>\n" +
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
    "<form role=\"form\" class=\"filter-catalog search-pf has-button mar-bottom-xl\">\n" +
    "<div class=\"form-group has-clear\">\n" +
    "\n" +
    "<div class=\"search-pf-input-group\">\n" +
    "<label for=\"search\" class=\"sr-only\">Filter by name or description</label>\n" +
    "<input ng-model=\"filter.keyword\" type=\"search\" id=\"search\" placeholder=\"Filter by name or description\" class=\"search-input form-control\" autocorrect=\"off\" autocapitalize=\"none\" spellcheck=\"false\">\n" +
    "<button type=\"button\" class=\"clear\" aria-hidden=\"true\" ng-if=\"filter.keyword\" ng-click=\"filter.keyword = ''\">\n" +
    "<span class=\"pficon pficon-close\"></span>\n" +
    "</button>\n" +
    "</div>\n" +
    "</div>\n" +
    "</form>\n" +
    "<div ng-if=\"!filteredBuilderImages.length && !filteredTemplates.length && loaded\" class=\"empty-state-message text-center h2\">\n" +
    "All content is hidden by the current filter.\n" +
    "<button type=\"button\" class=\"btn btn-link inline-btn-link\" ng-click=\"filter.keyword = ''\">Clear All Filters</button>\n" +
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
    "<div class=\"middle surface-shaded\">\n" +
    "<div class=\"middle-content\">\n" +
    "<div class=\"container gutter-top\">\n" +
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
    "After downloading and installing it, you can start by logging in. You are currently logged into this console as <strong>{{user.metadata.name}}</strong>. If you want to log into the CLI using the same session token:\n" +
    "<copy-to-clipboard ng-if=\"sessionToken\" display-wide=\"true\" clipboard-text=\"'oc login ' + loginBaseURL + ' --token=' + sessionToken\" input-text=\"'oc login ' + loginBaseURL + ' --token=<hidden>'\"></copy-to-clipboard>\n" +
    "<copy-to-clipboard ng-if=\"!sessionToken\" display-wide=\"true\" clipboard-text=\"'oc login ' + loginBaseURL\"></copy-to-clipboard>\n" +
    "</p>\n" +
    "<div ng-if=\"sessionToken\" class=\"alert alert-warning\">\n" +
    "<span class=\"pficon pficon-warning-triangle-o\" aria-hidden=\"true\"></span>\n" +
    "<strong>A token is a form of a password.</strong>\n" +
    "Do not share your API token. To reveal your token, press the copy to clipboard button and then paste the clipboard contents.\n" +
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
    "</div>"
  );


  $templateCache.put('views/create-config-map.html',
    "<div class=\"middle surface-shaded\">\n" +
    "<div class=\"middle-content\">\n" +
    "<div class=\"container-fluid\">\n" +
    "<div class=\"row\">\n" +
    "<div class=\"col-md-10\">\n" +
    "<breadcrumbs breadcrumbs=\"breadcrumbs\"></breadcrumbs>\n" +
    "<div class=\"mar-top-xl\">\n" +
    "<h1>Create Config Map</h1>\n" +
    "<div class=\"help-block\">\n" +
    "Config maps hold key-value pairs that can be used in pods to read application configuration.\n" +
    "</div>\n" +
    "<form name=\"createConfigMapForm\" class=\"mar-top-xl\">\n" +
    "<fieldset ng-disabled=\"disableInputs\">\n" +
    "<edit-config-map-or-secret model=\"configMap\" type=\"config-map\" show-name-input=\"true\"></edit-config-map-or-secret>\n" +
    "<div class=\"button-group gutter-top gutter-bottom\">\n" +
    "<button type=\"submit\" class=\"btn btn-primary btn-lg\" ng-click=\"createConfigMap()\" ng-disabled=\"createConfigMapForm.$invalid || disableInputs\" value=\"\">Create</button>\n" +
    "<a class=\"btn btn-default btn-lg\" href=\"\" ng-click=\"cancel()\" role=\"button\">Cancel</a>\n" +
    "</div>\n" +
    "</fieldset>\n" +
    "</form>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/create-from-url.html',
    "<div class=\"middle surface-shaded\">\n" +
    "<div class=\"middle-content\">\n" +
    "<div class=\"container gutter-top\">\n" +
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
    "<create-project alerts=\"alerts\" redirect-action=\"createWithProject\"></create-project>\n" +
    "</div>\n" +
    "<div ng-if=\"!noProjects && !canCreateProject\">\n" +
    "<h2>Choose a Project</h2>\n" +
    "<form name=\"forms.selectProjectForm\">\n" +
    "<div class=\"form-group\" ng-class=\"{'has-error': forms.selectProjectForm.selectProject.$error.cannotAddToProject}\">\n" +
    "<ui-select ng-model=\"selected.project\" name=\"selectProject\" on-select=\"canIAddToSelectedProject($item)\">\n" +
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
    "<div ng-if=\"forms.selectProjectForm.selectProject.$error.cannotAddToProject\">\n" +
    "<span class=\"help-block\">\n" +
    "You are not authorized to add to this project.\n" +
    "</span>\n" +
    "</div>\n" +
    "<div class=\"button-group mar-bottom-lg mar-top-lg\">\n" +
    "<button type=\"submit\" class=\"btn btn-primary\" ng-click=\"createWithProject()\" ng-disabled=\"!(selected.project) || !canIAddToProject\" value=\"\">Next</button>\n" +
    "<a class=\"btn btn-default\" href=\"#\" back>Cancel</a>\n" +
    "</div>\n" +
    "</div>\n" +
    "</form>\n" +
    "</div>\n" +
    "<div ng-if=\"!noProjects && canCreateProject\">\n" +
    "<uib-tabset>\n" +
    "<uib-tab>\n" +
    "<uib-tab-heading>Choose Existing Project</uib-tab-heading>\n" +
    "<form name=\"forms.selectProjectForm\">\n" +
    "<div class=\"form-group\" ng-class=\"{'has-error': forms.selectProjectForm.selectProject.$error.cannotAddToProject}\">\n" +
    "<ui-select ng-model=\"selected.project\" name=\"selectProject\" on-select=\"canIAddToSelectedProject($item)\">\n" +
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
    "<div ng-if=\"forms.selectProjectForm.selectProject.$error.cannotAddToProject\">\n" +
    "<span class=\"help-block\">\n" +
    "You are not authorized to add to this project.\n" +
    "</span>\n" +
    "</div>\n" +
    "<div class=\"button-group mar-bottom-lg mar-top-lg\">\n" +
    "<button type=\"submit\" class=\"btn btn-primary\" ng-click=\"createWithProject()\" ng-disabled=\"!(selected.project) || !canIAddToProject\" value=\"\">Next</button>\n" +
    "<a class=\"btn btn-default\" href=\"#\" back>Cancel</a>\n" +
    "</div>\n" +
    "</div>\n" +
    "</form>\n" +
    "</uib-tab>\n" +
    "<uib-tab>\n" +
    "<uib-tab-heading>Create a New Project</uib-tab-heading>\n" +
    "<create-project alerts=\"alerts\" redirect-action=\"createWithProject\"></create-project>\n" +
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
    "</div>"
  );


  $templateCache.put('views/create-persistent-volume-claim.html',
    "<div class=\"middle surface-shaded\">\n" +
    "<div class=\"middle-content\">\n" +
    "<div class=\"container-fluid\">\n" +
    "<div class=\"row\">\n" +
    "<div class=\"col-md-10\">\n" +
    "<breadcrumbs breadcrumbs=\"breadcrumbs\"></breadcrumbs>\n" +
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
    "<a class=\"btn btn-default btn-lg\" href=\"\" ng-click=\"cancel()\" role=\"button\">Cancel</a>\n" +
    "</div>\n" +
    "</fieldset>\n" +
    "</form>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/create-project.html',
    "<div class=\"middle surface-shaded\">\n" +
    "<div class=\"middle-content\">\n" +
    "<div class=\"container gutter-top\">\n" +
    "<div class=\"col-md-12\">\n" +
    "<h1>Create Project</h1>\n" +
    "<create-project redirect-action=\"onProjectCreated\"></create-project>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/create-route.html',
    "<div class=\"middle surface-shaded\">\n" +
    "<div class=\"middle-content\">\n" +
    "<div class=\"container-fluid\">\n" +
    "<div class=\"row\">\n" +
    "<div class=\"col-md-10\">\n" +
    "<breadcrumbs breadcrumbs=\"breadcrumbs\"></breadcrumbs>\n" +
    "<div class=\"mar-top-xl\">\n" +
    "<h1>Create Route</h1>\n" +
    "<div class=\"help-block\">\n" +
    "Routing is a way to make your application publicly visible.\n" +
    "</div>\n" +
    "<form name=\"createRouteForm\" class=\"mar-top-xl osc-form\" novalidate>\n" +
    "<div ng-if=\"!services\">Loading...</div>\n" +
    "<div ng-if=\"services\">\n" +
    "<fieldset ng-disabled=\"disableInputs\">\n" +
    "<osc-routing model=\"routing\" services=\"services\" show-name-input=\"true\">\n" +
    "</osc-routing>\n" +
    "<label-editor labels=\"labels\" expand=\"true\" can-toggle=\"false\" help-text=\"Labels for this route.\">\n" +
    "</label-editor>\n" +
    "<div class=\"button-group gutter-top gutter-bottom\">\n" +
    "<button type=\"submit\" class=\"btn btn-primary btn-lg\" ng-click=\"createRoute()\" ng-disabled=\"createRouteForm.$invalid || disableInputs || !createRoute\" value=\"\">Create</button>\n" +
    "<a class=\"btn btn-default btn-lg\" href=\"\" ng-click=\"cancel()\">Cancel</a>\n" +
    "</div>\n" +
    "</fieldset>\n" +
    "</div>\n" +
    "</form>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/create-secret.html',
    "<div class=\"middle surface-shaded\">\n" +
    "<div class=\"middle-content\">\n" +
    "<div class=\"container-fluid\">\n" +
    "<div class=\"row\">\n" +
    "<div class=\"col-md-10\">\n" +
    "<div ng-if=\"!project\" class=\"mar-top-md\">Loading...</div>\n" +
    "<div ng-if=\"project\">\n" +
    "<breadcrumbs breadcrumbs=\"breadcrumbs\"></breadcrumbs>\n" +
    "<alerts alerts=\"alerts\"></alerts>\n" +
    "<div class=\"mar-top-xl\">\n" +
    "<h1>Create Secret</h1>\n" +
    "<div class=\"help-block\">\n" +
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
    "</div>"
  );


  $templateCache.put('views/create.html',
    "<div class=\"add-to-project middle surface-shaded\">\n" +
    "<div class=\"middle-content\" persist-tab-state>\n" +
    "<div class=\"container-fluid\">\n" +
    "<alerts alerts=\"alerts\" class=\"mar-top-md\"></alerts>\n" +
    "<div class=\"row\">\n" +
    "<div class=\"col-md-12\">\n" +
    "<uib-tabset class=\"mar-top-md\" ng-if=\"project\">\n" +
    "<uib-tab active=\"selectedTab.fromCatalog\">\n" +
    "<uib-tab-heading>Browse Catalog</uib-tab-heading>\n" +
    "<catalog project-name=\"projectName\" project-image-streams=\"projectImageStreams\" openshift-image-streams=\"openshiftImageStreams\" project-templates=\"projectTemplates\" openshift-templates=\"openshiftTemplates\">\n" +
    "</catalog>\n" +
    "</uib-tab>\n" +
    "<uib-tab active=\"selectedTab.deployImage\">\n" +
    "<uib-tab-heading>Deploy Image</uib-tab-heading>\n" +
    "<form>\n" +
    "<deploy-image ng-if=\"project\" project=\"project\"></deploy-image>\n" +
    "</form>\n" +
    "</uib-tab>\n" +
    "<uib-tab active=\"selectedTab.fromFile\">\n" +
    "<uib-tab-heading>Import YAML / JSON</uib-tab-heading>\n" +
    "<from-file ng-if=\"project\" project=\"project\"></from-file>\n" +
    "</uib-tab>\n" +
    "</uib-tabset>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/create/category.html',
    "<div class=\"middle surface-shaded\">\n" +
    "<div class=\"middle-content\">\n" +
    "<div class=\"container-fluid\">\n" +
    "<breadcrumbs breadcrumbs=\"breadcrumbs\"></breadcrumbs>\n" +
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
    "</div>"
  );


  $templateCache.put('views/create/fromimage.html',
    "<div class=\"middle surface-shaded\">\n" +
    "<div class=\"middle-content\">\n" +
    "<div class=\"container-fluid\">\n" +
    "<div class=\"row\">\n" +
    "<div class=\"col-md-12\">\n" +
    "<div ng-hide=\"imageStream\" class=\"mar-top-lg\">\n" +
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
    "<label for=\"appname\" class=\"required\">Name</label>\n" +
    "\n" +
    "<div ng-class=\"{'has-error': (form.appname.$error.required && form.appname.$dirty) || (form.appname.$invalid && shouldValidateName) || nameTaken}\">\n" +
    "<input type=\"text\" required take-focus minlength=\"2\" maxlength=\"24\" pattern=\"[a-z]([-a-z0-9]*[a-z0-9])?\" ng-model=\"name\" id=\"appname\" name=\"appname\" ng-change=\"nameTaken = false\" ng-blur=\"shouldValidateName = form.appname.$dirty\" class=\"form-control\" autocorrect=\"off\" autocapitalize=\"none\" spellcheck=\"false\">\n" +
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
    "                          'col-md-8': advancedOptions || advancedSourceOptions,\n" +
    "                          'col-lg-12': !advancedOptions && !advancedSourceOptions\n" +
    "                        }\">\n" +
    "<div class=\"form-group\">\n" +
    "<label for=\"sourceUrl\" class=\"required\">Git Repository URL</label>\n" +
    "<div ng-class=\"{\n" +
    "                              'has-warning': buildConfig.sourceUrl && form.sourceUrl.$touched && !sourceURLPattern.test(buildConfig.sourceUrl),\n" +
    "                              'has-error': (form.sourceUrl.$error.required && form.sourceUrl.$dirty)\n" +
    "                            }\">\n" +
    "\n" +
    "<input class=\"form-control\" id=\"sourceUrl\" name=\"sourceUrl\" type=\"text\" required aria-describedby=\"from_source_help\" ng-model=\"buildConfig.sourceUrl\" autocorrect=\"off\" autocapitalize=\"none\" spellcheck=\"false\">\n" +
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
    "<input id=\"gitref\" ng-model=\"buildConfig.gitRef\" type=\"text\" placeholder=\"master\" autocorrect=\"off\" autocapitalize=\"none\" spellcheck=\"false\" class=\"form-control\">\n" +
    "</div>\n" +
    "<div class=\"help-block\">Optional branch, tag, or commit.</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "\n" +
    "<div ng-show=\"advancedOptions || advancedSourceOptions\" class=\"form-group\">\n" +
    "<label for=\"contextdir\">Context Dir</label>\n" +
    "<div>\n" +
    "<input id=\"contextdir\" ng-model=\"buildConfig.contextDir\" type=\"text\" placeholder=\"/\" autocorrect=\"off\" autocapitalize=\"none\" spellcheck=\"false\" class=\"form-control\">\n" +
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
    "                            your source, the base builder image, and when to launch new builds.\" expand=\"true\" can-toggle=\"false\">\n" +
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
    "<key-value-editor entries=\"buildConfigEnvVars\" key-placeholder=\"name\" value-placeholder=\"value\" value-from-selector-options=\"valueFromObjects\" key-validator=\"[a-zA-Z_][a-zA-Z0-9_]*\" key-validator-error-tooltip=\"A valid environment variable name is an alphanumeric (a-z and 0-9) string beginning with a letter that may contain underscores.\" add-row-link=\"Add Value\" add-row-with-selectors-link=\"Add Value from Config Map or Secret\"></key-value-editor>\n" +
    "</osc-form-section>\n" +
    "\n" +
    "<osc-form-section header=\"Deployment Configuration\" about-title=\"Deployment Configuration\" about=\"Deployment configurations describe how your application is configured\n" +
    "                            by the cluster and under what conditions it should be recreated (e.g. when the image changes).\" expand=\"true\" can-toggle=\"false\">\n" +
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
    "<key-value-editor entries=\"DCEnvVarsFromUser\" key-placeholder=\"name\" value-placeholder=\"value\" value-from-selector-options=\"valueFromObjects\" key-validator=\"[a-zA-Z_][a-zA-Z0-9_]*\" key-validator-error-tooltip=\"A valid environment variable name is an alphanumeric (a-z and 0-9) string beginning with a letter that may contain underscores.\" add-row-link=\"Add Value\" add-row-with-selectors-link=\"Add Value from Config Map or Secret\"></key-value-editor>\n" +
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
    "<div ng-if=\"!scaling.autoscale\" class=\"form-group\" ng-class=\"{ 'has-error': form.replicas.$dirty && form.replicas.$invalid }\">\n" +
    "<label class=\"number\">Replicas</label>\n" +
    "<input type=\"number\" class=\"form-control\" min=\"0\" name=\"replicas\" ng-model=\"scaling.replicas\" ng-required=\"!scaling.autoscale\" ng-disabled=\"scaling.autoscale\" pattern=\"\\d*\" select-on-focus aria-describedby=\"replicas-help\">\n" +
    "<div id=\"replicas-help\">\n" +
    "<span class=\"help-block\">The number of instances of your image.</span>\n" +
    "</div>\n" +
    "<div class=\"has-error\" ng-show=\"form.replicas.$dirty && form.replicas.$invalid\">\n" +
    "<span class=\"help-block\">Replicas must be an integer value greater than or equal to 0.</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "<osc-autoscaling ng-if=\"scaling.autoscale\" model=\"scaling\"></osc-autoscaling>\n" +
    "<div class=\"has-warning\" ng-if=\"showCPURequestWarning\">\n" +
    "<span class=\"help-block\">\n" +
    "You should configure resource limits below for autoscaling. Autoscaling will not work without a CPU request.\n" +
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
    "<label-editor labels=\"labelArray\" expand=\"true\" can-toggle=\"false\" help-text=\"Each label is applied to each created resource.\">\n" +
    "</label-editor>\n" +
    "</div>\n" +
    "<div class=\"mar-top-md\">\n" +
    "<span ng-if=\"!advancedOptions\">Show</span>\n" +
    "<span ng-if=\"advancedOptions\">Hide</span>\n" +
    "<a href=\"\" ng-click=\"advancedOptions = !advancedOptions\" role=\"button\">advanced options</a>\n" +
    "for source, routes, builds, and deployments.\n" +
    "</div>\n" +
    "<div class=\"buttons gutter-bottom\" ng-class=\"{'gutter-top': !alerts.length}\">\n" +
    "<button type=\"submit\" class=\"btn btn-primary btn-lg\" ng-disabled=\"form.$invalid || nameTaken || cpuProblems.length || memoryProblems.length || disableInputs\">Create</button>\n" +
    "<a class=\"btn btn-default btn-lg\" href=\"\" ng-click=\"cancel()\" role=\"button\">Cancel</a>\n" +
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
    "</div>"
  );


  $templateCache.put('views/create/next-steps.html',
    "<div class=\"middle surface-shaded\">\n" +
    "<div class=\"middle-content\">\n" +
    "<div class=\"container-fluid next-steps pad-top-xl\">\n" +
    "<next-steps project=\"project\" project-name=\"projectName\" login-base-url=\"loginBaseUrl\" from-sample-repo=\"fromSampleRepo\" created-build-config=\"createdBuildConfig\" name=\"name\"></next-steps>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/deployments.html',
    "<div class=\"middle\">\n" +
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
    "<div ng-if=\"!showEmptyState || filterWithZeroResults\" class=\"data-toolbar\">\n" +
    "<div class=\"data-toolbar-filter\">\n" +
    "<project-filter></project-filter>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"middle-content\">\n" +
    "<div class=\"container-fluid\">\n" +
    "<div class=\"row\">\n" +
    "<div class=\"col-md-12\">\n" +
    "<p ng-if=\"!deploymentConfigsLoaded\">\n" +
    "Loading...\n" +
    "</p>\n" +
    "<div ng-if=\"(showEmptyState || filterWithZeroResults) && deploymentConfigsLoaded\">\n" +
    "<div class=\"empty-state-message text-center\">\n" +
    "<div ng-if=\"showEmptyState\">\n" +
    "<h2>No deployments.</h2>\n" +
    "<p>No deployments have been added to project {{projectName}}.</p>\n" +
    "</div>\n" +
    "<div ng-if=\"filterWithZeroResults\">\n" +
    "<h2>The filter is hiding all deployments. <button type=\"button\" class=\"btn btn-link inline-btn-link\" ng-click=\"clearFilter()\">Clear All Filters</button></h2>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"!filterWithZeroResults\">\n" +
    "<h3 ng-if=\"showDeploymentConfigTable() && ((deployments | size) || (replicaSets | size) || (replicationControllersByDC[''] | size))\">Deployment Configs</h3>\n" +
    "<table ng-if=\"showDeploymentConfigTable() && !showEmptyState\" class=\"table table-bordered table-mobile table-layout-fixed\">\n" +
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
    "<tbody>\n" +
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
    "<div class=\"status\">\n" +
    "<status-icon status=\"replicationController | deploymentStatus\" disable-animation></status-icon>\n" +
    "<span class=\"status-detail\">\n" +
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
    "<div ng-if=\"(deployments | size)\">\n" +
    "<h3>Deployments</h3>\n" +
    "<table class=\"table table-bordered table-mobile table-layout-fixed\">\n" +
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
    "<span ng-if=\"latestReplicaSetByDeploymentUID[deployment.metadata.uid]\">\n" +
    "<a ng-href=\"{{latestReplicaSetByDeploymentUID[deployment.metadata.uid] | navigateResourceURL}}\">{{deployment | lastDeploymentRevision}}</a>\n" +
    "</span>\n" +
    "<span ng-if=\"!latestReplicaSetByDeploymentUID[deployment.metadata.uid]\">\n" +
    "{{deployment | lastDeploymentRevision}}\n" +
    "</span>\n" +
    "</td>\n" +
    "<td data-title=\"Replicas\">\n" +
    "<span ng-if=\"!(deployment.status.replicas | isNil) && deployment.status.replicas !== deployment.spec.replicas\">{{deployment.status.replicas}}/</span>{{deployment.spec.replicas}} replica<span ng-if=\"deployment.spec.replicas != 1\">s</span>\n" +
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
    "<div ng-if=\"(replicaSets | size)\" id=\"replica-sets\">\n" +
    "<h3>Replica Sets</h3>\n" +
    "<table class=\"table table-bordered table-mobile table-layout-fixed\">\n" +
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
    "<div ng-if=\"(replicationControllersByDC[''] | size)\" id=\"replica-controllers\">\n" +
    "<h3>Other Replication Controllers</h3>\n" +
    "<table class=\"table table-bordered table-mobile table-layout-fixed\">\n" +
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
    "<tbody>\n" +
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
    "</div>"
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
    "<span class=\"component-label\">\n" +
    "Pipeline\n" +
    "</span>\n" +
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
    "<div class=\"build-pipeline\">\n" +
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
    "<div class=\"pipeline-stage-column\">\n" +
    "<div title=\"{{stage.name}}\" class=\"pipeline-stage-name\" ng-class=\"build.status.phase\">\n" +
    "{{stage.name}}\n" +
    "</div>\n" +
    "<pipeline-status ng-if=\"stage.status\" status=\"stage.status\"></pipeline-status>\n" +
    "<div class=\"pipeline-actions\" ng-if=\"stage | pipelineStagePendingInput\">\n" +
    "<a ng-href=\"{{build | jenkinsInputURL}}\" target=\"_blank\">Input Required</a>\n" +
    "</div>\n" +
    "<div class=\"pipeline-time\" ng-class=\"stage.status\" ng-if=\"!stage.durationMillis && !(stage | pipelineStagePendingInput)\">not started</div>\n" +
    "<div class=\"pipeline-time\" ng-class=\"stage.status\" ng-if=\"stage.startTimeMillis && !(stage | pipelineStagePendingInput) && !(stage | pipelineStageComplete)\"><time-only-duration-until-now timestamp=\"stage.startTimeMillis\"></time-only-duration-until-now></div>\n" +
    "<div class=\"pipeline-time\" ng-class=\"stage.status\" ng-if=\"stage.durationMillis && (stage | pipelineStageComplete)\">{{stage.durationMillis | timeOnlyDuration}}</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/directives/_build-pipeline-links.html',
    "<div ng-if=\"(build | buildLogURL) && (buildLogsVersion | canI : 'get')\" class=\"pipeline-link\"><a ng-href=\"{{build | buildLogURL}}\" target=\"_blank\">View Log</a></div>"
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
    "<a ng-show=\"!inputText\" data-clipboard-target=\"#{{id}}\" href=\"\" ng-disabled=\"isDisabled\" data-toggle=\"tooltip\" data-placement=\"left\" data-container=\".middle\" title=\"Copy to Clipboard\" role=\"button\" class=\"btn btn-default\">\n" +
    "<i class=\"fa fa-clipboard\" aria-hidden=\"true\"></i>\n" +
    "<span class=\"sr-only\">Copy to Clipboard</span>\n" +
    "</a>\n" +
    "<a ng-show=\"inputText\" data-clipboard-text=\"{{clipboardText}}\" href=\"\" ng-disabled=\"isDisabled\" data-toggle=\"tooltip\" data-placement=\"left\" data-container=\".middle\" title=\"Copy to Clipboard\" role=\"button\" class=\"btn btn-default\">\n" +
    "<i class=\"fa fa-clipboard\" aria-hidden=\"true\"></i>\n" +
    "<span class=\"sr-only\">Copy to Clipboard</span>\n" +
    "</a>\n" +
    "</span>\n" +
    "</div>"
  );


  $templateCache.put('views/directives/_custom-icon.html',
    "<img ng-if=\"image\" alt=\"\" ng-src=\"{{image}}\">\n" +
    "<span ng-if=\"!image\" aria-hidden=\"true\" ng-class=\"icon | normalizeIconClass\"></span>"
  );


  $templateCache.put('views/directives/_edit-command.html',
    "<ng-form name=\"form\">\n" +
    "<div ng-hide=\"input.args.length\"><em>No {{type || 'command'}} set.</em></div>\n" +
    "<div ng-show=\"input.args.length\" as-sortable ng-model=\"input.args\" class=\"command-args has-sort\">\n" +
    "<div class=\"row form-row-has-controls\" ng-repeat=\"arg in input.args\" as-sortable-item>\n" +
    "<div class=\"form-group col-xs-12\">\n" +
    "<input type=\"text\" ng-model=\"arg.value\" ng-if=\"!arg.multiline\" required class=\"form-control\" autocorrect=\"off\" autocapitalize=\"none\" spellcheck=\"false\">\n" +
    "<textarea ng-model=\"arg.value\" ng-if=\"arg.multiline\" rows=\"5\" required class=\"form-control\" autocorrect=\"off\" autocapitalize=\"none\" spellcheck=\"false\">\n" +
    "        </textarea>\n" +
    "</div>\n" +
    "<div class=\"form-row-controls\">\n" +
    "<button class=\"sort-row\" type=\"button\" aria-hidden=\"true\" as-sortable-item-handle>\n" +
    "<span class=\"fa fa-bars\"></span>\n" +
    "<span class=\"sr-only\">Move row</span>\n" +
    "</button>\n" +
    "<button class=\"btn-remove close delete-row\" type=\"button\" aria-hidden=\"true\" ng-click=\"removeArg($index)\">\n" +
    "<span class=\"pficon pficon-close\" aria-hidden=\"true\"></span>\n" +
    "<span class=\"sr-only\">Delete row</span>\n" +
    "</button>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"form-group\">\n" +
    "<label class=\"sr-only\" ng-attr-for=\"{{id}}-add-arg\">\n" +
    "<span ng-if=\"placeholder\">{{placeholder}}</span>\n" +
    "<span ng-if=\"!placeholder\">Add argument</span>\n" +
    "</label>\n" +
    "\n" +
    "<span ng-show=\"!multiline\" class=\"input-group\">\n" +
    "<input type=\"text\" ng-model=\"nextArg\" name=\"nextArg\" ng-attr-id=\"{{id}}-add-arg\" on-enter=\"addArg()\" ng-attr-placeholder=\"{{placeholder || 'Add argument'}}\" class=\"form-control\" autocorrect=\"off\" autocapitalize=\"none\" spellcheck=\"false\">\n" +
    "<span class=\"input-group-btn\">\n" +
    "\n" +
    "<a class=\"btn btn-default\" href=\"\" ng-click=\"addArg()\" ng-disabled=\"!nextArg\" ng-attr-aria-disabled=\"!nextArg\" role=\"button\">Add</a>\n" +
    "</span>\n" +
    "</span>\n" +
    "\n" +
    "<span ng-show=\"multiline\">\n" +
    "<textarea ng-model=\"nextArg\" name=\"nextArg\" rows=\"10\" ng-attr-id=\"{{id}}-add-arg\" ng-attr-placeholder=\"{{placeholder || 'Add argument'}}\" class=\"form-control\" autocorrect=\"off\" autocapitalize=\"none\" spellcheck=\"false\">\n" +
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
    "<input ng-attr-id=\"{{id}}-path\" ng-model=\"probe.httpGet.path\" type=\"text\" placeholder=\"/\" autocorrect=\"off\" autocapitalize=\"none\" spellcheck=\"false\" class=\"form-control\">\n" +
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
    "<input type=\"number\" name=\"initialDelaySeconds\" ng-model=\"probe.initialDelaySeconds\" pattern=\"\\d*\" min=\"0\" select-on-focus ng-attr-id=\"{{id}}-initial-delay\" class=\"form-control\" ng-attr-aria-describedby=\"{{id}}-delay-description\">\n" +
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
    "<input type=\"number\" name=\"timeoutSeconds\" ng-model=\"probe.timeoutSeconds\" pattern=\"\\d*\" min=\"1\" placeholder=\"1\" select-on-focus ng-attr-id=\"{{id}}-timeout\" class=\"form-control\" ng-attr-aria-describedby=\"{{id}}-timeout-description\">\n" +
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


  $templateCache.put('views/directives/_service-binding.html',
    "<div class=\"service-binding\">\n" +
    "<div class=\"row\">\n" +
    "<div ng-class=\"{'col-sm-5 col-md-6': $ctrl.isOverview,\n" +
    "                    'col-sm-8 col-md-6 col-lg-8': !$ctrl.isOverview}\">\n" +
    "<h3>\n" +
    "{{$ctrl.binding.metadata.name}}\n" +
    "<span ng-if=\"$ctrl.refApiObject.kind !== 'ServiceInstance'\">\n" +
    "<small ng-if=\"$ctrl.serviceClass\">\n" +
    "{{$ctrl.serviceClass.spec.externalMetadata.displayName || $ctrl.serviceClass.metadata.name}}\n" +
    "</small>\n" +
    "<small>{{$ctrl.binding.spec.instanceRef.name}}</small>\n" +
    "</span>\n" +
    "<small>created <span am-time-ago=\"$ctrl.binding.metadata.creationTimestamp\"></span></small>\n" +
    "</h3>\n" +
    "</div>\n" +
    "<div ng-if=\"$ctrl.binding.metadata.deletionTimestamp\" ng-class=\"{'col-sm-7 col-md-6': $ctrl.isOverview,\n" +
    "                    'col-sm-4 col-md-3': !$ctrl.isOverview}\">\n" +
    "<span class=\"pficon pficon-warning-triangle-o\" aria-hidden=\"true\"></span>\n" +
    "Marked for Deletion\n" +
    "</div>\n" +
    "<div ng-if=\"!$ctrl.binding.metadata.deletionTimestamp && ($ctrl.binding | isBindingFailed)\" ng-class=\"{'col-sm-7 col-md-6': $ctrl.isOverview,\n" +
    "                    'col-sm-4 col-md-6 col-lg-4': !$ctrl.isOverview}\">\n" +
    "<span dynamic-content=\"{{$ctrl.binding | bindingFailedMessage}}\" data-toggle=\"tooltip\" data-trigger=\"hover\">\n" +
    "<span class=\"pficon pficon-error-circle-o\" aria-hidden=\"true\"></span>\n" +
    "<span>Error</span>\n" +
    "</span>\n" +
    "</div>\n" +
    "<div ng-if=\"!$ctrl.binding.metadata.deletionTimestamp && !($ctrl.binding | isBindingFailed) && !($ctrl.binding | isBindingReady)\" ng-class=\"{'col-sm-7 col-md-6': $ctrl.isOverview,\n" +
    "                    'col-sm-4 col-md-6 col-lg-4': !$ctrl.isOverview}\">\n" +
    "<status-icon status=\"'Pending'\"></status-icon>Pending\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"service-binding-actions\" ng-if=\"!$ctrl.binding.metadata.deletionTimestamp\">\n" +
    "<delete-link ng-if=\"$ctrl.serviceBindingsVersion | canI : 'delete'\" kind=\"ServiceBinding\" group=\"servicecatalog.k8s.io\" type-display-name=\"binding\" resource-name=\"{{$ctrl.binding.metadata.name}}\" project-name=\"{{$ctrl.binding.metadata.namespace}}\" stay-on-current-page=\"true\">\n" +
    "</delete-link>\n" +
    "<a ng-if=\"($ctrl.secretsVersion | canI : 'get') && ($ctrl.binding | isBindingReady)\" ng-href=\"{{$ctrl.binding.spec.secretName | navigateResourceURL : 'Secret' : $ctrl.namespace}}\">\n" +
    "View Secret\n" +
    "</a>\n" +
    "</div>\n" +
    "<div class=\"service-binding-parameters\" ng-if=\"!$ctrl.isOverview && $ctrl.bindParameterSchema.properties\">\n" +
    "<span class=\"component-label\">Parameters</span>\n" +
    "<a ng-if=\"$ctrl.allowParametersReveal\" href=\"\" class=\"hide-show-link\" ng-click=\"$ctrl.toggleShowParameterValues()\" role=\"button\">\n" +
    "{{$ctrl.showParameterValues ? 'Hide Values' : 'Reveal Values'}}\n" +
    "</a>\n" +
    "<form name=\"ctrl.parametersForm\">\n" +
    "<catalog-parameters hide-values=\"!$ctrl.showParameterValues\" opaque-keys=\"$ctrl.opaqueParameterKeys\" model=\"$ctrl.parameterData\" parameter-form-definition=\"$ctrl.bindParameterFormDefinition\" parameter-schema=\"$ctrl.bindParameterSchema\" is-horizontal=\"true\" read-only=\"true\">\n" +
    "</catalog-parameters>\n" +
    "</form>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/directives/_status-icon.html',
    "<span ng-switch=\"status\" class=\"hide-ng-leave status-icon\">\n" +
    "<span ng-switch-when=\"Cancelled\" class=\"fa fa-ban text-muted\" aria-hidden=\"true\"></span>\n" +
    "<span ng-switch-when=\"Complete\" class=\"fa fa-check text-success\" aria-hidden=\"true\"></span>\n" +
    "<span ng-switch-when=\"Completed\" class=\"fa fa-check text-success\" aria-hidden=\"true\"></span>\n" +
    "<span ng-switch-when=\"Active\" class=\"fa fa-refresh\" aria-hidden=\"true\"></span>\n" +
    "<span ng-switch-when=\"Error\" class=\"fa fa-times text-danger\" aria-hidden=\"true\"></span>\n" +
    "<span ng-switch-when=\"Failed\" class=\"fa fa-times text-danger\" aria-hidden=\"true\"></span>\n" +
    "<span ng-switch-when=\"New\" class=\"fa fa-hourglass-o\" aria-hidden=\"true\"></span>\n" +
    "<span ng-switch-when=\"Pending\" class=\"fa fa-hourglass-half\" aria-hidden=\"true\"></span>\n" +
    "<span ng-switch-when=\"Ready\" class=\"fa fa-check text-success\" aria-hidden=\"true\"></span>\n" +
    "<span ng-switch-when=\"Running\" class=\"fa fa-refresh\" aria-hidden=\"true\" ng-class=\"{'fa-spin' : spinning}\"></span>\n" +
    "<span ng-switch-when=\"Succeeded\" class=\"fa fa-check text-success\" aria-hidden=\"true\"></span>\n" +
    "<span ng-switch-when=\"Bound\" class=\"fa fa-check text-success\" aria-hidden=\"true\"></span>\n" +
    "<span ng-switch-when=\"Terminating\" class=\"fa fa-times text-danger\" aria-hidden=\"true\"></span>\n" +
    "<span ng-switch-when=\"Terminated\" class=\"fa fa-times text-danger\" aria-hidden=\"true\"></span>\n" +
    "<span ng-switch-when=\"Unknown\" class=\"fa fa-question text-danger\" aria-hidden=\"true\"></span>\n" +
    "\n" +
    "<span ng-switch-when=\"Init Error\" class=\"fa fa-times text-danger\" aria-hidden=\"true\"></span>\n" +
    "<span ng-switch-when=\"ContainerCreating\" class=\"fa fa-hourglass-half\" aria-hidden=\"true\"></span>\n" +
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
    "<span ng-switch-when=\"PodInitializing\" class=\"fa fa-hourglass-half\" aria-hidden=\"true\"></span>\n" +
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
    "<a href=\"\" class=\"item action\" ng-if=\"showAction\" ng-click=\"action()\" ng-attr-title=\"{{actionTitle}}\">\n" +
    "<i ng-class=\"icon || 'pficon pficon-close'\"></i>\n" +
    "</a>\n" +
    "</span>"
  );


  $templateCache.put('views/directives/add-config-to-application.html',
    "<div class=\"modal-add-config-to-application\">\n" +
    "<div class=\"modal-header\">\n" +
    "<button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\" aria-label=\"Close\" ng-click=\"ctrl.onCancel()\">\n" +
    "<span class=\"pficon pficon-close\"></span>\n" +
    "</button>\n" +
    "<h1 class=\"modal-title\">Add to Application</h1>\n" +
    "</div>\n" +
    "<form name=\"addToApplicationForm\" novalidate>\n" +
    "<fieldset ng-disabled=\"disableInputs\">\n" +
    "<div class=\"modal-body\">\n" +
    "<legend>Add this {{ctrl.apiObject.kind | humanizeKind}} to application:</legend>\n" +
    "<div class=\"form-group\" ng-class=\"{'has-error' : ctrl.addType === 'env' && ctrl.application && !ctrl.canAddRefToApplication}\">\n" +
    "<div class=\"application-select\">\n" +
    "<ui-select autofocus id=\"application\" ng-model=\"ctrl.application\" on-select=\"ctrl.checkApplicationContainersRefs($item)\" required=\"true\" ng-disabled=\"ctrl.disableInputs\">\n" +
    "<ui-select-match placeholder=\"{{ctrl.applications.length ? 'Select an application' : 'There are no applications in this project'}}\">\n" +
    "<span>\n" +
    "{{$select.selected.metadata.name}}\n" +
    "<small class=\"text-muted\">&ndash; {{$select.selected.kind | humanizeKind : true}}</small>\n" +
    "</span>\n" +
    "</ui-select-match>\n" +
    "<ui-select-choices repeat=\"application in (ctrl.applications) | filter : { metadata: { name: $select.search } } track by (application | uid)\" group-by=\"ctrl.groupByKind\">\n" +
    "<span ng-bind-html=\"application.metadata.name | highlight : $select.search\"></span>\n" +
    "</ui-select-choices>\n" +
    "</ui-select>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"has-error\" ng-if=\"ctrl.addType === 'env' && ctrl.application && !ctrl.canAddRefToApplication\">\n" +
    "<span class=\"help-block\">\n" +
    "The {{ctrl.apiObject.kind | humanizeKind}} has already been added to this application.\n" +
    "</span>\n" +
    "</div>\n" +
    "<legend>Add {{ctrl.apiObject.kind | humanizeKind}} as:</legend>\n" +
    "<div class=\"radio\">\n" +
    "<label for=\"env\">\n" +
    "<input id=\"env\" type=\"radio\" ng-model=\"ctrl.addType\" value=\"env\">\n" +
    "Environment variables\n" +
    "</label>\n" +
    "</div>\n" +
    "<div ng-if=\"ctrl.addType === 'env'\" class=\"choice-contents clearfix\">\n" +
    "<div class=\"has-warning\" ng-if=\"ctrl.hasInvalidEnvVars\">\n" +
    "<div class=\"help-block\">\n" +
    "<span class=\"pf-icon pficon-warning-triangle-o\" aria-hidden=\"true\"></span>\n" +
    "{{ctrl.apiObject.kind | humanizeKind | upperFirst}} <strong>{{ctrl.apiObject.metadata.name}}</strong> contains keys that are not valid environment variable names. Only {{ctrl.apiObject.kind | humanizeKind}} keys with valid names will be added as environment variables.\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"form-group\">\n" +
    "<div class=\"control-label\">\n" +
    "<label>Prefix</label>\n" +
    "<a href=\"\" class=\"pficon pficon-info field-help\" aria-hidden=\"true\" uib-popover=\"Optionally, you can specify a prefix to use with environment variables.\" popover-trigger=\"focus\">\n" +
    "</a>\n" +
    "</div>\n" +
    "<span class=\"control-input\" ng-class=\"{'has-error': addToApplicationForm.envPrefix.$error.pattern && addToApplicationForm.envPrefix.$touched}\">\n" +
    "<input class=\"form-control\" name=\"envPrefix\" id=\"envPrefix\" placeholder=\"(optional)\" type=\"text\" ng-pattern=\"/^[A-Za-z_][A-Za-z0-9_]*$/\" aria-describedby=\"env-prefix-help\" ng-disabled=\"ctrl.addType !== 'env' || !ctrl.application\" ng-model=\"ctrl.envPrefix\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\">\n" +
    "<div class=\"help-block\" ng-show=\"addToApplicationForm.envPrefix.$error.pattern && addToApplicationForm.envPrefix.$touched\">\n" +
    "Prefix can contain numbers, letters, and underscores, but can not start with a number.\n" +
    "</div>\n" +
    "<span class=\"sr-only\" id=\"env-prefix-help\">Optionally, you can specify a prefix to use with environment variables.</span>\n" +
    "</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"radio\">\n" +
    "<label for=\"volume\">\n" +
    "<input id=\"volume\" type=\"radio\" ng-model=\"ctrl.addType\" value=\"volume\">\n" +
    "Volume\n" +
    "</label>\n" +
    "</div>\n" +
    "<div ng-if=\"ctrl.addType === 'volume'\" class=\"choice-contents clearfix\">\n" +
    "<div class=\"form-group\">\n" +
    "<div class=\"control-label\">\n" +
    "<label class=\"required\">Mount Path</label>\n" +
    "<a href=\"\" class=\"pficon pficon-info field-help\" aria-hidden=\"true\" uib-popover=\"Mount Path for the volume. A file will be created in this\n" +
    "                              directory for each key from the {{ctrl.apiObject.kind | humanizeKind}}.\n" +
    "                              The file contents will be the value of the key.\" popover-trigger=\"focus\">\n" +
    "</a>\n" +
    "</div>\n" +
    "<div class=\"control-input\" ng-class=\"{'has-error': (addToApplicationForm.mountVolume.$error.oscUnique || (addToApplicationForm.mountVolume.$error.pattern && addToApplicationForm.mountVolume.$touched))}\">\n" +
    "<input class=\"form-control\" name=\"mountVolume\" id=\"mountVolume\" type=\"text\" ng-pattern=\"/^\\/.*$/\" osc-unique=\"ctrl.existingMountPaths\" aria-describedby=\"mount-path-help\" ng-disabled=\"ctrl.addType !== 'volume' || !ctrl.application\" ng-required=\"ctrl.addType === 'volume'\" ng-model=\"ctrl.mountVolume\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\">\n" +
    "<div class=\"help-block\" ng-show=\"addToApplicationForm.mountVolume.$error.pattern && addToApplicationForm.mountVolume.$touched\">\n" +
    "Mount path must be a valid path to a directory starting with <code>/</code>.\n" +
    "</div>\n" +
    "<div class=\"help-block\" ng-show=\"addToApplicationForm.mountVolume.$error.oscUnique\">\n" +
    "The mount path is already used. Please choose another mount path.\n" +
    "</div>\n" +
    "<span class=\"sr-only\" id=\"mount-path-help\">\n" +
    "Mount Path for the volume. A file will be created in this directory for each key from the {{ctrl.apiObject.kind | humanizeKind}}. The file contents will be the value of the key.\n" +
    "</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"ctrl.canAddRefToApplication\">\n" +
    "<legend ng-if-start=\"ctrl.application.spec.template.spec.containers.length > 1\">Containers:</legend>\n" +
    "<div ng-if-end class=\"form-group container-options\">\n" +
    "<div ng-if=\"ctrl.attachAllContainers\">\n" +
    "The {{ctrl.apiObject.kind | humanizeKind}} will be added to all containers. You can\n" +
    "<a href=\"\" ng-click=\"ctrl.attachAllContainers = false\">select specific containers</a>\n" +
    "instead.\n" +
    "</div>\n" +
    "<div ng-if=\"!ctrl.attachAllContainers\" class=\"form-group\">\n" +
    "<label class=\"sr-only required\">Containers</label>\n" +
    "<select-containers ng-model=\"ctrl.attachContainers\" pod-template=\"ctrl.application.spec.template\" ng-required=\"true\" help-text=\"Add the {{ctrl.apiObject.kind | humanizeKind}} to the selected containers.\">\n" +
    "</select-containers>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"modal-footer\">\n" +
    "<button class=\"btn btn-default\" ng-class=\"{'dialog-btn': isDialog}\" ng-click=\"ctrl.onCancel()\">\n" +
    "Cancel\n" +
    "</button>\n" +
    "<button type=\"submit\" class=\"btn btn-primary\" ng-class=\"{'dialog-btn': isDialog}\" ng-click=\"ctrl.addToApplication()\" ng-disabled=\"addToApplicationForm.$invalid || (ctrl.addType === 'env' && !ctrl.canAddRefToApplication)\" value=\"\">\n" +
    "Save\n" +
    "</button>\n" +
    "</div>\n" +
    "</fieldset>\n" +
    "</form>\n" +
    "<div class=\"updating\" ng-if=\"ctrl.updating\">\n" +
    "<div class=\"spinner spinner-lg\" aria-hidden=\"true\"></div>\n" +
    "<h3>\n" +
    "<span class=\"sr-only\">Updating</span>\n" +
    "</h3>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/directives/annotations.html',
    "<p ng-if=\"annotations\" ng-class=\"{'mar-bottom-xl': !expandAnnotations}\">\n" +
    "<a href=\"\" ng-click=\"toggleAnnotations()\">{{expandAnnotations ? 'Hide Annotations' : 'Show Annotations'}}</a>\n" +
    "</p>\n" +
    "<div ng-if=\"expandAnnotations && annotations\" class=\"table-responsive scroll-shadows-horizontal\">\n" +
    "<table class=\"table table-bordered table-bordered-columns key-value-table\">\n" +
    "<tbody>\n" +
    "<tr ng-repeat=\"(annotationKey, annotationValue) in annotations\">\n" +
    "<td class=\"key\">{{annotationKey}}</td>\n" +
    "<td class=\"value\">\n" +
    "<truncate-long-text content=\"annotationValue | prettifyJSON\" limit=\"500\" newline-limit=\"20\" expandable=\"true\">\n" +
    "</truncate-long-text>\n" +
    "</td>\n" +
    "</tr>\n" +
    "</tbody>\n" +
    "</table>\n" +
    "</div>\n" +
    "<p ng-if=\"!annotations\" class=\"mar-bottom-xl\">\n" +
    "There are no annotations on this resource.\n" +
    "</p>"
  );


  $templateCache.put('views/directives/bind-service.html',
    "<div class=\"bind-service-wizard\">\n" +
    "<pf-wizard wizard-title=\"Create Binding\" hide-sidebar=\"true\" step-class=\"bind-service-wizard-step\" wizard-ready=\"ctrl.wizardReady\" next-title=\"ctrl.nextTitle\" hide-back-button=\"{{ctrl.hideBack}}\" on-finish=\"ctrl.closeWizard()\" on-cancel=\"ctrl.closeWizard()\" wizard-done=\"ctrl.wizardComplete\">\n" +
    "<pf-wizard-step ng-repeat=\"step in ctrl.steps track by step.id\" step-title=\"{{step.label}}\" next-enabled=\"step.valid\" wz-disabled=\"{{step.hidden}}\" on-show=\"step.onShow\" step-id=\"{{step.id}}\" step-priority=\"{{$index}}\" allow-click-nav=\"step.allowClickNav\">\n" +
    "<div class=\"wizard-pf-main-inner-shadow-covers\">\n" +
    "<div class=\"bind-service-config\">\n" +
    "<div ng-if=\"!step.hidden\" ng-include=\"step.view\" class=\"wizard-pf-main-form-contents\"></div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</pf-wizard-step>\n" +
    "</pf-wizard>\n" +
    "</div>"
  );


  $templateCache.put('views/directives/bind-service/bind-parameters.html',
    "<form name=\"ctrl.parametersForm\">\n" +
    "<catalog-parameters model=\"ctrl.parameterData\" parameter-schema=\"ctrl.parameterSchema\" parameter-form-definition=\"ctrl.parameterFormDefinition\">\n" +
    "</catalog-parameters>\n" +
    "</form>"
  );


  $templateCache.put('views/directives/bind-service/bind-service-form.html',
    "<div ng-if=\"ctrl.target.kind !== 'ServiceInstance'\">\n" +
    "<bind-application-form application-name=\"ctrl.target.metadata.name\" form-name=\"ctrl.selectionForm\" service-classes=\"ctrl.serviceClasses\" service-instances=\"ctrl.orderedServiceInstances\" service-to-bind=\"ctrl.serviceToBind\">\n" +
    "</bind-application-form>\n" +
    "</div>\n" +
    "<div ng-if=\"ctrl.target.kind === 'ServiceInstance'\">\n" +
    "<bind-service-form selected-project=\"ctrl.project\" service-class=\"ctrl.serviceClass\" form-name=\"ctrl.selectionForm\" show-pod-presets=\"ctrl.podPresets\" applications=\"ctrl.applications\" project-name=\"ctrl.projectDisplayName\" bind-type=\"ctrl.bindType\" app-to-bind=\"ctrl.appToBind\">\n" +
    "</bind-service-form>\n" +
    "</div>"
  );


  $templateCache.put('views/directives/bind-service/delete-binding-result.html',
    "<div>\n" +
    "<div ng-if=\"!ctrl.error\">\n" +
    "<h3 class=\"mar-top-none\">\n" +
    "Binding for the following has been deleted:\n" +
    "</h3>\n" +
    "<div ng-if=\"ctrl.unboundApps | size\" ng-repeat=\"appForBinding in ctrl.unboundApps track by (appForBinding | uid)\">\n" +
    "{{appForBinding.metadata.name}} <small class=\"text-muted\">&ndash; {{ appForBinding.kind | humanizeKind : true}}</small>\n" +
    "</div>\n" +
    "<div ng-if=\"!(ctrl.unboundApps | size)\">\n" +
    "{{ctrl.selectedBinding.metadata.name}}\n" +
    "</div>\n" +
    "\n" +
    "<p ng-if=\"ctrl.unboundApps | size\" class=\"mar-top-lg\">\n" +
    "<span class=\"pficon pficon-info\" aria-hidden=\"true\"></span>\n" +
    "You will need to redeploy your pods for this to take effect.\n" +
    "</p>\n" +
    "</div>\n" +
    "<div ng-if=\"ctrl.error\">\n" +
    "<div class=\"title\">Deletion of Binding Failed <span class=\"fa fa-times text-danger\"></span></div>\n" +
    "<div class=\"sub-title\">\n" +
    "<span ng-if=\"ctrl.error.data.message\">\n" +
    "{{ctrl.error.data.message | upperFirst}}\n" +
    "</span>\n" +
    "<span ng-if=\"!ctrl.error.data.message\">\n" +
    "An error occurred deleting the binding.\n" +
    "</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/directives/bind-service/delete-binding-select-form.html',
    "<h3 class=\"mar-top-none\">\n" +
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
    "<div ng-if=\"!(ctrl.appsForBinding(binding.metadata.name) | size)\">\n" +
    "{{binding.metadata.name}}\n" +
    "</div>\n" +
    "<div>\n" +
    "<small class=\"text-muted\">Created <span am-time-ago=\"binding.metadata.creationTimestamp\"></span></small>\n" +
    "</div>\n" +
    "</label>\n" +
    "</div>\n" +
    "</fieldset>\n" +
    "</form>"
  );


  $templateCache.put('views/directives/bind-service/results.html',
    "<bind-results error=\"ctrl.error\" binding=\"ctrl.binding\" service-to-bind=\"ctrl.serviceToBind.metadata.name\" bind-type=\"{{ctrl.bindType}}\" application-to-bind=\"ctrl.appToBind.metadata.name\" show-pod-presets=\"'pod_presets' | enableTechPreviewFeature\" secret-href=\"ctrl.binding.spec.secretName | navigateResourceURL : 'Secret' : ctrl.target.metadata.namespace\">\n" +
    "</bind-results>"
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
    "<div ng-if=\"collapsePending\">\n" +
    "<div ng-if=\"build.status.phase === 'New' || build.status.phase === 'Pending'\" ng-include=\"'views/directives/_build-pipeline-collapsed.html'\"></div>\n" +
    "<div ng-if=\"build.status.phase !== 'New' && build.status.phase !== 'Pending'\" ng-include=\"'views/directives/_build-pipeline-expanded.html'\"></div>\n" +
    "</div>\n" +
    "<div ng-if=\"!expandOnlyRunning && !collapsePending\" ng-include=\"'views/directives/_build-pipeline-expanded.html'\"></div>\n" +
    "</div>"
  );


  $templateCache.put('views/directives/build-status.html',
    "<status-icon status=\"build.status.phase\" disable-animation></status-icon>\n" +
    "<span ng-if=\"!build.status.reason || build.status.phase === 'Cancelled'\">{{build.status.phase}}</span>\n" +
    "<span ng-if=\"build.status.reason && build.status.phase !== 'Cancelled'\">{{build.status.reason | sentenceCase}}</span>\n" +
    "<span ng-if=\"build.status.startTimestamp\" class=\"small text-muted\">\n" +
    "&ndash;\n" +
    "<span ng-if=\"build.status.completionTimestamp\">\n" +
    "{{build.status.startTimestamp | timeOnlyDurationFromTimestamps : build.status.completionTimestamp}}\n" +
    "</span>\n" +
    "<span ng-if=\"!build.status.completionTimestamp\">\n" +
    "<time-only-duration-until-now timestamp=\"build.status.startTimestamp\" time-only></time-only-duration-until-now>\n" +
    "</span>\n" +
    "</span>"
  );


  $templateCache.put('views/directives/create-secret.html',
    "<ng-form name=\"secretForm\" class=\"create-secret-form\">\n" +
    "<div ng-if=\"!type\" class=\"form-group mar-top-lg\">\n" +
    "<label for=\"secret-type\">Secret Type</label>\n" +
    "<ui-select input-id=\"secret-type\" required ng-model=\"newSecret.type\" search-enabled=\"false\" ng-change=\"newSecret.authType = secretAuthTypeMap[newSecret.type].authTypes[0].id\">\n" +
    "<ui-select-match>{{$select.selected | upperFirst}} Secret</ui-select-match>\n" +
    "<ui-select-choices repeat=\"type in secretTypes\">\n" +
    "{{type | upperFirst}} Secret\n" +
    "</ui-select-choices>\n" +
    "</ui-select>\n" +
    "</div>\n" +
    "<div ng-if=\"newSecret.type\">\n" +
    "<div class=\"form-group\">\n" +
    "<label for=\"secret-name\" class=\"required\">Secret Name</label>\n" +
    "<span ng-class=\"{'has-error': nameTaken || (secretForm.name.$invalid && secretForm.name.$touched)}\">\n" +
    "<input class=\"form-control\" id=\"secret-name\" name=\"name\" ng-model=\"newSecret.data.secretName\" type=\"text\" autocorrect=\"off\" autocapitalize=\"none\" spellcheck=\"false\" aria-describedby=\"secret-name-help\" ng-pattern=\"nameValidation.pattern\" ng-maxlength=\"nameValidation.maxlength\" ng-change=\"nameChanged()\" required>\n" +
    "</span>\n" +
    "<div class=\"has-error\" ng-show=\"nameTaken\">\n" +
    "<span class=\"help-block\">\n" +
    "This name is already in use. Please choose a different name.\n" +
    "</span>\n" +
    "</div>\n" +
    "<div class=\"has-error\" ng-show=\"secretForm.name.$invalid\">\n" +
    "<div ng-show=\"secretForm.name.$error.pattern && secretForm.name.$touched\" class=\"help-block\">\n" +
    "{{nameValidation.description}}\n" +
    "</div>\n" +
    "<div ng-show=\"secretForm.name.$error.required && secretForm.name.$touched\" class=\"help-block\">\n" +
    "Name is required.\n" +
    "</div>\n" +
    "<div ng-show=\"secretForm.name.$error.maxlength && secretForm.name.$touched\" class=\"help-block\">\n" +
    "Can't be longer than {{nameValidation.maxlength}} characters.\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"help-block\" id=\"secret-name-help\">\n" +
    "Unique name of the new secret.\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"newSecret.type == 'webhook'\">\n" +
    "<div class=\"form-group\">\n" +
    "<label for=\"webhook-secret-key\" class=\"required\">Webhook Secret Key</label>\n" +
    "<div class=\"input-group\" ng-class=\"{ 'has-error': secretForm.webhookSecretKey.$invalid && secretForm.webhookSecretKey.$touched}\">\n" +
    "<input class=\"form-control\" id=\"webhook-secret-key\" name=\"webhookSecretKey\" ng-model=\"newSecret.data.webhookSecretKey\" ng-pattern=\"secretReferenceValidation.pattern\" ng-minlength=\"secretReferenceValidation.minLength\" type=\"text\" autocorrect=\"off\" autocapitalize=\"none\" spellcheck=\"false\" aria-describedby=\"webhook-secret-key-help\" required=\"true\">\n" +
    "<span class=\"input-group-btn\">\n" +
    "<button type=\"button\" class=\"btn btn-default\" ng-click=\"generateWebhookSecretKey()\">Generate</button>\n" +
    "</span>\n" +
    "</div>\n" +
    "<div class=\"help-block\" id=\"secret-name-help\">\n" +
    "Value of the secret will be supplied when invoking the webhook.\n" +
    "<a ng-href=\"{{'webhooks' | helpLink}}\" target=\"_blank\"><span class=\"learn-more-inline\">Learn More&nbsp;<i class=\"fa fa-external-link\" aria-hidden=\"true\"></i></span></a>\n" +
    "</div>\n" +
    "<div class=\"has-error\" ng-show=\"secretForm.webhookSecretKey.$error.pattern && secretForm.webhookSecretKey.$touched\">\n" +
    "<span class=\"help-block\">\n" +
    "{{secretReferenceValidation.description}}\n" +
    "</span>\n" +
    "</div>\n" +
    "<div class=\"has-error\" ng-show=\"secretForm.webhookSecretKey.$error.minlength && secretForm.webhookSecretKey.$touched\">\n" +
    "<span class=\"help-block\">\n" +
    "The key must have at least {{secretReferenceValidation.minLength}} characters.\n" +
    "</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"newSecret.type === 'source' || newSecret.type === 'image'\">\n" +
    "<div class=\"form-group\">\n" +
    "<label for=\"authentification-type\">Authentication Type</label>\n" +
    "<ui-select required input-id=\"authentification-type\" ng-model=\"newSecret.authType\" search-enabled=\"false\">\n" +
    "<ui-select-match>{{$select.selected.label}}</ui-select-match>\n" +
    "<ui-select-choices repeat=\"type.id as type in secretAuthTypeMap[newSecret.type].authTypes\">\n" +
    "{{type.label}}\n" +
    "</ui-select-choices>\n" +
    "</ui-select>\n" +
    "</div>\n" +
    "<div ng-if=\"newSecret.authType === 'kubernetes.io/basic-auth'\">\n" +
    "<div class=\"form-group\">\n" +
    "<label for=\"username\">Username</label>\n" +
    "<input class=\"form-control\" id=\"username\" name=\"username\" ng-model=\"newSecret.data.username\" type=\"text\" autocorrect=\"off\" autocapitalize=\"none\" spellcheck=\"false\" aria-describedby=\"username-help\">\n" +
    "<div class=\"help-block\" id=\"username-help\">\n" +
    "Optional username for Git authentication.\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"form-group\" ng-class=\"{ 'has-error' : secretForm.passwordToken.$invalid && secretForm.passwordToken.$touched }\">\n" +
    "<label ng-class=\"{ required: !add.cacert && !add.gitconfig }\" for=\"password-token\">Password or Token</label>\n" +
    "<input class=\"form-control\" id=\"password-token\" name=\"passwordToken\" ng-model=\"newSecret.data.passwordToken\" autocorrect=\"off\" autocapitalize=\"none\" spellcheck=\"false\" aria-describedby=\"password-token-help\" type=\"password\" ng-required=\"!add.cacert && !add.gitconfig\">\n" +
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
    "            mode: 'txt',\n" +
    "            theme: 'eclipse',\n" +
    "            rendererOptions: {\n" +
    "              fadeFoldWidgets: true,\n" +
    "              showPrintMargin: false\n" +
    "            }\n" +
    "          }\" ng-model=\"newSecret.data.cacert\" class=\"create-secret-editor ace-bordered\" id=\"cacert-editor\" required></div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"newSecret.authType === 'kubernetes.io/ssh-auth'\">\n" +
    "<div class=\"form-group\" id=\"private-key\">\n" +
    "<label for=\"privateKey\" class=\"required\">SSH Private Key</label>\n" +
    "<osc-file-input id=\"private-key-file-input\" model=\"newSecret.data.privateKey\" drop-zone-id=\"private-key\" help-text=\"Upload your private SSH key file.\"></osc-file-input>\n" +
    "<div ui-ace=\"{\n" +
    "            theme: 'eclipse',\n" +
    "            rendererOptions: {\n" +
    "              fadeFoldWidgets: true,\n" +
    "              showPrintMargin: false\n" +
    "            }\n" +
    "          }\" ng-model=\"newSecret.data.privateKey\" class=\"create-secret-editor ace-bordered\" id=\"private-key-editor\" required></div>\n" +
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
    "            mode: 'ini',\n" +
    "            theme: 'eclipse',\n" +
    "            rendererOptions: {\n" +
    "              fadeFoldWidgets: true,\n" +
    "              showPrintMargin: false\n" +
    "            }\n" +
    "          }\" ng-model=\"newSecret.data.gitconfig\" class=\"create-secret-editor ace-bordered\" id=\"gitconfig-editor\" required></div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"newSecret.authType === 'kubernetes.io/dockerconfigjson'\">\n" +
    "<div class=\"form-group\" ng-class=\"{ 'has-error' : secretForm.dockerServer.$invalid && secretForm.dockerServer.$touched }\">\n" +
    "<label for=\"docker-server\" class=\"required\">Image Registry Server Address</label>\n" +
    "<div>\n" +
    "<input class=\"form-control\" id=\"docker-server\" name=\"dockerServer\" ng-model=\"newSecret.data.dockerServer\" type=\"text\" autocorrect=\"off\" autocapitalize=\"none\" spellcheck=\"false\" required>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-show=\"secretForm.dockerServer.$error.required && secretForm.dockerServer.$touched\" class=\"has-error\">\n" +
    "<div class=\"help-block\">\n" +
    "Image registry server address is required.\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"form-group\" ng-class=\"{ 'has-error' : secretForm.dockerUsername.$invalid && secretForm.dockerUsername.$touched }\">\n" +
    "<label for=\"docker-username\" class=\"required\">Username</label>\n" +
    "<div>\n" +
    "<input class=\"form-control\" id=\"docker-username\" name=\"dockerUsername\" ng-model=\"newSecret.data.dockerUsername\" type=\"text\" autocorrect=\"off\" autocapitalize=\"none\" spellcheck=\"false\" required>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-show=\"secretForm.dockerUsername.$error.required && secretForm.dockerUsername.$touched\" class=\"has-error\">\n" +
    "<div class=\"help-block\">\n" +
    "Username is required.\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"form-group\" ng-class=\"{ 'has-error' : secretForm.dockerPassword.$invalid && secretForm.dockerPassword.$touched }\">\n" +
    "<label for=\"docker-password\" class=\"required\">Password</label>\n" +
    "<div>\n" +
    "<input class=\"form-control\" id=\"docker-password\" name=\"dockerPassword\" ng-model=\"newSecret.data.dockerPassword\" type=\"password\" autocorrect=\"off\" autocapitalize=\"none\" spellcheck=\"false\" required>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-show=\"secretForm.dockerPassword.$error.required && secretForm.dockerPassword.$touched\" class=\"has-error\">\n" +
    "<div class=\"help-block\">\n" +
    "Password is required.\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"form-group\" ng-class=\"{ 'has-error' : secretForm.dockerEmail.$invalid && secretForm.dockerEmail.$touched }\">\n" +
    "<label for=\"docker-email\" class=\"required\">Email</label>\n" +
    "<div>\n" +
    "<input class=\"form-control\" type=\"email\" id=\"docker-email\" name=\"dockerEmail\" ng-model=\"newSecret.data.dockerMail\" autocorrect=\"off\" autocapitalize=\"none\" spellcheck=\"false\" required>\n" +
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
    "<div ng-if=\"newSecret.authType === 'kubernetes.io/dockercfg'\">\n" +
    "<div class=\"form-group\" id=\"docker-config\">\n" +
    "<label for=\"dockerConfig\" class=\"required\">Configuration File</label>\n" +
    "<osc-file-input id=\"dockercfg-file-input\" model=\"newSecret.data.dockerConfig\" drop-zone-id=\"docker-config\" help-text=\"Upload a .dockercfg or .docker/config.json file\" required=\"true\"></osc-file-input>\n" +
    "<div ui-ace=\"{\n" +
    "            mode: 'json',\n" +
    "            theme: 'eclipse',\n" +
    "            onChange: aceChanged,\n" +
    "            rendererOptions: {\n" +
    "              fadeFoldWidgets: true,\n" +
    "              showPrintMargin: false\n" +
    "            }\n" +
    "          }\" ng-model=\"newSecret.data.dockerConfig\" class=\"create-secret-editor ace-bordered\" id=\"dockerconfig-editor\" required></div>\n" +
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
    "<div ng-if=\"(serviceAccountsVersion | canI : 'update') && !serviceAccountToLink\">\n" +
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
    "<div ng-if=\"newSecret.type === 'generic'\">\n" +
    "<edit-config-map-or-secret model=\"newSecret.data.genericKeyValues\" type=\"secret\" read-as-binary-string=\"true\">\n" +
    "</edit-config-map-or-secret>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"buttons gutter-top-bottom\">\n" +
    "<button class=\"btn btn-primary\" type=\"button\" ng-disabled=\"secretForm.$invalid || secretForm.$pristine || invalidConfigFormat\" ng-click=\"create()\">Create</button>\n" +
    "<button class=\"btn btn-default\" type=\"button\" ng-click=\"cancel()\">Cancel</button>\n" +
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


  $templateCache.put('views/directives/deploy-image-dialog.html',
    "<pf-wizard wizard-title=\"Deploy Image\" on-cancel=\"$ctrl.close()\" on-finish=\"$ctrl.close()\" hide-back-button=\"true\" hide-sidebar=\"true\" next-title=\"$ctrl.nextButtonTitle\" next-callback=\"$ctrl.nextCallback\" current-step=\"$ctrl.currentStep\" on-step-changed=\"$ctrl.stepChanged(step)\" step-class=\"order-service-wizard-step\" wizard-done=\"$ctrl.wizardDone\">\n" +
    "\n" +
    "<pf-wizard-step step-title=\"Image\" step-id=\"image\" step-priority=\"1\" substeps=\"false\" ok-to-nav-away=\"true\" allow-click-nav=\"false\" next-enabled=\"!!($ctrl.deployForm.$valid || $ctrl.deployImageNewAppCreated)\">\n" +
    "<div class=\"wizard-pf-main-inner-shadow-covers\">\n" +
    "<div class=\"order-service-config\">\n" +
    "<div class=\"wizard-pf-main-form-contents\">\n" +
    "<form name=\"$ctrl.deployForm\">\n" +
    "<deploy-image is-dialog=\"true\" project=\"$ctrl.project\" context=\"$ctrl.context\"></deploy-image>\n" +
    "</form>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</pf-wizard-step>\n" +
    "<pf-wizard-step step-title=\"Results\" step-id=\"results\" step-priority=\"2\" substeps=\"false\" ok-to-nav-away=\"true\" allow-click-nav=\"false\">\n" +
    "<div class=\"wizard-pf-main-inner-shadow-covers\">\n" +
    "<div class=\"order-service-config\">\n" +
    "<div class=\"wizard-pf-main-form-contents\">\n" +
    "<next-steps project=\"$ctrl.selectedProject\" project-name=\"$ctrl.selectedProject.metadata.name\" login-base-url=\"$ctrl.loginBaseUrl\" on-continue=\"$ctrl.close\" show-project-name=\"$ctrl.showProjectName\" name=\"$ctrl.appName\">\n" +
    "</next-steps>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</pf-wizard-step>\n" +
    "</pf-wizard>"
  );


  $templateCache.put('views/directives/deploy-image.html',
    "<div class=\"deploy-image\">\n" +
    "<select-project ng-if=\"!project\" selected-project=\"input.selectedProject\" name-taken=\"projectNameTaken\"></select-project>\n" +
    "<span ng-show=\"!noProjectsCantCreate\">\n" +
    "<p>\n" +
    "Deploy an existing image from an image stream tag or image registry.\n" +
    "</p>\n" +
    "<ng-form name=\"forms.imageSelection\">\n" +
    "<fieldset ng-disabled=\"loading\">\n" +
    "<div class=\"radio\">\n" +
    "<label>\n" +
    "<input type=\"radio\" ng-model=\"mode\" value=\"istag\">\n" +
    "Image Stream Tag\n" +
    "</label>\n" +
    "</div>\n" +
    "<fieldset>\n" +
    "<istag-select model=\"istag\" select-required=\"mode === 'istag'\" select-disabled=\"mode !== 'istag'\" include-shared-namespace=\"true\" append-to-body=\"isDialog\"></istag-select>\n" +
    "<div ng-if=\"mode == 'istag' && istag.namespace && istag.namespace !== 'openshift' && istag.namespace !== input.selectedProject.metadata.name\" class=\"alert alert-warning\">\n" +
    "<span class=\"pficon pficon-warning-triangle-o\" aria-hidden=\"true\"></span>\n" +
    "Service account <strong>default</strong> will need image pull authority to deploy images from <strong>{{istag.namespace}}</strong>. You can grant authority with the command:\n" +
    "<p>\n" +
    "<code>oc policy add-role-to-user system:image-puller system:serviceaccount:{{input.selectedProject.metadata.name}}:default -n {{istag.namespace}}</code>\n" +
    "</p>\n" +
    "</div>\n" +
    "</fieldset>\n" +
    "\n" +
    "<div class=\"radio\" ng-class=\"{disabled : !input.selectedProject.metadata.uid}\">\n" +
    "<label>\n" +
    "<input type=\"radio\" ng-model=\"mode\" value=\"dockerImage\" ng-disabled=\"!input.selectedProject.metadata.uid\">\n" +
    "Image Name\n" +
    "<span ng-if=\"!input.selectedProject.metadata.uid\" class=\"text-warning\">\n" +
    "&ndash; Image search is only available for existing projects.\n" +
    "</span>\n" +
    "</label>\n" +
    "</div>\n" +
    "<fieldset ng-disabled=\"!input.selectedProject.metadata.uid\">\n" +
    "<div class=\"form-group\">\n" +
    "<label for=\"imageName\" class=\"sr-only\">Image name or pull spec</label>\n" +
    "<div class=\"input-group\">\n" +
    "<input type=\"search\" id=\"imageName\" name=\"imageName\" ng-model=\"imageName\" ng-required=\"mode === 'dockerImage'\" select-on-focus ng-disabled=\"mode !== 'dockerImage'\" placeholder=\"Image name or pull spec\" class=\"form-control\" autocorrect=\"off\" autocapitalize=\"none\" spellcheck=\"false\">\n" +
    "<span class=\"input-group-btn\">\n" +
    "<button class=\"btn btn-default\" type=\"submit\" ng-disabled=\"!imageName\" ng-click=\"findImage()\">\n" +
    "<i class=\"fa fa-search\" aria-hidden=\"true\"></i>\n" +
    "<span class=\"sr-only\">Find</span>\n" +
    "</button>\n" +
    "</span>\n" +
    "</div>\n" +
    "<div class=\"help-block\">\n" +
    "To deploy an image from a private repository, you must <span ng-if=\"!input.selectedProject.metadata.uid\">create an image pull secret</span>\n" +
    "<a href=\"\" ng-click=\"openCreateWebhookSecretModal()\" ng-if=\"input.selectedProject.metadata.uid\">create an image pull secret</a>\n" +
    "with your image registry credentials.\n" +
    "<a ng-href=\"{{'pull_secret' | helpLink}}\" target=\"_blank\"><span class=\"learn-more-inline\">Learn More&nbsp;<i class=\"fa fa-external-link\" aria-hidden=\"true\"></i></span></a></div>\n" +
    "</div>\n" +
    "</fieldset>\n" +
    "</fieldset>\n" +
    "</ng-form>\n" +
    "<div class=\"mar-top-lg mar-bottom-lg\">\n" +
    "<div class=\"separator\"></div>\n" +
    "</div>\n" +
    "<div ng-if=\"loading || !import\" class=\"empty-state-message text-center\">\n" +
    "<h2 ng-if=\"!loading\" class=\"h2\">Select an image stream tag or enter an image name.</h2>\n" +
    "<h2 ng-if=\"loading\" class=\"h2\">Loading image metadata for <span class=\"word-break\">{{imageName | stripSHA}}</span>...</h2>\n" +
    "</div>\n" +
    "<div class=\"row mar-bottom-md\" ng-if-start=\"!loading && import.image\">\n" +
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
    "<div ng-if-end>\n" +
    "<ng-form name=\"forms.deployImage\" class=\"osc-form\">\n" +
    "<div class=\"form-group\">\n" +
    "<label for=\"name\" class=\"required\">Name</label>\n" +
    "<div ng-class=\"{'has-error': (forms.deployImage.name.$invalid && forms.deployImage.name.$touched) || nameTaken}\">\n" +
    "<input type=\"text\" required select-on-focus minlength=\"2\" maxlength=\"24\" pattern=\"[a-z]([-a-z0-9]*[a-z0-9])?\" ng-model=\"app.name\" id=\"name\" name=\"name\" class=\"form-control\" autocorrect=\"off\" autocapitalize=\"none\" spellcheck=\"false\">\n" +
    "</div>\n" +
    "<div class=\"help-block\">Identifies the resources created for this image.</div>\n" +
    "<div class=\"has-error\" ng-show=\"forms.deployImage.name.$invalid && forms.deployImage.name.$touched\">\n" +
    "<div class=\"help-block\" ng-show=\"forms.deployImage.name.$error.required\">\n" +
    "A name is required.\n" +
    "</div>\n" +
    "<div class=\"help-block\" ng-show=\"forms.deployImage.name.$error.pattern\">\n" +
    "Name must be an alphanumeric (a-z, 0-9) string with a maximum length of 24 characters where the first character is a letter (a-z). The '-' character is allowed anywhere except the first or last character.\n" +
    "</div>\n" +
    "<div class=\"help-block\" ng-show=\"forms.deployImage.name.$error.minlength\">\n" +
    "Name must have at least 2 characters.\n" +
    "</div>\n" +
    "<div class=\"help-block\" ng-show=\"forms.deployImage.name.$error.maxlength\">\n" +
    "Name can't have more than 24 characters.\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"has-error\" ng-show=\"nameTaken\">\n" +
    "<span class=\"help-block\">This name is already in use within the project. Please choose a different name.</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "<osc-form-section header=\"Environment Variables\" about-title=\"Environment Variables\" about=\"Environment variables are used to configure and pass information to running containers.\" expand=\"true\" can-toggle=\"false\" class=\"first-section\">\n" +
    "<key-value-editor entries=\"env\" key-placeholder=\"Name\" key-validator=\"[A-Za-z_][A-Za-z0-9_]*\" key-validator-error=\"A valid environment variable name is an alphanumeric (a-z and 0-9) string beginning with a letter that may contain underscores.\" value-placeholder=\"Value\" value-from-selector-options=\"input.selectedProject.metadata.uid && valueFromNamespace[input.selectedProject.metadata.name]\" add-row-link=\"Add Value\" add-row-with-selectors-link=\"Add Value from Config Map or Secret\"></key-value-editor>\n" +
    "</osc-form-section>\n" +
    "<label-editor labels=\"labels\" expand=\"true\" can-toggle=\"false\" help-text=\"Each label is applied to each created resource.\">\n" +
    "</label-editor>\n" +
    "<alerts alerts=\"alerts\"></alerts>\n" +
    "<div ng-if=\"!isDialog\" class=\"button-group gutter-bottom\" ng-class=\"{'gutter-top': !alerts.length}\">\n" +
    "<button type=\"submit\" class=\"btn btn-primary btn-lg\" ng-click=\"create()\" value=\"\" ng-disabled=\"forms.deployImage.$invalid || nameTaken || disableInputs\">Create</button>\n" +
    "<a class=\"btn btn-default btn-lg\" href=\"#\" back>Cancel</a>\n" +
    "</div>\n" +
    "</ng-form>\n" +
    "</div>\n" +
    "<div ng-if=\"!loading && import.error\" class=\"empty-state-message text-center\">\n" +
    "<h2>\n" +
    "<i class=\"pficon pficon-error-circle-o\" aria-hidden=\"true\"></i>\n" +
    "Could not load image metadata.\n" +
    "</h2>\n" +
    "<p>{{import.error | upperFirst}}</p>\n" +
    "<p>The image may not exist or it may be in a secure registry. Check that you have entered the image name correctly or <a href=\"\" ng-click=\"openCreateWebhookSecretModal()\">create an image pull secret</a> with your image registry credentials and try again.</p>\n" +
    "</div>\n" +
    "<div ng-if=\"!loading && import && !import.error && !import.image\" class=\"empty-state-message text-center\">\n" +
    "<h2>\n" +
    "No image metadata found.\n" +
    "</h2>\n" +
    "<p>Could not find any images for {{import.name | stripTag}}:{{import.tag}}.</p>\n" +
    "</div>\n" +
    "</span>\n" +
    "</div>"
  );


  $templateCache.put('views/directives/deployment-donut.html',
    "<div class=\"deployment-donut\">\n" +
    "<div class=\"deployment-donut-row\">\n" +
    "<div class=\"deployment-donut-column\">\n" +
    "<pod-donut pods=\"pods\" desired=\"getDesiredReplicas()\" idled=\"isIdled\" ng-click=\"viewPodsForDeployment(rc)\" ng-class=\"{ clickable: (pods | hashSize) > 0 }\">\n" +
    "</pod-donut>\n" +
    "\n" +
    "<a href=\"\" class=\"sr-only\" ng-click=\"viewPodsForDeployment(rc)\" ng-if=\"(pods | hashSize) > 0\" role=\"button\">\n" +
    "View pods for {{rc | displayName}}\n" +
    "</a>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"deployment-donut-column scaling-controls fade-inline\" ng-if=\"(hpa && !hpa.length) && ((deploymentConfig || rc) | canIScale) && !isIdled\">\n" +
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
    "<div ng-if=\"hpa.length\" class=\"deployment-donut-row scaling-details\">\n" +
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
    "<a ng-if=\"rc.kind !== 'StatefulSet'\" ng-href=\"{{rc | navigateResourceURL}}?tab=events\" class=\"check-events\">Check events</a>\n" +
    "<a ng-if=\"rc.kind === 'StatefulSet'\" ng-href=\"project/{{rc.metadata.namespace}}/browse/events\" class=\"check-events\">Check events</a>\n" +
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


  $templateCache.put('views/directives/edit-config-map-or-secret.html',
    "<ng-form name=\"keyValueMapForm\">\n" +
    "<fieldset>\n" +
    "\n" +
    "<div ng-show=\"showNameInput\" class=\"form-group\">\n" +
    "<label for=\"key-value-map-name\" class=\"required\">Name</label>\n" +
    "\n" +
    "<div ng-class=\"{ 'has-error': keyValueMapForm.name.$invalid && keyValueMapForm.name.$touched }\">\n" +
    "<input id=\"key-value-map-name\" class=\"form-control\" type=\"text\" name=\"name\" ng-model=\"map.metadata.name\" ng-required=\"showNameInput\" ng-pattern=\"nameValidation.pattern\" ng-maxlength=\"nameValidation.maxlength\" placeholder=\"my-{{type}}\" select-on-focus autocorrect=\"off\" autocapitalize=\"none\" spellcheck=\"false\" aria-describedby=\"key-value-map-name-help\">\n" +
    "</div>\n" +
    "<div>\n" +
    "<span id=\"key-value-map-name-help\" class=\"help-block\">A unique name for the {{type}} within the project.</span>\n" +
    "</div>\n" +
    "<div class=\"has-error\" ng-show=\"keyValueMapForm.name.$error.pattern && keyValueMapForm.name.$touched\">\n" +
    "<span class=\"help-block\">\n" +
    "{{nameValidation.description}}\n" +
    "</span>\n" +
    "</div>\n" +
    "<div class=\"has-error\" ng-show=\"keyValueMapForm.name.$error.required && keyValueMapForm.name.$touched\">\n" +
    "<span class=\"help-block\">\n" +
    "Name is required.\n" +
    "</span>\n" +
    "</div>\n" +
    "<div class=\"has-error\" ng-show=\"keyValueMapForm.name.$error.maxlength\">\n" +
    "<span class=\"help-block\">\n" +
    "Can't be longer than {{nameValidation.maxlength}} characters.\n" +
    "</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"!data.length\">\n" +
    "<p><em>The {{type}} has no items.</em></p>\n" +
    "<a href=\"\" ng-click=\"addItem()\">Add Item</a>\n" +
    "</div>\n" +
    "<div ng-repeat=\"item in data\" ng-init=\"keys = getKeys()\">\n" +
    "<div class=\"form-group\">\n" +
    "<label ng-attr-for=\"key-{{$id}}\" class=\"required\">Key</label>\n" +
    "\n" +
    "<div ng-class=\"{ 'has-error': keyValueMapForm['key-' + $id].$invalid && keyValueMapForm['key-' + $id].$touched }\">\n" +
    "<input class=\"form-control\" name=\"key-{{$id}}\" ng-attr-id=\"key-{{$id}}\" type=\"text\" ng-model=\"item.key\" required ng-pattern=\"/^[-._a-zA-Z0-9]+$/\" ng-maxlength=\"253\" osc-unique=\"keys\" placeholder=\"my.key\" select-on-focus autocorrect=\"off\" autocapitalize=\"none\" spellcheck=\"false\" aria-describedby=\"key-{{$id}}-help\">\n" +
    "</div>\n" +
    "<div class=\"help-block\">\n" +
    "A unique key for this {{type}} entry.\n" +
    "</div>\n" +
    "<div class=\"has-error\" ng-show=\"keyValueMapForm['key-' + $id].$error.required && keyValueMapForm['key-' + $id].$touched\">\n" +
    "<span class=\"help-block\">\n" +
    "Key is required.\n" +
    "</span>\n" +
    "</div>\n" +
    "<div class=\"has-error\" ng-show=\"keyValueMapForm['key-' + $id].$error.oscUnique && keyValueMapForm['key-' + $id].$touched && item.key\">\n" +
    "<span class=\"help-block\">\n" +
    "Duplicate key \"{{item.key}}\". Keys must be unique within the {{type}}.\n" +
    "</span>\n" +
    "</div>\n" +
    "<div class=\"has-error\" ng-show=\"keyValueMapForm['key-' + $id].$error.pattern && keyValueMapForm['key-' + $id].$touched\">\n" +
    "<span class=\"help-block\">\n" +
    "Keys may only consist of letters, numbers, periods, hyphens, and underscores.\n" +
    "</span>\n" +
    "</div>\n" +
    "<div class=\"has-error\" ng-show=\"keyValueMapForm['key-' + $id].$error.maxlength\">\n" +
    "<span class=\"help-block\">\n" +
    "Keys may not be longer than 253 characters.\n" +
    "</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"form-group\" ng-attr-id=\"drop-zone-{{$id}}\">\n" +
    "<label ng-attr-for=\"name-{{$id}}\">Value</label>\n" +
    "<div ng-if=\"isBinaryFile\" class=\"h4\">\n" +
    "This file contains binary content.\n" +
    "</div>\n" +
    "<osc-file-input model=\"item.value\" drop-zone-id=\"drop-zone-{{$id}}\" help-text=\"Enter a value for the {{type}} entry or use the contents of a file.\" read-as-binary-string=\"readAsBinaryString\" is-binary-file=\"isBinaryFile\"></osc-file-input>\n" +
    "<div ui-ace=\"{\n" +
    "          theme: 'eclipse',\n" +
    "          rendererOptions: {\n" +
    "            showPrintMargin: false\n" +
    "          }\n" +
    "        }\" ng-model=\"item.value\" ng-if=\"!isBinaryFile\" class=\"ace-bordered ace-inline-small mar-top-sm\" ng-attr-id=\"value-{{$id}}\"></div>\n" +
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


  $templateCache.put('views/directives/edit-environment-from.html',
    "<ng-form name=\"$ctrl.editEnvironmentFromForm\" novalidate ng-class=\"{ 'has-sort' : !$ctrl.cannotSort && $ctrl.entries.length > 1}\">\n" +
    "<div ng-if=\"$ctrl.showHeader\" class=\"row form-row-has-controls input-labels\">\n" +
    "<div class=\"col-xs-6\">\n" +
    "<label class=\"input-label\">\n" +
    "Config Map/Secret\n" +
    "</label>\n" +
    "</div>\n" +
    "<div class=\"col-xs-6\" ng-if=\"!$ctrl.isEnvFromReadonly() && $ctrl.hasOptions()\">\n" +
    "<label class=\"input-label\">\n" +
    "Prefix\n" +
    "<small class=\"pficon pficon-help tooltip-default-icon\" aria-hidden=\"true\" data-toggle=\"tooltip\" data-original-title=\"Optional prefix added to each environment variable name. A valid prefix is an alphanumeric (a-z and 0-9) string beginning with a letter that may contain underscores.\"></small>\n" +
    "</label>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-model=\"$ctrl.entries\" class=\"environment-from-editor\" as-sortable=\"$ctrl.dragControlListeners\">\n" +
    "<div class=\"environment-from-entry row form-row-has-controls\" ng-class-odd=\"'odd'\" ng-class-even=\"'even'\" ng-repeat=\"entry in $ctrl.envFromEntries\" as-sortable-item>\n" +
    "<div class=\"environment-from-input col-xs-6 form-group\">\n" +
    "<div ng-if=\"$ctrl.isEnvFromReadonly(entry) || !$ctrl.hasOptions()\" class=\"faux-input-group\">\n" +
    "<div ng-if=\"!entry.configMapRef.name && !entry.secretRef.name\">\n" +
    "No config maps or secrets have been added as Environment From.\n" +
    "</div>\n" +
    "<div ng-if=\"entry.configMapRef.name || entry.secretRef.name\" class=\"faux-form-control readonly\">\n" +
    "Use all keys and values from\n" +
    "<span ng-if=\"entry.configMapRef.name\">config map {{entry.configMapRef.name}}.</span>\n" +
    "<span ng-if=\"entry.secretRef.name\">secret {{entry.secretRef.name}}.</span>\n" +
    "<span ng-if=\"entry.prefix\">Names will be prefixed with \"{{entry.prefix}}\"</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"!$ctrl.isEnvFromReadonly(entry) && $ctrl.hasOptions()\">\n" +
    "<div class=\"ui-select\">\n" +
    "<ui-select ng-model=\"entry.selectedEnvFrom\" ng-required=\"entry.selectedEnvFrom\" on-select=\"$ctrl.envFromObjectSelected($index, entry, $select.selected)\" ng-class=\"{'{{$ctrl.setFocusClass}}' : $last}\">\n" +
    "<ui-select-match placeholder=\"Select a resource\">\n" +
    "<span>\n" +
    "{{$select.selected.metadata.name}}\n" +
    "<small class=\"text-muted\">&ndash; {{$select.selected.kind | humanizeKind : true}}</small>\n" +
    "</span>\n" +
    "</ui-select-match>\n" +
    "<ui-select-choices repeat=\"source in $ctrl.envFromSelectorOptions | filter : { metadata: { name: $select.search } } track by (source | uid)\" group-by=\"$ctrl.groupByKind\">\n" +
    "<span ng-bind-html=\"source.metadata.name | highlight : $select.search\"></span>\n" +
    "</ui-select-choices>\n" +
    "</ui-select>\n" +
    "</div>\n" +
    "<div class=\"has-warning\" ng-if=\"$ctrl.hasInvalidEnvVar(entry.selectedEnvFrom.data)\">\n" +
    "<div class=\"help-block\">{{entry.selectedEnvFrom.kind | humanizeKind | upperFirst}} <strong>{{entry.selectedEnvFrom.metadata.name}}</strong> contains keys that are not valid environment variable names. Only {{entry.selectedEnvFrom.kind | humanizeKind}} keys with valid names will be added as environment variables.\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"environment-from-input col-xs-6 form-group\">\n" +
    "<div class=\"row\">\n" +
    "<div class=\"col-sm-6\">\n" +
    "<div class=\"environment-from-input\" ng-if=\"!$ctrl.isEnvFromReadonly(entry) && $ctrl.hasOptions()\" ng-class=\"{ 'has-error': ($ctrl.editEnvironmentFromForm['envfrom-prefix-'+$index].$invalid && $ctrl.editEnvironmentFromForm['envfrom-prefix-'+$index].$touched) }\">\n" +
    "<label for=\"envfrom-prefix-{{$index}}\" class=\"sr-only\">Prefix</label>\n" +
    "<input type=\"text\" class=\"form-control\" placeholder=\"Add prefix\" id=\"envfrom-prefix-{{$index}}\" name=\"envfrom-prefix-{{$index}}\" ng-model=\"entry.prefix\" ng-pattern=\"/^[A-Za-z_][A-Za-z0-9_]*$/\">\n" +
    "<span ng-show=\"$ctrl.editEnvironmentFromForm['envfrom-prefix-'+$index].$touched\">\n" +
    "<span class=\"help-block key-validation-error\" ng-show=\"$ctrl.editEnvironmentFromForm['envfrom-prefix-'+$index].$error.pattern\">\n" +
    "<span class=\"validation-text\">Please enter a valid prefix.</span>\n" +
    "</span>\n" +
    "</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"col-sm-6\">\n" +
    "<div class=\"environment-from-view-details\" ng-if=\"entry.selectedEnvFrom\">\n" +
    "<a href=\"\" ng-click=\"$ctrl.viewOverlayPanel(entry.selectedEnvFrom)\">View Details</a>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"!$ctrl.isEnvFromReadonly(entry) && $ctrl.hasEntries()\" class=\"environment-from-editor-button form-row-controls\">\n" +
    "<button ng-if=\"!$ctrl.cannotSort && $ctrl.entries.length > 1\" class=\"sort-row\" type=\"button\" aria-hidden=\"true\" aria-grabbed=\"false\" as-sortable-item-handle>\n" +
    "<span class=\"fa fa-bars\"></span>\n" +
    "<span class=\"sr-only\">Move row</span>\n" +
    "</button>\n" +
    "<button ng-if=\"!$ctrl.cannotDeleteAny\" class=\"btn-remove close delete-row as-sortable-item-delete\" type=\"button\" aria-hidden=\"true\" ng-click=\"$ctrl.deleteEntry($index, 1)\">\n" +
    "<span class=\"pficon pficon-close\" aria-hidden=\"true\"></span>\n" +
    "<span class=\"sr-only\">Delete row</span>\n" +
    "</button>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"environment-from-entry\" ng-if=\"!$ctrl.isEnvFromReadonly() && $ctrl.hasOptions()\">\n" +
    "<a href=\"\" class=\"add-row-link\" role=\"button\" ng-click=\"$ctrl.onAddRow()\">Add ALL Values from Config Map or Secret</a>\n" +
    "</div>\n" +
    "</div>\n" +
    "<overlay-panel class=\"overlay-panel-as-modal add-config-to-application\" show-panel=\"$ctrl.overlayPanelVisible\" handle-close=\"$ctrl.closeOverlayPanel\">\n" +
    "<div class=\"modal-header\">\n" +
    "<button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\" aria-label=\"Close\" ng-click=\"$ctrl.closeOverlayPanel()\">\n" +
    "<span class=\"pficon pficon-close\"></span>\n" +
    "</button>\n" +
    "<h1 class=\"modal-title\">{{$ctrl.overlayPaneEntryDetails.kind | humanizeKind : true}} Details</h1>\n" +
    "</div>\n" +
    "<div class=\"modal-body\">\n" +
    "<h4>{{$ctrl.overlayPaneEntryDetails.metadata.name}}\n" +
    "<small ng-if=\"$ctrl.overlayPaneEntryDetails.kind === 'Secret'\" class=\"mar-left-sm\">\n" +
    "<a href=\"\" role=\"button\" ng-click=\"$ctrl.showSecret = !$ctrl.showSecret\">{{$ctrl.showSecret ? \"Hide\" : \"Reveal\"}} Secret</a>\n" +
    "</small>\n" +
    "</h4>\n" +
    "<div ng-if=\"!($ctrl.overlayPaneEntryDetails.data | size)\" class=\"empty-state-message text-center\">\n" +
    "The {{$ctrl.overlayPaneEntryDetails.kind | humanizeKind}} has no properties.\n" +
    "</div>\n" +
    "<div ng-if=\"$ctrl.overlayPaneEntryDetails.data | size\" class=\"table-responsive scroll-shadows-horizontal\">\n" +
    "<table class=\"table table-bordered table-bordered-columns config-map-table key-value-table\">\n" +
    "<tbody>\n" +
    "<tr ng-repeat=\"(key, value) in $ctrl.decodedData\">\n" +
    "<td class=\"key\">\n" +
    "{{key}}\n" +
    "<span ng-if=\"$ctrl.isEnvVarInvalid(key)\" class=\"pficon pficon-warning-triangle-o tooltip-default-icon\" data-toggle=\"popover\" data-trigger=\"hover\" dynamic-content=\"{{key}} is not a valid environment variable name and will not be added.\"></span>\n" +
    "</td>\n" +
    "<td class=\"value\">\n" +
    "<truncate-long-text ng-if=\"$ctrl.overlayPaneEntryDetails.kind === 'ConfigMap'\" content=\"value\" limit=\"50\" newline-limit=\"2\" expandable=\"true\">\n" +
    "</truncate-long-text>\n" +
    "<span ng-if=\"!$ctrl.showSecret && $ctrl.overlayPaneEntryDetails.kind === 'Secret'\">&#42;&#42;&#42;&#42;&#42;</span>\n" +
    "<div ng-if=\"$ctrl.showSecret && $ctrl.overlayPaneEntryDetails.kind === 'Secret'\">\n" +
    "<truncate-long-text content=\"value\" limit=\"50\" newline-limit=\"2\" expandable=\"true\">\n" +
    "</truncate-long-text>\n" +
    "<div ng-if=\"decodedData.$$nonprintable[key]\" class=\"help-block\">\n" +
    "This secret value contains non-printable characters and is displayed as a Base64-encoded string.\n" +
    "</div>\n" +
    "</div>\n" +
    "</td>\n" +
    "</tr>\n" +
    "</tbody>\n" +
    "</table>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"modal-footer\">\n" +
    "<button ng-click=\"$ctrl.closeOverlayPanel()\" type=\"button\" class=\"btn btn-default\">Close</button>\n" +
    "</div>\n" +
    "</overlay-panel>\n" +
    "</ng-form>"
  );


  $templateCache.put('views/directives/edit-environment-variables.html',
    "<form ng-if=\"$ctrl.apiObject\" name=\"$ctrl.form\" class=\"mar-bottom-xl\">\n" +
    "<confirm-on-exit ng-if=\"$ctrl.canIUpdate && !$ctrl.ngReadonly\" dirty=\"$ctrl.form.$dirty\"></confirm-on-exit>\n" +
    "<div ng-repeat=\"container in $ctrl.containers track by container.name\">\n" +
    "<h3>Container {{container.name}}</h3>\n" +
    "<div ng-if=\"!$ctrl.canIUpdate || $ctrl.ngReadonly\">\n" +
    "<span ng-if=\"!container.env.length\">\n" +
    "No environment variables set in the {{$ctrl.apiObject.kind | humanizeKind}} template for container {{container.name}}.\n" +
    "</span>\n" +
    "<key-value-editor ng-if=\"container.env.length\" entries=\"container.env\" key-placeholder=\"Name\" value-placeholder=\"Value\" cannot-add cannot-sort cannot-delete is-readonly show-header>\n" +
    "</key-value-editor>\n" +
    "</div>\n" +
    "<key-value-editor ng-if=\"$ctrl.canIUpdate && !$ctrl.ngReadonly\" entries=\"container.env\" key-placeholder=\"Name\" value-placeholder=\"Value\" value-from-selector-options=\"$ctrl.valueFromObjects\" key-validator=\"[A-Za-z_][A-Za-z0-9_]*\" key-validator-error=\"Please enter a valid key.\" key-validator-error-tooltip=\"A valid environment variable name is an alphanumeric (a-z and 0-9) string beginning with a letter that may contain underscores.\" add-row-link=\"Add Value\" add-row-with-selectors-link=\"Add Value from Config Map or Secret\" show-header>\n" +
    "</key-value-editor>\n" +
    "<h4>\n" +
    "Environment From\n" +
    "<span class=\"pficon pficon-help tooltip-default-icon\" aria-hidden=\"true\" data-toggle=\"tooltip\" data-original-title=\"Environment From lets you add all key-value pairs from a config map or secret as environment variables.\"></span>\n" +
    "</h4>\n" +
    "<edit-environment-from entries=\"container.envFrom\" env-from-selector-options=\"$ctrl.valueFromObjects\" is-readonly=\"$ctrl.ngReadonly\" show-header>\n" +
    "</edit-environment-from>\n" +
    "</div>\n" +
    "<div class=\"gutter-top-bottom\">\n" +
    "<button class=\"btn btn-default\" ng-if=\"$ctrl.canIUpdate && !$ctrl.ngReadonly\" ng-click=\"$ctrl.save()\" ng-disabled=\"$ctrl.form.$pristine || $ctrl.form.$invalid\">Save</button>\n" +
    "<a ng-if=\"!$ctrl.form.$pristine\" href=\"\" ng-click=\"$ctrl.clearChanges()\" class=\"mar-left-sm clear-env-changes-link\">Clear Changes</a>\n" +
    "</div>\n" +
    "</form>"
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
    "<label class=\"radio-inline\">\n" +
    "<input type=\"radio\" name=\"{{type}}-action-newpod\" ng-model=\"action.type\" value=\"execNewPod\" aria-describedby=\"action-help\">\n" +
    "Run a specific command in a new pod\n" +
    "</label>\n" +
    "<label class=\"radio-inline\">\n" +
    "<input type=\"radio\" name=\"{{type}}-action-images\" ng-model=\"action.type\" value=\"tagImages\" aria-describedby=\"action-help\">\n" +
    "Tag image if the deployment succeeds\n" +
    "</label>\n" +
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
    "<key-value-editor entries=\"hookParams.execNewPod.env\" key-validator=\"[a-zA-Z_][a-zA-Z0-9_]*\" key-validator-error-tooltip=\"A valid environment variable name is an alphanumeric (a-z and 0-9) string beginning with a letter that may contain underscores.\" value-from-selector-options=\"valueFromObjects\" add-row-with-selectors-link=\"Add Value from Config Map or Secret\" add-row-link=\"Add Value\"></key-value-editor>\n" +
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
    "<istag-select model=\"istagHook\" allow-custom-tag=\"true\" select-required=\"true\" select-disabled=\"view.isDisabled\"></istag-select>\n" +
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


  $templateCache.put('views/directives/events-badge.html',
    "<a ng-href=\"project/{{projectContext.projectName}}/browse/events\" class=\"events-badge visible-xs\"><span class=\"event-label\">Events</span><span ng-if=\"warningCount\" class=\"mar-left-md\"><span class=\"pficon pficon-warning-triangle-o mar-right-sm\" aria-hidden=\"true\"></span><span class=\"sr-only\">Warning</span><span class=\"event-count\">{{warningCount}}</span></span><span ng-if=\"normalCount\" class=\"mar-left-md\"><span class=\"pficon pficon-info mar-right-sm\" aria-hidden=\"true\"></span><span class=\"sr-only\">Normal</span><span class=\"event-count\">{{normalCount}}</span></span></a>\n" +
    "<a href=\"\" ng-click=\"expandSidebar()\" ng-if=\"sidebarCollapsed\" class=\"events-badge hidden-xs\"><span class=\"events-sidebar-expand fa fa-arrow-circle-o-left mar-right-md\"><span class=\"sr-only\">Expand event sidebar</span></span><span class=\"event-label\">Events</span><span ng-if=\"warningCount\" class=\"mar-left-md\"><span class=\"pficon pficon-warning-triangle-o mar-right-sm\" aria-hidden=\"true\"></span><span class=\"sr-only\">Warning</span><span class=\"event-count\">{{warningCount}}</span></span><span ng-if=\"normalCount\" class=\"mar-left-md\"><span class=\"pficon pficon-info mar-right-sm\" aria-hidden=\"true\"></span><span class=\"sr-only\">Normal</span><span class=\"event-count\">{{normalCount}}</span></span></a>"
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
    "<div ng-if=\"!(events | hashSize)\" class=\"event\">\n" +
    "<em>No events.</em>\n" +
    "</div>\n" +
    "<div ng-repeat=\"event in events track by (event | uid)\" class=\"event animate-repeat\" ng-class=\"{'highlight': highlightedEvents[event.involvedObject.kind + '/' + event.involvedObject.name]}\">\n" +
    "<span class=\"sr-only\">{{event.type}}</span>\n" +
    "<div class=\"event-icon\" aria-hidden=\"true\">\n" +
    "<div ng-switch=\"event.type\" class=\"hide-ng-leave\">\n" +
    "<span ng-switch-when=\"Warning\" class=\"pficon pficon-warning-triangle-o\"></span>\n" +
    "<span ng-switch-when=\"Normal\" class=\"pficon pficon-info\"></span>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"event-details\">\n" +
    "<div class=\"detail-group\">\n" +
    "<div class=\"event-reason\">\n" +
    "{{event.reason | humanizeReason}}\n" +
    "</div>\n" +
    "<div class=\"event-object\" ng-init=\"resourceURL = (event | navigateEventInvolvedObjectURL)\">\n" +
    "<a ng-if=\"resourceURL\" ng-attr-title=\"Navigate to {{event.involvedObject.name}}\" href=\"{{resourceURL}}\">\n" +
    "{{event.involvedObject.kind | kindToResource | abbreviateResource}}/{{event.involvedObject.name}}\n" +
    "</a>\n" +
    "<span ng-if=\"!(resourceURL)\">{{event.involvedObject.kind | kindToResource | abbreviateResource}}/{{event.involvedObject.name}}</span>\n" +
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
    "<div class=\"table-filter-extension\">\n" +
    "<div class=\"data-toolbar\">\n" +
    "<form role=\"form\" class=\"search-pf has-button\">\n" +
    "<div class=\"form-group filter-controls has-clear\">\n" +
    "<div class=\"search-pf-input-group\">\n" +
    "<label for=\"events-filter\" class=\"sr-only\">Filter</label>\n" +
    "<input type=\"search\" placeholder=\"Filter by keyword\" class=\"form-control\" id=\"events-filter\" ng-model=\"filter.text\" autocorrect=\"off\" autocapitalize=\"none\" spellcheck=\"false\">\n" +
    "<button type=\"button\" class=\"clear\" aria-hidden=\"true\" ng-if=\"filter.text\" ng-click=\"filter.text = ''\">\n" +
    "<span class=\"pficon pficon-close\"></span>\n" +
    "</button>\n" +
    "</div>\n" +
    "</div>\n" +
    "</form>\n" +
    "<div class=\"vertical-divider\"></div>\n" +
    "<div class=\"sort-group\">\n" +
    "<span class=\"sort-label\">Sort by</span>\n" +
    "<pf-sort config=\"sortConfig\" class=\"sort-controls\"></pf-sort>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<table class=\"table table-bordered table-condensed table-mobile table-layout-fixed events-table\">\n" +
    "<thead>\n" +
    "<tr>\n" +
    "<th id=\"time\">Time</th>\n" +
    "\n" +
    "<th id=\"kind-name\" ng-if=\"showKindAndName\">\n" +
    "<span class=\"hidden-xs-inline visible-sm-inline visible-md-inline hidden-lg-inline\">Kind and Name</span>\n" +
    "<span class=\"visible-lg-inline\">Name</span>\n" +
    "</th>\n" +
    "<th id=\"kind\" ng-if=\"showKindAndName\" class=\"hidden-sm hidden-md\">\n" +
    "<span class=\"visible-lg-inline\">Kind</span>\n" +
    "</th>\n" +
    "<th id=\"severity\" class=\"hidden-xs hidden-sm hidden-md\"><span class=\"sr-only\">Severity</span></th>\n" +
    "<th id=\"reason\" class=\"hidden-sm hidden-md\"><span class=\"visible-lg-inline\">Reason</span></th>\n" +
    "<th id=\"message\"><span class=\"hidden-xs-inline visible-sm-inline visible-md-inline hidden-lg-inline\">Reason and </span>Message</th>\n" +
    "</tr>\n" +
    "</thead>\n" +
    "<tbody ng-if=\"(filteredEvents | hashSize) === 0\">\n" +
    "<tr>\n" +
    "<td class=\"hidden-lg\" colspan=\"{{showKindAndName ? 3 : 2}}\">\n" +
    "<span ng-if=\"(events | hashSize) === 0\"><em>No events to show.</em></span>\n" +
    "<span ng-if=\"(events | hashSize) > 0\">\n" +
    "All events hidden by filter.\n" +
    "<button type=\"button\" class=\"btn btn-link inline-btn-link\" ng-click=\"filter.text = ''\">Clear All Filters</button>\n" +
    "</span>\n" +
    "</td>\n" +
    "<td class=\"hidden-xs hidden-sm hidden-md\" colspan=\"{{showKindAndName ? 6 : 4}}\">\n" +
    "<span ng-if=\"(events | hashSize) === 0\"><em>No events to show.</em></span>\n" +
    "<span ng-if=\"(events | hashSize) > 0\">\n" +
    "All events hidden by filter.\n" +
    "<button type=\"button\" class=\"btn btn-link inline-btn-link\" ng-click=\"filter.text = ''\">Clear All Filters</button>\n" +
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
    "<span ng-init=\"resourceURL = (event | navigateEventInvolvedObjectURL)\">\n" +
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
    "<span ng-bind-html=\"event.reason | humanizeReason | highlightKeywords : filterExpressions\"></span>&nbsp;<span class=\"visible-xs-inline pficon pficon-warning-triangle-o\" ng-show=\"event.type === 'Warning'\" aria-hidden=\"true\" data-toggle=\"tooltip\" data-original-title=\"Warning\"></span>\n" +
    "</td>\n" +
    "<td data-title=\"Message\">\n" +
    "<div class=\"hidden-xs-block visible-sm-block visible-md-block hidden-lg-block\">\n" +
    "<span ng-bind-html=\"event.reason | humanizeReason | highlightKeywords : filterExpressions\"></span>&nbsp;\n" +
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


  $templateCache.put('views/directives/from-file-dialog.html',
    "<pf-wizard wizard-title=\"Import YAML / JSON\" on-cancel=\"$ctrl.close()\" on-finish=\"$ctrl.close()\" hide-sidebar=\"true\" next-title=\"$ctrl.nextButtonTitle\" next-callback=\"$ctrl.nextCallback\" current-step=\"$ctrl.currentStep\" wizard-done=\"$ctrl.wizardDone\" on-step-changed=\"$ctrl.stepChanged(step)\" step-class=\"order-service-wizard-step\">\n" +
    "<pf-wizard-step step-title=\"YAML / JSON\" step-id=\"file\" step-priority=\"1\" substeps=\"false\" ok-to-nav-away=\"true\" allow-click-nav=\"false\" next-enabled=\"!$ctrl.importForm.$invalid\">\n" +
    "<div class=\"wizard-pf-main-inner-shadow-covers\">\n" +
    "<div class=\"order-service-config\">\n" +
    "<div class=\"wizard-pf-main-form-contents\">\n" +
    "<form name=\"$ctrl.importForm\">\n" +
    "<from-file is-dialog=\"true\" project=\"$ctrl.project\"></from-file>\n" +
    "</form>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</pf-wizard-step>\n" +
    "<pf-wizard-step wz-disabled=\"{{!$ctrl.template}}\" step-title=\"Template Configuration\" step-id=\"template\" step-priority=\"2\" substeps=\"false\" ok-to-nav-away=\"true\" allow-click-nav=\"false\" next-enabled=\"!$ctrl.templateForm.$invalid\">\n" +
    "<div class=\"wizard-pf-main-inner-shadow-covers\" ng-if=\"$ctrl.template\">\n" +
    "<div class=\"order-service-details\">\n" +
    "<div class=\"order-service-details-top\" ng-class=\"{'order-service-details-top-icon-top': ($ctrl.vendor || ($ctrl.docUrl || $ctrl.supportUrl))}\">\n" +
    "<div class=\"service-icon\">\n" +
    "<span ng-if=\"$ctrl.image\" class=\"image\"><img ng-src=\"{{$ctrl.image}}\" alt=\"\"></span>\n" +
    "<span ng-if=\"!$ctrl.image\" class=\"icon {{$ctrl.iconClass}}\" aria-hidden=\"true\"></span>\n" +
    "</div>\n" +
    "<div class=\"service-title-area\">\n" +
    "<div class=\"service-title\">\n" +
    "{{$ctrl.template | displayName}}\n" +
    "</div>\n" +
    "<div ng-if=\"$ctrl.vendor\" class=\"service-vendor\">\n" +
    "{{$ctrl.vendor}}\n" +
    "</div>\n" +
    "<div class=\"order-service-tags\">\n" +
    "<span ng-repeat=\"tag in $ctrl.template.metadata.annotations.tags.split(',')\" class=\"tag\">\n" +
    "{{tag}}\n" +
    "</span>\n" +
    "</div>\n" +
    "<ul ng-if=\"$ctrl.docUrl || $ctrl.supportUrl\" class=\"list-inline order-service-documentation-url\">\n" +
    "<li ng-if=\"$ctrl.docUrl\">\n" +
    "<a ng-href=\"{{$ctrl.docUrl}}\" target=\"_blank\" class=\"learn-more-link\">View Documentation <i class=\"fa fa-external-link\" aria-hidden=\"true\"></i></a>\n" +
    "</li>\n" +
    "<li ng-if=\"$ctrl.supportUrl\">\n" +
    "<a ng-href=\"{{$ctrl.supportUrl}}\" target=\"_blank\" class=\"learn-more-link\">Get Support <i class=\"fa fa-external-link\" aria-hidden=\"true\"></i></a>\n" +
    "</li>\n" +
    "</ul>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"order-service-description-block\">\n" +
    "<p ng-bind-html=\"($ctrl.template | description | linky : '_blank') || 'No description provided.'\" class=\"description\"></p>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"order-service-config\">\n" +
    "<div class=\"wizard-pf-main-form-contents\">\n" +
    "<div class=\"osc-form\">\n" +
    "<alerts alerts=\"$ctrl.alerts\"></alerts>\n" +
    "<form name=\"$ctrl.templateForm\">\n" +
    "<process-template ng-if=\"$ctrl.template\" project=\"$ctrl.selectedProject\" template=\"$ctrl.template\" alerts=\"$ctrl.alerts\" is-dialog=\"true\"></process-template>\n" +
    "</form>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</pf-wizard-step>\n" +
    "<pf-wizard-step step-title=\"Results\" step-id=\"results\" step-priority=\"3\" substeps=\"false\" ok-to-nav-away=\"true\" allow-click-nav=\"false\" prev-enabled=\"false\">\n" +
    "<div class=\"wizard-pf-main-inner-shadow-covers\">\n" +
    "<div class=\"order-service-config\">\n" +
    "<div class=\"wizard-pf-main-form-contents\">\n" +
    "\n" +
    "<next-steps ng-if=\"$ctrl.currentStep === 'Results'\" project=\"$ctrl.selectedProject\" project-name=\"$ctrl.selectedProject.metadata.name\" login-base-url=\"$ctrl.loginBaseUrl\" on-continue=\"$ctrl.close\" show-project-name=\"$ctrl.showProjectName\" kind=\"$ctrl.kind\" name=\"$ctrl.name\" action-label=\"$ctrl.actionLabel\">\n" +
    "</next-steps>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</pf-wizard-step>\n" +
    "</pf-wizard>"
  );


  $templateCache.put('views/directives/from-file.html',
    "<select-project ng-if=\"!project\" selected-project=\"input.selectedProject\" name-taken=\"projectNameTaken\"></select-project>\n" +
    "<span ng-show=\"!noProjectsCantCreate\">\n" +
    "<p>\n" +
    "Create or replace resources from their YAML or JSON definitions. If adding a template, you'll have the option to process the template.\n" +
    "</p>\n" +
    "<parse-error error=\"error\" ng-show=\"error\"></parse-error>\n" +
    "<div class=\"row\">\n" +
    "<div class=\"col-sm-12 pod-bottom-xl\">\n" +
    "<form name=\"form\" id=\"from-file\">\n" +
    "<ui-ace-yaml resource=\"resource\" ng-required=\"true\" show-file-input=\"true\"></ui-ace-yaml>\n" +
    "<div ng-if=\"!isDialog\" class=\"buttons gutter-bottom\">\n" +
    "<button type=\"submit\" ng-click=\"create()\" ng-disabled=\"form.$invalid\" class=\"btn btn-primary btn-lg\">\n" +
    "Create\n" +
    "</button>\n" +
    "<a class=\"btn btn-default btn-lg\" href=\"\" role=\"button\" ng-click=\"cancel()\">\n" +
    "Cancel\n" +
    "</a>\n" +
    "</div>\n" +
    "</form>\n" +
    "</div>\n" +
    "</div>\n" +
    "</span>"
  );


  $templateCache.put('views/directives/header/_navbar-utility-mobile.html',
    "<nav class=\"nav-vertical-utility visible-xs-block\">\n" +
    "<ul extension-point extension-name=\"nav-dropdown-mobile\" extension-types=\"dom\" extension-args=\"[user]\" class=\"list-group\"></ul>\n" +
    "</nav>"
  );


  $templateCache.put('views/directives/header/_navbar-utility.html',
    "<ul class=\"nav navbar-nav navbar-right navbar-iconic\">\n" +
    "<li extension-point extension-name=\"nav-system-status\" extension-types=\"dom\"></li>\n" +
    "<notification-counter ng-hide=\"chromeless\"></notification-counter>\n" +
    "<li ng-if=\"launcherApps.length > 0\">\n" +
    "<pf-application-launcher items=\"launcherApps\" is-list=\"true\"></pf-application-launcher>\n" +
    "</li>\n" +
    "<li uib-dropdown>\n" +
    "<a uib-dropdown-toggle class=\"nav-item-iconic\" id=\"help-dropdown\" href=\"\">\n" +
    "<span title=\"Help\" class=\"fa pficon-help\" aria-hidden=\"true\"></span>\n" +
    "<span class=\"sr-only\">Help</span>\n" +
    "<span class=\"caret\" aria-hidden=\"true\"></span>\n" +
    "</a>\n" +
    "<ul uib-dropdown-menu aria-labelledby=\"help-dropdown\" extension-point extension-name=\"nav-help-dropdown\" extension-types=\"dom html\"></ul>\n" +
    "</li>\n" +
    "<li uib-dropdown ng-cloak ng-if=\"user\">\n" +
    "<a href=\"\" uib-dropdown-toggle id=\"user-dropdown\" class=\"nav-item-iconic\">\n" +
    "<span class=\"fa pf-icon pficon-user\" aria-hidden=\"true\"></span>\n" +
    "<span class=\"username truncate\">{{user.fullName || user.metadata.name}}</span> <span class=\"caret\" aria-hidden=\"true\"></span>\n" +
    "</a>\n" +
    "<ul uib-dropdown-menu aria-labelledby=\"user-dropdown\" extension-point extension-name=\"nav-user-dropdown\" extension-types=\"dom html\"></ul>\n" +
    "</li>\n" +
    "</ul>"
  );


  $templateCache.put('views/directives/header/header.html',
    "<nav class=\"navbar navbar-pf-vertical\" role=\"navigation\">\n" +
    "<div class=\"navbar-header\">\n" +
    "<button type=\"button\" class=\"navbar-toggle visible-xs\" ng-click=\"toggleMobileNav()\" on-esc=\"closeMobileNav()\">\n" +
    "<span class=\"sr-only\">Toggle navigation</span>\n" +
    "<span class=\"icon-bar\"></span>\n" +
    "<span class=\"icon-bar\"></span>\n" +
    "<span class=\"icon-bar\"></span>\n" +
    "</button>\n" +
    "\n" +
    "<a class=\"navbar-brand\" id=\"openshift-logo\" href=\"./catalog\">\n" +
    "<div id=\"header-logo\"></div>\n" +
    "</a>\n" +
    "</div>\n" +
    "<div class=\"nav contextselector-pf hidden-xs hidden-sm\" ng-show=\"clusterConsoleURL\">\n" +
    "<select class=\"selectpicker contextselector\">\n" +
    "<option value=\"catalog\">Service Catalog</option>\n" +
    "<option value=\"application-console\">Application Console</option>\n" +
    "<option value=\"cluster-console\">Cluster Console</option>\n" +
    "</select>\n" +
    "</div>\n" +
    "<navbar-utility></navbar-utility>\n" +
    "</nav>\n" +
    "<div ng-show=\"view.hasProject\" class=\"project-bar\">\n" +
    "<div class=\"toggle-menu\">\n" +
    "<button type=\"button\" class=\"navbar-toggle project-action-btn\" ng-click=\"toggleNav()\">\n" +
    "<span class=\"sr-only\">Toggle navigation</span>\n" +
    "<span class=\"icon-bar\"></span>\n" +
    "<span class=\"icon-bar\"></span>\n" +
    "<span class=\"icon-bar\"></span>\n" +
    "</button>\n" +
    "</div>\n" +
    "<div class=\"form-group\">\n" +
    "\n" +
    "<select class=\"selectpicker project-picker form-control\" id=\"boostrapSelect\" title=\"\"></select>\n" +
    "</div>\n" +
    "<catalog-search ng-if=\"canIAddToProject\" catalog-items=\"catalogItems\" base-project-url=\"project\" toggle-at-mobile=\"true\" search-toggle-callback=\"onSearchToggle\"></catalog-search>\n" +
    "\n" +
    "<div class=\"dropdown add-to-project\" ng-if=\"canIAddToProject\" uib-dropdown>\n" +
    "<button class=\"dropdown-toggle btn btn-link\" ng-disabled=\"currentProject.status.phase != 'Active'\" title=\"Add to Project\" uib-dropdown-toggle>\n" +
    "<i class=\"fa fa-plus visible-xs-inline-block\" aria-hidden=\"true\" title=\"Add to Project\"></i>\n" +
    "<span class=\"hidden-xs\">Add to Project</span>\n" +
    "<span class=\"hidden-xs caret\" aria-hidden=\"true\" title=\"Add to Project\"></span>\n" +
    "</button>\n" +
    "<ul role=\"menu\" uib-dropdown-menu class=\"dropdown-menu dropdown-menu-right\">\n" +
    "<li ng-if-start=\"!catalogLandingPageEnabled\" role=\"menuitem\"><a ng-href=\"project/{{currentProjectName}}/create?tab=fromCatalog\">Browse Catalog</a></li>\n" +
    "<li role=\"menuitem\"><a ng-href=\"project/{{currentProjectName}}/create?tab=deployImage\">Deploy Image</a></li>\n" +
    "<li ng-if-end role=\"menuitem\"><a ng-href=\"project/{{currentProjectName}}/create?tab=fromFile\">Import YAML / JSON</a></li>\n" +
    "<li ng-if-start=\"catalogLandingPageEnabled\" role=\"menuitem\"><a href=\"{{currentProjectName | catalogURL}}\">Browse Catalog</a></li>\n" +
    "<li role=\"menuitem\"><a href=\"\" ng-click=\"showOrderingPanel('deployImage')\">Deploy Image</a></li>\n" +
    "<li ng-if-end role=\"menuitem\"><a href=\"\" ng-click=\"showOrderingPanel('fromFile')\">Import YAML / JSON</a></li>\n" +
    "<li role=\"menuitem\"><a href=\"\" ng-click=\"showOrderingPanel('fromProject')\">Select from Project</a></li>\n" +
    "</ul>\n" +
    "</div>\n" +
    "</div> \n" +
    "<sidebar></sidebar>\n" +
    "<overlay-panel show-panel=\"orderingPanelVisible\" handle-close=\"closeOrderingPanel\">\n" +
    "<deploy-image-dialog ng-if=\"orderKind === 'deployImage'\" project=\"currentProject\" context=\"context\" on-dialog-closed=\"closeOrderingPanel\"></deploy-image-dialog>\n" +
    "<from-file-dialog ng-if=\"orderKind === 'fromFile'\" project=\"currentProject\" context=\"context\" on-dialog-closed=\"closeOrderingPanel\"></from-file-dialog>\n" +
    "<process-template-dialog ng-if=\"orderKind === 'fromProject'\" project=\"currentProject\" use-project-template=\"true\" on-dialog-closed=\"closeOrderingPanel\"></process-template-dialog>\n" +
    "<process-template-dialog ng-if=\"orderKind === 'Template'\" project=\"currentProject\" template=\"selectedItem\" on-dialog-closed=\"closeOrderingPanel\"></process-template-dialog>\n" +
    "<order-service ng-if=\"orderKind === 'ClusterServiceClass'\" add-to-project=\"currentProject\" base-project-url=\"project\" service-class=\"selectedItem\" service-plans=\"servicePlansForItem\" handle-close=\"closeOrderingPanel\"></order-service>\n" +
    "<create-from-builder ng-if=\"orderKind === 'ImageStream'\" add-to-project=\"currentProject\" base-project-url=\"project\" image-stream=\"selectedItem\" handle-close=\"closeOrderingPanel\"></create-from-builder>\n" +
    "</overlay-panel>"
  );


  $templateCache.put('views/directives/hpa.html',
    "<h4>\n" +
    "{{hpa.metadata.name}}\n" +
    "\n" +
    "<span ng-if=\"'horizontalPodAutoscalers' | canIDoAny\" class=\"header-actions\">\n" +
    "<a ng-if=\"{resource: 'horizontalpodautoscalers', group: 'autoscaling'} | canI : 'update'\" ng-href=\"project/{{hpa.metadata.namespace}}/edit/autoscaler?kind=HorizontalPodAutoscaler&group=autoscaling&name={{hpa.metadata.name}}\" role=\"button\">Edit</a>\n" +
    "<span class=\"action-divider\">|</span>\n" +
    "<delete-link ng-if=\"{resource: 'horizontalpodautoscalers', group: 'autoscaling'} | canI : 'delete'\" kind=\"HorizontalPodAutoscaler\" group=\"autoscaling\" resource-name=\"{{hpa.metadata.name}}\" project-name=\"{{hpa.metadata.namespace}}\" label=\"Remove\" alerts=\"alerts\" stay-on-current-page=\"true\">\n" +
    "</delete-link>\n" +
    "</span>\n" +
    "</h4>\n" +
    "<dl class=\"dl-horizontal left mar-top-md\">\n" +
    "<dt ng-if-start=\"showScaleTarget && hpa.spec.scaleTargetRef.kind && hpa.spec.scaleTargetRef.name\">{{hpa.spec.scaleTargetRef.kind | humanizeKind : true}}:</dt>\n" +
    "<dd ng-if-end>\n" +
    "<a ng-href=\"{{hpa.spec.scaleTargetRef.name | navigateResourceURL : hpa.spec.scaleTargetRef.kind : hpa.metadata.namespace}}\">{{hpa.spec.scaleTargetRef.name}}</a>\n" +
    "</dd>\n" +
    "<dt>Min Pods:</dt>\n" +
    "<dd>{{hpa.spec.minReplicas || 1}}</dd>\n" +
    "<dt>Max Pods:</dt>\n" +
    "<dd>{{hpa.spec.maxReplicas}}</dd>\n" +
    "<dt ng-if-start=\"hpa.spec.targetCPUUtilizationPercentage\">\n" +
    "CPU Request\n" +
    "</dt>\n" +
    "<dd ng-if-end>{{hpa.spec.targetCPUUtilizationPercentage}}%</dd>\n" +
    "<dt>\n" +
    "Current Usage:\n" +
    "</dt>\n" +
    "<dd ng-if=\"hpa.status.currentCPUUtilizationPercentage | isNil\">\n" +
    "<em>Not available</em>\n" +
    "</dd>\n" +
    "<dd ng-if=\"!(hpa.status.currentCPUUtilizationPercentage | isNil)\">\n" +
    "{{hpa.status.currentCPUUtilizationPercentage}}%\n" +
    "</dd>\n" +
    "<dt ng-if-start=\"hpa.status.lastScaleTime\">Last Scaled:</dt>\n" +
    "<dd ng-if-end><span am-time-ago=\"hpa.status.lastScaleTime\"></span></dd>\n" +
    "</dl>"
  );


  $templateCache.put('views/directives/key-value-editor.html',
    "<ng-form name=\"forms.keyValueEditor\" novalidate ng-if=\"entries\" ng-class=\"{ 'has-sort' : (!cannotSort) && (entries.length > 1)}\">\n" +
    "<div ng-if=\"showHeader\" class=\"row form-row-has-controls input-labels\">\n" +
    "<div class=\"col-xs-6\">\n" +
    "<label class=\"input-label\">\n" +
    "{{keyPlaceholder}}\n" +
    "</label>\n" +
    "</div>\n" +
    "<div class=\"col-xs-6\">\n" +
    "<label class=\"input-label\">\n" +
    "{{valuePlaceholder}}\n" +
    "</label>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-model=\"entries\" class=\"key-value-editor\" as-sortable=\"dragControlListeners\">\n" +
    "<div class=\"key-value-editor-entry row form-row-has-controls\" ng-class-odd=\"'odd'\" ng-class-even=\"'even'\" ng-repeat=\"entry in entries\" as-sortable-item>\n" +
    "\n" +
    "<div class=\"form-group col-xs-6 key-value-editor-input\" ng-class=\"{ 'has-error' :  (forms.keyValueEditor[uniqueForKey(unique, $index)].$invalid && forms.keyValueEditor[uniqueForKey(unique, $index)].$touched) }\">\n" +
    "<label for=\"uniqueForKey(unique, $index)\" class=\"sr-only\">{{keyPlaceholder}}</label>\n" +
    "<input type=\"text\" class=\"form-control\" ng-class=\"{ '{{setFocusKeyClass}}' : $last  }\" id=\"{{uniqueForKey(unique, $index)}}\" name=\"{{uniqueForKey(unique, $index)}}\" ng-attr-placeholder=\"{{ (!isReadonlyAny) && keyPlaceholder || ''}}\" ng-minlength=\"{{keyMinlength}}\" maxlength=\"{{keyMaxlength}}\" ng-model=\"entry.name\" ng-readonly=\"isReadonlyAny || isReadonlySome(entry.name) || entry.isReadonlyKey || entry.isReadonly\" ng-pattern=\"validation.key\" ng-value ng-required=\"!allowEmptyKeys && (entry.value || entry.valueFrom)\" ng-attr-key-value-editor-focus=\"{{grabFocus && $last}}\" autocorrect=\"off\" autocapitalize=\"none\" spellcheck=\"false\">\n" +
    "\n" +
    "<span ng-show=\"(forms.keyValueEditor[uniqueForKey(unique, $index)].$touched)\">\n" +
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
    "</span>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"form-group col-xs-6 key-value-editor-input\" ng-class=\"{ 'has-error': (forms.keyValueEditor[uniqueForValue(unique, $index)].$invalid && forms.keyValueEditor[uniqueForValue(unique, $index)].$touched) }\">\n" +
    "<label for=\"uniqueForValue(unique, $index)\" class=\"sr-only\">{{valuePlaceholder}}</label>\n" +
    "<div ng-if=\"(!entry.valueFrom)\">\n" +
    "<input type=\"text\" class=\"form-control\" ng-class=\"{ '{{setFocusValClass}}' : $last  }\" id=\"{{uniqueForValue(unique, $index)}}\" name=\"{{uniqueForValue(unique, $index)}}\" ng-attr-placeholder=\"{{ (!isReadonlyAny) && valuePlaceholder || ''}}\" ng-minlength=\"{{valueMinlength}}\" maxlength=\"{{valueMaxlength}}\" ng-model=\"entry.value\" ng-readonly=\"isReadonlyAny || isReadonlySome(entry.name) || entry.isReadonly\" ng-pattern=\"validation.val\" ng-required=\"!allowEmptyKeys && entry.value\" autocorrect=\"off\" autocapitalize=\"none\" spellcheck=\"false\">\n" +
    "</div>\n" +
    "<div ng-if=\"entry.valueFrom\">\n" +
    "<div ng-if=\"isValueFromReadonly(entry)\" class=\"faux-input-group\">\n" +
    "<span class=\"faux-form-control-addon {{entry.valueIcon}}\" aria-hidden=\"true\" data-toggle=\"tooltip\" data-placement=\"top\" data-original-title=\"{{entry.valueIconTooltip || valueIconTooltip}}\"></span>\n" +
    "<div class=\"faux-form-control readonly\">\n" +
    "<span ng-switch=\"entry.refType\">\n" +
    "<span ng-switch-when=\"configMapKeyRef\">\n" +
    "Set to the key {{entry.valueFrom.configMapKeyRef.key}} in config map\n" +
    "<span ng-if=\"!(configMapVersion | canI : 'get')\">\n" +
    "{{entry.valueFrom.configMapKeyRef.name}}\n" +
    "</span>\n" +
    "<a ng-if=\"configMapVersion | canI : 'get'\" ng-href=\"{{entry.apiObj | navigateResourceURL}}\">\n" +
    "{{entry.valueFrom.configMapKeyRef.name}}\n" +
    "</a>\n" +
    "</span>\n" +
    "<span ng-switch-when=\"secretKeyRef\">\n" +
    "Set to the key {{entry.valueFrom.secretKeyRef.key}} in secret\n" +
    "<span ng-if=\"!(secretsVersion | canI : 'get')\">\n" +
    "{{entry.valueFrom.secretKeyRef.name}}\n" +
    "</span>\n" +
    "<a ng-if=\"secretsVersion | canI : 'get'\" ng-href=\"{{entry.apiObj | navigateResourceURL}}\">\n" +
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
    "<div class=\"ui-select key-value-editor-select\">\n" +
    "<ui-select ng-model=\"entry.selectedValueFrom\" ng-required=\"true\" on-select=\"valueFromObjectSelected(entry, $select.selected)\">\n" +
    "<ui-select-match placeholder=\"Select a resource\">\n" +
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
    "<div class=\"ui-select key-value-editor-select\">\n" +
    "<ui-select ng-model=\"entry.selectedValueFromKey\" ng-required=\"true\" on-select=\"valueFromKeySelected(entry, $select.selected)\">\n" +
    "<ui-select-match placeholder=\"Select key\">\n" +
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
    "<span ng-show=\"(forms.keyValueEditor[uniqueForValue(unique, $index)].$touched)\">\n" +
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
    "</span>\n" +
    "</div>\n" +
    "<div class=\"key-value-editor-buttons form-row-controls\">\n" +
    "<button ng-if=\"(!cannotSort) && (entries.length > 1)\" class=\"sort-row\" type=\"button\" aria-hidden=\"true\" aria-grabbed=\"false\" as-sortable-item-handle>\n" +
    "<span class=\"fa fa-bars\"></span>\n" +
    "<span class=\"sr-only\">Move row</span>\n" +
    "</button>\n" +
    "<button class=\"btn-remove close delete-row as-sortable-item-delete\" type=\"button\" aria-hidden=\"true\" ng-hide=\"cannotDeleteAny || cannotDeleteSome(entry.name) || entry.cannotDelete\" ng-click=\"deleteEntry($index, 1)\">\n" +
    "<span class=\"pficon pficon-close\" aria-hidden=\"true\"></span>\n" +
    "<span class=\"sr-only\">Delete row</span>\n" +
    "</button>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"key-value-editor-entry form-group\" ng-if=\"(!cannotAdd)\">\n" +
    "<a href=\"\" class=\"add-row-link\" role=\"button\" ng-click=\"onAddRow()\">{{ addRowLink }}</a>\n" +
    "<span ng-if=\"valueFromSelectorOptions.length\">\n" +
    "<span class=\"action-divider\" aria-hidden=\"true\">|</span>\n" +
    "<a href=\"\" class=\"add-row-link\" role=\"button\" ng-click=\"onAddRowWithSelectors()\">{{ addRowWithSelectorsLink }}</a>\n" +
    "</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "</ng-form>"
  );


  $templateCache.put('views/directives/label-editor.html',
    "<osc-form-section header=\"Labels\" about-title=\"Labels\" about=\"Labels are used to organize, group, or select objects and resources, such as pods.\" expand=\"expand\" can-toggle=\"canToggle\">\n" +
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
    "<div class=\"k8s-labels\" ng-if=\"(labels | hashSize) > 0\">\n" +
    "<span ng-repeat=\"(labelKey, labelValue) in labels\" class=\"k8s-label nowrap\" ng-if=\"!limit || $index < limit\">\n" +
    "<span class=\"label-pair\" ng-if=\"clickable\">\n" +
    "<a href=\"\" class=\"label-key label truncate\" ng-click=\"filterAndNavigate(labelKey)\" ng-attr-title=\"All {{titleKind || kind}} with the label '{{labelKey}}' (any value)\">{{labelKey}}</a><a href=\"\" class=\"label-value label truncate\" ng-click=\"filterAndNavigate(labelKey, labelValue)\" ng-attr-title=\"All {{titleKind || kind}} with the label '{{labelKey}}={{labelValue}}'\">{{labelValue}}<span ng-if=\"labelValue === ''\"><em>&lt;empty&gt;</em></span></a>\n" +
    "</span>\n" +
    "<span class=\"label-pair\" ng-if=\"!clickable\">\n" +
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
    "<div ng-if=\"env.valueFrom.configMapKeyRef || env.valueFrom.secretKeyRef\">\n" +
    "{{env.name}} set to key\n" +
    "<span ng-if=\"env.valueFrom.configMapKeyRef\">\n" +
    "{{env.valueFrom.configMapKeyRef.key}} in config map\n" +
    "<span ng-if=\"!(configMapsVersion | canI : 'get')\">\n" +
    "{{env.valueFrom.configMapKeyRef.name}}\n" +
    "</span>\n" +
    "<a ng-if=\"configMapsVersion | canI : 'get'\" ng-href=\"{{env.valueFrom.configMapKeyRef.name | navigateResourceURL : 'ConfigMap' : deploymentConfig.metadata.namespace}}\">\n" +
    "{{env.valueFrom.configMapKeyRef.name}}\n" +
    "</a>\n" +
    "</span>\n" +
    "<span ng-if=\"env.valueFrom.secretKeyRef\">\n" +
    "{{env.valueFrom.secretKeyRef.key}} in secret\n" +
    "<span ng-if=\"!(secretsVersion | canI : 'get')\">\n" +
    "{{env.valueFrom.secretKeyRef.name}}\n" +
    "</span>\n" +
    "<a ng-if=\"secretsVersion | canI : 'get'\" ng-href=\"{{env.valueFrom.secretKeyRef.name | navigateResourceURL : 'Secret' : deploymentConfig.metadata.namespace}}\">\n" +
    "{{env.valueFrom.secretKeyRef.name}}\n" +
    "</a>\n" +
    "</span>\n" +
    "</div>\n" +
    "<div ng-if=\"!env.valueFrom\" class=\"truncate\" ng-attr-title=\"{{env.value}}\">\n" +
    "{{env.name}}={{env.value}}\n" +
    "</div>\n" +
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
    "\n" +
    "<div ng-show=\"state=='logs'\" ng-class=\"{ invisible: !sized }\">\n" +
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
    "<div ng-if=\"$ctrl.pendingTasks(tasks()).length\">\n" +
    "<div class=\"results-status\">\n" +
    "<span class=\"fa fa-clock-o text-muted\" aria-hidden=\"true\"></span>\n" +
    "<span class=\"sr-only\">Pending</span>\n" +
    "<div class=\"results-message\">\n" +
    "<h1 class=\"h3\">\n" +
    "<span ng-if=\"$ctrl.kind\">{{$ctrl.kind | humanizeKind | upperFirst}}</span>\n" +
    "<strong>{{$ctrl.name}}</strong> is being {{$ctrl.actionLabel}}<span ng-if=\"$ctrl.showProjectName && $ctrl.projectName\"> in <strong>{{$ctrl.projectName}}</strong></span>.\n" +
    "</h1>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"results-failure\" ng-if=\"!$ctrl.pendingTasks(tasks()).length && $ctrl.erroredTasks(tasks()).length\">\n" +
    "<div class=\"results-status\">\n" +
    "<span class=\"pficon pficon-error-circle-o text-danger\" aria-hidden=\"true\"></span>\n" +
    "<span class=\"sr-only\">Error</span>\n" +
    "<div class=\"results-message\">\n" +
    "<h1 class=\"h3\">\n" +
    "<span ng-if=\"$ctrl.kind\">{{$ctrl.kind | humanizeKind | upperFirst}}</span>\n" +
    "<strong>{{$ctrl.name}}</strong> failed to be {{$ctrl.actionLabel}}<span ng-if=\"$ctrl.showProjectName && $ctrl.projectName\"> in <strong>{{$ctrl.projectName}}</strong></span>.\n" +
    "</h1>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "\n" +
    "<div ng-if=\"!tasks().length\">\n" +
    "<div class=\"results-status\">\n" +
    "<span class=\"pficon pficon-ok\" aria-hidden=\"true\"></span>\n" +
    "<span class=\"sr-only\">Success</span>\n" +
    "<div class=\"results-message\">\n" +
    "<h1 class=\"h3\">\n" +
    "<span ng-if=\"$ctrl.kind\">{{$ctrl.kind | humanizeKind | upperFirst}}</span>\n" +
    "<strong>{{$ctrl.name}}</strong> has been {{$ctrl.actionLabel}}<span ng-if=\"$ctrl.showProjectName && $ctrl.projectName\"> in <strong>{{$ctrl.projectName}}</strong> successfully</span>.\n" +
    "</h1>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"tasks().length && $ctrl.allTasksSuccessful(tasks())\">\n" +
    "<div class=\"results-status\">\n" +
    "<span class=\"pficon pficon-ok\" aria-hidden=\"true\"></span>\n" +
    "<span class=\"sr-only\">Success</span>\n" +
    "<div class=\"results-message\">\n" +
    "<h1 class=\"h3\">\n" +
    "<span ng-if=\"$ctrl.kind\">{{$ctrl.kind | humanizeKind | upperFirst}}</span>\n" +
    "<strong>{{$ctrl.name}}</strong> has been {{$ctrl.actionLabel}}<span ng-if=\"$ctrl.showProjectName && $ctrl.projectName\"> in <strong>{{$ctrl.projectName}}</strong> successfully</span>.\n" +
    "</h1>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<p ng-if=\"!$ctrl.pendingTasks(tasks()).length && !$ctrl.erroredTasks(tasks()).length\">\n" +
    "<a href=\"\" ng-click=\"$ctrl.goToOverview()\">Continue to the project overview</a>.\n" +
    "</p>\n" +
    "<div ng-if=\"hasTaskWithError()\">\n" +
    "<ul ng-repeat=\"task in tasks()\">\n" +
    "<li ng-repeat=\"alert in task.alerts\" ng-if=\"alert.type === 'error' || alert.type === 'warning'\">\n" +
    "{{alert.message}} {{alert.details}}\n" +
    "</li>\n" +
    "</ul>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"alert alert-info template-message\" ng-if=\"$ctrl.templateMessage.length\">\n" +
    "<span class=\"pficon pficon-info\" aria-hidden=\"true\"></span>\n" +
    "<div class=\"resource-description\" ng-bind-html=\"$ctrl.templateMessage | linkify : '_blank'\"></div>\n" +
    "</div>\n" +
    "<div ng-if=\"$ctrl.createdBuildConfig\">\n" +
    "<h2 class=\"h3\">Making code changes</h2>\n" +
    "<p ng-if=\"$ctrl.fromSampleRepo\">\n" +
    "You are set up to use the example git repository. If you would like to modify the source code, fork the <osc-git-link uri=\"$ctrl.createdBuildConfig.spec.source.git.uri\">{{$ctrl.createdBuildConfig.spec.source.git.uri}}</osc-git-link> repository to an OpenShift-visible git account and <a href=\"{{$ctrl.createdBuildConfig | editResourceURL}}\">edit the <strong>{{$ctrl.createdBuildConfig.metadata.name}}</strong> build config</a> to point to your fork.\n" +
    "<span ng-if=\"$ctrl.createdBuildConfigWithConfigChangeTrigger()\">Note that this will start a new build.</span>\n" +
    "</p>\n" +
    "<div ng-repeat=\"trigger in $ctrl.createdBuildConfig.spec.triggers\" ng-if=\"trigger.type == 'GitHub'\">\n" +
    "<p>\n" +
    "A GitHub <a target=\"_blank\" href=\"{{'webhooks' | helpLink}}\">webhook trigger</a> has been created for the <strong>{{$ctrl.createdBuildConfig.metadata.name}}</strong> build config.\n" +
    "</p>\n" +
    "<p ng-if=\"$ctrl.fromSampleRepo\">\n" +
    "You can configure the webhook in the forked repository's settings, using the following payload URL:\n" +
    "</p>\n" +
    "<p ng-if=\"!$ctrl.fromSampleRepo\">\n" +
    "<span ng-if=\"$ctrl.createdBuildConfig.spec.source.git.uri | isGithubLink\">\n" +
    "You can now set up the webhook in the GitHub repository settings if you own it, in <a target=\"_blank\" class=\"word-break\" href=\"{{$ctrl.createdBuildConfig.spec.source.git.uri | githubLink}}/settings/hooks\">{{$ctrl.createdBuildConfig.spec.source.git.uri | githubLink}}/settings/hooks</a>, using the following payload URL and specifying a <i>Content type</i> of <code>application/json</code>:\n" +
    "</span>\n" +
    "<span ng-if=\"!($ctrl.createdBuildConfig.spec.source.git.uri | isGithubLink)\">\n" +
    "Your source does not appear to be a URL to a GitHub repository. If you have a GitHub repository that you want to trigger this build from then use the following payload URL and specifying a <i>Content type</i> of <code>application/json</code>:\n" +
    "</span>\n" +
    "</p>\n" +
    "<copy-to-clipboard clipboard-text=\"$ctrl.createdBuildConfig.metadata.name | webhookURL : trigger.type : trigger.github : $ctrl.projectName\"></copy-to-clipboard>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"$ctrl.parameters.all.length\">\n" +
    "<h2 class=\"h3\">Applied Parameter Values</h2>\n" +
    "<p>These parameters often include things like passwords. If you will need to reference these values later, copy them to a safe location.\n" +
    "<span ng-if=\"$ctrl.parameters.generated.length > 1\">Parameters <span ng-repeat=\"paramName in $ctrl.parameters.generated\">{{paramName}}<span ng-if=\"!$last\">, </span></span> were generated automatically.</span>\n" +
    "<span ng-if=\"$ctrl.parameters.generated.length === 1\">Parameter {{$ctrl.parameters.generated[0]}} was generated automatically.</span>\n" +
    "</p>\n" +
    "<div ng-if=\"!$ctrl.showParamsTable\" class=\"center\">\n" +
    "<a href=\"\" ng-click=\"$ctrl.toggleParamsTable()\">Show parameter values</a>\n" +
    "</div>\n" +
    "<key-value-editor ng-if=\"$ctrl.showParamsTable\" entries=\"$ctrl.parameters.all\" key-placeholder=\"Name\" value-placeholder=\"Value\" cannot-add cannot-delete cannot-sort show-header is-readonly></key-value-editor>\n" +
    "</div>"
  );


  $templateCache.put('views/directives/notifications/header.html',
    "<div class=\"container-fluid\">\n" +
    "<div class=\"truncate\">\n" +
    "{{notificationGroup.heading}}\n" +
    "</div>\n" +
    "<div class=\"row mar-top-md panel-counter\">\n" +
    "<div class=\"col-xs-6\">\n" +
    "{{notificationGroup.totalUnread}} Unread\n" +
    "</div>\n" +
    "<div class=\"col-xs-6 text-right\">\n" +
    "<a title=\"All Events\" ng-href=\"project/{{$ctrl.customScope.projectName}}/browse/events\" ng-click=\"$ctrl.customScope.close()\">\n" +
    "View All Events\n" +
    "</a>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/directives/notifications/notification-body.html',
    "<div class=\"drawer-pf-notification-inner\" ng-class=\"{ 'is-clickable': notification.unread }\" ng-click=\"notification.unread && $ctrl.customScope.markRead(notification)\">\n" +
    "<button class=\"btn btn-link pull-right drawer-pf-notification-close\" type=\"button\" ng-if=\"!notification.actions.length\" ng-click=\"$ctrl.customScope.clear(notification, $index, notificationGroup)\">\n" +
    "<span class=\"sr-only\">Clear notification</span>\n" +
    "<span aria-hidden=\"true\" class=\"pficon pficon-close\"></span>\n" +
    "</button>\n" +
    "<div uib-dropdown class=\"dropdown pull-right dropdown-kebab-pf\" ng-if=\"notification.actions.length\">\n" +
    "<button uib-dropdown-toggle class=\"btn btn-link dropdown-toggle\" type=\"button\" id=\"dropdownKebabRight-{{$id}}\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"true\">\n" +
    "<span class=\"fa fa-ellipsis-v\"></span>\n" +
    "</button>\n" +
    "<ul class=\"dropdown-menu dropdown-menu-right\" aria-labelledby=\"dropdownKebabRight\">\n" +
    "<li ng-repeat=\"action in notification.actions\" role=\"{{action.isSeparator === true ? 'separator' : 'menuitem'}}\" ng-class=\"{'divider': action.isSeparator === true, 'disabled': action.isDisabled === true}\">\n" +
    "<a ng-if=\"!action.isSeparator\" href=\"\" class=\"secondary-action\" title=\"{{action.title}}\" ng-click=\"action.onClick(notification)\">\n" +
    "{{action.name}}\n" +
    "</a>\n" +
    "</li>\n" +
    "</ul>\n" +
    "</div>\n" +
    "<span class=\"pull-left {{notification.type | alertIcon}}\" aria-hidden=\"true\"></span>\n" +
    "<span class=\"sr-only\">{{notification.event.type}}</span>\n" +
    "<div class=\"drawer-pf-notification-content\">\n" +
    "<div class=\"drawer-pf-notification-message word-break\" ng-attr-title=\"{{notification.event.message}}\">\n" +
    "<div>\n" +
    "<span ng-if=\"notification.event.reason\">\n" +
    "{{notification.event.reason | humanize}}&nbsp;&mdash; <span ng-if=\"notification.event.involvedObject\">{{notification.event.involvedObject.kind | humanizeKind : true}}</span>\n" +
    "</span>\n" +
    "<span ng-if=\"notification.event.involvedObject\" ng-init=\"eventObjUrl = (notification.event | navigateEventInvolvedObjectURL)\">\n" +
    "<a ng-if=\"eventObjUrl\" ng-attr-title=\"Navigate to {{notification.event.involvedObject.name}}\" href=\"{{eventObjUrl}}\" ng-click=\"$ctrl.customScope.close()\">\n" +
    "{{notification.event.involvedObject.name}}\n" +
    "</a>\n" +
    "<span ng-if=\"!(eventObjUrl)\">{{notification.event.involvedObject.name}}</span>\n" +
    "</span>\n" +
    "<span ng-if=\"!(notification.event.involvedObject)\">\n" +
    "<span ng-if=\"notification.isHTML\" ng-bind-html=\"notification.message\"></span>\n" +
    "<span ng-if=\"!notification.isHTML\">{{notification.message}}</span>\n" +
    "<span ng-repeat=\"link in notification.links\">\n" +
    "<a ng-if=\"!link.href\" href=\"\" ng-click=\"$ctrl.customScope.onLinkClick(link)\" role=\"button\">{{link.label}}</a>\n" +
    "<a ng-if=\"link.href\" ng-href=\"{{link.href}}\" ng-click=\"$ctrl.customScope.close()\" ng-attr-target=\"{{link.target}}\">{{link.label}}</a>\n" +
    "<span ng-if=\"!$last\" class=\"toast-action-divider\">|</span>\n" +
    "</span>\n" +
    "</span>\n" +
    "<span class=\"sr-only\">Message Unread. </span>\n" +
    "<a ng-if=\"notification.unread\" href=\"\" class=\"sr-only sr-only-focusable\" ng-click=\"$ctrl.customScope.markRead(notification)\">\n" +
    "<span>Mark Read</span>\n" +
    "</a>\n" +
    "</div>\n" +
    "<div ng-if=\"notification.event.count > 1\" class=\"text-muted small\">\n" +
    "{{notification.event.count}} times in the last\n" +
    "<duration-until-now timestamp=\"notification.event.firstTimestamp\" omit-single=\"true\" precision=\"1\"></duration-until-now>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"drawer-pf-notification-info\">\n" +
    "<span class=\"date\">{{notification.lastTimestamp | date:'shortDate'}}</span>\n" +
    "<span class=\"time\">{{notification.lastTimestamp | date:'mediumTime'}}</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"$ctrl.drawerExpanded\" class=\"drawer-pf-notification-message drawer-pf-notification-message-expanded\">\n" +
    "{{notification.event.message || notification.details}}\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/directives/notifications/notification-counter.html',
    "<li class=\"drawer-pf-trigger\" ng-if=\"!$ctrl.hide\">\n" +
    "\n" +
    "<a href=\"\" class=\"nav-item-iconic\" ng-click=\"$ctrl.onClick()\"><span class=\"fa fa-bell\" title=\"Notifications\" aria-hidden=\"true\"></span><span ng-if=\"$ctrl.showUnreadNotificationsIndicator\" class=\"badge badge-pf-bordered\"> </span><span class=\"sr-only\">Notifications</span></a>\n" +
    "</li>"
  );


  $templateCache.put('views/directives/notifications/notification-drawer-wrapper.html',
    "<pf-notification-drawer allow-expand=\"$ctrl.allowExpand\" custom-scope=\"$ctrl.customScope\" drawer-expanded=\"$ctrl.drawerExpanded\" drawer-hidden=\"$ctrl.drawerHidden\" drawer-title=\"{{$ctrl.drawerTitle}}\" heading-include=\"{{$ctrl.headingInclude}}\" notification-body-include=\"{{$ctrl.notificationBodyInclude}}\" notification-groups=\"$ctrl.notificationGroups\" notification-track-field=\"trackByID\" on-close=\"$ctrl.onClose\" on-clear-all=\"$ctrl.onClearAll\" on-mark-all-read=\"$ctrl.onMarkAllRead\" show-clear-all=\"$ctrl.showClearAll\" show-mark-all-read=\"$ctrl.showMarkAllRead\"></pf-notification-drawer>"
  );


  $templateCache.put('views/directives/osc-autoscaling.html',
    "<ng-form name=\"form\">\n" +
    "<div class=\"autoscaling-form\">\n" +
    "<div ng-show=\"showNameInput\" class=\"form-group\">\n" +
    "<label for=\"hpa-name\" class=\"required\">Autoscaler Name</label>\n" +
    "<span ng-class=\"{ 'has-error': form.name.$touched && form.name.$invalid }\">\n" +
    "<input id=\"hpa-name\" class=\"form-control\" type=\"text\" name=\"name\" ng-model=\"autoscaling.name\" ng-required=\"showNameInput\" ng-readonly=\"nameReadOnly\" ng-pattern=\"nameValidation.pattern\" ng-maxlength=\"nameValidation.maxlength\" select-on-focus autocorrect=\"off\" autocapitalize=\"none\" spellcheck=\"false\" aria-describedby=\"hpa-name-help\">\n" +
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
    "<input type=\"number\" class=\"form-control\" min=\"1\" name=\"minReplicas\" ng-model=\"autoscaling.minReplicas\" pattern=\"\\d*\" select-on-focus aria-describedby=\"min-replicas-help\">\n" +
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
    "<input type=\"number\" class=\"form-control\" name=\"maxReplicas\" required min=\"{{autoscaling.minReplicas || 1}}\" ng-model=\"autoscaling.maxReplicas\" pattern=\"\\d*\" select-on-focus aria-describedby=\"max-replicas-help\">\n" +
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
    "{{autoscaling.minReplicas || 1}}.\n" +
    "</span>\n" +
    "<span class=\"help-block\" ng-if=\"form.maxReplicas.$error.required\">\n" +
    "Max pods is a required field.\n" +
    "</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-show=\"showRequestInput\" class=\"form-group\">\n" +
    "<label>\n" +
    "CPU Request Target\n" +
    "</label>\n" +
    "<div class=\"input-group\" ng-class=\"{ 'has-error': form.targetCPU.$invalid && form.targetCPU.$touched }\">\n" +
    "<input type=\"number\" class=\"form-control\" min=\"1\" name=\"targetCPU\" ng-model=\"autoscaling.targetCPU\" pattern=\"\\d*\" select-on-focus aria-describedby=\"target-cpu-help\">\n" +
    "<span class=\"input-group-addon\">%</span>\n" +
    "</div>\n" +
    "<div id=\"target-cpu-help\" class=\"help-block\">\n" +
    "The percentage of the CPU request that each pod should ideally be using. Pods will be added or removed periodically when CPU usage exceeds or drops below this target value.\n" +
    "</div>\n" +
    "<div class=\"learn-more-block\">\n" +
    "<a ng-href=\"{{'compute_resources' | helpLink}}\" target=\"_blank\">Learn More&nbsp;<i class=\"fa fa-external-link\" aria-hidden=\"true\"></i></a>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"has-error mar-top-md\" ng-show=\"form.targetCPU.$touched && form.targetCPU.$invalid\">\n" +
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
    "<span class=\"btn btn-default btn-file\" ng-show=\"supportsFileUpload\" ng-attr-disabled=\"{{ (disabled || readonly) || undefined }}\">\n" +
    "Browse&hellip;\n" +
    "<input type=\"file\" ng-disabled=\"disabled || readonly\" class=\"form-control\">\n" +
    "</span>\n" +
    "</span>\n" +
    "</div>\n" +
    "<div ng-if=\"helpText\">\n" +
    "<span ng-attr-id=\"{{helpID}}\" class=\"help-block\">{{::helpText}}</span>\n" +
    "</div>\n" +
    "<div class=\"has-error\" ng-show=\"uploadError\">\n" +
    "<span class=\"help-block\">There was an error reading the file. Please copy the file content into the text area.</span>\n" +
    "</div>\n" +
    "<textarea class=\"form-control\" rows=\"5\" ng-show=\"(showTextArea && !isBinaryFile) || !supportsFileUpload\" ng-model=\"model\" ng-required=\"required\" ng-disabled=\"disabled\" ng-readonly=\"readonly\" autocorrect=\"off\" autocapitalize=\"none\" spellcheck=\"false\" ng-attr-aria-describedby=\"{{helpText ? helpID : undefined}}\">\n" +
    "  </textarea>\n" +
    "<a href=\"\" ng-show=\"(model || fileName) && !disabled && !readonly && !hideClear\" ng-click=\"cleanInputValues()\">Clear Value</a>\n" +
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


  $templateCache.put('views/directives/osc-persistent-volume-claim.html',
    "<ng-form name=\"persistentVolumeClaimForm\">\n" +
    "<fieldset ng-disabled=\"claimDisabled\">\n" +
    "<div ng-if=\"persistentVolumeClaimForm.capacity.$error.outOfClaims\" class=\"has-error\">\n" +
    "<div class=\"alert alert-danger\">\n" +
    "<span class=\"pficon pficon-error-circle-o\" aria-hidden=\"true\"></span>\n" +
    "<strong>Storage quota limit has been reached. You will not be able to create any new storage.</strong>\n" +
    "<a ng-href=\"project/{{projectName}}/quota\" target=\"_blank\">View Quota&nbsp;</a>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"storageClasses.length\" class=\"form-group\">\n" +
    "<label>Storage Class</label>\n" +
    "<div>\n" +
    "<ui-select ng-model=\"claim.storageClass\" on-select=\"onStorageClassSelected($item)\" theme=\"bootstrap\" search-enabled=\"true\" title=\"Select a storage class\" class=\"select-role\">\n" +
    "<ui-select-match placeholder=\"Select a storage class\">\n" +
    "<span>\n" +
    "{{$select.selected.metadata.name}}\n" +
    "</span>\n" +
    "</ui-select-match>\n" +
    "<ui-select-choices repeat=\"sclass as sclass in storageClasses | toArray | filter : { metadata: { name: $select.search } } \">\n" +
    "<div>\n" +
    "<span ng-bind-html=\"sclass.metadata.name  | highlight : $select.search\"></span>\n" +
    "<div ng-if=\"sclass.parameters.type || sclass.parameters.zone || (sclass | description) || (sclass | storageClassAccessMode)\" class=\"text-muted\">\n" +
    "<small>\n" +
    "<span ng-if=\"sclass.parameters.type\">\n" +
    "Type: {{sclass.parameters.type}}\n" +
    "</span>\n" +
    "<span ng-if=\"sclass.parameters.zone\">\n" +
    "<span ng-if=\"sclass.parameters.type\">|</span>\n" +
    "Zone: {{sclass.parameters.zone}}\n" +
    "</span>\n" +
    "<span ng-if=\"(sclass | storageClassAccessMode)\">\n" +
    "<span ng-if=\"sclass.parameters.type || sclass.parameters.zone\">|</span>\n" +
    "Access: {{sclass | storageClassAccessMode}}\n" +
    "</span>\n" +
    "<span ng-if=\"sclass | description\">\n" +
    "<span ng-if=\"sclass.parameters.type || sclass.parameters.zone || (sclass | storageClassAccessMode)\">|</span>\n" +
    "{{sclass | description}}\n" +
    "</span>\n" +
    "</small>\n" +
    "</div>\n" +
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
    "<span ng-class=\"{ 'has-error': persistentVolumeClaimForm.name.$invalid && persistentVolumeClaimForm.name.$dirty && !claimDisabled }\">\n" +
    "<input id=\"claim-name\" class=\"form-control\" type=\"text\" name=\"name\" ng-model=\"claim.name\" ng-required=\"true\" ng-pattern=\"nameValidation.pattern\" ng-maxlength=\"nameValidation.maxlength\" placeholder=\"my-storage-claim\" take-focus select-on-focus autocorrect=\"off\" autocapitalize=\"none\" spellcheck=\"false\" aria-describedby=\"claim-name-help\">\n" +
    "</span>\n" +
    "<div>\n" +
    "<span id=\"claim-name-help\" class=\"help-block\">A unique name for the storage claim within the project.</span>\n" +
    "</div>\n" +
    "<div class=\"has-error\" ng-show=\"persistentVolumeClaimForm.name.$error.required && persistentVolumeClaimForm.name.$dirty && !claimDisabled\">\n" +
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
    "<div class=\"form-group mar-bottom-xl\">\n" +
    "<label class=\"required\">Access Mode</label>\n" +
    "<span ng-if=\"claim.storageClass && (claim.storageClass | storageClassAccessMode)\" class=\"static-form-value-large\">\n" +
    "<small>(cannot be changed)</small>\n" +
    "</span>\n" +
    "<div>\n" +
    "<label class=\"radio-inline\">\n" +
    "<input type=\"radio\" name=\"accessModes\" ng-model=\"claim.accessModes\" value=\"ReadWriteOnce\" aria-describedby=\"access-modes-help\" ng-true-value=\"’1’\" ng-false-value=\"’0’\" ng-disabled=\"(claim.storageClass | storageClassAccessMode)\">\n" +
    "Single User (RWO)\n" +
    "</label>\n" +
    "<label class=\"radio-inline\">\n" +
    "<input type=\"radio\" id=\"accessModes\" name=\"accessModes\" ng-model=\"claim.accessModes\" value=\"ReadWriteMany\" aria-describedby=\"access-modes-help\" ng-true-value=\"’1’\" ng-false-value=\"’0’\" ng-disabled=\"(claim.storageClass | storageClassAccessMode)\">\n" +
    "Shared Access (RWX)\n" +
    "</label>\n" +
    "<label class=\"radio-inline\">\n" +
    "<input type=\"radio\" name=\"accessModes\" ng-model=\"claim.accessModes\" value=\"ReadOnlyMany\" aria-describedby=\"access-modes-help\" ng-true-value=\"’1’\" ng-false-value=\"’0’\" ng-disabled=\"(claim.storageClass | storageClassAccessMode)\">\n" +
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
    "<input type=\"number\" name=\"capacity\" id=\"claim-amount\" ng-model=\"claim.amount\" required min=\"0\" pattern=\"\\d+(\\.\\d+)?\" select-on-focus class=\"form-control\" aria-describedby=\"claim-capacity-help\">\n" +
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
    "<div ng-if=\"persistentVolumeClaimForm.capacity.$error.willExceedStorage\" class=\"has-error\">\n" +
    "<span class=\"help-block\">\n" +
    "Storage quota will be exceeded. <a ng-href=\"project/{{projectName}}/quota\" target=\"_blank\">View Quota&nbsp;</a>\n" +
    "</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"learn-more-block mar-top-sm\">\n" +
    "<a href=\"\" ng-click=\"showComputeUnitsHelp()\">What are GiB?</a>\n" +
    "</div>\n" +
    "</fieldset>\n" +
    "</div>\n" +
    "<div class=\"checkbox\">\n" +
    "<label>\n" +
    "<input type=\"checkbox\" ng-model=\"useLabels\">\n" +
    "Use label selectors to request storage\n" +
    "</label>\n" +
    "<div class=\"help-block learn-more-block mar-bottom-xl\">\n" +
    "<a ng-href=\"{{'selector_label' | helpLink}}\" target=\"_blank\">Learn More&nbsp;<i class=\"fa fa-external-link\" aria-hidden=\"true\"></i></a>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-show=\"useLabels\" class=\"form-group osc-form\">\n" +
    "<label-editor labels=\"claim.selectedLabels\" expand=\"true\" can-toggle=\"false\" help-text=\"Enter a label and value to use for your storage.\">\n" +
    "</label-editor>\n" +
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
    "<ui-select ng-model=\"model.name\" input-id=\"{{id}}-service-select\" aria-describedby=\"{{id}}-service-help\" required>\n" +
    "<ui-select-match>{{$select.selected}}</ui-select-match>\n" +
    "<ui-select-choices repeat=\"serviceName in (optionNames | filter : $select.search)\">\n" +
    "<div ng-bind-html=\"serviceName | highlight : $select.search\"></div>\n" +
    "</ui-select-choices>\n" +
    "</ui-select>\n" +
    "<div>\n" +
    "<span ng-attr-id=\"{{id}}-service-help\" class=\"help-block\">\n" +
    "<span ng-if=\"!isAlternate\">Service to route to.</span>\n" +
    "<span ng-if=\"isAlternate\">Alternate service for route traffic.</span>\n" +
    "</span>\n" +
    "</div>\n" +
    "<div ng-if=\"model.name && !allServices[model.name]\" class=\"has-warning\">\n" +
    "<span class=\"help-block\">\n" +
    "Service {{model.name}} does not exist.\n" +
    "</span>\n" +
    "</div>\n" +
    "<div ng-if=\"(optionNames | size) === 0\" class=\"has-error\">\n" +
    "<span class=\"help-block\">\n" +
    "There are no <span ng-if=\"is-alternate\">additional</span> services in your project to expose with a route.\n" +
    "</span>\n" +
    "</div>\n" +
    "<div ng-if=\"warnUnnamedPort\" class=\"has-warning\">\n" +
    "<span class=\"help-block\">\n" +
    "Service {{model.name}} has a single, unnamed port. A route cannot specifically target an unnamed service port. If more service ports are added later, the route will also direct traffic to them.\n" +
    "</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"showWeight\" class=\"form-group col-sm-6\">\n" +
    "<label for=\"{{id}}-service-weight\" class=\"required\">Weight</label>\n" +
    "<input ng-model=\"model.weight\" name=\"weight\" id=\"{{id}}-service-weight\" type=\"number\" required min=\"0\" max=\"256\" pattern=\"\\d*\" select-on-focus class=\"form-control\" aria-describedby=\"{{id}}-weight-help\">\n" +
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
    "<input id=\"route-name\" class=\"form-control\" type=\"text\" name=\"name\" ng-model=\"route.name\" ng-required=\"showNameInput\" ng-pattern=\"nameValidation.pattern\" ng-maxlength=\"nameValidation.maxlength\" placeholder=\"my-route\" select-on-focus autocorrect=\"off\" autocapitalize=\"none\" spellcheck=\"false\" aria-describedby=\"route-name-help\">\n" +
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
    "<input id=\"host\" class=\"form-control\" type=\"text\" name=\"host\" ng-model=\"route.host\" ng-pattern=\"hostnamePattern\" ng-maxlength=\"hostnameMaxLength\" ng-readonly=\"isHostnameReadOnly()\" placeholder=\"www.example.com\" autocorrect=\"off\" autocapitalize=\"none\" spellcheck=\"false\" aria-describedby=\"route-host-help\">\n" +
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
    "<p ng-if=\"(existingRoute || canICreateCustomHosts) && !canIUpdateCustomHosts\">The hostname can't be changed after the route is created.</p>\n" +
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
    "<input id=\"path\" class=\"form-control\" type=\"text\" name=\"path\" ng-model=\"route.path\" ng-pattern=\"/^\\/.*$/\" ng-disabled=\"route.tls.termination === 'passthrough'\" placeholder=\"/\" autocorrect=\"off\" autocapitalize=\"none\" spellcheck=\"false\" aria-describedby=\"route-path-help\">\n" +
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
    "<osc-routing-service model=\"route.to\" service-options=\"services\" all-services=\"servicesByName\" show-weight=\"route.alternateServices.length > 1 || (controls.hideSlider && route.alternateServices.length)\" warn-unnamed-port=\"unnamedServicePort\">\n" +
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
    "<osc-routing-service model=\"alternate\" service-options=\"alternateServiceOptions\" all-services=\"servicesByName\" is-alternate=\"true\" show-weight=\"route.alternateServices.length > 1 || controls.hideSlider\">\n" +
    "</osc-routing-service>\n" +
    "<div class=\"row form-group-actions\">\n" +
    "<div class=\"col-sm-6\">\n" +
    "<button type=\"button\" class=\"btn btn-link\" ng-click=\"route.alternateServices.splice($index, 1)\">Remove Service</button>\n" +
    "<span ng-if=\"$last && route.alternateServices.length < alternateServiceOptions.length\">\n" +
    "<span class=\"action-divider\">|</span>\n" +
    "<button type=\"button\" class=\"btn btn-link\" ng-click=\"addAlternateService()\">Add Another Service</button>\n" +
    "</span>\n" +
    "</div>\n" +
    "<div ng-if=\"route.alternateServices.length === 1 && controls.hideSlider\" class=\"col-sm-6\">\n" +
    "<button type=\"button\" class=\"btn btn-link\" ng-click=\"controls.hideSlider = false\">Edit Weights Using Percentage Slider</button>\n" +
    "</div>\n" +
    "</div>\n" +
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
    "<span class=\"service-name\">{{route.to.name}}</span>\n" +
    "<span class=\"weight-percentage\">{{weightAsPercentage(route.to.weight, true)}}</span>\n" +
    "</div>\n" +
    "<div>\n" +
    "<span class=\"weight-percentage hidden-xs\">{{weightAsPercentage(route.alternateServices[0].weight, true)}}</span>\n" +
    "<span class=\"service-name\">{{route.alternateServices[0].name}}</span>\n" +
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
    "<button type=\"button\" class=\"btn btn-link\" ng-click=\"controls.hideSlider = true\">edit weights as integers</button>.\n" +
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
    "<osc-file-input model=\"route.tls.certificate\" drop-zone-id=\"certificate-file\" show-text-area=\"true\" help-text=\"The PEM format certificate. Upload file by dragging & dropping, selecting it, or pasting from the clipboard.\" ng-readonly=\"areCertificateInputsReadOnly()\" ng-disabled=\"areCertificateInputsDisabled()\">\n" +
    "</osc-file-input>\n" +
    "</div>\n" +
    "<div class=\"form-group\" id=\"private-key-file\">\n" +
    "<label>Private Key</label>\n" +
    "<osc-file-input model=\"route.tls.key\" drop-zone-id=\"private-key-file\" show-text-area=\"true\" help-text=\"The PEM format key. Upload file by dragging & dropping, selecting it, or pasting from the clipboard.\" ng-readonly=\"areCertificateInputsReadOnly()\" ng-disabled=\"areCertificateInputsDisabled()\">\n" +
    "</osc-file-input>\n" +
    "</div>\n" +
    "<div class=\"form-group\" id=\"ca-certificate-file\">\n" +
    "<label>CA Certificate</label>\n" +
    "<osc-file-input model=\"route.tls.caCertificate\" drop-zone-id=\"ca-certificate-file\" show-text-area=\"true\" help-text=\"The PEM format CA certificate chain. Upload file by dragging & dropping, selecting it, or pasting from the clipboard.\" ng-readonly=\"areCertificateInputsReadOnly()\" ng-disabled=\"areCertificateInputsDisabled()\">\n" +
    "</osc-file-input>\n" +
    "</div>\n" +
    "<div class=\"form-group\" id=\"dest-ca-certificate-file\">\n" +
    "<label>Destination CA Certificate</label>\n" +
    "<osc-file-input model=\"route.tls.destinationCACertificate\" show-text-area=\"true\" drop-zone-id=\"dest-ca-certificate-file\" help-text=\"The PEM format CA certificate chain to validate the endpoint certificate for re-encrypt termination. Upload file by dragging & dropping, selecting it, or pasting from the clipboard.\" ng-readonly=\"areCertificateInputsReadOnly()\" ng-disabled=\"isDestinationCACertInputDisabled()\">\n" +
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
    "<div ng-repeat=\"pickedSecret in pickedSecrets\" class=\"row form-row-has-controls\">\n" +
    "<div class=\"secret-row col-xs-12\">\n" +
    "<div class=\"secret-name\">\n" +
    "<ui-select ng-disabled=\"disableInput\" ng-model=\"pickedSecret.name\">\n" +
    "<ui-select-match placeholder=\"Secret name\">{{$select.selected}}</ui-select-match>\n" +
    "<ui-select-choices repeat=\"secret in (secretsByType[type] | filter : $select.search)\">\n" +
    "<div ng-bind-html=\"secret | highlight : $select.search\"></div>\n" +
    "</ui-select-choices>\n" +
    "</ui-select>\n" +
    "</div>\n" +
    "<div class=\"remove-secret form-row-controls\">\n" +
    "<button class=\"btn-remove close delete-row\" type=\"button\" aria-hidden=\"true\" ng-click=\"removeSecret($index)\">\n" +
    "<span class=\"pficon pficon-close\" aria-hidden=\"true\"></span>\n" +
    "<span class=\"sr-only\">Remove build secret</span>\n" +
    "</button>\n" +
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
    "<span ng-if=\"secretsVersion | canI : 'create'\" class=\"action-divider\">|</span>\n" +
    "</span>\n" +
    "<a href=\"\" ng-if=\"secretsVersion | canI : 'create'\" role=\"button\" ng-click=\"openCreateSecretModal()\">Create New Secret</a>\n" +
    "</div>\n" +
    "</ng-form>"
  );


  $templateCache.put('views/directives/osc-source-secrets.html',
    "<ng-form name=\"secretsForm\" class=\"osc-secrets-form\">\n" +
    "<div ng-if=\"strategyType !== 'Custom'\">\n" +
    "<div class=\"form-group\">\n" +
    "<div class=\"advanced-secrets\">\n" +
    "<div class=\"row form-row-has-controls input-labels\">\n" +
    "<div class=\"col-xs-6\">\n" +
    "<label class=\"input-label\">\n" +
    "Build Secret\n" +
    "</label>\n" +
    "</div>\n" +
    "<div class=\"col-xs-6\">\n" +
    "<label class=\"input-label destination-dir\">\n" +
    "Destination Directory\n" +
    "</label>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-repeat=\"pickedSecret in pickedSecrets\">\n" +
    "<div class=\"secret-row row form-row-has-controls has-label\">\n" +
    "<div class=\"secret-name form-group col-xs-6\">\n" +
    "<ui-select ng-required=\"pickedSecret.destinationDir\" ng-model=\"pickedSecret.secret.name\">\n" +
    "<ui-select-match placeholder=\"Secret name\">{{$select.selected}}</ui-select-match>\n" +
    "<ui-select-choices repeat=\"secret in (secretsByType[type] | filter : $select.search)\">\n" +
    "<div ng-bind-html=\"secret | highlight : $select.search\"></div>\n" +
    "</ui-select-choices>\n" +
    "</ui-select>\n" +
    "</div>\n" +
    "<div class=\"destination-dir form-group col-xs-6\">\n" +
    "<input class=\"form-control\" id=\"destinationDir\" name=\"destinationDir\" ng-model=\"pickedSecret.destinationDir\" type=\"text\" placeholder=\"/\" autocorrect=\"off\" autocapitalize=\"none\" spellcheck=\"false\">\n" +
    "</div>\n" +
    "<div class=\"remove-secret form-row-controls\">\n" +
    "<button class=\"btn-remove close delete-row\" type=\"button\" aria-hidden=\"true\" ng-click=\"removeSecret($index)\">\n" +
    "<span class=\"pficon pficon-close\" aria-hidden=\"true\"></span>\n" +
    "<span class=\"sr-only\">Remove build secret</span>\n" +
    "</button>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"help-blocks\">\n" +
    "<div class=\"help-block\">Source secret to copy into the builder pod at build time.</div>\n" +
    "<div class=\"help-block destination-dir-padding\">Directory where the files will be available at build time.</div>\n" +
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
    "<label class=\"input-label destination-dir-padding\">\n" +
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
    "<div class=\"destination-dir destination-dir-padding\">\n" +
    "<input class=\"form-control\" id=\"mountPath\" name=\"mountPath\" ng-model=\"pickedSecret.mountPath\" type=\"text\" placeholder=\"/\" autocorrect=\"off\" autocapitalize=\"none\" spellcheck=\"false\">\n" +
    "</div>\n" +
    "<div class=\"remove-secret form-row-controls\">\n" +
    "<button class=\"btn-remove close delete-row\" type=\"button\" aria-hidden=\"true\" ng-click=\"removeSecret($index)\">\n" +
    "<span class=\"pficon pficon-close\" aria-hidden=\"true\"></span>\n" +
    "<span class=\"sr-only\">Remove build secret</span>\n" +
    "</button>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"help-blocks\">\n" +
    "<div class=\"help-block\">Source secret to mount into the builder pod at build time.</div>\n" +
    "<div class=\"help-block destination-dir-padding\">Path at which to mount the secret.</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"osc-secret-actions\">\n" +
    "<span ng-if=\"canAddSourceSecret()\">\n" +
    "<a href=\"\" role=\"button\" ng-click=\"addSourceSecret()\">Add Another Secret</a>\n" +
    "<span ng-if=\"secretsVersion | canI : 'create'\" class=\"action-divider\">|</span>\n" +
    "</span>\n" +
    "<a href=\"\" ng-if=\"secretsVersion | canI : 'create'\" role=\"button\" ng-click=\"openCreateSecretModal()\">Create New Secret</a>\n" +
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
    "<div ng-attr-id=\"{{chartId}}\" class=\"pod-donut\" ng-class=\"{ mini: mini }\"></div>\n" +
    "<div ng-if=\"mini\" class=\"donut-mini-text\">\n" +
    "<span ng-if=\"!idled && total <= 99\">\n" +
    "{{total}}\n" +
    "</span>\n" +
    "</div>\n" +
    "<span ng-if=\"mini && total === 1 && !idled\" class=\"donut-mini-text-name\">pod</span>\n" +
    "<span ng-if=\"mini && total !== 1 && !idled\" class=\"donut-mini-text-name\">\n" +
    "<span ng-if=\"!idled && total > 99\">\n" +
    "{{total}}\n" +
    "</span> pods\n" +
    "</span>\n" +
    "<span ng-if=\"mini && idled\" class=\"donut-mini-text-name\">Idle</span>\n" +
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
    "<table class=\"table table-bordered table-mobile table-layout-fixed\">\n" +
    "<colgroup>\n" +
    "<col class=\"col-sm-4\">\n" +
    "<col class=\"col-sm-3\">\n" +
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
    "<tbody ng-if=\"!sortedPods.length\">\n" +
    "<tr><td colspan=\"{{activePods ? 6 : 5}}\"><em>{{emptyMessage || 'No pods to show'}}</em></td></tr>\n" +
    "</tbody>\n" +
    "<tbody ng-if=\"sortedPods.length\">\n" +
    "<tr ng-repeat=\"pod in sortedPods track by (pod | uid)\" class=\"animate-repeat\">\n" +
    "<td data-title=\"{{customNameHeader || 'Name'}}\">\n" +
    "<a href=\"{{pod | navigateResourceURL}}\">{{pod.metadata.name}}</a>\n" +
    "<span ng-if=\"pod | isDebugPod\">\n" +
    "<i class=\"fa fa-bug info-popover\" aria-hidden=\"true\" data-toggle=\"popover\" data-trigger=\"hover\" dynamic-content=\"Debugging pod {{pod | debugPodSourceName}}\"></i>\n" +
    "<span class=\"sr-only\">Debugging pod {{pod | debugPodSourceName}}</span>\n" +
    "</span>\n" +
    "</td>\n" +
    "<td data-title=\"Status\">\n" +
    "<div class=\"status\">\n" +
    "<status-icon status=\"pod | podStatus\" disable-animation></status-icon>\n" +
    "<span class=\"status-detail\">{{pod | podStatus | humanizePodStatus}}</span>\n" +
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


  $templateCache.put('views/directives/process-template-dialog.html',
    "<div class=\"order-service\">\n" +
    "<pf-wizard wizard-title=\"{{!$ctrl.useProjectTemplate && ($ctrl.template | displayName) || 'Select from Project'}}\" hide-sidebar=\"true\" step-class=\"order-service-wizard-step\" wizard-ready=\"$ctrl.wizardReady\" next-title=\"$ctrl.nextTitle\" next-callback=\"$ctrl.next\" on-finish=\"$ctrl.close()\" on-cancel=\"$ctrl.close()\" wizard-done=\"$ctrl.wizardDone\" current-step=\"$ctrl.currentStep\">\n" +
    "<pf-wizard-step ng-repeat=\"step in $ctrl.steps track by step.id\" step-title=\"{{step.label}}\" wz-disabled=\"{{step.hidden}}\" allow-click-nav=\"step.allowClickNav\" next-enabled=\"step.valid\" prev-enabled=\"step.prevEnabled\" on-show=\"step.onShow\" step-id=\"{{step.id}}\" step-priority=\"{{$index}}\">\n" +
    "<div class=\"wizard-pf-main-inner-shadow-covers\">\n" +
    "<div ng-show=\"step.selected\" ng-include=\"step.view\" class=\"wizard-pf-main-form-contents\"></div>\n" +
    "</div>\n" +
    "</pf-wizard-step>\n" +
    "</pf-wizard>\n" +
    "</div>"
  );


  $templateCache.put('views/directives/process-template-dialog/process-template-config.html',
    "<div class=\"order-service-config\">\n" +
    "<div class=\"osc-form\">\n" +
    "<form name=\"$ctrl.form\">\n" +
    "<process-template ng-if=\"$ctrl.template\" template=\"$ctrl.template\" project=\"$ctrl.preSelectedProject\" on-project-selected=\"$ctrl.onProjectSelected\" available-projects=\"$ctrl.unfilteredProjects\" is-dialog=\"true\"></process-template>\n" +
    "</form>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/directives/process-template-dialog/process-template-info.html',
    "<div class=\"order-service-details\">\n" +
    "<div class=\"order-service-details-top\" ng-class=\"{'order-service-details-top-icon-top': ($ctrl.serviceClass.vendor || ($ctrl.docUrl || $ctrl.supportUrl))}\">\n" +
    "<div class=\"service-icon\">\n" +
    "<span ng-if=\"$ctrl.image\" class=\"image\"><img ng-src=\"{{$ctrl.image}}\" alt=\"\"></span>\n" +
    "<span ng-if=\"!$ctrl.image\" class=\"icon {{$ctrl.iconClass}}\" aria-hidden=\"true\"></span>\n" +
    "</div>\n" +
    "<div class=\"service-title-area\">\n" +
    "<div class=\"service-title\">\n" +
    "{{$ctrl.template | displayName}}\n" +
    "</div>\n" +
    "<div ng-if=\"$ctrl.vendor\" class=\"service-vendor\">\n" +
    "{{$ctrl.vendor}}\n" +
    "</div>\n" +
    "<div class=\"order-service-tags\">\n" +
    "<span ng-repeat=\"tag in $ctrl.template.metadata.annotations.tags.split(',')\" class=\"tag\">\n" +
    "{{tag}}\n" +
    "</span>\n" +
    "</div>\n" +
    "<ul ng-if=\"$ctrl.docUrl || $ctrl.supportUrl\" class=\"list-inline order-service-documentation-url\">\n" +
    "<li ng-if=\"$ctrl.docUrl\">\n" +
    "<a ng-href=\"{{$ctrl.docUrl}}\" target=\"_blank\" class=\"learn-more-link\">View Documentation <i class=\"fa fa-external-link\" aria-hidden=\"true\"></i></a>\n" +
    "</li>\n" +
    "<li ng-if=\"$ctrl.supportUrl\">\n" +
    "<a ng-href=\"{{$ctrl.supportUrl}}\" target=\"_blank\" class=\"learn-more-link\">Get Support <i class=\"fa fa-external-link\" aria-hidden=\"true\"></i></a>\n" +
    "</li>\n" +
    "</ul>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"order-service-description-block\">\n" +
    "<p ng-bind-html=\"($ctrl.template | description | linky : '_blank') || 'No description provided.'\" class=\"description\"></p>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/directives/process-template-dialog/process-template-results.html',
    "<div class=\"order-service-config\">\n" +
    "\n" +
    "<next-steps ng-if=\"$ctrl.wizardDone\" project=\"$ctrl.selectedProject\" project-name=\"$ctrl.selectedProject.metadata.name\" login-base-url=\"$ctrl.loginBaseUrl\" on-continue=\"$ctrl.close\" show-project-name=\"$ctrl.showProjectName\" name=\"$ctrl.template | displayName\">\n" +
    "</next-steps>\n" +
    "</div>"
  );


  $templateCache.put('views/directives/process-template-dialog/process-template-select.html',
    "<div class=\"order-service-config\">\n" +
    "<div class=\"config-top\">\n" +
    "<div ng-if=\"$ctrl.numTemplateProjects\" class=\"select-project-for-template\">\n" +
    "<h2>Select from Project</h2>\n" +
    "<label ng-if=\"$ctrl.numTemplateProjects === 1\">{{$ctrl.templateProject | displayName}}</label>\n" +
    "<ui-select ng-if=\"$ctrl.numTemplateProjects > 1\" name=\"selectProject\" ng-model=\"$ctrl.templateProject\" ng-change=\"$ctrl.templateProjectChange()\" search-enabled=\"$ctrl.searchEnabled\">\n" +
    "<ui-select-match placeholder=\"Select a Project\">\n" +
    "{{$select.selected | displayName}}\n" +
    "</ui-select-match>\n" +
    "<ui-select-choices repeat=\"project in $ctrl.templateProjects | searchProjects : $select.search track by (project | uid)\" group-by=\"$ctrl.groupChoicesBy\">\n" +
    "<span ng-bind-html=\"project | displayName | highlightKeywords : $select.search\"></span>\n" +
    "<span ng-if=\"project | displayName : true\" class=\"small text-muted\">\n" +
    "<span ng-if=\"project.metadata.name\">&ndash;</span>\n" +
    "<span ng-bind-html=\"project.metadata.name | highlightKeywords : $select.search\"></span>\n" +
    "</span>\n" +
    "</ui-select-choices>\n" +
    "</ui-select>\n" +
    "</div>\n" +
    "<pf-empty-state ng-if=\"!$ctrl.numTemplateProjects\" config=\"$ctrl.noProjectsEmptyState\"></pf-empty-state>\n" +
    "<pf-empty-state ng-if=\"!$ctrl.templateProject && $ctrl.numTemplateProjects\" config=\"$ctrl.projectEmptyState\"></pf-empty-state>\n" +
    "<pf-empty-state ng-if=\"$ctrl.templateProject && !$ctrl.catalogItems.length\" config=\"$ctrl.templatesEmptyState\"></pf-empty-state>\n" +
    "<div class=\"services-view\">\n" +
    "<div ng-if=\"$ctrl.templateProject && $ctrl.catalogItems.length\" class=\"services-items\">\n" +
    "<pf-filter config=\"$ctrl.filterConfig\" class=\"services-items-filter order-services-filter\"></pf-filter>\n" +
    "<a href=\"\" class=\"services-item show-selection\" ng-class=\"{'active': item === $ctrl.selectedTemplate}\" ng-repeat=\"item in $ctrl.filteredItems track by item.resource.metadata.uid\" ng-click=\"$ctrl.templateSelected(item)\">\n" +
    "<div ng-if=\"!item.imageUrl\" class=\"services-item-icon\">\n" +
    "<span class=\"{{item.iconClass}}\"></span>\n" +
    "</div>\n" +
    "<div ng-if=\"item.imageUrl\" class=\"services-item-icon\">\n" +
    "<img ng-src=\"{{item.imageUrl}}\" alt=\"\">\n" +
    "</div>\n" +
    "<div class=\"services-item-name\" title=\"{{item.name}}\">\n" +
    "{{item.name}}\n" +
    "</div>\n" +
    "</a>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/directives/process-template.html',
    "<fieldset ng-if=\"$ctrl.template\" ng-disabled=\"disableInputs\">\n" +
    "<ng-form name=\"$ctrl.templateForm\">\n" +
    "<select-project ng-if=\"!$ctrl.project\" on-project-selected=\"$ctrl.onProjectSelected\" available-projects=\"$ctrl.availableProjects\" selected-project=\"$ctrl.selectedProject\" name-taken=\"$ctrl.projectNameTaken\"></select-project>\n" +
    "<span ng-show=\"!$ctrl.noProjectsCantCreate\">\n" +
    "<template-options is-dialog=\"$ctrl.isDialog\" parameters=\"$ctrl.template.parameters\" expand=\"true\" can-toggle=\"false\">\n" +
    "</template-options>\n" +
    "<label-editor labels=\"$ctrl.labels\" expand=\"true\" can-toggle=\"false\" help-text=\"Each label is applied to each created resource.\">\n" +
    "</label-editor>\n" +
    "<div ng-if=\"!$ctrl.isDialog\" class=\"buttons gutter-top-bottom\">\n" +
    "<button class=\"btn btn-primary btn-lg\" ng-click=\"$ctrl.createFromTemplate()\" ng-disabled=\"$ctrl.templateForm.$invalid || $ctrl.disableInputs\">Create</button>\n" +
    "<a class=\"btn btn-default btn-lg\" href=\"\" ng-click=\"$ctrl.cancel()\" role=\"button\">Cancel</a>\n" +
    "</div>\n" +
    "</span>\n" +
    "</ng-form>\n" +
    "</fieldset>"
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
    "<form name=\"form.scaling\" ng-submit=\"scale()\" class=\"form-inline\" novalidate>\n" +
    "<span ng-class=\"{'has-error': form.scaling.$invalid}\">\n" +
    "<input type=\"number\" name=\"desired\" ng-model=\"model.desired\" ng-required=\"true\" min=\"0\" pattern=\"\\d*\" focus-when=\"{{model.editing}}\" select-on-focus class=\"input-number\">\n" +
    "</span>\n" +
    "<a href=\"\" title=\"Scale\" class=\"action-button\" ng-attr-aria-disabled=\"{{form.scaling.$invalid ? 'true' : undefined}}\" ng-click=\"scale()\" role=\"button\">\n" +
    "<i class=\"fa fa-check\" style=\"margin-left: 5px\"></i>\n" +
    "<span class=\"sr-only\">Scale</span>\n" +
    "</a>\n" +
    "<a href=\"\" title=\"Cancel\" class=\"action-button\" ng-click=\"cancel()\" role=\"button\">\n" +
    "<i class=\"fa fa-times\" style=\"margin-left: 5px\"></i>\n" +
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


  $templateCache.put('views/directives/resource-service-bindings.html',
    "<div class=\"mar-bottom-xl\" ng-if=\"$ctrl.showBindings\">\n" +
    "<h3>Bindings</h3>\n" +
    "<service-binding ng-repeat=\"binding in $ctrl.bindings track by (binding | uid)\" namespace=\"$ctrl.projectContext.projectName\" binding=\"binding\" ref-api-object=\"$ctrl.apiObject\" service-classes=\"$ctrl.serviceClasses\" service-instances=\"$ctrl.serviceInstances\">\n" +
    "</service-binding>\n" +
    "<div ng-if=\"($ctrl.bindableServiceInstances | size) &&\n" +
    "              ($ctrl.serviceBindingsVersion | canI : 'create') &&\n" +
    "              !$ctrl.apiObject.metadata.deletionTimestamp\">\n" +
    "<a href=\"\" ng-click=\"$ctrl.createBinding()\" role=\"button\">\n" +
    "<span class=\"pficon pficon-add-circle-o\" aria-hidden=\"true\"></span>\n" +
    "Create Binding\n" +
    "</a>\n" +
    "</div>\n" +
    "<div ng-if=\"!$ctrl.apiObject.metadata.deletionTimestamp && !($ctrl.bindableServiceInstances | size)\">\n" +
    "<span>You must have a bindable service in your namespace in order to create bindings.</span>\n" +
    "<div>\n" +
    "<a ng-href=\"{{project | catalogURL}}\">Browse Catalog</a>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"!($ctrl.bindings | size) && ($ctrl.bindableServiceInstances | size) && !($ctrl.serviceBindingsVersion | canI : 'create')\">\n" +
    "<span>There are no service bindings.</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "<overlay-panel show-panel=\"$ctrl.overlayPanelVisible\" handle-close=\"$ctrl.closeOverlayPanel\">\n" +
    "<bind-service target=\"$ctrl.apiObject\" project=\"$ctrl.project\" on-close=\"$ctrl.closeOverlayPanel\"></bind-service>\n" +
    "</overlay-panel>"
  );


  $templateCache.put('views/directives/route-service-bar-chart.html',
    "<div class=\"route-service-bar-chart\">\n" +
    "<h5>Traffic Split</h5>\n" +
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
    "<div class=\"select-container\">\n" +
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


  $templateCache.put('views/directives/service-instance-bindings.html',
    "<div ng-if=\"$ctrl.bindable || ($ctrl.bindings | size)\">\n" +
    "<h3 ng-if=\"$ctrl.showHeader\">Bindings</h3>\n" +
    "<service-binding ng-repeat=\"binding in $ctrl.bindings track by (binding | uid)\" is-overview=\"$ctrl.isOverview\" namespace=\"binding.metadata.namespace\" binding=\"binding\" ref-api-object=\"$ctrl.serviceInstance\">\n" +
    "</service-binding>\n" +
    "<p ng-if=\"$ctrl.bindable\">\n" +
    "<a href=\"\" ng-click=\"$ctrl.createBinding()\" role=\"button\">\n" +
    "<span class=\"pficon pficon-add-circle-o\" aria-hidden=\"true\"></span>\n" +
    "Create Binding\n" +
    "</a>\n" +
    "</p>\n" +
    "<p ng-if=\"!$ctrl.bindable && !($ctrl.bindings | size)\">\n" +
    "<span>There are no service bindings.</span>\n" +
    "</p>\n" +
    "</div>\n" +
    "<overlay-panel show-panel=\"$ctrl.overlayPanelVisible\" handle-close=\"$ctrl.closeOverlayPanel\">\n" +
    "<bind-service target=\"$ctrl.serviceInstance\" project=\"$ctrl.project\" on-close=\"$ctrl.closeOverlayPanel\"></bind-service>\n" +
    "</overlay-panel>"
  );


  $templateCache.put('views/directives/traffic-table.html',
    " <table class=\"table table-bordered table-mobile\">\n" +
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
    "<tr><td colspan=\"7\"><em>No routes or ports to show</em></td></tr>\n" +
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
    "<a href=\"{{routes[routeName] | routeWebURL}}\" target=\"_blank\">\n" +
    "{{routes[routeName] | routeLabel}}\n" +
    "<i class=\"fa fa-external-link\" aria-hidden=\"true\"></i>\n" +
    "</a>\n" +
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


  $templateCache.put('views/directives/ui-ace-yaml.html',
    "<ng-form name=\"$ctrl.form\">\n" +
    "<div class=\"form-group\" id=\"yaml-file\">\n" +
    "<osc-file-input ng-if=\"$ctrl.showFileInput\" model=\"$ctrl.fileUpload\" drop-zone-id=\"yaml-file\" help-text=\"Upload a file by dragging & dropping, selecting it, or pasting from the clipboard.\" ng-disabled=\"false\" hide-clear=\"true\" on-file-added=\"$ctrl.onFileAdded\"></osc-file-input>\n" +
    "<div class=\"edit-yaml-errors\">\n" +
    "\n" +
    "<div ng-if=\"firstError = $ctrl.annotations.error[0]\">\n" +
    "<a href=\"\" ng-click=\"$ctrl.gotoLine(firstError.row)\">\n" +
    "<span class=\"pficon pficon-error-circle-o\" aria-hidden=\"true\"></span>\n" +
    "Error\n" +
    "</a>\n" +
    "</div>\n" +
    "<div ng-if=\"firstWarning = $ctrl.annotations.warning[0]\">\n" +
    "<a href=\"\" ng-click=\"$ctrl.gotoLine(firstWarning.row)\">\n" +
    "<span class=\"pficon pficon-warning-triangle-o\" aria-hidden=\"true\"></span>\n" +
    "Warning\n" +
    "</a>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ui-ace=\"{\n" +
    "      mode: 'yaml',\n" +
    "      theme: 'eclipse',\n" +
    "      onLoad: $ctrl.aceLoaded,\n" +
    "      rendererOptions: {\n" +
    "        showPrintMargin: false\n" +
    "      }\n" +
    "    }\" ng-model=\"$ctrl.model\" class=\"editor ace-bordered yaml-mode\" ng-required=\"$ctrl.ngRequired\" id=\"ace-yaml-editor\"></div>\n" +
    "</div>\n" +
    "</ng-form>"
  );


  $templateCache.put('views/directives/unbind-service.html',
    "<div class=\"bind-service-wizard unbind-service\">\n" +
    "<pf-wizard wizard-title=\"Delete Binding\" hide-sidebar=\"true\" hide-back-button=\"true\" step-class=\"bind-service-wizard-step\" wizard-ready=\"ctrl.wizardReady\" next-title=\"ctrl.nextTitle\" on-finish=\"ctrl.closeWizard()\" on-cancel=\"ctrl.closeWizard()\" wizard-done=\"ctrl.wizardComplete\">\n" +
    "<pf-wizard-step ng-repeat=\"step in ctrl.steps track by step.id\" step-title=\"{{step.label}}\" next-enabled=\"step.valid\" allow-click-nav=\"false\" on-show=\"step.onShow\" step-id=\"{{step.id}}\" step-priority=\"{{$index}}\">\n" +
    "<div class=\"wizard-pf-main-inner-shadow-covers\">\n" +
    "<div class=\"bind-service-config\">\n" +
    "<div ng-include=\"step.view\" class=\"wizard-pf-main-form-contents\"></div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</pf-wizard-step>\n" +
    "</pf-wizard>\n" +
    "</div>"
  );


  $templateCache.put('views/edit/autoscaler.html',
    "<div class=\"middle surface-shaded\">\n" +
    "<div class=\"middle-content\">\n" +
    "<div class=\"container-fluid\">\n" +
    "<div class=\"row\">\n" +
    "<div class=\"col-md-10\">\n" +
    "<breadcrumbs breadcrumbs=\"breadcrumbs\"></breadcrumbs>\n" +
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
    "\n" +
    "<div ng-if=\"usesV2Metrics\" class=\"alert alert-warning\">\n" +
    "<span class=\"pficon pficon-warning-triangle-o\" aria-hidden=\"true\"></span>\n" +
    "<span class=\"sr-only\">Warning:</span>\n" +
    "This autoscaler uses a newer API, consider editing it with the\n" +
    "<a href=\"command-line\" target=\"_blank\">command line tools</a>.\n" +
    "</div>\n" +
    "<fieldset ng-disabled=\"disableInputs\" class=\"gutter-top\">\n" +
    "<osc-autoscaling model=\"autoscaling\" show-name-input=\"true\" name-read-only=\"kind === 'HorizontalPodAutoscaler'\" show-request-input=\"autoscaling.targetCPU && !(usesV2Metrics)\">\n" +
    "</osc-autoscaling>\n" +
    "<label-editor labels=\"labels\" expand=\"true\" can-toggle=\"false\"></label-editor>\n" +
    "<div class=\"buttons gutter-top gutter-bottom\">\n" +
    "<button type=\"submit\" class=\"btn btn-primary btn-lg\" ng-disabled=\"form.$invalid || form.$pristine\">\n" +
    "Save\n" +
    "</button>\n" +
    "<a href=\"\" ng-click=\"cancel()\" class=\"btn btn-default btn-lg\" role=\"button\">Cancel</a>\n" +
    "</div>\n" +
    "</fieldset>\n" +
    "</form>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/edit/build-config.html',
    "<div class=\"middle surface-shaded\" ng-show=\"buildConfig\">\n" +
    "<div class=\"middle-content\">\n" +
    "<div class=\"container-fluid\">\n" +
    "<div class=\"row\">\n" +
    "<div class=\"col-md-10\">\n" +
    "<breadcrumbs breadcrumbs=\"breadcrumbs\"></breadcrumbs>\n" +
    "<alerts alerts=\"alerts\"></alerts>\n" +
    "<div ng-if=\"!loaded\">Loading...</div>\n" +
    "<h1>\n" +
    "Edit Build Config {{buildConfig.metadata.name}}\n" +
    "<small>&mdash; {{strategyType | startCase}} Build Strategy</small>\n" +
    "</h1>\n" +
    "<fieldset ng-disabled=\"disableInputs\">\n" +
    "<form class=\"edit-form\" name=\"form\" novalidate ng-submit=\"save()\">\n" +
    "<div ng-if=\"buildConfig.spec.source.type !== 'None'\" class=\"section\">\n" +
    "<h3>Source Configuration</h3>\n" +
    "<dl class=\"dl-horizontal left\">\n" +
    "<div ng-if=\"sources.git\">\n" +
    "<div class=\"row\">\n" +
    "<div ng-class=\"{\n" +
    "                        'col-lg-8': view.advancedOptions,\n" +
    "                        'col-lg-12': !view.advancedOptions}\">\n" +
    "<div class=\"form-group\">\n" +
    "<label for=\"sourceUrl\" class=\"required\">Git Repository URL</label>\n" +
    "<div ng-class=\"{\n" +
    "                            'has-warning': form.sourceUrl.$touched && !sourceURLPattern.test(updatedBuildConfig.spec.source.git.uri),\n" +
    "                            'has-error': form.sourceUrl.$touched && form.sourceUrl.$error.required\n" +
    "                          }\">\n" +
    "\n" +
    "<input class=\"form-control\" id=\"sourceUrl\" name=\"sourceUrl\" ng-model=\"updatedBuildConfig.spec.source.git.uri\" type=\"text\" autocorrect=\"off\" autocapitalize=\"none\" spellcheck=\"false\" aria-describedby=\"source-url-help\" required>\n" +
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
    "<input class=\"form-control\" id=\"sourceRef\" name=\"sourceRef\" type=\"text\" ng-model=\"updatedBuildConfig.spec.source.git.ref\" placeholder=\"master\" autocorrect=\"off\" autocapitalize=\"none\" spellcheck=\"false\" aria-describedby=\"source-ref-help\">\n" +
    "</div>\n" +
    "<div class=\"help-block\" id=\"source-ref-help\">Optional branch, tag, or commit.</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"view.advancedOptions\">\n" +
    "<div class=\"form-group\">\n" +
    "<label for=\"sourceContextDir\">Context Dir</label>\n" +
    "<div>\n" +
    "<input class=\"form-control\" id=\"sourceContextDir\" name=\"sourceContextDir\" type=\"text\" ng-model=\"updatedBuildConfig.spec.source.contextDir\" placeholder=\"/\" autocorrect=\"off\" autocapitalize=\"none\" spellcheck=\"false\" aria-describedby=\"context-dir-help\">\n" +
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
    "                        mode: 'dockerfile',\n" +
    "                        theme: 'dreamweaver',\n" +
    "                        rendererOptions: {\n" +
    "                          fadeFoldWidgets: true,\n" +
    "                          showPrintMargin: false\n" +
    "                        }\n" +
    "                      }\" ng-model=\"updatedBuildConfig.spec.source.dockerfile\" class=\"ace-bordered ace-inline dockerfile-mode\"></div>\n" +
    "</div>\n" +
    "<div class=\"form-group\" ng-if=\"updatedBuildConfig.spec.strategy.dockerStrategy.dockerfilePath && view.advancedOptions\">\n" +
    "<label for=\"dockerfilePath\">Dockerfile Path</label>\n" +
    "<div>\n" +
    "<input class=\"form-control\" id=\"dockerfilePath\" name=\"dockerfilePath\" type=\"text\" ng-model=\"updatedBuildConfig.spec.strategy.dockerStrategy.dockerfilePath\" autocorrect=\"off\" autocapitalize=\"none\" spellcheck=\"false\">\n" +
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
    "<istag-select include-shared-namespace=\"true\" select-required=\"true\" model=\"imageOptions.fromSource.imageStreamTag\"></istag-select>\n" +
    "</div>\n" +
    "<div ng-if=\"imageOptions.fromSource.type==='ImageStreamImage'\" class=\"form-group\">\n" +
    "<label for=\"imageSourceImage\">Image Stream Image</label>\n" +
    "<div>\n" +
    "<input class=\"form-control\" type=\"text\" ng-model=\"imageOptions.fromSource.imageStreamImage\" placeholder=\"example: openshift/ruby-20-centos7@603bfa418\" autocorrect=\"off\" autocapitalize=\"none\" spellcheck=\"false\" required>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"imageOptions.fromSource.type==='DockerImage'\" class=\"form-group\">\n" +
    "<label for=\"imageSourceLink\">Docker Image Repository</label>\n" +
    "<div>\n" +
    "<input class=\"form-control\" id=\"imageSourceLink\" name=\"imageSourceLink\" type=\"text\" ng-model=\"imageOptions.fromSource.dockerImage\" placeholder=\"example: centos/ruby-20-centos7:latest\" autocorrect=\"off\" autocapitalize=\"none\" spellcheck=\"false\" required>\n" +
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
    "<input class=\"form-control\" id=\"jenkinsfilePath\" name=\"jenkinsfilePath\" type=\"text\" ng-model=\"updatedBuildConfig.spec.strategy.jenkinsPipelineStrategy.jenkinsfilePath\" autocorrect=\"off\" autocapitalize=\"none\" spellcheck=\"false\" aria-describedby=\"jenkinsfile-path-help\">\n" +
    "<div class=\"help-block\" id=\"jenkinsfile-path-help\">\n" +
    "Optional path to the Jenkinsfile relative to the context dir. Defaults to the Jenkinsfile in context dir.\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"jenkinsfileOptions.type === 'inline'\">\n" +
    "<label>Jenkinsfile</label>\n" +
    "<div ui-ace=\"{\n" +
    "                    mode: 'groovy',\n" +
    "                    theme: 'eclipse',\n" +
    "                    rendererOptions: {\n" +
    "                      fadeFoldWidgets: true,\n" +
    "                      showPrintMargin: false\n" +
    "                    }\n" +
    "                  }\" ng-model=\"updatedBuildConfig.spec.strategy.jenkinsPipelineStrategy.jenkinsfile\" class=\"ace-bordered ace-inline\"></div>\n" +
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
    "<istag-select include-shared-namespace=\"true\" select-required=\"true\" model=\"imageOptions.from.imageStreamTag\"></istag-select>\n" +
    "</div>\n" +
    "<div ng-if=\"imageOptions.from.type==='DockerImage'\" class=\"form-group\">\n" +
    "<label for=\"FromTypeLink\">Docker Image Repository</label>\n" +
    "<div>\n" +
    "<input class=\"form-control\" type=\"text\" ng-model=\"imageOptions.from.dockerImage\" autocorrect=\"off\" autocapitalize=\"none\" placeholder=\"example: centos/ruby-20-centos7:latest\" spellcheck=\"false\" required>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"imageOptions.from.type==='ImageStreamImage'\" class=\"form-group\">\n" +
    "<label for=\"FromTypeImage\">Image Stream Image</label>\n" +
    "<div>\n" +
    "<input class=\"form-control\" type=\"text\" ng-model=\"imageOptions.from.imageStreamImage\" placeholder=\"example: openshift/ruby-20-centos7@603bfa418\" autocorrect=\"off\" autocapitalize=\"none\" spellcheck=\"false\" required>\n" +
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
    "<istag-select model=\"imageOptions.to.imageStreamTag\" select-required=\"true\" allow-custom-tag=\"true\"></istag-select>\n" +
    "</div>\n" +
    "<div ng-if=\"imageOptions.to.type==='DockerImage'\" class=\"form-group\">\n" +
    "<label for=\"pushToLink\">Docker Image Repository</label>\n" +
    "<div>\n" +
    "<input class=\"form-control\" id=\"pushToLink\" name=\"pushToLink\" type=\"text\" ng-model=\"imageOptions.to.dockerImage\" placeholder=\"example: centos/ruby-20-centos7:latest\" autocorrect=\"off\" autocapitalize=\"none\" spellcheck=\"false\" required>\n" +
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
    "<key-value-editor ng-if=\"envVars\" entries=\"envVars\" key-placeholder=\"Name\" value-placeholder=\"Value\" show-header value-from-selector-options=\"valueFromObjects\" key-validator=\"[a-zA-Z_][a-zA-Z0-9_]*\" key-validator-error-tooltip=\"A valid environment variable name is an alphanumeric (a-z and 0-9) string beginning with a letter that may contain underscores.\" add-row-link=\"Add Value\" add-row-with-selectors-link=\"Add Value from Config Map or Secret\"></key-value-editor>\n" +
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
    "<osc-webhook-triggers type=\"webhook\" form=\"form\" webhook-secrets=\"webhookSecrets\" webhook-triggers=\"triggers.webhookTriggers\" namespace=\"projectName\">\n" +
    "</osc-webhook-triggers>\n" +
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
    "                            mode: 'sh',\n" +
    "                            theme: 'eclipse',\n" +
    "                            rendererOptions: {\n" +
    "                              fadeFoldWidgets: true,\n" +
    "                              showPrintMargin: false\n" +
    "                            }\n" +
    "                          }\" ng-model=\"updatedBuildConfig.spec.postCommit.script\" required class=\"ace-bordered ace-inline\">\n" +
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
    "<button class=\"btn btn-default btn-lg\" ng-click=\"cancel()\">Cancel</button>\n" +
    "</div>\n" +
    "</form>\n" +
    "</fieldset>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/edit/config-map.html',
    "<div class=\"middle surface-shaded\">\n" +
    "<div class=\"middle-content\">\n" +
    "<div class=\"container-fluid\">\n" +
    "<div class=\"row\">\n" +
    "<div class=\"col-md-10\">\n" +
    "<breadcrumbs breadcrumbs=\"breadcrumbs\"></breadcrumbs>\n" +
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
    "<edit-config-map-or-secret model=\"configMap\" type=\"config map\"></edit-config-map-or-secret>\n" +
    "<div class=\"button-group gutter-top gutter-bottom\">\n" +
    "<button type=\"submit\" class=\"btn btn-primary btn-lg\" ng-click=\"updateConfigMap()\" ng-disabled=\"forms.editConfigMapForm.$invalid || forms.editConfigMapForm.$pristine || disableInputs || resourceChanged || resourceDeleted\" value=\"\">Save</button>\n" +
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
    "</div>"
  );


  $templateCache.put('views/edit/deployment-config.html',
    "<div class=\"middle surface-shaded\" ng-show=\"deploymentConfig\">\n" +
    "<div class=\"middle-content\">\n" +
    "<div class=\"container-fluid\">\n" +
    "<div class=\"row\">\n" +
    "<div class=\"col-md-10\">\n" +
    "<breadcrumbs breadcrumbs=\"breadcrumbs\"></breadcrumbs>\n" +
    "<alerts alerts=\"alerts\"></alerts>\n" +
    "<div ng-if=\"!loaded\">Loading...</div>\n" +
    "<div ng-if=\"loaded\">\n" +
    "<h1>\n" +
    "Edit Deployment Config {{deploymentConfig.metadata.name}}\n" +
    "</h1>\n" +
    "<fieldset ng-disabled=\"disableInputs\">\n" +
    "<form class=\"edit-form\" name=\"form\" novalidate>\n" +
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
    "<label for=\"image-name\">Image Name</label>\n" +
    "<div>\n" +
    "<input class=\"form-control\" id=\"image-name\" name=\"imageName\" ng-model=\"strategyData.customParams.image\" type=\"text\" autocorrect=\"off\" autocapitalize=\"none\" spellcheck=\"false\" aria-describedby=\"image-name-help\">\n" +
    "</div>\n" +
    "<div class=\"help-block\" id=\"image-name-help\">An image that can carry out the deployment.</div>\n" +
    "</div>\n" +
    "<div class=\"form-group\">\n" +
    "<label>Command</label>\n" +
    "<edit-command args=\"strategyData.customParams.command\"></edit-command>\n" +
    "</div>\n" +
    "<div class=\"form-group\">\n" +
    "<label>Environment Variables</label>\n" +
    "<key-value-editor entries=\"strategyData.customParams.environment\" key-validator=\"[a-zA-Z_][a-zA-Z0-9_]*\" key-validator-error-tooltip=\"A valid environment variable name is an alphanumeric (a-z and 0-9) string beginning with a letter that may contain underscores.\" value-from-selector-options=\"valueFromObjects\" add-row-link=\"Add Value\" add-row-with-selectors-link=\"Add Value from Config Map or Secret\"></key-value-editor>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"strategyData.type !== 'Custom'\">\n" +
    "<div class=\"form-group\">\n" +
    "<label for=\"strategy-timeout\">Timeout</label>\n" +
    "<span class=\"input-group\" ng-class=\"{ 'has-error': form.strategyTimeout.$invalid && form.strategyTimeout.$touched }\">\n" +
    "<input id=\"strategy-timeout\" type=\"number\" name=\"strategyTimeout\" ng-model=\"strategyData[strategyParamsPropertyName].timeoutSeconds\" placeholder=\"600\" pattern=\"\\d*\" min=\"0\" select-on-focus class=\"form-control\" aria-describedby=\"strategy-timeout-help\">\n" +
    "<span class=\"input-group-addon\">seconds</span>\n" +
    "</span>\n" +
    "<div class=\"help-block\" id=\"strategy-timeout-help\">\n" +
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
    "<label for=\"update-period\">Update Period</label>\n" +
    "<span class=\"input-group\" ng-class=\"{ 'has-error': form.updatePeriod.$invalid && form.updatePeriod.$touched }\">\n" +
    "<input id=\"update-period\" type=\"number\" placeholder=\"1\" name=\"updatePeriod\" ng-model=\"strategyData[strategyParamsPropertyName].updatePeriodSeconds\" pattern=\"\\d*\" min=\"0\" select-on-focus class=\"form-control\" aria-describedby=\"update-period-help\">\n" +
    "<span class=\"input-group-addon\">seconds</span>\n" +
    "</span>\n" +
    "<div class=\"help-block\" id=\"update-period-help\">\n" +
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
    "<input id=\"interval\" type=\"number\" placeholder=\"1\" name=\"interval\" ng-model=\"strategyData[strategyParamsPropertyName].intervalSeconds\" pattern=\"\\d*\" min=\"0\" select-on-focus class=\"form-control\" aria-describedby=\"interval-help\">\n" +
    "<span class=\"input-group-addon\">seconds</span>\n" +
    "</span>\n" +
    "<div class=\"help-block\" id=\"interval-help\">\n" +
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
    "<label for=\"max-unavailable\">Maximum Number of Unavailable Pods</label>\n" +
    "<div ng-class=\"{ 'has-error': form.maxUnavailable.$invalid && form.maxUnavailable.$touched }\">\n" +
    "<input id=\"max-unavailable\" type=\"text\" placeholder=\"25%\" name=\"maxUnavailable\" ng-model=\"strategyData[strategyParamsPropertyName].maxUnavailable\" ng-pattern=\"/^\\d+%?$/\" select-on-focus class=\"form-control\" aria-describedby=\"max-unavailable-help\">\n" +
    "</div>\n" +
    "<div class=\"help-block\" id=\"max-unavailable-help\">\n" +
    "The maximum number of pods that can be unavailable during the rolling deployment. This can be either a percentage (10%) or a whole number (1).\n" +
    "</div>\n" +
    "<div ng-if=\"form.maxUnavailable.$invalid && form.maxUnavailable.$touched && form.maxUnavailable.$error.pattern\" class=\"has-error\">\n" +
    "<span class=\"help-block\">\n" +
    "Must be a non-negative whole number or percentage.\n" +
    "</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"form-group\">\n" +
    "<label for=\"max-surge\">Maximum Number of Surge Pods</label>\n" +
    "<div ng-class=\"{ 'has-error': form.maxSurge.$invalid && form.maxSurge.$touched }\">\n" +
    "<input id=\"max-surge\" type=\"text\" placeholder=\"25%\" name=\"maxSurge\" ng-model=\"strategyData[strategyParamsPropertyName].maxSurge\" ng-pattern=\"/^\\d+%?$/\" select-on-focus class=\"form-control\" aria-describedby=\"max-surge-help\">\n" +
    "</div>\n" +
    "<div class=\"help-block\" id=\"max-surge-help\">\n" +
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
    "<edit-lifecycle-hook model=\"strategyData[strategyParamsPropertyName].pre\" type=\"pre\" available-volumes=\"volumeNames\" available-containers=\"containerNames\" available-secrets=\"availableSecrets\" available-config-maps=\"availableConfigMaps\" namespace=\"projectName\">\n" +
    "</edit-lifecycle-hook>\n" +
    "</div>\n" +
    "<div ng-if=\"strategyData.type !== 'Rolling'\" class=\"lifecycle-hook\" id=\"mid-lifecycle-hook\">\n" +
    "<h3>Mid Lifecycle Hook</h3>\n" +
    "<edit-lifecycle-hook model=\"strategyData[strategyParamsPropertyName].mid\" type=\"mid\" available-volumes=\"volumeNames\" available-containers=\"containerNames\" available-secrets=\"availableSecrets\" available-config-maps=\"availableConfigMaps\" namespace=\"projectName\">\n" +
    "</edit-lifecycle-hook>\n" +
    "</div>\n" +
    "<div class=\"lifecycle-hook\" id=\"post-lifecycle-hook\">\n" +
    "<h3>Post Lifecycle Hook</h3>\n" +
    "<edit-lifecycle-hook model=\"strategyData[strategyParamsPropertyName].post\" type=\"post\" available-volumes=\"volumeNames\" available-containers=\"containerNames\" available-secrets=\"availableSecrets\" available-config-maps=\"availableConfigMaps\" namespace=\"projectName\">\n" +
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
    "<istag-select model=\"containerConfig.triggerData.istag\" select-required=\"true\" select-disabled=\"disableInputs\" include-shared-namespace=\"true\"></istag-select>\n" +
    "<div class=\"checkbox form-group\">\n" +
    "<label>\n" +
    "<input type=\"checkbox\" ng-model=\"containerConfig.triggerData.automatic\">\n" +
    "Automatically start a new deployment when the image changes\n" +
    "</label>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"!containerConfig.hasDeploymentTrigger\" class=\"form-group\">\n" +
    "<label for=\"container-{{$index}}-image-name\" class=\"required\">Image Name</label>\n" +
    "<input class=\"form-control\" id=\"container-{{$index}}-image-name\" name=\"container{{$index}}ImageName\" ng-model=\"containerConfig.image\" type=\"text\" autocorrect=\"off\" autocapitalize=\"none\" spellcheck=\"false\" required>\n" +
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
    "<key-value-editor ng-if=\"containerConfig\" entries=\"containerConfig.env\" value-from-selector-options=\"valueFromObjects\" key-validator=\"[a-zA-Z_][a-zA-Z0-9_]*\" key-validator-error-tooltip=\"A valid environment variable name is an alphanumeric (a-z and 0-9) string beginning with a letter that may contain underscores.\" add-row-link=\"Add Value\" add-row-with-selectors-link=\"Add Value from Config Map or Secret\"></key-value-editor>\n" +
    "</div>\n" +
    "</div>\n" +
    "<pause-rollouts-checkbox deployment=\"updatedDeploymentConfig\" always-visible=\"true\">\n" +
    "</pause-rollouts-checkbox>\n" +
    "<div class=\"buttons gutter-top-bottom\">\n" +
    "<button ng-click=\"save()\" class=\"btn btn-primary btn-lg\" ng-disabled=\"form.$invalid || form.$pristine || disableInputs\">\n" +
    "Save\n" +
    "</button>\n" +
    "<button ng-click=\"cancel()\" class=\"btn btn-default btn-lg\">Cancel</button>\n" +
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


  $templateCache.put('views/edit/health-checks.html',
    "<div class=\"middle surface-shaded\">\n" +
    "<div class=\"middle-content\">\n" +
    "<div class=\"container-fluid\">\n" +
    "<div class=\"row\">\n" +
    "<div class=\"col-md-10\">\n" +
    "<breadcrumbs breadcrumbs=\"breadcrumbs\"></breadcrumbs>\n" +
    "<div ng-show=\"!containers.length\" class=\"mar-top-md\">Loading...</div>\n" +
    "<form ng-show=\"containers.length\" name=\"form\" class=\"health-checks-form\" novalidate>\n" +
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
    "<button class=\"btn btn-default btn-lg\" ng-click=\"cancel()\">Cancel</button>\n" +
    "</div>\n" +
    "</fieldset>\n" +
    "</form>\n" +
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
    "<div class=\"middle surface-shaded\">\n" +
    "<div class=\"middle-content\">\n" +
    "<div class=\"container gutter-top\">\n" +
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
    "</div>"
  );


  $templateCache.put('views/edit/route.html',
    "<div class=\"middle surface-shaded\">\n" +
    "<div class=\"middle-content\">\n" +
    "<div class=\"container-fluid\">\n" +
    "<div class=\"row\">\n" +
    "<div class=\"col-md-10\">\n" +
    "<breadcrumbs breadcrumbs=\"breadcrumbs\"></breadcrumbs>\n" +
    "<alerts alerts=\"alerts\"></alerts>\n" +
    "<h1>Edit Route {{routeName}}</h1>\n" +
    "<div ng-if=\"loading\">\n" +
    "Loading...\n" +
    "</div>\n" +
    "<form name=\"form\" novalidate>\n" +
    "<fieldset ng-disabled=\"disableInputs\" ng-if=\"!loading\">\n" +
    "<osc-routing model=\"routing\" services=\"services\" show-name-input=\"false\" existing-route=\"true\">\n" +
    "</osc-routing>\n" +
    "<div class=\"button-group gutter-top gutter-bottom\">\n" +
    "<button type=\"submit\" class=\"btn btn-primary btn-lg\" ng-click=\"updateRoute()\" ng-disabled=\"form.$invalid || disableInputs\" value=\"\">Save</button>\n" +
    "<button class=\"btn btn-default btn-lg\" ng-click=\"cancel()\">Cancel</button>\n" +
    "</div>\n" +
    "</fieldset>\n" +
    "</form>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/edit/yaml.html',
    "<div class=\"middle surface-shaded edit-yaml\">\n" +
    "<div class=\"middle-content\">\n" +
    "<div class=\"container-fluid\">\n" +
    "<breadcrumbs breadcrumbs=\"breadcrumbs\"></breadcrumbs>\n" +
    "<alerts alerts=\"alerts\"></alerts>\n" +
    "<div ng-if=\"!updated.resource\" class=\"pad-top-md\">Loading...</div>\n" +
    "<div ng-if=\"updated.resource\">\n" +
    "<h1 class=\"truncate\">Edit <span class=\"hidden-xs\">{{updated.resource.kind | humanizeKind : true}}</span> {{updated.resource.metadata.name}}</h1>\n" +
    "<parse-error error=\"error\" ng-if=\"error\"></parse-error>\n" +
    "<div ng-if=\"resourceChanged && !resourceDeleted && !updatingNow\" class=\"alert alert-warning\">\n" +
    "<span class=\"pficon pficon-warning-triangle-o\" aria-hidden=\"true\"></span>\n" +
    "<span class=\"sr-only\">Warning:</span>\n" +
    "{{updated.resource.kind | humanizeKind | upperFirst}} <strong>{{updated.resource.metadata.name}}</strong> has changed since you started editing it. You'll need to copy any changes you've made and edit the {{updated.resource.kind | humanizeKind}} again.\n" +
    "</div>\n" +
    "<div ng-if=\"resourceDeleted\" class=\"alert alert-warning\">\n" +
    "<span class=\"pficon pficon-warning-triangle-o\" aria-hidden=\"true\"></span>\n" +
    "<span class=\"sr-only\">Warning:</span>\n" +
    "{{updated.resource.kind | humanizeKind | upperFirst}} <strong>{{updated.resource.metadata.name}}</strong> has been deleted since you started editing it.\n" +
    "</div>\n" +
    "<confirm-on-exit dirty=\"modified\"></confirm-on-exit>\n" +
    "<form name=\"editor.form\">\n" +
    "<ui-ace-yaml resource=\"updated.resource\" ng-required=\"true\"></ui-ace-yaml>\n" +
    "<div class=\"button-group mar-top-xl\">\n" +
    "<button class=\"btn btn-lg btn-primary\" type=\"button\" ng-click=\"save()\" ng-disabled=\"editor.form.$pristine || editor.form.$invalid || resourceChanged || resourceDeleted || updatingNow\">Save</button>\n" +
    "<button class=\"btn btn-lg btn-default\" type=\"button\" ng-disabled=\"updatingNow\" ng-click=\"cancel()\">Cancel</button>\n" +
    "</div>\n" +
    "</form>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/events.html',
    "<div class=\"middle\">\n" +
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
    "</div>"
  );


  $templateCache.put('views/images.html',
    "<div class=\"middle\">\n" +
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
    "<div ng-if=\"(imageStreams | hashSize) > 0 || filterWithZeroResults\" class=\"data-toolbar\">\n" +
    "<div class=\"data-toolbar-filter\">\n" +
    "<project-filter></project-filter>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"middle-content\">\n" +
    "<div class=\"container-fluid\">\n" +
    "<div class=\"row\">\n" +
    "<div class=\"col-md-12\">\n" +
    "<div ng-if=\"(imageStreams | hashSize) == 0\">\n" +
    "<p ng-if=\"!imageStreamsLoaded\">\n" +
    "Loading...\n" +
    "</p>\n" +
    "<div ng-if=\"imageStreamsLoaded\" class=\"empty-state-message text-center\">\n" +
    "<div ng-if=\"!filterWithZeroResults\">\n" +
    "<h2>No image streams.</h2>\n" +
    "<p>No image streams have been added to project {{projectName}}.</p>\n" +
    "</div>\n" +
    "<div ng-if=\"filterWithZeroResults\">\n" +
    "<h2>The filter is hiding all image streams. <button type=\"button\" class=\"btn btn-link inline-btn-link\" ng-click=\"clearFilter()\">Clear All Filters</button></h2>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<table ng-if=\"(imageStreams | hashSize) > 0\" class=\"table table-bordered table-mobile table-layout-fixed\">\n" +
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
    "<tbody>\n" +
    "<tr ng-repeat=\"imageStream in imageStreams track by (imageStream | uid)\">\n" +
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
    "</div>"
  );


  $templateCache.put('views/landing-page.html',
    "<div class=\"middle landing-page\">\n" +
    "<div class=\"middle-content\">\n" +
    "<overlay-panel show-panel=\"ordering.panelName\" handle-close=\"closeOrderingPanel\">\n" +
    "<process-template-dialog ng-if=\"template\" template=\"template\" on-dialog-closed=\"closeOrderingPanel\"></process-template-dialog>\n" +
    "<deploy-image-dialog ng-if=\"ordering.panelName === 'deployImage'\" on-dialog-closed=\"closeOrderingPanel\"></deploy-image-dialog>\n" +
    "<from-file-dialog ng-if=\"ordering.panelName === 'fromFile'\" on-dialog-closed=\"closeOrderingPanel\"></from-file-dialog>\n" +
    "<process-template-dialog ng-if=\"ordering.panelName === 'fromProject'\" use-project-template=\"true\" on-dialog-closed=\"closeOrderingPanel\"></process-template-dialog>\n" +
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
    "<services-view catalog-items=\"catalogItems\" base-project-url=\"project\" on-deploy-image-selected=\"deployImageSelected\" on-from-file-selected=\"fromFileSelected\" on-create-from-project=\"fromProjectSelected\">\n" +
    "</services-view>\n" +
    "</landingbody>\n" +
    "<landingside>\n" +
    "<projects-summary base-project-url=\"project\" projects-url=\"projects\" start-tour=\"startGuidedTour\" view-edit-membership=\"viewMembership\" catalog-items=\"catalogItems\"></projects-summary>\n" +
    "</landingside>\n" +
    "</landing-page>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/logs/chromeless-build-log.html',
    "<div class=\"chromeless\">\n" +
    "<div class=\"container-fluid\">\n" +
    "<alerts alerts=\"alerts\"></alerts>\n" +
    "</div>\n" +
    "<div class=\"middle-content\">\n" +
    "<log-viewer ng-if=\"build\" object=\"build\" context=\"projectContext\" status=\"build.status.phase\" time-start=\"build.status.startTimestamp | date : 'medium'\" time-end=\"build.status.completionTimestamp | date : 'medium'\" chromeless=\"true\" run=\"logCanRun\">\n" +
    "</log-viewer>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/logs/chromeless-deployment-log.html',
    "<div class=\"chromeless\">\n" +
    "<div class=\"container-fluid\">\n" +
    "<alerts alerts=\"alerts\"></alerts>\n" +
    "</div>\n" +
    "<div class=\"middle-content\">\n" +
    "<log-viewer ng-if=\"deploymentConfigName && logOptions.version\" object=\"replicaSet\" context=\"projectContext\" options=\"logOptions\" chromeless=\"true\" run=\"logCanRun\">\n" +
    "</log-viewer>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/logs/chromeless-pod-log.html',
    "<div class=\"chromeless\">\n" +
    "<div class=\"container-fluid\">\n" +
    "<alerts alerts=\"alerts\"></alerts>\n" +
    "</div>\n" +
    "<div class=\"middle-content\">\n" +
    "<log-viewer ng-if=\"pod\" object=\"pod\" context=\"projectContext\" options=\"logOptions\" status=\"pod.status.phase\" time-start=\"pod.status.startTime | date : 'medium'\" chromeless=\"true\" run=\"logCanRun\">\n" +
    "</log-viewer>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/logs/textonly_log.html',
    " <log-viewer logs=\"logs\" loading=\"logsLoading\"></log-viewer>"
  );


  $templateCache.put('views/membership.html',
    "<div class=\"middle membership\" ng-if=\"project\">\n" +
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
    "<div ng-if=\"!(roleBindingsVersion | canI : 'list')\">\n" +
    "<p>You do not have permission to view roles in this project.</p>\n" +
    "</div>\n" +
    "<uib-tabset ng-if=\"roleBindingsVersion | canI : 'list'\">\n" +
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
    "<div class=\"content-pane\" ng-class=\"'content-' + subjectKind.name.toLowerCase()\">\n" +
    "<div class=\"col-heading\">\n" +
    "<div class=\"col-name\">\n" +
    "<h3>Name</h3>\n" +
    "</div>\n" +
    "<div class=\"action-set\">\n" +
    "<div class=\"col-roles\">\n" +
    "<h3>Roles</h3>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"(subjectKind.subjects | hashSize) === 0\" class=\"membership-empty\">\n" +
    "<p>\n" +
    "<em>There are no {{ subjectKind.name | humanizeKind }}s with access to this project.</em>\n" +
    "</p>\n" +
    "</div>\n" +
    "<div ng-repeat=\"subject in subjectKind.subjects\" class=\"item-row highlight-hover\">\n" +
    "<div class=\"col-name\">\n" +
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
    "<div class=\"action-set\">\n" +
    "<div class=\"col-roles\">\n" +
    "<action-chip ng-repeat=\"role in subject.roles\" key=\"role.metadata.name\" key-help=\"roleHelp(role)\" show-action=\"mode.edit\" action=\"confirmRemove(subject.name, subjectKind.name, role.metadata.name, subject.namespace)\" action-title=\"Remove role {{role.metadata.name}} from {{subject.name}}\"></action-chip>\n" +
    "</div>\n" +
    "<div ng-if=\"mode.edit\" class=\"col-add-role\">\n" +
    "<div class=\"col-add-role-inputs\">\n" +
    "<ui-select ng-if=\"filteredRoles.length\" ng-model=\"subject.newRole\" theme=\"bootstrap\" search-enabled=\"true\" title=\"Select a new role for {{subject.name}}\" class=\"select-role\">\n" +
    "<ui-select-match placeholder=\"Select a role\">\n" +
    "<span ng-bind=\"subject.newRole.metadata.name\"></span>\n" +
    "</ui-select-match>\n" +
    "<ui-select-choices repeat=\"role as role in filteredRoles | filter: excludeExistingRoles(subject.roles) | filter: { metadata: { name: $select.search } } track by (role | uid)\">\n" +
    "<div ng-bind-html=\"role.metadata.name | highlight: $select.search\" title=\"{{role.metadata.name}}\"></div>\n" +
    "<div ng-if=\"role | annotation : 'description'\" title=\"{{role.metadata.name}}\">\n" +
    "<small>{{role | annotation : 'description'}}</small>\n" +
    "</div>\n" +
    "</ui-select-choices>\n" +
    "</ui-select>\n" +
    "<button ng-disabled=\"disableAddForm || (!subject.newRole)\" ng-click=\"addRoleTo(subject.name, subjectKind.name, subject.newRole, subject.namespace)\" class=\"btn btn-default add-role-to\">\n" +
    "Add\n" +
    "</button>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<ng-form class=\"new-binding\" novalidate name=\"forms.newBindingForm\" ng-if=\"newBinding\">\n" +
    "<div ng-if=\"mode.edit\" class=\"item-row form-new-role\">\n" +
    "<div class=\"col-name service-account\">\n" +
    "<label ng-attr-for=\"newBindingName\" class=\"sr-only\">\n" +
    "Name\n" +
    "</label>\n" +
    "\n" +
    "<input ng-if=\"newBinding.kind !== 'ServiceAccount'\" type=\"text\" class=\"form-control input-name\" placeholder=\"Name\" ng-model=\"newBinding.name\" autocorrect=\"off\" autocapitalize=\"none\" spellcheck=\"false\">\n" +
    "\n" +
    "<div ng-if=\"newBinding.kind === 'ServiceAccount'\" class=\"service-account-namespace\" aria-hidden=\"true\">\n" +
    "<ui-select ng-model=\"newBinding.namespace\" on-select=\"selectProject($item, $model)\" theme=\"bootstrap\" search-enabled=\"true\" title=\"Select a project\" class=\"select-project\">\n" +
    "<ui-select-match placeholder=\"Select a project\">\n" +
    "<span>{{newBinding.namespace}}</span>\n" +
    "</ui-select-match>\n" +
    "<ui-select-choices repeat=\"projectName in projects | filter: $select.search\" refresh=\"refreshProjects($select.search)\" refresh-delay=\"200\">\n" +
    "<div ng-bind-html=\"projectName | highlight : $select.search\"></div>\n" +
    "</ui-select-choices>\n" +
    "</ui-select>\n" +
    "</div>\n" +
    "<span ng-if=\"newBinding.kind === 'ServiceAccount'\" class=\"mar-left-sm mar-right-sm\">/</span>\n" +
    "\n" +
    "<div ng-if=\"newBinding.kind === 'ServiceAccount'\" class=\"service-account-name\">\n" +
    "<ui-select ng-model=\"newBinding.name\" theme=\"bootstrap\" search-enabled=\"true\" title=\"Select a service account\" class=\"select-service-account\">\n" +
    "<ui-select-match placeholder=\"Service account\">\n" +
    "<span>{{newBinding.name}}</span>\n" +
    "</ui-select-match>\n" +
    "<ui-select-choices repeat=\"saName in serviceAccounts | filter: $select.search\" refresh=\"refreshServiceAccounts($select.search)\" refresh-delay=\"200\">\n" +
    "<div ng-bind-html=\"saName | highlight : $select.search\"></div>\n" +
    "</ui-select-choices>\n" +
    "</ui-select>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"action-set\">\n" +
    "<div class=\"col-add-role\">\n" +
    "<div ng-show=\"mode.edit\" class=\"col-add-role-inputs\">\n" +
    "<ui-select ng-if=\"filteredRoles.length\" ng-model=\"newBinding.newRole\" theme=\"bootstrap\" search-enabled=\"true\" title=\"new {{subjectKind.name}} role\" class=\"select-role\">\n" +
    "<ui-select-match placeholder=\"Select a role\">\n" +
    "<span ng-bind=\"newBinding.newRole.metadata.name\"></span>\n" +
    "</ui-select-match>\n" +
    "<ui-select-choices repeat=\"role as role in filteredRoles | filter: { metadata: { name: $select.search } } track by (role | uid)\">\n" +
    "<div ng-bind-html=\"role.metadata.name | highlight: $select.search\" title=\"{{role.metadata.name}}\"></div>\n" +
    "<div ng-if=\"role | annotation : 'description'\" title=\"{{role.metadata.name}}\">\n" +
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
    "<div ng-if=\"mode.edit\" class=\"show-hidden-roles\">\n" +
    "<div class=\"checkbox\">\n" +
    "<label>\n" +
    "<input type=\"checkbox\" class=\"toggle-hidden\" ng-click=\"toggleRoles($event)\" ng-checked=\"toggle.roles\">\n" +
    "Show hidden roles</label>&nbsp;<a href=\"\" class=\"action-inline\" data-toggle=\"popover\" data-trigger=\"hover focus\" data-content=\"System roles are hidden by default and do not typically need to be managed.\"><i class=\"pficon pficon-help\"></i></a>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</uib-tab>\n" +
    "</uib-tabset>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/modals/about-compute-units-modal.html',
    "<div class=\"about-compute-units-modal\">\n" +
    "<div class=\"modal-header\">\n" +
    "<button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\" aria-label=\"Close\" ng-click=\"close()\">\n" +
    "<span class=\"pficon pficon-close\"></span>\n" +
    "</button>\n" +
    "<h1 class=\"modal-title\">\n" +
    "Compute Resources\n" +
    "<span class=\"page-header-link\">\n" +
    "<a href=\"{{'compute_resources' | helpLink}}\" target=\"_blank\">Learn More <i class=\"fa fa-external-link\" aria-hidden=\"true\"></i></a>\n" +
    "</span>\n" +
    "</h1>\n" +
    "</div>\n" +
    "<div class=\"modal-body\">\n" +
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
    "<button class=\"btn btn-default\" type=\"button\" ng-click=\"close()\">Close</button>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/modals/confirm-replace.html',
    "<div class=\"modal-resource-action\">\n" +
    "<div class=\"modal-header\">\n" +
    "<button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\" aria-label=\"Close\" ng-click=\"cancel()\">\n" +
    "<span class=\"pficon pficon-close\"></span>\n" +
    "</button>\n" +
    "<h1 class=\"modal-title\">Confirm Replace</h1>\n" +
    "</div>\n" +
    "<div class=\"modal-body\">\n" +
    "<div ng-if=\"!isList\">\n" +
    "<p>{{resourceKind}} '<strong>{{resourceName}}</strong>' already exists.</p>\n" +
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
    "<button class=\"btn btn-default\" type=\"button\" ng-click=\"cancel();\">Cancel</button>\n" +
    "<button class=\"btn btn-primary\" type=\"button\" ng-click=\"replace();\">Replace</button>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/modals/confirm-save-log.html',
    "<div class=\"modal-resource-action\">\n" +
    "<div class=\"modal-header\">\n" +
    "<button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\" aria-label=\"Close\" ng-click=\"cancel()\">\n" +
    "<span class=\"pficon pficon-close\"></span>\n" +
    "</button>\n" +
    "<h1 class=\"modal-title\">Confirm Save</h1>\n" +
    "</div>\n" +
    "<div class=\"modal-body\">\n" +
    "<p>Save partial log for <strong>{{object.metadata.name}}</strong>?</p>\n" +
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
    "<button class=\"btn btn-default\" type=\"button\" ng-click=\"cancel()\">Cancel</button>\n" +
    "<button class=\"btn btn-primary\" type=\"button\" ng-click=\"save()\">Save</button>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/modals/confirm.html',
    "<div class=\"modal-resource-action\">\n" +
    "<div class=\"modal-header\">\n" +
    "<button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\" aria-label=\"Close\" ng-click=\"cancel()\">\n" +
    "<span class=\"pficon pficon-close\"></span>\n" +
    "</button>\n" +
    "<h1 class=\"modal-title\">{{title}}</h1>\n" +
    "</div>\n" +
    "<div class=\"modal-body\">\n" +
    "<p ng-if=\"details\">{{details}}</p>\n" +
    "<p ng-if=\"detailsMarkup\" ng-bind-html=\"detailsMarkup\"></p>\n" +
    "<alerts ng-if=\"alerts\" alerts=\"alerts\" hide-close-button=\"true\"></alerts>\n" +
    "</div>\n" +
    "<div class=\"modal-footer\">\n" +
    "<button class=\"btn btn-default\" type=\"button\" ng-click=\"cancel()\">{{cancelButtonText}}</button>\n" +
    "<button class=\"btn\" ng-class=\"okButtonClass\" type=\"button\" ng-click=\"confirm()\">{{okButtonText}}</button>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/modals/confirmScale.html',
    "<div class=\"modal-resource-action\">\n" +
    "<div class=\"modal-header\">\n" +
    "<button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\" aria-label=\"Close\" ng-click=\"cancel()\">\n" +
    "<span class=\"pficon pficon-close\"></span>\n" +
    "</button>\n" +
    "<h1 class=\"modal-title\">Confirm Scale Down</h1>\n" +
    "</div>\n" +
    "<div class=\"modal-body\">\n" +
    "<p>Scale down {{type}} <strong>{{resource | displayName}}</strong>?</p>\n" +
    "<p>\n" +
    "Are you sure you want to scale <strong>{{resource | displayName}}</strong> to 0 replicas? This will stop all pods for the {{type}}.\n" +
    "</p>\n" +
    "</div>\n" +
    "<div class=\"modal-footer\">\n" +
    "<button class=\"btn btn-default\" type=\"button\" ng-click=\"cancel()\">Cancel</button>\n" +
    "<button class=\"btn btn-danger\" type=\"button\" ng-click=\"confirmScale()\">Scale Down</button>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/modals/create-secret.html',
    "<div class=\"create-secret-modal\">\n" +
    "<div class=\"modal-header\">\n" +
    "<button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\" aria-label=\"Close\" ng-click=\"onCancel()\">\n" +
    "<span class=\"pficon pficon-close\"></span>\n" +
    "</button>\n" +
    "<h1 class=\"modal-title\">\n" +
    "Create {{type | capitalize}} Secret\n" +
    "<span ng-switch=\"type\">\n" +
    "<a ng-switch-when=\"webhook\" ng-href=\"{{'webhook_secrets' | helpLink}}\" target=\"_blank\"><span class=\"learn-more-inline\">Learn More&nbsp;<i class=\"fa fa-external-link\" aria-hidden=\"true\"></i></span></a>\n" +
    "<a ng-switch-when=\"source\" ng-href=\"{{'git_secret' | helpLink}}\" target=\"_blank\"><span class=\"learn-more-inline\">Learn More&nbsp;<i class=\"fa fa-external-link\" aria-hidden=\"true\"></i></span></a>\n" +
    "<a ng-switch-when=\"image\" ng-href=\"{{'pull_secret' | helpLink}}\" target=\"_blank\"><span class=\"learn-more-inline\">Learn More&nbsp;<i class=\"fa fa-external-link\" aria-hidden=\"true\"></i></span></a>\n" +
    "<a ng-switch-default ng-href=\"{{'source_secrets' | helpLink}}\" target=\"_blank\"><span class=\"learn-more-inline\">Learn More&nbsp;<i class=\"fa fa-external-link\" aria-hidden=\"true\"></i></span></a>\n" +
    "</span>\n" +
    "</h1>\n" +
    "</div>\n" +
    "<div class=\"modal-body contains-form\">\n" +
    "<create-secret type=\"type\" service-account-to-link=\"serviceAccountToLink\" namespace=\"namespace\" on-create=\"onCreate(newSecret)\" on-cancel=\"onCancel()\"></create-secret>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/modals/debug-terminal.html',
    "<div class=\"modal-debug-terminal\">\n" +
    "<div class=\"modal-header\">\n" +
    "<button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\" aria-label=\"Close\" ng-click=\"close()\">\n" +
    "<span class=\"pficon pficon-close\"></span>\n" +
    "</button>\n" +
    "<h1 class=\"modal-title\">Debug Container {{container.name}}</h1>\n" +
    "<small class=\"text-muted\">\n" +
    "{{debugPod.metadata.name}} &mdash;\n" +
    "<status-icon status=\"debugPod | podStatus\"></status-icon>\n" +
    "{{debugPod | podStatus | humanizePodStatus}}\n" +
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
    "<div class=\"text-muted\">\n" +
    "<p>This temporary pod has a modified entrypoint command to debug a failing container. The pod will be available for one hour and will be deleted when the terminal window is closed.</p>\n" +
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
    "<button class=\"btn btn-default\" type=\"button\" ng-click=\"close()\">Close</button>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/modals/delete-resource.html',
    "<div class=\"modal-resource-action\">\n" +
    "\n" +
    "<form>\n" +
    "<div class=\"modal-header\">\n" +
    "<button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\" aria-label=\"Close\" ng-click=\"cancel()\">\n" +
    "<span class=\"pficon pficon-close\"></span>\n" +
    "</button>\n" +
    "<h1 class=\"modal-title\">Confirm Delete</h1>\n" +
    "</div>\n" +
    "<div class=\"modal-body\">\n" +
    "<p>Are you sure you want to delete the {{typeDisplayName || (kind | humanizeKind)}} '<strong>{{displayName ? displayName : resourceName}}</strong>'?</p>\n" +
    "<p>\n" +
    "<span ng-if=\"kind === 'DeploymentConfig'\">\n" +
    "This will delete the deployment config, all rollout history, and any running pods.\n" +
    "</span>\n" +
    "<span ng-if=\"kind === 'Deployment'\">\n" +
    "This will delete the deployment, all rollout history, and any running pods.\n" +
    "</span>\n" +
    "<span ng-if=\"kind === 'ReplicationController' || kind === 'ReplicaSet' || kind === 'StatefulSet'\">\n" +
    "This will delete the {{typeDisplayName || (kind | humanizeKind)}} and any running pods.\n" +
    "</span>\n" +
    "<span ng-if=\"kind === 'ServiceInstance'\">\n" +
    "{{displayName ? displayName : resourceName}} and its data will no longer be available to your applications.\n" +
    "</span>\n" +
    "<span ng-if=\"isProject\">\n" +
    "This will <strong>delete all resources</strong> associated with the project {{displayName ? displayName : resourceName}}.\n" +
    "</span>\n" +
    "<strong>It cannot be undone.</strong> Make sure this is something you really want to do!\n" +
    "</p>\n" +
    "<div ng-show=\"typeNameToConfirm\">\n" +
    "<p>Type the name of the {{typeDisplayName || (kind | humanizeKind)}} to confirm.</p>\n" +
    "<p>\n" +
    "<label class=\"sr-only\" for=\"resource-to-delete\">{{typeDisplayName || (kind | humanizeKind)}} to delete</label>\n" +
    "<input ng-model=\"confirmName\" id=\"resource-to-delete\" type=\"text\" class=\"form-control input-lg\" autocorrect=\"off\" autocapitalize=\"none\" spellcheck=\"false\" autofocus>\n" +
    "</p>\n" +
    "</div>\n" +
    "\n" +
    "<div ng-if=\"kind === 'Pod'\" class=\"checkbox\">\n" +
    "<label>\n" +
    "<input type=\"checkbox\" ng-model=\"options.deleteImmediately\">\n" +
    "Delete pod immediately without waiting for the processes to terminate gracefully\n" +
    "</label>\n" +
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
    "<div class=\"checkbox\">\n" +
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
    "</div>\n" +
    "<div class=\"modal-footer\">\n" +
    "<button class=\"btn btn-default\" type=\"button\" ng-click=\"cancel();\">Cancel</button>\n" +
    "<button ng-disabled=\"typeNameToConfirm && confirmName !== resourceName && confirmName !== displayName\" class=\"btn btn-danger\" type=\"submit\" ng-click=\"delete();\">Delete</button>\n" +
    "</div>\n" +
    "</form>\n" +
    "</div>"
  );


  $templateCache.put('views/modals/jenkinsfile-examples-modal.html',
    "<div class=\"jenkinsfile-examples-modal\">\n" +
    "<div class=\"modal-header\">\n" +
    "<button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\" aria-label=\"Close\" ng-click=\"close()\">\n" +
    "<span class=\"pficon pficon-close\"></span>\n" +
    "</button>\n" +
    "<h1 class=\"modal-title\">Jenkinsfile Examples</h1>\n" +
    "</div>\n" +
    "<div class=\"modal-body\">\n" +
    "<ng-include src=\"'views/edit/jenkinsfile-examples.html'\"></ng-include>\n" +
    "</div>\n" +
    "<div class=\"modal-footer\">\n" +
    "<button class=\"btn btn-default\" type=\"button\" ng-click=\"close()\">Close</button>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/modals/logout.html',
    "<div class=\"modal-resource-action inactivity-modal\">\n" +
    "<div class=\"modal-header\">\n" +
    "<button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\" aria-label=\"Close\" ng-click=\"cancel()\">\n" +
    "<span class=\"pficon pficon-close\"></span>\n" +
    "</button>\n" +
    "<h1 class=\"modal-title\">Session Timeout Warning</h1>\n" +
    "</div>\n" +
    "<form>\n" +
    "<div class=\"modal-body\">\n" +
    "<p>Your session is about to expire due to inactivity.</p>\n" +
    "<p>You will be logged out in <strong><time-remaining-from-now end-timestamp=\"endTimestamp\" countdown-duration=\"\"></time-remaining-from-now></strong> seconds.</p>\n" +
    "</div>\n" +
    "<div class=\"modal-footer\">\n" +
    "<button class=\"btn btn-default\" type=\"submit\" ng-click=\"logout();\">Log Out</button>\n" +
    "<button class=\"btn btn-primary\" type=\"button\" ng-click=\"cancel();\">Continue Session</button>\n" +
    "</div>\n" +
    "</form>\n" +
    "</div>"
  );


  $templateCache.put('views/modals/process-or-save-template.html',
    "<div class=\"modal-resource-action\">\n" +
    "<div class=\"modal-header\">\n" +
    "<button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\" aria-label=\"Close\" ng-click=\"cancel()\">\n" +
    "<span class=\"pficon pficon-close\"></span>\n" +
    "</button>\n" +
    "<h1 class=\"modal-title\">{{updateTemplate ? \"Update\" : \"Add\"}} Template</h1>\n" +
    "</div>\n" +
    "<div class=\"modal-body\">\n" +
    "<p>What would you like to do?</p>\n" +
    "<div class=\"form-group\">\n" +
    "<div class=\"checkbox\">\n" +
    "<label>\n" +
    "<input type=\"checkbox\" ng-model=\"templateOptions.process\" aria-descirbedby=\"process-template-help\">\n" +
    "<strong>Process the template</strong>\n" +
    "</label>\n" +
    "<div id=\"process-template-help\" class=\"help-block\">\n" +
    "Create the objects defined in the template. You will have an opportunity to fill in template parameters.\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"form-group\">\n" +
    "<div class=\"checkbox\">\n" +
    "<label>\n" +
    "<input type=\"checkbox\" ng-model=\"templateOptions.add\" aria-descirbedby=\"save-template-help\">\n" +
    "<strong>{{updateTemplate ? \"Update\" : \"Save\"}} template</strong>\n" +
    "</label>\n" +
    "<div id=\"save-template-help\" class=\"help-block\">\n" +
    "{{updateTemplate ? \"This will overwrite the current version of the template.\" : \"Save the template to the project. This will make the template available to anyone who can view the project.\"}}\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"modal-footer\">\n" +
    "<button class=\"btn btn-default\" type=\"button\" ng-click=\"cancel();\">Cancel</button>\n" +
    "<button class=\"btn btn-primary\" type=\"button\" ng-click=\"continue();\" ng-disabled=\"!templateOptions.process && !templateOptions.add\">Continue</button>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/modals/set-home-page-modal.html',
    "<div class=\"set-home-page\">\n" +
    "<div class=\"modal-header\">\n" +
    "<button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\" aria-label=\"Close\" ng-click=\"cancel()\">\n" +
    "<span class=\"pficon pficon-close\"></span>\n" +
    "</button>\n" +
    "<h1 class=\"modal-title\">Set Home Page</h1>\n" +
    "</div>\n" +
    "<div class=\"modal-body\">\n" +
    "<p>\n" +
    "Note: This setting is browser-specific and will not be maintained across browsers.\n" +
    "</p>\n" +
    "<form name=\"homePageForm\">\n" +
    "<fieldset ng-disabled=\"loading\">\n" +
    "<div class=\"radio\">\n" +
    "<label>\n" +
    "<input type=\"radio\" ng-model=\"homePagePreference\" value=\"catalog-home\">\n" +
    "Catalog Home (Default)\n" +
    "</label>\n" +
    "</div>\n" +
    "<div class=\"radio\">\n" +
    "<label>\n" +
    "<input type=\"radio\" ng-model=\"homePagePreference\" value=\"project-list\">\n" +
    "My Projects List\n" +
    "</label>\n" +
    "</div>\n" +
    "<div class=\"radio\" ng-show=\"availableProjects.length >= 1\">\n" +
    "<label>\n" +
    "<input type=\"radio\" ng-model=\"homePagePreference\" value=\"project-overview\">\n" +
    "Overview Page for{{availableProjects.length === 1 ? ' ' + (selectedProject | displayName) : ':'}}\n" +
    "</label>\n" +
    "<div class=\"select-project-container\" ng-if=\"availableProjects.length > 1\">\n" +
    "<select-project is-required=\"homePagePreference === 'project-overview'\" skip-can-add-validation=\"true\" on-project-selected=\"onProjectSelected\" on-open=\"onOpen\" available-projects=\"availableProjects\" selected-project=\"selectedProject\" hide-create-project=\"true\" hide-label=\"true\">\n" +
    "</select-project>\n" +
    "</div>\n" +
    "</div>\n" +
    "</fieldset>\n" +
    "</form>\n" +
    "</div>\n" +
    "<div class=\"modal-footer\">\n" +
    "<button class=\"btn btn-default\" type=\"button\" ng-click=\"cancel()\">Cancel</button>\n" +
    "<button class=\"btn btn-primary\" type=\"button\" ng-disabled=\"homePageForm.$invalid || homePageForm.$pristine\" ng-click=\"setHomePage()\">Save</button>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/monitoring.html',
    "<div class=\"monitoring-page\" ng-class=\"{'show-sidebar-right': renderOptions.showEventsSidebar}\">\n" +
    "<div class=\"middle\" ng-class=\"{ 'sidebar-open': !renderOptions.collapseEventsSidebar }\">\n" +
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
    "<input type=\"search\" placeholder=\"Filter by name\" class=\"form-control\" id=\"name-filter\" ng-model=\"filters.text\" autocorrect=\"off\" autocapitalize=\"none\" spellcheck=\"false\">\n" +
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
    "<div ng-if=\"kindSelector.selected.kind === 'All' || kindSelector.selected.kind === 'Pods'\">\n" +
    "<h2>Pods</h2>\n" +
    "<div class=\"list-pf\" ng-class=\"{'list-pf-empty': !(filteredPods | size)}\">\n" +
    "<div class=\"list-pf-item\" ng-if=\"!(filteredPods | size)\">\n" +
    "<div class=\"list-pf-container\">\n" +
    "<ellipsis-pulser color=\"dark\" size=\"sm\" msg=\"Loading pods\" ng-if=\"!podsLoaded\"></ellipsis-pulser>\n" +
    "<em>\n" +
    "<div ng-if=\"(pods | size) > 0\">The current filters are hiding all pods.</div>\n" +
    "<span ng-if=\"podsLoaded && (pods | size) === 0\">There are no pods in this project.</span>\n" +
    "</em>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"list-pf-item\" ng-repeat=\"pod in filteredPods track by (pod | uid)\" ng-class=\"{'active': expanded.pods[pod.metadata.name]}\">\n" +
    "<div class=\"list-pf-container list-pf-container-thin\" ng-click=\"toggleItem($event, this, pod)\">\n" +
    "<div class=\"list-pf-chevron\">\n" +
    "<a href=\"\" ng-click=\"toggleItem($event, this, pod, true)\" role=\"button\" class=\"toggle-expand-link\">\n" +
    "<span ng-if=\"expanded.pods[pod.metadata.name]\">\n" +
    "<span class=\"fa fa-angle-down\" aria-hidden=\"true\"></span>\n" +
    "<span class=\"sr-only\">Collapse</span>\n" +
    "</span>\n" +
    "<span ng-if=\"!expanded.pods[pod.metadata.name]\">\n" +
    "<span class=\"fa fa-angle-right\" aria-hidden=\"true\"></span>\n" +
    "<span class=\"sr-only\">Expand</span>\n" +
    "</span>\n" +
    "</a>\n" +
    "</div>\n" +
    "<div class=\"list-pf-content list-pf-content-flex\">\n" +
    "<div class=\"list-pf-content-wrapper\">\n" +
    "<div class=\"list-pf-main-content\">\n" +
    "<div class=\"list-pf-title\">\n" +
    "<h3>\n" +
    "<a ng-href=\"{{pod | navigateResourceURL}}\"><span ng-bind-html=\"pod.metadata.name | highlightKeywords : filterKeywords\"></span></a>\n" +
    "<small>created <span am-time-ago=\"pod.metadata.creationTimestamp\"></span></small>\n" +
    "</h3>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"list-pf-additional-content\">\n" +
    "<div class=\"list-pf-additional-content-item\">\n" +
    "<status-icon status=\"pod | podStatus\" disable-animation></status-icon>\n" +
    "{{pod | podStatus | humanizeReason}}\n" +
    "<small ng-if=\"(pod | podStatus) === 'Running'\" class=\"text-muted\">\n" +
    "&ndash; {{pod | numContainersReady}}/{{pod.spec.containers.length}} ready\n" +
    "</small>\n" +
    "</div>\n" +
    "<div class=\"list-pf-additional-content-item\">\n" +
    "<image-names pod-template=\"pod\" pods=\"[pod]\"></image-names>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"list-pf-expansion collapse\" ng-if=\"expanded.pods[pod.metadata.name]\" ng-class=\"{'in': expanded.pods[pod.metadata.name]}\">\n" +
    "<div class=\"list-pf-container\">\n" +
    "<log-viewer ng-if=\"podsLogVersion | canI : 'get'\" object=\"pod\" context=\"projectContext\" options=\"logOptions.pods[pod.metadata.name]\" empty=\"logEmpty.pods[pod.metadata.name]\" run=\"logCanRun.pods[pod.metadata.name]\" fixed-height=\"250\" full-log-url=\"(pod | navigateResourceURL) + '?view=chromeless'\" ng-class=\"{'log-viewer-select': pod.spec.containers.length > 1}\">\n" +
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
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"kindSelector.selected.kind === 'All' || kindSelector.selected.kind === 'ReplicationControllers'\">\n" +
    "<h2>Deployments</h2>\n" +
    "<div class=\"list-pf\" ng-class=\"{'list-pf-empty': !(filteredReplicationControllers | size) && !(filteredReplicaSets | size)}\">\n" +
    "<div class=\"list-pf-item\" ng-if=\"!(filteredReplicationControllers | size) && !(filteredReplicaSets | size)\">\n" +
    "<div class=\"list-pf-container\">\n" +
    "<ellipsis-pulser color=\"dark\" size=\"sm\" msg=\"Loading deployments\" ng-if=\"!replicationControllersLoaded\"></ellipsis-pulser>\n" +
    "<em>\n" +
    "<div ng-if=\"(replicationControllers | size) > 0 || (replicaSets | size) > 0\">The current filters are hiding all deployments.</div>\n" +
    "<span ng-if=\"replicationControllersLoaded && !(replicationControllers | size) && replicaSetsLoaded && !(replicaSets | size)\">There are no deployments in this project.</span>\n" +
    "</em>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"list-pf-item\" ng-repeat=\"replicationController in filteredReplicationControllers track by (replicationController | uid)\" ng-class=\"{'active': expanded.replicationControllers[replicationController.metadata.name]}\">\n" +
    "<div class=\"list-pf-container list-pf-container-thin\" ng-click=\"toggleItem($event, this, replicationController)\">\n" +
    "<div class=\"list-pf-chevron\">\n" +
    "<a href=\"\" role=\"button\" ng-click=\"toggleItem($event, this, replicationController, true)\" class=\"toggle-expand-link\">\n" +
    "<span ng-if=\"expanded.replicationControllers[replicationController.metadata.name]\">\n" +
    "<span class=\"fa fa-angle-down\" aria-hidden=\"true\"></span>\n" +
    "<span class=\"sr-only\">Collapse</span>\n" +
    "</span>\n" +
    "<span ng-if=\"!expanded.replicationControllers[replicationController.metadata.name]\">\n" +
    "<span class=\"fa fa-angle-right\" aria-hidden=\"true\"></span>\n" +
    "<span class=\"sr-only\">Expand</span>\n" +
    "</span>\n" +
    "</a>\n" +
    "</div>\n" +
    "<div class=\"list-pf-content list-pf-content-flex\">\n" +
    "<div class=\"list-pf-content-wrapper\">\n" +
    "<div class=\"list-pf-main-content\">\n" +
    "<div class=\"list-pf-title\">\n" +
    "<h3>\n" +
    "<a ng-href=\"{{replicationController | navigateResourceURL}}\"><span ng-bind-html=\"replicationController.metadata.name | highlightKeywords : filterKeywords\"></span></a>\n" +
    "<small>created <span am-time-ago=\"replicationController.metadata.creationTimestamp\"></span></small>\n" +
    "</h3>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"list-pf-additional-content\">\n" +
    "<div class=\"list-pf-additional-content-item\">\n" +
    "<div class=\"pods\">\n" +
    "<a ng-href=\"{{replicationController | donutURL : podsByOwnerUID[replicationController.metadata.uid]}}\" class=\"mini-donut-link\" ng-class=\"{ 'disabled-link': !(podsByOwnerUID[replicationController.metadata.uid] | size) }\">\n" +
    "<pod-donut pods=\"podsByOwnerUID[replicationController.metadata.uid]\" mini=\"true\"></pod-donut>\n" +
    "</a>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"list-pf-additional-content-item\">\n" +
    "<image-names pod-template=\"replicationController.spec.template\" pods=\"podsByOwnerUID[replicationController.metadata.uid]\">\n" +
    "</image-names>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"list-pf-expansion collapse\" ng-if=\"expanded.replicationControllers[replicationController.metadata.name]\" ng-class=\"{'in': expanded.replicationControllers[replicationController.metadata.name]}\">\n" +
    "<div class=\"list-pf-container\">\n" +
    "\n" +
    "<log-viewer ng-if=\"deploymentConfigsLogVersion | canI : 'get'\" object=\"replicationController\" context=\"projectContext\" options=\"logOptions.replicationControllers[replicationController.metadata.name]\" empty=\"logEmpty.replicationControllers[replicationController.metadata.name]\" run=\"logCanRun.replicationControllers[replicationController.metadata.name]\" fixed-height=\"250\" full-log-url=\"(replicationController | navigateResourceURL) + '?view=chromeless'\">\n" +
    "</log-viewer>\n" +
    "<div class=\"mar-top-lg\" ng-if=\"metricsAvailable\">\n" +
    "<deployment-metrics pods=\"podsByOwnerUID[replicationController.metadata.uid]\" containers=\"replicationController.spec.template.spec.containers\" alerts=\"alerts\">\n" +
    "</deployment-metrics>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"list-pf-item\" ng-repeat=\"replicaSet in filteredReplicaSets track by (replicaSet | uid)\" ng-class=\"{'active': expanded.replicaSets[replicaSet.metadata.name]}\">\n" +
    "<div class=\"list-pf-container list-pf-container-thin\" ng-click=\"toggleItem($event, this, replicaSet)\">\n" +
    "<div class=\"list-pf-chevron\">\n" +
    "<a href=\"\" ng-click=\"toggleItem($event, this, replicaSet, true)\" role=\"button\" class=\"toggle-expand-link\">\n" +
    "<span ng-if=\"expanded.replicaSets[replicaSet.metadata.name]\">\n" +
    "<span class=\"fa fa-angle-down\" aria-hidden=\"true\"></span>\n" +
    "<span class=\"sr-only\">Collapse</span>\n" +
    "</span>\n" +
    "<span ng-if=\"!expanded.replicaSets[replicaSet.metadata.name]\">\n" +
    "<span class=\"fa fa-angle-right\" aria-hidden=\"true\"></span>\n" +
    "<span class=\"sr-only\">Expand</span>\n" +
    "</span>\n" +
    "</a>\n" +
    "</div>\n" +
    "<div class=\"list-pf-content list-pf-content-flex\">\n" +
    "<div class=\"list-pf-content-wrapper\">\n" +
    "<div class=\"list-pf-main-content\">\n" +
    "<div class=\"list-pf-title\">\n" +
    "<h3>\n" +
    "<a ng-href=\"{{replicaSet | navigateResourceURL}}\"><span ng-bind-html=\"replicaSet.metadata.name | highlightKeywords : filterKeywords\"></span></a>\n" +
    "<small>created <span am-time-ago=\"replicaSet.metadata.creationTimestamp\"></span></small>\n" +
    "</h3>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"list-pf-additional-content\">\n" +
    "<div class=\"list-pf-additional-content-item\">\n" +
    "<div class=\"pods\">\n" +
    "<a ng-href=\"{{replicaSet | donutURL : podsByOwnerUID[replicaSet.metadata.uid]}}\" class=\"mini-donut-link\" ng-class=\"{ 'disabled-link': !(podsByOwnerUID[replicaSet.metadata.uid] | size) }\">\n" +
    "<pod-donut pods=\"podsByOwnerUID[replicaSet.metadata.uid]\" mini=\"true\"></pod-donut>\n" +
    "</a>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"list-pf-additional-content-item\">\n" +
    "<image-names pod-template=\"replicaSet.spec.template\" pods=\"podsByOwnerUID[replicaSet.metadata.uid]\">\n" +
    "</image-names>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"list-pf-expansion collapse\" ng-if=\"expanded.replicationControllers[replicationController.metadata.name]\" ng-class=\"{'in': expanded.replicationControllers[replicationController.metadata.name]}\">\n" +
    "<div class=\"list-pf-container\">\n" +
    "\n" +
    "<log-viewer ng-if=\"deploymentConfigsLogVersion | canI : 'get'\" object=\"replicationController\" context=\"projectContext\" options=\"logOptions.replicationControllers[replicationController.metadata.name]\" empty=\"logEmpty.replicationControllers[replicationController.metadata.name]\" run=\"logCanRun.replicationControllers[replicationController.metadata.name]\" fixed-height=\"250\" full-log-url=\"(replicationController | navigateResourceURL) + '?view=chromeless'\">\n" +
    "</log-viewer>\n" +
    "<div class=\"mar-top-lg\" ng-if=\"metricsAvailable\">\n" +
    "<deployment-metrics pods=\"podsByOwnerUID[replicationController.metadata.uid]\" containers=\"replicationController.spec.template.spec.containers\" alerts=\"alerts\">\n" +
    "</deployment-metrics>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"list-pf-expansion collapse\" ng-if=\"expanded.replicaSets[replicaSet.metadata.name]\" ng-class=\"{'in': expanded.replicaSets[replicaSet.metadata.name]}\">\n" +
    "<div class=\"list-pf-container\">\n" +
    "Logs are not available for replica sets.\n" +
    "<span ng-if=\"podsByOwnerUID[replicaSet.metadata.uid] | size\">\n" +
    "To see application logs, view the logs for one of the replica set's\n" +
    "<a ng-href=\"{{replicaSet | donutURL : podsByOwnerUID[replicaSet.metadata.uid]}}\">pods</a>.\n" +
    "</span>\n" +
    "<div class=\"mar-top-lg\" ng-if=\"metricsAvailable\">\n" +
    "<deployment-metrics pods=\"podsByOwnerUID[replicaSet.metadata.uid]\" containers=\"replicaSet.spec.template.spec.containers\" alerts=\"alerts\">\n" +
    "</deployment-metrics>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"kindSelector.selected.kind === 'All' || kindSelector.selected.kind === 'StatefulSets'\">\n" +
    "<h2>Stateful Sets</h2>\n" +
    "<div class=\"list-pf\" ng-class=\"{'list-pf-empty': !(filteredStatefulSets | size)}\">\n" +
    "<div class=\"list-pf-item\" ng-if=\"!(filteredStatefulSets | size)\">\n" +
    "<div class=\"list-pf-container\">\n" +
    "<ellipsis-pulser color=\"dark\" size=\"sm\" msg=\"Loading stateful sets\" ng-if=\"!statefulSetsLoaded\"></ellipsis-pulser>\n" +
    "<em>\n" +
    "<div ng-if=\"(statefulSets | size) > 0\">The current filters are hiding all stateful sets.</div>\n" +
    "<span ng-if=\"statefulSetsLoaded && (statefulSets | size) === 0\">There are no stateful sets in this project.</span>\n" +
    "</em>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"list-pf-item\" ng-repeat=\"set in filteredStatefulSets track by (set | uid)\" ng-class=\"{'active': expanded.statefulSets[set.metadata.name]}\">\n" +
    "<div class=\"list-pf-container list-pf-container-thin\" ng-click=\"toggleItem($event, this, set)\">\n" +
    "<div class=\"list-pf-chevron\">\n" +
    "<a href=\"\" ng-click=\"toggleItem($event, this, set, true)\" role=\"button\" class=\"toggle-expand-link\">\n" +
    "<span ng-if=\"expanded.statefulSets[set.metadata.name]\">\n" +
    "<span class=\"fa fa-angle-down\" aria-hidden=\"true\"></span>\n" +
    "<span class=\"sr-only\">Collapse</span>\n" +
    "</span>\n" +
    "<span ng-if=\"!expanded.statefulSets[set.metadata.name]\">\n" +
    "<span class=\"fa fa-angle-right\" aria-hidden=\"true\"></span>\n" +
    "<span class=\"sr-only\">Expand</span>\n" +
    "</span>\n" +
    "</a>\n" +
    "</div>\n" +
    "<div class=\"list-pf-content list-pf-content-flex\">\n" +
    "<div class=\"list-pf-content-wrapper\">\n" +
    "<div class=\"list-pf-main-content\">\n" +
    "<div class=\"list-pf-title\">\n" +
    "<h3>\n" +
    "<a ng-href=\"{{set | navigateResourceURL}}\"><span ng-bind-html=\"set.metadata.name | highlightKeywords : filterKeywords\"></span></a>\n" +
    "<small>created <span am-time-ago=\"set.metadata.creationTimestamp\"></span></small>\n" +
    "</h3>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"list-pf-additional-content\">\n" +
    "<div class=\"list-pf-additional-content-item\">\n" +
    "<div class=\"pods\">\n" +
    "<a ng-href=\"{{set | donutURL : podsByOwnerUID[set.metadata.uid]}}\" class=\"mini-donut-link\" ng-class=\"{ 'disabled-link': !(podsByOwnerUID[set.metadata.uid] | size) }\">\n" +
    "<pod-donut pods=\"podsByOwnerUID[set.metadata.uid]\" mini=\"true\"></pod-donut>\n" +
    "</a>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"list-pf-additional-content-item\">\n" +
    "<image-names pod-template=\"set.spec.template\" pods=\"podsByOwnerUID[set.metadata.uid]\"></image-names>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"list-pf-expansion collapse\" ng-if=\"expanded.statefulSets[set.metadata.name]\" ng-class=\"{'in': expanded.statefulSets[set.metadata.name]}\">\n" +
    "<div class=\"list-pf-container\">\n" +
    "Logs are not available for stateful sets.\n" +
    "<span ng-if=\"podsByOwnerUID[set.metadata.uid] | size\">\n" +
    "To see application logs, view the logs for one of the stateful sets's\n" +
    "<a ng-href=\"{{set | donutURL : podsByOwnerUID[set.metadata.uid]}}\">pods</a>.\n" +
    "</span>\n" +
    "<div class=\"mar-top-lg\" ng-if=\"metricsAvailable\">\n" +
    "<deployment-metrics pods=\"podsByOwnerUID[set.metadata.uid]\" containers=\"set.spec.template.spec.containers\" alerts=\"alerts\">\n" +
    "</deployment-metrics>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"kindSelector.selected.kind === 'All' || kindSelector.selected.kind === 'Builds'\" class=\"mar-bottom-xl\">\n" +
    "<h2>Builds</h2>\n" +
    "<div class=\"list-pf\" ng-class=\"{'list-pf-empty': !(filteredBuilds | size)}\">\n" +
    "<div class=\"list-pf-item\" ng-if=\"!(filteredBuilds | size)\">\n" +
    "<div class=\"list-pf-container\">\n" +
    "<ellipsis-pulser color=\"dark\" size=\"sm\" msg=\"Loading builds\" ng-if=\"!buildsLoaded\"></ellipsis-pulser>\n" +
    "<em>\n" +
    "<div ng-if=\"(builds | size) > 0\">The current filters are hiding all builds.</div>\n" +
    "<span ng-if=\"buildsLoaded && (builds | size) === 0\">There are no builds in this project.</span>\n" +
    "</em>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"list-pf-item\" ng-repeat=\"build in filteredBuilds track by (build | uid)\" ng-class=\"{'active': expanded.builds[build.metadata.name]}\">\n" +
    "<div class=\"list-pf-container list-pf-container-thin\" ng-click=\"toggleItem($event, this, build)\">\n" +
    "<div class=\"list-pf-chevron\">\n" +
    "<a href=\"\" ng-click=\"toggleItem($event, this, build, true)\" role=\"button\" class=\"toggle-expand-link\">\n" +
    "<span ng-if=\"expanded.builds[build.metadata.name]\">\n" +
    "<span class=\"fa fa-angle-down\" aria-hidden=\"true\"></span>\n" +
    "<span class=\"sr-only\">Collapse</span>\n" +
    "</span>\n" +
    "<span ng-if=\"!expanded.builds[build.metadata.name]\">\n" +
    "<span class=\"fa fa-angle-right\" aria-hidden=\"true\"></span>\n" +
    "<span class=\"sr-only\">Expand</span>\n" +
    "</span>\n" +
    "</a>\n" +
    "</div>\n" +
    "<div class=\"list-pf-content list-pf-content-flex\">\n" +
    "<div class=\"list-pf-content-wrapper\">\n" +
    "<div class=\"list-pf-main-content\">\n" +
    "<div class=\"list-pf-title\">\n" +
    "<h3>\n" +
    "<a ng-href=\"{{build | navigateResourceURL}}\"><span ng-bind-html=\"build.metadata.name | highlightKeywords : filterKeywords\"></span></a>\n" +
    "<small>created <span am-time-ago=\"build.metadata.creationTimestamp\"></span></small>\n" +
    "</h3>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"list-pf-additional-content\">\n" +
    "<div class=\"list-pf-additional-content-item\">\n" +
    "<build-status build=\"build\"></build-status>\n" +
    "</div>\n" +
    "<div class=\"list-pf-additional-content-item\">\n" +
    "<div class=\"text-prepended-icon word-break\" ng-if=\"build.spec.source.type || build.spec.revision.git.commit || build.spec.source.git.uri\">\n" +
    "<span class=\"fa fa-code\" aria-hidden=\"true\"></span>\n" +
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
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"list-pf-expansion collapse\" ng-if=\"expanded.builds[build.metadata.name]\" ng-class=\"{'in': expanded.builds[build.metadata.name]}\">\n" +
    "<div class=\"list-pf-container\">\n" +
    "\n" +
    "<log-viewer ng-if=\"buildsLogVersion | canI : 'get'\" object=\"build\" context=\"projectContext\" options=\"logOptions.builds[build.metadata.name]\" empty=\"logEmpty.builds[build.metadata.name]\" run=\"logCanRun.builds[build.metadata.name]\" fixed-height=\"250\" full-log-url=\"(build | navigateResourceURL) + '?view=chromeless'\">\n" +
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
    "<div ng-if=\"renderOptions.showEventsSidebar && !renderOptions.collapseEventsSidebar\" class=\"sidebar-right sidebar-pf sidebar-pf-right\">\n" +
    "<div class=\"right-section\">\n" +
    "<events-sidebar ng-if=\"projectContext\" project-context=\"projectContext\" collapsed=\"renderOptions.collapseEventsSidebar\"></events-sidebar>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/newfromtemplate.html',
    "<div class=\"middle surface-shaded\">\n" +
    "<div class=\"middle-content\">\n" +
    "<div class=\"container-fluid\">\n" +
    "<div class=\"row\">\n" +
    "<div class=\"col-md-12\">\n" +
    "<div ng-hide=\"template\" class=\"mar-top-lg\">\n" +
    "Loading...\n" +
    "</div>\n" +
    "<div ng-if=\"template\" class=\"row osc-form\">\n" +
    "<div class=\"col-md-2 icon hidden-sm hidden-xs\">\n" +
    "<custom-icon resource=\"template\" kind=\"template\"></custom-icon>\n" +
    "</div>\n" +
    "<div class=\"col-md-8\">\n" +
    "<osc-image-summary resource=\"template\"></osc-image-summary>\n" +
    "<div ng-if=\"templateImages.length\" class=\"images\">\n" +
    "<h2>Images</h2>\n" +
    "<ul class=\"list-unstyled\" ng-repeat=\"image in templateImages\">\n" +
    "<li>\n" +
    "<i class=\"pficon pficon-image\" aria-hidden=\"true\"></i>\n" +
    "<span class=\"name\">\n" +
    "{{image.name}}\n" +
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
    "</div>"
  );


  $templateCache.put('views/other-resources.html',
    "<div class=\"middle\">\n" +
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
    "<div class=\"row\">\n" +
    "<div class=\"col-md-12\">\n" +
    "<div ng-if=\"(resources | hashSize) == 0\">\n" +
    "<p ng-if=\"!kindSelector.selected\">\n" +
    "<em>Select a resource from the list above...</em>\n" +
    "</p>\n" +
    "<div ng-if=\"kindSelector.selected\" class=\"empty-state-message text-center\">\n" +
    "<div ng-if=\"!filterWithZeroResults\">\n" +
    "<h2>No {{resourceName}}.</h2>\n" +
    "<p>\n" +
    "No {{resourceName}} have been added to project {{projectName}}.\n" +
    "</p>\n" +
    "</div>\n" +
    "<div ng-if=\"filterWithZeroResults\">\n" +
    "<h2>The filter is hiding all {{resourceName}}. <button type=\"button\" class=\"btn btn-link inline-btn-link\" ng-click=\"clearFilter()\">Clear All Filters</button></h2>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<table ng-if=\"(resources | hashSize) > 0\" class=\"table table-bordered table-mobile table-layout-fixed\">\n" +
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
    "<tbody>\n" +
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
    "<ul uib-dropdown-menu class=\"dropdown-menu-right\" aria-labelledby=\"{{resource.metadata.name}}_actions\">\n" +
    "<li ng-if=\"selectedResource | canI : 'update'\">\n" +
    "<a ng-href=\"{{resource | editYamlURL : getReturnURL()}}\" role=\"button\">Edit YAML</a>\n" +
    "</li>\n" +
    "<li ng-if=\"selectedResource | canI : 'delete'\">\n" +
    "<delete-link kind=\"{{kindSelector.selected.kind}}\" group=\"{{kindSelector.selected.group}}\" resource-name=\"{{resource.metadata.name}}\" project-name=\"{{resource.metadata.namespace}}\" stay-on-current-page=\"true\" success=\"loadKind\">\n" +
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
    "</div>"
  );


  $templateCache.put('views/overview.html',
    "<div class=\"overview\">\n" +
    "<div class=\"middle\">\n" +
    "\n" +
    "<div ng-if=\"overview.showGetStarted\" class=\"container-fluid empty-state\">\n" +
    "<alerts alerts=\"overview.state.alerts\"></alerts>\n" +
    "\n" +
    "<div class=\"empty-state-message text-center\">\n" +
    "<div ng-if=\"project.metadata.name | canIAddToProject\">\n" +
    "<h2>Get started with your project.</h2>\n" +
    "<p>\n" +
    "Add content to your project from the catalog of web frameworks, databases, and other components. You may also deploy an existing image, create or replace resources from their YAML or JSON definitions, or select an item shared from another project.\n" +
    "</p>\n" +
    "<div class=\"empty-state-message-main-action\">\n" +
    "<button class=\"btn btn-primary btn-lg\" ng-click=\"browseCatalog()\">\n" +
    "Browse Catalog\n" +
    "</button>\n" +
    "</div>\n" +
    "<div class=\"empty-state-message-secondary-action\">\n" +
    "<button class=\"btn btn-default btn-sm\" ng-click=\"showOrderingPanel('deployImage')\">\n" +
    "Deploy Image\n" +
    "</button>\n" +
    "<button class=\"btn btn-default btn-sm\" ng-click=\"showOrderingPanel('fromFile')\">\n" +
    "Import YAML / JSON\n" +
    "</button>\n" +
    "<button class=\"btn btn-default btn-sm\" ng-click=\"showOrderingPanel('fromProject')\">\n" +
    "Select from Project\n" +
    "</button>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"!(project.metadata.name | canIAddToProject)\">\n" +
    "<h2>Welcome to project {{projectName}}.</h2>\n" +
    "<ng-include src=\"'views/_request-access.html'\"></ng-include>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"overview.showLoading\" class=\"container-fluid loading-message\">\n" +
    "Loading...\n" +
    "</div>\n" +
    "<div ng-if=\"!overview.showGetStarted && !overview.showLoading\">\n" +
    "<div class=\"middle-header\">\n" +
    "<div class=\"container-fluid toolbar-container\">\n" +
    "<div class=\"data-toolbar\" role=\"toolbar\" aria-label=\"Filter Toolbar\">\n" +
    "<div class=\"data-toolbar-filter\" role=\"group\">\n" +
    "<ui-select class=\"data-toolbar-dropdown\" ng-model=\"overview.filterBy\" search-enabled=\"false\" append-to-body=\"true\" ng-disabled=\"overview.disableFilter\">\n" +
    "<ui-select-match>{{$select.selected.label}}</ui-select-match>\n" +
    "<ui-select-choices repeat=\"option.id as option in overview.filterByOptions\">\n" +
    "{{option.label}}\n" +
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
    "<label for=\"name-filter\" class=\"sr-only\">Filter by name</label>\n" +
    "<input type=\"text\" class=\"form-control\" ng-model=\"overview.filterText\" placeholder=\"Filter by name\" autocorrect=\"off\" autocapitalize=\"none\" spellcheck=\"false\" ng-disabled=\"overview.disableFilter\">\n" +
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
    "<span class=\"data-toolbar-label\">List by</span>\n" +
    "<ui-select class=\"data-toolbar-dropdown\" ng-model=\"overview.viewBy\" search-enabled=\"false\">\n" +
    "<ui-select-match>{{$select.selected.label}}</ui-select-match>\n" +
    "<ui-select-choices repeat=\"option.id as option in overview.viewByOptions\">\n" +
    "{{option.label}}\n" +
    "</ui-select-choices>\n" +
    "</ui-select>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"overview.filterActive\" class=\"filter-status\">\n" +
    "<span ng-if=\"overview.viewBy !== 'pipeline'\">\n" +
    "Showing <strong>{{overview.filteredSize}}</strong> of <strong>{{overview.size}}</strong> items\n" +
    "</span>\n" +
    "<span ng-if=\"overview.viewBy === 'pipeline' && overview.pipelineBuildConfigs | hashSize\">\n" +
    "Showing <strong>{{overview.filteredPipelineBuildConfigs | hashSize}}</strong> of <strong>{{overview.pipelineBuildConfigs | hashSize}}</strong> pipelines\n" +
    "</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"middle-content\">\n" +
    "<div class=\"container-fluid\">\n" +
    "<alerts alerts=\"overview.state.alerts\"></alerts>\n" +
    "<div ng-if=\"overview.everythingFiltered && overview.viewBy !== 'pipeline'\">\n" +
    "<div class=\"empty-state-message text-center h2\">\n" +
    "The filter is hiding all resources.\n" +
    "<button type=\"button\" class=\"btn btn-link inline-btn-link\" ng-click=\"overview.clearFilter()\">Clear All Filters</button>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"!overview.everythingFiltered || overview.viewBy === 'pipeline'\">\n" +
    "<div ng-if=\"overview.viewBy === 'app'\" ng-repeat=\"app in overview.apps\">\n" +
    "<div ng-if=\"app\" class=\"app-heading\">\n" +
    "<h2>\n" +
    "<div class=\"component-label\">Application</div>\n" +
    "<span ng-bind-html=\"app | highlightKeywords : overview.state.filterKeywords\"></span>\n" +
    "</h2>\n" +
    "<div class=\"overview-routes\" ng-if=\"overview.routesToDisplayByApp[app] | size\">\n" +
    "<h3 class=\"overview-route\" ng-repeat=\"route in overview.routesToDisplayByApp[app] track by (route | uid)\">\n" +
    "<span ng-if=\"route | isWebRoute\">\n" +
    "<a ng-href=\"{{route | routeWebURL}}\" target=\"_blank\">\n" +
    "{{route | routeLabel}}\n" +
    "<i class=\"fa fa-external-link\" aria-hidden=\"true\"></i>\n" +
    "</a>\n" +
    "</span>\n" +
    "<span ng-if=\"!(route | isWebRoute)\">{{route | routeLabel}}</span>\n" +
    "</h3>\n" +
    "</div>\n" +
    "</div>\n" +
    "<h2 ng-if=\"!app\">\n" +
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
    "<overview-list-row ng-repeat=\"daemonSet in overview.filteredDaemonSetsByApp[app] track by (daemonSet | uid)\" api-object=\"daemonSet\" state=\"overview.state\">\n" +
    "</overview-list-row>\n" +
    "<overview-list-row ng-repeat=\"pod in overview.filteredMonopodsByApp[app] track by (pod | uid)\" api-object=\"pod\" state=\"overview.state\">\n" +
    "</overview-list-row>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"overview.viewBy === 'resource'\">\n" +
    "<div ng-if=\"overview.filteredDeploymentConfigs | hashSize\">\n" +
    "<h2>\n" +
    "<span ng-if=\"overview.deployments | hashSize\">\n" +
    "Deployment Configs\n" +
    "</span>\n" +
    "<span ng-if=\"!(overview.deployments | hashSize)\">\n" +
    "Deployments\n" +
    "</span>\n" +
    "</h2>\n" +
    "<div class=\"list-pf\">\n" +
    "<overview-list-row ng-repeat=\"deploymentConfig in overview.filteredDeploymentConfigs track by (deploymentConfig | uid)\" ng-init=\"dcName = deploymentConfig.metadata.name\" api-object=\"deploymentConfig\" current=\"overview.currentByDeploymentConfig[dcName]\" previous=\"overview.getPreviousReplicationController(deploymentConfig)\" state=\"overview.state\">\n" +
    "</overview-list-row>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"overview.filteredDeployments | hashSize\">\n" +
    "<h2>Deployments</h2>\n" +
    "<div class=\"list-pf\">\n" +
    "<overview-list-row ng-repeat=\"deployment in overview.filteredDeployments track by (deployment | uid)\" api-object=\"deployment\" current=\"overview.currentByDeploymentUID[deployment.metadata.uid]\" previous=\"overview.replicaSetsByDeploymentUID[deployment.metadata.uid][1]\" state=\"overview.state\">\n" +
    "</overview-list-row>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"overview.filteredReplicationControllers | hashSize\">\n" +
    "<h2>Replication Controllers</h2>\n" +
    "<div class=\"list-pf\">\n" +
    "<overview-list-row ng-repeat=\"replicationController in overview.filteredReplicationControllers track by (replicationController | uid)\" api-object=\"replicationController\" state=\"overview.state\">\n" +
    "</overview-list-row>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"overview.filteredReplicaSets | hashSize\">\n" +
    "<h2>Replica Sets</h2>\n" +
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
    "<div ng-if=\"overview.filteredDaemonSets | hashSize\">\n" +
    "<h2>Daemon Sets</h2>\n" +
    "<div class=\"list-pf\">\n" +
    "<overview-list-row ng-repeat=\"daemonSet in overview.filteredDaemonSets track by (daemonSet | uid)\" api-object=\"daemonSet\" state=\"overview.state\">\n" +
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
    "<p ng-if=\"(project.metadata.name | canIAddToProject) && overview.samplePipelineURL\">\n" +
    "<a ng-href=\"{{overview.samplePipelineURL}}\" class=\"btn btn-lg btn-primary\">\n" +
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
    "All pipelines are filtered.\n" +
    "<button type=\"button\" class=\"btn btn-link inline-btn-link\" ng-click=\"overview.clearFilter()\">Clear All Filters</button>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-repeat=\"pipeline in overview.filteredPipelineBuildConfigs track by (pipeline | uid)\">\n" +
    "<div ng-if=\"overview.buildConfigsInstantiateVersion | canI : 'create'\" class=\"pull-right\">\n" +
    "<button class=\"btn btn-default\" ng-if=\"overview.buildConfigsInstantiateVersion | canI : 'create'\" ng-click=\"overview.startBuild(pipeline)\">\n" +
    "Start Pipeline\n" +
    "</button>\n" +
    "</div>\n" +
    "<h2>\n" +
    "<div class=\"component-label\">Pipeline</div>\n" +
    "<span ng-bind-html=\"pipeline.metadata.name | highlightKeywords : overview.state.filterKeywords\"></span>\n" +
    "</h2>\n" +
    "<div ng-if=\"!(overview.recentPipelinesByBuildConfig[pipeline.metadata.name] | hashSize)\" class=\"mar-bottom-lg\">\n" +
    "No pipeline runs.\n" +
    "</div>\n" +
    "<div ng-if=\"overview.recentPipelinesByBuildConfig[pipeline.metadata.name] | hashSize\" class=\"build-pipelines\">\n" +
    "<div ng-repeat=\"pipeline in overview.recentPipelinesByBuildConfig[pipeline.metadata.name] track by (pipeline | uid)\" class=\"row build-pipeline-wrapper animate-repeat\">\n" +
    "<div class=\"col-sm-12\">\n" +
    "<build-pipeline build=\"pipeline\" build-config-name-on-expanded=\"true\" collapse-pending=\"true\"></build-pipeline>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"!overview.deploymentConfigsByPipeline[pipeline.metadata.name].length\" class=\"mar-bottom-lg\">\n" +
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
    "<overview-list-row ng-repeat=\"daemonSet in overview.daemonSets track by (daemonSet | uid)\" api-object=\"daemonSet\" state=\"overview.state\">\n" +
    "</overview-list-row>\n" +
    "<overview-list-row ng-repeat=\"pod in overview.monopods track by (pod | uid)\" api-object=\"pod\" state=\"overview.state\">\n" +
    "</overview-list-row>\n" +
    "</div>\n" +
    "</div>\n" +
    "\n" +
    "<div ng-if=\"(overview.filteredMobileClients | size) && AEROGEAR_MOBILE_ENABLED && !overview.hidePipelineOtherResources\">\n" +
    "<h2>Mobile Clients</h2>\n" +
    "<div class=\"list-pf\">\n" +
    "<mobile-client-row ng-repeat=\"mobileapp in overview.filteredMobileClients track by (mobileapp | uid)\" api-object=\"mobileapp\" state=\"overview.state\"></mobile-client-row>\n" +
    "</div>\n" +
    "</div>\n" +
    "\n" +
    "<div ng-if=\"(overview.filteredOfflineVirtualMachines | size) && !overview.hidePipelineOtherResources\">\n" +
    "<h2>Virtual Machines</h2>\n" +
    "<div class=\"list-pf\">\n" +
    "<virtual-machine-row ng-repeat=\"ovm in overview.filteredOfflineVirtualMachines track by (ovm | uid)\" api-object=\"ovm\" state=\"overview.state\"></virtual-machine-row>\n" +
    "</div>\n" +
    "</div>\n" +
    "\n" +
    "<div ng-if=\"overview.filteredServiceInstances.length && !overview.hidePipelineOtherResources\">\n" +
    "<h2>\n" +
    "Provisioned Services\n" +
    "</h2>\n" +
    "<div class=\"list-pf\">\n" +
    "<service-instance-row ng-repeat=\"serviceInstance in overview.filteredServiceInstances track by (serviceInstance | uid)\" api-object=\"serviceInstance\" bindings=\"overview.bindingsByInstanceRef[serviceInstance.metadata.name]\" state=\"overview.state\"></service-instance-row>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>"
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
    "<div class=\"component-label section-label hidden-xs\">Builds</div>\n" +
    "<div ng-repeat=\"buildConfig in overviewBuilds.buildConfigs track by (buildConfig | uid)\" class=\"row\">\n" +
    "<div class=\"col-sm-5 col-md-6\">\n" +
    "<h3 class=\"mar-top-xs\">\n" +
    "<a ng-href=\"{{buildConfig | navigateResourceURL}}\">{{buildConfig.metadata.name}}</a>\n" +
    "</h3>\n" +
    "</div>\n" +
    "<div class=\"col-sm-7 col-md-6 overview-builds-msg\">\n" +
    "<div ng-if=\"!(overviewBuilds.recentBuildsByBuildConfig[buildConfig.metadata.name] | hashSize)\">\n" +
    "No builds.\n" +
    "</div>\n" +
    "<div ng-repeat=\"build in overviewBuilds.recentBuildsByBuildConfig[buildConfig.metadata.name] track by (build | uid)\" class=\"mar-bottom-sm animate-repeat\">\n" +
    "<span ng-if=\"overviewBuilds.showLogs(build)\" class=\"small pull-right view-full-log\">\n" +
    "<a ng-if=\"!!['New', 'Pending'].indexOf(build.status.phase) && (build | buildLogURL)\" ng-href=\"{{build | buildLogURL}}\">View Full Log</a>\n" +
    "</span>\n" +
    "<span ng-switch=\"build.status.phase\" class=\"hide-ng-leave\">\n" +
    "<span ng-switch-when=\"Failed\" class=\"status-icon\">\n" +
    "<i class=\"pficon pficon-error-circle-o text-danger\"></i>\n" +
    "</span>\n" +
    "<span ng-switch-default>\n" +
    "<status-icon status=\"build.status.phase\"></status-icon>\n" +
    "</span>\n" +
    "</span>\n" +
    "<span>\n" +
    "Build\n" +
    "<a ng-href=\"{{build | navigateResourceURL}}\"><span ng-if=\"build | annotation : 'buildNumber'\">#{{build | annotation : 'buildNumber'}}</span><span ng-if=\"!(build | annotation : 'buildNumber')\">{{build.metadata.name}}</span></a>\n" +
    "<span ng-switch=\"build.status.phase\" class=\"hide-ng-leave\">\n" +
    "<span ng-switch-when=\"Failed\">failed</span>\n" +
    "<span ng-switch-when=\"Error\">encountered an error</span>\n" +
    "<span ng-switch-when=\"Cancelled\">was cancelled</span>\n" +
    "<span ng-switch-default>is {{build.status.phase | lowercase}}</span>\n" +
    "</span>\n" +
    "<ellipsis-pulser ng-if=\"build | isIncompleteBuild\" color=\"dark\" size=\"sm\" display=\"inline\" msg=\"\"></ellipsis-pulser>\n" +
    "<small class=\"text-muted mar-left-md\">created <span am-time-ago=\"build.metadata.creationTimestamp\"></span></small>\n" +
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
    "<div uib-dropdown class=\"dropdown-kebab-pf\">\n" +
    "<button uib-dropdown-toggle class=\"btn btn-link dropdown-toggle\">\n" +
    "<i class=\"fa fa-ellipsis-v\" aria-hidden=\"true\"></i><span class=\"sr-only\">Actions</span>\n" +
    "</button>\n" +
    "<ul class=\"dropdown-menu dropdown-menu-right\" uib-dropdown-menu role=\"menu\">\n" +
    "<li ng-if=\"row.showStartPipelineAction()\" role=\"menuitem\">\n" +
    "<a href=\"\" ng-click=\"row.startBuild(row.pipelines[0])\">Start Pipeline</a>\n" +
    "</li>\n" +
    "<li ng-if=\"row.showStartBuildAction()\" role=\"menuitem\">\n" +
    "<a href=\"\" ng-click=\"row.startBuild(row.buildConfigs[0])\">Start Build</a>\n" +
    "</li>\n" +
    "<li ng-if=\"row.deploymentConfigsInstantiateVersion | canI : 'create'\" role=\"menuitem\">\n" +
    "<a href=\"\" ng-if=\"row.canDeploy()\" ng-click=\"row.startDeployment()\">Deploy</a>\n" +
    "<a href=\"\" ng-if=\"!(row.canDeploy())\" class=\"disabled-link\" aria-disabled=\"true\">\n" +
    "Deploy <span ng-if=\"row.isPaused()\">(Paused)</span>\n" +
    "</a>\n" +
    "</li>\n" +
    "<li ng-if=\"row.deploymentConfigsVersion | canI : 'update'\" role=\"menuitem\">\n" +
    "<a ng-href=\"{{row.apiObject | editResourceURL}}\">Edit</a>\n" +
    "</li>\n" +
    "<li ng-if=\"('pod_presets' | enableTechPreviewFeature)\n" +
    "                      && row.state.bindableServiceInstances.length\n" +
    "                      && (row.serviceBindingsVersion | canI : 'create')\" role=\"menuitem\">\n" +
    "<a href=\"\" ng-click=\"row.showOverlayPanel('bindService', {target: row.apiObject})\">Create Binding</a>\n" +
    "</li>\n" +
    "<li ng-if=\"('pod_presets' | enableTechPreviewFeature)\n" +
    "                      && row.state.deleteableBindingsByApplicationUID[row.apiObject.metadata.uid].length\n" +
    "                      && (row.serviceBindingsVersion | canI : 'delete')\" role=\"menuitem\">\n" +
    "<a href=\"\" ng-click=\"row.showOverlayPanel('unbindService', {target: row.apiObject})\">Delete Binding</a>\n" +
    "</li>\n" +
    "<li ng-if=\"row.current && (row.deploymentConfigsLogVersion | canI : 'get')\" role=\"menuitem\">\n" +
    "<a ng-href=\"{{row.current | navigateResourceURL}}?tab=logs\">View Logs</a>\n" +
    "</li>\n" +
    "</ul>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-switch-when=\"Pod\">\n" +
    "<div uib-dropdown class=\"dropdown-kebab-pf\">\n" +
    "<button uib-dropdown-toggle class=\"btn btn-link dropdown-toggle\">\n" +
    "<i class=\"fa fa-ellipsis-v\" aria-hidden=\"true\"></i><span class=\"sr-only\">Actions</span>\n" +
    "</button>\n" +
    "<ul class=\"dropdown-menu dropdown-menu-right\" uib-dropdown-menu role=\"menu\">\n" +
    "<li role=\"menuitem\" ng-if=\"row.podsVersion | canI : 'update'\">\n" +
    "<a ng-href=\"{{row.apiObject | editYamlURL}}\">Edit YAML</a>\n" +
    "</li>\n" +
    "<li role=\"menuitem\" ng-if=\"(row.podsLogVersion | canI : 'get')\">\n" +
    "<a ng-href=\"{{row.apiObject | navigateResourceURL}}?tab=logs\">View Logs</a>\n" +
    "</li>\n" +
    "</ul>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-switch-default>\n" +
    "<div uib-dropdown class=\"dropdown-kebab-pf\">\n" +
    "<button uib-dropdown-toggle class=\"btn btn-link dropdown-toggle\">\n" +
    "<i class=\"fa fa-ellipsis-v\" aria-hidden=\"true\"></i><span class=\"sr-only\">Actions</span>\n" +
    "</button>\n" +
    "<ul class=\"dropdown-menu dropdown-menu-right\" uib-dropdown-menu role=\"menu\">\n" +
    "<li role=\"menuitem\" ng-if=\"row.rgv | canI : 'update'\">\n" +
    "<a ng-href=\"{{row.apiObject | editYamlURL}}\">Edit YAML</a>\n" +
    "</li>\n" +
    "<li ng-if=\"('pod_presets' | enableTechPreviewFeature)\n" +
    "                      && row.state.bindableServiceInstances.length\n" +
    "                      && (row.serviceBindingsVersion | canI : 'create')\" role=\"menuitem\">\n" +
    "<a href=\"\" ng-click=\"row.showOverlayPanel('bindService', {target: row.apiObject})\">Create Binding</a>\n" +
    "</li>\n" +
    "<li ng-if=\"('pod_presets' | enableTechPreviewFeature)\n" +
    "                      && row.state.deleteableBindingsByApplicationUID[row.apiObject.metadata.uid].length\n" +
    "                      && (row.serviceBindingsVersion | canI : 'delete')\" role=\"menuitem\">\n" +
    "<a href=\"\" ng-click=\"row.showOverlayPanel('unbindService', {target: row.apiObject})\">Delete Binding</a>\n" +
    "</li>\n" +
    "<li ng-if=\"(pod = row.firstPod(row.current)) && (row.podsLogVersion | canI : 'get')\" role=\"menuitem\">\n" +
    "<a ng-href=\"{{pod | navigateResourceURL}}?tab=logs\">View Logs</a>\n" +
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
    "<span class=\"sr-only\">Collapse</span>\n" +
    "</span>\n" +
    "<span ng-if=\"!row.expanded\">\n" +
    "<span class=\"fa fa-angle-right\" aria-hidden=\"true\"></span>\n" +
    "<span class=\"sr-only\">Expand</span>\n" +
    "</span>\n" +
    "</a>"
  );


  $templateCache.put('views/overview/_list-row-content.html',
    "<div class=\"list-pf-name\">\n" +
    "<h3>\n" +
    "<div class=\"component-label\">\n" +
    "{{row.apiObject.kind | humanizeKind}}\n" +
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
    "<span>\n" +
    "No deployments for <a ng-href=\"{{row.apiObject | navigateResourceURL}}\">{{row.apiObject.metadata.name}}</a>\n" +
    "</span>\n" +
    "</div>\n" +
    "<div ng-if=\"row.isDeploymentInProgress()\" class=\"list-pf-details deployment-in-progress-msg\">\n" +
    "<div ng-if=\"row.apiObject.kind === 'DeploymentConfig'\">\n" +
    "<span class=\"mar-right-sm\">\n" +
    "<span class=\"hidden-xs\">\n" +
    "{{row.apiObject.spec.strategy.type}} deployment is {{row.current | deploymentStatus | lowercase}}&thinsp;<ellipsis-pulser color=\"dark\" size=\"sm\" display=\"inline\" msg=\"\"></ellipsis-pulser>\n" +
    "</span>\n" +
    "\n" +
    "<span class=\"hidden visible-xs-inline nowrap\">\n" +
    "<ellipsis-pulser color=\"dark\" size=\"sm\" display=\"inline\" msg=\"Deploying\"></ellipsis-pulser>\n" +
    "</span>\n" +
    "</span>\n" +
    "<a ng-href=\"project/{{row.apiObject.metadata.namespace}}/browse/events\">View Events</a>\n" +
    "<span ng-if=\"row.replicationControllersVersion | canI : 'update'\">\n" +
    "<span class=\"action-divider\">|</span>\n" +
    "<a href=\"\" ng-click=\"row.cancelDeployment()\" role=\"button\">Cancel</a>\n" +
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
    "<div ng-switch on=\"row.apiObject.kind\" class=\"pods hidden-xs\">\n" +
    "<div ng-switch-when=\"Pod\">\n" +
    "<a ng-href=\"{{row.apiObject | navigateResourceURL}}\" class=\"mini-donut-link\">\n" +
    "<pod-donut pods=\"[row.apiObject]\" mini=\"true\"></pod-donut>\n" +
    "</a>\n" +
    "</div>\n" +
    "<div ng-switch-when=\"DaemonSet\">\n" +
    "<a ng-href=\"{{row.apiObject | navigateResourceURL}}\" class=\"mini-donut-link\">\n" +
    "<pod-donut pods=\"row.getPods(row.current)\" mini=\"true\"></pod-donut>\n" +
    "</a>\n" +
    "</div>\n" +
    "<div ng-switch-default>\n" +
    "<a ng-href=\"{{row.current | donutURL : row.getPods(row.current)}}\" class=\"mini-donut-link\" ng-class=\"{ 'disabled-link': !(row.getPods(row.current) | size) }\">\n" +
    "<pod-donut pods=\"row.getPods(row.current)\" idled=\"!(row.getPods(row.current) | size) && (row.apiObject | annotation : 'idledAt')\" mini=\"true\">\n" +
    "</pod-donut>\n" +
    "</a>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/overview/_list-row-empty-state.html',
    "<h2>No deployments.</h2>\n" +
    "<div ng-if=\"row.imageChangeTriggers.length\">\n" +
    "A new deployment will start automatically when\n" +
    "<span ng-if=\"row.imageChangeTriggers.length === 1\">\n" +
    "an image is pushed to\n" +
    "<a ng-href=\"{{row.urlForImageChangeTrigger(row.imageChangeTriggers[0])}}\">\n" +
    "{{row.imageChangeTriggers[0].imageChangeParams.from | imageObjectRef : row.apiObject.metadata.namespace}}</a>.\n" +
    "</span>\n" +
    "<span ng-if=\"row.imageChangeTriggers.length > 1\">\n" +
    "one of the images referenced by this deployment config changes.\n" +
    "</span>\n" +
    "</div>\n" +
    "<div ng-if=\"!row.imageChangeTriggers.length\">\n" +
    "<p>\n" +
    "No deployments for {{row.apiObject.kind | humanizeKind}}\n" +
    "<a ng-href=\"{{row.apiObject | navigateResourceURL}}\">{{row.apiObject.metadata.name}}</a>.\n" +
    "</p>\n" +
    "<div ng-if=\"row.apiObject.kind === 'DeploymentConfig'\">\n" +
    "<div ng-if=\"pipeline = row.pipelines[0]\">\n" +
    "<p>\n" +
    "This deployment config is part of the pipeline\n" +
    "<a ng-href=\"{{pipeline | navigateResourceURL}}\">{{pipeline.metadata.name}}</a>.\n" +
    "</p>\n" +
    "<div ng-if=\"row.showStartPipelineAction()\">\n" +
    "<button class=\"btn btn-primary\" ng-click=\"row.startBuild(pipeline)\">\n" +
    "Start Pipeline\n" +
    "</button>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"!row.pipelines.length\">\n" +
    "<button ng-if=\"row.deploymentConfigsInstantiateVersion | canI : 'create'\" class=\"btn btn-primary\" ng-click=\"row.startDeployment()\">\n" +
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
    "<h4 class=\"component-label section-label\">Containers</h4>\n" +
    "<pod-template pod-template=\"row.current | podTemplate\" images-by-docker-reference=\"row.state.imagesByDockerReference\" builds=\"row.state.builds\" class=\"hide-ng-leave\">\n" +
    "</pod-template>\n" +
    "<init-containers-summary api-object=\"row.apiObject\"></init-containers-summary>\n" +
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
    "<h4 class=\"h5\">Usage <small>Last 15 Minutes</small></h4>\n" +
    "</div>\n" +
    "<div ng-if=\"row.apiObject.kind !== 'Pod'\">\n" +
    "<deployment-metrics pods=\"row.getPods(row.current)\" containers=\"row.current.spec.template.spec.containers\" profile=\"compact\" alerts=\"row.state.alerts\">\n" +
    "</deployment-metrics>\n" +
    "<h4 class=\"h5\">Average Usage <small>Last 15 Minutes</small></h4>\n" +
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
    "<div ng-switch on=\"row.apiObject.kind\" class=\"latest-donut\">\n" +
    "<div ng-switch-when=\"Pod\">\n" +
    "<a ng-href=\"{{row.apiObject | navigateResourceURL}}\">\n" +
    "<pod-donut pods=\"[row.apiObject]\"></pod-donut>\n" +
    "</a>\n" +
    "</div>\n" +
    "<div ng-switch-when=\"DaemonSet\">\n" +
    "<a ng-href=\"{{row.apiObject | navigateResourceURL}}\">\n" +
    "<pod-donut pods=\"row.getPods(row.current)\"></pod-donut>\n" +
    "</a>\n" +
    "</div>\n" +
    "<div ng-switch-default>\n" +
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
    "<uib-tab-heading>Networking</uib-tab-heading>\n" +
    "<overview-networking row-services=\"row.services\" all-services=\"row.state.allServices\" routes-by-service=\"row.state.routesByService\">\n" +
    "</overview-networking>\n" +
    "</uib-tab>\n" +
    "<uib-tab ng-if=\"row.current\" active=\"row.selectedTab.containers\">\n" +
    "<uib-tab-heading>Containers</uib-tab-heading>\n" +
    "<pod-template pod-template=\"row.current | podTemplate\" images-by-docker-reference=\"row.state.imagesByDockerReference\" builds=\"row.state.builds\"></pod-template>\n" +
    "<init-containers-summary api-object=\"row.apiObject\"></init-containers-summary>\n" +
    "</uib-tab>\n" +
    "<uib-tab ng-if=\"row.current && row.state.showMetrics && row.state.breakpoint === 'xxs'\" active=\"row.selectedTab.metrics\">\n" +
    "<uib-tab-heading>Metrics</uib-tab-heading>\n" +
    "\n" +
    "<div ng-if=\"row.selectedTab.metrics\">\n" +
    "<div ng-if=\"row.apiObject.kind === 'Pod'\">\n" +
    "<deployment-metrics pods=\"[row.apiObject]\" containers=\"row.apiObject.spec.containers\" profile=\"compact\" alerts=\"row.state.alerts\" class=\"overview-metrics\">\n" +
    "</deployment-metrics>\n" +
    "<h4 class=\"h5\">Usage <small>Last 15 Minutes</small></h4>\n" +
    "</div>\n" +
    "<div ng-if=\"row.apiObject.kind !== 'Pod'\">\n" +
    "<deployment-metrics pods=\"row.getPods(row.current)\" containers=\"row.current.spec.template.spec.containers\" profile=\"compact\" alerts=\"row.state.alerts\" class=\"overview-metrics\">\n" +
    "</deployment-metrics>\n" +
    "<h4 class=\"h5\">Average Usage <small>Last 15 Minutes</small></h4>\n" +
    "</div>\n" +
    "</div>\n" +
    "</uib-tab>\n" +
    "<uib-tab ng-if=\"!row.hidePipelines && row.recentPipelines.length\" active=\"row.selectedTab.pipelines\">\n" +
    "<uib-tab-heading>\n" +
    "Pipelines\n" +
    "<span class=\"build-count\">\n" +
    "<build-counts builds=\"row.recentPipelines\"></build-counts>\n" +
    "</span>\n" +
    "</uib-tab-heading>\n" +
    "<overview-pipelines recent-pipelines=\"row.recentPipelines\">\n" +
    "</overview-pipelines>\n" +
    "</uib-tab>\n" +
    "<uib-tab ng-if=\"row.buildConfigs.length\" active=\"row.selectedTab.builds\">\n" +
    "<uib-tab-heading>\n" +
    "Builds\n" +
    "<span class=\"build-count\">\n" +
    "<build-counts builds=\"row.recentBuilds\"></build-counts>\n" +
    "</span>\n" +
    "</uib-tab-heading>\n" +
    "<overview-builds build-configs=\"row.buildConfigs\" recent-builds-by-build-config=\"row.state.recentBuildsByBuildConfig\" context=\"row.state.context\" hide-log=\"row.state.limitWatches\">\n" +
    "</overview-builds>\n" +
    "</uib-tab>\n" +
    "<uib-tab ng-if=\"row.showBindings && (row.bindings | size)\" active=\"row.selectedTab.bindings\">\n" +
    "<uib-tab-heading>Bindings</uib-tab-heading>\n" +
    "<overview-service-bindings component-label=\"Service Bindings\" ref-api-object=\"row.apiObject\" namespace=\"row.apiObject.metadata.namespace\" bindings=\"row.bindings\" bindable-service-instances=\"row.state.bindableServiceInstances\" service-classes=\"row.state.serviceClasses\" service-instances=\"row.state.serviceInstances\" create-binding=\"row.showOverlayPanel('bindService', {target: row.apiObject})\">\n" +
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
    "<overview-service-bindings component-label=\"Service Bindings\" ng-if=\"row.showBindings && (row.bindings | size)\" ref-api-object=\"row.apiObject\" namespace=\"row.apiObject.metadata.namespace\" bindings=\"row.bindings\" bindable-service-instances=\"row.state.bindableServiceInstances\" service-classes=\"row.state.serviceClasses\" service-instances=\"row.state.serviceInstances\" create-binding=\"row.showOverlayPanel('bindService', {target: row.apiObject})\">\n" +
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
    "<overlay-panel show-panel=\"row.overlay.panelVisible\" handle-close=\"row.closeOverlayPanel\">\n" +
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


  $templateCache.put('views/overview/_mobile-client-row.html',
    "<div class=\"list-pf-item\" ng-class=\"{ active: row.expanded }\">\n" +
    "<div class=\"list-pf-container\" ng-click=\"row.toggleExpand($event)\">\n" +
    "<div class=\"list-pf-chevron\">\n" +
    "<div ng-include src=\" 'views/overview/_list-row-chevron.html' \" class=\"list-pf-content\"></div>\n" +
    "</div>\n" +
    "<div class=\"list-pf-content\">\n" +
    "<div class=\"list-pf-name\">\n" +
    "<h3>\n" +
    "<div class=\"list-row-longname\"><span>{{row.clientType}}</span></div>\n" +
    "\n" +
    "<a ng-href=\"{{row.apiObject | navigateResourceURL}}\"><span ng-bind-html=\"row.apiObject.spec.name | highlightKeywords : row.state.filterKeywords\"></span></a>\n" +
    "<div class=\"list-row-longname\">{{row.bundleDisplay}}</div>\n" +
    "</h3>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"list-pf-actions\">\n" +
    "<div class=\"dropdown-kebab-pf\" uib-dropdown ng-if=\"row.actionsDropdownVisible()\">\n" +
    "<button uib-dropdown-toggle class=\"btn btn-link dropdown-toggle\">\n" +
    "<i class=\"fa fa-ellipsis-v\" aria-hidden=\"true\"></i>\n" +
    "<span class=\"sr-only\">Actions</span>\n" +
    "</button>\n" +
    "<ul class=\"dropdown-menu dropdown-menu-right\" uib-dropdown-menu role=\"menu\">\n" +
    "<li ng-if=\"row.mobileclientVersion | canI : 'delete'\">\n" +
    "<delete-link kind=\"MobileClient\" group=\"mobile.k8s.io\" stay-on-current-page=\"true\" resource-name=\"{{row.apiObject.metadata.name}}\" project-name=\"{{row.projectName}}\">\n" +
    "</delete-link>\n" +
    "</li>\n" +
    "</ul>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"list-pf-expansion collapse\" ng-if=\"row.expanded\" ng-class=\"{ in: row.expanded }\">\n" +
    "<div class=\"list-pf-container\">\n" +
    "<div class=\"expanded-section\">\n" +
    "<div class=\"empty-state-message text-center\">\n" +
    "<p>Add a mobile service to your project. Or connect to external service.</p>\n" +
    "<div class=\"empty-state-message-main-action\">\n" +
    "\n" +
    "<button class=\"btn btn-primary btn-lg\" ng-click=\"row.browseCatalog()\">\n" +
    "Browse Mobile Services\n" +
    "</button>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"loading\">\n" +
    "Loading...\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/overview/_networking.html',
    "<div ng-if=\"networking.rowServices | size\" class=\"expanded-section networking-section\">\n" +
    "<div class=\"component-label section-label hidden-xs\">Networking</div>\n" +
    "<div ng-repeat=\"service in networking.rowServices\" class=\"row\">\n" +
    "<div class=\"col-sm-5 col-md-6\">\n" +
    "<div class=\"resource-label\">\n" +
    "Service - Internal Traffic\n" +
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
    "and\n" +
    "<span class=\"nowrap\">\n" +
    "{{service.spec.ports.length - 1}}\n" +
    "<span ng-if=\"service.spec.ports.length > 2\">others</span>\n" +
    "<span ng-if=\"service.spec.ports.length === 2\">other</span>\n" +
    "</span>\n" +
    "</span>\n" +
    "</div>\n" +
    "<div class=\"col-sm-7 col-md-6 overview-routes\">\n" +
    "<div class=\"resource-label\">\n" +
    "Routes - External Traffic\n" +
    "</div>\n" +
    "<div ng-if=\"networking.routesByService[service.metadata.name] | size\">\n" +
    "<div ng-repeat=\"route in networking.routesByService[service.metadata.name] track by (route | uid)\" class=\"overview-routes\">\n" +
    "<h3>\n" +
    "<span ng-if=\"route | isWebRoute\">\n" +
    "<a ng-href=\"{{route | routeWebURL}}\" target=\"_blank\">\n" +
    "{{route | routeLabel}}\n" +
    "<i class=\"fa fa-external-link\" aria-hidden=\"true\"></i>\n" +
    "</a>\n" +
    "</span>\n" +
    "<span ng-if=\"!(route | isWebRoute)\">{{route | routeLabel}}</span>\n" +
    "<route-warnings route=\"route\" services=\"networking.allServices\"></route-warnings>\n" +
    "</h3>\n" +
    "<div class=\"overview-route\">\n" +
    "Route <a ng-href=\"{{route | navigateResourceURL}}\">{{route.metadata.name}}</a><span ng-if=\"route.spec.port.targetPort\">, target port {{route.spec.port.targetPort}}</span>\n" +
    "</div>\n" +
    "<div ng-if=\"route | hasAlternateBackends\">\n" +
    "<route-service-bar-chart route=\"route\" highlight-service=\"service.metadata.name\"></route-service-bar-chart>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"!(networking.routesByService[service.metadata.name] | size)\">\n" +
    "<a ng-if=\"'routes' | canI : 'create'\" ng-href=\"project/{{service.metadata.namespace}}/create-route?service={{service.metadata.name}}\">\n" +
    "<span class=\"pficon pficon-add-circle-o\" aria-hidden=\"true\"></span>\n" +
    "Create Route\n" +
    "</a>\n" +
    "<span ng-if=\"!('routes' | canI : 'create')\" class=\"text-muted\">No Routes</span>\n" +
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
    "<span ng-if=\"notification.countByType.warning === 1\">\n" +
    "Warning\n" +
    "</span>\n" +
    "<span ng-if=\"notification.countByType.warning !== 1\">\n" +
    "Warnings\n" +
    "</span>\n" +
    "</span>\n" +
    "</div>\n" +
    "<div ng-if=\"notification.byType.info\" class=\"notification-icon-count animate-if\">\n" +
    "<span dynamic-content=\"{{notification.byType.info}}\" data-toggle=\"tooltip\" data-trigger=\"hover\">\n" +
    "<span class=\"pficon pficon-info\" aria-hidden=\"true\"></span>\n" +
    "{{notification.countByType.info}}\n" +
    "<span ng-if=\"notification.countByType.info === 1\">\n" +
    "Message\n" +
    "</span>\n" +
    "<span ng-if=\"notification.countByType.info !== 1\">\n" +
    "Messages\n" +
    "</span>\n" +
    "</span>\n" +
    "</div>"
  );


  $templateCache.put('views/overview/_pipelines.html',
    "<div ng-if=\"overviewPipelines.recentPipelines.length\" class=\"expanded-section\">\n" +
    "<div class=\"component-label section-label sans-border hidden-xs\">Pipelines</div>\n" +
    "<div ng-repeat=\"pipeline in overviewPipelines.recentPipelines track by (pipeline | uid)\" class=\"build-pipeline-wrapper animate-repeat\">\n" +
    "<build-pipeline build=\"pipeline\" build-config-name-on-expanded=\"true\" collapse-pending=\"true\"></build-pipeline>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/overview/_service-bindings.html',
    "<div class=\"expanded-section\">\n" +
    "<div class=\"component-label hidden-xs\">{{$ctrl.sectionTitle}}</div>\n" +
    "<service-binding ng-repeat=\"binding in $ctrl.bindings track by (binding | uid)\" is-overview=\"true\" namespace=\"$ctrl.namespace\" ref-api-object=\"$ctrl.refApiObject\" binding=\"binding\" service-classes=\"$ctrl.serviceClasses\" service-instances=\"$ctrl.serviceInstances\" secrets=\"$ctrl.secrets\">\n" +
    "</service-binding>\n" +
    "<p ng-if=\"!$ctrl.refApiObject.metadata.deletionTimestamp && ($ctrl.bindableServiceInstances | size) && ({resource: 'servicebindings', group: 'servicecatalog.k8s.io'} | canI : 'create')\">\n" +
    "<a href=\"\" ng-click=\"$ctrl.createBinding()\" role=\"button\">\n" +
    "<span class=\"pficon pficon-add-circle-o\" aria-hidden=\"true\"></span>\n" +
    "Create Binding\n" +
    "</a>\n" +
    "</p>\n" +
    "<p ng-if=\"($ctrl.refApiObject.kind !== 'ServiceInstance')  && !($ctrl.bindableServiceInstances | size)\">\n" +
    "<span>You must have a bindable service in your namespace in order to create bindings.</span>\n" +
    "<div>\n" +
    "<a href=\"catalog\">Browse Catalog</a>\n" +
    "</div>\n" +
    "</p>\n" +
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
    "<a ng-href=\"{{row.apiObject | navigateResourceURL}}\" ng-bind-html=\"row.displayName | highlightKeywords : row.state.filterKeywords\"></a>\n" +
    "<div ng-bind-html=\"row.apiObject.metadata.name | highlightKeywords : row.state.filterKeywords\" class=\"list-row-longname\"></div>\n" +
    "</h3>\n" +
    "<div class=\"status-icons\" ng-if=\"!row.expanded\" ng-init=\"tooltipID = 'instance-status-tooltip-' + $id\">\n" +
    "<notification-icon alerts=\"row.notifications\"></notification-icon>\n" +
    "<div ng-switch=\"row.instanceStatus\" class=\"instance-status-notification\" id=\"{{tooltipID}}\">\n" +
    "\n" +
    "<span ng-switch-when=\"failed\" dynamic-content=\"{{row.getFailedTooltipText()}}\" data-toggle=\"tooltip\" data-trigger=\"hover\" data-container=\"#{{tooltipID}}\">\n" +
    "<span class=\"pficon pficon-error-circle-o\" aria-hidden=\"true\"></span>\n" +
    "Error\n" +
    "</span>\n" +
    "<span ng-switch-when=\"deleted\" class=\"notification-icon-count\">\n" +
    "<span class=\"pficon pficon-warning-triangle-o\" aria-hidden=\"true\"></span>\n" +
    "Marked for Deletion\n" +
    "</span>\n" +
    "<span ng-switch-when=\"pending\" class=\"notification-icon-count\">\n" +
    "<span class=\"spinner spinner-xs spinner-inline\" aria-hidden=\"true\"></span>\n" +
    "<span>Pending</span>\n" +
    "</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"list-pf-details\" ng-if=\"!row.expanded\">\n" +
    "<span ng-if=\"!row.bindings.length\n" +
    "                    && row.isBindable\n" +
    "                    && (row.serviceBindingsVersion | canI : 'create')\" class=\"hidden-xs hidden-sm\">\n" +
    "<a href=\"\" ng-click=\"row.showOverlayPanel('bindService', {target: row.apiObject})\">\n" +
    "<span class=\"pficon pficon-add-circle-o\" aria-hidden=\"true\"></span>\n" +
    "Create Binding\n" +
    "</a>\n" +
    "</span>\n" +
    "<div ng-if=\"row.bindings.length\" class=\"hidden-xs hidden-sm\">\n" +
    "<span class=\"component-label\">Bindings</span>\n" +
    "<p ng-if=\"firstBinding = row.bindings[0]\" class=\"bindings\">\n" +
    "<span ng-if=\"application = row.state.applicationsByBinding[firstBinding.metadata.name][0]\">\n" +
    "{{application.metadata.name}}\n" +
    "</span>\n" +
    "<span ng-if=\"!application\">\n" +
    "{{firstBinding.metadata.name}}\n" +
    "</span>\n" +
    "<span ng-if=\"row.bindings.length > 1\">\n" +
    "and\n" +
    "<a ng-if=\"row.bindings.length > 1\" ng-click=\"row.toggleExpand($event, true)\">\n" +
    "{{row.bindings.length -1}} other<span ng-if=\"row.bindings.length > 2\">s</span></a>\n" +
    "</span>\n" +
    "</p>\n" +
    "</div>\n" +
    "<div class=\"hidden-xs\" ng-if=\"(!row.instanceStatus || row.instanceStatus === 'ready') && row.apiObject.status.dashboardURL\">\n" +
    "<a ng-href=\"{{row.apiObject.status.dashboardURL}}\" target=\"_blank\">\n" +
    "Dashboard <i class=\"fa fa-external-link small\" aria-hidden=\"true\"></i>\n" +
    "</a>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"list-pf-actions\">\n" +
    "<div class=\"dropdown-kebab-pf\" uib-dropdown ng-if=\"row.actionsDropdownVisible()\">\n" +
    "<button uib-dropdown-toggle class=\"btn btn-link dropdown-toggle\">\n" +
    "<i class=\"fa fa-ellipsis-v\" aria-hidden=\"true\"></i><span class=\"sr-only\">Actions</span>\n" +
    "</button>\n" +
    "<ul class=\"dropdown-menu dropdown-menu-right\" uib-dropdown-menu role=\"menu\">\n" +
    "<li role=\"menuitem\" ng-if=\"row.isBindable && (row.serviceBindingsVersion | canI : 'create')\">\n" +
    "<a href=\"\" ng-click=\"row.showOverlayPanel('bindService', {target: row.apiObject})\">\n" +
    "Create Binding\n" +
    "</a>\n" +
    "</li>\n" +
    "<li role=\"menuitem\" ng-if=\"row.deleteableBindings.length && (row.serviceBindingsVersion | canI : 'delete')\">\n" +
    "<a href=\"\" ng-click=\"row.showOverlayPanel('unbindService', {target: row.apiObject})\">Delete Binding</a>\n" +
    "</li>\n" +
    "<li role=\"menuitem\">\n" +
    "<a href=\"\" ng-click=\"row.deprovision()\" role=\"button\" ng-if=\"row.serviceInstancesVersion | canI : 'delete'\">Delete</a>\n" +
    "</li>\n" +
    "</ul>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"list-pf-expansion collapse\" ng-if=\"row.expanded\" ng-class=\"{ in: row.expanded }\">\n" +
    "<div class=\"list-pf-container\">\n" +
    "<alerts alerts=\"row.notifications\"></alerts>\n" +
    "<div ng-switch=\"row.instanceStatus\">\n" +
    "<div ng-switch-when=\"deleted\" class=\"row\">\n" +
    "<div class=\"col-sm-12\">\n" +
    "<div class=\"alert word-break alert-warning\">\n" +
    "<span class=\"pficon pficon-warning-triangle-o\" aria-hidden=\"true\"></span>\n" +
    "<span class=\"sr-only\">warning</span>\n" +
    "<span class=\"strong\">The service was marked for deletion.</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-switch-when=\"failed\" class=\"row\">\n" +
    "<div class=\"col-sm-12\">\n" +
    "<div class=\"alert word-break alert-danger\">\n" +
    "<span class=\"pficon pficon-error-circle-o\" aria-hidden=\"true\"></span>\n" +
    "<span class=\"sr-only\">error</span>\n" +
    "<span class=\"strong\">The service failed.</span>\n" +
    "<span class=\"instance-status-message\">\n" +
    "<truncate-long-text content=\"row.apiObject | serviceInstanceFailedMessage\" expandable=\"true\" limit=\"265\" newline-limit=\"4\"></truncate-long-text>\n" +
    "</span>\n" +
    "<div ng-if=\"row.serviceInstancesVersion | canI : 'delete'\">\n" +
    "<a href=\"\" ng-click=\"row.deprovision()\">Delete This Service</a>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-switch-when=\"pending\" class=\"row\">\n" +
    "<div class=\"col-sm-12\">\n" +
    "<div class=\"alert word-break alert-info\">\n" +
    "<span class=\"pficon pficon-info\" aria-hidden=\"true\"></span>\n" +
    "<span class=\"sr-only\">info</span>\n" +
    "<span class=\"strong\">The service is not yet ready.</span>\n" +
    "<span class=\"instance-status-message\">\n" +
    "<truncate-long-text content=\"row.apiObject | serviceInstanceReadyMessage\" expandable=\"true\" limit=\"265\" newline-limit=\"4\"></truncate-long-text>\n" +
    "</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"expanded-section no-margin\">\n" +
    "<div class=\"row\">\n" +
    "<div class=\"col-sm-12\" ng-if=\"row.serviceClass.spec.description\">\n" +
    "<p class=\"service-description\"><truncate-long-text limit=\"500\" content=\"row.serviceClass.spec.description\" use-word-boundary=\"true\" expandable=\"true\" linkify=\"true\">\n" +
    "</truncate-long-text></p>\n" +
    "<div ng-if=\"row.serviceClass.spec.externalMetadata.documentationUrl || row.serviceClass.spec.externalMetadata.supportUrl\">\n" +
    "<a ng-if=\"row.serviceClass.spec.externalMetadata.documentationUrl\" ng-href=\"{{row.serviceClass.spec.externalMetadata.documentationUrl}}\" target=\"_blank\" class=\"learn-more-link\">View Documentation <i class=\"fa fa-external-link\" aria-hidden=\"true\"></i></a>\n" +
    "<a ng-if=\"row.serviceClass.spec.externalMetadata.supportUrl\" ng-href=\"{{row.serviceClass.spec.externalMetadata.supportUrl}}\" target=\"_blank\" class=\"learn-more-link\">Get Support <i class=\"fa fa-external-link\" aria-hidden=\"true\"></i></a>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"expanded-section\">\n" +
    "<div ng-if=\"row.isBindable || (row.bindings | size)\">\n" +
    "<div class=\"component-label section-label\">Bindings</div>\n" +
    "<service-instance-bindings is-overview=\"true\" project=\"row.state.project\" bindings=\"row.bindings\" service-instance=\"row.apiObject\" service-class=\"row.serviceClass\" service-plan=\"row.servicePlan\">\n" +
    "</service-instance-bindings>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<overlay-panel show-panel=\"row.overlay.panelVisible\" handle-close=\"row.closeOverlayPanel\">\n" +
    "<div ng-if=\"row.overlay.panelName === 'bindService'\">\n" +
    "<bind-service target=\"row.overlay.state.target\" project=\"row.state.project\" on-close=\"row.closeOverlayPanel\"></bind-service>\n" +
    "</div>\n" +
    "<div ng-if=\"row.overlay.panelName === 'unbindService'\">\n" +
    "<unbind-service target=\"row.overlay.state.target\" bindings=\"row.deleteableBindings\" applications-by-binding=\"row.state.applicationsByBinding\" on-close=\"row.closeOverlayPanel\" service-class=\"row.serviceClass\"></unbind-service>\n" +
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


  $templateCache.put('views/overview/_virtual-machine-row.html',
    "<div class=\"list-pf-item\" ng-class=\"{ active: row.expanded }\">\n" +
    "<div class=\"list-pf-container\" ng-click=\"row.toggleExpand($event)\">\n" +
    "<div class=\"list-pf-chevron\">\n" +
    "<div ng-include src=\" 'views/overview/_list-row-chevron.html' \" class=\"list-pf-content\"></div>\n" +
    "</div>\n" +
    "<div class=\"list-pf-content\">\n" +
    "<div class=\"list-pf-name\">\n" +
    "<h3>\n" +
    "<div class=\"component-label\"><span>Virtual Machine</span></div>\n" +
    "<optional-link link=\"{{row.apiObject._pod | navigateResourceURL}}\">\n" +
    "<span ng-bind-html=\"row.apiObject.metadata.name | highlightKeywords : row.state.filterKeywords\"></span>\n" +
    "</optional-link>\n" +
    "</h3>\n" +
    "</div>\n" +
    "<div ng-if=\"row.state.showMetrics && (row.state.breakpoint === 'md' || row.state.breakpoint === 'lg') && row.apiObject._pod\" class=\"list-pf-details\">\n" +
    "<metrics-summary pods=\"[row.apiObject._pod]\" containers=\"row.apiObject._pod.spec.containers\">\n" +
    "</metrics-summary>\n" +
    "</div>\n" +
    "<div class=\"list-pf-details\">\n" +
    "<div ng-if=\"!row.expanded\" vm-state ovm=\"row.apiObject\"></div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"list-pf-actions\">\n" +
    "<div class=\"dropdown-kebab-pf\" uib-dropdown ng-if=\"row.actionsDropdownVisible()\">\n" +
    "<button uib-dropdown-toggle class=\"btn btn-link dropdown-toggle\">\n" +
    "<i class=\"fa fa-ellipsis-v\" aria-hidden=\"true\"></i>\n" +
    "<span class=\"sr-only\">Actions</span>\n" +
    "</button>\n" +
    "<ul class=\"dropdown-menu dropdown-menu-right\" uib-dropdown-menu role=\"menu\">\n" +
    "<dropdown-item action=\"row.startOvm()\" enabled=\"{{row.canStartOvm()}}\">Start</dropdown-item>\n" +
    "<dropdown-item action=\"row.restartOvm()\" enabled=\"{{row.canRestartOvm()}}\">Restart</dropdown-item>\n" +
    "<dropdown-item action=\"row.stopOvm()\" enabled=\"{{row.canStopOvm()}}\">Stop</dropdown-item>\n" +
    "<li ng-if=\"row.OfflineVirtualMachineVersion | canI : 'delete'\">\n" +
    "<delete-link kind=\"OfflineVirtualMachine\" group=\"{{row.OfflineVirtualMachineVersion.group}}\" stay-on-current-page=\"true\" resource-name=\"{{row.apiObject.metadata.name}}\" project-name=\"{{row.projectName}}\">\n" +
    "</delete-link>\n" +
    "</li>\n" +
    "</ul>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"list-pf-expansion collapse\" ng-if=\"row.expanded\" ng-class=\"{ in: row.expanded }\">\n" +
    "<div class=\"list-pf-container\">\n" +
    "<div class=\"word-break\">\n" +
    "<span class=\"vm-detail-key\">State:</span>\n" +
    "<span vm-state ovm=\"row.apiObject\"></span>\n" +
    "<span class=\"vm-detail-state-actions\">\n" +
    "<span class=\"bar-separated\" ng-if=\"row.canStartOvm()\">\n" +
    "<a href=\"\" ng-click=\"row.startOvm()\">Start</a>\n" +
    "</span>\n" +
    "<span class=\"bar-separated\" ng-if=\"row.canRestartOvm()\">\n" +
    "<a href=\"\" ng-click=\"row.restartOvm()\">Restart</a>\n" +
    "</span>\n" +
    "<span class=\"bar-separated\" ng-if=\"row.canStopOvm()\">\n" +
    "<a href=\"\" ng-click=\"row.stopOvm()\">Stop</a>\n" +
    "</span>\n" +
    "</span>\n" +
    "</div>\n" +
    "<div class=\"word-break\">\n" +
    "<span class=\"vm-detail-key\">Uptime:</span>\n" +
    "<span class=\"vm-detail-value\">{{ row.apiObject._pod | vmPodUptime }}</span>\n" +
    "</div>\n" +
    "<div class=\"word-break\" ng-if=\"row.isWindowsVM() && row.isOvmInRunningPhase()\">\n" +
    "<span class=\"vm-detail-key\">Remote Desktop:</span>\n" +
    "<span class=\"vm-detail-value\">\n" +
    "<a href=\"\" ng-if=\"row.isRdpService()\" ng-click=\"row.onOpenRemoteDesktop()\">Open Console</a>\n" +
    "<div ng-if=\"!row.isRdpService()\">No RDP service defined</div>\n" +
    "</span>\n" +
    "</div>\n" +
    "<div class=\"word-break\">\n" +
    "<span class=\"vm-detail-key\">Operating System:</span>\n" +
    "<span class=\"vm-detail-value\">{{row.apiObject.metadata.labels['kubevirt.io/os'] || '--'}}</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/overview/_vm-status.html',
    " <span ng-switch=\"status\" class=\"vm-detail-value\">\n" +
    "<span class=\"pficon pficon-on-running\" ng-style=\"{color: '#3f9c35'}\" ng-switch-when=\"Running\"></span>\n" +
    "<span class=\"spinner spinner-xs spinner-inline\" ng-switch-when=\"Pending\"></span>\n" +
    "<span class=\"spinner spinner-xs spinner-inline\" ng-switch-when=\"Scheduling\"></span>\n" +
    "<span class=\"spinner spinner-xs spinner-inline\" ng-switch-when=\"Scheduled\"></span>\n" +
    "<span class=\"pficon pficon-off\" ng-switch-when=\"Off\"></span>\n" +
    "<span class=\"pficonpficon-error-circle-o\" ng-style=\"{color: '#a30000'}\" ng-switch-when=\"Failed\"></span>\n" +
    "<span class=\"pficon pficon-unknown\" ng-switch-when=\"Unknown\"></span>\n" +
    "<span class=\"pficon pficon-unknown\" ng-switch-when=\"\"></span>\n" +
    "</span>\n" +
    "{{status}}"
  );


  $templateCache.put('views/pipelines.html',
    "<div class=\"middle\">\n" +
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
    "<a ng-href=\"{{createSampleURL}}\" class=\"btn btn-primary btn-lg\">\n" +
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
    "<button class=\"btn btn-default\" ng-if=\"buildConfigsInstantiateVersion | canI : 'create'\" ng-click=\"startBuild(buildConfig)\">\n" +
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
    "<p class=\"mar-bottom-xxl\">\n" +
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
    "<span ng-if=\"buildConfigsVersion | canI : 'update'\">\n" +
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
    "</div>"
  );


  $templateCache.put('views/pods.html',
    "<div class=\"middle\">\n" +
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
    "<div ng-if=\"((pods | hashSize) > 0) || filterWithZeroResults\" class=\"data-toolbar\">\n" +
    "<div class=\"data-toolbar-filter\">\n" +
    "<project-filter></project-filter>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"middle-content\">\n" +
    "<div class=\"container-fluid\">\n" +
    "<div class=\"row\">\n" +
    "<div class=\"col-md-12\">\n" +
    "<div ng-if=\"(pods | hashSize) == 0\">\n" +
    "<p ng-if=\"!podsLoaded\">\n" +
    "Loading...\n" +
    "</p>\n" +
    "<div ng-if=\"podsLoaded\" class=\"empty-state-message text-center\">\n" +
    "<div ng-if=\"!filterWithZeroResults\">\n" +
    "<h2>No pods.</h2>\n" +
    "<p>No pods have been added to project {{projectName}}.</p>\n" +
    "</div>\n" +
    "<div ng-if=\"filterWithZeroResults\">\n" +
    "<h2>The filter is hiding all pods. <button type=\"button\" class=\"btn btn-link inline-btn-link\" ng-click=\"clearFilter()\">Clear All Filters</button></h2>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<pods-table ng-if=\"(pods | hashSize) > 0\" pods=\"pods\"></pods-table>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/project-browse-catalog.html',
    "<div class=\"middle surface-shaded project-browse-catalog\">\n" +
    "<div class=\"middle-content\">\n" +
    "<services-view catalog-items=\"catalogItems\" base-project-url=\"project\" section-title=\"Select an item to add to the current project\" keyword-filter=\"keywordFilter\">\n" +
    "</services-view>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/projects.html',
    "<div class=\"middle surface-shaded\">\n" +
    "<origin-modal-popup class=\"projects-list-create-popup\" shown=\"newProjectPanelShown\" modal-title=\"Create Project\" on-close=\"closeNewProjectPanel\" reference-element=\"popupElement\">\n" +
    "<create-project is-dialog=\"true\" redirect-action=\"onNewProject\" on-cancel=\"closeNewProjectPanel\"></create-project>\n" +
    "</origin-modal-popup>\n" +
    "<div class=\"middle-content\">\n" +
    "<div class=\"container-fluid\">\n" +
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
    "<h1>My Projects</h1>\n" +
    "<div class=\"projects-options\">\n" +
    "<div class=\"projects-add\" ng-if=\"canCreate\">\n" +
    "<button ng-click=\"createProject($event)\" class=\"btn btn-primary\">\n" +
    "<span class=\"fa fa-plus\" aria-hidden=\"true\"></span>\n" +
    "<span class=\"icon-button-text\">Create Project</span>\n" +
    "</button>\n" +
    "</div>\n" +
    "<div class=\"projects-search\">\n" +
    "<form role=\"form\" class=\"search-pf has-button\">\n" +
    "<div class=\"form-group has-clear\">\n" +
    "<div class=\"search-pf-input-group\">\n" +
    "<label for=\"search-projects\" class=\"sr-only\">Filter by keyword</label>\n" +
    "<input type=\"search\" class=\"form-control\" placeholder=\"Filter by keyword\" id=\"search-projects\" ng-model=\"search.text\">\n" +
    "<button type=\"button\" class=\"clear\" aria-hidden=\"true\" ng-if=\"search.text\" ng-click=\"search.text = ''\">\n" +
    "<span class=\"pficon pficon-close\"></span>\n" +
    "</button>\n" +
    "</div>\n" +
    "</div>\n" +
    "</form>\n" +
    "<span class=\"vertical-divider\"></span>\n" +
    "<span class=\"projects-sort-label\">Sort by</span>\n" +
    "<div class=\"projects-sort\">\n" +
    "<pf-sort config=\"sortConfig\" class=\"sort-controls\"></pf-sort>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"isProjectListIncomplete\">\n" +
    "<div class=\"alert alert-warning\">\n" +
    "<span class=\"pficon pficon-warning-triangle-o\" aria-hidden=\"true\"></span>\n" +
    "<span class=\"sr-only\">Warning:</span>\n" +
    "The complete list of your projects could not be loaded. Type a project name to go to that project.\n" +
    "</div>\n" +
    "<form>\n" +
    "<div class=\"form-group\">\n" +
    "<label for=\"typed-project-name\">Project Name</label>\n" +
    "<div class=\"input-group\">\n" +
    "<input class=\"form-control\" type=\"text\" id=\"typed-project-name\" required minlength=\"2\" ng-model=\"input.typedProjectName\" autocorrect=\"off\" autocapitalize=\"none\" spellcheck=\"false\">\n" +
    "<span class=\"input-group-btn\">\n" +
    "<button class=\"btn btn-default\" type=\"submit\" ng-disabled=\"!input.typedProjectName\" ng-click=\"goToProject(input.typedProjectName)\">\n" +
    "<i class=\"fa fa-arrow-right\" aria-hidden=\"true\"></i>\n" +
    "<span class=\"sr-only\">Go to Project</span>\n" +
    "</button>\n" +
    "</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "</form>\n" +
    "</div>\n" +
    "<div ng-if=\"!projects.length && !isProjectListIncomplete\" class=\"h3 empty-state-message\">\n" +
    "The current filter is hiding all projects.\n" +
    "<button type=\"button\" class=\"btn btn-link inline-btn-link\" ng-click=\"search.text = ''\">Clear All Filters</button>\n" +
    "</div>\n" +
    "<div ng-if=\"projects.length\" class=\"list-pf list-group projects-list\">\n" +
    "<div ng-repeat=\"project in projects | limitTo: limitListTo track by (project | uid)\" class=\"list-pf-item list-group-item project-info tile-click\">\n" +
    "<div class=\"list-pf-container\">\n" +
    "<div class=\"list-pf-content list-pf-content-flex\">\n" +
    "<div class=\"list-pf-content-wrapper\">\n" +
    "<div class=\"list-pf-main-content\">\n" +
    "<div class=\"list-pf-title project-name-item\">\n" +
    "<h2 class=\"h3\">\n" +
    "<a class=\"tile-target\" ng-href=\"project/{{project.metadata.name}}\" title=\"{{project | displayName}}\">\n" +
    "<span ng-bind-html=\"project | displayName | highlightKeywords : keywords\"></span>\n" +
    "</a>\n" +
    "<span ng-if=\"project.status.phase != 'Active'\" data-toggle=\"tooltip\" title=\"This project has been marked for deletion.\" class=\"pficon pficon-warning-triangle-o\"></span>\n" +
    "</h2>\n" +
    "<small class=\"project-date\">\n" +
    "<span ng-if=\"project | displayName : true\"><span ng-bind-html=\"project.metadata.name | highlightKeywords : keywords\"></span> &ndash;</span>\n" +
    "created\n" +
    "<span ng-if=\"project | annotation : 'openshift.io/requester'\">by <span ng-bind-html=\"project | annotation : 'openshift.io/requester' | highlightKeywords : keywords\"></span></span>\n" +
    "<span am-time-ago=\"project.metadata.creationTimestamp\"></span>\n" +
    "</small>\n" +
    "</div>\n" +
    "<div class=\"list-pf-description project-description\">\n" +
    "<truncate-long-text ng-if=\"!keywords.length\" content=\"project | description\" limit=\"265\" newline-limit=\"10\" use-word-boundary=\"true\"></truncate-long-text>\n" +
    "<span class=\"highlighted-content\" ng-if=\"keywords.length\" ng-bind-html=\"project | description | truncate : 1000 | highlightKeywords : keywords\"></span>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"list-pf-actions\" ng-if=\"project.status.phase == 'Active'\">\n" +
    "<div uib-dropdown class=\"dropdown pull-right dropdown-kebab-pf\">\n" +
    "<button uib-dropdown-toggle class=\"btn btn-link dropdown-toggle\"><i class=\"fa fa-ellipsis-v\" aria-hidden=\"true\"></i><span class=\"sr-only\">Actions</span></button>\n" +
    "<ul class=\"dropdown-menu dropdown-menu-right\" uib-dropdown-menu role=\"menu\">\n" +
    "<li role=\"menuitem\">\n" +
    "<a ng-href=\"project/{{project.metadata.name}}/membership\">\n" +
    "View Membership\n" +
    "</a>\n" +
    "</li>\n" +
    "<li role=\"menuitem\">\n" +
    "<a href=\"\" ng-click=\"editProject(project)\">\n" +
    "Edit Project\n" +
    "</a>\n" +
    "</li>\n" +
    "<li role=\"menuitem\">\n" +
    "<delete-project label=\"Delete Project\" project=\"project\" type-name-to-confirm=\"true\" stay-on-current-page=\"true\" success=\"onDeleteProject\">\n" +
    "</delete-project>\n" +
    "</li>\n" +
    "</ul>\n" +
    "</div>\n" +
    "</div>\n" +
    "<origin-modal-popup shown=\"editProjectPanelShown && editingProject === project\" ng-class=\"{'with-description': (project | description | size)}\" modal-title=\"Edit Project\" on-close=\"closeEditProjectPanel\">\n" +
    "<edit-project project=\"project\" is-dialog=\"true\" redirect-action=\"onEditProject\" on-cancel=\"closeEditProjectPanel\"></edit-project>\n" +
    "</origin-modal-popup>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<p ng-if=\"projects.length > limitListTo\">\n" +
    "Only the first {{limitListTo}} projects are displayed. Filter by keyword or change sort options to see other projects.\n" +
    "</p>\n" +
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
    "<div ng-if=\"canCreate\">\n" +
    "<button ng-click=\"createProject($event)\" class=\"btn btn-lg btn-primary\">\n" +
    "<span class=\"fa fa-plus\" aria-hidden=\"true\"></span>\n" +
    "<span class=\"icon-button-text\">Create Project</span>\n" +
    "</button>\n" +
    "</div>\n" +
    "<p>To learn more, visit the OpenShift <a target=\"_blank\" ng-href=\"{{'' | helpLink}}\">documentation</a>.</p>\n" +
    "<p class=\"projects-instructions\" ng-if=\"canCreate === false\" ng-include=\"'views/_cannot-create-project.html'\"></p>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/quota.html',
    "<div class=\"middle\">\n" +
    "<div class=\"middle-content\">\n" +
    "<div class=\"container-fluid\">\n" +
    "<alerts alerts=\"alerts\"></alerts>\n" +
    "<h1>\n" +
    "<span ng-if=\"clusterQuotas.length\">Cluster </span>Quota\n" +
    "<span class=\"page-header-link\">\n" +
    "<a ng-href=\"{{'quota' | helpLink}}\" target=\"_blank\">\n" +
    "Learn More <i class=\"fa fa-external-link\" aria-hidden=\"true\"></i>\n" +
    "</a>\n" +
    "</span>\n" +
    "</h1>\n" +
    "<div ng-if=\"!quotas.length && !clusterQuotas.length\" class=\"mar-top-xl\">\n" +
    "<div class=\"help-block\">{{quotaHelp}}</div>\n" +
    "<p><em ng-if=\"!quotas && !clusterQuotas\">Loading...</em><em ng-if=\"quotas || clusterQuotas\">There are no resource quotas set on this project.</em></p>\n" +
    "</div>\n" +
    "<div ng-repeat=\"quota in clusterQuotas | orderBy: 'metadata.name'\" class=\"gutter-bottom\">\n" +
    "<h2 ng-if=\"clusterQuotas.length\">{{quota.metadata.name}}</h2>\n" +
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
    "<div class=\"quota-charts\">\n" +
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
    "<table class=\"table table-bordered\">\n" +
    "<thead>\n" +
    "<th>Resource Type</th>\n" +
    "<th>Used (This Project)</th>\n" +
    "<th>Used (All Projects)</th>\n" +
    "<th>Max</th>\n" +
    "</thead>\n" +
    "<tbody>\n" +
    "<tr ng-if=\"!quota.status.total.used\" class=\"danger\">\n" +
    "<td colspan=\"4\">\n" +
    "<span data-toggle=\"tooltip\" title=\"Missing quota status\" class=\"pficon pficon-error-circle-o\" style=\"cursor: help\"></span>\n" +
    "Status has not been reported on this quota usage record. Any resources limited by this quota record can not be allocated.\n" +
    "</td>\n" +
    "</tr>\n" +
    "\n" +
    "<tr ng-repeat=\"resourceType in orderedTypesByClusterQuota[quota.metadata.name]\" ng-if=\"resourceType !== 'resourcequotas'\" ng-class=\"{\n" +
    "                        warning: isAtLimit(quota, resourceType),\n" +
    "                        disabled: (quota.status.total.hard[resourceType] || quota.spec.quota.hard[resourceType]) === '0'\n" +
    "                      }\">\n" +
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
    "<h1 ng-if=\"clusterQuotas.length && quotas.length\">Project Quota</h1>\n" +
    "<div ng-repeat=\"quota in quotas | orderBy: 'metadata.name'\" class=\"gutter-bottom\">\n" +
    "<h2 ng-if=\"quotas.length\">{{quota.metadata.name}}</h2>\n" +
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
    "<div class=\"quota-charts\">\n" +
    "<div ng-if=\"quota.status.hard.cpu\" class=\"mar-lg\">\n" +
    "<h3 class=\"text-center\">CPU <small>Request</small></h3>\n" +
    "<quota-usage-chart used=\"quota.status.used.cpu\" total=\"quota.status.hard.cpu\" type=\"cpu\" class=\"quota-chart\"></quota-usage-chart>\n" +
    "</div>\n" +
    "<div ng-if=\"quota.status.hard.memory\" class=\"mar-lg\">\n" +
    "<h3 class=\"text-center\">Memory <small>Request</small></h3>\n" +
    "<quota-usage-chart used=\"quota.status.used.memory\" total=\"quota.status.hard.memory\" type=\"memory\" class=\"quota-chart\"></quota-usage-chart>\n" +
    "</div>\n" +
    "<div ng-if=\"quota.status.hard['requests.cpu']\" class=\"mar-lg\">\n" +
    "<h3 class=\"text-center\">CPU <small>Request</small></h3>\n" +
    "<quota-usage-chart used=\"quota.status.used['requests.cpu']\" total=\"quota.status.hard['requests.cpu']\" type=\"cpu\" class=\"quota-chart\"></quota-usage-chart>\n" +
    "</div>\n" +
    "<div ng-if=\"quota.status.hard['requests.memory']\" class=\"mar-lg\">\n" +
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
    "<table class=\"table table-bordered\">\n" +
    "<thead>\n" +
    "<th>Resource Type</th>\n" +
    "<th>Used</th>\n" +
    "<th>Max</th>\n" +
    "</thead>\n" +
    "<tbody>\n" +
    "<tr ng-if=\"!quota.status.used\" class=\"danger\">\n" +
    "<td colspan=\"3\">\n" +
    "<span data-toggle=\"tooltip\" title=\"Missing quota status\" class=\"pficon pficon-error-circle-o\" style=\"cursor: help\"></span>\n" +
    "Status has not been reported on this quota usage record. Any resources limited by this quota record can not be allocated.\n" +
    "</td>\n" +
    "</tr>\n" +
    "\n" +
    "<tr ng-repeat=\"resourceType in orderedTypesByQuota[quota.metadata.name]\" ng-if=\"resourceType !== 'resourcequotas'\" ng-class=\"{\n" +
    "                        warning: isAtLimit(quota, resourceType),\n" +
    "                        disabled: (quota.status.hard[resourceType] || quota.spec.hard[resourceType]) === '0'\n" +
    "                      }\">\n" +
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
    "<div ng-if=\"!limitRanges.length\">\n" +
    "<div class=\"help-block\">{{limitRangeHelp}}</div>\n" +
    "<p><em>{{emptyMessageLimitRanges}}</em></p>\n" +
    "</div>\n" +
    "<div ng-repeat=\"limitRange in limitRanges\">\n" +
    "<h2 ng-if=\"limitRanges.length\">{{limitRange.metadata.name}}</h2>\n" +
    "<div ng-if=\"$first\" class=\"help-block mar-bottom-md\">{{limitRangeHelp}}</div>\n" +
    "<div class=\"table-responsive\">\n" +
    "<table class=\"table table-bordered\">\n" +
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
    "<tbody ng-repeat=\"limit in limitRange.spec.limits\">\n" +
    "<tr ng-repeat=\"(type, typeLimits) in limitsByType[limitRange.metadata.name][limit.type]\">\n" +
    "<td>{{limit.type}} {{type | computeResourceLabel : true}}</td>\n" +
    "<td>{{(typeLimits.min | usageWithUnits : type) || \"&mdash;\"}}</td>\n" +
    "<td>{{(typeLimits.max | usageWithUnits : type) || \"&mdash;\"}}</td>\n" +
    "<td>{{(typeLimits.defaultRequest | usageWithUnits : type) || \"&mdash;\"}}</td>\n" +
    "<td>{{(typeLimits[\"default\"] | usageWithUnits : type) || \"&mdash;\"}}</td>\n" +
    "<td>{{typeLimits.maxLimitRequestRatio || \"&mdash;\"}}</td>\n" +
    "</tr>\n" +
    "</tbody>\n" +
    "</table>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/secrets.html',
    "<div class=\"middle\">\n" +
    "<div class=\"middle-header\">\n" +
    "<div class=\"container-fluid\">\n" +
    "<div class=\"page-header page-header-bleed-right page-header-bleed-left\">\n" +
    "<div class=\"pull-right\" ng-if=\"project && (secretsVersion | canI : 'create') && secrets.length\">\n" +
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
    "<div ng-if=\"unfilteredSecrets\" class=\"data-toolbar\">\n" +
    "<div class=\"data-toolbar-filter\">\n" +
    "<project-filter></project-filter>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"middle-content\">\n" +
    "<div class=\"container-fluid\">\n" +
    "<div class=\"row\">\n" +
    "<div class=\"col-md-12\">\n" +
    "<div ng-if=\"(secrets | size) === 0\">\n" +
    "<p ng-if=\"!secretsLoaded\">\n" +
    "Loading...\n" +
    "</p>\n" +
    "<div ng-if=\"secretsLoaded\" class=\"empty-state-message text-center\">\n" +
    "<div ng-if=\"!filterWithZeroResults\">\n" +
    "<h2>No secrets.</h2>\n" +
    "<p>No secrets have been added to project {{projectName}}.</p>\n" +
    "<p ng-if=\"project && (secretsVersion | canI : 'create')\">\n" +
    "<a ng-href=\"project/{{project.metadata.name}}/create-secret\" class=\"btn btn-primary btn-lg\">Create Secret</a>\n" +
    "</p>\n" +
    "</div>\n" +
    "<div ng-if=\"filterWithZeroResults\">\n" +
    "<h2>The filter is hiding all secrets. <button type=\"button\" class=\"btn btn-link inline-btn-link\" ng-click=\"clearFilter()\">Clear All Filters</button></h2>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<table ng-if=\"(secrets | size) > 0\" class=\"table table-bordered table-mobile secrets-table table-layout-fixed\">\n" +
    "<colgroup>\n" +
    "<col class=\"col-sm-5\">\n" +
    "<col class=\"col-sm-5\">\n" +
    "<col class=\"col-sm-2\">\n" +
    "</colgroup>\n" +
    "<thead>\n" +
    "<tr>\n" +
    "<th>Name</th>\n" +
    "<th>Type</th>\n" +
    "<th>Created</th>\n" +
    "</tr>\n" +
    "</thead>\n" +
    "<tbody>\n" +
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
    "</div>"
  );


  $templateCache.put('views/service-instances.html',
    "<project-header class=\"top-header\"></project-header>\n" +
    "<project-page>\n" +
    "\n" +
    "<div class=\"middle-section\">\n" +
    "<div class=\"middle-container\">\n" +
    "<div class=\"middle-header header-toolbar\">\n" +
    "<div class=\"container-fluid\">\n" +
    "<div class=\"page-header page-header-bleed-right page-header-bleed-left\">\n" +
    "<h1>\n" +
    "Provisioned Services\n" +
    "</h1>\n" +
    "</div>\n" +
    "<div ng-if=\"(serviceInstances | size) > 0 || filterWithZeroResults\" class=\"data-toolbar\">\n" +
    "<div class=\"data-toolbar-filter\">\n" +
    "<project-filter></project-filter>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"middle-content\">\n" +
    "<div class=\"container-fluid\">\n" +
    "<div class=\"row\">\n" +
    "<div class=\"col-md-12\">\n" +
    "<div ng-if=\"(serviceInstances | hashSize) == 0\">\n" +
    "<p ng-if=\"!serviceInstancesLoaded\">\n" +
    "Loading...\n" +
    "</p>\n" +
    "<div ng-if=\"serviceInstancesLoaded\" class=\"empty-state-message text-center\">\n" +
    "<div ng-if=\"!filterWithZeroResults\">\n" +
    "<h2>No provisioned services.</h2>\n" +
    "<p>No provisioned services have been added to project {{projectName}}.</p>\n" +
    "</div>\n" +
    "<div ng-if=\"filterWithZeroResults\">\n" +
    "<h2>The filter is hiding all provisioned services. <button type=\"button\" class=\"btn btn-link inline-btn-link\" ng-click=\"clearFilter()\">Clear All Filters</button></h2>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<table ng-if=\"(serviceInstances | size) > 0\" class=\"table table-bordered table-mobile table-layout-fixed\">\n" +
    "<colgroup>\n" +
    "<col class=\"col-sm-3\">\n" +
    "</colgroup>\n" +
    "<thead>\n" +
    "<tr>\n" +
    "<th>Name</th>\n" +
    "<th>Instance Name</th>\n" +
    "<th>Status</th>\n" +
    "<th>Created</th>\n" +
    "<th>Bindings</th>\n" +
    "</tr>\n" +
    "</thead>\n" +
    "<tbody ng-if=\"(serviceInstances | size) > 0\">\n" +
    "<tr ng-repeat=\"serviceInstance in serviceInstances track by (serviceInstance | uid)\">\n" +
    "<td data-title=\"Name\">\n" +
    "<a ng-href=\"{{serviceInstance | navigateResourceURL}}\">{{serviceInstance | serviceInstanceDisplayName : getServiceClass(serviceInstance)}}</a>\n" +
    "</td>\n" +
    "<td data-title=\"Instance Name\"><span>{{serviceInstance.metadata.name}}</span></td>\n" +
    "<td data-title=\"Status\">\n" +
    "<div class=\"status\">\n" +
    "<status-icon status=\"serviceInstance | serviceInstanceStatus\" disable-animation></status-icon>\n" +
    "<span class=\"status-detail\">{{serviceInstance | serviceInstanceStatus | sentenceCase}}</span>\n" +
    "</div>\n" +
    "</td>\n" +
    "<td data-title=\"Created\">\n" +
    "<span am-time-ago=\"serviceInstance.metadata.creationTimestamp\" am-without-suffix=\"true\"></span> ago\n" +
    "</td>\n" +
    "<td data-title=\"Bindings\">\n" +
    "<div ng-if=\"bindingsByInstanceRef[serviceInstance.metadata.name].length\">\n" +
    "<div ng-if=\"firstBinding = bindingsByInstanceRef[serviceInstance.metadata.name][0]\">\n" +
    "<span ng-if=\"application = applicationsByBinding[firstBinding.metadata.name][0]\">\n" +
    "{{application.metadata.name}}\n" +
    "</span>\n" +
    "<span ng-if=\"!application\">\n" +
    "{{firstBinding.metadata.name}}\n" +
    "</span>\n" +
    "<ng-pluralize count=\"bindingsByInstanceRef[serviceInstance.metadata.name].length\" when=\"{'0':'', '1':'', '2':'and {} other', 'other':'and {} others'}\" offset=\"1\">\n" +
    "</ng-pluralize>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=\"!bindingsByInstanceRef[serviceInstance.metadata.name].length\">\n" +
    "No bindings\n" +
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


  $templateCache.put('views/services.html',
    "<div class=\"middle\">\n" +
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
    "<div ng-if=\"(services | hashSize) > 0 || filterWithZeroResults\" class=\"data-toolbar\">\n" +
    "<div class=\"data-toolbar-filter\">\n" +
    "<project-filter></project-filter>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"middle-content\">\n" +
    "<div class=\"container-fluid\">\n" +
    "<div class=\"row\">\n" +
    "<div class=\"col-md-12\">\n" +
    "<div ng-if=\"(services | hashSize) == 0\">\n" +
    "<p ng-if=\"!servicesLoaded\">\n" +
    "Loading...\n" +
    "</p>\n" +
    "<div ng-if=\"servicesLoaded\" class=\"empty-state-message text-center\">\n" +
    "<div ng-if=\"!filterWithZeroResults\">\n" +
    "<h2>No services.</h2>\n" +
    "<p>No services have been added to project {{projectName}}.</p>\n" +
    "</div>\n" +
    "<div ng-if=\"filterWithZeroResults\">\n" +
    "<h2>The filter is hiding all services. <button type=\"button\" class=\"btn btn-link inline-btn-link\" ng-click=\"clearFilter()\">Clear All Filters</button></h2>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<table ng-if=\"(services | hashSize) > 0\" class=\"table table-bordered table-mobile table-layout-fixed\">\n" +
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
    "<tbody>\n" +
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
    "</div>"
  );


  $templateCache.put('views/set-limits.html',
    "<div class=\"middle surface-shaded\">\n" +
    "<div class=\"middle-content\">\n" +
    "<div class=\"container-fluid\">\n" +
    "<div class=\"row\">\n" +
    "<div class=\"col-md-10\">\n" +
    "<breadcrumbs breadcrumbs=\"breadcrumbs\"></breadcrumbs>\n" +
    "<div ng-show=\"!containers.length\">Loading...</div>\n" +
    "<form ng-if=\"containers.length\" name=\"form\" class=\"set-limits-form\" novalidate>\n" +
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
    "<button class=\"btn btn-default btn-lg\" ng-click=\"cancel()\">Cancel</button>\n" +
    "</div>\n" +
    "</fieldset>\n" +
    "</form>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/storage.html',
    "<div class=\"middle\">\n" +
    "<div class=\"middle-header header-toolbar\">\n" +
    "<div class=\"container-fluid\">\n" +
    "<div class=\"page-header page-header-bleed-right page-header-bleed-left\">\n" +
    "<div class=\"pull-right\" ng-if=\"project && (persistentVolumeClaimsVersion | canI : 'create') && ((pvcs | hashSize) > 0 || filterWithZeroResults)\">\n" +
    "<a ng-if=\"!outOfClaims\" ng-href=\"project/{{project.metadata.name}}/create-pvc\" class=\"btn btn-default\">Create Storage</a>\n" +
    "<a ng-if=\"outOfClaims\" href=\"\" class=\"btn btn-default disabled\" aria-disabled=\"true\">Create Storage</a>\n" +
    "</div>\n" +
    "<h1>\n" +
    "Storage\n" +
    "<span class=\"page-header-link\">\n" +
    "<a ng-href=\"{{'storage' | helpLink}}\" target=\"_blank\">\n" +
    "Learn More <i class=\"fa fa-external-link\" aria-hidden=\"true\"></i>\n" +
    "</a>\n" +
    "</span>\n" +
    "</h1>\n" +
    "</div>\n" +
    "<div ng-if=\"(pvcs | hashSize) > 0 || filterWithZeroResults\" class=\"data-toolbar\">\n" +
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
    "<div ng-if=\"(pvcs | hashSize) === 0\">\n" +
    "<p ng-if=\"!pvcsLoaded\">\n" +
    "Loading...\n" +
    "</p>\n" +
    "<div ng-if=\"pvcsLoaded\" class=\"empty-state-message text-center\">\n" +
    "<div ng-if=\"!filterWithZeroResults\">\n" +
    "<h2>No persistent volume claims.</h2>\n" +
    "<p>\n" +
    "No persistent volume claims have been added to project {{projectName}}.\n" +
    "</p>\n" +
    "<p ng-if=\"project && (persistentVolumeClaimsVersion | canI : 'create') && !filterWithZeroResults\">\n" +
    "<a ng-if=\"!outOfClaims\" ng-href=\"project/{{project.metadata.name}}/create-pvc\" class=\"btn btn-primary\">Create Storage</a>\n" +
    "<a ng-if=\"outOfClaims\" href=\"\" class=\"btn btn-primary disabled\" aria-disabled=\"true\">Create Storage</a>\n" +
    "</p>\n" +
    "</div>\n" +
    "<div ng-if=\"filterWithZeroResults\">\n" +
    "<h2>The filter is hiding all persistent volume claims. <button type=\"button\" class=\"btn btn-link inline-btn-link\" ng-click=\"clearFilter()\">Clear All Filters</button></h2>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<table ng-if=\"(pvcs | hashSize) > 0\" class=\"table table-bordered table-mobile table-layout-fixed\">\n" +
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
    "<tbody>\n" +
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
    "</div>"
  );


  $templateCache.put('views/util/error.html',
    "<div class=\"middle surface-shaded\">\n" +
    "<div class=\"container\">\n" +
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
    "</div>"
  );


  $templateCache.put('views/util/logout.html',
    "<div class=\"middle surface-shaded\">\n" +
    "<div class=\"container\">\n" +
    "<div>\n" +
    "<h1>Log out</h1>\n" +
    "<div ng-bind-html=\"logoutMessage\"></div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('views/util/oauth.html',
    "<div class=\"middle surface-shaded\">\n" +
    "<div class=\"container\">\n" +
    "<div ng-if=\"!confirmUser\">\n" +
    "<h1>Logging in&hellip;</h1>\n" +
    "<p>Please wait while you are logged in&hellip;</p>\n" +
    "</div>\n" +
    "<div ng-if=\"confirmUser && !overriddenUser\">\n" +
    "<h1>Confirm Login</h1>\n" +
    "<p>You are being logged in as <code>{{confirmUser.metadata.name}}</code>.</p>\n" +
    "<button class=\"btn btn-lg btn-primary\" type=\"button\" ng-click=\"completeLogin();\">Continue</button>\n" +
    "<button class=\"btn btn-lg btn-default\" type=\"button\" ng-click=\"cancelLogin();\">Cancel</button>\n" +
    "</div>\n" +
    "<div ng-if=\"confirmUser && overriddenUser\">\n" +
    "<h1>Confirm User Change</h1>\n" +
    "<p>You are about to change users from <code>{{overriddenUser.metadata.name}}</code> to <code>{{confirmUser.metadata.name}}</code>.</p>\n" +
    "<p>If this is unexpected, click Cancel. This could be an attempt to trick you into acting as another user.</p>\n" +
    "<button class=\"btn btn-lg btn-danger\" type=\"button\" ng-click=\"completeLogin();\">Switch Users</button>\n" +
    "<button class=\"btn btn-lg btn-primary\" type=\"button\" ng-click=\"cancelLogin();\">Cancel</button>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('components/alerts/alerts.html',
    "<div ng-attr-row=\"{{$ctrl.toast}}\" ng-attr-wrap=\"{{$ctrl.toast}}\">\n" +
    "<div ng-repeat=\"(alertID, alert) in ($ctrl.alerts | filterCollection : $ctrl.filter) track by (alertID + (alert.message || alert.details))\" ng-if=\"!alert.hidden\" class=\"alert-wrapper animate-repeat\" ng-class=\"{'animate-slide': $ctrl.animateSlide}\">\n" +
    "<div class=\"alert word-break\" ng-class=\"{ 'alert-danger': alert.type === 'error', 'alert-warning': alert.type === 'warning', 'alert-success': alert.type === 'success', 'alert-info': !alert.type || alert.type === 'info', 'toast-pf': $ctrl.toast, 'mar-left-sm': $ctrl.toast}\">\n" +
    "<button ng-if=\"!$ctrl.hideCloseButton\" ng-click=\"$ctrl.close(alert)\" type=\"button\" class=\"close\">\n" +
    "<span class=\"pficon pficon-close\" aria-hidden=\"true\"></span>\n" +
    "<span class=\"sr-only\">Close</span>\n" +
    "</button>\n" +
    "<span class=\"pficon\" aria-hidden=\"true\" ng-class=\"{'pficon-error-circle-o': alert.type === 'error', 'pficon-warning-triangle-o': alert.type === 'warning', 'pficon-ok': alert.type === 'success','pficon-info': !alert.type || alert.type === 'info'}\"></span>\n" +
    "<span class=\"sr-only\">{{alert.type}}</span>\n" +
    "<span ng-if=\"alert.message\" style=\"margin-right: 5px\" ng-class=\"{'strong': !$ctrl.toast}\">{{alert.message}}</span><span ng-if=\"alert.details\">{{alert.details}}</span>\n" +
    "<span ng-repeat=\"link in alert.links\">\n" +
    "<a ng-if=\"!link.href\" href=\"\" ng-click=\"$ctrl.onClick(alert, link)\" role=\"button\" ng-attr-target=\"{{link.target}}\">{{link.label}}</a>\n" +
    "<a ng-if=\"link.href\" href=\"{{link.href}}\" ng-click=\"$ctrl.onClick(alert, link)\" ng-attr-target=\"{{link.target}}\">{{link.label}}</a>\n" +
    "<span ng-if=\"!$last\" class=\"action-divider\">|</span>\n" +
    "</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('components/istag-select/istag-select.html',
    "<ng-form name=\"istagForm\">\n" +
    "<fieldset ng-disabled=\"$ctrl.selectDisabled\">\n" +
    "<div class=\"row\">\n" +
    "<div class=\"form-group col-sm-4\">\n" +
    "<label class=\"sr-only\">Namespace</label>\n" +
    "<ui-select ng-required=\"$ctrl.selectRequired\" ng-model=\"$ctrl.istag.namespace\" ng-disabled=\"$ctrl.selectDisabled\" ng-change=\"$ctrl.namespaceChanged($ctrl.istag.namespace)\" append-to-body=\"$ctrl.appendToBody\">\n" +
    "<ui-select-match placeholder=\"Namespace\">{{$select.selected}}</ui-select-match>\n" +
    "<ui-select-choices repeat=\"namespace in ($ctrl.namespaces | filter : $select.search)\">\n" +
    "<div ng-bind-html=\"namespace | highlight : $select.search\"></div>\n" +
    "</ui-select-choices>\n" +
    "</ui-select>\n" +
    "<div class=\"istag-separator\">/</div>\n" +
    "</div>\n" +
    "<div class=\"form-group col-sm-4\">\n" +
    "<label class=\"sr-only\">Image Stream</label>\n" +
    "<ui-select ng-required=\"$ctrl.selectRequired\" ng-model=\"$ctrl.istag.imageStream\" ng-disabled=\"!$ctrl.istag.namespace || $ctrl.selectDisabled\" ng-change=\"$ctrl.istag.tagObject = null\" append-to-body=\"$ctrl.appendToBody\">\n" +
    "<ui-select-match placeholder=\"Image Stream\">{{$select.selected}}</ui-select-match>\n" +
    "<ui-select-choices repeat=\"imageStream in ($ctrl.isNamesByNamespace[$ctrl.istag.namespace] | filter : $select.search)\">\n" +
    "<div ng-bind-html=\"imageStream | highlight : $select.search\"></div>\n" +
    "</ui-select-choices>\n" +
    "</ui-select>\n" +
    "<div class=\"istag-separator\">:</div>\n" +
    "</div>\n" +
    "<div class=\"form-group col-sm-4\">\n" +
    "<label class=\"sr-only\">Tag</label>\n" +
    "<ui-select ng-required=\"$ctrl.selectRequired\" ng-model=\"$ctrl.istag.tagObject\" ng-disabled=\"!$ctrl.istag.imageStream || $ctrl.selectDisabled\" append-to-body=\"$ctrl.appendToBody\">\n" +
    "<ui-select-match placeholder=\"Tag\">{{$select.selected.tag}}</ui-select-match>\n" +
    "<ui-select-choices group-by=\"$ctrl.groupTags\" repeat=\"statusTag in ($ctrl.isByNamespace[$ctrl.istag.namespace][$ctrl.istag.imageStream].status.tags | filter : { tag: $select.search })\" refresh=\"$ctrl.getTags($select.search)\" refresh-delay=\"200\">\n" +
    "<div ng-bind-html=\"statusTag.tag | highlight : $select.search\"></div>\n" +
    "</ui-select-choices>\n" +
    "</ui-select>\n" +
    "</div>\n" +
    "</div>\n" +
    "</fieldset>\n" +
    "</ng-form>"
  );


  $templateCache.put('components/osc-webhook-triggers/osc-webhook-triggers.html',
    "<ng-form name=\"$ctrl.secretsForm\" class=\"add-webhook\">\n" +
    "<div ng-repeat=\"trigger in $ctrl.webhookTriggers track by $index\" ng-init=\"secretFieldName = 'triggerSecretRef' + $index\" class=\"form-group\">\n" +
    "<div class=\"row form-row-has-controls\">\n" +
    "<div class=\"select-webhook-type col-xs-6\">\n" +
    "<ui-select ng-model=\"trigger.data.type\" name=\"triggerType{{$index}}\" ng-disabled=\"$ctrl.isDeprecated(trigger)\" on-select=\"$ctrl.triggerTypeChange(trigger)\" search-enabled=\"false\" title=\"Select a webhook type\" ng-class=\"{'has-warning': trigger.isDuplicate }\" focus-on=\"focus-index-{{$index}}\">\n" +
    "<ui-select-match placeholder=\"Webhook type\">\n" +
    "{{ $select.selected.label }}\n" +
    "</ui-select-match>\n" +
    "<ui-select-choices repeat=\"option.label as option in $ctrl.webhookTypesOptions\">\n" +
    "{{ option.label }}\n" +
    "</ui-select-choices>\n" +
    "</ui-select>\n" +
    "</div>\n" +
    "<div class=\"select-secret-ref col-xs-6\" ng-if=\"!$ctrl.isDeprecated(trigger)\">\n" +
    "<ui-select ng-model=\"trigger.data[trigger.data.type.toLowerCase()].secretReference.name\" name=\"{{secretFieldName}}\" on-select=\"$ctrl.triggerSecretChange(trigger)\" title=\"Select a webhook secret reference\" ng-class=\"{'has-error': $ctrl.secretsForm[secretFieldName].$invalid && $ctrl.secretsForm[secretFieldName].$touched}\" ng-disabled=\"!trigger.data.type\" ng-required=\"trigger.data.type\">\n" +
    "<ui-select-match placeholder=\"Webhook secret reference\">\n" +
    "{{ $select.selected.metadata.name }}\n" +
    "</ui-select-match>\n" +
    "<ui-select-choices repeat=\"webhookSecret.metadata.name as webhookSecret in ($ctrl.webhookSecrets | filter : $select.search) track by (webhookSecret | uid)\">\n" +
    "<div ng-bind-html=\"webhookSecret.metadata.name | highlight : $select.search\"></div>\n" +
    "</ui-select-choices>\n" +
    "</ui-select>\n" +
    "<div class=\"has-error select-secret-ref\" ng-show=\"$ctrl.secretsForm[secretFieldName].$invalid && $ctrl.secretsForm[secretFieldName].$touched\">\n" +
    "<span class=\"help-block\">\n" +
    "Secret reference is required.\n" +
    "</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"select-secret-ref deprecated-secret input-group col-xs-6\" ng-if=\"$ctrl.isDeprecated(trigger)\">\n" +
    "<input ng-model=\"trigger.data[trigger.data.type.toLowerCase()].secret\" class=\"form-control\" type=\"{{trigger.secretInputType}}\" autocorrect=\"off\" autocapitalize=\"none\" spellcheck=\"false\" disabled=\"disabled\">\n" +
    "<div class=\"input-group-btn\">\n" +
    "<button type=\"button\" class=\"btn btn-default toggle\" title=\"Toggle Token Visibility\" aria-label=\"Toggle Token Visibility\" ng-click=\"$ctrl.toggleSecretInputType(trigger)\">\n" +
    "<span class=\"glyphicon glyphicon-eye-open\" aria-hidden=\"true\"></span>\n" +
    "<span class=\"sr-only\">Toggle Token Visibility</span>\n" +
    "</button>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"form-row-controls\">\n" +
    "<button ng-click=\"$ctrl.removeWebhookTrigger(trigger, $index)\" type=\"button\" class=\"btn-remove close\" aria-hidden=\"true\">\n" +
    "<span class=\"pficon pficon-close\" aria-hidden=\"true\"></span>\n" +
    "<span class=\"sr-only\">Remove Webhook trigger</span>\n" +
    "</button>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"has-warning\" ng-if=\"trigger.isDuplicate\">\n" +
    "<span class=\"help-block\">A {{trigger.data.type}} webhook trigger referencing the secret {{(trigger | getWebhookSecretData).secretReference.name}} already exists.</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"form-group-actions\">\n" +
    "<button class=\"btn btn-link pad-left-none\" type=\"button\" ng-click=\"$ctrl.addEmptyWebhookTrigger()\">Add Webhook</button>\n" +
    "<span ng-if=\"$ctrl.secretsVersion | canI : 'create'\">\n" +
    "<span class=\"action-divider\" aria-hidden=\"true\">|</span>\n" +
    "<button class=\"btn btn-link\" href=\"\" type=\"button\" ng-click=\"$ctrl.openCreateWebhookSecretModal()\">Create New Webhook Secret</button>\n" +
    "</span>\n" +
    "</div>\n" +
    "</ng-form>"
  );

}]);
