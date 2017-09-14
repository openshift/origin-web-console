'use strict';

const h = require('../helpers.js');
const timing = require('../helpers/timing');
const Page = require('./page').Page;
const AddTemplateModal = require('./modals/addTemplateModal').AddTemplateModal;

class LegacyCatalogPage extends Page {
  constructor(project, menu) {
    super(project, menu);
  }
  getUrl() {
    //  This should probably support tabs:
    //  ?tab=tab=fromFile, ?tab=fromCatalog, ?tab=deployImage
    return 'project/' + this.project.name + '/create';
  }
  _findTabs() {
    let tabs = element(by.css('.nav-tabs'));
    h.waitForElem(tabs);
    return tabs;
  }
  clickTile(heading) {
    element(by.cssContainingText('.tile', heading)).click();
  }
  clickCategory(heading) {
    return this.clickTile(heading);
  }
  findTileBy(heading, namespace) {
    var tiles = element.all(by.cssContainingText(heading));
    return namespace ?
      tiles.all(by.cssContainingText(namespace)).first() :
      tiles;
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
      window.ace.edit('ace-yaml-editor').setValue(value);
    }, str);
  }
  getImportValue() {
    return browser.executeScript(() => {
      return window.ace.edit('ace-yaml-editor').getValue();
    });
  }
  submitTemplate() {
    element(by.cssContainingText('.btn-primary','Create')).click();
    return browser.sleep(timing.implicitRedirect).then(() => {
      return new AddTemplateModal(this.project);
    });
  }
  submitImageStream() {
    return element(by.cssContainingText('.btn-primary','Create'))
            .click().then(() => {
              // delay to allow the server to generate
              // resources before continuing through the flow.
              return browser.sleep(timing.standardDelay);
            });
  }
  processTemplate(templateStr) {
    this.clickImport();
    return this.setImportValue(templateStr).then(() => {
      return this.submitTemplate().then((addTemplateModal) => {
        // implicit nav therefore returns new CreateFromTemplatePage()
        return addTemplateModal.process();
      });
    });
  }
  saveTemplate(templateStr) {
    this.clickImport();
    return this.setImportValue(templateStr).then(() => {
      return this.submitTemplate().then((addTemplateModal) => {
        // implicit nav therefore returns new CreateFromTemplatePage()
        return addTemplateModal.save();
      });
    });
  }
  processImageStream(imageStreamStr) {
    this.clickImport();
    return this.setImportValue(imageStreamStr).then(() => {
      return this.submitImageStream();
    });
  }
}

exports.LegacyCatalogPage = LegacyCatalogPage;
