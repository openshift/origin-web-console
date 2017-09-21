'use strict';

const h = require('../helpers');
const Page = require('./page').Page;

class OverviewPage extends Page {
  constructor(project, menu) {
    super(project, menu);
  }
  getUrl() {
    return 'project/' + this.project.name + '/overview';
  }
  clickAddToProject() {
    // The project bar uses `ng-show` instead of `ng-if,` so make sure it's
    // visible before continuing.
    h.waitForVisibility(element(by.css('.project-bar')));
    let button = element(by.cssContainingText('.add-to-project .dropdown-toggle', 'Add to Project'));
    h.waitForElem(button);
    button.click();
  }
}

exports.OverviewPage = OverviewPage;
