'use strict';

angular.module("openshiftConsole")
  .factory("MobileClientsService", function(DataService) {

    var mobileclientVersion = {
      group: "mobile.k8s.io",
      version: "v1alpha1",
      resource: "mobileclients"
    };


    var watch = function(context, callback, opts) {
      return DataService.watch(mobileclientVersion, context, callback, opts);
    };

    var getMobileClients = function(namespace) {
      return DataService.list(mobileclientVersion, {namespace: namespace})
        .then(function(clients) {
          return clients.by("metadata.name");
        });
    };

    var filterExcluded = function(serviceInstance, mobileClients) {
      var serviceName = _.get(serviceInstance, 'metadata.name', '');
      return _.filter(mobileClients, function(client) {
        var excludedServices = _.get(client, 'spec.excludedServices');
        return _.includes(excludedServices, serviceName);
      });
    };

    var filterNotExcluded = function(serviceInstance, mobileClients) {
      var serviceName = _.get(serviceInstance, 'metadata.name', '');
      return _.filter(mobileClients, function(client) {
        var excludedServices = _.get(client, 'spec.excludedServices');
        return !_.includes(excludedServices, serviceName);
      });
    };

    var removeFromExcluded = function(mobileClient, serviceInstance, context) {
      mobileClient = angular.copy(mobileClient);
      var serviceName = _.get(serviceInstance, 'metadata.name', '');
      _.remove(mobileClient.spec.excludedServices, function(service) {
        return service === serviceName;
      });
      return DataService.update(mobileclientVersion, mobileClient.metadata.name, mobileClient, context);
    };

    var excludeClient = function(mobileClient, serviceInstance, context) {
      mobileClient = angular.copy(mobileClient);
      var excludedServices = _.get(mobileClient, 'spec.excludedServices') || [];
      excludedServices.push(_.get(serviceInstance, 'metadata.name'));
      _.set(mobileClient, 'spec.excludedServices', excludedServices);
      return DataService.update(mobileclientVersion, mobileClient.metadata.name, mobileClient, context);
    };

    return {
      watch: watch,
      filterExcluded: filterExcluded,
      filterNotExcluded: filterNotExcluded,
      getMobileClients: getMobileClients,
      removeFromExcluded: removeFromExcluded,
      excludeClient: excludeClient
    };
  });


