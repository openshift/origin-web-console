'use strict';

const common = require('../helpers/common');
const projectHelpers = require('../helpers/project');

const CatalogPage = require('../page-objects/legacyCatalog').LegacyCatalogPage;
const CreateProjectPage = require('../page-objects/createProject').CreateProjectPage;
const DeploymentsPage = require('../page-objects/deployments').DeploymentsPage;
const ServicesPage = require('../page-objects/services').ServicesPage;
const RoutesPage = require('../page-objects/routes').RoutesPage;

const nodeMongoTemplate = require('../fixtures/nodejs-mongodb');

describe('User adds a template to a project', () => {

  beforeEach(() => {
    common.beforeEach();
  });

  afterEach(() => {
    common.afterEach();
  });

  // TODO: the expect() statements below are using hard-coded values
  // rather than testing against the fixture itself.  This is fine for
  // now, but if we ever update the fixture the tests will likely break.
  // In addition, expect(element).toBeTruthy() is not meaningful.
  describe('after creating a new project', () => {
    describe('using the Import YAML tab', () => {
      it('should process and create the objects in the template', () => {
        let project = projectHelpers.projectDetails();
        let createProjectPage = new CreateProjectPage(project);
        createProjectPage.visit();
        createProjectPage.createProject();
        let catalogPage = new CatalogPage(project);
        catalogPage.visit();
        catalogPage
          .processTemplate(JSON.stringify(nodeMongoTemplate))
          .then((createFromTemplatePage) => {
            // implicit redirect to overview page
            createFromTemplatePage.clickCreate();

            // verify we have the 2 deployments in the template
            let deploymentsPage = new DeploymentsPage(project);
            deploymentsPage.visit();
            expect(element(by.cssContainingText('td a', 'mongodb')).isPresent()).toBe(true);
            expect(element(by.cssContainingText('td a', 'nodejs-mongodb-example')).isPresent()).toBe(true);
            // verify we have the two services in the template
            let servicesPage = new ServicesPage(project);
            servicesPage.visit();
            expect(element(by.cssContainingText('td a', 'mongodb')).isPresent()).toBe(true);
            expect(element(by.cssContainingText('td a', 'nodejs-mongodb-example')).isPresent()).toBe(true);
            // verify we have one route for the mongo app
            let routesPage = new RoutesPage(project);
            routesPage.visit();
            expect(element(by.cssContainingText('td a', 'nodejs-mongodb-example')).isPresent()).toBe(true);
          });
      });

      it('should save the template in the project catalog', () => {
        let project = projectHelpers.projectDetails();
        let createProjectPage = new CreateProjectPage(project);
        createProjectPage.visit();
        createProjectPage.createProject();
        let catalogPage = new CatalogPage(project);
        catalogPage.visit();
        catalogPage
          .saveTemplate(JSON.stringify(nodeMongoTemplate))
          .then(() => {
            catalogPage.visit();
            catalogPage.clickCategory('JavaScript');
            catalogPage.findTileBy('Node.js + MongoDB (Ephemeral)', project.name);
            expect(element).toBeTruthy();
          });
      });
    });
  });
});
