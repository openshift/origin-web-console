'use strict';

const environment = require('../environment');
const windowHelper = require('../helpers/window');
const timing = require('../helpers/timing');
const logger = require('../helpers/logger');
const menus = require('../page-objects/menus').menus;
const LoginPage = require('../page-objects/login').LoginPage;
const ProjectListPage = require('../page-objects/projectList').ProjectListPage;

exports.beforeAll = () => {
  windowHelper.setSize();

  logger.log('login');
  // we manually bootstrap angular, so it is suggested to do this
  // call up front, however it has not been needed thus far.
  // browser.waitForAngular();
  let loginPage = new LoginPage();
  loginPage.login();
  browser.driver.sleep(timing.standardDelay);
};

exports.afterAll = () => {

  // easier in the afterAll as we have done the login flow by this point.
  if(environment.isMac) {
    logger.log('cleanup: deleting all projects');
    menus.clickLogo();
    menus.clickViewAllProjects();
    let projectList = new ProjectListPage();
    projectList.deleteAllProjects();
  }
  browser.sleep(timing.pauseBetweenTests);

  menus.topNav.clickLogout();
  browser.sleep(timing.standardDelay);
  logger.log('logout');
  windowHelper.clearStorage();
};

exports.beforeEach = () => {

};


exports.afterEach = () => {

};
