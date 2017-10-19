'use strict';

angular.module('openshiftConsole')
  .controller('ServiceInstanceController', function ($scope,
                                                     $filter,
                                                     $routeParams,
                                                     APIService,
                                                     BindingService,
                                                     AuthorizationService,
                                                     Catalog,
                                                     DataService,
                                                     Logger,
                                                     ProjectsService,
                                                     SecretsService,
                                                     ServiceInstancesService) {
    $scope.alerts = {};
    $scope.projectName = $routeParams.project;
    $scope.serviceInstance = null;
    $scope.serviceClass = null;
    $scope.serviceClasses = null;
    $scope.editDialogShown = false;

    $scope.breadcrumbs = [
      {
        title: "Provisioned Services",
        link: "project/" + $routeParams.project + "/browse/service-instances"
      }
    ];

    $scope.deprovision = function() {
      if ($scope.serviceInstance.metadata.deletionTimestamp) {
        return;
      }
      ServiceInstancesService.deprovision($scope.serviceInstance, $scope.bindings);
    };

    $scope.showEditDialog = function() {
      $scope.editDialogShown = true;
    };

    $scope.showParameterValues = false;

    $scope.toggleShowParameterValues = function() {
      $scope.showParameterValues = !$scope.showParameterValues;
    };

    $scope.closeEditDialog = function() {
      $scope.editDialogShown = false;
    };

    var watches = [];
    var secretWatchers = [];
    var serviceClassPromise;

    var serviceInstanceDisplayName = $filter('serviceInstanceDisplayName');
    var serviceInstanceReady = $filter('isServiceInstanceReady');

    // API Versions
    var serviceBindingsVersion = APIService.getPreferredVersion('servicebindings');
    $scope.serviceInstancesVersion = APIService.getPreferredVersion('serviceinstances');

    var updateBreadcrumbs = function() {
      $scope.breadcrumbs.push({
        title: $scope.displayName
      });
    };

    var updateParameterData = function() {
      if (!$scope.serviceInstance || !$scope.parameterSchema) {
        return;
      }

      DataService.unwatchAll(secretWatchers);
      secretWatchers = [];

      $scope.parameterData = {};
      _.each(_.keys(_.get($scope.parameterSchema, 'properties')), function(key) {
        $scope.parameterData[key] = $scope.parameterSchema.properties[key].default;
      });

      $scope.parameterData = angular.extend($scope.parameterData, _.get($scope.serviceInstance, 'spec.parameters', {}));

      if (AuthorizationService.canI('secrets', 'get', $scope.projectName)) {
        _.each(_.get($scope.serviceInstance, 'spec.parametersFrom'), function (parametersSource) {
          secretWatchers.push(DataService.watchObject("secrets", _.get(parametersSource, 'secretKeyRef.name'), $scope.projectContext, function (secret) {
            try {
              _.extend($scope.parameterData, JSON.parse(SecretsService.decodeSecretData(secret.data)[parametersSource.secretKeyRef.key]));
            } catch (e) {
              Logger.warn('Unable to load parameters from secret ' + _.get(parametersSource, 'secretKeyRef.name'), e);
            }
          }));
        });
      }
    };

    var updateEditable = function() {
      if (!$scope.plan || !$scope.serviceClass || !$scope.serviceInstance) {
        return;
      }

      var updateSchema = _.get($scope.plan, 'spec.instanceUpdateParameterSchema');
      var planUpdatable = (_.size(_.get(updateSchema, 'properties')) > 0) || (_.get($scope.serviceClass, 'spec.planUpdatable') && (_.size($scope.servicePlans) > 1));

      $scope.editAvailable = planUpdatable && serviceInstanceReady($scope.serviceInstance) && !_.get($scope.serviceInstance, 'metadata.deletionTimestamp');
    };

    var updateParameterSchema = function() {
      $scope.parameterFormDefinition = angular.copy(_.get($scope.plan, 'spec.externalMetadata.schemas.service_instance.update.openshift_form_definition'));
      $scope.parameterSchema = _.get($scope.plan, 'spec.instanceCreateParameterSchema');
    };

    var updateServiceClass = function() {
      // If we've previously loaded the service class or a request is in flight, don't do anything.
      if (!$scope.serviceInstance || $scope.serviceClass || serviceClassPromise) {
        return;
      }

      serviceClassPromise = ServiceInstancesService.fetchServiceClassForInstance($scope.serviceInstance).then(function (serviceClass) {
        $scope.serviceClass = serviceClass;
        $scope.displayName = serviceInstanceDisplayName($scope.serviceInstance, $scope.serviceClass);

        updateBreadcrumbs();
        serviceClassPromise = null;

        Catalog.getServicePlans().then(function (plans) {
          plans = plans.by('metadata.name');

          var plansByServiceClassName = Catalog.groupPlansByServiceClassName(plans);
          $scope.servicePlans = plansByServiceClassName[$scope.serviceClass.metadata.name];

          var servicePlanName = _.get($scope.serviceInstance, 'spec.clusterServicePlanRef.name');
          $scope.plan = plans[servicePlanName];

          updateParameterSchema();
          updateParameterData();
          updateEditable();
        });
      });
    };

    var serviceResolved = function(serviceInstance, action) {
      $scope.loaded = true;
      $scope.serviceInstance = serviceInstance;

      if (action === "DELETED") {
        $scope.alerts["deleted"] = {
          type: "warning",
          message: "This provisioned service has been deleted."
        };
      }

      updateServiceClass();
      updateParameterData();
      updateEditable();
    };

    ProjectsService
      .get($routeParams.project)
      .then(_.spread(function(project, context) {
        $scope.project = project;
        $scope.projectContext = context;

        DataService
          .get($scope.serviceInstancesVersion, $routeParams.instance, context, { errorNotification: false })
          .then(function(serviceInstance) {
            serviceResolved(serviceInstance);
            watches.push(DataService.watchObject($scope.serviceInstancesVersion, $routeParams.instance, context, serviceResolved));

            watches.push(DataService.watch(serviceBindingsVersion, context, function(bindingsData) {
              var allBindings = bindingsData.by('metadata.name');
              $scope.bindings = BindingService.getBindingsForResource(allBindings, serviceInstance);
            }));
          }, function(error) {
            $scope.loaded = true;
            $scope.alerts["load"] = {
              type: "error",
              message: "The provisioned service details could not be loaded.",
              details: $filter('getErrorDetails')(error)
            };
          });
      }, function(error) {
        $scope.loaded = true;
        $scope.alerts["load"] = {
          type: "error",
          message: "The service details could not be loaded.",
          details: $filter('getErrorDetails')(error)
        };
      }));

    $scope.$on('$destroy', function(){
      DataService.unwatchAll(watches);
      DataService.unwatchAll(secretWatchers);
    });
  });
