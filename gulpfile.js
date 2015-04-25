var istanbul = require('gulp-istanbul');
var jasmine = require('gulp-jasmine');
var gulp = require('gulp');


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