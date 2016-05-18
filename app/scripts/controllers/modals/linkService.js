'use strict';

/**
 * @ngdoc function
 * @name openshiftConsole.controller:LinkServiceModalController
 * @description
 * # LinkServiceModalController
 * Controller of the openshiftConsole
 */
angular.module('openshiftConsole')
  .controller('LinkServiceModalController', function ($scope, $uibModalInstance) {
    $scope.$watch('services', function(services) {
      // Filter out the same service from the list.
      $scope.options = _.filter(services, function(service) {
        return service !== $scope.service;
      });
    });
    $scope.link = function() {
      $uibModalInstance.close(_.get($scope, 'link.selectedService'));
    };

    $scope.cancel = function() {
      $uibModalInstance.dismiss();
    };
  });
