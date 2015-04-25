'use strict';
var _ = require('lodash');
var gulp = require('gulp');
var gulpJshint = require('gulp-jshint');
var gulpJasmine = require('gulp-jasmine');
var gulpIstanbul = require('gulp-istanbul');
var pathConf = {
    src: './src/**/*.js',
    specs: './specs/**/*.js',
    gulpfile: 'gulpfile.js'
};

gulp.task('jshint', function() {
    var src = _(pathConf)
        .pick('src', 'specs', 'gulpfile')
        .values()
        .value();
    return gulp.src(_.values())
        .pipe(gulpJshint())
        .pipe(gulpJshint.reporter('default'));
});

gulp.task('test', function () {
    return gulp.src(pathConf.specs)
        .pipe(gulpJasmine());
});

gulp.task('tdd', function () {
    gulp.watch(pathConf.specs, ['test']);
});

gulp.task('test-report', function (cb) {
    gulp.src(pathConf.src)
        .pipe(gulpIstanbul())
        .pipe(gulpIstanbul.hookRequire())
        .on('finish', function () {
            gulp.src(pathConf.specs)
                .pipe(gulpJasmine())
                .pipe(gulpIstanbul.writeReports())
                .on('end', cb);
        });
});
gulp.task('default', ['test', 'jshint']);