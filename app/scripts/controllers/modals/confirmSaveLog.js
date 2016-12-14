'use strict';

/**
 * @ngdoc controller
 * @name openshiftConsole.controller:ConfirmSaveLogController
 * @description
 *
 * Shows a confirmation dialog before saving a partial log for a pod,
 * replication controller, or build. The dialog contains the CLI command to get
 * the full log.
 */
angular.module('openshiftConsole')
  .controller('ConfirmSaveLogController',
              function($scope,
                       $uibModalInstance,
                       object,
                       CLIHelp) {
    $scope.object = object;
    $scope.command = CLIHelp.getLogsCommand(object);

    $scope.save = function() {
      $uibModalInstance.close('save');
    };

    $scope.cancel = function() {
      $uibModalInstance.dismiss('cancel');
    };
  });
