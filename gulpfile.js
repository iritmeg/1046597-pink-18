"use strict";

var gulp = require("gulp");
var plumber = require("gulp-plumber");
var sourcemap = require("gulp-sourcemaps");
var less = require("gulp-less");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var server = require("browser-sync").create();
var csso = require("gulp-csso");
var rename =require("gulp-rename");
var imagemin =require("gulp-imagemin");
var replace =require("gulp-replace");

gulp.task("css", function () {
  return gulp.src("source/less/style.less")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(less())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("source/css"))
    .pipe(server.stream());
});

gulp.task("build-css", function() {
return gulp.src("source/less/style.less")
.pipe(less())
.pipe(postcss([
      autoprefixer()
    ]))
.pipe(csso())
.pipe(rename("style.min.css"))
.pipe(gulp.dest("build/css/"));
});


gulp.task("build-images", function(){
  return gulp.src("source/img/**/*.{svg,png,jpg}")

.pipe(imagemin([

imagemin.optipng({optimizationlevel: 3}),
imagemin.mozjpeg(),
imagemin.svgo()

]))

.pipe(gulp.dest("build/img"));

});


gulp.task("build-copy", function(){
  return gulp.src("source/**/*.{html,woff,woff2,js}")
  .pipe(replace('style.css', 'style.min.css'))
  .pipe(gulp.dest("build/"));

});




gulp.task("server", function () {
  server.init({
    server: "source/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("source/less/**/*.less", gulp.series("css"));
  gulp.watch("source/*.html").on("change", server.reload);
});

gulp.task("start", gulp.series("css", "server"));

gulp.task("build", gulp.series("build-css", "build-images", "build-copy"));
