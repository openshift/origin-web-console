'use strict';
// <div>
//   <div>Chips</div>
//   <div row mobile="column">
//     <action-chip
//       key="'1'"></action-chip>
//     <action-chip
//       key="'2'"
//       value="'foo'"></action-chip>
//     <action-chip
//       key="'3'"
//       action="foo('shizzle', 'pop')"></action-chip>
//     <action-chip
//       key="'4'"
//       value="'bar'"
//       icon="'fa fa-check'"
//       action="foo('shizzle', 'pop2')"></action-chip>
//   </div>
// </div>
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
