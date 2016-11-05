"use strict";


var gulp = require("gulp");
var plumber = require("gulp-plumber");
var less = require("gulp-less");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var mqpacker = require("css-mqpacker");
var minify = require("gulp-csso");
var imagemin = require("gulp-imagemin");
var rename = require("gulp-rename");
var svgstore = require("gulp-svgstore");
var svgmin = require("gulp-svgmin");
var server = require("browser-sync").create();
var run = require("run-sequence");
var ghPages = require("gulp-gh-pages");
var uglify = require("gulp-uglify");
var del = require("del");


gulp.task("style", function() {
  gulp.src("src/less/style.less")
    .pipe(plumber())
    .pipe(less())
    .pipe(postcss([                                                 // делаем постпроцессинг
      autoprefixer({ browsers: ["last 2 version", "IE 11"] }),     // автопрефиксирование
      mqpacker({ sort: true })                                     // объединение медиавыражений
    ]))
    .pipe(gulp.dest("build/css"))
    .pipe(minify())
    .pipe(rename("style-min.css"))
    .pipe(gulp.dest("build/css"))
    .pipe(server.stream());
});

gulp.task("minjs", function() {
  gulp.src("build/js/*.js")
    .pipe(uglify())
    .pipe(gulp.dest("build/js/minjs"));
});

gulp.task("html", function() {
  gulp.src("src/*html")
    .pipe(gulp.dest("build"));
});

gulp.task("images", function() {
  return gulp.src("build/img/**/*.{jpg, png, gif}")
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.jpegtran({progressive: true})
  ]))
  .pipe(gulp.dest("build/img"));
});

gulp.task("symbols", function() {
  return gulp.src("build/img/icons/*.svg")
  .pipe(svgmin())
  .pipe(svgstore({
    inlineSvg: true
  }))
  .pipe(rename("symbols.svg"))
  .pipe(gulp.dest("build/img"));
})

gulp.task("copy", function() {
  return gulp.src([
    "src/fonts/**/*.{woff,woff2}",
    "src/img/**",
    "src/js/**",
    "src/*.html"
  ], {
    base: "src/"
  })
  .pipe(gulp.dest("build"));
});

gulp.task("clean", function() {
  return del("build")
});

gulp.task("deploy", function() {
  return gulp.src("./build/**/*")
    .pipe(ghPages());
});

gulp.task("build", function(fn) {
  run(
    "clean",
    "copy",
    "style",
    "minjs",
    "images",
    "symbols",
    fn
  );
});

gulp.task("serve", function() {
  server.init({
    server: "build",
    notify: false,
    open: true,
    ui: false
  });

  gulp.watch("src/less/**/*.less", ["style"]);
  gulp.watch("src/js/**/*.js", ["minjs"]);
  gulp.watch("src/*.html", ["html"]).on("change", server.reload);
});
