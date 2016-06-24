"use strict";

angular.module("openshiftConsole")
  /**
   * Widget for selecting image stream tags.
   *
   * model:
   *   The model for the input. The model will either use or add the following keys:
   *     {
   *       namespace: "",
   *       imageStream: "",
   *       tag: ""
   *     }
   *
   * selectDisabled:
   *   An expression that will disable the form (default: false)
   */
  .directive("istagSelect", function(DataService) {
    return {
      require: '^form',
      restrict: 'E',
      scope: {
        istag: '=model',
        selectDisabled: '='
      },
      templateUrl: 'views/directives/istag-select.html',
      link: function($scope){
        $scope.isByNamespace = {};
        $scope.isNamesByNamespace = {};

        DataService.list("projects", {}, function(projectData) {
          $scope.namespaces = ['openshift'].concat(_.keys(projectData.by('metadata.name')).sort());

          // Fetch image streams when a new namespace is picked.
          $scope.$watch('istag.namespace', function(namespace) {
            if (!namespace || $scope.isByNamespace[namespace]) {
              // We already have the data (or nothing selected).
              return;
            }

            DataService.list('imagestreams', { namespace: namespace }, function(isData) {
              $scope.isByNamespace[namespace] = isData.by('metadata.name');
              $scope.isNamesByNamespace[namespace] = _.keys($scope.isByNamespace[namespace]).sort();
            });
          });
        });
      }
    };
  });
