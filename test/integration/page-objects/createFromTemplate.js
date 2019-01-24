'use strict';

const h = require('../helpers');
const Page = require('./page').Page;
const scroller = require('../helpers/scroll');

class CreateFromTemplatePage extends Page {
  constructor(project, menu) {
    super(project, menu);
  }
  getUrl() {
    return `project/${this.project.name}/create/fromtemplate?template=${this.template.name}`;
  }
  clickCreate() {
    scroller.toBottom();
    let button = element(by.buttonText('Create'));
    h.waitForElem(button);
    return button.click().then(() => {
      const OverviewPage = require('./overview').OverviewPage;
      return new OverviewPage(this.project);
    });
  }
}

exports.CreateFromTemplatePage = CreateFromTemplatePage;
