'use strict';
(function() {
  angular.module('openshiftConsole').component('oscWebhookTriggers', {
    controller: [
      '$filter',
      '$scope',
      '$timeout',
      '$uibModal',
      'APIService',
      OscWebhookTriggers
    ],
    controllerAs: '$ctrl',
    bindings: {
      webhookSecrets: '<',
      namespace: '<',
      type: '@',
      webhookTriggers: '=',
      form: '='
    },
    templateUrl: 'components/osc-webhook-triggers/osc-webhook-triggers.html'
  });


  function OscWebhookTriggers($filter, $scope, $timeout, $uibModal, APIService) {
    var ctrl = this;

    // Check if the webhook trigger contains only deprecated secret format.
    ctrl.isDeprecated = function(trigger) {
      var triggerSecretData = $filter('getWebhookSecretData')(trigger);
      return _.has(triggerSecretData, 'secret') && !_.has(triggerSecretData, 'secretReference.name');
    };

    ctrl.addEmptyWebhookTrigger = function() {
      ctrl.webhookTriggers.push({
        lastTriggerType: "",
        data: {
          type: ""
        }
      });
      var newIndex = ctrl.webhookTriggers.length - 1;
      $timeout(function() {
        $scope.$broadcast('focus-index-' + newIndex);
      });
    };

    // Check if new or modified webhook trigger is a duplicate. If so, show a warning under the appropriate trigger
    var checkDuplicates = function(trigger) {
      var type = _.get(trigger, 'data.type');
      if (!type || _.isNil(trigger.data[type.toLowerCase()])) {
        return;
      }

      var matchingTriggers = _.filter(ctrl.webhookTriggers, function(wehbookTrigger) {
        return _.isEqual(wehbookTrigger.data, trigger.data);
      });

      // Mark all except the first as duplicates.
      _.each(matchingTriggers, function(trigger, i) {
        var first = i === 0;
        trigger.isDuplicate = !first;
      });
    };

    // If there are no webhook triggers create empty one, otherwise check for duplicates.
    // In case of deprecated secret format add a `secretInputType` field to the object so we can toggle secret visibility.
    var initializeWebhookTriggers = function() {
      if (_.isEmpty(ctrl.webhookTriggers)) {
        ctrl.addEmptyWebhookTrigger();
      } else {
        _.each(ctrl.webhookTriggers, function(trigger) {
          if (ctrl.isDeprecated(trigger)) {
            trigger.secretInputType = "password";
          }
          if (trigger.isDuplicate) {
            return;
          }
          checkDuplicates(trigger);
        });
      }
    };

    ctrl.$onInit = function() {
      $scope.namespace = ctrl.namespace;
      $scope.type = ctrl.type;
      ctrl.secretsVersion = APIService.getPreferredVersion('secrets');
      ctrl.webhookTypesOptions = [{
        type: 'github',
        label: 'GitHub'
      }, {
        type: 'gitlab',
        label: 'GitLab'
      }, {
        type: 'bitbucket',
        label: 'Bitbucket'
      }, {
        type: 'generic',
        label: 'Generic'
      }];

      initializeWebhookTriggers();
    };

    ctrl.toggleSecretInputType = function(trigger) {
      trigger.secretInputType = trigger.secretInputType === 'password' ? 'text' : 'password';
    };

    ctrl.removeWebhookTrigger = function(trigger, index) {
      var removedTrigger = _.clone(trigger);
      if (ctrl.webhookTriggers.length === 1) {
        var lonelyTrigger = _.first(ctrl.webhookTriggers);
        lonelyTrigger.lastTriggerType = "";
        lonelyTrigger.data = {
          type: ""
        };
      } else {
        ctrl.webhookTriggers.splice(index,1);
      }
      ctrl.form.$setDirty();
      checkDuplicates(removedTrigger);
    };

    // When user changes the webhook trigger type move the secret data from the old one to the new one.
    ctrl.triggerTypeChange = function(trigger) {
      var lastTriggerType = _.toLower(trigger.lastTriggerType);
      var newTriggerType = _.toLower(trigger.data.type);

      trigger.data[newTriggerType] = trigger.data[lastTriggerType];
      delete trigger.data[lastTriggerType];
      trigger.lastTriggerType = trigger.data.type;
      checkDuplicates(trigger);
    };

    ctrl.triggerSecretChange = function(trigger) {
      checkDuplicates(trigger);
    };

    ctrl.openCreateWebhookSecretModal = function() {
      var modalInstance = $uibModal.open({
        templateUrl: 'views/modals/create-secret.html',
        controller: 'CreateSecretModalController',
        scope: $scope
      });

      modalInstance.result.then(function(newSecret) {
        // Add the created secret into the webhook secret array
        ctrl.webhookSecrets.push(newSecret);
      });
    };
  }
})();
