// Generated on 2015-01-01 using
// generator-webapp 0.5.1
(function () {
  "use strict";
})();

// # Globbing
// for performance reasons we're only matching one level down:
// "test/spec/{,*/}*.js"
// If you want to recursively match all subfolders, use:
// "test/spec/**/*.js"

module.exports = function (grunt) {

  // Time how long tasks take. Can help when optimizing build times
  require("time-grunt")(grunt);

  // Load grunt tasks automatically
  require("load-grunt-tasks")(grunt);

  var connectProxyUtils = require("grunt-connect-proxy/lib/utils");

  // Configurable paths
  var config = {
    app: "app",
    dist: "dist"
  };

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    config: config,

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      bower: {
        files: ["bower.json"],
        tasks: ["wiredep"]
      },
      js: {
        files: ["<%= config.app %>/scripts/{,*/}*.js"],
        tasks: ["jshint"],
        options: {
          livereload: true
        }
      },
      jstest: {
        files: ["test/spec/{,*/}*.js"],
        tasks: ["test:watch"]
      },
      gruntfile: {
        files: ["Gruntfile.js"]
      },
      sass: {
        files: ["<%= config.app %>/styles/{,*/}*.{scss,sass}"],
        tasks: ["sass:server", "autoprefixer"]
      },
      styles: {
        files: ["<%= config.app %>/styles/{,*/}*.css"],
        tasks: ["newer:copy:styles", "autoprefixer"]
      },
      livereload: {
        options: {
          livereload: "<%= connect.options.livereload %>"
        },
				files: [
          "<%= config.app %>/{,*/}*.html",
          ".tmp/styles/{,*/}*.css",
          "<%= config.app %>/images/{,*/}*"
        ]
      }
    },

    // The actual grunt server settings
    connect: {
      options: {
        port: 9000,
        open: true,
        // debug: true,
        livereload: 35729,
        // Change this to "0.0.0.0" to access the server from outside
        hostname: "natalia.dns4e.local"
      },
      // TODO This is a temporary measure
      // to be able to use photos currently available on the
      // production site
      proxies: [
        {
          context: "/photo",
          host: "natalia.dns4e.net",
          port: 80
        },
        {
          context: "/thumbnail",
          host: "natalia.dns4e.net",
          port: 80
        }
      ],
      livereload: {
        options: {
          middleware: function(connect) {
            return [
              connect.static(".tmp"),
              connect().use("/bower_components", connect.static("./bower_components")),
              connect.static(config.app),
              connectProxyUtils.proxyRequest
            ];
          }
        }
      },
      test: {
        options: {
          open: false,
          hostname: "localhost",
          port: 9001,
          middleware: function(connect) {
            return [
              connect.static(".tmp"),
              connect.static("test"),
              connect().use("/bower_components", connect.static("./bower_components")),
              connect.static(config.app)
            ];
          }
        }
      },
      dist: {
        options: {
          base: "<%= config.dist %>",
          livereload: false
        }
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            ".tmp",
            "<%= config.dist %>/*",
            "!<%= config.dist %>/.git*"
          ]
        }]
      },
      server: ".tmp"
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: ".jshintrc",
        reporter: require("jshint-stylish")
      },
      all: [
        "Gruntfile.js",
        "<%= config.app %>/scripts/{,*/}*.js",
        "!<%= config.app %>/scripts/vendor/*",
        "test/spec/{,*/}*.js"
      ]
    },

    // Mocha testing framework configuration options
    mocha: {
      all: {
        options: {
          run: true,
          urls: ["http://<%= connect.test.options.hostname %>:<%= connect.test.options.port %>/index.html"]
        }
      }
    },

    // Compiles Sass to CSS and generates necessary files if requested
    sass: {
      options: {
        sourceMap: true,
        includePaths: ["bower_components"]
      },
      dist: {
        files: [{
          expand: true,
          cwd: "<%= config.app %>/styles",
          src: ["*.{scss,sass}"],
          dest: ".tmp/styles",
          ext: ".css"
        }]
      },
      server: {
        files: [{
          expand: true,
          cwd: "<%= config.app %>/styles",
          src: ["*.{scss,sass}"],
          dest: ".tmp/styles",
          ext: ".css"
        }]
      }
    },

    // Add vendor prefixed styles
    autoprefixer: {
      options: {
        browsers: ["> 1%", "last 2 versions", "Firefox ESR", "Opera 12.1"]
      },
      dist: {
        files: [{
          expand: true,
          cwd: ".tmp/styles/",
          src: "{,*/}*.css",
          dest: ".tmp/styles/"
        }]
      }
    },

    // Automatically inject Bower components into the HTML file
    wiredep: {
      app: {
        ignorePath: /^\/|\.\.\//,
        src: ["<%= config.app %>/index.html"]
      },
      sass: {
        src: ["<%= config.app %>/styles/{,*/}*.{scss,sass}"],
        ignorePath: /(\.\.\/){1,2}bower_components\//
      }
    },

    // Renames files for browser caching purposes
    rev: {
      dist: {
        files: {
          src: [
            "<%= config.dist %>/scripts/{,*/}*.js",
            "<%= config.dist %>/styles/{,*/}*.css",
            "<%= config.dist %>/images/{,*/}*.*",
            "<%= config.dist %>/styles/fonts/{,*/}*.*",
            "<%= config.dist %>/*.{ico,png}",
            "!<%= config.dist %>/images/swipebox/{,*/}*.*"
          ]
        }
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      options: {
        dest: "<%= config.dist %>"
      },
      html: "<%= config.app %>/index.html"
    },

    // Performs rewrites based on rev and the useminPrepare configuration
    usemin: {
      options: {
        assetsDirs: [
          "<%= config.dist %>",
          "<%= config.dist %>/images",
          "<%= config.dist %>/styles"
        ]
      },
      html: ["<%= config.dist %>/{,*/}*.html"],
      css: ["<%= config.dist %>/styles/{,*/}*.css"]
    },

    // The following *-min tasks produce minified files in the dist folder
    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: "<%= config.app %>/images",
          src: "{,*/}*.{gif,jpeg,jpg,png}",
          dest: "<%= config.dist %>/images"
        }]
      }
    },

    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: "<%= config.app %>/images",
          src: "{,*/}*.svg",
          dest: "<%= config.dist %>/images"
        }]
      }
    },

    htmlmin: {
      dist: {
        options: {
          collapseBooleanAttributes: true,
          collapseWhitespace: true,
          conservativeCollapse: true,
          removeAttributeQuotes: false,
          removeCommentsFromCDATA: true,
          removeEmptyAttributes: true,
          removeOptionalTags: true,
          removeRedundantAttributes: true,
          useShortDoctype: true
        },
        files: [{
          expand: true,
          cwd: "<%= config.dist %>",
          src: "{,*/}*.html",
          dest: "<%= config.dist %>"
        }]
      }
    },

    // By default, your `index.html`'s <!-- Usemin block --> will take care
    // of minification. These next options are pre-configured if you do not
    // wish to use the Usemin blocks.
    // cssmin: {
    //   dist: {
    //     files: {
    //       "<%= config.dist %>/styles/main.css": [
    //         ".tmp/styles/{,*/}*.css",
    //         "<%= config.app %>/styles/{,*/}*.css"
    //       ]
    //     }
    //   }
    // },
    // uglify: {
    //   dist: {
    //     files: {
    //       "<%= config.dist %>/scripts/scripts.js": [
    //         "<%= config.dist %>/scripts/scripts.js"
    //       ]
    //     }
    //   }
    // },
    // concat: {
    //   dist: {}
    // },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: "<%= config.app %>",
          dest: "<%= config.dist %>",
          src: [
            "*.{ico,png,txt}",
            "images/{,*/}*.webp",
            "{,*/}*.html",
            "styles/fonts/{,*/}*.*"
          ]
        }, {
          src: "node_modules/apache-server-configs/dist/.htaccess",
          dest: "<%= config.dist %>/.htaccess"
        }]
      },
      styles: {
        expand: true,
        dot: true,
        cwd: "<%= config.app %>/styles",
        dest: ".tmp/styles/",
        src: "{,*/}*.css"
      },
      distSwipeboxImages: {
        files: [{
          expand: true,
          flatten: true,
          src: "bower_components/swipebox/src/img/*.{svg,png,gif}",
          dest: "<%= config.dist %>/images/swipebox/"
        }]
      },
      distSwipeboxImagePaths: {
        options: {
          process: function(content, srcPath) {
            return content.replace(/\.\.\/img/g, "/images/swipebox");
          }
        },
        files: [{
          expand: true,
          flatten: true,
          src: "<%= config.dist %>/styles/vendor.css",
          dest: "<%= config.dist %>/styles/"
        }]
      }
    },

    manifest: {
      generate: {
        options: {
          basePath: "<%= config.dist %>",
//          cache: ["js/app.js", "css/style.css"],
          network: ["http://*", "https://*"],
          fallback: ["/ /offline.html"],
          exclude: ["offline.html"],
          preferOnline: true,
          verbose: true,
          timestamp: true,
          hash: true,
          master: ["index.html"]
        },
        src: [
          "*.html",
            "scripts/*.js",
            "styles/*.css",
            "images/*.png",
            "templates/*.html"
        ],
        dest: "<%= config.dist %>/gallery.appcache"
      }
    },

    bump: {
      options: {
        files: ["package.json"],
        updateConfigs: [],
        commit: true,
        commitMessage: "Release v%VERSION%",
        commitFiles: ["package.json"],
        createTag: true,
        tagName: "v%VERSION%",
        tagMessage: "Version %VERSION%",
        push: false,
        pushTo: "upstream",
        gitDescribeOptions: "--tags --always --abbrev=1 --dirty=-d",
        globalReplace: false
      }
    },

    // Run some tasks in parallel to speed up build process
    concurrent: {
      server: [
        "sass:server",
        "copy:styles"
      ],
      test: [
        "copy:styles"
      ],
      dist: [
        "sass",       // cp .scss from app/ to .tmp/
        "copy:styles",// cp CSS from app/ to .tmp/
                      // files seem to be ignored from then on!
        "imagemin",   // cp imgs from app/images/ to dist/
        "svgmin"
      ]
    }
  });


  grunt.registerTask("distSwipebox", [
    "copy:distSwipeboxImages",
    "copy:distSwipeboxImagePaths"
  ]);

  grunt.registerTask("serve", "start the server and preview your app, --allow-remote for remote access", function (target) {
    if (grunt.option("allow-remote")) {
      grunt.config.set("connect.options.hostname", "0.0.0.0");
    }
    if (target === "dist") {
      return grunt.task.run(["build", "connect:dist:keepalive"]);
    }

    grunt.task.run([
      "clean:server",
      "wiredep",
      "concurrent:server",
      "autoprefixer",
      "configureProxies:server",
      "connect:livereload",
      "watch"
    ]);
  });

  grunt.registerTask("server", function (target) {
    grunt.log.warn("The `server` task has been deprecated. Use `grunt serve` to start a server.");
    grunt.task.run([target ? ("serve:" + target) : "serve"]);
  });

  grunt.registerTask("test", function (target) {
    if (target !== "watch") {
      grunt.task.run([
        "clean:server",
        "concurrent:test",
        "autoprefixer"
      ]);
    }

    grunt.task.run([
      "connect:test",
      "mocha"
    ]);
  });

  grunt.registerTask("build", [
    "clean:dist",
    "wiredep",
    "useminPrepare",
    "concurrent:dist",
    "autoprefixer",
    "concat", // Task generated by usemin
              // Based on contents on index.htmll,
              // not filesystem directory contents
    "cssmin", // Task generated by usemin
    "uglify", // Task generated by usemin
    "copy:dist",
    "distSwipebox",
    "rev",
    "usemin",
    "htmlmin"
  ]);

  grunt.registerTask("default", [
    "newer:jshint",
    "test",
    "build"
  ]);
};
