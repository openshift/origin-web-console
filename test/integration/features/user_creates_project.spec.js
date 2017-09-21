'use strict';
/* jshint unused:false */

const h = require('../helpers.js');
const projectHelpers = require('../helpers/project.js');

let goToAddToProjectPage = (projectName) => {
  let uri = 'project/' + projectName + '/create';
  h.goToPage(uri);
  expect(element(by.cssContainingText('.middle h1', "Create Using Your Code")).isPresent()).toBe(true);
  expect(element(by.cssContainingText('.middle h1', "Create Using a Template")).isPresent()).toBe(true);
  expect(element(by.model('from_source_url')).isPresent()).toBe(true);
  expect(element(by.cssContainingText('.catalog h3 > a', "ruby-helloworld-sample")).isPresent()).toBe(true);
};

let goToCreateProjectPage = () => {
  h.goToPage('create-project');
  expect(element(by.cssContainingText('.middle h1', "Create Project")).isPresent()).toBe(true);
  expect(element(by.model('name')).isPresent()).toBe(true);
  expect(element(by.model('displayName')).isPresent()).toBe(true);
  expect(element(by.model('description')).isPresent()).toBe(true);
};

let requestCreateFromSource = (projectName, sourceUrl) => {
  let uri = 'project/' + projectName + '/create';
  h.waitForUri(uri);
  h.setInputValue('from_source_url', sourceUrl);
  let nextButton = element(by.buttonText('Next'));
  browser.wait(protractor.ExpectedConditions.elementToBeClickable(nextButton), 2000);
  nextButton.click();
};

let requestCreateFromTemplate = (projectName, templateName) => {
  let uri = 'project/' + projectName + '/create';
  h.waitForUri(uri);
  let template = element(by.cssContainingText('.catalog h3 > a', templateName));
  expect(template.isPresent()).toBe(true);
  template.click();
};

let attachBuilderImageToSource = (projectName, builderImageName) => {
  let uri = 'project/' + projectName + '/catalog/images';
  h.waitForUri(uri);
  expect(element(by.cssContainingText('.middle h1', "Select a builder image")).isPresent()).toBe(true);
  let builderImageLink = element(by.cssContainingText('h3 > a', builderImageName));
  expect(builderImageLink.isPresent()).toBe(true);
  builderImageLink.click();
};

let createFromSource = (projectName, builderImageName, appName) => {
  let uri = 'project/' + projectName + '/create/fromimage';
  h.waitForUri(uri);
  expect(element(by.css('.middle .osc-form h1')).getText()).toEqual(builderImageName);
  expect(element(by.cssContainingText('h2', "Name")).isPresent()).toBe(true);
  expect(element(by.cssContainingText('h2', "Routing")).isPresent()).toBe(true);
  expect(element(by.cssContainingText('h2', "Deployment Configuration")).isPresent()).toBe(true);
  expect(element(by.cssContainingText('h2', "Build Configuration")).isPresent()).toBe(true);
  expect(element(by.cssContainingText('h2', "Scaling")).isPresent()).toBe(true);
  expect(element(by.cssContainingText('h2', "Labels")).isPresent()).toBe(true);
  let appNameInput = element(by.name('appname'));
  appNameInput.clear();
  appNameInput.sendKeys(appName);
  h.clickAndGo('Create', 'project/' + projectName + '/overview');
};

let createFromTemplate = (projectName, templateName, parameterNames, labelNames) => {
  let uri = 'project/' + projectName + '/create/fromtemplate';
  h.waitForUri(uri);
  expect(element(by.css('.middle .osc-form h1')).getText()).toEqual(templateName);
  expect(element(by.cssContainingText('h2', "Images")).isPresent()).toBe(true);
  expect(element(by.cssContainingText('h2', "Parameters")).isPresent()).toBe(true);
  expect(element(by.cssContainingText('h2', "Labels")).isPresent()).toBe(true);
  if (parameterNames) {
    parameterNames.forEach((val) => {
      expect(element(by.cssContainingText('.env-letiable-list label.key', val)).isPresent()).toBe(true);
    });
  }
  if (labelNames) {
    labelNames.forEach((val) => {
      expect(element(by.cssContainingText('.label-list span.key', val)).isPresent()).toBe(true);
    });
  }
  h.clickAndGo('Create', 'project/' + projectName + '/overview');
};

let checkServiceCreated = (projectName, serviceName) => {
  h.goToPage('project/' + projectName + '/overview');
  h.waitForPresence('.component .service', serviceName, 10000);
  h.goToPage('project/' + projectName + '/browse/services');
  h.waitForPresence('h3', serviceName, 10000);
};

let checkProjectSettings = (projectName, displayName, description) => {
  let uri = 'project/' + projectName + '/edit';
  h.goToPage(uri);
  expect(element(by.css('.middle h1')).getText()).toEqual("Edit Project " + projectName);
  expect(element(by.css('#displayName')).getAttribute('value')).toEqual(displayName);
  expect(element(by.css('#description')).getAttribute('value')).toEqual(description);
};


describe('', () => {

  afterAll(function(){
    h.afterAllTeardown();
  });

  describe('authenticated e2e-user', () => {

    beforeEach(() => {
      h.commonSetup();
      h.login();
    });

    afterEach(() => {
      h.commonTeardown();
    });

    describe('new project', () => {

      describe('when creating a new project', () => {

        it('should be able to show the create project page', goToCreateProjectPage);

        let project = projectHelpers.projectDetails();

        it('should successfully create a new project', () => {
          h.goToPage('projects');
          goToCreateProjectPage();
          projectHelpers.createProject(project, 'projects');
          h.goToPage('project/' + project['name'] + '/overview');
          h.waitForPresence('.project-bar option[selected][value="' + project['name'] + '"]');
          checkProjectSettings(project['name'], project['displayName'], project['description']);
        });

        it('should browse builds', () => {
          h.goToPage('project/' + project['name'] + '/browse/builds');
          h.waitForPresence('.middle h1', 'Builds');
          // TODO: validate presented strategies, images, repos
        });

        it('should browse deployments', () => {
          h.goToPage('project/' + project['name'] + '/browse/deployments');
          h.waitForPresence(".middle h1", "Deployments");
          // TODO: validate presented deployments
        });

        it('should browse events', () => {
          h.goToPage('project/' + project['name'] + '/browse/events');
          h.waitForPresence(".middle h1", "Events");
          // TODO: validate presented events
        });

        it('should browse image streams', () => {
          h.goToPage('project/' + project['name'] + '/browse/images');
          h.waitForPresence(".middle h1", "Image Streams");
          // TODO: validate presented images
        });

        it('should browse pods', () => {
          h.goToPage('project/' + project['name'] + '/browse/pods');
          h.waitForPresence(".middle h1", "Pods");
          // TODO: validate presented pods, containers, correlated images, builds, source
        });

        it('should browse services', () => {
          h.goToPage('project/' + project['name'] + '/browse/services');
          h.waitForPresence(".middle h1", "Services");
          // TODO: validate presented ports, routes, selectors
        });

        it('should validate taken name when trying to create', () => {
          goToCreateProjectPage();
          element(by.model('name')).clear().sendKeys(project['name']);
          element(by.buttonText("Create")).click();
          expect(element(by.css("[ng-if=nameTaken]")).isDisplayed()).toBe(true);
          expect(browser.getCurrentUrl()).toMatch(/\/create-project$/);
        });

        it('should delete a project', () => {
          projectHelpers.deleteProject(project);
        });

  /*
        describe('when using console-integration-test-project', function() {
          describe('when adding to project', function() {
            it('should view the create page', function() { goToAddToProjectPage("console-integration-test-project"); });

            it('should create from source', function() {
              let projectName = "console-integration-test-project";
              let sourceUrl = "https://github.com/openshift/rails-ex#master";
              let appName = "rails-ex-mine";
              let builderImage = "ruby";

              goToAddToProjectPage(projectName);
              requestCreateFromSource(projectName, sourceUrl);
              attachBuilderImageToSource(projectName, builderImage);
              createFromSource(projectName, builderImage, appName);
              checkServiceCreated(projectName, appName);
            });

            it('should create from template', function() {
              let projectName = "console-integration-test-project";
              let templateName = "ruby-helloworld-sample";
              let parameterNames = [
                "ADMIN_USERNAME",
                "ADMIN_PASSWORD",
                "MYSQL_USER",
                "MYSQL_PASSWORD",
                "MYSQL_DATABASE"
              ];
              let labelNames = ["template"];

              goToAddToProjectPage(projectName);
              requestCreateFromTemplate(projectName, templateName);
              createFromTemplate(projectName, templateName, parameterNames, labelNames);
              checkServiceCreated(projectName, "frontend");
              checkServiceCreated(projectName, "database");
            });
          });
        });
  */
      });
    });
  });
});
