'use strict';

const common = require('../helpers/common');
const projectHelpers = require('../helpers/project');
const matchers = require('../helpers/matchers');
const CatalogPage = require('../page-objects/catalog').CatalogPage;
const CatalogOverlayModal = require('../page-objects/modals/catalogOverlayModal').CatalogOverlayModal;
describe('Authenticated user', () => {

  beforeEach(() => {
    common.beforeEach();
  });

  afterEach(() => {
    common.afterEach();
  });

  describe('adds to project from catalog', () => {
    it('should add the selected image to the project', () => {
      let project = projectHelpers.projectDetails();
      let catalogPage = new CatalogPage();
      let app = {
        name: 'nodejs-example',
        repo: 'https://github.com/openshift/nodejs-ex.git'
      };
      catalogPage.visit();
      catalogPage.clickServiceItemByName('Node.js');

      let catalogModal = new CatalogOverlayModal();

      catalogModal.clickNext();
      catalogModal.enterProjectInfo(project);

      catalogModal.enterAppName(app.name);
      catalogModal.enterGitRepo(app.repo);

      browser.sleep(200);
      catalogModal.clickCreate().then(() => {
        catalogModal.clickContinueToProjectOverview();
        matchers.expectPartialHeading(app.name, false, 'h2');
        // what else should we assert against the overview
        // for this flow?

      });
    });
  });
});
