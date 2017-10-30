'use strict';

(function() {
  angular.module('openshiftConsole').component('serviceInstanceRow', {
    controller: [
      '$filter',
      'APIService',
      'AuthorizationService',
      'BindingService',
      'ListRowUtils',
      'ServiceInstancesService',
      ServiceInstanceRow
    ],
    controllerAs: 'row',
    bindings: {
      apiObject: '<',
      state: '<',
      bindings: '<'
    },
    templateUrl: 'views/overview/_service-instance-row.html'
  });

  function ServiceInstanceRow($filter,
                              APIService,
                              AuthorizationService,
                              BindingService,
                              ListRowUtils,
                              ServiceInstancesService) {
    var row = this;
    var isBindingFailed = $filter('isBindingFailed');
    var isBindingReady = $filter('isBindingReady');
    var serviceInstanceFailedMessage = $filter('serviceInstanceFailedMessage');
    var truncate = $filter('truncate');

    _.extend(row, ListRowUtils.ui);

    var serviceInstanceDisplayName = $filter('serviceInstanceDisplayName');

    row.serviceBindingsVersion = APIService.getPreferredVersion('servicebindings');
    row.serviceInstancesVersion = APIService.getPreferredVersion('serviceinstances');

    var getServiceClass = function() {
      var serviceClassName = ServiceInstancesService.getServiceClassNameForInstance(row.apiObject);
      return _.get(row, ['state','serviceClasses', serviceClassName]);
    };

    var getServicePlan = function() {
      var servicePlanName = ServiceInstancesService.getServicePlanNameForInstance(row.apiObject);
      return _.get(row, ['state', 'servicePlans', servicePlanName]);
    };

    var updateInstanceStatus = function() {
      if (_.get(row.apiObject, 'metadata.deletionTimestamp')) {
        row.instanceStatus = 'deleted';
      } else if (isBindingFailed(row.apiObject)) {
        row.instanceStatus = 'failed';
      } else if (isBindingReady(row.apiObject)) {
        row.instanceStatus = 'ready';
      } else {
        row.instanceStatus = 'pending';
      }
    };

    row.$doCheck = function() {
      updateInstanceStatus();

      row.notifications = ListRowUtils.getNotifications(row.apiObject, row.state);
      row.serviceClass = getServiceClass();
      row.servicePlan = getServicePlan();
      row.displayName = serviceInstanceDisplayName(row.apiObject, row.serviceClass);
      row.isBindable = BindingService.isServiceBindable(row.apiObject, row.serviceClass, row.servicePlan);
    };

    row.$onChanges = function(changes) {
      if (changes.bindings) {
        row.deleteableBindings = _.reject(row.bindings, 'metadata.deletionTimestamp');
      }
    };

    row.getSecretForBinding = function(binding) {
      return binding && _.get(row, ['state', 'secrets', binding.spec.secretName]);
    };

    row.actionsDropdownVisible = function() {
      // no actions on those marked for deletion
      if (_.get(row.apiObject, 'metadata.deletionTimestamp')) {
        return false;
      }

      // We can create bindings
      if (row.isBindable && AuthorizationService.canI(row.serviceBindingsVersion, 'create')) {
        return true;
      }
      // We can delete bindings
      if (!_.isEmpty(row.deleteableBindings) && AuthorizationService.canI(row.serviceBindingsVersion, 'delete')) {
        return true;
      }
      // We can delete instances
      if (AuthorizationService.canI(row.serviceInstancesVersion, 'delete')) {
        return true;
      }

      return false;
    };

    row.closeOverlayPanel = function() {
      _.set(row, 'overlay.panelVisible', false);
    };

    row.showOverlayPanel = function(panelName, state) {
      _.set(row, 'overlay.panelVisible', true);
      _.set(row, 'overlay.panelName', panelName);
      _.set(row, 'overlay.state', state);
    };

    row.getFailedTooltipText = function() {
      var message = serviceInstanceFailedMessage(row.apiObject);
      if (!message) {
        return '';
      }

      var truncated = truncate(message, 128);
      if (message.length !== truncated.length) {
        truncated += '...';
      }

      return truncated;
    };

    row.deprovision = function() {
      ServiceInstancesService.deprovision(row.apiObject, row.deleteableBindings);
    };
  }
})();
