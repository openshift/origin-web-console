'use strict';

angular.module('openshiftConsole')
  .component('alerts', {
    bindings: {
      // Alerts are a collection of objects (array or object) in the following format:
      // var exampleAlerts = [
      //   {
      //     type: "string", // error, warning, success, or info (default)
      //     message: "string", // Message to be displayed in the alert.
      //     details: "string", // More details about the alert.
      //     onClose: function(alert){}, //  callback to be executed when this alert is closed
      //     links: [
      //       {
      //         href: "string", // must be set if onClick is not),
      //         label: "string", // link display text
      //         onClick: function(alert, link){} // callback to be executed when this link is clicked, closes the alert if it returns true.
      //       },
      //       // { ... next link }
      //     ]
      //   }
      //   // { ... next alert }
      // ];
      //
      // OR
      //
      // var exampleAlerts = {
      //   alert1 : {
      //     type: "",
      //     message: "",
      //     onClose: function(alert){},
      //     links: [],
      //   },
      //   // alert2: { ... }
      // }
      alerts: '=',

      // Predicate function that will be used to filter the collection of alerts.
      // Per angular documentation:
      // function(value, index, array): A predicate function can be used to write
      // arbitrary filters. The function is called for each element of the array,
      // with the element, its index, and the entire array itself as arguments.
      // The final result is an array of those elements that the predicate returned
      // true for.
      filter: '<?',

      // True if close button should not be shown in alerts
      hideCloseButton: '<?',
    },
    templateUrl: 'components/alerts/alerts.html',
    controller: function() {
      var ctrl = this;

      // Sets the alert hidden state to true and executes the onClose callback
      // if it exists.
      ctrl.close = function(alert) {
        alert.hidden = true;
        if (_.isFunction(alert.onClose)) {
          alert.onClose();
        }
      };

      // Called when a link within the alert is clicked.
      ctrl.onClick = function(alert, link) {
        // If link onClick callback returns true, hide the alert.
        if (_.isFunction(link.onClick)) {
          if (link.onClick()) {
            ctrl.close(alert);
          }
        }
      };
    }
  });
