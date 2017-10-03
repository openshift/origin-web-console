'use strict';

(function() {
  angular.module('openshiftConsole').component('serviceBinding', {
    controller: [
      'APIService',
      'AuthorizationService',
      'DataService',
      'Logger',
      'SecretsService',
      'ServiceInstancesService',
      ServiceBinding
    ],
    controllerAs: '$ctrl',
    bindings: {
      namespace: '<',
      binding: '<',
      refApiObject: '<?',
      serviceClasses: '<',
      serviceInstances: '<',
      isOverview: '<?'
    },
    templateUrl: 'views/directives/_service-binding.html'
  });

  function ServiceBinding(APIService,
                          AuthorizationService,
                          DataService,
                          Logger,
                          SecretsService,
                          ServiceInstancesService) {
    var ctrl = this;
    ctrl.serviceBindingsVersion = APIService.getPreferredVersion('servicebindings');
    ctrl.showParameterValues = false;

    var context = {
      namespace: ctrl.namespace
    };

    var updateParameterData = function() {
      ctrl.parameterData = angular.copy(_.get(ctrl.binding, 'spec.parameters', {}));
      if (AuthorizationService.canI('secrets', 'get', ctrl.namespace)) {
        _.each(_.get(ctrl.binding, 'spec.parametersFrom'), function (parametersSource) {
          DataService.get('secrets', _.get(parametersSource, 'secretKeyRef.name'), context).then(function (secret) {
            try {
              _.extend(ctrl.parameterData, JSON.parse(SecretsService.decodeSecretData(secret.data)[parametersSource.secretKeyRef.key]));
            } catch (e) {
              Logger.warn('Unable to load parameters from secret ' + _.get(parametersSource, 'secretKeyRef.name'), e);
            }
          });
        });
      }
    };

    var updateParameterSchema = function() {
      var resource = APIService.getPreferredVersion('clusterserviceplans');
      DataService.get(resource, _.get(ctrl.serviceInstance, 'spec.clusterServicePlanRef.name'), context).then(function(servicePlan) {
        ctrl.bindParameterFormDefinition = angular.copy(_.get(servicePlan, 'spec.externalMetadata.schemas.service_binding.create.openshift_form_definition'));
        ctrl.bindParameterSchema = _.get(servicePlan, 'spec.serviceBindingCreateParameterSchema');
      });
    };

    var updateServiceClass = function() {
      if (_.get(ctrl.refApiObject, 'kind') !== 'ServiceInstance') {
        var instanceName = _.get(ctrl.binding, 'spec.instanceRef.name');
        ctrl.serviceInstance = _.get(ctrl.serviceInstances, [instanceName]);
      } else {
        ctrl.serviceInstance = ctrl.refApiObject;
      }

      var serviceClassName = ServiceInstancesService.getServiceClassNameForInstance(ctrl.serviceInstance);
      ctrl.serviceClass = _.get(ctrl.serviceClasses, [serviceClassName]);
    };

    this.$onChanges = function(changes) {
      if (changes.binding || changes.serviceInstances || changes.serviceClasses) {
        updateServiceClass();
        updateParameterSchema();
        updateParameterData();
      }
    };

    ctrl.toggleShowParameterValues = function() {
      ctrl.showParameterValues = !ctrl.showParameterValues;
    };
  }
})();
