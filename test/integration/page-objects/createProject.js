'use strict';

const h = require('../helpers.js');
const Page = require('./page').Page;

class CreateProjectPage extends Page {
  constructor(project, menu) {
    super(project, menu);
  }
  getUrl() {
    return 'create-project';
  }
  enterProjectInfo() {
    for (let key in this.project) {
      h.waitForElem( element( by.model( key )));
      h.setInputValue(key, this.project[key]);
    }
    return this;
  }
  submit() {
    let button = element(by.buttonText('Create'));
    button.click();
  }
  // TODO: there is an implicit navigation here, this should return a new Overview page for clarity
  createProject() {
    this.enterProjectInfo();
    return this.submit();
  }
}

exports.CreateProjectPage = CreateProjectPage;
