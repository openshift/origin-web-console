'use strict';


angular.module('openshiftConsole')
  .component('eventsPage', {
    bindings: {},
    templateUrl: 'components/pages/events/events.html',
    controller: function ($routeParams, $scope, ProjectsService) {
        var ctrl = this;
        ctrl.projectName = $routeParams.project;
        ctrl.renderOptions = {
          hideFilterWidget: true
        };

        ctrl.breadcrumbs = [
          {
            title: "Monitoring",
            link: "project/" + $routeParams.project + "/monitoring"
          },
          {
            title: 'Events'
          }
        ];

        ProjectsService
          .get($routeParams.project)
          .then(_.spread(function(project, context) {
            ctrl.project = project;
            ctrl.projectContext = context;
          }));
      }
  });
