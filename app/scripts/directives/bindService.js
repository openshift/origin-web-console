'use strict';

angular.module('openshiftConsole').component('bindService', {
  controller: [
    '$filter',
    'DataService',
    'DNS1123_SUBDOMAIN_VALIDATION',
    BindService
  ],
  controllerAs: 'ctrl',
  bindings: {
    target: '<',
    onClose: '<'
  },
  templateUrl: 'views/directives/bind-service.html'
});

function BindService($filter,
                     DataService,
                     DNS1123_SUBDOMAIN_VALIDATION) {
  var ctrl = this;

  var statusCondition = $filter('statusCondition');
  var preselectService = function(){
    var newestReady;
    var newestNotReady;
    _.each(ctrl.serviceInstances, function(instance) {
      var ready = _.get(statusCondition(instance, 'Ready'), 'status') === 'True';
      if (ready && (!newestReady || instance.metadata.creationTimestamp > newestReady.metadata.creationTimestamp)) {
        newestReady = instance;
      }
      if (!ready && (!newestNotReady || instance.metadata.creationTimestamp > newestNotReady.metadata.creationTimestamp)) {
        newestNotReady = instance;
      }
    });
    ctrl.serviceToBind = _.get(newestReady, 'metadata.name') || _.get(newestNotReady, 'metadata.name');
  };

  var sortServiceInstances = function() {
    // wait till both service instances and service classes are available so that the sort is stable and items dont jump around
    if (ctrl.serviceClasses && ctrl.serviceInstances) {
      var instances = _.toArray(ctrl.serviceInstances);
      instances.sort(function(left, right) {
        var leftName = _.get(ctrl.serviceClasses, [left.spec.serviceClassName, 'osbMetadata', 'displayName']) || left.spec.serviceClassName;
        var rightName = _.get(ctrl.serviceClasses, [left.spec.serviceClassName, 'osbMetadata', 'displayName']) || right.spec.serviceClassName;

        // Fall back to sorting by `metadata.name` if the display names are the
        // same so that the sort is stable.
        if (leftName === rightName) {
          leftName = _.get(left, 'metadata.name', '');
          rightName = _.get(right, 'metadata.name', '');
        }

        return leftName.localeCompare(rightName);
      });
      ctrl.orderedServiceInstances = instances;
    }
  };


  var deploymentConfigs, deployments, replicationControllers, replicaSets, statefulSets;
  var sortApplications = function() {
    // Don't waste time sorting on each data load, just sort when we have them all
    if (deploymentConfigs && deployments && replicationControllers && replicaSets && statefulSets) {
      var apiObjects = deploymentConfigs.concat(deployments)
                                        .concat(replicationControllers)
                                        .concat(replicaSets)
                                        .concat(statefulSets);
      ctrl.applications = _.sortByAll(apiObjects, ['metadata.name', 'kind']);
    }
  };

  ctrl.$onInit = function() {
    ctrl.steps = [];
    if (ctrl.target.kind === 'Instance') {
      ctrl.steps.push({
        id: 'applications',
        label: 'Applications',
        view: 'views/directives/bind-service/select-application.html'
      });
    }
    else {
      ctrl.steps.push({
        id: 'services',
        label: 'Services',
        view: 'views/directives/bind-service/select-service.html'
      });
    }
    ctrl.steps.push({
      label: 'Results',
      id: 'results',
      view: 'views/directives/bind-service/results.html'
    });


    var context = {
      namespace: _.get(ctrl.target, 'metadata.namespace')
    };
    // We will want ServiceClasses either way for display purposes
    DataService.list({
      group: 'servicecatalog.k8s.io',
      resource: 'serviceclasses'
    }, {}).then(function(serviceClasses) {
      ctrl.serviceClasses = serviceClasses.by('metadata.name');
      sortServiceInstances();
    });

    // TODO is it ever realistically possible for target to not be defined at this point
    if (ctrl.target.kind === 'Instance') {
      ctrl.shouldBindToApp = "true";
      ctrl.serviceToBind = ctrl.target.metadata.name;
      // Load all the "application" types
      DataService.list('deploymentconfigs', context).then(function(deploymentConfigData) {
        deploymentConfigs = _.toArray(deploymentConfigData.by('metadata.name'));
        sortApplications();
      });
      DataService.list('replicationcontrollers', context).then(function(replicationControllerData) {
        replicationControllers = _.reject(replicationControllerData.by('metadata.name'), $filter('hasDeploymentConfig'));
        sortApplications();
      });
      DataService.list({
        group: 'extensions',
        resource: 'deployments'
      }, context).then(function(deploymentData) {
        deployments = _.toArray(deploymentData.by('metadata.name'));
        sortApplications();
      });
      DataService.list({
        group: 'extensions',
        resource: 'replicasets'
      }, context).then(function(replicaSetData) {
        replicaSets = _.reject(replicaSetData.by('metadata.name'), $filter('hasDeployment'));
        sortApplications();
      });
      DataService.list({
        group: 'apps',
        resource: 'statefulsets'
      }, context).then(function(statefulSetData) {
        statefulSets = _.toArray(statefulSetData.by('metadata.name'));
        sortApplications();
      });
    }
    else {
      DataService.list({
        group: 'servicecatalog.k8s.io',
        resource: 'instances'
      }, context).then(function(instances) {
        ctrl.serviceInstances = instances.by('metadata.name');
        if (!ctrl.serviceToBind) {
          preselectService();
        }
        sortServiceInstances();
      });
    }
    // TODO: handle not having any service instances when binding app to service
    ctrl.gotoStep(ctrl.steps[0]);
  };

  var humanizeKind = $filter('humanizeKind');
  ctrl.groupByKind = function(object) {
    return humanizeKind(object.kind);
  };

  var gotoStepID = function(id) {
    var step = _.find(ctrl.steps, { id: id });
    ctrl.gotoStep(step);
  };

  ctrl.gotoStep = function(step) {
    _.each(ctrl.steps, function(st) {
      st.selected = false;
    });
    if (ctrl.currentStep) {
      ctrl.currentStep.visited = true;
    }
    ctrl.currentStep = step;
    ctrl.currentStep.selected = true;
  };

  ctrl.stepClick = function(step) {
    // Prevent returning to previous steps if the order is complete.
    if (ctrl.wizardComplete) {
      return;
    }

    if (!step.visited) {
      return;
    }

    ctrl.gotoStep(step);
  };

  var generateName = $filter('generateName');
  var makeBinding = function() {
    var serviceInstanceName = ctrl.serviceToBind;
    // TODO - would be better if generateName could take in an optional maxlength
    var truncatedSvcInstanceName = _.trunc(serviceInstanceName, DNS1123_SUBDOMAIN_VALIDATION.maxlength - 6);
    ctrl.generatedSecretName = generateName(truncatedSvcInstanceName + '-');
    var binding = {
      kind: 'Binding',
      apiVersion: 'servicecatalog.k8s.io/v1alpha1',
      metadata: {
        generateName: serviceInstanceName + '-'
      },
      spec: {
        instanceRef: {
          name: serviceInstanceName
        },
        secretName: ctrl.generatedSecretName
      }
    };

    return binding;
  };

  ctrl.bindService = function() {
    var svcToBind = ctrl.target.kind === 'Instance' ? ctrl.target : ctrl.serviceInstances[ctrl.serviceToBind];
    var context = {
      namespace: _.get(svcToBind, 'metadata.namespace')
    };
    DataService.create({
      group: 'servicecatalog.k8s.io',
      resource: 'bindings'
    }, null, makeBinding(), context).then(function(binding) {
      ctrl.binding = binding;

      DataService.watchObject({
        group: 'servicecatalog.k8s.io',
        resource: 'bindings'
      }, _.get(ctrl.binding, 'metadata.name'), context, function(binding) {
        ctrl.binding = binding;
      });

      ctrl.wizardComplete = true;
      ctrl.error = null;
      gotoStepID('results');
    }, function(e) {
      ctrl.error = e;
    });
  };

  ctrl.closeWizard = function() {
    if (_.isFunction(ctrl.onClose)) {
      ctrl.onClose();
    }
  };

}
