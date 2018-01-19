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

    spyOn(localStorage, 'clear').and.callFake(function () {
      store = {};
    });

   });

  describe("#getHomePagePath", function(){

    it("default set to catalog-home",function(){
      var homePagePref = {};
      HomePagePreferenceService.setHomePagePreference(homePagePref);
      var homePagePreference = HomePagePreferenceService.getHomePagePath();
      expect(homePagePreference).toEqual("/catalog");
    });
    
    
    it("set project list", function(){
      var homePagePref = {"type":"project-list"};
      HomePagePreferenceService.setHomePagePreference(homePagePref);
      var homePagePreference = HomePagePreferenceService.getHomePagePath();
      expect(homePagePreference).toEqual("/projects");
    });

    
    it("set to project overview",function(){
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
