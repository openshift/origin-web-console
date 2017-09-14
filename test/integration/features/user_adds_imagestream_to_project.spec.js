'use strict';

const common = require('../helpers/common');
const projectHelpers = require('../helpers/project');

const CatalogPage = require('../page-objects/legacyCatalog').LegacyCatalogPage;
const CreateProjectPage = require('../page-objects/createProject').CreateProjectPage;
const ImageStreamsPage = require('../page-objects/imageStreams').ImageStreamsPage;

const centosImageStream = require('../fixtures/image-streams-centos7.json');

describe('User adds an image stream to a project', () => {

  beforeEach(() => {
    common.beforeEach();
  });

  afterEach(() => {
    common.afterEach();
  });

  describe('after creating a new project', () => {
    describe('using the Import YAML tab', () => {
      it('should process and create the images in the image stream', () => {
        let project = projectHelpers.projectDetails();
        let createProjectPage = new CreateProjectPage(project);
        createProjectPage.visit();
        createProjectPage.createProject();
        let catalogPage = new CatalogPage(project);
        catalogPage.visit();
        catalogPage
          .processImageStream(JSON.stringify(centosImageStream))
          .then(() => {
            let imageStreamsPage = new ImageStreamsPage(project);
            imageStreamsPage.visit();
            // TODO: this is not a good test. The output logs will just say
            // expected false to be true. Tests should be much more explicit.
            expect(element(by.cssContainingText('td', 'nodejs')).isPresent()).toBe(true); 
          });
      });
    });
  });
});
