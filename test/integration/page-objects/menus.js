'use strict';

// helpers
var clickNestedMenuItem = function(mainMenuSelector, childMenuSelector) {
  return element(mainMenuSelector).click().then(() => {
    return browser.sleep(300).then(() => {
      return element(childMenuSelector).click();
    });
  });
};

exports.menus = {
  topNav: {
    clickDocumentation: () => {
      return clickNestedMenuItem(by.id('help-dropdown'), by.cssContainingText('.dropdown.open', 'Documentation'));
    },
    clickCLI: () => {
      return clickNestedMenuItem(by.id('help-dropdown'), by.css('.dropdown.open', 'Command Line Tools'));
    },
    clickAbout: () => {
      return clickNestedMenuItem(by.id('help-dropdown'), by.css('.dropdown.open', 'About'));
    },
    clickLogout: () => {
      return clickNestedMenuItem(by.id('iser-dropdown'), by.css('.dropdown.open', 'Logout'));
    }
  },
  // example:
  //  AnyPage.leftNav.clickPods();
  leftNav: {
    clickOverview: () => {
      return element(by.cssContainingText('.dropdown-toggle', 'Overview').row(0)).click();
    },
    // applications submenu
    clickDeployments: () => {
      return clickNestedMenuItem(by.cssContainingText('.dropdown-toggle', 'Applications'), by.cssContainingText('a', 'Deployments'));
    },
    clickPods: () => {
      return clickNestedMenuItem(by.cssContainingText('.dropdown-toggle', 'Applications'), by.cssContainingText('a', 'Pods'));
    },
    clickServices: () => {
      return clickNestedMenuItem(by.cssContainingText('.dropdown-toggle', 'Applications'), by.cssContainingText('a', 'Services'));
    },
    clickRoutes: () => {
      return clickNestedMenuItem(by.cssContainingText('.dropdown-toggle', 'Applications'), by.cssContainingText('a', 'Routes'));
    },
    // builds submenu
    clickBuilds: () => {
      return clickNestedMenuItem(by.cssContainingText('.dropdown-toggle', 'Builds'), by.cssContainingText('a', 'Builds'));
    },
    clickPipelines: () => {
      return clickNestedMenuItem(by.cssContainingText('.dropdown-toggle', 'Builds'), by.cssContainingText('a', 'Pipelines'));
    },
    clickImages: () => {
      return clickNestedMenuItem(by.cssContainingText('.dropdown-toggle', 'Builds'), by.cssContainingText('a', 'Images'));
    },
    // resources submenu
    clickQuota: () => {
      return clickNestedMenuItem(by.cssContainingText('.dropdown-toggle', 'Resources'), by.cssContainingText('a', 'Quota'));
    },
    clickMembership: () => {
      return clickNestedMenuItem(by.cssContainingText('.dropdown-toggle', 'Resources'), by.cssContainingText('a', 'Membership'));
    },
    clickConfigMaps: () => {
      return clickNestedMenuItem(by.cssContainingText('.dropdown-toggle', 'Resources'), by.cssContainingText('a', 'Config Maps'));
    },
    clickSecrets: () => {
      return clickNestedMenuItem(by.cssContainingText('.dropdown-toggle', 'Resources'), by.cssContainingText('a', 'Secrets'));
    },
    clickOtherResources: () => {
      return clickNestedMenuItem(by.cssContainingText('.dropdown-toggle', 'Resources'), by.cssContainingText('a', 'Other Resources'));
    },
    // the rest of the top lvl menu items
    clickStorage: () => {
      return element(by.cssContainingText('a', 'Storage')).click();
    },
    clickMonitoring: () => {
      return element(by.cssContainingText('a', 'Monitoring')).click();
    }
  }
};
