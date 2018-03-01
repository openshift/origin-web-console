'use strict';
angular
  .module('openshiftConsole')
  .directive('actionChip', function() {
    return {
      restrict: 'E',
      scope: {
        key: '=?',
        value: '=?',
        keyHelp: '=?',    // optional, or empty string for false
        valueHelp: '=',   // optional, or empty string for false
        action: '&?',     // callback fn,
        actionIcon: '=?', // default is pficon pficon-close,
        actionTitle: '@',
        showAction: '=?'  // bool to show-hide the action button
      },
      templateUrl: 'views/directives/action-chip.html'
    };
  });
