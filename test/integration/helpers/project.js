'use strict';

var h = require('../helpers.js');

// TODO: factor this out into a proper page object
exports.visitCreatePage = function() {
  h.goToPage('create-project');
};

exports.projectDetails = function() {
  var timestamp = (new Date()).getTime();
  var project = {
    name:        'console-test-project-' + timestamp,
    displayName: 'Console integration test Project ' + timestamp,
    description: 'Created by integration tests'
  };
  return project;
};

exports.createProject = function(project, uri) {
  for (var key in project) {
    h.setInputValue(key, project[key]);
  }
  h.clickAndGo('Create', uri);
};

exports.deleteProject = function(project) {
  h.goToPage('/');
  var projectTile = element(by.cssContainingText(".project-info", project['name']));
  projectTile.element(by.css('.fa-trash-o')).click();
  h.setInputValue('confirmName', project.name);
  var deleteButton = element(by.cssContainingText(".modal-dialog .btn", "Delete"));
  browser.wait(protractor.ExpectedConditions.elementToBeClickable(deleteButton), 2000);
  deleteButton.click();
  h.waitForPresence(".alert-success", "marked for deletion");
};

exports.deleteAllProjects = function() {
  h.goToPage('/');
  var projectTiles = element.all(by.css(".project-info"));
  var allDeleted = protractor.promise.defer();
  var numDeleted = 0;
  var count;
  projectTiles
    .count()
    .then(function(num) {
      count = num;
      // safely fulfill if there happen to be no projects.
      if(count === 0) {
        allDeleted.fulfill();
      }
    });

  projectTiles.each(function(elem) {
    var projectTitle = elem.element(by.css('.tile-target span')).getText();
    // click trash first
    elem.element(by.css('.fa-trash-o')).click();
    h.setInputValue('confirmName', projectTitle);
    // then click delete
    var deleteButton = element(by.cssContainingText(".modal-dialog .btn", "Delete"));
    browser.wait(protractor.ExpectedConditions.elementToBeClickable(deleteButton), 2000);
    deleteButton.click();
    h.waitForPresence(".alert-success", "marked for deletion");
    numDeleted++;
    if(numDeleted >= count) {
      allDeleted.fulfill(numDeleted);
    }
  });
  return allDeleted.promise;
};
