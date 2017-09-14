'use strict';

const timing = require('./timing');
const setInputValue = require('./inputs').setInputValue;

exports.submitNewProjectForm = function(project) {

  if(project.name) {
    setInputValue(by.model('name'), project.name);
  }
  if(project.displayName) {
    setInputValue(by.model('displayName'), project.displayName);
  }
  if(project.description) {
    setInputValue(by.model('description'), project.description);
  }
  return element(by.buttonText('Create')).click().then(() => {
    // There is an implicit redirect in these forms, but it
    // is not always to the same destination.  Each test will
    // have to be responsible for handling its own flow.
    return browser.sleep(timing.implicitRedirect);
  });
};
