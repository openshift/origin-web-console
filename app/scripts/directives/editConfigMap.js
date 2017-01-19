"use strict";

angular.module("openshiftConsole")
  .directive("editConfigMap",
             function(DNS1123_SUBDOMAIN_VALIDATION) {
    return {
      require: '^form',
      restrict: 'E',
      scope: {
        configMap: "=model",
        showNameInput: "="
      },
      templateUrl: 'views/directives/edit-config-map.html',
      link: function($scope, element, attrs, formCtl) {
        $scope.form = formCtl;

        $scope.nameValidation = DNS1123_SUBDOMAIN_VALIDATION;

        $scope.addItem = function() {
          $scope.data.push({ key: '', value: '' });
          $scope.form.$setDirty();
        };

        $scope.removeItem = function(index) {
          $scope.data.splice(index, 1);
          $scope.form.$setDirty();
        };

        // Return an array of keys. Used for duplicate key detection.
        $scope.getKeys = function() {
          return _.map($scope.data, 'key');
        };

        // Load the data once when it is first set.
        var clearWatch = $scope.$watch('configMap.data', function(data) {
          if (!data) {
            return;
          }

          // Transform the data into an array so the form fields are always in
          // the order they're added.
          $scope.data = _.map(data, function(value, key) {
            return {
              key: key,
              value: value
            };
          });
          _.sortBy($scope.data, 'key');

          if (_.isEmpty($scope.data)) {
            $scope.addItem();
          }

          clearWatch();

          // Update `$scope.configMap` as the form data changes.
          $scope.$watch('data', function(data) {
            var map = {};
            _.each(data, function(keyValuePair) {
              map[keyValuePair.key] = keyValuePair.value;
            });

            _.set($scope, 'configMap.data', map);
          }, true);
        });
      }
    };
  });
