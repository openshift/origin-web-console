'use strict';

const h = require('../helpers.js');
const timing = require('../helpers/timing');
const logger = require('../helpers/logger');

const Page = require('./page').Page;

class CreateFromURLPage extends Page {
  constructor(project, menu) {
    super(project, menu);
  }
  getUrl(qs) {
    return 'create' + qs;
  }
  // FIXME: for some reason, the Page.visit()'s use of helpers.goToPage()
  // does not work here, so we have to override.
  visit(qs) {
    this.qs = qs;
    logger.log('Visiting url (refresh):', this.getUrl(this.qs));
    return browser.get('create' + this.qs).then(() => {
      // Calling visit performs a browser refresh each time.
      return browser.sleep(timing.initialVisit);
    });
  }
  clickCreateNewProjectTab() {
    return element(by.css('.nav-tabs')).isPresent()
      .then((result) => {
        if (result) {
          element.all(by.css('.nav-tabs > li > a')).last().click();
        }
      });
  }
  selectExistingProject(stringFragment, uri) {
    return element(by.css('.nav-tabs')).isPresent()
      .then((result) => {
        if (result) {
          // select project from the dropdown and click next
          element(by.model('selected.project')).click();
          element(by.css('.ui-select-search')).sendKeys(stringFragment).sendKeys(protractor.Key.ENTER);
          h.clickAndGo('Next', uri);
        }
      });
  }
  clickShowAdvanced() {
    return element(by.css('[ng-click="advancedOptions = !advancedOptions"]')).click();
  }
}

exports.CreateFromURLPage = CreateFromURLPage;
