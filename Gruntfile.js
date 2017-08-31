// Generated on 2014-09-12 using generator-angular 0.9.8
'use strict';
/* jshint unused: false */

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

var modRewrite = require('connect-modrewrite');
var serveStatic = require('serve-static');

module.exports = function (grunt) {
  var contextRoot = grunt.option('contextRoot') || "dev-console";
  var isMac = /^darwin/.test(process.platform) || grunt.option('mac');

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt, {
    pattern: ['grunt-*', '!grunt-template-jasmine-istanbul']
  });

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Configurable paths for the application
  var appConfig = {
    app: require('./bower.json').appPath || 'app',
    dist: 'dist'
  };

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    yeoman: appConfig,

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      bower: {
        files: ['bower.json'],
        tasks: ['wiredep']
      },
      js: {
        files: ['<%= yeoman.app %>/scripts/{,*/}*.js'],
        tasks: ['newer:jshint:all'],
        options: {
          livereload: grunt.option('disable-live-reload') ? false : {
             key: grunt.file.read('tls/tls.key'),
             cert: grunt.file.read('tls/tls.crt')
          }
        }
      },
      jsTest: {
        files: ['test/spec/{,*/}*.js'],
        tasks: ['newer:jshint:test', 'karma']
      },
      css: {
        files: '<%= yeoman.app %>/styles/*.less',
        tasks: ['less:development']
      },
      html: {
        files: '<%= yeoman.app %>/views/{,*/}*.html',
        options: {
          livereload: grunt.option('disable-live-reload') ? false : {
            key: grunt.file.read('tls/tls.key'),
            cert: grunt.file.read('tls/tls.crt')
          }
        }
      },
      extensions: {
        files: ['extensions/extensions.js', 'extensions/extensions.css'],
        tasks: ['copy:extensions']
      },
      index: {
        files: ['<%= yeoman.app %>/index.html'],
        tasks: ['replace:index']
      },
      localConfig: {
        files: ['<%= yeoman.app %>/config.local.js'],
        tasks: ['copy:localConfig']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      livereload: {
        options: {
          livereload: grunt.option('disable-live-reload') ? false : '<%= connect.options.livereload %>'
        },
        files: [
          '<%= yeoman.app %>/{,*/}*.html',
          '.tmp/styles/{,*/}*.css',
          '.tmp/config.js',
          '.tmp/scripts/extensions.js',
          '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },

    // The actual grunt server settings
    connect: {
      options: {
        protocol: grunt.option('scheme') || 'https',
        port: grunt.option('port') || 9000,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: grunt.option('hostname') || 'localhost',
        key: grunt.file.read('tls/tls.key'),
        cert: grunt.file.read('tls/tls.crt'),
        livereload: grunt.option('disable-live-reload') ? false : 35729
      },
      livereload: {
        options: {
          open: true,
          middleware: function (connect) {
            return [
              modRewrite([
                '^/$ /' + contextRoot + '/ [R=302]',
                '^/' + contextRoot + '(.*)$ $1',
                '!^/(config.js|(java|bower_components|scripts|images|styles|views|languages)(/.*)?)$ /index.html [L]'
              ]),
              serveStatic('.tmp'),
              connect().use(
                '/java',
                serveStatic('./openshift-jvm')
              ),
              connect().use(
                '/bower_components',
                serveStatic('./bower_components')
              ),
              connect().use(
                '/languages',
                serveStatic('./languages')
              ),
              serveStatic(appConfig.app)
            ];
          }
        }
      },
      test: {
        options: {
          middleware: function (connect) {
            return [
              modRewrite([
                '^/$ /' + contextRoot + '/ [R=302]',
                '^/' + contextRoot + '(.*)$ $1',
                '!^/(config.js|(bower_components|scripts|images|styles|views)(/.*)?)$ /index.html [L]'
              ]),
              serveStatic('.tmp'),
              serveStatic('test'),
              connect().use(
                '/bower_components',
                serveStatic('./bower_components')
              ),
              serveStatic(appConfig.app)
            ];
          }
        }
      },
      dist: {
        options: {
          open: true,
          livereload: false,
          middleware: function (connect) {
            var rewriteRules = [
              '^/styles/extensions\.css$ /' + contextRoot + '/extensions/extensions.css [R]',
              '^/scripts/extensions\.js$ /' + contextRoot + '/extensions/extensions.js [R]',
              '^/$ /' + contextRoot + '/ [R=302]',
              '^/' + contextRoot + '(.*)$ $1',
              '!^/(config.js|(bower_components|scripts|images|styles|views|extensions|languages)(/.*)?)$ /index.html [L]'
            ];

            // If config.local.js exists, use that instead of config.js.
            if (grunt.file.exists('app/config.local.js')) {
              rewriteRules.unshift('^/config.js$ /config.local.js [L]');
            }

            return [
              modRewrite(rewriteRules),
              serveStatic('dist'),
              connect().use(
                '/bower_components',
                serveStatic('./bower_components')
              ),
              connect().use(
                '/extensions',
                serveStatic('./extensions')
              ),
              connect().use(
                '/languages',
                serveStatic('./languages')
              ),
              serveStatic(appConfig.app)
            ];
          }
        }
      }
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: {
        src: [
          'Gruntfile.js',
          '<%= yeoman.app %>/scripts/{,*/}*.js'
        ]
      },
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/spec/{,*/}*.js','test/integration/**/*.js']
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= yeoman.dist %>/{,*/}*',
            '!<%= yeoman.dist %>/.git*',
            '<%= yeoman.dist %>.java/{,*/}*',
            '!<%= yeoman.dist %>.java/.git*'
          ]
        }]
      },
      server: '.tmp'
    },

    // Add vendor prefixed styles
    postcss: {
      options: {
        processors: [
          require('autoprefixer')({browsers: ['last 1 version']})
        ]
      },
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,*/}*.css',
          dest: '.tmp/styles/'
        }]
      }
    },

    // Automatically inject Bower components into the app
    wiredep: {
      app: {
        src: ['<%= yeoman.app %>/index.html'],
        ignorePath:  /\.\.\//,
        exclude: [
          // choosing uri.js over urijs
          'bower_components/uri.js/src/IPv6.js',
          'bower_components/uri.js/src/SecondLevelDomains.js',
          'bower_components/uri.js/src/punycode.js',
          'bower_components/uri.js/src/URI.min.js',
          'bower_components/uri.js/src/jquery.URI.min.js',
          'bower_components/uri.js/src/URI.fragmentQuery.js',
          // bower registration error? we get 2x versions of uri.js/urijs
          'bower_components/urijs/',
          'bower_components/moment-timezone/builds/moment-timezone-with-data-2010-2020.js',
          'bower_components/fontawesome/css/font-awesome.css',
          'bower_components/bootstrap-datepicker/dist/css/bootstrap-datepicker.css',
          'bower_components/bootstrap-datepicker/dist/css/bootstrap-datepicker3.css',
          'bower_components/bootstrap-select/dist/css/bootstrap-select.css',
          'bower_components/bootstrap-switch/dist/css/bootstrap3/bootstrap-switch.css',
          'bower_components/bootstrap-treeview/dist/bootstrap-treeview.min.css',
          'bower_components/bootstrap-touchspin/src/jquery.bootstrap-touchspin.css',
          'bower_components/c3/c3.css',
          'bower_components/datatables/media/css/jquery.dataTables.css',
          'bower_components/datatables-colreorder/css/dataTables.colReorder.css',
          'bower_components/datatables-colvis/css/dataTables.colVis.css',
          'bower_components/eonasdan-bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min.js',
          'bower_components/eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.min.css',
          'bower_components/font-awesome/css/font-awesome.css',
          'bower_components/google-code-prettify/bin/prettify.min.js',
          'bower_components/google-code-prettify/bin/prettify.min.css',
          'bower_components/patternfly/dist/css/patternfly.css',
          'bower_components/patternfly/dist/css/patternfly-additions.css',
          'bower_components/patternfly-bootstrap-combobox/css/bootstrap-combobox.css',
          'bower_components/origin-web-common/dist/origin-web-common.css',
          'bower_components/origin-web-catalog/dist/origin-web-catalogs.css'
        ]
      }
    },

    less: {
      development: {
        files: {
          '.tmp/styles/main.css': '<%= yeoman.app %>/styles/main.less'
        },
        options: {
          paths: ['<%= yeoman.app %>/styles', 'bower_components/'],
          sourceMap: true,
          sourceMapFilename: '.tmp/styles/main.css.map',
          sourceMapURL: 'main.css.map',
          outputSourceFiles: true
        }
      },
      production: {
        files: {
          'dist/styles/main.css': '<%= yeoman.app %>/styles/main.less'
        },
        options: {
          cleancss: true,
          paths: ['<%= yeoman.app %>/styles', 'bower_components/']
        }
      }
    },


    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      html: '<%= yeoman.app %>/index.html',
      options: {
        dest: '<%= yeoman.dist %>',
        flow: {
          html: {
            steps: {
              js: ['concat', 'uglifyjs'],
              css: ['cssmin']
            },
            post: {
              css: [{
                name:'cssmin',
                createConfig: function(context, block) {
                  var generated = context.options.generated;
                  generated.options = {
                    keepBreaks: true,
                    compatibility: {
                      properties: {
                        zeroUnits: false
                      }
                    }
                  };
                }
              }],

              js: [{
                name:'uglify',
                createConfig: function(context, block) {
                  var generated = context.options.generated;
                  generated.options = {
                    compress: {},
                    mangle: {},
                    beautify: {
                      beautify: true,
                      indent_level: 0, // Don't waste characters indenting
                      space_colon: false, // Don't waste characters
                      width: 1000
                    },
                  };
                }
              }]
            }
          }
        }
      }
    },

    // Performs rewrites based on filerev and the useminPrepare configuration
    usemin: {
      html: ['<%= yeoman.dist %>/{,*/}*.html'],
      css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
      options: {
        assetsDirs: ['<%= yeoman.dist %>','<%= yeoman.dist %>/images']
      }
    },

    // The following *-min tasks will produce minified files in the dist folder
    // By default, your `index.html`'s <!-- Usemin block --> will take care of
    // minification. These next options are pre-configured if you do not wish
    // to use the Usemin blocks.
    // cssmin: {
    //   dist: {
    //     files: {
    //       '<%= yeoman.dist %>/styles/main.css': [
    //         '.tmp/styles/{,*/}*.css'
    //       ]
    //     }
    //   }
    // },
    // uglify: {
    //   dist: {
    //     files: {
    //       '<%= yeoman.dist %>/scripts/scripts.js': [
    //         '<%= yeoman.dist %>/scripts/scripts.js'
    //       ]
    //     }
    //   }
    // },
    // concat: {
    //   dist: {}
    // },

    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/images',
          src: '{,*/}*.{png,jpg,jpeg,gif}',
          dest: '<%= yeoman.dist %>/images'
        }]
      }
    },

    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/images',
          src: '{,*/}*.svg',
          dest: '<%= yeoman.dist %>/images'
        }]
      }
    },

    htmlhint: {
      html: {
        options: {
          'tag-pair': true,
          'attr-no-duplication': true
        },
        src: ['app/**/*.html']
      }
    },

    htmlmin: {
      dist: {
        options: {
          preserveLineBreaks: true,
          collapseWhitespace: true,
          conservativeCollapse: false,
          collapseBooleanAttributes: false,
          removeComments: true,
          removeCommentsFromCDATA: true,
          removeOptionalTags: false,
          keepClosingSlash: true
        },
        files: [{
          expand: true,
          cwd: '<%= yeoman.dist %>',
          src: ['*.html', 'views/{,*/}*.html'],
          dest: '<%= yeoman.dist %>'
        }]
      }
    },

    // ng-annotate tries to make the code safe for minification automatically
    // by using the Angular long form for dependency injection.
    ngAnnotate: {
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/concat/scripts',
          src: ['*.js', '!oldieshim.js'],
          dest: '.tmp/concat/scripts'
        }]
      }
    },

    ngtemplates: {
      dist: {
        cwd: '<%= yeoman.app %>',
        src: 'views/**/*.html',
        dest: 'dist/scripts/templates.js',
        options: {
          module: 'openshiftConsoleTemplates',
          standalone: true,
          htmlmin: '<%= htmlmin.dist.options %>'
        }
      }
    },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= yeoman.app %>',
          dest: '<%= yeoman.dist %>',
          src: [
            '*.{ico,png,txt}',
            '.htaccess',
            '*.html',
            'images/{,*/}*.{ico,png,jpg,jpeg,gif}',
            'images/{,*/}*.{webp}'
          ]
        }, {
          expand: true,
          cwd: '.tmp/images',
          dest: '<%= yeoman.dist %>/images',
          src: ['generated/*']
        }, {
          expand: true,
          cwd: 'bower_components/patternfly/dist',
          src: 'fonts/*',
          dest: '<%= yeoman.dist %>/styles'
        }, {
          expand: true,
          cwd: 'bower_components/font-awesome',
          src: 'fonts/*',
          dest: '<%= yeoman.dist %>/styles'
        },{
          expand: true,
          cwd: 'bower_components/openshift-logos-icon',
          src: 'fonts/*',
          dest: '<%= yeoman.dist %>/styles'
        },
        {
          expand: true,
          cwd: 'languages',
          src: '*.json',
          dest: '<%= yeoman.dist %>/languages'
        },
        // Copy separate components
        {
          expand: true,
          cwd: 'openshift-jvm',
          src: '**/*',
          // Copy to a separate "dist.*" directory for go-bindata
          // Make the folder structure inside the dist.* directory match the desired path
          dest: '<%= yeoman.dist %>.java/java'
        }]
      },
      styles: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/styles',
          dest: '.tmp/styles/',
          src: '{,*/}*.css'
        }, {
          expand: true,
          cwd: 'bower_components/patternfly/dist',
          src: 'fonts/*',
          dest: '.tmp/styles'
        }, {
          expand: true,
          cwd: 'bower_components/font-awesome',
          src: 'fonts/*',
          dest: '.tmp/styles'
        }, {
          expand: true,
          cwd: 'bower_components/openshift-logos-icon',
          src: 'fonts/*',
          dest: '.tmp/styles'
        }]
      },
      // Copy files in the extensions dir for development, but not distribution.
      extensions: {
        files: [{
          expand: true,
          cwd: 'extensions',
          src: 'extensions.js',
          dest: '.tmp/scripts'
        }, {
          expand: true,
          cwd: 'extensions',
          src: 'extensions.css',
          dest: '.tmp/styles'
        }]
      },
      // config.local.js is for local customizations if it exists.
      localConfig: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>',
          src: 'config.local.js',
          dest: '.tmp',
          rename: function(path, name) {
            return path + '/config.js';
          }
        }]
      }
    },

    replace: {
      index: {
        options: {
          patterns: [
            {
              match: /<base href="\/">/,
              replacement: '<base href="/' + contextRoot + '/">'
            }
          ]
        },
        files: [
          {expand: true, flatten: true, src: ['<%= yeoman.app %>/index.html'], dest: '.tmp/'}
        ]
      }
    },

    // Run some tasks in parallel to speed up the build process
    concurrent: {
      test: [
        'less:development'
      ],
      dist: [
        'less:production',
        // remove imagemin from build, since it doesn't tend to behave well cross-platform
        // 'imagemin',
        'svgmin',
        // Also do everything we do in the development build so that you can leave grunt server running while doing a build
        'development-build'
      ]
    },

    // Test settings
    karma: {
      unit: {
        configFile: 'test/karma.conf.js',
        singleRun: true,
        // default in karma.conf.js is Firefox, however, Chrome has much better
        // error messages when writing tests.  Call like this:
        // grunt test
        // grunt test --browsers=Chrome
        // grunt test --browsers=Chrome,Firefox,Safari (be sure karma-<browser_name>-launcher is installed)
        browsers: grunt.option('browsers') ?
                    grunt.option('browsers').split(',') :
                    ['Firefox']
      }
    },

    protractor: {
      options: {
        configFile: "test/protractor.conf.js", // Default config file
        keepAlive: false, // If false, the grunt process stops when the test fails.
        noColor: false, // If true, protractor will not use colors in its output.
        args: {
          // Arguments passed to the command
          suite: grunt.option('suite') || 'full',
          baseUrl: grunt.option('baseUrl') || ("https://localhost:9000/" + contextRoot + "/")
        }
      },
      default: {
        options: {
          configFile: "test/protractor.conf.js", // Target-specific config file
          args: {
            baseUrl: grunt.option('baseUrl') || ("https://localhost:9000/" + contextRoot + "/"),
            browser: grunt.option('browser') || "firefox"
          } // Target-specific arguments
        }
      },
      mac: {
        options: {
          configFile: "test/protractor-mac.conf.js", // Target-specific config file
          args: {
            baseUrl: grunt.option('baseUrl') || ("https://localhost:9000/" + contextRoot + "/"),
            browser: grunt.option('browser') || "firefox"
          } // Target-specific arguments
        }
      }
    },

    // Settings for grunt-istanbul-coverage
    // NOTE: coverage task is currently not in use
    coverage: {
      options: {
        thresholds: {
          'statements': 90,
          'branches': 90,
          'lines': 90,
          'functions': 90
        },
        dir: 'coverage',
        root: 'test'
      }
    },

    // Settings for gettext
    nggettext_extract: {
      pot: {
        files: {
          'po/openshift.pot': ['app/index.html', 'app/views/**/*.html', 'app/scripts/**/*.js']
        }
      }
    },

    nggettext_compile: {
      all: {
        options: {
          format: "json"
        },
        files: [
          {
            expand: true,
            dot: true,
            cwd: "po",
            dest: "languages",
            src: ["*.po"],
            ext: ".json"
          }
        ]
      }
    }
  });


  grunt.registerTask('development-build', [
    'less:development',
    'copy:styles',
    'copy:extensions',
    'copy:localConfig',
    'replace:index'
  ]);

  grunt.registerTask('serve', 'Compile then start a connect web server', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'wiredep',
      'development-build',
      'postcss',
      'connect:livereload',
      'watch'
    ]);
  });

  grunt.registerTask('server', 'DEPRECATED TASK. Use the "serve" task instead', function (target) {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run(['serve:' + target]);
  });

  grunt.registerTask('add-redirect-uri', "Add a redirectURI for openshift-web-console", function(target){
    var opts = {
      cmd: "oc",
      args: [
        "--server",
        (grunt.option('masterUrl') || "https://localhost:8443"),
        "patch",
        "oauthclient/openshift-web-console",
        "-p",
        '{"redirectURIs":["' + (grunt.option('baseUrl') || "https://localhost:9000/") + '"]}'
      ]
    };
    var done = this.async();
    grunt.log.writeln(opts.cmd + " " + opts.args.join(" "));
    grunt.util.spawn(opts, function(error, result, code){
      if (error) {
        grunt.log.error(error);
      } else if (code && result) {
        grunt.log.error(result);
      } else if (code) {
        grunt.log.error("unexpected exit code: " + code);
      } else {
        grunt.log.writeln(result);
      }
      done();
    });
  });

  // Loads the coverage task which enforces the minimum coverage thresholds
  grunt.loadNpmTasks('grunt-istanbul-coverage');

  grunt.loadNpmTasks('grunt-htmlhint');

  grunt.loadNpmTasks('grunt-angular-templates');

  grunt.loadNpmTasks('grunt-angular-gettext');

  // alias for compatibility to GNU autotools
  grunt.registerTask('update-pot', [
    'nggettext_extract'
  ]);

  grunt.registerTask('read-po', [
    'nggettext_compile'
  ]);

  // karma must run prior to coverage since karma will generate the coverage results
  grunt.registerTask('test', [
    'clean:server',
    'concurrent:test',
    'postcss',
    'connect:test',
    'karma'
    // 'coverage' - add back if we want to enforce coverage percentages
  ]);

  grunt.registerTask('test-integration',
    grunt.option('baseUrl') ?
    [isMac ? 'protractor:mac' : 'protractor:default'] : // if a baseUrl is defined assume we dont want to run the local grunt server
    [
      'clean:server',
      'development-build',
      'postcss',
      'connect:test',
      'add-redirect-uri',
      (isMac ? 'protractor:mac' : 'protractor:default'),
      'clean:server'
    ]
  );

  grunt.registerTask('build', [
    'clean:dist',
    'newer:jshint',
    'htmlhint',
    'wiredep',
    'useminPrepare',
    'ngtemplates',
    'concurrent:dist',
    'postcss',
    'concat',
    'ngAnnotate',
    'nggettext_compile',
    'copy:dist',
    'less',
    'cssmin',
    'uglify',
    'usemin',
    'htmlmin'
  ]);

  grunt.registerTask('default', [
    'newer:jshint',
    'test',
    'build'
  ]);
};
