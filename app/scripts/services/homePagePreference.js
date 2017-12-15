'use strict';

angular.module("openshiftConsole")
  .service("HomePagePreference", function($location, $timeout, $q, $uibModal, AuthService, Logger, Navigate, NotificationsService, ProjectsService){

    var HOME_PAGE_KEY_PREFIX = "openshift/home-page-pref/";

    function getHomePagePreferenceKey() {
      var user = AuthService.getUser();
      if (!user) {
        return null;
      }
      return HOME_PAGE_KEY_PREFIX + user.metadata.name;
    }

    var getHomePagePreference = function() {
      var homePagePref;
      var key = getHomePagePreferenceKey();

      if (!key) {
        return 'catalog-home';
      }

      try {
        homePagePref = JSON.parse(localStorage.getItem(key));
      } catch (e) {
        Logger.error('Could not parse homePagePref as JSON');
        return 'catalog-home';
      }

      return _.get(homePagePref, 'type', 'catalog-home');
    };

    var getProjectOverviewPage = function() {
      var homePagePref;
      var key = getHomePagePreferenceKey();

      if (!key) {
        return null;
      }

      try {
        homePagePref = JSON.parse(localStorage.getItem(key));
      } catch (e) {
        Logger.error('Could not parse homePagePref as JSON');
        return null;
      }

      return (homePagePref && homePagePref.type === 'project-overview') ? homePagePref.project : null;
    };

    var verifyProjectOverviewPage = function(projectOverviewPage) {
      var deferred = $q.defer();

      ProjectsService.get(projectOverviewPage).then(function() {
        deferred.resolve(true);
      }, function() {
        deferred.resolve(false);
      });

      return deferred.promise;
    };

    var clear = function() {
      var key = getHomePagePreferenceKey();
      if (!key) {
        return;
      }
      localStorage.removeItem(key);
    };

    var notifyInvalidProjectHomePage = function(projectName) {
      clear();
      NotificationsService.addNotification({
        id: "invalid-home-page-preference",
        type: "warning",
        message: "Home page project not found.",
        details: "Project " + projectName + " no longer exists or you do not have access to it.",
        links: [{
          href: "",
          label: "Set Home Page",
          onClick: function() {
            $uibModal.open({
              animation: true,
              templateUrl: 'views/modals/set-home-page-modal.html',
              controller: 'SetHomePageModalController'
            });
            return true;
          }
        }]
      });
    };

    var gotoHomePage = function() {
      var homePagePref = this.getHomePagePreference();
      if (homePagePref === "project-overview") {
        var homeProjectPage = this.getProjectOverviewPage();
        this.verifyProjectOverviewPage(homeProjectPage).then(function (valid) {
          if (valid) {
            Navigate.toProjectOverview(homeProjectPage);
          } else {
            notifyInvalidProjectHomePage(homeProjectPage);
            Navigate.toProjectList();
          }
        });
      } else if (homePagePref === "project-list") {
        // navigate on next digest cycle
        $timeout(function(){
          Navigate.toProjectList();
        });
      }
    };

    var setHomePagePreference = function(homePagePref) {
      var key = getHomePagePreferenceKey();
      if (!key) {
        return;
      }
      localStorage.setItem(key, JSON.stringify(homePagePref));
    };

    return {
      getHomePagePreference: getHomePagePreference,
      setHomePagePreference: setHomePagePreference,
      verifyProjectOverviewPage: verifyProjectOverviewPage,
      notifyInvalidProjectHomePage: notifyInvalidProjectHomePage,
      getProjectOverviewPage: getProjectOverviewPage,
      gotoHomePage: gotoHomePage,
      clear: clear
    };
  });
