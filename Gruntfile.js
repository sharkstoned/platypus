module.exports = function(grunt) {
  require("load-grunt-tasks")(grunt);

  grunt.initConfig({
    sass: {
      style: {
        files: {
          "build/css/style.css": "sass/style.scss"
        }
      }
    },

    postcss: {
      style: {
        options: {
          processors: [
            require("autoprefixer")({browsers: [
              "last 1 version",
              "last 2 Chrome versions",
              "last 2 Firefox versions",
              "last 2 Opera versions",
              "last 2 Edge versions",
              "IE 11"
            ]})
          ]
        },
        src: "build/css/*.css"
      }
    },

    browserSync: {
      server: {
        bsFiles: {
          src: [
            "build/*.html",
            "build/css/*.css"
          ]
        },
        options: {
          server: "build",
          watchTask: true,
          notify: false,
          open: true,
          ui: false
        }
      }
    },

    watch: {
      html: {
        files: ["*.html"],
        tasks: ["copy:html"]
      },
      style: {
        files: ["src/sass/**/*.{scss,sass}"],
        tasks: ["sass", "postcss", "csso"],
        options: {
          spawn: false
        }
      }
    },

    csso: {
      style: {
        options: {
          report: "gzip"
        },
        files: {
          "build/css/style-min.css" : ["build/css/style.css"]
        }
      }
    },

    imagemin: {
      images: {
        options: {
          optimizationLevel: 3
        },
        files: [{
          expand: true,
          src: ["build/img/**/*.{img,jpg,gif}"]
        }]
      }
    },

    svgstore: {
      options: {
        svg: {
          style: "display: none"
        }
      },
      symbols: {
        files: {
          "build/img/symbols.svg" : ["img/icons/*.svg"]
        }
      }
    },

    svgmin: {
      symbols: {
        files: [{
          expand: true,
          src: ["build/img/icons/*.svg"]
        }]
      }
    },

    copy: {
      build: {
        files: [{
          expand: true,
          src: [
            "src/fonts/**/*.{woff,woff2}",
            "src/img/**",
            "src/js/**",
            "src/*.html"
          ],
          dest: "build"
        }]
      },
      html: {
        files: [{
          expand: true,
          src: ["*.html"],
          dest: "build"
       }]
      }
    },

    clean: {
      build: ["build"]
    },
    uglify: {
      my_target: {
        files: [{
          expand: true,
          src: "build/js/*.js",
          dest: "",
          ext: "-min.js"
        }]
      }
    }
  });

  grunt.registerTask("symbols", ["svgmin", "svgstore"]);
  grunt.registerTask("serve", ["browserSync", "watch"]);

  grunt.registerTask("build", [
    "clean",
    "copy",
    "sass",
    "postcss",
    "csso",
    "symbols",
    "uglify",
    "imagemin",
  ]);
};
