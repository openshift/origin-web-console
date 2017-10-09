'use strict';

const timing = require('../../helpers/timing');


class CatalogOverlayModal {
  constructor() {
    this.overlayPanel = element(by.css('.catalogs-overlay-panel'));
    this.cancelButton = this.overlayPanel.element(by.cssContainingText('.btn-cancel', 'Cancel'));
    this.nextButton = this.overlayPanel.element(by.id('nextButton'));
    this.backButton = this.overlayPanel.element(by.id('backButton'));
    this.closeButton = this.nextButton;
    this.createButton = this.nextButton;
    browser.sleep(500);
  }

  // the primary interactions
  clickNext() {
    this.nextButton.click();
  }
  clickBack() {
    this.backButton.click();
  }
  clickCancel() {
    this.cancelButton.click();
  }
  clickCreate() {
    this.createButton.click();
    return browser.sleep(timing.waitForElement);
  }
  clickClose() {
    this.createButton.click();
  }
  clickContinueToProjectOverview() {
    let btn = this.overlayPanel.element(by.cssContainingText('a', 'Continue to the project overview'));
    return btn.click().then(() => {
      return browser.sleep(timing.implicitRedirect).then(() => {
        let OverviewPage = require('../overview').OverviewPage;
        return new OverviewPage(this.project);
      });
    });
  }

  // project interactions
  // selectProject() {
  //  TODO: implement ability to choose from existing.
  // }
  enterProjectInfo(project) {
    this.project = project;

    this.overlayPanel.element(by.id('name')).sendKeys(project.name);
    this.overlayPanel.element(by.id('displayName')).sendKeys(project.displayName);
    this.overlayPanel.element(by.id('description')).sendKeys(project.description);
  }

  // app interactions
  enterAppName(appName) {
    this.overlayPanel.element(by.id('app-name')).sendKeys(appName);
  }
  enterGitRepo(repoUrl) {
    this.overlayPanel.element(by.id('repository')).sendKeys(repoUrl);
  }
  clickTrySample() {
    this.overlayPanel.element(by.cssContainingText('a', 'Try Sample Repository')).click();
  }

}

exports.CatalogOverlayModal = CatalogOverlayModal;
