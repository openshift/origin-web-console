'use strict';

const wait = require('../helpers/wait');
const logger = require('../helpers/logger');
const inputs = require('../helpers/inputs');
const winHelper = require('../helpers/window');
const timing = require('../helpers/timing');
const Page = require('./page').Page;

// these projects should not be deleted
// e2e user should not see them, however.
// const infraProjects = [
//   'default',
//   'kube-public',
//   'kube-service-catalog',
//   'kube-system',
//   'openshift',
//   'openshift-infra',
//   'openshift-node',
//   'openshift-template-service-broker'
// ];

class ProjectTile {
  constructor(project) {
    this.project = project;
    this.tile = element(by.cssContainingText('.list-group-item.project-info', project.name || project.displayName));
    this.tileTargetLink = this.tile.element(by.css('.tile-target'));
    this.menuToggle = this.tile.element(by.css('.dropdown-toggle'));
    this.menu = this.tile.element(by.css('.dropdown-menu'));
    this.viewMembershipButton = this.menu.element(by.cssContainingText('.dropdown-menu li', 'View Membership'));
    this.editProjectButton = this.menu.element(by.cssContainingText('.dropdown-menu li', 'Edit Project'));
    this.deleteProjectButton = this.menu.element(by.cssContainingText('.dropdown-menu li', 'Delete Project'));
  }
  click() {
    winHelper.scrollToElement(this.tileTargetLink);
    return this.tileTargetLink.click();
  }
  _toggleMenu() {
    winHelper.scrollToElement(this.menuToggle);
    return this.menuToggle.click().then(() => {
      return browser.sleep(timing.openMenu);
    });
  }
  clickViewMembership() {
    return this._toggleMenu().then(() => {
      winHelper.scrollToElement(this.viewMembershipButton);
      return this.viewMembershipButton.click();
    });
  }
  clickEdit() {
    return this._toggleMenu().then(() => {
      winHelper.scrollToElement(this.editProjectButton);
      return this.editProjectButton.click();
    });
  }
  clickDelete() {
    return this._toggleMenu().then(() => {
      winHelper.scrollToElement(this.deleteProjectButton);
      return this.deleteProjectButton.click();
    });
  }
  confirmDelete() {
    let modal = element(by.css('.modal-dialog'));
    wait.forElem(modal);
    inputs.setInputValue(by.model('confirmName'), this.project.displayName);
    let deleteButton = element(by.cssContainingText(".modal-dialog .btn", "Delete"));
    wait.forClickableElem(deleteButton);
    deleteButton.click();
    let alert = element(by.cssContainingText('.alert-success', 'marked for deletion'));
    wait.forElem(alert);
    browser.sleep(timing.standardDelay);
  }
}

class ProjectListPage extends Page {
  constructor(project, menu) {
    super(project, menu);
  }
  getUrl() {
    return 'projects';
  }
  // @deprecated
  findProjectTiles() {
    return element.all(by.css('.list-group-item'));
  }
  // @deprecated
  findTileBy(projectName) {
    let elem = element(by.cssContainingText('.tile-target', projectName));
    wait.forElem(elem);
    return elem;
  }
  // @deprecated
  clickTileBy(projectName) {
    // This is an implicit redirect, which typically
    // returns an instance of the new page. It should
    // return  new Overview(relevantProject), but this
    // method doesn't currently take a full project object
    return this.findTileBy(projectName).click();
  }
  clickTile(project) {
    let tile = new ProjectTile(project);
    return tile.click();
  }
  // editProject(project) {
  //   let tile = new ProjectTile(project);
  //   return tile.clickEdit();
  // }
  viewMembership(project) {
    let tile = new ProjectTile(project);
    return tile.clickViewMembership();
  }
  deleteProject(project) {
    logger.log('ProjectList.deleteProject()');
    browser.sleep(1000);
    let tile = new ProjectTile(project);
    return tile.clickDelete().then(() => {
      logger.log('tile.confirmDelete()');
      return tile.confirmDelete();
    });
  }
  _getProjectNames() {
    return element
            .all(by.css('.list-group-item .tile-target'))
            .map((elm) => {
              return elm.getText();
            }).then((texts) => {
              return texts;
            });
  }
  // Most PageObjects are passed a project in the constructor.
  // The ProjectList does not receive a project, as it lists
  // many projects.  In order to act on all projects in the
  // list, this function loops the list & collects the
  // project names manually, then returns a project {object}
  // that can be used to generate ProjectTiles
  _makeDummyProjects() {
    return this._getProjectNames().then((names) => {
      return names.map((name) => {
        return {
          displayName: name
        };
      });
    });
  }
  deleteAllProjects() {
    let allDeleted = protractor.promise.defer();
    let numDeleted = 0;
    let count;
    logger.log('ProjectList:', '.deleteAllProjects()');
    this._makeDummyProjects()
        .then((projects) => {
          count = projects.length;
          if(count === 0) {
            allDeleted.fulfill();
          }
          logger.log('ProjectList:', 'Deleting', count, 'project(s)', JSON.stringify(projects));
          projects.forEach((project) => {
            logger.log('ProjectList:', 'Deleting', project.displayName);
            let tile = new ProjectTile(project);
            tile.clickDelete();
            tile.confirmDelete();
            numDeleted++;
            if(numDeleted >= count) {
              logger.log('ProjectList:', 'all projects deleted');
              allDeleted.fulfill(numDeleted);
            }
            browser.sleep(timing.standardDelay);
          });

        });
    return allDeleted.promise;
  }
}

exports.ProjectListPage = ProjectListPage;
