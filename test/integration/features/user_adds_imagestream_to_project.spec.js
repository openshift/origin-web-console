'use strict';

var h = require('../helpers');
var projectHelpers = require('../helpers/project');
var OverviewPage = require('../page-objects/overview').OverviewPage;
var CreateProjectPage = require('../page-objects/createProject').CreateProjectPage;
var ImageStreamsPage = require('../page-objects/imageStreams').ImageStreamsPage;
var centosImageStream = require('../fixtures/image-streams-centos7.json');

describe('User adds an image stream to a project', function() {

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
      it('should process and create the images in the image stream', function() {
        var project = projectHelpers.projectDetails();
        var createProjectPage = new CreateProjectPage(project);
        createProjectPage.visit();
        createProjectPage.createProject();
        var overviewPage = new OverviewPage(project);
        overviewPage.visit();
        var catalogPage = overviewPage.clickAddToProject();   // implicit redirect to catalog page
        catalogPage
          .processImageStream(JSON.stringify(centosImageStream))
          .then(function() {
            // verify we have the nodejs image stream loaded
            var imageStreamsPage = new ImageStreamsPage(project);
            imageStreamsPage.visit();
            expect(element(by.cssContainingText('td', 'nodejs')).isPresent()).toBe(true); // TODO: use fixture
          });
      });
    });
  });
});
