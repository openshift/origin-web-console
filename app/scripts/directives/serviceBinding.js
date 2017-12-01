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
    ctrl.secretsVersion = APIService.getPreferredVersion('secrets');
    ctrl.showParameterValues = false;

    var context = {
      namespace: ctrl.namespace
    };

    var updateParameterData = function() {

      ctrl.allowParametersReveal = AuthorizationService.canI('secrets', 'get', ctrl.namespace);
      ctrl.parameterData = {};
      ctrl.opaqueParameterKeys = [];

      // Set defaults for schema values
      var defaultValue = ctrl.allowParametersReveal ? '' : '*****';
      _.each(_.keys(_.get(ctrl.bindParameterSchema, 'properties')), function (key) {
        ctrl.parameterData[key] = defaultValue;
      });

      // Get the current status's parameter values
        var statusParameters = _.get(ctrl.binding, 'status.externalProperties.parameters', {});
      _.each(_.keys(statusParameters), function(key) {
        if (statusParameters[key] === '<redacted>') {
          ctrl.parameterData[key] = '*****';
        } else {
          ctrl.parameterData[key] = statusParameters[key];
          ctrl.opaqueParameterKeys.push(key);
        }
      });

      // Fill in the secret values if they are available to the user
      if (ctrl.allowParametersReveal) {
        _.each(_.get(ctrl.binding, 'spec.parametersFrom'), function (parametersSource) {
          DataService.get(ctrl.secretsVersion, _.get(parametersSource, 'secretKeyRef.name'), context).then(function (secret) {
            try {
              var secretData = JSON.parse(SecretsService.decodeSecretData(secret.data)[parametersSource.secretKeyRef.key]);
              // TODO: Only include fields from the secret that are part of the schema
              _.extend(ctrl.parameterData, secretData);
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
        updateParameterData();
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
      }
    };

    ctrl.toggleShowParameterValues = function() {
      ctrl.showParameterValues = !ctrl.showParameterValues;
    };
  }
})();
