'use strict';

const h = require('../helpers');
const timing = require('../helpers/timing');
const logger = require('../helpers/logger');
const defaultMenus = require('./menus');

class Page {
  constructor(project, menus) {
    this.project = project;
    this.menus = menus || defaultMenus;
    // Whenever a page is created, we need to give
    // it some time to render
    browser.sleep(timing.standardDelay);
  }

  // In case the project needs to be changed after the fact.
  // page-objects are loosely tied to the underlying pages, so
  // it is fine to reuse them.  Typically it is recommended to
  // create new objects, however, to keep the test flow clear.
  setProject(project) {
    this.project = project;
  }

  getUrl() {

  }
  // Visit should only be used as the initial entry point to
  // the app.  After that, tests should use page.menu.click()
  // to navigate.
  visit() {
    logger.log('Visiting url (refresh):', this.getUrl());
    return h.goToPage(this.getUrl()).then(() => {
      // Calling visit performs a browser refresh each time.
      browser.sleep(timing.initialVisit);
    });
  }

}

exports.Page = Page;
