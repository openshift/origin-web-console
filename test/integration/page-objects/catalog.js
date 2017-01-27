'use strict';

const h = require('../helpers.js');
const inputs = require('../helpers/inputs');
const Page = require('./page').Page;

let AddTemplateModal = function(project) {
  this.project = project;
  this.modal = element(by.css('.modal-dialog'));
  this.checkboxes = this.modal.all(by.css('input[type="checkbox"]'));
  this.processBox = this.checkboxes.get(0);
  this.saveBox = this.checkboxes.get(1);
  this.continue = this.modal.element(by.cssContainingText('.btn-primary', 'Continue'));
  this.cancel = this.modal.element(by.cssContainingText('.btn-default', 'Cancel'));
  this.process = function() {
    inputs.check(this.processBox);
    inputs.uncheck(this.saveBox);
    this.continue.click();
    return browser.sleep(500).then(function() {
      // lazy require to avoid potential of circular dependencies
      var CreateFromTemplatePage = require('./createFromTemplate').CreateFromTemplatePage;
      return new CreateFromTemplatePage(this.project);
    }.bind(this));
  };
  this.save = function() {
    inputs.uncheck(this.processBox);
    inputs.check(this.saveBox);
    this.cancel.click();
    browser.sleep(500);
    return this;
  };
};

class CatalogPage extends Page {
  constructor(project, menu) {
    super(project, menu);
  }
  getUrl() {
    // TODO: ?tab=tab=fromFile, ?tab=fromCatalog, ?tab=deployImage
    return 'project/' + this.project.name + '/create';
  }
  _findTabs() {
    let tabs = element(by.css('.nav-tabs'));
    h.waitForElem(tabs);
    return tabs;
  }
  clickBrowseCatalog() {
    return this._findTabs()
               .element(by.cssContainingText('a', 'Browse Catalog'))
               .click();
  }
  clickDeployImage() {
    return this._findTabs()
               .element(by.cssContainingText('a', 'Deploy Image'))
               .click();
  }
  clickImport() {
    return this._findTabs()
               .element(by.cssContainingText('a', 'Import YAML / JSON'))
               .click();
  }
  setImportValue(str) {
    return browser.executeScript((value) => {
      window.ace.edit('add-component-editor').setValue(value);
    }, str);
  }
  getImportValue() {
    return browser.executeScript(() => {
      return window.ace.edit('add-component-editor').getValue();
    });
  }
  submitImport() {
    element(by.cssContainingText('.btn-primary','Create')).click();
    return browser.sleep(500).then(() => {
      return new AddTemplateModal(this.project);
    });
  }
  processTemplate(templateStr) {
    this.clickImport();
    return this.setImportValue(templateStr).then(() => {
      return this.submitImport().then((addTemplateModal) => {
        // implicit nav therefore returns new CreateFromTemplatePage()
        return addTemplateModal.process();
      });
    });
  }
}

exports.CatalogPage = CatalogPage;
