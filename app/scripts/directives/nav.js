'use strict';

angular.module('openshiftConsole')
  .directive('sidebar', function($location, $filter, Constants) {
    var canI = $filter('canI');
    var itemMatchesPath = function(item, path) {
      return (item.href === path) || _.some(item.prefixes, function(prefix) {
            return _.startsWith(path, prefix);
          });
    };
    return {
      restrict: 'E',
      templateUrl: 'views/_sidebar.html',
      controller: function($scope) {
        var path = $location.path().replace("/project/" + $scope.projectName, "");
        $scope.activeSecondary;
        $scope.navItems = Constants.PROJECT_NAVIGATION;
        $scope.activePrimary = _.find($scope.navItems, function(primaryItem) {
          if (itemMatchesPath(primaryItem, path)) {
            $scope.activeSecondary = null;
            return true;
          }

          // Check if there is a secondary nav item that is active
          return _.some(primaryItem.secondaryNavSections, function(secondarySection) {
            var activeSecondary = _.find(secondarySection.items, function(secondaryItem) {
              return itemMatchesPath(secondaryItem, path);
            });
            if (activeSecondary) {
              $scope.activeSecondary = activeSecondary;
              return true;
            }
            return false;
          });
        });

        $scope.navURL = function(href) {
          if (!href) {
            return '';
          }
          if ($filter('isAbsoluteURL')(href)) {
            return href;
          }
          return "project/" + $scope.projectName + href;
        };

        $scope.show = function(item) {
          var isValid = !item.isValid || item.isValid();
          if(!isValid) {
            return false;
          }
          var userCan = item.canI ?
                        canI(item.canI.resource, item.canI.verb, item.canI.group) :
                        true;

          return userCan;
        };
      }
    };
  })
  .directive('projectHeader', function($timeout, $location, $filter, ProjectsService, projectOverviewURLFilter, Constants, gettextCatalog, gettext) {

    // cache these to eliminate flicker
    var projects = {};
    var sortedProjects = [];

    var displayName = $filter('displayName');
    var uniqueDisplayName = $filter('uniqueDisplayName');

    return {
      restrict: 'EA',
      templateUrl: 'views/directives/header/project-header.html',
      link: function($scope, $elem) {
        var MAX_PROJETS_TO_DISPLAY = 100;

        $scope.closeOrderingPanel = function() {
          _.set($scope, 'ordering.panelName', "");
        };
        $scope.showOrderingPanel = function(panelName) {
          _.set($scope, 'ordering.panelName', panelName);
        };

        $scope.catalogLandingPageEnabled = _.get(Constants, 'ENABLE_TECH_PREVIEW_FEATURE.service_catalog_landing_page');
        var select = $elem.find('.selectpicker');
        var options = [];

        var updateOptions = function() {
          var project = $scope.project || {};
          $scope.context = {
            namespace: $scope.projectName
          };
          var name = $scope.projectName;
          var isRealProject = project.metadata && project.metadata.name;

          // If we don't have a name or a real project, nothing to do yet.
          if (!name && !isRealProject) {
            return;
          }

          if (!name) {
            name = project.metadata.name;
          }

          if (!isRealProject) {
            project = {
              metadata: {
                name: name
              }
            };
          }

          if(!projects[name]) {
            projects[name] = project;
          }

          var makeOption = function(project, skipUniqueCheck) {
            var option = $('<option>').attr("value", project.metadata.name).attr("selected", project.metadata.name === name);
            if (skipUniqueCheck) {
              option.text(displayName(project));
            } else {
              // FIXME: This is pretty inefficient, but probably OK if
              // MAX_PROJETS_TO_DISPLAY is not too large.
              option.text(uniqueDisplayName(project, sortedProjects));
            }

            return option;
          };

          // Only show all projects in the dropdown if less than a max number.
          // Otherwise it's not usable and might impact performance.
          if (_.size(projects) <= MAX_PROJETS_TO_DISPLAY) {
            sortedProjects = $filter('orderByDisplayName')(projects);
            options = _.map(sortedProjects, function(project) {
              return makeOption(project, false);
            });
          } else {
            // Show the current project and a "View all Projects" link.
            options = [ makeOption(projects[name], true) ];
          }

          select.empty();
          select.append(options);
          select.append($('<option data-divider="true"></option>'));
          select.append($('<option value="">View all Projects</option>'));
          select.append($('<option value="">' + gettextCatalog.getString(gettext('View all projects')) + '</option>'));
          select.selectpicker('refresh');
        };


        ProjectsService.list().then(function(items) {
          projects = items.by("metadata.name");
          updateOptions();
        });

        updateOptions();

        select
          .selectpicker({
            iconBase: 'fa',
            tickIcon: 'fa-check'
          })
          .change(function() {
            var val = $(this).val();
            var newURL = (val === "") ? "projects" : projectOverviewURLFilter(val);
            $scope.$apply(function() {
              $location.url(newURL);
            });
          });

        $scope.$on('project.settings.update', function(event, data) {
          projects[data.metadata.name] = data;
          updateOptions();
        });

      }
    };
  })
  .directive('projectFilter', function(LabelFilter, gettext) {
    return {
      restrict: 'E',
      templateUrl: 'views/directives/_project-filter.html',
      link: function($scope, $elem) {
        LabelFilter.setupFilterWidget($elem.find('.navbar-filter-widget'), $elem.find('.active-filters'), { addButtonText: gettext("Add") });
        LabelFilter.toggleFilterWidget(!$scope.renderOptions || !$scope.renderOptions.hideFilterWidget);

        $scope.$watch("renderOptions", function(renderOptions) {
          LabelFilter.toggleFilterWidget(!renderOptions || !renderOptions.hideFilterWidget);
        });
      }
    };
  })
  .directive('projectPage', function() {
    return {
      restrict: 'E',
      transclude: true,
      templateUrl: 'views/_project-page.html'
    };
  })
  .directive('navbarUtility', function() {
    return {
      restrict: 'E',
      transclude: true,
      templateUrl: 'views/directives/header/_navbar-utility.html',
      controller: function($scope, Constants) {
        $scope.launcherApps = Constants.APP_LAUNCHER_NAVIGATION;
      }
    };
  })
  .directive('navbarUtilityMobile', function() {
    return {
      restrict: 'E',
      transclude: true,
      templateUrl: 'views/directives/header/_navbar-utility-mobile.html'
    };
  })
  .directive('defaultHeader', function() {
    return {
      restrict: 'E',
      transclude: true,
      templateUrl: 'views/directives/header/default-header.html'
    };
  })
  // TODO: rename this :)
  .directive('navPfVerticalAlt', function() {
    return {
      restrict: 'EAC',
      link: function() {
        // Short term solution to trigger the patternfly nav
        $.fn.navigation();
      }
    };
  })
  .directive('breadcrumbs', function() {
    return {
      restrict: 'E',
      scope: {
        breadcrumbs: '='
      },
      templateUrl: 'views/directives/breadcrumbs.html'
    };
  })
  .directive('back', ['$window', function($window) {
    return {
      restrict: 'A',
      link: function (scope, elem) {
        elem.bind('click', function () {
          $window.history.back();
        });
      }
    };
  }]);
