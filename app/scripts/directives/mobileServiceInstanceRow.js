'use strict';

(function() {
  angular.module('openshiftConsole').component('mobileServiceInstanceRow', {
    controller: [
      '$filter',
      '$routeParams',
      '$scope',
      'APIService',
      'AuthorizationService',
      'BindingService',
      'DataService',
      'ListRowUtils',
      MobileServiceInstanceRow
    ],
    controllerAs: 'row',
    bindings: {
        apiObject: '<',
        serviceClass: '<',
        state: '<'
    },
    templateUrl: 'views/_mobile-service-instance-row.html'
  });

  function MobileServiceInstanceRow($filter,
                              $routeParams,
                              $scope,
                              APIService,
                              AuthorizationService,
                              BindingService,
                              DataService,
                              ListRowUtils) {
    var row = this;
    var serviceInstanceDisplayName = $filter('serviceInstanceDisplayName');
    var bindingProviderAnnotation = $filter('annotationName')('mobileBindingProviderId');
    var bindingConsumerAnnotation = $filter('annotationName')('mobileBindingConsumerId');
    row.serviceBindingsVersion = APIService.getPreferredVersion('servicebindings');
    var mobileClientsVersion = APIService.getPreferredVersion('mobileclients');
    var servicePlansVersion = APIService.getPreferredVersion('clusterserviceplans');
    var serviceBindingsVersion = APIService.getPreferredVersion('servicebindings');
    row.state = row.state || {};
    var annotationSpace = 'org.aerogear.binding.' + this.apiObject.metadata.name;
    var extendedAnnotationSpace = 'org.aerogear.binding-ext.' + this.apiObject.metadata.name;
    var watches = [];
    row.bindingInProgress = false;
    var isBindingReady = $filter('isBindingReady');
    row.bindingsLimit = _.get(row.serviceClass, 'spec.externalMetadata.bindingsLimit', 1);
    _.extend(row, ListRowUtils.ui);


    row.$onChanges = function(changes) {
      row.displayName = serviceInstanceDisplayName(row.apiObject, row.serviceClass);

      if (changes.apiObject && changes.apiObject.isFirstChange()) {
        row.getClient()
          .then(function(client) {
            row.mobileClient = client;
            row.serviceType = _.get(row, 'serviceClass.spec.externalMetadata.serviceName');

            row.sortAnnotations();
            row.getBindingParametersData();
            row.watchServiceBindings();
            row.watchClient();
          });       
      }
    };

    row.getClient = function() {
      return DataService.list(mobileClientsVersion, {namespace: $routeParams.project})
        .then(function(mobileClients) {
          return _.find(mobileClients.by('metadata.name'), function(client) {
            return client.metadata.name === $routeParams.mobileclient;
          });
      });
    };

    row.sortAnnotations = function() {
      var annotations = _.get(row, 'mobileClient.metadata.annotations', []);
      row.annotations = _(annotations)
          .filter(function(annotation, name) {
          return name.split('/')[0] === annotationSpace;
        })
        .map(JSON.parse)
        .sortBy(function(annotation) {
          return annotation.label;
        })
        .value();

      row.extendedAnnotations = _(annotations)
        .pickBy(function(annotation, name) {
          return name.split('/')[0] === extendedAnnotationSpace;
        })
        .transform(function(result, strVal, name) {
          var key = name.split('/')[1];
          result[key] = JSON.parse(strVal);
        })
        .value();
    };

    row.getBindingParametersData = function() {
      DataService.list(servicePlansVersion, {}, function(servicePlans) {
        var servicePlanData = servicePlans.by('metadata.name');
        row.providerServicePlan = _.find(servicePlanData, function(plan) {
          return row.serviceClass.metadata.name === plan.spec.clusterServiceClassRef.name;
        });
        var kind = row.mobileClient.kind.toLowerCase();
        var bindDataPath = 'providerServicePlan.spec.externalMetadata.' + kind + '_bind_parameters_data';
        var bindData = _.get(row, bindDataPath, []);
        row.bindData = _(bindData).map(JSON.parse).value();
      });
    };

    row.watchServiceBindings = function() {
      watches.push(DataService.watch(serviceBindingsVersion, {namespace: $routeParams.project}, function(bindings) {
        var clientBindings = _.filter(bindings.by('metadata.name'), function(binding) {
          return _.get(binding.metadata.annotations, bindingConsumerAnnotation) === row.mobileClient.metadata.name &&
                _.get(binding.metadata.annotations, bindingProviderAnnotation) === row.apiObject.metadata.name;
        });

        row.bindings = _.filter(clientBindings, function(binding) {
          return isBindingReady(binding) || _.get(binding, 'status.currentOperation') === 'Unbind';
        });
        row.bindingInProgress = _.some(clientBindings, function(binding) {
          return !isBindingReady(binding);
        });
      }));
    };

    row.watchClient = function() {
      watches.push(DataService.watchObject(mobileClientsVersion, $routeParams.mobileclient, {namespace: $routeParams.project}, function(mobileClient) {
        row.mobileClient = mobileClient;
        row.sortAnnotations();
      }));
    };

    row.closeOverlayPanel = function() {
      _.set(row, 'overlay.panelVisible', false);
    };

    row.showOverlayPanel = function(panelName, state) {
      row.parameterData = _.reduce(row.bindData, function(acc, parameterData) {
        if (parameterData.type === 'path') {
          acc[parameterData.name] = _.get(row, 'mobileClient.' + parameterData.value);
        } else if (parameterData.type === 'default') {
          acc[parameterData.name] = parameterData.value;
        }
        return acc;
      },{});
      _.set(row, 'overlay.panelVisible', true);
      _.set(row, 'overlay.panelName', panelName);
      _.set(row, 'overlay.state', state);
    };

    row.onBindCreated = function() {
      var uid = _.get(row.apiObject, 'metadata.uid', '');
      sessionStorage.setItem('overview/expand/' + uid, 'true');
    };

    $scope.$on('$destroy', function(){
      DataService.unwatchAll(watches);
    });
  }
})();
