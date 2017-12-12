'use strict';

angular.module('openshiftConsole')
  .controller('SetHomePageModalController', function ($scope, $uibModalInstance, HomePagePreference, ProjectsService) {
    $scope.preferredHomePage = HomePagePreference.getHomePagePreference();
    $scope.availableProjects = [];
    $scope.selectedProject = null;

    $scope.onProjectSelected = function(project) {
      $scope.selectedProject = project;
    };

    $scope.onOpen = function() {
      $scope.preferredHomePage = "project-overview";
    };

    $scope.preselectedProjectName = HomePagePreference.getProjectOverviewPage();

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
      var preferredHomePage = {type: $scope.preferredHomePage};
      if ($scope.preferredHomePage === 'project-overview' && $scope.selectedProject) {
        preferredHomePage.project = $scope.selectedProject.metadata.name
      }
      HomePagePreference.setHomePagePreference(preferredHomePage);
      $uibModalInstance.close('setHomePage');
    };

    $scope.cancel = function() {
      $uibModalInstance.dismiss('cancel');
    };
  });
