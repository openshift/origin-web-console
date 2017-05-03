'use strict';

(function() {

  angular.module('openshiftConsole').component('unbindService', {
    controller: [
      '$filter',
      'BindingModalUtils',
      'DataService',
      'ServiceInstancesService',
      UnbindService
    ],
    controllerAs: 'ctrl',
    bindings: {
      target: '<',
      bindings: '<',
      onClose: '<'
    },
    templateUrl: 'views/directives/unbind-service.html'
  });

  function UnbindService($filter, BindingModalUtils, DataService, ServiceInstancesService) {
    var ctrl = this;
    var context;
    var getDisplayName = ServiceInstancesService.getDisplayName;
    // var sortApplications = BindingModalUtils.sortApplications;
    // TODO: once we have podPreset
    // var deploymentConfigs, deployments, replicationControllers, replicaSets, statefulSets;


    // TODO: once we have podPreset we will be able to associate the
    // binding to the application being bound to.
    // var loadApps = function() {
    //   // Load all the "application" types
    //   DataService.list('deploymentconfigs', context).then(function(deploymentConfigData) {
    //     deploymentConfigs = _.toArray(deploymentConfigData.by('metadata.name'));
    //     ctrl.applications = sortApplications(deploymentConfigs, deployments, replicationControllers, replicaSets, statefulSets);
    //   });
    //   DataService.list('replicationcontrollers', context).then(function(replicationControllerData) {
    //     replicationControllers = _.reject(replicationControllerData.by('metadata.name'), $filter('hasDeploymentConfig'));
    //     ctrl.applications = sortApplications(deploymentConfigs, deployments, replicationControllers, replicaSets, statefulSets);
    //   });
    //   DataService.list({
    //     group: 'extensions',
    //     resource: 'deployments'
    //   }, context).then(function(deploymentData) {
    //     deployments = _.toArray(deploymentData.by('metadata.name'));
    //     ctrl.applications = sortApplications(deploymentConfigs, deployments, replicationControllers, replicaSets, statefulSets);
    //   });
    //   DataService.list({
    //     group: 'extensions',
    //     resource: 'replicasets'
    //   }, context).then(function(replicaSetData) {
    //     replicaSets = _.reject(replicaSetData.by('metadata.name'), $filter('hasDeployment'));
    //     ctrl.applications = sortApplications(deploymentConfigs, deployments, replicationControllers, replicaSets, statefulSets);
    //   });
    //   DataService.list({
    //     group: 'apps',
    //     resource: 'statefulsets'
    //   }, context).then(function(statefulSetData) {
    //     statefulSets = _.toArray(statefulSetData.by('metadata.name'));
    //     ctrl.applications = sortApplications(deploymentConfigs, deployments, replicationControllers, replicaSets, statefulSets);
    //   });
    // };

    var unbindService = function() {
      DataService.delete({
        group: 'servicecatalog.k8s.io',
        resource: 'bindings'
      }, ctrl.selectedBinding, context).then(_.noop, function(err) {
        ctrl.error = err;
      });
    };

    var showService = function() {
      ctrl.nextTitle = 'Unbind';
    };

    var showConfirm = function() {
      ctrl.nextTitle = 'Close';
      ctrl.wizardComplete = true;
      unbindService();
    };

    ctrl.$onInit = function() {
      // loadApps();
      ctrl.displayName = getDisplayName(ctrl.target);
      ctrl.steps = [{
        id: 'service',
        label: 'Service',
        view: 'views/directives/bind-service/select-binding.html',
        onShow: showService
      }, {
        id: 'confirmation',
        label: 'Confirmation',
        view: 'views/directives/bind-service/remove-binding-confirm.html',
        onShow: showConfirm
      }];

      context = {
        namespace: _.get(ctrl.target, 'metadata.namespace')
      };
    };

    ctrl.closeWizard = function() {
      if (_.isFunction(ctrl.onClose)) {
        ctrl.onClose();
      }
    };
  }

})();
