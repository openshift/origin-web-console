'use strict';

angular
  .module('openshiftConsole')
  .filter('canIDoAny', function(APIService, canIFilter, KubevirtVersions) {
    // Top level keys are representing pages.
    // Within each page may one or more resources.
    // canIDoAny returns truthy if the user passes the canIFilter
    // for at least one of the resources and verbs listed in the page.
    var pageRulesMap = {
      'buildConfigs': [
        {group: '', resource: 'buildconfigs',             verbs: ['delete', 'update']},
        {group: '', resource: 'buildconfigs/instantiate', verbs: ['create']}
      ],
      'builds': [
        _.assign({}, APIService.getPreferredVersion('builds/clone'), {verbs: ['create']}),
        _.assign({}, APIService.getPreferredVersion('builds'), {verbs: ['delete', 'update']})
      ],
      'configmaps': [
        {group: '', resource: 'configmaps', verbs: ['update', 'delete']}
      ],
      'deployments': [
        _.assign({}, APIService.getPreferredVersion('horizontalpodautoscalers'), {verbs: ['create', 'update']}),
        _.assign({}, APIService.getPreferredVersion('deployments'), {verbs: ['update', 'delete']})
      ],
      'deploymentConfigs': [
        _.assign({}, APIService.getPreferredVersion('horizontalpodautoscalers'), {verbs: ['create', 'update']}),
        _.assign({}, APIService.getPreferredVersion('deploymentconfigs'), {verbs: ['create', 'update']})
      ],
      'horizontalPodAutoscalers': [
        {group: 'autoscaling', resource: 'horizontalpodautoscalers', verbs: ['update', 'delete']}
      ],
      'imageStreams': [
        _.assign({}, APIService.getPreferredVersion('imagestreams'), {verbs: ['update', 'delete']})
      ],
      'serviceInstances': [
        _.assign({}, APIService.getPreferredVersion('serviceinstances'), {verbs: ['update', 'delete']})
      ],
      'persistentVolumeClaims': [
        {group: '', resource: 'persistentvolumeclaims', verbs: ['update', 'delete']}
      ],
      'pods': [
        {group: '', resource: 'pods',              verbs: ['update', 'delete']},
        {group: '', resource: 'deploymentconfigs', verbs: ['update']}
      ],
      'replicaSets': [
        {group: 'autoscaling', resource: 'horizontalpodautoscalers', verbs: ['create', 'update']},
        {group: 'extensions',  resource: 'replicasets',              verbs: ['update', 'delete']}
      ],
      'replicationControllers': [
        {group: '',           resource: 'replicationcontrollers',   verbs: ['update', 'delete']}
      ],
      'routes': [
        {group: '', resource: 'routes', verbs: ['update', 'delete']}
      ],
      'services': [
        {group: '', resource: 'services', verbs: ['update', 'create', 'delete']}
      ],
      'secrets': [
        {group: '', resource: 'secrets', verbs: ['update', 'delete']}
      ],
      'projects': [
        {group: '', resource: 'projects', verbs: ['delete', 'update']}
      ],
      // FIXME: inconsistent case (camel)
      'statefulsets': [
        {group: 'apps', resource: 'statefulsets', verbs: ['update', 'delete']}
      ],
      'virtualMachineInstances': [
        {group: KubevirtVersions.virtualMachineInstance.group, resource: KubevirtVersions.virtualMachineInstance.resource, verbs: ['update', 'delete']}
      ],
      'virtualMachines': [
        {group: KubevirtVersions.virtualMachine.group, resource: KubevirtVersions.virtualMachine.resource, verbs: ['update', 'delete']}
      ]
    };

    // the primary key is the page name, NOT the actual resource, though they appear to match.
    return function(pageName) {
      return _.some(pageRulesMap[pageName], function(rule) {
        return _.some(rule.verbs, function(verb) {
          return canIFilter({resource: rule.resource, group: rule.group}, verb);
        });
      });
    };
  })
  .filter('canIScale', function(canIFilter, hasDeploymentConfigFilter, DeploymentsService) {
    return function(object) {
      var resourceGroupVersion = DeploymentsService.getScaleResource(object);
      return canIFilter(resourceGroupVersion, 'update');
    };
  });
