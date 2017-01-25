'use strict';

require('jasmine-beforeall');
var h = require('../helpers');
var projectHelpers = require('../helpers/project');
var OverviewPage = require('../page-objects/overview').OverviewPage;
var CreateProjectPage = require('../page-objects/createProject').CreateProjectPage;
var DeploymentsPage = require('../page-objects/deployments').DeploymentsPage;
var ServicesPage = require('../page-objects/services').ServicesPage;
var RoutesPage = require('../page-objects/routes').RoutesPage;
var nodeMongoTemplate = require('../fixtures/nodejs-mongodb');
//var logger = require('../helpers/logger');
// TODO: use this to alter whitelist in the tests to support the create from url flow
// var env = require('../helpers/env');

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
    describe('using the "Import YAML/JSON" tab', function() {
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
            expect(element(by.cssContainingText('td', 'mongodb')).isPresent()).toBe(true);
            expect(element(by.cssContainingText('td', 'nodejs-mongodb-example')).isPresent()).toBe(true);
            // verify we have the two services in the template
            var servicesPage = new ServicesPage(project);
            servicesPage.visit();
            expect(element(by.cssContainingText('td', 'mongodb')).isPresent()).toBe(true);
            expect(element(by.cssContainingText('td', 'nodejs-mongodb-example')).isPresent()).toBe(true);
            // verify we have one route for the mongo app
            var routesPage = new RoutesPage(project);
            routesPage.visit();
            expect(element(by.cssContainingText('td', 'nodejs-mongodb-example')).isPresent()).toBe(true);
          });
      });

      xit('should save the template in the project catalog', function() {
        // TODO: same flow as the above test, but use:
        //    catalogPage.saveTemplate(tpl)
        // & assert that the template was added to the catalog in this project
      });
    });
  });
});
