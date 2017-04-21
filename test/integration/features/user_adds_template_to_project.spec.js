'use strict';

var h = require('../helpers');
var projectHelpers = require('../helpers/project');
var OverviewPage = require('../page-objects/overview').OverviewPage;
var CreateProjectPage = require('../page-objects/createProject').CreateProjectPage;
var DeploymentsPage = require('../page-objects/deployments').DeploymentsPage;
var ServicesPage = require('../page-objects/services').ServicesPage;
var RoutesPage = require('../page-objects/routes').RoutesPage;
var nodeMongoTemplate = require('../fixtures/nodejs-mongodb');

describe('User adds a template to a project', function() {

  beforeEach(function() {
    h.commonSetup();
    h.login();
    projectHelpers.deleteAllProjects();
  });

  afterEach(function() {
    h.commonTeardown();
  });

  describe('after creating a new project', function() {
    describe('using the Import YAML/JSON tab', function() {
      it('should process and create the objects in the template', function() {
        var project = projectHelpers.projectDetails();
        var createProjectPage = new CreateProjectPage(project);
        createProjectPage.visit();
        createProjectPage.createProject();
        var overviewPage = new OverviewPage(project);
        overviewPage.visit();
        var catalogPage = overviewPage.clickAddToProject();   // implicit redirect to catalog page
        catalogPage
          .processTemplate(JSON.stringify(nodeMongoTemplate))
          .then(function(createFromTemplatePage) {
            createFromTemplatePage.clickCreate();             // implicit redirect to overview page
            // verify we have the 2 deployments in the template
            var deploymentsPage = new DeploymentsPage(project);
            deploymentsPage.visit();
            expect(element(by.cssContainingText('td', 'mongodb')).isPresent()).toBe(true); // TODO: use fixture
            expect(element(by.cssContainingText('td', 'nodejs-mongodb-example')).isPresent()).toBe(true); // TODO: use fixture
            // verify we have the two services in the template
            var servicesPage = new ServicesPage(project);
            servicesPage.visit();
            expect(element(by.cssContainingText('td', 'mongodb')).isPresent()).toBe(true); // TODO: use fixture
            expect(element(by.cssContainingText('td', 'nodejs-mongodb-example')).isPresent()).toBe(true); // TODO: use fixture
            // verify we have one route for the mongo app
            var routesPage = new RoutesPage(project);
            routesPage.visit();
            expect(element(by.cssContainingText('td', 'nodejs-mongodb-example')).isPresent()).toBe(true); // TODO: use fixture
          });
      });

      it('should save the template in the project catalog', function() {
        // TODO: same flow as the above test, but use:
        //    catalogPage.saveTemplate(tpl)
        // & assert that the template was added to the catalog in this project
        var project = projectHelpers.projectDetails();
        var createProjectPage = new CreateProjectPage(project);
        createProjectPage.visit();
        createProjectPage.createProject();
        var overviewPage = new OverviewPage(project);
        overviewPage.visit();
        var catalogPage = overviewPage.clickAddToProject();   // implicit redirect to catalog page
        catalogPage
          .saveTemplate(JSON.stringify(nodeMongoTemplate))
          .then((overview2) => {
            var cat2 = overview2.clickAddToProject();   // implicit redirect to catalog page
            // once the template processes, we just have to return
            // to the catalog and verify the tile exists
            cat2.visit();
            cat2.clickCategory('JavaScript'); // TODO: pass in the tile name from the template fixture
            cat2.findTileBy('Node.js + MongoDB (Ephemeral)', project.name); // TODO: pass in...
            expect(element).toBeTruthy();
          });
      });
    });
  });
});
