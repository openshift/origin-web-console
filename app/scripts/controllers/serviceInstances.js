'use strict';

angular.module('openshiftConsole')
  .controller('ServiceInstancesController', function ($scope,
                                                      $filter,
                                                      $routeParams,
                                                      APIService,
                                                      BindingService,
                                                      Constants,
                                                      DataService,
                                                      LabelFilter,
                                                      Logger,
                                                      ProjectsService) {
    $scope.alerts = {};
    $scope.bindingsByInstanceRef = {};
    $scope.emptyMessage = "Loading...";
    $scope.labelSuggestions = {};
    $scope.projectName = $routeParams.project;
    $scope.serviceClasses = {};
    $scope.serviceInstances = {};
    $scope.unfilteredServiceInstances = {};

    var watches = [];

    var updateFilter = function() {
      $scope.serviceInstances = LabelFilter.getLabelSelector().select($scope.unfilteredServiceInstances);
    };

    var sortServiceInstances = function() {
      $scope.unfilteredServiceInstances = BindingService.sortServiceInstances($scope.unfilteredServiceInstances, $scope.serviceClasses);
    };

    ProjectsService
      .get($routeParams.project)
      .then(_.spread(function(project, context) {
        $scope.project = project;
        $scope.projectContext = context;

        watches.push(DataService.watch({
          group: 'servicecatalog.k8s.io',
          resource: 'serviceinstancecredentials'
        }, context, function(bindings) {
          var bindingsByName = bindings.by('metadata.name');
          $scope.bindingsByInstanceRef = _.groupBy(bindingsByName, 'spec.instanceRef.name');
        }));

        watches.push(DataService.watch({
          group: 'servicecatalog.k8s.io',
          resource: 'serviceinstances'
        }, context, function(serviceInstances) {
          $scope.emptyMessage = "No provisioned services to show";
          $scope.unfilteredServiceInstances = serviceInstances.by('metadata.name');

          sortServiceInstances();
          updateFilter();
          updateFilterWarning();

          LabelFilter.addLabelSuggestionsFromResources($scope.unfilteredServiceInstances, $scope.labelSuggestions);
          LabelFilter.setLabelSuggestions($scope.labelSuggestions);

          Logger.log("provisioned services (subscribe)", $scope.unfilteredServiceInstances);
        }));

        DataService.list({
          group: 'servicecatalog.k8s.io',
          resource: 'serviceclasses'
        }, {}, function(serviceClasses) {
          $scope.serviceClasses = serviceClasses.by('metadata.name');
          sortServiceInstances();
          updateFilter();
        });

        function updateFilterWarning() {
          if (!LabelFilter.getLabelSelector().isEmpty() && _.isEmpty($scope.serviceInstances)  && !_.isEmpty($scope.unfilteredServiceInstances)) {
            $scope.alerts["all-instances-filtered"] = {
              type: "warning",
              details: "The active filters are hiding all provisioned services."
            };
          }
          else {
            delete $scope.alerts["all-instances-filtered"];
          }
        }

        LabelFilter.onActiveFiltersChanged(function(labelSelector) {
          // trigger a digest loop
          $scope.$evalAsync(function() {
            $scope.serviceInstances = labelSelector.select($scope.unfilteredServiceInstances);
            updateFilterWarning();
          });
        });

        $scope.$on('$destroy', function(){
          DataService.unwatchAll(watches);
        });

      }));
  });
