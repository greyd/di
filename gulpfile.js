var gulp = require('gulp');
var jshint = require('gulp-jshint');
var jasmine = require('gulp-jasmine');
var istanbul = require('gulp-istanbul');

gulp.task('jshint', function() {
    return gulp.src(['./{specs, src}/*.js', 'gulpfile'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('test', function (cb) {
    gulp.src(['src/**/*.js'])
        .pipe(istanbul())
        .pipe(istanbul.hookRequire())
        .on('finish', function () {
            gulp.src(['specs/*.js'])
                .pipe(jasmine())
                .pipe(istanbul.writeReports())
                .on('end', cb);
        });
});
gulp.task('default', ['test']);