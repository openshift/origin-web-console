'use strict';

/**
 * @ngdoc function
 * @name openshiftConsole.controller:MobileClientsController
 * @description
 * Controller of the openshiftConsole
 */
angular.module('openshiftConsole')
  .controller('MobileClientsController', function(
    $filter,
    $q,
    $routeParams,
    $scope,
    APIService,
    DataService,
    Navigate,
    ProjectsService,
    NotificationsService,
    VALID_URL_PATTERN
  ) {
      var ctrl = this;
      var serviceInstanceVersion = APIService.getPreferredVersion('serviceinstances');
      var clusterServiceClassesVersion = APIService.getPreferredVersion('clusterserviceclasses');
      var mobileClientsVersion = APIService.getPreferredVersion('mobileclients');
      var isServiceInstanceReady = $filter('isServiceInstanceReady');

      var watches = [];
      ctrl.projectName = $routeParams.project;
      ctrl.emptyMessage = 'Loading...';
      ctrl.alerts = {};
      $scope.breadcrumbs = [
        {
          title: 'Mobile Clients',
          link: 'project/' + ctrl.projectName + '/browse/other?kind=MobileClient&group=' + mobileClientsVersion.group
        },
        {
          title: $routeParams.mobileclient
        }
      ];
      ctrl.validUrlPattern = VALID_URL_PATTERN;

      ctrl.setDmzUrl = function(dmzUrl) {
        var mobileClient = angular.copy(ctrl.mobileClient);
        mobileClient.spec['dmzUrl'] = dmzUrl;

        DataService.update(APIService.getPreferredVersion('mobileclients'), ctrl.mobileClient.metadata.name, mobileClient, ctrl.projectContext)
        .then(function() {
          NotificationsService.addNotification({
            type: "success",
            message: "Successfully updated the DMZ URL for " + ctrl.mobileClient.metadata.name
          });
        });
      };

      ProjectsService
        .get(ctrl.projectName)
        .then(_.spread(function(project, context) {
          ctrl.project = project;
          ctrl.projectContext = context;

          return $q.all([
            DataService.list(clusterServiceClassesVersion, ctrl.projectContext),
            DataService.list(serviceInstanceVersion, context),
            DataService.get(mobileClientsVersion, $routeParams.mobileclient, context, { errorNotification: false })
          ]).then(_.spread(function(serviceClasses, serviceInstances, mobileClient) {
              ctrl.loaded = true;

              ctrl.serviceClasses = serviceClasses.by('metadata.name');
              ctrl.serviceInstances = serviceInstances.by('metadata.name');
              ctrl.mobileClient = mobileClient;
              var marServiceInstanceName = _.get(ctrl, 'mobileClient.metadata.annotations.service_instance_name');
              var marClusterClassRef = _.get(ctrl, ['serviceInstances', marServiceInstanceName, 'spec', 'clusterServiceClassRef', 'name']);
              ctrl.coreSdkSetup = _.get(ctrl, ['serviceClasses', marClusterClassRef, 'spec', 'externalMetadata', 'documentationUrl']);

              watches.push(DataService.watchObject(mobileClientsVersion, $routeParams.mobileclient, context, function(mobileClient, action) {
                if (action === 'DELETED') {
                  ctrl.alerts['deleted'] = {
                    type: 'warning',
                    message: 'This mobile client has been deleted.'
                  };
                }
                ctrl.mobileClient = mobileClient;
              }));

              watches.push(DataService.watch(serviceInstanceVersion, context, function (serviceInstances) {
                $scope.serviceInstances = serviceInstances.by("metadata.name");
                ctrl.mobileCIService = _.find($scope.serviceInstances, function(serviceInstance) {
                  return /aerogear-digger/.test(serviceInstance.metadata.name);
                });

                ctrl.mobileCIProvisioning = _.get(ctrl, 'mobileCIService.status.currentOperation') === 'Provision';
                ctrl.mobileCIDeprovisioning = _.get(ctrl, 'mobileCIService.status.currentOperation') === 'Deprovision';
                ctrl.mobileCIEnabled = isServiceInstanceReady(ctrl.mobileCIService);
              }));

            }),
            function(e) {
              ctrl.loaded = true;
              ctrl.alerts['load'] = {
                type: 'error',
                message: e.status === 404 ? 'This mobile client can not be found, it may have been deleted.' : 'The mobile client details could not be loaded.',
                details: $filter('getErrorDetails')(e)
              };
            }
          );
        }));

      ctrl.goToMobileServices = function () {
        Navigate.toProjectCatalog(ctrl.projectName, {category: 'mobile', subcategory: 'services'});
      };

      $scope.$on('$destroy', function(){
        DataService.unwatchAll(watches);
      });

    });
