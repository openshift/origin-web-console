'use strict';

angular.module('openshiftConsole')
  .controller('ServiceInstanceController', function ($scope,
                                                     $filter,
                                                     $routeParams,
                                                     DataService,
                                                     ProjectsService,
                                                     ServiceInstancesService) {
    $scope.alerts = {};
    $scope.projectName = $routeParams.project;
    $scope.serviceInstance = null;
    $scope.serviceClass = null;
    $scope.serviceClasses = null;

    $scope.breadcrumbs = [
      {
        title: "Provisioned Services",
        link: "project/" + $routeParams.project + "/browse/service-instances"
      }
    ];

    $scope.deprovision = function() {
      ServiceInstancesService.deprovision($scope.serviceInstance);
    };

    var watches = [];

    var updateBreadcrumbs = function() {
      if(!$scope.serviceInstance || !$scope.serviceClasses) {
        return;
      }

      $scope.breadcrumbs.push({
        title: $filter('serviceInstanceDisplayName')($scope.serviceInstance, $scope.serviceClasses)
      });
    };

    var updateServiceClassMetadata = function() {
      if(!$scope.serviceInstance || !$scope.serviceClasses) {
        return;
      }

      var serviceClassName = _.get($scope.serviceInstance.spec, 'serviceClassName');
      $scope.serviceClass = _.get($scope.serviceClasses, [serviceClassName]);
      $scope.plan = _.find(_.get($scope.serviceClass, 'plans'), {name: $scope.serviceInstance.spec.planName });
    };

    var serviceResolved = function(service, action) {
      $scope.loaded = true;
      $scope.serviceInstance = service;

      if (action === "DELETED") {
        $scope.alerts["deleted"] = {
          type: "warning",
          message: "This provisioned service has been deleted."
        };
      }

      updateServiceClassMetadata();
    };

    ProjectsService
      .get($routeParams.project)
      .then(_.spread(function(project, context) {
        $scope.project = project;
        $scope.projectContext = context;

        DataService
          .get({
            group: 'servicecatalog.k8s.io',
            resource: 'serviceinstances'
          }, $routeParams.instance, context, { errorNotification: false })
          .then(function(service) {

            serviceResolved(service);
            updateBreadcrumbs();

            watches.push(DataService.watchObject({
              group: 'servicecatalog.k8s.io',
              resource: 'serviceinstances'
            }, $routeParams.instance, context, serviceResolved));

          }, function(error) {
            $scope.loaded = true;
            $scope.alerts["load"] = {
              type: "error",
              message: "The service details could not be loaded.",
              details: $filter('getErrorDetails')(error)
            };
          });

        DataService.list({
          group: 'servicecatalog.k8s.io',
          resource: 'serviceclasses'
        }, context, function(serviceClasses) {
          $scope.serviceClasses = serviceClasses.by('metadata.name');
          updateServiceClassMetadata();
          updateBreadcrumbs();
        });

        $scope.$on('$destroy', function(){
          DataService.unwatchAll(watches);
        });

    }));
  });
