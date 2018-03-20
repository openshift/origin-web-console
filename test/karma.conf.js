// Karma configuration
// http://karma-runner.github.io/0.12/config/configuration-file.html
// Generated on 2014-09-12 using
// generator-karma 0.8.3

module.exports = function(config) {
  'use strict';

  config.set({
    // maximum boot-up time allowed for a browser to start and connect to Karma
    // a browser gets 3x changes within this timeout range to connect to Karma
    // there are other timeouts as well, consult the config file
    // docs: https://karma-runner.github.io/1.0/config/configuration-file.html
    captureTimeout: 3000,
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
      "bower_components/jquery/dist/jquery.js",
      "bower_components/angular/angular.js",
      'bower_components/angular-mocks/angular-mocks.js',
      "bower_components/angular-schema-form/dist/schema-form.js",
      "bower_components/angular-schema-form/dist/bootstrap-decorator.js",
      "bower_components/angular-schema-form-bootstrap/bootstrap-decorator.min.js",
      "bower_components/tv4/tv4.js",
      "bower_components/objectpath/lib/ObjectPath.js",
      "bower_components/json3/lib/json3.js",
      "bower_components/es5-shim/es5-shim.js",
      "bower_components/angular-resource/angular-resource.js",
      "bower_components/angular-cookies/angular-cookies.js",
      "bower_components/angular-sanitize/angular-sanitize.js",
      "bower_components/angular-animate/angular-animate.js",
      "bower_components/angular-touch/angular-touch.js",
      "bower_components/angular-route/angular-route.js",
      "bower_components/angular-bootstrap/ui-bootstrap-tpls.js",
      "bower_components/angular-drag-and-drop-lists/angular-drag-and-drop-lists.js",
      "bower_components/lodash/lodash.js",
      "bower_components/bootstrap/dist/js/bootstrap.js",
      "bower_components/bootstrap-datepicker/dist/js/bootstrap-datepicker.min.js",
      "bower_components/bootstrap-select/dist/js/bootstrap-select.js",
      "bower_components/bootstrap-switch/dist/js/bootstrap-switch.js",
      "bower_components/bootstrap-touchspin/src/jquery.bootstrap-touchspin.js",
      "bower_components/d3/d3.js",
      "bower_components/c3/c3.js",
      "bower_components/datatables/media/js/jquery.dataTables.js",
      "bower_components/datatables-colreorder/js/dataTables.colReorder.js",
      "bower_components/datatables-colvis/js/dataTables.colVis.js",
      "bower_components/matchHeight/dist/jquery.matchHeight.js",
      "bower_components/moment/moment.js",
      "bower_components/patternfly-bootstrap-combobox/js/bootstrap-combobox.js",
      "bower_components/patternfly-bootstrap-treeview/dist/bootstrap-treeview.min.js",
      "bower_components/patternfly/dist/js/patternfly.js",
      "bower_components/angular-patternfly/dist/angular-patternfly.js",
      "bower_components/uri.js/src/URI.js",
      "bower_components/uri.js/src/URITemplate.js",
      "bower_components/uri.js/src/jquery.URI.js",
      "bower_components/uri.js/src/URI.fragmentURI.js",
      "bower_components/js-logger/src/logger.js",
      "bower_components/sifter/sifter.js",
      "bower_components/microplugin/src/microplugin.js",
      "bower_components/selectize/dist/js/selectize.js",
      "bower_components/kubernetes-label-selector/labelSelector.js",
      "bower_components/kubernetes-label-selector/labelFilter.js",
      "bower_components/term.js/src/term.js",
      "bower_components/kubernetes-container-terminal/dist/container-terminal.js",
      "bower_components/angular-gettext/dist/angular-gettext.js",
      "bower_components/registry-image-widgets/dist/image-widgets.js",
      "bower_components/kubernetes-object-describer/dist/object-describer.js",
      "bower_components/bootstrap-hover-dropdown/bootstrap-hover-dropdown.min.js",
      "bower_components/ace-builds/src-min-noconflict/ace.js",
      "bower_components/ace-builds/src-min-noconflict/ext-searchbox.js",
      "bower_components/ace-builds/src-min-noconflict/mode-dockerfile.js",
      "bower_components/ace-builds/src-min-noconflict/mode-groovy.js",
      "bower_components/ace-builds/src-min-noconflict/mode-yaml.js",
      "bower_components/ace-builds/src-min-noconflict/theme-dreamweaver.js",
      "bower_components/ace-builds/src-min-noconflict/theme-eclipse.js",
      "bower_components/ace-builds/src-min-noconflict/mode-sh.js",
      "bower_components/angular-ui-ace/ui-ace.js",
      "bower_components/clipboard/dist/clipboard.js",
      "bower_components/ansi_up/ansi_up.js",
      "bower_components/angular-extension-registry/dist/angular-extension-registry.min.js",
      "bower_components/angular-extension-registry/dist/compiled-templates.js",
      "bower_components/ng-sortable/dist/ng-sortable.js",
      "bower_components/ui-select/dist/select.js",
      "bower_components/angular-inview/angular-inview.js",
      "bower_components/js-yaml/dist/js-yaml.js",
      "bower_components/angular-moment/angular-moment.js",
      "bower_components/angular-utf8-base64/angular-utf8-base64.js",
      "bower_components/file-saver/FileSaver.js",
      "bower_components/origin-web-common/dist/origin-web-common.js",
      "bower_components/origin-web-catalog/dist/vendor-bundle.js",
      "bower_components/origin-web-catalog/dist/origin-web-catalogs.js",
      'app/scripts/**/*.js',
      'app/**/*.component.js',
      'app/components/**/*.html',
      //'test/mock/**/*.js',
      'test/spec/spec-helper.js',
      'test/spec/fixtures/api-discovery.js',
      'test/spec/**/*.js',
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
    // - PhantomJS
    // - IE (only Windows)
    plugins: [
      'karma-firefox-launcher',
      'karma-chrome-launcher',
      'karma-phantomjs-launcher',
      'karma-nightmare',
      'karma-ng-html2js-preprocessor',
      'karma-jasmine',
      'karma-coverage',
      'karma-jasmine-diff-reporter',
      'karma-junit-reporter'
    ],

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

    nightmareOptions: {
      width: 1048,
      height: 600,
      show: false,
    }

  });
};
