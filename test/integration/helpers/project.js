'use strict';

const deprecatedHelpers = require('../helpers');
// const wait = require('./wait');
// const logger = require('./logger');

// TODO: factor this out into a proper page object
exports.visitCreatePage = () => {
  deprecatedHelpers.goToPage('create-project');
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
    deprecatedHelpers.setInputValue(key, project[key]);
  }
  deprecatedHelpers.clickAndGo('Create', uri);
};

exports.deleteProject = (project) => {
  deprecatedHelpers.goToPage('projects');
  let projectTile = element(by.cssContainingText(".project-info", project['name']));
  projectTile.element(by.css('.dropdown-toggle')).click();
  projectTile.element(by.linkText('Delete Project')).click();
  deprecatedHelpers.setInputValue('confirmName', project.name);
  let deleteButton = element(by.cssContainingText(".modal-dialog .btn", "Delete"));
  browser.wait(protractor.ExpectedConditions.elementToBeClickable(deleteButton), 2000);
  deleteButton.click();
  deprecatedHelpers.waitForPresence(".alert-success", "marked for deletion");
};

// All projects visible to the current user.
// This function will click the 'delete' on every project that appears on the project list page.
// Be careful about using this function if your test gives the e2e-user access
// to internal projects such as openshift, or openshift-infra
exports.deleteAllProjects = () => {
  return;
  // deprecatedHelpers.goToPage('projects');
  // let projectTiles = element.all(by.css(".project-info"));
  // let allDeleted = protractor.promise.defer();
  // let numDeleted = 0;
  // let count;
  // projectTiles.count().then((num) => {
  //   count = num;
  //   // safely fulfill if there happen to be no projects.
  //   if(count === 0) {
  //     allDeleted.fulfill();
  //   }
  //   logger.log('LOGGER: projects to delete:', count);
  // });
  //
  // projectTiles.each((elem, index) => {
  //   logger.log('LOGGER: deleting', index);
  //   let projectTitle = elem.element(by.css('.tile-target span')).getText();
  //   elem.element(by.css('.dropdown-toggle')).click();
  //   elem.element(by.linkText('Delete Project')).click();
  //   deprecatedHelpers.setInputValue('confirmName', projectTitle);
  //
  //   let deleteModal = element(by.css('.delete-resource-modal'));
  //   wait.forElem(deleteModal);
  //   let deleteButton = deleteModal.element(by.cssContainingText(".modal-dialog .btn", "Delete"));
  //   wait.forClickableElem(deleteButton);
  //   deleteButton.click();
  //
  //   // let projectMarkedForDeletionToast = element(
  //   //                                       by.cssContainingText(
  //   //                                         '.toast-pf.alert.alert-success',
  //   //                                         `Project ${projectTitle} was marked for deletion.`));
  //   // wait.forElem(projectMarkedForDeletionToast);
  //
  //   numDeleted++;
  //   if(numDeleted >= count) {
  //     logger.log('LOGGER: welp, must be done? (1)', numDeleted, count);
  //     allDeleted.fulfill(numDeleted);
  //   }
  // });
  // return allDeleted.promise;
};
