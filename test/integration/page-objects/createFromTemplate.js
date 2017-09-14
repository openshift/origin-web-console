'use strict';

const winHelper = require('../helpers/window');
const timing = require('../helpers/timing');
const wait = require('../helpers/wait');
const Page = require('./page').Page;


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
    let button = element(by.buttonText('Create'));
    winHelper.scrollToElement(button);
    wait.forClickableElem(button);
    return button.click().then(() => {
      // hiding a delay in here since the action will cause the server
      // to create resources & any actions following clickCreate() will
      // likely expect new DOM nodes to exist
      return browser.sleep(timing.implicitRedirect).then(() => {
        // implicit redirect
        const NextStepsPage = require('./nextSteps').NextStepsPage;
        return new NextStepsPage(this.project);
      });
    });
  }
}

exports.CreateFromTemplatePage = CreateFromTemplatePage;
