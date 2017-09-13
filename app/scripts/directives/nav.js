'use strict';

angular.module('openshiftConsole')
  .directive('sidebar',
    function(
      $location,
      $filter,
      $timeout,
      $rootScope,
      $routeParams,
      AuthorizationService,
      Constants,
      HTMLService) {
    var itemMatchesPath = function(item, path) {
      return (item.href === path) || _.some(item.prefixes, function(prefix) {
        return _.startsWith(path, prefix);
      });
    };
    return {
      restrict: 'E',
      templateUrl: 'views/_sidebar.html',
      controller: function($scope) {
        var path;
        var hoverDelay = 300;
        var hideDelay = hoverDelay + 200;

        $scope.navItems = Constants.PROJECT_NAVIGATION;
        $scope.sidebar = {};

        var updateActive = function() {
          $scope.projectName = $routeParams.project;
          _.set($scope, 'sidebar.secondaryOpen',  false);
          _.set($rootScope, 'nav.showMobileNav', false);
          $scope.activeSecondary = null;
          $scope.activePrimary = _.find($scope.navItems, function(primaryItem) {
            path = $location.path().replace("/project/" + $scope.projectName, "");
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
        };
        updateActive();

        $scope.$on('$routeChangeSuccess', updateActive);

        var clearHover = function() {
          _.each($scope.navItems, function(navItem) {
            navItem.isHover = false;
          });
        };

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

          if (!item.canI) {
            return true;
          }

          return AuthorizationService.canI({
            resource: item.canI.resource,
            group: item.canI.group
          }, item.canI.verb, $scope.projectName);
        };

        $scope.itemClicked = function(primaryItem) {
          if (primaryItem.href) {
            // Make sure any secondary nav closes if a primary item with an
            // href was activated using the keyboard.
            $scope.nav.showMobileNav = false;
            $scope.sidebar.secondaryOpen = false;
            return;
          }

          // Remove `isHover` from any of the items if another primary item was
          // activated using the keyboard.
          clearHover();

          // Open the item regardless of whether the mouse is really over it
          // for keyboard and screen reader accessibility.
          primaryItem.isHover = true;
          primaryItem.mobileSecondary = $scope.isMobile;
          $scope.sidebar.showMobileSecondary = $scope.isMobile;
          $scope.sidebar.secondaryOpen = true;
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

        $scope.closeNav = function() {
          clearHover();
          $scope.nav.showMobileNav = false;
          $scope.sidebar.secondaryOpen = false;
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
              if (!isMobile) {
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
  .directive('oscHeader',
    function(
      $filter,
      $location,
      $rootScope,
      $routeParams,
      $timeout,
      AuthorizationService,
      Constants,
      ProjectsService,
      projectOverviewURLFilter) {

    // cache these to eliminate flicker
    var projects = {};
    var sortedProjects = [];

    var displayName = $filter('displayName');
    var uniqueDisplayName = $filter('uniqueDisplayName');

    return {
      restrict: 'EA',
      templateUrl: 'views/directives/header/header.html',
      link: function($scope, $elem) {
        var MAX_PROJETS_TO_DISPLAY = 100;
        var NAV_COLLAPSED_STORAGE_KEY = 'openshift/vertical-nav-collapsed';
        $scope.currentProject = projects[ $routeParams.project ];

        var setCollapsed = function(collapsed, updateSavedState) {
          var storageValue;
          _.set($rootScope, 'nav.collapsed', collapsed);

          if (updateSavedState) {
            storageValue = collapsed ? 'true' : 'false';
            localStorage.setItem(NAV_COLLAPSED_STORAGE_KEY, storageValue);
          }
        };

        var readSavedCollapsedState = function() {
          var savedState = localStorage.getItem(NAV_COLLAPSED_STORAGE_KEY) === 'true';
          setCollapsed(savedState);
        };
        readSavedCollapsedState();

        var isCollapsed = function() {
          return _.get($rootScope, 'nav.collapsed', false);
        };

        var setMobileNavVisible = function(visible) {
          _.set($rootScope, 'nav.showMobileNav', visible);
        };

        $scope.toggleNav = function() {
          var collapsed = isCollapsed();
          setCollapsed(!collapsed, true);
        };

        $scope.toggleMobileNav = function() {
          var showMobileNav = _.get($rootScope, 'nav.showMobileNav');
          setMobileNavVisible(!showMobileNav);
        };

        $scope.closeMobileNav = function() {
          setMobileNavVisible(false);
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
          var name = $scope.currentProjectName;
          if (!name) {
            return;
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
          select.selectpicker('refresh');
        };

        var updateProjects = function() {
          return ProjectsService.list().then(function(items) {
            projects = items.by("metadata.name");
          });
        };

        $scope.$on('$routeChangeSuccess', function(event, next) {
          $scope.nextRoute = next;
          var currentProjectName = $routeParams.project;
          if ($scope.currentProjectName === currentProjectName) {
            // The project hasn't changed.
            return;
          }

          $scope.currentProjectName = currentProjectName;
          $scope.chromeless = $routeParams.view === "chromeless";

          if (currentProjectName && !$scope.chromeless) {
            _.set($rootScope, 'view.hasProject', true);
            // Check if the user can add to project after switching projects.
            // Assume false until the request completes.
            $scope.canIAddToProject = false;
            // Make sure we have project rules before we check canIAddToProject or we get the wrong value.
            AuthorizationService.getProjectRules(currentProjectName).then(function() {
              // Make sure the user hasn't switched projects while the request was still in flight.
              if ($scope.currentProjectName !== currentProjectName) {
                return;
              }

              $scope.canIAddToProject = AuthorizationService.canIAddToProject(currentProjectName);
            });

            updateProjects().then(function() {
              if (!$scope.currentProjectName || !projects) {
                return;
              }

              if (!projects[$scope.currentProjectName]) {
                // Make sure there is an entry for the current project in the
                // dropdown. If it doesn't actually exist, the controller for
                // the current view is responsible for redirecting to an error
                // page.
                projects[$scope.currentProjectName] = {
                  metadata: {
                    name: $scope.currentProjectName
                  }
                };
              }

              $scope.currentProject = projects[$scope.currentProjectName];
              updateOptions();
            });
          } else {
            _.set($rootScope, 'view.hasProject', false);
          }
        });

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
  .directive('navbarUtilityMobile', function($timeout) {
    return {
      restrict: 'E',
      transclude: true,
      templateUrl: 'views/directives/header/_navbar-utility-mobile.html',
      link: function($scope, $element) {
        $timeout(function() {
          // Add necessary Patternfly classes to the elements. We need to do this
          // in JavaScript to maintain compatibility with older extensions.

          // Before:
          //   <li>
          //     <a href=""><span class="fa fa-dashboard"> Dashboard</a>
          //   </li>
          //
          // After:
          //   <li class="list-group-item">
          //     <a href=""><span class="fa fa-dashboard"> <span class="list-group-item-value">Dashboard</span></a>
          //   </li>

          // Add `list-group-item` to `li` elements.
          var menuItems = $element.find('li');
          menuItems.addClass('list-group-item');

          var menuItemByHref = {};

          menuItems.each(function(i, menuItem) {
            var links = $(menuItem).find('a');

            // Remember the menu item for each link so we can set active
            // styles. Assumes href is unique for each menu item.
            links.each(function(j, link) {
              if (link.href) {
                menuItemByHref[link.href] = menuItem;
              }
            });

            // Add `list-group-item-value` to the link text, but don't wrap the icons.
            links.contents().filter(function() {
              // Filter for non-empty text nodes (node type 3).
              // https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType
              return this.nodeType === 3 && $.trim(this.nodeValue).length;
            }).wrap('<span class="list-group-item-value"/>');
          });

          var updateActive = function() {
            menuItems.removeClass('active');
            var menuItem = menuItemByHref[window.location.href];
            if (menuItem) {
              $(menuItem).addClass('active');
            }
          };

          updateActive();
          $scope.$on('$routeChangeSuccess', updateActive);
        });
      }
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
