'use strict';

/**
 * @ngdoc function
 * @name openshiftConsole.controller:ProjectsController
 * @description
 * # ProjectsController
 * Controller of the openshiftConsole
 */
angular.module('openshiftConsole')
  .controller('ProjectsController', function ($scope,
                                              $filter,
                                              $location,
                                              $route,
                                              $timeout,
                                              AuthService,
                                              DataService,
                                              KeywordService,
                                              Logger,
                                              ProjectsService,
                                              gettext,
                                              gettextCatalog) {
    var projects, sortedProjects;
    var watches = [];
    var filterKeywords = [];

    $scope.alerts = $scope.alerts || {};
    $scope.loading = true;
    $scope.showGetStarted = false;
    $scope.canCreate = undefined;
    $scope.search = {
      text: ''
    };

    var filterFields = [
      'metadata.name',
      'metadata.annotations["openshift.io/display-name"]',
      'metadata.annotations["openshift.io/description"]',
      'metadata.annotations["openshift.io/requester"]'
    ];

    var filterProjects = function() {
      $scope.projects =
        KeywordService.filterForKeywords(sortedProjects, filterFields, filterKeywords);
    };

    var previousSortID, displayName = $filter('displayName');
    var sortProjects = function() {
      var sortID = _.get($scope, 'sortConfig.currentField.id');

      if (previousSortID !== sortID) {
        // Default to desc for creation timestamp. Otherwise default to asc.
        $scope.sortConfig.isAscending = sortID !== 'metadata.creationTimestamp';
      }

      var displayNameLower = function(project) {
        // Perform a case insensitive sort.
        return displayName(project).toLowerCase();
      };

      var primarySortOrder = $scope.sortConfig.isAscending ? 'asc' : 'desc';
      switch (sortID) {
      case 'metadata.annotations["openshift.io/display-name"]':
        // Sort by display name. Use `metadata.name` as a secondary sort when
        // projects have the same display name.
        sortedProjects = _.sortByOrder(projects,
                                       [ displayNameLower, 'metadata.name' ],
                                       [ primarySortOrder ]);
        break;
      case 'metadata.annotations["openshift.io/requester"]':
        // Sort by requester, then display name. Secondary sort is always ascending.
        sortedProjects = _.sortByOrder(projects,
                                       [ sortID, displayNameLower ],
                                       [ primarySortOrder, 'asc' ]);
        break;
      default:
        sortedProjects = _.sortByOrder(projects,
                                       [ sortID ],
                                       [ primarySortOrder ]);
      }

      // Remember the previous sort ID.
      previousSortID = sortID;
    };

    var update = function() {
      sortProjects();
      filterProjects();
    };

    // Set up the sort configuration for `pf-sort`.
    $scope.sortConfig = {
      fields: [{
        id: 'metadata.annotations["openshift.io/display-name"]',
        title: gettextCatalog.getString(gettext('Display Name')),
        sortType: 'alpha'
      }, {
        id: 'metadata.name',
        title: gettextCatalog.getString(gettext('Name')),
        sortType: 'alpha'
      }, {
        id: 'metadata.annotations["openshift.io/requester"]',
        title: gettextCatalog.getString(gettext('Creator')),
        sortType: 'alpha'
      }, {
        id: 'metadata.creationTimestamp',
        title: gettextCatalog.getString(gettext('Creation Date')),
        sortType: 'alpha'
      }],
      isAscending: true,
      onSortChange: update
    };

    $scope.$watch('search.text', _.debounce(function(searchText) {
      $scope.keywords = filterKeywords = KeywordService.generateKeywords(searchText);
      $scope.$apply(filterProjects);
    }, 50, { maxWait: 250 }));

    AuthService.withUser().then(function() {
      watches.push(DataService.watch("projects", $scope, function(projectData) {
        projects = _.toArray(projectData.by("metadata.name"));
        $scope.loading = false;
        $scope.showGetStarted = _.isEmpty(projects);
        update();
      }));
    });

    // Test if the user can submit project requests. Handle error notifications
    // ourselves because 403 responses are expected.
  ProjectsService
    .canCreate()
    .then(function() {
      $scope.canCreate = true;
    }, function(result) {
      $scope.canCreate = false;

      var data = result.data || {};

      // 403 Forbidden indicates the user doesn't have authority.
      // Any other failure status is an unexpected error.
      if (result.status !== 403) {
        var msg = 'Failed to determine create project permission';
        if (result.status !== 0) {
          msg += " (" + result.status + ")";
        }
        Logger.warn(msg);
        return;
      }

      // Check if there are detailed messages. If there are, show them instead of our default message.
      if (data.details) {
        var messages = [];
        _.forEach(data.details.causes || [], function(cause) {
          if (cause.message) { messages.push(cause.message); }
        });
        if (!_.isEmpty(messages)) {
          $scope.newProjectMessage = messages.join("\n");
        }
      }
    });

    $scope.$on('$destroy', function(){
      DataService.unwatchAll(watches);
    });
  });
