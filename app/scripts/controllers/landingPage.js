'use strict';

angular.module('openshiftConsole')
  .controller('LandingPageController',
              function($scope,
                       AuthService,
                       Constants,
                       DataService,
                       Navigate,
                       NotificationsService) {
    $scope.saasOfferings = Constants.SAAS_OFFERINGS;

    $scope.viewMembership = function(project) {
      Navigate.toProjectMembership(project.metadata.name);
    };

    // Currently this is the only page showing notifications, clear any that came previous pages.
    // Once all pages show notifications this should be removed.
    NotificationsService.clearNotifications();

    AuthService.withUser().then(function() {
      DataService.list({
        group: 'servicecatalog.k8s.io',
        resource: 'serviceclasses'
      }, $scope).then(function(resp) {
        $scope.serviceClasses = resp.by('metadata.name');
      });

      DataService.list('imagestreams', { namespace: 'openshift' }).then(function(resp) {
        $scope.imageStreams = resp.by('metadata.name');
      });
    });
  });
