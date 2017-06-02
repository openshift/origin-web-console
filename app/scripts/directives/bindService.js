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

      var context = {
        namespace: _.get(ctrl.target, 'metadata.namespace')
      };
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

      // TODO is it ever realistically possible for target to not be defined at this point
      if (ctrl.target.kind === 'Instance') {
        ctrl.shouldBindToApp = "true";
        ctrl.appToBind = null;
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
        ctrl.appToBind = ctrl.target;
      }
      // TODO: handle not having any service instances when binding app to service
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
      var appToBind = ctrl.target.kind !== 'Instance' ? ctrl.target : ctrl.appToBind;

      var context = {
        namespace: _.get(svcToBind, 'metadata.namespace')
      };

      BindingService.bindService(context, _.get(svcToBind, 'metadata.name'), _.get(appToBind, 'metadata.name')).then(function(binding){
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
