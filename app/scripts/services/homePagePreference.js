'use strict';

angular.module("openshiftConsole")
  .service("HomePagePreferenceService", function($location, $timeout, $q, $uibModal, AuthService, Logger, Navigate, NotificationsService){

    function getHomePagePreferenceKey() {
      return "openshift/home-page-pref/";
    }

    var getHomePagePreference = function() {
      var homePagePref;
      var key = getHomePagePreferenceKey();

      try {
        homePagePref = JSON.parse(localStorage.getItem(key));
      } catch (e) {
        Logger.error('Could not parse homePagePref as JSON', e);
        return 'catalog-home';
      }

      return _.get(homePagePref, 'type', 'catalog-home');
    };

    var getHomePageProjectName = function() {
      var homePagePref;
      var key = getHomePagePreferenceKey();

      try {
        homePagePref = JSON.parse(localStorage.getItem(key));
      } catch (e) {
        Logger.error('Could not parse homePagePref as JSON', e);
        return null;
      }

      return (homePagePref && homePagePref.type === 'project-overview') ? homePagePref.project : null;
    };

    var clear = function() {
      var key = getHomePagePreferenceKey();
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
              backdrop: 'static',
              templateUrl: 'views/modals/set-home-page-modal.html',
              controller: 'SetHomePageModalController'
            });
            return true;
          }
        }]
      });
    };

    var getHomePagePath = function() {
      var homePagePref = this.getHomePagePreference();
      if (homePagePref === "project-overview") {
        var homeProjectPageName = this.getHomePageProjectName();
        return '/' + Navigate.projectOverviewURL(homeProjectPageName) + "?isHomePage=true";
      } else if (homePagePref === "project-list") {
        return '/projects';
      } else {
        return '/catalog';
      }
    };

    var setHomePagePreference = function(homePagePref) {
      var key = getHomePagePreferenceKey();
      localStorage.setItem(key, JSON.stringify(homePagePref));
    };

    return {
      getHomePagePreference: getHomePagePreference,
      setHomePagePreference: setHomePagePreference,
      getHomePageProjectName: getHomePageProjectName,
      getHomePagePath: getHomePagePath,
      notifyInvalidProjectHomePage: notifyInvalidProjectHomePage
    };
  });
