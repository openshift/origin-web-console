'use strict';

(function() {
  angular.module('openshiftConsole').component('bindService', {
    controller: [
      '$scope',
      '$filter',
      'DataService',
      'BindingService',
      'BindingModalUtils',
      BindService
    ],
    controllerAs: 'ctrl',
    bindings: {
      target: '<',
      onClose: '<'
    },
    templateUrl: 'views/directives/bind-service.html'
  });

  function BindService($scope,
                       $filter,
                       DataService,
                       BindingService,
                       BindingModalUtils) {
    var ctrl = this;
    var validityWatcher;
    var bindingWatch;
    var statusCondition = $filter('statusCondition');
    var sortApplications = BindingModalUtils.sortApplications;
    var deploymentConfigs, deployments, replicationControllers, replicaSets, statefulSets;

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
        ctrl.orderedServiceInstances = _.sortByAll(ctrl.serviceInstances,
          function(item) {
            return _.get(ctrl.serviceClasses, [item.spec.serviceClassName, 'osbMetadata', 'displayName']) || item.spec.serviceClassName;
          },
          function(item) {
            return _.get(item, 'metadata.name', '');
          }
        );
      }
    };

    var showBind = function() {
      ctrl.nextTitle = 'Bind';

      validityWatcher = $scope.$watch("ctrl.selectionForm.$valid", function(isValid) {
        ctrl.steps[0].valid = isValid;
      });
    };

    var showResults = function() {
      if (validityWatcher) {
        validityWatcher();
        validityWatcher = undefined;
      }
      ctrl.nextTitle = "Close";
      ctrl.wizardComplete = true;

      ctrl.bindService();
    };


    var loadApplications = function() {
      var context = {
        namespace: _.get(ctrl.target, 'metadata.namespace')
      };

      // Load all the "application" types
      DataService.list('deploymentconfigs', context).then(function(deploymentConfigData) {
        deploymentConfigs = _.toArray(deploymentConfigData.by('metadata.name'));
        ctrl.applications = sortApplications(deploymentConfigs, deployments, replicationControllers, replicaSets, statefulSets);
      });
      DataService.list('replicationcontrollers', context).then(function(replicationControllerData) {
        replicationControllers = _.reject(replicationControllerData.by('metadata.name'), $filter('hasDeploymentConfig'));
        ctrl.applications = sortApplications(deploymentConfigs, deployments, replicationControllers, replicaSets, statefulSets);
      });
      DataService.list({
        group: 'extensions',
        resource: 'deployments'
      }, context).then(function(deploymentData) {
        deployments = _.toArray(deploymentData.by('metadata.name'));
        ctrl.applications = sortApplications(deploymentConfigs, deployments, replicationControllers, replicaSets, statefulSets);
      });
      DataService.list({
        group: 'extensions',
        resource: 'replicasets'
      }, context).then(function(replicaSetData) {
        replicaSets = _.reject(replicaSetData.by('metadata.name'), $filter('hasDeployment'));
        ctrl.applications = sortApplications(deploymentConfigs, deployments, replicationControllers, replicaSets, statefulSets);
      });
      DataService.list({
        group: 'apps',
        resource: 'statefulsets'
      }, context).then(function(statefulSetData) {
        statefulSets = _.toArray(statefulSetData.by('metadata.name'));
        ctrl.applications = sortApplications(deploymentConfigs, deployments, replicationControllers, replicaSets, statefulSets);
      });
    };

    var loadServiceInstances = function() {
      var context = {
        namespace: _.get(ctrl.target, 'metadata.namespace')
      };

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
    };

    ctrl.$onInit = function() {
      ctrl.serviceSelection = {};
      var formStepLabel = (ctrl.target.kind === 'Instance') ? 'Applications' : 'Services';

      ctrl.steps = [
        {
          id: 'bindForm',
          label: formStepLabel,
          view: 'views/directives/bind-service/bind-service-form.html',
          valid: true,
          onShow: showBind
        },
        {
          label: 'Results',
          id: 'results',
          view: 'views/directives/bind-service/results.html',
          valid: true,
          onShow: showResults
        }
      ];

      // We will want ServiceClasses either way for display purposes
      DataService.list({
        group: 'servicecatalog.k8s.io',
        resource: 'serviceclasses'
      }, {}).then(function(serviceClasses) {
        ctrl.serviceClasses = serviceClasses.by('metadata.name');
        if (ctrl.target.kind === 'Instance') {
          ctrl.serviceClass = ctrl.serviceClasses[ctrl.target.spec.serviceClassName];
          ctrl.serviceClassName = ctrl.target.spec.serviceClassName;
        }
        sortServiceInstances();
      });

      if (ctrl.target.kind === 'Instance') {
        ctrl.bindType = "secret-only";
        ctrl.appToBind = null;
        ctrl.serviceToBind = ctrl.target.metadata.name;
        loadApplications();
      }
      else {
        ctrl.bindType = 'application';
        ctrl.appToBind = ctrl.target;
        loadServiceInstances();
      }
    };

    ctrl.$onDestroy = function() {
      if (validityWatcher) {
        validityWatcher();
        validityWatcher = undefined;
      }
      if (bindingWatch) {
        DataService.unwatch(bindingWatch);
      }
    };

    ctrl.bindService = function() {
      var svcToBind = ctrl.target.kind === 'Instance' ? ctrl.target : ctrl.serviceInstances[ctrl.serviceToBind];
      var application = ctrl.bindType === 'application' ? ctrl.appToBind : undefined;

      var context = {
        namespace: _.get(svcToBind, 'metadata.namespace')
      };

      BindingService.bindService(context, _.get(svcToBind, 'metadata.name'), application).then(function(binding){
        ctrl.binding = binding;
        ctrl.error = null;

        bindingWatch = DataService.watchObject(BindingService.bindingResource, _.get(ctrl.binding, 'metadata.name'), context, function(binding) {
          ctrl.binding = binding;
        });
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
})();
