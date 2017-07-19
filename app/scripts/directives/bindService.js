'use strict';

(function() {
  angular.module('openshiftConsole').component('bindService', {
    controller: [
      '$scope',
      '$filter',
      'DataService',
      'BindingService',
      BindService
    ],
    controllerAs: 'ctrl',
    bindings: {
      target: '<',
      project: '<',
      onClose: '<'
    },
    templateUrl: 'views/directives/bind-service.html'
  });

  function BindService($scope,
                       $filter,
                       DataService,
                       BindingService) {
    var ctrl = this;
    var validityWatcher;
    var bindingWatch;
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
      ctrl.serviceToBind = newestReady || newestNotReady;
    };

    var sortServiceInstances = function() {
      // wait till both service instances and service classes are available so that the sort is stable and items dont jump around
      if (ctrl.serviceClasses && ctrl.serviceInstances) {
        ctrl.orderedServiceInstances = _.sortByAll(ctrl.serviceInstances,
          function(item) {
            return _.get(ctrl.serviceClasses, [item.spec.serviceClassName, 'externalMetadata', 'displayName']) || item.spec.serviceClassName;
          },
          function(item) {
            return _.get(item, 'metadata.name', '');
          }
        );
      }
    };

    var deploymentConfigs, deployments, replicationControllers, replicaSets, statefulSets;
    var sortApplications = function() {
      // Don't waste time sorting on each data load, just sort when we have them all
      if (deploymentConfigs && deployments && replicationControllers && replicaSets && statefulSets) {
        var apiObjects =  [].concat(deploymentConfigs)
                            .concat(deployments)
                            .concat(replicationControllers)
                            .concat(replicaSets)
                            .concat(statefulSets);
        ctrl.applications = _.sortByAll(apiObjects, ['metadata.name', 'kind']);
        ctrl.bindType = ctrl.applications.length ? "application" : "secret-only";
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
        sortApplications();
      });
      DataService.list('replicationcontrollers', context).then(function(replicationControllerData) {
        replicationControllers = _.reject(replicationControllerData.by('metadata.name'), $filter('hasDeploymentConfig'));
        sortApplications();
      });
      DataService.list({
        group: 'apps',
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
      ctrl.projectDisplayName = $filter('displayName')(ctrl.project);

      ctrl.steps = [
        {
          id: 'bindForm',
          label: "Binding",
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
        ctrl.serviceToBind = ctrl.target;
        loadApplications();
      }
      else {
        ctrl.bindType = 'application';
        ctrl.appToBind = ctrl.target;
        loadServiceInstances();
      }
    };

    ctrl.$onChanges = function(onChangesObj) {
      if (onChangesObj.project && !onChangesObj.project.isFirstChange()) {
        ctrl.projectDisplayName = $filter('displayName')(ctrl.project);
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
      var svcToBind = ctrl.target.kind === 'Instance' ? ctrl.target : ctrl.serviceToBind;
      var application = ctrl.bindType === 'application' ? ctrl.appToBind : undefined;

      var context = {
        namespace: _.get(svcToBind, 'metadata.namespace')
      };

      var serviceClass = BindingService.getServiceClassForInstance(svcToBind, ctrl.serviceClasses);
      BindingService.bindService(svcToBind, application, serviceClass).then(function(binding){
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
