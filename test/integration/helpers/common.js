'use strict';

const windowHelper = require('../helpers/window');
const projectHelpers = require('../helpers/project');

const LoginPage = require('../page-objects/login').LoginPage;


exports.beforeEach = () => {
  // we manually bootstrap angular, so it is suggested to do this
  // call up front, however it has not been needed thus far.
  // browser.waitForAngular();
  windowHelper.setSize();
  let loginPage = new LoginPage();
  loginPage.login();
  browser.driver.sleep(1000);
  projectHelpers.deleteAllProjects();
};


exports.afterEach = () => {
  windowHelper.clearStorage();
};
