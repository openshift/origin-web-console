"use strict";

describe("HomePagePreferenceService", function(){
  var HomePagePreferenceService;
  var store = {};

  beforeEach(function(){
    inject(function(_HomePagePreferenceService_){
      HomePagePreferenceService = _HomePagePreferenceService_;
    });

    // LocalStorage mock
    spyOn(localStorage, 'getItem').and.callFake(function(key) {
      return store[key];
    });

    spyOn(localStorage, 'setItem').and.callFake(function (key, value) {
      /* jshint boss:true */
      return store[key] = value + '';
    });

    spyOn(localStorage, 'removeItem').and.callFake(function (key) {
      delete store[key];
    });

    spyOn(localStorage, 'clear').and.callFake(function () {
      store = {};
    });

   });

   describe("#getHomePagePath", function(){
     describe('when given an empty config object', function() {
       it("should set the default home page to /catalog",function(){
         var homePagePref = {};
         HomePagePreferenceService.setHomePagePreference(homePagePref);
         var homePagePreference = HomePagePreferenceService.getHomePagePath();

         expect(homePagePreference).toEqual("/catalog");
       });
     });

     describe('when given a config object with `type` set to `project-list`', function() {
       it("should set the home page to /projects", function(){
         var homePagePref = {"type":"project-list"};
         HomePagePreferenceService.setHomePagePreference(homePagePref);
         var homePagePreference = HomePagePreferenceService.getHomePagePath();

         expect(homePagePreference).toEqual("/projects");
       });
     });

     describe('when given a config object with `type` set to `project-overview`', function() {
       it("should set the home page to the overview of the provided project at /project/test-pro/overview",function(){
         var homePagePref = {
             "type":"project-overview",
             "project":"test-pro"
         };
         HomePagePreferenceService.setHomePagePreference(homePagePref);
         var homePagePreference = HomePagePreferenceService.getHomePagePath();

         expect(homePagePreference).toEqual("/project/test-pro/overview?isHomePage=true");
       });
     });
  });

  describe('#notifyInvalidProjectHomePage', function() {
    describe('when given a config object with an invalid `type` option', function() {
      // in the UI, this will also trigger a notification that the project is
      // invalid.  This additional functionality should be verified either with
      // a unit test or an e2e test against the appropriate controller.
      it("should clear the configuration object from localStorage", function() {
        var homePagePref = {
            "type":"project-overview",
            "project":"test-project"
        };
        HomePagePreferenceService.setHomePagePreference(homePagePref);
        HomePagePreferenceService.notifyInvalidProjectHomePage(homePagePref.project);

        var setting = localStorage.getItem("openshift/home-page-pref/");

        expect(setting).toBeFalsy();
      });
    });
  });

});
