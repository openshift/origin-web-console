'use strict';

angular.module('openshiftConsole')
  .controller('SetHomePageModalController', function ($scope, $uibModalInstance, HomePagePreferenceService, ProjectsService) {
    $scope.homePagePreference = HomePagePreferenceService.getHomePagePreference();
    $scope.availableProjects = [];
    $scope.selectedProject = null;

    $scope.onProjectSelected = function(project) {
      $scope.selectedProject = project;
    };

    $scope.onOpen = function() {
      $scope.homePagePreference = "project-overview";
    };

    $scope.preselectedProjectName = HomePagePreferenceService.getHomePageProjectName();

    ProjectsService.list().then(function(projectData) {
      $scope.availableProjects = _.toArray(projectData.by("metadata.name"));
      $scope.availableProjects = _.reject($scope.availableProjects, 'metadata.deletionTimestamp');

      if ($scope.availableProjects.length === 1) {
        $scope.selectedProject = $scope.availableProjects[0];
      } else if ($scope.preselectedProjectName) {
        $scope.selectedProject = _.find($scope.availableProjects, {
          metadata: {
            name: $scope.preselectedProjectName
          }
        });
      }
    });

    $scope.setHomePage = function() {
      var homePagePreference = {type: $scope.homePagePreference};
      if ($scope.homePagePreference === 'project-overview' && $scope.selectedProject) {
        homePagePreference.project = $scope.selectedProject.metadata.name
      }
      HomePagePreferenceService.setHomePagePreference(homePagePreference);
      $uibModalInstance.close('setHomePage');
    };

    $scope.cancel = function() {
      $uibModalInstance.dismiss('cancel');
    };
  });
