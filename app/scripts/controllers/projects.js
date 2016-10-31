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
                                              AlertMessageService,
                                              AuthService,
                                              DataService,
                                              KeywordService,
                                              Logger) {
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

    var previousSortID;
    var sortProjects = function() {
      var sortID = _.get($scope, 'sortConfig.currentField.id');

      if (previousSortID !== sortID) {
        // Default to desc for creation timestamp. Otherwise default to asc.
        $scope.sortConfig.isAscending = sortID !== 'metadata.creationTimestamp';
      }

      var sortValue = function(project) {
        var value = _.get(project, sortID) || _.get(project, 'metadata.name', '');

        // Perform a case insensitive sort.
        return value.toLowerCase();
      };

      sortedProjects = _.sortByOrder(projects,
                                     [ sortValue ],
                                     [ $scope.sortConfig.isAscending ? 'asc' : 'desc' ]);

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
        title: 'Display Name',
        sortType: 'alpha'
      }, {
        id: 'metadata.name',
        title: 'Name',
        sortType: 'alpha'
      }, {
        id: 'metadata.annotations["openshift.io/requester"]',
        title: 'Creator',
        sortType: 'alpha'
      }, {
        id: 'metadata.creationTimestamp',
        title: 'Creation Date',
        sortType: 'alpha'
      }],
      isAscending: true,
      onSortChange: update
    };

    AlertMessageService.getAlerts().forEach(function(alert) {
      $scope.alerts[alert.name] = alert.data;
    });
    AlertMessageService.clearAlerts();

    $scope.$watch('search.text', _.debounce(function(searchText) {
      filterKeywords = KeywordService.generateKeywords(searchText);
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
    DataService.get("projectrequests", null, $scope, { errorNotification: false})
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
        if (messages.length > 0) {
          $scope.newProjectMessage = messages.join("\n");
        }
      }
    });

    $scope.$on('$destroy', function(){
      DataService.unwatchAll(watches);
    });
  });
