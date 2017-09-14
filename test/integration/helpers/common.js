'use strict';

const windowHelper = require('../helpers/window');
const projectHelpers = require('../helpers/project');
const timing = require('../helpers/timing');
const logger = require('../helpers/logger');
const menus = require('../page-objects/menus').menus;
const LoginPage = require('../page-objects/login').LoginPage;

exports.beforeAll = () => {
  windowHelper.setSize();
};

exports.beforeEach = () => {
  logger.log('login');
  // we manually bootstrap angular, so it is suggested to do this
  // call up front, however it has not been needed thus far.
  // browser.waitForAngular();
  let loginPage = new LoginPage();
  loginPage.login();
  browser.driver.sleep(timing.standardDelay);
  projectHelpers.deleteAllProjects();
};


exports.afterEach = () => {
  menus.topNav.clickLogout();
  browser.sleep(timing.standardDelay);
  logger.log('logout');
  windowHelper.clearStorage();
};
