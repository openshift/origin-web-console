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
    $scope.bindingsByInstanceRef = {};
    $scope.labelSuggestions = {};
    $scope.projectName = $routeParams.project;
    $scope.serviceClasses = {};
    $scope.serviceInstances = {};
    $scope.unfilteredServiceInstances = {};
    $scope.clearFilter = function() {
      LabelFilter.clear();
    };

    var serviceBindingsVersion = APIService.getPreferredVersion('servicebindings');
    var serviceClassesVersion = APIService.getPreferredVersion('clusterserviceclasses');
    $scope.serviceInstancesVersion = APIService.getPreferredVersion('serviceinstances');

    var watches = [];

    var updateFilter = function() {
      $scope.serviceInstances = LabelFilter.getLabelSelector().select($scope.unfilteredServiceInstances);
    };

    var sortServiceInstances = function() {
      $scope.unfilteredServiceInstances = BindingService.sortServiceInstances($scope.unfilteredServiceInstances, $scope.serviceClasses);
    };

    $scope.getServiceClass = function(serviceInstance) {
      var serviceClassName = _.get(serviceInstance, 'spec.clusterServiceClassRef.name');
      return _.get($scope, ['serviceClasses', serviceClassName]);
    };

    ProjectsService
      .get($routeParams.project)
      .then(_.spread(function(project, context) {
        $scope.project = project;
        $scope.projectContext = context;

        watches.push(DataService.watch(serviceBindingsVersion, context, function(bindings) {
          var bindingsByName = bindings.by('metadata.name');
          $scope.bindingsByInstanceRef = _.groupBy(bindingsByName, 'spec.instanceRef.name');
        }));

        watches.push(DataService.watch($scope.serviceInstancesVersion, context, function(serviceInstances) {
          $scope.serviceInstancesLoaded = true;
          $scope.unfilteredServiceInstances = serviceInstances.by('metadata.name');

          sortServiceInstances();
          updateFilter();
          updateFilterMessage();

          LabelFilter.addLabelSuggestionsFromResources($scope.unfilteredServiceInstances, $scope.labelSuggestions);
          LabelFilter.setLabelSuggestions($scope.labelSuggestions);

          Logger.log("provisioned services (subscribe)", $scope.unfilteredServiceInstances);
        }));

        DataService.list(serviceClassesVersion, {}, function(serviceClasses) {
          $scope.serviceClasses = serviceClasses.by('metadata.name');
          sortServiceInstances();
          updateFilter();
        });

        function updateFilterMessage() {
          $scope.filterWithZeroResults = !LabelFilter.getLabelSelector().isEmpty() && _.isEmpty($scope.serviceInstances) && !_.isEmpty($scope.unfilteredServiceInstances);
        }

        LabelFilter.onActiveFiltersChanged(function(labelSelector) {
          // trigger a digest loop
          $scope.$evalAsync(function() {
            $scope.serviceInstances = labelSelector.select($scope.unfilteredServiceInstances);
            updateFilterMessage();
          });
        });

        $scope.$on('$destroy', function(){
          DataService.unwatchAll(watches);
        });

      }));
  });
