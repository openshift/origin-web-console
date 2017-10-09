'use strict';

let isMac = /^darwin/.test(process.platform);
let SpecReporter = require('jasmine-spec-reporter').SpecReporter;
let HtmlScreenshotReporter = require('protractor-jasmine2-screenshot-reporter');

let screenshotReporter = new HtmlScreenshotReporter({
  cleanDestination: isMac ? true : false,
  dest: './test/tmp/screenshots',
  filename: 'protractor-e2e-report.html',
  takeScreenShotsOnlyForFailedSpecs: true,
  pathBuilder: function(currentSpec, suites, browserCapabilities) {
   return browserCapabilities.get('browserName') + '/' + currentSpec.fullName;
  }
});

// https://github.com/angular/protractor/blob/master/docs/browser-setup.md
exports.config = {
  // TODO: define if we want to nail down exact driver versions:
  // chromeDriver: '',  // https://sites.google.com/a/chromium.org/chromedriver/downloads
  // geckoDriver: '',   // https://github.com/mozilla/geckodriver/releases
  //
  // usage:
  //   grunt test-e2e
  //   grunt test-integration
  // single suite:
  //   grunt test-integration --suite=create-project
  // set of suites:
  //   grunt test-integration --suite=create-projct,add-template-to-project
  suites: {
    'create-project': 'integration/features/user_creates_project.spec.js', 
    'add-to-project': 'integration/features/user_adds_to_project_from_catalog.spec.js',
    'add-template-to-project': 'integration/features/user_adds_template_to_project.spec.js',
    'add-imagestream-to-project': 'integration/features/user_adds_imagestream_to_project.spec.js',
    'create-from-url': 'integration/features/user_creates_from_url.spec.js',
    // simple test to ensure we can get past OAuth
    'login': 'integration/features/user_logs_in.spec.js'
  },
  framework: 'jasmine2',
  allScriptsTimeout: 30 * 1000,
  getPageTimeout: 30 * 1000,
  jasmineNodeOpts: {
    defaultTimeoutInterval: 60 * 1000,
    isVerbose: true,
    includeStackTrace: true,
    showColors: true,
    // noop to eliminate the dot reporter, since we have
    // better reporters. see onPrepare below
    print: function() {}
  },
  capabilities: {
    'browserName': 'chrome',
  },
  // TODO: `grunt test-integration` task config overrides multiCapabilties,
  // ideally we would use this to test multiple browsers at once.
  // multiCapabilities: [
  //   // {'browserName': 'firefox'},
  //   // {'browserName': 'chrome'}
  //   // {'browserName': 'phantomjs'}
  // ],
  onPrepare: function() {
    jasmine.getEnv().addReporter(screenshotReporter);

    jasmine.getEnv().addReporter(new SpecReporter({
      displayStacktrace: true,
      displaySuccessfulSpec: false,
      displayFailedSpec: true
    }));
  },
  beforeLaunch: function() {
    // this should force the screenshot reporter to take a screenshot
    // if an exception is thrown from within a test that isn't a test error
    // https://github.com/mlison/protractor-jasmine2-screenshot-reporter#tips--tricks
    process.on('uncaughtException', function () {
      screenshotReporter.jasmineDone();
      screenshotReporter.afterLaunch();
    });
  }
};
