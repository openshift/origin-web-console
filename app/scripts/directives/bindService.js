'use strict';

(function() {
  angular.module('openshiftConsole').component('bindService', {
    controller: [
      '$scope',
      '$filter',
      'ApplicationsService',
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
                       ApplicationsService,
                       DataService,
                       BindingService) {
    var ctrl = this;
    var bindFormStep;
    var bindParametersStep;
    var resultsStep;
    var selectionValidityWatcher;
    var parametersValidityWatcher;
    var bindingWatch;
    var statusCondition = $filter('statusCondition');
    var enableTechPreviewFeature = $filter('enableTechPreviewFeature');

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
        ctrl.serviceInstances = BindingService.filterBindableServiceInstances(ctrl.serviceInstances, ctrl.serviceClasses);
        ctrl.orderedServiceInstances = BindingService.sortServiceInstances(ctrl.serviceInstances, ctrl.serviceClasses);

        if (!ctrl.serviceToBind) {
          preselectService();
        }
      }
    };

    var showBind = function() {
      ctrl.nextTitle = bindParametersStep.hidden ? 'Bind' : 'Next >';
      if (ctrl.podPresets && !selectionValidityWatcher) {
        selectionValidityWatcher = $scope.$watch("ctrl.selectionForm.$valid", function(isValid) {
          bindFormStep.valid = isValid;
        });
      }
    };

    var showParameters = function() {
      ctrl.nextTitle = 'Bind';
      if (!parametersValidityWatcher) {
        parametersValidityWatcher = $scope.$watch("ctrl.parametersForm.$valid", function(isValid) {
          bindParametersStep.valid = isValid;
        });
      }
    };

    var showResults = function() {
      if (selectionValidityWatcher) {
        selectionValidityWatcher();
        selectionValidityWatcher = undefined;
      }
      if (parametersValidityWatcher) {
        parametersValidityWatcher();
        parametersValidityWatcher = undefined;
      }
      ctrl.nextTitle = "Close";
      ctrl.wizardComplete = true;

      ctrl.bindService();
    };

    var loadApplications = function() {
      var context = {
        namespace: _.get(ctrl.target, 'metadata.namespace')
      };
      ApplicationsService.getApplications(context).then(function(applications) {
        ctrl.applications = applications;
        ctrl.bindType = ctrl.applications.length ? "application" : "secret-only";
      });
    };

    var loadServiceInstances = function() {
      var context = {
        namespace: _.get(ctrl.target, 'metadata.namespace')
      };

      DataService.list({
        group: 'servicecatalog.k8s.io',
        resource: 'serviceinstances'
      }, context).then(function(instances) {
        ctrl.serviceInstances = instances.by('metadata.name');
        sortServiceInstances();
      });
    };

    bindFormStep = {
      id: 'bindForm',
      label: 'Binding',
      view: 'views/directives/bind-service/bind-service-form.html',
      valid: true,
      allowClickNav: true,
      onShow: showBind
    };

    bindParametersStep = {
      id: 'bindParameters',
      label: 'Parameters',
      view: 'views/directives/bind-service/bind-parameters.html',
      hidden: true,
      allowClickNav: true,
      onShow: showParameters
    };

    resultsStep = {
      id: 'results',
      label: 'Results',
      view: 'views/directives/bind-service/results.html',
      valid: true,
      allowClickNav: false,
      onShow: showResults
    };

    var updateInstance = function() {
      if (!ctrl.serviceClasses) {
        return;
      }

      var instance = ctrl.target.kind === 'ServiceInstance' ? ctrl.target : ctrl.serviceToBind;
      if (!instance) {
        return;
      }

      ctrl.serviceClass = ctrl.serviceClasses[instance.spec.serviceClassName];
      ctrl.serviceClassName = instance.spec.serviceClassName;
      ctrl.plan = BindingService.getPlanForInstance(instance, ctrl.serviceClass);
      ctrl.parameterSchema = _.get(ctrl.plan, 'alphaServiceInstanceCredentialCreateParameterSchema');
      bindParametersStep.hidden = !_.has(ctrl.parameterSchema, 'properties');
      ctrl.nextTitle = bindParametersStep.hidden ? 'Bind' : 'Next >';
    };

    $scope.$watch("ctrl.serviceToBind", updateInstance);

    ctrl.$onInit = function() {
      ctrl.serviceSelection = {};
      ctrl.projectDisplayName = $filter('displayName')(ctrl.project);
      ctrl.podPresets = enableTechPreviewFeature('pod_presets');
      ctrl.parameterData = {};

      ctrl.steps = [ bindFormStep, bindParametersStep, resultsStep ];

      // We will want ServiceClasses either way for display purposes
      DataService.list({
        group: 'servicecatalog.k8s.io',
        resource: 'serviceclasses'
      }, {}).then(function(serviceClasses) {
        ctrl.serviceClasses = serviceClasses.by('metadata.name');
        updateInstance();
        sortServiceInstances();
      });

      if (ctrl.target.kind === 'ServiceInstance') {
        ctrl.bindType = "secret-only";
        ctrl.appToBind = null;
        ctrl.serviceToBind = ctrl.target;
        if (ctrl.podPresets) {
          loadApplications();
        }
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
      if (selectionValidityWatcher) {
        selectionValidityWatcher();
        selectionValidityWatcher = undefined;
      }
      if (parametersValidityWatcher) {
        parametersValidityWatcher();
        parametersValidityWatcher = undefined;
      }
      if (bindingWatch) {
        DataService.unwatch(bindingWatch);
      }
    };

    ctrl.bindService = function() {
      var svcToBind = ctrl.target.kind === 'ServiceInstance' ? ctrl.target : ctrl.serviceToBind;
      var application = ctrl.bindType === 'application' ? ctrl.appToBind : undefined;

      var context = {
        namespace: _.get(svcToBind, 'metadata.namespace')
      };

      var serviceClass = BindingService.getServiceClassForInstance(svcToBind, ctrl.serviceClasses);
      BindingService.bindService(svcToBind, application, serviceClass, ctrl.parameterData).then(function(binding){
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
