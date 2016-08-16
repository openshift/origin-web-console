'use strict';

/**
 * @ngdoc function
 * @name openshiftConsole.controller:LinkServiceModalController
 * @description
 * # LinkServiceModalController
 * Controller of the openshiftConsole
 */
angular.module('openshiftConsole')
  .controller('LinkServiceModalController', function ($scope, $uibModalInstance, ServicesService) {
    $scope.$watch('services', function(services) {
      var dependentServices = ServicesService.getDependentServices($scope.service);
      // Filter out the same service and any existing links from the list.
      $scope.options = _.filter(services, function(service) {
        return service !== $scope.service && !_.includes(dependentServices, service.metadata.name);
      });

      // If there is only one service, start with it selected.
      if (_.size($scope.options) === 1) {
        _.set($scope, 'link.selectedService', _.head($scope.options));
      }
    });
    $scope.link = function() {
      $uibModalInstance.close(_.get($scope, 'link.selectedService'));
    };

    $scope.cancel = function() {
      $uibModalInstance.dismiss();
    };
  });
