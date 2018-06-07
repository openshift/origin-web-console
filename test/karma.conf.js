// Karma configuration
// http://karma-runner.github.io/0.12/config/configuration-file.html
// Generated on 2014-09-12 using
// generator-karma 0.8.3

module.exports = function(config) {
  'use strict';

  config.set({
    // maximum boot-up time allowed for a browser to start and connect to Karma
    // a browser gets 3x chances within this timeout range to connect to Karma
    // there are other timeouts as well, consult the config file
    // docs: https://karma-runner.github.io/1.0/config/configuration-file.html
    captureTimeout: 30000,
    // enable / disable watching file and executing tests whenever any file changes
    // why set to true when we have grunt watch?
    autoWatch: false,

    // base path, that will be used to resolve files and exclude
    basePath: '../',

    // testing framework to use (jasmine/mocha/qunit/...)
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: [
      'app/config.js',
      "node_modules/jquery/dist/jquery.js",
      "node_modules/angular/angular.js",
      'node_modules/angular-mocks/angular-mocks.js',
      "node_modules/angular-schema-form/dist/schema-form.js",
      "node_modules/angular-schema-form/dist/bootstrap-decorator.js",
      "node_modules/angular-schema-form-bootstrap/bootstrap-decorator.min.js",
      "node_modules/tv4/tv4.js",
      "node_modules/objectpath/lib/ObjectPath.js",
      "node_modules/angular-resource/angular-resource.js",
      "node_modules/angular-cookies/angular-cookies.js",
      "node_modules/angular-sanitize/angular-sanitize.js",
      "node_modules/angular-animate/angular-animate.js",
      "node_modules/angular-touch/angular-touch.js",
      "node_modules/angular-route/angular-route.js",
      "node_modules/angular-ui-bootstrap/ui-bootstrap-tpls.js",
      "node_modules/angular-drag-and-drop-lists/angular-drag-and-drop-lists.js",
      "node_modules/lodash/lodash.js",
      "node_modules/bootstrap/dist/js/bootstrap.js",
      "node_modules/bootstrap-datepicker/dist/js/bootstrap-datepicker.js",
      "node_modules/bootstrap-select/dist/js/bootstrap-select.js",
      "node_modules/bootstrap-switch/dist/js/bootstrap-switch.js",
      "node_modules/bootstrap-touchspin/src/jquery.bootstrap-touchspin.js",
      "node_modules/d3/d3.js",
      "node_modules/c3/c3.js",
      "node_modules/jquery-match-height/dist/jquery.matchHeight.js",
      "node_modules/moment/moment.js",
      "node_modules/patternfly-bootstrap-combobox/js/bootstrap-combobox.js",
      "node_modules/patternfly-bootstrap-treeview/dist/bootstrap-treeview.js",
      "node_modules/patternfly/dist/js/patternfly.js",
      "node_modules/angular-patternfly/dist/angular-patternfly.js",
      "node_modules/urijs/src/URI.js",
      "node_modules/urijs/src/URITemplate.js",
      "node_modules/urijs/src/jquery.URI.js",
      "node_modules/urijs/src/URI.fragmentURI.js",
      "node_modules/js-logger/src/logger.js",
      "node_modules/sifter/sifter.js",
      "node_modules/microplugin/src/microplugin.js",
      "node_modules/selectize/dist/js/selectize.js",
      "node_modules/kubernetes-label-selector/labelSelector.js",
      "node_modules/kubernetes-label-selector/labelFilter.js",
      "node_modules/xtermjs/src/xterm.js",
      "node_modules/kubernetes-container-terminal/dist/container-terminal.js",
      "node_modules/angular-gettext/dist/angular-gettext.js",
      "node_modules/registry-image-widgets/dist/image-widgets.js",
      "node_modules/kubernetes-object-describer/dist/object-describer.js",
      "node_modules/bootstrap-hover-dropdown/bootstrap-hover-dropdown.min.js",
      "node_modules/ace-builds/src-min-noconflict/ace.js",
      "node_modules/ace-builds/src-min-noconflict/ext-searchbox.js",
      "node_modules/ace-builds/src-min-noconflict/mode-dockerfile.js",
      "node_modules/ace-builds/src-min-noconflict/mode-groovy.js",
      "node_modules/ace-builds/src-min-noconflict/mode-yaml.js",
      "node_modules/ace-builds/src-min-noconflict/theme-dreamweaver.js",
      "node_modules/ace-builds/src-min-noconflict/theme-eclipse.js",
      "node_modules/ace-builds/src-min-noconflict/mode-sh.js",
      "node_modules/angular-ui-ace/src/ui-ace.js",
      "node_modules/clipboard/dist/clipboard.js",
      "node_modules/ansi_up/ansi_up.js",
      "node_modules/angular-extension-registry/dist/angular-extension-registry.min.js",
      "node_modules/angular-extension-registry/dist/compiled-templates.js",
      "node_modules/ng-sortable/dist/ng-sortable.js",
      "node_modules/ui-select/dist/select.js",
      "node_modules/angular-inview/angular-inview.js",
      "node_modules/js-yaml/dist/js-yaml.js",
      "node_modules/angular-moment/angular-moment.js",
      "node_modules/angular-utf8-base64/angular-utf8-base64.js",
      "node_modules/file-saver/FileSaver.js",
      "node_modules/origin-web-common/dist/origin-web-common.js",
      "node_modules/origin-web-catalog/dist/vendor-bundle.js",
      "node_modules/origin-web-catalog/dist/origin-web-catalogs.js",
      'app/scripts/**/*.js',
      'app/**/*.component.js',
      'app/components/**/*.html',
      'test/spec/spec-helper.js',
      'test/spec/fixtures/api-discovery.js',
      'test/spec/filters/**/*.js',
      'test/spec/services/**/*.js',
      'test/spec/controllers/**/*.js',
      'app/**/*.spec.js',
    ],

    // list of files / patterns to exclude
    exclude: [],

    // web server port
    // port: 8443,

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - IE (only Windows)
    plugins: [
      'karma-firefox-launcher',
      'karma-chrome-launcher',
      'karma-ng-html2js-preprocessor',
      'karma-jasmine',
      'karma-coverage',
      'karma-jasmine-diff-reporter',
      'karma-junit-reporter'
    ],

    customLaunchers: {
      ChromeNoSandbox: {
        base: "Chrome",
        flags: ["--no-sandbox"]
      }
    },

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
     singleRun: false,

     colors: true,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_ERROR,

    // URL root prevent conflicts with the site root
    // urlRoot: '_karma_'

    preprocessors: {
      // source files, that you wanna generate coverage for
      // do not include tests or libraries
      // (these files will be instrumented by Istanbul)
      'app/**/*.js': ['coverage'],

      // Generate javascript modules for external templates so that they can be
      // loaded without http requests.
      'app/components/**/*.html': ['ng-html2js']
    },

    ngHtml2JsPreprocessor: {
      moduleName: 'openshiftConsoleTemplates',
      stripPrefix: 'app/'
    },

    // order of reporters matters, input/output may break
    reporters: ['jasmine-diff', 'progress', 'coverage', 'junit'],

    coverageReporter: {
      type: 'text',
      // outputs the results of coverage reporter to this dir
      dir: 'test-results/coverage/'
    },

    jasmineDiffReporter: {
      // jasmine kinda has its own diff now, but its sub-par.
      legacy: true
    },

    junitReporter: {
      // will be resolved to basePath (in the same way as files/exclude patterns)
      outputDir: 'test/junit/'
    },
  });
};
