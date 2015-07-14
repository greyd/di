'use strict';
var _ = require('lodash');
var plato = require('plato');
var gulp = require('gulp');
var gulpJshint = require('gulp-jshint');
var gulpJasmine = require('gulp-jasmine');
var gulpIstanbul = require('gulp-istanbul');
var gulpJscs = require('gulp-jscs');
var gulpUtil = require('gulp-util');
var pathConf = {
    src: './src/**/*.js',
    specs: './specs/**/*.js',
    gulpfile: 'gulpfile.js',
    reports: './reports',
    platoReport: './reports/plato',
    covarageReport: './reports/coverage'
};
var combinePath = combinePathFor(pathConf);

gulp.task('jshint', function () {
    var src = combinePath('src', 'specs', 'gulpfile');
    return gulp.src(src)
        .pipe(gulpJshint())
        .pipe(gulpJshint.reporter('jshint-stylish'));
});

gulp.task('jscs', function () {
    var src = combinePath('src', 'specs', 'gulpfile');
    return gulp.src(src)
        .pipe(gulpJscs())
        .on('error', handleError);
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
                .pipe(gulpIstanbul.writeReports({
                    dir: './reports/coverage',
                    reporters: ['lcov', 'json', 'text', 'text-summary']
                }))
                .on('end', cb);
        });
});
gulp.task('default', ['test', 'jshint']);

gulp.task('plato', function (cb) {
    var files = [pathConf.src, pathConf.specs, pathConf.gulpfile];
    var dest = pathConf.platoReport;
    var options = {
        title: 'Complexity of a DI'
    };
    plato.inspect(files, dest, options, function() {
        cb();
    });
});

gulp.task('report', ['plato', 'test-report']);
function combinePathFor(conf) {
    return function (/* args*/) {
        return _(conf)
            .pick(arguments)
            .values()
            .value();
    };
}

function handleError(err) {
    gulpUtil.log(gulpUtil.colors.red('JSCS Error\n'), err.message);
    this.emit('end');
}
