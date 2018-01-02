'use strict';

const common = require('../helpers/common');
const timing = require('../helpers/timing');
const logger = require('../helpers/logger');

const projectHelpers = require('../helpers/project');
const matchers = require('../helpers/matchers');

const CreateProjectPage = require('../page-objects/createProject').CreateProjectPage;
const OverviewPage = require('../page-objects/overview').OverviewPage;
const ProjectListPage = require('../page-objects/projectList').ProjectListPage;

const menus = require('../page-objects/menus').menus;

describe('Authenticated user creates a new project', () => {

  beforeAll(() => {
    logger.log('beforeAll()');
    common.beforeAll();
  });

  beforeEach(() => {
    logger.log('beforeEach()');
    common.beforeEach();
  });

  afterEach(() => {
    logger.log('afterEach()');
    common.afterEach();
  });

  afterAll(() => {
    logger.log('afterAll()');
    common.afterAll();
  });


  it('should be able to create a new project', () => {

    let project = projectHelpers.projectDetails();
    let createProjectPage = new CreateProjectPage(project);
    createProjectPage.visit();
    createProjectPage.createProject().then((projectList) => {
      // sometimes this flakes out. Perhaps the server takes a little too long
      // to create the project?
      browser.sleep(timing.initialVisit);
      // show the project in the list
      matchers.expectElementToBeVisible(projectList.findTileBy(project.displayName));

      // wait a bit to ensure project is created
      browser.sleep(timing.initialVisit);
      projectList.clickTileBy(project.displayName);

      // click through Application menu
      menus.leftNav.clickDeployments();
      matchers.expectHeadingContainsText('Deployments');
      menus.leftNav.clickStatefulSets();
      matchers.expectHeadingContainsText('Stateful Sets');
      menus.leftNav.clickPods();
      matchers.expectHeadingContainsText('Pods');
      menus.leftNav.clickServices();
      matchers.expectHeadingContainsText('Services');
      menus.leftNav.clickRoutes();
      matchers.expectHeadingContainsText('Routes');

      // click through Builds menu
      menus.leftNav.clickBuilds();
      matchers.expectHeadingContainsText('Builds');
      menus.leftNav.clickPipelines();
      matchers.expectHeadingContainsText('Pipelines');
      menus.leftNav.clickImages();
      matchers.expectHeadingContainsText('Image Streams');

      // click through Resources menu
      menus.leftNav.clickQuota();
      matchers.expectHeadingContainsText('Quota');
      menus.leftNav.clickMembership();
      matchers.expectHeadingContainsText('Membership');
      menus.leftNav.clickConfigMaps();
      matchers.expectHeadingContainsText('Config Maps');
      menus.leftNav.clickSecrets();
      matchers.expectHeadingContainsText('Secrets');
      menus.leftNav.clickOtherResources();
      matchers.expectHeadingContainsText('Other Resources');

      // click remaining primary sidebar items.
      menus.leftNav.clickOverview();
      let overviewPage = new OverviewPage(project);
      // overview doesn't show a heading, best check is url
      matchers.expectPageUrl(overviewPage.getUrl());
      menus.leftNav.clickStorage();
      matchers.expectHeadingContainsText('Storage');
      menus.leftNav.clickMonitoring();
      matchers.expectHeadingContainsText('Monitoring');


      // click through some top level menu items
      menus.topNav.clickCLI();
      matchers.expectHeadingContainsText('Command Line Tools');
      // we lose our nav on these pages.
      browser.navigate().back();
      browser.sleep(timing.navToPage);
      menus.topNav.clickAbout();
      matchers.expectHeadingContainsText('Red Hat Openshift');
      // Documentation link leaves console
      // Copy Login should also just have its own test

      // go to the catalog
      menus.clickLogo();
      browser.sleep(timing.navToPage);
      // test clicking the tile to view the project
      menus.clickViewAllProjects();
      browser.sleep(timing.navToPage);
      let projectList2 = new ProjectListPage();
      projectList2.clickTile(project);
      browser.sleep(timing.navToPage);
      menus.backToPreviousPage();
      // test the view membership dropdown
      logger.log('view membersip');
      let projectList3 = new ProjectListPage();
      projectList3.viewMembership(project);
      browser.sleep(3000);
      logger.log('back to previous page');
      menus.backToPreviousPage();
      // test the delete project dropdown
      browser.sleep(3000);
      logger.log('click logo');
      menus.clickLogo();
      menus.clickViewAllProjects();
      browser.sleep(3000);
      logger.log('delete project');
      let projectList4 = new ProjectListPage();
      projectList4.deleteProject(project);
    });
  });
});
