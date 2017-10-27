'use strict';

const common = require('../helpers/common');
const timing = require('../helpers/timing');

const projectHelpers = require('../helpers/project');
const matchers = require('../helpers/matchers');

const CreateProjectPage = require('../page-objects/createProject').CreateProjectPage;
const OverviewPage = require('../page-objects/overview').OverviewPage;
const ProjectListPage = require('../page-objects/projectList').ProjectListPage;

const menus = require('../page-objects/menus').menus;

describe('Authenticated user creates a new project', () => {

  beforeAll(() => {
    common.beforeAll();
  });

  beforeEach(() => {
    common.beforeEach();
  });

  afterEach(() => {
    common.afterEach();
  });

  afterAll(() => {
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

      // go to the project list page
      menus.clickLogo();
      browser.sleep(timing.navToPage);
      menus.clickViewAllProjects();
      browser.sleep(timing.navToPage);
      let projectList2 = new ProjectListPage();

      projectList2.clickTile(project);
      browser.sleep(timing.navToPage);
      menus.backToPreviousPage();

      // projectList2.editProject(project);
      // browser.sleep(1000);
      // menus.backToPreviousPage();

      projectList2.viewMembership(project);
      browser.sleep(1000);
      menus.backToPreviousPage();

      projectList2.deleteProject(project);

    });
  });
});
