'use strict';

const inputs = require('../../helpers/inputs');

class AddTemplateModal {
  constructor(project) {
    this.project = project;
    this.modal = element(by.css('.modal-dialog'));
    this.checkboxes = this.modal.all(by.css('input[type="checkbox"]'));
    this.processBox = this.checkboxes.get(0);
    this.saveBox = this.checkboxes.get(1);
    this.continue = this.modal.element(by.cssContainingText('.btn-primary', 'Continue'));
    this.cancel = this.modal.element(by.cssContainingText('.btn-default', 'Cancel'));
  }
  process() {
    inputs.check(this.processBox);
    inputs.uncheck(this.saveBox);
    this.continue.click();
    return browser.sleep(500).then(() => {
      // lazy require to avoid potential of circular dependencies
      let CreateFromTemplatePage = require('../createFromTemplate').CreateFromTemplatePage;
      return new CreateFromTemplatePage(this.project);
    });
  }
  save() {
    inputs.uncheck(this.processBox);
    inputs.check(this.saveBox);
    this.continue.click();
    return browser.sleep(500).then(() => {
      // lazy require
      let OverviewPage = require('../overview').OverviewPage;
      return new OverviewPage(this.project); // automatic redirect
    });
  }
}

exports.AddTemplateModal = AddTemplateModal;
