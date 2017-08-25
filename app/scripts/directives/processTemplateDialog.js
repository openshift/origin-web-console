'use strict';

(function() {
  angular.module('openshiftConsole').component('processTemplateDialog', {
    controller: [
      '$scope',
      '$filter',
      'Catalog',
      'DataService',
      'KeywordService',
      'NotificationsService',
      'ProjectsService',
      'RecentlyViewedProjectsService',
      ProcessTemplateDialog
    ],
    controllerAs: '$ctrl',
    bindings: {
      template: '<',
      project: '<',
      useProjectTemplate: '<',
      onDialogClosed: '&'
    },
    templateUrl: 'views/directives/process-template-dialog.html'
  });

  function ProcessTemplateDialog($scope,
                                 $filter,
                                 Catalog,
                                 DataService,
                                 KeywordService,
                                 NotificationsService,
                                 ProjectsService,
                                 RecentlyViewedProjectsService) {
    var ctrl = this;
    var validityWatcher;

    ctrl.selectStep = {
      id: 'projectTemplates',
      label: 'Selection',
      view: 'views/directives/process-template-dialog/process-template-select.html',
      hidden: ctrl.useProjectTemplate !== true,
      allowed: true,
      valid: false,
      onShow: showSelect
    };

    ctrl.configStep = {
      id: 'configuration',
      label: 'Configuration',
      view: 'views/directives/process-template-dialog/process-template-config.html',
      // Start initially as invalid so the button doesn't flicker when the dialog
      // is displayed and the template has required fields.
      valid: false,
      allowed: true,
      onShow: showConfig
    };

    ctrl.resultsStep = {
      id: 'results',
      label: 'Results',
      view: 'views/directives/process-template-dialog/process-template-results.html',
      valid: true,
      allowed: false,
      prevEnabled: false,
      onShow: showResults
    };


    ctrl.$onInit = function() {
      ctrl.loginBaseUrl = DataService.openshiftAPIBaseUrl();
      ctrl.preSelectedProject = ctrl.selectedProject = ctrl.project;
      listProjects();

      ctrl.projectEmptyState = {
        icon: 'pficon pficon-info',
        title: 'No Project Selected',
        info: 'Please select a project from the dropdown to load Templates from that project.'
      };

      ctrl.templatesEmptyState = {
        icon: 'pficon pficon-info',
        title: 'No Templates',
        info: 'The selected project has no templates available to import.'
      };

      ctrl.filterConfig = {
        fields: [
          {
            id: 'keyword',
            title:  'Keyword',
            placeholder: 'Filter by Keyword',
            filterType: 'text'
          }
        ],
        inlineResults: true,
        showTotalCountResults: true,
        itemsLabel: 'Item',
        itemsLabelPlural: 'Items',
        resultsCount: 0,
        appliedFilters: [],
        onFilterChange: filterChange
      };
    };

    ctrl.$onChanges = function(changes) {
      if (changes.template) {
        if (ctrl.template) {
          initializeSteps();
          ctrl.iconClass = getIconClass();
        }
      }
      if (changes.useProjectTemplate) {
        initializeSteps();
      }
    };

    $scope.$on('templateInstantiated', function(event, message) {
      ctrl.selectedProject = message.project;
      ctrl.currentStep = ctrl.resultsStep.label;
    });

    ctrl.$onDestroy = function() {
      clearValidityWatcher();
    };

    ctrl.next = function(step) {
      if (step.stepId === ctrl.configStep.id) {
        instantiateTemplate();
        // Don't advance wizard automatically. Wait for template validation to complete.
        return false;
      }

      if (step.stepId === ctrl.resultsStep.id) {
        ctrl.close();
        return false;
      }

      return true;
    };

    ctrl.close = function() {
      var cb = ctrl.onDialogClosed();
      if (_.isFunction(cb)) {
        cb();
      }
    };

    ctrl.onProjectSelected = function(project) {
      ctrl.selectedProject = project;
      ctrl.configStep.valid = $scope.$ctrl.form.$valid && ctrl.selectedProject;
    };

    ctrl.templateSelected = function(template) {
      ctrl.selectedTemplate = template;
      ctrl.template = _.get(template, 'resource');
      ctrl.selectStep.valid = !!template;
    };

    ctrl.templateProjectChange = function () {
      ctrl.templateProjectName = _.get(ctrl.templateProject, 'metadata.name');

      // Get the templates for the selected project
      ctrl.catalogItems = {};
      ctrl.templateSelected();

      Catalog.getProjectCatalogItems(ctrl.templateProjectName, false, true).then( _.spread(function(catalogServiceItems, errorMessage) {
        ctrl.catalogItems = catalogServiceItems;
        ctrl.totalCount = ctrl.catalogItems.length;
        filterItems();

        if (errorMessage) {
          NotificationsService.addNotification(
            {
              type: "error",
              message: errorMessage
            }
          );
        }
      }));
    };

    function getIconClass() {
      var icon = _.get(ctrl, 'template.metadata.annotations.iconClass', 'fa fa-clone');
      return (icon.indexOf('icon-') !== -1) ? 'font-icon ' + icon : icon;
    }

    function initializeSteps() {
      if (!ctrl.steps) {
        ctrl.steps = [ctrl.selectStep, ctrl.configStep, ctrl.resultsStep];
      }
    }

    function clearValidityWatcher() {
      if (validityWatcher) {
        validityWatcher();
        validityWatcher = undefined;
      }
    }

    function showSelect() {
      ctrl.selectStep.selected = true;
      ctrl.configStep.selected = false;
      ctrl.resultsStep.selected = false;
      ctrl.nextTitle = "Next >";
      clearValidityWatcher();
      listProjects();
    }

    function showConfig() {
      ctrl.selectStep.selected = false;
      ctrl.configStep.selected = true;
      ctrl.resultsStep.selected = false;
      ctrl.nextTitle = "Create";
      ctrl.resultsStep.allowed = ctrl.configStep.valid;

      validityWatcher = $scope.$watch("$ctrl.form.$valid", function(isValid) {
        ctrl.configStep.valid = isValid && ctrl.selectedProject;
        ctrl.resultsStep.allowed = isValid;
      });
    }

    function showResults() {
      ctrl.selectStep.selected = false;
      ctrl.configStep.selected = false;
      ctrl.resultsStep.selected = true;
      ctrl.nextTitle = "Close";
      clearValidityWatcher();
      ctrl.wizardDone = true;
    }

    function instantiateTemplate() {
      $scope.$broadcast('instantiateTemplate');
    }

    function filterForKeywords(searchText, items) {
      return KeywordService.filterForKeywords(items, ['name', 'tags'], KeywordService.generateKeywords(searchText));
    }

    function filterChange(filters) {
      ctrl.filterConfig.appliedFilters = filters;
      filterItems();
    }

    function filterItems() {
      ctrl.filteredItems = ctrl.catalogItems;
      if (ctrl.filterConfig.appliedFilters && ctrl.filterConfig.appliedFilters.length > 0) {
        _.each(ctrl.filterConfig.appliedFilters, function(filter) {
          ctrl.filteredItems = filterForKeywords(filter.value, ctrl.filteredItems);
        });
      }

      // Deselect the currently selected template if it was filtered out
      if (!_.includes(ctrl.filteredItems, ctrl.selectedTemplate)) {
        ctrl.templateSelected();
      }

      updateFilterControls();
    }

    function updateFilterControls() {
      ctrl.filterConfig.resultsCount = ctrl.filteredItems.length;

      if (ctrl.totalCount <= 1) {
        $('.filter-pf.filter-fields input').attr('disabled', '');
      } else {
        $('.filter-pf.filter-fields input').removeAttr("disabled");
      }
    }

    var updateProjects = function() {
      var filteredProjects = _.reject(ctrl.unfilteredProjects, 'metadata.deletionTimestamp');
      var projects = _.sortBy(filteredProjects, $filter('displayName'));
      ctrl.searchEnabled = !_.isEmpty(filteredProjects);

      ctrl.templateProjects = RecentlyViewedProjectsService.orderByMostRecentlyViewed(projects);
    };

    function listProjects() {
      if (!ctrl.unfilteredProjects) {
        ProjectsService.list().then(function(projectData) {
          ctrl.unfilteredProjects = _.toArray(projectData.by("metadata.name"));
        }, function() {
          ctrl.unfilteredProjects = [];
        }).finally(function() {
          updateProjects();
        });
      }
    }
  }
})();
