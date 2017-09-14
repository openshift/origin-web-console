'use strict';

const timing = require('./timing');
const setInputValue = require('./inputs').setInputValue;

exports.submitNewProjectForm = function(project) {
  for (let key in project) {
    setInputValue(by.model(key), project[key]);
  }

  return element(by.buttonText('Create')).click().then(() => {
    // There is an implicit redirect in these forms, but it
    // is not always to the same destination.  Each test will
    // have to be responsible for handling its own flow.
    return browser.sleep(timing.implicitRedirect);
  });
};
