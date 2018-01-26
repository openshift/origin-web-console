'use strict';

require('jasmine-beforeall');

const h = require('../helpers');
const matchersHelpers = require('../helpers/matchers');
const projectHelpers = require('../helpers/project');
const inputsHelpers = require('../helpers/inputs');
const CreateFromURLPage = require('../page-objects/createFromURL').CreateFromURLPage;
const CreateProjectPage = require('../page-objects/createProject').CreateProjectPage;
const CatalogPage = require('../page-objects/catalog').CatalogPage;
const nodeMongoTemplate = require('../fixtures/nodejs-mongodb');
const centosImageStream = require('../fixtures/image-streams-centos7.json');

describe('authenticated e2e-user', function() {

  let project = projectHelpers.projectDetails();
  // This namespace is whitelisted for the tests in test/extensions/test-extensions.js
  let namespaceForFixtures = "template-dumpster";

  let setupEnv = function() {
    let fixturesProject = {name: namespaceForFixtures};
    let createProjectPage = new CreateProjectPage(fixturesProject);
    createProjectPage.visit();
    createProjectPage.createProject();
    let catalogPage = new CatalogPage(fixturesProject);
    // - add an image stream to that namespace
    catalogPage.visit();
    catalogPage.processImageStream(JSON.stringify(centosImageStream));
    // - add a template to that namespace
    catalogPage.visit();
    catalogPage.saveTemplate(JSON.stringify(nodeMongoTemplate));
  };

  beforeAll(function() {
    h.commonSetup();
    h.login();
    projectHelpers.deleteAllProjects();
    setupEnv();
  });

  afterAll(function() {
    projectHelpers.deleteAllProjects();
    h.afterAllTeardown();
  });

  describe('create from URL', function() {

    describe('using an image stream and image stream tag supplied as query string params', function() {

      let name = 'nodejs-edited';
      let sourceURI = 'https://github.com/openshift/nodejs-ex.git-edited';
      let sourceRef = 'master-edited';
      let contextDir = '/-edited';
      let qs = `?imageStream=nodejs&imageTag=4&name=${name}&sourceURI=${sourceURI}&sourceRef=${sourceRef}&contextDir=${contextDir}&namespace=${namespaceForFixtures}`;
      let uri = `project/${project.name}create/fromimage${qs}`;
      let heading = 'Node.js 4';
      let words = project.name.split(' ');
      let timestamp = words[words.length - 1];

      it('should display details about the the image', function() {
        let createFromURLPage = new CreateFromURLPage();
        createFromURLPage.visit(qs);
        matchersHelpers.expectHeading(heading);
      });

      it('should load the image stream in to a newly created project', function(){
        let createFromURLPage = new CreateFromURLPage();
        createFromURLPage.visit(qs);
        createFromURLPage.clickCreateNewProjectTab();
        projectHelpers.createProject(project, 'project/' + project['name'] + 'create/fromimage' + qs);
        matchersHelpers.expectHeading(heading);
        projectHelpers.deleteProject(project);
      });

      it('should load the image stream in to an existing project and verify the query string params are loaded in to the corresponding form fields', function(){
        let createFromURLPage = new CreateFromURLPage();
        projectHelpers.visitCreatePage();
        projectHelpers.createProject(project);
        createFromURLPage.visit(qs);
        createFromURLPage.selectExistingProject(timestamp, uri);
        matchersHelpers.expectHeading(heading);
        let nameInput = element(by.model('name'));
        expect(nameInput.getAttribute('value')).toEqual(name);
        let sourceURIInput = element(by.model('buildConfig.sourceUrl'));
        expect(sourceURIInput.getAttribute('value')).toEqual(sourceURI);
        createFromURLPage.clickShowAdvanced();
        let sourceRefInput = element(by.model('buildConfig.gitRef'));
        expect(sourceRefInput.getAttribute('value')).toEqual(sourceRef);
        let contextDirInput = element(by.model('buildConfig.contextDir'));
        expect(contextDirInput.getAttribute('value')).toEqual(contextDir);
        projectHelpers.deleteProject(project);
      });

    });

    describe('using a template supplied as a query string param', function() {

      let sourceURL = "https://github.com/openshift/nodejs-ex.git-edited";
      let qs = '?template=nodejs-mongodb-example&templateParamsMap=%7B"SOURCE_REPOSITORY_URL":"' + sourceURL + '"%7D' + '&namespace=' + namespaceForFixtures;
      let uri = 'project/' + project.name + 'create/fromtemplate' + qs;
      let heading = 'Node.js + MongoDB (Ephemeral)';
      let words = project.name.split(' ');
      let timestamp = words[words.length - 1];

      it('should display details about the template', function() {
        let createFromURLPage = new CreateFromURLPage();
        createFromURLPage.visit(qs);
        matchersHelpers.expectHeading(heading);
      });

      it('should load the template in to a newly created project', function() {
        let createFromURLPage = new CreateFromURLPage();
        createFromURLPage.visit(qs);
        createFromURLPage.clickCreateNewProjectTab();
        projectHelpers.createProject(project, 'project/' + project['name'] + 'create/fromtemplate' + qs);
        matchersHelpers.expectHeading(heading);
        projectHelpers.deleteProject(project);
      });

      it('should load the template in an existing project and verify the query string param sourceURL is loaded in to a corresponding form field', function(){
        let createFromURLPage = new CreateFromURLPage();
        projectHelpers.visitCreatePage();
        projectHelpers.createProject(project);
        createFromURLPage.visit(qs);
        createFromURLPage.selectExistingProject(timestamp, uri);
        matchersHelpers.expectHeading(heading);
        inputsHelpers
          .findValueInInputs(element.all(by.model('parameter.value')), sourceURL)
          .then(function(found) {
            expect(found).toEqual(sourceURL);
            projectHelpers.deleteProject(project);
          });
        });

    });

    describe('using a namespace that is not in the whitelist', function() {
      it('should display an error about the namespace', function() {
        let createFromURLPage = new CreateFromURLPage();
        createFromURLPage.visit('?namespace=not-whitelisted');
        matchersHelpers.expectAlert('Resources from the namespace "not-whitelisted" are not permitted.');
      });
    });

    describe('using an unavailable image stream supplied as a query string param', function() {
      it('should display an error about the image stream', function() {
        let createFromURLPage = new CreateFromURLPage();
        createFromURLPage.visit('?imageStream=unavailable-imageStream');
        matchersHelpers.expectAlert('The requested image stream "unavailable-imageStream" could not be loaded.');
      });
    });

    describe('using an unavailable image tag supplied as a query string param', function() {
      it('should display an error about the image tag', function() {
        let createFromURLPage = new CreateFromURLPage();
        createFromURLPage.visit('?imageStream=nodejs&imageTag=unavailable-imageTag' + '&namespace=' + namespaceForFixtures);
        matchersHelpers.expectAlert('The requested image stream tag "unavailable-imageTag" could not be loaded.');
      });
    });

    describe('using an unavailable template supplied as a query string param', function() {
      it('should display an error about the template', function() {
        let createFromURLPage = new CreateFromURLPage();
        createFromURLPage.visit('?template=unavailable-template');
        matchersHelpers.expectAlert('The requested template "unavailable-template" could not be loaded.');
      });
    });

    describe('without using an image stream or a template', function() {
      it('should display an error about needing a resource', function() {
        let createFromURLPage = new CreateFromURLPage();
        createFromURLPage.visit('');
        matchersHelpers.expectAlert('An image stream or template is required.');
      });
    });
    describe('using both an image stream and a template', function() {
      it('should display an error about combining resources', function() {
        let createFromURLPage = new CreateFromURLPage();
        createFromURLPage.visit('?imageStream=nodejs&template=nodejs-mongodb-example' + '&namespace=' + namespaceForFixtures);
        matchersHelpers.expectAlert('Image streams and templates cannot be combined.');
      });
    });
    describe('using an invalid app name as a query string param', function() {
      it('should display an error about the app name', function() {
        let createFromURLPage = new CreateFromURLPage();
        createFromURLPage.visit('?name=InvalidAppName&imageStream=nodejs' + '&namespace=' + namespaceForFixtures);
        matchersHelpers.expectAlert('The app name "InvalidAppName" is not valid. An app name is an alphanumeric (a-z, and 0-9) string with a maximum length of 24 characters, where the first character is a letter (a-z), and the \'-\' character is allowed anywhere except the first or last character.');
      });
    });

  });

});
