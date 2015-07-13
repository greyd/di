'use strict';
var _ = require('lodash');
var gulp = require('gulp');
var gulpJshint = require('gulp-jshint');
var gulpJasmine = require('gulp-jasmine');
var gulpIstanbul = require('gulp-istanbul');
var gulpJscs = require('gulp-jscs');
var pathConf = {
    src: './src/**/*.js',
    specs: './specs/**/*.js',
    gulpfile: 'gulpfile.js'
};
var combinePath = combinePathFor(pathConf);

gulp.task('jshint', function () {
    var src = combinePath('src', 'specs', 'gulpfile');
    return gulp.src(src)
        .pipe(gulpJshint())
        .pipe(gulpJshint.reporter('default'));
});

gulp.task('jscs', function () {
    var src = combinePath('src', 'specs', 'gulpfile');
    return gulp.src(src)
        .pipe(gulpJscs());
});

gulp.task('lint', ['jshint', 'jscs']);

gulp.task('test', function () {
    return gulp.src(pathConf.specs)
        .pipe(gulpJasmine());
});

gulp.task('tdd', function () {
    gulp.watch(combinePath('src', 'specs'), ['test']);
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

function combinePathFor(conf) {
    return function (/* args*/) {
        return _(conf)
            .pick(arguments)
            .values()
            .value();
    };
}
