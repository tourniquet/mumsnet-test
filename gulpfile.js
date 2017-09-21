const gulp = require('gulp')
const concat = require('gulp-concat')
const sass = require('gulp-sass')
const uglifycss = require('gulp-uglifycss')
const uglifyjs = require('gulp-uglify')
// const jshint = require('gulp-jshint')
const imagemin = require('gulp-imagemin')
const browsersync = require('browser-sync')
const beeper = require('beeper')
const plumber = require('gulp-plumber')
// const sourcemaps = require('gulp-sourcemaps')
const babel = require('gulp-babel')

const onError = err => {
  beeper()
  console.log(err)
}

// SASS task
const scssFiles = ['dev/styles/*.scss', 'dev/styles/modules/*.scss']
gulp.task('scss', () => {
  gulp
    .src(scssFiles)
    .pipe(sass())
    .pipe(concat('styles.css'))
    // .pipe(uglifycss())
    .pipe(gulp.dest('dev/css'))
})

// Styles task
const cssFiles = ['dev/css/bootstrap.css', 'dev/css/normalize.css', 'dev/css/*.css']
gulp.task('styles', () => {
  gulp
    .src(cssFiles)
    .pipe(plumber({ errorHandler: onError }))
    .pipe(concat('styles.css'))
    .pipe(uglifycss())
    .pipe(gulp.dest('dist'))
})

// JS libs task
// const libs = ['dev/js/jquery.js', 'dev/js/*.js']
// gulp.task('libs', () => {
//   gulp
//     .src(libs)
//     .pipe(plumber({ errorHandler: onError }))
//     .pipe(concat('libs.js'))
//     .pipe(uglifyjs())
//     .pipe(gulp.dest('dist'))
// })

// Scripts task
const js = ['dev/js/jquery.js', 'dev/js/*.js']
gulp.task('scripts', () => {
  gulp
    .src(js)
    .pipe(plumber({ errorHandler: onError }))
    // .pipe(sourcemaps.init())
    // .pipe(jshint())
    // .pipe(jshint.reporter('default'))
    .pipe(babel({ presets: ['es2015'] }))
    .pipe(concat('all.js'))
    .pipe(uglifyjs())
    // .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist'))
})

// Images task
gulp.task('images', () => {
  gulp
    .src('dev/img/*')
    .pipe(imagemin())
    .pipe(gulp.dest('dist/img'))
})

// Browser Sync task
gulp.task('browsersync', cb => {
  browsersync({
    server: {
      baseDir: './'
    }
  }, cb)
})

// Watch task
gulp.task('watch', () => {
  gulp.watch(['dev/styles/*.scss', 'dev/styles/modules/*.scss'], ['scss', browsersync.reload])
  gulp.watch('dev/css/*.css', ['styles', browsersync.reload])
  // gulp.watch('dev/libs/*.js', ['libs', browsersync.reload])
  gulp.watch('dev/js/*.js', ['scripts', browsersync.reload])
  gulp.watch('dev/img/*', ['images', browsersync.reload])
})

// Default task
gulp.task('default', ['scss', 'styles', 'scripts', 'images', 'browsersync', 'watch'])
