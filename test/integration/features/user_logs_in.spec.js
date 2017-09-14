'use strict';

const matchersHelpers = require('../helpers/matchers');
const timing = require('../helpers/timing');
const logger = require('../helpers/logger');
const LoginPage = require('../page-objects/login').LoginPage;
const menus = require('../page-objects/menus').menus;


describe('unauthenticated user', () => {

  describe('attempts to login to the web console', () => {
    it('should login the user and then be redirected to the catalog', () => {
      logger.log('login');
      let loginPage = new LoginPage();
      loginPage.login();
      browser.driver.sleep(timing.initialVisit);
      matchersHelpers.expectHeading('Browse Catalog');

      browser.driver.sleep(timing.initialVisit);
      logger.log('logout');
      menus.topNav.clickLogout();
    });
  });
});
