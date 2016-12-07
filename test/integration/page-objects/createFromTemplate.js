'use strict';

const h = require('../helpers');
const Page = require('./page').Page;
const scroller = require('../helpers/scroll'); 

class CreateFromTemplatePage extends Page {
  constructor(project, menu) {
    super(project, menu);
  }
  getUrl() {
    let url = 'project/' + this.project.name + '/create/fromtemplate';
    if(this.template) {
      url += '?template='+this.template.name; //+'&namespace='; may need template namespace...
    }
    return url;
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
