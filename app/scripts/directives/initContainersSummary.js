'use strict';

angular.module('openshiftConsole')
  .component('initContainersSummary', {
    bindings: {
      apiObject: '<'
    },
    templateUrl: 'views/_init-containers-summary.html',
    controller: [
      '$filter',
      function ($filter) {
        var ctrl = this;

        ctrl.$onChanges = function (changesObj) {
          var apiObject = _.get(changesObj.apiObject, 'currentValue');

          if (apiObject) {
            ctrl.podTemplate = $filter('podTemplate')(apiObject);

            switch (apiObject.kind) {
              case 'DeploymentConfig':
              case 'Deployment':
                ctrl.tab = 'configuration';
                break;
              default:
                ctrl.tab = 'details';
                break;
            }
          }
        };
      }
    ]
  });
