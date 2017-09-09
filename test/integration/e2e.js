'use strict';

var h = require('./helpers.js');

describe('', function() {
  afterAll(function(){
    h.afterAllTeardown();
  });

  // This UI test suite expects to be run as part of hack/test-end-to-end.sh
  // It requires the example project be created with all of its resources in order to pass

  describe('unauthenticated user', function() {
    beforeEach(function() {
      h.commonSetup();
    });

    afterEach(function() {
      h.commonTeardown();
    });

    it('should be able to log in', function() {
      browser.get('/');
      // The login page doesn't use angular, so we have to use the underlying WebDriver instance
      var driver = browser.driver;
      driver.wait(function() {
        return driver.isElementPresent(by.name("username"));
      }, 3000);

      expect(browser.driver.getCurrentUrl()).toMatch(/\/login/);
      expect(browser.driver.getTitle()).toMatch(/Login -/);

      h.login(true);

      expect(browser.getTitle()).toEqual("OpenShift Web Console");
      expect(element(by.css(".navbar-iconic .username")).getText()).toEqual("e2e-user");
    });

  });

  describe('authenticated e2e-user', function() {
    beforeEach(function() {
      h.commonSetup();
      h.login();
    });

    afterEach(function() {
      h.commonTeardown();
    });

    describe('with test project', function() {
      it('should be able to list the test project', function() {
        browser.get('/').then(function() {
          h.waitForPresence('h2.project', 'test');
        });
      });

      it('should have access to the test project', function() {
        h.goToPage('/project/test');
        h.waitForPresence('.navbar-project-menu .filter-option', 'test');
        h.waitForPresence('h1', 'Overview');
        h.waitForPresence('.component .service', 'database');
        h.waitForPresence('.component .service', 'frontend');
        h.waitForPresence('.component .route', 'www.example.com');
        h.waitForPresence('.pod-template-build a', '#1');
        h.waitForPresence('.deployment-trigger', 'from image change');

        // Check the pod count inside the donut chart for each rc.
        h.waitForPresence('#service-database .donut-title-big-pf', '1');
        h.waitForPresence('#service-frontend .donut-title-big-pf', '2');

        // TODO: validate correlated images, builds, source
      });
    });
  });
});
