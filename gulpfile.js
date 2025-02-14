const gulp = require('gulp');
const webpack = require('webpack-stream');
const sass = require('gulp-sass')(require('sass'));

gulp.task('webpack', () => {
  return gulp.src('assets/main.js')
    .pipe(webpack(require('./webpack.config.js')))
    .pipe(gulp.dest('assets/'));
});

gulp.task('sass', () => {
  return gulp.src('src/scss/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('assets/'));
});

gulp.task('watch', () => {
  gulp.watch('assets/js/**/*.js', gulp.series('webpack'));
  gulp.watch('assets/scss/**/*.scss', gulp.series('sass'));
});

gulp.task('default', gulp.series('webpack', 'sass', 'watch'));
