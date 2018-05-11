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
      var isServiceInstanceReady = $filter('isServiceInstanceReady');

      var watches = [];
      ctrl.projectName = $routeParams.project;
      ctrl.emptyMessage = 'Loading...';
      ctrl.alerts = {};
      ctrl.redirectUrl = Navigate.projectOverviewURL(ctrl.projectName);
      $scope.breadcrumbs = [
        {
          title: 'Mobile Clients',
          link: ctrl.redirectUrl + '/browse/mobile-clients'
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
            DataService.list(APIService.getPreferredVersion('clusterserviceclasses'), ctrl.projectContext),
            DataService.get(APIService.getPreferredVersion('mobileclients'), $routeParams.mobileclient, context, { errorNotification: false })
          ]).then(_.spread(function(serviceClasses, mobileClient) {
              ctrl.loaded = true;

              ctrl.serviceClasses = serviceClasses.by('metadata.name');
              ctrl.mobileClient = mobileClient;

              watches.push(DataService.watchObject(APIService.getPreferredVersion('mobileclients'), $routeParams.mobileclient, context, function(mobileClient, action) {
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
                ctrl.mobileCIEnabled = _.some($scope.serviceInstances, function(serviceInstance) {
                  console.log(serviceInstance.metadata.name + " :: ready = " + isServiceInstanceReady(serviceInstance));
                  return /aerogear-digger/.test(serviceInstance.metadata.name) && isServiceInstanceReady(serviceInstance);
                });
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

      $scope.$on('$destroy', function(){
        DataService.unwatchAll(watches);
      });

    });
