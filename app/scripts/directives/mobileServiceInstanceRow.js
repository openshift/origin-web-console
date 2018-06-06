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
    row.serviceBindingsVersion = APIService.getPreferredVersion('servicebindings');
    row.state = row.state || {};
    var annotationSpace = "org.aerogear.binding." + this.apiObject.metadata.name;
    var extendedAnnotationSpace = "org.aerogear.binding-ext." + this.apiObject.metadata.name;
    var watches = [];
    var bindingsWatch = false;
    row.bindingsLimit = _.get(row.serviceClass, "spec.externalMetadata.bindingsLimit", 1);
    _.extend(row, ListRowUtils.ui);

    $scope.$on('$destroy', function(){
        DataService.unwatchAll(watches);
        DataService.unwatch(bindingsWatch);
    });

    watches.push(DataService.watchObject(APIService.getPreferredVersion('mobileclients'), $routeParams.mobileclient, {namespace: $routeParams.project}, function(mobileClient) {
        row.mobileClient = mobileClient;

        row.bindingMeta = {
          generateName: _.get(row, 'mobileClient.metadata.name').toLowerCase() + '-' + _.get(row, 'serviceClass.spec.externalMetadata.serviceName').toLowerCase() + '-',
          annotations: {
            'binding.aerogear.org/consumer': _.get(row, 'mobileClient.metadata.name'),
            'binding.aerogear.org/provider': _.get(row, 'apiObject.metadata.name')
          }
        };

        row.annotations = _.filter(row.mobileClient.metadata.annotations, function(annotation, name){
          return name.split("/")[0] === annotationSpace;
        })
        .map(JSON.parse)
        .sort(function(a, b) {
          if (a.label < b.label) {
            return -1;
          }
          if (a.label > b.label) {
            return 1;
          }
          return 0;
        });

        row.serviceType = _.get(row, "serviceClass.spec.externalMetadata.serviceName"); // safe get

        row.extendedAnnotations = _(row.mobileClient.metadata.annotations)
          .pickBy(function(annotation, name){
            return name.split("/")[0] === extendedAnnotationSpace;
          })
          .transform(function(result, strVal, name) {
            var key = name.split("/")[1];
            result[key] = JSON.parse(strVal);
          })
          .value();

        row.servicePlanPromise = DataService.list(APIService.getPreferredVersion('clusterserviceplans'), {}, function(servicePlans) {
          var servicePlanData = servicePlans.by('metadata.name');
          row.providerServicePlan = _.find(servicePlanData, function(plan) {
            return row.serviceClass.metadata.name === plan.spec.clusterServiceClassRef.name;
          });
          var kind = row.mobileClient.kind.toLowerCase();
          var bindDataPath = 'providerServicePlan.spec.externalMetadata.' + kind + '_bind_parameters_data';
          var bindData = _.get(row, bindDataPath, []);
          row.bindData = _(bindData).map(JSON.parse).value();
        });

        if(!bindingsWatch){
          bindingsWatch = DataService.watch(APIService.getPreferredVersion("servicebindings"), {namespace: $routeParams.project}, function(bindings){
            row.bindings = _.filter(bindings.by("metadata.name"), function(binding){
              return _.get(binding.metadata.annotations, "binding.aerogear.org/consumer") === row.mobileClient.metadata.name &&
                    _.get(binding.metadata.annotations, "binding.aerogear.org/provider") === row.apiObject.metadata.name;
            });

            row.bindingInProgress = _.sumBy(row.bindings, function(binding){
              return $filter('isBindingReady')(binding) ? 0 : 1;
            });
          });
        }
    }));

    row.$onChanges = function() {
      row.displayName = serviceInstanceDisplayName(row.apiObject, row.serviceClass);
    };

    row.closeOverlayPanel = function() {
      _.set(row, 'overlay.panelVisible', false);
    };

    row.showOverlayPanel = function(panelName, state) {
      row.parameterData = _.reduce(row.bindData, function(acc, current) {
        if (current.type === 'path') {
          acc[current.name] = _.get(row, 'mobileClient.' + current.value);
        } else if (current.type === 'default') {
          acc[current.name] = current.value;
        }
        return acc;
      },{});
      _.set(row, 'overlay.panelVisible', true);
      _.set(row, 'overlay.panelName', panelName);
      _.set(row, 'overlay.state', state);
    };
  }
})();
