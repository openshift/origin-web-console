'use strict';

(function() {
  angular.module('openshiftConsole').component('serviceInstanceRow', {
    controller: [
      '$filter',
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
                              AuthorizationService,
                              BindingService,
                              ListRowUtils,
                              ServiceInstancesService) {
    var row = this;
    var isBindingFailed = $filter('isBindingFailed');
    var isBindingReady = $filter('isBindingReady');

    _.extend(row, ListRowUtils.ui);

    var serviceInstanceDisplayName = $filter('serviceInstanceDisplayName');

    var getDescription = function() {
      var serviceClassName = row.apiObject.spec.serviceClassName;
      return _.get(row, ['state','serviceClasses', serviceClassName, 'description']);
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
      row.displayName = serviceInstanceDisplayName(row.apiObject, row.state.serviceClasses);
      row.isBindable = BindingService.isServiceBindable(row.apiObject, row.state.serviceClasses);
      row.description = getDescription();
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
      if (row.isBindable && AuthorizationService.canI({resource: 'serviceinstancecredentials', group: 'servicecatalog.k8s.io'}, 'create')) {
        return true;
      }
      // We can delete bindings
      if (!_.isEmpty(row.deleteableBindings) && AuthorizationService.canI({resource: 'serviceinstancecredentials', group: 'servicecatalog.k8s.io'}, 'delete')) {
        return true;
      }
      // We can delete instances
      if (AuthorizationService.canI({resource: 'serviceinstances', group: 'servicecatalog.k8s.io'}, 'delete')) {
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

    row.deprovision = function() {
      ServiceInstancesService.deprovision(row.apiObject);
    };
  }
})();
