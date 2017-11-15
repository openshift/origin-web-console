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

    var serviceBindingsVersion = APIService.getPreferredVersion('servicebindings');
    $scope.eventsVersion = APIService.getPreferredVersion('events');
    $scope.serviceInstancesVersion = APIService.getPreferredVersion('serviceinstances');

    var watches = [];
    var secretWatchers = [];
    var serviceClassPromise;
    var servicePlansPromise;

    var serviceInstanceDisplayName = $filter('serviceInstanceDisplayName');
    var isServiceInstanceFailed = $filter('isServiceInstanceFailed');

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

      $scope.allowParametersReveal = AuthorizationService.canI('secrets', 'get', $scope.projectName);
      $scope.parameterData = {};
      $scope.opaqueParameterKeys = [];

      // Set defaults for schema values
      var defaultValue = $scope.allowParametersReveal ? '' : '*****';
      _.each(_.keys(_.get($scope.parameterSchema, 'properties')), function (key) {
        $scope.parameterData[key] = defaultValue;
      });

      // Get the current status's parameter values
      var statusParameters = _.get($scope.serviceInstance, 'status.externalProperties.parameters', {});
      _.each(_.keys(statusParameters), function(key) {
        if (statusParameters[key] === '<redacted>') {
          $scope.parameterData[key] = '*****';
        } else {
          $scope.parameterData[key] = statusParameters[key];
          $scope.opaqueParameterKeys.push(key);
        }
      });

      // Fill in the secret values if they are available to the user
      if ($scope.allowParametersReveal) {
        // Get the data from each secret
        _.each(_.get($scope.serviceInstance, 'spec.parametersFrom'), function (parametersSource) {
          secretWatchers.push(DataService.watchObject("secrets", _.get(parametersSource, 'secretKeyRef.name'), $scope.projectContext, function (secret) {
            try {
              var secretData = JSON.parse(SecretsService.decodeSecretData(secret.data)[parametersSource.secretKeyRef.key]);
              // TODO: Only include fields from the secret that are part of the schema
              _.extend($scope.parameterData, secretData);
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
      var updatable = (_.size(_.get(updateSchema, 'properties')) > 0) || (_.get($scope.serviceClass, 'spec.planUpdatable') && (_.size($scope.servicePlans) > 1));

      $scope.editAvailable =
        updatable &&
        // Instances in failed state are considered permanently failed and shouldn't be updated.
        !isServiceInstanceFailed($scope.serviceInstance) &&
        // Wait until either the provision or other async operation completes before letting the user edit.
        !_.get($scope.serviceInstance, 'status.asyncOpInProgress') &&
        // Don't allow editing deleted instances.
        !_.get($scope.serviceInstance, 'metadata.deletionTimestamp');
    };

    var updateParameterSchema = function() {
      $scope.parameterFormDefinition = angular.copy(_.get($scope.plan, 'spec.externalMetadata.schemas.service_instance.update.openshift_form_definition'));
      $scope.parameterSchema = _.get($scope.plan, 'spec.instanceCreateParameterSchema');
      updateParameterData();
    };

    var updateServicePlan = function() {
      var servicePlanName = _.get($scope.serviceInstance, 'spec.clusterServicePlanRef.name');
      $scope.plan = _.find($scope.servicePlans, { metadata: { name: servicePlanName } });
      updateParameterSchema();
      updateEditable();
    };

    var updateServicePlans = function() {
      if (!$scope.serviceClass || servicePlansPromise) {
        return;
      }

      if (!$scope.servicePlans) {
        servicePlansPromise = Catalog.getServicePlansForServiceClass($scope.serviceClass).then(function (plans) {
          var servicePlanName = _.get($scope.serviceInstance, 'spec.clusterServicePlanRef.name');
          $scope.servicePlans = _.reject(plans.by('metadata.name'), function(plan) {
            return _.get(plan, 'status.removedFromBrokerCatalog') && (plan.metadata.name !== servicePlanName);
          });

          updateServicePlan();
          servicePlansPromise = null;
        });
      } else {
        updateServicePlan();
      }
    };

    var updateServiceClass = function() {
      if (!$scope.serviceInstance || serviceClassPromise) {
        return;
      }

      if ($scope.serviceClass) {
        updateServicePlans();
      } else {
        serviceClassPromise = ServiceInstancesService.fetchServiceClassForInstance($scope.serviceInstance).then(function (serviceClass) {
          $scope.serviceClass = serviceClass;
          $scope.displayName = serviceInstanceDisplayName($scope.serviceInstance, $scope.serviceClass);

          updateBreadcrumbs();
          serviceClassPromise = null;
          updateServicePlans();
        });
      }
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
