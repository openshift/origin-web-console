'use strict';

angular.module('openshiftConsole')
  .directive('sidebar',
    function(
      $location,
      $filter,
      $timeout,
      $rootScope,
      Constants,
      HTMLService) {
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
        var hoverDelay = 300;
        var hideDelay = hoverDelay + 200;

        $scope.navItems = Constants.PROJECT_NAVIGATION;
        $scope.sidebar = {};

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

        $scope.onMouseEnter = function(primaryItem) {
          if (_.isEmpty(primaryItem.secondaryNavSections)) {
            return;
          }

          if (primaryItem.mouseLeaveTimeout) {
            $timeout.cancel(primaryItem.mouseLeaveTimeout);
            primaryItem.mouseLeaveTimeout = null;
          }

          primaryItem.mouseEnterTimeout = $timeout(function() {
            primaryItem.isHover = true;
            primaryItem.mouseEnterTimeout = null;
            $scope.sidebar.secondaryOpen = true;
          }, hoverDelay);
        };

        $scope.onMouseLeave = function(primaryItem) {
          if (_.isEmpty(primaryItem.secondaryNavSections)) {
            return;
          }

          if (primaryItem.mouseEnterTimeout) {
            $timeout.cancel(primaryItem.mouseEnterTimeout);
            primaryItem.mouseEnterTimeout = null;
          }

          primaryItem.mouseLeaveTimeout = $timeout(function() {
            primaryItem.isHover = false;
            primaryItem.mouseLeaveTimeout = null;
            $scope.sidebar.secondaryOpen = _.some($scope.navItems, function(primaryItem) {
              return primaryItem.isHover && !_.isEmpty(primaryItem.secondaryNavSections);
            });
          }, hideDelay);
        };

        $scope.collapseMobileSecondary = function(primaryItem, event) {
          primaryItem.mobileSecondary = false;
          event.stopPropagation();
        };

        var checkMobile = function() {
          return HTMLService.isWindowBelowBreakpoint(HTMLService.WINDOW_SIZE_SM);
        };

        $scope.isMobile = checkMobile();

        var onResize = _.throttle(function() {
          var isMobile = checkMobile();
          if (isMobile !== $scope.isMobile) {
            $scope.$evalAsync(function() {
              $scope.isMobile = isMobile;
              if (isMobile) {
                _.set($rootScope, 'nav.collapsed', false);
              } else {
                _.set($rootScope, 'nav.showMobileNav', false);
                _.each($scope.navItems, function(primaryItem) {
                  primaryItem.mobileSecondary = false;
                });
              }
            });
          }
        }, 50);
        $(window).on('resize.verticalnav', onResize);

        $scope.$on('$destroy', function() {
          $(window).off('.verticalnav');
        });
      }
    };
  })
  .directive('projectHeader',
    function(
      $filter,
      $location,
      $rootScope,
      $routeParams,
      $timeout,
      AuthorizationService,
      Constants,
      DataService,
      projectOverviewURLFilter) {

    // cache these to eliminate flicker
    var projects = {};
    var sortedProjects = [];

    return {
      restrict: 'EA',
      templateUrl: 'views/directives/header/project-header.html',
      link: function($scope, $elem) {
        $scope.toggleNav = function() {
          var collapsed = _.get($rootScope, 'nav.collapsed');
          _.set($rootScope, 'nav.collapsed', !collapsed);
        };

        $scope.toggleMobileNav = function() {
          var showMobileNav = _.get($rootScope, 'nav.showMobileNav');
          _.set($rootScope, 'nav.showMobileNav', !showMobileNav);
        };

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
          var name = $scope.projectName;
          if (!name) {
            return;
          }

          sortedProjects = $filter('orderByDisplayName')(projects);
          options = _.map(sortedProjects, function(item) {
            return $('<option>')
                      .attr("value", item.metadata.name)
                      .attr("selected", item.metadata.name === name)
                      .text($filter("uniqueDisplayName")(item, sortedProjects));
          });

          select.empty();
          select.append(options);
          select.append($('<option data-divider="true"></option>'));
          select.append($('<option value="">View all projects</option>'));
          select.selectpicker('refresh');
        };


        DataService.list("projects", $scope, function(items) {
          projects = items.by("metadata.name");
          $scope.project = projects[ $routeParams.project ];
          updateOptions();
        });

        $scope.$on('$routeChangeSuccess', function() {
          var projectName = $routeParams.project;
          if ($scope.projectName === projectName) {
            // The project hasn't changed.
            return;
          }

          if (projectName) {
            $('body').addClass('has-project-bar');
            // Check if the user can add to project after switching projects.
            // Assume false until the request completes.
            $scope.canIAddToProject = false;
            // Make sure we have project rules before we check canIAddToProject or we get the wrong value.
            // FIXME: We are not requesting this twice, here and in ProjectService
            // FIXME: AuthorizationService should not cache the wrong value before the rules load
            AuthorizationService.getProjectRules(projectName).then(function() {
              // Make sure the user hasn't switched projects while the request was still in flight.
              if ($scope.projectName !== projectName) {
                return;
              }

              $scope.canIAddToProject = AuthorizationService.canIAddToProject(projectName);
            });
          } else {
            $('body').removeClass('has-project-bar');
          }

          // TODO: relist projects? Probably better not to for cluster admins
          // that might have hundreds of projects. But we would want to update
          // the dropdown at least when the user navigates to the project list,
          // and we have an updated list.
          $scope.projectName = projectName;
          $scope.project = _.get(projects, [ projectName ]);
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
  .directive('projectFilter', function(LabelFilter) {
    return {
      restrict: 'E',
      templateUrl: 'views/directives/_project-filter.html',
      link: function($scope, $elem) {
        LabelFilter.setupFilterWidget($elem.find('.navbar-filter-widget'), $elem.find('.active-filters'), { addButtonText: "Add" });
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
