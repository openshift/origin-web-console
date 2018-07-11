'use strict';

angular
  .module('openshiftConsole')
  .factory('IdleService', function (APIService, DataService) {
    // TODO: migrate to common
    var idlerVersion = {
      group: 'idling.openshift.io',
      version: 'v1alpha2',
      resource: 'idlers'
    };

    // TODO: where should this live?
    // Its APIService-related, possibly duplicate of something else
    var groupResourceName = function (apiObject) {
      var rgv = APIService.objectToResourceGroupVersion(apiObject);
      return {
        group: rgv.group,
        // NOTE: rgv stores resource in the plural, but the 
        // idler stores them in the sigular. too bad, this could 
        // have been cleaner :/
        // resource: rgv.resource,
        resource: apiObject.kind.toLowerCase(),
        name: apiObject.metadata.name,
      };
    };

    // similar to HPAByResource, however the resource is all lowercase 
    // due to the structure of the data for these objects 
    // returns:
    //   idlersByResource[resource][name]
    // which will look something like:
    //   idlersByResource[deploymentconfigs][myidler]
    var groupIdlers = function (idlers) {
      return _.reduce(idlers, function (result, idler) {
        _.each(idler.spec.targetScalables, function (scalable) {
          result[scalable.resource] = result[scalable.resource] || {};
          result[scalable.resource][scalable.name] = idler;
        });
        return result;
      }, {});
    };

    // var isPreviousScaleRecorded = function () {
    //   // TODO: helper for managing inProgress, etc.
    // };

    // Its possible there coupld be muliple idlers, but we can't fix that. it 
    // would be improper use of the idler system.
    // TODO: Perhaps we can error message if we detect multiple idlers, once 
    // this gets pushed up into a service (similar to HPAs).
    var idlerFor = function (idlers, apiObject) {
      var toSearch = idlers && idlers.length ? idlers : [idlers];
      var grn = groupResourceName(apiObject);
      return _.find(toSearch, _.flow(
        _.property('spec.targetScalables'),
        _.partialRight(_.some, grn)
      ));
    };

    var isCurrentlyIdle = function (idlers, apiObject) {
      var idler = idlerFor(idlers, apiObject);
      return !!_.find(
        // status of idled resource currently. 
        // the name of this property is confusing. 
        _.get(idler, 'status.unidledScales'),
        _.partialRight(_.some, groupResourceName(apiObject))
      );
    };

    // how to assess if idling is in progress:
    // idler.spec.wantIdle = false
    //   if wantIdle is false, but the item IS
    // idler.spec.wantIdle = true
    //   if wantIdle is true, but the item IS NOT listed 
    //   in status.unidledScales, then an idle is likely in progress.
    // var isIdlingInProgress = function (idlers, apiObject) {
    //   var idler = idlerFor(idlers, apiObject);
    //   // TODO: details of this fn...
    // }

    var isIdle = function (idlers, apiObject) {
      if (!idlers) {
        return false;
      }
      var idler = idlerFor(idlers, apiObject);
      if (!idler) {
        console.log('no idler');
        return false;
      }
      // this state may be in flux if idle/unidle has been triggered.
      var recordedIdle = isCurrentlyIdle(idler, apiObject);
      return !!recordedIdle;
    };


    var updateIdler = function (idler, namespace) {
      return DataService
        .update(
          idlerVersion,
          idler.metadata.name,
          idler,
          { namespace: namespace });
    };

    var idle = function (idlers, apiObject) {
      var idler = idlerFor(idlers, apiObject);
      if (!idler) {
        return;
      }
      var updatedIdler = angular.copy(idler);
      updatedIdler.spec.wantIdle = true;
      return updateIdler(updatedIdler, apiObject.metadata.namespace);
    };

    // NOTE: if references multiple resource, this will unidle them all!
    // The user of the idler should know this detail, and should expect 
    // it.  However, we should warn them.
    var unidle = function (idlers, apiObject) {
      var idler = idlerFor(idlers, apiObject);
      if (!idler) {
        return;
      }
      var updatedIdler = angular.copy(idler);
      updatedIdler.spec.wantIdle = false;
      return updateIdler(updatedIdler, apiObject.metadata.namespace);
    };

    return {
      isIdle: isIdle,
      idlerFor: idlerFor,
      idle: idle,
      unidle: unidle,
      isCurrentlyIdle: isCurrentlyIdle,
      // isIdlingInProgress: isIdlingInProgress,
      groupResourceName: groupResourceName,
      groupIdlers: groupIdlers
    };
  });