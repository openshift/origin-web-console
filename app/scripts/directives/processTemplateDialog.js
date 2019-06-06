'use strict';

(function() {
  angular.module('openshiftConsole').component('processTemplateDialog', {
    controller: [
      '$scope',
      '$filter',
      '$routeParams',
      'Catalog',
      'DataService',
      'KeywordService',
      'NotificationsService',
      'ProjectsService',
      'RecentlyViewedProjectsService',
      'gettextCatalog',
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
                                 $routeParams,
                                 Catalog,
                                 DataService,
                                 KeywordService,
                                 NotificationsService,
                                 ProjectsService,
                                 RecentlyViewedProjectsService,
                                 gettextCatalog) {
    var ctrl = this;
    var validityWatcher;
    var imageForIconClass = $filter('imageForIconClass');
    var annotation = $filter('annotation');
    var normalizeIconClass = $filter('normalizeIconClass');

    ctrl.selectStep = {
      id: 'projectTemplates',
      label: gettextCatalog.getString('Selection'),
      view: 'views/directives/process-template-dialog/process-template-select.html',
      hidden: ctrl.useProjectTemplate !== true,
      allowed: true,
      valid: false,
      allowClickNav: true,
      onShow: showSelect
    };

    ctrl.infoStep = {
      id: 'info',
      label: gettextCatalog.getString('Information'),
      view: 'views/directives/process-template-dialog/process-template-info.html',
      allowed: true,
      valid: true,
      allowClickNav: true,
      onShow: showInfo
    };

    ctrl.configStep = {
      id: 'configuration',
      label: gettextCatalog.getString('Configuration'),
      view: 'views/directives/process-template-dialog/process-template-config.html',
      // Start initially as invalid so the button doesn't flicker when the dialog
      // is displayed and the template has required fields.
      valid: false,
      allowed: true,
      allowClickNav: true,
      onShow: showConfig
    };

    ctrl.resultsStep = {
      id: 'results',
      label: gettextCatalog.getString('Results'),
      view: 'views/directives/process-template-dialog/process-template-results.html',
      valid: true,
      allowed: false,
      prevEnabled: false,
      allowClickNav: false,
      onShow: showResults
    };

    ctrl.$onInit = function() {
      ctrl.loginBaseUrl = DataService.openshiftAPIBaseUrl();
      ctrl.preSelectedProject = ctrl.selectedProject = ctrl.project;
      if (ctrl.useProjectTemplate) {
        if (ctrl.project) {
          ctrl.templateProject = ctrl.project;
          ctrl.templateProjectChange();
        }
        listProjects();
      }

      ctrl.noProjectsCantCreate = false;
      $scope.$on('no-projects-cannot-create', function() {
        ctrl.noProjectsCantCreate = true;
      });

      ctrl.noProjectsEmptyState = {
        title: gettextCatalog.getString('No Available Projects'),
        info: gettextCatalog.getString('There are no projects available from which to load templates.')
      };

      ctrl.projectEmptyState = {
        title: gettextCatalog.getString('No Project Selected'),
        info: gettextCatalog.getString('Please select a project from the dropdown to load templates from that project.')
      };

      ctrl.templatesEmptyState = {
        title: gettextCatalog.getString('No Templates'),
        info: gettextCatalog.getString('The selected project has no templates available to import.')
      };

      ctrl.filterConfig = {
        fields: [
          {
            id: 'keyword',
            title:  gettextCatalog.getString('Keyword'),
            placeholder: gettextCatalog.getString('Filter by Keyword'),
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
      // if on the landing page, show the project name in next-steps
      if (!$routeParams.project) {
        ctrl.showProjectName = true;
      }
    };

    ctrl.$onChanges = function(changes) {
      if (changes.template) {
        if (ctrl.template) {
          initializeSteps();
          ctrl.iconClass = getIconClass();
          ctrl.image = getImage();
          ctrl.docUrl = annotation(ctrl.template, "openshift.io/documentation-url");
          ctrl.supportUrl = annotation(ctrl.template, "openshift.io/support-url");
          ctrl.vendor = annotation(ctrl.template, "openshift.io/provider-display-name");
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
      ctrl.iconClass = getIconClass();
      ctrl.image = getImage();
      ctrl.docUrl = annotation(ctrl.template, "openshift.io/documentation-url");
      ctrl.supportUrl = annotation(ctrl.template, "openshift.io/support-url");
      ctrl.vendor = annotation(ctrl.template, "openshift.io/provider-display-name");
    };

    ctrl.templateProjectChange = function () {
      ctrl.templateProjectName = _.get(ctrl.templateProject, 'metadata.name');

      // Get the templates for the selected project
      ctrl.catalogItems = {};
      ctrl.templateSelected();

      Catalog.getProjectCatalogItems(ctrl.templateProjectName, false, true).then( _.spread(function(catalogServiceItems, errorMessage) {
        ctrl.catalogItems = catalogServiceItems;
        ctrl.totalCount = ctrl.catalogItems.length;

        // Clear previous filters
        filterChange();

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

    // TODO: Update the select-project component in the origin-web-catalog to optionally
    // disable creating new projects, so we can reuse it.
    ctrl.groupChoicesBy = function (item) {
      if (RecentlyViewedProjectsService.isRecentlyViewed(item.metadata.uid)) {
        return gettextCatalog.getString("Recently Viewed");
      }
      return gettextCatalog.getString("Other Projects");
    };

    function getIconClass() {
      return normalizeIconClass(_.get(ctrl, 'template.metadata.annotations.iconClass', 'fa fa-clone'));
    }

    function getImage() {
      var iconClass = _.get(ctrl, 'template.metadata.annotations.iconClass', 'fa fa-clone');
      return imageForIconClass(iconClass);
    }

    function initializeSteps() {
      if (!ctrl.steps) {
        ctrl.steps = [ctrl.selectStep, ctrl.infoStep, ctrl.configStep, ctrl.resultsStep];
      }
    }

    function clearValidityWatcher() {
      if (validityWatcher) {
        validityWatcher();
        validityWatcher = undefined;
      }
    }

    function showInfo() {
      ctrl.infoStep.selected = true;
      ctrl.selectStep.selected = false;
      ctrl.configStep.selected = false;
      ctrl.resultsStep.selected = false;
      ctrl.nextTitle = gettextCatalog.getString("Next >");
      clearValidityWatcher();
    }

    function showSelect() {
      ctrl.infoStep.selected = false;
      ctrl.selectStep.selected = true;
      ctrl.configStep.selected = false;
      ctrl.resultsStep.selected = false;
      ctrl.nextTitle = gettextCatalog.getString("Next >");
      clearValidityWatcher();
      listProjects();
    }

    function showConfig() {
      ctrl.infoStep.selected = false;
      ctrl.selectStep.selected = false;
      ctrl.configStep.selected = true;
      ctrl.resultsStep.selected = false;
      ctrl.nextTitle = gettextCatalog.getString("Create");
      ctrl.resultsStep.allowed = ctrl.configStep.valid;

      validityWatcher = $scope.$watch("$ctrl.form.$valid", function(isValid) {
        ctrl.configStep.valid = isValid && !ctrl.noProjectsCantCreate && ctrl.selectedProject;
        ctrl.resultsStep.allowed = isValid;
      });
    }

    function showResults() {
      ctrl.infoStep.selected = false;
      ctrl.selectStep.selected = false;
      ctrl.configStep.selected = false;
      ctrl.resultsStep.selected = true;
      ctrl.nextTitle = gettextCatalog.getString("Close");
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
      ctrl.filterConfig.resultsCount = ctrl.filteredItems.length;

      // Deselect the currently selected template if it was filtered out
      if (!_.includes(ctrl.filteredItems, ctrl.selectedTemplate)) {
        ctrl.templateSelected();
      }
    }

    var updateProjects = function() {
      var filteredProjects = _.reject(ctrl.unfilteredProjects, 'metadata.deletionTimestamp');
      var projects = _.sortBy(filteredProjects, $filter('displayName'));
      ctrl.searchEnabled = !_.isEmpty(filteredProjects);

      ctrl.templateProjects = RecentlyViewedProjectsService.orderByMostRecentlyViewed(projects);
      ctrl.numTemplateProjects = _.size(ctrl.templateProjects);

      if (ctrl.numTemplateProjects === 1) {
        ctrl.templateProject = _.head(ctrl.templateProjects);
        ctrl.templateProjectChange();
      }
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
