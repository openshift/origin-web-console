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
