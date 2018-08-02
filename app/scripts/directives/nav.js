'use strict';

angular.module('openshiftConsole')
  .directive('sidebar',
    function(
      $location,
      $filter,
      $timeout,
      $rootScope,
      $routeParams,
      APIService,
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
        var hoverDelay = 200;
        var hideDelay = hoverDelay + 100;

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

          if (item.canI.addToProject) {
            return $scope.canIAddToProject;
          }

          // Make sure both the resource was found during discovery and the user has authority.
          var resourceGroupVersion = _.pick(item.canI, [ 'resource', 'group', 'version' ]);
          return APIService.apiInfo(resourceGroupVersion) && AuthorizationService.canI(resourceGroupVersion, item.canI.verb, $scope.projectName);
        };

        $scope.itemClicked = function(primaryItem) {
          // Remove `isHover` from any of the items if another primary item was
          // activated using the keyboard.
          clearHover();

          if (primaryItem.href) {
            // Make sure any secondary nav closes if a primary item with an
            // href was activated using the keyboard.
            $scope.nav.showMobileNav = false;
            $scope.sidebar.secondaryOpen = false;
            return;
          }

          // Open the item regardless of whether the mouse is really over it
          // for keyboard and screen reader accessibility.
          primaryItem.isHover = true;
          primaryItem.mobileSecondary = $scope.isMobile;
          $scope.sidebar.showMobileSecondary = $scope.isMobile;
          $scope.sidebar.secondaryOpen = true;
        };

        $scope.onMouseEnter = function(primaryItem) {
          if (primaryItem.mouseLeaveTimeout) {
            $timeout.cancel(primaryItem.mouseLeaveTimeout);
            primaryItem.mouseLeaveTimeout = null;
          }

          primaryItem.mouseEnterTimeout = $timeout(function() {
            primaryItem.isHover = true;
            primaryItem.mouseEnterTimeout = null;
            $scope.sidebar.secondaryOpen = !_.isEmpty(primaryItem.secondaryNavSections);
          }, hoverDelay);
        };

        $scope.onMouseLeave = function(primaryItem) {
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
      $q,
      $rootScope,
      $routeParams,
      $timeout,
      APIService,
      AuthorizationService,
      Catalog,
      CatalogService,
      Constants,
      DataService,
      Navigate,
      NotificationsService,
      ProjectsService,
      projectOverviewURLFilter,
      RecentlyViewedServiceItems) {

    // cache these to eliminate flicker
    var projects = {};
    var sortedProjects = [];

    var displayName = $filter('displayName');
    var uniqueDisplayName = $filter('uniqueDisplayName');

    var templatesVersion = APIService.getPreferredVersion('templates');

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

        var catalogPath = "/catalog";
        var projectsPath = "/projects";

        var setContextPickerSelectedOption = function(selector) {
          if ($location.path() === catalogPath) {
            selector.selectpicker("val", "catalog");
          } else {
            selector.selectpicker("val", "application-console");
          }
        };

        var goToURL = function(url) {
          $scope.$evalAsync(function() {
            $location.url(url);
          });
        };

        $scope.toggleNav = function() {
          var collapsed = isCollapsed();
          setCollapsed(!collapsed, true);
          // Emit a toggleNav message so listeners like the pod terminal can
          // resize content if needed.
          $rootScope.$emit('oscHeader.toggleNav');
        };

        $scope.toggleMobileNav = function() {
          var showMobileNav = _.get($rootScope, 'nav.showMobileNav');
          setMobileNavVisible(!showMobileNav);
        };

        $scope.closeMobileNav = function() {
          setMobileNavVisible(false);
        };

        $scope.closeOrderingPanel = function() {
          $scope.orderingPanelVisible = false;
        };

        $scope.showOrderingPanel = function(panelName) {
          $scope.orderingPanelVisible = true;
          $scope.orderKind = panelName;
        };

        $scope.onSearchToggle = function(showMobileSearch) {
          _.set($rootScope, 'view.hasProjectSearch', showMobileSearch);
        };

        $scope.catalogLandingPageEnabled = !Constants.DISABLE_SERVICE_CATALOG_LANDING_PAGE;

        var contextSelector = $elem.find('.contextselector');
        $scope.clusterConsoleURL = window.OPENSHIFT_CONFIG.adminConsoleURL;
        contextSelector
          .on('loaded.bs.select', function () {
            setContextPickerSelectedOption(contextSelector);
          })
          .change(function() {
            var val = $(this).val();
            switch (val) {
              case "catalog":
                goToURL(catalogPath);
                break;
              case "application-console":
                goToURL(projectsPath);
                break;
              case "cluster-console":
                window.location.assign($scope.clusterConsoleURL);
                break;
            }
          });

        var projectPicker = $elem.find('.project-picker');
        var projectPickerOptions = [];

        var updateProjectPickerOptions = function() {
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
            projectPickerOptions = _.map(sortedProjects, function(project) {
              return makeOption(project, false);
            });
          } else {
            // Show the current project and a "View All Projects" link.
            projectPickerOptions = [ makeOption(projects[name], true) ];
          }

          projectPicker.empty();
          projectPicker.append(projectPickerOptions);
          projectPicker.append($('<option data-divider="true"></option>'));
          projectPicker.append($('<option value="">View All Projects</option>'));
          projectPicker.selectpicker('refresh');
        };

        var updateProjects = function() {
          return ProjectsService.list().then(function(items) {
            projects = items.by("metadata.name");
          });
        };

        var onRouteChange = function() {
          setContextPickerSelectedOption(contextSelector);
          var currentProjectName = $routeParams.project;
          if ($scope.currentProjectName === currentProjectName) {
            // The project hasn't changed.
            return;
          }

          $scope.currentProjectName = currentProjectName;
          $scope.chromeless = $routeParams.view === "chromeless";

          var catalogItems, projectItems;
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

              if ($scope.canIAddToProject) {
                var catalogItemsPromise = CatalogService.getCatalogItems().then(function(items) {
                  catalogItems = items;
                });
                var projectItemsPromise = Catalog.getProjectCatalogItems(currentProjectName).then(_.spread(function(catalogServiceItems) {
                  projectItems = catalogServiceItems;
                }));
                $q.all([catalogItemsPromise, projectItemsPromise]).then(function() {
                  $scope.catalogItems = Catalog.sortCatalogItems(_.concat(catalogItems, projectItems));
                });
              }
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
              updateProjectPickerOptions();
            });
          } else {
            _.set($rootScope, 'view.hasProject', false);
          }
        };

        var addOrderItemToRecentlyViewed = function() {
          if ($scope.orderingPanelVisible) {
            RecentlyViewedServiceItems.addItem(_.get($scope.selectedItem, 'resource.metadata.uid'));
          }
        };

        var isPartialObject = function(apiObject) {
          return apiObject.kind === 'PartialObjectMetadata';
        };

        var loadCompleteTemplate = function(template) {
          if (isPartialObject(template)) {
            return DataService.get(templatesVersion, template.metadata.name, { namespace: template.metadata.namespace });
          }

          return $q.when(template);
        };

        $scope.$on('open-overlay-panel', function (event, item) {
          if (!$scope.currentProjectName) {
            return;
          }

          $scope.servicePlansForItem = null;
          $scope.orderKind = _.get(item, 'kind');

          if ($scope.orderKind === 'Template') {
            // `selectedTemplate` might be a partial object (metadata only). If necessary, load the complete template object.
            loadCompleteTemplate(item.resource).then(function(template) {
              $scope.selectedItem = template;
              $scope.orderingPanelVisible = true;
              $scope.orderKind = 'Template';
            });
            return;
          }

          if ($scope.orderKind === 'ClusterServiceClass') {
            Catalog.getServicePlansForServiceClass(_.get(item, 'resource.metadata.name')).then(function (plans) {
              $scope.servicePlansForItem = _.reject(plans.by('metadata.name'), {
                status: {
                  removedFromBrokerCatalog: true
                }
              });
              $scope.selectedItem = item;
              $scope.orderingPanelVisible = true;
            });
            return;
          }

          // $timeout needed to prevent animation flicker when showing the dialog.
          // https://github.com/openshift/origin-web-console/issues/2589
          $timeout(function() {
            $scope.selectedItem = item;
            $scope.orderingPanelVisible = true;
          });
        });

        var removeFilterListener = $rootScope.$on('filter-catalog-items', function(event, searchCriteria) {
          if (!$scope.currentProjectName) {
            return;
          }

          var search = {
            filter: searchCriteria.searchText
          };

          Navigate.toProjectCatalog($scope.currentProjectName, search);
        });

        $scope.closeOrderingPanel = function() {
          RecentlyViewedServiceItems.addItem(_.get($scope.selectedItem, 'resource.metadata.uid'));
          $scope.orderingPanelVisible = false;
        };


        // Make sure `onRouteChange` gets called on page load, even if
        // `$routeChangeSuccess` doesn't fire. `onRouteChange` doesn't do any
        // work if the project name hasn't changed, so there's no penalty if it
        // gets called twice. This fixes a flake in our integration tests.
        onRouteChange();
        $scope.$on('$routeChangeSuccess', onRouteChange);

        projectPicker
          .change(function() {
            var val = $(this).val();
            var newURL = (val === "") ? "projects" : projectOverviewURLFilter(val);
            goToURL(newURL);
          });

        $scope.$on('$destroy', function() {
          removeFilterListener();

          // If the ordering dialog was open when the scope was destroyed, still
          // add the item to recently-viewed. No-op if the dialog is not open.
          addOrderItemToRecentlyViewed();
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
