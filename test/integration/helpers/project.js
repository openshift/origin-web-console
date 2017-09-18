'use strict';

const h = require('../helpers.js');

// TODO: factor this out into a proper page object
exports.visitCreatePage = () => {
  h.goToPage('create-project');
};

exports.projectDetails = () => {
  let timestamp = (new Date()).getTime();
  let project = {
    name:        'console-test-project-' + timestamp,
    displayName: 'Console integration test Project ' + timestamp,
    description: 'Created by integration tests'
  };
  return project;
};

exports.createProject = (project, uri) => {
  for (let key in project) {
    h.setInputValue(key, project[key]);
  }
  h.clickAndGo('Create', uri);
};

exports.deleteProject = (project) => {
  h.goToPage('projects');
  let projectTile = element(by.cssContainingText(".project-info", project['name']));
  projectTile.element(by.css('.dropdown-toggle')).click();
  projectTile.element(by.linkText('Delete Project')).click();
  h.setInputValue('confirmName', project.name);
  let deleteButton = element(by.cssContainingText(".modal-dialog .btn", "Delete"));
  browser.wait(protractor.ExpectedConditions.elementToBeClickable(deleteButton), 2000);
  deleteButton.click();
  h.waitForPresence(".alert-success", "marked for deletion");
};

// All projects visible to the current user.
// This function will click the 'delete' on every project that appears on the project list page.
// Be careful about using this function if your test gives the e2e-user access
// to internal projects such as openshift, or openshift-infra
exports.deleteAllProjects = () => {
  h.goToPage('projects');
  let projectTiles = element.all(by.css(".project-info"));
  let allDeleted = protractor.promise.defer();
  let numDeleted = 0;
  let count;
  projectTiles.count().then((num) => {
    count = num;
    // safely fulfill if there happen to be no projects.
    if(count === 0) {
      allDeleted.fulfill();
    }
  });

  projectTiles.each((elem) => {
    let projectTitle = elem.element(by.css('.tile-target span')).getText();
    elem.element(by.css('.dropdown-toggle')).click();
    elem.element(by.linkText('Delete Project')).click();
    h.setInputValue('confirmName', projectTitle);
    // then click delete
    let modal = element(by.css('.modal-dialog'));
    let deleteButton = modal.element(by.cssContainingText(".modal-dialog .btn", "Delete"));
    browser.wait(protractor.ExpectedConditions.elementToBeClickable(deleteButton), 2000);
    deleteButton.click();
    h.waitForPresence(".alert-success", "marked for deletion");
    h.waitForElemRemoval(element(by.css('.modal-dialog')));
    numDeleted++;
    if(numDeleted >= count) {
      allDeleted.fulfill(numDeleted);
    }
  });
  return allDeleted.promise;
};
