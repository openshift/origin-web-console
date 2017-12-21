'use strict';

const environment = require('../environment');
const windowHelper = require('../helpers/window');
const timing = require('../helpers/timing');
const logger = require('../helpers/logger');
const menus = require('../page-objects/menus').menus;
const LoginPage = require('../page-objects/login').LoginPage;
const ProjectListPage = require('../page-objects/projectList').ProjectListPage;


exports.beforeAll = () => {
  logger.log('common: beforeAll()');
  logger.log('set window size');
  windowHelper.setSize(1024, 800);
  // NOTE: login will toggle Angular sync off & on
  let loginPage = new LoginPage();
  loginPage.login();
};

exports.afterAll = () => {
  logger.log('common: afterAll()');
  // easier in the afterAll as we have done the login flow by this point.
  if(environment.isMac) {
    logger.log('cleanup (mac): deleting all projects');
    menus.clickLogo();
    menus.clickViewAllProjects();
    let projectList = new ProjectListPage();
    projectList.deleteAllProjects();
  }
  browser.sleep(timing.pauseBetweenTests);

  menus.topNav.clickLogout();
  browser.sleep(timing.standardDelay);
  logger.log('common: logout');
  windowHelper.clearStorage();
};

exports.beforeEach = () => {
  logger.log('common: beforeEach (n/a)');
};


exports.afterEach = () => {
  logger.log('common: afterEach (n/a)');
};
