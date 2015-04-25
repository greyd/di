'use strict';
var gulp = require('gulp');
var gulpJshint = require('gulp-jshint');
var gulpJasmine = require('gulp-jasmine');
var gulpIstanbul = require('gulp-istanbul');

gulp.task('jshint', function() {
    return gulp.src(['./{specs, src}/*.js', 'gulpfile.js'])
        .pipe(gulpJshint())
        .pipe(gulpJshint.reporter('default'));
});

gulp.task('test', function (cb) {
    gulp.src(['src/**/*.js'])
        .pipe(gulpIstanbul())
        .pipe(gulpIstanbul.hookRequire())
        .on('finish', function () {
            gulp.src(['specs/*.js'])
                .pipe(gulpJasmine())
                .pipe(gulpIstanbul.writeReports())
                .on('end', cb);
        });
});
gulp.task('default', ['test', 'jshint']);